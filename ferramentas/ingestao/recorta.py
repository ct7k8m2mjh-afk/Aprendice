"""Recorte (sem IA): um print fiel por questão, direto do PDF oficial, + texto para acessibilidade e busca.

Uso:  python3 ferramentas/ingestao/recorta.py <prova-id> [--amostra]
Lê a configuração em ferramentas/ingestao/provas.py, os PDFs em fabrica_saida/ingestao/<prova-id>/
e grava em app/conteudo-fonte/provas/<prova-id>/ :
  prova.json       metadados, fonte, e por questão: n, área, gabarito oficial, páginas, texto
  q/<n>.webp       print da questão (texto de apoio compartilhado incluído quando houver)
Nada é redigitado: o print é a página original renderizada; o texto vem da camada de texto do PDF.

Como funciona: cada caderno é lido em ordem de leitura (página, coluna, altura). Âncoras marcam o início
de cada questão ("Questão 07", "{07}", "07 -", ...). Uma questão vai da sua âncora até o próximo evento
(outra âncora, um corte como cabeçalho de seção, ou o fim do enunciado no caderno comentado), podendo
atravessar colunas e páginas; os pedaços são empilhados num print só.
"""
import json, os, re, sys, hashlib, unicodedata
from io import BytesIO
from pathlib import Path

import pymupdf
from PIL import Image, ImageChops

sys.path.insert(0, str(Path(__file__).parent))
from provas import PROVAS  # noqa: E402
from transcreve import transcreve  # noqa: E402

RAIZ = Path(__file__).resolve().parents[2]
ENTRADA = RAIZ / 'fabrica_saida' / 'ingestao'
SAIDA = RAIZ / 'app' / 'conteudo-fonte' / 'provas'
DPI = 150
LARG_MAX = 1000  # px do print final


_OCR = {}          # id(documento) -> {página: textpage OCR}, para cadernos publicados só como imagem
os.environ.setdefault('TESSDATA_PREFIX', '/usr/share/tesseract-ocr/5/tessdata')


class _OcrPagina:
    """Resultado do OCR de uma página (blocos/linhas/spans), guardado em disco para não refazer o OCR a cada rodada."""
    def __init__(self, blocos):
        self.blocos = blocos

    def get_text(self, tipo, textpage=None):
        return {'blocks': self.blocos}


def textpage(pagina):
    """(objeto com get_text('dict'), None) para página de caderno sem camada de texto: OCR com cache em disco."""
    docs = _OCR.get(id(pagina.parent))
    if docs is None:
        return None
    if pagina.number not in docs:
        cache_dir = os.environ.get('OCR_CACHE')
        arq = None
        if cache_dir:
            chave = hashlib.sha1(f"{pagina.parent.name}:{pagina.number}:220".encode()).hexdigest()
            arq = Path(cache_dir) / f'{chave}.json'
        if arq and arq.exists():
            blocos = json.loads(arq.read_text())
        else:
            tp = pagina.get_textpage_ocr(language='por', dpi=220, full=True)
            blocos = [{'lines': [{'bbox': list(l['bbox']), 'spans': [{'text': sp['text']} for sp in l['spans']]}
                                 for l in b.get('lines', [])]} for b in pagina.get_text('dict', textpage=tp)['blocks']]
            if arq:
                arq.parent.mkdir(parents=True, exist_ok=True)
                arq.write_text(json.dumps(blocos, ensure_ascii=False))
        docs[pagina.number] = (_OcrPagina(blocos), None)
    return docs[pagina.number]


_OCR_SO_TEXTO = set()   # id(documento): âncoras e colunas pela camada de texto do PDF; só o texto da questão por OCR


_cache_linhas = {}


def linhas(pagina):
    k = (id(pagina.parent), pagina.number)
    if k in _cache_linhas and _cache_linhas[k][0] is pagina.parent:
        return _cache_linhas[k][1]
    out = _linhas(pagina)
    _cache_linhas[k] = (pagina.parent, out)
    return out


_LATEX = {'˜': '\u0303', '´': '\u0301', '`': '\u0300', 'ˆ': '\u0302'}


def acentos_latex(t):
    """Cadernos feitos em LaTeX trazem o acento solto antes da letra ("quest˜ao", "´e", "QUEST ˜AO") e a cedilha depois
    ("c¸"): junta de volta para a busca das âncoras e o texto."""
    t = re.sub(r'([˜´`ˆ])\s?([A-Za-z])', lambda m: unicodedata.normalize('NFC', m.group(2) + _LATEX[m.group(1)]), t)
    t = re.sub(r'(\S)\s(?=[ÃÕÁÉÍÓÚÂÊÔãõáéíóúâêô])', lambda m: m.group(1) if m.group(1).isupper() else m.group(0), t) if 'QUEST ' in t else t
    t = re.sub(r'([cC])¸\s?', lambda m: 'ç' if m.group(1) == 'c' else 'Ç', t)
    return t


def _linhas(pagina):
    out = []
    par = None if id(pagina.parent) in _OCR_SO_TEXTO else textpage(pagina)
    blocos = par[0].get_text('dict', textpage=par[1])['blocks'] if par else pagina.get_text('dict')['blocks']
    for b in blocos:
        for l in b.get('lines', []):
            # NFC: alguns cadernos escrevem "Ã" como "A" + til combinante
            t = unicodedata.normalize('NFC', ''.join(s['text'] for s in l['spans'])).replace('\xa0', ' ').strip()
            if t and re.search(r'[˜´`ˆ¸]', t):
                t = acentos_latex(t)
            if t:
                sp0 = next((sp for sp in l['spans'] if sp['text'].strip()), {})
                neg = bool(sp0.get('flags', 0) & 16) or bool(re.search(r'(?i)bold|black|heavy', sp0.get('font', '')))
                out.append({'bbox': l['bbox'], 't': t, 'neg': neg, 's0': unicodedata.normalize('NFC', sp0.get('text', '')).strip()})
    # "questão" e o número em linhas separadas, lado a lado (cadernos recentes da Vunesp): uma linha só
    for L in out:
        if re.fullmatch(r'(?i)quest[ãa]o', L['t']):
            for M in out:
                if re.fullmatch(r'\d{1,3}', M['t']) and abs(M['bbox'][1] - L['bbox'][1]) < 3 and 0 <= M['bbox'][0] - L['bbox'][2] < 20:
                    L['t'] = L['t'] + ' ' + M['t']
                    L['bbox'] = (L['bbox'][0], min(L['bbox'][1], M['bbox'][1]), M['bbox'][2], max(L['bbox'][3], M['bbox'][3]))
                    M['t'] = ''
                    break
    return [L for L in out if L['t']]


_cache_cols = {}


def colunas_da_pagina(pg, cfg):
    """Colunas da página. 'auto': uma coluna se muitas linhas atravessam o meio, senão duas."""
    k = (id(pg.parent), pg.number)
    if k in _cache_cols:
        return _cache_cols[k]
    c = cfg['colunas']
    if pg.number + 1 in cfg.get('uma_coluna', ()):   # página de uma questão só, em largura total
        m = cfg.get('margem', 15)
        c = [(m, pg.rect.width - m)]
    elif c == 'auto':
        w = pg.rect.width
        meio = w / 2
        ls = [l for l in linhas(pg) if cfg['topo'] <= l['bbox'][1] and l['bbox'][3] <= pg.rect.height - cfg['base'] and len(l['t']) > 12]
        cruzam = sum(1 for l in ls if l['bbox'][0] < meio - 25 and l['bbox'][2] > meio + 25)
        # questão começando na metade direita = página em duas colunas, com certeza
        ancora_direita = any(re.match(cfg['ancora'], l['t']) and meio - 8 <= l['bbox'][0] <= meio + 45 for l in ls + linhas(pg))
        m = cfg.get('margem', 15)
        um = ls and cruzam / len(ls) > 0.2 and not ancora_direita
        d_ = cfg.get('divisa', meio - 2)   # linha entre as colunas (calha), quando o texto da esquerda passa do meio
        c = [(m, w - m)] if um else [(m, d_), (d_, w - m)]
    elif c == 'por_ancora':
        # duas colunas só quando há âncora na metade direita (cabeçalhos centralizados em cada coluna)
        w = pg.rect.width
        m = cfg.get('margem', 15)
        dir_ = any(re.match(cfg['ancora'], l['t']) and l['bbox'][0] > w / 2 + 10 for l in linhas(pg))
        esq = any(re.match(cfg['ancora'], l['t']) and l['bbox'][2] < w / 2 - 10 for l in linhas(pg))
        c = [(m, w / 2 - 2), (w / 2 - 2, w - m)] if dir_ and esq else [(m, w - m)]
    elif c == 'faixas':
        c, ys = faixas_da_pagina(pg, cfg)
        _cache_faixas[k] = ys
    elif callable(c):
        c = c(pg.rect)
    if larga_de(pg, cfg) is not None:
        m = cfg.get('margem', 15)
        c = list(c) + [(m, pg.rect.width - m)]   # faixa de largura total no pé da página (última "coluna")
    if larga_topo_de(pg, cfg) is not None:
        m = cfg.get('margem', 15)
        c = [(m, pg.rect.width - m)] + list(c)   # faixa de largura total no alto da página (primeira "coluna")
    _cache_cols[k] = c
    return c


_cache_faixas = {}   # (doc, página) -> [(y0, y1)] de cada "coluna" no modo 'faixas'


def faixas_da_pagina(pg, cfg):
    """Página que alterna faixas de largura total e faixas de duas colunas (Fatec): cada faixa de duas colunas vira
    duas "colunas" (esquerda, depois direita) limitadas à altura da faixa; as faixas largas são uma coluna só.
    Faixa de duas colunas = trecho com texto que começa na metade direita (pelo menos uma âncora/instrução ou duas
    linhas longas), limitado pelas linhas de largura total acima e abaixo. Rótulos dentro de figura larga não contam."""
    W, H = pg.rect.width, pg.rect.height
    m = cfg.get('margem', 15)
    meio = W / 2
    topo, base = topo_de(pg, cfg), limite_baixo(pg, cfg)
    manual = cfg.get('faixas_pag', {}).get((Path(pg.parent.name).stem, pg.number + 1))
    if manual is None and cfg.get('faixas_uma_auto'):
        # página toda em largura total (ENEM 2020–2022: questões de largura total na página inteira): mesmo critério
        # do modo 'auto' — muitas linhas atravessam o meio e nenhuma questão começa na metade direita
        ls = [L for L in linhas(pg) if topo <= L['bbox'][1] and L['bbox'][3] <= base and len(L['t']) > 12]
        cruzam = sum(1 for L in ls if L['bbox'][0] < meio - 25 and L['bbox'][2] > meio + 25)
        direita = any(re.match(cfg['ancora'], L['t']) and meio - 8 <= L['bbox'][0] <= meio + 45 for L in linhas(pg))
        if ls and cruzam / len(ls) > 0.2 and not direita:
            manual = [(topo, base, None)]
    if manual is None and cfg.get('faixas_modo') == 'largas':
        manual = faixas_por_largas(pg, cfg, topo, base)
    if manual is not None:   # [(y0, y1, divisa ou None = largura total)], de cima para baixo
        cols, ys = [], []
        for a, b, div in manual:
            a, b = max(a, topo), min(b, base)
            if b - a < 2:
                continue
            if div is None:
                cols.append((m, W - m)); ys.append((a, b))
            else:
                cols += [(m, div), (div, W - m)]; ys += [(a, b), (a, b)]
        return cols, ys
    ls = [L for L in linhas(pg) if L['bbox'][1] >= topo - 2 and L['bbox'][3] <= base + 2]
    figuras = [pymupdf.Rect(b['bbox']) for b in pg.get_image_info()
               if b['bbox'][0] < meio - 60 and b['bbox'][2] > meio + 60 and b['bbox'][3] - b['bbox'][1] > 40
               and b['bbox'][0] >= 0 and b['bbox'][2] <= W]   # imagem que sai da página está recortada: não conta
    dentro_fig = lambda L: any(f.contains(pymupdf.Rect(L['bbox'])) for f in figuras)
    largas = sorted(L['bbox'][1:4:2] for L in ls if L['bbox'][0] < meio - 25 and L['bbox'][2] > meio + 25)
    largas += sorted((f.y0, f.y1) for f in figuras)
    # fios horizontais de largura total (linha sob "Questão 27") também separam faixas
    largas += [(d['rect'].y0, d['rect'].y1) for d in pg.get_drawings()
               if d['rect'].height < 3 and d['rect'].x0 < meio - 60 and d['rect'].x1 > meio + 60 and topo <= d['rect'].y0 <= base]
    largas.sort()
    forte_ = lambda L: re.match(cfg['ancora'], L['t']) or any(re.search(rx, L['t']) for rx in cfg.get('suporte', []) + cfg.get('corte', []))
    # linha da metade direita; âncora/instrução recuada a partir de 30% da largura (coluna esquerda estreita) também
    direita = sorted((L for L in ls if (L['bbox'][0] > meio - 12 or (L['bbox'][0] > W * 0.3 and L['bbox'][2] < meio + 25 and forte_(L)))
                      and not dentro_fig(L)), key=lambda L: L['bbox'][1])
    # agrupa as linhas da direita que não têm linha larga entre elas
    grupos = []
    for L in direita:
        y0, y1 = L['bbox'][1], L['bbox'][3]
        if grupos and not any(grupos[-1]['y1'] - 1 <= a and b <= y0 + 1 for a, b in largas):
            grupos[-1]['y1'] = max(grupos[-1]['y1'], y1)
            grupos[-1]['ls'].append(L)
        else:
            grupos.append({'y0': y0, 'y1': y1, 'ls': [L]})
    # linhas um pouco à esquerda do meio, coladas às de um grupo (alternativas da coluna direita estreita)
    for g in grupos:
        xs = min(L['bbox'][0] for L in g['ls'])
        if xs < meio - 12:
            for L in ls:
                if abs(L['bbox'][0] - xs) < 4 and g['y0'] - 1 <= L['bbox'][1] and L not in g['ls'] and not dentro_fig(L) \
                        and not any(g['y0'] <= a and b <= L['bbox'][1] for a, b in largas):
                    g['y1'] = max(g['y1'], L['bbox'][3])
                    g['ls'].append(L)
    # rótulos "(A)" das alternativas da coluna direita, recuados à esquerda do texto delas
    for g in grupos:
        xs = min(L['bbox'][0] for L in g['ls'])
        for L in ls:
            if re.match(r'^\(?[A-E][\).]\s*$|^\(?[A-E]\)', L['t']) and xs - 45 < L['bbox'][0] < xs - 1 and L not in g['ls'] \
                    and g['y0'] - 2 <= L['bbox'][1] <= g['y1'] + 2:
                g['ls'].append(L)
    faixas = []
    for g in grupos:
        forte = any(forte_(L) for L in g['ls'])
        longas = sum(1 for L in g['ls'] if len(L['t']) >= 20)
        if not (forte or longas >= 2):
            continue
        a = max([b for a_, b in largas if b <= g['y0'] + 1] + [topo])
        # âncora na margem esquerda abaixo do grupo ("Questão 47" logo acima do fio) também fecha a faixa
        # (só quando a coluna esquerda da faixa não tem questão própria: ao lado de uma figura)
        esq_ancora = any(a - 1 <= L['bbox'][1] <= g['y0'] + 5 and L['bbox'][0] < meio - 12 and re.match(cfg['ancora'], L['t']) for L in ls)
        b = min([a_ for a_, b_ in largas if a_ >= g['y1'] - 1] + [base]
                + ([] if esq_ancora else
                   [L['bbox'][1] - 1 for L in ls if L['bbox'][1] >= g['y1'] - 6 and L['bbox'][0] < meio - 12 and forte_(L)]))
        if any(f.y0 < b - 2 and f.y1 > a + 2 for f in figuras):
            continue   # figura de largura total dentro da faixa (ex.: legenda/fonte à direita da arte): não divide
        xs = min(L['bbox'][0] for L in g['ls'])
        # divisa no meio da calha: entre o fim do texto da coluna esquerda e o início da direita
        esq_x1 = [L['bbox'][2] for L in ls if a - 1 <= L['bbox'][1] <= b and L['bbox'][0] < meio - 12 and L['bbox'][2] < xs - 2]
        div = (max(esq_x1) + xs) / 2 if esq_x1 else min(cfg.get('divisa', meio - 2), xs - 8)
        if faixas and a <= faixas[-1][1]:
            faixas[-1] = (faixas[-1][0], max(b, faixas[-1][1]), min(div, faixas[-1][2]))
        else:
            faixas.append((a, b, div))
    cols, ys, y = [], [], topo
    for a, b, div in faixas:
        if a - y > 2:
            cols.append((m, W - m)); ys.append((y, a))
        cols += [(m, div), (div, W - m)]; ys += [(a, b), (a, b)]
        y = b
    if base - y > 2 or not cols:
        cols.append((m, W - m)); ys.append((y, base))
    return cols, ys


def faixas_por_largas(pg, cfg, topo, base):
    """Modo 'largas' (UFSM): a página é de duas colunas, menos as faixas onde há linha de texto, figura ou fio que
    atravessa a calha (largura total). A âncora/instrução da coluna esquerda logo acima de uma faixa larga, sem texto
    da coluna direita ao lado, entra na faixa larga."""
    W = pg.rect.width
    meio = cfg.get('divisa', W / 2)
    ls = [L for L in linhas(pg) if L['bbox'][1] >= topo - 2 and L['bbox'][3] <= base + 2]
    larg = [(L['bbox'][1], L['bbox'][3]) for L in ls if L['bbox'][0] < meio - 20 and L['bbox'][2] > meio + 20]
    if cfg.get('largas_alternativas'):
        # alternativas lado a lado numa linha de largura total ("(A) A   (B) B   (C) C   (D) D   (E) E"): a camada de texto
        # as separa em pedaços, mas a linha atravessa a calha (a da direita não começa na margem da coluna)
        alt = [L for L in ls if re.match(r'^\(?[A-E]\)', L['t'])]
        for L in alt:
            if L['bbox'][0] > meio + 30 and any(M['bbox'][0] < meio - 60 and abs(M['bbox'][1] - L['bbox'][1]) < 3 for M in alt):
                larg.append((L['bbox'][1], L['bbox'][3]))
    # figura/fio que atravessa a calha só é larga se não há texto da coluna direita ao lado dela
    ao_lado = lambda r: any(L['bbox'][0] > meio + 5 and L['bbox'][1] < r[3] - 2 and L['bbox'][3] > r[1] + 2
                            and not pymupdf.Rect(r).contains(pymupdf.Rect(L['bbox'])) for L in ls)
    larg += [(b['bbox'][1], b['bbox'][3]) for b in pg.get_image_info()
             if b['bbox'][0] < meio - 30 and b['bbox'][2] > meio + 30 and topo - 5 < b['bbox'][3] and b['bbox'][1] < base + 5
             and b['bbox'][3] - b['bbox'][1] < base - topo - 50   # fundo de página inteira (moldura em imagem) não conta
             and not ao_lado(b['bbox'])]
    larg += [(d['rect'].y0, d['rect'].y1) for d in pg.get_drawings()
             if d['rect'].x0 < meio - 30 and d['rect'].x1 > meio + 30 and topo <= d['rect'].y0 <= base and d['rect'].height < base - topo - 50
             and not ao_lado(tuple(d['rect']))]
    larg.sort()
    grupos = []
    for a, b in larg:
        a, b = max(a, topo), min(b, base)
        # não junta se há texto da coluna direita entre as duas faixas largas
        if grupos and (a - grupos[-1][1] < 6 or (a - grupos[-1][1] < cfg.get('largas_gap', 30) and not any(
                L['bbox'][0] > meio + 5 and grupos[-1][1] - 1 < L['bbox'][1] and L['bbox'][3] < a + 1 for L in ls))):
            grupos[-1][1] = max(grupos[-1][1], b)
        else:
            grupos.append([a, b])
    # linhas acima de cada faixa larga, só na coluna esquerda (número da questão, instrução), entram nela
    for g in grupos:
        while True:
            acima = [L for L in ls if g[0] - 40 < L['bbox'][3] <= g[0] + 1 and L['bbox'][1] < g[0] - 0.5]
            if not acima:
                break
            forte = lambda L: re.match(cfg['ancora'], L['t']) or any(re.search(rx, L['t']) for rx in cfg.get('suporte', []))
            if not all(forte(L) for L in acima):
                break
            y = min(L['bbox'][1] for L in acima)
            if any(L['bbox'][0] > meio + 5 for L in ls if L['bbox'][3] > y and L['bbox'][1] < g[0]):
                break
            g[0] = y - 1
    junt = []
    for g in grupos:
        if junt and g[0] <= junt[-1][1] + 2:
            junt[-1][1] = max(junt[-1][1], g[1])
        else:
            junt.append(g)
    grupos = junt
    out, y = [], topo
    for a, b in grupos:
        if a - y > 2:
            out.append((y, a, meio))
        out.append((a, b + 1, None))
        y = b + 1
    if base - y > 2:
        out.append((y, base, meio))
    return out


def larga_de(pg, cfg):
    """Altura em que a página passa a ter uma faixa de largura total (questão que ocupa as duas colunas no pé)."""
    return cfg.get('larga', {}).get(pg.number + 1)


def larga_topo_de(pg, cfg):
    """Altura até onde a página tem uma faixa de largura total no alto (questão larga antes das duas colunas)."""
    return cfg.get('larga_topo', {}).get(pg.number + 1)


def coluna_do_ponto(pg, cfg, x0, y0, cols):
    """Coluna de uma linha, respeitando as faixas de largura total."""
    ys = _cache_faixas.get((id(pg.parent), pg.number)) if cfg.get('colunas') == 'faixas' else None
    if ys is not None:
        for i, ((a, b), (ya, yb)) in enumerate(zip(cols, ys)):
            if a - 6 <= x0 < b and ya - 1.5 <= y0 < yb - 0.5:
                return i
        for i, ((a, b), (ya, yb)) in enumerate(zip(cols, ys)):
            if a - 6 <= x0 < b and ya - 3 <= y0 < yb + 1:
                return i
        return None
    yt = larga_topo_de(pg, cfg)
    if yt is not None:
        if y0 < yt:
            return 0
        c = coluna_de(x0, cols[1:])
        return None if c is None else c + 1
    return coluna_de(x0, cols)


def faixa_vertical(pg, cfg, c, cols):
    """(topo, base) da coluna c: com faixa larga, as colunas normais param nela e a faixa vai até o pé."""
    ys = _cache_faixas.get((id(pg.parent), pg.number)) if cfg.get('colunas') == 'faixas' else None
    if ys is not None:
        return ys[c]
    y_l = larga_de(pg, cfg)
    topo, base = topo_de(pg, cfg), limite_baixo(pg, cfg)
    y_t = larga_topo_de(pg, cfg)
    if y_t is not None:
        return (topo, y_t - 2) if c == 0 else (y_t, base)
    if y_l is None:
        return topo, base
    return (y_l, base) if c == len(cols) - 1 else (topo, y_l - 2)


def topo_de(pg, cfg):
    """Margem de cima da página (algumas provas têm quadro de instruções no alto da 1ª página de questões)."""
    t = cfg.get('topo_pag', {}).get(pg.number + 1, cfg['topo'])
    if cfg.get('cabecalho_imagem'):   # logotipo no alto de algumas páginas: a página começa abaixo dele
        for b in pg.get_image_info():
            x0, y0, x1, y1 = b['bbox']
            if y1 < 100 and y1 - y0 < 80:
                t = max(t, y1 + 2)
        # caderno só em imagem: o logotipo vem pelo OCR ("UDESC", "Vestibular 2024.2")
        for L in (linhas(pg) if id(pg.parent) in _OCR else []):
            if L['bbox'][3] < 100 and re.search(cfg['cabecalho_imagem'], L['t']):
                t = max(t, L['bbox'][3] + 2)
    if cfg.get('cabecalho'):   # cabeçalho de altura variável: a página começa logo abaixo dele
        for L in linhas(pg):
            if L['bbox'][1] < 90 and re.search(cfg['cabecalho'], L['t']):
                t = max(t, L['bbox'][3] + 1)
    return t


def limite_baixo(pg, cfg):
    """Altura máxima útil da página: acima do número de página do rodapé, quando a prova tem um."""
    lim = pg.rect.height - cfg['base']
    if cfg.get('rodape_rx'):   # rodapé em altura que muda por ano: a página acaba logo acima dele
        for l in linhas(pg):
            if l['bbox'][1] > pg.rect.height * 0.82 and re.search(cfg['rodape_rx'], l['t']):
                # rodapé ao lado da última alternativa (mesma altura): não corta, só é apagado no print ('apagar')
                lado = any(o is not l and o['bbox'][1] < l['bbox'][3] - 2 and o['bbox'][3] > l['bbox'][1] + 2
                           and not re.search(cfg['rodape_rx'], o['t']) and not re.fullmatch(r'[\d\s•∙·|]*(Fatec)?', o['t'])
                           for o in linhas(pg))
                if not lado:
                    lim = min(lim, l['bbox'][1] - 2)
    if cfg.get('rodape_num'):
        # rodape_ultimo: só vale o número que é a última linha da página (números de gráfico não contam)
        ultimo = max((l['bbox'][1] for l in linhas(pg)), default=0) if cfg.get('rodape_ultimo') else 0
        for l in linhas(pg):
            if l['bbox'][1] < ultimo - 2:
                continue
            centro = abs((l['bbox'][0] + l['bbox'][2]) / 2 - pg.rect.width / 2) < 30
            if cfg.get('rodape_lado') and any(o is not l and o['bbox'][1] < l['bbox'][3] - 2 and o['bbox'][3] > l['bbox'][1] + 2
                                               for o in linhas(pg)):
                continue   # número de página ao lado de uma linha da prova ("QUESTÃO 32" no pé): não corta
            if re.fullmatch(r'\d{1,3}', l['t']) and l['bbox'][1] > pg.rect.height * 0.85 and (centro or not cfg.get('rodape_centro')):
                lim = min(lim, l['bbox'][1] - cfg.get('rodape_folga', 3)) if lim > l['bbox'][1] else lim
    return lim


def coluna_de(x0, cols):
    for i, (a, b) in enumerate(cols):
        if a - 6 <= x0 < b:
            return i
    return None


def pagina_cartaz(pg):
    """Página ocupada por uma imagem de página inteira e quase sem texto."""
    area = pg.rect.width * pg.rect.height
    grandes = [b for b in pg.get_image_info() if pymupdf.Rect(b["bbox"]).get_area() > 0.8 * area]
    return bool(grandes) and len(pg.get_text().strip()) < 400


def artes_sangradas(pg, lp):
    """Topo de imagens que vão de uma borda à outra da página, altas e sem texto por cima."""
    W, H = pg.rect.width, pg.rect.height
    ys = []
    for b in pg.get_image_info():
        r = pymupdf.Rect(b['bbox'])
        if r.x0 <= 2 and r.x1 >= W - 2 and r.height > 0.2 * H and r.height < 0.8 * H:
            if not any(r.intersects(pymupdf.Rect(L['bbox'])) and len(L['t']) > 3 and (L['bbox'][2] - L['bbox'][0]) > (L['bbox'][3] - L['bbox'][1]) for L in lp):
                ys.append(r.y0)
    return ys


_cache_selos = {}


def selos_da_pagina(pg):
    """Retângulos pintados baixos (até 30 pt) da página: selos/faixas do número da questão."""
    k = (id(pg.parent), pg.number)
    if k not in _cache_selos:
        _cache_selos[k] = [pymupdf.Rect(d['rect']) for d in pg.get_drawings()
                           if 6 < d['rect'].height < 30 and d['rect'].width > 8]
    return _cache_selos[k]


_cache_caixas = {}


def caixas_da_pagina(pg):
    """Retângulos pintados de até 50 pt de altura (faixas com a instrução "Leia o texto para responder às questões")."""
    k = (id(pg.parent), pg.number)
    if k not in _cache_caixas:
        _cache_caixas[k] = [pymupdf.Rect(d['rect']) for d in pg.get_drawings()
                            if d.get('fill') is not None and 8 < d['rect'].height < 50 and d['rect'].width > 120]
    return _cache_caixas[k]


def eventos_do_pdf(pdf, cfg, faixa=None):
    """Lista de eventos em ordem de leitura: ('q', n) início de questão, ('fim',) fim de enunciado,
    ('corte',) cabeçalho a excluir, ('suporte', ini, fim) texto de apoio compartilhado."""
    ev = []
    for pi in range(len(pdf)):
        if faixa and not (faixa[0] <= pi + 1 <= faixa[1]):
            continue
        pg = pdf[pi]
        if pagina_cartaz(pg) and id(pdf) not in _OCR:   # caderno só em imagem: toda página é "cartaz", não corta
            # página só com arte de página inteira (ex.: aviso "IMPORTANTE" antes da redação): encerra a questão
            ev.append({'p': pi, 'c': 0, 'y': 0, 'tipo': 'corte'})
            continue
        cols = colunas_da_pagina(pg, cfg)
        lp = linhas(pg)
        if cfg.get('corte_espacado'):
            # título com as letras espaçadas ("P R O D U Ç Ã O  D E  T E X T O"): cada letra vira uma linha na camada de
            # texto; a palavra remontada na mesma altura encerra a questão anterior
            por_y = {}
            for L in lp:
                if len(L['t']) == 1:
                    por_y.setdefault(round(L['bbox'][1]), []).append(L)
            for y_, ls_ in por_y.items():
                palavra = ''.join(L['t'] for L in sorted(ls_, key=lambda L: L['bbox'][0]))
                if any(w in palavra for w in cfg['corte_espacado']) and y_ >= topo_de(pg, cfg) - 5:
                    ev.append({'p': pi, 'c': 0, 'y': y_, 'tipo': 'corte'})
        for y in artes_sangradas(pg, lp):
            # arte de borda a borda sem texto por cima (ex.: aviso antes da redação): encerra a questão
            ev.append({'p': pi, 'c': 0, 'y': y, 'tipo': 'corte'})
        baixo = limite_baixo(pg, cfg)
        # âncora que existe no desenho da página mas não na camada de texto do PDF (conferida à mão no print)
        for n_f, y_f, c_f in cfg.get('ancora_forcada', {}).get((cfg.get('_arquivo'), pi + 1), []):
            ev.append({'p': pi, 'c': c_f, 'y': y_f, 'tipo': 'q', 'n': n_f})
        # texto de apoio sem frase-padrão de indicação ("As três questões a seguir (02, 03 e 04)...", conferido no caderno):
        # (y, coluna, [primeira, última]) na numeração do caderno
        for y_f, c_f, faixa_f in cfg.get('suporte_forcado', {}).get((cfg.get('_arquivo'), pi + 1), []):
            ev.append({'p': pi, 'c': c_f, 'y': y_f, 'tipo': 'suporte', 'faixa': list(faixa_f), 'num': None})
        for li, L in enumerate(lp):
            x0, y0, x1, y1 = L['bbox']
            t = L['t']
            if y1 > baixo:
                continue
            c = coluna_do_ponto(pg, cfg, x0, y0, cols)
            if c is None:
                continue
            if larga_de(pg, cfg) is not None and y0 >= larga_de(pg, cfg) - 1:
                c = len(cols) - 1
            topo = topo_de(pg, cfg)
            if y0 < topo and y1 > topo + 3 and re.match(cfg['ancora'], t) and cfg.get('cabecalho'):
                y0 = topo   # âncora com caixa alta que encosta no cabeçalho: começa logo abaixo dele
            if y0 < topo:
                # acima da margem só valem cortes (ex.: título da redação colado no topo)
                if y0 >= topo - 18 and any(re.search(rx, t) for rx in cfg.get('corte', [])):
                    ev.append({'p': pi, 'c': c, 'y': max(y0, topo), 'tipo': 'corte'})
                continue
            t_sec = re.sub(r'^[\W_]+', '', t.strip()) if cfg.get('secao_sem_marcador') else t.strip()   # "\uf0b7 LÍNGUA INGLESA"
            if cfg.get('secoes') and t_sec in cfg['secoes']:
                ev.append({'p': pi, 'c': c, 'y': y0, 'tipo': 'secao', 'nome': cfg['secoes'][t_sec]})
                continue
            sec_rx = next((nome for rx, nome in cfg.get('secoes_rx', []) if re.search(rx, t)), None)
            if sec_rx:
                ev.append({'p': pi, 'c': c, 'y': y0, 'tipo': 'secao', 'nome': sec_rx})
                continue
            if cfg.get('suporte_titulo') and L.get('neg') and len(t) > 6 and not re.match(cfg['ancora'], t) \
                    and x0 - cols[c][0] > 40 and cols[c][1] - x1 > 40 and abs((x0 + x1) / 2 - (cols[c][0] + cols[c][1]) / 2) < 25 \
                    and pi + 1 >= cfg['suporte_titulo']:
                # título em negrito centralizado de um texto que vem ANTES da questão (Fatec 2025/1, multidisciplinar)
                ev.append({'p': pi, 'c': c, 'y': y0, 'tipo': 'suporte', 'faixa': [], 'num': None})
                continue
            m = re.match(cfg['ancora'], t)
            dx = cfg.get('ancora_dx_pag', {}).get((cfg.get('_arquivo'), pi + 1), cfg.get('ancora_dx', 30))
            if not m and cfg.get('sequencial') and cfg.get('ancora_sem_numero') and re.match(cfg['ancora_sem_numero'], t) \
                    and x0 - cols[c][0] <= dx:
                ev.append({'p': pi, 'c': c, 'y': y0, 'tipo': 'q', 'n': None})
                continue
            if m and cfg.get('ancora_negrito') and not L.get('neg', True):
                m = None   # número de linha do texto (5, 10, 15), não é número de questão
            if m and cfg.get('ancora_isolada') and any(
                    M is not L and abs(M['bbox'][1] - y0) < 4 and 0 <= M['bbox'][0] - x1 < 60 for M in lp):
                m = None   # número de parágrafo do texto (texto na mesma linha, logo à direita), não é questão
            if m and x0 - cols[c][0] <= dx:
                # selo desenhado em volta do número ("QUESTÃO 15" numa faixa colorida): a questão começa no alto do selo
                for r_ in selos_da_pagina(pg):
                    if r_.y0 < y0 + 1 and r_.y1 > y0 and y0 - r_.y0 < 10 and r_.x0 - 2 <= x0 <= r_.x1:
                        y0 = min(y0, r_.y0)
                if cfg.get('ancora_bloco'):
                    # número centrado na altura do parágrafo ao lado (texto ao lado de figura, Unicentro 2026):
                    # a questão começa na 1ª linha do parágrafo que encosta no número
                    viz = sorted((M for M in lp if 0 <= M['bbox'][0] - x1 < 40), key=lambda M: M['bbox'][1])
                    # só o parágrafo que está na altura do número (mesma margem esquerda)
                    par_ = [M for M in viz if M['bbox'][1] - 2 <= y0 <= M['bbox'][3] + 2]
                    if par_:
                        xb = min(M['bbox'][0] for M in par_)
                        viz = [M for M in viz if abs(M['bbox'][0] - xb) < 2 or (M['bbox'][0] > xb and any(abs(N['bbox'][1] - M['bbox'][1]) < 2 and abs(N['bbox'][0] - xb) < 2 for N in viz))]
                    else:
                        viz = []
                    acima = [M for M in viz if M['bbox'][1] < y0 - 1 and M['bbox'][3] > y0 - 40]
                    topo_b = y0
                    for M in sorted(viz, key=lambda M: -M['bbox'][1]):
                        if M['bbox'][1] < topo_b - 1 and topo_b - M['bbox'][3] < 6 and M['bbox'][1] < y0:
                            topo_b = M['bbox'][1]
                    if acima and topo_b < y0:
                        # figura ao lado do parágrafo que começa um pouco acima dele (sem invadir a questão anterior)
                        fim_ant = max([M['bbox'][3] for M in lp if M['bbox'][3] < topo_b - 1] or [0])
                        for im_ in pg.get_image_info():
                            bx = im_['bbox']
                            if bx[0] > x1 and bx[1] < topo_b and bx[3] > topo_b and bx[1] > fim_ant + 2:
                                topo_b = bx[1]
                        y0 = topo_b
                ev.append({'p': pi, 'c': c, 'y': y0, 'tipo': 'q', 'n': int(m.group(1))})
                continue
            if any(re.search(rx, t) for rx in cfg.get('pausa', [])):
                ev.append({'p': pi, 'c': c, 'y': y0, 'tipo': 'pausa'})
                continue
            for rx in cfg.get('fim', []):
                if re.search(rx, t):
                    ev.append({'p': pi, 'c': c, 'y': y0, 'tipo': 'fim'})
                    break
            else:
                for rx in cfg.get('corte', []):
                    if re.search(rx, t):
                        # linha de separação feita de "____": o traço fica no pé da caixa da linha
                        ev.append({'p': pi, 'c': c, 'y': y1 - 4 if re.fullmatch(r'_{6,}', t) else y0, 'tipo': 'corte'})
                        break
                else:
                    for rx in cfg.get('suporte', []):
                        m = re.search(rx, t)
                        if m:
                            resto = t[m.start():] + ' ' + (lp[li + 1]['t'] if li + 1 < len(lp) else '')
                            resto = re.sub(r'(\w)-\s+(\w)', r'\1\2', resto)   # "ques- tões" partido no fim da linha
                            mq = re.search(r'(?i)(quest|cuesti)\w*\W*(.*)', resto)
                            if mq:   # "Text 17 (for questions 18, 19, 20 and 21)" -> 18..21; só a lista logo após "questões"
                                ml = re.match(r'(?i)\s*(?:de\s+n[úu]meros?|n[úu]meros?|de|das|dos|nos|from|n[ºo°]s?\.?)?\s*(\d+)((?:(?:\s*(?:,|\be\b|\ba\b|\band\b|\by\b|\bto\b|–|-))+\s*\d+)*)', mq.group(2))
                                ns = [int(x) for x in re.findall(r'\d+', ml.group(0))] if ml else []
                                nums = [min(ns), max(ns)] if len(ns) >= 2 else ns
                                if len(ns) == 1 and cfg.get('faixa_unica'):   # "à questão 30": vale só para a 30
                                    nums = [ns[0], ns[0]]
                            else:
                                nums = [int(x) for x in re.findall(r'\d+', resto)][:2]
                            if cfg.get('texto_n_sem_faixa') and re.match(r'(?i)^texto?\s+[0-9IVX]+:?\s*$', t):
                                nums = []   # "TEXT 1" sozinho: os números da linha seguinte (link, data) não são questões
                            mt = re.match(r'(?i)^texto\s+(\d+)', t)
                            if not mt and cfg.get('texto_romano') and re.match(r'^TEXTO\s+([IVX]+)\b', t, re.I):
                                mt = re.match(r'(?i)^texto\s+([IVX]+)\b', t)
                                mt = type('M', (), {'group': lambda self, k, _v=ROMANO.get(mt.group(1).upper()): _v})()
                            if not mt and not mq and cfg.get('texto_ingles'):   # "Text 1" sozinho (sem lista de questões)
                                mt = re.match(r'(?i)^text\s+(\d+)\s*$', t)
                            yi = y0
                            # frase de instrução quebrada em duas linhas: começa na linha de cima
                            if li > 0 and coluna_de(lp[li - 1]['bbox'][0], cols) == c and 0 <= y0 - lp[li - 1]['bbox'][3] < 5 \
                                    and not re.match(cfg['ancora'], lp[li - 1]['t']) and lp[li - 1]['bbox'][1] >= cfg['topo'] \
                                    and lp[li - 1]['t'].strip() not in cfg.get('secoes', {}) \
                                    and not any(re.search(rx_, lp[li - 1]['t']) for rx_, _ in cfg.get('secoes_rx', [])) \
                                    and not any(re.search(rx_, lp[li - 1]['t']) for rx_ in cfg.get('corte', [])) \
                                    and not re.match(r'(?i)^texts?o?\s+0?\d+\s*$', t) \
                                    and not re.match(r'^\s*(?:\(?[A-Ea-e][\)\.]|\([A-E]\))', lp[li - 1]['t']):
                                yi = lp[li - 1]['bbox'][1] - 2
                            # frase de instrução em 3 ou mais linhas, com entrelinha apertada (linhas que se sobrepõem 1 pt):
                            # sobe até o começo da frase (FMABC: "Leia o capítulo CVI ... para res-/ponder às questões")
                            k_ = li
                            while cfg.get('suporte_sobe') and k_ > 0 and li - k_ < cfg['suporte_sobe'] \
                                    and coluna_de(lp[k_ - 1]['bbox'][0], cols) == c and -3 <= lp[k_]['bbox'][1] - lp[k_ - 1]['bbox'][3] < 5 \
                                    and lp[k_ - 1]['bbox'][1] >= cfg['topo'] and not re.match(cfg['ancora'], lp[k_ - 1]['t']) \
                                    and not re.match(r'^\s*(?:\(?[A-Ea-e][\)\.]|\([A-E]\))', lp[k_ - 1]['t']) \
                                    and not any(re.search(rx_, lp[k_ - 1]['t']) for rx_ in cfg.get('corte', [])):
                                k_ -= 1
                                yi = min(yi, lp[k_]['bbox'][1] - 2)
                            if cfg.get('suporte_caixa'):
                                # instrução dentro de uma faixa pintada (Fatec): o texto de apoio começa no alto da faixa
                                for r_ in caixas_da_pagina(pg):
                                    if r_.y0 - 1 <= y0 <= r_.y1 and r_.x0 - 2 <= x0 <= r_.x1:
                                        yi = min(yi, r_.y0 - 1)
                            # errata da banca: a indicação impressa aponta outras questões (conferida no caderno)
                            nums = cfg.get('faixa_errata', {}).get((cfg.get('_arquivo'), pi + 1, tuple(nums)), nums)
                            # 'texto_n_com_faixa': "Texto 5 – Questão 56" vale só para as questões que declara
                            ev.append({'p': pi, 'c': c, 'y': yi, 'tipo': 'suporte', 'faixa': nums if (not mt or cfg.get('texto_n_com_faixa')) else [],
                                       'singular': bool(cfg.get('suporte_singular') and re.search(cfg['suporte_singular'], resto)),
                                       'num': (re.search(cfg['texto_id'], t).group(1).upper() if cfg.get('texto_id') and re.search(cfg['texto_id'], t)
                                               else int(mt.group(1)) if mt else None)})
                            break
        if id(pdf) in _OCR_SO_TEXTO and cfg.get('suporte'):
            # camada de texto ilegível: a indicação "Texto para as questões X a Y" só aparece no OCR da página
            for b in textpage(pg)[0].get_text('dict')['blocks']:
                for l in b.get('lines', []):
                    t = unicodedata.normalize('NFC', ''.join(s['text'] for s in l['spans'])).replace('\xa0', ' ').strip()
                    x0, y0 = l['bbox'][0], l['bbox'][1]
                    c = coluna_de(x0, cols)
                    if c is None or y0 < topo_de(pg, cfg) or not any(re.search(rx, t) for rx in cfg['suporte']):
                        continue
                    ns = [int(x) for x in re.findall(r'\d+', re.split(r'(?i)quest', t, maxsplit=1)[-1])]
                    ev.append({'p': pi, 'c': c, 'y': y0, 'tipo': 'suporte', 'faixa': [min(ns), max(ns)] if len(ns) >= 2 else ns, 'num': None})
    if cfg.get('suporte_apos_alt'):
        ev += suportes_apos_alternativa(pdf, cfg, ev, faixa)
    ev.sort(key=lambda e: (e['p'], e['c'], e['y']))
    if cfg.get('suporte_nao_colado'):
        # "07. Leia o texto..." na mesma linha (ou logo abaixo) do número: a instrução é da própria questão
        ok = []
        for e in ev:
            ant = ok[-1] if ok else None
            if e['tipo'] == 'suporte' and ant and ant['tipo'] == 'q' and (ant['p'], ant['c']) == (e['p'], e['c']) \
                    and 0 <= e['y'] - ant['y'] < cfg['suporte_nao_colado']:
                ant['texto_colado'] = True   # a questão traz o próprio texto ("Texto 1" logo abaixo do número)
                continue
            ok.append(e)
        ev = ok
    # camada de texto duplicada: o mesmo evento duas vezes no mesmo lugar
    unicos, vistos = [], set()
    for e in ev:
        k = (e['p'], e['c'], round(e['y']), e['tipo'], e.get('n'))
        if k not in vistos:
            vistos.add(k)
            unicos.append(e)
        elif e['tipo'] == 'suporte' and e.get('num') is not None:
            # "Texto 2" e "Texto 3" lado a lado na mesma linha: um só recorte vale pelos dois
            dono = next(u for u in unicos if (u['p'], u['c'], round(u['y']), u['tipo'], u.get('n')) == k)
            dono.setdefault('outros', []).append(e['num'])
    return unicos


def suportes_apos_alternativa(pdf, cfg, ev, faixa=None):
    """Texto de apoio sem frase de indicação, impresso entre a última alternativa de uma questão e a âncora da próxima
    (UTFPR, PUCRS...): depois da linha da última alternativa ("(E)"), a primeira linha que começa de novo na margem da
    alternativa (sem o recuo das linhas de continuação) e não é âncora, seção nem corte abre um texto de apoio."""
    rx_alt = cfg['suporte_apos_alt']
    rx_letra = cfg.get('alternativa_rx', r'^\(?[A-Ea-e]\)')
    marcados = {}
    for e in ev:
        marcados.setdefault((e['p'], e['c']), []).append((e['y'], e['tipo']))
    novos, estado = [], None   # estado: x da linha da última alternativa e sua altura
    for pi in range(len(pdf)):
        if faixa and not (faixa[0] <= pi + 1 <= faixa[1]):
            continue
        pg = pdf[pi]
        cols = colunas_da_pagina(pg, cfg)
        baixo, topo = limite_baixo(pg, cfg), topo_de(pg, cfg)
        ls = []
        for L in linhas(pg):
            x0, y0, x1, y1 = L['bbox']
            if y1 > baixo or y0 < topo:
                continue
            c = coluna_do_ponto(pg, cfg, x0, y0, cols)
            if c is not None:
                # letra da alternativa num trecho de texto à parte (Cebraspe): só ela conta como alternativa
                ls.append((c, y0, x0, y1, L.get('s0', '') if cfg.get('alt_span_isolada') else L['t'], bool(L.get('neg'))))
        ls.sort()
        ant_y1 = {}
        for c, y0, x0, y1, t, neg in ls:
            gap_ok = y0 - ant_y1.get(c, -99) >= cfg.get('suporte_apos_alt_gap', 0)
            ant_y1[c] = max(ant_y1.get(c, -99), y1)
            marca = next((tp for y, tp in marcados.get((pi, c), []) if abs(y - y0) < 2.5), None)
            if marca:
                # âncora, corte ou texto de apoio já marcados; depois do título de uma seção, o texto que vem antes da
                # 1ª questão é de apoio
                estado = ('secao', pi, c, y1) if marca == 'secao' and cfg.get('suporte_apos_secao') else None
                continue
            if estado and estado[0] == 'secao':
                # começa logo abaixo do título (texto de apoio que é só imagem não tem linha de texto)
                y_ = estado[3] + 1 if estado[1:3] == (pi, c) else y0 - 1
                novos.append({'p': pi, 'c': c, 'y': y_, 'tipo': 'suporte', 'faixa': [], 'num': None})
                estado = None
                continue
            if re.match(rx_alt, t):
                estado = (pi, c, x0, y0)
                continue
            if estado is None:
                continue
            if (pi, c) == estado[:2] and y0 < estado[3] + 2:
                continue   # resto da própria linha da alternativa
            if re.match(rx_letra, t):
                estado = None
                continue
            titulo = cfg.get('suporte_apos_alt_negrito') and neg and len(t) > 6 and gap_ok
            if titulo or (x0 <= estado[2] + cfg.get('suporte_apos_alt_tol', 4) and x0 <= cfg.get('suporte_apos_alt_xmax', 9999) and gap_ok):
                novos.append({'p': pi, 'c': c, 'y': y0 - 1, 'tipo': 'suporte', 'faixa': [], 'num': None})
                estado = None
    return novos


def segmentos(pdf, cfg, ev, i, faixa_pag=None):
    """Regiões (página, retângulo) entre o evento i e o próximo, em ordem de leitura."""
    e = ev[i]
    # "pausa" (ex.: quadro "Espaço para rascunho" no pé da página): o recorte pula o resto da coluna e segue adiante
    k = i + 1
    pausas = []
    while k < len(ev) and ev[k]['tipo'] == 'pausa':
        pausas.append(ev[k])
        k += 1
    prox = ev[k] if k < len(ev) else None
    segs = []
    p, c, y = e['p'], e['c'], e['y'] - 3
    # a folga de 3 pt não pode pegar o pé da linha de cima (fim da questão anterior); 'ancora_folga': quanto a caixa
    # da linha de cima pode invadir a da âncora (entrelinha apertada, ENEM 2020–2022)
    cols0 = colunas_da_pagina(pdf[p], cfg)
    for L in linhas(pdf[p]):
        x0_, y0_, x1_, y1_ = L['bbox']
        if coluna_do_ponto(pdf[p], cfg, x0_, y0_, cols0) == c and y0_ < e['y'] - 2 and y < y1_ <= e['y'] + cfg.get('ancora_folga', 0.5):
            y = y1_ + 0.3
    ultima = len(pdf) - 1 if not faixa_pag else min(len(pdf), faixa_pag[1]) - 1
    while True:
        pg = pdf[p]
        cols = colunas_da_pagina(pg, cfg)
        bx = faixa_vertical(pg, cfg, c, cols)[1]
        if prox and prox['p'] == p and prox['c'] == c:
            fim = prox['y'] - 2
            # linha de cima colada na âncora seguinte (entrelinha apertada): o pé dela não pode ficar cortado
            for L in linhas(pg):
                x0_, y0_, x1_, y1_ = L['bbox']
                if y0_ < prox['y'] - 4 and fim < y1_ <= prox['y'] + max(1.5, cfg.get('ancora_folga', 0)) and coluna_do_ponto(pg, cfg, x0_, y0_, cols) == c:
                    fim = y1_
            segs.append((p, pymupdf.Rect(cols[c][0] - 4, y, cols[c][1] + 4, fim)))
            return segs
        bx = min([bx] + [pz['y'] - 2 for pz in pausas if pz['p'] == p and pz['c'] == c and pz['y'] > y])
        segs.append((p, pymupdf.Rect(cols[c][0] - 4, y, cols[c][1] + 4, bx)))
        c += 1
        if c >= len(cols):
            c, p = 0, p + 1
            if p > ultima:
                return segs
        y = faixa_vertical(pdf[p], cfg, c, colunas_da_pagina(pdf[p], cfg))[0] if p < len(pdf) else cfg['topo']
        if not prox and p != e['p'] and not cfg.get('ultima_continua'):
            return segs  # última questão do caderno: não passa da própria página (salvo 'ultima_continua', conferido)


ROMANO = {r: i for i, r in enumerate(['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'], 1)}


def textos_citados(enun, cfg=None):
    if cfg and cfg.get('texto_id'):   # textos com nome próprio ("Texto 1A4-II", Cebraspe)
        return [x.upper() for x in re.findall(cfg['texto_id'], enun)]
    """Números dos textos que o enunciado cita: "Texto 1", "Textos 2 e 3", "Text 02", "Texts 1 and 2"."""
    out = []
    if cfg and cfg.get('texto_romano'):   # "texto II", "textos I e III"
        for m in re.finditer(r'\b(?:[Tt]extos?|TEXTOS?)\s+([IVX]+)\b((?:\s*(?:,|e)\s*[IVX]+\b)*)', enun):
            out += [ROMANO[x] for x in [m.group(1)] + re.findall(r'[IVX]+', m.group(2)) if x in ROMANO]
    for m in re.finditer(r'(?i)\b(?:textos?|texts?)\s+0?(\d)\b((?:\s*(?:,|e|and|y)\s*0?\d\b)*)', enun):
        out.append(int(m.group(1)))
        out += [int(x) for x in re.findall(r'\d', m.group(2))]
    return out


def conserta_bbox(pdf):
    """Form XObject com /BBox invertido ([0 842 595 0], cadernos recentes da Vunesp): o MuPDF o trata como vazio e a
    página some. Só na memória (o arquivo baixado e o seu hash não mudam)."""
    n = 0
    for x in range(1, pdf.xref_length()):
        try:
            if pdf.xref_get_key(x, 'Subtype') != ('name', '/Form'):
                continue
            t, v = pdf.xref_get_key(x, 'BBox')
        except Exception:
            continue
        if t != 'array':
            continue
        b = [float(z) for z in v.strip('[]').split()]
        if len(b) == 4 and (b[1] > b[3] or b[0] > b[2]):
            pdf.xref_set_key(x, 'BBox', '[%g %g %g %g]' % (min(b[0], b[2]), min(b[1], b[3]), max(b[0], b[2]), max(b[1], b[3])))
            n += 1
    return n


def trechos_coloridos(pdf, cores):
    """Retângulos dos trechos de texto numa cor de destaque (ex.: alternativa correta em vermelho)."""
    out = {}
    for pg in pdf:
        rs = []
        for b in pg.get_text('dict')['blocks']:
            for l in b.get('lines', []):
                for sp in l['spans']:
                    if sp['color'] in cores and sp['text'].strip():
                        # folga: parênteses e radicais grandes desenham fora da caixa do caractere (só o vermelho muda)
                        rs.append(pymupdf.Rect(sp['bbox']) + (-3, -8, 3, 8))
        for dr in pg.get_drawings():   # fórmula desenhada (traço de fração, radical, parênteses grandes) na mesma cor
            for k in ('color', 'fill'):
                c = dr.get(k)
                if c and len(c) == 3 and (round(c[0] * 255) << 16 | round(c[1] * 255) << 8 | round(c[2] * 255)) in cores:
                    rs.append(pymupdf.Rect(dr['rect']) + (-1, -1, 1, 1))
                    break
        if rs:
            out.setdefault(pg.number, []).extend(rs)
    return out


def neutraliza(im, clip, rects, escala):
    """Dentro dos trechos destacados, pixels avermelhados viram cinza-escuro do texto (mesmo desenho das letras)."""
    px = im.load()
    for r in rects:
        if not r.intersects(clip):
            continue
        x0 = max(0, round((r.x0 - clip.x0) * escala) - 1); x1 = min(im.width, round((r.x1 - clip.x0) * escala) + 1)
        y0 = max(0, round((r.y0 - clip.y0) * escala) - 1); y1 = min(im.height, round((r.y1 - clip.y0) * escala) + 1)
        for y in range(y0, y1):
            for x in range(x0, x1):
                rr, g, b = px[x, y]
                if min(g, b) - rr > 60:          # fundo ciano de marca-texto (PUCPR): vira branco, a tinta preta fica
                    v = min(g, b)
                    px[x, y] = (v, v, v)
                elif min(rr, g) - b > 60:        # fundo amarelo de marca-texto: idem
                    v = min(rr, g)
                    px[x, y] = (v, v, v)
                elif b - max(rr, g) > 30:          # destaque azul: escurece na proporção da tinta
                    t = min(1.0, (255 - min(rr, g)) / 200)
                    v = int(255 - t * 220)
                    px[x, y] = (v, v, v)
                elif rr - max(g, b) > 40:          # pixel puxado para o vermelho (inclui o antisserrilhado)
                    v = 255 - (rr - max(g, b))   # intensidade da tinta
                    v = max(0, min(255, int(max(g, b) * 0 + v)))
                    px[x, y] = (v, v, v)
    return im


def apagaveis(pdf, cfg):
    """Linhas a pintar de branco no print: rodapé/cabeçalho de página que encosta no fim da questão (cfg 'apagar')."""
    out = {}
    if cfg.get('apagar_girado'):
        # marca-d'água em texto girado ao longo da calha ("ENEM 2022 ENEM 2022 ..."): pintada de branco em toda a página
        for pg in pdf:
            rs = [pymupdf.Rect(l['bbox']) for b in pg.get_text('dict')['blocks'] for l in b.get('lines', [])
                  if abs(l['dir'][1]) > 0.9 and re.search(cfg['apagar_girado'], ''.join(s_['text'] for s_ in l['spans']))]
            if rs:
                out.setdefault(pg.number, []).extend(rs)
    if not cfg.get('apagar'):
        return out
    for pg in pdf:
        # só no alto ou no pé da página (um "7" solto no meio é numerador de fração, valor de eixo, célula de tabela)
        H = pg.rect.height
        rs = [pymupdf.Rect(L['bbox']) for L in linhas(pg) if any(re.search(rx, L['t']) for rx in cfg['apagar'])
              and (L['bbox'][1] > H * 0.82 or L['bbox'][3] < H * 0.1)]
        if rs:
            out.setdefault(pg.number, []).extend(rs)
    return out


def render(pdf, segs, marcas=None, coloridos=None, apagar=None):
    imgs = []
    for p, r in segs:
        if r.height < 8:
            continue
        pg = pdf[p]
        pix = pg.get_pixmap(clip=r, dpi=DPI)
        im = Image.open(BytesIO(pix.tobytes('png'))).convert('RGB')
        for ra in (apagar or {}).get(p, []):
            if ra.intersects(r):
                e_ = DPI / 72
                im.paste((255, 255, 255), (max(0, int((ra.x0 - r.x0) * e_) - 2), max(0, int((ra.y0 - r.y0) * e_) - 2),
                                           min(im.width, int((ra.x1 - r.x0) * e_) + 3), min(im.height, int((ra.y1 - r.y0) * e_) + 3)))
        if marcas and p in marcas:
            im = realinha(im, r, marcas[p], DPI / 72)
        if coloridos and p in coloridos:
            im = neutraliza(im, r, coloridos[p], DPI / 72)
        im = apara(im)
        if im is not None:
            imgs.append(im)
    if not imgs:
        return None
    w = max(i.width for i in imgs)
    gap = 14
    h = sum(i.height for i in imgs) + gap * (len(imgs) - 1)
    out = Image.new('RGB', (w, h), 'white')
    y = 0
    for i in imgs:
        out.paste(i, (0, y))
        y += i.height + gap
    if out.width > LARG_MAX:
        out = out.resize((LARG_MAX, round(out.height * LARG_MAX / out.width)), Image.LANCZOS)
    return out


NOME_MATERIA = {'bio': 'Biologia', 'qui': 'Química', 'mat': 'Matemática', 'por': 'Língua Portuguesa', 'fis': 'Física',
                'geo': 'Geografia', 'his': 'História', 'fs': 'Filosofia e Sociologia', 'ing': 'Inglês'}


def apara(im):
    """Corta faixas brancas em cima e embaixo (mantém margem lateral, para não deslocar o texto)."""
    bg = Image.new('RGB', im.size, 'white')
    diff = ImageChops.difference(im, bg).convert('L').point(lambda v: 255 if v > 24 else 0)
    # fios verticais (separador de colunas, moldura da questão) não contam como conteúdo
    if im.height > 60:
        col = diff.resize((im.width, 1), Image.BOX)     # média de cada coluna de pixels
        escuras = [col.getpixel((x, 0)) > 255 * 0.5 for x in range(im.width)]
        fios, x = [], 0
        while x < im.width:              # só faixas finas (até 4 px): uma imagem escura larga não é fio
            if escuras[x]:
                ini = x
                while x < im.width and escuras[x]:
                    x += 1
                if x - ini <= 4:
                    fios += range(ini, x)
            else:
                x += 1
        if fios:
            diff = diff.copy()
            for x in fios:
                diff.paste(0, (max(0, x - 1), 0, min(im.width, x + 2), im.height))
    borda = min(14, im.width // 10)
    miolo = diff.crop((borda, 0, im.width - borda, im.height))
    bb = miolo.getbbox()
    if not bb:
        return None
    _, y0, _, y1 = bb
    bbx = diff.crop((0, y0, im.width, y1)).getbbox()
    x0, x1 = (bbx[0], bbx[2]) if bbx else (0, im.width)
    return im.crop((max(0, x0 - 6), max(0, y0 - 6), min(im.width, x1 + 6), min(im.height, y1 + 6)))


def ocr_imagem(img):
    """Texto (para busca) lido por OCR do próprio print: caderno com camada de texto em codificação própria
    (cfg 'texto_ocr_print', ENEM 2021)."""
    b = BytesIO()
    img.convert('RGB').save(b, 'PNG')
    doc = pymupdf.open(stream=b.getvalue(), filetype='png')
    pdf = pymupdf.open('pdf', doc.convert_to_pdf())
    pg = pdf[0]
    t = pg.get_text(textpage=pg.get_textpage_ocr(language='por', dpi=150, full=True))
    t = re.sub(r'[ \t]+', ' ', t)
    return re.sub(r'\n{3,}', '\n\n', t).strip()


_GIRADO_RX = None   # cfg 'apagar_girado' da prova em processamento


def texto(pdf, segs):
    t = []
    for p, r in segs:
        par = textpage(pdf[p])
        if par:   # o textpage de OCR ignora o clip: filtra as linhas pela posição
            ls = []
            for b in par[0].get_text('dict', textpage=par[1])['blocks']:
                for l in b.get('lines', []):
                    x0, y0, x1, y1 = l['bbox']
                    if r.x0 - 2 <= (x0 + x1) / 2 <= r.x1 + 2 and r.y0 - 2 <= (y0 + y1) / 2 <= r.y1 + 2:
                        ls.append(''.join(s_['text'] for s_ in l['spans']))
            t.append('\n'.join(ls))
        else:
            # só as linhas cujo centro está no recorte (o rótulo da questão seguinte, com fonte alta, encosta na borda)
            ls = []
            for b in pdf[p].get_text('dict', clip=r)['blocks']:
                for l in b.get('lines', []):
                    y0_, y1_ = l['bbox'][1], l['bbox'][3]
                    lt = ''.join(s_['text'] for s_ in l['spans'])
                    if _GIRADO_RX and abs(l['dir'][1]) > 0.9 and re.search(_GIRADO_RX, lt):
                        continue   # marca-d'água girada ('apagar_girado'): não é texto da questão
                    if r.y0 - 1 <= (y0_ + y1_) / 2 <= r.y1 + 1 and not re.fullmatch(r'(?i)\s*quest[ãa]o\s*', lt):
                        ls.append(lt)
            t.append('\n'.join(ls))
    s = '\n'.join(t)
    s = re.sub(r'[ \t]+', ' ', s)
    s = re.sub(r'\n{3,}', '\n\n', s)
    if re.search(r'[˜´`ˆ¸]', s):   # caderno em LaTeX: acento solto ("Hist´oria") junto de novo
        s = unicodedata.normalize('NFC', acentos_latex(s))
    return s.strip()


def marcas_de_resposta(pdf, glifo):
    """Onde o caderno marca a resposta (ex.: ►B): a letra e o texto da alternativa, e para onde cada um
    deve voltar para ficar igual às outras alternativas. {página: [(y0, y1, xl, xc, al, ac)]} em pontos."""
    out = {}
    for pg in pdf:
        chars = []
        for b in pg.get_text('rawdict')['blocks']:
            for l in b.get('lines', []):
                for s_ in l['spans']:
                    for c in s_['chars']:
                        if c['c'].strip():
                            chars.append(c)

        def conteudo(xmin, y0, y1):
            """x do primeiro caractere à direita de xmin na mesma faixa de altura (o texto da alternativa)."""
            cand = [c['bbox'][0] for c in chars
                    if xmin < c['bbox'][0] < xmin + 60 and min(c['bbox'][3], y1) - max(c['bbox'][1], y0) > 0.25 * (y1 - y0)
                    and c['c'] != glifo]
            return min(cand) if cand else None

        alts = []   # (x letra, x conteúdo, y0, y1, marcada?)
        for b in pg.get_text('rawdict')['blocks']:
            for l in b.get('lines', []):
                cs = [c for s_ in l['spans'] for c in s_['chars']]
                txt = ''.join(c['c'] for c in cs)
                m = re.match(r'^\s*(' + re.escape(glifo) + r')?\s*([A-Ea-e])\)', txt)
                if not m:
                    continue
                letra, par = cs[m.start(2)], cs[m.end() - 1]
                y0, y1 = letra['bbox'][1], letra['bbox'][3]
                alts.append((letra['bbox'][0], conteudo(par['bbox'][2] - 0.5, y0, y1), y0, y1, bool(m.group(1))))
        # recuo típico letra -> texto nesta página (para quando o texto de uma alternativa não é achado)
        recuos = sorted(a[1] - a[0] for a in alts if not a[4] and a[1] is not None)
        recuo = recuos[len(recuos) // 2] if recuos else None
        alts = [(a[0], a[1] if a[1] is not None or a[4] or recuo is None else a[0] + recuo, *a[2:]) for a in alts]
        lista = []
        for xl, xc, y0, y1, marcada in alts:
            if not marcada:
                continue
            viz = [a for a in alts if not a[4] and abs(a[2] - y0) < 400 and a[0] <= xl + 1]
            if not viz:
                continue
            # mesma coluna de alternativas (x arredondado) e, entre elas, a mais próxima na altura
            ref = max(viz, key=lambda a: (round(a[0]), -abs(a[2] - y0)))
            lista.append((y0, y1, xl, xc, ref[0], ref[1]))
        if lista:
            out[pg.number] = lista
    return out


def realinha(im, clip, marcas, escala):
    """Move a letra e o texto da alternativa marcada para o mesmo alinhamento das outras (mesmos pixels)."""
    for y0, y1, xl, xc, al, ac in marcas:
        if y1 < clip.y0 or y0 > clip.y1:
            continue
        top = max(0, round((y0 - clip.y0) * escala) - 1)
        bot = min(im.height, round((y1 - clip.y0) * escala) + 1)
        px = lambda x: round((x - clip.x0) * escala)
        pecas = []
        if xc is not None and ac is not None:
            pecas.append((px(xl) - 2, px(xc) - 2, px(al) - 2))           # "D)"
            pecas.append((px(xc) - 2, im.width, px(ac) - 2))              # texto da alternativa
        else:
            pecas.append((px(xl) - 2, im.width, px(al) - 2))
        cortes = [(im.crop((a, top, b, bot)), destino) for a, b, destino in pecas if b > a > 0]
        im.paste((255, 255, 255), (min(px(al), px(xl)) - 3, top, im.width, bot))
        for faixa, destino in cortes:
            im.paste(faixa, (max(0, destino), top))
    return im


def redige(pdf, glifo):
    """Apaga só o glifo indicado (ex.: ► que marca a resposta no caderno da UFPR), sem mexer no resto."""
    n = 0
    for pg in pdf:
        for r in pg.search_for(glifo):
            r = pymupdf.Rect(r.x0, r.y0 + r.height * 0.15, r.x1 - r.width * 0.12, r.y1 - r.height * 0.15)
            pg.add_redact_annot(r, fill=(1, 1, 1))
            n += 1
        pg.apply_redactions(images=pymupdf.PDF_REDACT_IMAGE_NONE, graphics=pymupdf.PDF_REDACT_LINE_ART_NONE)
    return n


def troca(x, pares):
    if isinstance(x, str):
        for a, b in pares:
            x = x.replace(a, b)
        return re.sub(r'[ \t]{2,}', ' ', x).strip() if '\n' not in x else re.sub(r'[ \t]{2,}', ' ', x)
    if isinstance(x, list):
        return [troca(v, pares) for v in x]
    if isinstance(x, dict):
        return {k: troca(v, pares) for k, v in x.items()}
    return x


def rotulo_caderno(cad):
    """Nome do caderno para o aluno, quando a prova junta cadernos de numeração própria (2º dia, período, prova 2)."""
    if cad.get('rotulo'):
        return cad['rotulo']
    a = cad['arquivo']
    m = re.match(r'^d(\d)-', a)
    if m:
        return f'{m.group(1)}º dia'
    m = re.match(r'^p(\d)-', a)
    if m:
        return f'Prova {m.group(1)}'
    for k in ('matutino', 'vespertino', 'noturno'):
        if k in a:
            return f'período {k}'
    return a


def numeros_do_caderno(cads, questoes):
    """Número impresso no caderno oficial (ex.: a 51 da prova = questão 9 do caderno do 2º dia): campo 'nq' de cada
    questão, só nas provas que renumeram um caderno (deslocamento). O 'n' (ordem na prova) e o id não mudam."""
    if not any(c.get('deslocamento') for c in cads):
        return
    for q in questoes:
        for c in cads:
            lo, hi = c.get('questoes', (1, 999))
            if c['arquivo'] == q.get('caderno') and lo <= q['n'] <= hi:
                q['nq'] = f"{q['n'] - c.get('deslocamento', 0)} ({rotulo_caderno(c)})"
                break


def processa(pid, amostra=False, so_texto=False):
    cfg = PROVAS[pid]
    global _GIRADO_RX
    _GIRADO_RX = cfg.get('apagar_girado')
    pasta = ENTRADA / pid
    man = json.loads((pasta / 'manifesto.json').read_text())
    destino = SAIDA / pid
    import shutil
    anteriores = {}
    cls_anterior = {}   # classificação já feita (para 'area_da_materia')
    if cfg.get('area_da_materia') and (destino / 'prova.json').exists():
        cls_anterior = {q['n']: q for q in json.loads((destino / 'prova.json').read_text())['questoes']}
    if so_texto:   # refaz só a transcrição, reaproveitando os prints já gerados
        anteriores = {q['n']: q for q in json.loads((destino / 'prova.json').read_text())['questoes']}
    elif (destino / 'q').exists():
        shutil.rmtree(destino / 'q')  # nunca misturar recortes de uma rodada anterior
    (destino / 'q').mkdir(parents=True, exist_ok=True)
    questoes = {}
    relatorio = {'sem_gabarito': [], 'anuladas': [], 'faltando': [], 'duplicadas': [], 'suspeitas': []}
    gab = cfg['gabarito'](pasta)
    cads = cfg['cadernos'](pasta) if callable(cfg['cadernos']) else cfg['cadernos']
    for cad in cads:
        arq = pasta / (cad['arquivo'] + '.pdf')
        pdf = pymupdf.open(arq)
        conserta_bbox(pdf)
        _cache_linhas.clear()
        _cache_selos.clear()
        _cache_caixas.clear()
        _cache_faixas.clear()
        _cache_cols.clear()  # chave usa id() do documento: não pode sobreviver de um caderno para outro
        _OCR.clear()
        _OCR_SO_TEXTO.clear()
        if cad.get('ocr_so_texto'):   # camada de texto sem mapa de caracteres: números legíveis, palavras não
            _OCR[id(pdf)] = {}
            _OCR_SO_TEXTO.add(id(pdf))
        sem_texto = sum(1 for pg in pdf if len(pg.get_text().strip()) < 50)
        if cad.get('ocr') or (cad.get('ocr_se_vazio') and sem_texto > len(pdf) / 2):
            _OCR[id(pdf)] = {}   # caderno sem camada de texto: localiza as questões por OCR (o print segue sendo a página)
        coloridos = trechos_coloridos(pdf, cfg['neutralizar_cores']) if cfg.get('neutralizar_cores') else None
        marcas = None
        if cfg.get('redigir'):
            marcas = marcas_de_resposta(pdf, cfg['redigir'])
            redige(pdf, cfg['redigir'])
        faixa_pag = cad.get('paginas')
        cfg['_arquivo'] = cad['arquivo']
        apaga = apagaveis(pdf, cfg)
        ev = eventos_do_pdf(pdf, cfg, faixa_pag)
        if cfg.get('ancora_dy'):
            # fração no alto da 1ª linha ("Se x = (√5 − √2)/2"): o numerador fica acima da linha da âncora; a questão
            # começa mais acima (e a anterior termina antes dele). Chave: número da questão no site.
            for e in ev:
                if e['tipo'] == 'q' and e['n'] + cad.get('deslocamento', 0) in cfg['ancora_dy']:
                    e['y'] += cfg['ancora_dy'][e['n'] + cad.get('deslocamento', 0)]
        if cad.get('sem_suporte'):   # caderno em que os textos vêm dentro da questão, depois do número
            ev = [e for e in ev if e['tipo'] != 'suporte']
        if cfg.get('suporte_interno'):
            # "Questão 17" seguida logo abaixo de "TEXTO 1": o texto é da própria questão (e os textos seguintes também)
            ok, ult_q, dentro = [], None, False
            for e in ev:
                if e['tipo'] == 'q':
                    # texto colado ao número: os textos seguintes ("Texto 2") também são da questão
                    ult_q, dentro = e, bool(e.get('texto_colado'))
                elif e['tipo'] == 'suporte' and ult_q and (dentro or (e['p'] == ult_q['p'] and e['c'] == ult_q['c'] and 0 <= e['y'] - ult_q['y'] < cfg['suporte_interno'])
                                                           or (e['p'] == ult_q['p'] + 1 and ult_q['y'] > pdf[ult_q['p']].rect.height * 0.8
                                                               and e['y'] < topo_de(pdf[e['p']], cfg) + 30)):
                    dentro = True
                    continue
                elif e['tipo'] in ('corte', 'secao'):
                    ult_q, dentro = None, False
                ok.append(e)
            ev = ok
        if cad.get('so_secao'):
            # caderno único com a numeração recomeçando em cada matéria (Unicentro: Biologia 1–9, Física 1–9...):
            # cada matéria é lida como um caderno à parte; os títulos de seção ficam, para encerrar a última questão
            ok, dentro = [], False
            for e in ev:
                if e['tipo'] == 'secao':
                    dentro = e['nome'] == cad['so_secao']
                    ok.append(e)
                elif dentro:
                    ok.append(e)
            ev = ok
        if cfg.get('pular_antes_sequencia'):
            # seção pulada (língua espanhola) sai antes do filtro de sequência: a numeração recomeça no inglês
            ok, pula = [], False
            for e in ev:
                if e['tipo'] == 'secao':
                    pula = e['nome'] in cfg.get('pular_secoes', ())
                if not pula or e['tipo'] == 'secao':
                    ok.append(e)
            ev = ok
        if cfg.get('sequencial'):
            ok, ult = [], (cad['questoes'][0] - cad.get('deslocamento', 0) - 1) if cad.get('questoes') else None
            for e in ev:
                if e['tipo'] == 'q':
                    if e['n'] is None:
                        if ult is None:
                            continue
                        e['n'] = ult + 1   # "Questão" sem o número legível (OCR): é a próxima da sequência
                    if ult is not None and e['n'] != ult + 1:
                        continue
                    ult = e['n']
                ok.append(e)
            ev = ok
        if cfg.get('fim'):
            limpos = []
            for k, e in enumerate(ev):
                if e['tipo'] == 'suporte':
                    prox = next((x for x in ev[k + 1:] if x['tipo'] != 'suporte'), None)
                    if prox and prox['tipo'] == 'fim':
                        continue  # o texto está dentro do enunciado da questão corrente
                    ant = next((x for x in reversed(ev[:k]) if x['tipo'] != 'suporte'), None)
                    if cfg.get('ignora_apos_fim') and ant and ant['tipo'] == 'fim' and not e['faixa']:
                        continue  # frase da justificativa da banca, não é texto de apoio
                limpos.append(e)
            ev = limpos
        vistos = set()
        segs_de = {}
        apoio_de = {}   # n -> texto de apoio que a questão recebeu (para 'apoio_de')
        suporte = None
        gerais = []   # instruções gerais de uma faixa larga, que seguem valendo dentro dela
        secao = None
        textos = {}   # suportes numerados da seção ("Texto 1", "Texto 2"), para questões que os mencionam
        liberado = not cad.get('depois_de')
        for i, e in enumerate(ev):
            if e['tipo'] == 'secao':
                secao = e['nome']
                liberado = liberado or secao == cad.get('depois_de')
                suporte = None
                gerais = []
                textos = {}
                continue
            if not liberado or secao in cfg.get('pular_secoes', ()):
                continue
            if e['tipo'] == 'suporte':
                segs_s = segmentos(pdf, cfg, ev, i, faixa_pag)
                # 2º dia que recomeça em 1: "texto para as questões 11 e 12" = 53 e 54 na numeração da prova
                e = dict(e, faixa=[v + cad.get('deslocamento', 0) for v in e['faixa']])
                if suporte and suporte.get('aberto'):
                    f0 = suporte['faixa']
                    if len(f0) >= 2 and len(e['faixa']) >= 2 and f0[0] <= e['faixa'][0] and e['faixa'][1] < f0[1]:
                        # instrução geral ("texto para as questões 10 a 18": constantes, g = 10) seguida de um texto
                        # só de parte delas ("10 a 12"): a geral continua valendo para 13 a 18
                        gerais.append({'segs': list(suporte['segs']), 'faixa': f0})
                    suporte['segs'] += segs_s  # Texto 1 + Texto 2 seguidos: os dois valem
                    if e['faixa']:
                        suporte['faixa'] = e['faixa']   # a indicação mais específica (a última) manda
                else:
                    if suporte and len(suporte['faixa']) >= 2 and suporte['segs'] not in [g_['segs'] for g_ in gerais]:
                        # texto que declara "questões 21 a 27" segue valendo até a 27, mesmo com outro texto no meio
                        gerais.append({'segs': list(suporte['segs']), 'faixa': suporte['faixa']})
                    suporte = {'segs': segs_s, 'faixa': e['faixa'], 'aberto': True, 'singular': e.get('singular')}
                if e.get('num') is not None:
                    for nt in [e['num']] + e.get('outros', []):
                        textos[nt] = segs_s
                continue
            if e['tipo'] == 'corte':
                # texto de apoio não atravessa um corte (troca de seção, opção de língua), salvo quando declara as
                # questões a que serve ("às questões 34 e 35"): aí segue valendo só para elas (ex.: quadro de rascunho no pé da coluna)
                if not (suporte and len(suporte['faixa']) >= 2):
                    suporte = None
                elif suporte:
                    suporte['aberto'] = False
                continue
            if e['tipo'] != 'q':
                continue
            if suporte:
                suporte['aberto'] = False
            n = e['n'] + cad.get('deslocamento', 0)   # 2º dia que recomeça em 1
            lo, hi = cad.get('questoes', (1, 999))
            if not (lo <= n <= hi):
                continue
            if cfg.get('sequencial') and vistos and n != max(vistos) + 1:
                continue  # número solto no meio do texto (fórmula, índice), não é início de questão
            if n in vistos or n in questoes:
                relatorio['duplicadas'].append(n)  # ex.: ENEM 1–5 na opção espanhol (fica a opção inglês)
                suporte = None
                continue
            vistos.add(n)
            segs = segmentos(pdf, cfg, ev, i, faixa_pag)
            sup = []
            if suporte:
                f = suporte['faixa']
                if len(f) >= 2 and f[0] <= n <= f[1]:
                    sup = suporte['segs']
                elif len(f) < 2 and cfg.get('suporte_ate_proximo') and cfg.get('suporte_primeira') and not suporte.get('usado'):
                    sup = suporte['segs']   # o texto logo antes da questão é dela (tirinha, gráfico), mesmo sem citação
                    suporte['usado'] = True
                elif len(f) < 2 and cfg.get('suporte_ate_proximo'):
                    # texto compartilhado só entra na questão que o menciona
                    enun = texto(pdf, segs)
                    citados = textos_citados(enun, cfg)
                    if citados and all(c in textos for c in citados):
                        sup = []
                        for c in sorted(set(citados)):
                            sup += [sg for sg in textos[c] if sg not in sup]
                    elif not citados and not (cfg.get('suporte_cadeia') and suporte.get('quebrado')) \
                            and len(enun) < cfg.get('suporte_cita_max', 700) and re.search(r'(?i)\b(o texto|do texto|no texto|ao texto|crônica|poema|canção|reportagem|artigo|trecho|fragmento|the text|picture|comic|cartoon|tirinha|charge' + cfg.get('suporte_palavras', '') + r')\b', re.sub(r'\s+', ' ', enun)):
                        sup = suporte['segs']
                    if not sup:   # o bloco de questões do texto acabou: as seguintes só o levam se o citarem
                        suporte['quebrado'] = True
                elif len(f) < 2 and cfg.get('suporte_secao') and suporte.get('singular'):
                    # "para responder à questão que a ele se refere" (suporte_singular): só a questão seguinte
                    if not suporte.get('usado'):
                        sup = suporte['segs']
                        suporte['usado'] = True
                elif len(f) < 2 and cfg.get('suporte_secao'):
                    sup = suporte['segs']   # "Texto 1" vale para todas as questões até o próximo texto, corte ou seção
                elif len(f) < 2 and not suporte.get('usado'):
                    sup = suporte['segs']  # sem faixa declarada: vale só para a questão seguinte
                    suporte['usado'] = True
            if (cfg.get('suporte_ate_proximo') or cfg.get('cita_textos')) and textos:
                # questão que cita "Texto 1" / "Text 2" (às vezes com número de linha) leva esses textos, mesmo
                # quando já ganhou o texto logo antes dela; com 'cita_textos', vale também a citação feita na
                # instrução que a questão recebeu ("Para responder à questão 05, considere os textos 1 e 2.")
                cit = textos_citados(texto(pdf, segs), cfg)
                if cfg.get('cita_textos') and sup:
                    cit += textos_citados(texto(pdf, sup), cfg)
                for c in sorted(set(cit)):
                    if c in textos and not all(sg in sup for sg in textos[c]):
                        sup = list(sup) + [sg for sg in textos[c] if sg not in sup]
                if sup:   # ordem de leitura do caderno (Texto 1 antes do Texto 2)
                    sup = sorted(sup, key=lambda sg: (sg[0], sg[1].x0 // 200, sg[1].y0))
            for g_ in reversed(gerais):   # instrução geral da faixa, antes do texto próprio
                if g_['faixa'][0] <= n <= g_['faixa'][1] and not all(sg in sup for sg in g_['segs']):
                    sup = [sg for sg in g_['segs'] if sg not in sup] + list(sup)
            segs_de[n] = segs
            if n in cfg.get('sem_apoio', ()):   # conferido no caderno: o texto é da própria questão
                sup = []
            if n in cfg.get('apoio_de', {}):
                # questão que trata do texto inteiro dividido em partes ("Considerando o texto na íntegra (Partes I, II
                # e III)"): leva os textos de apoio das questões indicadas, na ordem do caderno
                extra = [sg for m_ in cfg['apoio_de'][n] for sg in apoio_de.get(m_, [])]
                todos = list(sup) + [sg for sg in extra if sg not in sup]
                sup = sorted(todos, key=lambda sg: (sg[0], sg[1].x0 // 200, sg[1].y0))
            apoio_de[n] = list(sup)
            if n in cfg.get('anexa', {}) and cfg['anexa'][n] in segs_de:
                # "ainda baseado no texto da questão anterior": o texto está dentro da questão citada, que vai junto
                sup = [sg for sg in segs_de[cfg['anexa'][n]] if sg not in sup] + list(sup)
            if so_texto and n in anteriores:
                class _Img:  # medidas do print já existente
                    width, height = anteriores[n]['larg'], anteriores[n]['alt']
                img = _Img()
            elif so_texto:
                continue
            else:
                img = render(pdf, sup + segs, marcas, coloridos, apaga)
            if img is None:
                relatorio['faltando'].append(n)
                continue
            if img.height > 12000:   # atravessou páginas demais: âncora seguinte não foi achada
                relatorio.setdefault('suspeitas', []).append(n)
                continue
            if not so_texto and (not amostra or len(questoes) < 6):
                img.save(destino / 'q' / f'{n:03d}.webp', 'WEBP', quality=80, method=6)
            # questão só de texto: transcrição fiel da camada de texto (nunca com figura, fórmula ou OCR)
            # 'sem_transcricao': True (prova toda) ou números do site — a transcrição não fica fiel: fica o print
            st = cfg.get('sem_transcricao')
            estr = None if (st is True or (st and n in st)) else transcreve(pdf, sup + segs, cfg['ancora'], tuple(cfg.get('corte', [])) + tuple(cfg.get('fim', [])) + tuple(cfg.get('apagar', [])),
                              cfg.get('alternativas', 5), ocr=id(pdf) in _OCR)
            g = gab.get(n)
            area_q = cfg['area'](n) if cfg.get('area_do_gabarito') else (secao or cfg['area'](n))
            if cfg.get('area_da_materia') and (cls_anterior.get(n) or {}).get('materia'):
                # caderno sem títulos de matéria: a área do simulado vem da matéria já classificada da questão
                area_q = NOME_MATERIA.get(cls_anterior[n]['materia'], area_q)
            questoes[n] = {
                'n': n, 'area': area_q, 'gab': g,
                'paginas': sorted({p + 1 for p, _ in segs}), 'caderno': cad['arquivo'],
                'texto': texto(pdf, sup + segs),
                'print': f'q/{n:03d}.webp', 'larg': img.width, 'alt': img.height,
            }
            if cfg.get('texto_ocr_print') and not so_texto:
                questoes[n]['texto'] = ocr_imagem(img)
            if cfg.get('troca_texto'):   # caractere usado no PDF no lugar do espaço (ex.: "¬" na Fuvest 2026)
                questoes[n]['texto'] = troca(questoes[n]['texto'], cfg['troca_texto'])
                if estr:
                    estr = troca(estr, cfg['troca_texto'])
                    estr['enun'] = [b for b in estr.get('enun', []) if not isinstance(b, dict) or str(b.get('t', 'x')).strip()]
            if estr:
                questoes[n]['transcricao'] = estr
            elif os.environ.get('MOTIVOS'):
                from transcreve import MOTIVO
                print('  sem texto', n, MOTIVO.get('ultimo'))
    esperado = cfg['total'] if 'total' in cfg else cfg['total_de'](pasta)
    for n in range(1, esperado + 1):
        if n not in questoes:
            relatorio['faltando'].append(n)
        elif questoes[n]['gab'] in (None, ''):
            relatorio['sem_gabarito'].append(n)
        elif questoes[n]['gab'] == 'X':
            relatorio['anuladas'].append(n)
    validas = [q for q in questoes.values() if q['gab'] in tuple('ABCDE')]
    numeros_do_caderno(cads, validas)
    for q in validas:
        h = hashlib.sha1(f"{man['arquivos'][q['caderno']]['sha256']}:{q['n']}".encode()).hexdigest()[:8]
        q['id'] = 'P' + h
    prova = {
        'id': pid, 'catalogoId': cfg['catalogo'], 'escola': cfg['escola'], 'ano': cfg['ano'], 'fase': cfg.get('fase', ''),
        'titulo': cfg['titulo'], 'banca': cfg.get('banca', ''), 'total_oficial': esperado,
        'duracao_horas': cfg.get('duracao_horas'),
        'alternativas': cfg.get('alternativas', 5),
        'fontes': {k: v['url'] for k, v in man['arquivos'].items()},
        'nota': cfg.get('nota', ''),
        'questoes': sorted(validas, key=lambda q: q['n']),
        'fora': {k: sorted(set(v)) for k, v in relatorio.items() if v},
    }
    # classificação já feita (matéria, tema, conteúdo, nível) sobrevive a um novo recorte: o id é estável
    if (destino / 'prova.json').exists():
        antes = {q['id']: q for q in json.loads((destino / 'prova.json').read_text()).get('questoes', []) if q.get('id')}
        for q in prova['questoes']:
            for k in ('materia', 'tema', 'conteudo', 'nivel'):
                if k in antes.get(q['id'], {}):
                    q[k] = antes[q['id']][k]
    if so_texto:   # a lista de fora (anuladas etc.) é a da rodada completa anterior
        prova['fora'] = json.loads((destino / 'prova.json').read_text()).get('fora', {})
    (destino / 'prova.json').write_text(json.dumps(prova, ensure_ascii=False, indent=1) + '\n')
    return prova


if __name__ == '__main__':
    ids = [a for a in sys.argv[1:] if not a.startswith('--')]
    for pid in ids:
        p = processa(pid, amostra='--amostra' in sys.argv, so_texto='--so-texto' in sys.argv)
        nt = sum(1 for q in p['questoes'] if q.get('transcricao'))
        print(f"{pid}: {len(p['questoes'])} de {p['total_oficial']} válidas · {nt} em texto · fora: {p['fora']}")

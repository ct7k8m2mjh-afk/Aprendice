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
import json, os, re, sys, hashlib
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


def textpage(pagina):
    """(página, textpage OCR) mantidos juntos: o textpage só vale para o mesmo objeto de página."""
    docs = _OCR.get(id(pagina.parent))
    if docs is None:
        return None
    if pagina.number not in docs:
        docs[pagina.number] = (pagina, pagina.get_textpage_ocr(language='por', dpi=220, full=True))
    return docs[pagina.number]


def linhas(pagina):
    out = []
    par = textpage(pagina)
    blocos = par[0].get_text('dict', textpage=par[1])['blocks'] if par else pagina.get_text('dict')['blocks']
    for b in blocos:
        for l in b.get('lines', []):
            t = ''.join(s['text'] for s in l['spans']).strip()
            if t:
                out.append({'bbox': l['bbox'], 't': t})
    return out


_cache_cols = {}


def colunas_da_pagina(pg, cfg):
    """Colunas da página. 'auto': uma coluna se muitas linhas atravessam o meio, senão duas."""
    k = (id(pg.parent), pg.number)
    if k in _cache_cols:
        return _cache_cols[k]
    c = cfg['colunas']
    if c == 'auto':
        w = pg.rect.width
        meio = w / 2
        ls = [l for l in linhas(pg) if cfg['topo'] <= l['bbox'][1] and l['bbox'][3] <= pg.rect.height - cfg['base'] and len(l['t']) > 12]
        cruzam = sum(1 for l in ls if l['bbox'][0] < meio - 25 and l['bbox'][2] > meio + 25)
        # questão começando na metade direita = página em duas colunas, com certeza
        ancora_direita = any(re.match(cfg['ancora'], l['t']) and meio - 8 <= l['bbox'][0] <= meio + 45 for l in ls + linhas(pg))
        m = cfg.get('margem', 15)
        um = ls and cruzam / len(ls) > 0.2 and not ancora_direita
        c = [(m, w - m)] if um else [(m, meio - 2), (meio - 2, w - m)]
    elif c == 'por_ancora':
        # duas colunas só quando há âncora na metade direita (cabeçalhos centralizados em cada coluna)
        w = pg.rect.width
        m = cfg.get('margem', 15)
        dir_ = any(re.match(cfg['ancora'], l['t']) and l['bbox'][0] > w / 2 + 10 for l in linhas(pg))
        esq = any(re.match(cfg['ancora'], l['t']) and l['bbox'][2] < w / 2 - 10 for l in linhas(pg))
        c = [(m, w / 2 - 2), (w / 2 - 2, w - m)] if dir_ and esq else [(m, w - m)]
    elif callable(c):
        c = c(pg.rect)
    _cache_cols[k] = c
    return c


def topo_de(pg, cfg):
    """Margem de cima da página (algumas provas têm quadro de instruções no alto da 1ª página de questões)."""
    return cfg.get('topo_pag', {}).get(pg.number + 1, cfg['topo'])


def limite_baixo(pg, cfg):
    """Altura máxima útil da página: acima do número de página do rodapé, quando a prova tem um."""
    lim = pg.rect.height - cfg['base']
    if cfg.get('rodape_num'):
        for l in linhas(pg):
            if re.fullmatch(r'\d{1,3}', l['t']) and l['bbox'][1] > pg.rect.height * 0.85:
                lim = min(lim, l['bbox'][1] - 3) if lim > l['bbox'][1] else lim
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


def eventos_do_pdf(pdf, cfg, faixa=None):
    """Lista de eventos em ordem de leitura: ('q', n) início de questão, ('fim',) fim de enunciado,
    ('corte',) cabeçalho a excluir, ('suporte', ini, fim) texto de apoio compartilhado."""
    ev = []
    for pi in range(len(pdf)):
        if faixa and not (faixa[0] <= pi + 1 <= faixa[1]):
            continue
        pg = pdf[pi]
        if pagina_cartaz(pg):
            # página só com arte de página inteira (ex.: aviso "IMPORTANTE" antes da redação): encerra a questão
            ev.append({'p': pi, 'c': 0, 'y': 0, 'tipo': 'corte'})
            continue
        cols = colunas_da_pagina(pg, cfg)
        lp = linhas(pg)
        for y in artes_sangradas(pg, lp):
            # arte de borda a borda sem texto por cima (ex.: aviso antes da redação): encerra a questão
            ev.append({'p': pi, 'c': 0, 'y': y, 'tipo': 'corte'})
        baixo = limite_baixo(pg, cfg)
        for li, L in enumerate(lp):
            x0, y0, x1, y1 = L['bbox']
            t = L['t']
            if y1 > baixo:
                continue
            c = coluna_de(x0, cols)
            if c is None:
                continue
            topo = topo_de(pg, cfg)
            if y0 < topo:
                # acima da margem só valem cortes (ex.: título da redação colado no topo)
                if y0 >= topo - 18 and any(re.search(rx, t) for rx in cfg.get('corte', [])):
                    ev.append({'p': pi, 'c': c, 'y': max(y0, topo), 'tipo': 'corte'})
                continue
            if cfg.get('secoes') and t.strip() in cfg['secoes']:
                ev.append({'p': pi, 'c': c, 'y': y0, 'tipo': 'secao', 'nome': cfg['secoes'][t.strip()]})
                continue
            m = re.match(cfg['ancora'], t)
            if m and x0 - cols[c][0] <= cfg.get('ancora_dx', 30):
                ev.append({'p': pi, 'c': c, 'y': y0, 'tipo': 'q', 'n': int(m.group(1))})
                continue
            for rx in cfg.get('fim', []):
                if re.search(rx, t):
                    ev.append({'p': pi, 'c': c, 'y': y0, 'tipo': 'fim'})
                    break
            else:
                for rx in cfg.get('corte', []):
                    if re.search(rx, t):
                        ev.append({'p': pi, 'c': c, 'y': y0, 'tipo': 'corte'})
                        break
                else:
                    for rx in cfg.get('suporte', []):
                        m = re.search(rx, t)
                        if m:
                            resto = t[m.start():] + ' ' + (lp[li + 1]['t'] if li + 1 < len(lp) else '')
                            mq = re.search(r'(?i)(quest|cuesti)\w*\W*(.*)', resto)
                            if mq:   # "Text 17 (for questions 18, 19, 20 and 21)" -> 18..21; só a lista logo após "questões"
                                ml = re.match(r'(?i)\s*(?:de|das|dos|nos|n[ºo°]s?\.?)?\s*(\d+)((?:\s*(?:,|\be\b|\ba\b|\band\b|\by\b|\bto\b|–|-)\s*\d+)*)', mq.group(2))
                                ns = [int(x) for x in re.findall(r'\d+', ml.group(0))] if ml else []
                                nums = [min(ns), max(ns)] if len(ns) >= 2 else ns
                            else:
                                nums = [int(x) for x in re.findall(r'\d+', resto)][:2]
                            mt = re.match(r'(?i)^texto\s+(\d+)', t)
                            yi = y0
                            # frase de instrução quebrada em duas linhas: começa na linha de cima
                            if li > 0 and coluna_de(lp[li - 1]['bbox'][0], cols) == c and 0 <= y0 - lp[li - 1]['bbox'][3] < 5 \
                                    and not re.match(cfg['ancora'], lp[li - 1]['t']) and lp[li - 1]['bbox'][1] >= cfg['topo']:
                                yi = lp[li - 1]['bbox'][1] - 2
                            ev.append({'p': pi, 'c': c, 'y': yi, 'tipo': 'suporte', 'faixa': nums if not mt else [],
                                       'num': int(mt.group(1)) if mt else None})
                            break
    ev.sort(key=lambda e: (e['p'], e['c'], e['y']))
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


def segmentos(pdf, cfg, ev, i, faixa_pag=None):
    """Regiões (página, retângulo) entre o evento i e o próximo, em ordem de leitura."""
    e = ev[i]
    prox = ev[i + 1] if i + 1 < len(ev) else None
    segs = []
    p, c, y = e['p'], e['c'], e['y'] - 3
    ultima = len(pdf) - 1 if not faixa_pag else faixa_pag[1] - 1
    while True:
        pg = pdf[p]
        cols = colunas_da_pagina(pg, cfg)
        bx = limite_baixo(pg, cfg)
        if prox and prox['p'] == p and prox['c'] == c:
            segs.append((p, pymupdf.Rect(cols[c][0] - 4, y, cols[c][1] + 4, prox['y'] - 2)))
            return segs
        segs.append((p, pymupdf.Rect(cols[c][0] - 4, y, cols[c][1] + 4, bx)))
        c += 1
        if c >= len(cols):
            c, p = 0, p + 1
            if p > ultima:
                return segs
        y = topo_de(pdf[p], cfg) if p < len(pdf) else cfg['topo']
        if not prox and p != e['p']:
            return segs  # última questão do caderno: não passa da própria página


def trechos_coloridos(pdf, cores):
    """Retângulos dos trechos de texto numa cor de destaque (ex.: alternativa correta em vermelho)."""
    out = {}
    for pg in pdf:
        rs = []
        for b in pg.get_text('dict')['blocks']:
            for l in b.get('lines', []):
                for sp in l['spans']:
                    if sp['color'] in cores and sp['text'].strip():
                        rs.append(pymupdf.Rect(sp['bbox']))
        if rs:
            out[pg.number] = rs
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
                if rr - max(g, b) > 40:          # pixel puxado para o vermelho (inclui o antisserrilhado)
                    v = 255 - (rr - max(g, b))   # intensidade da tinta
                    v = max(0, min(255, int(max(g, b) * 0 + v)))
                    px[x, y] = (v, v, v)
    return im


def render(pdf, segs, marcas=None, coloridos=None):
    imgs = []
    for p, r in segs:
        if r.height < 8:
            continue
        pg = pdf[p]
        pix = pg.get_pixmap(clip=r, dpi=DPI)
        im = Image.open(BytesIO(pix.tobytes('png'))).convert('RGB')
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


def texto(pdf, segs):
    t = []
    for p, r in segs:
        par = textpage(pdf[p])
        t.append(par[0].get_text('text', clip=r, textpage=par[1]) if par else pdf[p].get_text('text', clip=r))
    s = '\n'.join(t)
    s = re.sub(r'[ \t]+', ' ', s)
    s = re.sub(r'\n{3,}', '\n\n', s)
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
                m = re.match(r'^\s*(' + re.escape(glifo) + r')?\s*([A-E])\)', txt)
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


def processa(pid, amostra=False, so_texto=False):
    cfg = PROVAS[pid]
    pasta = ENTRADA / pid
    man = json.loads((pasta / 'manifesto.json').read_text())
    destino = SAIDA / pid
    import shutil
    anteriores = {}
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
        _cache_cols.clear()  # chave usa id() do documento: não pode sobreviver de um caderno para outro
        _OCR.clear()
        sem_texto = sum(1 for pg in pdf if len(pg.get_text().strip()) < 50)
        if cad.get('ocr') or (cad.get('ocr_se_vazio') and sem_texto > len(pdf) / 2):
            _OCR[id(pdf)] = {}   # caderno sem camada de texto: localiza as questões por OCR (o print segue sendo a página)
        coloridos = trechos_coloridos(pdf, cfg['neutralizar_cores']) if cfg.get('neutralizar_cores') else None
        marcas = None
        if cfg.get('redigir'):
            marcas = marcas_de_resposta(pdf, cfg['redigir'])
            redige(pdf, cfg['redigir'])
        faixa_pag = cad.get('paginas')
        ev = eventos_do_pdf(pdf, cfg, faixa_pag)
        if cfg.get('sequencial'):
            ok, ult = [], (cad['questoes'][0] - cad.get('deslocamento', 0) - 1) if cad.get('questoes') else None
            for e in ev:
                if e['tipo'] == 'q':
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
                limpos.append(e)
            ev = limpos
        vistos = set()
        suporte = None
        secao = None
        textos = {}   # suportes numerados da seção ("Texto 1", "Texto 2"), para questões que os mencionam
        liberado = not cad.get('depois_de')
        for i, e in enumerate(ev):
            if e['tipo'] == 'secao':
                secao = e['nome']
                liberado = liberado or secao == cad.get('depois_de')
                suporte = None
                textos = {}
                continue
            if not liberado or secao in cfg.get('pular_secoes', ()):
                continue
            if e['tipo'] == 'suporte':
                segs_s = segmentos(pdf, cfg, ev, i, faixa_pag)
                if suporte and suporte.get('aberto'):
                    suporte['segs'] += segs_s  # Texto 1 + Texto 2 seguidos: os dois valem
                    if e['faixa']:
                        suporte['faixa'] = e['faixa']   # a indicação mais específica (a última) manda
                else:
                    suporte = {'segs': segs_s, 'faixa': e['faixa'], 'aberto': True}
                if e.get('num') is not None:
                    for nt in [e['num']] + e.get('outros', []):
                        textos[nt] = segs_s
                continue
            if e['tipo'] == 'corte':
                suporte = None   # texto de apoio não atravessa um corte (troca de seção, opção de língua)
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
                elif len(f) < 2 and cfg.get('suporte_ate_proximo'):
                    # texto compartilhado só entra na questão que o menciona
                    enun = texto(pdf, segs)
                    citados = [int(x) for par in re.findall(r'(?i)textos?\s+(\d)(?:\s*e\s*(\d))?', enun) for x in par if x]
                    if citados and all(c in textos for c in citados):
                        sup = []
                        for c in sorted(set(citados)):
                            sup += [sg for sg in textos[c] if sg not in sup]
                    elif not citados and len(enun) < 700 and re.search(r'(?i)\b(o texto|do texto|no texto|ao texto|crônica|poema|canção|reportagem|artigo|trecho|fragmento)\b', enun):
                        sup = suporte['segs']
                elif len(f) < 2 and not suporte.get('usado'):
                    sup = suporte['segs']  # sem faixa declarada: vale só para a questão seguinte
                    suporte['usado'] = True
            if so_texto and n in anteriores:
                class _Img:  # medidas do print já existente
                    width, height = anteriores[n]['larg'], anteriores[n]['alt']
                img = _Img()
            elif so_texto:
                continue
            else:
                img = render(pdf, sup + segs, marcas, coloridos)
            if img is None:
                relatorio['faltando'].append(n)
                continue
            if img.height > 12000:   # atravessou páginas demais: âncora seguinte não foi achada
                relatorio.setdefault('suspeitas', []).append(n)
                continue
            if not so_texto and (not amostra or len(questoes) < 6):
                img.save(destino / 'q' / f'{n:03d}.webp', 'WEBP', quality=80, method=6)
            # questão só de texto: transcrição fiel da camada de texto (nunca com figura, fórmula ou OCR)
            estr = transcreve(pdf, sup + segs, cfg['ancora'], tuple(cfg.get('corte', [])) + tuple(cfg.get('fim', [])),
                              cfg.get('alternativas', 5), ocr=id(pdf) in _OCR)
            g = gab.get(n)
            questoes[n] = {
                'n': n, 'area': secao or cfg['area'](n), 'gab': g,
                'paginas': sorted({p + 1 for p, _ in segs}), 'caderno': cad['arquivo'],
                'texto': texto(pdf, sup + segs),
                'print': f'q/{n:03d}.webp', 'larg': img.width, 'alt': img.height,
            }
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

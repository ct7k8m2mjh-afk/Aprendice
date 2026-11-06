"""Transcrição fiel (decisão do dono, 02/11/2026): questão que é só texto aparece escrita no app.

O texto vem da camada de texto do PDF oficial (não é digitado), organizado como a banca organizou:
parágrafos, versos/quebras de linha, alinhamento (centro/direita), negrito e itálico, e as alternativas separadas.

Proibido transcrever (fica o print): questão com imagem, desenho/figura geométrica, tabela, fórmula
(fonte matemática, símbolos, índices/expoentes), texto com linhas numeradas, ou caderno lido por OCR.
Na dúvida, devolve None e a questão segue como print.
"""
import re
import statistics

import pymupdf

FONTES_MAT = re.compile(r'(?i)math|symbol|cmmi|cmsy|cmex|cmr\d|mt ?extra|stix|euclid|wingding|mathematica')
SIMBOLOS = set('√∑∫∏π≤≥≠±×÷→←↔⇌⇄∆ΔαβγδθλμρσφωΩ∞∝∠⊥∥≅≡∈∉⊂∪∩ⁿ⁰¹²³⁴⁵⁶⁷⁸⁹₀₁₂₃₄₅₆₇₈₉½¼¾')
# alternativa: "(A)", "A)", "a)", "A." ou "A<tab>" — nunca o artigo "A" seguido de palavra
# fora do latim e da pontuação comum = notação especial (matemática, grego, codificação estranha): fica o print
PERMITIDOS = set('“”‘’«»–—…•·°ºª§€£¢¥©®™†‡¶¿¡\u00a0\u2009\u202f\u200b\u2010\u2011\u00ad\u2032\u2033ﬁﬂﬀﬃﬄ')
VISUAL = re.compile(r'(?i)\b(gr[áa]fico|figura|imagem|imagens|tabela|quadro|charge|tirinha|tira|mapa|esquema|ilustra\w*|fotografia|foto|cartum|quadrinhos?|infogr[áa]fico|diagrama|cartaz|an[úu]ncio|propaganda|logotipo|pintura|obra a seguir|observe)\b')
# fórmula química no texto (CO2, H2O, NaClO3, O2) ou "Cl" que a camada de texto perdeu ("NaC,"): fica o print
FORMULA_QUIM = re.compile(r'\b(?:[A-Z][a-z]?\d{0,3}){1,}[A-Z][a-z]?\d{1,3}\b|\b[A-Z][a-z]?\d{1,3}(?:[A-Z][a-z]?\d{0,3})+\b'
                          r'|\b(?:H|O|N|S|P|F|I)\d\b|\b(?:[A-Z][a-z]?)?C,(?=[A-Z0-9(]|\s*[\(\[])|\b[A-Z][a-z]?C,\s')
# o enunciado ou as alternativas apontam linhas do texto ("linha 6", "(L. 15)", "line 3"): sem a numeração, fica o print
CITA_LINHA = re.compile(r'(?i)\blinhas?\s+\d|\(\s*l(?:s)?\.\s*\d|\blines?\s+\d|\bl\.\s*\d+\s*[\)\-–,]')
# cabeçalho/rodapé de página que cai no meio do recorte
CABECALHO = re.compile(r'(?i)^(vestibular|processo seletivo|concurso vestibular|exame)\b.{0,40}\b20\d\d(\s*[-–/.]\s*\d)?\s*$')
ALT = re.compile(r'^\s*(?:\(([A-Ea-e])\)|([A-Ea-e])\s?[\)\.](?!\d)|([A-E])\t)\s*')


def _spans(pg, clip):
    """Linhas do PDF dentro do recorte, com espaços reconstruídos pela distância entre letras
    (há PDFs que posicionam as palavras sem caractere de espaço)."""
    out = []
    for b in pg.get_text('rawdict', clip=clip)['blocks']:
        if b.get('type') != 0:
            continue
        for l in b['lines']:
            if abs(l['dir'][1]) > 0.01:
                continue   # texto girado (aviso de direitos na margem): não é parte da questão
            spans = []
            ult_x1 = None
            for s_ in l['spans']:
                txt = []
                for c in s_['chars']:
                    ch = c['c']
                    if not (clip.y0 - 1 <= c['origin'][1] <= clip.y1 + 3):
                        continue   # pedaço (descendente) de uma linha que está fora do recorte
                    if ult_x1 is not None and ch.strip() and c['bbox'][0] - ult_x1 > s_['size'] * 0.16 and (not txt or txt[-1] != ' '):
                        if not (spans and spans[-1]['text'].endswith(' ')) or txt:
                            txt.append(' ')
                    txt.append(ch)
                    if ch.strip():
                        ult_x1 = c['bbox'][2]
                t = ''.join(txt)
                if t:
                    spans.append({'text': t, 'font': s_['font'], 'flags': s_['flags'], 'size': s_['size'], 'origin': s_['origin']})
            if any(sp['text'].strip() for sp in spans):
                out.append({'bloco': b['number'], 'bbox': l['bbox'], 'spans': spans})
    return out


def _tem_figura(pg, clip, faixa_ancora=None):
    for im in pg.get_image_info():
        r = pymupdf.Rect(im['bbox']) & clip
        if not r.is_empty and min(r.width, r.height) >= 8 and r.width * r.height > 300:
            if faixa_ancora and r.y0 < faixa_ancora[1] + 3 and r.y1 > faixa_ancora[0] - 3 and r.height < 26:
                continue               # selo do cabeçalho da questão ("Questão 07" desenhado como imagem)
            if r.height <= 12 and r.width > 200:
                continue               # faixa decorativa fina
            return 'imagem %dx%d' % (r.width, r.height)
    horiz = vert = molduras = 0
    for d in pg.get_drawings():
        r = pymupdf.Rect(d['rect'])
        if not (r & clip).width or not r.intersects(clip):
            continue
        if r.height >= 6 and (r & clip).height < 6:
            continue                   # só a beirada de um desenho de fora (selo da questão seguinte) encosta no recorte
        if r.width > pg.rect.width * 0.8 and r.height > pg.rect.height * 0.6:
            continue                   # moldura/fundo da página inteira
        if r.height < 2.5:            # fio horizontal (sublinhado, régua, barra de fração fica para a checagem de fórmula)
            horiz += 1
            continue
        if r.width < 2.5:             # fio vertical: separador de colunas ou tabela
            vert += 1
            continue
        if faixa_ancora and r.y0 < faixa_ancora[1] + 3 and r.y1 > faixa_ancora[0] - 3 and r.height < 26:
            continue                   # enfeite do cabeçalho da questão (barra "QUESTÃO 07", caixinha do número)
        if d.get('fill') is not None and r.height <= 12:
            continue                   # fileira de pontos/barra decorativa
        tipos = {it[0] for it in d['items']}
        if (tipos <= {'re', 'qu'} or (tipos <= {'l', 'c'} and len(d['items']) <= 12)) and len(pg.get_text('text', clip=r).strip()) > 60:
            molduras += 1              # caixa (com ou sem fundo, cantos arredondados) em volta de texto de apoio
            continue
        if d.get('fill') is None and all(it[0] == 're' for it in d['items']) or (d.get('fill') is None and len(d['items']) == 4 and all(it[0] == 'l' for it in d['items'])):
            molduras += 1              # moldura em volta de texto
            continue
        return 'desenho %dx%d' % (r.width, r.height)
    if molduras >= 3 or (vert >= 2 and horiz >= 3):
        return 'tabela'
    return False


def _tem_formula(linhas):
    tamanhos = [s['size'] for l in linhas for s in l['spans']]
    if not tamanhos:
        return 'sem texto'
    base = statistics.median(tamanhos)
    for l in linhas:
        for s in l['spans']:
            if FONTES_MAT.search(s['font']):
                return 'fonte ' + s['font']
            if any(c in SIMBOLOS for c in s['text']):
                return 'simbolo ' + ''.join(c for c in s['text'] if c in SIMBOLOS)
            # índice/expoente: trecho bem menor que o texto e fora da linha de base
            mista = any(o['size'] >= 0.9 * base and o['text'].strip() for o in l['spans'])
            if mista and s['size'] < 0.78 * base and s['text'].strip() and (s['flags'] & 1 or abs(s['origin'][1] - l['bbox'][3]) > 2.5):
                if re.search(r'[\dA-Za-z+\-]', s['text']):
                    return 'indice ' + s['text'][:10]
    return False


def _linhas_numeradas(linhas):
    so_num = sum(1 for l in linhas if re.fullmatch(r'\d{1,3}', ''.join(s['text'] for s in l['spans']).strip()))
    return so_num >= 4


def _estilo(s):
    negrito = (bool(s['flags'] & 16) or bool(re.search(r'(?i)bold|black|heavy|semibold', s['font']))) and not s.get('base')
    italico = bool(s['flags'] & 2) or bool(re.search(r'(?i)italic|oblique', s['font']))
    return ('**' if negrito else '') + ('~~' if italico else '')   # itálico = ~~ (o _ aparece em lacunas "____")


def _texto_estilizado(spans):
    runs = []   # [estilo, texto], juntando trechos vizinhos de mesmo estilo (espaços não mudam o estilo)
    for s in spans:
        t = s['text']
        if not t:
            continue
        e = _estilo(s) if t.strip() else (runs[-1][0] if runs else '')
        if runs and runs[-1][0] == e:
            runs[-1][1] += t
        else:
            runs.append([e, t])
    out = []
    for e, t in runs:
        nucleo = t.strip()
        if nucleo and e:
            ini, fim = t[:len(t) - len(t.lstrip())], t[len(t.rstrip()):]
            t = ini + e + nucleo + e[::-1] + fim
        out.append(t)
    return re.sub(r'[ \t]+', ' ', ''.join(out)).strip()


def _limpa(t):
    """Religa palavras partidas no fim da linha e junta marcações vizinhas de mesmo estilo."""
    t = t.replace('\u00ad', '-').replace('\u2010', '-').replace('\u2011', '-')
    t = t.replace('\xa0', ' ').replace('\u2009', ' ').replace('\u202f', ' ')
    t = re.sub(r'[ \t]{2,}', ' ', t)
    t = t.replace('ﬁ', 'fi').replace('ﬂ', 'fl').replace('ﬀ', 'ff').replace('ﬃ', 'ffi').replace('ﬄ', 'ffl')
    t = re.sub(r'(\w)- -(\w)', r'\1-\2', t)                       # "expor- -se" -> "expor-se"
    t = re.sub(r'(\w)-[ \n]+(?=[a-zà-úç])', r'\1', t)                # "al- ternativa" -> "alternativa"
    t = re.sub(r'(\w)-(\*\*|~~)+[ \n]+(\*\*|~~)+(?=[a-zà-úç])', r'\1', t)  # o mesmo com estilo no meio
    for m in ('**', '~~'):
        q = re.escape(m)
        t = re.sub(q + r'(\s*)' + q, r'\1', t)                         # "**a** **b**" -> "**a b**"
    return t.strip()


MOTIVO = {'ultimo': None}


def _nao(m):
    MOTIVO['ultimo'] = m
    return None


def transcreve(pdf, segs, ancora, cortes=(), alternativas=5, ocr=False):
    """Devolve {'enun': [{'a': 'e'|'c'|'d', 't': texto}], 'alts': {'A': texto, ...}} ou None (fica o print)."""
    if ocr:
        return _nao('ocr')
    linhas = []
    faixas = []
    for p, clip in segs:
        pg = pdf[p]
        faixa = None
        for l in _spans(pg, clip):
            t_ = ''.join(sp['text'] for sp in l['spans']).strip()
            if re.match(ancora, t_) or re.fullmatch(r'(?i)quest[ãa]o', t_):   # "questão" e o número em linhas separadas
                faixa = (l['bbox'][1], l['bbox'][3])
                faixas.append((p, faixa))
                break
        f = _tem_figura(pg, clip, faixa)
        if f:
            return _nao('figura:' + str(f))
        ls = _spans(pg, clip)
        for l in ls:
            l['p'], l['col'] = p, (clip.x0, clip.x1)
        linhas += ls
    # camada de texto duplicada (ENEM 2023: a letra da alternativa aparece sozinha e de novo na linha inteira)
    def _txt(l):
        return ''.join(sp['text'] for sp in l['spans']).strip()
    unicas = []
    for i, l in enumerate(linhas):
        t = _txt(l)
        dup = any(j != i and m['p'] == l['p'] and abs(m['bbox'][0] - l['bbox'][0]) < 2 and abs(m['bbox'][1] - l['bbox'][1]) < 4
                  and len(_txt(m)) > len(t) and _txt(m).startswith(t) for j, m in enumerate(linhas))
        if not dup:
            unicas.append(l)
    linhas = unicas
    if not linhas:
        return _nao('vazio')
    # texto lado a lado (quadro à esquerda, enunciado à direita): a ordem de leitura não é segura
    for i, l in enumerate(linhas):
        for m in linhas[i + 1:]:
            if m['p'] == l['p'] and m['col'] == l['col'] and min(l['bbox'][3], m['bbox'][3]) - max(l['bbox'][1], m['bbox'][1]) > 4 \
                    and (m['bbox'][0] - l['bbox'][2] > 15 or l['bbox'][0] - m['bbox'][2] > 15) \
                    and min(len(_txt(l)), len(_txt(m))) > 3:
                return _nao('lado a lado')
    for l in linhas:
        for sp in l['spans']:
            for c in sp['text']:
                if ord(c) > 0x2FF and c not in PERMITIDOS:
                    return _nao('caractere especial %r' % c)
    tudo_txt = ' '.join(''.join(sp['text'] for sp in l['spans']) for l in linhas)
    if VISUAL.search(tudo_txt):
        return _nao('cita elemento visual')
    if FORMULA_QUIM.search(tudo_txt):
        return _nao('formula quimica ' + FORMULA_QUIM.search(tudo_txt).group(0))
    if CITA_LINHA.search(tudo_txt):
        return _nao('cita linha do texto')
    if _tem_formula(linhas):
        return _nao('formula:' + str(_tem_formula(linhas)))
    if _linhas_numeradas(linhas):
        return _nao('linhas numeradas')

    # fonte do texto corrido: se a banca compõe o texto todo em negrito (ex.: Lato-Bold), ele é o normal
    uso = {}
    for l in linhas:
        for sp in l['spans']:
            uso[sp['font']] = uso.get(sp['font'], 0) + len(sp['text'].strip())
    corrida = max(uso, key=uso.get) if uso else None
    if corrida and re.search(r'(?i)bold|black|heavy|semibold', corrida):
        for l in linhas:
            for sp in l['spans']:
                if sp['font'] == corrida:
                    sp['base'] = True
    # texto quase todo com a marca de negrito (flag do PDF, fonte sem "Bold" no nome): o negrito é o normal
    tot_c = sum(len(sp['text'].strip()) for l in linhas for sp in l['spans'])
    neg_c = sum(len(sp['text'].strip()) for l in linhas for sp in l['spans'] if sp['flags'] & 16)
    if tot_c and neg_c / tot_c > 0.6:
        for l in linhas:
            for sp in l['spans']:
                if sp['flags'] & 16:
                    sp['base'] = True

    # tira o número da questão (âncora) e o que for corte
    limpas = []
    for l in linhas:
        txt = ''.join(s['text'] for s in l['spans']).strip()
        if any(re.search(rx, txt) for rx in cortes) or re.fullmatch(r'[#*•·.\-–_\s]+', txt) or CABECALHO.match(txt):
            continue
        x0c_, x1c_ = l['col']
        if len(txt) <= 4 and not re.fullmatch(r'\(?[A-Ea-e][\)\.]?|[IVX]{1,4}[\.\)]?|\d{1,3}[\.\)]?', txt) \
                and (l['bbox'][0] - x0c_ < 9 or x1c_ - l['bbox'][2] < 9):
            continue   # pedaço de letra da coluna vizinha que entrou na borda do recorte
        if re.fullmatch(r'A{2,}', txt):
            continue
        if any(fp == l['p'] and l['bbox'][1] < fx[1] + 2 and l['bbox'][3] > fx[0] - 2 for fp, fx in faixas) \
                and re.fullmatch(r'(?i)(quest[ãa]o)?\s*\d{0,3}', txt):
            continue   # "questão" / "01" do selo da questão
        m = re.match(ancora, txt)
        if m:
            resto = txt[m.end():].strip()
            if not resto:
                continue
            # remove o prefixo do primeiro span
            corte = m.end()
            novos = []
            for s in l['spans']:
                if corte <= 0:
                    novos.append(s)
                    continue
                if len(s['text']) <= corte:
                    corte -= len(s['text'])
                    continue
                s = dict(s, text=s['text'][corte:])
                corte = 0
                novos.append(s)
            l = dict(l, spans=novos)
        limpas.append(l)

    # agrupa em parágrafos: mesmo bloco do PDF; quebra de linha preservada quando a linha é curta (verso, lista)
    paras = []
    for i, l in enumerate(limpas):
        x0c, x1c = l['col']
        larg = x1c - x0c
        txt = _texto_estilizado(l['spans'])
        if not txt:
            continue
        cru = ''.join(s['text'] for s in l['spans'])
        ma = ALT.match(cru)
        centro = (l['bbox'][0] + l['bbox'][2]) / 2
        if l['bbox'][0] - x0c > larg * 0.2 and abs(centro - (x0c + x1c) / 2) < larg * 0.08 and l['bbox'][2] - l['bbox'][0] < larg * 0.8:
            alin = 'c'
        elif l['bbox'][0] - x0c > larg * 0.35 and x1c - l['bbox'][2] < larg * 0.08:
            alin = 'd'
        else:
            alin = 'e'
        ant = limpas[i - 1] if i else None
        novo = (ant is None or ant['bloco'] != l['bloco'] or ant['p'] != l['p'] or ma is not None
                or (alin != 'e') or (paras and paras[-1]['a'] != 'e'))
        # palavra partida entre dois parágrafos/blocos ("reli-" / "gião"): continua o anterior
        if paras and novo and ma is None and alin == paras[-1]['a'] and re.search(r'[\w]-(\*\*|~~)*$', paras[-1]['t']) and re.match(r'(\*\*|~~)*[a-zà-úç]', txt):
            paras[-1]['t'] += '\n' + txt
            continue
        # endereço (URL) partido em dois parágrafos: continua sem espaço
        if paras and ma is None and not paras[-1]['alt'] and re.search(r'(https?://|www\.)\S*[-/_.]$', paras[-1]['t']) and re.match(r'[\w/]', txt):
            paras[-1]['t'] += txt
            continue
        # referência/fonte alinhada à direita partida em várias linhas: uma linha só
        if paras and ma is None and paras[-1]['a'] == 'd' and not paras[-1]['alt'] and ant is not None and ant['p'] == l['p'] \
                and 0 <= l['bbox'][1] - ant['bbox'][3] < 4 and len(paras[-1]['t']) < 300 \
                and (alin == paras[-1]['a'] or re.search(r'(?i)https?://|www\.|dispon[íi]vel em|acesso em|\bin:', paras[-1]['t'] + ' ' + txt)) \
                and (alin != 'e' or len(txt) < 120):
            junta = '' if re.search(r'[/\-_.]$', paras[-1]['t']) and re.match(r'[\w/]', txt) and 'http' in paras[-1]['t'] else ' '
            paras[-1]['t'] += junta + txt
            continue
        # frase partida na quebra de coluna/página/bloco: o anterior não terminou e este começa em minúscula
        if paras and novo and ma is None and alin == 'e' and paras[-1]['a'] == 'e' and not paras[-1]['alt'] \
                and ant is not None and (ant['p'] != l['p'] or ant['col'] != l['col'] or ant['bloco'] != l['bloco']) \
                and not re.search(r'[.!?:;”"\)](\*\*|~~)*$', paras[-1]['t']) and re.match(r'(\*\*|~~)*[a-zà-úç(“"]', txt):
            paras[-1]['t'] += ' ' + txt
            continue
        if paras and not novo:
            prev_curta = (ant['bbox'][2] < x1c - larg * 0.18)
            # item de lista ("II.", "3)", "IV –") começando linha depois de frase terminada: quebra a linha, como no caderno
            if re.match(r'(?:\*\*|~~)*(?:[IVX]{1,4}|\d{1,2})\s?[\.\)–-](?:\*\*|~~)*(?:\s|$)(?!\s*ed\b)', txt) and re.search(r'(?:\w{2}[.;:?!”"\)]|[\w”"\)\]][.;:?!][”"]?)(?:\*\*|~~)*$', paras[-1]['t']):
                prev_curta = True
            ultimo = paras[-1]
            if ultimo['t'].endswith('-') and not prev_curta and re.match(r'[a-zà-ú]', txt):
                ultimo['t'] = ultimo['t'][:-1] + txt
            else:
                ultimo['t'] += ('\n' if prev_curta else ' ') + txt
        else:
            letra = next((g for g in ma.groups() if g), None) if ma else None
            paras.append({'a': alin, 't': txt, 'alt': letra.upper() if letra else None})

    alts, enun = {}, []
    for pa in paras:
        if pa['alt'] and not enun_fechado(alts, pa['alt']):
            return _nao('ordem alternativas ' + ''.join(alts) + '+' + pa['alt'])
        if pa['alt']:
            # tira a letra (com ou sem marcação de estilo em volta): "**A)** texto", "(A) texto", "A texto"
            m_ = re.match(r'^\s*(?:\*\*|~~)*\s*\(?[A-Ea-e]\)?[\)\.]?\s*(?:\*\*|~~)*\s*', pa['t'])
            pre, t = m_.group(0), pa['t'][m_.end():]
            for mk in ('~~', '**'):   # marcação aberta antes da letra continua valendo no texto da alternativa
                if pre.count(mk) % 2:
                    t = mk + t
            t = re.sub(r'^\(\s*\)\s*', '', t)   # caixinha "( )" do cartão-resposta (UDESC)
            alts[pa['alt']] = _limpa(t)
        elif alts:
            # texto depois das alternativas: continuação da última alternativa (quebra de bloco)
            ult = list(alts)[-1]
            alts[ult] += ' ' + pa['t']
        else:
            enun.append({'a': pa['a'], 't': _limpa(pa['t'])})
    def _marcas_ok(t):
        # número do item sozinho na linha ("I." e o texto embaixo, em tabela): fica na mesma linha do texto
        t = re.sub(r'(?m)^((?:\*\*|~~)*(?:[IVX]{1,4}|\d{1,2})\s?[.)–-](?:\*\*|~~)*)\n(?=\S)', r'\1 ', t)
        for mk in ('~~', '**'):
            if t.count(mk) % 2:   # par quebrado: tira a marcação desse tipo (melhor sem estilo do que estilo trocado)
                t = t.replace(mk, '')
        return t
    alts = {k: _marcas_ok(v) for k, v in alts.items()}
    enun = [dict(b, t=_marcas_ok(b['t'])) for b in enun]
    letras = 'ABCDE'[:alternativas]
    if ''.join(alts) != letras or not enun or any(not v.strip() for v in alts.values()):
        return _nao('alternativas ' + ''.join(alts))
    return {'enun': enun, 'alts': alts}


def enun_fechado(alts, letra):
    """A próxima alternativa tem de ser a seguinte na ordem (A, B, C...)."""
    return 'ABCDE'.index(letra) == len(alts)

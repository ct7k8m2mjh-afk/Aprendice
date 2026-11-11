"""Provas dos links do dono (fontes/provas-manuais/, baixadas do Brasil Escola em 11/11/2026), grupo A:
Unicamp, UERJ, Santa Casa (FCMSCSP), Einstein, Famema, FMJ, São Camilo e Anhembi Morumbi.

MANUAIS: prova -> arquivos de fontes/provas-manuais/ (copiados por prepara_manuais.py) e a página oficial que o site
mostra como fonte. A origem real de cada arquivo (Brasil Escola) fica no manifesto e no campo `origem` do prova.json.
Só múltipla escolha com gabarito oficial/definitivo; anuladas ficam fora.
"""
import re

import provas as _p   # módulo parcialmente carregado: texto_pdf(), pares(), vunesp() já existem quando isto roda

COMVEST = 'https://www.comvest.unicamp.br/'
UERJ = 'https://www.vestibular.uerj.br/'
VUNESP = 'https://www.vunesp.com.br/'

U = 'unicamp/'
MANUAIS = {}
PROVAS = {}


def _m(pid, manifesto, oficial, limpa=None, **arquivos):
    MANUAIS[pid] = {'manifesto': manifesto, 'oficial': oficial, 'arquivos': arquivos, 'limpa': limpa}


def sem_logo_no_alto(pdf_path):
    """Cobre de branco o logotipo da instituição no alto de cada página (imagem pequena acima de y=100): o print de uma
    questão que começa no alto da coluna não leva o logo. Só a cópia de trabalho em fabrica_saida é alterada."""
    import pymupdf
    d = pymupdf.open(pdf_path)
    for pg in d:
        for b in pg.get_image_info():
            x0, y0, x1, y1 = b['bbox']
            if y1 < 100 and y1 - y0 < 80 and x1 - x0 < 180:
                pg.draw_rect(pymupdf.Rect(x0 - 1, y0 - 1, x1 + 1, y1 + 1), color=None, fill=(1, 1, 1), overlay=True)
    tmp = str(pdf_path) + '.tmp'
    d.save(tmp, garbage=0)
    d.close()
    import os
    os.replace(tmp, pdf_path)


# ------------------------------------------------------------------------------------------------------- Unicamp
_m('unicamp-2021', 'unicamp/47303', COMVEST, caderno=U + 'provas-e-gabaritos-unicamp-2021/1ª fase/Provas Q e Z.pdf',
   gabarito=U + 'provas-e-gabaritos-unicamp-2021/1ª fase/DIA2_gabarito_2020.pdf')
_m('unicamp-2021-exh', 'unicamp/47303', COMVEST, caderno=U + 'provas-e-gabaritos-unicamp-2021/1ª fase/Provas E e G.pdf',
   gabarito=U + 'provas-e-gabaritos-unicamp-2021/1ª fase/DIA1_gabarito_2021.pdf')
_m('unicamp-2022', 'unicamp/47406', COMVEST, caderno=U + 'provas-e-gabaritos-unicamp-2022/Primeira fase/prova-q-x.pdf',
   gabarito=U + 'provas-e-gabaritos-unicamp-2022/Primeira fase/gabarito-1-fase.pdf')
_U23 = U + 'provas-e-gabaritos-unicamp-2023/provas-gabaritos-vestibular-unicamp-2023/1º Fase/'
_m('unicamp-2023', 'unicamp/47558', COMVEST, caderno=_U23 + 'provas-unicamp-2023-q-e-z.pdf',
   gabarito=_U23 + 'gabaritos-1-fase-vestibular-2023-unicamp.pdf')
_U24 = U + 'provas-e-gabaritos-unicamp-2024/extraido/'   # extraído do .rar publicado
_m('unicamp-2024', 'unicamp/47614', COMVEST, caderno=_U24 + 'provas-q-y-unicamp-1-fase-2024.pdf',
   gabarito=_U24 + 'gabarito-p-y-unicamp-2024.pdf')
_U25 = U + 'provas-e-gabaritos-unicamp-2025/provas-e-gabaritos-unicamp-2025/provas-e-gabaritos-unicamp-vestibular-2025/1-fase-provas-gabaritos-unicamp-vestibular-2025/'
_m('unicamp-2025', 'unicamp/47681', COMVEST, caderno=_U25 + 'caderno-provas-Q-Z-vestibular-2025-unicamp.pdf',
   gabarito=_U25 + 'gabarito-Q-Z-1-fase-unicamp-vestibular-2025.pdf')
_U26 = U + 'provas-e-gabaritos-unicamp-2026/1-fase-unicamp-2026/'
_m('unicamp-2026', 'unicamp/47778', COMVEST, caderno=_U26 + 'prova-q-x-1-fase-unicamp-2026.pdf', gabarito=_U26 + 'gabarito-q-x-1-fase-unicamp-2026.pdf')
_U27 = U + 'provas-e-gabaritos-unicamp-2027/unicamp-2027/primeira-fase-unicamp-2027/'
_m('unicamp-2027', 'unicamp/47822', COMVEST, caderno=_U27 + 'unicamp-2027-fase-1-provas-Q-Y.pdf', gabarito=_U27 + 'unicamp-2027-fase-1-gabarito-Q-Y.pdf')
_m('unicamp-indigena-2021', 'unicamp/47359', COMVEST, caderno=U + 'prova-e-gabarito-unicamp-indigena-2021/prova-vi2021.pdf',
   gabarito=U + 'prova-e-gabarito-unicamp-indigena-2021/gabarito_Indigena_2021.pdf')
_m('unicamp-indigena-2022', 'unicamp/47483', COMVEST,
   caderno=U + 'provas-e-gabaritos-unicamp-e-ufscar-vestibular-indigena-2022/prova-vestibular-indigena-unicamp-ufscar-2022.pdf',
   gabarito=U + 'provas-e-gabaritos-unicamp-e-ufscar-vestibular-indigena-2022/gabarito-indigena-unicamp-ufscar-2022.pdf')

for _k in MANUAIS:
    if _k.startswith('unicamp'):
        MANUAIS[_k]['limpa'] = sem_logo_no_alto


def _gab_unicamp(versao):
    """Gabarito oficial da Comvest: uma página por par de versões ("PROVAS Q e Z"); '*' = anulada."""
    def gab(pasta):
        txt = _p.texto_pdf(pasta / 'gabarito.pdf')
        if versao:
            partes = re.split(r'GABARITO DA PROVA', txt)
            txt = next(t for t in partes if re.search(rf'PROVAS\s+{versao}\s+e\s', t))
        return _p.pares(txt, 'ABCD')
    return gab


def unicamp(pid, ano, titulo, fase, versao, total=72, nota_extra=''):
    PROVAS[pid] = {
        'catalogo': 'unicamp', 'escola': 'Unicamp', 'ano': str(ano), 'fase': fase, 'titulo': titulo, 'banca': 'Comvest',
        'duracao_horas': 5 if total == 72 else 4, 'total': total, 'alternativas': 4,
        'nota': f'Universidade Estadual de Campinas, Vestibular {titulo[8:]}: Prova de Conhecimentos Gerais ({total} questões '
                f'de múltipla escolha, A–D){nota_extra}. Caderno e gabarito oficiais da Comvest; anuladas ("*" no gabarito) '
                'ficam fora. Arquivos obtidos em cópia pública (Brasil Escola): a Comvest não permite acesso automático.',
        'cadernos': [{'arquivo': 'caderno', 'paginas': (2, 999)}],
        # páginas de duas colunas com faixas de largura total (figura e enunciado atravessando a calha): modo 'largas'
        'colunas': 'faixas', 'faixas_modo': 'largas', 'faixas_uma_auto': True, 'divisa': 299, 'margem': 24, 'topo': 40, 'base': 34,
        'ancora': r'^QUEST[ÃA]O\s+(\d{1,2})\s*$', 'ancora_dx': 20, 'sequencial': True, 'ancora_negrito': True,
        'corte': [r'^RASCUNHO', r'^PROPOSTA DE REDA', r'^REDA[ÇC][ÃA]O$', r'^CLASSIFICA[ÇC][ÃA]O PERI', r'^TABELA PERI'],
        'suporte': [r'(?i)^(USE|LEIA|CONSIDERE|OBSERVE)\b.*\b(responder|resolver)\b.*\bquest\w*\s+(de\s+)?\d', r'(?i)^textos? (comum|para)\b',
                    r'(?i)^o texto (abaixo|a seguir) ser[áa] (utilizado|usado)', r'(?i)para responder [àa]s?\s*$',
                    r'(?i)^nas quest[õo]es de \d+ a \d+', r'(?i)^para responder (a |à )?quest'],
        'gabarito': _gab_unicamp(versao), 'area': lambda n: 'Conhecimentos gerais', 'area_da_materia': True,
    }


unicamp('unicamp-2021', 2021, 'Unicamp 2021 – Biológicas e Saúde', '1ª fase – Biológicas e Saúde', 'Q',
        nota_extra=' da área de Ciências Biológicas e Saúde (provas Q e Z)')
unicamp('unicamp-2021-exh', 2021, 'Unicamp 2021 – Exatas e Humanas', '1ª fase – Exatas/Tecnológicas e Humanas/Artes', 'E',
        nota_extra=' das áreas de Exatas/Tecnológicas e Humanas/Artes (provas E e G)')
for _a, _v in ((2022, 'Q'), (2023, 'Q'), (2024, 'Q'), (2025, 'Q'), (2026, 'Q'), (2027, 'Q')):
    unicamp(f'unicamp-{_a}', _a, f'Unicamp {_a}', '1ª fase', _v, nota_extra=' , prova Q')
for _a in (2021, 2022):
    unicamp(f'unicamp-indigena-{_a}', _a, f'Unicamp Indígena {_a}', 'Vestibular Indígena', None, total=50,
            nota_extra=' do Vestibular Indígena' + (' Unicamp/UFSCar' if _a == 2022 else ''))


# ---------------------------------------------------------------------------------------------------------- UERJ
_R = 'uerj/'
_R25 = _R + 'provas-e-gabaritos-uerj-2025/provas-e-gabaritos-uerj-2025/'
_m('uerj-2022', 'uerj/47478', UERJ, caderno=_R + 'provas-e-gabaritos-uerj-2022/prova_2022.pdf', gabarito=_R + 'provas-e-gabaritos-uerj-2022/gabarito_2022.pdf')
_m('uerj-2023', 'uerj/47567', UERJ, caderno=_R + 'provas-e-gabaritos-uerj-2023/prova-uerj-2023.pdf', gabarito=_R + 'provas-e-gabaritos-uerj-2023/gabarito-uerj-2023.pdf')
_m('uerj-2025-1', 'uerj/47659', UERJ, caderno=_R25 + 'provas-e-gabaritos-1-exame-qualificacao-vestibular-uerj-2025/prova-1-exame-qualificacao-uerj-2025.pdf',
   gabarito=_R25 + 'provas-e-gabaritos-1-exame-qualificacao-vestibular-uerj-2025/gabarito-1-exame-qualificacao-uerj-2025.pdf')
_m('uerj-2025-2', 'uerj/47659', UERJ, caderno=_R25 + 'prova-e-gabaritos-2-exame-qualifcacao-vestibular-2025-uerj/prova-2-exame-qualificacao-uerj-2025.pdf',
   gabarito=_R25 + 'prova-e-gabaritos-2-exame-qualifcacao-vestibular-2025-uerj/gabarito-2-exame-qualificacao-uerj-2025.pdf')
_m('uerj-2026-1', 'uerj/47737', UERJ, caderno=_R + 'provas-e-gabaritos-uerj-2026/uerj-2026/prova_261.pdf',
   gabarito=_R + 'provas-e-gabaritos-uerj-2026/uerj-2026/gabarito_primeiro-exame-qualificacao.pdf')
_m('uerj-2026-2', 'uerj/47737', UERJ, caderno=_R + 'provas-e-gabaritos-uerj-2026/uerj-2026/uerj-2026-prova-2-exame-de-qualificacao.pdf',
   gabarito=_R + 'provas-e-gabaritos-uerj-2026/uerj-2026/uerj-2026-gabarito-2-exame-de-qualificacao.pdf')
_m('uerj-2027-1', 'uerj/47817', UERJ, caderno=_R + 'provas-e-gabaritos-uerj-2027/prova-exame-qualificacao-1-uerj-2027.pdf',
   gabarito=_R + 'provas-e-gabaritos-uerj-2027/gabarito-exame-qualificacao-1-uerj-2027.pdf')

_CAB_UERJ = ('TEXTO', 'INTERDISCIPLINAR', 'LINGUAGENS', 'ESPANHOL', 'FRANCÊS', 'INGLÊS', 'MATEMÁTICA', 'CIÊNCIAS', 'BIOLOGIA',
             'FÍSICA', 'QUÍMICA', 'GEOGRAFIA', 'HISTÓRIA')


def uerj_gabarito(pdf):
    """Gabarito do DSEA/UERJ em grade: 'n letra' lado a lado (2021–2022) ou linha de números com a linha de letras
    embaixo (2023+); 'ANU/LADA' = anulada. Devolve {n: letra}, o bloco de cada número (cabeçalho da grade) e, para a
    língua estrangeira, só a coluna do INGLÊS."""
    import pymupdf
    ws = [w for w in pymupdf.open(pdf)[0].get_text('words')]
    cab = [w for w in ws if w[4].upper() in _CAB_UERJ]
    nums = [w for w in ws if re.fullmatch(r'\d{1,2}', w[4]) and 1 <= int(w[4]) <= 60 and w[1] > 60]
    letras = [w for w in ws if re.fullmatch(r'[A-D]|ANU\w*', w[4])]
    g, bloco = {}, {}
    for w in nums:
        cx = (w[0] + w[2]) / 2
        lado = [l for l in letras if abs(l[1] - w[1]) < 3 and 0 < l[0] - w[2] < 45]
        baixo = [l for l in letras if 4 < l[1] - w[1] < 30 and abs((l[0] + l[2]) / 2 - cx) < 9]
        cand = sorted(lado, key=lambda l: l[0])[:1] or sorted(baixo, key=lambda l: l[1])[:1]
        if not cand:
            continue
        acima = [c for c in cab if c[1] <= w[1] + 1 and c[0] <= w[0] + 8]
        if not acima:
            continue
        # cabeçalho da coluna: o mais perto, pesando a distância na horizontal (grade lado a lado de 2021–2022)
        if lado:
            h = min(acima, key=lambda c: (w[1] - c[1]) + 3 * abs(w[0] - c[0]))[4].upper()
        else:   # grade em linhas: a linha de cabeçalhos logo acima; nela, o cabeçalho à esquerda mais próximo
            ymax = max(c[1] for c in acima)
            h = max((c for c in acima if ymax - c[1] < 3), key=lambda c: c[0])[4].upper()
        n = int(w[4])
        if h in ('ESPANHOL', 'FRANCÊS'):
            continue
        g[n] = 'X' if cand[0][4].startswith('ANU') else cand[0][4]
        bloco[n] = h
    return g, bloco


def _uerj_rotulos_desenhados(pg):
    """UERJ 2021: o rótulo "Questão 05" e o fio pontilhado à esquerda da questão são desenho (sem texto). Cada grupo de
    traços na margem esquerda (x < 80) é uma questão; devolve o alto de cada um."""
    rs = sorted([p['rect'] for p in pg.get_drawings() if p['rect'].x1 < 80 and p['rect'].x0 > 15 and 50 < p['rect'].y0 < 740
                 and p['rect'].height > 5], key=lambda r: r.y0)
    cl = []
    for r in rs:
        if cl and r.y0 - cl[-1][1] < 8:
            cl[-1][1] = max(cl[-1][1], r.y1)
        else:
            cl.append([r.y0, r.y1])
    return [a for a, b in cl if b - a > 20]


def _uerj_paginas(pdf_path):
    """Páginas do caderno: texto base (cabeçalho 'Texto Base' sem questão), questões, línguas (só o inglês fica)."""
    import pymupdf
    d = pymupdf.open(pdf_path)
    info = []
    for i, pg in enumerate(d):
        cab = ' '.join(b[4] for b in pg.get_text('blocks') if b[3] < 45)
        rot = sum(1 for b in pg.get_text('dict')['blocks'] for l in b.get('lines', [])
                  if re.fullmatch(r'(?i)quest[ãa]o', ''.join(s['text'] for s in l['spans']).strip()))
        if not rot and re.search(r'(?i)exame [úu]nico|vestibular estadual 2021', pg.get_text()) and i < len(d) - 1:
            rot = len(_uerj_rotulos_desenhados(pg))
        info.append((i + 1, cab, rot))
    return info


def uerj(pid, ano, rotulo, data):
    def gab(pasta):
        return uerj_gabarito(pasta / 'gabarito.pdf')[0]

    def cadernos(pasta):
        info = _uerj_paginas(pasta / 'caderno.pdf')
        g, bloco = uerj_gabarito(pasta / 'gabarito.pdf')
        lingua = sorted(n for n, b in bloco.items() if b == 'INGLÊS')
        com_q = [p for p, c, r in info if r]
        ult = max(com_q)
        esp = [p for p, c, r in info if re.search(r'(?i)espanhol|francês', c)]
        ing = [p for p, c, r in info if re.search(r'(?i)inglês', c)]
        p_base = next(p for p, c, r in info if p >= 2 and re.search(r'(?i)texto\s*base', c))
        return [{'arquivo': 'caderno', 'paginas': (p_base, min(esp) - 1), 'questoes': (1, lingua[0] - 1)},
                {'arquivo': 'caderno', 'paginas': (min(ing), ult), 'questoes': (lingua[0], 60)}]

    def suportes(pasta):
        info = _uerj_paginas(pasta / 'caderno.pdf')
        g, bloco = uerj_gabarito(pasta / 'gabarito.pdf')
        base = sorted(n for n, b in bloco.items() if b in ('TEXTO', 'INTERDISCIPLINAR'))
        lingua = sorted(n for n, b in bloco.items() if b == 'INGLÊS')
        p_base = next(p for p, c, r in info if p >= 2 and re.search(r'(?i)texto\s*base', c) and not r)
        p_ing = next(p for p, c, r in info if re.search(r'(?i)inglês', c))
        return {('caderno', p_base): [(45, 0, (base[0], base[-1]))], ('caderno', p_ing): [(45, 0, (lingua[0], lingua[-1]))]}

    PROVAS[pid] = {
        'catalogo': 'uerj', 'escola': 'UERJ', 'ano': str(ano), 'fase': rotulo, 'titulo': f'UERJ {ano} – {rotulo}', 'banca': 'UERJ (DSEA)',
        'duracao_horas': 5 if 'Único' in rotulo else 4, 'total': 60, 'alternativas': 4,
        'nota': f'Universidade do Estado do Rio de Janeiro, Vestibular Estadual {ano}, {rotulo} ({data}): 60 questões objetivas '
                'A–D; língua estrangeira na opção inglês. As questões do "Texto base" levam o texto base no print. Gabarito oficial '
                'do DSEA/UERJ; anuladas ficam fora. Arquivos obtidos em cópia pública (Brasil Escola): o site da UERJ não permite '
                'acesso automático.',
        'cadernos': cadernos, '_suportes': suportes,
        'colunas': lambda r: [(20, r.width - 18)], 'margem': 20, 'topo': 45, 'base': 36,
        'ancora': r'^QUEST[ÃA]O\s+(\d{1,2})\s*$', 'ancora_sem_numero': r'(?i)^quest[ãa]o$', 'ancora_dx': 40, 'sequencial': True,
        'corte': [r'(?i)^CLASSIFICA[ÇC][ÃA]O PERI'],
        # "CONSIDERE AS INFORMAÇÕES DO TRECHO A SEGUIR PARA RESPONDER ÀS QUESTÕES 06 E 07", "COM BASE NO TEXTO A SEGUIR,
        # RESPONDA ÀS QUESTÕES 42 E 43", "AS QUESTÕES 09 A 22 REFEREM-SE AO LIVRO..."
        'suporte': [r'(?i)\b(para responder|responda)\b.*\bquest', r'(?i)\b(para responder|responda)\s*([àa]s?)?\s*$', r'(?i)^AS QUEST[ÕO]ES \d+ A \d+'],
        'gabarito': gab, 'area': lambda n: 'Conhecimentos gerais', 'area_da_materia': True,
    }


uerj('uerj-2022', 2022, 'Exame Único', '20/03/2022')
uerj('uerj-2023', 2023, 'Exame Único', '04/12/2022')
uerj('uerj-2025-1', 2025, '1º Exame de Qualificação', '09/06/2024')
uerj('uerj-2025-2', 2025, '2º Exame de Qualificação', '08/09/2024')
uerj('uerj-2026-1', 2026, '1º Exame de Qualificação', '08/06/2025')
uerj('uerj-2026-2', 2026, '2º Exame de Qualificação', '31/08/2025')
uerj('uerj-2027-1', 2027, '1º Exame de Qualificação', '07/06/2026')


# UERJ 2021 (Exame Único, 18/07/2021): rótulos "Questão NN" desenhados (sem texto) -> âncoras achadas no desenho
_m('uerj-2021', 'uerj/47372', UERJ, caderno=_R + 'provas-e-gabaritos-uerj-2021/Exame_Unico_Objetiva.pdf',
   gabarito=_R + 'provas-e-gabaritos-uerj-2021/Gabarito-Geral_Divulgacao.pdf')
uerj('uerj-2021', 2021, 'Exame Único', '18/07/2021')


def _uerj2021_ancoras(pasta):
    import pymupdf
    d = pymupdf.open(pasta / 'caderno.pdf')
    out, n = {}, 0
    for cad in PROVAS['uerj-2021']['cadernos'](pasta):
        n = cad['questoes'][0] - 1
        for p in range(cad['paginas'][0], cad['paginas'][1] + 1):
            for y in _uerj_rotulos_desenhados(d[p - 1]):
                n += 1
                out.setdefault(('caderno', p), []).append((n, y - 1, 0))
    return out


PROVAS['uerj-2021']['_ancoras'] = _uerj2021_ancoras
# texto "Lugares de memória" (p. 5) das questões 5 a 7, sem frase de indicação (conferido no caderno)
_sup21 = PROVAS['uerj-2021']['_suportes']
PROVAS['uerj-2021']['_suportes'] = lambda pasta: {**_sup21(pasta), ('caderno', 5): [(45, 0, (5, 7))]}
PROVAS['uerj-2021']['apoio_de'] = {12: [1]}   # a 12 compara a canção do inglês com "Morro velho" (texto base)
PROVAS['uerj-2021']['suporte'] = PROVAS['uerj-2021']['suporte'] + [r'(?i)^as quest[õo]es \d+ a \d+ referem']
# p. 14: fim da questão 33 em largura total (duas figuras com legenda e o comando), alternativas a–b | c–d lado a lado
# logo acima da questão 34 (larga): a página inteira lida como uma coluna só (conferido no print)
PROVAS['unicamp-2026']['uma_coluna'] = (14,)
# Vestibular Indígena: faixa "VESTIBULAR INDÍGENA 20NN" no alto de cada página (2021 em y≈56–73; 2022 em y≈46–60);
# a 1ª linha útil fica em y≈84 (2021) e y≈74 (2022)
PROVAS['unicamp-indigena-2021']['topo'] = 78
PROVAS['unicamp-indigena-2022']['topo'] = 68
# UERJ 2022: os três sonetos de Camões (pp. 4–6) vêm entre as questões, sem frase com os números das questões:
# Soneto I serve às 5–11, o II às 7–11, o III às 9–11 (a 11 compara os três) — conferido no caderno
_sup22 = PROVAS['uerj-2022']['_suportes']
PROVAS['uerj-2022']['_suportes'] = lambda pasta: {**_sup22(pasta), ('caderno', 4): [(60, 0, (5, 11))],
                                                  ('caderno', 5): [(355, 0, (7, 11))], ('caderno', 6): [(354, 0, (9, 11))]}


# ------------------------------------------------------------------- Vunesp: Santa Casa, Einstein, FMJ, São Camilo, Anhembi
# Cadernos e gabaritos oficiais da Fundação Vunesp (código do concurso no gabarito), em cópia pública (Brasil Escola).
import provas_vunesp as _v  # noqa: E402

BE = 'cópia pública no Brasil Escola (vestibular.brasilescola.uol.com.br): o portal da Vunesp bloqueia acesso automático'
_SC = 'fcmscsp/provas-e-gabaritos-fcmscsp-'
_m('santacasa-2021', 'fcmscsp/47297', VUNESP, caderno=_SC + '2021-1/prova-conhecimentos-gerais-medicina-versao-1.pdf',
   gabarito=_SC + '2021-1/gabarito-medicina.pdf')
_m('santacasa-2022', 'fcmscsp/47394', VUNESP, caderno=_SC + '2022-1/Prova de Conhecimentos Gerais Medicina.pdf',
   gabarito=_SC + '2022-1/Gabarito Medicina.pdf')
_m('santacasa-2022-demais', 'fcmscsp/47394', VUNESP, caderno=_SC + '2022-1/Prova de Conhecimentos Gerais e Redação.pdf',
   gabarito=_SC + '2022-1/Gabarito Conhecimentos Gerais e Redação.pdf')
_E = 'einstein/'
_m('einstein-2021', 'einstein/47298', VUNESP, caderno=_E + 'provas-e-gabaritos-einstein-2021-1/prova-1.pdf',
   gabarito=_E + 'provas-e-gabaritos-einstein-2021-1/gabarito-prova-1.pdf')
_m('einstein-2021-2-enf', 'einstein/47363', VUNESP, caderno=(_E + 'prova-e-gabarito-enfermagem-einstein-2021-2/arquivo.pdf', (1, 20)),
   gabarito=(_E + 'prova-e-gabarito-enfermagem-einstein-2021-2/arquivo.pdf', (21, 21)))
_m('einstein-2022-2-enf', 'einstein/47524', VUNESP, caderno=_E + 'prova-e-gabarito-einstein-enfermagem-2022-2/CADERNO_EINSTEIN_27_6_2022.pdf',
   gabarito=_E + 'prova-e-gabarito-einstein-enfermagem-2022-2/GABARITO_EINSTEIN_27_6_2022.pdf')
_m('einstein-2023', 'einstein/47553', VUNESP, caderno=_E + 'provas-e-gabaritos-vestibular-faculdade-albert-einstein-2023/prova-01-albert-einstein-2023.pdf',
   gabarito=_E + 'provas-e-gabaritos-vestibular-faculdade-albert-einstein-2023/gabarito-albert-einstein-2023.pdf')
_m('fmj-2021', 'fmj/47288', VUNESP, caderno=('fmj/prova-e-gabarito-fmj-2021/arquivo.pdf', (29, 44)),
   gabarito=('fmj/prova-e-gabarito-fmj-2021/arquivo.pdf', (45, 45)))
_m('fmj-2022', 'fmj/47417', VUNESP, caderno='fmj/provas-e-gabaritos-fmj-2022/CADERNO2_FMJ_2022.pdf',
   gabarito='fmj/provas-e-gabaritos-fmj-2022/GABARITO_FMJ_2022.pdf')
_m('saocamilo-2021-2', 'saocamilo/47357', VUNESP, caderno=('saocamilo/prova-e-gabarito-sao-camilo-medicina-2021-2/arquivo.pdf', (1, 20)),
   gabarito=('saocamilo/prova-e-gabarito-sao-camilo-medicina-2021-2/arquivo.pdf', (21, 21)))
_m('saocamilo-2022-2', 'saocamilo/47501', VUNESP, caderno='saocamilo/provas-e-gabarito-sao-camilo-medicina-2022-2/CADERNO2_SÃO_CAMILO_CUSC2103.pdf',
   gabarito='saocamilo/provas-e-gabarito-sao-camilo-medicina-2022-2/GABARITO_SÃO_CAMILO_CUSC2103.pdf')
_m('anhembi-2022', 'anhembi/47442', VUNESP, caderno='anhembi/provas-e-gabaritos-anhembi-morumbi-medicina-2022/CADERNO2_ANIM2101.pdf',
   gabarito='anhembi/provas-e-gabaritos-anhembi-morumbi-medicina-2022/GABARITO_ANIM2101.pdf')


def _vun(pid, cat, escola, ano, fase, titulo, total, nota):
    PROVAS[pid] = _v.base(cat, escola, ano, fase, titulo, total, caderno='caderno', gabarito='gabarito',
                          nota=nota + f' Caderno e gabarito oficiais da Vunesp, em {BE}. Anuladas ficam fora.')


_vun('santacasa-2021', 'santacasa', 'Santa Casa', 2021, 'Medicina', 'Santa Casa 2021', 80,
     'Faculdade de Ciências Médicas da Santa Casa de São Paulo, Vestibular 1º semestre de 2021 (Medicina, 11/12/2020): '
     'Prova de Conhecimentos Gerais (80 questões objetivas), versão 1. A prova discursiva fica fora.')
_vun('santacasa-2022', 'santacasa', 'Santa Casa', 2022, 'Medicina', 'Santa Casa 2022', 80,
     'Faculdade de Ciências Médicas da Santa Casa de São Paulo, Vestibular 1º semestre de 2022 (Medicina, 30/10/2021): '
     'Prova de Conhecimentos Gerais (80 questões objetivas), versão 1. A prova discursiva fica fora.')
_vun('santacasa-2022-demais', 'santacasa', 'Santa Casa', 2022, 'Enfermagem e demais cursos', 'Santa Casa 2022 – demais cursos', 60,
     'Faculdade de Ciências Médicas da Santa Casa de São Paulo, Vestibular 1º semestre de 2022 (Enfermagem, Fonoaudiologia, '
     'Radiologia e Sistemas Biomédicos, 31/10/2021): Prova de Conhecimentos Gerais (60 questões objetivas). Redação fora.')
_vun('einstein-2021', 'einstein', 'Einstein', 2021, 'Medicina e Enfermagem', 'Einstein 2021', 50,
     'Faculdade Israelita de Ciências da Saúde Albert Einstein, Vestibular 2021 (Enfermagem e Medicina, 13/12/2020): '
     'Prova I (50 questões objetivas), versão 1. A Prova II (discursivas e redação) fica fora.')
_vun('einstein-2021-2-enf', 'einstein', 'Einstein', 2021, 'Enfermagem – 2º semestre', 'Einstein 2021/2 – Enfermagem', 50,
     'Faculdade Israelita de Ciências da Saúde Albert Einstein, Vestibular Enfermagem 2º semestre de 2021: Prova de '
     'Conhecimentos Gerais (50 questões objetivas). Redação fora.')
_vun('einstein-2022-2-enf', 'einstein', 'Einstein', 2022, 'Enfermagem – 2º semestre', 'Einstein 2022/2 – Enfermagem', 50,
     'Faculdade Israelita de Ciências da Saúde Albert Einstein, Vestibular Enfermagem 2º semestre de 2022 (27/06/2022): '
     'Prova de Conhecimentos Gerais (50 questões objetivas). Redação fora.')
_vun('einstein-2023', 'einstein', 'Einstein', 2023, 'Medicina, Enfermagem e Administração', 'Einstein 2023', 50,
     'Faculdade Israelita de Ciências da Saúde Albert Einstein, Vestibular 2023: Prova I (50 questões objetivas), versão 1. '
     'A Prova II (discursivas e redação) fica fora.')
_vun('fmj-2021', 'fmj', 'FMJ', 2021, 'Medicina', 'FMJ 2021', 60,
     'Faculdade de Medicina de Jundiaí, Vestibular 2021 (Medicina): Prova II (60 questões objetivas), versão 1. '
     'A Prova I (discursivas e redação) fica fora.')
_vun('fmj-2022', 'fmj', 'FMJ', 2022, 'Medicina', 'FMJ 2022', 60,
     'Faculdade de Medicina de Jundiaí, Vestibular 2022 (Medicina, 13/11/2021): Prova II (60 questões objetivas), versão 1. '
     'A Prova I (discursivas e redação) fica fora.')
_vun('saocamilo-2021-2', 'saocamilo', 'São Camilo', 2021, '2º semestre', 'São Camilo 2021/2', 40,
     'Centro Universitário São Camilo, Medicina, Processo Seletivo 2º semestre de 2021: Prova II (40 questões objetivas), '
     'versão 1. A Prova I (discursivas) e a redação ficam fora.')
_vun('saocamilo-2022-2', 'saocamilo', 'São Camilo', 2022, '2º semestre', 'São Camilo 2022/2', 40,
     'Centro Universitário São Camilo, Medicina, Processo Seletivo 2º semestre de 2022 (29/05/2022): Prova II (40 questões '
     'objetivas), versão 1. A Prova I (discursivas) e a redação ficam fora.')
_vun('anhembi-2022', 'anhembi', 'Anhembi Morumbi', 2022, 'Medicina', 'Anhembi Morumbi 2022', 40,
     'Universidade Anhembi Morumbi, Vestibular Medicina 1º semestre de 2022 (04/12/2021): Prova II (40 questões objetivas), '
     'versão 1. A Prova I (discursivas e redação) fica fora.')

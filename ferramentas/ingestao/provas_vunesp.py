"""Provas da Fundação Vunesp em cópias hospedadas fora do portal da Vunesp (decisão do dono, 09/11/2026).

O portal da Vunesp bloqueia acesso automático; os cadernos e gabaritos oficiais (cabeçalho e código Vunesp, mesma
numeração e ordem) foram baixados de cópias públicas hospedadas por cursinhos e portais de vestibular. A origem de cada
arquivo fica em `fontes` e em `docs/provas/origem-vunesp.md`; o dono decide os direitos depois.
Só as provas objetivas (múltipla escolha) entram; anuladas ficam fora.
"""
import re

import provas as _p   # módulo parcialmente carregado: vunesp(), texto_pdf() e pares() já existem quando isto roda

OBJETIVO = 'cópia hospedada pelo Curso Objetivo (curso-objetivo.br, página de resolução comentada)'
QCONCURSOS = 'cópia hospedada pelo Qconcursos (arquivos.qconcursos.com, arquivo público)'


def _gab_vunesp(*arquivos, desloc=None):
    """Gabarito Vunesp "1 - E" (ou "01 - E"); '*', 'X', 'N' ou 'ANULADA' = anulada. Vários arquivos: deslocamento por arquivo."""
    def gab(pasta):
        g = {}
        for i, arq in enumerate(arquivos):
            d = (desloc or [0] * len(arquivos))[i]
            for n, v in re.findall(r'(?<![\d,.])(\d{1,3})\s*[-–]\s*([A-E]\b|\*|X\b|N\b|ANULAD[AO])', _p.texto_pdf(pasta / (arq + '.pdf'))):
                g.setdefault(int(n) + d, v if len(v) == 1 and v in 'ABCDE' else 'X')
        return g
    return gab


def base(catalogo, escola, ano, fase, titulo, total, nota, caderno='caderno', gabarito='gabarito', duracao=5,
         paginas=(1, 999), alternativas=5):
    cfg = _p.vunesp(catalogo, escola, ano, fase, titulo, total, caderno=caderno, gabarito=gabarito, duracao=duracao,
                    nota=nota, alternativas=alternativas)
    def cadernos(pasta):
        # a Classificação Periódica (página girada, no fim do caderno) fica fora do recorte
        import pymupdf
        doc = pymupdf.open(pasta / (caderno + '.pdf'))
        fim = min(paginas[1], len(doc))
        for i in range(len(doc) - 1, max(len(doc) - 4, 0), -1):
            if re.search(r'(?i)oganess|h[ée]lio\b|classifica[çc][ãa]o peri[óo]dica', doc[i].get_text()):
                fim = min(fim, i)   # página i+1 (1-based) é a tabela: o recorte vai até a i
        return [{'arquivo': caderno, 'paginas': (paginas[0], fim)}]

    cfg['cadernos'] = cadernos
    # questões e figuras de largura total no meio de páginas de duas colunas (ex.: Unesp 2026 q6, 2021 q83)
    cfg.update({'colunas': 'faixas', 'faixas_modo': 'largas', 'faixas_uma_auto': True, 'margem': 28})
    cfg['gabarito'] = _gab_vunesp(gabarito)
    # "... para responder às / questões de 28 a 30.": instrução partida logo depois de "às"
    cfg['suporte'] = cfg['suporte'] + [r'(?i)para responder [àa]s?\s*$']
    # "Classificação Periódica" dentro de uma questão (Unesp 2025/2 q68) não é o título da tabela: corte só em maiúsculas
    cfg['corte'] = [r'^CLASSIFICAÇÃO PERIÓDICA' if 'PERIÓDICA' in c else c for c in cfg['corte']]
    cfg['area_da_materia'] = True   # o caderno não separa por matéria: o rótulo do simulado vem da matéria da questão
    return cfg


def mais_provas():
    P = {}
    # ------------------------------------------------------------------ Unesp (1ª fase, Conhecimentos Gerais, 90)
    def unesp(pid, ano, fase, titulo, extra='', caderno='caderno', gabarito='gabarito'):
        P[pid] = base(
            'unesp', 'Unesp', ano, fase, titulo, 90, caderno=caderno, gabarito=gabarito,
            nota=f'Vestibular Unesp {titulo[6:]}, 1ª fase: Prova de Conhecimentos Gerais (90 questões objetivas){extra}, versão 1. '
                 f'Caderno e gabarito oficiais da Vunesp, em {OBJETIVO}: o portal da Vunesp bloqueia acesso automático.')

    for a in (2020, 2023, 2024, 2025, 2026):
        unesp(f'unesp-{a}', a, '1ª fase', f'Unesp {a}')
    # 2021 e 2022 (pandemia): duas provas diferentes de 1ª fase, uma por grupo de cursos, em dias diferentes
    for a in (2021, 2022):
        unesp(f'unesp-{a}', a, '1ª fase – Biológicas', f'Unesp {a} – Biológicas', ' dos cursos da área de Biológicas',
              caderno='caderno-d1', gabarito='gabarito-d1')
        unesp(f'unesp-{a}-exh', a, '1ª fase – Exatas e Humanidades', f'Unesp {a} – Exatas e Humanidades',
              ' dos cursos das áreas de Exatas e Humanidades', caderno='caderno-d2', gabarito='gabarito-d2')
    # Vestibular de meio de ano (ingresso no 2º semestre)
    for a in (2024, 2025, 2026):
        unesp(f'unesp-{a}-2', a, '1ª fase – meio de ano', f'Unesp {a}/2', ' do Vestibular de meio de ano')
    # p. 17: figura de três mapas em largura total (q51) com rótulos "MOMENTO" em versalete; q52 e q53 em duas colunas
    P['unesp-2020']['faixas_pag'] = {('caderno', 17): [(0, 470, None), (470, 9999, 297)]}

    # ------------------------------------------------------------- Famerp (1º dia, Conhecimentos Gerais, 80)
    for a in range(2020, 2027):
        P[f'famerp-{a}'] = base(
            'famerp', 'Famerp', a, '', f'Famerp {a}', 80,
            nota=f'Faculdade de Medicina de São José do Rio Preto, Vestibular {a}: Prova de Conhecimentos Gerais (1º dia, '
                 f'80 questões objetivas), versão 1. Caderno e gabarito oficiais da Vunesp, em {OBJETIVO}: o portal da '
                 'Vunesp bloqueia acesso automático. O 2º dia (discursivas) fica fora.')
    return P

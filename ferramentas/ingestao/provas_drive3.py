"""Provas do Google Drive do dono, 3º lote (pasta "PROVAS MANUAIS", enviadas em 19/11/2026; integradas em 27/11/2026,
depois de cumprida a regra de 19/11 "provas novas só depois que acabarem as pendentes").

Os PDFs ficam em fontes/provas-manuais/<instituição>/<pasta>/arquivo.pdf (fora do git); a origem de cada um (nome e id
no Drive) e o que ficou fora estão em docs/provas/ORIGEM-DRIVE-saocamilo-santacasa-unesp.md, seção "Lote de 19/11".

  python3 ferramentas/ingestao/provas_drive3.py [prova-id ...]   copia os PDFs para fabrica_saida/ingestao/<prova>/
  python3 ferramentas/ingestao/recorta.py <prova-id>              recorta (configuração abaixo, carregada no fim de provas.py)

Só questões objetivas entram; discursivas e redação ficam fora. Gabarito oficial (definitivo quando a banca publicou
preliminar e definitivo), da mesma versão do caderno; anuladas ficam fora.
"""
import hashlib
import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

import provas  # noqa: F401  (carrega provas.py na ordem certa quando este arquivo roda sozinho)
import provas as _p
import provas_vunesp as _v

DRIVE = 'Google Drive do dono'
VUNESP = 'https://www.vunesp.com.br/'

_UFSM24 = 'https://www.ufsm.br/app/uploads/sites/342/2023/12/'
_UFSM23 = 'https://www.ufsm.br/app/uploads/sites/342/2023/05/'

# prova -> papel -> (pasta em fontes/provas-manuais, nome do arquivo no Drive, id no Drive[, url oficial, caminho local])
ARQUIVOS = {
    'fmj-2020': {
        'caderno': ('fmj/FMJ-2020-Prova-II-prova', 'FMJ 2020 - Prova II - prova.pdf', '1YifQJNG40eplrVhUcwHfJ7KIm-A_o7oI'),
        'gabarito': ('fmj/FMJ-2020-Prova-II-gabarito', 'FMJ 2020 - Prova II - gabarito.pdf', '1_9ReviHt43KSfN_u9W2-097K0jOih4lb'),
    },
    'fmj-2023': {
        'caderno': ('fmj/FMJ-2023-Prova-II-prova', 'FMJ 2023 - Prova II - prova.pdf', '15nC9JgT0DJilvkxFDCDZ3zy3agxeYoZx'),
        'gabarito': ('fmj/FMJ-2023-Prova-II-gabarito', 'FMJ 2023 - Prova II - gabarito.pdf', '1WkB74-8c_zAwE2VnQZQOvefEXjAHG0rX'),
    },
    'fmj-2027': {
        'caderno': ('fmj/FMJ-2027-Prova-II-prova', 'FMJ 2027 - Prova II - prova.pdf', '1cfvLbKXAb6PkMm-_BpQMbAR8GyZ7j9hT'),
        'gabarito': ('fmj/FMJ-2027-Prova-II-gabarito', 'FMJ 2027 - Prova II - gabarito.pdf', '1yYac74LxMcwBZhB4i4PYs11Nol5oqP81'),
    },
    'saocamilo-2022-1': {
        'caderno': ('saocamilo/SAO-CAMILO-2022-Prova-II-prova', 'SÃO CAMILO 2022 - Prova II - prova.pdf',
                    '1R9tGqLtfEfcZfW-4crtOSQOZ1tOUGyGr'),
        'gabarito': ('saocamilo/SAO-CAMILO-2022-Prova-II-versao-2-gabarito', 'SÃO CAMILO 2022 - Prova II versão 2 - gabarito.pdf',
                     '10nb4pIpsvGQSjPOnmr9yDTV36mCAJ8Pc'),
    },
    'saocamilo-2026-1': {
        'caderno': ('saocamilo/SAO-CAMILO-2026-1-semestre-Prova-II-prova', 'SÃO CAMILO 2026 - 1º semestre Prova II - prova.pdf',
                    '1VLcRRw5P2b1kWA1NIlEaSsiRpx-WxiFS'),
        'gabarito': ('saocamilo/SAO-CAMILO-2026-1-semestre-Prova-II-gabarito',
                     'SÃO CAMILO 2026 - 1º semestre Prova II - gabarito.pdf', '1AvpCsUZv90dO0XynQhMeA_7yrSM1lDc0'),
    },
    'uea-2022-bio': {
        'caderno': ('uea/UEA-2022-Prova-II-prova', 'UEA 2022 - Prova II - prova.pdf', '1rUQxI34E0AKEMjzlOMcDMZFwC9INKGjj'),
        'gabarito': ('uea/UEA-2022-Prova-II-versao-1-gabarito', 'UEA 2022 - Prova II versão 1 - gabarito.pdf',
                     '15GZyLYGlgSSPWmHOs728ph09VwmwxX5M'),
    },
    'uea-2023-bio': {
        'caderno': ('uea/UEA-2023-Prova-II-prova', 'UEA 2023 - Prova II - prova.pdf', '1g7tTMOdGHEqgX7o3HOgj3awSpWv_LWRi'),
        'gabarito': ('uea/UEA-2023-Prova-II-gabarito', 'UEA 2023 - Prova II - gabarito.pdf', '1ohFLm-UC-RGA1tCiaNvek25OwXgtRJmJ'),
    },
    'uea-2024-bio': {
        'caderno': ('uea/UEA-2024-Prova-II-prova', 'UEA 2024 - Prova II - prova.pdf', '1L7U6Sg6C1oLmBDQlL1gJb85tMes8sDXQ'),
        'gabarito': ('uea/UEA-2024-Prova-II-gabarito', 'UEA 2024 - Prova II - gabarito.pdf', '1nSdS4eVap3TmRBrnSKos7G753-4gODex'),
    },
    'uerj-2020-1': {
        'caderno': ('uerj/UERJ-2020-1-EQ-prova', 'UERJ 2020 - 1º exame de qualificação - prova.pdf', '1bgyerSzuDv0kAo-WFWwqy1E4sj_SlNIp'),
        'gabarito': ('uerj/UERJ-2020-1-EQ-gabarito', 'UERJ 2020 - 1º exame de qualificação - gabarito.pdf',
                     '1KeR6bxhs-Z7JwNvnDIVJK-fmwK7tSb6c'),
    },
    # UERJ 2024, 1º EQ: o Drive só tem o gabarito (com a 29 anulada); o caderno oficial do DSEA veio da cópia publicada
    # pelo Estratégia Vestibulares (o site da UERJ não permite acesso automático)
    'uerj-2024-1': {
        'caderno': (None, None, None, 'https://cdn.blog.estrategiavestibulares.com.br/vestibulares/wp-content/uploads/2023/06/prova-uerj.pdf',
                    'fontes/cache-pdf/semgab/uerj/uerj2024-1eq-prova-estrategia.pdf',
                    'https://cdn.blog.estrategiavestibulares.com.br/vestibulares/wp-content/uploads/2023/06/prova-uerj.pdf (cópia do '
                    'caderno oficial do DSEA/UERJ publicada pelo Estratégia Vestibulares; baixada em 27/11/2026)'),
        'gabarito': ('uerj/UERJ-2024-1-EQ-gabarito', 'UERJ 2024 - 1º exame de qualificação - gabarito.pdf', '19YUxNvCuxeQcoU-KA_qSdUYpUF3bDFGg'),
    },
    'uerj-2024-2': {
        'caderno': ('uerj/UERJ-2024-2-EQ-prova', 'UERJ 2024 - 2º exame de qualificação - prova.pdf', '1o4l9ZE9ycM8rt8mweONh9B0e-SAzritp'),
        'gabarito': ('uerj/UERJ-2024-2-EQ-gabarito', 'UERJ 2024 - 2º exame de qualificação - gabarito.pdf',
                     '1Ug14gNjgNUtf-f8Wg6m1mAEj-jycN4Ak'),
    },
    'uerr-2021': {
        'caderno': ('uerr/UERR-2021-prova', 'UERR 2021 - prova.pdf', '1NkFYQZznE_MSNWMONoQepk1QEG6gPRD8'),
        'gabarito': ('uerr/UERR-2021-gabarito', 'UERR 2021 - gabarito.pdf', '1WQWLIbD4xFIxfJuJwJk9X1Xs2q_Qt3CM'),
    },
    # UERR 2024: o Drive tem o gabarito PRELIMINAR (1j8k_ZC6l3ZvIktNrr_N5GFHnax63MO5c); vale o DEFINITIVO ("GABARITOS
    # OFICIAIS DEFINITIVOS", pós-recursos, 08/11/2023), publicado pela UERR e reproduzido pelo Estratégia Vestibulares
    'uerr-2024': {
        'caderno': ('uerr/UERR-2024-prova', 'UERR 2024 - prova.pdf', '1x5S_MbGqM1K-baf45kV94H0N52-mf_s7'),
        'gabarito': (None, None, None, 'https://cdn.blog.estrategiavestibulares.com.br/vestibulares/wp-content/uploads/2023/11/gabarito-uerr.pdf',
                     'fontes/cache-pdf/semgab/uerr/uerr2024-gabarito-oficial-definitivo.pdf',
                     'https://cdn.blog.estrategiavestibulares.com.br/vestibulares/wp-content/uploads/2023/11/gabarito-uerr.pdf '
                     '(cópia do gabarito oficial DEFINITIVO da UERR, "GABARITOS OFICIAIS DEFINITIVOS", publicada pelo Estratégia '
                     'Vestibulares; baixada em 27/11/2026; o site da UERR recusou a conexão)'),
    },
    # UFSM 2024 (Processo Seletivo Vestibular UFSM 2024, Edital 131/2023): cadernos do Drive idênticos (mesmo md5) aos
    # oficiais; o Drive só tem gabaritos PRELIMINARES -> vale o DEFINITIVO da página oficial (26/01/2024; Prova 2 retificado)
    'ufsm-2024': {
        'p1-caderno': ('ufsm/UFSM-2024-vestibular-Prova-1-tarde-prova', 'UFSM 2024 - vestibular Prova 1 tarde - prova.pdf',
                       '1pX-xrfUyxlSas-8b41CMqIFNekGvowwn', _UFSM24 + 'VESTIBULAR-PROVA-1-UFSM-2024.pdf'),
        'p1-gabarito': (None, None, None, _UFSM24 + 'GABARITO-DEFINITIVO-VESTIBULAR-PROVA-1-UFSM-2024-1.pdf',
                        'fontes/cache-pdf/semgab/ufsm/GABARITO-DEFINITIVO-VESTIBULAR-PROVA-1-UFSM-2024-1.pdf'),
        'p2-caderno': ('ufsm/UFSM-2024-Prova-2-manha-prova', 'UFSM 2024 - Prova 2 manhã - prova.pdf',
                       '1ip27Dttf8Vk2RfzcGvR2SX7tY1nuqWaZ', _UFSM24 + 'VESTIBULAR-PROVA-2-UFSM-2024.pdf'),
        'p2-gabarito': (None, None, None, _UFSM24 + 'GABARITO-DEFINITIVO-VESTIBULAR-PROVA-2-UFSM-2024-RETIFICADO.pdf',
                        'fontes/cache-pdf/semgab/ufsm/GABARITO-DEFINITIVO-VESTIBULAR-PROVA-2-UFSM-2024-RETIFICADO.pdf'),
        'p3-caderno': ('ufsm/UFSM-2024-Prova-3-tarde-prova', 'UFSM 2024 - Prova 3 tarde - prova.pdf',
                       '1YGEnfBqqSVTFT2VgrR8TbKZyZTsooUSx', _UFSM24 + 'VESTIBULAR-PROVA-3-UFSM-2024.pdf'),
        'p3-gabarito': (None, None, None, _UFSM24 + 'GABARITO-DEFINITIVO-VESTIBULAR-PROVA-3-UFSM-2024.pdf',
                        'fontes/cache-pdf/semgab/ufsm/GABARITO-DEFINITIVO-VESTIBULAR-PROVA-3-UFSM-2024.pdf'),
    },
    # UFSM 2023 = Vestibular Extraordinário 2023 (09/07/2023, Edital 057/2023): Provas 1 e 2 (não houve Prova 3);
    # cadernos do Drive idênticos aos oficiais; gabarito DEFINITIVO oficial (o do Drive é o preliminar)
    'ufsm-2023': {
        'p1-caderno': ('ufsm/UFSM-2023-Prova-1-manha-prova', 'UFSM 2023 - Prova 1 manhã - prova.pdf',
                       '1VP8fV_PzP6qBoz6tP9oIju91TNXmM_dK', _UFSM23 + 'PROVA-1-VESTIBULAR-EXTRAORDINARIO-2023-UFSM.pdf'),
        'p2-caderno': ('ufsm/UFSM-2023-Prova-2-tarde-prova', 'UFSM 2023 - Prova 2 tarde - prova.pdf',
                       '1wJvamT7MWJ1PMxYdgwYAN3CZ2prstgqx', _UFSM23 + 'PROVA-2-VESTIBULAR-EXTRAORDINARIO-2023-UFSM.pdf'),
        'gabarito': (None, None, None, _UFSM23 + 'Edital_057_2023_Prograd_UFSM_GABARITOS_DEFINITIVOS_VESTIBULAR_EXTRAORDINARIO_2023_PROVAS_1_E_2.pdf',
                     'fontes/cache-pdf/semgab/ufsm/Edital_057_2023_Prograd_UFSM_GABARITOS_DEFINITIVOS_VESTIBULAR_EXTRAORDINARIO_2023_PROVAS_1_E_2.pdf'),
    },
    'unicamp-2020': {
        'caderno': ('unicamp/UNICAMP-2020-1-fase-versao-QX-prova', 'UNICAMP 2020 - 1ª fase versão QX - prova.pdf',
                    '1vEcJGd5WUdwkY7DIVN39MFfn0uOjILC4'),
        'gabarito': ('unicamp/UNICAMP-2020-1-fase-gabarito', 'UNICAMP 2020 - 1ª fase - gabarito.pdf', '1uGSRC5sRXGaAM03JlGq55JMafBE0Qjks'),
    },
}

PROVAS = {}
NOTA = ' Caderno e gabarito oficiais da Vunesp ({cod}), em cópia guardada no Google Drive do dono. Anuladas ficam fora.'
SUPORTE_REFEREM = r'(?i)^as quest[õo]es (de )?\d+ (e|a) \d+ referem'


# ----------------------------------------------------------------------------------------------------------- FMJ
for _a, _cod, _data, _n, _v_ in ((2020, 'FMJU1901', '30/11/2019', 60, 2), (2023, 'FMJU2201', '16/10/2022', 60, 1),
                                 (2027, 'FMJU2601', '20/09/2026', 40, 1)):
    _pid = f'fmj-{_a}'
    PROVAS[_pid] = _v.base(
        'fmj', 'FMJ', _a, 'Medicina', f'FMJ {_a}', _n,
        nota=f'Faculdade de Medicina de Jundiaí, Vestibular {_a} (Medicina, {_data}): Prova II ({_n} questões objetivas), '
             f'versão {_v_}. A Prova I (discursivas e redação) fica fora.' + NOTA.format(cod=_cod))
    PROVAS[_pid]['suporte'] = PROVAS[_pid]['suporte'] + [SUPORTE_REFEREM]


# ---------------------------------------------------------------------------------------------------- São Camilo
for _pid, _sem, _a, _cod, _data, _v_ in (('saocamilo-2022-1', '1º semestre', 2022, 'CUSC2102', '08/11/2021', 2),
                                         ('saocamilo-2026-1', '1º semestre', 2026, 'CUSC2501', '28/11/2025', 1)):
    PROVAS[_pid] = _v.base(
        'saocamilo', 'São Camilo', _a, _sem, f'São Camilo {_a}/1', 40,
        nota=f'Centro Universitário São Camilo, Medicina, Processo Seletivo {_sem} de {_a} ({_data}): Prova II '
             f'(40 questões objetivas), versão {_v_}. A Prova I (discursivas) e a redação ficam fora.' + NOTA.format(cod=_cod))
    PROVAS[_pid]['suporte'] = PROVAS[_pid]['suporte'] + [SUPORTE_REFEREM]
    PROVAS[_pid]['suporte_nao_colado'] = 20
# 2026/1: questões nas pp. 3–16 (p. 17 é a Classificação Periódica, girada; 18–19 redação)
PROVAS['saocamilo-2026-1']['cadernos'] = [{'arquivo': 'caderno', 'paginas': (3, 16)}]


# ----------------------------------------------------------------------------------------------------------- UEA
def _uea_bio(pid, acesso, cod, data, versao):
    nota = (f'Universidade do Estado do Amazonas, Vestibular {acesso - 1}/acesso {acesso}: Prova de Conhecimentos '
            f'Específicos (2º dia, {data}), grupo 1: Medicina, Odontologia, Enfermagem e licenciaturas da área; a redação '
            f'fica fora. Questões objetivas A–E, versão {versao}.' + NOTA.format(cod=cod))
    c = _v.base('uea', 'UEA', acesso, 'Conhecimentos Específicos – Biológicas', f'UEA {acesso} – Biológicas', 0, nota=nota)
    c['suporte'] = c['suporte'] + [r'(?i)^as quest[õo]es de \d+ a \d+']

    def cadernos(pasta):
        import pymupdf
        doc = pymupdf.open(pasta / 'caderno.pdf')
        fim = max(i for i in range(len(doc)) if re.search(r'(?i)quest[ãa]o\s+\d', doc[i].get_text())) + 1
        return [{'arquivo': 'caderno', 'paginas': (2, fim)}]
    c['cadernos'] = cadernos
    c.pop('total')
    c['total_de'] = lambda pasta, g=c['gabarito']: max(g(pasta))
    PROVAS[pid] = c


# "para / r\u00adesponder às questões de 28 a 34" (UEA 2023): hífen opcional invisível no começo da 2ª linha
for _k in [k for k in PROVAS if PROVAS[k].get('banca') == 'Vunesp']:
    PROVAS[_k]['suporte'] = PROVAS[_k]['suporte'] + [r'(?i)^r\u00ad?esponder\s+[àa]s?\s+quest']


_uea_bio('uea-2022-bio', 2022, 'UEAM2101', '14/02/2022', 1)
_uea_bio('uea-2023-bio', 2023, 'UEAM2201', '07/11/2022', 1)
_uea_bio('uea-2024-bio', 2024, 'UEAM2301', '24/10/2023', 1)
for _k in ('uea-2022-bio', 'uea-2023-bio', 'uea-2024-bio'):
    PROVAS[_k]['suporte'] = PROVAS[_k]['suporte'] + [r'(?i)^r\u00ad?esponder\s+[àa]s?\s+quest']


# ---------------------------------------------------------------------------------------------------------- UERJ
import provas_grupo_a as _ga  # noqa: E402


def _uerj_paginas(pdf_path):
    """Como _ga._uerj_paginas, mas o rótulo pode vir numa linha só ("QUESTÃO 10", caderno de 2020)."""
    import pymupdf
    d = pymupdf.open(pdf_path)
    info = []
    for i, pg in enumerate(d):
        cab = ' '.join(b[4] for b in pg.get_text('blocks') if b[3] < 45)
        rot = sum(1 for b in pg.get_text('dict')['blocks'] for l in b.get('lines', [])
                  if re.fullmatch(r'(?i)quest[ãa]o(\s*\d{1,2})?', ''.join(s['text'] for s in l['spans']).strip()))
        info.append((i + 1, cab, rot))
    return info


def _uerj_cadernos(pasta):
    info = _uerj_paginas(pasta / 'caderno.pdf')
    g, bloco = _ga.uerj_gabarito(pasta / 'gabarito.pdf')
    lingua = sorted(n for n, b in bloco.items() if b == 'INGLÊS')
    ult = max(p for p, c, r in info if r)
    esp = [p for p, c, r in info if re.search(r'(?i)espanhol|francês', c)]
    ing = [p for p, c, r in info if re.search(r'(?i)inglês', c)]
    p_base = next(p for p, c, r in info if p >= 2 and re.search(r'(?i)texto\s*base', c))
    return [{'arquivo': 'caderno', 'paginas': (p_base, min(esp) - 1), 'questoes': (1, lingua[0] - 1)},
            {'arquivo': 'caderno', 'paginas': (min(ing), ult), 'questoes': (lingua[0], 60)}]


def _uerj_suportes(pasta):
    info = _uerj_paginas(pasta / 'caderno.pdf')
    g, bloco = _ga.uerj_gabarito(pasta / 'gabarito.pdf')
    base = sorted(n for n, b in bloco.items() if b in ('TEXTO', 'INTERDISCIPLINAR'))
    lingua = sorted(n for n, b in bloco.items() if b == 'INGLÊS')
    p_base = next(p for p, c, r in info if p >= 2 and re.search(r'(?i)texto\s*base', c) and not r)
    p_ing = next(p for p, c, r in info if re.search(r'(?i)inglês', c))
    return {('caderno', p_base): [(45, 0, (base[0], base[-1]))], ('caderno', p_ing): [(45, 0, (lingua[0], lingua[-1]))]}

for _pid, _a, _rot, _data in (('uerj-2020-1', 2020, '1º Exame de Qualificação', '09/06/2019'),
                              ('uerj-2024-1', 2024, '1º Exame de Qualificação', '04/06/2023'),
                              ('uerj-2024-2', 2024, '2º Exame de Qualificação', '03/09/2023')):
    _ga.uerj(_pid, _a, _rot, _data)
    PROVAS[_pid] = _ga.PROVAS.pop(_pid)
    PROVAS[_pid]['cadernos'] = lambda pasta: _uerj_cadernos(pasta)
    PROVAS[_pid]['_suportes'] = lambda pasta: _uerj_suportes(pasta)
    PROVAS[_pid]['nota'] = PROVAS[_pid]['nota'].split(' Arquivos obtidos')[0] + ' Caderno e gabarito oficiais do DSEA/UERJ, em cópia guardada no Google Drive do dono.'


# topo mais alto que o das outras UERJ (rótulos "QUESTÃO NN" logo no alto): o título da área no canto direito do alto
# ("CIÊNCIAS HUMANAS") é pintado de branco para não entrar no print
_UERJ_TITULOS = [r'^(TEXTO BASE|LINGUAGENS|ESPANHOL|FRANCÊS|INGLÊS|MATEMÁTICA|CIÊNCIAS DA NATUREZA|CIÊNCIAS HUMANAS)$']
PROVAS['uerj-2020-1']['apagar'] = _UERJ_TITULOS
PROVAS['uerj-2024-1']['apagar'] = _UERJ_TITULOS
PROVAS['uerj-2024-1']['topo'] = 28
PROVAS['uerj-2024-1']['ancora'] = r'^QUEST[ÃA]O\s*(\d{1,2})\s*$'   # "QUESTÃO11" (sem espaço) na p. 7
_g241 = PROVAS['uerj-2024-1']['gabarito']
PROVAS['uerj-2024-1']['gabarito'] = lambda pasta: {**_g241(pasta), 29: 'X'}   # "Anulada" (minúsculas) na grade
PROVAS['uerj-2024-1']['nota'] = PROVAS['uerj-2024-1']['nota'].replace(
    'Caderno e gabarito oficiais do DSEA/UERJ, em cópia guardada no Google Drive do dono.',
    'Gabarito oficial do DSEA/UERJ (com a 29 anulada) do Google Drive do dono; caderno oficial em cópia publicada pelo '
    'Estratégia Vestibulares.')
PROVAS['uerj-2024-2']['apagar'] = _UERJ_TITULOS
PROVAS['uerj-2020-1']['topo'] = 30   # "QUESTÃO 47" no alto da página em y≈32 (cabeçalho da área só à direita, x>460)

# UERJ 2024, 2º EQ: o caderno do Drive é a "prova comentada" do DSEA (cada questão seguida do bloco "COMENTÁRIO", com eixo,
# objetivo, resolução e gabarito). O comentário não entra no print: o bloco é um corte até a próxima questão.
PROVAS['uerj-2024-2']['topo'] = 28   # "QUESTÃO 52" em y≈30 e "QUESTÃO 48" em y≈38 (cabeçalho da área só à direita, x>480)
PROVAS['uerj-2024-2']['corte'] = PROVAS['uerj-2024-2']['corte'] + [r'^COMENT[ÁA]RIO$']
PROVAS['uerj-2024-2']['nota'] = PROVAS['uerj-2024-2']['nota'].replace(
    'Caderno e gabarito oficiais', 'Caderno (versão "prova comentada" do DSEA; o comentário não entra no print) e gabarito oficiais')


# ---------------------------------------------------------------------------------------------------------- UERR
# UERR 2021 (09/05/2021, UERR2101): caderno no padrão Vunesp, mas o rótulo "QUESTÃO" e o número ("01") são linhas
# separadas. Inglês (10–18) e espanhol (10–18, mesma numeração) vêm um depois do outro; só o inglês entra (como nas
# outras UERR): as âncoras vêm do par rótulo+número, e o bloco do espanhol (da 2ª "10" até a "19") é um corte.
def _uerr21_ancoras(pasta):
    import pymupdf
    d = pymupdf.open(pasta / 'caderno.pdf')
    out, vistos, esp = {}, set(), False
    for i, pg in enumerate(d):
        ls = [(l['bbox'], ''.join(s['text'] for s in l['spans']).strip()) for b in pg.get_text('dict')['blocks']
              for l in b.get('lines', [])]
        labs = sorted((bb[1], bb[0], int(t2)) for bb, t in ls if t == 'QUESTÃO' for bb2, t2 in ls
                      if re.fullmatch(r'\d\d', t2) and abs(bb2[1] - bb[1]) < 4 and 0 < bb2[0] - bb[0] < 60)
        labs.sort(key=lambda x: (x[1] > pg.rect.width / 2, x[0]))   # ordem de leitura: coluna esquerda, depois direita
        for y, x, n in labs:
            c = 0 if x < pg.rect.width / 2 else 1
            if n in vistos and not esp:
                esp = True   # 2ª "10": começa o espanhol
                out.setdefault(('caderno', i + 1), []).append(('corte', y - 1, c))
                continue
            if esp and n <= 18:
                continue
            esp = False
            vistos.add(n)
            out.setdefault(('caderno', i + 1), []).append((n, y - 1, c))
    return out


PROVAS['uerr-2021'] = _v.base(
    'uerr', 'UERR', 2021, '', 'UERR 2021', 72,
    nota='Universidade Estadual de Roraima, Vestibular 2021 (09/05/2021, código UERR2101): Prova Objetiva (72 questões A–E). '
         'Língua estrangeira: inglês (o espanhol, com a mesma numeração 10–18, fica fora). A redação fica fora. Caderno e '
         'gabarito oficiais, em cópia guardada no Google Drive do dono. Anuladas ficam fora.')
PROVAS['uerr-2021']['colunas'] = lambda r: _p.duas_colunas(r, 28)
PROVAS['uerr-2021']['cadernos'] = [{'arquivo': 'caderno', 'paginas': (3, 22)}]
PROVAS['uerr-2021']['suporte'] = PROVAS['uerr-2021']['suporte'] + [r'(?i)^(leia|considere) .*\bquest[õo]es\b']


def _uerr21_eventos(pasta):
    import pymupdf
    from recorta import linhas
    a = _uerr21_ancoras(pasta)
    d = pymupdf.open(pasta / 'caderno.pdf')
    rx = PROVAS['uerr-2021']['ancora']

    def ja_lida(p, y):   # rótulo e número que a camada de texto já junta numa linha ("QUESTÃO 10"): a âncora normal pega
        return any(abs(L['bbox'][1] - 1 - y) < 3 and re.match(rx, L['t']) for L in linhas(d[p - 1]))
    PROVAS['uerr-2021']['corte_forcado'] = {k: [(y, c) for n, y, c in v if n == 'corte'] for k, v in a.items()}
    return {k: [(n, y, c) for n, y, c in v if n != 'corte' and not ja_lida(k[1], y)] for k, v in a.items()}


PROVAS['uerr-2021']['_ancoras'] = _uerr21_eventos

# UERR 2024 (29/10/2023, prova da própria UERR no formato Cebraspe: "Questão N", textos "Text 1A3-I"): como uerr-2025
PROVAS['uerr-2024'] = _p.uerr(2024)
PROVAS['uerr-2024']['texto_id'] = r'(?i)\btexts?o?\s+(\d+[A-Z]\d+-[IVX]+)'
PROVAS['uerr-2024']['nota'] = ('Universidade Estadual de Roraima, Processo Seletivo Vestibular 2024 (aplicação 29/10/2023): prova '
                               'objetiva A–E (72 questões). Língua estrangeira: inglês (no gabarito, as questões 10 a 18 aparecem '
                               'duas vezes; a primeira é a do inglês, que vem antes do espanhol no caderno). Caderno do Google '
                               'Drive do dono; gabarito oficial DEFINITIVO (pós-recursos; o do Drive é o preliminar). Anuladas '
                               'ficam fora.')
# alternativa "E helps you..." colada ao título "Text 1A3-II": a linha de cima, terminada em ponto, é o fim da questão
PROVAS['uerr-2024']['suporte_ponto_final'] = True
# o poema "O navio negreiro" (p. 2, coluna esquerda, sem frase de indicação) é o texto das questões 1 a 9 (conferido)
PROVAS['uerr-2024']['suporte_forcado'] = {('caderno', 2): [(65, 0, (1, 9))]}
PROVAS['uerr-2024']['topo_pag'] = {2: 64}   # faixa cinza "-- PROVA OBJETIVA --" no alto da p. 2 fica fora
PROVAS['uerr-2024'].pop('banca')
PROVAS['uerr-2024']['banca'] = 'UERR (CPCV)'


# ---------------------------------------------------------------------------------------------------------- UFSM
PROVAS['ufsm-2024'] = _p.ufsm(2024)
PROVAS['ufsm-2024']['area_da_materia'] = True
PROVAS['ufsm-2024']['faixas_uma_auto'] = True   # páginas inteiras em largura total (alternativas em duas colunas dentro)


def _ufsm_largas(paginas):
    """Páginas em largura total (contadas no caderno: >= 3 linhas longas atravessam o meio e nenhuma começa só na
    metade direita): a página inteira é uma coluna (alternativas lado a lado dentro de uma questão larga não viram colunas)."""
    return {(arq, p): [(0, 9999, None)] for arq, ps in paginas.items() for p in ps}


# Prova 2, questão 15 (aqui 55): a instrução "Para responder às questões 15 e 16, analise a figura..." vem depois do
# parágrafo de abertura da 15; o texto de apoio das duas (abertura + figura) vai da linha 1 até a fonte da figura, e a
# questão 15 em si começa em "Assinale V (verdadeiro) ou F (falso)" (conferido no print)
PROVAS['ufsm-2024']['suporte'] = [r'(?i)^(?!Para responder às questões 15 e 16, analise a figura do ciclo)(?=.*(responder|responda)\s+(a|à|às|as)\s+quest)']
PROVAS['ufsm-2024']['suporte_forcado'] = {('p2-caderno', 10): [(80, 0, (15, 16))]}
PROVAS['ufsm-2024']['ancora_dx_pag'] = {('p2-caderno', 10): -999}   # o "15" do alto não abre a questão...
PROVAS['ufsm-2024']['_ancoras'] = lambda pasta: {('p2-caderno', 10): [(15, 484, 0)]}   # ...ela começa em "Assinale V ou F"
PROVAS['ufsm-2024']['faixas_pag'] = _ufsm_largas({'p1-caderno': (8, 9, 10, 19, 21, 22, 23), 'p2-caderno': (3, 4, 10, 12),
                                                  'p3-caderno': (2, 3, 8, 10, 13, 15, 16, 18)})
_g24 = PROVAS['ufsm-2024']['gabarito']
PROVAS['ufsm-2024']['gabarito'] = lambda pasta: {**_g24(pasta), 78: 'X'}   # Prova 2, q38 (inglês): "DC" no definitivo
PROVAS['ufsm-2024']['nota'] = PROVAS['ufsm-2024']['nota'] + (
    ' Cadernos do Google Drive do dono (idênticos aos oficiais); gabarito definitivo da página oficial (o do Drive é o '
    'preliminar). Prova 2, questão 38 (aqui 78): o definitivo dá duas alternativas corretas ("DC"), fica fora.')


def _ufsm23_gab(pasta):
    """Gabarito definitivo do Vestibular Extraordinário 2023: p. 1 = Prova 1 (01–56), p. 2 = Prova 2 (01–30; 26–30
    aparecem duas vezes, espanhol e inglês: vale a de baixo, a do inglês). Prova 2 vira 57–86."""
    import pymupdf
    d = pymupdf.open(pasta / 'gabarito.pdf')
    g = {}
    for k, pg in enumerate(d):
        ws = pg.get_text('words')
        pares = []
        for w in ws:
            if not re.fullmatch(r'\d{2}', w[4]):
                continue
            v = [o for o in ws if abs(o[1] - w[1]) < 4 and 0 < o[0] - w[2] < 120 and re.fullmatch(r'[A-E]+|ANULAD[AO]', o[4])]
            if v:
                pares.append((w[1], int(w[4]), min(v, key=lambda o: o[0])[4]))
        for y, n, v in sorted(pares):   # de cima para baixo: no inglês (abaixo do espanhol) a letra sobrescreve
            g[n + 56 * k] = v if len(v) == 1 else 'X'
    return g


_c = _p.ufsm(2023)
_c.update({
    'total': 86, 'area_da_materia': True, 'gabarito': _ufsm23_gab, 'faixas_uma_auto': True,
    'nota': 'Universidade Federal de Santa Maria, Vestibular Extraordinário 2023 (09/07/2023, Edital 057/2023): Prova 1 (56 '
            'questões A–E: História, Geografia, Filosofia, Sociologia, Química, Física, Biologia e Matemática) e Prova 2 (30 '
            'questões: Língua Portuguesa, Literatura, Artes Integradas, Educação Física, Tecnologias Digitais e língua '
            'estrangeira; aqui numeradas 57–86). Língua estrangeira: inglês. Redação fora. Cadernos do Google Drive do dono '
            '(idênticos aos oficiais); gabarito oficial definitivo (o do Drive é o preliminar). Anulada fica fora.',
    'cadernos': lambda pasta: [{'arquivo': 'p1-caderno', 'paginas': (2, _p._ufsm_ultima(pasta / 'p1-caderno.pdf')), 'questoes': (1, 56)},
                               # Prova 2: espanhol nas pp. 22–25 (título "LÍNGUA ESPANHOLA" acima da margem), inglês da p. 26
                               {'arquivo': 'p2-caderno', 'paginas': (2, 21), 'questoes': (57, 81), 'deslocamento': 56},
                               {'arquivo': 'p2-caderno', 'paginas': (26, _p._ufsm_ultima(pasta / 'p2-caderno.pdf')),
                                'questoes': (82, 86), 'deslocamento': 56}],
})
_c['corte'] = _c['corte'] + [r'^C[áa]lculos$']
_c['suporte'] = _c['suporte'] + [r'(?i)^o texto a seguir refere-se [àa]s quest']   # "...às questões 31 e 32" (Prova 1)   # quadro "Cálculos" (rascunho) depois da última questão de uma página
_c['faixas_pag'] = _ufsm_largas({'p1-caderno': (5, 9, 20, 26, 27, 28, 36), 'p2-caderno': (17,)})
_c['ancora'] = r'^(\d{1,2})$'   # Prova 2: número da questão sem zero à esquerda ("3"), em negrito
PROVAS['ufsm-2023'] = _c


# ------------------------------------------------------------------------------------------------------- Unicamp
_ga.unicamp('unicamp-2020', 2020, 'Unicamp 2020', '1ª fase', 'Q', total=90, nota_extra=', provas Q e X')
PROVAS['unicamp-2020'] = _ga.PROVAS.pop('unicamp-2020')
PROVAS['unicamp-2020']['duracao_horas'] = 5
PROVAS['unicamp-2020']['suporte'] = PROVAS['unicamp-2020']['suporte'] + [r'(?i)^leia o texto a seguir e responda [àa]s quest']
PROVAS['unicamp-2020']['corte'] = PROVAS['unicamp-2020']['corte'] + [r'(?i)^Obs\.: para as quest']   # aviso "π = 3,0" antes da 70
# p. 25: uma linha da coluna esquerda com caixa de texto até a borda direita (y≈475) virava faixa larga: duas colunas
PROVAS['unicamp-2020']['faixas_pag'] = {('caderno', 25): [(0, 9999, 299)]}
PROVAS['unicamp-2020']['nota'] = PROVAS['unicamp-2020']['nota'].split(' Arquivos obtidos')[0] + \
    ' Caderno (versão QX) e gabarito oficiais da Comvest, em cópia guardada no Google Drive do dono.'


# ----------------------------------------------------------------------------------------------- cópia dos PDFs
RAIZ = Path(__file__).resolve().parents[2]
FONTE = RAIZ / 'fontes' / 'provas-manuais'
ENTRADA = RAIZ / 'fabrica_saida' / 'ingestao'


def prepara(pid):
    import shutil
    pasta = ENTRADA / pid
    pasta.mkdir(parents=True, exist_ok=True)
    antes = {}
    if (pasta / 'manifesto.json').exists():   # o id das questões vem do sha256 do manifesto: não muda (princípio 7)
        antes = json.loads((pasta / 'manifesto.json').read_text()).get('arquivos', {})
    arqs = {}
    for papel, (pasta_fonte, nome, drive_id, *oficial) in ARQUIVOS[pid].items():
        if pasta_fonte:
            src = FONTE / pasta_fonte / 'arquivo.pdf'
            origem = f'{DRIVE}; arquivo {nome} (id {drive_id})'
            if oficial:
                origem += f'; idêntico (mesmo md5) ao PDF oficial {oficial[0]}'
        else:   # baixado do site oficial da banca
            src = RAIZ / oficial[1]
            origem = oficial[2] if len(oficial) > 2 else f'{oficial[0]} (site oficial, baixado em 27/11/2026)'
        if not src.exists():
            raise SystemExit(f'{pid}: falta {src} (Drive do dono, id {drive_id}; ou {oficial[:1]})')
        dst = pasta / f'{papel}.pdf'
        shutil.copyfile(src, dst)
        if pid.startswith('unicamp') and papel == 'caderno':
            _ga.sem_logo_no_alto(dst)   # logotipo da Comvest no alto da página não entra no print (cópia de trabalho)
        arqs[papel] = {
            'url': oficial[0] if oficial else URL_OFICIAL.get(pid.split('-')[0], VUNESP),
            'origem': origem,
            'bytes': dst.stat().st_size,
            'sha256': (antes.get(papel) or {}).get('sha256') or hashlib.sha256(dst.read_bytes()).hexdigest(),
            'sha256_arquivo': hashlib.sha256(dst.read_bytes()).hexdigest(),
            'copiado_em': datetime.now(timezone.utc).isoformat(timespec='seconds'),
        }
    (pasta / 'manifesto.json').write_text(json.dumps({'prova': pid, 'arquivos': arqs}, ensure_ascii=False, indent=2) + '\n')
    return pasta


URL_OFICIAL = {'fmj': VUNESP, 'saocamilo': VUNESP, 'uea': VUNESP, 'uerj': 'https://www.vestibular.uerj.br/', 'uerr': 'https://www.uerr.edu.br/', 'ufsm': 'https://www.ufsm.br/', 'unicamp': 'https://www.comvest.unicamp.br/'}


if __name__ == '__main__':
    for pid in (sys.argv[1:] or list(ARQUIVOS)):
        print(prepara(pid))

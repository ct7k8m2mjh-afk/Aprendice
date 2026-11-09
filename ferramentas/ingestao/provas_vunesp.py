"""Provas da Fundação Vunesp em cópias hospedadas fora do portal da Vunesp (decisão do dono, 09/11/2026).

O portal da Vunesp bloqueia acesso automático; os cadernos e gabaritos oficiais (cabeçalho e código Vunesp, mesma
numeração e ordem) foram baixados de cópias públicas hospedadas por cursinhos e portais de vestibular. A origem de cada
arquivo fica em `fontes` e em `docs/provas/origem-vunesp.md`; o dono decide os direitos depois.
Só as provas objetivas (múltipla escolha) entram; anuladas ficam fora.
"""
import re

import provas as _p   # módulo parcialmente carregado: vunesp(), texto_pdf() e pares() já existem quando isto roda

OBJETIVO = 'cópia hospedada pelo Curso Objetivo (curso-objetivo.br, página de resolução comentada)'
ESTRATEGIA = 'cópia hospedada pelo Estratégia Vestibulares (vestibulares.estrategia.com)'


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
    cfg['cadernos'] = [{'arquivo': caderno, 'paginas': paginas}]
    cfg['gabarito'] = _gab_vunesp(gabarito)
    cfg['area_da_materia'] = True   # o caderno não separa por matéria: o rótulo do simulado vem da matéria da questão
    return cfg


def mais_provas():
    P = {}
    # ------------------------------------------------------------------ Unesp (1ª fase, Conhecimentos Gerais, 90)
    for a in (2020,):
        P[f'unesp-{a}'] = base(
            'unesp', 'Unesp', a, '1ª fase', f'Unesp {a}', 90,
            nota=f'Vestibular Unesp {a}, 1ª fase: Prova de Conhecimentos Gerais (90 questões objetivas), versão 1. '
                 f'Caderno e gabarito oficiais da Vunesp, em {OBJETIVO}: o portal da Vunesp bloqueia acesso automático.')
    return P

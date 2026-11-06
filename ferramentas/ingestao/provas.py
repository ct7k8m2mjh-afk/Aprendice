"""Configuração do recorte de cada prova completa: layout do caderno, âncoras e leitura do gabarito oficial.

Cada prova diz: onde estão as colunas, o que marca o início de uma questão, o que cortar (cabeçalhos de seção,
proposta de redação), como ler o gabarito oficial e a área de cada questão segundo a própria prova.
Gabarito: dicionário n -> letra; 'X' = anulada (não entra).
"""
import re
import subprocess
from pathlib import Path


def texto_pdf(p: Path, layout=True) -> str:
    args = ['pdftotext'] + (['-layout'] if layout else []) + [str(p), '-']
    return subprocess.run(args, capture_output=True, text=True, check=True).stdout


def pares(txt, letras='ABCDE'):
    """Lê pares 'número letra' em ordem; a primeira letra após o número vence (ex.: ENEM 1–5, opção inglês)."""
    g = {}
    for m in re.finditer(rf'(?<![\d,.])(\d{{1,3}})\s+([{letras}]\b|ANULAD[AO]|Anulad[ao]|\*|X\b)', txt):
        n, v = int(m.group(1)), m.group(2)
        if n in g:
            continue
        g[n] = v if v in letras else 'X'
    return g


def duas_colunas(rect, margem=15):
    meio = rect.width / 2
    return [(margem, meio - 2), (meio - 2, rect.width - margem)]


# ----------------------------------------------------------------------------------------------- ENEM
def enem(ano):
    def gab(pasta):
        g = pares(texto_pdf(pasta / 'd1-gabarito-1.pdf'))
        g.update({n: v for n, v in pares(texto_pdf(pasta / 'd2-gabarito-7.pdf')).items() if n >= 91})
        return g

    def area(n):
        return 'Linguagens' if n <= 45 else 'Ciências Humanas' if n <= 90 else 'Ciências da Natureza' if n <= 135 else 'Matemática'

    return {
        'catalogo': 'enem', 'escola': 'ENEM', 'ano': str(ano), 'titulo': f'ENEM {ano}', 'banca': 'Inep',
        'duracao_horas': 10, 'total': 180,
        'nota': 'Caderno azul (1º dia: caderno 1; 2º dia: caderno 7). Questões 1 a 5 na opção inglês. Redação fora do simulado.',
        'cadernos': [{'arquivo': 'd1-caderno-1', 'questoes': (1, 90)}, {'arquivo': 'd2-caderno-7', 'questoes': (91, 180)}],
        'colunas': 'auto', 'topo': 74 if ano >= 2025 else 60, 'base': 36 if ano >= 2025 else 42,
        'ancora': r'(?i)^quest[ãa]o\s+(\d{1,3})\b', 'ancora_dx': 22,
        'corte': [r'(?i)^quest[õo]es de \d+ a \d+', r'PROPOSTA DE REDA', r'INSTRUÇÕES PARA A REDAÇÃO', r'^CIÊNCIAS (HUMANAS|DA NATUREZA)', r'^MATEMÁTICA E SUAS', r'^LINGUAGENS, CÓDIGOS'],
        'suporte': [r'(?i)^texto para as quest'],
        'gabarito': gab, 'area': area,
    }


PROVAS = {f'enem-{a}': enem(a) for a in (2025, 2024, 2023)}


# --------------------------------------------------------------------------------------------- Fuvest
def fuvest(ano, total, duracao=5):
    def gab(pasta):
        g = {}
        for linha in texto_pdf(pasta / 'fase1-gabarito.pdf').splitlines():
            # cada linha traz as 4 versões lado a lado; a V1 são os dois primeiros pares
            for n, v in re.findall(r'(?<![\d,.])(\d{1,2})\s+([A-E]\b|\*|X\b|ANULADA|Anulada)', linha)[:2]:
                g.setdefault(int(n), v if v in 'ABCDE' and len(v) == 1 else 'X')
        return g

    return {
        'catalogo': 'fuvest', 'escola': 'Fuvest', 'ano': str(ano), 'fase': '1ª fase', 'titulo': f'Fuvest {ano}', 'banca': 'Fuvest',
        'duracao_horas': duracao, 'total': total,
        'nota': 'Prova de Conhecimentos Gerais, versão V1.',
        'cadernos': [{'arquivo': 'fase1-caderno-V1'}],
        'colunas': 'auto', 'margem': 25, 'topo': 37, 'base': 40,
        'ancora': r'^\{(\d{1,2})\}$', 'ancora_dx': 24,
        'corte': [],
        'suporte': [r'(?i)^texto para as quest'],
        'gabarito': gab, 'area': lambda n: 'Conhecimentos gerais',
    }


PROVAS.update({'fuvest-2027': fuvest(2027, 80), 'fuvest-2025': fuvest(2025, 90)})


def fuvest_v(ano, total=90, versao='V'):
    """Fuvest 2020–2024 e 2026: caderno da versão V (2026: V1), questões numeradas "04" (2026: "{04}").
    Gabarito: a versão V é a 1ª coluna do PDF. Questão com duas respostas aceitas ("48 D E") fica fora,
    como anulada: o simulado só corrige uma letra."""
    cfg = fuvest(ano, total)

    def gab(pasta):
        g = {}
        for linha in texto_pdf(pasta / 'fase1-gabarito.pdf').splitlines():
            m = re.match(r'^\s*(\d{1,2})\s+([A-E](?: [A-E])?|\*|X|ANULADA|Anulada)\s+(\d{1,2})\s+([A-E](?: [A-E])?|\*|X|ANULADA|Anulada)(?=\s|$)', linha)
            if not m:
                continue
            for n, v in ((m.group(1), m.group(2)), (m.group(3), m.group(4))):
                g.setdefault(int(n), v if len(v) == 1 and v in 'ABCDE' else 'X')
        return g

    cfg.update({
        'nota': f'Prova de Conhecimentos Gerais, versão {versao}. Gabarito oficial da Fuvest (coluna da versão {versao}); '
                'questão anulada ou com duas respostas aceitas fica fora do simulado.',
        'cadernos': [{'arquivo': 'fase1-caderno', 'paginas': (2, 999)}],
        'ancora': r'^\{(\d{1,2})\}$' if ano >= 2025 else r'^(\d{2})$', 'ancora_dx': 24, 'sequencial': True,
        'suporte': [r'(?i)^texto para as quest', r'(?i)responder [àa]s quest'],
        'gabarito': gab,
    })
    return cfg


PROVAS.update({f'fuvest-{a}': fuvest_v(a) for a in (2020, 2021, 2022, 2023, 2024)})
PROVAS['fuvest-2021']['larga'] = {26: 574}   # questão 90 ocupa as duas colunas no pé da página 26
# 2021: a camada de texto do caderno não tem mapa de caracteres (sai lixo): questões localizadas por OCR (o print é a página)
PROVAS['fuvest-2021']['cadernos'] = [{'arquivo': 'fase1-caderno', 'paginas': (2, 999), 'ocr_so_texto': True}]
PROVAS['fuvest-2021']['uma_coluna'] = (6,)   # questão 18 ocupa a página inteira
PROVAS['fuvest-2026'] = fuvest_v(2026, versao='V1')


# ------------------------------------------------------------------------------------------------ UEL
def uel(ano, total=60, duracao=4):
    def gab(pasta):
        return pares(texto_pdf(pasta / 'fase1-gabarito-definitivo-tipo1.pdf'))

    return {
        'catalogo': 'uel', 'escola': 'UEL', 'ano': str(ano), 'fase': '1ª fase', 'titulo': f'UEL {ano}', 'banca': 'Cops-UEL',
        'duracao_horas': duracao, 'total': total,
        'nota': 'Prova de Conhecimentos Gerais, Tipo 1, opção Língua Inglesa. Caderno limpo (o definitivo publicado é comentado e mostra a resposta); gabarito definitivo. "*" = pontos para todos (anulada).',
        'cadernos': [{'arquivo': 'fase1-caderno-provisorio-tipo1', 'paginas': (2, 999)}],  # capa tem a grade de respostas numerada
        'colunas': 'auto', 'margem': 18, 'topo': 68, 'base': 32,
        'ancora': r'^(\d{1,2})$', 'ancora_dx': 30, 'sequencial': True,
        # "Leia o texto a seguir" vem DEPOIS do número e faz parte da questão: aqui não há texto compartilhado
        'corte': [r'(?i)redija um texto', r'(?i)^PROVA DE REDA', r'^R\s*A\s*S\s*C\s*U\s*N\s*H\s*O', r'^Boa [Ss]orte'],
        'suporte': [r'(?i)(responda|para) [àa]s quest[õo]es'],
        'gabarito': gab, 'area': lambda n: 'Conhecimentos gerais',
    }


PROVAS.update({f'uel-{a}': uel(a) for a in (2026, 2025, 2024)})
PROVAS.update({f'uel-{a}': uel(a) for a in (2023, 2020)})
PROVAS['uel-2020']['base'] = 38   # rodapé "8 / 27" um pouco mais alto que nas edições recentes


def uel_comentada(ano, total=50, duracao=4):
    """UEL 2021 e 2022 (fase única, pandemia): só existe o caderno definitivo comentado da opção inglês.
    O print vai do número da questão até "Alternativa correta" (a justificativa fica fora) e a alternativa
    correta, pintada de azul no caderno, volta para a cor do texto."""
    cfg = uel(ano, total, duracao)
    cfg.update({
        'fase': 'Fase única',
        'nota': 'Fase única (pandemia): Conhecimentos Gerais, Língua Portuguesa e Literatura, Língua Inglesa. Tipo 1. '
                'Print do caderno definitivo comentado pela Cops, só o enunciado (a justificativa fica fora; a alternativa '
                'correta, destacada em azul no original, aparece na cor do texto). Gabarito oficial definitivo.',
        'cadernos': [{'arquivo': 'fase1-caderno-definitivo-tipo1', 'paginas': (3, 999)}],
        'colunas': lambda r: [(36, r.width - 30)], 'topo': 36, 'base': 40, 'margem': 36,
        'ancora': r'^(\d{1,2})$', 'ancora_dx': 14, 'sequencial': True,
        'fim': [r'^Alternativa correta'],
        'neutralizar_cores': (0x3553a4, 0x0000ff),
        'corte': [r'(?i)^O tema desta prova', r'(?i)redija um texto', r'(?i)^PROVA DE REDA'],
    })
    return cfg


PROVAS.update({f'uel-{a}': uel_comentada(a) for a in (2022, 2021)})


# ----------------------------------------------------------------------------------------------- UFPR
UFPR_SECOES = {
    'MATEMÁTICA': 'Matemática', 'FÍSICA': 'Física', 'QUÍMICA': 'Química', 'BIOLOGIA': 'Biologia',
    'GEOGRAFIA': 'Geografia', 'HISTÓRIA': 'História', 'LÍNGUA PORTUGUESA': 'Língua Portuguesa',
    'LITERATURA BRASILEIRA': 'Literatura', 'LITERATURA': 'Literatura', 'FILOSOFIA': 'Filosofia',
    'SOCIOLOGIA': 'Sociologia', 'INGLÊS': 'Inglês',
}
UFPR_LINGUAS = ['ALEMÃO', 'ESPANHOL', 'FRANCÊS', 'INGLÊS', 'ITALIANO', 'JAPONÊS', 'POLONÊS']


def _ufpr_paginas(pdf_path):
    """Páginas (1-based) onde começa cada seção de língua estrangeira."""
    import pymupdf
    d = pymupdf.open(pdf_path)
    ini = {}
    for i, p in enumerate(d):
        for b in p.get_text('dict')['blocks']:
            for l in b.get('lines', []):
                t = ''.join(s['text'] for s in l['spans']).strip()
                if t in UFPR_LINGUAS and t not in ini:
                    ini[t] = i + 1
    return ini, len(d)


def ufpr(ano, total=90, duracao=5, cads=None):
    arq = 'fase1-gabarito-definitivo'

    def cadernos(pasta):
        if cads:
            return cads
        ini, n = _ufpr_paginas(pasta / (arq + '.pdf'))
        primeira_lingua = min(ini.values())
        depois = sorted(v for v in ini.values() if v > ini['INGLÊS'])
        fim_ingles = (depois[0] - 1) if depois else n - 1
        return [
            {'arquivo': arq, 'paginas': (3, primeira_lingua), 'questoes': (1, 82)},
            # língua pode começar no meio da página: só vale o que vem depois do título INGLÊS
            {'arquivo': arq, 'paginas': (ini['INGLÊS'], fim_ingles + 1), 'questoes': (83, 90), 'depois_de': 'Inglês'},
        ]

    def gab(pasta):
        import pymupdf
        g, marcas, anuladas = {}, {}, set()
        d = pymupdf.open(pasta / (arq + '.pdf'))
        tudo = '\n'.join(p.get_text() for p in d)
        # o sentido dos asteriscos muda por ano ("* Questão anulada", "** Questão com resposta alterada"):
        # vale a nota de rodapé do próprio caderno
        estrelas_anula = {m.group(1) for m in re.finditer(r'(?m)^\s*(\*{1,2})\s*Quest[ãa]o anulada', tudo)}
        rx = re.compile(r'(?m)^[ \t]*(\*{0,2})[ \t]*(\d{2})[ \t]*-(?=\s)|►\s*([A-Ea-e])\)|^[ \t]*(' + '|'.join(UFPR_LINGUAS) + r')[ \t]*$')
        for cad in cadernos(pasta):
            lo, hi = cad['questoes']
            atual, dentro = None, not cad.get('depois_de')
            texto_cad = '\n'.join(d[pi].get_text() for pi in range(cad['paginas'][0] - 1, cad['paginas'][1]))
            for m in rx.finditer(texto_cad):
                if m.group(4):   # título de língua
                    if m.group(4) == 'INGLÊS':
                        dentro = True
                    elif cad.get('depois_de') and dentro:
                        break
                    else:
                        atual = None
                    continue
                if not dentro:
                    continue
                if m.group(2):
                    n = int(m.group(2))
                    atual = n if lo <= n <= hi else None
                    if atual and m.group(1) and m.group(1) in estrelas_anula:
                        anuladas.add(n)
                elif atual is not None:   # até 2023 as letras são minúsculas
                    marcas.setdefault(atual, []).append(m.group(3).upper())
        for n, l in marcas.items():
            g[n] = l[0] if len(set(l)) == 1 else 'X'
        for n in anuladas:
            g[n] = 'X'
        # anuladas pelo relatório oficial, na numeração da prova 001 (a mesma do caderno "Geral")
        rel = pasta / 'fase1-anuladas-alteradas.pdf'
        if rel.exists():
            txt = texto_pdf(rel, layout=False)
            if 'ANULADAS' in txt:
                bloco = txt.split('ANULADAS', 1)[1].split('ALTERADO', 1)[0]
                for pr, q in re.findall(r'PROVA:\s*(\d{3})[^\n]*\n\s*QUEST[ÃA]O:\s*(\d+)', bloco):
                    if pr == '001':
                        g[int(q)] = 'X'
        return g

    return {
        'catalogo': 'ufpr', 'escola': 'UFPR', 'ano': str(ano), 'fase': '1ª fase', 'titulo': f'UFPR {ano}', 'banca': 'NC-UFPR',
        'duracao_horas': duracao, 'total': total,
        'nota': 'Prova de Conhecimentos Gerais, prova 001 (Inglês). Gabarito: caderno oficial definitivo com a resposta marcada (►); o símbolo é apagado do print.',
        'cadernos': cadernos, 'redigir': '►',
        'colunas': lambda r: [(20, r.width - 15)], 'topo': 30, 'base': 30,
        'ancora': r'^\*{0,2}\s?(\d{2})\s*-', 'ancora_dx': 30, 'sequencial': False,  # "*15 -" = anulada no próprio caderno
        'secoes': UFPR_SECOES, 'corte': [r'^RESPOSTAS$', r'^COMPREENSÃO E PRODUÇÃO DE TEXTO$', r'^QUESTÃO DISCURSIVA$'] + [rf'^{l}$' for l in UFPR_LINGUAS if l != 'INGLÊS'], 'suporte': [r'(?i)texto (a seguir )?(é|e) referente [àa]s quest', r'(?i)^as quest[õo]es \d+ (a|e) \d+'],
        'gabarito': gab, 'area': lambda n: 'Língua estrangeira' if n >= 83 else 'Conhecimentos gerais',
    }


PROVAS.update({f'ufpr-{a}': ufpr(a) for a in (2026, 2025, 2024)})
PROVAS.update({f'ufpr-{a}': ufpr(a) for a in (2023, 2020)})
# 2021 (pandemia): 60 questões, arquivo só da versão inglês, sem seções de língua
PROVAS['ufpr-2021'] = ufpr(2021, total=60, cads=[{'arquivo': 'fase1-gabarito-definitivo', 'paginas': (3, 16), 'questoes': (1, 60)}])
PROVAS['ufpr-2021']['area'] = lambda n: 'Conhecimentos gerais'
PROVAS['ufpr-2021']['fase'] = 'Fase única'
PROVAS['ufpr-2021']['nota'] = ('Fase única (pandemia), 60 questões, versão inglês. Gabarito: caderno oficial definitivo com a resposta '
                               'marcada (►); o símbolo é apagado do print. Questão marcada com * = anulada.')
# 2022 (fase única): língua estrangeira primeiro (01 a 04, seção INGLÊS), depois as questões gerais 05 a 60
PROVAS['ufpr-2022'] = ufpr(2022, total=60, cads=[
    {'arquivo': 'fase1-gabarito-definitivo', 'paginas': (6, 7), 'questoes': (1, 4), 'depois_de': 'Inglês'},
    {'arquivo': 'fase1-gabarito-definitivo', 'paginas': (9, 23), 'questoes': (5, 60)}])
PROVAS['ufpr-2022']['area'] = lambda n: 'Língua estrangeira' if n <= 4 else 'Conhecimentos gerais'
PROVAS['ufpr-2022']['fase'] = 'Fase única'
PROVAS['ufpr-2022']['nota'] = ('Fase única, 60 questões: língua estrangeira (inglês) nas questões 1 a 4, depois as gerais. Gabarito: '
                               'caderno oficial definitivo com a resposta marcada (►); o símbolo é apagado do print. * = anulada.')


# ---------------------------------------------------------------------------------------------- Acafe
ACAFE_SECOES = {
    'LÍNGUA PORTUGUESA E LITERATURA BRASILEIRA': 'Língua Portuguesa e Literatura', 'ESPANHOL': 'Espanhol',
    'INGLÊS': 'Inglês', 'MATEMÁTICA': 'Matemática', 'FÍSICA': 'Física', 'QUÍMICA': 'Química',
    'BIOLOGIA': 'Biologia', 'HISTÓRIA': 'História', 'GEOGRAFIA': 'Geografia',
    'REDAÇÃO': 'Redação', 'QUESTÕES OBJETIVAS': 'Questões objetivas',
}


def acafe(ano, sem, total=63, duracao=4.5):
    nome = 'Inverno' if sem == 2 else 'Verão'

    def gab(pasta):
        # fonte: gabarito oficial. 15–21 aparece duas vezes (espanhol, depois inglês): fica a do inglês.
        ocorr = {}
        for n, v in re.findall(r'(?<![\d,.])(\d{1,2})\s+([A-E]\b|\*|X\b|ANULADA|Anulada)', texto_pdf(pasta / 'gabarito-oficial.pdf')):
            ocorr.setdefault(int(n), []).append(v if len(v) == 1 and v in 'ABCDE' else 'X')
        g = {n: (l[1] if len(l) > 1 and 15 <= n <= 21 else l[0]) for n, l in ocorr.items()}
        # conferência com a prova comentada pela banca ("Alternativa correta letra: X"), na seção de inglês
        com, atual, secao = {}, None, None
        for linha in texto_pdf(pasta / 'caderno-comentado.pdf', layout=False).splitlines():
            t = linha.strip()
            if t in ACAFE_SECOES:
                secao = t
            m = re.match(r'^(\d{2})\)', t)
            if m:
                atual = int(m.group(1))
            m = re.search(r'Alternativa correta letra:\s*([A-E])', t)
            if m and atual and secao != 'ESPANHOL':
                com.setdefault(atual, m.group(1))
        divergentes = [n for n in g if n in com and g[n] in 'ABCDE' and com[n] != g[n]]
        if divergentes:
            print(f'  AVISO acafe {ano}/{sem}: comentada diverge do gabarito oficial em {divergentes} (vale o oficial)')
        return g

    return {
        'catalogo': 'acafe', 'escola': 'Acafe', 'ano': str(ano), 'fase': nome, 'titulo': f'Acafe {nome} {ano}', 'banca': 'Acafe',
        'duracao_horas': duracao, 'total': total, 'alternativas': 4,
        'nota': 'Vestibular de Medicina Acafe. Língua estrangeira: inglês. Print da prova oficial comentada, só o enunciado (os dados e a justificativa da banca ficam fora).',
        'cadernos': [{'arquivo': 'caderno-comentado'}],
        'colunas': lambda r: [(30, r.width - 25)], 'topo': 26, 'base': 20, 'rodape_num': True,
        'ancora': r'^(\d{2})\)', 'ancora_dx': 30,
        # a prova comentada pinta a alternativa correta de vermelho: volta para a cor do texto no print
        'neutralizar_cores': (0xff0000, 0xee0000, 0xed0000),
        'secoes': ACAFE_SECOES, 'pular_secoes': ('Espanhol', 'Redação'),
        'fim': [r'^Dados da quest', r'^_{10,}'], 'corte': [r'^FORMULÁRIO DE FÍSICA', r'^CONSTANTES FÍSICAS'],
        'suporte': [r'^Texto \d+\s*$', r'(?i)^(leia|observe) (o|a|os|as) (texto|imagem|tirinha|charge|gráfico)'], 'suporte_ate_proximo': True,
        'gabarito': gab, 'area': lambda n: 'Conhecimentos gerais',
    }


PROVAS.update({
    'acafe-2026-inverno': acafe(2026, 2), 'acafe-2026-verao': acafe(2026, 1),
    'acafe-2025-inverno': acafe(2025, 2), 'acafe-2025-verao': acafe(2025, 1), 'acafe-2024-inverno': acafe(2024, 2),
})


# ------------------------------------------------------------------------------------------ UPE (SSA3)
UPE_SECOES = {
    'LINGUAGENS E SUAS TECNOLOGIAS': 'Linguagens', 'CIÊNCIAS HUMANAS E SOCIAIS APLICADAS': 'Ciências Humanas',
    'MATEMÁTICA E SUAS TECNOLOGIAS': 'Matemática', 'CIÊNCIAS DA NATUREZA E SUAS TECNOLOGIAS': 'Ciências da Natureza',
    'MATEMÁTICA': 'Matemática', 'FÍSICA': 'Física', 'QUÍMICA': 'Química', 'BIOLOGIA': 'Biologia',
    'HISTÓRIA': 'História', 'GEOGRAFIA': 'Geografia', 'SOCIOLOGIA': 'Sociologia', 'FILOSOFIA': 'Filosofia',
    'LÍNGUA PORTUGUESA': 'Língua Portuguesa', 'LITERATURA': 'Literatura', 'INGLÊS': 'Inglês', 'LÍNGUA INGLESA': 'Inglês',
    'ESPANHOL': 'Espanhol', 'LÍNGUA ESPANHOLA': 'Espanhol', 'ARTES': 'Artes', 'EDUCAÇÃO FÍSICA': 'Educação Física',
}


def upe(ano, duracao=9):
    def gabaritos(pasta):
        g1 = pares(texto_pdf(pasta / 'd1-gabarito-definitivo.pdf'))   # 1ª letra = opção inglês
        g2 = pares(texto_pdf(pasta / 'd2-gabarito-definitivo.pdf'))
        return g1, g2

    def gab(pasta):
        g1, g2 = gabaritos(pasta)
        d = max(g1)
        return {**g1, **{n + d: v for n, v in g2.items()}}

    def cadernos(pasta):
        g1, g2 = gabaritos(pasta)
        d = max(g1)
        return [{'arquivo': 'd1-caderno', 'questoes': (1, d), 'ocr_se_vazio': True},
                {'arquivo': 'd2-caderno', 'questoes': (d + 1, d + max(g2)), 'deslocamento': d, 'ocr_se_vazio': True}]

    cfg = {
        'catalogo': 'upe', 'escola': 'UPE', 'ano': str(ano), 'fase': 'SSA3', 'titulo': f'UPE SSA3 {ano}', 'banca': 'UPE',
        'duracao_horas': duracao,
        'nota': 'Sistema Seriado de Avaliação, 3ª fase (dois dias). 2º dia numerado a partir do fim do 1º. Língua estrangeira: inglês. Gabarito definitivo.',
        'cadernos': cadernos,
        'colunas': lambda r: [(28, r.width - 22)], 'topo': 40, 'base': 20, 'rodape_num': True,
        'ancora': r'^(\d{1,2})\.(\s|$)', 'ancora_dx': 22, 'sequencial': True,
        'secoes': UPE_SECOES,
        'corte': [r'PROPOSTA DE TEMA PARA A REDA', r'(?i)quest[õo]es de \d+ a \d+ \(op[çc][ãa]o', r'(?i)^as quest[õo]es de \d+ a \d+ avaliam',
                  r'CIÊNCIAS HUMANAS E SOCIAIS APLICADAS', r'CIÊNCIAS DA NATUREZA E SUAS', r'^\W*MATEMÁTICA E SUAS'],
        'suporte': [r'(?i)^texto para as (quest|cuest)', r'(?i)^texts? \d+ \(for quest', r'(?i)^textos? \d+ \(para (as|las) (quest|cuest)',
                    r'(?i)^(text|texto)s? para (as|las) (quest|cuest)', r'(?i)(refere|referem)-se [àa]s quest[õo]es'],
        'gabarito': gab, 'area': lambda n: 'Conhecimentos gerais',
    }
    cfg['total_de'] = lambda pasta: max(gab(pasta))
    return cfg


PROVAS.update({f'upe-ssa3-{a}': upe(a) for a in (2026, 2025, 2024, 2023, 2022, 2021, 2020)})


# ----------------------------------------------------------------------------------------------- CMMG
CMMG_COLUNAS = [('PORTUGUESA', 'Língua Portuguesa e Literatura'), ('INGLÊS', 'Inglês'), ('BIOLOGIA', 'Biologia'),
                ('FÍSICA', 'Física'), ('QUÍMICA', 'Química'), ('MATEMÁTICA', 'Matemática')]


def cmmg(ano, sem, ocr=False, duracao=4.5):
    areas = {}

    def gab(pasta):
        """Gabarito definitivo em colunas por matéria: a matéria de cada questão sai da coluna em que ela está."""
        txt = texto_pdf(pasta / 'gabarito-definitivo.pdf')
        linhas = txt.splitlines()
        cab = next((l for l in linhas if 'BIOLOGIA' in l and 'QUÍMICA' in l), '')
        pos = [(cab.find(k) + len(k) / 2, nome) for k, nome in CMMG_COLUNAS if cab.find(k) >= 0]
        g = {}
        for l in linhas:
            for m in re.finditer(r'(?<![\d,.])(\d{1,2})\.\s*([A-E]\b|ANULAD[AO]|\*|X\b)', l):
                n = int(m.group(1))
                g.setdefault(n, m.group(2) if len(m.group(2)) == 1 and m.group(2) in 'ABCDE' else 'X')
                if pos:
                    centro = m.start() + 2
                    areas[n] = min(pos, key=lambda p: abs(p[0] - centro))[1]
        return g

    return {
        'catalogo': 'cmmg', 'escola': 'FCM-MG', 'ano': str(ano), 'fase': f'{sem}º semestre', 'titulo': f'FCM-MG {ano}/{sem}',
        'banca': 'Feluma', 'duracao_horas': duracao, 'alternativas': 4,
        'nota': 'Faculdade Ciências Médicas de Minas Gerais, vestibular de Medicina. Gabarito definitivo.'
                + (' Caderno com fonte sem texto legível: questões localizadas por OCR (o print é a página original).' if ocr else ''),
        'cadernos': [{'arquivo': 'caderno', 'paginas': (2, 999), 'ocr': ocr}],
        'colunas': lambda r: [(14, r.width - 14)], 'topo': 50 if not ocr else 52, 'base': 20, 'rodape_num': True,
        'ancora': r'^0?(\d{1,2})\s?[.,](\s|$)', 'ancora_dx': 30, 'sequencial': True,
        'corte': [r'(?i)^PROVA DE REDA', r'(?i)^PROPOSTA DE REDA', r'^REDAÇÃO$', r'(?i)^RASCUNHO', r'^Tabela peri'],
        'suporte': [r'(?i)para responder [àa]s? quest(ão|ao|ões|oes)', r'(?i)^[A-ZÁÉÍÓÚÂÊÔÃÕÇ ]+ ?[-–] ?QUEST[ÕO]ES DE \d+ A \d+'],
        'gabarito': gab, 'area': lambda n: areas.get(n, 'Conhecimentos gerais'),
    }


for _a, _s, _o in ((2026, 2, False), (2025, 1, True), (2024, 2, False), (2024, 1, False)):
    _c = cmmg(_a, _s, _o)
    _c['total_de'] = (lambda c: (lambda pasta: max(c['gabarito'](pasta))))(_c)
    PROVAS[f'cmmg-{_a}-{_s}'] = _c


# ------------------------------------------------------------------------------- Vunesp (layout padrão)
def vunesp(pid_catalogo, escola, ano, fase, titulo, total, caderno='caderno-prova-II', gabarito='gabarito',
           duracao=None, nota='', alternativas=5):
    """Cadernos da Fundação Vunesp (São Camilo, Unesp, Santa Casa, Einstein, FMABC, UEA...):
    duas colunas, "QUESTÃO 07", alternativas "(A)", gabarito "1 - E"."""
    def gab(pasta):
        g = {}
        for n, v in re.findall(r'(?<![\d,.])(\d{1,2})\s*[-–]\s*([A-E]\b|\*|X\b|ANULAD[AO])', texto_pdf(pasta / (gabarito + '.pdf'))):
            g.setdefault(int(n), v if len(v) == 1 and v in 'ABCDE' else 'X')
        return g

    return {
        'catalogo': pid_catalogo, 'escola': escola, 'ano': str(ano), 'fase': fase, 'titulo': titulo, 'banca': 'Vunesp',
        'duracao_horas': duracao, 'total': total, 'alternativas': alternativas, 'nota': nota,
        'cadernos': [{'arquivo': caderno, 'paginas': (2, 999)}],
        'colunas': lambda r: duas_colunas(r, 28), 'topo': 20, 'base': 32,
        'ancora': r'(?i)^quest[ãa]o\s+(\d{1,3})\b', 'ancora_dx': 34,
        'corte': [r'(?i)^CLASSIFICAÇÃO PERIÓDICA', r'(?i)^REDAÇÃO$', r'(?i)^Confidencial até'],
        'suporte': [r'(?i)para responder [àa]s? quest'],
        'gabarito': gab, 'area': lambda n: 'Conhecimentos gerais',
    }


PROVAS['saocamilo-2024-2'] = vunesp(
    'saocamilo', 'São Camilo', 2024, '2º semestre', 'São Camilo 2024/2', 40, duracao=5,
    nota='Centro Universitário São Camilo, Medicina, Prova II (objetiva), versão 1. Caderno e gabarito oficiais da Vunesp '
         '(CUSC2302), em cópia hospedada pelo Curso Objetivo: o portal da Vunesp bloqueia acesso automático.')


# ------------------------------------------------------------------------------------- PUC-Campinas
def puccampinas(ano, duracao=5):
    def gab(pasta):
        g = pares(texto_pdf(pasta / 'gabarito-geral.pdf'))
        g.update({n + 50: v for n, v in pares(texto_pdf(pasta / 'gabarito-especifica.pdf')).items()})
        return g

    return {
        'catalogo': 'puccampinas', 'escola': 'PUC-Campinas', 'ano': str(ano), 'fase': '', 'titulo': f'PUC-Campinas {ano}',
        'banca': 'PUC-Campinas', 'duracao_horas': duracao, 'total': 70,
        'nota': 'Vestibular de Medicina: Prova Geral (1 a 50) e Prova Específica (numerada aqui 51 a 70). '
                'Gabarito divulgado pela PUC-Campinas no dia da prova; reconferir após os recursos.',
        'cadernos': [{'arquivo': 'livrete', 'paginas': (3, 16), 'questoes': (1, 50)},
                     {'arquivo': 'livrete', 'paginas': (22, 29), 'questoes': (51, 70), 'deslocamento': 50}],
        'colunas': lambda r: [(14, r.width - 14)], 'topo': 26, 'base': 20, 'rodape_num': True,
        'ancora': r'^(\d{1,2})\.$', 'ancora_dx': 30, 'sequencial': True,
        'corte': [r'^REDAÇÃO$', r'^PROVA (GERAL|ESPECÍFICA)$'], 'suporte': [r'(?i)(para|responder) [àa]s quest[õo]es'],
        'gabarito': gab, 'area': lambda n: 'Prova geral' if n <= 50 else 'Prova específica',
    }


PROVAS['puccampinas-2027'] = puccampinas(2027)


# ---------------------------------------------------------------------------------------------- Unifor
UNIFOR_SECOES = {
    'MATEMÁTICA E SUAS TECNOLOGIAS': 'Matemática', 'CIÊNCIAS DA NATUREZA E SUAS TECNOLOGIAS': 'Ciências da Natureza',
    'CIÊNCIAS HUMANAS E SUAS TECNOLOGIAS': 'Ciências Humanas', 'LINGUAGENS, CÓDIGOS E SUAS TECNOLOGIAS': 'Linguagens',
    'LINGUAGENS E CÓDIGOS E SUAS TECNOLOGIAS': 'Linguagens', 'LÍNGUA INGLESA': 'Inglês', 'LÍNGUA ESPANHOLA': 'Espanhol',
    'INGLÊS': 'Inglês', 'ESPANHOL': 'Espanhol',
}


def unifor(ano, sem, duracao=5):
    def gab(pasta):
        """Grade: linha de números, linha de letras (X = anulada). Só a parte INGLÊS."""
        txt = texto_pdf(pasta / 'gabarito.pdf')
        parte = txt.split('ESPANHOL')[0]
        linhas = [l.split() for l in parte.splitlines() if l.strip()]
        g = {}
        for a, b in zip(linhas, linhas[1:]):
            if a and all(x.isdigit() for x in a) and b and all(re.fullmatch(r'[A-EX*]', x) for x in b) and len(a) == len(b):
                for n, v in zip(a, b):
                    g[int(n)] = v if v in 'ABCDE' else 'X'
        return g

    return {
        'catalogo': 'unifor', 'escola': 'Unifor', 'ano': str(ano), 'fase': f'{sem}º semestre', 'titulo': f'Unifor {ano}.{sem}',
        'banca': 'Unifor (CPPS)', 'duracao_horas': duracao, 'total': 60,
        'nota': 'Universidade de Fortaleza, vestibular de Medicina. Língua estrangeira: inglês. Gabarito oficial retificado.',
        'cadernos': [{'arquivo': 'caderno', 'paginas': (2, 999)}],
        'colunas': 'auto', 'margem': 40, 'topo': 30, 'base': 72, 'rodape_num': False,  # rodapé com logotipo fica fora
        'ancora': r'(?i)^quest[ãa]o\s+(\d{1,2})\b', 'ancora_dx': 40,
        'secoes': UNIFOR_SECOES, 'pular_secoes': ('Espanhol',),
        'corte': [r'(?i)^PROPOSTA DE REDA', r'(?i)^REDAÇÃO$', r'(?i)^RASCUNHO'],
        'suporte': [r'(?i)(para|responder) [àa]s quest[õo]es', r'(?i)^texto para as quest'],
        'gabarito': gab, 'area': lambda n: 'Conhecimentos gerais',
    }


for _a, _s in ((2027, 1), (2026, 2), (2026, 1), (2025, 1)):
    PROVAS[f'unifor-{_a}-{_s}'] = unifor(_a, _s)


# ------------------------------------------------------------------------------------- PUC-SP (NucVest)
PUCSP_AREAS = [('MATEMÁTICA', 'Matemática'), ('NATUREZA', 'Ciências da Natureza'), ('HUMANAS', 'Ciências Humanas'),
               ('LINGUAGENS', 'Linguagens')]


def pucsp(ano, duracao=5):
    areas = {}

    def gab(pasta):
        """Gabarito em blocos por área, em duas colunas: a área de cada número é o último cabeçalho da sua coluna."""
        g, atual = {}, {0: None, 1: None}
        for l in texto_pdf(pasta / 'gabarito.pdf').splitlines():
            meio = 40
            for k, nome in PUCSP_AREAS:
                i = l.find(k)
                if i >= 0:
                    atual[0 if i < meio else 1] = nome
            for m in re.finditer(r'(?<![\d,.])(\d{1,2})\s+([A-E]\b|ANULAD[AO])', l):
                n = int(m.group(1))
                g.setdefault(n, m.group(2) if len(m.group(2)) == 1 else 'X')
                lado = 0 if m.start() < meio else 1
                if atual[lado]:
                    areas[n] = atual[lado]
        return g

    return {
        'catalogo': 'pucsp', 'escola': 'PUC-SP', 'ano': str(ano), 'fase': 'Verão', 'titulo': f'PUC-SP {ano}',
        'banca': 'NucVest', 'duracao_horas': duracao, 'total': 50,
        'nota': 'Vestibular de Verão da PUC-SP (a mesma prova de Medicina). Caderno e gabarito oficiais publicados pela NucVest.',
        'cadernos': [{'arquivo': 'caderno', 'paginas': (2, 999)}],
        'colunas': 'por_ancora', 'margem': 28, 'topo': 26, 'topo_pag': {2: 170}, 'base': 30, 'rodape_num': True,
        'ancora': r'(?i)^quest[ãa]o\s+(\d{1,2})\b', 'ancora_dx': 300,
        'corte': [r'(?i)^quest[õo]es de \d+ a \d+$', r'(?i)^PROPOSTA DE REDA', r'(?i)^REDAÇÃO$', r'^IMPORTANTE\s*[–-]?', r'(?i)^Na próxima página'],
        'suporte': [r'(?i)(texto|textos) para as quest', r'(?i)para responder [àa]s quest'],
        'gabarito': gab, 'area': lambda n: areas.get(n, 'Conhecimentos gerais'),
    }


for _a in (2026, 2025, 2024):
    PROVAS[f'pucsp-{_a}'] = pucsp(_a)


# ------------------------------------------------------------------------------------------------ UFU
UFU_SECOES = {
    'BIOLOGIA': 'Biologia', 'FILOSOFIA': 'Filosofia', 'FÍSICA': 'Física', 'GEOGRAFIA': 'Geografia', 'HISTÓRIA': 'História',
    'ESPANHOL': 'Espanhol', 'INGLÊS': 'Inglês', 'FRANCÊS': 'Francês', 'LÍNGUA PORTUGUESA': 'Língua Portuguesa',
    'LITERATURA': 'Literatura', 'MATEMÁTICA': 'Matemática', 'QUÍMICA': 'Química', 'SOCIOLOGIA': 'Sociologia',
    'LÍNGUA ESPANHOLA': 'Espanhol', 'LÍNGUA INGLESA': 'Inglês', 'LÍNGUA FRANCESA': 'Francês',
}


def ufu(ano, duracao=4.5):
    def gab(pasta):
        """Tabela com os tipos lado a lado: o 1º par de cada linha é o Tipo 1. As questões de língua estrangeira
        repetem a numeração (espanhol, depois inglês): vale a última ocorrência, a do inglês. N* = anulada."""
        txt = texto_pdf(pasta / 'gabarito.pdf')
        assert txt.find('Inglês') > txt.find('Espanhol') or txt.upper().find('INGLÊS') > txt.upper().find('ESPANHOL')
        g = {}
        for linha in txt.splitlines():
            m = re.match(r'^\D*?(?<![\d,.])(\d{1,2})\s+([A-D]\b|N\*?|\*|X\b|ANULAD[AO])', linha)
            if m:
                v = m.group(2)
                g[int(m.group(1))] = v if v in 'ABCD' and len(v) == 1 else 'X'
        return g

    return {
        'catalogo': 'ufu', 'escola': 'UFU', 'ano': str(ano), 'fase': '1ª fase', 'titulo': f'UFU {ano}', 'banca': 'DIRPS-UFU',
        'duracao_horas': duracao, 'alternativas': 4,
        'nota': f'Universidade Federal de Uberlândia, Processo Seletivo {ano}-2, prova objetiva (1ª fase), Tipo 1. '
                'Língua estrangeira: inglês. Gabarito oficial definitivo; anulada fica fora.',
        'cadernos': [{'arquivo': 'caderno', 'paginas': (2, 999)}],
        # cabeçalho "Processo Seletivo UFU/AAAA-2 ..." muda de altura a cada ano; rodapé "Página N" a partir de y≈794
        'colunas': lambda r: [(20, r.width - 20)], 'topo': 14, 'cabecalho': r'^Processo Seletivo UFU|^Concurso Seletivo', 'base': 49,
        'ancora': r'(?i)^quest[ãa]o\s+(\d{1,2})\b', 'ancora_dx': 320,
        'secoes': UFU_SECOES, 'pular_secoes': ('Espanhol', 'Francês'),
        'corte': [r'(?i)^PROPOSTA DE REDA', r'(?i)^RASCUNHO', r'^LÍNGUA ESTRANGEIRA$'],
        'suporte': [r'(?i)(para|responder) [àa]s quest[õo]es', r'(?i)^texto para as quest'],
        'gabarito': gab, 'area': lambda n: 'Conhecimentos gerais',
    }


for _a in range(2020, 2027):
    _c = ufu(_a)
    _c['total_de'] = (lambda c: (lambda pasta: max(c['gabarito'](pasta))))(_c)
    PROVAS[f'ufu-{_a}'] = _c

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


def ufpr(ano, total=90, duracao=5):
    arq = 'fase1-gabarito-definitivo'

    def cadernos(pasta):
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
        g, marcas = {}, {}
        d = pymupdf.open(pasta / (arq + '.pdf'))
        for cad in cadernos(pasta):
            lo, hi = cad['questoes']
            atual, dentro = None, False
            for pi in range(cad['paginas'][0] - 1, cad['paginas'][1]):
                for linha in d[pi].get_text().splitlines():
                    if linha.strip() == 'INGLÊS':
                        dentro = True
                    if cad.get('depois_de') and not dentro:
                        continue
                    if linha.strip() in UFPR_LINGUAS and linha.strip() != 'INGLÊS':
                        atual = None
                        if cad.get('depois_de'):
                            break
                    m = re.match(r'^\s*\*{0,2}(\d{2})\s*-', linha)
                    if m:
                        n = int(m.group(1))
                        atual = n if lo <= n <= hi else None
                    if atual is None:
                        continue
                    for mk in re.finditer(r'►\s*([A-E])\)', linha):
                        marcas.setdefault(atual, []).append(mk.group(1))
        for n, l in marcas.items():
            g[n] = l[0] if len(set(l)) == 1 else 'X'
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
        'ancora': r'^\*{0,2}(\d{2})\s*-', 'ancora_dx': 30, 'sequencial': False,  # "*15 -" = anulada no próprio caderno
        'secoes': UFPR_SECOES, 'corte': [r'^RESPOSTAS$'] + [rf'^{l}$' for l in UFPR_LINGUAS if l != 'INGLÊS'], 'suporte': [r'(?i)texto (a seguir )?(é|e) referente [àa]s quest', r'(?i)^as quest[õo]es \d+ (a|e) \d+'],
        'gabarito': gab, 'area': lambda n: 'Língua estrangeira' if n >= 83 else 'Conhecimentos gerais',
    }


PROVAS.update({f'ufpr-{a}': ufpr(a) for a in (2026, 2025, 2024)})


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


PROVAS.update({f'upe-ssa3-{a}': upe(a) for a in (2026, 2025, 2024)})


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

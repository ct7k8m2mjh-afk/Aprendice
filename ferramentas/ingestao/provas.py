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
    for m in re.finditer(rf'(?<![\d,.])(\d{{1,3}})\s+([{letras}]\b|ANULAD[AO]|Anulad[ao]|NULA|\*|X\b)', txt):
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


def enem_2020_2022(ano):
    """ENEM 2020–2022, aplicação regular (decisão do dono, 09/11/2026: só provas de 2020 em diante): caderno azul do
    1º dia (1: LC 1–45, língua 1–5 na opção inglês, CH 46–90) e do 2º dia (7: CN 91–135, MT 136–180).
    Mesma diagramação da 2023; o fio do cabeçalho e o do rodapé mudam de altura por ano."""
    cfg = enem(ano)
    # páginas com questão de largura total (enunciado ou gráfico atravessando a calha) misturadas a duas colunas
    cfg.update({'topo': {2020: 70, 2021: 70, 2022: 63}[ano], 'base': {2020: 36, 2021: 34, 2022: 40}[ano],
                'colunas': 'faixas', 'faixas_modo': 'largas', 'margem': 22, 'ancora_folga': 2.5, 'faixas_uma_auto': True})
    # 2020 e 2021: letras das alternativas em bolinhas desenhadas (a transcrição não separa as alternativas): só o print
    if ano == 2021:
        # camada de texto com fonte sem mapa de caracteres em boa parte do caderno ("•£Üèîé..."): só o print
        cfg['sem_transcricao'] = True
    return cfg


PROVAS.update({f'enem-{a}': enem_2020_2022(a) for a in (2020, 2021, 2022)})


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
        'suporte': [r'(?i)^textos? para as quest', r'(?i)responder [àa]s quest'],
        'gabarito': gab,
    })
    return cfg


PROVAS.update({f'fuvest-{a}': fuvest_v(a) for a in (2020, 2021, 2022, 2023, 2024)})
PROVAS['fuvest-2021']['larga'] = {26: 574}   # questão 90 ocupa as duas colunas no pé da página 26
PROVAS['fuvest-2021']['larga_topo'] = {13: 580}   # questão 42 (quadro e tabela) ocupa a largura toda no alto da página 13
PROVAS['fuvest-2021']['margem'] = 10   # números de linha dos textos (5, 10, 15) ficam na margem direita
PROVAS['fuvest-2021']['ancora_dx'] = 40   # com a margem menor, o número da questão fica mais longe da borda da coluna
# 2021: a camada de texto do caderno não tem mapa de caracteres (sai lixo): questões localizadas por OCR (o print é a página)
PROVAS['fuvest-2021']['cadernos'] = [{'arquivo': 'fase1-caderno', 'paginas': (2, 999), 'ocr_so_texto': True}]
PROVAS['fuvest-2021']['uma_coluna'] = (6,)   # questão 18 ocupa a página inteira
PROVAS['fuvest-2026'] = fuvest_v(2026, versao='V1')
PROVAS['fuvest-2026']['troca_texto'] = [('¬', ' ')]   # o PDF usa "¬" no lugar do espaço


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
        'suporte': [r'(?i)(responda|para) [àa]s quest[õo]es', r'(?i)^[àa]s quest[õo]es \d+ (a|e) \d+', r'(?i)^quest[õo]es \d+ (a|e) \d+\.?\s*$'],
        'gabarito': gab, 'area': lambda n: 'Conhecimentos gerais',
    }


PROVAS.update({f'uel-{a}': uel(a) for a in (2026, 2025, 2024)})
PROVAS.update({f'uel-{a}': uel(a) for a in (2023, 2020)})
PROVAS['uel-2025']['margem'] = 8   # "Leia o texto ... questões 2 e 3" sai à esquerda da coluna (x≈11): antes ia para o fim da questão anterior
PROVAS['uel-2020']['base'] = 38   # rodapé "8 / 27" um pouco mais alto que nas edições recentes
PROVAS['uel-2020']['divisa'] = 303.5   # texto da coluna esquerda vai até x≈295 e o da direita começa em x≈312
PROVAS['uel-2023']['divisa'] = 298.5   # esquerda até x≈291, direita a partir de x≈306
PROVAS['uel-2023']['larga_topo'] = {17: 448}   # imagens e texto das questões 35 a 37 ocupam a largura toda no alto da página 17


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
        'fim': [r'^Alternativa correta'], 'ignora_apos_fim': True,
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
        'secoes': UFPR_SECOES, 'corte': [r'^RESPOSTAS$', r'^COMPREENSÃO E PRODUÇÃO DE TEXTO$', r'^QUESTÃO DISCURSIVA$'] + [rf'^{l}$' for l in UFPR_LINGUAS if l != 'INGLÊS'], 'suporte': [r'(?i)texto (a seguir )?(é|e) referente [àa]s quest', r'(?i)^as quest[õo]es \d+ (a|e) \d+',
                    r'(?i)(é|e) referência para as? quest', r'(?i)\b(text|excerpt) refers? to quest',
                    r'(?i)\bis (a )?reference to quest'],   # "The following text is reference to questions 89 and 90" (2024 a 2026)
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
        # rodape_ultimo: número de fração no pé da página ("34/√34", Inverno 2025 q27) não é o número da página
        'colunas': lambda r: [(30, r.width - 25)], 'topo': 26, 'base': 20, 'rodape_num': True, 'rodape_ultimo': True,
        'ancora': r'^(\d{2})\)', 'ancora_dx': 30,
        # a prova comentada pinta a alternativa correta de vermelho: volta para a cor do texto no print
        'neutralizar_cores': (0xff0000, 0xee0000, 0xed0000),
        'secoes': ACAFE_SECOES, 'pular_secoes': ('Espanhol', 'Redação'),
        # separador da banca é uma linha só de traços; "____________ our brains." é lacuna do enunciado (Verão 2025 q18)
        'fim': [r'^Dados da quest', r'^_{10,}\s*$'], 'corte': [r'^FORMULÁRIO DE FÍSICA', r'^CONSTANTES FÍSICAS'],
        'suporte': [r'^Texto \d+\s*$', r'(?i)^(leia|observe) (o|a|os|as) (texto|imagem|tirinha|charge|gráfico)'], 'suporte_ate_proximo': True,
        'gabarito': gab, 'area': lambda n: 'Conhecimentos gerais',
    }


PROVAS.update({
    'acafe-2026-inverno': acafe(2026, 2), 'acafe-2026-verao': acafe(2026, 1),
    'acafe-2025-inverno': acafe(2025, 2), 'acafe-2025-verao': acafe(2025, 1), 'acafe-2024-inverno': acafe(2024, 2),
})



def acafe_antiga(ano, sem, arquivo='caderno', comentada=False):
    """Acafe Medicina, edições 2021–2024 (rodada 6): mesmo layout das recentes ("01)" em negrito, seções por matéria,
    A–D). Onde a Acafe publicou só a prova sem comentário, o print é a prova; o gabarito é sempre o oficial."""
    cfg = acafe(ano, sem)

    def gab(pasta):
        ocorr = {}
        for n, v in re.findall(r'(?<![\d,.])(\d{1,2})\s+([A-E]\b|\*|X\b|ANULADA|Anulada)', texto_pdf(pasta / 'gabarito-oficial.pdf')):
            ocorr.setdefault(int(n), []).append(v if len(v) == 1 and v in 'ABCDE' else 'X')
        return {n: (l[1] if len(l) > 1 and 15 <= n <= 21 else l[0]) for n, l in ocorr.items()}

    cfg['cadernos'] = [{'arquivo': arquivo}]
    cfg['gabarito'] = gab
    cfg['fim'] = cfg['fim'] + [r'^Informa[çc][õo]es da quest']
    cfg['corte'] = cfg['corte'] + [r'^TABELA PERI[ÓO]DICA', r'(?i)^F[óo]rm?ul[áa]rio de F[íi]sica']
    cfg['area_da_materia'] = True
    cfg['suporte'] = [r'(?i)^Texto \d+\s*:?\s*$'] + cfg['suporte'][1:]   # "TEXTO 1" em maiúsculas nas edições antigas
    if not comentada:
        # sem comentário da banca: a linha de traços separa questões E textos de apoio (não é fim de enunciado)
        cfg['fim'] = [r'^Informa[çc][õo]es da quest']
        cfg['nota'] = ('Vestibular de Medicina Acafe. Língua estrangeira: inglês. Print da prova oficial; gabarito oficial da Acafe '
                       '(anulada fica fora).')
    return cfg


PROVAS.update({
    'acafe-2024-verao': acafe_antiga(2024, 1, comentada=True), 'acafe-2023-inverno': acafe_antiga(2023, 2, 'caderno-comentado', True),
    'acafe-2023-verao': acafe_antiga(2023, 1), 'acafe-2022-inverno': acafe_antiga(2022, 2),
    'acafe-2021-inverno': acafe_antiga(2021, 2), 'acafe-2021-verao': acafe_antiga(2021, 1),
})

# ------------------------------------------------------------------------------------------ UPE (SSA3)
UPE_SECOES = {
    'LINGUAGENS E SUAS TECNOLOGIAS': 'Linguagens', 'CIÊNCIAS HUMANAS E SOCIAIS APLICADAS': 'Ciências Humanas',
    'MATEMÁTICA E SUAS TECNOLOGIAS': 'Matemática', 'CIÊNCIAS DA NATUREZA E SUAS TECNOLOGIAS': 'Ciências da Natureza',
    'MATEMÁTICA': 'Matemática', 'FÍSICA': 'Física', 'QUÍMICA': 'Química', 'BIOLOGIA': 'Biologia',
    'HISTÓRIA': 'História', 'GEOGRAFIA': 'Geografia', 'SOCIOLOGIA': 'Sociologia', 'FILOSOFIA': 'Filosofia',
    'LÍNGUA PORTUGUESA': 'Língua Portuguesa', 'LITERATURA': 'Literatura', 'INGLÊS': 'Inglês', 'LÍNGUA INGLESA': 'Inglês',
    'ESPANHOL': 'Espanhol', 'LÍNGUA ESPANHOLA': 'Espanhol', 'ARTES': 'Artes', 'EDUCAÇÃO FÍSICA': 'Educação Física',
    'LÌNGUA PORTUGUESA': 'Língua Portuguesa',   # grafia do caderno 2022
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
        'ancora': r'^(\d{1,2})\.(\s|$|(?=[A-ZÀ-Ú“"])|\.)', 'ancora_dx': 22, 'sequencial': True,
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
for _a in (2020, 2021, 2022, 2023):
    PROVAS[f'upe-ssa3-{_a}']['rodape_ultimo'] = True   # gráficos com números no pé da página
    PROVAS[f'upe-ssa3-{_a}']['topo'] = 37   # título de seção (ex.: FILOSOFIA) colado no cabeçalho
    PROVAS[f'upe-ssa3-{_a}']['pular_secoes'] = ('Espanhol',)   # 25–34 repetem na opção espanhol: vale a do inglês
    PROVAS[f'upe-ssa3-{_a}']['suporte'] = PROVAS[f'upe-ssa3-{_a}']['suporte'] + [r'(?i)servem? de base [àa]s? quest', r'(?i)^texts? \d+ \(quest',
        r'(?i)^texts? \d+ for quest', r'(?i)texto base para ser utilizado nas quest', r'(?i)^base [àa]s? quest', r'(?i)servem? de base [àa]s?\s*$']
PROVAS['upe-ssa3-2025']['suporte'] = PROVAS['upe-ssa3-2025']['suporte'] + [r'(?i)^utilize as informa[çc][õo]es a seguir para resolver as quest']
# 2026, 2º dia: textos de apoio que não usam a frase-padrão (antes as questões 2, 7 a 9, 15 e 16 saíam sem a figura/os dados)
PROVAS['upe-ssa3-2026']['suporte_forcado'] = {('d2-caderno', 2): [(319, 0, (2, 4))], ('d2-caderno', 5): [(56, 0, (7, 9))],
                                             ('d2-caderno', 9): [(43.5, 0, (15, 16))]}
PROVAS['upe-ssa3-2023']['ancora_dx_pag'] = {('d1-caderno', 14): 240, ('d2-caderno', 22): 30}   # 10 ao lado de imagem; "45.." recuado
PROVAS['upe-ssa3-2021']['ancora_dx_pag'] = {('d1-caderno', 24): 280}   # 34 (inglês) começa ao lado de uma imagem
# o caderno imprime "Texto para as questões 6 e 7" antes das questões 16 e 17 (Química, TNT): erro de digitação da banca
PROVAS['upe-ssa3-2023']['faixa_errata'] = {('d2-caderno', 11, (6, 7)): [16, 17]}
PROVAS['upe-ssa3-2022']['ancora_forcada'] = {('d1-caderno', 31): [(41, 54, 0)]}   # "41." desenhado sem camada de texto


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
        # inglês: "Read the text and answer the questions from 17 to 18" / "Read and analyze the infographic and answer the
        # question 23" abre o texto daquelas questões (antes o texto das 13 a 16 ia para todas as 13 a 24)
        'suporte': [r'(?i)para responder [àa]s? quest(ão|ao|ões|oes)', r'(?i)^[A-ZÁÉÍÓÚÂÊÔÃÕÇ ]+ ?[-–] ?QUEST[ÕO]ES DE \d+ A \d+',
                    r'(?i)^read\b.*\banswer the quest', r'(?i)^as quest(ões|oes) de \d+ a \d+ (são|referem|se referem)'],   # "As questões de 09 a 12 são sobre a obra..."
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
        for n, v in re.findall(r'(?<![\d,.])(\d{1,2})\s*[-–]\s*([A-E]\b|\*|X\b|N\b|ANULAD[AO])', texto_pdf(pasta / (gabarito + '.pdf'))):
            g.setdefault(int(n), v if len(v) == 1 and v in 'ABCDE' else 'X')
        return g

    return {
        'catalogo': pid_catalogo, 'escola': escola, 'ano': str(ano), 'fase': fase, 'titulo': titulo, 'banca': 'Vunesp',
        'duracao_horas': duracao, 'total': total, 'alternativas': alternativas, 'nota': nota,
        'cadernos': [{'arquivo': caderno, 'paginas': (2, 999)}],
        'colunas': lambda r: duas_colunas(r, 28), 'topo': 20, 'base': 32,
        'ancora': r'(?i)^quest[ãa]o\s+(\d{1,3})\b', 'ancora_dx': 34,
        'corte': [r'(?i)^CLASSIFICAÇÃO PERIÓDICA', r'(?i)^REDAÇÃO$', r'(?i)^Confidencial até'],
        # "para res-/ponder às questões de 15 a 20" (FMABC 2022/2023): instrução partida no meio da palavra
        'suporte': [r'(?i)para responder [àa]s? ques', r'(?i)para respond(er|-)?\s*$', r'(?i)^er [àa]s quest', r'(?i)^responder [àa]s? quest',
                    r'(?i)para\s+res\w*-\s*$'],
        'suporte_sobe': 2,
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
        'cadernos': [{'arquivo': 'livrete', 'paginas': (3, 16), 'questoes': (1, 50), 'rotulo': 'Prova Geral'},
                     {'arquivo': 'livrete', 'paginas': (22, 29), 'questoes': (51, 70), 'deslocamento': 50, 'rotulo': 'Prova Específica'}],
        # rodape_ultimo: o "68" de ⁶⁸Ga no pé da página (específica q8) não é o número da página
        'colunas': lambda r: [(14, r.width - 14)], 'topo': 26, 'base': 20, 'rodape_num': True, 'rodape_ultimo': True,
        'ancora': r'^(\d{1,2})\.$', 'ancora_dx': 30, 'sequencial': True,
        'corte': [r'^REDAÇÃO$', r'^PROVA (GERAL|ESPECÍFICA)$'], 'suporte': [r'(?i)(para|responder) [àa]s quest[õo]es'],
        'gabarito': gab, 'area': lambda n: 'Prova geral' if n <= 50 else 'Prova específica',
    }


PROVAS['puccampinas-2027'] = puccampinas(2027)


def _gab_str(s, inicio=1):
    """Gabarito oficial publicado só como imagem (tabela): transcrito à mão do PDF oficial, conferido na imagem ampliada."""
    s = s.replace(' ', '')
    return {i + inicio: (v if v in 'ABCDE' else 'X') for i, v in enumerate(s)}


# Gabaritos da PUC-Campinas publicados como imagem (rodada 6, 09/11/2026): Prova Geral e Prova Específica de Medicina
_PUCC_GAB = {
    2021: ('BECADBDEBC DDCAECDECA EDDBDECCCA ABCCDACEAD', None),
    2022: ('CEBDEBACCD AADDEBDAEC CDBCACDEEB CACABEBADE', None),
    2023: ('EDCBBADCBD ABEDBAECED ABBDCACABE EADCBEAEBB', None),
    2024: ('CDBAECBDCB ADADBECCBD DEABDAECDD BCBDCBEBAD', None),
    2026: ('CBDEACEABC ACBDBACDEB DEDBCADCEC BDACBEADDB EAADCCEBCA', 'ACDEAEDADB BCDBEEBDCA'),
}


_PUCC_SEC = [(r'^L[ÍI]NGUA PORTUGUESA', 'Língua Portuguesa'), (r'^LITERATURA BRASILEIRA\s*$', 'Literatura'),
             (r'^L[ÍI]NGUA INGLESA\s*$', 'Inglês'), (r'^BIOLOGIA\s*$', 'Biologia'), (r'^QU[ÍI]MICA\s*$', 'Química'),
             (r'^MATEM[ÁA]TICA( E RACIOC[ÍI]NIO L[ÓO]GICO)?\s*$', 'Matemática'), (r'^F[ÍI]SICA\s*$', 'Física'),
             (r'^HIST[ÓO]RIA\s*$', 'História'), (r'^GEOGRAFIA\s*$', 'Geografia'), (r'^CONHECIMENTOS GERAIS\s*$', 'Prova geral')]


def puccampinas_antiga(ano, ocr=False, duracao=5):
    """PUC-Campinas, Vestibular {ano} de Medicina: Prova Geral de 40 questões A–E (Língua Portuguesa, Literatura, inglês,
    matemática, ciências e humanas), "12." como âncora. A Prova Específica dessas edições é discursiva (fica fora).
    Gabarito oficial publicado como imagem (transcrito em _PUCC_GAB)."""
    cfg = puccampinas(ano, duracao)
    cfg.update({
        'total': 40,
        'nota': 'Vestibular de Medicina: Prova Geral (40 questões objetivas A–E). A Prova Específica desta edição é discursiva e '
                'fica fora; redação fora. Gabarito oficial da PUC-Campinas (publicado como imagem).'
                + (' Caderno sem camada de texto legível: questões localizadas por OCR (o print é a página original).' if ocr else ''),
        'cadernos': [{'arquivo': 'livrete', 'paginas': (2, 999), 'questoes': (1, 40), 'rotulo': 'Prova Geral', 'ocr': ocr}],
        'corte': [r'^REDAÇÃO\s*$', r'^PROVA ESPECÍFICA', r'(?i)^INSTRUÇÕES GERAIS', r'(?i)^CLASSIFICA[ÇC][ÃA]O PERI[ÓO]DICA',
                  r'^(Hist[óo]ria|Biologia|Matem[áa]tica e Racioc[íi]nio L[óo]gico|L[íi]ngua Portuguesa|L[íi]ngua Inglesa|Qu[íi]mica|F[íi]sica|Literatura Brasileira)\s*[–−—-]+\s*[A-ZÁÉÍÓÚ]\w+'],
        'secoes_rx': _PUCC_SEC,
        'gabarito': lambda pasta: _gab_str(_PUCC_GAB[ano][0]),
        'area': lambda n: 'Prova geral',
    })
    cfg['suporte'] = [r'(?i)^(aten[çc][ãa]o:\s*)?para responder [àa]s? quest\S+ (de )?n[úu]mero', r'(?i)^as quest[õo]es de n[úu]meros? \d+ a \d+ referem']
    cfg['corte'] = cfg['corte'] + [r'^Matem[áa]tica e Racioc[íi]nio L[óo]gico\s*$']
    if ocr:   # no OCR o número e a 1ª palavra do enunciado podem sair na mesma linha ("14. A palavra")
        cfg['ancora'] = r'^(\d{1,2})\.(\s|$)'
    return cfg


for _a in (2021, 2022):
    PROVAS[f'puccampinas-{_a}'] = puccampinas_antiga(_a)
for _a in (2023, 2024):
    PROVAS[f'puccampinas-{_a}'] = puccampinas_antiga(_a, ocr=True)
PROVAS['puccampinas-2025'] = puccampinas(2025)
PROVAS['puccampinas-2025']['cadernos'] = [{'arquivo': 'livrete', 'paginas': (3, 19), 'questoes': (1, 50), 'rotulo': 'Prova Geral'},
                                          {'arquivo': 'livrete', 'paginas': (24, 30), 'questoes': (51, 70), 'deslocamento': 50, 'rotulo': 'Prova Específica'}]
PROVAS['puccampinas-2026'] = puccampinas(2026)
PROVAS['puccampinas-2026']['cadernos'] = [{'arquivo': 'livrete', 'paginas': (3, 16), 'questoes': (1, 50), 'rotulo': 'Prova Geral'},
                                          {'arquivo': 'livrete', 'paginas': (22, 29), 'questoes': (51, 70), 'deslocamento': 50, 'rotulo': 'Prova Específica'}]
for _a in (2025, 2026):
    PROVAS[f'puccampinas-{_a}']['secoes_rx'] = _PUCC_SEC
    PROVAS[f'puccampinas-{_a}']['corte'] = (PROVAS['puccampinas-2021']['corte']
                                           + [r'^(F[íi]sica|Filosofia|Sociologia|Hist[óo]ria|Geografia|Biologia|Qu[íi]mica)\s*$'])
    PROVAS[f'puccampinas-{_a}']['suporte'] = PROVAS['puccampinas-2021']['suporte']
for _a in range(2021, 2027):
    PROVAS[f'puccampinas-{_a}']['area_da_materia'] = True   # rótulo de área do simulado pela matéria da questão
PROVAS['puccampinas-2026']['gabarito'] = lambda pasta: _gab_str(_PUCC_GAB[2026][0]) | _gab_str(_PUCC_GAB[2026][1], 51)
for _a in (2025, 2026):
    PROVAS[f'puccampinas-{_a}']['nota'] = ('Vestibular de Medicina: Prova Geral (1 a 50) e Prova Específica (numerada aqui 51 a 70), '
                                          'objetivas A–E. Redação fora. Gabarito oficial da PUC-Campinas.')


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
# 2024, página 3: a questão 03 ocupa a largura toda no alto; abaixo, as 04 e 05 em duas colunas (antes o print da 03 saía cortado à direita)
PROVAS['pucsp-2024']['larga_topo'] = {3: 355}
PROVAS['pucsp-2024']['sequencial'] = True   # página 15 tem um "Questão 26" fantasma na camada de texto (cortava o Texto II e as alternativas da 27)


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
        'suporte': [r'(?i)(para|responder) [àa]s quest[õo]es', r'(?i)^texto para as quest', r'(?i)texto abaixo refere-se [àa]s quest'],
        'gabarito': gab, 'area': lambda n: 'Conhecimentos gerais',
    }


for _a in range(2020, 2027):
    _c = ufu(_a)
    _c['total_de'] = (lambda c: (lambda pasta: max(c['gabarito'](pasta))))(_c)
    PROVAS[f'ufu-{_a}'] = _c


# ----------------------------------------------------------------------------------------------- UFAM
UFAM_SECOES = {
    'LÍNGUA PORTUGUESA': 'Língua Portuguesa', 'LITERATURA': 'Literatura', 'LÍNGUA ESTRANGEIRA – INGLÊS': 'Inglês',
    'LÍNGUA ESTRANGEIRA – ESPANHOL': 'Espanhol', 'LÍNGUA ESTRANGEIRA – FRANCÊS': 'Francês', 'HISTÓRIA': 'História',
    'GEOGRAFIA': 'Geografia', 'BIOLOGIA': 'Biologia', 'QUÍMICA': 'Química', 'FÍSICA': 'Física', 'MATEMÁTICA': 'Matemática',
    'REDAÇÃO': 'Redação', 'PROVA DE REDAÇÃO': 'Redação',
}


def ufam(ano, duracao=5):
    def gab(pasta):
        """Duas colunas de "NN. X"; nas questões de língua (13 a 18) a 1ª letra é a do inglês. ANULADA/NULA = fora."""
        g = {}
        for n, v in re.findall(r'(?<![\d,.])(\d{2})\.\s+([A-E]\b|ANULAD[AO]|ANULAR|NULA)', texto_pdf(pasta / 'gabarito-definitivo.pdf')):
            g.setdefault(int(n), v if len(v) == 1 else 'X')
        return g

    cfg = {
        'catalogo': 'ufam', 'escola': 'UFAM', 'ano': str(ano), 'fase': 'PSC 3ª etapa', 'titulo': f'UFAM PSC {ano} – 3ª etapa',
        'banca': 'Compec-UFAM', 'duracao_horas': duracao,
        'nota': f'Processo Seletivo Contínuo (PSC {ano}), 3ª etapa, Prova de Conhecimentos Gerais. Língua estrangeira: inglês. '
                'Gabarito definitivo da Compec, publicado no repositório institucional da UFAM (Edoc).',
        'cadernos': [{'arquivo': 'caderno', 'paginas': (3, 999)}],
        'colunas': lambda r: duas_colunas(r, 20), 'topo': 34, 'cabecalho': r'^PROCESSO SELETIVO CONT', 'base': 30, 'rodape_num': True, 'rodape_centro': True, 'rodape_folga': 0.5,
        'ancora': r'^(\d{2})\.(\s|“|"|$)', 'ancora_dx': 20, 'sequencial': True,
        'secoes': UFAM_SECOES, 'pular_secoes': ('Espanhol', 'Francês', 'Redação'),
        'corte': [r'^RASCUNHO$', r'(?i)^PROPOSTAS? DE REDA'],
        'suporte': [r'(?i)(responder|para|responda) [àa]s? quest', r'(?i)^texto para as quest', r'(?i)^as quest[õo]es \d+ (a|e) \d+ se refere',
                    r'(?i)^responda [àa] quest', r'(?i)^(leia|considere) .*(texto|poema|excerto|tirinha).*(responder|responda)',
                    r'(?i)responder [àa]s$'],
        'gabarito': gab, 'area': lambda n: 'Conhecimentos gerais',
    }
    cfg['total_de'] = lambda pasta: max(gab(pasta))
    return cfg


PROVAS.update({f'ufam-psc3-{a}': ufam(a) for a in range(2020, 2027)})


# ------------------------------------------------------------------------------------------------ ITA
ITA_MATERIAS = ['Matemática', 'Física', 'Química', 'Português', 'Inglês']


def ita(ano, ocr=False, duracao=5):
    areas = {}

    def gab(pasta):
        """Gabarito em colunas, uma por matéria: a matéria de cada questão é a do cabeçalho da sua coluna.
        (*) e (**) = anulada (nota de rodapé do próprio gabarito)."""
        linhas = texto_pdf(pasta / 'fase1-gabarito.pdf').splitlines()
        cab = next(l for l in linhas if sum(m in l for m in ITA_MATERIAS) >= 4)
        pos = sorted((cab.find(m) + len(m) / 2, m) for m in ITA_MATERIAS if m in cab)
        g = {}
        for l in linhas:
            if l is cab:
                continue
            for mm in re.finditer(r'(?<![\d,.(])(\d{1,2})\s+([A-E]\b|\(\*+\))', l):
                n, v = int(mm.group(1)), mm.group(2)
                g.setdefault(n, v if len(v) == 1 else 'X')
                centro = (mm.start() + mm.end()) / 2
                areas[n] = min(pos, key=lambda p: abs(p[0] - centro))[1]
        return g

    cfg = {
        'catalogo': 'ita', 'escola': 'ITA', 'ano': str(ano), 'fase': '1ª fase', 'titulo': f'ITA {ano}', 'banca': 'ITA',
        'duracao_horas': duracao,
        'nota': 'Instituto Tecnológico de Aeronáutica, 1ª fase (questões objetivas). Gabarito oficial do ITA; anuladas ficam fora.'
                + (' Caderno publicado como imagem: questões localizadas por OCR (o print é a página original).' if ocr else ''),
        'cadernos': [{'arquivo': 'fase1-caderno', 'paginas': (2, 999), 'ocr': ocr}],
        'colunas': lambda r: [(20, r.width - 20)], 'topo': 24, 'base': 30, 'rodape_num': True, 'rodape_ultimo': True,
        'ancora': r'^Quest\S{1,3}o\s*(\d{1,2})\s*[.,:]', 'ancora_dx': 45, 'sequencial': True,
        'corte': [r'(?i)^RASCUNHO', r'(?i)^(F.{0,3}SICA|MATEM.{1,4}TICA|QU.{1,4}MICA|PORTUGU.{1,4}S|INGL.{1,4}S)$'],
        'suporte': [r'(?i)(texto|textos|trecho) (a seguir |abaixo )?para (as|responder [àa]s) quest', r'(?i)para responder [àa]s quest',
                    r'(?i)^as quest[õo]es \d+ (a|e) \d+', r'(?i)^as quest[õo]es de \d+ a \d+ referem-se',
                    r'(?i)leia o texto a seguir para responder'],
        'gabarito': gab, 'area': lambda n: areas.get(n, 'Conhecimentos gerais'),
    }
    cfg['total_de'] = lambda pasta: max(gab(pasta))
    return cfg


PROVAS.update({f'ita-{a}': ita(a, ocr=a in (2020, 2026)) for a in range(2020, 2027)})
for _a in (2020, 2026):   # cadernos só em imagem: OCR às vezes perde o número ao lado de "Questão"; página começa no alto
    PROVAS[f'ita-{_a}'].update({'ancora_sem_numero': r'^Quest\S{1,3}o\s*$', 'topo': 2, 'ancora_dx': 60})


# ---------------------------------------------------------------------------------------------- UDESC
UDESC_NOMES = [('MATEM', 'Matemática'), ('BIOLOG', 'Biologia'), ('INGL', 'Inglês'), ('ESPAN', 'Espanhol'),
               ('LÍNGUA', 'Língua Portuguesa e Literatura'), ('FÍSICA', 'Física'), ('QUÍMICA', 'Química'),
               ('HISTÓRIA', 'História'), ('GEOGRAFIA', 'Geografia'), ('FILOSOFIA', 'Filosofia'), ('SOCIOLOGIA', 'Sociologia')]


def udesc(ano, sem, duracao=4):
    areas = {}

    def gab(pasta):
        """Gabarito oficial em colunas por matéria (matutino 1–50, vespertino 1–50, aqui 51–100). Cada resposta
        vai para o cabeçalho de coluna mais próximo; a coluna Espanhol é descartada (vale a do inglês)."""
        txt = texto_pdf(pasta / 'gabarito-oficial.pdf')
        i = txt.find('Vespertino')
        g = {}
        for parte, desl in ((txt[:i], 0), (txt[i:], 50)):
            cabs = []
            for l in parte.splitlines():
                novos = []
                for chave, nome in UDESC_NOMES:
                    k = l.upper().find(chave)
                    if k >= 0 and not re.search(r'\d', l[max(0, k - 3):k + 12]):
                        novos.append((k + len(chave) / 2 + 3, nome))
                for m in re.finditer(r'(?<![\d(])(\d{1,2})(?:\.|ª Questão)?\s+\(?([A-E]|Anulad[ao]|ANULAD[AO])\)?(?!\w)', l):
                    if not cabs:   # respostas na mesma linha de um cabeçalho novo seguem as colunas de cima
                        continue
                    centro = (m.start() + m.end()) / 2
                    nome = min(cabs, key=lambda c: abs(c[0] - centro))[1]
                    if nome == 'Espanhol':
                        continue
                    n = int(m.group(1)) + desl
                    g[n] = m.group(2) if len(m.group(2)) == 1 else 'X'
                    areas[n] = nome
                if novos:
                    cabs = [c for c in cabs if all(abs(c[0] - nv[0]) > 12 for nv in novos)] + novos
        return g

    nome = 'Verão' if sem == 1 else 'Inverno'
    cfg = {
        'catalogo': 'udesc', 'escola': 'UDESC', 'ano': str(ano), 'fase': f'{nome} {ano}.{sem}', 'titulo': f'UDESC {ano}.{sem}',
        'banca': 'Covest-UDESC', 'duracao_horas': duracao,
        'nota': f'Vestibular de {nome} {ano}.{sem}: prova do período matutino (questões 1 a 50) e do vespertino (aqui 51 a 100). '
                'Língua estrangeira: inglês. Gabarito oficial publicado na página de provas anteriores (pós-recursos). '
                'Cadernos publicados só como imagem têm as questões localizadas por OCR (o print é a página original).',
        'cadernos': [{'arquivo': 'caderno-matutino', 'paginas': (2, 999), 'questoes': (1, 50), 'ocr_se_vazio': True},
                     {'arquivo': 'caderno-vespertino', 'paginas': (2, 999), 'questoes': (51, 100), 'deslocamento': 50, 'ocr_se_vazio': True}],
        'colunas': lambda r: [(25, r.width - 25)], 'topo': 30, 'base': 30, 'rodape_num': True, 'rodape_ultimo': True,
        'ancora': r'(?i)^(?:quest\S{1,3}o|question)\s+(\d{1,2})\b', 'ancora_dx': 75, 'sequencial': True,
        'secoes': {'Inglês': 'Inglês', 'Espanhol': 'Espanhol', 'INGLÊS': 'Inglês', 'ESPANHOL': 'Espanhol'},
        'pular_secoes': ('Espanhol',), 'area_do_gabarito': True,
        # título de seção com o nº de questões ao lado ("Inglês (08 questões)") ou lido por OCR
        'secoes_rx': [(r'(?i)^ingl[êe]s(\s*\(\d+ quest\S*\))?\s*$', 'Inglês'), (r'(?i)^espanhol(\s*\(\d+ quest\S*\))?\s*$', 'Espanhol'),
                      (r'^L[ÍI]NGUA PORTUGUESA', 'Língua Portuguesa e Literatura'), (r'^(F[ÍI]SICA|MATEM[ÁA]TICA)\b', 'Ciências')],
        'corte': [r'(?i)^FOLHA DE RASCUNHO', r'^LÍNGUA ESTRANGEIRA', r'^LÍNGUA PORTUGUESA E LITERATURA', r'^(MATEMÁTICA|BIOLOGIA|FÍSICA|QUÍMICA|HISTÓRIA|GEOGRAFIA|FILOSOFIA|SOCIOLOGIA)\b',
                  r'(?i)^FORMUL[ÁA]RIO', r'(?i)^Tabela peri',
                  r'(?i)^PROPOSTA DE REDA', r'(?i)^REDAÇÃO$'],
        'suporte': [r'(?i)(responder|para) [àa]s quest', r'(?i)^texto? \d+\s*$'], 'suporte_ate_proximo': True, 'suporte_primeira': True,
        'cabecalho_imagem': r'(?i)^(UDESC|Vestibular 20\d\d)', 'texto_ingles': True,
        'gabarito': gab, 'area': lambda n: areas.get(n, 'Conhecimentos gerais'), 'total': 100,
    }
    return cfg


for _a, _s in ((2020, 1), (2023, 2), (2024, 1), (2024, 2), (2025, 1), (2025, 2), (2026, 1), (2026, 2)):
    PROVAS[f'udesc-{_a}-{_s}'] = udesc(_a, _s)
PROVAS['udesc-2026-1']['cadernos'][1]['sem_suporte'] = True   # vespertino 2026/1: "Questão N" vem antes dos textos
for _k in ('udesc-2026-1', 'udesc-2026-2'):
    PROVAS[_k]['suporte_interno'] = 90   # 2026: em parte das questões o "TEXTO N" vem logo depois do número


# ---------------------------------------------------------------------------------------------- FMABC
# Caderno e gabarito oficiais da Vunesp publicados pela própria FMABC ("Provas anos anteriores"). "N" no gabarito = anulada.
for _a in range(2020, 2026):
    PROVAS[f'fmabc-{_a}'] = vunesp(
        'fmabc', 'FMABC', _a, '', f'FMABC {_a}', 80, caderno='caderno', gabarito='gabarito', duracao=5,
        nota=f'Centro Universitário FMABC, Vestibular de Medicina {_a}: Prova de Conhecimentos Gerais (80 objetivas), versão 1. '
             'Caderno e gabarito oficiais da Vunesp, publicados pela FMABC; anulada fica fora.')


# ---------------------------------------------------------------------------------------------- Fatec
FATEC_DISC = {'RACIOCÍNIO LÓGICO': 'Raciocínio Lógico', 'RAC. LÓGICO': 'Raciocínio Lógico', 'MULTIDISCIPLINAR': 'Multidisciplinar', 'HISTÓRIA': 'História',
              'GEOGRAFIA': 'Geografia', 'BIOLOGIA': 'Biologia', 'QUÍMICA': 'Química', 'FÍSICA': 'Física', 'MATEMÁTICA': 'Matemática',
              'INGLÊS': 'Inglês', 'PORTUGUÊS': 'Língua Portuguesa', 'LÍNGUA PORTUGUESA': 'Língua Portuguesa', 'ANULADA': 'ANULADA'}


def fatec(ano, sem, duracao=5, gab_arq='gabarito'):
    areas = {}

    def gab(pasta):
        """Gabarito oficial em duas colunas: "001  D  História"; "ANULADA" no lugar da letra ou da disciplina = anulada.
        2025/1: grade "01: C" por tipo de prova (vale a Prova Tipo A, a do caderno publicado)."""
        txt = texto_pdf(pasta / (gab_arq + '.pdf')).replace('ﬁ', 'fi')
        g = {}
        if 'PROVA TIPO A' in txt:
            txt = txt.split('PROVA TIPO A', 1)[1].split('PROVA TIPO B', 1)[0]
            for n, v in re.findall(r'(?<![\d,.])(\d{1,2}):\s*([A-E]|\*|X|ANULAD[AO])\b', txt):
                g[int(n)] = v if v in 'ABCDE' and len(v) == 1 else 'X'
            return g
        for linha in txt.splitlines():
            for m in re.finditer(r'(?<![\d,.])(\d{1,3})\s+([A-E]|ANULAD[AO])(?:\s*-\s*Retificad[ao])?\s+([A-Za-zÀ-ú][A-Za-zÀ-ú. ]*?)(?=\s{2,}\d|\s*$)', linha):
                n, v, disc = int(m.group(1)), m.group(2), m.group(3).strip().upper()
                g[n] = 'X' if (len(v) > 1 or disc.startswith('ANULAD')) else v
                areas[n] = FATEC_DISC.get(disc, disc.title())
        return g

    cfg = {
        'catalogo': 'fatec', 'escola': 'Fatec', 'ano': str(ano), 'fase': f'{sem}º semestre', 'titulo': f'Fatec {ano}/{sem}',
        'banca': 'Centro Paula Souza', 'duracao_horas': duracao,
        'nota': f'Vestibular Fatec {sem}º semestre de {ano}: prova objetiva (múltipla escolha A–E). Gabarito oficial '
                '(retificado, quando houve), com a disciplina de cada questão; anulada fica fora. Caderno e gabarito '
                'publicados pelo Centro Paula Souza.',
        'cadernos': [{'arquivo': 'caderno', 'paginas': (2, 999)}],
        'colunas': 'faixas', 'margem': 22, 'topo': 18, 'base': 14, 'rodape_rx': r'^(\d{1,2}\s+)?VESTIBULAR\b', 'rodape_num': False, 'suporte_caixa': True,
        'apagar': [r'^(\d{1,2}\s+)?VESTIBULAR\b', r'^\d{1,2}$'],
        'ancora': r'(?i)^quest[ãa]o\s+(\d{1,3})\b', 'ancora_dx': 75, 'sequencial': True,
        'corte': [r'(?i)^REDAÇÃO$', r'(?i)^PROPOSTA DE REDA', r'(?i)^RASCUNHO', r'(?i)^FOLHA DE',
                  r'^(MATEMÁTICA|FÍSICA|QUÍMICA|BIOLOGIA|HISTÓRIA|GEOGRAFIA|INGLÊS|PORTUGUÊS|LÍNGUA PORTUGUESA|RACIOCÍNIO LÓGICO|MULTIDISCIPLINAR)$'],
        'suporte': [r'(?i)(para|responder) [àa]s quest[õo]es', r'(?i)^texto para as quest', r'(?i)^[àa]s quest[õo]es (de )?\d+ (e|a) \d+\.?$'],
        'gabarito': gab, 'area': lambda n: areas.get(n, 'Conhecimentos gerais'), 'area_do_gabarito': True,
    }
    cfg['total_de'] = lambda pasta: max(gab(pasta))
    return cfg


for _a, _s in ((2020, 1), (2022, 2), (2023, 1), (2023, 2), (2024, 1), (2024, 2), (2025, 2), (2026, 1), (2026, 2)):
    PROVAS[f'fatec-{_a}-{_s}'] = fatec(_a, _s)
# 2023/1: o link "Fatec_Gabarito_2023_retificado.pdf" da página oficial traz o gabarito do 2º sem/2013 (não confere com o
# caderno: ex. questão 21, SO3 trigonal plana = A, lá "D"). Vale o gabarito oficial publicado no dia (Gabarito-Vestibular-1sem-2023).
PROVAS['fatec-2023-1'] = fatec(2023, 1, gab_arq='gabarito-original')
PROVAS['fatec-2023-1']['nota'] += (' Gabarito: o oficial publicado em 08/01/2023; o arquivo "retificado" da página oficial é de outra '
                                   'edição (2º sem/2013) e não foi usado.')
# 2025/1: caderno em duas colunas, numeração "6." e títulos de disciplina; gabarito por tipo (sem disciplina)
PROVAS['fatec-2025-1'] = fatec(2025, 1)
PROVAS['fatec-2025-1'].update({
    'colunas': 'faixas', 'margem': 30, 'topo': 64, 'base': 36, 'apagar': [r'^VESTIBULAR \d', r'^FATEC –', r'^TIPO A$'],
    'ancora': r'^(\d{1,2})\.(\s|$)', 'ancora_dx': 12, 'area_do_gabarito': False,
    'suporte_titulo': 15,   # questões multidisciplinares (46 a 54): o texto de cada uma vem antes dela, com título centralizado
    'secoes': {'MATEMÁTICA': 'Matemática', 'FÍSICA': 'Física', 'QUÍMICA': 'Química', 'BIOLOGIA': 'Biologia', 'HISTÓRIA': 'História',
               'GEOGRAFIA': 'Geografia', 'INGLÊS': 'Inglês', 'LÍNGUA PORTUGUESA': 'Língua Portuguesa', 'PORTUGUÊS': 'Língua Portuguesa',
               'RACIOCÍNIO LÓGICO': 'Raciocínio Lógico', 'MULTIDISCIPLINAR': 'Multidisciplinar', 'LÍNGUA INGLESA': 'Inglês'},
    'nota': 'Vestibular Fatec 1º semestre de 2025: prova objetiva (múltipla escolha A–E), Prova Tipo A. Gabarito oficial '
            'definitivo (Tipo A); anulada fica fora. Caderno e gabarito publicados pelo Centro Paula Souza.',
})


# --------------------------------------------------------------------------------------------- Cederj
CEDERJ_SECOES = {
    'LÍNGUA PORTUGUESA E LITERATURA BRASILEIRA': 'Língua Portuguesa e Literatura', 'Língua Portuguesa e Literatura': 'Língua Portuguesa e Literatura',
    'BIOLOGIA': 'Biologia', 'FÍSICA': 'Física', 'GEOGRAFIA': 'Geografia', 'HISTÓRIA': 'História', 'MATEMÁTICA': 'Matemática',
    'QUÍMICA': 'Química', 'LÍNGUA ESPANHOLA': 'Espanhol', 'LÍNGUA INGLESA': 'Inglês', 'ESPANHOL': 'Espanhol', 'INGLÊS': 'Inglês',
    'Biologia': 'Biologia', 'Física': 'Física', 'Geografia': 'Geografia', 'História': 'História', 'Matemática': 'Matemática',
    'Química': 'Química', 'Língua Espanhola': 'Espanhol', 'Língua Inglesa': 'Inglês', 'A FÍSICA': 'Física',
}


def cederj(ano, sem, duracao=4, ocr=False):
    def gab(pasta):
        """Gabarito oficial em blocos por disciplina ("01 – C" ou "1  C"). As questões de língua estrangeira repetem a
        numeração (espanhol, depois inglês): vale a última ocorrência, a do inglês."""
        txt = texto_pdf(pasta / 'gabarito.pdf')
        g = {}
        for n, v in re.findall(r'(?<![\d,.])(\d{1,2})\s*(?:[–-]\s*|\s{2,})([A-D]\b|ANULAD[AO])', txt):
            g[int(n)] = v if len(v) == 1 else 'X'
        return g

    cfg = {
        'catalogo': 'cederj', 'escola': 'Cederj', 'ano': str(ano), 'fase': f'{ano}.{sem}', 'titulo': f'Cederj {ano}.{sem}',
        'banca': 'Fundação Cecierj', 'duracao_horas': duracao, 'alternativas': 4,
        'nota': f'Vestibular Cederj {ano}.{sem} (consórcio de universidades públicas a distância do Rio de Janeiro): prova de '
                'múltipla escolha A–D. Língua estrangeira: inglês. Gabarito oficial publicado pela Fundação Cecierj; anulada fica fora.'
                + (' Caderno com camada de texto ilegível ou só imagem: questões localizadas por OCR (o print é a página original).' if ocr else ''),
        'cadernos': [{'arquivo': 'caderno', 'paginas': (2, 999), 'ocr': ocr, 'questoes': (1, 99)}],
        'colunas': lambda r: duas_colunas(r, 25), 'topo': 40, 'cabecalho': r'^VESTIBULAR 20\d\d', 'base': 30, 'rodape_num': True, 'rodape_centro': True,
        'ancora': r'^(\d{2})(?:\.\s*|\s+|$)(?!\d)', 'ancora_dx': 40, 'sequencial': True, 'ancora_negrito': not ocr,
        'secoes': CEDERJ_SECOES, 'pular_secoes': ('Espanhol',), 'pular_antes_sequencia': True, 'secao_sem_marcador': True,
        'corte': [r'^QUESTÕES DE MÚLTIPLA ESCOLHA', r'(?i)^PROPOSTA DE REDA', r'^[\W_]*REDA[ÇC][ÃA]O', r'(?i)^PROVA DE REDA', r'(?i)^RASCUNHO', r'(?i)^TABELA PERI', r'(?i)espa[çc]o reservado para rascunho',
                  r'^LÍNGUA ESTRANGEIRA'],
        'suporte': [r'(?i)^texto? [1-9IVX]+\s*$', r'(?i)(responda|responder|para) [àa]s? quest', r'(?i)^(re)?leia .*para responder'],
        'suporte_secao': True, 'texto_n_sem_faixa': True, 'margem': 25,
        # o título "Língua Portuguesa e Literatura" fica antes do quadro de questões (não é lido como seção): 1 a 6 são dela
        'gabarito': gab, 'area': lambda n: 'Língua Portuguesa e Literatura' if n <= 6 else 'Conhecimentos gerais',
    }
    cfg['total_de'] = lambda pasta: max(gab(pasta))
    return cfg


for _a, _s in ((2020, 1), (2021, 2), (2022, 1), (2022, 2), (2023, 1), (2023, 2), (2024, 1), (2024, 2), (2025, 1), (2025, 2), (2026, 1), (2026, 2)):
    PROVAS[f'cederj-{_a}-{_s}'] = cederj(_a, _s)
# 2020.2 (só imagem) e 2021.1 (camada de texto corrompida): configuradas com OCR, mas FORA do site por enquanto —
# o OCR acha os números, porém o layout (questões de largura total no meio de páginas de duas colunas) não foi conferido.
for _a, _s in ((2020, 2), (2021, 1)):
    PROVAS[f'cederj-{_a}-{_s}'] = cederj(_a, _s, ocr=True)
PROVAS['cederj-2022-1']['uma_coluna'] = (14, 15)   # textos de inglês em largura total
PROVAS['cederj-2021-2']['rodape_centro'] = False    # número de página no canto direito
# 2021.2, questão 39: o caderno usa "►" como marcador do quadro de dados (não é marca de resposta); fica fora do texto
PROVAS['cederj-2021-2']['troca_texto'] = [('►', '')]


# ---------------------------------------------------------------------------------------------- UTFPR
UTFPR_SECOES = {
    'Literatura': 'Literatura', 'Língua Portuguesa': 'Língua Portuguesa', 'Inglês': 'Inglês', 'Espanhol': 'Espanhol',
    'HISTÓRIA': 'História', 'História': 'História', 'Geografia': 'Geografia', 'GEOGRAFIA': 'Geografia',
    'Sociologia e Filosofia': 'Filosofia e Sociologia', 'Filosofia e Sociologia': 'Filosofia e Sociologia',
    'FILOSOFIA E SOCIOLOGIA': 'Filosofia e Sociologia', 'Biologia': 'Biologia', 'BIOLOGIA': 'Biologia', 'Química': 'Química',
    'QUÍMICA': 'Química', 'QUIMICA': 'Química', 'Matemática': 'Matemática', 'MATEMÁTICA': 'Matemática', 'Física': 'Física', 'FÍSICA': 'Física',
    'INGLÊS': 'Inglês', 'ESPANHOL': 'Espanhol', 'LITERATURA': 'Literatura', 'LÍNGUA PORTUGUESA': 'Língua Portuguesa',
}


def utfpr(ano, duracao=5):
    def gab(pasta):
        """Gabarito definitivo em tabela; nas questões de língua estrangeira há duas letras (Inglês, Espanhol): vale a 1ª.
        Às vezes o número fica numa linha e as duas letras na de baixo."""
        linhas = texto_pdf(pasta / 'gabarito.pdf').splitlines()
        g = {}
        for k, l in enumerate(linhas):
            prox = linhas[k + 1] if k + 1 < len(linhas) else ''
            ml = re.match(r'^\s*([A-E])\s+([A-E])\s*$', prox)
            m0 = re.match(r'^\s*(\d{1,2})(?=\s{8,}\d|\s*$)', l)
            if ml and m0:
                g[int(m0.group(1))] = ml.group(1)
            for m in re.finditer(r'(?<![\d,.])(\d{1,2})\s+([A-E]\b|ANULAD[AO])(?:\s+([A-E])\b)?', l):
                g.setdefault(int(m.group(1)), m.group(2) if len(m.group(2)) == 1 else 'X')
        return g

    novo = ano >= 2026
    cfg = {
        'catalogo': 'utfpr', 'escola': 'UTFPR', 'ano': str(ano), 'fase': 'Verão', 'titulo': f'UTFPR {ano}', 'banca': 'UTFPR',
        'duracao_horas': duracao,
        'nota': f'Universidade Tecnológica Federal do Paraná, Vestibular de Verão {ano}: prova objetiva (A–E). Língua '
                'estrangeira: inglês. Gabarito definitivo publicado pela UTFPR; anulada fica fora.',
        'cadernos': [{'arquivo': 'caderno', 'paginas': (2, 999)}],
        'colunas': lambda r: duas_colunas(r, 18), 'topo': 44, 'base': 10,
        'ancora': r'^(\d{2})(\s|$)' if novo else r'^(\d{2})\.(\s|$)', 'ancora_dx': 25, 'sequencial': True, 'ancora_negrito': novo,
        'secoes': UTFPR_SECOES, 'pular_secoes': ('Espanhol',), 'pular_antes_sequencia': True,
        'corte': [r'^(Redação|REDAÇÃO)$', r'^Rascunho$', r'^LÍNGUA ESTRANGEIRA$'],
        'suporte': [], 'suporte_apos_secao': True, 'suporte_cita_max': 2500,
        'suporte_nao_colado': 8, 'suporte_apos_alt': r'^e\)' if novo else r'^\(E\)', 'suporte_ate_proximo': True, 'suporte_primeira': True,
        'suporte_palavras': '|versos?|newsletter|passage|tira|quadrinhos?',
        'gabarito': gab, 'area': lambda n: 'Conhecimentos gerais',
    }
    cfg['total_de'] = lambda pasta: max(gab(pasta))
    return cfg


for _a in (2024, 2025, 2026):
    PROVAS[f'utfpr-{_a}'] = utfpr(_a)
# "Ainda baseado no texto da questão anterior" / "According to the poem" (poema dentro da questão anterior)
PROVAS['utfpr-2024']['anexa'] = {12: 11}
PROVAS['utfpr-2025']['anexa'] = {18: 17}


# ----------------------------------------------------------------------------------------------- UERR
def cebraspe_grade(txt):
    """Gabarito Cebraspe em grade: linha "Questão  1 2 3 ..." e logo abaixo "Gabarito  C X C ..." (X = anulada).
    Número repetido (opção de língua estrangeira): vale a 1ª ocorrência — conferir no caderno qual língua vem antes."""
    g = {}
    linhas = txt.splitlines()
    for k, l in enumerate(linhas):
        if not l.strip().startswith('Questão'):
            continue
        ns = l.split()[1:]
        prox = next((x for x in linhas[k + 1:k + 3] if x.strip().startswith('Gabarito')), '')
        vs = prox.split()[1:]
        for n, v in zip(ns, vs):
            if n.isdigit() and int(n) > 0 and v != '0':
                g.setdefault(int(n), v if v in 'ABCDE' and len(v) == 1 else 'X')
    return g


UERR_SECOES = [(r'^-*\s*LÍNGUA PORTUGUESA\s*-*$', 'Língua Portuguesa'), (r'^-*\s*LÍNGUA INGLESA\s*-*$', 'Inglês'),
               (r'^-*\s*LÍNGUA ESPANHOLA\s*-*$', 'Espanhol'), (r'^-*\s*HISTÓRIA\s*-*$', 'História'),
               (r'^-*\s*GEOGRAFIA\s*-*$', 'Geografia'), (r'^-*\s*BIOLOGIA\s*-*$', 'Biologia'), (r'^-*\s*QUÍMICA\s*-*$', 'Química'),
               (r'^-*\s*FÍSICA\s*-*$', 'Física'), (r'^-*\s*MATEMÁTICA\s*-*$', 'Matemática')]


def uerr(ano, duracao=5):
    def gab(pasta):
        return cebraspe_grade(texto_pdf(pasta / 'gabarito.pdf'))

    cfg = {
        'catalogo': 'uerr', 'escola': 'UERR', 'ano': str(ano), 'fase': '', 'titulo': f'UERR {ano}', 'banca': 'Cebraspe',
        'duracao_horas': duracao,
        'nota': f'Universidade Estadual de Roraima, Processo Seletivo Vestibular {ano} (Cebraspe): prova objetiva A–E. Língua '
                'estrangeira: inglês (no gabarito oficial, as questões 10 a 18 aparecem duas vezes; a primeira é a do inglês, '
                'que vem antes do espanhol no caderno). Gabarito oficial definitivo; anulada fica fora.',
        'cadernos': [{'arquivo': 'caderno', 'paginas': (1, 999)}],
        'colunas': lambda r: duas_colunas(r, 22), 'topo': 44, 'base': 30,
        'ancora': r'(?i)^quest[ãa]o\s+(\d{1,2})\b', 'ancora_dx': 55, 'sequencial': True,
        'secoes_rx': UERR_SECOES, 'pular_secoes': ('Espanhol',), 'pular_antes_sequencia': True,
        'corte': [r'(?i)^PROPOSTA DE REDA', r'(?i)^RASCUNHO', r'^Espaço livre$'],
        # texto de apoio: título "Texto 1A4-II" (2025) ou "Texto II" (2026), o texto logo depois do título da matéria ou
        # depois da última alternativa de uma questão; vale para a 1ª questão seguinte e para as que citam ou mencionam o texto
        'suporte': [r'(?i)^texts?o?\s+(\d+[A-Z]\d+-)?[IVX]+\s*$'],
        'texto_id': r'(?i)\btexts?o?\s+(\d+[A-Z]\d+-[IVX]+)' if ano == 2025 else r'\b[Tt]exts?o?\s+([IVX]+)\b',
        'suporte_ate_proximo': True, 'suporte_primeira': True, 'suporte_apos_secao': True, 'suporte_apos_alt': r'^E$', 'alt_span_isolada': True,
        'alternativa_rx': r'^[A-E]$', 'suporte_cita_max': 2600, 'suporte_cadeia': True, 'suporte_palavras': '|text|texto',
        'gabarito': gab, 'area': lambda n: 'Conhecimentos gerais',
    }
    cfg['total_de'] = lambda pasta: max(gab(pasta))
    return cfg


for _a in (2025, 2026):
    PROVAS[f'uerr-{_a}'] = uerr(_a)
PROVAS['uerr-2025']['sem_apoio'] = (7,)   # texto próprio (Antonio Candido), não o 1A1


# ---------------------------------------------------------------------------------------------- PUCRS
PUCRS_SECOES = {'LÍNGUA ESPANHOLA': 'Espanhol', 'LÍNGUA INGLESA': 'Inglês', 'LÍNGUA PORTUGUESA': 'Língua Portuguesa',
                'MATEMÁTICA': 'Matemática', 'FÍSICA': 'Física', 'QUÍMICA': 'Química', 'BIOLOGIA': 'Biologia',
                'LITERATURA': 'Literatura', 'HISTÓRIA': 'História', 'GEOGRAFIA': 'Geografia',
                'LITERATURA BRASILEIRA': 'Literatura'}


def pucrs(ano, duracao=4):
    def gab(pasta):
        """Gabarito em colunas: Língua Espanhola (1–10), Língua Inglesa (1–10), depois 11–70. A questão de 1 a 10
        aparece duas vezes por linha: vale a 2ª, a do inglês."""
        g = {}
        for linha in texto_pdf(pasta / 'gabarito.pdf').splitlines():
            for m in re.finditer(r'(?<![\d,.])(\d{1,2})\s*[–-]\s*([A-D]\b|ANULAD[AO])', linha):
                g[int(m.group(1))] = m.group(2) if len(m.group(2)) == 1 else 'X'
        return g

    cfg = {
        'catalogo': 'pucrs', 'escola': 'PUCRS', 'ano': str(ano), 'fase': 'Verão', 'titulo': f'PUCRS {ano}', 'banca': 'PUCRS',
        'duracao_horas': duracao, 'alternativas': 4,
        'nota': f'Pontifícia Universidade Católica do Rio Grande do Sul, Concurso Vestibular de Verão {ano} (prova de Medicina): '
                'questões objetivas A–D. Língua estrangeira: inglês (questões 1 a 10 da opção inglês). Gabarito oficial '
                + ('(com a errata publicada pela PUCRS)' if ano == 2025 else '') + '; anulada fica fora.',
        'cadernos': [{'arquivo': 'caderno', 'paginas': (1, 999)}],
        'colunas': 'faixas', 'margem': 36, 'topo': 46, 'base': 80,
        'ancora': r'(?i)^quest[ãa]o\s+(\d{1,2})\b', 'ancora_dx': 30, 'sequencial': True,
        'secoes': PUCRS_SECOES, 'pular_secoes': ('Espanhol',), 'pular_antes_sequencia': True,
        'corte': [r'^_{10,}$', r'(?i)^INSTRUÇÃO GERAL', r'(?i)^REDAÇÃO$', r'(?i)^RASCUNHO'],
        # "INSTRUÇÃO: Responder às questões 6 a 9 com base no texto 2." + "TEXTO 2"; "com base nos textos 1 e 2" leva os dois
        'suporte': [r'(?i)^INSTRUÇÃO:', r'^TEXTO\s+\d+\s*$'], 'suporte_ate_proximo': True, 'texto_n_sem_faixa': True,
        'faixa_unica': True,
        'gabarito': gab, 'area': lambda n: 'Conhecimentos gerais',
    }
    cfg['total_de'] = lambda pasta: max(gab(pasta))
    return cfg


for _a, _p30, _p31 in ((2022, 12, 16), (2023, 14, 18), (2025, 12, 16), (2026, 14, 18)):
    PROVAS[f'pucrs-{_a}'] = pucrs(_a)
    # a redação fica entre a questão 30 e a 31: as páginas dela não entram
    PROVAS[f'pucrs-{_a}']['cadernos'] = [{'arquivo': 'caderno', 'paginas': (1, _p30), 'questoes': (1, 30)},
                                         {'arquivo': 'caderno', 'paginas': (_p31, 999), 'questoes': (31, 70)}]


# ------------------------------------------------------------------------------------------------ UEG
def grade_numeros_letras(txt, letras='ABCDEX'):
    """Gabarito em grade: uma linha de números e, logo abaixo, a linha das letras. Devolve a lista de pares em ordem."""
    linhas = [l.split() for l in txt.splitlines() if l.strip()]
    out = []
    for a, b in zip(linhas, linhas[1:]):
        if a and all(x.isdigit() for x in a) and b and len(a) == len(b) and all(re.fullmatch(rf'[{letras}]|ANULAD[AO]', x.upper().replace('–', '')) for x in b):
            out += [(int(n), v.upper()) for n, v in zip(a, b)]
    return out


def ueg(ano, sem, duracao=4.5):
    def gab(pasta):
        """Grade "ESPANHOL 1 2 3 4" / comuns / "INGLÊS 1 2 3 4": as questões 1–4 aparecem duas vezes; a 2ª é a do inglês
        (conferido no caderno 2025/1: inglês q1 = C). X = anulada."""
        g = {}
        for n, v in grade_numeros_letras(texto_pdf(pasta / 'gabarito.pdf').replace('*', '')):
            g[n] = v if v in 'ABCDE' else 'X'
        return g

    cfg = {
        'catalogo': 'ueg', 'escola': 'UEG', 'ano': str(ano), 'fase': f'{ano}/{sem}', 'titulo': f'UEG {ano}/{sem}', 'banca': 'Núcleo de Seleção UEG',
        'duracao_horas': duracao,
        'nota': f'Universidade Estadual de Goiás, Processo Seletivo {ano}/{sem}: prova objetiva A–E. Língua estrangeira: inglês. '
                'Gabarito oficial definitivo do Núcleo de Seleção; anulada fica fora.',
        'cadernos': [{'arquivo': 'caderno', 'paginas': (3, 999)}],
        # página em uma coluna: imagem e questão lado a lado (tabela) ficam no mesmo recorte
        'colunas': lambda r: [(36, r.width - 30)], 'margem': 36, 'topo': 48, 'base': 44,
        'ancora': r'(?i)^quest[ãa]o\s+(\d{1,2})\b', 'ancora_dx': 320, 'sequencial': True, 'suporte_apos_alt_xmax': 60,
        'secoes_rx': [(r'(?i)^QUEST[ÕO]ES DE \d+ A \d+ \(OP[ÇC][ÃA]O ESPANHOL\)', 'Espanhol'),
                      (r'(?i)^QUEST[ÕO]ES DE \d+ A \d+ \(OP[ÇC][ÃA]O INGL[ÊE]S\)', 'Inglês')],
        'pular_secoes': ('Espanhol',), 'pular_antes_sequencia': True,
        'pausa': [r'(?i)^Espaço para rascunho'], 'corte': [r'^NÚMERO$', r'(?i)^TABELA PERI', r'^Valores de Constantes', r'^Tabela Trigonom', r'(?i)^CLASSIFICA[ÇC][ÃA]O PERI', r'(?i)^PROVA DE REDA', r'(?i)^PROPOSTA DE REDA', r'(?i)^REDAÇÃO$', r'(?i)^Rascunho'],
        'suporte': [r'(?i)(para responder|e responda|para contestar|para a[s]? quest)', r'(?i)\banswer (the )?questions?\s+\d'],
        'suporte_apos_alt': r'^e\)',
        'suporte_apos_secao': True, 'faixa_unica': True, 'suporte_nao_colado': 25,
        'gabarito': gab, 'area': lambda n: 'Conhecimentos gerais',
    }
    cfg['total_de'] = lambda pasta: max(gab(pasta))
    return cfg


for _a, _s in ((2020, 1), (2021, 1), (2021, 2), (2022, 1), (2022, 2), (2023, 1), (2023, 2), (2024, 1), (2024, 2), (2025, 1), (2025, 2), (2026, 1), (2026, 2)):
    PROVAS[f'ueg-{_a}-{_s}'] = ueg(_a, _s)
PROVAS['ueg-2022-1']['faixa_errata'] = {('caderno', 26, (4, 4)): [48, 48]}   # o caderno diz "questão 4" antes da 48
PROVAS['ueg-2025-1']['anexa'] = {11: 10}   # "Observe a imagem ... questões 10 e 11": a imagem está no recorte da 10


# ---------------------------------------------------------------------------------------- UFJF (PISM III)
def ufjf_gab(txt):
    """Gabarito por matéria: linha de números (às vezes com o nome da matéria) e, abaixo, a das letras.
    "C ou E" (duas respostas aceitas) fica fora, como anulada."""
    txt = re.sub(r'\b([A-E])(\s+ou\s+|/)([A-E])\b', 'X', txt)
    linhas = txt.splitlines()
    g = {}
    for k, l in enumerate(linhas):
        ns = re.findall(r'(?<![\w,.])(\d{1,2})(?![\w,.])', l)
        if len(ns) < 2 or re.search(r'(?i)prova|módulo|dia|pism|20\d\d', l):
            continue
        for l2 in linhas[k + 1:k + 3]:
            vs = re.findall(r'(?<![\w])([A-EX]|ANULAD[AO])(?![\w])', l2)
            if l2.strip() and len(vs) == len(ns) and not re.search(r'\d', l2):
                for n, v in zip(ns, vs):
                    g[int(n)] = v if v in 'ABCDE' else 'X'
                break
    return g


def ufjf(ano, duracao=4):
    def gab(pasta):
        g = ufjf_gab(texto_pdf(pasta / 'd1-gabarito.pdf'))
        g.update({n + 20: v for n, v in ufjf_gab(texto_pdf(pasta / 'd2-gabarito.pdf')).items()})
        return g

    cfg = {
        'catalogo': 'ufjf', 'escola': 'UFJF', 'ano': str(ano), 'fase': 'PISM III', 'titulo': f'UFJF PISM {ano} – Módulo III', 'banca': 'Copese-UFJF',
        'duracao_horas': duracao, 'total': 40,
        'nota': f'Universidade Federal de Juiz de Fora, Programa de Ingresso Seletivo Misto (PISM {ano}), Módulo III: questões objetivas '
                'A–E dos dois dias (1º dia numerado 1 a 20; 2º dia, aqui 21 a 40), caderno da área de Saúde. As discursivas e a redação '
                'ficam fora. Gabarito oficial (retificado/pós-recursos, quando houve); questão com duas respostas aceitas ou anulada fica fora.',
        'cadernos': [{'arquivo': 'd1-caderno', 'paginas': (2, 999), 'questoes': (1, 20)},
                     {'arquivo': 'd2-caderno', 'paginas': (2, 999), 'questoes': (21, 40), 'deslocamento': 20}],
        # até 2024: uma coluna, "QUESTÃO 01 -"; 2025 em diante (LaTeX): duas colunas, "Questão 1."
        'colunas': (lambda r: duas_colunas(r, 26)) if ano >= 2025 else (lambda r: [(26, r.width - 26)]),
        'topo': {2025: 66, 2026: 52}.get(ano, 55), 'base': 46,
        'secoes': {k: k.title() for k in ('LÍNGUA PORTUGUESA', 'LITERATURA', 'LITERATURAS', 'BIOLOGIA', 'MATEMÁTICA', 'FÍSICA',
                                         'QUÍMICA', 'GEOGRAFIA', 'HISTÓRIA')},
        'secoes_rx': [(r'^(LÍNGUA PORTUGUESA|LITERATURAS?|BIOLOGIA|MATEMÁTICA|FÍSICA|QUÍMICA|GEOGRAFIA|HISTÓRIA)\s*[-–]\s*OBJETIVAS', 'Objetivas')],
        'ancora': r'(?i)^quest[ãa]o\s+0?(\d{1,2})\b', 'ancora_dx': 40, 'sequencial': True,
        'corte': [r'(?i)DISCURSIVAS|DISSERTATIVAS', r'(?i)^QUESTÕES OBJETIVAS$', r'^Objetivas$', r'(?i)^Quest[õo]es de \d+ a \d+$', r'(?i)^REDAÇÃO$', r'(?i)^RASCUNHO'],
        'suporte': [r'(?i)(responder|responda)\s+(a|à|às|as)\s+quest', r'(?i)^TEXTO\s+([IVX]+|\d+):?\s*$'], 'texto_n_sem_faixa': True,
        'faixa_unica': True, 'suporte_ate_proximo': True, 'suporte_nao_colado': 25, 'texto_romano': True,
        # "QUESTÃO 05 - ..." com "TEXTO III" logo abaixo: o texto é da própria questão (antes cortava o print no cabeçalho)
        'suporte_interno': 60,
        'gabarito': gab, 'area': lambda n: 'Conhecimentos gerais',
    }
    return cfg


for _a in (2020, 2022, 2023, 2024, 2025, 2026):
    PROVAS[f'ufjf-pism3-{_a}'] = ufjf(_a)
PROVAS['ufjf-pism3-2026']['suporte_interno'] = 110   # 2026 (duas colunas): "Texto 1" da questão 19 vem depois de um comando de duas linhas
# 2023, 2º dia: a questão 16 está impressa como "QUESTÃO 1 –" (erro de numeração do caderno; conferido no gabarito e na ordem)
PROVAS['ufjf-pism3-2023']['ancora_forcada'] = {('d2-caderno', 13): [(16, 145, 0)]}


# ----------------------------------------------------------------------------------------- UEMA (PAES)
def uema(ano, dias=1, duracao=5):
    def gab1(arq):
        """Pares "NN X" em colunas; 16–20 (língua) aparecem duas vezes por linha: inglês, depois espanhol — vale o 1º."""
        g = {}
        for n, v in re.findall(r'(?<![\d,.])(\d{1,2})\s+([A-E]\b|ANULAD[AO]|[Nn]ula|NULA|X\b|\*)', texto_pdf(arq)):
            g.setdefault(int(n), v if len(v) == 1 and v in 'ABCDE' else 'X')
        return g

    def gab(pasta):
        if dias == 1:
            return gab1(pasta / 'gabarito.pdf')
        g1 = gab1(pasta / 'd1-gabarito.pdf')
        return {**g1, **{n + max(g1): v for n, v in gab1(pasta / 'd2-gabarito.pdf').items()}}

    cad = [{'arquivo': 'caderno', 'paginas': (2, 999)}] if dias == 1 else None
    cfg = {
        'catalogo': 'uema', 'escola': 'UEMA', 'ano': str(ano), 'fase': 'PAES', 'titulo': f'UEMA PAES {ano}', 'banca': 'UEMA (ASCONS)',
        'duracao_horas': duracao,
        'nota': f'Universidade Estadual do Maranhão, Processo Seletivo de Acesso à Educação Superior (PAES {ano}): prova objetiva A–E. '
                'Língua estrangeira: inglês. Gabarito oficial definitivo (retificado, quando houve); anulada fica fora.',
        'cadernos': cad,
        'colunas': lambda r: [(22, r.width - 22)], 'topo': 8, 'base': 50,
        'ancora': r'(?i)^quest[ãa]o\s+0?(\d{1,2})\b', 'ancora_dx': 40, 'sequencial': True,
        'secoes_rx': [(r'(?i)^L[ÍI]NGUA ESPANHOLA', 'Espanhol'), (r'(?i)^L[ÍI]NGUA INGLESA', 'Inglês'),
                      (r'^CIÊNCIAS HUMANAS E SUAS', 'Ciências Humanas'), (r'^MATEMÁTICA,? (E )?CIÊNCIAS DA NATUREZA', 'Matemática e Natureza'),
                      (r'^CIÊNCIAS DA NATUREZA E SUAS', 'Ciências da Natureza'), (r'^MATEMÁTICA E SUAS', 'Matemática')],
        'pular_secoes': ('Espanhol',), 'pular_antes_sequencia': True,
        'corte': [r'(?i)^PRODUÇÃO TEXTUAL', r'(?i)^REDAÇÃO$', r'(?i)^RASCUNHO', r'(?i)^PROPOSTA'],
        'suporte': [r'(?i)(responder|responda)\s+(a|à|às|as)\s+quest[õo]es'], 'faixa_unica': True, 'suporte_nao_colado': 30,
        'suporte_apos_alt': r'^e\)', 'suporte_apos_alt_gap': 6, 'suporte_apos_alt_negrito': True,
        'gabarito': gab, 'area': lambda n: 'Conhecimentos gerais',
    }
    cfg['total_de'] = lambda pasta: max(gab(pasta))
    return cfg


for _a in (2020, 2022, 2024, 2026):
    PROVAS[f'uema-paes-{_a}'] = uema(_a)
PROVAS['uema-paes-2021'] = uema(2021, dias=2)
PROVAS['uema-paes-2021']['cadernos'] = lambda pasta: [
    {'arquivo': 'd1-caderno', 'paginas': (2, 999), 'questoes': (1, 44)},
    {'arquivo': 'd2-caderno', 'paginas': (2, 999), 'questoes': (45, 999), 'deslocamento': 44}]   # 1º dia: 44 questões
PROVAS['uema-paes-2021']['nota'] = PROVAS['uema-paes-2021']['nota'].replace('prova objetiva A–E.', 'prova objetiva A–E em dois dias (o 2º dia numerado aqui a partir do fim do 1º).')


# ----------------------------------------------------------------------------------------------- UFSM
def _ufsm_ultima(pdf):
    import pymupdf
    d = pymupdf.open(pdf)
    for i, pg in enumerate(d):
        if 'SÉRIE DOS LANTAN' in pg.get_text():
            return i   # página anterior à da tabela (numeração a partir de 1)
    return len(d)


def ufsm(ano, duracao=4.5):
    def gab1(arq):
        """Pares "NN X" pela posição na página; as questões de língua (38–40) aparecem duas vezes, no quadro
        "Língua Espanhola" e no quadro "Língua Inglesa": vale o par que fica abaixo do título "Língua Inglesa"."""
        import pymupdf
        pg = pymupdf.open(arq)[0]
        ws = pg.get_text('words')
        y_ing = min(w[1] for w in ws if w[4] == 'Inglesa')
        x_ing = [w[0] for w in ws if w[4] == 'Inglesa'][0]
        g = {}
        for w in ws:
            if not re.fullmatch(r'\d{2}', w[4]):
                continue
            n = int(w[4])
            # alternativa: a palavra seguinte na mesma linha, à direita
            v = [o for o in ws if abs(o[1] - w[1]) < 4 and 0 < o[0] - w[2] < 120 and re.fullmatch(r'[A-E]|ANULAD[AO]', o[4])]
            if not v:
                continue
            v = min(v, key=lambda o: o[0])[4]
            if n >= 38 and not (w[1] > y_ing and abs(w[0] - x_ing) < 80):
                continue   # 38–40 fora do quadro do inglês (espanhol)
            g[n] = v if len(v) == 1 else 'X'
        return g

    def gab(pasta):
        g = {}
        for k in (1, 2, 3):
            g.update({n + 40 * (k - 1): v for n, v in gab1(pasta / f'p{k}-gabarito.pdf').items()})
        return g

    cfg = {
        'catalogo': 'ufsm', 'escola': 'UFSM', 'ano': str(ano), 'fase': '', 'titulo': f'UFSM {ano}', 'banca': 'Coperves-UFSM',
        'duracao_horas': duracao, 'total': 120,
        'nota': f'Universidade Federal de Santa Maria, Processo Seletivo Vestibular {ano}: Provas 1, 2 e 3 (40 questões A–E cada; '
                'aqui numeradas 1–40, 41–80 e 81–120). Língua estrangeira: inglês. Gabarito oficial definitivo; anulada fica fora.',
        # o caderno termina antes da página da tabela periódica (depois dela só há "Anotações" e a contracapa)
        'cadernos': lambda pasta: [{'arquivo': f'p{k}-caderno', 'paginas': (2, _ufsm_ultima(pasta / f'p{k}-caderno.pdf')),
                                    'questoes': (40 * (k - 1) + 1, 40 * k), 'deslocamento': 40 * (k - 1)} for k in (1, 2, 3)],
        'colunas': 'faixas', 'faixas_modo': 'largas', 'margem': 12, 'topo': 50, 'base': 48,
        'ancora': r'^(\d{2})$', 'ancora_dx': 310, 'sequencial': True, 'ancora_negrito': True,
        # "→ Língua Espanhola ←" / "→ Língua Inglesa ←" (com setas) abrem as seções de língua
        'secoes_rx': [(r'(?i)^(→\s*)?L[ÍI]NGUA ESPANHOLA(\s*←)?$', 'Espanhol'), (r'(?i)^(→\s*)?L[ÍI]NGUA INGLESA(\s*←)?$', 'Inglês')],
        'pular_secoes': ('Espanhol',), 'pular_antes_sequencia': True,
        'pausa': [r'^Anotações$'], 'corte': [r'ATENÇÃO', r'(?i)^PROPOSTA DE REDA', r'(?i)^REDAÇÃO$', r'(?i)^RASCUNHO', r'(?i)^CLASSIFICAÇÃO PERIÓDICA'],
        'suporte': [r'(?i)(responder|responda)\s+(a|à|às|as)\s+quest'], 'faixa_unica': True, 'suporte_nao_colado': 45,
        'gabarito': gab, 'area': lambda n: 'Conhecimentos gerais',
    }
    return cfg


for _a in (2025, 2026):
    PROVAS[f'ufsm-{_a}'] = ufsm(_a)
# UFSM: FORA DO SITE por enquanto. Páginas misturam texto de largura total (com números de linha) e duas colunas, tirinhas
# com números em negrito no desenho e o aviso "SE VOCÊ OPTOU POR LÍNGUA INGLESA" no lugar da 37; o recorte ainda falha em
# parte das questões (ex.: 2025: 19, 37, 81, 87, 97, 115).
PROVAS['ufsm-2026']['divisa'] = 293.5   # números de linha da coluna direita começam em x≈294
# Prova 3, questões 35 e 36: o parágrafo de abertura vem antes de "Com base nesse cenário, leia o texto..." e é das duas
PROVAS['ufsm-2026']['suporte'] = PROVAS['ufsm-2026']['suporte'] + [r'^O advento das novas tecnologias tem mostrado',
                                                          r'^A Organização das Nações Unidas para a Educação,']   # idem, Prova 1, 01 e 02
# a instrução "Leia-o para responder às questões 01 e 02" fica no meio do parágrafo de abertura (linha "parque. Leia-o para responder..."):
# o texto de apoio começa no início do parágrafo, e a faixa 01–02 é dada aqui
PROVAS['ufsm-2026']['suporte'][0] = r'(?i)^(?!parque\. Leia-o)(?=.*(responder|responda)\s+(a|à|às|as)\s+quest)'
PROVAS['ufsm-2026']['faixa_errata'] = {('p1-caderno', 2, ()): [1, 2]}


# --------------------------------------------------------------------------------------------- UNEMAT
def unemat(ano, sem=None, ingles_primeiro=True, alternativas=5, duracao=4):
    """UNEMAT (Portal do Candidato / Covest): 35 questões objetivas, duas colunas, "Questão 01." em negrito.
    Língua estrangeira 34–35 em duas opções; no gabarito oficial a ordem das opções muda de ano para ano."""
    letras = 'ABCDE'[:alternativas]

    def gab(pasta):
        g, vistos = {}, set()
        for n, v in re.findall(rf'(?<![\d,.])(\d{{1,2}})\s+([{letras}]\b|ANULAD[AO])', texto_pdf(pasta / 'gabarito.pdf')):
            n = int(n)
            v = v if len(v) == 1 else 'X'
            if n in vistos:   # 2ª ocorrência de 34/35 (outra língua)
                if not ingles_primeiro:
                    g[n] = v
                continue
            vistos.add(n)
            g[n] = v
        return {n: v for n, v in g.items() if 1 <= n <= 35}

    ed = f'{ano}/{sem}' if sem else str(ano)
    return {
        'catalogo': 'unemat', 'escola': 'UNEMAT', 'ano': str(ano), 'fase': ed, 'titulo': f'UNEMAT {ed}', 'banca': 'Covest-UNEMAT',
        'duracao_horas': duracao, 'total': 35, 'alternativas': alternativas,
        'nota': f'Universidade do Estado de Mato Grosso, Concurso Vestibular {ed}: 35 questões objetivas '
                f'{"A–E" if alternativas == 5 else "A–D"} (redação fora). Língua estrangeira: inglês (34 e 35). '
                'Gabarito oficial (pós-recursos) publicado em edital; anulada fica fora.',
        'cadernos': [{'arquivo': 'caderno', 'paginas': (3, 999)}],
        'colunas': duas_colunas, 'margem': 22, 'topo': 26, 'base': 14, 'rodape_rx': r'Concurso Ves.{0,3}bular',
        'ancora': r'(?i)^quest[ãa]o\s+(\d{1,2})\.?\s*$', 'ancora_dx': 40, 'sequencial': True, 'ancora_negrito': True,
        'secoes_rx': [(r'(?i)^L[íi]ngua Estrangeira:.*Espanhol', 'Espanhol'), (r'(?i)^L[íi]ngua Estrangeira:.*Ingl[êe]s', 'Inglês')],
        'pular_secoes': ('Espanhol',), 'pular_antes_sequencia': True,
        'corte': [r'(?i)^Reda[çc][ãa]o$', r'(?i)^PROPOSTA DE REDA', r'(?i)^INSTRU[ÇC][ÕO]ES PARA A REDA', r'(?i)^TEXTOS MOTIVADORES',
                  r'(?i)^ESPA[ÇC]O PARA RASCUNHO', r'(?i)^Ci[êe]ncias da Natureza e suas Tecnologias$', r'(?i)^Matem[áa]tica e suas Tecn',
                  r'(?i)^Ci[êe]ncias Humanas e suas Tecnologias$', r'(?i)^Linguagens,? C[óo]digos e suas Tecnologias$'],
        'suporte': [r'(?i)^textos?( de apoio)? para (as? )?quest', r'(?i)(responda|responder)\s+(à|às|a|as)\s+quest'],
        'gabarito': gab, 'area': lambda n: 'Conhecimentos gerais',
    }


PROVAS['unemat-2022-2'] = unemat(2022, 2, ingles_primeiro=False)
PROVAS['unemat-2023'] = unemat(2023, 2, ingles_primeiro=False)   # Concurso Vestibular 2023/2 (id sem o semestre)
PROVAS['unemat-2024-1'] = unemat(2024, 1)
PROVAS['unemat-2025-1'] = unemat(2025, 1, alternativas=4)
PROVAS['unemat-2026-1'] = unemat(2026, 1, alternativas=4)


# ------------------------------------------------------------------------------------------- Unimontes
UNIMONTES_SECOES = [(r'^PROVA DE (L[ÍI]NGUA ESTRANGEIRA – )?L[ÍI]NGUA ESPANHOLA', 'Espanhol'), (r'^PROVA DE (L[ÍI]NGUA ESTRANGEIRA – )?L[ÍI]NGUA INGLESA', 'Inglês'),
                    (r'^PROVA DE L[ÍI]NGUA PORTUGUESA', 'Língua Portuguesa'), (r'^PROVA DE LITERATURA', 'Literatura'),
                    (r'^PROVA DE FILOSOFIA', 'Filosofia'), (r'^PROVA DE SOCIOLOGIA', 'Sociologia'),
                    (r'^PROVA DE BIOLOGIA', 'Biologia'), (r'^PROVA DE QU[ÍI]MICA', 'Química'), (r'^PROVA DE F[ÍI]SICA', 'Física'),
                    (r'^PROVA DE MATEM[ÁA]TICA', 'Matemática'), (r'^PROVA DE HIST[ÓO]RIA', 'História'), (r'^PROVA DE GEOGRAFIA', 'Geografia')]


def unimontes(ano, duracao=4.5):
    """Unimontes, Vestibular Próprio (Cotec), Grupo 1, caderno 101 (Área 3 – Biológicas): 45 questões A–D em uma coluna,
    "QUESTÃO 01" em negrito, matérias em seções "PROVA DE ...". Gabarito após recursos em grade (Nº QUESTÕES / RESPOSTAS);
    a língua estrangeira 16–19 aparece duas vezes (espanhol, depois inglês: vale a 2ª). N = nula."""
    def gab(pasta):
        txt = texto_pdf(pasta / 'gabarito.pdf').split('CADERNO 102')[0]
        linhas = txt.splitlines()
        g = {}
        for a, b in zip(linhas, linhas[1:]):
            if 'QUESTÕES' in a and b.strip().startswith('RESPOSTAS'):
                ns = [int(x) for x in re.findall(r'\b\d{2}\b', a)]
                vs = re.findall(r'\b([A-DN])\b', b.replace('RESPOSTAS', ''))
                assert len(ns) == len(vs), (a, b)
                for n, v in zip(ns, vs):
                    g[n] = v if v != 'N' else 'X'   # 16–19: o 2º bloco (inglês) sobrescreve o espanhol
        return g

    return {
        'catalogo': 'unimontes', 'escola': 'Unimontes', 'ano': str(ano), 'fase': 'Grupo 1', 'titulo': f'Unimontes {ano}', 'banca': 'Cotec-Unimontes',
        'duracao_horas': duracao, 'total': 45, 'alternativas': 4,
        'nota': f'Universidade Estadual de Montes Claros, Vestibular Próprio {ano} (Edital 4/{ano}), Grupo 1, caderno 101 '
                '(Área 3 – Biológicas): 45 questões A–D. Língua estrangeira: inglês (16 a 19). Gabarito oficial após recursos; '
                'anulada fica fora.',
        'cadernos': [{'arquivo': 'caderno', 'paginas': (4, 999)}],
        'colunas': lambda r: [(24, r.width - 20)], 'margem': 24, 'topo': 36, 'base': 22,
        'ancora': r'^QUEST[ÃA]O\s+(\d{2})\s*$', 'ancora_dx': 60, 'sequencial': True, 'ancora_negrito': True,
        'secoes_rx': UNIMONTES_SECOES, 'pular_secoes': ('Espanhol',), 'pular_antes_sequencia': True,
        'corte': [r'(?i)^Quest[õo]es de \d+ a \d+$', r'(?i)^CLASSIFICA[ÇC][ÃA]O PERI', r'(?i)^REDA[ÇC][ÃA]O$', r'(?i)^RASCUNHO'],
        # "Texto 1" (linha própria) numera o texto para as questões que o citam depois ("considere os textos 1 e 2")
        'suporte': [r'^INSTRUÇÃO:', r'^Texto\s+\d+\s*(\(.*\))?$'], 'suporte_secao': True, 'cita_textos': True,
        'suporte_singular': r'(?i)\b(à|a)\s+(esta\s+)?quest[ãa]o\b|responda à questão|considere os textos',
        'gabarito': gab, 'area': lambda n: 'Conhecimentos gerais',
    }


for _a in (2024, 2025):
    PROVAS[f'unimontes-{_a}'] = unimontes(_a)


# --------------------------------------------------------------------------------------------- Unespar
_UNESPAR_MAT = [('Ingl[êe]s', 'Inglês'), ('Espanhol', 'Espanhol'), ('Portugu[êe]s', 'Língua Portuguesa'), ('Literatura', 'Literatura'),
                ('Artes', 'Artes'), ('Educa[çc][ãa]o F[íi]sica', 'Educação Física'), ('F[íi]sica', 'Física'), ('Qu[íi]mica', 'Química'),
                ('Biologia', 'Biologia'), ('Hist[óo]ria', 'História'), ('Geografia', 'Geografia'), ('Filosofia', 'Filosofia'),
                ('Sociologia', 'Sociologia'), ('Matem[áa]tica', 'Matemática')]


def unespar(ano, duracao=4.5):
    """Unespar, Concurso Vestibular (Grupo I): prova objetiva A–E em uma coluna, "QUESTÃO 01" em negrito; matérias em
    seções "Questões de 05 a 11 (Português)"; língua 1–4 na opção inglês ou espanhol. Gabarito oficial em edital:
    o inglês vem antes do espanhol (vale a 1ª ocorrência de 1–4)."""
    def gab(pasta):
        return pares(texto_pdf(pasta / 'gabarito.pdf'))

    cfg = {
        'catalogo': 'unespar', 'escola': 'Unespar', 'ano': str(ano), 'fase': 'Grupo I', 'titulo': f'Unespar {ano}', 'banca': 'CCCV-Unespar',
        'duracao_horas': duracao,
        'nota': f'Universidade Estadual do Paraná, Concurso Vestibular {ano} (Grupo I): prova objetiva A–E (redação fora). '
                'Língua estrangeira: inglês (1 a 4). Gabarito oficial publicado em edital após os recursos; anulada fica fora.',
        'cadernos': [{'arquivo': 'caderno', 'paginas': (6, 999)}],
        'colunas': lambda r: [(18, r.width - 18)], 'margem': 18, 'topo': 14, 'base': 10, 'rodape_num': True, 'rodape_centro': False, 'rodape_ultimo': True, 'rodape_lado': True, 'apagar': [r'^\d{1,2}$'],
        'ancora': r'^QUEST[ÃA]O\s+(\d{2})\s*$', 'ancora_dx': 160, 'sequencial': True, 'ancora_negrito': True,
        'secoes_rx': [(rf'(?i)^Quest[õo]es d[eo] \d+ a\s*(\d+)?\s*\((op[çc][ãa]o )?{rx}\)', nome) for rx, nome in _UNESPAR_MAT],
        'pular_secoes': ('Espanhol',), 'pular_antes_sequencia': True,
        'corte': [r'(?i)^[ÁA]REA DE ', r'(?i)^Quest[õo]es$', r'(?i)^de \d+ a \d+$', r'(?i)^RASCUNHO'],
        # "Text 2" sozinho (2024): texto em inglês sem instrução, da questão seguinte
        'suporte': [r'(?i)^textos? (abaixo |a seguir )?(para|refere-se|referem-se)', r'(?i)(responda|responder)\s+(às|as)\s+quest[õo]es',
                    r'(?i)refere(m)?-se\s+(à|às)\s+quest', r'^Text\s+\d+:?\s*$'], 'texto_n_sem_faixa': True,
        'gabarito': gab, 'area': lambda n: 'Conhecimentos gerais',
    }
    cfg['total_de'] = lambda pasta: max(gab(pasta))
    return cfg


for _a in (2023, 2024, 2026):
    PROVAS[f'unespar-{_a}'] = unespar(_a)


# ------------------------------------------------------------------------------------------------ URCA
def urca_gab(textos):
    """Grade "números / letras" por matéria; o 2º dia recomeça em 1 (aqui 61–120). O quadro de língua estrangeira vem
    em inglês e em espanhol: vale o do inglês. "Nula" ou "*" = anulada."""
    g, desloc, cab = {}, 0, ''
    for txt in textos:
        ls = [l for l in txt.splitlines() if l.strip()]
        for a, b in zip(ls, ls[1:]):
            na, nb = a.split(), b.split()
            if na and all(x.isdigit() for x in na) and len(na) == len(nb) \
                    and all(re.fullmatch(r'[A-E]|\*|NULA|ANULADA', x.upper()) for x in nb):
                ns = [int(x) for x in na]
                if ns[0] == 1 and g and max(g) - desloc >= 60:
                    desloc += 60   # começa o 2º dia
                if 'ESPANHOL' not in cab.upper():
                    for n, v in zip(ns, nb):
                        g[n + desloc] = v if v in 'ABCDE' else 'X'
            elif not all(x.isdigit() for x in na) and not all(re.fullmatch(r'[A-E]|\*|NULA|ANULADA', x.upper()) for x in na):
                cab = a
    return g


def urca(ano, sem, um_gab=False, duracao=8):
    def gab(pasta):
        arqs = [pasta / 'gabarito.pdf'] if um_gab else [pasta / 'd1-gabarito.pdf', pasta / 'd2-gabarito.pdf']
        return urca_gab([texto_pdf(a) for a in arqs])

    secoes = [(r'(?i)^PROVA DE F[ÍI]SICA', 'Física'), (r'(?i)^PROVA DE MATEM', 'Matemática'), (r'(?i)^PROVA DE QU[ÍI]MICA', 'Química'),
              (r'(?i)^PROVA DE BIOLOGIA', 'Biologia'), (r'(?i)^PROVA DE HIST', 'História'), (r'(?i)^PROVA DE GEOGRAFIA', 'Geografia'),
              (r'(?i)^PROVA DE L[ÍI]NGUA PORTUGUESA', 'Língua Portuguesa'), (r'(?i)^PROVA DE L[ÍI]NGUA INGLESA|^PROVA DE INGL', 'Inglês'),
              (r'(?i)^PROVA DE L[ÍI]NGUA ESPANHOLA|^PROVA DE ESPANHOL', 'Espanhol'),
              (r'(?i)^F[ÍI]SICA\s*[-–]\s*QUEST', 'Física'), (r'(?i)^MATEM[ÁA]TICA\s*[-–]\s*QUEST', 'Matemática'),
              (r'(?i)^QU[ÍI]MICA\s*[-–]\s*QUEST', 'Química'), (r'(?i)^BIOLOGIA\s*[-–]\s*QUEST', 'Biologia'),
              (r'(?i)^HIST[ÓO]RIA\s*[-–]\s*QUEST', 'História'), (r'(?i)^GEOGRAFIA\s*[-–]\s*QUEST', 'Geografia'),
              (r'(?i)^L[ÍI]NGUA PORTUGUESA.*[-–]\s*QUEST', 'Língua Portuguesa'), (r'(?i)^L[ÍI]NGUA INGLESA.*[-–]\s*QUEST|^INGL[ÊE]S\s*[-–]\s*QUEST', 'Inglês')]
    return {
        'catalogo': 'urca', 'escola': 'URCA', 'ano': str(ano), 'fase': f'{ano}.{sem}', 'titulo': f'URCA {ano}.{sem}', 'banca': 'CEV-URCA',
        'duracao_horas': duracao, 'total': 120,
        'nota': f'Universidade Regional do Cariri, Processo Seletivo Unificado {ano}.{sem}: Prova I (Física, Matemática, Química, '
                'Biologia; questões 1–60) e Prova II (História, Geografia, Língua Portuguesa, Inglês; aqui 61–120), A–E. '
                'Redação fora. Gabarito oficial da CEV; questão nula fica fora.',
        'cadernos': [{'arquivo': 'd1-caderno', 'paginas': (1, 999), 'questoes': (1, 60)},
                     {'arquivo': 'd2-caderno', 'paginas': (1, 999), 'questoes': (61, 120), 'deslocamento': 60}],
        # duas colunas, com figuras e textos de largura total em algumas páginas (como a UFSM)
        'colunas': 'faixas', 'faixas_modo': 'largas', 'divisa': 290, 'margem': 30, 'topo': 86, 'base': 46,
        'ancora': r'^(\d{2})\.\s*\(URCA', 'ancora_dx': 20, 'sequencial': True,
        'secoes_rx': secoes, 'pular_secoes': ('Espanhol',), 'pular_antes_sequencia': True,
        'corte': [r'(?i)^RASCUNHO', r'(?i)^TABELA$', r'(?i)PROPOSTA DE REDA', r'(?i)^REDA[ÇC][ÃA]O$', r'(?i)^Texto motivador',
                  r'(?i)^Leia (com aten|atentamente) (as instru|o texto motivador)'],
        # "Texto 2 - Influence on Others - Part II Questões de 49 a 52"
        # "Leia o texto a seguir (crônica ...) e responda às questões." sem números: vale até o próximo texto ou seção
        'suporte': [r'(?i)^Texto?\s+([IVX]+|\d+)\s*([-–:.]|$)', r'(?i)^Texto para as quest', r'(?i)(responda|responder)\s+(às|as)\s+quest[õo]es',
                    r'(?i)^Leia (o|os|a|as) (texto|trecho|poema|fragmento|crônica|tirinha|charge)(?!.*(marque|assinale|indique|analise))'],
        'suporte_secao': True,
        # área pela posição (blocos fixos de 15 questões; os títulos de seção mudam de ano para ano)
        'gabarito': gab, 'area_do_gabarito': True,
        'area': lambda n: ('Física', 'Matemática', 'Química', 'Biologia', 'História', 'Geografia', 'Língua Portuguesa', 'Inglês')[(n - 1) // 15],
    }


for _a, _s, _u in ((2023, 1, False), (2023, 2, False), (2024, 1, False), (2024, 2, False), (2025, 1, True), (2025, 2, False), (2026, 1, False)):
    PROVAS[f'urca-{_a}-{_s}'] = urca(_a, _s, _u)
PROVAS['urca-2025-3'] = urca(2025, 3, True)
PROVAS['urca-2025-3'].update({'fase': 'PSU 2025.2/2026.1 (out/2025)', 'titulo': 'URCA PSU out/2025'})
PROVAS['urca-2025-3']['nota'] = PROVAS['urca-2025-3']['nota'].replace('Processo Seletivo Unificado 2025.3', 'Processo Seletivo Unificado 2025.2 (demais campi) e 2026.1 (Iguatu), aplicado em out/2025')


# ---------------------------------------------------------------------------------------------- UEG Medicina
def ueg_medicina(ano, sem, cod):
    """Vestibular do Curso de Medicina da UEG (Núcleo de Seleção, processo {cod}): 60 objetivas A–E no mesmo layout do
    vestibular geral (uma coluna, "Questão 1"); língua 1–5 em espanhol e inglês (vale a 2ª, o inglês). Prova tipo 1.
    A discursiva específica e a redação ficam fora."""
    cfg = ueg(ano, sem)
    cfg.update({
        'catalogo': 'ueg', 'escola': 'UEG', 'fase': f'Medicina {ano}/{sem}', 'titulo': f'UEG Medicina {ano}/{sem}',
        'nota': f'Universidade Estadual de Goiás, Vestibular do Curso de Medicina {ano}/{sem} (Núcleo de Seleção, processo {cod}), '
                'prova tipo 1: 60 questões objetivas A–E. Língua estrangeira: inglês (1 a 5). Discursiva específica e redação fora. '
                'Gabarito oficial definitivo; anulada fica fora.',
        'secoes_rx': [(r'(?i)^QUEST[ÕO]ES DE \d+ A \d+ \(OP[ÇC][ÃA]O ESPANHOL\)', 'Espanhol'),
                      (r'(?i)^QUEST[ÕO]ES DE \d+ A \d+ \(OP[ÇC][ÃA]O INGL[ÊE]S\)', 'Inglês')],
    })
    cfg['corte'] = cfg['corte'] + [r'(?i)^Provas? Discursivas?', r'(?i)^PROVA DE REDA']
    return cfg


for _a, _s, _c in ((2024, 2, 332), (2025, 2, 354), (2026, 1, 378)):
    PROVAS[f'ueg-medicina-{_a}-{_s}'] = ueg_medicina(_a, _s, _c)
PROVAS['ueg-medicina-2025-2']['ancora_dx'] = 400   # "Questão 5" (inglês) à direita de uma imagem, x≈414
for _k in ('ueg-medicina-2024-2', 'ueg-medicina-2025-2', 'ueg-medicina-2026-1'):
    # o caderno não tem títulos de matéria depois da língua: a área vem da posição (1–5 inglês)
    PROVAS[_k]['area_do_gabarito'] = True
    PROVAS[_k]['area'] = lambda n: 'Inglês' if n <= 5 else 'Conhecimentos gerais'
# 54 (2º dia; aqui 114): "Considerando o texto na íntegra (Partes I, II e III)" — leva os Textos 1, 2 e 3 (das questões 46–53)
PROVAS['urca-2025-3']['apoio_de'] = {114: [106, 110, 112]}


# ------------------------------------------------------------------------------------------------ Unicentro
UNICENTRO_MATERIAS = [('Língua Portuguesa', r'^L[ÍI]NGUA PORTUGUESA E LITERATURA$', 10), ('Inglês', r'^L[ÍI]NGUA ESTRANGEIRA MODERNA\s*[–-]\s*INGL[ÊE]S$', 5),
                      ('Arte', r'^ARTE$', 9), ('Biologia', r'^BIOLOGIA$', 9), ('Filosofia', r'^FILOSOFIA$', 9), ('Física', r'^F[ÍI]SICA$', 9),
                      ('Geografia', r'^GEOGRAFIA$', 9), ('História', r'^HIST[ÓO]RIA$', 9), ('Matemática', r'^MATEM[ÁA]TICA$', 9),
                      ('Química', r'^QU[ÍI]MICA$', 9), ('Sociologia', r'^SOCIOLOGIA$', 9)]
_UNICENTRO_GAB = {'Língua Portuguesa': 'LÍNGUA PORTUGUESA E LITERATURA', 'Inglês': 'INGLÊS', 'Arte': 'ARTE', 'Biologia': 'BIOLOGIA',
                  'Filosofia': 'FILOSOFIA', 'Física': 'FÍSICA', 'Geografia': 'GEOGRAFIA', 'História': 'HISTÓRIA',
                  'Matemática': 'MATEMÁTICA', 'Química': 'QUÍMICA', 'Sociologia': 'SOCIOLOGIA'}


def unicentro(ano, arquivo='caderno'):
    """Unicentro, Vestibular de {ano}: caderno único com Língua Portuguesa e Literatura (1–10), língua estrangeira (1–5) e
    as provas de 9 matérias (1–9 cada; o candidato faz as 5 do grupo do seu curso). Aqui a prova inteira, menos o espanhol:
    Português 1–10, Inglês 11–15, Arte 16–24, Biologia 25–33, Filosofia 34–42, Física 43–51, Geografia 52–60,
    História 61–69, Matemática 70–78, Química 79–87, Sociologia 88–96 (o número do caderno fica em 'nq').
    Uma coluna; número da questão num quadrado preto, em linha própria. Gabarito definitivo em grade por matéria."""
    def gab(pasta):
        txt = texto_pdf(pasta / 'gabarito.pdf')
        txt = txt[txt.find('GABARITO DEFINITIVO'):]
        ls = [l for l in txt.splitlines() if l.strip()]
        blocos = {}   # matéria -> {n: letra}
        for i, l in enumerate(ls):
            nomes = [x.strip() for x in re.split(r'\s{3,}', l.strip())]
            if not all(re.fullmatch(r'[A-ZÁÉÍÓÚÂÊÔÃÕÇ ]+', x) for x in nomes) or i + 2 >= len(ls):
                continue
            ns = ls[i + 1].split()
            vs = ls[i + 2].replace('*', '').split()
            if not (ns and all(x.isdigit() for x in ns) and len(ns) == len(vs)):
                continue
            # "INGLÊS   ESPANHOL" na mesma linha: os 5 primeiros são do inglês
            por = len(ns) // len(nomes)
            for k, nome in enumerate(nomes):
                blocos[nome] = {int(n): (v if v in 'ABCDE' else 'X') for n, v in zip(ns[k * por:(k + 1) * por], vs[k * por:(k + 1) * por])}
        g, ini = {}, 0
        for nome, _, qtd in UNICENTRO_MATERIAS:
            b = blocos[_UNICENTRO_GAB[nome]]
            assert len(b) == qtd, (nome, b)
            for n, v in b.items():
                g[ini + n] = v
            ini += qtd
        return g

    cads, ini = [], 0
    for nome, _, qtd in UNICENTRO_MATERIAS:
        cads.append({'arquivo': arquivo, 'paginas': (3, 999), 'so_secao': nome, 'questoes': (ini + 1, ini + qtd),
                     'deslocamento': ini, 'rotulo': nome})
        ini += qtd
    cfg = {
        'catalogo': 'unicentro', 'escola': 'Unicentro', 'ano': str(ano), 'fase': 'Vestibular', 'titulo': f'Unicentro {ano}', 'banca': 'Coorps-Unicentro',
        'duracao_horas': 5, 'total': ini,
        'nota': f'Universidade Estadual do Centro-Oeste, Vestibular de {ano}: caderno único, A–E. Todas as provas objetivas do '
                'caderno (Língua Portuguesa e Literatura, Inglês e as 9 matérias dos grupos de cursos), menos o espanhol; o '
                'candidato faz Português, a língua e as 5 matérias do seu grupo. Redação fora. Gabarito definitivo em edital; '
                'anulada fica fora.',
        'cadernos': cads,
        'colunas': lambda r: [(36, r.width - 30)], 'margem': 36, 'topo': 40, 'base': 59,
        'ancora': r'^(\d{1,2})$', 'ancora_dx': 12, 'sequencial': True, 'ancora_negrito': True,
        'ancora_bloco': True,
        'secoes_rx': [(rx, nome) for nome, rx, _ in UNICENTRO_MATERIAS] + [(r'^L[ÍI]NGUA ESTRANGEIRA MODERNA\s*[–-]\s*ESPANHOL$', 'Espanhol')],
        'corte': [r'^LITERATURA$', r'(?i)^RASCUNHO', r'(?i)^TABELA[- ]PERI', r'(?i)^CLASSIFICA[ÇC][ÃA]O PERI'],
        'suporte': [r'(?i)(responda|responder)\s+(às|as)\s+quest[õo]es'],
        'gabarito': gab, 'area': lambda n: 'Conhecimentos gerais',
    }
    return cfg


for _a in (2022, 2023, 2024):
    PROVAS[f'unicentro-{_a}'] = unicentro(_a)
for _a in (2026, 2027):
    # só o caderno "com respostas" tem camada de texto (2027: o caderno sem respostas é imagem): a alternativa certa vem
    # em vermelho e é repintada de preto no print
    PROVAS[f'unicentro-{_a}'] = unicentro(_a, 'caderno-com-respostas')
    PROVAS[f'unicentro-{_a}']['neutralizar_cores'] = (0xff0000,)


# ---------------------------------------------------------------------- correções da auditoria da rodada 4 (06/11/2026)
# área do simulado pela matéria classificada (cadernos sem título de matéria por questão)
for _k in [k for k in PROVAS if re.match(r'(ueg-20|ueg-medicina-|ufsm-|unemat-)', k)]:
    PROVAS[_k]['area_da_materia'] = True
for _k in [k for k in PROVAS if k.startswith('urca-')]:
    # transcrição dos cadernos em LaTeX não fica fiel (acentos soltos, parágrafos partidos, "€"): fica o print
    PROVAS[_k]['sem_transcricao'] = True
    PROVAS[_k]['faixa_unica'] = True   # "Texto 5 – Questão 56" vale só para a 56
    PROVAS[_k]['texto_n_com_faixa'] = True
PROVAS['urca-2025-1']['anexa'] = {119: 118}          # Q59 cita "o último parêntese da Questão 58"
PROVAS['urca-2023-1']['apoio_de'] = {118: [113]}     # Q58 compara com o caso do Texto 3 (questões 53–54)
PROVAS['urca-2023-2']['ancora_dy'] = {16: -12}       # √(5/7) e √(7/5) na 1ª linha: numeradores acima da âncora
PROVAS['urca-2024-2']['ancora_dy'] = {17: -12}       # x = (√5 − √2)/2 na 1ª linha
PROVAS['ueg-medicina-2026-1']['suporte'] = PROVAS['ueg-medicina-2026-1']['suporte'] + [r'(?i)^Leia e observe']
# transcrição com fórmula ou parágrafos partidos: fica o print
PROVAS['unespar-2023']['sem_transcricao'] = (33,)
PROVAS['unemat-2026-1']['sem_transcricao'] = (6, 13, 27)
PROVAS['unemat-2023']['sem_transcricao'] = (28, 35)
PROVAS['unimontes-2024']['sem_transcricao'] = (15,)
PROVAS['ufsm-2025']['faixas_pag'] = {('p1-caderno', 11): [(50, 794, 289.5)]}   # números de linha da 19 começam em x≈292


# ---------------------------------------------------------------------------------------------------- UNIRG
def _cx(rx):
    """título de seção em caixa alta ou só com a inicial maiúscula (nunca a palavra solta de um texto justificado)"""
    return rf'^(?:{rx.upper()}|{rx[0].upper() + rx[1:]})$'


_UNIRG_SEC = [(r'^(L[ÍI]NGUA PORTUGUESA|L[íi]ngua Portuguesa)$', 'Língua Portuguesa'), (r'^(LITERATURA BRASILEIRA|Literatura Brasileira)$', 'Literatura'),
              (r'^(L[ÍI]NGUA ESTRANGEIRA\s*\(?ESPANHOL\)?|L[íi]ngua Estrangeira\s*\(Espanhol\))$', 'Espanhol'),
              (r'^(L[ÍI]NGUA ESTRANGEIRA(\s*\(?INGL[ÊE]S\)?)?|L[íi]ngua Estrangeira\s*\(Ingl[êe]s\))$', 'Inglês'),
              (_cx('biologia'), 'Biologia'), (r'^(F[ÍI]SICA|F[íi]sica)$', 'Física'), (r'^(QU[ÍI]MICA|Qu[íi]mica)$', 'Química'),
              (r'^(MATEM[ÁA]TICA|Matem[áa]tica)$', 'Matemática'), (_cx('geografia'), 'Geografia'), (r'^(HIST[ÓO]RIA|Hist[óo]ria)$', 'História')]


def unirg(ano, sem, formato):
    """UNIRG (Universidade de Gurupi), Processo Seletivo de Medicina, campus Gurupi, caderno tipo 1: 54 questões A–D
    (Língua Portuguesa, Literatura, língua estrangeira, Biologia, Física, Química, Matemática, Geografia e História, 6 de cada).
    Três diagramações: 'unirg' (2022–2023, duas colunas, "Questão 01"; inglês e espanhol no mesmo caderno, numerados 13–18),
    'ipefae' (2024/1–2026/1, duas colunas, "Q. 25", caderno só com inglês) e 'tipo1' (2026/2, uma coluna, "QUESTÃO 1";
    espanhol e inglês numerados 7–12). Gabarito definitivo do tipo 1; '*' ou NULA/Anulada = anulada."""
    def gab(pasta):
        txt = texto_pdf(pasta / 'gabarito.pdf')
        g = {}
        if formato == 'unirg':
            bloco = re.split(r'PROVA\s+TIPO\s+2', txt)[0]
            for n, v in re.findall(r'(?<!\d)(\d{1,2})\s*[–-]\s*([A-D]\b|\*|ANULADA)', bloco):
                g.setdefault(int(n), v if v in 'ABCD' else 'X')   # na mesma linha o inglês vem antes do espanhol
        elif formato == 'ipefae':
            ini = txt.index('GABARITO', txt.index('SEGUE'))
            bloco = re.split(r'(?m)^\s*PROVA 1\s*$', txt[ini:])[1]
            bloco = re.split(r'(?m)^\s*PROVA 2\s*$', bloco)[0]
            for n, v in re.findall(r'(\d{2}):\s*([A-D]\b|Anulada|ANULADA|\*)', bloco):
                g[int(n)] = v if v in 'ABCD' else 'X'
        else:   # tipo1: espanhol 7–12 e depois inglês 7–12: vale o último
            for n, v in re.findall(r'(?<![\d,.])(\d{1,2})\s+([A-D]\b|NULA)', txt):
                g[int(n)] = v if v in 'ABCD' else 'X'
        return g

    cfg = {
        'catalogo': 'unirg', 'escola': 'UNIRG', 'ano': str(ano), 'fase': f'Medicina {ano}/{sem}', 'titulo': f'UNIRG Medicina {ano}/{sem}',
        'banca': 'UNIRG' if formato != 'ipefae' else 'Ipefae', 'duracao_horas': 4.5, 'total': 54, 'alternativas': 4,
        'nota': f'Universidade de Gurupi (TO), Processo Seletivo {ano}/{sem} do curso de Medicina, campus Gurupi, caderno tipo 1: '
                '54 questões A–D, 6 por matéria. Língua estrangeira: inglês. Redação fora. Gabarito definitivo publicado pela '
                'Comissão Permanente de Processo Seletivo; anulada fica fora.',
        'cadernos': [{'arquivo': 'caderno', 'paginas': (2, 999)}],
        'secoes_rx': _UNIRG_SEC, 'pular_secoes': ('Espanhol',), 'pular_antes_sequencia': True, 'sequencial': True, 'ancora_negrito': True,
        'corte': [r'(?i)^(LINGUAGENS,? C[ÓO]DIGOS|CI[ÊE]NCIAS DA NATUREZA|CI[ÊE]NCIAS HUMANAS|MATEM[ÁA]TICA E SUAS)', r'(?i)^Reda[çc][ãa]o$',
                  r'(?i)PROPOSTA DE REDA', r'(?i)^REDA[ÇC][ÃA]O EM L', r'(?i)^TABELA PERI', r'(?i)^Classifica[çc][ãa]o Peri',
                  r'(?i)^Espa[çc]o para Rascunho', r'(?i)^RASCUNHO'],
        'suporte': [r'(?i)(responda|responder)\b.*\bquest[õo]es', r'(?i)answer\b.*\bquestions', r'(?i)^textos? para as quest',
                    r'(?i)^texts? for (the )?questions', r'(?i)^(Leia atentamente|As informa[çc][õo]es a seguir|Os? textos? a seguir)'],
        # área pela posição (6 por matéria): nem todo caderno traz o título de cada matéria (2023/2 não tem "Matemática")
        'gabarito': gab, 'area_do_gabarito': True,
        'area': lambda n: (('Língua Portuguesa', 'Literatura', 'Inglês') if formato == 'unirg' else ('Língua Portuguesa', 'Inglês', 'Literatura'))[(n - 1) // 6]
                if n <= 18 else ('Biologia', 'Física', 'Química', 'Matemática', 'Geografia', 'História')[(n - 19) // 6],
    }
    if formato == 'unirg':
        cfg.update({'colunas': lambda r: [(36, 298), (298, r.width - 30)], 'margem': 36, 'topo': 32, 'base': 30,
                    'ancora': r'(?i)^Quest[ãa]o\s+(\d{1,2})$', 'ancora_dx': 14})
    elif formato == 'ipefae':
        cfg.update({'colunas': lambda r: [(30, 300), (300, r.width - 26)], 'margem': 30, 'topo': 31, 'base': 28,
                    'ancora': r'^Q\.\s*(\d{1,2})$', 'ancora_dx': 22})
    else:
        cfg.update({'colunas': lambda r: [(38, r.width - 36)], 'margem': 38, 'topo': 30, 'base': 40,
                    'ancora': r'^QUEST[ÃA]O\s+(\d{1,2})$', 'ancora_dx': 12})
    return cfg


for _a, _s, _f in ((2022, 1, 'unirg'), (2022, 2, 'unirg'), (2023, 2, 'unirg'), (2024, 1, 'ipefae'), (2024, 2, 'ipefae'),
                   (2025, 2, 'ipefae'), (2026, 1, 'ipefae'), (2026, 2, 'tipo1')):
    PROVAS[f'unirg-{_a}-{_s}'] = unirg(_a, _s, _f)


# -------------------------------------------------------------------------------------------------- Unitins
def unitins(ano, sem, ordem=('Física', 'Biologia', 'Matemática', 'História', 'Geografia', 'Química')):
    """Unitins, Vestibular Presencial {ano}/{sem}: 50 questões A–E — 6 matérias com 5 questões cada (1–30), Língua
    Portuguesa e Literatura Brasileira (31–45) e língua estrangeira (46–50, inglês ou espanhol: vale o inglês).
    Página com faixas de largura total e trechos em duas colunas (modo 'faixas'); "QUESTÃO 1"/"Questão 01" em negrito.
    Gabarito definitivo: grade "número letra" (até 2023) ou linhas "Questão"/"Gabarito" por matéria (desde 2024)."""
    def gab(pasta):
        txt = texto_pdf(pasta / 'gabarito.pdf')
        txt = re.split(r'(?m)^\s*Espanhol\s*$', txt)[0]   # quadro do espanhol (2024+) fica fora
        g = {}
        ls = txt.splitlines()
        for a, b in zip(ls, ls[1:]):
            if a.strip().startswith('Questão') and b.strip().startswith('Gabarito'):
                ns = [int(x) for x in a.split()[1:]]
                vs = re.findall(r'\*?Anul(?:ada|\.)|\*?[A-E]\b', b.split('Gabarito', 1)[1])
                assert len(ns) == len(vs), (a, b)
                for n, v in zip(ns, vs):
                    v = v.lstrip('*')
                    g[n] = v if v in 'ABCDE' else 'X'
        if not g:
            # grade antiga: "46 A E" (inglês, espanhol) — vale a 1ª letra
            for n, v in re.findall(r'(?<![\d,.])(\d{1,2})\s+([A-E])\*?(?=\s|$)', txt):
                g.setdefault(int(n), v)
        return g

    nomes = list(ordem) + ['Língua Portuguesa'] * 3 + ['Inglês']
    sec = [(r'^(L[ÍI]NGUA ESPANHOLA|ESPANHOL|Espanhol|L[íi]ngua Espanhola)$', 'Espanhol'),
           (r'^(L[ÍI]NGUA INGLESA|INGL[ÊE]S|Ingl[êe]s|L[íi]ngua Inglesa)$', 'Inglês')]
    return {
        'catalogo': 'unitins', 'escola': 'Unitins', 'ano': str(ano), 'fase': f'Vestibular {ano}/{sem}', 'titulo': f'Unitins {ano}/{sem}',
        'banca': 'Unitins', 'duracao_horas': 4.5, 'total': 50,
        'nota': f'Universidade Estadual do Tocantins, Vestibular Presencial {ano}/{sem}: 50 questões A–E (Física, Biologia, '
                'Matemática, História, Geografia, Química, Língua Portuguesa e Literatura Brasileira, língua estrangeira). '
                'Língua estrangeira: inglês. Redação fora. Gabarito definitivo; anulada fica fora.',
        'cadernos': [{'arquivo': 'caderno', 'paginas': (2, 999)}],
        'colunas': 'faixas', 'faixas_modo': 'largas', 'divisa': 297, 'margem': 20, 'topo': 24, 'base': 24,
        'ancora': r'(?i)^QUEST[ÃA]O\s+(\d{1,2})$', 'ancora_dx': 32, 'sequencial': True, 'ancora_negrito': True,
        'secoes_rx': sec, 'pular_secoes': ('Espanhol',), 'pular_antes_sequencia': True,
        'corte': [r'(?i)^REDA[ÇC][ÃA]O$', r'(?i)^TEXTOS DE APOIO$', r'(?i)^FOLHA DE RASCUNHO', r'(?i)^RASCUNHO',
                  r'^(F[ÍI]SICA|BIOLOGIA|MATEM[ÁA]TICA|HIST[ÓO]RIA|GEOGRAFIA|QU[ÍI]MICA|L[ÍI]NGUA PORTUGUESA|LITERATURA( BRASILEIRA)?)$',
                  r'^(F[íi]sica|Biologia|Matem[áa]tica|Hist[óo]ria|Geografia|Qu[íi]mica|L[íi]ngua Portuguesa( e Literatura( Brasileira)?)?|Literatura( Brasileira)?)$'],
        'suporte': [r'(?i)(responda|responder)\b.*\bquest[õo]es', r'(?i)^textos? para as quest', r'(?i)^(leia|read) .*\bquest[õo]es',
                    r'(?i)^Leia (o|a|os|as)\b.*(para responder|e responda)', r'(?i)^Textos? para responder'],
        'gabarito': gab, 'area_do_gabarito': True, 'area': lambda n: nomes[(n - 1) // 5],
    }


for _a, _s in ((2022, 2), (2024, 2), (2025, 2), (2026, 2)):
    PROVAS[f'unitins-{_a}-{_s}'] = unitins(_a, _s)
PROVAS['unitins-2023-2'] = unitins(2023, 2, ('Física', 'Matemática', 'Química', 'Biologia', 'História', 'Geografia'))


# ------------------------------------------------------------------------------------------------------ UVA
def uva(ano, sem, total, bloco):
    """UVA (Universidade Estadual Vale do Acaraú, Sobral), {ano}.{sem}: prova objetiva A–D em uma coluna, "11. Read..."
    (número com ponto no começo da linha). 2024.1: Prova de Conhecimentos Gerais (60 questões; as provas específicas
    por curso ficam fora); desde 2025.1: prova objetiva única (56 questões). Caderno da versão inglês. Gabarito
    definitivo do Sistema UVA, em grade; N = nula."""
    def gab(pasta):
        txt = texto_pdf(pasta / 'gabarito.pdf')
        txt = txt[txt.index(bloco):]
        txt = re.split(r'\n\s*(BIOLOGIA E|GEOGRAFIA E|L\. PORTUGUESA|MATEM[ÁA]TICA E|P[áa]gina \d)', txt)[0]
        ls = [l.split() for l in txt.splitlines()[1:] if l.strip()]
        g = {}
        for a, b in zip(ls, ls[1:]):
            if a and all(x.isdigit() for x in a) and len(a) == len(b) and all(re.fullmatch(r'[A-DN]', x) for x in b):
                for n, v in zip(a, b):
                    g[int(n)] = v if v != 'N' else 'X'
        return g

    return {
        'catalogo': 'uva', 'escola': 'UVA', 'ano': str(ano), 'fase': f'{ano}.{sem}', 'titulo': f'UVA {ano}.{sem}', 'banca': 'CCV-UVA',
        'duracao_horas': 4, 'total': total, 'alternativas': 4,
        'nota': f'Universidade Estadual Vale do Acaraú (Sobral, CE), seleção {ano}.{sem}: '
                + ('Prova de Conhecimentos Gerais (60 questões A–D; as provas de conhecimentos específicos de cada curso ficam fora). '
                   if total == 60 else 'prova objetiva (56 questões A–D). ')
                + 'Língua estrangeira: inglês. Redação fora. Gabarito definitivo publicado pelo Sistema UVA; questão nula fica fora.',
        'cadernos': [{'arquivo': 'caderno', 'paginas': (1, 999)}],
        'colunas': lambda r: [(40, r.width - 30)], 'margem': 40, 'topo': 40, 'base': 45, 'cabecalho_imagem': r'UVA',   # logotipos no alto de algumas páginas
        'ancora': r'^(\d{1,2})\.(\s|$)', 'ancora_dx': 30, 'sequencial': True, 'suporte_secao': True,
        'secoes_rx': [(r'^L[ÍI]NGUA PORTUGUESA$', 'Língua Portuguesa'), (r'^L[ÍI]NGUA INGLESA$', 'Inglês'), (r'^L[ÍI]NGUA ESPANHOLA$', 'Espanhol'),
                      (r'^HIST[ÓO]RIA$', 'História'), (r'^GEOGRAFIA$', 'Geografia'), (r'^MATEM[ÁA]TICA$', 'Matemática'),
                      (r'^F[ÍI]SICA$', 'Física'), (r'^QU[ÍI]MICA$', 'Química'), (r'^BIOLOGIA$', 'Biologia'), (r'^FILOSOFIA$', 'Filosofia'),
                      (r'^SOCIOLOGIA$', 'Sociologia')],
        'pular_secoes': ('Espanhol',), 'pular_antes_sequencia': True,
        'corte': [r'(?i)^RASCUNHO', r'(?i)^REDA[ÇC][ÃA]O$', r'(?i)^PROPOSTA DE REDA', r'(?i)^TABELA PERI', r'(?i)^CLASSIFICA[ÇC][ÃA]O PERI'],
        # "Texto" (linha própria) no início da prova de Português: vale para as questões da seção
        'suporte': [r'(?i)(responda|responder)\b.*\bquest[õo]es\s+\d', r'(?i)^textos? para as quest', r'(?i)answer questions\s+\d', r'^(Texto|TEXTO)$'],
        'gabarito': gab, 'area': lambda n: 'Conhecimentos gerais',
    }


PROVAS['uva-2024-1'] = uva(2024, 1, 60, 'LINGUA ESTRANGEIRA-INGLÊS')
PROVAS['uva-2025-1'] = uva(2025, 1, 56, 'LINGUA ESTRANGEIRA-INGLÊS')
PROVAS['uva-2026-1'] = uva(2026, 1, 56, 'LINGUA ESTRANGEIRA-INGLÊS')
PROVAS['uva-2026-1']['cadernos'] = [{'arquivo': 'caderno', 'paginas': (2, 999)}]   # pág. 1: instruções numeradas "1."
PROVAS['uva-2024-1'].pop('cabecalho_imagem')   # 2024.1: a caixa da imagem do cabeçalho encosta no texto (y 90); o texto começa em 85
PROVAS['uva-2024-1']['topo'] = 82


# --------------------------------------------------------------------------------------------------- PUC-Rio
def gab_destacado(pasta, cfg, pares_arq, letras='ABCDE', cor=None, rx_letra=r'\(([A-E])\)', carimbo=None):
    """Gabarito oficial publicado como o próprio caderno com a alternativa certa destacada em amarelo (PUC-Rio "com
    gabarito"): o caderno destacado é recortado com a mesma configuração e, em cada questão, a letra "(X)" que fica
    dentro do destaque é a resposta. pares_arq: [(índice do caderno em cfg['cadernos'], arquivo destacado)]."""
    import pymupdf
    import recorta
    amarelo = cor or (lambda c: c and len(c) == 3 and c[0] > 0.9 and c[1] > 0.8 and c[2] < 0.35)
    g = {}
    for ic, arq in pares_arq:
        cad = cfg['cadernos'][ic]
        pdf = pymupdf.open(pasta / (arq + '.pdf'))
        recorta._cache_linhas.clear(); recorta._cache_cols.clear(); recorta._cache_faixas.clear()
        cfg['_arquivo'] = arq
        ev = recorta.eventos_do_pdf(pdf, cfg, cad.get('paginas'))
        ok, pula, ult = [], False, 0
        for e in ev:   # mesma filtragem do recorte: seção pulada (espanhol) e sequência
            if e['tipo'] == 'secao':
                pula = e['nome'] in cfg.get('pular_secoes', ())
                ok.append(e)
                continue
            if pula:
                continue
            if e['tipo'] == 'q':
                if e['n'] != ult + 1:
                    continue
                ult = e['n']
            ok.append(e)
        ev = ok
        dest = {}
        for pg in pdf:
            # destaque = retângulo amarelo preenchido ou traço amarelo grosso (a caixa do traço tem altura zero)
            dest[pg.number] = [pymupdf.Rect(d['rect']) + (0, -(d.get('width') or 0) / 2, 0, (d.get('width') or 0) / 2)
                               for d in pg.get_drawings() if amarelo(d.get('fill')) or amarelo(d.get('color'))]
        for i, e in enumerate(ev):
            if e['tipo'] != 'q':
                continue
            achadas, anulada = set(), False
            for p, r in recorta.segmentos(pdf, cfg, ev, i, cad.get('paginas')):
                if re.search(r'QUEST[ÃA]O\s+ANULADA', pdf[p].get_textbox(r)):
                    anulada = True   # aviso "QUESTÃO ANULADA" impresso no caderno com gabarito
                if carimbo and any(carimbo(d.get('fill')) and pymupdf.Rect(d['rect']).intersects(r) for d in pdf[p].get_drawings()):
                    anulada = True   # carimbo "QUESTÃO ANULADA" desenhado (sem camada de texto), em vermelho
                for dr in dest.get(p, []):
                    if not dr.intersects(r):
                        continue
                    # a letra "(X)" no começo do destaque; havendo duas linhas tocadas, vale a mais central
                    cand = []
                    for w in pdf[p].get_text('words'):
                        cx, cy = (w[0] + w[2]) / 2, (w[1] + w[3]) / 2
                        m_ = re.fullmatch(rx_letra, w[4])
                        if m_ and dr.x0 - 6 <= w[0] <= dr.x0 + 12 and dr.y0 - 2 <= cy <= dr.y1 + 2 and r.contains(pymupdf.Point(cx, cy)):
                            cand.append((abs(cy - (dr.y0 + dr.y1) / 2), m_.group(1)))
                    if not cand:
                        # destaque só sobre o conteúdo da alternativa (fração, fórmula): a letra fica logo à esquerda
                        for w in pdf[p].get_text('words'):
                            cy = (w[1] + w[3]) / 2
                            m_ = re.fullmatch(rx_letra, w[4])
                            if m_ and w[2] <= dr.x0 + 4 and dr.x0 - w[2] < 60 and dr.y0 - 3 <= cy <= dr.y1 + 3 \
                                    and r.contains(pymupdf.Point((w[0] + w[2]) / 2, cy)):
                                cand.append((dr.x0 - w[2], m_.group(1)))
                    if cand:
                        achadas.add(min(cand)[1])
            if anulada:
                achadas = {'X', 'Y'}
            n = e['n'] + cad.get('deslocamento', 0)
            if len(achadas) == 1:
                g[n] = achadas.pop()
            elif len(achadas) > 1:
                g[n] = 'X'   # mais de uma letra destacada (as duas aceitas): fora, como anulada
    return g


def pucrio(ano, n2=50, grupo=4):
    """PUC-Rio, Vestibular {ano} (provas em outubro do ano anterior), grupo {grupo}: objetivas A–E de língua estrangeira
    (1º dia, 10 questões; aqui o inglês) e de Matemática, Ciências da Natureza e Ciências Humanas (2º dia, 50 questões;
    aqui 11–60). As discursivas e a redação ficam fora. Gabarito: o caderno oficial "com gabarito" (resposta destacada).
    d1/d2: (caderno, caderno com gabarito) de cada dia, já baixados como d1-caderno etc."""
    cfg = {
        'catalogo': 'pucrio', 'escola': 'PUC-Rio', 'ano': str(ano), 'fase': f'Grupo {grupo}', 'titulo': f'PUC-Rio {ano}', 'banca': 'PUC-Rio',
        'duracao_horas': 4, 'total': 10 + n2,
        'nota': f'Pontifícia Universidade Católica do Rio de Janeiro, Vestibular {ano}, grupo {grupo}: questões objetivas A–E de '
                'língua estrangeira (1º dia; inglês, 1–10) e ' + ('de Matemática, Ciências da Natureza e Ciências Humanas' if n2 == 50
                else 'de Ciências da Natureza e Ciências Humanas') + f' (2º dia; aqui 11–{10 + n2}). Discursivas (inclusive a de '
                'Matemática, quando houver) e redação fora. Gabarito: caderno oficial "com gabarito" da PUC-Rio.',
        'cadernos': [{'arquivo': 'd1-caderno', 'paginas': (2, 999), 'questoes': (1, 10)},
                     {'arquivo': 'd2-caderno', 'paginas': (2, 999), 'questoes': (11, 10 + n2), 'deslocamento': 10}],
        'colunas': 'faixas', 'faixas_modo': 'largas', 'divisa': 298, 'margem': 22, 'topo': 64, 'base': 62, 'largas_alternativas': True,
        'ancora': r'^(\d{1,2})$', 'ancora_dx': 18, 'sequencial': True, 'ancora_negrito': True, 'ancora_isolada': True,
        'secoes_rx': [(r'^L[ÍI]NGUA ESTRANGEIRA\s*[-–]\s*INGL[ÊE]S$', 'Inglês'), (r'^L[ÍI]NGUA ESTRANGEIRA\s*[-–]\s*(ESPANHOL|FRANC[ÊE]S)$', 'Espanhol'),
                      (r'^MATEM[ÁA]TICA$', 'Matemática'), (r'^CI[ÊE]NCIAS DA NATUREZA$', 'Ciências da Natureza'),
                      (r'^CI[ÊE]NCIAS HUMANAS$', 'Ciências Humanas')],
        'pular_secoes': ('Espanhol',), 'pular_antes_sequencia': True,
        'corte': [r'^RASCUNHO$', r'(?i)^PROVA DISCURSIVA', r'(?i)^REDA[ÇC][ÃA]O$', r'(?i)^TABELA PERI', r'(?i)^CLASSIFICA[ÇC][ÃA]O PERI'],
        'suporte': [r'(?i)(responda|responder)\b.*\bquest[õo]es', r'(?i)^textos? para as quest', r'(?i)answer questions'],
        'area': lambda n: 'Inglês' if n <= 10 else 'Conhecimentos gerais',
    }
    cfg['gabarito'] = lambda pasta: gab_destacado(pasta, cfg, [(0, 'd1-gabarito'), (1, 'd2-gabarito')])
    return cfg


PROVAS['pucrio-2026'] = pucrio(2026)
PROVAS['pucrio-2027'] = pucrio(2027)
PROVAS['pucrio-2025'] = pucrio(2025, 45)
PROVAS['pucrio-2024'] = pucrio(2024, 45)
# o texto de inglês (sem frase de indicação) vem logo abaixo do título da seção e vale para as questões 1 a 10
PROVAS['pucrio-2026']['suporte_forcado'] = {('d1-caderno', 2): [(94, 0, (1, 10))]}
PROVAS['pucrio-2027']['suporte_forcado'] = {('d1-caderno', 2): [(94, 0, (1, 10))]}
PROVAS['pucrio-2025']['suporte_forcado'] = {('d1-caderno', 2): [(94, 0, (1, 10))]}
PROVAS['pucrio-2024']['suporte_forcado'] = {('d1-caderno', 2): [(94, 0, (1, 10))]}


# ---------------------------------------------------------------------------------------------------- PUCPR
_PUCPR_SEC = [(r'^L[ÍI]NGUA PORTUGUESA$', 'Língua Portuguesa'), (r'^LITERATURA( BRASILEIRA)?$', 'Literatura'), (r'^BIOLOGIA$', 'Biologia'),
              (r'^QU[ÍI]MICA$', 'Química'), (r'^MATEM[ÁA]TICA$', 'Matemática'), (r'^F[ÍI]SICA$', 'Física'), (r'^HIST[ÓO]RIA$', 'História'),
              (r'^GEOGRAFIA$', 'Geografia'), (r'^FILOSOFIA$', 'Filosofia'), (r'^SOCIOLOGIA$', 'Sociologia'),
              (r'^L[ÍI]NGUA INGLESA$', 'Inglês'), (r'^L[ÍI]NGUA ESPANHOLA$', 'Espanhol')]


def pucpr(ano, sem, rotulo):
    """PUCPR, Processo Seletivo de Medicina {ano}/{sem} ({rotulo}), prova 1 branca: 60 questões A–E em uma coluna,
    "6. As citações..." (número com ponto, em negrito), matérias em seções. A PUCPR publica como gabarito definitivo o
    próprio caderno com a alternativa certa marcada em ciano: o gabarito é lido desse destaque (gab_destacado) e, no
    print, o fundo ciano vira branco (neutralizar_cores)."""
    cfg = {
        'catalogo': 'pucpr', 'escola': 'PUCPR', 'ano': str(ano), 'fase': f'Medicina {ano}/{sem}', 'titulo': f'PUCPR Medicina {ano}/{sem}',
        'banca': 'PUCPR', 'duracao_horas': 5, 'total': 60,
        'nota': f'Pontifícia Universidade Católica do Paraná, Processo Seletivo de Medicina {ano}/{sem} ({rotulo}), prova 1 (branca): '
                '60 questões A–E. Língua estrangeira: inglês. Redação fora. Gabarito definitivo: o caderno oficial com a alternativa '
                'certa destacada (o destaque é apagado no print). Questão com carimbo de anulação ou de troca de gabarito '
                'fica fora (o carimbo cobre parte do enunciado).',
        'cadernos': [{'arquivo': 'caderno-gabarito', 'paginas': (2, 999)}],
        'colunas': lambda r: [(22, r.width - 20)], 'margem': 22, 'topo': 56, 'base': 20, 'rodape_rx': r'^VESTIBULAR DE (VER[ÃA]O|INVERNO)',
        'ancora': r'^(\d{1,2})\.(\s|$)', 'ancora_dx': 12, 'sequencial': True,
        'secoes_rx': _PUCPR_SEC, 'pular_secoes': ('Espanhol',), 'pular_antes_sequencia': True,
        'corte': [r'(?i)^REDA[ÇC][ÃA]O$', r'(?i)^F[ÓO]RMULAS E CONSTANTES', r'(?i)^TABELA PERI', r'(?i)^CLASSIFICA[ÇC][ÃA]O PERI', r'(?i)^RASCUNHO'],
        'suporte': [r'(?i)(responda|responder)\b.*\bquest[õo]es\s+\d', r'(?i)^textos? para as quest', r'(?i)refer[êe]ncia para as quest[õo]es\s+\d'],
        'neutralizar_cores': (0x00ffff, 0xffff00),
        'area': lambda n: 'Conhecimentos gerais',
    }
    ciano = lambda c: c and len(c) == 3 and ((c[0] < 0.2 and c[1] > 0.85 and c[2] > 0.85) or (c[0] > 0.9 and c[1] > 0.9 and c[2] < 0.2))   # ciano ou amarelo
    cfg['gabarito'] = lambda pasta: gab_destacado(pasta, cfg, [(0, 'caderno-gabarito')], cor=ciano, rx_letra=r'^([A-E])\)?$',
                                                     carimbo=lambda c: c and len(c) == 3 and c[0] > 0.9 and c[1] < 0.15 and c[2] < 0.15)
    return cfg


for _a, _s, _r in ((2024, 2, 'Vestibular de Inverno 2024'), (2025, 1, 'Vestibular de Verão 2024'), (2025, 2, 'Vestibular de Inverno 2025'),
                   (2026, 1, 'Vestibular de Verão 2025'), (2026, 2, 'Vestibular de Inverno 2026')):
    PROVAS[f'pucpr-{_a}-{_s}'] = pucpr(_a, _s, _r)


# ------------------------------------------------------------------------------------------------ PUC Minas
def pucminas(ano, sem):
    """PUC Minas, Vestibular {ano}/{sem}, caderno de Medicina (Betim, Contagem e Poços de Caldas): 50 questões A–D em uma
    coluna, "QUESTÃO 19" em negrito: Língua Portuguesa 1–15, Biologia, Química, Física e Matemática até a 45, língua
    estrangeira 46–50 (espanhol ou inglês). O gabarito oficial traz uma só coluna para 46–50, sem dizer de qual língua:
    as questões de língua ficam fora."""
    def gab(pasta):
        txt = texto_pdf(pasta / 'gabarito.pdf')
        txt = re.split(r'DEMAIS CURSOS|DIREITO|\n\s*VESTIBULAR PUC MINAS\s*\n(?=.*\n.*(?!MEDICINA))', txt)[0]
        g = {}
        for n, v in re.findall(r'(?<![\d,.])(\d{2})\s+([A-D])(?=\s|$)', txt):
            if int(n) <= 45:
                g.setdefault(int(n), v)
        return g

    return {
        'catalogo': 'pucminas', 'escola': 'PUC Minas', 'ano': str(ano), 'fase': f'Medicina {ano}/{sem}', 'titulo': f'PUC Minas Medicina {ano}/{sem}',
        'banca': 'PUC Minas', 'duracao_horas': 4.5, 'total': 45, 'alternativas': 4,
        'nota': f'Pontifícia Universidade Católica de Minas Gerais, Vestibular {ano}/{sem}, caderno de Medicina: questões 1–45 '
                '(Língua Portuguesa, Biologia, Química, Física e Matemática), A–D. As de língua estrangeira (46–50) ficam fora: '
                'o gabarito oficial não diz se a coluna 46–50 é a do inglês ou a do espanhol. Redação fora.',
        'cadernos': [{'arquivo': 'caderno', 'paginas': (3, 999)}],
        'colunas': lambda r: [(50, r.width - 40)], 'margem': 50, 'topo': 50, 'base': 30,
        'ancora': r'^QUEST[ÃA]O\s+(\d{1,2})$', 'ancora_dx': 20, 'sequencial': True, 'ancora_negrito': True,
        'secoes_rx': [(r'^PROVA DE L[ÍI]NGUA PORTUGUESA$', 'Língua Portuguesa'), (r'^PROVA DE BIOLOGIA$', 'Biologia'),
                      (r'^PROVA DE QU[ÍI]MICA$', 'Química'), (r'^PROVA DE F[ÍI]SICA$', 'Física'), (r'^PROVA DE MATEM[ÁA]TICA$', 'Matemática'),
                      (r'^PROVA DE (ESPANHOL|INGL[ÊE]S)$', 'Língua estrangeira')],
        'pular_secoes': ('Língua estrangeira',), 'pular_antes_sequencia': True,
        'corte': [r'(?i)^PRODU[ÇC][ÃA]O DE TEXTO', r'(?i)^PROPOSTA DE REDA', r'(?i)^RASCUNHO', r'(?i)^TABELA PERI', r'(?i)^VESTIBULAR PUC MINAS$'],
        'suporte': [r'(?i)(responda|responder)\b.*\bquest[õo]es', r'(?i)^(o |os )?textos? (a seguir |abaixo )?(é |são )?(para|refere-se|referem-se|base)'
                    , r'(?i)^INSTRU[ÇC][ÃA]O:'],
        'corte_espacado': ('PRODUÇÃO', 'RASCUNHO'),
        'gabarito': gab, 'area': lambda n: 'Conhecimentos gerais',
    }


for _a, _s in ((2024, 1), (2025, 1), (2026, 1), (2027, 1)):
    PROVAS[f'pucminas-{_a}-{_s}'] = pucminas(_a, _s)


# ------------------------------------------------------------------------------------------------ Mackenzie
def mackenzie(ano, sem, rotulo, tipo='A'):
    """Universidade Presbiteriana Mackenzie, Vestibular {ano}/{sem} ({rotulo}): questões objetivas A–E em uma coluna,
    "Questão nº 03" em negrito; Português, Inglês, Física, Química, Matemática, Biologia, História e Geografia.
    Gabarito oficial em grade por matéria (linha de números e linha de letras)."""
    def gab(pasta):
        ls = [l.split() for l in texto_pdf(pasta / 'gabarito.pdf').splitlines() if l.strip()]
        g = {}
        for a, b in zip(ls, ls[1:]):
            if a and all(x.isdigit() for x in a) and len(a) == len(b) and all(re.fullmatch(r'[A-E]|\*|ANULADA|X', x) for x in b):
                for n, v in zip(a, b):
                    g[int(n)] = v if v in 'ABCDE' else 'X'
        return g

    secs = [(r'^PORTUGU[ÊE]S$', 'Língua Portuguesa'), (r'^INGL[ÊE]S$', 'Inglês'), (r'^F[ÍI]SICA$', 'Física'), (r'^QU[ÍI]MICA$', 'Química'),
            (r'^MATEM[ÁA]TICA$', 'Matemática'), (r'^BIOLOGIA$', 'Biologia'), (r'^HIST[ÓO]RIA$', 'História'), (r'^GEOGRAFIA$', 'Geografia')]
    cfg = {
        'catalogo': 'mackenzie', 'escola': 'Mackenzie', 'ano': str(ano), 'fase': f'{ano}/{sem}', 'titulo': f'Mackenzie {ano}/{sem}' + (' Medicina' if 'Medicina' in rotulo else ''),
        'banca': 'Mackenzie', 'duracao_horas': 4.5,
        'nota': f'Universidade Presbiteriana Mackenzie, Vestibular {ano} – {sem}º semestre ({rotulo}): questões objetivas A–E. '
                'Redação fora. Gabarito oficial publicado pelo Mackenzie; anulada fica fora.',
        'cadernos': [{'arquivo': 'caderno', 'paginas': (2, 999)}],
        'colunas': lambda r: [(36, r.width - 30)], 'margem': 36, 'topo': 30, 'base': 46,
        'ancora': r'^Quest[ãa]o\s+n[ºo°]\s*(\d{1,2})$', 'ancora_dx': 20, 'sequencial': True, 'ancora_negrito': True,
        'secoes_rx': secs,
        'corte': [r'(?i)^RASCUNHO', r'(?i)^PROPOSTA DE REDA', r'(?i)^REDA[ÇC][ÃA]O$', r'(?i)^TABELA PERI', r'(?i)^CLASSIFICA[ÇC][ÃA]O PERI'],
        'suporte': [r'(?i)^textos? para as quest', r'(?i)(responda|responder)\b.*\bquest[õo]es', r'(?i)^Text(s)? for questions',
                    r'(?i)enable you to answer questions', r'(?i)answer questions\s+\d'],
        'gabarito': gab, 'area': lambda n: 'Conhecimentos gerais',
    }
    cfg['total_de'] = lambda pasta: max(gab(pasta))
    return cfg


PROVAS['mackenzie-2022-2'] = mackenzie(2022, 2, 'Alphaville e Higienópolis, 21/06/2022, prova tipo A')
PROVAS['mackenzie-2026-1'] = mackenzie(2026, 1, 'Higienópolis, 27/11/2025')
PROVAS['mackenzie-2026-2'] = mackenzie(2026, 2, '11/06/2026, prova A')
PROVAS['mackenzie-2027-1'] = mackenzie(2027, 1, 'Medicina, Alphaville, 21/10/2026')
PROVAS['mackenzie-2027-1']['ultima_continua'] = True   # a questão 60 continua na última página (52), conferido no caderno


# ------------------------------------------------------------------------------------------------------ Fempar
def fempar(ano, bloco, data):
    """Fempar (Faculdade Evangélica Mackenzie do Paraná), Processo Seletivo de Medicina {ano} (banca FGV), caderno tipo 1
    (branco): 80 questões A–E em duas colunas, número em negrito em linha própria; língua estrangeira 16–25 (inglês ou
    espanhol, com a mesma numeração: vale o inglês). Gabarito definitivo do tipo 1 na opção inglês."""
    def gab(pasta):
        txt = texto_pdf(pasta / 'gabarito.pdf')
        txt = txt[txt.index(bloco):]
        txt = re.split(r'\n.*(TIPO|Tipo)\s+2', txt)[0]
        ls = [l.split() for l in txt.splitlines()[1:] if l.strip()]
        g = {}
        for a, b in zip(ls, ls[1:]):
            if a and all(x.isdigit() for x in a) and len(a) == len(b) and all(re.fullmatch(r'[A-E]|\*', x) for x in b):
                for n, v in zip(a, b):
                    g[int(n)] = v if v != '*' else 'X'
        return g

    secs = [(r'^L[íi]ngua Portuguesa$', 'Língua Portuguesa'), (r'^L[íi]ngua (Inglesa|Estrangeira \(Ingl[êe]s\))$', 'Inglês'),
            (r'^L[íi]ngua (Espanhola|Estrangeira \(Espanhol\))$', 'Espanhol'),
            (r'(?i)^CI[ÊE]NCIAS HUMANAS', 'Ciências Humanas'), (r'(?i)^CI[ÊE]NCIAS DA NATUREZA', 'Ciências da Natureza'),
            (r'(?i)^MATEM[ÁA]TICA E SUAS', 'Matemática'), (r'^(Hist[óo]ria|Geografia|Filosofia|Sociologia|Biologia|Qu[íi]mica|F[íi]sica|Matem[áa]tica)$', 'Conhecimentos gerais')]
    return {
        'catalogo': 'fempar', 'escola': 'Fempar', 'ano': str(ano), 'fase': f'Medicina {ano}', 'titulo': f'Fempar Medicina {ano}',
        'banca': 'FGV', 'duracao_horas': 5, 'total': 80,
        'nota': f'Faculdade Evangélica Mackenzie do Paraná, Processo Seletivo do Curso de Medicina {ano} (prova de {data}, banca FGV), '
                'caderno tipo 1: 80 questões A–E. Língua estrangeira: inglês (16–25). Redação fora. Gabarito definitivo; anulada fica fora.',
        'cadernos': [{'arquivo': 'caderno', 'paginas': (3, 999)}],
        'colunas': lambda r: [(36, 300), (300, r.width - 30)], 'margem': 36, 'topo': 52, 'base': 50,
        'ancora': r'^(\d{1,2})$', 'ancora_dx': 14, 'sequencial': True, 'ancora_negrito': True, 'ancora_isolada': True,
        'secoes_rx': secs, 'pular_secoes': ('Espanhol',), 'pular_antes_sequencia': True,
        'corte': [r'(?i)^RASCUNHO', r'(?i)^REDA[ÇC][ÃA]O$', r'(?i)^PROPOSTA DE REDA', r'(?i)^TABELA PERI', r'(?i)^CLASSIFICA[ÇC][ÃA]O PERI',
                  r'(?i)^TECNOLOGIAS$'],
        'suporte': [r'(?i)^Read Text', r'(?i)^Read the (text|fragment)', r'(?i)(responda|responder)\b.*\bquest[õo]es', r'(?i)^textos? para as quest',
                    r'(?i)^Leia o texto [IVX]+ ', r'^(TEXTO|Texto)\s+[IVX]+$'],
        'suporte_secao': True,   # o texto vale até o próximo texto, corte ou seção ("answer the next five questions")
        'gabarito': gab, 'area': lambda n: 'Inglês' if 16 <= n <= 25 else 'Conhecimentos gerais',
    }


PROVAS['fempar-2021'] = fempar(2021, 'Tipo 1 (Língua Estrangeira: Inglesa)', '20/02/2021')
PROVAS['fempar-2026'] = fempar(2026, 'Medicina (I) - TIPO 1', '28/09/2025')
PROVAS['acafe-2021-verao']['ancora_forcada'] = {('caderno', 20): [(32, 341, 0)]}   # "32 A Energia..." sem o ")"
PROVAS['acafe-2023-verao']['suporte_interno'] = 60   # "02) Leia o texto a seguir." / "05) Leia os textos a seguir.": os textos são da questão


# FCM-MG 2021/2 a 2023/2 (rodada 6): mesmo layout das edições recentes; gabarito definitivo por matéria
for _a, _s in ((2021, 2), (2022, 1), (2023, 1), (2023, 2)):
    _c = cmmg(_a, _s)
    _c['total_de'] = (lambda c: (lambda pasta: max(c['gabarito'](pasta))))(_c)
    PROVAS[f'cmmg-{_a}-{_s}'] = _c
for _a, _s in ((2021, 2), (2022, 1), (2023, 1)):
    # margem esquerda larga (x≈64–86) e número colado ao enunciado ("01.Assinale")
    PROVAS[f'cmmg-{_a}-{_s}'].update({'colunas': lambda r: [(56, r.width - 40)], 'ancora_dx': 34,
                                      'ancora': r'^0?(\d{1,2})\s?[.,](\s|$|(?=[A-ZÁÉÍÓÚ“"]))'})

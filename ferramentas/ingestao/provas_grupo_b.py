"""Provas do grupo B (IME, Mackenzie, UEA, UFRR, UFT, Unitins, UNIRG) integradas em 11/11/2026.

Cadernos e gabaritos oficiais; quando o arquivo veio da página de downloads do Brasil Escola (links do dono, ver
`fontes/provas-manuais/manifesto.json`), a origem fica em `origem` (vai para o prova.json) e o link em `fontes`.
Só múltipla escolha; anuladas e questões sem gabarito definitivo ficam fora.
"""
import re

import provas as _p   # módulo parcialmente carregado: as funções de cada instituição já existem quando isto roda

def _gab_unitins(pagina=None):
    """Gabarito definitivo da Unitins em qualquer um dos formatos: linhas "Questão"/"Gabarito" por matéria (2024+) ou
    grade "01 B 06 C ..." (até 2023; na língua, "46 A E" = inglês, espanhol: vale a 1ª). "*E"/"D*" = gabarito
    alterado (vale a letra); "Anul."/"ANULADA" = anulada. pagina: só aquela página do PDF (2024/1: p. 1 = caderno 1)."""
    def gab(pasta):
        if pagina is None:
            txt = _p.texto_pdf(pasta / 'gabarito.pdf')
        else:
            import pymupdf
            import subprocess
            txt = subprocess.run(['pdftotext', '-layout', '-f', str(pagina), '-l', str(pagina), str(pasta / 'gabarito.pdf'), '-'],
                                 capture_output=True, text=True, check=True).stdout
        txt = re.split(r'(?m)^\s*Espanhol\s*$', txt)[0]
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
            for n, v in re.findall(r'(?<![\d,./])(\d{1,2})\s+(\*?[A-E]\b|Anul\.?|ANULADA)', txt):
                v = v.lstrip('*')
                g.setdefault(int(n), v if v in 'ABCDE' else 'X')
        assert sorted(g) == list(range(1, 51)), sorted(g)
        return g
    return gab


def _gab_grade(txt, letras='ABCDE'):
    """Grade "linha de números / linha de letras" (UFT/Copese): para cada linha de números, a próxima linha (até 3
    abaixo) com o mesmo número de letras/Anulada. Repetição do número (língua: inglês antes do espanhol) = vale a 1ª."""
    g = {}
    ls = [l for l in txt.splitlines() if l.strip()]
    for i, a in enumerate(ls):
        ns = [int(x) for x in re.findall(r'(?<![\d/,.-])(\d{1,2})(?![\d/,.-])', a)]
        if len(ns) < 2 or re.search(rf'(?<![\w(])[{letras}](?![\w)])', a):
            continue
        for b in ls[i + 1:i + 4]:
            vs = re.findall(rf'(?<![\w(])(?:[{letras}]|Anulada|ANULADA)(?![\w)])', b)
            if len(vs) == len(ns):
                for n, v in zip(ns, vs):
                    g.setdefault(n, v if v in letras else 'X')
                break
    return g


BE = 'cópia do arquivo oficial baixada da página de downloads do Brasil Escola (vestibular.brasilescola.uol.com.br), link do dono'


def mais_provas():
    P = {}
    # ------------------------------------------------------------------------------------------- Mackenzie
    # 2º semestre de 2026, 2ª aplicação (15/07/2026; a de 11/06/2026 já é a mackenzie-2026-2)
    P['mackenzie-2026-3'] = _p.mackenzie(2026, 2, '15/07/2026, Vestibular Mackenzie 2.0')
    P['mackenzie-2026-3'].update({'titulo': 'Mackenzie 2026/2 – julho', 'fase': '2026/2 – 15/07', 'base': 42})
    # "Read the text below and answer question 11, 12 and 13" (singular)
    P['mackenzie-2026-3']['suporte'] = P['mackenzie-2026-3']['suporte'] + [r'(?i)answer questions?\s+\d']
    P['mackenzie-2026-3']['suporte_ponto_final'] = True
    P['mackenzie-2026-3']['ultima_continua'] = True   # a questão 60 continua na última página
    P['mackenzie-2026-3']['ancora_folga'] = 3   # "Taken from..." (q14/15): a caixa da linha desce até 2 pt abaixo do topo da âncora
    # ------------------------------------------------------------------------------------------- Unitins
    # Vestibular "todos os câmpus" (caderno 1 e caderno 2, por grupo de cursos), Medicina e Geral: mesma estrutura do
    # presencial (50 A–E; língua 46–50, vale o inglês). unitins-2025-1 (caderno 1) já está no site.
    def unitins(pid, ano, sem, rotulo, cad=None, pagina=None):
        c = _p.unitins(ano, sem)
        tit = f'Unitins {ano}/{sem}' + (f' – {rotulo}' if rotulo else '')
        c.update({'titulo': tit, 'fase': f'Vestibular {ano}/{sem}' + (f' – {rotulo}' if rotulo else ''),
                  'gabarito': _gab_unitins(pagina)})
        c['nota'] = (f'Universidade Estadual do Tocantins, Vestibular {ano}/{sem}' + (f' ({rotulo})' if rotulo else '') +
                     ': 50 questões A–E (Física, Biologia, Matemática, História, Geografia, Química, Língua Portuguesa e '
                     'Literatura Brasileira, língua estrangeira). Língua estrangeira: inglês. Redação fora. Gabarito '
                     'definitivo; anulada fica fora.')
        P[pid] = c
    unitins('unitins-2021-1', 2021, 1, '')
    unitins('unitins-2021-2', 2021, 2, 'Medicina')
    unitins('unitins-2022-1', 2022, 1, '')
    unitins('unitins-2022-1-med', 2022, 1, 'Medicina')
    unitins('unitins-2023-1', 2023, 1, 'Caderno 1')
    unitins('unitins-2023-1-c2', 2023, 1, 'Caderno 2')
    unitins('unitins-2024-1', 2024, 1, 'Caderno 1', pagina=1)
    unitins('unitins-2024-1-c2', 2024, 1, 'Caderno 2', pagina=2)
    unitins('unitins-2025-1-c2', 2025, 1, 'Caderno 2')
    unitins('unitins-2026-1', 2026, 1, 'Caderno 1')
    unitins('unitins-2026-1-c2', 2026, 1, 'Caderno 2')
    # até 2022/1 a instrução "Leia a tirinha ... para responder à questão" vem DEPOIS do número: é da própria questão;
    # só a instrução no plural ("questões 33 e 34") abre texto de apoio
    for k in ('unitins-2021-2', 'unitins-2022-1', 'unitins-2022-1-med'):
        P[k]['suporte'] = [r'(?i)(responda|responder)\b.*\bquest[õo]es\b', r'(?i)^textos? para as quest[õo]es',
                           r'(?i)^(leia|read)\b.*\bquest[õo]es\b', r'(?i)\bpara responder [àa]s\s*$']
    # 2021/1: número da questão no começo da linha do enunciado ("01 - ", "16. ", "22- "), sem negrito
    P['unitins-2021-1'].update({'ancora': r'^(\d{2})\s*[-–.]\s*\S', 'ancora_negrito': False, 'ancora_dx': 40})
    P['unitins-2021-1']['suporte'] = P['unitins-2021-1']['suporte'] + [r'^Leia\b']   # "Leia, a seguir, o soneto...", "Leia o trecho a seguir..."
    for k in ('unitins-2021-2', 'unitins-2022-1-med'):
        P[k].update({'divisa': 290, 'ancora_dx': 40})   # "QUESTÃO 20"/"QUESTÃO 31" numa faixa cinza que começa em x≈292 (coluna direita)

    # ------------------------------------------------------------------------------------------------ UFT
    # Vestibular UFT/UFNT (Copese): prova da manhã (Linguagens 01–16, língua 17–24 — vale o inglês —, Matemática 25–32)
    # e da tarde (Ciências Humanas e da Natureza, 01–44, aqui 33–76). Duas colunas, "QUESTÃO 01" em negrito.
    def uft(pid, ano, sem, nota_extra='', total_manha=32):
        def gab(pasta):
            txt = _p.texto_pdf(pasta / 'gabarito.pdf')
            m, t = re.split(r'PROVA\s+TARDE', txt)
            g = _gab_grade(m)
            g.update({n + total_manha: v for n, v in _gab_grade(t).items()})
            assert sorted(g) == list(range(1, total_manha + 45)), sorted(g)
            return g
        secs = [(r'^PROVA DE (L[ÍI]NGUA INGLESA|INGL[ÊE]S)', 'Inglês'), (r'^PROVA DE (L[ÍI]NGUA ESPANHOLA|ESPANHOL)', 'Espanhol'),
                (r'^(PROVA DE )?LINGUAGENS,', 'Linguagens'), (r'^(PROVA DE )?MATEM[ÁA]TICA E SUAS', 'Matemática'),
                (r'^(PROVA DE )?CI[ÊE]NCIAS HUMANAS', 'Ciências Humanas'), (r'^(PROVA DE )?CI[ÊE]NCIAS DA NATUREZA', 'Ciências da Natureza')]
        P[pid] = {
            'catalogo': 'uft', 'escola': 'UFT', 'ano': str(ano), 'fase': f'Vestibular {ano}/{sem}', 'titulo': f'UFT {ano}/{sem}',
            'banca': 'Copese/UFT', 'duracao_horas': 9, 'total': total_manha + 44,
            'nota': f'Universidade Federal do Tocantins (com a UFNT), Vestibular {ano}.{sem} (Copese): prova da manhã '
                    '(Linguagens, língua estrangeira e Matemática, 32 questões) e da tarde (Ciências Humanas e da Natureza, '
                    '44 questões, aqui 33–76), A–D. Língua estrangeira: inglês. Redação fora. Gabarito definitivo; anulada '
                    'fica fora.' + nota_extra,
            'alternativas': 4,
            'cadernos': [{'arquivo': 'manha', 'paginas': (2, 999), 'questoes': (1, total_manha), 'rotulo': 'manhã'},
                         {'arquivo': 'tarde', 'paginas': (2, 999), 'questoes': (total_manha + 1, total_manha + 44),
                          'deslocamento': total_manha, 'rotulo': 'tarde'}],
            'colunas': lambda r: [(24, 298), (298, r.width - 20)], 'margem': 24, 'topo': 42, 'base': 30,
            'ancora': r'(?i)^(?:QUEST[ÃA]O|QUESTION|PREGUNTA|CUESTI[ÓO]N)\s+(\d{1,2})$', 'ancora_dx': 14,
            'ancora_negrito': True, 'sequencial': True,
            'secoes_rx': secs, 'pular_secoes': ('Espanhol',), 'pular_antes_sequencia': True,
            'corte': [r'(?i)^PROPOSTA DE REDA', r'(?i)^REDA[ÇC][ÃA]O$', r'(?i)^PROVA DE REDA', r'(?i)^INSTRU[ÇC][ÕO]ES PARA A REDA',
                      r'(?i)^RASCUNHO', r'(?i)^Aten[çc][ãa]o: Responda apenas'],
            'suporte': [r'(?i)(responda|responder)\b.*\bquest', r'(?i)\bpara responder( [àa]s?)?\s*$', r'(?i)\bin order to answer\b',
                        r'(?i)\bto answer\s+(the\s+)?questions?\b', r'(?i)^textos? para as quest'],
            'gabarito': gab, 'area': lambda n: 'Conhecimentos gerais',
        }
    uft('uft-2022-1', 2022, 1)
    uft('uft-2022-2', 2022, 2)
    uft('uft-2023-1', 2023, 1)
    uft('uft-2024-1', 2024, 1)
    # 2022/1 (tarde): "QUESTÃO 04" e logo abaixo "Leia os textos I e II para responder a QUESTÃO 04.": a instrução é da
    # própria questão (só na mesma coluna: a instrução no alto da página seguinte abre o texto das questões seguintes)
    P['uft-2022-1'].update({'suporte_interno': 30, 'suporte_interno_mesma_pagina': True})
    # 2022/2: "Texto II" depois da questão 07 é o texto da 08 (que relaciona os textos I e II)
    P['uft-2022-2']['suporte'] = P['uft-2022-2']['suporte'] + [r'^Texto II\s*$']
    P['uft-2022-2']['apoio_de'] = {8: [7]}

    # ------------------------------------------------------------------------------------------- UNIRG
    # 2025/2: ícones do título "Text for questions..." entravam no pé do print das questões 4, 9 e 15
    _p.PROVAS['unirg-2025-2']['suporte_icone'] = True
    return P

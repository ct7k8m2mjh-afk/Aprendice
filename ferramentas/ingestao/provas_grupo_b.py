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
                vs = re.findall(r'\*?(?i:anul)(?:ada|\.)|\*?[A-E]\b', b.split('Gabarito', 1)[1])
                assert len(ns) == len(vs), (a, b)
                for n, v in zip(ns, vs):
                    v = v.lstrip('*')
                    g[n] = v if v in 'ABCDE' else 'X'
        if not g:
            for n, v in re.findall(r'(?<![\d,./])(\d{1,2})\s+(\*?[A-E]\b|(?i:anul)\.?|ANULADA)', txt):
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
        c['suporte'] = c['suporte'] + [r'(?i)^textos? para (as )?(quest|\d)']   # "Texto para questões 35 a 38", "Texto para 35 a 38"
        c['corte'] = c['corte'] + [r'(?i)^L[ÍI]NGUA PORTUGUESA E LITERATURA']   # faixa de seção
        # título da matéria no alto da página (atravessa a calha): a página começa abaixo dele
        c['cabecalho'] = r'^(F[íi]sica|Biologia|Matem[áa]tica|Hist[óo]ria|Geografia|Qu[íi]mica|L[íi]ngua Portuguesa|Ingl[êe]s)\s*$'
        c['nota'] = (f'Universidade Estadual do Tocantins, Vestibular {ano}/{sem}' + (f' ({rotulo})' if rotulo else '') +
                     ': 50 questões A–E (Física, Biologia, Matemática, História, Geografia, Química, Língua Portuguesa e '
                     'Literatura Brasileira, língua estrangeira). Língua estrangeira: inglês. Redação fora. Gabarito '
                     'definitivo; anulada fica fora.')
        P[pid] = c
    unitins('unitins-2020-1', 2020, 1, '')
    unitins('unitins-2021-1', 2021, 1, '')
    unitins('unitins-2021-2', 2021, 2, 'Medicina')
    unitins('unitins-2022-1', 2022, 1, '')
    # unitins-2022-1-med (Medicina 2022/1): configurada, mas FORA do site — a diagramação (selos que avançam sobre a calha,
    # linhas da coluna esquerda até x≈299) deixa 15 das 48 questões com print partido; refazer à mão
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
    # 2023/1 caderno 1: o texto sobre Michael Jackson vem logo abaixo do título "Língua Inglesa", sem frase de indicação,
    # e é o texto da questão 46 (conferido no caderno, p. 18)
    P['unitins-2023-1']['suporte_forcado'] = {('caderno', 18): [(356, 3, [46, 46])]}
    P['unitins-2023-1-c2']['suporte_forcado'] = {('caderno', 23): [(95, 0, [46, 46])]}   # letra de "The Show Must Go On"
    for k in ('unitins-2023-1', 'unitins-2023-1-c2'):
        P[k]['apagar_girado'] = r'Vestibular Unitins'   # rodapé vertical na margem direita
        P[k]['base'] = 31   # barra cinza no pé (y 812–820)
        P[k]['topo_barra'] = True
    P['unitins-2024-1-c2']['suporte'] = P['unitins-2024-1-c2']['suporte'] + [r'(?i)^texto as quest']   # "Texto as questões de 31 a 34."
    # Prints que a emenda de colunas/faixas não deixa fiéis (fórmula, tabela, figura ou linha partida; alternativa
    # faltando), conferidos na folha de contato e pela conferência separada: ficam fora até serem refeitos à mão
    EXCL = {'unitins-2021-1': (11, 17, 20, 21, 23, 39), 'unitins-2021-2': (4, 8, 17, 18, 19, 21, 26),
            'unitins-2022-1': (13, 14, 25, 28, 30, 31, 37), 'unitins-2023-1': (3, 10, 47), 'unitins-2023-1-c2': (8, 9, 30),
            'unitins-2024-1': (13, 15, 24), 'unitins-2024-1-c2': (11, 13, 25, 27, 29), 'unitins-2025-1-c2': (23, 24, 45),
            'unitins-2026-1': (4, 30), 'unitins-2026-1-c2': (2, 4, 28)}
    # 1ª tentativa: fronteiras de faixa e divisa ajustadas página a página (ajusta_faixas); o que continuar partido
    # recebe recorte manual por questão ('manual')
    for k in [x for x in P if x.startswith('unitins-')]:
        P[k]['faixas_ajuste'] = True
        P[k]['caixa_vazia'] = True   # moldura vazia no pé do print
    # diagramação antiga (selos azuis, páginas de uma coluna misturadas a duas, texto justificado partido na calha)
    for k in ('unitins-2021-2', 'unitins-2022-1', 'unitins-2022-1-med'):
        P[k]['faixas_uma_auto'] = True      # página toda de uma coluna (texto atravessa a calha, nenhuma questão começa à direita)
        P[k]['faixas_justificada'] = True   # linha justificada partida na calha = faixa de largura total
    # Recorte manual (coordenadas conferidas na página, em pt: página, x0, y0, x1, y1), nas questões em que o automático
    # partia gráfico, fórmula, tabela ou linha entre faixas de uma e de duas colunas
    MANUAL = {
        'unitins-2020-1': {12: [(3, 28, 568, r'^12\s*-', None)], 13: [(4, 28, 568, r'^13\s*-', r'^14\s*-')],
                           33: [(10, 28, 568, r'^Leia a tirinha', r'^Textos 1, 2 e 3')],
                           34: [(10, 28, 568, r'^Textos 1, 2 e 3', None), (11, 28, 568, None, None), (12, 28, 297, None, r'^35\s*-')]},
        'unitins-2021-1': {6: [(3, 28, 298, 52.4, r'^07\s*-')],
                           8: [(3, 28, 298, r'^08\s*-', None), (3, 299, 568, 52.4, r'^09\s*-')],
                           10: [(3, 299, 568, r'^10\s*-', None), (4, 28, 568, None, r'^MATEM')],
                           11: [(4, 28, 568, r'^11\s*-', None), (5, 28, 568, None, r'^12\s*-')],
                           17: [(7, 28, 568, r'^17\s*-', r'^18\s*-')],
                           21: [(9, 28, 568, r'texto a seguir e analise o clim', None), (10, 28, 568, None, r'^22\s*-')],
                           39: [(19, 28, 568, None, None)], 44: [(22, 299, 568, r'^Leia o trecho a seguir, produ', None)],
                           46: [(23, 28, 298, r'texto a seguir para responder', None), (23, 299, 568, r'^46\s*-', r'^47\s*-')],
                           47: [(23, 28, 298, r'texto a seguir para responder', None), (23, 299, 568, r'^47\s*-', None)],
                           48: [(23, 28, 298, r'texto a seguir para responder', None), (24, 28, 568, None, r'^Com base no cartoon')]},
        'unitins-2021-2': {6: [(4, 28, 298, r'^QUESTÃO 0?6', None)],
                           42: [(24, 299, 568, r'^QUESTÃO 42', None), (25, 28, 298, None, r'^Leia o poema')],
                           43: [(25, 28, 298, r'^Leia o poema', None), (25, 299, 568, None, r'^QUESTÃO 43'),
                                (25, 299, 568, r'^QUESTÃO 43', r'^QUESTÃO 44')],
                           44: [(25, 28, 298, r'^Leia o poema', None), (25, 299, 568, None, r'^QUESTÃO 43'),
                                (25, 299, 568, r'^QUESTÃO 44', None), (26, 28, 568, None, r'^QUESTÃO 45')],
                           18: [(10, 28, 568, r'^QUESTÃO 18', None), (11, 28, 568, None, r'^QUESTÃO 19')],
                           19: [(11, 28, 290, r'^QUESTÃO 19', None), (11, 297, 568, r'^A\) A criação', r'^QUESTÃO 20')],
                           26: [(15, 28, 568, r'^QUESTÃO 26', r'^QUESTÃO 27')]},
        'unitins-2022-1': {15: [(8, 28, 568, r'^QUESTÃO 15', r'^HIST')], 23: [(11, 28, 298, r'^QUESTÃO 23', None)],
                           25: [(11, 298, 568, r'^QUESTÃO 25', None), (12, 28, 568, None, r'^QU[ÍI]MICA')]},
        'unitins-2022-1-med': {12: [(6, 28, 568, r'^QUESTÃO 12', None)]},
        'unitins-2023-1': {5: [(2, 299, 568, r'^Questão 05', None), (3, 28, 568, None, r'^Biologia')],
                           10: [(5, 28, 568, r'^Questão 10', None)],
                           47: [(19, 28, 568, r'^Questão 47', None), (20, 28, 568, None, r'^Questão 48')],
                           50: [(21, 28, 568, r'^Questão 50', None)]},
        'unitins-2023-1-c2': {8: [(4, 28, 568, r'^Questão 08', r'^Questão 09')],
                              9: [(4, 28, 568, r'^Questão 09', None), (5, 28, 568, None, r'^Questão 10')],
                              29: [(12, 28, 568, r'^Questão 29', r'^Questão 30')],
                              30: [(12, 28, 568, r'^Questão 30', None), (13, 28, 568, None, r'^L[íi]ngua Portuguesa')],
                              37: [(15, 299, 568, r'^Texto para as quest[õo]es 37', None), (16, 28, 568, None, r'^Questão 37'),
                                   (16, 28, 568, r'^Questão 37', r'^Questão 38')],
                              38: [(15, 299, 568, r'^Texto para as quest[õo]es 37', None), (16, 28, 568, None, r'^Questão 37'),
                                   (16, 28, 568, r'^Questão 38', None)]},
        'unitins-2024-1': {39: [(17, 28, 568, r'^Textos para quest', r'^Questão 39'), (17, 28, 568, r'^Questão 39', r'^Questão 40')],
                           40: [(17, 28, 568, r'^Textos para quest', r'^Questão 39'), (17, 28, 568, r'^Questão 40', None), (18, 28, 568, 25, 140)],
                           47: [(21, 28, 568, r'^Questão 47', None), (22, 28, 568, None, r'^Questão 48')],
                           13: [(5, 28, 568, r'^Questão 13', None), (6, 28, 568, None, r'^Questão 14')],
                           15: [(6, 28, 568, r'^Questão 15', None)]},
        'unitins-2024-1-c2': {13: [(9, 28, 568, r'^Questão 13', r'^Questão 14')], 27: [(14, 28, 568, r'^Questão 27', None)],
                              29: [(15, 28, 568, r'^Questão 29', r'^Questão 30')],
                              25: [(13, 296, 568, r'^Questão 25', None), (14, 28, 568, 25, 70)]},
        'unitins-2025-1-c2': {46: [(21, 28, 568, r'^QUESTÃO 46', r'^QUESTÃO 47')],
                              28: [(14, 28, 568, r'^QUESTÃO 28', None), (15, 28, 568, None, r'^QUESTÃO 29')],
                              50: [(23, 28, 568, r'^QUESTÃO 50', None), (24, 28, 568, None, r'^Espanhol')],
                              13: [(7, 28, 568, r'^QUESTÃO 13', r'^QUESTÃO 14')],
                              14: [(7, 28, 568, r'^QUESTÃO 14', None), (8, 28, 568, None, r'^QUESTÃO 15')],
                              23: [(12, 28, 568, r'^QUESTÃO 23', r'^QUESTÃO 24')],
                              24: [(12, 28, 568, r'^QUESTÃO 24', None), (13, 28, 298, None, r'^QUESTÃO 25')],
                              45: [(20, 296, 568, r'^QUESTÃO 45', None), (21, 28, 568, 25, 60)]},
        'unitins-2026-1': {50: [(23, 28, 568, r'^QUESTÃO 50', None), (24, 28, 568, None, r'^Espanhol')],
                           4: [(4, 28, 568, r'^QUESTÃO 4\b', r'^QUESTÃO 5\b')], 30: [(13, 28, 568, r'^QUESTÃO 30', None)]},
        'unitins-2026-1-c2': {1: [(2, 28, 568, r'^QUESTÃO 1\b', r'^QUESTÃO 2\b')], 2: [(2, 28, 568, r'^QUESTÃO 2\b', None)],
                              4: [(3, 28, 568, r'^QUESTÃO 4\b', None), (4, 28, 568, None, r'^QUESTÃO 5\b')],
                              28: [(14, 28, 568, r'^QUESTÃO 28', r'^QUESTÃO 29')]},
    }
    for k, m in MANUAL.items():
        P[k]['manual'] = m
    P['unitins-2026-1-c2']['aperta_moldura'] = True   # moldura vazia até o pé da página (q45)
    # selo (faixa azul-clara) do número da questão seguinte que sobra no pé do print
    for k in ('unitins-2021-2', 'unitins-2022-1', 'unitins-2022-1-med', 'unitins-2023-1', 'unitins-2023-1-c2'):
        P[k]['pe_cor'] = (185, 210, 214)
        P[k]['pe_cor_min'] = 6   # o arco do selo é estreito; a cor azul-clara não aparece no texto
        P[k]['selo_folga'] = 13   # selo oval: o número fica ~10 pt abaixo do alto do desenho
    # 2021/1: número da questão no começo da linha do enunciado ("01 - ", "16. ", "22- "), sem negrito
    P['unitins-2021-1'].update({'ancora': r'^(\d{2})\s*[-–.]\s*\S', 'ancora_negrito': False, 'ancora_dx': 40})
    P['unitins-2020-1'].update({'ancora': r'^(\d{2})\s*[-–.]\s*\S', 'ancora_negrito': False, 'ancora_dx': 40})
    P['unitins-2020-1']['suporte'] = P['unitins-2020-1']['suporte'] + [r'^Leia\b']
    P['unitins-2020-1'].update({'ancora_folga': 3, 'suporte_ponto_final': True})
    # "Texto 3" (p. 16, depois da 44) é só da 45; os textos 1 e 2 ("questões 44 e 45") seguem valendo para ela
    P['unitins-2020-1']['suporte_forcado'] = {('caderno', 16): [(385, 1, [])]}
    # "Leia o trecho da notícia ... The Guardian e responda às questões." (sem números): vale para a língua inglesa, 46–50
    P['unitins-2020-1']['faixa_errata'] = {('caderno', 17, ()): [46, 50]}
    P['unitins-2021-1']['suporte'] = P['unitins-2021-1']['suporte'] + [r'^Leia\b']
    P['unitins-2021-1']['suporte_ponto_final'] = True   # "Leia, a seguir, o soneto...", "Leia o trecho a seguir..."
    for k in ('unitins-2021-2', 'unitins-2022-1-med'):
        P[k]['ancora_coluna_dir'] = 10   # "QUESTÃO 20"/"QUESTÃO 31" num selo que começa em x≈292, antes da divisa (297)

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
                      r'(?i)^RASCUNHO', r'(?i)^Aten[çc][ãa]o: Responda apenas',
                      r'^PROVA$', r'^TECNOLOGIAS$'],   # título de área com as palavras soltas (justificado)
            'suporte': [r'(?i)(responda|responder)\b.*\bquest', r'(?i)\bpara responder( [àa]s?)?\s*$', r'(?i)\bin order to answer\b',
                        r'(?i)\bto answer\s+(the\s+)?questions?\b', r'(?i)^textos? para as quest',
                        r'(?i)\bresponda\s+[àa]s?\s*$'],
            # instrução em duas linhas com entrelinha apertada (a 2ª começa antes do pé da 1ª)
            'suporte_aperto': True, 'suporte_sobe': 2,   # frase de instrução em 3 linhas
            'pe_fio': True,   # borda da caixa seguinte no pé do print
            'pe_cor': (164, 164, 164),   # barra cinza do rodapé da página
            'gabarito': gab, 'area': lambda n: 'Conhecimentos gerais',
        }
    uft('uft-2022-1', 2022, 1)
    uft('uft-2022-2', 2022, 2)
    uft('uft-2023-1', 2023, 1)
    uft('uft-2024-1', 2024, 1)
    # EaD 2022/2 (licenciaturas a distância em Química, Física, Biologia e Matemática): caderno único de 30 questões A–D
    # (Português 1–10, Matemática, Biologia, Química, Física). O caderno da Licenciatura em Música (mesmas 1–15 e
    # questões de Música) fica fora: repetiria as comuns e Música não é matéria do site.
    c = dict(P['uft-2022-2'])
    c.update({'fase': 'Vestibular EaD 2022/2', 'titulo': 'UFT EaD 2022/2', 'total': 30,
              'nota': 'Universidade Federal do Tocantins, Processo Seletivo EaD/UFT 2022/2 (Copese), caderno das licenciaturas '
                      'em Química, Física, Biologia e Matemática: 30 questões A–D. Redação fora. Gabarito definitivo; anulada '
                      'fica fora.',
              'cadernos': [{'arquivo': 'caderno', 'paginas': (2, 999)}],
              'gabarito': lambda pasta: _gab_grade(re.split(r'QU[ÍI]MICA, F[ÍI]SICA', _p.texto_pdf(pasta / 'gabarito.pdf'))[1], 'ABCD'),
              'apoio_de': {10: [1]}})   # a 10 compara os textos I e II
    c['corte'] = c['corte'] + [r'^PROVA DE ']
    P['uft-ead-2022-2'] = c
    c['cadernos'] = [{'arquivo': 'caderno', 'paginas': (2, 6)}]   # a p. 7 é a Classificação Periódica
    c['pe_fio_vao'] = 4   # fio duplo da borda da página no pé
    c['corte'] = c['corte'] + [r'^TABELA PERI']
    c['base'] = 40   # rodapé "N Prova de conhecimentos" em y≈804
    # 2022/1 (tarde): "QUESTÃO 04" e logo abaixo "Leia os textos I e II para responder a QUESTÃO 04.": a instrução é da
    # própria questão (só na mesma coluna: a instrução no alto da página seguinte abre o texto das questões seguintes)
    P['uft-2022-1'].update({'suporte_interno': 30, 'suporte_interno_mesma_pagina': True})
    # 2022/2: "Texto II" depois da questão 07 é o texto da 08 (que relaciona os textos I e II)
    P['uft-2022-2']['suporte'] = P['uft-2022-2']['suporte'] + [r'^Texto II\s*$']
    P['uft-2022-2']['apoio_de'] = {8: [7]}
    P['uft-2023-1']['anexa'] = {26: 25}   # "Com base na figura da QUESTÃO 25": a 25 vai junto

    # ----------------------------------------------------------------------------------------------- UFRR
    # Vestibular UFRR (CPV): Prova Integral (PI), que é a mesma da etapa 3 do seriado (E3): 72 questões A–E em 9
    # matérias; língua 64–72 (espanhol, inglês ou francês: vale o inglês). As etapas E1 e E2 do seriado ficam fora (como
    # no PISM da UFJF, só a etapa final). Gabarito oficial: anexo "GABARITO OFICIAL DA PROVA INTEGRAL" do edital.
    def ufrr(pid, ano):
        def gab(pasta):
            txt = _p.texto_pdf(pasta / 'gabarito.pdf')
            ini = re.search(r'GABARITO OFICIAL DA PROVA INTEGRAL', txt)
            assert ini, 'sem gabarito oficial da PI'
            bloco = re.split(r'ANEXO', txt[ini.end():])[0]
            g, disc = {}, ''
            ls = bloco.splitlines()
            for a, b in zip(ls, ls[1:]):
                if a.strip().startswith('Disciplina'):
                    disc = a
                if a.strip().startswith('Questão') and b.strip().startswith('Gabarito'):
                    if re.search(r'ESPANHOL|FRANC', disc):
                        continue
                    ns = [int(x) for x in a.split()[1:]]
                    vs = re.findall(r'(?<!\w)(?:[A-E]|N\*?)(?!\w)', b.split('Gabarito', 1)[1])
                    assert len(ns) == len(vs), (a, b)
                    for n, v in zip(ns, vs):
                        g[n] = v if v in 'ABCDE' else 'X'
            assert sorted(g) == list(range(1, 73)), sorted(g)
            return g
        secs = [(r'^PORTUGU[ÊE]S$', 'Língua Portuguesa'), (r'^MATEM[ÁA]TICA$', 'Matemática'), (r'^BIOLOGIA$', 'Biologia'),
                (r'^F[ÍI]SICA$', 'Física'), (r'^GEOGRAFIA$', 'Geografia'), (r'^HIST[ÓO]RIA$', 'História'),
                (r'^QU[ÍI]MICA$', 'Química'), (r'^ESPA[ÑN]OL$', 'Espanhol'), (r'^ENGLISH$', 'Inglês'), (r'^FRAN[ÇC]AIS$', 'Francês')]
        P[pid] = {
            'catalogo': 'ufrr', 'escola': 'UFRR', 'ano': str(ano), 'fase': f'Vestibular {ano} – Prova Integral',
            'titulo': f'UFRR {ano}', 'banca': 'CPV/UFRR', 'duracao_horas': 5, 'total': 72,
            'nota': f'Universidade Federal de Roraima, Vestibular {ano} (Comissão Permanente de Vestibular): Prova Integral '
                    '(a mesma da etapa 3 do seriado), 72 questões A–E de Português, Matemática, Biologia, Física, Geografia, '
                    'História, Química e língua estrangeira (inglês). Redação fora. Gabarito oficial publicado após os '
                    'recursos; anulada fica fora.',
            'cadernos': [{'arquivo': 'caderno', 'paginas': (2, 999)}],
            'colunas': lambda r: [(24, r.width / 2), (r.width / 2, r.width - 20)], 'margem': 24, 'topo': 32, 'base': 39,
            'ancora': r'(?i)^(?:QUEST[ÃA]O|QUESTION|PREGUNTA)\s+(\d{1,2})$', 'ancora_dx': 130, 'sequencial': True,   # número centrado na coluna
            'secoes_rx': secs, 'pular_secoes': ('Espanhol', 'Francês'), 'pular_antes_sequencia': True,
            'corte': [r'(?i)^PROPOSTA DE REDA', r'(?i)^REDA[ÇC][ÃA]O$', r'(?i)^RASCUNHO', r'(?i)^FOLHA DE RASCUNHO'],
            'suporte': [r'(?i)(responda|responder)\b.*\bquest[õo]es', r'(?i)\bpara responder( [àa]s?)?\s*$',
                        r'(?i)^textos? para as quest', r'(?i)\bto answer\b.*\bquestions', r'^TEXTO?\s+[IVX]+\s*$'],
            # "TEXTO II" (título, sem frase de indicação): vale para a questão logo depois e para as que o citam
            'texto_romano': True, 'texto_n_sem_faixa': True, 'suporte_ate_proximo': True, 'suporte_primeira': True,
            'suporte_palavras': '|a text|lyrics|song|graph|poem|poema|gráfico|canção|infográfico|mapa|tabela|imagem|charge|quadrinho',
            'pe_fio': True, 'pe_fio_vao': 4,   # fio de separação + topo cortado do título seguinte no pé
            'seg_min': 20,   # pedaço do alto da página seguinte só com o fio da caixa e o acento de "QUESTÃO"
            'suporte_interno': 60,   # "QUESTÃO 25 / Leia os textos a seguir..." com os textos logo abaixo: são da questão
            'gabarito': gab, 'area_do_gabarito': False, 'area': lambda n: 'Conhecimentos gerais',
        }
    ufrr('ufrr-2021', 2021)
    ufrr('ufrr-2022', 2022)
    ufrr('ufrr-2023', 2023)
    # auditoria separada: verso/linha partidos na emenda das fatias, conferidos no print

    # ------------------------------------------------------------------------------------------------ IME
    # Concurso de Admissão (Formação e Graduação), 1ª fase: prova objetiva de 40 questões A–E (Matemática 1–15, Física
    # 16–30, Química 31–40), uma coluna, "1ª QUESTÃO" (LaTeX). Gabarito definitivo/final do IME. A 2ª fase (discursivas
    # e Português/Inglês) fica fora. Ano do vestibular = ano de ingresso (concurso 2020/2021 = IME 2021).
    def ime(pid, ano, rotulo_gab):
        P[pid] = {
            'catalogo': 'ime', 'escola': 'IME', 'ano': str(ano), 'fase': f'Concurso {ano - 1}/{ano} – 1ª fase (objetiva)',
            'titulo': f'IME {ano - 1}/{ano}', 'banca': 'IME', 'duracao_horas': 4, 'total': 40,
            'nota': f'Instituto Militar de Engenharia, Concurso de Admissão {ano - 1}/{ano} aos cursos de Formação e Graduação: '
                    'prova objetiva da 1ª fase, 40 questões A–E (Matemática 1–15, Física 16–30, Química 31–40). '
                    f'Gabarito {rotulo_gab} do IME; anulada fica fora. A 2ª fase (discursivas e Português/Inglês) fica fora.',
            'cadernos': [{'arquivo': 'caderno', 'paginas': (2, 999)}],
            'colunas': lambda r: [(28, r.width - 24)], 'margem': 28, 'topo': 30, 'base': 30,
            'ancora': r'^(\d{1,2})\s*ª\s*QUEST', 'ancora_dx': 20, 'sequencial': True,
            'corte': [r'(?i)^QUEST\s*\S?\s*[ÕO]\s*ES DE \d+ A \d+', r'^MATEM', r'^F[ÍI´]\s*\S*SICA$', r'^QU[ÍI´]', r'(?i)^RASCUNHO', r'^CONCURSO DE ADMISS'],
            'suporte': [], 'aperta_moldura': True, 'seg_min': 20, 'pe_fio': True,
            'gabarito': lambda pasta: {int(n): (v if len(v) == 1 else 'X') for n, v in re.findall(
                r'(?<![\d,.])(\d{1,2})\s+([A-E]\b|[Aa][Nn][Uu][Ll][Aa][Dd][AaOo])', _p.texto_pdf(pasta / 'gabarito.pdf'))},
            'area': lambda n: 'Matemática' if n <= 15 else 'Física' if n <= 30 else 'Química',
            'area_do_gabarito': True,
        }
    ime('ime-2021', 2021, 'definitivo')
    ime('ime-2022', 2022, 'definitivo')
    ime('ime-2023', 2023, 'oficial definitivo')
    ime('ime-2026', 2026, 'final')

    # ------------------------------------------------------------------------------------------------ UEA
    # Universidade do Estado do Amazonas (banca Vunesp). Vestibular (acesso no ano seguinte): 1º dia = Conhecimentos
    # Gerais (84 questões); 2º dia = Conhecimentos Específicos por grupo de cursos (36 questões + redação: grupo 1
    # Biológicas/Saúde, 2 Humanas, 3 Exatas). SIS (seriado): só a Prova de Acompanhamento III (3ª série), a etapa final.
    # Caderno e gabarito da Vunesp (versão 1). O "ano" é o ano de acesso.
    import provas_vunesp as _v
    GRUPO = {'bio': ('Conhecimentos Específicos – Biológicas', 'grupo 1: Medicina, Odontologia, Enfermagem e licenciaturas da área'),
             'hum': ('Conhecimentos Específicos – Humanas', 'grupo 2: Administração, Direito e cursos de Humanas'),
             'exa': ('Conhecimentos Específicos – Exatas', 'grupo 3: Engenharias, Computação e licenciaturas de Exatas')}

    def uea(pid, acesso, tipo):
        if tipo == 'cg':
            fase, tit, desc = 'Conhecimentos Gerais', f'UEA {acesso} – Conhecimentos Gerais', 'Prova de Conhecimentos Gerais (1º dia)'
        elif tipo == 'sis3':
            fase, tit = 'SIS – Prova de Acompanhamento III', f'UEA SIS {acesso} – 3ª série'
            desc = f'Sistema de Ingresso Seriado (acesso {acesso}), Prova de Acompanhamento III (3ª série do ensino médio)'
        else:
            fase, d = GRUPO[tipo]
            tit = f'UEA {acesso} – {fase.split("– ")[1]}'
            desc = f'Prova de Conhecimentos Específicos (2º dia), {d}; a redação fica fora'
        nota = (f'Universidade do Estado do Amazonas, ' + (f'Vestibular {acesso - 1}/acesso {acesso}: ' if tipo != 'sis3' else '') +
                f'{desc}. Questões objetivas A–E, versão 1. Caderno e gabarito da Vunesp, baixados da página de downloads do '
                'Brasil Escola (link do dono; o portal da Vunesp bloqueia acesso automático). Anulada fica fora.')
        c = _v.base('uea', 'UEA', acesso, fase, tit, 0, nota=nota)
        c['suporte'] = c['suporte'] + [r'(?i)^as quest[õo]es de \d+ a \d+']   # "As questões de 05 a 08 focalizam a peça..."

        def cadernos(pasta):
            # o caderno termina na página da última "Questão NN": depois vêm a Classificação Periódica (às vezes só em
            # imagem), a proposta de redação e o rascunho, que não podem entrar no print da última questão
            import pymupdf
            doc = pymupdf.open(pasta / 'caderno.pdf')
            fim = max(i for i in range(len(doc)) if re.search(r'(?i)quest[ãa]o\s+\d', doc[i].get_text())) + 1
            return [{'arquivo': 'caderno', 'paginas': (2, fim)}]
        c['cadernos'] = cadernos
        c.pop('total')
        c['total_de'] = lambda pasta, g=c['gabarito']: max(g(pasta))
        P[pid] = c

    uea('uea-2021', 2021, 'cg')
    uea('uea-2021-bio', 2021, 'bio')
    for a in (2025, 2026, 2027):
        uea(f'uea-{a}', a, 'cg')
        for t in ('bio', 'hum', 'exa'):
            uea(f'uea-{a}-{t}', a, t)
    for a in (2020, 2021, 2025, 2026, 2027):
        uea(f'uea-sis3-{a}', a, 'sis3')

    # ------------------------------------------------------------------------------------------------ UERR
    # UERR 2023 (Cebraspe), no pacote da UFRR do dono: caderno publicado só como imagem — as questões são localizadas por
    # OCR (o print continua sendo a página original); sem transcrição. Gabarito oficial definitivo (Edital 41/2022).
    c = _p.uerr(2023)
    # p. 1 = capa; p. 8–9 (e o alto da 10) = bloco do espanhol: o caderno é lido em duas partes
    c['cadernos'] = [{'arquivo': 'caderno', 'paginas': (2, 7), 'ocr': True, 'questoes': (1, 18)},
                     {'arquivo': 'caderno', 'paginas': (10, 24), 'ocr': True, 'questoes': (19, 72)}]
    c['sem_transcricao'] = True
    # O OCR lê mal o título "Questão N" (ícone colado: "V Questão 4", "uestão 2", "Questão3o"): as âncoras vêm de OCR em
    # 4 resoluções (220–400 dpi), conferidas página a página (q1 e q71 lidas na página); (n, y, coluna). Bloco do
    # espanhol (p. 8–10, questões 10–18) fora: vale o inglês (p. 6–7).
    c['ancora'] = r'(?!x)x(\d)'
    c['ancora_forcada'] = {('caderno', 2): [(2, 66, 1), (3, 207, 1), (1, 433, 0)], ('caderno', 3): [(4, 447, 0), (5, 50, 1)], ('caderno', 4): [(6, 47, 0), (7, 50, 1)], ('caderno', 5): [(8, 433, 0)], ('caderno', 6): [(9, 47, 0), (10, 387, 1), (11, 517, 1), (12, 649, 1)], ('caderno', 7): [(13, 47, 0), (14, 223, 0), (15, 47, 1), (16, 183, 1), (17, 420, 1), (18, 607, 1)], ('caderno', 10): [(19, 465, 1)], ('caderno', 11): [(20, 47, 0), (21, 381, 0), (22, 335, 1), (23, 515, 1)], ('caderno', 12): [(24, 456, 0), (25, 625, 0), (26, 50, 1), (27, 295, 1), (28, 487, 1)], ('caderno', 13): [(29, 50, 0), (30, 47, 1), (31, 470, 1)], ('caderno', 14): [(32, 50, 0), (33, 311, 0), (34, 50, 1), (35, 299, 1)], ('caderno', 15): [(36, 47, 0), (37, 427, 0), (38, 50, 1), (39, 287, 1)], ('caderno', 16): [(40, 47, 0), (41, 337, 0), (42, 47, 1), (43, 343, 1), (44, 537, 1)], ('caderno', 17): [(45, 47, 0), (46, 324, 0), (47, 589, 0), (48, 50, 1)], ('caderno', 18): [(49, 47, 0), (50, 47, 1)], ('caderno', 19): [(51, 47, 0), (52, 519, 0), (53, 50, 1), (54, 527, 1)], ('caderno', 20): [(55, 47, 0), (56, 340, 0), (57, 586, 0), (58, 47, 1), (59, 373, 1)], ('caderno', 21): [(60, 47, 0), (61, 509, 0), (62, 47, 1), (63, 433, 1)], ('caderno', 22): [(64, 50, 0), (65, 327, 0), (66, 47, 1)], ('caderno', 23): [(67, 50, 0), (68, 543, 0), (69, 50, 1), (70, 337, 1)], ('caderno', 24): [(72, 555, 0), (71, 50, 0)]}
    # textos de apoio (títulos "Texto 1A1-I" etc. lidos mal pelo OCR): posições e questões conferidas no caderno
    c.update({'suporte': [], 'suporte_apos_alt': None, 'suporte_apos_secao': False, 'suporte_ate_proximo': False,
              'suporte_primeira': False, 'texto_id': None})
    c['ultima_continua'] = False
    # "Espaço livre" (fim da questão) que o OCR junta à linha da outra coluna: (página): [(y, coluna)]
    c['corte_forcado'] = {('caderno', p_): [(y_, c_)] for p_, y_, c_ in
                          ((2, 578, 1), (3, 514, 1), (10, 541, 0), (13, 491, 0), (14, 568, 1), (15, 592, 1), (17, 180, 1),
                           (18, 498, 0), (19, 657, 0), (20, 635, 1), (22, 699, 0), (24, 46, 1))}
    c['topo_pag'] = {2: 78}   # faixa "PROVA OBJETIVA" no alto da p. 2
    c['suporte_forcado'] = {('caderno', 2): [(78, 0, [1, 3])], ('caderno', 3): [(40, 0, [4, 4])], ('caderno', 6): [(46, 1, [10, 14])],
                            ('caderno', 7): [(374, 0, [15, 18])], ('caderno', 10): [(46, 1, [19, 20])],
                            ('caderno', 11): [(46, 1, [21, 23])], ('caderno', 12): [(46, 0, [24, 27])]}
    c['nota'] = c['nota'].replace('Processo Seletivo Vestibular 2023 (Cebraspe)', 'Vestibular 2023 (Cebraspe, aplicação 23/10/2022)') + \
        ' Caderno publicado só como imagem: o print é a página original.'
    P['uerr-2023'] = c

    # ------------------------------------------------------------------------------------------- UNIRG
    # 2020/1 (banca UFG/Centro de Seleção): caderno tipo 1, 54 questões A–D (Português, Literatura, Matemática, Física,
    # Biologia, Química, Geografia, História: 1–48; língua 49–54, inglês e depois espanhol). Gabarito oficial dos 4 tipos
    # (edital 97/2019): a 1ª ocorrência de cada número na linha é a do tipo 1 (e, na língua, a do inglês).
    def _gab_unirg20(pasta):
        g = {}
        for linha in _p.texto_pdf(pasta / 'gabarito.pdf').splitlines():
            for n, v in re.findall(r'(?<![\d,./])(\d{2})\s+([A-D]\b|\*|ANULADA)', linha):
                g.setdefault(int(n), v if v in 'ABCD' else 'X')
        return g
    secs20 = [(r'^L[ÍI]NGUA ESTRANGEIRA\s*[–-]\s*INGL', 'Inglês'), (r'^L[ÍI]NGUA ESTRANGEIRA\s*[–-]\s*ESPANH', 'Espanhol'),
              (r'^L[ÍI]NGUA PORTUGUESA$', 'Língua Portuguesa'), (r'^LITERATURA BRASILEIRA$', 'Literatura'),
              (r'^MATEM[ÁA]TICA$', 'Matemática'), (r'^BIOLOGIA$', 'Biologia'), (r'^F[ÍI]SICA$', 'Física'),
              (r'^QU[ÍI]MICA$', 'Química'), (r'^GEOGRAFIA$', 'Geografia'), (r'^HIST[ÓO]RIA$', 'História')]
    P['unirg-2020-1'] = {
        'catalogo': 'unirg', 'escola': 'UNIRG', 'ano': '2020', 'fase': 'Medicina 2020/1', 'titulo': 'UNIRG Medicina 2020/1',
        'banca': 'UFG/Centro de Seleção', 'duracao_horas': 4.5, 'total': 54, 'alternativas': 4,
        'nota': 'Universidade de Gurupi (TO), Processo Seletivo 2020/1 (Medicina), caderno tipo 1 (banca: Centro de Seleção '
                'da UFG): 54 questões A–D. Língua estrangeira: inglês. Redação fora. Gabarito oficial (edital 97/2019); '
                'anulada fica fora.',
        'cadernos': [{'arquivo': 'caderno', 'paginas': (3, 999)}],
        'colunas': lambda r: [(24, 297), (297, r.width - 24)], 'margem': 24, 'topo': 44, 'base': 40,
        'ancora': r'^▬?\s*QUEST[ÃA]O\s+(\d{1,2})\b', 'ancora_dx': 14, 'sequencial': True,
        'secoes_rx': secs20, 'pular_secoes': ('Espanhol',), 'pular_antes_sequencia': True,
        'corte': [r'^▬?\s*RASCUNHO', r'(?i)^REDA[ÇC][ÃA]O$', r'-Tipo 1$'],
        'suporte': [r'(?i)(responda|responder)\b.*\bquest[õo]es', r'(?i)\bpara responder( [àa]s?)?\s*$', r'(?i)^textos? para as quest'],
        'gabarito': _gab_unirg20, 'area': lambda n: 'Conhecimentos gerais',
    }
    P['unirg-2020-1']['uma_coluna'] = (6,)   # p. 6: questões 13 e 14 em largura total
    # Campus Paraíso do Tocantins, Medicina 2021/1 (caderno tipo 1) e 2021/2 (prova A, inglês): provas próprias do campus,
    # diferentes das de Gurupi. Arquivos do Brasil Escola (link do dono).
    def _gab_paraiso_1(pasta):   # grade "01 02 ..." / "A B ..." por matéria; inglês antes do espanhol; N1/N2 = anulada
        txt = _p.texto_pdf(pasta / 'gabarito.pdf')
        txt = re.split(r'GABARITO DEFINITIVO DO CADERNO DE PROVAS TIPO 2', txt)[0]
        g = {}
        ls = [l for l in txt.splitlines() if l.strip()]
        for i, a in enumerate(ls):
            ns = [int(x) for x in re.findall(r'(?<!\w)(\d{2})(?!\w)', a)]
            if len(ns) != 6:
                continue
            for b in ls[i + 1:i + 3]:
                vs = re.findall(r'(?<!\w)([A-D]|N\d)(?!\w)', b)
                if len(vs) == 6:
                    for n, v in zip(ns, vs):
                        g.setdefault(n, v if v in 'ABCD' else 'X')
                    break
        assert sorted(g) == list(range(1, 55)), sorted(g)
        return g

    def _gab_paraiso_2(pasta):   # 4 colunas (provas A–D) por linha: a 1ª é a prova A; só o quadro da língua inglesa
        txt = re.split(r'L[ÍI]NGUA ESPANHOLA', _p.texto_pdf(pasta / 'gabarito.pdf'))[0]
        g = {}
        for linha in txt.splitlines():
            m = re.match(r'^\s*(\d{1,2})\s+([A-D]|-)\s', linha)
            if m:
                g.setdefault(int(m.group(1)), m.group(2) if m.group(2) in 'ABCD' else 'X')
        assert sorted(g) == list(range(1, 55)), sorted(g)
        return g

    c = _p.unirg(2021, 1, 'unirg')
    c.update({'fase': 'Medicina 2021/1 – Paraíso do Tocantins', 'titulo': 'UNIRG Medicina 2021/1 – Paraíso', 'banca': 'UNIRG',
              'gabarito': _gab_paraiso_1,
              'nota': 'Universidade de Gurupi (TO), Processo Seletivo 2021/1 do curso de Medicina, campus Paraíso do Tocantins, '
                      'caderno tipo 1: 54 questões A–D, 6 por matéria. Língua estrangeira: inglês. Redação fora. Gabarito '
                      'definitivo retificado (20/05/2021); anulada fica fora.',
              'colunas': lambda r: [(30, 298), (298, r.width - 26)], 'margem': 30, 'topo': 30, 'base': 34})
    P['unirg-2021-1-paraiso'] = c
    c['suporte'] = [x for x in c['suporte'] if 'Leia atentamente' not in x]   # "Leia atentamente as alternativas" (q19)
    c['suporte'].append(r'(?i)^Leia\b.*\b(texto|coment[áa]rio|trecho|fragmento|poema)\b')
    # o poema "Motivo" vem logo abaixo do título "LÍNGUA PORTUGUESA", sem frase de indicação: é o texto das questões 1 a 6
    c['suporte_forcado'] = {('caderno', 3): [(86, 0, [1, 6])]}
    c.update({'suporte_interno': 30, 'suporte_interno_mesma_pagina': True, 'pe_fio': True})   # "QUESTÃO 50 / Leia o fragmento..."
    c['secoes_rx'] = [(r'^L[ÍI]NGUA ESTRANGEIRA\s*[-–]\s*ESPANHOL', 'Espanhol'), (r'^L[ÍI]NGUA ESTRANGEIRA\s*[-–]\s*INGL', 'Inglês')] + c['secoes_rx']
    ordem2 = ('Língua Portuguesa', 'Literatura', 'Inglês', 'Matemática', 'Biologia', 'Física', 'Química', 'Geografia', 'História')
    P['unirg-2021-2-paraiso'] = {
        'catalogo': 'unirg', 'escola': 'UNIRG', 'ano': '2021', 'fase': 'Medicina 2021/2 – Paraíso do Tocantins',
        'titulo': 'UNIRG Medicina 2021/2 – Paraíso', 'banca': 'UNIRG', 'duracao_horas': 4.5, 'total': 54, 'alternativas': 4,
        'nota': 'Universidade de Gurupi (TO), Processo Seletivo do 2º semestre de 2021 (edital 58/2021), Medicina, campus '
                'Paraíso do Tocantins, prova A (inglês): 54 questões A–D. Redação fora. Gabarito final; anulada fica fora.',
        'cadernos': [{'arquivo': 'caderno', 'paginas': (9, 999)}],
        'colunas': lambda r: [(24, 298), (298, r.width - 24)], 'margem': 24, 'topo': 30, 'base': 40,
        'ancora': r'^Quest[ãa]o\s+(\d{1,2})$', 'ancora_dx': 60, 'ancora_negrito': True, 'sequencial': True,
        'corte': [r'^(L[ÍI]NGUA PORTUGUESA|LITERATURA BRASILEIRA|L[ÍI]NGUA INGLESA|INGL[ÊE]S|MATEM[ÁA]TICA|BIOLOGIA|F[ÍI]SICA|QU[ÍI]MICA|GEOGRAFIA|HIST[ÓO]RIA)$',
                  r'(?i)^RASCUNHO', r'^MEDICINA - PROVA A'],
        'suporte': [r'(?i)(responda|responder)\b.*\bquest[õo]es', r'(?i)\bpara responder( [àa]s?)?\s*$', r'(?i)^textos? para as quest',
                    r'(?i)\banswer\b.*\bquestions'],
        'gabarito': _gab_paraiso_2, 'area': lambda n: ordem2[(n - 1) // 6],
    }
    P['unirg-2021-2-paraiso']['ultima_continua'] = True   # a questão 54 continua na página seguinte
    P['unirg-2021-2-paraiso']['suporte_aperto'] = True   # "TEXTO 01" colado na frase "O texto seguinte servirá de base..."
    P['unirg-2021-2-paraiso']['corte'] = P['unirg-2021-2-paraiso']['corte'] + [r'^L[ÍI]NGUA ESTRANGEIRA']
    P['unirg-2021-2-paraiso']['suporte'] = P['unirg-2021-2-paraiso']['suporte'] + [r'(?i)servir[áa] de base para responder']
    # 2025/2: ícones do título "Text for questions..." entravam no pé do print das questões 4, 9 e 15
    _p.PROVAS['unirg-2025-2']['suporte_icone'] = True
    return P

"""Provas dos links do dono (fontes/provas-manuais/, baixadas do Brasil Escola em 11/11/2026), grupo C:
UECE, UEPG, Unioeste, Unimontes, UVA, UEMG, UNEB, EMESCAM, Bahiana e UESB.

MANUAIS: prova -> arquivos de fontes/provas-manuais/ e a página oficial que o site mostra como fonte. A origem real de
cada arquivo (Brasil Escola, ou o site oficial quando o gabarito definitivo veio de lá) fica no manifesto da pasta de
entrada e no campo `origem` do prova.json (princípio 10: o dono decide os direitos).
Só múltipla escolha com gabarito oficial DEFINITIVO; anuladas ficam fora. O que ficou fora e por quê:
docs/provas/faltantes-por-ano.md (seção "Grupo C").

Uso: python3 ferramentas/ingestao/provas_grupo_c.py prepara [<prova-id> ...]   (copia os PDFs para fabrica_saida/ingestao)
"""
import hashlib
import json
import re
import shutil
import sys
from datetime import datetime, timezone
from pathlib import Path

import provas as _p   # módulo parcialmente carregado: texto_pdf(), pares(), duas_colunas() e as provas anteriores já existem

RAIZ = Path(__file__).resolve().parents[2]
FONTE = RAIZ / 'fontes' / 'provas-manuais'
ENTRADA = RAIZ / 'fabrica_saida' / 'ingestao'

MANUAIS = {}
PROVAS = {}


def _m(pid, manifesto, oficial, **arquivos):
    """arquivos: papel -> caminho em fontes/provas-manuais/ ou ('url', <endereço oficial>, <arquivo baixado>)."""
    MANUAIS[pid] = {'manifesto': manifesto, 'oficial': oficial, 'arquivos': arquivos}


def prepara(pid):
    m = MANUAIS[pid]
    reg = json.loads((FONTE / 'manifesto.json').read_text())[m['manifesto']]
    pasta = ENTRADA / pid
    pasta.mkdir(parents=True, exist_ok=True)
    arqs = {}
    for papel, rel in m['arquivos'].items():
        if isinstance(rel, tuple):   # gabarito definitivo baixado do site oficial (não veio no pacote do Brasil Escola)
            _, url, local = rel
            src = FONTE / local
            origem = url + ' (site oficial)'
        else:
            src = FONTE / rel
            url = m['oficial']
            origem = reg['url'] + ' (Brasil Escola, página ' + reg['origem'] + '; arquivo ' + src.name + ')'
        if not src.exists():
            raise SystemExit(f'{pid}: falta {src} — rode baixa_brasilescola.py (origem no manifesto)')
        dst = pasta / f'{papel}.pdf'
        shutil.copyfile(src, dst)
        arqs[papel] = {'url': url, 'origem': origem, 'bytes': dst.stat().st_size,
                       'sha256': hashlib.sha256(dst.read_bytes()).hexdigest(),
                       'copiado_em': datetime.now(timezone.utc).isoformat(timespec='seconds')}
    (pasta / 'manifesto.json').write_text(json.dumps({'prova': pid, 'arquivos': arqs}, ensure_ascii=False, indent=2) + '\n')
    return pasta


# ------------------------------------------------------------------------------------------- UECE, 1ª fase (CEV-UECE)
CEV = 'https://www.uece.br/cev/'


def _uece_gab_ingles(arquivo='gabarito', gabarito=1):
    """Comunicado do gabarito oficial definitivo: blocos 'LÍNGUA INGLESA - GABARITO [DEFINITIVO] 1' com linhas de números
    e de letras ('X' = anulada)."""
    def gab(pasta):
        txt = _p.texto_pdf(pasta / f'{arquivo}.pdf')
        m = re.search(rf'L[ÍI]NGUA INGLESA\s*[-–]\s*GABARITO\s+(?:DEFINITIVO\s+)?{gabarito}\b', txt)
        bloco = txt[m.end():]
        bloco = re.split(r'GABARITO', bloco)[0]
        ls = [l.split() for l in bloco.splitlines() if l.strip()]
        g = {}
        for a, b in zip(ls, ls[1:]):
            if a and all(x.isdigit() for x in a) and len(a) == len(b) and all(re.fullmatch(r'[A-D]|X|\*', x) for x in b):
                for n, v in zip(a, b):
                    g[int(n)] = v if v in 'ABCD' else 'X'
        assert len(g) == 85, (pasta, len(g))
        return g
    return gab


def uece1(ano, sem, comunicado, data):
    """UECE, Vestibular {ano}.{sem}, 1ª fase: Prova de Conhecimentos Gerais, caderno do gabarito 1 (85 questões A–D, duas
    colunas, "01." na margem; mesma diagramação da 2024.1). Língua estrangeira: inglês (as outras línguas são puladas)."""
    cfg = dict(_p.PROVAS['uece-2024-1'])
    cfg.update({
        'ano': str(ano), 'fase': f'{ano}.{sem} – 1ª fase', 'titulo': f'UECE {ano}.{sem}',
        'nota': f'Universidade Estadual do Ceará, Vestibular {ano}.{sem}, 1ª fase (Prova de Conhecimentos Gerais aplicada em '
                f'{data}, caderno do gabarito 1), 85 questões A–D. Língua estrangeira: inglês. Gabarito oficial definitivo '
                f'(Comunicado {comunicado}-CEV/UECE, após recursos); anuladas ficam fora.',
        'cadernos': [{'arquivo': 'caderno', 'paginas': (4, 999)}],
        'gabarito': _uece_gab_ingles(),
        'suporte': cfg['suporte'] + [r'^TEXTO\s+\d+\s*$'],   # 2020.2 e 2022.1: "TEXTO 2" em maiúsculas
    })
    return cfg


_U = 'uece/'
_m('uece-2020-2', 'uece/47289', CEV, caderno=_U + 'provas-e-gabaritos-uece-2020-2/1ª fase/Prova de Conhecimentos Gerais - Gabarito 1.pdf',
   gabarito=_U + 'provas-e-gabaritos-uece-2020-2/1ª fase/gabarito-definitivo-1-fasepdf.pdf')
_m('uece-2021-1', 'uece/47349', CEV, caderno=_U + 'provas-e-gabaritos-uece-2021-1/1ª fase/prova.pdf',
   gabarito=_U + 'provas-e-gabaritos-uece-2021-1/1ª fase/gabarito-definitivo.pdf')
_m('uece-2022-1', 'uece/47410', CEV, caderno=_U + 'provas-e-gabaritos-uece-2022-1/1ª fase/vtb20221f1g1.pdf',
   gabarito=_U + 'provas-e-gabaritos-uece-2022-1/1ª fase/gabarito-primeira-fase-uece.pdf')
PROVAS['uece-2020-2'] = uece1(2020, 2, '48/2020', '06/12/2020')
PROVAS['uece-2021-1'] = uece1(2021, 1, '31/2021', '20/06/2021')
PROVAS['uece-2022-1'] = uece1(2022, 1, '75/2021', '15/11/2021')


# ------------------------------------------------------------------------------------- Unimontes (Cotec/Coteps)
COTEPS = 'https://www.coteps.unimontes.br/'


def _unimontes_grade(arquivo, ate=None):
    """Gabarito em grade (linha de números seguida da linha de letras); a língua 16–19 / 10–12 aparece duas vezes
    (espanhol, depois inglês): vale a 2ª. 'N' = nula."""
    def gab(pasta):
        txt = _p.texto_pdf(pasta / f'{arquivo}.pdf')
        if ate:
            txt = txt.split(ate)[0]
        ls = [l for l in txt.splitlines() if l.strip()]
        g = {}
        for a, b in zip(ls, ls[1:]):
            ns = [int(x) for x in re.findall(r'\b\d{1,2}\b', a)]
            vs = re.findall(r'\b([A-DN])\b', b.replace('RESPOSTAS', ''))
            if ns and len(ns) == len(vs) and not re.search(r'[a-z]', a) and re.fullmatch(r'[\sA-DNRESPOTAS]+', b):
                for n, v in zip(ns, vs):
                    g[n] = v if v != 'N' else 'X'
        return g
    return gab


_m('unimontes-2024-ps1', 'unimontes/47643', COTEPS,
   caderno='unimontes/provas-e-gabaritos-do-vestibular-2024-da-unimontes/Biologicas-grupo-1-gab.pdf',
   gabarito=('url', 'https://www.coteps.unimontes.br/wp-content/uploads/2024/07/Gabarito-Grupo-1-Apos-Recurso.pdf',
             'unimontes/oficial/Gabarito-Grupo-1-Apos-Recurso.pdf'))
PROVAS['unimontes-2024-ps1'] = dict(_p.PROVAS['unimontes-2024'])
PROVAS['unimontes-2024-ps1'].update({
    'fase': 'Processo Seletivo 1/2024, Grupo 1', 'titulo': 'Unimontes 2024 (PS 1/2024)',
    'nota': 'Universidade Estadual de Montes Claros, Processo Seletivo Vestibular 1/2024 (prova de 10/12/2023), Grupo 1, '
            'caderno 101 (Biológicas): 45 questões A–D. Língua estrangeira: inglês (16 a 19). Gabarito oficial após recursos '
            '(Coteps); anuladas ficam fora.',
    'gabarito': _unimontes_grade('gabarito', ate='CADERNO 201'),
    'cadernos': [{'arquivo': 'caderno', 'paginas': (2, 999)}], 'topo': 30,
    # aqui a "INSTRUÇÃO:" de uma questão só vem DEPOIS do "QUESTÃO NN" (faz parte dela); antes da questão, só a dos textos
    # que valem para várias ("responder às questões que a ele se referem")
    'suporte': [r'^INSTRUÇÃO:.*\bquest[õo]es\b', r'^Texto\s+\d+\s*(\(.*\))?$'],
})

_PAES = 'unimontes/provas-e-gabaritos-unimontes-paes-2020/'
_m('unimontes-paes3-2020', 'unimontes/47463', COTEPS, caderno=_PAES + 'Provas/Caderno_3_-_3ª_Etapa_(Biológicas).pdf',
   gabarito=_PAES + 'gabaritos/Gabarito_Oficial_(Após_Recursos)_-_3ª_Etapa_-_Caderno_3_(Biológia).pdf')
PROVAS['unimontes-paes3-2020'] = dict(_p.PROVAS['unimontes-2024'])
PROVAS['unimontes-paes3-2020'].update({
    'ano': '2020', 'fase': 'PAES 2020 – 3ª etapa', 'titulo': 'Unimontes PAES 2020 – 3ª etapa', 'total': 50,
    'nota': 'Universidade Estadual de Montes Claros, PAES 2020 (avaliação seriada), 3ª etapa, caderno 3 (Biológicas), prova '
            'aplicada em 19/12/2021: 50 questões A–D. Língua estrangeira: inglês (10 a 12). Gabarito oficial após recursos '
            '(10/01/2022); anuladas ficam fora.',
    'cadernos': [{'arquivo': 'caderno', 'paginas': (2, 999)}],
    'gabarito': _unimontes_grade('gabarito'),
    'ancora_negrito': False,   # "QUESTÃO 01" em Arial sem marca de negrito na camada de texto
    # o texto de inglês vem logo abaixo do título da seção, sem "INSTRUÇÃO" (conferido no caderno, pág. 8): vale para 10–11
    'suporte_forcado': {('caderno', 8): [(168, 0, (10, 11))]},
    # cada "INSTRUÇÃO:" vale só para a questão seguinte, menos a que fala em "questões" (texto 1, 2 e o do espanhol)
    'suporte_singular': r'^(?!.*quest[õo]es)',
    'suporte_ponto_final': True,   # alternativa D que termina no alto da página seguinte (q27) não vai para a q28
})


# ------------------------------------------------------------------------------------------- Unioeste (Cogeps)
UNIOESTE = 'https://www.unioeste.br/portal/vestibular'
_AREAS_UNIOESTE = [(r'^GEOGRAFIA$', 'Geografia'), (r'^HIST[ÓO]RIA$', 'História'), (r'^FILOSOFIA$', 'Filosofia'),
                   (r'^SOCIOLOGIA$', 'Sociologia'), (r'^BIOLOGIA$', 'Biologia'), (r'^F[ÍI]SICA$', 'Física'),
                   (r'^MATEM[ÁA]TICA$', 'Matemática'), (r'^QU[ÍI]MICA$', 'Química')]


def _unioeste_gab(pasta):
    """Gabarito definitivo: '01 = C' por matéria; 1ª etapa (manhã) com espanhol e inglês (vale o inglês), 2ª etapa
    (tarde) recomeça em 01 (aqui +21). '*' = anulada; '**' = alterada após recurso (vale a letra)."""
    txt = _p.texto_pdf(pasta / 'gabarito.pdf')
    manha, tarde = txt.split('2ª Etapa')
    manha = manha[manha.index('Inglês'):]
    g = {}
    for parte, d in ((manha, 0), (tarde, 21)):
        for n, v in re.findall(r'(\d{2})\s*=\s*\**\s*([A-E*])', parte):
            g[int(n) + d] = v if v in 'ABCDE' else 'X'
    return g


def unioeste(ano, nota_extra=''):
    """Unioeste, Concurso Vestibular {ano}: 1ª etapa (manhã: língua estrangeira 01–07, Língua Portuguesa 08–14,
    Literatura 15–21; caderno do inglês) + 2ª etapa (tarde: Geografia, História, Filosofia, Sociologia, Biologia, Física,
    Matemática e Química, 01–56, aqui 22–77). A–E, "01." em negrito, duas colunas; alternativas "a)"."""
    return {
        'catalogo': 'unioeste', 'escola': 'Unioeste', 'ano': str(ano), 'fase': f'Vestibular {ano}', 'titulo': f'Unioeste {ano}',
        'banca': 'Cogeps-Unioeste', 'duracao_horas': 8.5, 'total': 77, 'alternativas': 5,
        'nota': f'Universidade Estadual do Oeste do Paraná, Concurso Vestibular {ano}: 1ª etapa (manhã; caderno da língua '
                'inglesa: Inglês 1–7, Língua Portuguesa 8–14, Literatura 15–21) e 2ª etapa (tarde; 56 questões, aqui 22–77). '
                'Questões A–E. Redação fora. Gabarito definitivo oficial; anuladas ficam fora.' + nota_extra,
        'cadernos': [{'arquivo': 'manha', 'paginas': (2, 999), 'questoes': (1, 21), 'rotulo': '1ª etapa'},
                     {'arquivo': 'tarde', 'paginas': (2, 999), 'questoes': (22, 77), 'deslocamento': 21, 'rotulo': '2ª etapa'}],
        # páginas ímpares da tarde: uma coluna larga com "Espaço destinado a anotações" à direita; as outras, duas colunas
        'colunas': 'auto', 'margem': 20, 'topo': 48.5, 'base': 36,   # faixa preta do cabeçalho vai até y≈48–49; "08." da 2021 em y≈48,8
        # 2021: "9." sem o zero; "50.As" sem espaço
        'ancora': r'^(\d{1,2})\.(\s|$|(?=[A-ZÀ-Ú]))', 'ancora_dx': 32, 'sequencial': True, 'ancora_negrito': True,
        # faixa preta com o nome da matéria seguinte, no meio da coluna, encerra a questão anterior
        'corte': [r'(?i)^Espa[çc]o destinado a anota', r'(?i)^REDA[ÇC][ÃA]O$', r'(?i)^RASCUNHO',
                  r'^(GEOGRAFIA|HIST[ÓO]RIA|FILOSOFIA|SOCIOLOGIA|BIOLOGIA|F[ÍI]SICA|MATEM[ÁA]TICA|QU[ÍI]MICA|L[ÍI]NGUA PORTUGUESA|'
                  r'LITERATURA BRASILEIRA|L[ÍI]NGUA INGLESA)\s*$'],
        'suporte': [r'(?i)(leia|responda|responder)\b.*\b(às|as)\s+quest[õo]es\s+\d', r'(?i)^texto-base para as quest',
                    r'(?i)^(leia|responda).*\bquest[õo]es\s+\d'],
        'gabarito': _unioeste_gab, 'area': lambda n: 'Conhecimentos gerais', 'area_da_materia': True,
        'alternativa_rx': r'^[a-e]\)',
    }


_UO = 'unioeste/'
_m('unioeste-2021', 'unioeste/47374', UNIOESTE, manha=_UO + 'provas-e-gabaritos-unioeste-2021/prova-ingles-manha-unioeste2021.pdf',
   tarde=_UO + 'provas-e-gabaritos-unioeste-2021/provas-tarde-unioeste-2021.pdf',
   gabarito=_UO + 'provas-e-gabaritos-unioeste-2021/Gabarito_Definitivo.pdf')
_U22 = _UO + 'provas-e-gabaritos-unioeste-2022/provas-e-gabaritos-unioeste-2022/'
_m('unioeste-2022', 'unioeste/47532', UNIOESTE, manha=_U22 + 'prova-Ingles.pdf', tarde=_U22 + 'prova-tarde.pdf',
   gabarito=_U22 + 'gabarito-definitivo-unioeste-vestibular-2022.pdf')
PROVAS['unioeste-2021'] = unioeste(2021)
PROVAS['unioeste-2022'] = unioeste(2022)
# 2021: o texto de Língua Portuguesa (pág. 5 da manhã) começa pelo título; a instrução "responda as questões de 08 a 14"
# vem no fim do texto (conferido no caderno)
PROVAS['unioeste-2021']['suporte_forcado'] = {('manha', 5): [(50, 0, (8, 14))]}
PROVAS['unioeste-2022']['topo_pag'] = {20: 26}   # pág. 20 da tarde sem cabeçalho: "44." em y≈29


if __name__ == '__main__':
    if sys.argv[1:2] == ['prepara']:
        for pid in (sys.argv[2:] or list(MANUAIS)):
            print(prepara(pid))

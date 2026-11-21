"""Inventário das provas de 2020 a 2026 para o artefato "Provas para baixar" do dono.

Lê o repositório e diz, por instituição e ano:
  1. o que JÁ ESTÁ no site (pastas app/conteudo-fonte/provas/<id>/prova.json: instituição, ano, fase, questões,
     questões com resolução e questões ainda sem gabarito oficial, que esperam o gabarito do Aprendice);
  2. o que é INDISPONÍVEL de verdade (a prova não existiu, não foi publicada, saiu do ar, ou fica fora por formato
     ou decisão do dono) — tabela INDISPONIVEIS abaixo, tirada de docs/provas/*.md e das observações do dono;
  3. o que o dono ainda precisa BAIXAR À MÃO (linhas da coleção `provas` do artefato que não estão no site).

Uso:
  python3 ferramentas/provas/inventario_provas.py                      -> inventário em JSON na saída padrão
  python3 ferramentas/provas/inventario_provas.py --saida inv.json     -> grava em arquivo
  python3 ferramentas/provas/inventario_provas.py --db DIR --versoes V.json --lotes PASTA
      DIR  = pasta que o ArtifactData gravou com `action: list`, `collection: provas`, `out_dir` (um JSON por linha);
      V    = {doc_id: version} das linhas lidas (a listagem do ArtifactData mostra a versão de cada uma);
             as da coleção nosite entram como "nosite/<id>";
      PASTA= onde gravar os lotes de escrita (lote-01.json ... até 50 escritas cada) para o `batch` do ArtifactData,
             já com `if_version` nas linhas que existem. Nunca mexe em prova, gabarito, baixei, baixeiEm, obs.

Passo a passo completo: docs/provas/ARTEFATO-PROVAS.md.
"""
import argparse
import datetime
import glob
import json
import os
import re
import sys

RAIZ = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
PROVAS = os.path.join(RAIZ, 'app', 'conteudo-fonte', 'provas')
CATALOGO = os.path.join(RAIZ, 'app', 'conteudo-fonte', 'catalogo-vestibulares.json')
ANO_MIN, ANO_MAX = 2020, 2026
CAMPOS_DO_DONO = ('prova', 'gabarito', 'baixei', 'baixeiEm', 'obs')   # nunca escritos por este script

# Nome que o artefato mostra para cada catalogoId (o artefato já usava estes nomes).
NOME = {
    'santacasa': 'Santa Casa SP', 'saocamilo': 'São Camilo', 'cmmg': 'CMMG', 'ufjf': 'UFJF (PISM 3)',
    'puccampinas': 'PUC-Campinas', 'pucminas': 'PUC Minas', 'pucrio': 'PUC-Rio', 'pucsp': 'PUC-SP',
    'uepa': 'Uepa', 'uncisal': 'Uncisal', 'anhembi': 'Anhembi Morumbi', 'fema': 'Fema',
}
REGIAO_EXTRA = {'anhembi': 'Sudeste', 'fema': 'Sudeste'}
# Nome da instituição no artefato -> catalogoId das provas do site.
INST_ID = {
    'Acafe': 'acafe', 'Bahiana': 'bahiana', 'CMMG': 'cmmg', 'Einstein': 'einstein', 'EMESCAM': 'emescam',
    'Famema': 'famema', 'Fatec': 'fatec', 'Fempar': 'fempar', 'FMABC': 'fmabc', 'FMJ': 'fmj', 'IME': 'ime',
    'Mackenzie': 'mackenzie', 'PUC-Campinas': 'puccampinas', 'PUC Minas': 'pucminas', 'PUC-Rio': 'pucrio',
    'PUC-SP': 'pucsp', 'PUCPR': 'pucpr', 'PUCRS': 'pucrs', 'Santa Casa SP': 'santacasa', 'São Camilo': 'saocamilo',
    'UDESC': 'udesc', 'UEA': 'uea', 'UECE': 'uece', 'UEFS': 'uefs', 'UEMA': 'uema', 'UEMG': 'uemg', 'UEMS': 'uems',
    'Uepa': 'uepa', 'UERJ': 'uerj', 'UERN': 'uern', 'UERR': 'uerr', 'UESB': 'uesb', 'UFG': 'ufg',
    'UFJF (PISM 3)': 'ufjf', 'UFRR': 'ufrr', 'UFSM': 'ufsm', 'UFT': 'uft', 'UFT (Exato)': 'uft-exato',
    'Uncisal': 'uncisal', 'UNEB': 'uneb', 'UNEMAT': 'unemat', 'Unespar': 'unespar', 'Unicamp': 'unicamp',
    'Unicentro': 'unicentro', 'Unifenas': 'unifenas', 'Unifesp': 'unifesp', 'Unifor': 'unifor',
    'Unimontes': 'unimontes', 'Unioeste': 'unioeste', 'UNIRG': 'unirg', 'URCA': 'urca', 'UTFPR': 'utfpr', 'UVA': 'uva',
}

# ---------------------------------------------------------------------------------------------------------------
# Decisões conferidas à mão (19/11/2026). Atualize aqui quando uma prova entrar no site ou ficar indisponível.
# ---------------------------------------------------------------------------------------------------------------

# Linha do artefato -> provas do site que a cobrem (a linha sai de "faltam" e vai para "já no site").
LINHA_NO_SITE = {
    'einstein-2020': ['einstein-2020'], 'einstein-2022': ['einstein-2022'], 'einstein-2024': ['einstein-2024'],
    'einstein-2025': ['einstein-2025'], 'einstein-2026': ['einstein-2026'],
    'famema-2020': ['famema-2020'], 'famema-2021': ['famema-2021'], 'famema-2022': ['famema-2022'],
    'famema-2024': ['famema-2024'], 'famema-2025': ['famema-2025'], 'famema-2026': ['famema-2026'],
    'fmj-2024': ['fmj-2024'], 'fmj-2025': ['fmj-2025'], 'fmj-2026': ['fmj-2026'],
    'santa-casa-sp-2020': ['santacasa-2020'], 'santa-casa-sp-2023': ['santacasa-2023'],
    'santa-casa-sp-2024': ['santacasa-2024'], 'santa-casa-sp-2025': ['santacasa-2025'],
    'santa-casa-sp-2026': ['santacasa-2026'],
    'unifesp-2020': ['unifesp-2020'], 'unifesp-2021': ['unifesp-2021'], 'unifesp-2023': ['unifesp-2023'],
    'unifesp-2024': ['unifesp-2024'], 'unifesp-2025': ['unifesp-2025'],
    'sao-camilo-2025-1': ['saocamilo-2025-1'], 'sao-camilo-2025-2': ['saocamilo-2025-2'],
    'ufrr-2024': ['ufrr-2024'], 'uft-2024-2': ['uft-2024-2'],
    # Entraram com o gabarito preliminar (princípio 2, 11/11/2026): no ar com o gabarito do Aprendice;
    # se o definitivo aparecer, ele substitui. Não é mais tarefa de baixar.
    'emescam-2022-1': ['emescam-2022-1'], 'ime-2024': ['ime-2024'], 'ime-2025': ['ime-2025'],
    'uece-2025-2': ['uece-2025-2'], 'ufrr-2025': ['ufrr-2025'], 'ufrr-2026': ['ufrr-2026'],
    'uft-2023-2': ['uft-2023-2'], 'unirg-2023-1': ['unirg-2023-1'],
}

# Linhas do artefato que passam a "Indisponíveis" (grupo 3), com o motivo.
DONO = 'O dono procurou e anotou "não disponível no momento"'
LINHA_INDISPONIVEL = {
    'acafe-2020-so-existe-a-comentada': 'Só existe a prova comentada, com a letra certa impressa em cada questão; caderno limpo não publicado.',
    'fatec-2021': 'Não houve vestibular em 2021 (pandemia); o de 1º semestre de 2022 também não.',
    'puc-campinas-2020': 'Em 2020 só houve a prova específica discursiva; o site usa só múltipla escolha.',
    'puc-sp-2020-a-2023': '2021 a 2023: provas on-line publicadas só como "correção", sem número nem letra nas alternativas. 2020: o caderno existe, mas a diagramação de revista ainda não é recortada pelo site (trabalho nosso, nada a baixar).',
    'pucrs-2020-2021-2024': DONO + '; 2024 sem prova localizada.',
    'udesc-2021-2022': '2021 e 2022 sem caderno publicado no site da UDESC.',
    'uefs-2020-a-2026': DONO + '.',
    'uema-2023-2025': 'PAES 2023 e 2025 sem caderno no site oficial; ' + DONO.lower() + '.',
    'uemg-2021': DONO + '.',
    'uemg-2026': DONO + '.',
    'uepa-2020-a-2026': DONO + '.',
    'uern-2020-a-2026': DONO + '.',
    'ufg-2020-a-2026': DONO + '.',
    'ufjf-pism-3-2021': 'PISM III 2021 sem caderno no site da UFJF.',
    'ufsm-2020-a-2024': 'A UFSM só teve vestibular próprio em 2025 e 2026 (antes, PSS/Sisu); ' + DONO.lower() + ' para 2020 e 2021.',
    'uncisal-2020-a-2026': DONO + '.',
    'unemat-2020-2021': 'Não houve prova em 2020 e 2021 (pandemia); ' + DONO.lower() + '.',
    'unespar-2020-a-2022': '2020/21 e 2021/22 sem prova objetiva; ' + DONO.lower() + '.',
    'unifor-2020-a-2024': DONO + '.',
    'unioeste-2020': 'Link oficial quebrado (404); ' + DONO.lower() + '.',
    'unioeste-2023': DONO + ' (o gabarito definitivo chegou a ser publicado na página da Unioeste).',
    'unioeste-2024': DONO + ' (o gabarito definitivo chegou a ser publicado na página da Unioeste).',
    'unioeste-2025': DONO + ' (o gabarito definitivo chegou a ser publicado na página da Unioeste).',
    'unioeste-2026': DONO + ' (o gabarito definitivo chegou a ser publicado na página da Unioeste).',
    'urca-2020-a-2022': DONO + '.',
    'utfpr-2020-a-2023': 'A UTFPR só tem vestibular próprio (Verão) desde 2024; antes, só Sisu. ' + DONO + '.',
    'sao-camilo-2026-2': DONO + '.',
}

# Notas extras em linhas que continuam onde estão.
LINHA_NOTA = {
    'uerr-2020-a-2022-2024': 'O dono anotou: 2020 não disponível; 2021, 2022 e 2024 estão no Drive (falta integrar). No site: UERR 2023, 2025 e 2026.',
    'puc-rio-2021-2022': 'As provas de 2021 e 2022 existem num pacote .zip com gabaritos comentados em outro formato; se você achar o caderno e o gabarito oficial separados, ajuda.',
    'pucpr-2020-a-2022': '2021 foi o Vestibular 4.0 digital e 2022 publicou o caderno-gabarito sem letras nas alternativas; o que mais vale procurar é 2020.',
    'uece-2022-2': 'No site já está a 2ª fase de 2022.2; falta só a 1ª fase.',
    'fmj-2020': 'Ainda não está no site (o Objetivo só tem FMJ a partir de 2024).',
    'fmj-2023': 'Ainda não está no site (o Objetivo só tem FMJ a partir de 2024).',
    'famema-2023': 'Ainda não está no site: falta o caderno da Prova II, versão 1.',
}

# Provas que faltam e ainda não tinham linha: baixar no navegador (grupo 1) ou não achadas (grupo 2).
VUNESP = ('https://www.vunesp.com.br', 'Vunesp (página do concurso; bloqueia acesso automático)')
NOVAS_FALTAS = (
    [dict(inst='Anhembi Morumbi', regiao='SP', ano=a, grupo=1, link=VUNESP[0], onde=VUNESP[1],
          falta='caderno da Prova II (objetiva) + gabarito definitivo (Medicina)',
          nota='Não confirmado se a Vunesp publica o caderno desta prova.') for a in ('2020', '2021', '2023', '2024', '2025', '2026')]
    + [dict(inst='Fema (Medicina)', regiao='SP', ano=a, grupo=1, link=VUNESP[0], onde=VUNESP[1],
            falta='caderno + gabarito definitivo (Medicina; os cursos gerais 2021–2022 já estão no site)') for a in ('2023', '2024', '2025', '2026')]
    + [dict(inst='FACISB', regiao='SP', ano=str(a), grupo=1, link=VUNESP[0], onde=VUNESP[1],
            falta='caderno + gabarito definitivo') for a in range(2020, 2027)]
    + [dict(inst='FAI (Adamantina)', regiao='SP', ano=str(a), grupo=1, link=VUNESP[0], onde=VUNESP[1],
            falta='caderno + gabarito definitivo (Medicina)') for a in range(2020, 2027)]
    + [dict(inst='Sírio-Libanês', regiao='SP', ano=a, grupo=1, link=VUNESP[0], onde=VUNESP[1],
            falta='caderno + gabarito definitivo (Medicina; primeiras turmas em 2025)') for a in ('2025', '2026')]
    + [dict(inst='Uni-Facef', regiao='SP', ano=str(a), grupo=1, link=VUNESP[0], onde=VUNESP[1],
            falta='caderno + gabarito definitivo') for a in range(2020, 2027)]
    + [dict(inst='Insper', regiao='SP', ano=str(a), grupo=1, link='https://www.insper.edu.br',
            onde='insper.edu.br, "Provas e gabaritos" (bloqueia acesso automático)', falta='caderno + gabarito definitivo') for a in range(2020, 2027)]
    + [dict(inst='EsPCEx', regiao='Sudeste', ano=str(a), grupo=1, link='https://www.espcex.eb.mil.br',
            onde='espcex.eb.mil.br, página do concurso de cada ano', falta='caderno + gabarito definitivo') for a in range(2020, 2027)]
    + [dict(inst='AFA', regiao='Sudeste', ano=str(a), grupo=1, link='https://www.fab.mil.br/ingresso/',
            onde='fab.mil.br/ingresso (editais, provas e gabaritos)', falta='caderno + gabarito definitivo') for a in range(2020, 2027)]
    + [dict(inst='EFOMM', regiao='Sudeste', ano=str(a), grupo=1, link='https://www.marinha.mil.br/ciaga/',
            onde='marinha.mil.br/ciaga (processo seletivo, provas anteriores)', falta='caderno + gabarito definitivo') for a in range(2020, 2027)]
    + [dict(inst='EN (Escola Naval)', regiao='Sudeste', ano=str(a), grupo=1, link='https://www.marinha.mil.br/sspm/escola-naval/en_princ',
            onde='marinha.mil.br/sspm/escola-naval', falta='caderno + gabarito definitivo') for a in range(2020, 2027)]
    + [dict(inst='UECE', regiao='Nordeste', ano='2020.1', grupo=2, link='https://www.uece.br/cev', onde='uece.br/cev',
            falta='caderno + gabarito definitivo da 1ª fase (link oficial quebrado, 404)'),
       dict(inst='UFT', regiao='Norte', ano='2020/1', grupo=2, link='https://www.uft.edu.br', onde='uft.edu.br, ingresso na graduação',
            falta='caderno + gabarito definitivo (link quebrado, 404)'),
       dict(inst='Unitins', regiao='Norte', ano='2020 (Paraíso)', grupo=2, link='https://www.unitins.br', onde='unitins.br, vestibular',
            falta='caderno + gabarito definitivo (link quebrado, 404)')]
)

# Indisponíveis que não tinham linha (grupo 3).
NOVAS_INDISPONIVEIS = [
    dict(inst='FURG', regiao='Sul', ano='2020 a 2026', motivo='Sem prova própria: ingresso só pelo Sisu. O vestibular volta em 2027 (prova em dez/2026).'),
    dict(inst='UEMASUL', regiao='Nordeste', ano='2020 a 2026', motivo='Sem prova própria: usa o PAES da UEMA (já no site).'),
    dict(inst='UFNT', regiao='Norte', ano='2020 a 2026', motivo='Mesmo caderno da UFT (não se duplica).'),
    dict(inst='FECAP', regiao='SP', ano='2020 a 2026', motivo='Não publica as provas do vestibular de graduação.'),
    dict(inst='Inteli', regiao='SP', ano='2020 a 2026', motivo='Prova on-line variável, não publicada.'),
    dict(inst='FGV', regiao='SP', ano='2020 a 2026', motivo='O site só mostra a edição vigente; as anteriores saíram do ar.'),
    dict(inst='Mauá', regiao='SP', ano='2020 a 2026', motivo='Até 2021, prova on-line com alternativas sem letra; de 2022 em diante, sem caderno publicado.'),
    dict(inst='UFRGS', regiao='Sul', ano='2022 a 2026', motivo='A Coperse vende as provas; o dono decidiu não comprar.'),
    dict(inst='UnB (PAS)', regiao='Centro-Oeste', ano='2020 a 2026', motivo='Fora por formato: quase tudo certo/errado (o site usa só múltipla escolha).'),
    dict(inst='UEM', regiao='Sul', ano='2020 a 2026', motivo='Fora por formato: somatória (decisão do dono).'),
    dict(inst='UFSC', regiao='Sul', ano='2020 a 2026', motivo='Fora por formato: somatória e respostas numéricas (decisão do dono).'),
    dict(inst='UEPG', regiao='Sul', ano='2020 a 2026', motivo='Fora por formato: somatória (decisão do dono).'),
    dict(inst='UFT', regiao='Norte', ano='2020/2 a 2021', motivo='Seleção pelo Sisu na pandemia; não houve prova.'),
    dict(inst='Unitins', regiao='Norte', ano='2020/2', motivo='Ingresso pelo Sisu; não houve prova.'),
    dict(inst='UNIRG', regiao='Norte', ano='Gurupi 2020/2 a 2021/2', motivo='Provas on-line na pandemia; cadernos não publicados.'),
    dict(inst='UVA', regiao='Nordeste', ano='2022.2 a 2026.2', motivo='Seleções do 2º semestre sem caderno publicado.'),
]


def slug(s):
    s = s.lower()
    for a, b in (('áàâã', 'a'), ('éê', 'e'), ('í', 'i'), ('óôõ', 'o'), ('ú', 'u'), ('ç', 'c')):
        for c in a:
            s = s.replace(c, b)
    return re.sub(r'[^a-z0-9]+', '-', s).strip('-')


def anos_de(texto):
    """'2020 a 2023' -> {2020..2023}; '2020, 2021, 2024' -> {...}; '2023/1' -> {2023}."""
    t = str(texto)
    anos = set()
    for a, b in re.findall(r'(20\d\d)\s*a\s*(20\d\d)', t):
        anos |= set(range(int(a), int(b) + 1))
    anos |= {int(x) for x in re.findall(r'20\d\d', t)}
    return anos


def provas_no_site():
    cat = {}
    if os.path.exists(CATALOGO):
        for p in json.load(open(CATALOGO, encoding='utf-8'))['provas']:
            cat[p['id']] = p
    por_inst = {}
    for arq in sorted(glob.glob(os.path.join(PROVAS, '*', 'prova.json'))):
        d = json.load(open(arq, encoding='utf-8'))
        pasta = os.path.dirname(arq)
        com_res = set()
        for r in glob.glob(os.path.join(pasta, 'resolucoes-*.json')):
            try:
                com_res |= set(json.load(open(r, encoding='utf-8')))
            except (ValueError, OSError):
                pass
        qs = d.get('questoes') or []
        cid = d.get('catalogoId') or d['id'].split('-')[0]
        c = cat.get(cid, {})
        inst = por_inst.setdefault(cid, {
            'id': cid, 'inst': NOME.get(cid, d.get('escola') or cid),
            'regiao': c.get('regiao') or REGIAO_EXTRA.get(cid, ''), 'provas': []})
        inst['provas'].append({
            'id': d['id'], 'ano': str(d.get('ano') or ''), 'fase': d.get('fase') or '', 'titulo': d.get('titulo') or '',
            'questoes': len(qs),
            'resolucoes': sum(1 for q in qs if q.get('id') in com_res),
            'semGabaritoOficial': sum(1 for q in qs if not q.get('gab')),
        })
    for inst in por_inst.values():
        inst['provas'].sort(key=lambda p: (p['ano'], p['id']))
        inst['anos'] = sorted({p['ano'] for p in inst['provas']})
        inst['anosMeta'] = sorted({p['ano'] for p in inst['provas'] if p['ano'].isdigit() and ANO_MIN <= int(p['ano']) <= ANO_MAX})
        inst['nProvas'] = len(inst['provas'])
        inst['questoes'] = sum(p['questoes'] for p in inst['provas'])
        inst['resolucoes'] = sum(p['resolucoes'] for p in inst['provas'])
    return por_inst


def novos_docs():
    docs = {}
    for i, r in enumerate(NOVAS_FALTAS):
        doc_id = slug(r['inst'] + '-' + r['ano'])
        docs[doc_id] = dict(r, ordem=(140 if r['grupo'] == 1 else 190) + i / 10, obs='', prova=False, gabarito=False, baixei=False)
    for i, r in enumerate(NOVAS_INDISPONIVEIS):
        doc_id = slug(r['inst'] + '-' + r['ano'])
        docs[doc_id] = dict(r, grupo=3, ordem=200 + i, falta='nada a baixar', link='', onde='', obs='',
                            prova=False, gabarito=False, baixei=False)
    return docs


def reconcilia(db_dir, site):
    """Lê as linhas do artefato e devolve (atualizações {doc_id: campos}, suspeitas [texto])."""
    idx = {p['id']: (inst, p) for inst in site.values() for p in inst['provas']}
    upd, suspeitas = {}, []
    for arq in sorted(glob.glob(os.path.join(db_dir, '*.json'))):
        doc_id = os.path.basename(arq)[:-5]
        r = json.load(open(arq, encoding='utf-8'))
        r = r.get('data', r)
        campos = {}
        if doc_id in LINHA_NO_SITE:
            ids = LINHA_NO_SITE[doc_id]
            ps = [idx[i][1] for i in ids if i in idx]
            if len(ps) != len(ids):
                print('AVISO: prova do site não encontrada para', doc_id, ids, file=sys.stderr)
            txt = '; '.join('%s (%d questões%s)' % (p['titulo'] or p['id'], p['questoes'],
                            ', gabarito do Aprendice em preparação' if p['semGabaritoOficial'] else '') for p in ps)
            campos = {'noSite': True, 'noSiteIds': ids, 'falta': 'Já no site: ' + txt + '.'}
            if not r.get('faltaAntes'):
                campos['faltaAntes'] = r.get('falta', '')
        elif doc_id in LINHA_INDISPONIVEL:
            campos = {'grupo': 3, 'motivo': LINHA_INDISPONIVEL[doc_id]}
            if r.get('grupo') != 3:
                campos['grupoAntes'] = r.get('grupo')
        if doc_id in LINHA_NOTA:
            campos['nota'] = LINHA_NOTA[doc_id]
        if not campos and r.get('grupo') in (1, 2):
            cid = INST_ID.get(r.get('inst'))
            anos = anos_de(r.get('ano'))
            inst = site.get(cid)
            if inst:
                bate = [p['id'] for p in inst['provas'] if p['ano'].isdigit() and int(p['ano']) in anos]
                if bate:
                    suspeitas.append('%s (%s %s): o site tem %s — conferir se é a mesma prova' % (doc_id, r['inst'], r['ano'], ', '.join(bate)))
        for k in CAMPOS_DO_DONO:
            campos.pop(k, None)
        if campos:
            campos['atualizadoEm'] = datetime.date.today().isoformat()
            upd[doc_id] = campos
    return upd, suspeitas


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--saida')
    ap.add_argument('--db', help='pasta com as linhas da coleção provas (out_dir do ArtifactData)')
    ap.add_argument('--versoes', help='JSON {doc_id: version} das linhas lidas')
    ap.add_argument('--lotes', help='pasta para gravar os lotes de escrita do ArtifactData')
    a = ap.parse_args()

    site = provas_no_site()
    novos = novos_docs()
    inv = {
        'geradoEm': datetime.date.today().isoformat(),
        'noSite': sorted(site.values(), key=lambda i: i['inst'].lower()),
        'resumoNoSite': {'instituicoes': len(site), 'provas': sum(i['nProvas'] for i in site.values()),
                         'provas2020a2026': sum(1 for i in site.values() for p in i['provas']
                                                if p['ano'].isdigit() and ANO_MIN <= int(p['ano']) <= ANO_MAX),
                         'questoes': sum(i['questoes'] for i in site.values())},
        'linhasNoSite': LINHA_NO_SITE,
        'indisponiveis': [dict(id=k, motivo=v) for k, v in LINHA_INDISPONIVEL.items()]
                         + [dict(id=k, inst=v['inst'], ano=v['ano'], motivo=v['motivo']) for k, v in novos.items() if v['grupo'] == 3],
        'novasFaltas': {k: v for k, v in novos.items() if v['grupo'] in (1, 2)},
    }
    if a.db:
        upd, suspeitas = reconcilia(a.db, site)
        inv['atualizacoes'] = upd
        inv['suspeitas'] = suspeitas
        if a.lotes:
            versoes = json.load(open(a.versoes)) if a.versoes else {}
            existentes = {os.path.basename(f)[:-5] for f in glob.glob(os.path.join(a.db, '*.json'))}
            writes = []
            for doc_id, campos in upd.items():
                w = {'op': 'update', 'collection': 'provas', 'doc_id': doc_id, 'data': campos}
                if doc_id in versoes:
                    w['if_version'] = versoes[doc_id]
                writes.append(w)
            for doc_id, d in novos.items():
                if doc_id in existentes:
                    continue
                writes.append({'op': 'set', 'collection': 'provas', 'doc_id': doc_id, 'data': d})
            for inst in site.values():
                d = {k: inst[k] for k in ('inst', 'regiao', 'anos', 'anosMeta', 'nProvas', 'questoes', 'resolucoes')}
                d['provas'] = [{k: p[k] for k in ('id', 'ano', 'fase', 'questoes', 'resolucoes', 'semGabaritoOficial')} for p in inst['provas']]
                d['ordem'] = inst['inst'].lower()
                d['atualizadoEm'] = inv['geradoEm']
                writes.append({'op': 'set', 'collection': 'nosite', 'doc_id': inst['id'], 'data': d})
            writes.append({'op': 'set', 'collection': 'nosite', 'doc_id': '_resumo',
                           'data': dict(inv['resumoNoSite'], ordem='~', atualizadoEm=inv['geradoEm'])})
            for w in writes:   # nosite já existente: a versão vem como "nosite/<id>" no arquivo de versões
                if w['collection'] == 'nosite' and 'nosite/' + w['doc_id'] in versoes:
                    w['if_version'] = versoes['nosite/' + w['doc_id']]
            os.makedirs(a.lotes, exist_ok=True)
            for n in range(0, len(writes), 50):
                json.dump(writes[n:n + 50], open(os.path.join(a.lotes, 'lote-%02d.json' % (n // 50 + 1)), 'w', encoding='utf-8'),
                          ensure_ascii=False, indent=1)
            print('%d escritas em %d lotes em %s' % (len(writes), (len(writes) + 49) // 50, a.lotes), file=sys.stderr)
    out = json.dumps(inv, ensure_ascii=False, indent=1)
    if a.saida:
        open(a.saida, 'w', encoding='utf-8').write(out)
    else:
        print(out)


if __name__ == '__main__':
    main()

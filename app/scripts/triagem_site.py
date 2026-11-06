#!/usr/bin/env python3
"""Triagem das questões copiadas de sites didáticos (tipo "site" em app-atual/<m>/dados.json).

Comando 21 do dono (docs/questoes-aprendice.md, passo 1): nenhuma questão de site aparece no site.
Para cada uma, decide o destino:
  questao_de_prova:<id>       a mesma questão existe numa prova que o site JÁ TEM (conteudo-fonte/provas/*/prova.json,
                              print e gabarito oficiais) ou no banco antigo de provas; o histórico do aluno vai para ela
  prova_a_baixar:<inst>/<ano> o enunciado cita banca e ano, e a prova oficial está nos inventários (docs/provas/inventario-*.json)
                              ou é do ENEM (INEP publica todas); baixar depois e conferir se a questão está lá
  questao_aprendice           nada acima: entra uma Questão Aprendice do mesmo conteúdo e nível (fábrica + lentes)

"Mesma questão": texto quase igual (palavras do enunciado e das alternativas, >= 0,85 do texto menor, com pelo menos
12 palavras) e o mesmo gabarito. Os pares achados foram conferidos também pelo print (registro em "conferido").

Nada é baixado nem apagado. Saída: docs/provas/triagem-questoes-site.json e .md.
Uso: python3 scripts/triagem_site.py
"""
import glob, json, os, re, unicodedata
from collections import Counter, defaultdict

AQUI = os.path.dirname(os.path.abspath(__file__))
APP = os.path.dirname(AQUI)
RAIZ = os.path.dirname(APP)
ORIGEM = os.path.join(RAIZ, 'app-atual')
PROVAS = os.path.join(APP, 'conteudo-fonte', 'provas')
DOCS = os.path.join(RAIZ, 'docs', 'provas')
MATERIAS = ['bio', 'qui', 'mat', 'por']
LIMIAR, MIN_PALAVRAS = 0.85, 12

# pares conferidos a olho (texto do site x print do PDF oficial) no comando 21
CONFERIDOS = {
    'W943f6db', 'W0118eab', 'W1316955', 'W0a9fd2f', 'W491d7ba', 'W50e87d5', 'W0ddd0b4', 'Wd135a0d', 'W821d598',
}


def ler(p):
    with open(p, encoding='utf-8') as f:
        return json.load(f)


def sem_acento(s):
    return unicodedata.normalize('NFKD', s or '').encode('ascii', 'ignore').decode()


def palavras(s):
    return {w for w in re.findall(r'[a-z0-9]+', sem_acento(s).lower()) if len(w) >= 4}


def texto_q(q):
    return (q.get('enun') or '') + ' ' + ' '.join((q.get('alts') or {}).values())


# citação no início do enunciado -> sigla do inventário (ou ENEM). Ordem importa (mais específico primeiro).
INSTITUICOES = [
    (r'\benem\b|\binep\b', 'ENEM'), (r'fuvest|\busp\b', 'USP'), (r'puc\W*(sp|s\.\s*p)\b', 'PUC-SP'),
    (r'puc\W*rs|pucrs', 'PUCRS'), (r'puc\W*camp|puccamp|pucc\b|puc\W*campinas', 'PUC-Campinas'),
    (r'puc\W*(rj|rio)', 'PUC-Rio'), (r'puc\W*mg|puc minas', 'PUC Minas'), (r'puc\W*pr|pucpr', 'PUCPR'),
    (r'unesp|vunesp', 'Unesp'), (r'unifesp', 'Unifesp'), (r'unicamp|comvest', 'Unicamp'), (r'\bmack', 'Mackenzie'),
    (r'\bfgv\b', 'FGV'), (r'\butfpr\b', 'UTFPR'), (r'\bufpr\b', 'UFPR'), (r'\buel\b', 'UEL'), (r'\bufu\b', 'UFU'),
    (r'\budesc\b', 'UDESC'), (r'fatec|ceeteps', 'Fatec'), (r'\bita\b', 'ITA'), (r'\bime\b', 'IME'),
    (r'\bunifor\b', 'Unifor'), (r'\buerr\b', 'UERR'), (r'\bupe\b', 'UPE'), (r'\bueg\b', 'UEG'),
    (r'\buemasul\b', 'UEMASUL'), (r'\buema\b', 'UEMA'), (r'\bufam\b', 'UFAM'), (r'\bufjf\b', 'UFJF'),
    (r'ufrgs|\bufrs\b', 'UFRGS'), (r'\bufsm\b', 'UFSM'), (r'famerp', 'Famerp'), (r'famema', 'Famema'),
    (r'einstein', 'Einstein'), (r'santa casa|fcmsc', 'FCMSCSP'), (r'\buerj\b', 'UERJ'), (r'\bunb\b', 'UnB'),
    (r'\buece\b', 'UECE'), (r'\burca\b', 'URCA'), (r'unitins', 'Unitins'), (r'unemat', 'UNEMAT'),
    (r'unicentro', 'Unicentro'), (r'\buems\b', 'UEMS'), (r'\buea\b', 'UEA'), (r'facisb', 'FACISB'),
    (r'\bufsc\b', 'UFSC'), (r'\buem\b', 'UEM'), (r'\buepg\b', 'UEPG'), (r'unioeste', 'Unioeste'), (r'\buva\b', 'UVA'),
    (r'\bfurg\b', 'FURG'), (r'\buneb\b', 'UNEB'), (r'\buesb\b', 'UESB'), (r'unimontes', 'Unimontes'),
    (r'unespar', 'Unespar'), (r'emescam', 'EMESCAM'), (r'\bfmabc\b', 'FMABC'), (r'cederj', 'Cederj'),
    (r'\bacafe\b', 'ACAFE'), (r'fcmmg|cmmg', 'FCMMG'), (r's[aã]o camilo', 'São Camilo'), (r'\bfmj\b', 'FMJ'),
]
# sigla do inventário -> prefixo das provas já no site (conteudo-fonte/provas/<prefixo>-<ano>...)
PREFIXO_SITE = {'USP': 'fuvest', 'ENEM': 'enem', 'PUC-SP': 'pucsp', 'PUCRS': 'pucrs', 'PUC-Campinas': 'puccampinas',
                'UTFPR': 'utfpr', 'UFPR': 'ufpr', 'UEL': 'uel', 'UFU': 'ufu', 'UDESC': 'udesc', 'Fatec': 'fatec',
                'ITA': 'ita', 'Unifor': 'unifor', 'UERR': 'uerr', 'UPE': 'upe-ssa3', 'UEG': 'ueg', 'UEMA': 'uema-paes',
                'UFAM': 'ufam-psc3', 'UFJF': 'ufjf-pism3', 'FMABC': 'fmabc', 'Cederj': 'cederj', 'ACAFE': 'acafe',
                'FCMMG': 'cmmg', 'São Camilo': 'saocamilo'}


def citacao(enun):
    """'(Fuvest-SP)' no início do enunciado (às vezes depois de 'Questão 1')."""
    m = re.match(r'\s*(?:quest[aã]o\s*\d+\s*)?\(([^)]{2,70})\)', enun or '', re.I)
    return m.group(1).strip() if m else None


def instituicao(cit):
    if not cit:
        return None
    c = sem_acento(cit).lower()
    for rx, sigla in INSTITUICOES:
        if re.search(rx, c):
            return sigla
    return None


def ano_citado(cit):
    m = re.search(r'(19[6-9]\d|20[0-2]\d)', cit or '')
    return int(m.group(1)) if m else None


def variante_enem(cit):
    """Aplicações do ENEM com caderno próprio (PPL, digital, Libras): não são a prova regular que o site tem."""
    c = sem_acento(cit or '').lower()
    return 'PPL' if 'ppl' in c else 'Digital' if 'digital' in c else 'Libras' if 'libras' in c else None


def inventario():
    lst = ler(os.path.join(DOCS, 'inventario-privadas.json')) + ler(os.path.join(DOCS, 'inventario-publicas-1.json'))
    lst += ler(os.path.join(DOCS, 'inventario-publicas-2.json'))['instituicoes']
    out = defaultdict(dict)  # sigla -> ano -> caderno_url
    for i in lst:
        for a in i.get('anos', []):
            try:
                ano = int(str(a.get('ano'))[:4])
            except ValueError:
                continue
            if a.get('caderno_url'):
                out[i['sigla']].setdefault(ano, a['caderno_url'])
            else:
                out[i['sigla']].setdefault(ano, None)
    return out


def main():
    provas = [ler(f) for f in sorted(glob.glob(os.path.join(PROVAS, '*', 'prova.json')))]
    no_site = {p['id'] for p in provas}
    cand = []  # (id, origem, rótulo, gab, palavras, matéria/sub)
    for p in provas:
        for q in p['questoes']:
            cand.append({'id': q['id'], 'fonte': 'prova:' + p['id'], 'rotulo': f"{p['titulo']} · Q{q['n']}", 'gab': q.get('gab'),
                         'w': palavras(q.get('texto', '')), 'materia': q.get('materia'), 'sub': q.get('conteudo'),
                         'print': os.path.relpath(os.path.join(PROVAS, p['id'], q['print']), RAIZ)})
    site = []
    for m in MATERIAS:
        for q in ler(os.path.join(ORIGEM, m, 'dados.json'))['banco']:
            if q.get('tipo') == 'site':
                site.append((m, q))
            else:
                cand.append({'id': q['id'], 'fonte': 'banco-antigo', 'rotulo': f"{q.get('escola')} {q.get('ano')} · Q{q.get('n')}",
                             'gab': q.get('gab'), 'w': palavras(texto_q(q)), 'materia': m, 'sub': q.get('sub'), 'print': ''})
    inv = inventario()

    itens = []
    for m, q in site:
        w = palavras(texto_q(q))
        cit = citacao(q.get('enun'))
        inst, ano = instituicao(cit), ano_citado(cit)
        melhor = None
        if len(w) >= MIN_PALAVRAS:
            for c in cand:
                if len(c['w']) < MIN_PALAVRAS:
                    continue
                s = len(w & c['w']) / min(len(w), len(c['w']))
                if s >= LIMIAR and c['gab'] == q.get('gab') and (not melhor or s > melhor[0]):
                    melhor = (s, c)
        it = {'id': q['id'], 'materia': m, 'sub': q['sub'], 'dif': int(str(q.get('dif') or 5)), 'site': q.get('escola'),
              'banca_citada': cit, 'instituicao': inst, 'ano_citado': ano}
        if melhor:
            s, c = melhor
            it.update(destino='questao_de_prova:' + c['id'], equivalente={
                'id': c['id'], 'fonte': c['fonte'], 'questao': c['rotulo'], 'materia': c['materia'], 'sub': c['sub'],
                'semelhanca': round(s, 2), 'print': c['print'], 'conferido': q['id'] in CONFERIDOS})
        elif inst == 'ENEM' and ano and variante_enem(cit):
            it.update(destino=f'prova_a_baixar:ENEM {variante_enem(cit)}/{ano}', motivo='ENEM: o INEP publica todas as provas e gabaritos (fora dos inventários)')
        elif inst and ano and inst in PREFIXO_SITE and any(pid.startswith(PREFIXO_SITE[inst] + '-' + str(ano)) for pid in no_site):
            it.update(destino='questao_aprendice', motivo=f'a prova {inst} {ano} já está no site, mas a questão não está nela (outra fase, caderno ou adaptação)')
        elif inst == 'ENEM' and ano:
            it.update(destino=f'prova_a_baixar:ENEM/{ano}', motivo='ENEM: o INEP publica todas as provas e gabaritos (fora dos inventários)')
        elif inst and ano and inv.get(inst, {}).get(ano):
            it.update(destino=f'prova_a_baixar:{inst}/{ano}', caderno_url=inv[inst][ano])
        else:
            it['destino'] = 'questao_aprendice'
            it['motivo'] = ('sem banca citada' if not cit else
                            'banca citada sem ano (não dá para saber qual prova)' if not ano else
                            'banca de fora dos inventários (concurso, colégio técnico ou instituição não listada)' if not inst or inst not in inv
                            else 'ano anterior a 2020 ou sem caderno oficial no inventário')
        itens.append(it)

    tipo = lambda d: d.split(':')[0]
    resumo = Counter(tipo(i['destino']) for i in itens)
    por_materia = {m: dict(Counter(tipo(i['destino']) for i in itens if i['materia'] == m)) for m in MATERIAS}
    faltam = defaultdict(lambda: defaultdict(int))
    for i in itens:
        if i['destino'] != 'questao_de_prova' and not i['destino'].startswith('questao_de_prova'):
            faltam[i['materia']][i['sub']] += 1
    saida = {
        'gerado_por': 'app/scripts/triagem_site.py (comando 21 do dono)',
        'criterio': f'mesma questão = texto >= {LIMIAR} do texto menor (mín. {MIN_PALAVRAS} palavras) e mesmo gabarito; '
                    'busca em todas as provas de conteudo-fonte/provas e no banco antigo de provas',
        'total': len(itens), 'resumo': dict(resumo), 'por_materia': por_materia,
        'aprendice_por_conteudo': {m: dict(sorted(v.items())) for m, v in sorted(faltam.items())},
        'nota_aprendice_por_conteudo': 'conta questao_aprendice e prova_a_baixar (enquanto a prova não chega, o conteúdo fica sem a questão)',
        'itens': itens,
    }
    os.makedirs(DOCS, exist_ok=True)
    with open(os.path.join(DOCS, 'triagem-questoes-site.json'), 'w', encoding='utf-8') as f:
        json.dump(saida, f, ensure_ascii=False, indent=1)
    escreve_md(saida)
    print(dict(resumo), por_materia)


NOME = {'bio': 'Biologia', 'qui': 'Química', 'mat': 'Matemática', 'por': 'Português'}


def escreve_md(s):
    L = ['# Triagem das questões de sites didáticos', '',
         'Comando 21 do dono. Gerado por `app/scripts/triagem_site.py`; dados completos em `triagem-questoes-site.json`.',
         'Nenhuma destas questões aparece mais no site (o conversor `app/scripts/converte.py` as exclui).', '',
         f"Critério: {s['criterio']}.", '', '## Resumo', '',
         '| Matéria | Questões de site | Viraram questão de prova | Prova a baixar | Questão Aprendice |', '|---|---|---|---|---|']
    for m in MATERIAS:
        d = s['por_materia'][m]
        L.append(f"| {NOME[m]} | {sum(d.values())} | {d.get('questao_de_prova', 0)} | {d.get('prova_a_baixar', 0)} | {d.get('questao_aprendice', 0)} |")
    r = s['resumo']
    L.append(f"| **Total** | **{s['total']}** | **{r.get('questao_de_prova', 0)}** | **{r.get('prova_a_baixar', 0)}** | **{r.get('questao_aprendice', 0)}** |")
    L += ['', '## Viraram questão de prova', '', '| Id do site | Matéria · conteúdo | Banca citada | Questão de prova | Conteúdo da prova | Conferido |', '|---|---|---|---|---|---|']
    for i in s['itens']:
        if i['destino'].startswith('questao_de_prova'):
            e = i['equivalente']
            L.append(f"| {i['id']} | {NOME[i['materia']]} · {i['sub']} | {i['banca_citada'] or '—'} | {e['questao']} (`{e['id']}`) | {e['materia']} · {e['sub']} | {('sim, texto e print' if e['print'] else 'sim, texto (questão do banco antigo)') if e['conferido'] else 'só texto'} |")
    L += ['', '## Provas a baixar (não baixadas)', '', '| Prova | Questões | Ids |', '|---|---|---|']
    bx = defaultdict(list)
    for i in s['itens']:
        if i['destino'].startswith('prova_a_baixar'):
            bx[i['destino'].split(':', 1)[1]].append(i['id'])
    for k in sorted(bx):
        L.append(f"| {k} | {len(bx[k])} | {', '.join(bx[k])} |")
    L += ['', '## Questões Aprendice que faltam, por conteúdo', '',
          'Conta as questões com destino `questao_aprendice` e `prova_a_baixar` (enquanto a prova não for integrada, o conteúdo fica sem elas).', '']
    for m, subs in s['aprendice_por_conteudo'].items():
        L.append(f"- **{NOME[m]}** ({sum(subs.values())}): " + ', '.join(f'{k} {v}' for k, v in subs.items()))
    mot = Counter(i.get('motivo', '') for i in s['itens'] if i['destino'] == 'questao_aprendice')
    L += ['', '## Por que viraram Questão Aprendice', '']
    for k, v in mot.most_common():
        L.append(f'- {k}: {v}')
    L.append('')
    with open(os.path.join(DOCS, 'triagem-questoes-site.md'), 'w', encoding='utf-8') as f:
        f.write('\n'.join(L))


if __name__ == '__main__':
    main()

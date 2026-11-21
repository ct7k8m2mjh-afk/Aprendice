#!/usr/bin/env python3
"""Nível das questões do ENEM pela dificuldade oficial do INEP (parâmetro b da TRI, microdados do ENEM).

Lê só a tabela ITENS_PROVA_<ano>.csv de dentro do zip dos microdados (leitura parcial, sem baixar o zip inteiro),
acha o caderno do INEP que corresponde a cada prova do site pela sequência de gabaritos (tem de bater 100%) e grava
em cada questão de app/conteudo-fonte/provas/enem-<ano>/prova.json:
  tri: {b, a, c, item, prova_inep}   parâmetros oficiais
  nivel: novo nível, por ordem de b dentro da área do ENEM (CN, CH, LC, MT), com a MESMA distribuição de níveis
         que as questões dessa área tinham (só a ordem muda, pela medida oficial)
  nivel_antes: o nível anterior (estimado pela classificação), guardado
Itens anulados pelo INEP (sem b) e anos sem microdados ficam com o nível que tinham.

  python3 ferramentas/ingestao/nivel_tri.py            aplica em 2020 até o último ano com microdados
  python3 ferramentas/ingestao/nivel_tri.py --previa   só mostra o que mudaria
"""
import collections
import csv
import io
import json
import os
import sys

from remotezip import RemoteZip

RAIZ = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
PROVAS = os.path.join(RAIZ, 'app', 'conteudo-fonte', 'provas')
CACHE = os.path.join(RAIZ, 'fontes', 'cache-inep')
CERTS = os.path.join(RAIZ, 'ferramentas', 'ingestao', 'certs')


def bundle():
    os.makedirs(CACHE, exist_ok=True)
    f = os.path.join(CACHE, 'bundle.pem')
    base = os.environ.get('SSL_CERT_FILE') or '/root/.ccr/ca-bundle.crt'
    with open(f, 'w') as h:
        for c in [base] + [os.path.join(CERTS, x) for x in sorted(os.listdir(CERTS)) if x.endswith('.pem')]:
            if os.path.exists(c):
                h.write(open(c).read() + '\n')
    return f


def itens(ano):
    f = os.path.join(CACHE, f'ITENS_PROVA_{ano}.csv')
    if not os.path.exists(f):
        url = f'https://download.inep.gov.br/microdados/microdados_enem_{ano}.zip'
        try:
            with RemoteZip(url, verify=bundle(), headers={'User-Agent': 'Mozilla/5.0 (compatible; estudos)'}) as z:
                nome = next(i.filename for i in z.infolist() if i.filename.upper().endswith(f'ITENS_PROVA_{ano}.CSV'))
                open(f, 'wb').write(z.read(nome))
        except Exception as e:  # ano sem microdados publicados
            print(f'{ano}: microdados indisponíveis ({str(e)[:80]})')
            return None
    return list(csv.DictReader(io.StringIO(open(f, encoding='latin-1').read()), delimiter=';'))


def casa(ano, p):
    """{n: linha do INEP} para as questões do site, só de cadernos cujo gabarito bate 100% e item único."""
    rows = itens(ano)
    if rows is None:
        return {}
    cads = collections.defaultdict(dict)
    for r in rows:
        if r['TP_LINGUA'] in ('', '0'):  # inglês (o site guarda o caderno com inglês)
            cads[r['CO_PROVA']][int(r['CO_POSICAO'])] = r
    ours = {q['n']: q for q in p['questoes']}
    cand = collections.defaultdict(dict)
    for cod, d in cads.items():
        com = [n for n in ours if n in d]
        if len(com) >= 20 and all(d[n]['TX_GABARITO'] == ours[n]['gab'] for n in com):
            for n in com:
                cand[n][d[n]['CO_ITEM']] = d[n]
    return {n: next(iter(c.values())) for n, c in cand.items() if len(c) == 1}


def main():
    previa = '--previa' in sys.argv
    anos = sorted(int(d.split('-')[1]) for d in os.listdir(PROVAS) if d.startswith('enem-') and d.split('-')[1].isdigit())
    provas, pool = {}, collections.defaultdict(list)
    for ano in anos:
        f = os.path.join(PROVAS, f'enem-{ano}', 'prova.json')
        p = json.load(open(f, encoding='utf-8'))
        provas[ano] = (f, p)
        m = casa(ano, p)
        for q in p['questoes']:
            r = m.get(q['n'])
            if r and r['IN_ITEM_ABAN'] != '1' and r['NU_PARAM_B']:
                q['tri'] = {'b': float(r['NU_PARAM_B']), 'a': float(r['NU_PARAM_A']), 'c': float(r['NU_PARAM_C']),
                            'item': r['CO_ITEM'], 'prova_inep': r['CO_PROVA']}
                pool[r['SG_AREA']].append(q)
    mudou = collections.Counter()
    for area, qs in pool.items():
        niveis = sorted(q.get('nivel_antes', q['nivel']) for q in qs)  # distribuição original da área
        for q, nv in zip(sorted(qs, key=lambda q: (q['tri']['b'], q['id'])), niveis):
            antes = q.get('nivel_antes', q['nivel'])
            q['nivel_antes'] = antes
            q['nivel'] = nv
            q['nivel_fonte'] = 'tri-inep'
            mudou['igual' if nv == antes else ('subiu' if nv > antes else 'desceu')] += 1
        print(f'{area}: {len(qs)} questões; b de {min(q["tri"]["b"] for q in qs):.2f} a {max(q["tri"]["b"] for q in qs):.2f}')
    print('nível:', dict(mudou))
    if previa:
        return
    for ano, (f, p) in provas.items():
        txt = open(f, encoding='utf-8').read()
        ind = 1 if txt[:200].count('\n "') else (2 if txt[:200].count('\n  "') else None)
        with open(f, 'w', encoding='utf-8') as h:
            json.dump(p, h, ensure_ascii=False, indent=ind)
            if txt.endswith('\n'):
                h.write('\n')
    print('gravado nos prova.json do ENEM')


if __name__ == '__main__':
    main()

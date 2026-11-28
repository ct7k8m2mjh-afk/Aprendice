#!/usr/bin/env python3
"""Completa resoluções já gravadas com as duas partes que viraram obrigatórias (dono, 12/11/2026):
`caminhos` (outro jeito de resolver, em uma linha) nas animadas (Mat, Fís, Quí, Bio) e `quadro` (a conta como no caderno, linha por
linha, com nota) em Matemática, Física e nas de Química que têm conta.

Só ACRESCENTA esses dois campos; nada mais da resolução muda (texto, passos, gabarito ficam como estão).

  python3 ferramentas/resolucoes/completa.py status                quantas faltam, por matéria
  python3 ferramentas/resolucoes/completa.py lote <m> [N]          grava em docs/resolucoes/trabalho/completa-<m>-<k>.json
                                                                   as próximas N (padrão 30) com a resolução atual
  python3 ferramentas/resolucoes/completa.py aplica <arquivo.json> confere e aplica {"questoes": [{"id", "caminhos",
                                                                   "quadro"?}], "conferido": true}

Depois de aplicar: cd app && python3 scripts/converte.py && npx tsc --noEmit -p . && npx vitest run.
"""
import glob
import json
import os
import re
import sys

RAIZ = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
PROVAS = os.path.join(RAIZ, 'app', 'conteudo-fonte', 'provas')
TRAB = os.path.join(RAIZ, 'docs', 'resolucoes', 'trabalho')
MATS = ['mat', 'fis', 'qui', 'bio', 'geo', 'por', 'his', 'ing', 'fs']


def ler(f):
    with open(f, encoding='utf-8') as h:
        return json.load(h)


def grava_json(f, d, modelo=None):
    texto = json.dumps(d, ensure_ascii=False, indent=1)
    if modelo is not None and not modelo.startswith('{\n "'):
        texto = json.dumps(d, ensure_ascii=False, indent=2)
    with open(f, 'w', encoding='utf-8') as h:
        h.write(texto + '\n')


def tem_conta(r):
    return any(re.search(r'\d.*[=≈]|[=≈].*\d', str(p.get('conta', ''))) for p in (r.get('passos') or []))


def precisa(m, v):
    """O que falta nesta resolução: lista com 'caminhos' e/ou 'quadro'."""
    falta = []
    if m in ('mat', 'fis', 'qui', 'bio') and not v.get('caminhos'):
        falta.append('caminhos')
    if (m in ('mat', 'fis') or (m == 'qui' and tem_conta(v.get('resolucao') or {}))) and not v.get('quadro'):
        falta.append('quadro')
    return falta


def todas(m):
    for f in sorted(glob.glob(os.path.join(PROVAS, '*', f'resolucoes-{m}.json'))):
        d = ler(f)
        for k, v in d.items():
            if isinstance(v, dict) and v.get('aprovada'):
                fl = precisa(m, v)
                if fl:
                    yield f, k, v, fl


def cmd_status():
    for m in MATS:
        n = sum(1 for _ in todas(m))
        if n:
            print(f'{m:4} {n}')


def cmd_lote(m, n=30):
    os.makedirs(TRAB, exist_ok=True)
    feitos = set()
    for f in glob.glob(os.path.join(TRAB, f'completa-{m}-*.json')):
        feitos |= {q['id'] for q in ler(f).get('questoes', [])}
    qs = []
    for f, k, v, fl in todas(m):
        if k in feitos:
            continue
        prova = os.path.basename(os.path.dirname(f))
        qs.append({'id': k, 'prova': prova, 'n': v.get('n'), 'falta': fl,
                   'print': f'app/conteudo-fonte/provas/{prova}/q/' if True else '',
                   'resolucao': v.get('resolucao'), 'caminhos_atuais': v.get('caminhos'), 'quadro_atual': v.get('quadro')})
        if len(qs) >= n:
            break
    if not qs:
        print(f'{m}: nada a completar')
        return
    k = 1 + len(glob.glob(os.path.join(TRAB, f'completa-{m}-*.json')))
    out = os.path.join(TRAB, f'completa-{m}-{k:03d}.json')
    grava_json(out, {'materia': m, 'questoes': qs})
    print(f'{len(qs)} questões em {out}. Escreva a saída {{"materia": "{m}", "questoes": [{{"id", "caminhos", "quadro"}}], '
          f'"conferido": true}} e rode: completa.py aplica <saida>')


def cmd_aplica(saida):
    d = ler(saida)
    m = d.get('materia')
    if m not in MATS:
        sys.exit('materia inválida na saída')
    if d.get('conferido') is not True:
        sys.exit('"conferido": true só depois que o conferente aprovou (contas do quadro refeitas, caminho correto)')
    pend = {k: (f, fl) for f, k, v, fl in todas(m)}
    erros, porarq = [], {}
    for q in d.get('questoes', []):
        k = q.get('id')
        if k not in pend:
            erros.append(f'{k}: não precisa de complemento (ou não existe)')
            continue
        f, fl = pend[k]
        cam = q.get('caminhos')
        if 'caminhos' in fl and not (isinstance(cam, list) and cam and all(
                isinstance(c, dict) and str(c.get('nome', '')).strip() and str(c.get('ideia', '')).strip() for c in cam)):
            erros.append(f'{k}: caminhos = [{{"nome", "ideia"}}]')
        qd = q.get('quadro')
        if 'quadro' in fl and not (isinstance(qd, list) and qd and all(
                isinstance(x, dict) and str(x.get('linha', '')).strip() for x in qd)):
            erros.append(f'{k}: quadro = [{{"linha", "nota"?}}]')
        porarq.setdefault(f, []).append((k, q, fl))
    if erros:
        print('\n'.join(erros))
        sys.exit(f'{len(erros)} erro(s): nada aplicado')
    for f, itens in porarq.items():
        modelo = open(f, encoding='utf-8').read()
        dd = json.loads(modelo)
        for k, q, fl in itens:
            for c in fl:
                dd[k][c] = q[c]
        grava_json(f, dd, modelo)
    print(f'{sum(len(v) for v in porarq.values())} resoluções completadas em {len(porarq)} arquivo(s)')


if __name__ == '__main__':
    a = sys.argv[1:]
    if not a:
        print(__doc__)
    elif a[0] == 'status':
        cmd_status()
    elif a[0] == 'lote' and len(a) >= 2:
        cmd_lote(a[1], int(a[2]) if len(a) > 2 else 30)
    elif a[0] == 'aplica' and len(a) == 2:
        cmd_aplica(a[1])
    else:
        print(__doc__)

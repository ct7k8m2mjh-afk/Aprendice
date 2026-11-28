"""Junta as partes de um lote resolvidas por agentes em paralelo numa só saída.

  python3 ferramentas/resolucoes/junta.py <saida.json> <parte1.json> [<parte2.json> ...]

Cada parte tem o formato da saída ({"lote", "conferido", "questoes": [...]}) ou é só a lista de questões.
Mantém a ordem das partes, recusa id repetido e grava com "conferido": false. Imprime uma linha só.
"""
import json
import os
import sys


def main(a):
    if len(a) < 2:
        sys.exit(__doc__)
    saida, partes = a[0], a[1:]
    lote, qs, vistos = None, [], set()
    for p in partes:
        d = json.load(open(p))
        lista = d.get('questoes', []) if isinstance(d, dict) else d
        if isinstance(d, dict) and d.get('lote'):
            if lote and d['lote'] != lote:
                sys.exit(f'ERRO: {p} é do lote {d["lote"]}, esperado {lote}')
            lote = d['lote']
        for q in lista:
            if q['id'] in vistos:
                sys.exit(f'ERRO: id repetido {q["id"]} em {p}')
            vistos.add(q['id'])
            qs.append(q)
    if not lote:
        lote = os.path.basename(saida).split('.')[0]
    json.dump({'lote': lote, 'conferido': False, 'questoes': qs}, open(saida, 'w'), ensure_ascii=False, indent=1)
    pend = sum(1 for q in qs if q.get('status') == 'pendente')
    print(f'{lote}: {len(qs)} questões juntas ({pend} pendentes) em {saida}')


if __name__ == '__main__':
    main(sys.argv[1:])

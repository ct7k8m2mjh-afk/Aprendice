#!/usr/bin/env python3
"""Resolve conflito em arquivo markdown que só cresce (a caixa de recados, os registros).

Cada sessão escreve o bloco dela no fim do arquivo. Quando duas escrevem
antes de enviar, o git marca conflito, mas não há nada em disputa: a
junção certa é ficar com os dois blocos, na ordem em que estão. Esta
ferramenta só tira as três linhas de marcação do git.

Uso: python3 ferramentas/fabrica/junta_caixa.py <arquivo.md> [...]
"""
import sys


def junta(arquivo):
    linhas = open(arquivo, encoding='utf-8').read().split('\n')
    saida = [l for l in linhas
             if not (l.startswith('<<<<<<< ') or l == '=======' or l.startswith('>>>>>>> '))]
    tiradas = len(linhas) - len(saida)
    if tiradas:
        open(arquivo, 'w', encoding='utf-8').write('\n'.join(saida))
    return tiradas


def main(argv):
    if len(argv) < 2:
        sys.exit(__doc__)
    for arquivo in argv[1:]:
        n = junta(arquivo)
        print(f'ok {arquivo}: os dois blocos ficaram ({n} linha(s) de marcação tirada(s))'
              if n else f'{arquivo}: sem marcação de conflito')
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv))

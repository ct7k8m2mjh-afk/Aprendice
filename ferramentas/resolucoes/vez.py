"""Diz se a vez da matéria está livre para uma sessão nova (usado pelas tarefas agendadas de cada matéria).

  python3 ferramentas/resolucoes/vez.py <m> [--parte k]

Matéria dividida em partes (docs/resolucoes/partes.json): --parte k olha só a parte k (registro-<m>-p<k>.json e
lotes-<m>-p<k>.md; a parte 1 usa registro-<m>.json e lotes-<m>.md, como sempre). Sem --parte = parte 1.

Imprime uma linha:
  OCUPADO ...  outra sessão desta matéria gravou ou abriu lote há menos de JANELA minutos: encerre já, sem fazer nada.
  ACABOU ...   não há mais questões desta matéria: escreva FIM na caixa e encerre.
  LIVRE ...    pode começar (assuma os lotes abertos que ficaram, com --retomar).
Lê o ramo remoto (git fetch), então funciona em qualquer sessão nova.
"""
import json
import os
import subprocess
import sys

JANELA = 45  # minutos sem nenhum commit da matéria = a sessão anterior acabou ou caiu
RAMO = 'origin/app-prototipo-completo'
RAIZ = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


def git(*a):
    return subprocess.run(['git', '-C', RAIZ, *a], capture_output=True, text=True).stdout.strip()


def main(m, k=1):
    git('fetch', '-q', 'origin', 'app-prototipo-completo')
    try:
        txt = git('show', f'{RAMO}:docs/resolucoes/partes.json')
        if not txt and os.path.exists(os.path.join(RAIZ, 'docs', 'resolucoes', 'partes.json')):
            txt = open(os.path.join(RAIZ, 'docs', 'resolucoes', 'partes.json'), encoding='utf-8').read()
        n = int(json.loads(txt or '{}').get(m) or 1)
    except Exception:
        n = 1
    if k < 1 or k > n:
        sys.exit(f'--parte {k}: ' + (f'{m} está dividida em {n} partes' if n > 1 else f'{m} não está dividida em partes'))
    suf = '' if k == 1 else f'-p{k}'
    # só os arquivos da parte: cada parte grava o seu registro e o seu relatório (a parte 1, os de sempre)
    arqs = [f'docs/resolucoes/registro-{m}{suf}.json', f'docs/resolucoes/lotes-{m}{suf}.md']
    ultimo = git('log', RAMO, f'--since={JANELA} minutes ago', '-1', '--format=%h %cr %s', '--', *arqs)
    if ultimo:
        print(f'OCUPADO: {ultimo}')
        return
    try:
        reg = json.loads(git('show', f'{RAMO}:docs/resolucoes/registro-{m}{suf}.json'))
        abertos = [k for k, v in reg.get('lotes', {}).items() if v.get('estado') == 'aberto']
    except Exception:
        abertos = []
    st = subprocess.run([sys.executable, os.path.join(RAIZ, 'ferramentas', 'resolucoes', 'lote.py'), 'status'],
                        capture_output=True, text=True, cwd=RAIZ).stdout
    nome = {'mat': 'Matemática', 'fis': 'Física', 'qui': 'Química', 'bio': 'Biologia', 'por': 'Português',
            'geo': 'Geografia', 'his': 'História', 'ing': 'Inglês', 'fs': 'Filosofia e Sociologia'}[m]
    rot = nome if n == 1 else f'{nome} parte {k}:'   # matéria dividida: o status traz uma linha por parte
    faltam = next((ln[len(rot):].split()[0] for ln in st.splitlines() if ln.startswith(rot)), '?')
    if faltam == '0' and not abertos:
        print(f'ACABOU: {nome}' + (f' parte {k}' if n > 1 else '') + ' sem questões por fazer')
        return
    print(f'LIVRE: faltam {faltam}; lotes abertos para retomar: {", ".join(abertos) or "nenhum"}')


if __name__ == '__main__':
    a = sys.argv[1:]
    k = 1
    if '--parte' in a:
        i = a.index('--parte')
        k = int(a[i + 1])
        del a[i:i + 2]
    main(a[0], k)

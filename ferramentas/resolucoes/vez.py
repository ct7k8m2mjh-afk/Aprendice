"""Diz se a vez da matéria está livre para uma sessão nova (usado pelas tarefas agendadas de cada matéria).

  python3 ferramentas/resolucoes/vez.py <m>

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


def main(m):
    git('fetch', '-q', 'origin', 'app-prototipo-completo')
    arqs = [f'docs/resolucoes/registro-{m}.json', f'docs/resolucoes/lotes-{m}.md']
    ultimo = git('log', RAMO, f'--since={JANELA} minutes ago', '-1', '--format=%h %cr %s', '--', *arqs)
    if ultimo:
        print(f'OCUPADO: {ultimo}')
        return
    try:
        reg = json.loads(git('show', f'{RAMO}:docs/resolucoes/registro-{m}.json'))
        abertos = [k for k, v in reg.get('lotes', {}).items() if v.get('estado') == 'aberto']
    except Exception:
        abertos = []
    st = subprocess.run([sys.executable, os.path.join(RAIZ, 'ferramentas', 'resolucoes', 'lote.py'), 'status'],
                        capture_output=True, text=True, cwd=RAIZ).stdout
    nome = {'mat': 'Matemática', 'fis': 'Física', 'qui': 'Química', 'bio': 'Biologia', 'por': 'Português',
            'geo': 'Geografia', 'his': 'História', 'ing': 'Inglês', 'fs': 'Filosofia e Sociologia'}[m]
    faltam = next((ln[len(nome):].split()[0] for ln in st.splitlines() if ln.startswith(nome)), '?')
    if faltam == '0' and not abertos:
        print(f'ACABOU: {nome} sem questões por fazer')
        return
    print(f'LIVRE: faltam {faltam}; lotes abertos para retomar: {", ".join(abertos) or "nenhum"}')


if __name__ == '__main__':
    main(sys.argv[1])

#!/usr/bin/env bash
# Envia a branch que varias sessoes de materia compartilham.
# A cada recusa: traz o que chegou (rebase) e junta o que conflitou, por tipo:
#   *.json  -> uniao de 3 vias (junta_json.py)
#   gastos.csv -> uniao das linhas, sem repetir (e so acrescenta linha)
#   lotes-*.md -> refeito do registro ja juntado (lote.py relatorio)
# Nao descarta nada: o que o rebase deixar fora do indice vai para um stash
# com nome, nunca para o lixo. Ate 4 tentativas.
set -u
BR=app-prototipo-completo
MAT=${1:-por}

junta_csv() {
  python3 -I - "$1" <<'PYEOF'
import subprocess, sys
f = sys.argv[1]
def le(s):
    p = subprocess.run(['git', 'show', f'{s}:{f}'], capture_output=True, text=True)
    return p.stdout.splitlines() if p.returncode == 0 else []
nosso, meu = le(':2'), le(':3')
if not (nosso or meu):
    sys.exit(f'{f}: sem versao nos dois lados; resolva a mao')
cab = (nosso or meu)[0]
vistas, saida = set(), []
for l in [x for x in nosso[1:] + meu[1:] if x.strip()]:
    if l not in vistas:
        vistas.add(l)
        saida.append(l)
saida.sort()
open(f, 'w', encoding='utf-8').write('\n'.join([cab] + saida) + '\n')
print(f'ok {f}: {len(nosso)-1} deles + {len(meu)-1} meus -> {len(saida)} linhas')
PYEOF
}

resolve() {
  local pendentes
  pendentes=$(git diff --name-only --diff-filter=U)
  [ -z "$pendentes" ] && return 0
  if echo "$pendentes" | grep -q '\.json$'; then
    python3 -I ferramentas/fabrica/junta_json.py || return 1
  fi
  for f in $(echo "$pendentes" | grep '\.csv$'); do
    junta_csv "$f" || return 1
    git add "$f"
  done
  # a caixa de recados so cresce: cada lado escreveu o bloco dele e a
  # juncao e ficar com os dois, na ordem em que estao
  caixas=$(echo "$pendentes" | grep -E 'caixa/.*\.md$')
  if [ -n "$caixas" ]; then
    python3 -I ferramentas/fabrica/junta_caixa.py $caixas || return 1
    git add $caixas
  fi
  if echo "$pendentes" | grep -q 'lotes-.*\.md$'; then
    # o .md e feito do registro, que acabou de ser juntado: refazer e o certo
    python3 -u ferramentas/resolucoes/lote.py relatorio "$MAT" >/dev/null 2>&1
    for f in $(echo "$pendentes" | grep 'lotes-.*\.md$'); do git add "$f"; done
  fi
  pendentes=$(git diff --name-only --diff-filter=U)
  if [ -n "$pendentes" ]; then
    echo "nao sei juntar sozinho: $pendentes"
    return 1
  fi
}

for tentativa in 1 2 3 4; do
  if git push origin "$BR" 2>&1 | tee /tmp/empurra.log | tail -1; then
    grep -q 'rejected\|fetch first\|non-fast-forward' /tmp/empurra.log || { echo "enviado (tentativa $tentativa)"; exit 0; }
  fi
  echo "--- recusado; trazendo o que chegou (tentativa $tentativa) ---"
  git pull --rebase --autostash origin "$BR" >/dev/null 2>&1
  while [ -d .git/rebase-merge ] || [ -d .git/rebase-apply ]; do
    resolve || { echo "parei: resolva a mao e rode de novo"; exit 1; }
    fora=$(git diff --name-only)
    [ -n "$fora" ] && git stash push -m "refeitos por lote.py (outras materias/partes)" -- $fora >/dev/null
    GIT_EDITOR=true git rebase --continue >/dev/null 2>&1 || {
      echo "rebase travou:"; git status --short | head; exit 1; }
  done
done
echo "nao consegui enviar em 4 tentativas"; exit 1

#!/usr/bin/env bash
# Envia a branch para o origin numa branch que varias sessoes compartilham.
# A cada recusa: traz o que chegou (rebase), junta os JSON por uniao
# (junta_json.py) e tenta de novo, ate 4 vezes. Nao descarta nada.
set -u
BR=app-prototipo-completo
for tentativa in 1 2 3 4 5; do
  if git push origin "$BR" 2>&1 | grep -qv 'rejected\|fetch first\|non-fast-forward'; then
    if git push origin "$BR" 2>&1 | tail -1 | grep -q 'Everything up-to-date\|->'; then
      echo "enviado na tentativa $tentativa"; exit 0
    fi
  fi
  echo "--- recusado; trazendo o que chegou (tentativa $tentativa) ---"
  git pull --rebase --autostash origin "$BR" >/dev/null 2>&1
  while [ -d .git/rebase-merge ] || [ -d .git/rebase-apply ]; do
    if [ -n "$(git ls-files -u)" ]; then
      python3 -I ferramentas/fabrica/junta_json.py || { echo "COLISAO: resolva a mao"; exit 1; }
    fi
    if [ -n "$(git diff --name-only)" ]; then
      git stash push -m "regerados por lote.py (outras materias/partes)" -- $(git diff --name-only) >/dev/null
    fi
    GIT_EDITOR=true git rebase --continue >/dev/null 2>&1 || { echo "rebase travou"; git status --short | head; exit 1; }
  done
done
echo "nao consegui enviar em 5 tentativas"; exit 1

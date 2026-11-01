#!/bin/bash
# uso: ./faz.sh P01 [P02 ...]  -> render 3D (com trava) + pos-processamento
cd "$(dirname "$0")"
for ID in "$@"; do
  t0=$(date +%s)
  flock /tmp/render.lock python3 cenas/$ID.py > /tmp/claude-0/-home-claude/e5566652-8789-513e-9e19-aca7ab2e3491/scratchpad/render_$ID.log 2>&1 || { echo "$ID FALHOU"; tail -20 /tmp/claude-0/-home-claude/e5566652-8789-513e-9e19-aca7ab2e3491/scratchpad/render_$ID.log; continue; }
  python3 -I post.py render render/$ID.png $ID ${FIT:+--fit $FIT}
  echo "$ID ok $(( $(date +%s)-t0 ))s"
done

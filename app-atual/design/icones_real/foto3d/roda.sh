#!/bin/bash
# uso: ./roda.sh ID [ID...]  -> render com trava + post
cd /home/claude/escadas-sc/design/icones_real/foto3d
for i in "$@"; do
  flock /tmp/render.lock python3 cenas/$i.py > /tmp/claude-0/-home-claude/e5566652-8789-513e-9e19-aca7ab2e3491/scratchpad/r_$i.log 2>&1
  if grep -q "Saved" /tmp/claude-0/-home-claude/e5566652-8789-513e-9e19-aca7ab2e3491/scratchpad/r_$i.log; then python3 -I post.py render render/$i.png $i; else echo "FALHOU $i"; grep -iE "error|Traceback" -A3 /tmp/claude-0/-home-claude/e5566652-8789-513e-9e19-aca7ab2e3491/scratchpad/r_$i.log | tail -8; fi
done

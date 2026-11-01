#!/bin/sh
# Icones realistas dos CONTEUDOS de Matematica: bruto_sub_mat/ -> ../sub/<id>.svg (enquadrado, ids prefixados, SVGO)
# Requer playwright (NODE_PATH) e svgo 3.3.2 (env SVGO), como constroi.sh.
set -e
cd "$(dirname "$0")"
rm -f bruto_sub_mat/*.svg
python3 sub_mat_a.py && python3 sub_mat_b.py && python3 sub_mat_c.py
mkdir -p ../sub
node finaliza.js bruto_sub_mat ../sub $(ls bruto_sub_mat | sed 's/\.svg$//')

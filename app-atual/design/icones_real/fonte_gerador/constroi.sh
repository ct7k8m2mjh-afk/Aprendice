#!/bin/sh
# Gera os 53 icones realistas dos modulos: bruto/ (SVG em coordenadas de trabalho) -> ../<id>.svg (enquadrado e otimizado)
# Requer: svgo 3.3.2 (env SVGO apontando para o pacote). Os originais da Servier usados estao em orig_servier/.
set -e
cd "$(dirname "$0")"
python3 gera_mat.py && python3 gera_mat2.py && python3 gera_por.py && python3 gera_bio.py && python3 gera_qui.py
node finaliza.js bruto ..                  # precisao 1 casa decimal
PREC=0 node finaliza.js bruto .. B08       # encefalo da Servier: 0 casas para caber em 60 KB (coordenadas em escala 2x)
python3 folha.py && node folha.js ../folhas

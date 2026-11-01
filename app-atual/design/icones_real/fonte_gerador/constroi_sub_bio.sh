#!/bin/sh
# Gera os 69 icones realistas dos conteudos de Biologia: bruto_sub_bio/ -> ../sub/<id>.svg, mapa e folhas de contato.
# Requer: SVGO 3.3.2 (env SVGO apontando para o pacote) e playwright. Os originais Servier usados estao em orig_servier/
# (para buscar outros, BIOICONS=<clone esparso do bioicons>).
set -e
cd "$(dirname "$0")"
python3 gera_bio_sub.py
node finaliza_sub.js bruto_sub_bio ../sub $(cd bruto_sub_bio && ls B*.svg | sed 's/\.svg$//')
python3 mapa_sub_bio.py
python3 folha_sub_bio.py && node folha_sub_bio.js ../sub/folhas

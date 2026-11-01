#!/bin/sh
# Icones realistas dos CONTEUDOS de Quimica (Q01.1 ... Q12.5): bruto_sub_qui/ -> ../sub/<id>.svg + folhas de contato por modulo
# Requer: svgo 3.3.2 (env SVGO) e playwright. Originais Servier usados em orig_servier/.
set -e
cd "$(dirname "$0")"
python3 gera_qui_sub.py
node finaliza.js bruto_sub_qui ../sub
python3 folha_sub_qui.py && node folha_sub.js ../folhas/sub_qui

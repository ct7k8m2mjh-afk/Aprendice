#!/bin/sh
# Gera os icones realistas dos CONTEUDOS de Portugues: bruto_sub_por/ -> ../sub/<id>.svg (enquadrado e otimizado) e folhas de contato
# Requer: svgo 3.3.2 (env SVGO) e playwright (NODE_PATH). uso: sh constroi_sub_por.sh [ids...]
set -e
cd "$(dirname "$0")"
python3 gera_sub_por.py "$@"
node finaliza.js bruto_sub_por ../sub "$@"
python3 folha_sub_por.py por && node folha_sub_por.js ../sub/folhas por

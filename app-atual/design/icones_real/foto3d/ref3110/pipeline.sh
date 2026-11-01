#!/bin/sh
# icones de modulo a partir da referencia de 31/10: separa -> textos -> quadro 288 -> quadro 600 (ilustracoes)
set -e
cd "$(dirname "$0")"
python3 -I separa.py "$@" 2>&1 | grep -vi warn | tail -1
python3 -I texto.py M01 Q08 Q04 M10 P10
python3 -I quadro.py >/dev/null
python3 -I quadro600.py >/dev/null

import sys, os, math, random; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _qui import *
from mathutils import Euler
# Placa de zinco mergulhada em solucao azul de CuSO4: Zn se oxida (0 -> +2) e o cobre (Cu2+ -> Cu0) deposita sobre a placa
cena_q()
objs, ext = bequer(R=0.8, H=1.5, nivel=1.05, cor='#1f6fe0')
# placa: parte de cima zinco (cinza fosco), parte mergulhada coberta de cobre avermelhado
mzn = metal('#b9c0c6', 0.4); mcu = metal('#c8501e', 0.55)
# placa em coordenadas locais (eixo z ao longo da placa), depois inclinada apoiada na borda
p1 = caixa((0, 0, 1.25), (0.42, 0.05, 1.5), mzn, chanfro=0.015)
p2 = caixa((0, 0, 0.6), (0.44, 0.065, 1.18), mcu, chanfro=0.02)
grupo([p1, p2], loc=(0.28, 0.12, 0.12), rot=(0, -17, 15))
render(out('Q03.4'), elev=30)

import sys, os, math, random; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _qui import *
from mathutils import Euler
# Reacao de dupla troca KI + Pb(NO3)2 -> PbI2 (precipitado amarelo) + KNO3: pipeta de Pasteur pingando no tubo de ensaio
cena_q()
objs, ext = tubo_ensaio(R=0.45, H=2.6, nivel=1.6, cor='#f3f1e4')
# precipitado amarelo no fundo e nuvem amarela na solucao
faixa(ext, 0.028, 0.03, 0.55, fosco('#f7c600', 0.5))
nv = faixa(ext, 0.03, 0.55, 1.25, plastico('#ffd21a', 0.3))
# pipeta de Pasteur com bulbo de borracha
X, Y = 0.05, -0.02
pz = 2.75
bastao((X, Y, pz), (X, Y, pz + 1.3), 0.06, vidro())
cone((X, Y, pz - 0.18), 0.012, 0.06, 0.36, vidro())
torno([(0, pz + 1.25), (0.13, pz + 1.27), (0.16, pz + 1.45), (0.2, pz + 1.7), (0.18, pz + 1.95), (0.1, pz + 2.07), (0, pz + 2.1)], plastico('#d62828', 0.38), loc=(X, Y, 0), fechado=False)
liq = faixa([(0, pz - 0.35), (0.012, pz - 0.36), (0.055, pz), (0.055, pz + 0.9)], 0.008, pz - 0.3, pz + 0.5, liquido('#f4f2e6'))
liq.location = (X, Y, 0)
o = esfera((X, Y, pz - 0.55), 0.06, liquido('#f4f2e6')); o.scale = (1, 1, 1.25)
render(out('Q03.3'), elev=22)

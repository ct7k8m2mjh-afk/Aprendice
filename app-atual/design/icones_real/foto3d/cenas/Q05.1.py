import sys, os, math, random; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _qui import *
from mathutils import Euler
# Densimetro flutuando na proveta com solucao: a profundidade em que ele afunda indica a densidade da solucao
cena_q()
objs, ext = proveta(R=0.6, H=3.4, nivel=2.6, cor='#5fb0ea', base_cor='#1f5fd6')
# densimetro: bulbo com lastro (chumbo/granalha) + haste com escala
mv = vidro('#ffffff', ior=1.45)
Zb = 0.75
torno([(0, Zb), (0.1, Zb + 0.04), (0.2, Zb + 0.25), (0.22, Zb + 0.9), (0.2, Zb + 1.1), (0.07, Zb + 1.3), (0.07, Zb + 3.6), (0, Zb + 3.65)], mv, fechado=False)
for i in range(10):
    a = i * 2.4; esfera((0.1 * math.cos(a), 0.1 * math.sin(a), Zb + 0.14 + 0.06 * (i % 3)), 0.075, plastico('#2b2b2b', 0.3))
# papel da escala dentro da haste
caixa((0, -0.02, Zb + 2.6), (0.1, 0.01, 1.6), fosco('#f2b705', 0.6), chanfro=0)
for k in range(7):
    caixa((0, -0.035, Zb + 2.0 + k * 0.2), (0.06 if k % 2 else 0.09, 0.006, 0.018), fosco('#d62828', 0.5), chanfro=0)
render(out('Q05.1'), elev=22)

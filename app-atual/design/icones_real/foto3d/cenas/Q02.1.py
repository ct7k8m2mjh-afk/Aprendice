import sys, os, math, random; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _qui import *
from mathutils import Euler
# Reticulo cristalino do NaCl (3x3x3, cubico de face centrada): Na+ menor (roxo) alternado com Cl- maior (verde)
cena_q()
mna = plastico('#7b2cbf', 0.2); mcl = plastico('#2e9e44', 0.2); ml = plastico('#cfcfcf', 0.3)
a = 1.0; objs = []
for i in range(3):
    for j in range(3):
        for k in range(3):
            p = (i * a, j * a, k * a)
            na = (i + j + k) % 2 == 0
            objs.append(esfera(p, 0.24 if na else 0.38, mna if na else mcl, seg=48))
            for d in [(1, 0, 0), (0, 1, 0), (0, 0, 1)]:
                q = (p[0] + d[0] * a, p[1] + d[1] * a, p[2] + d[2] * a)
                if max(q) <= 2 * a: objs.append(bastao(p, q, 0.045, ml))
grupo(objs, loc=(0, 0, 0.42), rot=(0, 0, 32))
for o in objs: pass
render(out('Q02.1'), elev=28)

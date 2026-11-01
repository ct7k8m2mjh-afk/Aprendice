import sys, os, math, random; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _qui import *
from mathutils import Euler
# Isotopos do hidrogenio (mesmo Z = 1, massas diferentes): protio (1p), deuterio (1p+1n), tritio (1p+2n), cada um com 1 eletron
cena_q()
mp = plastico('#d62828', 0.22); mn = plastico('#a7adb4', 0.25); me = plastico('#1f5fd6', 0.15); mo = metal('#c9ced6', 0.2)
r = 0.42
nucs = [[('p', (0, 0, 0))], [('p', (-0.4, 0, 0)), ('n', (0.4, 0, 0))],
        [('p', (0, 0, 0.39)), ('n', (-0.41, 0.05, -0.24)), ('n', (0.41, -0.05, -0.24))]]
for k, nuc in enumerate(nucs):
    cx, cy = [(-1.25, 1.7), (1.25, 1.7), (0.0, -1.1)][k]; cz = 1.25  # revisao 31/10: triangulo compacto
    for t, (x, y, z) in nuc:
        esfera((cx + x, cy + y, cz + z), r, mp if t == 'p' else mn, seg=48)
    R = 0.98
    toro((cx, cy, cz), R, 0.045, mo, rot=(math.radians(55), 0, math.radians(10)))
    # eletron sobre a orbita
    M = Euler((math.radians(55), 0, math.radians(10))).to_matrix()
    e = M @ Vector((R * math.cos(-0.6), R * math.sin(-0.6), 0))
    esfera((cx + e.x, cy + e.y, cz + e.z), 0.2, me, seg=32)
render(out('Q01.2'), elev=34, azim=-8)

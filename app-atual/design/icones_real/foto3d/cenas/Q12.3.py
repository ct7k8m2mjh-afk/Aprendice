import sys, os, math, random; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _qui import *
from mathutils import Euler
# Trecho do polietileno -(CH2-CH2)n-: cadeia em zigue-zague de carbonos com 2 H cada; nas pontas as ligacoes continuam (cadeia longa) -> polimero de adicao do eteno
cena_q()
nC = 6
dx = 1.255; dz = 0.89
at = []; lig = []
for i in range(nC):
    at.append(('C', Vector((i * dx, 0, dz if i % 2 else 0))))
for i in range(nC - 1): lig.append((i, i + 1, 1))
th = math.radians(54.75)
for i in range(nC):
    o = Vector((0, 0, 1 if i % 2 else -1))
    for sy in (1, -1):
        h = at[i][1] + 1.09 * (math.cos(th) * o + math.sin(th) * Vector((0, sy, 0)))
        at.append(('H', h)); lig.append((i, len(at) - 1, 1))
# pontas: ligacao solta (continua a cadeia)
c0 = at[0][1]; c1 = at[nC - 1][1]
cent = sum((p for s, p in at), Vector()) / len(at)
R = Euler((math.radians(-14), 0, math.radians(-40))).to_matrix()
at2 = [(s, R @ (p - cent)) for s, p in at]
objs, pos = molecula(at2, lig, r_lig=0.075, z_min=0.6)
ml = plastico('#bdbdbd', 0.3)
d0 = R @ Vector((-dx, 0, dz)) * 0.55; d1 = R @ Vector((dx, 0, dz if nC % 2 == 0 else -dz)) * 0.55
bastao(tuple(pos[0]), tuple(pos[0] + d0), 0.075 * 1.3, ml)
bastao(tuple(pos[nC - 1]), tuple(pos[nC - 1] + d1), 0.075 * 1.3, ml)
render(out('Q12.3'), elev=24)

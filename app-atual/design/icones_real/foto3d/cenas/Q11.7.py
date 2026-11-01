import sys, os, math, random; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _qui import *
from mathutils import Euler
# Dimero do acido acetico: duas moleculas unidas por duas ligacoes de hidrogenio (tracejadas) -> ponto de ebulicao alto, acidez do grupo COOH
cena_q()
from rdkit import Chem
from rdkit.Chem import AllChem
at, lig = coords_rdkit('CC(=O)O', seed=3)
# indices: 0 C(metil), 1 C(carboxila), 2 O(=), 3 O(H), H do OH = vizinho de 3
hO = [j for (i, j, o) in lig if i == 3 and at[j][0] == 'H'] + [i for (i, j, o) in lig if j == 3 and at[i][0] == 'H']
hi = hO[0]
oA = at[2][1]; hA = at[hi][1]; oH = at[3][1]
u = (hA - oH).normalized()
c = (oA + hA + u * 1.65) / 2
atB = [(s, 2 * c - p) for s, p in at]
todos = at + atB
n = len(at)
ligs = lig + [(i + n, j + n, o) for (i, j, o) in lig]
todos = orienta_pca(todos, (-12, -38, -10))  # revisao 31/10: anel do dimero de frente, eixo longo na diagonal da tela (cabe no quadrado)
objs, pos = molecula(todos, ligs, r_lig=0.075)
# ligacoes de hidrogenio tracejadas
md = plastico("#2f7bff", 0.25)
for (h, o) in [(hi, 2 + n), (hi + n, 2)]:
    a = pos[h]; b = pos[o]; d = b - a; L = d.length; dn = d.normalized()
    a2 = a + dn * 0.32; b2 = b - dn * 0.42; L2 = (b2 - a2).length
    for k in range(4):
        t0 = k / 4 + 0.05; t1 = t0 + 0.13
        bastao(tuple(a2 + (b2 - a2) * t0), tuple(a2 + (b2 - a2) * t1), 0.085, md)
render(out("Q11.7"), elev=18, azim=-10)

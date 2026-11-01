import sys, os, math, random; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _qui import *
from mathutils import Euler
# Proporcao estequiometrica 2 H2 + O2 -> 2 H2O (revisao 31/10: grupo compacto, quase quadrado, para o objeto nao encolher)
# em cima: duas moleculas de H2 (uma atras da outra, a esquerda) + uma de O2 (a direita); seta dourada; embaixo: duas H2O (104,5 graus)
cena_q()
H2 = [('H', Vector((-0.37, 0, 0))), ('H', Vector((0.37, 0, 0)))]
O2 = [('O', Vector((-0.6, 0, 0))), ('O', Vector((0.6, 0, 0)))]
aw, lw = coords_rdkit('O')
aw = orienta_pca(aw)
ztop = 3.1
molecula(H2, [(0, 1, 1)], loc=(-1.0, 1.1, 0), z_min=ztop + 0.45)
molecula(H2, [(0, 1, 1)], loc=(-1.45, -0.6, 0), z_min=ztop - 0.1)
molecula(O2, [(0, 1, 2)], loc=(0.95, 0.1, 0), z_min=ztop - 0.03)
mg = metal('#d4a52a', 0.2)
cilindro((0, 0, 2.45), 0.12, 0.6, mg)
cone((0, 0, 1.95), 0.3, 0.0, 0.45, mg, rot=(math.pi, 0, 0))
awL = [(s_, Euler((0, 0, math.radians(18))).to_matrix() @ p) for s_, p in aw]
awR = [(s_, Euler((0, 0, math.radians(-18))).to_matrix() @ p) for s_, p in aw]
molecula(awL, lw, loc=(-1.3, 0.1, 0), z_min=0.3)
molecula(awR, lw, loc=(1.3, -0.1, 0), z_min=0.3)
render(out('Q04.3'), elev=20, azim=-14)

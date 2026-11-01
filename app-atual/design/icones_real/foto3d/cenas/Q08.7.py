import sys, os, math, random; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _qui import *
from mathutils import Euler
# Tubo de coleta de sangue: o sangue e mantido em pH 7,4 pelo tampao acido carbonico/bicarbonato (H2CO3/HCO3-)
cena_q()
objs = []
R = 0.42; H = 3.0
ext = [(0, 0)] + [(R * math.sin(a), R - R * math.cos(a)) for a in [i * math.pi / 2 / 10 for i in range(1, 11)]] + [(R, H)]
objs.append(torno(parede(ext, 0.035), vidro()))
objs.append(faixa(ext, 0.035, 0.02, 2.0, liquido('#8e0f16'), menisco=0.03))
# tampa roxa (EDTA)
mt = plastico('#7b2cbf', 0.32)
objs.append(cilindro((0, 0, H + 0.02), R + 0.08, 0.5, mt, chanfro=0.05))
objs.append(cilindro((0, 0, H + 0.36), R + 0.02, 0.22, mt, chanfro=0.05))
# rotulo de papel
objs.append(rotulo_cil(R + 0.006, 0.9, 1.4, ang_c=-90, arco=150))
for k in range(4):
    objs.append(rotulo_cil(R + 0.012, 1.95 - k * 0.22, 0.06, ang_c=-90, arco=90, m=fosco('#9a9a9a', 0.6)))
grupo(objs, loc=(0, 0, 0), rot=(0, 0, 20))
o = esfera((0.95, -0.4, 0.13), 0.16, liquido("#8e0f16")); o.scale = (1, 1, 0.55)
render(out('Q08.7'), elev=26)

# P06.2 figuras de pensamento (hiperbole, ironia, antitese...): megafone vermelho e branco - a ideia amplificada, dita "mais alto" que o sentido literal
from _por import *
cena_p()
ve = plastico('#d62828', 0.3); br = plastico('#f4f4f6', 0.3); pr = plastico('#1c1c22', 0.35)
ob = []
cone_ = torno([(0.16, 0.0), (0.18, 0.0), (0.6, 0.95), (0.62, 1.0), (0.57, 1.0), (0.15, 0.04)], ve, seg=96)
ob.append(cone_)
ob.append(torno([(0.6, 0.95), (0.66, 0.97), (0.66, 1.04), (0.6, 1.04), (0.57, 1.0)], br, seg=96))
ob.append(torno([(0.0, -0.32), (0.16, -0.32), (0.19, -0.28), (0.19, 0.0), (0.16, 0.02), (0.0, 0.02)], br, seg=64))
ob.append(torno([(0.0, -0.36), (0.12, -0.36), (0.14, -0.33), (0.0, -0.33)], pr))
# cabo com gatilho
ob.append(caixa((0, 0.0, -0.22), (0.11, 0.12, 0.42), pr, chanfro=0.04, rot=(math.radians(90), 0, 0)))
for o in ob[-1:]: o.location = (0, 0.12 + 0.2, -0.15); o.rotation_euler = (math.radians(-15), 0, 0)
ob.append(caixa((0, 0.16, -0.25), (0.05, 0.08, 0.12), ve, chanfro=0.02))
g = grupo(ob, rot=(math.radians(-80), 0, math.radians(-125)))
no_chao(g)
render(saida('P06.2'), elev=22, azim=-14)

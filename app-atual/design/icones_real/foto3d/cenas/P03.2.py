# P03.2 generos jornalisticos: microfone de reporter com cubo de identificacao (sem marca)
from _por import *
cena_p()
ob = []
preto = plastico('#1c1c20', 0.35)
ob.append(torno([(0, 0), (0.09, 0), (0.1, 0.03), (0.11, 0.6), (0.14, 0.95), (0.16, 1.05), (0.0, 1.05)], preto))
ob.append(torno([(0, 1.0), (0.17, 1.0), (0.18, 1.06), (0.0, 1.06)], metal('#9aa0a8', 0.3)))
g = esfera((0, 0, 1.25), 0.24, metal('#b9bec6', 0.35)); ob.append(g)
# grade da cabeca: malha de arame sobre a esfera
gr = esfera((0, 0, 1.25), 0.245, metal('#5a5f66', 0.4), seg=28)
w = gr.modifiers.new('wf', 'WIREFRAME'); w.thickness = 0.008; ob.append(gr)
# cubo de identificacao
cubo = caixa((0, 0, 0.72), (0.4, 0.4, 0.3), plastico('#d62828', 0.35), chanfro=0.04)
furo = cilindro((0, 0, 0.72), 0.125, 0.5, None); boolean(cubo, furo); ob.append(cubo)
for s in (-1, 1):
    ob.append(caixa((s * 0.0, -0.201, 0.72), (0.26, 0.004, 0.05), plastico('#ffffff', 0.3), chanfro=0.0))
no_chao(grupo(ob, loc=(0, 0, 0.17), rot=(math.radians(62), 0, math.radians(-125))))
render(saida('P03.2'), elev=34, azim=-14)

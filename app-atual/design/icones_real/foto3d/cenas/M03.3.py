from _mat import *
cena()
# cofrinho de porquinho com uma moeda entrando pela fenda: poupar (juros simples)
rosa = plastico('#f28bb0', 0.25); preto = plastico('#1b1b1b', 0.2); ouro = metal('#e0b13a', 0.22)
c = esfera((0, 0, 0.62), 0.55, rosa); c.scale = (1.25, 0.95, 0.92)
cilindro((-0.72, 0, 0.62), 0.2, 0.16, rosa, rot=(0, R(90), 0), chanfro=0.04)
for dy in (-0.07, 0.07):
    cilindro((-0.805, dy, 0.62), 0.035, 0.02, preto, rot=(0, R(90), 0), chanfro=0.005)
for dy in (-0.27, 0.27):
    esfera((-0.48, dy * 0.85, 0.82), 0.05, preto)
    o = cone((-0.35, dy, 1.08), 0.13, 0.0, 0.2, rosa, rot=(R(-25 if dy < 0 else 25), R(-15), 0)); o.scale = (1, 0.5, 1)
for (x, y) in ((-0.38, -0.3), (-0.38, 0.3), (0.38, -0.3), (0.38, 0.3)):
    cilindro((x, y, 0.13), 0.12, 0.26, rosa, chanfro=0.04)
pts = [(0.66, 0, 0.66), (0.78, 0.0, 0.72), (0.8, 0.08, 0.82), (0.74, 0.1, 0.78), (0.76, 0.02, 0.7)]
curva_tubo(pts, 0.025, rosa)
caixa((0.05, 0, 1.12), (0.08, 0.32, 0.04), preto, chanfro=0.01)
m = cilindro((0.05, 0, 1.36), 0.2, 0.05, ouro, rot=(R(90), 0, R(90)), chanfro=0.012)
toro((0.05, 0, 1.36), 0.17, 0.012, ouro, rot=(0, R(90), 0))
fim('M03.3', elev=24, azim=-30)

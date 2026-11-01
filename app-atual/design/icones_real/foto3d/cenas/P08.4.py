# P08.4 transitividade: pendulo de Newton com a primeira esfera erguida (a acao passa do verbo ao complemento)
from _por import *
cena_p()
cro = metal('#d6dae0', 0.1); bas = plastico('#1c1c22', 0.3)
caixa((0, 0, 0.06), (2.0, 1.0, 0.12), bas, chanfro=0.03)
H = 1.5
for x in (-0.9, 0.9):
    for y in (-0.38, 0.38):
        cilindro((x, y, 0.12 + H / 2), 0.025, H, cro)
for y in (-0.38, 0.38):
    cilindro((0, y, 0.12 + H), 0.025, 1.8, cro, rot=(0, math.radians(90), 0))
for x in (-0.9, 0.9):
    for y in (-0.38, 0.38): esfera((x, y, 0.12 + H), 0.04, cro)
r = 0.17; zb = 0.55; fio = fosco('#2a2a2a', 0.6)
for i in range(5):
    x = -0.68 + i * 2 * r * 1.0 + i * 0.0
    x = (i - 2) * 2 * r
    top = 0.12 + H
    if i == 0:
        ang = math.radians(42); L = top - zb
        cx, cz = x - L * math.sin(ang), top - L * math.cos(ang)
    else:
        cx, cz = x, zb
    esfera((cx, 0, cz), r, metal('#c9cdd3', 0.08))
    for y in (-0.38, 0.38): bastao((x, y, top), (cx, 0, cz + r * 0.9), 0.006, fio)
render(saida('P08.4'), elev=18, azim=-22)

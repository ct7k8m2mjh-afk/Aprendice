from _mat import *
cena()
# escada de madeira apoiada num muro de tijolos, com o angulo theta marcado no chao: altura = L sen(theta), afastamento = L cos(theta)
import random; random.seed(5)
caixa((0.1, 0, 0.03), (2.4, 1.2, 0.06), fosco('#c9c4b8', 0.8), chanfro=0.015)
bw, bh, bd = 0.36, 0.15, 0.4
for lin in range(12):
    for k in range(4):
        x = 0.85 + 0.0; y = -0.55 + k * bw + (bw / 2 if lin % 2 else 0) + bw / 2
        if y > 0.6: continue
        c = random.choice(['#b5482e', '#a8402a', '#c25536', '#9e3b26'])
        caixa((x, y, 0.06 + bh / 2 + lin * (bh + 0.012)), (bd, bw - 0.014, bh), fosco(c, 0.85), chanfro=0.012)
th = R(62); L = 2.0
foot = mathutils.Vector((0.65 - L * math.cos(th), 0, 0.06)); top = foot + mathutils.Vector((L * math.cos(th), 0, L * math.sin(th)))
mad = madeira('#d9a35e', escala=20)
for dy in (-0.22, 0.22):
    bastao(foot + mathutils.Vector((0, dy, 0)), top + mathutils.Vector((0, dy, 0)), 0.04, mad)
for k in range(1, 7):
    p = foot + (top - foot) * (k / 7.0)
    bastao(p + mathutils.Vector((0, -0.22, 0)), p + mathutils.Vector((0, 0.22, 0)), 0.026, mad)
curva_tubo([(foot.x + 0.45 * math.cos(R(t)), -0.3, 0.07 + 0.45 * math.sin(R(t))) for t in range(0, 63, 3)], 0.022, plastico(VERM, 0.3))
fim('M10.1', elev=14, azim=-28)

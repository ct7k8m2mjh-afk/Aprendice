from _mat import *
cena()
# soroban (abaco japones) marcando 3 0 7 2 5: a conta de cima vale 5 e cada conta de baixo vale 1
mad = madeira('#6a3a1c', escala=10); vara = metal('#c9a227', 0.25)
cont = plastico('#2a2a2a', 0.25); cont5 = plastico(VERM, 0.22)
n = 5; dx = 0.42; W = n * dx + 0.2; H = 2.1
for (y, w, h) in ((H / 2, W + 0.12, 0.12), (-H / 2, W + 0.12, 0.12)):
    caixa((0, y, 0.08), (w, h, 0.16), mad, chanfro=0.02)
for x in (-W / 2, W / 2): caixa((x, 0, 0.08), (0.12, H, 0.16), mad, chanfro=0.02)
yb = 0.45
caixa((0, yb, 0.1), (W, 0.07, 0.1), mad, chanfro=0.015)
dig = [3, 0, 7, 2, 5]; r = 0.17; hz = 0.11
def conta(x, y, m):
    o = esfera((x, y, 0.08), r, m); o.scale = (1, hz / r, 0.75)
for k, dg in enumerate(dig):
    x = (k - 2) * dx
    bastao((x, -H / 2, 0.08), (x, H / 2, 0.08), 0.012, vara)
    cinco, um = dg // 5, dg % 5
    # conta de cima (5): encostada na barra se ativa, senao no topo
    conta(x, yb + 0.035 + hz + (0 if cinco else 0.32), cont5)
    # contas de baixo (1): 'um' delas encostadas na barra, o resto no fundo
    for j in range(4):
        if j < um: y = yb - 0.035 - hz - j * 2 * hz
        else: y = -H / 2 + 0.06 + hz + (3 - j) * 2 * hz
        conta(x, y, cont)
caixa((0, yb, 0.16), (0.04, 0.04, 0.02), plastico('#ffffff', 0.3), chanfro=0)
fim('M17.2', elev=50, azim=-10)

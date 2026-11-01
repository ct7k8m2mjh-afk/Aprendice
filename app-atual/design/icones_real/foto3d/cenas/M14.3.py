from _mat import *
cena()
# tabuleiro de Galton: as bolinhas batem nos pinos e se acumulam em forma de sino (media no centro, espalhamento = desvio padrao)
mad = madeira('#c48a50', escala=12); fundo = plastico('#2b4f8f', 0.45); pino = metal('#d9dce2', 0.18); bol = plastico(VERM, 0.15)
W, H = 1.6, 2.2
caixa((0, 0.06, H / 2), (W, 0.04, H), fundo, chanfro=0.005)
for (x, z, w, h) in ((-W / 2, H / 2, 0.08, H), (W / 2, H / 2, 0.08, H), (0, 0.04, W + 0.08, 0.08), (0, H, W + 0.08, 0.08)):
    caixa((x, 0, z), (w, 0.16, h), mad, chanfro=0.015)
for lin in range(7):
    n = lin + 3
    for k in range(n):
        x = (k - (n - 1) / 2) * 0.16; z = H - 0.3 - lin * 0.13
        cilindro((x, -0.01, z), 0.018, 0.12, pino, rot=(R(90), 0, 0), chanfro=0)
nb = 9; bw = (W - 0.08) / nb
alt = [1, 3, 7, 11, 13, 11, 7, 3, 1]
for k in range(nb + 1):
    x = -W / 2 + 0.04 + k * bw
    caixa((x, -0.01, 0.08 + 0.3), (0.02, 0.12, 0.6), mad, chanfro=0.004)
r = 0.035
for k, n in enumerate(alt):
    xc = -W / 2 + 0.04 + (k + 0.5) * bw
    for j in range(n):
        esfera((xc + (r if j % 2 else -r) * 0.9, -0.01, 0.08 + r + j * 1.9 * r * 0.95 * 0.55 * 1.0), r, bol) if False else esfera((xc + (-r if j % 2 == 0 else r) * 0.95, -0.01, 0.08 + r + (j // 2) * 2 * r), r, bol)
cone((0, -0.01, H - 0.12), 0.25, 0.04, 0.2, plastico('#f2f2f2', 0.3), rot=(0, 0, 0))
caixa((0, -0.1, H / 2), (W - 0.06, 0.01, H - 0.08), vidro(), chanfro=0.002)
fim('M14.3', elev=12, azim=-16)

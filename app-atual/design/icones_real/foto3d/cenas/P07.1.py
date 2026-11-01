# P07.1 classes de palavras: arquivo de madeira com gavetas etiquetadas, uma aberta cheia de fichas com abas coloridas
from _por import *
cena_p()
mad = madeira('#b5783e', '#7d4a1f', 8)
lat = metal('#d4a52a', 0.25)
W, D, Hc = 1.1, 1.3, 0.48
for k in range(3):
    z = 0.02 + k * Hc
    caixa((0, 0, z + Hc / 2), (W, D, Hc - 0.02), mad, chanfro=0.02)
# gaveta de cima puxada para fora
k = 2; z = 0.02 + k * Hc
caixa((0, 0, z + Hc + 0.03), (W + 0.04, D + 0.04, 0.06), mad, chanfro=0.02)
gv_y = -0.55
for s in (-1, 1): caixa((s * (W / 2 - 0.05), gv_y, z + Hc / 2 - 0.03), (0.06, D, Hc - 0.14), mad, chanfro=0.01)
caixa((0, gv_y - D / 2 + 0.03, z + Hc / 2 - 0.03), (W - 0.04, 0.06, Hc - 0.1), mad, chanfro=0.015)
caixa((0, gv_y, z + 0.06), (W - 0.1, D, 0.04), mad, chanfro=0.01)
cores = ['#d62828', '#f2b705', '#2e9e44', '#1f5fd6']
for i in range(12):
    y = gv_y - 0.45 + i * 0.075
    caixa((0, y, z + 0.27), (W - 0.18, 0.012, 0.36), papel('#fbf9f2'), chanfro=0.002)
    if i % 3 == 0:
        c = cores[(i // 3) % 4]; xo = -0.3 + 0.2 * ((i // 3) % 4)
        caixa((xo, y, z + 0.48), (0.2, 0.014, 0.08), plastico(c, 0.4), chanfro=0.004)
# frentes: porta-etiqueta e puxador
for kk, yf in ((0, -D / 2 - 0.005), (1, -D / 2 - 0.005), (2, gv_y - D / 2 - 0.002)):
    zc = 0.02 + kk * Hc + Hc / 2 + (-0.03 if kk == 2 else 0)
    caixa((0, yf - 0.006, zc + 0.08), (0.36, 0.012, 0.14), lat, chanfro=0.004)
    caixa((0, yf - 0.012, zc + 0.08), (0.3, 0.004, 0.09), papel('#fbf9f2'), chanfro=0)
    bez([(-0.14, yf, zc - 0.07), (-0.1, yf - 0.07, zc - 0.09), (0.1, yf - 0.07, zc - 0.09), (0.14, yf, zc - 0.07)], 0.018, lat)
render(saida('P07.1'), elev=24, azim=-30)

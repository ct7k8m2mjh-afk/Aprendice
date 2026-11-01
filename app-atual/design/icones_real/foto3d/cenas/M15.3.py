from _mat import *
cena()
# pecas numeradas formando a matriz aumentada [1 1 1 | 6 ; 1 -1 2 | 5 ; 2 1 -1 | 1] (solucao x = 1, y = 2, z = 3)
M = [['1', '1', '1', '6'], ['1', '−1', '2', '5'], ['2', '1', '−1', '1']]
mad = madeira('#efd3a0', escala=14, rugos=0.4); q = 0.42
caixa((0.05, 0, 0.03), (4 * q + 0.7, 3 * q + 0.34, 0.06), plastico(AZUL, 0.35), chanfro=0.025)
for i in range(3):
    for j in range(4):
        x = (j - 1.5) * q + (0.12 if j == 3 else 0); y = (1 - i) * q
        caixa((x, y, 0.06 + 0.06), (q * 0.9, q * 0.9, 0.12), mad, chanfro=0.025)
        decal(M[i][j], (x, y, 0.1815), 0.2, cor_txt=(35, 25, 18, 255), nome='M15.3_%d%d' % (i, j))
mt = metal('#d9dce2', 0.15)
for s in (-1, 1):
    x = s * (2 * q + 0.12 * (s > 0) + 0.13) + (0.0)
    caixa((x, 0, 0.1), (0.05, 3 * q + 0.1, 0.08), mt, chanfro=0.01)
    for dy in (-1, 1): caixa((x - s * 0.06, dy * (1.5 * q + 0.05), 0.1), (0.14, 0.05, 0.08), mt, chanfro=0.01)
caixa((1.5 * q - 0.21 + 0.06 * 0 + 0.0 + 0.0, 0, 0.1), (0.03, 3 * q + 0.05, 0.08), plastico(VERM, 0.3), chanfro=0.008) if False else caixa(((2 - 1.5) * q + q / 2 + 0.06, 0, 0.1), (0.03, 3 * q, 0.09), plastico(VERM, 0.3), chanfro=0.008)
fim('M15.3', elev=50, azim=-14)

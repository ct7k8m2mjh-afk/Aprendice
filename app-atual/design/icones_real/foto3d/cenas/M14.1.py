from _mat import *
cena()
# pilhas de 3, 6, 2, 5 e 4 pecas de encaixar com uma regua vermelha na altura da media: (3+6+2+5+4)/5 = 4 (mediana tambem 4)
u = 0.34; h = 0.2; cs = [AZUL, VERDE, AMAR, LARANJA, ROXO]
for k, n in enumerate([3, 6, 2, 5, 4]):
    x = (k - 2) * (u + 0.06); m = plastico(cs[k], 0.25)
    for j in range(n):
        caixa((x, 0, h / 2 + j * h), (u, u, h * 0.98), m, chanfro=0.02)
    for dx in (-0.08, 0.08):
        for dy in (-0.08, 0.08):
            cilindro((x + dx, dy, n * h + 0.03), 0.055, 0.06, m, chanfro=0.012)
caixa((0, -0.02, 4 * h + 0.0), (5 * (u + 0.06) + 0.25, 0.04, 0.035), plastico(VERM, 0.2), chanfro=0.01)
caixa((0, 0, -0.0), (5 * (u + 0.06) + 0.3, u + 0.2, 0.02), plastico('#e8e8e4', 0.4), chanfro=0.008)
fim('M14.1', elev=18, azim=-24)

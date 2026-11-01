# P06 Figuras de linguagem: prisma de vidro decompondo a luz branca nas cores (vermelho desvia menos, violeta mais)
from _por import *
cena_p()
L = 0.75
tri = [(-L, -L * 0.577), (L, -L * 0.577), (0, L * 1.155)]
pr = placa(tri, 0.7, vidro('#f2f8ff', 0.0), chanfro=0.02, loc=(0, 0, 0.0))
# feixe branco chegando pela esquerda (fica rente ao chao)
def faixa(p0, p1, larg, m, z=0.012):
    d = (p1[0] - p0[0], p1[1] - p0[1]); n = math.hypot(*d); nx, ny = -d[1] / n * larg / 2, d[0] / n * larg / 2
    return placa([(p0[0] - nx, p0[1] - ny), (p1[0] - nx, p1[1] - ny), (p1[0] + nx, p1[1] + ny), (p0[0] + nx, p0[1] + ny)], 0.004, m, loc=(0, 0, z))
faixa((-2.0, -0.55), (-0.38, 0.0), 0.06, emissivo('#ffffff', 4))
cores = ['#ff2a2a', '#ff8c1a', '#ffe11a', '#2ecc40', '#1f7bff', '#8a3cff']
for i, c in enumerate(cores):
    a = math.radians(-14 - i * 5.5)
    p0 = (0.36, 0.02 - i * 0.02); p1 = (0.36 + 1.6 * math.cos(a), 0.02 - i * 0.02 + 1.6 * math.sin(a))
    faixa(p0, p1, 0.055 + i * 0.004, emissivo(c, 3.2), z=0.012 + i * 0.0005)
render(saida('P06'), elev=40, azim=-6)

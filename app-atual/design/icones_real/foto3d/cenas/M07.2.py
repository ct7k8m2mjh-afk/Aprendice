from _mat import *
cena()
# cinco bonecas russas, cada uma com 3/4 da altura da anterior (PG de razao 0,75)
pele = plastico('#f6dcc4', 0.35); preto = plastico('#1b1b1b', 0.2)
cores = [VERM, AZUL, VERDE, AMAR, ROXO]
x = -1.2; Hs = [1.4 * 0.75 ** k for k in range(5)]
for k, H in enumerate(Hs):
    s = H / 1.4; r = 0.36 * s
    m = plastico(cores[k], 0.22)
    c = esfera((x, 0, 0.42 * s), r * 1.05, m); c.scale = (1, 1, 1.18)
    h = esfera((x, 0, 1.02 * s), r * 0.82, m)
    f = esfera((x, -r * 0.62, 1.0 * s), r * 0.5, pele); f.scale = (1, 0.55, 1)
    for dx in (-0.16, 0.16): esfera((x + dx * r, -r * 0.88, 1.04 * s), r * 0.07, preto)
    a = esfera((x, -r * 0.76, 0.45 * s), r * 0.55, plastico('#ffffff', 0.3)); a.scale = (1, 0.65, 1.1)
    esfera((x, -r * 1.1, 0.5 * s), r * 0.22, plastico(AMAR if k != 3 else VERM, 0.3)).scale = (1, 0.4, 1)
    x += r * 1.05 + 0.36 * 0.75 ** (k + 1) * 1.05 + 0.04
fim('M07.2', elev=16, azim=-10)

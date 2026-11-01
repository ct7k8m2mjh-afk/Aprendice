from _mat import *
cena()
# pilhas de 1, 3 e 5 copos encaixados: cada copo a mais soma a mesma altura (PA de razao constante)
passo = 0.13; hc = 0.62
for k, (n, c) in enumerate(((1, VERM), (3, AZUL), (5, VERDE))):
    x = -0.8 + k * 0.8; y = 0.15 * (k - 1) * -1
    m = plastico(c, 0.25)
    for j in range(n):
        copo((x, y, j * passo), 0.2, hc, m, esp=0.018, r_topo=0.29)
        toro((x, y, j * passo + hc), 0.29, 0.02, m)
fim('M07.1', elev=20, azim=-12)

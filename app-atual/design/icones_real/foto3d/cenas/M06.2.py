from _mat import *
cena()
# arvore de bolinhas e varetas (kit de modelos): 1 -> 2 -> 4 -> 8 ramos; 2^x = 8 da x = 3 niveis
cores = [VERM, AZUL, VERDE, AMAR]; var = plastico('#bfc4cc', 0.3)
niveis = [[(0, 0)]]
for n in range(1, 4):
    w = 2.4 / (2 ** n)
    niveis.append([(x + s * w / 2 * 1.0, 0) for (x, _) in niveis[-1] for s in (-1, 1)])
zs = [0.3, 0.95, 1.5, 1.95]
for n, nv in enumerate(niveis):
    for k, (x, y) in enumerate(nv):
        p = (x, 0.2 * ((k % 2) * 2 - 1) if n == 3 else 0, zs[n])
        esfera(p, [0.2, 0.16, 0.13, 0.11][n], plastico(cores[n], 0.22))
        if n:
            px, _ = niveis[n - 1][k // 2]; bastao((px, 0, zs[n - 1]), p, 0.042, var)
cilindro((0, 0, 0.05), 0.35, 0.1, plastico('#2a2a2a', 0.4), chanfro=0.03)
bastao((0, 0, 0.1), (0, 0, 0.3), 0.04, var)
fim('M06.2', elev=14, azim=-10)

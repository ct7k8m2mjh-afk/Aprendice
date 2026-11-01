from _mat import *
cena()
# gangorra em equilibrio: 2 pesos a 1 passo do apoio e 1 peso a 2 passos (peso x distancia constante: inversamente proporcionais)
tab = madeira('#c98a4a', escala=12); apoio = plastico(AMAR, 0.3); m1 = plastico(AZUL, 0.28); m2 = plastico(VERM, 0.28)
u = 0.42; zt = 0.62
prisma([(-0.36, 0.0), (0.36, 0.0), (0, zt - 0.04)], -0.32, 0.64, apoio, chanfro=0.03, rot=(R(90), 0, 0))
caixa((0, 0, 0.02), (1.0, 0.8, 0.04), plastico('#3a3a3a', 0.4), chanfro=0.015)
caixa((0, 0, zt), (6 * u + 0.2, 0.5, 0.08), tab, chanfro=0.02)
for k in range(-3, 4):
    caixa((k * u, -0.252, zt), (0.025, 0.006, 0.06), fosco('#3b2414'), chanfro=0)
s = 0.38
for z in (0, 1):
    caixa((-u, 0, zt + 0.04 + s / 2 + z * s), (s * 0.96, s * 0.96, s * 0.96), m1, chanfro=0.05)
caixa((2 * u, 0, zt + 0.04 + s / 2), (s * 0.96, s * 0.96, s * 0.96), m2, chanfro=0.05)
fim('M02.4', elev=22, azim=-28)

from _mat import *
cena()
# rampa de madeira com a subida (vertical, vermelha), o avanco (horizontal, azul) e o angulo alfa: m = dy/dx = tg(alfa)
dx, dy = 2.0, 1.0
mad = madeira('#d6a160', escala=14)
prisma([(0, 0), (dx, 0), (dx, dy)], -0.35, 0.7, mad, chanfro=0.02, loc=(-1.0, 0, 0), rot=(R(90), 0, 0))
# a malha do prisma esta em XZ depois da rotacao (y local -> z)
vm = plastico(VERM, 0.3); az = plastico(AZUL, 0.3); am = plastico(AMAR, 0.3)
caixa((1.0 + 0.06, -0.36, dy / 2), (0.05, 0.05, dy), vm, chanfro=0.01)
caixa((0.0, -0.36, -0.0 + 0.03), (dx, 0.05, 0.05), az, chanfro=0.01)
curva_tubo([(-1.0 + 0.5 * math.cos(t), -0.37, 0.03 + 0.5 * math.sin(t)) for t in [k * math.atan(dy / dx) / 12 for k in range(13)]], 0.02, am)
esfera((0.2 - 0.0894, 0, 0.6 + 0.1789), 0.2, plastico(VERDE, 0.2))
fim('M12.2', elev=16, azim=-18)

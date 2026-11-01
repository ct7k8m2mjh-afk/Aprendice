from _mat import *
cena()
# duas maquinas encadeadas, f e depois g: a bolinha entra em f, sai como cubo, entra em g e sai como estrela (g o f)
def maquina(x, c, letra, nome):
    m = plastico(c, 0.3)
    caixa((x, 0, 0.35), (0.7, 0.6, 0.7), m, chanfro=0.06)
    copo((x, 0, 0.7), 0.12, 0.25, m, esp=0.025, r_topo=0.26)
    decal(letra, (x, -0.302, 0.38), 0.34, fonte_p=FS, rot=(R(90), 0, 0), nome=nome)
    caixa((x + 0.42, 0, 0.18), (0.22, 0.24, 0.04), m, chanfro=0.01, rot=(0, R(25), 0))
maquina(-0.55, AZUL, 'f', 'M05.5f'); maquina(0.55, VERDE, 'g', 'M05.5g')
esfera((-0.55, 0, 1.12), 0.12, plastico(VERM, 0.25))
caixa((0.55, 0, 1.1), (0.2, 0.2, 0.2), plastico(AMAR, 0.25), chanfro=0.03, rot=(R(20), R(15), R(30)))
pts = []
for k in range(10):
    a = R(90) + k * math.pi / 5; r = 0.17 if k % 2 == 0 else 0.07
    pts.append((r * math.cos(a), r * math.sin(a)))
prisma(pts, 0, 0.08, plastico(ROXO, 0.25), chanfro=0.02, loc=(1.25, 0, 0.17), rot=(R(80), 0, 0))
fim('M05.5', elev=20, azim=-12)

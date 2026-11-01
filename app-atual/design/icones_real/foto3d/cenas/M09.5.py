from _mat import *
cena()
# triangulo de papelao com os tres angulos coloridos (50, 60, 70 graus) e as tres pontas recortadas juntas sobre uma reta: 180 graus
a, b, c = 50, 60, 70
L = 1.5; A = (0, 0); B = (L, 0)
# C pela lei dos senos
AC = L * math.sin(math.radians(b)) / math.sin(math.radians(c))
C = (AC * math.cos(math.radians(a)), AC * math.sin(math.radians(a)))
pap = fosco('#e3bf86', 0.7); cs = [plastico(VERM, 0.35), plastico(AZUL, 0.35), plastico(AMAR, 0.35)]
off = (-1.35, -0.1)
T = [(p[0] + off[0], p[1] + off[1]) for p in (A, B, C)]
prisma(T, 0, 0.06, pap, chanfro=0.008)
rr = 0.3
setor(T[0], rr, 0, a, 0.06, 0.014, cs[0])
setor(T[1], rr, 180 - b, 180, 0.06, 0.014, cs[1])
setor(T[2], rr, 180 + a, 360 - b, 0.06, 0.014, cs[2])
# reta (regua) e as tres pontas juntas formando meia-volta
O = (0.85, -0.2)
caixa((O[0], O[1] - 0.05, 0.02), (1.3, 0.1, 0.04), madeira('#d9ac6a', escala=20), chanfro=0.008)
setor(O, 0.48, 0, a, 0.0, 0.05, cs[0])
setor(O, 0.48, a, a + c, 0.0, 0.05, cs[2])
setor(O, 0.48, a + c, 180, 0.0, 0.05, cs[1])
fim('M09.5', elev=58, azim=-10)

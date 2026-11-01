from _mat import *
cena()
# pipa (deltoide: dois pares de lados consecutivos iguais) com as varetas em cruz e a rabiola
A = (0, 1.1); B = (0.62, 0.35); C = (0, -0.95); D = (-0.62, 0.35)
objs = [prisma([A, B, (0, 0.35)], 0, 0.012, plastico(VERM, 0.35), chanfro=0.002),
        prisma([A, (0, 0.35), D], 0, 0.012, plastico(AMAR, 0.35), chanfro=0.002),
        prisma([(0, 0.35), B, C], 0, 0.012, plastico(AZUL, 0.35), chanfro=0.002),
        prisma([D, (0, 0.35), C], 0, 0.012, plastico(VERDE, 0.35), chanfro=0.002)]
vm = madeira('#d9b27a', escala=30)
objs.append(bastao((A[0], A[1], 0.02), (C[0], C[1], 0.02), 0.018, vm))
objs.append(bastao((D[0], D[1], 0.022), (B[0], B[1], 0.022), 0.018, vm))
fio = fosco('#f2f2f2', 0.6)
pts = []
for k in range(40):
    t = k / 39; pts.append((0.25 * math.sin(t * 7.0) * t, -0.95 - 1.1 * t, 0.0 - 0.1 * t))
objs.append(curva_tubo(pts, 0.008, fio))
for k in range(1, 6):
    t = k / 6; x = 0.25 * math.sin(t * 7.0) * t; y = -0.95 - 1.1 * t
    o = esfera((x, y, -0.1 * t), 0.08, plastico([VERM, AMAR, AZUL, VERDE, LARANJA][k - 1], 0.35)); o.scale = (1.2, 0.5, 0.15); objs.append(o)
grupo(objs, loc=(0, 0, 1.4), rot=(R(70), 0, R(-18)))
fim('M08.2', elev=16, azim=-8)

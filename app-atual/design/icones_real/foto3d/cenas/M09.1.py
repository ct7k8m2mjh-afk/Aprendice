from _mat import *
cena()
# triangulo retangulo 3-4-5 de madeira com quadrados de ladrilhos nos lados: 9 + 16 = 25
u = 0.26; mad = madeira('#e2b57a', escala=14)
A = mathutils.Vector((0, 0)); B = mathutils.Vector((4 * u, 0)); C = mathutils.Vector((0, 3 * u))
prisma([tuple(A), tuple(B), tuple(C)], 0, 0.12, mad, chanfro=0.015)
def quadrado(P, Q, n, c, fora):
    e1 = (Q - P) / n; e2 = mathutils.Vector((-e1.y, e1.x)) * fora
    m = plastico(c, 0.28)
    for i in range(n):
        for j in range(n):
            o = P + e1 * (i + 0.5) + e2 * (j + 0.5)
            ang = math.atan2(e1.y, e1.x)
            caixa((o.x, o.y, 0.05), (u * 0.94, u * 0.94, 0.1), m, chanfro=0.018, rot=(0, 0, ang))
quadrado(A, B, 4, AZUL, -1)     # lado 4 -> 16
quadrado(C, A, 3, VERM, -1)     # lado 3 -> 9 (para a esquerda)
quadrado(B, C, 5, AMAR, -1)     # hipotenusa 5 -> 25
fim('M09.1', elev=52, azim=-12)

from _mat import *
cena()
# triangulo retangulo 3-4-5 cortado pela altura h relativa a hipotenusa: projecoes m = 1,8 e n = 3,2, h = 2,4 (h^2 = m.n = 5,76).
# revisao 31/10: era uma placa fina deitada (abstrata). Agora dois blocos grossos de madeira pintada, EM PE sobre o cateto maior,
# separados pelo corte da altura; h, m e n impressos em branco e o angulo reto (vermelho) no pe da altura.
k = 0.6
O = mathutils.Vector((0, 0)); A = mathutils.Vector((4 * k, 0)); B = mathutils.Vector((0, 3 * k))
u = (B - A).normalized(); Hf = A + u * ((O - A).dot(u))           # pe da altura
nrm = Hf.normalized(); perp = mathutils.Vector((-nrm.y, nrm.x))    # direcao da altura e perpendicular a ela
g = 0.05
p1 = [O, A, Hf]; p2 = [O, Hf, B]
P1 = [tuple(p - perp * g) for p in p1]; P2 = [tuple(p + perp * g) for p in p2]
E = 0.5
for pts, c in ((P1, AZUL), (P2, AMAR)):
    o = prisma(pts, 0, E, plastico(c, 0.3), chanfro=0.035)
    o.rotation_euler = (R(90), 0, 0); o.location = (0, E, 0)        # em pe: XY do desenho -> XZ, face da frente em y = 0
def no_plano(p, desloc=(0, 0)):
    return (p[0] + desloc[0], -0.004, p[1] + desloc[1])
def letra(t, p, alt=0.3, c=(255, 255, 255, 255)):
    decal(t, no_plano(p), alt, cor_txt=c, fonte_p=FS, rot=(R(90), 0, 0), nome='M094_' + t + str(c[0]))
# rotulos: h no meio da altura, m e n ao longo da hipotenusa (dentro das pecas)
mid_h = (O + Hf) / 2
letra('h', tuple(mid_h + perp * 0.2 - nrm * 0.05), 0.32, (30, 40, 90, 255))
letra('n', tuple((A + Hf) / 2 - nrm * 0.25), 0.3)
letra('m', tuple((B + Hf) / 2 - nrm * 0.26 + perp * 0.02), 0.3, (30, 40, 90, 255))
# angulo reto no pe da altura (marca vermelha sobre a peca azul)
v = plastico(VERM, 0.3); s_ = 0.16
c0 = Hf - perp * g
q1 = c0 - nrm * s_; q2 = q1 - perp * s_; q3 = c0 - perp * s_
for a, b in ((q1, q2), (q2, q3)):
    bastao((a.x, -0.01, a.y), (b.x, -0.01, b.y), 0.018, v)
fim('M09.4', elev=18, azim=-24)

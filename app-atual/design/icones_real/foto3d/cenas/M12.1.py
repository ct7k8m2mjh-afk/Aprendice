from _mat import *
cena()
# trena amarela esticada entre dois alfinetes A e B num papel quadriculado: a distancia entre dois pontos.
# revisao 31/10: papel branco grande deixava tudo pequeno -> cartao quadriculado menor sobre base azul, trena de caixa grande
# (de pe, como uma trena de verdade) e alfinetes maiores, com A e B impressos ao lado dos pontos.
S = 1.6
im, d = papel_quad('M12.1_p', N=900, passo=150)
A = mathutils.Vector((-0.5, -0.42, 0.0)); B = mathutils.Vector((0.3, 0.25, 0.0))
def pxl(P): return ((P.x + S / 2) / S * 900, (S / 2 - P.y) / S * 900)
for P, t, c in ((A, 'A', (214, 40, 40, 255)), (B, 'B', (31, 95, 214, 255))):
    x, y = pxl(P); d.text((x - 100, y - 50), t, font=fonte(FB, 110), fill=c, anchor='mm')
mp = img_mat(salva(im, 'M12.1_p'), rugos=0.7, coat=0)
caixa((0, 0, 0.04), (S + 0.2, S + 0.2, 0.08), plastico('#2a3f6b', 0.4), chanfro=0.03)
plano_img((0, 0, 0.0815), S, S, mp)
z0 = 0.08
for P, c in ((A, VERM), (B, AZUL)):
    bastao((P.x, P.y, z0), (P.x, P.y, z0 + 0.3), 0.016, metal('#cfd2d8', 0.2))
    cilindro((P.x, P.y, z0 + 0.33), 0.11, 0.09, plastico(c, 0.25), chanfro=0.02)
    esfera((P.x, P.y, z0 + 0.47), 0.135, plastico(c, 0.25))
dirv = (B - A).normalized(); ang = math.atan2(dirv.y, dirv.x)
L = (B - A).length + 0.55
im2, d2 = tex('fita', 1400, 80, (246, 200, 30, 255))
for k in range(0, 141):
    x = k * 10; Lk = 50 if k % 10 == 0 else (32 if k % 5 == 0 else 18); d2.line((x, 0, x, Lk), fill=(25, 25, 25, 255), width=3)
mf = img_mat(salva(im2, 'M12.1_fita'), rugos=0.3, coat=0.4)
mid = A + dirv * (L / 2)
plano_img((mid.x, mid.y, z0 + 0.016), L, 0.15, mf, rot=(0, 0, ang))
caixa((mid.x, mid.y, z0 + 0.008), (L, 0.15, 0.012), plastico('#f6c81e', 0.3), chanfro=0, rot=(0, 0, ang))
caixa((A.x, A.y, z0 + 0.05), (0.05, 0.17, 0.08), metal('#c9a227', 0.25), chanfro=0.01, rot=(0, 0, ang))
# caixa da trena, de pe
E = A + dirv * (L + 0.36)
caixa((E.x, E.y, z0 + 0.4), (0.78, 0.4, 0.8), plastico(AMAR, 0.28), chanfro=0.2, rot=(0, 0, ang))
n = mathutils.Vector((-dirv.y, dirv.x, 0))
for s_ in (1, -1):
    Q = E + n * (0.205 * s_)
    cilindro((Q.x, Q.y, z0 + 0.42), 0.26, 0.02, plastico('#2a2a2a', 0.35), rot=(R(90), 0, ang), chanfro=0.008)
    cilindro((Q.x, Q.y, z0 + 0.42), 0.08, 0.04, metal('#cfd2d8', 0.2), rot=(R(90), 0, ang), chanfro=0.01)
fim('M12.1', elev=34, azim=-16)

from _mat import *
cena()
# relogio de parede as 2 h: ponteiros a 60 graus; a distancia entre as pontas sai da lei dos cossenos
N = 900; c = 450; im, d = tex('mostr', N, N, (0, 0, 0, 0))
d.ellipse((0, 0, N - 1, N - 1), fill=(252, 252, 248, 255))
f = fonte(FB, 92)
for k in range(60):
    a = math.radians(k * 6 - 90); r1 = 430; r2 = 390 if k % 5 == 0 else 412
    d.line((c + r1 * math.cos(a), c + r1 * math.sin(a), c + r2 * math.cos(a), c + r2 * math.sin(a)), fill=(30, 30, 30, 255), width=12 if k % 5 == 0 else 5)
for n in range(1, 13):
    a = math.radians(n * 30 - 90); d.text((c + 320 * math.cos(a), c + 320 * math.sin(a)), str(n), font=f, fill=(30, 30, 30, 255), anchor='mm')
# arco de 60 graus entre os ponteiros e a distancia entre as pontas (tracejada)
d.arc((c - 120, c - 120, c + 120, c + 120), -90, -30, fill=(214, 40, 40, 255), width=10)
d.text((c + 95, c - 175), '60°', font=fonte(FB, 54), fill=(214, 40, 40, 255), anchor='mm')
p1 = (c, c - 270); a = math.radians(-30); p2 = (c + 200 * math.cos(a), c + 200 * math.sin(a))
for t in range(0, 10, 2):
    q1 = (p1[0] + (p2[0] - p1[0]) * t / 10, p1[1] + (p2[1] - p1[1]) * t / 10); q2 = (p1[0] + (p2[0] - p1[0]) * (t + 1) / 10, p1[1] + (p2[1] - p1[1]) * (t + 1) / 10)
    d.line((q1, q2), fill=(31, 95, 214, 255), width=9)
# ponteiros
d.line((c, c, p1[0], p1[1]), fill=(25, 25, 25, 255), width=16)
d.line((c, c, p2[0], p2[1]), fill=(25, 25, 25, 255), width=26)
d.ellipse((c - 26, c - 26, c + 26, c + 26), fill=(214, 40, 40, 255))
mt = img_mat(salva(im, 'M10.3_m'), rugos=0.25, coat=0.4, alpha=True)
objs = [cilindro((0, 0, 0), 1.0, 0.18, plastico(VERM, 0.25), rot=(R(90), 0, 0), chanfro=0.06),
        plano_img((0, -0.0915, 0), 1.8, 1.8, mt, rot=(R(90), 0, 0)),
        cilindro((0, -0.1, 0), 0.9, 0.012, vidro(), rot=(R(90), 0, 0), chanfro=0.004)]
grupo(objs, loc=(0, 0, 1.0), rot=(R(-8), 0, 0))
fim('M10.3', elev=14, azim=-18)

from _mat import *
cena()
# regua de metal equilibrada no apoio em 2: 3 pesos no 1 e 1 peso no 5 -> (3.1 + 1.5)/4 = 2, a media ponderada
im, d = tex('reg', 1400, 140, (232, 234, 238, 255)); f = fonte(FB, 56)
for k in range(0, 61):
    x = 100 + k * 20; L = 60 if k % 10 == 0 else (40 if k % 5 == 0 else 24); d.line((x, 0, x, L), fill=(30, 30, 30, 255), width=4)
for k in range(7): d.text((100 + k * 200, 105), str(k), font=f, fill=(30, 30, 30, 255), anchor='mm')
mt = img_mat(salva(im, 'M14.4_r'), rugos=0.25, metal=0.6)
L = 2.4; s = L / 1400 * 200   # unidade
X = lambda v: -L / 2 + (100 + v * 200) / 1400 * L
off = -X(2)
objs = [caixa((0, 0, 0), (L, 0.4, 0.06), metal('#c9ccd2', 0.25), chanfro=0.01), plano_img((0, 0, 0.0305), L, 0.4, mt)]
g = grupo(objs, loc=(off, 0, 0.62))
prisma([(-0.3, 0.04), (0.3, 0.04), (0, 0.59)], -0.25, 0.5, plastico(VERM, 0.3), chanfro=0.02, loc=(0, 0, 0.0), rot=(R(90), 0, 0))
caixa((0, 0, 0.02), (0.8, 0.6, 0.04), plastico('#2a2a2a', 0.4), chanfro=0.015)
lat = metal('#d4a52a', 0.2)
for j in range(3):
    cilindro((X(1) + off, 0, 0.65 + 0.11 + j * 0.22), 0.16, 0.2, lat, chanfro=0.035)
cilindro((X(5) + off, 0, 0.65 + 0.11), 0.16, 0.2, lat, chanfro=0.035)
fim('M14.4', elev=24, azim=-24)

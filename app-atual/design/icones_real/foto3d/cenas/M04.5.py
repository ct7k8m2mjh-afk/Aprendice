from _mat import *
cena()
# caixa de papelao montada a partir de uma folha 10 x 10 com cortes x nos cantos: base (10 - 2x) e altura x
pap = fosco('#c8995e', 0.85); dentro = fosco('#b8884f', 0.9)
b = 1.2; x = 0.4; e = 0.02
caixa((0, 0, e / 2), (b, b, e), pap, chanfro=0.004)
for (ang, dx, dy, rz) in ((R(70), 0, -1, 0), (R(70), 0, 1, R(180)), (R(70), 1, 0, R(90)), (R(70), -1, 0, R(-90))):
    o = caixa((0, -x / 2, 0), (b, x, e), pap, chanfro=0.004)
    # aba presa na borda da base, levantada
    g = grupo([o], loc=(dx * b / 2, dy * b / 2, e), rot=(0, 0, 0))
    g.rotation_euler = (-ang if True else 0, 0, rz)
fita = plastico('#7f6a4a', 0.4)
# regua apoiada
im, d = tex('reg', 1000, 100, (0, 0, 0, 0))
for k in range(0, 51):
    xx = 10 + k * 19.6; L = 45 if k % 10 == 0 else (32 if k % 5 == 0 else 20); d.line((xx, 0, xx, L), fill=(25, 25, 25, 255), width=4)
mr = img_mat(salva(im, 'M04.5_reg'), rugos=0.3, alpha=True)
r1 = caixa((0, 0, 0), (1.5, 0.2, 0.025), plastico(AMAR, 0.25), chanfro=0.006); r2 = plano_img((0, 0, 0.0135), 1.48, 0.18, mr)
grupo([r1, r2], loc=(0.25, -1.0, 0.0125), rot=(0, 0, R(8)))
fim('M04.5', elev=40, azim=-24)

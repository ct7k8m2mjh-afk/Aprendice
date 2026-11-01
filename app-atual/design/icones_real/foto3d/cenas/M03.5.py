from _mat import *
cena()
# frasco-ampola com o remedio e a seringa graduada com a dose aspirada: dose e concentracao (mg/mL x mL)
vid = vidro(); liq = liquido('#2f8fd8'); branco = plastico('#f5f5f2', 0.35); borr = plastico('#2a2a2a', 0.45)
alu = metal('#c3c6cc', 0.22); inox = metal('#e6e6ea', 0.12); tinta = fosco('#1d1d1d', 0.6); emb = plastico(AZUL, 0.3)
# frasco
x0, y0 = -0.45, 0.35
copo((x0, y0, 0), 0.36, 0.78, vid, esp=0.03)
cilindro((x0, y0, 0.03 + 0.25), 0.325, 0.5, liq, chanfro=0.03)
cilindro((x0, y0, 0.86), 0.17, 0.16, vid, chanfro=0.02)
cilindro((x0, y0, 1.0), 0.2, 0.14, alu, chanfro=0.025)
cilindro((x0, y0, 1.08), 0.13, 0.04, plastico(VERM, 0.3), chanfro=0.012)
im, d = tex('rot', 600, 200, (250, 250, 250, 255))
d.rectangle((0, 0, 600, 40), fill=(31, 95, 214, 255)); d.text((300, 120), '10 mg/mL', font=fonte(FB, 70), fill=(30, 30, 30, 255), anchor='mm')
lab = img_mat(salva(im, 'M03.5_rot'), rugos=0.5)
o = plano_img((x0, y0 - 0.362, 0.42), 0.5, 0.17, lab, rot=(R(90), 0, 0))
# seringa deitada na diagonal, a frente
objs = []; L = 1.2; r = 0.15
objs.append(copo((0, 0, 0), r, L, vid, esp=0.014, fundo=False))
objs.append(cilindro((0, 0, 0.3), r - 0.018, 0.6, liq, chanfro=0.0))
objs.append(cilindro((0, 0, 0.64), r - 0.015, 0.08, borr, chanfro=0.012))
objs.append(cilindro((0, 0, 1.0), 0.045, 0.7, emb, chanfro=0.0))
objs.append(cilindro((0, 0, 1.36), 0.17, 0.04, emb, chanfro=0.012))
objs.append(caixa((0, 0, L), (0.5, 0.15, 0.04), branco, chanfro=0.015))
objs.append(cone((0, 0, -0.07), 0.035, r, 0.14, vid))
objs.append(cilindro((0, 0, -0.42), 0.012, 0.6, inox, chanfro=0))
for j in range(1, 11):
    w = 0.13 if j % 5 == 0 else 0.07
    objs.append(caixa((0, -r - 0.002, j * 0.1), (w, 0.004, 0.014), tinta, chanfro=0))
# deitada: eixo da seringa no plano do chao, apontando para a esquerda-frente
grupo(objs, loc=(0.35, -0.35, r + 0.02), rot=(R(-90), 0, R(55)))
fim('M03.5', elev=32, azim=-14)

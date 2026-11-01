from _mat import *
cena()
# medidor de pressao digital com braçadeira: 120/80 mmHg e pulso 72 (dados de saude)
corpo = plastico('#f4f5f7', 0.3)
im, d = tex('lcd', 500, 560, (196, 214, 200, 255))
d.text((470, 120), '120', font=fonte(FB, 150), fill=(20, 30, 25, 255), anchor='rm')
d.text((470, 300), '80', font=fonte(FB, 150), fill=(20, 30, 25, 255), anchor='rm')
d.text((470, 470), '72', font=fonte(FB, 100), fill=(20, 30, 25, 255), anchor='rm')
for t, y in (('SYS', 120), ('DIA', 300), ('♥', 470)): d.text((30, y), t, font=fonte(FB, 50), fill=(20, 30, 25, 255), anchor='lm')
mt = img_mat(salva(im, 'M14.5_lcd'), rugos=0.12, coat=0.6)
objs = [caixa((0, 0, 0), (1.0, 0.3, 1.3), corpo, chanfro=0.12), caixa((0, -0.15, 0.17), (0.66, 0.02, 0.76), plastico('#202020', 0.2), chanfro=0.02),
        plano_img((0, -0.162, 0.17), 0.6, 0.68, mt, rot=(R(90), 0, 0)),
        cilindro((0, -0.16, -0.42), 0.11, 0.04, plastico(AZUL, 0.3), rot=(R(90), 0, 0), chanfro=0.015)]
grupo(objs, loc=(-0.35, 0.1, 0.7), rot=(R(-12), 0, R(10)))
# bracadeira enrolada
pano = fosco('#24467e', 0.8)
o = copo((0.75, -0.35, 0.02), 0.33, 0.62, pano, esp=0.07, fundo=False)
toro((0.75, -0.35, 0.02 + 0.03), 0.33, 0.03, fosco('#1c375f', 0.8))
curva_tubo([(0.75 - 0.25, -0.5, 0.45), (0.35, -0.65, 0.35), (0.0, -0.45, 0.1), (-0.3, -0.25, 0.2), (-0.35, -0.05, 0.4)], 0.02, plastico('#2a2a2a', 0.35))
fim('M14.5', elev=18, azim=-14)

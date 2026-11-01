from _mat import *
cena()
# definicao de logaritmo: calculadora cientifica com o visor mostrando log 1000 = 3 (10^3 = 1000) e a tecla LOG em destaque.
# revisao 31/10 (2a rodada): a regua de calculo ficava confusa em tamanho pequeno; a calculadora e concreta e se le na hora.
W, H, E = 1.5, 2.3, 0.2
corpo = plastico('#2a2d34', 0.35)
objs = [caixa((0, 0, E / 2), (W, H, E), corpo, chanfro=0.07)]
# visor
im, d = tex('M06.3_lcd', 900, 420, (196, 212, 176, 255))
d.text((60, 105), 'log 1000', font=fonte(FB, 120), fill=(30, 40, 30, 255), anchor='lm')
d.text((850, 300), '3', font=fonte(FB, 230), fill=(30, 40, 30, 255), anchor='rm')
objs.append(caixa((0, H / 2 - 0.45, E + 0.005), (W - 0.2, 0.62, 0.02), plastico('#15171c', 0.3), chanfro=0.01))
objs.append(plano_img((0, H / 2 - 0.45, E + 0.016), W - 0.3, (W - 0.3) * 420 / 900, img_mat(salva(im, 'M06.3_lcd'), rugos=0.25, coat=0.6)))
# teclas 4 x 5; a tecla LOG (laranja) com rotulo
tc = plastico('#8a909c', 0.35); kw, kh = 0.26, 0.2
for i in range(4):
    for j in range(4):
        x = -0.48 + i * 0.32; y = H / 2 - 1.0 - j * 0.29
        if (i, j) == (0, 0): continue
        objs.append(caixa((x, y, E + 0.04), (kw, kh, 0.08), plastico('#d62828', 0.3) if (i, j) == (3, 3) else tc, chanfro=0.03))
xl, yl = -0.32, H / 2 - 1.0
objs.append(caixa((xl, yl, E + 0.05), (kw * 2 + 0.04, kh, 0.1), plastico('#f07c1e', 0.3), chanfro=0.035))
objs.append(decal('log', (xl, yl - 0.005, E + 0.102), 0.13, cor_txt=(255, 255, 255, 255), fonte_p=FB, nome='M063_log'))
for i in range(2, 4):
    pass
g = grupo(objs, rot=(0, 0, R(-12)))
# calco atras (a calculadora fica apoiada, inclinada)
fim('M06.3', elev=58, azim=-8)

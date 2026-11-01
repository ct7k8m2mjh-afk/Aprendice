from _mat import *
cena()
# cartas de baralho em leque (as, rei, dama, valete): probabilidade simples, ex. P(as) = 4/52
cartas = [('A', '♠', (25, 25, 25)), ('K', '♥', (214, 40, 40)), ('Q', '♦', (214, 40, 40)), ('J', '♣', (25, 25, 25))]
W, H = 500, 700
for k, (rk, st, c) in enumerate(cartas):
    im, d = tex('c%d' % k, W, H, (252, 252, 248, 255))
    d.rounded_rectangle((6, 6, W - 7, H - 7), 30, outline=(200, 200, 200, 255), width=4)
    f1 = fonte(FB, 92); f2 = fonte(FR, 80); f3 = fonte(FR, 330 if rk == 'A' else 250)
    d.text((60, 70), rk, font=f1, fill=c + (255,), anchor='mm'); d.text((60, 160), st, font=f2, fill=c + (255,), anchor='mm')
    d.text((W - 60, H - 70), rk, font=f1, fill=c + (255,), anchor='mm'); d.text((W - 60, H - 160), st, font=f2, fill=c + (255,), anchor='mm')
    if rk == 'A': d.text((W / 2, H / 2), st, font=f3, fill=c + (255,), anchor='mm')
    else:
        d.rounded_rectangle((110, 130, W - 110, H - 130), 20, fill=(240, 228, 200, 255), outline=c + (255,), width=6)
        d.text((W / 2, H / 2 - 60), rk, font=fonte(FS, 200), fill=c + (255,), anchor='mm'); d.text((W / 2, H / 2 + 120), st, font=fonte(FR, 120), fill=c + (255,), anchor='mm')
    mt = img_mat(salva(im, 'M13.4_%d' % k), rugos=0.3, coat=0.4)
    cw, ch = 1.0, 1.4
    o1 = caixa((0, ch / 2 - 0.2, 0), (cw, ch, 0.01), plastico('#f7f7f2', 0.3), chanfro=0.003)
    o2 = plano_img((0, ch / 2 - 0.2, 0.0055), cw - 0.01, ch - 0.01, mt)
    ang = R(30 - k * 20)
    grupo([o1, o2], loc=(0.0, -0.4, 0.02 + k * 0.015), rot=(0, 0, ang))
fim('M13.4', elev=55, azim=-6)

from _mat import *
cena()
# teste rapido com as linhas C (controle) e T (teste) e o conta-gotas ao lado: probabilidade condicional e teste diagnostico
W, H = 300, 1000
im, d = tex('cas', W, H, (246, 248, 250, 255))
d.rounded_rectangle((70, 180, 230, 580), 30, fill=(236, 232, 226, 255), outline=(150, 156, 165, 255), width=8)
d.rectangle((84, 300, 216, 322), fill=(205, 25, 55, 255)); d.rectangle((84, 440, 216, 462), fill=(205, 25, 55, 255))
f = fonte(FB, 60)
from PIL import Image as _I, ImageDraw as _D
def letra(t, cx, cy):  # letra girada 90 graus: fica de pe quando o cassete esta deitado de lado
    g = _I.new('RGBA', (90, 90), (0, 0, 0, 0)); _D.Draw(g).text((45, 45), t, font=f, fill=(50, 50, 60, 255), anchor='mm')
    g = g.rotate(90); im.alpha_composite(g, (int(cx - 45), int(cy - 45)))
letra('C', 38, 311); letra('T', 38, 451)
d.ellipse((85, 715, 215, 845), fill=(220, 216, 210, 255), outline=(150, 156, 165, 255), width=8)
letra('S', 38, 780)
mt = img_mat(salva(im, 'M13.5_cas'), rugos=0.35, coat=0.3)
objs = [caixa((0, 0, 0.07), (0.66, 2.0, 0.14), plastico('#3a7bd5', 0.3), chanfro=0.05),
        caixa((0, 0, 0.1), (0.56, 1.9, 0.1), plastico('#f6f7f9', 0.3), chanfro=0.03), plano_img((0, 0, 0.1505), 0.54, 1.86, mt)]
# revisao 31/10: pose mais natural -> cassete deitado quase de frente (C e T legiveis) e o conta-gotas em pe, pingando no poco S
ang = R(-62)
grupo(objs, loc=(0, 0, 0), rot=(0, 0, ang))
# poco S fica a (H/2 - 780) px do centro, ao longo do eixo do cassete
yS = (1000 / 2 - 780) / 1000 * 1.86
Sx, Sy = -yS * math.sin(ang) * -1, yS * math.cos(ang)
Sx, Sy = (0 * math.cos(ang) - yS * math.sin(ang)), (0 * math.sin(ang) + yS * math.cos(ang))
cg = [copo((0, 0, 0), 0.085, 0.85, vidro(), esp=0.012), cone((0, 0, -0.09), 0.022, 0.085, 0.18, vidro()),
      cilindro((0, 0, 0.16), 0.068, 0.28, liquido('#e9c84a'), chanfro=0.01), esfera((0, 0, 0.98), 0.15, plastico(VERM, 0.3))]
cg[-1].scale = (1, 1, 1.35)
grupo(cg, loc=(Sx, Sy, 0.62), rot=(0, R(-8), 0))
gota = esfera((Sx, Sy, 0.32), 0.05, liquido('#e9c84a')); gota.scale = (1, 1, 1.3)
fim('M13.5', elev=36, azim=-12)

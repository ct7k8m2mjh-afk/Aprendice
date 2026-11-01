from _mat import *
cena()
# a mesma foto em dois porta-retratos de madeira, um com o dobro das medidas (razao 2:1 entre lados correspondentes)
im, d = tex('foto', 400, 300, (126, 192, 238, 255))
d.ellipse((290, 30, 360, 100), fill=(255, 210, 60, 255))
d.polygon([(0, 300), (0, 190), (110, 120), (230, 210), (330, 150), (400, 200), (400, 300)], fill=(58, 160, 80, 255))
d.polygon([(0, 300), (0, 250), (150, 220), (400, 260), (400, 300)], fill=(40, 125, 60, 255))
d.rectangle((150, 175, 215, 235), fill=(244, 240, 230, 255)); d.polygon([(140, 178), (182, 140), (225, 178)], fill=(200, 50, 45, 255))
d.rectangle((172, 200, 192, 235), fill=(120, 75, 40, 255))
foto = img_mat(salva(im, 'M02.1'), rugos=0.2, coat=0.5)
def quadro(cx, cy, W, H, mold, inc=R(-10)):
    e = 0.12 * W; p = 0.05 * W + 0.02
    objs = [caixa((0, p * 0.3, 0), (W + 2 * e, p * 0.4, H + 2 * e), mold, chanfro=0.006)]
    for (x, z, w, h) in ((0, (H + e) / 2, W + 2 * e, e), (0, -(H + e) / 2, W + 2 * e, e), ((W + e) / 2, 0, e, H), (-(W + e) / 2, 0, e, H)):
        objs.append(caixa((x, 0, z), (w, p, h), mold, chanfro=0.025 * W))
    objs.append(plano_img((0, -0.002, 0), W, H, foto, rot=(R(90), 0, 0)))
    g = grupo(objs, loc=(cx, cy, (H / 2 + e) + 0.01), rot=(inc, 0, 0))
    caixa((cx, cy + 0.32 * H + 0.06, (H / 2 + e) * 0.8), (0.07 * W + 0.02, 0.03, (H + 2 * e) * 0.85), mold, chanfro=0.008, rot=(R(30), 0, 0))
quadro(-0.42, 0.3, 1.2, 0.9, madeira('#a8682f', escala=12))
quadro(0.78, -0.3, 0.6, 0.45, madeira('#e0b070', escala=16))
fim('M02.1', elev=16, azim=-16)

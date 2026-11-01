from _mat import *
cena()
# metro dobravel amarelo aberto em V reto (cada braco a 45 graus) deitado sobre uma prancheta azul com os eixos x e y:
# o grafico de y = |x|, com o vertice do V na origem. Revisao 31/10: o metro sozinho ficava fino e claro -> bracos mais largos
# e a prancheta azul quadriculada embaixo (contraste e contexto), camera mais alta.
PW, PH = 2.9, 2.2
NW, NH = 1160, 880; k = NW / PW
im, d = tex('M05.4_quadro', NW, NH, (31, 80, 190, 255))
oy = 0.4   # origem a 0,4 da borda de baixo
O = (NW // 2, NH - int(oy * k))
for i in range(-8, 9):
    x = O[0] + i * k * 0.25; d.line((x, 0, x, NH), fill=(70, 120, 220, 255), width=2)
for j in range(-3, 10):
    y = O[1] - j * k * 0.25; d.line((0, y, NW, y), fill=(70, 120, 220, 255), width=2)
d.line((0, O[1], NW, O[1]), fill=(255, 255, 255, 255), width=8); d.line((O[0], 0, O[0], NH), fill=(255, 255, 255, 255), width=8)
d.polygon([(NW, O[1]), (NW - 40, O[1] - 18), (NW - 40, O[1] + 18)], fill=(255, 255, 255, 255)); d.polygon([(O[0], 0), (O[0] - 18, 40), (O[0] + 18, 40)], fill=(255, 255, 255, 255))
d.text((NW - 35, O[1] + 50), 'x', font=fonte(FS, 70), fill=(255, 255, 255, 255), anchor='mm'); d.text((O[0] + 48, 42), 'y', font=fonte(FS, 70), fill=(255, 255, 255, 255), anchor='mm')
mq = img_mat(salva(im, 'M05.4_quadro'), rugos=0.45, coat=0.2)
caixa((0, 0, 0.06), (PW + 0.16, PH + 0.16, 0.12), plastico('#173c8c', 0.35), chanfro=0.04)
plano_img((0, 0, 0.1215), PW, PH, mq)
# metro
im, d = tex('metro', 1000, 100, (242, 190, 30, 255)); f = fonte(FB, 46)
for kk in range(0, 101):
    x = kk * 10; L = 48 if kk % 10 == 0 else (32 if kk % 5 == 0 else 18); d.line((x, 0, x, L), fill=(25, 25, 25, 255), width=3)
for kk in range(1, 10): d.text((kk * 100 - 4, 80), str(kk * 10), font=f, fill=(25, 25, 25, 255), anchor='rm')
mt = img_mat(salva(im, 'M05.4_metro'), rugos=0.35, coat=0.3)
am = plastico('#f2be1e', 0.32); lat = metal('#c9a227', 0.25)
seg = 0.62; w = 0.24; e = 0.05; z = 0.122 + e / 2
# braco no plano XY: comeca no vertice e sobe a 45 graus; a borda de dentro passa pela origem
def braco(s):
    objs = []
    for kk in range(3):
        x = s * (kk + 0.5) * seg
        objs.append(caixa((x, w / 2, 0), (seg - 0.012, w, e), am, chanfro=0.008))
        objs.append(plano_img((x, w / 2, e / 2 + 0.001), seg - 0.02, w - 0.012, mt))
        objs.append(cilindro((s * (kk + 1) * seg - s * 0.035, w / 2, e / 2 + 0.006), 0.03, 0.012, lat, chanfro=0.003))
    return grupo(objs, rot=(0, 0, R(45) * s))
Oy = -PH / 2 + oy
for s_ in (1, -1):
    g = braco(s_); g.location = (0, Oy - w * 0.7071 * 0 , z)
cilindro((0, Oy + 0.0, z + e / 2 + 0.008), 0.045, 0.016, lat, chanfro=0.004)
fim('M05.4', elev=54, azim=0)

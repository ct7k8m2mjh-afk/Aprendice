from _mat import *
cena()
# cartao com grafico de linha e uma lupa lendo um ponto (tracejados ate os eixos): leitura de graficos
# revisao 31/10: cartao azul-marinho com eixos brancos e linha amarela (o cartao branco deixava tudo pequeno e apagado); lupa maior
W = 900; im, d = tex('graf', W, W, (26, 56, 122, 255))
ox, oy, s = 110, 790, 680
for k in range(1, 9):
    d.line((ox + k * 85, oy, ox + k * 85, oy - s), fill=(62, 98, 170, 255), width=3); d.line((ox, oy - k * 85, ox + s, oy - k * 85), fill=(62, 98, 170, 255), width=3)
d.line((ox, oy, ox + s + 30, oy), fill=(255, 255, 255, 255), width=8); d.line((ox, oy, ox, oy - s - 30), fill=(255, 255, 255, 255), width=8)
pts = [(0, 1.2), (1, 2.6), (2, 2.2), (3, 4.0), (4, 5.1), (5, 4.4), (6, 6.2), (7, 7.0)]
P = [(ox + 85 * a, oy - 85 * b) for a, b in pts]
d.line(P, fill=(242, 183, 5, 255), width=16, joint='curve')
for p in P: d.ellipse((p[0] - 16, p[1] - 16, p[0] + 16, p[1] + 16), fill=(242, 183, 5, 255))
px, py = P[4]
for t in range(0, int(px - ox), 30): d.line((ox + t, py, ox + t + 16, py), fill=(255, 110, 110, 255), width=8)
for t in range(0, int(oy - py), 30): d.line((px, oy - t, px, oy - t - 16), fill=(255, 110, 110, 255), width=8)
d.ellipse((px - 24, py - 24, px + 24, py + 24), fill=(255, 80, 80, 255))
mt = img_mat(salva(im, 'M05.3_graf'), rugos=0.5)
caixa((0, 0, 0.04), (1.7, 1.7, 0.08), plastico('#0f2a66', 0.35), chanfro=0.03)
plano_img((0, 0, 0.0815), 1.56, 1.56, mt)
# lupa sobre o ponto (4; 5,1)
cx = -0.78 + 1.56 * px / W; cy = 0.78 - 1.56 * py / W
toro((cx, cy, 0.4), 0.36, 0.05, metal('#d5d9df', 0.18))
cilindro((cx, cy, 0.4), 0.35, 0.025, vidro(), chanfro=0.01)
bastao((cx + 0.36 * 0.7, cy - 0.36 * 0.7, 0.38), (cx + 1.0, cy - 0.95, 0.16), 0.075, plastico(VERM, 0.3))
fim('M05.3', elev=48, azim=-10)

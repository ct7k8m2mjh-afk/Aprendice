from _mat import *
cena()
# Teorema de Tales: tres retas paralelas cortadas por duas transversais, desenhadas a giz num quadro-negro de moldura de madeira;
# os segmentos correspondentes sao proporcionais. Revisao 31/10 (2a rodada): o caderno branco ficava apagado; quadro verde-escuro
# com giz branco/amarelo/rosa tem contraste e se le de longe.
W, H = 1000, 800
im, d = tex('M09.2_quadro', W, H, (38, 84, 60, 255))
import random; random.seed(2)
for k in range(260):   # poeira de giz
    x, y = random.randint(0, W), random.randint(0, H); d.point((x, y), fill=(70, 115, 90, 255))
ys = (200, 420, 690)
for y in ys: d.line((40, y, W - 40, y), fill=(245, 245, 240, 255), width=12)
P = (230, 60)
F = ((380, 780), (900, 780))
for fx, col in ((F[0], (255, 214, 64, 255)), (F[1], (255, 140, 170, 255))):
    d.line((P[0], P[1], fx[0], fx[1]), fill=col, width=14)
for y in ys:
    for fx in F:
        x = P[0] + (fx[0] - P[0]) * (y - P[1]) / (fx[1] - P[1]); d.ellipse((x - 16, y - 16, x + 16, y + 16), fill=(255, 255, 255, 255))
for t, y in (('r', ys[0]), ('s', ys[1]), ('t', ys[2])): d.text((W - 70, y - 40), t, font=fonte(FS, 70), fill=(245, 245, 240, 255), anchor='mm')
mq = img_mat(salva(im, 'M09.2_quadro'), rugos=0.8, coat=0)
BW, BH = 2.0, 1.6
mad = madeira('#a8703a', escala=10)
caixa((0, 0, 0.05), (BW + 0.24, BH + 0.24, 0.1), mad, chanfro=0.03)
caixa((0, 0, 0.09), (BW, BH, 0.04), fosco('#26543c', 0.8), chanfro=0.0)
plano_img((0, 0, 0.1105), BW, BH, mq)
# giz e apagador na moldura de baixo
caixa((0.55, -BH / 2 - 0.05, 0.16), (0.32, 0.07, 0.07), fosco('#fbfbf6', 0.8), chanfro=0.02, rot=(0, 0, R(8)))
caixa((-0.45, -BH / 2 - 0.04, 0.17), (0.5, 0.18, 0.1), madeira('#c9a06a', escala=20), chanfro=0.02)
caixa((-0.45, -BH / 2 - 0.04, 0.24), (0.48, 0.16, 0.05), fosco('#2b2f36', 0.9), chanfro=0.015)
fim('M09.2', elev=50, azim=-12)

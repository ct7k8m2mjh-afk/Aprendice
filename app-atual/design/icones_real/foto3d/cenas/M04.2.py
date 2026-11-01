from _mat import *
cena()
# quadro-negro com moldura de madeira, giz e apagador: a formula do 2.o grau (discriminante)
W, H = 1000, 640
im, d = tex('lousa', W, H, (38, 74, 58, 255))
import random; random.seed(2)
for k in range(2500):
    x, y = random.randrange(W), random.randrange(H); c = random.randrange(40, 70)
    d.point((x, y), fill=(c, c + 40, c + 22, 255))
f1 = fonte(FB, 118); f2 = fonte(FB, 92)
d.text((W / 2, 200), 'Δ = b² − 4ac', font=f1, fill=(245, 245, 238, 255), anchor='mm')
d.text((W / 2, 440), 'x = (−b ± √Δ) / 2a', font=f2, fill=(250, 220, 120, 255), anchor='mm')
mt = img_mat(salva(im, 'M04.2_lousa'), rugos=0.85, coat=0.0)
mold = madeira('#b5793f', escala=10)
objs = [caixa((0, 0, 0), (2.0, 0.06, 1.3), mold, chanfro=0.02)]
objs.append(plano_img((0, -0.031, 0), 1.84, 1.18, mt, rot=(R(90), 0, 0)))
objs.append(caixa((0, -0.08, -0.62), (1.9, 0.14, 0.04), mold, chanfro=0.01))
g = grupo(objs, loc=(0, 0.25, 0.68), rot=(R(-10), 0, 0))
gz = plastico('#f8f8f2', 0.7)
cilindro((-0.55, -0.13, 0.065), 0.025, 0.24, gz, rot=(0, R(90), R(10)), chanfro=0.008)
cilindro((-0.2, -0.33, 0.025), 0.025, 0.2, plastico(AMAR, 0.7), rot=(0, R(90), R(-30)), chanfro=0.008)
caixa((0.55, -0.32, 0.05), (0.4, 0.16, 0.06), madeira('#c79458'), chanfro=0.015, rot=(0, 0, R(-8)))
caixa((0.55, -0.32, 0.0), (0.4, 0.16, 0.04), fosco('#3a3a3a', 0.95), chanfro=0.01, rot=(0, 0, R(-8)))
fim('M04.2', elev=16, azim=-12)

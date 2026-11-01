from _mat import *
cena()
# osciloscopio mostrando dois periodos de y = sen x
W, H = 800, 600; im, d = tex('tela', W, H, (14, 32, 24, 255))
for k in range(1, 10): d.line((k * 80, 0, k * 80, H), fill=(40, 80, 60, 255), width=2)
for k in range(1, 8): d.line((0, k * 75, W, k * 75), fill=(40, 80, 60, 255), width=2)
d.line((0, 300, W, 300), fill=(70, 120, 90, 255), width=3); d.line((400, 0, 400, H), fill=(70, 120, 90, 255), width=3)
pts = [(x, 300 - 190 * math.sin(2 * math.pi * 2 * x / W)) for x in range(0, W + 1, 4)]
d.line(pts, fill=(120, 255, 150, 255), width=12, joint='curve'); d.line(pts, fill=(220, 255, 225, 255), width=4)
mt = img_mat(salva(im, 'M10.5_tela'), rugos=0.1, coat=0.8, emis=1.2)
corpo = plastico('#d8dbe0', 0.35); pr = plastico('#2a2a2a', 0.3)
caixa((0, 0, 0.55), (1.9, 1.1, 1.1), corpo, chanfro=0.06)
caixa((-0.3, -0.55, 0.6), (1.1, 0.04, 0.84), pr, chanfro=0.02)
plano_img((-0.3, -0.572, 0.6), 1.0, 0.75, mt, rot=(R(90), 0, 0))
for k, (x, z, c) in enumerate(((0.55, 0.85, VERM), (0.78, 0.85, AZUL), (0.55, 0.55, '#cccccc'), (0.78, 0.55, '#cccccc'))):
    cilindro((x, -0.58, z), 0.08, 0.08, plastico(c, 0.3), rot=(R(90), 0, 0), chanfro=0.02)
for x in (0.55, 0.78): cilindro((x, -0.57, 0.28), 0.05, 0.06, metal('#c9a227', 0.25), rot=(R(90), 0, 0), chanfro=0.01)
for x in (-0.8, 0.8): caixa((x, -0.2, 0.0), (0.1, 0.5, 0.1), pr, chanfro=0.02)
fim('M10.5', elev=16, azim=-20)

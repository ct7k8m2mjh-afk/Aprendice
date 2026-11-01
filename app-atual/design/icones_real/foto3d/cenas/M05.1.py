from _mat import *
cena()
# mola pendurada num suporte com um peso e a regua ao lado: a deformacao cresce em linha reta com a carga (y = kx, funcao afim)
aco = metal('#cfd2d8', 0.2); preto = plastico('#232323', 0.35); lat = metal('#d4a52a', 0.25)
caixa((0, 0, 0.04), (1.1, 0.7, 0.08), preto, chanfro=0.025)
cilindro((-0.38, 0.1, 1.0), 0.035, 1.9, aco, chanfro=0.006)
cilindro((-0.06, 0.1, 1.9), 0.03, 0.75, aco, rot=(0, R(90), 0), chanfro=0.006)
# mola helicoidal
pts = []; z0 = 1.86; voltas = 12; Lm = 0.62
for i in range(voltas * 24 + 1):
    t = i / 24.0; a = t * 2 * math.pi
    pts.append((0.2 + 0.08 * math.cos(a), 0.1 + 0.08 * math.sin(a), z0 - Lm * t / voltas))
curva_tubo(pts, 0.012, aco)
bastao((0.2, 0.1, z0 - Lm), (0.2, 0.1, z0 - Lm - 0.1), 0.012, aco)
cilindro((0.2, 0.1, z0 - Lm - 0.24), 0.15, 0.24, lat, chanfro=0.025)
cilindro((0.2, 0.1, z0 - Lm - 0.48), 0.15, 0.24, lat, chanfro=0.025)
# regua vertical
im, d = tex('reg', 120, 1000, (250, 250, 248, 255)); f = fonte(FB, 34)
for k in range(51):
    y = 30 + k * 18.8; L = 60 if k % 10 == 0 else (44 if k % 5 == 0 else 28); d.line((0, y, L, y), fill=(20, 20, 20, 255), width=4)
mt = img_mat(salva(im, 'M05.1_reg'), rugos=0.3)
caixa((0.45, 0.2, 0.98), (0.14, 0.03, 1.76), plastico('#f4f4f2', 0.3), chanfro=0.008)
plano_img((0.45, 0.184, 0.98), 0.13, 1.72, mt, rot=(R(90), 0, 0))
caixa((0.33, 0.1, z0 - Lm - 0.48 - 0.12), (0.22, 0.012, 0.012), plastico(VERM, 0.3), chanfro=0)
fim('M05.1', elev=18, azim=-24)

from _mat import *
cena()
# reta numerica de madeira de -1 a 4, bolinha cheia no 2 e a seta vermelha seguindo para a direita: x >= 2
# revisao 31/10 (2a rodada): bloco mais largo e alto, seta e bolinha maiores, na diagonal e visto mais de cima (antes fino e comprido)
im, d = tex('reta', 1200, 240, (240, 214, 160, 255))
f = fonte(FB, 84)
for k, n in enumerate(range(-1, 5)):
    x = 100 + k * 200; d.line((x, 0, x, 70), fill=(40, 30, 20, 255), width=8); d.text((x, 175), str(n).replace('-', '−'), font=f, fill=(40, 30, 20, 255), anchor='mm')
    if k < 5:
        for j in range(1, 4): d.line((x + j * 50, 0, x + j * 50, 35), fill=(40, 30, 20, 255), width=4)
mt = img_mat(salva(im, 'M04.4_reta'), rugos=0.45, coat=0.2)
objs = [caixa((0, 0, 0.15), (2.4, 0.62, 0.3), madeira('#d8ad6a'), chanfro=0.04),
        plano_img((0, -0.0, 0.3015), 2.34, 0.585, mt)]
x2 = -1.18 + (100 + 3 * 200) / 1200 * 2.36
vm = plastico(VERM, 0.22)
objs.append(esfera((x2, 0.17, 0.52), 0.22, vm))
objs.append(bastao((x2, 0.17, 0.52), (1.0, 0.17, 0.52), 0.095, vm))
objs.append(cone((1.18, 0.17, 0.52), 0.22, 0.0, 0.42, vm, rot=(0, R(90), 0)))
objs.append(bastao((x2, 0.17, 0.3), (x2, 0.17, 0.32), 0.03, fosco('#555555')))
objs.append(bastao((0.95, 0.17, 0.3), (0.95, 0.17, 0.45), 0.03, fosco('#555555')))
grupo(objs, rot=(0, 0, R(-38)))
fim('M04.4', elev=44, azim=-6)

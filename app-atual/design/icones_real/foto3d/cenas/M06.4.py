from _mat import *
cena()
# decibelimetro de mao marcando 80 dB: nivel sonoro = 10 log(I/I0)
corpo = plastico('#2c2f36', 0.3); amar = plastico(AMAR, 0.3)
objs = [caixa((0, 0, 0.75), (0.62, 0.22, 1.5), corpo, chanfro=0.08), caixa((0, 0, 0.75), (0.66, 0.2, 1.3), amar, chanfro=0.06)]
im, d = tex('lcd', 500, 300, (168, 200, 150, 255))
d.text((260, 160), '80', font=fonte(FB, 190), fill=(25, 35, 25, 255), anchor='mm')
d.text((440, 250), 'dB', font=fonte(FB, 60), fill=(25, 35, 25, 255), anchor='mm')
d.text((70, 40), 'MAX', font=fonte(FB, 34), fill=(25, 35, 25, 255), anchor='mm')
objs.append(caixa((0, -0.11, 1.1), (0.5, 0.02, 0.34), plastico('#141414', 0.2), chanfro=0.01))
objs.append(plano_img((0, -0.122, 1.1), 0.44, 0.27, img_mat(salva(im, 'M06.4_lcd'), rugos=0.15, coat=0.6), rot=(R(90), 0, 0)))
for k, c in enumerate(['#d62828', '#e6e6e6', '#e6e6e6']):
    objs.append(cilindro((-0.15 + k * 0.15, -0.115, 0.7), 0.05, 0.03, plastico(c, 0.3), rot=(R(90), 0, 0), chanfro=0.01))
objs.append(cilindro((0, 0, 1.58), 0.07, 0.25, metal('#bfc3c9', 0.25)))
sp = esfera((0, 0, 1.82), 0.2, fosco('#5a5d63', 0.95))
tx = bpy.data.textures.new('n', 'CLOUDS'); tx.noise_scale = 0.03
dm = sp.modifiers.new('d', 'DISPLACE'); dm.texture = tx; dm.strength = 0.012
objs.append(sp)
grupo(objs, rot=(R(-8), 0, R(18)))
fim('M06.4', elev=18, azim=-10)

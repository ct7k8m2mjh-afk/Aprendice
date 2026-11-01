from _mat import *
cena()
# balanca de cozinha de ponteiro com 3 macas no prato (0,5 kg): massa x preco, regra de tres
corpo = plastico('#1f5fd6', 0.3); inox = metal('#d8d8dc', 0.18); branco = plastico('#f7f7f5', 0.35)
caixa((0, 0, 0.42), (1.0, 0.8, 0.84), corpo, chanfro=0.12)
# mostrador
cilindro((0, -0.41, 0.46), 0.33, 0.05, inox, rot=(R(90), 0, 0), chanfro=0.015)
im, d = tex('dial', 600, 600, (0, 0, 0, 0)); c = 300
d.ellipse((10, 10, 590, 590), fill=(250, 250, 246, 255))
ft = fonte(FB, 52)
for k in range(50):
    a = math.radians(-90 + k * 7.2); r1 = 270; r2 = 235 if k % 10 == 0 else (250 if k % 5 == 0 else 258)
    d.line((c + r1 * math.cos(a), c + r1 * math.sin(a), c + r2 * math.cos(a), c + r2 * math.sin(a)), fill=(30, 30, 30, 255), width=7 if k % 10 == 0 else 4)
for n in range(5):
    a = math.radians(-90 + n * 72); x, y = c + 185 * math.cos(a), c + 185 * math.sin(a)
    d.text((x, y), str(n), font=ft, fill=(30, 30, 30, 255), anchor='mm')
d.text((c, c + 95), 'kg', font=fonte(FB, 40), fill=(90, 90, 90, 255), anchor='mm')
a = math.radians(-90 + 0.5 * 72)  # ponteiro em 0,5 kg
d.line((c, c, c + 245 * math.cos(a), c + 245 * math.sin(a)), fill=(214, 40, 40, 255), width=10)
d.ellipse((c - 22, c - 22, c + 22, c + 22), fill=(214, 40, 40, 255))
decm = img_mat(salva(im, 'M02.2_dial'), rugos=0.2, coat=0.6, alpha=True)
plano_img((0, -0.437, 0.46), 0.6, 0.6, decm, rot=(R(90), 0, 0))
# vidro do mostrador
cilindro((0, -0.445, 0.46), 0.3, 0.01, vidro(), rot=(R(90), 0, 0), chanfro=0.004)
# prato
cilindro((0, 0, 0.88), 0.08, 0.1, inox)
copo((0, 0, 0.92), 0.36, 0.13, inox, esp=0.02, r_topo=0.55)
mac = plastico('#c81e1e', 0.25); cab = fosco('#5b3a1e', 0.7); fol = plastico('#3f9e3a', 0.4)
for (x, y, s) in ((-0.17, 0.05, 1.0), (0.18, 0.09, 0.95), (0.0, -0.17, 1.02)):
    o = esfera((x, y, 1.1 + 0.02), 0.2 * s, mac); o.scale = (1, 1, 0.9)
    bastao((x, y, 1.1 + 0.18 * s), (x + 0.02, y, 1.1 + 0.27 * s), 0.014, cab)
    f = esfera((x + 0.07, y, 1.1 + 0.25 * s), 0.05, fol); f.scale = (1.4, 0.6, 0.25); f.rotation_euler = (0, R(-25), 0)
fim('M02.2', elev=24, azim=-16)

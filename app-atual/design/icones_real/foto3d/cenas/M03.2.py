from _mat import *
cena()
# duas etiquetas de preco: -10% e -20% (descontos sucessivos: fator 0,9 x 0,8 = 0,72)
fio = fosco('#8a6a45', 0.8)
def etiqueta(loc, rz, c, txt, nome):
    pts = [(-0.5, -0.32), (0.32, -0.32), (0.56, 0), (0.32, 0.32), (-0.5, 0.32)]
    objs = [prisma(pts, 0, 0.025, plastico(c, 0.35), chanfro=0.008)]
    objs.append(cilindro((0.36, 0, 0.026), 0.055, 0.004, fosco('#ffffff', 0.4), chanfro=0))
    objs.append(toro((0.36, 0, 0.03), 0.06, 0.012, metal('#d4a52a', 0.25)))
    objs.append(decal(txt, (-0.12, 0, 0.0275), 0.21, nome=nome))
    g = grupo(objs, loc=loc, rot=(0, 0, rz)); return g
etiqueta((-0.3, 0.3, 0.0), R(18), AMAR, '−10%', 'M03.2a')
etiqueta((0.15, -0.25, 0.03), R(-8), VERM, '−20%', 'M03.2b')
fim('M03.2', elev=52, azim=-12)

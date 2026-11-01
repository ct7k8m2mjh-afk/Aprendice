# P05 Semantica e vocabulario: dicionario grosso de pe, capa vinho com "Aa" e titulo dourados
from _por import *
cena_p()
ouro = metal('#d4a52a', 0.25)
w, h, e = 1.05, 1.45, 0.62
capa = plastico('#7d1424', 0.4)
ob = [livro_fechado((0, 0, 0), w, h, e, capa)]
ob.append(txt('Aa', (0.04, 0.12, e + 0.005), 0.42, ouro, extr=0.012, fonte=SERIF))
ob.append(txt('DICIONÁRIO', (0.04, -0.3, e + 0.005), 0.115, ouro, extr=0.008, fonte=SERIF))
for y in (0.55, -0.55): ob.append(caixa((0.04, y, e + 0.004), (0.8, 0.02, 0.006), ouro, chanfro=0))
for y in (0.5, 0.35, -0.35, -0.5): ob.append(caixa((-w / 2 - 0.12, y, e / 2), (0.02, 0.025, e * 0.9), ouro, chanfro=0))
g = grupo(ob, rot=(math.radians(-90), 0, 0))
g2 = grupo([g], rot=(0, 0, math.radians(-30)))
no_chao(g2)
render(saida('P05'), elev=20, azim=-12)

# B10.5 profilaxia/imunizacao: frasco de vacina com tampa e seringa
import sys; sys.path[:0] = ['/home/claude/escadas-sc/design/icones_real/foto3d', '/home/claude/escadas-sc/design/icones_real/foto3d/cenas']
from _bk import *
cena()
import random
FN = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
vid = vidro('#f4f9ff'); liq = liquido('#e9f2ff'); tam = plastico('#1f5fd6', .3); alu = metal('#c7ccd3', .25); etq = plastico('#ffffff', .4)
cilindro((-.6, 0, .6), .38, 1.2, vid, chanfro=.06); cilindro((-.6, 0, .5), .34, .9, liq, chanfro=.03)
cilindro((-.6, 0, 1.3), .2, .2, vid, chanfro=.02); cilindro((-.6, 0, 1.45), .26, .2, alu, chanfro=.03); cilindro((-.6, 0, 1.57), .22, .07, tam, chanfro=.02)
e = cilindro((-.6, 0, .6), .385, .5, etq, chanfro=0)
caixa((-.6, -.37, .62), (.3, .02, .18), plastico('#1f5fd6', .3), chanfro=.005)
# seringa deitada
rot = (0, math.radians(90), math.radians(-25))
s = cilindro((.65, -.2, .2), .16, 1.3, vid, rot=rot, chanfro=.01)
d = V((math.cos(math.radians(-25)), math.sin(math.radians(-25)), 0))
c0 = V((.65, -.2, .2))
cilindro(tuple(c0 - d * .05), .14, .9, liquido('#bcd8ff'), rot=rot, chanfro=0)
bastao(tuple(c0 - d * .65), tuple(c0 - d * 1.15), .05, plastico('#f2f2f2', .4))
cilindro(tuple(c0 - d * 1.17), .2, .04, plastico('#f2f2f2', .4), rot=rot)
cilindro(tuple(c0 - d * .62), .17, .06, plastico('#2a2d33', .4), rot=rot)
cone(tuple(c0 + d * .72), .08, .05, .12, plastico('#f2f2f2', .4), rot=rot)
bastao(tuple(c0 + d * .78), tuple(c0 + d * 1.3), .012, metal('#dfe3e8', .15))
for k in range(5): bastao(tuple(c0 + d * (-.4 + k * .2) + V((0, 0, .155))), tuple(c0 + d * (-.4 + k * .2) + V((-.03, -.05, .14))), .006, plastico('#2a2d33', .4))
sai('B10.5', elev=24)

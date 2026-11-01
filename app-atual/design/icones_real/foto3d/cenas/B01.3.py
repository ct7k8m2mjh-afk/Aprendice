# B01.3 envoltorios: celula vegetal em corte (parede celular espessa, membrana, vacuolo central, cloroplastos, nucleo deslocado)
import sys; sys.path[:0] = ['/home/claude/escadas-sc/design/icones_real/foto3d', '/home/claude/escadas-sc/design/icones_real/foto3d/cenas']
from _bio2 import *
pele = pele_org; plastico = plast_org
cena()
import random
parede = pele('#6fa83a', .15, .45, (.5, 1, .3)); memb = plastico('#b5e07a', .35); cito = pele('#d9f2b0', .2, .3)
vac = translucido('#a9d8ff', .35, .05); nuc = plastico('#8e3fd1', .3); nuo = plastico('#4a148c', .3); clo = plastico('#2c7a2c', .35); gra = plastico('#1b5e20', .35)
W, D, Hh = 2.6, 1.8, .9
ext = caixa((0, 0, Hh / 2), (W, D, Hh), parede, chanfro=.16); aplica_mods(ext)
inn = caixa((0, 0, Hh / 2 + .1), (W - .2, D - .2, Hh), None, chanfro=.1); aplica_mods(inn); dif(ext, inn)
m = caixa((0, 0, Hh / 2 + .02), (W - .2, D - .2, Hh - .08), memb, chanfro=.1); aplica_mods(m)
inn = caixa((0, 0, Hh / 2 + .1), (W - .28, D - .28, Hh), None, chanfro=.1); aplica_mods(inn); dif(m, inn)
c = caixa((0, 0, .42), (W - .3, D - .3, .64), cito, chanfro=.1)
v = esfera((.25, .05, .62), .5, vac); escala(v, (2.0, 1.25, .32))
n = esfera((-.95, -.4, .78), .28, nuc); escala(n, (1, 1, .55)); esfera((-.92, -.42, .86), .1, nuo, seg=32)
pos = [(-1.0, .5), (-.5, .62), (.1, .66), (.7, .62), (1.1, .25), (1.1, -.25), (.75, -.62), (.15, -.65), (-.45, -.65)]
for (x, y) in pos:
    o = esfera((x, y, .76), .14, clo, seg=32); escala(o, (1.5, .85, .45)); o.rotation_euler.z = math.atan2(y, x) + 1.57
    for k in (-1, 0, 1):
        g = cilindro((x + k * .1 * math.cos(math.atan2(y, x) + 1.57), y + k * .1 * math.sin(math.atan2(y, x) + 1.57), .81), .045, .04, gra, chanfro=.01)
for (x, y) in ((-.3, -.25), (.95, .0), (-.6, .25)):
    o = esfera((x, y, .76), .09, plastico('#e0743a', .3), seg=32); escala(o, (1.6, .8, .5))
sai('B01.3', elev=48, azim=-22)

# B06.1 1a lei de Mendel: quadro de Punnett Aa x Aa em pecas 3D (AA, Aa, Aa, aa = 1:2:1; 3 amarelas : 1 verde)
import sys; sys.path[:0] = ['/home/claude/escadas-sc/design/icones_real/foto3d', '/home/claude/escadas-sc/design/icones_real/foto3d/cenas']
from _bk import *
cena()
import random
FN = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
base = plastico('#2b5fb8', .3); am = plastico('#f2b705', .3); vd = plastico('#3aa13a', .3); esc = plastico('#2b2f36', .35)
caixa((-.1, .1, .06), (2.4, 2.4, .12), base, chanfro=.06)
cel = {(0, 0): 'AA', (1, 0): 'Aa', (0, 1): 'Aa', (1, 1): 'aa'}
for (i, j), g in cel.items():
    x = -.25 + i * 1.0; y = .25 - j * 1.0
    caixa((x, y, .2), (.9, .9, .16), plastico('#eef1f6', .45), chanfro=.06)
    esfera((x, y + .12, .42), .2, vd if g == 'aa' else am, seg=48)
    texto(g, (x, y - .25, .29), .3, esc, rot=(0, 0, 0), extr=.02, fonte=FN)
for k, t in enumerate(('A', 'a')):
    texto(t, (-.25 + k, .92, .14), .38, plastico('#ffffff', .3), rot=(0, 0, 0), extr=.03, fonte=FN)
    texto(t, (-.92, .25 - k, .14), .38, plastico('#ffffff', .3), rot=(0, 0, 0), extr=.03, fonte=FN)
sai('B06.1', elev=50, azim=0)

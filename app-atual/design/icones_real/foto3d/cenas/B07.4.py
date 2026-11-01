# B07.4 coracao e circulacoes: estetoscopio (auscultar o coracao e as bulhas das valvas)
import sys; sys.path[:0] = ['/home/claude/escadas-sc/design/icones_real/foto3d', '/home/claude/escadas-sc/design/icones_real/foto3d/cenas']
from _bk import *
cena()
import random
FN = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
tb = plastico('#1f5fd6', .35); me = metal('#d4d8de', .15)
# peca toracica (diafragma) apoiada
cilindro((.9, -.6, .15), .42, .26, me, chanfro=.05)
cilindro((.9, -.6, .29), .38, .03, plastico('#2a2d33', .3))
cilindro((.9, -.6, .02), .44, .05, plastico('#2a2d33', .3))
bastao((.9, -.6, .3), (.55, -.2, .6), .06, me)
# tubo em curva ate a bifurcacao
tubo([(.55, -.2, .6), (.1, .3, .6), (-.6, .2, .4), (-1.0, -.4, .35), (-.6, -.9, .5), (0, -.5, .9), (.05, .1, 1.35)], .08, tb)
# Y e olivas
for s in (-1, 1):
    tubo([(.05, .1, 1.35), (.05 + s * .35, .15, 1.9), (.05 + s * .45, .1, 2.5)], .06, tb)
    bastao((.05 + s * .45, .1, 2.5), (.05 + s * .35, -.15, 2.9), .035, me)
    esfera((.05 + s * .35, -.18, 2.93), .08, plastico('#2a2d33', .3), seg=32)
sai('B07.4', elev=26, azim=-15)

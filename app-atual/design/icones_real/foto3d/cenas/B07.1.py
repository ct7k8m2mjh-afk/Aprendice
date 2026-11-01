# B07.1 tecidos (histologia): microscopio optico com lamina no carro (estudo dos tecidos ao microscopio)
import sys; sys.path[:0] = ['/home/claude/escadas-sc/design/icones_real/foto3d', '/home/claude/escadas-sc/design/icones_real/foto3d/cenas']
from _bk import *
cena()
import random
FN = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
br = plastico('#eef0f2', .3); pr = plastico('#26292e', .35); cr = metal('#d6dae0', .18)
caixa((0, .1, .12), (1.4, 1.8, .24), br, chanfro=.08)
# braco curvo
tubo([(0, .75, .2), (0, .9, .9), (0, .75, 1.6), (0, .35, 2.05)], .2, br, raios=[1.2, 1.1, 1, .9])
# platina com lamina
caixa((0, -.15, 1.0), (1.1, .9, .07), pr, chanfro=.02)
caixa((0, -.2, 1.05), (.75, .25, .02), vidro('#f4f9ff'), chanfro=.004)
caixa((0, -.2, 1.065), (.18, .14, .01), plastico('#d85c9a', .4), chanfro=.003)
for x in (-.35, .35): bastao((x, .05, 1.07), (x, -.3, 1.07), .025, cr)
cilindro((0, -.15, .8), .16, .3, pr)  # condensador
# cabeca e tubo inclinado
c = cilindro((0, .2, 2.0), .26, .35, br); t = cilindro((0, .45, 2.35), .11, .7, pr, rot=(math.radians(-35), 0, 0)); cilindro((0, .68, 2.68), .13, .12, pr, rot=(math.radians(-35), 0, 0))
# revolver com objetivas
cilindro((0, -.05, 1.75), .24, .12, cr)
for k, a in enumerate((-30, 0, 30)):
    cilindro((.16 * math.sin(math.radians(a)), -.12, 1.52), .055, .3, cr if k != 1 else metal('#c9a227', .2), rot=(math.radians(12), math.radians(a * .5), 0))
# parafuso macro
cilindro((.32, .78, .9), .18, .1, pr, rot=(0, math.pi / 2, 0)); cilindro((-.32, .78, .9), .18, .1, pr, rot=(0, math.pi / 2, 0))
sai('B07.1', elev=18, azim=-35)

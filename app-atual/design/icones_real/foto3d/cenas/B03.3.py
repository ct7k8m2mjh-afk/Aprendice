# B03.3 papel do oxigenio: cilindro de oxigenio medicinal (verde, padrao brasileiro) com valvula
import sys; sys.path[:0] = ['/home/claude/escadas-sc/design/icones_real/foto3d', '/home/claude/escadas-sc/design/icones_real/foto3d/cenas']
from _bk import *
cena()
import random
corpo = plastico('#1f7d3c', .3); lat = metal('#c9a227', .22); cro = metal('#d0d4da', .18)
c = cilindro((0, 0, 1.1), .5, 2.2, corpo, chanfro=0)
d = esfera((0, 0, 2.2), .5, corpo); escala(d, (1, 1, .55))
cilindro((0, 0, 2.55), .14, .3, lat, chanfro=.02)
caixa((0, 0, 2.82), (.36, .3, .32), lat, chanfro=.04)
cilindro((.28, 0, 2.82), .07, .25, lat, rot=(0, math.pi / 2, 0))
cilindro((0, 0, 3.05), .2, .07, cro, chanfro=.02); cilindro((0, 0, 3.0), .05, .15, cro)
toro((0, 0, .02), .5, .025, plastico('#14532a', .4))
t = texto('O₂', (0, -.52, 1.25), .5, plastico('#ffffff', .35), extr=.02, fonte='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf')
sai('B03.3', elev=22, azim=-15)

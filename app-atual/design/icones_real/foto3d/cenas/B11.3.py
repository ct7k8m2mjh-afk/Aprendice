# B11.3 deriva genetica/efeito gargalo: garrafa com contas de 5 cores; as poucas que passaram pelo gargalo sao de so 2 cores
import sys; sys.path[:0] = ['/home/claude/escadas-sc/design/icones_real/foto3d', '/home/claude/escadas-sc/design/icones_real/foto3d/cenas']
from _bk import *
cena()
import random
FN = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
vid = vidro('#f2f8ff')
cores = ['#d62828', '#1f5fd6', '#f2b705', '#2e9e44', '#7b2cbf']
# garrafa deitada (eixo x), gargalo para a direita
b = cilindro((0, 0, .62), .6, 1.6, vid, rot=(0, math.pi / 2, 0), chanfro=.15)
i = cilindro((0, 0, .62), .54, 1.5, None, rot=(0, math.pi / 2, 0), chanfro=.1); dif(b, i)
n = cone((1.05, 0, .62), .55, .2, .5, vid, rot=(0, math.pi / 2, 0)); cilindro((1.45, 0, .62), .2, .4, vid, rot=(0, math.pi / 2, 0), chanfro=.02)
toro((1.66, 0, .62), .2, .035, vid).rotation_euler = (0, math.pi / 2, 0)
random.seed(4)
for k in range(46):
    x = random.uniform(-.65, .65); y = random.uniform(-.38, .38); z = .2 + abs(random.gauss(0, .14)) + (.0 if abs(y) < .3 else .1)
    esfera((x, y, z), .1, plastico(cores[k % 5], .25), seg=24)
for (x, y, c) in ((2.0, -.1, 0), (2.25, .15, 1), (2.4, -.25, 0), (2.1, .35, 0)):
    esfera((x, y, .1), .1, plastico(cores[c], .25), seg=32)
sai('B11.3', elev=30)

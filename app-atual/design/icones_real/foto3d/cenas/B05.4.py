# B05.4 mutacao pontual: hemacia normal (disco bicôncavo) e hemacia falciforme (anemia falciforme, troca de 1 base)
import sys; sys.path[:0] = ['/home/claude/escadas-sc/design/icones_real/foto3d', '/home/claude/escadas-sc/design/icones_real/foto3d/cenas']
from _bio2 import *
pele = pele_org; plastico = plast_org
cena()
import random
hm = org('#c0262b', '#d63a36', cav='#4a0507', sss=.35, rugos=.28, coat=.55, bump=.05, esc=3, ao=.2)
hemacia((-.75, 0, .7), .62, hm, rot=(math.radians(30), math.radians(-10), math.radians(12)))
# falciforme: crescente afilado
pts = [(1.0 + .75 * math.cos(math.radians(a)), .0, .55 + .75 * math.sin(math.radians(a))) for a in range(200, 341, 10)]
pts = [(x, y + .1, z + .45) for (x, y, z) in pts]
r = [math.sin(math.radians(i / (len(pts) - 1) * 180)) ** .7 + .05 for i in range(len(pts))]
s = tubo(pts, .26, hm, raios=r, tipo='NURBS'); s.scale = (1, .55, 1)
sai('B05.4', elev=24)

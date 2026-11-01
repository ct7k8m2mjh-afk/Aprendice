# B05.1 replicacao semiconservativa: forquilha de replicacao; cada dupla-helice filha tem 1 fita antiga (azul) e 1 nova (laranja); helicase na forquilha
import sys; sys.path[:0] = ['/home/claude/escadas-sc/design/icones_real/foto3d', '/home/claude/escadas-sc/design/icones_real/foto3d/cenas']
from _bk import *
cena()
import random
from _dna import duplex
velha = plastico('#2f6fdc', .28); nova = plastico('#f28c1a', .28)
duplex((-2.2, 0, 1), (-.25, 0, 1), velha, velha, voltas=1.6, seed=1)
duplex((.25, 0, 1.15), (2.0, 0, 2.0), velha, nova, voltas=1.4, seed=2, fase=.5)
duplex((.25, 0, .85), (2.0, 0, 0.0), velha, nova, voltas=1.4, seed=3, fase=1.2)
t = toro((0, 0, 1), .38, .14, plastico('#7b2cbf', .3)); t.rotation_euler = (0, math.pi / 2, 0)
sai('B05.1', elev=18, azim=-12)

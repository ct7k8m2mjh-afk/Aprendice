# B12.4 estomatos: epiderme foliar (celulas em quebra-cabeca) com um estomato: duas celulas-guarda reniformes, cheias de
# cloroplastos, em volta do ostiolo (poro) aberto. Revisao 31/10 (segunda lente).
import sys; sys.path[:0] = ['/home/claude/escadas-sc/design/icones_real/foto3d', '/home/claude/escadas-sc/design/icones_real/foto3d/cenas']
from _bio2 import *
cena(); random.seed(3)
epi = org('#d8ecb8', '#c4e0a0', cav='#4a6a2a', sss=.4, rugos=.3, coat=.55, bump=.15, esc=4, ao=.1)
gua = org('#4caa3a', '#62bc48', cav='#123a08', sss=.4, rugos=.28, coat=.6, bump=.15, esc=5, ao=.08)
clo = org('#1f7a2b', '#2a8a34', cav='#062a0a', sss=.3, rugos=.3, coat=.5, bump=.2, esc=8)
poro = org('#1a2a14', '#22341a', cav='#000000', sss=0, rugos=.6, coat=0, bump=0)
# placa da epiderme com sulcos de voronoi sinuosos (paredes das celulas em quebra-cabeca)
p = caixa((0, 0, .2), (3.2, 2.4, .4), epi, chanfro=.12)
gn_sulcos(p, .07, 1.6, .06, warp=.35, warp_esc=2.5, tipo='voronoi', sub=5)
# depressao central para o estomato
# celulas-guarda: dois feijoes (meio-toros) em volta do ostiolo
for s in (-1, 1):
    pts = [(s * .04 + s * .42 * math.sin(math.radians(a)), .75 * math.cos(math.radians(a)), .46) for a in range(0, 181, 15)]
    g = tubo(pts, .2, gua, raios=[.75 + .25 * math.sin(math.radians(a)) for a in range(0, 181, 15)], tipo='NURBS'); g.data.bevel_resolution = 8
    for k in range(7):
        a = math.radians(15 + k * 25); esfera((s * .04 + s * .45 * math.sin(a) + s * random.uniform(-.02, .05), .75 * math.cos(a), .62), .06, clo, seg=16)
o = esfera((0, 0, .42), 1, poro, seg=48); escala(o, (.13, .5, .06))
chao_auto()
sai('B12.4', elev=40, azim=-12)

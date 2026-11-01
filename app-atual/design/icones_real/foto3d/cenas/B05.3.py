# B05.3 traducao: ribossomo (subunidade maior e menor, superficie globular) lendo o RNAm; RNAt em L trazendo um aminoacido; a
# cadeia polipeptidica saindo pelo tunel da subunidade maior. Revisao 31/10 (2a rodada).
import sys; sys.path[:0] = ['/home/claude/escadas-sc/design/icones_real/foto3d', '/home/claude/escadas-sc/design/icones_real/foto3d/cenas']
from _bio2 import *
cena(); random.seed(5)
mai = org('#5a54d6', '#6e5ee2', cav='#140e50', sss=.3, rugos=.3, coat=.55, bump=.3, esc=6, ao=.12)
men = org('#8ec2ef', '#a6d0f4', cav='#1a4a7a', sss=.3, rugos=.3, coat=.55, bump=.3, esc=6, ao=.12)
mrn = org('#f28c1a', '#f5a030', cav='#5a2a00', sss=.3, rugos=.3, coat=.55, bump=0)
trn = org('#2e9e44', '#44b058', cav='#0a3010', sss=.3, rugos=.3, coat=.55, bump=.2, esc=6)
aas = [org(h, h, cav='#202020', sss=.3, rugos=.3, coat=.55, bump=.2, esc=6) for h in ('#d62828', '#f2b705', '#7b2cbf', '#1f9fd6', '#e05a9a', '#2e9e44')]
L = blob([('ELLIPSOID', (0, 0, 1.25), .95, (1.25, 1.0, .75)), ('BALL', (-.6, .1, 1.5), .55), ('BALL', (.65, .05, 1.55), .5), ('BALL', (.1, .3, 1.75), .55)], mai, res=.02, thr=.6)
gn_sulcos(L, .03, 3.0, .1, warp=.3, warp_esc=2, tipo='ruga', sub=2)
S = blob([('ELLIPSOID', (0, 0, .5), .8, (1.25, .85, .5)), ('BALL', (-.55, -.05, .5), .4), ('BALL', (.5, .05, .55), .38)], men, res=.02, thr=.6)
gn_sulcos(S, .025, 3.5, .1, warp=.3, warp_esc=2, tipo='ruga', sub=2)
# RNAm passando entre as subunidades, com bases (tracos coloridos)
pts = [(-1.7, -.25, .78), (-1.0, -.35, .8), (0, -.4, .82), (1.0, -.35, .8), (1.7, -.2, .75)]
tubo(pts, .06, mrn, tipo='NURBS')
for k in range(21):
    x = -1.6 + k * .16; z = .8 - .01 * x * x
    bastao((x, -.38, z), (x, -.38, z + .17), .028, aas[k % 4])
# RNAt em L no sitio, com anticodon no RNAm e aminoacido no topo
tubo([(.25, -.55, .95), (.3, -.62, 1.45), (.32, -.65, 1.95)], .085, trn)
tubo([(.32, -.65, 1.95), (.7, -.6, 2.05)], .085, trn)
esfera((.78, -.6, 2.1), .13, aas[0], seg=32)
# cadeia polipeptidica saindo pelo topo
p = V((.0, .25, 1.75))
for k in range(6):
    q = p + V((-.16 + .12 * math.sin(k * 1.3), .02, .17)); esfera(tuple(q), .12, aas[(k + 1) % 6], seg=24); p = q
chao_auto()
sai('B05.3', elev=18, azim=-14)

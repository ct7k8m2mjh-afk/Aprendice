# B09.2 fluxo de energia / piramide ecologica: piramide de 3 niveis troficos em degraus de terra: produtores (capim) na base
# larga, consumidores primarios (lagartas) no meio e um consumidor secundario (ave) no topo; cada nivel recebe so cerca de
# 10% da energia do anterior, por isso e menor. Revisao 31/10 (2a rodada).
import sys; sys.path[:0] = ['/home/claude/escadas-sc/design/icones_real/foto3d', '/home/claude/escadas-sc/design/icones_real/foto3d/cenas']
from _bio2 import *
cena(); random.seed(4)
ter = org('#8a5a34', '#6e4426', cav='#24120a', sss=0, rugos=.85, coat=0, bump=.9, esc=6, ao=.12)
gra = org('#5aa83a', '#7cc04a', cav='#1a4a10', sss=.3, rugos=.5, coat=.2, bump=.8, esc=10, ao=.06, bump_esc=50)
cap = org('#6cbc3e', '#8cd052', cav='#1a4a10', sss=.3, rugos=.4, coat=.3, bump=.1)
lag = org('#8cc63e', '#a0d450', cav='#2a4a08', sss=.4, rugos=.3, coat=.55, bump=.1, esc=6)
fx = plastico('#15140f', .3)
pena = org('#7a5a3a', '#5a4028', cav='#1a100a', sss=.05, rugos=.7, coat=.05, bump=.5, esc=9, bump_esc=60, mix=.9)
bic = org('#e8a02a', '#f0b040', cav='#6a4000', sss=.2, rugos=.3, coat=.4, bump=0)
niv = [(3.2, 2.2, 0.0), (2.2, 1.5, .45), (1.25, .9, .9)]
for (w, d, z) in niv:
    c = caixa((0, 0, z + .225), (w, d, .45), ter, chanfro=.06); desloca(c, .025, .3, sub=2)
    g = caixa((0, 0, z + .46), (w - .02, d - .02, .06), gra, chanfro=.03)
# produtores: capim no anel exposto da base
for k in range(170):
    x = random.uniform(-1.55, 1.55); y = random.uniform(-1.05, 1.05)
    if abs(x) < 1.12 and abs(y) < .78: continue
    tubo([(x, y, .48), (x + random.uniform(-.05, .05), y, .68), (x + random.uniform(-.1, .1), y + random.uniform(-.05, .05), .82)], .02, cap, raios=[1, .6, .1])
# consumidores primarios: 3 lagartas no 2o nivel
for (cx, cy, a) in ((-.85, -.55, 10), (.8, -.5, -15), (.0, -.62, 0)):
    for i in range(7):
        t = i / 6; x = cx + (t - .5) * .55 * math.cos(math.radians(a)); y = cy + (t - .5) * .55 * math.sin(math.radians(a))
        r = .075 * (1 - .3 * abs(t - .4)); z = .93 + r + .05 * math.sin(t * math.pi)
        esfera((x, y, z), r, lag, seg=24)
        if 0 < i < 6: toro((x, y, z), r * .9, r * .13, fx, rot=(0, math.radians(90), math.radians(a)))
# consumidor secundario: ave no topo
b = blob([('ELLIPSOID', (0, 0, 1.62), .3, (1.0, .72, .78), (0, math.radians(-25), 0)), ('BALL', (-.2, 0, 1.82), .2),
          ('ELLIPSOID', (.26, 0, 1.52), .28, (1.2, .55, .35), (0, math.radians(-30), 0)), ('ELLIPSOID', (.14, 0, 1.58), .3, (1, .65, .55), (0, math.radians(-30), 0))], pena, res=.012, thr=.5)
cone((-.4, 0, 1.82), .07, .005, .16, bic, rot=(0, math.radians(-90 + 8), 0))
for s in (-1, 1): esfera((-.3, s * .12, 1.88), .03, plastico('#0c0a08', .08), seg=16)
chao_auto()
sai('B09.2', elev=26, azim=-14, tam=560)

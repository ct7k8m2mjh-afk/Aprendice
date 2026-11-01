# B06.2 2a lei de Mendel: as 4 classes de sementes da F2 di-hibrida (amarela lisa, amarela rugosa, verde lisa, verde rugosa),
# na proporcao 9:3:3:1, em montinhos. Ervilhas com textura real (rugosa = enrugada). Revisao 31/10 (segunda lente).
import sys; sys.path[:0] = ['/home/claude/escadas-sc/design/icones_real/foto3d', '/home/claude/escadas-sc/design/icones_real/foto3d/cenas']
from _bio2 import *
cena(); random.seed(6)
am = org('#f2c230', '#e6a818', cav='#b07a10', sss=.4, rugos=.3, coat=.55, bump=.1, esc=6, ao=.1)
ve = org('#6cb43a', '#4e9a2a', cav='#3a6a18', sss=.4, rugos=.3, coat=.55, bump=.1, esc=6, ao=.1)
def ervilha(p, r, m, rug):
    o = esfera(p, r, m, seg=48)
    if rug: gn_sulcos(o, r * .16, 1.3 / r, .12, warp=.4, warp_esc=3, tipo='ruga', sub=2, seed=random.uniform(0, 9))
    else: desloca(o, r * .04, .5)
    return o
def monte(cx, cy, n, m, rug, r=.22):
    pos = []
    camadas = [(0, 1)] if n == 1 else [(r * 1.15, max(3, n - 3)), (0, min(3, n))]
    k = 0
    if n == 1: ervilha((cx, cy, r), r, m, rug); return
    # base em anel + topo
    nb = n - 3 if n > 4 else n
    for i in range(nb):
        a = i / nb * 6.283; rr = r * (1.25 if nb > 4 else 1.0)
        ervilha((cx + math.cos(a) * rr * 1.2, cy + math.sin(a) * rr * 1.2, r), r * random.uniform(.92, 1.05), m, rug)
    if n > 4:
        for i in range(3):
            a = i / 3 * 6.283 + .5
            ervilha((cx + math.cos(a) * r * .65, cy + math.sin(a) * r * .65, r * 2.5), r * random.uniform(.92, 1.05), m, rug)
monte(-1.0, .2, 9, am, False)
monte(.45, .5, 3, am, True)
monte(-.15, -.75, 3, ve, False)
monte(1.05, -.55, 1, ve, True)
chao_auto()
sai('B06.2', elev=30, azim=-12)

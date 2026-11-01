# B12.5 invertebrados (equinodermos): estrela-do-mar com simetria pentarradial, bracos com tuberculos/espinhos calcarios na
# face aboral e o madreporito (placa da entrada do sistema ambulacral). Revisao 31/10 (2a rodada).
import sys; sys.path[:0] = ['/home/claude/escadas-sc/design/icones_real/foto3d', '/home/claude/escadas-sc/design/icones_real/foto3d/cenas']
from _bio2 import *
cena(); random.seed(5)
pel = org('#ec6a1e', '#f28a2e', cav='#5a1a00', sss=.35, rugos=.45, coat=.3, bump=.6, esc=6, ao=.1, bump_esc=40)
tub = org('#f6c46a', '#fadc8a', cav='#7a4a10', sss=.3, rugos=.4, coat=.35, bump=.2, esc=8)
mad = org('#f2d8a0', '#e8c888', cav='#7a5a20', sss=.2, rugos=.6, coat=.1, bump=.8, esc=30)
el = [('BALL', (0, 0, .3), .62)]
for k in range(5):
    a = math.radians(90 + k * 72)
    for j in range(1, 10):
        t = j / 9; r = .55 * (1 - .82 * t) + .06
        el.append(('BALL', (math.cos(a) * t * 2.0, math.sin(a) * t * 2.0, .26 - .1 * t + .05 * math.sin(t * 3 + k)), r))
o = blob(el, pel, res=.02, thr=.6)
for v in o.data.vertices: v.co.z = max(v.co.z * .55, 0) if v.co.z > .02 else v.co.z * .3
gn_sulcos(o, .03, 5, .2, warp=.15, warp_esc=2, tipo='voronoi', sub=1)
# fileiras de tuberculos ao longo de cada braco (centro e laterais)
for k in range(5):
    a = math.radians(90 + k * 72); d = V((math.cos(a), math.sin(a), 0)); w = V((-d.y, d.x, 0))
    for j in range(1, 13):
        t = j / 13; r = .55 * (1 - .82 * t) + .06
        for off in (-.45, 0, .45):
            p = d * t * 2.0 + w * off * r * .9 + V((0, 0, (.26 - .1 * t) * .55 + r * .5 * (1 - abs(off) * .6) + .02))
            esfera(tuple(p), .035 * (1.3 - t * .6), tub, seg=12)
esfera((.25, -.2, .48), .09, mad, seg=24)
chao_auto()
sai('B12.5', elev=40, azim=-10, tam=560)

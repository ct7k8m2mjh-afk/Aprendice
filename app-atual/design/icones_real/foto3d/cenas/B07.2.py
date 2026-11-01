# B07.2 digestao: estomago em J (esofago, fundo, corpo, antro, piloro) ligado ao duodeno, com as arterias gastricas e
# gastroepiploicas correndo nas curvaturas menor e maior e as pregas da musculatura visiveis. Revisao 31/10 (2a rodada).
import sys; sys.path[:0] = ['/home/claude/escadas-sc/design/icones_real/foto3d', '/home/claude/escadas-sc/design/icones_real/foto3d/cenas']
from _bio2 import *
cena()
est = org('#e6868a', '#d86e76', cav='#5a1a20', sss=.4, rugos=.32, coat=.5, bump=.3, esc=5, ao=.15, bump_esc=18)
duo = org('#eba07a', '#e08a66', cav='#5a2a10', sss=.4, rugos=.35, coat=.45, bump=.2, esc=5)
eso = org('#e9a0a0', '#de8a8a', cav='#5a2a2a', sss=.4, rugos=.35, coat=.45, bump=.2, esc=5)
art = org('#d32f2f', '#e85b4a', cav='#5a0a0a', sss=.25, rugos=.3, coat=.5, bump=.05, esc=3)
vei = org('#2b55b8', '#3a6fd0', cav='#0c1d4a', sss=.25, rugos=.3, coat=.5, bump=.05, esc=3)
pts = [(-.45, 0, 1.95), (-.35, 0, 1.55), (-.15, 0, 1.2), (.2, 0, .7), (.55, 0, .35), (.95, 0, .3), (1.25, 0, .55), (1.4, 0, .9)]
rad = [.13, .14, .5, .62, .5, .32, .18, .17]
el = []
for i in range(len(pts) - 1):
    for t in (0, .33, .66):
        p = V(pts[i]) * (1 - t) + V(pts[i + 1]) * t; r = rad[i] * (1 - t) + rad[i + 1] * t
        el.append(('BALL', tuple(p), r * 1.6))
el.append(('BALL', (-.05, 0, 1.45), .75))
o = blob(el, est, res=.03, thr=.6)
suave_mod(o, 1)
gn_sulcos(o, .012, 2.6, .5, warp=.5, warp_esc=1.2, tipo='onda', eixo='Z', sub=0)
dgo = o.evaluated_get(bpy.context.evaluated_depsgraph_get()); bpy.context.view_layer.update()
def cola(pts, off):
    r = []
    for p in pts:
        ok, loc, nor, idx = o.closest_point_on_mesh(V(p))
        r.append(tuple(loc + nor * off))
    return r
tubo([(-.55, 0, 2.6), (-.5, 0, 2.2), (-.42, 0, 1.75)], .13, eso)
tubo([(1.35, 0, .85), (1.5, 0, 1.0), (1.75, 0, .9), (1.8, 0, .5), (1.7, 0, .2)], .14, duo)
# vasos nas curvaturas, colados na superficie (frente)
cm = [(-.2, -.3, 1.6), (0, -.35, 1.2), (.3, -.4, .95), (.7, -.4, .8), (1.1, -.3, .75)]
cM = [(-.8, -.3, 1.6), (-.75, -.35, 1.0), (-.4, -.4, .4), (.2, -.4, 0), (.8, -.35, -.05), (1.2, -.3, .2)]
tubo(cola(cm, .04), .035, art); tubo(cola([(x + .06, y, z - .08) for x, y, z in cm], .04), .03, vei)
tubo(cola(cM, .045), .04, art); tubo(cola([(x - .06, y, z + .07) for x, y, z in cM], .04), .035, vei)
for i in range(1, 5):
    a_ = V(cM[i]); b_ = V(cm[min(i, 4)])
    tubo(cola([tuple(a_ * (1 - t) + b_ * t) for t in (0, .15, .3)], .03), .016, art)
chao_auto()
sai('B07.2', elev=12, azim=-20, tam=560)

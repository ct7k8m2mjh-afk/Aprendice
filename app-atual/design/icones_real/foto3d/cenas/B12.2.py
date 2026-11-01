# B12.2 protistas: ameba (protozoario) com pseudopodes irregulares, ectoplasma claro, endoplasma granular, nucleo, vacuolo digestivo e vacuolo contratil
import sys; sys.path[:0] = ['/home/claude/escadas-sc/design/icones_real/foto3d', '/home/claude/escadas-sc/design/icones_real/foto3d/cenas']
from _bio2 import *
pele = pele_org; plastico = plast_org
cena()
import random; random.seed(21)
ecto = org('#bfe6f0', '#d6f0f6', cav='#2a6a7a', sss=.2, rugos=.12, coat=.6, bump=.2, esc=4, ao=.1)
ecto.node_tree.nodes['Principled BSDF'].inputs['Transmission Weight'].default_value = .7; endo = org('#7fb8c8', '#9acad6', cav='#1a4a5a', sss=.4, rugos=.4, coat=.3, bump=.6, esc=8, bump_esc=40, ao=.1); nuc = pele('#4f5bd5', .1, .3); vd = plastico('#e8a33a', .3); vc = vidro('#eaf8ff', .02)
lobos = [(0.3, 1.5, .55), (1.4, 1.1, .45), (2.6, 1.7, .5), (3.8, .9, .4), (5.0, 1.3, .48)]
def corpo(esc):
    el = [('ELLIPSOID', (0, 0, .4), 1.0 * esc, (1.15, .95, .42))]
    for a, L, r in lobos:
        for j in range(5):
            t = .35 + j * .2 * L / 1.3
            w = r * (1 - j * .12) * esc
            el.append(('ELLIPSOID', (math.cos(a) * t + .12 * math.sin(j + a), math.sin(a) * t, .35), w, (1, 1, .55)))
    return el
o = blob(corpo(1.0), ecto, res=.025); desloca(o, .02, .3)
i = blob(corpo(.82), endo, res=.025); i.scale = (.93, .93, .9); i.location.z = .03
esfera((-.15, .1, .52), .3, nuc); esfera((-.1, .05, .62), .1, pele('#2a2f8a', .1, .3), seg=32)
esfera((.5, -.25, .5), .2, translucido('#ffe1a6', .4)); esfera((.5, -.25, .5), .1, vd, seg=32)
esfera((.25, .5, .55), .16, vc, seg=32)
for k in range(45):
    a = random.uniform(0, 6.28); r = random.uniform(.2, .95)
    esfera((r * math.cos(a), r * math.sin(a) * .85, .5 + random.uniform(-.05, .08)), .028, plastico('#4f7f8c', .4), seg=12)
sai('B12.2', elev=40, azim=-12, tam=560)

# B01.6 nucleo: nucleo em corte (um quarto removido): carioteca de duas membranas com complexos de poro, nucleoplasma,
# cromatina enovelada e nucleolo, com reticulo endoplasmatico contínuo com a membrana externa. Revisao 31/10.
import sys; sys.path[:0] = ['/home/claude/escadas-sc/design/icones_real/foto3d', '/home/claude/escadas-sc/design/icones_real/foto3d/cenas']
from _bio2 import *
cena(); random.seed(12)
env = org('#4a5ed8', '#6a4ad0', cav='#101a5a', sss=.3, rugos=.3, coat=.55, bump=.25, esc=6, ao=.12)
inn = org('#8a9cf0', '#9a8cf0', cav='#2a2a7a', sss=.3, rugos=.3, coat=.5, bump=.1, esc=6)
npl = org('#d8d4f6', '#c8c0f0', cav='#5a50a0', sss=.4, rugos=.35, coat=.35, bump=.2, esc=8, ao=.15)
cro = org('#c0368a', '#a02a9a', cav='#3a0828', sss=.3, rugos=.3, coat=.55, bump=.2, esc=8, ao=.06)
nuc = org('#5a1a7a', '#6a2090', cav='#14041e', sss=.3, rugos=.35, coat=.55, bump=.5, esc=10, ao=.06)
por = org('#f2c94a', '#e8b830', cav='#6a4a00', sss=.2, rugos=.3, coat=.5, bump=0)
er = org('#e8a0c8', '#d88ab8', cav='#5a1a40', sss=.35, rugos=.3, coat=.5, bump=.2, esc=6)
C = V((0, 0, 1.1)); R = 1.0
def corte(o):
    bpy.ops.mesh.primitive_cube_add(size=2.2, location=C + V((1.1, -1.1, 1.1))); b = bpy.context.object
    return dif(o, b)
o = esfera(C, R, env, seg=96); i_ = esfera(C, R * .94, None, seg=96); dif(o, i_); corte(o); desloca(o, .015, .25)
o2 = esfera(C, R * .91, inn, seg=96); i2 = esfera(C, R * .87, None, seg=96); dif(o2, i2); corte(o2)
n = esfera(C, R * .86, npl, seg=96); corte(n)
# poros: aneis amarelos na superficie externa (fora da regiao cortada)
for k in range(46):
    u = random.uniform(-1, 1); a = random.uniform(0, 6.283); d = V((math.sqrt(1 - u * u) * math.cos(a), math.sqrt(1 - u * u) * math.sin(a), u))
    if d.x > 0 and d.y < 0 and d.z > 0: continue
    if d.z < -.5: continue
    p = C + d * R * 1.0
    t = toro(tuple(p), .05, .02, por); t.rotation_euler = d.to_track_quat('Z', 'Y').to_euler()
# cromatina: fios enovelados aparecendo nas faces do corte e o nucleolo
for k in range(14):
    p0 = C + V((random.uniform(.05, .7), random.uniform(-.7, -.05), random.uniform(.05, .7)))
    pts = [tuple(p0)]
    q = p0
    for j in range(6):
        q = q + V((random.uniform(-.18, .18), random.uniform(-.18, .18), random.uniform(-.18, .18)))
        q = V((max(-.02, q.x - C.x) + C.x, min(.02, q.y - C.y) + C.y, max(-.02, q.z - C.z) + C.z))
        if (q - C).length > .8: q = C + (q - C).normalized() * .8
        pts.append(tuple(q))
    tubo(pts, .045, cro, tipo='NURBS')
nl = esfera(C + V((.3, -.3, .28)), .3, nuc, seg=48); desloca(nl, .03, .1)
chao_auto()
sai('B01.6', elev=26, azim=-16)

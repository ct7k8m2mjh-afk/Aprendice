# B11.1 evidencias da evolucao: fossil de amonite (concha em espiral logaritmica com costelas) exposto numa placa de rocha
# sedimentar: o registro fossil, evidencia direta de especies extintas e da mudanca dos seres vivos ao longo do tempo.
# Revisao 31/10 (segunda lente): substitui o par braco/asa (ilegivel a 72 px).
import sys; sys.path[:0] = ['/home/claude/escadas-sc/design/icones_real/foto3d', '/home/claude/escadas-sc/design/icones_real/foto3d/cenas']
from _bio2 import *
cena(); random.seed(8)
roc = org('#d6c8ac', '#b4a280', cav='#4a3a24', sss=0, rugos=.85, coat=0, bump=1.2, esc=4, ao=.25, mix=.8, bump_esc=30)
con = org('#c8935a', '#9a6534', cav='#3a200c', sss=.1, rugos=.45, coat=.35, bump=.35, esc=5, ao=.1, cav_forca=1.0)
# placa de rocha irregular
r = caixa((0, 0, .25), (3.6, 3.0, .5), roc, chanfro=.08)
desloca(r, .2, .45, sub=4)
# espiral logaritmica: r = a e^(b t), tubo com raio proporcional, metade enterrada na rocha (z0 = topo)
z0 = .52
a_, b_ = .045, .19
T = 2.75 * 2 * math.pi
pts = []; rs = []
N = 160
for i in range(N + 1):
    t = i / N * T; R = a_ * math.exp(b_ * t)
    pts.append((R * math.cos(t), R * math.sin(t), z0)); rs.append(R)
Rmax = rs[-1]
tb = tubo(pts, 1.0, con, raios=[x * .42 for x in rs], tipo='POLY', res=10)
tb.data.bevel_depth = 1.0
# costelas: aneis ao longo da espiral, orientados pela tangente
for i in range(6, N, 2):
    p = V(pts[i]); q = V(pts[min(N, i + 1)]); d = (q - p).normalized(); R = rs[i]
    bpy.ops.mesh.primitive_torus_add(major_radius=R * .42, minor_radius=R * .07, location=p, major_segments=32, minor_segments=8)
    o = bpy.context.object; o.rotation_euler = d.to_track_quat('Z', 'Y').to_euler(); o.data.materials.append(con)
    for f in o.data.polygons: f.use_smooth = True
# afunda a parte de baixo: tudo abaixo de z0 - .05 escondido na rocha (corte)
for o in [o for o in bpy.context.scene.objects if o.type in ('MESH', 'CURVE') and o.name not in ('CHAO',) and o != r]:
    o.location.x -= .25; o.location.y += .1
chao_auto()
sai('B11.1', elev=42, azim=-14)

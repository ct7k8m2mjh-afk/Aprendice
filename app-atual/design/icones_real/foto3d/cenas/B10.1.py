# B10.1 viroses: virus envelopado em corte: envelope lipidico com espiculas de glicoproteina (trimeros), matriz, capsideo e
# o genoma de RNA dentro (como influenza, dengue e SARS-CoV-2). Revisao 31/10 (2a rodada).
import sys; sys.path[:0] = ['/home/claude/escadas-sc/design/icones_real/foto3d', '/home/claude/escadas-sc/design/icones_real/foto3d/cenas']
from _bio2 import *
cena(); random.seed(7)
env = org('#e2584a', '#ee7060', cav='#4a0a08', sss=.3, rugos=.35, coat=.5, bump=.3, esc=6, ao=.1)
inn = org('#f6c0a8', '#f0ac92', cav='#7a3a2a', sss=.4, rugos=.4, coat=.3, bump=.3, esc=8, ao=.1)
esp = org('#f2b705', '#f6c935', cav='#6a4a00', sss=.3, rugos=.3, coat=.55, bump=.3, esc=8, ao=.06)
cap = org('#3b5fe0', '#5a78ea', cav='#0a1450', sss=.3, rugos=.3, coat=.55, bump=.3, esc=8, ao=.08)
rna = org('#c8338a', '#da4a9a', cav='#4a0828', sss=.3, rugos=.3, coat=.55, bump=0)
C = V((0, 0, 1.2)); R = 1.0
o = esfera(C, R, env, seg=96); gn_sulcos(o, .025, 9, .1, warp=.1, warp_esc=3, tipo='voronoi', sub=1)
i_ = esfera(C, R * .9, None, seg=96); dif(o, i_)
bpy.ops.mesh.primitive_cube_add(size=2.4, location=C + V((1.2, -1.2, 1.2))); dif(o, bpy.context.object)
o2 = esfera(C, R * .89, inn, seg=96); i2 = esfera(C, R * .8, None, seg=96); dif(o2, i2)
bpy.ops.mesh.primitive_cube_add(size=2.4, location=C + V((1.2, -1.2, 1.2))); dif(o2, bpy.context.object)
# capsideo icosaedrico + RNA enovelado
bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=1, radius=.55, location=C); c = bpy.context.object; c.data.materials.append(cap)
bv = c.modifiers.new('bv', 'BEVEL'); bv.width = .06; bv.segments = 3; desloca(c, .02, .1)
pts = [tuple(C + V((math.cos(t * 2.3) * .3, math.sin(t * 3.1) * .3, math.sin(t * 1.7) * .3))) for t in [i * .35 for i in range(22)]]
t = tubo(pts, .045, rna, tipo='NURBS')
# espiculas: haste + cabeca trimerica
for k in range(60):
    u = random.uniform(-1, 1); a = random.uniform(0, 6.283); d = V((math.sqrt(1 - u * u) * math.cos(a), math.sqrt(1 - u * u) * math.sin(a), u))
    if d.x > 0 and d.y < 0 and d.z > 0: continue
    if d.z < -.55: continue
    p0 = C + d * R * .98; p1 = C + d * R * 1.25
    tubo([tuple(p0), tuple(p1)], .035, esp)
    w = d.orthogonal().normalized(); w2 = d.cross(w)
    for j in range(3):
        ang = j * 2.094; off = (w * math.cos(ang) + w2 * math.sin(ang)) * .055
        esfera(tuple(p1 + d * .07 + off), .075, esp, seg=16)
chao_auto()
sai('B10.1', elev=24, azim=-16)

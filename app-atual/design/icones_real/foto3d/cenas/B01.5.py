# B01.5 endossimbiose: cloroplasto em corte: envelope de duas membranas, grana (pilhas de tilacoides) ligados por lamelas,
# estroma com graos de amido, DNA circular e ribossomos proprios (evidencias da origem bacteriana). Revisao 31/10 (2a rodada).
import sys; sys.path[:0] = ['/home/claude/escadas-sc/design/icones_real/foto3d', '/home/claude/escadas-sc/design/icones_real/foto3d/cenas']
from _bio2 import *
cena(); random.seed(2)
ext = org('#3e8e2c', '#56a83a', cav='#0e2e08', sss=.3, rugos=.3, coat=.55, bump=.25, esc=5, ao=.12)
inn = org('#86c45a', '#9ad06a', cav='#2a5a10', sss=.3, rugos=.3, coat=.5, bump=.1, esc=5)
est = org('#d8eeb0', '#c8e49a', cav='#5a7a2a', sss=.4, rugos=.4, coat=.3, bump=.4, esc=9, ao=.12)
tons = [org(h, clareia(h, 1.15), cav='#04200a', sss=.3, rugos=.3, coat=.55, bump=.1, esc=6, ao=.04) for h in ('#1b6b25', '#22803a', '#1f7a2b')]
lam = org('#2e8a3a', '#3a9a46', cav='#0a2a10', sss=.3, rugos=.3, coat=.5, bump=0)
ami = org('#f4efe0', '#e8e0c8', cav='#8a7a5a', sss=.3, rugos=.4, coat=.4, bump=.2, esc=8)
dna = org('#f2b705', '#f5c832', cav='#6a4a00', sss=.2, rugos=.3, coat=.5, bump=0)
rib = org('#7b2cbf', '#9040d0', cav='#200840', sss=.2, rugos=.3, coat=.5, bump=0)
S = (1.9, 1.05, .95)
def casca(r0, r1, m, corte):
    o = esfera((0, 0, 0), 1, m, seg=96); escala(o, (S[0] * r0, S[1] * r0, S[2] * r0))
    i = esfera((0, 0, 0), 1, None, seg=96); escala(i, (S[0] * r1, S[1] * r1, S[2] * r1)); dif(o, i)
    bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, corte + 1.5)); b = bpy.context.object; b.scale = (6, 4, 3); dif(o, b)
    return o
o = casca(1.0, .95, ext, .3); desloca(o, .012, .25)
casca(.93, .89, inn, .32)
s = esfera((0, 0, 0), 1, est, seg=96); escala(s, (S[0] * .885, S[1] * .885, S[2] * .885))
bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, -.18 + 1.5)); b = bpy.context.object; b.scale = (6, 4, 3); dif(s, b)
gr = [(-1.2, .1), (-.7, -.38), (-.2, .3), (.3, -.32), (.8, .25), (1.25, -.1), (-.72, .48), (.35, .52), (-.15, -.55)]
tops = {}
for n_, (x, y) in enumerate(gr):
    k_ = random.randint(6, 8)
    for k in range(k_): cilindro((x, y, -.24 + k * .068), .21, .055, tons[(k + n_) % 3], chanfro=.024)
    tops[n_] = -.24 + k_ * .068
for a, b2 in ((0, 1), (1, 3), (2, 4), (3, 5), (0, 6), (2, 7), (4, 5), (6, 2), (1, 8), (8, 3), (2, 3)):
    p, q = gr[a], gr[b2]
    for dz in (-.1, .05):
        l = caixa(((p[0] + q[0]) / 2, (p[1] + q[1]) / 2, dz), (V((q[0] - p[0], q[1] - p[1], 0)).length, .1, .02), lam, chanfro=.008,
                  rot=(0, 0, math.atan2(q[1] - p[1], q[0] - p[0])))
for (x, y) in ((-.45, -.05), (1.05, .45), (.05, -.08)):
    o = esfera((x, y, -.12), .14, ami, seg=32); escala(o, (1.5, 1, .55))
t = toro((.62, -.62, -.15), .13, .022, dna)
for k in range(18):
    esfera((random.uniform(-1.4, 1.4), random.uniform(-.6, .6), -.15), .03, rib, seg=12)
mover_tudo(.95); chao_auto()
sai('B01.5', elev=46, azim=-12, tam=560)

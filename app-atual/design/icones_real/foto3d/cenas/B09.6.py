# B09.6 biomas brasileiros: mandacaru (Cereus jamacaru), cacto colunar com costelas e areolas com espinhos, simbolo da
# Caatinga (bioma exclusivamente brasileiro), no solo seco e rachado. Revisao 31/10 (segunda lente).
import sys; sys.path[:0] = ['/home/claude/escadas-sc/design/icones_real/foto3d', '/home/claude/escadas-sc/design/icones_real/foto3d/cenas']
from _bio2 import *
cena(); random.seed(3)
cac = org('#4f9a5a', '#6aae6c', cav='#0e2e14', sss=.25, rugos=.4, coat=.35, bump=.2, esc=4, ao=.12, cav_forca=.9)
esp = org('#f2e6c8', '#e6d4a8', cav='#6a5a30', sss=0, rugos=.4, coat=.3, bump=0)
are = org('#e8dcc0', '#f4ecd8', cav='#7a6a4a', sss=0, rugos=.8, coat=0, bump=.4, esc=20)
sol = org('#d8a868', '#c08848', cav='#4a2a10', sss=0, rugos=.9, coat=0, bump=.9, esc=5, ao=.15)
def coluna(pts, r, n_cost=7):
    t = tubo(pts, r, cac, tipo='NURBS'); o = malha(t)
    # costelas: deslocamento por faixa angular em volta do eixo (aprox. pelo angulo em XY local)
    for v in o.data.vertices: pass
    md = o.modifiers.new('sd', 'SUBSURF'); md.levels = md.render_levels = 1
    return o
def costelas(o, cx, cy, n=8, prof=.06):
    bpy.context.view_layer.update()
    for v in o.data.vertices:
        a = math.atan2(v.co.y - cy, v.co.x - cx); f = (math.cos(a * n) + 1) / 2
        d = V((v.co.x - cx, v.co.y - cy, 0))
        if d.length > 1e-4: v.co += d.normalized() * (f - .5) * prof * 2
    return o
def areolas(cx, cy, z0, z1, r, n=8, niv=10):
    for k in range(n):
        a = k / n * 6.283 / 1 + 0.0
        for z in [z0 + (z1 - z0) * i / (niv - 1) for i in range(niv)]:
            p = V((cx + math.cos(a / 1) * (r + .06), cy + math.sin(a) * (r + .06), z + (k % 2) * .06))
            esfera(tuple(p), .028, are, seg=10)
            for s in (-1, 1):
                d = V((math.cos(a + s * .5), math.sin(a + s * .5), random.uniform(-.2, .3))).normalized()
                bastao(tuple(p), tuple(p + d * .1), .006, esp)
# tronco principal + 2 bracos em candelabro
t = tubo([(0, 0, 0), (0, 0, 1.5), (0, 0, 3.0)], .32, cac, tipo='POLY'); o = malha(t); costelas(o, 0, 0, 8, .06)
areolas(0, 0, .25, 2.85, .32)
for s, h in ((-1, 1.1), (1, 1.5)):
    pts = [(0, 0, h), (s * .45, 0, h + .05), (s * .7, 0, h + .3), (s * .72, 0, h + 1.0)]
    b = tubo(pts, .22, cac, tipo='NURBS'); ob = malha(b); costelas(ob, s * .72, 0, 8, .045)
    areolas(s * .72, 0, h + .4, h + .95, .22, niv=4)
    esfera((s * .72, 0, h + 1.0), .22, cac, seg=32)
esfera((0, 0, 3.0), .32, cac, seg=48)
# solo seco rachado
g = cilindro((0, 0, -.06), 1.2, .14, sol, chanfro=.05, vert=64); escala(g, (1.25, .9, 1))
gn_sulcos(g, .025, 2.5, .05, warp=.2, warp_esc=2, tipo='voronoi', sub=3)
chao_auto()
sai('B09.6', elev=18, azim=-10)

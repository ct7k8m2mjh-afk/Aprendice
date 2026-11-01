# B08.3 arco reflexo / SNA: segmento de medula espinal em corte transversal: substancia cinzenta em H (cornos posteriores
# finos, anteriores largos), substancia branca ao redor, canal central, fissura mediana anterior; raiz dorsal (sensitiva)
# com o ganglio espinal e raiz ventral (motora) unindo-se no nervo espinal. Revisao 31/10 (segunda lente).
import sys; sys.path[:0] = ['/home/claude/escadas-sc/design/icones_real/foto3d', '/home/claude/escadas-sc/design/icones_real/foto3d/cenas']
from _bio2 import *
cena(); random.seed(3)
bra = org('#f3e2cc', '#e9d2b8', cav='#8a7558', sss=.4, rugos=.35, coat=.45, bump=.12, esc=5, ao=.15)
cin = org('#9a5a74', '#8a4a66', cav='#4a2a35', sss=.3, rugos=.4, coat=.3, bump=.3, esc=12, ao=.06)
ner = org('#f0d58a', '#e6c46c', cav='#7a5a10', sss=.35, rugos=.35, coat=.45, bump=.15, esc=6, ao=.1)
gan = org('#efc25a', '#e2ab3c', cav='#6a4a08', sss=.35, rugos=.4, coat=.4, bump=.4, esc=9, ao=.1)
vas = org('#d32f2f', '#e85b4a', cav='#5a0a0a', sss=.25, rugos=.3, coat=.5, bump=.05, esc=3)
H = 1.5
# corpo da medula (eliptico, achatado anteroposterior), com fissura anterior
cord = cilindro((0, 0, H / 2), 1.0, H, bra, chanfro=.06, vert=96); escala(cord, (1.15, .85, 1))
f = caixa((0, -.88, H / 2 + .1), (.07, .3, H + .4), None, chanfro=0); dif(cord, f)
# H cinzento (borboleta) como placa pouco saliente no topo
import bmesh
def contorno():
    P = []
    # metade direita (x>0) de baixo (anterior, -y) para cima (posterior, +y); espelha depois
    pts = [(0.0, -.30), (.18, -.33), (.42, -.55), (.62, -.50), (.66, -.25), (.50, -.05), (.42, .10), (.50, .32), (.55, .62), (.47, .68), (.30, .38), (.16, .20), (0.0, .18)]
    return pts
pr = contorno(); full = pr + [(-x, y) for (x, y) in reversed(pr[1:-1])]
me = bpy.data.meshes.new('h'); bm = bmesh.new()
vs = [bm.verts.new((x * 1.15, y * .85, H + .005)) for (x, y) in full]; fc = bm.faces.new(vs)
r = bmesh.ops.extrude_face_region(bm, geom=[fc])
for v in [e for e in r['geom'] if isinstance(e, bmesh.types.BMVert)]: v.co.z -= .06
bm.to_mesh(me); g = bpy.data.objects.new('h', me); bpy.context.scene.collection.objects.link(g); g.data.materials.append(cin)
g.location.z = .03; m2 = g.modifiers.new('sd', 'SUBSURF'); m2.levels = m2.render_levels = 2
for p in g.data.polygons: p.use_smooth = True
esfera((0, -.0, H + .035), .045, plastico('#5a3a48', .3), seg=24)  # canal central
# raizes: dorsal (posterolateral, com ganglio espinal) e ventral (anterolateral) unindo-se no nervo espinal
for s in (-1, 1):
    zr = H * .5
    tubo([(s * .55, .62, zr + .1), (s * .95, .72, zr + .05), (s * 1.25, .62, zr)], .11, ner)
    gg = esfera((0, 0, 0), .3, gan, seg=48); escala(gg, (1.4, 1, 1)); gg.location = (s * 1.35, .55, zr); gg.rotation_euler = (0, 0, math.radians(s * -25))
    tubo([(s * 1.55, .4, zr), (s * 1.75, .15, zr - .05)], .12, ner)
    tubo([(s * .75, -.5, zr - .1), (s * 1.15, -.42, zr - .12), (s * 1.6, -.15, zr - .1)], .1, ner)
    tubo([(s * 1.7, .1, zr - .07), (s * 2.0, -.15, zr - .12), (s * 2.25, -.5, zr - .2)], .17, ner)
# arteria espinal anterior
# pia-mater: vasos finos na superficie da substancia branca e arteria espinal anterior na fissura
pv = org('#d84a4a', '#e86060', cav='#5a0a0a', sss=.25, rugos=.3, coat=.5, bump=0)
for k in range(9):
    a0 = random.uniform(0, 6.283); z0 = random.uniform(.15, H - .15)
    pts = [(1.155 * math.cos(a0 + j * .12), .855 * math.sin(a0 + j * .12), z0 + j * .05 * (1 if k % 2 else -1)) for j in range(6)]
    tubo(pts, .012, pv)
tubo([(0, -.86, .02), (0, -.87, H * .5), (0, -.86, H - .02)], .03, pv)
gn_sulcos(cord, .006, 7, .4, warp=.3, warp_esc=2, tipo='ruga', sub=1)
chao_auto()
sai('B08.3', elev=34, azim=-16, folga=1.0, tam=560)

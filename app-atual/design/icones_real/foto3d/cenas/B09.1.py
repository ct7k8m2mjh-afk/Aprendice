# B09.1 cadeia alimentar: lagarta (consumidor primario, herbivoro) comendo uma folha (produtor): o primeiro elo de uma
# cadeia alimentar. Folha com nervuras e a mordida na borda. Revisao 31/10: substitui a foto por render 3D.
import sys; sys.path[:0] = ['/home/claude/escadas-sc/design/icones_real/foto3d', '/home/claude/escadas-sc/design/icones_real/foto3d/cenas']
from _bio2 import *
import bmesh
cena(); random.seed(2)
fol = org('#3f9a2e', '#5cb83a', cav='#123a0a', sss=.3, rugos=.35, coat=.5, bump=.15, esc=3, ao=.1)
ner = org('#a8d878', '#c4e696', cav='#3a6a1a', sss=.3, rugos=.35, coat=.4, bump=0)
# contorno da folha (ovada, ponta aguda) no plano XY
pts = []
for i in range(60):
    t = i / 60 * 2 * math.pi
    x = 1.7 * math.cos(t); y = .95 * math.sin(t) * (1 - .25 * math.cos(t)) * (abs(math.sin(t)) ** .15)
    pts.append((x, y))
me = bpy.data.meshes.new('f'); bm = bmesh.new(); vs = [bm.verts.new((x, y, 0)) for x, y in pts]; f = bm.faces.new(vs)
bmesh.ops.triangulate(bm, faces=[f])
r = bmesh.ops.extrude_face_region(bm, geom=bm.faces[:])
for v in [e for e in r['geom'] if isinstance(e, bmesh.types.BMVert)]: v.co.z += .04
bm.to_mesh(me); folha = bpy.data.objects.new('folha', me); bpy.context.scene.collection.objects.link(folha); folha.data.materials.append(fol)
rm = folha.modifiers.new('rm', 'REMESH'); rm.mode = 'SMOOTH'; rm.octree_depth = 7
# mordidas na borda (semicirculos)
for (x, y, rr) in [(.25, .82, .28), (.62, .7, .22)]:
    c = cilindro((x, y, 0), rr, 1, None, chanfro=0); dif(folha, c)
sel(folha); [bpy.ops.object.modifier_apply(modifier=m.name) for m in list(folha.modifiers)]
# curvatura: folha arqueada ao longo do comprimento e dobrada na nervura
for v in folha.data.vertices:
    v.co.z += .45 * math.cos(v.co.x / 1.7 * 1.3) + .22 * abs(v.co.y) - .3 * (v.co.x / 1.7) ** 2
for p in folha.data.polygons: p.use_smooth = True
subdiv(folha, 1)
# nervura central e peciolo
mid = [(x, 0, .045 + .45 * math.cos(x / 1.7 * 1.3) - .3 * (x / 1.7) ** 2) for x in [-2.3, -1.7, -1.0, 0, 1.0, 1.6]]
tubo(mid, .045, ner, raios=[1.3, 1.1, .9, .7, .45, .2])
for k in range(5):
    x0 = -1.2 + k * .55
    for s in (-1, 1):
        x1 = x0 + .45; y1 = s * (.55 - .06 * k)
        z0 = .05 + .45 * math.cos(x0 / 1.7 * 1.3) - .3 * (x0 / 1.7) ** 2
        z1 = .05 + .45 * math.cos(x1 / 1.7 * 1.3) + .22 * abs(y1) - .3 * (x1 / 1.7) ** 2
        tubo([(x0, 0, z0), ((x0 + x1) / 2, y1 * .55, (z0 + z1) / 2 + .03), (x1, y1, z1)], .018, ner, raios=[1, .7, .3])
# lagarta (padrao de Papilio: verde com faixas pretas e pontos laranja) na borda mordida
corpo = org('#7cc23a', '#94d24c', cav='#1e4a08', sss=.4, rugos=.3, coat=.55, bump=.1, esc=6)
faixa = plastico('#15140f', .3); ponto = plastico('#f28c1a', .3)
seg = []
for i in range(11):
    t = i / 10
    x = .9 - t * 1.6; y = .5 + .12 * math.sin(t * 3.4); z = .55 + .25 * math.sin(t * math.pi) * .4 + .45 * math.cos(x / 1.7 * 1.3) - .3 * (x / 1.7) ** 2 + .05
    r = .17 * (1 - .35 * abs(t - .45) ** 1.2) * (0.8 if i == 0 else 1)
    seg.append((x, y, z, r))
for i, (x, y, z, r) in enumerate(seg):
    esfera((x, y, z), r, corpo, seg=48)
    if 0 < i < 10:
        t_ = toro((x, y, z), r * .92, r * .14, faixa, rot=(0, math.radians(90), math.radians(-8)))
        for s in (-1, 1):
            esfera((x, y + s * r * .55, z + r * .75), r * .16, ponto, seg=16)
    if i > 0:
        tubo([(x, y - r * .35, z - r * .8), (x, y - r * .35, z - r * 1.05)], .03, corpo)
esfera((seg[0][0] + .08, seg[0][1], seg[0][2] - .02), seg[0][3] * .8, plastico('#5a8a28', .25), seg=32)
chao_auto()
sai('B09.1', elev=30, azim=-14)

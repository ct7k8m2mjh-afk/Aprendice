# B11.2 Lamarck x Darwin / selecao natural: mariposas Biston betularia (forma clara e forma melanica) pousadas num pedaco de
# tronco claro com liquens: a escura fica a vista dos predadores (melanismo industrial, exemplo classico de selecao natural).
# Revisao 31/10: substitui a foto das girafas por render 3D.
import sys; sys.path[:0] = ['/home/claude/escadas-sc/design/icones_real/foto3d', '/home/claude/escadas-sc/design/icones_real/foto3d/cenas']
from _bio2 import *
import bmesh
cena(); random.seed(3)
casca = org('#bdb197', '#7a6e58', cav='#2a241a', sss=0, rugos=.8, coat=0, bump=.8, esc=5, ao=.25, mix=.6, cav_forca=.9)
liq = org('#b8c49c', '#dfe3cc', cav='#4a5a30', sss=0, rugos=.85, coat=0, bump=.8, esc=14, ao=.05)
cerne = org('#e8d2a6', '#d9bd88', cav='#7a5a30', sss=.05, rugos=.6, coat=.1, bump=.2, esc=6, ao=.1)
# pedaco de tronco deitado (meia-cana): casca com sulcos verticais
t = cilindro((0, 0, 0), 1.0, 3.0, casca, rot=(0, math.radians(90), 0), chanfro=.04, vert=96)
gn_sulcos(t, .09, 3.2, .45, warp=.5, warp_esc=1.5, tipo='onda', eixo='Y', sub=3)
t.location = (0, 0, .25)
# tampas com aneis (cerne) nas pontas
for s in (-1, 1):
    c = cilindro((s * 1.5, 0, .25), .9, .03, cerne, rot=(0, math.radians(90), 0), chanfro=.01)
# manchas de liquen
for k in range(9):
    x = random.uniform(-1.3, 1.3); a = random.uniform(-1.2, 1.2)
    l = esfera((x, -math.sin(a) * .98, .25 + math.cos(a) * .98), random.uniform(.14, .26), liq, seg=32); escala(l, (1.3, .3, 1.0)); gn_sulcos(l, .03, 18, .3, warp=.3, warp_esc=6, tipo='ruga', sub=1)
def asa(pts, m, z=0):
    for _ in range(3):
        q = []
        for i in range(len(pts)):
            a, b = V(pts[i] + (0,)), V(pts[(i + 1) % len(pts)] + (0,))
            q += [tuple((a * .75 + b * .25)[:2]), tuple((a * .25 + b * .75)[:2])]
        pts = q
    me = bpy.data.meshes.new('as'); bm = bmesh.new(); vs = [bm.verts.new((x, y, z)) for x, y in pts]; f = bm.faces.new(vs)
    r = bmesh.ops.extrude_face_region(bm, geom=[f])
    for v in [e for e in r['geom'] if isinstance(e, bmesh.types.BMVert)]: v.co.z += .02
    bm.to_mesh(me); o = bpy.data.objects.new('as', me); bpy.context.scene.collection.objects.link(o); o.data.materials.append(m)
    md = o.modifiers.new('bv', 'BEVEL'); md.width = .008; md.segments = 2
    sd = o.modifiers.new('sd', 'SUBSURF'); sd.levels = sd.render_levels = 2
    for p in o.data.polygons: p.use_smooth = True
    return o
def mariposa(loc, rot, clara=True):
    if clara:
        m = org('#f1ece2', '#26221e', cav='#222222', sss=.05, rugos=.7, coat=0, bump=.4, esc=34, mix=.05, centro=.6)
        mc = org('#d9d2c2', '#b8b0a0', cav='#333333', sss=.05, rugos=.7, coat=0, bump=.3, esc=20)
    else:
        m = org('#2a2622', '#3a342e', cav='#0a0806', sss=.05, rugos=.6, coat=.05, bump=.4, esc=28, mix=.3)
        mc = org('#26221e', '#302a24', cav='#0a0806', sss=.05, rugos=.6, coat=.05, bump=.3, esc=20)
    obs = []
    # asas em repouso (triangulares, abertas e achatadas sobre a casca): anterior e posterior de cada lado
    for s in (-1, 1):
        a1 = asa([(0, .08), (s * .2, .1), (s * .45, .06), (s * .66, -.02), (s * .7, -.12), (s * .55, -.22), (s * .3, -.28), (s * .08, -.2)], m)
        a2 = asa([(s * .04, -.14), (s * .3, -.24), (s * .48, -.32), (s * .44, -.44), (s * .26, -.52), (s * .06, -.46)], m, z=-.01)
        obs += [a1, a2]
    b = tubo([(0, .16, .05), (0, -.1, .07), (0, -.42, .04)], .065, mc, raios=[1.0, 1.1, .6]); obs.append(b)
    for s in (-1, 1):
        obs.append(tubo([(0, .14, .03), (s * .1, .3, .05), (s * .2, .4, .04)], .008, mc))
    M = mathutils.Matrix.Translation(V(loc)) @ rot.to_matrix().to_4x4()
    for o in obs: o.matrix_world = M @ o.matrix_world
def na_casca(x, a, giro):
    n = V((0, -math.sin(a), math.cos(a))); p = V((x, 0, .25)) + n * 1.03
    q = V((0, 0, 1)).rotation_difference(n); q2 = mathutils.Quaternion(n, math.radians(giro))
    return tuple(p), (q2 @ q)
p, r = na_casca(-.55, .55, 15); mariposa(p, r, clara=True)
p, r = na_casca(.6, .25, -20); mariposa(p, r, clara=False)
chao_auto()
sai('B11.2', elev=34, azim=-6, tam=560)

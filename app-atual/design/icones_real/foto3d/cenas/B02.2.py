# B02.2 carboidratos e lipidios: fatia de pao (amido, um carboidrato) com um tablete de manteiga (gordura, um lipidio) por
# cima, comecando a derreter. Revisao 31/10 (segunda lente): miolo poroso, casca tostada.
import sys; sys.path[:0] = ['/home/claude/escadas-sc/design/icones_real/foto3d', '/home/claude/escadas-sc/design/icones_real/foto3d/cenas']
from _bio2 import *
import bmesh
cena()
mio = org('#f5e4bc', '#ecd4a2', cav='#b08a52', sss=.3, rugos=.75, coat=0, bump=.8, esc=6, ao=.05, bump_esc=34, cav_forca=.6)
cas = org('#b8742e', '#9a5a20', cav='#3a1e08', sss=.1, rugos=.55, coat=.15, bump=.6, esc=6, ao=.1)
man = org('#f7dc6a', '#f2cf4e', cav='#9a7a10', sss=.5, rugos=.25, coat=.55, bump=.1, esc=4, ao=.1)
# contorno da fatia (forma de pao de forma com topo abaulado)
pts = []
for i in range(40):
    t = i / 39; pts.append((-1.0 + 2 * t, -1.0))
for i in range(1, 40):
    t = i / 39; pts.append((1.0, -1.0 + 1.55 * t))
for i in range(1, 60):
    a = math.radians(i / 60 * 180); pts.append((math.cos(a) * 1.18, .55 + math.sin(a) * .62))
for i in range(1, 39):
    t = i / 39; pts.append((-1.0, .55 - 1.55 * t))
def placa(p2, esp, m, y0=0):
    me = bpy.data.meshes.new('p'); bm = bmesh.new(); vs = [bm.verts.new((x, y0, z)) for x, z in p2]; f = bm.faces.new(vs)
    bmesh.ops.triangulate(bm, faces=[f])
    r = bmesh.ops.extrude_face_region(bm, geom=bm.faces[:])
    for v in [e for e in r['geom'] if isinstance(e, bmesh.types.BMVert)]: v.co.y += esp
    bm.to_mesh(me); o = bpy.data.objects.new('p', me); bpy.context.scene.collection.objects.link(o); o.data.materials.append(m)
    return o
pts = [(x * 1.0, z) for x, z in pts]
c = placa(pts, .42, cas, -.21)
rm = c.modifiers.new('rm', 'REMESH'); rm.mode = 'SMOOTH'; rm.octree_depth = 7
bv = c.modifiers.new('sd', 'SUBSURF'); bv.levels = bv.render_levels = 1
for p in c.data.polygons: p.use_smooth = True
# miolo: placa levemente menor, saliente nas duas faces
ins = [(x * .93, z * .93 + .01) for x, z in pts]
m_ = placa(ins, .5, mio, -.25)
rm = m_.modifiers.new('rm', 'REMESH'); rm.mode = 'SMOOTH'; rm.octree_depth = 7
gn_sulcos(m_, .015, 11.0, .05, warp=.2, warp_esc=4, tipo='voronoi', sub=0)
# deita a fatia inclinada e poe a manteiga
for o in (c, m_):
    o.matrix_world = mathutils.Matrix.Translation(V((0, 0, .26))) @ mathutils.Matrix.Rotation(math.radians(-90 + 0), 4, 'X') @ o.matrix_world
b = caixa((.15, -.1, .66), (.8, .55, .32), man, chanfro=.07, rot=(0, 0, math.radians(18)))
d = esfera((.15, -.1, .5), 1, man, seg=48); escala(d, (.62, .5, .06))
chao_auto()
sai('B02.2', elev=38, azim=-14)

import sys, os, math, random; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _qui import *
from mathutils import Euler
# Almofariz e pistilo de porcelana com cristais azuis de sulfato de cobre penta-hidratado (CuSO4.5H2O), um sal
cena_q()
mpor = plastico('#e4e0d8', 0.28)
prof = [(0, 0), (0.55, 0), (0.6, 0.05), (0.62, 0.12), (0.95, 0.4), (1.12, 0.75), (1.15, 0.92), (1.08, 0.95), (1.02, 0.85), (0.85, 0.5), (0.5, 0.3), (0, 0.27)]
torno(prof, mpor)
# bico
o = esfera((-1.1, -0.15, 0.9), 0.12, mpor); o.scale = (1.3, 0.8, 0.5)
# pistilo apoiado
p0 = Vector((0.25, 0.1, 0.42)); p1 = Vector((1.3, 0.75, 1.65))
bastao(tuple(p0 + (p1 - p0) * 0.12), tuple(p1), 0.13, mpor)
esfera(tuple(p0 + (p1 - p0) * 0.1), 0.2, mpor)
esfera(tuple(p1), 0.15, mpor)
# cristais
mc = plastico('#1a5fe0', 0.08)
random.seed(7)
def cristal(loc, s):
    me = bpy.data.meshes.new('c'); bm = bmesh.new(); bmesh.ops.create_cube(bm, size=1)
    for v in bm.verts:
        v.co.x *= 1.0 + 0.3 * v.co.z; v.co.y *= 0.7
    bmesh.ops.transform(bm, matrix=Matrix.Shear('XY', 4, (0.3, 0.1)), verts=bm.verts)
    bm.to_mesh(me); bm.free(); o = bpy.data.objects.new('c', me); bpy.context.scene.collection.objects.link(o)
    o.location = loc; o.scale = (s, s * 0.9, s * 0.8); o.rotation_euler = (random.random() * 6.28, random.random() * 6.28, random.random() * 6.28)
    me.materials.append(mc); b = o.modifiers.new('b', 'BEVEL'); b.width = 0.04; b.segments = 2
    return o
for i in range(16):
    a = random.uniform(0, 6.28); r = random.uniform(0, 0.62)
    cristal((r * math.cos(a), r * math.sin(a), 0.42 + r * 0.45 + random.uniform(0, 0.15)), random.uniform(0.17, 0.26))
cristal((-0.7, -1.25, 0.12), 0.28); cristal((-0.2, -1.45, 0.1), 0.22); cristal((0.35, -1.3, 0.1), 0.18)
render(out('Q03.2'), elev=32)

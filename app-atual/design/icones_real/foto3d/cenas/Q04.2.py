import sys, os, math, random; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _qui import *
from mathutils import Euler
# Grafico de pizza 3D da composicao percentual em massa da glicose C6H12O6: C 40,0 %, H 6,7 %, O 53,3 % (cores CPK)
cena_q()
fat = [('#262626', 40.0), ('#d9d9d9', 6.7), ('#d62828', 53.3)]
a0 = 90
R = 1.6
for i, (c, p) in enumerate(fat):
    a1 = a0 - 360 * p / 100
    pts = []
    n = max(8, int(abs(a1 - a0) / 3))
    me = bpy.data.meshes.new('fat'); bm = bmesh.new()
    mid = math.radians((a0 + a1) / 2)
    off = Vector((math.cos(mid), math.sin(mid), 0)) * (0.12 if i == 1 else 0.04)
    hz = 0.5 if i != 1 else 0.62
    vs_b = [bm.verts.new((0, 0, 0))]; vs_t = [bm.verts.new((0, 0, hz))]
    for k in range(n + 1):
        a = math.radians(a0 + (a1 - a0) * k / n)
        vs_b.append(bm.verts.new((R * math.cos(a), R * math.sin(a), 0))); vs_t.append(bm.verts.new((R * math.cos(a), R * math.sin(a), hz)))
    bm.faces.new(list(reversed(vs_b))); bm.faces.new(vs_t)
    for k in range(len(vs_b)):
        k2 = (k + 1) % len(vs_b)
        bm.faces.new((vs_b[k], vs_b[k2], vs_t[k2], vs_t[k]))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bm.to_mesh(me); bm.free(); o = bpy.data.objects.new('f', me); bpy.context.scene.collection.objects.link(o)
    o.location = off; me.materials.append(plastico(c, 0.25))
    b = o.modifiers.new('b', 'BEVEL'); b.width = 0.05; b.segments = 4; b.limit_method = 'ANGLE'
    a0 = a1
render(out('Q04.2'), elev=34, azim=-12)

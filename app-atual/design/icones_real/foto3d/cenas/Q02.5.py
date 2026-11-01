import sys, os, math, random; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _qui import *
from mathutils import Euler
# Lingotes de ouro, cobre e bronze (liga Cu-Sn): ligacao metalica, brilho e ligas metalicas
cena_q()
def lingote(loc, m, rz=0):
    me = bpy.data.meshes.new('l'); bm = bmesh.new(); bmesh.ops.create_cube(bm, size=1)
    for v in bm.verts:
        v.co.x *= 1.6; v.co.y *= 0.75; v.co.z *= 0.42
        if v.co.z > 0: v.co.x *= 0.82; v.co.y *= 0.72
    bm.to_mesh(me); bm.free(); o = bpy.data.objects.new('l', me); bpy.context.scene.collection.objects.link(o)
    o.location = loc; o.rotation_euler = (0, 0, math.radians(rz)); me.materials.append(m)
    b = o.modifiers.new('b', 'BEVEL'); b.width = 0.05; b.segments = 4
    return o
lingote((-0.45, 0.25, 0.21), metal('#c26a3a', 0.22))
lingote((0.45, -0.3, 0.21), metal('#b8925a', 0.26))
lingote((0.0, 0.0, 0.63), metal('#e0b232', 0.16), rz=0)
render(out('Q02.5'), elev=30, azim=-25)

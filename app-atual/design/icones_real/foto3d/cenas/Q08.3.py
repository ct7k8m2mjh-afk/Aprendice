import sys, os, math, random; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _qui import *
from mathutils import Euler
# As duas meias-setas do equilibrio quimico: reacao direta (azul, ->) e inversa (vermelha, <-) ocorrendo ao mesmo tempo
cena_q()
def meia_seta(y, z, sentido, m):
    L = 2.5; t = 0.3; e = 0.5
    me = bpy.data.meshes.new('s'); bm = bmesh.new()
    s = sentido
    # haste + farpa (meia ponta) so de um lado
    pts = [(-L / 2, 0), (L / 2 - 0.05, 0), (L / 2 - 0.8, 0.62), (L / 2 - 1.08, 0.62), (L / 2 - 0.6, t), (-L / 2, t)]
    if s < 0:
        pts = [(-x, -yy + t) for (x, yy) in pts]
    vb = [bm.verts.new((x, 0, yy)) for x, yy in pts]
    f = bm.faces.new(vb)
    r = bmesh.ops.extrude_face_region(bm, geom=[f]); vv = [v for v in r['geom'] if isinstance(v, bmesh.types.BMVert)]
    bmesh.ops.translate(bm, vec=(0, e, 0), verts=vv)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bm.to_mesh(me); bm.free(); o = bpy.data.objects.new('s', me); bpy.context.scene.collection.objects.link(o)
    o.location = (0, y, z); me.materials.append(m)
    b = o.modifiers.new('b', 'BEVEL'); b.width = 0.07; b.segments = 5; b.limit_method = 'ANGLE'
    return o
# revisao 31/10: setas mais curtas, grossas e juntas (antes compridas e finas, o par ficava largo e pequeno no quadro)
meia_seta(0, 1.12, 1, plastico('#1f5fd6', 0.25))
meia_seta(0, 0.5, -1, plastico('#d62828', 0.25))
render(out('Q08.3'), elev=20, azim=-26)

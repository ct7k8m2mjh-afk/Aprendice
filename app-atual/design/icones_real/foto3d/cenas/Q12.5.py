import sys, os, math, random; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _qui import *
from mathutils import Euler
# Chamine industrial (faixas vermelhas e brancas) soltando fumaca: poluentes, chuva acida (SO2, NOx) e efeito estufa (CO2)
cena_q()
mr = plastico('#d62828', 0.35); mw = plastico('#f4f4f2', 0.35)
# fabrica
caixa((0.9, 0.2, 0.5), (2.2, 1.4, 1.0), plastico('#b9bec5', 0.45), chanfro=0.04)
for k in range(3):
    me = bpy.data.meshes.new('t'); bm = bmesh.new()
    x0 = 0.05 + k * 0.62
    vs = [bm.verts.new(v) for v in [(x0, -0.5, 1.0), (x0 + 0.62, -0.5, 1.0), (x0 + 0.62, -0.5, 1.35), (x0, 0.9, 1.0), (x0 + 0.62, 0.9, 1.0), (x0 + 0.62, 0.9, 1.35)]]
    bm.faces.new((vs[0], vs[1], vs[2])); bm.faces.new((vs[3], vs[5], vs[4])); bm.faces.new((vs[0], vs[3], vs[4], vs[1])); bm.faces.new((vs[1], vs[4], vs[5], vs[2])); bm.faces.new((vs[2], vs[5], vs[3], vs[0]))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces); bm.to_mesh(me); bm.free()
    o = bpy.data.objects.new('t', me); bpy.context.scene.collection.objects.link(o); me.materials.append(plastico('#7d848c', 0.45))
for k in range(4):
    caixa((0.35 + k * 0.5, -0.51, 0.55), (0.28, 0.02, 0.32), plastico('#5ba3d9', 0.15), chanfro=0.0)
# chamine com faixas
H = 3.6; r0 = 0.42; r1 = 0.3
n = 8
for i in range(n):
    za = i * H / n; zb = (i + 1) * H / n
    ra = r0 + (r1 - r0) * za / H; rb = r0 + (r1 - r0) * zb / H
    torno([(0, za), (ra, za), (rb, zb), (0, zb)], mr if i % 2 == 0 or i == n - 1 else mw, loc=(-0.65, 0.3, 0), fechado=False)
toro((-0.65, 0.3, H), r1, 0.05, plastico('#444444', 0.4))
# fumaca: metaballs cinza
mb = bpy.data.metaballs.new('f'); mb.resolution = 0.06; ob = bpy.data.objects.new('f', mb); bpy.context.scene.collection.objects.link(ob)
for (x, z, r) in [(0, 0.2, 0.35), (0.15, 0.6, 0.45), (0.45, 0.95, 0.5), (0.9, 1.25, 0.55), (1.4, 1.45, 0.55), (1.9, 1.55, 0.5), (0.7, 1.1, 0.45)]:
    e = mb.elements.new(); e.co = (x, 0, z); e.radius = r
ob.location = (-0.65, 0.3, H)
mb.materials.append(fosco('#9ea3a8', 0.9))
bx = caixa((-0.65 + 1.0, 0.3, H + 1.0), (3.0, 1.0, 2.2), None, chanfro=0); bx.hide_render = True
render(out('Q12.5'), elev=20)

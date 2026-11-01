import sys, os, math, random; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _qui import *
from mathutils import Euler
# Placa com o simbolo internacional de radiacao ionizante (trifolio): emissoes radioativas alfa, beta e gama
cena_q()
objs = []
S = 2.6
objs.append(caixa((0, 0, 0), (S, 0.16, S), plastico('#f2b705', 0.28), chanfro=0.12))
mk = plastico('#1a1a1a', 0.35)
R = 0.2
objs.append(cilindro((0, -0.1, 0), R, 0.06, mk, rot=(math.radians(90), 0, 0), chanfro=0.0))
for k in range(3):
    a0 = math.radians(90 + 120 * k - 30); a1 = math.radians(90 + 120 * k + 30)
    me = bpy.data.meshes.new('p'); bm = bmesh.new(); n = 24
    vi = []; vo = []
    for i in range(n + 1):
        a = a0 + (a1 - a0) * i / n
        vi.append(bm.verts.new((1.5 * R * math.cos(a), 0, 1.5 * R * math.sin(a)))); vo.append(bm.verts.new((5 * R * math.cos(a), 0, 5 * R * math.sin(a))))
    for i in range(n): bm.faces.new((vi[i], vi[i + 1], vo[i + 1], vo[i]))
    bm.to_mesh(me); bm.free(); o = bpy.data.objects.new('p', me); bpy.context.scene.collection.objects.link(o); me.materials.append(mk)
    o.location = (0, -0.08, 0); s = o.modifiers.new('s', 'SOLIDIFY'); s.thickness = 0.06
    bv = o.modifiers.new('b', 'BEVEL'); bv.width = 0.01; bv.segments = 2
    objs.append(o)
grupo(objs, loc=(0, 0, S / 2 * 0.95 + 0.1), rot=(-12, 0, 18))
caixa((0, 0.55, 0.06), (0.9, 0.9, 0.12), plastico('#2b2f36', 0.35), chanfro=0.04)
render(out('Q09.4'), elev=18)

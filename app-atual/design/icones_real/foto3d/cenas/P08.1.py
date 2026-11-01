# P08.1 sujeito, predicado e oracao sem sujeito: guarda-chuva aberto sob gotas de chuva ("Chove." nao tem sujeito)
from _por import *
cena_p()
n = 8; R = 0.95
me = bpy.data.meshes.new('cop'); bm = bmesh.new()
top = bm.verts.new((0, 0, 0.62))
ring = []
for i in range(n):
    a = 2 * math.pi * i / n; ring.append(bm.verts.new((R * math.cos(a), R * math.sin(a), 0.0)))
mids = []
for i in range(n):
    a = 2 * math.pi * (i + 0.5) / n; mids.append(bm.verts.new((R * 0.9 * math.cos(a), R * 0.9 * math.sin(a), 0.1)))
for i in range(n):
    f = bm.faces.new((top, ring[i], mids[i], ring[(i + 1) % n])); f.material_index = i % 2
bm.to_mesh(me); bm.free()
cop = bpy.data.objects.new('cop', me); bpy.context.scene.collection.objects.link(cop)
cop.data.materials.append(plastico('#d62828', 0.35)); cop.data.materials.append(plastico('#f7f4ec', 0.35))
sd = cop.modifiers.new('sd', 'SUBSURF'); sd.levels = 3; sd.render_levels = 3
so = cop.modifiers.new('so', 'SOLIDIFY'); so.thickness = 0.015
for p in cop.data.polygons: p.use_smooth = True
aco = metal('#c7cbd1', 0.25)
ob = [cop]
ob.append(cilindro((0, 0, 0.7), 0.02, 0.18, aco))
ob.append(cilindro((0, 0, -0.35), 0.018, 1.95, aco))
ob.append(bez([(0, 0, -1.3), (0, 0, -1.45), (0.04, 0, -1.55), (0.16, 0, -1.56), (0.2, 0, -1.45)], 0.04, plastico('#3a2416', 0.35)))
g = grupo(ob, loc=(0, 0, 1.55), rot=(math.radians(10), math.radians(-14), 0))
no_chao(g)
ag = liquido('#4f9ff0')
import random; random.seed(3)
for (x, y, z) in ((-1.0, -0.3, 2.9), (-0.35, -0.6, 3.25), (0.4, -0.4, 3.05), (1.05, -0.1, 2.75), (0.0, 0.3, 3.5), (-0.75, 0.2, 3.6), (0.8, 0.4, 3.45)):
    d = esfera((x, y, z), 0.07, ag); c = cone((x, y, z + 0.08), 0.068, 0.0, 0.16, ag)

render(saida('P08.1'), elev=22, azim=-14)

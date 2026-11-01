# B02.1 agua e sais minerais: gota de agua e cristais cubicos de sal (NaCl)
import sys; sys.path[:0] = ['/home/claude/escadas-sc/design/icones_real/foto3d', '/home/claude/escadas-sc/design/icones_real/foto3d/cenas']
from _bk import *
cena()
import random
bpy.ops.mesh.primitive_uv_sphere_add(radius=1, segments=96, ring_count=64, location=(0, 0, 0)); g = bpy.context.object
for v in g.data.vertices:
    t = math.acos(max(-1, min(1, v.co.z)))  # 0 no topo
    rxy = math.sin(t) * (math.sin(t / 2) ** 1.25); ang = math.atan2(v.co.y, v.co.x)
    v.co.x = rxy * math.cos(ang); v.co.y = rxy * math.sin(ang); v.co.z = math.cos(t) * 1.15
for p in g.data.polygons: p.use_smooth = True
m = bpy.data.materials.new('agua'); m.use_nodes = True; b = m.node_tree.nodes['Principled BSDF']
b.inputs['Base Color'].default_value = cor('#3d9be9'); b.inputs['Transmission Weight'].default_value = .9; b.inputs['Roughness'].default_value = .02; b.inputs['IOR'].default_value = 1.33
b.inputs['Coat Weight'].default_value = .5
g.data.materials.append(m); g.location = (-.25, .1, 1.15 * .72); escala(g, (.9, .9, .95))
# fundo leve dentro da gota (cor de agua mais densa)
sal = bpy.data.materials.new('sal'); sal.use_nodes = True; b = sal.node_tree.nodes['Principled BSDF']
b.inputs['Base Color'].default_value = cor('#f4f6f8'); b.inputs['Transmission Weight'].default_value = .55; b.inputs['Roughness'].default_value = .18; b.inputs['Coat Weight'].default_value = .4
for (x, y, s, r) in ((.85, -.35, .42, 12), (1.25, .15, .3, 35), (.55, .35, .24, -20), (1.1, -.75, .2, 50)):
    caixa((x, y, s / 2), (s, s, s), sal, chanfro=.02, rot=(0, 0, math.radians(r)))
sai('B02.1', elev=24)

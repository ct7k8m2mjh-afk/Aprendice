# P11.1 Barroco e Arcadismo: vela derretendo no castical de latao (a brevidade da vida; o carpe diem)
from _por import *
cena_p()
lat = metal('#d4a52a', 0.2)
torno([(0, 0), (0.62, 0), (0.64, 0.03), (0.6, 0.07), (0.15, 0.1), (0.1, 0.16), (0.12, 0.2), (0.18, 0.22), (0.18, 0.26), (0, 0.26)], lat)
toro((0.72, 0, 0.12), 0.13, 0.03, lat, rot=(math.radians(90), 0, 0))
ce = bpy.data.materials.new('cera'); ce.use_nodes = True; b = ce.node_tree.nodes['Principled BSDF']
b.inputs['Base Color'].default_value = cor('#f6efe0'); b.inputs['Roughness'].default_value = 0.5; b.inputs['Subsurface Weight'].default_value = 0.6
b.inputs['Subsurface Radius'].default_value = (0.2, 0.15, 0.1)
torno([(0, 0.26), (0.15, 0.26), (0.15, 1.02), (0.13, 1.06), (0.08, 1.04), (0, 1.03)], ce)
for (a, h) in ((20, 0.35), (130, 0.22), (250, 0.45)):
    x, y = 0.15 * math.cos(math.radians(a)), 0.15 * math.sin(math.radians(a))
    bez([(x, y, 1.03), (x * 1.1, y * 1.1, 1.0 - h * 0.4), (x * 1.08, y * 1.08, 1.0 - h)], 0.03, ce)
    esfera((x * 1.08, y * 1.08, 1.0 - h), 0.038, ce)
bez([(0, 0, 1.03), (0.01, 0, 1.1), (0.02, 0, 1.14)], 0.008, plastico('#1c1c1c', 0.6))
ch = esfera((0.02, 0, 1.27), 0.07, emissivo('#ff9a1f', 1.6)); ch.scale = (1, 1, 2.2)
nu = esfera((0.02, 0, 1.22), 0.035, emissivo('#ffe680', 2.2)); nu.scale = (1, 1, 1.8)
bpy.ops.object.light_add(type='POINT', location=(0.02, -0.1, 1.3)); bpy.context.object.data.energy = 25; bpy.context.object.data.color = (1, 0.7, 0.35)
render(saida('P11.1'), elev=18, azim=-16)

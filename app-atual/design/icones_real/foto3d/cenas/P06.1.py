# P06.1 metafora e metonimia: coroa de ouro com pedras ("a Coroa decidiu" = o rei: metonimia)
from _por import *
cena_p()
ou = metal('#d9a82e', 0.2)
R = 0.6
torno([(R, 0), (R, 0.28), (R - 0.04, 0.28), (R - 0.04, 0.0)], ou, seg=128)
toro((0, 0, 0.02), R + 0.01, 0.035, ou); toro((0, 0, 0.27), R + 0.005, 0.025, ou)
# veludo vermelho por dentro
cup = esfera((0, 0, 0.2), R - 0.05, fosco('#8e1020', 0.85)); cup.scale = (1, 1, 0.75)
n = 8
for i in range(n):
    a = 2 * math.pi * i / n
    p = placa([(-0.2, 0), (0.2, 0), (0, 0.42)], 0.04, ou, chanfro=0.012)
    e = bpy.data.objects.new('e', None); bpy.context.scene.collection.objects.link(e)
    p.parent = e; p.location = (0, R - 0.02, 0.25); p.rotation_euler = (math.radians(90 - 8), 0, math.radians(180))
    e.rotation_euler = (0, 0, a)
    x, y = (R + 0.06) * math.sin(-a) * -1, (R + 0.06) * math.cos(a)
    esfera((-(R + 0.05) * math.sin(a), (R + 0.05) * math.cos(a), 0.7), 0.05, ou)
    gem = ['#d62828', '#1f5fd6', '#2e9e44', '#d62828'][i % 4]
    g = esfera((-(R + 0.005) * math.sin(a), (R + 0.005) * math.cos(a), 0.145), 0.055, vidro(gem, 0.02)); g.scale = (1, 1, 1)
    g.data.materials[0].node_tree.nodes['Principled BSDF'].inputs['Transmission Weight'].default_value = 0.6
render(saida('P06.1'), elev=24, azim=-14)

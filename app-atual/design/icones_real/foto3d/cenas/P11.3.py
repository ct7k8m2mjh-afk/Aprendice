# P11.3 Realismo e Machado de Assis: espelho de mao com moldura dourada ("O espelho"; o retrato fiel da sociedade)
from _por import *
cena_p()
ou = metal('#d4a52a', 0.22)
ob = []
fr = toro((0, 0, 0), 0.5, 0.06, ou); fr.scale = (1, 1.25, 1); ob.append(fr)
fr2 = toro((0, 0, 0.0), 0.56, 0.025, ou); fr2.scale = (1, 1.22, 1); ob.append(fr2)
es = bpy.data.materials.new('esp'); es.use_nodes = True; b = es.node_tree.nodes['Principled BSDF']
b.inputs['Base Color'].default_value = cor('#cfe2f5'); b.inputs['Metallic'].default_value = 1; b.inputs['Roughness'].default_value = 0.12
le = cilindro((0, 0, 0), 0.5, 0.03, es, chanfro=0.005); le.scale = (1, 1.25, 1); ob.append(le)
ob.append(cilindro((0, 0, -0.04), 0.52, 0.05, ou)); ob[-1].scale = (1, 1.24, 1)
ob.append(torno([(0, 0), (0.08, 0), (0.1, 0.06), (0.06, 0.12), (0.055, 0.6), (0.075, 0.72), (0.05, 0.78), (0.0, 0.8)], ou, rot=(math.radians(90), 0, 0), loc=(0, -0.67 - 0.78, 0)))
ob[-1].rotation_euler = (math.radians(90), 0, 0); ob[-1].location = (0, -0.6, 0)
for k in range(6):
    a = math.radians(30 + k * 60)
    ob.append(esfera((0.56 * math.cos(a), 0.56 * 1.22 * math.sin(a), 0.03), 0.04, ou))
# reflexo pintado (ceu suave) para o espelho nao ficar vazio
g = grupo(ob, loc=(0, 0, 0.1), rot=(math.radians(25), 0, math.radians(-30)))
no_chao(g)
w = bpy.context.scene.world.node_tree; 
render(saida('P11.3'), elev=34, azim=-14)

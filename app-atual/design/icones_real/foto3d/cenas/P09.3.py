# P09.3 adjetivas restritivas x explicativas: peneira de metal com graos retidos na tela (a restritiva filtra)
from _por import *
import random
cena_p(); random.seed(7)
aco = metal('#c7cbd1', 0.25)
R = 0.85
torno([(R, 0.0), (R, 0.32), (R - 0.03, 0.32), (R - 0.03, 0.0)], aco, seg=128)
toro((0, 0, 0.32), R - 0.015, 0.025, aco)
toro((0, 0, 0.0), R - 0.015, 0.02, aco)
bpy.ops.mesh.primitive_grid_add(x_subdivisions=30, y_subdivisions=30, size=2 * R, location=(0, 0, 0.06))
tela = bpy.context.object; tela.data.materials.append(metal('#6c727a', 0.35))
w = tela.modifiers.new('wf', 'WIREFRAME'); w.thickness = 0.012; aplica_mods(tela)
cil = cilindro((0, 0, 0.06), R - 0.03, 0.2, None, chanfro=0); boolean(tela, cil, op='INTERSECT')
# cabo
bez([(R - 0.02, 0, 0.2), (R + 0.3, 0, 0.24), (R + 0.75, 0, 0.27)], 0.06, plastico('#d62828', 0.35))
graos = plastico('#7a3b1c', 0.35); gr2 = plastico('#e8c070', 0.4)
for i in range(38):
    r = (R - 0.18) * math.sqrt(random.random()); a = random.uniform(0, 2 * math.pi)
    g = esfera((r * math.cos(a), r * math.sin(a), 0.11), 0.06, graos if i % 3 else gr2, seg=16); g.scale = (1.4, 0.9, 0.8); g.rotation_euler.z = random.uniform(0, 3)
render(saida('P09.3'), elev=40, azim=-20)

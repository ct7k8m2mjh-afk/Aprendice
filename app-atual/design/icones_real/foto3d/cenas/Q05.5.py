import sys, os, math, random; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _qui import *
from mathutils import Euler
# Solucao saturada de sulfato de cobre com corpo de fundo (cristais que nao se dissolvem). Revisao 31/10: solucao mais clara e
# cristais maiores e facetados (azul mais escuro) para o corpo de fundo aparecer; um montinho de cristais num vidro de relogio na frente.
cena_q()
ml = liquido('#3d9be6'); ml.node_tree.nodes['Principled BSDF'].inputs['IOR'].default_value = 1.08  # IOR baixo: ve-se o fundo
objs, ext = bequer(R=0.85, H=1.7, nivel=1.2, cor=ml)
for o in objs[:2]: o.data.materials[0].node_tree.nodes['Principled BSDF'].inputs['IOR'].default_value = 1.1  # parede sem distorcao
mc = plastico('#0a2f9e', 0.08); mc.node_tree.nodes['Principled BSDF'].inputs['Coat Weight'].default_value = 0.8
def cristal(x, y, z, r):
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=1, radius=r, location=(x, y, z))
    o = bpy.context.object; o.rotation_euler = (random.random() * 3, random.random() * 3, random.random() * 3)
    o.scale = (1.35, 0.9, 0.75); o.data.materials.append(mc); return o
random.seed(5)
for k in range(34):
    a = random.uniform(0, 6.28); r = math.sqrt(random.random()) * 0.62
    cristal(r * math.cos(a), r * math.sin(a), 0.14 + random.uniform(0, 0.06) + (0.62 - r) * 0.22, random.uniform(0.12, 0.19))
# bastao de vidro apoiado
bastao((-0.05, 0.3, 0.3), (0.75, 0.7, 2.45), 0.05, vidro('#ffffff'))
# vidro de relogio com cristais, na frente
torno([(0, 0.03), (0.55, 0.12), (0.6, 0.16), (0.56, 0.16), (0.0, 0.07)], vidro('#f4faff'), loc=(1.15, -0.85, 0))
random.seed(9)
for k in range(9):
    a = random.uniform(0, 6.28); r = math.sqrt(random.random()) * 0.32
    cristal(1.15 + r * math.cos(a), -0.85 + r * math.sin(a), 0.2 + (0.32 - r) * 0.35, random.uniform(0.11, 0.16))
render(out('Q05.5'), elev=34, azim=-14)

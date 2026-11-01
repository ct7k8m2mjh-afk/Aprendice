import sys, os, math, random; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _qui import *
from mathutils import Euler
# Barra de sabao com espuma: saponificacao (gordura + base forte -> sal de acido graxo, o sabao, + glicerol)
cena_q()
ms = plastico('#8fd1b0', 0.35)
s = caixa((0, 0, 0.42), (2.4, 1.4, 0.84), ms, chanfro=0.3)
# espuma: bolhas brancas foscas amontoadas + bolhas de sabao iridescentes soltas
mf = fosco('#ffffff', 0.55)
random.seed(6)
for k in range(38):
    a = random.uniform(0, 6.28); r = math.sqrt(random.random()) * 0.75
    esfera((0.25 + r * math.cos(a) * 1.2, r * math.sin(a), 0.86 + random.uniform(0, 0.25) * (1 - r)), random.uniform(0.09, 0.2), mf, seg=24)
mb = bpy.data.materials.new('bolha'); mb.use_nodes = True; b = mb.node_tree.nodes['Principled BSDF']
b.inputs['Transmission Weight'].default_value = 1.0; b.inputs['Roughness'].default_value = 0.0; b.inputs['IOR'].default_value = 1.05
b.inputs['Thin Film Thickness'].default_value = 450; b.inputs['Thin Film IOR'].default_value = 1.33
for (x, y, z, r) in [(-0.6, -0.4, 1.65, 0.32), (0.55, -0.6, 2.1, 0.22), (-0.15, -0.2, 2.35, 0.16)]:
    esfera((x, y, z), r, mb, seg=48)
render(out('Q12.2'), elev=28)

import sys, os, math, random; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _qui import *
from mathutils import Euler
# Copo com agua e cubos de gelo flutuando: as ligacoes de hidrogenio deixam o gelo menos denso que a agua liquida
cena_q()
R = 0.85; H = 2.1; esp = 0.04
ext = [(0, 0), (R * 0.82 - 0.06, 0), (R * 0.82, 0.06), (R, H)]
torno(parede(ext, esp * 2.2), vidro('#f4f9ff'))
toro((0, 0, H), R - 0.04, 0.035, vidro())
nivel = 1.45
liquido_de(ext, esp * 2.2, nivel, liquido('#3d9be0'), menisco=0.02)
mg = bpy.data.materials.new('gelo'); mg.use_nodes = True; bb = mg.node_tree.nodes['Principled BSDF']; bb.inputs['Base Color'].default_value = cor('#e4f3fc'); bb.inputs['Transmission Weight'].default_value = 0.55; bb.inputs['Roughness'].default_value = 0.22; bb.inputs['Coat Weight'].default_value = 0.4
random.seed(1)
for (x, y, rz, rx) in [(-0.22, 0.05, 20, 8), (0.25, -0.12, -15, -10), (0.0, 0.32, 40, 5)]:
    o = caixa((x, y, nivel + 0.04), (0.42, 0.42, 0.42), mg, chanfro=0.07, rot=(math.radians(rx), math.radians(6), math.radians(rz)))
render(out('Q02.4'), elev=30)

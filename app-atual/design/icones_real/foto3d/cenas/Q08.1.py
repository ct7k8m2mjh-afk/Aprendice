import sys, os, math, random; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _qui import *
from mathutils import Euler
# Comprimido efervescente reagindo na agua com bolhas de CO2: velocidade de reacao (quanto mais area de contato, mais rapido)
cena_q()
R = 0.85; H = 2.2
ext = [(0, 0), (R * 0.85 - 0.06, 0), (R * 0.85, 0.06), (R, H)]
torno(parede(ext, 0.08), vidro('#f4f9ff')); toro((0, 0, H), R - 0.04, 0.035, vidro())
nivel = 1.7
liquido_de(ext, 0.08, nivel, liquido('#8cc8ef'), menisco=0.02)
# comprimido no fundo, inclinado
cilindro((0.1, 0.05, 0.33), 0.42, 0.14, fosco('#f2a33a', 0.75), rot=(math.radians(12), math.radians(-8), 0), chanfro=0.05)
# bolhas subindo (menores embaixo) e espuma na superficie
mb = bpy.data.materials.new('bolha'); mb.use_nodes = True; bb = mb.node_tree.nodes['Principled BSDF']; bb.inputs['Base Color'].default_value = cor('#ffffff'); bb.inputs['Roughness'].default_value = 0.05; bb.inputs['Transmission Weight'].default_value = 0.5; bb.inputs['Coat Weight'].default_value = 0.6
random.seed(2)
for k in range(46):
    a = random.uniform(0, 6.28); r = random.uniform(0, 0.55); z = random.uniform(0.45, nivel - 0.08)
    esfera((r * math.cos(a), r * math.sin(a), z), 0.025 + 0.05 * (z / nivel), mb, seg=16)
for k in range(30):
    a = random.uniform(0, 6.28); r = random.uniform(0, R - 0.15)
    esfera((r * math.cos(a), r * math.sin(a), nivel + 0.02), random.uniform(0.04, 0.08), mb, seg=16)
# segundo comprimido inteiro ao lado, fora do copo
cilindro((1.35, -0.55, 0.08), 0.42, 0.16, fosco('#f2a33a', 0.75), chanfro=0.05)
render(out('Q08.1'), elev=28)

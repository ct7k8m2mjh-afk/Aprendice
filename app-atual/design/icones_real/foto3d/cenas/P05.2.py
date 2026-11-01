# P05.2 denotacao e conotacao: rosa vermelha com caule e folha (a flor; e o amor, no sentido conotativo)
from _por import *
import random
cena_p(); random.seed(3)
ver = bpy.data.materials.new('petala'); ver.use_nodes = True; b = ver.node_tree.nodes['Principled BSDF']
b.inputs['Base Color'].default_value = cor('#c8102e'); b.inputs['Roughness'].default_value = 0.38
b.inputs['Coat Weight'].default_value = 0.2
cab = []
def petala(raio, ang, incl, w, hh, cup, curl):
    def f(x, y):
        u = (y + hh / 2) / hh
        return cup * (x / (w / 2)) ** 2 * (0.4 + u) - curl * max(0, u - 0.6) ** 2 * 6
    def forma(x, y):
        return f(x, y)
    o = folha_grade(w, hh, 16, 16, f, ver, esp=0.014); subdiv(o, 1)
    # estreita a base (petala arredondada): escala por vertice
    for v in o.data.vertices:
        u = (v.co.y + hh / 2) / hh; v.co.x *= (0.35 + 0.65 * math.sin(min(1, u * 1.15) * math.pi * 0.62)) ** 1.0 * (1 - 0.25 * max(0, u - 0.85) / 0.15)
        v.co.y += hh / 2
    o.rotation_euler = (math.radians(90 - incl), 0, math.radians(ang)); o.location = (raio * math.sin(math.radians(ang)) * -1, raio * math.cos(math.radians(ang)) * -1, 0)
    o.rotation_euler = (0, 0, 0)
    e = bpy.data.objects.new('pe', None); bpy.context.scene.collection.objects.link(e)
    o.parent = e; o.rotation_euler = (math.radians(90 - incl), 0, 0); o.location = (0, -raio, 0)
    e.rotation_euler = (0, 0, math.radians(ang)); cab.append(e)
camadas = [(0.0, 3, 3, 0.34, 0.4, 0.2, 0.0), (0.04, 4, 12, 0.44, 0.47, 0.18, 0.01), (0.08, 5, 26, 0.52, 0.5, 0.15, 0.03), (0.12, 5, 44, 0.58, 0.52, 0.13, 0.06)]
for k, (r, n, inc, w, hh, cup, curl) in enumerate(camadas):
    for i in range(n):
        petala(r, i * 360 / n + k * 37 + random.uniform(-8, 8), inc + random.uniform(-5, 5), w, hh, cup, curl)
vd = plastico('#2f7a32', 0.5)
for i in range(5):
    e = bpy.data.objects.new('se', None); bpy.context.scene.collection.objects.link(e)
    s = cone((0, -0.17, -0.03), 0.04, 0.0, 0.34, vd, rot=(math.radians(-90 - 60), 0, 0)); s.parent = e
    e.rotation_euler = (0, 0, math.radians(i * 72 + 10)); cab.append(e)
cab.append(esfera((0, 0, -0.04), 0.08, vd))
caule = bez([(0, 0, -0.05), (0.02, 0, -0.5), (-0.02, 0, -1.0), (0.0, 0, -1.4)], 0.045, vd)
cab.append(caule)
# folha
fo = folha_grade(0.4, 0.7, 12, 12, lambda x, y: 0.06 * (x / 0.2) ** 2, plastico('#2f8a3a', 0.45), esp=0.008)
for v in fo.data.vertices:
    u = (v.co.y + 0.35) / 0.7; v.co.x *= math.sin(u * math.pi) ** 0.8
fo.location = (0.16, 0, -0.7); fo.rotation_euler = (math.radians(70), math.radians(-60), 0); cab.append(fo)
g = grupo(cab, rot=(math.radians(-78), 0, math.radians(-60)))
no_chao(g)
render(saida('P05.2'), elev=34, azim=-12, amostras=128)

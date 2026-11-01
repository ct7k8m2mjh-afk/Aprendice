import sys, os, math, random; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _qui import *
from mathutils import Euler
# Lei de Hess: escada de etapas (caminho em varias reacoes) e rampa direta ligando o mesmo inicio e o mesmo fim -> o DeltaH nao depende do caminho
cena_q()
cores = ['#1f5fd6', '#2e9e44', '#f2b705']
h = 0.75; w = 0.9; d = 1.2
for i in range(3):
    caixa((i * w, 0, (3 - i) * h / 2), (w, d, (3 - i) * h), plastico(cores[i], 0.3), chanfro=0.06)
# patamar final (produto) no chao: placa vermelha
caixa((3 * w + 0.3, 0, 0.08), (w + 0.6, d, 0.16), plastico('#d62828', 0.3), chanfro=0.05)
# rampa direta (vidro dourado) do topo da escada ao fim
p0 = Vector((-w / 2, -d / 2 - 0.35, 3 * h + 0.25)); p1 = Vector((3 * w + 0.6, -d / 2 - 0.35, 0.35))
mg = metal('#d4a52a', 0.2)
bastao(tuple(p0), tuple(p1 + (p0 - p1).normalized() * 0.4), 0.09, mg)
dd = (p1 - p0).normalized()
o = cone(tuple(p1 - dd * 0.2), 0.0, 0.22, 0.45, mg)
o.rotation_euler = (-dd).to_track_quat('Z', 'Y').to_euler()
render(out('Q07.2'), elev=24)

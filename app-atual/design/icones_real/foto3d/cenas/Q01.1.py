import sys, os, math, random; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _qui import *
from mathutils import Euler
# Modelo de Thomson ("pudim de passas"): esfera de carga positiva com eletrons incrustados; um quarto cortado mostra o interior
cena_q()
s = esfera((0, 0, 1.05), 1.0, plastico('#f08a8a', 0.45), seg=96)
cut = caixa((0.55, -0.55, 1.6), (1.1, 1.1, 1.2), None, chanfro=0); cut.hide_render = True
b = s.modifiers.new('b', 'BOOLEAN'); b.object = cut; b.operation = 'DIFFERENCE'
# miolo levemente mais escuro nas faces do corte (mesma esfera, material unico: fica natural)
me = plastico('#1f5fd6', 0.15)
random.seed(4)
pts = []
gold = math.pi * (3 - math.sqrt(5))
for i in range(26):
    y = 1 - 2 * (i + 0.5) / 26; r = math.sqrt(1 - y * y); a = gold * i
    p = Vector((r * math.cos(a), r * math.sin(a), y))
    pc = Vector((0, 0, 1.05)) + p * 0.97
    if pc.x > 0.02 and pc.y < -0.02 and pc.z > 1.05: continue   # dentro do quarto removido
    esfera(tuple(pc), 0.11, me, seg=32)
# eletrons nas faces do corte
for (x, y, z) in [(0.5, -0.02, 1.4), (0.25, -0.02, 1.8), (0.75, -0.02, 1.25), (0.02, -0.45, 1.5), (0.02, -0.75, 1.3), (0.02, -0.2, 1.85), (0.45, -0.45, 1.06), (0.2, -0.75, 1.06), (0.75, -0.2, 1.06)]:
    esfera((x, y, z), 0.1, me, seg=32)
cut2 = None
render(out('Q01.1'), elev=30, azim=-25)

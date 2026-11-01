import sys, os, math, random; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _qui import *
from mathutils import Euler
# 2 NO2 (castanho) <=> N2O4 (incolor), direta exotermica: no gelo o equilibrio desloca para N2O4 (tubo claro); no banho quente, para NO2 (tubo escuro) -> Le Chatelier
cena_q()
# bequer com gelo (esquerda) e bequer com agua quente (direita, com vapor)
o1, e1 = bequer(R=0.75, H=1.4, nivel=0.9, cor='#d8eef9', loc=(-0.95, 0.2, 0), grad=False)
o2, e2 = bequer(R=0.75, H=1.4, nivel=0.9, cor='#f7c9b5', loc=(0.95, -0.2, 0), grad=False)
random.seed(4)
mg = vidro('#eaf6ff', 0.2)
for k in range(7):
    a = random.uniform(0, 6.28); r = random.uniform(0.2, 0.5)
    caixa((-0.95 + r * math.cos(a), 0.2 + r * math.sin(a), 0.7 + random.uniform(0, 0.35)), (0.24, 0.24, 0.24), mg, chanfro=0.04, rot=(random.random(), random.random(), random.random()))
# tubos fechados com rolha
for (x, y, c) in [(-0.95, 0.2, '#f1d7a8'), (0.95, -0.2, '#7a3510')]:
    ob, ex = tubo_ensaio(R=0.22, H=2.3, nivel=2.05, cor=None, loc=(x, y, 0.15))
    faixa(ex, 0.028, 0.03, 2.05, liquido(c) if c != '#7a3510' else liquido('#8a3a12'), loc=(x, y, 0.15))
    cone((x, y, 0.15 + 2.38), 0.17, 0.22, 0.32, fosco('#2b2b2b', 0.6))
render(out('Q08.4'), elev=26)

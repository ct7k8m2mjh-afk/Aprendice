import sys, os, math, random; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _qui import *
from mathutils import Euler
# Panela de agua fervendo e saleiro: o soluto (sal) eleva a temperatura de ebulicao da agua (ebulioscopia)
cena_q()
ma = metal('#c9ced6', 0.18)
R = 1.2; H = 1.3
torno([(0, 0), (R - 0.08, 0), (R, 0.08), (R, H), (R + 0.06, H + 0.04), (R + 0.06, H + 0.08), (R - 0.04, H + 0.08), (R - 0.04, 0.1), (0, 0.1)], ma)
# cabos
cilindro((-R - 0.75, 0, H - 0.2), 0.11, 1.4, plastico('#222222', 0.4), rot=(0, math.radians(90 - 8), 0), chanfro=0.04)
bastao((-R + 0.02, 0, H - 0.25), (-R - 0.15, 0, H - 0.22), 0.07, ma)
# agua com bolhas na superficie
liquido_de([(0, 0), (R, 0), (R, H)], 0.04, H - 0.25, liquido('#6fb8ec'))
random.seed(9)
mb = vidro('#ffffff', 0.05)
for k in range(28):
    a = random.uniform(0, 6.28); r = math.sqrt(random.random()) * (R - 0.15)
    o = esfera((r * math.cos(a), r * math.sin(a), H - 0.25), random.uniform(0.05, 0.12), mb, seg=20); o.scale = (1, 1, 0.6)
# saleiro de vidro com sal e tampa metalica furada
X, Y = 1.75, -0.7
torno(parede([(0, 0), (0.33, 0), (0.36, 0.05), (0.36, 1.1), (0.32, 1.2)], 0.03), vidro(), loc=(X, Y, 0))
faixa([(0, 0), (0.33, 0), (0.36, 0.05), (0.36, 1.1)], 0.03, 0.03, 0.75, fosco('#fbfbfb', 0.85), loc=(X, Y, 0))
torno([(0.33, 1.15), (0.34, 1.4), (0.25, 1.52), (0, 1.55)], metal('#c9ced6', 0.2), loc=(X, Y, 0), fechado=False)
for k in range(6):
    a = k * 1.047; esfera((X + 0.13 * math.cos(a), Y + 0.13 * math.sin(a), 1.5), 0.025, fosco('#222222', 0.5), seg=12)
esfera((X, Y, 1.555), 0.025, fosco('#222222', 0.5), seg=12)
render(out('Q10.1'), elev=30)

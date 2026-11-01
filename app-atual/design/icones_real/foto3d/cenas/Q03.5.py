import sys, os, math, random; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _qui import *
from mathutils import Euler
# Funil de separacao no suporte: mistura heterogenea, oleo (menos denso, amarelo) sobre a agua (azul-clara)
cena_q()
Z0 = 0.9
ext = [(0, Z0), (0.05, Z0), (0.05, Z0 + 0.9), (0.08, Z0 + 1.05), (0.75, Z0 + 2.35), (0.78, Z0 + 2.5), (0.7, Z0 + 2.75), (0.4, Z0 + 2.95), (0.2, Z0 + 3.05), (0.2, Z0 + 3.3)]
torno(parede(ext, 0.03), vidro())
faixa(ext, 0.03, Z0 + 0.6, Z0 + 1.9, liquido('#8fd0f5'))
faixa(ext, 0.03, Z0 + 1.9, Z0 + 2.45, liquido('#f2b705'), menisco=0.02)
# torneira (registro) e tampa
mt = plastico('#2e9e44', 0.3)
cilindro((0, 0, Z0 + 0.62), 0.11, 0.42, mt, rot=(0, math.radians(90), 0))
caixa((0.32, 0, Z0 + 0.62), (0.1, 0.3, 0.08), mt, chanfro=0.03)
cilindro((0, 0, Z0 + 3.38), 0.22, 0.22, plastico('#2e9e44', 0.3))
# suporte com argola
ob, (hx, hy) = suporte(loc=(0.3, 0.4, 0), h=4.6, base=(2.0, 1.2))
toro((0, 0, Z0 + 2.0), 0.62, 0.035, metal('#c9ced6', 0.2))
bastao((hx, hy, Z0 + 2.0), (0.0 + 0.62 * (hx) / math.hypot(hx, hy), 0.62 * hy / math.hypot(hx, hy), Z0 + 2.0), 0.035, metal('#c9ced6', 0.2))
cilindro((hx, hy, Z0 + 2.0), 0.09, 0.2, metal('#8a9099', 0.3))
render(out('Q03.5'), elev=22)

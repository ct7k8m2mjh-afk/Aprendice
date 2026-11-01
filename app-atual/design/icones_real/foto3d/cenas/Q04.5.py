import sys, os, math, random; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _qui import *
from mathutils import Euler
# Balanca de dois pratos em equilibrio: frasco fechado de um lado e pesos do outro -> conservacao da massa (Lavoisier)
cena_q()
mg = metal('#d4a52a', 0.2); mm = plastico('#5a3a22', 0.35)
torno([(0, 0), (1.0, 0), (1.05, 0.08), (0.95, 0.22), (0.4, 0.32), (0, 0.34)], mm, fechado=False)
cilindro((0, 0, 1.5), 0.08, 2.4, mg)
esfera((0, 0, 2.75), 0.14, mg)
bastao((-1.7, 0, 2.6), (1.7, 0, 2.6), 0.06, mg)
cone((0, 0, 2.95), 0.0, 0.1, 0.25, mg)
for sx in (-1, 1):
    esfera((1.7 * sx, 0, 2.6), 0.09, mg)
    for a in (0, 2.1, 4.2):
        bastao((1.7 * sx, 0, 2.6), (1.7 * sx + 0.6 * math.cos(a), 0.6 * math.sin(a), 1.2), 0.012, mg)
    torno([(0, 1.08), (0.6, 1.12), (0.68, 1.22), (0.62, 1.2), (0, 1.16)], mg, loc=(1.7 * sx, 0, 0))
# frasco fechado (erlenmeyer pequeno com rolha) no prato esquerdo
ext = [(0, 0), (0.42, 0), (0.45, 0.04), (0.14, 0.7), (0.13, 0.9)]
torno(parede(ext, 0.025), vidro(), loc=(-1.7, 0, 1.18))
faixa(ext, 0.025, 0.02, 0.28, liquido('#2e9e44'), loc=(-1.7, 0, 1.18))
cilindro((-1.7, 0, 2.12), 0.12, 0.18, fosco('#2b2b2b', 0.6))
# pesos dourados no prato direito
mw = metal('#c9ced6', 0.2)
for (x, y, r, h) in [(1.55, 0.1, 0.22, 0.32), (1.95, -0.12, 0.17, 0.24), (1.6, -0.25, 0.13, 0.18)]:
    cilindro((x, y, 1.18 + h / 2), r, h, mw, chanfro=0.03)
    cilindro((x, y, 1.18 + h + 0.05), r * 0.35, 0.1, mw, chanfro=0.02)
    esfera((x, y, 1.18 + h + 0.13), r * 0.45, mw)
render(out('Q04.5'), elev=18)

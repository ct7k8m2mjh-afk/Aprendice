import sys, os, math, random; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _qui import *
import _por
from mathutils import Euler
# Energia de ativacao e catalisador: duas "rampas" macicas com o perfil de energia da mesma reacao exotermica - sem catalisador
# (vermelha, atras, barreira alta) e com catalisador (verde, na frente, barreira menor); mesma energia de reagentes e de produtos.
# Bolinha azul = reagentes no inicio. Revisao 31/10 (2a rodada): antes eram tubos finos sobre uma base (grafico abstrato).
cena_q()
def perfil(Ea):
    pts = []
    for i in range(61):
        t = i / 60; x = -1.7 + 3.4 * t
        z = 0.15 + 0.95 * (1 - t) + 0.25 * t + Ea * math.exp(-((t - 0.5) / 0.16) ** 2)
        pts.append((x, z))
    return pts + [(1.7, 0.0), (-1.7, 0.0)]
for Ea, y, c in ((1.55, 0.3, '#d62828'), (0.6, -0.3, '#2e9e44')):
    o = _por.placa(perfil(Ea), 0.5, plastico(c, 0.3), chanfro=0.04)
    o.rotation_euler = (math.radians(90), 0, 0); o.location = (0, y + 0.25, 0)
z0 = 0.15 + 0.95
esfera((-1.5, -0.3, z0 + 0.2), 0.2, plastico('#1f5fd6', 0.2))
mk = plastico('#2b2f36', 0.35)
bastao((-1.95, 0.0, 0.0), (-1.95, 0.0, 2.6), 0.045, mk); cone((-1.95, 0.0, 2.72), 0.11, 0, 0.26, mk)
render(out('Q08.2'), elev=18, azim=-20)

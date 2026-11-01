import sys, os, math, random; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _qui import *
from mathutils import Euler
# Fissao nuclear: um neutron atinge o nucleo pesado, que se parte em dois fragmentos e libera 3 neutrons e energia
cena_q()
mp = plastico('#d62828', 0.22); mn = plastico('#a7adb4', 0.25)
def nucleo(c, n, r=0.24, seed=1):
    random.seed(seed); gold = math.pi * (3 - math.sqrt(5)); R = r * (n ** (1 / 3)) * 0.82
    for i in range(n):
        y = 1 - 2 * (i + 0.5) / n; rr = math.sqrt(1 - y * y); a = gold * i
        p = Vector((rr * math.cos(a), rr * math.sin(a), y)) * R * (0.6 + 0.4 * ((i * 7) % 5) / 4)
        esfera(tuple(Vector(c) + p), r, mp if random.random() < 0.45 else mn, seg=24)
# revisao 31/10: grupo compacto (cabe num quadrado) -> neutron chega de cima, os dois fragmentos se afastam na diagonal
C = Vector((0.0, 0.0, 1.75))
nucleo((-0.75, 0.1, 1.15), 40, r=0.27, seed=1)
nucleo((0.85, -0.1, 2.15), 30, r=0.27, seed=2)
esfera(tuple(C), 0.2, emissivo('#ffd24a', 14))
mnn = plastico('#8a9099', 0.25); mt = plastico('#d4a52a', 0.3)
esfera((-1.15, -0.1, 3.05), 0.27, mnn)
curva([Vector((-1.85, -0.15, 3.65)), Vector((-1.38, -0.12, 3.25))], 0.08, mt)
for (x, y, z) in [(1.95, -0.3, 1.05), (0.75, -0.4, 0.3), (2.05, 0.2, 3.25)]:
    esfera((x, y, z), 0.27, mnn)
    d = Vector((x, y, z)) - C; d.normalize()
    curva([Vector((x, y, z)) - d * 0.75, Vector((x, y, z)) - d * 0.33], 0.07, mt)
render(out('Q09.5'), elev=18, azim=-12)

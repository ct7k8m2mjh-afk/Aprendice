import sys, os, math, random; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _qui import *
from mathutils import Euler
# Raio atomico crescendo ao descer o grupo 1: Li 152, Na 186, K 227, Rb 248, Cs 265 pm (esferas na proporcao real)
cena_q()
raios = [152, 186, 227, 248, 265]
cores = ['#c9a0f0', '#a970e0', '#8c4fd0', '#7b2cbf', '#5f1f9a']
t = 0; dx, dy = math.cos(math.radians(38)), math.sin(math.radians(38))
for i, (rp, c) in enumerate(zip(raios, cores)):
    r = 0.55 * rp / 152
    t += r
    esfera((t * dx, t * dy, r), r, plastico(c, 0.2), seg=64)
    t += r + 0.12
render(out('Q01.5'), elev=22, azim=-12)

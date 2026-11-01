import sys, os, math, random; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _qui import *
from mathutils import Euler
# Piramide de atomos identicos (empacotamento: 10 + 6 + 3 + 1 = 20 esferas): contar particulas pela massa (mol, constante de Avogadro)
cena_q()
m = metal('#c87533', 0.22)
r = 0.5; d = 2 * r
camadas = 4
for k in range(camadas):
    n = camadas - k
    z = r + k * d * math.sqrt(2 / 3)
    ox = k * r; oy = k * r / math.sqrt(3)
    for i in range(n):
        for j in range(n - i):
            x = ox + j * d + i * r
            y = oy + i * d * math.sqrt(3) / 2
            esfera((x, y, z), r * 0.995, m, seg=48)
render(out('Q04.1'), elev=28, azim=-20)

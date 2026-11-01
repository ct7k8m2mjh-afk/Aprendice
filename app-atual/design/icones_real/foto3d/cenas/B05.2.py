# B05.2 transcricao/processamento: RNAm maduro de fita simples com quepe 5' (verde) e cauda poli-A
import sys; sys.path[:0] = ['/home/claude/escadas-sc/design/icones_real/foto3d', '/home/claude/escadas-sc/design/icones_real/foto3d/cenas']
from _bk import *
cena()
import random
esq = plastico('#f28c1a', .28)
cores = {'A': '#d62828', 'U': '#f2b705', 'G': '#2e9e44', 'C': '#1f5fd6'}
n = 40; pts = [(-2 + 4 * i / n, .0, 1 + .35 * math.sin(i / n * 6.283 * 1.2)) for i in range(n + 1)]
tubo(pts, .07, esq, tipo='NURBS')
seq = 'GAUGCUACGGAUCCAUUGCAAAAAAAA'
random.seed(2)
for k, b in enumerate(seq):
    i = 2 + round(k / (len(seq) - 1) * (n - 4)); p = V(pts[i])
    bastao(tuple(p), tuple(p + V((0, 0, -.45))), .055, plastico(cores[b], .3))
    esfera(p + V((0, 0, -.45)), .07, plastico(cores[b], .3), seg=24)
# quepe 5' (7-metilguanosina) na ponta
esfera(V(pts[0]) + V((-.12, 0, .05)), .2, plastico('#2e9e44', .3))
sai('B05.2', elev=20, azim=-25)

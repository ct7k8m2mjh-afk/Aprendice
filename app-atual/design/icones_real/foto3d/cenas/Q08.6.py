import sys, os, math, random; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _qui import *
from mathutils import Euler
# Indicador universal em tubos de ensaio: do vermelho (pH acido) ao verde (neutro) e ao violeta (pH basico)
cena_q()
cores = ['#d62828', '#f26a1b', '#f2b705', '#2e9e44', '#1f8fb8', '#1f5fd6', '#7b2cbf']
n = len(cores); dx = 0.62
mm = plastico('#b07a45', 0.5)
caixa(((n - 1) * dx / 2, 0, 0.45), (n * dx + 0.3, 0.7, 0.14), mm, chanfro=0.04)
caixa(((n - 1) * dx / 2, 0, 0.07), (n * dx + 0.3, 0.7, 0.14), mm, chanfro=0.04)
for x in (-0.25, (n - 1) * dx + 0.25):
    caixa((x, 0, 0.26), (0.12, 0.6, 0.4), mm, chanfro=0.03)
for i, c in enumerate(cores):
    tubo_ensaio(R=0.2, H=2.1, nivel=1.25, cor=c, loc=(i * dx, 0, 0.14))
render(out('Q08.6'), elev=24, azim=-14)

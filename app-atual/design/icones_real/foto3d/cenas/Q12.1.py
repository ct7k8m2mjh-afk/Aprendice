import sys, os, math, random; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _qui import *
from mathutils import Euler
# Agua de bromo laranja x descorada apos a reacao de adicao do Br2 a dupla ligacao do alceno
cena_q()
mm = plastico('#b07a45', 0.5)
caixa((0, 0, 0.22), (1.9, 0.8, 0.44), mm, chanfro=0.06)
tubo_ensaio(R=0.3, H=2.5, nivel=1.6, cor='#f7a531', loc=(-0.45, 0, 0.12))
tubo_ensaio(R=0.3, H=2.5, nivel=1.6, cor='#f4f7f2', loc=(0.45, 0, 0.12))
# conta-gotas sobre o tubo descorado
X = 0.45
bastao((X, 0, 2.95), (X, 0, 3.7), 0.05, vidro())
cone((X, 0, 2.82), 0.01, 0.05, 0.26, vidro())
torno([(0, 3.65), (0.11, 3.67), (0.15, 3.85), (0.16, 4.1), (0.09, 4.25), (0, 4.27)], plastico('#1a1a1a', 0.45), loc=(X, 0, 0), fechado=False)
render(out('Q12.1'), elev=22)

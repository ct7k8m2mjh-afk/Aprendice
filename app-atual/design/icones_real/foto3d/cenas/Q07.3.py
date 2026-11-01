import sys, os, math, random; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _qui import *
from mathutils import Euler
# Botijao de gas (GLP, propano + butano): combustivel, energia de ligacao e poder calorifico
cena_q()
mb = plastico('#1f5fd6', 0.3)
R = 1.0
torno([(0, 0.25), (0.8, 0.25), (0.95, 0.35), (R, 0.6), (R, 1.75), (0.95, 2.1), (0.75, 2.35), (0.4, 2.5), (0, 2.52)], mb, fechado=False)
# saia (base) e frisos
torno([(0.85, 0), (0.95, 0), (0.95, 0.42), (0.85, 0.42)], plastico('#174aa8', 0.35))
toro((0, 0, 1.15), R, 0.03, mb)
# alca (colarinho)
torno([(0.6, 2.35), (0.68, 2.35), (0.66, 3.0), (0.58, 3.0)], plastico('#174aa8', 0.35))
for a in (0, math.pi): pass
# valvula de latao
mv = metal('#c9a227', 0.25)
cilindro((0, 0, 2.62), 0.18, 0.25, mv)
cilindro((0, 0, 2.82), 0.12, 0.2, mv)
cilindro((0, 0, 2.97), 0.17, 0.08, mv)
render(out('Q07.3'), elev=24)

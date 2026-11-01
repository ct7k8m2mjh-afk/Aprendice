import sys, os, math, random; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _qui import *
from mathutils import Euler
# Frasco de alcool 70 % (porcentagem em massa / titulo): 70 g de etanol em 100 g de solucao
cena_q()
mw = plastico('#f3f6f8', 0.25)
R = 0.72; H = 2.2
torno([(0, 0), (R - 0.12, 0), (R, 0.12), (R, H), (R * 0.85, H + 0.25), (R * 0.42, H + 0.42), (R * 0.42, H + 0.55), (0, H + 0.55)], mw, fechado=False)
cilindro((0, 0, H + 0.68), R * 0.48, 0.32, plastico('#1f5fd6', 0.3), chanfro=0.03)
cilindro((0, 0, H + 0.88), R * 0.2, 0.12, plastico('#1f5fd6', 0.3), chanfro=0.02)
rotulo_cil(R + 0.004, 0.4, 1.45, ang_c=-92, arco=140, m=fosco('#1f5fd6', 0.45))
a = math.radians(-92)
texto('70%', ((R + 0.03) * math.cos(a), (R + 0.03) * math.sin(a), 1.12), 0.5, fosco('#ffffff', 0.4), rot=(math.radians(90), 0, a + math.pi / 2), extr=0.015, fonte=INTER)
render(out('Q05.4'), elev=20, azim=-5)

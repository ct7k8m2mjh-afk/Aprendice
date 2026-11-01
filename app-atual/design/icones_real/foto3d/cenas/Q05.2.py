import sys, os, math, random; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _qui import *
from mathutils import Euler
# Frasco de reagente com solucao 0,1 mol/L de sulfato de cobre: concentracao em quantidade de materia (mol/L) no rotulo
cena_q()
R = 0.75
frasco(R=R, H=1.7, tampa='#1f5fd6', liq='#1f6fe0', nivel=1.35)
rotulo_cil(R + 0.004, 0.32, 0.95, ang_c=-95, arco=125)
m = fosco('#1a1a1a', 0.5)
a = math.radians(-95)
texto('0,1 mol/L', ((R + 0.03) * math.cos(a), (R + 0.03) * math.sin(a), 0.92), 0.25, m, rot=(math.radians(90), 0, a + math.pi / 2), extr=0.01, fonte=INTER)
texto('CuSO₄', ((R + 0.03) * math.cos(a), (R + 0.03) * math.sin(a), 0.58), 0.25, fosco('#1f5fd6', 0.5), rot=(math.radians(90), 0, a + math.pi / 2), extr=0.01, fonte=INTER)
render(out('Q05.2'), elev=20, azim=-5)

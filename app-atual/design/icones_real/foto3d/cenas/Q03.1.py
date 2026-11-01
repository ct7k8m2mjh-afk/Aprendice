import sys, os, math, random; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _qui import *
from mathutils import Euler
# Frascos de reagente: acido cloridrico (HCl, vidro, tampa vermelha) e hidroxido de sodio (NaOH, frasco plastico branco, tampa azul)
cena_q()
# HCl
R = 0.62
objs, ext = frasco(R=R, H=1.55, tampa='#d62828', loc=(-0.75, 0.25, 0), liq='#f7f3d6', nivel=1.25)
rotulo_cil(R + 0.004, 0.35, 0.75, loc=(-0.75, 0.25, 0), ang_c=-100, arco=120)
texto('HCl', (-0.75 + (R + 0.03) * math.cos(math.radians(-100)), 0.25 + (R + 0.03) * math.sin(math.radians(-100)), 0.72), 0.36, fosco('#1a1a1a', 0.5), rot=(math.radians(90), 0, math.radians(-10)), extr=0.01, fonte=INTER)
# NaOH: frasco plastico branco (vidro e atacado por base forte)
mw = plastico('#f1f1ee', 0.4)
x, y = 0.75, -0.35; R2 = 0.6; H2 = 1.6
ext2 = [(0, 0), (R2 - 0.1, 0), (R2, 0.1), (R2, H2), (R2 * 0.8, H2 + 0.25), (R2 * 0.45, H2 + 0.35), (R2 * 0.45, H2 + 0.5)]
torno(ext2 + [(0, H2 + 0.5)], mw, loc=(x, y, 0), fechado=False)
cilindro((x, y, H2 + 0.6), R2 * 0.5, 0.3, plastico('#1f5fd6', 0.35), chanfro=0.03)
rotulo_cil(R2 + 0.004, 0.35, 0.75, loc=(x, y, 0), ang_c=-100, arco=120, m=fosco('#ffffff', 0.55))
faixa_cor = rotulo_cil(R2 + 0.012, 0.98, 0.12, loc=(x, y, 0), ang_c=-100, arco=120, m=fosco('#1f5fd6', 0.5))
faixa_cor2 = rotulo_cil(R + 0.012, 0.98, 0.12, loc=(-0.75, 0.25, 0), ang_c=-100, arco=120, m=fosco('#d62828', 0.5))
texto('NaOH', (x + (R2 + 0.03) * math.cos(math.radians(-100)), y + (R2 + 0.03) * math.sin(math.radians(-100)), 0.72), 0.3, fosco('#1a1a1a', 0.5), rot=(math.radians(90), 0, math.radians(-10)), extr=0.01, fonte=INTER)
render(out('Q03.1'), elev=22, azim=-10)

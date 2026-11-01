import sys, os, math, random; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _qui import *
from mathutils import Euler
# Pilha de Daniell: Zn em ZnSO4 (incolor) e Cu em CuSO4 (azul), ponte salina e voltimetro marcando 1,10 V; fio preto no Zn (-), vermelho no Cu (+)
cena_q()
XL, XR = -1.15, 1.15
bequer(R=0.72, H=1.45, nivel=1.0, cor='#e8f2f6', loc=(XL, 0, 0), grad=False, bico=False)
bequer(R=0.72, H=1.45, nivel=1.0, cor='#1f6fe0', loc=(XR, 0, 0), grad=False, bico=False)
caixa((XL - 0.15, 0.1, 1.2), (0.36, 0.05, 1.6), metal('#b9c0c6', 0.35), chanfro=0.015)
caixa((XR + 0.15, 0.1, 1.2), (0.36, 0.05, 1.6), metal('#c26a3a', 0.25), chanfro=0.015)
# ponte salina (tubo em U invertido com gel branco)
pts = [(XL + 0.2, -0.1, 0.55), (XL + 0.2, -0.1, 1.85), (0, -0.1, 2.25), (XR - 0.2, -0.1, 1.85), (XR - 0.2, -0.1, 0.55)]
pts = [Vector(p) for p in pts]
sp = [pts[0], Vector((XL + 0.2, -0.1, 1.7)), Vector((XL + 0.45, -0.1, 2.15)), Vector((0, -0.1, 2.25)), Vector((XR - 0.45, -0.1, 2.15)), Vector((XR - 0.2, -0.1, 1.7)), pts[-1]]
curva(sp, 0.13, vidro(), caps=True)
curva(sp, 0.1, fosco('#f4f1e8', 0.7), caps=True)
# voltimetro
caixa((0, 0.75, 2.75), (1.2, 0.4, 0.8), plastico('#f2b705', 0.3), chanfro=0.08)
caixa((0, 0.54, 2.85), (0.9, 0.04, 0.4), fosco('#1d2b1f', 0.4), chanfro=0.02)
texto('1,10 V', (0, 0.515, 2.85), 0.24, emissivo('#8af07a', 2.5), extr=0.005, fonte=INTER)
# fios
curva([Vector((XL - 0.15, 0.1, 2.0)), Vector((XL - 0.2, 0.3, 2.6)), Vector((-0.45, 0.6, 2.65)), Vector((-0.4, 0.62, 2.45))], 0.04, plastico('#222222', 0.35))
curva([Vector((XR + 0.15, 0.1, 2.0)), Vector((XR + 0.2, 0.3, 2.6)), Vector((0.45, 0.6, 2.65)), Vector((0.4, 0.62, 2.45))], 0.04, plastico('#d62828', 0.3))
render(out('Q09.1'), elev=22)

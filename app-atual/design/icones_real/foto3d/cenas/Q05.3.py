import sys, os, math, random; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _qui import *
from mathutils import Euler
# Pisseta (frasco lavador) e dois tubos: solucao concentrada (azul escuro) e a mesma solucao diluida (azul claro) -> diluicao
cena_q()
# tubos num suporte de madeira
mm = plastico('#b07a45', 0.5)
caixa((-0.2, 0.2, 0.2), (1.9, 0.75, 0.4), mm, chanfro=0.05)
for (x, c) in [(-0.6, '#0b3fa8'), (0.25, '#8cc4f5')]:
    o, e = tubo_ensaio(R=0.27, H=2.4, nivel=1.55, cor=c, loc=(x, 0.2, 0.1))
# pisseta (plastico branco translucido) com bico curvo
mw = plastico('#d9dde2', 0.3)
X, Y = 1.55, -0.45
torno([(0, 0), (0.48, 0), (0.55, 0.06), (0.58, 0.2), (0.58, 1.5), (0.45, 1.75), (0.22, 1.85), (0.22, 2.0), (0, 2.0)], mw, loc=(X, Y, 0), fechado=False)
cilindro((X, Y, 2.08), 0.26, 0.2, plastico('#d62828', 0.35))
pts = [Vector((X, Y, 2.15)), Vector((X, Y, 2.55)), Vector((X - 0.25, Y, 2.8)), Vector((X - 0.75, Y + 0.1, 2.75))]
curva(pts, 0.045, plastico('#cfd4da', 0.3))
render(out('Q05.3'), elev=24)

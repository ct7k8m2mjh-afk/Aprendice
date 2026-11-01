# B03.1 respiracao/glicolise: molecula de alfa-D-glicose na projecao de Haworth (combustivel da glicolise)
import sys; sys.path[:0] = ['/home/claude/escadas-sc/design/icones_real/foto3d', '/home/claude/escadas-sc/design/icones_real/foto3d/cenas']
from _bk import *
cena()
import random
C = plastico('#1e1e22', .25); O = plastico('#d62828', .25); Hm = plastico('#f2f2f2', .3); lg = plastico('#b9bec6', .3)
R = .9
ang = {'O5': 30, 'C1': -30, 'C2': -90, 'C3': -150, 'C4': 150, 'C5': 90}
pos = {k: V((R * math.cos(math.radians(a)), R * math.sin(math.radians(a)), 1.0)) for k, a in ang.items()}
ordem = ['O5', 'C1', 'C2', 'C3', 'C4', 'C5', 'O5']
for a, b in zip(ordem, ordem[1:]): bastao(tuple(pos[a]), tuple(pos[b]), .07, lg)
for k, p in pos.items(): esfera(p, .24 if k[0] == 'C' else .27, O if k[0] == 'O' else C)
def oh(c, s):  # hidroxila para cima (s=1) ou para baixo (s=-1)
    p = pos[c]; o = p + V((0, 0, .75 * s)); h = o + V((p.x * .35, p.y * .35, .2 * s))
    bastao(tuple(p), tuple(o), .06, lg); bastao(tuple(o), tuple(h), .05, lg); esfera(o, .23, O); esfera(h, .15, Hm)
oh('C1', -1); oh('C2', -1); oh('C3', 1); oh('C4', -1)
# C5: CH2OH para cima
c6 = pos['C5'] + V((0, .1, .8)); o6 = c6 + V((.55, .25, .35)); h6 = o6 + V((.3, -.1, .25))
for a, b, r in ((pos['C5'], c6, .06), (c6, o6, .06), (o6, h6, .05)): bastao(tuple(a), tuple(b), r, lg)
esfera(c6, .24, C); esfera(o6, .23, O); esfera(h6, .15, Hm)
sai('B03.1', elev=24, azim=-10)

# B11.4 Hardy-Weinberg: (p + q)^2 = p^2 + 2pq + q^2 em azulejos de area proporcional (p = 0,6; q = 0,4)
import sys; sys.path[:0] = ['/home/claude/escadas-sc/design/icones_real/foto3d', '/home/claude/escadas-sc/design/icones_real/foto3d/cenas']
from _bk import *
cena()
import random
FN = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
S = 2.4; p = .6; g = .04
esc = plastico('#ffffff', .3)
def az(x0, y0, w, h, c, txt):
    caixa((x0 + w / 2, y0 - h / 2, .15), (w - g, h - g, .3), plastico(c, .28), chanfro=.05)
    texto(txt, (x0 + w / 2, y0 - h / 2, .31), .5, esc, rot=(0, 0, 0), extr=.02, fonte=FN)
x0, y0 = -S / 2, S / 2
az(x0, y0, S * p, S * p, '#1f5fd6', 'p²')
az(x0 + S * p, y0, S * (1 - p), S * p, '#7b2cbf', 'pq')
az(x0, y0 - S * p, S * p, S * (1 - p), '#7b2cbf', 'pq')
az(x0 + S * p, y0 - S * p, S * (1 - p), S * (1 - p), '#d62828', 'q²')
sai('B11.4', elev=60, azim=0)

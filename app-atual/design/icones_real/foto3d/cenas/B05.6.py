# B05.6 biotecnologia: gel de eletroforese com pocos e bandas de DNA separadas por tamanho, e microtubo de PCR
import sys; sys.path[:0] = ['/home/claude/escadas-sc/design/icones_real/foto3d', '/home/claude/escadas-sc/design/icones_real/foto3d/cenas']
from _bk import *
cena()
import random
gel = translucido('#cfe3f5', .45, .1); banda = emissivo('#3d8bff', 2.5); poco = plastico('#9aa7b8', .4)
g = caixa((0, 0, .12), (2.2, 1.6, .24), gel, chanfro=.03)
lanes = [-.8, -.4, 0, .4, .8]
random.seed(9)
for k, x in enumerate(lanes):
    caixa((x, .65, .2), (.25, .08, .1), poco, chanfro=.01)
    ys = [.3, .1, -.15, -.45] if k == 0 else sorted(random.sample([.35, .2, .05, -.1, -.25, -.4, -.55], 3), reverse=True)
    for y in ys:
        caixa((x, y, .245), (.26, .06, .02), banda, chanfro=.008)
# microtubo de PCR
mt = translucido('#fff3d9', .45, .12)
c = cilindro((1.55, -.35, .62), .16, .55, mt, chanfro=.01); cone((1.55, -.35, .2), .02, .16, .3, mt)
cilindro((1.55, -.35, .93), .19, .07, plastico('#d62828', .3))
tubo([(1.72, -.35, .92), (1.82, -.35, 1.05), (1.75, -.35, 1.18)], .03, plastico('#d62828', .3))
cilindro((1.62, -.38, 1.2), .17, .06, plastico('#d62828', .3), rot=(0, math.radians(-30), 0))
liq = cilindro((1.55, -.35, .5), .14, .2, liquido('#7fb8ff'), chanfro=0)
sai('B05.6', elev=40)

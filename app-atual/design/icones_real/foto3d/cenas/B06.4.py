# B06.4 sistema ABO e Rh: bolsa de sangue com etiqueta do tipo sanguineo (A Rh+)
import sys; sys.path[:0] = ['/home/claude/escadas-sc/design/icones_real/foto3d', '/home/claude/escadas-sc/design/icones_real/foto3d/cenas']
from _bk import *
cena()
import random
FN = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
bol = translucido('#c4161c', .75, .15); pl = vidro('#f5f9ff', .05); etq = plastico('#ffffff', .4); esc = plastico('#c4161c', .3)
b = caixa((0, 0, 1.2), (1.4, .38, 1.9), bol, chanfro=.18); subdiv(b, 2)
for p in b.data.polygons: p.use_smooth = True
# solda/borda superior e furos
caixa((0, 0, 2.22), (1.3, .08, .22), pl, chanfro=.03)
for x in (-.4, .4): toro((x, 0, 2.25), .08, .025, plastico('#dcdcdc', .3)).rotation_euler = (math.pi / 2, 0, 0)
# tubo saindo por baixo
tubo([(.3, 0, .27), (.35, 0, .05), (.7, -.1, -.05), (1.1, -.2, .1)], .05, translucido('#b0141a', .6, .1))
caixa((0, -.2, 1.15), (.95, .02, .85), etq, chanfro=.01)
texto('A', (-.1, -.225, 1.22), .55, esc, extr=.02, fonte=FN)
texto('+', (.28, -.225, 1.35), .35, esc, extr=.02, fonte=FN)
texto('Rh', (0, -.225, .88), .2, plastico('#3a3f48', .3), extr=.01, fonte=FN)
sai('B06.4', elev=12, azim=-18)

# B05.5 diferenciacao celular: celula-tronco (redonda, nucleo grande) e celulas especializadas que dela derivam com o mesmo
# DNA mas genes diferentes ligados: neuronio, hemacia e fibra muscular lisa. Revisao 31/10 (segunda lente).
import sys; sys.path[:0] = ['/home/claude/escadas-sc/design/icones_real/foto3d', '/home/claude/escadas-sc/design/icones_real/foto3d/cenas']
from _bio2 import *
cena(); random.seed(5)
tr = org('#9fd8e8', '#b8e6f0', cav='#2a6a7a', sss=.3, rugos=.3, coat=.6, bump=.2, esc=5, ao=.1)
tr.node_tree.nodes['Principled BSDF'].inputs['Transmission Weight'].default_value = .4
nt = org('#2f5fc4', '#4a74d8', cav='#0a1a4a', sss=.3, rugos=.3, coat=.55, bump=.3, esc=8)
hm = org('#c0262b', '#d63a36', cav='#4a0507', sss=.35, rugos=.28, coat=.55, bump=.05, esc=3, ao=.2)
nr = org('#f2a541', '#f7b955', cav='#6a3a08', sss=.35, rugos=.3, coat=.55, bump=.2, esc=6)
ml = org('#e8848c', '#dc6c78', cav='#5a1520', sss=.4, rugos=.3, coat=.5, bump=.2, esc=6)
nn = org('#7b2cbf', '#8a3ad0', cav='#200840', sss=.3, rugos=.3, coat=.55, bump=.2, esc=8)
# celula-tronco ao centro, atras
st = esfera((0, .6, .85), .85, tr, seg=96); desloca(st, .03, .3)
esfera((0, .25, .95), .5, nt, seg=64)
# hemacia (esquerda frente)
hemacia((-1.35, -.55, .45), .6, hm, rot=(math.radians(14), math.radians(8), math.radians(20)))
# neuronio (direita frente): corpo + dendritos + axonio
C = V((1.35, -.4, .55))
blob([('BALL', tuple(C), .32), ('BALL', tuple(C + V((.15, 0, .1))), .22)], nr, res=.015)
esfera(C + V((-.05, -.24, .05)), .11, nn, seg=24)
for k in range(5):
    a = math.radians(40 + k * 55); d = V((math.cos(a), -.2, math.sin(a))).normalized()
    tubo([tuple(C + d * .2), tuple(C + d * .45 + V((0, 0, .05))), tuple(C + d * .7)], .05, nr, raios=[1, .7, .3])
tubo([tuple(C + V((.2, .1, -.2))), (1.8, .1, .25), (2.1, .4, .2)], .045, nr)
# fibra muscular lisa (fusiforme, nucleo central) na frente-centro
pts = [(-.85, -1.15, .3), (0, -1.25, .34), (.85, -1.15, .3)]
f = tubo(pts, .26, ml, raios=[.1, 1, .1]); 
n_ = esfera((0, -1.42, .38), 1, nn, seg=32); escala(n_, (.28, .09, .09))
chao_auto()
sai('B05.5', elev=26, azim=-10)

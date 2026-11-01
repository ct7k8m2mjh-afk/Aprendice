# B06.3 heredograma: pais normais (quadrado = homem, circulo = mulher, simbolo vazio = nao afetado) com filha afetada
# (simbolo cheio) e filho normal: heranca autossomica recessiva (pais heterozigotos Aa). Pecas de porcelana em pe.
# Revisao 31/10 (segunda lente).
import sys; sys.path[:0] = ['/home/claude/escadas-sc/design/icones_real/foto3d', '/home/claude/escadas-sc/design/icones_real/foto3d/cenas']
from _bio2 import *
cena()
cla = org('#f6f4ef', '#ebe7de', cav='#7a7468', sss=.2, rugos=.18, coat=.7, bump=0, esc=3, ao=.15)
che = org('#6a2cc0', '#7b3ad0', cav='#1a0640', sss=.15, rugos=.18, coat=.7, bump=0, esc=3, ao=.15)
lin = metal('#c9a227', .25)
base = org('#2e3440', '#3a4150', cav='#0a0c10', sss=0, rugos=.3, coat=.5, bump=0)
R90 = (math.radians(90), 0, 0)
def quad(x, z, m): return caixa((x, 0, z), (.72, .26, .72), m, chanfro=.1)
def circ(x, z, m): return cilindro((x, 0, z), .38, .26, m, rot=R90, chanfro=.09)
zP, zF = 2.2, .62
quad(-1.05, zP, cla); circ(1.05, zP, cla)
bastao((-.68, 0, zP), (.66, 0, zP), .045, lin)
bastao((0, 0, zP), (0, 0, 1.45), .045, lin)
bastao((-.85, 0, 1.45), (.85, 0, 1.45), .045, lin)
for x in (-.85, .85): bastao((x, 0, 1.45), (x, 0, zF + .38), .045, lin)
quad(-.85, zF, cla); circ(.85, zF, che)
caixa((0, 0, .1), (3.0, .9, .2), base, chanfro=.06)
chao_auto()
sai('B06.3', elev=18, azim=-18)

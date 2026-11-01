# B08.6 imunidade adaptativa: anticorpo IgG em Y feito de dominios globulares de imunoglobulina (2 cadeias pesadas azuis com
# 4 dominios cada, 2 cadeias leves laranja com 2 dominios cada, regiao de dobradica) prendendo antigenos nas pontas variaveis.
# Revisao 31/10 (2a rodada).
import sys; sys.path[:0] = ['/home/claude/escadas-sc/design/icones_real/foto3d', '/home/claude/escadas-sc/design/icones_real/foto3d/cenas']
from _bio2 import *
cena(); random.seed(4)
pes = [org('#2f5fd0', '#4a78e0', cav='#0a1650', sss=.3, rugos=.3, coat=.55, bump=.5, esc=8, ao=.06, bump_esc=30),
       org('#3a70e0', '#5a88ea', cav='#0a1650', sss=.3, rugos=.3, coat=.55, bump=.5, esc=8, ao=.06, bump_esc=30)]
lev = org('#f28c1a', '#f6a23a', cav='#5a2a00', sss=.3, rugos=.3, coat=.55, bump=.5, esc=8, ao=.06, bump_esc=30)
ant = org('#2e9e44', '#46b25a', cav='#0a3010', sss=.3, rugos=.35, coat=.5, bump=.8, esc=8, ao=.08, bump_esc=20)
dob = org('#9ab0e0', '#aabce8', cav='#2a3a6a', sss=.3, rugos=.3, coat=.5, bump=.1)
def dom(p, m, r=.24, alon=1.35, eixo=V((0, 0, 1))):
    o = esfera((0, 0, 0), 1, m, seg=48); escala(o, (r, r * .9, r * alon))
    desloca(o, .03, .06, sub=1)
    o.location = p; o.rotation_euler = eixo.to_track_quat('Z', 'Y').to_euler(); return o
# Fc: 2 x 2 dominios pesados (CH2, CH3) lado a lado, embaixo
for s in (-1, 1):
    dom(V((s * .21, 0, .35)), pes[(s + 1) // 2]); dom(V((s * .21, 0, .95)), pes[(s + 1) // 2])
# dobradica
for s in (-1, 1): tubo([(s * .15, 0, 1.25), (s * .25, 0, 1.45), (s * .4, 0, 1.55)], .045, dob)
# bracos Fab: pesada (CH1, VH) por dentro, leve (CL, VL) por fora
for s in (-1, 1):
    d = V((s * .62, 0, .78)).normalized(); n = V((s * .78, 0, -.62)).normalized() * -1
    base = V((s * .55, 0, 1.7))
    for j, mm in enumerate((pes[(s + 1) // 2], pes[(s + 1) // 2])):
        dom(base + d * (j * .62), mm, eixo=d)
    for j in range(2):
        dom(base + d * (j * .62) + V((s * .36, 0, -.22)), lev, eixo=d)
    tip = base + d * .95 + V((s * .2, 0, -.1))
    a = esfera(tuple(tip + d * .25), .22, ant, seg=48); desloca(a, .04, .08, sub=1)
chao_auto()
sai('B08.6', elev=10, azim=-8, tam=560)

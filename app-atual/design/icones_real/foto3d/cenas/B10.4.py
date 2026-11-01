# B10.4 verminoses: Ascaris lumbricoides (lombriga) adulta: verme cilindrico, longo, afilado nas duas pontas, branco-rosado
# e com cuticula brilhante finamente estriada. Revisao 31/10 (segunda lente).
import sys; sys.path[:0] = ['/home/claude/escadas-sc/design/icones_real/foto3d', '/home/claude/escadas-sc/design/icones_real/foto3d/cenas']
from _bio2 import *
cena()
pele_ = org('#f2c9b8', '#e9b2a2', cav='#8a4a3a', sss=.5, rugos=.25, coat=.7, bump=.25, esc=3, ao=.1, bump_esc=70, raio=(1, .5, .4))
pts = []; rs = []
N = 40
N = 60
for i in range(N + 1):
    t = i / N
    if t < .55:
        u = t / .55; x = -1.5 + u * 2.4; y = -.35 + .5 * math.sin(u * 3.0); z = .26
    else:
        u = (t - .55) / .45; a_ = u * 1.6 * math.pi
        x = .9 + .55 * math.sin(a_); y = .15 + .55 * (1 - math.cos(a_)) * .8; z = .26 + .32 * math.sin(min(1, u * 1.4) * math.pi) * (u < .72)
    pts.append((x, y, z)); rs.append(max(.12, min(1, math.sin(t * math.pi) ** .3)))
w = tubo(pts, .26, pele_, raios=rs, tipo='NURBS')
o = malha(w)
gn_sulcos(o, .008, 60, .5, warp=.0, warp_esc=1, tipo='onda', eixo='X', sub=0)
chao_auto()
sai('B10.4', elev=36, azim=-12, tam=560)

# B08.5 hormonios: glandula tireoide (dois lobos ligados pelo istmo) abracando a traqueia logo abaixo da cartilagem
# tireoide da laringe. Revisao 31/10 (segunda lente): tecido glandular lobulado, aneis de cartilagem, vasos.
import sys; sys.path[:0] = ['/home/claude/escadas-sc/design/icones_real/foto3d', '/home/claude/escadas-sc/design/icones_real/foto3d/cenas']
from _bio2 import *
cena()
gl = org('#9c1f2b', '#b93a3c', cav='#3a0508', sss=.3, rugos=.3, coat=.55, bump=.7, esc=7, ao=.12, bump_esc=26)
lam = org('#e6e9ea', '#d6dcdf', cav='#6a7378', sss=.4, rugos=.3, coat=.5, bump=.1, esc=5, ao=.12)
car = org('#efe2d0', '#e3cdb4', cav='#8a6a55', sss=.4, rugos=.35, coat=.4, bump=.15, esc=5, ao=.1)
mem = org('#e7b9ad', '#dca395', cav='#7a4038', sss=.4, rugos=.4, coat=.3, bump=.1, esc=5)
art = org('#d32f2f', '#e85b4a', cav='#5a0a0a', sss=.25, rugos=.3, coat=.5, bump=.05, esc=3)
vei = org('#2b55b8', '#3a6fd0', cav='#0c1d4a', sss=.25, rugos=.3, coat=.5, bump=.05, esc=3)
# traqueia: tubo membranoso + aneis de cartilagem
cilindro((0, 0, .95), .36, 1.9, mem, chanfro=0)
for i in range(10):
    t = toro((0, 0, .1 + i * .17), .365, .045, car); escala(t, (1, 1, 1.3))
# cartilagem cricoide no topo (anel completo, mais alto)
cilindro((0, 0, 1.95), .41, .2, car, chanfro=.06)
# tireoide: dois lobos (forma de borboleta) unidos pelo istmo na frente dos aneis 2-4
th = []
for s_ in (-1, 1):
    l = esfera((0, 0, 0), .5, gl, seg=64); escala(l, (.6, .48, 1.25)); l.location = (s_ * .44, -.27, 1.3)
    l.rotation_euler = (math.radians(6), math.radians(-s_ * 12), math.radians(s_ * 18)); th.append(l)
    desloca(l, .02, .1, sub=1)
ist = tubo([(-.38, -.38, .98), (0, -.47, .95), (.38, -.38, .98)], .16, gl); ist.scale = (1, 1, 1)
# vasos sobre a glandula: arteria tireoidea superior chegando ao polo superior, veias tireoideas inferiores saindo do istmo
for s_ in (-1, 1):
    tubo([(s_ * .3, -.3, 2.25), (s_ * .42, -.42, 2.0), (s_ * .5, -.48, 1.8)], .04, art)
    tubo([(s_ * .12, -.5, .9), (s_ * .14, -.48, .55), (s_ * .16, -.42, .2)], .045, vei)
chao_auto()
sai('B08.5', elev=20, azim=-22)

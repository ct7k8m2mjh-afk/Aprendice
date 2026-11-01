# B07.3 ventilacao: pulmoes em vista anterior (direito com 3 lobos e 2 fissuras; esquerdo com 2 lobos e a incisura cardiaca),
# traqueia com aneis de cartilagem e bronquios principais. Revisao 31/10 (segunda lente): tecido esponjoso, volume.
import sys; sys.path[:0] = ['/home/claude/escadas-sc/design/icones_real/foto3d', '/home/claude/escadas-sc/design/icones_real/foto3d/cenas']
from _bio2 import *
cena()
pul = org('#e6828a', '#d1606c', cav='#5a1520', sss=.35, rugos=.38, coat=.45, bump=.35, esc=5, ao=.12, bump_esc=40, mix=.8)
car = org('#f1e6d6', '#e3d2bc', cav='#8a6a50', sss=.35, rugos=.35, coat=.4, bump=.1, esc=5)
def pulmao(s):
    el = [('ELLIPSOID', (s * .85, 0, 1.15), 1.0, (.7, .6, 1.05)), ('ELLIPSOID', (s * .95, .05, .5), 1.05, (.9, .7, .55)),
          ('ELLIPSOID', (s * .7, 0, 1.75), .7, (.55, .48, .6)), ('ELLIPSOID', (s * 1.05, .1, .9), .8, (.6, .6, .9))]
    o = blob(el, pul, res=.025, thr=.6)
    c = caixa((s * -.05, 0, 1.1), (.5, 3, 4), None, chanfro=0); dif(o, c)          # face medial
    b_ = esfera((s * .9, 0, -.55), 1.0, None); escala(b_, (1.3, 1.2, .8)); dif(o, b_)  # base concava (cupula do diafragma)
    return o
D = pulmao(-1); E = pulmao(1)
# incisura cardiaca no esquerdo
h = esfera((.3, -.45, .6), .5, None); escala(h, (1, 1.4, 1.1)); dif(E, h)
# fissuras: cortes finos
def fissura(o, loc, rot, w=.035):
    c = caixa(loc, (2.2, 2.2, w), None, chanfro=0, rot=rot); dif(o, c)
fissura(D, (-.95, -.2, 1.0), (math.radians(12), math.radians(-28), 0))   # obliqua
fissura(D, (-1.2, -.5, 1.2), (0, math.radians(4), 0), w=.03)             # horizontal (so na frente/lateral)
fissura(E, (.95, -.2, 1.0), (math.radians(12), math.radians(28), 0))     # obliqua
for o in (D, E): suave_mod(o, 1)
# traqueia + bronquios
cilindro((0, 0, 2.2), .16, .8, car, chanfro=.02)
for i in range(6): toro((0, 0, 1.9 + i * .12), .165, .03, car)
tubo([(0, 0, 1.82), (-.25, 0, 1.6), (-.55, .05, 1.42)], .12, car)
tubo([(0, 0, 1.82), (.22, 0, 1.62), (.5, .05, 1.48)], .115, car)
chao_auto()
sai('B07.3', elev=14, azim=-8)

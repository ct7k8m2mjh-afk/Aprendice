# B08.4 eixo hipotalamo-hipofise: encefalo em vista lateral (giros e sulcos do cerebro, cerebelo com folhas, tronco
# encefalico) com a hipofise destacada pendurada pelo infundibulo sob o hipotalamo (adeno-hipofise avermelhada
# na frente, neuro-hipofise clara atras). Revisao 31/10 (segunda lente).
import sys; sys.path[:0] = ['/home/claude/escadas-sc/design/icones_real/foto3d', '/home/claude/escadas-sc/design/icones_real/foto3d/cenas']
from _bio2 import *
cena()
cer = org('#eb9f8c', '#de8a78', cav='#8a3a2a', sss=.35, rugos=.35, coat=.45, bump=.15, esc=5, ao=.1, cav_forca=.7)
cbl = org('#e29e88', '#d68b76', cav='#6a2c20', sss=.35, rugos=.35, coat=.4, bump=.1, esc=5, ao=.06, cav_forca=.9)
tro = org('#e8b29c', '#dca08a', cav='#7a3a2c', sss=.35, rugos=.35, coat=.4, bump=.1, esc=4)
ade = org('#c8283c', '#d9455a', cav='#4a0510', sss=.3, rugos=.3, coat=.6, bump=.2, esc=8)
neu = org('#f6dcc8', '#ecc8b0', cav='#8a5a40', sss=.4, rugos=.3, coat=.6, bump=.1, esc=6)
# cerebro: lobos por metaballs (frontal, parietal, occipital, temporal) + giros e sulcos (textura marmore)
c = blob([('ELLIPSOID', (-.45, 0, 1.4), 1.0, (1.0, .9, .85)), ('ELLIPSOID', (.25, 0, 1.55), 1.0, (1.1, .95, .8)),
          ('ELLIPSOID', (.8, 0, 1.25), .85, (1.0, .85, .8)), ('ELLIPSOID', (-.05, -.05, .95), .85, (1.3, .8, .6))], cer, res=.03, thr=.6)
gn_sulcos(c, .075, 4.6, .085, warp=.3, warp_esc=1.8, tipo='ruga', sub=3)
# sulco lateral (fissura de Sylvius) sugerido pela juncao do lobo temporal
# cerebelo com folhas horizontais, sob o lobo occipital
b = esfera((.95, .05, .62), .5, cbl, seg=96); escala(b, (1.0, 1.25, .62))
gn_sulcos(b, .03, 11.0, .4, warp=.12, warp_esc=2.5, tipo='onda', eixo='Z', sub=3)
# tronco encefalico
tubo([(.35, .05, .85), (.5, .05, .45), (.62, .05, -.05)], .2, tro, raios=[1.3, 1, .85])
# infundibulo + hipofise (adeno na frente = -x, neuro atras)
tubo([(-.12, -.05, .8), (-.15, -.1, .68), (-.18, -.14, .6)], .06, neu)
a_ = esfera((0, 0, 0), 1, ade, seg=48); escala(a_, (.16, .14, .12)); a_.location = (-.3, -.18, .5)
n_ = esfera((0, 0, 0), 1, neu, seg=48); escala(n_, (.11, .11, .1)); n_.location = (-.1, -.17, .52)
chao_auto()
sai('B08.4', elev=12, azim=-14, tam=560)

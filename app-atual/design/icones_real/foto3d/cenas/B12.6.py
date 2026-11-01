# B12.6 vertebrados: segmento de coluna vertebral (3 vertebras com corpo, arco vertebral, processo espinhoso e processos
# transversos, discos intervertebrais e a medula espinal passando pelo canal vertebral): a coluna que da nome ao grupo.
# Revisao 31/10: substitui a foto da perereca por render 3D.
import sys; sys.path[:0] = ['/home/claude/escadas-sc/design/icones_real/foto3d', '/home/claude/escadas-sc/design/icones_real/foto3d/cenas']
from _bio2 import *
cena()
os_ = org('#e2c28a', '#c09058', cav='#4a2a0c', sss=.15, rugos=.42, coat=.25, bump=.45, esc=6, ao=.18, cav_forca=.9)
dsc = org('#a9cbe0', '#8db7d2', cav='#2a4a6a', sss=.4, rugos=.3, coat=.5, bump=.1, esc=6)
med = org('#f2d27a', '#e8bf55', cav='#7a5a10', sss=.35, rugos=.35, coat=.4, bump=.1, esc=4)
def vertebra(z):
    o = []
    c = cilindro((0, 0, z), .46, .44, os_, chanfro=.08, vert=64); escala(c, (1.15, 1, 1)); o.append(c)
    desloca(c, .015, .2, sub=1)
    # arco vertebral (pediculos + laminas) atras do corpo, em volta do canal
    a = toro((0, .7, z + .02), .27, .1, os_); escala(a, (1.15, 1.0, 1.6)); o.append(a)
    # processo espinhoso para tras e para baixo
    sp = tubo([(0, .9, z + .02), (0, 1.25, z - .1), (0, 1.62, z - .32)], .17, os_, raios=[1.2, 1.0, .75]); sp.scale = (.45, 1, 1); o.append(sp)
    # processos transversos
    for s in (-1, 1):
        o.append(tubo([(s * .28, .7, z + .02), (s * .6, .78, z + .04), (s * .85, .9, z)], .08, os_, raios=[1.2, 1, .9]))
        o.append(tubo([(s * .2, .65, z + .18), (s * .26, .68, z + .32)], .06, os_))  # processos articulares superiores
    return o
for i, z in enumerate((.3, 1.0, 1.7)):
    vertebra(z)
    if i < 2: d_ = cilindro((0, 0, z + .35), .45, .26, dsc, chanfro=.06, vert=64); escala(d_, (1.15, 1, 1))
# medula espinal pelo canal
tubo([(0, .7, -.1), (0, .7, 1.0), (0, .7, 2.1)], .16, med)
for o in bpy.context.scene.objects:
    if o.name != 'CHAO' and o.type in ('MESH', 'CURVE'):
        o.matrix_world = mathutils.Matrix.Rotation(math.radians(-80), 4, 'Z') @ o.matrix_world
chao_auto()
sai('B12.6', elev=24, azim=-10)

# B08.7 clivagem: embriao no estagio de morula (blastomeros dentro da zona pelucida) apos a fecundacao
import sys; sys.path[:0] = ['/home/claude/escadas-sc/design/icones_real/foto3d', '/home/claude/escadas-sc/design/icones_real/foto3d/cenas']
from _bio2 import *
pele = pele_org; plastico = plast_org
cena()
import random
FN = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
zp = org('#b8acea', '#a89ae4', cav='#5a5090', sss=.4, rugos=.3, coat=.55, bump=.2, esc=8, ao=.1); bl = pele('#f0a08a', .3, .3, (1, .45, .35)); nuc = plastico('#9a5bd6', .3)
z_ = esfera((0, 0, 1), 1.0, zp); i_ = esfera((0, 0, 1), .9, None); dif(z_, i_)
bpy.ops.mesh.primitive_cube_add(size=2.2, location=(.25, -1.25, 1.95)); dif(z_, bpy.context.object)
random.seed(8)
g = math.pi * (3 - math.sqrt(5)); N = 16
for k in range(N):
    z = 1 - 2 * (k + .5) / N; r = math.sqrt(1 - z * z); t = g * k
    n = V((r * math.cos(t), r * math.sin(t), z))
    o = esfera(V((0, 0, 1)) + n * .5, .36, bl, seg=48); desloca(o, .02, .2)
    esfera(V((0, 0, 1)) + n * .78, .1, nuc, seg=24)
sai('B08.7', elev=26, azim=-16)

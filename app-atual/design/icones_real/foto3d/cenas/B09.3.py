# B09.3 ciclos biogeoquimicos: terrario fechado, em que agua, carbono e nutrientes circulam entre planta, solo e ar
import sys; sys.path[:0] = ['/home/claude/escadas-sc/design/icones_real/foto3d', '/home/claude/escadas-sc/design/icones_real/foto3d/cenas']
from _bk import *
cena()
import random
FN = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
vid = vidro('#f2f8ff'); ter = fosco('#5b3a22', .9); are = fosco('#c9a36b', .8); ped = plastico('#8d8f94', .5); fo = fosco('#2e8b3e', .6); ca = plastico('#3d7a2a', .4)
o = esfera((0, 0, 1.2), 1.0, vid); escala(o, (1, 1, 1.15)); i = esfera((0, 0, 1.2), .95, None); escala(i, (1, 1, 1.1)); dif(o, i)
bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, -.1)); b = bpy.context.object; b.scale = (3, 3, .6); dif(o, b)
cilindro((0, 0, 2.38), .45, .3, plastico('#8a5a33', .45), chanfro=.04)
cilindro((0, 0, .32), .82, .1, ped, chanfro=.03)
cilindro((0, 0, .44), .86, .14, are, chanfro=.03)
s = cilindro((0, 0, .62), .9, .24, ter, chanfro=.05); desloca(s, .03, .2)
random.seed(1)
for k in range(7):
    a = k / 7 * 6.283 + .4; h = 1.05 + .12 * (k % 3)
    tubo([(0, 0, .7), (.08 * math.cos(a), .08 * math.sin(a), .95), (.22 * math.cos(a), .22 * math.sin(a), h)], .022, ca)
    bpy.ops.mesh.primitive_uv_sphere_add(radius=.28, segments=32, ring_count=16, location=(0, 0, 0)); f = bpy.context.object; f.data.materials.append(fo)
    [setattr(pp, 'use_smooth', True) for pp in f.data.polygons]
    f.scale = (1, .38, .05); f.location = (.42 * math.cos(a), .42 * math.sin(a), h + .1); f.rotation_euler = (0, math.radians(-35), a)
for (x, y) in ((-.5, -.3), (.45, -.35)):
    esfera((x, y, .78), .14, ped, seg=32)
# gotas condensadas no vidro
for (x, z) in ((-.6, 1.7), (-.5, 1.45), (.65, 1.6), (.4, 1.9), (-.3, 1.95)):
    esfera((x, -math.sqrt(max(0, .93 - x * x - ((z - 1.2) / 1.1) ** 2 * .9)), z), .04, vidro('#ffffff'), seg=16)
sai('B09.3', elev=18)

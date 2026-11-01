# B02.5 acidos nucleicos/ATP: modelo de nucleotideo (grupo fosfato PO4 + pentose + base nitrogenada purica - adenina)
import sys; sys.path[:0] = ['/home/claude/escadas-sc/design/icones_real/foto3d', '/home/claude/escadas-sc/design/icones_real/foto3d/cenas']
from _bk import *
cena()
fos = plastico('#f28c1a', .25); ox = plastico('#d62828', .25); pen = plastico('#b58be8', .3); base = plastico('#2f6fdc', .28); lig = plastico('#c9ced6', .3)
def poligono(n, loc, r, h, m, rot=0):
    bpy.ops.mesh.primitive_cylinder_add(vertices=n, radius=r, depth=h, location=loc, rotation=(0, 0, rot)); o = bpy.context.object
    o.data.materials.append(m); bv = o.modifiers.new('b', 'BEVEL'); bv.width = .07; bv.segments = 5; bv.limit_method = 'ANGLE'; return o
poligono(5, (0, 0, .22), .55, .44, pen, rot=math.radians(90 + 36))
P = V((-1.15, .55, .45)); esfera(P, .3, fos)
for d in ((1, 1, 1), (1, -1, -1), (-1, 1, -1), (-1, -1, 1)):
    q = P + V(d).normalized() * .4; bastao(tuple(P), tuple(q), .06, lig); esfera(q, .19, ox, seg=48)
bastao(tuple(P + V((.3, -.15, -.1))), (-.5, .2, .3), .08, lig)
poligono(6, (1.44, -.18, .22), .48, .44, base, rot=math.radians(30))
poligono(5, (.72, -.18, .22), .38, .44, base, rot=math.radians(180))
bastao((.3, -.12, .25), (.4, -.16, .25), .09, lig)
sai('B02.5', elev=34, azim=-15)

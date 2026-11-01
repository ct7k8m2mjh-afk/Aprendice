# B12.1 virus e bacterias: bacteriofago T4 (capsideo icosaedrico com DNA, colar, cauda contratil, placa basal e fibras da cauda)
import sys; sys.path[:0] = ['/home/claude/escadas-sc/design/icones_real/foto3d', '/home/claude/escadas-sc/design/icones_real/foto3d/cenas']
from _bk import *
cena()
import random
FN = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
cap = plastico('#7b6fd6', .25); cau = plastico('#4a5ad0', .3); fib = plastico('#9aa5f0', .3)
bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=1, radius=.6, location=(0, 0, 2.55)); h = bpy.context.object; h.scale = (1, 1, 1.35)
h.data.materials.append(cap); bv = h.modifiers.new('b', 'BEVEL'); bv.width = .03; bv.segments = 3
cilindro((0, 0, 1.75), .2, .14, cau, chanfro=.03)
for k in range(9): cilindro((0, 0, .9 + k * .09), .15, .07, cau, chanfro=.02)
cilindro((0, 0, 1.3), .07, .9, plastico('#2b2f7a', .3), chanfro=0)
bpy.ops.mesh.primitive_cylinder_add(vertices=6, radius=.32, depth=.1, location=(0, 0, .82)); bp = bpy.context.object; bp.data.materials.append(cau)
for k in range(6):
    a = k / 6 * 6.283 + .5; d = V((math.cos(a), math.sin(a), 0))
    tubo([(0 + d.x * .3, d.y * .3, .85), tuple(d * .85 + V((0, 0, 1.0))), tuple(d * 1.25 + V((0, 0, .05)))], .035, fib, tipo='POLY')
    esfera(tuple(d * 1.25 + V((0, 0, .05))), .045, fib, seg=16)
sai('B12.1', elev=18)

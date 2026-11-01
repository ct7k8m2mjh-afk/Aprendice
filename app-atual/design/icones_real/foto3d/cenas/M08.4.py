from _mat import *
cena()
# porca sextavada de aco: hexagono regular (6 lados iguais, angulos internos de 120 graus)
import bmesh
aco = metal('#cdd1d7', 0.22)
pts = [(0.75 * math.cos(math.radians(30 + 60 * k)), 0.75 * math.sin(math.radians(30 + 60 * k))) for k in range(6)]
o = prisma(pts, 0, 0.6, aco, chanfro=0.035)
bpy.ops.mesh.primitive_cylinder_add(radius=0.36, depth=2, vertices=64, location=(0, 0, 0.3)); fu = bpy.context.object
b = o.modifiers.new('fu', 'BOOLEAN'); b.object = fu; b.operation = 'DIFFERENCE'
o.modifiers.move(len(o.modifiers) - 1, 0)
fu.hide_render = True; fu.hide_viewport = True
# rosca interna (aneis)
for k in range(9):
    toro((0, 0, 0.04 + k * 0.065), 0.37, 0.02, aco)
fim('M08.4', elev=40, azim=-18)

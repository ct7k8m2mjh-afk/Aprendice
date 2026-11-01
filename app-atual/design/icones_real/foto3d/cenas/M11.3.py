from _mat import *
cena()
# cone de transito e piramide de base quadrada de plastico: piramides e cones (V = Ab.h/3)
lar = plastico('#f26a1b', 0.3); br = plastico('#f7f7f2', 0.3)
caixa((-0.35, 0, 0.04), (1.0, 1.0, 0.08), plastico('#262626', 0.5), chanfro=0.03)
cone((-0.35, 0, 0.08 + 0.75), 0.4, 0.06, 1.5, lar)
for z, rr in ((0.62, 0.3), (1.0, 0.205)):
    cone((-0.35, 0, 0.08 + z), rr + 0.023 * 1.3, rr - 0.0, 0.2, br)
bpy.ops.mesh.primitive_cone_add(vertices=4, radius1=0.62, radius2=0, depth=0.8, location=(0.75, -0.35, 0.4), rotation=(0, 0, R(45 + 15)))
p = bpy.context.object; p.data.materials.append(plastico(AZUL, 0.28))
md = p.modifiers.new('b', 'BEVEL'); md.width = 0.025; md.segments = 4; md.limit_method = 'ANGLE'
fim('M11.3', elev=22, azim=-14)

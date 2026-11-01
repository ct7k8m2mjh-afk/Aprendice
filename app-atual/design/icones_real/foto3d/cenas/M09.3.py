from _mat import *
cena()
# obelisco e bastao na mesma luz do sol: as sombras sao proporcionais as alturas (triangulos semelhantes)
pedra = fosco('#e3d5b8', 0.6); chao = fosco('#9ed27a', 0.85); somb = fosco('#4d7a3a', 0.9)
caixa((0, 0, 0.04), (2.4, 2.4, 0.08), chao, chanfro=0.03)
ox, oy = -0.55, 0.45; H = 1.5; b = 0.3
caixa((ox, oy, 0.13), (0.5, 0.5, 0.1), pedra, chanfro=0.02)
bpy.ops.mesh.primitive_cone_add(vertices=4, radius1=b * 0.72, radius2=b * 0.5, depth=H, location=(ox, oy, 0.18 + H / 2), rotation=(0, 0, R(45)))
bpy.context.object.data.materials.append(pedra)
bpy.ops.mesh.primitive_cone_add(vertices=4, radius1=b * 0.5, radius2=0, depth=0.24, location=(ox, oy, 0.18 + H + 0.12), rotation=(0, 0, R(45)))
bpy.context.object.data.materials.append(plastico(DOURADO, 0.3))
sx, sy = 0.45, 0.05; h2 = 0.7
cilindro((sx, sy, 0.08 + h2 / 2), 0.045, h2, madeira('#9a6235', escala=30))
# sol ao fundo-esquerda: sombras para a frente-direita, comprimento = 0,6 x altura
dvec = mathutils.Vector((0.55, -0.83)).normalized(); k = 0.6
def sombra(x, y, hh, w):
    p = mathutils.Vector((x, y)); n = mathutils.Vector((-dvec.y, dvec.x)) * w; t = p + dvec * (k * hh)
    prisma([tuple(p - n), tuple(p + n), tuple(t + n * 0.15), tuple(t - n * 0.15)], 0.081, 0.003, somb, chanfro=0)
sombra(ox, oy, H + 0.42, 0.2); sombra(sx, sy, h2, 0.05)
fim('M09.3', elev=34, azim=-14)

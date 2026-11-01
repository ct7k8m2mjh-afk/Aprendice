from _mat import *
cena()
# bola de basquete com as costuras: esfera (V = 4/3 pi r^3, A = 4 pi r^2)
m = bpy.data.materials.new('bb'); m.use_nodes = True; nt = m.node_tree; b = nt.nodes['Principled BSDF']
b.inputs['Base Color'].default_value = cor('#e0661c'); b.inputs['Roughness'].default_value = 0.55; b.inputs['Coat Weight'].default_value = 0.1
nz = nt.nodes.new('ShaderNodeTexVoronoi'); nz.inputs['Scale'].default_value = 120
bm = nt.nodes.new('ShaderNodeBump'); bm.inputs['Strength'].default_value = 0.25
nt.links.new(nz.outputs['Distance'], bm.inputs['Height']); nt.links.new(bm.outputs['Normal'], b.inputs['Normal'])
r = 0.8; z = r
o = esfera((0, 0, z), r, m)
pr = plastico('#1a1a1a', 0.5)
g = [toro((0, 0, 0), r * 1.0, 0.018, pr), toro((0, 0, 0), r * 1.0, 0.018, pr, rot=(R(90), 0, 0))]
for s in (-1, 1):
    pts = []
    for k in range(97):
        t = k / 96 * 2 * math.pi
        v = mathutils.Vector((math.cos(t) * 0.62, math.sin(t), 0)); v = v.normalized()
        v = mathutils.Vector((s * 0.55 + 0.45 * math.cos(t) * s * -1, math.sin(t) * 0.78, math.cos(t) * 0))
        pts.append(v)
    # curva de costura: interseccao da esfera com um cilindro deslocado
    pts = []
    for k in range(97):
        t = k / 96 * 2 * math.pi
        y = 0.62 * r * math.sin(t); zz = 0.62 * r * math.cos(t); x = s * math.sqrt(max(r * r - y * y - zz * zz, 0)) * 1.0
        pts.append((x * 1.004, y, zz))
    g.append(curva_tubo(pts, 0.018, pr, fechado=True))
grupo(g, loc=(0, 0, z), rot=(R(20), R(-25), R(30)))
fim('M11.4', elev=22, azim=-14)

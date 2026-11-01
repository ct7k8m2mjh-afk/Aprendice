# P12.1 Pre-Modernismo: mandacaru no chao rachado da caatinga (o sertao de "Os Sertoes", de Euclides da Cunha)
from _por import *
cena_p()
# chao rachado: placa de terra com rachaduras (voronoi)
m = bpy.data.materials.new('terra'); m.use_nodes = True; nt = m.node_tree; b = nt.nodes['Principled BSDF']
vo = nt.nodes.new('ShaderNodeTexVoronoi'); vo.feature = 'DISTANCE_TO_EDGE'; vo.inputs['Scale'].default_value = 4.5
cr = nt.nodes.new('ShaderNodeValToRGB'); cr.color_ramp.elements[0].color = cor('#4a2a14'); cr.color_ramp.elements[0].position = 0.02
cr.color_ramp.elements[1].color = cor('#c98a52'); cr.color_ramp.elements[1].position = 0.06
nt.links.new(vo.outputs['Distance'], cr.inputs['Fac']); nt.links.new(cr.outputs['Color'], b.inputs['Base Color'])
bp = nt.nodes.new('ShaderNodeBump'); bp.inputs['Strength'].default_value = 0.6; nt.links.new(cr.outputs['Color'], bp.inputs['Height']); nt.links.new(bp.outputs['Normal'], b.inputs['Normal'])
b.inputs['Roughness'].default_value = 0.9
chao = cilindro((0, 0, 0.08), 1.0, 0.16, m, vert=10, chanfro=0.04)
for v in chao.data.vertices:
    a = math.atan2(v.co.y, v.co.x); v.co.x *= 1 + 0.12 * math.sin(3 * a); v.co.y *= 0.85 + 0.1 * math.cos(2 * a)
# perfil estrelado (costelas) para o cacto
pr = bpy.data.curves.new('perfil', 'CURVE'); sp = pr.splines.new('POLY'); n = 16; sp.points.add(n - 1)
for i in range(n):
    r = 0.15 if i % 2 == 0 else 0.11; a = 2 * math.pi * i / n; sp.points[i].co = (r * math.cos(a), r * math.sin(a), 0, 1)
sp.use_cyclic_u = True; perf = bpy.data.objects.new('perf', pr); bpy.context.scene.collection.objects.link(perf)
verde = plastico('#3f8a4a', 0.5)
def tronco(pts, esc=1.0):
    cu = bpy.data.curves.new('t', 'CURVE'); cu.dimensions = '3D'; cu.bevel_mode = 'OBJECT'; cu.bevel_object = perf; cu.use_fill_caps = True
    s = cu.splines.new('BEZIER'); s.bezier_points.add(len(pts) - 1)
    for p, c in zip(s.bezier_points, pts): p.co = c; p.handle_left_type = p.handle_right_type = 'AUTO'
    for k, p in enumerate(s.bezier_points): p.radius = esc * (1.0 if k < len(pts) - 1 else 0.85)
    o = bpy.data.objects.new('t', cu); bpy.context.scene.collection.objects.link(o); o.data.materials.append(verde); return o
tronco([(0, 0, 0.1), (0, 0, 0.9), (0.0, 0, 1.75)], 1.25)
esfera((0, 0, 1.75), 0.15, verde).scale = (1.2, 1.2, 0.6)
tronco([(0.0, 0, 0.6), (0.4, 0, 0.62), (0.48, 0, 0.9), (0.48, 0, 1.35)], 0.95)
esfera((0.48, 0, 1.35), 0.12, verde).scale = (1.1, 1.1, 0.6)
tronco([(0.0, 0, 0.85), (-0.38, 0.05, 0.86), (-0.44, 0.05, 1.05), (-0.44, 0.05, 1.3)], 0.85)
esfera((-0.44, 0.05, 1.3), 0.1, verde).scale = (1.1, 1.1, 0.6)
esfera((0.08, -0.12, 1.85), 0.06, plastico('#e0457b', 0.4))
render(saida('P12.1'), elev=20, azim=-14)

from _mat import *
cena()
# trilhos de trem: duas retas paralelas (mesma inclinacao) que nunca se cortam
aco = metal('#b9bec6', 0.25); mad = madeira('#7a4a26', escala=10)
brita = bpy.data.materials.new('br'); brita.use_nodes = True; nt = brita.node_tree; b = nt.nodes['Principled BSDF']
vo = nt.nodes.new('ShaderNodeTexVoronoi'); vo.inputs['Scale'].default_value = 60
cr = nt.nodes.new('ShaderNodeValToRGB'); cr.color_ramp.elements[0].color = cor('#6f6a62'); cr.color_ramp.elements[1].color = cor('#b8b2a6')
nt.links.new(vo.outputs['Distance'], cr.inputs['Fac']); nt.links.new(cr.outputs['Color'], b.inputs['Base Color']); b.inputs['Roughness'].default_value = 0.9
objs = [caixa((0, 0, 0.06), (1.5, 3.4, 0.12), brita, chanfro=0.06)]
for k in range(10):
    objs.append(caixa((0, -1.55 + k * 0.345, 0.16), (1.25, 0.18, 0.09), mad, chanfro=0.015))
for x in (-0.38, 0.38):
    objs.append(caixa((x, 0, 0.23), (0.05, 3.3, 0.06), aco, chanfro=0.008))
    objs.append(caixa((x, 0, 0.29), (0.1, 3.3, 0.05), aco, chanfro=0.012))
    objs.append(caixa((x, 0, 0.215), (0.14, 3.3, 0.02), aco, chanfro=0.005))
grupo(objs, rot=(0, 0, R(-35)))
fim('M12.3', elev=32, azim=-10)

# P11.4 Parnasianismo e Simbolismo: vaso grego de ceramica com faixas pretas (a forma perfeita parnasiana, "Vaso grego")
from _por import *
cena_p()
m = bpy.data.materials.new('ceram'); m.use_nodes = True; nt = m.node_tree; b = nt.nodes['Principled BSDF']
tc = nt.nodes.new('ShaderNodeTexCoord'); sx = nt.nodes.new('ShaderNodeSeparateXYZ'); nt.links.new(tc.outputs['Object'], sx.inputs[0])
cr = nt.nodes.new('ShaderNodeValToRGB'); cr.color_ramp.interpolation = 'CONSTANT'
els = cr.color_ramp.elements; els[0].position = 0.0; els[0].color = cor('#1a1410'); els[1].position = 0.12; els[1].color = cor('#c8642a')
for pos, c in ((0.22, '#1a1410'), (0.27, '#c8642a'), (0.62, '#1a1410'), (0.67, '#c8642a'), (0.7, '#1a1410')):
    e = els.new(pos); e.color = cor(c)
mp = nt.nodes.new('ShaderNodeMapRange'); mp.inputs['From Min'].default_value = 0; mp.inputs['From Max'].default_value = 1.6
nt.links.new(sx.outputs['Z'], mp.inputs['Value']); nt.links.new(mp.outputs['Result'], cr.inputs['Fac']); nt.links.new(cr.outputs['Color'], b.inputs['Base Color'])
b.inputs['Roughness'].default_value = 0.35; b.inputs['Coat Weight'].default_value = 0.3
perf = [(0, 0), (0.22, 0), (0.24, 0.04), (0.16, 0.1), (0.15, 0.16), (0.3, 0.3), (0.46, 0.55), (0.5, 0.75), (0.46, 0.95), (0.32, 1.1), (0.2, 1.18), (0.17, 1.3), (0.2, 1.45), (0.3, 1.55), (0.31, 1.6), (0.26, 1.6), (0.15, 1.5)]
v = torno(perf, m, seg=128)
so = v.modifiers.new('so', 'SOLIDIFY'); so.thickness = 0.025
for s in (-1, 1):
    bez([(s * 0.18, 0, 1.38), (s * 0.42, 0, 1.42), (s * 0.48, 0, 1.25), (s * 0.4, 0, 1.06)], 0.035, m)
# figuras (meandro grego) na faixa: pequenos blocos pretos em relevo leve
for k in range(28):
    a = 2 * math.pi * k / 28; r = 0.5
    o = caixa((r * math.cos(a), r * math.sin(a), 0.75), (0.035, 0.06, 0.09), plastico('#1a1410', 0.35), chanfro=0.005, rot=(0, 0, a))
render(saida('P11.4'), elev=16, azim=-14)

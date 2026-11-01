# B12.3 tecidos vegetais/xilema: secao de tronco com aneis de crescimento (cada anel = xilema secundario de um ano), casca por fora
import sys; sys.path[:0] = ['/home/claude/escadas-sc/design/icones_real/foto3d', '/home/claude/escadas-sc/design/icones_real/foto3d/cenas']
from _bk import *
cena()
import random
FN = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
m = bpy.data.materials.new('madeira'); m.use_nodes = True; nt = m.node_tree; b = nt.nodes['Principled BSDF']
w = nt.nodes.new('ShaderNodeTexWave'); w.wave_type = 'RINGS'; w.inputs['Scale'].default_value = 3.2; w.inputs['Distortion'].default_value = 2.5; w.inputs['Detail'].default_value = 3
w.rings_direction = 'Z'
cr = nt.nodes.new('ShaderNodeValToRGB'); cr.color_ramp.elements[0].color = cor('#c9934f'); cr.color_ramp.elements[1].color = cor('#f0cf93')
nt.links.new(w.outputs['Fac'], cr.inputs['Fac']); nt.links.new(cr.outputs['Color'], b.inputs['Base Color']); b.inputs['Roughness'].default_value = .5
tc = nt.nodes.new('ShaderNodeTexCoord'); mp = nt.nodes.new('ShaderNodeMapping'); mp.inputs['Scale'].default_value = (1, 1, 0); nt.links.new(tc.outputs['Object'], mp.inputs['Vector']); nt.links.new(mp.outputs['Vector'], w.inputs['Vector'])
c = cilindro((0, 0, .35), 1.15, .7, m, chanfro=.03)
casca = fosco('#5d3a22', .9); o = cilindro((0, 0, .34), 1.28, .68, casca, chanfro=.04); i = cilindro((0, 0, .34), 1.15, .9, None, chanfro=0); dif(o, i)
desloca(o, .06, .05, tipo='STUCCI', sub=1)
cilindro((0, 0, .7), .06, .01, fosco('#7a4e2a', .7), chanfro=0)
sai('B12.3', elev=40)

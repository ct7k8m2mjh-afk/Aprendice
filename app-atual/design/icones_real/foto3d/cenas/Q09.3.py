import sys, os, math, random; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _qui import *
from mathutils import Euler
# Prego enferrujado x prego protegido por um anel de zinco (metal de sacrificio, oxida no lugar do ferro)
cena_q()
# revisao 31/10 (2a rodada): os pregos deitados ficavam finos e compridos; agora em pe, cravados num bloco de madeira (compacto)
def prego(loc, m, mh, L=2.6):
    ob = [cilindro((0, 0, L / 2), 0.17, L, m, chanfro=0.0), cilindro((0, 0, L + 0.06), 0.46, 0.12, mh, chanfro=0.035)]
    return grupo(ob, loc=loc)
mfe = metal('#cfd4da', 0.18)
# ferrugem: marrom alaranjado rugoso com textura de ruido
mr = bpy.data.materials.new('ferrugem'); mr.use_nodes = True; nt = mr.node_tree; b = nt.nodes['Principled BSDF']
nz = nt.nodes.new('ShaderNodeTexNoise'); nz.inputs['Scale'].default_value = 7; nz.inputs['Detail'].default_value = 10
tco = nt.nodes.new('ShaderNodeTexCoord'); nt.links.new(tco.outputs['Object'], nz.inputs['Vector'])  # sem listras ao longo do prego
cr = nt.nodes.new('ShaderNodeValToRGB'); cr.color_ramp.elements[0].color = cor('#3d1a08'); cr.color_ramp.elements[1].color = cor('#b8521a'); cr.color_ramp.elements[0].position = 0.35; cr.color_ramp.elements[1].position = 0.65
nt.links.new(nz.outputs['Fac'], cr.inputs[0]); nt.links.new(cr.outputs[0], b.inputs['Base Color']); b.inputs['Roughness'].default_value = 0.9
bp = nt.nodes.new('ShaderNodeBump'); bp.inputs['Strength'].default_value = 1.0; nt.links.new(nz.outputs['Fac'], bp.inputs['Height']); nt.links.new(bp.outputs[0], b.inputs['Normal'])
import _por
caixa((0, 0, 0.25), (2.4, 1.3, 0.5), fosco('#c8a072', 0.6), chanfro=0.05)
prego((-0.6, 0.05, 0.45), mr, mr)
prego((0.6, -0.05, 0.45), mfe, mfe)
# anel de zinco (branco-azulado, fosco) no prego protegido
t = cilindro((0.6, -0.05, 0.45 + 1.15), 0.3, 0.55, metal('#a9b8c6', 0.5), chanfro=0.05)
render(out('Q09.3'), elev=20, azim=-12)

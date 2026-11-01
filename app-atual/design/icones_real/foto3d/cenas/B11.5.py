# B11.5 especiacao / irradiacao adaptativa: dois tentilhoes de Darwin num galho, com bicos de formas diferentes (bico grosso
# e curto, de quebrar sementes, x bico fino e longo, de pegar insetos): especies aparentadas adaptadas a alimentos distintos.
# Revisao 31/10: substitui a foto (exemplares de museu) por render 3D.
import sys; sys.path[:0] = ['/home/claude/escadas-sc/design/icones_real/foto3d', '/home/claude/escadas-sc/design/icones_real/foto3d/cenas']
from _bio2 import *
cena(); random.seed(1)
gal = org('#7a5636', '#5a3c22', cav='#1e120a', sss=0, rugos=.75, coat=0, bump=.8, esc=6, ao=.15, mix=.7)
bic = org('#3a332e', '#55493f', cav='#0a0806', sss=.1, rugos=.3, coat=.4, bump=.05, esc=4)
bic2 = org('#c9a77a', '#a88458', cav='#4a3018', sss=.15, rugos=.3, coat=.4, bump=.05, esc=4)
pe = org('#4a3a30', '#3a2c24', cav='#0a0806', sss=.1, rugos=.5, coat=.1, bump=.1, esc=6)
olho = plastico('#0c0a08', .08)
# galho
tubo([(-2.0, .1, .3), (-.6, 0, .35), (.6, -.05, .32), (2.0, .05, .25)], .13, gal, raios=[1.15, 1, 1, .85])
tubo([(-.9, 0, .35), (-1.3, -.2, .75), (-1.5, -.35, 1.0)], .05, gal)
def ave(x, pena, pena2, ventre, bico_tipo):
    o = []
    m = bpy.data.materials.new('pen'); m.use_nodes = True; nt = m.node_tree; bs = nt.nodes['Principled BSDF']
    tc = nt.nodes.new('ShaderNodeTexCoord'); sx = nt.nodes.new('ShaderNodeSeparateXYZ'); nt.links.new(tc.outputs['Object'], sx.inputs[0])
    nz = nt.nodes.new('ShaderNodeTexNoise'); nz.inputs['Scale'].default_value = 14; nt.links.new(tc.outputs['Object'], nz.inputs['Vector'])
    ad = nt.nodes.new('ShaderNodeMath'); ad.operation = 'ADD'; nt.links.new(sx.outputs[2], ad.inputs[0])
    mu = nt.nodes.new('ShaderNodeMath'); mu.operation = 'MULTIPLY'; mu.inputs[1].default_value = .25; nt.links.new(nz.outputs['Fac'], mu.inputs[0]); nt.links.new(mu.outputs[0], ad.inputs[1])
    cr = nt.nodes.new('ShaderNodeValToRGB'); e = cr.color_ramp.elements
    e[0].position = .0; e[0].color = cor(ventre); e[1].position = 1.0; e[1].color = cor(pena2); e.new(.5).color = cor(pena)
    mr = nt.nodes.new('ShaderNodeMapRange'); mr.inputs['From Min'].default_value = .75; mr.inputs['From Max'].default_value = 1.75
    nt.links.new(ad.outputs[0], mr.inputs['Value']); nt.links.new(mr.outputs['Result'], cr.inputs['Fac']); nt.links.new(cr.outputs['Color'], bs.inputs['Base Color'])
    nb = nt.nodes.new('ShaderNodeTexNoise'); nb.inputs['Scale'].default_value = 70; bp = nt.nodes.new('ShaderNodeBump'); bp.inputs['Strength'].default_value = .35
    nt.links.new(tc.outputs['Object'], nb.inputs['Vector']); nt.links.new(nb.outputs['Fac'], bp.inputs['Height']); nt.links.new(bp.outputs['Normal'], bs.inputs['Normal'])
    bs.inputs['Roughness'].default_value = .7; bs.inputs['Sheen Weight'].default_value = .4
    el = [('ELLIPSOID', (0, 0, .95), .62, (1.0, .72, .78), (0, math.radians(-28), 0)),
          ('BALL', (-.4, 0, 1.33), .42), ('ELLIPSOID', (-.15, 0, 1.12), .4, (.8, .7, .8)),
          ('ELLIPSOID', (.5, 0, .76), .42, (1.2, .5, .3), (0, math.radians(-30), 0)), ('ELLIPSOID', (.3, 0, .86), .45, (1.0, .6, .5), (0, math.radians(-30), 0))]
    for s_ in (-1, 1): el.append(('ELLIPSOID', (.2, s_ * .2, 1.0), .42, (1.15, .3, .5), (0, math.radians(-25), 0)))
    corpo = blob(el, m, res=.015, thr=.5); o.append(corpo)
    for s_ in (-1, 1):
        e_ = esfera((-.62, s_ * .2, 1.42), .055, olho, seg=24); o.append(e_)
    if bico_tipo == 'grosso':
        b = cone((-.83, 0, 1.33), .2, .01, .36, bic, rot=(0, math.radians(-90 + 8), 0)); escala(b, (1, .85, 1.15)); o.append(b)
    else:
        b = cone((-.95, 0, 1.36), .07, .005, .5, bic2, rot=(0, math.radians(-90 + 4), 0)); o.append(b)
    for s_ in (-1, 1):
        o.append(tubo([(.0, s_ * .12, .6), (-.02, s_ * .12, .5), (-.04, s_ * .12, .44)], .028, pe))
    for ob in o: ob.matrix_world = mathutils.Matrix.Translation(V((x, 0, 0))) @ ob.matrix_world
    return o
a1 = ave(-.75, '#3a2c22', '#241a14', '#5a4a3c', 'grosso')
a2 = ave(.85, '#8a7454', '#6a5638', '#c9b48e', 'fino')
for ob in a2: ob.matrix_world = mathutils.Matrix.Translation(V((.85, 0, 0))) @ mathutils.Matrix.Rotation(math.radians(180), 4, 'Z') @ mathutils.Matrix.Translation(V((-.85, 0, 0))) @ ob.matrix_world
chao_auto()
sai('B11.5', elev=16, azim=-25, tam=560)

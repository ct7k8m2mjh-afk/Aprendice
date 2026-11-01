# B10.2 resistencia bacteriana: antibiograma; placa de Petri com tapete bacteriano, discos de antibiotico com halos de inibicao (sensivel) e um disco sem halo (cepa resistente)
import sys; sys.path[:0] = ['/home/claude/escadas-sc/design/icones_real/foto3d', '/home/claude/escadas-sc/design/icones_real/foto3d/cenas']
from _bk import *
cena()
vid = vidro('#f4f9ff'); disco = plastico('#ffffff', .55)
lawn = bpy.data.materials.new('tapete'); lawn.use_nodes = True; nt = lawn.node_tree; b = nt.nodes['Principled BSDF']
b.inputs['Base Color'].default_value = cor('#e3cf86'); b.inputs['Roughness'].default_value = .55
nz = nt.nodes.new('ShaderNodeTexNoise'); nz.inputs['Scale'].default_value = 60; bm = nt.nodes.new('ShaderNodeBump'); bm.inputs['Strength'].default_value = .5
nt.links.new(nz.outputs['Fac'], bm.inputs['Height']); nt.links.new(bm.outputs['Normal'], b.inputs['Normal'])
hal = pele('#b98e3e', .1, .2)  # agar sem bacterias: translucido, parece mais escuro
o = cilindro((0, 0, .2), 1.45, .4, vid, chanfro=.03); i = cilindro((0, 0, .26), 1.39, .4, None, chanfro=0); dif(o, i)
cilindro((0, 0, .14), 1.38, .16, hal, chanfro=.01)
a = cilindro((0, 0, .225), 1.37, .01, lawn, chanfro=0)
for (x, y, r) in ((-.55, .5, .45), (.6, .5, .32), (-.5, -.5, .52), (.6, -.5, 0)):
    if r:
        c = cilindro((x, y, .22), r, .2, None, chanfro=0); dif(a, c)
    cilindro((x, y, .245), .15, .03, disco, chanfro=.01)
toro((0, 0, .4), 1.42, .025, vid)
sai('B10.2', elev=48)

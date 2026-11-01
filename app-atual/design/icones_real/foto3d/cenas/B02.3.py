# B02.3 proteinas/desnaturacao: ovo frito (clara coagulada = albumina desnaturada) com gema
import sys; sys.path[:0] = ['/home/claude/escadas-sc/design/icones_real/foto3d', '/home/claude/escadas-sc/design/icones_real/foto3d/cenas']
from _bk import *
cena()
import random; random.seed(3)
# clara: disco irregular achatado (metaballs)
el = [('ELLIPSOID', (0, 0, .06), 1.0, (1.0, .85, .12))]
for k in range(9):
    a = k / 9 * 6.283 + random.uniform(-.2, .2); d = random.uniform(.55, .85)
    el.append(('ELLIPSOID', (d * math.cos(a), d * .85 * math.sin(a), .05), random.uniform(.45, .6), (1, 1, .16)))
cl = blob(el, None, res=.03)
m = bpy.data.materials.new('clara'); m.use_nodes = True; b = m.node_tree.nodes['Principled BSDF']
b.inputs['Base Color'].default_value = cor('#ece6d8'); b.inputs['Roughness'].default_value = .3
b.inputs['Subsurface Weight'].default_value = .3; b.inputs['Coat Weight'].default_value = .5; cl.data.materials.append(m)
desloca(cl, .03, .25)
# borda levemente dourada/torradinha: anel fino sob a clara
br = blob([(e[0], (e[1][0], e[1][1], .03), e[2] * 1.05, (e[3][0], e[3][1], e[3][2] * .5)) for e in el], pele('#c98a3a', .05, .6), res=.03)
# gema: calota alaranjada
g = esfera((.12, -.05, .12), .42, pele('#f5a00a', .35, .18, (1, .5, .1)))
escala(g, (1, 1, .55)); g.location.z = .14
render(os.path.join(AQ, 'render', 'B02.3.png'), elev=38)

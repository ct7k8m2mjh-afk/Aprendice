# B03.5 fotossintese: o experimento classico com elodea: ramo da planta aquatica dentro de um bequer com agua, sob um funil
# invertido e um tubo de ensaio que coleta o O2 liberado em bolhas. Revisao 31/10 (2a rodada).
import sys; sys.path[:0] = ['/home/claude/escadas-sc/design/icones_real/foto3d', '/home/claude/escadas-sc/design/icones_real/foto3d/cenas']
from _bio2 import *
cena(); random.seed(8)
vid = vidro('#f2f8ff', .0); vid.node_tree.nodes['Principled BSDF'].inputs['IOR'].default_value = 1.15; agu = liquido('#e6f4fb'); bb = agu.node_tree.nodes['Principled BSDF']; bb.inputs['Transmission Weight'].default_value = 1.0; bb.inputs['Roughness'].default_value = 0.0; bb.inputs['IOR'].default_value = 1.05
fol = org('#2f8a22', '#48a830', cav='#0e3a08', sss=.4, rugos=.3, coat=.55, bump=.1, esc=5)
cau = org('#6ab04a', '#7cc05a', cav='#1e4a10', sss=.4, rugos=.35, coat=.45, bump=0)
bol = vidro('#ffffff', .0)
# bequer (vidro com espessura) e agua
b = cilindro((0, 0, 1.0), 1.0, 2.0, vid, chanfro=.03, vert=96); i_ = cilindro((0, 0, 1.08), .95, 2.0, None, chanfro=0, vert=96); dif(b, i_)
cilindro((0, 0, .8), .945, 1.5, agu, chanfro=.01, vert=96)
# funil invertido e tubo de ensaio com gas acumulado no topo
f = cone((0, 0, 1.55), .75, .14, .4, vid); fi = cone((0, 0, 1.55), .71, .1, .42, None); dif(f, fi)
t = cilindro((0, 0, 2.15), .14, .8, vid, chanfro=.03, vert=48); ti = cilindro((0, 0, 2.13), .115, .8, None, chanfro=0, vert=48); dif(t, ti)
esfera((0, 0, 2.55), .14, vid, seg=32)
cilindro((0, 0, 1.95), .112, .3, agu, chanfro=.01, vert=48)
# ramos de elodea: caule com verticilos de 3 folhas
for (x0, y0, ang) in ((-.12, .05, -10), (.12, -.05, 12), (0, .12, 3)):
    pts = []; z = .08
    for k in range(9):
        z = .08 + k * .16; x = x0 + math.sin(math.radians(ang)) * z * .5
        pts.append((x, y0, z))
    tubo(pts, .025, cau)
    for k in range(1, 9):
        x, y, z = pts[k]
        for j in range(3):
            a = j * 2.094 + k * .6
            l = esfera((0, 0, 0), 1, fol, seg=16); escala(l, (.17, .05, .02))
            l.location = (x + math.cos(a) * .14, y + math.sin(a) * .14, z + .03); l.rotation_euler = (math.radians(-25) * 0, math.radians(-35), a)
# bolhas de O2 subindo pelo tubo
for k in range(9):
    esfera((random.uniform(-.06, .06), random.uniform(-.06, .06), 1.45 + k * .07), random.uniform(.02, .04), bol, seg=16)
chao_auto()
sai('B03.5', elev=24, azim=-10, tam=560)

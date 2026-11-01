# B08.2 sinapse quimica: botao pre-sinaptico em corte (vesiculas sinapticas cheias de neurotransmissor, mitocondria, uma
# vesicula em exocitose), fenda sinaptica com neurotransmissores e a membrana pos-sinaptica com receptores. Revisao 31/10 (2a rodada).
import sys; sys.path[:0] = ['/home/claude/escadas-sc/design/icones_real/foto3d', '/home/claude/escadas-sc/design/icones_real/foto3d/cenas']
from _bio2 import *
cena(); random.seed(2)
pre = org('#f2a541', '#e88a2a', cav='#5a2a00', sss=.35, rugos=.3, coat=.55, bump=.2, esc=5, ao=.12)
cit = org('#fbe3b4', '#f6d39a', cav='#9a6a2a', sss=.4, rugos=.4, coat=.3, bump=.3, esc=8, ao=.12)
pos = org('#4a8ee0', '#5aa0ec', cav='#0a2a5a', sss=.35, rugos=.3, coat=.55, bump=.25, esc=5, ao=.12)
ves = org('#7fd08a', '#9ade9e', cav='#1a5a20', sss=.3, rugos=.15, coat=.7, bump=0, esc=4)
ves.node_tree.nodes['Principled BSDF'].inputs['Transmission Weight'].default_value = .55
nt = org('#e0283a', '#f04050', cav='#5a0008', sss=.2, rugos=.25, coat=.6, bump=0)
rec = org('#7b2cbf', '#9040d0', cav='#200840', sss=.3, rugos=.3, coat=.55, bump=.4, esc=9, ao=.06)
mit = org('#e8603a', '#f07a50', cav='#5a1a08', sss=.3, rugos=.3, coat=.55, bump=.2, esc=6)
# botao: axonio descendo + bulbo
b = esfera((0, 0, 1.45), 1, pre, seg=96); escala(b, (.85, .8, .72))
ax = tubo([(0, .1, 1.9), (0, .1, 2.5), (-.15, .1, 2.9)], .3, pre, raios=[1.3, 1, .9])
bpy.ops.mesh.primitive_cube_add(size=3, location=(0, -1.5 - .05, 1.6)); cut = bpy.context.object; cut.data.materials.append(cit)
md = b.modifiers.new('bo', 'BOOLEAN'); md.object = cut; md.solver = 'EXACT'; md.material_mode = 'TRANSFER'
sel(b); bpy.ops.object.modifier_apply(modifier='bo'); bpy.data.objects.remove(cut, do_unlink=True)
for p in b.data.polygons: p.use_smooth = True
# vesiculas (meio afundadas no plano de corte) com neurotransmissores dentro
pts = []
for k in range(40):
    p = V((random.uniform(-.65, .65), -.04, random.uniform(.95, 1.95)))
    if ((p.x / .7) ** 2 + ((p.z - 1.45) / .6) ** 2) > 1: continue
    if any((p - q).length < .25 for q in pts): continue
    pts.append(p)
for p in pts[:13]:
    esfera(tuple(p), .11, ves, seg=32)
    for j in range(3): esfera(tuple(p + V((random.uniform(-.05, .05), -.04, random.uniform(-.05, .05)))), .028, nt, seg=12)
m = esfera((-.4, -.02, 1.72), 1, mit, seg=32); escala(m, (.25, .08, .12))
# exocitose na base e neurotransmissores na fenda
esfera((.1, .05, .74), .12, ves, seg=32)
for k in range(12):
    esfera((random.uniform(-.55, .55), random.uniform(-.35, .3), random.uniform(.42, .64)), .04, nt, seg=16)
# membrana pos-sinaptica (espinha dendritica achatada, curva) com receptores
po = esfera((0, 0, .12), 1, pos, seg=96); escala(po, (1.25, .9, .24))
for v in po.data.vertices: v.co.z -= .12 * v.co.x ** 2
for k in range(9):
    x = -.75 + k * .19; y = random.uniform(-.35, .3); z = .33 - .12 * x * x
    r_ = esfera((x, y, z + .02), 1, rec, seg=24); escala(r_, (.07, .07, .11)); desloca(r_, .01, .05)
chao_auto()
sai('B08.2', elev=22, azim=-38, tam=560)

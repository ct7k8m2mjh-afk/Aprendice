# B04.2 mitose: celula em metafase, em corte: cromossomos duplicados alinhados na placa equatorial, fibras do fuso saindo dos
# centrossomos (com centriolos) nos dois polos e prendendo-se aos cinetocoros. Revisao 31/10 (2a rodada).
import sys; sys.path[:0] = ['/home/claude/escadas-sc/design/icones_real/foto3d', '/home/claude/escadas-sc/design/icones_real/foto3d/cenas']
from _bio2 import *
cena(); random.seed(3)
mem = org('#e9a2c0', '#de8cb2', cav='#5a1a3a', sss=.4, rugos=.3, coat=.55, bump=.2, esc=5, ao=.12)
cit = org('#fbe0ea', '#f6d0de', cav='#9a5a7a', sss=.4, rugos=.4, coat=.3, bump=.3, esc=8, ao=.15)
fus = org('#9ad6e8', '#b0e0ee', cav='#2a6a7a', sss=.2, rugos=.3, coat=.4, bump=0)
crs = [org('#3b5fe0', '#6a4ae8', cav='#0c1250', sss=.35, rugos=.25, coat=.6, bump=.25, esc=5, ao=.06),
       org('#d8327e', '#b8289a', cav='#4a0828', sss=.35, rugos=.25, coat=.6, bump=.25, esc=5, ao=.06)]
cen = org('#f2b705', '#f5c832', cav='#6a4a00', sss=.3, rugos=.25, coat=.6, bump=.1, esc=5)
C = V((0, 0, 1.0))
o = esfera(C, 1, mem, seg=96); escala(o, (1.45, 1.0, 1.0))
bpy.ops.mesh.primitive_cube_add(size=4, location=(0, -2.0 + .0, 1.0)); cut = bpy.context.object; cut.data.materials.append(cit)
md = o.modifiers.new('bo', 'BOOLEAN'); md.object = cut; md.solver = 'EXACT'; md.material_mode = 'TRANSFER'
sel(o); bpy.ops.object.modifier_apply(modifier='bo'); bpy.data.objects.remove(cut, do_unlink=True)
for p in o.data.polygons: p.use_smooth = True
P1 = C + V((-1.05, -.05, 0)); P2 = C + V((1.05, -.05, 0))
for P in (P1, P2):
    for k in (0, 1):
        c = cilindro(tuple(P + V((0, -.05, 0))), .05, .16, cen, rot=((0, math.radians(90), 0) if k else (math.radians(90), 0, 0)), chanfro=.015)
# cromossomos na placa (x = 0), cada um com 2 cromatides
zs = [-.5, -.17, .17, .5]
for i, dz in enumerate(zs):
    cz = C.z + dz; m = crs[i % 2]
    for sx in (-1, 1):
        seg = malha(tubo([(sx * .07, -.12, cz + .22), (sx * .1, -.12, cz), (sx * .07, -.12, cz - .22)], .065, m, tipo='NURBS'))
        gn_sulcos(seg, .015, 14, .2, warp=.05, warp_esc=3, tipo='voronoi', sub=1)
        for e in (cz + .22, cz - .22): esfera((sx * .07, -.12, e), .064, m, seg=16)
    esfera((0, -.12, cz), .06, cen, seg=16)
    for P in (P1, P2):
        sx = -1 if P.x < 0 else 1
        tubo([tuple(P), (sx * .5, -.11, (P.z + cz) / 2 + dz * .1), (sx * .1, -.12, cz)], .013, fus)
# fibras polares e aster
for P in (P1, P2):
    sx = -1 if P.x < 0 else 1
    for k in range(7):
        a = math.radians(-70 + k * 23)
        tubo([tuple(P), tuple(P + V((-sx * math.cos(a) * .35, -.0, math.sin(a) * .35)))], .01, fus)
    for dz in (-.7, .7):
        tubo([tuple(P), (0, -.1, C.z + dz * .9), tuple(P2 if sx < 0 else P1)], .01, fus)
chao_auto()
sai('B04.2', elev=14, azim=-10, tam=560)

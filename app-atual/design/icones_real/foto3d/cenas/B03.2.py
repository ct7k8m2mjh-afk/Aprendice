# B03.2 cadeia respiratoria / ATP sintase: na membrana interna da mitocondria (bicamada fosfolipidica), a ATP sintase:
# anel c (Fo) na membrana, haste central, cabeca F1 com 3 subunidades alfa e 3 beta alternadas, e a haste periferica
# (estator). Proteinas com superficie globular. Revisao 31/10 (segunda lente).
import sys; sys.path[:0] = ['/home/claude/escadas-sc/design/icones_real/foto3d', '/home/claude/escadas-sc/design/icones_real/foto3d/cenas']
from _bio2 import *
cena(); random.seed(2)
cab = org('#f2c94a', '#e8b32a', cav='#6a4a00', sss=.3, rugos=.35, coat=.45, bump=.3, esc=6, ao=.08)
cau = org('#f6e3b0', '#eed49a', cav='#7a6a40', sss=.3, rugos=.4, coat=.3, bump=.2, esc=6, ao=.08)
al = org('#d8402e', '#e85a40', cav='#4a0a04', sss=.3, rugos=.3, coat=.55, bump=.5, esc=7, ao=.08, bump_esc=30)
be = org('#2f6fdc', '#4a86ea', cav='#0a1a4a', sss=.3, rugos=.3, coat=.55, bump=.5, esc=7, ao=.08, bump_esc=30)
cr = org('#7b2cbf', '#9040d0', cav='#200840', sss=.3, rugos=.3, coat=.55, bump=.4, esc=7, ao=.08)
ha = org('#2e9e44', '#40b058', cav='#0a3010', sss=.3, rugos=.3, coat=.55, bump=.3, esc=7, ao=.08)
# bicamada: cabecas polares (esferas) em duas camadas + caudas sugeridas pela faixa clara entre elas
bpy.ops.mesh.primitive_uv_sphere_add(radius=1, segments=16, ring_count=8); pr = bpy.context.object
for p in pr.data.polygons: p.use_smooth = True
pr.data.materials.append(cab); me = pr.data; bpy.data.objects.remove(pr, do_unlink=True)
for zz in (.62, .08):
    for i in range(-11, 12):
        for j in range(-6, 7):
            x = i * .19 + (j % 2) * .095; y = j * .17
            if x * x / 4.4 + y * y / 1.3 > 1: continue
            if x * x + y * y < .5 ** 2: continue
            o = bpy.data.objects.new('h', me); bpy.context.scene.collection.objects.link(o); o.location = (x, y, zz); o.scale = (.095,) * 3
c = cilindro((0, 0, .35), 1, .5, cau, chanfro=.15, vert=64); escala(c, (2.0, 1.08, 1))
# anel c (10 subunidades) atravessando a membrana
for k in range(10):
    a = k / 10 * 6.283; s = cilindro((math.cos(a) * .32, math.sin(a) * .32, .35), .11, .72, cr, chanfro=.05, vert=24); desloca(s, .02, .1)
# haste central (gama)
tubo([(0, 0, .7), (0, 0, 1.3), (.03, 0, 1.8)], .1, ha)
# cabeca F1: 3 alfa + 3 beta alternados em volta do eixo
for k in range(6):
    a = k / 6 * 6.283 + .3; p = (math.cos(a) * .34, math.sin(a) * .34, 1.95)
    e = esfera(p, .34, al if k % 2 == 0 else be, seg=48); escala(e, (1, 1, 1.25)); desloca(e, .04, .12, sub=1)
esfera((0, 0, 2.38), .16, be, seg=32)
# haste periferica (estator) do lado, presa a subunidade a na membrana
esfera((.62, -.3, .4), .16, cr, seg=32)
tubo([(.62, -.3, .5), (.75, -.35, 1.2), (.65, -.3, 2.0), (.35, -.15, 2.35)], .07, ha)
chao_auto()
sai('B03.2', elev=22, azim=-14)

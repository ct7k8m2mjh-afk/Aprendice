# B10.3 protozooses: Trypanosoma cruzi (forma tripomastigota: corpo fusiforme em C, membrana ondulante, flagelo livre na
# extremidade anterior, nucleo central e cinetoplasto posterior) entre hemacias no sangue: doenca de Chagas.
# Revisao 31/10: substitui a foto do barbeiro por render 3D da mesma familia dos demais.
import sys; sys.path[:0] = ['/home/claude/escadas-sc/design/icones_real/foto3d', '/home/claude/escadas-sc/design/icones_real/foto3d/cenas']
from _bio2 import *
cena(); random.seed(7)
hm = org('#c0262b', '#d63a36', cav='#4a0507', sss=.35, rugos=.28, coat=.55, bump=.05, esc=3, ao=.2)
tr = org('#6b3fa0', '#8a58c0', cav='#24104a', sss=.35, rugos=.3, coat=.55, bump=.15, esc=6)
mb = org('#b392e0', '#c8aaf0', cav='#4a2a7a', sss=.4, rugos=.25, coat=.5, bump=0)
nu = org('#2d1a5e', '#3a2478', cav='#0a0420', sss=.2, rugos=.3, coat=.5, bump=.2, esc=10)
# hemacias
for (x, y, z, rx, ry) in [(-1.0, .3, .3, 15, 5), (.95, .5, .32, -12, 20), (.05, 1.0, .35, 30, -10), (-.2, -.7, .3, -8, -25), (1.3, -.6, .3, 10, 30)]:
    hemacia((x, y, z), .62, hm, rot=(math.radians(rx), math.radians(ry), random.uniform(0, 3)))
# tripanossomo em C por cima das hemacias
pts = []; rs = []
N = 9
for i in range(N):
    t = i / (N - 1); a = math.radians(200 - t * 230)
    pts.append((1.0 * math.cos(a) + .1, .75 * math.sin(a) - .05, .95 + .08 * math.sin(t * 6))); rs.append(.2 + .8 * math.sin(t * math.pi) ** .8)
body = tubo(pts, .13, tr, raios=rs, tipo='NURBS')
# membrana ondulante (fita ao longo do dorso)
mpts = []
for i in range(30):
    t = .08 + i / 29 * .84; a = math.radians(200 - t * 230)
    rr = 1.0 + .1 * (math.sin(t * math.pi) ** .6) + .03
    mpts.append((rr * math.cos(a) + .1, (rr * .75 + .03) * math.sin(a) - .05, .95 + .08 * math.sin(t * 6) + .06 * math.sin(t * 40)))
cu = bpy.data.curves.new('mb', 'CURVE'); cu.dimensions = '3D'; cu.extrude = .07; cu.bevel_depth = .012
sp = cu.splines.new('NURBS'); sp.points.add(len(mpts) - 1)
for i, p in enumerate(mpts): sp.points[i].co = (*p, 1)
sp.use_endpoint_u = True; sp.order_u = 4
o = bpy.data.objects.new('mb', cu); bpy.context.scene.collection.objects.link(o); cu.materials.append(mb)
# flagelo livre anterior (continua da membrana) e cinetoplasto + nucleo
a = math.radians(200 - 1.0 * 230); end = V((1.0 * math.cos(a) + .1, .75 * math.sin(a) - .05, .95))
fl = [tuple(end + V((.0, 0, 0))), tuple(end + V((.15, .35, .1))), tuple(end + V((-.05, .7, .15))), tuple(end + V((.12, 1.0, .2)))]
tubo(fl, .025, mb)
ap = math.radians(200 - .5 * 230); c = V((1.0 * math.cos(ap) + .1, .75 * math.sin(ap) - .05, 1.08))
n_ = esfera(c, .12, nu, seg=32); escala(n_, (1.3, 1, .8))
ak = math.radians(200 - .14 * 230); esfera((1.0 * math.cos(ak) + .1, .75 * math.sin(ak) - .05, 1.03), .07, nu, seg=24)
chao_auto()
piv = [o for o in bpy.context.scene.objects if o.type == 'CURVE' or (o.type == 'MESH' and o.name.startswith('Sphere'))]
R = mathutils.Matrix.Translation(V((.1, .3, 0))) @ mathutils.Matrix.Rotation(math.radians(80), 4, 'Z') @ mathutils.Matrix.Translation(V((-.1, -.3, 0)))
for o in piv: o.matrix_world = R @ o.matrix_world
sai('B10.3', elev=52, azim=-12)

# B03.4 fermentacao: pote de iogurte aberto (fermentacao lactica por lactobacilos) com colher e tampa de aluminio dobrada
import sys; sys.path[:0] = ['/home/claude/escadas-sc/design/icones_real/foto3d', '/home/claude/escadas-sc/design/icones_real/foto3d/cenas']
from _bk import *
cena()
pote = plastico('#2e6fd8', .3); bra = plastico('#f4f4f1', .3); iog = pele('#f7f1e4', .35, .4); mor = pele('#d63a5a', .2, .3)
import bmesh
bpy.ops.mesh.primitive_cone_add(radius1=.55, radius2=.72, depth=1.1, location=(0, 0, .55), vertices=96); p = bpy.context.object
bm = bmesh.new(); bm.from_mesh(p.data); top = [f for f in bm.faces if f.normal.z > .9]; bmesh.ops.delete(bm, geom=top, context='FACES'); bm.to_mesh(p.data); bm.free()
sd = p.modifiers.new('so', 'SOLIDIFY'); sd.thickness = .04; sd.offset = -1
p.data.materials.append(pote); bv = p.modifiers.new('b', 'BEVEL'); bv.width = .012; bv.segments = 3
for po in p.data.polygons: po.use_smooth = True
# faixa branca impressa (anel no meio do pote)
bpy.ops.mesh.primitive_cone_add(radius1=.615, radius2=.675, depth=.38, location=(0, 0, .62), vertices=96); f = bpy.context.object
bpy.ops.mesh.primitive_cone_add(radius1=.55, radius2=.62, depth=.5, location=(0, 0, .62), vertices=96); i = bpy.context.object; dif(f, i); f.data.materials.append(bra)
for po in f.data.polygons: po.use_smooth = True
# morango desenhado na faixa (gota vermelha) - sabor
for a in (-90, -50, -130):
    m_ = esfera((.66 * math.cos(math.radians(a)), .66 * math.sin(math.radians(a)), .64), .08, mor, seg=24); escala(m_, (1, .5, 1.2))
toro((0, 0, 1.1), .7, .035, bra)
s = cilindro((0, 0, .95), .66, .22, iog, chanfro=0); desloca(s, .03, .12, sub=2)
# tampa de aluminio dobrada para tras
t = cilindro((0, 0, 0), .75, .015, metal('#cfd4da', .22), chanfro=0)
t.location = (0, .85, 1.5); t.rotation_euler = (math.radians(-65), 0, 0)
cilindro((0, .8, 1.52), .55, .018, plastico('#2e6fd8', .3), chanfro=0).rotation_euler = (math.radians(-65), 0, 0)
cl = metal('#d4d8de', .15)
o = esfera((.2, -.1, 1.07), .2, cl); escala(o, (1, .7, .3))
tubo([(.32, -.1, 1.1), (.6, -.15, 1.35), (.95, -.2, 1.75)], .035, cl, raios=[1, 1, 1.3])
sai('B03.4', elev=38, azim=-12)

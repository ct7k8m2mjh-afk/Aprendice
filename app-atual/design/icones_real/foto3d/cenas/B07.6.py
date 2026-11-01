# B07.6 nefron/urina: rim em corte frontal (capsula, cortex, piramides renais da medula, calices/pelve renal) com arteria
# renal (vermelha), veia renal (azul) e ureter saindo do hilo. Revisao 31/10 (segunda lente).
import sys; sys.path[:0] = ['/home/claude/escadas-sc/design/icones_real/foto3d', '/home/claude/escadas-sc/design/icones_real/foto3d/cenas']
from _bio2 import *
cena()
cap = org('#7e211d', '#9a332b', cav='#2a0606', sss=.3, rugos=.28, coat=.6, bump=.12, esc=4, ao=.3)
ctx = org('#b8604c', '#a85543', cav='#5a1810', sss=.3, rugos=.45, coat=.3, bump=.4, esc=9, ao=.1)
pir = org('#6a1218', '#86222a', cav='#300508', sss=.25, rugos=.4, coat=.3, bump=.5, esc=14, ao=.1)
pel = org('#f3e2bb', '#e6cc96', cav='#8a6a35', sss=.35, rugos=.35, coat=.45, bump=.1, esc=4, ao=.12)
art = org('#d32f2f', '#e85b4a', cav='#5a0a0a', sss=.25, rugos=.3, coat=.5, bump=.05, esc=3)
vei = org('#2b55b8', '#3a6fd0', cav='#0c1d4a', sss=.25, rugos=.3, coat=.5, bump=.05, esc=3)
# feijao: elipsoides ao longo de arco suave, concavidade (hilo) para +x
el = []
for k in range(11):
    a = math.radians(-62 + k * 124 / 10)
    el.append(('ELLIPSOID', (-.35 * math.cos(a) + .1, 0, 1.0 * math.sin(a)), .62, (1.05, .55, .85)))
k = blob(el, cap, res=.02, thr=.6)
h = esfera((.7, 0, 0), .42, None); escala(h, (1, 2.2, 1.2)); dif(k, h)
# corte frontal: remove a metade da frente (y<0); faces do corte recebem o material do cortex
bpy.ops.mesh.primitive_cube_add(size=4, location=(0, -2.0, 0)); cut = bpy.context.object; cut.data.materials.append(ctx)
md = k.modifiers.new('bo', 'BOOLEAN'); md.object = cut; md.solver = 'EXACT'; md.material_mode = 'TRANSFER'
sel(k); bpy.ops.object.modifier_apply(modifier='bo'); bpy.data.objects.remove(cut, do_unlink=True)
for p in k.data.polygons: p.use_smooth = p.material_index == 0
# piramides renais (8) como cunhas no plano do corte, base para fora, papila para o hilo
cx, cz = .42, 0.0
import bmesh
def cunha(pts2d, y, esp, m):
    me = bpy.data.meshes.new('cu'); bm = bmesh.new()
    vs = [bm.verts.new((x, y, z)) for (x, z) in pts2d]; f = bm.faces.new(vs)
    r = bmesh.ops.extrude_face_region(bm, geom=[f]); 
    for v in [e for e in r['geom'] if isinstance(e, bmesh.types.BMVert)]: v.co.y -= esp
    bm.to_mesh(me); o = bpy.data.objects.new('cu', me); bpy.context.scene.collection.objects.link(o)
    o.data.materials.append(m); md = o.modifiers.new('bv', 'BEVEL'); md.width = esp * .45; md.segments = 3
    for p in o.data.polygons: p.use_smooth = True
    return o
for i in range(6):
    a0 = math.radians(116 + i * 25.6); w = math.radians(10.5)
    pts = []
    for t in range(9):
        a = a0 - w + 2 * w * t / 8; pts.append((cx + math.cos(a) * .74, cz + math.sin(a) * 1.0))
    am = a0
    pts += [(cx + math.cos(am + w * .35) * .36, cz + math.sin(am + w * .35) * .42), (cx + math.cos(am) * .31, cz + math.sin(am) * .36), (cx + math.cos(am - w * .35) * .36, cz + math.sin(am - w * .35) * .42)]
    cunha(pts, -0.0, .035, pir)
    q = V((cx + math.cos(am) * .3, 0, cz + math.sin(am) * .34))
    tubo([tuple(q + V((0, -.02, 0))), (cx + .2, -.02, cz + math.sin(am) * .12)], .075, pel, raios=[1.25, 1])
# pelve renal (funil) e ureter
pv = blob([('ELLIPSOID', (cx + .3, -.02, 0), .32, (1.0, .35, 1.25))], pel, res=.02)
tubo([(cx + .45, .05, -.15), (cx + .75, .08, -.4), (cx + .78, .1, -.9), (cx + .82, .12, -1.4)], .08, pel)
# vasos do hilo
tubo([(cx + .2, .08, .2), (cx + .55, .12, .3), (cx + .9, .2, .4), (cx + 1.25, .25, .45)], .12, vei)
tubo([(cx + .15, .15, .42), (cx + .5, .2, .52), (cx + .9, .25, .65), (cx + 1.25, .3, .75)], .09, art)
for o in list(bpy.context.scene.objects):
    if o.name != 'CHAO' and o.type in ('MESH', 'CURVE'):
        o.rotation_euler.rotate(mathutils.Euler((0, math.radians(-10), 0)))
        o.location = mathutils.Matrix.Rotation(math.radians(-10), 4, 'Y') @ o.location
chao_auto()
sai('B07.6', elev=22, azim=-32)

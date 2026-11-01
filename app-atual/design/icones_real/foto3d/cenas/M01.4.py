from _mat import *
cena()
choc = plastico('#6b3a22', 0.34)
foil = metal('#e9e9ee', 0.18)
q = 0.32
def quad(x, y):
    return [caixa((x, y, 0.07), (q * 0.97, q * 0.97, 0.10), choc, chanfro=0.014),
            caixa((x, y, 0.14), (q * 0.72, q * 0.72, 0.06), choc, chanfro=0.022)]
# barra 3 x 6 = 18 quadradinhos: ficam 3 x 4 = 12 na folha, um pedaco 3 x 2 = 6 quebrado ao lado
cx = [(i - 2.5) * q for i in range(6)]; cy = [(j - 1) * q for j in range(3)]
caixa((sum(cx[:4]) / 4, 0, 0.025), (q * 4, q * 3, 0.05), choc, chanfro=0.01)
for x in cx[:4]:
    for y in cy: quad(x, y)
pe = [caixa(((cx[4] + cx[5]) / 2, 0, 0.025), (q * 2, q * 3, 0.05), choc, chanfro=0.01)]
for x in cx[4:]:
    for y in cy: pe += quad(x, y)
grupo(pe, loc=(0.16, -0.10, 0), rot=(0, 0, R(-12)))
# folha de aluminio amassada por baixo da parte inteira
bpy.ops.mesh.primitive_plane_add(size=1, location=(sum(cx[:4]) / 4 - 0.08, 0.02, 0.003)); f = bpy.context.object
f.scale = (q * 4.7, q * 3.7, 1); bpy.ops.object.transform_apply(scale=True)
bpy.ops.object.mode_set(mode='EDIT'); bpy.ops.mesh.subdivide(number_cuts=30); bpy.ops.object.mode_set(mode='OBJECT')
tx = bpy.data.textures.new('n', 'CLOUDS'); tx.noise_scale = 0.08
d = f.modifiers.new('d', 'DISPLACE'); d.texture = tx; d.strength = 0.012; f.data.materials.append(foil)
for p in f.data.polygons: p.use_smooth = True
for o in bpy.context.scene.objects:
    if o.type == 'MESH' and o.name != 'CHAO' and o.parent is None and o != f: pass
fim('M01.4', elev=48, azim=-28)

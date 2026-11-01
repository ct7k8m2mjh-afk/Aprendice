from _mat import *
cena()
# modelo de paralelepipedo (arestas de metal, faces de acrilico) gerado por tres vetores coloridos a partir de um vertice: volume = |det|
# revisao 31/10: bloco de resina ambar (cor, nao mais acrilico quase invisivel), setas grossas e a base menor (vista de vies: as tres setas aparecem)
a = mathutils.Vector((1.3, 0, 0)); b = mathutils.Vector((0.45, 1.0, 0)); c = mathutils.Vector((0.3, 0.25, 1.0))
O = mathutils.Vector((-0.95, -0.5, 0.14))
V = {(i, j, k): O + i * a + j * b + k * c for i in (0, 1) for j in (0, 1) for k in (0, 1)}
idx = lambda i, j, k: i * 4 + j * 2 + k
vs = [V[(i, j, k)] for i in (0, 1) for j in (0, 1) for k in (0, 1)]
fs = [(idx(0,0,0), idx(0,1,0), idx(1,1,0), idx(1,0,0)), (idx(0,0,1), idx(1,0,1), idx(1,1,1), idx(0,1,1)),
      (idx(0,0,0), idx(1,0,0), idx(1,0,1), idx(0,0,1)), (idx(0,1,0), idx(0,1,1), idx(1,1,1), idx(1,1,0)),
      (idx(0,0,0), idx(0,0,1), idx(0,1,1), idx(0,1,0)), (idx(1,0,0), idx(1,1,0), idx(1,1,1), idx(1,0,1))]
me = bpy.data.meshes.new('pp'); me.from_pydata([tuple(v) for v in vs], [], fs); me.update()
o = bpy.data.objects.new('pp', me); bpy.context.scene.collection.objects.link(o)
import bmesh
bm = bmesh.new(); bm.from_mesh(me); bmesh.ops.recalc_face_normals(bm, faces=bm.faces); bm.to_mesh(me); bm.free()
m = liquido('#f2a516'); bb = m.node_tree.nodes['Principled BSDF']; bb.inputs['Transmission Weight'].default_value = 0.55; bb.inputs['Roughness'].default_value = 0.12; bb.inputs['IOR'].default_value = 1.2
o.data.materials.append(m)
aco = metal('#cfd3da', 0.2)
for (p, q) in [(p, q) for p in V for q in V if sum(abs(x - y) for x, y in zip(p, q)) == 1 and p < q]:
    if p == (0, 0, 0): continue
    bastao(V[p], V[q], 0.03, aco)
for p in V:
    if p != (0, 0, 0): esfera(V[p], 0.055, aco)
for v, cc in ((a, VERM), (b, VERDE), (c, AZUL)):
    mm = plastico(cc, 0.22)
    bastao(O, O + v * 1.18 - v.normalized() * 0.2, 0.065, mm)
    cn = cone((0, 0, 0), 0.14, 0.0, 0.3, mm); cn.location = O + v * 1.18 - v.normalized() * 0.15; cn.rotation_euler = v.to_track_quat('Z', 'Y').to_euler()
esfera(O, 0.1, plastico('#222222', 0.3))
caixa((-0.05, 0.1, 0.06), (2.4, 1.85, 0.12), madeira('#9a6436', escala=10), chanfro=0.03)
fim('M15.2', elev=26, azim=-52)

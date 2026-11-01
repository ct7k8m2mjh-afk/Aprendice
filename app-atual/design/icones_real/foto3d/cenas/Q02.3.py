import sys, os, math, random; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _qui import *
from mathutils import Euler
# Metano (CH4) dentro de um tetraedro de vidro: geometria tetraedrica, angulos de 109,5 graus, molecula apolar
cena_q()
at, lig = coords_rdkit('C')
at = orienta_pca(at, (0, 0, 0))
# gira para um H apontar para cima (vista classica do tetraedro)
c = at[0][1]; hs = [p - c for s, p in at if s == 'H']
q = hs[0].normalized().rotation_difference(Vector((0, 0, 1)))
at = [(s, q @ (p - c)) for s, p in at]
at = [(s, Euler((0, 0, math.radians(20))).to_matrix() @ p) for s, p in at]
objs, pos = molecula(at, lig, escala=1.0, r_lig=0.07, z_min=0.25, raio_k=0.95)
cc = pos[0]; hp = [pos[i] for i, (s, _) in enumerate(at) if s == 'H']
vt = [cc + (h - cc) * 1.6 for h in hp]
me = bpy.data.meshes.new('tet'); bm = bmesh.new(); vv = [bm.verts.new(v) for v in vt]
for f in [(0, 1, 2), (0, 1, 3), (0, 2, 3), (1, 2, 3)]: bm.faces.new([vv[i] for i in f])
bmesh.ops.recalc_face_normals(bm, faces=bm.faces); bm.to_mesh(me); bm.free()
t = bpy.data.objects.new('tet', me); bpy.context.scene.collection.objects.link(t); me.materials.append(vidro('#f2f8ff'))
md = t.modifiers.new('s', 'SOLIDIFY'); md.thickness = 0.02
mo = metal('#cfd5dc', 0.2)
for i in range(4):
    for j in range(i + 1, 4): bastao(tuple(vt[i]), tuple(vt[j]), 0.03, mo)
    esfera(tuple(vt[i]), 0.05, mo)
render(out('Q02.3'), elev=22)

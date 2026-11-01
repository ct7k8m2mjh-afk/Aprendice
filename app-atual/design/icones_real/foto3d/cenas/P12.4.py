# P12.4 Geracao de 45 e prosa de ruptura (Guimaraes Rosa, Clarice, Joao Cabral): ovo quebrado -> "O ovo e a galinha", de Clarice
# Lispector, e a ruptura. Revisao 31/10: antes um ovo claro quase sem contraste e trincas minusculas; agora um ovo de casca marrom
# num porta-ovo azul, com o topo quebrado em zigue-zague (a gema aparece) e a tampinha de casca caida ao lado.
from _por import *
cena_p()
casca = ruido_cor('#d29a66', '#e0b07e', 30, 0.55)
dentro = fosco('#fbf6ec', 0.6)
H = 1.3; ZC = 0.45  # t do corte
def r_ovo(t): return 0.5 * math.sqrt(max(0.0, 1 - t * t)) * (1 - 0.12 * t)
def z_ovo(t): return (t + 1) * H / 2
def casca_parte(t0, t1, n, zig, cima):
    import bmesh
    seg = 120; me = bpy.data.meshes.new('ovo'); bm = bmesh.new(); aneis = []
    for k in range(n + 1):
        t = t0 + (t1 - t0) * k / n
        r = r_ovo(t); z = z_ovo(t)
        if r < 1e-4: aneis.append([bm.verts.new((0, 0, z))]); continue
        anel = []
        for i in range(seg):
            a = 2 * math.pi * i / seg; dz = 0
            borda = (k == n and not cima) or (k == 0 and cima)
            if borda:
                f = (i % 10) / 10.0; dz = zig * (1 - 2 * abs(f - 0.5) * 2 + 0.0) * (1 if (i // 10) % 2 else 0.7)
            anel.append(bm.verts.new((r * math.cos(a), r * math.sin(a), z + dz)))
        aneis.append(anel)
    for A, B in zip(aneis[:-1], aneis[1:]):
        if len(A) == 1:
            for i in range(seg): bm.faces.new((A[0], B[(i + 1) % seg], B[i]))
        elif len(B) == 1:
            for i in range(seg): bm.faces.new((A[i], A[(i + 1) % seg], B[0]))
        else:
            for i in range(seg): bm.faces.new((A[i], A[(i + 1) % seg], B[(i + 1) % seg], B[i]))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces); bm.to_mesh(me); bm.free()
    o = bpy.data.objects.new('ovo', me); bpy.context.scene.collection.objects.link(o)
    o.data.materials.append(casca); o.data.materials.append(dentro)
    for p in o.data.polygons: p.use_smooth = True
    s = o.modifiers.new('so', 'SOLIDIFY'); s.thickness = 0.03; s.offset = -1; s.material_offset = 1; s.material_offset_rim = 1
    return o
# porta-ovo azul (ceramica)
cup = torno([(0, 0.0), (0.4, 0.0), (0.42, 0.04), (0.36, 0.1), (0.2, 0.2), (0.17, 0.32), (0.3, 0.42), (0.43, 0.6), (0.47, 0.8), (0.48, 0.84),
             (0.45, 0.85), (0.43, 0.8), (0.0, 0.5)], plastico('#1f5fd6', 0.22), seg=96)
z0 = 0.38
base = casca_parte(-1.0, ZC, 40, 0.07, False); base.location.z = z0
# clara e gema dentro
cilindro((0, 0, z0 + z_ovo(ZC) - 0.1), r_ovo(ZC) - 0.035, 0.04, fosco('#fffdf7', 0.3), chanfro=0.015)
gm = esfera((0.03, -0.02, z0 + z_ovo(ZC) - 0.1), 0.2, plastico('#f5a300', 0.15)); gm.scale.z = 0.55
# tampinha de casca caida ao lado (de boca para cima, inclinada)
tampa = casca_parte(ZC, 1.0, 16, 0.07, True)
tampa.location = (0.7, -0.62, 0); tampa.rotation_euler = (math.radians(150), math.radians(20), math.radians(30))
no_chao(tampa)
render(saida('P12.4'), elev=30, azim=-16)

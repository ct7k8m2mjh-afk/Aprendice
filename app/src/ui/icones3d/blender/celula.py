"""Célula animal (ícone de Biologia) construída no Blender, peça por peça, a partir da referência
docs/referencias/icones3d/celula.png e do texto do dono (05/11/2026). Nada é copiado da referência: ela só guia
forma, posição e cor. Uso:
    python3 celula.py <saida.png> [tam] [amostras] [etapa]
Coordenadas: Blender (Z para cima). Célula: centro (0,0,1), raio 1. Corte: região x>0 e z>1 (frente-cima),
com a parede de trás (plano x=0) ligada ao piso (plano z=1) por uma curva contínua.
"""
import bpy, bmesh, math, sys, os
import numpy as np
from mathutils import Vector, Matrix
from mathutils.bvhtree import BVHTree

AQUI = os.path.dirname(os.path.abspath(__file__))
RNG = np.random.default_rng(7)

# ---------------------------------------------------------------- utilidades
def _lin(c):
    c = c / 255.0
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4
def cor(h):
    h = h.lstrip('#'); return tuple(_lin(int(h[i:i + 2], 16)) for i in (0, 2, 4)) + (1.0,)

def material(nome, base, rug=0.55, coat=0.08, sss=0.0, vcor=None, espec=0.35):
    m = bpy.data.materials.new(nome); m.use_nodes = True
    b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = cor(base)
    b.inputs['Roughness'].default_value = rug
    b.inputs['Coat Weight'].default_value = coat
    b.inputs['Specular IOR Level'].default_value = espec
    if sss:
        b.inputs['Subsurface Weight'].default_value = sss
        b.inputs['Subsurface Radius'].default_value = (0.04, 0.03, 0.02)
        b.inputs['Subsurface Scale'].default_value = 0.05
    if vcor:
        a = m.node_tree.nodes.new('ShaderNodeVertexColor'); a.layer_name = vcor
        m.node_tree.links.new(a.outputs['Color'], b.inputs['Base Color'])
    return m

def liga(o, *mats):
    for m in mats: o.data.materials.append(m)
    return o

def suaviza(o):
    for p in o.data.polygons: p.use_smooth = True
    return o

def novo_obj(nome, bm):
    me = bpy.data.meshes.new(nome); bm.to_mesh(me); bm.free()
    o = bpy.data.objects.new(nome, me); bpy.context.collection.objects.link(o); return o

def aplica_mods(o):
    bpy.context.view_layer.objects.active = o
    for m in list(o.modifiers):
        bpy.ops.object.modifier_apply(modifier=m.name)

# ---------------------------------------------------------------- cena, luz e câmera
CAM_POS = Vector((1.93, -1.957, 2.54)); CAM_ALVO = Vector((-0.05, -0.047, 0.964)); CAM_FOV = 41.6
CAM_DIST = float(os.environ.get('CAM_DIST', '0.995')); CAM_SX = float(os.environ.get('CAM_SX', '0.0095')); CAM_SY = float(os.environ.get('CAM_SY', '0.0085'))

def cena(tam, amostras):
    bpy.ops.wm.read_factory_settings(use_empty=True)
    sc = bpy.context.scene
    sc.render.engine = 'CYCLES'; sc.cycles.device = 'CPU'; sc.cycles.samples = amostras; sc.cycles.use_denoising = True
    sc.render.resolution_x = sc.render.resolution_y = tam; sc.render.film_transparent = True
    sc.view_settings.view_transform = 'Standard'; sc.view_settings.look = 'None'; sc.view_settings.exposure = float(os.environ.get('EXPO', -0.35))
    w = bpy.data.worlds.new('w'); sc.world = w; w.use_nodes = True
    bg = w.node_tree.nodes['Background']; bg.inputs[0].default_value = (0.93, 0.93, 0.95, 1); bg.inputs[1].default_value = float(os.environ.get('LW', 0.35))
    # luz principal de cima e da frente, mais forte pela esquerda (texto do dono, item 13)
    def area(nome, pos, energia, tam_l, sombra=True):
        d = bpy.data.lights.new(nome, 'AREA'); d.energy = energia; d.size = tam_l; d.use_shadow = sombra
        o = bpy.data.objects.new(nome, d); sc.collection.objects.link(o); o.location = pos
        o.rotation_euler = (Vector((0, 0, 1)) - Vector(pos)).to_track_quat('-Z', 'Y').to_euler(); return o
    area('KEY', (float(os.environ.get('KX', -1.8)), float(os.environ.get('KY', -2.6)), float(os.environ.get('KZ', 6.0))), float(os.environ.get('LK', 380)), 3.5)
    area('FILL', (4.2, 0.8, 3.0), float(os.environ.get('LF', 90)), 5, sombra=False)
    area('TOPO', (0.5, 0.5, 6.0), float(os.environ.get('LT', 110)), 6)
    # câmera
    cd = bpy.data.cameras.new('cam'); cd.sensor_fit = 'VERTICAL'; cd.angle_y = math.radians(CAM_FOV)
    cam = bpy.data.objects.new('cam', cd); sc.collection.objects.link(cam); sc.camera = cam
    cam.location = CAM_ALVO + (CAM_POS - CAM_ALVO) * CAM_DIST; cam.rotation_euler = (CAM_ALVO - CAM_POS).to_track_quat('-Z', 'Y').to_euler()
    cd.shift_x = CAM_SX; cd.shift_y = CAM_SY
    # chão que só recebe sombra
    if not os.environ.get('MASCARA'):
        bpy.ops.mesh.primitive_plane_add(size=40, location=(0, 0, 0)); ch = bpy.context.object; ch.name = 'CHAO'; ch.is_shadow_catcher = True
    return sc

# ---------------------------------------------------------------- 1-2. corpo, revestimento e corte
def nervuras(P, n_cel=135, larg=0.042, semente=3):
    """Rede de nervuras de um Voronoi esférico: devolve altura (0 placa .. 1 crista) e o mínimo suave da distância."""
    r = np.random.default_rng(semente); i = np.arange(n_cel) + 0.5
    phi = np.arccos(1 - 2 * i / n_cel); th = np.pi * (1 + 5 ** 0.5) * i
    C = np.stack([np.cos(th) * np.sin(phi), np.sin(th) * np.sin(phi), np.cos(phi)], -1)
    C += r.normal(0, 0.03, C.shape); C /= np.linalg.norm(C, axis=1, keepdims=True)
    D = P / np.linalg.norm(P, axis=1, keepdims=True)
    D = D + 0.05 * np.stack([np.sin(D[:, 2] * 7 + 1), np.sin(D[:, 0] * 6 + 2), np.sin(D[:, 1] * 8 + 3)], -1)
    D /= np.linalg.norm(D, axis=1, keepdims=True)
    sims = D @ C.T; idx = np.argsort(-sims, axis=1)[:, :4]
    p1 = C[idx[:, 0]]; ds = []
    for k in (1, 2, 3):
        p2 = C[idx[:, k]]; nr = p2 - p1; L = np.linalg.norm(nr, axis=1, keepdims=True)
        ds.append(np.abs(((D - (p1 + p2) / 2) * (nr / L)).sum(1)))
    ds = np.stack(ds, 1); kk = 0.008
    dsm = -kk * np.log(np.exp(-ds / kk).sum(1)) + 0.005          # mínimo suave: junções engrossam
    lw = larg * (1 + 0.35 * np.sin(D[:, 0] * 11 + D[:, 1] * 7) * np.sin(D[:, 2] * 9))  # largura variada
    t = np.clip(1 - dsm / lw, 0, 1); h = np.sqrt(np.clip(1 - (1 - t) ** 2, 0, 1))
    return h

def corpo(etapa):
    bm = bmesh.new(); bmesh.ops.create_icosphere(bm, subdivisions=7, radius=1.0)
    P = np.array([v.co[:] for v in bm.verts])
    h = nervuras(P)
    D = P / np.linalg.norm(P, axis=1, keepdims=True)
    ond = 1 + 0.012 * np.sin(D[:, 0] * 5 + 1) * np.sin(D[:, 1] * 4 + 2) + 0.008 * np.sin(D[:, 2] * 7)  # contorno orgânico
    R = (0.955 + 0.065 * h) * ond
    for v, d, rr in zip(bm.verts, D, R): v.co = Vector(d * rr)
    me = bpy.data.meshes.new('corpo'); bm.to_mesh(me); bm.free()
    cl = me.color_attributes.new('cor', 'FLOAT_COLOR', 'POINT')
    c_pl = np.array(cor('#f3ecdb')[:3]); c_nv = np.array(cor('#ecd08a')[:3])
    pe = np.clip(1 - np.abs(h - 0.12) / 0.12, 0, 1) * (h < 0.3)
    col = c_pl * (1 - h[:, None]) + c_nv * h[:, None]; col *= (1 - 0.35 * pe[:, None])
    cl.data.foreach_set('color', np.concatenate([col, np.ones((len(col), 1))], 1).astype(np.float32).ravel())
    o = bpy.data.objects.new('corpo', me); bpy.context.collection.objects.link(o); o.location = (0, 0, 1)
    suaviza(o)
    m_ext = material('membrana', '#f2e2b8', rug=0.5, coat=0.1, sss=0.0, vcor='cor')
    m_par = material('parede', '#efe6d2', rug=0.75, coat=0.0)      # parede interna marfim
    liga(o, m_ext, m_par)
    # cortador: caixa grande na frente-cima, com a aresta interna arredondada (parede -> piso em curva contínua)
    bpy.ops.mesh.primitive_cube_add(size=1); cx = bpy.context.object; cx.name = 'cortador'
    Z0 = float(os.environ.get('PISO', 0.86)); X0 = float(os.environ.get('PAREDE', 0.0))
    cx.scale = (3, 6, 3); cx.location = (X0 + 1.5, 0, Z0 + 1.5)   # x de X0 a X0+3, z de Z0 a Z0+3 (piso abaixo do centro: concha funda)
    bpy.ops.object.transform_apply(location=True, scale=True)
    bv = cx.modifiers.new('bv', 'BEVEL'); bv.width = float(os.environ.get('FILETE', 0.42)); bv.segments = 16; bv.limit_method = 'NONE'
    aplica_mods(cx)
    cx.data.materials.append(m_par)
    b = o.modifiers.new('corte', 'BOOLEAN'); b.object = cx; b.operation = 'DIFFERENCE'; b.solver = 'EXACT'
    aplica_mods(o); bpy.data.objects.remove(cx)
    # faces do corte: o piso (parte horizontal) fica creme mais claro
    m_piso = material('piso', '#f6f1e6', rug=0.75); o.data.materials.append(m_piso)
    for p in o.data.polygons:
        if p.material_index == 1 and p.normal.z > 0.6: p.material_index = 2
    return o

def borda(o):
    """Borda espessa, arredondada e ondulada do corte: arestas entre a membrana e as faces do corte."""
    bm = bmesh.new(); bm.from_mesh(o.data)
    arestas = [e for e in bm.edges if len(e.link_faces) == 2 and (e.link_faces[0].material_index == 0) != (e.link_faces[1].material_index == 0)]
    # ordena em laços
    viz = {}
    for e in arestas:
        a, b = e.verts; viz.setdefault(a.index, []).append(b.index); viz.setdefault(b.index, []).append(a.index)
    co = {v.index: (o.matrix_world @ v.co) for v in bm.verts}
    feitos = set(); lacos = []
    for ini in viz:
        if ini in feitos: continue
        laco = [ini]; feitos.add(ini); ant = None; at = ini
        while True:
            prox = [n for n in viz[at] if n != ant and n not in feitos]
            if not prox: break
            ant, at = at, prox[0]; laco.append(at); feitos.add(at)
        lacos.append(laco)
    bm.free()
    m = material('borda', '#efdfae', rug=0.5, coat=0.12, sss=0.0)
    for k, laco in enumerate(lacos):
        if len(laco) < 20: continue
        pts = [co[i] for i in laco]
        # reamostra e suaviza
        P = np.array([p[:] for p in pts]); seg = np.linalg.norm(np.diff(P, axis=0), axis=1); s = np.concatenate([[0], np.cumsum(seg)])
        n = max(60, int(s[-1] / 0.012)); t = np.linspace(0, s[-1], n)
        Q = np.stack([np.interp(t, s, P[:, j]) for j in range(3)], 1)
        for _ in range(40): Q[1:-1] = (Q[:-2] + 2 * Q[1:-1] + Q[2:]) / 4
        cd = bpy.data.curves.new(f'borda{k}', 'CURVE'); cd.dimensions = '3D'; cd.bevel_depth = 0.036; cd.bevel_resolution = 6
        sp = cd.splines.new('POLY'); sp.points.add(len(Q) - 1)
        for i, q in enumerate(Q):
            ond = 1 + 0.07 * math.sin(t[i] * 23 + 0.7) + 0.04 * math.sin(t[i] * 51)   # espessura levemente ondulada
            sp.points[i].co = (*q, 1); sp.points[i].radius = ond
        ob = bpy.data.objects.new(f'borda{k}', cd); bpy.context.collection.objects.link(ob); cd.materials.append(m)
    return lacos


# ---------------------------------------------------------------- tela -> superfície (raio da câmera)
W_REF = 1080
_bvh = {}
def prepara_raio(o):
    dg = bpy.context.evaluated_depsgraph_get(); bm = bmesh.new(); bm.from_object(o, dg); bm.transform(o.matrix_world)
    _bvh['cel'] = BVHTree.FromBMesh(bm); bm.free()
def raio(u, v):
    """direção do raio da câmera para o pixel (u, v) da referência (1080 px)."""
    cam = bpy.context.scene.camera; t = math.tan(cam.data.angle_y / 2)
    x = (u / W_REF - 0.5 + cam.data.shift_x) * 2 * t; y = (0.5 - v / W_REF + cam.data.shift_y) * 2 * t
    return cam.location.copy(), (cam.matrix_world.to_3x3() @ Vector((x, y, -1))).normalized()
def na_tela(u, v, alvo='cel'):
    o, d = raio(u, v); hit = _bvh[alvo].ray_cast(o, d)
    return (hit[0], hit[1]) if hit[0] is not None else (None, None)
def para_tela(p):
    from bpy_extras.object_utils import world_to_camera_view
    sc = bpy.context.scene; c = world_to_camera_view(sc, sc.camera, Vector(p)); return c.x * W_REF, (1 - c.y) * W_REF

def curva(nome, pts, raio_t, mat, raios=None, res=4):
    cd = bpy.data.curves.new(nome, 'CURVE'); cd.dimensions = '3D'; cd.bevel_depth = raio_t; cd.bevel_resolution = res
    cd.use_fill_caps = True
    sp = cd.splines.new('POLY'); sp.points.add(len(pts) - 1)
    for i, q in enumerate(pts):
        sp.points[i].co = (*q, 1); sp.points[i].radius = raios[i] if raios is not None else 1
    o = bpy.data.objects.new(nome, cd); bpy.context.collection.objects.link(o); cd.materials.append(mat); return o

def esfera(nome, p, r, mat, esc=(1, 1, 1), seg=24):
    bm = bmesh.new(); bmesh.ops.create_uvsphere(bm, u_segments=seg, v_segments=seg // 2, radius=r)
    o = novo_obj(nome, bm); o.location = p; o.scale = esc; suaviza(o); o.data.materials.append(mat); return o

# ---------------------------------------------------------------- 4. rede turquesa (cordões 3D sobre parede e piso)
def rede_voronoi(poligono, passo, jit=0.42, semente=1, anis=(1, 1)):
    """arestas de um Voronoi em pixels da tela, dentro do polígono (lista de (u,v)); anis estica as células."""
    from scipy.spatial import Voronoi
    r = np.random.default_rng(semente); PP = np.array(poligono, float)
    def dentro(q):
        x, y = q; c = False; n = len(PP)
        for i in range(n):
            (x1, y1), (x2, y2) = PP[i], PP[(i + 1) % n]
            if (y1 > y) != (y2 > y) and x < (x2 - x1) * (y - y1) / (y2 - y1) + x1: c = not c
        return c
    P = np.array(poligono); x0, y0 = P.min(0) - passo * 2; x1, y1 = P.max(0) + passo * 2
    ax, ay = passo * anis[0], passo * anis[1]; pts = []
    for j, y in enumerate(np.arange(y0, y1, ay)):
        for x in np.arange(x0 + (j % 2) * ax / 2, x1, ax):
            pts.append((x + (r.random() - .5) * jit * ax, y + (r.random() - .5) * jit * ay))
    vor = Voronoi(np.array(pts)); arestas = []
    for a, b in vor.ridge_vertices:
        if a < 0 or b < 0: continue
        A, B = vor.vertices[a], vor.vertices[b]
        if dentro(A) and dentro(B): arestas.append((A, B))
    return arestas

def projeta_aresta(A, B, dpx=6, folga=0.009):
    n = max(2, int(np.hypot(*(B - A)) / dpx)); out = []
    for t in np.linspace(0, 1, n + 1):
        u, v = A + (B - A) * t; p, nr = na_tela(u, v)
        if p is None: return None
        out.append(p + nr * folga)
    return out

def rede_turquesa():
    m = material('turquesa', '#14a3c7', rug=0.38, coat=0.35, sss=0.05)
    # regiões da referência (pixels 1080): parede esquerda densa, parede de cima com alças altas, piso com malha larga
    regioes = [  # (polígono na tela, passo px, anisotropia (larg, alt), semente)
        ([(235, 560), (232, 470), (250, 400), (290, 340), (330, 300), (380, 278), (425, 300), (432, 360), (420, 430), (400, 500), (370, 545), (330, 562), (290, 578)], 21, (1.0, 1.35), 11),
        ([(382, 285), (430, 205), (520, 168), (640, 158), (730, 172), (785, 215), (792, 330), (802, 430), (762, 472), (650, 470), (540, 470), (432, 440), (405, 360)], 25, (0.62, 3.1), 12),
        ([(742, 440), (800, 428), (858, 468), (880, 540), (850, 600), (800, 612), (760, 560)], 28, (1.45, 0.8), 13),
        ([(482, 640), (560, 700), (650, 732), (722, 746), (800, 702), (870, 652), (882, 600), (800, 602), (700, 640), (600, 652), (520, 630)], 33, (1.85, 0.75), 14),
    ]
    todas = []
    for pol, passo, anis, sd in regioes:
        for A, B in rede_voronoi(pol, passo, semente=sd, anis=anis): todas.append((A, B))
    k = 0; juntas = {}
    for A, B in todas:
        pts = projeta_aresta(A, B)
        if pts is None: continue
        curva(f'rede{k}', pts, 0.0088, m); k += 1
        for P in (A, B):
            key = (round(P[0]), round(P[1])); juntas[key] = juntas.get(key, 0) + 1
    for (u, v), c in juntas.items():
        if c >= 2:
            p, nr = na_tela(u, v)
            if p is not None: esfera('junta', p + nr * 0.009, 0.0125, m, seg=12)
    return m


# ---------------------------------------------------------------- utilidades de colocação
def escala_px(p):
    """tamanho, em unidades do mundo, de 1 pixel da referência na profundidade do ponto p."""
    cam = bpy.context.scene.camera; fwd = cam.matrix_world.to_3x3() @ Vector((0, 0, -1))
    return (Vector(p) - cam.location).dot(fwd) * 2 * math.tan(cam.data.angle_y / 2) / W_REF
def eixos_tela():
    cam = bpy.context.scene.camera; M = cam.matrix_world.to_3x3()
    return M @ Vector((1, 0, 0)), M @ Vector((0, 1, 0)), M @ Vector((0, 0, -1))
def ponto_raio_esfera(u, v, C, R, frente=True):
    o, d = raio(u, v); oc = o - C; b = oc.dot(d); c = oc.dot(oc) - R * R; disc = b * b - c
    if disc < 0: return None
    t = -b - math.sqrt(disc) if frente else -b + math.sqrt(disc); return o + d * t
def ponto_raio_plano(u, v, P0, N):
    o, d = raio(u, v); den = d.dot(N)
    return o + d * ((Vector(P0) - o).dot(N) / den)

def almofada(nome, L, Wd, T, mat, curv=0.0, pont=0.75, seg=40):
    """saco achatado de bordas arredondadas: comprimento X, largura Y, espessura Z; curv dobra ao longo de X."""
    bm = bmesh.new(); bmesh.ops.create_uvsphere(bm, u_segments=seg, v_segments=seg // 2, radius=1)
    for v in bm.verts:
        x, y, z = v.co
        sx = math.copysign(abs(x) ** pont, x) * L / 2; sy = math.copysign(abs(y) ** pont, y) * Wd / 2
        sz = z * T / 2 * (1 - 0.25 * x * x)
        v.co = Vector((sx, sy, sz - curv * (sx * sx)))
    o = novo_obj(nome, bm); suaviza(o); o.data.materials.append(mat); return o

def orienta(o, pos, normal, eixo):
    n = Vector(normal).normalized(); e = (Vector(eixo) - n * Vector(eixo).dot(n)).normalized(); y = n.cross(e)
    o.matrix_world = Matrix.Translation(pos) @ Matrix((e, y, n)).transposed().to_4x4()

# ---------------------------------------------------------------- 5-6. núcleo
NUC = {}
def nucleo():
    Rpx, cu, cv = 144, 601, 529
    o, d = raio(cu, cv); Z0 = float(os.environ.get('PISO', 0.86))
    # profundidade tal que o núcleo fique apoiado no piso, afundado um pouco
    t = 2.6
    for _ in range(30):
        C = o + d * t; R = Rpx * escala_px(C); t += (C.z - (Z0 + R * float(os.environ.get('NUC_ALT', 0.62)))) / max(0.2, -d.z)
    C = o + d * t; R = Rpx * escala_px(C); NUC.update(C=C, R=R)
    verm = material('nucleo', '#cc1a1d', rug=0.42, coat=0.25, sss=0.05)
    bege = material('nucleo_bege', '#ecd9a6', rug=0.55, coat=0.1)
    vinho = material('nucleoplasma', '#7c1018', rug=0.45, coat=0.3)
    escuro = material('furo', '#1a0406', rug=0.8)
    # casca vermelha oca + esfera bege interna
    def esf(nome, r, mat, seg=96):
        bm = bmesh.new(); bmesh.ops.create_uvsphere(bm, u_segments=seg, v_segments=seg // 2, radius=r)
        ob = novo_obj(nome, bm); ob.location = C; suaviza(ob); ob.data.materials.append(mat); return ob
    tri = [(601, 385), (478, 614), (684, 620)]
    cam = bpy.context.scene.camera; rt, up, fwd = eixos_tela()
    def contorno_arred(pts, rr=26, n=10):
        P = [np.array(p, float) for p in pts]; out = []; rrs = rr if isinstance(rr, (list, tuple)) else [rr] * 3
        for i in range(3):
            rr = rrs[i]; a, b, c = P[i - 1], P[i], P[(i + 1) % 3]
            u1 = (a - b) / np.linalg.norm(a - b); u2 = (c - b) / np.linalg.norm(c - b)
            ang = math.acos(np.clip(u1 @ u2, -1, 1)); dd = rr / math.tan(ang / 2)
            p1 = b + u1 * dd; p2 = b + u2 * dd; bis = (u1 + u2) / np.linalg.norm(u1 + u2); cc = b + bis * rr / math.sin(ang / 2)
            a1 = math.atan2(*(p1 - cc)[::-1]); a2 = math.atan2(*(p2 - cc)[::-1])
            da = (a2 - a1 + math.pi) % (2 * math.pi) - math.pi
            for k in range(n + 1): aa = a1 + da * k / n; out.append(cc + rr * np.array([math.cos(aa), math.sin(aa)]))
        return out
    cont = contorno_arred(tri, rr=[14, 30, 30], n=14)
    def dentro2d(q, poly):
        x, y = q; c = False; n = len(poly)
        for i in range(n):
            (x1, y1), (x2, y2) = poly[i], poly[(i + 1) % n]
            if (y1 > y) != (y2 > y) and x < (x2 - x1) * (y - y1) / (y2 - y1) + x1: c = not c
        return c
    # casca vermelha: esfera sem as faces da frente que caem dentro da janela (na tela) + espessura para dentro
    bm = bmesh.new(); bmesh.ops.create_uvsphere(bm, u_segments=420, v_segments=210, radius=R)
    bm.transform(Matrix.Translation(C)); dist_c = (C - cam.location).length
    tirar = [f for f in bm.faces if (f.calc_center_median() - cam.location).length < dist_c and dentro2d(para_tela(f.calc_center_median()), cont)]
    bmesh.ops.delete(bm, geom=tirar, context='FACES')
    casca = novo_obj('nucleo', bm); suaviza(casca); casca.data.materials.append(verm)
    so = casca.modifiers.new('esp', 'SOLIDIFY'); so.thickness = R * 0.075; so.offset = -1; so.use_even_offset = True; aplica_mods(casca)
    # parede da janela (da borda interna da casca até o fundo bege) e fundo bege rebaixado
    prof = dist_c - R * 0.40
    bm = bmesh.new(); topo = []; fundo_v = []
    for (u, v) in cont:
        P1 = ponto_raio_esfera(u, v, C, R * 0.925); oo, dd = raio(u, v)
        P2 = oo + dd * (prof / dd.dot(fwd)) if False else ponto_raio_plano(u, v, cam.location + fwd * prof, fwd)
        if P1 is None: P1 = P2 - fwd * 0.01
        topo.append(bm.verts.new(P1)); fundo_v.append(bm.verts.new(P2))
    n = len(cont)
    for i in range(n): bm.faces.new((topo[i], topo[(i + 1) % n], fundo_v[(i + 1) % n], fundo_v[i]))
    bm.faces.new(fundo_v)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bege_s = novo_obj('nucleo_bege', bm); bege_s.data.materials.append(bege)
    dist_c_ = dist_c
    # massa vinho: triângulo arredondado convexo, apoiado na face bege
    fundo = ponto_raio_plano(590, 520, cam.location + fwd * prof, fwd)
    tri2 = [(590, 446), (528, 584), (646, 588)]
    cont2 = contorno_arred(tri2, rr=[12, 20, 20], n=12)
    bm = bmesh.new(); s_ = escala_px(fundo); _, up, fwd = eixos_tela(); rt = eixos_tela()[0]
    cx, cy = np.mean(cont2, axis=0)
    pts2 = [Vector(fundo) + rt * ((u - 590) * s_) - up * ((v - 520) * s_) for (u, v) in cont2]
    # cúpula: anéis concêntricos que sobem para a câmera
    centro = Vector(fundo) + rt * ((cx - 590) * s_) - up * ((cy - 520) * s_)
    aneis = 10; verts = []
    for k in range(aneis + 1):
        f = 1 - k / aneis; alt = math.sqrt(max(0, 1 - f * f)) * R * 0.30
        verts.append([bm.verts.new(centro + (p - centro) * f - fwd * alt) for p in pts2])
    n = len(pts2)
    for k in range(aneis):
        for i in range(n): bm.faces.new((verts[k][i], verts[k][(i + 1) % n], verts[k + 1][(i + 1) % n], verts[k + 1][i]))
    bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-5)
    mv = novo_obj('massa_vinho', bm); suaviza(mv); mv.data.materials.append(vinho)
    sd = mv.modifiers.new('sub', 'SUBSURF'); sd.levels = 2; aplica_mods(mv)
    dg = bpy.context.evaluated_depsgraph_get(); bmv = bmesh.new(); bmv.from_object(mv, dg); bmv.transform(mv.matrix_world); bvh_v = BVHTree.FromBMesh(bmv); bmv.free()
    for (u, v) in [(594, 472), (560, 486), (589, 503), (555, 520), (617, 527), (585, 537), (562, 557), (603, 562), (540, 545), (634, 556), (620, 495)]:
        oo, dd = raio(u, v); h = bvh_v.ray_cast(oo, dd)
        if h[0] is None: continue
        esfera('furo', h[0] + h[1] * 0.002, 0.0115 * R / 0.27, escuro, esc=(1, 1, 0.35)).rotation_euler = h[1].to_track_quat('Z', 'Y').to_euler()
    # cromossomos roxos (X, Y e pares) deitados na face bege
    roxo = material('cromossomo', '#7b4fd0', rug=0.35, coat=0.35)
    bvh_b = None
    dg = bpy.context.evaluated_depsgraph_get(); bmb = bmesh.new(); bmb.from_object(bege_s, dg); bmb.transform(bege_s.matrix_world); bvh_b = BVHTree.FromBMesh(bmb); bmb.free()
    def haste(p0, p1, r):
        return curva('crom', [p0, (p0 + p1) / 2, p1], r, roxo)
    for (u, v, tipo, ang, tam) in [(565, 455, 'X', 60, 24), (615, 443, 'X', 75, 26), (628, 476, 'Y', 70, 22), (537, 494, 'Y', 30, 20),
                                   (518, 540, 'X', 80, 22), (646, 546, 'X', 85, 22), (548, 582, 'P', 5, 34), (613, 592, 'X', 10, 22)]:
        oo, dd = raio(u, v); h = bvh_b.ray_cast(oo, dd)
        if h[0] is None: continue
        P, N = h[0], h[1]; s_ = escala_px(P) * tam / 2; r = 0.0075 * R / 0.27
        a = math.radians(ang)
        def dirc(aa): return (rt * math.cos(aa) - up * math.sin(aa))
        c0 = P + N * r * 0.6
        if tipo == 'X':
            for da in (0.45, -0.45): e = dirc(a + da); haste(c0 - e * s_, c0 + e * s_, r)
        elif tipo == 'Y':
            e = dirc(a); haste(c0 - e * s_, c0, r)
            for da in (0.5, -0.5): haste(c0, c0 + dirc(a + da) * s_ * 0.9, r)
        else:
            e = dirc(a); nrm = dirc(a + math.pi / 2) * s_ * 0.12
            for k in (1, -1): haste(c0 - e * s_ + nrm * k, c0 + e * s_ + nrm * k, r)
    # poros na face vermelha da direita
    for (u, v, a, b, ang) in [(670, 439, 9, 6, 0.3), (721, 505, 4, 10, 0.0), (707, 588, 7, 5, 0.2)]:
        P = ponto_raio_esfera(u, v, C, R)
        if P is None: continue
        N = (P - C).normalized(); s_ = escala_px(P)
        e = esfera('poro', P - N * 0.002, 1.0, escuro, esc=(a * s_, b * s_, 0.006), seg=24)
        orienta(e, P - N * 0.002, N, rt); e.scale = (a * s_, b * s_, 0.006)
    return C, R

# ---------------------------------------------------------------- 7. placas laranjas
def laranjas():
    m = material('rer', '#b9531a', rug=0.48, coat=0.15, sss=0.05)
    C, R = NUC['C'], NUC['R']; rt, up, fwd = eixos_tela()
    Z0 = float(os.environ.get('PISO', 0.86))
    # (u, v, comprimento px, largura px, ângulo na tela, onde: 'n' sobre o núcleo / 'p' no piso, espessura relativa)
    pecas = [  # medidas na referência (pixels 1080): centro, comprimento, largura, ângulo, onde, espessura/largura
        (577, 352, 118, 42, -8, 'n', 0.55), (600, 372, 100, 36, -4, 'n', 0.5), (677, 361, 92, 42, 25, 'n', 0.55), (547, 402, 92, 50, -22, 'n', 0.6),
        (705, 404, 62, 46, 52, 'n', 0.55), (630, 338, 70, 30, 8, 'n', 0.45),
        (474, 440, 96, 68, -70, 'n', 0.5), (487, 508, 150, 50, 82, 'n', 0.55), (441, 577, 126, 46, 86, 'n', 0.6), (500, 592, 62, 40, 60, 'n', 0.5),
        (550, 660, 86, 40, -5, 'p', 0.75), (609, 643, 72, 48, 0, 'p', 0.75), (686, 641, 94, 50, -12, 'p', 0.75), (555, 612, 52, 40, -10, 'p', 0.6),
        (735, 592, 72, 40, -55, 'p', 0.7), (767, 520, 62, 40, 75, 'n', 0.55), (783, 594, 66, 40, -60, 'p', 0.7), (752, 470, 50, 32, 70, 'n', 0.5),
    ]
    for i, (u, v, L, Wd, ang, onde, esp) in enumerate(pecas):
        if onde == 'n':
            P = ponto_raio_esfera(u, v, C, R * 1.06)
            if P is None: P = ponto_raio_esfera(u, v, C, R * 1.16)
            if P is None: P = ponto_raio_esfera(u, v, C, R * 1.3)
            if P is None: continue
            N = (P - C).normalized()
        else:
            P = ponto_raio_plano(u, v, (0, 0, Z0), Vector((0, 0, 1)))
            hz = Vector((P.x - C.x, P.y - C.y, 0))
            if hz.length < R * 1.15:  # o raio cai atrás do núcleo: a peça fica no piso, encostada na frente dele
                P2 = ponto_raio_esfera(u, v, C, R * 1.13)
                if P2 is not None: P = P2
            N = (Vector((0, 0, 1)) + (P - C).normalized() * 0.8).normalized()
            P = P + Vector((0, 0, 0.02))
        s_ = escala_px(P); a = math.radians(ang); eixo = rt * math.cos(a) - up * math.sin(a)
        Lw = L * s_; Ww = Wd * s_ * (1.0 if onde == 'n' else 1.15); esp = esp if onde == 'n' else esp * 0.6
        o = almofada(f'rer{i}', Lw, Ww, Ww * esp, m, curv=0.45 if onde == 'n' else 0.15, pont=0.6)
        orienta(o, P, N, eixo)


# ---------------------------------------------------------------- 8. mitocôndrias (4)
def _labirinto(x, y, sd):
    wx = x + 0.007 * np.sin(y * 95 + sd); wy = y + 0.007 * np.sin(x * 85 + 2 * sd)
    return np.sin(wx * 150 + 1.6 * np.sin(wy * 60 + sd)) + 0.85 * np.sin(wy * 165 + 1.5 * np.sin(wx * 50 + 3 * sd))

def mitocondria(nome, P0, P1, N, larg, alt, mats, sd=1):
    L = (P1 - P0).length; eixo = (P1 - P0).normalized(); C = (P0 + P1) / 2
    # contorno de feijão (concavidade discreta num dos lados)
    def cont(Lx, Wy, n=72):
        pts = []
        for i in range(n):
            t = i / n * 2 * math.pi; c, s_ = math.cos(t), math.sin(t)
            pts.append((Lx / 2 * math.copysign(abs(c) ** 0.75, c), Wy / 2 * math.copysign(abs(s_) ** 0.75, s_) - 0.12 * Wy * c * c))
        return pts
    ext = cont(L, larg); esp = 0.016
    inn = cont(L - 2 * esp, larg - 2 * esp)
    bm = bmesh.new()
    def anel(pts, z): return [bm.verts.new((x, y, z)) for x, y in pts]
    n = len(ext); e0 = anel(ext, 0); e1 = anel(ext, alt); i1 = anel(inn, alt); i0 = anel(inn, alt * 0.25)
    for a_, b_ in ((e0, e1), (e1, i1), (i1, i0)):
        for i in range(n): bm.faces.new((a_[i], a_[(i + 1) % n], b_[(i + 1) % n], b_[i]))
    bm.faces.new(e0[::-1])
    ob = novo_obj(nome, bm); ob.data.materials.append(mats['parede'])
    bv = ob.modifiers.new('bv', 'BEVEL'); bv.width = 0.006; bv.segments = 3; bv.limit_method = 'ANGLE'
    sb = ob.modifiers.new('sb', 'SUBSURF'); sb.levels = 1; aplica_mods(ob); suaviza(ob)
    # fundo com cristas (labirinto) em relevo real e cor por vértice
    nx, ny = int(L * 900), int(larg * 900)
    bm = bmesh.new(); bmesh.ops.create_grid(bm, x_segments=nx, y_segments=ny, size=0.5)
    for v in bm.verts: v.co.x *= L - 2 * esp; v.co.y *= larg - 2 * esp
    poly = inn
    def dentro(x, y):
        c = False; m = len(poly)
        for i in range(m):
            (x1, y1), (x2, y2) = poly[i], poly[(i + 1) % m]
            if (y1 > y) != (y2 > y) and x < (x2 - x1) * (y - y1) / (y2 - y1) + x1: c = not c
        return c
    bmesh.ops.delete(bm, geom=[f for f in bm.faces if not dentro(*f.calc_center_median()[:2])], context='FACES')
    X = np.array([v.co.x for v in bm.verts]); Y = np.array([v.co.y for v in bm.verts]); e = 1e-4
    f0 = _labirinto(X, Y, sd); gx = (_labirinto(X + e, Y, sd) - f0) / e; gy = (_labirinto(X, Y + e, sd) - f0) / e
    d = np.abs(f0) / np.maximum(1e-3, np.hypot(gx, gy)); t = np.clip((0.0145 - d) / 0.008, 0, 1); h = np.sqrt(t * (2 - t))
    for v, hh in zip(bm.verts, h): v.co.z = alt * 0.25 + 0.022 * hh
    fu = novo_obj(nome + '_cristas', bm)
    cl = fu.data.color_attributes.new('cor', 'FLOAT_COLOR', 'POINT')
    cE = np.array(cor('#3a0f6e')[:3]); cC = np.array(cor('#a079e0')[:3])
    col = cE * (1 - h[:, None]) + cC * h[:, None]
    cl.data.foreach_set('color', np.concatenate([col, np.ones((len(col), 1))], 1).astype(np.float32).ravel())
    fu.data.materials.append(mats['cristas']); suaviza(fu)
    for o in (ob, fu): orienta(o, C, N, eixo)
    return ob

def mitocondrias():
    mats = {'parede': material('mito', '#7d1ca6', rug=0.3, coat=0.5), 'cristas': material('cristas', '#ffffff', rug=0.4, coat=0.2, vcor='cor')}
    Z0 = float(os.environ.get('PISO', 0.86)); cima = Vector((0, 0, 1)); fora = Vector((1, 0, 0))
    def no_piso(u, v): return ponto_raio_plano(u, v, (0, 0, Z0), cima)
    def na_parede(u, v, h=0.03):
        p, nr = na_tela(u, v); return (p + nr * h, nr) if p is not None else (None, None)
    # piso: (ponta esquerda, ponta direita, largura px)
    for i, (a, b, lg) in enumerate([((413, 752), (558, 780), 58), ((774, 744), (902, 711), 48)]):
        P0, P1 = no_piso(*a), no_piso(*b); s_ = escala_px((P0 + P1) / 2)
        mitocondria(f'mito_p{i}', P0, P1, cima, lg * s_ * 1.6, 0.05, mats, sd=i + 1)
    # parede: superior esquerda (diagonal ascendente) e superior direita (quase vertical)
    for i, (a, b, lg, h) in enumerate([((370, 336), (466, 262), 52, 0.035), ((759, 306), (755, 410), 40, 0.035)]):
        P0, N0 = na_parede(*a, h); P1, N1 = na_parede(*b, h)
        if P0 is None or P1 is None: continue
        N = ((N0 + N1) / 2).normalized(); s_ = escala_px((P0 + P1) / 2)
        mitocondria(f'mito_w{i}', P0, P1, N, lg * s_ * 1.05, 0.045, mats, sd=i + 5)

# ---------------------------------------------------------------- 9. estrutura rosa perfurada (metabolas)
def rosa():
    m = material('rosa', '#b8285a', rug=0.42, coat=0.22, sss=0.06)
    nos = {0: (667, 80), 1: (650, 130), 2: (612, 152), 3: (642, 186), 4: (690, 178), 5: (712, 165), 6: (748, 170), 7: (727, 205),
           8: (772, 214), 9: (800, 200), 10: (836, 199), 11: (862, 194), 12: (792, 240), 13: (830, 246), 14: (862, 252),
           15: (742, 252), 16: (702, 240), 17: (667, 226), 18: (745, 288), 19: (792, 276), 20: (588, 178), 21: (640, 236)}
    arestas = [(0, 1), (1, 2), (1, 4), (2, 20), (2, 3), (3, 4), (3, 17), (17, 21), (4, 5), (5, 6), (6, 7), (7, 16), (16, 17), (7, 8),
               (8, 9), (9, 10), (10, 11), (8, 12), (12, 13), (13, 14), (12, 19), (15, 16), (15, 12), (15, 18), (9, 12), (4, 7)]
    membranas = [(1, 2, 3, 0.9), (2, 3, 20, 0.7), (4, 5, 7, 0.6), (8, 9, 12, 0.6), (12, 15, 16, 0.5)]   # superfícies espessas
    furos = [(660, 108, 0.022), (630, 165, 0.016), (612, 135, 0.012), (700, 205, 0.014), (785, 228, 0.012), (752, 232, 0.013), (818, 222, 0.011)]
    P = {}
    for k, (u, v) in nos.items():
        p, nr = na_tela(u, v)
        if p is None: continue
        P[k] = p + nr * (0.07 + 0.02 * math.sin(k * 1.7))
    mb = bpy.data.metaballs.new('rosa'); mb.resolution = 0.008; mb.render_resolution = 0.006; mb.threshold = 0.6
    ob = bpy.data.objects.new('rosa', mb); bpy.context.collection.objects.link(ob); mb.materials.append(m)
    def bola(p, r, neg=False):
        el = mb.elements.new(); el.co = p; el.radius = r; el.use_negative = neg; el.stiffness = 2.0
    for a, b in arestas:
        if a not in P or b not in P: continue
        A, B = P[a], P[b]; n = max(3, int((B - A).length / 0.012))
        for i in range(n + 1): bola(A.lerp(B, i / n), 0.031)
    for k, p in P.items(): bola(p, 0.044 if k not in (0, 11, 14, 18) else 0.036)
    for a, b, c, f in membranas:
        if not all(x in P for x in (a, b, c)): continue
        for i in range(6):
            for j in range(6 - i):
                w = (i / 6, j / 6, 1 - i / 6 - j / 6); q = P[a] * w[0] + P[b] * w[1] + P[c] * w[2]; bola(q, 0.03 * f + 0.012)
    for (u, v, r) in furos:
        p, nr = na_tela(u, v)
        if p is None: continue
        bola(p + nr * 0.07, r * 2.0, neg=True)
    return ob

# ---------------------------------------------------------------- 10. conjunto azul (Golgi)
def golgi():
    m = material('golgi', '#2e48c8', rug=0.38, coat=0.3, sss=0.04); esc = material('golgi_dentro', '#0a1240', rug=0.7)
    Z0 = float(os.environ.get('PISO', 0.86)); cima = Vector((0, 0, 1)); rt, up, fwd = eixos_tela()
    def base(u, v): return ponto_raio_plano(u, v, (0, 0, Z0), cima)
    def altura(B, v_topo):
        lo, hi = 0.0, 1.0
        for _ in range(40):
            mid = (lo + hi) / 2
            if para_tela(B + cima * mid)[1] > v_topo: lo = mid
            else: hi = mid
        return (lo + hi) / 2
    # perfil da dobra (seção): retângulo arredondado
    pr = bpy.data.curves.new('perfil', 'CURVE'); sp = pr.splines.new('POLY'); pts = []
    W2, T2, rr = 0.028, 0.022, 0.016
    for cx, cy, a0 in ((W2 - rr, T2 - rr, 0), (-W2 + rr, T2 - rr, 90), (-W2 + rr, -T2 + rr, 180), (W2 - rr, -T2 + rr, 270)):
        for k in range(7): a = math.radians(a0 + k * 15); pts.append((cx + rr * math.cos(a), cy + rr * math.sin(a)))
    sp.points.add(len(pts) - 1)
    for i, (x, y) in enumerate(pts): sp.points[i].co = (x, y, 0, 1)
    sp.use_cyclic_u = True
    perfil = bpy.data.objects.new('perfil', pr); bpy.context.collection.objects.link(perfil); perfil.hide_render = True
    # dobras altas: (perna esquerda base u, perna direita base u, v da base, v do topo)
    dir_h = (rt - cima * rt.dot(cima)).normalized()
    for i, (ue, ud, vb, vt) in enumerate([(858, 893, 585, 462), (898, 940, 575, 450), (957, 996, 612, 494)]):
        Be, Bd = base(ue, vb), base(ud, vb); Bm = (Be + Bd) / 2; H = altura(Bm, vt + 8)
        r = (Bd - Be).length / 2; caminho = []
        for k in range(12): caminho.append(Be + cima * (H - r) * k / 11)
        for k in range(1, 16):
            a = math.pi - math.pi * k / 15; caminho.append(Bm + (Bd - Be).normalized() * r * math.cos(a) + cima * (H - r + r * math.sin(a)))
        for k in range(1, 12): caminho.append(Bd + cima * (H - r) * (1 - k / 11))
        cd = bpy.data.curves.new(f'dobra{i}', 'CURVE'); cd.dimensions = '3D'; cd.bevel_mode = 'OBJECT'; cd.bevel_object = perfil; cd.use_fill_caps = True
        spl = cd.splines.new('POLY'); spl.points.add(len(caminho) - 1)
        for j, q in enumerate(caminho): spl.points[j].co = (*q, 1)
        o = bpy.data.objects.new(f'dobra{i}', cd); bpy.context.collection.objects.link(o); cd.materials.append(m)
        # fundo escuro entre as pernas (interior da bolsa)
        bmf = bmesh.new(); pa = Be + cima * 0.01 - fwd * 0.0; vs = [bmf.verts.new(Be), bmf.verts.new(Bd), bmf.verts.new(Bd + cima * (H - r)), bmf.verts.new(Be + cima * (H - r))]
        bmf.faces.new(vs); fo = novo_obj(f'dobra_fundo{i}', bmf); fo.data.materials.append(esc)
        fo.location = fwd * 0.02
    # bolsas da frente: tubos ocos de seção oval (larga à esquerda, estreita à direita)
    for i, (uc, vb, wpx, dpx, vt) in enumerate([(872, 632, 76, 34, 548), (962, 648, 48, 26, 568)]):
        B = base(uc, vb); s_ = escala_px(B); H = altura(B, vt + 6)
        a, b = wpx * s_ / 2, dpx * s_ / 1.2
        bm = bmesh.new(); n = 40; anel0 = []; anel1 = []
        for k in range(n):
            t = k / n * 2 * math.pi; q = dir_h * (a * math.cos(t)) + (cima.cross(dir_h)) * (b * math.sin(t))
            anel0.append(bm.verts.new(B + q)); anel1.append(bm.verts.new(B + q + cima * H))
        for k in range(n): bm.faces.new((anel0[k], anel0[(k + 1) % n], anel1[(k + 1) % n], anel1[k]))
        bm.faces.new(anel0[::-1])
        o = novo_obj(f'bolsa{i}', bm); o.data.materials.append(m); o.data.materials.append(esc)
        so = o.modifiers.new('esp', 'SOLIDIFY'); so.thickness = 0.018; so.offset = -1; so.material_offset = 1; so.material_offset_rim = 0
        bv = o.modifiers.new('bv', 'BEVEL'); bv.width = 0.007; bv.segments = 4
        sb = o.modifiers.new('sb', 'SUBSURF'); sb.levels = 1
        aplica_mods(o); suaviza(o)
        # fundo escuro dentro
        esfera('bolsa_fundo', B + cima * H * 0.5, 1.0, esc, esc=(a * 0.85, b * 0.85, H * 0.45)).rotation_euler = (0, 0, math.atan2(dir_h.y, dir_h.x))

# ---------------------------------------------------------------- 11. ninho turquesa + feixes dourados
def ninho_e_ouro(m_turq):
    rt, up, fwd = eixos_tela(); p, nr = na_tela(312, 622)
    if p is None: return
    eixo = (nr * 0.55 - fwd * 0.6 + rt * 0.35).normalized()     # boca virada para quem olha, à direita
    s_ = escala_px(p); Rb = 72 * s_; prof = 0.24
    centro_boca = p + nr * 0.05
    escuro = material('ninho', '#0d3442', rug=0.85)
    # concha do ninho (superfície escura por dentro), perfil de funil
    bm = bmesh.new(); n = 48; aneis = 10; vs = []
    for j in range(aneis + 1):
        f = j / aneis; r = Rb * (1 - 0.82 * f ** 1.4); z = -prof * f
        vs.append([bm.verts.new((r * math.cos(2 * math.pi * k / n), r * math.sin(2 * math.pi * k / n), z)) for k in range(n)])
    for j in range(aneis):
        for k in range(n): bm.faces.new((vs[j][k], vs[j][(k + 1) % n], vs[j + 1][(k + 1) % n], vs[j + 1][k]))
    conc = novo_obj('ninho', bm); conc.data.materials.append(escuro); suaviza(conc)
    orienta(conc, centro_boca, eixo, rt)
    bpy.context.view_layer.update()
    # cordões turquesa sobre a concha: Voronoi no espaço (ângulo, profundidade), projetado na superfície
    from scipy.spatial import Voronoi
    r = np.random.default_rng(5); pts = []
    for j in range(9):
        for k in range(22): pts.append(((k + 0.5 * (j % 2) + (r.random() - .5) * 0.5) / 22, (j - 0.5 + (r.random() - .5) * 0.5) / 7.5))
    pts = np.array(pts); pts = np.concatenate([pts, pts + [1, 0], pts - [1, 0]])
    vor = Voronoi(pts); M = conc.matrix_world
    def sup(a, f):
        rr = Rb * (1 - 0.82 * max(0, min(1, f)) ** 1.4) + 0.008; z = -prof * max(0, min(1, f))
        return M @ Vector((rr * math.cos(2 * math.pi * a), rr * math.sin(2 * math.pi * a), z))
    k = 0
    for a_, b_ in vor.ridge_vertices:
        if a_ < 0 or b_ < 0: continue
        A, B = vor.vertices[a_], vor.vertices[b_]
        if not (0 <= A[0] < 1 and 0 <= B[0] <= 1.05 and -0.05 <= A[1] <= 0.95 and -0.05 <= B[1] <= 0.95): continue
        if abs(A[0] - B[0]) > 0.5: continue
        seg = [sup(*(A + (B - A) * t)) for t in np.linspace(0, 1, 6)]
        curva(f'ninho_c{k}', seg, 0.009, m_turq); k += 1
    # borda da boca do ninho, espessa
    # feixes dourados
    ouro = material('ouro', '#d6a62a', rug=0.3, coat=0.5, sss=0.0)
    ouro.node_tree.nodes['Principled BSDF'].inputs['Metallic'].default_value = 0.25
    def feixe(u0, v0, u1, v1, n, rmax, rt_=0.0042, desv=0.003):
        A, _ = na_tela(u0, v0); B, _ = na_tela(u1, v1)
        A = centro_boca + (A - centro_boca) * 0.4 - eixo * 0.03; B = centro_boca + (B - centro_boca) * 0.6 + eixo * 0.06
        d = (B - A).normalized(); e1 = d.cross(Vector((0, 0, 1))).normalized(); e2 = d.cross(e1)
        rg = np.random.default_rng(n)
        for i in range(n):
            ang = rg.random() * 2 * math.pi; rr = rmax * math.sqrt(rg.random())
            off = e1 * (rr * math.cos(ang)) + e2 * (rr * math.sin(ang)); dl = (rg.random() - 0.5) * 0.03
            curva('fio', [A + off + d * dl, (A + B) / 2 + off * 1.05, B + off + d * dl], rt_, ouro)
    feixe(287, 684, 372, 588, 26, 0.03)
    # feixe de trás, de ponta (anel de hastes) com fios descendo
    P, _ = na_tela(296, 588); c0 = centro_boca + (P - centro_boca) * 0.5 - eixo * 0.08
    rg = np.random.default_rng(3)
    for i in range(22):
        ang = i / 22 * 2 * math.pi * 1.6; rr = 0.006 + 0.022 * (i / 22)
        q = c0 + rt * (rr * math.cos(ang)) + up * (rr * math.sin(ang))
        curva('fio2', [q + eixo * 0.03, q - up * 0.04 - eixo * 0.02, q - up * 0.09 - eixo * 0.05], 0.0038, ouro)

# ---------------------------------------------------------------- 12. grânulos vinho
def granulos():
    m = material('granulo', '#6a0c12', rug=0.35, coat=0.4)
    lista = [(575, 115, 3), (527, 150, 2), (485, 300, 2), (405, 385, 2), (800, 440, 2), (808, 555, 2), (458, 705, 3), (582, 692, 3),
             (724, 692, 3), (862, 685, 2), (340, 752, 3), (795, 350, 2), (790, 290, 2),
             (585, 780, 3), (606, 777, 3), (626, 771, 3), (646, 765, 3), (668, 760, 3), (690, 757, 3)]
    rg = np.random.default_rng(9)
    for (u, v, n) in lista:
        p, nr = na_tela(u, v)
        if p is None: continue
        s_ = escala_px(p); r = 5.5 * s_; t1 = nr.orthogonal().normalized(); t2 = nr.cross(t1); a0 = rg.random() * 6.28
        for k in range(n):
            a = a0 + k * 2 * math.pi / n; q = p + nr * r * 0.75 + (t1 * math.cos(a) + t2 * math.sin(a)) * r * 0.85
            esfera('gran', q, r, m, seg=16)

# ---------------------------------------------------------------- render
def render(saida):
    bpy.context.scene.render.filepath = saida
    bpy.ops.render.render(write_still=True)

if __name__ == '__main__':
    argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else sys.argv[1:]
    saida = argv[0]; tam = int(argv[1]) if len(argv) > 1 else 540; amostras = int(argv[2]) if len(argv) > 2 else 48
    etapa = int(argv[3]) if len(argv) > 3 else 99
    cena(tam, amostras)
    o = corpo(etapa); borda(o); prepara_raio(o)
    mt = rede_turquesa(); nucleo(); laranjas(); mitocondrias(); rosa(); golgi(); ninho_e_ouro(mt); granulos()
    render(saida)

def _debug_janela():
    pass

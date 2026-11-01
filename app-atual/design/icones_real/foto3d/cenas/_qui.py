"""Ajudantes do lote de Quimica (conteudos Q01.1..Q12.x): torno (solidos de revolucao: vidraria e liquidos),
moleculas bola-e-vareta com geometria do RDKit (cores CPK) e utilidades. Usa o kit.py da pasta foto3d."""
import sys, os, math
AQUI = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, AQUI)
from kit import *
import bpy, bmesh, mathutils
from mathutils import Vector, Matrix

INTER = '/usr/share/fonts/opentype/inter/Inter-Bold.otf'

def out(ID):
    return os.path.join(AQUI, 'render', ID + '.png')

def torno(perfil, m, loc=(0, 0, 0), seg=72, fechado=True, suave=True, nome='torno'):
    """Solido de revolucao em torno do eixo Z. perfil = lista de (r, z). Se fechado, liga o ultimo ao primeiro
    (use para paredes de vidro: desce por fora e sobe por dentro). Pontos com r=0 viram polo."""
    me = bpy.data.meshes.new(nome); bm = bmesh.new()
    aneis = []
    for (r, z) in perfil:
        if r <= 1e-6:
            aneis.append([bm.verts.new((0, 0, z))])
        else:
            aneis.append([bm.verts.new((r * math.cos(2 * math.pi * k / seg), r * math.sin(2 * math.pi * k / seg), z)) for k in range(seg)])
    n = len(aneis); pares = list(range(n - 1)) + ([n - 1] if fechado else [])
    for i in pares:
        A = aneis[i]; B = aneis[(i + 1) % n]
        for k in range(seg):
            if len(A) == 1 and len(B) == 1: continue
            if len(A) == 1:
                bm.faces.new((A[0], B[(k + 1) % seg], B[k]))
            elif len(B) == 1:
                bm.faces.new((A[k], A[(k + 1) % seg], B[0]))
            else:
                bm.faces.new((A[k], A[(k + 1) % seg], B[(k + 1) % seg], B[k]))
    bmesh.ops.reverse_faces(bm, faces=list(bm.faces))  # normais para fora (conferido no render)
    bm.to_mesh(me); bm.free()
    o = bpy.data.objects.new(nome, me); bpy.context.scene.collection.objects.link(o); o.location = loc
    if m is not None: me.materials.append(m)
    if suave:
        for p in me.polygons: p.use_smooth = True
    return o

def parede(ext, esp=0.035, borda=True):
    """Gera perfil fechado de parede de vidro a partir do contorno externo ext=[(r,z) de baixo p/ cima], com fundo.
    O primeiro ponto deve ser (0, z_fundo). Retorna perfil: externo subindo, labio, interno descendo."""
    ext = list(ext)
    inn = []
    for (r, z) in reversed(ext):
        inn.append((max(0.0, r - esp), z if z != ext[0][1] else z + esp))
    topo = ext[-1]
    perfil = ext + [(topo[0] - esp * 0.5, topo[1] + esp * 0.35)] + inn
    return perfil

def liquido_de(ext, esp, z_nivel, m, loc=(0, 0, 0), menisco=0.0):
    """Liquido que preenche a vidraria de contorno externo ext ate z_nivel."""
    pts = [(0, ext[0][1] + esp + 0.002)]
    for (r, z) in ext[1:]:
        zz = max(z, ext[0][1] + esp + 0.002)
        if zz >= z_nivel: break
        pts.append((max(0.0, r - esp - 0.004), zz))
    # raio no nivel por interpolacao
    rn = None
    for (r0, z0), (r1, z1) in zip(ext, ext[1:]):
        if z0 <= z_nivel <= z1 and z1 > z0:
            rn = r0 + (r1 - r0) * (z_nivel - z0) / (z1 - z0); break
    rn = (rn or ext[-1][0]) - esp - 0.004
    pts.append((rn, z_nivel))
    if menisco:
        pts.append((rn * 0.8, z_nivel - menisco * 0.6)); pts.append((rn * 0.4, z_nivel - menisco))
    pts.append((0, z_nivel - menisco))
    return torno(pts, m, loc=loc, fechado=False)

def cilindro_ext(r, h, z0=0, cant=0.06):
    """contorno externo de copo/bequer: fundo arredondado"""
    return [(0, z0), (r - cant, z0), (r - cant * 0.3, z0 + cant * 0.3), (r, z0 + cant), (r, z0 + h)]

# ---------------- moleculas ----------------
CPK = {'H': '#c4c4c4', 'C': '#262626', 'N': '#1f5fd6', 'O': '#d62828', 'Cl': '#2e9e44', 'F': '#9be25a',
       'Br': '#8a1d1d', 'Na': '#7b2cbf', 'S': '#f2c40f', 'P': '#ef8a1a'}
RAIO = {'H': 0.26, 'C': 0.36, 'N': 0.35, 'O': 0.35, 'Cl': 0.46, 'F': 0.32, 'Br': 0.50, 'Na': 0.40, 'S': 0.44, 'P': 0.42}
_mats = {}
def mat_atomo(s):
    if s not in _mats:
        _mats[s] = plastico(CPK[s], 0.22)
    return _mats[s]

def coords_rdkit(smiles, seed=7, hs=True):
    from rdkit import Chem
    from rdkit.Chem import AllChem
    mol = Chem.MolFromSmiles(smiles)
    if hs: mol = Chem.AddHs(mol)
    AllChem.EmbedMolecule(mol, randomSeed=seed); AllChem.MMFFOptimizeMolecule(mol)
    Chem.Kekulize(mol, clearAromaticFlags=True)
    conf = mol.GetConformer()
    at = [(a.GetSymbol(), Vector(conf.GetAtomPosition(i))) for i, a in enumerate(mol.GetAtoms())]
    lig = []
    for b in mol.GetBonds():
        o = b.GetBondTypeAsDouble(); lig.append((b.GetBeginAtomIdx(), b.GetEndAtomIdx(), 1.5 if b.GetIsAromatic() else o))
    return at, lig

def orienta_pca(at, rot_extra=(0, 0, 0)):
    import numpy as np
    P = np.array([list(p) for _, p in at]); c = P.mean(0); P = P - c
    pes = np.array([list(p) for s_, p in at if s_ != 'H']) - c
    base = pes if len(pes) >= 3 else P
    u, s, vt = np.linalg.svd(base - base.mean(0), full_matrices=False)
    # PC1 -> x, PC2 -> z, PC3 -> -y (de frente para a camera)
    R = np.array([vt[0], -vt[2], vt[1]])
    if np.linalg.det(R) < 0: R[1] = -R[1]
    Q = P @ R.T
    M = mathutils.Euler([math.radians(a) for a in rot_extra]).to_matrix()
    return [(s_, M @ Vector(q)) for (s_, _), q in zip(at, Q)]

def molecula(at, lig, escala=1.0, loc=(0, 0, 0), r_lig=0.075, cor_lig='#bdbdbd', z_min=0.3, raio_k=1.32, multiplas=True, destaque=None):
    r_lig = r_lig * 1.3
    """desenha bola-e-vareta. at: [(simbolo, Vector)] em angstrom; escala converte para unidades da cena."""
    ml = plastico(cor_lig, 0.3)
    pos = [p * escala for _, p in at]
    zmin = min(p.z - RAIO[s] * raio_k for (s, _), p in zip(at, pos))
    off = Vector(loc) + Vector((0, 0, z_min - zmin))
    pos = [p + off for p in pos]
    objs = []
    for (s, _), p in zip(at, pos):
        objs.append(esfera(tuple(p), RAIO[s] * raio_k, mat_atomo(s), seg=48))
    for (i, j, o) in lig:
        a, b = pos[i], pos[j]
        n = int(round(o)) if multiplas else 1
        if o == 1.5: n = 1
        mlx = plastico(destaque[(i, j)], 0.2) if destaque and (i, j) in destaque else ml
        if n == 1:
            objs.append(bastao(tuple(a), tuple(b), r_lig * (1.25 if mlx is not ml else 1), mlx))
        else:
            d = (b - a).normalized()
            # vetor perpendicular no plano dos vizinhos
            viz = [pos[k] for (x, y, _) in lig for k in ((y,) if x == i else (x,) if y == i else ()) if k != j]
            ref = (viz[0] - a) if viz else d.cross(Vector((0, -1, 0.5)))
            if abs(ref.normalized().dot(d)) > 0.95: ref = Vector((0, 0, 1)) if abs(d.z) < 0.9 else Vector((1, 0, 0))
            perp = (ref - d * ref.dot(d)).normalized()
            gap = r_lig * 1.5
            offs = [-gap, gap] if n == 2 else [-gap * 1.6, 0, gap * 1.6]
            for g in offs:
                objs.append(bastao(tuple(a + perp * g), tuple(b + perp * g), r_lig * (0.72 if n == 2 else 0.6), mlx))
    return objs, pos

def cena_q(mundo_vidro=0.7):
    """cena() do kit + ajustes para vidro: o chao (shadow catcher) nao aparece atraves do vidro e os raios
    refratados enxergam um ambiente claro (vidro limpo como na referencia, em vez de escuro)."""
    sc = cena()
    ch = bpy.data.objects['CHAO']; ch.visible_transmission = False
    w = sc.world; nt = w.node_tree; bg = nt.nodes['Background']; outn = nt.nodes['World Output']
    bg2 = nt.nodes.new('ShaderNodeBackground'); bg2.inputs[0].default_value = (1, 1, 1, 1); bg2.inputs[1].default_value = mundo_vidro
    lp = nt.nodes.new('ShaderNodeLightPath'); mx = nt.nodes.new('ShaderNodeMixShader')
    nt.links.new(lp.outputs['Is Transmission Ray'], mx.inputs[0])
    nt.links.new(bg.outputs[0], mx.inputs[1]); nt.links.new(bg2.outputs[0], mx.inputs[2])
    nt.links.new(mx.outputs[0], outn.inputs[0])
    sc.cycles.samples = 48
    sc.cycles.transmission_bounces = 16; sc.cycles.max_bounces = 16; sc.cycles.transparent_max_bounces = 16
    return sc

# ---------------- vidraria pronta ----------------
def grupo(objs, loc=(0, 0, 0), rot=(0, 0, 0)):
    """agrupa objetos sob um empty (para mover/girar o conjunto). rot em graus."""
    e = bpy.data.objects.new('grp', None); bpy.context.scene.collection.objects.link(e)
    for o in objs:
        o.parent = e
    e.location = loc; e.rotation_euler = [math.radians(a) for a in rot]
    return e

def marcas(r, z0, z1, n, loc=(0, 0, 0), ang=-70, larg=0.12, m=None, longa=2):
    """tracos de graduacao brancos na superficie do vidro (ang = posicao angular em graus, -90 = de frente p/ camera)"""
    m = m or fosco('#ffffff', 0.5); objs = []
    a = math.radians(ang)
    for i in range(n):
        z = z0 + (z1 - z0) * i / max(1, n - 1)
        L = larg * (1.6 if i % longa == 0 else 1.0)
        o = caixa((loc[0] + r * math.cos(a), loc[1] + r * math.sin(a), loc[2] + z), (0.012, L, 0.018), m, chanfro=0)
        o.rotation_euler = (0, 0, a); objs.append(o)
    return objs

def tubo_ensaio(R=0.32, H=2.6, nivel=1.4, cor=None, esp=0.028, loc=(0, 0, 0)):
    ext = [(0, 0)] + [(R * math.sin(a), R - R * math.cos(a)) for a in [i * math.pi / 2 / 12 for i in range(1, 13)]] + [(R, H)]
    objs = [torno(parede(ext, esp), vidro(), loc=loc), toro((loc[0], loc[1], loc[2] + H), R - esp * 0.4, esp * 0.75, vidro())]
    if cor: objs.append(liquido_de(ext, esp, nivel, liquido(cor) if isinstance(cor, str) else cor, loc=loc, menisco=0.04))
    return objs, ext

def bequer(R=0.9, H=1.6, nivel=1.0, cor=None, esp=0.035, loc=(0, 0, 0), grad=True, bico=True):
    ext = cilindro_ext(R, H)
    objs = [torno(parede(ext, esp), vidro(), loc=loc)]
    # labio virado para fora
    objs.append(toro((loc[0], loc[1], loc[2] + H), R + 0.01, esp * 0.8, vidro()))
    if bico:
        o = esfera((loc[0] + R * math.cos(math.radians(150)), loc[1] + R * math.sin(math.radians(150)), loc[2] + H - 0.02), 0.07, vidro())
        o.scale = (1.4, 1.4, 0.6); objs.append(o)
    if cor: objs.append(liquido_de(ext, esp, nivel, liquido(cor) if isinstance(cor, str) else cor, loc=loc, menisco=0.03))
    if grad: objs += marcas(R + 0.003, H * 0.25, H * 0.8, 5, loc=loc, ang=-60, larg=R * 0.18)
    return objs, ext

def proveta(R=0.32, H=3.2, nivel=2.0, cor=None, esp=0.03, loc=(0, 0, 0), base_cor='#1f5fd6'):
    z0 = 0.16
    ext = [(0, z0), (R - 0.03, z0), (R, z0 + 0.03), (R, z0 + H)]
    objs = [torno(parede(ext, esp), vidro(), loc=loc), toro((loc[0], loc[1], loc[2] + z0 + H), R + 0.005, esp * 0.8, vidro())]
    # base hexagonal de plastico
    bpy.ops.mesh.primitive_cylinder_add(vertices=6, radius=R * 2.1, depth=z0, location=(loc[0], loc[1], loc[2] + z0 / 2))
    b = bpy.context.object; _aplica_b(b, plastico(base_cor, 0.3)); objs.append(b)
    if cor: objs.append(liquido_de(ext, esp, nivel, liquido(cor) if isinstance(cor, str) else cor, loc=loc, menisco=0.05))
    objs += marcas(R + 0.002, z0 + H * 0.12, z0 + H * 0.9, 9, loc=loc, ang=-55, larg=R * 0.35)
    return objs, ext

def _aplica_b(o, m, ch=0.02):
    o.data.materials.append(m); md = o.modifiers.new('ch', 'BEVEL'); md.width = ch; md.segments = 4; md.limit_method = 'ANGLE'
    return o

def frasco(R=0.6, H=1.5, cor_vidro='#eef6ff', tampa='#1f5fd6', loc=(0, 0, 0), liq=None, nivel=None, ambar=False):
    """frasco de reagente: corpo cilindrico, ombro, gargalo e tampa de rosca"""
    ext = [(0, 0), (R - 0.08, 0), (R - 0.02, 0.02), (R, 0.08), (R, H), (R * 0.92, H + 0.18), (R * 0.65, H + 0.32), (R * 0.42, H + 0.4), (R * 0.4, H + 0.62)]
    vm = vidro(cor_vidro) if not ambar else liquido('#8a4a0e')
    objs = [torno(parede(ext, 0.035), vm, loc=loc)]
    objs.append(cilindro((loc[0], loc[1], loc[2] + H + 0.72), R * 0.47, 0.3, plastico(tampa, 0.35), chanfro=0.03))
    if liq: objs.append(liquido_de(ext, 0.035, nivel or H * 0.7, liquido(liq) if isinstance(liq, str) else liq, loc=loc))
    return objs, ext

def rotulo_cil(R, z, h, loc=(0, 0, 0), ang_c=-90, arco=110, m=None, esp=0.012):
    """faixa de papel/rotulo colada num cilindro (arco em graus centrado em ang_c)"""
    m = m or fosco('#fbfbf7', 0.6); pts = []
    me = bpy.data.meshes.new('rot'); bm = bmesh.new(); n = 32
    a0 = math.radians(ang_c - arco / 2); a1 = math.radians(ang_c + arco / 2)
    vs = []
    for i in range(n + 1):
        a = a0 + (a1 - a0) * i / n
        vs.append((bm.verts.new((R * math.cos(a), R * math.sin(a), z)), bm.verts.new((R * math.cos(a), R * math.sin(a), z + h))))
    for i in range(n):
        bm.faces.new((vs[i][0], vs[i + 1][0], vs[i + 1][1], vs[i][1]))
    bm.to_mesh(me); bm.free(); o = bpy.data.objects.new('rot', me); bpy.context.scene.collection.objects.link(o)
    o.location = loc; me.materials.append(m)
    for p in me.polygons: p.use_smooth = True
    md = o.modifiers.new('s', 'SOLIDIFY'); md.thickness = esp
    return o

def texto_cil(txt, R, z, tam, m, loc=(0, 0, 0), ang_c=-90):
    """texto plano voltado para fora de um cilindro, no angulo ang_c"""
    a = math.radians(ang_c)
    o = texto(txt, (loc[0] + R * math.cos(a), loc[1] + R * math.sin(a), loc[2] + z), tam, m, rot=(math.radians(90), 0, a + math.pi / 2), extr=0.006, fonte=INTER)
    # curva o texto em volta do cilindro
    md = o.modifiers.new('cv', 'SIMPLE_DEFORM') if False else None
    return o

def r_em(ext, z):
    for (r0, z0), (r1, z1) in zip(ext, ext[1:]):
        if z0 <= z <= z1 and z1 > z0:
            return r0 + (r1 - r0) * (z - z0) / (z1 - z0)
    return ext[-1][0]

def faixa(ext, esp, za, zb, m, loc=(0, 0, 0), n=40, menisco=0.0):
    """camada de liquido entre as alturas za e zb dentro de uma vidraria de contorno ext"""
    pts = [(0, za)]
    for i in range(n + 1):
        z = za + (zb - za) * i / n
        pts.append((max(0.004, r_em(ext, z) - esp - 0.004), z))
    rn = pts[-1][0]
    if menisco: pts += [(rn * 0.75, zb - menisco * 0.6), (rn * 0.35, zb - menisco)]
    pts.append((0, zb - menisco))
    return torno(pts, m if not isinstance(m, str) else liquido(m), loc=loc, fechado=False)

def suporte(loc=(0, 0, 0), h=4.2, base=(1.6, 1.0)):
    """suporte universal: base de ferro pintada, haste de aco"""
    mb = plastico('#2b2f36', 0.35); ma = metal('#c9ced6', 0.2)
    o1 = caixa((loc[0], loc[1], loc[2] + 0.07), (base[0], base[1], 0.14), mb, chanfro=0.04)
    o2 = cilindro((loc[0] - base[0] * 0.3, loc[1] + base[1] * 0.2, loc[2] + h / 2), 0.05, h, ma)
    return [o1, o2], (loc[0] - base[0] * 0.3, loc[1] + base[1] * 0.2)

def curva(pts, r, m, caps=True, poly=False, res=6):
    cu = bpy.data.curves.new('cv', 'CURVE'); cu.dimensions = '3D'
    if poly:
        sp = cu.splines.new('POLY'); sp.points.add(len(pts) - 1)
        for p, v in zip(sp.points, pts): p.co = (v[0], v[1], v[2], 1)
    else:
        sp = cu.splines.new('BEZIER'); sp.bezier_points.add(len(pts) - 1)
        for bp, p in zip(sp.bezier_points, pts): bp.co = p; bp.handle_left_type = bp.handle_right_type = 'AUTO'
    cu.bevel_depth = r; cu.bevel_resolution = res; cu.use_fill_caps = caps
    o = bpy.data.objects.new('cv', cu); bpy.context.scene.collection.objects.link(o)
    if m is not None: cu.materials.append(m)
    return o

# vidro do kit com IOR menor nas paredes finas: menos refracao "leitosa" nas bordas, o liquido aparece como na referencia
import kit as _kit
def vidro(hexa='#eef6ff', rugos=0.02, ior=1.25):
    m = _kit.vidro(hexa, rugos); m.node_tree.nodes['Principled BSDF'].inputs['IOR'].default_value = ior; return m

# B00 ícone principal de Biologia (03/11, v3): célula animal em corte (um quarto de cima removido), no padrão da
# referência 3D enviada pelo dono (docs/referencias/celula-3d.webp). Estrutura correta (docs/ciencia-dos-icones.md):
# membrana plasmática espessa com relevo; citoplasma; núcleo com envelope (poros), nucleoplasma, nucléolo e
# cromossomos; retículo rugoso em sacos achatados ao redor do núcleo (contínuo ao envelope); retículo em rede (azul)
# pelas paredes e chão; Golgi em pilha dobrada; retículo liso; mitocôndrias com cristas; centríolos; ribossomos.
# Cada estrutura é uma peça separada (camadas.py) para animar.
import sys; sys.path[:0] = ['/home/claude/escadas-sc/design/icones_real/foto3d', '/home/claude/escadas-sc/design/icones_real/foto3d/cenas']
from _bio2 import *
from camadas import parte, render_camadas
import mathutils as _m
cena(); random.seed(5)
V = _m.Vector

# ---------- materiais
alveolo_m = org('#f8f0de', '#f2e6cc', cav='#9a7a44', sss=.6, rugos=.5, coat=.25, bump=.06, esc=4, ao=.09, cav_forca=.95, sss_esc=.04)
casca_m = org('#e8cf98', '#efd9a8', cav='#7a5424', sss=.6, rugos=.32, coat=.5, bump=.15, esc=5, ao=.1, cav_forca=.9, sss_esc=.04)
cito_m = org('#f4efe4', '#ece4d2', cav='#b8a888', sss=.45, rugos=.6, coat=.1, bump=.15, esc=10, ao=.05, bump_esc=40)
verm = org('#c51d1d', '#d6302a', cav='#4a0606', sss=.3, rugos=.25, coat=.75, bump=.05, esc=5)
creme = org('#f1e6c4', '#e9dcb4', cav='#8a7a50', sss=.4, rugos=.5, coat=.2, bump=.3, esc=12)
nucleo_m = org('#8a1218', '#a01a20', cav='#2a0204', sss=.3, rugos=.45, coat=.3, bump=.4, esc=14)
preto = org('#2a0608', '#3a0a0c', sss=.1, rugos=.4, coat=.3, bump=0)
crom_m = org('#7a3ac8', '#8a4ad6', cav='#2a0a5a', sss=.2, rugos=.3, coat=.5, bump=0)
rer_m = org('#d2691e', '#e07a28', cav='#5a2400', sss=.35, rugos=.38, coat=.45, bump=.25, esc=8, ao=.04)
rede_m = org('#22a6c8', '#30b4d4', cav='#064a5a', sss=.25, rugos=.3, coat=.55, bump=0)
golgi_m = org('#2438c4', '#3448d4', cav='#060c4a', sss=.3, rugos=.3, coat=.6, bump=.1, esc=6)
liso_m = org('#b4264e', '#c4365e', cav='#3a0414', sss=.35, rugos=.35, coat=.45, bump=.2, esc=8)
mit_ext = org('#6a18a8', '#7a22b8', cav='#1e0440', sss=.3, rugos=.3, coat=.6, bump=.1)
mit_int = org('#a24ad8', '#b25ee2', cav='#3a0a6a', sss=.35, rugos=.4, coat=.35, bump=.2, esc=8)
crist_m = org('#5a10a0', '#6a1ab0', cav='#1a0438', sss=.2, rugos=.3, coat=.5, bump=0)
ouro = org('#e6b422', '#f2c43a', cav='#6a4a00', sss=.15, rugos=.3, coat=.6, bump=0)
ribo_m = org('#7a1414', '#8a1c1c', cav='#2a0404', sss=.1, rugos=.35, coat=.5, bump=0)

CZ = .2           # centro da esfera acima do chão da célula: parede do fundo mais alta, como na referência
CORTE_Y = -.02   # plano vertical do corte: some a metade da frente de cima (y < CORTE_Y e z > 0)
def corta_quarto(o):
    """remove a metade da frente da parte de cima (como a referência: vê-se o chão e a parede côncava do fundo)"""
    bpy.ops.mesh.primitive_cube_add(size=1, location=(0, CORTE_Y - 1.5, 1.5)); c = bpy.context.object; c.scale = (3, 3, 3); dif(o, c)
    bpy.ops.mesh.primitive_cube_add(size=1, location=(1.5 + .5, 0, 1.5)); c = bpy.context.object; c.scale = (3, 3, 3); dif(o, c)   # lado direito
    return o

def parede(phi, theta, off=.012):
    """ponto na face interna da membrana (esfera r=.9): phi = azimute (graus, a partir de +x), theta = elevação (graus)"""
    f, t = math.radians(phi), math.radians(theta); r = .9 - off
    return V((r * math.cos(t) * math.cos(f), r * math.cos(t) * math.sin(f), CZ + r * math.sin(t)))

def ico(r, sub, m, loc=(0, 0, 0)):
    bpy.ops.mesh.primitive_ico_sphere_add(radius=r, subdivisions=sub, location=loc); o = bpy.context.object
    if m is not None: o.data.materials.append(m)
    for p in o.data.polygons: p.use_smooth = True
    return o

def aplica(o):
    sel(o)
    for md in list(o.modifiers): bpy.ops.object.modifier_apply(modifier=md.name)
    return o

# ---------- membrana plasmática: casca espessa com relevo em rede (cristas arredondadas) e citoplasma
def relevo_rede(m, escala=2.4, altura=.12):
    """membrana com cristas arredondadas em rede (Voronoi: distância à borda), deslocamento real no render"""
    nt = m.node_tree; out = nt.nodes['Material Output']
    tc = nt.nodes.new('ShaderNodeTexCoord'); vo = nt.nodes.new('ShaderNodeTexVoronoi'); vo.feature = 'DISTANCE_TO_EDGE'
    vo.inputs['Scale'].default_value = escala; vo.inputs['Randomness'].default_value = .85
    nt.links.new(tc.outputs['Object'], vo.inputs['Vector'])
    mr = nt.nodes.new('ShaderNodeMapRange'); mr.interpolation_type = 'SMOOTHERSTEP'
    mr.inputs['From Min'].default_value = 0; mr.inputs['From Max'].default_value = .32; mr.inputs['To Min'].default_value = 1; mr.inputs['To Max'].default_value = 0
    nt.links.new(vo.outputs['Distance'], mr.inputs['Value'])
    # só na face de FORA da membrana (normal alinhada ao raio); faces de corte e de dentro ficam lisas
    geo = nt.nodes.new('ShaderNodeNewGeometry')
    nrm = nt.nodes.new('ShaderNodeVectorMath'); nrm.operation = 'NORMALIZE'; nt.links.new(tc.outputs['Object'], nrm.inputs[0])
    # normal do mundo -> objeto: o objeto não tem rotação, então vale direto
    dot = nt.nodes.new('ShaderNodeVectorMath'); dot.operation = 'DOT_PRODUCT'
    nt.links.new(geo.outputs['Normal'], dot.inputs[0]); nt.links.new(nrm.outputs['Vector'], dot.inputs[1])
    msk = nt.nodes.new('ShaderNodeMapRange'); msk.inputs['From Min'].default_value = .8; msk.inputs['From Max'].default_value = .95
    nt.links.new(dot.outputs['Value'], msk.inputs['Value'])
    lng = nt.nodes.new('ShaderNodeVectorMath'); lng.operation = 'LENGTH'; nt.links.new(tc.outputs['Object'], lng.inputs[0])
    raio = nt.nodes.new('ShaderNodeMapRange'); raio.inputs['From Min'].default_value = .96; raio.inputs['From Max'].default_value = .99
    nt.links.new(lng.outputs['Value'], raio.inputs['Value'])
    m1 = nt.nodes.new('ShaderNodeMath'); m1.operation = 'MULTIPLY'; nt.links.new(mr.outputs['Result'], m1.inputs[0]); nt.links.new(msk.outputs['Result'], m1.inputs[1])
    m2 = nt.nodes.new('ShaderNodeMath'); m2.operation = 'MULTIPLY'; nt.links.new(m1.outputs[0], m2.inputs[0]); nt.links.new(raio.outputs['Result'], m2.inputs[1])
    dp = nt.nodes.new('ShaderNodeDisplacement'); dp.inputs['Scale'].default_value = altura; dp.inputs['Midlevel'].default_value = 0
    nt.links.new(m2.outputs[0], dp.inputs['Height']); nt.links.new(dp.outputs['Displacement'], out.inputs['Displacement'])
    m.displacement_method = 'BOTH'
    # células (alvéolos) levemente mais claras e foscas que as cristas: leitura do relevo como na referência
    b = nt.nodes['Principled BSDF']
    lnk = b.inputs['Base Color'].links[0]; src = lnk.from_socket
    mx = nt.nodes.new('ShaderNodeMix'); mx.data_type = 'RGBA'; mx.blend_type = 'MULTIPLY'
    inv = nt.nodes.new('ShaderNodeMath'); inv.operation = 'SUBTRACT'; inv.inputs[0].default_value = 1; nt.links.new(m2.outputs[0], inv.inputs[1])
    f = nt.nodes.new('ShaderNodeMath'); f.operation = 'MULTIPLY'; f.inputs[1].default_value = .22; nt.links.new(inv.outputs[0], f.inputs[0])
    nt.links.new(f.outputs[0], mx.inputs['Factor']); nt.links.new(src, mx.inputs[6]); mx.inputs[7].default_value = cor('#d8c590')
    nt.links.new(mx.outputs[2], b.inputs['Base Color'])
def gn_rede(o, altura=.075, escala=2.4, largura=.11, warp=.35, warp_esc=1.6):
    """cristas arredondadas em rede (Voronoi: distância à borda) deslocando a malha na normal; guarda 'crista' (0..1)"""
    ng = bpy.data.node_groups.new('rede', 'GeometryNodeTree')
    ng.interface.new_socket('Geometry', in_out='INPUT', socket_type='NodeSocketGeometry')
    ng.interface.new_socket('Geometry', in_out='OUTPUT', socket_type='NodeSocketGeometry')
    N = ng.nodes; Lk = ng.links
    gi = N.new('NodeGroupInput'); go = N.new('NodeGroupOutput')
    pos = N.new('GeometryNodeInputPosition'); nor = N.new('GeometryNodeInputNormal')
    nz = N.new('ShaderNodeTexNoise'); nz.inputs['Scale'].default_value = warp_esc; nz.inputs['Detail'].default_value = 2
    Lk.new(pos.outputs[0], nz.inputs['Vector'])
    sb = N.new('ShaderNodeVectorMath'); sb.operation = 'SUBTRACT'; sb.inputs[1].default_value = (.5, .5, .5); Lk.new(nz.outputs['Color'], sb.inputs[0])
    sc = N.new('ShaderNodeVectorMath'); sc.operation = 'SCALE'; sc.inputs['Scale'].default_value = warp; Lk.new(sb.outputs[0], sc.inputs[0])
    ad = N.new('ShaderNodeVectorMath'); ad.operation = 'ADD'; Lk.new(pos.outputs[0], ad.inputs[0]); Lk.new(sc.outputs[0], ad.inputs[1])
    vo = N.new('ShaderNodeTexVoronoi'); vo.feature = 'DISTANCE_TO_EDGE'; vo.inputs['Scale'].default_value = escala; vo.inputs['Randomness'].default_value = .9
    Lk.new(ad.outputs[0], vo.inputs['Vector'])
    # perfil arredondado (quase meia-cana): f = (1 - x^2)^0.7, x = distância/largura
    xr = N.new('ShaderNodeMapRange'); xr.inputs['From Min'].default_value = 0; xr.inputs['From Max'].default_value = largura
    Lk.new(vo.outputs['Distance'], xr.inputs['Value'])
    x2 = N.new('ShaderNodeMath'); x2.operation = 'MULTIPLY'; Lk.new(xr.outputs['Result'], x2.inputs[0]); Lk.new(xr.outputs['Result'], x2.inputs[1])
    om = N.new('ShaderNodeMath'); om.operation = 'SUBTRACT'; om.inputs[0].default_value = 1; Lk.new(x2.outputs[0], om.inputs[1])
    mr = N.new('ShaderNodeMath'); mr.operation = 'POWER'; mr.inputs[1].default_value = .5; Lk.new(om.outputs[0], mr.inputs[0])
    mu = N.new('ShaderNodeMath'); mu.operation = 'MULTIPLY'; mu.inputs[1].default_value = altura; Lk.new(mr.outputs[0], mu.inputs[0])
    vs = N.new('ShaderNodeVectorMath'); vs.operation = 'SCALE'; Lk.new(nor.outputs[0], vs.inputs[0]); Lk.new(mu.outputs[0], vs.inputs['Scale'])
    sp = N.new('GeometryNodeSetPosition'); Lk.new(gi.outputs[0], sp.inputs['Geometry']); Lk.new(vs.outputs[0], sp.inputs['Offset'])
    st = N.new('GeometryNodeStoreNamedAttribute'); st.data_type = 'FLOAT'; st.domain = 'POINT'; st.inputs['Name'].default_value = 'crista'
    Lk.new(sp.outputs[0], st.inputs['Geometry']); Lk.new(mr.outputs[0], st.inputs['Value'])
    Lk.new(st.outputs[0], go.inputs[0])
    md = o.modifiers.new('gn', 'NODES'); md.node_group = ng
    return aplica(o)
def tinge_crista(m, hexa, forca=1.0):
    """mistura a cor das cristas (atributo 'crista') sobre a cor dos alvéolos"""
    nt = m.node_tree; b = nt.nodes['Principled BSDF']; src = b.inputs['Base Color'].links[0].from_socket
    at = nt.nodes.new('ShaderNodeAttribute'); at.attribute_name = 'crista'
    f = nt.nodes.new('ShaderNodeMath'); f.operation = 'MULTIPLY'; f.inputs[1].default_value = forca; nt.links.new(at.outputs['Fac'], f.inputs[0])
    mx = nt.nodes.new('ShaderNodeMix'); mx.data_type = 'RGBA'; mx.blend_type = 'MIX'; mx.clamp_factor = True
    nt.links.new(f.outputs[0], mx.inputs['Factor']); nt.links.new(src, mx.inputs[6]); mx.inputs[7].default_value = cor(hexa)
    nt.links.new(mx.outputs[2], b.inputs['Base Color'])
tinge_crista(alveolo_m, '#dfbf80')
casca = ico(1.0, 7, alveolo_m, (0, 0, CZ)); gn_rede(casca)
dentro = ico(.9, 6, None, (0, 0, CZ)); dif(casca, dentro); corta_quarto(casca)
forro = ico(.9, 6, cito_m, (0, 0, CZ)); dif(forro, ico(.885, 6, None, (0, 0, CZ))); corta_quarto(forro)        # face interna clara
cito = ico(.892, 6, cito_m, (0, 0, CZ))
bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, 1.5)); c = bpy.context.object; c.scale = (3, 3, 3); dif(cito, c)   # chão no equador
import numpy as _np
cristas = []
# bordas do corte: rolo grosso e arredondado acompanhando o corte (como a referência)
RB = .955
def aro(pts):
    cristas.append(tubo(pts, .07, casca_m, res=8))
rz = (RB ** 2 - CZ ** 2) ** .5
aro([(rz * math.cos(t), rz * math.sin(t), 0) for t in _np.linspace(math.asin(CORTE_Y / rz) - math.pi, math.asin(CORTE_Y / rz), 40) if rz * math.cos(t) <= .5 or True])
ry = (RB ** 2 - CORTE_Y ** 2) ** .5
aro([(ry * math.cos(t), CORTE_Y, CZ + ry * math.sin(t)) for t in _np.linspace(math.pi + math.asin(-CZ / ry) * -1, math.acos(min(1, .5 / ry)), 40) if CZ + ry * math.sin(t) >= -.001])
rx = (RB ** 2 - .5 ** 2) ** .5
aro([(.5, rx * math.cos(t), CZ + rx * math.sin(t)) for t in _np.linspace(math.asin(-CZ / rx), math.pi + math.asin(CZ / rx), 40) if rx * math.cos(t) >= CORTE_Y and CZ + rx * math.sin(t) >= -.001])
parte('membrana', [casca, forro, cito] + cristas)

# ---------- núcleo (no canto entre as paredes, meio enterrado no chão): envelope vermelho com poros,
# camada creme, nucleoplasma escuro com nucléolo e cromossomos; um oitavo cortado de frente para a câmera
NC = V((.04, .04, .13)); RN = .37
def oitavo(o):
    bpy.ops.mesh.primitive_cube_add(size=1, location=(NC.x + .5, NC.y - .5, NC.z + .5)); return dif(o, bpy.context.object)
env = ico(RN, 6, verm); dif(env, ico(RN - .025, 5, None)); oitavo(env)
cam_ = ico(RN - .026, 5, creme); dif(cam_, ico(RN - .075, 5, None)); oitavo(cam_)
miolo = ico(RN - .076, 5, nucleo_m); oitavo(miolo)
nuc = [env, cam_, miolo]
for k in range(22):   # poros: discos escuros na superfície do envelope
    u = random.uniform(-.3, 1); a = random.uniform(0, 6.283)
    dd = V((math.sqrt(1 - u * u) * math.cos(a), math.sqrt(1 - u * u) * math.sin(a), u))
    if dd.x > 0 and dd.y < 0 and dd.z > 0: continue
    c = cilindro(tuple(NC + dd * (RN - .002)), .016, .012, preto); c.rotation_euler = dd.to_track_quat('Z', 'Y').to_euler(); nuc.append(c)
for k in range(26):   # grânulos escuros nas faces cortadas do nucleoplasma
    f = random.choice('xyz'); r = random.uniform(.03, RN - .09); a = random.uniform(0, 1.5708)
    if f == 'x': p = V((NC.x + .003, NC.y - r * math.cos(a), NC.z + r * math.sin(a)))
    elif f == 'y': p = V((NC.x + r * math.cos(a), NC.y - .003, NC.z + r * math.sin(a)))
    else: p = V((NC.x + r * math.cos(a), NC.y - r * math.sin(a), NC.z + .003))
    nuc.append(esfera(tuple(p), .011, preto, seg=12))
def cromossomo(p, n, ang):
    q = _m.Matrix.Rotation(ang, 4, n)
    out = []
    for s in (1, -1):
        a_ = q @ V((.035 * s, .045, 0)); b_ = q @ V((-.035 * s, -.045, 0))
        o = bastao(tuple(p + a_), tuple(p + b_), .009, crom_m); out.append(o)
    return out
for (p, n) in (((NC.x + .006, NC.y - .2, NC.z + .1), 'X'), ((NC.x + .006, NC.y - .1, NC.z + .22), 'X'), ((NC.x + .2, NC.y - .006, NC.z + .1), 'Y'),
               ((NC.x + .12, NC.y - .006, NC.z + .21), 'Y'), ((NC.x + .2, NC.y - .12, NC.z + .006), 'Z'), ((NC.x + .1, NC.y - .21, NC.z + .006), 'Z')):
    nuc += cromossomo(V(p), n, random.uniform(0, 3))
parte('nucleo', nuc)

# ---------- retículo endoplasmático rugoso: sacos laranja achatados em anel ao redor do núcleo
rer = []
for k in range(70):
    a = random.uniform(0, 6.283); z = random.uniform(.02, .46)
    rr = math.sqrt(max(0, (RN + .045) ** 2 - (z - NC.z) ** 2 * .7)) + random.uniform(-.005, .015)
    if math.cos(a) > .2 and math.sin(a) < -.2 and z > NC.z - .02: continue   # deixa à mostra o corte do núcleo
    p = V((NC.x + rr * math.cos(a), NC.y + rr * math.sin(a), z))
    o = elipsoide_ = esfera((0, 0, 0), 1, rer_m, seg=48)
    o.scale = (.095, .062, .036); bpy.ops.object.transform_apply(scale=True)
    o.rotation_euler = (random.uniform(-.25, .25), random.uniform(-.2, .2), a + 1.5708)
    o.location = p; rer.append(o)
parte('rer', rer)

# ---------- retículo em rede (azul): arcos pelas paredes e malha no chão
rede = []
# retículo em rede: Voronoi 2D sobre a parede (azimute x elevação) e sobre o chão; arestas viram tubos finos
from scipy.spatial import Voronoi
_r2 = _np.random.default_rng(9)
P = _np.c_[_r2.uniform(10, 170, 150), _r2.uniform(-12, 62, 150)]
vw = Voronoi(P)
for (a_, b_) in vw.ridge_vertices:
    if a_ < 0 or b_ < 0: continue
    A = vw.vertices[a_]; B = vw.vertices[b_]
    if not (12 < A[0] < 168 and 12 < B[0] < 168 and -12 < A[1] < 58 and -12 < B[1] < 58): continue
    if _np.hypot(*(A - B)) > 16: continue
    # mais densa perto do núcleo e embaixo; rala no alto (como a referência)
    if max(A[1], B[1]) > 30 + 25 * _r2.random(): continue
    pts = [tuple(parede(*(A * (1 - t) + B * t))) for t in (0, .5, 1)]
    rede.append(tubo(pts, .013, rede_m, res=4))
Q = _np.c_[_r2.uniform(-.6, .7, 70), _r2.uniform(-.75, -.15, 70)]
vf = Voronoi(Q)
for (a_, b_) in vf.ridge_vertices:
    if a_ < 0 or b_ < 0: continue
    A = vf.vertices[a_]; B = vf.vertices[b_]
    if any(_np.hypot(*X) > .78 or X[1] > CORTE_Y - .02 or X[0] > .48 for X in (A, B)): continue
    if _np.hypot(*(A - B)) > .2: continue
    rede.append(tubo([(A[0], A[1], .01), (B[0], B[1], .01)], .012, rede_m, res=4))
parte('reticulo', rede)

# ---------- complexo golgiense: pilha dobrada (azul-escuro) no chão, à direita
gol = []
pts = []
for j in range(7):
    x = .4 + j * .065; h = .32 if j % 2 == 0 else .06
    pts += [(x, -.1 - j * .025, .06), (x + .018, -.1 - j * .025, h), (x + .048, -.1 - j * .025, h)]
o = tubo(pts, .055, golgi_m); o.scale = (1, .55, 1); gol.append(o)
pts = [(x + .02, y - .14, z * .8) for (x, y, z) in pts[:12]]
o = tubo(pts, .04, golgi_m); o.scale = (1, .55, 1); gol.append(o)
parte('golgi', gol)

# ---------- retículo liso (rosa-escuro): rede orgânica no alto da parede do fundo
blobs = []
for k in range(26):
    p = parede(random.uniform(62, 100), random.uniform(30, 55), .04)
    blobs.append(('CAPSULE', tuple(p), .03, (.06, .03, .03), (random.uniform(0, 3), 0, random.uniform(0, 3))))
liso = blob(blobs, liso_m, res=.012, thr=.5)
parte('liso', [liso])

# ---------- mitocôndrias: cápsulas roxas com cristas onduladas por cima
mitos = []
def mito(loc, rot):
    g = []
    e = esfera((0, 0, 0), 1, mit_ext, seg=64); e.scale = (.14, .065, .035); bpy.ops.object.transform_apply(scale=True); g.append(e)
    i_ = esfera((0, 0, .012), 1, mit_int, seg=64); i_.scale = (.12, .05, .03); bpy.ops.object.transform_apply(scale=True); g.append(i_)
    for k in range(7):
        x = -.09 + k * .03
        g.append(tubo([(x, -.035, .04), (x + .012, -.012, .043), (x - .012, .012, .043), (x, .035, .04)], .006, crist_m))
    M = _m.Matrix.Translation(loc) @ _m.Euler(rot).to_matrix().to_4x4()
    for o in g: o.matrix_world = M @ o.matrix_world
    return g
mitos += mito((-.32, -.6, .035), (0, 0, .2))
mitos += mito((.42, -.62, .035), (0, 0, -.35))
for (ph, th, gir) in ((150, 30, .5), (48, 14, -.4)):
    p = parede(ph, th, .03); n = (-p).normalized()
    q = n.to_track_quat('Z', 'Y').to_euler(); q.rotate_axis('Z', gir)
    mitos += mito(tuple(p), tuple(q))
parte('mitocondrias', mitos)

# ---------- centríolos: feixes de microtúbulos (dourados) junto à parede esquerda, num funil de rede
cen = []
for (base, ang) in (((-.62, .1, .1), (math.radians(55), 0, -.3)), ((-.56, .06, .08), (math.radians(80), 0, 1.2))):
    M = _m.Matrix.Translation(base) @ _m.Euler(ang).to_matrix().to_4x4()
    for k in range(9):
        a = k / 9 * 6.283
        p0 = M @ V((.045 * math.cos(a), .045 * math.sin(a), 0)); p1 = M @ V((.045 * math.cos(a), .045 * math.sin(a), .3))
        cen.append(bastao(tuple(p0), tuple(p1), .009, ouro))
for k in range(3):
    t = toro((-.6, .1, .06 + k * .06), .12 - k * .015, .008, rede_m); t.rotation_euler = (math.radians(70), 0, -.3); cen.append(t)
parte('centriolos', cen)

# ---------- ribossomos livres: trincas de grânulos escuros no chão e nas paredes
rib = []
def trinca(p):
    for k in range(3):
        a = k / 3 * 6.283; rib.append(esfera((p[0] + .014 * math.cos(a), p[1] + .014 * math.sin(a), p[2]), .011, ribo_m, seg=14))
for k in range(16):
    a = random.uniform(math.pi, 2 * math.pi); r = random.uniform(.3, .82)
    trinca((r * math.cos(a) * .9 + .1, r * math.sin(a) * .9, .012))
for k in range(12):
    trinca(tuple(parede(random.uniform(20, 160), random.uniform(0, 55), .016)))
parte('ribossomos', rib)

bpy.context.view_layer.update()
mover_tudo(-min((casca.matrix_world @ v.co).z for v in casca.data.vertices))
render_camadas('B00', elev=28, azim=16, folga=.96, fundo=('membrana',))

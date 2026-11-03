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
alveolo_m = org('#f5ead0', '#f0e2c4', cav='#9a7a44', sss=.6, rugos=.5, coat=.25, bump=.06, esc=4, ao=.09, cav_forca=.95, sss_esc=.04)
casca_m = org('#e8cf98', '#efd9a8', cav='#7a5424', sss=.6, rugos=.32, coat=.5, bump=.15, esc=5, ao=.1, cav_forca=.9, sss_esc=.04)
forro_m = org('#f6f1e6', '#efe7d6', cav='#cdb994', sss=.45, rugos=.6, coat=.1, bump=.1, esc=10, ao=.3, cav_forca=.55, bump_esc=40)
cito_m = org('#f4efe4', '#ece4d2', cav='#b8a888', sss=.45, rugos=.6, coat=.1, bump=.15, esc=10, ao=.05, bump_esc=40)
verm = org('#c51d1d', '#d6302a', cav='#4a0606', sss=.3, rugos=.25, coat=.75, bump=.05, esc=5)
creme = org('#f1e6c4', '#e9dcb4', cav='#8a7a50', sss=.4, rugos=.5, coat=.2, bump=.3, esc=12)
nucleo_m = org('#6a0c12', '#7e1218', cav='#2a0204', sss=.3, rugos=.45, coat=.3, bump=.4, esc=14)
preto = org('#2a0608', '#3a0a0c', sss=.1, rugos=.4, coat=.3, bump=0)
crom_m = org('#7a3ac8', '#8a4ad6', cav='#2a0a5a', sss=.2, rugos=.3, coat=.5, bump=0)
rer_m = org('#d2691e', '#e07a28', cav='#5a2400', sss=.35, rugos=.38, coat=.45, bump=.25, esc=8, ao=.04)
rede_m = org('#22a6c8', '#30b4d4', cav='#064a5a', sss=.25, rugos=.3, coat=.55, bump=0)
golgi_m = org('#2a40d0', '#3c56e0', cav='#060c4a', sss=.35, rugos=.28, coat=.6, bump=.1, esc=6)
liso_m = org('#cc4274', '#d85486', cav='#4a0a24', sss=.4, rugos=.3, coat=.6, bump=.2, esc=8)
mit_ext = org('#6a18a8', '#7a22b8', cav='#1e0440', sss=.3, rugos=.3, coat=.6, bump=.1)
mit_int = org('#5e1a9a', '#6a22a8', cav='#24064a', sss=.35, rugos=.4, coat=.35, bump=.2, esc=8)
crist_m = org('#c08ae6', '#cc9aee', cav='#4a1a7a', sss=.2, rugos=.3, coat=.5, bump=0)
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
def gn_rede(o, altura=.1, escala=2.4, largura=.16, warp=.15, warp_esc=1.6):
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
    vo = N.new('ShaderNodeTexVoronoi'); vo.feature = 'DISTANCE_TO_EDGE'; vo.inputs['Scale'].default_value = escala; vo.inputs['Randomness'].default_value = .75
    Lk.new(ad.outputs[0], vo.inputs['Vector'])
    # perfil arredondado (quase meia-cana): f = (1 - x^2)^0.7, x = distância/largura
    xr = N.new('ShaderNodeMapRange'); xr.inputs['From Min'].default_value = 0; xr.inputs['From Max'].default_value = largura
    Lk.new(vo.outputs['Distance'], xr.inputs['Value'])
    x2 = N.new('ShaderNodeMath'); x2.operation = 'MULTIPLY'; Lk.new(xr.outputs['Result'], x2.inputs[0]); Lk.new(xr.outputs['Result'], x2.inputs[1])
    om = N.new('ShaderNodeMath'); om.operation = 'SUBTRACT'; om.inputs[0].default_value = 1; Lk.new(x2.outputs[0], om.inputs[1])
    mr = N.new('ShaderNodeMath'); mr.operation = 'POWER'; mr.inputs[1].default_value = .65; Lk.new(om.outputs[0], mr.inputs[0])
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
tinge_crista(alveolo_m, '#e2c486')
casca = ico(1.0, 7, alveolo_m, (0, 0, CZ)); gn_rede(casca)
dentro = ico(.9, 6, None, (0, 0, CZ)); dif(casca, dentro); corta_quarto(casca)
forro = ico(.9, 6, forro_m, (0, 0, CZ)); dif(forro, ico(.885, 6, None, (0, 0, CZ))); corta_quarto(forro)        # face interna clara
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
NC = V((.04, .06, .17)); RN = .43
def oitavo(o):
    bpy.ops.mesh.primitive_cube_add(size=1, location=(NC.x + .5, NC.y - .5, NC.z + .5)); return dif(o, bpy.context.object)
env = ico(RN, 6, verm); dif(env, ico(RN - .025, 5, None)); oitavo(env)
cam_ = ico(RN - .026, 5, creme); dif(cam_, ico(RN - .09, 5, None)); oitavo(cam_)
miolo = ico(RN - .091, 5, nucleo_m); oitavo(miolo)
nuc = [env, cam_, miolo]
for k in range(22):   # poros: discos escuros na superfície do envelope
    u = random.uniform(-.3, 1); a = random.uniform(0, 6.283)
    dd = V((math.sqrt(1 - u * u) * math.cos(a), math.sqrt(1 - u * u) * math.sin(a), u))
    if dd.x > 0 and dd.y < 0 and dd.z > 0: continue
    c = cilindro(tuple(NC + dd * (RN - .002)), .016, .012, preto); c.rotation_euler = dd.to_track_quat('Z', 'Y').to_euler(); nuc.append(c)
for k in range(40):   # grânulos escuros nas faces cortadas do nucleoplasma
    f = random.choice('xyz'); r = random.uniform(.03, RN - .09); a = random.uniform(0, 1.5708)
    if f == 'x': p = V((NC.x + .003, NC.y - r * math.cos(a), NC.z + r * math.sin(a)))
    elif f == 'y': p = V((NC.x + r * math.cos(a), NC.y - .003, NC.z + r * math.sin(a)))
    else: p = V((NC.x + r * math.cos(a), NC.y - r * math.sin(a), NC.z + .003))
    nuc.append(esfera(tuple(p), .017, preto, seg=12))
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
GIRO_N = math.radians(-17)   # gira o corte do núcleo para ficar de frente para a câmera (azim 16)
bpy.context.view_layer.update()
_Rn = _m.Matrix.Translation(NC) @ _m.Matrix.Rotation(GIRO_N, 4, 'Z') @ _m.Matrix.Translation(-NC)
for o in nuc: o.matrix_world = _Rn @ o.matrix_world
parte('nucleo', nuc)

# ---------- retículo endoplasmático rugoso: sacos laranja achatados em anel ao redor do núcleo
rer = []
def placa(r, a0, a1, e0, e1, esp=.024, m=None):
    """cisterna achatada: casca esférica concêntrica ao núcleo (az a0..a1, elev e0..e1, graus), bordas arredondadas"""
    nu, nv = 14, 10; vs = []; fs = []
    for i in range(nu):
        for j in range(nv):
            u = i / (nu - 1); v = j / (nv - 1)
            # borda de cima ondulada e saco que se abre para fora no alto (cisterna orgânica, não cerca)
            az = math.radians(a0 + (a1 - a0) * u); el = math.radians(e0 + (e1 - e0) * v * (1 + .08 * math.sin(u * 6.5 + r * 37)) * max(0, 1 - (2 * u - 1) ** 2) ** .3)
            rr = r * (1 + .02 * math.sin(7 * u + 3 * v + r * 40) + .05 * v * v)
            vs.append(tuple(NC + V((rr * math.cos(el) * math.cos(az), rr * math.cos(el) * math.sin(az), rr * math.sin(el)))))
    for i in range(nu - 1):
        for j in range(nv - 1):
            fs.append((i * nv + j, (i + 1) * nv + j, (i + 1) * nv + j + 1, i * nv + j + 1))
    me = bpy.data.meshes.new('pl'); me.from_pydata(vs, [], fs); o = bpy.data.objects.new('pl', me); bpy.context.scene.collection.objects.link(o)
    sd = o.modifiers.new('so', 'SOLIDIFY'); sd.thickness = esp; sd.offset = 0
    ss = o.modifiers.new('ss', 'SUBSURF'); ss.levels = ss.render_levels = 2
    o.data.materials.append(m or rer_m)
    for pg in o.data.polygons: pg.use_smooth = True
    return o
_rr = random.Random(11)   # sorteio próprio dos ribossomos aderidos (não mexe no resto)
EL0 = math.degrees(math.asin(-NC.z / RN)) - 4     # elevação onde a casca encosta no chão
for j in range(3):
    r = RN + .04 + j * .05
    a = random.uniform(0, 20) + j * 19
    while a < 360 + j * 19:
        w = random.uniform(34, 52)
        mid = (a + w / 2) % 360
        frente = 226 < mid < 336        # setor virado para a câmera (corte do núcleo)
        topo = random.uniform(-6, 6) - j * 5 if frente else random.uniform(8, 42) - j * 9
        rer.append(placa(r, a, a + w - 7, EL0 + j * 2, topo, esp=.042))
        for _k in range(6):   # ribossomos aderidos (RE rugoso): grânulos escuros na face de fora da cisterna
            v = _rr.uniform(.15, .7); az_ = math.radians(_rr.uniform(a + 3, a + w - 10)); el_ = math.radians(EL0 + j * 2 + (topo - EL0 - j * 2) * v)
            rr_ = r * (1 + .05 * v * v) + .026
            rer.append(esfera(tuple(NC + V((rr_ * math.cos(el_) * math.cos(az_), rr_ * math.cos(el_) * math.sin(az_), rr_ * math.sin(el_)))), .011, ribo_m, seg=12))
        a += w
parte('rer', rer)

# ---------- retículo em rede (azul): arcos pelas paredes e malha no chão
rede = []
# retículo em rede: Voronoi 2D sobre a parede (azimute x elevação) e sobre o chão; arestas viram tubos finos
from scipy.spatial import Voronoi
_r2 = _np.random.default_rng(9)
P = _np.c_[_r2.uniform(10, 170, 95), _r2.uniform(-12, 62, 95)]
vw = Voronoi(P)
for (a_, b_) in vw.ridge_vertices:
    if a_ < 0 or b_ < 0: continue
    A = vw.vertices[a_]; B = vw.vertices[b_]
    if not (12 < A[0] < 168 and 12 < B[0] < 168 and -12 < A[1] < 58 and -12 < B[1] < 58): continue
    if _np.hypot(*(A - B)) > 22: continue
    # mais densa perto do núcleo e embaixo; rala no alto (como a referência)
    if max(A[1], B[1]) > 30 + 25 * _r2.random(): continue
    pts = [tuple(parede(*(A * (1 - t) + B * t))) for t in (0, .5, 1)]
    rede.append(tubo(pts, .017, rede_m, res=5))
Q = _np.c_[_r2.uniform(-.6, .7, 70), _r2.uniform(-.75, -.15, 70)]
vf = Voronoi(Q)
for (a_, b_) in vf.ridge_vertices:
    if a_ < 0 or b_ < 0: continue
    A = vf.vertices[a_]; B = vf.vertices[b_]
    if any(_np.hypot(*X) > .78 or X[1] > CORTE_Y - .02 or X[0] > .48 for X in (A, B)): continue
    if _np.hypot(*(A - B)) > .2: continue
    rede.append(tubo([(A[0], A[1], .012), (B[0], B[1], .012)], .016, rede_m, res=5))
parte('reticulo', rede)

# ---------- complexo golgiense: pilha dobrada (azul-escuro) no chão, à direita
gol = []
# dictiossomo: 6 cisternas curvas em pé, face cis (côncava) voltada para o núcleo; borda de cima ondulada
GC = V((.16, -.02, 0))                         # centro de curvatura (lado do núcleo)
def cisterna(r, a0, a1, h, esp=.034, fase=0):
    nu, nv = 24, 9; vs = []; fs = []
    for i in range(nu):
        u = i / (nu - 1); az = math.radians(a0 + (a1 - a0) * u)
        top = h * (.82 + .18 * math.sin(u * 9.4 + fase)) * (1 - .55 * (2 * u - 1) ** 4)
        for j in range(nv):
            v = j / (nv - 1); z = .015 + top * v
            rr = r + .012 * math.sin(u * 14 + fase + v * 2)
            vs.append(tuple(GC + V((rr * math.cos(az), rr * math.sin(az), z))))
    for i in range(nu - 1):
        for j in range(nv - 1):
            fs.append((i * nv + j, (i + 1) * nv + j, (i + 1) * nv + j + 1, i * nv + j + 1))
    me = bpy.data.meshes.new('gc'); me.from_pydata(vs, [], fs); o = bpy.data.objects.new('gc', me); bpy.context.scene.collection.objects.link(o)
    sd = o.modifiers.new('so', 'SOLIDIFY'); sd.thickness = esp; sd.offset = 0
    ss = o.modifiers.new('ss', 'SUBSURF'); ss.levels = ss.render_levels = 2
    o.data.materials.append(golgi_m)
    for pg in o.data.polygons: pg.use_smooth = True
    return o
for j in range(6):
    r = .42 + j * .058; meia = 32 - j * 2.5
    gol.append(cisterna(r, -18 - meia, -18 + meia, .40 - abs(j - 2) * .035, fase=j * 1.3, esp=.04))
for k in range(7):   # vesículas saindo da face trans rumo à membrana
    az = math.radians(random.uniform(-36, 0)); r = random.uniform(.76, .8)
    pv = GC + V((r * math.cos(az), r * math.sin(az), 0)); pv.z = 0; pv = pv * min(1, .76 / pv.length); pv.z = random.uniform(.06, .32)
    gol.append(esfera(tuple(pv), random.uniform(.022, .032), golgi_m, seg=24))
parte('golgi', gol)

# ---------- retículo liso (rosa-escuro): rede orgânica no alto da parede do fundo
blobs = []
# rede orgânica: nós espalhados no alto da parede do fundo, ligados aos vizinhos mais próximos por tubos (metaballs)
_rl = _np.random.default_rng(21)
_nos = [parede(float(_rl.uniform(52, 118)), float(_rl.uniform(24, 64)), float(_rl.uniform(.05, .14))) for _ in range(48)]
for i, p in enumerate(_nos):
    blobs.append(('BALL', tuple(p), float(_rl.uniform(.035, .055))))
    viz = sorted(range(len(_nos)), key=lambda k: (_nos[k] - p).length)[1:3]
    for k in viz:
        q = _nos[k]; d = (q - p)
        if d.length > .2: continue
        n = max(2, int(d.length / .02))
        for t in range(1, n):
            blobs.append(('BALL', tuple(p + d * (t / n)), .03))
liso = blob(blobs, liso_m, res=.01, thr=.5)
parte('liso', [liso])

# ---------- mitocôndrias: cápsulas roxas com cristas onduladas por cima
mitos = []
def mito(loc, rot):
    g = []
    e = esfera((0, 0, 0), 1, mit_ext, seg=64); e.scale = (.14, .065, .035); bpy.ops.object.transform_apply(scale=True); g.append(e)
    i_ = esfera((0, 0, .012), 1, mit_int, seg=64); i_.scale = (.12, .05, .03); bpy.ops.object.transform_apply(scale=True); g.append(i_)
    for k in range(9):   # cristas: dobras onduladas da membrana interna, atravessando a largura
        x = -.096 + k * .024
        g.append(tubo([(x + (.009 if q % 2 else -.009), y, .038 + .005 * math.cos(y * 40)) for q, y in enumerate(_np.linspace(-.036, .036, 7))], .0065, crist_m))
    M = _m.Matrix.Translation(loc) @ _m.Euler(rot).to_matrix().to_4x4() @ _m.Matrix.Scale(1.35, 4)
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
# funil de rede (microtúbulos irradiando do centrossomo) preso à parede esquerda, aberto para dentro da célula
_ap = parede(166, 7, .0)                         # ápice na parede
_ax = V((.75, -.65, .04)).normalized()           # eixo do funil: para o centro e para a câmera
_q = _ax.to_track_quat('Z', 'Y').to_matrix()
def _fp(t, ang, tw=0):   # ponto do funil: t = 0..1 ao longo do eixo; raio cresce
    r = .035 + .17 * t ** 1.3; a = ang + tw * t
    return _ap + _q @ V((r * math.cos(a), r * math.sin(a), .34 * t))
for k in range(16):      # meridianos cruzados (malha em losangos)
    a0 = k / 16 * 6.283
    for tw in (.9, -.9):
        cen.append(tubo([tuple(_fp(t, a0, tw)) for t in _np.linspace(0, 1, 8)], .007, rede_m, res=3))
for t in (.35, .6, .82, 1.0):
    cen.append(tubo([tuple(_fp(t, a)) for a in _np.linspace(0, 6.283, 33)], .008, rede_m, res=3, fecha=True))
# dois centríolos (9 trincas de microtúbulos) em ângulo reto, dentro da boca do funil
def centriolo(c, eixo, comp=.2, r=.05):
    M = _m.Matrix.Translation(c) @ eixo.to_track_quat('Z', 'Y').to_matrix().to_4x4()
    for k in range(9):
        a = k / 9 * 6.283
        for j in range(3):
            rr = r - j * .011; aa = a + j * .16
            p0 = M @ V((rr * math.cos(aa), rr * math.sin(aa), -comp / 2)); p1 = M @ V((rr * math.cos(aa), rr * math.sin(aa), comp / 2))
            cen.append(bastao(tuple(p0), tuple(p1), .0065, ouro))
_cc = _ap + _ax * .26
centriolo(_cc, _ax)
centriolo(_cc + _ax * .02 + V((0, 0, .09)), _ax.cross(V((0, 0, 1))).normalized())
parte('centriolos', cen)

# ---------- ribossomos livres: trincas de grânulos escuros no chão e nas paredes
rib = []
def trinca(p):
    for k in range(3):
        a = k / 3 * 6.283; rib.append(esfera((p[0] + .02 * math.cos(a), p[1] + .02 * math.sin(a), p[2] + .004), .016, ribo_m, seg=16))
for k in range(26):
    a = random.uniform(math.pi, 2 * math.pi); r = random.uniform(.3, .82)
    trinca((r * math.cos(a) * .9 + .1, r * math.sin(a) * .9, .012))
for k in range(18):
    trinca(tuple(parede(random.uniform(20, 160), random.uniform(0, 55), .016)))
parte('ribossomos', rib)

# caixa envolvente da membrana alinhada à vista da câmera (mesma geometria no mundo): o enquadramento por caixa fica justo
CAM_ELEV, CAM_AZIM = 22, 16
_Rv = _m.Matrix.Rotation(math.radians(CAM_AZIM), 4, 'Z') @ _m.Matrix.Rotation(math.radians(-CAM_ELEV), 4, 'X')
for o in (casca, forro, cito):
    o.data.transform(_Rv.inverted()); o.matrix_world = o.matrix_world @ _Rv
bpy.context.view_layer.update()
mover_tudo(-min((casca.matrix_world @ v.co).z for v in casca.data.vertices))
render_camadas('B00', elev=CAM_ELEV, azim=CAM_AZIM, folga=.96, fundo=('membrana',))

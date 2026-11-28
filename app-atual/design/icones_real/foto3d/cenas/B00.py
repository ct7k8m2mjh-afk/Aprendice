# B00 ícone principal de Biologia (03/11, v4 "quarto"): célula animal inteira com UM QUARTO de cima removido
# (gomo de 90° visto de cima: x>0, y<0, acima do chão), como a referência do dono (rodadas/ref-B00.webp).
# Vê-se: duas faces de corte verticais que se encontram no eixo central + o chão desse quadrante; os outros três
# quartos da cúpula ficam inteiros. O núcleo fica no CENTRO da célula e o mesmo corte o abre (janela de um oitavo:
# envelope vermelho, camada creme com cromossomos, nucleoplasma escuro com grânulos).
# Estrutura correta (docs/ciencia-dos-icones.md): membrana plasmática espessa com relevo; citoplasma; núcleo com
# envelope (poros); RE rugoso em sacos achatados ao redor do núcleo (contínuo ao envelope) com ribossomos; retículo em
# rede (ciano) nas faces de corte e no chão; Golgi em pilha (cis voltada ao núcleo) com vesículas; RE liso; mitocôndrias
# com cristas; centrossomo com dois centríolos em ângulo reto; ribossomos livres.
# Peças para animar (sem explodir organelas): membrana (casca + citoplasma), nucleo, organelas.
import sys; sys.path[:0] = ['/home/claude/escadas-sc/design/icones_real/foto3d', '/home/claude/escadas-sc/design/icones_real/foto3d/cenas']
from _bio2 import *
from camadas import parte, render_camadas
import mathutils as _m
import numpy as _np
from scipy.spatial import Voronoi
cena(); random.seed(5)
V = _m.Vector

# ---------- materiais
alveolo_m = org('#f5ead0', '#f0e2c4', cav='#9a7a44', sss=.6, rugos=.5, coat=.25, bump=.06, esc=4, ao=.09, cav_forca=.95, sss_esc=.04)
casca_m = org('#e8cf98', '#efd9a8', cav='#7a5424', sss=.6, rugos=.32, coat=.5, bump=.15, esc=5, ao=.1, cav_forca=.9, sss_esc=.04)
cito_m = org('#f6f2ea', '#efe8da', cav='#c4b494', sss=.4, rugos=.6, coat=.1, bump=.12, esc=10, ao=.12, cav_forca=.6, bump_esc=40)
verm = org('#c51d1d', '#d6302a', cav='#4a0606', sss=.3, rugos=.25, coat=.75, bump=.05, esc=5)
creme = org('#f1e6c4', '#e9dcb4', cav='#8a7a50', sss=.4, rugos=.5, coat=.2, bump=.3, esc=12)
nucleo_m = org('#7a0e16', '#8e1820', cav='#2a0204', sss=.3, rugos=.4, coat=.35, bump=.3, esc=14)
preto = org('#2a0608', '#3a0a0c', sss=.1, rugos=.4, coat=.3, bump=0)
crom_m = org('#8a4ae0', '#9a5aea', cav='#2a0a5a', sss=.2, rugos=.3, coat=.5, bump=0)
rer_m = org('#d2691e', '#e07a28', cav='#5a2400', sss=.35, rugos=.38, coat=.45, bump=.25, esc=8, ao=.04)
rede_m = org('#22a6c8', '#30b4d4', cav='#064a5a', sss=.25, rugos=.3, coat=.55, bump=0)
golgi_m = org('#2a40d0', '#3c56e0', cav='#060c4a', sss=.35, rugos=.28, coat=.6, bump=.1, esc=6)
liso_m = org('#c23a6c', '#d24c80', cav='#4a0a24', sss=.4, rugos=.3, coat=.6, bump=.2, esc=8)
mit_ext = org('#6a18a8', '#7a22b8', cav='#1e0440', sss=.3, rugos=.3, coat=.6, bump=.1)
mit_int = org('#5e1a9a', '#6a22a8', cav='#24064a', sss=.35, rugos=.4, coat=.35, bump=.2, esc=8)
crist_m = org('#c08ae6', '#cc9aee', cav='#4a1a7a', sss=.2, rugos=.3, coat=.5, bump=0)
ouro = org('#e6b422', '#f2c43a', cav='#6a4a00', sss=.15, rugos=.3, coat=.6, bump=0)
ribo_m = org('#7a1414', '#8a1c1c', cav='#2a0404', sss=.1, rugos=.35, coat=.5, bump=0)
oco_m = org('#e8dcc6', '#ddd0b6', cav='#7a6a4a', sss=.3, rugos=.6, coat=.1, bump=.1, esc=10, ao=.2, cav_forca=.9)

# ---------- geometria (sistema "canônico": gomo aberto em x>0, y<0, z>0; chão da célula em z=0)
CZ = .2           # centro da esfera acima do chão do quadrante (chão um pouco abaixo do equador)
RI = .9           # raio interno da membrana (= raio do citoplasma)
VISTA = 60        # azimute da câmera em relação ao gomo (45 = diagonal; >45 mostra mais a face x=0, à esquerda)
CAM_ELEV, CAM_AZIM = 38, 10
LENTE = 38

def cubo(c, s=3):
    bpy.ops.mesh.primitive_cube_add(size=1, location=c); o = bpy.context.object; o.scale = (s, s, s); return o
def corta_quarto(o):
    """remove o gomo de 90° de cima: x>0, y<0, z>0"""
    return dif(o, cubo((1.5, -1.5, 1.5)))

def ico(r, sub, m, loc=(0, 0, 0)):
    bpy.ops.mesh.primitive_ico_sphere_add(radius=r, subdivisions=sub, location=loc); o = bpy.context.object
    if m is not None: o.data.materials.append(m)
    for p in o.data.polygons: p.use_smooth = True
    return o

def aplica(o):
    sel(o)
    for md in list(o.modifiers): bpy.ops.object.modifier_apply(modifier=md.name)
    return o

def zmax(s):
    """altura máxima da face de corte a distância s do eixo"""
    return CZ + max(0, RI * RI - s * s) ** .5
def fx(s, z, off=.01):
    """ponto na face de corte x=0 (a da esquerda), s = distância do eixo (para y<0)"""
    return V((off, -s, z))
def fy(s, z, off=.01):
    """ponto na face de corte y=0 (a da direita), s = distância do eixo (para x>0)"""
    return V((s, -off, z))

# ---------- membrana plasmática: casca espessa com relevo em rede (cristas arredondadas)
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
    """mistura a cor das cristas (atributo 'crista') sobre a cor dos alvéolos; vinco escuro no pé da crista"""
    nt = m.node_tree; b = nt.nodes['Principled BSDF']; src = b.inputs['Base Color'].links[0].from_socket
    at = nt.nodes.new('ShaderNodeAttribute'); at.attribute_name = 'crista'
    f = nt.nodes.new('ShaderNodeMath'); f.operation = 'MULTIPLY'; f.inputs[1].default_value = forca; nt.links.new(at.outputs['Fac'], f.inputs[0])
    mx = nt.nodes.new('ShaderNodeMix'); mx.data_type = 'RGBA'; mx.blend_type = 'MIX'; mx.clamp_factor = True
    nt.links.new(f.outputs[0], mx.inputs['Factor']); nt.links.new(src, mx.inputs[6]); mx.inputs[7].default_value = cor(hexa)
    d = nt.nodes.new('ShaderNodeMath'); d.operation = 'SUBTRACT'; d.inputs[1].default_value = .1; nt.links.new(at.outputs['Fac'], d.inputs[0])
    ab = nt.nodes.new('ShaderNodeMath'); ab.operation = 'ABSOLUTE'; nt.links.new(d.outputs[0], ab.inputs[0])
    vr = nt.nodes.new('ShaderNodeMapRange'); vr.inputs['From Min'].default_value = 0; vr.inputs['From Max'].default_value = .12
    vr.inputs['To Min'].default_value = .45; vr.inputs['To Max'].default_value = 0; nt.links.new(ab.outputs[0], vr.inputs['Value'])
    mv = nt.nodes.new('ShaderNodeMix'); mv.data_type = 'RGBA'; mv.blend_type = 'MULTIPLY'; mv.clamp_factor = True
    nt.links.new(vr.outputs['Result'], mv.inputs['Factor']); nt.links.new(mx.outputs[2], mv.inputs[6]); mv.inputs[7].default_value = cor('#b89660')
    nt.links.new(mv.outputs[2], b.inputs['Base Color'])
tinge_crista(alveolo_m, '#e2c486')
casca = ico(1.0, 7, alveolo_m, (0, 0, CZ)); gn_rede(casca)
dif(casca, ico(RI, 6, None, (0, 0, CZ))); corta_quarto(casca)
dif(casca, cubo((0, 0, CZ - .94 - 1.5)))          # base achatada: assenta no chão
# citoplasma: esfera cheia sem o gomo -> as duas faces de corte e o chão do quadrante
cito = ico(RI + .004, 6, cito_m, (0, 0, CZ)); dif(cito, cubo((0, 0, CZ - .94 - 1.5)))
# centrossomo: funil escavado na face da esquerda (x=0), aberto para dentro do gomo
FUN_S, FUN_Z, FUN_L = .6, .27, .26                 # posição na face e profundidade
_ax = V((1, -.12, .1)).normalized()                # eixo do funil (sai da face, levemente para a câmera e para cima)
_ap = V((0, -FUN_S, FUN_Z)) - _ax * FUN_L          # ápice dentro da parede
bpy.ops.mesh.primitive_cone_add(radius1=.012, radius2=.2, depth=FUN_L + .06, vertices=48, location=tuple(_ap + _ax * (FUN_L + .06) / 2))
_cn = bpy.context.object; _cn.rotation_euler = _ax.to_track_quat('Z', 'Y').to_euler()
corta_quarto(cito); dif(cito, _cn)
# rolos arredondados nas bordas do corte (três arcos: duas faces verticais e o chão)
cristas = []
RB = .955
def aro(pts): cristas.append(tubo(pts, .05, casca_m, res=8))
rz = (RB ** 2 - CZ ** 2) ** .5
aro([(rz * math.cos(t), rz * math.sin(t), 0) for t in _np.linspace(-math.pi / 2, 0, 30)])
t0 = math.asin(-CZ / RB)
aro([(0, -RB * math.cos(t), CZ + RB * math.sin(t)) for t in _np.linspace(t0, math.pi / 2, 30)])
aro([(RB * math.cos(t), 0, CZ + RB * math.sin(t)) for t in _np.linspace(t0, math.pi / 2, 30)])
parte('membrana', [casca, cito] + cristas)

orgs = []   # tudo o que não é membrana nem núcleo

# ---------- núcleo no centro da célula, apoiado no chão; o corte abre uma janela de um oitavo voltada para o gomo
NC = V((.09, -.09, .26)); RN = .35
def oitavo(o, folga=0):
    return dif(o, cubo((NC.x + 1.5 + folga, NC.y - 1.5 - folga, NC.z + 1.5 + folga)))
env = ico(RN, 6, verm, tuple(NC)); dif(env, ico(RN - .022, 5, None, tuple(NC))); oitavo(env)
cam_ = ico(RN - .021, 6, creme, tuple(NC)); dif(cam_, ico(RN - .15, 5, None, tuple(NC))); oitavo(cam_)
RC = RN - .16
miolo = ico(RC, 6, nucleo_m, tuple(NC))           # nucleoplasma: abaulado dentro da janela (como a referência)
nuc = [env, cam_, miolo]
for k in range(26):   # poros do envelope: discos escuros
    u = random.uniform(-.35, 1); a = random.uniform(0, 6.283)
    dd = V((math.sqrt(1 - u * u) * math.cos(a), math.sqrt(1 - u * u) * math.sin(a), u))
    if dd.x > -.05 and dd.y < .05 and dd.z > -.05: continue
    c = cilindro(tuple(NC + dd * (RN - .004)), .017, .014, preto); c.rotation_euler = dd.to_track_quat('Z', 'Y').to_euler(); nuc.append(c)
_rg = random.Random(4)
n_ = 0
while n_ < 16:        # grânulos de cromatina na superfície do nucleoplasma (dentro da janela)
    u = _rg.uniform(.1, .95); a = _rg.uniform(-1.45, -.12)
    dd = V((math.sqrt(1 - u * u) * math.cos(a), math.sqrt(1 - u * u) * math.sin(a), u))
    if dd.x < .12 or dd.y > -.12 or dd.z < .12: continue
    c = cilindro(tuple(NC + dd * (RC - .002)), .019, .01, preto); c.rotation_euler = dd.to_track_quat('Z', 'Y').to_euler(); nuc.append(c); n_ += 1
def cromossomo(p, n, ang, t=.034):
    q = _m.Matrix.Rotation(ang, 4, n); out = []
    for s in (1, -1):
        a_ = q @ V((t * s, t * 1.3, 0)) if n == 'Z' else (q @ V((0, t * s, t * 1.3)) if n == 'X' else q @ V((t * s, 0, t * 1.3)))
        out.append(bastao(tuple(p + a_), tuple(p - a_), .0095, crom_m))
    return out
_rc = random.Random(8)
RM = (RC + RN - .02) / 2                           # meio da faixa creme
for (fa, ang) in (('X', .45), ('X', 1.15), ('Y', .4), ('Y', 1.2), ('Z', .35), ('Z', 1.2)):
    r = RM + _rc.uniform(-.015, .015); g = _rc.uniform(0, 3)
    if fa == 'X': p = V((NC.x + .006, NC.y - r * math.cos(ang), NC.z + r * math.sin(ang)))
    elif fa == 'Y': p = V((NC.x + r * math.cos(ang), NC.y - .006, NC.z + r * math.sin(ang)))
    else: p = V((NC.x + r * math.cos(ang), NC.y - r * math.sin(ang), NC.z + .006))
    nuc += cromossomo(p, fa, g)
parte('nucleo', nuc)

# ---------- RE rugoso: sacos laranja achatados envolvendo o núcleo (do chão até o alto)
def placa(c, r, a0, a1, e0, e1, esp=.042, m=None, seed=0):
    """cisterna achatada: casca esférica concêntrica a c (azimute a0..a1, elevação e0..e1, graus), borda ondulada"""
    nu, nv = 14, 10; vs = []; fs = []
    for i in range(nu):
        for j in range(nv):
            u = i / (nu - 1); v = j / (nv - 1)
            az = math.radians(a0 + (a1 - a0) * u)
            el = math.radians(e0 + (e1 - e0) * v * (1 + .08 * math.sin(u * 6.5 + seed)) * max(0, 1 - (2 * u - 1) ** 2) ** .3)
            rr = r * (1 + .02 * math.sin(7 * u + 3 * v + seed) + .05 * v * v)
            vs.append(tuple(c + V((rr * math.cos(el) * math.cos(az), rr * math.cos(el) * math.sin(az), rr * math.sin(el)))))
    for i in range(nu - 1):
        for j in range(nv - 1):
            fs.append((i * nv + j, (i + 1) * nv + j, (i + 1) * nv + j + 1, i * nv + j + 1))
    me = bpy.data.meshes.new('pl'); me.from_pydata(vs, [], fs); o = bpy.data.objects.new('pl', me); bpy.context.scene.collection.objects.link(o)
    sd = o.modifiers.new('so', 'SOLIDIFY'); sd.thickness = esp; sd.offset = 0
    ss = o.modifiers.new('ss', 'SUBSURF'); ss.levels = ss.render_levels = 2
    o.data.materials.append(m or rer_m)
    for pg in o.data.polygons: pg.use_smooth = True
    return o
_rr = random.Random(11)
EL0 = math.degrees(math.asin(-NC.z / RN)) - 4
for j in range(2):
    r = RN + .045 + j * .055
    a = -150 + j * 17
    while a < 70:
        w = _rr.uniform(30, 44); mid = a + w / 2
        frente = -78 < mid < -12                    # diante da janela do núcleo: sacos baixos
        topo = _rr.uniform(-14, -4) - j * 4 if frente else _rr.uniform(10, 40) - j * 8
        orgs.append(placa(NC, r, a, a + w - 6, EL0 + j * 2, topo, seed=_rr.uniform(0, 9)))
        for _k in range(5):   # ribossomos aderidos na face de fora da cisterna
            v = _rr.uniform(.15, .7); az_ = math.radians(_rr.uniform(a + 3, a + w - 9)); el_ = math.radians(EL0 + j * 2 + (topo - EL0 - j * 2) * v)
            rr_ = r * (1 + .05 * v * v) + .026
            orgs.append(esfera(tuple(NC + V((rr_ * math.cos(el_) * math.cos(az_), rr_ * math.cos(el_) * math.sin(az_), rr_ * math.sin(el_)))), .011, ribo_m, seg=12))
        a += w
for (a0, a1, e0, e1) in ((-175, -95, 38, 78), (5, 80, 36, 76), (-100, 10, 62, 84)):   # sacos por cima do núcleo (fora da janela)
    orgs.append(placa(NC, RN + .05, a0, a1, e0, e1, seed=_rr.uniform(0, 9)))

# ---------- retículo em rede (ciano): malha nas duas faces de corte, descendo para o chão
_r2 = _np.random.default_rng(9)
def rede_face(ponto, n, zmax_frac, pula, dens_alta=.5):
    """Voronoi 2D na face (s, z), células alongadas na vertical; arestas viram tubos rentes à face"""
    P = _np.c_[_r2.uniform(.02, .9, n), _r2.uniform(-.05, 1.0, n) / 2.0]
    vw = Voronoi(P)
    for (a_, b_) in vw.ridge_vertices:
        if a_ < 0 or b_ < 0: continue
        A = vw.vertices[a_].copy(); B = vw.vertices[b_].copy(); A[1] *= 2; B[1] *= 2
        if _np.hypot(*(A - B)) > .3: continue
        ok = True
        for X in (A, B):
            if X[0] < .03 or X[1] < .006 or X[1] > zmax(X[0]) - .08 or X[0] > (RI ** 2 - max(0, X[1] - CZ) ** 2) ** .5 - .06: ok = False
            if X[1] > zmax_frac * (.75 + .5 * _r2.random()): ok = False
            if pula(X): ok = False
        if not ok: continue
        A[1] = max(A[1], .012); B[1] = max(B[1], .012)
        orgs.append(tubo([tuple(ponto(*(A * (1 - t) + B * t))) for t in (0, .5, 1)], .016, rede_m, res=5))
def longe_nucleo(X, s0, z0, r): return (X[0] - s0) ** 2 + (X[1] - z0) ** 2 < r * r
rede_face(lambda s, z: fx(s, z, .008), 70, .78, lambda X: longe_nucleo(X, FUN_S, FUN_Z, .22) or longe_nucleo(X, .1, NC.z, RN + .1))
rede_face(lambda s, z: fy(s, z, .008), 60, .55, lambda X: longe_nucleo(X, .1, NC.z, RN + .1))
Q = _np.c_[_r2.uniform(-.05, .95, 80), _r2.uniform(-.95, .05, 80)]
vf = Voronoi(Q)
for (a_, b_) in vf.ridge_vertices:   # malha no chão, diante do núcleo
    if a_ < 0 or b_ < 0: continue
    A = vf.vertices[a_]; B = vf.vertices[b_]
    if any(_np.hypot(*X) > .8 or X[0] < .02 or X[1] > -.02 or _np.hypot(X[0] - NC.x, X[1] - NC.y) < RN + .06 for X in (A, B)): continue
    if _np.hypot(*(A - B)) > .22: continue
    if _np.hypot((A[0] + B[0]) / 2, (A[1] + B[1]) / 2) > .55 + .25 * _r2.random(): continue
    orgs.append(tubo([(A[0], A[1], .01), (B[0], B[1], .01)], .015, rede_m, res=5))

# ---------- complexo golgiense: dictiossomo no chão, à direita (perto da face y=0), cis côncava para o núcleo
GC = V((NC.x, NC.y, 0))
def cisterna(r, a0, a1, h, esp=.04, fase=0):
    nu, nv = 24, 9; vs = []; fs = []
    for i in range(nu):
        u = i / (nu - 1); az = math.radians(a0 + (a1 - a0) * u)
        top = h * (.82 + .18 * math.sin(u * 9.4 + fase)) * (1 - .55 * (2 * u - 1) ** 4)
        for j in range(nv):
            v = j / (nv - 1); z = .012 + top * v
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
GOL_AZ = -14
for j in range(6):
    r = .46 + j * .052; meia = 17 - j * 1.2
    orgs.append(cisterna(r, GOL_AZ - meia, GOL_AZ + meia, .30 - abs(j - 2) * .025, fase=j * 1.3))
for k in range(6):   # vesículas da face trans (rumo à membrana)
    az = math.radians(GOL_AZ + random.uniform(-16, 16)); r = random.uniform(.8, .84)
    orgs.append(esfera((GC.x + r * math.cos(az), GC.y + r * math.sin(az), random.uniform(.05, .28)), random.uniform(.02, .03), golgi_m, seg=24))

# ---------- RE liso (magenta): rede orgânica no alto da face da direita, chegando à da esquerda junto ao eixo
blobs = []
_rl = _np.random.default_rng(21)
_nos = []
for _ in range(44):
    s = float(_rl.uniform(.05, .72)); z = float(_rl.uniform(.55, zmax(s) - .12))
    if z < .55: continue
    _nos.append(fy(s, z, float(_rl.uniform(.03, .1))))
for _ in range(12):
    s = float(_rl.uniform(.03, .3)); z = float(_rl.uniform(.62, zmax(s) - .14))
    _nos.append(fx(s, z, float(_rl.uniform(.03, .09))))
for i, p in enumerate(_nos):
    blobs.append(('BALL', tuple(p), float(_rl.uniform(.035, .055))))
    for k in sorted(range(len(_nos)), key=lambda k: (_nos[k] - p).length)[1:3]:
        d = _nos[k] - p
        if d.length > .2: continue
        n = max(2, int(d.length / .02))
        for t in range(1, n): blobs.append(('BALL', tuple(p + d * (t / n)), .03))
orgs.append(blob(blobs, liso_m, res=.01, thr=.5))

# ---------- mitocôndrias: cápsulas roxas com cristas onduladas (no chão e encaixadas nas faces de corte)
def mito(loc, M3, esc=1.35):
    g = []
    e = esfera((0, 0, 0), 1, mit_ext, seg=64); e.scale = (.14, .065, .035); bpy.ops.object.transform_apply(scale=True); g.append(e)
    i_ = esfera((0, 0, .012), 1, mit_int, seg=64); i_.scale = (.12, .05, .03); bpy.ops.object.transform_apply(scale=True); g.append(i_)
    for k in range(9):
        x = -.096 + k * .024
        g.append(tubo([(x + (.009 if q % 2 else -.009), y, .038 + .005 * math.cos(y * 40)) for q, y in enumerate(_np.linspace(-.036, .036, 7))], .0065, crist_m))
    M = _m.Matrix.Translation(loc) @ M3.to_4x4() @ _m.Matrix.Scale(esc, 4)
    for o in g: o.matrix_world = M @ o.matrix_world
    orgs.extend(g)
def rotz(a): return _m.Matrix.Rotation(math.radians(a), 3, 'Z')
mito(V((.36, -.66, .03)), rotz(-30))                                   # chão, frente-esquerda
mito(V((.7, -.34, .03)), rotz(55))                                      # chão, frente-direita
# na face x=0 (normal +x): z local -> +x; comprido na diagonal
mito(fx(.42, .66, -.005), _m.Matrix(((0, 0, 1), (1, 0, 0), (0, 1, 0))) @ _m.Matrix.Rotation(math.radians(-50), 3, 'Z'))
# na face y=0 (normal -y): z local -> -y
mito(fy(.62, .42, -.005), _m.Matrix(((1, 0, 0), (0, 0, -1), (0, 1, 0))) @ _m.Matrix.Rotation(math.radians(75), 3, 'Z'), 1.15)

# ---------- centrossomo: funil de malha ciano (microtúbulos) escavado na face da esquerda, dois centríolos dourados
_q = _ax.to_track_quat('Z', 'Y').to_matrix()
def _fp(t, ang, tw=0):
    r = .018 + .17 * t; a = ang + tw * t
    return _ap + _q @ V((r * math.cos(a), r * math.sin(a), FUN_L * t + .01))
oco = cilindro(tuple(_ap + _ax * .03), .03, .02, oco_m); oco.rotation_euler = _ax.to_track_quat('Z', 'Y').to_euler(); orgs.append(oco)
for k in range(14):
    a0 = k / 14 * 6.283
    for tw in (1.0, -1.0):
        orgs.append(tubo([tuple(_fp(t, a0, tw)) for t in _np.linspace(.05, 1, 8)], .007, rede_m, res=3))
for t in (.3, .55, .78, .98):
    orgs.append(tubo([tuple(_fp(t, a)) for a in _np.linspace(0, 6.283, 33)], .008, rede_m, res=3, fecha=True))
def centriolo(c, eixo, comp=.2, r=.045):
    M = _m.Matrix.Translation(c) @ eixo.to_track_quat('Z', 'Y').to_matrix().to_4x4()
    for k in range(9):
        a = k / 9 * 6.283
        for j in range(3):
            rr = r - j * .01; aa = a + j * .16
            p0 = M @ V((rr * math.cos(aa), rr * math.sin(aa), -comp / 2)); p1 = M @ V((rr * math.cos(aa), rr * math.sin(aa), comp / 2))
            orgs.append(bastao(tuple(p0), tuple(p1), .006, ouro))
_cc = _ap + _ax * (FUN_L * .7)
centriolo(_cc, (_ax + V((0, -.25, .35))).normalized(), comp=.24)
centriolo(_cc + _ax * .1 + V((0, .02, -.06)), V((0, 1, .2)).normalized(), comp=.14, r=.04)

# ---------- ribossomos livres: trincas no chão e nas faces de corte
def trinca(p, e1=V((1, 0, 0)), e2=V((0, 1, 0)), n=V((0, 0, 1))):
    for k in range(3):
        a = k / 3 * 6.283 + random.uniform(0, 1)
        orgs.append(esfera(tuple(p + e1 * (.02 * math.cos(a)) + e2 * (.02 * math.sin(a)) + n * .006), .016, ribo_m, seg=16))
def livre(p, raio=.13):
    if (V((p.x, p.y, 0)) - V((NC.x, NC.y, 0))).length < RN + .14: return False
    if (V((p.x, p.y, 0)) - V((GC.x + .66 * math.cos(math.radians(GOL_AZ)), GC.y + .66 * math.sin(math.radians(GOL_AZ)), 0))).length < .22: return False
    return True
n_ = 0
while n_ < 22:
    a = random.uniform(-math.pi / 2, 0); r = random.uniform(.2, .8); p = V((r * math.cos(a), r * math.sin(a), .008))
    if not livre(p): continue
    trinca(p); n_ += 1
for k in range(10):
    s = random.uniform(.1, .8); z = random.uniform(.05, zmax(s) - .15)
    if (s - FUN_S) ** 2 + (z - FUN_Z) ** 2 < .06 or (s < .55 and z < .75): continue
    trinca(fx(s, z, .004), V((0, 1, 0)), V((0, 0, 1)), V((1, 0, 0)))
for k in range(10):
    s = random.uniform(.1, .8); z = random.uniform(.05, zmax(s) - .15)
    if s < .55 and z < .75: continue
    trinca(fy(s, z, .004), V((1, 0, 0)), V((0, 0, 1)), V((0, -1, 0)))
parte('organelas', orgs)

# ---------- gira a célula para a câmera olhar o gomo de frente-direita (luz do padrão continua de frente)
bpy.context.view_layer.update()
G = _m.Matrix.Rotation(math.radians(CAM_AZIM - VISTA), 4, 'Z')
todos = [o for o in bpy.context.scene.objects if o.type in ('MESH', 'CURVE', 'FONT') and o.name != 'CHAO']
for o in todos: o.matrix_world = G @ o.matrix_world
bpy.context.view_layer.update()
# caixa envolvente da membrana alinhada à vista da câmera (mesma geometria no mundo): enquadramento justo
_Rv = _m.Matrix.Rotation(math.radians(CAM_AZIM), 4, 'Z') @ _m.Matrix.Rotation(math.radians(-CAM_ELEV), 4, 'X')
for o in (casca, cito):
    W = o.matrix_world.copy(); o.data.transform(_Rv.inverted() @ W); o.matrix_world = _Rv
bpy.context.view_layer.update()
mover_tudo(-min((casca.matrix_world @ v.co).z for v in casca.data.vertices))
render_camadas('B00', elev=CAM_ELEV, azim=CAM_AZIM, lente=LENTE, folga=.96, fundo=('membrana',))

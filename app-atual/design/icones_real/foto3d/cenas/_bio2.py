"""Revisao Biologia (31/10, segunda lente): materiais organicos ricos (variacao de cor por ruido, cavidade escurecida por AO,
relevo fino por bump, subsurface e brilho umido) + ajudantes. Uso: from _bio2 import *  (ja inclui _bk e kit)."""
from _bk import *
import random

def _n(nt, tipo, x=0, y=0):
    n = nt.nodes.new(tipo); n.location = (x, y); return n

def org(c1, c2=None, cav=None, sss=0.25, rugos=0.38, coat=0.35, bump=0.25, esc=6.0, det=6.0, ao=0.12, mix=0.55,
        raio=(1, .35, .25), cav_forca=0.75, bump_esc=None, metal=0.0, veio=None, veio_esc=3.0, sss_esc=0.015, centro=0.5, borda=0.6):
    """Material organico. c1 = cor base, c2 = segunda tonalidade (manchas por ruido), cav = cor das cavidades (AO).
    bump = forca do relevo fino; esc = escala do ruido; ao = distancia do AO (unid. de cena); veio = cor de veias (voronoi)."""
    m = bpy.data.materials.new('org'); m.use_nodes = True; nt = m.node_tree; b = nt.nodes['Principled BSDF']
    c2 = c2 or c1
    if cav is None:
        cc = cor(c1); cav_rgb = tuple(max(0, v * 0.28) for v in cc[:3]) + (1,)
    else:
        cav_rgb = cor(cav)
    tc = _n(nt, 'ShaderNodeTexCoord', -1200, 0)
    nz = _n(nt, 'ShaderNodeTexNoise', -1000, 100); nz.inputs['Scale'].default_value = esc; nz.inputs['Detail'].default_value = det
    nz.inputs['Roughness'].default_value = 0.55
    nt.links.new(tc.outputs['Object'], nz.inputs['Vector'])
    cr = _n(nt, 'ShaderNodeValToRGB', -800, 100); cr.color_ramp.elements[0].position = centro - mix / 2; cr.color_ramp.elements[1].position = centro + mix / 2
    cr.color_ramp.elements[0].color = cor(c1); cr.color_ramp.elements[1].color = cor(c2)
    nt.links.new(nz.outputs['Fac'], cr.inputs['Fac'])
    base = cr.outputs['Color']
    if veio:
        vo = _n(nt, 'ShaderNodeTexVoronoi', -1000, 400); vo.feature = 'DISTANCE_TO_EDGE'; vo.inputs['Scale'].default_value = veio_esc
        nt.links.new(tc.outputs['Object'], vo.inputs['Vector'])
        vr = _n(nt, 'ShaderNodeValToRGB', -800, 400); vr.color_ramp.elements[0].position = 0.0; vr.color_ramp.elements[1].position = 0.035
        vr.color_ramp.elements[0].color = (1, 1, 1, 1); vr.color_ramp.elements[1].color = (0, 0, 0, 1)
        nt.links.new(vo.outputs['Distance'], vr.inputs['Fac'])
        mv = _n(nt, 'ShaderNodeMix', -550, 300); mv.data_type = 'RGBA'
        nt.links.new(vr.outputs['Color'], mv.inputs['Factor']); nt.links.new(base, mv.inputs[6]); mv.inputs[7].default_value = cor(veio)
        base = mv.outputs[2]
    # cavidade por AO
    a = _n(nt, 'ShaderNodeAmbientOcclusion', -800, -200); a.inputs['Distance'].default_value = ao; a.only_local = True; a.samples = 8
    ar = _n(nt, 'ShaderNodeValToRGB', -600, -200); ar.color_ramp.elements[0].position = 0.25; ar.color_ramp.elements[1].position = 0.95
    nt.links.new(a.outputs['AO'], ar.inputs['Fac'])
    mx = _n(nt, 'ShaderNodeMix', -350, 0); mx.data_type = 'RGBA'
    inv = _n(nt, 'ShaderNodeMath', -450, -200); inv.operation = 'SUBTRACT'; inv.inputs[0].default_value = 1.0
    nt.links.new(ar.outputs['Color'], inv.inputs[1])
    mul = _n(nt, 'ShaderNodeMath', -400, -300); mul.operation = 'MULTIPLY'; mul.inputs[1].default_value = cav_forca
    nt.links.new(inv.outputs[0], mul.inputs[0])
    nt.links.new(mul.outputs[0], mx.inputs['Factor']); nt.links.new(base, mx.inputs[6]); mx.inputs[7].default_value = cav_rgb
    # borda mais escura (da forma sob luz frontal)
    lw = _n(nt, 'ShaderNodeLayerWeight', -350, 200); lw.inputs['Blend'].default_value = 0.5
    lm = _n(nt, 'ShaderNodeMath', -250, 200); lm.operation = 'MULTIPLY'; lm.inputs[1].default_value = borda
    nt.links.new(lw.outputs['Facing'], lm.inputs[0])
    mb_ = _n(nt, 'ShaderNodeMix', -150, 100); mb_.data_type = 'RGBA'; mb_.blend_type = 'MULTIPLY'
    nt.links.new(lm.outputs[0], mb_.inputs['Factor']); nt.links.new(mx.outputs[2], mb_.inputs[6]); nt.links.new(mx.outputs[2], mb_.inputs[7])
    nt.links.new(mb_.outputs[2], b.inputs['Base Color'])
    # relevo fino
    if bump:
        nb = _n(nt, 'ShaderNodeTexNoise', -800, -500); nb.inputs['Scale'].default_value = bump_esc or esc * 4; nb.inputs['Detail'].default_value = 8
        nt.links.new(tc.outputs['Object'], nb.inputs['Vector'])
        bp = _n(nt, 'ShaderNodeBump', -350, -500); bp.inputs['Strength'].default_value = bump; bp.inputs['Distance'].default_value = 0.02
        nt.links.new(nb.outputs['Fac'], bp.inputs['Height']); nt.links.new(bp.outputs['Normal'], b.inputs['Normal'])
    b.inputs['Roughness'].default_value = rugos; b.inputs['Subsurface Weight'].default_value = sss
    b.inputs['Subsurface Radius'].default_value = raio; b.inputs['Subsurface Scale'].default_value = sss_esc
    b.inputs['Coat Weight'].default_value = coat; b.inputs['Coat Roughness'].default_value = 0.12
    b.inputs['Metallic'].default_value = metal
    return m

def osso(c1='#efe3c8', c2='#d9c49a'):
    return org(c1, c2, cav='#8a6d43', sss=.15, rugos=.55, coat=.1, bump=.35, esc=5, ao=.15)

def pedra(c1='#bfb3a0', c2='#9c8f7b'):
    return org(c1, c2, cav='#4a4036', sss=0, rugos=.85, coat=0, bump=.8, esc=3, ao=.25, mix=.8)

def suave_mod(o, n=2):
    md = o.modifiers.new('sd', 'SUBSURF'); md.levels = n; md.render_levels = n
    for p in o.data.polygons: p.use_smooth = True
    return o

def ruido(o, forca=.04, escala=.4, sub=0):
    return desloca(o, forca, escala, sub=sub)

def mover_tudo(dz):
    for ob in bpy.context.scene.objects:
        if ob.type in ('MESH', 'CURVE', 'FONT') and ob.name != 'CHAO' and ob.parent is None: ob.location.z += dz

def chao_auto():
    """coloca a base do conjunto em z=0 (sombra de contato correta)"""
    bpy.context.view_layer.update(); dg = bpy.context.evaluated_depsgraph_get(); zs = []
    for o in bpy.context.scene.objects:
        if o.type in ('MESH', 'CURVE', 'FONT') and o.name != 'CHAO':
            oe = o.evaluated_get(dg); zs += [(oe.matrix_world @ mathutils.Vector(c)).z for c in oe.bound_box]
    mover_tudo(-min(zs))

def corta_metade(o, plano_z=None, eixo='Z', pos=0.0, lado=1, tam=20):
    """corta o objeto removendo o semi-espaco eixo>pos (lado=1) com caixa booleana"""
    loc = [0, 0, 0]; i = 'XYZ'.index(eixo); loc[i] = pos + lado * tam / 2
    bpy.ops.mesh.primitive_cube_add(size=tam, location=loc); b = bpy.context.object
    return dif(o, b)

def emp_eixo(v=(1, 1, 1)):
    """empty cuja combinacao x+y+z local aponta para o eixo +Z do mundo (para texturas em faixas horizontais)"""
    e = bpy.data.objects.new('emp', None); bpy.context.scene.collection.objects.link(e)
    q = mathutils.Vector(v).normalized().rotation_difference(mathutils.Vector((0, 0, 1)))
    e.rotation_euler = q.inverted().to_euler(); return e

def faixas(o, forca=.04, escala=.08, eixo_obj=None, tipo='WOOD'):
    tx = bpy.data.textures.new('fx', tipo)
    if tipo == 'WOOD': tx.wood_type = 'BANDS'; tx.noise_basis_2 = 'SIN'
    tx.noise_scale = escala
    md = o.modifiers.new('fx', 'DISPLACE'); md.texture = tx; md.strength = forca; md.direction = 'NORMAL'
    md.texture_coords = 'OBJECT'; md.texture_coords_object = eixo_obj or emp_eixo(); return o

def giros(o, forca=.08, escala=.22, turb=6.0, prof=2):
    tx = bpy.data.textures.new('gi', 'MARBLE'); tx.marble_type = 'SHARPER'; tx.noise_scale = escala; tx.turbulence = turb
    tx.noise_depth = prof; tx.noise_basis_2 = 'SIN'
    md = o.modifiers.new('gi', 'DISPLACE'); md.texture = tx; md.strength = forca; md.texture_coords = 'GLOBAL'; md.mid_level = .5
    return o

def gn_sulcos(o, forca=.06, escala=3.0, largura=.08, warp=.6, warp_esc=1.5, tipo='voronoi', eixo='Z', sub=3, seed=0.0):
    """Relevo por geometry nodes (deslocamento na normal): tipo 'voronoi' = sulcos sinuosos (giros do cerebro, rede);
    'onda' = faixas paralelas ao plano perpendicular ao eixo (folhas do cerebelo, aneis, estrias)."""
    if sub: subdiv(o, sub)
    ng = bpy.data.node_groups.new('sul', 'GeometryNodeTree')
    ng.interface.new_socket('Geometry', in_out='INPUT', socket_type='NodeSocketGeometry')
    ng.interface.new_socket('Geometry', in_out='OUTPUT', socket_type='NodeSocketGeometry')
    N = ng.nodes; L = ng.links
    gi = N.new('NodeGroupInput'); go = N.new('NodeGroupOutput')
    pos = N.new('GeometryNodeInputPosition'); nor = N.new('GeometryNodeInputNormal')
    nz = N.new('ShaderNodeTexNoise'); nz.inputs['Scale'].default_value = warp_esc; nz.inputs['Detail'].default_value = 3
    try: nz.inputs['W'].default_value = seed; nz.noise_dimensions = '4D'
    except Exception: pass
    L.new(pos.outputs[0], nz.inputs['Vector'])
    sub_ = N.new('ShaderNodeVectorMath'); sub_.operation = 'SUBTRACT'; sub_.inputs[1].default_value = (.5, .5, .5)
    L.new(nz.outputs['Color'], sub_.inputs[0])
    sc = N.new('ShaderNodeVectorMath'); sc.operation = 'SCALE'; sc.inputs['Scale'].default_value = warp
    L.new(sub_.outputs[0], sc.inputs[0])
    ad = N.new('ShaderNodeVectorMath'); ad.operation = 'ADD'; L.new(pos.outputs[0], ad.inputs[0]); L.new(sc.outputs[0], ad.inputs[1])
    if tipo == 'voronoi':
        tx = N.new('ShaderNodeTexVoronoi'); tx.feature = 'DISTANCE_TO_EDGE'; tx.inputs['Scale'].default_value = escala
        L.new(ad.outputs[0], tx.inputs['Vector']); val = tx.outputs['Distance']
        mr = N.new('ShaderNodeMapRange'); mr.inputs['From Min'].default_value = 0; mr.inputs['From Max'].default_value = largura
        mr.inputs['To Min'].default_value = -1; mr.inputs['To Max'].default_value = 0; mr.interpolation_type = 'SMOOTHSTEP'
        L.new(val, mr.inputs['Value']); f = mr.outputs['Result']
    elif tipo == 'ruga':
        tx = N.new('ShaderNodeTexNoise'); tx.inputs['Scale'].default_value = escala; tx.inputs['Detail'].default_value = 1.5
        tx.inputs['Roughness'].default_value = .4
        L.new(ad.outputs[0], tx.inputs['Vector'])
        m1 = N.new('ShaderNodeMath'); m1.operation = 'SUBTRACT'; m1.inputs[1].default_value = .5; L.new(tx.outputs['Fac'], m1.inputs[0])
        m2 = N.new('ShaderNodeMath'); m2.operation = 'ABSOLUTE'; L.new(m1.outputs[0], m2.inputs[0])
        mr = N.new('ShaderNodeMapRange'); mr.inputs['From Min'].default_value = 0; mr.inputs['From Max'].default_value = largura
        mr.inputs['To Min'].default_value = -1; mr.inputs['To Max'].default_value = 0; mr.interpolation_type = 'SMOOTHERSTEP'
        L.new(m2.outputs[0], mr.inputs['Value']); f = mr.outputs['Result']
    else:
        tx = N.new('ShaderNodeTexWave'); tx.wave_type = 'BANDS'; tx.bands_direction = eixo; tx.inputs['Scale'].default_value = escala
        tx.inputs['Distortion'].default_value = 0.0
        L.new(ad.outputs[0], tx.inputs['Vector'])
        mr = N.new('ShaderNodeMapRange'); mr.inputs['From Min'].default_value = 0; mr.inputs['From Max'].default_value = 1
        mr.inputs['To Min'].default_value = -1; mr.inputs['To Max'].default_value = 0
        pw = N.new('ShaderNodeMath'); pw.operation = 'POWER'; pw.inputs[1].default_value = largura  # largura = expoente (0.3 = sulcos finos)
        L.new(tx.outputs['Fac'], pw.inputs[0]); L.new(pw.outputs[0], mr.inputs['Value']); f = mr.outputs['Result']
    mul = N.new('ShaderNodeMath'); mul.operation = 'MULTIPLY'; mul.inputs[1].default_value = forca; L.new(f, mul.inputs[0])
    vs = N.new('ShaderNodeVectorMath'); vs.operation = 'SCALE'; L.new(nor.outputs[0], vs.inputs[0]); L.new(mul.outputs[0], vs.inputs['Scale'])
    sp = N.new('GeometryNodeSetPosition'); L.new(gi.outputs[0], sp.inputs['Geometry']); L.new(vs.outputs[0], sp.inputs['Offset'])
    L.new(sp.outputs[0], go.inputs[0])
    md = o.modifiers.new('gn', 'NODES'); md.node_group = ng
    for p in o.data.polygons: p.use_smooth = True
    return o

def faixas_mat(paradas, eixo='X', rugos=.35, coat=.4, sss=.1, bump=.1, esc=20, tipo='CONSTANT'):
    """material com faixas de cor ao longo de um eixo do objeto. paradas: [(pos, '#hex'), ...] em coordenadas do objeto
    normalizadas pelo intervalo dado como primeiro/ultimo pos."""
    m = bpy.data.materials.new('fx'); m.use_nodes = True; nt = m.node_tree; b = nt.nodes['Principled BSDF']
    tc = _n(nt, 'ShaderNodeTexCoord'); sx = _n(nt, 'ShaderNodeSeparateXYZ'); nt.links.new(tc.outputs['Object'], sx.inputs[0])
    lo, hi = paradas[0][0], paradas[-1][0]
    mr = _n(nt, 'ShaderNodeMapRange'); mr.inputs['From Min'].default_value = lo; mr.inputs['From Max'].default_value = hi
    nt.links.new(sx.outputs['XYZ'.index(eixo)], mr.inputs['Value'])
    cr = _n(nt, 'ShaderNodeValToRGB'); cr.color_ramp.interpolation = tipo
    els = cr.color_ramp.elements
    while len(els) < len(paradas): els.new(0.5)
    for e, (p, h) in zip(els, paradas): e.position = (p - lo) / (hi - lo); e.color = cor(h)
    nt.links.new(mr.outputs['Result'], cr.inputs['Fac']); nt.links.new(cr.outputs['Color'], b.inputs['Base Color'])
    if bump:
        nb = _n(nt, 'ShaderNodeTexNoise'); nb.inputs['Scale'].default_value = esc; bp = _n(nt, 'ShaderNodeBump'); bp.inputs['Strength'].default_value = bump
        bp.inputs['Distance'].default_value = .02
        nt.links.new(tc.outputs['Object'], nb.inputs['Vector']); nt.links.new(nb.outputs['Fac'], bp.inputs['Height']); nt.links.new(bp.outputs['Normal'], b.inputs['Normal'])
    b.inputs['Roughness'].default_value = rugos; b.inputs['Coat Weight'].default_value = coat; b.inputs['Subsurface Weight'].default_value = sss
    b.inputs['Subsurface Scale'].default_value = .015
    return m

def hemacia(loc, r, m, rot=(0, 0, 0)):
    """disco bicôncavo (perfil classico de Evans-Fung)"""
    import bmesh
    me = bpy.data.meshes.new('rbc'); bm = bmesh.new()
    prof = []
    N = 24
    for i in range(N + 1):
        x = i / N; rr = x * r
        h = r * .5 * math.sqrt(max(0, 1 - x * x)) * (0.207 + 2.003 * x * x - 1.123 * x ** 4)
        prof.append((rr, h))
    pts = [(rr, h) for rr, h in prof] + [(rr, -h) for rr, h in reversed(prof[:-1])]
    vs = [bm.verts.new((p[0] + 1e-4, 0, p[1])) for p in pts]
    for a, b2 in zip(vs[:-1], vs[1:]): bm.edges.new((a, b2))
    bmesh.ops.spin(bm, geom=bm.verts[:] + bm.edges[:], angle=math.radians(360), steps=64, axis=(0, 0, 1), cent=(0, 0, 0))
    bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-4)
    bm.to_mesh(me); o = bpy.data.objects.new('rbc', me); bpy.context.scene.collection.objects.link(o)
    o.location = loc; o.rotation_euler = rot; o.data.materials.append(m)
    for p in o.data.polygons: p.use_smooth = True
    subdiv(o, 1)
    return o

_cena_kit = cena
def cena(mundo=0.1, fill=140, key=950):
    """cena do kit com mais contraste de forma (mundo e preenchimento mais fracos), mesma direcao de luz (frente)"""
    sc = _cena_kit()
    sc.world.node_tree.nodes['Background'].inputs[1].default_value = mundo
    bpy.data.objects['FILL'].data.energy = fill; bpy.data.objects['KEY'].data.energy = key
    bpy.data.objects['KEY'].data.shape = 'DISK'; bpy.data.objects['FILL'].data.shape = 'DISK'
    return sc

def _clareia(hexa, k):
    h = hexa.lstrip('#'); c = [int(h[i:i + 2], 16) for i in (0, 2, 4)]
    c = [max(0, min(255, int(v * k))) for v in c]; return '#%02x%02x%02x' % tuple(c)
def pele_org(hexa, sss=0.15, rugos=0.4, raio=(1, .3, .2)):
    return org(hexa, _clareia(hexa, 1.12), sss=min(.5, sss + .1), rugos=rugos, coat=.45, bump=.2, esc=5, raio=raio)
def plast_org(hexa, rugos=0.32):
    return org(hexa, _clareia(hexa, 1.1), sss=.15, rugos=rugos, coat=.5, bump=.12, esc=5)
clareia = _clareia

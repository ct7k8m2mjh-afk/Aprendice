# F11 Eletricidade e circuitos: pilha AA em pe (corpo preto brilhante, faixa dourada escovada com "+" impresso, "-" branco,
# tampa prateada com aneis usinados), fio vermelho de borracha saindo de DENTRO da tampa, subindo, cruzando, descendo ate o
# soquete da lampada e voltando pelo chao ate a base da pilha; lampada incandescente acesa (vidro claro com brilho ambar,
# filamento em espiral em dois fios de suporte e haste de vidro, rosca prateada com filete real, soquete metalico cinza-escuro).
# Render em camadas (pilha / fio / lampada). 03/11 (v2: proporcoes da folha de referencia do dono + acabamento dos materiais).
import sys, os, math
_AQ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path[:0] = [_AQ, os.path.join(_AQ, 'cenas')]
from _qui import *
from _bk import tubo
from camadas import parte, render_camadas
import bmesh
V = mathutils.Vector

sc = cena_q()


def objs_novos(antes):
    return [o for o in bpy.context.scene.objects if o.name not in antes and o.type in ('MESH', 'FONT', 'CURVE')]


def nomes():
    return {o.name for o in bpy.context.scene.objects}


def sel(o):
    bpy.ops.object.select_all(action='DESELECT'); o.select_set(True); bpy.context.view_layer.objects.active = o


# ---------------- materiais com acabamento (ruido de rugosidade + relevo finissimo) ----------------
def _n(nt, tipo):
    return nt.nodes.new(tipo)


def acabamento(m, rug, rvar=0.06, resc=18.0, bump=0.02, besc=260.0, esticar=None, bump_dist=0.002):
    """rugosidade variando por ruido (rug +- rvar) e relevo fino; esticar=(sx,sy,sz) estica o ruido (escovado)."""
    nt = m.node_tree; b = nt.nodes['Principled BSDF']
    tc = _n(nt, 'ShaderNodeTexCoord'); vec = tc.outputs['Object']
    if esticar:
        mp = _n(nt, 'ShaderNodeMapping'); mp.inputs['Scale'].default_value = esticar
        nt.links.new(vec, mp.inputs['Vector']); vec = mp.outputs['Vector']
    nz = _n(nt, 'ShaderNodeTexNoise'); nz.inputs['Scale'].default_value = resc; nz.inputs['Detail'].default_value = 6
    nt.links.new(vec, nz.inputs['Vector'])
    mr = _n(nt, 'ShaderNodeMapRange'); mr.inputs['To Min'].default_value = max(0, rug - rvar); mr.inputs['To Max'].default_value = rug + rvar
    mr.inputs['From Min'].default_value = 0.3; mr.inputs['From Max'].default_value = 0.7
    nt.links.new(nz.outputs['Fac'], mr.inputs['Value']); nt.links.new(mr.outputs['Result'], b.inputs['Roughness'])
    if bump:
        nb = _n(nt, 'ShaderNodeTexNoise'); nb.inputs['Scale'].default_value = besc; nb.inputs['Detail'].default_value = 4
        nt.links.new(vec, nb.inputs['Vector'])
        bp = _n(nt, 'ShaderNodeBump'); bp.inputs['Strength'].default_value = bump; bp.inputs['Distance'].default_value = bump_dist
        nt.links.new(nb.outputs['Fac'], bp.inputs['Height']); nt.links.new(bp.outputs['Normal'], b.inputs['Normal'])
    return m


def principled(nome, hexa, rug=0.3, metal=0.0, coat=0.0, coat_rug=0.08, aniso=0.0, **kw):
    m = bpy.data.materials.new(nome); m.use_nodes = True; b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = cor(hexa); b.inputs['Roughness'].default_value = rug
    b.inputs['Metallic'].default_value = metal; b.inputs['Coat Weight'].default_value = coat
    b.inputs['Coat Roughness'].default_value = coat_rug
    if aniso: b.inputs['Anisotropic'].default_value = aniso
    for k, v in kw.items(): b.inputs[k].default_value = v
    return m


# corpo preto: plastico laqueado, verniz brilhante, rugosidade levemente irregular (filme impresso do rotulo)
preto = acabamento(principled('pilha_preto', '#030304', 0.42, coat=0.35, coat_rug=0.05, **{'Specular IOR Level': 0.3}), 0.42, rvar=0.05, resc=9, bump=0.012, besc=420)
# faixa dourada: metal escovado (riscos horizontais), verniz por cima
ouro = acabamento(principled('pilha_ouro', '#ffc22c', 0.2, metal=0.45, coat=0.8, coat_rug=0.05, aniso=0.3),
                  0.2, rvar=0.06, resc=6, bump=0.012, besc=40, esticar=(1, 1, 90))
prata = acabamento(principled('tampa_prata', '#d4d7dc', 0.16, metal=1.0, aniso=0.7), 0.16, rvar=0.06, resc=10, bump=0.015, besc=300)
tinta_preta = acabamento(principled('tinta_preta', '#0c0c0c', 0.5), 0.5, rvar=0.06, resc=40, bump=0.0)
tinta_branca = acabamento(principled('tinta_branca', '#f2f2ee', 0.42, coat=0.3), 0.42, rvar=0.05, resc=40, bump=0.0)
anel_isol = principled('anel_isol', '#1d1d20', 0.45)
vermelho = acabamento(principled('fio_borracha', '#dc1a1e', 0.28, coat=1.0, coat_rug=0.04,
                                 **{'Subsurface Weight': 0.08, 'Subsurface Radius': (1, .2, .1), 'Subsurface Scale': 0.02}),
                      0.3, rvar=0.06, resc=10, bump=0.006, besc=120)
soq = acabamento(principled('soquete', '#74777d', 0.36, metal=0.6, coat=0.3, coat_rug=0.2, aniso=0.5), 0.36, rvar=0.05, resc=8, bump=0.004, besc=200)
rosca_m = acabamento(principled('rosca', '#cfd2d6', 0.2, metal=1.0, aniso=0.4), 0.2, rvar=0.06, resc=16, bump=0.015, besc=300)


def decalque(o, R, folga=0.003):
    """aplica mods, subdivide (simples) e enrola a peca plana (no plano y=-R) sobre o cilindro de raio R (eixo Z, centro x=y=0)."""
    sel(o)
    if o.type == 'FONT':
        bpy.ops.object.convert(target='MESH'); o = bpy.context.object
    for md in list(o.modifiers): bpy.ops.object.modifier_apply(modifier=md.name)
    md = o.modifiers.new('sd', 'SUBSURF'); md.subdivision_type = 'SIMPLE'; md.levels = md.render_levels = 4
    bpy.ops.object.modifier_apply(modifier='sd')
    bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
    for v in o.data.vertices:
        off = v.co.y + R                      # espessura (negativo = para fora)
        ang = v.co.x / R                      # arco -> angulo (sem distorcer a largura)
        rr = R + folga - off
        v.co.x = rr * math.sin(ang); v.co.y = -rr * math.cos(ang)
    for p in o.data.polygons: p.use_smooth = False
    return o


# ---------------- pilha ----------------
a0 = nomes()
PR, PH = 0.62, 2.2          # raio e altura do corpo
ZB = 1.36                   # inicio da faixa dourada
# corpo preto: base arredondada (aresta que pega luz)
torno([(0, 0), (PR - .07, 0), (PR - .03, .008), (PR - .008, .03), (PR, .07), (PR, ZB)], preto, fechado=False, nome='pilha_corpo')
# faixa dourada (um fio mais grossa: o rotulo sobreposto) com ombro arredondado
torno([(PR + .003, ZB - .002), (PR + .003, ZB + .01), (PR + .003, PH - .07), (PR - .006, PH - .03), (PR - .03, PH - .006),
       (PR - .07, PH), (.3, PH), (0, PH)], ouro, fechado=False, nome='pilha_faixa')
# junta entre o rotulo preto e o dourado (filete escuro bem fino)
torno([(PR + .0005, ZB - .01), (PR + .006, ZB - .006), (PR + .006, ZB + .002), (PR + .0005, ZB + .006)], anel_isol, fechado=False, nome='junta')
# anel isolante escuro em volta da tampa
torno([(.240, PH - .004), (.240, PH + .012), (.228, PH + .02), (.204, PH + .02), (.204, PH - .004)], anel_isol, fechado=False, nome='isol')
# tampa prateada com aneis usinados (pequenos degraus e sulcos)
TH = .2
torno([(0, PH), (.196, PH), (.196, PH + .02), (.200, PH + .03), (.200, PH + .07), (.194, PH + .078), (.200, PH + .086),
       (.200, PH + .13), (.194, PH + .138), (.200, PH + .146), (.200, PH + TH - .03), (.192, PH + TH - .008), (.176, PH + TH),
       (.128, PH + TH), (.120, PH + TH - .006), (.112, PH + TH), (.072, PH + TH), (.064, PH + TH - .006), (.056, PH + TH), (0, PH + TH)],
      prata, fechado=False, nome='pilha_tampa')
# "+" impresso na faixa dourada e "-" branco no corpo (decalques enrolados no cilindro)
# "+" negrito: duas barras de cantos arredondados (como o sinal impresso grosso da ref)
for (sx, sz) in ((.21, .055), (.055, .21)):
    bpy.ops.mesh.primitive_cube_add(size=1, location=(0, -PR - .003, 1.76)); bp_ = bpy.context.object
    bp_.scale = (2 * sx, .005, 2 * sz); bp_.data.materials.append(tinta_preta)
    bv = bp_.modifiers.new('bv', 'BEVEL'); bv.width = .025; bv.segments = 4; bv.affect = 'EDGES'
    decalque(bp_, PR + .003)
bpy.ops.mesh.primitive_cube_add(size=1, location=(0, -PR, .62)); mb = bpy.context.object; mb.scale = (.34, .005, .085)
mb.data.materials.append(tinta_branca)
bv = mb.modifiers.new('bv', 'BEVEL'); bv.width = .02; bv.segments = 4; bv.affect = 'EDGES'
decalque(mb, PR)
pilha = objs_novos(a0)

# ---------------- lampada ----------------
a1 = nomes()
LX, LY = 3.25, 0.32
# soquete: disco largo e baixo, chanfros arredondados, gola mais estreita onde a rosca entra
torno([(0, 0), (.76, 0), (.8, .012), (.82, .04), (.825, .08), (.825, .3), (.815, .35), (.79, .38), (.75, .395), (.66, .40),
       (.6, .41), (.585, .43), (.58, .46), (.57, .49), (.54, .5), (.5, .5), (.48, .49), (0, .49)], soq, loc=(LX, LY, 0), fechado=False, nome='soquete')
# frisos no costado do soquete
for zf in (.14, .26):
    torno([(.826, zf - .012), (.818, zf), (.826, zf + .012)], soq, loc=(LX, LY, 0), fechado=False, nome='friso')


def rosca(r0, amp, z0, z1, passo, loc, m, seg=128, por_passo=20):
    """cilindro com filete helicoidal real (raio varia com z - passo*theta/2pi), com acabamento liso nas pontas."""
    me = bpy.data.meshes.new('rosca'); bm = bmesh.new()
    nz = int((z1 - z0) / passo * por_passo) + 1
    an = []
    for i in range(nz):
        z = z0 + (z1 - z0) * i / (nz - 1); fila = []
        for k in range(seg):
            th = 2 * math.pi * k / seg
            f = ((z - z0) / passo - th / (2 * math.pi)) % 1.0
            perf = 0.5 + 0.5 * math.cos(2 * math.pi * f)          # crista arredondada
            perf = perf ** 0.7
            ponta = min(1.0, (z - z0) / (passo * .8), (z1 - z) / (passo * .8))
            ponta = max(0.0, ponta); ponta = ponta * ponta * (3 - 2 * ponta)
            r = r0 + amp * perf * ponta
            fila.append(bm.verts.new((r * math.cos(th), r * math.sin(th), z)))
        an.append(fila)
    for i in range(nz - 1):
        for k in range(seg):
            bm.faces.new((an[i][k], an[i][(k + 1) % seg], an[i + 1][(k + 1) % seg], an[i + 1][k]))
    bm.normal_update(); bm.to_mesh(me); bm.free()
    o = bpy.data.objects.new('rosca', me); bpy.context.scene.collection.objects.link(o); o.location = loc
    me.materials.append(m)
    for p in me.polygons: p.use_smooth = True
    return o


ZR0, ZR1 = .46, .84
rosca(.42, .05, ZR0, ZR1, .095, (LX, LY, 0), rosca_m)
# anel isolante escuro entre a rosca e o soquete (como a ref)
torno([(0, .47), (.49, .47), (.5, .48), (.5, .52), (.49, .53), (0, .53)], anel_isol, loc=(LX, LY, 0), fechado=False, nome='isol_rosca')
# aro de cima da rosca (onde o vidro e colado)
torno([(.0, ZR1 - .01), (.45, ZR1 - .01), (.465, ZR1), (.46, ZR1 + .03), (.43, ZR1 + .04), (0, ZR1 + .04)], rosca_m, loc=(LX, LY, 0), fechado=False, nome='aro')

# vidro: casca fina (por fora e por dentro), formato de pera: pescoco -> globo
RG, ZG = .84, 1.88
ext = []
for i in range(0, 61):
    t = i / 60
    if t < .3:
        u = t / .3; r = .41 + .01 * u + .16 * u ** 2.6; z = ZR1 + .02 + .42 * u
    else:
        u = (t - .3) / .7
        ang = -math.radians(42) + u * math.radians(132)
        r = RG * math.cos(ang); z = ZG + RG * math.sin(ang)
    ext.append((max(r, 0.0), z))
ext[-1] = (0, ZG + RG)
# suaviza a emenda pescoco/globo
ESP = .022
inn = [(max(0.0, r - ESP), z - (ESP if r < .05 else 0)) for (r, z) in reversed(ext)]
vb = bpy.data.materials.new('vidro_lamp'); vb.use_nodes = True; nt = vb.node_tree; b = nt.nodes['Principled BSDF']
b.inputs['Base Color'].default_value = cor('#f29a1c'); b.inputs['Transmission Weight'].default_value = float(os.environ.get('VTR', 0.65))
b.inputs['Roughness'].default_value = 0.02; b.inputs['IOR'].default_value = 1.14
b.inputs['Specular IOR Level'].default_value = float(os.environ.get('VSP', 0.25))
# emissao ambar: centro amarelo quente, bordas laranja (vidro "aceso", quase opaco)
lwg = nt.nodes.new('ShaderNodeLayerWeight'); lwg.inputs['Blend'].default_value = 0.5
rp = nt.nodes.new('ShaderNodeValToRGB'); E = rp.color_ramp.elements
E[0].position = 0.0; E[0].color = cor('#cc620a'); E[1].position = 1.0; E[1].color = cor('#ffc63a')
E.new(0.55).color = cor('#f39a1e')
nt.links.new(lwg.outputs['Facing'], rp.inputs['Fac']); nt.links.new(rp.outputs['Color'], b.inputs['Emission Color'])
b.inputs['Emission Strength'].default_value = float(os.environ.get('VEM', 0.74))
gl = torno(ext + inn, vb, loc=(LX, LY, 0), fechado=True, nome='vidro', seg=96)

# brilho interno ambar: volume emissivo com o formato interno do vidro (mais espesso no miolo = mais claro no centro)
gm = bpy.data.materials.new('brilho'); gm.use_nodes = True; nt = gm.node_tree
for nd in list(nt.nodes):
    if nd.type != 'OUTPUT_MATERIAL': nt.nodes.remove(nd)
outn = [nd for nd in nt.nodes if nd.type == 'OUTPUT_MATERIAL'][0]
em = nt.nodes.new('ShaderNodeEmission'); em.inputs['Color'].default_value = cor('#ff9a1a'); em.inputs['Strength'].default_value = float(os.environ.get('GLOW', 0.25))
nt.links.new(em.outputs[0], outn.inputs['Volume'])
brilho = torno([(0, ext[0][1] + .03)] + [(max(0.0, r - ESP - .006), z) for (r, z) in ext[1:-1]] + [(0, ext[-1][1] - ESP - .006)],
               gm, loc=(LX, LY, 0), fechado=False, nome='brilho', seg=64)
brilho.visible_shadow = False

# haste de vidro (pe alargado) + dois fios de suporte + filamento em espiral
haste_m = principled('haste', '#fff1c8', 0.08, **{'Transmission Weight': 0.5, 'IOR': 1.5, 'Emission Color': cor('#ffe39a'), 'Emission Strength': 0.9})
torno([(0, ZR1 + .02), (.2, ZR1 + .02), (.17, ZR1 + .06), (.1, ZR1 + .14), (.085, ZR1 + .24), (.08, 1.52), (.1, 1.55), (.07, 1.58), (0, 1.58)],
      haste_m, loc=(LX, LY, 0), fechado=False, nome='haste')
sup = principled('suporte', '#9a6a2a', 0.3, metal=1.0)
FZ = 1.94; FW = .3
for s in (-1, 1):
    tubo([(LX + s * .04, LY, 1.3), (LX + s * .05, LY, 1.56), (LX + s * .15, LY, 1.74), (LX + s * FW, LY, FZ)], .02, sup, tipo='NURBS')
# fio central de apoio (gancho)
tubo([(LX, LY, 1.56), (LX, LY, 1.82), (LX, LY - .015, FZ + .05)], .012, sup, tipo='NURBS')
fil = emissivo('#fff6dc', 70)
esp = []
NV = 12; N = 12 * 24
for i in range(N + 1):
    t = i / N; x = -FW + 2 * FW * t; a = t * 2 * math.pi * NV
    zc = FZ + .05 * math.sin(math.pi * t)              # arco suave entre os suportes
    esp.append((LX + x, LY + .02 * math.sin(a), zc + .02 * math.cos(a)))
tubo(esp, .007, fil, tipo='POLY', res=4)
# halo do filamento (calor)
hm = bpy.data.materials.new('halo'); hm.use_nodes = True; nt = hm.node_tree
for nd in list(nt.nodes):
    if nd.type != 'OUTPUT_MATERIAL': nt.nodes.remove(nd)
outn = [nd for nd in nt.nodes if nd.type == 'OUTPUT_MATERIAL'][0]
lw = nt.nodes.new('ShaderNodeLayerWeight'); lw.inputs['Blend'].default_value = 0.5
cr = nt.nodes.new('ShaderNodeValToRGB'); cr.color_ramp.elements[0].position = 0.0; cr.color_ramp.elements[0].color = (1, 1, 1, 1)
cr.color_ramp.elements[1].position = 0.7; cr.color_ramp.elements[1].color = (0, 0, 0, 1)
nt.links.new(lw.outputs['Facing'], cr.inputs['Fac'])
em = nt.nodes.new('ShaderNodeEmission'); em.inputs['Color'].default_value = cor('#ff9a30'); em.inputs['Strength'].default_value = 0.25
tr = nt.nodes.new('ShaderNodeBsdfTransparent'); mx = nt.nodes.new('ShaderNodeMixShader')
nt.links.new(cr.outputs['Color'], mx.inputs[0]); nt.links.new(tr.outputs[0], mx.inputs[1]); nt.links.new(em.outputs[0], mx.inputs[2])
nt.links.new(mx.outputs[0], outn.inputs['Surface'])
bpy.ops.mesh.primitive_uv_sphere_add(radius=.3, location=(LX, LY, FZ + .03), segments=48, ring_count=24)
halo = bpy.context.object; halo.data.materials.append(hm); halo.scale = (1, .45, .4); halo.visible_shadow = False
for p in halo.data.polygons: p.use_smooth = True
bpy.data.objects.remove(halo)
# miolo quente: volume emissivo pequeno em volta do filamento (brilho amarelo-claro no centro, como a ref)
cm = bpy.data.materials.new('miolo'); cm.use_nodes = True; nt = cm.node_tree
for nd in list(nt.nodes):
    if nd.type != 'OUTPUT_MATERIAL': nt.nodes.remove(nd)
outn = [nd for nd in nt.nodes if nd.type == 'OUTPUT_MATERIAL'][0]
em = nt.nodes.new('ShaderNodeEmission'); em.inputs['Color'].default_value = cor('#ffd36a'); em.inputs['Strength'].default_value = float(os.environ.get('MIO', 1.6))
nt.links.new(em.outputs[0], outn.inputs['Volume'])
bpy.ops.mesh.primitive_uv_sphere_add(radius=.36, location=(LX, LY, FZ), segments=48, ring_count=24)
mio = bpy.context.object; mio.data.materials.append(cm); mio.scale = (1, .8, .75); mio.visible_shadow = False
# luz quente interna
bpy.ops.object.light_add(type='POINT', location=(LX, LY, FZ)); Lb = bpy.context.object; Lb.data.energy = float(os.environ.get('LBE', 8))
Lb.data.color = (1, .7, .32); Lb.data.shadow_soft_size = .25
lampada = objs_novos(a1)

# ---------------- fio ----------------
a2 = nomes()


def arredonda(cantos, r, n=12):
    """polilinha com cantos arredondados (raio r)"""
    P = [V(c) for c in cantos]; out = [P[0]]
    for i in range(1, len(P) - 1):
        a, b, c = P[i - 1], P[i], P[i + 1]
        d1 = (a - b).normalized(); d2 = (c - b).normalized()
        rr = min(r, (a - b).length * .45, (c - b).length * .45)
        p1 = b + d1 * rr; p2 = b + d2 * rr
        for k in range(n + 1):
            t = k / n
            out.append((1 - t) ** 2 * p1 + 2 * (1 - t) * t * b + t * t * p2)
    out.append(P[-1]); return [tuple(p) for p in out]


WR = .095
XM = 1.85; ZT = PH + TH + float(os.environ.get('ZTD', .4)); ZS = .25
# sobe de DENTRO da tampa, cruza, desce e entra no costado do soquete
cima = arredonda([(0, 0, PH + TH - .015), (0, 0, ZT), (XM, LY, ZT), (XM, LY, ZS), (LX - .8, LY, ZS)], .3)
tubo(cima, WR, vermelho, tipo='POLY', tampa=True)
# sai do outro lado do soquete, desce ao chao, vem para a frente e volta pelo chao ate entrar na base da pilha
YF = float(os.environ.get('YF', -.68))
baixo = arredonda([(LX + .8, LY, ZS), (LX + .95, LY, ZS), (LX + .95, LY, WR), (LX + .95, YF, WR), (-.05, YF, WR),
                   (-.05, -.6, WR)], .2)
tubo(baixo, WR, vermelho, tipo='POLY', tampa=True)
# pontas arredondadas (sem tampa chapada aparecendo quando o fio e mostrado sozinho)
# as pontas ficam escondidas dentro da tampa/soquete/pilha (no escuro); um leve brilho proprio evita o toco preto
# quando a camada do fio aparece sozinha (na composicao elas continuam escondidas)
ponta_m = principled('fio_ponta', '#dc1a1e', 0.3, coat=1.0, coat_rug=0.04, **{'Emission Color': cor('#a8101a'), 'Emission Strength': 0.9})
for pt in (cima[0], cima[-1], baixo[0], baixo[-1]):
    bpy.ops.mesh.primitive_uv_sphere_add(radius=WR, location=pt, segments=32, ring_count=16)
    e = bpy.context.object; e.data.materials.append(ponta_m)
    for p in e.data.polygons: p.use_smooth = True
fio = objs_novos(a2)

# =====================================================================================================
# F11_bake (03/11): piloto da rota "assar no Blender -> GLB -> three.js" (docs/pesquisa/tecnicas-3d-realista.md, seções 2.2/4/7).
# Mesma cena do F11.py (acima, sem mudanças) + a mesma luz de estúdio do render_camadas (KEY grande e macia, de frente e
# de cima; FILL fraca; mundo branco). Assa, por objeto, o COMBINED do Cycles visto da câmera do ícone (reflexos no lugar
# certo) em textura; a lâmpada, o soquete e o fio são assados duas vezes (apagada / acesa) para a animação misturar.
# O chão vira um plano com a sombra assada (alfa). Exporta um GLB com as texturas (WebP) e os trajetos da corrente.
# Uso: flock /tmp/render.lock python3 cenas/F11_bake.py   (BAKE_AMOSTRAS, BAKE_ESCALA para testes rápidos)
import json, numpy as np, camadas

SAIDA = os.environ.get('GLB_SAIDA', '/home/user/aprendice/app/src/ui/icones3d/modelos/circuito.glb')
TMP = os.environ.get('BAKE_TMP', os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'camadas', 'F11', 'bake'))
os.makedirs(TMP, exist_ok=True); os.makedirs(os.path.dirname(SAIDA), exist_ok=True)
AMOSTRAS = int(os.environ.get('BAKE_AMOSTRAS', 64))
ESC = float(os.environ.get('BAKE_ESCALA', 1.0))
TAM = {k: int(v * ESC) for k, v in {'pilha': 2048, 'fio': 1024, 'base': 1024, 'vidro': 1024}.items()}

# mesma luz do render_camadas (padrão do dono: de frente e bem de cima, sombra curta para trás)
K = bpy.data.objects['KEY']; K.location = (-0.6, -3.0, 8.0); K.data.size = 6; K.data.energy = 780
K.rotation_euler = (V((0, 0, 0)) - K.location).to_track_quat('-Z', 'Y').to_euler()
cam = camadas._camera(float(os.environ.get('ELEV', 10)), float(os.environ.get('AZIM', -2)), 50, float(os.environ.get('FOLGA', 1.06)))
bpy.context.view_layer.update()
# câmera para o three.js (Y para cima: (x, y, z)_blender -> (x, z, -y)_three)
fw = cam.matrix_world.to_3x3() @ V((0, 0, -1))
dist = (cam.location - V((LX / 2, 0, 1.2))).length
alvo = cam.location + fw * dist
y3 = lambda p: [round(p[0], 4), round(p[2], 4), round(-p[1], 4)]
CAM = {'pos': y3(cam.location), 'alvo': y3(alvo), 'fov': round(math.degrees(2 * math.atan(18 / 50)), 3)}
print('CAMERA_THREE', json.dumps(CAM))


def juntar(objs, nome):
    bpy.ops.object.select_all(action='DESELECT')
    for o in objs: o.select_set(True)
    bpy.context.view_layer.objects.active = objs[0]
    bpy.ops.object.convert(target='MESH')
    bpy.ops.object.join()
    o = bpy.context.view_layer.objects.active; o.name = nome
    return o


def uv(o, margem):
    sel(o)
    for l in list(o.data.uv_layers): o.data.uv_layers.remove(l)
    o.data.uv_layers.new(name='UVMap')
    bpy.ops.object.mode_set(mode='EDIT'); bpy.ops.mesh.select_all(action='SELECT')
    bpy.ops.uv.smart_project(angle_limit=math.radians(66), island_margin=margem)
    bpy.ops.object.mode_set(mode='OBJECT')


base_objs = [o for o in lampada if o.type == 'MESH' and o.name.split('.')[0] in ('soquete', 'friso', 'rosca', 'isol_rosca', 'aro')]
O = {'pilha': juntar(pilha, 'pilha'), 'fio': juntar(fio, 'fio'), 'base': juntar(base_objs, 'base'), 'vidro': gl}
# malha leve para a web: os decalques (+/-) e a rosca vêm muito subdivididos; o detalhe fica na textura assada
DEC = {'pilha': 0.1, 'base': 0.45, 'fio': 0.6, 'vidro': 0.7}
for n, o in O.items():
    md = o.modifiers.new('dec', 'DECIMATE'); md.ratio = DEC[n]; md.use_collapse_triangulate = True
    sel(o); bpy.ops.object.modifier_apply(modifier='dec')
    print('MALHA', n, len(o.data.vertices), len(o.data.polygons))
for n, o in O.items(): uv(o, 0.004 if TAM[n] >= 2048 else 0.006)

sc.render.bake.view_from = 'ACTIVE_CAMERA'      # brilho/reflexo calculados como a câmera do ícone vê
sc.render.bake.margin = 6; sc.render.bake.margin_type = 'EXTEND'
sc.render.bake.use_selected_to_active = False
sc.cycles.samples = AMOSTRAS
sc.cycles.use_denoising = False


def assar(o, nome, tam, tipo='COMBINED', passes=None):
    img = bpy.data.images.new(nome, tam, tam if nome != 'chao' else tam // 2, alpha=False, float_buffer=True)
    for m in o.data.materials:
        nt = m.node_tree; nd = nt.nodes.get('BAKE') or nt.nodes.new('ShaderNodeTexImage'); nd.name = 'BAKE'; nd.image = img
        nt.nodes.active = nd
    sel(o)
    import time; t = time.time()
    if passes: bpy.ops.object.bake(type=tipo, pass_filter=passes)
    else: bpy.ops.object.bake(type=tipo)
    print('ASSADO', nome, tam, '%.0fs' % (time.time() - t), flush=True)
    return img


def salvar(img, nome):
    """grava com a mesma gestão de cor do render (Standard + Medium High Contrast) -> PNG 8 bits sRGB"""
    caminho = os.path.join(TMP, nome + '.png')
    sc.render.image_settings.file_format = 'PNG'; sc.render.image_settings.color_mode = 'RGB'; sc.render.image_settings.color_depth = '8'
    img.save_render(caminho, scene=sc)
    if os.environ.get('BAKE_DENOISE', '1') == '1':   # o bake não passa pelo denoiser do Cycles: limpa o grão de leve
        import cv2
        im = cv2.imread(caminho); im = cv2.fastNlMeansDenoisingColored(im, None, 4, 4, 5, 15); cv2.imwrite(caminho, im)
    return caminho


# ---- estado ACESO (como F11.py): todos os objetos
arq = {}
for n in ('pilha', 'fio', 'base', 'vidro'):
    arq[n + '_acesa'] = salvar(assar(O[n], n + '_acesa', TAM[n]), n + '_acesa')

# ---- estado APAGADO: sem emissão, sem luz interna; vidro claro (transparente, levemente quente)
b = vb.node_tree.nodes['Principled BSDF']
b.inputs['Emission Strength'].default_value = 0.0; b.inputs['Base Color'].default_value = cor('#f4ecd6')
b.inputs['Transmission Weight'].default_value = 0.95
for m in (gm, cm): [nd for nd in m.node_tree.nodes if nd.type == 'EMISSION'][0].inputs['Strength'].default_value = 0.0
fb = fil.node_tree.nodes['Principled BSDF']; fb.inputs['Emission Strength'].default_value = 0.0; fb.inputs['Base Color'].default_value = cor('#5b4c3c')
fb.inputs['Metallic'].default_value = 0.8; fb.inputs['Roughness'].default_value = 0.35
haste_m.node_tree.nodes['Principled BSDF'].inputs['Emission Strength'].default_value = 0.0
Lb.data.energy = 0.0
for n in ('fio', 'base', 'vidro'):
    arq[n + '_apagada'] = salvar(assar(O[n], n + '_apagada', TAM[n]), n + '_apagada')

# ---- sombra no chão: plano branco fosco; luz com e sem os objetos -> razão = sombra (como o shadow catcher)
ch = bpy.data.objects['CHAO']; ch.hide_render = True
bpy.ops.mesh.primitive_plane_add(size=1, location=(1.55, 0.55, 0.0005)); pl = bpy.context.object; pl.name = 'sombra'
pl.scale = (6.4, 3.2, 1); bpy.ops.object.transform_apply(scale=True)
pm = principled('chao_branco', '#ffffff', 1.0); pm.node_tree.nodes['Principled BSDF'].inputs['Specular IOR Level'].default_value = 0.0
pl.data.materials.append(pm)
Lb.data.energy = 0.0
TS = int(1024 * ESC)
com = assar(pl, 'chao', TS, 'DIFFUSE', {'DIRECT', 'INDIRECT'})
A = np.array(com.pixels[:]).reshape(TS // 2, TS, 4)[..., :3].mean(-1)
escondidos = [o for o in sc.objects if o.type in ('MESH', 'FONT', 'CURVE') and o is not pl and not o.hide_render]
for o in escondidos: o.hide_render = True
sem = assar(pl, 'chao', TS, 'DIFFUSE', {'DIRECT', 'INDIRECT'})
B = np.array(sem.pixels[:]).reshape(TS // 2, TS, 4)[..., :3].mean(-1)
for o in escondidos: o.hide_render = False
razao = np.clip(A / np.maximum(B, 1e-6), 0, 1)
alfa = 1 - razao
# borda do plano some suavemente (sem degrau)
yy, xx = np.mgrid[0:TS // 2, 0:TS]
bx = np.minimum(xx, TS - 1 - xx) / (TS * 0.08); by = np.minimum(yy, TS // 2 - 1 - yy) / (TS * 0.08)
fade = np.clip(np.minimum(bx, by), 0, 1); fade = fade * fade * (3 - 2 * fade)
alfa = np.clip(alfa * fade, 0, 1)
rgba = np.zeros((TS // 2, TS, 4), np.float32); rgba[..., 3] = alfa
som = bpy.data.images.new('sombra_png', TS, TS // 2, alpha=True); som.pixels[:] = rgba.ravel()
som.filepath_raw = os.path.join(TMP, 'sombra.png'); som.file_format = 'PNG'; som.save()
arq['sombra'] = som.filepath_raw
print('SOMBRA alfa max %.2f' % alfa.max())

# ---- materiais de exportação: cor base = textura apagada (ou única), emissão = textura acesa
def mat_export(o, nome, cor_img, emis_img=None, alfa_img=False):
    m = bpy.data.materials.new('m_' + nome); m.use_nodes = True; nt = m.node_tree; bs = nt.nodes['Principled BSDF']
    t1 = nt.nodes.new('ShaderNodeTexImage'); t1.image = bpy.data.images.load(cor_img)
    nt.links.new(t1.outputs['Color'], bs.inputs['Base Color'])
    if alfa_img: nt.links.new(t1.outputs['Alpha'], bs.inputs['Alpha'])
    if emis_img:
        t2 = nt.nodes.new('ShaderNodeTexImage'); t2.image = bpy.data.images.load(emis_img)
        nt.links.new(t2.outputs['Color'], bs.inputs['Emission Color']); bs.inputs['Emission Strength'].default_value = 1.0
    bs.inputs['Roughness'].default_value = 1.0
    o.data.materials.clear(); o.data.materials.append(m)
    for p in o.data.polygons: p.material_index = 0


mat_export(O['pilha'], 'pilha', arq['pilha_acesa'])
for n in ('fio', 'base', 'vidro'): mat_export(O[n], n, arq[n + '_apagada'], arq[n + '_acesa'])
mat_export(pl, 'sombra', arq['sombra'], alfa_img=True)
# trajetos da corrente (sentido convencional: + -> fio de cima -> lâmpada -> fio de baixo -> -), em coordenadas three.js
O['fio']['ida'] = json.dumps([y3(p) for p in cima]); O['fio']['volta'] = json.dumps([y3(p) for p in baixo])
O['fio']['camera'] = json.dumps(CAM)

bpy.ops.object.select_all(action='DESELECT')
for o in list(O.values()) + [pl]: o.select_set(True)
bpy.ops.export_scene.gltf(filepath=SAIDA, export_format='GLB', use_selection=True, export_image_format='WEBP',
                          export_normals=False, export_tangents=False, export_extras=True, export_cameras=False,
                          export_lights=False, export_apply=True, export_materials='EXPORT')
print('GLB', SAIDA, os.path.getsize(SAIDA))

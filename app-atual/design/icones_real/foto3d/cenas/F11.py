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
preto = acabamento(principled('pilha_preto', '#0b0b0d', 0.22, coat=1.0, coat_rug=0.06), 0.22, rvar=0.08, resc=9, bump=0.012, besc=420)
# faixa dourada: metal escovado (riscos horizontais), verniz por cima
ouro = acabamento(principled('pilha_ouro', '#f0a818', 0.24, metal=0.75, coat=0.6, coat_rug=0.1, aniso=0.5),
                  0.24, rvar=0.1, resc=6, bump=0.03, besc=40, esticar=(1, 1, 90))
prata = acabamento(principled('tampa_prata', '#d4d7dc', 0.16, metal=1.0, aniso=0.7), 0.16, rvar=0.06, resc=10, bump=0.015, besc=300)
tinta_preta = acabamento(principled('tinta_preta', '#0c0c0c', 0.5), 0.5, rvar=0.06, resc=40, bump=0.0)
tinta_branca = acabamento(principled('tinta_branca', '#f2f2ee', 0.42, coat=0.3), 0.42, rvar=0.05, resc=40, bump=0.0)
anel_isol = principled('anel_isol', '#1d1d20', 0.45)
vermelho = acabamento(principled('fio_borracha', '#c3121a', 0.34, coat=0.7, coat_rug=0.14,
                                 **{'Subsurface Weight': 0.08, 'Subsurface Radius': (1, .2, .1), 'Subsurface Scale': 0.02}),
                      0.34, rvar=0.08, resc=14, bump=0.03, besc=180)
soq = acabamento(principled('soquete', '#55585e', 0.36, metal=0.9, coat=0.25, coat_rug=0.2, aniso=0.3), 0.36, rvar=0.08, resc=12, bump=0.02, besc=260)
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
torno([(.3, PH - .004), (.3, PH + .012), (.285, PH + .02), (.255, PH + .02), (.255, PH - .004)], anel_isol, fechado=False, nome='isol')
# tampa prateada com aneis usinados (pequenos degraus e sulcos)
TH = .2
torno([(0, PH), (.245, PH), (.245, PH + .02), (.25, PH + .03), (.25, PH + .07), (.243, PH + .078), (.25, PH + .086),
       (.25, PH + .13), (.243, PH + .138), (.25, PH + .146), (.25, PH + TH - .03), (.24, PH + TH - .008), (.22, PH + TH),
       (.16, PH + TH), (.15, PH + TH - .006), (.14, PH + TH), (.09, PH + TH), (.08, PH + TH - .006), (.07, PH + TH), (0, PH + TH)],
      prata, fechado=False, nome='pilha_tampa')
# "+" impresso na faixa dourada e "-" branco no corpo (decalques enrolados no cilindro)
tp = texto('+', (0, -PR, 1.79), 0.72, tinta_preta, extr=.0025, fonte=INTER)
decalque(tp, PR + .003)
bpy.ops.mesh.primitive_cube_add(size=1, location=(0, -PR, .62)); mb = bpy.context.object; mb.scale = (.3, .005, .07)
mb.data.materials.append(tinta_branca)
bv = mb.modifiers.new('bv', 'BEVEL'); bv.width = .02; bv.segments = 4; bv.affect = 'EDGES'
decalque(mb, PR)
pilha = objs_novos(a0)

# ---------------- lampada ----------------
a1 = nomes()
LX, LY = 3.25, 0.32
# soquete: disco largo e baixo, chanfros arredondados, gola mais estreita onde a rosca entra
torno([(0, 0), (.7, 0), (.74, .012), (.76, .04), (.765, .08), (.765, .3), (.755, .35), (.73, .38), (.69, .395), (.6, .40),
       (.56, .41), (.545, .43), (.54, .47), (.53, .5), (.5, .51), (.46, .51), (.44, .5), (0, .5)], soq, loc=(LX, LY, 0), fechado=False, nome='soquete')
# frisos no costado do soquete
for zf in (.14, .26):
    torno([(.766, zf - .012), (.758, zf), (.766, zf + .012)], soq, loc=(LX, LY, 0), fechado=False, nome='friso')


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


ZR0, ZR1 = .47, .98
rosca(.375, .045, ZR0, ZR1, .105, (LX, LY, 0), rosca_m)
# aro de cima da rosca (onde o vidro e colado)
torno([(.0, ZR1 - .01), (.39, ZR1 - .01), (.405, ZR1), (.4, ZR1 + .03), (.37, ZR1 + .04), (0, ZR1 + .04)], rosca_m, loc=(LX, LY, 0), fechado=False, nome='aro')

# vidro: casca fina (por fora e por dentro), formato de pera: pescoco -> globo
RG, ZG = .72, 1.76
ext = []
for i in range(0, 61):
    t = i / 60
    if t < .3:
        u = t / .3; r = .36 + .06 * u + .16 * u ** 3; z = ZR1 + .02 + .5 * u
    else:
        u = (t - .3) / .7
        ang = -math.radians(42) + u * math.radians(132)
        r = RG * math.cos(ang); z = ZG + RG * math.sin(ang)
    ext.append((max(r, 0.0), z))
ext[-1] = (0, ZG + RG)
# suaviza a emenda pescoco/globo
ESP = .022
inn = [(max(0.0, r - ESP), z - (ESP if r < .05 else 0)) for (r, z) in reversed(ext)]
vb = bpy.data.materials.new('vidro_lamp'); vb.use_nodes = True; b = vb.node_tree.nodes['Principled BSDF']
b.inputs['Base Color'].default_value = cor('#fff1d6'); b.inputs['Transmission Weight'].default_value = 1.0
b.inputs['Roughness'].default_value = 0.015; b.inputs['IOR'].default_value = 1.5
b.inputs['Emission Color'].default_value = cor('#ffb04a'); b.inputs['Emission Strength'].default_value = 0.12
gl = torno(ext + inn, vb, loc=(LX, LY, 0), fechado=True, nome='vidro', seg=96)

# brilho interno ambar: esfera emissiva que esmaece para as bordas (miolo quente, borda clara)
gm = bpy.data.materials.new('brilho'); gm.use_nodes = True; nt = gm.node_tree
for nd in list(nt.nodes):
    if nd.type != 'OUTPUT_MATERIAL': nt.nodes.remove(nd)
outn = [nd for nd in nt.nodes if nd.type == 'OUTPUT_MATERIAL'][0]
lw = nt.nodes.new('ShaderNodeLayerWeight'); lw.inputs['Blend'].default_value = 0.35
cr = nt.nodes.new('ShaderNodeValToRGB'); cr.color_ramp.elements[0].position = 0.0; cr.color_ramp.elements[0].color = (1, 1, 1, 1)
cr.color_ramp.elements[1].position = 0.85; cr.color_ramp.elements[1].color = (0, 0, 0, 1)
nt.links.new(lw.outputs['Facing'], cr.inputs['Fac'])
em = nt.nodes.new('ShaderNodeEmission'); em.inputs['Color'].default_value = cor('#ffa526'); em.inputs['Strength'].default_value = 2.2
tr = nt.nodes.new('ShaderNodeBsdfTransparent'); mx = nt.nodes.new('ShaderNodeMixShader')
nt.links.new(cr.outputs['Color'], mx.inputs[0]); nt.links.new(tr.outputs[0], mx.inputs[1]); nt.links.new(em.outputs[0], mx.inputs[2])
nt.links.new(mx.outputs[0], outn.inputs['Surface'])
bpy.ops.mesh.primitive_uv_sphere_add(radius=RG - .07, location=(LX, LY, ZG + .02), segments=64, ring_count=32)
brilho = bpy.context.object; brilho.data.materials.append(gm); brilho.scale = (1, 1, 1.02)
for p in brilho.data.polygons: p.use_smooth = True
brilho.visible_shadow = False

# haste de vidro (pe alargado) + dois fios de suporte + filamento em espiral
haste_m = principled('haste', '#f4efe2', 0.05, **{'Transmission Weight': 0.9, 'IOR': 1.5})
torno([(0, ZR1 + .02), (.2, ZR1 + .02), (.17, ZR1 + .06), (.1, ZR1 + .14), (.075, ZR1 + .24), (.07, 1.5), (.085, 1.53), (.06, 1.56), (0, 1.56)],
      haste_m, loc=(LX, LY, 0), fechado=False, nome='haste')
sup = principled('suporte', '#d9b97a', 0.25, metal=1.0, **{'Emission Color': cor('#ffb04a'), 'Emission Strength': 0.6})
FZ = 1.93; FW = .2
for s in (-1, 1):
    tubo([(LX + s * .03, LY, 1.3), (LX + s * .04, LY, 1.55), (LX + s * .14, LY, 1.78), (LX + s * FW, LY, FZ)], .0095, sup, tipo='NURBS')
# fio central de apoio (gancho)
tubo([(LX, LY, 1.55), (LX, LY, 1.82), (LX, LY - .015, FZ + .045)], .007, sup, tipo='NURBS')
fil = emissivo('#ffd9a0', 30)
esp = []
NV = 15; N = 15 * 24
for i in range(N + 1):
    t = i / N; x = -FW + 2 * FW * t; a = t * 2 * math.pi * NV
    zc = FZ + .05 * math.sin(math.pi * t)              # arco suave entre os suportes
    esp.append((LX + x, LY + .022 * math.sin(a), zc + .022 * math.cos(a)))
tubo(esp, .0065, fil, tipo='POLY', res=4)
# halo do filamento (calor)
hm = bpy.data.materials.new('halo'); hm.use_nodes = True; nt = hm.node_tree
for nd in list(nt.nodes):
    if nd.type != 'OUTPUT_MATERIAL': nt.nodes.remove(nd)
outn = [nd for nd in nt.nodes if nd.type == 'OUTPUT_MATERIAL'][0]
lw = nt.nodes.new('ShaderNodeLayerWeight'); lw.inputs['Blend'].default_value = 0.5
cr = nt.nodes.new('ShaderNodeValToRGB'); cr.color_ramp.elements[0].position = 0.0; cr.color_ramp.elements[0].color = (1, 1, 1, 1)
cr.color_ramp.elements[1].position = 0.7; cr.color_ramp.elements[1].color = (0, 0, 0, 1)
nt.links.new(lw.outputs['Facing'], cr.inputs['Fac'])
em = nt.nodes.new('ShaderNodeEmission'); em.inputs['Color'].default_value = cor('#ffcf7a'); em.inputs['Strength'].default_value = 3.0
tr = nt.nodes.new('ShaderNodeBsdfTransparent'); mx = nt.nodes.new('ShaderNodeMixShader')
nt.links.new(cr.outputs['Color'], mx.inputs[0]); nt.links.new(tr.outputs[0], mx.inputs[1]); nt.links.new(em.outputs[0], mx.inputs[2])
nt.links.new(mx.outputs[0], outn.inputs['Surface'])
bpy.ops.mesh.primitive_uv_sphere_add(radius=.3, location=(LX, LY, FZ + .03), segments=48, ring_count=24)
halo = bpy.context.object; halo.data.materials.append(hm); halo.scale = (1, .6, .55); halo.visible_shadow = False
for p in halo.data.polygons: p.use_smooth = True
# luz quente interna
bpy.ops.object.light_add(type='POINT', location=(LX, LY, FZ)); Lb = bpy.context.object; Lb.data.energy = 22
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


WR = .062
XM = 1.85; ZT = PH + TH + .55; ZS = .25
# sobe de DENTRO da tampa, cruza, desce e entra no costado do soquete
cima = arredonda([(0, 0, PH + TH - .06), (0, 0, ZT), (XM, LY, ZT), (XM, LY, ZS), (LX - .55, LY, ZS)], .3)
tubo(cima, WR, vermelho, tipo='POLY', tampa=True)
# sai do outro lado do soquete, desce ao chao, vem para a frente e volta pelo chao ate entrar na base da pilha
YF = -.88
baixo = arredonda([(LX + .55, LY, ZS), (LX + 1.02, LY, ZS), (LX + 1.02, LY, WR), (LX + 1.02, YF, WR), (-.05, YF, WR),
                   (-.05, -.15, WR)], .3)
tubo(baixo, WR, vermelho, tipo='POLY', tampa=True)
fio = objs_novos(a2)

parte('pilha', pilha); parte('fio', fio); parte('lampada', lampada)
render_camadas('F11', folga=float(os.environ.get('FOLGA', 1.08)), elev=float(os.environ.get('ELEV', 17)), azim=float(os.environ.get('AZIM', -5)))

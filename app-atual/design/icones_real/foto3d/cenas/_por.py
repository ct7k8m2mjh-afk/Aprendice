"""Ajudantes extras para as cenas de Portugues (P01..P12). Usa o kit.py da pasta foto3d."""
import sys, os, math
AQUI = os.path.dirname(os.path.abspath(__file__)); FOTO3D = os.path.dirname(AQUI)
sys.path.insert(0, FOTO3D)
from kit import *
import bpy, bmesh, mathutils
from mathutils import Vector

POP = '/usr/share/fonts/truetype/google-fonts/Poppins-Bold.ttf'
SERIF = '/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf'
SANS = '/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf'
MONO = '/usr/share/fonts/truetype/liberation/LiberationMono-Bold.ttf'
LORA = '/usr/share/fonts/truetype/google-fonts/Lora-Variable.ttf'

def saida(nome):
    return os.path.join(FOTO3D, 'render', nome + '.png')

def _obj(nome, me):
    o = bpy.data.objects.new(nome, me); bpy.context.scene.collection.objects.link(o)
    bpy.context.view_layer.objects.active = o
    for x in bpy.context.selected_objects: x.select_set(False)
    o.select_set(True); return o

def torno(perfil, m, loc=(0, 0, 0), seg=96, rot=(0, 0, 0), suave=True, fechar=True):
    """superficie de revolucao em torno de Z. perfil = [(r, z), ...] de baixo para cima."""
    me = bpy.data.meshes.new('torno'); bm = bmesh.new(); aneis = []
    for (r, z) in perfil:
        if r < 1e-5:
            aneis.append([bm.verts.new((0, 0, z))])
        else:
            aneis.append([bm.verts.new((r * math.cos(2 * math.pi * i / seg), r * math.sin(2 * math.pi * i / seg), z)) for i in range(seg)])
    for a, b in zip(aneis[:-1], aneis[1:]):
        if len(a) == 1 and len(b) == 1: continue
        if len(a) == 1:
            for i in range(seg): bm.faces.new((a[0], b[i], b[(i + 1) % seg]))
        elif len(b) == 1:
            for i in range(seg): bm.faces.new((a[i], a[(i + 1) % seg], b[0])) if False else bm.faces.new((a[(i + 1) % seg], a[i], b[0]))
        else:
            for i in range(seg): bm.faces.new((a[i], a[(i + 1) % seg], b[(i + 1) % seg], b[i]))
    bm.normal_update(); bm.to_mesh(me); bm.free()
    o = _obj('torno', me); o.location = loc; o.rotation_euler = rot
    if m is not None: o.data.materials.append(m)
    for p in o.data.polygons: p.use_smooth = suave
    bpy.ops.object.mode_set(mode='EDIT'); bpy.ops.mesh.select_all(action='SELECT'); bpy.ops.mesh.normals_make_consistent(inside=False); bpy.ops.object.mode_set(mode='OBJECT')
    return o

def placa(poli, esp, m, loc=(0, 0, 0), rot=(0, 0, 0), chanfro=0.0, seg_ch=4, suave=False):
    """poligono 2D (lista de (x,y)) extrudado em Z com espessura esp (base em z=0)."""
    me = bpy.data.meshes.new('placa'); bm = bmesh.new()
    vb = [bm.verts.new((x, y, 0)) for x, y in poli]; vt = [bm.verts.new((x, y, esp)) for x, y in poli]
    n = len(poli)
    bm.faces.new(list(reversed(vb))); bm.faces.new(vt)
    for i in range(n):
        j = (i + 1) % n; bm.faces.new((vb[i], vb[j], vt[j], vt[i]))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bm.to_mesh(me); bm.free()
    o = _obj('placa', me); o.location = loc; o.rotation_euler = rot
    if m is not None: o.data.materials.append(m)
    if chanfro:
        md = o.modifiers.new('ch', 'BEVEL'); md.width = chanfro; md.segments = seg_ch; md.limit_method = 'ANGLE'; md.angle_limit = math.radians(40)
        md.harden_normals = False
    for p in o.data.polygons: p.use_smooth = suave
    if chanfro:
        try:
            wn = o.modifiers.new('wn', 'WEIGHTED_NORMAL'); wn.keep_sharp = True
        except Exception: pass
    return o

def circulo(cx, cy, r, n=48, a0=0, a1=2 * math.pi):
    return [(cx + r * math.cos(a0 + (a1 - a0) * i / n), cy + r * math.sin(a0 + (a1 - a0) * i / n)) for i in range(n)]

def arred(w, h, r, n=10, cx=0, cy=0):
    """retangulo de cantos arredondados centrado"""
    pts = []
    for (qx, qy, a) in ((w / 2 - r, h / 2 - r, 0), (-w / 2 + r, h / 2 - r, 90), (-w / 2 + r, -h / 2 + r, 180), (w / 2 - r, -h / 2 + r, 270)):
        for i in range(n + 1):
            t = math.radians(a + 90 * i / n); pts.append((cx + qx + r * math.cos(t), cy + qy + r * math.sin(t)))
    return pts

def tubo(pontos, r, m, fechado=False, res=12, suave=True, ponta=True):
    """curva poligonal (pontos 3D) com espessura r (arames, alcas, clipes)."""
    cu = bpy.data.curves.new('tubo', 'CURVE'); cu.dimensions = '3D'; cu.bevel_depth = r; cu.bevel_resolution = res // 3
    cu.use_fill_caps = ponta
    sp = cu.splines.new('POLY'); sp.points.add(len(pontos) - 1)
    for p, c in zip(sp.points, pontos): p.co = (c[0], c[1], c[2], 1)
    sp.use_cyclic_u = fechado
    o = _obj('tubo', cu)
    if m is not None: o.data.materials.append(m)
    return o

def bez(pontos, r, m, fechado=False, res=16):
    """curva suave (bezier automatica) por pontos 3D"""
    cu = bpy.data.curves.new('bz', 'CURVE'); cu.dimensions = '3D'; cu.bevel_depth = r; cu.bevel_resolution = 4; cu.use_fill_caps = True
    cu.resolution_u = res
    sp = cu.splines.new('BEZIER'); sp.bezier_points.add(len(pontos) - 1)
    for p, c in zip(sp.bezier_points, pontos):
        p.co = c; p.handle_left_type = p.handle_right_type = 'AUTO'
    sp.use_cyclic_u = fechado
    o = _obj('bz', cu)
    if m is not None: o.data.materials.append(m)
    return o

def boolean(alvo, ferramenta, op='DIFFERENCE', apagar=True):
    md = alvo.modifiers.new('bo', 'BOOLEAN'); md.operation = op; md.object = ferramenta; md.solver = 'EXACT'
    bpy.context.view_layer.objects.active = alvo
    for x in bpy.context.selected_objects: x.select_set(False)
    alvo.select_set(True)
    bpy.ops.object.modifier_apply(modifier=md.name)
    if apagar: bpy.data.objects.remove(ferramenta, do_unlink=True)
    return alvo

def aplica_mods(o):
    bpy.context.view_layer.objects.active = o
    for x in bpy.context.selected_objects: x.select_set(False)
    o.select_set(True)
    for md in list(o.modifiers): bpy.ops.object.modifier_apply(modifier=md.name)
    return o

def grupo(objs, loc=(0, 0, 0), rot=(0, 0, 0), escala=1.0):
    """pai vazio para mover/girar varios objetos juntos"""
    e = bpy.data.objects.new('g', None); bpy.context.scene.collection.objects.link(e)
    for o in objs:
        o.parent = e
    e.location = loc; e.rotation_euler = rot; e.scale = (escala,) * 3
    return e

def txt(s, loc, tam, m, rot=(0, 0, 0), extr=0.01, fonte=POP, alinha='CENTER', bevel=None):
    o = texto(s, loc, tam, m, rot=rot, extr=extr, fonte=fonte, alinha=alinha)
    if bevel is not None: o.data.bevel_depth = bevel
    return o

def papel(hexa='#fbfaf6'):
    m, b = bpy.data.materials.new('papel'), None
    m.use_nodes = True; b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = cor(hexa); b.inputs['Roughness'].default_value = 0.85
    b.inputs['Subsurface Weight'].default_value = 0.05
    return m

def madeira(hexa='#a8703a', escuro='#7a4a22', escala=6.0, rugos=0.45):
    """madeira com veios (textura procedural)"""
    m = bpy.data.materials.new('madeira'); m.use_nodes = True; nt = m.node_tree; b = nt.nodes['Principled BSDF']
    tc = nt.nodes.new('ShaderNodeTexCoord'); mp = nt.nodes.new('ShaderNodeMapping'); mp.inputs['Scale'].default_value = (1, 1, 12)
    nz = nt.nodes.new('ShaderNodeTexNoise'); nz.inputs['Scale'].default_value = escala; nz.inputs['Detail'].default_value = 6
    wv = nt.nodes.new('ShaderNodeTexWave'); wv.inputs['Scale'].default_value = escala * 0.6; wv.inputs['Distortion'].default_value = 6
    wv.wave_type = 'RINGS'
    cr = nt.nodes.new('ShaderNodeValToRGB'); cr.color_ramp.elements[0].color = cor(escuro); cr.color_ramp.elements[1].color = cor(hexa)
    cr.color_ramp.elements[0].position = 0.25; cr.color_ramp.elements[1].position = 0.85
    nt.links.new(tc.outputs['Object'], mp.inputs['Vector']); nt.links.new(mp.outputs['Vector'], wv.inputs['Vector'])
    nt.links.new(wv.outputs['Fac'], cr.inputs['Fac']); nt.links.new(cr.outputs['Color'], b.inputs['Base Color'])
    b.inputs['Roughness'].default_value = rugos; b.inputs['Coat Weight'].default_value = 0.15
    return m

def ruido_cor(hexa1, hexa2, escala=8.0, rugos=0.6, detalhe=8, bump=0.0, metal=0.0):
    """material com mancha procedural entre duas cores (pedra, couro, terra)"""
    m = bpy.data.materials.new('rc'); m.use_nodes = True; nt = m.node_tree; b = nt.nodes['Principled BSDF']
    nz = nt.nodes.new('ShaderNodeTexNoise'); nz.inputs['Scale'].default_value = escala; nz.inputs['Detail'].default_value = detalhe
    tco = nt.nodes.new('ShaderNodeTexCoord'); nt.links.new(tco.outputs['Object'], nz.inputs['Vector'])
    cr = nt.nodes.new('ShaderNodeValToRGB'); cr.color_ramp.elements[0].color = cor(hexa1); cr.color_ramp.elements[1].color = cor(hexa2)
    cr.color_ramp.elements[0].position = 0.3; cr.color_ramp.elements[1].position = 0.7
    nt.links.new(nz.outputs['Fac'], cr.inputs['Fac']); nt.links.new(cr.outputs['Color'], b.inputs['Base Color'])
    b.inputs['Roughness'].default_value = rugos; b.inputs['Metallic'].default_value = metal
    if bump:
        bp = nt.nodes.new('ShaderNodeBump'); bp.inputs['Strength'].default_value = bump
        nz2 = nt.nodes.new('ShaderNodeTexNoise'); nz2.inputs['Scale'].default_value = escala * 6; nz2.inputs['Detail'].default_value = 10
        nt.links.new(tco.outputs['Object'], nz2.inputs['Vector'])
        nt.links.new(nz2.outputs['Fac'], bp.inputs['Height']); nt.links.new(bp.outputs['Normal'], b.inputs['Normal'])
    return m

def imagem_mat(caminho, rugos=0.5, emis=0.0):
    m = bpy.data.materials.new('img'); m.use_nodes = True; nt = m.node_tree; b = nt.nodes['Principled BSDF']
    ti = nt.nodes.new('ShaderNodeTexImage'); ti.image = bpy.data.images.load(caminho)
    nt.links.new(ti.outputs['Color'], b.inputs['Base Color']); b.inputs['Roughness'].default_value = rugos
    if emis:
        nt.links.new(ti.outputs['Color'], b.inputs['Emission Color']); b.inputs['Emission Strength'].default_value = emis
    return m

def folha_grade(w, h, nx, ny, f, m, loc=(0, 0, 0), rot=(0, 0, 0), esp=0.0, borda=None, borda_fundo=True):
    """folha (papel) como grade w x h, altura z = f(x, y) (x de -w/2..w/2, y de -h/2..h/2), com espessura opcional"""
    me = bpy.data.meshes.new('fg'); bm = bmesh.new(); vs = []
    for j in range(ny + 1):
        lin = []
        for i in range(nx + 1):
            x = -w / 2 + w * i / nx; y = -h / 2 + h * j / ny; lin.append(bm.verts.new((x, y, f(x, y))))
        vs.append(lin)
    for j in range(ny):
        for i in range(nx): bm.faces.new((vs[j][i], vs[j][i + 1], vs[j + 1][i + 1], vs[j + 1][i]))
    uv = bm.loops.layers.uv.new()
    for fa in bm.faces:
        for l in fa.loops: l[uv].uv = ((l.vert.co.x + w / 2) / w, (l.vert.co.y + h / 2) / h)
    bm.to_mesh(me); bm.free()
    o = _obj('folha', me); o.location = loc; o.rotation_euler = rot
    if m is not None: o.data.materials.append(m)
    for p in o.data.polygons: p.use_smooth = True
    if esp:
        s = o.modifiers.new('so', 'SOLIDIFY'); s.thickness = esp; s.offset = -1
        if borda is not None:
            o.data.materials.append(borda); s.material_offset_rim = 1; s.material_offset = 1 if borda_fundo else 0
    return o

def subdiv(o, n=2):
    md = o.modifiers.new('sd', 'SUBSURF'); md.levels = n; md.render_levels = n; return o

def cam_render(caminho, alvo=(0, 0, 0), elev=30, azim=-18, lente=50, folga=1.12, orto=None, tam=360, amostras=None):
    """igual ao render() do kit, mas permite camera ortografica (orto = escala)"""
    if orto is None:
        return render(caminho, tam=tam, elev=elev, azim=azim, lente=lente, folga=folga, amostras=amostras)
    sc = bpy.context.scene; sc.render.resolution_x = sc.render.resolution_y = tam
    if amostras: sc.cycles.samples = amostras
    cd = bpy.data.cameras.new('c'); cd.type = 'ORTHO'; cd.ortho_scale = orto
    cam = bpy.data.objects.new('cam', cd); sc.collection.objects.link(cam); sc.camera = cam
    e = math.radians(elev); a = math.radians(azim)
    d = Vector((math.sin(a) * math.cos(e), -math.cos(a) * math.cos(e), math.sin(e)))
    cam.location = Vector(alvo) + d * 30; cam.rotation_euler = (Vector(alvo) - cam.location).to_track_quat('-Z', 'Y').to_euler()
    cd.clip_end = 100
    sc.render.filepath = caminho; bpy.ops.render.render(write_still=True)

def tex_linhas(nome, w=1024, h=1400, margem=90, linhas=24, cor_txt=(105, 105, 112), fundo=(251, 250, 246), grifo=None, titulo=False, seed=1):
    """textura de pagina com 'texto' em linhas cinza (grifo = indice da linha marcada em amarelo)."""
    from PIL import Image, ImageDraw
    import random
    random.seed(seed)
    p = os.path.join(AQUI, 'tex', nome + '.png')
    im = Image.new('RGB', (w, h), fundo); d = ImageDraw.Draw(im)
    y = margem; passo = (h - 2 * margem) / linhas; alt = passo * 0.24
    for i in range(linhas):
        x = margem; fim = w - margem if (i % 5 != 4) else margem + (w - 2 * margem) * random.uniform(0.4, 0.7)
        if titulo and i == 0:
            d.rectangle([x, y, x + (w - 2 * margem) * 0.55, y + alt * 1.6], fill=(40, 40, 45)); y += passo; continue
        if grifo is not None and i in (grifo if isinstance(grifo, (list, tuple)) else [grifo]):
            d.rectangle([x - 12, y - alt * 1.1, fim + 12, y + alt * 2.1], fill=(255, 222, 30))
        while x < fim:
            pl = random.uniform(30, 110); pl = min(pl, fim - x)
            d.rectangle([x, y, x + pl, y + alt], fill=cor_txt); x += pl + random.uniform(14, 22)
        y += passo
    im.save(p); return p

def livro_fechado(loc, w, h, esp, m_capa, rot_z=0.0, m_paginas=None, borda_capa=0.025):
    """livro de capa dura deitado: capas + bloco de paginas recuado + lombada arredondada (lombada em -x)"""
    pg = m_paginas or ruido_cor('#ece4d2', '#faf6ec', escala=80, rugos=0.9)
    c = borda_capa; objs = []
    objs.append(caixa((0, 0, c / 2), (w, h, c), m_capa, chanfro=0.008))
    objs.append(caixa((0, 0, esp - c / 2), (w, h, c), m_capa, chanfro=0.008))
    objs.append(caixa((0.02, 0, esp / 2), (w - 0.06, h - 0.05, esp - 2 * c + 0.004), pg, chanfro=0.004))
    l = cilindro((-w / 2 + 0.01, 0, esp / 2), esp / 2, h, m_capa, rot=(math.radians(90), 0, 0)); l.scale.x = 0.45; objs.append(l)
    return grupo(objs, loc=loc, rot=(0, 0, rot_z))

def cena_p(exp=-0.45, key=1.0):
    """cena do kit com exposicao um pouco menor (cores mais densas, sem estourar o branco)"""
    sc = cena(); sc.view_settings.exposure = exp
    bpy.data.objects['KEY'].data.energy *= key
    return sc

def balao(w, h, r, tx, lado, tam_rabo=0.32):
    """poligono 2D de balao de fala (retangulo arredondado + rabicho na base). lado=+1 rabicho para a direita"""
    pts = arred(w, h, r, n=12); k = 3 * 13  # indice do inicio do canto (+,-)
    rabo = [(tx - 0.13, -h / 2), (tx + lado * 0.22, -h / 2 - tam_rabo), (tx + 0.10, -h / 2)] if lado > 0 else \
           [(tx - 0.10, -h / 2), (tx + lado * 0.22, -h / 2 - tam_rabo), (tx + 0.13, -h / 2)]
    return pts[:k] + rabo + pts[k:]

def tex_desenho(nome, w, h, fundo, desenha):
    """textura desenhada com PIL: desenha(draw, img)"""
    from PIL import Image, ImageDraw
    p = os.path.join(AQUI, 'tex', nome + '.png'); im = Image.new('RGBA', (w, h), fundo); d = ImageDraw.Draw(im); desenha(d, im); im.save(p); return p

def fonte_pil(tam, caminho=POP):
    from PIL import ImageFont
    return ImageFont.truetype(caminho, tam)

def no_chao(objs, folga=0.0):
    """desce/sobe os objetos (ou um pai) para que o ponto mais baixo encoste no chao (z=0)"""
    if not isinstance(objs, (list, tuple)): objs = [objs]
    bpy.context.view_layer.update(); dg = bpy.context.evaluated_depsgraph_get(); zs = []
    def todos(o):
        yield o
        for c in o.children_recursive: yield c
    for raiz in objs:
        for o in todos(raiz):
            if o.type in ('MESH', 'CURVE', 'FONT'):
                oe = o.evaluated_get(dg)
                if o.type == 'MESH':
                    me = oe.to_mesh(); zs += [(oe.matrix_world @ v.co).z for v in me.vertices]; oe.to_mesh_clear()
                else:
                    zs += [(oe.matrix_world @ Vector(c)).z for c in oe.bound_box]
    dz = -min(zs) + folga
    for raiz in objs: raiz.location.z += dz
    bpy.context.view_layer.update()
    return dz

def pena(comp, larg, cor_vane, cor_haste='#f2ece0', curva=0.12, nome='pena', listras=None):
    """pena de ave: vexilo assimetrico (folha fina com barbas desenhadas) + raque. Ponta em +y, calamo em y=0."""
    def desenha(d, im):
        W, H = im.size
        import random; random.seed(len(nome))
        for k in range(0, H, 7):
            c = tuple(max(0, v - random.randint(0, 30)) for v in d._image.getpixel((W // 2, min(H - 1, k)))[:3]) if False else None
            d.line([(W / 2, k), (0, k - H * 0.08)], fill=(0, 0, 0, 40), width=2)
            d.line([(W / 2, k), (W, k - H * 0.08)], fill=(0, 0, 0, 40), width=2)
        if listras:
            for (y0, y1, c) in listras: d.rectangle([0, H * (1 - y1), W, H * (1 - y0)], fill=c + (255,))
            for k in range(0, H, 7):
                d.line([(W / 2, k), (0, k - H * 0.08)], fill=(0, 0, 0, 40), width=2); d.line([(W / 2, k), (W, k - H * 0.08)], fill=(0, 0, 0, 40), width=2)
    from PIL import Image
    h = cor_vane.lstrip('#'); rgb = tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))
    p = tex_desenho('pena_' + nome, 256, 1024, rgb + (255,), desenha); Image.open(p).convert('RGB').save(p)
    m = imagem_mat(p, 0.7)
    m.node_tree.nodes['Principled BSDF'].inputs['Sheen Weight'].default_value = 0.5
    y0 = comp * 0.22
    def f(x, y): return -0.18 * abs(x) / larg * larg + curva * ((y + comp / 2) / comp) ** 2
    o = folha_grade(larg, comp - y0, 16, 40, f, m, esp=0.006)
    for v in o.data.vertices:
        u = (v.co.y + (comp - y0) / 2) / (comp - y0)
        w = max(0.0, math.sin(min(1.0, max(0.0, u) * 1.05) * math.pi)) ** 0.7 * (0.75 + 0.25 * u)
        if u > 0.82: w *= max(0.0, 1 - (u - 0.82) / 0.2) ** 0.8 + 0.0
        v.co.x *= w * (1.0 if v.co.x < 0 else 0.7)
        v.co.y += (comp - y0) / 2 + y0
    o.modifiers['so'].thickness = 0.006
    r = bez([(0, 0, 0), (0, comp * 0.3, curva * 0.1), (0, comp * 0.7, curva * 0.5), (0, comp * 0.98, curva)], larg * 0.025, plastico(cor_haste, 0.35))
    return [o, r]

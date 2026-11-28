"""Kit 3D dos icones do APRENDICE (estilo da referencia do Vitor, 30/10).
Luz principal vinda da FRENTE (lado da camera, um pouco acima), sombra suave caindo para TRAS do objeto,
visivel so como contato escuro e curto embaixo dele, fundo transparente
com 'shadow catcher' (a sombra de contato fica no PNG). Uso:
    import sys; sys.path.insert(0, '<pasta foto3d>'); from kit import *
    cena()
    esfera((0,0,.5), .5, plastico('#d62828'))
    render('saida.png')          # 384x384 RGBA, enquadrado automaticamente
Depois: python3 -I post.py render saida.png <ID>   (gera o SVG final + previa)
"""
import bpy, math, mathutils

def _lin(c):
    c = c / 255.0
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4
def cor(hexa):
    h = hexa.lstrip('#'); return tuple(_lin(int(h[i:i+2], 16)) for i in (0, 2, 4)) + (1.0,)

def cena():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    sc = bpy.context.scene
    sc.render.engine = 'CYCLES'; sc.cycles.device = 'CPU'; sc.cycles.samples = 64; sc.cycles.use_denoising = True
    sc.render.film_transparent = True
    sc.view_settings.view_transform = 'Standard'; sc.view_settings.look = 'Medium High Contrast'
    w = bpy.data.worlds.new('w'); sc.world = w; w.use_nodes = True
    bg = w.node_tree.nodes['Background']; bg.inputs[0].default_value = (1, 1, 1, 1); bg.inputs[1].default_value = 0.22
    bpy.ops.mesh.primitive_plane_add(size=60, location=(0, 0, 0)); p = bpy.context.object; p.name = 'CHAO'; p.is_shadow_catcher = True
    # luz principal: cima-esquerda-frente (como nas referencias); preenchimento fraco pela direita
    bpy.ops.object.light_add(type='AREA', location=(-1.2, -7, 5.5)); L = bpy.context.object; L.name = 'KEY'  # 30/10 (pedido do Vitor): luz batendo de FRENTE, sombra cai para tras do objeto
    L.data.energy = 850; L.data.size = 5
    L.rotation_euler = (mathutils.Vector((0, 0, 0)) - L.location).to_track_quat('-Z', 'Y').to_euler()
    bpy.ops.object.light_add(type='AREA', location=(3, 2, 6)); F = bpy.context.object; F.name = 'FILL'
    F.data.energy = 250; F.data.size = 6; F.data.use_shadow = False
    F.rotation_euler = (mathutils.Vector((0, 0, 0)) - F.location).to_track_quat('-Z', 'Y').to_euler()
    return sc

def _bsdf(nome):
    m = bpy.data.materials.new(nome); m.use_nodes = True; return m, m.node_tree.nodes['Principled BSDF']
def plastico(hexa, rugos=0.32):
    m, b = _bsdf('pl'); b.inputs['Base Color'].default_value = cor(hexa); b.inputs['Roughness'].default_value = rugos
    b.inputs['Coat Weight'].default_value = 0.25; return m
def fosco(hexa, rugos=0.75):
    m, b = _bsdf('fo'); b.inputs['Base Color'].default_value = cor(hexa); b.inputs['Roughness'].default_value = rugos; return m
def metal(hexa='#c9a227', rugos=0.25):
    m, b = _bsdf('me'); b.inputs['Base Color'].default_value = cor(hexa); b.inputs['Metallic'].default_value = 1.0
    b.inputs['Roughness'].default_value = rugos; return m
def vidro(hexa='#eef6ff', rugos=0.02):
    m, b = _bsdf('vi'); b.inputs['Base Color'].default_value = cor(hexa); b.inputs['Transmission Weight'].default_value = 1.0
    b.inputs['Roughness'].default_value = rugos; b.inputs['IOR'].default_value = 1.45; return m
def liquido(hexa):
    m, b = _bsdf('li'); b.inputs['Base Color'].default_value = cor(hexa); b.inputs['Transmission Weight'].default_value = 0.85
    b.inputs['Roughness'].default_value = 0.05; return m
def emissivo(hexa, forca=6):
    m, b = _bsdf('em'); b.inputs['Emission Color'].default_value = cor(hexa); b.inputs['Emission Strength'].default_value = forca; return m

def _aplica(o, m, suave=True, chanfro=0.0):
    if m is not None: o.data.materials.append(m)
    if suave and hasattr(o.data, 'polygons'):
        for p in o.data.polygons: p.use_smooth = True
    if chanfro:
        md = o.modifiers.new('ch', 'BEVEL'); md.width = chanfro; md.segments = 4; md.limit_method = 'ANGLE'
    return o
def esfera(loc, r, m, seg=64):
    bpy.ops.mesh.primitive_uv_sphere_add(radius=r, location=loc, segments=seg, ring_count=seg // 2); return _aplica(bpy.context.object, m)
def caixa(loc, dims, m, chanfro=0.04, rot=(0, 0, 0)):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc, rotation=rot); o = bpy.context.object; o.scale = dims
    bpy.ops.object.transform_apply(scale=True); return _aplica(o, m, suave=False, chanfro=chanfro)
def cilindro(loc, r, h, m, rot=(0, 0, 0), chanfro=0.02, vert=64):
    bpy.ops.mesh.primitive_cylinder_add(radius=r, depth=h, location=loc, rotation=rot, vertices=vert)
    o = bpy.context.object; _aplica(o, m, suave=False, chanfro=chanfro)
    md = o.modifiers.new('ws', 'WEIGHTED_NORMAL') if False else None
    return o
def cone(loc, r1, r2, h, m, rot=(0, 0, 0)):
    bpy.ops.mesh.primitive_cone_add(radius1=r1, radius2=r2, depth=h, location=loc, rotation=rot, vertices=64); return _aplica(bpy.context.object, m, suave=False, chanfro=0.015)
def toro(loc, R, r, m, rot=(0, 0, 0)):
    bpy.ops.mesh.primitive_torus_add(major_radius=R, minor_radius=r, location=loc, rotation=rot, major_segments=96, minor_segments=32); return _aplica(bpy.context.object, m)
def bastao(p1, p2, r, m):
    """cilindro entre dois pontos (ligacoes de moleculas, hastes)"""
    a = mathutils.Vector(p1); b = mathutils.Vector(p2); d = b - a
    bpy.ops.mesh.primitive_cylinder_add(radius=r, depth=d.length, location=(a + b) / 2, vertices=32)
    o = bpy.context.object; o.rotation_euler = d.to_track_quat('Z', 'Y').to_euler(); return _aplica(o, m)
def texto(txt, loc, tam, m, rot=(math.radians(90), 0, 0), extr=0.04, fonte=None, alinha='CENTER'):
    bpy.ops.object.text_add(location=loc, rotation=rot); o = bpy.context.object; o.data.body = txt; o.data.size = tam
    o.data.extrude = extr; o.data.bevel_depth = extr * 0.25; o.data.align_x = alinha; o.data.align_y = 'CENTER'
    if fonte: o.data.font = bpy.data.fonts.load(fonte)
    if m is not None: o.data.materials.append(m)
    return o

def render(caminho, tam=360, elev=30, azim=-18, lente=50, folga=1.12, amostras=None):
    """Enquadra todos os objetos (menos chao/luzes) e renderiza. elev = graus acima do horizonte (referencias: ~25-35)."""
    import os as _os
    if _os.environ.get('ICONE_TAM'):   # 03/11: re-render em alta resolução para o app (sem mudar as cenas)
        tam = int(_os.environ['ICONE_TAM'])
    if _os.environ.get('ICONE_SAIDA'):
        caminho = _os.path.join(_os.environ['ICONE_SAIDA'], _os.path.basename(caminho))
    sc = bpy.context.scene; sc.render.resolution_x = sc.render.resolution_y = tam
    if amostras: sc.cycles.samples = amostras
    sc.cycles.samples = max(sc.cycles.samples, int(_os.environ.get('ICONE_AMOSTRAS', 0)))
    pts = []
    dg = bpy.context.evaluated_depsgraph_get()
    for o in sc.objects:
        if o.type in ('MESH', 'FONT', 'CURVE') and o.name != 'CHAO':
            oe = o.evaluated_get(dg)
            if o.type == 'CURVE':   # 31/10: bound_box de curva com pai escalado vem inflado -> usa a malha avaliada (enquadramento certo)
                try:
                    me = oe.to_mesh(); pts += [oe.matrix_world @ v.co for v in me.vertices]; oe.to_mesh_clear(); continue
                except Exception: pass
            pts += [oe.matrix_world @ mathutils.Vector(c) for c in oe.bound_box]
    lo = mathutils.Vector((min(p.x for p in pts), min(p.y for p in pts), min(p.z for p in pts)))
    hi = mathutils.Vector((max(p.x for p in pts), max(p.y for p in pts), max(p.z for p in pts)))
    centro = (lo + hi) / 2; raio = (hi - lo).length / 2
    cam_d = bpy.data.cameras.new('c'); cam_d.lens = lente; cam = bpy.data.objects.new('cam', cam_d); sc.collection.objects.link(cam); sc.camera = cam
    e = math.radians(elev); a = math.radians(azim)
    dirv = mathutils.Vector((math.sin(a) * math.cos(e), -math.cos(a) * math.cos(e), math.sin(e)))
    fov = 2 * math.atan(18 / lente)
    dist = raio * folga / math.sin(fov / 2)
    cam.location = centro + dirv * dist
    cam.rotation_euler = (centro - cam.location).to_track_quat('-Z', 'Y').to_euler()
    sc.render.filepath = caminho
    bpy.ops.render.render(write_still=True)

"""Ajudantes do lote de Matematica (conteudos M..). Usa kit.py.
Cada cenas/<ID>.py faz:  from _mat import *; cena(); ...; fim('<ID>')"""
import sys, os, math
AQUI = os.path.dirname(os.path.abspath(__file__)); RAIZ = os.path.dirname(AQUI)
sys.path.insert(0, RAIZ)
from kit import *
import bpy, mathutils
from PIL import Image, ImageDraw, ImageFont

TEX = os.path.join(AQUI, '_tex'); os.makedirs(TEX, exist_ok=True)
FB = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
FR = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
FS = '/usr/share/fonts/truetype/dejavu/DejaVuSerif-BoldItalic.ttf'
FM = '/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf'
R = math.radians

AZUL, VERM, VERDE, AMAR, ROXO, LARANJA, DOURADO = '#1f5fd6', '#d62828', '#2e9e44', '#f2b705', '#7b2cbf', '#f07c1e', '#d4a52a'

def fonte(p, t): return ImageFont.truetype(p, t)

def img_mat(path, rugos=0.45, coat=0.15, metal=0.0, alpha=False, emis=0.0):
    m = bpy.data.materials.new('img'); m.use_nodes = True; nt = m.node_tree; b = nt.nodes['Principled BSDF']
    t = nt.nodes.new('ShaderNodeTexImage'); t.image = bpy.data.images.load(path); t.interpolation = 'Cubic'
    nt.links.new(t.outputs['Color'], b.inputs['Base Color'])
    if alpha: nt.links.new(t.outputs['Alpha'], b.inputs['Alpha'])
    if emis:
        nt.links.new(t.outputs['Color'], b.inputs['Emission Color']); b.inputs['Emission Strength'].default_value = emis
    b.inputs['Roughness'].default_value = rugos; b.inputs['Coat Weight'].default_value = coat; b.inputs['Metallic'].default_value = metal
    return m

def madeira(hexa='#c8945a', escala=18, rugos=0.5):
    """madeira procedural (veios ao longo de X)"""
    m = bpy.data.materials.new('mad'); m.use_nodes = True; nt = m.node_tree; b = nt.nodes['Principled BSDF']
    tc = nt.nodes.new('ShaderNodeTexCoord'); mp = nt.nodes.new('ShaderNodeMapping'); mp.inputs['Scale'].default_value = (1.2, escala, escala)
    nz = nt.nodes.new('ShaderNodeTexNoise'); nz.inputs['Scale'].default_value = 2.5; nz.inputs['Detail'].default_value = 6
    wv = nt.nodes.new('ShaderNodeTexWave'); wv.wave_type = 'BANDS'; wv.bands_direction = 'Y'; wv.inputs['Scale'].default_value = 1.2
    wv.inputs['Distortion'].default_value = 6; wv.inputs['Detail'].default_value = 3
    nt.links.new(tc.outputs['Object'], mp.inputs['Vector']); nt.links.new(mp.outputs['Vector'], wv.inputs['Vector'])
    cr = nt.nodes.new('ShaderNodeValToRGB'); c = cor(hexa)
    cr.color_ramp.elements[0].color = tuple(v * 0.72 for v in c[:3]) + (1,); cr.color_ramp.elements[1].color = c
    nt.links.new(wv.outputs['Fac'], cr.inputs['Fac']); nt.links.new(cr.outputs['Color'], b.inputs['Base Color'])
    b.inputs['Roughness'].default_value = rugos; b.inputs['Coat Weight'].default_value = 0.2
    return m

def plano_img(loc, w, h, mat, rot=(0, 0, 0)):
    """retangulo w x h (X x Y) com UV 0..1 e a imagem; normal +Z antes da rotacao"""
    bpy.ops.mesh.primitive_plane_add(size=1, location=loc); o = bpy.context.object
    o.scale = (w, h, 1); bpy.ops.object.transform_apply(location=False, rotation=False, scale=True); o.rotation_euler = rot; o.data.materials.append(mat); return o

def cartao(loc, w, h, esp, mat_corpo, mat_img, rot=(0, 0, 0), chanfro=0.01):
    """caixa fina com a imagem na face de cima (+Z local)"""
    caixa(loc, (w, h, esp), mat_corpo, chanfro=chanfro, rot=rot)
    p = plano_img((0, 0, 0), w - 2 * chanfro, h - 2 * chanfro, mat_img)
    p.location = mathutils.Vector(loc) + mathutils.Euler(rot).to_matrix() @ mathutils.Vector((0, 0, esp / 2 + 0.0015)); p.rotation_euler = rot
    return p

def tex(nome, w, h, fundo=(255, 255, 255, 255)):
    im = Image.new('RGBA', (w, h), fundo); return im, ImageDraw.Draw(im)
def salva(im, nome):
    p = os.path.join(TEX, nome + '.png'); im.save(p); return p

def grupo(objs, loc=(0, 0, 0), rot=(0, 0, 0)):
    """junta objetos sob um empty para mover/girar em bloco"""
    e = bpy.data.objects.new('g', None); bpy.context.scene.collection.objects.link(e)
    for o in objs: o.parent = e
    e.location = loc; e.rotation_euler = rot; return e

def curva_tubo(pts, r, m, fechado=False, res=12):
    cd = bpy.data.curves.new('c', 'CURVE'); cd.dimensions = '3D'; cd.bevel_depth = r; cd.bevel_resolution = 6; cd.use_fill_caps = True
    sp = cd.splines.new('POLY'); sp.points.add(len(pts) - 1)
    for i, p in enumerate(pts): sp.points[i].co = (p[0], p[1], p[2], 1)
    sp.use_cyclic_u = fechado
    o = bpy.data.objects.new('cv', cd); bpy.context.scene.collection.objects.link(o); o.data.materials.append(m)
    for x in bpy.context.selected_objects: x.select_set(False)
    o.select_set(True); bpy.context.view_layer.objects.active = o; bpy.ops.object.convert(target='MESH')
    o = bpy.context.view_layer.objects.active
    for p in o.data.polygons: p.use_smooth = True
    return o

def prisma(pts2d, z0, h, m, chanfro=0.01, loc=(0, 0, 0), rot=(0, 0, 0)):
    """prisma reto de base poligonal (pontos 2D no plano XY), de z0 a z0+h"""
    me = bpy.data.meshes.new('pr'); n = len(pts2d)
    vs = [(x, y, z0) for x, y in pts2d] + [(x, y, z0 + h) for x, y in pts2d]
    fs = [list(range(n))[::-1], list(range(n, 2 * n))] + [[i, (i + 1) % n, n + (i + 1) % n, n + i] for i in range(n)]
    me.from_pydata(vs, [], fs); me.update()
    o = bpy.data.objects.new('pr', me); bpy.context.scene.collection.objects.link(o); o.location = loc; o.rotation_euler = rot
    o.data.materials.append(m)
    if chanfro:
        md = o.modifiers.new('ch', 'BEVEL'); md.width = chanfro; md.segments = 3; md.limit_method = 'ANGLE'
    return o

def suave(o, nivel=2):
    md = o.modifiers.new('sub', 'SUBSURF'); md.levels = nivel; md.render_levels = nivel
    for p in o.data.polygons: p.use_smooth = True
    return o

def fim(ID, **kw):
    if os.environ.get('SECO'): print('SECO OK', ID); return
    kw.setdefault('amostras', 48)
    render(os.path.join(RAIZ, 'render', ID + '.png'), **kw)

def copo(loc, r, h, m, esp=0.015, fundo=True, vert=96, r_topo=None):
    """recipiente aberto em cima (vidro de verdade: parede com espessura). r_topo != r faz tronco de cone."""
    import bmesh
    bpy.ops.mesh.primitive_cone_add(radius1=r, radius2=r_topo if r_topo else r, depth=h, vertices=vert,
                                    location=(loc[0], loc[1], loc[2] + h / 2), end_fill_type='NGON')
    o = bpy.context.object; bm = bmesh.new(); bm.from_mesh(o.data)
    top = max(bm.faces, key=lambda f: f.calc_center_median().z)
    bmesh.ops.delete(bm, geom=[top], context='FACES')
    if not fundo:
        bot = min(bm.faces, key=lambda f: f.calc_center_median().z); bmesh.ops.delete(bm, geom=[bot], context='FACES')
    bm.to_mesh(o.data); bm.free()
    s = o.modifiers.new('s', 'SOLIDIFY'); s.thickness = esp; s.offset = -1
    b = o.modifiers.new('b', 'BEVEL'); b.width = esp * 0.45; b.segments = 3; b.limit_method = 'ANGLE'
    o.data.materials.append(m)
    for p in o.data.polygons: p.use_smooth = True
    return o

def decal(txt, loc, alt, cor_txt=(255, 255, 255, 255), fonte_p=FB, rot=(0, 0, 0), rugos=0.4, nome=None):
    """texto impresso (PIL, aceita qualquer glifo) num plano com transparencia; alt = altura da letra"""
    f = ImageFont.truetype(fonte_p, 200); bb = f.getbbox(txt)
    w, h = bb[2] - bb[0] + 20, bb[3] - bb[1] + 20
    im = Image.new('RGBA', (w, h), (0, 0, 0, 0)); ImageDraw.Draw(im).text((10 - bb[0], 10 - bb[1]), txt, font=f, fill=cor_txt)
    nome = nome or ('d%d' % abs(hash((txt, cor_txt, fonte_p))))
    m = img_mat(salva(im, nome), rugos=rugos, alpha=True)
    H = alt * h / (bb[3] - bb[1]); W = H * w / h
    return plano_img(loc, W, H, m, rot)

def setor(c, r, a0, a1, z0, h, m, n=32, chanfro=0.006):
    """fatia de disco (angulos em graus) com vertice em c=(x,y)"""
    pts = [c] + [(c[0] + r * math.cos(math.radians(a0 + (a1 - a0) * k / n)), c[1] + r * math.sin(math.radians(a0 + (a1 - a0) * k / n))) for k in range(n + 1)]
    return prisma(pts, z0, h, m, chanfro=chanfro)

def papel_quad(nome, N=900, passo=100, eixos=None, fundo=(252, 252, 248, 255)):
    """papel quadriculado; eixos=(i0, j0) desenha eixos x/y nessa linha/coluna"""
    im, d = tex(nome, N, N, fundo)
    for k in range(0, N + 1, passo // 5): d.line((k, 0, k, N), fill=(214, 228, 240, 255), width=1); d.line((0, k, N, k), fill=(214, 228, 240, 255), width=1)
    for k in range(0, N + 1, passo): d.line((k, 0, k, N), fill=(150, 185, 220, 255), width=3); d.line((0, k, N, k), fill=(150, 185, 220, 255), width=3)
    if eixos:
        x0, y0 = eixos[0] * passo, N - eixos[1] * passo
        d.line((x0, 0, x0, N), fill=(40, 40, 40, 255), width=6); d.line((0, y0, N, y0), fill=(40, 40, 40, 255), width=6)
    return im, d

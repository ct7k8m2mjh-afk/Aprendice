"""Extras do lote Biologia (sobre kit.py): metaballs, tubos por curva, deslocamento, booleano, saida padrao."""
import bpy, math, mathutils, os, sys
from kit import *
AQ = '/home/claude/escadas-sc/design/icones_real/foto3d'
V = mathutils.Vector

def sel(o):
    bpy.ops.object.select_all(action='DESELECT'); o.select_set(True); bpy.context.view_layer.objects.active = o

def blob(elems, m, res=0.04, thr=0.6, suave=True):
    """elems: lista de (tipo, loc, raio[, escala(x,y,z)]) tipo em BALL/ELLIPSOID/CAPSULE. Converte para malha."""
    mb = bpy.data.metaballs.new('mb'); mb.resolution = res; mb.render_resolution = res; mb.threshold = thr
    o = bpy.data.objects.new('mb', mb); bpy.context.scene.collection.objects.link(o)
    for e in elems:
        t, loc, r = e[0], e[1], e[2]
        el = mb.elements.new(); el.type = t; el.co = loc; el.radius = r
        if len(e) > 3 and e[3] is not None:
            el.size_x, el.size_y, el.size_z = e[3]
        if len(e) > 4 and e[4] is not None:
            el.rotation = mathutils.Euler(e[4]).to_quaternion()
        if len(e) > 5: el.stiffness = e[5]
    sel(o); bpy.ops.object.convert(target='MESH'); o = bpy.context.object
    if m is not None: o.data.materials.append(m)
    for p in o.data.polygons: p.use_smooth = suave
    return o

def tubo(pts, r, m, raios=None, res=12, fecha=False, tampa=True, tipo='NURBS'):
    """tubo suave passando pelos pontos (curva NURBS/POLY com bevel). raios: multiplicador por ponto."""
    cu = bpy.data.curves.new('tb', 'CURVE'); cu.dimensions = '3D'; cu.bevel_depth = r; cu.bevel_resolution = res
    cu.use_fill_caps = tampa; cu.resolution_u = 24
    sp = cu.splines.new(tipo); sp.points.add(len(pts) - 1)
    for i, p in enumerate(pts):
        sp.points[i].co = (p[0], p[1], p[2], 1)
        if raios: sp.points[i].radius = raios[i]
    if tipo == 'NURBS': sp.use_endpoint_u = not fecha; sp.order_u = min(4, len(pts))
    sp.use_cyclic_u = fecha
    o = bpy.data.objects.new('tb', cu); bpy.context.scene.collection.objects.link(o)
    if m is not None: cu.materials.append(m)
    return o

def malha(o):
    sel(o); bpy.ops.object.convert(target='MESH'); o = bpy.context.object
    for p in o.data.polygons: p.use_smooth = True
    return o

def subdiv(o, n=2):
    md = o.modifiers.new('sd', 'SUBSURF'); md.levels = n; md.render_levels = n; return o

def desloca(o, forca=0.05, escala=0.5, tipo='CLOUDS', sub=0, aplica=False):
    if sub: subdiv(o, sub)
    tx = bpy.data.textures.new('tx', tipo)
    if tipo in ('CLOUDS', 'MUSGRAVE', 'VORONOI', 'STUCCI'):
        try: tx.noise_scale = escala
        except Exception: pass
    md = o.modifiers.new('dp', 'DISPLACE'); md.texture = tx; md.strength = forca; md.texture_coords = 'GLOBAL'
    if aplica:
        sel(o); [bpy.ops.object.modifier_apply(modifier=x.name) for x in list(o.modifiers)]
    return o

def dif(a, b, apaga=True, op='DIFFERENCE'):
    md = a.modifiers.new('bo', 'BOOLEAN'); md.object = b; md.operation = op; md.solver = 'EXACT'
    sel(a); bpy.ops.object.modifier_apply(modifier=md.name)
    if apaga: bpy.data.objects.remove(b, do_unlink=True)
    return a

def aplica_mods(o):
    sel(o)
    for x in list(o.modifiers): bpy.ops.object.modifier_apply(modifier=x.name)
    return o

def escala(o, s):
    o.scale = s; sel(o); bpy.ops.object.transform_apply(scale=True); return o

def gira(o, rot):
    o.rotation_euler = rot; return o

def pele(hexa, sss=0.15, rugos=0.4, raio=(1, .3, .2)):
    """material organico (tecido) com subsurface leve"""
    m, b = bpy.data.materials.new('pele'), None
    m.use_nodes = True; b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = cor(hexa); b.inputs['Roughness'].default_value = rugos
    b.inputs['Subsurface Weight'].default_value = sss; b.inputs['Subsurface Radius'].default_value = raio
    b.inputs['Coat Weight'].default_value = 0.3; b.inputs['Coat Roughness'].default_value = 0.15
    return m

def translucido(hexa, alfa=0.45, rugos=0.15):
    m = bpy.data.materials.new('tr'); m.use_nodes = True; b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = cor(hexa); b.inputs['Roughness'].default_value = rugos
    b.inputs['Transmission Weight'].default_value = 1 - alfa; b.inputs['Coat Weight'].default_value = 0.4
    b.inputs['Alpha'].default_value = 1.0
    return m

def seta_curva(R, a0, a1, r, m, z=0, ponta=2.4, n=40):
    """arco de circulo (plano XY) de a0 a a1 (graus) com ponta de seta no fim"""
    pts = [(R * math.cos(math.radians(a0 + (a1 - a0) * i / n)), R * math.sin(math.radians(a0 + (a1 - a0) * i / n)), z) for i in range(n + 1)]
    t = tubo(pts, r, m, tipo='POLY')
    a = math.radians(a1); d = V((-math.sin(a), math.cos(a), 0)) * (1 if a1 > a0 else -1)
    p = V(pts[-1])
    bpy.ops.mesh.primitive_cone_add(radius1=r * ponta, radius2=0, depth=r * ponta * 2.2, location=p + d * r * ponta * 1.0, vertices=48)
    c = bpy.context.object; c.rotation_euler = d.to_track_quat('Z', 'Y').to_euler(); c.data.materials.append(m)
    return t, c

def sai(ID, **kw):
    render(os.path.join(AQ, 'render', ID + '.png'), **kw)

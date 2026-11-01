import sys, os, math, random; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _qui import *
from mathutils import Euler
# Cubo de 22,4 L com particulas de gas: volume molar de um gas ideal nas CNTP (0 C, 1 atm)
cena_q()
A = 2.0
mv = vidro('#f0f7ff')
me = bpy.data.meshes.new('c'); bm = bmesh.new(); bmesh.ops.create_cube(bm, size=A); bm.to_mesh(me); bm.free()
c = bpy.data.objects.new('c', me); bpy.context.scene.collection.objects.link(c); c.location = (0, 0, A / 2 + 0.35); me.materials.append(mv)
md = c.modifiers.new('s', 'SOLIDIFY'); md.thickness = 0.04; b = c.modifiers.new('b', 'BEVEL'); b.width = 0.05; b.segments = 3
# base azul
caixa((0, 0, 0.17), (A + 0.3, A + 0.3, 0.34), plastico('#1f5fd6', 0.3), chanfro=0.05)
a = math.radians(0)
texto('22,4 L', (0, -(A + 0.3) / 2 - 0.006, 0.17), 0.3, fosco('#ffffff', 0.4), extr=0.006, fonte=INTER)
random.seed(8)
cores = ['#d62828', '#f2b705', '#2e9e44', '#7b2cbf']
for k in range(22):
    p = (random.uniform(-0.75, 0.75), random.uniform(-0.75, 0.75), 0.35 + random.uniform(0.25, 1.75))
    esfera(p, 0.11, plastico('#d62828', 0.2), seg=32)
render(out('Q06.2'), elev=28, azim=-28)

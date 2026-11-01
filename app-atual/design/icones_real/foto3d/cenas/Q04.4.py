import sys, os, math, random; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _qui import *
from mathutils import Euler
# Filtracao a vacuo: funil de Buchner de porcelana com papel de filtro e o solido retido, na rolha do kitassato, com mangueira de vacuo -> rendimento e pureza
cena_q()
# kitassato (erlenmeyer de parede grossa com saida lateral)
ext = [(0, 0), (0.95, 0), (1.02, 0.06), (1.05, 0.15), (0.32, 1.75), (0.3, 2.3)]
torno(parede(ext, 0.05), vidro())
faixa(ext, 0.05, 0.05, 0.5, liquido('#cfe8f7'))
# saida lateral
bastao((0.2, 0, 2.05), (0.75, 0, 1.85), 0.07, vidro())
# mangueira
pts = [Vector((0.75, 0, 1.85)), Vector((1.15, -0.1, 1.7)), Vector((1.45, -0.3, 1.2)), Vector((1.6, -0.5, 0.6)), Vector((1.85, -0.8, 0.25))]
cu = bpy.data.curves.new('m', 'CURVE'); cu.dimensions = '3D'; sp = cu.splines.new('BEZIER'); sp.bezier_points.add(len(pts) - 1)
for bp, p in zip(sp.bezier_points, pts): bp.co = p; bp.handle_left_type = bp.handle_right_type = 'AUTO'
cu.bevel_depth = 0.09; cu.bevel_resolution = 6; o = bpy.data.objects.new('m', cu); bpy.context.scene.collection.objects.link(o)
cu.materials.append(plastico('#c4502a', 0.45)); cu.use_fill_caps = True
# rolha de borracha
cone((0, 0, 2.38), 0.33, 0.4, 0.3, fosco('#2b2b2b', 0.6))
# funil de Buchner (porcelana)
mp = plastico('#e4e0d8', 0.28)
cilindro((0, 0, 2.55), 0.09, 0.6, mp)
torno([(0.1, 2.7), (0.75, 2.95), (0.8, 3.0), (0.8, 3.75), (0.86, 3.8), (0.86, 3.86), (0.74, 3.86), (0.74, 3.15), (0.1, 3.0)], mp)
# papel de filtro e o solido (bolo branco-amarelado)
cilindro((0, 0, 3.17), 0.73, 0.02, fosco('#ffffff', 0.8))
s = cilindro((0, 0, 3.27), 0.7, 0.18, fosco('#f2d65a', 0.85), chanfro=0.06)
render(out('Q04.4'), elev=40)

import sys, os, math, random; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _qui import *
from mathutils import Euler
# Eteno (H2C=CH2, o alceno mais simples, plano, com a dupla C=C) sobre um tomate: o hidrocarboneto que amadurece os frutos
cena_q()
# tomate
t = esfera((0.4, 0.3, 1.3), 1.5, plastico('#d8261c', 0.22), seg=96); t.scale = (1.08, 1.08, 0.86)
d = t.modifiers.new('d', 'DISPLACE')
tex = bpy.data.textures.new('w', 'WOOD'); tex.wood_type = 'RINGS'; tex.noise_scale = 0.4; d.texture = tex; d.strength = 0.02
mv = plastico('#2e8a3a', 0.4)
for k in range(5):
    a = k * 2 * math.pi / 5 + 0.3
    o = esfera((0.4 + 0.38 * math.cos(a), 0.3 + 0.38 * math.sin(a), 2.56), 0.42, mv, seg=24); o.scale = (1.0, 0.32, 0.12); o.rotation_euler = (0, math.radians(-12), a)
cilindro((0.4, 0.3, 2.72), 0.08, 0.3, mv)
# eteno flutuando a frente-esquerda
at, lig = coords_rdkit('C=C')
at = orienta_pca(at, (-10, 0, -20))
molecula(at, lig, loc=(-2.5, -1.2, 0), z_min=2.9, r_lig=0.08, raio_k=1.05)
render(out('Q11.2'), elev=24)

import sys, os, math, random; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _qui import *
from mathutils import Euler
# Teste de condutividade: lampada acesa fraca com eletrolito fraco (acido acetico) -> poucos ions, baixo grau de ionizacao
cena_q()
objs, ext = bequer(R=0.85, H=1.5, nivel=1.05, cor='#e9f3f8', loc=(0, 0, 0))
# eletrodos de grafite
mgr = fosco('#3a3a3a', 0.55)
for x in (-0.3, 0.3):
    cilindro((x, 0.05, 1.2), 0.07, 1.9, mgr)
# suporte (regua de plastico) sobre o bequer
caixa((0, 0.05, 2.05), (1.6, 0.35, 0.12), plastico('#2b2f36', 0.35), chanfro=0.03)
# lampada: bocal + bulbo com filamento laranja (brilho fraco)
cilindro((0, 0.05, 2.25), 0.18, 0.28, metal('#c9ced6', 0.25))
bul = torno([(0, 2.38), (0.16, 2.4), (0.18, 2.55), (0.38, 2.85), (0.42, 3.05), (0.36, 3.3), (0.2, 3.43), (0, 3.46)], vidro('#fff6e0'), loc=(0, 0.05, 0), fechado=False)
toro((0, 0.05, 2.95), 0.09, 0.012, emissivo('#ff9a2e', 9), rot=(math.radians(90), 0, 0))
bastao((-0.08, 0.05, 2.45), (-0.08, 0.05, 2.9), 0.01, metal('#888888')); bastao((0.08, 0.05, 2.45), (0.08, 0.05, 2.9), 0.01, metal('#888888'))
pl = bpy.data.lights.new('b', 'POINT'); pl.energy = 6; pl.color = (1, 0.7, 0.35); pl.shadow_soft_size = 0.2
lo = bpy.data.objects.new('b', pl); lo.location = (0, 0.05, 2.95); bpy.context.scene.collection.objects.link(lo)
render(out('Q08.5'), elev=22)

import sys, os, math, random; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _qui import *
from mathutils import Euler
# Tubo em U com membrana semipermeavel: a agua passa para o lado da solucao (com particulas de soluto), cujo nivel sobe -> osmose
cena_q()
XL, XR = -0.75, 0.75; Zb = 0.55; Rt = 0.3
def U(z1, z2, xa, xb):
    return [Vector((xa, 0, z1)), Vector((xa, 0, Zb + 0.75)), Vector((xa + 0.15 * (1 if xb > xa else -1), 0, Zb + 0.1)), Vector(((xa + xb) / 2, 0, Zb - 0.0))]
# vidro: tubo em U oco
g = curva([Vector((XL, 0, 3.2)), Vector((XL, 0, 1.2)), Vector((XL + 0.1, 0, 0.75)), Vector((0, 0, Zb)), Vector((XR - 0.1, 0, 0.75)), Vector((XR, 0, 1.2)), Vector((XR, 0, 3.2))], Rt, vidro(), caps=False, res=8)
s = g.modifiers.new('s', 'SOLIDIFY'); s.thickness = 0.03
# liquido: esquerda agua pura (nivel baixo), direita solucao (nivel alto)
curva([Vector((XL, 0, 1.9)), Vector((XL, 0, 1.2)), Vector((XL + 0.1, 0, 0.75)), Vector((0, 0, Zb))], Rt - 0.04, liquido('#bfe3f7'), res=8)
curva([Vector((0, 0, Zb)), Vector((XR - 0.1, 0, 0.75)), Vector((XR, 0, 1.2)), Vector((XR, 0, 2.6))], Rt - 0.04, liquido('#f6c7d2'), res=8)
# membrana
cilindro((0, 0, Zb), Rt + 0.02, 0.05, fosco('#f2b705', 0.6), rot=(0, math.radians(90), 0))
# particulas de soluto do lado direito
random.seed(5)
for k in range(9):
    z = random.uniform(1.0, 2.4); esfera((XR + random.uniform(-0.15, 0.15), random.uniform(-0.15, 0.15), z), 0.07, plastico('#d62828', 0.2), seg=20)
# suporte
caixa((0, 0.0, 0.1), (2.4, 0.9, 0.2), plastico('#2b2f36', 0.35), chanfro=0.04)
for x in (XL, XR): caixa((x, 0.0, 0.35), (0.3, 0.5, 0.3), plastico('#2b2f36', 0.35), chanfro=0.04)
render(out('Q10.2'), elev=20)

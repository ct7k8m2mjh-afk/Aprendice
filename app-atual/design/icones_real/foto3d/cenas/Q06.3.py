import sys, os, math, random; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _qui import *
import _mat
from mathutils import Euler
# Difusao de NH3 x HCl (lei de Graham). Revisao 31/10: tubo grosso deitado sobre uma placa preta (o anel branco de NH4Cl
# aparece contra o fundo escuro), rolhas coloridas nas pontas e os nomes impressos em branco na placa.
# O anel forma-se a 59,5 % do comprimento a partir do NH3 (gas mais leve, M=17, difunde mais rapido que o HCl, M=36,5):
# v_NH3/v_HCl = raiz(36,5/17) = 1,465 -> d_NH3 = 1,465/(1+1,465) = 0,594 do tubo.
cena_q()
L = 2.9; R = 0.42; zc = 0.18 + 0.12 + R
ang = math.radians(42)
objs = []
objs.append(torno([(R, 0), (R, L), (R - 0.035, L), (R - 0.035, 0)], vidro('#e8f4ff', ior=1.08)))  # IOR baixo: sem o reflexo comprido que escondia o anel
mal = fosco('#fafafa', 0.95)
for z, c in ((0.05, '#1f5fd6'), (L - 0.05, '#2e9e44')):
    st = cilindro((0, 0, z), R + 0.01, 0.3, plastico(c, 0.35), chanfro=0.04); objs.append(st)
    zz = 0.32 if z < 1 else L - 0.32
    o = cilindro((0, 0, zz), R - 0.05, 0.22, mal, chanfro=0.07); objs.append(o)
zr = L * 0.594
anel = cilindro((0, 0, zr), R - 0.04, 0.2, fosco('#ffffff', 0.6), chanfro=0.06); objs.append(anel)
g = grupo(objs, loc=(-L / 2 * math.cos(ang), -L / 2 * math.sin(ang), zc), rot=(0, 90, math.degrees(ang)))
# placa preta (bancada) e calcos
caixa((0, 0.1, 0.09), (L + 0.9, 2.0, 0.18), plastico('#23262c', 0.45), chanfro=0.05, rot=(0, 0, ang))
for f in (0.2, 0.8):
    q = Vector((-L / 2 * math.cos(ang), -L / 2 * math.sin(ang), 0)) + Vector((math.cos(ang), math.sin(ang), 0)) * (L * f)
    caixa((q.x, q.y, 0.18 + 0.12), (0.22, 0.75, 0.24), plastico('#5a6170', 0.35), chanfro=0.04, rot=(0, 0, ang))
# nomes impressos na placa, na frente de cada ponta
def rotulo(t, x, cor):
    p = Vector((x * math.cos(ang), x * math.sin(ang), 0)) + Vector((math.sin(ang), -math.cos(ang), 0)) * 0.72
    _mat.decal(t, (p.x, p.y, 0.183), 0.34, cor_txt=cor, rot=(0, 0, ang), nome='q063_' + t)
rotulo('NH₃', -L / 2 + 0.55, (120, 170, 255, 255))
rotulo('HCl', L / 2 - 0.55, (120, 230, 140, 255))
render(out('Q06.3'), elev=50, azim=-4, tam=560)

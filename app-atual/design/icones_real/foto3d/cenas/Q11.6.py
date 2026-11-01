import sys, os, math, random; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _qui import *
from mathutils import Euler
# Enantiomeros do CHFClBr diante de um espelho: carbono quiral (4 ligantes diferentes: H, F, Cl, Br), imagens especulares nao sobreponiveis -> isomeria optica
cena_q()
CPK['Br'] = '#6e1414'
at, lig = coords_rdkit('FC(Cl)Br', seed=1, hs=True)
c = at[1][1]
at = [(s, p - c) for s, p in at]
# revisao 31/10: Br para cima e H para tras -> cada molecula fica alta e estreita (grupo compacto)
br = [p for s, p in at if s == 'Br'][0]
q = br.normalized().rotation_difference(Vector((0, 0, 1)))
at = [(s, q @ p) for s, p in at]
hh = [p for s, p in at if s == 'H'][0]
ang = math.atan2(hh.y, hh.x)
Rz = Euler((0, 0, math.pi / 2 - ang + math.radians(-25))).to_matrix()
at = [(s, Rz @ p) for s, p in at]
at = [(s, Vector((-p.x, p.y, p.z))) for s, p in at]  # Cl para fora do espelho
d = 1.95
molecula([(s, Vector((p.x - d, p.y, p.z))) for s, p in at], lig, r_lig=0.09, z_min=0.35)
molecula([(s, Vector((-p.x + d, p.y, p.z))) for s, p in at], lig, r_lig=0.09, z_min=0.35)
# espelho de pe maior (moldura azul) para ler como espelho mesmo visto de vies
W, Hh = 2.0, 3.3
caixa((0, 0, 0.25 + Hh / 2), (0.05, W, Hh), metal('#e6eef7', 0.04), chanfro=0.015)
mf = plastico('#1f5fd6', 0.3)
for z in (0.25, 0.25 + Hh): caixa((0, 0, z), (0.14, W + 0.14, 0.14), mf, chanfro=0.035)
for y in (-W / 2, W / 2): caixa((0, y, 0.25 + Hh / 2), (0.14, 0.14, Hh + 0.14), mf, chanfro=0.035)
caixa((0, 0, 0.06), (0.9, W * 0.7, 0.12), mf, chanfro=0.04)
render(out("Q11.6"), elev=22, azim=-42, tam=560)  # revisao 31/10: espelho grande visto de vies, grupo compacto

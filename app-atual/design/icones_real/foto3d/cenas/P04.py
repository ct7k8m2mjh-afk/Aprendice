# P04 Coesao e coerencia: corrente de tres elos de aco entrelacados (os elos que ligam as partes do texto)
from _por import *
cena_p()
a, b, r = 0.24, 0.19, 0.068
def elo(m):
    pts = []
    for i in range(24): t = math.pi / 2 - math.pi * i / 23; pts.append((a + b * math.cos(t), b * math.sin(t), 0))
    for i in range(24): t = -math.pi / 2 - math.pi * i / 23; pts.append((-a + b * math.cos(t), b * math.sin(t), 0))
    return tubo(pts, r, m, fechado=True, res=16)
aco = metal('#c7cbd1', 0.18)
cB = b + r
B = elo(aco); B.location = (0, 0, cB); B.rotation_euler = (math.radians(90), 0, 0)
phi = math.asin((cB - r) / (2 * (a + b)))
for s in (1, -1):
    E = Vector((s * (a + 0.2 * b), 0, cB)); d = Vector((s * math.cos(phi), 0, -math.sin(phi)))
    A = elo(aco); A.location = E + d * (a + b); A.rotation_euler = (0, s * phi, 0)
render(saida('P04'), elev=34, azim=-24)

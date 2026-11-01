from _mat import *
cena()
# urna de vidro com bolinhas coloridas e uma bolinha ja sorteada do lado de fora: sorteios e outros casos
import random; random.seed(11)
vid = vidro()
copo((0, 0, 0.1), 0.62, 1.2, vid, esp=0.025)
toro((0, 0, 1.3), 0.62, 0.035, vid)
cilindro((0, 0, 0.05), 0.68, 0.1, madeira('#8a5a30', escala=10), chanfro=0.03)
cs = [VERM, AZUL, VERDE, AMAR]
r = 0.13; pts = []
z = 0.1 + 0.025 + r
tent = 0
while len(pts) < 30 and tent < 20000:
    tent += 1
    a = random.uniform(0, 6.283); rr = random.uniform(0, 0.62 - 0.025 - r - 0.01)
    p = (rr * math.cos(a), rr * math.sin(a), z)
    if all((p[0] - q[0]) ** 2 + (p[1] - q[1]) ** 2 + (p[2] - q[2]) ** 2 > (2 * r) ** 2 for q in pts): pts.append(p)
    else: z = min(z + 0.002, 1.05)
for k, p in enumerate(pts): esfera(p, r, plastico(cs[k % 4], 0.18))
esfera((0.85, -0.5, r * 1.3), r * 1.3, plastico(VERM, 0.18))
fim('M13.9', elev=24, azim=-14)

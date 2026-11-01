from _mat import *
cena()
# balde de metal em tronco de cone com agua: troncos e volume
zn = metal('#c4c9cf', 0.3)
copo((0, 0, 0), 0.5, 1.0, zn, esp=0.025, r_topo=0.72)
toro((0, 0, 1.0), 0.72, 0.03, zn); toro((0, 0, 0.02), 0.5, 0.03, zn)
for z, rr in ((0.33, 0.5 + 0.22 * 0.33), (0.66, 0.5 + 0.22 * 0.66)):
    toro((0, 0, z), rr + 0.005, 0.014, zn)
cilindro((0, 0, 0.82), 0.5 + 0.22 * 0.82 - 0.03, 0.02, liquido('#4aa3e0'), chanfro=0)
copo((0, 0, 0.03), 0.47, 0.79, liquido('#4aa3e0'), esp=0.004, r_topo=0.5 + 0.22 * 0.82 - 0.028) if False else None
pts = []
for k in range(41):
    t = math.pi * k / 40; pts.append((0.74 * math.cos(t), 0.0, 1.0 + 0.55 * math.sin(t) * 0.9))
curva_tubo(pts, 0.018, metal('#9fa4ab', 0.3))
cilindro((0, 0, 1.0 + 0.495), 0.05, 0.4, madeira('#b77a3e', escala=30), rot=(0, R(90), 0), chanfro=0.02)
for s in (-1, 1): esfera((s * 0.74, 0, 1.0), 0.05, zn)
fim('M11.5', elev=30, azim=-14)

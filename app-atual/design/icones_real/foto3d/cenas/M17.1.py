from _mat import *
cena()
# fileira de dominos caindo um sobre o outro: se A entao B, se B entao C... (deducao em cadeia)
br = plastico('#1b1b1e', 0.22); pr = plastico('#f7f6f0', 0.3)
w, h, e = 0.34, 0.68, 0.11; passo = 0.36
angs = [62, 50, 36, 20, 0, 0, 0]
for k, a in enumerate(angs):
    x = -1.1 + k * passo
    objs = [caixa((0, 0, h / 2), (e, w, h), br, chanfro=0.025), caixa((-e / 2 - 0.001, 0, h / 2), (0.004, w * 0.8, 0.02), pr, chanfro=0)]
    n1, n2 = [(1, 3), (2, 5), (4, 1), (6, 2), (3, 3), (5, 4), (2, 6)][k]
    pip = {1: [(0, 0)], 2: [(-1, -1), (1, 1)], 3: [(-1, -1), (0, 0), (1, 1)], 4: [(-1, -1), (1, -1), (-1, 1), (1, 1)],
           5: [(-1, -1), (1, -1), (0, 0), (-1, 1), (1, 1)], 6: [(-1, -1), (-1, 0), (-1, 1), (1, -1), (1, 0), (1, 1)]}
    for n, zc in ((n1, h * 0.75), (n2, h * 0.25)):
        for (py, pz) in pip[n]:
            objs.append(cilindro((-e / 2 - 0.002, py * 0.09, zc + pz * 0.09), 0.026, 0.01, pr, rot=(0, R(90), 0), chanfro=0.003))
    grupo(objs, loc=(x + e / 2, 0, 0), rot=(0, R(a), 0))
fim('M17.1', elev=18, azim=-38)

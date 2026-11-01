# P09.2 subordinadas substantivas: bonecas russas (matrioscas) - uma dentro da outra, a oracao ocupando a funcao de um termo
from _por import *
cena_p()
pele = fosco('#f6d9bf', 0.6); pr = plastico('#1c1c22', 0.3)
def boneca(s, cor_, x, y, rz):
    perf = [(0, 0), (0.42, 0), (0.46, 0.06), (0.47, 0.3), (0.42, 0.55), (0.32, 0.72), (0.3, 0.8), (0.33, 0.95), (0.33, 1.1), (0.26, 1.25), (0.12, 1.33), (0, 1.35)]
    ob = [torno(perf, plastico(cor_, 0.25))]
    ob.append(torno([(0, 0.0), (0.43, 0.0), (0.47, 0.03), (0.0, 0.03)], plastico('#f2b705', 0.3), loc=(0, 0, 0.0)))
    f = esfera((0, -0.24, 1.0), 0.2, pele); f.scale = (1, 0.5, 1.05); ob.append(f)
    for sx in (-1, 1):
        ob.append(esfera((sx * 0.07, -0.335, 1.04), 0.022, pr))
        bo = esfera((sx * 0.11, -0.32, 0.95), 0.035, fosco('#ef7b8a', 0.6)); bo.scale = (1, 0.4, 1); ob.append(bo)
    ob.append(esfera((0, -0.34, 0.92), 0.02, plastico('#c0283a', 0.3)))
    av = esfera((0, -0.3, 0.38), 0.28, plastico('#fbf5e6', 0.3)); av.scale = (1, 0.42, 1.3); ob.append(av)
    for k, (dx, dz, c) in enumerate(((0, 0.42, '#d62828'), (-0.1, 0.3, '#2e9e44'), (0.1, 0.3, '#2e9e44'))):
        fl = esfera((dx, -0.415, dz), 0.06 if k == 0 else 0.04, plastico(c, 0.3)); fl.scale = (1, 0.4, 1); ob.append(fl)
    return grupo(ob, loc=(x, y, 0), rot=(0, 0, math.radians(rz)), escala=s)
boneca(1.0, '#d62828', -0.15, 0.4, -10)
boneca(0.72, '#1f5fd6', 0.62, 0.0, -18)
boneca(0.5, '#2e9e44', 1.18, -0.35, -24)
render(saida('P09.2'), elev=16, azim=-12)

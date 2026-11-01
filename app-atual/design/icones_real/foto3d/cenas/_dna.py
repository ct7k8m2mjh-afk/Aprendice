from _bk import *
BASES = ['#d62828', '#2e9e44', '#f2b705', '#1f5fd6']  # cores de pares (A-T, G-C...) apenas ilustrativas
def duplex(p0, p1, m1, m2, voltas=1.5, R=.32, rr=.06, passo_degraus=10, up=(0, 0, 1), fase=0, seed=0):
    """dupla-helice ao longo de p0->p1. m1/m2: materiais das fitas."""
    import random as rd; rd.seed(seed)
    p0 = V(p0); p1 = V(p1); ax = (p1 - p0); L = ax.length; ax.normalize()
    u = V(up); u = (u - ax * u.dot(ax)).normalized(); w = ax.cross(u)
    n = 60; s1 = []; s2 = []
    for i in range(n + 1):
        t = i / n; a = fase + t * voltas * 6.283
        c = p0 + ax * (t * L)
        s1.append(tuple(c + (u * math.cos(a) + w * math.sin(a)) * R))
        s2.append(tuple(c + (u * math.cos(a + 2.4) + w * math.sin(a + 2.4)) * R))
    tubo(s1, rr, m1, tipo='POLY'); tubo(s2, rr, m2, tipo='POLY')
    k = int(voltas * passo_degraus)
    for j in range(1, k):
        i = round(j / k * n); a = V(s1[i]); b = V(s2[i]); mid = (a + b) / 2
        c1, c2 = rd.choice([(0, 1), (1, 0), (2, 3), (3, 2)])
        bastao(tuple(a), tuple(mid), rr * .55, plastico(BASES[c1], .3)); bastao(tuple(mid), tuple(b), rr * .55, plastico(BASES[c2], .3))
    return s1, s2

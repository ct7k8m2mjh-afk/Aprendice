# -*- coding: utf-8 -*-
"""Matematica: objetos fisicos modelados em 3D (mesma camera e mesma luz em todos)."""
from util import *
AZ, EL = -28, 30          # camera padrao do conjunto de Matematica

# ---------------------------------------------------------------- M11 Geometria espacial: solidos
def M11():
    c = Cena(AZ, EL)
    cilindro_liso(c.add(Obj()), (-1.25, .95, 0), (0, 0, 1.55), .58, cor="#4f9a6a")
    caixa(c.add(Obj()), -1.55, -.35, -1.0, .2, 0, 1.2, '#3f72b8')
    cilindro_liso(c.add(Obj()), (.95, .75, 0), (0, 0, 1.9), .72, 0, cor="#e3a33b")
    o = c.add(Obj()); o.esfera((.85, -.75, .62), .62, '#cf4d4d')
    return c.render()

# ---------------------------------------------------------------- M13 Combinatoria e probabilidade: dois dados
PIPS = {1: [(0, 0)], 2: [(-.5, -.5), (.5, .5)], 3: [(-.5, -.5), (0, 0), (.5, .5)], 4: [(-.5, -.5), (.5, -.5), (-.5, .5), (.5, .5)],
        5: [(-.5, -.5), (.5, -.5), (0, 0), (-.5, .5), (.5, .5)], 6: [(-.5, -.5), (.5, -.5), (-.5, 0), (.5, 0), (-.5, .5), (.5, .5)]}
def dado(c, cx, cy, yaw, faces, cor='#f7f4ec', pip='#1e1f26', L=1.0, z=0):
    M = transf(yaw, (cx, cy, z)); h = L / 2; b = .1 * L
    o = c.add(Obj())
    P = []
    for x in (-h, h):
        for y in (-h, h):
            for zz in (0, L):
                sx, sy, sz = (1 if x < 0 else -1), (1 if y < 0 else -1), (1 if zz == 0 else -1)
                P += [M(x + sx * b, y + sy * b, zz), M(x + sx * b, y, zz + sz * b), M(x, y + sy * b, zz + sz * b)]
    solido_convexo(o, P, cor, amb=.42, brilho=.25)
    # faces: (normal local, centro local, eixo u, eixo v, numero)
    defs = [((0, 0, 1), (0, 0, L), (1, 0, 0), (0, 1, 0), faces[0]), ((0, -1, 0), (0, -h, h), (1, 0, 0), (0, 0, 1), faces[1]),
            ((1, 0, 0), (h, 0, h), (0, 1, 0), (0, 0, 1), faces[2]), ((-1, 0, 0), (-h, 0, h), (0, -1, 0), (0, 0, 1), faces[3]),
            ((0, 1, 0), (0, h, h), (-1, 0, 0), (0, 0, 1), faces[4])]
    R = rot_z(yaw)
    def fn(cam):
        out = []
        for n, ce, u, v, k in defs:
            nw = R(*n)
            if not visivel(cam, nw): continue
            for a, bb in PIPS[k]:
                s = .62 * h
                cc = np.array(M(*ce)) + np.array(R(*u)) * a * s + np.array(R(*v)) * bb * s + np.array(nw) * .002
                r = .105 * L if k != 1 else .17 * L
                pts = circ3(cc, R(*u), R(*v), r, 20)
                pts2 = circ3(cc + np.array(R(*u)) * r * .12 - np.array(R(*v)) * r * .12, R(*u), R(*v), r * .78, 20)
                cor_p = '#c8303a' if k == 1 else pip
                out.append((cam.D(*cc) - 5, poli(cam, pts, cor_p) + poli(cam, pts2, mix(cor_p, '#000000', .35))))
        return out
    o.raw(fn, [])
    return o

def M13():
    c = Cena(AZ, EL)
    dado(c, -.75, .35, math.radians(18), (6, 3, 2, 5, 4))
    dado(c, .62, -.55, math.radians(-24), (5, 1, 3, 4, 6), L=.95)
    return c.render()

# ---------------------------------------------------------------- M03 Porcentagem e financas: pilhas de moedas
def pilha(c, cx, cy, n, r=.55, e=.11, cor='#d6a62e'):
    o = c.add(Obj())
    H = n * e
    cilindro(o, cx, cy, 0, H, r, lambda nn: cor if abs(nn[2]) < .5 else mix(cor, '#fff2b0', .25), n=60, brilho=.5, amb=.35)
    def fn(cam):
        out = []
        # frisos entre moedas (so na frente visivel) e relevo da moeda de cima
        for i in range(1, n):
            z = i * e; pts = [(cx + r * 1.002 * math.cos(t), cy + r * 1.002 * math.sin(t), z) for t in np.linspace(math.radians(190), math.radians(370), 30)]
            P2 = [cam.P(*p) for p in pts]
            out.append((-99, f'<polyline points="{" ".join(fmt(x)+","+fmt(y) for x, y in P2)}" fill="none" stroke="{mix(cor, "#000000", .45)}" stroke-width=".7"/>'))
        aro = circ3((cx, cy, H + .001), (1, 0, 0), (0, 1, 0), r * .80, 40)
        out.append((-99, poli(cam, aro, 'none', f' stroke="{mix(cor, "#7a5200", .55)}" stroke-width="1.1"')))
        aro2 = circ3((cx - .01, cy + .01, H + .001), (1, 0, 0), (0, 1, 0), r * .80, 40)
        out.append((-99, poli(cam, aro2, 'none', f' stroke="#fff3c4" stroke-width=".6" opacity=".8"')))
        return out
    o.raw(fn, [])
    return o

def M03():
    c = Cena(AZ, EL)
    pilha(c, -1.05, .55, 6); pilha(c, .15, .75, 11); pilha(c, -.35, -.65, 3)
    # moeda deitada a frente, levemente afastada
    pilha(c, .95, -.55, 1)
    return c.render()

# ---------------------------------------------------------------- M07 Sequencias: escada de cubos (PA 1, 2, 3, 4, 5)
def M07():
    c = Cena(AZ, EL)
    cores = ['#e0b13a', '#e08a3a', '#d9604a', '#b84a7a', '#6a5bb0']
    a = .5
    for i in range(5):
        for j in range(i + 1):
            x = (i - 2) * a * 1.02
            caixa_chanfro(c.add(Obj(sombra=(j == 0))), x - a / 2, x + a / 2, -a / 2, a / 2, j * a, (j + 1) * a, .045, cores[i], amb=.38)
    # sombra unica da escada
    return c.render()

def embaralhado(seq="R U R' F U' R2 F'"):
    """estado legal do cubo: parte do cubo resolvido (branco em cima, verde na frente, vermelho a direita) e aplica giros de camada"""
    C = {(0, 0, 1): '#f4f4f0', (0, 0, -1): '#f2c230', (0, -1, 0): '#2a9d55', (0, 1, 0): '#2a6fdb', (1, 0, 0): '#d93b30', (-1, 0, 0): '#ef7d22'}
    st = []
    for x in (-1, 0, 1):
        for y in (-1, 0, 1):
            for z in (-1, 0, 1):
                for n in C:
                    if (x, y, z)[[i for i in range(3) if n[i]][0]] == sum(n): st.append([(x, y, z), n, C[n]])
    def gira(eixo, camada, q):
        for s_ in st:
            p, n = s_[0], s_[1]
            if p[eixo] != camada: continue
            for _ in range(q % 4):
                def r(v):
                    v = list(v); a, b = [(1, 2), (2, 0), (0, 1)][eixo]; v[a], v[b] = -v[b], v[a]; return tuple(v)
                p, n = r(p), r(n)
            s_[0], s_[1] = p, n
    mov = {'R': (0, 1), 'L': (0, -1), 'U': (2, 1), 'D': (2, -1), 'F': (1, -1), 'B': (1, 1)}
    for m in seq.split():
        e, c_ = mov[m[0]]; q = 2 if m.endswith('2') else (3 if m.endswith("'") else 1)
        gira(e, c_, q)
    face = {'t': {}, 'f': {}, 'd': {}}
    for p, n, cor in st:
        if n == (0, 0, 1): face['t'][(p[1] + 1) * 3 + (p[0] + 1)] = cor
        if n == (0, -1, 0): face['f'][(p[2] + 1) * 3 + (p[0] + 1)] = cor
        if n == (1, 0, 0): face['d'][(p[2] + 1) * 3 + (p[1] + 1)] = cor
    return {k: [v[i] for i in range(9)] for k, v in face.items()}

# ---------------------------------------------------------------- M15 Matrizes: cubo de 3x3 (cada face e uma matriz 3x3)
def M15():
    c = Cena(-34, 28)
    o = c.add(Obj())
    L = 2.1; h = L / 2
    caixa_chanfro(o, -h, h, -h, h, 0, L, .07, '#17181c', amb=.5)
    cor = embaralhado()
    q = L / 3; m = .055
    for k, (n, f) in enumerate([((0, 0, 1), lambda u, v, e: (u, v, L + e)), ((0, -1, 0), lambda u, v, e: (u, -h - e, v + h)), ((1, 0, 0), lambda u, v, e: (h + e, u, v + h))]):
        lista = cor['tfd'[k]]
        for i in range(3):
            for j in range(3):
                u0, v0 = -h + i * q + m, -h + j * q + m; u1, v1 = u0 + q - 2 * m, v0 + q - 2 * m
                pts = [f(u0, v0, .004), f(u1, v0, .004), f(u1, v1, .004), f(u0, v1, .004)]
                o.face(pts, lista[j * 3 + i], amb=.45, brilho=.35, ordem=1)
    return c.render()

if __name__ == '__main__':
    import sys
    alvo = sys.argv[1:] or [k for k in list(globals()) if k.startswith('M') and k[1:].isdigit()]
    for k in alvo: grava(k, globals()[k]())

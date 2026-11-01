# -*- coding: utf-8 -*-
"""Matematica (continuacao): M01, M02, M04, M05, M06, M08, M09, M10, M12, M14, M16, M17."""
from gera_mat import *
SANS_B = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
SERIF_I = '/usr/share/fonts/truetype/dejavu/DejaVuSerif-BoldItalic.ttf'

def texto_no_plano(cam, txt, M, cx, cy, z, tam, cor, fonte_arq=SANS_B, eixo_u=(1, 0, 0), eixo_v=(0, 1, 0), op=1):
    """texto deitado sobre um plano: (u, v) do texto -> M(cx + u*eu + v*ev ...)"""
    eu, ev = np.array(eixo_u), np.array(eixo_v)
    def f(u, v):
        p = np.array([cx, cy, z]) + u * eu + v * ev
        return cam.P(*M(*p))
    d = texto_path(txt, f, tam, fonte_arq)
    o = f' opacity="{op}"' if op != 1 else ''
    return f'<path d="{d}" fill="{cor}"{o}/>'

# ---------------------------------------------------------------- M01 Fundamentos: calculadora
def M01():
    c = Cena(-18, 52)
    M = transf(math.radians(8), (0, 0, 0))
    o = c.add(Obj())
    W, D, T = .86, 1.25, .16
    P = [M(x, y, z) for x in (-W, W) for y in (-D, D) for z in (0, T)]
    b = .07
    P2 = []
    for x in (-W, W):
        for y in (-D, D):
            for z in (0, T):
                sx, sy, sz = (1 if x < 0 else -1), (1 if y < 0 else -1), (1 if z == 0 else -1)
                P2 += [M(x + sx * b, y + sy * b, z), M(x + sx * b, y, z + sz * b * .6), M(x, y + sy * b, z + sz * b * .6)]
    solido_convexo(o, P2, '#3b3f48', amb=.45, brilho=.2)
    # visor rebaixado
    solido_convexo(o, [M(x, y, z) for x in (-W + .14, W - .14) for y in (.52, D - .14) for z in (T - .01, T + .004)], '#1f2228', ordem=1)
    lcd = [M(-W + .2, .58, T + .006), M(W - .2, .58, T + .006), M(W - .2, D - .2, T + .006), M(-W + .2, D - .2, T + .006)]
    teclas = []
    rot = [['7', '8', '9', '÷'], ['4', '5', '6', '×'], ['1', '2', '3', '−'], ['0', '.', '=', '+']]
    kw, kd, g = .3, .2, .1
    x0 = -W + .16; y_top = .32
    for i, linha in enumerate(rot):
        for j, ch in enumerate(linha):
            x = x0 + j * (kw + g * .55) + kw / 2 + .02; y = y_top - i * (kd + g) - kd / 2
            cor = '#ececef' if ch.isdigit() or ch == '.' else ('#e07b2c' if ch == '=' else '#8e94a1')
            teclas.append((x, y, ch, cor))
    def fn(cam):
        out = []
        out.append((0, f'<path d="{caminho([cam.P(*p) for p in lcd])}" fill="#b7c3a3"/>'))
        out.append((0, texto_no_plano(cam, '3.1416', M, 0, .9, T + .008, .25, '#26302a', '/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf')))
        for x, y, ch, cor in teclas:
            k = Obj(); caixa_chanfro(k, x - kw / 2, x + kw / 2, y - kd / 2, y + kd / 2, T, T + .07, .025, cor, amb=.45, brilho=.25)
            for pts, cc, op in k.faces:
                pts = [M(*p) for p in pts]; n = normal(pts)
                if cam.V(*n)[2] >= 0: continue
                out.append((0, f'<path d="{caminho([cam.P(*p) for p in pts])}" fill="{tom(cc, n, .45, .25)}" stroke="{mix(cc, "#000000", .35)}" stroke-width=".25"/>'))
            corl = '#2a2c33' if cor == '#ececef' else '#ffffff'
            out.append((0, texto_no_plano(cam, ch, M, x, y, T + .072, .15, corl)))
        return out
    lam = lambda cam: fn(cam); lam.ordem = 3
    o.cru.append((lam, []))
    return c.render()

# ---------------------------------------------------------------- M02 Razao e proporcao: engrenagens 16:8 (razao 2:1)
def perfil_engrenagem(N, rp, cx, cy, fase=0.0):
    m = 2 * rp / N; ra, rf = rp + m, rp - 1.25 * m
    pts = []
    for i in range(N):
        a0 = fase + 2 * math.pi * i / N; p = 2 * math.pi / N
        for frac, r in ((0, rf), (.12, rf), (.28, ra), (.47, ra), (.63, rf), (1.0, rf)):
            if frac == 1.0: continue
            a = a0 + frac * p
            pts.append((cx + r * math.cos(a), cy + r * math.sin(a)))
    return pts
def circ2(cx, cy, r, n=36): return [(cx + r * math.cos(2 * math.pi * i / n), cy + r * math.sin(2 * math.pi * i / n)) for i in range(n)]

def M02():
    c = Cena(-24, 40)
    N1, N2 = 16, 8; r1 = 1.0; r2 = r1 * N2 / N1
    c1, c2 = (-.55, .25), (-.55 + r1 + r2, .25 - .0)
    g1 = perfil_engrenagem(N1, r1, *c1); g2 = perfil_engrenagem(N2, r2, *c2, fase=math.pi / N2 + math.pi)
    o1 = c.add(Obj()); extrusao(o1, g1, 0, .26, '#d4ac55', '#b88f3a', furos=[circ2(*c1, .16)], brilho=.3)
    # raios vazados da engrenagem grande (realismo de engrenagem de relogio)
    o2 = c.add(Obj()); extrusao(o2, g2, 0, .26, '#b9c1cb', '#97a0ab', furos=[circ2(*c2, .1)], brilho=.35)
    def eixo(cx, cy, r):
        def fn(cam):
            return [(0, poli(cam, [(cx + r * math.cos(t), cy + r * math.sin(t), .262) for t in np.linspace(0, 2 * math.pi, 30)], '#2c2f36'))]
        return fn
    for o, cc, r in ((o1, c1, .16), (o2, c2, .1)):
        f = eixo(*cc, r); f.ordem = 3; o.cru.append((f, []))
    # aro interno decorativo na grande
    def aro(cam):
        return [(0, poli(cam, [(c1[0] + .55 * math.cos(t), c1[1] + .55 * math.sin(t), .262) for t in np.linspace(0, 2 * math.pi, 48)], 'none', ' stroke="#8f6c25" stroke-width="1.1" opacity=".7"')),
                (0, poli(cam, [(c1[0] + .3 * math.cos(t), c1[1] + .3 * math.sin(t), .262) for t in np.linspace(0, 2 * math.pi, 40)], 'none', ' stroke="#8f6c25" stroke-width=".8" opacity=".6"'))]
    aro.ordem = 3; o1.cru.append((aro, []))
    return c.render()

# ---------------------------------------------------------------- M04 Equacoes: balanca de pratos equilibrada (2 blocos x = 6 pesos de 1)
def M04():
    c = Cena(-18, 16)
    o = c.add(Obj())
    cilindro_liso(o, (0, 0, 0), (0, 0, .16), .7, .58, cor='#5a3b26', amb=.4, ordem=0)
    cilindro_liso(o, (0, 0, .16), (0, 0, 1.5), .085, cor='#c9a24a', brilho=.5, ordem=1)
    caixa(o, -1.3, 1.3, -.07, .07, 1.62, 1.77, '#c9a24a', brilho=.4, ordem=2)
    o.esfera((0, 0, 1.84), .14, '#d8b45a', ordem=3)
    for sx in (-1, 1):
        px = sx * 1.2
        def fios(cam, px=px):
            out = []
            for dx, dy in ((-.5, -.15), (.5, -.15), (0, .35)):
                out.append((0, lin(cam, (px, 0, 1.62), (px + dx, dy, .62), '#6f5a38', .9)))
            return out
        o.raw(fios, [])
        cilindro_liso(o, (px, 0, .5), (0, 0, .13), .56, .64, cor='#c9a24a', brilho=.5, ordem=4)
    # dois blocos "x" no prato da esquerda; no da direita, 6 pesos de 1 (2x = 6)
    for i, dx in enumerate((-.21, .21)):
        bl = c.add(Obj(sombra=False)); bl.prof = -1e6; x = -1.2 + dx
        caixa_chanfro(bl, x - .2, x + .2, -.2, .2, .63, 1.03, .025, '#3f72b8', amb=.4)
        def letra(cam, x=x):
            return [(0, texto_no_plano(cam, 'x', lambda *p: p, x, -.203, .83, .34, '#ffffff', SERIF_I, (1, 0, 0), (0, 0, 1)))]
        letra.ordem = 3; bl.cru.append((letra, []))
    for (dx, dy, dz) in [(-.3, .12, 0), (0, .12, 0), (.3, .12, 0), (-.3, -.16, 0), (0, -.16, 0), (.3, -.16, 0)]:
        w = c.add(Obj(sombra=False)); w.prof = -1e6 - dy; cilindro_liso(w, (1.2 + dx, dy, .63 + dz), (0, 0, .24), .12, cor='#8d949e', brilho=.6)
        w.esfera((1.2 + dx, dy, .9 + dz), .05, '#8d949e', reflexo=False)
    return c.render()

# ---------------------------------------------------------------- M05 Funcoes: papel milimetrado com parabola e reta
def papel_grade(c, W, D, M, passo=.1, grosso=5, cor_fino='#cfe0ea', cor_grosso='#9ec1d6', z=.02):
    o = c.add(Obj())
    caixa(o, -W, W, -D, D, 0, z, '#fbfbf8', amb=.85)
    def fn(cam):
        out = []
        nx = int(round(2 * W / passo)); ny = int(round(2 * D / passo))
        for i in range(nx + 1):
            x = -W + i * passo; gr = i % grosso == 0
            out.append((0, lin(cam, M(x, -D, z + .001), M(x, D, z + .001), cor_grosso if gr else cor_fino, .55 if gr else .3, cap='butt')))
        for j in range(ny + 1):
            y = -D + j * passo; gr = j % grosso == 0
            out.append((0, lin(cam, M(-W, y, z + .001), M(W, y, z + .001), cor_grosso if gr else cor_fino, .55 if gr else .3, cap='butt')))
        return out
    fn.ordem = 3; o.cru.append((fn, []))
    return o

def curva_com_sombra(c, pts3, raio, cor, z0):
    o = c.add(Obj(sombra=False))
    def fn(cam):
        sh = [cam.P(*no_chao(p, z0)) for p in pts3]
        out = [(5, f'<polyline points="{" ".join(fmt(x)+","+fmt(y) for x, y in sh)}" fill="none" stroke="#1b1d2a" stroke-width="{fmt(raio*2.2)}" stroke-linecap="round" stroke-linejoin="round" opacity=".18" filter="url(#fs)"/>')]
        out += [(4, tubo_liso(cam, pts3, raio, cor))]
        return out
    fn.ordem = 3; o.cru.append((fn, pts3))
    return o

def M05():
    c = Cena(-18, 60)
    I = lambda *p: p
    papel_grade(c, 1.5, 1.2, I)
    z = .1
    ax = c.add(Obj(sombra=False))
    def eixos(cam):
        out = [(0, lin(cam, (-1.4, -.6, .025), (1.38, -.6, .025), '#2b2f3a', 1.6)), (0, lin(cam, (-.2, -1.12, .025), (-.2, 1.12, .025), '#2b2f3a', 1.6))]
        for a, b, cc in (((1.32, -.65), (1.32, -.55), (1.45, -.6)), ((-.25, 1.06), (-.15, 1.06), (-.2, 1.18))):
            out.append((0, poli(cam, [(*a, .025), (*b, .025), (*cc, .025)], '#2b2f3a')))
        return out
    eixos.ordem = 3; ax.cru.append((eixos, []))
    par = [(x, -.6 + .55 * (x - .25) ** 2 * 1.0 - .32 + .32, z) for x in np.linspace(-1.05, 1.3, 40)]
    par = [(x, -.6 + .62 * (x - .2) ** 2 - .0, z) for x in np.linspace(-1.02, 1.32, 40) if -.6 + .62 * (x - .2) ** 2 <= 1.1]
    curva_com_sombra(c, par, 2.6, '#2f6fd0', 0)
    reta = [(x, -.6 + .2 + .55 * (x + .2), z + .01) for x in np.linspace(-1.3, 1.3, 12) if -1.15 < -.4 + .55 * (x + .2) < 1.1]
    curva_com_sombra(c, reta, 2.6, '#e0552f', 0)
    c.defs.append('<filter id="fs" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="1.6"/></filter>')
    s = c.render()
    return s

# ---------------------------------------------------------------- M08 Areas: placas planas (quadrado quadriculado, triangulo, circulo)
def M08():
    c = Cena(-24, 46)
    e = .14
    q = c.add(Obj()); extrusao(q, [(-1.45, -.35), (-.15, -.35), (-.15, .95), (-1.45, .95)], 0, e, '#e2c48d', '#c7a46a', amb=.4)
    def grade(cam):
        out = []
        for k in (1, 2):
            x = -1.45 + k * 1.3 / 3; y = -.35 + k * 1.3 / 3
            out.append((0, lin(cam, (x, -.35, e + .001), (x, .95, e + .001), '#a8844c', .8, cap='butt')))
            out.append((0, lin(cam, (-1.45, y, e + .001), (-.15, y, e + .001), '#a8844c', .8, cap='butt')))
        return out
    grade.ordem = 3; q.cru.append((grade, []))
    t = c.add(Obj()); extrusao(t, [(.05, -1.15), (1.45, -1.15), (.05, .35)], 0, e, '#4f86c9', '#3a6aa6', amb=.4, brilho=.25)
    def ang(cam):  # marca de angulo reto
        return [(0, poli(cam, [(.05, -1.15, e + .001), (.27, -1.15, e + .001), (.27, -.93, e + .001), (.05, -.93, e + .001)], 'none', ' stroke="#ffffff" stroke-width=".9" opacity=".85"'))]
    ang.ordem = 3; t.cru.append((ang, []))
    d = c.add(Obj()); cilindro_liso(d, (.95, .85, 0), (0, 0, e), .55, cor='#d65b4a', brilho=.3)
    return c.render()

# ---------------------------------------------------------------- M09 Relacoes: esquadro e transferidor transparentes
def M09():
    c = Cena(-20, 52)
    pap = c.add(Obj(sombra=True)); caixa(pap, -1.6, 1.6, -1.25, 1.25, 0, .01, '#fbfbf8', amb=.9)
    e = .05
    tri = [(-1.35, -1.0), (1.05, -1.0), (-1.35, 1.0)]
    furo = [(-1.05, -.72), (.25, -.72), (-1.05, .38)]
    es = c.add(Obj(sombra=False)); extrusao(es, tri, .01, .01 + e, '#8cc4e6', '#5a9dc6', furos=[furo], opac=.55, contorno='#3d7fab', sw=.6)
    def reguas(cam):
        out = []
        for i in range(25):
            x = -1.35 + i * .1; L = .09 if i % 5 else .16
            out.append((0, lin(cam, (x, -1.0, .062), (x, -1.0 + L, .062), '#245a80', .5, cap='butt')))
        for i in range(20):
            y = -1.0 + i * .1; L = .09 if i % 5 else .16
            out.append((0, lin(cam, (-1.35, y, .062), (-1.35 + L, y, .062), '#245a80', .5, cap='butt')))
        out.append((0, poli(cam, [(-1.35, -1.0, .062), (-1.13, -1.0, .062), (-1.13, -.78, .062), (-1.35, -.78, .062)], 'none', ' stroke="#c23b3b" stroke-width=".8"')))
        return out
    reguas.ordem = 3; es.cru.append((reguas, []))
    # transferidor (semicirculo com janela)
    cx, cy, R = .55, -.2, .95
    arco = [(cx + R * math.cos(t), cy + R * math.sin(t)) for t in np.linspace(0, math.pi, 50)]
    tr = c.add(Obj(sombra=False)); tr.prof = -1e6
    janela = [(cx + R * .55 * math.cos(t), cy + .12 + R * .55 * math.sin(t)) for t in np.linspace(math.pi, 0, 30)]
    extrusao(tr, arco, .07, .07 + e, '#f2d27a', '#d1ad4c', furos=[janela], opac=.62, contorno='#b38a2a', sw=.6)
    def marcas(cam):
        out = []
        z = .07 + e + .002
        for k in range(0, 181, 10):
            t = math.radians(k); L = .14 if k % 30 == 0 else .08
            out.append((0, lin(cam, (cx + R * math.cos(t), cy + R * math.sin(t), z), (cx + (R - L) * math.cos(t), cy + (R - L) * math.sin(t), z), '#6b4e10', .55, cap='butt')))
        out.append((0, lin(cam, (cx - R, cy, z), (cx + R, cy, z), '#6b4e10', .5, cap='butt')))
        return out
    marcas.ordem = 3; tr.cru.append((marcas, []))
    c.ops = .2
    return c.render()

# ---------------------------------------------------------------- M10 Trigonometria: circulo trigonometrico em relevo
def M10():
    c = Cena(-16, 56)
    R0 = 1.45; e = .14
    d = c.add(Obj()); cilindro_liso(d, (0, 0, 0), (0, 0, e), R0, cor='#f4f1e8', amb=.55, brilho=.2)
    z = e + .05; R = 1.08; th = math.radians(38)
    p = (R * math.cos(th), R * math.sin(th), z)
    rel = c.add(Obj(sombra=False))
    def fn(cam):
        out = []
        circ = [(R * math.cos(t), R * math.sin(t), z) for t in np.linspace(0, 2 * math.pi, 73)]
        out += [(1, tubo_liso(cam, circ, 1.4, '#3a3f4b'))]
        out += [(1, s) for _, s in tubo(cam, [(-1.3, 0, z), (1.3, 0, z)], .9, '#6c7280')]
        out += [(1, s) for _, s in tubo(cam, [(0, -1.3, z), (0, 1.3, z)], .9, '#6c7280')]
        out += [(0, s) for _, s in tubo(cam, [(0, 0, z + .02), p], 1.4, '#2b2f3a')]
        out += [(0, s) for _, s in tubo(cam, [p, (p[0], 0, z + .02)], 1.45, '#d6453d')]       # seno
        out += [(0, s) for _, s in tubo(cam, [(0, 0, z + .03), (p[0], 0, z + .03)], 1.45, '#2f6fd0')]   # cosseno
        arco = [(.36 * math.cos(t), .36 * math.sin(t), z + .02) for t in np.linspace(0, th, 12)]
        out += [(0, tubo_liso(cam, arco, 1.1, '#e39a2b'))]
        return out
    fn.ordem = 3; rel.cru.append((fn, [(R, R, z), (-R, -R, z)]))
    pt = c.add(Obj(sombra=False)); pt.prof = -1e6; pt.esfera(p, .1, '#d6453d')
    return c.render()

# ---------------------------------------------------------------- M12 Geometria analitica: geoplano com eixos e elastico
def M12():
    c = Cena(-24, 44)
    b = c.add(Obj()); caixa_chanfro(b, -1.5, 1.5, -1.5, 1.5, 0, .2, .05, '#c99a62', amb=.42)
    z = .2
    def eixos(cam):
        return [(0, lin(cam, (-1.38, -.5, z + .001), (1.38, -.5, z + .001), '#3a2a1a', 1.8, cap='butt')),
                (0, lin(cam, (-.5, -1.38, z + .001), (-.5, 1.38, z + .001), '#3a2a1a', 1.8, cap='butt'))]
    eixos.ordem = 3; b.cru.append((eixos, []))
    pinos = [(-1.0 + .5 * i, -1.0 + .5 * j) for i in range(5) for j in range(5)]
    tri = [(-.5, -.5), (1.0, 0.0), (0.0, 1.0)]   # vertices em pinos (coordenadas inteiras)
    pinos.sort(key=lambda q: -(q[1] - q[0] * .5))
    for x, y in pinos:
        pz = c.add(Obj(sombra=False)); cilindro_liso(pz, (x, y, z), (0, 0, .26), .07, cor='#c3c9d1', brilho=.6)
    el = c.add(Obj(sombra=False)); el.prof = -1e6
    def elas(cam):
        pts = [(x, y, z + .16) for x, y in tri]
        return [(0, tubo_liso(cam, pts, 1.7, '#d8343f', fechado=True))]
    elas.ordem = 3; el.cru.append((elas, []))
    for (x, y) in tri[:1]:
        pp = c.add(Obj(sombra=False)); pp.prof = -1e7; pp.esfera((x, y, z + .3), .11, '#2f6fd0')
    return c.render()

# ---------------------------------------------------------------- M14 Estatistica: grafico de pizza 3D com uma fatia destacada
def M14():
    c = Cena(-20, 40)
    fatias = [(.40, '#3f72b8'), (.26, '#e3a33b'), (.20, '#4f9a6a'), (.14, '#d65b4a')]
    a = math.radians(-30); R = 1.35; e = .32
    for i, (f, cor) in enumerate(fatias):
        a0, a1 = a, a + 2 * math.pi * f; a = a1
        am = (a0 + a1) / 2; off = .28 if i == 3 else 0
        ox, oy = off * math.cos(am), off * math.sin(am)
        pts = [(ox, oy)] + [(ox + R * math.cos(t), oy + R * math.sin(t)) for t in np.linspace(a0, a1, max(6, int(60 * f)))]
        o = c.add(Obj()); extrusao(o, pts, 0, e, cor, cor, brilho=.3, amb=.35)
    return c.render()

# ---------------------------------------------------------------- M16 Polinomios: azulejos algebricos (x+1)(x+2) = x^2 + 3x + 2
def M16():
    c = Cena(-22, 48)
    X, U, e, g = 1.2, .38, .12, .04
    def tile(x0, y0, w, d, cor):
        o = c.add(Obj()); caixa_chanfro(o, x0 + g / 2, x0 + w - g / 2, y0 + g / 2, y0 + d - g / 2, 0, e, .03, cor, amb=.42, brilho=.25)
    x0, y0 = -(X + 2 * U) / 2, -(X + U) / 2 + .0
    tile(x0, y0 + U, X, X, '#3f72b8')                        # x^2
    tile(x0 + X, y0 + U, U, X, '#4f9a6a'); tile(x0 + X + U, y0 + U, U, X, '#4f9a6a')   # 2 barras x (verticais)
    tile(x0, y0, X, U, '#4f9a6a')                            # 1 barra x (horizontal)
    tile(x0 + X, y0, U, U, '#e3b23b'); tile(x0 + X + U, y0, U, U, '#e3b23b')           # 2 unidades
    return c.render()

# ---------------------------------------------------------------- M17 Logica: pecas de quebra-cabeca encaixadas
def borda(p0, p1, s, n=18):
    """aresta de p0 a p1 com pino (s=+1 para fora, -1 para dentro, 0 reta). Fora = lado direito do sentido de percurso"""
    (x0, y0), (x1, y1) = p0, p1
    dx, dy = x1 - x0, y1 - y0; L = math.hypot(dx, dy); ux, uy = dx / L, dy / L; nx, ny = uy, -ux
    P = lambda a, b: (x0 + ux * a * L + nx * b * L, y0 + uy * a * L + ny * b * L)
    if s == 0: return [P(0, 0)]
    out = [P(0, 0), P(.36, 0), P(.40, s * .05)]
    cxy, r = (.5, s * .17), .125
    a_ini = math.atan2(s * .07 - cxy[1], .405 - .5); a_fim = math.atan2(s * .07 - cxy[1], .595 - .5)
    # percorre o arco pelo lado de fora
    if s > 0:
        if a_fim > a_ini: a_fim -= 2 * math.pi
    else:
        if a_fim < a_ini: a_fim += 2 * math.pi
    for t in np.linspace(a_ini, a_fim, n):
        out.append(P(.5 + r * math.cos(t), cxy[1] + r * math.sin(t)))
    out += [P(.60, s * .05), P(.64, 0)]
    return out

def peca(cx, cy, L, lados):
    """lados: (baixo, direita, cima, esquerda) com +1 pino para fora, -1 encaixe, 0 reto. Percorre anti-horario."""
    h = L / 2; cs = [(cx - h, cy - h), (cx + h, cy - h), (cx + h, cy + h), (cx - h, cy + h)]
    pts = []
    for i in range(4):
        pts += borda(cs[i], cs[(i + 1) % 4], lados[i])
    return pts

def M17():
    c = Cena(-22, 46)
    L = 1.15; e = .13
    pa = peca(-L / 2 - .0, .25, L, (-1, 1, 1, 0))
    pb = peca(L / 2 + .0, .25, L, (1, 0, 1, -1))
    pc = peca(L / 2 + .25, -L + .25 - .35, L, (0, 1, -1, 1))
    for pts, cor, z in ((pa, '#3f72b8', 0), (pb, '#e3a33b', 0)):
        o = c.add(Obj()); extrusao(o, pts, z, z + e, cor, mix(cor, '#000000', .1), brilho=.25, amb=.38)
    # terceira peca: levantada e girada, prestes a encaixar
    M = transf(math.radians(14), (.32, -.42, .32), roll=math.radians(-10))
    o = c.add(Obj()); extrusao(o, [(x - (L / 2 + .25), y - (-L + .25 - .35)) for x, y in pc], 0, e, '#4f9a6a', '#3f8358', M=M, brilho=.25, amb=.38)
    return c.render()

# ---------------------------------------------------------------- M06 Exponencial e logaritmo: concha de nautilo cortada
# A concha cresce em espiral logaritmica r = a*e^(b*theta): a cada volta o raio e multiplicado por e^(2*pi*b) (~3 no nautilo).
def M06():
    b = math.log(3.0) / (2 * math.pi); a = 1.0
    r = lambda t: a * math.exp(b * t)
    cx, cy = 100, 100
    K = 11.0
    T = 4 * math.pi + math.radians(40)      # angulo final (abertura)
    def P(t, rr=None):
        rr = r(t) if rr is None else rr
        return (cx + K * rr * math.cos(-t), cy + K * rr * math.sin(-t))
    defs = [grad_rad('nac', [(0, '#fff9ef'), (.55, '#f3e2c8'), (1, '#d9b98f')], cx=.5, cy=.5, r=.5),
            '<radialGradient id="cam" gradientUnits="userSpaceOnUse" cx="100" cy="100" r="%d"><stop offset="0" stop-color="#e7c9a0"/><stop offset=".55" stop-color="#f6e9d6"/><stop offset="1" stop-color="#fdf8f0"/></radialGradient>' % int(K * r(T)),
            '<filter id="sb" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="3"/></filter>']
    out = []
    # sombra da concha
    # contorno externo (a volta mais externa) preenchido com nacar
    ext = [P(t) for t in np.linspace(T - 2 * math.pi, T, 120)]
    xs = [p[0] for p in ext]; yb = max(p[1] for p in ext)
    out.append(f'<ellipse cx="{(min(xs) + max(xs)) / 2 + 6:.1f}" cy="{yb + 3:.1f}" rx="{(max(xs) - min(xs)) * .46:.1f}" ry="{K * r(T) * .1:.1f}" fill="#1b1d2a" opacity=".2" filter="url(#sb)"/>')
    interno = [P(t) for t in np.linspace(T - 2 * math.pi, T - 4 * math.pi, 120)]
    out.append(f'<path d="{caminho(ext)}" fill="#e9d2b0"/>')
    # camaras: septos a cada 24 graus, curvos (concavos para a abertura)
    passo = math.radians(24)
    t = T - math.radians(115)         # camara de habitacao: ultimo ~1/3 de volta sem septos
    septos = []
    while t > math.radians(-200):
        septos.append(t); t -= passo * (0.985 if t > 0 else 1.0)
    cam_svg = ''
    for i in range(len(septos) - 1):
        t1, t0 = septos[i], septos[i + 1]
        if t0 < -math.pi: break
        fora = [P(q) for q in np.linspace(t0, t1, 10)]
        dentro = [P(q - 2 * math.pi) for q in np.linspace(t1, t0, 10)]
        # septo curvo: ponto medio puxado para tras (sentido das camaras antigas)
        def septo(tt, ida=True):
            pa, pb = P(tt), P(tt - 2 * math.pi)
            mx, my = (pa[0] + pb[0]) / 2, (pa[1] + pb[1]) / 2
            back = P(tt - .25, (r(tt) + r(tt - 2 * math.pi)) / 2)
            qx, qy = mx + (back[0] - mx) * 1.2, my + (back[1] - my) * 1.2
            return (pa, (qx, qy), pb) if ida else (pb, (qx, qy), pa)
        s1 = septo(t1); s0 = septo(t0, False)
        d = 'M' + ' L'.join(f'{fmt(x)} {fmt(y)}' for x, y in fora)
        d += f' Q{fmt(s1[1][0])} {fmt(s1[1][1])} {fmt(s1[2][0])} {fmt(s1[2][1])}'
        d += ' L' + ' L'.join(f'{fmt(x)} {fmt(y)}' for x, y in dentro[1:])
        d += f' Q{fmt(s0[1][0])} {fmt(s0[1][1])} {fmt(s0[2][0])} {fmt(s0[2][1])}Z'
        cam_svg += f'<path d="{d}" fill="url(#cam)" stroke="#b48d5f" stroke-width="{fmt(.9 + .25 * r(t1))}" stroke-linejoin="round"/>'
    # camara de habitacao (vazia, mais escura no fundo)
    hab_fora = [P(q) for q in np.linspace(septos[0], T, 30)]
    hab_dentro = [P(q - 2 * math.pi) for q in np.linspace(T, septos[0], 30)]
    s1 = (P(septos[0]), P(septos[0] - 2 * math.pi))
    pa, pb = s1
    back = P(septos[0] - .25, (r(septos[0]) + r(septos[0] - 2 * math.pi)) / 2)
    mx, my = (pa[0] + pb[0]) / 2, (pa[1] + pb[1]) / 2; qx, qy = mx + (back[0] - mx) * 1.2, my + (back[1] - my) * 1.2
    d = 'M' + ' L'.join(f'{fmt(x)} {fmt(y)}' for x, y in hab_fora) + ' L' + ' L'.join(f'{fmt(x)} {fmt(y)}' for x, y in hab_dentro)
    d += f' Q{fmt(qx)} {fmt(qy)} {fmt(pa[0])} {fmt(pa[1])}Z'
    defs.append('<radialGradient id="hab" cx=".2" cy=".75" r=".95"><stop offset="0" stop-color="#9a6b40"/><stop offset=".45" stop-color="#c99d6c"/><stop offset="1" stop-color="#f0dcc0"/></radialGradient>')
    out.append(f'<path d="{d}" fill="url(#hab)" stroke="#b48d5f" stroke-width="1.6"/>')
    out.append(cam_svg)
    # centro (protoconcha)
    out.append(f'<circle cx="{fmt(P(-math.pi)[0]*.5+cx*.5)}" cy="{fmt(P(-math.pi)[1]*.5+cy*.5)}" r="{fmt(K*r(-math.pi)*.55)}" fill="#c9a679"/>')
    # sifunculo: tubo que atravessa os septos
    sif = [P(q, r(q) * .82 + r(q - 2 * math.pi) * .18) for q in np.linspace(-math.pi, septos[0], 140)]
    out.append(f'<polyline points="{" ".join(fmt(x)+","+fmt(y) for x, y in sif)}" fill="none" stroke="#a87d4e" stroke-width="1.4" stroke-dasharray="4 3" opacity=".75"/>')
    # parede externa (espessura da concha) com as faixas castanhas do nautilo
    parede = [P(q) for q in np.linspace(T - 2 * math.pi, T, 160)]
    out.append(f'<polyline points="{" ".join(fmt(x)+","+fmt(y) for x, y in parede)}" fill="none" stroke="#f7efe2" stroke-width="5" stroke-linejoin="round"/>')
    for q in np.linspace(T - 2 * math.pi + .35, T - .15, 26):
        p1 = P(q, r(q) * 1.0); p2 = P(q + .07, r(q) * .985)
        if math.cos(q) > -2:
            out.append(f'<line x1="{fmt(p1[0])}" y1="{fmt(p1[1])}" x2="{fmt(p2[0])}" y2="{fmt(p2[1])}" stroke="#a5532c" stroke-width="3.6" stroke-linecap="round" opacity="{fmt(.35 + .55 * (1 - (q - (T - 2 * math.pi)) / (2 * math.pi)))}"/>')
    out.append(f'<path d="{caminho(ext)}" fill="none" stroke="#9c7a52" stroke-width="1.1"/>')
    # brilho de verniz da parte de cima (luz da esquerda-cima)
    brilho = [P(q, r(q) * .985) for q in np.linspace(math.pi * 2.55, math.pi * 3.15, 30)]
    out.append(f'<polyline points="{" ".join(fmt(x)+","+fmt(y) for x, y in brilho)}" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" opacity=".75"/>')
    return '<defs>' + ''.join(defs) + '</defs>' + ''.join(out)

if __name__ == '__main__':
    import sys, gera_mat
    alvo = sys.argv[1:] or ['M%02d' % i for i in range(1, 18)]
    for k in alvo:
        f = globals().get(k)
        if f: grava(k, f())

# -*- coding: utf-8 -*-
"""Conteudos M01 a M06."""
from sub_mat_base import *
from motor import _novo_id
MADEIRA = '#d9b07a'

# =============================================================== M01 Fundamentos (modulo: calculadora)
def M01_1():
    """fracoes e decimais: muro de fracoes de madeira (1; 1/2; 1/3; 1/4), barras do mesmo comprimento total"""
    c = Cena(-24, 50)
    L = 2.6; d = .42; e = .2; g = .035
    linhas = [(1, '#c8453b'), (2, '#e08a2e'), (3, '#3f8f5a'), (4, '#3f72b8')]
    for k, (n, cor) in enumerate(linhas):
        y = .9 - k * (d + .06)
        for i in range(n):
            x0 = -L / 2 + i * L / n
            o = c.add(Obj()); caixa_chanfro(o, x0 + g / 2, x0 + L / n - g / 2, y - d / 2, y + d / 2, 0, e, .03, cor, amb=.42, brilho=.2)
            txt = '1' if n == 1 else f'1/{n}'
            xm = x0 + L / n / 2
            def rot(cam, xm=xm, y=y, txt=txt):
                return [(0, texto(cam, txt, I, xm, y, e + .002, .2, '#ffffff', SANS_B, op=.95))]
            cru(o, rot)
    return c.render()

def M01_2():
    """potencias e radicais: 3, 3^2 e 3^3 em madeira - barra de 3 cubinhos, placa 3x3 e cubo 3x3x3 (aresta 3 = raiz quadrada de 9 = raiz cubica de 27)"""
    c = Cena(-30, 30)
    a = .42
    def bloco(x0, y0, nx, ny, nz, cor):
        o = c.add(Obj())
        x1, y1, z1 = x0 + nx * a, y0 + ny * a, nz * a
        caixa_chanfro(o, x0, x1, y0, y1, 0, z1, .03, cor, amb=.42, brilho=.15)
        sulco = mix(cor, '#5a3b1c', .55)
        def linhas(cam):
            out = []
            for i in range(1, nx):        # sulcos verticais nas faces da frente e de cima
                x = x0 + i * a
                out.append((0, lin(cam, (x, y0 - .002, .02), (x, y0 - .002, z1 - .02), sulco, .7, cap='butt')))
                out.append((0, lin(cam, (x, y0 + .02, z1 + .002), (x, y1 - .02, z1 + .002), sulco, .7, cap='butt')))
            for j in range(1, ny):
                y = y0 + j * a
                out.append((0, lin(cam, (x0 + .02, y, z1 + .002), (x1 - .02, y, z1 + .002), sulco, .7, cap='butt')))
                out.append((0, lin(cam, (x1 + .002, y, .02), (x1 + .002, y, z1 - .02), sulco, .7, cap='butt')))
            for k in range(1, nz):
                z = k * a
                out.append((0, lin(cam, (x0 + .02, y0 - .002, z), (x1 - .02, y0 - .002, z), sulco, .7, cap='butt')))
                out.append((0, lin(cam, (x1 + .002, y0 + .02, z), (x1 + .002, y1 - .02, z), sulco, .7, cap='butt')))
            return out
        cru(o, linhas)
        return o
    bloco(-.15, -.45, 3, 3, 3, '#d2a66a').prof = 10       # 3^3: cubo 3x3x3
    bloco(-1.6, -1.05, 3, 3, 1, '#ddb57c').prof = 5       # 3^2: placa 3x3
    bloco(-.85, -1.75, 3, 1, 1, '#e7c590').prof = 0       # 3^1: barra de 3
    return c.render()

def M01_3():
    """notacao cientifica e ordem de grandeza: placa com '10' e expoente '9' em metal, em relevo"""
    c = Cena(-22, 22)
    base = c.add(Obj()); caixa_chanfro(base, -1.45, 1.45, -.42, .42, 0, .16, .04, '#2e3440', amb=.45, brilho=.2)
    M = lambda u, v, w: (u, -w + .05, v + .16)        # letras em pe, de frente (u -> x, v -> z, espessura para tras)
    Mb = lambda u, v, w: (u - .38, -w + .05, v + .16)
    letras3d(c, '10', 1.25, lambda u, v, w: (u - .38, .1 - w, v + .16 + .45), .22, '#d9dde3', '#9aa2ad', SANS_B, brilho=.45, amb=.4)
    letras3d(c, '9', .72, lambda u, v, w: (u + .82, .1 - w, v + .16 + 1.08), .22, '#e3a33b', '#b67c1f', SANS_B, brilho=.45, amb=.4)
    return c.render()

def M01_4():
    """divisibilidade, MMC e MDC: barra de chocolate 3 x 6 (18) com um pedaco de 3 x 2 quebrado (18 = 3 x 6, 6 = 3 x 2)"""
    c = Cena(-26, 44)
    q = .42; e = .08; t = .1; cor = '#6b3a22'
    def pedaco(i0, i1, j0, j1, dx=0, dy=0, yaw=0):
        M = transf(yaw, (dx, dy, 0))
        o = c.add(Obj())
        caixaM(o, M, i0 * q, i1 * q, j0 * q, j1 * q, 0, e, '#5a2f1b', amb=.4)
        for i in range(i0, i1):
            for j in range(j0, j1):
                caixaM(o, M, i * q + .018, (i + 1) * q - .018, j * q + .018, (j + 1) * q - .018, e - .01, e + t, cor, b=.05, amb=.42, brilho=.35, ordem=1)
        return o
    pedaco(0, 4, 0, 3, -1.25, -.55)
    pedaco(4, 6, 0, 3, -1.25 + .32, -.55 - .18, math.radians(-14))
    return c.render()

def M01_5():
    """conjuntos numericos: bandejas encaixadas R > Q > Z > N (cada conjunto contem o seguinte)"""
    c = Cena(-20, 48)
    camadas = [('ℝ', 1.5, '#3f72b8', (0, 0)), ('ℚ', 1.12, '#4f9a6a', (.12, .3)), ('ℤ', .76, '#e3a33b', (.22, .56)), ('ℕ', .42, '#cf4d4d', (.3, .78))]
    z = 0; e = .14
    for k, (L, R, cor, (dx, dy)) in enumerate(camadas):
        o = c.add(Obj(sombra=(k == 0))); o.prof = -1e3 * k
        cilindro_liso(o, (dx, dy, z), (0, 0, e), R, cor=cor, brilho=.3, amb=.4)
        zz = z + e
        # letra na faixa da frente que fica descoberta
        if k < 3:
            ly = dy - R + (R - (camadas[k + 1][1] - (camadas[k + 1][3][1] - dy))) / 2 if False else dy - R * .80
        else:
            ly = dy
        def rot(cam, L=L, dx=dx, ly=ly, zz=zz, k=k):
            return [(0, texto(cam, L, I, dx, ly, zz + .002, .36 if k < 3 else .4, '#ffffff', SANS_B))]
        cru(o, rot, ordem=4)
        z = zz
    return c.render()

# =============================================================== M02 Razao e proporcao (modulo: engrenagens 2:1)
def _quadro(c, escala, cx, cy, yaw, incl=math.radians(80), cor='#b8863b', prof=None):
    """porta-retrato em pe (levemente inclinado para tras) com a mesma paisagem; todas as medidas x escala"""
    k = escala; W, H, b, e = 1.0 * k, .78 * k, .13 * k, .1 * k
    M = transf(yaw, (cx, cy, 0), roll=incl)
    o = c.add(Obj())
    if prof is not None: o.prof = prof
    ext = [(-W / 2, 0), (W / 2, 0), (W / 2, H), (-W / 2, H)]
    furo = [(-W / 2 + b, b), (-W / 2 + b, H - b), (W / 2 - b, H - b), (W / 2 - b, b)]
    extrusao(o, ext, 0, e, cor, mix(cor, '#000000', .25), furos=[furo], M=M, brilho=.35, amb=.4)
    iw, ih = W / 2 - b, H - b
    def foto(cam):
        w0 = e * .35
        P = lambda u, v: M(u, v, w0)
        out = [poli(cam, [P(-iw, b), P(iw, b), P(iw, ih), P(-iw, ih)], '#9fd0ee')]
        out.append(poli(cam, [P(-iw, ih * .55 + b * .45), P(iw, ih * .62 + b * .38), P(iw, ih), P(-iw, ih)], '#c9e6f6'))
        sol = [P(iw * .45 + .09 * k * math.cos(t), ih * .78 + .09 * k * math.sin(t)) for t in np.linspace(0, 2 * math.pi, 24)]
        out.append(poli(cam, sol, '#f6c945'))
        out.append(poli(cam, [P(-iw, b), P(-iw * .35, ih * .78), P(iw * .25, b)], '#7d8b99'))
        out.append(poli(cam, [P(-iw * .35, ih * .78), P(-iw * .2, ih * .6), P(-iw * .45, ih * .62)], '#f4f6f8'))
        out.append(poli(cam, [P(-iw * .2, b), P(iw * .3, ih * .58), P(iw, b * 1.0 + ih * .12), P(iw, b)], '#5f9f5a'))
        out.append(poli(cam, [P(-iw, b), P(iw, b), P(iw, b + .12 * k), P(-iw, b + .08 * k)], '#4f8a48'))
        return [(-9, s) for s in out]
    cru(o, foto, ordem=-1)
    return o

def M02_1():
    """razao e proporcao: dois porta-retratos com a mesma foto, um ampliado na razao 2:1 (todas as medidas dobram)"""
    c = Cena(-24, 18)
    _quadro(c, 2.0, -.55, .35, math.radians(10), prof=10)
    _quadro(c, 1.0, 1.05, -.55, math.radians(-14), cor='#9c6b3a', prof=0)
    return c.render()

def M02_2():
    """regra de tres: balanca de cozinha de ponteiro com macas (massa e preco proporcionais)"""
    c = Cena(-22, 24)
    o = c.add(Obj())
    P = [(x, y, z) for x, y, z in [(-.85, -.75, 0), (.85, -.75, 0), (.85, .75, 0), (-.85, .75, 0),
                                   (-.72, -.55, 1.15), (.72, -.55, 1.15), (.72, .62, 1.15), (-.72, .62, 1.15)]]
    solido_convexo(o, P, '#e9e6df', amb=.5, brilho=.3)
    # mostrador na face da frente (inclinada): centro e eixos no plano da face
    A, B = np.array((0, -.75, 0)), np.array((0, -.55, 1.15)); n_up = (B - A) / np.linalg.norm(B - A)
    ctr = A + n_up * .56 + np.array((0, -.03, 0)) * 0; ex = np.array((1.0, 0, 0)); ey = n_up
    nn = np.cross(ex, ey); nn = nn / np.linalg.norm(nn)
    ctr = ctr - nn * .004
    def Q(u, v, d=0): return tuple(ctr + ex * u + ey * v - nn * d)
    def mostr(cam):
        out = []
        R = .44
        out.append((0, poli(cam, [Q(R * 1.12 * math.cos(t), R * 1.12 * math.sin(t)) for t in np.linspace(0, 2 * math.pi, 48)], '#3b3f48')))
        out.append((0, poli(cam, [Q(R * math.cos(t), R * math.sin(t), .005) for t in np.linspace(0, 2 * math.pi, 48)], '#fbfaf6')))
        for i in range(0, 41):
            t = math.radians(90 + 135 - i * 270 / 40); L = .1 if i % 5 == 0 else .05
            out.append((0, lin(cam, Q((R - .04) * math.cos(t), (R - .04) * math.sin(t), .006), Q((R - .04 - L) * math.cos(t), (R - .04 - L) * math.sin(t), .006), '#2b2f3a', .9 if i % 5 == 0 else .5, cap='butt')))
        t = math.radians(90 + 135 - 270 * .62)
        out.append((0, lin(cam, Q(-.06 * math.cos(t), -.06 * math.sin(t), .008), Q((R - .07) * math.cos(t), (R - .07) * math.sin(t), .008), '#d23a32', 1.6)))
        out.append((0, poli(cam, [Q(.04 * math.cos(q), .04 * math.sin(q), .009) for q in np.linspace(0, 2 * math.pi, 16)], '#2b2f3a')))
        return out
    cru(o, mostr)
    # prato
    pr = c.add(Obj(sombra=False)); pr.prof = -100
    cilindro_liso(pr, (0, .03, 1.15), (0, 0, .06), .55, cor='#c9ccd2', brilho=.5)
    cilindro_liso(pr, (0, .03, 1.21), (0, 0, .14), .95, 1.12, cor='#d8dbe0', brilho=.55, amb=.45)
    for i, (x, y) in enumerate([(-.38, .22), (.36, .3), (0, -.18)]):
        m = c.add(Obj(sombra=False)); m.prof = -200 - i - (.3 - y) * 10
        m.esfera((x, y, 1.6), .36, '#c8262c')
        def cab(cam, x=x, y=y):
            return [(0, lin(cam, (x, y, 1.92), (x + .05, y, 2.1), '#5a3a1e', 1.6))]
        cru(m, cab, ordem=5)
    return c.render()

def M02_3():
    """escalas: mapa dobrado em sanfona com barra de escala grafica"""
    c = Cena(-20, 50)
    W, H, a = 1.0, 2.1, math.radians(22)
    def X(u):
        k = int(min(2, max(0, u // W))); f = u - k * W
        return k * W * math.cos(a) + f * math.cos(a)
    def Z(u):
        k = int(min(2, max(0, u // W))); f = u - k * W
        return (f if k % 2 == 0 else W - f) * math.sin(a)
    Mp = lambda u, v, d=.0: (X(u) - 1.5 * W * math.cos(a), v - H / 2, Z(u) + d + .02)
    o = c.add(Obj())
    for k in range(3):
        pts = [Mp(k * W + .0001, 0), Mp((k + 1) * W - .0001, 0), Mp((k + 1) * W - .0001, H), Mp(k * W + .0001, H)]
        if k % 2: pts = pts
        o.face(pts, '#f5f1e6', amb=.5, dupla=True)
    def mapa(cam):
        out = []
        U = lambda us, vs, d=.003: [Mp(u, v, d) for u, v in zip(us, vs)]
        # parque
        us = np.linspace(.15, 1.25, 30)
        out.append(poli(cam, [Mp(u, 1.35 + .25 * math.sin(u * 3), .002) for u in us] + [Mp(u, 1.95, .002) for u in us[::-1]], '#b9dca0'))
        # rio
        us = np.linspace(0, 3 * W, 90); vs = .55 + .25 * np.sin(us * 2.1) + us * .12
        out.append(pl(cam, U(us, vs), '#5aa6dc', 3.2))
        # ruas
        for v in (.35, 1.15, 1.75):
            uu = np.linspace(0, 3 * W, 60)
            out.append(pl(cam, U(uu, [v] * 60, .004), '#d9d3c4', 2.6)); out.append(pl(cam, U(uu, [v] * 60, .005), '#ffffff', 1.6))
        for u0 in (.7, 1.6, 2.45):
            vv = np.linspace(0, H, 30)
            out.append(pl(cam, U([u0] * 30, vv, .004), '#d9d3c4', 2.6)); out.append(pl(cam, U([u0] * 30, vv, .005), '#ffffff', 1.6))
        uu = np.linspace(0, 3 * W, 60)
        out.append(pl(cam, U(uu, .95 + uu * .25, .006), '#e8a33a', 2.6))
        # barra de escala (no ultimo painel, embaixo)
        u0, v0 = 2.12, .1; seg = .2
        for i in range(4):
            q = [Mp(u0 + i * seg, v0, .007), Mp(u0 + (i + 1) * seg, v0, .007), Mp(u0 + (i + 1) * seg, v0 + .07, .007), Mp(u0 + i * seg, v0 + .07, .007)]
            out.append(poli(cam, q, '#22252d' if i % 2 == 0 else '#ffffff', ' stroke="#22252d" stroke-width=".5"'))
        # alfinete
        return [(0, s) for s in out]
    cru(o, mapa, ordem=3)
    pin = c.add(Obj(sombra=True)); pin.prof = -1e6
    px, py, pz = Mp(1.6, 1.15, 0)
    def alf(cam):
        return [(0, lin(cam, (px, py, pz), (px, py, pz + .32), '#8d949e', 1.4))]
    cru(pin, alf, ordem=0, pts=[(px, py, pz)])
    pin.esfera((px, py, pz + .38), .12, '#d6453d')
    return c.render()

def M02_4():
    """grandezas inversamente proporcionais: retangulos de mesma area (1x6, 2x3, 3x2, 6x1) com o canto sobre a hiperbole xy = 6"""
    c = Cena(-18, 52)
    u = .38
    tab = c.add(Obj()); caixa(tab, -.35, 7.3 * u, -.35, 7.3 * u, -.06, 0, '#fbfbf8', amb=.85)
    def eixos(cam):
        out = [lin(cam, (0, 0, .001), (7.1 * u, 0, .001), '#2b2f3a', 1.3), lin(cam, (0, 0, .001), (0, 7.1 * u, .001), '#2b2f3a', 1.3)]
        for i in range(1, 8):
            out.append(lin(cam, (i * u, -.06, .001), (i * u, .06, .001), '#2b2f3a', .8, cap='butt'))
            out.append(lin(cam, (-.06, i * u, .001), (.06, i * u, .001), '#2b2f3a', .8, cap='butt'))
        return [(0, s) for s in out]
    cru(tab, eixos)
    cores = [(1, '#3f72b8'), (2, '#4f9a6a'), (3, '#e3a33b'), (6, '#cf4d4d')]
    for k, (a, cor) in enumerate(cores):
        b = 6 / a; z = .012 + k * .03
        o = c.add(Obj(sombra=False)); o.prof = -10 * k
        caixa(o, 0, a * u, 0, b * u, z, z + .025, cor, opac=.42, contorno=mix(cor, '#000000', .3), sw=.7)
    cv = c.add(Obj(sombra=False)); cv.prof = -1e3
    xs = np.linspace(6 / 7.0, 7.0, 80)
    def hip(cam):
        out = [(0, tubo_liso(cam, [(x * u, 6 / x * u, .14) for x in xs], 1.3, '#2b2f3a'))]
        return out
    cru(cv, hip)
    for a in (1, 2, 3, 6):
        p = c.add(Obj(sombra=False)); p.prof = -2e3 - a; p.esfera((a * u, 6 / a * u, .15), .085, '#2b2f3a')
    return c.render()

def M02_5():
    """divisao proporcional: o mesmo liquido dividido em tres provetas nas partes 1 : 2 : 3"""
    c = Cena(-20, 22)
    h = 1.9; r = .3
    for i, (x, y) in enumerate([(-.85, .3), (0, 0), (.85, -.3)]):
        vidro_cilindro(c, x, y, 0, r, h, nivel=(h * .9) * (i + 1) / 3, cor_liq='#2f8fc9', marcas=11, pe=.25, prof=-i * 10)
    return c.render()

# =============================================================== M03 Porcentagem e financas (modulo: pilhas de moedas)
def M03_1():
    """porcentagem: placa de 100 quadradinhos (10 x 10) com 30 pintados = 30%, e o sinal % em relevo"""
    c = Cena(-24, 36)
    q = .26; n = 10; e = .12
    o = c.add(Obj()); caixa_chanfro(o, 0, n * q, 0, n * q, 0, e, .03, '#efe6d2', amb=.6, brilho=.15)
    def grade(cam):
        out = []
        for i in range(n):            # 30 celulas pintadas: 3 colunas inteiras
            for j in range(n):
                if i < 3:
                    out.append(poli(cam, [(i * q + .012, j * q + .012, e + .001), ((i + 1) * q - .012, j * q + .012, e + .001), ((i + 1) * q - .012, (j + 1) * q - .012, e + .001), (i * q + .012, (j + 1) * q - .012, e + .001)], '#d9473c'))
        for k in range(1, n):
            out.append(lin(cam, (k * q, .02, e + .002), (k * q, n * q - .02, e + .002), '#b9ab8e', .7, cap='butt'))
            out.append(lin(cam, (.02, k * q, e + .002), (n * q - .02, k * q, e + .002), '#b9ab8e', .7, cap='butt'))
        return [(0, s) for s in out]
    cru(o, grade)
    Mp = transf(math.radians(-20), (n * q + .55, .25, 0), roll=math.pi / 2)
    letras3d(c, '%', 1.1, lambda u, v, w: Mp(u, v + .5, w), .24, '#d9473c', '#a8302a', SANS_B, brilho=.35, amb=.4)
    return c.render()

def _etiqueta(c, cx, cy, yaw, txt, cor, prof):
    M = transf(yaw, (cx, cy, 0)); L, A, e = 1.7, .85, .03
    pts = [(-L / 2, -A / 2), (L / 2 - .3, -A / 2), (L / 2, -A / 2 + .25), (L / 2, A / 2 - .25), (L / 2 - .3, A / 2), (-L / 2, A / 2)]
    furo = [(L / 2 - .2 + .07 * math.cos(t), .07 * math.sin(t)) for t in np.linspace(0, 2 * math.pi, 16, endpoint=False)][::-1]
    o = c.add(Obj()); o.prof = prof
    extrusao(o, pts, 0, e, cor, mix(cor, '#000000', .25), furos=[furo], M=M, amb=.5, brilho=.2)
    def rot(cam):
        out = [texto(cam, txt, M, -.12, 0, e + .002, .5, '#ffffff', SANS_B)]
        bx = L / 2 - .2
        fio = [M(bx + .07, .0, e + .002), M(bx + .22, .14, .04), M(bx + .38, .1, .03), M(bx + .46, -.06, .02)]
        out.append(pl(cam, fio, '#8a6a3c', 1.1))
        return [(0, s) for s in out]
    cru(o, rot)
    return o

def M03_2():
    """aumentos e descontos sucessivos: duas etiquetas de preco empilhadas, -10% e depois -20%"""
    c = Cena(-22, 50)
    _etiqueta(c, -.35, .4, math.radians(12), '−10%', '#2f6fd0', 10)
    _etiqueta(c, .05, -.45, math.radians(-8), '−20%', '#d9473c', 0)
    return c.render()

def M03_3():
    """juros simples: cofrinho de porquinho com uma moeda entrando na fenda"""
    defs = [grad_rad('pk', [(0, '#ffd9e0'), (.45, '#f2a3b3'), (.85, '#d8778c'), (1, '#b65a6f')], cx=.38, cy=.32, r=.75),
            grad_rad('fc', [(0, '#ffd0d9'), (.6, '#ee9aab'), (1, '#c86a80')], cx=.4, cy=.35, r=.7),
            grad_lin('mo', [(0, '#fff1b8'), (.45, '#e8c04a'), (1, '#a77a14')], 0, 0, 1, 1),
            '<filter id="sb" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="3"/></filter>']
    o = []
    o.append('<ellipse cx="112" cy="168" rx="70" ry="9" fill="#1b1d2a" opacity=".22" filter="url(#sb)"/>')
    # pernas de tras
    for x in (72, 128):
        o.append(f'<path d="M{x-11} 140 L{x-10} 166 Q{x} 171 {x+10} 166 L{x+11} 140Z" fill="#c96f84"/>')
    o.append('<path d="M150 96 Q166 84 160 76 Q154 70 150 78 Q148 86 160 88" fill="none" stroke="#d27a8f" stroke-width="3" stroke-linecap="round"/>')
    o.append('<ellipse cx="100" cy="112" rx="62" ry="48" fill="url(#pk)"/>')
    # orelhas
    o.append('<path d="M60 78 L52 50 L80 68Z" fill="#e48da0"/><path d="M62 74 L57 56 L75 68Z" fill="#c76479"/>')
    o.append('<path d="M86 66 L92 40 L108 66Z" fill="#eb9cae"/><path d="M90 64 L94 47 L103 64Z" fill="#c76479"/>')
    # pernas da frente
    for x in (60, 110):
        o.append(f'<path d="M{x-12} 140 L{x-11} 168 Q{x} 174 {x+11} 168 L{x+12} 140Z" fill="#e08aa0"/>')
        o.append(f'<ellipse cx="{x}" cy="168" rx="11" ry="3.5" fill="#b05a70"/>')
    # focinho
    o.append('<ellipse cx="42" cy="114" rx="13" ry="18" fill="url(#fc)"/><ellipse cx="38" cy="108" rx="2.6" ry="4.5" fill="#9b4559"/><ellipse cx="38" cy="121" rx="2.6" ry="4.5" fill="#9b4559"/>')
    o.append('<circle cx="68" cy="96" r="4.2" fill="#2a1d22"/><circle cx="66.8" cy="94.8" r="1.3" fill="#fff"/>')
    # fenda e moeda
    o.append('<path d="M98 66 Q112 63 126 66" fill="none" stroke="#7d3346" stroke-width="5" stroke-linecap="round"/>')
    o.append('<g transform="rotate(-8 112 48)"><ellipse cx="112" cy="48" rx="6" ry="20" fill="#b48a22"/><ellipse cx="110" cy="48" rx="5" ry="20" fill="url(#mo)"/><ellipse cx="110" cy="48" rx="3" ry="14" fill="none" stroke="#a77a14" stroke-width=".8"/></g>')
    o.append('<path d="M118 62 Q112 64 106 62" fill="none" stroke="#7d3346" stroke-width="2.5" stroke-linecap="round"/>')
    o.append('<path d="M60 90 Q80 70 112 72" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".45"/>')
    return '<defs>' + ''.join(defs) + '</defs>' + ''.join(o)

def M03_4():
    """juros compostos: pote de vidro com moedas e uma muda crescendo (o rendimento rende sobre o rendimento)"""
    c = Cena(-20, 20)
    r, h = .8, 1.5
    pote = c.add(Obj())
    # moedas dentro: pilhas de alturas crescentes
    for i, (x, y, n) in enumerate([(-.38, .15, 4), (.12, .3, 6), (.4, -.1, 3), (-.1, -.3, 2)]):
        cilindro(pote, x, y, 0, n * .09, .3, lambda nn: '#d6a62e' if abs(nn[2]) < .5 else '#ebc65a', n=40, brilho=.5, amb=.35)
    vid = vidro_cilindro(c, 0, 0, 0, r, h, prof=-5)
    # terra e muda saindo pela boca
    pl_ = c.add(Obj(sombra=False)); pl_.prof = -10
    def muda(cam):
        out = []
        caule = [(.0, 0, .55), (.02, 0, 1.2), (-.04, 0, 1.75), (0.03, 0, 2.25)]
        out.append(pl(cam, caule, '#4c8a3a', 3.2))
        out.append(pl(cam, caule, '#7cbf5c', 1.2))
        for (bx, bz, ang, L) in [(.0, 1.55, 35, .6), (-.03, 1.85, 155, .55), (.03, 2.22, 60, .45), (.03, 2.22, 125, .4)]:
            t = math.radians(ang); tip = (bx + L * math.cos(t), 0, bz + L * math.sin(t))
            nx, nz = -math.sin(t) * L * .32, math.cos(t) * L * .32
            mid = ((bx + tip[0]) / 2, 0, (bz + tip[2]) / 2)
            A = cam.P(bx, 0, bz); B = cam.P(*tip); C1 = cam.P(mid[0] + nx, 0, mid[2] + nz); C2 = cam.P(mid[0] - nx, 0, mid[2] - nz)
            out.append(f'<path d="M{fmt(A[0])} {fmt(A[1])} Q{fmt(C1[0])} {fmt(C1[1])} {fmt(B[0])} {fmt(B[1])} Q{fmt(C2[0])} {fmt(C2[1])} {fmt(A[0])} {fmt(A[1])}Z" fill="#5fae45"/>')
            out.append(f'<path d="M{fmt(A[0])} {fmt(A[1])} Q{fmt(C1[0])} {fmt(C1[1])} {fmt(B[0])} {fmt(B[1])}Z" fill="#8fd16a" opacity=".8"/>')
        return [(0, s) for s in out]
    cru(pl_, muda, pts=[(0, 0, 2.3), (.5, 0, 1.8), (-.5, 0, 1.9)])
    return c.render()

def M03_5():
    """dose e concentracao: seringa graduada e frasco-ampola de medicamento"""
    c = Cena(-24, 28)
    # frasco-ampola
    f = c.add(Obj()); f.prof = 50
    vidro_cilindro(c, .95, .7, 0, .42, 1.05, nivel=.7, cor_liq='#f0c64a', prof=60)
    fr = c.add(Obj(sombra=False)); fr.prof = 40
    torno(fr, [(.22, 0), (.22, .14), (.3, .14), (.3, .32)], base=(.95, .7, 1.05), cor='#c9ccd2', brilho=.6)
    cilindro_liso(fr, (.95, .7, 1.37), (0, 0, .1), .22, cor='#2f6fd0', brilho=.4)
    # seringa deitada, apontando para o frasco
    sy = c.add(Obj()); sy.prof = -10
    ang = math.radians(62); X = np.array((math.cos(ang), math.sin(ang), 0)); Yv = np.array((-math.sin(ang), math.cos(ang), 0))
    b0 = np.array((.95, .7, .2)) - X * 3.25 - Yv * .3
    def cl(x0, L, r0, r1=None, **k):
        cilindro_liso(sy, tuple(b0 + X * x0), tuple(X * L), r0, r1, **k)
    cl(-.55, .08, .26, cor='#f4f5f7', brilho=.4, ordem=0)      # botao do embolo
    cl(-.5, .55, .07, cor='#eef0f2', brilho=.4, ordem=1)       # haste
    cl(0, .06, .34, cor='#e8ecef', brilho=.4, ordem=2)         # aba
    cl(.06, 1.6, .19, cor='#e4eef3', brilho=.6, amb=.55, ordem=3, tampa_base=False)
    cl(.06, .1, .165, cor='#2b2f3a', brilho=.3, ordem=4)        # borracha do embolo
    cl(.16, 1.0, .165, cor='#f2c94f', brilho=.45, ordem=4)      # dose aspirada (vista pelo plastico)
    cl(1.66, .18, .1, .05, cor='#dfe5ea', brilho=.5, ordem=5)
    cl(1.84, .12, .06, cor='#3d7fd0', brilho=.4, ordem=6)
    cl(1.96, .6, .014, cor='#b8bec7', brilho=.8, ordem=7)
    def grad(cam):
        out = []
        for i in range(11):
            x = .2 + i * .14; L = .1 if i % 5 == 0 else .06
            p = b0 + X * x + Yv * (-.02) + np.array((0, 0, .19))
            out.append(lin(cam, tuple(p), tuple(p - Yv * L * .3 - np.array((0, 0, L))), '#33414c', .6, cap='butt'))
        a = b0 + X * .2 + Yv * -.12 + np.array((0, 0, .16)); b = b0 + X * 1.5 + Yv * -.12 + np.array((0, 0, .16))
        out.append(lin(cam, tuple(a), tuple(b), '#ffffff', 1.4, op=.8))
        return [(0, s) for s in out]
    cru(sy, grad, ordem=9)
    return c.render()

# =============================================================== M04 Equacoes e sistemas (modulo: balanca de pratos)
def _bloco_letra(c, cx, cy, yaw, L, txt, cor_txt, madeira='#e8c993', prof=None, tam=None, arquivo=SANS_B, topo_txt=False, frente=True):
    M = transf(yaw, (cx, cy, 0)); h = L / 2
    o = c.add(Obj())
    if prof is not None: o.prof = prof
    caixaM(o, M, -h, h, -h, h, 0, L, madeira, b=.06 * L, amb=.45, brilho=.2)
    R = rot_z(yaw)
    def fn(cam):
        out = []
        tt = tam or L * .62
        if frente and visivel(cam, R(0, -1, 0)):
            out.append((0, texto(cam, txt, M, 0, -h - .002, h, tt, cor_txt, arquivo, (1, 0, 0), (0, 0, 1))))
        if topo_txt:
            out.append((0, texto(cam, txt, M, 0, 0, L + .002, tt * 1.05, cor_txt, arquivo)))
        return out
    cru(o, fn)
    return o

def M04_1():
    """equacao do 1.o grau: blocos de madeira formando 2x + 1 = 7 (x = 3)"""
    c = Cena(-18, 50)
    L = .72; seq = [('2x', '#2f6fd0', SERIF_I), ('+', '#d9473c', SANS_B), ('1', '#3f8f5a', SANS_B), ('=', '#2b2f3a', SANS_B), ('7', '#e08a2e', SANS_B)]
    pos = [(-.86, .55), (0, .58), (.86, .53), (.05, -.48), (.9, -.5)]
    for i, (t, cor, f) in enumerate(seq):
        x, y = pos[i]
        _bloco_letra(c, x, y, math.radians((-6, 4, -3, 6, -5)[i]), L, t, cor, tam=L * (.5 if t == '2x' else .62), arquivo=f, prof=(10 if i < 3 else 0) - x * .01, topo_txt=True, frente=False)
    return c.render()

def M04_2():
    """equacao do 2.o grau: completar quadrados - placa x^2, duas tiras (b/2)x e o quadradinho (b/2)^2 que completa o quadrado"""
    c = Cena(-26, 44)
    X, B, e, g = 1.5, .55, .14, .035
    def tile(x0, y0, w, d, cor, z0=0, prof=None):
        o = c.add(Obj())
        if prof is not None: o.prof = prof
        caixa_chanfro(o, x0 + g / 2, x0 + w - g / 2, y0 + g / 2, y0 + d - g / 2, z0, z0 + e, .03, cor, amb=.42, brilho=.25)
        return o
    x0, y0 = -(X + B) / 2, -(X + B) / 2 + B
    q = tile(x0, y0, X, X, '#6f8fcf')
    cru(q, lambda cam: [(0, texto(cam, 'x²', I, x0 + X / 2, y0 + X / 2, e + .002, .55, '#ffffff', SERIF_I))])
    t1 = tile(x0 + X, y0, B, X, '#5ea877'); t2 = tile(x0, y0 - B, X, B, '#5ea877')
    cru(t1, lambda cam: [(0, texto(cam, 'x', I, x0 + X + B / 2, y0 + X / 2, e + .002, .34, '#ffffff', SERIF_I))])
    cru(t2, lambda cam: [(0, texto(cam, 'x', I, x0 + X / 2, y0 - B / 2, e + .002, .34, '#ffffff', SERIF_I))])
    # quadradinho chegando ao canto que falta
    tile(x0 + X + .12, y0 - B - .1, B, B, '#e9b53e', z0=.55, prof=-1e6)
    k = c.add(Obj(sombra=False)); k.prof = 1e5
    def canto(cam):
        p = [(x0 + X + .02, y0 - B + .02, .002), (x0 + X + B - .02, y0 - B + .02, .002), (x0 + X + B - .02, y0 - .02, .002), (x0 + X + .02, y0 - .02, .002)]
        return [(0, poli(cam, p, 'none', ' stroke="#b98a1e" stroke-width="1" stroke-dasharray="3 2"'))]
    cru(k, canto, pts=[(x0 + X + B, y0 - B, 0)])
    return c.render()

def M04_3():
    """sistemas lineares: tres planos de vidro que se cortam num unico ponto (a solucao do sistema 3 x 3)"""
    c = Cena(-30, 40)
    R = transf(math.radians(-15), (0, 0, 1.3), pitch=math.radians(4))
    s = 1.25
    cores = ['#3f72b8', '#4f9a6a', '#e3a33b']
    for k in range(3):
        a, b = [(1, 2), (0, 2), (0, 1)][k]
        for sa in (-1, 1):
            for sb in (-1, 1):
                def P(u, v, a=a, b=b, k=k):
                    p = [0, 0, 0]; p[a] = u; p[b] = v; return R(*p)
                quad = [P(0, 0), P(sa * s, 0), P(sa * s, sb * s), P(0, sb * s)]
                o = c.add(Obj(sombra=False))
                o.face(quad, cores[k], opac=.45, contorno=mix(cores[k], '#000000', .35), sw=.8, dupla=True, amb=.55)
    # 30/10 (Vitor): sem sombra no chao -- os planos flutuam e o casco cinza embaixo nao correspondia a nada
    lin_ = c.add(Obj(sombra=False)); lin_.prof = -1e6
    def retas(cam):
        out = []
        for k in range(3):
            p = [0, 0, 0]; p[k] = s; q = [0, 0, 0]; q[k] = -s
            out.append((0, lin(cam, R(*q), R(*p), '#1f2430', 1.1, op=.8)))
        return out
    cru(lin_, retas)
    pt = c.add(Obj(sombra=False)); pt.prof = -2e6; pt.esfera(R(0, 0, 0), .13, '#d6453d')
    return c.render()

def M04_4():
    """inequacoes: reta numerica de madeira com bolinha cheia em 2 e barra vermelha seguindo para a direita (x >= 2)"""
    c = Cena(-20, 50)
    u = .5; e = .14
    rg = c.add(Obj()); caixa_chanfro(rg, -1.6 * u, 5.7 * u, -.5, .5, 0, e, .04, '#e8cf9f', amb=.5, brilho=.2)
    def marcas(cam):
        out = []
        for i in range(-1, 6):
            out.append(lin(cam, (i * u, -.5 + .03, e + .001), (i * u, -.5 + .22, e + .001), '#5a4426', 1, cap='butt'))
            out.append(texto(cam, str(i).replace('-', '−'), I, i * u, -.5 + .36, e + .002, .22, '#3b2c16', SANS_B))
        return [(0, s) for s in out]
    cru(rg, marcas)
    bar = c.add(Obj(sombra=False)); bar.prof = -100
    cilindro_liso(bar, (2 * u, .15, e + .1), (3.0 * u, 0, 0), .085, cor='#d9473c', brilho=.45)
    cilindro_liso(bar, (5.0 * u, .15, e + .1), (.55 * u, 0, 0), .19, 0, cor='#d9473c', brilho=.45)
    b = c.add(Obj(sombra=False)); b.prof = -200; b.esfera((2 * u, .15, e + .1), .18, '#c0302a')
    return c.render()

def M04_5():
    """modelagem algebrica: caixa de papelao aberta feita cortando quadrados de lado x dos cantos de uma folha"""
    c = Cena(-28, 40)
    L = 2.2; x = .55; t = .04; base = L - 2 * x
    h0 = -base / 2; h1 = base / 2
    cor_f, cor_d = '#c8955a', '#a8773f'
    # paredes (de tras primeiro), fundo
    fundo = c.add(Obj()); fundo.prof = 50; caixa(fundo, h0, h1, h0, h1, 0, t, cor_d)
    pt = c.add(Obj(sombra=False)); pt.prof = 40; caixa(pt, h0, h1, h1 - t, h1, 0, x, cor_f, amb=.4)
    pe = c.add(Obj(sombra=False)); pe.prof = 40; caixa(pe, h0, h0 + t, h0, h1, 0, x, cor_f, amb=.4)
    pd = c.add(Obj(sombra=False)); pd.prof = 10; caixa(pd, h1 - t, h1, h0, h1, 0, x, cor_f, amb=.4)
    pf = c.add(Obj(sombra=False)); pf.prof = 0; caixa(pf, h0, h1, h0, h0 + t, 0, x, cor_f, amb=.4)
    sh = c.add(Obj()); sh.prof = 1e9; caixa(sh, h0, h1, h0, h1, 0, x, '#ffffff', opac=0)
    cota = c.add(Obj(sombra=False)); cota.prof = -1e3
    def cotas(cam):
        out = []
        # altura x (aresta da frente-direita)
        a, b = (h1 + .12, h0 - .12, 0), (h1 + .12, h0 - .12, x)
        out.append(lin(cam, a, b, '#2b2f3a', 1)); out.append(lin(cam, (a[0] - .05, a[1], 0), (a[0] + .05, a[1], 0), '#2b2f3a', 1)); out.append(lin(cam, (b[0] - .05, b[1], x), (b[0] + .05, b[1], x), '#2b2f3a', 1))
        out.append(texto(cam, 'x', I, h1 + .3, h0 - .3, x / 2, .3, '#d9473c', SERIF_I, (1, 0, 0), (0, 0, 1)))
        # base L - 2x na aresta da frente
        a, b = (h0, h0 - .2, 0), (h1, h0 - .2, 0)
        out.append(lin(cam, a, b, '#2b2f3a', 1))
        for p in (a, b): out.append(lin(cam, (p[0], p[1] - .05, 0), (p[0], p[1] + .05, 0), '#2b2f3a', 1))
        out.append(texto(cam, '10 − 2x', I, 0, h0 - .4, 0, .2, '#2b2f3a', SERIF_I))
        return [(0, s) for s in out]
    cru(cota, cotas, pts=[(h1 + .4, h0 - .5, 0), (h0, h0 - .6, 0)])
    return c.render()

# =============================================================== M05 Funcoes (modulo: papel milimetrado com parabola e reta)
def M05_1():
    """funcao afim: quadro-negro com a reta y = 2x + 1 (coeficiente linear 1 marcado no eixo y) e giz na canaleta"""
    c = Cena(-20, 16)
    W, H, e, b = 2.6, 1.9, .1, .12
    M = transf(0, (0, 0, .25), roll=math.radians(78))
    o = c.add(Obj())
    caixaM(o, M, -W / 2, W / 2, 0, H, -e, 0, '#8a5a32', amb=.4)                        # moldura
    caixaM(o, M, -W / 2 + b, W / 2 - b, b, H - b, -e * .4, .01, '#2f4a3c', amb=.5, ordem=1)   # lousa
    # canaleta e pernas
    caixa(o, -W / 2, W / 2, -.32, .02, .14, .25, '#8a5a32', amb=.4)
    for x in (-W / 2 + .2, W / 2 - .2):
        caixa(o, x - .07, x + .07, -.05, .09, 0, .25, '#74492a')
    O = (-.45, .55); un = .3
    def Q(x, y): return M(O[0] + x * un, O[1] + y * un, .02)
    def giz(cam):
        out = []
        gz = '#e9efe9'
        out.append(pl(cam, [Q(-2.1, 0), Q(5.3, 0)], gz, 1.5, op=.85)); out.append(pl(cam, [Q(0, -1.4), Q(0, 4.0)], gz, 1.5, op=.85))
        for x, y, dx, dy in ((5.3, 0, -.25, .15), (5.3, 0, -.25, -.15), (0, 4.0, -.15, -.25), (0, 4.0, .15, -.25)):
            out.append(pl(cam, [Q(x, y), Q(x + dx, y + dy)], gz, 1.3, op=.85))
        for i in range(-2, 6):
            if i: out.append(pl(cam, [Q(i, -.1), Q(i, .1)], gz, 1, op=.7))
        for j in range(-1, 4):
            if j: out.append(pl(cam, [Q(-.1, j), Q(.1, j)], gz, 1, op=.7))
        xs = np.linspace(-1.2, 1.45, 12)
        out.append(pl(cam, [Q(x, 2 * x + 1) for x in xs], '#f3d36b', 2.4, op=.95))
        out.append(texto(cam, 'y = 2x + 1', M, O[0] + 2.85 * un, O[1] + 2.9 * un, .025, .26, '#f6f6ee', SANS, (1, 0, 0), (0, 1, 0), op=.9))
        p = Q(0, 1); out.append(poli(cam, [(p[0] + .05 * math.cos(t), p[1], p[2] + .05 * math.sin(t)) for t in np.linspace(0, 2 * math.pi, 14)], '#f3d36b'))
        return [(0, s) for s in out]
    cru(o, giz, ordem=4)
    gz = c.add(Obj(sombra=False)); gz.prof = -1e3
    cilindro_liso(gz, (.55, -.16, .3), (.42, -.05, 0), .045, cor='#f4f2ea', brilho=.4, amb=.55)
    return c.render()

def M05_2():
    """funcao quadratica e vertice: foto estroboscopica de uma bola lancada - posicoes em tempos iguais sobre a parabola, eixo de simetria no vertice"""
    c = Cena(-14, 14)
    vx, vz, g = .5, 2.0, 1.0       # x = vx t ; z = vz t - g t^2 / 2  -> vertice em t = 2 (z = 2)
    ts = np.linspace(0, 4, 9); r = .17
    c.defs.append(G.esfera_real('bola', '#e8762d').replace('@K@', ''))
    pts = [(-2.0 + vx * 2 * t, 0, r + vz * t - g * t * t / 2) for t in ts]
    b = c.add(Obj(sombra=False)); b.prof = -1e3
    def fn(cam):
        out = []
        V = pts[4]; base = (V[0], 0, 0)
        out.append((0, f'<path d="M{fmt(cam.P(*base)[0])} {fmt(cam.P(*base)[1])} L{fmt(cam.P(*V)[0])} {fmt(cam.P(*V)[1])}" stroke="#2b2f3a" stroke-width="1" stroke-dasharray="3 2.5"/>'))
        tt = np.linspace(0, 4, 60)
        out.append((0, pl(cam, [(-2.0 + vx * 2 * t, 0, r + vz * t - g * t * t / 2) for t in tt], '#e8762d', .8, op=.5)))
        for i, p in enumerate(pts):
            sh = cam.P(*no_chao(p, 0)); x, y = cam.P(*p); R = r * cam.k
            out.append((0, f'<ellipse cx="{fmt(sh[0])}" cy="{fmt(sh[1])}" rx="{fmt(R*.9)}" ry="{fmt(R*.3)}" fill="#1b1d2a" opacity=".12"/>'))
            op = 1 if i in (4, 8) else .55
            fill = 'url(#bola)'
            out.append((0, f'<circle cx="{fmt(x)}" cy="{fmt(y)}" r="{fmt(R)}" fill="{fill}" opacity="{op}"/>'))
        return out
    cru(b, fn, pts=pts + [(-2.0, 0, 2.4)])
    v = c.add(Obj(sombra=False)); v.prof = -2e3
    def vtx(cam):
        x, y = cam.P(*pts[4]); R = r * cam.k
        return [(0, f'<circle cx="{fmt(x)}" cy="{fmt(y)}" r="{fmt(R*1.45)}" fill="none" stroke="#2f6fd0" stroke-width="1.4"/>')]
    cru(v, vtx)
    return c.render()

def M05_3():
    """leitura de graficos: tablet com uma curva e a leitura de um ponto (tracejados ate os eixos)"""
    c = Cena(-22, 48)
    W, D, e = 2.5, 1.75, .09
    M = transf(math.radians(-8), (0, 0, 0))
    o = c.add(Obj()); caixaM(o, M, -W / 2, W / 2, -D / 2, D / 2, 0, e, '#23262d', b=.05, amb=.45, brilho=.3)
    sx0, sx1, sy0, sy1 = -W / 2 + .13, W / 2 - .13, -D / 2 + .13, D / 2 - .13
    f = lambda x: .9 + .55 * math.sin(.9 * x - .4) + .18 * x
    O = (sx0 + .25, sy0 + .22); ux, uy = .33, .33
    def Q(x, y, d=0): return M(O[0] + x * ux, O[1] + y * uy, e + .002 + d)
    def tela(cam):
        out = [poli(cam, [M(sx0, sy0, e + .001), M(sx1, sy0, e + .001), M(sx1, sy1, e + .001), M(sx0, sy1, e + .001)], '#fbfcfe')]
        for i in range(1, 7):
            out.append(lin(cam, Q(i, 0), Q(i, 3.6), '#dfe6ee', .5, cap='butt'))
        for j in range(1, 4):
            out.append(lin(cam, Q(0, j), Q(6.4, j), '#dfe6ee', .5, cap='butt'))
        out.append(lin(cam, Q(0, 0), Q(6.5, 0), '#39404c', 1.1)); out.append(lin(cam, Q(0, 0), Q(0, 3.7), '#39404c', 1.1))
        xs = np.linspace(0, 6.3, 60)
        out.append(pl(cam, [Q(x, f(x), .001) for x in xs], '#2f6fd0', 2.2))
        x0 = 4.0; y0 = f(x0)
        out.append(f'<path d="M{fmt(cam.P(*Q(x0, 0))[0])} {fmt(cam.P(*Q(x0, 0))[1])} L{fmt(cam.P(*Q(x0, y0))[0])} {fmt(cam.P(*Q(x0, y0))[1])} L{fmt(cam.P(*Q(0, y0))[0])} {fmt(cam.P(*Q(0, y0))[1])}" fill="none" stroke="#d9473c" stroke-width="1.1" stroke-dasharray="3 2"/>')
        p = Q(x0, y0, .002); out.append(poli(cam, [M(O[0] + x0 * ux + .07 * math.cos(t), O[1] + y0 * uy + .07 * math.sin(t), e + .005) for t in np.linspace(0, 2 * math.pi, 16)], '#d9473c'))
        # reflexo do vidro
        out.append(poli(cam, [M(sx0, sy1, e + .006), M(sx0 + .7, sy1, e + .006), M(sx0, sy1 - .55, e + .006)], '#ffffff', ' opacity=".35"'))
        return [(0, s) for s in out]
    cru(o, tela, ordem=4)
    return c.render()

def M05_4():
    """funcao modular: metro dobravel de carpinteiro aberto em V sobre os eixos, formando y = |x|"""
    c = Cena(0, 58)
    un = .5
    pap = c.add(Obj()); caixa(pap, -2.6 * un, 2.6 * un, -.6 * un, 3.0 * un, -.03, 0, '#fbfbf8', amb=.85)
    def eixos(cam):
        out = [lin(cam, (-2.5 * un, 0, .001), (2.5 * un, 0, .001), '#39404c', 1.2), lin(cam, (0, -.5 * un, .001), (0, 2.9 * un, .001), '#39404c', 1.2)]
        for i in (-2, -1, 1, 2):
            out.append(lin(cam, (i * un, -.08, .001), (i * un, .08, .001), '#39404c', .8, cap='butt'))
            if i > 0: out.append(lin(cam, (-.08, i * un, .001), (.08, i * un, .001), '#39404c', .8, cap='butt'))
        return [(0, s) for s in out]
    cru(pap, eixos)
    larg, esp = .17, .05
    for sgn in (-1, 1):
        ang = math.radians(45 if sgn > 0 else 135)
        d = np.array((math.cos(ang), math.sin(ang), 0)); n = np.array((-d[1], d[0], 0))
        L = 2.6 * un * math.sqrt(2) / 2
        for k in range(2):
            a = d * (k * L) + np.array((0, 0, .002 + k * esp)); b = d * ((k + 1) * L) + np.array((0, 0, .002 + k * esp))
            o = c.add(Obj()); o.prof = -k * 10 - (sgn + 1)
            P = [tuple(p + nn * larg / 2 * sg + np.array((0, 0, zz))) for p in (a, b) for sg in (-1, 1) for zz in (0, esp) for nn in (n,)]
            solido_convexo(o, P, '#f1c232', amb=.45, brilho=.25)
            def marcas(cam, a=a, d=d, n=n, k=k):
                out = []
                for i in range(1, 20):
                    t = i * L / 20; L2 = larg * (.45 if i % 5 == 0 else .25)
                    p = a + d * t + np.array((0, 0, esp + .001)) + n * larg / 2
                    out.append((0, lin(cam, tuple(p), tuple(p - n * L2), '#2b2b2b', .55, cap='butt')))
                q = a + d * (L * .5) + np.array((0, 0, esp + .001)) - n * larg * .2
                out.append((0, texto(cam, str(k * 20 + 10), I, q[0], q[1], q[2], .1, '#c0302a', SANS_B, tuple(d), tuple(n))))
                pv = a + np.array((0, 0, esp + .002))
                out.append((0, poli(cam, [tuple(pv + .04 * (math.cos(t) * d + math.sin(t) * n)) for t in np.linspace(0, 2 * math.pi, 12)], '#8d949e')))
                return out
            cru(o, marcas)
    return c.render()

def M05_5():
    """composicao e inversa: espelho sobre a reta y = x refletindo y = 2^x em y = log2(x)"""
    c = Cena(-6, 52)
    un = .36; A0, A1 = -2.4, 4.3
    pap = c.add(Obj()); caixa(pap, A0 * un, A1 * un, A0 * un, A1 * un, -.04, 0, '#fbfbf8', amb=.85)
    def grade(cam):
        out = []
        for i in range(-2, 5):
            out.append(lin(cam, (i * un, A0 * un, .001), (i * un, A1 * un, .001), '#e3e8ee', .5, cap='butt'))
            out.append(lin(cam, (A0 * un, i * un, .001), (A1 * un, i * un, .001), '#e3e8ee', .5, cap='butt'))
        out.append(lin(cam, (A0 * un, 0, .002), (A1 * un, 0, .002), '#39404c', 1.1)); out.append(lin(cam, (0, A0 * un, .002), (0, A1 * un, .002), '#39404c', 1.1))
        xs = np.linspace(-2.25, 2.0, 50)
        out.append(pl(cam, [(x * un, 2 ** x * un, .004) for x in xs], '#2f6fd0', 2.2))
        out.append(pl(cam, [(2 ** x * un, x * un, .004) for x in xs], '#d9473c', 2.2))
        for x in (-1, 1, 2):     # pares (x, 2^x) e (2^x, x): simetricos em relacao a y = x
            P1, P2 = (x * un, 2 ** x * un, .005), (2 ** x * un, x * un, .005)
            out.append(f'<path d="M{fmt(cam.P(*P1)[0])} {fmt(cam.P(*P1)[1])} L{fmt(cam.P(*P2)[0])} {fmt(cam.P(*P2)[1])}" stroke="#6b7480" stroke-width=".8" stroke-dasharray="2 2"/>')
            for P_, cc in ((P1, '#2f6fd0'), (P2, '#d9473c')):
                out.append(poli(cam, [(P_[0] + .06 * math.cos(t), P_[1] + .06 * math.sin(t), .006) for t in np.linspace(0, 2 * math.pi, 14)], cc))
        return [(0, s) for s in out]
    cru(pap, grade)
    # espelho em pe ao longo de y = x
    m = c.add(Obj(sombra=False)); m.prof = -1e3
    a = (A0 * un * .95, A0 * un * .95); b = (A1 * un * .97, A1 * un * .97); h = .42
    m.face([(a[0], a[1], 0), (b[0], b[1], 0), (b[0], b[1], h), (a[0], a[1], h)], '#bcd3e3', opac=.35, contorno='#8aa4b6', sw=.6, dupla=True, amb=.7, brilho=.4)
    def borda(cam):
        out = [lin(cam, (a[0], a[1], h), (b[0], b[1], h), '#e9f2f8', 1.6), lin(cam, (a[0], a[1], 0), (b[0], b[1], 0), '#7f96a8', 1.2)]
        for t in (.25, .32):
            p = (a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t)
            out.append(lin(cam, (p[0], p[1], h * .15), (p[0] + .35, p[1] + .35, h * .85), '#ffffff', 1.4 if t == .25 else .7, op=.6))
        return [(0, s) for s in out]
    cru(m, borda, ordem=5)
    sh = c.add(Obj()); sh.prof = 1e9; caixa(sh, A0 * un, A1 * un, A0 * un, A1 * un, 0, .04, '#ffffff', opac=0)
    return c.render()

# =============================================================== M06 Exponencial e logaritmo (modulo: nautilo)
def M06_1():
    """funcao exponencial: tabuleiro de xadrez com 1, 2, 4 e 8 pecas empilhadas nas casas seguidas (a lenda dos graos)"""
    c = Cena(-26, 36)
    q = .62; n = 4
    tab = c.add(Obj()); tab.prof = 1e3; caixa_chanfro(tab, -n * q / 2 - .08, n * q / 2 + .08, -n * q / 2 - .08, n * q / 2 + .08, 0, .14, .03, '#6b4a2f', amb=.45)
    def casas(cam):
        out = []
        for i in range(n):
            for j in range(n):
                x0, y0 = -n * q / 2 + i * q, -n * q / 2 + j * q
                cor = '#f0dcb4' if (i + j) % 2 else '#8a5a35'
                out.append(poli(cam, [(x0, y0, .141), (x0 + q, y0, .141), (x0 + q, y0 + q, .141), (x0, y0 + q, .141)], cor))
        return [(0, s) for s in out]
    cru(tab, casas)
    e = .1
    for i, k in enumerate((1, 2, 4, 8)):
        x = -n * q / 2 + i * q + q / 2; y = -n * q / 2 + q / 2
        o = c.add(Obj()); o.prof = -10 * i
        for m in range(k):
            cilindro_liso(o, (x, y, .14 + m * e), (0, 0, e * .92), .22, cor='#d8dbe2' if i % 2 else '#2c2f36', brilho=.45, amb=.4, ordem=2 + m)
    return c.render()

def M06_2():
    """equacao exponencial: gangorra em equilibrio - o bloco 2^x de um lado e 8 cubinhos (um cubo 2 x 2 x 2) do outro: 2^x = 8 = 2^3, x = 3
    (correcao da revisao de 29/10: antes eram celulas 1 -> 2 -> 4 -> 8, a mesma sequencia do M06.1 e a do M06.5 invertida)"""
    c = Cena(-24, 20)
    madeira, escura = '#e8c993', '#b8874f'
    f = c.add(Obj()); f.prof = 50
    solido_convexo(f, [(-.42, -.32, 0), (.42, -.32, 0), (-.42, .32, 0), (.42, .32, 0), (0, -.32, .78), (0, .32, .78)], escura, amb=.45, brilho=.15)
    tb = c.add(Obj()); tb.prof = 40
    caixa_chanfro(tb, -2.3, 2.3, -.45, .45, .78, .92, .03, madeira, amb=.45, brilho=.2)
    z0 = .92
    # bloco 2^x (azul) a esquerda
    L = 1.0; h = L / 2; M = transf(math.radians(4), (-1.5, 0, z0))
    b = c.add(Obj()); b.prof = 10
    caixaM(b, M, -h, h, -h, h, 0, L, '#3f72b8', b=.06 * L, amb=.45, brilho=.25)
    def letra(cam):
        return [(0, texto(cam, '2ˣ', M, 0, -h - .002, h, .62, '#ffffff', SERIF_I, (1, 0, 0), (0, 0, 1)))]
    cru(b, letra)
    # cubo 2 x 2 x 2 de cubinhos laranja a direita (8 = 2^3)
    a = .46; ordem = 0
    for kz in (0, 1):
        for ky in (1, 0):
            for kx in (0, 1):
                o = c.add(Obj()); o.prof = -ordem; ordem += 1
                x0 = 1.08 + kx * a; y0 = -a + ky * a; zz = z0 + kz * a
                caixa_chanfro(o, x0 + .012, x0 + a - .012, y0 + .012, y0 + a - .012, zz + .006, zz + a - .006, .035,
                              ('#e8913a', '#f0a24e')[(kx + ky + kz) % 2], amb=.45, brilho=.25)
    return c.render()

def M06_3():
    """definicao e propriedades do logaritmo: regua de calculo (escalas logaritmicas) multiplicando 2 x 3 = 6 por log 2 + log 3 = log 6"""
    c = Cena(-24, 62)
    L = 3.2; w = .4; e = .1
    M = transf(math.radians(58), (0, 0, 0))
    o = c.add(Obj())
    caixaM(o, M, -.15, L + .15, -w * 1.5, -w * .5, 0, e, '#efe2bf', amb=.6, brilho=.15)     # regua fixa de baixo (D)
    caixaM(o, M, -.15, L + .15, w * .5, w * 1.5, 0, e, '#efe2bf', amb=.6, brilho=.15)       # regua fixa de cima
    d = L * math.log10(2)
    caixaM(o, M, d - .1, d + L + .1, -w * .5, w * .5, 0, e * .95, '#fbf8ef', amb=.6, brilho=.15)   # lingueta (C), deslocada de log 2
    for x0 in (-.3, L + .15):     # presilhas de metal nas pontas
        caixaM(o, M, x0, x0 + .15, -w * 1.55, w * 1.55, -.01, e + .03, '#9aa2ad', amb=.45, brilho=.5)
    def esc(cam):
        out = []
        for base, y, desce in ((0, -w * .5, True), (d, -w * .5, False)):
            for k in range(10, 101):
                v = k / 10; x = base + L * math.log10(v)
                if k % 10 == 0: Lt, ww = .14, .7
                elif k % 5 == 0 and v < 5: Lt, ww = .1, .5
                elif v < 4 or k % 2 == 0: Lt, ww = .06, .35
                else: continue
                a = M(x, y, e + .002); b = M(x, y - Lt if desce else y + Lt, e + .002)
                out.append(lin(cam, a, b, '#20242c', ww, cap='butt'))
            for k in range(1, 11):
                x = base + L * math.log10(k); yy = y - .22 if desce else y + .22
                if k < 10 or base == 0:
                    out.append(texto(cam, str(k if k < 10 else 1), M, x, yy, e + .002, .15, '#20242c', SANS_B))
        return [(0, s) for s in out]
    cru(o, esc, ordem=4)
    cur = c.add(Obj(sombra=False)); cur.prof = -100
    xc = d + L * math.log10(3)
    cur.face([M(xc - .14, -w * 1.6, e + .03), M(xc + .14, -w * 1.6, e + .03), M(xc + .14, w * 1.6, e + .03), M(xc - .14, w * 1.6, e + .03)], '#cfe3f0', opac=.35, contorno='#7f96a8', sw=.6)
    def fio(cam):
        return [(0, lin(cam, M(xc, -w * 1.6, e + .032), M(xc, w * 1.6, e + .032), '#d23a32', .9))]
    cru(cur, fio, ordem=5)
    return c.render()

def M06_4():
    """equacao logaritmica: decibelimetro (o nivel sonoro em dB e 10 log da razao de intensidades)"""
    c = Cena(-24, 14)
    M = transf(math.radians(-8), (0, 0, 0), roll=math.radians(84))
    pts = [(-.42, 0), (.42, 0), (.48, 1.1), (.55, 1.9), (.4, 2.15), (-.4, 2.15), (-.55, 1.9), (-.48, 1.1)]
    o = c.add(Obj())
    extrusao(o, pts, -.12, .12, '#2c3038', '#1d2026', M=M, brilho=.3, amb=.4)
    def tela(cam):
        out = []
        z = .121
        out.append(poli(cam, [M(-.36, 1.25, z), M(.36, 1.25, z), M(.38, 1.85, z), M(-.38, 1.85, z)], '#1a1c20'))
        out.append(poli(cam, [M(-.31, 1.3, z + .001), M(.31, 1.3, z + .001), M(.33, 1.8, z + .001), M(-.33, 1.8, z + .001)], '#b9c7a6'))
        out.append(texto(cam, '80', M, -.06, 1.55, z + .002, .3, '#1f2a1e', MONO_B, (1, 0, 0), (0, 1, 0)))
        out.append(texto(cam, 'dB', M, .23, 1.42, z + .002, .1, '#1f2a1e', SANS_B, (1, 0, 0), (0, 1, 0)))
        for i, (x, y, cor) in enumerate([(-.2, .85, '#d9473c'), (.2, .85, '#e9ecef'), (-.2, .55, '#e9ecef'), (.2, .55, '#e9ecef')]):
            out.append(poli(cam, [M(x + .1 * math.cos(t), y + .1 * math.sin(t), z + .001) for t in np.linspace(0, 2 * math.pi, 16)], cor))
        return [(0, s) for s in out]
    cru(o, tela, ordem=4)
    cilindro_liso(o, M(0, 2.15, 0), tuple(np.array(M(0, 2.6, 0)) - np.array(M(0, 2.15, 0))), .09, cor='#9aa2ad', brilho=.6, ordem=1)
    mic = c.add(Obj(sombra=False)); mic.prof = -10; mic.esfera(M(0, 2.78, 0), .3, '#3a3d44', reflexo=False)
    return c.render()

def M06_5():
    """meia-vida: tubos de ensaio com 100%, 50%, 25% e 12,5% da substancia (cada meia-vida reduz a metade)"""
    c = Cena(-18, 20)
    h = 1.6; r = .2; base = h * .86
    rack = c.add(Obj()); rack.prof = 100
    caixa_chanfro(rack, -1.15, 1.15, -.3, .3, 0, .12, .03, '#b9864f', amb=.45)
    caixa(rack, -1.15, -1.03, -.06, .06, .12, 1.0, '#a8763f'); caixa(rack, 1.03, 1.15, -.06, .06, .12, 1.0, '#a8763f')
    for i in range(4):
        x = -.78 + i * .52
        vidro_cilindro(c, x, 0, .12, r, h, nivel=base / 2 ** i, cor_liq='#56b847', marcas=0, prof=50 - i)
    tr = c.add(Obj(sombra=False)); tr.prof = -100
    caixa_chanfro(tr, -1.15, 1.15, -.3, .3, .9, 1.0, .02, '#c99560', amb=.45)
    def furos(cam):
        out = []
        for i in range(4):
            x = -.78 + i * .52
            out.append((0, poli(cam, [(x + (r + .02) * math.cos(t), (r + .02) * math.sin(t), 1.001) for t in np.linspace(0, 2 * math.pi, 24)], '#6b4626')))
        return out
    cru(tr, furos)
    return c.render()

TODOS = {}
for _k, _v in list(globals().items()):
    if _k[:1] == 'M' and _k[1:3].isdigit() and '_' in _k: TODOS[_k.replace('_', '.')] = _v

if __name__ == '__main__':
    import sys
    alvo = sys.argv[1:] or list(TODOS)
    for k in alvo:
        r = TODOS[k]()
        grava_sub(k, r)

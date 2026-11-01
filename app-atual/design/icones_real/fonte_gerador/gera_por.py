# -*- coding: utf-8 -*-
"""Portugues: objetos do mundo da leitura e da escrita, mesma camera/luz do conjunto."""
from util import *
from gera_mat2 import texto_no_plano, SANS_B, SERIF_I
SERIF_B = '/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf'
AZ, EL = -24, 34

def sombra_casco(cam, pts3, z0=0.0, op=.28, blur=2.4, fid='fsp'):
    P = np.array([cam.P(*no_chao(p, z0)) for p in pts3]); h = ConvexHull(P)
    return (f'<filter id="{fid}" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="{blur}"/></filter>'
            f'<path d="{caminho(P[h.vertices])}" fill="#1b1d2a" opacity="{op}" filter="url(#{fid})"/>')

# ---------------------------------------------------------------- P01 Leitura e compreensao: livro aberto (modelo aprovado)
def P01():
    mundo0 = []
    W, H = 1.0, 1.32
    pts = [(x, y, z) for x in (-1.1, 1.1) for y in (-.75, .75) for z in (0, .35)]
    cam = G.Cam(-18, 50, pts + [no_chao(p) for p in pts], 180, 180, 100, 100)
    mundo = []
    base = G.livro_fechado(cam, 0, 0, 0, 2.3, 1.55, .16, math.radians(0), '#7a2e2e', mundo)
    corpo = G.livro_aberto(cam, 0, 0, .16, W, H, math.radians(0), mundo)
    s = sombra_casco(cam, mundo + [(x, y, 0) for x in (-1.15, 1.15) for y in (-.78, .78)])
    return s + base + corpo

# ---------------------------------------------------------------- P02 Argumentacao: martelo de juiz e base
def P02():   # 30/10: o icone publicado (balões SIM x NÃO) vem de gera_3010.py; este martelo ficou só como histórico
    c = Cena(AZ, 26)
    b = c.add(Obj()); cilindro_liso(b, (.25, .1, 0), (0, 0, .22), .95, .88, cor='#6b3a20', amb=.4, brilho=.3)
    def anel(cam):
        return [(0, poli(cam, circ3((.25, .1, .222), (1, 0, 0), (0, 1, 0), .62, 48), 'none', ' stroke="#4b2614" stroke-width="1" opacity=".7"'))]
    anel.ordem = 3; b.cru.append((anel, []))
    g = c.add(Obj()); g.prof = -1e6
    # posicao natural de uso (correcao pedida pelo Vitor em 29/10): a cabeca bate de pe na base, com a face de
    # golpe encostada no bloco, e o cabo sai do meio da cabeca inclinado para cima, na direcao da mao (frente-direita)
    a = math.radians(24)                                   # inclinacao do cabo acima da horizontal
    hdir = np.array([.97, -.26, 0.0]); hdir /= np.linalg.norm(hdir)
    d = np.array([hdir[0] * math.cos(a), hdir[1] * math.cos(a), math.sin(a)])      # eixo do cabo
    w = np.array([-hdir[0] * math.sin(a), -hdir[1] * math.sin(a), math.cos(a)])    # eixo da cabeca (perpendicular ao cabo)
    R, L = .33, 1.05
    toque = np.array([-.25, .3, .22])                       # ponto mais baixo da borda da face de golpe, apoiado no bloco
    c0 = toque + d * R                                     # centro da face de golpe (a face sobe na direcao do cabo)
    hc = c0 + w * L / 2
    cilindro_liso(g, c0, w * L, R, cor='#7a4224', brilho=.35, amb=.35, ordem=0)
    for t in (.12, .78):
        cilindro_liso(g, c0 + w * L * t, w * .1, R * 1.035, cor='#c9a24a', brilho=.55, amb=.4, ordem=1)
    cab0 = hc + d * R * .8; vet = d * 1.75
    cilindro_liso(g, cab0, vet, .085, .11, cor='#7a4224', brilho=.4, ordem=2)
    cilindro_liso(g, cab0 + vet, d * .14, .11, .1, cor='#5b2f18', brilho=.3, ordem=3)
    return c.render()

# ---------------------------------------------------------------- P03 Generos e tipos textuais: jornal dobrado sobre uma carta
def P03():
    c = Cena(AZ, 50)
    # envelope
    Me = transf(math.radians(-14), (.55, .35, 0))
    e = c.add(Obj()); solido_convexo(e, [Me(x, y, z) for x in (-.95, .95) for y in (-.62, .62) for z in (0, .03)], '#efe3c8', amb=.7)
    def env(cam):
        z = .031; out = []
        out.append((0, poli(cam, [Me(-.95, .62, z), Me(0, -.05, z), Me(.95, .62, z)], 'none', ' stroke="#c9b48a" stroke-width=".9" stroke-linejoin="round"')))
        out.append((0, poli(cam, [Me(.55, .22, z), Me(.82, .22, z), Me(.82, .5, z), Me(.55, .5, z)], '#c8473d')))
        out.append((0, poli(cam, [Me(.6, .27, z + .001), Me(.77, .27, z + .001), Me(.77, .45, z + .001), Me(.6, .45, z + .001)], '#e9c16a')))
        return out
    env.ordem = 3; e.cru.append((env, []))
    # jornal
    Mj = transf(math.radians(9), (-.3, -.2, .04))
    j = c.add(Obj()); j.prof = -1e6
    W, D = 1.05, 1.35
    solido_convexo(j, [Mj(x, y, z) for x in (-W, W) for y in (-D, D) for z in (0, .06)], '#f1efe8', amb=.75)
    def jornal(cam):
        z = .061; out = []
        P = lambda x, y: Mj(x, y, z)
        out.append((0, poli(cam, [P(-W + .1, D - .1), P(W - .1, D - .1), P(W - .1, D - .34), P(-W + .1, D - .34)], '#2b2d33')))   # manchete
        out.append((0, poli(cam, [P(-W + .1, D - .45), P(.05, D - .45), P(.05, D - 1.05), P(-W + .1, D - 1.05)], '#8a96a8')))     # foto
        out.append((0, poli(cam, [P(-W + .2, D - .9), P(-.45, D - .62), P(-.2, D - .8), P(.05, D - .6), P(.05, D - 1.05), P(-W + .1, D - 1.05)], '#5e6a7c')))
        for k in range(7):
            y = D - .5 - k * .085
            out.append((0, lin(cam, P(.18, y), P(W - .12, y), '#9a9ca3', 1.0, cap='butt')))
        for col in (0, 1, 2):
            x0 = -W + .1 + col * (2 * W - .2) / 3
            for k in range(6):
                y = D - 1.2 - k * .09
                if y < -D + .1: break
                out.append((0, lin(cam, P(x0, y), P(x0 + (2 * W - .2) / 3 - .1, y), '#a3a5ab', 1.0, cap='butt')))
        out.append((0, lin(cam, P(-W, 0), P(W, 0), '#c9c6bb', .9, cap='butt')))     # dobra
        return out
    jornal.ordem = 3; j.cru.append((jornal, []))
    return c.render()

# ---------------------------------------------------------------- P04 Coesao e coerencia: corrente de elos de metal
def elo(c, centro, eixo_comp, normal_plano, L=1.0, R=.32, r=.085, cor='#a9b2bd', n=90):
    cc = np.array(centro, float); a = np.array(eixo_comp, float); a /= np.linalg.norm(a)
    nn = np.array(normal_plano, float); nn /= np.linalg.norm(nn); bv = np.cross(nn, a)
    pts = []
    meio = (L - 2 * R) / 2
    per = 2 * (2 * meio) + 2 * math.pi * R
    for i in range(n):
        s = per * i / n
        if s < 2 * meio: p = (-meio + s) * a - R * bv
        elif s < 2 * meio + math.pi * R:
            t = -math.pi / 2 + (s - 2 * meio) / R; p = meio * a + R * (math.cos(t) * a + math.sin(t) * bv)
        elif s < 4 * meio + math.pi * R:
            p = (meio - (s - 2 * meio - math.pi * R)) * a + R * bv
        else:
            t = math.pi / 2 + (s - 4 * meio - math.pi * R) / R; p = -meio * a + R * (math.cos(t) * a + math.sin(t) * bv)
        pts.append(tuple(cc + p))
    o = c.add(Obj()); o.extra_pts += pts
    def fn(cam, pts=pts):
        out = []
        rpx = r * cam.k
        P = pts + [pts[0]]
        for i in range(len(pts)):
            a_, b_ = np.array(P[i]), np.array(P[i + 1]); d = b_ - a_; a2 = a_ - d * .25; b2 = b_ + d * .25
            m = (a_ + b_) / 2; dd = d / (np.linalg.norm(d) or 1)
            Lp = -np.array(G.LUZ); Lp = Lp / np.linalg.norm(Lp); perp = Lp - (Lp @ dd) * dd
            # normal "de fora" do tubo neste ponto aproximada pela direcao do centro do elo para o ponto
            radial = m - cc; radial = radial / (np.linalg.norm(radial) or 1)
            l = .35 + .65 * max(0, radial @ Lp * .5 + .5 * np.linalg.norm(perp))
            corpo = mix(mix(cor, '#000000', .45), mix(cor, '#ffffff', .15), l)
            out.append((cam.D(*m) + r * .8, lin(cam, a2, b2, mix(cor, '#000000', .55), rpx * 2, cap='round')))
            s = lin(cam, a2, b2, corpo, rpx * 1.5, cap='butt')
            (x1, y1), (x2, y2) = cam.P(*a2), cam.P(*b2)
            off = rpx * .35
            s += f'<line x1="{fmt(x1-off*.4)}" y1="{fmt(y1-off)}" x2="{fmt(x2-off*.4)}" y2="{fmt(y2-off)}" stroke="#ffffff" stroke-width="{fmt(rpx*.4)}" opacity="{fmt(.25 + .6 * l)}"/>'
            out.append((cam.D(*m), s))
        return out
    o.cru.append((fn, []))
    o.prof = 0
    return o

def P04():
    c = Cena(-30, 30)
    # tres elos alternando planos (vertical / horizontal / vertical), cada um passando pelo outro
    L = 1.15; passo = .78
    elo(c, (-passo, 0, .5), (1, 0, 0), (0, 1, .25), L)
    elo(c, (0, 0, .5), (1, 0, 0), (0, .25, -1), L)
    elo(c, (passo, 0, .5), (1, 0, 0), (0, 1, -.25), L)
    # tudo num unico objeto de profundidade: os segmentos dos tres elos se intercalam corretamente
    for o in c.objs: o.prof = 0
    return c.render()

# ---------------------------------------------------------------- P05 Semantica e vocabulario: dicionario e lupa
def P05():
    pts = [(x, y, z) for x in (-1.2, 1.2) for y in (-.85, .85) for z in (0, .6)]
    cam = G.Cam(-24, 36, pts + [no_chao(p) for p in pts], 180, 180, 100, 100)
    mundo = []
    livro = G.livro_fechado(cam, 0, 0, 0, 2.2, 1.6, .55, math.radians(-6), '#24466e', mundo)
    M = transf(math.radians(-6), (0, 0, 0))
    capa = texto_path('Aa', lambda u, v: cam.P(*M(-.25 + u, .1 + v, .552)), .62, SERIF_B)
    titulo = f'<path d="{capa}" fill="#d9b45a"/>'
    # lupa deitada sobre o livro
    cx, cy, z = .45, -.15, .58
    aro = circ3((cx, cy, z + .03), (1, 0, 0), (0, 1, 0), .48, 60)
    aro_in = circ3((cx, cy, z + .03), (1, 0, 0), (0, 1, 0), .41, 60)
    lente = f'<path d="{caminho([cam.P(*p) for p in aro_in])}" fill="#cfe6f5" fill-opacity=".45"/>'
    refl = circ3((cx - .12, cy + .12, z + .04), (1, 0, 0), (0, 1, 0), .14, 24)
    lente += f'<path d="{caminho([cam.P(*p) for p in refl])}" fill="#ffffff" opacity=".55"/>'
    # o que a lupa aumenta: um pedaco do "Aa" aparece maior por baixo da lente
    aro_svg = tubo_liso(cam, aro, .045 * cam.k, '#2b2f36', fechado=True)
    cab0 = (cx + .42 * math.cos(math.radians(-40)), cy + .42 * math.sin(math.radians(-40)), z + .03)
    cab1 = (cab0[0] + .75, cab0[1] - .62, z + .03)
    cabo = (lin(cam, cab0, cab1, '#15171c', .17 * cam.k) + lin(cam, cab0, cab1, '#3a3f49', .12 * cam.k) +
            lin(cam, (cab0[0] + .05, cab0[1] - .02, cab0[2]), (cab1[0], cab1[1] + .02, cab1[2]), '#7d8594', .035 * cam.k, op=.8))
    som_lupa = sombra_casco(cam, aro + [cab1], z0=.55, op=.25, blur=1.6, fid='fsl')
    s = sombra_casco(cam, mundo)
    return s + livro + titulo + som_lupa + cabo + aro_svg + lente

# ---------------------------------------------------------------- P06 Figuras de linguagem: prisma decompondo a luz (sentido figurado: uma palavra, varios sentidos)
def P06():
    c = Cena(-26, 28)
    base = c.add(Obj()); caixa_chanfro(base, -1.7, 1.7, -1.1, 1.1, 0, .12, .03, '#2c313b', amb=.5)
    z0 = .12
    hh = 1.15; lado = 1.3
    tri = [(-lado / 2, 0), (lado / 2, 0), (0, hh)]
    M = lambda x, y, z: (x, z - .45, y + z0)   # triangulo no plano xz, extrudado ao longo de y (profundidade)
    pr = c.add(Obj(sombra=False)); pr.prof = -1e6
    extrusao(pr, tri, 0, .9, '#d8ebf5', '#b5d6ea', M=M, opac=.55, contorno='#f4fbff', sw=1.1, brilho=.4)
    # feixe branco entrando pela face esquerda e leque de cores saindo pela direita (desenhado no ar, a meia altura)
    yb = 0.0; zb = z0 + .5
    ent0 = (-1.65, yb, zb - .15); ent1 = (-.33, yb, zb + .08)
    cores = ['#e53935', '#fb8c00', '#fdd835', '#43a047', '#1e88e5', '#5e35b1']
    def luz_fn(cam):
        out = []
        a, b = cam.P(*ent0), cam.P(*ent1)
        out.append((0, f'<line x1="{fmt(a[0])}" y1="{fmt(a[1])}" x2="{fmt(b[0])}" y2="{fmt(b[1])}" stroke="#ffffff" stroke-width="3.2" stroke-linecap="round"/>'))
        s0 = cam.P(.3, yb, zb - .02)
        for i, cc in enumerate(cores):
            t0 = -.05 - i * .12; t1 = t0 - .12
            p0 = cam.P(1.7, yb, zb + t0 * 1.6 - .1); p1 = cam.P(1.7, yb, zb + t1 * 1.6 - .1)
            out.append((0, f'<path d="M{fmt(s0[0])} {fmt(s0[1])} L{fmt(p0[0])} {fmt(p0[1])} L{fmt(p1[0])} {fmt(p1[1])}Z" fill="{cc}" opacity=".92"/>'))
        # raio dentro do vidro
        out.append((0, f'<line x1="{fmt(b[0])}" y1="{fmt(b[1])}" x2="{fmt(s0[0])}" y2="{fmt(s0[1])}" stroke="#ffffff" stroke-width="2.4" opacity=".8"/>'))
        return out
    luz_fn.ordem = 3
    lo = c.add(Obj(sombra=False)); lo.prof = -2e6; lo.cru.append((luz_fn, [ent0, (1.7, yb, zb - 1.4)]))
    # sombra suave do prisma sobre a base
    return c.render()

# ---------------------------------------------------------------- P07 Morfologia: pecas de letras separando prefixo e radical (IN + UTIL)
def P07():
    c = Cena(-20, 44)
    L, e, g = .52, .14, .06
    letras = [('I', 0, '#e8a23a'), ('N', 1, '#e8a23a'), ('Ú', 2.45, '#e9d3a8'), ('T', 3.45, '#e9d3a8'), ('I', 4.45, '#e9d3a8'), ('L', 5.45, '#e9d3a8')]
    x0 = -((4) * (L + g)) / 2 - .35
    for ch, k, cor in letras:
        if k < 2: x = x0 + .35 + k * (L + g); y = .36
        else: x = x0 + .35 + (k - 2.45) * (L + g) + .3; y = -.36
        o = c.add(Obj()); caixa_chanfro(o, x, x + L, y - L / 2, y + L / 2, 0, e, .035, cor, amb=.45, brilho=.25)
        def txt(cam, x=x, y=y, ch=ch, cor=cor):
            return [(0, texto_no_plano(cam, ch, lambda *p: p, x + L / 2, y - .02, e + .001, .36, '#3a2414' if cor != '#e8a23a' else '#4a2608', SERIF_B))]
        txt.ordem = 3; o.cru.append((txt, []))
    # traco de separacao (morfema) marcado a lapis entre prefixo e radical
    return c.render()

# ---------------------------------------------------------------- P08 Periodo simples: caderno pautado com uma frase e lapis
def lapis(c, p0, direcao, comp=2.2, r=.075, cor='#f2c12e'):
    d = np.array(direcao, float); d /= np.linalg.norm(d)
    o = c.add(Obj()); o.prof = -1e6
    p0 = np.array(p0, float)
    # corpo sextavado (prisma de 6 lados) + madeira conica + grafite + virola + borracha
    t = np.array([0, 0, 1.0]); u = np.cross(d, t); u /= np.linalg.norm(u); v = np.cross(u, d)
    corpo = []
    for k in range(6):
        a = 2 * math.pi * k / 6 + math.pi / 6
        corpo += [tuple(p0 + r * (math.cos(a) * u + math.sin(a) * v)), tuple(p0 + d * comp * .78 + r * (math.cos(a) * u + math.sin(a) * v))]
    solido_convexo(o, corpo, cor, amb=.4, brilho=.25)
    cilindro_liso(o, p0 + d * comp * .78, d * comp * .15, r * .98, r * .25, cor='#e8c49a', ordem=1)
    cilindro_liso(o, p0 + d * comp * .93, d * comp * .07, r * .26, 0, cor='#3a3a40', ordem=1)
    cilindro_liso(o, p0 - d * comp * .09, d * comp * .09, r * 1.03, cor='#b9bfc8', brilho=.6, ordem=1)
    cilindro_liso(o, p0 - d * comp * .19, d * comp * .1, r * .98, cor='#e88f9a', ordem=1)
    return o

def P08():
    c = Cena(-20, 48)
    W, D = 1.0, 1.35
    for sx in (-1, 1):
        f = c.add(Obj()); caixa(f, (0 if sx > 0 else -2 * W) + .02 * sx, (2 * W if sx > 0 else 0) + .02 * sx, -D, D, 0, .06, '#fbfaf5', amb=.85)
    capa = c.add(Obj()); capa.prof = 1e6; caixa(capa, -2 * W - .06, 2 * W + .06, -D - .06, D + .06, 0, .03, '#2f5f8f')
    def pauta(cam):
        out = []; z = .061
        for k in range(14):
            y = D - .3 - k * .17
            for x0, x1 in ((-2 * W + .1, -.12), (.14, 2 * W - .1)):
                out.append((0, lin(cam, (x0, y, z), (x1, y, z), '#9cc0dd', .55, cap='butt')))
        out.append((0, lin(cam, (.42, -D, z), (.42, D, z), '#e07a7a', .6, cap='butt')))
        out.append((0, lin(cam, (-2 * W + .28, -D, z), (-2 * W + .28, D, z), '#e07a7a', .6, cap='butt')))
        # frase manuscrita na pagina direita: uma oracao, com sujeito sublinhado
        y = D - .3 - 2 * .17 + .05
        xs = np.linspace(.5, 1.75, 90)
        esc = [(x, y + .035 * math.sin(x * 70) * (1 if (x * 9) % 1 > .18 else 0) + .02 * math.sin(x * 23), z + .001) for x in xs]
        P = [cam.P(*p) for p in esc]
        out.append((0, f'<polyline points="{" ".join(fmt(a)+","+fmt(b) for a, b in P)}" fill="none" stroke="#2a3550" stroke-width=".9" stroke-linejoin="round"/>'))
        out.append((0, lin(cam, (.5, y - .07, z), (.95, y - .07, z), '#2a3550', .8)))
        out.append((0, lin(cam, (1.05, y - .07, z), (1.75, y - .07, z), '#2a3550', .8)))
        out.append((0, lin(cam, (1.05, y - .1, z), (1.75, y - .1, z), '#2a3550', .8)))
        return out
    pauta.ordem = 3
    pa = c.add(Obj(sombra=False)); pa.prof = -1e5; pa.cru.append((pauta, []))
    # espiral
    def espiral(cam):
        out = []
        for k in range(12):
            y = -D + .14 + k * (2 * D - .28) / 11
            arco = [(.0 + .14 * math.cos(t), y, .03 + .14 * math.sin(t)) for t in np.linspace(math.pi * .05, math.pi * .95, 12)]
            out.append((0, tubo_liso(cam, arco, .022 * cam.k, '#9aa2ad')))
        return out
    espiral.ordem = 3
    es = c.add(Obj(sombra=False)); es.prof = -2e5; es.cru.append((espiral, []))
    lapis(c, (1.15, -1.2, .14), (-.25, 1, 0.0), 2.0)
    return c.render()

# ---------------------------------------------------------------- P09 Periodo composto: trem de madeira com vagoes engatados (oracoes ligadas)
def roda(c_obj, x, y, z, r=.17, w=.08, cor='#c0392b'):
    cilindro_liso(c_obj, (x, y, z), (0, -w, 0), r, cor=cor, brilho=.3, ordem=2)

def P09():
    c = Cena(-30, 24)
    def vagao(x0, comp, cor, loco=False):
        o = c.add(Obj())
        caixa_chanfro(o, x0, x0 + comp, -.32, .32, .2, .62 if not loco else .55, .03, cor, amb=.4, brilho=.2)
        if loco:
            caixa_chanfro(o, x0 + comp * .5, x0 + comp, -.32, .32, .55, 1.05, .03, '#2f6fa8', amb=.4)
            caixa_chanfro(o, x0 + comp * .45, x0 + comp + .05, -.36, .36, 1.05, 1.13, .02, '#22252c', amb=.5)
            cilindro_liso(o, (x0 + comp * .2, 0, .55), (0, 0, .32), .1, .13, cor='#22252c', ordem=1)
        else:
            # carga: blocos coloridos
            pass
        for xr in (x0 + .2, x0 + comp - .2):
            roda(o, xr, -.32, .2, cor='#22252c' if loco else '#22252c')
        o.prof = None
        return o
    v1 = vagao(.75, 1.05, '#d64541', loco=True)
    v2 = vagao(-.42, .95, '#e3a33b')
    v3 = vagao(-1.55, .95, '#4f9a6a')
    # carga dos vagoes
    for x0, cor in ((-.42, '#3f72b8'), (-1.55, '#d64541')):
        k = c.add(Obj(sombra=False)); caixa_chanfro(k, x0 + .2, x0 + .75, -.2, .2, .62, .9, .03, cor, amb=.4)
        k.prof = None
    # engates
    for xa in (.53 + .1, -.6 + .07):
        e = c.add(Obj(sombra=False)); caixa(e, xa - .12, xa + .12, -.05, .05, .32, .38, '#3a3f49')
    # profundidade dos objetos: ordem natural pela posicao x (camera olha da esquerda-frente)
    for o in c.objs:
        if getattr(o, 'prof', 0) is None: del o.prof
    return c.render()

# ---------------------------------------------------------------- P10 Norma e emprego: folha corrigida a caneta vermelha
def P10():
    c = Cena(-18, 52)
    W, D = 1.15, 1.5
    M = transf(math.radians(-6), (0, 0, 0))
    f = c.add(Obj()); solido_convexo(f, [M(x, y, z) for x in (-W, W) for y in (-D, D) for z in (0, .02)], '#fbfaf5', amb=.85)
    def texto(cam):
        out = []; z = .021
        rng = np.random.default_rng(3)
        for k in range(11):
            y = D - .3 - k * .24; x = -W + .18
            while x < W - .25:
                w = rng.uniform(.12, .38); w = min(w, W - .18 - x)
                if w > .05:
                    cor = '#7b808c'
                    out.append((0, lin(cam, M(x, y, z), M(x + w, y, z), cor, 2.0, cap='round')))
                x += w + .08
        # correcao: palavra riscada, insercao com circunflexo e um certo no fim
        y = D - .3 - 3 * .24
        out.append((0, lin(cam, M(-.2, y, z + .001), M(.32, y, z + .001), '#d22b2b', 1.4)))
        corr = texto_path('à', lambda u, v: cam.P(*M(.06 + u, y + .1 + v, z + .001)), .26, SERIF_I)
        out.append((0, f'<path d="{corr}" fill="#d22b2b"/>'))
        y2 = D - .3 - 6 * .24
        out.append((0, poli(cam, [M(-.55, y2 - .02, z), M(-.47, y2 + .16, z), M(-.39, y2 - .02, z)], 'none', ' stroke="#d22b2b" stroke-width="1.3" stroke-linejoin="round"')))
        v = [M(.55, D - .3 - 9 * .24 + .02, z), M(.66, D - .3 - 9 * .24 - .1, z), M(.92, D - .3 - 9 * .24 + .2, z)]
        out.append((0, f'<polyline points="{" ".join(fmt(cam.P(*p)[0])+","+fmt(cam.P(*p)[1]) for p in v)}" fill="none" stroke="#d22b2b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'))
        return out
    texto.ordem = 3; f.cru.append((texto, []))
    # caneta vermelha deitada
    o = c.add(Obj()); o.prof = -1e6
    p0 = np.array([.95, -1.25, .09]); d = np.array([-.42, 1, 0]); d /= np.linalg.norm(d); Lc = 2.1
    cilindro_liso(o, p0, d * Lc * .72, .085, cor='#c62828', brilho=.45, ordem=0)
    cilindro_liso(o, p0 + d * Lc * .72, d * Lc * .16, .085, .03, cor='#d9dde3', brilho=.6, ordem=1)
    cilindro_liso(o, p0 - d * Lc * .02, d * Lc * .3, .095, cor='#a31f1f', brilho=.45, ordem=1)
    def clip(cam):
        a = p0 + d * Lc * .02 + np.array([0, 0, .1]); b = a + d * Lc * .24
        return [(0, lin(cam, a, b, '#d9dde3', .045 * cam.k) + lin(cam, a, b, '#ffffff', .015 * cam.k, op=.8))]
    clip.ordem = 3; o.cru.append((clip, []))
    return c.render()

# ---------------------------------------------------------------- P11 Literatura do Barroco ao Simbolismo: pena e tinteiro
def P11():
    c = Cena(-20, 22)
    o = c.add(Obj())
    cilindro_liso(o, (0, 0, 0), (0, 0, .62), .62, .58, cor='#1f3a52', brilho=.6, amb=.35, ordem=0)
    cilindro_liso(o, (0, 0, .62), (0, 0, .1), .58, .3, cor='#1f3a52', brilho=.6, amb=.35, ordem=1)
    cilindro_liso(o, (0, 0, .72), (0, 0, .12), .26, cor='#c9a24a', brilho=.6, ordem=2, tampa_cor='#0d0f14')
    # pena: desenhada sobre o tinteiro, saindo da boca para cima-direita
    def pena(cam):
        bx, by = cam.P(0, 0, .84)
        tx, ty = bx + 70, by - 112   # ponta de cima
        # eixo curvo (raque)
        ctrl = (bx + 12, by - 70)
        def q(t):
            return ((1 - t) ** 2 * bx + 2 * (1 - t) * t * ctrl[0] + t * t * tx, (1 - t) ** 2 * by + 2 * (1 - t) * t * ctrl[1] + t * t * ty)
        def tang(t):
            dx = 2 * (1 - t) * (ctrl[0] - bx) + 2 * t * (tx - ctrl[0]); dy = 2 * (1 - t) * (ctrl[1] - by) + 2 * t * (ty - ctrl[1])
            L = math.hypot(dx, dy); return dx / L, dy / L
        esq, dir_ = [], []
        for t in np.linspace(.18, 1, 40):
            x, y = q(t); ux, uy = tang(t); nx, ny = -uy, ux
            larg = 15 * math.sin(math.pi * min(1, (t - .18) / .82) ** .8) * (1 - .25 * t)
            esq.append((x + nx * larg * 1.05, y + ny * larg * 1.05)); dir_.append((x - nx * larg * .8, y - ny * larg * .8))
        vane = esq + dir_[::-1]
        out = ['<linearGradient id="pn" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#d8d2c4"/><stop offset=".55" stop-color="#fbf8f1"/><stop offset="1" stop-color="#e9e3d6"/></linearGradient>']
        out.append(f'<path d="{caminho(vane)}" fill="url(#pn)" stroke="#b9b1a0" stroke-width=".6"/>')
        # barbas
        for t in np.linspace(.22, .97, 34):
            x, y = q(t); ux, uy = tang(t); nx, ny = -uy, ux
            larg = 15 * math.sin(math.pi * min(1, (t - .18) / .82) ** .8) * (1 - .25 * t)
            for s, k in ((1, 1.0), (-1, .78)):
                ex, ey = x + nx * larg * k * s * (1.05 if s > 0 else 1) + ux * 6, y + ny * larg * k * s + uy * 6
                out.append(f'<line x1="{fmt(x)}" y1="{fmt(y)}" x2="{fmt(ex)}" y2="{fmt(ey)}" stroke="#bdb5a3" stroke-width=".45" opacity=".8"/>')
        # fendas tipicas da pena
        for t, s in ((.55, 1), (.75, -1), (.4, -1)):
            x, y = q(t); ux, uy = tang(t); nx, ny = -uy, ux
            out.append(f'<path d="M{fmt(x + nx*s*3)} {fmt(y + ny*s*3)} L{fmt(x + nx*s*14 + ux*7)} {fmt(y + ny*s*14 + uy*7)}" stroke="#ffffff" stroke-width="1.2"/>')
        pts = [q(t) for t in np.linspace(0, 1, 30)]
        out.append(f'<polyline points="{" ".join(fmt(a)+","+fmt(b) for a, b in pts)}" fill="none" stroke="#a89f8a" stroke-width="1.6" stroke-linecap="round"/>')
        out.append(f'<polyline points="{" ".join(fmt(a-.5)+","+fmt(b-.4) for a, b in pts[8:])}" fill="none" stroke="#ffffff" stroke-width=".6" opacity=".9"/>')
        return [(0, ''.join(out))]
    pena.ordem = 4
    o.cru.append((pena, [(0, 0, 3.2), (1.6, 0, 3.0)]))
    # folha de papel antigo por baixo
    f = c.add(Obj(sombra=False)); f.prof = 1e6
    Mf = transf(math.radians(-18), (.3, .1, 0))
    solido_convexo(f, [Mf(x, y, z) for x in (-1.3, 1.3) for y in (-.95, .95) for z in (0, .01)], '#efe2c2', amb=.8)
    return c.render()

# ---------------------------------------------------------------- P12 Literatura do Pre-Modernismo em diante: maquina de escrever
def P12():
    c = Cena(-22, 30)
    o = c.add(Obj())
    cor = '#3d5a52'
    # corpo: frente baixa, fundo alto
    solido_convexo(o, [(x, y, z) for x in (-1.3, 1.3) for (y, z) in ((-1.0, 0), (-1.0, .22), (.9, 0), (.9, .75), (.4, .78), (-.55, .42))], cor, amb=.4, brilho=.3)
    # rolo (carro) atras
    cilindro_liso(o, (-1.5, .62, .95), (3.0, 0, 0), .2, cor='#1d1f24', brilho=.4, ordem=1)
    for x in (-1.6, 1.5):
        cilindro_liso(o, (x, .62, .95), (.1, 0, 0), .16, cor='#c9cdd3', brilho=.6, ordem=2)
    # papel saindo do rolo
    papel = [(-.75, .6, 1.12), (.75, .6, 1.12), (.75, .78, 2.1), (-.75, .78, 2.1)]
    o.face(papel, '#fbfaf5', ordem=0, dupla=True, amb=.9)
    def linhas(cam):
        out = []
        for k in range(6):
            zz = 1.95 - k * .13; x1 = .55 if k != 5 else .05
            out.append((0, lin(cam, (-.6, .6 + (zz - 1.12) / .98 * .18 - .005, zz), (x1, .6 + (zz - 1.12) / .98 * .18 - .005, zz), '#6b6f78', 1.1, cap='butt')))
        return out
    linhas.ordem = 0.5
    o.cru.append((linhas, papel))
    # alavanca de retorno do carro
    def alav(cam):
        return [(0, lin(cam, (-1.55, .55, 1.0), (-1.95, .2, 1.25), '#c9cdd3', .05 * cam.k) + lin(cam, (-1.55, .55, 1.0), (-1.95, .2, 1.25), '#ffffff', .015 * cam.k, op=.8))]
    alav.ordem = 3; o.cru.append((alav, [(-1.95, .2, 1.25)]))
    # teclas: 3 fileiras em degrau sobre a frente inclinada + barra de espaco
    teclas = []
    for row in range(3):
        y = -.85 + row * .2; z = .25 + row * .065
        n = 9 - row
        for k in range(n):
            x = -1.0 + (k + .5 * row) * .24
            teclas.append((x, y, z))
    def tec(cam):
        out = []
        for x, y, z in sorted(teclas, key=lambda p: -cam.D(*p)):
            # haste + tecla redonda com aro cromado
            out.append((0, lin(cam, (x, y + .05, z - .08), (x, y, z + .02), '#1d1f24', .035 * cam.k)))
            top = circ3((x, y, z + .03), (1, 0, 0), (0, 1, 0), .085, 20)
            out.append((0, poli(cam, top, '#111317', f' stroke="#cfd3d9" stroke-width="{fmt(.025*cam.k)}"')))
            hl = circ3((x - .02, y + .02, z + .031), (1, 0, 0), (0, 1, 0), .035, 12)
            out.append((0, poli(cam, hl, '#e9ebef', ' opacity=".9"')))
        a = (-.6, -.98, .2); b = (.6, -.98, .2)
        out.append((0, lin(cam, a, b, '#111317', .07 * cam.k) + lin(cam, a, b, '#4a4f59', .03 * cam.k)))
        return out
    tec.ordem = 3; o.cru.append((tec, []))
    return c.render()

if __name__ == '__main__':
    import sys
    alvo = sys.argv[1:] or ['P%02d' % i for i in range(1, 13)]
    for k in alvo: grava(k, globals()[k]())

# -*- coding: utf-8 -*-
"""Conteudos M13 a M17, M13.9 e M-OUTRO."""
from sub_mat_base import *
from motor import _novo_id

def _elipse2d(cx, cy, rx, ry, cor, gid, rot=0):
    g = grad_rad(gid, [(0, '#ffffff'), (.18, mix(cor, '#ffffff', .5)), (.6, cor), (1, mix(cor, '#000000', .4))], cx=.36, cy=.3, r=.75)
    t = f' transform="rotate({fmt(rot)} {fmt(cx)} {fmt(cy)})"' if rot else ''
    return f'<defs>{g}</defs><ellipse cx="{fmt(cx)}" cy="{fmt(cy)}" rx="{fmt(rx)}" ry="{fmt(ry)}" fill="url(#{gid})"{t}/>'

# =============================================================== M13 Combinatoria e probabilidade (modulo: dados)
def M13_1():
    """principio multiplicativo: cadeado de segredo com 3 rodas de 0 a 9 (10 x 10 x 10 = 1000 senhas)"""
    c = Cena(-20, 14)
    o = c.add(Obj())
    W, D, H = 1.5, .55, 1.25
    caixa_chanfro(o, -W / 2, W / 2, -D / 2, D / 2, 0, H, .1, '#d2a83e', amb=.4, brilho=.45)
    def alca(cam):
        pts = [(-.48, 0, H - .1), (-.48, 0, H + .55)] + [(.48 * math.cos(t), 0, H + .55 + .48 * math.sin(t)) for t in np.linspace(math.pi, 0, 30)] + [(.48, 0, H + .55), (.48, 0, H - .1)]
        return [(0, tubo_liso(cam, pts, 4.4, '#b9c0c9'))]
    al = c.add(Obj(sombra=True)); al.prof = 50; cru(al, alca, ordem=0, pts=[(0, 0, H + 1.05), (-.55, 0, H), (.55, 0, H)])
    rodas = c.add(Obj(sombra=False)); rodas.prof = -10
    janela = c.add(Obj(sombra=False)); janela.prof = -5
    def jan(cam):
        return [(0, poli(cam, [(-.6, -D / 2 - .003, .2), (.6, -D / 2 - .003, .2), (.6, -D / 2 - .003, .78), (-.6, -D / 2 - .003, .78)], '#3b3220'))]
    cru(janela, jan)
    digitos = [3, 7, 1]
    for i, x in enumerate((-.38, 0, .38)):
        cilindro_liso(rodas, (x - .16, -D / 2 + .05, .49), (.32, 0, 0), .26, cor='#25272d', brilho=.5, amb=.4, ordem=i)
        def num(cam, x=x, d=digitos[i]):
            out = []
            for k, dz in ((-1, -.22), (0, 0), (1, .22)):
                z = .49 + dz; yy = -D / 2 + .05 - .26 * math.cos(dz / .26) - .003
                txt = str((d + k) % 10)
                out.append(texto(cam, txt, I, x, yy, z, .2 if k == 0 else .14, '#f4f1e8' if k == 0 else '#8d9099', SANS_B, (1, 0, 0), (0, 0, 1)))
            for zz in (.33, .65):
                out.append(lin(cam, (x - .16, -D / 2 - .2, zz), (x + .16, -D / 2 - .2, zz), '#4a4d55', .6, op=.6))
            return [(0, s) for s in out]
        cru(rodas, num, ordem=10 + i)
    return c.render()

def _peao(c, x, y, z, cor, esc=1.0, prof=0):
    o = c.add(Obj(sombra=False)); o.prof = prof
    perfil = [(.36, 0), (.36, .08), (.3, .14), (.2, .2), (.14, .5), (.22, .56), (.11, .62)]
    torno(o, [(r * esc, h * esc) for r, h in perfil], base=(x, y, z), cor=cor, brilho=.45, amb=.38, n=40)
    o.esfera((x, y, z + .78 * esc), .2 * esc, cor)
    return o

def M13_2():
    """arranjos e permutacoes: podio 1.o, 2.o e 3.o lugar com tres pecas (a ordem importa: 3! = 6 maneiras)"""
    c = Cena(-18, 18)
    blocos = [(-1.0, .7, '2', '#8d949e'), (0, 1.05, '1', '#e0a92e'), (1.0, .45, '3', '#b97a48')]
    for x, h, n, cor in blocos:
        o = c.add(Obj()); caixa_chanfro(o, x - .5, x + .5, -.45, .45, 0, h, .03, '#f4f2ec', amb=.55, brilho=.2)
        def rot(cam, x=x, h=h, n=n, cor=cor):
            return [(0, texto(cam, n, I, x, -.452, h * .5, .45, cor, SANS_B, (1, 0, 0), (0, 0, 1)))]
        cru(o, rot)
    _peao(c, -1.0, 0, .7, '#2f6fd0', prof=-100)
    _peao(c, 0, 0, 1.05, '#d9473c', prof=-110)
    _peao(c, 1.0, 0, .45, '#3f8f5a', prof=-120)
    return c.render()

def M13_3():
    """combinacoes: seis bolas de sorteio de loteria (a ordem nao importa: C(60, 6))"""
    c = Cena(-16, 30)
    R = .42
    pos = [(-.95, -.35), (-.05, -.5), (.85, -.38), (-.5, .45), (.4, .4), (-.02, 1.15)]
    nums = ['04', '12', '23', '35', '41', '58']
    for i, ((x, y), n) in enumerate(zip(pos, nums)):
        o = c.add(Obj()); o.prof = -y * 100
        o.esfera((x, y, R), R, '#f4f1e8')
        def rot(cam, x=x, y=y, n=n):
            X, Y = cam.P(x, y - R * .1, R * 1.05); RR = R * cam.k
            d = texto_path(n, lambda u, v: (X + u, Y - v), RR * .62, SANS_B)
            return [(0, f'<ellipse cx="{fmt(X)}" cy="{fmt(Y)}" rx="{fmt(RR*.62)}" ry="{fmt(RR*.5)}" fill="#ffffff" opacity=".9"/><path d="{d}" fill="#1f6b3a"/>')]
        cru(o, rot, ordem=5)
    return c.render()

def M13_4():
    """probabilidade simples: cartas de baralho em leque (P(as) = 4/52)"""
    c = Cena(-12, 50)
    W, H, e = .9, 1.3, .012
    cartas = [('Q', '♦', '#d23a32', -32), ('K', '♣', '#1f2228', -14), ('J', '♥', '#d23a32', 4), ('A', '♠', '#1f2228', 22)]
    piv = np.array((0, -1.0))
    for k, (v, naipe, cor, ang) in enumerate(cartas):
        a = math.radians(ang)
        M = transf(-a, (piv[0], piv[1], k * .02), )
        o = c.add(Obj()); o.prof = -k * 10
        caixaM(o, M, -W / 2, W / 2, .15, .15 + H, 0, e, '#fbfaf5', amb=.7, contorno='#c9c4b6', sw=.5)
        def face(cam, M=M, v=v, naipe=naipe, cor=cor):
            out = []
            z = e + .002
            out.append(texto(cam, v, M, -W / 2 + .13, .15 + H - .14, z, .2, cor, SANS_B))
            out.append(texto(cam, naipe, M, -W / 2 + .13, .15 + H - .32, z, .17, cor, SANS_B))
            out.append(texto(cam, naipe, M, 0, .15 + H / 2, z, .62 if v == 'A' else .4, cor, SANS_B))
            return [(0, s) for s in out]
        cru(o, face)
    return c.render()

def M13_5():
    """probabilidade condicional e teste diagnostico: teste rapido com linhas C (controle) e T (teste)"""
    c = Cena(-22, 46)
    M = transf(math.radians(28), (0, 0, 0))
    W, L, e = .8, 2.6, .14
    o = c.add(Obj()); caixaM(o, M, -W / 2, W / 2, -L / 2, L / 2, 0, e, '#f6f6f3', b=.06, amb=.55, brilho=.3)
    def det(cam):
        out = []; z = e + .002
        out.append(poli(cam, [M(-.16, -.15, z), M(.16, -.15, z), M(.16, .55, z), M(-.16, .55, z)], '#d8d6cf'))
        out.append(poli(cam, [M(-.12, -.11, z + .001), M(.12, -.11, z + .001), M(.12, .51, z + .001), M(-.12, .51, z + .001)], '#fbf7f2'))
        for yy, cor in ((.36, '#c2185b'), (.08, '#c2185b')):
            out.append(poli(cam, [M(-.12, yy, z + .002), M(.12, yy, z + .002), M(.12, yy + .05, z + .002), M(-.12, yy + .05, z + .002)], cor))
        out.append(texto(cam, 'C', M, -.26, .385, z, .12, '#3b3f48', SANS_B))
        out.append(texto(cam, 'T', M, -.26, .105, z, .12, '#3b3f48', SANS_B))
        cxy = (0, -.75)
        out.append(poli(cam, [M(cxy[0] + .19 * math.cos(t), cxy[1] + .19 * math.sin(t), z) for t in np.linspace(0, 2 * math.pi, 28)], '#c9c6bd'))
        out.append(poli(cam, [M(cxy[0] + .13 * math.cos(t), cxy[1] + .13 * math.sin(t), z + .001) for t in np.linspace(0, 2 * math.pi, 24)], '#e9dccb'))
        out.append(texto(cam, 'S', M, .26, -.75, z, .12, '#3b3f48', SANS_B))
        return [(0, s) for s in out]
    cru(o, det, ordem=4)
    return c.render()

def M13_6():
    """uniao, interseccao e complementar: dois discos de acrilico colorido sobrepostos sobre a placa do universo U"""
    c = Cena(-18, 52)
    pl_ = c.add(Obj()); pl_.prof = 1e3; caixa_chanfro(pl_, -1.9, 1.9, -1.35, 1.35, 0, .1, .03, '#eef0f3', amb=.65, brilho=.2)
    cru(pl_, lambda cam: [(0, texto(cam, 'U', I, -1.6, 1.05, .102, .3, '#6b7480', SERIF_I))])
    for k, (x, cor) in enumerate(((-.5, '#e0453a'), (.5, '#2f7fd8'))):
        o = c.add(Obj(sombra=False)); o.prof = -10 * k
        pts = [(x + 1.0 * math.cos(t), 1.0 * math.sin(t)) for t in np.linspace(0, 2 * math.pi, 64, endpoint=False)]
        extrusao(o, pts, .1 + k * .04, .14 + k * .04, cor, mix(cor, '#000000', .2), opac=.55, contorno=mix(cor, '#000000', .3), sw=.7)
    rot = c.add(Obj(sombra=False)); rot.prof = -100
    def r_(cam):
        return [(0, texto(cam, 'A', I, -1.0, 0, .181, .36, '#ffffff', SERIF_I)), (0, texto(cam, 'B', I, 1.0, 0, .181, .36, '#ffffff', SERIF_I))]
    cru(rot, r_)
    return c.render()

def M13_9():
    """outros casos: urna de vidro com bolinhas coloridas (sorteio sem reposicao) e uma bolinha retirada"""
    c = Cena(-18, 22)
    r = .19
    dentro = [(-.35, -.2, '#d9473c'), (.1, -.3, '#2f6fd0'), (.42, .05, '#d9473c'), (-.15, .25, '#3f8f5a'), (.25, .35, '#2f6fd0'),
              (-.45, .2, '#2f6fd0'), (0, 0, '#f2c230'), (-.2, -.1, '#3f8f5a')]
    bol = c.add(Obj(sombra=False)); bol.prof = 10
    for i, (x, y, cor) in enumerate(dentro):
        z = r + (i // 5) * r * 1.6 + (.02 * (i % 3))
        bol.esfera((x, y, z + .06), r, cor)
    vidro_cilindro(c, 0, 0, 0, .75, 1.35, prof=0, op_corpo=.2)
    fora = c.add(Obj()); fora.prof = -10; fora.esfera((1.15, -.6, r), r, '#d9473c')
    return c.render()

# =============================================================== M14 Estatistica (modulo: pizza)
def M14_1():
    """media, mediana e moda: pilhas de 3, 6, 2, 5 e 4 blocos e uma regua vermelha na altura da media (20 / 5 = 4)"""
    c = Cena(-20, 18)
    a = .36; alturas = [3, 6, 2, 5, 4]
    cores = ['#3f72b8', '#4f9a6a', '#e3a33b', '#cf4d4d', '#8a5bb0']
    for i, n in enumerate(alturas):
        x = (i - 2) * (a + .1)
        for k in range(n):
            o = c.add(Obj(sombra=(k == 0))); o.prof = 10 - k * .01 - i * .001
            caixa_chanfro(o, x - a / 2, x + a / 2, -a / 2, a / 2, k * a, (k + 1) * a - .015, .03, cores[i], amb=.42, brilho=.25)
    m = sum(alturas) / len(alturas)
    r = c.add(Obj(sombra=False)); r.prof = -1e3
    cilindro_liso(r, (-2.6 * (a + .1), -a / 2 - .08, m * a), (5.2 * (a + .1), 0, 0), .035, cor='#d9473c', brilho=.5)
    return c.render()

def M14_2():
    """leitura de tabelas e graficos: prancheta com grafico de barras e tabela"""
    c = Cena(-14, 50)
    M = transf(math.radians(-6), (0, 0, 0))
    W, H = 2.0, 2.7
    o = c.add(Obj()); caixaM(o, M, -W / 2, W / 2, -H / 2, H / 2, 0, .06, '#a8743e', b=.03, amb=.45)
    def papel(cam):
        out = []; z = .061
        out.append(poli(cam, [M(-W / 2 + .12, -H / 2 + .12, z), M(W / 2 - .12, -H / 2 + .12, z), M(W / 2 - .12, H / 2 - .3, z), M(-W / 2 + .12, H / 2 - .3, z)], '#fdfdfb'))
        x0, y0 = -W / 2 + .35, .05
        out.append(lin(cam, M(x0, y0, z + .001), M(W / 2 - .3, y0, z + .001), '#39404c', 1)); out.append(lin(cam, M(x0, y0, z + .001), M(x0, y0 + 1.0, z + .001), '#39404c', 1))
        for i, (h, cor) in enumerate([(.45, '#3f72b8'), (.8, '#4f9a6a'), (.6, '#e3a33b'), (.92, '#cf4d4d')]):
            bx = x0 + .12 + i * .33
            out.append(poli(cam, [M(bx, y0, z + .002), M(bx + .22, y0, z + .002), M(bx + .22, y0 + h, z + .002), M(bx, y0 + h, z + .002)], cor))
        ty0 = -H / 2 + .25; ty1 = -.15; tx0, tx1 = -W / 2 + .3, W / 2 - .3
        out.append(poli(cam, [M(tx0, ty1 - .18, z + .001), M(tx1, ty1 - .18, z + .001), M(tx1, ty1, z + .001), M(tx0, ty1, z + .001)], '#dfe7f1'))
        for k in range(5):
            yy = ty0 + (ty1 - ty0) * k / 4
            out.append(lin(cam, M(tx0, yy, z + .002), M(tx1, yy, z + .002), '#9aa5b3', .6, cap='butt'))
        for xx in (tx0, tx0 + (tx1 - tx0) * .45, tx1):
            out.append(lin(cam, M(xx, ty0, z + .002), M(xx, ty1, z + .002), '#9aa5b3', .6, cap='butt'))
        for k in range(4):
            yy = ty0 + (ty1 - ty0) * (k + .5) / 4
            out.append(lin(cam, M(tx0 + .08, yy, z + .003), M(tx0 + .5, yy, z + .003), '#7d8794', 1.2))
            out.append(lin(cam, M(tx1 - .45, yy, z + .003), M(tx1 - .1, yy, z + .003), '#7d8794', 1.2))
        return [(0, s) for s in out]
    cru(o, papel, ordem=4)
    cl = c.add(Obj(sombra=False)); cl.prof = -100
    caixaM(cl, M, -.42, .42, H / 2 - .42, H / 2 - .08, .06, .16, '#c3c9d1', b=.03, amb=.45, brilho=.6)
    return c.render()

def M14_3():
    """dispersao e desvio padrao: tabuleiro de Galton - as bolinhas formam a curva normal (media no centro, espalhamento = desvio padrao)"""
    c = Cena(-14, 12)
    M = transf(math.radians(-8), (0, 0, 0), roll=math.radians(76))
    W, H = 2.2, 3.0
    o = c.add(Obj())
    caixaM(o, M, -W / 2 - .1, W / 2 + .1, -.05, H + .05, -.2, 0, '#9c6b3a', amb=.42)
    def dentro(cam):
        out = []; z = .002
        out.append(poli(cam, [M(-W / 2, 0, z), M(W / 2, 0, z), M(W / 2, H, z), M(-W / 2, H, z)], '#f3e6cf'))
        # funil
        out.append(poli(cam, [M(-W / 2, H, z + .001), M(-.12, H - .45, z + .001), M(-.12, H - .5, z + .001), M(-W / 2, H - .05, z + .001)], '#b88550'))
        out.append(poli(cam, [M(W / 2, H, z + .001), M(.12, H - .45, z + .001), M(.12, H - .5, z + .001), M(W / 2, H - .05, z + .001)], '#b88550'))
        # pinos em triangulo
        for fila in range(7):
            for i in range(fila + 1):
                px = (i - fila / 2) * .27; pz = H - .7 - fila * .2
                out.append(poli(cam, [M(px + .03 * math.cos(t), pz + .03 * math.sin(t), z + .002) for t in np.linspace(0, 2 * math.pi, 10)], '#6b7480'))
        # canaletas e bolinhas (alturas ~ C(7, k))
        nb = [1, 7, 21, 35, 35, 21, 7, 1]; esc = .036
        for k in range(9):
            x = (k - 4) * .27
            out.append(lin(cam, M(x, .05, z + .002), M(x, .95, z + .002), '#8a5a2b', 1.4, cap='butt'))
        for k, n in enumerate(nb):
            x = (k - 3.5) * .27
            h = n * esc * .78
            nbol = max(1, int(round(h / .085)))
            for j in range(nbol):
                for dx in (-.055, .055):
                    bx, bz = x + dx, .09 + j * .085
                    out.append(f'<circle cx="{fmt(cam.P(*M(bx, bz, z + .004))[0])}" cy="{fmt(cam.P(*M(bx, bz, z + .004))[1])}" r="{fmt(.042 * cam.k)}" fill="url(#gb)"/>')
        xs = np.linspace(-1.05, 1.05, 50)
        out.append(pl(cam, [M(x, .09 + 35 * esc * .78 * math.exp(-x * x / (2 * .37 ** 2)), z + .006) for x in xs], '#d9473c', 1.3, op=.85))
        # vidro
        out.append(poli(cam, [M(-W / 2, H * .6, z + .01), M(-W / 2 + .5, H, z + .01), M(-W / 2 + .8, H, z + .01), M(-W / 2, H * .45, z + .01)], '#ffffff', ' opacity=".25"'))
        return [(0, s) for s in out]
    c.defs.append(grad_rad('gb', [(0, '#ffffff'), (.3, '#c9d0da'), (1, '#5d6570')], cx=.35, cy=.3, r=.7))
    cru(o, dentro, ordem=4)
    return c.render()

def M14_4():
    """media ponderada: regua equilibrada no apoio - 3 pesos em 1 e 1 peso em 5 equilibram em (3.1 + 1.5) / 4 = 2"""
    c = Cena(-18, 18)
    u = .48; zb = .75
    ap = c.add(Obj()); ap.prof = 50
    solido_convexo(ap, [(2 * u - .3, -.3, 0), (2 * u + .3, -.3, 0), (2 * u - .3, .3, 0), (2 * u + .3, .3, 0), (2 * u, -.3, zb - .04), (2 * u, .3, zb - .04)], '#5d6570', amb=.42, brilho=.3)
    rg = c.add(Obj()); rg.prof = 0
    caixa_chanfro(rg, -.3 * u, 6.3 * u, -.22, .22, zb - .04, zb + .08, .02, '#e8cf9f', amb=.5, brilho=.2)
    def marcas(cam):
        out = []
        for i in range(7):
            out.append(lin(cam, (i * u, -.222, zb + .06), (i * u, -.222, zb - .01), '#5a4426', .9, cap='butt'))
        return [(0, s) for s in out]
    cru(rg, marcas)
    for k in range(3):
        p = c.add(Obj(sombra=False)); p.prof = -10 - k
        cilindro_liso(p, (1 * u, 0, zb + .08 + k * .2), (0, 0, .19), .17, cor='#8d949e', brilho=.6)
    p = c.add(Obj(sombra=False)); p.prof = -20
    cilindro_liso(p, (5 * u, 0, zb + .08), (0, 0, .19), .17, cor='#8d949e', brilho=.6)
    rot = c.add(Obj(sombra=False)); rot.prof = -100
    def r_(cam):
        out = []
        for i in range(7):
            out.append(texto(cam, str(i), I, i * u, -.32, zb - .14, .16, '#3b2c16', SANS_B, (1, 0, 0), (0, 0, 1)))
        return [(0, s) for s in out]
    cru(rot, r_)
    return c.render()

def M14_5():
    """interpretacao de dados em saude: medidor de pressao digital (120/80 mmHg e pulso) com a bracadeira"""
    c = Cena(-22, 38)
    o = c.add(Obj())
    P = [(-.85, -.75, 0), (.85, -.75, 0), (.85, .75, 0), (-.85, .75, 0), (-.8, -.6, .42), (.8, -.6, .42), (.8, .75, .55), (-.8, .75, .55)]
    solido_convexo(o, P, '#f4f5f7', amb=.55, brilho=.35)
    A = np.array((0, -.6, .42)); B = np.array((0, .75, .55)); ey = (B - A) / np.linalg.norm(B - A); ex = np.array((1.0, 0, 0))
    nn = np.cross(ex, ey); nn /= np.linalg.norm(nn)
    def Q(u, v, d=.003): return tuple(A + ex * u + ey * v + nn * d)
    def tela(cam):
        out = []
        out.append(poli(cam, [Q(-.62, .12), Q(.62, .12), Q(.62, 1.22), Q(-.62, 1.22)], '#2b2f3a'))
        out.append(poli(cam, [Q(-.56, .18, .004), Q(.56, .18, .004), Q(.56, 1.16, .004), Q(-.56, 1.16, .004)], '#c5d2b8'))
        def tx(t, u, v, tam, cor='#1f2a1e', f=MONO_B):
            p0 = np.array(Q(u, v, .005))
            d = texto_path(t, lambda a, b: cam.P(*(p0 + ex * a + ey * b)), tam, f)
            return f'<path d="{d}" fill="{cor}"/>'
        out.append(tx('120', .02, .92, .36)); out.append(tx('80', .12, .55, .3))
        out.append(tx('72', .25, .27, .18)); out.append(tx('♥', -.12, .27, .15, '#c0302a', SANS_B))
        out.append(tx('SYS', -.42, .92, .09, '#3b4a3a', SANS_B)); out.append(tx('DIA', -.42, .55, .09, '#3b4a3a', SANS_B))
        out.append(poli(cam, [Q(-.12 + .09 * math.cos(t), -.05 + .09 * math.sin(t)) for t in np.linspace(0, 2 * math.pi, 18)], '#2f6fd0'))
        return [(0, s) for s in out]
    cru(o, tela, ordem=4)
    br = c.add(Obj()); br.prof = 80
    def tubo(cam):
        pts = [(.86, .2, .25), (1.3, .25, .2), (1.55, .6, .15), (1.5, 1.0, .2)]
        return [(0, tubo_liso(cam, pts, 1.6, '#3b3f48'))]
    cru(br, tubo, ordem=0)
    caixa_chanfro(br, .95, 2.15, .9, 1.9, 0, .25, .1, '#2f5f9a', amb=.45)
    def vel(cam):
        return [(0, lin(cam, (1.0, 1.4, .252), (2.1, 1.4, .252), '#e8edf4', 1.2, op=.6))]
    cru(br, vel, ordem=3)
    return c.render()

# =============================================================== M15 Matrizes e determinantes (modulo: cubo 3x3)
def M15_1():
    """operacoes com matrizes: cartela de ovos 3 x 4 (linhas e colunas) - cada casa e um elemento a_ij"""
    c = Cena(-24, 44)
    q = .55; nl, nc = 3, 4
    o = c.add(Obj()); caixa(o, -nc * q / 2, nc * q / 2, -nl * q / 2, nl * q / 2, 0, .12, '#b9b2a2', amb=.5)
    vazios = {(0, 3), (2, 0), (1, 2)}
    cel = [(i, j) for i in range(nl) for j in range(nc)]
    def copos(cam):
        out = []
        for i, j in cel:
            x = -nc * q / 2 + (j + .5) * q; y = nl * q / 2 - (i + .5) * q
            P = [cam.P(x + .22 * math.cos(t), y + .22 * math.sin(t), .121) for t in np.linspace(0, 2 * math.pi, 24, endpoint=False)]
            gid = _novo_id('cv')
            out.append(f'<defs>{grad_rad(gid, [(0, "#8c8576"), (.7, "#a49d8d"), (1, "#c9c2b2")], cx=.6, cy=.65, r=.6)}</defs><path d="{caminho(P)}" fill="url(#{gid})"/>')
        return [(0, s) for s in out]
    cru(o, copos)
    for i, j in cel:
        if (i, j) in vazios: continue
        x = -nc * q / 2 + (j + .5) * q; y = nl * q / 2 - (i + .5) * q
        e = c.add(Obj(sombra=False)); e.prof = -y * 10 - 100
        def ovo(cam, x=x, y=y):
            X, Y = cam.P(x, y, .32); k = cam.k
            return [(0, _elipse2d(X, Y, .19 * k, .26 * k, '#f1e2c8', _novo_id('ov'), rot=-12))]
        cru(e, ovo, pts=[(x, y, .1), (x, y, .55)])
    return c.render()

def M15_2():
    """determinantes: paralelepipedo de vidro gerado por tres vetores - o volume e o modulo do determinante"""
    c = Cena(-28, 24)
    u = np.array((1.6, -.25, 0)); v = np.array((.55, 1.25, 0)); w = np.array((.45, .3, 1.25))
    O = np.array((-.9, -.4, 0))
    P = [O + a * u + b * v + cc * w for a in (0, 1) for b in (0, 1) for cc in (0, 1)]
    o = c.add(Obj()); solido_convexo(o, [tuple(p) for p in P], '#8cc4e6', opac=.4, contorno='#3d7fab', sw=.7, dupla=False, amb=.6)
    s = c.add(Obj(sombra=False)); s.prof = -1e3
    def vet(cam):
        out = []
        for d, cor in ((u, '#d9473c'), (v, '#3f8f5a'), (w, '#2f6fd0')):
            out.append(seta3(cam, tuple(O), tuple(O + d), cor, 2.6, .22))
        return [(0, x) for x in out]
    cru(s, vet)
    s.esfera(tuple(O), .06, '#2b2f3a', reflexo=False)
    return c.render()

def M15_3():
    """aplicacao em sistemas: pecas numeradas formando a matriz aumentada [1 1 1 | 6; 1 -1 2 | 5; 2 1 -1 | 1] (solucao x = 1, y = 2, z = 3)"""
    c = Cena(-16, 54)
    A = [['1', '1', '1', '6'], ['1', '−1', '2', '5'], ['2', '1', '−1', '1']]
    q = .5; g = .06
    tr = c.add(Obj()); tr.prof = 1e3
    caixa_chanfro(tr, -1.3, 1.3, -.95, .95, 0, .1, .03, '#8a5a32', amb=.45)
    for i in range(3):
        for j in range(4):
            x = -1.0 + j * (q + g) + (.18 if j == 3 else 0); y = .6 - i * (q + g)
            o = c.add(Obj(sombra=False)); o.prof = -10 * i - j
            caixa_chanfro(o, x - q / 2, x + q / 2, y - q / 2, y + q / 2, .1, .22, .03, '#f3e3c0', amb=.5, brilho=.2)
            def nm(cam, x=x, y=y, t=A[i][j]):
                return [(0, texto(cam, t, I, x, y, .222, .26, '#2b2f3a', SANS_B))]
            cru(o, nm)
    bar = c.add(Obj(sombra=False)); bar.prof = -100
    xb = -1.0 + 2.5 * (q + g) + .09
    caixa(bar, xb - .025, xb + .025, -1.0 * (q + g) - q / 2, .6 + q / 2, .1, .26, '#c0302a', brilho=.4)
    def colch(cam):
        out = []
        for s_ in (-1, 1):
            xe = -1.0 - q / 2 - .07 if s_ < 0 else -1.0 + 3 * (q + g) + .18 + q / 2 + .07
            pts = [(xe - s_ * .1, .6 + q / 2, .12), (xe, .6 + q / 2, .12), (xe, .6 - 2 * (q + g) - q / 2, .12), (xe - s_ * .1, .6 - 2 * (q + g) - q / 2, .12)]
            out.append(pl(cam, pts, '#f4efe3', 1.8))
        return [(0, x) for x in out]
    cru(bar, colch)
    return c.render()

# =============================================================== M16 Polinomios e complexos (modulo: azulejos algebricos)
def M16_1():
    """polinomios e relacoes de Girard: arame com a forma de p(x) = (x + 1,5)(x - 0,3)(x - 1,6) passando pelas tres raizes (contas vermelhas) do eixo"""
    c = Cena(-16, 12)
    u = .9
    b = c.add(Obj()); caixa_chanfro(b, -2.2 * u, 2.2 * u, -.35, .35, 0, .12, .03, '#8a5a32', amb=.45)
    zr = 1.25
    for x in (-2.0 * u, 2.0 * u):
        cilindro_liso(b, (x, 0, .12), (0, 0, zr - .12 + .05), .04, cor='#c3c9d1', brilho=.6, ordem=1)
    eixo = c.add(Obj(sombra=False)); eixo.prof = 0
    cilindro_liso(eixo, (-2.05 * u, 0, zr), (4.1 * u, 0, 0), .025, cor='#9aa2ad', brilho=.6)
    p = lambda x: .55 * (x + 1.5) * (x - .3) * (x - 1.6)
    xs = np.linspace(-1.75, 1.95, 90)
    fio = c.add(Obj(sombra=False)); fio.prof = -10
    cru(fio, lambda cam: [(0, tubo_liso(cam, [(x * u, -.02, zr + p(x) * u * .85) for x in xs], 1.9, '#2f6fd0'))], pts=[(x * u, 0, zr + p(x) * u * .85) for x in xs])
    for r in (-1.5, .3, 1.6):
        k = c.add(Obj(sombra=False)); k.prof = -100; k.esfera((r * u, -.03, zr), .085, '#d9473c')
    return c.render()

def M16_2():
    """numeros complexos: plano de Argand em acrilico com z = 3 + i e i.z = -1 + 3i (multiplicar por i gira 90 graus)"""
    c = Cena(-8, 56)
    u = .38
    pl_ = c.add(Obj()); caixa_chanfro(pl_, -2.3 * u, 4.0 * u, -1.3 * u, 4.0 * u, 0, .1, .03, '#f2f4f7', amb=.7, brilho=.3)
    def g(cam):
        out = []; z = .101
        for i in range(-2, 4):
            out.append(lin(cam, (i * u, -1.3 * u, z), (i * u, 4.0 * u, z), '#dde3ea', .5, cap='butt'))
        for j in range(-1, 4):
            out.append(lin(cam, (-2.3 * u, j * u, z), (4.0 * u, j * u, z), '#dde3ea', .5, cap='butt'))
        out.append(lin(cam, (-2.2 * u, 0, z + .001), (3.9 * u, 0, z + .001), '#39404c', 1.1)); out.append(lin(cam, (0, -1.2 * u, z + .001), (0, 3.9 * u, z + .001), '#39404c', 1.1))
        out.append(texto(cam, 'Re', I, 3.5 * u, -.45 * u, z, .2, '#39404c', SERIF_I)); out.append(texto(cam, 'Im', I, -.55 * u, 3.6 * u, z, .2, '#39404c', SERIF_I))
        arco = [(1.1 * u * math.cos(t), 1.1 * u * math.sin(t), z + .002) for t in np.linspace(math.atan2(1, 3), math.atan2(3, -1), 20)]
        out.append(pl(cam, arco, '#e3a33b', 1.6))
        out.append(seta3(cam, (0, 0, z + .003), (3 * u, 1 * u, z + .003), '#d9473c', 2.4, .2))
        out.append(seta3(cam, (0, 0, z + .003), (-1 * u, 3 * u, z + .003), '#2f6fd0', 2.4, .2))
        out.append(texto(cam, 'z', I, 3.25 * u, 1.35 * u, z, .26, '#d9473c', SERIF_I))
        out.append(texto(cam, 'iz', I, -1.25 * u, 3.3 * u, z, .26, '#2f6fd0', SERIF_I))
        return [(0, s) for s in out]
    cru(pl_, g)
    return c.render()

# =============================================================== M17 Logica e algoritmos (modulo: quebra-cabeca)
def M17_1():
    """raciocinio logico e deducao: rei e peao de xadrez sobre o tabuleiro"""
    c = Cena(-22, 24)
    q = .7
    tab = c.add(Obj()); tab.prof = 1e3; caixa_chanfro(tab, -1.5 * q, 1.5 * q, -1.5 * q, 1.5 * q, 0, .12, .03, '#6b4a2f', amb=.45)
    def casas(cam):
        out = []
        for i in range(3):
            for j in range(3):
                x0, y0 = -1.5 * q + i * q, -1.5 * q + j * q
                out.append(poli(cam, [(x0, y0, .121), (x0 + q, y0, .121), (x0 + q, y0 + q, .121), (x0, y0 + q, .121)], '#f0dcb4' if (i + j) % 2 else '#8a5a35'))
        return [(0, s) for s in out]
    cru(tab, casas)
    rei = c.add(Obj()); rei.prof = 0
    perfil = [(.42, 0), (.42, .1), (.34, .16), (.26, .24), (.17, .7), (.15, 1.15), (.26, 1.22), (.17, 1.3), (.2, 1.55), (.12, 1.62)]
    torno(rei, perfil, base=(0, .1, .12), cor='#f1e6cf', brilho=.4, amb=.42, n=40)
    caixa(rei, -.035, .035, .065, .135, 1.74, 2.12, '#f1e6cf', amb=.45, ordem=5)
    caixa(rei, -.13, .13, .065, .135, 1.9, 1.97, '#f1e6cf', amb=.45, ordem=5)
    pe = c.add(Obj()); pe.prof = -10
    perfil = [(.32, 0), (.32, .08), (.25, .13), (.16, .2), (.1, .55), (.18, .6), (.09, .66)]
    torno(pe, perfil, base=(.65, -.6, .12), cor='#2b2b30', brilho=.45, amb=.38, n=40)
    pe.esfera((.65, -.6, .12 + .8), .17, '#2b2b30')
    return c.render()

def M17_2():
    """algoritmos e sistemas de numeracao: soroban (abaco japones) marcando 3 0 7 2 5 - conta de cima vale 5, de baixo vale 1"""
    c = Cena(-10, 10)
    M = transf(math.radians(-10), (0, 0, 0), roll=math.radians(84))
    W, H = 2.9, 1.6; n = 5
    o = c.add(Obj())
    caixaM(o, M, -W / 2, W / 2, 0, .14, -.12, .12, '#5a3a22', amb=.42)
    caixaM(o, M, -W / 2, W / 2, H - .14, H, -.12, .12, '#5a3a22', amb=.42)
    caixaM(o, M, -W / 2, -W / 2 + .14, 0, H, -.12, .12, '#5a3a22', amb=.42)
    caixaM(o, M, W / 2 - .14, W / 2, 0, H, -.12, .12, '#5a3a22', amb=.42)
    zb = H * .66
    caixaM(o, M, -W / 2 + .14, W / 2 - .14, zb - .05, zb + .05, -.08, .08, '#6b4a2f', amb=.45, ordem=3)
    dig = [3, 0, 7, 2, 5]
    c.defs.append(grad_lin('cta', [(0, '#3a1f12'), (.35, '#b0683c'), (.5, '#d9925c'), (.65, '#a35e34'), (1, '#3a1f12')], 0, 0, 0, 1))
    def contas(cam):
        out = []
        for k in range(n):
            x = -W / 2 + .14 + (k + .5) * (W - .28) / n
            out.append(lin(cam, M(x, .14, 0), M(x, H - .14, 0), '#c9b38a', 1.2))
            d = dig[k]; hb = .17
            # conta de cima (5): encostada na barra se d >= 5
            zc = zb + .05 + hb / 2 + (0 if d >= 5 else .26)
            pos = [zc]
            # contas de baixo (1): d % 5 encostadas na barra, o resto embaixo
            m = d % 5
            for i in range(4):
                pos.append(zb - .05 - hb / 2 - i * hb if i < m else .14 + hb / 2 + (3 - i) * hb)
            for zz in pos:
                X, Y = cam.P(*M(x, zz, 0)); k_ = cam.k
                w2, h2 = .23 * k_, hb * .5 * k_
                out.append(f'<path d="M{fmt(X - w2)} {fmt(Y)} L{fmt(X - w2 * .35)} {fmt(Y - h2)} L{fmt(X + w2 * .35)} {fmt(Y - h2)} L{fmt(X + w2)} {fmt(Y)} L{fmt(X + w2 * .35)} {fmt(Y + h2)} L{fmt(X - w2 * .35)} {fmt(Y + h2)}Z" fill="url(#cta)" stroke="#2a160c" stroke-width=".4"/>')
        return [(0, s) for s in out]
    cru(o, contas, ordem=2)
    return c.render()

def M_OUTRO():
    """outros conteudos: a letra pi em metal sobre uma base (simbolo geral da matematica)"""
    c = Cena(-16, 16)
    b = c.add(Obj()); caixa_chanfro(b, -1.0, 1.0, -.5, .5, 0, .18, .05, '#2e3440', amb=.45, brilho=.25)
    Mp = transf(math.radians(-8), (0, .05, .18), roll=math.pi / 2)
    letras3d(c, 'π', 2.1, lambda u, v, w: Mp(u, v + .8, w), .28, '#d6b25a', '#a8862f', '/usr/share/fonts/truetype/dejavu/DejaVuSans-BoldOblique.ttf', brilho=.5, amb=.4)
    return c.render()

TODOS = {}
for _k, _v in list(globals().items()):
    if _k[:1] == 'M' and _k[1:3].isdigit() and '_' in _k: TODOS[_k.replace('_', '.')] = _v
TODOS['M-OUTRO'] = M_OUTRO

if __name__ == '__main__':
    import sys
    alvo = sys.argv[1:] or list(TODOS)
    for k in alvo: grava_sub(k, TODOS[k]())

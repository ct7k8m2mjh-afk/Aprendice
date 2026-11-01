# -*- coding: utf-8 -*-
"""Conteudos M07 a M12."""
from sub_mat_base import *
from motor import _novo_id

# =============================================================== M07 Sequencias (modulo: escada de cubos)
def _pilha_copos(c, cx, cy, n, cor='#d5302f', prof=0, R0=.3, R1=.42, H=1.0, d=.2):
    """n copos plasticos encaixados: cada copo a mais acrescenta a mesma altura d (altura = H + (n-1)d, uma PA)"""
    o = c.add(Obj()); o.prof = prof
    o.extra_pts += [(cx + R1 * math.cos(t), cy + R1 * math.sin(t), zz) for t in np.linspace(0, 2 * math.pi, 12) for zz in (0, H + (n - 1) * d)]
    def fn(cam):
        out = []
        for k in range(n - 1, -1, -1):          # de cima para baixo: o copo de baixo cobre o corpo do de cima
            z0 = k * d
            svg, aro = lateral_tronco(cam, (cx, cy, z0), (0, 0, H), R0, R1, cor, amb=.35, brilho=.45, furo_topo=(k < n - 1))
            out.append(svg)
            if k == n - 1:
                ins = grad_lin(f'cin{id(o)}{k}', [(0, mix(cor, '#000000', .55)), (1, mix(cor, '#ffffff', .1))], 0, 0, 1, 1)
                out.append(f'<defs>{ins}</defs><path d="{caminho([cam.P(*p) for p in aro])}" fill="url(#cin{id(o)}{k})"/>')
            # aro enrolado (borda branca de cima) - so a metade da frente nos copos de baixo
            frente = [p for p in aro if cam.D(*p) < cam.D(cx, cy, z0 + H)]
            ts = np.linspace(0, 2 * math.pi, 73)
            pts = [(cx + R1 * math.cos(t), cy + R1 * math.sin(t), z0 + H) for t in ts]
            if k < n - 1:
                pts = [p for p in pts if cam.D(*p) <= cam.D(cx, cy, z0 + H) + 1e-9]
                pts.sort(key=lambda p: cam.P(*p)[0])
            out.append(pl(cam, pts, mix(cor, '#ffffff', .35), 1.6))
            # frisos
            for f in (.12, .22):
                zz = z0 + H * (1 - f); rr = R0 + (R1 - R0) * (1 - f)
                fr = [(cx + rr * math.cos(t), cy + rr * math.sin(t), zz) for t in ts]
                fr = sorted([p for p in fr if cam.D(*p) <= cam.D(cx, cy, zz) + 1e-9], key=lambda p: cam.P(*p)[0])
                out.append(pl(cam, fr, mix(cor, '#000000', .25), .6, op=.7))
        return [(0, ''.join(out))]
    cru(o, fn)
    return o

def M07_1():
    """progressao aritmetica: pilhas de 1, 3 e 5 copos encaixados - cada copo soma a mesma altura (razao constante)"""
    c = Cena(-20, 22)
    _pilha_copos(c, -1.05, .2, 1, prof=10)
    _pilha_copos(c, 0, .1, 3, prof=5)
    _pilha_copos(c, 1.05, 0, 5, prof=0)
    return c.render()

def _matrioska(cx, by, H, cor, k):
    """boneca russa 2D (vista de frente) com base em by e altura H"""
    W = H * .62; o = []
    g = f'mb{k}'; gf = f'mf{k}'
    o.append(grad_lin(g, [(0, mix(cor, '#000000', .35)), (.3, mix(cor, '#ffffff', .25)), (.55, cor), (1, mix(cor, '#000000', .45))], 0, 0, 1, 0))
    o.append(grad_rad(gf, [(0, '#fff3e6'), (1, '#f1cfae')], cx=.42, cy=.4, r=.6))
    # corpo: perfil de revolucao visto de lado (cabeca + corpo) como um unico path
    hw = W / 2
    d = (f'M{fmt(cx - hw * .78)} {fmt(by)} C{fmt(cx - hw * 1.08)} {fmt(by - H * .3)} {fmt(cx - hw * 1.02)} {fmt(by - H * .55)} {fmt(cx - hw * .62)} {fmt(by - H * .66)} '
         f'C{fmt(cx - hw * .95)} {fmt(by - H * .82)} {fmt(cx - hw * .55)} {fmt(by - H * 1.0)} {fmt(cx)} {fmt(by - H)} '
         f'C{fmt(cx + hw * .55)} {fmt(by - H * 1.0)} {fmt(cx + hw * .95)} {fmt(by - H * .82)} {fmt(cx + hw * .62)} {fmt(by - H * .66)} '
         f'C{fmt(cx + hw * 1.02)} {fmt(by - H * .55)} {fmt(cx + hw * 1.08)} {fmt(by - H * .3)} {fmt(cx + hw * .78)} {fmt(by)}Z')
    s = f'<path d="{d}" fill="url(#{g})"/>'
    # avental (claro) com flor
    s += (f'<path d="M{fmt(cx - hw * .5)} {fmt(by - H * .02)} C{fmt(cx - hw * .7)} {fmt(by - H * .3)} {fmt(cx - hw * .55)} {fmt(by - H * .52)} {fmt(cx)} {fmt(by - H * .56)} '
          f'C{fmt(cx + hw * .55)} {fmt(by - H * .52)} {fmt(cx + hw * .7)} {fmt(by - H * .3)} {fmt(cx + hw * .5)} {fmt(by - H * .02)}Z" fill="#f7efdf" opacity=".95"/>')
    fy = by - H * .3
    for i in range(5):
        t = 2 * math.pi * i / 5
        s += f'<ellipse cx="{fmt(cx + H * .07 * math.cos(t))}" cy="{fmt(fy + H * .07 * math.sin(t))}" rx="{fmt(H*.055)}" ry="{fmt(H*.04)}" transform="rotate({fmt(math.degrees(t))} {fmt(cx + H * .07 * math.cos(t))} {fmt(fy + H * .07 * math.sin(t))})" fill="#d23a3a"/>'
    s += f'<circle cx="{fmt(cx)}" cy="{fmt(fy)}" r="{fmt(H*.035)}" fill="#f2b62f"/>'
    s += f'<path d="M{fmt(cx)} {fmt(fy + H * .09)} Q{fmt(cx - H * .02)} {fmt(fy + H * .2)} {fmt(cx)} {fmt(by - H * .06)}" stroke="#3f8a3a" stroke-width="{fmt(H*.02)}" fill="none"/>'
    # rosto
    fc = by - H * .8
    s += f'<ellipse cx="{fmt(cx)}" cy="{fmt(fc)}" rx="{fmt(hw*.5)}" ry="{fmt(H*.13)}" fill="url(#{gf})"/>'
    s += f'<path d="M{fmt(cx - hw * .5)} {fmt(fc - H * .02)} Q{fmt(cx)} {fmt(fc - H * .2)} {fmt(cx + hw * .5)} {fmt(fc - H * .02)} Q{fmt(cx)} {fmt(fc - H * .1)} {fmt(cx - hw * .5)} {fmt(fc - H * .02)}Z" fill="#6b3a1e"/>'
    for sx in (-1, 1):
        s += f'<circle cx="{fmt(cx + sx * hw * .2)}" cy="{fmt(fc + H * .01)}" r="{fmt(H*.016)}" fill="#2a2a33"/>'
        s += f'<circle cx="{fmt(cx + sx * hw * .3)}" cy="{fmt(fc + H * .06)}" r="{fmt(H*.03)}" fill="#ef8a8a" opacity=".7"/>'
    s += f'<path d="M{fmt(cx - hw * .1)} {fmt(fc + H * .075)} Q{fmt(cx)} {fmt(fc + H * .1)} {fmt(cx + hw * .1)} {fmt(fc + H * .075)}" stroke="#c0302a" stroke-width="{fmt(H*.018)}" fill="none" stroke-linecap="round"/>'
    # brilho de verniz
    s += f'<path d="M{fmt(cx - hw * .62)} {fmt(by - H * .2)} Q{fmt(cx - hw * .82)} {fmt(by - H * .45)} {fmt(cx - hw * .5)} {fmt(by - H * .64)}" stroke="#fff" stroke-width="{fmt(H*.03)}" fill="none" opacity=".45" stroke-linecap="round"/>'
    return '<defs>' + ''.join(o) + '</defs>' + s

def M07_2():
    """progressao geometrica: bonecas russas - cada uma tem 3/4 da altura da anterior (razao constante q = 0,75)"""
    out = ['<filter id="sb" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="2.5"/></filter>']
    H = 120.0; x = 18.0; by = 170
    cores = ['#c8262c', '#2f6fd0', '#e3a33b', '#3f8f5a', '#8a4fb0']
    figs = []
    for k in range(5):
        W = H * .62
        cx = x + W / 2
        out.append(f'<ellipse cx="{fmt(cx + W * .12)}" cy="{fmt(by + 1)}" rx="{fmt(W * .5)}" ry="{fmt(H * .05)}" fill="#1b1d2a" opacity=".22" filter="url(#sb)"/>')
        figs.append(_matrioska(cx, by, H, cores[k], k))
        x += W + 4; H *= .75
    return '<defs></defs>' + ''.join(out) + ''.join(figs)

def M07_3():
    """soma de termos: piramide de latas 4 + 3 + 2 + 1 = 10 (soma de uma PA)"""
    c = Cena(-14, 12)
    r, h = .3, .62
    k = 0
    for fila in range(4):
        n = 4 - fila
        for i in range(n):
            x = (i - (n - 1) / 2) * 2 * r * 1.02; z = fila * h
            o = c.add(Obj(sombra=(fila == 0))); o.prof = -100 * fila + abs(x) * .01
            cilindro_liso(o, (x, 0, z), (0, 0, h), r, cor='#c63d2f', brilho=.4, tampa_cor='#d8dbe0', ordem=2, n=40)
            def faixa(cam, x=x, z=z):
                ts = np.linspace(math.radians(190), math.radians(350), 18)
                out = []
                for z0, z1, cor, op in ((z, z + h * .07, '#c9ccd2', 1), (z + h * .93, z + h, '#c9ccd2', 1), (z + h * .42, z + h * .6, '#f4efe3', .92)):
                    a = [(x + r * 1.003 * math.cos(t), r * 1.003 * math.sin(t), z0) for t in ts]
                    b = [(x + r * 1.003 * math.cos(t), r * 1.003 * math.sin(t), z1) for t in ts[::-1]]
                    out.append(poli(cam, a + b, cor, f' opacity="{op}"' if op != 1 else ''))
                out.append(poli(cam, [(x + r * .8 * math.cos(t), r * .8 * math.sin(t), z + h + .001) for t in np.linspace(0, 2 * math.pi, 24)], 'none', ' stroke="#a9adb5" stroke-width=".7"'))
                return [(0, ''.join(out))]
            cru(o, faixa, ordem=4)
    return c.render()

def M07_4():
    """padroes e recorrencias: girassol - sementes no modelo de Vogel (angulo de ouro 137,5 graus), espirais em numeros de Fibonacci"""
    cx, cy = 100, 92
    ga = math.pi * (3 - math.sqrt(5))
    defs = [grad_rad('mio', [(0, '#5a3a1a'), (.7, '#3b2410'), (1, '#2a190a')]),
            grad_lin('pet', [(0, '#f7c51e'), (1, '#e79a0f')], 0, 0, 0, 1),
            grad_lin('cau', [(0, '#3f7f32'), (.5, '#6bb04f'), (1, '#3f7f32')], 0, 0, 1, 0),
            '<filter id="sb" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="3"/></filter>']
    o = ['<ellipse cx="108" cy="190" rx="34" ry="5" fill="#1b1d2a" opacity=".2" filter="url(#sb)"/>']
    o.append('<path d="M97 140 Q96 168 100 190 L106 190 Q102 168 104 140Z" fill="url(#cau)"/>')
    o.append('<path d="M101 170 Q78 160 70 168 Q84 180 101 176Z" fill="#5d9e44"/><path d="M101 172 Q86 168 74 169" stroke="#3f7f32" stroke-width="1" fill="none"/>')
    R = 40; sy = .92     # disco levemente inclinado (elipse)
    for camada, (n, L, off, cor) in enumerate([(21, 30, .0, '#e7a30f'), (21, 26, ga / 2, '#f6c21c')]):
        for i in range(n):
            t = 2 * math.pi * i / n + off
            px, py = cx + (R + L * .45) * math.cos(t), cy + (R + L * .45) * math.sin(t) * sy
            o.append(f'<ellipse cx="{fmt(px)}" cy="{fmt(py)}" rx="{fmt(L*.55)}" ry="{fmt(L*.17)}" fill="{cor}" stroke="#c9810c" stroke-width=".5" transform="rotate({fmt(math.degrees(math.atan2(math.sin(t) * sy, math.cos(t))))} {fmt(px)} {fmt(py)})"/>')
    o.append(f'<ellipse cx="{cx}" cy="{cy}" rx="{R + 2}" ry="{fmt((R + 2) * sy)}" fill="url(#mio)"/>')
    N = 260; c_ = R / math.sqrt(N) * .98
    for n in range(1, N):
        r = c_ * math.sqrt(n); t = n * ga
        x, y = cx + r * math.cos(t), cy + r * math.sin(t) * sy
        tam = .95 + .6 * r / R
        cor = '#7a5226' if n % 2 else '#694419'
        o.append(f'<circle cx="{fmt(x)}" cy="{fmt(y)}" r="{fmt(tam)}" fill="{cor}"/>')
    o.append(f'<ellipse cx="{cx - 12}" cy="{cy - 14}" rx="16" ry="9" fill="#fff" opacity=".08"/>')
    return '<defs>' + ''.join(defs) + '</defs>' + ''.join(o)

# =============================================================== M08 Geometria plana - areas (modulo: placas)
def M08_1():
    """triangulos: triangulo de sinuca (equilatero) com as 15 bolas sobre o feltro"""
    c = Cena(-16, 50)
    r = .2; d = 2 * r
    feltro = c.add(Obj()); feltro.prof = 1e4; caixa(feltro, -1.55, 1.55, -1.2, 1.35, -.06, 0, '#2f7d4f', amb=.6)
    # 5 fileiras (5 na frente, 1 no fundo), centros num triangulo equilatero de lado 4d
    cores = ['#f2c230', '#2f5fc0', '#d6392f', '#6b3fa0', '#ee7a22', '#2c8a4a', '#8a2a2a', '#16171b', '#f2c230', '#2f5fc0', '#d6392f', '#6b3fa0', '#ee7a22', '#2c8a4a', '#8a2a2a']
    ordem = [8, 0, 9, 1, 10, 2, 7, 11, 3, 12, 4, 13, 5, 14, 6]
    h3 = math.sqrt(3) / 2
    centros = []
    for fila in range(5):
        n = 5 - fila
        for i in range(n):
            centros.append(((i - (n - 1) / 2) * d, -.75 + fila * d * h3))
    for k, (x, y) in enumerate(centros):
        idx = ordem[k]; cor = cores[idx]; listrada = idx >= 8
        o = c.add(Obj(sombra=False)); o.prof = -y * 10 - 100
        o.esfera((x, y, r), r, '#f4f1e6' if listrada else cor)
        if listrada:
            def faixa(cam, x=x, y=y, cor=cor):
                X, Y = cam.P(x, y, r); R = r * cam.k; gid = _novo_id('cb')
                return [(0, f'<clipPath id="{gid}"><circle cx="{fmt(X)}" cy="{fmt(Y)}" r="{fmt(R)}"/></clipPath>'
                            f'<g clip-path="url(#{gid})"><path d="M{fmt(X - R)} {fmt(Y - R * .42)} Q{fmt(X)} {fmt(Y - R * .62)} {fmt(X + R)} {fmt(Y - R * .42)} L{fmt(X + R)} {fmt(Y + R * .36)} Q{fmt(X)} {fmt(Y + R * .2)} {fmt(X - R)} {fmt(Y + R * .36)}Z" fill="{cor}" opacity=".93"/></g>'
                            f'<ellipse cx="{fmt(X - R * .36)}" cy="{fmt(Y - R * .4)}" rx="{fmt(R * .24)}" ry="{fmt(R * .14)}" fill="#fff" opacity=".8" transform="rotate(-30 {fmt(X - R * .36)} {fmt(Y - R * .4)})"/>')]
            cru(o, faixa, ordem=5)
    # triangulo de madeira em volta (contorno paralelo aos lados, afastado r + folga)
    vt = [(-2 * d, -.75), (2 * d, -.75), (0, -.75 + 4 * d * h3)]
    cen = (0, -.75 + 4 * d * h3 / 3)
    def afasta(p, k): return (cen[0] + (p[0] - cen[0]) * k, cen[1] + (p[1] - cen[1]) * k)
    kin = 1 + (r + .02) / (4 * d * h3 / 3) * 2; kout = kin + .26
    ext = [afasta(p, kout) for p in vt]; inn = [afasta(p, kin) for p in vt][::-1]
    t = c.add(Obj()); t.prof = 50
    extrusao(t, ext, 0, .2, '#a8743e', '#8a5a2b', furos=[inn], brilho=.3, amb=.4)
    return c.render()

def M08_2():
    """quadrilateros: pipa (deltoide: dois pares de lados consecutivos iguais), varetas em cruz e rabiola"""
    c = Cena(-10, 8)
    M = transf(math.radians(-12), (0, 0, 0), roll=math.radians(80))
    T, Lf, B, Rt = (0, 2.0), (-1.0, 1.15), (0, -.8), (1.0, 1.15)
    X = (0, 1.15)
    tris = [((T, Lf, X), '#d9473c'), ((T, X, Rt), '#f2c230'), ((Lf, B, X), '#f2c230'), ((X, B, Rt), '#d9473c')]
    o = c.add(Obj(sombra=False))
    for (a, b, cc), cor in tris:
        o.face([M(*a, 0), M(*b, 0), M(*cc, 0)], cor, dupla=True, amb=.55, brilho=.15)
    def varetas(cam):
        out = [lin(cam, M(*T, -.02), M(*B, -.02), '#8a5a2b', 1.6), lin(cam, M(*Lf, -.02), M(*Rt, -.02), '#8a5a2b', 1.6)]
        borda = [M(*p, .001) for p in (T, Rt, B, Lf, T)]
        out.append(pl(cam, borda, '#5a3a1e', .7))
        # rabiola
        cauda = [M(0 + .22 * math.sin(i * 1.1), -.8 - i * .26, 0) for i in range(6)]
        out.append(pl(cam, cauda, '#5a3a1e', .7))
        for i in (1, 3, 5):
            p = cauda[i]; P = np.array(cam.P(*p))
            cor = '#2f6fd0' if i in (1, 5) else '#3f8f5a'
            out.append(f'<path d="M{fmt(P[0])} {fmt(P[1])} L{fmt(P[0]-5)} {fmt(P[1]-3)} L{fmt(P[0]-5)} {fmt(P[1]+3)}Z M{fmt(P[0])} {fmt(P[1])} L{fmt(P[0]+5)} {fmt(P[1]-3)} L{fmt(P[0]+5)} {fmt(P[1]+3)}Z" fill="{cor}"/>')
        # linha
        out.append(pl(cam, [M(*X, -.02), M(.7, .5, -.5), M(1.3, -.1, -1.0)], '#6b7480', .6))
        return [(0, s) for s in out]
    cru(o, varetas, ordem=4, pts=[M(0, -2.2, 0), M(1.3, -.1, -1.0)])
    return c.render()

def M08_3():
    """circunferencia e circulo: compasso tracando uma circunferencia (ponta seca no centro, raio = abertura)
    (correcao da revisao de 29/10: muito palido a 64 px; agora o compasso e mais grosso, o traco da circunferencia
    mais escuro e largo, o raio em vermelho continuo e o papel mais justo)"""
    c = Cena(-22, 30)
    pap = c.add(Obj()); pap.prof = 1e4; caixa(pap, -1.25, 1.25, -1.15, 1.2, -.02, 0, '#fbfbf8', amb=.85)
    R = .95; ang = math.radians(-35)
    C = np.array((0, 0, 0.0)); Pt = np.array((R * math.cos(ang), R * math.sin(ang), 0.0))
    def risco(cam):
        ts = np.linspace(ang - math.radians(300), ang, 120)
        out = [pl(cam, [(R * math.cos(t), R * math.sin(t), .002) for t in ts], '#1f2430', 3.4)]
        out.append(pl(cam, [(R * math.cos(t), R * math.sin(t), .002) for t in np.linspace(ang, ang + math.radians(60), 20)], '#6a707a', 1.1, extra=' stroke-dasharray="3 3"'))
        out.append(f'<path d="M{fmt(cam.P(0, 0, .002)[0])} {fmt(cam.P(0, 0, .002)[1])} L{fmt(cam.P(R * math.cos(math.radians(140)), R * math.sin(math.radians(140)), .002)[0])} {fmt(cam.P(R * math.cos(math.radians(140)), R * math.sin(math.radians(140)), .002)[1])}" stroke="#d9473c" stroke-width="2.6" stroke-linecap="round"/>')
        q = (R * .5 * math.cos(math.radians(140)), R * .5 * math.sin(math.radians(140)))
        out.append(texto(cam, 'r', I, q[0] + .1, q[1] + .16, .003, .34, '#d9473c', SERIF_I))
        out.append(poli(cam, [(.03 * math.cos(t), .03 * math.sin(t), .003) for t in np.linspace(0, 2 * math.pi, 10)], '#2b2f3a'))
        return [(0, s) for s in out]
    cru(pap, risco)
    Hj = 2.1
    Hp = (C + Pt) / 2 + np.array((0, 0, Hj))
    comp = c.add(Obj()); comp.prof = -100
    def perna(a, b, rr, cor, ordem):
        cilindro_liso(comp, tuple(a), tuple(b - a), rr, cor=cor, brilho=.6, amb=.35, ordem=ordem)
    v1 = (C - Hp); v2 = (Pt - Hp)
    perna(Hp, Hp + v1 * .9, .105, '#aab2bd', 2); perna(Hp + v1 * .9, C, .015, '#7a818c', 2)          # ponta seca
    perna(Hp, Hp + v2 * .82, .105, '#aab2bd', 3); perna(Hp + v2 * .82, Hp + v2 * .93, .09, '#f2c230', 4); perna(Hp + v2 * .93, Pt, .04, '#2b2f3a', 4)   # grafite
    cilindro_liso(comp, tuple(Hp - (0, 0, .02)), (0, 0, .42), .09, cor='#6f7782', brilho=.6, ordem=5)
    comp.esfera(tuple(Hp), .16, '#8d96a2', reflexo=True)
    return c.render()

def M08_4():
    """poligonos regulares: porca sextavada (hexagono regular: 6 lados iguais e angulos internos de 120 graus)"""
    c = Cena(-24, 40)
    R = 1.25; e = .62
    hexa = [(R * math.cos(math.radians(30 + 60 * i)), R * math.sin(math.radians(30 + 60 * i))) for i in range(6)]
    furo = [(.55 * math.cos(t), .55 * math.sin(t)) for t in np.linspace(2 * math.pi, 0, 48, endpoint=False)]
    o = c.add(Obj()); extrusao(o, hexa, 0, e, '#c9ced6', '#aab1bb', furos=[furo], brilho=.55, amb=.4)
    def rosca(cam):
        out = []
        P = [cam.P(.55 * math.cos(t), .55 * math.sin(t), e + .001) for t in np.linspace(0, 2 * math.pi, 48, endpoint=False)]
        gid = _novo_id('fu'); gg = _novo_id('fg')
        out.append(f'<clipPath id="{gid}"><path d="{caminho(P)}"/></clipPath>')
        out.append(grad_lin(gg, [(0, '#3f444c'), (.6, '#6c737d'), (1, '#9aa1ab')], 0, 0, 0, 1))
        out.append(f'<path d="{caminho(P)}" fill="url(#{gg})"/>')
        g = ''
        for k in range(1, 9):
            z = e - k * .075
            arco = [(.55 * math.cos(t), .55 * math.sin(t), z) for t in np.linspace(math.radians(0), math.radians(180), 30)]
            g += pl(cam, arco, '#2e3238', .9, op=.7) + pl(cam, [(x, y, zz - .02) for x, y, zz in arco], '#b7bec8', .6, op=.6)
        out.append(f'<g clip-path="url(#{gid})">{g}</g>')
        out.append(poli(cam, [(1.08 * math.cos(t), 1.08 * math.sin(t), e + .001) for t in np.linspace(0, 2 * math.pi, 60)], 'none', ' stroke="#eef1f5" stroke-width="1.4" opacity=".8"'))
        out.append(f'<path d="{caminho(P)}" fill="none" stroke="#e9edf2" stroke-width="1.2"/>')
        return [(0, x) for x in out]
    cru(o, rosca, ordem=4)
    return c.render()

def M08_5():
    """areas compostas e hachuradas: azulejo quadrado com quatro quartos de circulo nos cantos; a regiao central hachurada tem area L^2 - pi(L/2)^2"""
    c = Cena(-22, 50)
    L = 2.4; h = L / 2; e = .12; r = h
    o = c.add(Obj()); caixa_chanfro(o, -h, h, -h, h, 0, e, .03, '#f6f3ec', amb=.6, brilho=.3)
    cantos = [(-h, -h), (h, -h), (h, h), (-h, h)]
    def pint(cam):
        out = []
        z = e + .002
        for k, (cx, cy) in enumerate(cantos):
            a0 = math.radians(90 * k)
            pts = [(cx, cy, z)] + [(cx + r * math.cos(a0 + t), cy + r * math.sin(a0 + t), z) for t in np.linspace(0, math.pi / 2, 24)]
            out.append(poli(cam, pts, '#2f6fa8'))
        # hachuras a 45 graus so fora dos quartos de circulo
        for k in np.arange(-2 * h, 2 * h, .12):
            seg = []; atual = []
            for t in np.linspace(-h, h, 140):
                x, y = t, t + k
                ok = abs(y) <= h - .01 and all(math.hypot(x - cx, y - cy) > r + .015 for cx, cy in cantos)
                if ok: atual.append((x, y, z + .001))
                elif atual: seg.append(atual); atual = []
            if atual: seg.append(atual)
            for sgm in seg:
                if len(sgm) > 1: out.append(pl(cam, sgm, '#c0452f', .9))
        return [(0, s) for s in out]
    cru(o, pint)
    return c.render()

# =============================================================== M09 Geometria plana - relacoes (modulo: esquadro e transferidor)
def _placa_grade(c, poli2, cor, e, n_u, base, eu, ev, prof=None):
    o = c.add(Obj())
    if prof is not None: o.prof = prof
    extrusao(o, poli2, 0, e, cor, mix(cor, '#000000', .25), brilho=.25, amb=.42)
    def grade(cam):
        out = []
        b = np.array(base); U = np.array(eu); V = np.array(ev)
        for i in range(1, n_u):
            a1 = b + U * i; a2 = a1 + V * n_u
            out.append(lin(cam, (a1[0], a1[1], e + .001), (a2[0], a2[1], e + .001), mix(cor, '#000000', .35), .7, cap='butt'))
            a1 = b + V * i; a2 = a1 + U * n_u
            out.append(lin(cam, (a1[0], a1[1], e + .001), (a2[0], a2[1], e + .001), mix(cor, '#000000', .35), .7, cap='butt'))
        return [(0, s) for s in out]
    cru(o, grade)
    return o

def M09_1():
    """teorema de Pitagoras: triangulo 3-4-5 com quadrados de ladrilhos nos lados: 9 + 16 = 25"""
    c = Cena(-14, 52)
    u = .3; e = .1
    O, B, A = np.array((0, 0)), np.array((4, 0)), np.array((0, 3))
    n = np.array((3, 4))
    sq = lambda *pts: [tuple(p * u) for p in pts]
    _placa_grade(c, sq(O, np.array((0, -4)) + 0, np.array((4, -4)), B)[::-1] if False else sq(np.array((0, -4)), np.array((4, -4)), B, O), '#4f86c9', e, 4, (0, -4 * u), (u, 0), (0, u))
    _placa_grade(c, sq(np.array((-3, 0)), O, A, np.array((-3, 3))), '#d9473c', e, 3, (-3 * u, 0), (u, 0), (0, u))
    _placa_grade(c, sq(A, B, B + n, A + n), '#e9b53e', e, 5, tuple(A * u), tuple((B - A) / 5 * u), tuple(n / 5 * u))
    t = c.add(Obj()); extrusao(t, sq(O, B, A), 0, e * 1.4, '#f4f1e8', '#cfc8b6', amb=.55)
    def marca(cam):
        z = e * 1.4 + .001
        return [(0, poli(cam, [(0, 0, z), (.35 * u * 2, 0, z), (.35 * u * 2, .35 * u * 2, z), (0, .35 * u * 2, z)], 'none', ' stroke="#2b2f3a" stroke-width=".9"'))]
    cru(t, marca, ordem=5)
    rot = c.add(Obj(sombra=False)); rot.prof = -1e6
    def rotulos(cam):
        out = []
        for txt, p in (('9', (-1.5, 1.5)), ('16', (2, -2)), ('25', tuple(((A + B) / 2 + n / 2)))):
            out.append(texto(cam, txt, I, p[0] * u, p[1] * u, e + .002, .45 if txt == '25' else .38, '#ffffff', SANS_B))
        return [(0, s) for s in out]
    cru(rot, rotulos)
    return c.render()

def M09_2():
    """teorema de Tales: folha pautada (retas paralelas) cortada por duas transversais - segmentos correspondentes proporcionais"""
    c = Cena(-18, 48)
    W, H = 2.2, 2.7
    pap = c.add(Obj()); caixa(pap, -W / 2, W / 2, -H / 2, H / 2, -.02, 0, '#fdfcf7', amb=.85)
    ys = [-.9 + .45 * k for k in range(5)]
    t1 = lambda y: -.55 + (y + 1.2) * .1          # transversal 1 (quase vertical)
    t2 = lambda y: .05 + (y + 1.2) * .42          # transversal 2 (inclinada)
    def folha(cam):
        out = []
        for y in np.arange(-H / 2 + .2, H / 2 - .1, .225):
            out.append(lin(cam, (-W / 2, y, .001), (W / 2, y, .001), '#a9c8e6', .6, cap='butt'))
        out.append(lin(cam, (-W / 2 + .3, -H / 2, .001), (-W / 2 + .3, H / 2, .001), '#e28a8a', .8, cap='butt'))
        for y in ys:
            out.append(lin(cam, (-W / 2, y, .002), (W / 2, y, .002), '#2f6fd0', 2.0, cap='butt'))
        for f, cor in ((t1, '#2b2f3a'), (t2, '#2b2f3a')):
            out.append(lin(cam, (f(-1.25), -1.25, .003), (f(1.2), 1.2, .003), cor, 1.7))
            for y in ys:
                out.append(poli(cam, [(f(y) + .055 * math.cos(t), y + .055 * math.sin(t), .004) for t in np.linspace(0, 2 * math.pi, 12)], '#d9473c'))
        return [(0, s) for s in out]
    cru(pap, folha)
    # regua transparente apoiada na transversal 2
    ang = math.atan2(1, .42); M = transf(ang, (t2(0) + .2 * math.sin(ang), -.2 * math.cos(ang) * 0 + 0, .0))
    r = c.add(Obj(sombra=False)); r.prof = -100
    d = np.array((math.cos(ang), math.sin(ang))); nrm = np.array((math.sin(ang), -math.cos(ang)))
    p0 = np.array((t2(-1.3), -1.3)) + nrm * .06; p1 = np.array((t2(1.25), 1.25)) + nrm * .06
    quad = [(*(p0), .02), (*(p1), .02), (*(p1 + nrm * .4), .02), (*(p0 + nrm * .4), .02)]
    r.face([(x, y, .05) for x, y, _ in quad], '#cfe3f0', opac=.5, contorno='#7f96a8', sw=.6)
    def ticks(cam):
        out = []
        L = np.linalg.norm(p1 - p0)
        for i in range(int(L / .08)):
            a = p0 + d * i * .08; ll = .12 if i % 5 == 0 else .07
            out.append(lin(cam, (a[0], a[1], .051), (a[0] + nrm[0] * ll, a[1] + nrm[1] * ll, .051), '#33414c', .5, cap='butt'))
        return [(0, s) for s in out]
    cru(r, ticks, ordem=5)
    return c.render()

def M09_3():
    """semelhanca de triangulos: obelisco e bastao com suas sombras - raios de sol paralelos, altura proporcional a sombra"""
    c = Cena(-30, 22)
    ob = c.add(Obj())
    b, t, Hc = .32, .22, 2.4
    solido_convexo(ob, [(x, y, 0) for x in (-b, b) for y in (-b, b)] + [(x, y, Hc) for x in (-t, t) for y in (-t, t)], '#d8bd8a', amb=.42, brilho=.15)
    solido_convexo(ob, [(x, y, Hc) for x in (-t, t) for y in (-t, t)] + [(0, 0, Hc + .32)], '#e2c897', amb=.42, brilho=.2)
    def fiadas(cam):
        out = []
        for k in range(1, 9):
            z = Hc * k / 9; w = b + (t - b) * k / 9
            out.append(lin(cam, (-w, -w - .002, z), (w, -w - .002, z), '#b39663', .6, cap='butt'))
            out.append(lin(cam, (w + .002, -w, z), (w + .002, w, z), '#a3864f', .6, cap='butt'))
        return [(0, s) for s in out]
    cru(ob, fiadas, ordem=4)
    st = c.add(Obj()); sx, sy, hs = -1.1, -1.0, .8
    cilindro_liso(st, (sx, sy, 0), (0, 0, hs), .045, cor='#8a5a2b', brilho=.4)
    raio = c.add(Obj(sombra=False)); raio.prof = -1e3
    def raios(cam):
        out = []
        for top in ((0, 0, Hc + .32), (sx, sy, hs)):
            S = no_chao(top, 0); base = (top[0], top[1], 0)
            P = lambda q: cam.P(*q)
            a, bb, cc = P(top), P(S), P(base)
            out.append(f'<path d="M{fmt(a[0])} {fmt(a[1])} L{fmt(bb[0])} {fmt(bb[1])} L{fmt(cc[0])} {fmt(cc[1])}" fill="none" stroke="#e08a2e" stroke-width="1" stroke-dasharray="3 2"/>')
        return [(0, s) for s in out]
    cru(raio, raios)
    return c.render()

def M09_4():
    """relacoes metricas no triangulo retangulo: triangulo 3-4-5 de madeira cortado pela altura h: m = 1,8, n = 3,2, h^2 = m.n"""
    c = Cena(-16, 50)
    u = .5; e = .16; g = .07
    A, H_, B, C = np.array((0, 0)), np.array((1.8, 0)), np.array((5, 0)), np.array((1.8, 2.4))
    off = np.array((-2.5, -1.0))
    p1 = [tuple((p + off) * u) for p in (A, H_, C)]
    p2 = [tuple((p + off + (g / u, 0)) * u) for p in (H_, B, C)]
    o1 = c.add(Obj()); extrusao(o1, p1, 0, e, '#e2b878', '#c4975a', brilho=.2, amb=.42)
    o2 = c.add(Obj()); extrusao(o2, p2, 0, e, '#c98e52', '#a8733f', brilho=.2, amb=.42)
    def marcas(cam):
        z = e + .002; out = []
        hx_ = (H_ + off) * u; s = .22
        out.append(poli(cam, [(hx_[0] - s, hx_[1], z), (hx_[0] - s, hx_[1] + s, z), (hx_[0], hx_[1] + s, z)], 'none', ' stroke="#3b2c16" stroke-width=".9"'))
        hx2 = hx_ + np.array((g, 0))
        out.append(poli(cam, [(hx2[0] + s, hx2[1], z), (hx2[0] + s, hx2[1] + s, z), (hx2[0], hx2[1] + s, z)], 'none', ' stroke="#3b2c16" stroke-width=".9"'))
        for txt, p in (('m', ((A + H_) / 2 + (0, .3))), ('n', ((H_ + B) / 2 + (0, .3))), ('h', (1.55, 1.1)), ('h', (2.05 + g / u, 1.1))):
            q = (np.array(p) + off) * u
            out.append(texto(cam, txt, I, q[0], q[1], z, .3, '#3b2c16', SERIF_I))
        return [(0, s) for s in out]
    m = c.add(Obj(sombra=False)); m.prof = -1e3; cru(m, marcas)
    return c.render()

def M09_5():
    """angulos: triangulo de papel com os tres angulos coloridos e as tres pontas recortadas juntas sobre uma reta - somam 180 graus"""
    c = Cena(-10, 58)
    A, B, C = np.array((0, 0)), np.array((3.2, 0)), np.array((1.05, 2.1))
    sh = np.array((-1.6, .3))
    u = .5; e = .02
    def ang(p, q): return math.atan2(q[1] - p[1], q[0] - p[0])
    tri = c.add(Obj()); extrusao(tri, [tuple((p + sh) * u) for p in (A, B, C)], 0, e * 2, '#f3ead2', '#b9ae90', amb=.7, contorno='#b9ae90', sw=.6)
    cores = {'A': '#d9473c', 'B': '#2f6fd0', 'C': '#e9b53e'}
    R = .62
    setores = {'A': (A, ang(A, B), ang(A, C)), 'B': (B, ang(B, C), ang(B, A) + 2 * math.pi if ang(B, A) < ang(B, C) else ang(B, A)), 'C': (C, ang(C, A), ang(C, B) + 2 * math.pi if ang(C, B) < ang(C, A) else ang(C, B))}
    def pinta(cam):
        out = []
        for k, (V, a0, a1) in setores.items():
            pts = [tuple((V + sh) * u) + (2 * e + .001,)] + [(((V + sh) * u)[0] + R * u * math.cos(t), ((V + sh) * u)[1] + R * u * math.sin(t), 2 * e + .001) for t in np.linspace(a0, a1, 20)]
            out.append(poli(cam, pts, cores[k], ' opacity=".9"'))
        return [(0, s) for s in out]
    cru(tri, pinta)
    # as tres pontas lado a lado num ponto P de uma reta: A, C, B formam um angulo raso
    P = np.array((0.05, -.95))
    lado = c.add(Obj(sombra=False)); lado.prof = 1e3
    def reta(cam):
        return [(0, lin(cam, (P[0] - 1.6 * u * 1.6, P[1], .001), (P[0] + 1.6 * u * 1.6, P[1], .001), '#3b3f48', 1.2))]
    cru(lado, reta, pts=[(P[0] - 2.6 * u, P[1], 0), (P[0] + 2.6 * u, P[1], 0)])
    inicio = 0.0
    Rp = 1.25 * u
    for k in ('A', 'C', 'B'):
        V, a0, a1 = setores[k]; da = a1 - a0
        pts = [tuple(P)] + [(P[0] + Rp * math.cos(t), P[1] + Rp * math.sin(t)) for t in np.linspace(inicio, inicio + da, 24)]
        o = c.add(Obj()); extrusao(o, pts, 0, e * 2, mix(cores[k], '#ffffff', .1), mix(cores[k], '#000000', .2), amb=.6, contorno=mix(cores[k], '#000000', .3), sw=.5)
        inicio += da
    return c.render()

# =============================================================== M10 Trigonometria (modulo: circulo trigonometrico)
def M10_1():
    """razoes trigonometricas: escada apoiada no muro - altura = L sen(theta), afastamento = L cos(theta)"""
    c = Cena(-30, 18)
    mu = c.add(Obj()); mu.prof = 100
    caixa(mu, -.25, 0, -1.0, 1.0, 0, 2.7, '#c4683f', amb=.4)
    def tijolos(cam):
        out = []
        for i in range(1, 18):
            z = i * .15
            out.append(lin(cam, (.002, -1.0, z), (.002, 1.0, z), '#e8d6c4', .8, cap='butt'))
        for i in range(18):
            for j in range(9):
                y = -1.0 + j * .25 + (.125 if i % 2 else 0)
                if -1 < y < 1: out.append(lin(cam, (.002, y, i * .15), (.002, y, (i + 1) * .15), '#e8d6c4', .8, cap='butt'))
        out.append(poli(cam, [(.003, -1, 0), (.003, 1, 0), (.003, 1, 2.7), (.003, -1, 2.7)], 'none', ''))
        return [(0, s) for s in out]
    cru(mu, tijolos)
    L = 2.75; th = math.radians(62)
    pe = (L * math.cos(th) + .02, 0); topo_z = L * math.sin(th)
    esc = c.add(Obj()); esc.prof = -10
    d = np.array((-math.cos(th), 0, math.sin(th)))
    for y in (-.32, .32):
        a = np.array((pe[0], y, 0)); b = a + d * L
        solido_convexo(esc, [tuple(p + np.array(q)) for p in (a, b) for q in ((.04, -.04, 0), (-.04, -.04, 0), (.04, .04, 0), (-.04, .04, 0))], '#d9a441', amb=.4, brilho=.3)
    for k in range(1, 9):
        p = np.array((pe[0], 0, 0)) + d * (L * k / 9)
        cilindro_liso(esc, tuple(p + (0, -.32, 0)), (0, .64, 0), .03, cor='#c48e2c', brilho=.4, ordem=1)
    an = c.add(Obj(sombra=False)); an.prof = -100
    def angulo(cam):
        out = []
        arco = [(pe[0] - .45 * math.cos(t), -.45, .45 * math.sin(t)) for t in np.linspace(0, th, 16)]
        out.append(pl(cam, arco, '#2f6fd0', 1.4))
        out.append(texto(cam, 'θ', I, pe[0] - .62, -.45, .2, .26, '#2f6fd0', SERIF_I, (1, 0, 0), (0, 0, 1)))
        out.append(f'<path d="M{fmt(cam.P(pe[0], -.45, 0)[0])} {fmt(cam.P(pe[0], -.45, 0)[1])} L{fmt(cam.P(0, -.45, 0)[0])} {fmt(cam.P(0, -.45, 0)[1])}" stroke="#2b2f3a" stroke-width=".8" stroke-dasharray="3 2"/>')
        return [(0, s) for s in out]
    cru(an, angulo, pts=[(pe[0], -.45, 0)])
    return c.render()

def M10_2():
    """lei dos senos: teodolito sobre tripe, o instrumento da triangulacao (a/sen A = b/sen B = c/sen C)"""
    c = Cena(-24, 14)
    o = c.add(Obj())
    topo = np.array((0, 0, 1.55))
    for k in range(3):
        t = math.radians(90 + 120 * k); pe = np.array((.95 * math.cos(t), .95 * math.sin(t), 0))
        cilindro_liso(o, tuple(pe), tuple(topo - pe), .04, .055, cor='#c9a26a', brilho=.35, ordem=0)
        cilindro_liso(o, tuple(pe), tuple((topo - pe) * .1), .02, .04, cor='#3b3f48', brilho=.4, ordem=1)
    ins = c.add(Obj(sombra=False)); ins.prof = -100
    cilindro_liso(ins, (0, 0, 1.55), (0, 0, .1), .32, cor='#3b3f48', brilho=.35, ordem=0)
    cilindro_liso(ins, (0, 0, 1.65), (0, 0, .14), .26, cor='#2f6fd0', brilho=.4, ordem=1)
    caixa(ins, -.3, .3, -.2, .2, 1.79, 1.95, '#f2c230', brilho=.3, ordem=2)
    for x in (-.28, .2):
        caixa(ins, x, x + .08, -.12, .12, 1.95, 2.4, '#f2c230', brilho=.3, ordem=3)
    caixa(ins, -.28, .28, -.16, .16, 2.4, 2.48, '#e6b52a', brilho=.3, ordem=4)
    ang = math.radians(-35); dv = np.array((math.cos(ang) * .2, math.sin(ang), .12)); dv /= np.linalg.norm(dv)
    ctr = np.array((-.04, 0, 2.22))
    cilindro_liso(ins, tuple(ctr - dv * .45), tuple(dv * .9), .11, .13, cor='#2b2f3a', brilho=.4, ordem=5, tampa_cor='#7fb3d9')
    return c.render()

def M10_3():
    """lei dos cossenos: relogio as 2 h - a distancia entre as pontas dos ponteiros: d^2 = a^2 + b^2 - 2ab cos 60"""
    c = Cena(-20, 12)
    M = transf(math.radians(-14), (0, 0, 0), roll=math.radians(90))
    R = 1.3; e = .22
    o = c.add(Obj())
    cilindro_liso(o, M(0, 0, -e), tuple(np.array(M(0, 0, .02)) - np.array(M(0, 0, -e))), R * 1.08, R * 1.08, cor='#2f4f7a', brilho=.4, tampa_cor='#2f4f7a', ordem=0)
    def face(cam):
        out = []
        out.append(poli(cam, [M(R * math.cos(t), R * math.sin(t), .025) for t in np.linspace(0, 2 * math.pi, 72, endpoint=False)], '#fbfaf6'))
        for i in range(60):
            t = math.pi / 2 - 2 * math.pi * i / 60; L = .16 if i % 5 == 0 else .07
            out.append(lin(cam, M((R - .06) * math.cos(t), (R - .06) * math.sin(t), .027), M((R - .06 - L) * math.cos(t), (R - .06 - L) * math.sin(t), .027), '#2b2f3a', 1.3 if i % 5 == 0 else .5, cap='butt'))
        for n, k in ((12, 0), (3, 3), (6, 6), (9, 9)):
            t = math.pi / 2 - 2 * math.pi * k / 12
            out.append(texto(cam, str(n), M, (R - .42) * math.cos(t), (R - .42) * math.sin(t), .027, .28, '#2b2f3a', SANS_B, (1, 0, 0), (0, 1, 0)))
        th_h = math.pi / 2 - 2 * math.pi * 2 / 12; th_m = math.pi / 2
        a, b = .62 * R, .86 * R
        Ph = M(a * math.cos(th_h), a * math.sin(th_h), .05); Pm = M(b * math.cos(th_m), b * math.sin(th_m), .05)
        arco = [M(.32 * math.cos(t), .32 * math.sin(t), .04) for t in np.linspace(th_h, th_m, 16)]
        out.append(pl(cam, arco, '#2f6fd0', 1.3))
        out.append(lin(cam, M(-.08 * math.cos(th_h), -.08 * math.sin(th_h), .04), Ph, '#1f2228', 4.2))
        out.append(lin(cam, M(-.1 * math.cos(th_m), -.1 * math.sin(th_m), .045), Pm, '#1f2228', 2.6))
        out.append(f'<path d="M{fmt(cam.P(*Ph)[0])} {fmt(cam.P(*Ph)[1])} L{fmt(cam.P(*Pm)[0])} {fmt(cam.P(*Pm)[1])}" stroke="#d9473c" stroke-width="1.6" stroke-dasharray="3.5 2.5"/>')
        out.append(poli(cam, [M(.07 * math.cos(t), .07 * math.sin(t), .06) for t in np.linspace(0, 2 * math.pi, 14)], '#d9473c'))
        # vidro
        out.append(poli(cam, [M(R * .95 * math.cos(t), R * .95 * math.sin(t), .07) for t in np.linspace(math.radians(100), math.radians(170), 14)] + [M(R * .55 * math.cos(t), R * .55 * math.sin(t), .07) for t in np.linspace(math.radians(170), math.radians(100), 14)], '#ffffff', ' opacity=".35"'))
        return [(0, s) for s in out]
    cru(o, face, ordem=4)
    return c.render()

def M10_4():
    """ciclo trigonometrico e arcos: roda-gigante - a altura de cada cabine varia com o seno do angulo de giro"""
    c = Cena(-18, 10)
    Rr = 1.5; Hc = 1.85; n = 8
    est = c.add(Obj()); est.prof = 100
    for y in (-.28, .28):
        for x in (-1.0, 1.0):
            cilindro_liso(est, (x, y, 0), (-x, 0, Hc), .05, cor='#8d949e', brilho=.4)
    caixa(est, -1.3, 1.3, -.45, .45, 0, .08, '#9aa2ad', amb=.5)
    rd = c.add(Obj(sombra=True)); rd.prof = 50
    rd.extra_pts += [(Rr * math.cos(t), 0, Hc + Rr * math.sin(t)) for t in np.linspace(0, 2 * math.pi, 16)]
    def roda_(cam):
        out = []
        for y, w in ((.18, 1.4), (-.18, 1.8)):
            circ = [(Rr * math.cos(t), y, Hc + Rr * math.sin(t)) for t in np.linspace(0, 2 * math.pi, 73)]
            out.append(tubo_liso(cam, circ, w, '#d9473c'))
            for k in range(n):
                t = 2 * math.pi * k / n + .2
                out.append(lin(cam, (0, y, Hc), (Rr * math.cos(t), y, Hc + Rr * math.sin(t)), '#e9ecef', .9))
        return [(0, s) for s in out]
    cru(rd, roda_, ordem=2)
    cilindro_liso(rd, (0, -.3, Hc), (0, .6, 0), .1, cor='#3b3f48', brilho=.4, ordem=1)
    cores = ['#2f6fd0', '#f2c230', '#3f8f5a', '#e08a2e', '#8a4fb0', '#2fb0c0', '#e05a8a', '#6a9e2f']
    for k in range(n):
        t = 2 * math.pi * k / n + .2; px, pz = Rr * math.cos(t), Hc + Rr * math.sin(t)
        cb = c.add(Obj(sombra=False)); cb.prof = -10 - k
        caixa_chanfro(cb, px - .17, px + .17, -.2, .2, pz - .42, pz - .14, .05, cores[k], amb=.45, brilho=.3)
        def haste(cam, px=px, pz=pz):
            return [(0, lin(cam, (px, -.2, pz), (px, -.2, pz - .14), '#5a5f6a', .8))]
        cru(cb, haste, ordem=0)
    return c.render()

def M10_5():
    """funcoes trigonometricas e graficos: osciloscopio mostrando y = sen x (periodo 2 pi, amplitude 1)"""
    c = Cena(-24, 16)
    W, D, H = 2.4, 1.4, 1.6
    o = c.add(Obj()); caixa_chanfro(o, -W / 2, W / 2, -D / 2, D / 2, 0, H, .06, '#c9ccd2', amb=.45, brilho=.25)
    y0 = -D / 2 - .002
    x0, x1, z0, z1 = -W / 2 + .14, W / 2 - .78, .2, H - .2
    def painel(cam):
        out = []
        out.append(poli(cam, [(x0 - .05, y0, z0 - .05), (x1 + .05, y0, z0 - .05), (x1 + .05, y0, z1 + .05), (x0 - .05, y0, z1 + .05)], '#3b3f48'))
        out.append(poli(cam, [(x0, y0 - .001, z0), (x1, y0 - .001, z0), (x1, y0 - .001, z1), (x0, y0 - .001, z1)], '#0d2a1e'))
        for i in range(1, 10):
            x = x0 + (x1 - x0) * i / 10
            out.append(lin(cam, (x, y0 - .002, z0), (x, y0 - .002, z1), '#2f6b4c', .5 if i != 5 else .9, cap='butt'))
        for j in range(1, 8):
            z = z0 + (z1 - z0) * j / 8
            out.append(lin(cam, (x0, y0 - .002, z), (x1, y0 - .002, z), '#2f6b4c', .5 if j != 4 else .9, cap='butt'))
        xs = np.linspace(0, 2 * 2 * math.pi, 120)
        onda = [(x0 + (x1 - x0) * x / (4 * math.pi), y0 - .003, (z0 + z1) / 2 + (z1 - z0) * .36 * math.sin(x)) for x in xs]
        out.append(pl(cam, onda, '#3dff8f', 3.2, op=.35)); out.append(pl(cam, onda, '#b8ffd6', 1.2))
        for k, (zk, cor) in enumerate([(z1 - .15, '#2b2f3a'), (z1 - .55, '#2b2f3a'), (z0 + .35, '#d9473c')]):
            xc = x1 + .38
            out.append(poli(cam, [(xc + .15 * math.cos(t), y0, zk + .15 * math.sin(t)) for t in np.linspace(0, 2 * math.pi, 20)], cor))
            out.append(poli(cam, [(xc + .09 * math.cos(t), y0 - .001, zk + .09 * math.sin(t)) for t in np.linspace(0, 2 * math.pi, 16)], mix(cor, '#ffffff', .25)))
        for i in range(3):
            out.append(poli(cam, [(x1 + .2 + i * .14, y0, z0 - .1), (x1 + .3 + i * .14, y0, z0 - .1), (x1 + .3 + i * .14, y0, z0 - .02), (x1 + .2 + i * .14, y0, z0 - .02)], '#2f6fd0'))
        return [(0, s) for s in out]
    cru(o, painel, ordem=4)
    return c.render()

# =============================================================== M11 Geometria espacial (modulo: solidos)
def M11_1():
    """prismas e cubos: planificacao do cubo em papelao sendo dobrada (seis quadrados em cruz)"""
    c = Cena(-28, 34)
    a = 1.0; cor = '#d7a86a'
    def face(pts, prof=None):
        if normal(pts)[2] < -1e-6: pts = pts[::-1]
        o = c.add(Obj(sombra=True)); o.face(pts, cor, dupla=True, amb=.45, contorno='#9c7240', sw=.6)
        if prof is not None: o.prof = prof
        return o
    h = a / 2
    face([(-h, -h, 0), (h, -h, 0), (h, h, 0), (-h, h, 0)], prof=50)                                         # fundo
    def ab(eixo_pts, ang, dirv, prof=None):
        (p, q) = eixo_pts; d = np.array(dirv, float)
        up = np.array((0, 0, 1.0)); v = d * math.cos(ang) + up * math.sin(ang)
        return face([p, q, tuple(np.array(q) + v * a), tuple(np.array(p) + v * a)], prof)
    ab(((-h, -h, 0), (h, -h, 0)), math.radians(4), (0, -1, 0), prof=-10)         # frente ainda aberta (deitada)
    ab(((h, -h, 0), (h, h, 0)), math.radians(28), (1, 0, 0), prof=0)              # direita meio dobrada
    ab(((-h, h, 0), (-h, -h, 0)), math.radians(90), (-1, 0, 0), prof=40)          # esquerda em pe
    # tras em pe com a tampa presa nele, meio dobrada
    ab(((-h, h, 0), (h, h, 0)), math.radians(90), (0, 1, 0), prof=45)
    dob = c.add(Obj(sombra=False)); dob.prof = -1e3
    def vincos(cam):
        out = []
        for p, q in (((-h, -h), (h, -h)), ((h, -h), (h, h))):
            out.append(f'<path d="M{fmt(cam.P(p[0], p[1], .01)[0])} {fmt(cam.P(p[0], p[1], .01)[1])} L{fmt(cam.P(q[0], q[1], .01)[0])} {fmt(cam.P(q[0], q[1], .01)[1])}" stroke="#6b4720" stroke-width="1.1" stroke-dasharray="3 2"/>')
        return [(0, x) for x in out]
    cru(dob, vincos)
    t = math.radians(62); p0, p1 = (-h, h, a), (h, h, a)
    v = np.array((0, -math.cos(t), math.sin(t)))
    face([p0, p1, tuple(np.array(p1) + v * a * 0 + np.array((0, 0, 0)) + v * a), tuple(np.array(p0) + v * a)], prof=30)
    return c.render()

def M11_2():
    """cilindros: lata de refrigerante (cilindro reto: V = pi r^2 h)"""
    c = Cena(-20, 22)
    r, h = .62, 2.0
    o = c.add(Obj())
    cilindro_liso(o, (0, 0, 0), (0, 0, .12), r * .82, r, cor='#c9ccd2', brilho=.6, ordem=0)
    cilindro_liso(o, (0, 0, .12), (0, 0, h - .3), r, cor='#1f7f8f', brilho=.5, ordem=1)
    cilindro_liso(o, (0, 0, h - .18), (0, 0, .14), r, r * .84, cor='#c9ccd2', brilho=.6, ordem=2, tampa_cor='#d3d6db')
    def detalhes(cam):
        out = []
        ts = np.linspace(math.radians(185), math.radians(355), 30)
        for z0, z1, cor in ((.62, .78, '#f2c230'), (.84, .9, '#f4f5f7'), (1.38, 1.44, '#f4f5f7')):
            a = [(r * 1.003 * math.cos(t), r * 1.003 * math.sin(t), z0) for t in ts]
            b = [(r * 1.003 * math.cos(t), r * 1.003 * math.sin(t), z1) for t in ts[::-1]]
            out.append(poli(cam, a + b, cor))
        z = h - .04
        out.append(poli(cam, [(r * .84 * math.cos(t), r * .84 * math.sin(t), z + .001) for t in np.linspace(0, 2 * math.pi, 40)], 'none', ' stroke="#9ea4ad" stroke-width="1.2"'))
        out.append(poli(cam, [(.08 + .2 * math.cos(t), .1 + .13 * math.sin(t), z + .002) for t in np.linspace(0, 2 * math.pi, 24)], '#b9bec6', ' stroke="#8d939c" stroke-width=".6"'))
        out.append(poli(cam, [(-.2 + .1 * math.cos(t), -.22 + .07 * math.sin(t), z + .002) for t in np.linspace(0, 2 * math.pi, 18)], '#7d838c'))
        out.append(lin(cam, (-r * .7, -r * .7, .3), (-r * .7, -r * .7, h - .4), '#ffffff', 2.4, op=.35))
        return [(0, s) for s in out]
    cru(o, detalhes, ordem=4)
    return c.render()

def M11_3():
    """piramides e cones: cone de transito (base quadrada) e uma piramide de base quadrada de vidro"""
    c = Cena(-24, 20)
    o = c.add(Obj())
    caixa_chanfro(o, -.75, .75, -.75, .75, 0, .12, .04, '#e2531f', amb=.4, brilho=.2)
    cilindro_liso(o, (0, 0, .12), (0, 0, 2.0), .55, .07, cor='#f06a28', brilho=.4, ordem=2)
    def faixas(cam):
        out = []
        for z0, z1 in ((.62, .92), (1.25, 1.48)):
            r0 = .55 + (.07 - .55) * (z0 - .12) / 2.0; r1 = .55 + (.07 - .55) * (z1 - .12) / 2.0
            ts = np.linspace(math.radians(190), math.radians(350), 24)
            a = [(r0 * 1.01 * math.cos(t), r0 * 1.01 * math.sin(t), z0) for t in ts]
            b = [(r1 * 1.01 * math.cos(t), r1 * 1.01 * math.sin(t), z1) for t in ts[::-1]]
            out.append(poli(cam, a + b, '#f4f5f7'))
        return [(0, s) for s in out]
    cru(o, faixas, ordem=4)
    p = c.add(Obj()); p.prof = -50
    b, H = .55, .95; cx, cy = 1.05, -.75
    solido_convexo(p, [(cx + x, cy + y, 0) for x in (-b, b) for y in (-b, b)] + [(cx, cy, H)], '#7fb7e0', amb=.5, brilho=.5, contorno='#4f86b0', sw=.6)
    return c.render()

def M11_4():
    """esfera: bola de basquete (V = 4/3 pi r^3) com as costuras"""
    c = Cena(-20, 20)
    R = 1.0; C = np.array((0, 0, R))
    o = c.add(Obj()); o.esfera(tuple(C), R, '#e2741f', reflexo=False)
    Rm = transf(math.radians(25), (0, 0, 0), pitch=math.radians(-20), roll=math.radians(15))
    def costuras(cam):
        out = []
        vis = lambda p: cam.V(*(np.array(p) - C))[2] < -.02
        curvas = []
        ts = np.linspace(0, 2 * math.pi, 140)
        curvas.append([np.array(Rm(math.cos(t), 0, math.sin(t))) for t in ts])          # grande circulo 1
        curvas.append([np.array(Rm(math.cos(t), math.sin(t), 0)) for t in ts])          # grande circulo 2
        for sg in (-1, 1):                                                               # duas costuras curvas
            k = .62
            curvas.append([np.array(Rm(sg * k, math.sqrt(1 - k * k) * math.cos(t), math.sqrt(1 - k * k) * math.sin(t))) for t in ts])
        for cv in curvas:
            seg = []
            for q in cv:
                p = C + q * R * 1.002
                if vis(p): seg.append(tuple(p))
                elif seg:
                    if len(seg) > 1: out.append(pl(cam, seg, '#2a1a10', 1.5))
                    seg = []
            if len(seg) > 1: out.append(pl(cam, seg, '#2a1a10', 1.5))
        X, Y = cam.P(*C); Rr = R * cam.k
        out.append(f'<ellipse cx="{fmt(X - Rr * .36)}" cy="{fmt(Y - Rr * .42)}" rx="{fmt(Rr * .26)}" ry="{fmt(Rr * .15)}" fill="#fff" opacity=".45" transform="rotate(-30 {fmt(X - Rr * .36)} {fmt(Y - Rr * .42)})"/>')
        return [(0, s) for s in out]
    cru(o, costuras, ordem=5)
    return c.render()

def M11_5():
    """troncos e volume: balde de metal (tronco de cone) com alca"""
    c = Cena(-20, 26)
    r0, r1, H = .62, .9, 1.4
    o = c.add(Obj())
    cilindro_liso(o, (0, 0, 0), (0, 0, H), r0, r1, cor='#b9c0c9', brilho=.55, amb=.4, tampa_cor='#5d6570', ordem=1)
    def det(cam):
        out = []
        for zz in (.18, H * .55, H - .05):
            rr = r0 + (r1 - r0) * zz / H
            arco = [(rr * 1.01 * math.cos(t), rr * 1.01 * math.sin(t), zz) for t in np.linspace(math.radians(190), math.radians(350), 30)]
            out.append(pl(cam, arco, '#8d949e', 1.3)); out.append(pl(cam, [(x, y, z + .025) for x, y, z in arco], '#e6eaef', .7))
        # agua dentro
        out.append(poli(cam, [(r1 * .93 * math.cos(t), r1 * .93 * math.sin(t), H * .78) for t in np.linspace(0, 2 * math.pi, 40)], '#6fb3dd', ' opacity=".9"'))
        # alca
        alca = [(r1 * 1.02 * math.cos(t), r1 * .15 * math.sin(t) * 0, H + .02 + 1.0 * math.sin(t) * .62) for t in np.linspace(0, math.pi, 40)]
        alca = [(r1 * math.cos(t), 0, H + .62 * math.sin(t)) for t in np.linspace(0, math.pi, 40)]
        out.append(pl(cam, alca, '#5d6570', 1.8)); out.append(pl(cam, alca, '#c9cfd6', .7))
        return [(0, s) for s in out]
    cru(o, det, ordem=4, pts=[(0, 0, H + .65)])
    return c.render()

# =============================================================== M12 Geometria analitica (modulo: geoplano)
def _alfinete(c, x, y, z, cor, prof):
    a = c.add(Obj(sombra=True)); a.prof = prof
    cilindro_liso(a, (x, y, z), (0, 0, .28), .018, cor='#b8bec7', brilho=.7, ordem=0)
    cilindro_liso(a, (x, y, z + .28), (0, 0, .07), .1, .08, cor=cor, brilho=.4, ordem=1)
    a.esfera((x, y, z + .42), .1, cor)
    return a

def _papel_eixos(c, x0, x1, y0, y1, u, z=0, prof=1e4, eixos=True, cor='#fbfbf8'):
    p = c.add(Obj()); p.prof = prof; caixa(p, x0 * u, x1 * u, y0 * u, y1 * u, z - .03, z, cor, amb=.85)
    def g(cam):
        out = []
        for i in range(math.ceil(x0), math.floor(x1) + 1):
            out.append(lin(cam, (i * u, y0 * u, z + .001), (i * u, y1 * u, z + .001), '#cfdcea', .5, cap='butt'))
        for j in range(math.ceil(y0), math.floor(y1) + 1):
            out.append(lin(cam, (x0 * u, j * u, z + .001), (x1 * u, j * u, z + .001), '#cfdcea', .5, cap='butt'))
        if eixos:
            out.append(lin(cam, (x0 * u, 0, z + .002), (x1 * u, 0, z + .002), '#39404c', 1.1)); out.append(lin(cam, (0, y0 * u, z + .002), (0, y1 * u, z + .002), '#39404c', 1.1))
        return [(0, s) for s in out]
    cru(p, g)
    return p

def _pino_mapa(c, x, y, cor, prof, k=1.0):
    """pino de mapa: haste curta e cabeca grande (maior que o alfinete do papel quadriculado)"""
    a = c.add(Obj(sombra=True)); a.prof = prof
    cilindro_liso(a, (x, y, 0), (0, 0, .3 * k), .022 * k, cor='#b8bec7', brilho=.7, ordem=0)
    cilindro_liso(a, (x, y, .3 * k), (0, 0, .1 * k), .16 * k, .12 * k, cor=cor, brilho=.4, ordem=1)
    a.esfera((x, y, .5 * k), .16 * k, cor)
    return a

def M12_1():
    """distancia entre pontos: mapa de papel com dois pinos (A e B) e a regua medindo a distancia entre eles
    (correcao da revisao de 29/10: antes era mais uma folha quadriculada com alfinetes, como M12.2, M12.4 e M12.5)"""
    c = Cena(-20, 46)
    X0, X1, Y0, Y1 = -1.7, 1.7, -1.25, 1.25
    mp = c.add(Obj()); mp.prof = 1e4
    caixa(mp, X0, X1, Y0, Y1, -.03, 0, '#f1efe2', amb=.85)
    def mapa(cam):
        z = .001; out = []
        P = lambda pts: [(x, y, z) for x, y in pts]
        out.append(poli(cam, P([(-1.7, .55), (-1.0, .9), (-.6, 1.25), (-1.7, 1.25)]), '#cfe3b4'))          # parque
        out.append(poli(cam, P([(.9, -1.25), (1.7, -1.25), (1.7, -.4), (1.25, -.6)]), '#cfe3b4'))
        for (x, y, w, h) in [(-1.45, -1.05, .5, .38), (-.8, -1.05, .45, .38), (-1.45, -.5, .5, .34), (.2, .45, .45, .4), (.85, .95, .5, .25), (.2, -1.05, .4, .38), (.8, .1, .4, .3)]:
            out.append(poli(cam, P([(x, y), (x + w, y), (x + w, y + h), (x, y + h)]), '#e6dcc4'))   # quadras
        rio = [(X0, .2), (-1.1, .05), (-.5, .25), (.1, -.05), (.6, -.25), (1.2, -.1), (X1, -.3)]
        out.append(pl(cam, P(rio), '#7fb6e0', 5.5)); out.append(pl(cam, P(rio), '#a9d1ef', 2.2))
        for a_, b_ in [((-.2, Y0), (-.05, Y1)), ((X0, -.65), (X1, -.75)), ((.65, Y0), (.75, Y1))]:      # ruas
            out.append(lin(cam, (*a_, z), (*b_, z), '#c9c2b0', 4.2, cap='butt')); out.append(lin(cam, (*a_, z), (*b_, z), '#ffffff', 2.8, cap='butt'))
        return [(0, s) for s in out]
    cru(mp, mapa)
    A, B = (-1.0, -.35), (1.05, .7)
    d = np.array(B) - np.array(A); L = np.linalg.norm(d); d /= L; n = np.array((d[1], -d[0]))
    fio = c.add(Obj(sombra=False)); fio.prof = 100
    cru(fio, lambda cam: [(0, lin(cam, (*A, .003), (*B, .003), '#d9473c', 1.3).replace('/>', ' stroke-dasharray="4 3"/>'))])
    # regua transparente ao longo do segmento, logo abaixo dele
    rg = c.add(Obj(sombra=False)); rg.prof = 50
    p0 = np.array(A) - d * .25 + n * .06; p1 = np.array(B) + d * .25 + n * .06
    rg.face([(*p0, .03), (*p1, .03), (*(p1 + n * .34), .03), (*(p0 + n * .34), .03)], '#f2cf5b', opac=.85, contorno='#9a7a1c', sw=.8, dupla=True, plana=True)
    def tk(cam):
        out = []; Lr = np.linalg.norm(p1 - p0)
        for i in range(int(Lr / .1) + 1):
            a = p0 + d * i * .1; ll = .13 if i % 5 == 0 else .07
            out.append(lin(cam, (a[0], a[1], .031), (a[0] + n[0] * ll, a[1] + n[1] * ll, .031), '#2b3540', .6, cap='butt'))
        return [(0, s) for s in out]
    cru(rg, tk, ordem=5)
    _pino_mapa(c, A[0], A[1], '#d9473c', -10, k=1.3)
    _pino_mapa(c, B[0], B[1], '#2f6fd0', -20, k=1.3)
    return c.render()

def M12_2():
    """equacao da reta: rampa de madeira com a inclinacao marcada - subida (delta y = 2) sobre o avanco (delta x = 3):
    coeficiente angular m = tg(alfa) = 2/3
    (correcao da revisao de 29/10: antes era regua e lapis numa folha quadriculada, palido e igual a M12.1, M12.4 e M12.5)"""
    c = Cena(24, 22)
    run, rise, w = 3.0, 2.0, 1.1
    x0, x1 = -run / 2, run / 2; y0, y1 = -w / 2, w / 2
    r = c.add(Obj()); r.prof = 10
    solido_convexo(r, [(x0, y0, 0), (x1, y0, 0), (x0, y1, 0), (x1, y1, 0), (x1, y0, rise), (x1, y1, rise)], '#d9a865', amb=.4, brilho=.2, contorno='#7a5328', sw=.7)
    m = c.add(Obj(sombra=False)); m.prof = -10
    yf = y0 - .004
    def marcas(cam):
        out = []
        # veios da madeira na face da frente
        for t in (.25, .5, .75):
            out.append(lin(cam, (x0 + run * t * .35, yf, rise * t * .35 * .9), (x1, yf, rise * t * .9 + .02), '#b68a52', .7, op=.7))
        # delta x (azul) por baixo e delta y (vermelho) a direita, com setas nas pontas
        out.append(seta3(cam, (x0 + .05, yf, -.22), (x1 - .02, yf, -.22), '#2f6fd0', 1.6))
        out.append(seta3(cam, (x1 + .22, yf, .02), (x1 + .22, yf, rise - .02), '#d9473c', 1.6))
        out.append(texto(cam, 'Δx', I, 0, yf, -.5, .36, '#2f6fd0', SANS_B, (1, 0, 0), (0, 0, 1)))
        out.append(texto(cam, 'Δy', I, x1 + .62, yf, rise / 2, .36, '#d9473c', SANS_B, (1, 0, 0), (0, 0, 1)))
        # angulo alfa no pe da rampa
        a = math.atan2(rise, run); R = .8
        arco = [(x0 + R * math.cos(t), yf, R * math.sin(t)) for t in np.linspace(0, a, 16)]
        out.append(pl(cam, arco, '#e08a2e', 1.8))
        out.append(texto(cam, 'α', I, x0 + 1.12, yf, .22, .32, '#e08a2e', SERIF_I, (1, 0, 0), (0, 0, 1)))
        return [(0, s) for s in out]
    cru(m, marcas, pts=[(x0, yf, -.7), (x1 + .9, yf, rise)])
    return c.render()

def M12_3():
    """posicao relativa e paralelismo: trilhos de trem - duas retas paralelas (mesma direcao, nunca se cortam)"""
    c = Cena(-24, 46)
    L = 2.6; g = .62
    M = transf(math.radians(60), (0, 0, 0))
    for k in range(7):
        x = -L / 2 + .2 + k * (L - .4) / 6
        o = c.add(Obj()); o.prof = 100 + k
        caixaM(o, M, x - .12, x + .12, -.66, .66, 0, .1, '#7a5236', b=.02, amb=.4)
    for y in (-g / 2, g / 2):
        t = c.add(Obj(sombra=False)); t.prof = -10 if y < 0 else 0
        caixaM(t, M, -L / 2, L / 2, y - .035, y + .035, .1, .13, '#6b6f78', amb=.4, brilho=.3)
        caixaM(t, M, -L / 2, L / 2, y - .02, y + .02, .13, .2, '#7d828b', amb=.4, brilho=.3)
        caixaM(t, M, -L / 2, L / 2, y - .04, y + .04, .2, .25, '#aab0b9', amb=.45, brilho=.6)
    return c.render()

def M12_4():
    """circunferencia no plano cartesiano: alfinete no centro C(2, 2), barbante de raio 1,5 e lapis tracando (x-2)^2 + (y-2)^2 = 1,5^2"""
    c = Cena(-20, 50)
    u = .45; C = (2, 2); r = 1.5
    _papel_eixos(c, -.6, 4.6, -.6, 4.6, u)
    ang = math.radians(-30)
    tr = c.add(Obj(sombra=False)); tr.prof = 1e3
    def risco(cam):
        ts = np.linspace(ang - math.radians(290), ang, 100)
        out = [pl(cam, [((C[0] + r * math.cos(t)) * u, (C[1] + r * math.sin(t)) * u, .003) for t in ts], '#2f6fd0', 1.8)]
        return [(0, s) for s in out]
    cru(tr, risco)
    P_ = ((C[0] + r * math.cos(ang)) * u, (C[1] + r * math.sin(ang)) * u)
    fio = c.add(Obj(sombra=False)); fio.prof = -50
    def barb(cam):
        return [(0, lin(cam, (C[0] * u, C[1] * u, .22), (P_[0], P_[1], .2), '#9c6b3a', 1.1))]
    cru(fio, barb)
    _alfinete(c, C[0] * u, C[1] * u, 0, '#d9473c', -60)
    dl = np.array((.3, .45, .8)); dl /= np.linalg.norm(dl); tip = np.array((P_[0], P_[1], .005))
    lp = c.add(Obj()); lp.prof = -100
    cilindro_liso(lp, tuple(tip), tuple(dl * .28), .0, .07, cor='#e8c99a', brilho=.3, ordem=1)
    cilindro_liso(lp, tuple(tip), tuple(dl * .09), .0, .024, cor='#2b2f3a', brilho=.3, ordem=2)
    cilindro_liso(lp, tuple(tip + dl * .28), tuple(dl * 1.3), .07, cor='#2f6fd0', brilho=.4, ordem=0, n=6)
    return c.render()

def M12_5():
    """areas por coordenadas: placa de acrilico com vertices em pontos inteiros (1, 1), (5, 2), (4, 5), (1, 4) - area pela formula do determinante (shoelace) = 11"""
    c = Cena(-20, 50)
    u = .42
    _papel_eixos(c, -.5, 6.5, -.5, 6.0, u)
    V = [(1, 1), (5, 2), (4, 5), (1, 4)]
    pl_ = c.add(Obj(sombra=False)); pl_.prof = -10
    extrusao(pl_, [(x * u, y * u) for x, y in V], .01, .08, '#4f9a6a', '#3a7a52', opac=.6, contorno='#2f6b47', sw=.8)
    for i, (x, y) in enumerate(V):
        _alfinete(c, x * u, y * u, .08, '#d9473c', -50 - i)
    return c.render()

TODOS = {}
for _k, _v in list(globals().items()):
    if _k[:1] == 'M' and _k[1:3].isdigit() and '_' in _k: TODOS[_k.replace('_', '.')] = _v

if __name__ == '__main__':
    import sys
    alvo = sys.argv[1:] or list(TODOS)
    for k in alvo: grava_sub(k, TODOS[k]())

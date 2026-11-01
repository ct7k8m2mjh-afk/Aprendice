# -*- coding: utf-8 -*-
"""Portugues: icones realistas dos CONTEUDOS (P01.1 ... P12.5), no mesmo estilo dos icones de modulo (gera_por.py):
mesma camera/luz do motor 3D (motor.py), sombra de contato desfocada, e desenhos da Servier Medical Art (CC BY 3.0)
quando ela tem o objeto. Saida bruta em bruto_sub_por/; o enquadramento e a otimizacao sao do finaliza.js."""
from util import *
import re
from gera_mat2 import texto_no_plano, SANS_B, SERIF_I
from servier import coloca, sombra_chao, carrega
SERIF_B = '/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf'
SERIF = '/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf'
SV = 'cc-by-3.0/'
BRUTO_SUB = os.path.join(AQUI, 'bruto_sub_por'); os.makedirs(BRUTO_SUB, exist_ok=True)

def grava_sub(id_, corpo, ocupa=.85):
    s = (f'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 200 200" width="400" height="400" data-ocupa="{ocupa}">'
         f'<g id="raiz">{corpo}</g></svg>')
    open(os.path.join(BRUTO_SUB, id_ + '.svg'), 'w').write(s)

def unit(v):
    v = np.asarray(v, float); return v / (np.linalg.norm(v) or 1)

def base_plano(normal_):
    """dois eixos (u, v) ortonormais num plano de normal dada; v o mais 'para cima' possivel"""
    n = unit(normal_); up = np.array([0, 0, 1.0]) if abs(n[2]) < .95 else np.array([0, 1.0, 0])
    u = unit(np.cross(up, n)); v = np.cross(n, u)
    return u, v

def palavras(cam, M, x0, x1, y, z, cor='#7b808c', w=2.0, rng=None, gap=.08, pmin=.12, pmax=.36):
    """uma linha de texto impresso vista de longe: tracos de comprimentos variados"""
    rng = rng or np.random.default_rng(1); out = []; x = x0
    while x < x1 - .05:
        L = min(rng.uniform(pmin, pmax), x1 - x)
        if L > .04: out.append((0, lin(cam, M(x, y, z), M(x + L, y, z), cor, w, cap='round')))
        x += L + gap
    return out

# ======================================================================== P01 Leitura e compreensao (modulo: livro aberto)
def P01_1():   # tema, tese e ideia principal: a frase central grifada com marca-texto
    c = Cena(-20, 50)
    W, D = 1.05, 1.4
    M = transf(math.radians(-8))
    f = c.add(Obj()); solido_convexo(f, [M(x, y, z) for x in (-W, W) for y in (-D, D) for z in (0, .02)], '#fbfaf5', amb=.85)
    def txt(cam):
        out = []; z = .021; rng = np.random.default_rng(5)
        for k in range(10):
            y = D - .3 - k * .26
            if k == 3:
                out.append((0, poli(cam, [M(-W + .1, y - .1, z), M(W - .12, y - .1, z), M(W - .12, y + .1, z), M(-W + .1, y + .1, z)], '#ffe23d', ' opacity=".85"')))
                out += palavras(cam, M, -W + .16, W - .18, y, z + .001, '#3c3f47', 2.2, rng)
            else:
                out += palavras(cam, M, -W + .16, W - .18 - (.5 if k in (2, 6, 9) else 0), y, z, '#8a8f99', 2.0, rng)
        return out
    txt.ordem = 3; f.cru.append((txt, []))
    o = c.add(Obj()); o.prof = -1e6
    p0 = np.array([1.0, -1.2, .19]); d = unit([-.62, 1, 0])
    cilindro_liso(o, p0, d * 1.15, .17, cor='#f3e021', brilho=.45, amb=.4, ordem=0)                    # corpo
    cilindro_liso(o, p0 + d * 1.15, d * .62, .178, .17, cor='#d8b80e', brilho=.5, amb=.4, ordem=1)       # tampa
    cilindro_liso(o, p0 - d * .06, d * .06, .15, .17, cor='#2f3238', brilho=.3, ordem=1)                 # fundo
    def clip(cam):
        a = p0 + d * 1.25 + np.array([0, 0, .2]); b = a + d * .42
        return [(0, lin(cam, a, b, '#b39609', .07 * cam.k) + lin(cam, a, b, '#fff3a0', .022 * cam.k, op=.9))]
    clip.ordem = 4; o.cru.append((clip, []))
    return c.render()

def P01_2():   # 30/10: o publicado (disfarce de detetive) vem de gera_3010.py; o iceberg ficou como histórico. informacao explicita x inferencia: o iceberg (a ponta visivel e a massa maior que se deduz sob a agua)
    # (correcao da revisao de 29/10: a parte submersa ficava num cilindro de agua, como um pote, e sem contraste;
    #  agora e um corte de oceano em faixa larga, com a linha d'agua marcada e o gelo submerso mais claro que a agua)
    c = Cena(-28, 14)
    rng = np.random.default_rng(11)
    def nuvem(n, rx, ry, z0, z1, perfil, dx=0):
        P = []
        for _ in range(n):
            t = rng.uniform(0, 1); z = z0 + (z1 - z0) * t; r = perfil(t)
            a = rng.uniform(0, 2 * math.pi); k = rng.uniform(.8, 1.0)
            P.append((r * rx * k * math.cos(a) + dx, r * ry * k * math.sin(a), z))
        return P
    sub = c.add(Obj(sombra=False)); sub.prof = 1e6   # (desenhado depois da agua: prof menor que o do mar)
    solido_convexo(sub, nuvem(90, 1.25, 1.0, -2.0, -.01, lambda t: .45 + .55 * math.sin(math.pi * (.2 + .8 * t)) ** .7), '#8fcbec', amb=.6)
    topo = c.add(Obj(sombra=False)); topo.prof = -1e6
    pts = nuvem(36, .72, .6, 0, .3, lambda t: 1 - .2 * t) + nuvem(14, .3, .3, .3, .95, lambda t: 1 - .6 * t, -.15) + [(-.2, .02, 1.12), (.32, -.05, .72)]
    solido_convexo(topo, pts, '#f6fbff', amb=.6, brilho=.35)
    def mar(cam):
        # corte do oceano: faixa larga, sem paredes (some aos poucos nas laterais), linha d'agua reta e bem marcada;
        # a agua escura fica ATRAS da massa submersa, que e mais clara que ela
        cx, cy = cam.P(0, 0, 0); rx = 2.35 * cam.k
        yb = cam.P(0, 0, -2.25)[1]
        out = (f'<linearGradient id="mvg" x1="0" y1="{fmt(cy)}" x2="0" y2="{fmt(yb)}" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#2a78bd"/><stop offset="1" stop-color="#0c2f5c"/></linearGradient>'
               f'<linearGradient id="mvm" x1="{fmt(cx-rx)}" y1="0" x2="{fmt(cx+rx)}" y2="0" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".14" stop-color="#fff"/><stop offset=".86" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>'
               f'<mask id="mvk" maskUnits="userSpaceOnUse" x="0" y="0" width="200" height="200"><rect x="{fmt(cx-rx)}" y="{fmt(cy - 8)}" width="{fmt(2*rx)}" height="{fmt(yb-cy + 8)}" fill="url(#mvm)"/></mask>')
        corpo = f'<rect x="{fmt(cx-rx)}" y="{fmt(cy)}" width="{fmt(2*rx)}" height="{fmt(yb-cy)}" fill="url(#mvg)"/>'
        corpo += f'<rect x="{fmt(cx-rx)}" y="{fmt(cy - 6)}" width="{fmt(2*rx)}" height="6" fill="#bfe3f7" opacity=".55"/>'
        out += f'<g mask="url(#mvk)">{corpo}</g>'
        return [(0, out)]
    mar.ordem = 0
    m = c.add(Obj(sombra=False)); m.prof = 2e6; m.cru.append((mar, [(-2.35, 0, 0), (2.35, 0, 0), (0, 0, -2.25)]))
    def agua_linha(cam):
        cx, cy = cam.P(0, 0, 0); rx = 2.35 * cam.k
        return [(0, f'<linearGradient id="mwl" x1="{fmt(cx-rx)}" y1="0" x2="{fmt(cx+rx)}" y2="0" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".14" stop-color="#fff"/><stop offset=".86" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>'
                    f'<line x1="{fmt(cx-rx)}" y1="{fmt(cy)}" x2="{fmt(cx+rx)}" y2="{fmt(cy)}" stroke="url(#mwl)" stroke-width="2.2"/>')]
    agua_linha.ordem = 9
    wl = c.add(Obj(sombra=False)); wl.prof = 5e5; wl.cru.append((agua_linha, []))
    def linha(cam):
        q = [cam.P(*p) for p in circ3((-.02, 0, .01), (1, 0, 0), (0, 1, 0), .7, 40)]
        return [(0, f'<path d="{caminho(q)}" fill="none" stroke="#ffffff" stroke-width="1.3" opacity=".75"/>')]
    linha.ordem = -1; topo.cru.append((linha, []))
    return c.render()

def P01_3():   # titulo, fonte, data e paratexto: o livro fechado de pe, capa com titulo, autor e editora
    c = Cena(-24, 20)
    o = c.add(Obj())
    Wl, T, H = .58, .2, 1.55
    cor = '#1f5e4a'
    caixa_chanfro(o, -Wl, Wl + .03, -T, -T + .05, 0, H, .015, cor, amb=.4, brilho=.15)          # capa
    caixa_chanfro(o, -Wl, Wl + .03, T - .05, T, 0, H, .015, cor, amb=.4)                         # contracapa
    caixa_chanfro(o, -Wl - .05, -Wl + .02, -T, T, 0, H, .02, mix(cor, '#000000', .1), amb=.4)    # lombada
    caixa(o, -Wl + .02, Wl, -T + .05, T - .05, .04, H - .04, '#f1e7cf', amb=.75)                  # miolo
    def det(cam):
        out = []; y = -T - .001
        P = lambda x, z: (x, y, z)
        ouro = '#d6b25a'
        out.append((0, poli(cam, [P(-.4, .82), P(.45, .82), P(.45, 1.36), P(-.4, 1.36)], '#123c2f', f' stroke="{ouro}" stroke-width="1.6"')))
        out.append((0, lin(cam, P(-.28, 1.18), P(.33, 1.18), ouro, 3.2, cap='butt')))
        out.append((0, lin(cam, P(-.2, 1.0), P(.25, 1.0), ouro, 2.2, cap='butt')))
        out.append((0, lin(cam, P(-.18, .56), P(.23, .56), '#c9b37a', 1.6, cap='butt')))             # autor
        out.append((0, poli(cam, circ3((.025, y, .25), (1, 0, 0), (0, 0, 1), .08, 20), ouro)))        # selo da editora
        out.append((0, lin(cam, P(-.12, .12), P(.17, .12), '#c9b37a', 1.0, cap='butt')))              # ano
        # paginas no corte da frente
        for k in range(1, 12):
            yy = -T + .05 + k * (2 * T - .1) / 12
            out.append((0, lin(cam, (Wl + .001, yy, .06), (Wl + .001, yy, H - .06), '#d9cba8', .4, cap='butt')))
        return out
    det.ordem = 3; o.cru.append((det, []))
    # fita marcadora pendendo de cima
    def fita(cam):
        a, b, cc, dd = (.15, 0, H - .03), (.25, 0, H - .03), (.29, -.02, H + .02), (.12, -.02, H + .02)
        return [(0, poli(cam, [a, b, (.33, -.06, H - .5), (.27, -.09, H - .44), (.21, -.06, H - .5)], '#b8323c', ' stroke="#7e1d24" stroke-width=".4"'))]
    fita.ordem = 2; o.cru.append((fita, []))
    return c.render()

def P01_4():   # finalidade do texto e interlocutor: o alvo (a quem o texto se dirige e o que quer atingir)
    c = Cena(-22, 18)
    o = c.add(Obj())
    tilt = math.radians(12)
    ax = np.array([0, -math.cos(tilt), math.sin(tilt)]) * .2    # eixo do disco: da face de tras para a da frente
    R = 1.0
    b0 = np.array([0, .05, R * math.cos(tilt) + .02])
    cilindro_liso(o, b0, ax, R, cor='#1b1b1d', brilho=.2, amb=.45, ordem=0)
    F = b0 + ax + unit(ax) * .002; n = unit(ax); u, v = base_plano(n)
    def face(cam):
        out = []
        Rj = .8 / 170
        aneis = [(0, 6.35, 'bulli'), (6.35, 16, 'bull'), (16, 99, 's'), (99, 107, 't'), (107, 162, 's'), (162, 170, 't')]
        def setor(r0, r1, a0, a1, cor):
            q = [F + r * (math.cos(t) * u + math.sin(t) * v) for t in np.linspace(a0, a1, 5) for r in (r1,)]
            q += [F + r0 * (math.cos(t) * u + math.sin(t) * v) for t in np.linspace(a1, a0, 5)]
            return poli(cam, q, cor)
        s = ''
        for r0, r1, tipo in aneis[2:]:
            for i in range(20):
                a = math.pi / 2 - i * 2 * math.pi / 20
                par = i % 2 == 0
                cor = ('#1f1f22' if par else '#efe2c2') if tipo == 's' else ('#c8202a' if par else '#1d8a40')
                s += setor(r0 * Rj, r1 * Rj, a - math.pi / 20, a + math.pi / 20, cor)
        s += poli(cam, circ3(F, u, v, 16 * Rj, 24), '#1d8a40') + poli(cam, circ3(F, u, v, 6.35 * Rj, 16), '#c8202a')
        for r in (99, 107, 162, 170):
            s += poli(cam, circ3(F, u, v, r * Rj, 60), 'none', ' stroke="#c9ced6" stroke-width=".45"')
        s += poli(cam, circ3(F, u, v, .965, 60), 'none', f' stroke="#3a3a3e" stroke-width="{fmt(.03*cam.k)}"')
        out.append((0, s))
        return out
    face.ordem = 3; o.cru.append((face, []))
    # dardo cravado no centro: a ponta entra no alvo; o corpo sai para a frente, um pouco para cima e para a direita
    dd = unit(n * .55 + u * .8 + v * .38)
    dt = c.add(Obj()); dt.prof = -1e6
    p = F + dd * .02
    cilindro_liso(dt, p, dd * .12, .012, .05, cor='#c9ced4', brilho=.6, ordem=0)
    cilindro_liso(dt, p + dd * .12, dd * .5, .062, .07, cor='#a7afb8', brilho=.6, ordem=1)
    cilindro_liso(dt, p + dd * .62, dd * .45, .035, cor='#25262a', brilho=.4, ordem=2)
    e = p + dd * 1.04
    u2 = unit(np.cross(dd, [0, 0, 1])); v2 = np.cross(u2, dd)
    for ax2, cor in ((unit(u2 + v2), '#e0383b'), (unit(v2 - u2), '#f05a4e'), (unit(-u2 - v2), '#e0383b'), (unit(u2 - v2), '#f05a4e')):
        dt.face([e - dd * .02, e + dd * .5, e + dd * .5 + ax2 * .26, e + dd * .16 + ax2 * .26], cor, dupla=True, amb=.55, contorno=mix(cor, '#000000', .4), sw=.4)
    return c.render()

def servier(rel, alt=None, larg=None, chao=196, cx=100, sombra=(.8, 7), rot=0, **kw):
    """desenho da Servier centrado em cx, com a base em 'chao', e a mesma sombra de contato dos modulos"""
    miolo, (vx, vy, vw, vh) = carrega(rel, **kw)
    k = (alt / vh) if alt else (larg / vw); w, h = vw * k, vh * k
    g, _ = coloca(rel, cx - w / 2, chao - h, alt=h, rot=rot, **kw)
    sh = sombra_chao(cx + 4, chao, w / 2 * sombra[0], sombra[1]) if sombra else ''
    return sh + g

# ======================================================================== P02 Argumentacao (modulo: martelo de juiz)
def P02_1():   # tipos de argumento e como o autor sustenta a tese: a fachada sustentada por colunas
    c = Cena(-24, 20)
    marm = '#ede7da'
    b = c.add(Obj()); b.prof = 1e6
    caixa_chanfro(b, -1.35, 1.35, -.6, .6, 0, .13, .02, '#d9d2c3', amb=.45)
    caixa_chanfro(b, -1.22, 1.22, -.5, .5, .13, .25, .02, '#e3dccd', amb=.45)
    for x in (-.85, 0, .85):
        o = c.add(Obj()); o.prof = -x * 10
        cilindro_liso(o, (x, 0, .25), (0, 0, .09), .25, .24, cor=marm, amb=.45, brilho=.2, ordem=0)
        cilindro_liso(o, (x, 0, .34), (0, 0, 1.2), .19, .16, cor=marm, amb=.42, brilho=.25, ordem=1)
        cilindro_liso(o, (x, 0, 1.54), (0, 0, .1), .17, .25, cor=marm, amb=.45, brilho=.2, ordem=2)
        caixa(o, x - .28, x + .28, -.28, .28, 1.64, 1.72, marm, amb=.45)
        def caneluras(cam, x=x):
            out = []
            for a in np.linspace(0, 2 * math.pi, 16, endpoint=False):
                nrm = (math.cos(a), math.sin(a), 0)
                if not visivel(cam, nrm): continue
                p0 = (x + .19 * math.cos(a), .19 * math.sin(a), .36); p1 = (x + .16 * math.cos(a), .16 * math.sin(a), 1.52)
                out.append((0, lin(cam, p0, p1, '#9e9584', .55, op=.55)))
            return out
        caneluras.ordem = 1.5; o.cru.append((caneluras, []))
    t = c.add(Obj()); t.prof = -1e6
    caixa_chanfro(t, -1.2, 1.2, -.36, .36, 1.72, 1.98, .015, marm, amb=.45, brilho=.15)
    extrusao(t, [(-1.28, 1.98), (1.28, 1.98), (0, 2.42)], -.38, .38, marm, marm, M=lambda x, y, z: (x, -z, y), amb=.45)
    def friso(cam):
        y = -.361
        return [(0, lin(cam, (-1.2, y, 1.85), (1.2, y, 1.85), '#b9b09e', .7, cap='butt')),
                (0, poli(cam, [(-.95, -.381, 2.03), (.95, -.381, 2.03), (0, -.381, 2.33)], '#ded7c8', ' stroke="#b9b09e" stroke-width=".6"'))]
    friso.ordem = 4; t.cru.append((friso, []))
    return c.render()

def P02_2():   # ponto de vista, modalizacao e marcas de opiniao: os oculos (o olhar de quem escreve)
    return servier(SV + 'General_items/Servier/glasses.svg', larg=196, chao=150, sombra=(.85, 6))

def mascara(cx, cy, s, rot, cor, feliz, gid):
    """mascara de teatro (comedia ou tragedia) em 2D com volume de gradiente; s = escala (1 -> ~84 x 104 px)"""
    esc = mix(cor, '#000000', .55); cla = mix(cor, '#ffffff', .6)
    g = (f'<radialGradient id="{gid}" cx=".36" cy=".3" r=".8"><stop offset="0" stop-color="{cla}"/><stop offset=".35" stop-color="{cor}"/>'
         f'<stop offset=".85" stop-color="{mix(cor, "#000000", .3)}"/><stop offset="1" stop-color="{esc}"/></radialGradient>')
    rosto = 'M-42 -38 C-40 -66 40 -66 42 -38 C46 -2 34 36 0 52 C-34 36 -46 -2 -42 -38Z'
    if feliz:
        olhos = ('M-31 -18 C-24 -30 -10 -30 -6 -18 C-12 -22 -24 -22 -31 -18Z', 'M31 -18 C24 -30 10 -30 6 -18 C12 -22 24 -22 31 -18Z')
        sobr = ('M-32 -34 C-24 -44 -10 -44 -5 -36', 'M32 -34 C24 -44 10 -44 5 -36')
        boca = 'M-26 8 C-18 34 18 34 26 8 C14 18 -14 18 -26 8Z'
        boch = '<ellipse cx="-24" cy="2" rx="8" ry="5" fill="#fff" opacity=".28"/><ellipse cx="24" cy="2" rx="8" ry="5" fill="#fff" opacity=".18"/>'
    else:
        olhos = ('M-31 -16 C-26 -24 -10 -28 -6 -24 C-10 -16 -24 -12 -31 -16Z', 'M31 -16 C26 -24 10 -28 6 -24 C10 -16 24 -12 31 -16Z')
        sobr = ('M-33 -28 C-24 -32 -12 -40 -6 -44', 'M33 -28 C24 -32 12 -40 6 -44')
        boca = 'M-22 30 C-14 10 14 10 22 30 C12 22 -12 22 -22 30Z'
        boch = '<path d="M-20 -8 C-22 4 -20 12 -17 20" stroke="#000" stroke-opacity=".15" stroke-width="2" fill="none"/>'
    out = f'<g transform="translate({cx} {cy}) rotate({rot}) scale({s})">'
    out += f'<path d="{rosto}" fill="url(#{gid})" stroke="{esc}" stroke-width="1.2"/>'
    out += boch
    for o in olhos: out += f'<path d="{o}" fill="#1c140c" stroke="{esc}" stroke-width=".8"/>'
    for sb in sobr: out += f'<path d="{sb}" stroke="{esc}" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="{sb}" transform="translate(-.6 -1)" stroke="{cla}" stroke-width=".8" fill="none" opacity=".7"/>'
    out += f'<path d="{boca}" fill="#1c140c" stroke="{esc}" stroke-width=".8"/>'
    out += '<path d="M0 -26 C-3 -10 -4 0 0 6" stroke="#000" stroke-opacity=".18" stroke-width="2" fill="none"/><path d="M-1 -24 C-3 -10 -3 -2 -1 4" stroke="#fff" stroke-opacity=".5" stroke-width="1" fill="none"/>'
    out += f'<ellipse cx="-20" cy="-48" rx="14" ry="5" fill="#fff" opacity=".35" transform="rotate(-8 -20 -48)"/>'
    out += '</g>'
    return g, out

def P02_3():   # ironia, humor e sentido implicito: as mascaras da comedia e da tragedia (o que se diz e o que se quer dizer)
    g1, m1 = mascara(122, 82, 1.0, 14, '#c9cfd8', False, 'mtr')
    g2, m2 = mascara(80, 108, 1.06, -12, '#e2b143', True, 'mco')
    fita = ('<path d="M150 116 C162 132 156 150 166 166" stroke="#7e1d24" stroke-width="5" fill="none" stroke-linecap="round"/>'
            '<path d="M150 116 C162 132 156 150 166 166" stroke="#c8323f" stroke-width="3.2" fill="none" stroke-linecap="round"/>'
            '<path d="M44 110 C30 126 40 146 30 168" stroke="#7e1d24" stroke-width="5" fill="none" stroke-linecap="round"/>'
            '<path d="M44 110 C30 126 40 146 30 168" stroke="#c8323f" stroke-width="3.2" fill="none" stroke-linecap="round"/>')
    return '<defs>' + g1 + g2 + '</defs>' + sombra_chao(104, 182, 66, 6, op=.18) + fita + m1 + m2

def P02_4():   # contra-argumento, concessao e refutacao: a balanca pesando os dois lados
    return servier(SV + 'General_items/Servier/scale-imbalanced-left-1.svg', alt=192, sombra=(.75, 7))

# ======================================================================== P03 Generos e tipos textuais (modulo: jornal e carta)
def P03_1():   # tipos textuais: uma pilha de folhas separada por divisorias coloridas (narrar, descrever, dissertar, instruir)
    c = Cena(-24, 40)
    W, D = 1.0, 1.3
    p = c.add(Obj()); p.prof = 1e6
    caixa(p, -W, W, -D, D, 0, .26, '#f6f4ee', amb=.8)
    cores = ['#d64541', '#e8b33a', '#3f9a5c', '#3f72b8']
    abas = []
    for i, cor in enumerate(cores):
        z = .045 + i * .055; y0 = D - .15 - i * .62
        t = c.add(Obj(sombra=False)); t.prof = -1e5 - i
        caixa_chanfro(t, W - .01, W + .24, y0 - .45, y0, z, z + .016, .008, cor, amb=.55)
        abas.append((z, cor))
    def det(cam):
        out = []; z = .261; rng = np.random.default_rng(4)
        for k in range(9):
            y = D - .25 - k * .26
            out += palavras(cam, lambda *q: q, -W + .15, W - .2 - (.6 if k in (0,) else 0), y, z, '#9aa0aa' if k else '#2b2d33', 2.6 if k == 0 else 1.6, rng)
        for zz in np.linspace(.02, .25, 9):
            out.append((0, lin(cam, (W + .001, -D, zz), (W + .001, D, zz), '#d8d4c8', .35, cap='butt')))
        for zz, cor in abas:
            out.append((0, lin(cam, (W + .002, -D, zz + .008), (W + .002, D, zz + .008), cor, .9, cap='butt')))
            out.append((0, lin(cam, (-W, -D - .002, zz + .008), (W, -D - .002, zz + .008), cor, .9, cap='butt')))
        return out
    det.ordem = 3; p.cru.append((det, []))
    top = c.add(Obj(sombra=False)); top.prof = -1e6
    top.cru.append((lambda cam: [(0, '')], []))
    return c.render()

def P03_2():   # generos jornalisticos: o jornal do dia enrolado, preso com elastico
    c = Cena(-30, 30)
    o = c.add(Obj())
    R, L = .42, 2.3
    eixo = unit([1, -.25, 0]); b0 = -eixo * L / 2 + np.array([0, 0, R])
    cilindro_liso(o, b0, eixo * L, R, cor='#ebe7dc', brilho=.15, amb=.55, ordem=0, tampa_cor='#e2ddcf')
    u = np.array([0, 0, 1.0]); v = unit(np.cross(eixo, u))
    def det(cam):
        out = []
        # colunas de texto e a manchete correndo ao longo do rolo, so na parte voltada para a camera
        for k, a in enumerate(np.linspace(-1.2, 1.5, 12)):
            nrm = math.cos(a) * u + math.sin(a) * v
            if not visivel(cam, nrm): continue
            for (t0, t1, cor, w) in ((.08, .45, '#2b2d33' if k in (6, 7) else '#a3a5ab', 2.4 if k in (6, 7) else .9), (.5, .92, '#a3a5ab', .9)):
                p0 = b0 + eixo * L * t0 + nrm * R * 1.003; p1 = b0 + eixo * L * t1 + nrm * R * 1.003
                out.append((0, lin(cam, p0, p1, cor, w, cap='butt')))
        # foto
        q = []
        for a in np.linspace(.15, .75, 6): q.append(b0 + eixo * L * .52 + (math.cos(a) * u + math.sin(a) * v) * R * 1.004)
        for a in np.linspace(.75, .15, 6): q.append(b0 + eixo * L * .8 + (math.cos(a) * u + math.sin(a) * v) * R * 1.004)
        out.append((0, poli(cam, q, '#7d8a9c')))
        # espiral da ponta (folhas enroladas)
        e0 = b0 + eixo * L; pts = []
        for t in np.linspace(0, 5.5 * math.pi, 120):
            r = R * (.08 + .9 * t / (5.5 * math.pi))
            pts.append(cam.P(*(e0 + eixo * .002 + r * (math.cos(t) * u + math.sin(t) * v))))
        out.append((0, f'<polyline points="{" ".join(fmt(x)+","+fmt(y) for x, y in pts)}" fill="none" stroke="#b9b3a3" stroke-width=".8"/>'))
        # borda da folha de fora
        a = 2.0; p0 = b0 + (math.cos(a) * u + math.sin(a) * v) * R * 1.004
        out.append((0, lin(cam, p0, p0 + eixo * L, '#cfc9b9', .8, cap='butt')))
        return out
    det.ordem = 3; o.cru.append((det, []))
    el = c.add(Obj(sombra=False)); el.prof = -1e6
    def elastico(cam):
        out = []
        for t0 in (.3,):
            cc = b0 + eixo * L * t0
            angs = np.linspace(0, 2 * math.pi, 73)
            ok = [visivel(cam, math.cos(a) * u + math.sin(a) * v) for a in angs]
            k0 = next(i for i in range(len(angs)) if not ok[i])
            angs = [angs[(k0 + i) % 72] for i in range(72)]
            vis = [tuple(cc + R * 1.03 * (math.cos(a) * u + math.sin(a) * v)) for a in angs if visivel(cam, math.cos(a) * u + math.sin(a) * v)]
            out.append((0, tubo_liso(cam, vis, .03 * cam.k, '#c8323f')))
        return out
    el.cru.append((elastico, []))
    return c.render()

def P03_3():   # charge, tirinha, cartaz e infografico: a pagina de quadrinhos, com quadros e baloes de fala
    c = Cena(-22, 42)
    M = transf(math.radians(8))
    W, D = 1.05, 1.32
    f = c.add(Obj()); solido_convexo(f, [M(x, y, z) for x in (-W, W) for y in (-D, D) for z in (0, .09)], '#f4f1e8', amb=.8)
    def quadros(cam):
        out = []; z = .091
        for zz in (.03, .06):
            out.append((0, lin(cam, M(W + .001, -D, zz), M(W + .001, D, zz), '#d6d1c2', .5, cap='butt')))
            out.append((0, lin(cam, M(-W, -D - .001, zz), M(W, -D - .001, zz), '#d6d1c2', .5, cap='butt')))
        P = lambda x, y: M(x, y, z)
        celulas = [(-W + .1, -.04, .04, D - .1, '#bfe1f5'), (.04, W - .1, .04, D - .1, '#ffe39a'), (-W + .1, W - .1, -D + .1, -.04, '#f7c4c8')]
        for i, (x0, x1, y0, y1, fundo) in enumerate(celulas):
            lw = x1 - x0
            out.append((0, poli(cam, [P(x0, y0), P(x1, y0), P(x1, y1), P(x0, y1)], fundo, ' stroke="#1f2126" stroke-width="1.2"')))
            pos = ((.3, '#3f72b8'), (.72, '#d64541')) if i < 2 else ((.2, '#3f72b8'), (.45, '#d64541'), (.8, '#4f9a6a'))
            for dx, cor in pos:
                cx = x0 + dx * lw
                out.append((0, poli(cam, [P(cx - .13, y0), P(cx + .13, y0), P(cx + .09, y0 + .33), P(cx - .09, y0 + .33)], cor, ' stroke="#1f2126" stroke-width=".6"')))
                cab = [M(cx + .1 * math.cos(t), y0 + .44 + .1 * math.sin(t), z) for t in np.linspace(0, 2 * math.pi, 18)]
                out.append((0, poli(cam, cab, '#f1c9a5', ' stroke="#1f2126" stroke-width=".6"')))
            bx = x0 + (.42 if i != 1 else .58) * lw; by = y1 - .2
            rx = min(.3, lw * .38)
            bal = [M(bx + rx * math.cos(t), by + .13 * math.sin(t), z) for t in np.linspace(0, 2 * math.pi, 26)]
            sx = -.12 if i != 1 else .1
            out.append((0, poli(cam, [P(bx - .05, by - .1), P(bx + .04, by - .1), P(bx + sx, by - .32)], '#ffffff', ' stroke="#1f2126" stroke-width=".6"')))
            out.append((0, poli(cam, bal, '#ffffff', ' stroke="#1f2126" stroke-width=".7"')))
            for k in range(2):
                out.append((0, lin(cam, P(bx - rx * .65, by + .04 - k * .08), P(bx + rx * .65 - k * .08, by + .04 - k * .08), '#555a63', .9, cap='round')))
        return out
    quadros.ordem = 3; f.cru.append((quadros, []))
    return c.render()

def P03_4():   # divulgacao cientifica e texto digital: o tablet aberto numa reportagem de ciencia
    c = Cena(-22, 46)
    M = transf(math.radians(-10))
    W, D = .95, 1.3
    t = c.add(Obj()); caixa_chanfro(t, -W, W, -D, D, 0, .09, .04, '#2a2d33', amb=.4, brilho=.3)
    def tela(cam):
        out = []; z = .0905; P = lambda x, y: (x, y, z)
        sw, sd = W - .08, D - .1
        out.append((0, poli(cam, [P(-sw, -sd), P(sw, -sd), P(sw, sd), P(-sw, sd)], '#fdfdfb')))
        out.append((0, poli(cam, [P(-sw, sd - .2), P(sw, sd - .2), P(sw, sd), P(-sw, sd)], '#2f6fa8')))
        out.append((0, lin(cam, P(-sw + .1, sd - .1), P(-sw + .55, sd - .1), '#ffffff', 1.4, cap='butt')))
        # foto da materia: um planeta com aneis sobre fundo escuro
        y0, y1 = sd - .32, sd - 1.05
        out.append((0, poli(cam, [P(-sw + .1, y1), P(sw - .1, y1), P(sw - .1, y0), P(-sw + .1, y0)], '#151a2e')))
        cx, cy = cam.P(*P(0, (y0 + y1) / 2)); r = .26 * cam.k
        out.append((0, f'<radialGradient id="pla" cx=".35" cy=".3" r=".75"><stop offset="0" stop-color="#ffe2a6"/><stop offset=".6" stop-color="#d9a14e"/><stop offset="1" stop-color="#7a4f1c"/></radialGradient>'
                       f'<ellipse cx="{fmt(cx)}" cy="{fmt(cy)}" rx="{fmt(r*2)}" ry="{fmt(r*.55)}" fill="none" stroke="#e8d3a6" stroke-width="{fmt(r*.18)}" transform="rotate(-14 {fmt(cx)} {fmt(cy)})"/>'
                       f'<circle cx="{fmt(cx)}" cy="{fmt(cy)}" r="{fmt(r)}" fill="url(#pla)"/>'
                       f'<path d="M{fmt(cx-r*1.95)} {fmt(cy+r*.5)} A{fmt(r*2)} {fmt(r*.55)} -14 0 0 {fmt(cx+r*1.95)} {fmt(cy-r*.5)}" fill="none" stroke="#e8d3a6" stroke-width="{fmt(r*.18)}" transform="rotate(0)"/>'))
        rng = np.random.default_rng(8)
        out += palavras(cam, lambda *q: q, -sw + .1, sw - .3, y1 - .14, z, '#22252c', 2.4, rng, pmin=.2, pmax=.45)
        for k in range(5):
            out += palavras(cam, lambda *q: q, -sw + .1, sw - .1 - (.5 if k == 4 else 0), y1 - .32 - k * .15, z, '#9aa0aa', 1.3, rng)
        return out
    tela.ordem = 3; t.cru.append((tela, []))
    return c.render()

# ======================================================================== P04 Coesao e coerencia (modulo: corrente)
def P04_1():   # referencia (pronome, elipse, substituicao): a placa de RETORNO, voltar ao termo ja dito
    c = Cena(-24, 14)
    p = c.add(Obj())
    cilindro_liso(p, (0, .12, 0), (0, 0, 2.2), .07, cor='#a9b0b8', brilho=.6, ordem=0)
    s = c.add(Obj()); s.prof = -1e6
    W, H, z0 = .85, 1.1, 1.25
    caixa_chanfro(s, -W, W, -.04, 0, z0, z0 + 2 * H * .62, .03, '#1d5fae', amb=.45, brilho=.2)
    Hs = 2 * H * .62
    def seta(cam):
        y = -.041; P = lambda x, z: (x, y, z0 + z)
        out = [(0, poli(cam, [P(-W + .07, .07), P(W - .07, .07), P(W - .07, Hs - .07), P(-W + .07, Hs - .07)], 'none', ' stroke="#ffffff" stroke-width="1.4"'))]
        # seta em U: sobe pela direita, faz a curva no alto e desce pela esquerda, com a ponta para baixo
        r = .32; cx, cz = 0, Hs * .62; w = .14
        caminho_ = [(r, .22)] + [(r * math.cos(t), cz + r * math.sin(t)) for t in np.linspace(0, math.pi, 24)] + [(-r, .5)]
        pts = [cam.P(*P(x, z if i else z)) for i, (x, z) in enumerate(caminho_)]
        pts[0] = cam.P(*P(r, .2))
        d = ' '.join(fmt(a) + ',' + fmt(b) for a, b in pts)
        out.append((0, f'<polyline points="{d}" fill="none" stroke="#ffffff" stroke-width="{fmt(w*cam.k)}" stroke-linejoin="round"/>'))
        out.append((0, poli(cam, [P(-r - .26, .52), P(-r + .26, .52), P(-r, .2)], '#ffffff')))
        return out
    seta.ordem = 3; s.cru.append((seta, []))
    return c.render()

def P04_2():   # conjuncoes e relacoes logicas: a ponte de pedra que liga as duas margens
    c = Cena(-32, 32)
    pedra = '#bfae94'
    perfil = [(-1.6, 0), (-.62, 0)] + [(-.62 * math.cos(t), .62 * math.sin(t) + .0) for t in np.linspace(0, math.pi, 28)][::-1][::-1]
    arco = [(.62 * math.cos(t), .62 * math.sin(t)) for t in np.linspace(math.pi, 0, 28)]
    perfil = [(-1.6, 0), (-.62, 0)] + arco[1:-1] + [(.62, 0), (1.6, 0), (1.6, .85), (1.25, .95), (0, 1.02), (-1.25, .95), (-1.6, .85)]
    o = c.add(Obj())
    extrusao(o, perfil, -.42, .42, pedra, pedra, M=lambda x, y, z: (x, -z, y), amb=.45)
    def blocos(cam):
        out = []; y = -.421
        P = lambda x, z: (x, y, z)
        for t in np.linspace(math.pi, 0, 10)[1:-1]:
            a = (.62 * math.cos(t), .62 * math.sin(t)); b = (.92 * math.cos(t), .92 * math.sin(t))
            out.append((0, lin(cam, P(*a), P(*b), '#8c7b62', .7, cap='butt')))
        arc2 = [cam.P(*P(.92 * math.cos(t), .92 * math.sin(t))) for t in np.linspace(math.pi, 0, 28)]
        out.append((0, f'<polyline points="{" ".join(fmt(a)+","+fmt(b) for a, b in arc2)}" fill="none" stroke="#8c7b62" stroke-width=".7"/>'))
        for zz in (.25, .5):
            for x0, x1 in ((-1.6, -.62 - .3 * (zz > .4)), (.62 + .3 * (zz > .4), 1.6)):
                out.append((0, lin(cam, P(x0, zz), P(x1, zz), '#8c7b62', .6, cap='butt')))
        out.append((0, lin(cam, P(-1.6, .85), P(-1.25, .95), '#8c7b62', .6, cap='butt')))
        return out
    blocos.ordem = 3; o.cru.append((blocos, []))
    # parapeito
    par = c.add(Obj(sombra=False)); par.prof = -1e6
    for yy in (-.38, .3):
        pts = [(-1.6, .85), (-1.25, .95), (0, 1.02), (1.25, .95), (1.6, .85)]
        for (x0, z0_), (x1, z1_) in zip(pts, pts[1:]):
            extrusao(par, [(x0, z0_), (x1, z1_), (x1, z1_ + .16), (x0, z0_ + .16)], yy, yy + .08, mix(pedra, '#ffffff', .1), pedra, M=lambda x, y, z: (x, z, y) if False else (x, z, y), amb=.45)
    agua = c.add(Obj(sombra=False)); agua.prof = 2e6
    def rio(cam):
        q = [cam.P(*p) for p in [(-.62, -.42, 0), (.62, -.42, 0), (.8, -.75, 0), (-.5, -.75, 0)]]
        out = ('<linearGradient id="rio" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2f78b8"/><stop offset="1" stop-color="#7fc0ea"/></linearGradient>'
               f'<path d="{caminho(q)}" fill="url(#rio)"/>')
        for k in range(3):
            a = cam.P(-.3 + k * .3, -.55 - k * .05, 0); b = cam.P(-.1 + k * .3, -.55 - k * .05, 0)
            out += f'<line x1="{fmt(a[0])}" y1="{fmt(a[1])}" x2="{fmt(b[0])}" y2="{fmt(b[1])}" stroke="#ffffff" stroke-width=".9" opacity=".7" stroke-linecap="round"/>'
        return [(0, out)]
    agua.cru.append((rio, [(-.62, -.75, 0), (.8, -.75, 0)]))
    return c.render()

def P04_3():   # progressao tematica e ordem das ideias: a fileira de dominos caindo em sequencia
    c = Cena(-34, 30)
    n = 6
    for i in range(n):
        t = i / (n - 1)
        x = -1.5 + 3.0 * t; y = .35 * math.sin(math.pi * t) - .1
        yaw = math.atan2(.35 * math.pi * math.cos(math.pi * t) / 3.0, 1)
        queda = math.radians([64, 42, 20, 0, 0, 0][i])
        M = transf(yaw, (x, y, 0), pitch=queda)
        o = c.add(Obj()); o.prof = -x * 10
        Lx, Ly, Lz = .1, .32, .62
        solido_convexo(o, [M(a, b, cz) for a in (-Lx, Lx) for b in (-Ly, Ly) for cz in (0, 2 * Lz)], '#1d1f24', amb=.45, brilho=.35)
        def pips(cam, M=M, Lx=Lx, Ly=Ly, Lz=Lz, i=i):
            out = []
            nrm = np.array(M(-1, 0, 0)) - np.array(M(0, 0, 0))
            xf = -Lx - .002
            if not visivel(cam, nrm): xf = Lx + .002
            out.append((0, lin(cam, M(xf, -Ly + .05, Lz), M(xf, Ly - .05, Lz), '#d8d8d0', .8, cap='butt')))
            pp = {0: [(0, .5)], 1: [(-.5, .25), (.5, .75)], 2: [(-.5, .2), (0, .5), (.5, .8)]}
            for meia, k in ((0, (i + 1) % 3), (1, (i * 2) % 3)):
                for (a, b) in pp[k]:
                    cz = (meia * Lz) + b * Lz; cy = a * Ly * .55
                    out.append((0, poli(cam, circ3(M(xf, cy, cz), unit(np.array(M(0, 1, 0)) - np.array(M(0, 0, 0))), unit(np.array(M(0, 0, 1)) - np.array(M(0, 0, 0))), .045, 10), '#f4f4ee')))
            return out
        pips.ordem = 3; o.cru.append((pips, []))
    return c.render()

def elo_aberto(c, centro, eixo_comp, normal_plano, L=1.0, R=.32, r=.085, cor='#a9b2bd', n=60, falta=None):
    """elo de corrente (tubo em forma de pista); falta=(s0, s1) em fracao do perimetro abre o elo"""
    cc = np.array(centro, float); a = unit(eixo_comp); nn = unit(normal_plano); bv = np.cross(nn, a)
    meio = (L - 2 * R) / 2; per = 4 * meio + 2 * math.pi * R
    pts = []
    for i in range(n + 1):
        s = per * i / n
        if s < 2 * meio: p = (-meio + s) * a - R * bv
        elif s < 2 * meio + math.pi * R:
            t = -math.pi / 2 + (s - 2 * meio) / R; p = meio * a + R * (math.cos(t) * a + math.sin(t) * bv)
        elif s < 4 * meio + math.pi * R: p = (meio - (s - 2 * meio - math.pi * R)) * a + R * bv
        else:
            t = math.pi / 2 + (s - 4 * meio - math.pi * R) / R; p = -meio * a + R * (math.cos(t) * a + math.sin(t) * bv)
        if falta and falta[0] <= i / n <= falta[1]: pts.append(None); continue
        pts.append(tuple(cc + p))
    o = c.add(Obj()); o.extra_pts += [p for p in pts if p]
    def fn(cam):
        out = []; rpx = r * cam.k
        for i in range(n):
            if pts[i] is None or pts[i + 1] is None: continue
            a_, b_ = np.array(pts[i]), np.array(pts[i + 1]); d = b_ - a_
            ponta = (i > 0 and pts[i - 1] is None) or (i + 2 <= n and pts[i + 2] is None)
            a2 = a_ - d * .25; b2 = b_ + d * .25
            m = (a_ + b_) / 2; dd = unit(d)
            Lp = unit(-np.array(G.LUZ)); perp = Lp - (Lp @ dd) * dd
            radial = unit(m - cc)
            l = .35 + .65 * max(0, radial @ Lp * .5 + .5 * np.linalg.norm(perp))
            corpo = mix(mix(cor, '#000000', .45), mix(cor, '#ffffff', .15), l)
            out.append((cam.D(*m) + r * .8, lin(cam, a2, b2, mix(cor, '#000000', .55), rpx * 2, cap='round')))
            s_ = lin(cam, a2, b2, corpo, rpx * 1.5, cap='round' if ponta else 'butt')
            (x1, y1), (x2, y2) = cam.P(*a2), cam.P(*b2); off = rpx * .35
            s_ += f'<line x1="{fmt(x1-off*.4)}" y1="{fmt(y1-off)}" x2="{fmt(x2-off*.4)}" y2="{fmt(y2-off)}" stroke="#ffffff" stroke-width="{fmt(rpx*.4)}" opacity="{fmt(.25 + .6 * l)}"/>'
            out.append((cam.D(*m), s_))
        return out
    o.cru.append((fn, [])); o.prof = 0
    return o

def P04_4():   # ambiguidade, redundancia e quebra de coerencia: a corrente com um elo partido
    c = Cena(-30, 30)
    L = 1.15; passo = .78
    elo_aberto(c, (-passo - .1, 0, .5), (1, 0, 0), (0, 1, .25), L)
    elo_aberto(c, (-.1, 0, .5), (1, 0, 0), (0, .25, -1), L, falta=(.30, .40))
    elo_aberto(c, (passo + .45, -.1, .42), (1, -.2, -.1), (0, 1, -.35), L)
    for o in c.objs: o.prof = 0
    return c.render()

# ======================================================================== P05 Semantica e vocabulario (modulo: dicionario e lupa)
from gera_mat2 import peca
def P05_1():   # sentido da palavra no contexto e substituicao: o quebra-cabeca em que so a peca certa completa a imagem
    c = Cena(-22, 44)
    L = .78; e = .11
    linhas = ['#7fbfe8', '#f2c94c', '#5aa864']   # ceu, sol/horizonte, campo
    H = {(i, j): (1 if (i + j) % 2 else -1) for i in range(3) for j in range(2)}   # aresta vertical entre (j,i) e (j+1,i)
    V = {(i, j): (-1 if (i + j) % 2 else 1) for i in range(2) for j in range(3)}   # aresta horizontal entre linha i e i+1, coluna j
    for i in range(3):          # i: linha (0 = de baixo)
        for j in range(3):
            baixo = 0 if i == 0 else -V[(i - 1, j)]
            cima = 0 if i == 2 else V[(i, j)]
            esq = 0 if j == 0 else -H[(i, j - 1)]
            dire = 0 if j == 2 else H[(i, j)]
            cor = linhas[2 - i] if i != 1 else linhas[1]
            cor = {0: '#5aa864', 1: '#9fd0ef', 2: '#6fb3e3'}[i]
            pts = peca((j - 1) * L, (i - 1) * L, L, (baixo, dire, cima, esq))
            if (i, j) == (1, 1):
                M = transf(math.radians(18), (.95, -1.25, .05), roll=math.radians(0))
                o = c.add(Obj()); o.prof = -1e6
                extrusao(o, [(x, y) for x, y in pts], 0, e, cor, mix(cor, '#000000', .15), M=M, brilho=.25, amb=.4)
                continue
            o = c.add(Obj()); o.prof = 1e6 - i * 10 + j
            extrusao(o, pts, 0, e, cor, mix(cor, '#000000', .15), brilho=.2, amb=.4)
            if i == 0:
                def capim(cam, j=j):
                    x0 = (j - 1) * L
                    return [(0, lin(cam, (x0 - .25 + k * .17, -L - .2 + (k % 2) * .25, e + .001), (x0 - .2 + k * .17, -L - .1 + (k % 2) * .25, e + .001), '#3e8a4a', 1.0)) for k in range(4)]
                capim.ordem = 4; o.cru.append((capim, []))
    return c.render()

def P05_2():   # denotacao, conotacao e polissemia: a rosa vermelha (a flor, e o amor que ela significa)
    g = ('<radialGradient id="pt" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#ff6b6b"/><stop offset=".5" stop-color="#d0202b"/><stop offset="1" stop-color="#7a0c14"/></radialGradient>'
         '<radialGradient id="pt2" cx=".5" cy=".2" r=".9"><stop offset="0" stop-color="#e83a44"/><stop offset=".7" stop-color="#a5121c"/><stop offset="1" stop-color="#5e0810"/></radialGradient>'
         '<linearGradient id="ha" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6fa84a"/><stop offset="1" stop-color="#2f5e22"/></linearGradient>'
         '<linearGradient id="fo" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7cbf55"/><stop offset=".6" stop-color="#3f7a2c"/><stop offset="1" stop-color="#25501a"/></linearGradient>')
    out = '<defs>' + g + '</defs>' + sombra_chao(104, 188, 74, 6, op=.18)
    # haste deitada, da flor (alto-direita) para baixo-esquerda
    out += '<path d="M38 182 C70 150 96 128 122 92" stroke="#25501a" stroke-width="7" fill="none" stroke-linecap="round"/>'
    out += '<path d="M38 182 C70 150 96 128 122 92" stroke="url(#ha)" stroke-width="5" fill="none" stroke-linecap="round"/>'
    out += '<path d="M40 179 C70 149 95 128 119 94" stroke="#a6d47e" stroke-width="1.2" fill="none" opacity=".7"/>'
    for x, y in ((62, 158), (88, 133), (104, 116)):
        out += f'<path d="M{x} {y} l-4 -5 l6 2z" fill="#3f7a2c"/>'
    # folhas
    for (x, y, rot, s) in ((76, 145, -20, 1.0), (98, 124, 150, .85)):
        out += (f'<g transform="translate({x} {y}) rotate({rot}) scale({s})"><path d="M0 0 C10 -16 32 -18 46 -10 C34 2 14 8 0 0Z" fill="url(#fo)" stroke="#25501a" stroke-width=".8"/>'
                '<path d="M2 -1 C16 -8 30 -10 44 -10" stroke="#a6d47e" stroke-width=".8" fill="none"/>'
                + ''.join(f'<path d="M{10+k*8} {-4-k*1.2} l5 -5" stroke="#a6d47e" stroke-width=".5" opacity=".8"/><path d="M{10+k*8} {-4-k*1.2} l6 3" stroke="#a6d47e" stroke-width=".5" opacity=".8"/>' for k in range(4)) + '</g>')
    # sepalas
    cx, cy = 132, 76
    for a in (200, 250, 300):
        out += f'<path d="M{cx-6} {cy+16} q{8*math.cos(math.radians(a)):.1f} {8*math.sin(math.radians(a))+22:.1f} {20*math.cos(math.radians(a)):.1f} {14:.1f}" stroke="#2f5e22" stroke-width="3" fill="none" stroke-linecap="round"/>'
    # flor: petalas de fora para dentro
    def petala(rx, ry, ang, dx, gid, sw=.8):
        return (f'<g transform="translate({cx} {cy}) rotate({ang})"><ellipse cx="{dx}" cy="0" rx="{rx}" ry="{ry}" fill="url(#{gid})" stroke="#5e0810" stroke-width="{sw}"/></g>')
    for k in range(6):
        out += petala(28, 22, k * 60 + 15, 14, 'pt2')
    for k in range(5):
        out += petala(21, 17, k * 72 + 40, 9, 'pt')
    out += f'<circle cx="{cx}" cy="{cy}" r="17" fill="url(#pt)" stroke="#5e0810" stroke-width=".8"/>'
    esp = []
    for t in np.linspace(0, 4.2 * math.pi, 60):
        r = 2 + 13 * t / (4.2 * math.pi); esp.append((cx + r * math.cos(t), cy + r * math.sin(t) * .9))
    out += f'<polyline points="{" ".join(fmt(a)+","+fmt(b) for a, b in esp)}" fill="none" stroke="#6e0a12" stroke-width="1.3" opacity=".85"/>'
    out += f'<ellipse cx="{cx-14}" cy="{cy-18}" rx="10" ry="4" fill="#fff" opacity=".22" transform="rotate(-25 {cx-14} {cy-18})"/>'
    return out

def lapis_cor(c, p0, direcao, comp=2.2, r=.075, cor='#f2c12e', prof=None):
    d = unit(direcao); p0 = np.array(p0, float)
    o = c.add(Obj()); o.prof = prof if prof is not None else -1e6
    t = np.array([0, 0, 1.0]); u = unit(np.cross(d, t)); v = np.cross(u, d)
    corpo = []
    for k in range(6):
        a = 2 * math.pi * k / 6 + math.pi / 6
        corpo += [tuple(p0 + r * (math.cos(a) * u + math.sin(a) * v)), tuple(p0 + d * comp * .82 + r * (math.cos(a) * u + math.sin(a) * v))]
    solido_convexo(o, corpo, cor, amb=.4, brilho=.25)
    cilindro_liso(o, p0 + d * comp * .82, d * comp * .13, r * .98, r * .3, cor='#ecc9a0', ordem=1)
    cilindro_liso(o, p0 + d * comp * .95, d * comp * .05, r * .31, 0, cor=cor, ordem=2)
    return o

def P05_3():   # sinonimia, antonimia e campo semantico: os lapis de cor lado a lado (tons vizinhos e tons opostos)
    c = Cena(-24, 40)
    cores = ['#c62828', '#ef6c00', '#f9c80e', '#43a047', '#1e88e5', '#3949ab', '#8e24aa']
    for i, cor in enumerate(cores):
        y = -.95 + i * .3; x0 = -1.2 + .12 * math.sin(i * 1.7)
        lapis_cor(c, (x0, y, .095), (1, .08, 0), 2.3, .095, cor, prof=-i * 10)
    return c.render()

def P05_4():   # variacao linguistica, registro e adequacao: a gravata (formal) e o bone (informal), cada um para uma ocasiao
    g = ('<linearGradient id="gv" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#14305e"/><stop offset=".45" stop-color="#2c5aa0"/><stop offset="1" stop-color="#102648"/></linearGradient>'
         '<radialGradient id="bo" cx=".38" cy=".3" r=".8"><stop offset="0" stop-color="#ff8a65"/><stop offset=".5" stop-color="#e64a19"/><stop offset="1" stop-color="#8c2a0c"/></radialGradient>'
         '<linearGradient id="ab" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d84315"/><stop offset="1" stop-color="#7a240a"/></linearGradient>'
         '<clipPath id="gc"><path d="M52 40 L74 40 L80 52 L90 150 L63 176 L36 150 L46 52Z"/></clipPath>')
    # gravata deitada na diagonal (coordenadas ja giradas, para o enquadramento medir so o desenho)
    ang = math.radians(-32); ox, oy = 63, 110; tx, ty = 8, 0
    R_ = lambda x, y: (ox + tx + (x - ox) * math.cos(ang) - (y - oy) * math.sin(ang), oy + ty + (x - ox) * math.sin(ang) + (y - oy) * math.cos(ang))
    D_ = lambda pts: 'M' + ' L'.join(fmt(R_(x, y)[0]) + ' ' + fmt(R_(x, y)[1]) for x, y in pts) + 'Z'
    corpo = [(52, 40), (74, 40), (80, 52), (90, 150), (63, 176), (36, 150), (46, 52)]
    g = g.replace('<path d="M52 40 L74 40 L80 52 L90 150 L63 176 L36 150 L46 52Z"/>', f'<path d="{D_(corpo)}"/>')
    lis = ''
    for b_ in range(-60, 150, 14):            # listras diagonais y = x + b, recortadas pela gravata
        x0 = max(36, 40 - b_); x1 = min(90, 176 - b_)
        if x1 > x0:
            (a1, a2), (b1, b2) = R_(x0, x0 + b_), R_(x1, x1 + b_)
            lis += f'<path d="M{fmt(a1)} {fmt(a2)} L{fmt(b1)} {fmt(b2)}" stroke="#c9a24a" stroke-width="3" opacity=".9"/>'
    gr = f'<path d="{D_(corpo)}" fill="url(#gv)" stroke="#0c1c38" stroke-width=".9"/>'
    gr += '<g clip-path="url(#gc)">' + lis + '</g>'
    gr += f'<path d="{D_(corpo)}" fill="none" stroke="#0c1c38" stroke-width=".9"/>'
    gr += f'<path d="{D_([(50, 30), (76, 30), (74, 50), (52, 50)])}" fill="#1d4280" stroke="#0c1c38" stroke-width=".9"/>'
    gr += f'<path d="{D_([(53, 33), (60, 33), (58, 47), (54, 47)])}" fill="#fff" opacity=".18"/>'
    out = '<defs>' + g + '</defs>' + sombra_chao(104, 186, 82, 6, op=.18)
    # bone
    bo = '<g transform="translate(136 130)">'
    bo += '<path d="M-6 30 C10 52 66 58 76 40 C70 34 40 30 -6 30Z" fill="url(#ab)" stroke="#5a1a07" stroke-width=".9"/>'
    bo += '<path d="M-36 30 C-40 -18 40 -24 46 30 C30 38 -20 38 -36 30Z" fill="url(#bo)" stroke="#5a1a07" stroke-width=".9"/>'
    bo += '<path d="M5 -16 C2 0 2 18 6 35" stroke="#7a240a" stroke-width=".9" fill="none"/><path d="M5 -16 C22 -6 30 12 34 33" stroke="#7a240a" stroke-width=".9" fill="none"/><path d="M5 -16 C-14 -6 -24 12 -26 31" stroke="#7a240a" stroke-width=".9" fill="none"/>'
    bo += '<ellipse cx="5" cy="-15" rx="4.5" ry="2.6" fill="#c63f12" stroke="#5a1a07" stroke-width=".7"/>'
    bo += '<path d="M-30 31 C-12 39 30 39 44 31" stroke="#5a1a07" stroke-width="1.3" fill="none"/>'
    bo += '<ellipse cx="-12" cy="-4" rx="9" ry="5" fill="#fff" opacity=".22" transform="rotate(-30 -12 -4)"/></g>'
    return out + gr + bo

# ======================================================================== P06 Figuras de linguagem (modulo: prisma)
def P06_1():   # metafora, comparacao e metonimia: a coroa (que, na frase "a Coroa decidiu", e o proprio rei)
    c = Cena(-20, 24)
    o = c.add(Obj())
    ouro = '#d9a62e'
    N = 96; R = .95; h0 = .5; pontas = 8
    def alt(t):
        f = (t * pontas / (2 * math.pi)) % 1
        return h0 + .55 * (1 - abs(f - .5) * 2) ** 1.4
    ts = np.linspace(0, 2 * math.pi, N, endpoint=False)
    for i in range(N):
        a, b = ts[i], ts[(i + 1) % N]
        pa, pb = (R * math.cos(a), R * math.sin(a)), (R * math.cos(b), R * math.sin(b))
        o.face([(pa[0], pa[1], 0), (pb[0], pb[1], 0), (pb[0], pb[1], alt(b if i < N - 1 else 2 * math.pi)), (pa[0], pa[1], alt(a))], ouro, amb=.4, brilho=.5)
        o.face([(pa[0] * .97, pa[1] * .97, alt(a)), (pb[0] * .97, pb[1] * .97, alt(b if i < N - 1 else 2 * math.pi)), (pb[0] * .97, pb[1] * .97, .02), (pa[0] * .97, pa[1] * .97, .02)], mix('#8a6418', '#c89422', .25 + .5 * max(0, math.cos(a - 2.4))), plana=True)
    o.face([(R * .96 * math.cos(t), R * .96 * math.sin(t), .03) for t in np.linspace(0, 2 * math.pi, 48, endpoint=False)], '#8e1424', amb=.55)   # forro de veludo
    for k in range(pontas):
        t = (k + .5) * 2 * math.pi / pontas
        o.esfera((R * math.cos(t), R * math.sin(t), h0 + .6), .09, '#f4efe4')
    for z in (.06, h0 - .06):
        def aro(cam, z=z):
            pts = [(R * 1.01 * math.cos(t), R * 1.01 * math.sin(t), z) for t in np.linspace(0, 2 * math.pi, 80)]
            vis = [p for p, t in zip(pts, np.linspace(0, 2 * math.pi, 80)) if visivel(cam, (math.cos(t), math.sin(t), 0))]
            return [(-5, tubo_liso(cam, vis, .022 * cam.k, '#c89422'))]
        aro.ordem = 3; o.cru.append((aro, []))
    def joias(cam):
        out = []
        for k, cor in enumerate(['#c0182a', '#1f7a3e', '#1d4fae', '#c0182a', '#1f7a3e', '#1d4fae', '#c0182a', '#1f7a3e']):
            t = (k + .5) * 2 * math.pi / pontas
            n = (math.cos(t), math.sin(t), 0)
            if not visivel(cam, n): continue
            p = (R * 1.02 * math.cos(t), R * 1.02 * math.sin(t), h0 * .5)
            x, y = cam.P(*p); fator = abs(cam.V(*n)[2])
            rx = .1 * cam.k * fator + .5; ry = .12 * cam.k
            out.append((-cam.D(*p), f'<ellipse cx="{fmt(x)}" cy="{fmt(y)}" rx="{fmt(rx)}" ry="{fmt(ry)}" fill="{cor}" stroke="#6b4a0c" stroke-width=".7"/>'
                                    f'<ellipse cx="{fmt(x-rx*.3)}" cy="{fmt(y-ry*.35)}" rx="{fmt(rx*.3)}" ry="{fmt(ry*.25)}" fill="#fff" opacity=".7"/>'))
        return out
    joias.ordem = 4; o.cru.append((joias, []))
    return c.render()

def P06_2():   # figuras de pensamento (antitese, paradoxo...): o triangulo impossivel, ideias que se contradizem e se sustentam
    az, el = 45, math.degrees(math.atan(1 / math.sqrt(2)))
    L, w = 2.0, .42
    barras = [((0, 0, 0), (1, 0, 0)), ((L, 0, 0), (0, 1, 0)), ((L, L, 0), (0, 0, -1))]
    cores = {(1, 0, 0): '#c98a4b', (0, 1, 0): '#c98a4b', (0, 0, 1): '#c98a4b'}
    cam = G.Cam(az, el, [(x, y, z) for x in (-w, L + w) for y in (-w, L + w) for z in (-L - w, w)], 180, 180, 100, 100)
    def caixa_pts(p0, d):
        p0 = np.array(p0, float); d = np.array(d, float)
        lo = np.minimum(p0, p0 + d * L) - w / 2 * (1 - np.abs(d)) - w / 2 * np.abs(d)
        hi = np.maximum(p0, p0 + d * L) + w / 2 * (1 - np.abs(d)) + w / 2 * np.abs(d)
        return lo, hi
    def faces(lo, hi):
        x0, y0, z0 = lo; x1, y1, z1 = hi
        return [((-1, 0, 0), [(x0, y0, z0), (x0, y1, z0), (x0, y1, z1), (x0, y0, z1)]),
                ((0, -1, 0), [(x0, y0, z0), (x1, y0, z0), (x1, y0, z1), (x0, y0, z1)]),
                ((0, 0, 1), [(x0, y0, z1), (x1, y0, z1), (x1, y1, z1), (x0, y1, z1)])]
    base = '#b5793f'
    TONS = {(-1, 0, 0): mix(base, '#000000', .38), (0, -1, 0): mix(base, '#ffffff', .22), (0, 0, 1): base}
    def desenha(lo, hi):
        s = ''
        for n, pts in faces(lo, hi):
            cor = TONS[n]
            s += f'<path d="{caminho([cam.P(*p) for p in pts])}" fill="{cor}" stroke="#5e3a17" stroke-width=".8" stroke-linejoin="round"/>'
        return s
    out = ''
    # ordem do pintor que cria a ilusao: a barra vertical primeiro, depois a do fundo, depois a da frente,
    # e por ultimo o cubo da ponta da barra vertical por cima do inicio da primeira
    b3 = caixa_pts(*barras[2]); b2 = caixa_pts(*barras[1]); b1 = caixa_pts(*barras[0])
    out += desenha(*b3) + desenha(*b2) + desenha(*b1)
    lo3, hi3 = b3; ponta = (np.array([lo3[0], lo3[1], lo3[2]]), np.array([hi3[0], hi3[1], lo3[2] + w]))
    # o cubo final da vertical: so as faces de lado (a de cima ficaria escondida pela primeira barra)
    s = ''
    for n, pts in faces(*ponta)[:2]:
        s += f'<path d="{caminho([cam.P(*p) for p in pts])}" fill="{TONS[n]}" stroke="#5e3a17" stroke-width=".8" stroke-linejoin="round"/>'
    out += s
    # de pe, com a ponta para cima (como e desenhado o triangulo de Penrose)
    sh = sombra_chao(72, 104, 46, 4, op=.22)
    return sh + f'<g transform="rotate(-90 96 96)">{out}</g>'

def P06_3():   # figuras de som e de construcao: o sino de mao (a repeticao de sons que se ouve no verso)
    c = Cena(-22, 18)
    o = c.add(Obj())
    perfil = [(0, .78), (.06, .76), (.16, .64), (.45, .56), (.8, .5), (1.05, .44), (1.18, .3), (1.24, 0.0)]
    bronze = '#c99a3a'
    for (z0, r0), (z1, r1) in zip(perfil, perfil[1:]):
        cilindro_liso(o, (0, 0, z0), (0, 0, z1 - z0), r0, r1 if r1 > 0 else 0, cor=bronze, brilho=.6, amb=.38, ordem=1, tampa_base=(z0 == 0), tampa_cor='#3d2a0a')
    cilindro_liso(o, (0, 0, 1.2), (0, 0, .1), .14, .12, cor='#b38a32', brilho=.5, ordem=2)
    cilindro_liso(o, (0, 0, 1.3), (0, 0, .75), .1, .13, cor='#5b2f18', brilho=.35, ordem=3)
    o.esfera((0, 0, 2.12), .17, '#5b2f18')
    def friso(cam):
        out = []
        for z, r in ((.12, .7), (.18, .62)):
            pts = [(r * 1.01 * math.cos(t), r * 1.01 * math.sin(t), z) for t in np.linspace(0, 2 * math.pi, 60)]
            vis = [p for p, t in zip(pts, np.linspace(0, 2 * math.pi, 60)) if visivel(cam, (math.cos(t), math.sin(t), 0))]
            P = [cam.P(*p) for p in vis]
            out.append((0, f'<polyline points="{" ".join(fmt(a)+","+fmt(b) for a, b in P)}" fill="none" stroke="#7a5a18" stroke-width=".9"/>'))
        return out
    friso.ordem = 5; o.cru.append((friso, []))
    return c.render()

# ======================================================================== P07 Morfologia (modulo: pecas IN + UTIL)
def P07_1():   # substantivo, adjetivo e adverbio (classificacao e funcao): o arquivo de gavetas etiquetadas, uma aberta
    c = Cena(-30, 24)
    mad = '#9a5b2e'
    W, D, H = .75, .8, 1.8
    o = c.add(Obj()); o.prof = 1e6
    caixa_chanfro(o, -W, W, -D, D, 0, H, .03, mad, amb=.42, brilho=.15)
    hs = (H - .16) / 3
    def frentes(cam):
        out = []; y = -D - .001
        for k in range(3):
            if k == 1: continue
            z0 = .08 + k * hs; z1 = z0 + hs - .06
            out.append((0, poli(cam, [(-W + .07, y, z0), (W - .07, y, z0), (W - .07, y, z1), (-W + .07, y, z1)], mix(mad, '#ffffff', .08), f' stroke="{mix(mad, "#000000", .45)}" stroke-width=".8"')))
            zc = (z0 + z1) / 2
            out.append((0, poli(cam, [(-.22, y - .002, zc + .05), (.22, y - .002, zc + .05), (.22, y - .002, zc + .2), (-.22, y - .002, zc + .2)], '#d9b45a', ' stroke="#8a6a1c" stroke-width=".7"')))
            out.append((0, poli(cam, [(-.18, y - .003, zc + .075), (.18, y - .003, zc + .075), (.18, y - .003, zc + .175), (-.18, y - .003, zc + .175)], '#f6f1e3')))
            out.append((0, lin(cam, (-.15, y - .004, zc - .1), (.15, y - .004, zc - .1), '#c9cdd3', .07 * cam.k) + lin(cam, (-.15, y - .004, zc - .1), (.15, y - .004, zc - .1), '#ffffff', .02 * cam.k, op=.8)))
        z0 = .08 + hs; z1 = z0 + hs - .06
        out.append((0, poli(cam, [(-W + .05, y, z0 - .02), (W - .05, y, z0 - .02), (W - .05, y, z1 + .02), (-W + .05, y, z1 + .02)], '#3b2010')))
        return out
    frentes.ordem = 3; o.cru.append((frentes, []))
    # gaveta do meio puxada para fora, com fichas dentro
    g = c.add(Obj()); g.prof = -1e6
    z0 = .08 + hs; z1 = z0 + hs - .06; puxa = .75
    yA, yB = -D - puxa, -D + .3
    caixa(g, -W + .08, W - .08, yA + .04, yB, z0, z0 + .05, mix(mad, '#ffffff', .15))
    for x0, x1 in ((-W + .08, -W + .13), (W - .13, W - .08)):
        caixa(g, x0, x1, yA + .04, yB, z0, z1 - .08, mix(mad, '#ffffff', .1), amb=.45)
    def fichas(cam):
        out = []
        for k in range(9):
            y = yA + .18 + k * .09
            cor = '#fbfaf5' if k % 3 else '#f3e3a3'
            out.append((0, poli(cam, [(-W + .16, y, z0 + .05), (W - .16, y, z0 + .05), (W - .16, y, z1 + .02 - (.08 if k % 3 else 0)), (-W + .16, y, z1 + .02 - (.08 if k % 3 else 0))], cor, ' stroke="#b9b3a3" stroke-width=".5"')))
        return out
    fichas.ordem = 1; g.cru.append((fichas, []))
    fr = c.add(Obj(sombra=False)); fr.prof = -2e6
    caixa_chanfro(fr, -W + .07, W - .07, yA, yA + .05, z0, z1, .015, mix(mad, '#ffffff', .08), amb=.45)
    def frente(cam):
        y = yA - .001; zc = (z0 + z1) / 2
        return [(0, poli(cam, [(-.22, y, zc + .05), (.22, y, zc + .05), (.22, y, zc + .2), (-.22, y, zc + .2)], '#d9b45a', ' stroke="#8a6a1c" stroke-width=".7"')
                    + poli(cam, [(-.18, y - .001, zc + .075), (.18, y - .001, zc + .075), (.18, y - .001, zc + .175), (-.18, y - .001, zc + .175)], '#f6f1e3')
                    + lin(cam, (-.15, y - .002, zc - .1), (.15, y - .002, zc - .1), '#c9cdd3', .07 * cam.k) + lin(cam, (-.15, y - .002, zc - .1), (.15, y - .002, zc - .1), '#ffffff', .02 * cam.k, op=.8))]
    frente.ordem = 3; fr.cru.append((frente, []))
    return c.render()

def P07_2():   # pronomes: a etiqueta de identificacao em que, no lugar do nome, esta escrito EU
    c = Cena(-16, 50)
    M = transf(math.radians(-8))
    W, D, R = 1.35, .95, .14
    pts = []
    for cx, cy, a0 in ((W - R, D - R, 0), (-W + R, D - R, 90), (-W + R, -D + R, 180), (W - R, -D + R, 270)):
        for t in np.linspace(a0, a0 + 90, 6): pts.append((cx + R * math.cos(math.radians(t)), cy + R * math.sin(math.radians(t))))
    o = c.add(Obj())
    extrusao(o, pts, 0, .02, '#ffffff', '#dcdcd6', M=M, amb=.85)
    def det(cam):
        out = []; z = .021
        topo = [(x, y) for x, y in pts if y > D - .62] 
        faixa = [(x, max(y, D - .6)) for x, y in pts if y >= D - .6 - 1e-9]
        faixa = [p for p in pts if p[1] > 0] 
        q = [(W, D - .6), (W, D - R)] + [p for p in pts if p[1] > D - R - 1e-6] + [(-W, D - R), (-W, D - .6)]
        out.append((0, poli(cam, [M(x, y, z) for x, y in q], '#d62f2f')))
        out.append((0, texto_no_plano(cam, 'OLÁ', M, 0, D - .32, z + .001, .3, '#ffffff', SANS_B)))
        out.append((0, poli(cam, [M(-W, -D + .08, z), M(W, -D + .08, z), M(W, -D + .2, z), M(-W, -D + .2, z)], '#d62f2f')))
        d = texto_path('EU', lambda u, v: cam.P(*M(-.05 + u + v * .12, -.3 + v, z + .001)), .62, '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf')
        out.append((0, f'<path d="{d}" fill="#1d2a52"/>'))
        return out
    det.ordem = 3; o.cru.append((det, []))
    # caneta marcador destampada ao lado
    k = c.add(Obj()); k.prof = -1e6
    p0 = np.array([1.15, -1.25, .11]); dd = unit([-.5, 1, 0])
    cilindro_liso(k, p0, dd * 1.25, .11, cor='#1d2a52', brilho=.45, ordem=0)
    cilindro_liso(k, p0 + dd * 1.25, dd * .14, .09, .05, cor='#e8e8e2', brilho=.4, ordem=1)
    return c.render()

def P07_3():   # verbo (tempo, modo, aspecto): a ampulheta, o tempo que passa e a acao em curso
    return servier(SV + 'General_items/Servier/sand-clock.svg', alt=190, sombra=(.8, 7))

def tijolo(c, x0, y0, z0, nx, ny, cor, prof=None, u=.5):
    """bloco de montar: nx x ny pinos; u = passo do pino"""
    o = c.add(Obj())
    if prof is not None: o.prof = prof
    h = .6 * u * 1.2
    caixa_chanfro(o, x0, x0 + nx * u, y0, y0 + ny * u, z0, z0 + h, .02, cor, amb=.42, brilho=.35)
    for i in range(nx):
        for j in range(ny):
            cilindro_liso(o, (x0 + (i + .5) * u, y0 + (j + .5) * u, z0 + h), (0, 0, .1 * u * 2), .3 * u, cor=cor, brilho=.45, amb=.42, ordem=3)
    return o

def peca_quebra_cabeca(w, h, knob_dir, socket_esq, r=.21, n=14):
    """contorno de uma peca de quebra-cabeca (anti-horario): pino na direita e/ou encaixe na esquerda"""
    P = [(0, 0), (w, 0)]
    if knob_dir:
        P.append((w, h / 2 - .1)); cx = w + .16
        for a in np.linspace(math.radians(212), math.radians(508), n): P.append((cx + r * math.cos(a), h / 2 + r * math.sin(a)))
        P.append((w, h / 2 + .1))
    P += [(w, h), (0, h)]
    if socket_esq:
        P.append((0, h / 2 + .1)); cx = .16
        for a in np.linspace(math.radians(148), math.radians(-148), n): P.append((cx + r * math.cos(a), h / 2 + r * math.sin(a)))
        P.append((0, h / 2 - .1))
    return P

def P07_4():   # formacao de palavras (derivacao, composicao, afixo): pecas de quebra-cabeca prefixo + radical + sufixo
    # (correcao da revisao de 29/10: blocos com pinos 2x2 e 2x3 em vermelho, azul e amarelo lembravam a LEGO; agora sao
    #  tres pecas de quebra-cabeca de madeira pintada que se encaixam: des + leal + dade = deslealdade)
    c = Cena(-18, 64)
    w, h, e = 1.3, 1.5, .22
    pecas = [('des', '#3f8f86', False, True, -1.95 - .03, 0), ('leal', '#c9853a', True, True, -.65, 0), ('dade', '#8d5a9e', True, False, .65 + .3, .22)]
    for i, (txt, cor, sock, knob, x0, dy) in enumerate(pecas):
        P = [(x0 + x, y - h / 2 + dy) for x, y in peca_quebra_cabeca(w, h, knob, sock)]
        o = c.add(Obj()); o.prof = 10 - i
        z0 = .3 if i == 2 else 0   # a ultima peca chegando para encaixar
        extrusao(o, P, z0, z0 + e, cor, mix(cor, '#000000', .3), contorno=mix(cor, '#000000', .45), sw=.6, amb=.5, brilho=.15)
        def rot(cam, txt=txt, cx=x0 + w / 2, cy=dy, z0=z0):
            return [(0, texto_no_plano(cam, txt, lambda *p: p, cx, cy, z0 + e + .002, .4, '#ffffff', SANS_B))]
        rot.ordem = 9; o.cru.append((rot, []))
    return c.render()

# ======================================================================== P08 Periodo simples (modulo: caderno e lapis)
def gota(x, y, s, gid='gt'):
    return (f'<path d="M{fmt(x)} {fmt(y-9*s)} C{fmt(x+1.5*s)} {fmt(y-4*s)} {fmt(x+4*s)} {fmt(y-1*s)} {fmt(x+4*s)} {fmt(y+2*s)} A{fmt(4*s)} {fmt(4*s)} 0 0 1 {fmt(x-4*s)} {fmt(y+2*s)} C{fmt(x-4*s)} {fmt(y-1*s)} {fmt(x-1.5*s)} {fmt(y-4*s)} {fmt(x)} {fmt(y-9*s)}Z" fill="url(#{gid})" stroke="#3a7fbf" stroke-width=".5"/>'
            f'<ellipse cx="{fmt(x-1.4*s)}" cy="{fmt(y+.5*s)}" rx="{fmt(.9*s)}" ry="{fmt(1.6*s)}" fill="#fff" opacity=".8"/>')

def P08_1():   # sujeito e predicado (e a oracao sem sujeito: "Chove."): o guarda-chuva aberto na chuva
    c = Cena(-24, 26)
    o = c.add(Obj())
    nP = 8; Rr = 1.25; topo = 1.95
    zr = lambda r: topo - .55 * (r / Rr) ** 1.5
    cores = ['#1f4e8c', '#2a62a8']
    for k in range(nP):
        a0 = 2 * math.pi * k / nP; a1 = 2 * math.pi * (k + 1) / nP
        rs = np.linspace(0, Rr, 5)
        for i in range(4):
            r0, r1 = rs[i], rs[i + 1]
            # a borda entre varetas cede um pouco (gomo)
            def pnt(r, a, borda=False):
                cede = .06 * (r / Rr) * math.sin(math.pi * ((a - a0) / (a1 - a0)))
                return (r * math.cos(a) * (1 - .03 * math.sin(math.pi * (a - a0) / (a1 - a0))), r * math.sin(a), zr(r) - cede)
            am = (a0 + a1) / 2
            for (b0, b1) in ((a0, am), (am, a1)):
                q = [pnt(r0, b0), pnt(r1, b0), pnt(r1, b1), pnt(r0, b1)] if r0 > 0 else [(0, 0, topo), pnt(r1, b0), pnt(r1, b1)]
                o.face(q, cores[k % 2], amb=.4, brilho=.25)
    cilindro_liso(o, (0, 0, topo), (0, 0, .18), .035, .02, cor='#2b2b2e', ordem=4)
    haste = c.add(Obj()); haste.prof = 1e6
    cilindro_liso(haste, (0, 0, .35), (0, 0, topo - .4), .03, cor='#9aa2ad', brilho=.6, ordem=0)
    def cabo(cam):
        pts = [(0, 0, .4)] + [(.16 - .16 * math.cos(t), 0, .4 - .16 * math.sin(t) * 1.1) for t in np.linspace(0, math.pi, 14)]
        pts = [(0, 0, .55), (0, 0, .4)] + [(.17 - .17 * math.cos(t), -.0, .4 - .17 * math.sin(t)) for t in np.linspace(0, math.pi, 16)]
        return [(0, tubo_liso(cam, pts, .055 * cam.k, '#5b2f18'))]
    haste.cru.append((cabo, [(0, 0, .2), (.34, 0, .4)]))
    def chuva(cam):
        g = '<linearGradient id="gt" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#d6efff"/><stop offset="1" stop-color="#5aa6e6"/></linearGradient>'
        out = g
        for (x, y, z, s) in ((-1.55, .2, 2.6, .9), (-.6, -.3, 2.75, .8), (.5, -.4, 2.7, 1.0), (1.45, .1, 2.45, .85), (-1.6, -.3, 1.05, .75), (1.6, -.3, .9, .8), (-.1, -.2, 2.95, .7)):
            px, py = cam.P(x, y, z); out += gota(px, py, s * 1.3)
        return [(0, out)]
    chuva.ordem = 9
    ch = c.add(Obj(sombra=False)); ch.prof = -1e6; ch.cru.append((chuva, [(-1.6, 0, 3.0), (1.6, 0, .8)]))
    return c.render()

def P08_2():   # objeto direto e indireto, complementos: o presente (dar algo a alguem), com laco e etiqueta
    c = Cena(-26, 30)
    o = c.add(Obj())
    W, H = .85, 1.1
    caixa_chanfro(o, -W, W, -W, W, 0, H, .02, '#2f8f6b', amb=.42, brilho=.2)
    caixa_chanfro(o, -W - .04, W + .04, -W - .04, W + .04, H - .25, H + .02, .02, '#2a805f', amb=.42, brilho=.2)
    fita = '#d62f3a'
    def fitas(cam):
        out = []; e = .1
        for (nrm, q) in (((0, -1, 0), [(-e, -W - .045, 0), (e, -W - .045, 0), (e, -W - .045, H + .02), (-e, -W - .045, H + .02)]),
                         ((1, 0, 0), [(W + .045, -e, 0), (W + .045, e, 0), (W + .045, e, H + .02), (W + .045, -e, H + .02)]),
                         ((0, 0, 1), [(-e, -W - .045, H + .021), (e, -W - .045, H + .021), (e, W + .045, H + .021), (-e, W + .045, H + .021)]),
                         ((0, 0, 1), [(-W - .045, -e, H + .022), (W + .045, -e, H + .022), (W + .045, e, H + .022), (-W - .045, e, H + .022)])):
            if visivel(cam, nrm): out.append((0, poli(cam, q, tom(fita, nrm, .4, .3))))
        return out
    fitas.ordem = 3; o.cru.append((fitas, []))
    def laco(cam):
        cx, cy = cam.P(0, 0, H + .03); r = .26 * cam.k
        g = '<radialGradient id="lc" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#ff7a82"/><stop offset=".6" stop-color="#d62f3a"/><stop offset="1" stop-color="#7e1720"/></radialGradient>'
        s_ = g
        for ang in (-25, 205):
            s_ += f'<ellipse cx="{fmt(cx + r*.9*math.cos(math.radians(ang)))}" cy="{fmt(cy - r*.55 + r*.9*math.sin(math.radians(ang))*.5)}" rx="{fmt(r)}" ry="{fmt(r*.55)}" fill="url(#lc)" stroke="#7e1720" stroke-width=".8" transform="rotate({ang + (20 if ang < 90 else -20)} {fmt(cx + r*.9*math.cos(math.radians(ang)))} {fmt(cy - r*.55 + r*.9*math.sin(math.radians(ang))*.5)})"/>'
        for dx in (-1, 1):
            s_ += f'<path d="M{fmt(cx)} {fmt(cy-r*.3)} L{fmt(cx + dx*r*.9)} {fmt(cy + r*.9)} L{fmt(cx + dx*r*.55)} {fmt(cy + r*.75)} L{fmt(cx + dx*r*.4)} {fmt(cy + r*1.0)}Z" fill="#b8232d" stroke="#7e1720" stroke-width=".7"/>'
        s_ += f'<ellipse cx="{fmt(cx)}" cy="{fmt(cy - r*.35)}" rx="{fmt(r*.32)}" ry="{fmt(r*.26)}" fill="url(#lc)" stroke="#7e1720" stroke-width=".8"/>'
        return [(0, s_)]
    laco.ordem = 5; o.cru.append((laco, [(0, 0, H + .5)]))
    # etiqueta pendurada no laco
    def etiqueta(cam):
        p = [(W + .05, -.45, .75), (W + .05, -.05, .75), (W + .05, -.05, .45), (W + .05, -.45, .45)]
        out = poli(cam, p, '#f3e6c4', ' stroke="#a8946c" stroke-width=".6"')
        a = cam.P(W + .05, -.12, .7); b = cam.P(W + .05, .1, H + .02)
        out += f'<path d="M{fmt(a[0])} {fmt(a[1])} Q{fmt(a[0]+6)} {fmt(a[1]-18)} {fmt(b[0])} {fmt(b[1])}" stroke="#7a5a3a" stroke-width=".8" fill="none"/>'
        out += lin(cam, (W + .051, -.4, .63), (W + .051, -.12, .63), '#7a5a3a', 1.0) + lin(cam, (W + .051, -.4, .55), (W + .051, -.2, .55), '#7a5a3a', 1.0)
        return [(0, out)]
    etiqueta.ordem = 6; o.cru.append((etiqueta, []))
    return c.render()

def P08_3():   # adjuntos, aposto e vocativo: o bilhete preso a folha com um clipe (o termo que se junta para acrescentar)
    c = Cena(-20, 48)
    M = transf(math.radians(-6))
    W, D = 1.0, 1.35
    f = c.add(Obj()); solido_convexo(f, [M(x, y, z) for x in (-W, W) for y in (-D, D) for z in (0, .02)], '#fbfaf5', amb=.85)
    def txt(cam):
        out = []; rng = np.random.default_rng(12)
        for k in range(10):
            out += palavras(cam, M, -W + .15, W - .2, D - .35 - k * .24, .021, '#8a8f99', 1.8, rng)
        return out
    txt.ordem = 3; f.cru.append((txt, []))
    Mb = transf(math.radians(12), (.35, .55, .022))
    b = c.add(Obj(sombra=False)); b.prof = -1e5
    solido_convexo(b, [Mb(x, y, z) for x in (-.62, .62) for y in (-.5, .5) for z in (0, .012)], '#ffe27a', amb=.8)
    def nota(cam):
        out = []; rng = np.random.default_rng(3)
        for k in range(3):
            y = .3 - k * .2
            pts = [cam.P(*Mb(x, y + .03 * math.sin(x * 25 + k), .013)) for x in np.linspace(-.48, .4 - (.25 if k == 2 else 0), 30)]
            out.append((0, f'<polyline points="{" ".join(fmt(a)+","+fmt(b_) for a, b_ in pts)}" fill="none" stroke="#2a3550" stroke-width=".9"/>'))
        return out
    nota.ordem = 3; b.cru.append((nota, []))
    clip = c.add(Obj(sombra=False)); clip.prof = -1e6
    def clipe(cam):
        # clipe classico: tres voltas de arame, preso na borda de cima do bilhete
        Mc = transf(math.radians(12 + 90), (.05, .92, .045))
        L1, L2, L3, r1, r2, r3 = .62, .5, .38, .13, .095, .06
        pts = []
        pts += [(-L3, r3 - .0)] 
        pts = [(0.0, -r2), (L1 - r1, -r2)]
        def arco(cx, cy, r, a0, a1):
            return [(cx + r * math.cos(t), cy + r * math.sin(t)) for t in np.linspace(math.radians(a0), math.radians(a1), 10)]
        caminho_ = [(-.25, r3 - .015)] + [(.3, r3 - .015)] + arco(.3, 0, r3 - .015, 90, 270) + [(-.4, -(r3 - .015))] + arco(-.4, -(r3 - .015) + r2, r2, 270, 90)[::-1][::-1]
        caminho_ = ([(.05, .0)] + [(.42, .0)] + arco(.42, .06, .06, -90, 90) + [(-.38, .12)] + arco(-.38, .03, .09, 90, 270) + [(.52, -.06)] + arco(.52, .03, .09, -90, 90) + [(-.18, .12)])
        P3 = [Mc(1.45 * x - .1, 1.45 * y, 0) for x, y in caminho_]
        return [(0, tubo_liso(cam, P3, .024 * cam.k, '#b9c0c9'))]
    clip.cru.append((clipe, [Mc_ for Mc_ in [(.6, 1.6, .05), (-.6, .4, .05)]]))
    return c.render()

def P08_4():   # transitividade verbal: o pendulo de Newton (a acao do verbo transita ate o complemento)
    c = Cena(-26, 18)
    base = c.add(Obj()); base.prof = 1e6
    caixa_chanfro(base, -1.4, 1.4, -.7, .7, 0, .16, .04, '#26282d', amb=.45, brilho=.35)
    aco = '#c3cad3'
    Hf = 1.75
    fr = c.add(Obj(sombra=True)); fr.prof = 5e5
    def armacao(cam):
        out = []
        for y in (-.55, .55):
            pts = [(-1.25, y, .16), (-1.25, y, Hf - .1)] + [(-1.25 + .1 - .1 * math.cos(t), y, Hf - .1 + .1 * math.sin(t)) for t in np.linspace(0, math.pi / 2, 5)][1:] + [(1.15, y, Hf)] + [(1.15 + .1 * math.sin(t), y, Hf - .1 + .1 * math.cos(t)) for t in np.linspace(0, math.pi / 2, 5)][1:] + [(1.25, y, .16)]
            out.append((-y * 10, tubo_liso(cam, pts, .035 * cam.k, aco)))
        return out
    fr.cru.append((armacao, [(-1.25, -.55, Hf), (1.25, .55, Hf)]))
    r = .21; zb = .62
    xs = [-.84, -.42, 0, .42, .84]
    for i, x in enumerate(xs):
        o = c.add(Obj()); o.prof = -1e5 - i
        if i == 0:
            ang = math.radians(38); L = Hf - zb
            cx, cz = x - L * math.sin(ang), Hf - L * math.cos(ang)
        else:
            cx, cz = x, zb
        o.esfera((cx, 0, cz), r, '#b9c0c9')
        def fios(cam, cx=cx, cz=cz):
            return [(1, lin(cam, (cx, 0, cz + r * .9), (cx + (Hf - cz) * 0 + (x - cx) * 0, -.55, Hf), '#55585f', .5) + lin(cam, (cx, 0, cz + r * .9), (cx, .55, Hf), '#55585f', .5))]
        def fios2(cam, cx=cx, cz=cz, x=x):
            return [(1, lin(cam, (cx, 0, cz + r * .9), (x, -.55, Hf), '#55585f', .55) + lin(cam, (cx, 0, cz + r * .9), (x, .55, Hf), '#55585f', .55))]
        fios2.ordem = -1; o.cru.append((fios2, []))
    return c.render()

# ======================================================================== P09 Periodo composto (modulo: trem de vagoes)
def boneco_papel():
    """contorno de um boneco recortado em papel (u de -.4 a .4, z de 0 a 1.4); maos nas bordas para emendar no vizinho"""
    dir_ = []
    for t in np.linspace(90, -55, 12):
        dir_.append((.17 * math.cos(math.radians(t)), 1.2 + .17 * math.sin(math.radians(t))))
    dir_ += [(.07, .99), (.17, .94), (.4, .88), (.4, .76), (.18, .76), (.16, .55), (.27, .3), (.13, .3), (.13, 0), (.04, 0), (.04, .3), (0, .3)]
    esq = [(-x, z) for x, z in dir_[::-1]][:-1]
    return dir_ + esq[1:]

def P09_1():   # coordenacao: a fileira de bonecos de papel de maos dadas (iguais, lado a lado, ligados)
    c = Cena(-20, 16)
    n = 5; passo = .8; prof_ = .22
    P = [np.array([-n * passo / 2 + i * passo * .92, (prof_ if i % 2 else -prof_), 0]) for i in range(n + 1)]
    forma = boneco_papel()
    for i in range(n):
        a, b = P[i], P[i + 1]
        d = b - a
        pts = [tuple(a + (u + .4) / .8 * d + np.array([0, 0, z])) for u, z in forma]
        o = c.add(Obj()); o.prof = -a[0] * 10 + (0 if i % 2 else 1)
        o.face(pts[::-1] if i % 2 else pts, '#7fb8e6', amb=.6, dupla=True, contorno='#3f78a8', sw=.5)
    return c.render()

def matrioska(cx, cy, s, gid, cor='#c62828'):
    """boneca russa em 2D com volume: corpo, rosto, lenco e flor na barriga; (cx, cy) = base"""
    h = 120 * s; w = 70 * s
    g = (f'<radialGradient id="{gid}" cx=".35" cy=".3" r=".85"><stop offset="0" stop-color="{mix(cor, "#ffffff", .45)}"/><stop offset=".5" stop-color="{cor}"/><stop offset="1" stop-color="{mix(cor, "#000000", .5)}"/></radialGradient>'
         f'<radialGradient id="{gid}r" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#fff6ea"/><stop offset="1" stop-color="#e9c9a8"/></radialGradient>')
    x0 = cx; yb = cy
    corpo = (f'M{fmt(x0 - w*.42)} {fmt(yb)} C{fmt(x0 - w*.6)} {fmt(yb - h*.35)} {fmt(x0 - w*.5)} {fmt(yb - h*.55)} {fmt(x0 - w*.32)} {fmt(yb - h*.66)} '
             f'C{fmt(x0 - w*.42)} {fmt(yb - h*.8)} {fmt(x0 - w*.3)} {fmt(yb - h)} {fmt(x0)} {fmt(yb - h)} C{fmt(x0 + w*.3)} {fmt(yb - h)} {fmt(x0 + w*.42)} {fmt(yb - h*.8)} {fmt(x0 + w*.32)} {fmt(yb - h*.66)} '
             f'C{fmt(x0 + w*.5)} {fmt(yb - h*.55)} {fmt(x0 + w*.6)} {fmt(yb - h*.35)} {fmt(x0 + w*.42)} {fmt(yb)}Z')
    out = f'<path d="{corpo}" fill="url(#{gid})" stroke="{mix(cor, "#000000", .55)}" stroke-width="{fmt(.9*s+.3)}"/>'
    fy = yb - h * .76
    out += f'<ellipse cx="{fmt(x0)}" cy="{fmt(fy)}" rx="{fmt(w*.24)}" ry="{fmt(h*.12)}" fill="url(#{gid}r)" stroke="#8a5a3a" stroke-width="{fmt(.5*s+.2)}"/>'
    out += f'<path d="M{fmt(x0 - w*.24)} {fmt(fy - h*.06)} C{fmt(x0 - w*.1)} {fmt(fy - h*.12)} {fmt(x0 + w*.1)} {fmt(fy - h*.12)} {fmt(x0 + w*.24)} {fmt(fy - h*.06)}" stroke="#5a2a10" stroke-width="{fmt(3*s)}" fill="none"/>'
    for dx in (-1, 1):
        out += f'<circle cx="{fmt(x0 + dx*w*.09)}" cy="{fmt(fy - h*.01)}" r="{fmt(1.6*s)}" fill="#2a1a10"/>'
        out += f'<circle cx="{fmt(x0 + dx*w*.15)}" cy="{fmt(fy + h*.05)}" r="{fmt(3*s)}" fill="#f08080" opacity=".7"/>'
    out += f'<path d="M{fmt(x0 - w*.05)} {fmt(fy + h*.06)} Q{fmt(x0)} {fmt(fy + h*.08)} {fmt(x0 + w*.05)} {fmt(fy + h*.06)}" stroke="#b03030" stroke-width="{fmt(1.4*s)}" fill="none"/>'
    # avental claro com flor
    ay = yb - h * .3
    out += f'<ellipse cx="{fmt(x0)}" cy="{fmt(ay)}" rx="{fmt(w*.3)}" ry="{fmt(h*.25)}" fill="#fbf3dd" stroke="{mix(cor, "#000000", .4)}" stroke-width="{fmt(.6*s+.2)}"/>'
    for k in range(5):
        a = math.radians(k * 72 - 90)
        out += f'<circle cx="{fmt(x0 + w*.1*math.cos(a))}" cy="{fmt(ay + w*.1*math.sin(a))}" r="{fmt(w*.075)}" fill="#e2493b"/>'
    out += f'<circle cx="{fmt(x0)}" cy="{fmt(ay)}" r="{fmt(w*.06)}" fill="#f4c430"/>'
    out += f'<path d="M{fmt(x0)} {fmt(ay + w*.14)} L{fmt(x0)} {fmt(ay + h*.2)}" stroke="#3f8a3c" stroke-width="{fmt(1.6*s)}"/>'
    out += f'<path d="M{fmt(x0 - w*.4)} {fmt(yb - h*.5)} C{fmt(x0 - w*.1)} {fmt(yb - h*.47)} {fmt(x0 + w*.1)} {fmt(yb - h*.47)} {fmt(x0 + w*.4)} {fmt(yb - h*.5)}" stroke="{mix(cor, "#000000", .45)}" stroke-width="{fmt(.7*s+.2)}" fill="none" opacity=".8"/>'
    out += f'<ellipse cx="{fmt(x0 - w*.2)}" cy="{fmt(yb - h*.86)}" rx="{fmt(w*.08)}" ry="{fmt(h*.05)}" fill="#fff" opacity=".45"/>'
    return g, out

def P09_2():   # oracoes subordinadas substantivas: as bonecas russas, uma oracao dentro da outra
    defs = ''; corpo = sombra_chao(102, 176, 84, 6, op=.2)
    for (cx, s, cor, gid) in ((150, .55, '#2e6db4', 'mq'), (112, .75, '#e0a21b', 'mm'), (62, 1.0, '#c62828', 'mg')):
        g, o = matrioska(cx, 176, s, gid, cor); defs += g; corpo += o
    return '<defs>' + defs + '</defs>' + corpo

def P09_3():   # subordinadas adjetivas (restritiva x explicativa): a peneira que deixa passar so uma parte
    c = Cena(-22, 46)
    R = 1.0
    o = c.add(Obj())
    cilindro_liso(o, (0, 0, .25), (0, 0, .28), R, R * 1.04, cor='#c9cfd8', brilho=.6, amb=.4, ordem=0, tampa_cor='#e6e9ee')
    def tela(cam):
        out = []; z = .53
        cx, cy = cam.P(0, 0, z)
        aro = [cam.P(*p) for p in circ3((0, 0, z), (1, 0, 0), (0, 1, 0), R * 1.0, 60)]
        out.append(f'<clipPath id="pc"><path d="{caminho(aro)}"/></clipPath>')
        fundo = [cam.P(*p) for p in circ3((0, 0, .22), (1, 0, 0), (0, 1, 0), R * .9, 60)]
        out.append(f'<path d="{caminho(aro)}" fill="#c3cad3"/>')
        out.append(f'<path d="{caminho(fundo)}" fill="#a9b2bd"/>')
        g = '<g clip-path="url(#pc)">'
        for k in np.linspace(-R, R, 23):
            a, b = cam.P(k, -R, .3), cam.P(k, R, .3); g += f'<line x1="{fmt(a[0])}" y1="{fmt(a[1])}" x2="{fmt(b[0])}" y2="{fmt(b[1])}" stroke="#6f7984" stroke-width=".45"/>'
            a, b = cam.P(-R, k, .3), cam.P(R, k, .3); g += f'<line x1="{fmt(a[0])}" y1="{fmt(a[1])}" x2="{fmt(b[0])}" y2="{fmt(b[1])}" stroke="#6f7984" stroke-width=".45"/>'
        g += '</g>'
        out.append(g)
        # graos retidos na tela (os maiores ficam; o fino passa)
        rng = np.random.default_rng(6)
        for _ in range(12):
            r = rng.uniform(0, .55); a = rng.uniform(0, 2 * math.pi)
            x, y = cam.P(r * math.cos(a), r * math.sin(a), .34)
            out.append(f'<ellipse cx="{fmt(x)}" cy="{fmt(y)}" rx="3.2" ry="2.2" fill="#8a5a2b" stroke="#4e2f12" stroke-width=".5" transform="rotate({rng.integers(-40, 40)} {fmt(x)} {fmt(y)})"/><ellipse cx="{fmt(x-1)}" cy="{fmt(y-.8)}" rx="1.1" ry=".6" fill="#fff" opacity=".5"/>')
        return [(0, ''.join(out))]
    tela.ordem = 3; o.cru.append((tela, []))
    cab = c.add(Obj()); cab.prof = -1e6
    cilindro_liso(cab, (R * .98, -R * .35, .45), (1.25, -.45, .1), .06, cor='#2b2d33', brilho=.4, ordem=0)
    # po fino que passou, no prato de baixo
    p = c.add(Obj(sombra=False)); p.prof = 2e6
    def po(cam):
        pts = [cam.P(*q) for q in circ3((.1, .1, 0), (1, 0, 0), (0, 1, 0), 1.25, 50)]
        return [(0, f'<radialGradient id="pog" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#f3ead6"/><stop offset=".8" stop-color="#eadfc4" stop-opacity=".8"/><stop offset="1" stop-color="#eadfc4" stop-opacity="0"/></radialGradient><path d="{caminho(pts)}" fill="url(#pog)"/>')]
    p.cru.append((po, [(-1.2, -1.2, 0), (1.3, 1.3, 0)]))
    return c.render()

def P09_4():   # subordinadas adverbiais (tempo, condicao, causa...): o semaforo, a circunstancia que rege a acao
    return servier(SV + 'General_items/Servier/traffic-light-green.svg', alt=190, sombra=(.9, 6))

def P09_5():   # oracoes reduzidas: a luneta recolhida (a mesma peca, numa forma mais curta, sem o conectivo)
    c = Cena(-24, 26)
    eixo = unit([1, -.32, .0])
    secoes = [(.0, .9, .3, '#b88a2c'), (.9, .55, .25, '#c99c3a'), (1.45, .45, .2, '#d6ad4c'), (1.9, .3, .16, '#c99c3a')]
    o = c.add(Obj())
    b0 = -eixo * 1.1
    for k, (t, L, r, cor) in enumerate(secoes):
        p0 = b0 + eixo * t + np.array([0, 0, .32])
        cilindro_liso(o, p0, eixo * L, r, cor=cor, brilho=.6, amb=.38, ordem=k, tampa_cor=mix(cor, '#000000', .2))
        cilindro_liso(o, p0 + eixo * (L - .06), eixo * .06, r * 1.06, cor=mix(cor, '#ffffff', .1), brilho=.7, ordem=k + .5)
    cilindro_liso(o, b0 + np.array([0, 0, .32]) - eixo * .08, eixo * .08, .33, .3, cor='#7a5418', brilho=.5, ordem=-1, tampa_cor='#26313f')
    def couro(cam):
        p0 = b0 + eixo * .15 + np.array([0, 0, .32]); out = []
        u = np.array([0, 0, 1.0]); v = unit(np.cross(eixo, u))
        for a in np.linspace(-1.2, 1.4, 14):
            nrm = math.cos(a) * u + math.sin(a) * v
            if not visivel(cam, nrm): continue
            q0 = p0 + nrm * .305; q1 = p0 + eixo * .6 + nrm * .305
            out.append((0, lin(cam, q0, q1, '#5b3512', 1.5, op=.5)))
        return out
    couro.ordem = 0.5; o.cru.append((couro, []))
    return c.render()

# ======================================================================== P10 Norma e emprego (modulo: folha corrigida)
def P10_1():   # concordancia verbal e nominal: o cadeado e a sua chave, as partes que tem de combinar
    out = sombra_chao(104, 192, 74, 7)
    g, _ = coloca(SV + 'General_items/Servier/padlock-closed.svg', 30, 192 - 160 * 292.082 / 190.602 * 0 - 160, alt=160)
    out += g
    k, _ = coloca(SV + 'General_items/Servier/key.svg', 128, 76, alt=118, rot=28)
    return out + k

def P10_2():   # regencia verbal e nominal, e crase: a batuta do maestro sobre a partitura (reger)
    # (correcao da revisao de 29/10: partitura cinza-clara e batuta fina, ilegiveis a 64 px; agora o enquadramento e mais
    #  fechado, a pauta e as notas sao maiores e pretas e a batuta e mais grossa, com cabo de cortica)
    c = Cena(-20, 52)
    M = transf(math.radians(-8))
    W, D = .95, 1.1
    f = c.add(Obj()); solido_convexo(f, [M(x, y, z) for x in (-W, W) for y in (-D, D) for z in (0, .02)], '#fffdf6', amb=.85)
    def pauta(cam):
        out = []; z = .021; rng = np.random.default_rng(9)
        for sI in range(3):
            y0 = D - .28 - sI * .72
            for k in range(5):
                out.append((0, lin(cam, M(-W + .1, y0 - k * .09, z), M(W - .1, y0 - k * .09, z), '#1d1f24', .9, cap='butt')))
            out.append((0, lin(cam, M(-W + .1, y0, z), M(-W + .1, y0 - .36, z), '#1d1f24', 1.4, cap='butt')))
            out.append((0, lin(cam, M(W - .1, y0, z), M(W - .1, y0 - .36, z), '#1d1f24', 1.4, cap='butt')))
            x = -W + .3
            while x < W - .22:
                k = rng.integers(0, 8); yy = y0 - k * .045
                hx_, hy_ = cam.P(*M(x, yy, z))
                out.append((0, f'<ellipse cx="{fmt(hx_)}" cy="{fmt(hy_)}" rx="{fmt(.058 * cam.k)}" ry="{fmt(.04 * cam.k)}" fill="#111316" transform="rotate(-18 {fmt(hx_)} {fmt(hy_)})"/>'))
                out.append((0, lin(cam, M(x + .052, yy, z), M(x + .052, yy + .27, z), '#111316', 1.2, cap='butt')))
                x += rng.uniform(.2, .3)
        return out
    pauta.ordem = 3; f.cru.append((pauta, []))
    o = c.add(Obj()); o.prof = -1e6
    p0 = np.array([.85, -1.15, .14]); d = unit([-.6, 1, .0])
    cilindro_liso(o, p0, d * .5, .15, .1, cor='#a8743f', brilho=.35, amb=.4, ordem=0)
    o.esfera(tuple(p0 - d * .05), .155, '#8f5f33')
    cilindro_liso(o, p0 + d * .5, d * 1.9, .06, .025, cor='#fbfaf4', brilho=.5, amb=.6, ordem=1, contorno='#6b6455')
    return c.render()

def peao(c, x, y, z0, cor, prof=None, s=1.0):
    o = c.add(Obj())
    if prof is not None: o.prof = prof
    perfil = [(0, .36), (.06, .36), (.1, .3), (.16, .26), (.2, .2), (.26, .19), (.62, .12), (.68, .2), (.72, .2)]
    for k, ((z0_, r0), (z1_, r1)) in enumerate(zip(perfil, perfil[1:])):
        cilindro_liso(o, (x, y, z0 + z0_ * s), (0, 0, (z1_ - z0_) * s), r0 * s, r1 * s, cor=cor, brilho=.45, amb=.42, ordem=k)
    o.esfera((x, y, z0 + .86 * s), .17 * s, cor)
    return o

def P10_3():   # colocacao pronominal (proclise, mesoclise, enclise): a peca de xadrez e o lugar exato em que ela vai
    c = Cena(-26, 34)
    t = c.add(Obj()); t.prof = 1e6
    n = 4; q = .52
    caixa_chanfro(t, -n * q / 2 - .08, n * q / 2 + .08, -n * q / 2 - .08, n * q / 2 + .08, 0, .14, .03, '#6b3f1f', amb=.42)
    def casas(cam):
        out = []; z = .141
        for i in range(n):
            for j in range(n):
                x0 = -n * q / 2 + i * q; y0 = -n * q / 2 + j * q
                cor = '#f0dcb4' if (i + j) % 2 else '#9b6a3c'
                out.append((0, poli(cam, [(x0, y0, z), (x0 + q, y0, z), (x0 + q, y0 + q, z), (x0, y0 + q, z)], cor)))
        return out
    casas.ordem = 3; t.cru.append((casas, []))
    peao(c, -.26, .26, .14, '#f3efe6', prof=-1, s=1.05)
    peao(c, .78, -.26, .14, '#2a2b30', prof=-2, s=1.05)
    return c.render()

def P10_4():   # pontuacao: as teclas da virgula, do ponto e virgula, dos dois-pontos e do travessao
    c = Cena(-18, 58)
    sinais = [(',', -1.15, .45), (';', 0, .45), (':', 1.15, .45), ('—', -.58, -.75), ('.', .58, -.75)]
    for ch, x, y in sinais:
        o = c.add(Obj()); o.prof = -(x * .41 - y * .91)
        Lk = .5
        solido_convexo(o, [(x + sx * Lk, y + sy * Lk, 0) for sx in (-1, 1) for sy in (-1, 1)] + [(x + sx * Lk * .78, y + sy * Lk * .78, .38) for sx in (-1, 1) for sy in (-1, 1)], '#f1f1ee', amb=.55, brilho=.3)
        def glifo(cam, ch=ch, x=x, y=y):
            tam = {',': .95, ';': .8, ':': .75, '.': .95, '—': .55}[ch]; dy = {',': .14, '.': .12}.get(ch, .02)
            return [(0, texto_no_plano(cam, ch, lambda *p: p, x - .02, y + dy, .381, tam, '#2a2b30', SANS_B))]
        glifo.ordem = 3; o.cru.append((glifo, []))
    return c.render()

def P10_5():   # vozes verbais e discurso direto e indireto: o microfone (a fala reproduzida ou relatada)
    c = Cena(-22, 20)
    o = c.add(Obj())
    cilindro_liso(o, (0, 0, 0), (0, 0, .1), .62, .58, cor='#2a2b30', brilho=.5, amb=.4, ordem=0)
    cilindro_liso(o, (0, 0, .1), (0, 0, .8), .045, cor='#b9c0c9', brilho=.6, ordem=1)
    cap = c.add(Obj(sombra=True)); cap.prof = -1e6
    zc = 1.45; R = .34; H = .45
    cilindro_liso(cap, (0, 0, zc - H), (0, 0, 2 * H), R, cor='#9aa3ad', brilho=.6, amb=.4, ordem=0, tampa_base=False)
    cap.esfera((0, 0, zc + H), R, '#9aa3ad', reflexo=False, ordem=1)
    cap.esfera((0, 0, zc - H), R, '#9aa3ad', reflexo=False, ordem=-1)
    def grade(cam):
        out = []
        for zz in np.linspace(zc - H - .15, zc + H + .2, 16):
            dz = zz - zc
            r = R if abs(dz) <= H else math.sqrt(max(0, R * R - (abs(dz) - H) ** 2))
            if r < .05: continue
            pts = [(r * 1.01 * math.cos(t), r * 1.01 * math.sin(t), zz) for t in np.linspace(0, 2 * math.pi, 40)]
            vis = [p for p, t in zip(pts, np.linspace(0, 2 * math.pi, 40)) if visivel(cam, (math.cos(t), math.sin(t), 0))]
            P = [cam.P(*p) for p in vis]
            out.append((0, f'<polyline points="{" ".join(fmt(a)+","+fmt(b) for a, b in P)}" fill="none" stroke="#5f6772" stroke-width=".6"/>'))
        for t in np.linspace(-1.2, 1.9, 12):
            if not visivel(cam, (math.cos(t), math.sin(t), 0)): continue
            pts = [(R * 1.01 * math.cos(t), R * 1.01 * math.sin(t), zz) for zz in (zc - H, zc + H)]
            out.append((0, lin(cam, pts[0], pts[1], '#5f6772', .6)))
        a, b = (0, 0, zc - .05), (0, 0, zc + .08)
        out.append((0, poli(cam, [(-R * 1.02, -R * .2, zc - .1), (R * 1.02, -R * .2 - .02, zc - .1), (R * 1.02, -R * .2, zc + .05), (-R * 1.02, -R * .2, zc + .05)], '#2a2b30', ' opacity="0"')))
        return out
    grade.ordem = 3; cap.cru.append((grade, []))
    # garfo que prende a capsula
    def garfo(cam):
        pts = [(-R - .07, 0, zc), (-R - .07, 0, zc - .45), (-R * .6, 0, zc - .7), (0, 0, zc - .75), (R * .6, 0, zc - .7), (R + .07, 0, zc - .45), (R + .07, 0, zc)]
        return [(0, tubo_liso(cam, pts, .03 * cam.k, '#c3cad3'))]
    garfo.ordem = 4; cap.cru.append((garfo, []))
    return c.render()

# ======================================================================== P11 Literatura: do Barroco ao Simbolismo (modulo: pena e tinteiro)
def chama(x, y, s=1.0, gid='ch'):
    g = (f'<radialGradient id="{gid}a" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffd27a" stop-opacity=".55"/><stop offset="1" stop-color="#ffd27a" stop-opacity="0"/></radialGradient>'
         f'<radialGradient id="{gid}b" cx=".5" cy=".75" r=".75"><stop offset="0" stop-color="#ffffff"/><stop offset=".35" stop-color="#fff2a8"/><stop offset=".75" stop-color="#ffb02e"/><stop offset="1" stop-color="#e8621c"/></radialGradient>')
    out = f'<ellipse cx="{fmt(x)}" cy="{fmt(y-12*s)}" rx="{fmt(22*s)}" ry="{fmt(26*s)}" fill="url(#{gid}a)"/>'
    out += f'<path d="M{fmt(x)} {fmt(y-30*s)} C{fmt(x+3*s)} {fmt(y-20*s)} {fmt(x+8*s)} {fmt(y-12*s)} {fmt(x+7*s)} {fmt(y-4*s)} C{fmt(x+6*s)} {fmt(y+2*s)} {fmt(x-6*s)} {fmt(y+2*s)} {fmt(x-7*s)} {fmt(y-4*s)} C{fmt(x-8*s)} {fmt(y-12*s)} {fmt(x-3*s)} {fmt(y-20*s)} {fmt(x)} {fmt(y-30*s)}Z" fill="url(#{gid}b)"/>'
    out += f'<ellipse cx="{fmt(x)}" cy="{fmt(y-3*s)}" rx="{fmt(2.6*s)}" ry="{fmt(4*s)}" fill="#3a6fd8" opacity=".55"/>'
    return g, out

def P11_1():   # Barroco e Arcadismo: a vela que derrete (a vida breve, o "carpe diem"), no castical
    c = Cena(-22, 22)
    o = c.add(Obj())
    lat = '#c9a24a'
    cilindro_liso(o, (0, 0, 0), (0, 0, .08), .95, .92, cor=lat, brilho=.6, amb=.38, ordem=0)
    cilindro_liso(o, (0, 0, .08), (0, 0, .1), .92, .55, cor=lat, brilho=.6, amb=.38, ordem=1)
    cilindro_liso(o, (0, 0, .18), (0, 0, .2), .26, .3, cor=lat, brilho=.6, amb=.38, ordem=2)
    v = c.add(Obj()); v.prof = -1e6
    Hc = 1.35; r = .2
    cilindro_liso(v, (0, 0, .38), (0, 0, Hc), r, cor='#f4ecd8', brilho=.3, amb=.6, ordem=0, tampa_cor='#efe4c8')
    def detalhes(cam):
        out = []
        # escorridos de cera pela lateral visivel
        for (a, comp) in ((-.5, .45), (.2, .7), (.9, .3)):
            nrm = (math.cos(a - math.pi / 2), math.sin(a - math.pi / 2), 0)
            p_top = (r * 1.02 * nrm[0], r * 1.02 * nrm[1], .38 + Hc)
            p_bot = (r * 1.02 * nrm[0], r * 1.02 * nrm[1], .38 + Hc - comp)
            x0, y0 = cam.P(*p_top); x1, y1 = cam.P(*p_bot)
            out.append(f'<path d="M{fmt(x0-2.2)} {fmt(y0)} L{fmt(x1-2.2)} {fmt(y1-2)} A2.3 2.6 0 0 0 {fmt(x1+2.2)} {fmt(y1-2)} L{fmt(x0+2.2)} {fmt(y0)}Z" fill="#f9f3e3" stroke="#d9cdb0" stroke-width=".5"/>')
        # pavio e chama
        a, b = cam.P(0, 0, .38 + Hc), cam.P(.02, 0, .38 + Hc + .09)
        out.append(f'<line x1="{fmt(a[0])}" y1="{fmt(a[1])}" x2="{fmt(b[0])}" y2="{fmt(b[1])}" stroke="#2a2018" stroke-width="1.3"/>')
        g, ch = chama(b[0], b[1] - 1, 1.15)
        out.append('<defs>' + g + '</defs>' + ch)
        return [(0, ''.join(out))]
    detalhes.ordem = 5; v.cru.append((detalhes, [(0, 0, .38 + Hc + .7)]))
    # alca do castical
    def alca(cam):
        pts = [(.88, -.05, .09), (1.15, -.1, .14), (1.3, -.12, .3), (1.22, -.1, .48), (1.05, -.08, .45)]
        return [(0, tubo_liso(cam, pts, .045 * cam.k, lat))]
    alca.ordem = 3; o.cru.append((alca, [(1.3, -.12, .5)]))
    return c.render()

def pena_svg(x0, y0, ang, L, larg, cor, gid):
    """pena de arara/papagaio em 2D: raque central e duas vexilas com gradiente; (x0, y0) = base do calamo.
    As coordenadas ja saem giradas (sem transform), para o enquadramento medir so o desenho."""
    claro = mix(cor, '#ffffff', .35); esc = mix(cor, '#000000', .45)
    ca, sa = math.cos(math.radians(ang)), math.sin(math.radians(ang))
    T = lambda x, y: f'{fmt(x0 + x * ca - y * sa)} {fmt(y0 + x * sa + y * ca)}'
    gx1, gx2 = T(-larg * .5, -L * .5), T(larg * .5, -L * .5)
    g = (f'<linearGradient id="{gid}" gradientUnits="userSpaceOnUse" x1="{gx1.split()[0]}" y1="{gx1.split()[1]}" x2="{gx2.split()[0]}" y2="{gx2.split()[1]}">'
         f'<stop offset="0" stop-color="{esc}"/><stop offset=".45" stop-color="{claro}"/><stop offset=".55" stop-color="{cor}"/><stop offset="1" stop-color="{esc}"/></linearGradient>')
    vane = (f'M{T(0, 0)} C{T(-larg*.2, -L*.25)} {T(-larg*.55, -L*.55)} {T(-larg*.45, -L*.85)} C{T(-larg*.35, -L*.97)} {T(-larg*.08, -L*1.02)} {T(0, -L)} '
            f'C{T(larg*.08, -L*1.02)} {T(larg*.35, -L*.97)} {T(larg*.45, -L*.85)} C{T(larg*.55, -L*.55)} {T(larg*.2, -L*.25)} {T(0, 0)}Z')
    out = f'<path d="{vane}" fill="url(#{gid})" stroke="{esc}" stroke-width=".6"/>'
    for t in np.linspace(.3, .9, 6):
        out += f'<path d="M{T(0, -L*t)} L{T(-larg*.38, -L*(t+.06))} M{T(0, -L*t)} L{T(larg*.38, -L*(t+.06))}" stroke="{esc}" stroke-width=".45" opacity=".55"/>'
    out += f'<path d="M{T(0, L*.12)} L{T(0, -L*.98)}" stroke="#f3ead2" stroke-width="1.1" stroke-linecap="round"/>'
    return g, out

def P11_2():   # Romantismo (indianismo, mal do seculo, condoreirismo): o cocar de penas, simbolo do indianismo
    defs = ''; corpo = sombra_chao(100, 176, 62, 6, op=.2)
    cores = ['#1e6fd0', '#f2c230', '#d62828', '#1e9e5a', '#d62828', '#f2c230', '#1e6fd0', '#d62828', '#f2c230']
    n = len(cores); cx, cy = 100, 168
    for i, cor in enumerate(cores):
        ang = -46 + 92 * i / (n - 1)
        x = cx + 46 * math.sin(math.radians(ang)); y = cy - 12 - 16 * math.cos(math.radians(ang))
        g, p_ = pena_svg(x, y, ang * .85, 120 if i % 2 == 0 else 106, 24, cor, f"pn{i}")
        defs += g; corpo += p_
    # faixa trancada que prende as penas
    faixa = f'M{cx-70} {cy-8} Q{cx} {cy-44} {cx+70} {cy-8} L{cx+66} {cy+4} Q{cx} {cy-30} {cx-66} {cy+4}Z'
    defs += '<linearGradient id="fx" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c98a3c"/><stop offset="1" stop-color="#7a4a18"/></linearGradient>'
    corpo += f'<path d="{faixa}" fill="url(#fx)" stroke="#5a3410" stroke-width=".8"/>'
    for k in range(13):
        t = k / 12; x = (1 - t) ** 2 * (cx - 68) + 2 * (1 - t) * t * cx + t * t * (cx + 68); y = (1 - t) ** 2 * (cy - 2) + 2 * (1 - t) * t * (cy - 38) + t * t * (cy - 2)
        corpo += f'<path d="M{fmt(x-3)} {fmt(y-3)} l3 3 l3 -3" stroke="#f3e2b8" stroke-width=".9" fill="none"/>'
        if k % 3 == 1: corpo += f'<circle cx="{fmt(x)}" cy="{fmt(y+3)}" r="1.6" fill="#111"/>'
    return '<defs>' + defs + '</defs>' + corpo

def P11_3():   # Realismo e Naturalismo, Machado de Assis: o espelho de mao (o retrato fiel da sociedade; "O espelho")
    g = ('<linearGradient id="ou" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f6dc8a"/><stop offset=".5" stop-color="#c9952e"/><stop offset="1" stop-color="#7a5414"/></linearGradient>'
         '<linearGradient id="vi" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#eef6fb"/><stop offset=".45" stop-color="#a9c3d6"/><stop offset=".55" stop-color="#cfe0ec"/><stop offset="1" stop-color="#7f9db4"/></linearGradient>')
    out = '<defs>' + g + '</defs>' + sombra_chao(108, 186, 66, 6, op=.2)
    gr = '<g transform="rotate(-28 100 100)">'
    gr += '<path d="M92 128 L108 128 L111 184 Q100 192 89 184Z" fill="url(#ou)" stroke="#6b4a10" stroke-width=".9"/>'
    for yy in (140, 156, 172):
        gr += f'<ellipse cx="100" cy="{yy}" rx="10" ry="3" fill="#e6c160" stroke="#6b4a10" stroke-width=".6"/>'
    gr += '<ellipse cx="100" cy="76" rx="50" ry="60" fill="url(#ou)" stroke="#6b4a10" stroke-width="1"/>'
    for k in range(16):
        a = 2 * math.pi * k / 16
        gr += f'<circle cx="{fmt(100 + 46*math.cos(a))}" cy="{fmt(76 + 56*math.sin(a))}" r="3" fill="#f2d27a" stroke="#6b4a10" stroke-width=".5"/>'
    gr += '<ellipse cx="100" cy="76" rx="40" ry="49" fill="url(#vi)" stroke="#6b4a10" stroke-width=".8"/>'
    gr += '<path d="M72 50 L86 40 L74 92 L66 98Z" fill="#fff" opacity=".45"/><path d="M92 36 L98 34 L80 110 L76 108Z" fill="#fff" opacity=".3"/>'
    gr += '</g>'
    return out + gr

def P11_4():   # Parnasianismo e Simbolismo: o vaso grego (a forma perfeita, a arte pela arte)
    c = Cena(-20, 16)
    o = c.add(Obj())
    perfil = [(0, .32), (.06, .34), (.12, .26), (.2, .3), (.45, .62), (.75, .78), (1.05, .74), (1.3, .55), (1.5, .32), (1.62, .24), (1.8, .22), (1.86, .36), (1.94, .36)]
    terra = '#c8642a'
    for k, ((z0, r0), (z1, r1)) in enumerate(zip(perfil, perfil[1:])):
        cilindro_liso(o, (0, 0, z0), (0, 0, z1 - z0), r0, r1, cor=terra if not (.75 <= z0 < 1.3) else '#c8642a', brilho=.35, amb=.4, ordem=k, tampa_cor='#2a1a10')
    def faixa(cam):
        out = []
        # faixa preta (figuras vermelhas): parte visivel do anel entre z=.76 e z=1.06
        angs = np.linspace(0, 2 * math.pi, 90)
        ok = [visivel(cam, (math.cos(t), math.sin(t), 0)) for t in angs]
        k0 = next(i for i in range(90) if not ok[i]); ordem_ = [angs[(k0 + i) % 90] for i in range(90)]
        vis = [t for t in ordem_ if visivel(cam, (math.cos(t), math.sin(t), 0))]
        r1, r2 = .785, .745
        q = [cam.P(r1 * 1.004 * math.cos(t), r1 * 1.004 * math.sin(t), .76) for t in vis] + [cam.P(r2 * 1.004 * math.cos(t), r2 * 1.004 * math.sin(t), 1.06) for t in vis[::-1]]
        out.append((0, f'<path d="{caminho(q)}" fill="#1d1410"/>'))
        # figuras (guerreiros) na cor do barro, reservadas no fundo preto
        for t in np.linspace(-1.0, 1.4, 4):
            if not visivel(cam, (math.cos(t), math.sin(t), 0)): continue
            x0, y0 = cam.P(.79 * math.cos(t), .79 * math.sin(t), .78)
            esc = abs(cam.V(math.cos(t), math.sin(t), 0)[2]) * .9 + .1
            out.append((0, f'<g transform="translate({fmt(x0)} {fmt(y0)}) scale({fmt(esc*1.1)} 1.1)"><path d="M-3 0 L-2 -9 L-4 -14 L-1 -16 L0 -21 A2.6 2.6 0 1 1 1 -21 L2 -16 L6 -13 L2 -9 L3 0Z" fill="#d9783a"/><path d="M5 -20 L5 2" stroke="#d9783a" stroke-width=".9"/></g>'))
        zz = 1.38; rr = .47
        mp = []
        for k, t in enumerate(np.linspace(-1.3, 1.6, 15)):
            if not visivel(cam, (math.cos(t), math.sin(t), 0)): continue
            a = cam.P(rr * math.cos(t), rr * math.sin(t), zz); b = cam.P(rr * math.cos(t), rr * math.sin(t), zz + .08)
            mp.append(f'<path d="M{fmt(a[0])} {fmt(a[1])} L{fmt(b[0])} {fmt(b[1])} L{fmt(b[0]+3)} {fmt(b[1])} L{fmt(b[0]+3)} {fmt(b[1]+3)}" stroke="#1d1410" stroke-width="1" fill="none"/>')
        out.append((0, ''.join(mp)))
        return out
    faixa.ordem = 50; o.cru.append((faixa, []))
    def alcas(cam):
        out = []
        for s_ in (-1, 1):
            pts = [(s_ * .45, 0, 1.4), (s_ * .78, 0, 1.55), (s_ * .82, 0, 1.38), (s_ * .7, 0, 1.15)]
            out.append((s_ * .1, tubo_liso(cam, pts, .045 * cam.k, '#a9501f')))
        return out
    alcas.ordem = 60; o.cru.append((alcas, [(.85, 0, 1.6), (-.85, 0, 1.6)]))
    return c.render()

# ======================================================================== P12 Literatura: Pre-Modernismo em diante (modulo: maquina de escrever)
def P12_1():   # Pre-Modernismo (Euclides, "Os Sertoes"): o mandacaru no chao rachado da caatinga
    c = Cena(-24, 20)
    chao = c.add(Obj()); chao.prof = 1e6
    cilindro_liso(chao, (0, 0, 0), (0, 0, .12), 1.25, 1.2, cor='#c9a06a', brilho=.1, amb=.5, ordem=0, tampa_cor='#d8b27c')
    def rachas(cam):
        rng = np.random.default_rng(21); out = []
        for _ in range(9):
            a = rng.uniform(0, 2 * math.pi); r0 = rng.uniform(.25, .7)
            pts = [(r0 * math.cos(a), r0 * math.sin(a))]
            for k in range(4):
                a += rng.uniform(-.6, .6); r0 += .12
                if r0 > 1.15: break
                pts.append((r0 * math.cos(a), r0 * math.sin(a)))
            P = [cam.P(x, y, .121) for x, y in pts]
            out.append((0, f'<polyline points="{" ".join(fmt(a_)+","+fmt(b_) for a_, b_ in P)}" fill="none" stroke="#8a6234" stroke-width=".9"/>'))
        return out
    rachas.ordem = 3; chao.cru.append((rachas, []))
    verde = '#4f8a4a'
    def coluna(o, base, topo_z, r, ordem=0):
        cilindro_liso(o, base, (0, 0, topo_z - base[2]), r, r * .92, cor=verde, brilho=.25, amb=.4, ordem=ordem, n=40)
        o.esfera((base[0], base[1], topo_z), r * .92, verde, reflexo=False, ordem=ordem + .5)
        def costelas(cam, base=base, topo_z=topo_z, r=r):
            out = []
            for t in np.linspace(0, 2 * math.pi, 9, endpoint=False):
                if not visivel(cam, (math.cos(t), math.sin(t), 0)): continue
                p0 = (base[0] + r * 1.01 * math.cos(t), base[1] + r * 1.01 * math.sin(t), base[2] + .02)
                p1 = (base[0] + r * .93 * math.cos(t), base[1] + r * .93 * math.sin(t), topo_z)
                out.append((0, lin(cam, p0, p1, '#2f5e2c', .9) + lin(cam, (p0[0] - .03, p0[1], p0[2]), (p1[0] - .03, p1[1], p1[2]), '#7fbf6a', .4, op=.6)))
                for zz in np.linspace(base[2] + .2, topo_z - .1, 5):
                    x, y = cam.P(base[0] + r * 1.05 * math.cos(t), base[1] + r * 1.05 * math.sin(t), zz)
                    out.append((0, f'<path d="M{fmt(x)} {fmt(y)} l-1.5 -1 M{fmt(x)} {fmt(y)} l1.5 -1" stroke="#f3ead2" stroke-width=".35"/>'))
            return out
        costelas.ordem = ordem + .7; o.cru.append((costelas, []))
    o = c.add(Obj())
    coluna(o, (0, 0, .12), 2.3, .22, 0)
    for s_, zb, zt, dx in ((-1, .9, 1.8, .55), (1, 1.2, 2.0, .5)):
        def braco(cam, s_=s_, zb=zb, dx=dx):
            pts = [(0, 0, zb), (s_ * dx * .6, 0, zb + .02), (s_ * dx, 0, zb + .22)]
            return [(0, tubo_liso(cam, pts, .19 * cam.k, verde))]
        braco.ordem = 2.5; o.cru.append((braco, []))
        coluna(o, (s_ * dx, 0, zb + .15), zt, .17, 3)
    return c.render()

def P12_2():   # Modernismo de 1922, vanguardas e manifestos: a paleta de pintor com as tintas e o pincel (Semana de Arte Moderna)
    c = Cena(-20, 46)
    pts = []
    for t in np.linspace(0, 2 * math.pi, 60, endpoint=False):
        r = 1.0 + .12 * math.cos(2 * t) - (.35 * math.exp(-((t - 5.5) ** 2) / .08))
        pts.append((1.25 * r * math.cos(t), .95 * r * math.sin(t)))
    furo = [(.55 + .15 * math.cos(t), -.42 + .12 * math.sin(t)) for t in np.linspace(2 * math.pi, 0, 24, endpoint=False)]
    o = c.add(Obj())
    extrusao(o, pts, 0, .07, '#c8935a', '#9a6a38', furos=[furo], amb=.5, brilho=.15)
    def tintas(cam):
        out = []
        for (x, y, cor) in ((-.85, .25, '#d62828'), (-.55, .6, '#f2c230'), (-.05, .7, '#1e9e5a'), (.45, .55, '#1e6fd0'), (.85, .2, '#f5f5f0'), (-.75, -.25, '#7b2fa8'), (-.35, -.6, '#e8761c')):
            X, Y = cam.P(x, y, .071)
            out.append((0, f'<ellipse cx="{fmt(X)}" cy="{fmt(Y)}" rx="7.5" ry="5" fill="{cor}" stroke="{mix(cor, "#000000", .35)}" stroke-width=".6"/>'
                           f'<ellipse cx="{fmt(X-2.2)}" cy="{fmt(Y-1.6)}" rx="2.4" ry="1.3" fill="#fff" opacity=".7"/>'))
        return out
    tintas.ordem = 3; o.cru.append((tintas, []))
    p = c.add(Obj()); p.prof = -1e6
    p0 = np.array([-.4, -1.0, .2]); d = unit([1, .75, .05])
    cilindro_liso(p, p0, d * 1.5, .055, .075, cor='#b5262b', brilho=.5, ordem=0)
    cilindro_liso(p, p0 + d * 1.5, d * .3, .08, .07, cor='#c3cad3', brilho=.7, ordem=1)
    cilindro_liso(p, p0 + d * 1.8, d * .3, .07, .01, cor='#2e2a26', brilho=.2, ordem=2)
    cilindro_liso(p, p0 + d * 2.0, d * .1, .03, .005, cor='#1e6fd0', brilho=.4, ordem=3)
    return c.render()

def P12_3():   # Modernismo de 30 (romance do Nordeste: "Vidas Secas"...): o chapeu de couro do vaqueiro sertanejo
    g = ('<radialGradient id="cc" cx=".38" cy=".3" r=".85"><stop offset="0" stop-color="#d9a066"/><stop offset=".55" stop-color="#9a5a26"/><stop offset="1" stop-color="#4e2a0e"/></radialGradient>'
         '<linearGradient id="ab2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b8763a"/><stop offset="1" stop-color="#5e3412"/></linearGradient>'
         '<linearGradient id="ab3" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c9884a"/><stop offset="1" stop-color="#7a4418"/></linearGradient>')
    out = '<defs>' + g + '</defs>' + sombra_chao(102, 150, 84, 7, op=.22)
    # aba de tras (larga, vista de cima)
    out += '<ellipse cx="100" cy="128" rx="88" ry="26" fill="url(#ab2)" stroke="#3e200a" stroke-width="1"/>'
    # copa
    out += '<path d="M48 126 C44 70 64 44 100 42 C136 44 156 70 152 126 C130 136 70 136 48 126Z" fill="url(#cc)" stroke="#3e200a" stroke-width="1"/>'
    out += '<path d="M52 112 C80 122 120 122 148 112 L150 124 C122 134 78 134 50 124Z" fill="#5a3012" stroke="#3e200a" stroke-width=".7"/>'
    for x in range(58, 146, 8):
        out += f'<path d="M{x} 116 l4 4 l4 -4" stroke="#e8c48a" stroke-width=".8" fill="none"/>'
    # aba da frente levantada (a marca do chapeu de couro), com a estrela costurada
    out += '<path d="M30 122 C40 82 70 66 100 66 C130 66 160 82 170 122 C150 112 128 106 100 106 C72 106 50 112 30 122Z" fill="url(#ab3)" stroke="#3e200a" stroke-width="1"/>'
    out += '<path d="M40 114 C56 94 78 84 100 84 C122 84 144 94 160 114" stroke="#e8c48a" stroke-width=".9" stroke-dasharray="3 2.4" fill="none"/>'
    est = []
    for k in range(10):
        r = 15 if k % 2 == 0 else 6.5; a = math.radians(-90 + k * 36)
        est.append((100 + r * math.cos(a), 92 + r * math.sin(a) * .85))
    out += f'<path d="{caminho(est)}" fill="#f0d8a8" stroke="#6b3a14" stroke-width=".8"/>'
    out += '<ellipse cx="76" cy="58" rx="14" ry="6" fill="#fff" opacity=".18" transform="rotate(-20 76 58)"/>'
    return out

def P12_4():   # Geracao de 45 e prosa de ruptura (Clarice, "O ovo e a galinha"): o ovo com a casca rachada
    out = servier(SV + 'General_items/Servier/egg.svg', alt=176, chao=192, sombra=(.75, 6))
    # rachadura em zigue-zague atravessando a casca, com a borda clara do lado da luz
    pts = [(46, 118), (60, 110), (68, 122), (82, 108), (92, 121), (104, 106), (114, 120), (126, 110), (136, 121), (150, 112)]
    d = 'M' + ' L'.join(f'{x} {y}' for x, y in pts)
    out += f'<path d="{d}" stroke="#6b4a2c" stroke-width="2.2" fill="none" stroke-linejoin="round"/>'
    out += f'<path d="{d}" transform="translate(-.6 -1.4)" stroke="#fff6e8" stroke-width=".9" fill="none" stroke-linejoin="round" opacity=".9"/>'
    out += '<path d="M82 108 L86 98 L90 103" stroke="#6b4a2c" stroke-width="1.3" fill="none"/><path d="M114 120 L119 130" stroke="#6b4a2c" stroke-width="1.3" fill="none"/>'
    return out

def P12_5():   # literatura contemporanea e autores africanos de lingua portuguesa: o globo com o Atlantico entre o Brasil e a Africa
    return servier(SV + 'General_items/Servier/earth.svg', alt=184, chao=190, sombra=(.7, 6))

if __name__ == '__main__':
    import sys
    alvo = sys.argv[1:]
    fns = {k.replace('_', '.'): v for k, v in list(globals().items()) if re.match(r'^P\d\d_\d$', k)} if True else {}
    for k in (alvo or sorted(fns)):
        grava_sub(k, fns[k]())

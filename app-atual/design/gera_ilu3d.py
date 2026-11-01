# -*- coding: utf-8 -*-
"""Ilustracoes 3D das materias geradas a partir de geometria real (mesmo modelo do grafico de Matematica,
aprovado pelo Vitor): projecao com azimute/elevacao, pintura do fundo para a frente, luz difusa.
  qui: cafeina (C8H10N4O2) com coordenadas 3D do RDKit (ETKDG + MMFF), cores CPK
  bio: DNA-B real: 10 pares por volta, 3,4 A entre pares, raio 10 A, sulcos maior/menor (fitas defasadas)
  por: livro aberto modelado como superficie: paginas sobem a partir da lombada, bloco de folhas e capa"""
import math

def hx(c): c = c.lstrip('#'); return tuple(int(c[i:i+2], 16) for i in (0, 2, 4))
def mix(a, b, t): a, b = hx(a), hx(b); t = max(0, min(1, t)); return '#%02x%02x%02x' % tuple(round(a[i] + (b[i] - a[i]) * t) for i in range(3))
SV = '<svg class="ilu" viewBox="0 0 180 140" aria-hidden="true">'

class Cam:
    def __init__(s, az, el, pts, w=156, h=108, cx=90, cy=66):
        s.az, s.el = math.radians(az), math.radians(el)
        v = [s.V(*p) for p in pts]; xs = [a for a, _, _ in v]; us = [b for _, b, _ in v]
        s.k = min(w / (max(xs) - min(xs)), h / (max(us) - min(us)))
        s.ox = cx - s.k * (max(xs) + min(xs)) / 2; s.oy = cy + s.k * (max(us) + min(us)) / 2
    def V(s, x, y, z):   # x direita, y fundo, z cima -> tela x, tela cima, profundidade (maior = mais longe)
        xr = x * math.cos(s.az) - y * math.sin(s.az); yr = x * math.sin(s.az) + y * math.cos(s.az)
        return xr, z * math.cos(s.el) + yr * math.sin(s.el), yr * math.cos(s.el) - z * math.sin(s.el)
    def P(s, x, y, z): a, b, _ = s.V(x, y, z); return s.ox + a * s.k, s.oy - b * s.k
    def D(s, x, y, z): return s.V(x, y, z)[2]

def poly(pts, fill, stroke=None, sw=.4, op=1):
    d = 'M' + ' L'.join('%.2f %.2f' % p for p in pts) + 'Z'
    return f'<path d="{d}" fill="{fill}"' + (f' stroke="{stroke}" stroke-width="{sw}" stroke-linejoin="round"' if stroke else '') + (f' opacity="{op}"' if op != 1 else '') + '/>'

def sombra(cx, cy, rx, ry, op=.4):
    return (f'<radialGradient id="sh@K@"><stop offset="0" stop-color="#000" stop-opacity="{op}"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>',
            f'<ellipse cx="{cx:.1f}" cy="{cy:.1f}" rx="{rx:.1f}" ry="{ry:.1f}" fill="url(#sh@K@)"/>')

def esfera_real(nome, cor):
    # como uma bola de modelo molecular de plastico: brilho especular forte, meio-tom, borda escurecida
    return (f'<radialGradient id="{nome}@K@" cx="34%" cy="30%" r="74%" fx="30%" fy="25%"><stop offset="0" stop-color="#ffffff"/>'
            f'<stop offset=".14" stop-color="{mix(cor, "#ffffff", .55)}"/><stop offset=".45" stop-color="{cor}"/>'
            f'<stop offset=".85" stop-color="{mix(cor, "#000000", .38)}"/><stop offset="1" stop-color="{mix(cor, "#000000", .62)}"/></radialGradient>')
def esfera_grad(nome, cor):
    return (f'<radialGradient id="{nome}@K@" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="{mix(cor, "#ffffff", .75)}"/>'
            f'<stop offset=".3" stop-color="{mix(cor, "#ffffff", .15)}"/><stop offset=".78" stop-color="{cor}"/><stop offset="1" stop-color="{mix(cor, "#000000", .55)}"/></radialGradient>')


# ---------- sombra fisica: o objeto projetado no chao pela direcao da luz, desfocado ----------
LUZ = (.30, .35, -1.0)   # luz de cima, da esquerda e da frente: a sombra cai para a direita e para tras
def no_chao(p, z0):
    x, y, z = p; k = (z - z0) / -LUZ[2]
    return (x + LUZ[0] * k, y + LUZ[1] * k, z0)
def filtro_sombra(desfoque=2.2):
    return f'<filter id="fs@K@" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="{desfoque}"/></filter>'
def sombra_esferas(cam, esferas, z0, op=.30):
    """esferas: (x,y,z,r) no espaco do modelo; cada uma vira um disco no chao (elipse na tela)."""
    out = ''
    for x, y, z, r in esferas:
        cx, cy, cz = no_chao((x, y, z), z0)
        pts = [cam.P(cx + r * math.cos(a), cy + r * math.sin(a), z0) for a in [i * math.pi / 8 for i in range(16)]]
        out += '<path d="M' + ' L'.join('%.2f %.2f' % q for q in pts) + 'Z"/>'
    return f'<g fill="#1b1d2a" opacity="{op}" filter="url(#fs@K@)">' + out + '</g>'
def sombra_poligono(cam, poly3d, z0, op=.30):
    pts = [cam.P(*no_chao(p, z0)) for p in poly3d]
    return f'<path d="M' + ' L'.join('%.2f %.2f' % q for q in pts) + f'Z" fill="#1b1d2a" opacity="{op}" filter="url(#fs@K@)"/>'

# ------------------------------------------------------------------ QUIMICA: cafeina
def qui():
    global LUZ
    _luz_antes = LUZ; LUZ = (.10, .14, -1.0)   # luz quase a pino: molecula flutuando perto do chao
    try:
        return _qui()
    finally:
        LUZ = _luz_antes
def _qui():
    from rdkit import Chem
    from rdkit.Chem import AllChem
    m = Chem.AddHs(Chem.MolFromSmiles('CN1C=NC2=C1C(=O)N(C(=O)N2C)C'))
    assert Chem.rdMolDescriptors.CalcMolFormula(m) == 'C8H10N4O2'
    AllChem.EmbedMolecule(m, randomSeed=7); AllChem.MMFFOptimizeMolecule(m)
    c = m.GetConformer(); X = [list(c.GetAtomPosition(i)) for i in range(m.GetNumAtoms())]
    # orienta: plano do anel de frente para a camera (PCA)
    import numpy as np
    A = np.array(X); A -= A.mean(0); _, _, vt = np.linalg.svd(A); A = A @ vt.T    # eixo 1 = maior extensao, eixo 3 = normal ao plano
    pts = [(a[0], a[2] * 1.0 + 0.0, a[1]) for a in A]       # x, profundidade, altura
    _z0 = min(p[2] for p in pts) - 0.5
    cam = Cam(-24, 34, pts + [no_chao(p, _z0) for p in pts], 158, 116, 90, 68)
    EL = {'C': ('#3c414d', .50), 'N': ('#3566e0', .48), 'O': ('#e23b48', .48), 'H': ('#e9e9ee', .30)}   # bolas maiores: aparencia de modelo fisico
    defs = ''.join(esfera_real('a' + e, EL[e][0]) for e in EL) + (
        '<linearGradient id="bs@K@" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#f4f5f8"/><stop offset=".45" stop-color="#c3c7d1"/><stop offset="1" stop-color="#6e7380"/></linearGradient>')
    itens = []   # (profundidade, svg)
    for b in m.GetBonds():
        i, j = b.GetBeginAtomIdx(), b.GetEndAtomIdx(); pi, pj = pts[i], pts[j]
        mid = tuple((pi[k] + pj[k]) / 2 for k in range(3))
        for a, s in ((i, pi), (j, pj)):          # meia ligacao pintada junto com o seu atomo
            (x1, y1), (x2, y2) = cam.P(*s), cam.P(*mid)
            ordem = b.GetBondTypeAsDouble()
            w = .17 * cam.k
            seg = (f'<line x1="{x1:.2f}" y1="{y1:.2f}" x2="{x2:.2f}" y2="{y2:.2f}" stroke="#3a3e48" stroke-width="{w*1.25:.2f}" stroke-linecap="round"/>'
                   f'<line x1="{x1:.2f}" y1="{y1:.2f}" x2="{x2:.2f}" y2="{y2:.2f}" stroke="#b8bdc8" stroke-width="{w:.2f}" stroke-linecap="round"/>'
                   f'<line x1="{x1:.2f}" y1="{y1-w*.18:.2f}" x2="{x2:.2f}" y2="{y2-w*.18:.2f}" stroke="#ffffff" stroke-width="{w*.32:.2f}" stroke-linecap="round" opacity=".75"/>')
            if ordem == 2:   # dupla: segunda haste paralela, mais fina
                dx, dy = x2 - x1, y2 - y1; n = math.hypot(dx, dy) or 1; ox, oy = -dy / n * 3.2, dx / n * 3.2
                seg += (f'<line x1="{x1+ox:.2f}" y1="{y1+oy:.2f}" x2="{x2+ox:.2f}" y2="{y2+oy:.2f}" stroke="#2b2f38" stroke-width="3" stroke-linecap="round"/>'
                        f'<line x1="{x1+ox:.2f}" y1="{y1+oy:.2f}" x2="{x2+ox:.2f}" y2="{y2+oy:.2f}" stroke="#aab0bd" stroke-width="1.6" stroke-linecap="round"/>')
            itens.append((cam.D(*s) + .01, seg))
    for i, a in enumerate(m.GetAtoms()):
        e = a.GetSymbol(); cor, r = EL[e]; x, y = cam.P(*pts[i]); dd = cam.D(*pts[i]); R = r * cam.k * (1 - .035 * dd)   # o que esta mais perto parece maior
        itens.append((dd, f'<circle cx="{x:.2f}" cy="{y:.2f}" r="{R:.2f}" fill="url(#a{e}@K@)"/>'
                          f'<ellipse cx="{x-R*.36:.2f}" cy="{y-R*.40:.2f}" rx="{R*.26:.2f}" ry="{R*.15:.2f}" fill="#fff" opacity=".85" transform="rotate(-30 {x-R*.36:.2f} {y-R*.40:.2f})"/>'))
    itens.sort(key=lambda t: -t[0])
    z0 = _z0
    # sombra da molecula inteira: atomos e ligacoes projetados no chao (a silhueta e a da propria cafeina)
    sh = ''
    for b in m.GetBonds():
        p1 = cam.P(*no_chao(pts[b.GetBeginAtomIdx()], z0)); p2 = cam.P(*no_chao(pts[b.GetEndAtomIdx()], z0))
        sh += f'<line x1="{p1[0]:.2f}" y1="{p1[1]:.2f}" x2="{p2[0]:.2f}" y2="{p2[1]:.2f}" stroke="#1b1d2a" stroke-width="4.2" stroke-linecap="round"/>'
    esf = [(pts[i][0], pts[i][1], pts[i][2], EL[at.GetSymbol()][1] * 1.05) for i, at in enumerate(m.GetAtoms())]
    # 30/10: a molecula flutua (nao repousa em nada) -> sem sombra; a mancha borrada colada embaixo foi removida
    return SV + '<defs>' + defs + '</defs>' + ''.join(t for _, t in itens) + '</svg>'

# ------------------------------------------------------------------ BIOLOGIA: DNA-B
def bio():
    seq = 'ATGCGTACCGATGCAAT'          # fita 1; fita 2 e complementar (A-T, G-C)
    comp = {'A': 'T', 'T': 'A', 'G': 'C', 'C': 'G'}
    COR = {'A': '#f2b33d', 'T': '#ef5d55', 'G': '#34c77b', 'C': '#4d8ff0'}
    R, rise, twist, menor = 10.0, 3.4, 36.0, 144.0     # A; graus por par; defasagem das fitas (sulco menor)
    n = len(seq); comp_eixo = (n - 1) * rise
    def pos(i, fase):   # eixo da helice deitado ao longo de x
        t = math.radians(i * twist + fase); return (i * rise - comp_eixo / 2, R * math.sin(t), R * math.cos(t))
    f1 = [pos(i, 0) for i in range(n)]; f2 = [pos(i, menor) for i in range(n)]
    cam = Cam(-16, 12, f1 + f2, 164, 110, 90, 64)
    defs = esfera_grad('s1', '#7b8fff') + esfera_grad('s2', '#b07cf0')
    itens = []
    # bases: cada metade do degrau pinta com a cor da sua base, ate o centro do par
    for i in range(n):
        a, b = f1[i], f2[i]; mid = tuple((a[k] + b[k]) / 2 for k in range(3))
        for p, base in ((a, seq[i]), (b, comp[seq[i]])):
            q = tuple(p[k] + (mid[k] - p[k]) * .98 for k in range(3))
            (x1, y1), (x2, y2) = cam.P(*p), cam.P(*q); c = COR[base]
            itens.append((cam.D(*tuple((p[k] + mid[k]) / 2 for k in range(3))),
                          f'<line x1="{x1:.2f}" y1="{y1:.2f}" x2="{x2:.2f}" y2="{y2:.2f}" stroke="{mix(c, "#000000", .45)}" stroke-width="4.6" stroke-linecap="round"/>'
                          f'<line x1="{x1:.2f}" y1="{y1:.2f}" x2="{x2:.2f}" y2="{y2:.2f}" stroke="{c}" stroke-width="3" stroke-linecap="round"/>'))
    # esqueleto acucar-fosfato: tubo amostrado finamente, pedacos pintados por profundidade
    for fase, g, cor in ((0, 's1', '#7b8fff'), (menor, 's2', '#b07cf0')):
        N = (n - 1) * 8
        pts = [pos(j / 8, fase) for j in range(N + 1)]
        for j in range(N):
            p, q = pts[j], pts[j + 1]; (x1, y1), (x2, y2) = cam.P(*p), cam.P(*q)
            dd = cam.D(*tuple((p[k] + q[k]) / 2 for k in range(3)))
            luz = .55 + .45 * (1 - (dd + R) / (2 * R))
            itens.append((dd, f'<line x1="{x1:.2f}" y1="{y1:.2f}" x2="{x2:.2f}" y2="{y2:.2f}" stroke="{mix("#14183a", cor, luz)}" stroke-width="5.6" stroke-linecap="round"/>'))
        for i in range(n):   # fosfatos
            p = pos(i, fase); x, y = cam.P(*p)
            itens.append((cam.D(*p) - .01, f'<circle cx="{x:.2f}" cy="{y:.2f}" r="3.6" fill="url(#{g}@K@)"/>'))
    itens.sort(key=lambda t: -t[0])
    d, s = sombra(90, 126, 66, 6, .3)
    return SV + '<defs>' + defs + d + '</defs>' + s + ''.join(t for _, t in itens) + '</svg>'

# ------------------------------------------------------------------ PORTUGUES: pilha de livros com um aberto em cima
# Modelado como caixas reais: capa dura um pouco maior que o miolo nos 3 lados sem lombada, lombada virada para
# a frente, miolo (folhas) visivel do lado direito com as linhas das paginas. Luz difusa por face. A sombra e a
# pegada da pilha projetada no chao pela mesma direcao da luz (nao uma elipse generica).
def _rot(x, y, yaw):
    c, s = math.cos(yaw), math.sin(yaw); return x * c - y * s, x * s + y * c
def _luz(n):
    L = [-v for v in LUZ]; nl = math.sqrt(sum(v * v for v in L)); nn = math.sqrt(sum(v * v for v in n)) or 1
    return max(0, sum(n[k] * L[k] for k in range(3)) / nl / nn)
def _caixa(x0, x1, y0, y1, z0, z1):
    """faces: (normal, [4 cantos]) no espaco local"""
    return [((0, 0, 1), [(x0, y0, z1), (x1, y0, z1), (x1, y1, z1), (x0, y1, z1)]),
            ((0, 0, -1), [(x0, y0, z0), (x0, y1, z0), (x1, y1, z0), (x1, y0, z0)]),
            ((0, -1, 0), [(x0, y0, z0), (x1, y0, z0), (x1, y0, z1), (x0, y0, z1)]),
            ((0, 1, 0), [(x1, y1, z0), (x0, y1, z0), (x0, y1, z1), (x1, y1, z1)]),
            ((1, 0, 0), [(x1, y0, z0), (x1, y1, z0), (x1, y1, z1), (x1, y0, z1)]),
            ((-1, 0, 0), [(x0, y1, z0), (x0, y0, z0), (x0, y0, z1), (x0, y1, z1)])]
def livro_fechado(cam, cx, cy, zb, W, D, T, yaw, capa, mundo):
    c, ov = .045, .035
    def M(p):   # local -> mundo
        x, y = _rot(p[0], p[1], yaw); return (cx + x, cy + y, zb + p[2])
    def Mn(n): x, y = _rot(n[0], n[1], yaw); return (x, y, n[2])
    partes = []   # (profundidade, svg)
    cam_dir = None
    def vis(n):   # a face aponta para a camera?
        a, b, d = cam.V(*n); return d < 0
    def face(pts, cor, contorno, extra=''):
        P = [cam.P(*M(q)) for q in pts]
        prof = sum(cam.D(*M(q)) for q in pts) / 4
        partes.append((prof, '<path d="M' + ' L'.join('%.2f %.2f' % q for q in P) + f'Z" fill="{cor}" stroke="{contorno}" stroke-width=".7" stroke-linejoin="round"/>' + extra))
    escuro = mix(capa, '#000000', .55)
    # capas (inferior e superior) e lombada
    for z0, z1 in ((0, c), (T - c, T)):
        for n, pts in _caixa(-W / 2, W / 2, -D / 2, D / 2, z0, z1):
            if vis(Mn(n)): face(pts, mix(mix(capa, '#000000', .35), capa, .35 + .65 * _luz(Mn(n))), escuro)
    # miolo (folhas): recuado nos 3 lados sem lombada
    mx0, mx1, my0, my1 = -W / 2 + ov * .3, W / 2 - ov, -D / 2 + .02, D / 2 - ov
    for n, pts in _caixa(mx0, mx1, my0, my1, c, T - c)[2:]:
        if n == (0, -1, 0): continue   # do lado da lombada nao aparece miolo
        if not vis(Mn(n)): continue
        cor = mix('#b9aa88', '#f6efdc', .35 + .65 * _luz(Mn(n)))
        linhas = ''
        k = 7
        for i in range(1, k):
            f = c + (T - 2 * c) * i / k
            a, b = pts[0], pts[1]
            p1, p2 = cam.P(*M((a[0], a[1], f))), cam.P(*M((b[0], b[1], f)))
            linhas += f'<line x1="{p1[0]:.2f}" y1="{p1[1]:.2f}" x2="{p2[0]:.2f}" y2="{p2[1]:.2f}" stroke="#cdbd98" stroke-width=".35"/>'
        face(pts, cor, '#a8946c', linhas)
    # lombada: face da frente inteira, com nervuras e etiqueta
    n = (0, -1, 0)
    if vis(Mn(n)):
        y = -D / 2 - .012
        pts = [(-W / 2, y, 0), (W / 2, y, 0), (W / 2, y, T), (-W / 2, y, T)]
        det = ''
        for xx in (-W / 2 + .1, -W / 2 + .14, W / 2 - .14, W / 2 - .1):
            p1, p2 = cam.P(*M((xx, y, T * .12))), cam.P(*M((xx, y, T * .88)))
            det += f'<line x1="{p1[0]:.2f}" y1="{p1[1]:.2f}" x2="{p2[0]:.2f}" y2="{p2[1]:.2f}" stroke="{escuro}" stroke-width=".6" opacity=".8"/>'
        et = [cam.P(*M((xx, y, zz))) for xx, zz in ((-W * .2, T * .3), (W * .2, T * .3), (W * .2, T * .7), (-W * .2, T * .7))]
        det += '<path d="M' + ' L'.join('%.2f %.2f' % q for q in et) + f'Z" fill="{mix(capa, "#ffffff", .55)}" stroke="{escuro}" stroke-width=".5"/>'
        face(pts, mix(mix(capa, '#000000', .3), capa, .4 + .6 * _luz(Mn(n))), escuro, det)
    partes.sort(key=lambda q: -q[0])
    mundo.extend(M(q) for q in [(-W / 2, -D / 2, 0), (W / 2, -D / 2, 0), (W / 2, D / 2, 0), (-W / 2, D / 2, 0),
                                 (-W / 2, -D / 2, T), (W / 2, -D / 2, T), (W / 2, D / 2, T), (-W / 2, D / 2, T)])
    return ''.join(s for _, s in partes)

def livro_aberto(cam, cx, cy, zb, W, H, yaw, mundo):
    """mesmo perfil de pagina real: sai da lombada, sobe e assenta sobre o bloco de folhas"""
    T, A = .035, .12
    def z(x):
        u = abs(x) / W; return T * min(1, u * 3) + A * (1 - math.exp(-u / .1)) * (1 - .55 * u)
    def dz(x): e = 1e-4; return (z(x + e) - z(x - e)) / (2 * e)
    def M(x, y, zz):
        a, b = _rot(x, y, yaw); return (cx + a, cy + b, zb + zz)
    out = []
    m, cz = .035, .022
    capa = '#2f4f74'
    cc = [cam.P(*M(x, y, cz)) for x, y in ((-(W + m), -(H / 2 + m)), (W + m, -(H / 2 + m)), (W + m, H / 2 + m), (-(W + m), H / 2 + m))]
    cb = [cam.P(*M(x, y, 0)) for x, y in ((-(W + m), -(H / 2 + m)), (W + m, -(H / 2 + m)))]
    out.append('<path d="M%.2f %.2f L%.2f %.2f L%.2f %.2f L%.2f %.2fZ" fill="#1f354f"/>' % (*cb[0], *cb[1], *cc[1], *cc[0]))
    out.append('<path d="M' + ' L'.join('%.2f %.2f' % q for q in cc) + 'Z" fill="' + capa + '" stroke="#16263a" stroke-width=".6"/>')
    N = 30
    for lado in (-1, 1):
        xs = [lado * W * (i / N) ** 1.4 for i in range(N + 1)]
        frente = [cam.P(*M(x, -H / 2, cz + z(x))) for x in xs] + [cam.P(*M(x, -H / 2, cz)) for x in reversed(xs)]
        out.append('<path d="M' + ' L'.join('%.2f %.2f' % q for q in frente) + 'Z" fill="#e9dcbd" stroke="#b39f78" stroke-width=".4"/>')
        for i in range(N):
            a, b = xs[i], xs[i + 1]; s = dz((a + b) / 2)
            nx, nz = -s * lado * lado, 1; luz = _luz((nx * (1 if lado > 0 else 1), 0, nz))
            cor = mix('#c7b893', '#fbf6ea', .3 + .7 * luz)
            q = [cam.P(*M(a, -H / 2, cz + z(a))), cam.P(*M(b, -H / 2, cz + z(b))), cam.P(*M(b, H / 2, cz + z(b))), cam.P(*M(a, H / 2, cz + z(a)))]
            out.append('<path d="M' + ' L'.join('%.2f %.2f' % p for p in q) + f'Z" fill="{cor}" stroke="{cor}" stroke-width=".3"/>')
        for k in range(8):
            y = H / 2 - .14 - k * .1
            xa = [lado * W * (.16 + .68 * j / 12) for j in range(13)]
            if k in (0, 4): xa = xa[:8]
            out.append('<polyline points="' + ' '.join('%.2f,%.2f' % cam.P(*M(x, y, cz + z(x) + .002)) for x in xa) + '" fill="none" stroke="#a5977c" stroke-width=".75" stroke-linecap="round" opacity=".8"/>')
    p1, p2 = cam.P(*M(0, -H / 2, cz)), cam.P(*M(0, H / 2, cz))
    out.append(f'<line x1="{p1[0]:.2f}" y1="{p1[1]:.2f}" x2="{p2[0]:.2f}" y2="{p2[1]:.2f}" stroke="#7d6b4c" stroke-width=".9" opacity=".7"/>')
    # fita marcadora saindo pela frente
    f0 = cam.P(*M(.05, H / 2 - .1, cz + z(.05) + .003)); f1 = cam.P(*M(.09, H / 2 - .1, cz + z(.09) + .003))
    f2 = cam.P(*M(.11, -H / 2, cz + z(.11) + .003)); f3 = cam.P(*M(.07, -H / 2, cz + z(.07) + .003))
    f4 = cam.P(*M(.12, -H / 2 - .02, -.16)); f5 = cam.P(*M(.09, -H / 2 - .02, -.12)); f6 = cam.P(*M(.06, -H / 2 - .02, -.16))
    out.append('<path d="M%.2f %.2f L%.2f %.2f L%.2f %.2f L%.2f %.2f L%.2f %.2f L%.2f %.2f L%.2f %.2fZ" fill="#c8323f" stroke="#8e1d27" stroke-width=".4"/>' % (*f0, *f1, *f2, *f4, *f5, *f6, *f3))
    mundo.extend(M(x, y, 0) for x in (-(W + m), W + m) for y in (-(H / 2 + m), H / 2 + m))
    return ''.join(out)

def por():
    pilha = [  # (dx, dy, W, D, T, giro em graus, cor da capa): azul, verde, vinho
        (0.00, 0.00, 2.30, 1.55, .36, 0, '#2f6496'),
        (-.05, .03, 2.10, 1.42, .30, 4, '#3d7d5a'),
        (.04, -.02, 1.95, 1.32, .27, -3, '#a23b3b')]
    zt = sum(b[4] for b in pilha)
    cant = []
    for dx, dy, W, D, T, g, _ in pilha:
        for sx in (-1, 1):
            for sy in (-1, 1): cant += [(dx + sx * W / 2, dy + sy * D / 2, 0), (dx + sx * W / 2, dy + sy * D / 2, zt + .3)]
    cant += [no_chao(p, 0) for p in cant]
    cam = Cam(-26, 30, cant, 164, 118, 90, 66)
    mundo = []; corpo = ''; zb = 0
    for dx, dy, W, D, T, g, cor in pilha:
        corpo += livro_fechado(cam, dx, dy, zb, W, D, T, math.radians(g), cor, mundo); zb += T
    corpo += livro_aberto(cam, .02, .0, zb, .86, 1.12, math.radians(2), mundo)
    # sombra (30/10, dono: "so quando necessario"): a pilha repousa na mesa, entao fica so um contato sutil —
    # a pegada do livro de baixo, sem projecao pela luz, pouco desfocada e clara
    pts = [p for p in mundo if abs(p[2]) < 1e-6]
    pts2 = sorted(set((round(p[0], 4), round(p[1], 4)) for p in pts))
    def cruz(o, a, b): return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])
    inf, sup = [], []
    for p in pts2:
        while len(inf) >= 2 and cruz(inf[-2], inf[-1], p) <= 0: inf.pop()
        inf.append(p)
    for p in reversed(pts2):
        while len(sup) >= 2 and cruz(sup[-2], sup[-1], p) <= 0: sup.pop()
        sup.append(p)
    casco = [(x, y, 0) for x, y in inf[:-1] + sup[:-1]]
    s = sombra_poligono(cam, casco, 0, .22)
    return SV + '<defs>' + filtro_sombra(1.2) + '</defs>' + s + corpo + '</svg>'

if __name__ == '__main__':
    import os, json
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    html = '<body style="background:#0f1529;margin:0;display:flex;gap:10px;padding:10px">' + ''.join(
        '<div style="width:360px;height:280px">' + f().replace('@K@', n).replace('class="ilu"', 'width="360" height="280"') + '</div>' for n, f in (('q', qui), ('b', bio), ('p', por)))
    open('/tmp/claude-0/-home-claude/e5566652-8789-513e-9e19-aca7ab2e3491/scratchpad/ilu3d.html', 'w').write(html + '</body>')

# -*- coding: utf-8 -*-
"""Icones realistas dos CONTEUDOS de Matematica (M01.1 ... M17.2, M13.9, M-OUTRO).
Base comum: reusa o motor dos icones de modulo (motor.py, gera_mat.py, gera_mat2.py) e acrescenta
torno (solido de revolucao), letras extrudadas (contorno da fonte DejaVu achatado em poligonos) e utilitarios."""
import math, os
import numpy as np
from gera_mat2 import *          # motor, util, gera_mat (dado, embaralhado...), texto_no_plano, papel_grade, curva_com_sombra
import gera_mat2 as GM2
from motor import _novo_id
from fontTools.pens.basePen import BasePen

AQUI = os.path.dirname(os.path.abspath(__file__))
BRUTO_SUB = os.path.join(AQUI, 'bruto_sub_mat'); os.makedirs(BRUTO_SUB, exist_ok=True)
SANS = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
SANS_B = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
SERIF_B = '/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf'
SERIF_I = '/usr/share/fonts/truetype/dejavu/DejaVuSerif-BoldItalic.ttf'
MONO_B = '/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf'
I = lambda *p: p

def grava_sub(id_, corpo, ocupa=.85):
    s = (f'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 200 200" width="400" height="400" data-ocupa="{ocupa}">'
         f'<g id="raiz">{corpo}</g></svg>')
    open(os.path.join(BRUTO_SUB, id_ + '.svg'), 'w').write(s)

# ------------------------------------------------------------------ utilitarios de cena
def cru(obj, fn, ordem=3, pts=()):
    """acrescenta desenho livre a um objeto (fn(cam) -> [(prof, svg)])"""
    fn.ordem = ordem; obj.cru.append((fn, [tuple(p) for p in pts])); return obj

def caixaM(obj, M, x0, x1, y0, y1, z0, z1, cor, b=0, **o):
    """caixa (opcionalmente chanfrada) em coordenadas locais transformadas por M"""
    if b <= 0:
        P = [M(x, y, z) for x in (x0, x1) for y in (y0, y1) for z in (z0, z1)]
    else:
        P = []
        for x in (x0, x1):
            for y in (y0, y1):
                for z in (z0, z1):
                    sx, sy, sz = (1 if x == x0 else -1), (1 if y == y0 else -1), (1 if z == z0 else -1)
                    P += [M(x + sx * b, y + sy * b, z), M(x + sx * b, y, z + sz * b), M(x, y + sy * b, z + sz * b)]
    return solido_convexo(obj, P, cor, **o)

def esfera_sh(c, centro, r, cor, prof=None, reflexo=True):
    o = c.add(Obj()); o.esfera(centro, r, cor, reflexo=reflexo)
    if prof is not None: o.prof = prof
    return o

# ------------------------------------------------------------------ torno: solido de revolucao (eixo vertical)
def torno(obj, perfil, cx=0, cy=0, z0=0, cor='#888888', brilho=.3, amb=.32, n=64, eixo=None, base=None, cores=None, tampa=True, ordem0=2):
    """perfil: [(r, h)] de baixo para cima; cada trecho vira um tronco de cone liso (gradiente da luz).
    eixo: vetor unitario do eixo (padrao z); base: ponto da base (padrao (cx, cy, z0)); cores: cor por trecho"""
    w = np.array(eixo if eixo is not None else (0, 0, 1.0), float); w = w / np.linalg.norm(w)
    b = np.array(base if base is not None else (cx, cy, z0), float)
    for i in range(len(perfil) - 1):
        (r0, h0), (r1, h1) = perfil[i], perfil[i + 1]
        if h1 - h0 < 1e-6: continue
        cc = cores[i] if cores else cor
        cilindro_liso(obj, tuple(b + w * h0), tuple(w * (h1 - h0)), max(r0, 1e-4), max(r1, 0) if r1 > 1e-4 else 0,
                      cor=cc, brilho=brilho, amb=amb, n=n, tampa_base=False, ordem=ordem0)
    return obj

# ------------------------------------------------------------------ letras: contornos da fonte -> poligonos
class _Achata(BasePen):
    def __init__(s, gs, passos=6):
        super().__init__(gs); s.cont = []; s.cur = []; s.n = passos
    def _moveTo(s, p): s.cur = [p]
    def _lineTo(s, p): s.cur.append(p)
    def _curveToOne(s, a, b, c):
        p0 = s.cur[-1]
        for t in np.linspace(0, 1, s.n + 1)[1:]:
            u = 1 - t
            s.cur.append((u**3 * p0[0] + 3 * u * u * t * a[0] + 3 * u * t * t * b[0] + t**3 * c[0],
                          u**3 * p0[1] + 3 * u * u * t * a[1] + 3 * u * t * t * b[1] + t**3 * c[1]))
    def _qCurveToOne(s, a, b):
        p0 = s.cur[-1]
        for t in np.linspace(0, 1, s.n + 1)[1:]:
            u = 1 - t
            s.cur.append((u * u * p0[0] + 2 * u * t * a[0] + t * t * b[0], u * u * p0[1] + 2 * u * t * a[1] + t * t * b[1]))
    def _closePath(s):
        if len(s.cur) > 2:
            if np.allclose(s.cur[0], s.cur[-1]): s.cur = s.cur[:-1]
            s.cont.append(s.cur)
        s.cur = []
    _endPath = _closePath

def _area(c): return sum(c[i][0] * c[(i + 1) % len(c)][1] - c[(i + 1) % len(c)][0] * c[i][1] for i in range(len(c))) / 2
def _dentro(p, c):
    x, y = p; ins = False
    for i in range(len(c)):
        (x1, y1), (x2, y2) = c[i], c[(i + 1) % len(c)]
        if (y1 > y) != (y2 > y) and x < x1 + (y - y1) * (x2 - x1) / (y2 - y1): ins = not ins
    return ins

def glifos(txt, tam, arquivo=SANS_B, centro=True, passos=5, track=0.0):
    """devolve [(contorno_externo, [furos])] em unidades do texto (u direita, v cima), centrado"""
    ft = fonte(arquivo); gs = ft.getGlyphSet(); cmap = ft.getBestCmap(); upm = ft['head'].unitsPerEm; hm = ft['hmtx']
    k = tam / upm
    larg = sum(hm[cmap[ord(ch)]][0] for ch in txt) * k + track * (len(txt) - 1)
    capa = (getattr(ft['OS/2'], 'sCapHeight', 0) or upm * .72) * k
    x0 = -larg / 2 if centro else 0; y0 = -capa / 2 if centro else 0
    pecas = []; x = x0
    for ch in txt:
        g = cmap[ord(ch)]; pen = _Achata(gs, passos); gs[g].draw(pen)
        cs = [[(x + px * k, y0 + py * k) for px, py in c] for c in pen.cont]
        ext = [c for c in cs if not any(_dentro(c[0], d) for d in cs if d is not c)]
        for e in ext:
            furos = [c for c in cs if c is not e and _dentro(c[0], e) and c not in ext]
            if _area(e) < 0: e = e[::-1]
            furos = [f if _area(f) < 0 else f[::-1] for f in furos]
            pecas.append((e, furos))
        x += hm[g][0] * k + track
    return pecas

def letras3d(c, txt, tam, M, e, cor, cor_lado=None, arquivo=SANS_B, sombra=True, passos=5, track=0.0, **o):
    """texto extrudado (espessura e) no plano local (u, v, 0..e), levado ao mundo por M. Um Obj por peca."""
    objs = []
    for ext, furos in glifos(txt, tam, arquivo, passos=passos, track=track):
        ob = c.add(Obj(sombra=sombra))
        extrusao(ob, ext, 0, e, cor, cor_lado or mix(cor, '#000000', .18), furos=furos, M=M, **o)
        objs.append(ob)
    return objs

# ------------------------------------------------------------------ desenho 2D sobre superficies
def pl(cam, pts, cor, w, op=1, extra=''):
    s = ' '.join(fmt(x) + ',' + fmt(y) for x, y in (cam.P(*p) for p in pts))
    o = f' opacity="{op}"' if op != 1 else ''
    return f'<polyline points="{s}" fill="none" stroke="{cor}" stroke-width="{fmt(w)}" stroke-linecap="round" stroke-linejoin="round"{o}{extra}/>'

def texto(cam, txt, M, u, v, z, tam, cor, arquivo=SANS_B, eu=(1, 0, 0), ev=(0, 1, 0), op=1):
    return texto_no_plano(cam, txt, M, u, v, z, tam, cor, arquivo, eu, ev, op)

def seta3(cam, a, b, cor, w=1.6, cab=.14):
    """seta reta de a para b (3D), cabeca triangular no plano da tela"""
    A = np.array(cam.P(*a)); B = np.array(cam.P(*b)); d = B - A; L = np.linalg.norm(d) or 1; d /= L; n = np.array([-d[1], d[0]])
    h = cab * cam.k; C = B - d * h
    return (f'<line x1="{fmt(A[0])}" y1="{fmt(A[1])}" x2="{fmt(C[0])}" y2="{fmt(C[1])}" stroke="{cor}" stroke-width="{fmt(w)}" stroke-linecap="round"/>'
            f'<path d="M{fmt(B[0])} {fmt(B[1])} L{fmt(C[0]+n[0]*h*.45)} {fmt(C[1]+n[1]*h*.45)} L{fmt(C[0]-n[0]*h*.45)} {fmt(C[1]-n[1]*h*.45)}Z" fill="{cor}"/>')

def elipse_pts(cam, c, r, n=48, z=None):
    """pontos de tela de um circulo horizontal"""
    return [cam.P(c[0] + r * math.cos(t), c[1] + r * math.sin(t), c[2]) for t in np.linspace(0, 2 * math.pi, n, endpoint=False)]

def vidro_cilindro(c, cx, cy, z0, r, h, nivel=0, cor_liq=None, marcas=0, pe=0, tom='#cfe3ea', op_corpo=.18, prof=None, bico=False):
    """copo/proveta de vidro: liquido opaco ate 'nivel', corpo translucido, aro, reflexos e marcas de graduacao"""
    o = c.add(Obj())
    if prof is not None: o.prof = prof
    if pe:
        cilindro_liso(o, (cx, cy, z0), (0, 0, pe * .35), r * 1.55, r * 1.45, cor=tom, brilho=.5, amb=.5, ordem=0)
    zb = z0 + (pe * .35 if pe else 0)
    if nivel > 0:
        cilindro_liso(o, (cx, cy, zb + .02), (0, 0, nivel), r * .93, cor=cor_liq, brilho=.35, amb=.42, ordem=1)
    o.extra_pts += [(cx + r * math.cos(t), cy + r * math.sin(t), zz) for t in np.linspace(0, 2 * math.pi, 16) for zz in (zb, zb + h)]
    def fn(cam):
        out = []
        topo = [cam.P(cx + r * math.cos(t), cy + r * math.sin(t), zb + h) for t in np.linspace(0, 2 * math.pi, 60, endpoint=False)]
        base = [cam.P(cx + r * math.cos(t), cy + r * math.sin(t), zb) for t in np.linspace(0, 2 * math.pi, 60, endpoint=False)]
        P2 = np.array(topo + base); hh = ConvexHull(P2); cont = P2[hh.vertices]
        out.append((0, f'<path d="{caminho(cont)}" fill="{tom}" fill-opacity="{op_corpo}" stroke="{mix(tom, "#2a3a44", .55)}" stroke-width=".7"/>'))
        out.append((0, f'<path d="{caminho(topo)}" fill="none" stroke="{mix(tom, "#2a3a44", .45)}" stroke-width=".8"/>'))
        # reflexos verticais (lado da luz e borda oposta)
        for ang, lw, op in ((math.radians(-125), 2.2, .75), (math.radians(-100), .9, .55), (math.radians(-35), 1.2, .35)):
            a = (cx + r * .97 * math.cos(ang), cy + r * .97 * math.sin(ang))
            out.append((0, lin(cam, (a[0], a[1], zb + h * .08), (a[0], a[1], zb + h * .92), '#ffffff', lw, op)))
        for i in range(1, marcas + 1):
            zz = zb + h * i / (marcas + 1); L = .35 if i % 2 == 0 else .2
            arco = [(cx + r * math.cos(t), cy + r * math.sin(t), zz) for t in np.linspace(math.radians(-75), math.radians(-75) + L, 6)]
            out.append((0, pl(cam, arco, '#3c4a55', .6)))
        return out
    cru(o, fn, ordem=5)
    return o

def lateral_tronco(cam, base, eixo, r0, r1, cor, amb=.32, brilho=.3, furo_topo=False, gid=None, n=72):
    """lateral de cilindro/tronco num path com gradiente da luz; furo_topo: a boca fica vazada (evenodd)"""
    b = np.array(base, float); a = np.array(eixo, float); Hh = np.linalg.norm(a); w = a / Hh
    t = np.array([1.0, 0, 0]) if abs(w[0]) < .9 else np.array([0, 1.0, 0])
    u = np.cross(w, t); u /= np.linalg.norm(u); v = np.cross(w, u)
    ang = np.linspace(0, 2 * math.pi, n, endpoint=False)
    aro0 = [tuple(b + r0 * (math.cos(q) * u + math.sin(q) * v)) for q in ang]
    aro1 = [tuple(b + a + r1 * (math.cos(q) * u + math.sin(q) * v)) for q in ang]
    k = (r0 - r1) / Hh
    P2 = np.array([cam.P(*p) for p in aro0 + aro1]); h = ConvexHull(P2); cont = P2[h.vertices]
    e0, e1 = np.array(cam.P(*b)), np.array(cam.P(*(b + a))); ax = e1 - e0
    if np.linalg.norm(ax) < 1e-6: ax = np.array([0, 1.0])
    ax = ax / np.linalg.norm(ax); pp = np.array([-ax[1], ax[0]])
    proj = cont @ pp; lo, hi = proj.min(), proj.max()
    stops = []
    for q in np.linspace(0, 2 * math.pi, 96, endpoint=False):
        nrm = math.cos(q) * u + math.sin(q) * v + k * w
        if not cam.V(*nrm)[2] < 0: continue
        pt = b + a * .5 + ((r0 + r1) / 2) * (math.cos(q) * u + math.sin(q) * v)
        s_ = (np.array(cam.P(*pt)) @ pp - lo) / ((hi - lo) or 1)
        stops.append((s_, tom(cor, nrm, amb, brilho)))
    stops.sort(); idx = np.linspace(0, len(stops) - 1, min(12, len(stops))).round().astype(int)
    gid = gid or _novo_id('lt')
    st = ''.join(f'<stop offset="{fmt(max(0, min(1, stops[i][0])))}" stop-color="{stops[i][1]}"/>' for i in idx)
    g0 = e0 + pp * (lo - e0 @ pp); g1 = e0 + pp * (hi - e0 @ pp)
    d = caminho(cont)
    if furo_topo: d += ' ' + caminho([cam.P(*p) for p in aro1])
    return (f'<linearGradient id="{gid}" gradientUnits="userSpaceOnUse" x1="{fmt(g0[0])}" y1="{fmt(g0[1])}" x2="{fmt(g1[0])}" y2="{fmt(g1[1])}">{st}</linearGradient>'
            f'<path d="{d}" fill="url(#{gid})"' + (' fill-rule="evenodd"' if furo_topo else '') + '/>'), aro1

def roda(c_):
    return c_.render()

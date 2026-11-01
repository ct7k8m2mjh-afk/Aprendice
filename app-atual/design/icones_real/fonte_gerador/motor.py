# -*- coding: utf-8 -*-
"""Motor 3D dos icones realistas (extensao do design/gera_ilu3d.py, o mesmo modelo aprovado pelo Vitor no livro e no
grafico 3D): camera com azimute/elevacao, luz unica de cima-esquerda-frente, sombreamento difuso por face,
pintura do fundo para a frente e sombra projetada no chao pela direcao da luz (a silhueta do proprio objeto)."""
import math, os, sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))
import gera_ilu3d as G
from gera_ilu3d import mix, hx
import numpy as np
from scipy.spatial import ConvexHull

LUZ = (.30, .35, -1.0)          # direcao em que a luz viaja (igual ao gera_ilu3d)
_L = np.array([-v for v in LUZ]); _L = _L / np.linalg.norm(_L)

def luz(n):
    n = np.asarray(n, float); k = np.linalg.norm(n)
    return 0.0 if k == 0 else max(0.0, float(n @ _L) / k)

def tom(base, n, amb=.30, brilho=.0):
    """cor de uma face com normal n: sombra propria escura, meio-tom, e um toque de especular"""
    l = luz(n)
    c = mix(mix(base, '#000000', .55), base, min(1, amb + (1 - amb) * 1.08 * l))
    if brilho and l > .80: c = mix(c, '#ffffff', brilho * (l - .80) / .20)
    return c

def no_chao(p, z0=0.0):
    x, y, z = p; k = (z - z0) / -LUZ[2]
    return (x + LUZ[0] * k, y + LUZ[1] * k, z0)

def normal(pts):
    """normal de Newell (funciona para poligonos nao triangulares)"""
    n = np.zeros(3); P = np.asarray(pts, float)
    for i in range(len(P)):
        a, b = P[i], P[(i + 1) % len(P)]
        n += [(a[1] - b[1]) * (a[2] + b[2]), (a[2] - b[2]) * (a[0] + b[0]), (a[0] - b[0]) * (a[1] + b[1])]
    return n

def fmt(v): return ('%.2f' % v).rstrip('0').rstrip('.')
def caminho(P2):
    return 'M' + ' L'.join(fmt(x) + ' ' + fmt(y) for x, y in P2) + 'Z'

class Obj:
    """um objeto fisico: faces + esferas + extras; projeta sombra propria"""
    def __init__(s, sombra=True, topo_por_ultimo=False):
        s.faces = []      # (pts3, cor_base, opcoes)
        s.esferas = []    # (c, r, cor)
        s.cru = []        # (fn(cam)->[(prof, svg)], pts3 para enquadrar)
        s.sombra = sombra; s.extra_pts = []
    def face(s, pts, cor, **o): s.faces.append((list(map(tuple, pts)), cor, o)); return s
    def esfera(s, c, r, cor, **o): s.esferas.append((tuple(c), r, cor, o)); return s
    def raw(s, fn, pts): s.cru.append((fn, [tuple(p) for p in pts])); return s
    def pontos(s):
        P = [p for f in s.faces for p in f[0]] + s.extra_pts
        for c, r, _, _ in s.esferas:
            P += [(c[0] + dx * r, c[1] + dy * r, c[2] + dz * r) for dx, dy, dz in ((1,0,0),(-1,0,0),(0,1,0),(0,-1,0),(0,0,1),(0,0,-1))]
        for _, pts in s.cru: P += pts
        return P

def solido_convexo(obj, pts, cor, **o):
    """faces de um poliedro convexo (casco convexo); cor pode ser funcao da normal"""
    P = np.asarray(pts, float); h = ConvexHull(P)
    grupos = {}
    for simp, eq in zip(h.simplices, h.equations):
        k = tuple(np.round(eq[:3], 4))
        grupos.setdefault(k, set()).update(simp.tolist())
    for k, idx in grupos.items():
        V = P[list(idx)]; n = np.array(k); c = V.mean(0)
        u = V[0] - c; u /= np.linalg.norm(u) or 1; w = np.cross(n, u)
        ang = [math.atan2((v - c) @ w, (v - c) @ u) for v in V]
        V = V[np.argsort(ang)]
        obj.face(V, cor(n) if callable(cor) else cor, **o)
    return obj

def caixa(obj, x0, x1, y0, y1, z0, z1, cor, **o):
    return solido_convexo(obj, [(x, y, z) for x in (x0, x1) for y in (y0, y1) for z in (z0, z1)], cor, **o)

def caixa_chanfro(obj, x0, x1, y0, y1, z0, z1, b, cor, **o):
    P = []
    for x in (x0, x1):
        for y in (y0, y1):
            for z in (z0, z1):
                sx, sy, sz = (1 if x == x0 else -1), (1 if y == y0 else -1), (1 if z == z0 else -1)
                P += [(x + sx * b, y + sy * b, z), (x + sx * b, y, z + sz * b), (x, y + sy * b, z + sz * b)]
    return solido_convexo(obj, P, cor, **o)

def cilindro(obj, cx, cy, z0, z1, r, cor, n=48, r_topo=None, **o):
    rt = r if r_topo is None else r_topo
    P = [(cx + r * math.cos(2 * math.pi * i / n), cy + r * math.sin(2 * math.pi * i / n), z0) for i in range(n)]
    P += [(cx + rt * math.cos(2 * math.pi * i / n), cy + rt * math.sin(2 * math.pi * i / n), z1) for i in range(n)] if rt > 1e-6 else [(cx, cy, z1)]
    return solido_convexo(obj, P, cor, **o)

def extrusao(obj, poligono, z0, z1, cor_topo, cor_lado, furos=(), M=None, **o):
    """prisma de um poligono 2D qualquer (nao convexo), com furos. M: funcao (x,y,z)->mundo."""
    M = M or (lambda x, y, z: (x, y, z))
    def lados(c, inverte):
        n = len(c)
        for i in range(n):
            a, b = c[i], c[(i + 1) % n]
            q = [M(a[0], a[1], z0), M(b[0], b[1], z0), M(b[0], b[1], z1), M(a[0], a[1], z1)]
            if inverte: q = q[::-1]
            obj.face(q, cor_lado, lado=True, **o)
    area = sum(poligono[i][0] * poligono[(i + 1) % len(poligono)][1] - poligono[(i + 1) % len(poligono)][0] * poligono[i][1] for i in range(len(poligono)))
    lados(poligono if area > 0 else poligono[::-1], False)
    for f in furos:
        af = sum(f[i][0] * f[(i + 1) % len(f)][1] - f[(i + 1) % len(f)][0] * f[i][1] for i in range(len(f)))
        lados(f if af < 0 else f[::-1], False)
    topo = [M(x, y, z1) for x, y in poligono]
    obj.face(topo, cor_topo, topo=True, furos=[[M(x, y, z1) for x, y in f] for f in furos], **o)
    return obj

class Cena:
    def __init__(s, az, el, fundo_z=0.0, desfoque=2.4, op_sombra=.28):
        s.az, s.el = az, el; s.objs = []; s.z0 = fundo_z; s.defs = []; s.blur = desfoque; s.ops = op_sombra
        s.sobre = []   # svg 2D por cima (fn(cam))
    def add(s, o): s.objs.append(o); return o
    def render(s, W=200, H=200):
        todos = []
        for o in s.objs:
            P = o.pontos(); todos += P
            if o.sombra: todos += [no_chao(p, s.z0) for p in P]
        cam = G.Cam(s.az, s.el, todos, W, H, W / 2, H / 2)
        s.cam = cam
        out_sombra = []
        for o in s.objs:
            if not o.sombra: continue
            P = [no_chao(p, s.z0) for p in o.pontos()]
            P2 = np.array([cam.P(*p) for p in P])
            if len(P2) >= 3:
                try:
                    h = ConvexHull(P2); out_sombra.append(caminho(P2[h.vertices]))
                except Exception: pass
        itens = []   # (prof_obj, prof_item, ordem, svg)
        for oi, o in enumerate(s.objs):
            P = o.pontos(); pobj = sum(cam.D(*p) for p in P) / max(1, len(P))
            if hasattr(o, 'prof'): pobj = o.prof
            for pts, cor, op in o.faces:
                n = normal(pts)
                vis_n = np.array(cam.V(*n)) - np.array(cam.V(0, 0, 0))
                if vis_n[2] >= 0 and not op.get('dupla'): continue   # face de costas
                fill = tom(cor, n, op.get('amb', .30), op.get('brilho', 0)) if not op.get('plana') else cor
                P2 = [cam.P(*p) for p in pts]
                d = caminho(P2)
                for f in op.get('furos', []): d += ' ' + caminho([cam.P(*p) for p in f])
                st = op.get('contorno')
                sw = op.get('sw', .35)
                stroke = f' stroke="{st}" stroke-width="{sw}" stroke-linejoin="round"' if st else f' stroke="{fill}" stroke-width=".3" stroke-linejoin="round"'
                opac = f' fill-opacity="{op["opac"]}"' if 'opac' in op else ''
                if 'opac' in op and not st: stroke = ''
                ev = ' fill-rule="evenodd"' if op.get('furos') else ''
                svg = f'<path d="{d}" fill="{fill}"{opac}{ev}{stroke}/>' + (op['extra'](cam) if 'extra' in op else '')
                prof = sum(cam.D(*p) for p in pts) / len(pts)
                ordem = 1 if op.get('topo') else 0
                if 'ordem' in op: ordem = op['ordem']
                itens.append((pobj, ordem, -prof if 'prof' not in op else -op['prof'], svg))
            for c, r, cor, op in o.esferas:
                x, y = cam.P(*c); R = r * cam.k; nm = 'e' + hx(cor).__repr__().replace(' ', '').replace(',', '_').strip('()')
                if nm not in ''.join(s.defs): s.defs.append(G.esfera_real(nm, cor).replace('@K@', ''))
                svg = f'<circle cx="{fmt(x)}" cy="{fmt(y)}" r="{fmt(R)}" fill="url(#{nm})"/>'
                if op.get('reflexo', True):
                    svg += f'<ellipse cx="{fmt(x-R*.36)}" cy="{fmt(y-R*.40)}" rx="{fmt(R*.24)}" ry="{fmt(R*.14)}" fill="#fff" opacity=".8" transform="rotate(-30 {fmt(x-R*.36)} {fmt(y-R*.40)})"/>'
                itens.append((pobj, op.get('ordem', 0), -cam.D(*c), svg))
            for fn, _ in o.cru:
                for prof, svg in fn(cam):
                    itens.append((pobj, getattr(fn, 'ordem', 2), -prof, svg))
        itens.sort(key=lambda t: (-t[0], t[1], t[2]))
        # dentro do mesmo objeto: ordem (lados < topo < extras) e depois profundidade; objetos do fundo para a frente
        sh = ''
        if out_sombra:
            s.defs.append(f'<filter id="fs" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="{s.blur}"/></filter>')
            sh = f'<g fill="#1b1d2a" opacity="{s.ops}" filter="url(#fs)">' + ''.join(f'<path d="{d}"/>' for d in out_sombra) + '</g>'
        corpo = ''.join(t[3] for t in itens) + ''.join(fn(cam) for fn in s.sobre)
        return '<defs>' + ''.join(s.defs) + '</defs>' + sh + corpo

# ---------------- texto em superficie: glifos de uma fonte real, projetados ponto a ponto ----------------
from fontTools.ttLib import TTFont
from fontTools.pens.basePen import BasePen
_FONTES = {}
def fonte(caminho_fonte):
    if caminho_fonte not in _FONTES: _FONTES[caminho_fonte] = TTFont(caminho_fonte)
    return _FONTES[caminho_fonte]

class _Pen(BasePen):
    def __init__(s, gs, f):
        super().__init__(gs); s.f = f; s.d = []
    def _moveTo(s, p): x, y = s.f(*p); s.d.append(f'M{fmt(x)} {fmt(y)}')
    def _lineTo(s, p): x, y = s.f(*p); s.d.append(f'L{fmt(x)} {fmt(y)}')
    def _curveToOne(s, a, b, c):
        pts = [s.f(*q) for q in (a, b, c)]; s.d.append('C' + ' '.join(f'{fmt(x)} {fmt(y)}' for x, y in pts))
    def _qCurveToOne(s, a, b):
        pts = [s.f(*q) for q in (a, b)]; s.d.append('Q' + ' '.join(f'{fmt(x)} {fmt(y)}' for x, y in pts))
    def _closePath(s): s.d.append('Z')

def texto_path(txt, f_xy, tamanho, arquivo='/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf', centro=True):
    """devolve o 'd' do texto; f_xy(u, v) recebe coordenadas em unidades do texto (u direita, v cima) e devolve tela"""
    ft = fonte(arquivo); gs = ft.getGlyphSet(); cmap = ft.getBestCmap(); upm = ft['head'].unitsPerEm
    hm = ft['hmtx']; larg = sum(hm[cmap[ord(c)]][0] for c in txt) * tamanho / upm
    capa = ft['OS/2'].sCapHeight if hasattr(ft['OS/2'], 'sCapHeight') and ft['OS/2'].sCapHeight else upm * .7
    x0 = -larg / 2 if centro else 0; y0 = -capa * tamanho / upm / 2 if centro else 0
    d = []; x = x0
    for c in txt:
        g = cmap[ord(c)]
        pen = _Pen(gs, lambda px, py, x=x: f_xy(x + px * tamanho / upm, y0 + py * tamanho / upm))
        gs[g].draw(pen); d += pen.d; x += hm[g][0] * tamanho / upm
    return ''.join(d)

# ---------------- cilindro / cone / tronco liso: lateral num unico path com gradiente amostrado da luz ----------------
_GID = [0]
def _novo_id(p='g'):
    _GID[0] += 1; return f'{p}{_GID[0]}'

def cilindro_liso(obj, base, eixo, r0, r1=None, cor='#888888', tampa_cor=None, n=72, amb=.30, brilho=.25,
                  tampa_base=True, contorno=None, extra_tampa=None, cor_lado=None, ordem=2):
    """base: centro da base; eixo: vetor da base ao topo (comprimento = altura); r1=0 -> cone"""
    r1 = r0 if r1 is None else r1
    b = np.array(base, float); a = np.array(eixo, float); Hh = np.linalg.norm(a); w = a / Hh
    t = np.array([1.0, 0, 0]) if abs(w[0]) < .9 else np.array([0, 1.0, 0])
    u = np.cross(w, t); u /= np.linalg.norm(u); v = np.cross(w, u)
    ang = np.linspace(0, 2 * math.pi, n, endpoint=False)
    aro0 = [tuple(b + r0 * (math.cos(q) * u + math.sin(q) * v)) for q in ang]
    aro1 = [tuple(b + a + r1 * (math.cos(q) * u + math.sin(q) * v)) for q in ang] if r1 > 1e-6 else [tuple(b + a)]
    obj.extra_pts += aro0 + aro1
    tc = tampa_cor or cor; cl = cor_lado or cor
    gid = _novo_id('cl')
    # normal da lateral (cone inclina a normal)
    k = (r0 - r1) / Hh
    def fn(cam):
        out = []
        P2 = np.array([cam.P(*p) for p in aro0 + aro1])
        try: h = ConvexHull(P2); cont = P2[h.vertices]
        except Exception: return out
        e0, e1 = np.array(cam.P(*b)), np.array(cam.P(*(b + a)))
        ax = e1 - e0
        if np.linalg.norm(ax) < 1e-6: ax = np.array([0, 1.0])
        ax = ax / np.linalg.norm(ax); pp = np.array([-ax[1], ax[0]])
        proj = cont @ pp; lo, hi = proj.min(), proj.max()
        stops = []
        for q in np.linspace(0, 2 * math.pi, 96, endpoint=False):
            nrm = math.cos(q) * u + math.sin(q) * v + k * w
            if not cam.V(*nrm)[2] < 0: continue
            pt = b + a * .5 + ((r0 + r1) / 2) * (math.cos(q) * u + math.sin(q) * v)
            s = (np.array(cam.P(*pt)) @ pp - lo) / ((hi - lo) or 1)
            stops.append((s, tom(cl, nrm, amb, brilho)))
        stops.sort()
        if not stops: return out
        # simplifica paradas: mantem ~14
        idx = np.linspace(0, len(stops) - 1, min(14, len(stops))).round().astype(int)
        st = ''.join(f'<stop offset="{fmt(max(0, min(1, stops[i][0])))}" stop-color="{stops[i][1]}"/>' for i in idx)
        g0 = e0 + pp * (lo - e0 @ pp); g1 = e0 + pp * (hi - e0 @ pp)
        out.append((0, f'<linearGradient id="{gid}" gradientUnits="userSpaceOnUse" x1="{fmt(g0[0])}" y1="{fmt(g0[1])}" x2="{fmt(g1[0])}" y2="{fmt(g1[1])}">{st}</linearGradient>'
                       f'<path d="{caminho(cont)}" fill="url(#{gid})"' + (f' stroke="{contorno}" stroke-width=".5"' if contorno else '') + '/>'))
        # tampas visiveis
        for aro, nn, cc in ((aro1, w, tc), (aro0, -w, tc)):
            if len(aro) < 3 or (aro is aro0 and not tampa_base): continue
            if cam.V(*nn)[2] < 0:
                svg = f'<path d="{caminho([cam.P(*p) for p in aro])}" fill="{tom(cc, nn, amb, brilho)}"' + (f' stroke="{contorno}" stroke-width=".5"' if contorno else '') + '/>'
                if extra_tampa: svg += extra_tampa(cam, aro)
                out.append((-1, svg))
        return out
    lam = lambda cam: [(cam.D(*(b + a * .5)) - (0 if p == 0 else 1e-3), s) for p, s in fn(cam)]
    lam.ordem = ordem
    obj.cru.append((lam, []))
    return obj

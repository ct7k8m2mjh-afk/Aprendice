# -*- coding: utf-8 -*-
"""Quimica — icones realistas dos CONTEUDOS (Q01.1 ... Q12.5), no mesmo motor e acabamento dos modulos (gera_qui.py):
moleculas em bola-e-vareta com coordenadas reais do RDKit (MMFF), vidraria da Servier Medical Art (CC BY 3.0) e
objetos 3D do motor do projeto, com a mesma luz (cima-esquerda-frente) e a mesma sombra de contato.
Saida: bruto_sub_qui/<id>.svg (coordenadas de trabalho 200x200) -> finaliza.js -> ../sub/<id>.svg"""
from util import *
import re, colorsys
import servier
from servier import coloca, sombra_chao
from gera_qui import de_smiles
servier.BIO = os.environ.get('BIO_SERVIER', servier.BIO)
SV = 'cc-by-3.0/'
BRUTO_SUB = os.path.join(AQUI, 'bruto_sub_qui'); os.makedirs(BRUTO_SUB, exist_ok=True)
SANS = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'

def grava_sub(id_, corpo, ocupa=.85):
    s = (f'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 200 200" width="400" height="400" data-ocupa="{ocupa}">'
         f'<g id="raiz">{corpo}</g></svg>')
    open(os.path.join(BRUTO_SUB, id_ + '.svg'), 'w').write(s)

# cores CPK usuais nos modelos de plastico (as mesmas do modulo) + halogenios e ions
CPK = {'C': ('#3c414d', .42), 'N': ('#3566e0', .40), 'O': ('#e23b48', .44), 'H': ('#eceef2', .27),
       'F': ('#a6e07a', .38), 'Cl': ('#3fb34a', .50), 'Br': ('#9b2f22', .55), 'Na': ('#8a5cd6', .34)}

def bb(atomos, ligacoes, az=-24, el=30, ponte=(), escala_lig=.15, cpk=None, toco=(), op_sombra=.16):
    """bola-e-vareta (igual ao gera_qui.bola_bastao) com ligacao tripla e 'tocos' (ligacao que continua: polimero).
    atomos: [(simbolo, (x,y,z))] em angstrom; ligacoes: [(i, j, ordem)]; toco: [(i, (dx,dy,dz))]"""
    cpk = cpk or CPK
    P = [np.array(p, float) for _, p in atomos]
    z0 = min(p[2] for p in P) - .9
    c = Cena(az, el, fundo_z=z0, desfoque=2.6, op_sombra=op_sombra)
    o = c.add(Obj()); o.prof = 0
    for (e, p) in atomos:
        o.esfera(p, cpk[e][1], cpk[e][0])
    def seg(x1, y1, x2, y2, w, simples=True):
        s = (f'<line x1="{fmt(x1)}" y1="{fmt(y1)}" x2="{fmt(x2)}" y2="{fmt(y2)}" stroke="#3a3e48" stroke-width="{fmt(w*1.25 if simples else w*.85)}" stroke-linecap="round"/>'
             f'<line x1="{fmt(x1)}" y1="{fmt(y1)}" x2="{fmt(x2)}" y2="{fmt(y2)}" stroke="#b8bdc8" stroke-width="{fmt(w if simples else w*.55)}" stroke-linecap="round"/>')
        if simples:
            s += f'<line x1="{fmt(x1)}" y1="{fmt(y1-w*.18)}" x2="{fmt(x2)}" y2="{fmt(y2-w*.18)}" stroke="#ffffff" stroke-width="{fmt(w*.32)}" stroke-linecap="round" opacity=".75"/>'
        return s
    def fn(cam):
        out = []
        w = escala_lig * cam.k
        for i, j, ordem in ligacoes:
            mid = (P[i] + P[j]) / 2
            for a in (i, j):
                (x1, y1), (x2, y2) = cam.P(*P[a]), cam.P(*mid)
                if ordem in (2, 3):
                    dx, dy = x2 - x1, y2 - y1; n = math.hypot(dx, dy) or 1
                    off = .55 if ordem == 2 else .95
                    ox, oy = -dy / n * w * off, dx / n * w * off
                    s = ''
                    for k in ((-1, 1) if ordem == 2 else (-1, 0, 1)):
                        s += seg(x1 + k * ox, y1 + k * oy, x2 + k * ox, y2 + k * oy, w, simples=False)
                else:
                    s = seg(x1, y1, x2, y2, w)
                out.append((cam.D(*P[a]) + .01, s))
        for i, d in toco:
            q = P[i] + np.array(d, float)
            (x1, y1), (x2, y2) = cam.P(*P[i]), cam.P(*q)
            out.append((cam.D(*P[i]) + .01, seg(x1, y1, x2, y2, w)))
        for i, j in ponte:
            (x1, y1), (x2, y2) = cam.P(*P[i]), cam.P(*P[j])
            out.append((cam.D(*((P[i] + P[j]) / 2)), f'<line x1="{fmt(x1)}" y1="{fmt(y1)}" x2="{fmt(x2)}" y2="{fmt(y2)}" stroke="#2f6fd0" stroke-width="{fmt(w*.7)}" stroke-dasharray="{fmt(w*.9)} {fmt(w*.8)}" stroke-linecap="round"/>'))
        return out
    fn.ordem = 0
    o.cru.append((fn, [tuple(P[i] + np.array(d)) for i, d in toco]))
    return c

def mol(smi, seed=7, az=-24, el=30, **kw):
    at, lg, _ = de_smiles(smi, seed=seed)
    return bb(at, lg, az=az, el=el, **kw).render()

# ---------------------------------------------------------------- utilitarios de cor e 2D
def hls(h):
    h = h.lstrip('#'); r, g, b = (int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)); return colorsys.rgb_to_hls(r, g, b)
def de_hls(H, L, S):
    r, g, b = colorsys.hls_to_rgb(H, max(0, min(1, L)), max(0, min(1, S))); return '#%02x%02x%02x' % (round(r * 255), round(g * 255), round(b * 255))

def tingir(cores, alvo, sat=None, dl=0.0, lmin=0, lmax=1):
    """mapa {cor_original: nova} trocando matiz (e saturacao) pela do alvo, mantendo a luminosidade relativa"""
    H, _, S = hls(alvo); S = S if sat is None else sat
    return {c: de_hls(H, min(lmax, max(lmin, hls(c)[1] + dl)), S) for c in cores}

LIQ_TUBO = ['#ffefa6', '#ffc429', '#ff9400', '#fee46e']                  # liquido do testtube-yellow
LIQ_BEQ = ['#f7c4c2', '#f4a0a1', '#f0848a', '#ef757d', '#ec4b5e', '#db9a9f', '#c47581']   # liquido do beaker-red

def esf(nm, cor):
    return G.esfera_real(nm, cor).replace('@K@', '')
def bola(x, y, r, gid, reflexo=True):
    s = f'<circle cx="{fmt(x)}" cy="{fmt(y)}" r="{fmt(r)}" fill="url(#{gid})"/>'
    if reflexo:
        s += f'<ellipse cx="{fmt(x-r*.36)}" cy="{fmt(y-r*.40)}" rx="{fmt(r*.24)}" ry="{fmt(r*.14)}" fill="#fff" opacity=".8" transform="rotate(-30 {fmt(x-r*.36)} {fmt(y-r*.40)})"/>'
    return s

def texto(txt, cx, cy, tam, cor, arq=SANS, rot=0, extra=''):
    d = texto_path(txt, lambda u, v: (cx + u, cy - v), tam, arq)
    t = f' transform="rotate({rot} {fmt(cx)} {fmt(cy)})"' if rot else ''
    return f'<path d="{d}" fill="{cor}"{t}{extra}/>'

def vidro_tubo(x, y0, y1, r, gid='vt'):
    """tubo de vidro vertical em 2D (gradiente de vidro como o termometro do Q10)"""
    return (f'<rect x="{fmt(x-r)}" y="{fmt(y0)}" width="{fmt(2*r)}" height="{fmt(y1-y0)}" rx="{fmt(r)}" fill="url(#{gid})" stroke="#8fa0ab" stroke-width=".8"/>')
VIDRO = grad_lin('vt', [(0, '#cfd9df'), (.3, '#ffffff'), (.7, '#e8eef2'), (1, '#a9b6bf')], 0, 0, 1, 0)

def seta(x1, y1, x2, y2, cor='#d64545', w=7, gid='sg'):
    """seta grossa com volume (corpo com gradiente e reflexo), em 2D"""
    dx, dy = x2 - x1, y2 - y1; L = math.hypot(dx, dy); ux, uy = dx / L, dy / L; px, py = -uy, ux
    hb = w * 1.9; hl = w * 2.1
    bx, by = x2 - ux * hl, y2 - uy * hl
    pts = [(x1 + px * w / 2, y1 + py * w / 2), (bx + px * w / 2, by + py * w / 2), (bx + px * hb / 2, by + py * hb / 2), (x2, y2),
           (bx - px * hb / 2, by - py * hb / 2), (bx - px * w / 2, by - py * w / 2), (x1 - px * w / 2, y1 - py * w / 2)]
    d = caminho(pts)
    g = grad_lin(gid, [(0, mix(cor, '#ffffff', .45)), (.45, cor), (1, mix(cor, '#000000', .45))], fmt(.5 + px * .5), fmt(.5 + py * .5), fmt(.5 - px * .5), fmt(.5 - py * .5))
    return f'<defs>{g}</defs><path d="{d}" fill="url(#{gid})" stroke="{mix(cor, "#000000", .5)}" stroke-width=".8" stroke-linejoin="round"/>'

# ================================================================ Q01 Atomo e tabela periodica
def Q01_1():   # modelo de Thomson ("pudim de passas"): esfera de carga positiva com eletrons incrustados
    c = Cena(-20, 24, fundo_z=-1.75, desfoque=3, op_sombra=.18)
    o = c.add(Obj()); o.prof = 0
    o.esfera((0, 0, 0), 1.6, '#f0a35e')
    rng = np.random.default_rng(5)
    pts = []
    while len(pts) < 13:
        v = rng.normal(size=3); v /= np.linalg.norm(v)
        if all(np.linalg.norm(v - q) > .62 for q in pts): pts.append(v)
    for v in pts:
        o.esfera(tuple(v * 1.5), .2, '#3a78e0')   # na mesma pintura por profundidade: os de tras ficam escondidos
    return c.render()

def pontos_fcc(N, r, seed=0):
    rng = np.random.default_rng(seed)
    a = 2 * r * .97 / math.sqrt(2)
    P = [np.array((i, j, k), float) * a for i in range(-5, 6) for j in range(-5, 6) for k in range(-5, 6) if (i + j + k) % 2 == 0]
    off = rng.normal(0, .02, 3)
    P.sort(key=lambda p: np.linalg.norm(p - off) + rng.random() * 1e-3)
    return P[:N]

def nucleo(o, centro, n_p, n_n, r=.3, seed=1, cor_p='#d9433e', cor_n='#9aa1ab'):
    """aglomerado compacto de nucleons (protons vermelhos, neutrons cinza), como no modulo Q01"""
    N = n_p + n_n; c = np.array(centro, float)
    if N == 1: pos = [np.zeros(3)]
    else:
        # pontos numa espiral de Fibonacci em camadas, raio cresce com N^(1/3)
        pos = []; R = r * 1.25 * (N ** (1 / 3)) * .9
        rng = np.random.default_rng(seed)
        for i in range(N):
            k = (i + .5) / N; rr = R * k ** (1 / 3)
            th = math.acos(1 - 2 * ((i * .618034) % 1)); ph = i * 2.39996
            pos.append(rr * np.array([math.sin(th) * math.cos(ph), math.sin(th) * math.sin(ph), math.cos(th)]))
        if N == 2: pos = [np.array([-r * .85, 0, 0]), np.array([r * .85, 0, 0])]
        if N == 3: pos = [np.array([r * .9 * math.cos(a), 0, r * .9 * math.sin(a)]) for a in (math.pi / 2, math.pi / 2 + 2.094, math.pi / 2 + 4.189)]
        if N == 4: pos = [np.array(p) * r * .75 for p in ((1, 1, 1), (-1, -1, 1), (-1, 1, -1), (1, -1, -1))]
        if N > 4: pos = pontos_fcc(N, r, seed)
    rng = np.random.default_rng(seed); tipos = ['p'] * n_p + ['n'] * n_n; rng.shuffle(tipos)
    for p, t in zip(pos, tipos):
        o.esfera(tuple(c + p), r, cor_p if t == 'p' else cor_n)

def Q01_2():   # isotopos do hidrogenio: protio (1p), deuterio (1p+1n), tritio (1p+2n)
    # (correcao da revisao de 29/10: os tres atomos ficavam numa faixa estreita e ilegivel a 64 px; agora descem em
    #  diagonal ocupando o quadro, com nucleos maiores)
    C = [(-1.85, 0, 1.75), (0, 0, 0), (1.85, 0, -1.75)]
    c = Cena(-14, 18, fundo_z=-3.2, desfoque=3.2, op_sombra=.12)
    for (x, y, z), n in zip(C, (0, 1, 2)):
        o = c.add(Obj()); nucleo(o, (x, y, z), 1, n, r=.58, seed=3 + n)
    R = 1.3
    def orb(cam):
        out = []
        for x, y, z in C:   # 1 eletron em orbita (o mesmo numero atomico: Z = 1)
            pts = [(x + R * math.cos(t), y + R * math.sin(t) * .6, z + .42 * R * math.sin(t)) for t in np.linspace(0, 2 * math.pi, 61)]
            for j in range(len(pts) - 1):
                a, b = pts[j], pts[j + 1]; m = tuple((a[k] + b[k]) / 2 for k in range(3))
                out.append((cam.D(*m), lin(cam, a, b, '#3f64ad', .06 * cam.k, op=.9)))
            ex = pts[38]; X, Y = cam.P(*ex)
            out.append((cam.D(*ex) - .01, f'<circle cx="{fmt(X)}" cy="{fmt(Y)}" r="{fmt(.2*cam.k)}" fill="url(#eel)"/>'))
        return out
    orb.ordem = 0
    s = c.add(Obj(sombra=False)); s.prof = 0; s.cru.append((orb, [(-3.2, 0, 2.4), (3.2, 0, -2.4)]))
    c.defs.append(esf('eel', '#3a78e0'))
    return c.render()

def Q01_3():   # distribuicao eletronica em camadas: sodio 2-8-1 (K, L, M)
    c = Cena(-15, 58, fundo_z=-1.2, desfoque=3, op_sombra=.15)
    o = c.add(Obj(sombra=False)); o.prof = 0
    nucleo(o, (0, 0, 0), 11, 12, r=.17, seed=2)
    raios = (1.0, 1.75, 2.5); n_e = (2, 8, 1)
    def fn(cam):
        out = []
        for R, n, fase in zip(raios, n_e, (.3, .1, 2.2)):
            pts = [(R * math.cos(t), R * math.sin(t), 0) for t in np.linspace(0, 2 * math.pi, 97)]
            for j in range(len(pts) - 1):
                a, b = pts[j], pts[j + 1]; m = tuple((a[k] + b[k]) / 2 for k in range(3))
                out.append((cam.D(*m), lin(cam, a, b, '#4f73b8', .045 * cam.k, op=.9)))
            for i in range(n):
                t = fase + 2 * math.pi * i / n; e = (R * math.cos(t), R * math.sin(t), 0)
                X, Y = cam.P(*e)
                out.append((cam.D(*e) - .02, f'<circle cx="{fmt(X)}" cy="{fmt(Y)}" r="{fmt(.17*cam.k)}" fill="url(#eel)"/>'))
        return out
    fn.ordem = 0
    o.cru.append((fn, [(2.5, 0, 0), (-2.5, 0, 0), (0, 2.5, 0), (0, -2.5, 0)]))
    c.defs.append(esf('eel', '#3a78e0'))
    corpo = c.render()
    x, y = c.cam.P(*no_chao((0, 0, 0), -1.2))
    return sombra_eliptica(x, y, 2.3 * c.cam.k, .55 * c.cam.k, op=.14, blur=4) + corpo

def Q01_4():   # tabela periodica em blocos (s, p, d, f) como pecas sobre uma base
    COR = {'s': '#e46a5a', 'p': '#f0bd45', 'd': '#5c8fd8', 'f': '#5fbf86'}
    cel = []
    for per in range(1, 8):
        for g in range(1, 19):
            if per == 1 and g not in (1, 18): continue
            if per in (2, 3) and 3 <= g <= 12: continue
            b = 's' if g <= 2 or (per == 1) else ('d' if g <= 12 else 'p')
            if per >= 6 and g == 3: b = 'f'     # lantanideos/actinideos (casa da serie)
            cel.append((g, per, b))
    for lin_ in (8.6, 9.6):
        for k in range(14): cel.append((4 + k, lin_, 'f'))
    c = Cena(-12, 50, fundo_z=0, desfoque=2.4, op_sombra=.2)
    base = c.add(Obj())
    caixa(base, .3, 19.7, -.3, -10.9, -.35, 0, '#d9dde3')
    t = c.add(Obj(sombra=False))
    s = .86
    for g, per, b in cel:
        x0 = g; y0 = -per
        cx, cy = x0 + .5, y0 + .5
        h = .32
        P = [(cx - s / 2, cy - s / 2, h), (cx + s / 2, cy - s / 2, h), (cx + s / 2, cy + s / 2, h), (cx - s / 2, cy + s / 2, h)]
        t.face(P, COR[b], brilho=.25, contorno=mix(COR[b], '#000000', .35), sw=.3)
        F = [(cx - s / 2, cy - s / 2, 0), (cx + s / 2, cy - s / 2, 0), (cx + s / 2, cy - s / 2, h), (cx - s / 2, cy - s / 2, h)]
        t.face(F, mix(COR[b], '#000000', .1), ordem=0)
    t.prof = -100
    return c.render()

def Q01_5():   # raio atomico cresce ao descer no grupo 1: Li, Na, K, Rb, Cs (raios proporcionais: 152, 186, 227, 248, 265 pm)
    c = Cena(-20, 30, fundo_z=0, desfoque=2.8, op_sombra=.22)
    raios = [152, 186, 227, 248, 265]; k = 1 / 200
    x = 0; d = np.array([-math.cos(math.radians(50)), -math.sin(math.radians(50)), 0])
    for i, r in enumerate(raios):
        R = r * k
        x += R
        o = c.add(Obj()); p_ = d * x; o.esfera((p_[0], p_[1], R), R, '#8f86d8')
        x += R + .12
    return c.render()

# ================================================================ Q02 Ligacoes
def Q02_1():   # reticulo cristalino do NaCl (cubo de face centrada): Na+ pequeno (lilas) e Cl- grande (verde)
    at = []; lg = []
    idx = {}
    for i in range(3):
        for j in range(3):
            for k in range(3):
                idx[(i, j, k)] = len(at)
                at.append(('Na' if (i + j + k) % 2 == 0 else 'Cl', (i * 1.55 - 1.55, j * 1.55 - 1.55, k * 1.55 - 1.55)))
    for (i, j, k), a in idx.items():
        for d in ((1, 0, 0), (0, 1, 0), (0, 0, 1)):
            q = (i + d[0], j + d[1], k + d[2])
            if q in idx: lg.append((a, idx[q], 1))
    cpk = dict(CPK); cpk['Na'] = ('#8a5cd6', .36); cpk['Cl'] = ('#3fb34a', .62)
    return bb(at, lg, az=-28, el=24, escala_lig=.1, cpk=cpk).render()

def Q02_2():   # ligacao covalente: HCN (H-C simples, C≡N tripla), geometria do RDKit
    return mol('C#N', seed=1, az=-30, el=20, escala_lig=.16)

def Q02_3():   # geometria molecular: metano tetraedrico (109,5 graus) dentro do tetraedro de vidro
    at, lg, _ = de_smiles('C', seed=2)
    c = bb(at, lg, az=-22, el=22, escala_lig=.16)
    Hs = [np.array(p) for e, p in at if e == 'H']
    o = c.add(Obj(sombra=False)); o.prof = 0
    import itertools
    for tri in itertools.combinations(range(4), 3):
        o.face([tuple(Hs[i]) for i in tri], '#9fd3ee', opac=.16, dupla=True, contorno='#7fb6d6', sw=.6, plana=True)
    return c.render()

def Q02_4():   # forcas intermoleculares: gelo flutuando na agua (ligacoes de hidrogenio deixam o gelo menos denso)
    cores = ['#efb757', '#ffd866', '#f8c535', '#fdcf64', '#f8daaf', '#ffe9a8', '#fbe39b', '#f6d27a', '#f3c044', '#e9a93b', '#fff2c8', '#fbd77c', '#f0b44a', '#eebc5f']
    s = open(servier.arq(SV + 'General_items/Servier/glass-cold-drink.svg')).read()
    quentes = sorted(set(c for c in re.findall(r'#[0-9a-fA-F]{6}', s) if hls(c)[2] > .35 and .04 < hls(c)[0] < .17))
    rec = tingir(quentes, '#8cc8ec', sat=.62, dl=.04, lmin=.55)
    return sombra_chao(104, 196, 62, 7) + coloca(SV + 'General_items/Servier/glass-cold-drink.svg', 40, 2, alt=194, recolor=rec)[0]

def lingote(c, cx, cy, z, L, W, H, cor, yaw=0):
    o = c.add(Obj())
    M = rot_z(yaw)
    tp = .72
    P = [(-L / 2, -W / 2, 0), (L / 2, -W / 2, 0), (L / 2, W / 2, 0), (-L / 2, W / 2, 0),
         (-L / 2 * tp, -W / 2 * tp, H), (L / 2 * tp, -W / 2 * tp, H), (L / 2 * tp, W / 2 * tp, H), (-L / 2 * tp, W / 2 * tp, H)]
    P = [tuple(np.add(M(*p), (cx, cy, z))) for p in P]
    solido_convexo(o, P, cor, brilho=.75, amb=.28)
    return o

def Q02_5():   # ligacao metalica e ligas: lingotes de ouro (liga de ouro 18 k) e de cobre empilhados
    c = Cena(-30, 26, fundo_z=0, desfoque=2.6, op_sombra=.24)
    lingote(c, 0, .82, 0, 3.0, 1.4, .8, '#d0703c')
    lingote(c, 0, -.82, 0, 3.0, 1.4, .8, '#f3c234')
    lingote(c, 0, 0, .8, 3.0, 1.4, .8, '#b8862e', yaw=math.pi / 2)
    return c.render()

# ================================================================ Q03 Funcoes inorganicas e nox
def frasco_rotulo(x, y, alt, txt, liq, tampa, tam_txt=None):
    s = open(servier.arq(SV + 'Microbiology/Servier/bottle-medium-green.svg')).read()
    verdes = sorted(set(c for c in re.findall(r'#[0-9a-fA-F]{6}', s) if hls(c)[2] > .3 and .2 < hls(c)[0] < .45))
    rec = tingir(verdes, liq, sat=.25, dl=.36, lmin=.8)
    rec.update(tingir(['#e7e0e3', '#c0b0ba', '#9d869a'], tampa, sat=.7 if hls(tampa)[2] > .2 else 0, dl=-.12 if hls(tampa)[2] > .2 else -.02))
    g, (X, Y, w, h) = coloca(SV + 'Microbiology/Servier/bottle-medium-green.svg', x, y, alt=alt, recolor=rec)
    k = alt / 387.326
    cx, cy = x + (36 + 47) * k, y + (199 + 34) * k
    g += texto(txt, cx, cy, tam_txt or 26 * k, '#22262e')
    return g

def Q03_1():   # acidos e bases: frascos de reagente HCl (acido) e NaOH (base)
    out = sombra_chao(100, 196, 84, 7)
    out += frasco_rotulo(14, 30, 166, 'HCl', '#d8e9ef', '#d9302b', tam_txt=16)
    out += frasco_rotulo(100, 30, 166, 'NaOH', '#d8e9ef', '#2f62c9', tam_txt=13.5)
    return out

def cristal(cx, cy, s, cor, rot=0, seed=0):
    """cristal prismatico em 2D com 3 faces iluminadas (topo claro, frente media, lado escuro)"""
    rng = np.random.default_rng(seed)
    w, h, d = s * (1 + rng.random() * .4), s * (.55 + rng.random() * .3), s * .45
    t = f' transform="rotate({rot} {fmt(cx)} {fmt(cy)})"'
    frente = [(cx - w / 2, cy), (cx + w / 2, cy), (cx + w / 2, cy + h), (cx - w / 2, cy + h)]
    topo = [(cx - w / 2, cy), (cx - w / 2 + d * .8, cy - d * .55), (cx + w / 2 + d * .8, cy - d * .55), (cx + w / 2, cy)]
    lado = [(cx + w / 2, cy), (cx + w / 2 + d * .8, cy - d * .55), (cx + w / 2 + d * .8, cy + h - d * .55), (cx + w / 2, cy + h)]
    st = f' stroke="{mix(cor, "#000000", .45)}" stroke-width=".5" stroke-linejoin="round"'
    return (f'<g{t}><path d="{caminho(frente)}" fill="{cor}"{st}/><path d="{caminho(topo)}" fill="{mix(cor, "#ffffff", .45)}"{st}/>'
            f'<path d="{caminho(lado)}" fill="{mix(cor, "#000000", .3)}"{st}/>'
            f'<path d="M{fmt(cx-w/2+1)} {fmt(cy+1.2)} L{fmt(cx-w/2+1)} {fmt(cy+h-1)}" stroke="#fff" stroke-width=".9" opacity=".7"/></g>')

def Q03_2():   # sais: cristais azuis de sulfato de cobre (CuSO4.5H2O) no almofariz
    out = sombra_chao(102, 194, 80, 8)
    g, (x, y, w, h) = coloca(SV + 'Chemistry/Servier/mortar.svg', 20, 0, alt=194)
    out += g
    rng = np.random.default_rng(3)
    crs = []
    for i in range(16):
        crs.append((58 + rng.random() * 84, 112 + rng.random() * 16, 9 + rng.random() * 6, rng.random() * 50 - 25))
    crs.sort(key=lambda t: t[1])
    for i, (cx, cy, s, r) in enumerate(crs):
        out += cristal(cx, cy, s, '#1f78d1', r, seed=i)
    return out

def Q03_3():   # reacao de dupla troca: KI (incolor) + Pb(NO3)2 -> PbI2, o precipitado amarelo ("chuva de ouro")
    # (correcao da revisao de 29/10: um tubo fino e palido ocupava 1/6 da largura; agora dois tubos grossos — a solucao
    #  incolor de KI antes e o tubo onde a pipeta de Pasteur pinga o Pb(NO3)2 e o PbI2 amarelo se forma)
    rec = {'#ffefa6': '#f4f8fa', '#fee46e': '#eef4f7', '#ffc429': '#e2eaef', '#ff9400': '#cdd8df'}
    k = 190 / 366.236; cx0 = 86 + 28.8 * k; s_ = 124 / 190
    defs = ('<defs><radialGradient id="pp" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffd21a" stop-opacity=".95"/><stop offset=".7" stop-color="#f6c200" stop-opacity=".6"/><stop offset="1" stop-color="#f6c200" stop-opacity="0"/></radialGradient>'
            '<linearGradient id="pf" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#e0a800"/><stop offset=".35" stop-color="#ffd84a"/><stop offset="1" stop-color="#c98f00"/></linearGradient></defs>')
    def tubo(cxn, precip):
        g, _ = coloca(SV + 'Chemistry/Servier/testtube-yellow.svg', 86, 6, alt=190, recolor=rec)
        if precip:
            cx = cx0
            g += f'<ellipse cx="{fmt(cx)}" cy="128" rx="11" ry="17" fill="url(#pp)"/><ellipse cx="{fmt(cx+1)}" cy="152" rx="12" ry="19" fill="url(#pp)"/>'
            g += f'<path d="M{fmt(cx-13)} 166 L{fmt(cx+13)} 166 L{fmt(cx+13)} 176 A13 13 0 0 1 {fmt(cx-13)} 176Z" fill="url(#pf)"/>'
            rng = np.random.default_rng(2)
            for i in range(30):
                g += f'<circle cx="{fmt(cx + rng.normal(0, 5.5))}" cy="{fmt(104 + rng.random() * 62)}" r="{fmt(.7 + rng.random() * .8)}" fill="#f2b800"/>'
        return f'<g transform="translate({fmt(cxn)} 190) scale({fmt(1.95 * s_)} {fmt(s_)}) translate({fmt(-cx0)} -196)">{g}</g>'
    xl, xr = 70, 128
    out = sombra_chao(99, 191, 52, 5) + defs + tubo(xl, False) + tubo(xr, True)
    # pipeta de Pasteur de plastico vindo de cima, a direita, com a ponta sobre a boca do tubo da direita
    kp = 70 / 433.436
    pip, _ = coloca(SV + 'Chemistry/Servier/pipette-plastic.svg', 0, 0, alt=70)
    tx, ty = xr, 46
    out += f'<g transform="translate({fmt(tx)} {fmt(ty)}) rotate(46) translate({fmt(-22.6 * kp)} {fmt(-433 * kp)})">{pip}</g>'
    gx, gy = tx, 57
    out += (f'<path d="M{fmt(gx)} {fmt(gy - 6)} C{fmt(gx - 3.6)} {fmt(gy)} {fmt(gx - 3.6)} {fmt(gy + 3.6)} {fmt(gx)} {fmt(gy + 3.6)} C{fmt(gx + 3.6)} {fmt(gy + 3.6)} {fmt(gx + 3.6)} {fmt(gy)} {fmt(gx)} {fmt(gy - 6)}Z" fill="#e9f0f4" stroke="#6f8796" stroke-width=".7"/>'
            f'<ellipse cx="{fmt(gx - 1)}" cy="{fmt(gy + .8)}" rx=".8" ry="1.3" fill="#fff"/>')
    return out

def beq(x, y, alt, liq=None, sat=.55, dl=0., op_frente=None):
    rec = tingir(LIQ_BEQ, liq, sat=sat, dl=dl) if liq else None
    g, (X, Y, w, h) = coloca(SV + 'Chemistry/Servier/beaker-red.svg', x, y, alt=alt, recolor=rec)
    return g, (X, Y, w, h)

def Q03_4():   # oxirreducao: placa de zinco em CuSO4 — o cobre se deposita (Cu2+ reduz) e o zinco se oxida
    out = sombra_chao(100, 194, 66, 7)
    g, (x, y, w, h) = beq(28, 54, 140, liq='#2c84d6', sat=.62, dl=.02)
    k = 140 / 204.359
    out += '<defs>' + grad_lin('zn', [(0, '#8d949c'), (.3, '#e4e8ec'), (.55, '#b6bcc3'), (1, '#6f767e')], 0, 0, 1, 0) + grad_lin('cu', [(0, '#7a3518'), (.4, '#c0622f'), (1, '#6b2c12')], 0, 0, 1, 0) + '</defs>'
    out += g
    pl = '<g transform="rotate(-8 100 110)">'
    pl += '<rect x="88" y="22" width="26" height="152" rx="1.5" fill="url(#zn)" stroke="#5c636a" stroke-width=".8"/>'
    rng = np.random.default_rng(4)
    d = 'M88 118 '
    for yy in np.arange(118, 172, 3): d += f'L{fmt(87 + rng.random()*2.5)} {fmt(yy)} '
    d += 'L88 174 L114 174 '
    for yy in np.arange(172, 116, -3): d += f'L{fmt(114 + rng.random()*2.5)} {fmt(yy)} '
    d += 'Z'
    out_cu = f'<path d="{d}" fill="url(#cu)"/>'
    for i in range(70):
        out_cu += f'<circle cx="{fmt(88 + rng.random()*26)}" cy="{fmt(119 + rng.random()*54)}" r="{fmt(.6 + rng.random()*1.3)}" fill="{["#a24a20", "#d27a42", "#5e260f"][i % 3]}"/>'
    pl += out_cu + '<rect x="90" y="24" width="3" height="90" fill="#fff" opacity=".6"/></g>'
    out += pl
    g2, _ = beq(28, 54, 140, liq='#2c84d6', sat=.62, dl=.02)
    out += f'<g opacity=".42">{g2}</g>'
    return out

def Q03_5():   # separacao de misturas: funil de separacao com duas fases (oleo em cima, agua embaixo)
    out = sombra_chao(102, 196, 30, 5)
    g, (x, y, w, h) = coloca(SV + 'Chemistry/Servier/separating-funnel.svg', 66, 2, alt=194)
    esq = [(86, 20), (83, 30), (77, 38), (71, 47), (68.5, 57), (70, 67), (75.5, 78), (82, 88), (84.5, 97), (85.5, 160)]
    cont = esq + [(182 - x_, y_) for x_, y_ in esq[::-1]]
    d = caminho(cont)
    liq = ('<defs><clipPath id="fo"><rect x="0" y="40" width="200" height="22"/></clipPath><clipPath id="fa"><rect x="0" y="62" width="200" height="100"/></clipPath>'
           + grad_lin('lo', [(0, '#e9b52a'), (.5, '#ffe07a'), (1, '#c98f12')], 0, 0, 1, 0) + grad_lin('la', [(0, '#3d8fd6'), (.5, '#8fd0f2'), (1, '#2e74b8')], 0, 0, 1, 0) + '</defs>'
           f'<path d="{d}" fill="url(#lo)" clip-path="url(#fo)" opacity=".9"/><path d="{d}" fill="url(#la)" clip-path="url(#fa)" opacity=".85"/>'
           '<path d="M71 62 L111 62" stroke="#f6f0d0" stroke-width="1.2"/><ellipse cx="91" cy="40" rx="15.5" ry="2.2" fill="#ffe99a" stroke="#c99a1a" stroke-width=".5"/>')
    return out + g + liq + f'<g opacity=".35">{coloca(SV + "Chemistry/Servier/separating-funnel.svg", 66, 2, alt=194)[0]}</g>'

# ================================================================ Q04 Mol e estequiometria
def Q04_1():   # mol e constante de Avogadro: pilha de atomos identicos (contar particulas pela massa)
    c = Cena(-26, 24, fundo_z=0, desfoque=2.6, op_sombra=.22)
    o = c.add(Obj())
    r = .5
    camadas = 4
    for L in range(camadas):
        n = camadas - L
        z = r + L * r * 2 * math.sqrt(2 / 3)
        for i in range(n):
            for j in range(n - i):
                x = (i + j * .5) * 2 * r + L * r; y = j * 2 * r * math.sqrt(3) / 2 + L * r * math.sqrt(3) / 3
                o.esfera((x, y, z), r * .98, '#4a505d')
    return c.render()

def Q04_2():   # formula percentual: grafico de pizza 3D da glicose C6H12O6 em massa — C 40,0 %, H 6,7 %, O 53,3 %
    c = Cena(-10, 40, fundo_z=0, desfoque=2.6, op_sombra=.22)
    fat = [('C', 40.0, '#3c414d'), ('H', 6.7, '#e3e6ec'), ('O', 53.3, '#e23b48')]
    a0 = 90.0; R = 2.0; Hh = .55
    for el, p, cor in fat:
        a1 = a0 - p * 3.6
        meio = math.radians((a0 + a1) / 2); ex = .14
        dx, dy = ex * math.cos(meio), ex * math.sin(meio)
        partes = [(a0, a1)] if p < 50 else [(a0, (a0 + a1) / 2), ((a0 + a1) / 2, a1)]
        for b0, b1 in partes:
            o = c.add(Obj())
            P = [(dx, dy, 0), (dx, dy, Hh)]
            for t in np.linspace(b0, b1, max(3, int(abs(b1 - b0) / 6))):
                q = math.radians(t)
                P += [(dx + R * math.cos(q), dy + R * math.sin(q), 0), (dx + R * math.cos(q), dy + R * math.sin(q), Hh)]
            solido_convexo(o, P, cor, brilho=.45, amb=.32)
            if len(partes) == 2:
                m = math.radians(partes[0][1])
                o.faces = [f for f in o.faces if not all(abs((q[0] - dx) * math.sin(m) - (q[1] - dy) * math.cos(m)) < 1e-6 for q in f[0])]
        a0 = a1
    return c.render()

def Q04_3():   # calculo estequiometrico: 2 H2 + O2 -> 2 H2O (proporcao em mols entre as moleculas)
    cpk = dict(CPK); cpk['H'] = ('#eceef2', .36); cpk['O'] = ('#e23b48', .56)
    at = []; lg = []
    def add(lst, ligs, off):
        b = len(at)
        for e, p in lst: at.append((e, tuple(np.add(p, off))))
        for i, j, o in ligs: lg.append((b + i, b + j, o))
    h2 = [('H', (-.37, 0, 0)), ('H', (.37, 0, 0))]
    o2 = [('O', (-.6, 0, 0)), ('O', (.6, 0, 0))]
    a = math.radians(104.5) / 2; d = .96
    w = [('O', (0, 0, 0)), ('H', (d * math.sin(a), 0, -d * math.cos(a))), ('H', (-d * math.sin(a), 0, -d * math.cos(a)))]
    add(h2, [(0, 1, 1)], (-3.6, 0, 1.0)); add(h2, [(0, 1, 1)], (-3.6, 0, -.3)); add(o2, [(0, 1, 2)], (-3.6, 0, -1.6))
    add(w, [(0, 1, 1), (0, 2, 1)], (2.7, 0, .75)); add(w, [(0, 1, 1), (0, 2, 1)], (2.7, 0, -1.1))
    c = bb(at, lg, az=-8, el=12, escala_lig=.19, cpk=cpk)
    def sx(cam):
        (x1, y1), (x2, y2) = cam.P(-1.75, 0, -.25), cam.P(.95, 0, -.25)
        return [(-50, seta(x1, y1, x2, y2, '#e0862a', w=.32 * cam.k))]
    sx.ordem = 5
    s = c.add(Obj(sombra=False)); s.prof = -1e5; s.cru.append((sx, []))
    return c.render()

def Q04_4():   # rendimento e pureza: filtracao a vacuo — funil de Buchner de porcelana sobre o kitassato, produto solido retido
    # (correcao da revisao de 29/10: antes era um funil de vidro de placa porosa e o conjunto era palido; agora o Buchner
    #  e de porcelana branca, largo e baixo, com papel de filtro e o solido, encaixado na rolha, e a mangueira de vacuo)
    out = sombra_chao(104, 196, 56, 6)
    g1, (x, y, w, h) = coloca(SV + 'Chemistry/Servier/vacuum-flask.svg', 52, 78, alt=118)
    cx = 82.5
    d = '<defs>' + grad_lin('rl', [(0, '#3d4147'), (.35, '#7d838b'), (1, '#2a2d32')], 0, 0, 1, 0)
    d += grad_lin('pc', [(0, '#b9bec4'), (.18, '#f4f5f6'), (.45, '#ffffff'), (.8, '#e3e6e9'), (1, '#9aa1a8')], 0, 0, 1, 0)
    d += grad_lin('pci', [(0, '#c9ced3'), (1, '#eef0f2')], 0, 0, 0, 1)
    d += grad_lin('mg', [(0, '#7a2a12'), (.4, '#c4572e'), (1, '#6a220e')], 0, 0, 0, 1)
    d += grad_lin('so', [(0, '#fff7cf'), (1, '#e9d27a')], 0, 0, 0, 1) + '</defs>'
    rolha = (f'<path d="M{cx-11.5} 76 L{cx+11.5} 76 L{cx+9.5} 92 L{cx-9.5} 92Z" fill="url(#rl)" stroke="#1d1f23" stroke-width=".7"/>'
             f'<ellipse cx="{cx}" cy="76" rx="11.5" ry="2.4" fill="#8d939b" stroke="#1d1f23" stroke-width=".6"/>')
    # funil de Buchner: copo de porcelana largo e baixo + haste que atravessa a rolha
    R, yt, yb = 33, 30, 60
    haste = f'<path d="M{cx-4} 70 L{cx+4} 70 L{cx+3} 98 L{cx-3} 98Z" fill="url(#pc)" stroke="#6c737b" stroke-width=".8"/>'
    copo = (f'<path d="M{cx-R} {yt} L{cx-R} {yb} Q{cx-R} {yb+8} {cx-R+8} {yb+9} L{cx-6} {yb+11} L{cx-4} 72 L{cx+4} 72 L{cx+6} {yb+11} '
            f'L{cx+R-8} {yb+9} Q{cx+R} {yb+8} {cx+R} {yb} L{cx+R} {yt}Z" fill="url(#pc)" stroke="#5f666e" stroke-width="1"/>')
    boca = f'<ellipse cx="{cx}" cy="{yt}" rx="{R}" ry="7" fill="url(#pci)" stroke="#5f666e" stroke-width="1"/>'
    borda = f'<ellipse cx="{cx}" cy="{yt}" rx="{R-3}" ry="5.6" fill="none" stroke="#ffffff" stroke-width="1.2" opacity=".9"/>'
    # papel de filtro e o bolo de solido (amarelo-claro) por cima
    papel = f'<ellipse cx="{cx}" cy="{yt+1.5}" rx="{R-5}" ry="5" fill="#fbfbf7" stroke="#b9bdb0" stroke-width=".6"/>'
    bolo = (f'<path d="M{cx-R+8} {yt+1.2} Q{cx-10} {yt-7} {cx+2} {yt-5.5} Q{cx+16} {yt-7.5} {cx+R-8} {yt+1.2} Q{cx} {yt+5.8} {cx-R+8} {yt+1.2}Z" fill="url(#so)" stroke="#b39a3c" stroke-width=".7"/>')
    rng = np.random.default_rng(5)
    for i in range(18):
        px_, py_ = cx + rng.uniform(-18, 18), yt + rng.uniform(-4.5, 1.5)
        bolo += f'<circle cx="{fmt(px_)}" cy="{fmt(py_)}" r="{fmt(.6 + rng.random() * .6)}" fill="#c9ad45" opacity=".8"/>'
    reflexo = f'<rect x="{cx-R+4}" y="{yt+6}" width="4" height="{yb-yt-2}" rx="2" fill="#fff" opacity=".9"/>'
    # mangueira de vacuo saindo da saida lateral do kitassato
    mx, my = 110, 116
    mang = f'<path d="M{mx} {my} C{mx+18} {my} {mx+22} {my+16} {mx+24} {my+30} C{mx+26} {my+48} {mx+30} {my+64} {mx+40} {my+72}" fill="none" stroke="#5a1c0b" stroke-width="7.4" stroke-linecap="round"/>'
    mang += f'<path d="M{mx} {my} C{mx+18} {my} {mx+22} {my+16} {mx+24} {my+30} C{mx+26} {my+48} {mx+30} {my+64} {mx+40} {my+72}" fill="none" stroke="#c4572e" stroke-width="5.4" stroke-linecap="round"/>'
    mang += f'<path d="M{mx} {my-1.4} C{mx+16} {my-1.4} {mx+20.6} {my+14} {mx+24.6} {my+38}" fill="none" stroke="#f0a07c" stroke-width="1.2" stroke-linecap="round" opacity=".8"/>'
    return out + d + mang + g1 + haste + rolha + copo + boca + borda + papel + bolo + reflexo

def Q04_5():   # leis ponderais (Lavoisier): balanca de dois pratos em equilibrio
    return sombra_chao(100, 194, 66, 6) + coloca(SV + 'General_items/Servier/scale-balanced.svg', 14, 0, alt=194, tirar={41, 42, 43, 52, 53, 54, 55, 57})[0]

# ================================================================ Q05 Solucoes
REC_PROV = None
def Q05_1():   # densidade: densimetro flutuando na proveta
    # (correcao da revisao de 29/10: proveta fina e densimetro quase invisivel a 64 px; agora a proveta e larga
    #  (escala 1,9x na horizontal), o densimetro e grande, com escala e lastro, e o liquido mais saturado)
    s_ = open(servier.arq(SV + 'Chemistry/Servier/measuringcylinder-blue.svg')).read()
    azuis = sorted(set(c for c in re.findall(r'#[0-9a-fA-F]{6}', s_) if hls(c)[2] > .25 and .58 < hls(c)[0] < .7))
    rec = tingir(azuis, '#2f8fd6', sat=.72, dl=.02, lmin=.42)
    cx = 99; L = 1.9
    larga = lambda g: f'<g transform="translate({cx} 0) scale({L} 1) translate({-cx} 0)">{g}</g>'
    out = sombra_chao(100, 196, 50, 6)
    g, (x, y, w, h) = coloca(SV + 'Chemistry/Servier/measuringcylinder-blue.svg', 72, 2, alt=194, recolor=rec)
    out += larga(g)
    dm = '<defs>' + VIDRO + grad_rad('lastro', [(0, '#ffffff'), (.3, '#c9ced6'), (1, '#3c424a')], .35, .3, .7) + '</defs>'
    hs = 5.6   # meia-largura da haste
    dm += f'<rect x="{fmt(cx-hs)}" y="14" width="{fmt(2*hs)}" height="100" rx="{fmt(hs)}" fill="url(#vt)" stroke="#4f5f6a" stroke-width=".9"/>'
    dm += f'<rect x="{fmt(cx-hs+1.4)}" y="22" width="{fmt(2*hs-2.8)}" height="72" fill="#fff3c8" stroke="#a8955a" stroke-width=".5"/>'
    for i in range(13):
        yy = 25 + i * 5.4
        dm += f'<line x1="{fmt(cx-hs+1.4)}" y1="{fmt(yy)}" x2="{fmt(cx+(2.6 if i % 2 else -.6))}" y2="{fmt(yy)}" stroke="#2b3540" stroke-width="{.9 if i % 2 == 0 else .6}"/>'
    dm += f'<path d="M{fmt(cx-hs)} 110 C{fmt(cx-16)} 118 {fmt(cx-16)} 150 {fmt(cx-14)} 160 C{fmt(cx-10)} 174 {fmt(cx+10)} 174 {fmt(cx+14)} 160 C{fmt(cx+16)} 150 {fmt(cx+16)} 118 {fmt(cx+hs)} 110Z" fill="url(#vt)" stroke="#4f5f6a" stroke-width="1"/>'
    dm += f'<ellipse cx="{fmt(cx)}" cy="162" rx="11" ry="9" fill="url(#lastro)"/>'
    dm += f'<rect x="{fmt(cx-12)}" y="122" width="3.4" height="30" rx="1.7" fill="#fff" opacity=".85"/>'
    out += dm
    g2, _ = coloca(SV + 'Chemistry/Servier/measuringcylinder-blue.svg', 72, 2, alt=194, recolor=rec)
    out += f'<g opacity=".3">{larga(g2)}</g>'
    return out

def Q05_2():   # preparo de solucao: balao volumetrico aferido — a solucao (KMnO4, violeta) com o menisco na marca do gargalo
    # (correcao da revisao de 29/10: antes era mais um bequer azul, igual ao Q05.3 e ao Q05.5; o balao volumetrico e a
    #  vidraria propria do preparo de solucao de concentracao conhecida; violeta, e nao azul, para nao repetir o
    #  balao azul do icone do modulo Q05)
    verdes = {'#85c61a': '#6a1f8f', '#a9d959': '#8a34b0', '#a9da5a': '#8a34b0', '#bbe278': '#9440b8', '#d2eda3': '#9a48bd', '#dbf1b2': '#a253c4'}
    X0, Y0, alt = 66, 4, 192
    k = alt / 395.074
    out = sombra_chao(100, 196, 42, 6)
    g, _ = coloca(SV + 'Chemistry/Servier/flask-green.svg', X0, Y0, alt=alt, recolor=verdes)
    out += g
    P = lambda u, v: (X0 + u * k, Y0 + v * k)
    xa, _ = P(55.4, 0); xb, _ = P(85.1, 0); _, ym = P(0, 112); _, yf = P(0, 226)
    out += '<defs>' + grad_lin('cs', [(0, '#6a1f8f'), (.35, '#a95bd0'), (1, '#5a1a7a')], 0, 0, 1, 0) + '</defs>'
    # coluna de solucao no gargalo, com o menisco concavo cuja base toca a marca de aferição
    out += f'<path d="M{fmt(xa)} {fmt(ym - 2.2)} Q{fmt((xa + xb) / 2)} {fmt(ym + 2.4)} {fmt(xb)} {fmt(ym - 2.2)} L{fmt(xb)} {fmt(yf)} L{fmt(xa)} {fmt(yf)}Z" fill="url(#cs)" opacity=".9"/>'
    out += f'<path d="M{fmt(xa)} {fmt(ym - 2.2)} Q{fmt((xa + xb) / 2)} {fmt(ym + 2.4)} {fmt(xb)} {fmt(ym - 2.2)}" fill="none" stroke="#3a0d52" stroke-width=".8"/>'
    # marca de aferição: anel gravado no gargalo
    out += f'<ellipse cx="{fmt((xa + xb) / 2)}" cy="{fmt(ym)}" rx="{fmt((xb - xa) / 2 + .6)}" ry="1.6" fill="none" stroke="#1d2730" stroke-width="1.1"/>'
    out += f'<rect x="{fmt(xa + 1.4)}" y="{fmt(ym + 6)}" width="1.6" height="{fmt(yf - ym - 10)}" rx=".8" fill="#fff" opacity=".7"/>'
    # balao um pouco mais largo (x1,3) para ler a 64 px
    return f'<g transform="translate(100 0) scale(1.3 1) translate(-100 0)">{out}</g>'

def pisseta(bx, by, ang, esc=1.0, agua=.45):
    """pisseta de plastico (polietileno leitoso), tampa de rosca azul e tubo com bico curto em gancho; desenhada de pe
    com a base em (0, 0) e girada ang graus em torno da base. devolve (svg, ponta do bico em coordenadas de trabalho)"""
    body = 'M-23 -7 Q-23 0 -16 0 H16 Q23 0 23 -7 V-56 Q23 -69 8 -73 V-79 H-8 V-73 Q-23 -69 -23 -56Z'
    defs = ('<defs>' + grad_lin('psb', [(0, '#cfd8de'), (.22, '#f7f9fa'), (.5, '#ffffff'), (.8, '#e3e9ed'), (1, '#b3c0c9')], 0, 0, 1, 0)
            + grad_lin('psa', [(0, '#5aa7e6'), (.3, '#8cc8f2'), (1, '#3f8ccc')], 0, 0, 1, 0)
            + grad_lin('pst', [(0, '#1d5fa6'), (.3, '#4f98e0'), (.6, '#2f74c0'), (1, '#173f73')], 0, 0, 1, 0) + '</defs>')
    t = f'translate({fmt(bx)} {fmt(by)}) rotate({fmt(ang)}) scale({fmt(esc)})'
    out = defs + f'<g transform="{t}"><clipPath id="psc"><path d="{body}"/></clipPath>'
    out += f'<path d="{body}" fill="url(#psb)" stroke="#6f808c" stroke-width="1"/>'
    # agua dentro: nivel horizontal no mundo (o retangulo e girado de volta)
    out += f'<g clip-path="url(#psc)" opacity=".75"><g transform="rotate({fmt(-ang)})"><rect x="-30" y="{fmt(-80 * agua)}" width="90" height="{fmt(80 * agua + 16)}" fill="url(#psa)"/></g></g>'
    out += '<rect x="-18" y="-60" width="5" height="50" rx="2.5" fill="#fff" opacity=".85"/>'
    # tampa de rosca com estrias
    out += '<rect x="-11" y="-92" width="22" height="14" rx="2" fill="url(#pst)" stroke="#123760" stroke-width=".8"/>'
    for x in range(-8, 10, 3): out += f'<line x1="{x}" y1="-90.5" x2="{x}" y2="-79.5" stroke="#123760" stroke-width=".5" opacity=".6"/>'
    # tubo: sobe da tampa e faz o gancho curto para baixo, terminando no bico afinado
    tubo = 'M0 -92 V-101 C0 -109 7 -112 12 -108 L17 -99.5'
    out += f'<path d="{tubo}" fill="none" stroke="#6f808c" stroke-width="5" stroke-linecap="butt" stroke-linejoin="round"/>'
    out += f'<path d="{tubo}" fill="none" stroke="#eef3f6" stroke-width="3.4" stroke-linecap="butt" stroke-linejoin="round"/>'
    out += '<path d="M-.8 -94 V-101 C-.8 -107 4 -110.5 8.5 -109.5" fill="none" stroke="#fff" stroke-width="1" stroke-linecap="round"/>'
    # bico afinado
    out += '<path d="M15 -98.2 L19 -100.8 L22.6 -94.6 L21.4 -93.9Z" fill="#dfe6ea" stroke="#6f808c" stroke-width=".8" stroke-linejoin="round"/>'
    out += '</g>'
    a = math.radians(ang); tx, ty = 22.2 * esc, -94 * esc
    return out, (bx + tx * math.cos(a) - ty * math.sin(a), by + tx * math.sin(a) + ty * math.cos(a))

def Q05_3():   # diluicao: pisseta inclinada sobre o bequer, o filete de agua caindo por cima da solucao
    # (correcao da revisao de 29/10: antes o frasco tinha uma mangueira longa mergulhada no bequer, que lia como sifao)
    out = sombra_chao(98, 196, 86, 7)
    b, _ = beq(92, 88, 106, liq='#e0607e', sat=.55, dl=.12)
    p, (px, py) = pisseta(36, 142, 38, esc=1.0)
    # filete: sai do bico e cai quase na vertical ate a superficie (y ~ 133), com respingos e ondinhas
    sx, sy = px, py; ex, ey = px + 6, 133
    q = f'M{fmt(sx)} {fmt(sy)} Q{fmt(sx + 5)} {fmt(sy + 8)} {fmt(ex)} {fmt(ey)}'
    jato = (f'<path d="{q}" fill="none" stroke="#3f95d6" stroke-width="3.2" stroke-linecap="round"/>'
            f'<path d="{q}" fill="none" stroke="#bfe3fb" stroke-width="1.3" stroke-linecap="round"/>')
    jato += f'<ellipse cx="{fmt(ex)}" cy="{fmt(ey + 1)}" rx="9" ry="2.2" fill="none" stroke="#fff" stroke-width="1.1" opacity=".9"/>'
    jato += f'<ellipse cx="{fmt(ex)}" cy="{fmt(ey + 1)}" rx="15" ry="3.4" fill="none" stroke="#fff" stroke-width=".8" opacity=".6"/>'
    for dx_, dy_ in ((-5, -5), (5, -6), (8, -3)):
        jato += f'<circle cx="{fmt(ex + dx_)}" cy="{fmt(ey + dy_)}" r="1.2" fill="#9ed2f4" stroke="#3f95d6" stroke-width=".4"/>'
    return out + b + jato + p

def Q05_4():   # titulo e porcentagem: frasco de alcool 70 % (m/m) — 70 g de etanol em 100 g de solucao
    out = sombra_chao(100, 196, 50, 6)
    out += frasco_rotulo(54, 6, 190, '70%', '#d8e9ef', '#f0f0f0', tam_txt=20)
    return out

def Q05_5():   # solubilidade e saturacao: solucao saturada com corpo de fundo (cristais que nao dissolvem)
    out = sombra_chao(100, 194, 66, 7)
    g, _ = beq(28, 54, 140, liq='#9fd2ee', sat=.5, dl=.12)
    out += g
    rng = np.random.default_rng(7)
    crs = [(52 + rng.random() * 66, 180 + rng.random() * 5 - 7 * math.exp(-((rng.random() - .5) * 3) ** 2), 5 + rng.random() * 4, rng.random() * 60 - 30) for _ in range(26)]
    crs.sort(key=lambda t: t[1])
    for i, (cx, cy, s, r) in enumerate(crs): out += cristal(cx, cy - 8, s, '#f4f7fa', r, seed=i + 40)
    g2, _ = beq(28, 54, 140, liq='#9fd2ee', sat=.5, dl=.12)
    out += f'<g opacity=".3">{g2}</g>'
    return out

# ================================================================ Q06 Gases
def Q06_1():   # transformacoes gasosas: cilindro de vidro com embolo e peso comprimindo o gas
    d = '<defs>' + VIDRO + grad_lin('emb', [(0, '#6f777f'), (.35, '#e9edf0'), (.6, '#aab2ba'), (1, '#596168')], 0, 0, 1, 0) + grad_lin('pes', [(0, '#3a3f47'), (.35, '#8a919b'), (1, '#24282e')], 0, 0, 1, 0) + esf('gp', '#3a78e0') + '</defs>'
    out = d + sombra_chao(100, 194, 50, 6)
    x0, x1, y0, y1 = 64, 136, 40, 186
    out += f'<rect x="{x0}" y="{y0}" width="{x1-x0}" height="{y1-y0}" rx="5" fill="url(#vt)" opacity=".55" stroke="#8fa0ab" stroke-width="1"/>'
    out += f'<ellipse cx="100" cy="{y1}" rx="36" ry="7" fill="#c7d2d9" stroke="#8fa0ab" stroke-width="1"/>'
    rng = np.random.default_rng(3)
    for i in range(14):
        out += bola(70 + 6 + rng.random() * 48, 110 + rng.random() * 66, 4.2, 'gp')
    # embolo
    out += f'<rect x="{x0+2}" y="92" width="{x1-x0-4}" height="14" fill="url(#emb)" stroke="#4d545b" stroke-width=".8"/>'
    out += f'<ellipse cx="100" cy="92" rx="{(x1-x0-4)/2}" ry="6" fill="#d7dde2" stroke="#4d545b" stroke-width=".8"/>'
    out += f'<rect x="95" y="58" width="10" height="34" fill="url(#emb)" stroke="#4d545b" stroke-width=".6"/>'
    # peso
    out += f'<path d="M78 34 L122 34 L118 58 L82 58Z" fill="url(#pes)" stroke="#1d2126" stroke-width=".8"/><ellipse cx="100" cy="34" rx="22" ry="5" fill="#9aa1aa" stroke="#1d2126" stroke-width=".8"/>'
    out += f'<path d="M93 30 Q100 18 107 30" fill="none" stroke="#3a3f47" stroke-width="3.2"/>'
    out += f'<rect x="{x0+3}" y="{y0+6}" width="5" height="{y1-y0-12}" rx="2.5" fill="#fff" opacity=".7"/>'
    out += f'<rect x="{x0}" y="{y0}" width="{x1-x0}" height="{y1-y0}" rx="5" fill="none" stroke="#8fa0ab" stroke-width="1"/>'
    return out

def Q06_2():   # volume molar: o cubo de 22,4 L (1 mol de gas ideal nas CNTP)
    c = Cena(-30, 24, fundo_z=0, desfoque=2.6, op_sombra=.18)
    s = 2.82
    o = c.add(Obj())
    V = [(x, y, z) for x in (0, s) for y in (0, s) for z in (0, s)]
    rng = np.random.default_rng(11)
    gas = c.add(Obj(sombra=False)); gas.prof = .5
    for i in range(16): gas.esfera(tuple(rng.random(3) * (s - .5) + .25), .13, '#3a78e0')
    vid = c.add(Obj(sombra=True)); vid.prof = 0
    caixa(vid, 0, s, 0, s, 0, s, '#bfe3f5', opac=.22, dupla=True, contorno='#7fb0cc', sw=.8, plana=True)
    c.objs.remove(o)
    def rot(cam):
        f = lambda u, v: cam.P(s * .5 + u * .96, -0.001, s * .5 + v * .96)
        return [(0, f'<path d="{texto_path("22,4 L", f, .62, SANS)}" fill="#1e5b86"/>')]
    rot.ordem = 9
    t = c.add(Obj(sombra=False)); t.prof = -1e5; t.cru.append((rot, []))
    return c.render()

def Q06_3():   # difusao (lei de Graham): NH3 e HCl num tubo — o anel branco de NH4Cl forma-se mais perto do HCl (gas mais pesado)
    d = '<defs>' + grad_lin('vh', [(0, '#a9b6bf'), (.3, '#ffffff'), (.7, '#e8eef2'), (1, '#9fb0bb')], 0, 0, 0, 1) + grad_rad('alg', [(0, '#ffffff'), (.7, '#eef0f2'), (1, '#c3c8ce')], .4, .35, .7) + '</defs>'
    out = d + sombra_chao(100, 140, 90, 6)
    x0, x1, yc, r = 14, 186, 104, 19
    out += f'<rect x="{x0}" y="{yc-r}" width="{x1-x0}" height="{2*r}" rx="4" fill="url(#vh)" stroke="#8fa0ab" stroke-width=".9"/>'
    xr = x0 + 8 + (x1 - x0 - 16) * .595
    out += f'<rect x="{fmt(xr-5)}" y="{yc-r+1.5}" width="10" height="{2*r-3}" rx="3" fill="#fbfbfb" stroke="#d5d9de" stroke-width=".5"/>'
    out += f'<rect x="{fmt(xr-8)}" y="{yc-r+1.5}" width="16" height="{2*r-3}" rx="5" fill="#ffffff" opacity=".55"/>'
    for x in (x0 + 1, x1 - 19):
        for j in range(5):
            out += f'<circle cx="{fmt(x + 3 + j*3.2)}" cy="{fmt(yc + (j%2)*6 - 3)}" r="10" fill="url(#alg)"/>'
    out += f'<rect x="{x0+4}" y="{yc-r+3}" width="{x1-x0-8}" height="3" rx="1.5" fill="#fff" opacity=".85"/>'
    out += texto('NH₃', 36, 66, 22, '#2f6fd0') + texto('HCl', 162, 66, 22, '#2e9a3c')
    return out

# ================================================================ Q07 Termoquimica
def Q07_1():   # calorimetro de copo de isopor com tampa, termometro e agitador
    c = Cena(-20, 26, fundo_z=0, desfoque=2.6, op_sombra=.22)
    o = c.add(Obj())
    cilindro_liso(o, (0, 0, 0), (0, 0, 2.3), .95, 1.25, cor='#f1f1ec', brilho=.2, amb=.45, tampa_cor='#e7e7e1')
    o2 = c.add(Obj(sombra=False))
    cilindro_liso(o2, (0, 0, 2.3), (0, 0, .16), 1.32, 1.32, cor='#e3e3dc', brilho=.2, amb=.45, tampa_cor='#f4f4ef')
    o2.prof = -2
    def termo(cam):
        out = []
        (xa, ya), (xb, yb) = cam.P(.25, 0, 2.4), cam.P(.4, 0, 4.6)
        out.append((0, f'<line x1="{fmt(xa)}" y1="{fmt(ya)}" x2="{fmt(xb)}" y2="{fmt(yb)}" stroke="#8fa0ab" stroke-width="{fmt(.24*cam.k)}" stroke-linecap="round"/>'
                       f'<line x1="{fmt(xa)}" y1="{fmt(ya)}" x2="{fmt(xb)}" y2="{fmt(yb)}" stroke="#f4f7f9" stroke-width="{fmt(.19*cam.k)}" stroke-linecap="round"/>'
                       f'<line x1="{fmt(xa)}" y1="{fmt(ya)}" x2="{fmt(xa+(xb-xa)*.55)}" y2="{fmt(ya+(yb-ya)*.55)}" stroke="#d9302b" stroke-width="{fmt(.06*cam.k)}"/>'))
        (xc, yc), (xd, yd) = cam.P(-.45, .1, 2.4), cam.P(-.6, .1, 4.0)
        out.append((0, f'<line x1="{fmt(xc)}" y1="{fmt(yc)}" x2="{fmt(xd)}" y2="{fmt(yd)}" stroke="#7d858e" stroke-width="{fmt(.09*cam.k)}" stroke-linecap="round"/>'
                       f'<circle cx="{fmt(xd)}" cy="{fmt(yd)}" r="{fmt(.13*cam.k)}" fill="none" stroke="#7d858e" stroke-width="{fmt(.07*cam.k)}"/>'))
        return out
    termo.ordem = 9
    t = c.add(Obj(sombra=False)); t.prof = -1e5; t.cru.append((termo, [(.4, 0, 4.6), (-.6, .1, 4.1)]))
    return c.render()

def Q07_2():   # lei de Hess: a variacao de entalpia nao depende do caminho — escada em etapas x seta direta
    c = Cena(-28, 22, fundo_z=0, desfoque=2.6, op_sombra=.2)
    alturas = [3.0, 2.2, 1.0, .35]
    cores = ['#5c8fd8', '#6f9de0', '#86afe6', '#9fc0ec']
    for i, h in enumerate(alturas):
        o = c.add(Obj())
        caixa(o, i * 1.1, i * 1.1 + 1.1, 0, 1.3, 0, h, cores[i], brilho=.25)
    def sx(cam):
        (x1, y1) = cam.P(.75, .65, 3.55); (x2, y2) = cam.P(3.95, .65, 1.05)
        return [(0, seta(x1, y1, x2, y2, '#e0862a', w=.3 * cam.k))]
    sx.ordem = 9
    t = c.add(Obj(sombra=False)); t.prof = -1e5; t.cru.append((sx, [(.5, .6, 3.9)]))
    return c.render()

def Q07_3():   # combustiveis e poder calorifico: botijao de gas (GLP, propano + butano)
    c = Cena(-20, 18, fundo_z=0, desfoque=2.6, op_sombra=.24)
    o = c.add(Obj())
    az = '#2f63b8'
    cilindro_liso(o, (0, 0, 0), (0, 0, .45), 1.1, 1.1, cor='#2a3f66', brilho=.3, amb=.35, ordem=0)
    cilindro_liso(o, (0, 0, .35), (0, 0, 2.2), 1.3, 1.3, cor=az, brilho=.65, amb=.33, ordem=1)
    dome = [(1.3 * math.cos(t) * math.cos(f), 1.3 * math.cos(t) * math.sin(f), 2.55 + .8 * math.sin(t)) for t in np.linspace(0, math.pi / 2, 10) for f in np.linspace(0, 2 * math.pi, 36, endpoint=False)]
    o.extra_pts += dome
    def domo(cam):
        P2 = np.array([cam.P(*p) for p in dome]); h = ConvexHull(P2); cont = P2[h.vertices]
        x0, y0 = cam.P(0, 0, 2.55)
        return [(0, f'<path d="{caminho(cont)}" fill="url(#dm)"/>'
                    f'<path d="{caminho([cam.P(1.3*math.cos(f), 1.3*math.sin(f), 2.55) for f in np.linspace(math.pi, 2*math.pi, 30)])[:-1]}" fill="none" stroke="#1d3f7a" stroke-width=".9" opacity=".6"/>')]
    domo.ordem = 5
    o.cru.append((domo, []))
    c.defs.append(grad_rad('dm', [(0, '#c9dbf6'), (.25, '#5f8fd8'), (.7, az), (1, '#1d3f7a')], .32, .3, .8))
    cilindro_liso(o, (0, 0, 3.2), (0, 0, .35), .22, .2, cor='#c9a13a', brilho=.7, ordem=20)
    def alca(cam):
        out = []
        for lado in (-1, 1):
            pts = [(lado * (.55 + .2 * math.sin(t)), 0, 3.0 + .75 * math.sin(t)) for t in np.linspace(0, math.pi, 2)]
        P = [(.75 * math.cos(t), .75 * math.sin(t) * .15, 3.05 + .55 * abs(math.sin(t)) ** .3) for t in np.linspace(.05, math.pi - .05, 25)]
        out.append((0, tubo_liso(cam, P, .08 * cam.k, '#2a3f66')))
        return out
    alca.ordem = 22
    o.cru.append((alca, [(.8, 0, 3.7), (-.8, 0, 3.7)]))
    return c.render()

# ================================================================ Q08 Cinetica, equilibrio e pH
def Q08_1():   # velocidade de reacao: comprimido efervescente reagindo na agua (bolhas de CO2)
    out = sombra_chao(102, 196, 54, 6)
    g, _ = coloca(SV + 'General_items/Servier/glass-water.svg', 52, 30, alt=166)
    out += g
    out += '<defs>' + grad_rad('cp', [(0, '#ffffff'), (.8, '#eef0f2'), (1, '#c9ced4')], .4, .35, .7) + '</defs>'
    out += '<g transform="rotate(-16 102 164)"><ellipse cx="102" cy="170" rx="25" ry="7" fill="#b9c0c7" stroke="#8b949d" stroke-width=".6"/><rect x="77" y="162" width="50" height="8" fill="#cfd4d9"/><ellipse cx="102" cy="162" rx="25" ry="7" fill="url(#cp)" stroke="#8b949d" stroke-width=".6"/></g>'
    rng = np.random.default_rng(1)
    for i in range(34):
        x = 76 + rng.random() * 54; y = 70 + rng.random() * 92; r = .9 + rng.random() * 2.4 * (1 - (y - 70) / 140)
        out += f'<circle cx="{fmt(x)}" cy="{fmt(y)}" r="{fmt(r)}" fill="#ffffff" fill-opacity=".55" stroke="#8cc4dd" stroke-width=".5"/>'
    for i in range(10):
        x = 72 + rng.random() * 60
        out += f'<circle cx="{fmt(x)}" cy="{fmt(30 + rng.random()*36)}" r="{fmt(.6 + rng.random())}" fill="#bfe3f5"/>'
    g2, _ = coloca(SV + 'General_items/Servier/glass-water.svg', 52, 30, alt=166)
    out += f'<g opacity=".3">{g2}</g>'
    return out

def Q08_2():   # energia de ativacao e catalisador: perfil de energia 3D — caminho sem catalisador (alto) e com catalisador (mais baixo)
    c = Cena(-24, 20, fundo_z=0, desfoque=2.6, op_sombra=.2)
    def perfil(Ea, y0, y1, cor):
        xs = np.linspace(0, 6, 40)
        E = 2.6 + (1.0 - 2.6) * (1 / (1 + np.exp(-(xs - 3) * 2.2))) + Ea * np.exp(-((xs - 3) / .85) ** 2)
        o = c.add(Obj())
        topo = [(x, e) for x, e in zip(xs, E)]
        frente = [(0, y0, 0)] + [(x, y0, e) for x, e in topo] + [(6, y0, 0)]
        o.face(frente[::-1], cor, amb=.42)
        tras = [(0, y1, 0)] + [(x, y1, e) for x, e in topo] + [(6, y1, 0)]
        o.face(tras, cor, amb=.42)
        for i in range(len(topo) - 1):
            (xa, ea), (xb, eb) = topo[i], topo[i + 1]
            o.face([(xa, y0, ea), (xb, y0, eb), (xb, y1, eb), (xa, y1, ea)], mix(cor, '#ffffff', .25), brilho=.3)
        o.face([(0, y0, 0), (0, y0, topo[0][1]), (0, y1, topo[0][1]), (0, y1, 0)], cor)
        o.face([(6, y0, 0), (6, y1, 0), (6, y1, topo[-1][1]), (6, y0, topo[-1][1])], cor)
        return o
    perfil(2.6, .9, 1.6, '#d9534f')
    perfil(1.2, 0, .7, '#3fae6a')
    return c.render()

def Q08_3():   # equilibrio quimico: as duas meias-setas (reacao direta e inversa ao mesmo tempo)
    c = Cena(-14, 12, fundo_z=0, desfoque=2.6, op_sombra=.2)
    L = 5.0; t = .62; hl = 1.5; hw = .95
    sup = [(0, 0), (L - hl, 0), (L - hl, -0), (L - hl, hw), (L, 0), (L, -t), (0, -t)]
    sup = [(0, .0), (L - hl, 0), (L - hl, hw), (L, -t * 0), (L, -t), (0, -t)]
    sup = [(0, 0), (L - hl, 0), (L - hl, hw), (L, -t), (0, -t)]
    o1 = c.add(Obj())
    extrusao(o1, sup, -.25, .25, '#2f6fd0', '#2f6fd0', M=lambda x, y, z: (x, -z, y + 2.05), brilho=.4, dupla=True)
    inf = [(L, 0), (hl, 0), (hl, -hw), (0, t), (L, t)]
    inf = [(x, -y) for x, y in sup]; inf = [(L - x, y) for x, y in inf]
    o2 = c.add(Obj())
    extrusao(o2, inf, -.25, .25, '#e0862a', '#e0862a', M=lambda x, y, z: (x, -z, y + .45), brilho=.4, dupla=True)
    return c.render()

def ampola(cx, y0, y1, r, cor, op, gid):
    d = (f'M{fmt(cx-r)} {fmt(y0+r)} A{fmt(r)} {fmt(r)} 0 0 1 {fmt(cx+r)} {fmt(y0+r)} L{fmt(cx+r)} {fmt(y1-r)} A{fmt(r)} {fmt(r)} 0 0 1 {fmt(cx-r)} {fmt(y1-r)}Z')
    pesc = f'<path d="M{fmt(cx-2)} {fmt(y0+2)} L{fmt(cx-1)} {fmt(y0-14)} Q{fmt(cx)} {fmt(y0-18)} {fmt(cx+1)} {fmt(y0-14)} L{fmt(cx+2)} {fmt(y0+2)}Z" fill="#dfe8ee" stroke="#8fa0ab" stroke-width=".7"/>'
    return (pesc + f'<path d="{d}" fill="url(#vt)" stroke="#8fa0ab" stroke-width=".9"/>'
            f'<path d="{d}" fill="{cor}" fill-opacity="{op}"/>'
            f'<rect x="{fmt(cx-r+3)}" y="{fmt(y0+r)}" width="3.5" height="{fmt(y1-y0-2*r-4)}" rx="1.7" fill="#fff" opacity=".7"/>')

def tubo_selado(cx, y0, y1, r, cor, op):
    d = (f'M{fmt(cx-r)} {fmt(y0+r)} A{fmt(r)} {fmt(r)} 0 0 1 {fmt(cx+r)} {fmt(y0+r)} L{fmt(cx+r)} {fmt(y1-r)} A{fmt(r)} {fmt(r)} 0 0 1 {fmt(cx-r)} {fmt(y1-r)}Z')
    ponta = f'<path d="M{fmt(cx-2.2)} {fmt(y0+1)} L{fmt(cx-.8)} {fmt(y0-10)} Q{fmt(cx)} {fmt(y0-13)} {fmt(cx+.8)} {fmt(y0-10)} L{fmt(cx+2.2)} {fmt(y0+1)}Z" fill="#e3ebf0" stroke="#8fa0ab" stroke-width=".6"/>'
    return (ponta + f'<path d="{d}" fill="url(#vt)" stroke="#7f919c" stroke-width=".8"/><path d="{d}" fill="{cor}" fill-opacity="{op}"/>'
            f'<rect x="{fmt(cx-r+2.2)}" y="{fmt(y0+r)}" width="2.6" height="{fmt(y1-y0-2*r-2)}" rx="1.3" fill="#fff" opacity=".75"/>')

def Q08_4():   # deslocamento de equilibrio (Le Chatelier): 2 NO2 (castanho) <=> N2O4 (incolor), exotermica no sentido direto:
    # no banho quente desloca para o NO2 (escuro); no banho de gelo, para o N2O4 (claro)
    out = '<defs>' + VIDRO + '</defs>' + sombra_chao(100, 194, 94, 7)
    for x, liq, gas, op in ((4, '#f2a07a', '#7a2e0c', .85), (104, '#a9d8f2', '#d9a35a', .22)):
        g, _ = beq(x, 78, 118, liq=liq, sat=.6, dl=.08)
        out += g
        cx = x + .403 * 118
        out += tubo_selado(cx, 30, 180, 12, gas, op)
        if x > 50:
            for i, (xx, yy, ss, rr) in enumerate([(cx - 24, 128, 12, 8), (cx + 16, 130, 11, -14), (cx - 16, 140, 10, 22), (cx + 10, 146, 10, 5)]):
                out += cristal(xx, yy, ss, '#e4f4fc', rr, seed=i + 9)
        else:
            for i in range(3):
                xx = cx - 18 + i * 18
                out += f'<path d="M{fmt(xx)} 64 q-4 -6 0 -12 q4 -6 0 -12" fill="none" stroke="#d9d9d9" stroke-width="2.2" stroke-linecap="round" opacity=".9"/>'
        g2, _ = beq(x, 78, 118, liq=liq, sat=.6, dl=.08)
        out += f'<g opacity=".35">{g2}</g>'
    return out

def Q08_5():   # equilibrio ionico e grau de ionizacao: teste de condutividade — a lampada acende fraca (eletrolito fraco)
    out = '<defs>' + grad_rad('lp', [(0, '#fffbe0'), (.35, '#ffe9a0', .9), (1, '#ffd36b', .25)], .45, .4, .6) + grad_rad('halo', [(0, '#fff1a8', .55), (1, '#fff1a8', 0)]) + grad_lin('rosca', [(0, '#7d848c'), (.4, '#e2e6ea'), (1, '#5f666e')], 0, 0, 1, 0) + '</defs>'
    out += sombra_chao(100, 194, 66, 7)
    g, _ = beq(28, 74, 120, liq='#d9e8a4', sat=.45, dl=.12)
    out += g
    for x in (80, 120):
        out += f'<rect x="{x-3}" y="60" width="6" height="110" rx="2" fill="#2e3238"/><rect x="{x-2}" y="62" width="1.4" height="104" fill="#6b717a"/>'
    out += '<path d="M80 60 C80 40 88 34 100 34" fill="none" stroke="#c4372f" stroke-width="2.4"/><path d="M120 60 C120 40 112 34 100 34" fill="none" stroke="#2b2f36" stroke-width="2.4"/>'
    out += '<circle cx="100" cy="20" r="26" fill="url(#halo)"/>'
    out += '<path d="M90 30 L110 30 L108 38 L92 38Z" fill="url(#rosca)" stroke="#4d545b" stroke-width=".6"/>'
    out += '<circle cx="100" cy="16" r="15" fill="url(#lp)" stroke="#c9b26a" stroke-width=".7"/>'
    out += '<path d="M95 30 L96 18 Q100 12 104 18 L105 30" fill="none" stroke="#e08a1e" stroke-width="1.1"/>'
    out += '<ellipse cx="94" cy="10" rx="3" ry="5" fill="#fff" opacity=".8" transform="rotate(30 94 10)"/>'
    g2, _ = beq(28, 74, 120, liq='#d9e8a4', sat=.45, dl=.12)
    out += f'<g opacity=".35">{g2}</g>'
    return out

def Q08_6():   # pH: indicador universal em tubos de ensaio — do vermelho (acido, pH 1) ao violeta (basico, pH 13)
    cores = ['#e8322b', '#f27a1f', '#f6c82a', '#7dbb34', '#22a37a', '#2f6fd0', '#6b3fb0']
    d = '<defs>' + grad_lin('mad', [(0, '#e2b07a'), (.5, '#c98c50'), (1, '#9b6534')], 0, 0, 0, 1) + '</defs>'
    out = d + sombra_chao(100, 196, 92, 6)
    for i, cor in enumerate(cores):
        x = 14 + i * 25.5
        rec = tingir(LIQ_TUBO, cor, sat=hls(cor)[2], dl=-.05)
        out += coloca(SV + 'Chemistry/Servier/testtube-yellow.svg', x, 40, alt=150, recolor=rec)[0]
    out += '<path d="M8 112 L192 112 L192 122 L8 122Z" fill="url(#mad)" stroke="#7b4f26" stroke-width=".7"/>'
    for i in range(7): out += f'<ellipse cx="{fmt(14 + i*25.5 + 11.6)}" cy="113.5" rx="13" ry="1.6" fill="#6d4420" opacity=".35"/>'
    out += '<path d="M8 160 L192 160 L192 172 L8 172Z" fill="url(#mad)" stroke="#7b4f26" stroke-width=".7"/>'
    out += '<path d="M10 172 L16 172 L16 194 L10 194Z M184 172 L190 172 L190 194 L184 194Z" fill="#a8703c" stroke="#7b4f26" stroke-width=".6"/>'
    out += '<path d="M8 112 L14 112 L14 172 L8 172Z M186 112 L192 112 L192 172 L186 172Z" fill="#b97d44" stroke="#7b4f26" stroke-width=".6"/>'
    return out

def calculo_renal(cx, cy, s, seed=4):
    rng = np.random.default_rng(seed)
    c = Cena(-20, 25, fundo_z=0)
    P = []
    for i in range(40):
        v = rng.normal(size=3); v /= np.linalg.norm(v); P.append(tuple(v * (1 + rng.random() * .35) * np.array([1.3, 1, .8]) + np.array([0, 0, 1])))
    o = c.add(Obj()); solido_convexo(o, P, '#c9a46a', brilho=.3, amb=.35)
    return c

def Q08_7():   # solucao-tampao: o sangue (pH 7,35-7,45, tampao H2CO3/HCO3-) no tubo de coleta;
    # produto de solubilidade: calculo renal de oxalato de calcio (precipita quando [Ca2+][C2O4 2-] passa do Kps)
    out = sombra_chao(76, 196, 22, 5)
    g, _ = coloca(SV + 'Microbiology/Servier/tube-red-bluecap.svg', 64, 2, alt=194)
    rng = np.random.default_rng(12)
    c = Cena(-20, 28, fundo_z=0, desfoque=2.2, op_sombra=.26)
    o = c.add(Obj())
    P = []
    for i in range(70):
        v = rng.normal(size=3); v /= np.linalg.norm(v)
        P.append(tuple(v * (1 + rng.random() * .22) * np.array([1.35, 1.0, .75]) + np.array([0, 0, .75])))
    solido_convexo(o, P, '#c79a5c', brilho=.35, amb=.36)
    # cristais pontudos de oxalato (aspecto de "amora")
    for i in range(9):
        v = rng.normal(size=3); v[2] = abs(v[2]) + .2; v /= np.linalg.norm(v)
        base = v * np.array([1.35, 1.0, .75]) * .95 + np.array([0, 0, .75])
        tip = base + v * .38
        u = np.cross(v, [0, 0, 1.0]); u = u / (np.linalg.norm(u) or 1) * .16; w_ = np.cross(v, u)
        solido_convexo(c.add(Obj(sombra=False)), [tuple(base + u), tuple(base - u), tuple(base + w_), tuple(base - w_), tuple(tip)], '#d8b47a', brilho=.4, amb=.4)
    pedra = c.render(70, 70)
    return out + g + f'<g transform="translate(104 122)">{pedra}</g>'


# ================================================================ Q09 Pilhas, eletrolise e radioatividade
def Q09_1():   # pilha de Daniell: Zn | ZnSO4 || CuSO4 | Cu, ponte salina e voltimetro (1,10 V)
    d = '<defs>' + grad_lin('zn', [(0, '#8d949c'), (.3, '#e4e8ec'), (.55, '#b6bcc3'), (1, '#6f767e')], 0, 0, 1, 0) + grad_lin('cu', [(0, '#8a3a17'), (.3, '#e59a6a'), (.6, '#c0622f'), (1, '#7a3518')], 0, 0, 1, 0) + VIDRO + grad_lin('vm', [(0, '#f3c43a'), (1, '#c99712')], 0, 0, 0, 1) + '</defs>'
    out = d + sombra_chao(100, 194, 94, 7)
    g1, _ = beq(4, 96, 96, liq='#d7dde3', sat=.08, dl=.1)
    g2, _ = beq(104, 96, 96, liq='#2c84d6', sat=.62, dl=.02)
    out += f'<rect x="38" y="70" width="12" height="100" rx="1" fill="url(#zn)" stroke="#5c636a" stroke-width=".7"/>'
    out += f'<rect x="150" y="70" width="12" height="100" rx="1" fill="url(#cu)" stroke="#6b2c12" stroke-width=".7"/>'
    out += g1 + g2
    # ponte salina (tubo em U invertido)
    out += '<path d="M72 160 L72 92 Q72 76 88 76 L112 76 Q128 76 128 92 L128 160" fill="none" stroke="#8fa0ab" stroke-width="11" stroke-linejoin="round"/>'
    out += '<path d="M72 160 L72 92 Q72 76 88 76 L112 76 Q128 76 128 92 L128 160" fill="none" stroke="#eef3f6" stroke-width="9" stroke-linejoin="round"/>'
    out += '<path d="M70 92 Q70 80 86 79" fill="none" stroke="#fff" stroke-width="2"/>'
    out += '<rect x="67.5" y="156" width="9" height="7" rx="2" fill="#fafafa" stroke="#c9ced3" stroke-width=".5"/><rect x="123.5" y="156" width="9" height="7" rx="2" fill="#fafafa" stroke="#c9ced3" stroke-width=".5"/>'
    # fios e voltimetro
    out += '<path d="M44 70 L44 28 L78 28" fill="none" stroke="#2b2f36" stroke-width="2.2"/><path d="M156 70 L156 28 L122 28" fill="none" stroke="#c4372f" stroke-width="2.2"/>'
    out += '<rect x="76" y="10" width="48" height="36" rx="5" fill="url(#vm)" stroke="#8a6a0c" stroke-width=".8"/><rect x="82" y="16" width="36" height="16" rx="2" fill="#1d2a22"/>'
    out += texto('1,10', 100, 24, 11, '#7dfc9a')
    out += texto('V', 100, 39.5, 6.5, '#3b2f08')
    return out

def Q09_2():   # eletrolise da agua: 2 H2O -> 2 H2 (polo -) + O2 (polo +): o tubo do H2 junta o dobro do volume
    d = '<defs>' + VIDRO + '</defs>'
    out = d + sombra_chao(100, 196, 64, 7)
    g, _ = beq(30, 46, 150, liq='#a8d8f0', sat=.55, dl=.1)
    out += g
    topo, x = 20, 40
    for cx, nivel, rot, sinal, cor_f in ((70, topo + 2 * x, 'H₂', '−', '#2b2f36'), (112, topo + x, 'O₂', '+', '#c4372f')):
        out += f'<rect x="{cx-3}" y="160" width="6" height="34" fill="#2e3238"/><rect x="{cx-2}" y="162" width="1.4" height="30" fill="#6b717a"/>'
        out += f'<rect x="{cx-12}" y="{topo}" width="24" height="168" rx="12" fill="url(#vt)" stroke="#7f919c" stroke-width=".8"/>'
        out += f'<rect x="{cx-10.5}" y="{nivel}" width="21" height="{188-nivel}" fill="#5eb0e4" opacity=".75"/>'
        out += f'<ellipse cx="{cx}" cy="{nivel}" rx="10.5" ry="1.8" fill="#c6e6f6" stroke="#7fbfe0" stroke-width=".5"/>'
        out += f'<rect x="{cx-9}" y="{topo+6}" width="3" height="150" rx="1.5" fill="#fff" opacity=".75"/>'
        for j in range(6): out += f'<circle cx="{cx - 2.5 + (j % 3) * 2.6}" cy="{nivel + 10 + j * 14}" r="1.5" fill="#fff" stroke="#7fbfe0" stroke-width=".4"/>'
        out += texto(rot, cx, 9, 12, '#27323c')
    g2, _ = beq(30, 46, 150, liq='#a8d8f0', sat=.55, dl=.1)
    out += f'<g opacity=".3">{g2}</g>'
    return out

def prego(c, base, eixo, L=4.2, r=.12, ferrugem=0., seed=1, zinco=False):
    b = np.array(base, float); a = np.array(eixo, float); a /= np.linalg.norm(a)
    o = c.add(Obj())
    cor = mix('#9aa2ab', '#8a3c14', ferrugem)
    cilindro_liso(o, b, a * L * .88, r, cor=cor, brilho=.6 * (1 - ferrugem), amb=.3, ordem=0)
    cilindro_liso(o, b + a * L * .88, a * L * .12, r, 0, cor=cor, brilho=.5, ordem=1)
    cilindro_liso(o, b - a * .08, a * .08, r * 2.6, cor=mix('#b3bac2', '#7a3412', ferrugem), brilho=.6, ordem=2)
    if ferrugem:
        rng = np.random.default_rng(seed)
        def manchas(cam):
            out = []
            for i in range(30):
                t = rng.random() * .85; p = b + a * L * t
                x, y = cam.P(*p); R = r * cam.k * (.6 + rng.random() * .8)
                out.append((cam.D(*p) - 1, f'<ellipse cx="{fmt(x + rng.normal(0, r*cam.k*.4))}" cy="{fmt(y + rng.normal(0, r*cam.k*.4))}" rx="{fmt(R*1.4)}" ry="{fmt(R*.8)}" fill="{["#a8501d", "#6e2a0e", "#c56a2a"][i % 3]}" opacity=".85"/>'))
            return out
        manchas.ordem = 5
        o.cru.append((manchas, []))
    if zinco:
        def fita(cam):
            out = []
            P = []
            u = np.cross(a, [0, 0, 1]); u /= np.linalg.norm(u); v = np.cross(a, u)
            for t in np.linspace(0, 6 * math.pi, 120):
                P.append(tuple(b + a * (L * .3 + t / (6 * math.pi) * L * .3) + (r * 1.25) * (math.cos(t) * u + math.sin(t) * v)))
            for i in range(len(P) - 1):
                m = tuple((np.array(P[i]) + np.array(P[i + 1])) / 2)
                fr = cam.D(*m) < cam.D(*(b + a * L * .45))
                out.append((cam.D(*m) - (1 if fr else -1), lin(cam, P[i], P[i + 1], '#c7ccd2' if fr else '#7d848c', .1 * cam.k)))
            return out
        fita.ordem = 6
        o.cru.append((fita, []))
    return o

def Q09_3():   # corrosao e metal de sacrificio: prego enferrujado x prego protegido por um anel de zinco (metal de sacrificio)
    # (correcao da revisao de 29/10: a fita de zinco cinza sumia sobre o prego cinza; agora e um anel grosso de zinco,
    #  branco-azulado, preso ao prego, e o prego protegido fica brilhante, contra o prego enferrujado atras)
    c = Cena(-20, 34, fundo_z=0, desfoque=2.4, op_sombra=.24)
    o1 = prego(c, (-1.6, .3, .3), (1, -.25, 0), ferrugem=.85, seed=3); o1.prof = 3
    base = np.array((-1.1, -1.0, .3)); eixo = np.array((1, -.12, 0)); eixo = eixo / np.linalg.norm(eixo)
    o2 = prego(c, tuple(base), tuple(eixo)); o2.prof = 2
    z = c.add(Obj()); z.prof = 1
    p0 = base + eixo * 4.2 * .40
    cilindro_liso(z, tuple(p0), tuple(eixo * 1.05), .36, cor='#c4d3e2', tampa_cor='#e4edf5', brilho=.75, amb=.42, ordem=0)
    return c.render()

def nucleo_grande(o, centro, N=40, r=.26, seed=3, frac_p=.45):
    rng = np.random.default_rng(seed)
    c = np.array(centro, float)
    pts = [c + p for p in pontos_fcc(N, r, seed)]
    for p in pts:
        o.esfera(tuple(p), r, '#d9433e' if rng.random() < frac_p else '#9aa1ab')

def rastro(cam, p, d, n=4, cor='#9aa1ab', r=.2):
    out = []
    for i in range(1, n + 1):
        q = np.array(p) - np.array(d) * i * .35
        x, y = cam.P(*q)
        out.append((cam.D(*q) + .5, f'<circle cx="{fmt(x)}" cy="{fmt(y)}" r="{fmt(r*cam.k*(1-i*.15))}" fill="{cor}" opacity="{fmt(.35 - i*.07)}"/>'))
    return out

def Q09_4():   # emissoes radioativas: nucleo instavel emitindo alfa (2p + 2n), beta (eletron) e gama (onda)
    c = Cena(-15, 20, fundo_z=-2.0, desfoque=3, op_sombra=.15)
    o = c.add(Obj(sombra=False)); nucleo_grande(o, (-1.0, 0, 0), N=46, r=.25)
    a = c.add(Obj(sombra=False)); nucleo(a, (2.0, 0, 1.3), 2, 2, r=.25, seed=5)
    def fx(cam):
        out = []
        out += rastro(cam, (2.0, 0, 1.3), np.array([1, 0, .55]) / 1.14, n=4, cor='#d9433e', r=.42)
        (x, y) = cam.P(2.1, 0, -.9); R = .15 * cam.k
        out.append((-5, f'<circle cx="{fmt(x)}" cy="{fmt(y)}" r="{fmt(R)}" fill="url(#eel)"/>'))
        out += [(p + 0, s) for p, s in rastro(cam, (2.1, 0, -.9), np.array([1, 0, -.45]) / 1.1, n=4, cor='#3a78e0', r=.15)]
        x0, y0 = cam.P(.6, 0, .05); x1, y1 = cam.P(3.0, 0, .05)
        pts = []
        for t in np.linspace(0, 1, 60):
            X = x0 + (x1 - x0) * t; Y = y0 + (y1 - y0) * t + math.sin(t * 6 * math.pi) * .2 * cam.k
            pts.append(f'{fmt(X)},{fmt(Y)}')
        out.append((-5, f'<polyline points="{" ".join(pts)}" fill="none" stroke="#7b3fd0" stroke-width="{fmt(.09*cam.k)}" stroke-linecap="round"/>'))
        return out
    fx.ordem = 3
    e = c.add(Obj(sombra=False)); e.prof = -1e4; e.cru.append((fx, [(3.0, 0, -1.2), (3.0, 0, 1.6)]))
    c.defs.append(esf('eel', '#3a78e0'))
    corpo = c.render()
    x, y = c.cam.P(*no_chao((0, 0, 0), -2.0))
    return sombra_eliptica(x, y, 2.4 * c.cam.k, .35 * c.cam.k, op=.16, blur=4) + corpo

def Q09_5():   # fissao nuclear: neutron atinge um nucleo pesado, que se parte em dois e libera mais neutrons
    c = Cena(-15, 20, fundo_z=-2.0, desfoque=3, op_sombra=.15)
    f1 = c.add(Obj(sombra=False)); nucleo_grande(f1, (0, 0, .75), N=22, r=.25, seed=7)
    f2 = c.add(Obj(sombra=False)); nucleo_grande(f2, (.9, 0, -.85), N=18, r=.25, seed=8)
    nn = c.add(Obj(sombra=False))
    neut = [(-2.6, 0, .0), (2.4, 0, 1.3), (2.6, 0, -.1), (2.0, 0, -1.6)]
    for p in neut: nn.esfera(p, .25, '#9aa1ab')
    def fx(cam):
        out = []
        x, y = cam.P(.4, 0, 0); R = 1.2 * cam.k
        out.append((5, f'<circle cx="{fmt(x)}" cy="{fmt(y)}" r="{fmt(R)}" fill="url(#flash)"/>'))
        out += rastro(cam, neut[0], np.array([1, 0, 0]), n=4)
        for p in neut[1:]:
            d = np.array(p) - np.array([.4, 0, 0]); d /= np.linalg.norm(d)
            out += rastro(cam, p, d, n=3)
        return out
    fx.ordem = -1
    e = c.add(Obj(sombra=False)); e.prof = 1e4; e.cru.append((fx, [(-2.9, 0, 0), (2.9, 0, 1.6)]))
    c.defs.append(grad_rad('flash', [(0, '#fff6c8', .95), (.45, '#ffcf5a', .55), (1, '#ff9a3c', 0)]))
    corpo = c.render()
    x, y = c.cam.P(*no_chao((0, 0, 0), -2.0))
    return sombra_eliptica(x, y, 2.2 * c.cam.k, .32 * c.cam.k, op=.15, blur=4) + corpo

# ================================================================ Q10 Propriedades coligativas
def Q10_1():   # ebulioscopia: sal na agua fervendo (o soluto eleva a temperatura de ebulicao)
    out = sombra_chao(100, 194, 90, 7)
    out += coloca(SV + 'General_items/Servier/pot-water-hot.svg', 2, 40, alt=150)[0]
    out += coloca(SV + 'General_items/Servier/salt.svg', 140, 104, alt=92)[0]
    return out

def Q10_2():   # osmose: tubo em U com membrana semipermeavel — a agua passa para o lado mais concentrado, cujo nivel sobe
    d = '<defs>' + esf('sol', '#d9433e') + '<clipPath id="ce"><rect x="0" y="92" width="100" height="120"/></clipPath><clipPath id="cd"><rect x="100" y="56" width="100" height="160"/></clipPath></defs>'
    out = d + sombra_chao(100, 194, 66, 6)
    U = 'M52 20 L52 140 Q52 178 100 178 Q148 178 148 140 L148 20'
    out += f'<path d="{U}" fill="none" stroke="#8fa0ab" stroke-width="34" stroke-linejoin="round"/>'
    out += f'<path d="{U}" fill="none" stroke="#eef4f7" stroke-width="31.5" stroke-linejoin="round"/>'
    out += f'<path d="{U}" fill="none" stroke="#a6d6f0" stroke-width="31.5" clip-path="url(#ce)"/>'
    out += f'<path d="{U}" fill="none" stroke="#a6d6f0" stroke-width="31.5" clip-path="url(#cd)"/>'
    out += '<ellipse cx="52" cy="92" rx="15.7" ry="3" fill="#c6e6f6" stroke="#7fbfe0" stroke-width=".6"/><ellipse cx="148" cy="56" rx="15.7" ry="3" fill="#c6e6f6" stroke="#7fbfe0" stroke-width=".6"/>'
    rng = np.random.default_rng(2)
    for i in range(9): out += bola(136 + rng.random() * 22, 64 + rng.random() * 90, 3.3, 'sol')
    for i in range(3): out += bola(108 + rng.random() * 18, 168 + rng.random() * 14, 3.3, 'sol')
    out += '<line x1="100" y1="161" x2="100" y2="195" stroke="#5a4a3a" stroke-width="3" stroke-dasharray="2.6 1.6"/>'
    out += f'<path d="M40 24 L40 138" stroke="#fff" stroke-width="3" opacity=".75" stroke-linecap="round"/><path d="M136 24 L136 138" stroke="#fff" stroke-width="3" opacity=".6" stroke-linecap="round"/>'
    return out

# ================================================================ Q11 Organica: estrutura e isomeria
def Q11_1(): return mol('CC(C)CC', seed=5, az=-20, el=28)                          # cadeia ramificada: 2-metilbutano (C prim., sec. e terc.)
def Q11_2():   # hidrocarboneto insaturado: o eteno (H2C=CH2), alceno que amadurece os frutos — tomate maduro e tomate verde
    # (correcao da revisao de 29/10: o propeno sozinho repetia as bolas-e-varetas do modulo; agora o alceno aparece num
    #  contexto real: a molecula de eteno, com a dupla C=C, sobre o tomate maduro e o verde)
    at, lg, _ = de_smiles('C=C', seed=3)
    at = [(e, (x * 1.0 + 1.05, y, z + 1.75)) for e, (x, y, z) in at]
    c = bb(at, lg, az=-18, el=20, escala_lig=.17)
    c.z0 = -2.45
    t = c.add(Obj()); t.esfera((-.75, .2, -1.25), 1.2, '#d8331f')
    v = c.add(Obj()); v.esfera((1.55, 1.1, -1.6), .85, '#7fae2e')
    def calice(cam):
        out = ''
        for (cx_, cy_, cz_, r, cor) in ((-.75, .2, -1.25, 1.2, '#2f6e1e'), (1.55, 1.1, -1.6, .85, '#3f7a22')):
            X, Y = cam.P(cx_, cy_, cz_ + r * .93); R = r * cam.k * .42
            Xc, Yc = cam.P(cx_, cy_, cz_); Rf = r * cam.k
            for dx in (-.55, -.2, .2, .55):   # gomos do tomate: arcos que descem do calice
                out += (f'<path d="M{fmt(X + dx * R * .5)} {fmt(Y + 2)} Q{fmt(Xc + dx * Rf * 1.05)} {fmt(Yc - Rf * .35)} {fmt(Xc + dx * Rf * .8)} {fmt(Yc + Rf * .2)}" '
                        f'fill="none" stroke="#000" stroke-width="{fmt(Rf * .035)}" opacity=".13" stroke-linecap="round"/>')
            pts = []
            for i in range(10):
                a = math.radians(i * 36 - 90); rr = R if i % 2 == 0 else R * .32
                pts.append((X + rr * math.cos(a), Y + rr * math.sin(a) * .42))
            out += f'<path d="{caminho(pts)}" fill="{cor}" stroke="{mix(cor, "#000000", .4)}" stroke-width=".6" stroke-linejoin="round"/>'
            out += f'<rect x="{fmt(X - R * .07)}" y="{fmt(Y - R * .5)}" width="{fmt(R * .14)}" height="{fmt(R * .5)}" rx="{fmt(R * .05)}" fill="{cor}"/>'
        return out
    c.sobre.insert(0, calice)
    return c.render()
def Q11_3(): return mol('CCO', seed=2, az=-30, el=24, escala_lig=.16)               # funcao oxigenada: etanol (alcool)
def Q11_4(): return mol('CC(=O)Nc1ccc(O)cc1', seed=4, az=-12, el=40)               # funcoes mistas: paracetamol (amida + fenol)

def Q11_5():   # isomeria plana de cadeia: butano x metilpropano (mesma formula molecular C4H10)
    # (correcao da revisao de 29/10: duas cadeias finas de bola-e-vareta, ilegiveis a 64 px e iguais as do modulo; agora
    #  sao duas placas coloridas lado a lado, cada uma com a formula de linha e a mesma formula molecular C4H10)
    out = '<defs>' + grad_lin('i1', [(0, '#3f8be0'), (1, '#1c5aa8')], 0, 0, 0, 1) + grad_lin('i2', [(0, '#f29a3a'), (1, '#c76512')], 0, 0, 0, 1)
    out += '<filter id="ish" x="-20%" y="-20%" width="140%" height="150%"><feGaussianBlur stdDeviation="2.6"/></filter></defs>'
    def placa(x, y, w, h, gid, esc):
        o = f'<rect x="{fmt(x + 3)}" y="{fmt(y + 7)}" width="{w}" height="{h}" rx="9" fill="#1b1d2a" opacity=".22" filter="url(#ish)"/>'
        o += f'<rect x="{x}" y="{y + 4}" width="{w}" height="{h}" rx="9" fill="{esc}"/>'
        o += f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="9" fill="url(#{gid})" stroke="{esc}" stroke-width=".8"/>'
        o += f'<rect x="{x + 4}" y="{y + 3}" width="{w - 8}" height="5" rx="2.5" fill="#fff" opacity=".28"/>'
        return o
    def cadeia(pts, lig):
        o = ''
        for i, j in lig:
            o += f'<line x1="{fmt(pts[i][0])}" y1="{fmt(pts[i][1])}" x2="{fmt(pts[j][0])}" y2="{fmt(pts[j][1])}" stroke="#fff" stroke-width="5" stroke-linecap="round"/>'
        for x, y in pts:
            o += f'<circle cx="{fmt(x)}" cy="{fmt(y)}" r="5" fill="#fff"/><circle cx="{fmt(x)}" cy="{fmt(y)}" r="2.2" fill="#2a2f3a"/>'
        return o
    # butano: zigue-zague de 4 carbonos
    out += placa(6, 46, 90, 108, 'i1', '#123d73')
    bu = [(20, 98), (40, 80), (60, 98), (80, 80)]
    out += cadeia(bu, [(0, 1), (1, 2), (2, 3)])
    out += texto('C₄H₁₀', 51, 136, 19, '#ffffff', arq=SANS)
    # metilpropano: carbono central com tres ramos
    out += placa(104, 46, 90, 108, 'i2', '#8a430b')
    mp = [(149, 86), (128, 100), (170, 100), (149, 62)]
    out += cadeia(mp, [(0, 1), (0, 2), (0, 3)])
    out += texto('C₄H₁₀', 149, 136, 19, '#ffffff', arq=SANS)
    return out

def Q11_6():   # isomeria optica: dois enantiomeros do CHFClBr diante do espelho (carbono quiral)
    a1, l1, m = de_smiles('[C@@H](F)(Cl)Br', seed=1)
    X = np.array([p for _, p in a1]); X -= X[0]
    el_ = [e for e, _ in a1]
    def alinha(v, alvo):
        v = v / np.linalg.norm(v); alvo = np.array(alvo, float); ax = np.cross(v, alvo); sn = np.linalg.norm(ax); cs = v @ alvo
        if sn < 1e-9: return np.eye(3)
        ax /= sn; K = np.array([[0, -ax[2], ax[1]], [ax[2], 0, -ax[0]], [-ax[1], ax[0], 0]])
        return np.eye(3) + sn * K + (1 - cs) * K @ K
    X = X @ alinha(X[el_.index('H')], (0, 0, 1)).T
    b_ = X[el_.index('Br')]; ang = math.atan2(b_[1], b_[0]); alvo = math.radians(200)
    q = alvo - ang; Rz = np.array([[math.cos(q), -math.sin(q), 0], [math.sin(q), math.cos(q), 0], [0, 0, 1]]); X = X @ Rz.T
    # espelha em x
    at = [(e, tuple(X[i] + np.array([-1.9, 0, 0]))) for i, (e, _) in enumerate(a1)]
    at += [(e, tuple(X[i] * np.array([-1, 1, 1]) + np.array([1.9, 0, 0]))) for i, (e, _) in enumerate(a1)]
    n = len(a1); lg = l1 + [(i + n, j + n, o) for i, j, o in l1]
    c = bb(at, lg, az=-26, el=30, escala_lig=.15)
    o = c.add(Obj(sombra=False)); o.prof = 0
    zmin = min(p[2] for _, p in at) - .9; zmax = max(p[2] for _, p in at) + .4
    o.face([(0, -1.4, zmin), (0, 1.4, zmin), (0, 1.4, zmax), (0, -1.4, zmax)], '#cfe6f3', opac=.35, dupla=True, contorno='#8fb4c9', sw=.8, plana=True)
    return c.render()

def Q11_7():   # acidez e ponto de ebulicao: dimero do acido acetico unido por duas ligacoes de hidrogenio
    from rdkit import Chem
    from rdkit.Chem import AllChem
    at, lg, m = de_smiles('CC(=O)O', seed=4)
    X = np.array([p for _, p in at]); el = [e for e, _ in at]
    # indices: C0 C1 O2(=O) O3(-OH) e o H da hidroxila
    iH = [b.GetEndAtomIdx() if b.GetBeginAtomIdx() == 3 else b.GetBeginAtomIdx() for b in m.GetAtomWithIdx(3).GetBonds() if (b.GetOtherAtomIdx(3) and m.GetAtomWithIdx(b.GetOtherAtomIdx(3)).GetSymbol() == 'H')][0]
    # coloca a carboxila no plano xz e monta o dimero por inversao (centro de simetria entre as duas carboxilas)
    C1, O2, O3 = X[1], X[2], X[3]
    ex = O2 - O3; ex /= np.linalg.norm(ex)
    ez = C1 - (O2 + O3) / 2; ez /= np.linalg.norm(ez)
    ey = np.cross(ez, ex); ez = np.cross(ex, ey)
    R = np.stack([ex, ey, ez]); Y = (X - (O2 + O3) / 2) @ R.T
    # posicao do centro de inversao: O(H)...O=C ~ 2,65 A
    d = Y[iH][2] * 0 + 1.32 + .02
    Y1 = Y + np.array([0, 0, d * 0]) ; Y1[:, 2] += 1.35
    Y2 = -Y1
    at2 = [(el[i], tuple(Y1[i])) for i in range(len(el))] + [(el[i], tuple(Y2[i])) for i in range(len(el))]
    n = len(el); lg2 = lg + [(i + n, j + n, o) for i, j, o in lg]
    # ligacoes de H: H(1) ... O2(2) e H(2) ... O2(1)
    ponte = [(iH, 2 + n), (iH + n, 2)]
    pts = [p for _, p in at2]
    rot = lambda p: (p[2], p[1], -p[0])
    at3 = [(e, rot(p)) for e, p in at2]
    return bb(at3, lg2, az=-20, el=30, ponte=ponte).render()

# ================================================================ Q12 Organica: reacoes, polimeros e ambiente
def Q12_1():   # reacao de adicao: agua de bromo (alaranjada) descora ao reagir com o alceno
    out = sombra_chao(100, 196, 56, 6)
    for x, cor, sat, dl in ((60, '#d9701c', .85, -.08), (112, '#eef2f3', .12, .12)):
        rec = tingir(LIQ_TUBO, cor, sat=sat, dl=dl)
        out += coloca(SV + 'Chemistry/Servier/testtube-yellow.svg', x, 6, alt=190, recolor=rec)[0]
    return out

def Q12_2():   # saponificacao: barra de sabao com espuma (sal de acido graxo)
    c = Cena(-30, 30, fundo_z=0, desfoque=2.6, op_sombra=.22)
    o = c.add(Obj())
    caixa_chanfro(o, -1.6, 1.6, -1.0, 1.0, 0, .9, .28, '#f2a7c3', brilho=.4, amb=.4)
    def espuma(cam):
        out = []
        rng = np.random.default_rng(6)
        for i in range(16):
            p = (rng.normal(.2, .7), rng.normal(0, .45), .95 + rng.random() * .35)
            x, y = cam.P(*p); r = (.18 + rng.random() * .3) * cam.k
            out.append((cam.D(*p), f'<circle cx="{fmt(x)}" cy="{fmt(y)}" r="{fmt(r)}" fill="url(#bolha)" stroke="#b9c9d6" stroke-width=".5"/>'
                                   f'<ellipse cx="{fmt(x-r*.35)}" cy="{fmt(y-r*.4)}" rx="{fmt(r*.22)}" ry="{fmt(r*.13)}" fill="#fff" transform="rotate(-30 {fmt(x-r*.35)} {fmt(y-r*.4)})"/>'))
        return out
    espuma.ordem = 9
    e = c.add(Obj(sombra=False)); e.prof = -1e4; e.cru.append((espuma, [(1.3, .4, 1.7), (-1.0, -.4, 1.7)]))
    c.defs.append(grad_rad('bolha', [(0, '#ffffff', .95), (.7, '#f4f7fa', .9), (1, '#c9d6e2', .9)], .45, .4, .6))
    return c.render()

def Q12_3():   # polimero de adicao: trecho da cadeia do polietileno -[CH2-CH2]n-, com a unidade de repeticao entre colchetes
    # (correcao da revisao de 29/10: antes era um octano fechado, igual aos alcanos do Q11; agora as pontas continuam
    #  em ligacoes soltas com reticencias e a unidade -CH2-CH2- esta entre colchetes com o indice n)
    from rdkit import Chem
    from rdkit.Chem import AllChem, rdMolTransforms as T
    n = 6
    m = Chem.AddHs(Chem.MolFromSmiles('C' * n)); AllChem.EmbedMolecule(m, randomSeed=3)
    conf = m.GetConformer()
    for i in range(n - 3): T.SetDihedralDeg(conf, i, i + 1, i + 2, i + 3, 180.0)
    AllChem.MMFFOptimizeMolecule(m, maxIters=0)
    X = np.array([list(conf.GetAtomPosition(i)) for i in range(m.GetNumAtoms())])
    def h_de(i): return [nb.GetIdx() for nb in m.GetAtomWithIdx(i).GetNeighbors() if nb.GetSymbol() == 'H']
    X -= X[:n].mean(0); _, _, vt = np.linalg.svd(X[:n]); X = X @ vt.T; X = np.stack([X[:, 0], X[:, 2], X[:, 1]], 1)
    # a ligacao que continua segue o zigue-zague: paralela a ligacao seguinte da cadeia (C1-C2 na ponta esquerda)
    un = lambda v: v / np.linalg.norm(v)
    dirs = [un(X[1] - X[2]), un(X[n - 2] - X[n - 3])]
    tirar = [max(h_de(i), key=lambda h: float(un(X[h] - X[i]) @ d)) for i, d in ((0, dirs[0]), (n - 1, dirs[1]))]
    keep = [i for i in range(m.GetNumAtoms()) if i not in tirar]; nova = {o: k for k, o in enumerate(keep)}
    at = [(m.GetAtomWithIdx(i).GetSymbol(), tuple(X[i])) for i in keep]
    lg = [(nova[b.GetBeginAtomIdx()], nova[b.GetEndAtomIdx()], 1) for b in m.GetBonds() if b.GetBeginAtomIdx() in nova and b.GetEndAtomIdx() in nova]
    toco = [(nova[0], tuple(dirs[0] * 1.05)), (nova[n - 1], tuple(dirs[1] * 1.05))]
    c = bb(at, lg, az=-10, el=22, toco=toco)
    def sobre(cam):
        out = ''
        # reticencias: a cadeia continua alem das ligacoes soltas
        for i, d in ((0, dirs[0]), (n - 1, dirs[1])):
            for t in (1.45, 1.78, 2.11):
                x, y = cam.P(*(X[i] + d * t)); out += f'<circle cx="{fmt(x)}" cy="{fmt(y)}" r="{fmt(.11 * cam.k)}" fill="#3a3e48"/>'
        # colchetes cortando as ligacoes C1-C2 e C3-C4 (unidade de repeticao C2-C3) e o indice n
        m1 = (np.array(cam.P(*X[1])) + np.array(cam.P(*X[2]))) / 2; m2 = (np.array(cam.P(*X[3])) + np.array(cam.P(*X[4]))) / 2
        u = (m2 - m1) / np.linalg.norm(m2 - m1); pp = np.array([-u[1], u[0]])
        h = 2.6 * cam.k; ser = .36 * cam.k; w = .17 * cam.k
        for mm, sg in ((m1, 1), (m2, -1)):
            a1 = mm + pp * h / 2; a2 = mm - pp * h / 2
            pts = [a1 + u * ser * sg, a1, a2, a2 + u * ser * sg]
            d = 'M' + ' L'.join(f'{fmt(x)} {fmt(y)}' for x, y in pts)
            out += f'<path d="{d}" fill="none" stroke="#fff" stroke-width="{fmt(w * 2.2)}" stroke-linejoin="miter" stroke-linecap="square"/>'
            out += f'<path d="{d}" fill="none" stroke="#1f2430" stroke-width="{fmt(w)}" stroke-linejoin="miter" stroke-linecap="square"/>'
        nx, ny = m2 - pp * h / 2 + u * .42 * cam.k
        out += texto('n', nx, ny + .25 * cam.k, .9 * cam.k, '#1f2430', extra=' stroke="#fff" stroke-width="1.2" paint-order="stroke"')
        return out
    c.sobre.append(sobre)
    return c.render()

def Q12_4():   # bioquimica: dipeptideo glicil-alanina (ligacao peptidica entre dois aminoacidos)
    return mol('NCC(=O)N[C@@H](C)C(=O)O', seed=1, az=-14, el=34)

def Q12_5():   # quimica ambiental: chamine industrial liberando fumaca (CO2, SO2 e NOx: efeito estufa e chuva acida)
    c = Cena(-20, 16, fundo_z=0, desfoque=2.6, op_sombra=.24)
    o = c.add(Obj())
    faixas = [('#c43a2e', 0, 1.1), ('#f2f2f0', 1.1, 1.7), ('#c43a2e', 1.7, 2.7), ('#f2f2f0', 2.7, 3.3), ('#c43a2e', 3.3, 4.3)]
    for i, (cor, z0, z1) in enumerate(faixas):
        r0 = .75 - z0 * .07; r1 = .75 - z1 * .07
        cilindro_liso(o, (0, 0, z0), (0, 0, z1 - z0), r0, r1, cor=cor, brilho=.3, amb=.35, ordem=i)
    cilindro_liso(o, (0, 0, 4.3), (0, 0, .2), .52, .52, cor='#3b3f46', brilho=.3, ordem=9, tampa_cor='#15171b')
    def fumaca(cam):
        out = []
        rng = np.random.default_rng(2)
        for i, (x, z, r) in enumerate([(.1, 4.9, .5), (.45, 5.4, .6), (.95, 5.85, .7), (1.6, 6.2, .8), (2.3, 6.4, .85), (.6, 5.9, .5), (1.4, 6.6, .55), (2.9, 6.7, .7)]):
            X, Y = cam.P(x, 0, z); R = r * cam.k
            out.append((-i, f'<circle cx="{fmt(X)}" cy="{fmt(Y)}" r="{fmt(R)}" fill="url(#fum)"/>'))
        return out
    fumaca.ordem = 20
    f = c.add(Obj(sombra=False)); f.prof = -1e4; f.cru.append((fumaca, [(3.7, 0, 7.3), (-.4, 0, 5)]))
    c.defs.append(grad_rad('fum', [(0, '#e9ebee'), (.6, '#b9bec6'), (1, '#8e949d')], .38, .32, .7))
    return c.render()

IDS = ['Q01.1', 'Q01.2', 'Q01.3', 'Q01.4', 'Q01.5', 'Q02.1', 'Q02.2', 'Q02.3', 'Q02.4', 'Q02.5', 'Q03.1', 'Q03.2', 'Q03.3', 'Q03.4', 'Q03.5',
       'Q04.1', 'Q04.2', 'Q04.3', 'Q04.4', 'Q04.5', 'Q05.1', 'Q05.2', 'Q05.3', 'Q05.4', 'Q05.5', 'Q06.1', 'Q06.2', 'Q06.3', 'Q07.1', 'Q07.2', 'Q07.3',
       'Q08.1', 'Q08.2', 'Q08.3', 'Q08.4', 'Q08.5', 'Q08.6', 'Q08.7', 'Q09.1', 'Q09.2', 'Q09.3', 'Q09.4', 'Q09.5', 'Q10.1', 'Q10.2',
       'Q11.1', 'Q11.2', 'Q11.3', 'Q11.4', 'Q11.5', 'Q11.6', 'Q11.7', 'Q12.1', 'Q12.2', 'Q12.3', 'Q12.4', 'Q12.5']

if __name__ == '__main__':
    import sys
    alvo = sys.argv[1:] or IDS
    for i in alvo:
        fn = globals()[i.replace('.', '_')]
        try:
            grava_sub(i, fn())
        except Exception as ex:
            import traceback; traceback.print_exc(); print('ERRO', i)

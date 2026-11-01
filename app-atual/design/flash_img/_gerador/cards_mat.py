# Solidos geometricos gerados por geometria real: projecao ortografica (azimute/elevacao), faces com luz difusa,
# arestas visiveis cheias e ocultas tracejadas (convencao de livro), elemento perguntado em destaque.
import sys, math
sys.path.insert(0, '/tmp/claude-0/-home-claude/e5566652-8789-513e-9e19-aca7ab2e3491/scratchpad/tools')
from compose import marker
OUT = '/home/claude/escadas-sc/design/flash_img/mat/'
W, H = 600, 440
AC = '#e8590c'          # destaque (laranja)
LN = '#1f2a44'          # arestas
def hx(c): c = c.lstrip('#'); return tuple(int(c[i:i+2], 16) for i in (0, 2, 4))
def mix(a, b, t): a, b = hx(a), hx(b); t = max(0, min(1, t)); return '#%02x%02x%02x' % tuple(round(a[i] + (b[i] - a[i]) * t) for i in range(3))
def norm(v): n = math.sqrt(sum(x * x for x in v)) or 1; return tuple(x / n for x in v)
def sub(a, b): return tuple(a[i] - b[i] for i in range(3))
def cross(a, b): return (a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0])
def dot(a, b): return sum(a[i] * b[i] for i in range(3))
LUZ = norm((-.45, -.75, .95))

class Cena:
    def __init__(s, az=-32, el=22, cor='#7fa7d6'):
        s.a, s.e = math.radians(az), math.radians(el); s.cor = cor
        s.cam = (-math.sin(s.a) * math.cos(s.e), -math.cos(s.a) * math.cos(s.e), math.sin(s.e))  # aponta para a camera
        s.op = 1; s.items = []   # (camada, svg)  camadas: 0 sombra, 1 faces, 2 ocultas, 3 visiveis, 4 destaque
        s.pts = []
    def V(s, p):
        x, y, z = p; a, e = s.a, s.e
        xr = x * math.cos(a) - y * math.sin(a); yr = x * math.sin(a) + y * math.cos(a)
        return xr, z * math.cos(e) + yr * math.sin(e)
    def fit(s, allpts, box=(70, 30, 530, 400)):
        v = [s.V(p) for p in allpts]; xs = [a for a, _ in v]; ys = [b for _, b in v]
        s.k = min((box[2] - box[0]) / (max(xs) - min(xs)), (box[3] - box[1]) / (max(ys) - min(ys)))
        s.ox = (box[0] + box[2]) / 2 - s.k * (max(xs) + min(xs)) / 2; s.oy = (box[1] + box[3]) / 2 + s.k * (max(ys) + min(ys)) / 2
    def P(s, p): a, b = s.V(p); return (s.ox + a * s.k, s.oy - b * s.k)
    def vis(s, n): return dot(n, s.cam) > 1e-9
    def tom(s, n, cor=None):
        i = max(0, dot(norm(n), LUZ)); c = cor or s.cor
        return mix(mix(c, '#0b1630', .55), mix(c, '#ffffff', .55), .15 + .85 * i)
    def d(s, pts, fechar=True): return 'M' + ' L'.join('%.2f %.2f' % s.P(p) for p in pts) + ('Z' if fechar else '')
    def face(s, pts, n, cor=None, op=1):
        c = s.tom(n, cor)
        if op < 1: s.op = op
        s.items.append((1 if op == 1 else 1.5, f'<path d="{s.d(pts)}" fill="{c}" stroke="{c}" stroke-width=".7" stroke-linejoin="round"/>'))
    def linha(s, pts, oculta=False, cor=LN, w=2.0, cam=None):
        if oculta: s.items.append((cam or 2, f'<path d="{s.d(pts, False)}" fill="none" stroke="{cor}" stroke-width="{w*.75:.2f}" stroke-dasharray="7 5" stroke-linecap="round" opacity=".8"/>'))
        else: s.items.append((cam or 3, f'<path d="{s.d(pts, False)}" fill="none" stroke="{cor}" stroke-width="{w}" stroke-linecap="round" stroke-linejoin="round"/>'))
    def regiao(s, pts, cor=AC, op=.42):
        s.items.append((4, f'<path d="{s.d(pts)}" fill="{cor}" fill-opacity="{op}" stroke="{cor}" stroke-width="2.6" stroke-linejoin="round"/>'))
    def ponto(s, p, r=3.2, cor=LN):
        x, y = s.P(p); s.items.append((5, f'<circle cx="{x:.2f}" cy="{y:.2f}" r="{r}" fill="{cor}"/>'))
    def rotulo(s, p, txt, dx=0, dy=0, cor=LN, it=True):
        x, y = s.P(p); s.items.append((5, f'<text x="{x+dx:.1f}" y="{y+dy:.1f}" font-family="Georgia, \'Times New Roman\', serif" font-size="20" {"font-style=\"italic\" " if it else ""}fill="{cor}" text-anchor="middle">{txt}</text>'))
    def sombra(s, pts_chao):
        # sombra suave no chao (z minimo), deslocada para tras-direita
        s.items.append((0, f'<path d="{s.d([(x + .25, y + .35, z) for x, y, z in pts_chao])}" fill="#1b1d2a" opacity=".16" filter="url(#bl)"/>'))
    def svg(s, alvo, rot):
        it = sorted(s.items, key=lambda it: it[0])
        body = ''.join(t for c_, t in it if c_ < 1.5) + (f'<g opacity="{s.op}">' + ''.join(t for c_, t in it if c_ == 1.5) + '</g>') + ''.join(t for c_, t in it if c_ > 1.5)
        return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" role="img">'
                f'<defs><filter id="bl" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="7"/></filter></defs>'
                f'<rect width="{W}" height="{H}" fill="#fff"/>{body}{marker(alvo, rot)}</svg>')

def circ(c, r, n=144, z=None, a0=0):
    return [(c[0] + r * math.cos(a0 + 2 * math.pi * i / n), c[1] + r * math.sin(a0 + 2 * math.pi * i / n), c[2]) for i in range(n)]

def arco_vis(cena, pts, visivel):
    """desenha um contorno fechado em trechos visiveis (cheio) e ocultos (tracejado). visivel(i) por ponto."""
    n = len(pts); runs = []; cur = [pts[0]]; v0 = visivel(0)
    for i in range(1, n + 1):
        vi = visivel(i % n)
        cur.append(pts[i % n])
        if vi != v0 or i == n:
            runs.append((v0, cur)); cur = [pts[i % n]]; v0 = vi
    for v, r in runs:
        if len(r) > 1: cena.linha(r, oculta=not v)

def revolucao(cena, R0, R1, h, cor=None, n=144, topo=True, op=1):
    """tronco/cilindro/cone de revolucao: raio R0 em z=0, R1 em z=h. faces laterais com luz; bases."""
    B0 = circ((0, 0, 0), R0, n); B1 = circ((0, 0, h), R1, n) if R1 > 0 else [(0, 0, h)] * n
    slope = (R0 - R1) / h
    lado = []
    for i in range(n):
        j = (i + 1) % n; am = 2 * math.pi * (i + .5) / n
        nn = norm((math.cos(am), math.sin(am), slope)); lado.append(cena.vis(nn))
        if lado[-1]:
            q = [B0[i], B0[j], B1[j], B1[i]] if R1 > 0 else [B0[i], B0[j], B1[i]]
            cena.face(q, nn, cor, op)
    if topo and R1 > 0: cena.face(B1, (0, 0, 1), cor, op)
    # contorno: base inferior (visivel onde a lateral adjacente e visivel), base superior inteira visivel
    arco_vis(cena, B0, lambda i: lado[i] or lado[i - 1])
    if R1 > 0: cena.linha(B1 + [B1[0]])
    # geratrizes de silhueta
    for i in range(n):
        if lado[i] != lado[i - 1]:
            cena.linha([B0[i], B1[i] if R1 > 0 else (0, 0, h)])
    return B0, B1, lado

def salva(cid, cena, alvo, rot):
    s = cena.svg(alvo, rot); open(OUT + cid + '.svg', 'w', encoding='utf-8').write(s)
    print(cid, len(s) // 1024, 'KB', tuple(round(v) for v in alvo))

import os; os.makedirs(OUT, exist_ok=True)
def ch(p): return p
# ---------------- 1. Cone: geratriz
def cone():
    c = Cena(az=-30, el=20, cor='#e0b25a'); R, h = 1.0, 1.9
    allp = circ((0, 0, 0), R, 48) + [(0, 0, h)]; c.fit(allp, (150, 40, 450, 395))
    c.sombra(circ((0, 0, 0), R * 1.05, 48))
    B0, _, lado = revolucao(c, R, 0, h, n=144)
    c.linha([(0, 0, 0), (0, 0, h)], oculta=True)                 # altura
    c.linha([(0, 0, 0), (R * math.cos(math.radians(-30)), R * math.sin(math.radians(-30)), 0)], oculta=True)   # raio (oculto: interior da base)
    c.ponto((0, 0, 0)); c.ponto((0, 0, h))
    ang = math.radians(-130); g0 = (R * math.cos(ang), R * math.sin(ang), 0)    # ponto da base na frente-esquerda
    c.linha([g0, (0, 0, h)], cor=AC, w=4.2, cam=4)
    m = tuple((g0[i] + (0, 0, h)[i]) / 2 for i in range(3))
    return c, c.P(m)
c, t = cone(); salva('mat-i01', c, t, (90, 120))

# ---------------- pirâmide quadrangular regular
def piramide(dest):
    c = Cena(az=-28, el=18, cor='#9cc3a4'); a, h = 2.0, 1.9
    V = [(-a/2, -a/2, 0), (a/2, -a/2, 0), (a/2, a/2, 0), (-a/2, a/2, 0)]; T = (0, 0, h)
    c.fit(V + [T], (130, 40, 470, 395)); c.sombra([(x * 1.04, y * 1.04, z) for x, y, z in V])
    faces = []
    for i in range(4):
        p, q = V[i], V[(i + 1) % 4]; n = norm(cross(sub(q, p), sub(T, p)))
        faces.append((p, q, n, c.vis(n)))
        if c.vis(n): c.face([p, q, T], n)
    for i in range(4):   # arestas da base: visiveis se a face lateral adjacente e visivel
        p, q, n, v = faces[i]; c.linha([p, q], oculta=not v)
    for i in range(4):   # arestas laterais
        v = faces[i][3] or faces[i - 1][3]; c.linha([V[i], T], oculta=not v)
    O = (0, 0, 0); M = (0, -a / 2, 0)   # ponto medio da aresta da frente (y = -a/2 fica de frente)
    c.linha([O, T], oculta=True); c.ponto(O); c.ponto(T)
    if dest == 'apotema_piramide':
        c.linha([O, M], oculta=True)
        c.linha([M, T], cor=AC, w=4.2, cam=4); alvo = tuple((M[i] + T[i]) / 2 for i in range(3))
    else:
        c.linha([M, T], oculta=False, w=1.6)
        c.linha([O, M], cor=AC, w=4.2, cam=4); alvo = tuple((O[i] + M[i]) / 2 for i in range(3))
    c.ponto(M, 3.6, AC if dest else LN)
    # angulo reto em M (apotema da piramide perpendicular a aresta da base) - marca pequena
    return c, c.P(alvo)
c, t = piramide('apotema_piramide'); salva('mat-i02', c, t, (520, 150))
c, t = piramide('apotema_base'); salva('mat-i03', c, t, (520, 400))

# ---------------- cubo: diagonal do cubo
def cubo():
    c = Cena(az=-18, el=22, cor='#a9b8e8'); a = 2.0
    P = {(i, j, k): (i * a, j * a, k * a) for i in (0, 1) for j in (0, 1) for k in (0, 1)}
    c.fit(list(P.values()), (150, 40, 450, 395)); c.sombra([P[(0,0,0)], P[(1,0,0)], P[(1,1,0)], P[(0,1,0)]])
    F = [((0,0,0),(1,0,0),(1,0,1),(0,0,1)), ((1,0,0),(1,1,0),(1,1,1),(1,0,1)), ((1,1,0),(0,1,0),(0,1,1),(1,1,1)),
         ((0,1,0),(0,0,0),(0,0,1),(0,1,1)), ((0,0,1),(1,0,1),(1,1,1),(0,1,1)), ((0,0,0),(0,1,0),(1,1,0),(1,0,0))]
    fv = []
    for f in F:
        pts = [P[v] for v in f]; n = norm(cross(sub(pts[1], pts[0]), sub(pts[2], pts[0]))); v = c.vis(n); fv.append((f, v))
        if v: c.face(pts, n, op=.80)
    E = set()
    for f, v in fv:
        for i in range(4):
            e = tuple(sorted((f[i], f[(i + 1) % 4]))); E.add(e)
    for e in E:
        vis = any(v and e[0] in f and e[1] in f for f, v in fv)
        c.linha([P[e[0]], P[e[1]]], oculta=not vis)
    A_, G_ = P[(1, 0, 0)], P[(0, 1, 1)]
    c.linha([A_, P[(0, 1, 0)]], oculta=True, w=1.8)                 # diagonal da base (referencia)
    c.linha([A_, G_], cor=AC, w=4.0, cam=4)
    c.ponto(A_, 3.6); c.ponto(G_, 3.6)
    alvo = tuple(A_[i] * .62 + G_[i] * .38 for i in range(3))
    return c, c.P(alvo)
c, t = cubo(); salva('mat-i04', c, t, (520, 110))

# ---------------- cilindro: secção meridiana
def cilindro():
    c = Cena(az=-20, el=20, cor='#8fb8d8'); R, h = 1.0, 2.1
    allp = circ((0, 0, 0), R, 48) + circ((0, 0, h), R, 48); c.fit(allp, (170, 30, 430, 400)); c.sombra(circ((0, 0, 0), R * 1.04, 48))
    revolucao(c, R, R, h, op=.55)
    # plano que contem o eixo, perpendicular a direcao de visada (x' na tela): pontos da base em +-u
    u = (math.cos(c.a + math.radians(55)), -math.sin(c.a + math.radians(55)), 0)
    q = [(-R * u[0], -R * u[1], 0), (R * u[0], R * u[1], 0), (R * u[0], R * u[1], h), (-R * u[0], -R * u[1], h)]
    c.regiao(q, op=.38); c.linha([(0, 0, 0), (0, 0, h)], oculta=True, cam=5)
    c.ponto((0, 0, 0)); c.ponto((0, 0, h))
    alvo = (R * .5 * u[0], R * .5 * u[1], h * .62)
    return c, c.P(alvo)
c, t = cilindro(); salva('mat-i05', c, t, (530, 120))

# ---------------- esfera: círculo máximo
def esfera():
    c = Cena(az=-30, el=22, cor='#d99a9a'); R = 1.0
    c.fit([(R, 0, 0), (-R, 0, 0), (0, 0, R), (0, 0, -R), (0, R, 0), (0, -R, 0)] + [(R * math.cos(t), R * math.sin(t), 0) for t in [i * .2 for i in range(32)]], (165, 30, 435, 395))
    cx, cy = c.P((0, 0, 0)); r = R * c.k
    # corpo: gradiente radial (luz de cima-esquerda-frente)
    c.items.append((0, f'<ellipse cx="{cx+18:.1f}" cy="{cy+r*.98:.1f}" rx="{r*.9:.1f}" ry="{r*.2:.1f}" fill="#1b1d2a" opacity=".16" filter="url(#bl)"/>'))
    c.items.append((1, f'<radialGradient id="gs" cx="36%" cy="30%" r="78%"><stop offset="0" stop-color="{mix(c.cor,"#ffffff",.75)}"/><stop offset=".35" stop-color="{mix(c.cor,"#ffffff",.15)}"/><stop offset=".8" stop-color="{mix(c.cor,"#0b1630",.25)}"/><stop offset="1" stop-color="{mix(c.cor,"#0b1630",.5)}"/></radialGradient>'
                       f'<circle cx="{cx:.2f}" cy="{cy:.2f}" r="{r:.2f}" fill="url(#gs)" fill-opacity=".92"/>'))
    eq = circ((0, 0, 0), R, 144)
    c.regiao(eq, op=.30)
    # equador: metade da frente cheia, metade de tras tracejada (sobre o disco)
    arco_vis(c, eq, lambda i: c.vis(eq[i]))
    c.items[-1:] = c.items[-1:]
    c.items.append((3, f'<circle cx="{cx:.2f}" cy="{cy:.2f}" r="{r:.2f}" fill="none" stroke="{LN}" stroke-width="2"/>'))
    O = (0, 0, 0); Pp = (R * math.cos(math.radians(-10)), R * math.sin(math.radians(-10)), 0)
    c.linha([O, Pp], oculta=False, w=1.6, cam=5); c.ponto(O, 3.6)
    c.rotulo(O, 'O', dx=-4, dy=-12); c.rotulo(tuple(v / 2 for v in Pp), 'R', dx=0, dy=-10)
    alvo = c.P((R * .55 * math.cos(math.radians(-140)), R * .55 * math.sin(math.radians(-140)), 0))
    return c, alvo
c, t = esfera(); salva('mat-i06', c, t, (90, 330))

# ---------------- tronco de cone: base menor
def tronco():
    c = Cena(az=-30, el=24, cor='#c7a6dc'); R0, R1, h = 1.25, .7, 1.3
    allp = circ((0, 0, 0), R0, 48) + circ((0, 0, h), R1, 48); c.fit(allp, (140, 50, 460, 390)); c.sombra(circ((0, 0, 0), R0 * 1.04, 48))
    revolucao(c, R0, R1, h)
    top = circ((0, 0, h), R1, 144); c.regiao(top, op=.45)
    c.linha([(0, 0, 0), (0, 0, h)], oculta=True); c.ponto((0, 0, h)); c.ponto((0, 0, 0))
    alvo = c.P((R1 * .45 * math.cos(math.radians(-150)), R1 * .45 * math.sin(math.radians(-150)), h))
    return c, alvo
c, t = tronco(); salva('mat-i07', c, t, (110, 70))

# ---------------- prisma triangular reto: face lateral
def prisma():
    c = Cena(az=45, el=22, cor='#e6c27a'); L, h = 2.0, 2.0
    tri = [(-L/2, -L*math.sqrt(3)/6, 0), (L/2, -L*math.sqrt(3)/6, 0), (0, L*math.sqrt(3)/3, 0)]
    B0 = tri; B1 = [(x, y, h) for x, y, _ in tri]
    c.fit(B0 + B1, (150, 40, 450, 395)); c.sombra([(x * 1.05, y * 1.05, z) for x, y, z in B0])
    fv = []
    for i in range(3):
        j = (i + 1) % 3; q = [B0[i], B0[j], B1[j], B1[i]]; n = norm(cross(sub(B0[j], B0[i]), (0, 0, 1)))
        fv.append((i, j, c.vis(n), q, n))
        if c.vis(n): c.face(q, n)
    c.face(B1, (0, 0, 1))
    for i, j, v, q, n in fv:
        c.linha([B0[i], B0[j]], oculta=not v); c.linha([B1[i], B1[j]])
    for i in range(3):
        v = fv[i][2] or fv[i - 1][2]; c.linha([B0[i], B1[i]], oculta=not v)
    # face lateral da frente (i=0: aresta B0[0]-B0[1], normal -y)
    q = fv[0][3]; c.regiao(q, op=.40)
    alvo = c.P(((q[0][0] + q[1][0]) / 2 + .15, q[0][1], h * .45))
    return c, alvo
c, t = prisma(); salva('mat-i08', c, t, (540, 380))

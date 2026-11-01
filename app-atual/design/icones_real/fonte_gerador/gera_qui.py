# -*- coding: utf-8 -*-
"""Quimica: vidraria e equipamentos da Servier Medical Art (CC BY 3.0) e modelos 3D gerados (bola-e-vareta com
geometria real do RDKit, atomo, pilha), com a mesma luz e a mesma sombra de contato."""
from util import *
import re
from servier import coloca, sombra_chao
SV = 'cc-by-3.0/'
CPK = {'C': ('#3c414d', .42), 'N': ('#3566e0', .40), 'O': ('#e23b48', .44), 'H': ('#eceef2', .27)}

def bola_bastao(atomos, ligacoes, az=-24, el=30, ponte=(), escala_lig=.15):
    """atomos: [(simbolo, (x,y,z))] em angstrom; ligacoes: [(i, j, ordem)]; ponte: [(i, j)] ligacoes de hidrogenio tracejadas"""
    P = [np.array(p, float) for _, p in atomos]
    z0 = min(p[2] for p in P) - .9
    pts = [tuple(p) for p in P]
    c = Cena(az, el, fundo_z=z0, desfoque=2.6, op_sombra=.16)
    o = c.add(Obj()); o.prof = 0
    for (e, p) in atomos:
        o.esfera(p, CPK[e][1], CPK[e][0])
    def fn(cam):
        out = []
        w = escala_lig * cam.k
        for i, j, ordem in ligacoes:
            mid = (P[i] + P[j]) / 2
            for a in (i, j):
                (x1, y1), (x2, y2) = cam.P(*P[a]), cam.P(*mid)
                if ordem == 2:
                    dx, dy = x2 - x1, y2 - y1; n = math.hypot(dx, dy) or 1; ox, oy = -dy / n * w * .55, dx / n * w * .55
                    seg = ''
                    for s in (-1, 1):
                        seg += (f'<line x1="{fmt(x1+s*ox)}" y1="{fmt(y1+s*oy)}" x2="{fmt(x2+s*ox)}" y2="{fmt(y2+s*oy)}" stroke="#3a3e48" stroke-width="{fmt(w*.85)}" stroke-linecap="round"/>'
                                f'<line x1="{fmt(x1+s*ox)}" y1="{fmt(y1+s*oy)}" x2="{fmt(x2+s*ox)}" y2="{fmt(y2+s*oy)}" stroke="#b8bdc8" stroke-width="{fmt(w*.55)}" stroke-linecap="round"/>')
                else:
                    seg = (f'<line x1="{fmt(x1)}" y1="{fmt(y1)}" x2="{fmt(x2)}" y2="{fmt(y2)}" stroke="#3a3e48" stroke-width="{fmt(w*1.25)}" stroke-linecap="round"/>'
                           f'<line x1="{fmt(x1)}" y1="{fmt(y1)}" x2="{fmt(x2)}" y2="{fmt(y2)}" stroke="#b8bdc8" stroke-width="{fmt(w)}" stroke-linecap="round"/>'
                           f'<line x1="{fmt(x1)}" y1="{fmt(y1-w*.18)}" x2="{fmt(x2)}" y2="{fmt(y2-w*.18)}" stroke="#ffffff" stroke-width="{fmt(w*.32)}" stroke-linecap="round" opacity=".75"/>')
                out.append((cam.D(*P[a]) + .01, seg))
        for i, j in ponte:
            (x1, y1), (x2, y2) = cam.P(*P[i]), cam.P(*P[j])
            out.append((cam.D(*((P[i] + P[j]) / 2)), f'<line x1="{fmt(x1)}" y1="{fmt(y1)}" x2="{fmt(x2)}" y2="{fmt(y2)}" stroke="#2f6fd0" stroke-width="{fmt(w*.7)}" stroke-dasharray="{fmt(w*.9)} {fmt(w*.8)}" stroke-linecap="round"/>'))
        return out
    fn.ordem = 0
    o.cru.append((fn, []))
    return c

def de_smiles(smi, seed=7, plano=True):
    from rdkit import Chem
    from rdkit.Chem import AllChem
    m = Chem.AddHs(Chem.MolFromSmiles(smi)); AllChem.EmbedMolecule(m, randomSeed=seed); AllChem.MMFFOptimizeMolecule(m)
    X = np.array([list(m.GetConformer().GetAtomPosition(i)) for i in range(m.GetNumAtoms())]); X -= X.mean(0)
    _, _, vt = np.linalg.svd(X); X = X @ vt.T
    X = np.stack([X[:, 0], X[:, 2], X[:, 1]], 1)   # plano principal de frente para a camera (x, profundidade, altura)
    at = [(a.GetSymbol(), tuple(X[i])) for i, a in enumerate(m.GetAtoms())]
    Chem.Kekulize(m, clearAromaticFlags=True)
    lg = [(b.GetBeginAtomIdx(), b.GetEndAtomIdx(), int(b.GetBondTypeAsDouble())) for b in m.GetBonds()]
    return at, lg, m

# ---------------------------------------------------------------- Q01 Atomo e tabela periodica: modelo de atomo (nucleo + orbitas)
def Q01():
    c = Cena(-20, 22, fundo_z=-1.5, desfoque=3.2, op_sombra=.16)
    o = c.add(Obj(sombra=False)); o.prof = 0

    # nucleo de carbono-12: 6 protons (vermelho) e 6 neutrons (cinza) empacotados
    rng = np.random.default_rng(4)
    pos = [(0, 0, 0)]
    dirs = [(1, 1, 1), (-1, -1, 1), (-1, 1, -1), (1, -1, -1), (1, 0, 0), (-1, 0, 0), (0, 1, 0), (0, -1, 0), (0, 0, 1), (0, 0, -1), (1, 1, -1)]
    for d in dirs:
        d = np.array(d, float); d /= np.linalg.norm(d); pos.append(tuple(d * .42))
    for k, p in enumerate(pos):
        o.esfera(p, .3, '#d9433e' if k % 2 == 0 else '#9aa1ab')
    R = 1.75
    orbitas = [(0, 25), (60, -55), (-60, -55)]
    def fn(cam):
        out = []
        for i, (ga, gb) in enumerate(orbitas):
            ga, gb = math.radians(ga), math.radians(gb)
            def ponto(t):
                x, y, z = R * math.cos(t), R * .42 * math.sin(t), 0
                # inclina e gira a orbita
                y, z = y * math.cos(gb) - z * math.sin(gb), y * math.sin(gb) + z * math.cos(gb)
                x, y = x * math.cos(ga) - y * math.sin(ga), x * math.sin(ga) + y * math.cos(ga)
                return (x, y, z)
            pts = [ponto(t) for t in np.linspace(0, 2 * math.pi, 97)]
            for j in range(len(pts) - 1):
                a, b = pts[j], pts[j + 1]; m = tuple((a[k] + b[k]) / 2 for k in range(3))
                out.append((cam.D(*m), lin(cam, a, b, '#4f73b8', .05 * cam.k, op=.9, cap='round')))
            for t_e in (.4 + i * 2.2, .4 + i * 2.2 + math.pi):   # 2 eletrons por orbita: 6 eletrons, como os 6 protons do carbono
                e = ponto(t_e)
                x, y = cam.P(*e); r = .17 * cam.k
                out.append((cam.D(*e) - .02, f'<circle cx="{fmt(x)}" cy="{fmt(y)}" r="{fmt(r)}" fill="url(#eel)"/>'))
        return out
    fn.ordem = 0
    o.cru.append((fn, [(R, 0, R * .6), (-R, 0, -R * .6), (0, R, 0), (0, -R, 0)]))
    c.defs.append(G.esfera_real('eel', '#3a78e0').replace('@K@', ''))
    corpo = c.render()
    x, y = c.cam.P(*no_chao((0, 0, 0), -1.5))
    return sombra_eliptica(x, y, 1.1 * c.cam.k, .26 * c.cam.k, op=.2, blur=3.5) + corpo

# ---------------------------------------------------------------- Q02 Ligacoes e forcas intermoleculares: duas moleculas de agua com ligacao de hidrogenio
def Q02():
    a = math.radians(104.5) / 2; d = .96 * 1.35   # comprimentos levemente ampliados para a leitura do modelo
    O1 = np.array([0, 0, 0.]); H1 = O1 + d * np.array([math.sin(a), 0, math.cos(a)]); H2 = O1 + d * np.array([-math.sin(a), 0, math.cos(a)])
    # segunda agua: O2 alinhado com O1-H1 (ligacao O-H...O quase linear, H...O ~1,9 A ampliado)
    u = (H1 - O1) / np.linalg.norm(H1 - O1); O2 = H1 + u * 1.9 * 1.1
    # hidrogenios da segunda molecula apontando para longe, fora do plano
    v = np.cross(u, [0, 1, 0]); v /= np.linalg.norm(v)
    H3 = O2 + d * (math.cos(a) * u * 1 + math.sin(a) * (v * .2 + np.array([0, 1, 0]) * .98))
    H4 = O2 + d * (math.cos(a) * u * 1 + math.sin(a) * (v * .2 - np.array([0, 1, 0]) * .98))
    # corrige o angulo H-O-H da segunda agua para 104,5 graus, simetrico em torno de u
    w = np.array([0, 0, 1.]); w = w - (w @ u) * u; w /= np.linalg.norm(w)
    H3 = O2 + d * (math.cos(a) * u + math.sin(a) * w); H4 = O2 + d * (math.cos(a) * u - math.sin(a) * w)
    at = [('O', O1), ('H', H1), ('H', H2), ('O', O2), ('H', H3), ('H', H4)]
    cen = np.mean([p for _, p in at], 0)
    at = [(e, tuple(p - cen)) for e, p in at]
    global CPK
    antes = dict(CPK); CPK['O'] = ('#e23b48', .62); CPK['H'] = ('#eceef2', .4)
    c = bola_bastao(at, [(0, 1, 1), (0, 2, 1), (3, 4, 1), (3, 5, 1)], az=-30, el=22, ponte=[(1, 3)], escala_lig=.2)
    CPK.update(antes)
    return c.render()

# ---------------------------------------------------------------- Q11 Organica: benzeno (C6H6) em bola-e-vareta
def Q11():
    at, lg, _ = de_smiles('c1ccccc1', seed=3)
    c = bola_bastao(at, lg, az=-10, el=48, escala_lig=.15)
    return c.render()

# ---------------------------------------------------------------- B02 (usado na Biologia) glicose
def glicose():
    at, lg, _ = de_smiles('OC[C@H]1O[C@@H](O)[C@H](O)[C@@H](O)[C@@H]1O', seed=11)
    c = bola_bastao(at, lg, az=-22, el=36, escala_lig=.15)
    return c.render()

# ---------------------------------------------------------------- Q09 Pilhas: duas pilhas cilindricas (uma em pe, uma deitada)
def pilha_cil(c, base, eixo, r=.32, prof=None):
    b = np.array(base, float); a = np.array(eixo, float)
    o = c.add(Obj())
    if prof is not None: o.prof = prof
    cilindro_liso(o, b, a * .78, r, cor='#1f2a44', brilho=.55, amb=.32, ordem=0, tampa_cor='#b9c0c9')
    cilindro_liso(o, b + a * .78, a * .22, r, cor='#d7a531', brilho=.6, amb=.35, ordem=1, tampa_cor='#c9ced5')
    cilindro_liso(o, b + a * .995, a * .06, r * .32, cor='#c9ced5', brilho=.6, ordem=2)
    # anel isolante do polo positivo
    return o

def Q09():
    c = Cena(-28, 24)
    pilha_cil(c, (-.55, .35, 0), (0, 0, 2.1))
    o2 = pilha_cil(c, (-.35, -.55, .32), (2.2, -.25, 0))
    def sinais(cam):
        out = []
        # "+" pintado na faixa dourada da pilha deitada e "-" no corpo, de frente para a camera
        for txt, t, cor in (('+', .9, '#1f2a44'), ('1,5 V', .42, '#e9edf3')):
            p = np.array((-.35, -.55, .32)) + np.array((2.2, -.25, 0)) * t + np.array([0, -.31, .06])
            d = texto_path(txt, lambda u, v, p=p: cam.P(p[0] + u * .99, p[1] - u * .11, p[2] + v), .3 if txt == '+' else .22, '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf')
            out.append((0, f'<path d="{d}" fill="{cor}"/>'))
        p = np.array((-.55, .35, 0)) + np.array([0, -.32, 1.85])
        d = texto_path('+', lambda u, v: cam.P(p[0] + u * .96, p[1] - u * .27, p[2] + v), .3, '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf')
        out.append((0, f'<path d="{d}" fill="#1f2a44"/>'))
        return out
    sinais.ordem = 3
    s = c.add(Obj(sombra=False)); s.prof = -1e6; s.cru.append((sinais, []))
    return c.render()

# ---------------------------------------------------------------- composicoes com a vidraria da Servier
def Q03():   # Funcoes inorganicas: erlenmeyer com solucao de fenolftaleina em meio basico (rosa)
    return sombra_chao(108, 192, 60, 7) + coloca(SV + 'Chemistry/Servier/erlenmeyer-purple.svg', 44, 0, alt=192)[0]

def Q04():   # Mol e estequiometria: balanca analitica (massa -> mol)
    return sombra_chao(106, 194, 78, 7) + coloca(SV + 'Lab_apparatus/Servier/scale.svg', 36, 0, alt=194)[0]

def Q05():   # Solucoes: balao volumetrico (preparo de solucao de concentracao exata)
    return sombra_chao(106, 194, 46, 6) + coloca(SV + 'Chemistry/Servier/flask- (4).svg', 52, 0, alt=194)[0]

def Q08():   # Cinetica: cronometro (velocidade = variacao por unidade de tempo)
    return sombra_chao(106, 194, 70, 7) + coloca(SV + 'General_items/Servier/stopwatch.svg', 26, 2, alt=192)[0]

def Q12():   # Organica: polimeros e ambiente: garrafa PET
    rec = {'#d1e5f2': '#b3d2ea', '#e1eef7': '#c6dff0', '#c6e0f0': '#a2c8e5', '#f4f9fc': '#e2eef8'}
    return sombra_chao(108, 196, 36, 5) + coloca(SV + 'General_items/Servier/waterbottle.svg', 70, 0, alt=196, recolor=rec)[0]

def Q06():   # Gases: balao de borracha inflado pelo gas produzido dentro do erlenmeyer
    g, (x, y, w, h) = coloca(SV + 'Chemistry/Servier/erlenmeyer-glass.svg', 58, 78, alt=118)
    # boca do erlenmeyer: no desenho original o gargalo vai de ~x 70..116 (de 149,8) no topo
    k = 118 / 278.287
    bx0, bx1, by = 58 + 72 * k, 58 + 116 * k, 78 + 4
    cx = (bx0 + bx1) / 2
    bal = ('<radialGradient id="bal" cx=".36" cy=".32" r=".75"><stop offset="0" stop-color="#ffb3a6"/><stop offset=".18" stop-color="#f05a4a"/>'
           '<stop offset=".7" stop-color="#c62f2a"/><stop offset="1" stop-color="#7e1714"/></radialGradient>')
    R = 46
    corpo = f'M{cx-11:.1f} {by+2:.1f} C{cx-14:.1f} {by-14:.1f} {cx-R-6:.1f} {by-30:.1f} {cx-R:.1f} {by-62:.1f} C{cx-R+4:.1f} {by-108:.1f} {cx+R-4:.1f} {by-108:.1f} {cx+R:.1f} {by-62:.1f} C{cx+R+6:.1f} {by-30:.1f} {cx+14:.1f} {by-14:.1f} {cx+11:.1f} {by+2:.1f}Z'
    out = '<defs>' + bal + '</defs>' + sombra_chao(110, 194, 62, 7) + g
    out += f'<path d="{corpo}" fill="url(#bal)" stroke="#7e1714" stroke-width=".8"/>'
    out += f'<ellipse cx="{cx-20:.1f}" cy="{by-80:.1f}" rx="9" ry="15" fill="#fff" opacity=".55" transform="rotate(25 {cx-20:.1f} {by-80:.1f})"/>'
    out += f'<ellipse cx="{cx-28:.1f}" cy="{by-58:.1f}" rx="3" ry="5" fill="#fff" opacity=".4" transform="rotate(25 {cx-28:.1f} {by-58:.1f})"/>'
    # borda enrolada do balao presa no gargalo
    out += f'<rect x="{cx-12.5:.1f}" y="{by-2:.1f}" width="25" height="7" rx="3.5" fill="#b3302a" stroke="#7e1714" stroke-width=".7"/>'
    out += f'<rect x="{cx-10:.1f}" y="{by-.5:.1f}" width="16" height="1.6" rx=".8" fill="#ff9d90" opacity=".8"/>'
    return out

def Q07():   # Termoquimica: bico de Bunsen aceso (chama azul de combustao completa)
    g, (x, y, w, h) = coloca(SV + 'Microbiology/Servier/bunsen-burner.svg', 46, 66, alt=130)
    k = 130 / 353.537
    # topo do tubo do bico no desenho original: ~x 98, y 0 (centro do tubo)
    tx, ty = 46 + 98 * k, 66 + 2
    fl = ('<radialGradient id="fl1" cx=".5" cy=".85" r=".8"><stop offset="0" stop-color="#ffffff" stop-opacity=".9"/><stop offset=".35" stop-color="#8fd3ff" stop-opacity=".85"/>'
          '<stop offset="1" stop-color="#2f6fe0" stop-opacity=".0"/></radialGradient>'
          '<linearGradient id="fl2" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#2050c8" stop-opacity=".95"/><stop offset=".6" stop-color="#5b7cf0" stop-opacity=".7"/><stop offset="1" stop-color="#b48cf0" stop-opacity=".15"/></linearGradient>'
          '<filter id="flb" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.2"/></filter>')
    ext = f'M{tx-8:.1f} {ty:.1f} C{tx-15:.1f} {ty-22:.1f} {tx-9:.1f} {ty-44:.1f} {tx+1:.1f} {ty-64:.1f} C{tx+8:.1f} {ty-44:.1f} {tx+15:.1f} {ty-22:.1f} {tx+8:.1f} {ty:.1f}Z'
    inn = f'M{tx-5:.1f} {ty:.1f} C{tx-7:.1f} {ty-10:.1f} {tx-3:.1f} {ty-20:.1f} {tx:.1f} {ty-27:.1f} C{tx+3:.1f} {ty-20:.1f} {tx+7:.1f} {ty-10:.1f} {tx+5:.1f} {ty:.1f}Z'
    out = '<defs>' + fl + '</defs>' + sombra_chao(108, 196, 52, 6) + g
    out += f'<path d="{ext}" fill="url(#fl2)" filter="url(#flb)"/>'
    out += f'<path d="{inn}" fill="url(#fl1)"/><path d="{inn}" fill="none" stroke="#7fe0ff" stroke-width=".8" opacity=".8"/>'
    return out

def Q10():   # Propriedades coligativas: bequer com agua e termometro (temperatura de congelamento/ebulicao)
    # o bequer da Servier com o liquido recolorido para agua
    rec = {'#f7e573': '#d4ecf8', '#f3d523': '#b5ddf2', '#f1c402': '#94cbea', '#dece2d': '#9fcfe9', '#e0d653': '#c3e3f4', '#eba202': '#7fbde3', '#f1bf02': '#8cc6e8'}
    out = sombra_chao(104, 194, 66, 7)
    g, (x, y, w, h) = coloca(SV + 'Chemistry/Servier/beaker-orange.svg', 34, 54, alt=140, recolor=rec)
    # termometro de vidro inclinado, mergulhado
    tb = ('<linearGradient id="vid" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#cfd9df"/><stop offset=".3" stop-color="#ffffff"/>'
          '<stop offset=".7" stop-color="#e8eef2"/><stop offset="1" stop-color="#a9b6bf"/></linearGradient>'
          '<radialGradient id="bulbo" cx=".38" cy=".35" r=".7"><stop offset="0" stop-color="#ff9a8f"/><stop offset=".5" stop-color="#d9302b"/><stop offset="1" stop-color="#8c1612"/></radialGradient>')
    termo = '<g transform="rotate(14 120 110)">'
    termo += '<rect x="113" y="4" width="14" height="168" rx="7" fill="url(#vid)" stroke="#8fa0ab" stroke-width=".8"/>'
    termo += '<rect x="118.6" y="70" width="2.8" height="100" fill="#d9302b"/>'
    for k in range(13):
        yy = 20 + k * 11
        termo += f'<line x1="{122.5}" y1="{yy}" x2="{126 if k % 2 == 0 else 124.5}" y2="{yy}" stroke="#55606a" stroke-width=".8"/>'
    termo += '<circle cx="120" cy="174" r="8.5" fill="url(#bulbo)" stroke="#7a1310" stroke-width=".6"/>'
    termo += '<ellipse cx="116.8" cy="171" rx="2" ry="3" fill="#fff" opacity=".7"/>'
    termo += '<rect x="114.6" y="8" width="2.4" height="150" rx="1.2" fill="#fff" opacity=".85"/></g>'
    # o bequer e desenhado por cima da parte de baixo do termometro (vidro na frente), com transparencia
    out += '<defs>' + tb + '</defs>' + g.replace('<g transform', '<g opacity="1" transform', 1)
    out += termo
    g2, _ = coloca(SV + 'Chemistry/Servier/beaker-orange.svg', 34, 54, alt=140, recolor=rec)
    out += f'<g opacity=".38">{g2}</g>'
    return out

if __name__ == '__main__':
    import sys
    alvo = sys.argv[1:] or ['Q%02d' % i for i in range(1, 13)]
    for k in alvo:
        if k in globals(): grava(k, globals()[k]())

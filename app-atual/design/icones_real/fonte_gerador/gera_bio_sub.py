# -*- coding: utf-8 -*-
"""Biologia — icones realistas dos CONTEUDOS (subtemas B01.1 ... B12.6), no mesmo estilo dos icones de modulo:
desenhos da Servier Medical Art (CC BY 3.0, via bioicons) e, quando ela nao tem o objeto, desenhos do projeto no
mesmo acabamento (gradiente suave, contorno fino escuro do mesmo tom, luz de cima-esquerda) ou objetos 3D do motor.
Todos com a mesma sombra de contato. Saida bruta em bruto_sub_bio/ -> finaliza_sub.js -> ../sub/<id>.svg"""
from util import *
import re, os, shutil, json
import servier
from servier import coloca as _coloca, sombra_chao, carrega

AQUI = os.path.dirname(os.path.abspath(__file__))
BRUTO_SUB = os.path.join(AQUI, 'bruto_sub_bio'); os.makedirs(BRUTO_SUB, exist_ok=True)
SV = 'cc-by-3.0/'
# clone esparso do bioicons (so para copiar os originais que forem usados para orig_servier/)
CLONE = os.environ.get('BIOICONS', '')
USADOS = {}          # id -> [arquivos Servier usados]
_ATUAL = [None]

def _garante(rel):
    dst = servier.arq(rel)
    if not os.path.exists(dst):
        src = os.path.join(CLONE, 'static', 'icons', rel)
        os.makedirs(os.path.dirname(dst), exist_ok=True); shutil.copy(src, dst)
    if _ATUAL[0]: USADOS.setdefault(_ATUAL[0], [])
    if _ATUAL[0] and rel not in USADOS[_ATUAL[0]]: USADOS[_ATUAL[0]].append(rel)

def coloca(rel, *a, **k):
    _garante(rel); return _coloca(rel, *a, **k)

def grava(id_, corpo, ocupa=.85, prec=1):
    s = (f'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 200 200" width="400" height="400" data-ocupa="{ocupa}" data-prec="{prec}">'
         f'<g id="raiz">{corpo}</g></svg>')
    open(os.path.join(BRUTO_SUB, id_ + '.svg'), 'w').write(s)

_C = [0]
def recorte(svg, x, y, w, h, rx=0):
    """mostra so o retangulo (x, y, w, h) do desenho; o finaliza poda o que fica fora"""
    _C[0] += 1; cid = f'rc{_C[0]}'
    return (f'<clipPath id="{cid}"><rect x="{x:.1f}" y="{y:.1f}" width="{w:.1f}" height="{h:.1f}" rx="{rx}"/></clipPath>'
            f'<g clip-path="url(#{cid})" data-poda="{x:.1f} {y:.1f} {w:.1f} {h:.1f}">{svg}</g>')

def recorte_d(svg, d, caixa):
    """recorte por um caminho qualquer; caixa = (x, y, w, h) que o contem (para a poda)"""
    _C[0] += 1; cid = f'rc{_C[0]}'
    return (f'<clipPath id="{cid}"><path d="{d}"/></clipPath>'
            f'<g clip-path="url(#{cid})" data-poda="{caixa[0]:.1f} {caixa[1]:.1f} {caixa[2]:.1f} {caixa[3]:.1f}">{svg}</g>')

def P2(pts): return ' '.join(f'{x:.1f},{y:.1f}' for x, y in pts)

def grad_forma(gid, cor, cx=.36, cy=.30, r=.78, claro=.55, escuro=.42):
    """o gradiente das formas organicas da Servier: realce claro em cima-esquerda, cor plena, borda mais escura"""
    return (f'<radialGradient id="{gid}" cx="{cx}" cy="{cy}" r="{r}"><stop offset="0" stop-color="{mix(cor, "#ffffff", claro)}"/>'
            f'<stop offset=".55" stop-color="{cor}"/><stop offset="1" stop-color="{mix(cor, "#000000", escuro)}"/></radialGradient>')

def forma(d, cor, gid, sw=.9, extra='', escuro=.42, claro=.55, cx=.36, cy=.30, r=.78, contorno=None):
    c = contorno or mix(cor, '#000000', .55)
    return (f'<defs>{grad_forma(gid, cor, cx, cy, r, claro, escuro)}</defs>'
            f'<path d="{d}" fill="url(#{gid})" stroke="{c}" stroke-width="{sw}" stroke-linejoin="round"{extra}/>')

def brilho(cx, cy, rx, ry, rot=-30, op=.6):
    return f'<ellipse cx="{cx:.1f}" cy="{cy:.1f}" rx="{rx:.1f}" ry="{ry:.1f}" fill="#fff" opacity="{op}" transform="rotate({rot} {cx:.1f} {cy:.1f})"/>'

def suave(pts, fechado=True, t=.5):
    """curva Catmull-Rom (como Bezier cubica) pelos pontos"""
    P = list(pts); n = len(P)
    if fechado: Q = [P[-1]] + P + [P[0], P[1]]
    else: Q = [P[0]] + P + [P[-1]]
    d = f'M{P[0][0]:.1f} {P[0][1]:.1f}'
    m = n if fechado else n - 1
    for i in range(m):
        p0, p1, p2, p3 = Q[i], Q[i + 1], Q[i + 2], Q[i + 3]
        c1 = (p1[0] + (p2[0] - p0[0]) * t / 3, p1[1] + (p2[1] - p0[1]) * t / 3)
        c2 = (p2[0] - (p3[0] - p1[0]) * t / 3, p2[1] - (p3[1] - p1[1]) * t / 3)
        d += f' C{c1[0]:.1f} {c1[1]:.1f} {c2[0]:.1f} {c2[1]:.1f} {p2[0]:.1f} {p2[1]:.1f}'
    return d + ('Z' if fechado else '')

def blob(cx, cy, rx, ry, n=10, amp=.08, seed=1, rot=0):
    rng = np.random.default_rng(seed); ph = rng.uniform(0, 6.3, 3)
    pts = []
    for i in range(n):
        a = 2 * math.pi * i / n
        k = 1 + amp * (math.sin(2 * a + ph[0]) + .6 * math.sin(3 * a + ph[1]) + .3 * math.sin(5 * a + ph[2]))
        x, y = rx * k * math.cos(a), ry * k * math.sin(a)
        c, s = math.cos(math.radians(rot)), math.sin(math.radians(rot))
        pts.append((cx + x * c - y * s, cy + x * s + y * c))
    return suave(pts)

def esfera(cx, cy, r, cor, gid, reflexo=True):
    s = (f'<defs>{grad_forma(gid, cor, .35, .30, .75, .6, .5)}</defs><circle cx="{cx:.1f}" cy="{cy:.1f}" r="{r:.1f}" fill="url(#{gid})" stroke="{mix(cor, "#000000", .55)}" stroke-width="{min(.8, r * .08):.2f}"/>')
    if reflexo: s += brilho(cx - r * .36, cy - r * .4, r * .24, r * .14, -30, .75)
    return s

def lin_grad(gid, c0, c1, x1=0, y1=0, x2=0, y2=1):
    return f'<linearGradient id="{gid}" x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}"><stop offset="0" stop-color="{c0}"/><stop offset="1" stop-color="{c1}"/></linearGradient>'

DEFS = {}
def _id(): return _ATUAL[0].replace('.', '_')

def TEXTO(rel):
    """indices dos elementos de 1o nivel que sao texto (para tirar letreiros em ingles)"""
    _garante(SV + rel)
    s = open(servier.arq(SV + rel), encoding='utf8').read()
    corpo = re.sub(r'<defs>.*?</defs>', '', re.sub(r'^.*?<svg[^>]*>', '', s, flags=re.S), flags=re.S)
    els = re.findall(r'<path[^>]*/>|<path[^>]*>.*?</path>|<g[^>]*>.*?</g>|<ellipse[^>]*/>|<circle[^>]*/>|<rect[^>]*/>|<polygon[^>]*/>|<text[^>]*>.*?</text>', corpo, flags=re.S)
    return {i for i, e in enumerate(els) if '<text' in e}

def vb_de(rel):
    _garante(rel)
    s = open(servier.arq(rel), encoding='utf8').read()
    return [float(v) for v in re.search(r'viewBox="([^"]+)"', s).group(1).replace(',', ' ').split()]

def coloca_rec(rel, ux, uy, uw, uh, x, y, larg=None, alt=None, rx=0, **kw):
    """recorta a regiao (ux, uy, uw, uh) do desenho original (unidades do viewBox) e a coloca em (x, y) com a largura/altura pedida"""
    vx, vy, vw, vh = vb_de(rel)
    k = larg / uw if larg else alt / uh
    g, _ = coloca(rel, x - (ux - vx) * k, y - (uy - vy) * k, alt=vh * k, **kw)
    return recorte(g, x, y, uw * k, uh * k, rx), (x, y, uw * k, uh * k)

def tam(rel, alt=None, larg=None):
    """(w, h) que o desenho ocupa com a altura ou largura pedida"""
    vx, vy, vw, vh = vb_de(rel)
    return (vw * alt / vh, alt) if alt else (larg, vh * larg / vw)

def poe(rel, cx, base, alt=None, larg=None, **kw):
    """coloca o desenho centrado em cx, com a base (fundo do viewBox) em y = base"""
    w, h = tam(rel, alt=alt, larg=larg)
    g, _ = coloca(rel, cx - w / 2, base - h, alt=h, **kw)
    return g, (cx - w / 2, base - h, w, h)

# =============================================================================================== B01 Citologia
# (modulo: celula eucariotica com organelas)
def B01_1():   # membrana plasmatica e transporte passivo: bicamada com proteinas-canal e ions passando a favor do gradiente
    g, (x, y, w, h) = coloca_rec(SV + 'Receptors_channels/Servier/ionchannel-membrane.svg', 383, -4, 224, 192, 2, 10, larg=196)
    return sombra_chao(102, y + h + 2, 84, 6, op=.16) + g, 0

def B01_2():   # transporte ativo: bomba de sodio e potassio (Na+ azul sai, K+ roxo entra, contra o gradiente)
    g, (x, y, w, h) = coloca_rec(SV + 'Receptors_channels/Servier/sodium-potassium-pump-membrane-ions.svg', 226, -6, 220, 164, 4, 20, larg=192)
    return sombra_chao(100, y + h + 2, 80, 6, op=.16) + g, 0

def B01_4():   # sistema de endomembranas: reticulo endoplasmatico rugoso -> vesiculas -> complexo golgiense
    out = sombra_chao(102, 176, 90, 8)
    g, _ = coloca(SV + 'Intracellular_components/Servier/endoplasmatic-reticulum-rough-3d-2.svg', -4, 78, larg=150, rot=-8); out += g
    g, _ = coloca(SV + 'Intracellular_components/Servier/golgi-3d-2.svg', 70, 26, larg=132, rot=6); out += g
    for i, (x, y, r) in enumerate([(108, 112, 8), (124, 100, 7), (94, 124, 6.5), (138, 116, 6)]):
        out += esfera(x, y, r, '#8fb7de', f'ves{i}')
    return out, 0

def B01_6():   # nucleo e citoesqueleto: celula com o nucleo, os microtubulos irradiando do centrossomo e os cilios no topo
    out = sombra_chao(102, 192, 56, 7)
    g, _ = poe(SV + 'Intracellular_components/Servier/cell-microtubule.svg', 100, 192, alt=188); out += g
    return out

# =============================================================================================== B02 Bioquimica celular
# (modulo: molecula de glicose)
def B02_1():   # agua e sais minerais: copo de agua e saleiro (NaCl)
    out = sombra_chao(104, 192, 84, 8)
    g, _ = poe(SV + 'General_items/Servier/glass-water.svg', 66, 192, alt=170); out += g
    g, _ = poe(SV + 'General_items/Servier/salt.svg', 150, 194, alt=128); out += g
    return out

def B02_2():   # carboidratos e lipidios: pao (amido) e manteiga (gordura)
    out = sombra_chao(104, 186, 90, 9)
    g, _ = poe(SV + 'General_items/Servier/bread.svg', 82, 166, larg=150); out += g
    g, _ = poe(SV + 'General_items/Servier/butter.svg', 136, 190, larg=104); out += g
    return out

def B03_1():   # respiracao celular e glicolise: 1 glicose (6 C) quebrada em 2 piruvatos (3 C), no citosol (geometria do RDKit)
    gl = molecula('OC[C@H]1O[C@@H](O)[C@H](O)[C@@H](O)[C@@H]1O', seed=11, az=-22, el=36, sem_h=True, raios=RAIOS_GRANDES, escala_lig=.2)
    pv = molecula('CC(=O)C(=O)O', seed=3, az=-20, el=30, sem_h=True, raios=RAIOS_GRANDES, escala_lig=.2)
    out = f'<g transform="translate(-4 34) scale(.62)">{gl}</g>'
    out += '<path d="M112 98 L136 98 L136 90 L152 102 L136 114 L136 106 L112 106 Z" fill="#9aa3ad" stroke="#5f6770" stroke-width="1" stroke-linejoin="round"/>'
    out += '<path d="M114 99.5 L137 99.5" stroke="#d6dbe0" stroke-width="2" stroke-linecap="round"/>'
    for n, y in enumerate((18, 98)):
        out += f'<g transform="translate(138 {y}) scale(.36)">{pv.replace("id=\"", f"id=\"p{n}").replace("url(#", f"url(#p{n}")}</g>'
    return out

RAIOS_GRANDES = {'C': ('#3c414d', .55), 'N': ('#3566e0', .53), 'O': ('#e23b48', .56), 'P': ('#f08a24', .66)}

def pote_iogurte(cx, base, k='io'):
    """pote de iogurte de plastico branco (copo baixo, mais largo em cima), faixa colorida sem marca, tampa de
    aluminio meio aberta e enrolada para tras, o iogurte branco a vista e uma colher mergulhada"""
    rt, rb, h = 32, 25, 62; yt = base - h
    o = (f'<defs>{lin_grad(k + "c", "#dfe3e8", "#ffffff", 0, 0, 1, 0)}'
         f'<linearGradient id="{k}l" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#b9c0c9"/><stop offset=".3" stop-color="#ffffff"/><stop offset=".7" stop-color="#f2f4f6"/><stop offset="1" stop-color="#a9b1bb"/></linearGradient>'
         f'<linearGradient id="{k}f" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2b6cb0"/><stop offset=".35" stop-color="#5b9be0"/><stop offset="1" stop-color="#1d4f8a"/></linearGradient>'
         f'<linearGradient id="{k}a" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f4f6f8"/><stop offset=".4" stop-color="#b8c0c8"/><stop offset=".7" stop-color="#e8ecef"/><stop offset="1" stop-color="#8d969f"/></linearGradient>'
         f'{lin_grad(k + "y", "#ffffff", "#ece8dc", 0, 0, 0, 1)}{lin_grad(k + "s", "#e9edf1", "#8f99a3", 0, 0, 1, 0)}</defs>')
    corpo = f'M{cx - rt} {yt} L{cx - rb} {base - 4} Q{cx - rb} {base} {cx - rb + 4} {base} L{cx + rb - 4} {base} Q{cx + rb} {base} {cx + rb} {base - 4} L{cx + rt} {yt} Z'
    o += f'<path d="{corpo}" fill="url(#{k}l)" stroke="#7d8790" stroke-width="1"/>'
    # faixa colorida (rotulo liso, sem marca) com frutinhas desenhadas
    f0, f1 = yt + 20, yt + 44
    def xl(y): return rt - (rt - rb) * (y - yt) / h
    o += f'<path d="M{cx - xl(f0):.1f} {f0} L{cx + xl(f0):.1f} {f0} L{cx + xl(f1):.1f} {f1} L{cx - xl(f1):.1f} {f1} Z" fill="url(#{k}f)"/>'
    for dx in (-12, 0, 12):
        o += f'<circle cx="{cx + dx}" cy="{(f0 + f1) / 2:.1f}" r="5" fill="#ffffff" opacity=".9"/><circle cx="{cx + dx}" cy="{(f0 + f1) / 2:.1f}" r="2.4" fill="#d8344a"/>'
    # borda (aro) e o iogurte branco
    o += f'<ellipse cx="{cx}" cy="{yt}" rx="{rt}" ry="7" fill="url(#{k}c)" stroke="#7d8790" stroke-width="1"/>'
    o += f'<ellipse cx="{cx}" cy="{yt + 1.2}" rx="{rt - 4}" ry="5.2" fill="url(#{k}y)" stroke="#cfc8b4" stroke-width=".6"/>'
    o += f'<path d="M{cx - 14} {yt + 1} q6 -3 12 0 t12 0" fill="none" stroke="#d9d2bd" stroke-width="1"/>'
    # colher mergulhada
    o += f'<path d="M{cx + 6} {yt + 1} L{cx + 30} {yt - 44}" stroke="#7f8992" stroke-width="5.4" stroke-linecap="round"/>'
    o += f'<path d="M{cx + 6} {yt + 1} L{cx + 30} {yt - 44}" stroke="url(#{k}s)" stroke-width="4" stroke-linecap="round"/>'
    o += f'<path d="M{cx + 7.6} {yt - 2} L{cx + 29} {yt - 42}" stroke="#ffffff" stroke-width="1" stroke-linecap="round" opacity=".8"/>'
    # tampa de aluminio meio aberta, dobrada para tras sobre a borda esquerda
    o += (f'<path d="M{cx - rt + 2} {yt - 2} C{cx - rt - 6} {yt - 22} {cx - 14} {yt - 38} {cx + 4} {yt - 34} '
          f'C{cx + 10} {yt - 26} {cx - 4} {yt - 16} {cx - 2} {yt - 6} Z" fill="url(#{k}a)" stroke="#6f7881" stroke-width="1"/>')
    o += f'<path d="M{cx - rt + 6} {yt - 8} C{cx - rt + 2} {yt - 22} {cx - 12} {yt - 32} {cx} {yt - 31}" fill="none" stroke="#ffffff" stroke-width="1.3" opacity=".9"/>'
    o += f'<path d="M{cx + 4} {yt - 34} C{cx + 8} {yt - 31} {cx + 6} {yt - 27} {cx + 2} {yt - 25}" fill="none" stroke="#c43a4c" stroke-width="2" opacity=".7"/>'
    return o

def B03_4():   # fermentacao lactica (iogurte) e alcoolica (vinho)
    # (correcao da revisao de 29/10: o pote da Servier parecia caixa de leite; agora um pote de iogurte tipico: copo baixo,
    #  tampa de aluminio meio aberta, o iogurte branco a vista e a colher)
    out = sombra_chao(104, 192, 88, 8)
    g, _ = poe(SV + 'General_items/Servier/wine.svg', 60, 194, alt=184); out += g
    out += pote_iogurte(146, 193)
    return out

def B03_6():   # plantas C4 (milho) e CAM (abacaxi)
    out = sombra_chao(104, 194, 84, 8)
    g, _ = poe(SV + 'Plants_Algae/Servier/ananas.svg', 72, 196, alt=188); out += g
    g, _ = poe(SV + 'General_items/Servier/corn.svg', 142, 196, alt=150, rot=10); out += g
    return out, 0

# =============================================================================================== B04 Divisao celular e cancer
# (modulo: cromossomo duplicado)
def B04_2():   # mitose: celula em metafase (cromossomos na placa equatorial, fuso e centrossomos)
    g, (x, y, w, h) = coloca_rec(SV + 'Genetics/Servier/Mitosis.svg', 262, 236, 120, 84, 4, 50, larg=192)
    return sombra_chao(102, y + h, 82, 7) + g

def B04_5():   # apoptose e cancer: celula cancerosa (nucleo grande e irregular, citoplasma deformado)
    return sombra_chao(102, 192, 74, 8) + poe(SV + 'Oncology/Servier/cancerous-cell-1.svg', 100, 192, alt=186)[0]

# =============================================================================================== B05 Genetica molecular
# (modulo: dupla-helice de DNA)
def B05_1():   # replicacao semiconservativa: forquilha de replicacao (cada fita antiga molde de uma nova)
    return sombra_chao(102, 194, 60, 6, op=.16) + poe(SV + 'Nucleic_acids/Servier/dna-nucleotides-forked.svg', 100, 194, alt=190)[0]

def B05_2():   # transcricao: a dupla-helice se abre e uma fita de RNA (azul) e copiada de uma das fitas
    g, (x, y, w, h) = coloca_rec(SV + 'Nucleic_acids/Servier/transkription.svg', 140, 20, 615, 340, 2, 40, larg=196)
    return sombra_chao(102, y + h, 84, 6, op=.14) + g, 0

def B05_3():   # traducao: ribossomo lendo o RNAm, RNAt trazendo aminoacidos, cadeia polipeptidica saindo
    g, (x, y, w, h) = coloca_rec(SV + 'Nucleic_acids/Servier/translation.svg', -2, 116, 348, 334, 2, 4, larg=194)
    return sombra_chao(102, y + h, 70, 6, op=.14) + g

def B05_6():   # biotecnologia: eletroforese em gel (amostra de DNA aplicada no poco, bandas separadas por tamanho)
    return sombra_chao(108, 194, 78, 7) + poe(SV + 'Lab_apparatus/Servier/gel-electrophoresis.svg', 100, 196, alt=192)[0], 0

# =============================================================================================== B07 Fisiologia humana I
# (modulo: coracao em vista anterior)
def B07_2():   # digestao: figado, estomago e pancreas na posicao anatomica (o figado a direita do corpo = esquerda da imagem)
    out = sombra_chao(104, 186, 86, 8)
    g, _ = coloca(SV + 'Human_physiology/Servier/pancreas.svg', 70, 128, larg=112); out += g
    g, _ = coloca(SV + 'Human_physiology/Servier/stomach.svg', 92, 26, alt=128); out += g
    g, _ = coloca(SV + 'Human_physiology/Servier/liver.svg', 2, 20, larg=124); out += g
    return out

NOTCH = (266, 322, 60, 70)
def B07_3():   # ventilacao e hematose: pulmoes em vista anterior (direito com 3 lobos, esquerdo com 2 e a incisura cardiaca),
    # traqueia e a arvore bronquica entrando pelos hilos (correcao da revisao de 29/10: antes era o healthy-lung, simetrico e sem bronquios)
    PUL, ARV = SV + 'Human_physiology/Servier/lung.svg', SV + 'Human_physiology/Servier/trachea-bronchi.svg'
    _garante(PUL); _garante(ARV)
    rosa = {'#e1c0ca': '#eab0c0', '#d7aab8': '#dc93a9', '#c6869e': '#c26683', '#8b576c': '#8e3f5b'}
    pul, (vx, vy, vw, vh) = carrega(PUL, recolor=rosa)
    src = open(servier.arq(PUL), encoding='utf8').read()
    corpo = re.sub(r'<defs>.*?</defs>', '', re.sub(r'^.*?<svg[^>]*>', '', src, flags=re.S), flags=re.S)
    els = re.findall(r'<path[^>]*/>', corpo)
    d_dir, d_esq = (re.search(r' d="([^"]+)"', els[i]).group(1) for i in (0, 1))
    # incisura cardiaca: a borda medial inferior do pulmao esquerdo (lado direito da imagem) recua em arco
    # (meia-elipse a direita de x = ncx, para nao tocar no pulmao direito, que fica a esquerda da imagem)
    ncx, ncy, nrx, nry = NOTCH
    arco = f'M{ncx} {ncy - nry} A{nrx} {nry} 0 0 1 {ncx} {ncy + nry}'
    furo = f'M-50 -50H520V500H-50Z {arco}Z'
    # arvore bronquica (sem a traqueia propria: a traqueia e a do desenho dos pulmoes), recolorida para destacar no rosa
    a_src = re.sub(r'<defs>.*?</defs>', '', re.sub(r'^.*?<svg[^>]*>', '', open(servier.arq(ARV), encoding='utf8').read(), flags=re.S), flags=re.S)
    a_els = re.findall(r'<path[^>]*/>|<path[^>]*>.*?</path>|<g[^>]*>.*?</g>|<ellipse[^>]*/>|<circle[^>]*/>|<rect[^>]*/>|<polygon[^>]*/>', a_src, flags=re.S)
    pontas = {i for i, e in enumerate(a_els) if 'a15a3f' in e.lower()}          # pontinhos dos alveolos: somem a 64 px e pesam
    tirar = {0, 1, 2, 3, 4} | pontas | {i + 1 for i in pontas}
    arv, (ax, ay, aw, ah) = carrega(ARV, tirar=tirar, recolor={'#fbddcf': '#fff1e6', '#f9c6aa': '#f6d2bb'})
    ka = .94; tx = 238 - 183.6 * ka; ty = 168 - 140 * ka
    k = 186 / vh; X, Y = 100 - vw * k / 2, 4
    g = (f'<g transform="translate({X:.2f} {Y:.2f}) scale({k:.5f}) translate({-vx:.2f} {-vy:.2f})">'
         f'<clipPath id="pn"><path d="{furo}" clip-rule="evenodd"/></clipPath>'
         f'<clipPath id="pl"><path d="{d_dir}"/><path d="{d_esq}"/></clipPath>'
         f'<g clip-path="url(#pn)">{pul}</g>'
         f'<g clip-path="url(#pl)"><g clip-path="url(#pn)"><g opacity=".92" transform="translate({tx:.2f} {ty:.2f}) scale({ka})">{arv}</g></g>'
         f'<g clip-path="url(#pn)"><path d="M{ncx} {ncy - nry - 6} A{nrx + 6} {nry + 6} 0 0 1 {ncx} {ncy + nry + 6}" fill="none" stroke="#9c4a66" stroke-width="9" opacity=".35"/></g>'
         f'<path d="{arco}" fill="none" stroke="#333" stroke-width="1.6"/></g></g>')
    return sombra_chao(102, 192, 80, 7) + g, 0

def B07_4():   # coracao e as duas circulacoes: coracao em corte (4 cavidades, valvas, septo)
    return sombra_chao(104, 194, 64, 7) + poe(SV + 'Human_physiology/Servier/heart-interior-1.svg', 100, 196, alt=192)[0], 0

def B07_5():   # sangue: hemacias, leucocito (neutrofilo) e plaquetas
    out = sombra_chao(104, 182, 86, 8)
    g, _ = coloca(SV + 'Blood_Immunology/Servier/erythrocyte.svg', 2, 70, larg=104, rot=-12); out += g
    g, _ = coloca(SV + 'Blood_Immunology/Servier/neutrophil-granulocyte.svg', 92, 18, larg=100); out += g
    g, _ = coloca(SV + 'Blood_Immunology/Servier/erythrocyte.svg', 74, 112, larg=96, rot=18); out += g
    g, _ = coloca(SV + 'Blood_Immunology/Servier/platetelet-1.svg', 20, 30, larg=40, rot=20); out += g
    g, _ = coloca(SV + 'Blood_Immunology/Servier/platetelet-1.svg', 160, 128, larg=34, rot=-30); out += g
    return out

def B07_6():   # nefron e formacao da urina: rim com ureter
    return sombra_chao(104, 194, 60, 7) + poe(SV + 'Human_physiology/Servier/kidney-1.svg', 100, 196, alt=192)[0], 0

# =============================================================================================== B08
def B08_6():   # imunidade: anticorpo (imunoglobulina G) e seringa (vacina x soro)
    out = sombra_chao(104, 190, 86, 8)
    g, _ = coloca(SV + 'Human_physiology/Servier/syringe.svg', 10, 110, larg=190, rot=-30); out += g
    g, _ = coloca(SV + 'Blood_Immunology/Servier/antibody-10.svg', 6, 0, alt=118, rot=-8); out += g
    return out

# =============================================================================================== B09 Ecologia
# (modulo: arvore)
def B09_1():   # cadeia alimentar: produtor (couve) e consumidor primario (coelho herbivoro)
    out = sombra_chao(104, 186, 92, 9)
    g, _ = poe(SV + 'Plants_Algae/Servier/cabbage.svg', 56, 178, alt=104); out += g
    g, _ = poe(SV + 'Animals/Servier/rabbit-brown.svg', 128, 192, larg=144, espelha=True); out += g
    return out, 0

def B09_3():   # ciclos biogeoquimicos: o planeta e a seta circular do ciclo da materia
    out = sombra_chao(102, 190, 70, 7)
    g, _ = poe(SV + 'General_items/Servier/earth.svg', 100, 186, alt=170); out += g
    return out

# =============================================================================================== B10 Saude e doencas
# (modulo: mosquito Anopheles)
def B10_1():   # viroses: virus envelopado com as espiculas de glicoproteina
    return sombra_chao(102, 194, 66, 7) + poe(SV + 'Viruses/Servier/hepatits-virus.svg', 100, 194, alt=190)[0], 0

def B10_2():   # bacterioses e resistencia: antibiograma — placa de Petri coberta de bacterias, discos de antibiotico com
    # halos de inibicao (sensivel) e um disco sem halo (a cepa e resistente aquele antibiotico)
    # (correcao da revisao de 29/10: antes os halos estavam em volta das colonias, o que nao e um antibiograma)
    k = 'ab'; cx, cy, R, e = 100, 98, 88, .84
    out = (f'<defs><radialGradient id="{k}g" cx=".42" cy=".38" r=".7"><stop offset="0" stop-color="#f1d77a"/><stop offset=".7" stop-color="#e2bf52"/><stop offset="1" stop-color="#c99f35"/></radialGradient>'
           f'<radialGradient id="{k}h" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fbf5dc"/><stop offset=".85" stop-color="#f6eccb"/><stop offset="1" stop-color="#efe0ad"/></radialGradient>'
           f'<linearGradient id="{k}v" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity=".9"/><stop offset=".5" stop-color="#dfeef3" stop-opacity=".35"/><stop offset="1" stop-color="#a9c6d1" stop-opacity=".7"/></linearGradient>'
           f'<clipPath id="{k}c"><ellipse cx="{cx}" cy="{cy}" rx="{R - 6}" ry="{(R - 6) * e:.1f}"/></clipPath></defs>')
    out += sombra_chao(102, cy + R * e + 2, R * .95, 8)
    # parede da placa (vidro) e o agar coberto de bacterias (tapete)
    out += f'<ellipse cx="{cx}" cy="{cy + 5}" rx="{R}" ry="{R * e:.1f}" fill="#c9dde4" stroke="#7d98a3" stroke-width="1"/>'
    out += f'<ellipse cx="{cx}" cy="{cy}" rx="{R}" ry="{R * e:.1f}" fill="#eef6f8" stroke="#7d98a3" stroke-width="1"/>'
    g = f'<ellipse cx="{cx}" cy="{cy}" rx="{R - 6}" ry="{(R - 6) * e:.1f}" fill="url(#{k}g)"/>'
    rng = np.random.default_rng(4)
    for _ in range(140):   # textura granulosa do crescimento bacteriano
        x, y = rng.uniform(cx - R, cx + R), rng.uniform(cy - R * e, cy + R * e)
        g += f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{rng.uniform(.6, 1.5):.1f}" fill="{["#c9a23c", "#f6e39a"][rng.integers(2)]}" opacity=".7"/>'
    # discos: 3 com halo (sensivel) e 1 sem halo (resistente)
    discos = [(66, 66, 25), (134, 70, 18), (70, 128, 21), (132, 126, 0)]
    for x, y, h in discos:
        if h:
            g += f'<ellipse cx="{x}" cy="{y}" rx="{h}" ry="{h * e:.1f}" fill="url(#{k}h)" stroke="#d2b45a" stroke-width=".8"/>'
    out += f'<g clip-path="url(#{k}c)">{g}</g>'
    for x, y, h in discos:
        out += f'<ellipse cx="{x + .8}" cy="{y + 1.6}" rx="8.4" ry="{8.4 * e:.1f}" fill="#000" opacity=".18"/>'
        out += f'<ellipse cx="{x}" cy="{y}" rx="8.4" ry="{8.4 * e:.1f}" fill="#ffffff" stroke="#9aa3ab" stroke-width=".8"/>'
        out += f'<ellipse cx="{x - 2}" cy="{y - 1.6}" rx="3" ry="1.4" fill="#eef1f3"/>'
    # reflexo do vidro da borda
    out += f'<path d="M{cx - R + 10} {cy - 20} A{R - 6} {(R - 6) * e:.1f} 0 0 1 {cx - 20} {cy - (R - 6) * e + 2}" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" opacity=".85"/>'
    return out

def B10_3():   # protozooses e vetores: barbeiro (triatomineo) com o conexivo listrado de laranja e preto, e o Trypanosoma
    # cruzi (doenca de Chagas) ampliado numa lupa
    # (correcao da revisao de 29/10: o tripanossomo tinha o tamanho do inseto, escala enganosa, e a 64 px o conjunto
    #  virava uma mancha marrom; agora o barbeiro e escuro, com o conexivo que o identifica, e o protozoario so aparece
    #  na lente de aumento)
    BUG = SV + 'Animals/Servier/bug.svg'
    escuro = {'#c17b70': '#5b3b2f', '#d39089': '#7b5242', '#f4c3c0': '#a27b66', '#b75141': '#2c1d16', '#913520': '#1c1512',
              '#e5a183': '#f08a1e'}
    out = sombra_chao(96, 168, 92, 8)
    src = open(servier.arq(BUG), encoding='utf8').read()
    corpo = re.sub(r'<defs>.*?</defs>', '', re.sub(r'^.*?<svg[^>]*>', '', src, flags=re.S), flags=re.S)
    els = re.findall(r'<path[^>]*/>|<path[^>]*>.*?</path>|<g[^>]*>.*?</g>|<ellipse[^>]*/>|<circle[^>]*/>|<rect[^>]*/>|<polygon[^>]*/>', corpo, flags=re.S)
    ia = next(i for i, e in enumerate(els) if '#e5a183' in e.lower())          # o abdome (base do conexivo)
    # pernas e abdome primeiro; depois as faixas pretas do conexivo; por cima, asas, torax e cabeca
    g, (x, y, w, h) = coloca(BUG, 0, 10, larg=178, rot=-12, recolor=escuro, manter=set(range(ia + 1)))
    out += g
    # faixas pretas do conexivo: blocos que cruzam o abdome (so aparecem nas bordas, fora das asas)
    d_abd = re.search(r' d="([^"]+)"', els[ia]).group(1)
    k = 178 / 301.757
    t = f'translate(0 10) rotate(-12 {w / 2:.2f} {h / 2:.2f}) scale({k:.5f})'
    faixas = ''.join(f'<rect x="{xx}" y="40" width="7.5" height="120" fill="#17110e"/>' for xx in (58, 74, 90, 106, 122, 138))
    out += f'<g transform="{t}"><clipPath id="cnx"><path d="{d_abd}"/></clipPath><g clip-path="url(#cnx)">{faixas}</g></g>'
    resto, _ = coloca(BUG, 0, 10, larg=178, rot=-12, recolor=escuro, manter=set(range(ia + 1, len(els))))
    out += resto
    # lupa com o Trypanosoma cruzi
    lx, ly, lr = 150, 140, 40
    out += (f'<defs><clipPath id="lp"><circle cx="{lx}" cy="{ly}" r="{lr}"/></clipPath>'
            f'<radialGradient id="lpv" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#e8eef5"/></radialGradient>'
            f'<linearGradient id="lpc" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5a6470"/><stop offset=".4" stop-color="#c9d0d8"/><stop offset="1" stop-color="#3c444d"/></linearGradient></defs>')
    out += f'<path d="M{lx + 26} {ly + 30} L{lx + 46} {ly + 52}" stroke="#2a2420" stroke-width="11" stroke-linecap="round"/>'
    out += f'<path d="M{lx + 26} {ly + 30} L{lx + 46} {ly + 52}" stroke="#5a4a3e" stroke-width="7" stroke-linecap="round"/>'
    out += f'<circle cx="{lx}" cy="{ly}" r="{lr}" fill="url(#lpv)"/>'
    tr, _ = coloca(SV + 'Parasites/Servier/trypanosoma.svg', lx - 34, ly - 22, larg=70, rot=-14)
    for cxh, cyh in ((lx - 18, ly + 22), (lx + 16, ly - 26)):   # hemacias para dar a escala
        out += f'<g clip-path="url(#lp)"><circle cx="{cxh}" cy="{cyh}" r="12" fill="#e2574c" stroke="#a8322a" stroke-width="1"/><circle cx="{cxh}" cy="{cyh}" r="5.5" fill="#c43d33" opacity=".6"/></g>'
    out += f'<g clip-path="url(#lp)">{tr}</g>'
    out += f'<circle cx="{lx}" cy="{ly}" r="{lr}" fill="none" stroke="url(#lpc)" stroke-width="6"/>'
    out += f'<path d="M{lx - lr + 9} {ly - 12} A{lr - 8} {lr - 8} 0 0 1 {lx - 10} {ly - lr + 9}" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".9"/>'
    return out

def B10_4():   # verminoses: Ascaris lumbricoides (lombriga) adulta
    return sombra_chao(102, 192, 70, 7) + poe(SV + 'Parasites/Servier/ascaris-lumbricoides-female-adult.svg', 100, 194, alt=190)[0]

def B10_5():   # profilaxia e saneamento: lavar as maos com agua e sabao
    # (correcao da revisao de 29/10: maos quase brancas sobre fundo claro, ilegiveis a 64 px; agora a pele tem tom e
    #  contorno mais escuros, a agua e mais saturada e a espuma ganhou contorno)
    pele = {'#fce5de': '#e9ac86', '#ecdfda': '#d6966f', '#fef1eb': '#f3c4a3', '#fbf6f4': '#f6cfb2', '#d9c6be': '#b5704c',
            '#ebe3df': '#dc9c76', '#ebc9bc': '#c98161', '#d1c2bd': '#9c5f42', '#dfd5d0': '#b0714f',
            '#dcf0fa': '#7cc6f2', '#f9fcfe': '#bfe5fb', 'stroke="#f0f0f0"': 'stroke="#9fb4c4"'}
    out = sombra_chao(102, 194, 76, 7, op=.16) + poe(SV + 'General_items/Servier/hand-washing.svg', 100, 194, alt=192, recolor=pele)[0]
    # espuma do sabao: aglomerados de bolhas sobre os dedos
    rng = np.random.default_rng(7)
    out += '<defs><radialGradient id="bsp" cx=".35" cy=".3" r=".75"><stop offset="0" stop-color="#ffffff"/><stop offset=".7" stop-color="#f3f7fa"/><stop offset="1" stop-color="#c9d6e0"/></radialGradient></defs>'
    for cx_, cy_, n in ((64, 92, 9), (92, 150, 8), (150, 132, 7), (122, 84, 6)):
        for _ in range(n):
            r = rng.uniform(2.6, 6.2); x = cx_ + rng.normal(0, 7); y = cy_ + rng.normal(0, 4.5)
            out += f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{r:.1f}" fill="url(#bsp)" stroke="#8fa3b3" stroke-width=".7"/>'
            out += f'<circle cx="{x - r * .35:.1f}" cy="{y - r * .35:.1f}" r="{r * .22:.1f}" fill="#fff"/>'
    return out

# =============================================================================================== B12 Diversidade dos seres vivos
# (modulo: caramujo sobre folha e cogumelo)
def B12_1():   # virus e bacterias: bacteriofago e bacteria
    out = sombra_chao(104, 190, 86, 8)
    g, _ = coloca(SV + 'Microbiology/Servier/bacterium.svg', 52, 54, alt=140, rot=-20); out += g
    g, _ = coloca(SV + 'Viruses/Servier/phage-2.svg', 6, 4, alt=124, rot=-14); out += g
    return out, 0

def B12_6():   # vertebrados: peixe, rato e macaco (classificacao e filogenia)
    out = sombra_chao(104, 186, 92, 9)
    g, _ = poe(SV + 'Animals/Servier/monkey.svg', 148, 150, alt=140); out += g
    g, _ = poe(SV + 'Animals/Servier/mouse-gray.svg', 52, 128, larg=100); out += g
    g, _ = poe(SV + 'Animals/Servier/fish-1.svg', 96, 194, larg=170); out += g
    return out, 0

# ----------------------------------------------------------------------------------- desenhos do projeto (estilo Servier)
def cloroplasto(cx, cy, L, H, rot=0, k='cl', luz=False):
    """cloroplasto em corte longitudinal: envoltorio duplo, estroma, granulos (pilhas de tilacoides) ligados pelas
    lamelas do estroma, graos de amido e plastoglobulos"""
    a, b = L / 2, H / 2
    ext = blob(0, 0, a, b, n=14, amp=.025, seed=3)
    inn = blob(0, 0, a - 3.2, b - 3.2, n=14, amp=.025, seed=3)
    out = (f'<defs>{grad_forma(k + "e", "#5fae3e", .4, .3, .8, .45, .45)}'
           f'<radialGradient id="{k}s" cx=".45" cy=".4" r=".7"><stop offset="0" stop-color="#e9f5c9"/><stop offset="1" stop-color="#b9dc8c"/></radialGradient></defs>')
    out += f'<path d="{ext}" fill="url(#{k}e)" stroke="#2f6a1d" stroke-width="1"/>'
    out += f'<path d="{inn}" fill="url(#{k}s)" stroke="#3f7f27" stroke-width=".9"/>'
    # granulos: colunas de discos; posicoes ao longo do eixo maior
    simples = L < 50
    xs = np.linspace(-a * .62, a * .62, 3 if simples else 5)
    rng = np.random.default_rng(4)
    lam = ''
    gr = ''
    ys = [-.18, .22, -.12, .2, -.2] if not simples else [0, 0, 0]
    for j, x in enumerate(xs):
        nd = [4, 6, 5, 6, 4][j] if not simples else 3
        dy = 5 if not simples else 2.6; e = 4 if not simples else 1.9
        y0 = ys[j] * b - (nd - 1) * dy / 2
        w = L * (.15 if not simples else .2)
        for q in range(nd):
            y = y0 + q * dy
            gr += (f'<rect x="{x - w / 2:.1f}" y="{y - e / 2:.1f}" width="{w:.1f}" height="{e:.1f}" rx="{e / 2:.1f}" fill="url(#{k}g)" stroke="#1e4f14" stroke-width="{.55 if not simples else .35}"/>')
        if j < len(xs) - 1 and not simples:   # lamelas do estroma ligando ao proximo granulo
            x2 = xs[j + 1]
            for q in (1, nd - 2):
                ya = y0 + q * dy; yb = ys[j + 1] * b + (q - nd / 2) * 3.2
                lam += f'<path d="M{x:.1f} {ya:.1f} C{(x + x2) / 2:.1f} {ya:.1f} {(x + x2) / 2:.1f} {yb:.1f} {x2:.1f} {yb:.1f}" fill="none" stroke="#4f9a35" stroke-width="2"/>'
    out += f'<defs>{lin_grad(k + "g", "#7cc35a", "#2f7a22")}</defs>' + lam + gr
    if not simples:
        for (x, y, rx, ry) in [(-a * .31, b * .52, 6, 3.6), (a * .31, -b * .55, 5, 3.2)]:   # graos de amido
            out += f'<ellipse cx="{x:.1f}" cy="{y:.1f}" rx="{rx}" ry="{ry}" fill="#fbfbf3" stroke="#b9c39a" stroke-width=".6"/>'
        for (x, y) in [(a * .02, b * .58), (-a * .7, b * .1)]:   # plastoglobulos
            out += f'<circle cx="{x:.1f}" cy="{y:.1f}" r="2" fill="#f2c94c" stroke="#a37f12" stroke-width=".4"/>'
    out += brilho(-a * .45, -b * .62, a * .3, b * .1, -8, .45)
    return f'<g transform="translate({cx:.1f} {cy:.1f}) rotate({rot})">{out}</g>'

def B01_3():   # envoltorios e comparacao celular: celula vegetal (parede celular, vacuolo central, cloroplastos, nucleo)
    k = 'pc'
    x0, y0, W, H = 14, 22, 172, 150
    out = sombra_chao(102, y0 + H + 8, 88, 8)
    parede = f'M{x0 + 14} {y0} H{x0 + W - 14} Q{x0 + W} {y0} {x0 + W} {y0 + 14} V{y0 + H - 14} Q{x0 + W} {y0 + H} {x0 + W - 14} {y0 + H} H{x0 + 14} Q{x0} {y0 + H} {x0} {y0 + H - 14} V{y0 + 14} Q{x0} {y0} {x0 + 14} {y0}Z'
    e = 7
    memb = f'M{x0 + e + 11} {y0 + e} H{x0 + W - e - 11} Q{x0 + W - e} {y0 + e} {x0 + W - e} {y0 + e + 11} V{y0 + H - e - 11} Q{x0 + W - e} {y0 + H - e} {x0 + W - e - 11} {y0 + H - e} H{x0 + e + 11} Q{x0 + e} {y0 + H - e} {x0 + e} {y0 + H - e - 11} V{y0 + e + 11} Q{x0 + e} {y0 + e} {x0 + e + 11} {y0 + e}Z'
    out += (f'<defs>{lin_grad(k + "w", "#b7d77e", "#7fa44a", 0, 0, 1, 1)}'
            f'<radialGradient id="{k}c" cx=".35" cy=".3" r=".85"><stop offset="0" stop-color="#fbfbe6"/><stop offset="1" stop-color="#e3eebc"/></radialGradient>'
            f'<radialGradient id="{k}v" cx=".4" cy=".35" r=".75"><stop offset="0" stop-color="#f1f9ff"/><stop offset="1" stop-color="#b8d9f0"/></radialGradient></defs>')
    out += f'<path d="{parede}" fill="url(#{k}w)" stroke="#4f6e26" stroke-width="1.1"/>'
    out += f'<path d="{memb}" fill="url(#{k}c)" stroke="#8a9a3a" stroke-width="1"/>'
    # vacuolo central (tonoplasto)
    vac = blob(x0 + W * .56, y0 + H * .52, W * .27, H * .3, n=12, amp=.05, seed=7)
    out += f'<path d="{vac}" fill="url(#{k}v)" stroke="#6f9cc2" stroke-width="1"/>'
    out += brilho(x0 + W * .48, y0 + H * .38, 14, 5, -12, .7)
    # nucleo empurrado para a periferia
    out += esfera(x0 + W * .2, y0 + H * .3, 19, '#c06aa8', k + 'n', reflexo=False)
    out += f'<circle cx="{x0 + W * .2 + 4:.1f}" cy="{y0 + H * .3 + 3:.1f}" r="6" fill="#7c2f6b"/>'
    out += brilho(x0 + W * .2 - 7, y0 + H * .3 - 8, 6, 3.4, -30, .6)
    # cloroplastos junto a membrana
    for (x, y, r) in [(.12, .62, 80), (.24, .86, -10), (.5, .14, 4), (.78, .12, -8), (.9, .45, 85), (.88, .8, 70), (.58, .88, 2)]:
        out += cloroplasto(x0 + W * x, y0 + H * y, 30, 15, r, k=f'{k}k{int(x*100)}{int(y*100)}')
    # mitocondria pequena
    out += f'<ellipse cx="{x0 + W * .3:.1f}" cy="{y0 + H * .58:.1f}" rx="9" ry="5" fill="#f2a65a" stroke="#a35a17" stroke-width=".7" transform="rotate(-30 {x0 + W * .3:.1f} {y0 + H * .58:.1f})"/>'
    out += brilho(x0 + 30, y0 + 6, 40, 2.2, 0, .5)
    return out

def B01_5():   # mitocondria e cloroplasto (organelas com DNA e ribossomos proprios: endossimbiose)
    out = sombra_chao(104, 186, 88, 8)
    g, _ = coloca(SV + 'Intracellular_components/Servier/mitochondrium-2.svg', 4, 18, larg=124, rot=-14); out += g
    out += cloroplasto(118, 128, 132, 70, -12, k='b15')
    return out

def B03_5():   # fotossintese: cloroplasto em corte (tilacoides: fase fotoquimica; estroma: ciclo de Calvin) recebendo luz
    k = 'b35'
    out = f'<defs><linearGradient id="{k}r" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffe680" stop-opacity=".95"/><stop offset="1" stop-color="#ffd23f" stop-opacity="0"/></linearGradient></defs>'
    out += sombra_chao(108, 176, 90, 8)
    out += cloroplasto(104, 118, 188, 104, -10, k=k)
    return out

def B02_3():   # proteinas: estrutura e desnaturacao: ovo frito (a clara coagula quando o calor desnatura a albumina)
    k = 'ovo'
    clara = blob(100, 112, 90, 66, n=16, amp=.07, seed=11, rot=-8)
    out = sombra_chao(104, 172, 90, 8, op=.2)
    out += (f'<defs><radialGradient id="{k}c" cx=".42" cy=".36" r=".72"><stop offset="0" stop-color="#ffffff"/><stop offset=".7" stop-color="#f6f4ee"/><stop offset="1" stop-color="#dcd6c8"/></radialGradient>'
            f'<radialGradient id="{k}b" cx=".5" cy=".5" r=".5"><stop offset=".86" stop-color="#d9a35b" stop-opacity="0"/><stop offset="1" stop-color="#c98a3a" stop-opacity=".55"/></radialGradient></defs>')
    out += f'<path d="{clara}" fill="url(#{k}c)" stroke="#b9ac94" stroke-width=".9"/>'
    out += f'<path d="{clara}" fill="url(#{k}b)"/>'   # borda dourada (rendada) da clara frita
    out += f'<path d="{blob(100, 112, 70, 50, n=14, amp=.06, seed=12, rot=-8)}" fill="none" stroke="#e7e1d3" stroke-width="2"/>'
    out += f'<ellipse cx="92" cy="104" rx="38" ry="31" fill="#e9e5da" opacity=".7"/>'
    out += f'<ellipse cx="95" cy="108" rx="34" ry="30" fill="#c76f0f" opacity=".35"/>'
    out += esfera(92, 100, 33, '#f4a412', k + 'g', reflexo=False)
    out += brilho(80, 86, 11, 6.5, -30, .8) + brilho(102, 118, 4, 2, -30, .35)
    return out

def B02_4():   # enzimas: enzima com o sitio ativo e o substrato de forma complementar se encaixando (chave-fechadura)
    rel = SV + 'Intracellular_components/Servier/enzyme-orange-3d.svg'
    vx, vy, vw, vh = vb_de(rel)
    X, Y, alt = 6, 14, 172; kk = alt / vh
    g, _ = coloca(rel, X, Y, alt=alt)
    # contorno frontal do sitio ativo (medido no desenho original, unidades do viewBox) e o substrato complementar
    z = [(59.8, 25.2), (62, 34.2), (52.5, 34.9), (55.8, 42.5), (45.8, 46.4), (55, 51.5), (51, 60.2), (60.4, 60.5), (58.7, 70.2)]
    dx = 8
    fr = [(u + dx, v) for u, v in z] + [(58.7 + dx + 12, 70.2), (58.7 + dx + 22, 62), (58.7 + dx + 25, 47.5), (58.7 + dx + 21, 33), (59.8 + dx + 10, 25.2)]
    T = lambda u, v: (X + (u - vx) * kk, Y + (v - vy) * kk)
    off = (4.6 * kk, -5 * kk)
    F = [T(u, v) for u, v in fr]; B = [(x + off[0], y + off[1]) for x, y in F]
    k = 'sub'
    out = sombra_chao(108, 190, 92, 8) + g
    out += f'<defs>{lin_grad(k + "f", "#7fc3f0", "#2f7fc8", 0, 0, 1, 1)}</defs>'
    # lados (extrusao) e face da frente
    out += f'<path d="{caminho(B)}" fill="#2a68a8" stroke="#3a3a3a" stroke-width="2"/>'
    for i in range(len(F)):
        a, b2 = F[i], F[(i + 1) % len(F)]
        out += f'<path d="M{a[0]:.1f} {a[1]:.1f} L{b2[0]:.1f} {b2[1]:.1f} L{b2[0] + off[0]:.1f} {b2[1] + off[1]:.1f} L{a[0] + off[0]:.1f} {a[1] + off[1]:.1f}Z" fill="#3c86c9" stroke="#3a3a3a" stroke-width="1.6" stroke-linejoin="round"/>'
    out += f'<path d="{caminho(F)}" fill="url(#{k}f)" stroke="#3a3a3a" stroke-width="2.2" stroke-linejoin="round"/>'
    cx = sum(p[0] for p in F) / len(F); cy = sum(p[1] for p in F) / len(F)
    out += brilho(cx + 6, cy - 22, 7, 3, -60, .55)
    return out

import gera_qui
def molecula(smi, seed=7, az=-24, el=30, sem_h=False, escala_lig=.15, raios=None):
    at, lg, m = gera_qui.de_smiles(smi, seed=seed)
    if sem_h:
        keep = [i for i, (e, _) in enumerate(at) if e != 'H']; idx = {o: n for n, o in enumerate(keep)}
        at = [at[i] for i in keep]; lg = [(idx[a], idx[b], o) for a, b, o in lg if a in idx and b in idx]
    old = dict(gera_qui.CPK)
    gera_qui.CPK.update({'P': ('#f08a24', .50)})
    if raios: gera_qui.CPK.update(raios)
    c = gera_qui.bola_bastao(at, lg, az=az, el=el, escala_lig=escala_lig)
    r = c.render(); gera_qui.CPK.clear(); gera_qui.CPK.update(old)
    return r

def B02_5():   # acidos nucleicos, ATP e vitaminas: molecula de ATP (adenina + ribose + 3 fosfatos), geometria do RDKit
    smi = 'Nc1ncnc2c1ncn2[C@@H]1O[C@H](COP(=O)(O)OP(=O)(O)OP(=O)(O)O)[C@@H](O)[C@H]1O'
    return molecula(smi, seed=SEED_ATP, az=-18, el=28, sem_h=True, raios={'C': ('#3c414d', .55), 'N': ('#3566e0', .53), 'O': ('#e23b48', .56), 'P': ('#f08a24', .66)}, escala_lig=.2)
SEED_ATP = 12

def B03_3():   # balanco energetico e o papel do oxigenio: O2 (aceptor final de eletrons) e a agua que ele forma
    at = [('O', (-1.75, .5, 1.25)), ('O', (-.55, .5, 1.25)),
          ('O', (1.15, -.4, .45)), ('H', (1.9, -.4, 1.03)), ('H', (.4, -.4, 1.03))]
    lg = [(0, 1, 2), (2, 3, 1), (2, 4, 1)]
    c = gera_qui.bola_bastao(at, lg, az=-14, el=24, escala_lig=.16)
    return c.render()

def B03_2():   # ciclo de Krebs e cadeia respiratoria: ATP sintase na membrana interna da mitocondria (modelo 3D)
    c = Cena(-26, 26, fundo_z=-.3, desfoque=2.6, op_sombra=.2)
    W, D, e = 2.5, 1.7, .3
    o = c.add(Obj()); caixa(o, -W / 2, W / 2, -D / 2, D / 2, -e / 2, e / 2, '#f6d7a4', amb=.5); o.prof = 50
    cab = c.add(Obj(sombra=False)); cab.prof = -99
    r = .085
    for x in np.arange(-W / 2 + r, W / 2, 2 * r):
        for z in (e / 2 - r, -e / 2 + r):
            cab.esfera((x, -D / 2 - .01, z), r, '#f0a020', reflexo=False)
    for y in np.arange(-D / 2 + r, D / 2, 2 * r):
        for z in (e / 2 - r, -e / 2 + r):
            cab.esfera((W / 2 + .01, y, z), r, '#f0a020', reflexo=False)
    topo = c.add(Obj(sombra=False)); topo.prof = -98.5
    for x in np.arange(-W / 2 + r, W / 2, 2 * r):
        for y in np.arange(-D / 2 + r, D / 2, 2 * r):
            if (x - .1) ** 2 + y * y > .47 ** 2: topo.esfera((x, y, e / 2 + .01), r * .98, '#f0a020', reflexo=False)
    f0 = c.add(Obj(sombra=False)); f0.prof = -100
    cilindro_liso(f0, (.1, 0, e / 2 - .02), (0, 0, .22), .42, cor='#8a63b8', brilho=.3, tampa_cor='#a487cc')
    hp = c.add(Obj(sombra=False)); hp.prof = -101
    cilindro_liso(hp, (.62, .12, e / 2), (-.12, 0, 1.55), .07, cor='#d98a3a')
    h = c.add(Obj(sombra=False)); h.prof = -101.5
    cilindro_liso(h, (.1, 0, e / 2 + .2), (0, 0, .7), .1, cor='#5b8bd6')
    cx_ = c.add(Obj(sombra=False)); cx_.prof = -100.5   # complexos I, III e IV da cadeia transportadora de eletrons
    for (x, y, r, h, cor) in [(-.85, .25, .26, .62, '#4fae8a'), (-.62, -.42, .22, .5, '#e07a5f'), (.8, -.5, .2, .46, '#c9a227')]:
        cilindro_liso(cx_, (x, y, -e / 2 - .08), (0, 0, e + h * .45), r, cor=cor, brilho=.3)
    cx_.esfera((-.3, -.1, e / 2 + .28), .1, '#d65b4a')   # citocromo c
    f1 = c.add(Obj(sombra=False)); f1.prof = -102
    for i in range(6):
        a = 2 * math.pi * i / 6 + .3
        f1.esfera((.1 + .3 * math.cos(a), .3 * math.sin(a), e / 2 + 1.12), .27, '#d9534f' if i % 2 else '#4f8fd0')
    f1.esfera((.1, 0, e / 2 + 1.46), .13, '#e3a33b')
    return c.render()

# ----------------------------------------------------------------------------------- cromossomos (estilo do B04)
def _len(pts): return sum(math.dist(pts[i], pts[i + 1]) for i in range(len(pts) - 1))

def braco(pts, w, base, escuro, bandas, k, contorno='#3b2a4a'):
    """um braco de cromatide: tubo de ponta arredondada com bandas (frac. ao longo do braco) e reflexo"""
    d = suave(pts, fechado=False)
    L = _len(pts)
    out = (f'<path d="{d}" fill="none" stroke="{contorno}" stroke-width="{w + 2.2:.1f}" stroke-linecap="round"/>'
           f'<path d="{d}" fill="none" stroke="{base}" stroke-width="{w:.1f}" stroke-linecap="round"/>')
    if bandas:
        da = [0]; pos = 0
        for a, b in bandas:
            da += [max(0, a - pos) * 100, (b - a) * 100]; pos = b
        if len(da) % 2: da += [0]
        da += [max(0, 1 - pos) * 100 + 200]
        out += f'<path d="{d}" fill="none" stroke="{escuro}" stroke-width="{w:.1f}" stroke-dasharray="{" ".join(f"{v:.1f}" for v in da)}" pathLength="100"/>'
    # sombra propria (lado direito) e reflexo (lado esquerdo)
    sh = [(x + w * .22, y) for x, y in pts]; hl = [(x - w * .2, y - w * .05) for x, y in pts]
    out += f'<path d="{suave(sh, fechado=False)}" fill="none" stroke="#000" stroke-width="{w * .35:.1f}" stroke-linecap="round" opacity=".12"/>'
    out += f'<path d="{suave(hl, fechado=False)}" fill="none" stroke="#fff" stroke-width="{w * .22:.1f}" stroke-linecap="round" opacity=".55"/>'
    return out

_CR = [0]
def cromatide(C, tc, w, cor, escuro, bandas, outra=None):
    """C: linha central (lista de pontos de cima para baixo); tc: posicao do centromero (0..1); bandas: [(t0, t1)] em
    fracao do comprimento; outra = (t_troca, cor, escuro, bandas): a partir de t_troca o pedaco veio do homologo"""
    _CR[0] += 1; k = f'cr{_CR[0]}'
    n = 60; P = np.array(C, float)
    seg = np.r_[0, np.cumsum(np.linalg.norm(np.diff(P, axis=0), axis=1))]; T = seg / seg[-1]
    ts = np.linspace(0, 1, n)
    X = np.interp(ts, T, P[:, 0]); Y = np.interp(ts, T, P[:, 1])
    Pt = np.stack([X, Y], 1)
    tg = np.gradient(Pt, axis=0); tg /= np.linalg.norm(tg, axis=1)[:, None]; nr = np.stack([-tg[:, 1], tg[:, 0]], 1)
    larg = w / 2 * (1 - .42 * np.exp(-((ts - tc) / .035) ** 2))
    E = Pt + nr * larg[:, None]; D = Pt - nr * larg[:, None]
    def tampa(c, a0, r, sentido):
        return [(c[0] + r * math.cos(a0 + sentido * math.pi * q / 8), c[1] + r * math.sin(a0 + sentido * math.pi * q / 8)) for q in range(1, 8)]
    a_fim = math.atan2(nr[-1, 1], nr[-1, 0]); a_ini = math.atan2(-nr[0, 1], -nr[0, 0])
    contorno = list(map(tuple, E)) + tampa(Pt[-1], a_fim, larg[-1], -1) + list(map(tuple, D[::-1])) + tampa(Pt[0], a_ini, larg[0], -1)
    d = caminho(contorno)
    bb = (min(p[0] for p in contorno) - 2, min(p[1] for p in contorno) - 2)
    out = (f'<defs><linearGradient id="{k}g" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="{mix(cor, "#ffffff", .5)}"/>'
           f'<stop offset=".45" stop-color="{cor}"/><stop offset="1" stop-color="{mix(cor, "#000000", .22)}"/></linearGradient>'
           f'<clipPath id="{k}c"><path d="{d}"/></clipPath></defs>')
    out += f'<path d="{d}" fill="url(#{k}g)"/>'
    def faixa(t0, t1, fill, op=1):
        i0, i1 = int(t0 * (n - 1)), max(int(t0 * (n - 1)) + 1, int(round(t1 * (n - 1))))
        q = [tuple(Pt[i] + nr[i] * (w)) for i in range(i0, i1 + 1)] + [tuple(Pt[i] - nr[i] * (w)) for i in range(i1, i0 - 1, -1)]
        if t1 >= .999: q = [tuple(Pt[i] + nr[i] * w) for i in range(i0, n)] + [tuple(Pt[-1] + tg[-1] * w * 2 + nr[-1] * w), tuple(Pt[-1] + tg[-1] * w * 2 - nr[-1] * w)] + [tuple(Pt[i] - nr[i] * w) for i in range(n - 1, i0 - 1, -1)]
        return f'<path d="{caminho(q)}" fill="{fill}"' + (f' opacity="{op}"' if op != 1 else '') + '/>'
    dentro = ''
    for t0, t1 in bandas:
        if outra and t1 > outra[0]: continue
        dentro += faixa(t0, t1, escuro, .85)
    if outra:
        dentro += faixa(outra[0], 1, outra[1])
        for t0, t1 in outra[3]: dentro += faixa(t0, t1, outra[2], .85)
    # volume: sombra no lado direito e reflexo no esquerdo, por cima das bandas
    dentro += f'<path d="{suave([tuple(p) for p in (Pt + nr * larg[:, None] * .55)[3:-3]], fechado=False)}" fill="none" stroke="#ffffff" stroke-width="{w * .16:.1f}" stroke-linecap="round" opacity=".55"/>'
    dentro += f'<path d="{suave([tuple(p) for p in (Pt - nr * larg[:, None] * .7)[2:-2]], fechado=False)}" fill="none" stroke="#000000" stroke-width="{w * .22:.1f}" stroke-linecap="round" opacity=".13"/>'
    out += f'<g clip-path="url(#{k}c)">{dentro}</g>'
    out += f'<path d="{d}" fill="none" stroke="#33263f" stroke-width="1.3" stroke-linejoin="round"/>'
    return out

def cromossomo(cx, cy, Lp, Lq, w=13, cor='#e9ddf0', escuro='#5d3a7d', bp=(), bq=(), abre=.05, rot=0, sat=False, troca=None):
    """cromossomo duplicado: 2 cromatides-irmas unidas no centromero, que fica em (cx, cy). Lp/Lq: bracos curto/longo.
    bp/bq: bandas escuras (fracoes de cada braco, do centromero para a ponta).
    troca = (lado, frac do braco q, cor, escuro, bandas do pedaco): ponta do braco q vinda do homologo (crossing-over)"""
    out = ''
    Lt = Lp + Lq; tc = Lp / Lt
    for lado in (-1, 1):
        g = w * .5 - .4
        C = [(lado * (g + Lp * abre), -Lp), (lado * g, 0), (lado * (g + Lq * abre), Lq)]
        bandas = [(tc - b * tc, tc - a * tc) for a, b in bp] + [(tc + a * (1 - tc), tc + b * (1 - tc)) for a, b in bq]
        outra = None
        if troca and troca[0] == lado:
            f = tc + troca[1] * (1 - tc)
            outra = (f, troca[2], troca[3], [(tc + a * (1 - tc), tc + b * (1 - tc)) for a, b in (troca[4] if len(troca) > 4 else ())])
        if sat:
            x, y = C[0]
            out += f'<line x1="{x:.1f}" y1="{y:.1f}" x2="{x + lado * 1.5:.1f}" y2="{y - 7:.1f}" stroke="#33263f" stroke-width="1.3"/>'
            out += f'<circle cx="{x + lado * 1.5:.1f}" cy="{y - 9:.1f}" r="{w * .3:.1f}" fill="{cor}" stroke="#33263f" stroke-width="1.1"/>'
        out += cromatide(C, tc, w, cor, escuro, bandas, outra)
    return f'<g transform="translate({cx:.1f} {cy:.1f}) rotate({rot})">{out}</g>'

ROXO = ('#e9ddf0', '#5d3a7d')
AZUL = ('#d6e6f7', '#2d5f9a')
ROSA = ('#f7dbe4', '#a8325e')

def B04_3():   # meiose e crossing-over: tetrade — 2 homologos duplicados (4 cromatides) pareados, cada par de irmas preso
    # no centromero, e as cromatides internas (uma de cada homologo) cruzadas num quiasma em X
    # (correcao da revisao de 29/10: antes as irmas nao apareciam unidas no centromero e o par lia como fileira de
    #  bastoes, igual ao B04.4)
    out = sombra_chao(100, 190, 62, 7)
    w = 15; yc, yt, yb, yx = 66, 20, 180, 124
    tc = (yc - yt) / (yb - yt); tx = (yx - yt) / (yb - yt)
    bA = [(.08, .14), (.36, .43)]; bR = [(.1, .16), (.34, .4)]
    pA = [(.72, .78), (.86, .92)]; pR = [(.74, .8), (.88, .94)]   # bandas das pontas (depois do quiasma)
    AZ, RS = ('#9cc2ee', '#1f4f8a'), ('#f2aac4', '#9c1f50')   # mais saturados que AZUL/ROSA: a troca le a 64 px
    g = ''
    # cromatides externas (as que nao participam da permuta)
    g += cromatide([(-25, yt), (-21.5, yc), (-30, yb)], tc, w, *AZ, bA + pA)
    g += cromatide([(25, yt), (21.5, yc), (30, yb)], tc, w, *RS, bR + pR)
    # cromatides internas: descem coladas a irma e se cruzam no quiasma em X (cada uma mantem a sua cor ate o
    # quiasma ser desfeito; e ali que os pedacos se trocam)
    g += cromatide([(-10, yt), (-7.5, yc), (-5, yx - 26), (0, yx), (9, yx + 26), (15, yb)], tc, w, *AZ, bA + pA)
    g += cromatide([(10, yt), (7.5, yc), (5, yx - 26), (0, yx), (-9, yx + 26), (-15, yb)], tc, w, *RS, bR + pR)
    # centromeros: o ponto (cinetocoro) que prende as irmas de cada homologo
    for x in (-14.5, 14.5):
        g += f'<circle cx="{x}" cy="{yc}" r="3.6" fill="#3b2a4d"/><circle cx="{x - 1.1}" cy="{yc - 1.1}" r="1.1" fill="#fff" opacity=".45"/>'
    return out + f'<g transform="translate(100 0)">{g}</g>'

def crom_leve(x, y, Lp, Lq, w, cor, escuro, gid, bandas=(), sat=False):
    """cromossomo metafasico simplificado para o cariotipo (leve: um contorno so, com a constricao do centromero
    em y e bandas como faixas). Lp/Lq: bracos curto e longo"""
    r = w / 2; c = r * .55
    d = (f'M{x - r:.1f} {y - Lp + r:.1f} A{r:.1f} {r:.1f} 0 0 1 {x + r:.1f} {y - Lp + r:.1f} L{x + r:.1f} {y - 2.2:.1f} '
         f'Q{x + c:.1f} {y:.1f} {x + r:.1f} {y + 2.2:.1f} L{x + r:.1f} {y + Lq - r:.1f} A{r:.1f} {r:.1f} 0 0 1 {x - r:.1f} {y + Lq - r:.1f} '
         f'L{x - r:.1f} {y + 2.2:.1f} Q{x - c:.1f} {y:.1f} {x - r:.1f} {y - 2.2:.1f}Z')
    o = ''
    if sat:
        o += f'<line x1="{x:.1f}" y1="{y - Lp:.1f}" x2="{x:.1f}" y2="{y - Lp - 4:.1f}" stroke="{escuro}" stroke-width="1"/><circle cx="{x:.1f}" cy="{y - Lp - 5.5:.1f}" r="{r * .5:.1f}" fill="{cor}" stroke="{escuro}" stroke-width=".9"/>'
    o += f'<path d="{d}" fill="url(#{gid})" stroke="{escuro}" stroke-width="1"/>'
    for t0, t1 in bandas:   # fracoes do braco longo
        y0 = y + 2 + (Lq - 4) * t0; y1 = y + 2 + (Lq - 4) * t1
        o += f'<rect x="{x - r + .6:.1f}" y="{y0:.1f}" width="{w - 1.2:.1f}" height="{y1 - y0:.1f}" fill="{escuro}" opacity=".75"/>'
    o += f'<line x1="{x - r * .45:.1f}" y1="{y - Lp + r:.1f}" x2="{x - r * .45:.1f}" y2="{y + Lq - r:.1f}" stroke="#fff" stroke-width="{w * .14:.1f}" stroke-linecap="round" opacity=".5"/>'
    return o

def B04_4():   # nao disjuncao e aneuploidia: cariotipo em grade com a trissomia do 21 (tres cromossomos 21) destacada
    # (correcao da revisao de 29/10: antes eram tres bastoes iguais aos do B04.3; agora e um cariotipo, com os pares
    #  em lilas-acinzentado e o trio do 21 em magenta, num quadro destacado)
    out = sombra_chao(100, 192, 92, 7)
    out += (f'<defs>{lin_grad("kc", "#f1edf5", "#bfb3cc", 0, 0, 1, 0)}{lin_grad("k21", "#ffd0e3", "#e0648f", 0, 0, 1, 0)}</defs>')
    out += '<rect x="4" y="8" width="192" height="182" rx="8" fill="#fbfaf6" stroke="#c9c3b5" stroke-width="1"/>'
    tam = [(15, 36), (14, 33), (11, 32), (10, 30), (10, 28), (9, 26), (9, 24), (8, 23), (8, 22), (7, 21), (7, 20)]
    cols = [30, 77, 124, 171]; rows = [52, 108, 162]
    i = 0
    for r_, yy in enumerate(rows):
        for c_, xx in enumerate(cols):
            if r_ == 2 and c_ == 3: break
            Lp, Lq = tam[i]; i += 1
            for dx in (-7.5, 7.5):
                out += crom_leve(xx + dx, yy - (Lq - Lp) / 2 + 2, Lp, Lq, 11, '#e4dfe9', '#5e4d70', 'kc', [(.35, .5)])
    # o trio do 21 (pequeno e acrocentrico, com satelites), em destaque
    out += '<rect x="140" y="128" width="52" height="56" rx="6" fill="#fde7f1" stroke="#c2185b" stroke-width="2.4"/>'
    for dx in (-14, 0, 14):
        out += crom_leve(166 + dx, 144, 4, 30, 11, '#f7b9d3', '#a0104a', 'k21', [(.3, .48)], sat=True)
    return out

def B06_5():   # heranca ligada ao sexo: cromossomos X (grande, submetacentrico) e Y (pequeno, acrocentrico)
    out = sombra_chao(104, 186, 80, 7)
    out += cromossomo(70, 70, 52, 108, 17, *ROSA, [(.25, .4), (.65, .8)], [(.12, .22), (.38, .5), (.66, .74), (.86, .94)], rot=-3)
    out += cromossomo(146, 100, 8, 74, 16, *AZUL, (), [(.2, .32), (.55, .85)], rot=3, sat=False)
    return out

def B04_1():   # ciclo celular: G1, S, G2 (interfase) e M (mitose), modelo 3D com as fases em proporcao aproximada
    from gera_mat2 import texto_no_plano, SANS_B
    c = Cena(-18, 52, op_sombra=0)
    fases = [('G₁', .40, '#4f9a6a'), ('S', .28, '#3f72b8'), ('G₂', .20, '#e3a33b'), ('M', .12, '#d65b4a')]
    R1, R0, e, gap = 1.45, .82, .30, .045
    a = math.pi / 2
    sob = []
    for nome, f, cor in fases:
        a0, a1 = a - gap, a - 2 * math.pi * f + gap   # sentido horario visto de cima
        a = a - 2 * math.pi * f
        n = max(8, int(60 * f))
        ang = np.linspace(a0, a1, n)
        if nome == 'M':   # ponta de seta no fim do ciclo
            ang = np.linspace(a0, a1 + .12, n)
            fora = [(R1 * math.cos(t), R1 * math.sin(t)) for t in ang]
            dentro = [(R0 * math.cos(t), R0 * math.sin(t)) for t in ang[::-1]]
            tm = a1 - .16; Rm = (R0 + R1) / 2
            ponta = [((R1 + .16) * math.cos(a1 + .12), (R1 + .16) * math.sin(a1 + .12)), (Rm * math.cos(tm), Rm * math.sin(tm)), ((R0 - .16) * math.cos(a1 + .12), (R0 - .16) * math.sin(a1 + .12))]
            pts = fora + ponta + dentro
        else:
            pts = [(R1 * math.cos(t), R1 * math.sin(t)) for t in ang] + [(R0 * math.cos(t), R0 * math.sin(t)) for t in ang[::-1]]
        o = c.add(Obj()); extrusao(o, pts[::-1], 0, e, cor, cor, brilho=.3, amb=.38)
        am = (a0 + a1) / 2; Rm = (R0 + R1) / 2
        sob.append((nome, Rm * math.cos(am), Rm * math.sin(am)))
    def rot(cam):
        out = ''
        for nome, x, y in sob:
            out += texto_no_plano(cam, nome, lambda *p: p, x, y, e + .005, .3, '#ffffff', SANS_B)
        return out
    c.sobre.append(rot)
    return sombra_chao(100, 150, 90, 14, op=.2, blur=5) + c.render()

# =============================================================================================== B06 Genetica classica
# (modulo: vagem de ervilha aberta com 3 sementes amarelas e 1 verde)
AMARELA, VERDE = '#e9c23a', '#86b64a'
def hilo(cx, cy, r, cor):
    # hilo: a cicatriz onde a semente se prendia a vagem
    x, y = cx + r * .52, cy + r * .5
    return (f'<ellipse cx="{x:.1f}" cy="{y:.1f}" rx="{r * .16:.1f}" ry="{r * .08:.1f}" fill="{mix(cor, "#000000", .55)}" opacity=".75" transform="rotate(-45 {x:.1f} {y:.1f})"/>'
            f'<ellipse cx="{x - .6:.1f}" cy="{y - .8:.1f}" rx="{r * .12:.1f}" ry="{r * .035:.1f}" fill="{mix(cor, "#ffffff", .5)}" opacity=".7" transform="rotate(-45 {x:.1f} {y:.1f})"/>')

def ervilha(cx, cy, r, cor, k, rugosa=False):
    if not rugosa:
        return esfera(cx, cy, r, cor, k) + hilo(cx, cy, r, cor)
    # semente rugosa (alelo r: menos amido, perde agua e enruga ao secar)
    d = blob(cx, cy, r * 1.02, r * .94, n=13, amp=.06, seed=hash(k) % 97, rot=10)
    out = forma(d, mix(cor, '#000000', .06), k, sw=.9, claro=.45, escuro=.5)
    rng = np.random.default_rng(len(k) * 7)
    for q in range(6):
        a = rng.uniform(0, 2 * math.pi); r0 = r * rng.uniform(.15, .5); L = r * rng.uniform(.4, .7)
        x0, y0 = cx + r0 * math.cos(a), cy + r0 * math.sin(a); b = a + rng.uniform(-1.3, 1.3)
        x1, y1 = x0 + L * math.cos(b), y0 + L * math.sin(b)
        mx, my = (x0 + x1) / 2 + rng.uniform(-4, 4), (y0 + y1) / 2 + rng.uniform(-4, 4)
        out += f'<path d="M{x0:.1f} {y0:.1f} Q{mx:.1f} {my:.1f} {x1:.1f} {y1:.1f}" fill="none" stroke="{mix(cor, "#000000", .45)}" stroke-width="1.6" stroke-linecap="round" opacity=".7"/>'
        out += f'<path d="M{x0 - 1.4:.1f} {y0 - 1.6:.1f} Q{mx - 1.4:.1f} {my - 1.6:.1f} {x1 - 1.4:.1f} {y1 - 1.6:.1f}" fill="none" stroke="{mix(cor, "#ffffff", .55)}" stroke-width="1.1" stroke-linecap="round" opacity=".7"/>'
    out += brilho(cx - r * .38, cy - r * .42, r * .2, r * .11, -30, .55) + hilo(cx, cy, r, cor)
    return out

def B06_1():   # 1a lei de Mendel: um carater (cor da semente): ervilha amarela (dominante) e verde (recessiva)
    out = sombra_chao(104, 160, 88, 9)
    out += ervilha(64, 104, 50, AMARELA, 'e1a') + ervilha(146, 112, 42, VERDE, 'e1v')
    return out

def B06_2():   # 2a lei de Mendel: dois carateres (cor e textura): as 4 classes da F2 (9:3:3:1)
    out = sombra_chao(102, 176, 90, 9)
    out += ervilha(58, 70, 38, AMARELA, 'e2a') + ervilha(144, 70, 38, AMARELA, 'e2ar', True)
    out += ervilha(58, 146, 38, VERDE, 'e2v') + ervilha(144, 146, 38, VERDE, 'e2vr', True)
    return out

def B06_3():   # heredograma: pecas 3D (quadrado = homem, circulo = mulher, cheio = afetado); casal normal com filha afetada
    c = Cena(-14, 50, op_sombra=.22)
    BR, AF, LN = '#f4f1ea', '#2f4f86', '#3a3d46'
    e = .22; L = .62
    def homem(x, y, af=False):
        o = c.add(Obj()); caixa_chanfro(o, x - L / 2, x + L / 2, y - L / 2, y + L / 2, 0, e, .04, AF if af else BR, amb=.45, brilho=.25)
    def mulher(x, y, af=False):
        o = c.add(Obj()); cilindro_liso(o, (x, y, 0), (0, 0, e), L / 2 * 1.08, cor=AF if af else BR, brilho=.3, amb=.45)
    def barra(x0, y0, x1, y1):
        o = c.add(Obj()); w = .05
        caixa(o, min(x0, x1) - w, max(x0, x1) + w, min(y0, y1) - w, max(y0, y1) + w, 0, .06, LN, amb=.5)
    # geracao I (fundo) e geracao II (frente)
    yI, yII = 1.1, -1.0
    homem(-.9, yI); mulher(.9, yI)
    barra(-.55, yI, .55, yI); barra(0, yI, 0, .05); barra(-1.35, .05, 1.35, .05)
    for x in (-1.35, 0, 1.35): barra(x, .05, x, yII + .36)
    homem(-1.35, yII); mulher(0, yII, True); homem(1.35, yII)
    return c.render()

def B06_4():   # alelos multiplos e sistema ABO/Rh: bolsa de sangue com a etiqueta do tipo sanguineo
    from motor import texto_path
    k = 'bs'
    out = sombra_chao(104, 192, 66, 7)
    out += (f'<defs><linearGradient id="{k}p" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#e9f1f5" stop-opacity=".9"/><stop offset=".5" stop-color="#ffffff" stop-opacity=".6"/><stop offset="1" stop-color="#cfdbe2" stop-opacity=".9"/></linearGradient>'
            f'<linearGradient id="{k}s" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8e0f18"/><stop offset=".35" stop-color="#c8202c"/><stop offset=".7" stop-color="#a5121d"/><stop offset="1" stop-color="#6d0a11"/></linearGradient></defs>')
    bolsa = 'M44 34 Q44 22 56 22 H144 Q156 22 156 34 V150 Q156 168 138 170 H62 Q44 168 44 150 Z'
    out += f'<path d="{bolsa}" fill="url(#{k}p)" stroke="#8fa3ad" stroke-width="1.2"/>'
    sangue = 'M50 52 H150 V148 Q150 162 136 164 H64 Q50 162 50 148 Z'
    out += f'<path d="{sangue}" fill="url(#{k}s)"/>'
    out += f'<path d="M50 52 H150" stroke="#e06a72" stroke-width="1.4" opacity=".7"/>'
    # alca de pendurar (furo) e soldas
    out += f'<rect x="84" y="27" width="32" height="9" rx="4.5" fill="#ffffff" stroke="#8fa3ad" stroke-width="1"/>'
    out += f'<path d="M44 40 H156" stroke="#b9c8cf" stroke-width="1" opacity=".8"/>'
    # tubos e conectores na base
    for x, comp in ((80, 22), (100, 28), (120, 20)):
        out += f'<rect x="{x - 5}" y="166" width="10" height="{comp}" rx="2" fill="#dfe8ec" stroke="#8fa3ad" stroke-width="1"/>'
        out += f'<rect x="{x - 3}" y="168" width="6" height="{comp - 4}" rx="1.5" fill="#b3141f" opacity=".85"/>'
    # etiqueta com o tipo
    out += f'<rect x="66" y="78" width="68" height="56" rx="5" fill="#ffffff" stroke="#c9d3d8" stroke-width="1"/>'
    out += f'<rect x="66" y="78" width="68" height="13" rx="5" fill="#2f4f86"/><rect x="66" y="85" width="68" height="6" fill="#2f4f86"/>'
    d = texto_path('AB+', lambda u, v: (100 + u, 116 - v), 27, '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf')
    out += f'<path d="{d}" fill="#b3141f"/>'
    out += brilho(58, 70, 4, 26, 0, .45) + brilho(141, 60, 2, 12, 0, .3)
    return out

def B06_6():   # heranca quantitativa (poligenica): a cor da pele em gradacao continua, varios genes somando efeito
    rel = SV + 'Human_physiology/Servier/hand.svg'
    w, h = tam(rel, alt=150)
    g, _ = coloca(rel, 0, 0, alt=150)
    out = f'<defs><g id="mao">{g}</g>'
    base = hx('#f9cebc')
    alvo = ['#f9cebc', '#e3ad8a', '#c48a63', '#93603e', '#5f3d27']   # gradacao de tons de pele, do mais claro ao mais escuro
    tons = alvo
    for i, t in enumerate(alvo):
        r, g_, b = [hx(t)[q] / base[q] for q in range(3)]
        out += (f'<filter id="tom{i}" color-interpolation-filters="sRGB"><feComponentTransfer>'
                f'<feFuncR type="linear" slope="{r:.3f}"/><feFuncG type="linear" slope="{g_:.3f}"/><feFuncB type="linear" slope="{b:.3f}"/></feComponentTransfer></filter>')
    out += '</defs>' + sombra_chao(104, 186, 92, 8)
    for i, t in enumerate(tons):
        a = -32 + i * 16; x = 100 - w / 2 + (i - 2) * 16
        out += f'<use href="#mao" xlink:href="#mao" filter="url(#tom{i})" transform="rotate({a} 100 196) translate({x:.1f} 38) scale(.86)"/>'
    return out

# =============================================================================================== B05 (continuacao)
def B05_4():   # mutacao pontual: hemacia normal e hemacia falciforme (anemia falciforme: troca de uma base, GAG -> GTG)
    out = sombra_chao(104, 172, 90, 8)
    g, _ = coloca(SV + 'Blood_Immunology/Servier/erythrocyte.svg', 2, 30, larg=112, rot=-10); out += g
    g, _ = coloca(SV + 'Blood_Immunology/Servier/falciform-erythrocyte-2.svg', 84, 70, larg=114, rot=-6); out += g
    return out

def B05_5():   # regulacao genica e diferenciacao: celula-tronco que origina celulas especializadas (mesmo DNA, genes diferentes ativos)
    out = sombra_chao(104, 186, 92, 8)
    g, _ = coloca(SV + 'Blood_Immunology/Servier/pluripotent-stem-cell.svg', 2, 46, larg=104); out += g
    g, _ = coloca(SV + 'Blood_Immunology/Servier/erythrocyte.svg', 118, 6, larg=70, rot=-8); out += g
    g, _ = coloca(SV + 'Human_physiology/Servier/smooth-muscle-fiber.svg', 104, 78, larg=96, rot=-12); out += g
    g, _ = coloca(SV + 'Human_physiology/Servier/adipocyte-1.svg', 116, 116, larg=66); out += g
    return out

# ----------------------------------------------------------------------------------- neuronio (desenho do projeto)
def galho(pts, w0, w1, n=30):
    """contorno de um ramo afilado (largura w0 na base, w1 na ponta) ao longo de uma curva"""
    P = np.array(pts, float)
    seg = np.r_[0, np.cumsum(np.linalg.norm(np.diff(P, axis=0), axis=1))]; T = seg / (seg[-1] or 1)
    ts = np.linspace(0, 1, n); X = np.interp(ts, T, P[:, 0]); Y = np.interp(ts, T, P[:, 1])
    Pt = np.stack([X, Y], 1)
    tg = np.gradient(Pt, axis=0); tg /= np.linalg.norm(tg, axis=1)[:, None] + 1e-9; nr = np.stack([-tg[:, 1], tg[:, 0]], 1)
    larg = (w0 + (w1 - w0) * ts ** .8) / 2
    E = Pt + nr * larg[:, None]; D = Pt - nr * larg[:, None]
    return caminho(list(map(tuple, E)) + [tuple(Pt[-1] + tg[-1] * larg[-1])] + list(map(tuple, D[::-1])))

def arvore(x, y, ang, comp, w, nivel, rng, out):
    if nivel == 0 or comp < 5: return
    pts = [(x, y)]
    a = ang
    for q in range(4):
        a += rng.uniform(-.25, .25)
        x += comp / 4 * math.cos(a); y += comp / 4 * math.sin(a); pts.append((x, y))
    out.append(galho(pts, w, w * .55))
    for s in (-1, 1):
        arvore(x, y, a + s * rng.uniform(.35, .7), comp * rng.uniform(.55, .72), w * .55, nivel - 1, rng, out)

def neuronio(k, cx=58, cy=62, esc=1.0, ax=(1, 1), seed=3, comp_axonio=150, terminal=True, cor='#f2b84b'):
    rng = np.random.default_rng(seed)
    C = mix(cor, '#000000', .45)
    ramos = []
    for a in np.linspace(math.pi * .55, math.pi * 2.25, 6):
        if abs(((a - math.atan2(ax[1], ax[0])) + math.pi) % (2 * math.pi) - math.pi) < .7: continue
        arvore(cx + 12 * esc * math.cos(a), cy + 12 * esc * math.sin(a), a, 30 * esc, 8 * esc, 3, rng, ramos)
    out = f'<defs>{grad_forma(k + "c", cor, .38, .32, .8, .5, .35)}</defs>'
    for d in ramos: out += f'<path d="{d}" fill="url(#{k}c)" stroke="{C}" stroke-width=".8" stroke-linejoin="round"/>'
    # axonio
    ux, uy = ax[0] / math.hypot(*ax), ax[1] / math.hypot(*ax); nx, ny = -uy, ux
    A = [(cx + ux * t + nx * 4 * esc * math.sin(t / 30), cy + uy * t + ny * 4 * esc * math.sin(t / 30)) for t in np.linspace(0, comp_axonio * esc, 30)]
    out += f'<path d="{galho(A, 7 * esc, 4.5 * esc)}" fill="url(#{k}c)" stroke="{C}" stroke-width=".8"/>'
    # bainha de mielina (celulas de Schwann) com nodulos de Ranvier
    t0 = 26 * esc; L = 19 * esc; gap = 4.5 * esc
    out += f'<defs><linearGradient id="{k}m" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".55" stop-color="#e6eef6"/><stop offset="1" stop-color="#a9bccd"/></linearGradient></defs>'
    t = t0
    while t + L < comp_axonio * esc - 14 * esc:
        seg = [(cx + ux * q + nx * 4 * esc * math.sin(q / 30), cy + uy * q + ny * 4 * esc * math.sin(q / 30)) for q in np.linspace(t, t + L, 8)]
        a = math.degrees(math.atan2(seg[-1][1] - seg[0][1], seg[-1][0] - seg[0][0]))
        mx, my = (seg[0][0] + seg[-1][0]) / 2, (seg[0][1] + seg[-1][1]) / 2
        out += f'<rect x="{mx - L / 2:.1f}" y="{my - 7 * esc:.1f}" width="{L:.1f}" height="{14 * esc:.1f}" rx="{6.5 * esc:.1f}" fill="url(#{k}m)" stroke="#7d93a8" stroke-width=".8" transform="rotate({a:.1f} {mx:.1f} {my:.1f})"/>'
        t += L + gap
    # terminais do axonio com botoes sinapticos
    ex, ey = A[-1]
    if terminal:
        for b in (-.7, -.2, .3, .75):
            aa = math.atan2(uy, ux) + b
            x1, y1 = ex + 16 * esc * math.cos(aa), ey + 16 * esc * math.sin(aa)
            out += f'<path d="{galho([(ex, ey), ((ex + x1) / 2 + 2, (ey + y1) / 2), (x1, y1)], 3.4 * esc, 2.2 * esc)}" fill="url(#{k}c)" stroke="{C}" stroke-width=".7"/>'
            out += f'<circle cx="{x1:.1f}" cy="{y1:.1f}" r="{3.6 * esc:.1f}" fill="url(#{k}c)" stroke="{C}" stroke-width=".7"/>'
    # corpo celular e nucleo
    soma = blob(cx, cy, 17 * esc, 15 * esc, n=9, amp=.08, seed=seed)
    out += f'<path d="{soma}" fill="url(#{k}c)" stroke="{C}" stroke-width=".9"/>'
    out += esfera(cx - 1 * esc, cy, 7 * esc, '#8a5aa8', k + 'n', reflexo=False)
    out += f'<circle cx="{cx + 1.5 * esc:.1f}" cy="{cy + 1.5 * esc:.1f}" r="{2.2 * esc:.1f}" fill="#4a2466"/>'
    out += brilho(cx - 7 * esc, cy - 8 * esc, 5 * esc, 2.6 * esc, -30, .55)
    return out

def B08_1():   # neuronio: dendritos, corpo celular, axonio com bainha de mielina (nodulos de Ranvier) e terminais
    return sombra_chao(108, 192, 80, 7, op=.15) + neuronio('n81', 50, 52, 1.05, (1, 1.05), seed=5, comp_axonio=150)

def B08_2():   # sinapse quimica: terminal pre-sinaptico com vesiculas liberando neurotransmissor na fenda; receptores na membrana pos
    k = 's82'
    out = (f'<defs>{grad_forma(k + "a", "#f2b84b", .38, .25, .85, .5, .35)}'
           f'<linearGradient id="{k}b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6c7d3"/><stop offset="1" stop-color="#d77d95"/></linearGradient></defs>')
    out += sombra_chao(100, 190, 84, 7)
    # neuronio pos-sinaptico (dendrito) embaixo
    pos = 'M8 150 C40 136 70 132 100 132 C130 132 160 136 192 150 L192 182 C150 176 50 176 8 182 Z'
    out += f'<path d="{pos}" fill="url(#{k}b)" stroke="#8f3a52" stroke-width="1"/>'
    for x in np.linspace(46, 154, 7):   # receptores na membrana pos-sinaptica
        y = 132 + ((x - 100) / 92) ** 2 * 18 - 1
        out += f'<rect x="{x - 3.6:.1f}" y="{y - 6:.1f}" width="7.2" height="11" rx="2.2" fill="#4f8fd0" stroke="#264f80" stroke-width=".7"/>'
        out += f'<rect x="{x - 1:.1f}" y="{y - 6:.1f}" width="2" height="11" fill="#9cc4ec"/>'
    # terminal pre-sinaptico (botao) em cima
    pre = 'M70 0 C70 22 66 34 46 52 C26 72 28 116 60 122 C82 126 118 126 140 122 C172 116 174 72 154 52 C134 34 130 22 130 0 Z'
    out += f'<path d="{pre}" fill="url(#{k}a)" stroke="#8c5512" stroke-width="1.1"/>'
    # vesiculas sinapticas com neurotransmissor
    rng = np.random.default_rng(2)
    for (x, y, r) in [(62, 70, 10), (88, 62, 10), (116, 66, 10), (138, 78, 9), (74, 96, 10), (102, 92, 10), (128, 100, 9.5), (84, 38, 8), (110, 40, 8)]:
        out += f'<circle cx="{x}" cy="{y}" r="{r}" fill="#fff7e0" stroke="#b07a1c" stroke-width="1"/>'
        for q in range(4):
            out += f'<circle cx="{x + rng.uniform(-r * .5, r * .5):.1f}" cy="{y + rng.uniform(-r * .5, r * .5):.1f}" r="1.7" fill="#d9472f"/>'
    # exocitose: vesicula fundida liberando na fenda
    out += f'<path d="M90 121 Q100 132 110 121" fill="#fff7e0" stroke="#b07a1c" stroke-width="1"/>'
    for (x, y) in [(94, 128), (100, 131), (106, 127), (88, 133), (112, 134), (97, 136), (104, 138), (118, 131), (82, 130)]:
        out += f'<circle cx="{x}" cy="{y}" r="1.8" fill="#d9472f"/>'
    out += brilho(66, 40, 8, 3.5, -50, .45)
    return out

def B08_3():   # SNA e arco reflexo: medula espinal em corte (substancia cinzenta em H/borboleta) com as raizes dos nervos espinais
    k = 'me'
    cx, cy, A, B, H = 100, 74, 64, 40, 50
    out = (f'<defs><linearGradient id="{k}l" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#e9dcc2"/><stop offset=".4" stop-color="#f8efdc"/><stop offset="1" stop-color="#c9b48f"/></linearGradient>'
           f'<radialGradient id="{k}t" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#fffaf0"/><stop offset="1" stop-color="#efe2c6"/></radialGradient>'
           f'<radialGradient id="{k}c" cx=".45" cy=".4" r=".7"><stop offset="0" stop-color="#d9b3c2"/><stop offset="1" stop-color="#a8778c"/></radialGradient>'
           f'{lin_grad(k + "n", "#f6e7a8", "#d9b84f")}</defs>')
    out += sombra_chao(100, cy + H + B + 6, 86, 8)
    # raizes dorsal e ventral de cada lado se juntam no nervo espinal (o ganglio fica na raiz dorsal); cortados nas pontas
    for s_ in (-1, 1):
        dors = [(cx + s_ * A * .55, cy - B * .45), (cx + s_ * (A + 8), cy - 4), (cx + s_ * (A + 22), cy + 14)]
        vent = [(cx + s_ * A * .5, cy + B * .5), (cx + s_ * (A + 6), cy + 22), (cx + s_ * (A + 22), cy + 18)]
        nerv = [(cx + s_ * (A + 20), cy + 16), (cx + s_ * (A + 30), cy + 26), (cx + s_ * (A + 36), cy + 40)]
        for pts, w0, w1 in ((vent, 7, 7), (dors, 7, 7), (nerv, 12, 11)):
            out += f'<path d="{galho(pts, w0, w1)}" fill="url(#{k}n)" stroke="#9c7d20" stroke-width=".9"/>'
        gx, gy = cx + s_ * (A + 12), cy + 2   # ganglio da raiz dorsal
        out += f'<ellipse cx="{gx:.1f}" cy="{gy:.1f}" rx="9" ry="6.5" fill="url(#{k}n)" stroke="#9c7d20" stroke-width=".9" transform="rotate({s_ * 40} {gx:.1f} {gy:.1f})"/>'
        ex, ey = cx + s_ * (A + 36), cy + 40   # corte do nervo: face com os fasciculos
        out += f'<ellipse cx="{ex:.1f}" cy="{ey:.1f}" rx="6" ry="3.2" fill="#f3df97" stroke="#9c7d20" stroke-width=".8" transform="rotate({s_ * -25} {ex:.1f} {ey:.1f})"/>'
    # corpo da medula (cilindro curto) com a face de corte em cima
    lado = f'M{cx - A} {cy} L{cx - A} {cy + H} A{A} {B} 0 0 0 {cx + A} {cy + H} L{cx + A} {cy} Z'
    out += f'<path d="{lado}" fill="url(#{k}l)" stroke="#9b8662" stroke-width="1"/>'
    out += f'<ellipse cx="{cx}" cy="{cy}" rx="{A}" ry="{B}" fill="url(#{k}t)" stroke="#9b8662" stroke-width="1"/>'
    # substancia cinzenta em forma de borboleta (cornos dorsais finos, ventrais largos)
    def P(u, v): return (cx + u * A, cy + v * B)
    asa = [(0, -.12), (.18, -.2), (.3, -.62), (.38, -.7), (.34, -.4), (.36, -.12), (.5, .05), (.52, .42), (.38, .58), (.22, .44), (.1, .2), (0, .14)]
    pts = [P(u, v) for u, v in asa] + [P(-u, v) for u, v in asa[::-1]]
    out += f'<path d="{suave(pts)}" fill="url(#{k}c)" stroke="#86566b" stroke-width=".9"/>'
    out += f'<circle cx="{cx}" cy="{cy + 1}" r="2.4" fill="#fff" stroke="#86566b" stroke-width=".7"/>'
    out += f'<path d="M{cx} {cy - B} L{cx} {cy - B * .55}" stroke="#9b8662" stroke-width="1.2"/>'   # sulco mediano posterior
    out += f'<path d="M{cx} {cy + B} L{cx} {cy + B * .62}" stroke="#9b8662" stroke-width="2"/>'     # fissura mediana anterior
    return out

def B08_4():   # eixo hipotalamo-hipofise: encefalo em vista lateral, o hipotalamo (na base do diencefalo) destacado e a
    # hipofise pendurada pelo infundibulo, na sela turca do osso esfenoide
    # (correcao da revisao de 29/10: antes o hipotalamo era uma laje plana sobre um talo e o conjunto lia como cogumelo;
    #  agora a base do encefalo situa a regiao, e a hipofise — adeno avermelhada na frente, neuro clara atras — fica
    #  pendurada abaixo dele)
    k = 'hp'
    rosa = {'#dad3de': '#f1cfc8', '#e8e4eb': '#f8e3de', '#bbb0c2': '#d59b90'}
    out = (f'<defs>{grad_forma(k + "a", "#d9645f", .35, .3, .8, .45, .4)}{grad_forma(k + "p", "#f0cdb4", .35, .3, .8, .45, .3)}'
           f'<linearGradient id="{k}o" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f4ead2"/><stop offset="1" stop-color="#cdb98f"/></linearGradient>'
           f'<radialGradient id="{k}h" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#f08a24" stop-opacity=".95"/><stop offset=".65" stop-color="#f08a24" stop-opacity=".7"/><stop offset="1" stop-color="#f08a24" stop-opacity="0"/></radialGradient></defs>')
    out += sombra_chao(98, 182, 80, 7)
    g, (bx, by, bw, bh) = coloca(SV + 'Human_physiology/Servier/brain-1.svg', 6, 6, larg=188, recolor=rosa)
    # enquadramento fechado na base do encefalo (so a metade de baixo), para nao repetir o encefalo inteiro do icone do
    # modulo B08 e dar tamanho a hipofise
    out += (f'<defs><linearGradient id="{k}m" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/>'
            f'<stop offset=".45" stop-color="#fff" stop-opacity=".9"/><stop offset="1" stop-color="#fff"/></linearGradient>'
            f'<linearGradient id="{k}n" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".18" stop-color="#fff"/>'
            f'<stop offset=".82" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>'
            f'<mask id="{k}k" maskUnits="userSpaceOnUse" x="0" y="0" width="200" height="200"><g><rect x="10" y="48" width="180" height="100" fill="url(#{k}m)"/></g></mask>'
            f'<mask id="{k}j" maskUnits="userSpaceOnUse" x="0" y="0" width="200" height="200"><rect x="10" y="40" width="180" height="110" fill="url(#{k}n)"/></mask></defs>'
            f'<g mask="url(#{k}j)"><g mask="url(#{k}k)">{g}</g></g>')
    # hipotalamo: regiao destacada na base do encefalo, acima do infundibulo
    hx, hy = 84, 118
    out += f'<ellipse cx="{hx}" cy="{hy}" rx="22" ry="12" fill="url(#{k}h)"/>'
    out += f'<ellipse cx="{hx}" cy="{hy}" rx="15" ry="7.5" fill="none" stroke="#b85a10" stroke-width="1.2" stroke-dasharray="3 2"/>'
    # osso esfenoide com a sela turca (corte)
    osso = 'M34 166 C50 164 60 158 64 150 C68 140 72 140 72 152 C74 172 114 172 116 152 C116 140 120 140 124 150 C128 158 138 164 154 166 L154 180 C120 184 70 184 34 180 Z'
    out += f'<path d="{osso}" fill="url(#{k}o)" stroke="#9b8662" stroke-width="1.1"/>'
    # infundibulo e hipofise
    out += f'<path d="M{hx - 3} {hy + 4} C{hx - 3} 128 {hx + 4} 132 {hx + 6} 140 L{hx + 13} 140 C{hx + 10} 132 {hx + 4} 128 {hx + 4} {hy + 4} Z" fill="#e7b6a8" stroke="#a5685c" stroke-width="1"/>'
    out += f'<path d="{blob(105, 152, 13, 12, n=10, amp=.04, seed=3)}" fill="url(#{k}p)" stroke="#a87a5c" stroke-width="1"/>'
    out += f'<path d="{blob(89, 153, 16, 14, n=10, amp=.04, seed=8)}" fill="url(#{k}a)" stroke="#8a2f2b" stroke-width="1"/>'
    out += brilho(83, 146, 5, 2.6, -25, .5)
    return out

def B08_5():   # hormonios: glandula tireoide (dois lobos e istmo) sobre a traqueia, abaixo da laringe
    k = 'tr'
    out = (f'<defs><linearGradient id="{k}t" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#cbd6dc"/><stop offset=".4" stop-color="#f6f9fa"/><stop offset="1" stop-color="#a8b8c0"/></linearGradient>'
           f'{grad_forma(k + "g", "#c9474d", .38, .3, .8, .5, .42)}</defs>')
    out += sombra_chao(102, 194, 70, 7)
    # laringe (cartilagem tireoide) e traqueia com aneis
    out += f'<path d="M64 6 L136 6 L130 44 Q100 58 70 44 Z" fill="url(#{k}t)" stroke="#7f939d" stroke-width="1.1"/>'
    out += '<path d="M100 10 L100 46" stroke="#9aaab3" stroke-width="1.2"/>'
    out += f'<rect x="76" y="50" width="48" height="140" rx="10" fill="url(#{k}t)" stroke="#7f939d" stroke-width="1.1"/>'
    for y in range(58, 190, 11):
        out += f'<path d="M77 {y} Q100 {y + 5} 123 {y}" fill="none" stroke="#8fa3ad" stroke-width="2.4" opacity=".75"/>'
    # tireoide: lobos direito e esquerdo ligados pelo istmo
    lobo = lambda s_: (f'M{100 + s_ * 12} 112 C{100 + s_ * 20} 96 {100 + s_ * 26} 66 {100 + s_ * 40} 62 C{100 + s_ * 56} 60 {100 + s_ * 62} 92 {100 + s_ * 60} 124 '
                      f'C{100 + s_ * 58} 152 {100 + s_ * 46} 168 {100 + s_ * 32} 164 C{100 + s_ * 18} 158 {100 + s_ * 14} 140 {100 + s_ * 12} 128 Z')
    out += f'<path d="M86 108 Q100 116 114 108 L114 132 Q100 138 86 132 Z" fill="url(#{k}g)" stroke="#7e1f25" stroke-width="1"/>'
    for s_ in (-1, 1):
        out += f'<path d="{lobo(s_)}" fill="url(#{k}g)" stroke="#7e1f25" stroke-width="1.1"/>'
        out += brilho(100 + s_ * 42 - 4, 82, 5, 11, s_ * 10, .4)
        for q in range(3):   # vasos na superficie
            y = 90 + q * 22
            out += f'<path d="M{100 + s_ * 30} {y} q{s_ * 10} 4 {s_ * 22} {2 + q}" fill="none" stroke="#8e252c" stroke-width=".9" opacity=".7"/>'
    return out

def B08_7():   # fecundacao: ovocito secundario (zona pelucida, corona radiata, 1o corpusculo polar) e espermatozoides chegando
    k = 'ov'
    cx, cy, R = 116, 104, 62
    out = (f'<defs><radialGradient id="{k}c" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#fff6ee"/><stop offset=".7" stop-color="#f6d9c8"/><stop offset="1" stop-color="#e2b39c"/></radialGradient>'
           f'<radialGradient id="{k}z" cx=".5" cy=".5" r=".5"><stop offset=".86" stop-color="#e9f3fb" stop-opacity=".2"/><stop offset=".95" stop-color="#cfe2f2" stop-opacity=".9"/><stop offset="1" stop-color="#9cbad6"/></radialGradient>'
           f'{grad_forma(k + "s", "#9fb7d9", .35, .3, .8, .55, .4)}</defs>')
    out += sombra_chao(108, 188, 84, 8)
    rng = np.random.default_rng(6)
    for q in range(26):   # corona radiata
        a = 2 * math.pi * q / 26 + rng.uniform(-.05, .05); r = R + 9
        x, y = cx + r * math.cos(a), cy + r * math.sin(a)
        out += esfera(x, y, 7.2, '#f1c48c', f'{k}k{q}', reflexo=False)
    out += f'<circle cx="{cx}" cy="{cy}" r="{R}" fill="url(#{k}z)" stroke="#89a8c4" stroke-width="1"/>'
    out += f'<circle cx="{cx - 2}" cy="{cy + 2}" r="{R - 12}" fill="url(#{k}c)" stroke="#c9957d" stroke-width=".9"/>'
    out += esfera(cx + 30, cy - 32, 8.5, '#f3d2c0', k + 'pc', reflexo=False)   # 1o corpusculo polar (espaco perivitelino)
    out += brilho(cx - 26, cy - 30, 14, 6, -35, .55)
    # espermatozoides (cabeca com acrossomo, peca intermediaria, cauda)
    for (hx_, hy, a, sd) in [(40, 60, 18, 1), (34, 128, -14, 2), (64, 168, -50, 3)]:
        ar = math.radians(a); ux, uy = math.cos(ar), math.sin(ar)
        cauda = [(hx_ - ux * t + -uy * 5 * math.sin(t / 9 + sd), hy - uy * t + ux * 5 * math.sin(t / 9 + sd)) for t in np.linspace(8, 70, 26)]
        out += f'<path d="{suave(cauda, fechado=False)}" fill="none" stroke="#5f7aa3" stroke-width="2" stroke-linecap="round"/>'
        out += f'<line x1="{hx_ - ux * 6:.1f}" y1="{hy - uy * 6:.1f}" x2="{hx_ - ux * 13:.1f}" y2="{hy - uy * 13:.1f}" stroke="#7e8fae" stroke-width="3.4" stroke-linecap="round"/>'
        out += f'<ellipse cx="{hx_:.1f}" cy="{hy:.1f}" rx="8" ry="5.2" fill="url(#{k}s)" stroke="#40618e" stroke-width=".8" transform="rotate({a} {hx_:.1f} {hy:.1f})"/>'
        out += f'<ellipse cx="{hx_ + ux * 3:.1f}" cy="{hy + uy * 3:.1f}" rx="4.4" ry="4" fill="#d8e6f6" opacity=".8" transform="rotate({a} {hx_:.1f} {hy:.1f})"/>'
    return out

# =============================================================================================== B07 (continuacao)
def B07_1():   # os quatro tecidos fundamentais: epitelial (celulas colunares lado a lado), muscular, conjuntivo e nervoso
    out = sombra_chao(102, 194, 90, 7, op=.16)
    for q in range(4):                                                                                    # epitelial
        g, _ = coloca(SV + 'Tissues/Servier/cell-column-1.svg', 6 + q * 21, 6, alt=86); out += g
    g, _ = coloca(SV + 'Human_physiology/Servier/muscle-1.svg', 112, 0, alt=104, rot=36); out += g        # muscular
    g, _ = coloca(SV + 'Tissues/Servier/fibroblast-1.svg', 2, 118, larg=96, rot=-14); out += g            # conjuntivo
    out += neuronio('n71', 128, 120, .55, (1, .9), seed=2, comp_axonio=118, terminal=True)                # nervoso
    return out

# =============================================================================================== B09 (continuacao)
def B09_2():   # fluxo de energia e regra dos 10%: piramide de energia (produtores na base, cada nivel ~10% do anterior)
    c = Cena(-30, 26)
    niveis = [(2.6, '#4f9a3a'), (1.95, '#a8c43c'), (1.35, '#e3a33b'), (.8, '#d65b4a')]
    z = 0; h = .5
    for L, cor in niveis:
        o = c.add(Obj()); caixa_chanfro(o, -L / 2, L / 2, -L / 2, L / 2, z, z + h, .04, cor, amb=.42, brilho=.25)
        z += h + .02
    return c.render()

def B09_3():   # ciclos biogeoquimicos: o planeta e as setas do ciclo da materia
    out = sombra_chao(102, 192, 70, 7)
    g, _ = poe(SV + 'General_items/Servier/arrow-circular.svg', 100, 198, alt=196); out += g
    g, _ = poe(SV + 'General_items/Servier/earth.svg', 100, 168, alt=136); out += g
    return out

def flor(cx, cy, R, k, cor='#f07aa8', miolo='#f6c53b'):
    out = f'<defs>{grad_forma(k + "p", cor, .5, .2, .9, .5, .3)}{grad_forma(k + "m", miolo, .35, .3, .8, .5, .4)}</defs>'
    for q in range(6):
        a = q * 60 - 15
        out += f'<ellipse cx="{cx:.1f}" cy="{cy - R * .55:.1f}" rx="{R * .34:.1f}" ry="{R * .58:.1f}" fill="url(#{k}p)" stroke="{mix(cor, "#000000", .45)}" stroke-width=".9" transform="rotate({a} {cx:.1f} {cy:.1f})"/>'
        out += f'<path d="M{cx:.1f} {cy - R * .2:.1f} L{cx:.1f} {cy - R * .9:.1f}" stroke="{mix(cor, "#000000", .25)}" stroke-width=".8" opacity=".5" transform="rotate({a} {cx:.1f} {cy:.1f})"/>'
    out += f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="{R * .3:.1f}" fill="url(#{k}m)" stroke="#a57712" stroke-width=".9"/>'
    rng = np.random.default_rng(1)
    for q in range(14):
        a = rng.uniform(0, 6.28); r = rng.uniform(0, R * .24)
        out += f'<circle cx="{cx + r * math.cos(a):.1f}" cy="{cy + r * math.sin(a):.1f}" r="1.3" fill="#c98a12"/>'
    return out

def abelha(cx, cy, esc, k, rot=0):
    """abelha (Apis mellifera) vista de cima: cabeca, torax peludo, abdome listrado, asas translucidas"""
    out = (f'<defs>{grad_forma(k + "a", "#f2b632", .35, .3, .8, .45, .45)}{grad_forma(k + "t", "#7a5524", .35, .3, .8, .4, .5)}'
           f'<linearGradient id="{k}w" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity=".85"/><stop offset="1" stop-color="#cfe3f2" stop-opacity=".55"/></linearGradient></defs>')
    g = ''
    for s_ in (-1, 1):   # pernas
        for q, (dx, dy) in enumerate([(14, -4), (17, 6), (16, 16)]):
            g += f'<path d="M{s_ * 6} {q * 6 - 6} q{s_ * dx * .6} {dy * .3} {s_ * dx} {dy}" fill="none" stroke="#2d2216" stroke-width="2" stroke-linecap="round"/>'
    g += f'<ellipse cx="0" cy="26" rx="13" ry="20" fill="url(#{k}a)" stroke="#5a3d10" stroke-width="1"/>'
    for y in (16, 26, 36):   # listras do abdome
        g += f'<path d="M-12.5 {y} Q0 {y + 5} 12.5 {y}" fill="none" stroke="#2a1d10" stroke-width="4.2" opacity=".9"/>'
    g += f'<path d="M-2 45 L0 50 L2 45 Z" fill="#2a1d10"/>'
    g += f'<ellipse cx="0" cy="0" rx="11" ry="10" fill="url(#{k}t)" stroke="#3b2812" stroke-width="1"/>'
    rng = np.random.default_rng(3)
    for q in range(26):   # pelos do torax
        a = rng.uniform(0, 6.28); r = rng.uniform(4, 10.5)
        g += f'<line x1="{r * math.cos(a) * .9:.1f}" y1="{r * math.sin(a) * .85:.1f}" x2="{r * math.cos(a) * 1.08:.1f}" y2="{r * math.sin(a) * 1.02:.1f}" stroke="#d9b06a" stroke-width=".9" opacity=".8"/>'
    g += f'<ellipse cx="0" cy="-15" rx="8" ry="7" fill="#2f2213" stroke="#1a120a" stroke-width=".8"/>'
    for s_ in (-1, 1):
        g += f'<ellipse cx="{s_ * 5}" cy="-16" rx="3" ry="4.6" fill="#0f0b07"/>'
        g += f'<path d="M{s_ * 3} -21 q{s_ * 4} -9 {s_ * 11} -12" fill="none" stroke="#2d2216" stroke-width="1.6" stroke-linecap="round"/>'
        g += f'<ellipse cx="{s_ * 24}" cy="4" rx="22" ry="9" fill="url(#{k}w)" stroke="#8aa2b6" stroke-width=".8" transform="rotate({s_ * 18} {s_ * 24} 4)"/>'
        g += f'<path d="M{s_ * 6} 2 L{s_ * 40} 8 M{s_ * 14} 4 L{s_ * 30} 14" stroke="#8aa2b6" stroke-width=".6" opacity=".8" transform="rotate({s_ * 18} {s_ * 24} 4)"/>'
    return out + f'<g transform="translate({cx:.1f} {cy:.1f}) rotate({rot}) scale({esc})">{g}</g>'

def B09_4():   # relacoes ecologicas: abelha polinizando a flor (mutualismo: nectar para a abelha, polen levado para a planta)
    out = sombra_chao(104, 188, 84, 8)
    out += f'<path d="M100 178 C98 160 104 140 100 118" fill="none" stroke="#4f8a2a" stroke-width="6" stroke-linecap="round"/>'
    out += f'<path d="M100 160 C84 150 70 154 60 166 C76 168 90 166 100 160Z" fill="#6fae3f" stroke="#3a6b1d" stroke-width=".9"/>'
    out += flor(100, 92, 84, 'b94')
    out += abelha(118, 62, 1.15, 'ab', rot=35)
    return out

def arvore_desenho(cx, base, H, k, cor='#5fa23a'):
    """arvore desenhada: tronco com casca e copa em volumes"""
    out = f'<defs>{lin_grad(k + "t", "#8a5a33", "#5b3a1f", 0, 0, 1, 0)}{grad_forma(k + "c", cor, .35, .3, .8, .45, .45)}</defs>'
    tw = H * .1
    out += f'<path d="M{cx - tw * .7:.1f} {base:.1f} C{cx - tw * .5:.1f} {base - H * .3:.1f} {cx - tw * .4:.1f} {base - H * .45:.1f} {cx - tw * .3:.1f} {base - H * .55:.1f} L{cx + tw * .3:.1f} {base - H * .55:.1f} C{cx + tw * .4:.1f} {base - H * .45:.1f} {cx + tw * .5:.1f} {base - H * .3:.1f} {cx + tw * .7:.1f} {base:.1f} Z" fill="url(#{k}t)" stroke="#3f2814" stroke-width=".8"/>'
    for (dx, dy, r) in [(-.22, .62, .26), (.22, .6, .26), (0, .78, .3), (-.12, .5, .2), (.15, .48, .2)]:
        out += f'<path d="{blob(cx + dx * H, base - dy * H, r * H, r * H * .9, n=11, amp=.07, seed=int(abs(dx) * 100 + dy * 10))}" fill="url(#{k}c)" stroke="{mix(cor, "#000000", .5)}" stroke-width=".9"/>'
    out += brilho(cx - .14 * H, base - .86 * H, .08 * H, .04 * H, -25, .4)
    return out

def B09_5():   # sucessao ecologica: rocha com liquens (pioneiros) -> musgo e capim -> arbusto -> arvore (comunidade clímax)
    k = 'su'
    out = (f'<defs>{lin_grad(k + "s", "#8a6a45", "#5e4529")}{lin_grad(k + "g", "#8cc152", "#5c9a2e")}'
           f'{grad_forma(k + "r", "#a3a7ad", .35, .3, .8, .45, .45)}</defs>')
    out += sombra_chao(102, 190, 94, 7)
    # bloco de solo em perspectiva
    out += f'<path d="M4 150 L196 150 L196 184 L4 184 Z" fill="url(#{k}s)" stroke="#4a361f" stroke-width=".9"/>'
    out += f'<path d="M4 150 L196 150 L188 140 L12 140 Z" fill="url(#{k}g)" stroke="#3f6b1f" stroke-width=".9"/>'
    for y in (160, 172):
        out += f'<path d="M4 {y} Q50 {y - 3} 100 {y} T196 {y}" fill="none" stroke="#4a361f" stroke-width=".8" opacity=".5"/>'
    # 1. rocha com liquens
    out += f'<path d="{blob(30, 140, 22, 14, n=9, amp=.1, seed=4)}" fill="url(#{k}r)" stroke="#5d6167" stroke-width=".9"/>'
    for (x, y, c) in [(24, 134, '#e3a33b'), (36, 138, '#b9cc5a'), (30, 130, '#e3a33b')]:
        out += f'<ellipse cx="{x}" cy="{y}" rx="4" ry="2.4" fill="{c}" opacity=".9"/>'
    # 2. capim
    for q in range(9):
        x = 60 + q * 2.6; h = 10 + (q % 3) * 5
        out += f'<path d="M{x:.1f} 142 q{(q % 2 - .5) * 6:.1f} {-h * .6:.1f} {(q % 2 - .5) * 9:.1f} {-h:.1f}" fill="none" stroke="#4f8a2a" stroke-width="2" stroke-linecap="round"/>'
    # 3. arbusto e 4. arvore
    out += arvore_desenho(104, 146, 46, k + 'a', '#78b043')
    out += arvore_desenho(156, 146, 128, k + 'b', '#4f9632')
    return out

def B09_6():   # biomas brasileiros: mapa do Brasil em relevo com os 6 biomas continentais + sistema costeiro-marinho (limites do IBGE, 2019)
    B = json.load(open(os.path.join(AQUI, 'biomas_br_simpl.json'), encoding='utf8'))
    B.pop('Sistema Costeiro')   # inclui a faixa marinha; o mapa mostra so os 6 biomas continentais
    COR = {'Amazônia': '#2f7d32', 'Cerrado': '#d9b44a', 'Caatinga': '#d79a6a', 'Mata Atlântica': '#6cb33f',
           'Pampa': '#c4d77a', 'Pantanal': '#5fb3c9', 'Sistema Costeiro': '#efe2b4'}
    lat0 = math.radians(-14)
    todos = [(x, y) for ps in B.values() for p in ps for x, y in p]
    X = [x * math.cos(lat0) for x, y in todos]; Y = [-y for x, y in todos]
    x0, x1, y0, y1 = min(X), max(X), min(Y), max(Y)
    k = 186 / max(x1 - x0, (y1 - y0) * .8)
    T = lambda x, y: (6 + (x * math.cos(lat0) - x0) * k, 8 + (-y - y0) * k * .8)
    defs = ''; tops = ''
    for n, (nome, ps) in enumerate(B.items()):
        d = ' '.join(caminho([T(x, y) for x, y in p]) for p in ps)
        defs += f'<path id="bm{n}" d="{d}"/>'
        cor = COR[nome]
        tops += f'<use href="#bm{n}" xlink:href="#bm{n}" fill="{cor}" stroke="{cor}" stroke-width="1" stroke-linejoin="round"/>'
    paredes = ''
    for q, dz in enumerate((2, 4, 6, 8)):
        c_ = mix('#8a7550', '#5c4c31', q / 3)
        paredes += f'<use href="#br" xlink:href="#br" fill="{c_}" stroke="{c_}" stroke-width="1" transform="translate(0 {dz})"/>'
    out = f'<defs><g id="br">{defs}</g>' + f'<linearGradient id="bmb" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity=".28"/><stop offset=".6" stop-color="#ffffff" stop-opacity="0"/><stop offset="1" stop-color="#000000" stop-opacity=".12"/></linearGradient></defs>'
    out += '<filter id="bms" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="3.5"/></filter>'
    out += f'<use href="#br" xlink:href="#br" fill="#1b1d2a" opacity=".22" filter="url(#bms)" transform="translate(5 14)"/>'
    out += paredes + tops
    out += f'<use href="#br" xlink:href="#br" fill="url(#bmb)"/>'   # luz de cima-esquerda sobre o relevo
    return out

# =============================================================================================== B11 Evolucao
# (modulo: peixe fossil na rocha)
OSSO = {'umero': '#e8a33d', 'radio': '#5aa0d8', 'ulna': '#7cc37a', 'carpo': '#e46a6a', 'dedos': '#9a7cc4'}
def osso(p0, p1, w, cor, k):
    """osso longo: diafise e epifises arredondadas, com gradiente"""
    (x0, y0), (x1, y1) = p0, p1
    L = math.hypot(x1 - x0, y1 - y0); a = math.degrees(math.atan2(y1 - y0, x1 - x0))
    d = (f'M0 {-w * .5:.1f} C{L * .1:.1f} {-w * .78:.1f} {L * .1:.1f} {-w * .28:.1f} {L * .2:.1f} {-w * .3:.1f} L{L * .8:.1f} {-w * .3:.1f} '
         f'C{L * .9:.1f} {-w * .28:.1f} {L * .9:.1f} {-w * .78:.1f} {L:.1f} {-w * .5:.1f} C{L + w * .55:.1f} {-w * .4:.1f} {L + w * .55:.1f} {w * .4:.1f} {L:.1f} {w * .5:.1f} '
         f'C{L * .9:.1f} {w * .78:.1f} {L * .9:.1f} {w * .28:.1f} {L * .8:.1f} {w * .3:.1f} L{L * .2:.1f} {w * .3:.1f} C{L * .1:.1f} {w * .28:.1f} {L * .1:.1f} {w * .78:.1f} 0 {w * .5:.1f} '
         f'C{-w * .55:.1f} {w * .4:.1f} {-w * .55:.1f} {-w * .4:.1f} 0 {-w * .5:.1f}Z')
    return (f'<defs><linearGradient id="{k}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{mix(cor, "#ffffff", .5)}"/><stop offset=".5" stop-color="{cor}"/><stop offset="1" stop-color="{mix(cor, "#000000", .3)}"/></linearGradient></defs>'
            f'<path d="{d}" fill="url(#{k})" stroke="{mix(cor, "#000000", .55)}" stroke-width=".8" transform="translate({x0:.1f} {y0:.1f}) rotate({a:.1f})"/>')

def B11_1():   # evidencias da evolucao: orgaos homologos (mesmos ossos, mesma cor): braco humano e asa de morcego
    out = sombra_chao(104, 194, 92, 7, op=.15)
    # braco humano (esquerda, vertical): umero, radio e ulna, carpo, metacarpos e falanges
    out += osso((40, 6), (40, 80), 14, OSSO['umero'], 'h1')
    out += osso((33, 90), (30, 140), 8.5, OSSO['radio'], 'h3') + osso((47, 90), (51, 140), 8, OSSO['ulna'], 'h2')   # radio do lado do polegar
    for (x, y) in [(31, 148), (39, 147), (47, 147), (55, 148), (35, 155), (43, 155), (51, 155)]:
        out += f'<circle cx="{x}" cy="{y}" r="4" fill="{OSSO["carpo"]}" stroke="#7a2a2a" stroke-width=".7"/>'
    for q in range(5):
        x = 28 + q * 7; dx = (q - 2) * 1.6
        if q == 0:
            out += osso((x, 158), (x - 6, 172), 4.6, OSSO['dedos'], 'hd0a') + osso((x - 7, 175), (x - 11, 186), 4, OSSO['dedos'], 'hd0b')
            continue
        L = (0, 14, 16, 15, 13)[q]
        out += osso((x, 160), (x + dx, 160 + L), 4.6, OSSO['dedos'], f'hd{q}a')
        out += osso((x + dx, 163 + L), (x + dx * 1.6, 163 + L + L * .75), 4, OSSO['dedos'], f'hd{q}b')
    # asa de morcego (direita): umero curto, radio longo, ulna reduzida, dedos 2 a 5 muito longos sustentando a membrana
    sh, el, wr = (90, 96), (114, 64), (160, 50)
    tips = [(198, 44), (196, 104), (174, 152), (136, 166)]
    meio = [(178, 47), (180, 74), (166, 96), (146, 108)]
    d = f'M{sh[0]} {sh[1]} L{el[0]} {el[1]} L{wr[0]} {wr[1]} L{tips[0][0]} {tips[0][1]}'
    for t0, t1 in zip(tips[:-1], tips[1:]):   # bordas da membrana em arco entre as pontas dos dedos
        mx, my = (t0[0] + t1[0]) / 2, (t0[1] + t1[1]) / 2
        cx_, cy_ = mx + (wr[0] - mx) * .3, my + (wr[1] - my) * .3
        d += f' Q{cx_:.1f} {cy_:.1f} {t1[0]} {t1[1]}'
    d += f' Q{118:.1f} {136:.1f} 92 150 Q86 120 {sh[0]} {sh[1]}Z'
    out += f'<path d="{d}" fill="#7d5f4a" fill-opacity=".45" stroke="#5c4433" stroke-width=".9" stroke-linejoin="round"/>'
    out += osso(sh, el, 11, OSSO['umero'], 'm1')
    out += osso((118, 70), (136, 63), 3.4, OSSO['ulna'], 'm3') + osso(el, wr, 7.5, OSSO['radio'], 'm2')
    for q, (m, t) in enumerate(zip(meio, tips)):
        out += osso(wr, m, 4.2, OSSO['dedos'], f'md{q}a') + osso(m, t, 3.6, OSSO['dedos'], f'md{q}b')
    out += f'<circle cx="{wr[0]}" cy="{wr[1]}" r="5.5" fill="{OSSO["carpo"]}" stroke="#7a2a2a" stroke-width=".7"/>'
    out += osso((161, 46), (168, 32), 3.6, OSSO['dedos'], 'mp') + '<path d="M168 32 q4 -4 4 2" fill="none" stroke="#3a2a20" stroke-width="1.4"/>'
    return out

def mariposa(cx, cy, esc, cor, mancha, k, rot=0, seed=1):
    """mariposa (Biston betularia) pousada com as asas abertas e achatadas"""
    rng = np.random.default_rng(seed)
    g = f'<defs>{grad_forma(k + "w", cor, .4, .3, .85, .25, .35)}</defs>'
    for s_ in (-1, 1):
        ant = f'M0 -2 C{s_ * 10} -8 {s_ * 40} -18 {s_ * 46} 4 C{s_ * 40} 16 {s_ * 16} 12 0 6 Z'
        pos = f'M0 4 C{s_ * 10} 8 {s_ * 32} 10 {s_ * 32} 22 C{s_ * 26} 32 {s_ * 10} 30 0 16 Z'
        g += f'<path d="{pos}" fill="url(#{k}w)" stroke="{mix(cor, "#000000", .5)}" stroke-width=".8"/>'
        g += f'<path d="{ant}" fill="url(#{k}w)" stroke="{mix(cor, "#000000", .5)}" stroke-width=".8"/>'
        for q in range(26):   # salpicado
            u, v = rng.uniform(.1, 1), rng.uniform(-.4, .5)
            x, y = s_ * (4 + u * 36), -4 + v * 22 * (1 - u * .4) + u * 6
            g += f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{rng.uniform(.6, 1.4):.1f}" fill="{mancha}" opacity=".85"/>'
        g += f'<path d="M{s_ * 4} -3 Q{s_ * 22} 0 {s_ * 40} -4" fill="none" stroke="{mancha}" stroke-width="1.1" opacity=".8"/>'
        g += f'<path d="M0 -10 q{s_ * 6} -8 {s_ * 12} -10" fill="none" stroke="#3a3128" stroke-width="1"/>'
    g += f'<ellipse cx="0" cy="6" rx="3.6" ry="13" fill="{mix(cor, "#000000", .25)}" stroke="{mix(cor, "#000000", .55)}" stroke-width=".7"/>'
    g += f'<circle cx="0" cy="-8" r="3.4" fill="{mix(cor, "#000000", .35)}"/>'
    return f'<g transform="translate({cx:.1f} {cy:.1f}) rotate({rot}) scale({esc})">{g}</g>'

def B11_2():   # selecao natural e adaptacao: Biston betularia — no tronco claro (com liquens) a mariposa escura fica a
    # vista; no tronco escurecido pela fuligem e a clara que se destaca (e e predada)
    # (correcao da revisao de 29/10: um tronco preso so com as duas mariposas virava um bloco preto a 64 px e a escura
    #  sumia; agora sao dois troncos lado a lado, cada um com a mariposa que contrasta)
    out = ('<defs><linearGradient id="trc" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#9c978c"/><stop offset=".35" stop-color="#d9d5ca"/>'
           '<stop offset=".7" stop-color="#c4bfb3"/><stop offset="1" stop-color="#8a8579"/></linearGradient>'
           '<linearGradient id="tre" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#1f1d1b"/><stop offset=".35" stop-color="#4a4540"/>'
           '<stop offset=".7" stop-color="#3a3632"/><stop offset="1" stop-color="#171513"/></linearGradient></defs>')
    out += sombra_chao(100, 194, 94, 7)
    rng = np.random.default_rng(9)
    def tronco(x0, x1, grad, sulco, luz, liquen):
        o = f'<path d="M{x0} 0 L{x1} 0 L{x1 + 3} 196 L{x0 - 3} 196 Z" fill="url(#{grad})" stroke="#161412" stroke-width="1"/>'
        for q in range(12):   # sulcos da casca
            x = rng.uniform(x0 + 5, x1 - 5); y = rng.uniform(0, 170); L = rng.uniform(18, 40)
            o += f'<path d="M{x:.1f} {y:.1f} q{rng.uniform(-4, 4):.1f} {L / 2:.1f} {rng.uniform(-3, 3):.1f} {L:.1f}" fill="none" stroke="{sulco}" stroke-width="{rng.uniform(1, 2.2):.1f}" opacity=".8"/>'
            o += f'<path d="M{x + 1.5:.1f} {y:.1f} q{rng.uniform(-4, 4):.1f} {L / 2:.1f} {rng.uniform(-3, 3):.1f} {L:.1f}" fill="none" stroke="{luz}" stroke-width=".7" opacity=".5"/>'
        if liquen:   # manchas de liquen esverdeado-acinzentado
            for q in range(9):
                o += f'<path d="{blob(rng.uniform(x0 + 10, x1 - 10), rng.uniform(10, 185), rng.uniform(5, 10), rng.uniform(4, 7), n=9, amp=.18, seed=q)}" fill="#b9c3a4" opacity=".75"/>'
        return o
    out += tronco(8, 94, 'trc', '#857f72', '#f2efe6', True)
    out += tronco(106, 192, 'tre', '#151311', '#6a635b', False)
    out += mariposa(51, 92, .88, '#3e3a35', '#1c1a18', 'me', rot=-6, seed=5)     # melanica: a vista no tronco claro
    out += mariposa(149, 100, .88, '#ece7d9', '#3a3530', 'mc', rot=8, seed=2)    # clara: a vista no tronco escuro
    return out

def B11_3():   # deriva genetica / efeito gargalo e fundador: poucas contas passam pelo gargalo, so com parte das cores
    rel = SV + 'Chemistry/Servier/erlenmeyer-glass.svg'
    vx, vy, vw, vh = vb_de(rel)
    alt = 150; kk = alt / vh; w = vw * kk
    g, _ = coloca(rel, 0, 0, alt=alt)
    cores = ['#d9534f', '#4f8fd0', '#f2c230', '#4fae62', '#9a6cc4']
    rng = np.random.default_rng(4)
    contas = ''
    # contas dentro do corpo (coordenadas do desenho original -> locais)
    pts = []
    for yy in np.arange(262, 120, -15.5):
        meio = 75; larg = 8 + (yy - 95) * (134 / 2 - 8) / 173 + 30
        for xx in np.arange(meio - larg + 9, meio + larg - 8, 15.5):
            pts.append((xx + rng.uniform(-1.5, 1.5) + (7.7 if int(yy) % 2 else 0), yy))
    for n, (u, v) in enumerate(pts):
        if not (8 < u < 141): continue
        contas += esfera(u * kk, v * kk, 7.2 * kk * 1.0, cores[n % 5], f'c{n % 5}', reflexo=True) if n < 5 else f'<use href="#cb{n % 5}" xlink:href="#cb{n % 5}" x="{u * kk:.1f}" y="{v * kk:.1f}"/>'
    defs = ''.join(f'<g id="cb{q}">{esfera(0, 0, 7.2 * kk, cores[q], f"cg{q}")}</g>' for q in range(5))
    corpo = f'<g opacity=".92">{contas}</g>'
    # contas que ja sairam pelo gargalo: so vermelhas e azuis (frequencias mudaram ao acaso)
    fora = ''
    for (u, v, c) in [(70, -16, 0), (88, -38, 1), (62, -62, 0), (96, -84, 0)]:
        fora += f'<use href="#cb{c}" xlink:href="#cb{c}" x="{u * kk:.1f}" y="{v * kk:.1f}"/>'
    grupo = f'<g transform="translate(34 70) rotate(118 {w / 2:.1f} {alt / 2:.1f})">{g}{corpo}{fora}</g>'
    return f'<defs>{defs}</defs>' + sombra_chao(96, 178, 84, 8) + grupo

def B11_4():   # equilibrio de Hardy-Weinberg: (p + q)^2 = p^2 + 2pq + q^2, em azulejos de area proporcional (p = 0,6; q = 0,4)
    from gera_mat2 import texto_no_plano, SANS_B
    c = Cena(-22, 50)
    p, q = .6, .4; Lt = 2.6; e = .16; gap = .05
    a, b = p * Lt, q * Lt
    x0, y0 = -Lt / 2, -Lt / 2
    tiles = [(x0, y0 + b, a, a, '#3f72b8', 'p²'), (x0 + a, y0 + b, b, a, '#8a63b8', 'pq'), (x0, y0, a, b, '#8a63b8', 'pq'), (x0 + a, y0, b, b, '#d65b4a', 'q²')]
    for x, y, w, d, cor, _ in tiles:
        o = c.add(Obj()); caixa_chanfro(o, x + gap / 2, x + w - gap / 2, y + gap / 2, y + d - gap / 2, 0, e, .03, cor, amb=.42, brilho=.25)
    def rot(cam):
        out = ''
        for x, y, w, d, cor, t in tiles:
            out += texto_no_plano(cam, t, lambda *P: P, x + w / 2, y + d / 2, e + .004, .42 if w * d > .5 else .3, '#ffffff', SANS_B)
        return out
    c.sobre.append(rot)
    return c.render()

def tentilhao(cx, cy, esc, k, bico, cor='#7a6048', espelha=False):
    """tentilhao de Darwin pousado (perfil voltado para a esquerda); bico: 'grosso' (sementes duras), 'fino' (insetos), 'medio'"""
    g = f'<defs>{grad_forma(k + "c", cor, .35, .3, .85, .45, .45)}{grad_forma(k + "a", mix(cor, "#000000", .2), .35, .3, .85, .35, .4)}{lin_grad(k + "b", "#5b5550", "#2b2724")}</defs>'
    g += f'<path d="M14 6 L40 22 L38 28 L12 14 Z" fill="{mix(cor, "#000000", .35)}" stroke="#2b2118" stroke-width=".8"/>'   # cauda
    g += f'<ellipse cx="0" cy="0" rx="22" ry="15" fill="url(#{k}c)" stroke="#3a2c20" stroke-width=".9" transform="rotate(-18)"/>'
    g += f'<path d="M-6 -6 C6 -10 20 -4 26 8 C14 8 2 6 -6 -6Z" fill="url(#{k}a)" stroke="#2b2118" stroke-width=".8"/>'   # asa
    for q in range(3):
        g += f'<path d="M{2 + q * 6} {-4 + q * 2} q6 4 10 10" fill="none" stroke="#2b2118" stroke-width=".7" opacity=".6"/>'
    g += f'<ellipse cx="-8" cy="6" rx="12" ry="7" fill="{mix(cor, "#ffffff", .35)}" opacity=".7" transform="rotate(-18 -8 6)"/>'   # peito
    g += f'<circle cx="-20" cy="-14" r="11" fill="url(#{k}c)" stroke="#3a2c20" stroke-width=".9"/>'   # cabeca
    if bico == 'grosso': b = 'M-28 -19 C-40 -18 -44 -10 -38 -4 C-34 -6 -30 -8 -27 -9 Z'
    elif bico == 'fino': b = 'M-29 -16 L-48 -12 L-29 -11 Z'
    else: b = 'M-29 -18 C-38 -16 -41 -12 -40 -10 L-28 -10 Z'
    g += f'<path d="{b}" fill="url(#{k}b)" stroke="#191512" stroke-width=".8"/>'
    g += f'<path d="M-29 -13 L{-40 if bico != "fino" else -46} -11.5" stroke="#191512" stroke-width=".7"/>'
    g += f'<circle cx="-23" cy="-16" r="2.4" fill="#111"/><circle cx="-23.7" cy="-16.8" r=".8" fill="#fff"/>'
    for x in (-4, 4):   # pes na forquilha
        g += f'<path d="M{x} 12 L{x - 1} 20 M{x - 1} 20 l-4 2 M{x - 1} 20 l3 2" stroke="#4a3a2c" stroke-width="1.4" stroke-linecap="round"/>'
    t = f'translate({cx:.1f} {cy:.1f}) scale({-esc if espelha else esc} {esc})'
    return f'<g transform="{t}">{g}</g>'

def B11_5():   # especiacao e irradiacao adaptativa: tentilhoes de Darwin com bicos diferentes (cada um adaptado a um alimento)
    out = sombra_chao(104, 186, 90, 7, op=.16)
    out += f'<defs>{lin_grad("gh", "#9a7650", "#5d4429")}</defs>'
    out += '<path d="M2 150 C50 140 130 156 198 136 L198 146 C130 166 50 152 2 160 Z" fill="url(#gh)" stroke="#3f2d1a" stroke-width=".9"/>'
    out += '<path d="M120 150 C140 160 150 170 160 176" fill="none" stroke="#6d5233" stroke-width="5" stroke-linecap="round"/>'
    out += tentilhao(46, 120, 1.15, 'f1', 'grosso', '#5e4a39')
    out += tentilhao(150, 106, 1.1, 'f2', 'fino', '#8a7a5a', espelha=True)
    out += tentilhao(104, 74, 1.0, 'f3', 'medio', '#6f5a44')
    out += '<path d="M90 92 C96 110 102 128 104 148" fill="none" stroke="#6d5233" stroke-width="4" stroke-linecap="round"/>'
    return out

# =============================================================================================== B12 (continuacao)
def bacteria(cx, cy, L, W, rot, k, cor='#b9d36a'):
    out = f'<defs>{grad_forma(k, cor, .4, .3, .8, .45, .4)}</defs>'
    d = f'M{-L / 2 + W / 2} {-W / 2} H{L / 2 - W / 2} A{W / 2} {W / 2} 0 0 1 {L / 2 - W / 2} {W / 2} H{-L / 2 + W / 2} A{W / 2} {W / 2} 0 0 1 {-L / 2 + W / 2} {-W / 2}Z'
    g = f'<path d="M{L / 2 - 2} 0 c10 -8 18 8 28 0 s18 -8 28 0 s16 8 24 2" fill="none" stroke="#7a5a32" stroke-width="1.8" stroke-linecap="round"/>'   # flagelo
    g += f'<path d="{d}" fill="url(#{k})" stroke="{mix(cor, "#000000", .5)}" stroke-width="1.1"/>'
    g += f'<path d="M{-L / 2 + W / 2 + 4} {-W / 2 + 4} H{L / 2 - W / 2 - 4}" stroke="#ffffff" stroke-width="3" stroke-linecap="round" opacity=".45"/>'
    rng = np.random.default_rng(3)
    for q in range(10):   # ribossomos e nucleoide
        g += f'<circle cx="{rng.uniform(-L * .38, L * .38):.1f}" cy="{rng.uniform(-W * .28, W * .28):.1f}" r="1.3" fill="{mix(cor, "#000000", .45)}" opacity=".6"/>'
    g += f'<path d="M{-L * .2} 2 c4 -6 8 6 12 0 s8 -6 12 0 s6 5 10 0" fill="none" stroke="#7a3f8a" stroke-width="1.4" opacity=".8"/>'
    return out + f'<g transform="translate({cx:.1f} {cy:.1f}) rotate({rot})">{g}</g>'

def B12_1():   # virus e bacterias: bacteriofago (capsideo icosaedrico, cauda e fibras) pousado sobre uma bacteria
    c = Cena(-20, 14, op_sombra=0)
    o = c.add(Obj(sombra=False)); o.prof = 0
    ph = (1 + 5 ** .5) / 2
    V = [(0, s1, s2 * ph) for s1 in (-1, 1) for s2 in (-1, 1)] + [(s1, s2 * ph, 0) for s1 in (-1, 1) for s2 in (-1, 1)] + [(s2 * ph, 0, s1) for s1 in (-1, 1) for s2 in (-1, 1)]
    r_ = .55 / math.sqrt(1 + ph ** 2)
    zc = 2.35
    # icosaedro com um vertice para cima
    ang = math.atan2(1, ph)
    def R(p):
        x, y, z = p; c_, s_ = math.cos(ang), math.sin(ang)
        return (x * c_ - z * s_, y, x * s_ + z * c_)
    P = [R(v) for v in V]
    solido_convexo(o, [(x * r_, y * r_, z * r_ + zc) for x, y, z in P], '#7fb3e6', amb=.38, brilho=.35, contorno='#2c4f78', sw=.6)
    h = c.add(Obj(sombra=False)); h.prof = 1
    cilindro_liso(h, (0, 0, zc - .62), (0, 0, .14), .17, cor='#d9b44a')                  # colar
    bainha = c.add(Obj(sombra=False)); bainha.prof = 2
    cilindro_liso(bainha, (0, 0, .5), (0, 0, zc - 1.12), .13, cor='#e3c25a', brilho=.3)     # bainha da cauda
    base = c.add(Obj(sombra=False)); base.prof = 1.5
    cilindro_liso(base, (0, 0, .4), (0, 0, .12), .26, cor='#c98d3a')                       # placa basal
    fib = c.add(Obj(sombra=False)); fib.prof = 3
    def fibras(cam):
        out = []
        for q in range(6):
            a = 2 * math.pi * q / 6 + .4
            p0 = (.24 * math.cos(a), .24 * math.sin(a), .45); p1 = (.75 * math.cos(a), .75 * math.sin(a), .6); p2 = (.95 * math.cos(a), .95 * math.sin(a), 0)
            (x0, y0), (x1, y1), (x2, y2) = cam.P(*p0), cam.P(*p1), cam.P(*p2)
            out.append((cam.D(*p1), f'<path d="M{x0:.1f} {y0:.1f} L{x1:.1f} {y1:.1f} L{x2:.1f} {y2:.1f}" fill="none" stroke="#5a4a3a" stroke-width="1.6" stroke-linejoin="round"/>'))
        return out
    fib.cru.append((fibras, [(1, 1, 0), (-1, -1, 0)]))
    fago = c.render(W=200, H=200)
    out = bacteria(96, 160, 160, 52, -3, 'bc')
    out += f'<g transform="translate(14 -22) scale(.84)">{fago}</g>'
    return out

def B12_2():   # protistas e fungos: ameba (protozoario) e leveduras em brotamento (fungo unicelular)
    out = sombra_chao(104, 186, 90, 8)
    g, _ = coloca(SV + 'Parasites/Servier/throphozoite-ehystolica.svg', 2, 6, alt=150, rot=-8); out += g
    for (x, y, r, rot, b) in [(132, 132, 22, -20, 1), (168, 150, 18, 30, 1), (150, 172, 15, 0, 0), (176, 118, 13, -40, 0)]:
        k = f'lv{x}'
        out += f'<defs>{grad_forma(k, "#ecd9a8", .35, .3, .8, .5, .4)}</defs>'
        out += f'<ellipse cx="{x}" cy="{y}" rx="{r}" ry="{r * .8:.1f}" fill="url(#{k})" stroke="#9c8250" stroke-width="1" transform="rotate({rot} {x} {y})"/>'
        if b:   # broto
            a = math.radians(rot - 30); bx, by = x + r * 1.05 * math.cos(a), y + r * 1.05 * math.sin(a)
            out += f'<circle cx="{bx:.1f}" cy="{by:.1f}" r="{r * .45:.1f}" fill="url(#{k})" stroke="#9c8250" stroke-width="1"/>'
        out += f'<circle cx="{x + 3}" cy="{y + 2}" r="{r * .3:.1f}" fill="#c9b5d6" stroke="#8f789f" stroke-width=".7" opacity=".9"/>'
        out += brilho(x - r * .4, y - r * .4, r * .25, r * .12, rot - 30, .6)
    return out

def B12_3():   # tecidos vegetais: caule de dicotiledonea em corte (epiderme, cortex, feixes de xilema e floema em anel, medula)
    c = Cena(-18, 56, op_sombra=.2)
    R = 1.0; H = .75
    def topo(cam, aro):
        zt = H
        def P(r, a): return cam.P(r * math.cos(a), r * math.sin(a), zt)
        def anel(r, n=60): return caminho([P(r, 2 * math.pi * q / n) for q in range(n)])
        s_ = f'<path d="{anel(R * .97)}" fill="#b9dc8c" stroke="#5e9a3a" stroke-width=".6"/>'   # cortex
        s_ += f'<path d="{anel(R * .6)}" fill="#f4f6e6" stroke="#c9cfa8" stroke-width=".5"/>'   # medula
        for q in range(10):   # feixes liberolenhosos
            a = 2 * math.pi * q / 10 + .15
            fl = caminho([P(r, a + da) for r, da in [(.86, -.15), (.89, 0), (.86, .15), (.73, .14), (.73, -.14)]])
            xi = caminho([P(r, a + da) for r, da in [(.73, -.16), (.73, .16), (.55, .09), (.5, 0), (.55, -.09)]])
            s_ += f'<path d="{fl}" fill="#8fc46a" stroke="#4f8a2a" stroke-width=".5"/>'
            s_ += f'<path d="{xi}" fill="#c0506a" stroke="#7e2338" stroke-width=".5"/>'
            for dr in (.67, .58):
                x, y = P(dr, a)
                s_ += f'<circle cx="{x:.1f}" cy="{y:.1f}" r="2.2" fill="#f8dfe5" stroke="#7e2338" stroke-width=".4"/>'
        x, y = P(.85, 2.6); s_ += ''
        return s_
    o = c.add(Obj())
    cilindro_liso(o, (0, 0, 0), (0, 0, H), R, cor='#6fae3f', tampa_cor='#b9dc8c', brilho=.25, extra_tampa=topo, contorno='#3f6b1d')
    return c.render()

def B12_4():   # estomatos: duas celulas-guarda (com cloroplastos) em volta do ostiolo, entre celulas da epiderme
    k = 'es'
    out = f'<defs>{grad_forma(k + "e", "#e6f0d6", .4, .35, .8, .4, .18)}{grad_forma(k + "g", "#9fd36b", .35, .3, .8, .45, .4)}</defs>'
    out += sombra_chao(102, 190, 90, 7, op=.15)
    # celulas da epiderme (formato de quebra-cabeca)
    cel = [[(4, 4), (70, 2), (66, 40), (40, 52), (6, 60)], [(70, 2), (196, 4), (194, 40), (150, 36), (130, 40), (66, 40)],
           [(6, 60), (40, 52), (50, 100), (44, 150), (4, 150)], [(194, 40), (196, 150), (156, 150), (150, 100), (160, 60)],
           [(4, 150), (44, 150), (66, 160), (130, 162), (156, 150), (196, 150), (196, 196), (4, 196)]]
    for q, c_ in enumerate(cel):
        out += f'<path d="{suave(c_, t=.25)}" fill="url(#{k}e)" stroke="#8aa37a" stroke-width="1.6"/>'
    # celulas-guarda (reniformes) e o ostiolo
    for s_ in (-1, 1):
        d = (f'M100 40 C{100 + s_ * 66} 40 {100 + s_ * 66} 160 100 160 C{100 + s_ * 22} 148 {100 + s_ * 24} 52 100 40Z')
        out += f'<path d="{d}" fill="url(#{k}g)" stroke="#3f7a22" stroke-width="1.3"/>'
        for (yy, dx) in [(62, 30), (84, 40), (108, 41), (132, 34), (74, 20), (120, 22)]:
            out += f'<ellipse cx="{100 + s_ * dx}" cy="{yy}" rx="5.4" ry="3.6" fill="#3f8f2a" stroke="#235a14" stroke-width=".6"/>'
        out += f'<ellipse cx="{100 + s_ * 34}" cy="98" rx="7" ry="9" fill="#c8b0d8" stroke="#7a5a92" stroke-width=".7" opacity=".9"/>'
    out += f'<path d="M100 52 C{100 - 14} 80 {100 - 14} 120 100 148 C{100 + 14} 120 {100 + 14} 80 100 52Z" fill="#2d3a24" opacity=".85"/>'
    out += brilho(78, 66, 6, 12, 10, .4) + brilho(120, 66, 6, 12, -10, .3)
    return out

def estrela_do_mar(cx, cy, R, k, cor='#f08a3c', rot=0):
    pts = []
    for q in range(10):
        a = math.radians(rot - 90 + q * 36); r = R if q % 2 == 0 else R * .38
        pts.append((cx + r * math.cos(a), cy + r * math.sin(a)))
    out = forma(suave(pts, t=.55), cor, k, sw=1, claro=.45, escuro=.4)
    rng = np.random.default_rng(2)
    for q in range(5):   # tuberculos ao longo dos bracos
        a = math.radians(rot - 90 + q * 72)
        for t in np.linspace(.18, .82, 5):
            x, y = cx + R * t * math.cos(a), cy + R * t * math.sin(a)
            out += f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{2.6 * (1 - t * .6):.1f}" fill="{mix(cor, "#ffffff", .5)}" stroke="{mix(cor, "#000000", .35)}" stroke-width=".5"/>'
    out += f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="{R * .12:.1f}" fill="{mix(cor, "#ffffff", .4)}" stroke="{mix(cor, "#000000", .35)}" stroke-width=".6"/>'
    return out

def B12_5():   # invertebrados: artropode (inseto: mosca-das-frutas) e equinodermo (estrela-do-mar)
    out = sombra_chao(104, 186, 90, 8)
    out += estrela_do_mar(68, 124, 64, 'ed', rot=-8)
    g, _ = coloca(SV + 'Animals/Servier/fruitfly_drosophila-redeyes.svg', 96, 2, alt=116, rot=14); out += g
    return out

if __name__ == '__main__':
    import sys
    todos = sorted(k for k in list(globals()) if re.match(r'B\d\d_\d$', k))
    alvo = [a.replace('.', '_') for a in sys.argv[1:]] or todos
    for k in alvo:
        id_ = k.replace('_', '.'); _ATUAL[0] = id_
        r = globals()[k](); prec = 1
        if isinstance(r, tuple): r, prec = r
        grava(id_, r, prec=prec)
    arq_u = os.path.join(BRUTO_SUB, '_usados.json')
    U = json.load(open(arq_u)) if os.path.exists(arq_u) else {}
    for k in alvo: U.pop(k.replace('_', '.'), None)
    U.update(USADOS); json.dump(dict(sorted(U.items())), open(arq_u, 'w'), indent=1)

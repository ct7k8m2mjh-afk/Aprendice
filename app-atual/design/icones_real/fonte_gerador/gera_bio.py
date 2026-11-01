# -*- coding: utf-8 -*-
"""Biologia: desenhos realistas da Servier Medical Art (CC BY 3.0) e, quando ela nao tem o objeto, desenhos no mesmo
acabamento (gradiente suave, contorno fino escuro, luz de cima-esquerda). Todos com a mesma sombra de contato."""
from util import *
import re
from servier import coloca, sombra_chao, carrega
SV = 'cc-by-3.0/'

def B01():   # Citologia: celula eucariotica com nucleo, mitocondrias, complexo golgiense e reticulo
    out = sombra_chao(108, 196, 80, 9)
    g, _ = coloca(SV + 'Oncology/Servier/normal-cell-1.svg', 4, 2, alt=196); out += g
    g, _ = coloca(SV + 'Intracellular_components/Servier/golgi-3d-1.svg', 100, 22, larg=56, rot=12); out += g
    g, _ = coloca(SV + 'Intracellular_components/Servier/mitochondrium-orange.svg', 22, 92, alt=50, rot=14); out += g
    g, _ = coloca(SV + 'Intracellular_components/Servier/mitochondrium-orange.svg', 150, 128, alt=40, rot=-48); out += g
    g, _ = coloca(SV + 'Intracellular_components/Servier/endoplasmatic-reticulum-rough-3d.svg', 64, 156, larg=74, rot=-4); out += g
    return out

def B03():   # Metabolismo energetico: mitocondria em corte (cristas)
    out = sombra_chao(104, 150, 86, 8)
    g, _ = coloca(SV + 'Intracellular_components/Servier/mitochondrium-1.svg', 4, 40, larg=192, rot=-8); out += g
    return out

def B04():   # Divisao celular: cromossomo duplicado (duas cromatides irmas unidas no centromero)
    out = sombra_chao(104, 192, 34, 6)
    g, _ = coloca(SV + 'Genetics/Servier/chromosome-1.svg', 70, 4, alt=186); out += g
    return out

def B07():   # Fisiologia humana: coracao
    out = sombra_chao(104, 192, 62, 7)
    g, _ = coloca(SV + 'Human_physiology/Servier/heart-front.svg', 30, 2, alt=192); out += g
    return out

def B08():   # Neuro, hormonios, imune e reproducao: encefalo
    out = sombra_chao(104, 192, 74, 8)
    g, _ = coloca(SV + 'Human_physiology/Servier/brain-2.svg', 8, 2, alt=190); out += g
    return out

def B09():   # Ecologia: arvore (recortada da cena "summer" da Servier: tronco, galhos, copa e frutos)
    out = sombra_chao(112, 196, 80, 8)
    g, _ = coloca(SV + 'General_items/Servier/summer.svg', -2, -26, alt=244, manter=set(range(8, 40)) | set(range(43, 103))); out += g
    return out

def B10():   # Saude e doencas: mosquito vetor (Anopheles, transmissor da malaria)
    out = sombra_chao(110, 186, 70, 6, op=.16)
    g, _ = coloca(SV + 'Animals/Servier/anopheles.svg', 2, 6, larg=196); out += g
    return out

def B02():   # Bioquimica celular: molecula de glicose (beta-D-glicopiranose), geometria real do RDKit
    import gera_qui
    return gera_qui.glicose()

def B04():   # Divisao celular: cromossomo duplicado (cromatides irmas unidas no centromero), bandas coradas como no cariotipo (Giemsa)
    rec = {'#abddf5': '#e9ddf0', '#00367b': '#4a2d66', '#009036': '#6b4787', '#58585a': '#55406a', '#887aa8': '#8b6aa6', '#bc7a81': '#a88bc0',
           '#ca004e': '#5d3a7d', '#e9c1ce': '#cdb8de', '#eb6e0e': '#7a5797', '#fdcc52': '#bba0cf', '#ffec00': '#d3c0e2'}
    out = sombra_chao(108, 190, 46, 6)
    g, _ = coloca(SV + 'Genetics/Servier/chromosome-1.svg', 76, 6, alt=180, recolor=rec, rot=-24); out += g
    return out

def B05():   # Genetica molecular: DNA-B em dupla-helice (modelo 3D do gera_ilu3d: 10 pares por volta, sulcos maior e menor)
    s = G.bio().replace('@K@', 'b5')
    s = re.sub(r'<ellipse[^>]*url\(#shb5\)[^>]*/>', '', s)
    miolo = re.sub(r'^<svg[^>]*>', '', s); miolo = re.sub(r'</svg>$', '', miolo)
    return sombra_chao(104, 186, 64, 7, op=.18) + f'<g transform="translate(10 18) rotate(-52 90 70)">{miolo}</g>'

def esfera2d(cx, cy, r, cor, gid):
    return (G.esfera_real(gid, cor).replace('@K@', '') , f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="{r:.1f}" fill="url(#{gid})"/>'
            f'<ellipse cx="{cx - r*.36:.1f}" cy="{cy - r*.4:.1f}" rx="{r*.24:.1f}" ry="{r*.14:.1f}" fill="#fff" opacity=".75" transform="rotate(-30 {cx - r*.36:.1f} {cy - r*.4:.1f})"/>')

def B06():   # Genetica classica: vagem de ervilha aberta (Mendel). 3 sementes amarelas e 1 verde na mesma vagem: a proporcao 3:1 da F2
    defs = [grad_lin('vg1', [(0, '#9fd068'), (.5, '#6fae3f'), (1, '#3f7a24')], 0, 0, 0, 1),
            grad_lin('vg2', [(0, '#d9efb4'), (1, '#a5d27a')], 0, 0, 0, 1),
            grad_lin('vg3', [(0, '#5c9a33'), (1, '#2f6219')], 0, 0, 0, 1)]
    # vagem deitada na diagonal: eixo de A (esq-baixo) a B (dir-cima)
    A, B = np.array([18., 150.]), np.array([188., 70.])
    u = (B - A) / np.linalg.norm(B - A); n = np.array([u[1], -u[0]])   # n aponta para cima-direita da tela
    L = np.linalg.norm(B - A)
    def P(t, h): q = A + u * t * L + n * h; return (q[0], q[1])
    larg = lambda t: 30 * math.sin(math.pi * t) ** .75
    costas = [P(t, larg(t) * 1.05) for t in np.linspace(0, 1, 40)] + [P(t, -larg(t) * .25) for t in np.linspace(1, 0, 40)]
    miolo = [P(t, larg(t) * .78) for t in np.linspace(.04, .96, 40)] + [P(t, -larg(t) * .1) for t in np.linspace(.96, .04, 40)]
    frente = [P(t, -larg(t) * .05) for t in np.linspace(0, 1, 40)] + [P(t, -larg(t) * .95) for t in np.linspace(1, 0, 40)]
    out = sombra_chao(108, 178, 86, 9)
    out += f'<path d="{caminho(costas)}" fill="url(#vg3)" stroke="#2c5a17" stroke-width=".8"/>'
    out += f'<path d="{caminho(miolo)}" fill="url(#vg2)"/>'
    ervilhas = [(.22, '#e9c23a'), (.40, '#e9c23a'), (.58, '#7fb446'), (.76, '#e9c23a')]
    for i, (t, cor) in enumerate(ervilhas):
        x, y = P(t, larg(t) * .3); r = 15.5 if t not in (.22,) else 14
        d, c = esfera2d(x, y, r, cor, f'ev{i}'); defs.append(d); out += c
        # funiculo: o cordaozinho que prende a semente na vagem
        fx, fy = P(t, larg(t) * .3 + r + 2)
        out += f'<line x1="{x:.1f}" y1="{y - r + 1:.1f}" x2="{fx:.1f}" y2="{fy:.1f}" stroke="#8fbf5c" stroke-width="2"/>'
    out += f'<path d="{caminho(frente)}" fill="url(#vg1)" stroke="#2c5a17" stroke-width=".8"/>'
    borda = [P(t, -larg(t) * .05) for t in np.linspace(.03, .97, 30)]
    out += f'<polyline points="{" ".join(f"{x:.1f},{y:.1f}" for x, y in borda)}" fill="none" stroke="#c8e6a0" stroke-width="1.4" opacity=".8"/>'
    # brilho e nervura da vagem
    br = [P(t, -larg(t) * .55) for t in np.linspace(.15, .85, 20)]
    out += f'<polyline points="{" ".join(f"{x:.1f},{y:.1f}" for x, y in br)}" fill="none" stroke="#d6f0b0" stroke-width="2.2" stroke-linecap="round" opacity=".55"/>'
    # pedunculo e calice na ponta esquerda
    x0, y0 = P(0, 0)
    out += f'<path d="M{x0+2:.1f} {y0:.1f} C{x0-6:.1f} {y0+4:.1f} {x0-12:.1f} {y0+2:.1f} {x0-16:.1f} {y0+10:.1f}" fill="none" stroke="#4f7d2a" stroke-width="3.2" stroke-linecap="round"/>'
    for ang in (-40, 10, 55):
        out += f'<path d="M{x0+1:.1f} {y0:.1f} q8 -5 15 1 q-8 4 -15 -1Z" fill="#5f9a34" transform="rotate({ang} {x0:.1f} {y0:.1f})"/>'
    return '<defs>' + ''.join(defs) + '</defs>' + out

def B11():   # Evolucao: peixe fossil impresso numa placa de rocha sedimentar
    rng = np.random.default_rng(5)
    defs = [grad_lin('rk', [(0, '#e6dccb'), (.6, '#cfc1a8'), (1, '#b3a386')], 0, 0, 1, 1),
            grad_lin('rk2', [(0, '#a69577'), (1, '#7d6d53')], 0, 0, 0, 1),
            '<filter id="rkn" x="0" y="0" width="1" height="1"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="3"/><feColorMatrix values="0 0 0 0 .35  0 0 0 0 .3  0 0 0 0 .22  0 0 0 .5 0"/><feComposite in2="SourceGraphic" operator="in"/></filter>']
    topo = [(14, 62), (52, 30), (120, 22), (178, 40), (192, 96), (176, 150), (120, 168), (48, 160), (10, 118)]
    lado = [(10, 118), (48, 160), (120, 168), (176, 150), (192, 96), (192, 108), (178, 162), (120, 180), (46, 172), (10, 130)]
    out = sombra_chao(108, 182, 90, 8)
    out += f'<path d="{caminho(lado)}" fill="url(#rk2)" stroke="#6d5e47" stroke-width=".8"/>'
    out += f'<path d="{caminho(topo)}" fill="url(#rk)" stroke="#8f7f63" stroke-width=".8"/>'
    out += f'<path d="{caminho(topo)}" fill="#fff" filter="url(#rkn)" opacity=".55"/>'
    # o peixe (vista lateral, cabeca a esquerda), em tom mais escuro como um molde mineralizado
    cx, cy = 100, 96; esc = 1.0
    cor = '#6e5a3e'; cl = '#4f3f2a'
    corpo = f'M42 94 C52 70 92 62 130 76 C146 82 156 90 160 96 C156 102 146 110 130 114 C92 126 52 118 42 94Z'
    out += f'<path d="{corpo}" fill="#b49f7e" opacity=".55"/>'
    # cranio e opercula
    out += f'<path d="M42 94 C46 80 58 72 70 74 C74 84 74 104 70 114 C58 116 46 108 42 94Z" fill="#8a7454" stroke="{cl}" stroke-width="1"/>'
    out += f'<circle cx="54" cy="88" r="4.5" fill="#cbb995" stroke="{cl}" stroke-width="1"/>'
    out += f'<path d="M66 78 C70 88 70 102 66 110" fill="none" stroke="{cl}" stroke-width="1.2"/>'
    out += f'<path d="M42 95 L50 97" stroke="{cl}" stroke-width="1.2"/>'
    # coluna vertebral
    esp = [(72 + i * 4.2, 94 + 1.6 * math.sin(i * .25)) for i in range(20)]
    out += f'<polyline points="{" ".join(f"{x:.1f},{y:.1f}" for x, y in esp)}" fill="none" stroke="{cl}" stroke-width="2.2"/>'
    for x, y in esp:
        out += f'<rect x="{x - 1.6:.1f}" y="{y - 2.2:.1f}" width="3.2" height="4.4" rx="1" fill="#8a7454" stroke="{cl}" stroke-width=".6"/>'
    # costelas e espinhos
    for i, (x, y) in enumerate(esp[1:16]):
        k = 1 - i / 18
        out += f'<path d="M{x:.1f} {y + 2:.1f} q-4 {10 * k:.1f} -6 {20 * k:.1f}" fill="none" stroke="{cl}" stroke-width=".9"/>'
        out += f'<path d="M{x:.1f} {y - 2:.1f} q-3 {-8 * k:.1f} -5 {-16 * k:.1f}" fill="none" stroke="{cl}" stroke-width=".8"/>'
    # nadadeiras com raios
    def leque(ox, oy, a0, a1, L, n):
        s = ''
        for a in np.linspace(a0, a1, n):
            s += f'<line x1="{ox}" y1="{oy}" x2="{ox + L * math.cos(math.radians(a)):.1f}" y2="{oy + L * math.sin(math.radians(a)):.1f}" stroke="{cl}" stroke-width=".8"/>'
        return s
    out += leque(160, 96, -40, 40, 26, 11)          # cauda
    out += leque(112, 72, -150, -110, 16, 7)        # dorsal
    out += leque(124, 116, 100, 140, 14, 6)         # anal
    out += leque(78, 106, 110, 160, 13, 5)          # peitoral
    # rachaduras da rocha
    out += '<path d="M150 40 L142 58 L148 70" fill="none" stroke="#9c8b6c" stroke-width=".8" opacity=".8"/>'
    out += '<path d="M30 130 L44 126 L52 140" fill="none" stroke="#9c8b6c" stroke-width=".8" opacity=".8"/>'
    return '<defs>' + ''.join(defs) + '</defs>' + out

def B12():   # Diversidade dos seres vivos: um animal (caramujo) sobre uma folha, ao lado de um fungo (cogumelo)
    defs = [grad_lin('fo', [(0, '#8fc85a'), (.55, '#5d9e37'), (1, '#3a7224')], 0, 0, 1, 1)]
    A, B = np.array([14., 168.]), np.array([186., 40.])
    u = (B - A) / np.linalg.norm(B - A); n = np.array([u[1], -u[0]]); L = np.linalg.norm(B - A)
    def P(t, h): q = A + u * t * L + n * h; return (q[0], q[1])
    larg = lambda t: 50 * math.sin(math.pi * t ** .85) ** .9
    folha = [P(t, larg(t)) for t in np.linspace(0, 1, 50)] + [P(t, -larg(t) * .92) for t in np.linspace(1, 0, 50)]
    out = sombra_chao(104, 182, 88, 9)
    out += f'<path d="{caminho(folha)}" fill="url(#fo)" stroke="#2f5f1b" stroke-width=".9"/>'
    nerv = [P(t, 0) for t in np.linspace(0, .97, 20)]
    out += f'<polyline points="{" ".join(f"{x:.1f},{y:.1f}" for x, y in nerv)}" fill="none" stroke="#c9e6a3" stroke-width="2"/>'
    for t in np.linspace(.12, .82, 7):
        for s in (1, -1):
            a = P(t, 0); b = P(t + .13, s * larg(t + .13) * .82)
            out += f'<path d="M{a[0]:.1f} {a[1]:.1f} Q{P(t + .09, s * larg(t) * .35)[0]:.1f} {P(t + .09, s * larg(t) * .35)[1]:.1f} {b[0]:.1f} {b[1]:.1f}" fill="none" stroke="#b5dc88" stroke-width="1" opacity=".85"/>'
    out += f'<path d="M{A[0]:.1f} {A[1]:.1f} l-10 10" stroke="#4d7a2a" stroke-width="3" stroke-linecap="round"/>'
    g, _ = coloca(SV + 'Animals/Servier/snail.svg', 52, 52, larg=112); out += g
    g, _ = coloca(SV + 'General_items/Servier/mushroom.svg', 122, 116, larg=70); out += g
    return '<defs>' + ''.join(defs) + '</defs>' + out

if __name__ == '__main__':
    import sys
    alvo = sys.argv[1:] or [k for k in list(globals()) if re.match(r'B\d\d$', k)]
    for k in alvo: grava(k, globals()[k]())

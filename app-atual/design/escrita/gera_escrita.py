# -*- coding: utf-8 -*-
"""30/10: fonte de TRACO UNICO para a escrita a mao das resolucoes (EMS Readability Italic, SIL OFL; conversao SVG de
Windell H. Oskay / Evil Mad Scientist, pacote npm 'hersheytext'). Cada letra vira uma lista de tracos; os pontos (a fonte vem em
segmentos retos) sao suavizados em curvas Catmull-Rom -> Bezier, para a letra sair com voltas e nao "reto, reto, reto".
Os simbolos que a fonte nao tem (−, →, ⇌, ≈, ≤, √, π, Δ, expoentes e indices...) sao desenhados aqui como tracos.
Saida: dicionario {a: ascendente, g: {char: [avanco, [d, d, ...]] | [ref, 'sup'|'sub'] | 0 (sem traco: o app escreve com a fonte comum)}}"""
import re, json, os
from xml.etree import ElementTree as ET
AQUI = os.path.dirname(os.path.abspath(__file__))

def _pontos(d):
    subs, cur = [], None
    for cmd, x, y in re.findall(r'([ML])\s*([-\d.]+)[ ,]+([-\d.]+)', d):
        if cmd == 'M': cur = []; subs.append(cur)
        cur.append((float(x), float(y)))
    return subs

def _suave(pts):
    """Catmull-Rom uniforme -> cubicas. 2 pontos: reta."""
    f = lambda v: ('%.0f' % v)
    if len(pts) < 3: return 'M' + ' L'.join(f(x) + ' ' + f(y) for x, y in pts)
    out = 'M%s %s' % (f(pts[0][0]), f(pts[0][1]))
    P = [pts[0]] + pts + [pts[-1]]
    for i in range(1, len(P) - 2):
        p0, p1, p2, p3 = P[i - 1], P[i], P[i + 1], P[i + 2]
        c1 = (p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6)
        c2 = (p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6)
        out += ' C%s %s %s %s %s %s' % (f(c1[0]), f(c1[1]), f(c2[0]), f(c2[1]), f(p2[0]), f(p2[1]))
    return out

# simbolos desenhados a mao (unidades da fonte: ~1000 por em, linha de base em 0, y para cima)
EXTRA = {
    '−': (560, ['M110 300 L450 300']),
    '→': (720, ['M80 300 C260 302 460 298 620 300', 'M520 384 C560 350 590 320 622 300 C588 282 556 252 522 214']),
    '⇌': (740, ['M90 372 L630 372 L540 440', 'M650 230 L110 230 L200 162']),
    '↔': (760, ['M90 300 L670 300', 'M180 380 L90 300 L180 220', 'M580 380 L670 300 L580 220']),
    '≈': (700, ['M100 380 C180 430 260 430 340 380 C420 330 500 330 600 380', 'M100 220 C180 270 260 270 340 220 C420 170 500 170 600 220']),
    '≤': (680, ['M560 540 L140 380 L560 220', 'M140 110 L560 110']),
    '≥': (680, ['M140 540 L560 380 L140 220', 'M140 110 L560 110']),
    '≠': (700, ['M150 380 L560 380', 'M150 210 L560 210', 'M460 520 L250 70']),
    '≡': (700, ['M150 430 L560 430', 'M150 300 L560 300', 'M150 170 L560 170']),
    '√': (700, ['M50 300 L130 340 L230 40 C280 260 320 500 370 700 L690 700']),
    'π': (640, ['M70 410 C200 470 450 460 600 440', 'M230 440 C230 300 200 140 140 20', 'M450 440 C440 300 440 120 540 20']),
    'Δ': (680, ['M70 20 L340 690 L620 20 Z']),
    'ℓ': (420, ['M90 140 C240 300 380 600 320 690 C260 760 170 520 190 220 C200 70 270 0 360 60']),
    '…': (700, ['M120 30 L130 40', 'M330 30 L340 40', 'M540 30 L550 40']),
    '·': (300, ['M140 300 L150 310']),
    '×': (520, ['M110 420 L410 120', 'M410 420 L110 120']),
    '÷': (600, ['M110 290 L490 290', 'M295 470 L305 480', 'M295 100 L305 110']),
    '°': (380, ['M190 690 C120 690 100 620 130 580 C160 540 240 545 255 600 C270 660 240 690 190 690']),
}
SUP = dict(zip('⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻ⁿˣᵗ⁽⁾', '0123456789+−nxt()'))
SUB = dict(zip('₀₁₂₃₄₅₆₇₈₉₊₋ₙₓₖᵢⱼᵥₐₑ₍₎', '0123456789+−nxkijvae()'))

def gera(chars):
    t = ET.parse(os.path.join(AQUI, 'EMSReadabilityItalic.svg')); ns = {'s': 'http://www.w3.org/2000/svg'}
    dadv = float(t.find('.//s:font', ns).get('horiz-adv-x') or 400)
    F = {}
    for gl in t.findall('.//s:glyph', ns):
        u = gl.get('unicode')
        if u and len(u) == 1: F[u] = (float(gl.get('horiz-adv-x') or dadv), gl.get('d') or '')
    g = {}
    base = set(chars) | set('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789áàâãéêíóôõúüçÁÀÂÃÉÊÍÓÔÕÚÇ.,;:!?()[]{}+-=/%<>\'"') 
    for c in sorted(base):
        if c.isspace(): continue
        if c in SUP: g[c] = [SUP[c], 'sup']; continue
        if c in SUB: g[c] = [SUB[c], 'sub']; continue
        if c in EXTRA: a, ds = EXTRA[c]; g[c] = [a, ds]; continue
        if c in F:
            a, d = F[c]; g[c] = [round(a), [_suave(p) for p in _pontos(d) if p]]; continue
        g[c] = 0   # sem traco: o app escreve este simbolo com a fonte comum
    for c in list(SUP.values()) + list(SUB.values()):   # as bases de expoente/indice precisam existir
        if c not in g:
            if c in EXTRA: g[c] = [EXTRA[c][0], EXTRA[c][1]]
            elif c in F: a, d = F[c]; g[c] = [round(a), [_suave(p) for p in _pontos(d) if p]]
    g[' '] = [round(F.get(' ', (330, ''))[0]), []]
    return {'a': 760, 'g': g}

if __name__ == '__main__':
    import sys
    print(len(json.dumps(gera(set(sys.argv[1] if len(sys.argv) > 1 else 'Ação 3p + 2p = 500 − 50 → x² ÷ 7')), ensure_ascii=False)))

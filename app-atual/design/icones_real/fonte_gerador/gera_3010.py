# -*- coding: utf-8 -*-
"""30/10 - redesenhos pedidos pelo Vitor (ver design/ICONES_3010.md):
  P02   Argumentacao: dois baloes de fala sobrepostos, "SIM" (verde, na frente) x "NAO" (coral, atras), rabichos para lados opostos
  P01.2 Informacao explicita x inferencia: o disfarce de detetive realista (chapeu fedora, oculos redondos e bigode)
Desenho direto em SVG (caixa 0..200, mesmo viewBox -17.6 -17.6 235.3 235.3 dos demais), luz de cima-esquerda,
degrade de volume, sombra coerente com o objeto. Letras convertidas em contorno (DejaVu Sans Condensed Bold).
Uso: python3 gera_3010.py <pasta_saida>   (grava P02.svg e sub/P01.2.svg nessa pasta)"""
import math, os, re, sys
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen

FONTE = '/usr/share/fonts/truetype/dejavu/DejaVuSansCondensed-Bold.ttf'
VB = '-17.6 -17.6 235.3 235.3'

def texto_path(txt, cx, base, tam, arq=FONTE, track=0.03):
    f = TTFont(arq); gs = f.getGlyphSet(); cmap = f.getBestCmap(); k = tam / f['head'].unitsPerEm
    nomes = [cmap[ord(c)] for c in txt]
    larg = sum(gs[n].width for n in nomes) * k + track * tam * (len(txt) - 1)
    x = cx - larg / 2; out = []
    for n in nomes:
        pen = SVGPathPen(gs); gs[n].draw(TransformPen(pen, (k, 0, 0, -k, x, base)))
        out.append(pen.getCommands()); x += gs[n].width * k + track * tam
    return re.sub(r'(\d+\.\d)\d+', r'\1', ' '.join(out))

def f1(v): return f'{v:.1f}'.rstrip('0').rstrip('.')

def balao(cx, cy, rx, ry, a1, a2, ponta, curva=.35):
    """elipse com rabicho: abre a elipse entre os angulos a1->a2 (graus, sentido da tela) e liga as duas bordas a ponta"""
    pts = []
    a1r, a2r = math.radians(a1), math.radians(a2)
    # percorre a elipse de a2 ate a1 + 360 (o lado de fora do rabicho)
    n = 96; span = (a1r + 2 * math.pi) - a2r
    for i in range(n + 1):
        t = a2r + span * i / n
        pts.append((cx + rx * math.cos(t), cy + ry * math.sin(t)))
    p1 = pts[-1]; p2 = pts[0]
    tx, ty = ponta
    # curvas suaves da borda ate a ponta (rabicho levemente curvo)
    c1 = (p1[0] + (tx - p1[0]) * .55 + (cx - tx) * curva * .2, p1[1] + (ty - p1[1]) * .35)
    c2 = (p2[0] + (tx - p2[0]) * .6, p2[1] + (ty - p2[1]) * .7)
    d = 'M' + ' '.join(f'{f1(x)} {f1(y)}' for x, y in pts)
    d += f' Q{f1(c1[0])} {f1(c1[1])} {f1(tx)} {f1(ty)} Q{f1(c2[0])} {f1(c2[1])} {f1(p2[0])} {f1(p2[1])}Z'
    return d

def P02():
    K = 'P02'
    # balao de tras (coral, NAO): alto-direita, rabicho para baixo-direita
    dB = balao(126, 72, 72, 51, 28, 48, (196, 142))
    # balao da frente (verde, SIM): baixo-esquerda, rabicho para baixo-esquerda
    dF = balao(72, 120, 70, 50, 132, 152, (6, 190))
    esp = 7   # espessura (lado iluminado de cima-esquerda: a lateral aparece embaixo-direita)
    def lateral(d, cor, gid):
        return ''.join(f'<path d="{d}" fill="{cor}" transform="translate({f1(i * .45)} {f1(i * .8)})"/>' for i in range(esp, 0, -1))
    defs = (
        f'<filter id="{K}-bl" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="3"/></filter>'
        f'<filter id="{K}-bl2" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="4.5"/></filter>'
        f'<radialGradient id="{K}-vd" cx="32%" cy="26%" r="78%"><stop offset="0" stop-color="#c9f3b8"/><stop offset=".35" stop-color="#6cc66a"/><stop offset=".8" stop-color="#2f9447"/><stop offset="1" stop-color="#227a3a"/></radialGradient>'
        f'<radialGradient id="{K}-cr" cx="32%" cy="26%" r="78%"><stop offset="0" stop-color="#ffd0c4"/><stop offset=".35" stop-color="#f27a68"/><stop offset=".8" stop-color="#d2473c"/><stop offset="1" stop-color="#b13a31"/></radialGradient>'
        f'<linearGradient id="{K}-br" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".85"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>'
        f'<clipPath id="{K}-cB"><path d="{dB}"/></clipPath>'
    )
    # sem sombra no chao: baloes de fala flutuam, nao ha chao no desenho; a unica sombra e a que o da frente projeta no de tras
    chao = (f'<g fill="#1b1d2a" filter="url(#{K}-bl2)">'
            f'<ellipse cx="136" cy="206" rx="60" ry="5" opacity=".13"/>'
            f'<ellipse cx="80" cy="211" rx="64" ry="6" opacity=".2"/></g>')
    letrasN = texto_path('NÃO', 143, 81, 31)
    letrasS = texto_path('SIM', 74, 136, 34)
    corpo = (
        # ---- balao de tras
        lateral(dB, '#8e2c26', 'b') +
        f'<path d="{dB}" fill="url(#{K}-cr)"/>' +
        f'<path d="{letrasN}" fill="#7d211c" opacity=".55" transform="translate(.8 1.6)"/>' +
        f'<path d="{letrasN}" fill="#fff"/>' +
        # sombra que o balao da frente projeta no de tras (a mesma silhueta, deslocada pela luz)
        f'<g clip-path="url(#{K}-cB)"><path d="{dF}" fill="#3a0d0a" opacity=".38" filter="url(#{K}-bl)" transform="translate(9 9)"/></g>' +
        f'<ellipse cx="96" cy="44" rx="40" ry="14" fill="url(#{K}-br)" opacity=".55" transform="rotate(-14 96 44)"/>' +
        # ---- balao da frente
        lateral(dF, '#1b5e2c', 'f') +
        f'<path d="{dF}" fill="url(#{K}-vd)"/>' +
        f'<path d="{dF}" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="1.2"/>' +
        f'<path d="{letrasS}" fill="#145024" opacity=".55" transform="translate(.8 1.6)"/>' +
        f'<path d="{letrasS}" fill="#fff"/>' +
        f'<ellipse cx="46" cy="92" rx="36" ry="12" fill="url(#{K}-br)" opacity=".6" transform="rotate(-14 46 92)"/>'
    )
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{VB}"><defs>{defs}</defs>{corpo}</svg>'

def espelha(d):
    """espelha um path absoluto (so comandos M/C/L/Q/Z com numeros em pares) em torno de x = 100"""
    toks = re.findall(r'[MCLQZ]|-?\d+\.?\d*', d); out = []; par = 0
    for t in toks:
        if t.isalpha(): out.append(t); par = 0; continue
        v = float(t)
        if par % 2 == 0: v = 200 - v
        out.append(f1(v)); par += 1
    return ' '.join(out)

def P01_2():
    K = 'P01.2'
    defs = (
        f'<filter id="{K}-bl" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="2.2"/></filter>'
        # feltro do chapeu (marrom de fedora), luz de cima-esquerda
        f'<radialGradient id="{K}-cp" cx="30%" cy="22%" r="85%"><stop offset="0" stop-color="#b08a62"/><stop offset=".45" stop-color="#7a5a3c"/><stop offset="1" stop-color="#3f2c1c"/></radialGradient>'
        f'<linearGradient id="{K}-ab" x1="0" y1="0" x2="1" y2=".3"><stop offset="0" stop-color="#9c7853"/><stop offset=".5" stop-color="#7a5a3c"/><stop offset="1" stop-color="#4a3422"/></linearGradient>'
        f'<linearGradient id="{K}-abs" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a281a"/><stop offset="1" stop-color="#22170e"/></linearGradient>'
        f'<linearGradient id="{K}-fx" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3b3b44"/><stop offset=".5" stop-color="#1c1c22"/><stop offset="1" stop-color="#0d0d10"/></linearGradient>'
        # armacao de tartaruga e lentes
        f'<linearGradient id="{K}-ar" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8a5a32"/><stop offset=".4" stop-color="#4e2f18"/><stop offset=".7" stop-color="#6b4224"/><stop offset="1" stop-color="#2a170b"/></linearGradient>'
        f'<radialGradient id="{K}-le" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="#ffffff" stop-opacity=".95"/><stop offset=".5" stop-color="#dfeaf2" stop-opacity=".85"/><stop offset="1" stop-color="#9fb6c8" stop-opacity=".9"/></radialGradient>'
        # bigode
        f'<linearGradient id="{K}-bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8a5a32"/><stop offset=".55" stop-color="#55331a"/><stop offset="1" stop-color="#2c190b"/></linearGradient>'
    )
    # ---------------- chapeu fedora
    aba_borda = '<ellipse cx="100" cy="84" rx="95" ry="22" fill="url(#' + K + '-abs)"/>'
    aba = f'<ellipse cx="100" cy="80" rx="95" ry="21" fill="url(#{K}-ab)"/>'
    aba_brilho = f'<path d="M14 74 Q60 58 112 59" fill="none" stroke="#d8b892" stroke-width="2" stroke-linecap="round" opacity=".55"/>'
    # sombra da copa sobre a aba (luz de cima-esquerda: cai para a direita)
    copa_sombra = f'<ellipse cx="116" cy="82" rx="58" ry="12" fill="#1c120a" opacity=".45" filter="url(#{K}-bl)"/>'
    copa = 'M52 80 C48 52 52 30 62 20 C76 10 92 16 100 23 C108 16 124 10 138 20 C148 30 152 52 148 80 Q100 92 52 80Z'
    vinco = (f'<path d="M100 23 C96.5 31 96.5 41 100 48 C103.5 41 103.5 31 100 23Z" fill="#2e1f13" opacity=".6"/>'
             f'<path d="M66 34 C74 40 76 52 74 62" fill="none" stroke="#2e1f13" stroke-width="5" stroke-linecap="round" opacity=".28" filter="url(#{K}-bl)"/>'
             f'<path d="M134 34 C126 40 124 52 126 62" fill="none" stroke="#2e1f13" stroke-width="6" stroke-linecap="round" opacity=".38" filter="url(#{K}-bl)"/>'
             f'<path d="M62 23 C70 16 84 15 94 21" fill="none" stroke="#e2c49e" stroke-width="2.4" stroke-linecap="round" opacity=".55"/>'
             f'<path d="M56 44 C54 54 54 64 56 72" fill="none" stroke="#caa57c" stroke-width="2.2" stroke-linecap="round" opacity=".4"/>')
    fita = f'M51 64 Q100 74 149 64 L148.4 80 Q100 92 51.6 80Z'
    laco = (f'<path d="M58 67 L46 61 L44 73 L58 75Z" fill="#141418"/>'
            f'<path d="M57 66.5 L47 62 L46 67" fill="none" stroke="#56565f" stroke-width="1" opacity=".8"/>')
    chapeu = (aba_borda + aba + aba_brilho + copa_sombra +
              f'<path d="{copa}" fill="url(#{K}-cp)"/>' + vinco +
              f'<path d="{fita}" fill="url(#{K}-fx)"/>' +
              f'<path d="M51 64 Q100 74 149 64" fill="none" stroke="#6c6c78" stroke-width="1" opacity=".7"/>')
    # ---------------- oculos redondos (vistos de frente, hastes indo para tras)
    def aro(cx):
        return (f'<circle cx="{cx}" cy="123" r="25" fill="url(#{K}-le)"/>'
                f'<path d="M{cx - 15} {112} Q{cx - 8} {105} {cx + 2} {106}" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round" opacity=".9"/>'
                f'<path d="M{cx + 10} {137} Q{cx + 16} {133} {cx + 18} {126}" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" opacity=".7"/>'
                f'<circle cx="{cx}" cy="123" r="25" fill="none" stroke="url(#{K}-ar)" stroke-width="6.5"/>'
                f'<circle cx="{cx}" cy="123" r="28" fill="none" stroke="#1a0e06" stroke-width=".9" opacity=".55"/>'
                f'<path d="M{cx - 20} {108} A25 25 0 0 1 {cx + 4} {98.3}" fill="none" stroke="#c99a6a" stroke-width="1.6" stroke-linecap="round" opacity=".8"/>')
    oculos = (f'<path d="M41 116 L22 106" stroke="#3a2212" stroke-width="5" stroke-linecap="round"/>'
              f'<path d="M159 116 L178 106" stroke="#2a170b" stroke-width="5" stroke-linecap="round"/>'
              + aro(68) + aro(132) +
              f'<path d="M92 118 Q100 110 108 118" fill="none" stroke="url(#{K}-ar)" stroke-width="5.5" stroke-linecap="round"/>'
              f'<path d="M93 116 Q100 109.5 107 116" fill="none" stroke="#c99a6a" stroke-width="1.1" opacity=".7"/>')
    # ---------------- bigode (meia-lua de cada lado com a ponta virada para cima)
    dir_ = 'M100 157 C110 149 126 147 140 153 C149 157 156 158 162 150 C164 160 157 171 143 173 C128 175 112 172 100 167Z'
    esq = espelha(dir_)
    fios = ''.join(f'<path d="M{f1(x)} {f1(155 + (x - 100) * .05)} Q{f1(x + 4)} {f1(163)} {f1(x + 2)} {f1(170 - (x - 100) * .02)}" fill="none" stroke="#8a5e38" stroke-width="1" opacity=".5"/>'
                   for x in (106, 114, 122, 130, 138))
    fios += ''.join(f'<path d="M{f1(200 - x)} {f1(155 + (x - 100) * .05)} Q{f1(196 - x)} {f1(163)} {f1(198 - x)} {f1(170 - (x - 100) * .02)}" fill="none" stroke="#8a5e38" stroke-width="1" opacity=".5"/>'
                    for x in (106, 114, 122, 130, 138))
    bigode = (f'<path d="{dir_}" fill="url(#{K}-bg)"/><path d="{esq}" fill="url(#{K}-bg)"/>' + fios +
              f'<path d="M64 156 C74 150 88 151 97 157" fill="none" stroke="#b5875a" stroke-width="1.6" stroke-linecap="round" opacity=".6"/>')
    corpo = chapeu + oculos + bigode
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{VB}"><defs>{defs}</defs>{corpo}</svg>'

if __name__ == '__main__':
    out = sys.argv[1]
    os.makedirs(os.path.join(out, 'sub'), exist_ok=True)
    open(os.path.join(out, 'P02.svg'), 'w').write(P02())
    if 'P01_2' in globals():
        open(os.path.join(out, 'sub', 'P01.2.svg'), 'w').write(P01_2())

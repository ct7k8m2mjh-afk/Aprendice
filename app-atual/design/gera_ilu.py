# -*- coding: utf-8 -*-
"""Ilustracoes das materias (180x140), desenhadas com luz e sombra, sem brilho/neon.
Saida: design/ilu.json  {bio,qui,mat,por: svg com @K@ no lugar do sufixo dos ids}"""
import json, math, os
os.chdir(os.path.dirname(os.path.abspath(__file__)))

def hx(c): c = c.lstrip('#'); return tuple(int(c[i:i+2], 16) for i in (0, 2, 4))
def mix(a, b, t): a, b = hx(a), hx(b); return '#%02x%02x%02x' % tuple(round(a[i] + (b[i] - a[i]) * t) for i in range(3))
def sombra(cx, cy, rx, ry, op=.45):
    return (f'<radialGradient id="sh@K@"><stop offset="0" stop-color="#000" stop-opacity="{op}"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>',
            f'<ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" fill="url(#sh@K@)"/>')
SV = '<svg class="ilu" viewBox="0 0 180 140" aria-hidden="true">'

# ---------------- MATEMATICA: grafico 3D de z = f(x, y), como num software de graficos ----------------
def mat():
    AZ, EL = math.radians(-55), math.radians(30)
    def f(x, y): return 2.0 * math.exp(-(x * x + y * y) / 1.1)
    def V(x, y, z):
        xr = x * math.cos(AZ) - y * math.sin(AZ); yr = x * math.sin(AZ) + y * math.cos(AZ)
        return xr, z * math.cos(EL) + yr * math.sin(EL), yr * math.cos(EL) - z * math.sin(EL)   # tela x, tela cima, profundidade
    R, N, ZT = 2.0, 19, 2.2
    # enquadramento: caixa inteira cabe no quadro
    cant = [V(x, y, z) for x in (-R, R) for y in (-R, R) for z in (0, ZT)]
    xs = [c[0] for c in cant]; us = [c[1] for c in cant]
    esc = min(150 / (max(xs) - min(xs)), 104 / (max(us) - min(us)))
    cx = 90 - esc * (max(xs) + min(xs)) / 2; cy = 70 + esc * (max(us) + min(us)) / 2
    def P(x, y, z):
        a, b, _ = V(x, y, z); return cx + a * esc, cy - b * esc
    L = (-.45, -.35, .82); n = math.sqrt(sum(v * v for v in L)); L = tuple(v / n for v in L)
    quads = []
    for i in range(N):
        for j in range(N):
            x0, x1 = -R + 2 * R * i / N, -R + 2 * R * (i + 1) / N
            y0, y1 = -R + 2 * R * j / N, -R + 2 * R * (j + 1) / N
            zs = [f(x0, y0), f(x1, y0), f(x1, y1), f(x0, y1)]
            dzdx = ((zs[1] - zs[0]) + (zs[2] - zs[3])) / 2 / (x1 - x0)
            dzdy = ((zs[3] - zs[0]) + (zs[2] - zs[1])) / 2 / (y1 - y0)
            m = math.sqrt(dzdx * dzdx + dzdy * dzdy + 1)
            luz = max(0, (-dzdx * L[0] - dzdy * L[1] + L[2]) / m)
            h = sum(zs) / 4 / 2.0
            base = mix('#2F2A8F', '#6E5CF0', min(1, h * 1.6)) if h < .62 else mix('#6E5CF0', '#D5DAFF', (h - .62) / .38)
            cor = mix('#110e3d', base, .45 + .55 * luz)
            prof = V((x0 + x1) / 2, (y0 + y1) / 2, sum(zs) / 4)[2]
            pts = [P(x0, y0, zs[0]), P(x1, y0, zs[1]), P(x1, y1, zs[2]), P(x0, y1, zs[3])]
            quads.append((prof, cor, pts))
    quads.sort(key=lambda q: -q[0])   # do fundo para a frente
    def ln(a, b, cor, w=1, op=1):
        (x1, y1), (x2, y2) = P(*a), P(*b)
        return f'<line x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}" stroke="{cor}" stroke-width="{w}" opacity="{op}" stroke-linecap="round"/>'
    # paredes do fundo e chao com grade (como no matplotlib); o canto do fundo e o de maior profundidade
    fundo = max([(x, y) for x in (-R, R) for y in (-R, R)], key=lambda c: V(c[0], c[1], 0)[2])
    bx, by = fundo
    grade = ''
    k = [(-R + 2 * R * i / 4) for i in range(5)]
    for v in k:
        grade += ln((v, -R, 0), (v, R, 0), '#5b63a8', .6, .5) + ln((-R, v, 0), (R, v, 0), '#5b63a8', .6, .5)
        grade += ln((v, by, 0), (v, by, ZT), '#5b63a8', .5, .35) + ln((bx, v, 0), (bx, v, ZT), '#5b63a8', .5, .35)
    for z in (ZT / 3, 2 * ZT / 3, ZT):
        grade += ln((-R, by, z), (R, by, z), '#5b63a8', .5, .35) + ln((bx, -R, z), (bx, R, z), '#5b63a8', .5, .35)
    paredes = ''
    for poly in ([(-R, by, 0), (R, by, 0), (R, by, ZT), (-R, by, ZT)], [(bx, -R, 0), (bx, R, 0), (bx, R, ZT), (bx, -R, ZT)], [(-R, -R, 0), (R, -R, 0), (R, R, 0), (-R, R, 0)]):
        paredes += '<path d="M' + ' L'.join('%.1f %.1f' % P(*q) for q in poly) + 'Z" fill="#1a1f4a" opacity=".55"/>'
    corpo = ''.join('<path d="M' + ' L'.join('%.1f %.1f' % p for p in pts) + 'Z" fill="' + c + '" stroke="' + mix(c, '#0b0930', .45) + '" stroke-width=".35" stroke-linejoin="round"/>' for _, c, pts in quads)
    # rotulos dos eixos
    def tx(pt, s):
        x, y = P(*pt); return f'<text x="{x:.1f}" y="{y:.1f}" font-size="9" font-style="italic" font-family="Georgia,serif" fill="#aab3f0" text-anchor="middle">{s}</text>'
    fx = -bx; fy = -by
    rot = tx((0, fy * 1.32, 0), 'x' if abs(math.cos(AZ)) > .5 else 'y') + tx((fx * 1.32, 0, 0), 'y' if abs(math.cos(AZ)) > .5 else 'x') + tx((bx, by, ZT * 1.07), 'z')
    # sombra fisica: a base quadrada da caixa projetada no chao, deslocada pela luz (nao uma elipse)
    base = [P(x, y, 0) for x, y in ((-R, -R), (R, -R), (R, R), (-R, R))]
    dx, dy = 5, 4
    d = '<filter id="fsm@K@" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="3"/></filter>'
    s = '<path d="M' + ' L'.join('%.1f %.1f' % (x + dx, y + dy) for x, y in base) + 'Z" fill="#1b1d2a" opacity=".22" filter="url(#fsm@K@)"/>'
    # 30/10: grafico de software, sem chao -> sem sombra
    return SV + paredes + grade + corpo + rot + '</svg>'

# ---------------- PORTUGUES: livro aberto com volume ----------------
def por():
    d0, s = sombra(90, 122, 74, 9)
    defs = d0 + (
        '<linearGradient id="pe@K@" x1="0" x2="1"><stop offset="0" stop-color="#fff8e6"/><stop offset=".75" stop-color="#f6e2b3"/><stop offset="1" stop-color="#c99d55"/></linearGradient>'
        '<linearGradient id="pd@K@" x1="1" x2="0"><stop offset="0" stop-color="#fff3d6"/><stop offset=".75" stop-color="#f1d79f"/><stop offset="1" stop-color="#bf8f45"/></linearGradient>'
        '<linearGradient id="cp@K@" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#c97a18"/><stop offset="1" stop-color="#6e3a07"/></linearGradient>'
        '<linearGradient id="fo@K@" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#fffdf5"/><stop offset="1" stop-color="#e9cf95"/></linearGradient>'
        '<linearGradient id="fi@K@" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#e2463f"/><stop offset="1" stop-color="#9e1f1d"/></linearGradient>')
    capa = '<path d="M10 102 C38 92 66 94 90 106 C114 94 142 92 170 102 L170 110 C142 100 114 102 90 116 C66 102 38 100 10 110 Z" fill="url(#cp@K@)"/>'
    # espessura das folhas (bordas empilhadas)
    bordas = ''.join(f'<path d="M{14+i*1.2} {101-i*1.6} C40 {91-i*1.6} 66 {93-i*1.6} 90 {105-i*1.6} C114 {93-i*1.6} 140 {91-i*1.6} {166-i*1.2} {101-i*1.6}" fill="none" stroke="{mix("#d9b46e","#fff3d6",i/5)}" stroke-width="1.4"/>' for i in range(6))
    esq = '<path d="M90 96 C70 84 44 80 20 88 L20 30 C44 20 72 22 90 36 Z" fill="url(#pe@K@)"/>'
    dir_ = '<path d="M90 96 C110 84 136 80 160 88 L160 30 C136 20 108 22 90 36 Z" fill="url(#pd@K@)"/>'
    vinco = '<path d="M90 36 L90 96" stroke="#9c6b2a" stroke-width="1.3" opacity=".7"/><path d="M84 38 C86 60 86 80 84 94 L90 96 L90 36 Z" fill="#8a5a1c" opacity=".18"/><path d="M96 38 C94 60 94 80 96 94 L90 96 L90 36 Z" fill="#8a5a1c" opacity=".14"/>'
    linhas = ''.join(f'<path d="M30 {42+k*9} C48 {36+k*9} 66 {38+k*9} 80 {45+k*9}" fill="none" stroke="#a37a3c" stroke-width="1.6" stroke-linecap="round" opacity=".38"/>' for k in range(5))
    linhas += ''.join(f'<path d="M132 {38+k*10} C138 {37+k*10} 144 {37+k*10} 150 {38+k*10}" fill="none" stroke="#a37a3c" stroke-width="1.6" stroke-linecap="round" opacity=".38"/>' for k in range(5))
    # folha virando: presa ao vinco de cima a baixo, borda livre curva, sombra caindo sobre a pagina direita
    vira = ('<defs><linearGradient id="fv@K@" x1="0" x2="1"><stop offset="0" stop-color="#e9cf95"/><stop offset=".45" stop-color="#fff6df"/><stop offset="1" stop-color="#f3dfae"/></linearGradient>'
            '<linearGradient id="fs@K@" x1="0" x2="1"><stop offset="0" stop-color="#6b3f0c" stop-opacity=".0"/><stop offset=".5" stop-color="#6b3f0c" stop-opacity=".28"/><stop offset="1" stop-color="#6b3f0c" stop-opacity="0"/></linearGradient></defs>'
            '<path d="M120 22 C128 40 130 64 126 90 L144 88 C148 64 146 40 138 24 Z" fill="url(#fs@K@)"/>'
            '<path d="M90 36 C100 26 112 20 126 18 C132 38 132 64 126 86 C112 86 100 90 90 96 Z" fill="url(#fv@K@)"/>'
            '<path d="M126 18 C132 38 132 64 126 86" fill="none" stroke="#c9a463" stroke-width="1"/>'
            + ''.join(f'<path d="M{97} {44+k*9} C{105} {38+k*9} {114} {35+k*9} {123} {34+k*8.6}" fill="none" stroke="#a37a3c" stroke-width="1.3" stroke-linecap="round" opacity=".3"/>' for k in range(5)))
    fita = '<path d="M60 26 L60 58 L65 53 L70 58 L70 24 Z" fill="url(#fi@K@)"/>'
    return SV + '<defs>' + defs + '</defs>' + s + capa + bordas + esq + dir_ + vinco + linhas + fita + vira + '</svg>'

# ---------------- BIOLOGIA: celula com volume ----------------
def bio():
    d0, s = sombra(92, 124, 64, 9)
    defs = d0 + (
        '<radialGradient id="mb@K@" cx="40%" cy="30%" r="80%"><stop offset="0" stop-color="#8cf0b9"/><stop offset=".55" stop-color="#2fae6e"/><stop offset="1" stop-color="#0d5536"/></radialGradient>'
        '<radialGradient id="ct@K@" cx="50%" cy="45%" r="65%"><stop offset="0" stop-color="#2a9a63"/><stop offset=".8" stop-color="#1a7a4c"/><stop offset="1" stop-color="#0f5a37"/></radialGradient>'
        '<radialGradient id="nu@K@" cx="36%" cy="30%" r="75%"><stop offset="0" stop-color="#e6d2ff"/><stop offset=".4" stop-color="#a26cf2"/><stop offset="1" stop-color="#43188f"/></radialGradient>'
        '<radialGradient id="nl@K@" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="#7d4fd6"/><stop offset="1" stop-color="#2c0d6b"/></radialGradient>'
        '<linearGradient id="mi@K@" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#ffc56a"/><stop offset="1" stop-color="#d35a1c"/></linearGradient>'
        '<linearGradient id="go@K@" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#7fe0ff"/><stop offset="1" stop-color="#2a8fc0"/></linearGradient>')
    mem = '<path d="M92 14c36 0 66 20 66 54s-30 56-66 56S24 102 24 70 56 14 92 14z" fill="url(#mb@K@)"/>'
    cit = '<path d="M92 22c30 0 57 17 57 47s-26 47-57 47S33 98 33 70 62 22 92 22z" fill="url(#ct@K@)"/>'
    borda = '<path d="M92 22c30 0 57 17 57 47s-26 47-57 47S33 98 33 70 62 22 92 22z" fill="none" stroke="#0b4a2d" stroke-width="2" opacity=".5"/>'
    re = ''.join(f'<path d="M{58-k*4} {52+k*5} C{64-k*3} {36-k*3} {104+k*3} {32-k*4} {120+k*4} {50+k*3}" fill="none" stroke="#7be3ad" stroke-width="2.2" stroke-linecap="round" opacity="{.55-k*.12}"/>' for k in range(3))
    golgi = ''.join(f'<path d="M{50+k*3} {94-k*4} C{60+k*2} {86-k*4} {74} {86-k*4} {82-k*2} {94-k*4}" fill="none" stroke="url(#go@K@)" stroke-width="3.2" stroke-linecap="round"/>' for k in range(3))
    nuc = ('<ellipse cx="88" cy="66" rx="24" ry="20" fill="#2c0d6b" opacity=".35" transform="translate(2 3)"/>'
           '<ellipse cx="88" cy="66" rx="24" ry="20" fill="url(#nu@K@)"/>'
           '<circle cx="94" cy="70" r="7.5" fill="url(#nl@K@)"/>'
           '<ellipse cx="80" cy="57" rx="9" ry="5" fill="#fff" opacity=".35"/>'
           + ''.join(f'<circle cx="{88+23*math.cos(a):.1f}" cy="{66+19*math.sin(a):.1f}" r=".9" fill="#2c0d6b" opacity=".6"/>' for a in [i * .55 for i in range(12)]))
    def mito(cx, cy, rot, esc):
        return (f'<g transform="translate({cx} {cy}) rotate({rot}) scale({esc})"><ellipse rx="15" ry="7.5" fill="#7a2a08" opacity=".35" transform="translate(1 2)"/><ellipse rx="15" ry="7.5" fill="url(#mi@K@)"/>'
                '<path d="M-11 0c2-4 3 4 5 0s3 4 5 0 3 4 5 0 3 4 5 0" fill="none" stroke="#8a2e0a" stroke-width="1.4"/><ellipse cx="-5" cy="-3.5" rx="6" ry="1.6" fill="#fff" opacity=".35"/></g>')
    vesic = ''.join(f'<circle cx="{x}" cy="{y}" r="{r}" fill="#c8ffe1" opacity=".75"/><circle cx="{x-r*.35:.1f}" cy="{y-r*.35:.1f}" r="{r*.35:.1f}" fill="#fff" opacity=".8"/>' for x, y, r in [(122, 86, 3.2), (114, 100, 2.4), (60, 48, 2.6), (128, 60, 2), (104, 104, 1.8)])
    ribo = ''.join(f'<circle cx="{x}" cy="{y}" r="1.2" fill="#d6ffe9" opacity=".7"/>' for x, y in [(70, 80), (110, 46), (66, 62), (118, 74), (98, 96), (76, 100), (134, 72), (52, 74)])
    brilho = '<path d="M50 36c10-12 30-18 46-17" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".28"/>'
    # 30/10: celula flutuando -> sem sombra (a elipse invadia a base da membrana)
    return SV + '<defs>' + defs + '</defs>' + mem + cit + borda + re + golgi + nuc + mito(128, 78, -25, 1) + mito(112, 104, 12, .7) + vesic + ribo + brilho + '</svg>'

# ---------------- QUIMICA: molecula com profundidade ----------------
def qui():
    d0, s = sombra(92, 126, 66, 8)
    # (x, y, z, r, tipo)  z maior = mais perto
    at = [(46, 74, .2, 13, 'C'), (70, 44, .5, 12, 'C'), (104, 50, .9, 14, 'O'), (122, 84, .4, 12, 'C'), (96, 104, .7, 13, 'C'),
          (62, 104, .1, 11, 'C'), (148, 34, .2, 8, 'H'), (150, 112, .3, 8, 'H'), (30, 40, 0, 8, 'H'), (24, 98, .1, 7, 'H'), (106, 18, .6, 7, 'H')]
    lig = [(0, 1), (1, 2), (2, 3), (3, 4), (4, 5), (5, 0), (2, 6), (3, 7), (1, 8), (0, 9), (2, 10)]
    defs = d0 + (
        '<radialGradient id="aC@K@" cx="33%" cy="28%" r="78%"><stop offset="0" stop-color="#ffe1e5"/><stop offset=".22" stop-color="#ff6f80"/><stop offset=".7" stop-color="#c0182f"/><stop offset="1" stop-color="#5a0613"/></radialGradient>'
        '<radialGradient id="aO@K@" cx="33%" cy="28%" r="78%"><stop offset="0" stop-color="#ffe8ea"/><stop offset=".22" stop-color="#ff8a7a"/><stop offset=".7" stop-color="#d63a2a"/><stop offset="1" stop-color="#6b130b"/></radialGradient>'
        '<radialGradient id="aH@K@" cx="33%" cy="28%" r="78%"><stop offset="0" stop-color="#ffffff"/><stop offset=".35" stop-color="#e8e3ea"/><stop offset="1" stop-color="#8d8494"/></radialGradient>'
        '<linearGradient id="lg@K@" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#f3dde2"/><stop offset="1" stop-color="#8f7a80"/></linearGradient>')
    corpo = ''
    for a, b in sorted(lig, key=lambda l: (at[l[0]][2] + at[l[1]][2]) / 2):
        A, B = at[a], at[b]
        corpo += f'<line x1="{A[0]}" y1="{A[1]}" x2="{B[0]}" y2="{B[1]}" stroke="#5c4a50" stroke-width="7" stroke-linecap="round"/>'
        corpo += f'<line x1="{A[0]}" y1="{A[1]}" x2="{B[0]}" y2="{B[1]}" stroke="url(#lg@K@)" stroke-width="4.5" stroke-linecap="round"/>'
        corpo += f'<line x1="{A[0]}" y1="{A[1]-1.2}" x2="{B[0]}" y2="{B[1]-1.2}" stroke="#fff" stroke-width="1.2" stroke-linecap="round" opacity=".45"/>'
    for x, y, z, r, tp in sorted(at, key=lambda a: a[2]):
        corpo += f'<circle cx="{x+1.5}" cy="{y+2.5}" r="{r}" fill="#2a0208" opacity=".35"/>'
        corpo += f'<circle cx="{x}" cy="{y}" r="{r}" fill="url(#a{tp}@K@)"/>'
        corpo += f'<ellipse cx="{x-r*.36:.1f}" cy="{y-r*.42:.1f}" rx="{r*.3:.1f}" ry="{r*.18:.1f}" fill="#fff" opacity=".7" transform="rotate(-25 {x-r*.36:.1f} {y-r*.42:.1f})"/>'
    return SV + '<defs>' + defs + '</defs>' + corpo + '</svg>'

import gera_ilu3d as g3   # qui e por: geometria real (29/10); bio: a celula, aprovada pelo dono
out = {'bio': bio(), 'qui': g3.qui(), 'mat': mat(), 'por': g3.por()}
# sombra suave (referencia do dono 30/10): luz de cima-esquerda, elipse difusa sob o objeto, um pouco a direita.
# caixas medidas no render (viewBox 180x140): x0, x1, y1 (base) e folga extra para objeto solto (molecula)
import re as _re
_CX = {'bio': (24.0, 157.75, 123.75, 0), 'qui': (22.75, 150.25, 112.5, 4), 'mat': (27.75, 152.0, 122.25, 0)}
for _k, (_x0, _x1, _y1, _gap) in _CX.items():
    _w = _x1 - _x0; _rx = .42 * _w; _ry = max(5, .065 * _w); _cx = (_x0 + _x1) / 2 + .05 * _w; _cy = min(_y1 + _gap, 139 - _ry * .8)
    _g = '<radialGradient id="ss@K@"><stop offset="0" stop-color="#22242f"/><stop offset=".55" stop-color="#22242f" stop-opacity=".45"/><stop offset="1" stop-color="#22242f" stop-opacity="0"/></radialGradient>'
    _e = '<defs>%s</defs><ellipse cx="%.1f" cy="%.1f" rx="%.1f" ry="%.1f" fill="url(#ss@K@)" opacity="0.30"/>' % (_g, _cx, _cy, _rx, _ry)
    _h = _re.match(r'<svg[^>]*>', out[_k]).group(0); out[_k] = _h + _e + out[_k][len(_h):]
out['por'] = out['por'].replace('<feGaussianBlur stdDeviation="1.2"/>', '<feGaussianBlur stdDeviation="3.2"/>', 1)
# 30/10: ilustracoes no estilo da referencia do dono (render/recorte em WebP) sobrepoem as desenhadas aqui
if os.path.exists('ilu_ref.json'): out.update(json.load(open('ilu_ref.json')))
json.dump(out, open('ilu.json', 'w'), ensure_ascii=False)
print({k: len(v) for k, v in out.items()})

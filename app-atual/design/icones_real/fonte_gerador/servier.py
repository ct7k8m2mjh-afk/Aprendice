# -*- coding: utf-8 -*-
"""Leitura dos SVG da Servier Medical Art (via bioicons) e composicao em coordenadas de tela."""
import re, os
BIO = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'orig_servier', 'static', 'icons') + '/'   # copia dos originais usados (bioicons, CC BY 3.0)
_N = [0]

def arq(rel):
    return os.path.join(BIO, rel)

def carrega(rel, manter=None, tirar=None, recolor=None):
    """devolve (miolo, (vx, vy, vw, vh)); manter/tirar: indices dos <path>/<g> de 1o nivel"""
    s = open(arq(rel), encoding='utf8').read()
    vb = [float(v) for v in re.search(r'viewBox="([^"]+)"', s).group(1).replace(',', ' ').split()]
    miolo = re.sub(r'^.*?<svg[^>]*>', '', s, flags=re.S); miolo = re.sub(r'</svg>\s*$', '', miolo)
    defs = ''.join(re.findall(r'<defs>.*?</defs>', miolo, flags=re.S)); corpo = re.sub(r'<defs>.*?</defs>', '', miolo, flags=re.S)
    if manter is not None or tirar is not None:
        els = re.findall(r'<path[^>]*/>|<path[^>]*>.*?</path>|<g[^>]*>.*?</g>|<ellipse[^>]*/>|<circle[^>]*/>|<rect[^>]*/>|<polygon[^>]*/>', corpo, flags=re.S)
        if manter is not None: els = [e for i, e in enumerate(els) if i in manter]
        if tirar is not None: els = [e for i, e in enumerate(els) if i not in tirar]
        corpo = ''.join(els)
    miolo = defs + corpo
    if recolor:
        for a, b in recolor.items(): miolo = re.sub(re.escape(a), b, miolo, flags=re.I)
    _N[0] += 1; k = f's{_N[0]}_'
    ids = set(re.findall(r'id="([^"]+)"', miolo))
    for i in sorted(ids, key=len, reverse=True):
        miolo = miolo.replace(f'id="{i}"', f'id="{k}{i}"').replace(f'url(#{i})', f'url(#{k}{i})').replace(f'href="#{i}"', f'href="#{k}{i}"')
    return miolo, vb

def coloca(rel, x, y, alt=None, larg=None, rot=0, espelha=False, **kw):
    """coloca o desenho com o canto superior esquerdo do viewBox em (x, y), escalado para a altura/largura pedida"""
    miolo, (vx, vy, vw, vh) = carrega(rel, **kw)
    k = (alt / vh) if alt else (larg / vw)
    w, h = vw * k, vh * k
    t = f'translate({x:.2f} {y:.2f})'
    if rot: t += f' rotate({rot} {w/2:.2f} {h/2:.2f})'
    if espelha: t += f' translate({w:.2f} 0) scale(-1 1)'
    t += f' scale({k:.5f}) translate({-vx:.2f} {-vy:.2f})'
    return f'<g transform="{t}">{miolo}</g>', (x, y, w, h)

def sombra_chao(cx, cy, rx, ry, op=.24, blur=3.2, fid='sc'):
    return (f'<filter id="{fid}" x="-50%" y="-80%" width="200%" height="260%"><feGaussianBlur stdDeviation="{blur}"/></filter>'
            f'<ellipse cx="{cx:.1f}" cy="{cy:.1f}" rx="{rx:.1f}" ry="{ry:.1f}" fill="#1b1d2a" opacity="{op}" filter="url(#{fid})"/>')

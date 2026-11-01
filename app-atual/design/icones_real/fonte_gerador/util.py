# -*- coding: utf-8 -*-
import math, os
import numpy as np
from motor import *

AQUI = os.path.dirname(os.path.abspath(__file__))
BRUTO = os.path.join(AQUI, 'bruto'); os.makedirs(BRUTO, exist_ok=True)

def grava(id_, corpo, ocupa=.85):
    s = (f'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 200 200" width="400" height="400" data-ocupa="{ocupa}">'
         f'<g id="raiz">{corpo}</g></svg>')
    open(os.path.join(BRUTO, id_ + '.svg'), 'w').write(s)

def rot_z(a):
    c, s = math.cos(a), math.sin(a)
    return lambda x, y, z: (x * c - y * s, x * s + y * c, z)

def transf(yaw=0.0, t=(0, 0, 0), pitch=0.0, roll=0.0):
    """local -> mundo: roll (eixo x), pitch (eixo y), yaw (eixo z), depois translada"""
    def M(x, y, z):
        if roll:
            c, s = math.cos(roll), math.sin(roll); y, z = y * c - z * s, y * s + z * c
        if pitch:
            c, s = math.cos(pitch), math.sin(pitch); x, z = x * c + z * s, -x * s + z * c
        if yaw:
            c, s = math.cos(yaw), math.sin(yaw); x, y = x * c - y * s, x * s + y * c
        return (x + t[0], y + t[1], z + t[2])
    return M

def visivel(cam, n):
    return cam.V(*n)[2] < 0

def circ3(c, u, v, r, n=28):
    """circulo 3D: centro c, eixos u, v (unitarios), raio r"""
    c, u, v = map(np.asarray, (c, u, v))
    return [tuple(c + r * (math.cos(2 * math.pi * i / n) * u + math.sin(2 * math.pi * i / n) * v)) for i in range(n)]

def lin(cam, p, q, cor, w, op=1, cap='round'):
    (x1, y1), (x2, y2) = cam.P(*p), cam.P(*q)
    o = f' opacity="{op}"' if op != 1 else ''
    return f'<line x1="{fmt(x1)}" y1="{fmt(y1)}" x2="{fmt(x2)}" y2="{fmt(y2)}" stroke="{cor}" stroke-width="{fmt(w)}" stroke-linecap="{cap}"{o}/>'

def poli(cam, pts, fill, extra=''):
    return f'<path d="{caminho([cam.P(*p) for p in pts])}" fill="{fill}"{extra}/>'

def tubo(cam, pts, raio_px, cor, fechado=False, luz_lado=True):
    """tubo (fio, elo de corrente, curva de grafico) amostrado em segmentos; devolve [(prof, svg)].
    cada segmento: contorno escuro, corpo, reflexo deslocado para o lado da luz"""
    out = []
    P = list(pts) + ([pts[0]] if fechado else [])
    for i in range(len(P) - 1):
        a, b = P[i], P[i + 1]
        m = tuple((a[k] + b[k]) / 2 for k in range(3))
        d = np.array(b) - np.array(a); d = d / (np.linalg.norm(d) or 1)
        # quanto o segmento "encara" a luz: componente da luz perpendicular ao tubo
        Lp = np.array(G.LUZ) * -1; Lp = Lp / np.linalg.norm(Lp); perp = Lp - (Lp @ d) * d
        l = .45 + .55 * min(1, np.linalg.norm(perp))
        s = (lin(cam, a, b, mix(cor, '#000000', .55), raio_px * 2) + lin(cam, a, b, mix(mix(cor, '#000000', .3), cor, l), raio_px * 1.55)
             + lin(cam, a, b, mix(cor, '#ffffff', .55), raio_px * .45, op=.85))
        out.append((cam.D(*m), s))
    return out

def sombra_eliptica(cx, cy, rx, ry, op=.22, blur=3, id_='se'):
    return (f'<filter id="{id_}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="{blur}"/></filter>'
            f'<ellipse cx="{fmt(cx)}" cy="{fmt(cy)}" rx="{fmt(rx)}" ry="{fmt(ry)}" fill="#1b1d2a" opacity="{op}" filter="url(#{id_})"/>')

def grad_lin(id_, paradas, x1=0, y1=0, x2=0, y2=1, units=''):
    u = f' gradientUnits="{units}"' if units else ''
    return f'<linearGradient id="{id_}" x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}"{u}>' + ''.join(
        f'<stop offset="{o}" stop-color="{c}"' + (f' stop-opacity="{a}"' if a != 1 else '') + '/>' for o, c, a in [(p + (1,))[:3] for p in paradas]) + '</linearGradient>'

def grad_rad(id_, paradas, cx=.5, cy=.5, r=.5, fx=None, fy=None, extra=''):
    f = (f' fx="{fx}" fy="{fy}"' if fx is not None else '')
    return f'<radialGradient id="{id_}" cx="{cx}" cy="{cy}" r="{r}"{f}{extra}>' + ''.join(
        f'<stop offset="{o}" stop-color="{c}"' + (f' stop-opacity="{a}"' if a != 1 else '') + '/>' for o, c, a in [(p + (1,))[:3] for p in paradas]) + '</radialGradient>'

def tubo_liso(cam, pts, raio_px, cor, fechado=False):
    """tubo continuo (curvas planas sem auto-ocultacao): contorno, corpo e reflexo como polylines"""
    P = [cam.P(*p) for p in pts]
    if fechado: P = P + [P[0], P[1]]
    s = ' '.join(fmt(x) + ',' + fmt(y) for x, y in P)
    # reflexo deslocado para o lado da luz (cima-esquerda na tela)
    off = raio_px * .35
    s2 = ' '.join(fmt(x - off * .5) + ',' + fmt(y - off) for x, y in P)
    tag = 'polyline'
    return (f'<{tag} points="{s}" fill="none" stroke="{mix(cor, "#000000", .5)}" stroke-width="{fmt(raio_px*2)}" stroke-linecap="round" stroke-linejoin="round"/>'
            f'<{tag} points="{s}" fill="none" stroke="{cor}" stroke-width="{fmt(raio_px*1.5)}" stroke-linecap="round" stroke-linejoin="round"/>'
            f'<{tag} points="{s2}" fill="none" stroke="{mix(cor, "#ffffff", .6)}" stroke-width="{fmt(raio_px*.45)}" stroke-linecap="round" stroke-linejoin="round" opacity=".8"/>')

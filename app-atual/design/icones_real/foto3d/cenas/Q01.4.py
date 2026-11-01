import sys, os, math, random; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _qui import *
from mathutils import Euler
# Tabela periodica em pecas 3D: 18 grupos, 7 periodos e a serie f separada; cor por bloco (s vermelho, p amarelo, d azul, f verde)
cena_q()
ms = plastico('#d62828', 0.3); mp = plastico('#f2b705', 0.3); md = plastico('#1a4cc4', 0.3); mf = plastico('#2e9e44', 0.3)
cel = []
for per in range(1, 8):
    for g in range(1, 19):
        if per == 1 and g not in (1, 18): continue
        if per in (2, 3) and 3 <= g <= 12: continue
        if g in (1, 2) or (per == 1 and g == 18): m = ms
        elif g >= 13: m = mp
        else: m = md
        cel.append((g, per, m))
for linha in (8.5, 9.5):
    for k in range(14): cel.append((3.5 + k, linha, mf))
objs = []
for (g, per, m) in cel:
    objs.append(caixa((g * 0.5, 0, -per * 0.5), (0.44, 0.26, 0.44), m, chanfro=0.06))
grupo(objs, loc=(-4.75, 0, 4.45), rot=(-28, 0, 0))
render(out('Q01.4'), elev=26, azim=-14)

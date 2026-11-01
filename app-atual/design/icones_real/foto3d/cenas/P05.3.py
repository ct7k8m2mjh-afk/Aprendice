# P05.3 sinonimia, antonimia e campo semantico: lapis de cor lado a lado (tons vizinhos, tons opostos, um so campo)
from _por import *
cena_p()
cores = ['#d62828', '#f27a1a', '#f2b705', '#2e9e44', '#1f5fd6', '#7b2cbf']
mad = madeira('#e8c28f', '#c99a62', 20)
for i, c in enumerate(cores):
    ob = []
    ob.append(cilindro((0, 0, 0), 0.085, 1.6, plastico(c, 0.35), vert=6, chanfro=0.008, rot=(0, math.radians(90), 0)))
    ob.append(cone((0.8 + 0.12, 0, 0), 0.08, 0.025, 0.24, mad, rot=(0, math.radians(90), 0)))
    ob.append(cone((0.8 + 0.27, 0, 0), 0.026, 0.0, 0.07, plastico(c, 0.3), rot=(0, math.radians(90), 0)))
    ob.append(cilindro((-0.8, 0, 0), 0.075, 0.004, plastico(c, 0.4), rot=(0, math.radians(90), 0), chanfro=0))
    grupo(ob, loc=(i * 0.07 - (i % 2) * 0.12, i * 0.19, 0.085), rot=(math.radians(30 if i % 2 else 0), 0, math.radians(i * 3 - 8)))
render(saida('P05.3'), elev=40, azim=-24)

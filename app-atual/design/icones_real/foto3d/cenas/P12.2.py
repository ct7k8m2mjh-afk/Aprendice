# P12.2 Modernismo de 1922 e vanguardas: paleta de pintor com tintas de cores vivas e pincel (a Semana de Arte Moderna)
from _por import *
cena_p()
pol = []
for i in range(80):
    a = 2 * math.pi * i / 80; r = 1.0 + 0.08 * math.cos(2 * a)
    pol.append((1.15 * r * math.cos(a), 0.85 * r * math.sin(a)))
pol = [p for p in pol if not ((p[0] > 0.75) and abs(p[1]) < 0.25)] 
pl = placa(pol, 0.06, madeira('#c99459', '#a26d36', 7), chanfro=0.025)
furo = cilindro((0.55, -0.3, 0.03), 0.13, 0.3, None); boolean(pl, furo)
cores = ['#d62828', '#f2b705', '#1f5fd6', '#2e9e44', '#7b2cbf', '#f27a1a', '#ffffff']
for i, c in enumerate(cores):
    a = math.radians(110 + i * 28); x, y = 0.78 * math.cos(a), 0.6 * math.sin(a)
    t = esfera((x, y, 0.07), 0.13, plastico(c, 0.15)); t.scale = (1, 1, 0.45)
    t2 = esfera((x + 0.04, y + 0.03, 0.11), 0.07, plastico(c, 0.15)); t2.scale = (1, 1, 0.5)
pb = []
pb.append(cilindro((0, 0, 0), 0.035, 1.2, madeira('#d62828', '#a01818', 30), rot=(0, math.radians(90), 0)))
pb.append(cilindro((0.66, 0, 0), 0.04, 0.16, metal('#c7cbd1', 0.2), rot=(0, math.radians(90), 0)))
pb.append(cone((0.82, 0, 0), 0.042, 0.005, 0.2, plastico('#1f5fd6', 0.5), rot=(0, math.radians(90), 0)))
grupo(pb, loc=(-0.1, -0.15, 0.14), rot=(0, math.radians(-4), math.radians(25)))
render(saida('P12.2'), elev=44, azim=-10)

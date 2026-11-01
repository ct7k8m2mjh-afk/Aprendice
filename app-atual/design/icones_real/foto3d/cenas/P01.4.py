# P01.4 finalidade e interlocutor: alvo de arco e flecha com a flecha cravada no centro
from _por import *
cena_p()
cores = ['#f7f4ec', '#f7f4ec', '#1d1d22', '#1d1d22', '#1f5fd6', '#1f5fd6', '#d62828', '#d62828', '#f2b705', '#f2b705']
alvo = []
R = 0.8
for i, c in enumerate(cores):
    r = R * (10 - i) / 10
    alvo.append(cilindro((0, 0, 0.12 + i * 0.0025), r, 0.24 if i == 0 else 0.004, plastico(c, 0.45) if i else fosco('#ece6d6', 0.8), chanfro=0.02 if i == 0 else 0.0))
alvo[0].location.z = 0
for i in range(1, 10): alvo[i].location.z = 0.12 + i * 0.0015
# flecha cravada no centro, saindo em diagonal
fl = []
fl.append(cilindro((0, 0, 0.55), 0.022, 1.0, madeira('#c08a4f', '#8a5a2b', 14)))
fl.append(cilindro((0, 0, 1.0), 0.03, 0.06, plastico('#d62828', 0.4)))
for a in (0, 120, 240):
    p = placa([(0, 0), (0.13, 0.02), (0.13, 0.22), (0, 0.28)], 0.006, plastico('#d62828', 0.45), chanfro=0.002)
    p.location = (0, 0, 0.75); p.rotation_euler = (math.radians(90), 0, math.radians(a))
    fl.append(p)
g = grupo(fl, loc=(0, 0, 0.13), rot=(math.radians(-38), math.radians(28), 0))
grupo(alvo + [g], loc=(0, 0, 0.86), rot=(math.radians(72), 0, math.radians(-10)))
# cavalete
mad = madeira('#9a6334', '#6b3d1a', 10)
bastao((-0.5, 0.55, 0), (-0.32, 0.32, 1.5), 0.035, mad)
bastao((0.5, 0.55, 0), (0.32, 0.32, 1.5), 0.035, mad)
bastao((0, 1.1, 0), (0, 0.36, 1.45), 0.035, mad)
render(saida('P01.4'), elev=22, azim=-20)

from _mat import *
cena()
# muro de fracoes: 1 | 1/2 1/2 | 1/3 x3 | 1/4 x4 , todas as linhas com o mesmo comprimento total
L = 2.4; prof = 0.34; alt = 0.2; gap = 0.018
cores = [VERM, LARANJA, AMAR, VERDE]; rot = ['1', '1/2', '1/3', '1/4']
branco = plastico('#ffffff', 0.4); objs = []
for r, n in enumerate([1, 2, 3, 4]):
    y = (1.5 - r) * (prof + 0.04); w = L / n
    for k in range(n):
        x = -L / 2 + w * (k + 0.5)
        objs.append(caixa((x, y, alt / 2), (w - gap, prof, alt), plastico(cores[r], 0.28), chanfro=0.03))
        objs.append(decal(rot[r], (x, y, alt + 0.002), 0.15 if n > 1 else 0.13))
grupo(objs, rot=(0, 0, R(-24)))
fim('M01.1', elev=42, azim=-10)

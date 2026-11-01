from _mat import *
cena()
# triangulo de sinuca (equilatero) com as 15 bolas arrumadas
cores = {1: '#f2b705', 2: '#1f5fd6', 3: '#d62828', 4: '#6a2c91', 5: '#f07c1e', 6: '#1e8a3e', 7: '#7a1f1f', 8: '#151515'}
ordem = [1, 9, 2, 10, 8, 3, 11, 7, 14, 4, 5, 13, 15, 6, 12]
r = 0.2; d = 2 * r + 0.004; k = 0
pos = []
for lin in range(5):
    for j in range(lin + 1):
        x = (j - lin / 2) * d; y = lin * d * math.sqrt(3) / 2
        pos.append((x, y))
yc = sum(p[1] for p in pos) / 15
branco = plastico('#f7f5ee', 0.12)
for (x, y), n in zip(pos, ordem):
    c = cores[n if n <= 8 else n - 8]; y = y - yc
    if n <= 8: o = esfera((x, y, r), r, plastico(c, 0.1))
    else:
        o = esfera((x, y, r), r, branco)
        cilindro((x, y, r), r * 1.002, r * 0.95, plastico(c, 0.1), rot=(R(90), 0, R(30)), chanfro=0)
    v = mathutils.Vector((-0.25, -0.55, 0.8)).normalized()
    dk = cilindro((0, 0, 0), r * 0.36, 0.012, branco, chanfro=0.004); dk.location = mathutils.Vector((x, y, r)) + v * (r * 0.97); dk.rotation_euler = v.to_track_quat('Z', 'Y').to_euler()
# triangulo de madeira em volta
L = 4 * d + 2 * r + 0.42; h = L * math.sqrt(3) / 2
v = [(-L / 2, -h / 3), (L / 2, -h / 3), (0, 2 * h / 3)]
out = [(x * 1.0, y * 1.0) for x, y in v]; inn = [(x * 0.84, y * 0.84) for x, y in v]
mad = madeira('#7a4422', escala=10)
for i in range(3):
    a, b = out[i], out[(i + 1) % 3]; c_, d_ = inn[(i + 1) % 3], inn[i]
    prisma([a, b, c_, d_], 0, 0.22, mad, chanfro=0.02)
fim('M08.1', elev=46, azim=-10)

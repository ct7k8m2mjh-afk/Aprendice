from _mat import *
cena()
# cadeado de segredo com 3 rodas de 0 a 9: 10 x 10 x 10 = 1000 senhas (principio multiplicativo)
lat = metal('#d4a52a', 0.22); aco = metal('#d3d6dc', 0.15); pr = plastico('#2a2a2a', 0.35)
caixa((0, 0, 0.55), (1.2, 0.5, 1.0), lat, chanfro=0.08)
# arco (shackle)
pts = [(-0.32, 0, 1.0)] + [(-0.32 * math.cos(t), 0, 1.45 + 0.32 * math.sin(t)) for t in [k * math.pi / 30 for k in range(31)]] + [(0.32, 0, 1.05)]
pts = [(-0.32, 0, 1.02), (-0.32, 0, 1.45)] + [(-0.32 * math.cos(t), 0, 1.45 + 0.32 * math.sin(t)) for t in [k * math.pi / 30 for k in range(1, 30)]] + [(0.32, 0, 1.45), (0.32, 0, 1.02)]
curva_tubo(pts, 0.07, aco)
caixa((0, -0.26, 0.5), (0.95, 0.06, 0.42), pr, chanfro=0.02)
for k, dig in enumerate(['3', '0', '7']):
    x = -0.3 + k * 0.3
    cilindro((x, -0.2, 0.5), 0.2, 0.24, plastico('#1c1c1c', 0.3), rot=(0, R(90), 0), chanfro=0.02, vert=10)
    decal(dig, (x, -0.405, 0.5), 0.16, rot=(R(90), 0, 0), nome='M13.1_%d' % k)
    for dz in (-0.17, 0.17):
        decal(str((int(dig) + (1 if dz < 0 else 9)) % 10), (x, -0.36, 0.5 + dz * 0.93), 0.1, cor_txt=(170, 170, 170, 255), rot=(R(90 - math.degrees(math.atan2(dz, 0.2)) * 0.9), 0, 0), nome='M13.1_%d%s' % (k, 'a' if dz < 0 else 'b'))
fim('M13.1', elev=18, azim=-16)

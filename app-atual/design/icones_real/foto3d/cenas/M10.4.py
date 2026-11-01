from _mat import *
cena()
# roda-gigante: cada cabine percorre o circulo e a altura dela varia com o seno do angulo de giro
br = plastico('#f2f2f2', 0.3); az = plastico(AZUL, 0.3); Rr = 1.0; zc = 1.25
cores = [AMAR, VERDE, AZUL, ROXO, LARANJA, AMAR, VERDE, AZUL]
for y in (-0.15, 0.15):
    toro((0, y, zc), Rr, 0.045, plastico(VERM, 0.25), rot=(R(90), 0, 0))
    for k in range(8):
        a = k * math.pi / 4; bastao((0, y, zc), (Rr * math.cos(a), y, zc + Rr * math.sin(a)), 0.022, br)
cilindro((0, 0, zc), 0.08, 0.5, metal('#c8ccd2', 0.25), rot=(R(90), 0, 0))
for k in range(8):
    a = k * math.pi / 4 + 0.2; x, z = Rr * math.cos(a), zc + Rr * math.sin(a)
    bastao((x, -0.15, z), (x, 0.15, z), 0.012, br)
    caixa((x, 0, z - 0.2), (0.27, 0.3, 0.26), plastico(cores[k], 0.25), chanfro=0.06)
    bastao((x, 0, z), (x, 0, z - 0.08), 0.014, br)
for y in (-0.32, 0.32):
    bastao((-0.7, y, 0.05), (0, y * 0.6, zc), 0.045, az); bastao((0.7, y, 0.05), (0, y * 0.6, zc), 0.045, az)
caixa((0, 0, 0.04), (2.0, 0.9, 0.08), plastico('#3a3a3a', 0.4), chanfro=0.02)
fim('M10.4', elev=12, azim=-24)

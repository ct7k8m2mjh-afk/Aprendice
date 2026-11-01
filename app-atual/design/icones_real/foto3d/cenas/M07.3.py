from _mat import *
cena()
# piramide de latas 4 + 3 + 2 + 1 = 10: soma dos termos de uma PA
alu = metal('#d5d8dd', 0.2); rot = [VERM, AMAR, AZUL, VERDE]
r = 0.22; h = 0.56
for lin, n in enumerate([4, 3, 2, 1]):
    for k in range(n):
        x = (k - (n - 1) / 2) * (2 * r + 0.02); z = lin * (h + 0.012)
        cilindro((x, 0, z + h / 2), r * 0.995, h * 0.8, plastico(rot[lin], 0.25), chanfro=0.0)
        cilindro((x, 0, z + 0.05), r * 0.93, 0.1, alu, chanfro=0.02)
        cilindro((x, 0, z + h - 0.05), r * 0.93, 0.1, alu, chanfro=0.02)
        toro((x, 0, z + h - 0.003), r * 0.88, 0.014, alu)
        caixa((x, -r * 0.99, z + h / 2), (r * 0.9, 0.01, 0.07), plastico('#ffffff', 0.3), chanfro=0)
fim('M07.3', elev=14, azim=-14)

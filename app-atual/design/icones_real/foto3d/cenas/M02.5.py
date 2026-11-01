from _mat import *
cena()
# o mesmo liquido dividido em 1 : 2 : 3 em tres provetas iguais
vid = vidro(); liq = liquido('#7b2cbf'); pe = plastico(AZUL, 0.3); tinta = fosco('#333333', 0.6)
H = 1.5; r = 0.17; nivel = [0.3, 0.6, 0.9]
for k, x in enumerate([-0.5, 0.0, 0.5]):
    y = [0.15, 0.0, -0.15][k]
    cilindro((x, y, 0.04), 0.27, 0.08, pe, vert=6, chanfro=0.02)
    copo((x, y, 0.08), r, H, vid, esp=0.018)
    cilindro((x, y, 0.08 + 0.018 + nivel[k] / 2), r - 0.02, nivel[k], liq, chanfro=0.01)
    for j in range(1, 10):
        z = 0.08 + j * 0.15
        w = 0.1 if j % 2 == 0 else 0.06
        caixa((x - 0.04, y - r - 0.002, z), (w, 0.004, 0.012), tinta, chanfro=0)
fim('M02.5', elev=24, azim=-10)

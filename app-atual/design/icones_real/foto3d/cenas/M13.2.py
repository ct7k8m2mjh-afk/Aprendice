from _mat import *
cena()
# podio de 1.o, 2.o e 3.o lugar com tres pecas: a ordem importa (arranjos)
br = plastico('#f4f4f2', 0.3)
for x, h, n, c in ((0, 0.9, '1', '#d4a52a'), (-0.62, 0.6, '2', '#b9bec6'), (0.62, 0.4, '3', '#c07a3a')):
    caixa((x, 0, h / 2), (0.6, 0.6, h), br, chanfro=0.03)
    decal(n, (x, -0.302, h / 2), 0.26, cor_txt=(31, 95, 214, 255), rot=(R(90), 0, 0), nome='M13.2_' + n)
    m = metal(c, 0.2)
    cilindro((x, 0, h + 0.05), 0.17, 0.1, m, chanfro=0.03)
    cone((x, 0, h + 0.28), 0.12, 0.06, 0.36, m)
    esfera((x, 0, h + 0.55), 0.12, m)
fim('M13.2', elev=18, azim=-14)

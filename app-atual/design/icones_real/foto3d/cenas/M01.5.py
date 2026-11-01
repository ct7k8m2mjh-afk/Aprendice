from _mat import *
cena()
# bandejas encaixadas R > Q > Z > N (cada conjunto numerico contem o seguinte)
cores = [AZUL, VERDE, AMAR, VERM]; letras = ['R', 'Q', 'Z', 'N']  # notacao em negrito (equivale a ℝ, ℚ, ℤ, ℕ), legivel em tamanho pequeno
branco = plastico('#ffffff', 0.4)
L0 = 2.4; e = 0.05; hw = 0.3; dz = 0.0
for k in range(4):
    L = L0 - k * 0.6; m = plastico(cores[k], 0.3)
    z = k * (e + 0.0)
    cx = cy = k * 0.0
    caixa((0, 0, z + e / 2), (L, L, e), m, chanfro=0.02)
    for sx, sy, w, d in ((0, L / 2 - e / 2, L, e), (0, -L / 2 + e / 2, L, e), (L / 2 - e / 2, 0, e, L), (-L / 2 + e / 2, 0, e, L)):
        caixa((sx, sy, z + hw / 2), (w, d, hw), m, chanfro=0.018)
    # letra no canto da frente-esquerda do piso visivel
    if k < 3:
        p = -L / 2 + 0.13 + e
    else:
        p = -0.0
    if True:
        decal(letras[k], (-L / 2 + 0.22 if k < 3 else 0, -L / 2 - 0.002, z + hw / 2 + 0.01), 0.19, rot=(R(90), 0, 0), fonte_p='/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf', nome='M01.5_%d' % k)
    else:
        decal(letras[k], (0, 0, z + e + 0.002), 0.4, fonte_p='/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf', nome='M01.5_%d' % k)
fim('M01.5', elev=40, azim=-18)

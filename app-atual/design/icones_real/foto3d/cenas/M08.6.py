from _mat import *
cena()
# areas basicas: piso de ladrilhos quadrados (4 x 3) assentado sobre uma base, com uma trena amarela aberta medindo o lado
a = 0.42; g = 0.018
base = caixa((0, 0, 0.03), (4 * a + 0.08, 3 * a + 0.08, 0.06), fosco('#8f98a6', 0.6), chanfro=0.02)
cores = ['#1f5fd6', '#dfe4ec']
for i in range(4):
    for j in range(3):
        x = (i - 1.5) * a; y = (j - 1) * a
        caixa((x, y, 0.075), (a - g, a - g, 0.03), plastico(cores[(i + j) % 2], 0.18), chanfro=0.008)
# trena: caixa amarela arredondada + fita metalica estendida ao longo da borda da frente
cx, cy = 2 * a + 0.32, -1.5 * a - 0.12
caixa((cx, cy, 0.14), (0.46, 0.22, 0.38), plastico('#f2b705', 0.3), chanfro=0.06)
cilindro((cx - 0.02, cy - 0.115, 0.19), 0.1, 0.02, metal('#c9ccd2', 0.3), rot=(R(90), 0, 0))
L = 4 * a + 0.28
fita = caixa((cx - 0.23 - L / 2, cy, 0.012), (L, 0.12, 0.008), plastico('#f6d94a', 0.35), chanfro=0.002)
# marcas da trena (riscos pretos a cada 1/10 do lado)
for k in range(0, 41):
    x = cx - 0.23 - k * (a / 10)
    if x < cx - 0.23 - L: break
    h = 0.08 if k % 10 == 0 else (0.05 if k % 5 == 0 else 0.03)
    caixa((x, cy - 0.06 + h / 2, 0.0155), (0.006, h, 0.002), fosco('#1a1a1a', 0.6), chanfro=0)
caixa((cx - 0.23 - L, cy, 0.03), (0.02, 0.09, 0.04), metal('#c9ccd2', 0.3), chanfro=0.004)
fim('M08.6', elev=40, azim=-24)

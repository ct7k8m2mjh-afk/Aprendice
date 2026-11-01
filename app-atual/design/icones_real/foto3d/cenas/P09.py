# P09 Periodo composto: trem de madeira com locomotiva e vagoes engatados (oracoes encadeadas)
from _por import *
cena_p()
pr = plastico('#1c1c22', 0.35)
def rodas(x0, x1):
    for x in (x0, x1):
        for y in (-0.27, 0.27):
            cilindro((x, y, 0.15), 0.15, 0.08, pr, rot=(math.radians(90), 0, 0), chanfro=0.02)
            cilindro((x, y * 1.16, 0.15), 0.05, 0.02, metal('#c7cbd1', 0.2), rot=(math.radians(90), 0, 0))
# locomotiva (vermelha)
ve = plastico('#d62828', 0.3); am = plastico('#f2b705', 0.3); az = plastico('#1f5fd6', 0.3); vd = plastico('#2e9e44', 0.3)
caixa((0.0, 0, 0.32), (1.2, 0.5, 0.2), am, chanfro=0.03)
caixa((-0.32, 0, 0.72), (0.5, 0.5, 0.62), ve, chanfro=0.04)
caixa((-0.32, 0, 1.06), (0.62, 0.6, 0.08), am, chanfro=0.03)
cilindro((0.22, 0, 0.6), 0.22, 0.6, ve, rot=(0, math.radians(90), 0), chanfro=0.03)
cilindro((0.36, 0, 0.92), 0.08, 0.3, pr, chanfro=0.02)
cilindro((0.36, 0, 1.08), 0.12, 0.06, pr, chanfro=0.02)
for y in (-0.251, 0.251): caixa((-0.32, y, 0.82), (0.24, 0.01, 0.22), plastico('#9fd3ff', 0.1), chanfro=0)
rodas(-0.35, 0.3)
# vagoes
for k, (c, x) in enumerate(((az, -1.55), (vd, -2.75))):
    caixa((x, 0, 0.32), (1.0, 0.5, 0.2), am, chanfro=0.03)
    caixa((x, 0, 0.6), (0.94, 0.5, 0.36), c, chanfro=0.03)
    rodas(x - 0.3, x + 0.3)
    cilindro((x + 0.6, 0, 0.32), 0.035, 0.24, metal('#c7cbd1', 0.2), rot=(0, math.radians(90), 0))
    # carga: blocos
    if k == 0:
        for i, cc in enumerate(('#f2b705', '#d62828', '#2e9e44')): caixa((x - 0.28 + i * 0.28, 0, 0.86), (0.22, 0.22, 0.22), plastico(cc, 0.3), chanfro=0.03)
    else:
        for i in range(3): cilindro((x - 0.28 + i * 0.28, 0, 0.9), 0.1, 0.3, madeira('#c08a4f', '#8a5a2b', 14), chanfro=0.02)
render(saida('P09'), elev=26, azim=-26)

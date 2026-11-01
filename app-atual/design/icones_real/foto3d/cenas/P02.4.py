# P02.4 contra-argumento e refutacao: balanca de dois pratos em latao, pesando um argumento contra o outro
from _por import *
cena_p()
ou = metal('#d4a52a', 0.2)
base = torno([(0, 0), (0.55, 0), (0.56, 0.05), (0.5, 0.12), (0.3, 0.16), (0.1, 0.2), (0, 0.2)], madeira('#5a2f16', '#3a1c0a', 8))
torno([(0, 0.18), (0.12, 0.18), (0.06, 0.25), (0.045, 1.5), (0.07, 1.55), (0.0, 1.62)], ou)
esfera((0, 0, 1.68), 0.07, ou)
cilindro((0, 0, 1.52), 0.035, 1.9, ou, rot=(0, math.radians(90), 0))
for s in (-1, 1):
    esfera((s * 0.95, 0, 1.52), 0.05, ou)
    for a in (90, 210, 330):
        x = s * 0.95 + 0.33 * math.cos(math.radians(a)); y = 0.33 * math.sin(math.radians(a))
        bastao((s * 0.95, 0, 1.5), (x, y, 0.72), 0.008, ou)
    torno([(0, 0.0), (0.2, 0.0), (0.34, 0.08), (0.36, 0.1), (0.0, 0.1)], ou, loc=(s * 0.95, 0, 0.64))
caixa((-0.95, 0, 0.82), (0.22, 0.22, 0.22), plastico('#2e9e44', 0.3), chanfro=0.03)
caixa((0.95, 0, 0.82), (0.22, 0.22, 0.22), plastico('#d62828', 0.3), chanfro=0.03)
render(saida('P02.4'), elev=18, azim=-14)

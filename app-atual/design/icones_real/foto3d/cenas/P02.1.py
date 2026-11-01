# P02.1 sustentacao da tese: fachada de templo classico em marmore - o frontao (tese) apoiado nas colunas (argumentos)
from _por import *
cena_p(exp=-0.75)
mar = ruido_cor('#cbc0aa', '#ebe4d6', escala=4, rugos=0.35, bump=0.05)
for i, (w, d) in enumerate(((2.3, 1.1), (2.15, 1.0), (2.0, 0.9))):
    caixa((0, 0, 0.06 + i * 0.12), (w, d, 0.12), mar, chanfro=0.012)
n = 5
for i in range(n):
    x = -0.8 + 1.6 * i / (n - 1)
    col = torno([(0, 0), (0.15, 0), (0.15, 0.04), (0.12, 0.08), (0.11, 0.12), (0.095, 1.05), (0.12, 1.1), (0.15, 1.14), (0.15, 1.18), (0, 1.18)], mar, loc=(x, -0.2, 0.36), seg=24)
    col.data.polygons.foreach_set('use_smooth', [False] * len(col.data.polygons))
    caixa((x, -0.2, 0.36 + 1.2), (0.34, 0.34, 0.05), mar, chanfro=0.01)
caixa((0, 0, 1.68), (2.1, 0.9, 0.2), mar, chanfro=0.015)
caixa((0, 0, 1.81), (2.16, 0.95, 0.06), mar, chanfro=0.01)
fr = placa([(-1.1, 0), (1.1, 0), (0, 0.48)], 0.95, mar, loc=(0, 0.475, 1.84), rot=(math.radians(90), 0, 0), chanfro=0.015)
fr2 = placa([(-0.85, 0.06), (0.85, 0.06), (0, 0.38)], 0.05, ruido_cor('#b8ab92', '#cfc4ae', escala=4, rugos=0.4), loc=(0, -0.47, 1.84), rot=(math.radians(90), 0, 0), chanfro=0.005)
render(saida('P02.1'), elev=18, azim=-24)

# P02.2 ponto de vista: oculos de armacao tartaruga, hastes abertas - o olhar (ponto de vista) do autor
from _por import *
cena_p()
arm = ruido_cor('#1e0e05', '#6a3410', escala=7, rugos=0.22)
lente = vidro('#cfe6ff', 0.02)
ob = []
for s in (-1, 1):
    a = toro((s * 0.44, 0, 0.36), 0.34, 0.07, arm, rot=(math.radians(90), 0, 0)); a.scale = (1.15, 1, 0.85)
    l = esfera((s * 0.44, 0, 0.36), 0.34, lente); l.scale = (1.15, 0.05, 0.85)
    # haste: sai da borda externa e vai para tras, com a curva da orelha no fim
    ob.append(bez([(s * 0.83, 0.0, 0.46), (s * 0.86, 0.15, 0.47), (s * 0.9, 0.8, 0.45), (s * 0.92, 1.2, 0.36), (s * 0.92, 1.36, 0.16)], 0.04, arm))
    ob.append(caixa((s * 0.82, 0.03, 0.46), (0.07, 0.08, 0.09), arm, chanfro=0.025))
ob.append(bez([(-0.12, 0, 0.44), (0, -0.01, 0.5), (0.12, 0, 0.44)], 0.03, arm))
render(saida('P02.2'), elev=24, azim=-14)

# P05.1 sentido no contexto: quebra-cabeca montado com uma peca faltando e a peca certa encaixando no vazio
# revisao 31/10: pecas mais grossas, encaixes maiores, a peca vermelha bem acima do vazio (o vazio aparece) e camera mais alta
from _por import *
cena_p()
def borda(P, D, N, k):
    can = [(0, 0), (0.37, 0)]
    if k:
        for i in range(31):
            th = math.radians(235 - 290 * i / 30); can.append((0.5 + 0.16 * math.cos(th), 0.19 + 0.16 * math.sin(th)))
        can.append((0.63, 0))
    pts = []
    for (u, v) in can: pts.append((P[0] + D[0] * u + N[0] * k * v, P[1] + D[1] * u + N[1] * k * v))
    return pts
def peca(bx, ry, tp, lx):
    return (borda((0, 0), (1, 0), (0, -1), bx) + borda((1, 0), (0, 1), (1, 0), ry) + borda((1, 1), (-1, 0), (0, 1), tp) + borda((0, 1), (0, -1), (-1, 0), lx))
H = {(0, 0): 1, (0, 1): -1}   # lado direito da peca (0,j)
V = {(0, 0): -1, (1, 0): 1}   # topo da peca (i,0)
cores = {(0, 0): '#1f5fd6', (1, 0): '#f2b705', (0, 1): '#2e9e44', (1, 1): '#d62828'}
for i in range(2):
    for j in range(2):
        bx = -V[(i, 0)] if j == 1 else 0
        tp = V[(i, 0)] if j == 0 else 0
        rx = H[(0, j)] if i == 0 else 0
        lx = -H[(0, j)] if i == 1 else 0
        p = placa(peca(bx, rx, tp, lx), 0.24, plastico(cores[(i, j)], 0.3), chanfro=0.03, seg_ch=4)
        if (i, j) == (1, 1):
            p.location = (i + 0.1, j + 0.05, 0.95); p.rotation_euler = (math.radians(22), math.radians(-14), math.radians(10))
        else:
            p.location = (i, j, 0)
render(saida('P05.1'), elev=36, azim=-20)

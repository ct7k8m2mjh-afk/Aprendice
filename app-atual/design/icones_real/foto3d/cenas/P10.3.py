# P10.3 colocacao pronominal: peoes de xadrez em casas diferentes do tabuleiro (antes, no meio, depois do verbo)
from _por import *
cena_p()
cl = madeira('#e9cf9f', '#d0ad72', 14, 0.35); es = madeira('#7a4520', '#542d12', 12, 0.35)
n = 4; s = 0.42
for i in range(n):
    for j in range(n):
        caixa(((i - 1.5) * s, (j - 1.5) * s, 0.06), (s, s, 0.12), cl if (i + j) % 2 else es, chanfro=0.004)
caixa((0, 0, 0.03), (n * s + 0.12, n * s + 0.12, 0.06), madeira('#5a2f12', '#3a1c08', 8), chanfro=0.02)
perf = [(0, 0), (0.15, 0), (0.155, 0.04), (0.13, 0.07), (0.1, 0.09), (0.06, 0.28), (0.1, 0.31), (0.1, 0.33), (0.05, 0.35), (0.0, 0.35)]
def peao(x, y, m):
    torno(perf, m, loc=(x, y, 0.12)); esfera((x, y, 0.12 + 0.43), 0.1, m)
br = plastico('#f4f1ea', 0.25); pr = plastico('#1c1c22', 0.25)
peao(-1.5 * s, -0.5 * s, br); peao(0.5 * s, -1.5 * s, pr); peao(1.5 * s, 0.5 * s, br)
render(saida('P10.3'), elev=34, azim=-22)

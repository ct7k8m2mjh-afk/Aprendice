# P05.4 variacao linguistica, registro e adequacao: gravata-borboleta preta (traje formal) e chinelo de dedo (informal) -
# cada roupa para uma ocasiao, como cada registro para uma situacao. Revisao 31/10: o bone virava uma cupula sem forma;
# troca do par por gravata-borboleta + chinelo, dois objetos de leitura imediata e bem brasileiros no contraste formal x informal.
from _por import *
cena_p()
# ---- chinelo de dedo ----
def larg(t):  # t: 0 calcanhar .. 1 ponta
    return 0.29 + 0.06 * math.sin(math.pi * t * 1.25) - 0.07 * math.exp(-((t - 0.42) / 0.12) ** 2)
L = 2.0; pts = []
N = 40
def env(t):
    if t < 0.1: return math.sqrt(max(0.0, 1 - ((0.1 - t) / 0.1) ** 2))
    if t > 0.84: return math.sqrt(max(0.0, 1 - ((t - 0.84) / 0.16) ** 2))
    return 1.0
for i in range(N + 1):
    t = i / N; pts.append((max(0.004, larg(t) * env(t)), -L / 2 + L * t))
dir_ = [(x + 0.03 * (y / L), y) for x, y in pts]
esq = [(-x + 0.03 * (y / L) * 0, y) for x, y in reversed(pts)]
contorno = dir_ + esq[1:-1]
sola = placa(contorno, 0.09, plastico('#1f5fd6', 0.5), chanfro=0.03)
topo = placa(contorno, 0.05, plastico('#f2b705', 0.55), loc=(0, 0, 0.09), chanfro=0.02)
mc = plastico('#1f5fd6', 0.35)
ch = [sola, topo]
for s_ in (1, -1):
    ch.append(bez([(0, 0.52, 0.16), (s_ * 0.16, 0.3, 0.33), (s_ * 0.28, 0.05, 0.27), (s_ * 0.36, -0.12, 0.15)], 0.065, mc))
ch.append(cilindro((0, 0.53, 0.17), 0.07, 0.06, mc, chanfro=0.02))
grupo(ch, loc=(0.48, 0.1, 0), rot=(0, 0, math.radians(-22)))
# ---- gravata-borboleta preta (cetim) ----
cet = plastico('#16171c', 0.28)
asa = [(0.1, 0.13), (0.3, 0.22), (0.52, 0.33), (0.62, 0.22), (0.64, 0.0), (0.62, -0.22), (0.52, -0.33), (0.3, -0.22), (0.1, -0.13)]
bt = []
for s_ in (1, -1):
    a = placa([(s_ * x, y) for x, y in (asa if s_ > 0 else asa[::-1])], 0.16, cet, chanfro=0.05)
    sd = a.modifiers.new('sd', 'SUBSURF'); sd.levels = 2; sd.render_levels = 2
    for p in a.data.polygons: p.use_smooth = True
    bt.append(a)
n = caixa((0, 0, 0.1), (0.2, 0.3, 0.2), cet, chanfro=0.07); bt.append(n)
g = grupo(bt, loc=(-0.78, 0.0, 0.04), rot=(math.radians(10), math.radians(-6), math.radians(62)), escala=1.15)
no_chao(g)
render(saida('P05.4'), elev=36, azim=-14, tam=560)

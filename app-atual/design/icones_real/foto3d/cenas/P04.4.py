# P04.4 ambiguidade e quebra de coerencia: poste de sinalizacao com duas placas apontando para lados opostos
from _por import *
cena_p()
mad = madeira('#8a5a30', '#5b3618', 10)
cilindro((0, 0, 0.9), 0.07, 1.8, mad, chanfro=0.01)
cone((0, 0, 1.84), 0.075, 0.0, 0.08, mad)
torno([(0, 0), (0.26, 0), (0.3, 0.04), (0.28, 0.08), (0.12, 0.12), (0, 0.12)], ruido_cor('#7c8a52', '#5c6b36', 10, 0.9, bump=0.2))
def seta(cor_, z, lado, rz):
    L, H = 1.0, 0.32
    pol = [(0, -H / 2), (L - 0.22, -H / 2), (L, 0), (L - 0.22, H / 2), (0, H / 2)]
    if lado < 0: pol = [(-x, y) for x, y in pol][::-1]
    p = placa(pol, 0.06, plastico(cor_, 0.4), chanfro=0.015)
    sx = 0.5 * lado
    s = placa([(x * 0.62 + lado * 0.04, y * 0.25) for x, y in pol], 0.008, plastico('#ffffff', 0.4), loc=(0, 0, 0.06))
    grupo([p, s], loc=(lado * 0.05, -0.08, z), rot=(math.radians(90), 0, rz))
seta('#1f5fd6', 1.45, 1, math.radians(-8))
seta('#e8553e', 1.05, -1, math.radians(8))
render(saida('P04.4'), elev=18, azim=-18)

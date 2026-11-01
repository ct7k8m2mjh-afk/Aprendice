# P10.1 concordancia: cadeado de latao e a sua chave (as partes que tem de combinar)
from _por import *
cena_p()
lat = metal('#d4a52a', 0.22); aco = metal('#c7cbd1', 0.15)
corpo = caixa((0, 0, 0.45), (0.9, 0.36, 0.8), lat, chanfro=0.1)
furo = placa(circulo(0, 0, 0.07, 24) , 0.2, None, loc=(0, -0.1, 0.48), rot=(math.radians(90), 0, 0))
boolean(corpo, furo)
fd = placa([(-0.03, 0), (0.03, 0), (0.04, -0.18), (-0.04, -0.18)], 0.2, None, loc=(0, -0.1, 0.48), rot=(math.radians(90), 0, 0)); boolean(corpo, fd)
caixa((0, -0.13, 0.4), (0.14, 0.02, 0.3), plastico('#141414', 0.5), chanfro=0.0)
# arco
pts = [(-0.27, 0, 0.82), (-0.27, 0, 1.15)] + [(0.27 * math.cos(math.radians(180 - a)), 0, 1.15 + 0.27 * math.sin(math.radians(180 - a))) for a in range(10, 171, 10)] + [(0.27, 0, 1.15), (0.27, 0, 0.82)]
tubo(pts, 0.065, aco, res=16)
# chave deitada
ch = []
cab = toro((0, 0, 0), 0.17, 0.05, lat); ch.append(cab)
ch.append(cilindro((0.55, 0, 0), 0.04, 0.75, lat, rot=(0, math.radians(90), 0)))
ch.append(cilindro((0.2, 0, 0), 0.06, 0.06, lat, rot=(0, math.radians(90), 0)))
ch.append(placa([(0.68, 0), (0.92, 0), (0.92, -0.18), (0.86, -0.18), (0.86, -0.1), (0.8, -0.1), (0.8, -0.2), (0.74, -0.2), (0.74, -0.08), (0.68, -0.08)], 0.04, lat, loc=(0, 0, -0.02), chanfro=0.008))
grupo(ch, loc=(0.65, -0.45, 0.05), rot=(0, 0, math.radians(-150)))
render(saida('P10.1'), elev=24, azim=-20)

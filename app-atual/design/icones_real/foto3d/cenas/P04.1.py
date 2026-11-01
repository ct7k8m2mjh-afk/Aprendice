# P04.1 referencia (anafora): bumerangue de madeira pintado - vai e volta ao ponto de partida, como o pronome que retoma o termo
from _por import *
cena_p()
pts_e, pts_i = [], []
N = 60
def C(t): return (t * 1.0, 0.8 * (1.2 - math.sqrt(t * t + 0.04)))
for i in range(N + 1):
    t = -1 + 2 * i / N; x, y = C(t); dx, dy = 1.0, -0.8 * t / math.sqrt(t * t + 0.04); L = math.hypot(dx, dy); nx, ny = -dy / L, dx / L
    w = 0.21 * (1 - 0.25 * t * t)
    pts_e.append((x + nx * w, y + ny * w)); pts_i.append((x - nx * w, y - ny * w))
def tampa(t, s):
    x, y = C(t); dx, dy = 1.0, -0.8 * t / math.sqrt(t * t + 0.04); L = math.hypot(dx, dy); w = 0.21 * 0.75; ang = math.atan2(dy, dx)
    return [(x + w * math.cos(ang + math.pi / 2 - s * math.pi * k / 12), y + w * math.sin(ang + math.pi / 2 - s * math.pi * k / 12)) for k in range(1, 12)]
poli = pts_e + tampa(1, 1) + list(reversed(pts_i)) + tampa(-1, -1)[::-1]
bm = placa(poli, 0.07, madeira('#d9a066', '#b07a40', 30), chanfro=0.025, seg_ch=5)
# faixas pintadas
for t, c in ((-0.6, '#d62828'), (-0.45, '#f2b705'), (0.45, '#f2b705'), (0.6, '#d62828')):
    x, y = C(t); dx, dy = 1.0, -0.8 * t / math.sqrt(t * t + 0.04); ang = math.atan2(dy, dx)
    fx = caixa((x, y, 0.071), (0.06, 0.34, 0.004), plastico(c, 0.35), chanfro=0.0, rot=(0, 0, ang))
    boolean(fx, None) if False else None
grupo([bm], rot=(0, 0, math.radians(-15)))
render(saida('P04.1'), elev=62, azim=-10)

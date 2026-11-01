# B04.1 ciclo celular: anel 3D com as fases em proporcao aproximada (G1, S, G2 = interfase; M curta) e seta no sentido do ciclo
import sys; sys.path[:0] = ['/home/claude/escadas-sc/design/icones_real/foto3d', '/home/claude/escadas-sc/design/icones_real/foto3d/cenas']
from _bk import *
cena()
import random
fases = [('G₁', 150, '#2f6fdc'), ('S', 110, '#2e9e44'), ('G₂', 60, '#f2b705'), ('M', 40, '#d62828')]
a0 = 90; R = 1.0
fn = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
for nome, ang, c in fases:
    a1 = a0 - ang + 3
    m = plastico(c, .28)
    pts = [(R * math.cos(math.radians(a0 - 1.5 - (ang - 3) * i / 30)), R * math.sin(math.radians(a0 - 1.5 - (ang - 3) * i / 30)), .2) for i in range(31)]
    t = tubo(pts, .2, m, tipo='POLY'); t.data.bevel_resolution = 8; t.data.use_fill_caps = True; t.scale = (1, 1, .9)
    mid = math.radians(a0 - ang / 2)
    tx = texto(nome, (1.0 * math.cos(mid), 1.0 * math.sin(mid) - .04, .4), .36, plastico('#ffffff', .3), rot=(0, 0, 0), extr=.02, fonte=fn)
    a0 -= ang
# seta mostrando o sentido (horario) G1 -> S -> G2 -> M
seta_curva(1.55, 120, 40, .055, plastico('#5a5f69', .3), z=.2)
sai('B04.1', elev=62, azim=0)

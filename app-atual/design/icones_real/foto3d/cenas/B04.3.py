# B04.3 meiose/crossing-over: tetrade (bivalente) = 2 cromossomos homologos duplicados (azul = paterno, magenta = materno)
# pareados; as cromatides nao irmas internas trocaram pedacos no quiasma (crossing-over). Cromatina enrolada (estilo da
# referencia). Revisao 31/10 (segunda lente).
import sys; sys.path[:0] = ['/home/claude/escadas-sc/design/icones_real/foto3d', '/home/claude/escadas-sc/design/icones_real/foto3d/cenas']
from _bio2 import *
cena()
az = org('#3b5fe0', '#6a4ae8', cav='#0c1250', sss=.35, rugos=.25, coat=.6, bump=.25, esc=5, ao=.06)
mg = org('#d8327e', '#b8289a', cav='#4a0828', sss=.35, rugos=.25, coat=.6, bump=.25, esc=5, ao=.06)
cen = org('#f2b705', '#f5c832', cav='#6a4a00', sss=.3, rugos=.25, coat=.6, bump=.1, esc=5)
def segm(pts, m, r=.17):
    for e in (pts[0], pts[-1]):
        if e[2] < .3 or e[2] > 2.5: esfera(e, r * .98, m, seg=32)
    t = tubo(pts, r, m, tipo='NURBS'); o = malha(t)
    gn_sulcos(o, .045, 6.0, .2, warp=.15, warp_esc=3, tipo='voronoi', sub=1)
    return o
Z0, Zc, Z1 = .2, 1.05, 2.6   # centromero perto de baixo (submetacentrico)
def cromatide(x, dx, cb, ct, troca_z=None, ct2=None):
    # parte de baixo, centromero, parte de cima; dx = abertura dos bracos (X)
    segm([(x + dx * .6, 0, Z0), (x + dx * .2, 0, Zc - .3), (x, 0, Zc)], cb)
    if troca_z is None:
        segm([(x, 0, Zc), (x + dx * .25, 0, Zc + .6), (x + dx * .7, 0, Z1)], ct)
    else:
        segm([(x, 0, Zc), (x + dx * .2, 0, troca_z)], ct)
        segm([(x + dx * .2, 0, troca_z), (x + dx * .7, 0, Z1)], ct2)
    esfera((x, 0, Zc), .17, ct, seg=32)
# homologo azul (cromatides em -x) e magenta (+x)
cromatide(-.62, -.5, az, az)
cromatide(-.25, .15, az, az, troca_z=1.75, ct2=mg)
cromatide(.25, -.15, mg, mg, troca_z=1.75, ct2=az)
cromatide(.62, .5, mg, mg)
esfera((-.44, 0, Zc), .16, cen, seg=32); esfera((.44, 0, Zc), .16, cen, seg=32)
chao_auto()
sai('B04.3', elev=14, azim=-10)

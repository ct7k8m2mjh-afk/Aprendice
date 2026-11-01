# B06.5 heranca ligada ao sexo: cromossomos X (grande, submetacentrico) e Y (pequeno, acrocentrico), duplicados (2 cromatides
# irmas unidas no centromero). Mesmo acabamento de cromatina enrolada do B04.3. Revisao 31/10 (segunda lente).
import sys; sys.path[:0] = ['/home/claude/escadas-sc/design/icones_real/foto3d', '/home/claude/escadas-sc/design/icones_real/foto3d/cenas']
from _bio2 import *
cena()
mg = org('#d8327e', '#b8289a', cav='#4a0828', sss=.35, rugos=.25, coat=.6, bump=.25, esc=5, ao=.06)
az = org('#3b5fe0', '#6a4ae8', cav='#0c1250', sss=.35, rugos=.25, coat=.6, bump=.25, esc=5, ao=.06)
cen = org('#f2b705', '#f5c832', cav='#6a4a00', sss=.3, rugos=.25, coat=.6, bump=.1, esc=5)
def segm(pts, m, r):
    for e in (pts[0], pts[-1]): esfera(e, r * .98, m, seg=32)
    o = malha(tubo(pts, r, m, tipo='NURBS'))
    gn_sulcos(o, .045, 6.0, .2, warp=.15, warp_esc=3, tipo='voronoi', sub=1)
def cromossomo(x0, zc, bc, bl, ab, r, m):
    # zc = altura do centromero; bc = braco curto (p), bl = braco longo (q); ab = abertura das cromatides
    for s in (-1, 1):
        segm([(x0 + s * r * .9, 0, zc), (x0 + s * (r * .9 + ab * .35), 0, zc + bc * .6), (x0 + s * (r * .9 + ab), 0, zc + bc)], m, r)
        segm([(x0 + s * r * .9, 0, zc), (x0 + s * (r * .9 + ab * .35), 0, zc - bl * .6), (x0 + s * (r * .9 + ab), 0, zc - bl)], m, r)
    esfera((x0, 0, zc), r * 1.05, cen, seg=32)
cromossomo(-.65, 1.55, .85, 1.3, .32, .2, mg)      # X: submetacentrico (p um pouco menor que q)
cromossomo(.8, 1.12, .08, .88, .1, .16, az)        # Y: acrocentrico (p muito curto)
chao_auto()
sai('B06.5', elev=14, azim=-10)

# B03.6 plantas C4 e CAM: abacaxi (planta CAM: abre os estomatos a noite e fixa CO2 em acidos organicos) e espiga de milho
# (planta C4): os dois mecanismos que contornam a fotorrespiracao. Revisao 31/10: substitui a foto por render 3D.
import sys; sys.path[:0] = ['/home/claude/escadas-sc/design/icones_real/foto3d', '/home/claude/escadas-sc/design/icones_real/foto3d/cenas']
from _bio2 import *
cena(); random.seed(5)
# abacaxi: frutilhos em espiral (celulas de voronoi salientes) em ouro/ambar com bordas esverdeadas
cas = org('#e0a12a', '#c47a18', cav='#3a5a10', sss=.2, rugos=.4, coat=.35, bump=.3, esc=5, ao=.08, cav_forca=1.0)
a = esfera((0, 0, 0), 1, cas, seg=96); escala(a, (.78, .78, 1.08)); a.location = (0, 0, 1.08)
gn_sulcos(a, .06, 4.2, .09, warp=.05, warp_esc=2, tipo='voronoi', sub=2)
# pontinhas espinhosas no centro de cada frutilho: sugeridas pelo bump; coroa de folhas rigidas azul-esverdeadas
fm = org('#3f8a4a', '#5aa660', cav='#0e2a12', sss=.2, rugos=.4, coat=.4, bump=.1, esc=6)
for ring in range(4):
    n = 7 + ring * 2
    for k in range(n):
        ang = k / n * 6.283 + ring * .4
        L = .95 - ring * .17 + random.uniform(-.08, .08); incl = math.radians(18 + ring * 16 + random.uniform(-5, 5))
        d = V((math.cos(ang) * math.sin(incl), math.sin(ang) * math.sin(incl), math.cos(incl)))
        p0 = V((0, 0, 2.08)) + V((math.cos(ang), math.sin(ang), 0)) * (.06 + ring * .05)
        p1 = p0 + d * L * .5; p2 = p0 + d * L + V((math.cos(ang), math.sin(ang), 0)) * L * .15 * ring
        t = tubo([tuple(p0), tuple(p1), tuple(p2)], .07, fm, raios=[1, .7, .05]); t.data.bevel_resolution = 2
# espiga de milho (C4) deitada ao lado: graos em fileiras, palha aberta
gr = org('#f5c623', '#f0b414', cav='#7a4a00', sss=.3, rugos=.25, coat=.6, bump=.05, esc=8)
pal = org('#c9cf7a', '#a9b45a', cav='#3a4210', sss=.3, rugos=.5, coat=.2, bump=.3, esc=8)
E = []
nrow = 14; ncol = 16; Lc = 1.9
for i in range(ncol):
    t = i / (ncol - 1); x = -Lc / 2 + t * Lc; R = .3 * (1 - .45 * t ** 1.6)
    for j in range(nrow):
        ang = j / nrow * 6.283 + (i % 2) * 3.1416 / nrow
        k = esfera((0, 0, 0), 1, gr, seg=16); escala(k, (.065, .07 * R / .3 + .02, .06 * R / .3 + .02))
        k.location = (x, math.cos(ang) * R, math.sin(ang) * R); k.rotation_euler = (ang, 0, 0); E.append(k)
cil = cilindro((0, 0, 0), .26, Lc, plastico('#e6b010', .4), rot=(0, math.radians(90), 0)); E.append(cil)
for s in (-1, 1):
    pp = tubo([(-1.15, 0, 0), (-.5, s * .32, .05), (.2, s * .55, .0), (.6, s * .62, -.1)], .12, pal, raios=[1, 1.4, 1, .1]); pp.scale = (1, 1, .25); E.append(pp)
for o in E:
    o.matrix_world = mathutils.Matrix.Translation(V((1.25, -.65, .33))) @ mathutils.Matrix.Rotation(math.radians(-35), 4, 'Z') @ o.matrix_world
chao_auto()
sai('B03.6', elev=22, azim=-12)

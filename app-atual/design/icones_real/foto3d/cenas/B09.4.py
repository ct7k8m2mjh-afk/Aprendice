# B09.4 relacoes ecologicas: peixe-palhaco entre os tentaculos da anemona-do-mar: mutualismo classico (a anemona
# protege o peixe; o peixe limpa, defende e alimenta a anemona). Revisao 31/10: substitui a foto da abelha por render 3D.
import sys; sys.path[:0] = ['/home/claude/escadas-sc/design/icones_real/foto3d', '/home/claude/escadas-sc/design/icones_real/foto3d/cenas']
from _bio2 import *
cena(); random.seed(4)
col = org('#8e3a8a', '#a8489e', cav='#2a0828', sss=.35, rugos=.35, coat=.5, bump=.3, esc=6)
ten = [faixas_mat([(.6, '#a24aa8'), (1.6, '#d68ad6'), (2.3, '#f4c2ee')], 'Z', rugos=.25, coat=.6, sss=.4, bump=.1, tipo='LINEAR'),
       faixas_mat([(.6, '#9440a0'), (1.6, '#c87cd2'), (2.3, '#f0b8ea')], 'Z', rugos=.25, coat=.6, sss=.4, bump=.1, tipo='LINEAR')]
pon = org('#e9a6e0', '#f3c0ea', cav='#7a3a70', sss=.5, rugos=.2, coat=.6, bump=0)
# coluna da anemona (base larga sobre a rocha)
cl = blob([('ELLIPSOID', (0, 0, .35), .9, (1.15, 1.15, .55)), ('ELLIPSOID', (0, 0, .7), .8, (1.25, 1.25, .35))], col, res=.03)
# tentaculos no disco oral, em aneis, curvando para fora e para cima
for ring, (R, n, h) in enumerate([(.25, 7, 1.0), (.55, 12, .95), (.85, 16, .8), (1.08, 19, .6)]):
    for k in range(n):
        a = k / n * 6.283 + ring * .3 + random.uniform(-.08, .08)
        d = V((math.cos(a), math.sin(a), 0)); p0 = V((0, 0, .82)) + d * R
        L = h * random.uniform(.85, 1.15)
        sw = random.uniform(-.25, .25)
        p1 = p0 + d * L * (.15 + ring * .12) + V((0, 0, L * .55)) + V((-d.y, d.x, 0)) * sw * .3
        p2 = p0 + d * L * (.3 + ring * .2) + V((0, 0, L * .85)) - V((-d.y, d.x, 0)) * sw * .5
        p3 = p0 + d * L * (.45 + ring * .3) + V((0, 0, L * 1.1)) + V((-d.y, d.x, 0)) * sw * .8 + V((random.uniform(-.1, .1), random.uniform(-.1, .1), 0))
        tubo([tuple(p0), tuple(p1), tuple(p2), tuple(p3)], .085, ten[k % 2], raios=[1.15, .9, .7, .45])
# peixe-palhaco (Amphiprion ocellaris): corpo laranja com 3 faixas brancas contornadas de preto
fx = [(-1.0, '#f26a12'), (-.66, '#f26a12'), (-.62, '#151515'), (-.58, '#ffffff'), (-.42, '#ffffff'), (-.38, '#151515'),
      (-.34, '#f26a12'), (-.08, '#f26a12'), (-.04, '#151515'), (0.0, '#ffffff'), (.16, '#ffffff'), (.2, '#151515'), (.24, '#f26a12'),
      (.62, '#f26a12'), (.66, '#151515'), (.69, '#ffffff'), (.76, '#ffffff'), (.8, '#151515'), (.84, '#f26a12'), (1.0, '#f26a12')]
corpo_m = faixas_mat(fx, 'X', rugos=.25, coat=.6, sss=.15, bump=.05)
fx2 = [(-1.0, '#f26a12'), (.5, '#f26a12'), (.6, '#151515'), (1.0, '#151515')]
FX, FZ = .1, 1.9
peixe = []
b = blob([('ELLIPSOID', (0, 0, 0), .55, (1.0, .42, .62)), ('ELLIPSOID', (-.35, 0, 0), .45, (1.0, .38, .58)),
          ('ELLIPSOID', (.45, 0, -.02), .3, (1.0, .32, .55))], corpo_m, res=.015)
b.scale = (1, 1, 1); peixe.append(b)
finT = faixas_mat([(.5, '#f26a12'), (.93, '#f26a12'), (.96, '#151515'), (1.3, '#151515')], 'X', rugos=.3, coat=.5, sss=.2, bump=0)
finD = faixas_mat([(.1, '#f26a12'), (.41, '#f26a12'), (.43, '#151515'), (.8, '#151515')], 'Z', rugos=.3, coat=.5, sss=.2, bump=0)
finV = faixas_mat([(-.7, '#151515'), (-.37, '#151515'), (-.35, '#f26a12'), (0, '#f26a12')], 'Z', rugos=.3, coat=.5, sss=.2, bump=0)
f = esfera((.8, 0, 0), 1, finT, seg=48); escala(f, (.22, .04, .3)); peixe.append(f)
f = esfera((-.05, 0, .32), 1, finD, seg=48); escala(f, (.42, .04, .15)); peixe.append(f)
f = esfera((.15, 0, -.3), 1, finV, seg=48); escala(f, (.22, .04, .1)); peixe.append(f)
for s in (-1, 1):
    e = esfera((-.6, s * .2, .08), .075, plastico('#111111', .1), seg=32); peixe.append(e)
    e2 = esfera((-.615, s * .205, .08), .085, plastico('#f7f2e0', .3), seg=32); escala(e2, (1, .4, 1)); peixe.append(e2)
    pf = esfera((-.15, s * .22, -.12), 1, finT, seg=32); escala(pf, (.2, .03, .1)); peixe.append(pf)
for o in peixe:
    o.matrix_world = mathutils.Matrix.Translation(V((FX, -1.25, FZ))) @ mathutils.Matrix.Rotation(math.radians(-20), 4, 'Z') @ mathutils.Matrix.Scale(.95, 4) @ o.matrix_world
chao_auto()
sai('B09.4', elev=22, azim=-10, tam=560)

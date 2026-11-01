# B01.1 membrana e transporte passivo: bloco de bicamada fosfolipidica (cabecas polares + caudas apolares) com proteina-canal,
# ions atravessando a favor do gradiente (muitos em cima, poucos embaixo), uma glicoproteina e colesterol
import sys; sys.path[:0] = ['/home/claude/escadas-sc/design/icones_real/foto3d', '/home/claude/escadas-sc/design/icones_real/foto3d/cenas']
from _bio2 import *
pele = pele_org; plastico = plast_org
cena()
import random; random.seed(1)
cabs = [org(c, c, cav='#4a1008', sss=.3, rugos=.25, coat=.6, bump=.1, esc=6) for c in ('#e0543a', '#ec6e4a', '#d4483a')]
cau = org('#f2d07a', '#ead090', cav='#7a5a1a', sss=.35, rugos=.4, coat=.3, bump=.3, esc=10, ao=.06)
prot = org('#2f6fdc', '#4a84ea', cav='#0a1a5a', sss=.3, rugos=.3, coat=.55, bump=.4, esc=8, ao=.08); prot2 = org('#2e9e44', '#44b058', cav='#0a3010', sss=.3, rugos=.3, coat=.55, bump=.4, esc=8, ao=.08)
ion = org('#f6c42a', '#fad24a', cav='#7a5a00', sss=.2, rugos=.15, coat=.7, bump=0); acu = plastico('#d14b9b', .3)
sp = .17; h = .42; NX, NY = 6, 4
def livre(x, y):
    return (x * x + y * y > .5 ** 2) and ((x - .75) ** 2 + (y - .2) ** 2 > .38 ** 2)
for i in range(-NX, NX + 1):
    for j in range(-NY, NY + 1):
        x = i * sp + (sp / 2 if j % 2 else 0) + random.uniform(-.01, .01); y = j * sp * .87
        if not livre(x, y): continue
        for s in (1, -1):
            esfera((x, y, s * (h + random.uniform(-.015, .015))), .085, random.choice(cabs), seg=16)
            if j == -NY or i in (-NX, NX):
                for dx in (-.03, .03):
                    tubo([(x + dx, y, s * (h - .07)), (x + dx * 1.5 + random.uniform(-.02, .02), y, s * .22), (x + dx + random.uniform(-.02, .02), y, s * .04)], .022, cau)
# miolo hidrofobico (preenche entre as camadas)
caixa((sp / 4, 0, 0), (2 * NX * sp + .05, 2 * NY * sp * .87 + .05, .62), cau, chanfro=.04)
# proteina-canal: 5 subunidades formando o poro
for k in range(5):
    a = k / 5 * 6.283
    o = blob([('ELLIPSOID', (0, 0, 0), .2, (1, 1, 3.8))], prot, res=.02)
    o.location = (.27 * math.cos(a), .27 * math.sin(a), 0); desloca(o, .02, .08)
# proteina transportadora (verde) e glicoproteina com cadeia de acucares
o = blob([('ELLIPSOID', (.75, .2, 0), .5, (.62, .62, 1.6)), ('BALL', (.82, .1, .45), .32), ('BALL', (.68, .3, -.45), .32)], prot2, res=.02); desloca(o, .025, .1)
p = V((.78, .2, .85))
for k in range(5):
    q = p + V((random.uniform(-.08, .08), random.uniform(-.08, .08), .13)); esfera(q, .06, acu, seg=24); p = q
for (x, y) in ((-.6, .3), (.35, -.45), (-.8, -.3)):
    o = esfera((x, y, .2), .05, plastico('#f6e3a1', .3), seg=16); escala(o, (1, 1, 3))
# ions: concentrados em cima, passando pelo canal, poucos embaixo
for z in (.95, .3, -.3):
    esfera((0, 0, z), .1, ion, seg=32)
for (x, y, z) in ((-.45, -.3, .78), (-.3, .35, .9), (.3, -.45, .82), (-.8, .05, .8), (-.55, -.55, 1.05), (.1, -.3, 1.2)):
    esfera((x, y, z), .1, ion, seg=32)
for (x, y, z) in ((.35, -.3, -.75), (-.6, .2, -.72)):
    esfera((x, y, z), .1, ion, seg=32)
sai('B01.1', elev=17, azim=-24, tam=560)

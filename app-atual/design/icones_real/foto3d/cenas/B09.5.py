# B09.5 sucessao ecologica primaria: placa de terreno que vai da rocha nua com liquens (pioneiros) ao musgo, ao capim, ao
# arbusto e a arvore (comunidade climax), com o solo engrossando ao longo das etapas. Revisao 31/10 (segunda lente).
import sys; sys.path[:0] = ['/home/claude/escadas-sc/design/icones_real/foto3d', '/home/claude/escadas-sc/design/icones_real/foto3d/cenas']
from _bio2 import *
cena(); random.seed(9)
roc = org('#a8a29a', '#8a847c', cav='#2a2622', sss=0, rugos=.85, coat=0, bump=1.0, esc=3, ao=.2, mix=.7)
sol = org('#7a5232', '#6a4428', cav='#24140a', sss=0, rugos=.9, coat=0, bump=.8, esc=8, ao=.1)
liq = org('#e2c64a', '#c9d070', cav='#5a5010', sss=0, rugos=.85, coat=0, bump=.8, esc=14)
mus = org('#5a9a2a', '#7ab43a', cav='#1a3a08', sss=.2, rugos=.8, coat=0, bump=1.0, esc=20, ao=.06)
cap = org('#8cc04a', '#a8d060', cav='#2a4a10', sss=.2, rugos=.6, coat=.1, bump=.3, esc=8)
fol = org('#2e8a3a', '#4aa448', cav='#0a2a10', sss=.25, rugos=.6, coat=.1, bump=.8, esc=6, ao=.15)
tro = org('#6a4426', '#5a361c', cav='#1e100a', sss=0, rugos=.8, coat=0, bump=.8, esc=10)
# rocha base alongada
r = caixa((0, 0, .2), (4.2, 1.5, .4), roc, chanfro=.12); desloca(r, .08, .5, sub=3)
# solo: cunha que engrossa da esquerda para a direita
s = caixa((.7, 0, .42), (2.8, 1.4, .1), sol, chanfro=.04)
for v in s.data.vertices:
    if v.co.z > .42: v.co.z += (v.co.x - (-.7)) / 2.8 * .32
desloca(s, .04, .3, sub=2)
# liquens na rocha nua (esquerda)
for k in range(8):
    l = esfera((random.uniform(-2.0, -1.05), random.uniform(-.6, .6), .42), random.uniform(.08, .15), liq, seg=20); escala(l, (1.3, 1.3, .25))
# musgo
for k in range(14):
    m = esfera((random.uniform(-.75, -.1), random.uniform(-.6, .6), .5), random.uniform(.09, .14), mus, seg=20); escala(m, (1, 1, .55))
# capim
for k in range(26):
    x = random.uniform(-.05, .6); y = random.uniform(-.6, .6); z0 = .5 + (x + .7) / 2.8 * .32
    tubo([(x, y, z0), (x + random.uniform(-.06, .06), y, z0 + .2), (x + random.uniform(-.12, .12), y + random.uniform(-.05, .05), z0 + .36)], .018, cap, raios=[1, .6, .1])
# arbusto
z1 = .5 + (1.15 + .7) / 2.8 * .32
for k in range(5):
    b = esfera((1.15 + random.uniform(-.15, .15), random.uniform(-.2, .2), z1 + .2 + random.uniform(0, .2)), random.uniform(.2, .26), fol, seg=32); desloca(b, .05, .1)
# arvore (climax)
z2 = .5 + (1.85 + .7) / 2.8 * .32
tubo([(1.85, .05, z2 - .05), (1.85, .05, z2 + .6), (1.8, .05, z2 + 1.0)], .09, tro, raios=[1.3, 1, .8])
for k in range(9):
    a = random.uniform(0, 6.283); rr = random.uniform(0, .35)
    b = esfera((1.82 + math.cos(a) * rr, .05 + math.sin(a) * rr * .7, z2 + 1.15 + random.uniform(-.1, .35)), random.uniform(.3, .4), fol, seg=32); desloca(b, .06, .12)
chao_auto()
sai('B09.5', elev=24, azim=-10)

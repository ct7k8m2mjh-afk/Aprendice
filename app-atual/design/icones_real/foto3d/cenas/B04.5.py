# B04.5 apoptose e cancer: epitelio organizado (celulas iguais, nucleo pequeno) com um tumor crescendo sobre ele: celulas
# cancerosas irregulares, de tamanhos variados, nucleos grandes e escuros, empilhadas sem controle (proliferacao
# descontrolada, perda da inibicao por contato). Revisao 31/10 (segunda lente).
import sys; sys.path[:0] = ['/home/claude/escadas-sc/design/icones_real/foto3d', '/home/claude/escadas-sc/design/icones_real/foto3d/cenas']
from _bio2 import *
cena(); random.seed(4)
cel = org('#f2b3b8', '#e89ca4', cav='#6a2a35', sss=.4, rugos=.3, coat=.55, bump=.1, esc=4, ao=.08)
nuN = org('#8a5ac8', '#9a6ad6', cav='#2a1050', sss=.3, rugos=.3, coat=.5, bump=.2, esc=8)
tum = [org('#b8327a', '#d0488e', cav='#3a0820', sss=.35, rugos=.3, coat=.55, bump=.4, esc=6, ao=.08),
       org('#a82a8c', '#c03aa0', cav='#3a0830', sss=.35, rugos=.3, coat=.55, bump=.4, esc=6, ao=.08)]
nuT = org('#3a1a6a', '#4a2480', cav='#0a0420', sss=.2, rugos=.3, coat=.5, bump=.4, esc=10)
# epitelio: prismas hexagonais arredondados lado a lado
R = .3
for i in range(-5, 6):
    for j in range(-4, 5):
        x = i * R * 1.73 + (j % 2) * R * .865; y = j * R * 1.5
        if x * x / 9 + y * y / 4.2 > 1: continue
        c = cilindro((x, y, .25), R * .98, .5, cel, chanfro=.07, vert=6); c.rotation_euler = (0, 0, math.radians(30))
        esfera((x, y, .42), .1, nuN, seg=20)
# tumor: monte de celulas irregulares
for k in range(30):
    a = random.uniform(0, 6.283); rr = random.uniform(0, 1.15) * (1 - k / 40)
    z = .55 + random.uniform(0, .5) * (1.15 - rr) + (k / 30) * .55
    p = V((.1 + math.cos(a) * rr, -.1 + math.sin(a) * rr, z)); s = random.uniform(.26, .42)
    c = esfera(tuple(p), s, tum[k % 2], seg=48); escala(c, (random.uniform(.85, 1.2), random.uniform(.85, 1.2), random.uniform(.75, 1.0)))
    desloca(c, .06, .25, sub=1)
    n = esfera(tuple(p + V((0, -s * .55, s * .2))), s * .55, nuT, seg=32); desloca(n, .03, .2)
chao_auto()
sai('B04.5', elev=30, azim=-12)

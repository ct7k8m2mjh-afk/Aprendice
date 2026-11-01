# B01.4 sistema de endomembranas: complexo golgiense: pilha de cisternas achatadas e curvas (face cis -> trans), bordas
# dilatadas, vesiculas de transporte chegando e saindo. Revisao 31/10 (segunda lente).
import sys; sys.path[:0] = ['/home/claude/escadas-sc/design/icones_real/foto3d', '/home/claude/escadas-sc/design/icones_real/foto3d/cenas']
from _bio2 import *
cena(); random.seed(4)
tons = ['#f2b705', '#f29a1a', '#ec7a2a', '#e05a3a', '#d23a52', '#b82a6a']
mats = [org(h, h, cav='#3a0a10', sss=.35, rugos=.3, coat=.6, bump=.25, esc=5, ao=.1) for h in tons]
N = 6
for i in range(N):
    z = .25 + i * .2
    W = 1.55 - abs(i - 2.5) * .12
    c = blob([('ELLIPSOID', (0, 0, z), 1.0, (W, .7, .09)), ('ELLIPSOID', (-W * .78, 0, z), .45, (.35, 1.1, .3)), ('ELLIPSOID', (W * .78, 0, z), .45, (.35, 1.1, .3))], mats[i], res=.015, thr=.3)
    for v in c.data.vertices: v.co.z -= .16 * v.co.x ** 2 + .08 * v.co.y ** 2
# vesiculas brotando / chegando
for k in range(12):
    s = random.choice((-1, 1)); i = random.randrange(N)
    p = (s * random.uniform(1.45, 1.75), random.uniform(-.45, .45), .25 + i * .2 - .3 + random.uniform(-.1, .25))
    esfera(p, random.uniform(.08, .13), mats[i], seg=24)
chao_auto()
sai('B01.4', elev=32, azim=-14)

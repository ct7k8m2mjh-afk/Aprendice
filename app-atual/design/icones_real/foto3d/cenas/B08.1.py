# B08.1 neuronio: corpo celular com nucleo, dendritos ramificados, cone de implantacao, axonio com bainha de mielina e nodulos
# de Ranvier, terminais axonicos com botoes sinapticos. Revisao 31/10 (segunda lente).
import sys; sys.path[:0] = ['/home/claude/escadas-sc/design/icones_real/foto3d', '/home/claude/escadas-sc/design/icones_real/foto3d/cenas']
from _bio2 import *
cena(); random.seed(11)
neu = org('#6a5ad8', '#8a6ee8', cav='#1c1250', sss=.35, rugos=.3, coat=.55, bump=.2, esc=5, ao=.1)
mie = org('#f6e7c4', '#eedaa8', cav='#8a6a3a', sss=.4, rugos=.3, coat=.5, bump=.1, esc=6)
nuc = org('#d4417a', '#e85a90', cav='#4a0a24', sss=.3, rugos=.3, coat=.6, bump=.2, esc=8)
C = V((-1.5, 0, 1.4))
blob([('BALL', tuple(C), .48), ('BALL', tuple(C + V((.3, 0, -.18))), .32), ('BALL', tuple(C + V((-.15, .05, .2))), .34)], neu, res=.02)
esfera(C + V((-.05, -.32, .05)), .17, nuc, seg=32)
def ramo(p, d, L, r, nivel):
    q = p + d * L
    m = p + d * L * .5 + V((random.uniform(-.1, .1), random.uniform(-.1, .1), random.uniform(-.1, .1))) * L
    tubo([tuple(p), tuple(m), tuple(q)], r, neu, raios=[1, .8, .6])
    if nivel > 0:
        for k in (-1, 1):
            ax = d.cross(V((0, 1, 0))).normalized() if abs(d.y) < .9 else V((1, 0, 0))
            nd = (d + ax * k * random.uniform(.5, .9) + V((0, random.uniform(-.4, .4), 0))).normalized()
            ramo(q, nd, L * random.uniform(.55, .75), r * .6, nivel - 1)
for k in range(6):
    a = math.radians(70 + k * 42 + random.uniform(-10, 10))
    d = V((math.cos(a), random.uniform(-.3, .3), math.sin(a))).normalized()
    ramo(C + d * .35, d, .55, .085, 2)
# axonio: cone de implantacao e trajeto em S descendo para a direita
ax_pts = [C + V((.45, 0, -.15)), C + V((.95, 0, -.45)), V((.0, 0, .75)), V((.8, 0, .55)), V((1.5, 0, .72)), V((2.0, 0, .62))]
tubo([tuple(p) for p in ax_pts], .065, neu)
# mielina: segmentos ao longo do axonio (amostrados na curva)
cu = bpy.data.curves.new('t', 'CURVE'); sp = cu.splines.new('NURBS'); sp.points.add(len(ax_pts) - 1)
for i, p in enumerate(ax_pts): sp.points[i].co = (*p, 1)
sp.use_endpoint_u = True; sp.order_u = 4
def pt(t):
    # amostra simples por interpolacao linear dos pontos (suficiente para posicionar)
    n = len(ax_pts) - 1; x = t * n; i = min(int(x), n - 1); f = x - i
    return ax_pts[i] * (1 - f) + ax_pts[i + 1] * f
for k in range(5):
    t0 = .22 + k * .145; t1 = t0 + .12
    a, b = pt(t0), pt(t1); mid = (a + b) / 2; L = (b - a).length
    o = cilindro(tuple(mid), .14, L, mie, chanfro=.06, vert=32); o.rotation_euler = (b - a).to_track_quat('Z', 'Y').to_euler()
# terminais axonicos com botoes
E = ax_pts[-1]
for k in range(5):
    ang = math.radians(-60 + k * 30); d = V((math.cos(ang), random.uniform(-.2, .2), math.sin(ang)))
    q = E + d * .42; tubo([tuple(E), tuple(E + d * .2 + V((0, 0, .03))), tuple(q)], .035, neu); esfera(tuple(q), .085, neu, seg=24)
chao_auto()
sai('B08.1', elev=16, azim=-8)

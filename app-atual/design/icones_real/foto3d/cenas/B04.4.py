# B04.4 gametogenese: ovocito secundario (citoplasma, nucleo em metafase II sugerido), zona pelucida, corona radiata e o 1o
# corpusculo polar, com espermatozoides chegando: os gametos formados na gametogenese. Revisao 31/10 (2a rodada).
import sys; sys.path[:0] = ['/home/claude/escadas-sc/design/icones_real/foto3d', '/home/claude/escadas-sc/design/icones_real/foto3d/cenas']
from _bio2 import *
cena(); random.seed(6)
ovo = org('#f6d2b4', '#f0c09c', cav='#8a5a3a', sss=.45, rugos=.35, coat=.45, bump=.4, esc=6, ao=.1, bump_esc=30)
zon = org('#d8d0f4', '#c8bcee', cav='#5a5090', sss=.4, rugos=.2, coat=.6, bump=.1, esc=6)
zon.node_tree.nodes['Principled BSDF'].inputs['Transmission Weight'].default_value = .75
cor_ = org('#f2b705', '#f6c935', cav='#6a4a00', sss=.35, rugos=.35, coat=.45, bump=.4, esc=8, ao=.08)
nuc = org('#7b2cbf', '#9040d0', cav='#200840', sss=.3, rugos=.3, coat=.55, bump=.2, esc=8)
esp = org('#3b6fe0', '#5a86ea', cav='#0a1a5a', sss=.3, rugos=.25, coat=.6, bump=0)
C = V((0, 0, 1.2))
o = esfera(C, .82, ovo, seg=96)
z = esfera(C, 1.0, zon, seg=96)
esfera(tuple(C + V((.2, -.82, .3))), .15, ovo, seg=32)          # 1o corpusculo polar (no espaco perivitelino)
esfera(tuple(C + V((.05, -.74, .1))), .1, nuc, seg=32)
for k in range(150):
    u = random.uniform(-1, 1); a = random.uniform(0, 6.283); d = V((math.sqrt(1 - u * u) * math.cos(a), math.sqrt(1 - u * u) * math.sin(a), u))
    if d.z < -.6: continue
    if d.y < -.5 and d.x > -.1 and d.z > -.2: continue        # janela para ver a zona e o ovocito
    c = esfera((0, 0, 0), .13, cor_, seg=20); escala(c, (1.2, 1.2, .8)); c.location = C + d * 1.13; c.rotation_euler = d.to_track_quat('Z', 'Y').to_euler()
# espermatozoides: cabeca oval achatada, peca intermediaria, cauda ondulada
for d in [V((.75, -.55, .35)), V((.95, -.2, -.25)), V((.45, -.85, -.1))]:
    d.normalize(); p = C + d * 1.33
    h = esfera((0, 0, 0), 1, esp, seg=32); escala(h, (.15, .09, .09)); h.location = p; h.rotation_euler = d.to_track_quat('X', 'Z').to_euler()
    w = d.cross(V((0, 0, 1))).normalized()
    pts = [tuple(p + d * (.12 + t * 1.2) + w * .1 * math.sin(t * 10) * t) for t in [i / 16 for i in range(17)]]
    tubo(pts, .022, esp, raios=[1.5] * 3 + [1.0] * 7 + [.6] * 7)
chao_auto()
sai('B04.4', elev=22, azim=-12, tam=560)

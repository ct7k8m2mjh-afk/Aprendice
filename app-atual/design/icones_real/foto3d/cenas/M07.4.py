from _mat import *
cena()
# girassol: sementes no modelo de Vogel (angulo de ouro 137,5 graus) -> espirais em numeros de Fibonacci
import random; random.seed(3)
objs = []
cen = plastico('#4a2a12', 0.5); sem = plastico('#2a170a', 0.45); sem2 = plastico('#6b4a1a', 0.45)
objs.append(cilindro((0, 0, 0), 0.62, 0.1, cen, chanfro=0.04))
N = 340; ga = math.radians(137.508)
for i in range(1, N):
    r = 0.6 * math.sqrt(i / N); a = i * ga
    o = esfera((r * math.cos(a), r * math.sin(a), 0.06), 0.022, sem if r > 0.25 else sem2, seg=12); o.scale = (1, 1, 0.6)
    objs.append(o)
for k in range(21):
    a = k * 2 * math.pi / 21; r = 0.88
    p = esfera((r * math.cos(a), r * math.sin(a), -0.01 + 0.03 * (k % 2)), 0.3, plastico('#f5b800', 0.35))
    p.scale = (1.0, 0.36, 0.08); p.rotation_euler = (0, R(-8), a); objs.append(p)
for k in range(21):
    a = (k + 0.5) * 2 * math.pi / 21; r = 0.8
    p = esfera((r * math.cos(a), r * math.sin(a), -0.04), 0.28, plastico('#e8a200', 0.4))
    p.scale = (1.0, 0.34, 0.07); p.rotation_euler = (0, R(-5), a); objs.append(p)
grupo(objs, loc=(0, 0, 0.95), rot=(R(62), 0, 0))
curva_tubo([(0, 0.25, 0.85), (0.02, 0.45, 0.5), (0.05, 0.55, 0.0)], 0.06, plastico('#3f8f2f', 0.4))
fim('M07.4', elev=22, azim=-10)

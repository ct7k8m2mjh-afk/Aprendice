from _mat import *
cena()
# canto de um tabuleiro de xadrez com 1, 2, 4 e 8 graos nas casas seguidas (lenda dos graos: 2^n)
import random; random.seed(7)
q = 0.5; cl = plastico('#f0dcb4', 0.35); es = plastico('#7a4a26', 0.35)
caixa((0, 0, 0.05), (4 * q + 0.16, 4 * q + 0.16, 0.1), madeira('#5a3418', escala=10), chanfro=0.03)
for i in range(4):
    for j in range(4):
        caixa(((i - 1.5) * q, (j - 1.5) * q, 0.105), (q, q, 0.012), cl if (i + j) % 2 else es, chanfro=0.0)
grao = plastico('#e9b949', 0.35)
for k, n in enumerate([1, 2, 4, 8]):
    cx = (k - 1.5) * q; cy = -1.5 * q
    for g in range(n):
        if n == 1: x, y = 0, 0
        else:
            a = g * 2 * math.pi / n + 0.3; r = 0.085 if n <= 4 else (0.15 if g % 2 else 0.07)
            x, y = r * math.cos(a), r * math.sin(a)
        o = esfera((cx + x, cy + y, 0.155), 0.055, grao); o.scale = (1.7, 1.0, 0.9); o.rotation_euler = (0, 0, random.uniform(0, 3.14))
fim('M06.1', elev=46, azim=-16)

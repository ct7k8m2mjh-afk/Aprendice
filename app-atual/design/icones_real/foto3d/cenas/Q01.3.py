import sys, os, math, random; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _qui import *
from mathutils import Euler
# Distribuicao eletronica do sodio (Z = 11) em camadas: K = 2, L = 8, M = 1; nucleo com 11 protons e 12 neutrons
cena_q()
mp = plastico('#d62828', 0.22); mn = plastico('#a7adb4', 0.25); me = plastico('#1f5fd6', 0.15); mo = metal('#c9ced6', 0.18)
C = Vector((0, 0, 0.9))
# nucleo: 23 esferas empacotadas
random.seed(2)
tipos = ['p'] * 11 + ['n'] * 12; random.shuffle(tipos)
pts = []
gold = math.pi * (3 - math.sqrt(5))
for i in range(17):
    y = 1 - 2 * (i + 0.5) / 17; rr = math.sqrt(1 - y * y); a = gold * i
    pts.append(Vector((rr * math.cos(a), rr * math.sin(a), y)) * 0.5)
for i in range(6):
    y = 1 - 2 * (i + 0.5) / 6; rr = math.sqrt(1 - y * y); a = gold * i * 1.7
    pts.append(Vector((rr * math.cos(a), rr * math.sin(a), y)) * 0.2)
for t, p in zip(tipos, pts):
    esfera(tuple(C + p), 0.24, mp if t == 'p' else mn, seg=32)
for raio, n, fase in [(1.15, 2, 0.4), (1.8, 8, 0.15), (2.45, 1, -1.2)]:
    toro(tuple(C), raio, 0.04, mo)
    for k in range(n):
        a = fase + 2 * math.pi * k / n
        esfera((C.x + raio * math.cos(a), C.y + raio * math.sin(a), C.z), 0.2, me, seg=32)
render(out('Q01.3'), elev=48)

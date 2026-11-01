from _mat import *
cena()
# pote de vidro cheio de moedas com uma muda brotando: o rendimento que tambem rende (juros compostos)
import random; random.seed(4)
vid = vidro(); ouro = metal('#e0b13a', 0.22); verde = plastico('#3fae49', 0.35); talo = plastico('#4a8f2f', 0.45)
copo((0, 0, 0), 0.5, 1.05, vid, esp=0.03)
toro((0, 0, 1.05), 0.49, 0.03, vid)
z = 0.05
for camada in range(9):
    for k in range(7):
        a = random.uniform(0, 6.28); r = random.uniform(0, 0.3)
        cilindro((r * math.cos(a), r * math.sin(a), z), 0.16, 0.035, ouro, rot=(random.uniform(-0.4, 0.4), random.uniform(-0.4, 0.4), 0), chanfro=0.008)
    z += 0.075
pts = [(0, 0, 0.7), (0.02, 0, 0.95), (-0.03, 0, 1.2), (0.0, 0.0, 1.42)]
curva_tubo(pts, 0.025, talo)
for s, ang in ((1, 35), (-1, -35)):
    f = esfera((0.16 * s, 0, 1.47), 0.17, verde); f.scale = (1.0, 0.55, 0.16); f.rotation_euler = (0, R(-ang), 0)
fim('M03.4', elev=24, azim=-14)

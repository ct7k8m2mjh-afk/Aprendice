# B06.6 heranca quantitativa: distribuicao normal de um carater (ex.: altura) em colunas 3D; varios genes somando efeito
import sys; sys.path[:0] = ['/home/claude/escadas-sc/design/icones_real/foto3d', '/home/claude/escadas-sc/design/icones_real/foto3d/cenas']
from _bk import *
cena()
import random
FN = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
n = 9; cores = ['#1f5fd6', '#2f78e0', '#3d8fe8', '#4aa3ee', '#58b6f2', '#4aa3ee', '#3d8fe8', '#2f78e0', '#1f5fd6']
for k in range(n):
    x = (k - 4) * .34; h = .15 + 1.9 * math.exp(-((k - 4) ** 2) / 5.0)
    caixa((x, 0, h / 2), (.28, .5, h), plastico(cores[k], .28), chanfro=.04)
pts = [((t - 4) * .34, -.28, .2 + 1.9 * math.exp(-((t - 4) ** 2) / 5.0) + .12) for t in [i / 4 for i in range(-2, 35)]]
tubo(pts, .035, plastico('#d62828', .3), tipo='POLY')
caixa((0, 0, -.03), (3.4, .7, .06), plastico('#e9e9e6', .4), chanfro=.02)
sai('B06.6', elev=18, azim=-14)

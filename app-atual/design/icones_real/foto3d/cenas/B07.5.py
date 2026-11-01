# B07.5 sangue: tubos de coleta (tampa roxa = EDTA); um com sangue total e um centrifugado (plasma amarelo ~55%, camada leucoplaquetaria, hemacias ~45%)
import sys; sys.path[:0] = ['/home/claude/escadas-sc/design/icones_real/foto3d', '/home/claude/escadas-sc/design/icones_real/foto3d/cenas']
from _bk import *
cena()
import random
FN = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
vid = vidro('#f7fbff'); roxo = plastico('#7b2cbf', .3); hem = liquido('#a3111a'); pla = liquido('#f2c94c'); buf = plastico('#f3efe6', .5)
rack = plastico('#f2f2ef', .35)
caixa((0, 0, .45), (1.7, .7, .12), rack, chanfro=.03); caixa((0, 0, .03), (1.7, .7, .06), rack, chanfro=.02)
for x in (-.75, .75): caixa((x, 0, .25), (.08, .6, .45), rack, chanfro=.02)
def tubo_col(x, partes):
    c = cilindro((x, 0, 1.0), .2, 1.6, vid, chanfro=.0); esfera((x, 0, .2), .2, vid)
    z = .2
    for h, m in partes:
        cilindro((x, 0, z + h / 2), .175, h, m, chanfro=.0); z += h
    esfera((x, 0, .2), .175, partes[0][1])
    cilindro((x, 0, 1.88), .23, .32, roxo, chanfro=.04)
tubo_col(-.38, [(1.05, hem)])
tubo_col(.38, [(.48, hem), (.04, buf), (.55, pla)])
sai('B07.5', elev=14, azim=-10)

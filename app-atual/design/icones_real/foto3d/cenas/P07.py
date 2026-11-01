# P07 Morfologia: pecas de letras IN + UTIL (prefixo de negacao separado do radical: formacao de palavras)
from _por import *
cena_p()
mad = madeira('#ecd3a6', '#d2b07a', 14, 0.5)
az = plastico('#1f5fd6', 0.3)
esc = plastico('#2a2018', 0.4); bra = plastico('#ffffff', 0.3)
def peca(letra, x, y, rz, corpo, tinta):
    c = caixa((0, 0, 0.09), (0.5, 0.5, 0.18), corpo, chanfro=0.05)
    t = txt(letra, (0, 0.0, 0.183), 0.34, tinta, extr=0.006, fonte=POP, bevel=0.002)
    grupo([c, t], loc=(x, y, 0), rot=(0, 0, math.radians(rz)))
for i, l in enumerate('IN'):
    peca(l, -1.55 + i * 0.56, 0.25 - i * 0.03, 4 - i * 3, az, bra)
for i, l in enumerate('ÚTIL'):
    peca(l, -0.15 + i * 0.56, 0.05 - i * 0.05, -3 + i * 2, mad, esc)
render(saida('P07'), elev=46, azim=-6)

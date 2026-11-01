from _mat import *
cena()
# planificacao do cubo (seis quadrados) sendo dobrada: as abas sobem em volta da base
a = 0.8; e = 0.03
cs = [AZUL, VERM, AMAR, VERDE, LARANJA, ROXO]
def face(c):
    return caixa((0, -a / 2, e / 2), (a - 0.01, a - 0.01, e), plastico(c, 0.32), chanfro=0.008)
caixa((0, 0, e / 2), (a - 0.01, a - 0.01, e), plastico(cs[0], 0.32), chanfro=0.008)
def aba(c, x, y, rz, ang, filhos=()):
    f = face(c); g = grupo([f] + list(filhos), loc=(x, y, 0), rot=(-ang, 0, rz)); return g
aba(cs[1], 0, -a / 2, 0, R(15))               # frente quase aberta
aba(cs[2], a / 2, 0, R(90), R(90))            # direita em pe
aba(cs[3], -a / 2, 0, R(-90), R(60))          # esquerda subindo
tampa = face(cs[5]); gt = grupo([tampa], loc=(0, -a, 0), rot=(R(-40), 0, 0))
f = face(cs[4]); g = grupo([f, gt], loc=(0, a / 2, 0), rot=(-R(90), 0, R(180)))
fim('M11.1', elev=34, azim=-26)

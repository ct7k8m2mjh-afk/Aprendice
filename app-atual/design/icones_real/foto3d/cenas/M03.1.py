from _mat import *
cena()
# placa de 100 quadradinhos com 30 vermelhos (30% = 30/100) e o sinal %
u = 0.17; bandeja = plastico('#2b4f8f', 0.35)
caixa((u * 5 - u / 2, u * 5 - u / 2, 0.03), (u * 10 + 0.08, u * 10 + 0.08, 0.06), bandeja, chanfro=0.025)
def bloco(x0, nx, m):
    o = caixa((x0, 0, 0.09), (u * 0.9, u * 0.9, 0.07), m, chanfro=0.018)
    for eixo, nn in ((0, nx), (1, 10)):
        a = o.modifiers.new('a', 'ARRAY'); a.count = nn; a.use_relative_offset = False; a.use_constant_offset = True
        v = [0, 0, 0]; v[eixo] = u; a.constant_offset_displace = v
bloco(0, 3, plastico(VERM, 0.28)); bloco(3 * u, 7, plastico('#f4f4f0', 0.3))
# sinal de porcentagem em pe
pc = plastico(AZUL, 0.28)
x, y = 2.0, 1.1
toro((x - 0.2, y, 0.78), 0.14, 0.055, pc, rot=(R(90), 0, 0))
toro((x + 0.2, y, 0.22), 0.14, 0.055, pc, rot=(R(90), 0, 0))
bastao((x - 0.3, y, 0.04), (x + 0.3, y, 0.98), 0.06, pc)
fim('M03.1', elev=40, azim=-20)

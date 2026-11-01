from _mat import *
cena()
# material dourado: unidade (10^0), barra (10^1), placa (10^2) e cubo (10^3)
mad = madeira('#e8bf7c', escala=22, rugos=0.45)
u = 0.1; s = u * 0.97
def bloco(loc, nx, ny, nz):
    o = caixa((loc[0] + u / 2, loc[1] + u / 2, loc[2] + u / 2), (s, s, s), mad, chanfro=0.012)
    for eixo, n in ((0, nx), (1, ny), (2, nz)):
        if n > 1:
            a = o.modifiers.new('a', 'ARRAY'); a.count = n; a.use_relative_offset = False; a.use_constant_offset = True
            v = [0, 0, 0]; v[eixo] = u; a.constant_offset_displace = v
    return o
bloco((-0.55, 0.15, 0), 10, 10, 10)     # cubo 1000
bloco((0.62, -0.55, 0), 10, 10, 1)      # placa 100 deitada
bloco((-0.45, -0.62, 0), 10, 1, 1)      # barra 10
bloco((0.20, -0.95, 0), 1, 1, 1)        # unidade 1
fim('M01.3', elev=36, azim=-22)

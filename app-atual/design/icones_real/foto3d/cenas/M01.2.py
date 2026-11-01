from _mat import *
cena()
# zigurate de placas quadradas 4x4, 3x3, 2x2, 1x1 (16, 9, 4, 1 quadradinhos): n^2 e o lado n = raiz
u = 0.3; h = 0.16
cores = [AZUL, VERDE, AMAR, VERM]
for k, n in enumerate([4, 3, 2, 1]):
    m = plastico(cores[k], 0.3)
    x0 = -(n - 1) * u / 2
    o = caixa((x0, x0, h / 2 + k * h), (u * 0.98, u * 0.98, h), m, chanfro=0.03)
    a1 = o.modifiers.new('a', 'ARRAY'); a1.count = n; a1.relative_offset_displace = (1.0 / 0.98, 0, 0)
    a2 = o.modifiers.new('b', 'ARRAY'); a2.count = n; a2.relative_offset_displace = (0, 1.0 / 0.98 * (u * 0.98) / (u * 0.98 * n + 0.0) * 0 + 0, 0)
    a2.use_relative_offset = False; a2.use_constant_offset = True; a2.constant_offset_displace = (0, u, 0)
fim('M01.2', elev=34, azim=-30)

from _mat import *
cena()
# placa quadriculada com eixos e um quadrilatero de acrilico preso por alfinetes em (1,1), (5,2), (4,5), (1,4): area = 11 (formula do cadarco)
N = 900; passo = 150
im, d = papel_quad('M12.5_p', N=N, passo=passo, eixos=(0, 0))
mp = img_mat(salva(im, 'M12.5_p'), rugos=0.6, coat=0.1)
S = 2.1; u = (S - 0.02) / N
caixa((0, 0, 0.02), (S + 0.22, S + 0.22, 0.06), plastico(AZUL, 0.3), chanfro=0.02)
caixa((0, 0, 0.03), (S, S, 0.06), plastico('#f7f7f4', 0.4), chanfro=0.015)
plano_img((0, 0, 0.0605), S - 0.02, S - 0.02, mp)
V = [(1, 1), (5, 2), (4, 5), (1, 4)]
P = [(-S / 2 + 0.01 + x * passo * u, -S / 2 + 0.01 + y * passo * u) for x, y in V]
m = vidro('#ffd0d0'); mb, b = m, m.node_tree.nodes['Principled BSDF']; b.inputs['Base Color'].default_value = cor('#ff6b6b')
b.inputs['Transmission Weight'].default_value = 0.6; b.inputs['Roughness'].default_value = 0.08
prisma(P, 0.065, 0.06, m, chanfro=0.012)
for (x, y) in P:
    cilindro((x, y, 0.15), 0.07, 0.05, metal('#d4a52a', 0.25), chanfro=0.015)
fim('M12.5', elev=46, azim=-12)

from _mat import *
cena()
# cartela de ovos 3 x 4: linhas e colunas, cada casa um elemento a_ij
pol = fosco('#c9c2b4', 0.9); ovo = plastico('#f6efe2', 0.45); ovo2 = plastico('#d9a274', 0.45)
q = 0.42; nl, nc = 3, 4
caixa((0, 0, 0.03), (nc * q + 0.12, nl * q + 0.12, 0.06), pol, chanfro=0.02)
for i in range(nl):
    for j in range(nc):
        x = (j - (nc - 1) / 2) * q; y = (i - (nl - 1) / 2) * q
        copo((x, y, 0.02), 0.11, 0.2, pol, esp=0.02, r_topo=0.19)
        if (i, j) != (0, 3):
            o = esfera((x, y, 0.29), 0.15, ovo if (i + j) % 3 else ovo2); o.scale = (1, 1, 1.3)
for j in range(nc - 1):
    x = (j - (nc - 2) / 2) * q
    cone((x, 0, 0.3), 0.06, 0.03, 0.3, pol)
fim('M15.1', elev=46, azim=-18)

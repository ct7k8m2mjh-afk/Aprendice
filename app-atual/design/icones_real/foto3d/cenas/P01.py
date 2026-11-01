# P01 Leitura e compreensao: livro aberto (capa azul) sobre um livro fechado vermelho
from _por import *
cena_p()
W, H, T = 0.9, 1.25, 0.17
capa = plastico('#1a4fb8', 0.35)
borda = ruido_cor('#e8dfcc', '#f7f2e6', escala=60, rugos=0.9)
livro_fechado((0.05, 0.05, 0), 2.0, 1.45, 0.24, plastico('#c92a2a', 0.4), rot_z=math.radians(-8))
pags = []
for lado, sd in ((1, 7), (-1, 3)):
    pm = imagem_mat(tex_linhas('P01_%d' % sd, seed=sd, fundo=(250, 247, 239)), rugos=0.8)
    def f(x, y, lado=lado):
        u = (x + W / 2) / W if lado == 1 else (W / 2 - x) / W
        return 0.05 + T * (1 - (1 - u) ** 4) - 0.03 * u ** 6
    pags.append(folha_grade(W, H, 80, 6, f, pm, loc=(lado * (W / 2 + 0.008), 0, 0), esp=T * 0.95, borda=borda))
    pags.append(caixa((lado * (W / 2 + 0.035), 0, 0.022), (W + 0.07, H + 0.09, 0.04), capa, chanfro=0.014))
pags.append(cilindro((0, 0, 0.03), 0.055, H + 0.09, capa, rot=(math.radians(90), 0, 0)))
pags.append(bez([(0.0, 0.55, 0.07), (0.04, 0.64, 0.06), (0.08, 0.68, 0.02), (0.12, 0.74, 0.004)], 0.012, fosco('#f2b705', 0.45)))
grupo(pags, loc=(0, 0, 0.245), rot=(0, 0, math.radians(6)))
render(saida('P01'), elev=36, azim=-16)

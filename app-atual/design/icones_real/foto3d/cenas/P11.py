# P11 Literatura do Barroco ao Simbolismo: pena de escrever no tinteiro de vidro sobre papel antigo
from _por import *
cena_p()
tx = tex_linhas('P11', linhas=14, seed=12, fundo=(236, 218, 180), cor_txt=(90, 60, 35))
folha_grade(1.5, 1.2, 30, 20, lambda x, y: 0.03 * math.sin(x * 2.5) + 0.04 * max(0, x - 0.5) ** 2 * 8, imagem_mat(tx, 0.85), loc=(0, 0.1, 0.03), esp=0.012, rot=(0, 0, math.radians(-10)))
vid = vidro('#e6f0f6', 0.02)
tin = caixa((-0.15, 0.1, 0.28), (0.56, 0.56, 0.5), vid, chanfro=0.07)
caixa((-0.15, 0.1, 0.2), (0.46, 0.46, 0.3), plastico('#0d0d1a', 0.1), chanfro=0.04)
torno([(0, 0), (0.15, 0), (0.15, 0.1), (0.13, 0.12), (0, 0.12)], metal('#d4a52a', 0.25), loc=(-0.15, 0.1, 0.52))
torno([(0.12, 0.12), (0.15, 0.12), (0.15, 0.14), (0.12, 0.14)], metal('#d4a52a', 0.25), loc=(-0.15, 0.1, 0.52))
pn = pena(1.7, 0.36, '#f4efe4', nome='p11', curva=0.18)
g = grupo(pn, loc=(-0.15, 0.1, 0.25), rot=(math.radians(-30), math.radians(28), math.radians(-30)))
render(saida('P11'), elev=24, azim=-14)

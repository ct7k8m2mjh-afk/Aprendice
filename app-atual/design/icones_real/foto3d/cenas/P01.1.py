# P01.1 tema/tese: folha impressa com a frase central grifada em amarelo + marca-texto amarelo
# revisao 31/10: folha menor e marca-texto bem maior, atravessando a folha na diagonal (o objeto principal deixa de ficar pequeno)
from _por import *
cena_p()
tx = tex_linhas('P01_1', linhas=12, grifo=(4, 5), seed=5, fundo=(252, 250, 244), cor_txt=(60, 60, 70))
def f(x, y): return 0.02 * math.sin((x + 0.7) * 2.2) + 0.03 * max(0, (y - 0.7)) * 4
folha_grade(0.95, 1.25, 40, 40, f, imagem_mat(tx, 0.85), loc=(0, 0, 0.07), rot=(0, 0, math.radians(8)), esp=0.07, borda=ruido_cor('#e6e1d4', '#f7f4ec', 90, 0.9))
corpo = plastico('#f5c400', 0.3)
mk = []
mk.append(caixa((0, 0, 0), (1.0, 0.24, 0.17), corpo, chanfro=0.07))
mk.append(caixa((0.62, 0, 0), (0.28, 0.25, 0.18), plastico('#2b2b2b', 0.35), chanfro=0.07))     # tampa preta? nao: tampa amarela escura
mk[-1].data.materials[0] = plastico('#e0a800', 0.3)
mk.append(caixa((0.79, 0, 0), (0.06, 0.2, 0.14), plastico('#e0a800', 0.3), chanfro=0.03))
# ponta chanfrada (feltro) saindo do lado esquerdo
mk.append(placa([(0, -0.07), (0.16, -0.07), (0.16, 0.07), (0.04, 0.07)], 0.12, fosco('#ffd21a', 0.8), loc=(-0.66, 0.06, -0.06), rot=(math.radians(90), 0, 0), chanfro=0.01))
mk.append(caixa((-0.53, 0, 0), (0.08, 0.2, 0.14), plastico('#2b2b2b', 0.4), chanfro=0.03))
grupo(mk, loc=(0.24, -1.0, 0.62), rot=(0, math.radians(-22), math.radians(-98)), escala=1.6)  # ponta no fim do grifo
render(saida('P01.1'), elev=42, azim=-12, tam=640)  # tam maior: o objeto ocupa pouco do quadro automatico, evita ampliar e borrar

# P03.1 tipos textuais: maco de folhas com divisorias de quatro cores (narrar, descrever, dissertar, instruir)
from _por import *
cena_p()
pap = papel('#f8f6f0'); bord = ruido_cor('#e9e5da', '#f8f6ef', 90, 0.9)
cores = ['#d62828', '#f2b705', '#2e9e44', '#1f5fd6']
z = 0.0
for i in range(4):
    caixa((0, 0, z + 0.07), (1.4, 1.8, 0.14), bord, chanfro=0.006); z += 0.14
    tab_y = 0.6 - i * 0.4
    pol = arred(1.4, 1.8, 0.02, 2)
    d = placa([(-0.7, -0.9), (0.7, -0.9), (0.7, tab_y - 0.17), (0.86, tab_y - 0.14), (0.86, tab_y + 0.14), (0.7, tab_y + 0.17), (0.7, 0.9), (-0.7, 0.9)], 0.025, plastico(cores[i], 0.35), loc=(0, 0, z), chanfro=0.006)
    z += 0.025
caixa((0, 0, z + 0.03), (1.4, 1.8, 0.06), bord, chanfro=0.006)
folha_grade(1.4, 1.8, 2, 2, lambda x, y: 0, imagem_mat(tex_linhas('P03_1', linhas=20, seed=2, titulo=True), 0.85), loc=(0, 0, z + 0.062))
g = grupo([o for o in bpy.context.scene.objects if o.parent is None and o.name not in ('CHAO', 'KEY', 'FILL')], rot=(0, 0, math.radians(-62)))
render(saida('P03.1'), elev=38, azim=-30)

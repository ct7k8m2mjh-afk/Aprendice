# P08 Periodo simples: caderno espiral pautado com uma frase curta manuscrita e um lapis amarelo
from _por import *
cena_p()
def desenha(d, im):
    W, H = im.size
    for k in range(18): d.line([0, 150 + k * 62, W, 150 + k * 62], fill=(150, 185, 225), width=4)
    d.line([150, 0, 150, H], fill=(225, 90, 90), width=5)
    d.text((180, 270), 'O sol nasceu.', fill=(25, 45, 120), font=fonte_pil(84, '/usr/share/fonts/truetype/dejavu/DejaVuSerif-Italic.ttf'), anchor='ls')
tx = tex_desenho('P08', 900, 1250, (253, 252, 248, 255), desenha)
from PIL import Image; Image.open(tx).convert('RGB').save(tx)
caixa((0, 0, 0.02), (1.32, 1.82, 0.04), plastico('#1f5fd6', 0.4), chanfro=0.01)
caixa((0.02, 0, 0.065), (1.26, 1.76, 0.05), ruido_cor('#ebe7dd', '#f8f6f0', 90, 0.9), chanfro=0.004)
folha_grade(1.26, 1.76, 2, 2, lambda x, y: 0, imagem_mat(tx, 0.85), loc=(0.02, 0, 0.0905))
aco = metal('#c7cbd1', 0.2)
for k in range(15):
    toro((-0.63, -0.8 + k * 0.115, 0.07), 0.07, 0.012, aco, rot=(math.radians(90), 0, 0))
ob = []
ob.append(cilindro((0, 0, 0), 0.06, 1.3, plastico('#f2b705', 0.35), vert=6, rot=(0, math.radians(90), 0), chanfro=0.006))
ob.append(cone((0.65 + 0.09, 0, 0), 0.056, 0.018, 0.18, madeira('#e8c28f', '#c99a62', 20), rot=(0, math.radians(90), 0)))
ob.append(cone((0.65 + 0.2, 0, 0), 0.019, 0.0, 0.05, plastico('#333338', 0.4), rot=(0, math.radians(90), 0)))
ob.append(cilindro((-0.7, 0, 0), 0.062, 0.1, metal('#c9a227', 0.3), rot=(0, math.radians(90), 0)))
ob.append(cilindro((-0.8, 0, 0), 0.058, 0.12, plastico('#e88aa0', 0.6), rot=(0, math.radians(90), 0), chanfro=0.02))
grupo(ob, loc=(0.25, -0.25, 0.155), rot=(0, 0, math.radians(-35)))
render(saida('P08'), elev=50, azim=-8)

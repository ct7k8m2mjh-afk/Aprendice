# P03 Generos e tipos textuais: jornal dobrado (manchete, colunas e foto): o genero com forma propria
from _por import *
cena_p()
def desenha(d, im):
    W, H = im.size
    d.text((W / 2, 95), 'DIÁRIO', fill=(25, 25, 30), font=fonte_pil(150, SERIF), anchor='mm')
    d.rectangle([50, 185, W - 50, 192], fill=(25, 25, 30)); d.rectangle([50, 200, W - 50, 203], fill=(25, 25, 30))
    for k in range(2): d.rectangle([60, 240 + k * 70, W - 60 - k * 250, 290 + k * 70], fill=(30, 30, 35))
    d.rectangle([60, 400, 560, 760], fill=(70, 120, 175)); d.ellipse([340, 450, 470, 580], fill=(242, 190, 60))
    d.polygon([(60, 760), (250, 560), (420, 760)], fill=(46, 120, 70)); d.polygon([(260, 760), (430, 610), (560, 760)], fill=(35, 95, 55))
    import random; random.seed(4)
    for col, (x0, x1, y0) in enumerate(((600, W - 60, 400), (60, 330, 800), (360, 640, 800), (670, W - 60, 800))):
        y = y0
        while y < H - 50:
            d.rectangle([x0, y, x1 - (random.randint(0, 80) if random.random() < .2 else 0), y + 12], fill=(120, 120, 125)); y += 30
tx = tex_desenho('P03', 1000, 1300, (236, 233, 224, 255), desenha)
from PIL import Image; Image.open(tx).convert('RGB').save(tx)
def f(x, y): return 0.04 * (1 - (x / 0.75) ** 2) + 0.025 * math.sin(y * 2.5)
folha_grade(1.5, 1.95, 40, 40, f, imagem_mat(tx, 0.9), loc=(0, 0, 0.06), esp=0.06, borda=ruido_cor('#d9d4c6', '#ebe7dc', 90, 0.9), rot=(0, 0, math.radians(-8)))
# dobra (lombada arredondada do jornal dobrado ao meio) na lateral esquerda
c = cilindro((-0.75, 0, 0.035), 0.035, 1.95, fosco('#e3dfd3', 0.9), rot=(math.radians(90), 0, 0)); grupo([c], rot=(0, 0, math.radians(-8)))
render(saida('P03'), elev=50, azim=-12)

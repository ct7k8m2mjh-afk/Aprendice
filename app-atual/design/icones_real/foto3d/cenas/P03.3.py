# P03.3 charge, tirinha e cartaz: revista em quadrinhos aberta numa pagina de quadros coloridos com baloes de fala
from _por import *
cena_p()
def desenha(d, im):
    W, H = im.size; pr = (20, 20, 25)
    # quadro 1: dia, morro e casa
    d.rectangle([40, 40, 470, 520], fill=(120, 190, 240)); d.ellipse([340, 80, 440, 180], fill=(250, 205, 60))
    d.ellipse([-60, 380, 600, 760], fill=(70, 170, 80)); d.rectangle([150, 330, 300, 450], fill=(230, 80, 60)); d.polygon([(130, 335), (225, 260), (320, 335)], fill=(150, 50, 40))
    d.rectangle([200, 380, 245, 450], fill=(120, 70, 40))
    # quadro 2: noite com lua e estrelas
    d.rectangle([500, 40, 960, 520], fill=(40, 50, 110)); d.ellipse([760, 90, 880, 210], fill=(245, 240, 200)); d.ellipse([735, 80, 845, 190], fill=(40, 50, 110))
    import random; random.seed(5)
    for _ in range(18):
        x, y = random.randint(520, 940), random.randint(60, 500); d.ellipse([x, y, x + 9, y + 9], fill=(255, 250, 220))
    # quadro 3: onomatopeia
    d.rectangle([40, 550, 960, 1060], fill=(250, 210, 70))
    pts = []
    for k in range(24):
        a = 2 * math.pi * k / 24; r = 330 if k % 2 == 0 else 200; pts.append((500 + r * math.cos(a), 805 + r * 0.7 * math.sin(a)))
    d.polygon(pts, fill=(230, 60, 50), outline=pr)
    d.text((500, 805), 'POW!', fill=(255, 255, 255), font=fonte_pil(150, POP), anchor='mm', stroke_width=6, stroke_fill=pr)
    for (x0, y0, x1, y1) in ((40, 40, 470, 520), (500, 40, 960, 520), (40, 550, 960, 1060)):
        d.rectangle([x0, y0, x1, y1], outline=pr, width=10)
    f = fonte_pil(54, POP)
    for (x0, y0, x1, y1, s, tx, ty) in ((70, 60, 330, 200, 'Oi!', 150, 280), (530, 300, 900, 460, 'Boa noite!', 640, 510)):
        d.ellipse([x0, y0, x1, y1], fill=(255, 255, 255), outline=pr, width=7)
        d.polygon([((x0 + x1) / 2 - 25, y1 - 12), ((x0 + x1) / 2 + 25, y1 - 12), (tx, ty)], fill=(255, 255, 255), outline=pr)
        d.line([((x0 + x1) / 2 - 22, y1 - 4), ((x0 + x1) / 2 + 22, y1 - 4)], fill=(255, 255, 255), width=10)
        d.text(((x0 + x1) / 2, (y0 + y1) / 2), s, fill=pr, font=f, anchor='mm')
tx = tex_desenho('P03_3', 1000, 1100, (252, 250, 245, 255), desenha)
from PIL import Image; Image.open(tx).convert('RGB').save(tx)
def f(x, y): return 0.03 * (1 - (x / 0.7) ** 2)
folha_grade(1.4, 1.54, 30, 30, f, imagem_mat(tx, 0.6), loc=(0, 0, 0.05), esp=0.05, borda=ruido_cor('#e8e4da', '#f6f3ec', 90, 0.9), rot=(0, 0, math.radians(-18)))
# grampos na lombada esquerda
for y in (-0.35, 0.35):
    caixa((-0.66, y, 0.105), (0.02, 0.16, 0.012), metal('#c9ccd2', 0.25), chanfro=0.004).parent = None
render(saida('P03.3'), elev=40, azim=-12)

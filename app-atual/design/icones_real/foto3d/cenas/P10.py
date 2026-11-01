# P10 Norma e emprego: folha corrigida a caneta vermelha (palavra riscada, crase inserida, sinal de certo) e a caneta
from _por import *
cena_p()
def desenha(d, im):
    W, H = im.size
    f = fonte_pil(62, '/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf'); fi = fonte_pil(60, '/usr/share/fonts/truetype/dejavu/DejaVuSerif-Italic.ttf')
    vm = (214, 30, 40); tc = (40, 45, 70)
    lin = ['Fui a escola cedo', 'e encontrei muitos', 'amigos na entrada.', 'Haviam três aulas', 'de manhã.']
    ys = [200 + k * 150 for k in range(5)]
    for t, y in zip(lin, ys): d.text((80, y), t, fill=tc, font=f, anchor='ls')
    # crase: acento grave em vermelho sobre o "a" (Fui a -> Fui à)
    xa = 80 + f.getlength('Fui '); wa = f.getlength('a')
    d.line([(xa + wa * 0.25, ys[0] - 62), (xa + wa * 0.7, ys[0] - 40)], fill=vm, width=9)
    d.ellipse([xa - 18, ys[0] - 75, xa + wa + 18, ys[0] + 14], outline=vm, width=6)
    # "Haviam" riscado, "Havia" escrito acima
    wh = f.getlength('Haviam')
    d.line([(74, ys[3] - 20), (86 + wh, ys[3] - 26)], fill=vm, width=9)
    d.text((86, ys[3] - 72), 'Havia', fill=vm, font=fi, anchor='ls')
    # sinal de certo
    d.line([(600, 960), (670, 1040)], fill=vm, width=18); d.line([(670, 1040), (820, 850)], fill=vm, width=18)
tx = tex_desenho('P10', 900, 1150, (252, 250, 244, 255), desenha)
from PIL import Image; Image.open(tx).convert('RGB').save(tx)
def f(x, y): return 0.02 * math.sin(x * 2 + 0.5)
folha_grade(1.3, 1.66, 30, 30, f, imagem_mat(tx, 0.85), loc=(0, 0, 0.05), esp=0.05, borda=ruido_cor('#e6e1d4', '#f7f4ec', 90, 0.9), rot=(0, 0, math.radians(6)))
ob = []
ob.append(cilindro((0, 0, 0), 0.06, 1.0, plastico('#f4f4f6', 0.25), rot=(0, math.radians(90), 0), chanfro=0.02))
ob.append(cilindro((-0.36, 0, 0), 0.066, 0.36, plastico('#d62828', 0.3), rot=(0, math.radians(90), 0), chanfro=0.03))
ob.append(caixa((-0.36, 0, 0.08), (0.3, 0.03, 0.03), plastico('#d62828', 0.3), chanfro=0.01))
ob.append(cone((0.58, 0, 0), 0.058, 0.02, 0.16, plastico('#f4f4f6', 0.25), rot=(0, math.radians(90), 0)))
ob.append(cone((0.68, 0, 0), 0.02, 0.004, 0.05, metal('#c7cbd1', 0.2), rot=(0, math.radians(90), 0)))
ob.append(cilindro((-0.56, 0, 0), 0.06, 0.03, plastico('#d62828', 0.3), rot=(0, math.radians(90), 0), chanfro=0.01))
grupo(ob, loc=(0.35, -0.55, 0.17), rot=(0, 0, math.radians(30)))
render(saida('P10'), elev=50, azim=-8)

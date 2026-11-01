# P10.2 regencia e crase: batuta de maestro sobre a partitura (o verbo "rege" o complemento)
# revisao 31/10 (2a rodada): a partitura branca deitada sumia no fundo; agora na estante preta de partitura, com a batuta apoiada
from _por import *
cena_p()
def desenha(d, im):
    W, H = im.size; pr = (25, 25, 30)
    import random; random.seed(3)
    for s in range(4):
        y0 = 140 + s * 260
        for k in range(5): d.line([60, y0 + k * 26, W - 60, y0 + k * 26], fill=pr, width=4)
        d.text((70, y0 + 52), '♫', fill=pr, font=fonte_pil(10, POP))
        x = 170
        while x < W - 120:
            p = random.randint(-2, 8); y = y0 + 104 - p * 13
            d.ellipse([x - 20, y - 14, x + 20, y + 14], fill=pr)
            d.line([x + 18, y, x + 18, y - 100], fill=pr, width=5)
            if random.random() < 0.4: d.line([x + 18, y - 100, x + 48, y - 70], fill=pr, width=8)
            x += random.randint(80, 120)
        d.line([W - 60, y0, W - 60, y0 + 104], fill=pr, width=6)
tx = tex_desenho('P10_2', 900, 1200, (250, 245, 232, 255), desenha)
from PIL import Image; Image.open(tx).convert('RGB').save(tx)
ferro = plastico('#1c1e23', 0.35)
inc = math.radians(68)    # inclinacao da prancha
ob = []
ob.append(caixa((0, 0, 0), (1.6, 1.95, 0.05), ferro, chanfro=0.02))
ob.append(folha_grade(1.36, 1.8, 2, 2, lambda x, y: 0, imagem_mat(tx, 0.8), loc=(0, 0.02, 0.028)))
ob.append(caixa((0, -1.0, 0.07), (1.6, 0.08, 0.16), ferro, chanfro=0.02))    # aba de apoio
g = grupo(ob, loc=(0, 0, 2.05), rot=(inc, 0, 0))
aco = metal('#30333a', 0.3)
cilindro((0, 0.35, 1.0), 0.045, 1.9, aco, chanfro=0.005)
for k in range(3):
    a = math.radians(-90 + 120 * k); bastao((0, 0.35, 0.35), (0.75 * math.cos(a), 0.35 + 0.75 * math.sin(a), 0.02), 0.035, aco)
# batuta apoiada na aba da estante
bt = [cone((0.62, 0, 0), 0.022, 0.006, 1.25, plastico('#f8f8fa', 0.2), rot=(0, math.radians(90), 0)),
      torno([(0, 0), (0.05, 0), (0.07, 0.08), (0.07, 0.22), (0.035, 0.32), (0.03, 0.36), (0, 0.36)], ruido_cor('#b88a5a', '#d6ab78', 30, 0.6), rot=(0, math.radians(-90), 0), loc=(0.0, 0, 0))]
gb = grupo(bt, loc=(-0.05, -0.33, 1.5))
from mathutils import Matrix
gb.rotation_euler = (Matrix.Rotation(inc, 3, 'X') @ Matrix.Rotation(math.radians(24), 3, 'Z')).to_euler()  # deitada sobre a partitura, na diagonal
render(saida('P10.2'), elev=12, azim=-16)

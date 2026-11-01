# P03.4 divulgacao cientifica e texto digital: tablet com uma materia de ciencia (Saturno) na tela, apoiado num suporte
from _por import *
cena_p()
def desenha(d, im):
    W, H = im.size
    d.rectangle([0, 0, W, 560], fill=(12, 16, 40))
    import random; random.seed(2)
    for _ in range(80):
        x, y = random.randint(0, W), random.randint(0, 540); d.ellipse([x, y, x + 4, y + 4], fill=(230, 230, 255))
    cx, cy = W // 2, 280
    d.ellipse([cx - 330, cy - 70, cx + 330, cy + 70], outline=(210, 180, 130), width=26)
    d.ellipse([cx - 150, cy - 150, cx + 150, cy + 150], fill=(222, 190, 130))
    for k, c in enumerate(((200, 160, 100), (235, 210, 160), (190, 150, 95))):
        d.rectangle([cx - 145, cy - 60 + k * 45, cx + 145, cy - 40 + k * 45], fill=c)
    d.ellipse([cx - 150, cy - 150, cx + 150, cy + 150], outline=(222, 190, 130), width=1)
    d.arc([cx - 330, cy - 70, cx + 330, cy + 70], 0, 180, fill=(225, 195, 140), width=26)
    d.text((60, 600), 'Os anéis de Saturno', fill=(25, 25, 35), font=fonte_pil(62, POP))
    for k in range(7): d.rectangle([60, 720 + k * 50, W - 60 - (200 if k == 6 else 0), 740 + k * 50], fill=(140, 140, 150))
tx = tex_desenho('P03_4', 900, 1200, (250, 250, 252, 255), desenha)
from PIL import Image; Image.open(tx).convert('RGB').save(tx)
ob = []
ob.append(placa(arred(1.2, 1.6, 0.12, 12), 0.07, plastico('#26262b', 0.3), chanfro=0.03, seg_ch=5))
ob.append(folha_grade(1.08, 1.44, 2, 2, lambda x, y: 0, imagem_mat(tx, 0.15, emis=0.25), loc=(0, 0, 0.0705)))
g = grupo(ob, loc=(0, 0, 0.0), rot=(math.radians(62), 0, 0))
g.rotation_mode = 'XYZ'
no_chao(g)
pe = caixa((0, 0.42, 0.42), (0.5, 0.05, 0.9), plastico('#2a2a30', 0.4), chanfro=0.02, rot=(math.radians(25), 0, 0))
grupo([g, pe], rot=(0, 0, math.radians(-16)))
render(saida('P03.4'), elev=24, azim=-14)

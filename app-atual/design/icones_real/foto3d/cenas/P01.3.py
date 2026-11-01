# P01.3 titulo, fonte, data e paratexto: calendario de mesa com a data em destaque (a data e o suporte como pistas de leitura)
from _por import *
cena_p()
def desenha(d, im):
    W, H = im.size
    d.rectangle([0, 0, W, 300], fill=(214, 40, 40))
    d.text((W / 2, 160), 'OUTUBRO', fill=(255, 255, 255), font=fonte_pil(120, POP), anchor='mm')
    d.text((W / 2, 640), '30', fill=(30, 30, 38), font=fonte_pil(440, POP), anchor='mm')
    d.text((W / 2, 950), 'SEXTA-FEIRA', fill=(110, 110, 120), font=fonte_pil(80, POP), anchor='mm')
tx = tex_desenho('P01_3', 900, 1060, (252, 250, 245, 255), desenha)
from PIL import Image; Image.open(tx).convert('RGB').save(tx)
# base triangular (cavalete) de papelao
base_m = plastico('#2b2b30', 0.4)
ang = math.radians(70)
fr = []
fr.append(folha_grade(0.9, 1.06, 2, 2, lambda x, y: 0, imagem_mat(tx, 0.7), loc=(0, 0, 0.0)))
fr.append(caixa((0, 0, -0.012), (0.94, 1.1, 0.02), base_m, chanfro=0.008))
for k in range(5): fr.append(caixa((0, 0, -0.024 - k * 0.006), (0.9, 1.06, 0.005), papel('#efece4'), chanfro=0.0))
for x in (-0.3, -0.1, 0.1, 0.3): fr.append(toro((x, 0.55, -0.01), 0.035, 0.008, metal('#c7cbd1', 0.2), rot=(0, math.radians(90), 0)))
g = grupo(fr, loc=(0, 0, 0.5 * math.sin(ang) + 0.01), rot=(ang, 0, 0))
caixa((0, 0.4, 0.47), (0.94, 0.02, 1.0), base_m, chanfro=0.01, rot=(math.radians(25), 0, 0))
grupo([g] + [o for o in bpy.context.scene.objects if o.name.startswith('Cube') and o.parent is None], rot=(0, 0, math.radians(-32)))
no_chao([o for o in bpy.context.scene.objects if o.parent is None and o.type in ('EMPTY',)])
render(saida('P01.3'), elev=24, azim=-14)

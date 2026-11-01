# P07.2 pronomes: crachas de identificacao "OLÁ" com o pronome no lugar do nome.
# revisao 31/10: tres crachas em leque (ELE verde atras, TU azul no meio, EU vermelho na frente) -> as pessoas do discurso;
# cracha com moldura plastica colorida e grossa (antes era um cartao branco chapado sobre o branco).
from _por import *
from PIL import Image
cena_p()
def cracha(nome, palavra, rgb, hexa, loc, rz, tilt=10):
    def desenha(d, im):
        W, H = im.size
        d.rectangle([0, 0, W - 1, 230], fill=rgb)
        d.text((W / 2, 115), 'OLÁ', fill=(255, 255, 255), font=fonte_pil(140, POP), anchor='mm')
        d.text((W / 2, 470), palavra, fill=(28, 30, 38), font=fonte_pil(250, POP), anchor='mm')
    tx = tex_desenho('P07_2' + nome, 1000, 680, (255, 255, 255, 255), desenha); Image.open(tx).convert('RGB').save(tx)
    ob = [placa(arred(1.62, 1.14, 0.1, 8), 0.07, plastico(hexa, 0.3), chanfro=0.02)]
    ob.append(folha_grade(1.48, 1.0, 2, 2, lambda x, y: 0, imagem_mat(tx, 0.45), loc=(0, 0, 0.072)))
    ob.append(caixa((0, 0.66, 0.05), (0.26, 0.24, 0.04), metal('#c7cbd1', 0.2), chanfro=0.012))
    ob.append(toro((0, 0.82, 0.05), 0.08, 0.016, metal('#c7cbd1', 0.2), rot=(0, math.radians(90), 0)))
    return grupo(ob, loc=loc, rot=(math.radians(tilt), 0, math.radians(rz)))
cracha('c', 'ELE', (46, 158, 68), '#2e9e44', (0.55, 0.75, 0.0), -24, 8)
cracha('b', 'TU', (31, 95, 214), '#1f5fd6', (0.25, 0.35, 0.12), -14, 9)
cracha('a', 'EU', (214, 40, 40), '#d62828', (0.0, -0.05, 0.24), -4, 10)
render(saida('P07.2'), elev=48, azim=-8)

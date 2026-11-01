# P10.4 pontuacao: teclas de teclado com os sinais de pontuacao.
# revisao 31/10: era ilegivel (teclas brancas com sinais pequenos). Agora 2 x 2 teclas grandes e coloridas, sinal branco impresso
# grande no topo, sobre um pedaco de teclado escuro: virgula (amarela), ponto e virgula (azul), dois-pontos (vermelha), travessao (verde).
import sys, os; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _por import *
import _mat
from PIL import Image, ImageDraw, ImageFont
cena_p()
U = 0.92
def glifo(sim, nome):
    big = Image.new('RGBA', (1400, 1400), (0, 0, 0, 0)); d = ImageDraw.Draw(big)
    d.text((700, 700), sim, font=ImageFont.truetype(POP if sim == '—' else SERIF, 600 if sim == '—' else 760), fill=(255, 255, 255, 255), anchor='mm')
    g = big.crop(big.getbbox()); k = min(1.0, 340 / g.height, 400 / g.width); g = g.resize((max(1, int(g.width * k)), max(1, int(g.height * k))), Image.LANCZOS); im = Image.new('RGBA', (512, 512), (0, 0, 0, 0))
    im.alpha_composite(g, ((512 - g.width) // 2, (512 - g.height) // 2))
    return _mat.img_mat(_mat.salva(im, 'P104_' + nome), rugos=0.35, alpha=True)
def tecla(sim, nome, x, y, hexa):
    m = plastico(hexa, 0.3)
    k = caixa((x, y, 0.2 + 0.2), (U * 0.9, U * 0.9, 0.4), m, chanfro=0.07)
    for v in k.data.vertices:
        if v.co.z > 0.4: v.co.x = x + (v.co.x - x) * 0.8; v.co.y = y + (v.co.y - y) * 0.8 + 0.03
    _mat.plano_img((x, y - 0.01, 0.606), U * 0.6, U * 0.6, glifo(sim, nome))
caixa((0, 0, 0.1), (2 * U + 0.3, 2 * U + 0.3, 0.2), plastico('#2a2d34', 0.45), chanfro=0.06)
tecla(',', 'virg', -U / 2, U / 2, '#f2b705')
tecla(';', 'pv', U / 2, U / 2, '#1f5fd6')
tecla(':', 'dp', -U / 2, -U / 2, '#d62828')
tecla('—', 'trav', U / 2, -U / 2, '#2e9e44')
render(saida('P10.4'), elev=44, azim=-16)

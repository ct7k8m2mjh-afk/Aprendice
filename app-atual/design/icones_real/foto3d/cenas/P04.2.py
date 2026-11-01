# P04.2 conjuncoes e relacoes logicas: ponte de pedra em arco ligando as duas margens de um riacho (a conjuncao liga as oracoes
# e estabelece a relacao entre elas). Revisao 31/10: antes parecia um monte de blocos empilhados; agora uma ponte de verdade:
# arco de pedras em cunha (aduelas), fiadas de pedra, tabuleiro levemente abaulado e a agua azul passando por baixo.
import sys, os, random; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _por import *
import _mat
from PIL import Image, ImageDraw
cena_p()
W, HB, R, R2, D = 3.0, 1.45, 0.78, 1.08, 0.95
def topo(x): return HB + 0.14 * math.cos(math.pi * x / W)
# contorno da ponte (vista de frente, plano XZ) com o vao do arco
n = 40
cont = [(-W / 2, 0.0), (-R, 0.0)] + [(-R * math.cos(math.pi * k / n), R * math.sin(math.pi * k / n)) for k in range(1, n)] + [(R, 0.0), (W / 2, 0.0)]
cont += [(W / 2 - W * k / 30, topo(W / 2 - W * k / 30)) for k in range(31)]
corpo = placa(cont, D, ruido_cor('#b9ab92', '#cfc3ab', 6, 0.8), chanfro=0.03)
corpo.rotation_euler = (math.radians(90), 0, 0); corpo.location = (0, D, 0)
# textura das pedras (frente e verso)
S = 420; IW, IH = int(W * S), int((HB + 0.2) * S)
im = Image.new('RGBA', (IW, IH), (0, 0, 0, 0)); d = ImageDraw.Draw(im); random.seed(4)
def px(x, z): return ((x + W / 2) * S, IH - z * S)
def pedra(): v = random.randint(-18, 14); return (176 + v, 162 + v, 136 + v, 255)
arg = (110, 98, 84, 255)
z = 0.0; fil = 0
while z < HB + 0.2:
    h = 0.2; x = -W / 2 - random.uniform(0, 0.3) * (fil % 2)
    while x < W / 2:
        l = random.uniform(0.32, 0.5)
        d.rectangle([*px(x, z + h), *px(x + l, z)], fill=pedra(), outline=arg, width=7)
        x += l
    z += h; fil += 1
# aduelas em cunha em volta do arco
na = 13
for k in range(na):
    a0 = math.pi * k / na; a1 = math.pi * (k + 1) / na
    poly = [px(-R * math.cos(a0), R * math.sin(a0)), px(-R2 * math.cos(a0), R2 * math.sin(a0)), px(-R2 * math.cos((a0 + a1) / 2), R2 * math.sin((a0 + a1) / 2)),
            px(-R2 * math.cos(a1), R2 * math.sin(a1)), px(-R * math.cos(a1), R * math.sin(a1))]
    v = random.randint(-10, 10); d.polygon(poly, fill=(160 + v, 146 + v, 122 + v, 255), outline=arg, width=7)
# recorta: vao do arco e acima do tabuleiro ficam transparentes
mk = Image.new('L', (IW, IH), 0); dm = ImageDraw.Draw(mk); dm.polygon([px(x, z) for x, z in cont], fill=255)
im.putalpha(Image.composite(im.getchannel('A'), Image.new('L', (IW, IH), 0), mk))
mat = _mat.img_mat(_mat.salva(im, 'P042_pedras'), rugos=0.8, alpha=True)
for y, rz in ((-0.004, 0), (D + 0.004, math.pi)):
    p = _mat.plano_img((0, y, (HB + 0.2) / 2), W, HB + 0.2, mat, rot=(math.radians(90), 0, rz))
# parapeitos
mp = ruido_cor('#a99c84', '#c2b69e', 6, 0.8)
for y in (0.06, D - 0.06):
    pts = [(x, topo(x)) for x in [-W / 2 + W * k / 30 for k in range(31)]]
    par = placa(pts + [(x, z + 0.2) for x, z in reversed(pts)], 0.12, mp, chanfro=0.02)
    par.rotation_euler = (math.radians(90), 0, 0); par.location = (0, y + 0.06, 0)
# agua passando sob o arco + margens de grama
agua = caixa((0, D / 2, 0.03), (2 * R - 0.05, D + 1.6, 0.06), plastico('#2f7fe0', 0.08), chanfro=0.02)
for s_ in (-1, 1):
    caixa((s_ * (W / 2 + 0.1), D / 2, 0.04), (0.5, D + 1.6, 0.08), fosco('#4f9d3a', 0.7), chanfro=0.03)
    caixa((s_ * (R + 0.35), D / 2, 0.035), (0.7, D + 1.6, 0.07), fosco('#5aa843', 0.7), chanfro=0.03)
render(saida('P04.2'), elev=26, azim=-32)

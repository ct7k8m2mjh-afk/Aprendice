from _mat import *
cena()
# azulejo quadrado com quarto de circulo de raio L/2 em cada canto; a regiao central hachurada tem area L^2 - pi (L/2)^2
N = 900; im, d = tex('azul', N, N, (250, 250, 246, 255))
r = N // 2
for (cx, cy) in ((0, 0), (N, 0), (0, N), (N, N)):
    d.ellipse((cx - r, cy - r, cx + r, cy + r), fill=(31, 95, 214, 255))
# hachura na regiao central (fora dos quatro quartos de circulo)
import numpy as np
A = np.array(im)
yy, xx = np.mgrid[0:N, 0:N]
fora = np.ones((N, N), bool)
for (cx, cy) in ((0, 0), (N, 0), (0, N), (N, N)): fora &= (xx - cx) ** 2 + (yy - cy) ** 2 > r * r
lin = ((xx + yy) % 46) < 14
A[fora & lin] = (214, 40, 40, 255)
im = Image.fromarray(A); d = ImageDraw.Draw(im)
for (cx, cy) in ((0, 0), (N, 0), (0, N), (N, N)): d.ellipse((cx - r, cy - r, cx + r, cy + r), outline=(20, 50, 120, 255), width=6)
d.rectangle((0, 0, N - 1, N - 1), outline=(60, 60, 60, 255), width=8)
mt = img_mat(salva(im, 'M08.5_az'), rugos=0.12, coat=0.8)
caixa((0, 0, 0.07), (1.8, 1.8, 0.14), fosco('#f2efe6', 0.5), chanfro=0.03)
plano_img((0, 0, 0.1405), 1.74, 1.74, mt)
fim('M08.5', elev=44, azim=-20)

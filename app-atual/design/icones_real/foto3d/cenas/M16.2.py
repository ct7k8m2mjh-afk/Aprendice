from _mat import *
cena()
# plano de Argand em disco: z = 3 + i (amarelo) e i.z = -1 + 3i (vermelho): multiplicar por i gira 90 graus
# revisao 31/10: disco azul-marinho com eixos brancos (antes quase branco sobre branco) e setas bem mais grossas
N = 1000; c = 500; u = 140
im, d = tex('arg', N, N, (0, 0, 0, 0))
d.ellipse((0, 0, N - 1, N - 1), fill=(26, 56, 122, 255))
for k in range(-4, 5):
    d.line((c + k * u, 40, c + k * u, N - 40), fill=(62, 98, 170, 255), width=3); d.line((40, c + k * u, N - 40, c + k * u), fill=(62, 98, 170, 255), width=3)
d.line((40, c, N - 40, c), fill=(255, 255, 255, 255), width=8); d.line((c, 40, c, N - 40), fill=(255, 255, 255, 255), width=8)
f = fonte(FB, 62)
d.text((N - 110, c + 50), 'Re', font=f, fill=(255, 255, 255, 255), anchor='mm'); d.text((c + 65, 80), 'Im', font=f, fill=(255, 255, 255, 255), anchor='mm')
d.arc((c - 150, c - 150, c + 150, c + 150), -108, -18, fill=(90, 220, 110, 255), width=16)
from PIL import Image as _I, ImageDraw as _D
mk = _I.new('L', (N, N), 0); _D.Draw(mk).ellipse((0, 0, N - 1, N - 1), fill=255); im.putalpha(mk)
mt = img_mat(salva(im, 'M16.2'), rugos=0.2, coat=0.6, alpha=True)
cilindro((0, 0, 0.06), 1.07, 0.12, plastico('#0f2a66', 0.3), chanfro=0.035)
plano_img((0, 0, 0.1215), 2.0, 2.0, mt)
s = 2.0 / N * u
for (x, y), cc in (((3, 1), AMAR), ((-1, 3), VERM)):
    v = mathutils.Vector((x * s, y * s, 0)); m = plastico(cc, 0.22)
    bastao((0, 0, 0.19), (v - v.normalized() * 0.2).to_tuple()[:2] + (0.19,), 0.065, m)
    cn = cone((0, 0, 0), 0.14, 0.0, 0.28, m); cn.location = (v - v.normalized() * 0.1) + mathutils.Vector((0, 0, 0.19)); cn.rotation_euler = v.to_track_quat('Z', 'Y').to_euler()
    pass
esfera((0, 0, 0.19), 0.09, plastico('#f2f2f2', 0.3))
fim('M16.2', elev=44, azim=-10)

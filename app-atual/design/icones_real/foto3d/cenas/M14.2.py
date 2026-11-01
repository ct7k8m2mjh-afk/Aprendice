from _mat import *
cena()
# prancheta com grafico de barras e tabela: leitura de dados
W, H = 800, 1050; im, d = tex('folha', W, H, (252, 252, 249, 255))
f = fonte(FB, 34); fr = fonte(FR, 32)
ox, oy = 90, 560
d.line((ox, oy, 740, oy), fill=(40, 40, 40, 255), width=5); d.line((ox, oy, ox, 130), fill=(40, 40, 40, 255), width=5)
for k in range(1, 5): d.line((ox, oy - k * 100, 740, oy - k * 100), fill=(220, 220, 220, 255), width=2)
vals = [3.2, 2.1, 4.0, 1.4, 2.8]; cs = [(31, 95, 214), (214, 40, 40), (46, 158, 68), (242, 183, 5), (123, 44, 191)]
for k, v in enumerate(vals):
    x = ox + 30 + k * 125; d.rectangle((x, oy - v * 100, x + 85, oy), fill=cs[k] + (255,))
y0 = 640
for i in range(4):
    d.line((90, y0 + i * 95, 740, y0 + i * 95), fill=(170, 170, 170, 255), width=3)
d.line((330, y0, 330, y0 + 3 * 95), fill=(170, 170, 170, 255), width=3)
for i, (a, b) in enumerate((('A', '32'), ('B', '21'), ('C', '40'))):
    d.rectangle((110, y0 + 30 + i * 95, 150, y0 + 65 + i * 95), fill=cs[i] + (255,))
    d.text((175, y0 + 48 + i * 95), a, font=f, fill=(40, 40, 40, 255), anchor='lm'); d.text((520, y0 + 48 + i * 95), b, font=fr, fill=(40, 40, 40, 255), anchor='mm')
mt = img_mat(salva(im, 'M14.2_f'), rugos=0.7, coat=0)
objs = [caixa((0, 0, 0.025), (1.6, 2.2, 0.05), madeira('#a8743f', escala=8), chanfro=0.03),
        plano_img((0, -0.06, 0.0515), 1.44, 1.9, mt)]
objs.append(caixa((0, 0.98, 0.09), (0.7, 0.24, 0.08), metal('#cfd2d8', 0.15), chanfro=0.03))
objs.append(toro((0, 1.06, 0.13), 0.12, 0.025, metal('#cfd2d8', 0.15)))
grupo(objs, loc=(0, 0, 0.9), rot=(R(68), 0, R(-10)))
fim('M14.2', elev=16, azim=-10)

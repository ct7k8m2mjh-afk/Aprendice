from _mat import *
cena()
# alfinete no centro C(2, 2), barbante de raio 1,5 e lapis tracando a circunferencia (x - 2)^2 + (y - 2)^2 = 1,5^2.
# revisao 31/10: papel branco grande deixava os objetos pequenos -> cartao quadriculado menor sobre base de cortica,
# alfinete, barbante e lapis bem maiores.
S = 1.6
im, d = papel_quad('M12.4_p', N=900, passo=180, eixos=(0, 0))
c = (2 * 180, 900 - 2 * 180); rr = 1.5 * 180
d.arc((c[0] - rr, c[1] - rr, c[0] + rr, c[1] + rr), -10, 300, fill=(31, 95, 214, 255), width=16)
f = fonte(FB, 52)
for k in range(1, 5): d.text((k * 180, 868), str(k), font=f, fill=(40, 40, 40, 255), anchor='mm'); d.text((32, 900 - k * 180), str(k), font=f, fill=(40, 40, 40, 255), anchor='mm')
d.text((c[0] + 50, c[1] + 55), 'C', font=fonte(FB, 80), fill=(214, 40, 40, 255), anchor='mm')
mp = img_mat(salva(im, 'M12.4_p'), rugos=0.7, coat=0)
from _por import ruido_cor
caixa((0, 0, 0.05), (S + 0.24, S + 0.24, 0.1), ruido_cor('#b8834e', '#d4a46c', 40, 0.85), chanfro=0.03)
plano_img((0, 0, 0.1015), S, S, mp)
u = S / 900; z0 = 0.1
C = mathutils.Vector((-S / 2 + c[0] * u, S / 2 - c[1] * u, z0))
bastao(C, C + mathutils.Vector((0, 0, 0.26)), 0.016, metal('#cfd2d8', 0.2))
cilindro((C.x, C.y, z0 + 0.29), 0.1, 0.08, plastico(VERM, 0.25), chanfro=0.02); esfera((C.x, C.y, z0 + 0.42), 0.13, plastico(VERM, 0.25))
a = math.radians(12); P = C + mathutils.Vector((rr * u * math.cos(a), rr * u * math.sin(a), 0))
curva_tubo([(C.x, C.y, z0 + 0.2), (P.x - 0.05, P.y, z0 + 0.2)], 0.018, plastico('#f2a33a', 0.6))
lp = [cilindro((0, 0, 0.8), 0.1, 1.3, plastico(VERDE, 0.35), vert=6, chanfro=0.01), cone((0, 0, 0.08), 0.0, 0.1, 0.16, madeira('#e8c08a', escala=30)),
      cone((0, 0, 0.025), 0.0, 0.035, 0.05, plastico('#333333', 0.4)), cilindro((0, 0, 1.5), 0.1, 0.1, metal('#c9ced6', 0.2), chanfro=0.01),
      cilindro((0, 0, 1.6), 0.095, 0.12, plastico('#f08aa8', 0.6), chanfro=0.03)]
grupo(lp, loc=(P.x, P.y, z0), rot=(R(-12), R(16), 0))
fim('M12.4', elev=34, azim=-14)

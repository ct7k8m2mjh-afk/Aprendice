from _mat import *
cena()
# compasso de metal tracando uma circunferencia: ponta seca no centro, o raio r em vermelho.
# revisao 31/10: a folha branca grande deixava o compasso pequeno -> cartao menor sobre prancheta azul e compasso bem maior (protagonista)
im, d = tex('papel', 900, 900, (252, 252, 249, 255))
c = 450; R0 = 370
for k in range(0, 901, 60): d.line((k, 0, k, 900), fill=(214, 228, 242, 255), width=3); d.line((0, k, 900, k), fill=(214, 228, 242, 255), width=3)
d.arc((c - R0, c - R0, c + R0, c + R0), 20, 380 - 30, fill=(31, 95, 214, 255), width=18)
d.line((c, c, c + R0, c), fill=(214, 40, 40, 255), width=14); d.ellipse((c - 14, c - 14, c + 14, c + 14), fill=(40, 40, 50, 255))
d.text((c + R0 / 2, c - 60), 'r', font=fonte(FS, 130), fill=(214, 40, 40, 255), anchor='mm')
S = 1.7
caixa((0, 0, 0.04), (S + 0.2, S + 0.2, 0.08), plastico(AZUL, 0.35), chanfro=0.03)
plano_img((0, 0, 0.0815), S, S, img_mat(salva(im, 'M08.3_papel'), rugos=0.7, coat=0))
sc = S / 900; rr = R0 * sc
z0 = 0.08
cen = (0, 0, z0); pen = (rr, 0, z0); top = (rr / 2, 0.06, 1.42)
cro = metal('#d9dce2', 0.15)
bastao(cen, (top[0] - 0.07, top[1], top[2] - 0.1), 0.065, cro)
bastao((pen[0], pen[1], z0 + 0.2), (top[0] + 0.07, top[1], top[2] - 0.1), 0.065, cro)
cone((0, 0, z0 + 0.06), 0.0, 0.055, 0.12, cro)
cilindro((pen[0], pen[1], z0 + 0.16), 0.05, 0.2, plastico('#2a2a2a', 0.4), chanfro=0.01)
cone((pen[0], pen[1], z0 + 0.03), 0.0, 0.05, 0.06, plastico('#2a2a2a', 0.4))
cilindro((top[0], top[1], top[2]), 0.19, 0.16, cro, rot=(R(90), 0, 0), chanfro=0.04)
cilindro((top[0], top[1], top[2] + 0.3), 0.07, 0.38, plastico(VERM, 0.3), chanfro=0.02)
fim('M08.3', elev=28, azim=-14)

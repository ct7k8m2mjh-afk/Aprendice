from _mat import *
cena()
# quatro tubos de ensaio num suporte com 100%, 50%, 25% e 12,5% da substancia: cada meia-vida reduz a metade
vid = vidro(); liq = liquido('#2e9e44'); mad = madeira('#c48a50', escala=12)
caixa((0, 0, 0.04), (2.3, 0.55, 0.08), mad, chanfro=0.02)
caixa((0, 0, 0.62), (2.3, 0.55, 0.07), mad, chanfro=0.02)
for x in (-1.1, 1.1): caixa((x, 0, 0.33), (0.08, 0.5, 0.6), mad, chanfro=0.015)
H = 1.2; r = 0.15; base = 0.16
for k, f in enumerate([1, 0.5, 0.25, 0.125]):
    x = -0.78 + k * 0.52
    copo((x, 0, base), r, H, vid, esp=0.015)
    hl = 0.9 * f
    cilindro((x, 0, base + 0.015 + hl / 2), r - 0.017, hl, liq, chanfro=0.008)
    toro((x, 0, base + H), r, 0.018, vid)
fim('M06.5', elev=22, azim=-12)

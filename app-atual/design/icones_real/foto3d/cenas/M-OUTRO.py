from _mat import *
cena()
# a letra pi (minuscula) em tubo de plastico azul brilhante sobre uma base de madeira: simbolo geral da Matematica
az = plastico(AZUL, 0.22); r = 0.11; z0 = 0.16
# barra de cima com o ganchinho a esquerda
topo = [(-0.78 + 0.0, 0, z0 + 1.18), (-0.66, 0, z0 + 1.3)] + [(-0.5 + 1.3 * t, 0, z0 + 1.34 + 0.05 * math.sin(math.pi * t) - 0.04 * t) for t in [k / 20 for k in range(21)]]
curva_tubo(topo, r, az)
# perna esquerda: reta levemente inclinada, terminando com curva para a esquerda
pe = [(-0.22 - 0.06 * t - 0.12 * t ** 4, 0, z0 + 1.32 - 1.2 * t) for t in [k / 20 for k in range(21)]]
curva_tubo(pe, r, az)
# perna direita: desce reta e faz a curva para a direita no pe
pd = [(0.38, 0, z0 + 1.3 - 0.95 * t) for t in [k / 10 for k in range(11)]] + [(0.38 + 0.2 * (1 - math.cos(a)), 0, z0 + 0.35 - 0.2 * math.sin(a)) for a in [k * math.pi / 2 / 10 for k in range(1, 11)]]
curva_tubo(pd, r, az)
for p in (topo[0], topo[-1], pe[-1], pd[-1]): esfera(p, r, az)
cilindro((0, 0, 0.08), 0.95, 0.16, madeira('#c48a50', escala=10), chanfro=0.04)
fim('M-OUTRO', elev=18, azim=-18)

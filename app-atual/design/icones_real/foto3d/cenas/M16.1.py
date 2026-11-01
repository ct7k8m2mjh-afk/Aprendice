from _mat import *
cena()
# p(x) = (x + 1,5)(x - 0,3)(x - 1,6): o grafico feito de tubo vermelho grosso, preso num eixo x (barra preta) sobre base de madeira;
# o tubo cruza a barra exatamente nas tres raizes (-1,5; 0,3; 1,6), marcadas por contas douradas -> raizes e relacoes de Girard
# (soma das raizes = 0,4 = -b/a). Revisao 31/10: antes era um arame fino solto (abstrato); agora e um objeto de mesa, grosso e com cor.
sx, sy, zx = 0.78, 0.36, 1.3
def p(x): return (x + 1.5) * (x - 0.3) * (x - 1.6)
pts = [(sx * x, 0, zx + sy * p(x)) for x in [-1.9 + 3.9 * i / 80 for i in range(81)]]
curva_tubo(pts, 0.075, plastico(VERM, 0.25))
for r in (-1.5, 0.3, 1.6): esfera((sx * r, 0, zx), 0.13, metal(DOURADO, 0.2))
mad = madeira('#c48a52', escala=8)
X0, X1 = sx * -2.2, sx * 2.3
caixa(((X0 + X1) / 2, 0, 0.08), (X1 - X0 + 0.3, 0.9, 0.16), mad, chanfro=0.04)
for X in (X0, X1): caixa((X, 0, 0.16 + 0.75), (0.16, 0.3, 1.5), mad, chanfro=0.03)
cilindro(((X0 + X1) / 2, 0, zx), 0.04, X1 - X0, plastico('#23262c', 0.35), rot=(0, R(90), 0), chanfro=0.01)
cone((X1 - 0.12, 0, zx), 0.0, 0.0, 0.01, plastico('#23262c', 0.35))
fim('M16.1', elev=16, azim=-14)

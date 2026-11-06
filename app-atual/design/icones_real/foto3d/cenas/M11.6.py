from _mat import *
cena()
# volumes basicos: bloco 3 x 2 x 2 de cubinhos coloridos (volume = quantos cubos cabem) e um cubinho descendo para completar
a = 0.36; g = 0.012
cs = ['#1f5fd6', '#d62828', '#2e9e44', '#f2b705', '#7b2cbf', '#f07c1e']
n = 0
for k in range(2):
    for j in range(2):
        for i in range(3):
            if k == 1 and j == 0 and i == 2: continue   # falta um na frente, em cima
            caixa(((i - 1) * a, (j - 0.5) * a, a / 2 + k * a), (a - g, a - g, a - g), plastico(cs[n % 6], 0.22), chanfro=0.035); n += 1
# o cubinho que falta, chegando de cima, levemente girado
caixa((1 * a + 0.03, -0.5 * a - 0.02, 2 * a + 0.32), (a - g, a - g, a - g), plastico('#f2b705', 0.22), chanfro=0.035, rot=(R(6), R(-8), R(14)))
fim('M11.6', elev=30, azim=-28)

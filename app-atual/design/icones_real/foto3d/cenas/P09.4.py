# P09.4 adverbiais: semaforo com a luz verde acesa (a circunstancia - tempo, condicao - que comanda a acao)
from _por import *
cena_p()
pr = plastico('#202024', 0.35)
caixa((0, 0, 1.25), (0.5, 0.42, 1.4), pr, chanfro=0.06)
cores = [('#5a1010', '#d62828', 0), ('#5a4a08', '#f2b705', 0), ('#2ef05a', '#2ef05a', 1)]
for k, (esc, cl, acesa) in enumerate(cores):
    z = 1.7 - k * 0.44
    m = emissivo(cl, 5) if acesa else plastico(esc, 0.15)
    l = esfera((0, -0.2, z), 0.15, m); l.scale = (1, 0.35, 1)
    toro((0, -0.215, z), 0.16, 0.02, pr, rot=(math.radians(90), 0, 0))
    v = cilindro((0, -0.3, z + 0.03), 0.18, 0.18, pr, rot=(math.radians(90), 0, 0), chanfro=0.01)
    cut = caixa((0, -0.3, z - 0.1), (0.5, 0.3, 0.22), None, chanfro=0); boolean(v, cut)
    c2 = cilindro((0, -0.3, z), 0.155, 0.4, None, rot=(math.radians(90), 0, 0)); boolean(v, c2)
cilindro((0, 0.0, 0.28), 0.06, 0.56, metal('#9aa0a8', 0.3))
torno([(0, 0), (0.3, 0), (0.3, 0.05), (0.1, 0.1), (0, 0.1)], metal('#9aa0a8', 0.3))
render(saida('P09.4'), elev=16, azim=-22)

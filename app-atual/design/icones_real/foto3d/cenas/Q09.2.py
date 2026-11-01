import sys, os, math, random; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _qui import *
from mathutils import Euler
# Eletrolise da agua: o tubo do H2 (polo negativo, fio preto) junta o dobro do volume de gas do tubo do O2 (polo positivo, fio vermelho): 2 H2O -> 2 H2 + O2
cena_q()
bequer(R=1.35, H=1.3, nivel=0.95, cor='#8fcff5', grad=False, bico=False)
for (x, gas, fio) in [(-0.55, 1.3, '#222222'), (0.55, 0.65, '#d62828')]:
    R = 0.3; Ht = 2.6
    ext = [(0, 0)] + [(R * math.sin(a), R - R * math.cos(a)) for a in [i * math.pi / 2 / 10 for i in range(1, 11)]] + [(R, Ht)]
    ob = [torno(parede(ext, 0.03), vidro()), faixa(ext, 0.03, gas, Ht - 0.02, liquido('#8fcff5'))]
    grupo(ob, loc=(x, 0, Ht + 0.35), rot=(180, 0, 0))
    # eletrodo e bolhas
    cilindro((x, 0, 0.55), 0.05, 0.6, metal('#c9ced6', 0.25))
    random.seed(int(x * 10) + 20)
    for k in range(8 if gas > 1 else 4):
        esfera((x + random.uniform(-0.12, 0.12), random.uniform(-0.12, 0.12), 0.95 + random.uniform(0, 1.0)), random.uniform(0.03, 0.06), vidro('#ffffff'), seg=16)
    # fio saindo pela borda do bequer
    curva([Vector((x, 0, 0.3)), Vector((x * 1.3, 0.3, 0.2)), Vector((x * 2.0, 0.6, 0.5)), Vector((x * 2.2, 0.8, 1.4)), Vector((x * 2.9, 0.6, 1.7))], 0.045, plastico(fio, 0.3))
render(out('Q09.2'), elev=24)

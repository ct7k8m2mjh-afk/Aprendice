import sys, os, math, random; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _qui import *
from mathutils import Euler
# Calorimetro (revisao 31/10: era copo de isopor branco sobre branco). Agora o calorimetro escolar de metal:
# vaso de cobre polido, tampa isolante preta, termometro de vidro (coluna vermelha) e agitador em argola -> medir o calor (entalpia) da reacao.
cena_q()
mcu = metal('#c9764a', 0.22); mpre = plastico('#1d1f24', 0.4); mal = metal('#cfd4da', 0.2)
# vaso de cobre com frisos
torno([(0, 0), (0.98, 0), (1.02, 0.04), (1.02, 2.0), (0.0, 2.0)], mcu)
for z in (0.35, 1.65): toro((0, 0, z), 1.02, 0.03, mcu)
# base isolante preta
cilindro((0, 0, 0.06), 1.08, 0.12, mpre, chanfro=0.04)
# tampa preta com puxador
cilindro((0, 0, 2.08), 1.1, 0.18, mpre, chanfro=0.05)
cilindro((0.45, -0.35, 2.24), 0.16, 0.14, mpre, chanfro=0.04)
# termometro de vidro atravessando a tampa (coluna vermelha + escala)
tx, ty = -0.3, -0.2
torno([(0, 1.0), (0.11, 1.03), (0.12, 1.2), (0.1, 1.3), (0.1, 4.0), (0, 4.08)], vidro('#ffffff'), loc=(tx, ty, 0), fechado=False)
bastao((tx, ty, 2.0), (tx, ty, 3.45), 0.045, plastico('#d62828', 0.2))
cilindro((tx, ty, 2.2), 0.13, 0.08, plastico('#2b2f36', 0.4), chanfro=0.02)
for k in range(9): caixa((tx, ty - 0.11, 2.45 + k * 0.17), (0.07 if k % 2 else 0.12, 0.006, 0.016), fosco('#222222', 0.5), chanfro=0)
# agitador: haste com argola
bastao((0.35, 0.35, 1.5), (0.35, 0.35, 3.25), 0.05, mal)
toro((0.35, 0.35, 3.42), 0.17, 0.05, mal, rot=(math.radians(90), 0, math.radians(-20)))
render(out('Q07.1'), elev=28, azim=-14)

import sys, os, math, random; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _qui import *
from mathutils import Euler
# Transformacoes gasosas (P, V, T): cilindro de vidro com embolo de metal e um peso em cima comprimindo o gas (bolinhas amarelas).
# Revisao 31/10: era uma seringa deitada, comprida e fina; agora o cilindro com embolo e peso, em pe e compacto (esquema classico de P x V).
cena_q()
R, H = 0.78, 1.7
ext = cilindro_ext(R, H, z0=0.16, cant=0.05)
torno(parede(ext, 0.035), vidro(ior=1.1))
toro((0, 0, 0.16 + H), R + 0.005, 0.035, vidro())
cilindro((0, 0, 0.08), R + 0.18, 0.16, plastico('#2b2f36', 0.35), chanfro=0.04)
ze = 1.12
aco = metal('#c9ced6', 0.2)
cilindro((0, 0, ze), R - 0.04, 0.22, plastico('#d62828', 0.3), chanfro=0.04)
cilindro((0, 0, ze + 0.11 + 0.44), 0.08, 0.88, aco, chanfro=0.01)
# pesos de latao empilhados (massas de laboratorio) apertando o embolo
lat = metal('#d4a52a', 0.22)
torno([(0, 0), (0.5, 0), (0.52, 0.03), (0.52, 0.3), (0.49, 0.33), (0.0, 0.33)], lat, loc=(0, 0, ze + 0.98))
torno([(0, 0), (0.36, 0), (0.38, 0.03), (0.38, 0.26), (0.35, 0.29), (0.0, 0.29)], lat, loc=(0, 0, ze + 1.31))
cilindro((0, 0, ze + 1.66), 0.1, 0.12, lat, chanfro=0.02); esfera((0, 0, ze + 1.76), 0.13, lat)
random.seed(5)
for k in range(16):
    a = random.uniform(0, 6.28); r = math.sqrt(random.random()) * (R - 0.16)
    esfera((r * math.cos(a), r * math.sin(a), 0.32 + random.uniform(0, ze - 0.55)), 0.085, plastico('#f2b705', 0.25), seg=24)
render(out('Q06.1'), elev=22, azim=-14)

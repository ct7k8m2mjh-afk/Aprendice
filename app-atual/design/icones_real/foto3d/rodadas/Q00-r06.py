# Q00 ícone principal de Química (03/11): átomo no modelo planetário (Rutherford-Bohr) usado como SÍMBOLO escolar,
# como a referência aprovada (rodadas/ref-Q00.webp): núcleo compacto de prótons (vermelhos) e nêutrons (cinza-prata),
# três órbitas metálicas finas cruzadas em ângulos diferentes e dois elétrons azuis em cada órbita.
# Ciência: 6 prótons + 6 nêutrons + 6 elétrons = carbono-12 neutro. Elétrons reais são descritos por orbitais
# (nuvens de probabilidade), não por trajetórias; o ícone é um símbolo (anotado em rodadas/Q00.md).
# Animação pela FUNÇÃO: os elétrons percorrem as órbitas (cada órbita com velocidade e fase próprias, número inteiro
# de voltas no ciclo -> em t=1 tudo volta ao quadro 0); o núcleo fica parado.
import sys, os, math, random
sys.path[:0] = [os.path.dirname(os.path.dirname(os.path.abspath(__file__))), os.path.dirname(os.path.abspath(__file__))]
from _qui import *
from _bio2 import org
from camadas import render_quadros
import numpy as np

V = Vector
CAM_ELEV, CAM_AZIM = 20, -8
cena()

# ---------- materiais
verm = org('#c0120f', '#cc1c16', cav='#3a0202', sss=.15, rugos=.18, coat=.8, bump=0, esc=4, ao=.15, cav_forca=.8, borda=.6)
cinza = org('#8e9299', '#9da1a8', cav='#2a2d32', sss=.05, metal=.3, rugos=.16, coat=.8, bump=0, esc=4, ao=.12, cav_forca=.7, borda=.45)
azul = org('#1d74d8', '#2a84e4', cav='#062a5a', sss=.1, rugos=.12, coat=.9, bump=0, esc=4, ao=.05, cav_forca=.4, borda=.4)
orb_m = metal('#80858c', .16)

# ---------- referencial da câmera (as órbitas são desenhadas em relação à vista, como no símbolo)
e = math.radians(CAM_ELEV); a = math.radians(CAM_AZIM)
W = V((math.sin(a) * math.cos(e), -math.cos(a) * math.cos(e), math.sin(e)))   # do centro para a câmera
RG = V((0, 0, 1)).cross(W).normalized() * -1                                     # direita da tela
if RG.dot(V((math.cos(a), math.sin(a), 0))) < 0: RG = -RG
UP = W.cross(RG).normalized() * -1
if UP.z < 0: UP = -UP

# ---------- núcleo: 12 núcleons empacotados (relaxação determinística)
RN = .40
rng = np.random.default_rng(11)
P = rng.normal(size=(12, 3)) * .55
for it in range(400):
    for i in range(12):
        for j in range(i + 1, 12):
            d = P[j] - P[i]; L = np.linalg.norm(d) + 1e-9
            if L < 2 * RN * .86:
                c = (2 * RN * .86 - L) / 2 * d / L; P[i] -= c; P[j] += c
    P -= P.mean(0); P *= .985   # atrai para o centro (cacho compacto)
# prótons à frente-esquerda-baixo, nêutrons atrás-direita-cima (como a referência), mistura leve
dirn = (RG * .9 + UP * .5 - W * .2).normalized()
sc_ = [float(np.dot(p, np.array(dirn))) + rng.normal() * .08 for p in P]
ordem = np.argsort(sc_)
C = V((0, 0, 0))
nucleo = []
for k, i in enumerate(ordem):
    m = verm if k < 6 else cinza
    nucleo.append(esfera(tuple(V(P[i])), RN * (1 + .08 * math.sin(i * 2.3)), m, seg=64))

# ---------- órbitas: três círculos de raio R, inclinados (elipses na tela com eixos maiores a ~0°, 60°, 120°)
R = 1.62; RT = .03; RE = .22
ORB = [  # (psi da normal projetada na tela, inclinação theta em relação à vista, voltas no ciclo, fase dos elétrons)
    (88, 74, 1, 0),      # larga, quase horizontal
    (200, 70, 2, 0),     # alta, inclinada '\'
    (125, 60, -1, 0),    # aberta, inclinada '/'
]
orbitas = []   # (u, v) base do plano da órbita
for (psi, th, voltas, fase) in ORB:
    ps, tt = math.radians(psi), math.radians(th)
    n = (W * math.cos(tt) + (RG * math.cos(ps) + UP * math.sin(ps)) * math.sin(tt)).normalized()
    u = n.cross(W).normalized(); v = n.cross(u).normalized()
    o = toro((0, 0, 0), R, RT, orb_m)
    o.rotation_euler = n.to_track_quat('Z', 'Y').to_euler()
    orbitas.append((u, v, voltas, math.radians(fase), n))

eletrons = []
for (u, v, voltas, fase, n) in orbitas:
    for j in range(2):
        eletrons.append(esfera((0, 0, 0), RE, azul, seg=48))

def pos(k, t):
    u, v, voltas, fase, n = orbitas[k // 2]
    ang = fase + math.pi * (k % 2) + 2 * math.pi * voltas * t
    return C + (u * math.cos(ang) + v * math.sin(ang)) * R

# ---------- apoio: o átomo flutua logo acima do chão (folga mínima = raio do elétron na parte mais baixa das órbitas)
zmin = min(-R * math.sqrt(max(0, 1 - n.z ** 2)) - RE for (_, _, _, _, n) in orbitas)
zmin = min(zmin, min(p[2] for p in P) - RN)
C = V((0, 0, -zmin + .1))
for o in bpy.context.scene.objects:
    if o.type == 'MESH' and o.name != 'CHAO' and o not in eletrons:
        o.location = o.location + C

def passo(t):
    for k, el in enumerate(eletrons):
        el.location = pos(k, t)

render_quadros('Q00', passo, n=24, elev=CAM_ELEV, azim=CAM_AZIM, folga=1.08)

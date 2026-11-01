# P11.2 Romantismo: cocar de penas coloridas em leque (o indianismo da 1a geracao romantica - Goncalves Dias, Jose de Alencar)
# revisao 31/10 (2a rodada): leque mais fechado e penas mais longas e largas -> composicao menos larga
from _por import *
cena_p()
cores = ['#d62828', '#f2b705', '#1f5fd6', '#2e9e44', '#f27a1a']
def pena_plana(c, L=1.55, W=0.27):
    pol = [(W / 2 * math.sin(math.pi * t) ** 0.8 * (1.0 if t < 0.97 else 0.6), L * t) for t in [k / 30 for k in range(31)]]
    pol = pol + [(-x, y) for x, y in reversed(pol[1:-1])]
    v = placa(pol, 0.02, plastico(c, 0.45), chanfro=0.008)
    tip = [(x * 1.02, y) for x, y in pol if y > L * 0.8]
    pt = placa([(x, max(y, L * 0.8)) for x, y in pol if y >= L * 0.78], 0.024, plastico('#1c1c22', 0.4), loc=(0, 0, -0.002))
    ha = cilindro((0, L * 0.45, 0.02), 0.012, L * 0.95, plastico('#f4efe4', 0.4), rot=(math.radians(90), 0, 0), chanfro=0)
    return [v, pt, ha]
n = 11
for i in range(n):
    a = -44 + 88 * i / (n - 1)
    ob = pena_plana(cores[i % len(cores)])
    grupo(ob, loc=(0.42 * math.sin(math.radians(a)), 0.0 + abs(a) * 0.0006, 0.42 * math.cos(math.radians(a)) * 0.35), rot=(math.radians(90), math.radians(a), 0))
# faixa trancada
cou = ruido_cor('#a8672a', '#d9a35a', 20, 0.7, bump=0.3)
pts = [(0.5 * math.sin(math.radians(a)), -0.04, 0.5 * math.cos(math.radians(a)) * 0.35 - 0.02) for a in range(-90, 91, 6)]
tubo(pts, 0.08, cou, res=12)
for k, c in enumerate(('#d62828', '#f2b705', '#1c1c22', '#f2b705', '#d62828')):
    a = math.radians(-60 + 30 * k); esfera((0.5 * math.sin(a), -0.13, 0.5 * math.cos(a) * 0.35 - 0.02), 0.05, plastico(c, 0.3))
for s in (-1, 1):
    bez([(s * 0.5, -0.04, -0.02), (s * 0.55, -0.1, -0.3), (s * 0.5, -0.12, -0.6)], 0.02, cou)
    esfera((s * 0.5, -0.12, -0.62), 0.05, plastico('#d62828', 0.3))
allo = [o for o in bpy.context.scene.objects if o.parent is None and o.name not in ('CHAO', 'KEY', 'FILL')]
g = grupo(allo, rot=(0, 0, math.radians(-10))); no_chao(g)
render(saida('P11.2'), elev=14, azim=-10)

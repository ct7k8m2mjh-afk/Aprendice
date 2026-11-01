# P04.3 progressao tematica: fileira de dominos caindo um sobre o outro (uma ideia levando a seguinte)
from _por import *
cena_p()
h, w, t = 1.0, 0.5, 0.15
marfim = plastico('#f6f2e8', 0.3); preto = plastico('#18181c', 0.3)
pips = {1: [(0, 0)], 2: [(-1, 1), (1, -1)], 3: [(-1, 1), (0, 0), (1, -1)], 4: [(-1, 1), (1, 1), (-1, -1), (1, -1)], 5: [(-1, 1), (1, 1), (0, 0), (-1, -1), (1, -1)], 6: [(-1, 1), (1, 1), (-1, 0), (1, 0), (-1, -1), (1, -1)]}
def domino(cima, baixo):
    ob = [caixa((0, 0, h / 2), (t, w, h), marfim, chanfro=0.035)]
    for lado in (-1, 1):
        ob.append(caixa((lado * t / 2, 0, h / 2), (0.006, w * 0.75, 0.014), preto, chanfro=0.0))
        for n, zc in ((cima, h * 0.75), (baixo, h * 0.25)):
            for (u, v) in pips[n]:
                ob.append(cilindro((lado * t / 2, u * 0.12, zc + v * 0.12), 0.034, 0.012, preto, rot=(0, math.radians(90), 0), chanfro=0.004))
    return ob
esp = 0.40
def canto(i, th): return (i * esp + t + h * math.sin(th), h * math.cos(th))
def resolve(i, th2):
    L0 = ((i + 1) * esp + t - t * math.cos(th2), t * math.sin(th2)); dv = (math.sin(th2), math.cos(th2))
    def g(th):
        c = canto(i, th); return (c[0] - L0[0]) * dv[1] - (c[1] - L0[1]) * dv[0]
    lo, hi = 0.0, math.radians(89)
    for _ in range(60):
        mid = (lo + hi) / 2
        if g(lo) * g(mid) <= 0: hi = mid
        else: lo = mid
    return (lo + hi) / 2
ang = [0.0] * 6
for i in (2, 1, 0): ang[i] = resolve(i, ang[i + 1])
faces = [(5, 3), (2, 6), (4, 1), (6, 5), (3, 2), (1, 4)]
for i, (a_, (c, b_)) in enumerate(zip(ang, faces)):
    piv = bpy.data.objects.new('p', None); bpy.context.scene.collection.objects.link(piv)
    for o in domino(c, b_):
        o.parent = piv; o.location.x -= t / 2
    piv.location = (i * esp + t, 0, 0); piv.rotation_euler = (0, a_, 0)
render(saida('P04.3'), elev=22, azim=-40)

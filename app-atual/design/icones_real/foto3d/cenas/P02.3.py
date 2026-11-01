# P02.3 ironia, humor e sentido implicito: chapeu de bobo da corte (tres pontas com guizos) - o bobo dizia verdades pelo humor e pela ironia
from _por import *
cena_p()
cores = ['#d62828', '#f2b705', '#1f5fd6']
ouro = metal('#d4a52a', 0.2)
# faixa da cabeca (anel achatado) com losangos
fx = torno([(0.5, 0.0), (0.53, 0.0), (0.55, 0.05), (0.55, 0.17), (0.53, 0.22), (0.5, 0.22)], plastico('#2e9e44', 0.4), seg=96)
for k in range(10):
    a = 2 * math.pi * k / 10
    d = caixa((0.555 * math.cos(a), 0.555 * math.sin(a), 0.11), (0.02, 0.1, 0.1), ouro, chanfro=0.008, rot=(math.radians(45), 0, a))
# copa macia
cop = esfera((0, 0, 0.22), 0.5, plastico('#7b2cbf', 0.45)); cop.scale = (1, 1, 0.55)
corte = caixa((0, 0, -0.3), (2, 2, 1.0), None, chanfro=0); boolean(cop, corte)
# tres pontas curvas e afinando, caindo para os lados, com guizo na ponta
for i, (az, c) in enumerate(zip((90, 210, 330), cores)):
    a = math.radians(az); ux, uy = math.cos(a), math.sin(a)
    pts = [(0.15 * ux, 0.15 * uy, 0.35), (0.45 * ux, 0.45 * uy, 0.75), (0.85 * ux, 0.85 * uy, 0.85), (1.05 * ux, 1.05 * uy, 0.6), (1.08 * ux, 1.08 * uy, 0.4)]
    cu = bpy.data.curves.new('p', 'CURVE'); cu.dimensions = '3D'; cu.bevel_depth = 0.24; cu.bevel_resolution = 6; cu.use_fill_caps = True
    sp = cu.splines.new('BEZIER'); sp.bezier_points.add(len(pts) - 1)
    for k, (p, q) in enumerate(zip(sp.bezier_points, pts)):
        p.co = q; p.handle_left_type = p.handle_right_type = 'AUTO'; p.radius = [1.0, 0.75, 0.42, 0.22, 0.12][k]
    o = bpy.data.objects.new('p', cu); bpy.context.scene.collection.objects.link(o); o.data.materials.append(plastico(c, 0.4))
    esfera((1.08 * ux, 1.08 * uy, 0.3), 0.09, ouro)
    toro((1.08 * ux, 1.08 * uy, 0.3), 0.06, 0.012, metal('#8a6420', 0.3), rot=(0, 0, 0))
render(saida('P02.3'), elev=26, azim=-18)

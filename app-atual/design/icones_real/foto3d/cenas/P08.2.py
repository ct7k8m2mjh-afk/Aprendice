# P08.2 objeto direto e indireto: caixa de presente com laco e etiqueta (dar algo a alguem)
from _por import *
cena_p()
ve = plastico('#1f5fd6', 0.35); fi = metal('#d4a52a', 0.3)
caixa((0, 0, 0.42), (1.1, 1.1, 0.84), ve, chanfro=0.02)
caixa((0, 0, 0.92), (1.16, 1.16, 0.2), ve, chanfro=0.02)
for rot in (0, 90):
    o = caixa((0, 0, 0.51), (0.16, 1.18, 1.04), fi, chanfro=0.006); o.rotation_euler.z = math.radians(rot)
for sx in (-1, 1):
    t = toro((sx * 0.22, 0, 1.1), 0.22, 0.055, fi, rot=(math.radians(90), 0, 0)); t.scale = (1.0, 0.55, 1.0)
    t.rotation_euler = (math.radians(90), sx * math.radians(-25), 0)
esfera((0, 0, 1.08), 0.08, fi)
tg = placa([(-0.12, 0.0), (0.12, 0.0), (0.12, -0.3), (-0.12, -0.3)], 0.01, papel('#f6efe0'), loc=(0.62, -0.62, 0.2), rot=(math.radians(80), 0, math.radians(30)), chanfro=0.003)
bez([(0.5, -0.5, 0.97), (0.62, -0.62, 0.6), (0.66, -0.66, 0.22)], 0.006, fosco('#d62828', 0.6))
render(saida('P08.2'), elev=28, azim=-24)

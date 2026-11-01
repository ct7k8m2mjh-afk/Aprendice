from _mat import *
cena()
# bola de tenis em foto estroboscopica: posicoes a intervalos de tempo iguais sobre uma parabola (vertice no meio)
def bolinha(loc, r, alfa):
    m, b = bpy.data.materials.new('t'), None; m.use_nodes = True; b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = cor('#d8e830'); b.inputs['Roughness'].default_value = 0.85
    b.inputs['Sheen Weight'].default_value = 1.0; b.inputs['Alpha'].default_value = alfa
    o = esfera(loc, r, m)
    # costura branca
    t = toro(loc, r * 0.98, r * 0.06, plastico('#ffffff', 0.6), rot=(R(60), R(20), 0)); t.scale = (1, 0.72, 1)
    return o
n = 7
for k in range(n):
    t = (k - (n - 1) / 2) / ((n - 1) / 2)       # -1..1 em passos iguais
    x = 1.25 * t; z = 0.3 + 1.25 * (1 - t * t)  # z = 1,75 - 1,5 x^2/1,6^2 : parabola com vertice no topo
    bolinha((x, 0, z), 0.25, 1.0 if k == n - 1 else 0.72 + 0.25 * k / (n - 1))
caixa((0, 0.0, 0.02), (3.1, 0.9, 0.04), plastico('#2f7fd0', 0.5), chanfro=0.01)
rede = fosco('#f4f4f4', 0.6)
for yy in (-0.42, 0.42): bastao((0, yy, 0.04), (0, yy, 0.5), 0.02, plastico('#333333', 0.4))
caixa((0, 0, 0.3), (0.012, 0.84, 0.36), plastico('#2a2a2a', 0.6), chanfro=0)
caixa((0, 0, 0.49), (0.03, 0.86, 0.04), rede, chanfro=0.005)
caixa((0, 0.0, 0.045), (0.04, 0.9, 0.01), plastico('#ffffff', 0.5), chanfro=0)
fim('M05.2', elev=14, azim=-6)

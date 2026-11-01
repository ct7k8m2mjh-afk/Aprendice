from _mat import *
cena()
# seis bolas numeradas de sorteio: a ordem em que saem nao importa (combinacoes)
dados = [('04', VERM), ('13', AZUL), ('27', VERDE), ('35', AMAR), ('42', ROXO), ('58', LARANJA)]
pos = [(-0.62, 0.3), (0.0, 0.42), (0.62, 0.3), (-0.6, -0.36), (0.02, -0.28), (0.64, -0.36)]
r = 0.3
for (n, c), (x, y) in zip(dados, pos):
    esfera((x, y, r), r, plastico(c, 0.12))
    # disco branco com o numero voltado para a camera
    v = mathutils.Vector((-0.3, -0.95, 0.45)).normalized()
    p = mathutils.Vector((x, y, r)) + v * (r * 0.985)
    rot = v.to_track_quat('Z', 'Y').to_euler()
    o = cilindro((0, 0, 0), r * 0.55, 0.01, plastico('#ffffff', 0.15), chanfro=0.004); o.location = p; o.rotation_euler = rot
    d = decal(n, (0, 0, 0), r * 0.42, cor_txt=(25, 25, 25, 255), nome='M13.3_' + n); d.location = p + v * 0.006; d.rotation_euler = rot
fim('M13.3', elev=30, azim=-14)

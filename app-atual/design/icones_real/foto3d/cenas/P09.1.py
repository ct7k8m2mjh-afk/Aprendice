# P09.1 coordenacao e o sentido de cada conjuncao coordenativa: corrente de bonecos recortados, de maos dadas, dobrada em sanfona
# (oracoes iguais, independentes, lado a lado e ligadas). Revisao 31/10: bonecos de cartolina grossa e colorida, so tres, maiores,
# dobrados em sanfona bem marcada (antes eram finos e pequenos numa fila comprida).
from _por import *
cena_p()
def boneco():
    pts = [(-0.28, 0), (-0.06, 0), (-0.045, 0.56), (0.045, 0.56), (0.06, 0), (0.28, 0), (0.2, 0.62), (0.22, 0.93), (0.5, 0.95), (0.5, 1.13),
           (0.2, 1.17), (0.08, 1.23)]
    for i in range(1, 24):
        a = math.radians(-58 + 296 * i / 24); pts.append((0.19 * math.cos(a), 1.41 + 0.19 * math.sin(a)))
    pts += [(-0.08, 1.23), (-0.2, 1.17), (-0.5, 1.13), (-0.5, 0.95), (-0.22, 0.93), (-0.2, 0.62)]
    return pts
cores = ['#d62828', '#f2b705', '#1f5fd6']
th = math.radians(38); H = Vector((0, 0, 0))
for k, c in enumerate(cores):
    phi = th if k % 2 == 0 else -th
    d = Vector((math.cos(phi), math.sin(phi), 0))
    p = placa(boneco(), 0.06, fosco(c, 0.55), chanfro=0.012)
    for v in p.data.vertices: v.co.x += 0.5
    p.rotation_euler = (math.radians(90), 0, phi); p.location = H + Vector((0, 0, 0))
    H = H + d * 1.0
render(saida('P09.1'), elev=22, azim=-12)

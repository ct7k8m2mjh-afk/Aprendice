# B01.2 transporte vesicular: vesicula (bicamada em esfera) aberta mostrando a carga, encostando na membrana
import sys; sys.path[:0] = ['/home/claude/escadas-sc/design/icones_real/foto3d', '/home/claude/escadas-sc/design/icones_real/foto3d/cenas']
from _bio2 import *
pele = pele_org; plastico = plast_org
cena()
import random
cab = plastico('#e0543a', .3); cau = plastico('#f2c14e', .45); carga = plastico('#7b2cbf', .25); carga2 = plastico('#1f9fd6', .25)
def fib(n, R, c):
    g = math.pi * (3 - math.sqrt(5)); out = []
    for i in range(n):
        z = 1 - 2 * (i + .5) / n; r = math.sqrt(1 - z * z); t = g * i
        out.append(V((r * math.cos(t) * R, r * math.sin(t) * R, z * R)))
    return out
C = V((0, 0, 1.15))
def corte(p):  # fatia removida voltada para a camera
    return p.y < -.05 and p.z > -.2
for p in fib(330, 1.0, 0):
    if not corte(p): esfera(C + p, .085, cab, seg=20)
for p in fib(170, .62, 0):
    if not corte(p): esfera(C + p, .075, cab, seg=20)
casca = esfera(C, .95, cau); inn = esfera(C, .68, None); dif(casca, inn)
bpy.ops.mesh.primitive_cube_add(size=1, location=C + V((0, -1.05, .9))); bx = bpy.context.object; bx.scale = (3, 2, 2.2); dif(casca, bx)
random.seed(4)
for k in range(9):
    p = V((random.uniform(-.35, .35), random.uniform(-.3, .3), random.uniform(-.35, .35)))
    esfera(C + p, .11, carga if k % 3 else carga2, seg=32)
# trecho da membrana plasmatica embaixo
for i in range(-7, 8):
    for j in range(-3, 4):
        x = i * .22 + (.11 if j % 2 else 0); y = j * .19
        esfera((x, y, .02), .1, cab, seg=20)
caixa((0, 0, -.18), (3.3, 1.45, .32), cau, chanfro=.05)
for i in range(-7, 8):
    for j in range(-3, 4):
        x = i * .22 + (.11 if j % 2 else 0); y = j * .19
        esfera((x, y, -.38), .1, cab, seg=20)
sai('B01.2', elev=26)

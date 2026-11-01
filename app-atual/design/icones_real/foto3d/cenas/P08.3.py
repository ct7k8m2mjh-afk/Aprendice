# P08.3 adjunto e aposto: bilhete amarelo preso a uma folha por um clipe (o termo que se junta para acrescentar)
# revisao 31/10: folha sobre uma pasta azul (contraste com o fundo branco) e clipe vermelho encapado, bem maior
from _por import *
cena_p()
caixa((-0.05, -0.02, 0.0), (1.55, 1.95, 0.05), plastico('#1f5fd6', 0.35), chanfro=0.02, rot=(0, 0, math.radians(5)))
folha_grade(1.3, 1.7, 2, 2, lambda x, y: 0, imagem_mat(tex_linhas('P08_3', linhas=20, seed=4, titulo=True), 0.85), loc=(0, 0, 0.03), esp=0.004)
nota = folha_grade(0.75, 0.62, 10, 10, lambda x, y: 0.03 * max(0, (-y - 0.1)) ** 1.5 * 8, imagem_mat(tex_linhas('P08_3b', w=700, h=580, linhas=5, margem=70, fundo=(255, 222, 90), cor_txt=(60, 60, 80), seed=8), 0.8), loc=(0.2, 0.42, 0.038), rot=(0, 0, math.radians(-8)), esp=0.004)
# clipe (gem clip) sobre a borda superior
aco = plastico('#d62828', 0.3)
pts = [(0.0, -0.05), (0.0, 0.42), (0.07, 0.48), (0.14, 0.42), (0.14, -0.15), (0.07, -0.21), (-0.03, -0.15), (-0.03, 0.42 - 0.0), ]
P = [(0.0, -0.3), (0.0, 0.32), (0.06, 0.38), (0.12, 0.32), (0.12, -0.36), (0.06, -0.43), (0.0, -0.43), (-0.06, -0.36), (-0.06, 0.25)]
from mathutils import Vector
def arredonda(P, k=6):
    out = []
    for i, p in enumerate(P):
        if 0 < i < len(P) - 1:
            a = Vector(P[i - 1]); b = Vector(p); c = Vector(P[i + 1])
            q0 = b + (a - b) * 0.35; q1 = b + (c - b) * 0.35
            for t in range(k + 1):
                u = t / k; out.append(tuple((1 - u) ** 2 * q0 + 2 * u * (1 - u) * b + u * u * q1))
        else: out.append(p)
    return out
pp = arredonda(P)
cl = tubo([(x, y, 0.06 + (0.03 if (x > 0.05 or x < -0.03) else 0)) for x, y in pp], 0.022, aco)
for x in bpy.context.selected_objects: x.select_set(False)
cl.select_set(True); bpy.context.view_layer.objects.active = cl; bpy.ops.object.convert(target='MESH'); cl = bpy.context.view_layer.objects.active  # curva -> malha (enquadramento certo)
grupo([cl], loc=(0.28, 0.72, 0.0), rot=(0, 0, math.radians(-12)), escala=1.8)
render(saida('P08.3'), elev=48, azim=-10)

# P12.5 literatura contemporanea e autores africanos de lingua portuguesa: globo de mesa com a Africa a frente e os paises de lingua portuguesa em amarelo
from _por import *
cena_p()
tex = os.path.join(AQUI, 'tex', 'terra.png')
m = imagem_mat(tex, 0.3); m.node_tree.nodes['Principled BSDF'].inputs['Coat Weight'].default_value = 0.4
gl = esfera((0, 0, 0), 0.75, m)
gl.rotation_euler = (0, 0, math.radians(-135))
eixo = grupo([gl], loc=(-0.33, 0, 1.4), rot=(0, math.radians(-23.4), 0))
ou = metal('#d4a52a', 0.22)
ar = []
for i in range(0, 201, 3):
    a = math.radians(-10 + i); ar.append((0.83 * math.sin(a), 0, 0.83 * math.cos(a)))
mer = tubo(ar, 0.025, ou, res=12)
mg = grupo([mer], loc=(-0.33, 0, 1.4), rot=(0, math.radians(-23.4), 0))
torno([(0, 0), (0.42, 0), (0.44, 0.04), (0.38, 0.1), (0.12, 0.14), (0.07, 0.2), (0.06, 0.5), (0, 0.5)], madeira('#6e3b1a', '#4a250e', 9))
bpy.context.view_layer.update()
fundo = mg.matrix_world @ Vector((0, 0, -0.83))
bastao((0, 0, 0.45), (fundo.x, fundo.y, fundo.z + 0.02), 0.03, ou)
for z in (0.83, -0.83): esfera(tuple(eixo.matrix_world @ Vector((0, 0, z * 0.95))), 0.035, ou)
render(saida('P12.5'), elev=14, azim=-10)

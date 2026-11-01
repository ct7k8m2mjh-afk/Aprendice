# P07.4 formacao de palavras: tres blocos de montar encaixados, DES + LEAL + DADE (prefixo, radical e sufixo = deslealdade)
# revisao 31/10: blocos empilhados em torre (le-se de cima para baixo DES / LEAL / DADE) -> composicao quadrada, nao larga e baixa
from _por import *
cena_p()
def bloco(nx, cor_, x, txt_, z=0.0, pinos=False):
    m = plastico(cor_, 0.25); u = 0.32; w = nx * u; d = 2 * u; h = 0.46
    ob = [caixa((0, 0, h / 2), (w - 0.01, d - 0.01, h), m, chanfro=0.02)]
    for i in (range(nx) if pinos else []):
        for j in range(2):
            ob.append(cilindro((-w / 2 + u / 2 + i * u, -d / 2 + u / 2 + j * u, h + 0.05), 0.1, 0.1, m, chanfro=0.012))
    ob.append(txt(txt_, (0, -d / 2 - 0.003, h / 2), 0.3, plastico('#ffffff', 0.3), rot=(math.radians(90), 0, 0), extr=0.008, fonte=POP))
    return grupo(ob, loc=(x, 0, z))
bloco(4, '#1f5fd6', 0.0, 'DADE', z=0.0)
bloco(4, '#2e9e44', 0.1, 'LEAL', z=0.46)
bloco(4, '#d62828', -0.06, 'DES', z=0.92, pinos=True)
grupo([o for o in bpy.context.scene.objects if o.parent is None and o.type == 'EMPTY'], rot=(0, 0, math.radians(-26)))
render(saida('P07.4'), elev=24, azim=-10)

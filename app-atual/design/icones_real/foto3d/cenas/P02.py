# P02 Argumentacao: dois baloes de fala 3D, SIM (verde, na frente) e NAO (coral, atras), rabichos para lados opostos
from _por import *
cena_p()
def um(txt_, c, tx, lado, loc, rz):
    corpo = placa(balao(1.25, 0.8, 0.3, tx, lado), 0.22, plastico(c, 0.3), chanfro=0.07, seg_ch=6)
    t = txt(txt_, (0, 0.0, 0.225), 0.44, plastico('#ffffff', 0.35), extr=0.02, bevel=0.006, fonte=POP)
    return grupo([corpo, t], loc=loc, rot=(math.radians(90), 0, rz))
um('NÃO', '#e8553e', 0.3, 1, (0.62, 0.6, 0.73), math.radians(-12))
um('SIM', '#2e9e44', -0.3, -1, (-0.3, -0.2, 0.73), math.radians(-12))
render(saida('P02'), elev=22, azim=-12)

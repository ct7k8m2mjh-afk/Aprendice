# P10.5 vozes verbais e discurso direto/indireto/indireto livre.
# revisao 31/10: as aspas soltas viravam formas abstratas; agora um balao de fala 3D (a fala do personagem) com as aspas brancas
# em relevo dentro dele: a fala reproduzida entre aspas (discurso direto) x a fala relatada pelo narrador.
from _por import *
cena_p()
corpo = placa(balao(1.3, 1.0, 0.36, -0.25, -1, tam_rabo=0.38), 0.26, plastico('#1f5fd6', 0.28), chanfro=0.08, seg_ch=6)
m = plastico('#ffffff', 0.3)
q = txt('“”', (0.0, -0.2, 0.265), 1.7, m, extr=0.04, bevel=0.01, fonte=SERIF)
g = grupo([corpo, q], loc=(0, 0, 0.71), rot=(math.radians(90), 0, math.radians(-26)))
no_chao(g)
render(saida('P10.5'), elev=20, azim=-12)

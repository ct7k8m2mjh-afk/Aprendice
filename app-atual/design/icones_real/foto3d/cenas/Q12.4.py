import sys, os, math, random; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _qui import *
# Dipeptideo glicil-alanina: a ligacao peptidica C(=O)-N (destacada em dourado) une dois aminoacidos -> proteinas
cena_q()
at, lig = coords_rdkit('NCC(=O)NC(C)C(=O)O', seed=4)
at = orienta_pca(at, (-35, 0, 0))
molecula(at, lig, r_lig=0.07, destaque={(2, 4): '#d4a52a'})
render(out('Q12.4'))

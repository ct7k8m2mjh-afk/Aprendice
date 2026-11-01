import sys, os, math, random; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _qui import *
# Etanol (CH3-CH2-OH): o grupo OH ligado a carbono saturado caracteriza a funcao alcool (oxigenada)
cena_q()
at, lig = coords_rdkit('CCO', seed=3)
at = orienta_pca(at, (-20, 0, 25))
molecula(at, lig, r_lig=0.08)
render(out('Q11.3'))

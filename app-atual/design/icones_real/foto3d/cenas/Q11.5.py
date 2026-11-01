import sys, os, math, random; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _qui import *
# Isomeria plana de cadeia: butano (normal) e metilpropano (ramificado), ambos C4H10
cena_q()
a1, l1 = coords_rdkit('CCCC', seed=2)
a1 = orienta_pca(a1, (-30, 0, 0))
a2, l2 = coords_rdkit('CC(C)C', seed=2)
a2 = orienta_pca(a2, (-30, 0, 0))
molecula(a1, l1, loc=(-2.7, 0.6, 0), r_lig=0.075, z_min=0.55)
molecula(a2, l2, loc=(2.7, -0.6, 0), r_lig=0.075, z_min=0.55)
cilindro((-2.7, 0.6, 0.08), 2.1, 0.16, plastico('#1f5fd6', 0.3), chanfro=0.05)
cilindro((2.7, -0.6, 0.08), 1.6, 0.16, plastico('#f2b705', 0.3), chanfro=0.05)
render(out('Q11.5'), elev=26)

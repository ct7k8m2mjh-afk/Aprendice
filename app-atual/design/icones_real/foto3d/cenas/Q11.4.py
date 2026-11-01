import sys, os, math, random; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _qui import *
# Paracetamol (C8H9NO2): amida (funcao nitrogenada) + fenol no mesmo composto -> funcao mista
cena_q()
at, lig = coords_rdkit('CC(=O)Nc1ccc(O)cc1', seed=5)
at = orienta_pca(at, (-18, 0, -55))
molecula(at, lig, r_lig=0.07)
render(out('Q11.4'))

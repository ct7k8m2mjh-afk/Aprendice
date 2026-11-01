import sys, os, math, random; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _qui import *
# 2-metilbutano (C5H12): cadeia aberta, ramificada, saturada; carbonos primarios, secundario e terciario
cena_q()
at, lig = coords_rdkit('CCC(C)C', seed=11)
at = orienta_pca(at, (10, 0, -10))
molecula(at, lig, r_lig=0.075)
render(out('Q11.1'))

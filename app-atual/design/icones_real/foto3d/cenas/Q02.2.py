import sys, os, math, random; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _qui import *
# Acrilonitrila CH2=CH-C#N: ligacoes covalentes simples, dupla e tripla na mesma molecula (geometria do RDKit)
cena_q()
at, lig = coords_rdkit('C=CC#N')
at = orienta_pca(at, (8, 0, -14))
molecula(at, lig, r_lig=0.085)
render(out('Q02.2'))

# P06.3 figuras de som: sino de mao de bronze com cabo de madeira (o som que se repete: aliteracao, assonancia)
from _por import *
cena_p()
br = metal('#c58a2e', 0.22)
perf = [(0.62, 0.0), (0.63, 0.03), (0.6, 0.08), (0.5, 0.2), (0.42, 0.38), (0.38, 0.6), (0.36, 0.78), (0.3, 0.88), (0.15, 0.94), (0.0, 0.95)]
ext = torno(perf, br, seg=128)
so = ext.modifiers.new('so', 'SOLIDIFY'); so.thickness = 0.03; so.offset = -1
toro((0, 0, 0.01), 0.615, 0.022, br)
for z, r in ((0.22, 0.495), (0.26, 0.48)): toro((0, 0, z), r, 0.008, br)
cab = madeira('#6e3b1a', '#4a250e', 10)
torno([(0, 0.93), (0.1, 0.93), (0.1, 0.98), (0.06, 1.02), (0.055, 1.2), (0.075, 1.35), (0.085, 1.55), (0.07, 1.66), (0.0, 1.68)], cab)
cilindro((0, 0, 0.98), 0.11, 0.05, br)
esfera((0.12, -0.2, 0.09), 0.09, metal('#8a6222', 0.3))
g = [o for o in bpy.context.scene.objects if o.type == 'MESH' and o.name != 'CHAO']
e = grupo(g, rot=(0, math.radians(-12), 0)); no_chao(e)
render(saida('P06.3'), elev=20, azim=-16)

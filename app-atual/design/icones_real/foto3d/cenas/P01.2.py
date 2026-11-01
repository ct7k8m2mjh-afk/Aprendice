# P01.2 informacao explicita x inferencia: chapeu fedora de detetive (feltro cinza-azulado, fita escura) - deduzir o que nao esta escrito
from _por import *
cena_p()
fel = ruido_cor('#5a4634', '#6e5640', 30, 0.75, bump=0.08)
# aba: anel com a borda levemente virada para cima nas laterais (deformada depois)
aba = torno([(0.42, 0.0), (0.62, 0.0), (0.8, 0.03), (0.84, 0.07), (0.82, 0.08), (0.78, 0.06), (0.62, 0.035), (0.42, 0.035)], fel, seg=128)
for v in aba.data.vertices:
    r = math.hypot(v.co.x, v.co.y)
    if r > 0.5:
        a = math.atan2(v.co.y, v.co.x); v.co.z += 0.2 * (r - 0.5) / 0.34 * abs(math.cos(a)) ** 2 - 0.12 * (r - 0.5) / 0.34 * max(0, -math.sin(a)) ** 2
sd = aba.modifiers.new('sd', 'SUBSURF'); sd.levels = 2
# copa com vinco no topo
cop = torno([(0.0, 0.6), (0.12, 0.61), (0.28, 0.74), (0.4, 0.7), (0.46, 0.45), (0.5, 0.2), (0.52, 0.0)], fel, seg=128)
for v in cop.data.vertices:
    v.co.y *= 0.86
    if v.co.z > 0.38 and v.co.y < 0: v.co.x *= 1 - 0.3 * min(1, (v.co.z - 0.38) / 0.32) * min(1, -v.co.y / 0.35)   # pinca da frente (copa em gota)
sd = cop.modifiers.new('sd', 'SUBSURF'); sd.levels = 2
fita = torno([(0.513, 0.03), (0.515, 0.17), (0.497, 0.17), (0.495, 0.03)], plastico('#1c1a1e', 0.45), seg=128)
for v in fita.data.vertices: v.co.y *= 0.86
# laco lateral
caixa((0.5, -0.05, 0.1), (0.05, 0.12, 0.12), plastico('#1c1a1e', 0.45), chanfro=0.02)
g = grupo([aba, cop, fita] + [o for o in bpy.context.scene.objects if o.name.startswith('Cube')], rot=(0, 0, math.radians(-20)))
no_chao(g)
render(saida('P01.2'), elev=24, azim=-28)

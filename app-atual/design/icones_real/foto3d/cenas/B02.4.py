# B02.4 enzimas: enzima globular em modelo de preenchimento espacial (atomos como esferas, superficie rugosa de proteina) com o
# sitio ativo em encaixe e o substrato de forma complementar entrando nele: especificidade (modelo chave-fechadura /
# encaixe induzido). Revisao 31/10 (segunda lente).
import sys; sys.path[:0] = ['/home/claude/escadas-sc/design/icones_real/foto3d', '/home/claude/escadas-sc/design/icones_real/foto3d/cenas']
from _bio2 import *
cena(); random.seed(9)
tons = [org(h, h, cav='#0a1440', sss=.2, rugos=.3, coat=.5, bump=0, esc=3, ao=.08) for h in ('#2f6fe0', '#3b82ea', '#2a5cc8', '#4a90f0', '#6aa8f5')]
sub = org('#f28c1a', '#f5a030', cav='#5a2a00', sss=.2, rugos=.25, coat=.6, bump=0, esc=3, ao=.08)
# esferas de "atomos" preenchendo um elipsoide irregular, exceto a fenda do sitio ativo (no topo-frente)
base = bpy.data.meshes.new('at')
bpy.ops.mesh.primitive_uv_sphere_add(radius=1, segments=20, ring_count=10); proto = bpy.context.object
for p in proto.data.polygons: p.use_smooth = True
protos = []
for m in tons:
    me = proto.data.copy(); me.materials.append(m); protos.append(me)
bpy.data.objects.remove(proto, do_unlink=True)
pocket = V((.1, -.55, 1.55)); pr = .62
def dentro(p):
    q = V((p.x / 1.35, p.y / 1.05, (p.z - .95) / .95))
    n = math.sin(p.x * 2.1) * .08 + math.sin(p.y * 2.7 + 1) * .08 + math.sin(p.z * 2.3 + 2) * .08
    return q.length < 1 + n
cnt = 0
for i in range(6000):
    p = V((random.uniform(-1.5, 1.5), random.uniform(-1.2, 1.2), random.uniform(-.1, 2.0)))
    if not dentro(p): continue
    q = V((p.x / 1.35, p.y / 1.05, (p.z - .95) / .95))
    if q.length < .78: continue          # so a casca (economia)
    if (p - pocket).length < pr: continue
    r = random.uniform(.13, .19)
    o = bpy.data.objects.new('a', protos[random.randrange(len(protos))]); bpy.context.scene.collection.objects.link(o)
    o.location = p; o.scale = (r, r, r); cnt += 1
print('atomos', cnt)
# substrato: molecula pequena de forma complementar, saindo do sitio ativo
S = pocket + V((.15, -.35, .45))
for d in [(0, 0, 0), (.22, .05, .12), (-.2, .08, .1), (.05, .2, -.2), (.25, -.1, -.15), (-.15, -.12, -.18)]:
    esfera(S + V(d) * 1.2, .2, sub, seg=32)
chao_auto()
sai('B02.4', elev=26, azim=-12)

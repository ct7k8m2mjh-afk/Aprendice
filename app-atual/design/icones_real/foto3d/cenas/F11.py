# F11 Eletricidade e circuitos: pilha AA em pe (corpo preto brilhante, faixa dourada com "+", "-" branco no corpo,
# tampa prateada), fio vermelho grosso em laco retangular de cantos arredondados ate uma lampada incandescente acesa
# (vidro amarelo quente com filamento, rosca prateada, soquete cinza-escuro) e voltando pelo chao a base da pilha.
# Render em camadas (pilha / fio / lampada). 03/11.
import sys, os, math; sys.path[:0] = ['/home/claude/escadas-sc/design/icones_real/foto3d', '/home/claude/escadas-sc/design/icones_real/foto3d/cenas']
from _qui import *
from _bk import tubo
from camadas import parte, render_camadas
V = mathutils.Vector

sc = cena_q()

def objs_novos(antes):
    return [o for o in bpy.context.scene.objects if o.name not in antes and o.type in ('MESH', 'FONT', 'CURVE')]

def nomes():
    return {o.name for o in bpy.context.scene.objects}

# ---------------- pilha ----------------
a0 = nomes()
PR, PH = 0.6, 2.2          # raio e altura do corpo
preto = plastico('#0d0d0f', 0.18); preto.node_tree.nodes['Principled BSDF'].inputs['Coat Weight'].default_value = 0.8
ouro = plastico('#f4b20c', 0.22); ouro.node_tree.nodes['Principled BSDF'].inputs['Coat Weight'].default_value = 0.8
ouro.node_tree.nodes['Principled BSDF'].inputs['Metallic'].default_value = 0.35
prata = metal('#c9ccd1', 0.18)
ZB = 1.3                  # inicio da faixa dourada
# corpo preto (perfil com cantos arredondados embaixo)
torno([(0, 0), (PR - .06, 0), (PR - .015, .015), (PR, .06), (PR, ZB)], preto, fechado=False, nome='pilha_corpo')
torno([(PR + .002, ZB - .003), (PR + .002, PH - .05), (PR - .015, PH - .012), (PR - .06, PH), (0, PH)], ouro, fechado=False, nome='pilha_faixa')
torno([(0, PH - .01), (.27, PH - .01), (.27, PH + .16), (.25, PH + .19), (0, PH + .19)], prata, fechado=False, nome='pilha_tampa')
# sinais: "+" preto na faixa dourada, "-" branco no corpo preto (barrinhas finas encostadas na superficie, de frente para a camera)
def barra(cx, z, w, h, m, rot_y=0):
    o = caixa((cx, -PR - .005, z), (w, .03, h), m, chanfro=.012)
    return o
mp = fosco('#0a0a0a', 0.45); mb = plastico('#f4f4f2', 0.35)
tp = texto('+', (0, -PR - .005, 1.78), 1.05, mp, extr=.012, fonte=INTER)
barra(0, .62, .32, .07, mb)
pilha = objs_novos(a0)
for o in pilha:
    o.location.x -= 0; o.rotation_euler.z += 0
# sinais curvos: dobra as barras sobre o cilindro com modificador SimpleDeform seria excessivo; barras finas bastam
PX = 0.0

# ---------------- lampada ----------------
a1 = nomes()
LX, LY = 3.15, 0.25
cinza = metal('#6b6e73', 0.35); cinza.node_tree.nodes['Principled BSDF'].inputs['Coat Weight'].default_value = 0.4
torno([(0, 0), (.7, 0), (.74, .03), (.76, .08), (.76, .4), (.73, .47), (.66, .5), (0, .5)], cinza, loc=(LX, LY, 0), fechado=False, nome='soquete')
# rosca prateada: aneis empilhados
ros = metal('#c8cbcf', 0.2)
perf = [(0, .48), (.44, .48), (.46, .5), (.46, .56), (.44, .58), (.37, .58)]
for k in range(3):
    z = .63 + k * .1
    perf += [(.37, z - .04), (.41, z), (.37, z + .04)]
perf += [(.37, .9), (.34, .93), (0, .93)]
torno(perf, ros, loc=(LX, LY, 0), fechado=False, nome='rosca')
# vidro: pescoco + globo (perfil de revolucao)
g = []
RG, ZG = .86, 2.0
for i in range(0, 41):
    t = i / 40
    if t < .35:     # pescoco subindo da rosca
        u = t / .35; r = .36 + .14 * u * u; z = .9 + .55 * u
    else:
        u = (t - .35) / .65
        ang = -math.radians(50) + u * math.radians(140)   # do lado de baixo do globo ate o polo
        r = RG * math.cos(ang); z = ZG + RG * math.sin(ang)
    g.append((max(r, 0), z))
g[-1] = (0, ZG + RG)
vb = bpy.data.materials.new('vidro_lamp'); vb.use_nodes = True; b = vb.node_tree.nodes['Principled BSDF']
b.inputs['Base Color'].default_value = cor('#ffd860'); b.inputs['Transmission Weight'].default_value = 0.72
b.inputs['Roughness'].default_value = 0.18; b.inputs['IOR'].default_value = 1.2
b.inputs['Emission Color'].default_value = cor('#ffb52e'); b.inputs['Emission Strength'].default_value = 0.35
b.inputs['Coat Weight'].default_value = 0.6
gl = torno([(0, .9)] + g, vb, loc=(LX, LY, 0), fechado=False, nome='vidro')
# filamento: haste de vidro + dois fios + espiral
fil = emissivo('#fff6d8', 25)
fio_suporte = emissivo('#ffd890', 3)
tubo([(LX - .07, LY, 1.0), (LX - .07, LY, 1.35), (LX - .2, LY, 2.05)], .016, fio_suporte, tipo='POLY')
tubo([(LX + .07, LY, 1.0), (LX + .07, LY, 1.35), (LX + .2, LY, 2.05)], .016, fio_suporte, tipo='POLY')
cilindro((LX, LY, 1.15), .08, .35, vidro('#f6f2e6', 0.05))
esp = []
for i in range(161):
    t = i / 160; x = -.2 + .4 * t; a = t * 2 * math.pi * 9
    esp.append((LX + x, LY + .03 * math.sin(a), 2.05 + .035 * math.cos(a) + .1 * math.sin(math.pi * t)))
tubo(esp, .018, fil, tipo='POLY')
# luz interna quente
bpy.ops.object.light_add(type='POINT', location=(LX, LY, 2.0)); Lb = bpy.context.object; Lb.data.energy = 25
Lb.data.color = (1, .78, .35); Lb.data.shadow_soft_size = .3
lampada = objs_novos(a1)

# ---------------- fio ----------------
a2 = nomes()
def arredonda(cantos, r, n=10):
    """polilinha com cantos arredondados (raio r)"""
    P = [V(c) for c in cantos]; out = [P[0]]
    for i in range(1, len(P) - 1):
        a, b, c = P[i - 1], P[i], P[i + 1]
        d1 = (a - b).normalized(); d2 = (c - b).normalized()
        rr = min(r, (a - b).length * .45, (c - b).length * .45)
        p1 = b + d1 * rr; p2 = b + d2 * rr
        for k in range(n + 1):
            t = k / n   # Bezier quadratica p1-b-p2
            out.append((1 - t) ** 2 * p1 + 2 * (1 - t) * t * b + t * t * p2)
    out.append(P[-1]); return [tuple(p) for p in out]
WR = .085
vermelho = plastico('#d81e1e', 0.2); vermelho.node_tree.nodes['Principled BSDF'].inputs['Coat Weight'].default_value = 0.7
XM = 1.6; ZT = 2.95; ZS = .2
cima = arredonda([(PX, 0, PH + .1), (PX, 0, ZT), (XM, 0, ZT), (XM, 0, ZS + .0), (XM, LY, ZS), (LX - .6, LY, ZS)], .32)
tubo(cima, WR, vermelho, tipo='POLY')
baixo = arredonda([(LX + .6, LY, ZS), (LX + 1.05, LY, ZS), (LX + 1.05, LY, WR), (LX + 1.05, -.75, WR), (PX - .1, -.75, WR), (PX - .1, -.1, WR)], .3)
tubo(baixo, WR, vermelho, tipo='POLY')
fio = objs_novos(a2)

parte('pilha', pilha); parte('fio', fio); parte('lampada', lampada)
render_camadas('F11', folga=float(os.environ.get('FOLGA', 1.08)), elev=float(os.environ.get('ELEV', 24)), azim=float(os.environ.get('AZIM', -8)))

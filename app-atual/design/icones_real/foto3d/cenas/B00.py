# B00 ícone principal de Biologia (03/11): célula animal em corte, como na referência aprovada pelo dono
# (REFERENCIA_bio.png, cartão Citologia): membrana laranja espessa, citoplasma creme, núcleo roxo em corte com nucléolo,
# retículo endoplasmático azul em arcos ao redor do núcleo, complexo golgiense magenta, duas mitocôndrias laranja
# com cristas, um lisossomo verde e vesículas. Construído em peças separadas para animação (camadas.py).
import sys; sys.path[:0] = ['/home/claude/escadas-sc/design/icones_real/foto3d', '/home/claude/escadas-sc/design/icones_real/foto3d/cenas']
from _bio2 import *
from camadas import parte, render_camadas
cena(); random.seed(7)

laranja = org('#f28a1e', '#f6a838', cav='#7a3a00', sss=.35, rugos=.28, coat=.6, bump=.15, esc=5, ao=.1)
creme = org('#f7d38e', '#f1c47a', cav='#b07a40', sss=.5, rugos=.45, coat=.25, bump=.25, esc=9, ao=.08)
roxo = org('#6a3ad0', '#7a48dc', cav='#20084a', sss=.3, rugos=.3, coat=.6, bump=.15, esc=6, ao=.08)
roxo_int = org('#8a62e6', '#9a74ea', cav='#3a1a7a', sss=.4, rugos=.4, coat=.3, bump=.35, esc=12, ao=.08)
nucleolo = org('#5a24b8', '#6a30c8', cav='#14043a', sss=.2, rugos=.22, coat=.8, bump=0)
azul = org('#3f6fe0', '#5a86ee', cav='#0a1a5a', sss=.3, rugos=.3, coat=.6, bump=.15, esc=7, ao=.06)
magenta = org('#c04ad0', '#b03ac0', cav='#40084a', sss=.3, rugos=.3, coat=.6, bump=.15, esc=7, ao=.06)
lilas = org('#5a5ae0', '#6a4ad8', cav='#10104a', sss=.3, rugos=.3, coat=.6, bump=.15, esc=7, ao=.06)
mito_ext = org('#f07a18', '#f59028', cav='#6a2a00', sss=.3, rugos=.3, coat=.65, bump=.1, esc=6)
mito_int = org('#e8441a', '#f05a22', cav='#5a1000', sss=.3, rugos=.35, coat=.4, bump=.2, esc=8)
crista = org('#f8b030', '#f6c040', cav='#7a4a00', sss=.2, rugos=.3, coat=.5, bump=.1)
verde = org('#4aa83a', '#3a9030', cav='#0a3a08', sss=.3, rugos=.45, coat=.35, bump=.6, esc=14, ao=.06)
ribo = org('#1c2c8a', '#24349a', cav='#060a30', sss=.1, rugos=.3, coat=.5, bump=0)
ves = org('#5a8af0', '#6a9af6', cav='#1a2a6a', sss=.2, rugos=.2, coat=.7, bump=0)

def fita(pts, r, m, achata=.75):
    """tubo achatado na vertical (escala em torno do próprio centro, não da origem do mundo)"""
    cx = sum(p[0] for p in pts) / len(pts); cy = sum(p[1] for p in pts) / len(pts); cz = sum(p[2] for p in pts) / len(pts)
    o = tubo([(p[0] - cx, p[1] - cy, p[2] - cz) for p in pts], r, m)
    o.location = (cx, cy, cz); o.scale = (1, 1, achata); return o

TOPO = .70      # altura do corte (face de cima da membrana)
CHAO_C = .655    # altura do citoplasma (fundo da cavidade)

# ---- membrana + citoplasma (a "bandeja" da célula)
corpo = esfera((0, 0, .5), 1, laranja, seg=128); corpo.scale = (1, 1, .5); bpy.ops.object.transform_apply(scale=True)
bpy.ops.mesh.primitive_cube_add(size=4, location=(0, 0, TOPO + 2)); dif(corpo, bpy.context.object)
oco = esfera((0, 0, .8), .92, None, seg=128); oco.scale = (1, 1, .28); bpy.ops.object.transform_apply(scale=True); dif(corpo, oco)
bpy.ops.mesh.primitive_cylinder_add(radius=.86, depth=.16, location=(0, 0, CHAO_C - .08), vertices=128)
cito = bpy.context.object; cito.data.materials.append(creme); desloca(cito, .006, .12)
parte('membrana', [corpo, cito])

Z = CHAO_C
# ---- núcleo: casca roxa (carioteca) com miolo mais claro; um quarto removido na frente mostra o interior e o nucléolo
NC = (0.02, .1, Z + .06); RN = .38
def _quarto(o):
    bpy.ops.mesh.primitive_cube_add(size=1, location=(NC[0] - .5, NC[1] - .5, NC[2] + .5)); return dif(o, bpy.context.object)
nuc = esfera(NC, RN, roxo, seg=128); nuc.scale = (1, 1, .85); bpy.ops.object.transform_apply(scale=True)
oco_n = esfera(NC, RN - .045, None, seg=128); oco_n.scale = (1, 1, .85); bpy.ops.object.transform_apply(scale=True); dif(nuc, oco_n); _quarto(nuc)
dentro = esfera(NC, RN - .046, roxo_int, seg=128); dentro.scale = (1, 1, .85); bpy.ops.object.transform_apply(scale=True); _quarto(dentro)
nl = esfera((NC[0] - .1, NC[1] - .1, NC[2] + .09), .14, nucleolo, seg=64)
parte('nucleo', [nuc, dentro, nl])

# ---- retículo endoplasmático: arcos azuis concêntricos achatados em volta do núcleo
ret = []
for k, R in enumerate((.43, .49, .55, .61, .67)):
    a0, a1 = math.radians(-60 + k * 4), math.radians(235 - k * 3)
    pts = []
    for j in range(40):
        a = a0 + (a1 - a0) * j / 39
        r = R + .012 * math.sin(a * 7 + k)
        pts.append((.02 + r * math.cos(a), .08 + r * math.sin(a) * .95, Z + .03 + .012 * math.sin(a * 5)))
    ret.append(fita(pts, .026, azul, .7))
    for p_ in pts[2:-2:3]:   # ribossomos aderidos (retículo RUGOSO)
        ret.append(esfera((p_[0] * 1.035, p_[1] * 1.035, p_[2] + .012), .011, ribo, seg=12))
    ret.append(fita([(p[0] * .985, p[1] * .985, p[2] + .035) for p in pts[4:-4]], .022, azul, .7))
parte('reticulo', ret)

# ---- complexo golgiense: sacos magenta empilhados (embaixo, à frente) e um segundo, lilás, atrás à direita
gol = []
for k in range(5):
    pts = []
    for j in range(24):
        a = math.radians(200 + 120 * j / 23)
        r = .22 + k * .05
        pts.append((-.08 + r * math.cos(a) * 1.25, -.3 + r * math.sin(a) * .7, Z + .04))
    gol.append(fita(pts, .032 - k * .002, magenta, .7))
for k in range(4):
    pts = []
    for j in range(18):
        a = math.radians(20 + 100 * j / 17)
        r = .12 + k * .045
        pts.append((.16 + r * math.cos(a) * 1.25, .48 + r * math.sin(a) * .8, Z + .035))
    gol.append(fita(pts, .026, lilas, .7))
for (x, y) in ((-.3, -.62), (-.08, -.66), (.14, -.62), (.0, -.74)):   # vesículas saindo da face trans rumo à membrana
    gol.append(esfera((x, y, Z + .04), .028, magenta, seg=24))
parte('golgi', gol)
# centrossomo: dois centríolos em ângulo reto, junto ao núcleo
cen_m = org('#2e9e8a', '#36ae98', cav='#0a3a30', sss=.2, rugos=.3, coat=.6, bump=0)
c1 = cilindro((.42, .44, Z + .05), .028, .11, cen_m, rot=(0, math.radians(90), math.radians(30)))
c2 = cilindro((.47, .48, Z + .07), .028, .11, cen_m, rot=(0, 0, 0))
parte('centrossomo', [c1, c2])

# ---- mitocôndrias: cápsula laranja aberta em cima, interior vermelho-alaranjado com cristas amarelas em zigue-zague
mitos = []
for (x, y, ang) in ((-.66, .12, 80), (.66, -.06, 100)):
    ext = esfera((0, 0, 0), 1, mito_ext, seg=64); ext.scale = (.12, .24, .09); bpy.ops.object.transform_apply(scale=True)
    bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, .5 + .035)); dif(ext, bpy.context.object)
    inn = esfera((0, 0, 0), 1, mito_int, seg=64); inn.scale = (.095, .205, .065); bpy.ops.object.transform_apply(scale=True)
    cr = []
    for j in range(8):
        yy = -.16 + j * .046
        cr.append(tubo([(-.08, yy, .035), (0, yy + .014, .05), (.08, yy, .035)], .011, crista))
    grupo = [ext, inn] + cr
    for o in grupo:
        o.location = (o.location.x, o.location.y, o.location.z)
    import mathutils as _m
    M = _m.Matrix.Translation((x, y, Z + .06)) @ _m.Matrix.Rotation(math.radians(ang), 4, 'Z')
    for o in grupo:
        o.matrix_world = M @ o.matrix_world
    mitos += grupo
parte('mitocondrias', mitos)

# ---- lisossomo verde (rugoso) e vesículas azuis pequenas espalhadas
lis = blob([('BALL', (-.5, -.42, Z + .06), .12), ('BALL', (-.45, -.36, Z + .07), .09),
            ('BALL', (-.56, -.36, Z + .05), .08)], verde, res=.012)
desloca(lis, .012, .05)
vs = []
for k in range(26):
    for _ in range(50):
        a = random.uniform(0, 6.283); r = random.uniform(.6, .78)
        x, y = r * math.cos(a), r * math.sin(a)
        if (x - .02) ** 2 + (y - .08) ** 2 < .7 ** 2: continue
        break
    vs.append(esfera((x, y, Z + .015), random.uniform(.012, .022), ves, seg=24))
parte('vesiculas', [lis] + vs)

bpy.context.view_layer.update()
mover_tudo(-min((corpo.matrix_world @ v.co).z for v in corpo.data.vertices))   # base da membrana no chão
render_camadas('B00', elev=60, azim=-10, folga=1.2, fundo=('membrana',))

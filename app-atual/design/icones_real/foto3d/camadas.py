"""Render em CAMADAS para ícones animáveis (03/11, pedido do dono: ícones construídos, não PNG colado).

Uso numa cena (depois de montar os objetos com o kit):
    from camadas import parte, render_camadas
    parte('pilha', [obj1, obj2])        # agrupa objetos numa peça animável
    parte('lampada', [obj3])
    render_camadas('F11', elev=28, azim=-18)

Gera em ICONE_SAIDA (padrão: foto3d/camadas/<ID>/):
  completo.png  - o ícone inteiro (referência de conferência)
  sombra.png    - só a sombra no chão (luz de frente e de cima: a sombra cai para TRÁS do objeto)
  <peça>.png    - cada peça sozinha, inteira (sem ser tapada pelas outras), na mesma câmera
  camadas.json  - ordem (do fundo para a frente), centro de cada peça em % e tamanho
A tela compõe: sombra + peças na ordem. Ao passar o mouse, cada peça se afasta um pouco do centro.
"""
import bpy, math, mathutils, os, json
from kit import *

_PARTES = {}
_TRAJETOS = {}   # caminhos (pontos no mundo) para animações desenhadas por cima: ex. a corrente correndo no fio
_PONTOS = {}     # pontos de interesse (ex.: centro do vidro da lâmpada, onde o brilho acende)


def trajeto(nome, pts):
    _TRAJETOS[nome] = [tuple(p) for p in pts]


def ponto(nome, p, raio=0.0):
    _PONTOS[nome] = (tuple(p), raio)


def parte(nome, objs):
    _PARTES[nome] = list(objs)
    return objs


def _objs_cena():
    return [o for o in bpy.context.scene.objects if o.type in ('MESH', 'FONT', 'CURVE') and o.name != 'CHAO']


def _camera(elev, azim, lente, folga):
    sc = bpy.context.scene
    pts = []
    dg = bpy.context.evaluated_depsgraph_get()
    for o in _objs_cena():
        oe = o.evaluated_get(dg)
        if o.type == 'CURVE':
            try:
                me = oe.to_mesh(); pts += [oe.matrix_world @ v.co for v in me.vertices]; oe.to_mesh_clear(); continue
            except Exception:
                pass
        pts += [oe.matrix_world @ mathutils.Vector(c) for c in oe.bound_box]
    lo = mathutils.Vector((min(p.x for p in pts), min(p.y for p in pts), min(p.z for p in pts)))
    hi = mathutils.Vector((max(p.x for p in pts), max(p.y for p in pts), max(p.z for p in pts)))
    centro = (lo + hi) / 2; raio = (hi - lo).length / 2
    print('ENQUADRA', tuple(round(v, 2) for v in lo), tuple(round(v, 2) for v in hi))
    cam_d = bpy.data.cameras.new('c'); cam_d.lens = lente
    cam = bpy.data.objects.new('cam', cam_d); sc.collection.objects.link(cam); sc.camera = cam
    e = math.radians(elev); a = math.radians(azim)
    dirv = mathutils.Vector((math.sin(a) * math.cos(e), -math.cos(a) * math.cos(e), math.sin(e)))
    fov = 2 * math.atan(18 / lente)
    cam.location = centro + dirv * (raio * folga / math.sin(fov / 2))
    cam.rotation_euler = (centro - cam.location).to_track_quat('-Z', 'Y').to_euler()
    # ajuste fino: o objeto ocupa o quadro (margem = folga) e fica centrado, medindo a projeção real dos pontos
    from bpy_extras.object_utils import world_to_camera_view
    for _ in range(4):
        bpy.context.view_layer.update()
        q = [world_to_camera_view(sc, cam, p) for p in pts]
        x0, x1 = min(v.x for v in q), max(v.x for v in q); y0, y1 = min(v.y for v in q), max(v.y for v in q)
        ext = max(x1 - x0, y1 - y0)
        R = cam.matrix_world.to_3x3()
        d = (cam.location - centro).length
        meia = d * math.tan(fov / 2)                     # meia largura do quadro na distância do centro
        cam.location += R @ mathutils.Vector((((x0 + x1) / 2 - .5) * 2 * meia, ((y0 + y1) / 2 - .5) * 2 * meia, 0))
        alvo = 1 / folga
        cam.location = centro + (cam.location - centro) * (ext / alvo)
    return cam


def _profundidade(cam, objs):
    dg = bpy.context.evaluated_depsgraph_get()
    pts = []
    for o in objs:
        oe = o.evaluated_get(dg)
        pts += [oe.matrix_world @ mathutils.Vector(c) for c in oe.bound_box]
    c = sum(pts, mathutils.Vector()) / len(pts)
    return (c - cam.location).length


def _visiveis(nomes_peca):
    """Só as peças em nomes_peca aparecem para a câmera; as demais continuam projetando sombra/reflexo."""
    alvo = set()
    for n in nomes_peca:
        alvo |= {o.name for o in _PARTES[n]}
    for o in _objs_cena():
        o.visible_camera = o.name in alvo


def render_camadas(ID, tam=None, elev=30, azim=-18, lente=50, folga=1.08, amostras=96, fundo=()):
    """fundo: peças que contêm as outras (ex.: a membrana da célula) e ficam sempre atrás na composição."""
    sc = bpy.context.scene
    tam = int(os.environ.get('ICONE_TAM', tam or 1024))
    sc.render.resolution_x = sc.render.resolution_y = tam
    sc.cycles.samples = int(os.environ.get('ICONE_AMOSTRAS', amostras))
    sc.render.image_settings.file_format = 'PNG'; sc.render.image_settings.color_mode = 'RGBA'
    saida = os.environ.get('ICONE_SAIDA') or os.path.join(os.path.dirname(os.path.abspath(__file__)), 'camadas', ID)
    os.makedirs(saida, exist_ok=True)
    # peças: o que não foi agrupado vira a peça "corpo"
    soltos = [o for o in _objs_cena() if not any(o in v for v in _PARTES.values())]
    if soltos:
        _PARTES.setdefault('corpo', []).extend(soltos)
    # luz do padrão do dono (03/11): de frente e bem de cima -> sombra curta, colada na base (objeto apoiado no chão),
    # caindo um pouco para trás; nunca na frente. Luz grande = sombra macia; contato escuro na linha da base.
    K = bpy.data.objects.get('KEY')
    if K:
        K.location = (-0.6, -3.0, 8.0); K.data.size = 6; K.data.energy = 780
        K.rotation_euler = (mathutils.Vector((0, 0, 0)) - K.location).to_track_quat('-Z', 'Y').to_euler()
    cam = _camera(elev, azim, lente, folga)
    chao = bpy.data.objects.get('CHAO')

    def _proj():
        from bpy_extras.object_utils import world_to_camera_view
        bpy.context.view_layer.update()
        def pr(p):
            v = world_to_camera_view(sc, cam, mathutils.Vector(p)); return [round(v.x * tam, 1), round((1 - v.y) * tam, 1)]
        out = {'trajetos': {n: [pr(p) for p in pts] for n, pts in _TRAJETOS.items()}, 'pontos': {}}
        for n, (p, r) in _PONTOS.items():
            c = pr(p); borda = pr((p[0] + r, p[1], p[2])); out['pontos'][n] = {'xy': c, 'r': round(abs(borda[0] - c[0]), 1)}
        arq = os.path.join(saida, 'camadas.json')
        base = json.load(open(arq)) if os.path.exists(arq) else {'id': ID, 'tam': tam}
        base.update(out); json.dump(base, open(arq, 'w'), ensure_ascii=False, indent=1)
    if os.environ.get('SO_TRAJETO'):
        _proj(); print('trajetos', ID, list(_TRAJETOS)); return

    def faz(nome):
        sc.render.filepath = os.path.join(saida, nome + '.png')
        bpy.ops.render.render(write_still=True)

    # 1) completo
    _visiveis(list(_PARTES)); chao.hide_render = False; faz('completo')
    if os.environ.get('SO_COMPLETO'):
        return
    # 2) só a sombra (peças invisíveis à câmera mas projetando sombra no chão)
    _visiveis([]); faz('sombra')
    # 3) cada peça sozinha, sem chão
    chao.hide_render = True
    for n in _PARTES:
        _visiveis([n]); faz(n)
    chao.hide_render = False
    ordem = [n for n in fundo if n in _PARTES] + sorted([n for n in _PARTES if n not in fundo], key=lambda n: -_profundidade(cam, _PARTES[n]))   # mais longe primeiro
    json.dump({'id': ID, 'tam': tam, 'ordem': ordem}, open(os.path.join(saida, 'camadas.json'), 'w'), ensure_ascii=False, indent=1)
    _proj()
    print('camadas', ID, ordem, '->', saida)


def render_quadros(ID, passo, n=24, tam=None, elev=30, azim=-18, lente=50, folga=1.12, amostras=48):
    """Animação pela FUNÇÃO do objeto, em 3D de verdade: passo(t) move a cena (t de 0 a 1, ciclo fechado:
    o quadro n seria igual ao 0). Renderiza n quadros do ícone completo (com chão/sombra) na MESMA câmera.
    Saída: <saida>/quadros/q00.png ... e quadros.json. O quadro 0 é o ícone parado.
    Use antes de render_camadas() ou sozinho (SO_QUADROS=1)."""
    sc = bpy.context.scene
    tam = int(os.environ.get('QUADRO_TAM', tam or 512))
    sc.render.resolution_x = sc.render.resolution_y = tam
    sc.cycles.samples = int(os.environ.get('QUADRO_AMOSTRAS', amostras))
    sc.render.image_settings.file_format = 'PNG'; sc.render.image_settings.color_mode = 'RGBA'
    saida = os.environ.get('ICONE_SAIDA') or os.path.join(os.path.dirname(os.path.abspath(__file__)), 'camadas', ID)
    pasta = os.path.join(saida, 'quadros'); os.makedirs(pasta, exist_ok=True)
    K = bpy.data.objects.get('KEY')
    if K:
        K.location = (-0.6, -3.0, 8.0); K.data.size = 6; K.data.energy = 780
        K.rotation_euler = (mathutils.Vector((0, 0, 0)) - K.location).to_track_quat('-Z', 'Y').to_euler()
    passo(0.0)
    cam = sc.camera if sc.camera and sc.camera.name == 'cam' else _camera(elev, azim, lente, folga)
    for o in _objs_cena():
        o.visible_camera = True
    n = int(os.environ.get('QUADROS_N', n))
    for f in range(n):
        passo(f / n)
        bpy.context.view_layer.update()
        sc.render.filepath = os.path.join(pasta, 'q%02d.png' % f)
        bpy.ops.render.render(write_still=True)
    json.dump({'id': ID, 'n': n, 'tam': tam}, open(os.path.join(pasta, 'quadros.json'), 'w'))
    passo(0.0)
    print('quadros', ID, n, '->', pasta)

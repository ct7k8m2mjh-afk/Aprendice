"""Leva um ícone construído em camadas (foto3d/camadas/<ID>/) para o app (src/assets/ic3d/<ID>/).

Uso: python3 ferramentas/icones/camadas_app.py <ID> [<ID> ...]
Todas as camadas são recortadas com a MESMA caixa (continuam alinhadas), salvas em WebP e descritas em camadas.json
(ordem do fundo para a frente e o centro de cada peça, usado na animação de "afastar do centro").
"""
import json, os, sys
import numpy as np
from PIL import Image

RAIZ = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
ORIGEM = os.path.join(RAIZ, 'app-atual', 'design', 'icones_real', 'foto3d', 'camadas')
DESTINO = os.path.join(RAIZ, 'app', 'src', 'assets', 'ic3d')
LADO = 768
# como cada ícone anima (decidido pelo que faz sentido no assunto, não por desmontar):
#   corrente: a corrente corre pelo fio e a lâmpada acende; as peças ficam no lugar
#   inteiro:  o ícone se ergue de leve e a sombra se abre (nada se separa)
ANIMACAO = {'F11': 'corrente', 'B00': 'inteiro'}   # basta para tela cheia em celular de alta densidade; webp leve

def camadas(ID):
    src = os.path.join(ORIGEM, ID)
    if not os.path.exists(os.path.join(src, 'camadas.json')):
        return
    meta = json.load(open(os.path.join(src, 'camadas.json')))
    nomes = ['sombra'] + meta['ordem']
    ims = {n: Image.open(os.path.join(src, n + '.png')).convert('RGBA') for n in nomes}
    # caixa comum: tudo o que é visível em qualquer camada (sombra fraca demais não conta)
    caixa = None
    for n, im in ims.items():
        a = np.asarray(im)[..., 3]
        lim = 10 if n == 'sombra' else 2
        ys, xs = np.where(a > lim)
        if not len(ys): continue
        b = [xs.min(), ys.min(), xs.max() + 1, ys.max() + 1]
        caixa = b if caixa is None else [min(caixa[0], b[0]), min(caixa[1], b[1]), max(caixa[2], b[2]), max(caixa[3], b[3])]
    w, h = caixa[2] - caixa[0], caixa[3] - caixa[1]
    lado = max(w, h); pad = int(lado * .04); lado += 2 * pad
    x0 = caixa[0] - pad - (lado - 2 * pad - w) // 2; y0 = caixa[1] - pad - (lado - 2 * pad - h) // 2
    out = os.path.join(DESTINO, ID); os.makedirs(out, exist_ok=True)
    partes = []
    for n, im in ims.items():
        tela = Image.new('RGBA', (lado, lado), (0, 0, 0, 0)); tela.paste(im, (-x0, -y0))
        tela = tela.resize((LADO, LADO), Image.LANCZOS)
        tela.save(os.path.join(out, n + '.webp'), 'WEBP', quality=90, method=6, alpha_quality=100)
        if n != 'sombra':
            a = np.asarray(tela)[..., 3].astype(float)
            ys, xs = np.nonzero(a > 20)
            partes.append({'nome': n, 'cx': round(float(xs.mean()) / LADO, 3), 'cy': round(float(ys.mean()) / LADO, 3)})
    k = LADO / lado
    conv = lambda xy: [round((xy[0] - x0) * k / LADO, 4), round((xy[1] - y0) * k / LADO, 4)]
    extra = {'animacao': ANIMACAO.get(ID, 'inteiro')}
    if meta.get('trajetos'):
        extra['trajetos'] = {n: [conv(p) for p in pts] for n, pts in meta['trajetos'].items()}
    if meta.get('pontos'):
        extra['pontos'] = {n: {'xy': conv(v['xy']), 'r': round(v['r'] * k / LADO, 4)} for n, v in meta['pontos'].items()}
    json.dump({'id': ID, 'partes': partes, **extra}, open(os.path.join(out, 'camadas.json'), 'w'), ensure_ascii=False, indent=1)
    print(ID, 'ok', [p['nome'] for p in partes])


def quadros(ID, lado=480):
    """Sequência de quadros (animação pela função) -> uma tira WebP (quadros lado a lado) + meta no camadas.json."""
    src = os.path.join(ORIGEM, ID, 'quadros')
    if not os.path.isdir(src):
        return
    meta = json.load(open(os.path.join(src, 'quadros.json')))
    ims = [Image.open(os.path.join(src, 'q%02d.png' % f)).convert('RGBA') for f in range(meta['n'])]
    caixa = None
    for im in ims:
        a = np.asarray(im)[..., 3]; ys, xs = np.where(a > 10)
        b = [xs.min(), ys.min(), xs.max() + 1, ys.max() + 1]
        caixa = b if caixa is None else [min(caixa[0], b[0]), min(caixa[1], b[1]), max(caixa[2], b[2]), max(caixa[3], b[3])]
    w, h = caixa[2] - caixa[0], caixa[3] - caixa[1]; L = max(w, h); pad = int(L * .04); L += 2 * pad
    x0 = caixa[0] - pad - (L - 2 * pad - w) // 2; y0 = caixa[1] - pad - (L - 2 * pad - h) // 2
    tira = Image.new('RGBA', (lado * len(ims), lado), (0, 0, 0, 0))
    for i, im in enumerate(ims):
        t = Image.new('RGBA', (L, L), (0, 0, 0, 0)); t.paste(im, (-x0, -y0))
        tira.paste(t.resize((lado, lado), Image.LANCZOS), (i * lado, 0))
    out = os.path.join(DESTINO, ID); os.makedirs(out, exist_ok=True)
    tira.save(os.path.join(out, 'filme.webp'), 'WEBP', quality=86, method=6, alpha_quality=95)
    ims[0].crop((x0, y0, x0 + L, y0 + L)).resize((768, 768), Image.LANCZOS).save(os.path.join(out, 'parado.webp'), 'WEBP', quality=90, method=6)
    arq = os.path.join(out, 'camadas.json')
    m = json.load(open(arq)) if os.path.exists(arq) else {'id': ID, 'partes': []}
    m['filme'] = {'n': len(ims), 'fps': meta.get('fps', 18)}
    json.dump(m, open(arq, 'w'), ensure_ascii=False, indent=1)
    print(ID, 'filme', len(ims), 'quadros', round(os.path.getsize(os.path.join(out, 'filme.webp')) / 1024), 'KB')


if __name__ == '__main__':
    for ID in sys.argv[1:]:
        camadas(ID)
        quadros(ID)

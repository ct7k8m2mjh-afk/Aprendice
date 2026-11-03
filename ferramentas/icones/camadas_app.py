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
LADO = 768   # basta para tela cheia em celular de alta densidade; webp leve

for ID in sys.argv[1:]:
    src = os.path.join(ORIGEM, ID)
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
    json.dump({'id': ID, 'partes': partes}, open(os.path.join(out, 'camadas.json'), 'w'), ensure_ascii=False, indent=1)
    print(ID, 'ok', [p['nome'] for p in partes])

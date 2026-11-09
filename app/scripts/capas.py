#!/usr/bin/env python3
"""Capas das matérias, ícone da matéria e arte do Treino geral (comando 32 do dono, 06/11/2026).

Fonte oficial: docs/capas/<matéria>/<PEÇA>.png (objetos com transparência, originais do Drive do dono, intactos).
As capas montadas pelo dono (REF-CLARO.png, REF-ESCURO.png; Biologia: REFERENCIA-PRINCIPAL.png) são a referência:
cada capa do site é REMONTADA aqui a partir das peças, na posição e no tamanho em que aparecem na referência
(medidos sobre a REF de 2172 x 724 px; o claro e o escuro usam a mesma montagem e mudam só o fundo).

Saída (public/conteudo/capas/, gerada no build; nada disto é versionado):
  <m>.webp           objetos da capa, recortados na caixa que ocupam, com transparência (o fundo é o "fundo suave"
                     da paleta, posto pelo CSS: no claro e no escuro);
  ic-<m>.webp        ícone da matéria (cartões "Suas matérias", "Hora de revisar", desempenho): uma peça ou um grupo,
                     enquadrado para caber inteiro no círculo claro (mesma regra dos ícones de tema);
  treino-geral.webp  arte do Treino geral de todas as matérias (Início): peças de várias matérias juntas.
E src/dados/capas.ts (versionado): onde a arte fica dentro da faixa da capa, em frações da REF.

Só usa pillow e numpy (o build da Vercel instala pillow, numpy e scipy).
Uso direto (conferência): python3 scripts/capas.py <saida>  -> grava os WebP e uma prancha.
"""
import json, os, sys
from io import BytesIO

AQUI = os.path.dirname(os.path.abspath(__file__))
APP = os.path.dirname(AQUI)
RAIZ = os.path.dirname(APP)
PASTA = os.path.join(RAIZ, 'docs', 'capas')
sys.path.insert(0, AQUI)
from icones_tema import PASTAS, enquadra  # noqa: E402  (mesmo enquadramento no círculo dos ícones de tema)

REF_W, REF_H = 2172, 724
ESCALA_CAPA = 0.7   # a capa sai com 70% da REF (objetos com ~500 px de altura: nítidos até ~2x num cartão de 280 px)
QUALIDADE = 82
ALFA_RUIDO = 8      # alfa até isto é ruído do recorte (some); vidro e sombra de contato continuam translúcidos

# Montagem de cada capa, de trás para a frente: peça, x, y (canto da caixa do objeto), altura e espelho, em px da REF.
CAPAS = {
    'bio': [('FOLHA', 1570, 60, 460, True), ('MICROSCOPIO', 1603, 14, 674, False), ('CELULA', 1437, 226, 230, False)],
    'qui': [('FRASCO', 1285, 59, 606, False), ('MOLECULA', 1572, 47, 398, False)],
    'mat': [('PIRAMIDE', 1429, 214, 352, False), ('COMPASSO', 1730, 24, 554, False), ('CUBO', 1268, 342, 292, False),
            ('ESFERA', 1628, 400, 262, False)],
    'por': [('PILHA-DE-LIVROS', 1199, 61, 412, False), ('LIVRO-ROXO', 1303, 243, 368, False), ('CANETA', 1770, 231, 421, False)],
    'fis': [('IMA', 1890, 288, 232, False), ('SEM-NOME-e792b5e0', 1323, 131, 502, False), ('LAMPADA', 1218, 236, 348, False)],
    'geo': [('GLOBO-TERRA', 1260, 18, 696, False), ('MONTANHAS', 1708, 230, 362, False), ('BUSSOLA', 1585, 442, 276, False)],
    'his': [('COLUNA-ANTIGA', 1630, 22, 582, False), ('AMPULHETA', 1384, 122, 506, False), ('PERGAMINHO', 1556, 486, 196, False)],
    'ing': [('LIVRO-VERMELHO', 1262, 330, 362, False), ('BALAO-VERMELHO', 1370, 43, 324, False), ('BALAO-ROSE', 1588, 92, 276, False),
            ('BANDEIRA-USA', 1900, 128, 280, False)],
    'fs': [('BALANCA', 1518, 26, 552, False), ('BONECOS', 1708, 382, 284, False), ('CORUJA', 1191, 174, 490, False)],
}

# Sombra de contato no chão (medida nas REF claras, comando 32: o dono pediu sombra e posição iguais às referências).
# As peças trazem só a sombra própria colada no objeto; a REF tem, além dela, uma sombra suave no chão, deslocada
# para a direita (luz do alto à esquerda). Ela é desenhada por peça apoiada no chão: elipse sob a base, desfocada,
# em preto translúcido (escurece o fundo suave por multiplicação; no escuro fica naturalmente discreta, como na REF
# escura). Medidas em fração da largura da base da peça: dx/dy = centro, rx/ry = raios, sigma = desfoque, op = opacidade.
# dono, 09/11/2026: sem nenhuma sombra acrescentada nos ícones e capas (as peças ficam só com o que o PNG original traz)
SEM_SOMBRA = True
SOMBRA = {'dx': 0.15, 'dy': -0.02, 'rx': 0.62, 'ry': 0.06, 'sigma': 0.06, 'op': 0.38}
# História: na REF a luz vem da direita e a sombra de chão vai para a esquerda, atrás da base da ampulheta
SOMBRA_MATERIA = {'his': {'dx': -0.16, 'sigma': 0.09, 'op': 0.3}}
# peças que flutuam ou ficam atrás de outra na REF: sem sombra de chão
SOLTAS = {('bio', 'CELULA'), ('bio', 'FOLHA'), ('qui', 'MOLECULA'), ('ing', 'BALAO-VERMELHO'), ('ing', 'BALAO-ROSE'),
          ('ing', 'BANDEIRA-USA')}

# Ícone da matéria (referência da aba principal: um objeto por matéria no círculo): as peças da capa que entram.
ICONE = {
    'bio': ['CELULA'], 'qui': ['FRASCO'], 'mat': ['PIRAMIDE', 'CUBO', 'ESFERA'], 'por': ['LIVRO-ROXO', 'CANETA'],
    'fis': ['LAMPADA'], 'geo': ['GLOBO-TERRA'], 'his': ['AMPULHETA'], 'ing': ['BALAO-VERMELHO', 'BALAO-ROSE'], 'fs': ['CORUJA'],
}

# Arte do Treino geral (todas as matérias), como na referência: livro aberto, folha, molécula e cubo.
# (matéria, peça, x, y, altura, espelho) numa tela de 1200 x 900, de trás para a frente.
TREINO = [('bio', 'FOLHA', 300, 0, 360, True), ('por', 'LIVRO-ROXO', 0, 300, 470, False),
          ('qui', 'MOLECULA', 640, 60, 400, False), ('mat', 'CUBO', 620, 500, 300, False)]

PASTA_DE = {m: p for p, m in PASTAS.items()}


def _peca(m, nome):
    from PIL import Image
    import numpy as np
    im = Image.open(os.path.join(PASTA, PASTA_DE[m], nome + '.png')).convert('RGBA')
    a = np.array(im)
    a[..., 3][a[..., 3] <= ALFA_RUIDO] = 0
    im = Image.fromarray(a, 'RGBA')
    caixa = im.getchannel('A').point(lambda v: 255 if v > 20 else 0).getbbox()
    return im.crop(caixa)


def _cola(tela, m, nome, x, y, alt, esp, k=1.0):
    from PIL import Image
    im = _peca(m, nome)
    if esp:
        im = im.transpose(Image.FLIP_LEFT_RIGHT)
    h = max(1, round(alt * k))
    w = max(1, round(im.width * h / im.height))
    tela.alpha_composite(im.convert('RGBa').resize((w, h), Image.LANCZOS).convert('RGBA'), (round(x * k), round(y * k)))


def _sombra(tela, m, nome, x, y, alt, esp, k=1.0, sempre=False):
    """Sombra de contato da peça no chão, desenhada em `tela` (antes da peça). sempre: também nas peças que flutuam
    (ícone da matéria: na referência da aba principal todo objeto do círculo tem a sombra suave embaixo)."""
    if SEM_SOMBRA:
        return
    if (m, nome) in SOLTAS and not sempre:
        return
    import numpy as np
    from PIL import Image, ImageDraw, ImageFilter
    p = {**SOMBRA, **SOMBRA_MATERIA.get(m, {})}
    im = _peca(m, nome)
    if esp:
        im = im.transpose(Image.FLIP_LEFT_RIGHT)
    esc = alt / im.height
    a = np.asarray(im.getchannel('A')) > 200
    linhas = np.nonzero(a.any(1))[0]
    yb = linhas.max()
    cols = np.nonzero(a[max(0, yb - max(2, a.shape[0] // 30)):yb + 1].any(0))[0]
    base_w = (cols.max() - cols.min()) * esc
    cx = x + (cols.min() + cols.max()) / 2 * esc + p['dx'] * base_w
    cy = y + yb * esc + p['dy'] * base_w
    base_w, cx, cy = float(base_w), float(cx), float(cy)
    rx, ry, sg = p['rx'] * base_w, max(1.5, p['ry'] * base_w), max(1.0, p['sigma'] * base_w)
    pad = int(3 * sg + 4)
    W, H = int(2 * (rx + pad)), int(2 * (ry + pad))
    camada = Image.new('L', (max(1, round(W * k)), max(1, round(H * k))), 0)
    ImageDraw.Draw(camada).ellipse([pad * k, pad * k, (W - pad) * k, (H - pad) * k], fill=round(255 * p['op']))
    camada = camada.filter(ImageFilter.GaussianBlur(sg * k))
    sombra = Image.new('RGBA', camada.size, (0, 0, 0, 0))
    sombra.putalpha(camada)
    tela.alpha_composite(sombra, (round((cx - W / 2) * k), round((cy - H / 2) * k)))


def _webp(img, q=QUALIDADE):
    b = BytesIO()
    img.save(b, 'WEBP', quality=q, alpha_quality=90, method=6)
    return b.getvalue()


def capa(m):
    """(bytes do WebP dos objetos, caixa em frações da REF: esquerda, topo, direita, base)."""
    from PIL import Image
    k = ESCALA_CAPA
    tela = Image.new('RGBA', (round(REF_W * k), round(REF_H * k)), (0, 0, 0, 0))
    for nome, x, y, alt, esp in CAPAS[m]:
        _sombra(tela, m, nome, x, y, alt, esp, k)
        _cola(tela, m, nome, x, y, alt, esp, k)
    x0, y0, x1, y1 = tela.getchannel('A').getbbox()
    frac = (x0 / tela.width, y0 / tela.height, x1 / tela.width, y1 / tela.height)
    return _webp(tela.crop((x0, y0, x1, y1))), tuple(round(v, 4) for v in frac)


def icone(m, lado=320):
    from PIL import Image
    tela = Image.new('RGBA', (REF_W, REF_H), (0, 0, 0, 0))
    for nome, x, y, alt, esp in CAPAS[m]:
        if nome in ICONE[m]:
            _sombra(tela, m, nome, x, y, alt, esp, sempre=True)
            _cola(tela, m, nome, x, y, alt, esp)
    return _webp(enquadra(tela.crop(tela.getchannel('A').getbbox()), lado), 84)


def treino_geral():
    from PIL import Image
    tela = Image.new('RGBA', (1200, 900), (0, 0, 0, 0))
    for m, nome, x, y, alt, esp in TREINO:
        _sombra(tela, m, nome, x, y, alt, esp)
        _cola(tela, m, nome, x, y, alt, esp)
    tela = tela.crop(tela.getchannel('A').getbbox())
    tela.thumbnail((720, 720), Image.LANCZOS)
    return _webp(tela)


def gera(destino):
    """Grava os WebP em <destino>/capas/ e devolve {m: caixa} (frações da REF)."""
    pasta = os.path.join(destino, 'capas')
    os.makedirs(pasta, exist_ok=True)
    caixas = {}
    for m in CAPAS:
        b, caixa = capa(m)
        caixas[m] = caixa
        with open(os.path.join(pasta, m + '.webp'), 'wb') as f:
            f.write(b)
        with open(os.path.join(pasta, 'ic-' + m + '.webp'), 'wb') as f:
            f.write(icone(m))
    with open(os.path.join(pasta, 'treino-geral.webp'), 'wb') as f:
        f.write(treino_geral())
    return caixas


def gera_ts(caixas):
    """src/dados/capas.ts: a caixa da arte dentro da faixa da capa (frações da REF, 3:1)."""
    alvo = os.path.join(APP, 'src', 'dados', 'capas.ts')
    with open(alvo, 'w', encoding='utf-8') as f:
        f.write('// Gerado por scripts/capas.py a partir de docs/capas/<matéria>/ (comando 32 do dono).\n')
        f.write('// Caixa ocupada pelos objetos na capa de referência (2172 x 724, 3:1), em frações: esquerda, topo, direita, base.\n')
        f.write('export const CAIXA_CAPA: Record<string, readonly [number, number, number, number]> = '
                + json.dumps({m: list(c) for m, c in sorted(caixas.items())}) + ';\n')


if __name__ == '__main__':
    from PIL import Image
    saida = sys.argv[1]
    cx = gera(saida)
    print(json.dumps(cx))
    for f in sorted(os.listdir(os.path.join(saida, 'capas'))):
        print(f, os.path.getsize(os.path.join(saida, 'capas', f)) // 1024, 'KB')

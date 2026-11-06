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
    'mat': [('PIRAMIDE', 1429, 214, 352, False), ('COMPASSO', 1730, 24, 554, False), ('CUBO', 1296, 378, 246, False),
            ('ESFERA', 1638, 413, 248, False)],
    'por': [('PILHA-DE-LIVROS', 1199, 61, 412, False), ('LIVRO-ROXO', 1303, 243, 368, False), ('CANETA', 1770, 231, 421, False)],
    'fis': [('IMA', 1890, 288, 232, False), ('SEM-NOME-e792b5e0', 1323, 131, 502, False), ('LAMPADA', 1218, 236, 348, False)],
    'geo': [('GLOBO-TERRA', 1260, 18, 696, False), ('MONTANHAS', 1708, 230, 362, False), ('BUSSOLA', 1585, 442, 276, False)],
    'his': [('COLUNA-ANTIGA', 1663, 23, 504, False), ('AMPULHETA', 1384, 120, 508, False), ('PERGAMINHO', 1565, 494, 180, False)],
    'ing': [('BANDEIRA-USA', 1926, 147, 256, False), ('BALAO-VERMELHO', 1370, 43, 324, False), ('BALAO-ROSE', 1600, 107, 232, False),
            ('LIVRO-VERMELHO', 1262, 324, 392, False)],
    'fs': [('BALANCA', 1518, 26, 552, False), ('BONECOS', 1708, 382, 284, False), ('CORUJA', 1191, 174, 490, False)],
}

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
        _cola(tela, m, nome, x, y, alt, esp, k)
    x0, y0, x1, y1 = tela.getchannel('A').getbbox()
    frac = (x0 / tela.width, y0 / tela.height, x1 / tela.width, y1 / tela.height)
    return _webp(tela.crop((x0, y0, x1, y1))), tuple(round(v, 4) for v in frac)


def icone(m, lado=320):
    from PIL import Image
    tela = Image.new('RGBA', (REF_W, REF_H), (0, 0, 0, 0))
    for nome, x, y, alt, esp in CAPAS[m]:
        if nome in ICONE[m]:
            _cola(tela, m, nome, x, y, alt, esp)
    return _webp(enquadra(tela.crop(tela.getchannel('A').getbbox()), lado), 84)


def treino_geral():
    from PIL import Image
    tela = Image.new('RGBA', (1200, 900), (0, 0, 0, 0))
    for m, nome, x, y, alt, esp in TREINO:
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

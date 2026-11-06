#!/usr/bin/env python3
"""Ícones de tema enviados pelo dono (comando 19, 06/11/2026).

Fonte oficial: docs/icones/<pasta da matéria>/<id do tema>-<nome>.png (o id é o mod.id do site).
Os PNG originais ficam guardados lá, intactos; este módulo só lê.

Para o site, cada PNG vira <id>.webp leve, pronto para ficar INTEIRO dentro do círculo claro:
  1. restos do fundo apagados: alfa muito baixo zerado e manchas soltas (fora do objeto) removidas;
  2. objeto 100% opaco: alfa >= 128 vira 255 (o recorte original deixava o objeto em 249-254);
  3. sem halo/franja: a cor dos pixels da borda (alfa parcial) vem do pixel opaco mais próximo;
  4. enquadramento: o objeto é centrado e reduzido até o ponto mais distante caber num círculo de
     RAIO_OBJETO (88%) do raio da imagem (a imagem tem o mesmo tamanho do círculo na interface);
  5. WebP de LADO px (2,9x o maior uso, 112 px), qualidade QUALIDADE.

Uso direto (conferência): python3 scripts/icones_tema.py <saida>  -> grava os WebP e uma prancha.
No fluxo normal, scripts/converte.py chama icones_materia(m).
"""
import os, re, sys
from io import BytesIO

AQUI = os.path.dirname(os.path.abspath(__file__))
RAIZ = os.path.dirname(os.path.dirname(AQUI))
PASTA_DOCS = os.path.join(RAIZ, 'docs', 'icones')

# pasta em docs/icones -> id da matéria no site (as próximas matérias entram aqui quando o dono mandar)
PASTAS = {
    'biologia': 'bio', 'quimica': 'qui', 'matematica': 'mat', 'portugues': 'por', 'fisica': 'fis',
    'geografia': 'geo', 'historia': 'his', 'filosofia-e-sociologia': 'fs', 'filosofia': 'fs',
    'sociologia': 'fs', 'ingles': 'ing',
}
NOME = re.compile(r'^([A-Z]+\d+)(?:-.*)?\.png$', re.I)

ALFA_RESTO = 32       # alfa <= isto é resto de fundo
ALFA_OPACO = 128      # alfa >= isto é objeto (vira 255)
RAIO_OBJETO = 0.88    # o objeto cabe num círculo de 88% do raio
LADO = 320
QUALIDADE = 84


def arquivos_materia(m):
    """{id do tema: caminho do PNG original} de todas as pastas da matéria m."""
    out = {}
    if not os.path.isdir(PASTA_DOCS):
        return out
    for pasta in sorted(os.listdir(PASTA_DOCS)):
        if PASTAS.get(pasta) != m:
            continue
        cam = os.path.join(PASTA_DOCS, pasta)
        for f in sorted(os.listdir(cam)):
            r = NOME.match(f)
            if r:
                out[r.group(1).upper()] = os.path.join(cam, f)
    return out


def materias_com_icones():
    return sorted({m for m in PASTAS.values() if arquivos_materia(m)})


def limpa(caminho):
    """PNG original -> imagem RGBA limpa (mesma resolução): sem restos, objeto opaco, borda sem franja."""
    import numpy as np
    from PIL import Image
    from scipy import ndimage as nd
    im = np.array(Image.open(caminho).convert('RGBA'))
    rgb = im[..., :3].astype(np.uint8)
    a = im[..., 3].astype(np.int32)
    a[a <= ALFA_RESTO] = 0
    # manchas soltas: só ficam as partes ligadas (8-vizinhança) com pelo menos 0,2% do objeto principal
    lab, n = nd.label(a > 0, structure=np.ones((3, 3)))
    if n:
        tam = nd.sum(a > 0, lab, range(1, n + 1))
        manter = np.zeros(n + 1, bool)
        manter[1:] = tam >= max(tam.max() * 0.002, 40)
        a[~manter[lab]] = 0
    a[a >= ALFA_OPACO] = 255
    # borda: cor do pixel opaco mais próximo (tira o fundo claro que vinha misturado na borda)
    opaco = a == 255
    _, (iy, ix) = nd.distance_transform_edt(~opaco, return_indices=True)
    borda = (a > 0) & ~opaco
    rgb[borda] = rgb[iy[borda], ix[borda]]
    rgb[a == 0] = 0
    return Image.fromarray(np.dstack([rgb, a.astype(np.uint8)]), 'RGBA')


def enquadra(img, lado=LADO):
    """Centra o objeto e o reduz para caber inteiro no círculo (RAIO_OBJETO do raio da imagem)."""
    import numpy as np
    from PIL import Image
    a = np.array(img.getchannel('A'))
    ys, xs = np.nonzero(a)
    # centro do menor círculo aproximado: centro da caixa, depois ajuste simples pelo ponto mais distante
    cx, cy = (xs.min() + xs.max() + 1) / 2, (ys.min() + ys.max() + 1) / 2
    for _ in range(60):
        d = np.hypot(xs + .5 - cx, ys + .5 - cy)
        k = d.argmax()
        cx += (xs[k] + .5 - cx) * 0.02
        cy += (ys[k] + .5 - cy) * 0.02
    raio = np.hypot(xs + .5 - cx, ys + .5 - cy).max()
    esc = (lado / 2 * RAIO_OBJETO) / raio
    grande = round(img.width * esc), round(img.height * esc)
    peq = img.convert('RGBa').resize(grande, Image.LANCZOS).convert('RGBA')
    tela = Image.new('RGBA', (lado, lado), (0, 0, 0, 0))
    tela.alpha_composite(peq, (round(lado / 2 - cx * esc), round(lado / 2 - cy * esc)))
    return tela


def webp(caminho):
    img = enquadra(limpa(caminho))
    b = BytesIO()
    img.save(b, 'WEBP', quality=QUALIDADE, alpha_quality=100, method=6)
    return b.getvalue()


def icones_materia(m):
    """{id do tema: bytes do WebP} gerados SÓ a partir de docs/icones/ (vazio se a matéria não tem ícones novos)."""
    return {k: webp(p) for k, p in arquivos_materia(m).items()}


if __name__ == '__main__':
    from PIL import Image
    saida = sys.argv[1]
    os.makedirs(saida, exist_ok=True)
    for m in materias_com_icones():
        ims = []
        for k, v in icones_materia(m).items():
            with open(os.path.join(saida, f'{m}-{k}.webp'), 'wb') as f:
                f.write(v)
            print(m, k, len(v), 'bytes')
            ims.append(Image.open(BytesIO(v)))
        # prancha de conferência: claro, escuro e magenta (franja aparece no magenta)
        for nome, fundo in (('claro', (238, 241, 236)), ('escuro', (23, 24, 28)), ('magenta', (255, 0, 255))):
            p = Image.new('RGB', (LADO * 6, LADO * 2), fundo)
            for i, im in enumerate(ims):
                t = Image.new('RGBA', (LADO, LADO), fundo + (255,))
                t.alpha_composite(im)
                p.paste(t.convert('RGB'), ((i % 6) * LADO, (i // 6) * LADO))
            p.save(os.path.join(saida, f'prancha-{m}-{nome}.png'))

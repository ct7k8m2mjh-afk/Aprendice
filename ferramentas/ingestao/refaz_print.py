#!/usr/bin/env python3
"""Refaz o print de uma questão direto do PDF oficial (quando o recorte automático saiu embaralhado ou cortado).

  python3 ferramentas/ingestao/refaz_print.py <prova> <n>                      automático (questão numa página só)
  python3 ferramentas/ingestao/refaz_print.py <prova> <n> --seg P:x0,y0,x1,y1 [--seg ...]   trechos à mão (pontos do PDF,
                                                                               página P contada a partir de 1), empilhados
  --previa   só gera a imagem em /tmp para conferir, sem gravar
  --sem-vermelho   caderno comentado (resposta marcada em vermelho): o vermelho vira cinza-escuro, para não entregar a letra
  --zoom     grava também uma ampliação 2x em docs/resolucoes/apoio/<id>.png (questões de figura miúda)

O PDF vem do link oficial em prova.json (fontes[caderno]) e fica em fontes/cache-pdf/ (fora do git).
Grava q/<n>.webp com 1000 px de largura, atualiza larg, alt e paginas no prova.json e registra a troca em
docs/provas/prints-refeitos.md. Sempre confira a imagem antes de dar por pronta.
"""
import datetime
import json
import os
import re
import subprocess
import sys

import pymupdf as fitz
from PIL import Image

RAIZ = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
PROVAS = os.path.join(RAIZ, 'app', 'conteudo-fonte', 'provas')
CACHE = os.path.join(RAIZ, 'fontes', 'cache-pdf')
LARG = 1000


def baixa(url):
    os.makedirs(CACHE, exist_ok=True)
    nome = re.sub(r'[^A-Za-z0-9._-]', '_', url.split('/')[-1])
    f = os.path.join(CACHE, nome)
    if not os.path.exists(f):
        cmd = ['curl', '-sS', '-L', '-A', 'Mozilla/5.0 (compatible; estudos)', '-o', f, url]
        extra = os.path.join(RAIZ, 'ferramentas', 'ingestao', 'certs')
        if os.path.isdir(extra):  # cadeia intermediária de alguns servidores (INEP); soma ao bundle do sistema
            bundle = os.path.join(CACHE, 'bundle.pem')
            base = os.environ.get('SSL_CERT_FILE') or '/root/.ccr/ca-bundle.crt'
            with open(bundle, 'w') as h:
                for c in [base] + [os.path.join(extra, x) for x in sorted(os.listdir(extra)) if x.endswith('.pem')]:
                    if os.path.exists(c):
                        h.write(open(c).read() + '\n')
            cmd[1:1] = ['--cacert', bundle]
        subprocess.run(cmd, check=True)
    return f


def acha_questao(doc, n, paginas):
    rotulos = [f'Questão {n}', f'QUESTÃO {n}', f'Questão {n:02d}' if isinstance(n, int) else f'Questão {n}']
    ordem = [p - 1 for p in paginas] + [i for i in range(len(doc)) if i + 1 not in paginas]
    for i in ordem:
        for r in rotulos:
            for hit in doc[i].search_for(r):
                # descarta "Questão 1" achado dentro de "Questão 17"
                prox = doc[i].get_textbox(fitz.Rect(hit.x1, hit.y0, hit.x1 + 6, hit.y1)).strip()
                if not prox[:1].isdigit():
                    return i, hit
    sys.exit(f'Questão {n} não encontrada no PDF.')


def regiao_auto(pg, hit):
    W, H = pg.rect.width, pg.rect.height
    # rodapé: o texto mais alto entre os que ficam nos últimos 10% da página
    baixos = [b[1] for b in pg.get_text('blocks') if b[1] > H * 0.9]
    rodape = (min(baixos) - 4) if baixos else H - 30
    meio = W / 2
    # próxima questão abaixo, na mesma página
    outras = [h for h in pg.search_for('Questão') if h.y0 > hit.y1 + 2]
    fim = min([h.y0 - 4 for h in outras if (h.x0 < meio) == (hit.x0 < meio) or h.x0 < meio < h.x1] + [rodape])
    itens = [fitz.Rect(b[:4]) for b in pg.get_text('blocks')]
    itens += [d['rect'] for d in pg.get_drawings()]
    itens += [fitz.Rect(x['bbox']) for x in pg.get_image_info()]
    itens = [r for r in itens if r.y0 >= hit.y0 - 2 and r.y1 <= fim and r.x1 <= W and r.width < W]
    larga = any(r.x0 < meio - 10 and r.x1 > meio + 10 for r in itens)
    if larga:
        x0, x1 = 26, W - 26
    elif hit.x0 < meio:
        x0, x1 = 26, meio - 4
    else:
        x0, x1 = meio + 4, W - 26
    dentro = [r for r in itens if r.x0 >= x0 - 2 and r.x1 <= x1 + 2]
    yb = max(r.y1 for r in dentro)
    return [(pg.number, fitz.Rect(x0 - 2, hit.y0 - 4, x1 + 2, yb + 6))]


def sem_vermelho(im):
    """Pixel avermelhado (r bem acima de g e b) vira cinza com a luminância de min(g, b): texto vermelho fica preto,
    a borda suavizada fica cinza. Usado nos cadernos comentados, que pintam a alternativa certa de vermelho."""
    import numpy as np
    a = np.asarray(im.convert('RGB')).astype(int)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    m = (r - np.maximum(g, b) > 50)
    v = np.minimum(g, b)
    for k in range(3):
        a[..., k] = np.where(m, v, a[..., k])
    return Image.fromarray(a.astype('uint8'))


def texto_dos_trechos(doc, segs):
    """Camada de texto dos trechos; página só em imagem: OCR (tesseract, como o recorte original)."""
    partes = []
    os.environ.setdefault('TESSDATA_PREFIX', '/usr/share/tesseract-ocr/5/tessdata')
    for i, r in segs:
        pagina = doc[i]  # guardada: o OCR precisa da página viva
        t = pagina.get_text('text', clip=r).strip()
        if not t:
            try:
                tp = pagina.get_textpage_ocr(language='por', dpi=220, full=True)
                t = pagina.get_text('text', clip=r, textpage=tp).strip()
            except Exception:
                t = ''
        partes.append(t)
    return '\n'.join(partes).strip()


def render(doc, segs):
    larg_pt = max(r.width for _, r in segs)
    z = LARG / larg_pt
    partes = []
    for i, r in segs:
        pix = doc[i].get_pixmap(matrix=fitz.Matrix(z, z), clip=r)
        partes.append(Image.frombytes('RGB', (pix.width, pix.height), pix.samples))
    im = Image.new('RGB', (max(p.width for p in partes), sum(p.height for p in partes)), 'white')
    y = 0
    for p in partes:
        im.paste(p, (0, y))
        y += p.height
    if im.width != LARG:
        im = im.resize((LARG, round(im.height * LARG / im.width)), Image.LANCZOS)
    return im, z


def main():
    a = sys.argv[1:]
    if len(a) < 2:
        sys.exit(__doc__)
    pid, n = a[0], int(a[1])
    segs_mao = [s for k, s in zip(a, a[1:]) if k == '--seg']
    previa, zoom = '--previa' in a, '--zoom' in a
    fp = os.path.join(PROVAS, pid, 'prova.json')
    p = json.load(open(fp, encoding='utf-8'))
    q = next(x for x in p['questoes'] if str(x['n']) == str(n))
    doc = fitz.open(baixa(p['fontes'][q['caderno']]))
    if segs_mao:
        segs = []
        for s in segs_mao:
            pg, c = s.split(':')
            segs.append((int(pg) - 1, fitz.Rect(*[float(v) for v in c.split(',')])))
    else:
        i, hit = acha_questao(doc, n, q.get('paginas') or [])
        segs = regiao_auto(doc[i], hit)
    im, z = render(doc, segs)
    if '--sem-vermelho' in a:
        im = sem_vermelho(im)
    if previa:
        out = f'/tmp/previa-{pid}-{n}.png'
        im.save(out)
        print(f'Prévia: {out} ({im.width}x{im.height}); trechos: {[(i + 1, tuple(round(v) for v in r)) for i, r in segs]}')
        return
    dst = os.path.join(PROVAS, pid, q['print'])
    antes = Image.open(dst).size if os.path.exists(dst) else None
    im.save(dst, 'WEBP', quality=88, method=6)
    q['larg'], q['alt'] = im.size
    q['paginas'] = sorted({i + 1 for i, _ in segs})
    # texto guardado da questão = camada de texto dos mesmos trechos (o que as sessões de resolução e a busca leem);
    # caderno sem camada de texto: fica vazio, e quem resolve lê o print
    q['texto'] = texto_dos_trechos(doc, segs)
    txt = open(fp, encoding='utf-8').read()
    ind = 1 if txt[:200].count('\n "') else (2 if txt[:200].count('\n  "') else None)
    with open(fp, 'w', encoding='utf-8') as h:
        json.dump(p, h, ensure_ascii=False, indent=ind)
        if txt.endswith('\n'):
            h.write('\n')
    if zoom:
        za = os.path.join(RAIZ, 'docs', 'resolucoes', 'apoio', f"{q['id']}.png")
        os.makedirs(os.path.dirname(za), exist_ok=True)
        zz = 2 * z
        partes = [doc[i].get_pixmap(matrix=fitz.Matrix(zz, zz), clip=r) for i, r in segs]
        partes[0].save(za) if len(partes) == 1 else im.resize((im.width * 2, im.height * 2), Image.LANCZOS).save(za)
        print(f'Ampliação: {za}')
    reg = os.path.join(RAIZ, 'docs', 'provas', 'prints-refeitos.md')
    if not os.path.exists(reg):
        open(reg, 'w', encoding='utf-8').write('# Prints refeitos do PDF oficial\n\n| Data | Prova | Questão | id | Antes | Depois | Trechos (página: retângulo em pontos) |\n|---|---|---|---|---|---|---|\n')
    with open(reg, 'a', encoding='utf-8') as h:
        h.write(f"| {datetime.date.today().isoformat()} | {pid} | {n} | {q['id']} | {antes[0]}x{antes[1] if antes else ''} | "
                f"{im.width}x{im.height} | {'; '.join(f'{i + 1}: ' + ','.join(str(round(v)) for v in r) for i, r in segs)} |\n")
    print(f'{pid} q{n}: print refeito ({im.width}x{im.height}) em {dst}')


if __name__ == '__main__':
    main()

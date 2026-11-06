"""Extrai das pranchas aprovadas o ícone principal da MATÉRIA (História, Filosofia, Sociologia, Inglês):
fundo transparente e sombra de contato desenhada.

Os ícones de TEMA não saem mais daqui: a fonte oficial é docs/icones/<matéria>/ (comandos 19 e 23 do dono,
06/11/2026), convertida por app/scripts/icones_tema.py. Os recortes antigos de tema saíram do site e deste código.

Uso (da pasta ferramentas/icones): python3 extrai_pranchas.py <pasta de saída> [<materia>-_materia]
As máscaras usadas na versão aprovada ficam em masc/."""
import json, os, sys, numpy as np
from PIL import Image
from rembg import new_session, remove
IMG = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'app', 'conteudo-fonte', 'materias', 'ic', 'pranchas') + '/'
OUT = sys.argv[1]
C = [(40, 356), (392, 706), (742, 1058), (1094, 1408)]
PRANCHAS = {
    'his': ('historia.webp', [('_materia', (418, 28, 592, 168))]),
    'fil': ('filosofia.webp', [('_materia', (646, 16, 802, 114))]),
    'soc': ('sociologia.webp', [('_materia', (316, 16, 514, 190))]),
    'ing': ('ingles.webp', [('_materia', (453, 46, 646, 184))]),
}
sess = None

def fundo(a):
    """Plano de fundo (por canal) ajustado às bordas do recorte."""
    h, w, _ = a.shape
    ys, xs = np.mgrid[0:h, 0:w]
    borda = np.zeros((h, w), bool); borda[:3] = borda[-3:] = True; borda[:, :3] = borda[:, -3:] = True
    # só pixels de fundo de verdade (o desenho pode encostar na borda do recorte)
    borda &= np.abs(a - np.array([251, 247, 245])).max(2) < 14
    A = np.c_[xs[borda], ys[borda], np.ones(borda.sum())]
    B = np.zeros_like(a)
    for c in range(3):
        coef, *_ = np.linalg.lstsq(A, a[..., c][borda], rcond=None)
        B[..., c] = coef[0] * xs + coef[1] * ys + coef[2]
    return B

def mascara(chave, im):
    import os
    f = f'masc/{chave}.png'
    if not os.path.exists(f):
        global sess
        if sess is None:
            import os as _o
            sess = new_session(_o.environ.get('MODELO', 'isnet-general-use'))
        remove(im, session=sess, only_mask=True).save(f)
    return Image.open(f)

def extrai(prancha, caixa, chave):
    im = Image.open(IMG + prancha).convert('RGB').crop(caixa)
    a = np.asarray(im).astype(float)
    B = fundo(a)
    m = np.asarray(mascara(chave, im)).astype(float) / 255
    m[m < 0.04] = 0
    # o modelo às vezes deixa de fora partes finas e coloridas (ramo de louro): cor saturada é sempre objeto,
    # porque o fundo das pranchas é neutro
    sat = (a.max(2) - a.min(2)) - (B.max(2) - B.min(2))
    cor = ((sat - 14) / 16).clip(0, 1)
    from PIL import ImageFilter
    cor = np.asarray(Image.fromarray((cor * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(3))).astype(float) / 255
    cor[(sat < 8)] = np.minimum(cor[(sat < 8)], m[(sat < 8)])
    m = np.maximum(m, cor)
    # recorte em três zonas: interior do objeto (sempre opaco, mesmo onde é claro como o fundo),
    # fundo certo, e uma faixa fina de borda resolvida por alpha matting (cor real, sem halo do fundo)
    from scipy import ndimage
    from pymatting import estimate_alpha_cf, estimate_foreground_ml
    # 2ª leitura do contorno: o fundo da prancha é liso; o que se alcança a partir da borda andando só por
    # fundo (ou sombra neutra fora da máscara do modelo) é fundo; o resto é objeto, mesmo se claro
    dif = np.abs(a - B).max(2)
    neutro = np.abs((a - a.mean(2, keepdims=True)) - (B - B.mean(2, keepdims=True))).max(2) < 7
    escuro = a.mean(2) < B.mean(2)
    # sombra de contato: neutra, pouco mais escura que o fundo e lisa (objeto cinza tem textura e contorno)
    L0 = ndimage.gaussian_filter(a.mean(2), 1.2)
    grad = np.hypot(ndimage.sobel(L0, 0), ndimage.sobel(L0, 1)) / 8
    sombra = neutro & escuro & (dif < 50) & (grad < 2.2)
    sombra = ndimage.binary_opening(sombra, iterations=1)
    frio = ((a[..., 2] - a[..., 0]) - (B[..., 2] - B[..., 0])) > 8   # branco azulado (balão) não é o bege do fundo
    passa = ((dif < 9) & ~frio) | sombra
    lab, _ = ndimage.label(passa)
    bordas = set(np.unique(np.r_[lab[0], lab[-1], lab[:, 0], lab[:, -1]])) - {0}
    alcancado = np.isin(lab, list(bordas))
    # neutro e mais escuro que o fundo, perto dele em tom: só pode ser sombra (translúcida), nunca placa opaca
    croma_d = np.abs((a - a.mean(2, keepdims=True)) - (B - B.mean(2, keepdims=True))).max(2)
    tipo_sombra = ((dif < 9) & ~frio) | (escuro & (dif < 60) & (croma_d < 16))
    # sombra de contato com reflexo quente (não neutra): lisa, rejeitada pelo modelo, na parte de baixo
    h_ = a.shape[0]
    base_ = np.zeros(m.shape, bool); base_[int(h_ * 0.55):] = True
    liso_ = ndimage.gaussian_filter(grad, 1.0) < 3
    sombra_quente = base_ & liso_ & (m < 0.35) & (dif < 70) & escuro
    obj = ((m > 0.5) & ~(sombra & alcancado)) | (~alcancado & ~tipo_sombra & ~sombra_quente)
    # buraco cercado pelo desenho só é preenchido se não for fundo liso (anel, furo da engrenagem ficam vazados)
    buraco = ndimage.binary_fill_holes(obj) & ~obj
    obj |= buraco & ~((dif < 9) & (m < 0.5))
    # fundo/sombra contínuos a partir da borda (sem atravessar contorno) nunca são objeto, mesmo que o modelo diga
    lab2, _ = ndimage.label(tipo_sombra & (grad < 2.2) & (escuro | (m < 0.5)))
    b2 = set(np.unique(np.r_[lab2[0], lab2[-1], lab2[:, 0], lab2[:, -1]])) - {0}
    fundo2 = np.isin(lab2, list(b2))
    obj &= ~fundo2
    obj = ndimage.binary_opening(obj, iterations=1)
    # cinza neutro mais escuro que o fundo e rejeitado pelo modelo: é sombra da prancha, nunca objeto
    obj &= ~(escuro & (croma_d < 16) & (m < 0.5))
    obj = ndimage.binary_opening(obj, iterations=1)
    # sombra da prancha que o modelo tomou por objeto (base do desenho): sai, a sombra é desenhada depois
    ys_o = np.where(obj.any(1))[0]
    if len(ys_o):
        meio = ys_o.min() + 0.5 * (ys_o.max() - ys_o.min())
        baixo = np.zeros_like(obj); baixo[int(meio):] = True
        # só a sombra contínua com o fundo de fora (sem atravessar contorno), na metade de baixo do desenho
        passa3 = ((dif < 9) & (m < 0.5)) | (baixo & escuro & (dif < 45) & (croma_d < 16) & (grad < 4.5))
        lab3, _ = ndimage.label(passa3)
        b3 = set(np.unique(np.r_[lab3[0], lab3[-1], lab3[:, 0], lab3[:, -1]])) - {0}
        obj &= ~np.isin(lab3, list(b3))
        obj = ndimage.binary_opening(obj, iterations=1)
    # última passada: a partir de fora, anda por pixels lisos, neutros e quase da cor do fundo (sombra clara
    # da prancha), só na metade de baixo; o que for alcançado sai do objeto
    if len(ys_o):
        liso = ndimage.gaussian_filter(grad, 1.0) < 2.6
        claro_neutro = (dif < 30) & (croma_d < 14) & ~frio & liso
        caminho = claro_neutro & baixo
        fora_ = ~ndimage.binary_dilation(obj, iterations=1)
        lab4, _ = ndimage.label(caminho | fora_)
        semente = set(np.unique(lab4[fora_])) - {0}
        obj &= ~(np.isin(lab4, list(semente)) & caminho)
        obj = ndimage.binary_opening(obj, iterations=1)
    obj = ndimage.binary_opening(obj, iterations=1)
    dentro = ndimage.binary_erosion(obj, iterations=3)
    fora = ~ndimage.binary_dilation(obj, iterations=3)
    tri = np.full(obj.shape, 0.5); tri[dentro] = 1; tri[fora] = 0
    img = a / 255
    al = estimate_alpha_cf(img, tri)
    al = np.where(dentro, 1, np.where(fora, 0, al)).clip(0, 1)
    al[al < 0.06] = 0
    F = estimate_foreground_ml(img, al) * 255
    # borda: pixel cuja cor estimada ainda é a do fundo da prancha vira transparente (senão é halo claro no tema escuro)
    banda = ~dentro & ~fora
    dF = np.abs(F - B).max(2)
    al = np.where(banda & (al < 0.95), al * ((dF - 6) / 24).clip(0, 1), al)
    m = al
    # sombra de contato: o quanto o fundo escureceu (sombra preta translúcida), fora do objeto
    L = a.mean(2); Lb = B.mean(2)
    s = (1 - L / Lb).clip(0, 1)
    croma = np.abs((a - a.mean(2, keepdims=True)) - (B - B.mean(2, keepdims=True))).max(2)
    s[croma > 16] = 0          # pixel colorido não é sombra (resto de objeto fica a cargo da máscara)
    s[s < 0.025] = 0
    s = s * (1 - m)
    s[:] = 0   # a sombra da prancha não é usada: a sombra de contato é desenhada depois, igual para todos
    A = m + (1 - m) * s
    Cc = np.where(A[..., None] > 0, (m[..., None] * F) / np.maximum(A[..., None], 1e-6), 0)
    out = np.dstack([Cc, A * 255]).clip(0, 255).astype(np.uint8)
    return Image.fromarray(out, 'RGBA')

def limpa(im):
    """Tira pontinhos soltos (resto de borda de cartão) longe do desenho."""
    from scipy import ndimage
    a = np.asarray(im).copy()
    lab, n = ndimage.label(a[..., 3] > 24)
    if n > 1:
        tam = ndimage.sum(np.ones_like(lab), lab, range(1, n + 1))
        for i, t in enumerate(tam, 1):
            if t < 30:
                a[lab == i] = 0
    return Image.fromarray(a, 'RGBA')

def com_sombra(im):
    """Sombra de contato desenhada: elipse suave sob a base do objeto (luz de cima e de frente),
    mais escura no centro, larga como a base. Mesma receita em todos os ícones."""
    from PIL import ImageDraw, ImageFilter
    a = np.asarray(im)[..., 3]
    ys, xs = np.where(a > 128)
    if not len(ys):
        return im
    fundo = ys.max()
    faixa = ys >= fundo - max(6, int((fundo - ys.min()) * 0.12))
    x0, x1 = xs[faixa].min(), xs[faixa].max()
    larg = float(max(x1 - x0, (xs.max() - xs.min()) * 0.45))
    cx = (x0 + x1) / 2
    pad = int(larg * 0.75) + 40
    W, H = im.width + 2 * pad, im.height + 2 * pad
    sb = Image.new('L', (W, H), 0)
    d = ImageDraw.Draw(sb)
    rx, ry = larg * 0.54, max(4, larg * 0.055)
    cy = fundo + pad + ry * 0.15
    d.ellipse([cx + pad - rx, cy - ry, cx + pad + rx, cy + ry], fill=62)
    sb = sb.filter(ImageFilter.GaussianBlur(float(max(3, larg * 0.035))))
    nucleo = Image.new('L', (W, H), 0)
    ImageDraw.Draw(nucleo).ellipse([cx + pad - rx * 0.6, cy - ry * 0.45, cx + pad + rx * 0.6, cy + ry * 0.45], fill=60)
    nucleo = nucleo.filter(ImageFilter.GaussianBlur(float(max(2, larg * 0.02))))
    sb = Image.fromarray(np.minimum(255, np.asarray(sb).astype(int) + np.asarray(nucleo)).astype(np.uint8))
    tela = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    tela.putalpha(sb)
    tela.alpha_composite(im, (pad, pad))
    return tela

rel = {}
for m, (prancha, itens) in PRANCHAS.items():
    for k, caixa in itens:
        if len(sys.argv) > 2 and f'{m}-{k}' != sys.argv[2]:
            continue
        im = com_sombra(limpa(extrai(prancha, caixa, f'{m}-{k}')))
        al = np.asarray(im)[..., 3]; ys, xs = np.where(al > 0)
        im = im.crop((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1))
        im.save(f'{OUT}/{m}-materia.png'); rel[f'{m}/_materia'] = list(im.size)
print(json.dumps(rel))

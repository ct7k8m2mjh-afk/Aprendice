"""Extrai os ícones 3D das pranchas aprovadas (fundo transparente, sombra de contato preservada).

Uso (da pasta ferramentas/icones): python3 extrai_pranchas.py <pasta de saída> [<materia>-<chave>]
As máscaras usadas na versão aprovada ficam em masc/ (His H01–H07: BiRefNet; demais: IS-Net/U2Net).
Retoques manuais conferidos na prancha ampliada: FORCA (superfície branca da cor do fundo é objeto) e
TIRA (sombra de contato marcada como objeto pelo modelo)."""
import json, os, sys, numpy as np
from PIL import Image
from rembg import new_session, remove
IMG = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'app', 'conteudo-fonte', 'materias', 'ic', 'pranchas') + '/'
OUT = sys.argv[1]
C = [(40, 356), (392, 706), (742, 1058), (1094, 1408)]
def grade(r1, r2, chaves):
    out = []
    for i, k in enumerate(chaves):
        x0, x1 = C[i % 4]; y0, y1 = (r1 if i < 4 else r2)
        out.append((k, (x0, y0, x1, y1)))
    return out
PRANCHAS = {
    'his': ('historia.webp', grade((196, 528), (640, 945), ['H01', 'H02', 'H03', 'H04', 'H05', 'H06', 'H07', 'H08']) + [('_materia', (418, 28, 592, 168))]),
    'fil': ('filosofia.webp', grade((232, 524), (642, 935), ['L01', 'L02', 'L03', 'L04', 'L05', 'L06', 'L07', 'L08']) + [('_materia', (646, 16, 802, 114))]),
    'soc': ('sociologia.webp', grade((216, 500), (625, 932), ['S01', 'S02', 'S03', 'S04', 'S05', 'S06', 'S07', 'S08']) + [('_materia', (316, 16, 514, 190))]),
    'ing': ('ingles.webp', grade((215, 594), (635, 1014), ['_ouvir', 'I02', 'I03', 'I04', '_pronuncia', '_fala', 'I01', '_escrita']) + [('_materia', (453, 46, 646, 184))]),
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

UNIAO = {'fil-L07', 'soc-S06', 'ing-I01', 'ing-_pronuncia', 'his-H06'}
# retoque manual (conferido na prancha ampliada): superfícies brancas da mesma cor do fundo que são objeto
FORCA = {
    'ing-I01': [(27, 60), (95, 52), (165, 65), (210, 50), (272, 57), (300, 85), (302, 228), (190, 240), (45, 235), (30, 220), (25, 70)],
    'soc-S06': [(34, 197), (119, 150), (136, 220), (54, 235)],
    'ing-_pronuncia': [(150, 170), (175, 135), (220, 120), (270, 128), (300, 160), (305, 200), (290, 240), (250, 262), (215, 262), (190, 272), (178, 265), (165, 238), (150, 210)],
    'his-H06': [(211, 31), (227, 38), (250, 59), (247, 100), (246, 150), (230, 150), (223, 120), (197, 110), (195, 83), (209, 47)],
    'fil-L07': [(30, 200), (80, 185), (130, 197), (190, 185), (237, 197), (257, 260), (135, 277), (15, 262)],
}
# retoque manual: faixas de sombra de contato que o modelo marcou como objeto (só o que é sombra sai)
TIRA = {
    'soc-S07': [(30, 250), (300, 250), (300, 306), (30, 306)],
    'his-H06': [(0, 220), (80, 220), (80, 280), (304, 280), (304, 306), (0, 306)],
    'fil-L07': [(255, 200), (316, 200), (316, 293), (0, 293), (0, 280), (140, 284), (255, 270)],
}

def mascara(chave, im):
    import os
    if chave in UNIAO:
        # dois modelos: cada um enxerga partes brancas diferentes; vale o que qualquer um viu
        out = []
        for mod in ('isnet-general-use', 'u2net'):
            f = f'masc/{chave}.{mod}.png'
            if not os.path.exists(f):
                remove(im, session=new_session(mod), only_mask=True).save(f)
            out.append(np.asarray(Image.open(f)).astype(float))
        return Image.fromarray(np.maximum(*out).astype(np.uint8))
    f = f'masc/{chave}.png'
    fi = f'masc/{chave}.isnet-general-use.png'
    if os.path.exists(f) and chave.startswith('his-H0') and chave not in ('his-H08',):
        # máscara do BiRefNet inclui a sombra da prancha: fica só o que o IS-Net também vê como objeto
        if not os.path.exists(fi):
            remove(im, session=new_session('isnet-general-use'), only_mask=True).save(fi)
        return Image.open(fi)   # o BiRefNet inclui a sombra da prancha na base; o IS-Net não
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
    if chave in ('fil-L07', 'fil-L08'):
        # páginas e céu claros cercados pelo desenho: buraco da máscara é parte do objeto
        from scipy import ndimage
        m = np.maximum(m, ndimage.binary_fill_holes(m > 0.5).astype(float))
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
    if chave == 'soc-S02':
        obj &= ~(tipo_sombra & escuro & (grad < 2.2) & (m < 0.5))   # sombra cercada pelo desenho (dentro do anel)
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
    if chave in TIRA:
        from PIL import ImageDraw
        pm = Image.new('L', (obj.shape[1], obj.shape[0]), 0)
        ImageDraw.Draw(pm).polygon(TIRA[chave], fill=255)
        obj &= ~((np.asarray(pm) > 0) & escuro & (dif < 60) & (croma_d < 16))
    if chave in FORCA:
        from PIL import ImageDraw
        pm = Image.new('L', (obj.shape[1], obj.shape[0]), 0)
        ImageDraw.Draw(pm).polygon(FORCA[chave], fill=255)
        obj |= np.asarray(pm) > 0
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
    # sombra clara da prancha que ficou sob a base: em cada coluna, o que estiver abaixo do último pixel
    # "de objeto" (escuro ou colorido) e for claro é chão/sombra, não objeto
    if chave.startswith('his-H'):
        lum = a.mean(2); sat_ = a.max(2) - a.min(2)
        opaco = out[..., 3] > 0
        solido = opaco & ((lum < 175) | (sat_ > 75))
        ys_a = np.where(opaco.any(1))[0]
        y0b = int(ys_a.max() - 0.3 * (ys_a.max() - ys_a.min()))
        poupa = {'his-H03': (75, 195, 272)}.get(chave)   # arroz derramado (x0, x1, y desde): grãos brancos são objeto
        for x in range(out.shape[1]):
            col = np.where(solido[y0b:, x])[0]
            ult = y0b + col.max() if len(col) else y0b
            abaixo = np.arange(out.shape[0]) > ult + 1
            if poupa and poupa[0] <= x <= poupa[1]:
                abaixo &= np.arange(out.shape[0]) < poupa[2]
            out[abaixo & (lum[:, x] >= 175) & (sat_[:, x] <= 75), x, 3] = 0
    # retoque manual conferido na ampliação: faixas de chão claro que sobraram (só tira pixel claro e pouco colorido)
    CHAO = {
        'his-H02': ([(0, 305), (316, 305), (316, 332), (0, 332)], 80),
        'his-H03': ([(15, 252), (110, 252), (110, 280), (15, 280)], 100, 150),
        'his-H04': ([(0, 300), (316, 300), (316, 332), (0, 332)], 50),
    }
    if chave in CHAO:
        from PIL import ImageDraw
        pts, smax, lmin = (CHAO[chave] + (170,))[:3]
        pm = Image.new('L', (out.shape[1], out.shape[0]), 0)
        ImageDraw.Draw(pm).polygon(pts, fill=255)
        lum = a.mean(2); sat_ = a.max(2) - a.min(2)
        out[(np.asarray(pm) > 0) & (lum > lmin) & (sat_ < smax), 3] = 0
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

def enquadra(im, lado=288, margem=10):
    im = com_sombra(limpa(im))
    al = np.asarray(im)[..., 3]
    ys, xs = np.where(al > 0)
    im = im.crop((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1))
    esc = min((lado - 2 * margem) / im.width, (lado - 2 * margem) / im.height, 1.12)
    im = im.resize((max(1, round(im.width * esc)), max(1, round(im.height * esc))), Image.LANCZOS)
    tela = Image.new('RGBA', (lado, lado), (0, 0, 0, 0))
    tela.alpha_composite(im, ((lado - im.width) // 2, (lado - im.height) // 2))
    return tela, esc

rel = {}
for m, (prancha, itens) in PRANCHAS.items():
    for k, caixa in itens:
        if len(sys.argv) > 2 and f'{m}-{k}' != sys.argv[2]:
            continue
        im = extrai(prancha, caixa, f'{m}-{k}')
        if k == '_materia':
            im = com_sombra(limpa(im))
            al = np.asarray(im)[..., 3]; ys, xs = np.where(al > 0)
            im = im.crop((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1))
            im.save(f'{OUT}/{m}-materia.png'); rel[f'{m}/_materia'] = list(im.size); continue
        q, esc = enquadra(im)
        q.save(f'{OUT}/{m}-{k}.png'); rel[f'{m}/{k}'] = round(esc, 2)
print(json.dumps(rel))

"""Sombra de contato v2 (31/10, a pedido do Vitor: as sombras estavam artificiais).
Antes: silhueta do objeto achatada e borrada -> faixa cinza retangular, mais larga que o objeto, bordas duras nas laterais.
Agora: o que a luz FRONTAL-SUPERIOR suave produz numa superficie: o objeto apoiado projeta a sombra para tras e para baixo,
e o que se ve de frente e' (1) oclusao de contato: uma elipse estreita e escura exatamente sob os pontos de apoio e
(2) penumbra: uma elipse mais larga, muito suave, que some antes das pontas do objeto. Medidas tiradas da 'pegada'
do objeto (largura das linhas mais baixas), nao da silhueta inteira; objeto que flutua (pegada estreita/alta) ganha sombra
menor, mais clara e afastada. Tudo em gradiente radial continuo (sem borrar mascara, logo sem cantos)."""
import numpy as np
from PIL import Image

def separa_render(rgba):
    """PNG do Blender com shadow catcher -> so o objeto (a sombra do catcher sai; vem manchada pela luz de preenchimento)."""
    a = np.array(rgba.convert('RGBA')).astype(np.float32) / 255
    rgb, al = a[..., :3], a[..., 3]
    obj = (al > 0.97) | ((rgb.max(2) > 0.10) & (al > 0.02))
    from scipy import ndimage
    obj = ndimage.binary_opening(obj, iterations=1)
    lab, n = ndimage.label(obj)
    if n:
        tam = ndimage.sum(obj, lab, range(1, n + 1)); keep = np.isin(lab, [i + 1 for i, t in enumerate(tam) if t >= tam.max() * 0.004])
        obj = keep
    soft = ndimage.gaussian_filter(obj.astype(np.float32), 0.6)
    a[..., 3] = np.where(obj, al, al * np.clip(soft, 0, 1) * (rgb.max(2) > 0.10))
    return Image.fromarray((np.clip(a, 0, 1) * 255).astype(np.uint8), 'RGBA')

def contato(A, forca=1.0):
    """A: alpha do objeto (HxW, 0..1) ja no quadro final. Devolve alpha da sombra (cor preta)."""
    H, W = A.shape
    linhas = np.where(A.max(1) > 0.5)[0]
    if not len(linhas): return np.zeros_like(A)
    topo, base = linhas.min(), linhas.max(); alt = base - topo + 1
    # pegada: colunas ocupadas nas linhas dos ultimos 6% da altura
    faixa = A[max(topo, base - max(2, int(alt * 0.06))):base + 1]
    cols = np.where(faixa.max(0) > 0.5)[0]
    larg_tot = np.where(A.max(0) > 0.5)[0]; Wobj = larg_tot.max() - larg_tot.min() + 1
    if len(cols) < 2: cols = larg_tot
    c0, c1 = cols.min(), cols.max(); pe = c1 - c0 + 1; cx = (c0 + c1) / 2
    # objeto com pegada estreita em relacao a largura (esfera, atomo, molecula) "flutua" visualmente: sombra menor e mais clara
    razao = pe / max(1, Wobj); flut = razao < 0.35
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    def elipse(cx, cy, rx, ry, op, exp=1.6):
        d = ((xx - cx) / rx) ** 2 + ((yy - cy) / ry) ** 2
        return op * np.clip(1 - d, 0, 1) ** exp
    if flut:
        rx = max(pe, Wobj * 0.45) * 0.55; ry = rx * 0.16
        sh = elipse(cx, base + ry * 0.8, rx, ry, 0.24 * forca, 1.5)
    else:
        rx1 = pe * 0.50 * 0.98; ry1 = max(2.5, W * 0.016)
        ao = elipse(cx, base - ry1 * 0.10, rx1, ry1, 0.62 * forca, 1.1)            # oclusao de contato
        rx2 = min(pe * 0.64, Wobj * 0.58); ry2 = max(5.0, rx2 * 0.16)
        pen = elipse(cx, base - ry2 * 0.30, rx2, ry2, 0.30 * forca, 1.8)          # penumbra (cai para tras: centro um pouco acima da base)
        sh = np.maximum(ao, pen)
    return np.clip(sh * (1 - A), 0, 1)

def compoe(obj_rgba, S=288, fit=0.86, forca=1.0):
    o = obj_rgba.convert('RGBA'); bb = o.getchannel('A').point(lambda v: 255 if v > 30 else 0).getbbox(); o = o.crop(bb)
    w, h = o.size; k = fit * S / max(w, h); o = o.resize((max(1, round(w * k)), max(1, round(h * k))), Image.LANCZOS)
    quadro = Image.new('RGBA', (S, S), (0, 0, 0, 0)); y = (S - o.height) // 2 - int(S * 0.02)
    quadro.alpha_composite(o, ((S - o.width) // 2, max(0, y)))
    A = np.array(quadro.getchannel('A')).astype(np.float32) / 255
    sh = contato(A, forca)
    base = Image.fromarray(np.dstack([np.full((S, S, 3), (24, 22, 30), np.uint8), (sh * 255).astype(np.uint8)]), 'RGBA')
    base.alpha_composite(quadro); return base

def solidifica(rgba):
    """Recorte com o miolo semitransparente (partes claras/brancas perdiam opacidade no recorte por saturacao) -> miolo opaco;
    so a borda (1-2 px) mantem a transicao suave."""
    from scipy import ndimage
    a = np.array(rgba.convert('RGBA')).astype(np.float32) / 255
    al = a[..., 3]
    corpo = ndimage.binary_fill_holes(ndimage.binary_closing(al > 0.25, iterations=2))
    lab, n = ndimage.label(corpo)
    if n:
        tam = ndimage.sum(corpo, lab, range(1, n + 1)); corpo = np.isin(lab, [i + 1 for i, t in enumerate(tam) if t >= tam.max() * 0.01])
    miolo = ndimage.binary_erosion(corpo, iterations=2)
    borda = ndimage.gaussian_filter(corpo.astype(np.float32), 0.8)
    a[..., 3] = np.where(miolo, 1.0, np.where(corpo, np.maximum(al, borda), al * (al > 0.25)))
    return Image.fromarray((np.clip(a, 0, 1) * 255).astype(np.uint8), 'RGBA')

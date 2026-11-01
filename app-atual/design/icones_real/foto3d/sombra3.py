"""Sombra no modelo da referencia de 31/10 (folha de 53 icones enviada pelo Vitor).
Parametros ajustados por minimos quadrados sobre 14 icones opacos da propria referencia:
silhueta (metade de baixo, rampa a partir de 46% da altura) deslocada +3,2% x / +4,1% y,
desfoque 5% do quadro, opacidade 0,45 + faixa de contato (dy 1,7%, desfoque 0,7%, op 0,11).
Luz frontal-superior vinda da esquerda; sombra cai para baixo e levemente para a direita."""
import numpy as np
from PIL import Image
from scipy import ndimage
P = [0.0317, 0.0406, 0.05, 0.4548, 0.0168, 0.0071, 0.1107, 0.4635]
COR = (26, 24, 30)

def sombra(M, p=P):
    dx, dy, s1, op1, dy2, s2, op2, y0 = p
    S = M.shape[0]
    ys = np.nonzero(M.max(1) > 0.5)[0]; top, bot = ys.min(), ys.max(); h = max(bot - top, 1)
    yy = np.arange(S)[:, None]
    Mw = M * np.clip((yy - (top + y0 * h)) / (0.35 * h), 0, 1)
    a = ndimage.gaussian_filter(ndimage.shift(Mw, (dy * S, dx * S), order=1), s1 * S)
    b = ndimage.gaussian_filter(ndimage.shift(Mw, (dy2 * S, 0), order=1), s2 * S)
    return np.clip(1 - (1 - op1 * a) * (1 - op2 * b), 0, 1)

def compoe(obj_rgba, S=288, fit=0.86):
    o = obj_rgba.convert('RGBA'); bb = o.getchannel('A').point(lambda v: 255 if v > 30 else 0).getbbox(); o = o.crop(bb)
    w, h = o.size; k = fit * S / max(w, h)
    o = o.convert('RGBa').resize((max(1, round(w * k)), max(1, round(h * k))), Image.LANCZOS, reducing_gap=3.0).convert('RGBA')
    q = Image.new('RGBA', (S, S), (0, 0, 0, 0)); y = round(S / 2 - 0.02 * S - o.height / 2)
    q.alpha_composite(o, ((S - o.width) // 2, max(0, y)))
    A = np.array(q.getchannel('A')).astype(np.float32) / 255
    M = ndimage.gaussian_filter(ndimage.binary_fill_holes(ndimage.binary_closing(A > 0.5, iterations=2)).astype(np.float32), 0.6)
    sh = sombra(M)
    e = np.minimum.reduce([np.arange(S)[:, None].repeat(S, 1), np.arange(S)[::-1][:, None].repeat(S, 1),
                           np.arange(S)[None, :].repeat(S, 0), np.arange(S)[::-1][None, :].repeat(S, 0)]).astype(np.float32)
    sh = sh * np.clip((e - 2) / 18, 0, 1)
    base = Image.fromarray(np.dstack([np.full((S, S, 3), COR, np.uint8), (sh * 255).astype(np.uint8)]), 'RGBA')
    base.alpha_composite(q); return base

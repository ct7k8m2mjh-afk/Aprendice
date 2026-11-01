"""Pos-processamento dos icones (30/10). Gera o SVG final (imagem WebP embutida, quadrado 288) + previa.
  python3 -I post.py render <png_rgba_do_blender> <ID>
  python3 -I post.py foto   <foto> <ID> [--flip] [--crop x0,y0,x1,y1] [--nofill] [--fit 0.86]
  python3 -I post.py ref    <png_rgba_recortado_da_referencia> <ID>
ID de modulo (B01) -> icones_real/B01.svg ; ID de conteudo (B01.3, M-OUTRO) -> icones_real/sub/<ID>.svg
Previa: foto3d/prev/<ID>.png (sobre branco e sobre o rosa do app)."""
import sys, os, io, base64, re, shutil
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage
AQUI = os.path.dirname(os.path.abspath(__file__)); RAIZ = os.path.dirname(AQUI)
S = 288

def _caminho(i):
    return os.path.join(RAIZ, i + '.svg') if re.match(r'^[BQMP]\d\d$', i) else os.path.join(RAIZ, 'sub', i + '.svg')

def _sombra_sintetica(A):
    """A: alpha (HxW) do objeto no quadro final. Luz batendo de FRENTE (pedido do Vitor 30/10): a sombra cai para tras do
    objeto; aparece como contato escuro, curto e centralizado na base + um halo bem suave logo atras (acima) da base."""
    H, W = A.shape; im = Image.fromarray((A * 255).astype(np.uint8))
    ys = np.where(A.max(1) > 0.3)[0]
    if not len(ys): return np.zeros_like(A)
    base = ys.max(); alt = base - ys.min()
    # 1) sombra projetada para tras: silhueta achatada (25% da altura) cuja base fica na base do objeto, subindo para tras
    h1 = max(2, int(alt * 0.25)); a1 = im.resize((W, h1)); t1 = Image.new('L', (W, H), 0); t1.paste(a1, (0, base - h1 + int(H * 0.01)))
    s1 = np.array(t1.filter(ImageFilter.GaussianBlur(W * 0.03))).astype(np.float32) / 255 * 0.22
    # 2) contato: silhueta muito achatada exatamente na base
    h2 = max(1, int(alt * 0.07)); a2 = im.resize((W, h2)); t2 = Image.new('L', (W, H), 0); t2.paste(a2, (0, base - h2 // 2))
    s2 = np.array(t2.filter(ImageFilter.GaussianBlur(W * 0.012))).astype(np.float32) / 255 * 0.45
    return np.clip(np.maximum(s1, s2), 0, 1)

def _quadro(rgba, fit):
    """recorta pelo alpha e centraliza num quadrado S x S com o lado maior = fit*S"""
    a = rgba.getchannel('A'); bb = a.point(lambda v: 255 if v > 30 else 0).getbbox(); bb = (max(0, bb[0] - 4), max(0, bb[1] - 4), min(a.width, bb[2] + 4), min(a.height, bb[3] + 4)); rgba = rgba.crop(bb)
    w, h = rgba.size; k = fit * S / max(w, h); rgba = rgba.resize((max(1, round(w * k)), max(1, round(h * k))), Image.LANCZOS)
    out = Image.new('RGBA', (S, S), (0, 0, 0, 0)); out.alpha_composite(rgba, ((S - rgba.width) // 2, (S - rgba.height) // 2)); return out

def _corta_foto(path, flip, crop, nofill):
    from rembg import remove, new_session
    im = Image.open(path).convert('RGB')
    if crop: im = im.crop(crop)
    if flip: im = im.transpose(Image.FLIP_LEFT_RIGHT)
    im.thumbnail((1000, 1000), Image.LANCZOS)
    m = np.array(remove(im, session=new_session('isnet-general-use'), only_mask=True)).astype(np.float32) / 255
    obj = m > 0.5
    lab, k = ndimage.label(obj)
    if k:
        sz = ndimage.sum(obj, lab, range(1, k + 1)); keep = np.isin(lab, [j + 1 for j, s in enumerate(sz) if s >= sz.max() * 0.02])
        if not nofill: keep = ndimage.binary_fill_holes(keep)
        m = np.where(keep, np.maximum(m, 0.0), 0) ; m = np.where(keep & (m < 0.5), m, m)
    rgba = np.dstack([np.array(im), (np.clip(m, 0, 1) * 255).astype(np.uint8)])
    return Image.fromarray(rgba, 'RGBA')

def grava(img, i):
    buf = io.BytesIO(); img.save(buf, 'WEBP', quality=90, method=6); b = base64.b64encode(buf.getvalue()).decode()
    svg = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 %d %d"><image width="%d" height="%d" href="data:image/webp;base64,%s"/></svg>' % (S, S, S, S, b))
    dst = _caminho(i); bak = os.path.join(RAIZ, '_bak_3010b', os.path.relpath(dst, RAIZ))
    if os.path.exists(dst) and not os.path.exists(bak):
        os.makedirs(os.path.dirname(bak), exist_ok=True); shutil.copy(dst, bak)
    open(dst, 'w').write(svg)
    os.makedirs(os.path.join(AQUI, 'prev'), exist_ok=True)
    pv = Image.new('RGBA', (2 * S + 8, S), (255, 255, 255, 255)); r = Image.new('RGBA', (S, S), '#F1D9E3'); pv.paste(r, (S + 8, 0))
    pv.alpha_composite(img, (0, 0)); pv.alpha_composite(img, (S + 8, 0)); pv.convert('RGB').save(os.path.join(AQUI, 'prev', i + '.png'))
    print(i, '->', os.path.relpath(dst, RAIZ), len(svg) // 1024, 'KB')

if __name__ == '__main__':
    modo, src, i = sys.argv[1:4]; a = sys.argv[4:]
    fit = float(a[a.index('--fit') + 1]) if '--fit' in a else 0.86
    if modo == 'render':
        r = np.array(Image.open(src).convert('RGBA')).astype(np.float32) / 255
        somb = r[..., :3].max(2) < 0.06            # pixel so de sombra (shadow catcher: preto com alpha)
        r[..., 3] = np.where(somb, np.clip((r[..., 3] - 0.07) / 0.93, 0, 1), r[..., 3])   # tira o veu cinza do chao
        img = _quadro(Image.fromarray((r * 255).astype(np.uint8), 'RGBA'), fit)
    elif modo == 'ref':
        img = _quadro(Image.open(src).convert('RGBA'), fit)
    elif modo == 'obj':   # objeto ja recortado SEM sombra -> recebe a sombra padrao (luz de frente)
        obj = _quadro(Image.open(src).convert('RGBA'), fit)
        A = np.array(obj.getchannel('A')).astype(np.float32) / 255; sh = _sombra_sintetica(A)
        img = Image.fromarray(np.dstack([np.zeros((S, S, 3), np.uint8), (sh * 255).astype(np.uint8)]), 'RGBA'); img.alpha_composite(obj)
    elif modo == 'foto':
        crop = tuple(int(x) for x in a[a.index('--crop') + 1].split(',')) if '--crop' in a else None
        obj = _quadro(_corta_foto(src, '--flip' in a, crop, '--nofill' in a), fit)
        A = np.array(obj.getchannel('A')).astype(np.float32) / 255
        sh = _sombra_sintetica(A)
        base = Image.fromarray(np.dstack([np.zeros((S, S, 3), np.uint8), (sh * 255).astype(np.uint8)]), 'RGBA')
        base.alpha_composite(obj); img = base
    grava(img, i)

"""Pos-processamento da revisao de Biologia (31/10): igual ao 'post.py render', mas a sombra que se espalha longe do objeto
some suavemente (fica so o contato curto), evitando bordas retas de sombra no quadro.
  python3 -I post_bio.py <png_rgba_do_blender> <ID> [--fit 0.86]"""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import numpy as np
from PIL import Image
from scipy import ndimage
import post
src, i = sys.argv[1:3]; a = sys.argv[3:]
fit = float(a[a.index('--fit') + 1]) if '--fit' in a else 0.86
r = np.array(Image.open(src).convert('RGBA')).astype(np.float32) / 255
somb = r[..., :3].max(2) < 0.06
r[..., 3] = np.where(somb, np.clip((r[..., 3] - 0.07) / 0.93, 0, 1), r[..., 3])
obj = (~somb) & (r[..., 3] > 0.5)
d = ndimage.distance_transform_edt(~obj)
k = r.shape[0] * 0.07
r[..., 3] = np.where(somb, r[..., 3] * np.exp(-(d / k) ** 2), r[..., 3])
A = r[..., 3]; m = A > 30 / 255
ys, xs = np.where(m); y0, y1, x0, x1 = ys.min() - 4, ys.max() + 4, xs.min() - 4, xs.max() + 4
H, W = A.shape; yy, xx = np.mgrid[0:H, 0:W]
borda = np.minimum.reduce([yy - y0, y1 - yy, xx - x0, x1 - xx]).astype(np.float32)
r[..., 3] = np.where(somb, r[..., 3] * np.clip(borda / 14.0, 0, 1), r[..., 3])
img = post._quadro(Image.fromarray((r * 255).astype(np.uint8), 'RGBA'), fit)
post.grava(img, i)

"""Ilustracoes da tela inicial (ilu.json) a partir de um PNG RGBA (30/10). uso: python3 -I ilu_home.py <materia> <png>"""
import sys, json, io, base64
from PIL import Image
m, src = sys.argv[1:3]
im = Image.open(src).convert('RGBA'); im = im.crop(im.getchannel('A').point(lambda v: 255 if v > 2 else 0).getbbox())
H = 420; k = H / max(im.width * 140 / 180, im.height)  # caber em 180x140 (proporcao)
im = im.resize((round(im.width * k), round(im.height * k)), Image.LANCZOS)
buf = io.BytesIO(); im.save(buf, 'WEBP', quality=90, method=6)
w = im.width / H * 140; h = im.height / H * 140
svg = '<svg class="ilu" viewBox="0 0 180 140" aria-hidden="true"><image x="%.1f" y="%.1f" width="%.1f" height="%.1f" href="data:image/webp;base64,%s"/></svg>' % ((180 - w) / 2, (140 - h) / 2, w, h, base64.b64encode(buf.getvalue()).decode())
p = '/home/claude/escadas-sc/design/ilu_ref.json'; d = json.load(open(p)); d[m] = svg; json.dump(d, open(p, 'w'), ensure_ascii=False)
print(m, len(svg) // 1024, 'KB', round(w), round(h))

import os, re, base64, io, math, sys
sys.path.insert(0, os.path.dirname(__file__))
import svgmin
from PIL import Image
B = '/tmp/claude-0/-home-claude/e5566652-8789-513e-9e19-aca7ab2e3491/scratchpad/bi/bioicons/static/icons/cc-by-3.0/'
TMP = '/tmp/claude-0/-home-claude/e5566652-8789-513e-9e19-aca7ab2e3491/scratchpad/ras/'
os.makedirs(TMP, exist_ok=True)
RS, QJ = 1.6, 80
INK = '#14213d'
_pw = None
def _page():
    global _pw
    if _pw is None:
        from playwright.sync_api import sync_playwright
        p = sync_playwright().start(); b = p.chromium.launch(); _pw = (p, b, b.new_page())
    return _pw[2]

def load(src, strip=(), extra=''):
    """src: path relative to B or absolute; returns (inner, viewbox)."""
    path = src if src.startswith('/') else B + src
    s = open(path, encoding='utf-8').read()
    vb = svgmin.viewbox(s)
    s = svgmin.strip_labels(s, strip)
    return svgmin.inner(s) + extra, vb

def raster(inner, vb, crop, wpx, hpx, key, q=80):
    x0, y0, x1, y1 = crop
    svg = f'<svg xmlns="http://www.w3.org/2000/svg" width="{wpx}" height="{hpx}" viewBox="{x0} {y0} {x1-x0} {y1-y0}" preserveAspectRatio="xMidYMid meet"><rect x="{x0-1000}" y="{y0-1000}" width="{x1-x0+3000}" height="{y1-y0+3000}" fill="#fff"/>{inner}</svg>'
    f = TMP + key + '.svg'; open(f, 'w').write(svg)
    pg = _page(); pg.set_viewport_size({'width': wpx, 'height': hpx})
    pg.goto('file://' + f); pg.wait_for_timeout(150)
    png = pg.screenshot(clip={'x': 0, 'y': 0, 'width': wpx, 'height': hpx})
    im = Image.open(io.BytesIO(png)).convert('RGB')
    bio = io.BytesIO(); im.save(bio, 'JPEG', quality=q, optimize=True, progressive=True)
    return base64.b64encode(bio.getvalue()).decode()

def layer(src, crop=None, place=(0, 0, 600), strip=(), extra='', mode='auto', nd=None, pid='a', rot=0, rs=None, q=None):
    """place = (X, Y, W) canvas box top-left and width; height follows crop aspect."""
    inner, vb = load(src, strip, extra)
    if crop is None: crop = (vb[0], vb[1], vb[0] + vb[2], vb[1] + vb[3])
    x0, y0, x1, y1 = crop
    X, Y, W = place; k = W / (x1 - x0); H = (y1 - y0) * k
    if mode == 'auto': mode = 'vec' if len(inner.encode()) <= 100 * 1024 else 'raster'
    if mode == 'vec':
        inner = svgmin.prefix_ids(inner, pid)
        if nd is not None: inner = svgmin.rnd(inner, nd)
        body = f'<svg x="{X:.1f}" y="{Y:.1f}" width="{W:.1f}" height="{H:.1f}" viewBox="{x0} {y0} {x1-x0} {y1-y0}" overflow="hidden">{inner}</svg>'
    else:
        wpx = int(round(W * (rs or RS))); hpx = int(round(H * (rs or RS)))
        b64 = raster(inner, vb, crop, wpx, hpx, pid + str(abs(hash(src)) % 10**6), q or QJ)
        body = f'<image x="{X:.1f}" y="{Y:.1f}" width="{W:.1f}" height="{H:.1f}" href="data:image/jpeg;base64,{b64}"/>'
    def T(sx, sy): return (X + (sx - x0) * k, Y + (sy - y0) * k)
    return {'body': body, 'T': T, 'box': (X, Y, X + W, Y + H), 'k': k}

def marker(target, label, n=1, r=17):
    tx, ty = target; lx, ly = label
    d = math.hypot(tx - lx, ty - ly); ux, uy = (tx - lx) / d, (ty - ly) / d
    sx, sy = lx + ux * r, ly + uy * r; ex, ey = tx - ux * 4.5, ty - uy * 4.5
    return (f'<g id="marcador">'
            f'<line x1="{sx:.1f}" y1="{sy:.1f}" x2="{ex:.1f}" y2="{ey:.1f}" stroke="#fff" stroke-width="6" stroke-linecap="round"/>'
            f'<line x1="{sx:.1f}" y1="{sy:.1f}" x2="{ex:.1f}" y2="{ey:.1f}" stroke="{INK}" stroke-width="2.4" stroke-linecap="round"/>'
            f'<circle cx="{tx:.1f}" cy="{ty:.1f}" r="5" fill="{INK}" stroke="#fff" stroke-width="2.2"/>'
            f'<circle cx="{lx:.1f}" cy="{ly:.1f}" r="{r}" fill="{INK}" stroke="#fff" stroke-width="3"/>'
            f'<text x="{lx:.1f}" y="{ly + 7.2:.1f}" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="21" font-weight="700" fill="#fff">{n}</text></g>')

def write(out, layers, target, label, H, credit='Ilustração: Servier Medical Art, CC BY 3.0', W=600, title=''):
    body = ''.join(l['body'] for l in layers)
    cr = f'<text x="{W-8}" y="{H-8}" text-anchor="end" font-family="Helvetica, Arial, sans-serif" font-size="11" fill="#8a8f98">{credit}</text>' if credit else ''
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" role="img" aria-label="{title}">'
           f'<rect width="{W}" height="{H}" fill="#fff"/>{body}{marker(target, label)}{cr}</svg>')
    os.makedirs(os.path.dirname(out), exist_ok=True)
    open(out, 'w', encoding='utf-8').write(svg)
    return len(svg.encode())

"""Normaliza icones de bancos abertos para um tratamento unico:
viewBox 0 0 48 48, linha 3/48 em currentColor (100%) + preenchimento currentColor a 25% (duotone)."""
import re, os, json, subprocess, html
S = '/tmp/claude-0/-home-claude/e5566652-8789-513e-9e19-aca7ab2e3491/scratchpad'
SRC = S + '/src'
T = S + '/tools'
PH = SRC + '/phosphor/assets/duotone/%s-duotone.svg'
HI = SRC + '/hi/public/icons/svg/%s/%s.svg'
TB = SRC + '/tabler/icons/outline/%s.svg'
LU = SRC + '/lucide/icons/%s.svg'
BI = SRC + '/bi/static/icons/'
OP = '.25'


def _inner(svg):
    svg = re.sub(r'<\?xml.*?\?>|<!--.*?-->', '', svg, flags=re.S)
    m = re.search(r'<svg[^>]*>(.*)</svg>', svg, re.S)
    return m.group(1).strip()


def ph(name):
    s = open(PH % name).read()
    inner = _inner(s).replace('opacity="0.2"', 'opacity="%s"' % OP)
    return '<g fill="currentColor" transform="scale(0.1875)">%s</g>' % inner


def hi(path, tint=True, extra=1.0):
    """path = 'body/lungs'. Outline engrossado (+1) e versao 'filled' a 25% por baixo."""
    out = open(HI % ('outline', path)).read()
    o = _inner(out)
    o = re.sub(r'fill="(?!none)[^"]*"', 'fill="currentColor"', o)
    o = re.sub(r'stroke="(?!none)[^"]*"', 'stroke="currentColor"', o)
    res = ''
    if tint and os.path.exists(HI % ('filled', path)):
        f = _inner(open(HI % ('filled', path)).read())
        f = re.sub(r'fill="(?!none)[^"]*"', 'fill="currentColor"', f)
        f = re.sub(r'stroke="(?!none)[^"]*"', 'stroke="currentColor"', f)
        res += '<g opacity="%s">%s</g>' % (OP, f)
    res += '<g stroke="currentColor" stroke-width="%s" stroke-linejoin="round">%s</g>' % (extra, o)
    return res


def _stroke24(inner, fill_idx, scale=2.2, sw=None):
    inner = re.sub(r'<path stroke="none" d="M0 0h24v24H0z" fill="none"\s*/>', '', inner)
    els = re.findall(r'<(?:path|circle|rect|ellipse|line|polyline|polygon)\b[^>]*/>', inner)
    sw = sw or 3 / scale
    fills = []
    for k, e in enumerate(els):
        closed = (e.startswith('<circle') or e.startswith('<rect') or e.startswith('<ellipse') or e.startswith('<polygon')
                  or re.search(r'd="[^"]*[zZ]\s*"', e))
        if (fill_idx == 'auto' and closed) or (isinstance(fill_idx, (list, set)) and k in fill_idx):
            fills.append(e)
    off = 12 - 12 * scale
    g = '<g transform="matrix(%s 0 0 %s %s %s)">' % (scale, scale, off + 12, off + 12)
    body = ''
    if fills:
        body += '<g fill="currentColor" stroke="none" opacity="%s">%s</g>' % (OP, ''.join(re.sub(r'\s(fill|stroke)="[^"]*"', '', f) for f in fills))
    body += '<g fill="none" stroke="currentColor" stroke-width="%.3f" stroke-linecap="round" stroke-linejoin="round">%s</g>' % (sw, ''.join(els))
    return g + body + '</g>'


def tb(name, fill='auto'):
    return _stroke24(_inner(open(TB % name).read()), fill)


def lu(name, fill='auto'):
    return _stroke24(_inner(open(LU % name).read()), fill)


BIO_CACHE = T + '/bio_cache.json'


def bio_convert(items):
    """items: [(key, relpath, opts)]"""
    js = [{'key': k, 'file': BI + p, 'opts': o} for k, p, o in items]
    json.dump(js, open(T + '/bio_in.json', 'w'))
    subprocess.run(['node', T + '/bioconv.js', T + '/bio_in.json', BIO_CACHE], check=True, cwd='/home/claude')


def bio(key):
    c = json.load(open(BIO_CACHE))
    return c[key]['svg']


def wrap(inner):
    return ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" '
            'aria-hidden="true">%s</svg>' % inner)


def sheet(entries, title, color_light, color_dark, path_png, cols=4):
    """entries: [(id, label, svgstring)]"""
    def panel(bg, fg, sub):
        cells = ''.join(
            '<div class="c"><div class="i56" style="color:%s">%s</div><div class="i24" style="color:%s">%s</div>'
            '<div class="t" style="color:%s"><b>%s</b> %s</div></div>' % (fg, s, fg, s, sub, i, html.escape(l)) for i, l, s in entries)
        return '<div class="p" style="background:%s">%s</div>' % (bg, cells)
    css = ('body{margin:0;font:12px/1.25 system-ui,sans-serif;background:#ddd}h1{font-size:15px;margin:8px 12px}'
           '.wrap{display:flex;gap:0}.p{display:grid;grid-template-columns:repeat(%d,190px);gap:6px 8px;padding:12px}'
           '.c{display:flex;align-items:center;gap:8px}.i56 svg{width:56px;height:56px;display:block}'
           '.i24 svg{width:24px;height:24px;display:block}.t{width:96px;font-size:10.5px}' % cols)
    h = ('<html><head><style>%s</style></head><body><h1>%s</h1><div class="wrap">%s%s%s</div></body></html>'
         % (css, html.escape(title), panel('#FFFFFF', color_light, '#444'), panel('#F5F5F3', color_light, '#444'),
            panel('#16171B', color_dark, '#bbb')))
    hp = path_png[:-4] + '.html'
    open(hp, 'w').write(h)
    subprocess.run(['node', T + '/shot.js', hp, path_png], check=True, cwd='/home/claude')


def gallery(entries, path_png, cols=12, color='#177E36'):
    cells = ''.join('<div class="c"><div style="color:%s">%s</div><div class="t">%s</div></div>' % (color, s, html.escape(l)) for l, s in entries)
    h = ('<html><head><style>body{margin:0;background:#fff;font:10px system-ui}.g{display:grid;grid-template-columns:repeat(%d,96px);gap:4px;padding:8px}'
         '.c{text-align:center}.c svg{width:48px;height:48px}.t{height:24px;overflow:hidden;color:#333}</style></head><body><div class="g">%s</div></body></html>' % (cols, cells))
    hp = path_png[:-4] + '.html'
    open(hp, 'w').write(h)
    subprocess.run(['node', T + '/shot.js', hp, path_png], check=True, cwd='/home/claude')


def _fixarc(a):
    nums = re.findall(r'-?(?:\d+\.?\d*|\.\d+)(?:e-?\d+)?', a)
    out = []; k = 0
    while nums:
        if k % 7 in (3, 4) and len(nums[0]) > 1 and nums[0][0] in '01' and '.' not in nums[0][:2]:
            out.append(nums[0][0]); nums[0] = nums[0][1:]
        else:
            out.append(nums.pop(0))
        k += 1
    return ' ' + ' '.join(out) + ' '


def _closed_subpaths(d):
    """devolve lista de subcaminhos fechados (absolutizando o 'M' inicial)"""
    d = re.sub(r'([Aa])([^A-Za-z]*)', lambda m: m.group(1) + _fixarc(m.group(2)), d)
    toks = re.findall(r'[MmLlHhVvCcSsQqTtAaZz]|-?(?:\d+\.?\d*|\.\d+)(?:e-?\d+)?', d)
    i = 0; cx = cy = 0; sx = sy = 0; cmd = None; out = []; cur = None
    NA = {'M': 2, 'L': 2, 'H': 1, 'V': 1, 'C': 6, 'S': 4, 'Q': 4, 'T': 2, 'A': 7, 'Z': 0}
    def flush(closed):
        if cur and len(cur[1]) > 0:
            if closed or (abs(cx - sx) < 0.08 and abs(cy - sy) < 0.08):
                out.append('M%g %g' % (cur[0][0], cur[0][1]) + ''.join(cur[1]) + 'Z')
    while i < len(toks):
        t = toks[i]
        if re.match(r'[A-Za-z]', t):
            cmd = t; i += 1
            if cmd in 'Zz':
                flush(True); cx, cy = sx, sy; cur = None; continue
        n = NA[cmd.upper()]
        args = [float(x) for x in toks[i:i + n]]; i += n
        rel = cmd.islower()
        U = cmd.upper()
        if U == 'M':
            flush(False)
            cx, cy = (cx + args[0], cy + args[1]) if rel else (args[0], args[1])
            sx, sy = cx, cy; cur = [(cx, cy), []]
            cmd = 'l' if rel else 'L'; continue
        seg = cmd + ' '.join('%g' % a for a in args)
        if cur is None: cur = [(cx, cy), []]
        cur[1].append(seg)
        if U == 'H': cx = cx + args[0] if rel else args[0]
        elif U == 'V': cy = cy + args[0] if rel else args[0]
        else:
            if rel: cx += args[-2]; cy += args[-1]
            else: cx, cy = args[-2], args[-1]
    flush(False)
    return out


def _stroke24(inner, fill_idx, scale=2.2, sw=None):
    inner = re.sub(r'<path stroke="none" d="M0 0h24v24H0z" fill="none"\s*/>', '', inner)
    els = re.findall(r'<(?:path|circle|rect|ellipse|line|polyline|polygon)\b[^>]*/>', inner)
    sw = sw or 3 / scale
    fills = []
    for k, e in enumerate(els):
        if isinstance(fill_idx, (list, set)) and k not in fill_idx: continue
        if fill_idx == 'none': continue
        if re.match(r'<(circle|rect|ellipse|polygon)', e):
            fills.append(re.sub(r'\s(fill|stroke)="[^"]*"', '', e))
        elif e.startswith('<path'):
            d = re.search(r'\sd="([^"]*)"', e).group(1)
            try:
                for sp in _closed_subpaths(d): fills.append('<path d="%s"/>' % sp)
            except Exception:
                pass
    off = 24 - 12 * scale
    g = '<g transform="matrix(%s 0 0 %s %s %s)">' % (scale, scale, off, off)
    body = ''
    if fills:
        body += '<g fill="currentColor" stroke="none" opacity="%s">%s</g>' % (OP, ''.join(fills))
    body += '<g fill="none" stroke="currentColor" stroke-width="%.3f" stroke-linecap="round" stroke-linejoin="round">%s</g>' % (sw, ''.join(els))
    return g + body + '</g>'

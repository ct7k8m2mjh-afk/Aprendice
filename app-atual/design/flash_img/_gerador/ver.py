# ver.py out.png files... : sheet of cards at 600px, 2 per row; ver.py --zoom out.png file : zoom 3x around marker dot
import sys, os, re
from playwright.sync_api import sync_playwright
args = sys.argv[1:]
zoom = args[0] == '--zoom'
if zoom: args = args[1:]
out, files = args[0], args[1:]
with sync_playwright() as pw:
    b = pw.chromium.launch(); pg = b.new_page(viewport={'width': 1240, 'height': 900})
    if not zoom:
        cells = ''.join(f'<div style="display:inline-block;margin:4px;border:1px solid #bbb;vertical-align:top"><img src="file://{os.path.abspath(f)}" style="width:600px;display:block"><div style="font:14px sans-serif;padding:2px">{os.path.basename(f)}</div></div>' for f in files)
        open(out + '.html', 'w').write(f'<html><body style="margin:0">{cells}</body></html>')
        pg.goto('file://' + out + '.html'); pg.wait_for_timeout(600); pg.screenshot(path=out, full_page=True)
    else:
        for f in files:
            s = open(f).read(); m = re.search(r'<circle cx="([\d.]+)" cy="([\d.]+)" r="5"', s); cx, cy = float(m.group(1)), float(m.group(2))
            Z = 3; win = 130
            open(out + '.html', 'w').write(f'<html><body style="margin:0;overflow:hidden"><div style="width:{2*win*Z}px;height:{2*win*Z}px;overflow:hidden;position:relative"><img src="file://{os.path.abspath(f)}" style="position:absolute;width:{600*Z}px;left:{-(cx-win)*Z}px;top:{-(cy-win)*Z}px"></div></body></html>')
            pg.set_viewport_size({'width': 2*win*Z, 'height': 2*win*Z}); pg.goto('file://' + out + '.html'); pg.wait_for_timeout(300)
            pg.screenshot(path=out.replace('.png', '_' + os.path.basename(f).replace('.svg', '.png')))
    b.close()

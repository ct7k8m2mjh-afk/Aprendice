# render svg with coordinate grid (viewBox units). usage: grid.py in.svg out.png width [x0 y0 x1 y1 crop in vb units] [step]
import sys, re, os
from playwright.sync_api import sync_playwright
f, out, W = sys.argv[1], sys.argv[2], int(sys.argv[3])
s = open(f, encoding='utf-8').read()
m = re.search(r'viewBox="([^"]+)"', s); vb = [float(v) for v in re.split(r'[ ,]+', m.group(1).strip())]
if len(sys.argv) > 7: crop = [float(v) for v in sys.argv[4:8]]
else: crop = [vb[0], vb[1], vb[0]+vb[2], vb[1]+vb[3]]
step = float(sys.argv[8]) if len(sys.argv) > 8 else None
x0,y0,x1,y1 = crop
if not step:
    span = max(x1-x0, y1-y0); step = 10**len(str(int(span/10)))/ (1 if span/10**len(str(int(span/10)))>5 else 2) if False else None
    import math; raw=(x1-x0)/12; e=10**math.floor(math.log10(raw)); step=min([e,2*e,5*e,10*e], key=lambda v: abs(v-raw))
g=''
import math
x=math.ceil(x0/step)*step
while x<=x1: g+=f'<line x1="{x}" y1="{y0}" x2="{x}" y2="{y1}" stroke="#0a0" stroke-width="{(x1-x0)/1500}" opacity=".6"/><text x="{x}" y="{y0+(y1-y0)*0.02}" font-size="{(x1-x0)/70}" fill="#060">{x:g}</text>'; x+=step
y=math.ceil(y0/step)*step
while y<=y1: g+=f'<line x1="{x0}" y1="{y}" x2="{x1}" y2="{y}" stroke="#0a0" stroke-width="{(x1-x0)/1500}" opacity=".6"/><text x="{x0}" y="{y}" font-size="{(x1-x0)/70}" fill="#060">{y:g}</text>'; y+=step
H = int(W*(y1-y0)/(x1-x0))
h=f'''<html><body style="margin:0;background:#fff"><div style="position:relative;width:{W}px;height:{H}px">
<img src="file://{os.path.abspath(f)}" style="position:absolute;left:{-(x0-vb[0])*W/(x1-x0)}px;top:{-(y0-vb[1])*W/(x1-x0)}px;width:{vb[2]*W/(x1-x0)}px;height:{vb[3]*W/(x1-x0)}px">
<svg style="position:absolute;left:0;top:0" width="{W}" height="{H}" viewBox="{x0} {y0} {x1-x0} {y1-y0}">{g}</svg></div></body></html>'''
p=out+'.html'; open(p,'w').write(h)
with sync_playwright() as pw:
    b=pw.chromium.launch(); pg=b.new_page(viewport={'width':W,'height':H}); pg.goto('file://'+p); pg.wait_for_timeout(300); pg.screenshot(path=out); b.close()
print(vb, step)

import sys, os, glob
d = sys.argv[1]; ids = sys.argv[3:]; out = sys.argv[2]
fs = [os.path.join(d, i + '.svg') for i in ids] if ids else sorted(glob.glob(d + '/*.svg'))
h = '<body style="margin:0;background:#F5F5F3;font:12px sans-serif;display:flex;flex-wrap:wrap;width:1300px">'
for f in fs:
    s = open(f).read()
    h += f'<div style="width:256px;text-align:center;margin:4px;background:#fff"><img src="file://{os.path.abspath(f)}" style="width:240px;height:240px"><br>{os.path.basename(f)}</div>'
open(out, 'w').write(h)

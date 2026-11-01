# -*- coding: utf-8 -*-
"""Pacotes de icones Fluent UI Emoji (MIT) por materia: design/fluent/pack_<m>.json {id: data-uri PNG}.
Modulos: 3D 96px. Conteudos: SVG Color rasterizado a 64px (leve)."""
import os, io, json, base64, cairosvg
from PIL import Image
os.chdir(os.path.dirname(os.path.abspath(__file__)) + '/fluent')
def uri(b): return 'data:image/png;base64,' + base64.b64encode(b).decode()
pref = {'B': 'bio', 'Q': 'qui', 'M': 'mat', 'P': 'por'}
packs = {m: {} for m in pref.values()}
for f in sorted(os.listdir('mod')):
    i = f[:-4]; packs[pref[i[0]]][i] = uri(open('mod/' + f, 'rb').read())
for f in sorted(os.listdir('sub')):
    i = f[:-4]
    png = cairosvg.svg2png(url='sub/' + f, output_width=64, output_height=64)
    im = Image.open(io.BytesIO(png)); buf = io.BytesIO(); im.save(buf, 'PNG', optimize=True)
    for m in (pref.values() if i not in pref and i[0] not in pref else [pref[i[0]]]): packs[m][i] = uri(buf.getvalue())
for m, d in packs.items():
    json.dump(d, open(f'pack_{m}.json', 'w'), separators=(',', ':'))
    print(m, len(d), os.path.getsize(f'pack_{m}.json') // 1024, 'KB')

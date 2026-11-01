# folhas de contato dos icones dos conteudos de Biologia, uma por modulo: nome + icone a 64 e 128 px, sobre branco e #F1F1EE
import os, sys
sys.path.insert(0, '/home/claude/escadas-sc')
import dados_util as u
from nomes import NOMES
D = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'sub'))
OUT = os.path.join(D, 'folhas'); os.makedirs(OUT, exist_ok=True)
nomes = u.le('bio')['nomesub']
for mod in sorted({k.split('.')[0] for k in nomes}):
    ids = sorted((k for k in nomes if k.split('.')[0] == mod), key=lambda k: int(k.split('.')[1]))
    h = ('<!doctype html><meta charset="utf-8"><body style="margin:0;padding:14px;font:13px/1.3 Inter,system-ui,sans-serif;color:#222;background:#fff;width:1000px">'
         f'<div style="font-size:17px;font-weight:700;margin:0 0 4px">{mod} — {NOMES[mod]}: ícones dos conteúdos</div>'
         f'<div style="display:flex;align-items:center;gap:8px;margin:0 0 10px;color:#555">ícone do módulo: <img src="file://{os.path.abspath(os.path.join(D, "..", mod + ".svg"))}" width="48" height="48"> (64 px e 128 px; fundo branco e #F1F1EE)</div>')
    for i in ids:
        f = 'file://' + os.path.join(D, i + '.svg')
        cel = lambda bg, s: f'<div style="background:{bg};width:{s + 16}px;height:144px;display:flex;align-items:center;justify-content:center;border-radius:8px"><img src="{f}" width="{s}" height="{s}"></div>'
        h += (f'<div style="display:flex;align-items:center;gap:8px;border:1px solid #e3e3e0;border-radius:10px;padding:4px;margin:0 0 6px">'
              f'<div style="width:330px"><b>{i}</b><br>{nomes[i]}</div>' + cel('#ffffff', 64) + cel('#ffffff', 128) + cel('#F1F1EE', 64) + cel('#F1F1EE', 128) + '</div>')
    h += '</body>'
    open(os.path.join(OUT, f'folha_{mod}.html'), 'w').write(h)
print('ok')

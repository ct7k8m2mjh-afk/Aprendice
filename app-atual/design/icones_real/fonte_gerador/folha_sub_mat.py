# folhas de contato dos conteudos de Matematica: uma por modulo, icone do modulo para comparar + cada conteudo
# a 64 px e 128 px sobre branco e sobre #F1F1EE, com o nome ao lado.  saida: ../sub/folhas_mat/<modulo>.html
import os, sys, json
sys.path.insert(0, '/home/claude/escadas-sc')
import dados_util as u
from nomes import NOMES
D = u.le('mat')['nomesub']
R = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
OUT = os.path.join(R, 'sub', 'folhas_mat'); os.makedirs(OUT, exist_ok=True)
mods = {}
for k, nome in D.items():
    i = 'M-OUTRO' if k == 'OUTRO' else k
    m = 'M13' if k in ('OUTRO',) else k.split('.')[0]
    mods.setdefault(m, []).append((i, nome))
for m, itens in sorted(mods.items()):
    cel = lambda f, bg, s: f'<div style="background:{bg};width:{s+12}px;height:{s+12}px;display:flex;align-items:center;justify-content:center;border-radius:8px"><img src="file://{f}" width="{s}" height="{s}"></div>'
    h = ('<!doctype html><meta charset="utf-8"><body style="margin:0;padding:14px;font:13px/1.3 sans-serif;color:#222;background:#fff;width:760px">'
         f'<div style="display:flex;align-items:center;gap:10px;margin-bottom:8px"><img src="file://{R}/{m}.svg" width="64" height="64">'
         f'<div style="font-size:17px;font-weight:700">{m} — {NOMES.get(m, "")} <span style="font-weight:400;color:#777">(ícone do módulo, para comparar)</span></div></div>')
    for i, nome in itens:
        f = os.path.join(R, 'sub', i + '.svg')
        h += (f'<div style="display:flex;align-items:center;gap:8px;border:1px solid #e3e3e0;border-radius:10px;padding:5px;margin:5px 0">'
              f'<div style="width:190px"><b>{i}</b><br>{nome}</div>' + cel(f, '#ffffff', 64) + cel(f, '#ffffff', 128) + cel(f, '#F1F1EE', 64) + cel(f, '#F1F1EE', 128) + '</div>')
    open(os.path.join(OUT, m + '.html'), 'w').write(h + '</body>')
print(sorted(mods))

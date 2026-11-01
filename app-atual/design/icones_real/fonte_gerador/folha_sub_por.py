# folha de contato dos icones de CONTEUDO, uma por modulo: icone do modulo no topo (referencia de estilo) e cada conteudo
# a 64 px e 128 px, sobre branco e sobre #F1F1EE, com o nome ao lado.  uso: python3 folha_sub.py <m> (bio|qui|mat|por)
import os, sys, json, glob
sys.path.insert(0, '/home/claude/escadas-sc')
import dados_util as u
from nomes import NOMES
m = sys.argv[1]
D = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
SUB = os.path.join(D, 'sub'); OUT = os.path.join(SUB, 'folhas'); os.makedirs(OUT, exist_ok=True)
nomes = u.le(m)['nomesub']
mods = sorted({k.split('.')[0] for k in nomes})
for mod in mods:
    ids = sorted((k for k in nomes if k.split('.')[0] == mod), key=lambda k: int(k.split('.')[1]))
    cel = lambda f, bg, s: (f'<div style="background:{bg};width:{s+16}px;height:144px;display:flex;align-items:center;justify-content:center;border-radius:8px">'
                            f'<img src="file://{f}" width="{s}" height="{s}"></div>')
    linha = lambda f, rot: (f'<div style="display:flex;align-items:center;gap:8px;border:1px solid #e3e3e0;border-radius:10px;padding:4px;margin:0 0 6px">'
                            f'<div style="width:300px">{rot}</div>' + cel(f, '#ffffff', 64) + cel(f, '#ffffff', 128) + cel(f, '#F1F1EE', 64) + cel(f, '#F1F1EE', 128) + '</div>')
    h = ('<!doctype html><meta charset="utf-8"><body style="margin:0;padding:16px;font:14px/1.35 Inter,system-ui,sans-serif;color:#222;background:#fff;width:1000px">'
         f'<div style="font-size:18px;font-weight:700;margin:0 0 10px">{mod} {NOMES.get(mod, "")} — ícones dos conteúdos (64 e 128 px; branco e #F1F1EE)</div>')
    h += linha(os.path.join(D, mod + '.svg'), f'<span style="color:#888">MÓDULO {mod}</span><br><b>{NOMES.get(mod, "")}</b>')
    for k in ids:
        f = os.path.join(SUB, k + '.svg')
        kb = os.path.getsize(f) / 1024 if os.path.exists(f) else 0
        h += linha(f, f'<b>{k}</b> <span style="color:#999">{kb:.1f} KB</span><br>{nomes[k]}')
    open(os.path.join(OUT, f'{m}_{mod}.html'), 'w').write(h + '</body>')
print('ok', len(mods))

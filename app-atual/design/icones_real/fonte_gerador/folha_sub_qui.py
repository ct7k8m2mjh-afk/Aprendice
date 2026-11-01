# folhas de contato dos icones dos CONTEUDOS de Quimica, uma por modulo: icone do modulo (referencia) + cada conteudo
# a 64 e 128 px, em fundo branco e #F1F1EE, com o nome ao lado.  uso: python3 folha_sub_qui.py && node folha_sub.js
import os, sys, json, subprocess
from nomes import NOMES
D = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
nomes = json.loads(subprocess.check_output(['python3', '-I', '-c', "import sys,json;sys.path.insert(0,'/home/claude/escadas-sc');import dados_util as u;print(json.dumps(u.le('qui')['nomesub']))"]))
OUT = os.path.join(D, 'folhas', 'sub_qui'); os.makedirs(OUT, exist_ok=True)
mods = sorted(set(k.split('.')[0] for k in nomes))
for m in mods:
    ids = sorted((k for k in nomes if k.split('.')[0] == m), key=lambda k: int(k.split('.')[1]))
    cel = lambda f, bg, s: f'<div style="background:{bg};width:{s+16}px;height:144px;display:flex;align-items:center;justify-content:center;border-radius:8px"><img src="file://{f}" width="{s}" height="{s}"></div>'
    def linha(f, rot, nome, destaque=False):
        b = '#bbb' if destaque else '#e3e3e0'
        return (f'<div style="display:flex;align-items:center;gap:8px;border:1px solid {b};border-radius:10px;padding:4px;margin-bottom:6px">'
                f'<div style="width:300px"><b>{rot}</b><br>{nome}</div>' + cel(f, '#ffffff', 64) + cel(f, '#ffffff', 128) + cel(f, '#F1F1EE', 64) + cel(f, '#F1F1EE', 128) + '</div>')
    h = ('<!doctype html><meta charset="utf-8"><body style="margin:0;padding:16px;font:14px/1.35 Inter,system-ui,sans-serif;color:#222;background:#fff;width:1000px">'
         f'<div style="font-size:18px;font-weight:700;margin:0 0 10px">Química {m} — {NOMES[m]}: ícones dos conteúdos (64 e 128 px; branco e #F1F1EE)</div>')
    h += linha(os.path.join(D, m + '.svg'), m + ' (módulo, referência)', NOMES[m], True)
    for k in ids: h += linha(os.path.join(D, 'sub', k + '.svg'), k, nomes[k])
    open(os.path.join(OUT, m + '.html'), 'w').write(h + '</body>')
print(OUT)

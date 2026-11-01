# folha de contato por materia: nome do modulo + icone a 64 px e 128 px, sobre branco e sobre #F5F5F3
import os, sys
from nomes import NOMES
D = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
MAT = {'bio': ('B', 'Biologia'), 'qui': ('Q', 'Química'), 'mat': ('M', 'Matemática'), 'por': ('P', 'Português')}
for k, (pref, titulo) in MAT.items():
    ids = sorted(i for i in NOMES if i.startswith(pref))
    h = ('<!doctype html><meta charset="utf-8"><body style="margin:0;padding:16px;font:13px/1.3 Inter,system-ui,sans-serif;color:#222;background:#fff;width:1000px">'
         f'<div style="font-size:18px;font-weight:700;margin:0 0 10px">{titulo} — ícones realistas dos módulos (64 px e 128 px; fundo branco e #F5F5F3)</div>'
         '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">')
    for i in ids:
        f = 'file://' + os.path.join(D, i + '.svg')
        cel = lambda bg, s: f'<div style="background:{bg};width:{s+16}px;height:144px;display:flex;align-items:center;justify-content:center;border-radius:8px"><img src="{f}" width="{s}" height="{s}"></div>'
        h += (f'<div style="display:flex;align-items:center;gap:6px;border:1px solid #e3e3e0;border-radius:10px;padding:4px">'
              f'<div style="width:118px"><b>{i}</b><br>{NOMES[i]}</div>' + cel('#ffffff', 64) + cel('#ffffff', 128) + cel('#F5F5F3', 64) + cel('#F5F5F3', 128) + '</div>')
    h += '</div></body>'
    open(os.path.join(D, 'folhas', f'folha_{k}.html'), 'w').write(h)

# -*- coding: utf-8 -*-
"""Ler/gravar o banco embutido no index.html de uma materia, mantendo dados.json em sincronia."""
import json

def le(sub):
    h = open(f'/home/claude/escadas-sc/{sub}/index.html', encoding='utf-8').read()
    a = h.find('<script id="dados"'); a = h.find('>', a) + 1; b = h.find('</script>', a)
    return json.loads(h[a:b])

def grava(sub, D):
    p = f'/home/claude/escadas-sc/{sub}/index.html'
    h = open(p, encoding='utf-8').read()
    a = h.find('<script id="dados"'); a = h.find('>', a) + 1; b = h.find('</script>', a)
    novo = json.dumps(D, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/')
    open(p, 'w', encoding='utf-8').write(h[:a] + novo + h[b:])
    json.dump(D, open(f'/home/claude/escadas-sc/{sub}/dados.json', 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))

def encaixa(banco, qid):
    """Poe a questao solta qid na escada do seu conteudo, pela dificuldade (depois das de dif <= a dela)."""
    q = next(x for x in banco if x['id'] == qid)
    L = sorted([x for x in banco if x['sub'] == q['sub'] and x.get('degrau') and x['id'] != qid], key=lambda x: x['degrau'])
    pos = sum(1 for x in L if (x.get('dif') or 0) <= (q.get('dif') or 0))
    L.insert(pos, q)
    for k, x in enumerate(L, 1): x['degrau'] = k
    return pos + 1, len(L)

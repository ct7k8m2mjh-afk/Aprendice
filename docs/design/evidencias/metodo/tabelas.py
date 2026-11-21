import json, glob, collections, re, os, sys
S = os.path.dirname(os.path.abspath(__file__))
D = []
for f in sorted(glob.glob(S + '/out/*.jsonl')):
    for l in open(f):
        d = json.loads(l)
        if d.get('tela') == '_erros' or 'erro' in d: continue
        D.append(d)
TXT = ['z', 'sel', 'fam', 'fs', 'fw', 'lh', 'ls', 'tt', 'cor', 'bg', 'img', 'cr', 'G', 'tab', 'ta', 'fst']
LOGIN = ('login', 'login-erro')
def txt(w, tema='claro', login=False):
    for d in D:
        if d['w'] != w or d['tema'] != tema: continue
        if (d['tela'] in LOGIN) != login: continue
        for k, n, ex in d['txt']:
            r = dict(zip(TXT, k.split('|'))); r['n'] = n; r['tela'] = d['tela']
            if r['z'] == 'casca' and d['tela'] != 'inicio': continue
            yield r
def simples(w, campo, tema='claro'):
    for d in D:
        if d['w'] != w or d['tema'] != tema or d['tela'] in LOGIN: continue
        for k, n, ex in d[campo]:
            z, v = k.split('|', 1)
            if z == 'casca' and d['tela'] != 'inicio': continue
            yield v, n, ex[0], d['tela']
def junta(gen, chave):
    c = collections.Counter(); t = collections.defaultdict(set); e = {}
    for r in gen:
        k = chave(r)
        if k is None: continue
        c[k] += r['n']; t[k].add(r['tela']); e.setdefault(k, r['sel'] + ' @' + r['tela'])
    return c, t, e
def junta_s(gen):
    c = collections.Counter(); t = collections.defaultdict(set); e = {}
    for v, n, ex, tela in gen:
        c[v] += n; t[v].add(tela); e.setdefault(v, ex + ' @' + tela)
    return c, t, e
fnum = lambda k: float(re.sub(r'[^0-9.\-]', '', str(k).split(' ')[0]) or 0)
out = []
def duas(titulo, a, b, ordem, rot=('390 px', '1280 px'), minimo=0, unidade=''):
    ca, ta, ea = a; cb, tb, eb = b
    ks = sorted(set(ca) | set(cb), key=ordem)
    out.append(f'\n**{titulo}** — {len(set(ca))} valores distintos a {rot[0]}, {len(set(cb))} a {rot[1]}\n')
    out.append(f'| Valor | Elementos a {rot[0]} (telas) | Elementos a {rot[1]} (telas) | Exemplo (seletor @tela) |'); out.append('|---|---|---|---|')
    resto = 0
    for k in ks:
        if ca[k] + cb[k] < minimo: resto += 1; continue
        out.append(f'| {k}{unidade} | {ca[k] or "—"}{" (" + str(len(ta[k])) + ")" if ca[k] else ""} | {cb[k] or "—"}{" (" + str(len(tb[k])) + ")" if cb[k] else ""} | `{(eb.get(k) or ea.get(k))}` |')
    if resto: out.append(f'| (outros {resto} valores com menos de {minimo} usos somados) | | | |')
fam = lambda r: r['fam']
# famílias
c, t, e = junta(list(txt(1280)) + list(txt(1280, login=True)), fam)
out.append('\n**Famílias de fonte** (1280 px, claro)\n'); out.append('| Família | Elementos | Telas | Onde |'); out.append('|---|---|---|---|')
for k in sorted(c, key=lambda k: -c[k]): out.append(f'| {k} | {c[k]} | {len(t[k])} | `{e[k]}` |')
duas('font-size (interface, sem a tela de login)', junta(txt(390), lambda r: r['fs'] + 'px'), junta(txt(1280), lambda r: r['fs'] + 'px'), fnum)
duas('font-weight', junta(txt(390), lambda r: r['fw']), junta(txt(1280), lambda r: r['fw']), fnum)
duas('line-height (razão sobre o font-size)', junta(txt(390), lambda r: r['lh']), junta(txt(1280), lambda r: r['lh']), lambda k: 99 if k == 'normal' else float(k))
duas('letter-spacing (em em)', junta(txt(390), lambda r: r['ls']), junta(txt(1280), lambda r: r['ls']), lambda k: fnum(k))
for campo, nome in [('pad', 'padding'), ('mar', 'margin'), ('gap', 'gap de flex/grade')]:
    duas(nome + ' (cada lado conta uma vez)', junta_s(simples(390, campo)), junta_s(simples(1280, campo)), fnum, minimo=20 if campo != 'gap' else 0)
duas('border-radius', junta_s(simples(390, 'rad')), junta_s(simples(1280, 'rad')), fnum)
duas('espessura de borda', junta_s(simples(390, 'bw')), junta_s(simples(1280, 'bw')), fnum)
# sombras: agrupa anéis de matéria
def norm(v):
    v2 = re.sub(r'color\(srgb [^)]*/ ([0-9.]+)\)', r'<cor da matéria a \1>', v)
    v2 = re.sub(r'rgb\((?!229, 229, 224|37, 39, 45|23, 24, 28|237, 238, 241)[0-9, ]+\)', '<cor da matéria>', v2)
    return v2
for tema in ['claro', 'escuro']:
    c, t, e = junta_s((norm(v), n, ex, tela) for v, n, ex, tela in simples(1280, 'sh', tema))
    out.append(f'\n**box-shadow** (1280 px, {tema}) — {len(c)} valores distintos (anéis na cor da matéria agrupados)\n'); out.append('| Sombra | Elementos | Telas | Exemplo |'); out.append('|---|---|---|---|')
    for k in sorted(c, key=lambda k: -c[k]): out.append(f'| `{k}` | {c[k]} | {len(t[k])} | `{e[k]}` |')
open(S + '/tabelas.md', 'w').write('\n'.join(out) + '\n')
print(len(out), 'linhas')

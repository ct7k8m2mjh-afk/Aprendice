#!/usr/bin/env python3
"""Agrega o inventário do crawl (out/*.jsonl) em tabelas. Uso: python3 agrega.py [secao ...]"""
import json, glob, sys, collections, os, re
S = os.path.dirname(os.path.abspath(__file__))
SEC = set(sys.argv[1:])
D = []  # registros por (w, tema, tela)
for f in sorted(glob.glob(S + '/out/*.jsonl')):
    for l in open(f):
        d = json.loads(l)
        if d.get('tela') == '_erros':
            if 'erros' in SEC or not SEC: print('ERROS', os.path.basename(f), d['erros'][:6])
            continue
        if 'erro' in d: print('FALHA', f, d['tela'], d['erro']); continue
        D.append(d)
TXT = ['z', 'sel', 'fam', 'fs', 'fw', 'lh', 'ls', 'tt', 'cor', 'bg', 'img', 'cr', 'G', 'tab', 'ta', 'fst']
CTL = ['z', 'sel', 'tipo', 'w', 'h', 'pad', 'rad', 'bw', 'sombra', 'fs', 'fw', 'dis', 'disp', 'bg']
def linhas(d, campo, nomes):
    for k, n, ex in d.get(campo, []):
        p = k.split('|'); r = dict(zip(nomes, p)); r['n'] = n; r['ex'] = ex
        # casca só conta na tela "inicio" (senão repete em toda tela)
        if r['z'] == 'casca' and d['tela'] not in ('inicio', 'menu-outras', 'busca-resultados', 'busca-vazia'): continue
        yield r
def simples(d, campo):
    for k, n, ex in d.get(campo, []):
        z, v = k.split('|', 1)
        if z == 'casca' and d['tela'] != 'inicio': continue
        yield v, n, ex
def tabela(titulo, cont, telas, exs, top=60, ordem=None):
    print('\n== ' + titulo + f' ({len(cont)} valores distintos)')
    chaves = sorted(cont, key=ordem) if ordem else sorted(cont, key=lambda k: -cont[k])
    for k in chaves[:top]:
        print(f'{k}\t{cont[k]}\t{len(telas[k])} telas\t' + '; '.join(list(exs[k])[:3]))
def conta(filtro, chave, campo='txt', nomes=TXT):
    cont = collections.Counter(); telas = collections.defaultdict(set); exs = collections.defaultdict(dict)
    for d in D:
        if not filtro(d): continue
        for r in linhas(d, campo, nomes):
            k = chave(r)
            if k is None: continue
            cont[k] += r['n']; telas[k].add(d['tela'])
            if len(exs[k]) < 4: exs[k][r['sel'] + ' @' + d['tela']] = 1
    return cont, telas, exs
def conta_s(filtro, campo):
    cont = collections.Counter(); telas = collections.defaultdict(set); exs = collections.defaultdict(dict)
    for d in D:
        if not filtro(d): continue
        for v, n, ex in simples(d, campo):
            cont[v] += n; telas[v].add(d['tela'])
            for e in ex:
                if len(exs[v]) < 4: exs[v][e + ' @' + d['tela']] = 1
    return cont, telas, exs
claro = lambda d: d['tema'] == 'claro'
def w(*ws): return lambda d: d['tema'] == 'claro' and d['w'] in ws
fnum = lambda k: float(re.sub(r'[^0-9.\-]', '', str(k).split(' ')[0]) or 0)

def on(s): return not SEC or s in SEC
if on('telas'):
    print('telas por config:', collections.Counter((d['w'], d['tema']) for d in D))
if on('fam'):
    tabela('FAMÍLIAS (claro, 4 larguras)', *conta(claro, lambda r: r['fam']))
    for fam in ['Caveat', 'Dancing Script', 'Literata', 'DM Sans']:
        c, t, e = conta(claro, lambda r: r['sel'] if r['fam'] == fam else None)
        print(f'-- {fam}:', '; '.join(f'{k} ({c[k]}, {sorted(t[k])[:4]})' for k in sorted(c, key=lambda k: -c[k])[:25]))
    c, t, e = conta(claro, lambda r: r['fam'] + ' :: ' + r['sel'] if r['fam'] not in ('Familjen Grotesk', 'Caveat', 'Dancing Script', 'Literata', 'DM Sans') else None)
    print('-- fora das cinco:', dict(c), {k: sorted(t[k])[:3] for k in c})
if on('fs'):
    for nome, ws in [('390', (390,)), ('768', (768,)), ('1280', (1280,)), ('1440', (1440,))]:
        tabela(f'FONT-SIZE @{nome} claro', *conta(w(*ws), lambda r: r['fs'] + 'px'), top=80, ordem=fnum)
if on('fw'):
    tabela('PESOS (claro)', *conta(claro, lambda r: r['fw']))
    tabela('FAMÍLIA+PESO', *conta(claro, lambda r: r['fam'] + ' ' + r['fw']))
if on('lh'):
    tabela('LINE-HEIGHT (razão; claro)', *conta(claro, lambda r: r['lh']), top=70, ordem=lambda k: 99 if k == 'normal' else float(k))
if on('ls'):
    tabela('LETTER-SPACING (em; claro)', *conta(claro, lambda r: r['ls']), top=50)
    tabela('CAIXA ALTA', *conta(claro, lambda r: r['sel'] + ' ' + r['fs'] + 'px ls ' + r['ls'] if r['tt'] == 'uppercase' else None), top=40)
if on('esp'):
    for campo in ['pad', 'mar', 'gap']:
        tabela(campo.upper() + ' @1280 claro', *conta_s(w(1280), campo), top=90, ordem=fnum)
        tabela(campo.upper() + ' @390 claro', *conta_s(w(390), campo), top=90, ordem=fnum)
if on('rad'):
    tabela('RAIOS (claro, 4 larguras)', *conta_s(claro, 'rad'), top=70, ordem=fnum)
    tabela('BORDAS (claro)', *conta_s(claro, 'bw'), top=20, ordem=fnum)
if on('sh'):
    tabela('SOMBRAS claro', *conta_s(claro, 'sh'), top=60)
    tabela('SOMBRAS escuro', *conta_s(lambda d: d['tema'] == 'escuro', 'sh'), top=60)
if on('ctl'):
    # altura dos controles por seletor
    for nome, ws in [('1280', (1280,)), ('390', (390,))]:
        c, t, e = conta(w(*ws), lambda r: (r['sel'], r['h'], r['rad'], r['bw'], r['fs'], r['fw'], r['sombra']), 'ctl', CTL)
        por = collections.defaultdict(list)
        for k in c: por[k[0]].append((k[1:], c[k], sorted(t[k])[:2]))
        print(f'\n== CONTROLES @{nome} claro: seletor -> (altura, raio, borda, fs, peso, sombra) x n')
        for s in sorted(por, key=lambda s: -sum(x[1] for x in por[s]))[:110]:
            print(s, ' | '.join(f'h{a[0]} r{a[1]} b{a[2]} {a[3]}px/{a[4]}{" S" if a[5] else ""} x{n} {tl}' for a, n, tl in sorted(por[s], key=lambda x: -x[1])[:5]))
if on('toque'):
    for ws in [(390,), (768,)]:
        c, t, e = conta(w(*ws), lambda r: (r['sel'], r['tipo'], r['w'], r['h'], r['disp']) if (int(r['w']) < 44 or int(r['h']) < 44) and r['disp'] != 'inline' else None, 'ctl', CTL)
        print(f'\n== ALVOS < 44px @{ws[0]} ({len(c)} combinações, {sum(c.values())} ocorrências)')
        por = collections.defaultdict(lambda: [0, set(), set()])
        for k in c: por[k[0]][0] += c[k]; por[k[0]][1].add(f'{k[2]}x{k[3]}'); por[k[0]][2] |= t[k]
        for s in sorted(por, key=lambda s: -por[s][0])[:90]: print(s, por[s][0], sorted(por[s][1])[:5], sorted(por[s][2])[:3])
        c, t, e = conta(w(*ws), lambda r: (r['sel'], r['w'], r['h']) if (int(r['h']) < 24) and r['disp'] == 'inline' else None, 'ctl', CTL)
        print('-- links em linha < 24px de altura:', [(k, c[k]) for k in list(c)[:20]])
if on('cr'):
    for tema in ['claro', 'escuro']:
        f = lambda d: d['tema'] == tema
        def ch(r):
            if r['cr'] in ('None', ''): return None
            cr = float(r['cr']); lim = 3 if r['G'] else 4.5
            if cr >= lim: return None
            return (r['sel'], r['cor'], r['bg'], r['cr'], r['fs'] + 'px/' + r['fw'], 'grande' if r['G'] else 'normal', r['img'])
        c, t, e = conta(f, ch)
        print(f'\n== CONTRASTE abaixo de AA — {tema} ({len(c)} combinações)')
        for k in sorted(c, key=lambda k: (float(k[3]))):
            if k[6]: continue
            print('\t'.join(map(str, k[:6])), c[k], sorted(t[k])[:3], list(e[k])[:1])
        print('-- sobre gradiente/imagem (não medido com segurança):')
        for k in sorted(c, key=lambda k: (float(k[3])))[:400]:
            if k[6]: print('\t'.join(map(str, k[:6])), c[k], sorted(t[k])[:2])
if on('over'):
    print('\n== ROLAGEM LATERAL (scrollWidth > largura)')
    for d in D:
        if d['sw'] > d['vw'] + 1: print(d['w'], d['tema'], d['tela'], d['sw'], 'vs', d['vw'], d['fora'][:4])
    print('\n== ELEMENTOS FORA DA TELA')
    v = collections.defaultdict(set)
    for d in D:
        for x in d['fora']: v[(d['w'], re.sub(r' \[.*', '', x))].add(d['tela'] + ' ' + re.sub(r'.* \[', '[', x))
    for k in sorted(v): print(k, sorted(v[k])[:4])
    print('\n== TEXTO CORTADO (reticências / clamp)')
    v = collections.defaultdict(set)
    for d in D:
        for x in d['elip']: v[(d['w'], x.split(' «')[0])].add(d['tela'] + ' «' + x.split(' «')[1])
    for k in sorted(v): print(k, len(v[k]), sorted(v[k])[:3])
if on('frac'):
    print('\n== BARRA / ÷ ENTRE NÚMEROS NA LINHA')
    v = collections.defaultdict(set)
    for d in D:
        for x in d['frac']: v[x].add(d['tela'])
    for k in sorted(v): print(k, sorted(v[k])[:3])
    print('\n== EMOJI'); v = collections.defaultdict(set)
    for d in D:
        for x in d['emoji']: v[x].add(d['tela'])
    for k in sorted(v): print(k, sorted(v[k])[:3])
    print('\n== SEM NOME ACESSÍVEL'); v = collections.defaultdict(set)
    for d in D:
        for x in d['semNome']: v[x].add(d['tela'])
    for k in sorted(v): print(k, sorted(v[k])[:5])
if on('medida'):
    for ww in (390, 1280, 1440):
        print(f'\n== MEDIDA DE LINHA @{ww} (caracteres por linha, texto de 3+ linhas)')
        v = collections.defaultdict(list)
        for d in D:
            if d['w'] != ww or d['tema'] != 'claro': continue
            for x in d['medida']: v[(x['s'], x['fs'], x['fam'])].append((x['cpl'], x['larg'], d['tela']))
        for k in sorted(v, key=lambda k: -max(x[0] for x in v[k])):
            cp = [x[0] for x in v[k]]; print(k, 'n', len(cp), 'min', min(cp), 'max', max(cp), 'larg', max(x[1] for x in v[k]), sorted(set(x[2] for x in v[k]))[:3])
if on('corpo'):
    print('\n== TEXTO < 16px @390 (claro): seletor, fs, n, telas')
    c, t, e = conta(w(390), lambda r: (r['fs'], r['sel']) if float(r['fs']) < 16 and r['z'] == 'tela' else None)
    por = collections.Counter()
    for k in c: por[k[0]] += c[k]
    print(sorted(por.items(), key=lambda x: float(x[0])))
    for k in sorted(c, key=lambda k: (float(k[0]), -c[k]))[:140]: print(k[0], k[1], c[k], sorted(t[k])[:2])
if on('h1'):
    print('\n== TÍTULOS'); v = {}
    for d in D:
        if d['w'] == 1280 and d['tema'] == 'claro': print(d['tela'], 'h1:', len(d['h1']), 'níveis:', d['niveis'][:40])
if on('mat'):
    # coerência entre matérias: mesma tela, 9 matérias; compara estilo sem cor por seletor
    for base in ['materia-', 'tema-', 'questao-', 'correcao-', 'correcao-aberta-']:
        for ww in (390, 1280):
            por = collections.defaultdict(lambda: collections.defaultdict(set))
            for d in D:
                if d['w'] != ww or d['tema'] != 'claro' or not d['tela'].startswith(base): continue
                m = d['tela'][len(base):]
                if m not in ('bio', 'qui', 'mat', 'por', 'fis', 'geo', 'his', 'ing', 'fs'): continue
                for r in linhas(d, 'txt', TXT):
                    if r['z'] == 'casca': continue
                    por[r['sel']][m].add((r['fam'], r['fs'], r['fw'], r['lh'], r['ls'], r['tt']))
            print(f'\n== COERÊNCIA ENTRE MATÉRIAS {base}* @{ww}')
            for s in sorted(por):
                ms = por[s]
                if len(ms) < 2: continue
                conj = collections.defaultdict(list)
                for m, v in ms.items(): conj[frozenset(v)].append(m)
                if len(conj) > 1:
                    print(s, ' || '.join(f'{sorted(ms_)}: {sorted(v)[:2]}' for v, ms_ in conj.items())[:420])
if on('temadif'):
    # geometria claro x escuro deve ser igual
    print('\n== DIFERENÇA DE MEDIDA ENTRE CLARO E ESCURO (font-size/peso por seletor)')
    a = collections.defaultdict(set); b = collections.defaultdict(set)
    for d in D:
        for r in linhas(d, 'txt', TXT):
            (a if d['tema'] == 'claro' else b)[(d['w'], d['tela'], r['sel'])].add((r['fam'], r['fs'], r['fw'], r['lh']))
    n = 0
    for k in a:
        if k in b and a[k] != b[k]:
            n += 1
            if n < 25: print(k, sorted(a[k])[:2], sorted(b[k])[:2])
    print('total', n)
if 'fsel' in SEC:
    for ww in (1280, 390):
        c, t, e = conta(w(ww), lambda r: (r['fs'], r['sel'], r['fw']) if r['fam'] == 'Familjen Grotesk' else None)
        por = collections.defaultdict(list)
        for k in c: por[k[0]].append((c[k], k[1] + '/' + k[2], len(t[k])))
        print(f'\n== FAMILJEN: seletores por tamanho @{ww}')
        for f in sorted(por, key=float):
            l = sorted(por[f], reverse=True)
            print(f + 'px', sum(x[0] for x in l), '::', '; '.join(f'{s} x{n}({tl}t)' for n, s, tl in l[:14]))

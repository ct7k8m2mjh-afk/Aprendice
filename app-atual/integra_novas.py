# -*- coding: utf-8 -*-
"""Integra as resolucoes novas revisadas (novas/saida/*.json) ao app unico:
- pacote publicado (pub/<s>/res/<sub>.json): entrada com a resolucao + print em webp (mesmos parametros do monta_tudo)
- banco do app (index.html embutido + dados.json): registro da questao, encaixado na escada pela dificuldade
- fonte (sc/v4<s>/saida_res/res_prio_<s>_novas.json): as resolucoes, para rebuild futuro
Uso: python3 -I integra_novas.py"""
import json, glob, os, io, sys, base64
sys.path.insert(0, '/home/claude/escadas-sc')
import dados_util as u
from PIL import Image

def webp_b64(origem, larg=900, q=76, teto=70_000):
    base = Image.open(origem).convert('RGB')
    def tenta(l, qq):
        im = base
        if im.width > l: im = im.resize((l, max(1, int(im.height * l / im.width))), Image.LANCZOS)
        buf = io.BytesIO(); im.save(buf, 'WEBP', quality=qq, method=5); return buf.getvalue()
    d = tenta(larg, q)
    for l, qq in ((820, 70), (760, 64), (700, 58)):
        if len(d) <= teto: break
        d = tenta(l, qq)
    return 'data:image/webp;base64,' + base64.b64encode(d).decode()

CAMPOS_RES = ['antes', 'pista', 'passos', 'resposta', 'checagem', 'erradas', 'armadilha', 'alerta', 'essencial']
CAMPOS_Q = ('id','escola','ano','n','banca','enun','alts','gab','modulo','sub','dif','conceito','tempo','url',
            'figura','tipo','fase','fonte','degrau','pista','nota_fonte')
for s, raiz in (('qui', '/home/claude/sc/v4qui'), ('por', '/home/claude/sc/v4por')):
    lotes = {}
    for f in sorted(glob.glob(f'/home/claude/novas/lotes/{s}_*.json')):
        for q in json.load(open(f)): lotes[q['id']] = q
    res = {}
    for f in sorted(glob.glob(f'/home/claude/novas/saida/{s}_*.json')):
        if f.endswith('.bak_rev'): continue
        for r in json.load(open(f)): res[r['id']] = r
    assert set(res) == set(lotes), (s, set(lotes) - set(res))
    bp = {q['id']: q for q in json.load(open(f'{raiz}/banco_provas.json'))}
    D = u.le(s); B = D['banco']; ja = {q['id'] for q in B}
    novos = 0
    for i, r in res.items():
        L = lotes[i]; base = dict(bp.get(i) or {}); base.update({k: v for k, v in L.items() if not base.get(k)})
        if r.get('enun_print'): base['enun'] = r['enun_print']
        if r.get('alts_print') and len(r['alts_print']) == 5: base['alts'] = r['alts_print']
        if r.get('pista'): base['pista'] = r['pista']
        base.setdefault('modulo', base['sub'].split('.')[0]); base.setdefault('tipo', 'prova')
        reg = {k: base.get(k) for k in CAMPOS_Q if base.get(k) is not None}
        reg['degrau'] = 0
        if i in ja: continue
        B.append(reg); novos += 1
        if (L.get('degrau') or 0) > 0: u.encaixa(B, i)
        # pacote publicado
        pk = f'/home/claude/pub/{s}/res/{base["sub"]}.json'
        P = json.load(open(pk)) if os.path.exists(pk) else {}
        ent = {'id': i}; ent.update({k: r[k] for k in CAMPOS_RES if k in r})
        ent['img'] = webp_b64(L['crop'])
        P[i] = ent
        json.dump(P, open(pk, 'w'), ensure_ascii=False, separators=(',', ':'))
    u.grava(s, D)
    fonte = f'{raiz}/saida_res/res_prio_{s}_novas.json'
    json.dump(list(res.values()), open(fonte, 'w'), ensure_ascii=False, indent=1)
    print(f'{s}: +{novos} questoes no app (total {len(B)}) | fonte: {fonte}')

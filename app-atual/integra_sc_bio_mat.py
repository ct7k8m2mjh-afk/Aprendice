# -*- coding: utf-8 -*-
"""01/11: integra as questoes Sao Camilo de Bio e Mat (Estrategia + Prof. Sonia), ja revisadas em 2 lentes.
Entrada: scratchpad/saocamilo_novas/{bio,mat}_final.json, res_{bio,mat}.json, prints <s>/prints/<id>.png
Saida: banco (index.html + dados.json via dados_util), escada pela dificuldade (encaixa), <s>/res/<sub>.json com print webp.
Uso: python3 -I integra_sc_bio_mat.py [--seco]"""
import json, os, sys, shutil, time
sys.path.insert(0, '/home/claude/escadas-sc')
import dados_util as u
import io, base64
from PIL import Image
# copiado de integra_novas.py (importar aquele arquivo executaria a integracao de qui/por)
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

SC = '/tmp/claude-0/-home-claude/e5566652-8789-513e-9e19-aca7ab2e3491/scratchpad/saocamilo_novas'
SECO = '--seco' in sys.argv
for s in ('bio', 'mat'):
    novas = json.load(open(f'{SC}/{s}_final.json'))
    res = json.load(open(f'{SC}/res_{s}.json'))
    if not novas: print(s, 'nada'); continue
    D = u.le(s); B = D['banco']; ja = {q['id'] for q in B}
    if not SECO:
        bak = f'/home/claude/escadas-sc/{s}/dados.json.bak_sc0111'
        if not os.path.exists(bak): shutil.copy(f'/home/claude/escadas-sc/{s}/dados.json', bak)
    add = []
    for q in novas:
        i = q['id']
        if i in ja: print('  ja existe', i); continue
        assert i in res, ('sem resolucao', i)
        reg = {k: q.get(k) for k in CAMPOS_Q if q.get(k) is not None}
        deg = reg.get('degrau') or 0
        reg['degrau'] = 0
        B.append(reg); add.append(i)
        if deg: u.encaixa(B, i)
        pk = f'/home/claude/escadas-sc/{s}/res/{reg["sub"]}.json'
        P = json.load(open(pk)) if os.path.exists(pk) else {}
        ent = {'id': i}; ent.update({k: res[i][k] for k in CAMPOS_RES if k in res[i]})
        ent['img'] = webp_b64(f'{SC}/{s}/prints/{i}.png')
        P[i] = ent
        if not SECO:
            if os.path.exists(pk) and not os.path.exists(pk + '.bak_sc0111'): shutil.copy(pk, pk + '.bak_sc0111')
            json.dump(P, open(pk, 'w'), ensure_ascii=False, separators=(',', ':'))
    if not SECO: u.grava(s, D)
    print(f'{s}: +{len(add)} ({", ".join(add)}) total {len(B)}', '(seco)' if SECO else '')

# -*- coding: utf-8 -*-
"""01/11: troca os flashcards de texto e as frases de completar das 4 materias pelos baralhos novos
(discursivas curtas), ja revisados em 2 lentes (fatos + utilidade). Mantem os cartoes com imagem.
Backup: <m>/dados.json.bak_cartoes0111. Uso: python3 -I integra_cartoes.py [--seco]"""
import json, os, sys, shutil
sys.path.insert(0, '/home/claude/escadas-sc')
import dados_util as u

C = '/tmp/claude-0/-home-claude/e5566652-8789-513e-9e19-aca7ab2e3491/scratchpad/cartoes_novos'
SECO = '--seco' in sys.argv
CAMPOS_F = ('id', 'mod', 'sub', 'tipo', 'frente', 'verso', 'essencial', 'aceita', 'erro_comum', 'peso', 'exemplo', 'fonte')
CAMPOS_K = ('id', 'mod', 'sub', 'frase', 'resp', 'aceita', 'fonte')
for m in ('bio', 'qui', 'mat', 'por'):
    F = json.load(open(f'{C}/{m}_flash.json')); K = json.load(open(f'{C}/{m}_completar.json'))
    D = u.le(m)
    subs = set(D.get('nomesub', {})); mods = set(D.get('teoria', {}))
    for c in F + K:
        assert c['mod'] in mods and c['sub'] in subs, (m, c['id'], c['mod'], c['sub'])
        assert c.get('fonte'), (m, c['id'], 'sem fonte')
    for k in K: assert k['frase'].count('___') == 1, k['id']
    novo_f = [{k: c[k] for k in CAMPOS_F if c.get(k) not in (None, '', [])} for c in F]
    novo_k = [{k: c[k] for k in CAMPOS_K if c.get(k) not in (None, '', [])} for c in K]
    ids = [c['id'] for c in novo_f + novo_k]; assert len(ids) == len(set(ids)), m
    if not SECO:
        bak = f'/home/claude/escadas-sc/{m}/dados.json.bak_cartoes0111'
        if not os.path.exists(bak): shutil.copy(f'/home/claude/escadas-sc/{m}/dados.json', bak)
        D['flash'] = novo_f
        FI = json.load(open(f'{C}/flash_img_novo.json'))
        if m in FI: D['flash_img'] = FI[m]
        D.setdefault('essencial', {})['completar'] = novo_k
        u.grava(m, D)
    print(f'{m}: {len(novo_f)} cartoes + {len(novo_k)} frases (com imagem mantidos: {len(D.get("flash_img") or [])})', '(seco)' if SECO else '')

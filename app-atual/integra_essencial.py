# -*- coding: utf-8 -*-
"""Treino geral (30/10): junta ESSENCIAL_<m>.json (revisado) em D['essencial'] de cada materia, validando tudo."""
import json, sys, shutil
import dados_util as du

for m in sys.argv[1:] or ['bio', 'qui', 'mat', 'por']:
    E = json.load(open(f'ESSENCIAL_{m}.json', encoding='utf-8'))
    D = du.le(m)
    por = {q['id']: q for q in D['banco']}
    abc = E['abc']
    assert len(abc) == 40 and len(set(abc)) == 40, m
    for i in abc:
        q = por[i]; assert q.get('gab') and q.get('degrau'), (m, i)
    cz = E['completar']; ids = [c['id'] for c in cz]
    assert len(cz) == 40 and len(set(ids)) == 40, m
    for c in cz:
        assert c['frase'].count('___') == 1 and c['resp'].strip(), (m, c['id'])
        assert c['mod'] in D['teoria'] and any(k['sub'] == c['sub'] for k in D['teoria'][c['mod']].get('cartoes', [])), (m, c['id'])
        assert isinstance(c.get('aceita', []), list)
    fl = {x['id'] for x in (D.get('flash') or []) + (D.get('flash_img') or [])}
    assert not (set(ids) & fl), m
    shutil.copy(f'{m}/dados.json', f'{m}/dados.json.bak_essencial')
    D['essencial'] = {'abc': abc, 'completar': [{k: c[k] for k in ('id', 'mod', 'sub', 'frase', 'resp', 'aceita', 'fonte') if k in c} for c in cz]}
    du.grava(m, D)
    assert du.le(m)['essencial']['abc'] == abc
    print(m, 'ok: 40 ABC + 40 completar')

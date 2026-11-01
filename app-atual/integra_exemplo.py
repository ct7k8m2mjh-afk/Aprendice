# -*- coding: utf-8 -*-
"""30/10: exemplo concreto em cada flashcard (FLASH_EXEMPLO_<m>.json revisado) -> D['flash'] e D['flash_img']."""
import json, sys, shutil
import dados_util as du
for m in sys.argv[1:]:
    E = json.load(open(f'FLASH_EXEMPLO_{m}.json', encoding='utf-8'))
    D = du.le(m)
    shutil.copy(f'{m}/dados.json', f'{m}/dados.json.bak_exemplo')
    n = nv = 0
    for k in ('flash', 'flash_img'):
        for c in D.get(k) or []:
            x = E.get(c['id']); assert x and x.get('exemplo', '').strip(), (m, c['id'])
            c['exemplo'] = x['exemplo'].strip(); n += 1
            if x.get('verso_novo'): c['verso'] = x['verso_novo'].strip(); nv += 1
    du.grava(m, D)
    print(m, n, 'exemplos,', nv, 'versos novos')

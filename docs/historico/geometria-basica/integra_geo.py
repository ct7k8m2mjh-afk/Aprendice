# Integra as 40 questões reais do ENEM (áreas básicas M08.6, volumes básicos M11.6) no mat/ do build.
# Uso: python3 integra_geo.py <pasta app-atual> <final.json>
import json, sys, hashlib, io, base64, os
from PIL import Image

APP, FINAL = sys.argv[1], sys.argv[2]
G = os.path.dirname(os.path.abspath(__file__))
plano = json.load(open(f'{G}/plano.json'))
gab = json.load(open(f'{G}/gab_sel.json'))
fin = json.load(open(FINAL))
import re
def nb(x):   # milhar com espaço que não quebra (16 000 não parte em duas linhas no celular)
    if isinstance(x, str): return re.sub(r'(?<=\d) (?=\d{3}(?!\d))', '\u00a0', x)
    if isinstance(x, list): return [nb(y) for y in x]
    if isinstance(x, dict): return {k: nb(v) for k, v in x.items()}
    return x
fin = {k: nb(v) for k, v in fin.items()}
D = json.load(open(f'{APP}/mat/dados.json'))

def url(ano, n):
    a = int(ano)
    if a >= 2020: return f'https://download.inep.gov.br/enem/provas_e_gabaritos/{a}_PV_impresso_D2_CD7.pdf'
    if a >= 2014: return f'https://download.inep.gov.br/educacao_basica/enem/provas/{a}/{a}_PV_impresso_D2_CD7.pdf'
    return f'https://download.inep.gov.br/educacao_basica/enem/provas/{a}/dia2_caderno7_azul.pdf'

ids_usados = {q['id'] for q in D['banco']}
def novo_id(chave):
    s = 'ENEM-' + chave
    while True:
        h = hashlib.md5(s.encode()).hexdigest()[:8]
        if h not in ids_usados: ids_usados.add(h); return h
        s += '+'

def webp(chave):
    im = Image.open(f'{G}/crop/{chave}.png').convert('RGB')
    if im.width > 900: im = im.resize((900, round(im.height * 900 / im.width)), Image.LANCZOS)
    b = io.BytesIO(); im.save(b, 'WEBP', quality=75, method=6)
    return 'data:image/webp;base64,' + base64.b64encode(b.getvalue()).decode()

# remove integração anterior destes dois conteúdos (rodar de novo não duplica)
antigos = {q['id']: q for q in D['banco'] if q['sub'] in ('M08.6', 'M11.6')}
D['banco'] = [q for q in D['banco'] if q['sub'] not in ('M08.6', 'M11.6')]
id_de = {f"{q['ano']}-{q['n']}": i for i, q in antigos.items()}   # ids existentes não mudam

for sub, mod in (('M08.6', 'M08'), ('M11.6', 'M11')):
    res = {}
    for p in plano[sub]:
        k = p['chave']; ano, n = k.split('-'); f = fin[k]
        assert p['gab'] == gab[k], k
        assert f['resposta'].startswith('Alternativa ' + gab[k]), (k, f['resposta'][:30])
        assert set(f['erradas']) == set('ABCDE') - {gab[k]}, k
        qid = id_de.get(k) or novo_id(k)
        D['banco'].append({'id': qid, 'escola': 'ENEM', 'ano': ano, 'n': int(n), 'banca': 'INEP', 'fase': '2º dia',
                           'enun': f['enun'], 'alts': f['alts'], 'gab': gab[k], 'modulo': mod, 'sub': sub,
                           'dif': p['dif'], 'degrau': p['degrau'], 'conceito': f['conceito'], 'tempo': f['tempo'],
                           'pista': f['pista'], 'url': url(ano, n), 'figura': bool(f['figura']) or '[' in f['enun'], 'tipo': 'prova'})
        res[qid] = {'antes': f['antes'], 'pista': f['pista'], 'passos': f['passos'], 'resposta': f['resposta'],
                    'checagem': f['checagem'], 'erradas': f['erradas'], 'armadilha': f['armadilha'],
                    'alerta': f.get('alerta', ''), 'essencial': f['essencial'], 'img': webp(k)}
    json.dump(res, open(f'{APP}/mat/res/{sub}.json', 'w'), ensure_ascii=False, separators=(',', ':'))
    print(sub, len(res), 'resoluções', os.path.getsize(f'{APP}/mat/res/{sub}.json') // 1024, 'KB')

D['nomesub']['M08.6'] = 'áreas básicas'
D['nomesub']['M11.6'] = 'volumes básicos'
D['nomesub'] = dict(sorted(D['nomesub'].items()))
CART = json.load(open(f'{G}/cartoes_novos.json'))
for mod in ('M08', 'M11'):
    cs = [c for c in D['teoria'][mod]['cartoes'] if c['sub'] not in CART]
    cs += [CART[s] for s in CART if s.startswith(mod)]
    D['teoria'][mod]['cartoes'] = sorted(cs, key=lambda c: c['sub'])   # sort estável: mantém a ordem dos cartões do mesmo conteúdo
json.dump(D, open(f'{APP}/mat/dados.json', 'w'), ensure_ascii=False, separators=(',', ':'))
print('banco', len(D['banco']))

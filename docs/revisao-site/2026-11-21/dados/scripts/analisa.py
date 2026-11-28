import json, glob, os, re, collections, sys
D = '/home/user/Aprendice/app/dist/conteudo'
MS = 'bio qui mat por fis geo his fs ing'.split()
OUT = {}
R = collections.defaultdict(lambda: collections.defaultdict(list))

def walk(o, path=''):
    if isinstance(o, str):
        yield path, o
    elif isinstance(o, dict):
        for k, v in o.items():
            yield from walk(v, f'{path}.{k}' if path else k)
    elif isinstance(o, list):
        for i, v in enumerate(o):
            yield from walk(v, f'{path}[{i}]')

SITE = re.compile(r'brasil\s?escola|brasilescola|mundo\s?educa[çc][aã]o|mundoeducacao|prepara\s?enem|preparaenem|info\s?escola|infoescola|toda\s?mat[ée]ria|todamateria', re.I)
EMOJI = re.compile('[\U0001F300-\U0001FAFF☀-➿⭐⭕←-⇿✅❌✓✗✔✖♪♫️]')
# setas comuns em conteúdo (→ ← ↔ ⇌ etc.) não são emoji: excluir 2190-21FF e 27F6 das contagens
def emojis(s):
    return [c for c in EMOJI.findall(s) if not ('←' <= c <= '⇿')]
# símbolos tipográficos/científicos legítimos
LEGIT = set('♂♀☉☐☑★☆✱✳❶❷❸❹❺⚡☢☠✝⚕♥♦♣♠')
PROIB = re.compile(r'\b(talvez|provavelmente|chut[ea]r?)\b', re.I)

contag = {}
banco_all = {}
for m in MS:
    b = json.load(open(f'{D}/{m}/banco.json'))
    mat = json.load(open(f'{D}/{m}/materia.json'))
    vis = lambda q: not q.get('pendente') and not q.get('outraMateria') and not q.get('anuladaAprendice')
    disp = [q for q in b if vis(q) and not q.get('indisponivel')]
    ind = [q for q in b if vis(q) and q.get('indisponivel')]
    subs_def = [(s['id'] if isinstance(s, dict) else s) for md in mat['modulos'] for s in md.get('subs', [])]
    porsub = collections.Counter(q['sub'] for q in disp)
    mods_def = [md['id'] for md in mat['modulos']]
    contag[m] = dict(total=len(b), disponiveis=len(disp), indisponiveis=len(ind),
                     pendentes=sum(1 for q in b if q.get('pendente')), outraMateria=sum(1 for q in b if q.get('outraMateria')),
                     anuladaAprendice=sum(1 for q in b if q.get('anuladaAprendice')), temas=len(mods_def), subs=len(subs_def),
                     subs_sem_questao=[s for s in subs_def if not porsub.get(s)],
                     sub_fora_def=sorted(set(q['sub'] for q in disp) - set(subs_def)),
                     enem=sum(1 for q in disp if q['escola'].upper().startswith('ENEM')),
                     gab_aprendice=sum(1 for q in disp if q.get('gabFonte') == 'aprendice'),
                     site=sum(1 for q in disp if q.get('origem') != 'prova'),
                     porsub=dict(porsub))
    banco_all[m] = (b, disp, ind, mat)
    # fonte e gabarito
    for q in disp + ind:
        for f in ('escola', 'ano', 'n'):
            if not str(q.get(f, '')).strip(): R['sem_fonte'][m].append(f"{q['id']} sem {f}")
        if not str(q.get('url', '')).startswith('http'): R['sem_link'][m].append(q['id'])
        if q.get('origem') != 'prova': R['origem_site'][m].append(q['id'])
        if q.get('indisponivel'):
            continue
        if q['gab'] not in q['alts']: R['gab_invalido'][m].append(f"{q['id']} gab={q['gab']!r}")
        if q.get('gabFonte') not in (None, 'aprendice'): R['gabFonte_outros'][m].append(f"{q['id']} {q.get('gabFonte')}")
    # sites didáticos no banco (fora do enunciado = nosso dado)
    for q in b:
        for p, s in walk({k: v for k, v in q.items()}):
            if SITE.search(s):
                where = 'enun/alts(prova)' if p.startswith(('enun', 'alts')) else p
                R['site_banco'][m].append(f"{q['id']} {where} vis={vis(q)}: {SITE.search(s).group(0)}")
    # materia.json
    for p, s in walk(mat):
        if SITE.search(s): R['site_materia'][m].append(f"{p}: {s[:160]}")
        e = [c for c in emojis(s) if c not in LEGIT]
        if e: R['emoji_materia'][m].append(f"{p}: {''.join(e)} «{s[:80]}»")
    # flashcards: fonte
    for f in mat.get('flash', []) + mat.get('flashImg', []):
        if not str(f.get('fonte', '')).strip(): R['flash_sem_fonte'][m].append(f['id'])
    for f in mat.get('essencial', {}).get('completar', []):
        if not str(f.get('fonte', '')).strip(): R['frase_sem_fonte'][m].append(f['id'])
    OUT.setdefault('flash_n', {})[m] = dict(flash=len(mat.get('flash', [])), flashImg=len(mat.get('flashImg', [])), completar=len(mat.get('essencial', {}).get('completar', [])))
    # resoluções
    res = {}
    for f in glob.glob(f'{D}/{m}/res/*.json'):
        res.update(json.load(open(f)))
    ids_vis = {q['id'] for q in disp}
    for q in disp:
        r = res.get(q['id'])
        if not r: R['sem_resolucao'][m].append(q['id']); continue
        err = r.get('erradas') or {}
        letras = [l for l in q['alts'] if l != q['gab']]
        falt = [l for l in letras if not str(err.get(l, '')).strip()]
        if falt: R['erradas_faltando'][m].append(f"{q['id']} {''.join(falt)}")
        for k in ('resposta', 'armadilha'):
            if not str(r.get(k, '')).strip(): R['campo_vazio'][m].append(f"{q['id']} {k}")
        if not r.get('passos'): R['campo_vazio'][m].append(f"{q['id']} passos")
        if q['gab'] in err and str(err[q['gab']]).strip(): R['erradas_com_gab'][m].append(q['id'])
        for l, t in err.items():
            for mm in PROIB.finditer(str(t)):
                R['proib_erradas'][m].append(f"{q['id']} erradas.{l}: {mm.group(0)} «{str(t)[max(0,mm.start()-60):mm.end()+60]}»")
    for k, r in res.items():
        for p, s in walk(r):
            if SITE.search(s): R['site_res'][m].append(f"{k} {p}: {SITE.search(s).group(0)} «{s[:140]}»")
            e = [c for c in emojis(s) if c not in LEGIT]
            if e: R['emoji_res'][m].append(f"{k} {p}: {''.join(e)}")
    # revisao
    for f in glob.glob(f'{D}/{m}/revisao/*.json'):
        for p, s in walk(json.load(open(f))):
            if SITE.search(s): R['site_revisao'][m].append(f"{os.path.basename(f)} {p}: {s[:140]}")
            e = [c for c in emojis(s) if c not in LEGIT]
            if e: R['emoji_revisao'][m].append(f"{os.path.basename(f)} {p}: {''.join(e)}")
    # txt (texto da prova): só registra
    n_txt = 0
    for f in glob.glob(f'{D}/{m}/txt/*.json'):
        for k, t in json.load(open(f)).items():
            for p, s in walk(t):
                if SITE.search(s): n_txt += 1; R['site_txt_prova'][m].append(f"{k} {p}: {SITE.search(s).group(0)}")
    # conceito que entrega (II e IV estão corretas)
    for q in disp:
        c = q.get('conceito', '')
        if re.search(r'\b(?:[IV]+(?:,| e) )+[IV]+ (?:est[aã]o|s[aã]o) (?:corret|verdadeir|incorret|falsa)|\balternativa [A-E]\b|\bletra [A-E]\b|\b(?:s[oó]|apenas) (?:a )?(?:afirma[çc][aã]o )?[IV]+ (?:est[áa]|é) corret', c):
            R['conceito_entrega'][m].append(f"{q['id']}: {c[:90]}")
    # prints existem
    for q in disp + ind:
        pth = q.get('print') or f"{m}/prints/{q['id']}.webp"
        if not os.path.exists(f'{D}/{pth}'): R['print_faltando'][m].append(f"{q['id']} {pth}")

OUT['contagens'] = contag

# provas completas
prov = {}
for f in sorted(glob.glob(f'{D}/provas/*/prova.json')):
    p = json.load(open(f))
    pid = p['id']
    for k, u in p.get('fontes', {}).items():
        if SITE.search(str(u)): R['site_provas_fontes']['provas'].append(f"{pid} {k}: {u}")
    if SITE.search(p.get('nota', '')): R['site_provas_fontes']['provas'].append(f"{pid} nota: {p['nota'][:120]}")
    for q in p['questoes']:
        for k in ('res', 'conceito'):
            for pp, s in walk(q.get(k)):
                if SITE.search(s): R['site_provas_res']['provas'].append(f"{pid} q{q['n']} {k}.{pp}: {SITE.search(s).group(0)}")
                e = [c for c in emojis(s) if c not in LEGIT]
                if e: R['emoji_provas_res']['provas'].append(f"{pid} q{q['n']} {k}.{pp}: {''.join(e)}")
        if q.get('res'):
            for l, t in (q['res'].get('erradas') or {}).items():
                for mm in PROIB.finditer(str(t)):
                    R['proib_erradas_provas']['provas'].append(f"{pid} q{q['n']} {l}: {mm.group(0)}")
        if not q.get('indisponivel') and q['gab'] and q['gab'] not in 'ABCDE':
            R['prova_gab_estranho']['provas'].append(f"{pid} q{q['n']} {q['gab']}")
    prov[pid] = len(p['questoes'])
OUT['provas'] = dict(n=len(prov), questoes=sum(prov.values()))

# arquivos com nome de site
for f in glob.glob(f'{D}/**/*', recursive=True):
    if SITE.search(os.path.basename(f)): R['site_arquivo']['dist'].append(f)
# JS/CSS do build
for f in glob.glob('/home/user/Aprendice/app/dist/assets/*'):
    try: s = open(f, encoding='utf-8', errors='ignore').read()
    except Exception: continue
    for mm in SITE.finditer(s):
        R['site_build']['assets'].append(f"{os.path.basename(f)}: «{s[max(0,mm.start()-120):mm.end()+60]}»")

OUT['R'] = {k: {m: v for m, v in d.items()} for k, d in R.items()}
json.dump(OUT, open(sys.argv[1], 'w'), ensure_ascii=False, indent=1)
for k, d in R.items():
    print(k, {m: len(v) for m, v in d.items()})
for m in MS:
    c = contag[m]; print(m, {k: v for k, v in c.items() if k != 'porsub'})
print(OUT['provas'], OUT['flash_n'])

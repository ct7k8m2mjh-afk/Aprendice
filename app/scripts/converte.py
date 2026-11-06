#!/usr/bin/env python3
"""Converte o conteúdo do protótipo (app-atual/) para o formato do app (app/public/conteudo/).

Regras:
- Ids de questão, conteúdo, módulo e cartão NÃO mudam (princípio 7).
- Nada de conteúdo é criado: só se copia, normaliza tipos e separa arquivos.
- Itens pessoais do protótipo são neutralizados (nome do aluno em texto de resolução).

Uso:
  python3 scripts/converte.py            # conteúdo completo em public/conteudo
  python3 scripts/converte.py --amostra  # amostra pequena embutida em src/previa/dados.json (prévia de arquivo único)
"""
import base64, json, os, re, shutil, sys, hashlib

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import icones_tema  # noqa: E402  (ícones de tema do dono: docs/icones/)

AQUI = os.path.dirname(os.path.abspath(__file__))
APP = os.path.dirname(AQUI)
ORIGEM = os.path.join(os.path.dirname(APP), 'app-atual')
DESTINO = os.path.join(APP, 'public', 'conteudo')
AMOSTRA = '--amostra' in sys.argv

MATERIAS = ['bio', 'qui', 'mat', 'por']
# Matérias novas: estrutura (temas) em conteudo-fonte/materias/<m>.json; questões chegam com as provas completas.
NOVAS = ['fis', 'geo', 'his', 'fs', 'ing']
# Filosofia e Sociologia viraram uma matéria só, 'fs' (comando 18 do dono). Ids de temas e questões não mudam;
# as provas classificadas antes com 'fil'/'soc' passam a contar como 'fs' na saída (a fonte não é alterada).
MATERIA_UNIDA = {'fil': 'fs', 'soc': 'fs'}
# ícones de tema de cada matéria nova: pastas em conteudo-fonte/materias/ic/ (fs junta as pranchas das duas)
PASTAS_IC = {'fs': ['fs', 'fil', 'soc']}
FONTE_NOVAS = os.path.join(APP, 'conteudo-fonte', 'materias')
ESCOLA_NORMAL = {'Mundo Educacao': 'Mundo Educação', 'FMJ': 'FMJ (Jundiaí)'}
FASE_NORMAL = {'1fase': '1ª fase', '2fase': '2ª fase'}
PESSOAL = [(re.compile(r'\bVitor\b'), 'você')]
# Comando 21 do dono: questões copiadas de sites didáticos (tipo "site") não vão ao site. A triagem
# (scripts/triagem_site.py) diz qual questão de prova ocupa o lugar de cada uma, quando existe.
TRIAGEM = os.path.join(os.path.dirname(APP), 'docs', 'provas', 'triagem-questoes-site.json')


def triagem():
    """id da questão de site -> {'m', 'sub', 'dif', 'para': (matéria, id) | None} (para = questão de prova equivalente)."""
    out = {}
    for i in ler(TRIAGEM)['itens']:
        e = i.get('equivalente') if i['destino'].startswith('questao_de_prova:') else None
        out[i['id']] = {'m': i['materia'], 'sub': i['sub'], 'dif': i['dif'], 'para': (e['materia'], e['id']) if e else None}
    return out


_TRIAGEM = None


def tri():
    global _TRIAGEM
    if _TRIAGEM is None:
        _TRIAGEM = triagem()
    return _TRIAGEM


def sub_troca():
    """Questão de prova que ocupa o lugar de uma de site da MESMA matéria vai para o conteúdo (sub) dela.
    Questão que recebe mais de uma (de matérias diferentes) fica no conteúdo da de mesma matéria."""
    out = {}
    for sid, t in tri().items():
        if t['para'] and t['para'][0] == t['m']:
            out.setdefault(t['para'][1], t['sub'])
    return out


def ler(p):
    with open(p, encoding='utf-8') as f:
        return json.load(f)


def gravar(p, obj):
    os.makedirs(os.path.dirname(p), exist_ok=True)
    with open(p, 'w', encoding='utf-8') as f:
        json.dump(obj, f, ensure_ascii=False, separators=(',', ':'))


def neutro(x):
    """Remove menções pessoais em qualquer texto aninhado."""
    if isinstance(x, str):
        for rx, sub in PESSOAL:
            x = rx.sub(sub, x)
        # "O que você precisa" sobrou com maiúscula certa; ajusta início de frase
        return x
    if isinstance(x, list):
        return [neutro(v) for v in x]
    if isinstance(x, dict):
        return {k: neutro(v) for k, v in x.items()}
    return x


def data_uri_bytes(s):
    if s.startswith('data:'):
        s = s.split(',', 1)[1]
    return base64.b64decode(s)


def inteiro(v, padrao=0):
    try:
        return int(str(v).strip())
    except Exception:
        return padrao


def bool_(v):
    return str(v).strip().lower() in ('true', '1', 'sim')


def questao(q):
    escola = ESCOLA_NORMAL.get(q.get('escola', ''), q.get('escola', ''))
    tipo = q.get('tipo') or 'prova'
    return {
        'id': q['id'],
        'escola': escola,
        'ano': str(q.get('ano', '')),
        'n': str(q.get('n', '')),
        'banca': q.get('banca') or '',
        'fase': FASE_NORMAL.get((q.get('fase') or '').strip(), (q.get('fase') or '').strip()),
        'enun': q.get('enun') or '',
        'alts': q.get('alts') or {},
        'gab': q['gab'],
        'modulo': q['modulo'],
        'sub': q['sub'],
        'dif': inteiro(q.get('dif'), 5),
        'degrau': inteiro(q.get('degrau'), 0),
        'conceito': q.get('conceito') or '',
        'pista': q.get('pista') or '',
        'url': q.get('url') or '',
        # prova = caderno oficial; site = lista pública de exercícios; texto/imagem = formatos antigos de Mat (provas)
        'origem': 'site' if tipo == 'site' else 'prova',
        'figura': bool_(q.get('figura')),
        # princípio 1: sem link da fonte a questão não vai ao ar (fica no arquivo, escondida no app)
        **({'pendente': 'sem link da fonte'} if not (q.get('url') or '').startswith('http') else {}),
    }


def converte_materia(m, amostra_ids=None):
    src = os.path.join(ORIGEM, m)
    d = ler(os.path.join(src, 'dados.json'))
    # comando 21: as questões de sites didáticos ficam só em app-atual/ (não vão ao site)
    banco = [questao(q) for q in d['banco'] if (q.get('tipo') or 'prova') != 'site']
    troca = sub_troca()
    sub_antes = {}
    for q in banco:
        if q['id'] in troca and troca[q['id']] != q['sub']:
            sub_antes[q['id']] = q['sub']
            q['sub'], q['modulo'] = troca[q['id']], troca[q['id']].split('.')[0]
    ids = {q['id'] for q in banco}
    saida = os.path.join(DESTINO, m)

    # resoluções por conteúdo, sem o print (que vira arquivo)
    res_por_sub, prints = {}, {}
    pasta_res = os.path.join(src, 'res')
    for f in sorted(os.listdir(pasta_res)):
        if not f.endswith('.json'):
            continue
        sub = f[:-5]
        bruto = ler(os.path.join(pasta_res, f))
        limpo = {}
        for qid, r in bruto.items():
            if qid not in ids:
                continue  # resolução de questão retirada do banco (corte_500)
            r = dict(r)
            img = r.pop('img', '')
            if img:
                prints[qid] = img
            r.pop('id', None)
            limpo[qid] = neutro(r)
        if limpo:
            res_por_sub[sub] = limpo
    # questão que mudou de conteúdo (sub_troca): a resolução vai junto para o arquivo do conteúdo novo
    for qid, velho in sub_antes.items():
        r = res_por_sub.get(velho, {}).pop(qid, None)
        if r is not None:
            novo = next(q['sub'] for q in banco if q['id'] == qid)
            res_por_sub.setdefault(novo, {})[qid] = r
    res_por_sub = {k: v for k, v in res_por_sub.items() if v}

    # ícones (módulo e conteúdo); com ícones novos do dono em docs/icones/, só eles (os antigos saem do site)
    icones = icones_tema_ou(m, lambda: ler(os.path.join(src, 'ic.json')))

    # figuras de teoria por módulo
    figuras = {}
    pasta_img = os.path.join(src, 'img')
    if os.path.isdir(pasta_img):
        for f in sorted(os.listdir(pasta_img)):
            if f.endswith('.json'):
                lst = ler(os.path.join(pasta_img, f))
                figuras[f[:-5]] = [{'t': x.get('t', ''), 'u': x.get('u', ''), 'subs': x.get('sub') if isinstance(x.get('sub'), list) else [], 'fonte': x.get('f', ''), 'licenca': x.get('l', '')} for x in lst]

    # módulos e conteúdos
    teoria = d.get('teoria') or {}
    nomesub = d.get('nomesub') or {}
    modulos = []
    for mid in sorted(teoria.keys()):
        t = teoria[mid]
        # conteúdos que só tinham questões de site continuam no tema (vazios até chegar a questão de prova ou Aprendice)
        subs = sorted({q['sub'] for q in banco if q['modulo'] == mid} | {s for s in nomesub if s.split('.')[0] == mid}
                      | {q['sub'] for q in d['banco'] if q['modulo'] == mid}, key=lambda s: (s.split('.')[0], inteiro(s.split('.')[-1], 999)))
        modulos.append({
            'id': mid, 'nome': t.get('nome', mid), 'resumo': t.get('resumo', ''),
            'formulas': t.get('formulas', []), 'erro': t.get('erro', ''),
            'cartoes': t.get('cartoes', []),
            'subs': [{'id': s, 'nome': nomesub.get(s, s)} for s in subs],
        })

    flash_img = d.get('flash_img') or []
    materia = {
        'id': m,
        'modulos': modulos,
        'areas': d.get('areas') or [],
        'glossario': d.get('glossario') or {},
        'dic': d.get('dic') or [],
        'flash': d.get('flash') or [],
        'flashImg': flash_img,
        'essencial': d.get('essencial') or {'abc': [], 'completar': []},
        'alias': d.get('alias') or {},
    }

    if amostra_ids is not None:
        return banco, materia, res_por_sub, prints, icones, figuras

    # grava
    if os.path.isdir(saida):
        shutil.rmtree(saida)
    gravar(os.path.join(saida, 'materia.json'), materia)
    gravar(os.path.join(saida, 'banco.json'), banco)
    for sub, r in res_por_sub.items():
        gravar(os.path.join(saida, 'res', sub + '.json'), r)
    os.makedirs(os.path.join(saida, 'prints'), exist_ok=True)
    for qid, img in prints.items():
        with open(os.path.join(saida, 'prints', qid + '.webp'), 'wb') as f:
            f.write(data_uri_bytes(img))
    os.makedirs(os.path.join(saida, 'ic'), exist_ok=True)
    for k, v in icones.items():
        with open(os.path.join(saida, 'ic', k + '.webp'), 'wb') as f:
            f.write(data_uri_bytes(v))
    gravar(os.path.join(saida, 'figuras.json'), figuras)
    pasta_fi = os.path.join(ORIGEM, 'design', 'flash_img', m)
    if os.path.isdir(pasta_fi):
        os.makedirs(os.path.join(saida, 'flash_img'), exist_ok=True)
        for c in flash_img:
            p = os.path.join(pasta_fi, c['img'])
            if os.path.exists(p):
                shutil.copy(p, os.path.join(saida, 'flash_img', c['img']))
    return {
        'questoes': len(banco), 'resolucoes': sum(len(v) for v in res_por_sub.values()),
        'prints': len(prints), 'icones': len(icones), 'flash': len(materia['flash']),
        'completar': len(materia['essencial'].get('completar', [])),
    }


_CACHE_TEMA = {}


def icones_tema_ou(m, antigos):
    """Ícones de tema enviados pelo dono (docs/icones/<matéria>/, comando 19) são os ÚNICOS ícones da matéria:
    os antigos (de tema e de subtema, do protótipo ou das pranchas) não entram. Sem ícones novos, ficam os atuais."""
    if m not in _CACHE_TEMA:
        _CACHE_TEMA[m] = {k: base64.b64encode(v).decode() for k, v in icones_tema.icones_materia(m).items()}
    return dict(_CACHE_TEMA[m]) if _CACHE_TEMA[m] else antigos()


def gera_icones_tema_ts():
    """src/dados/iconesTema.ts: temas que têm o ícone novo (o site desenha esses dentro do círculo claro)."""
    mapa = {m: sorted(icones_tema.arquivos_materia(m)) for m in icones_tema.materias_com_icones()}
    alvo = os.path.join(APP, 'src', 'dados', 'iconesTema.ts')
    with open(alvo, 'w', encoding='utf-8') as f:
        f.write('// Gerado por scripts/converte.py a partir de docs/icones/<matéria>/<id do tema>-<nome>.png (comando 19 do dono).\n')
        f.write('// Temas com ícone novo: o arquivo é public/conteudo/<m>/ic/<id>.webp e aparece inteiro dentro do círculo claro.\n')
        f.write('export const ICONES_TEMA: Record<string, readonly string[]> = ' + json.dumps(mapa, ensure_ascii=False) + ';\n')


def icones_novos(m):
    """Ícones 3D enviados pelo dono: conteudo-fonte/materias/ic/<m>/<id do tema>.png|webp -> base64 webp."""
    out = {}
    for nome in PASTAS_IC.get(m, [m]):
        pasta = os.path.join(FONTE_NOVAS, 'ic', nome)
        if os.path.isdir(pasta):
            out.update(icones_pasta(pasta))
    return out


def icones_pasta(pasta):
    from io import BytesIO
    from PIL import Image
    out = {}
    for f in sorted(os.listdir(pasta)):
        chave, ext = os.path.splitext(f)
        if ext.lower() not in ('.png', '.webp', '.jpg', '.jpeg'):
            continue
        im = Image.open(os.path.join(pasta, f)).convert('RGBA')
        b = BytesIO()
        im.save(b, 'WEBP', quality=88, method=6)
        out[chave] = base64.b64encode(b.getvalue()).decode()
    return out


def converte_nova(m, amostra_ids=None):
    """Física, Geografia...: temas definidos, sem questões ainda (entram com as provas completas)."""
    materia = ler(os.path.join(FONTE_NOVAS, m + '.json'))
    materia.pop('_sobre', None)
    banco = []
    icones = icones_tema_ou(m, lambda: icones_novos(m))
    if amostra_ids is not None:
        return banco, materia, {}, {}, icones, {}
    saida = os.path.join(DESTINO, m)
    if os.path.isdir(saida):
        shutil.rmtree(saida)
    gravar(os.path.join(saida, 'materia.json'), materia)
    gravar(os.path.join(saida, 'banco.json'), banco)
    gravar(os.path.join(saida, 'figuras.json'), {})
    os.makedirs(os.path.join(saida, 'ic'), exist_ok=True)
    for k, v in icones.items():
        with open(os.path.join(saida, 'ic', k + '.webp'), 'wb') as f:
            f.write(base64.b64decode(v))
    return {'questoes': 0, 'temas': len(materia['modulos']), 'icones': len(icones)}


FONTE_PROVAS = os.path.join(APP, 'conteudo-fonte', 'provas')


def provas_fonte():
    """Provas completas recortadas (ferramentas/ingestao/recorta.py): metadados + questões válidas."""
    out = []
    if not os.path.isdir(FONTE_PROVAS):
        return out
    for pid in sorted(os.listdir(FONTE_PROVAS)):
        f = os.path.join(FONTE_PROVAS, pid, 'prova.json')
        if os.path.exists(f):
            p = ler(f)
            # prova ainda sendo gravada (outro processo recortando): sem todos os prints, fica para a próxima conversão
            falta = [q['print'] for q in p['questoes'] if not os.path.exists(os.path.join(FONTE_PROVAS, pid, q['print']))]
            if falta:
                print(f'  prova {pid} ignorada: {len(falta)} prints ainda não gravados')
                continue
            # resoluções aprovadas pela banca (resolvedor + corretor de fatos + corretor de didática + fatos de novo)
            fr = os.path.join(FONTE_PROVAS, pid, 'resolucoes.json')
            if os.path.exists(fr):
                res = ler(fr)
                for q in p['questoes']:
                    r = res.get(q['id'])
                    if r and r.get('aprovada'):
                        q['res'] = dict(r['resolucao'])
                        for k in ('quadro', 'caminhos', 'visual'):
                            if r.get(k):
                                q['res'][k] = r[k]
                        for k in ('materia', 'tema', 'conteudo', 'nivel', 'conceito'):
                            if r.get(k) is not None:
                                q[k] = r[k]
            for q in p['questoes']:
                if q.get('materia') in MATERIA_UNIDA:
                    q['materia'] = MATERIA_UNIDA[q['materia']]
            out.append(p)
    return out


def entrada_indice(p):
    areas = {}
    for q in p['questoes']:
        areas[q['area']] = areas.get(q['area'], 0) + 1
    return {k: p.get(k) for k in ('id', 'catalogoId', 'escola', 'ano', 'fase', 'titulo', 'banca', 'duracao_horas',
                                  'alternativas', 'total_oficial')} | {'questoes': len(p['questoes']), 'areas': areas}


def copia_provas(provas=None):
    """App completo: public/conteudo/provas/<id>/prova.json + q/<n>.webp e o índice."""
    destino = os.path.join(DESTINO, 'provas')
    if os.path.isdir(destino):
        shutil.rmtree(destino)
    indice = []
    for p in (provas if provas is not None else provas_fonte()):
        d = os.path.join(destino, p['id'])
        os.makedirs(os.path.join(d, 'q'), exist_ok=True)
        for q in p['questoes']:
            shutil.copy(os.path.join(FONTE_PROVAS, p['id'], q['print']), os.path.join(d, q['print']))
        gravar(os.path.join(d, 'prova.json'), p)
        indice.append(entrada_indice(p))
    gravar(os.path.join(destino, 'indice.json'), indice)
    return {'provas': len(indice), 'questoes': sum(x['questoes'] for x in indice)}


# ---------------------------------------------------------------------------------------------------------------
# Questões das provas completas nos exercícios das matérias (comando 14 do dono: "para simulados e exercícios").
# Cada questão de prova classificada (materia, tema, conteudo, nivel) entra no banco da matéria com o id da prova
# (estável), a fonte (caderno oficial), o print e o gabarito oficial. A questão que JÁ existe no banco antigo
# (mesma prova, mesmo número e mesmo texto) não entra de novo: fica a antiga, com o id dela (princípio 7) e a
# resolução aprovada. Texto e transcrição (pesados) ficam em <m>/txt/<conteúdo>.json, lidos com a questão.

# escola do banco antigo -> id do catálogo (o mesmo de src/dados/provas.ts, mais a Fatec)
CATALOGO_ESCOLA = {'Fuvest': 'fuvest', 'Unesp': 'unesp', 'Santa Casa (FCMSCSP)': 'santacasa', 'Albert Einstein': 'einstein',
                   'São Camilo': 'saocamilo', 'Famema': 'famema', 'FMJ (Jundiaí)': 'fmj', 'ENEM': 'enem', 'Enem': 'enem',
                   'Fatec': 'fatec'}
LETRAS = 'ABCDE'


def palavras(s):
    import unicodedata
    s = unicodedata.normalize('NFKD', s or '').encode('ascii', 'ignore').decode().lower()
    return {w for w in re.findall(r'[a-z0-9]+', s) if len(w) >= 4}


def parecido(a, b):
    """Quanto do texto menor aparece no maior (0 a 1)."""
    return len(a & b) / min(len(a), len(b)) if a and b else 0.0


def acha_duplicatas(provas, antigos):
    """Questão de prova -> questão do banco antigo que é a mesma. Mesma instituição e ano, e:
    mesmo número com texto parecido (>= 0,5), ou texto quase igual (>= 0,9) e mesmo gabarito
    (cadernos com numeração diferente, como as cores do ENEM). Um para um, do par mais parecido ao menos.
    Questões que só dividem o texto-base (63, 64, 65 sobre o mesmo poema) têm números e gabaritos diferentes."""
    por_chave = {}
    for m, banco in antigos.items():
        for q in banco:
            q = dict(q, _m=m, _w=palavras(q['enun'] + ' ' + ' '.join(q['alts'].values())))
            for esc in {CATALOGO_ESCOLA.get(q['escola'], q['escola']), q['escola']}:
                por_chave.setdefault((esc, q['ano'][:4]), []).append(q)
    pares = []
    for p in provas:
        cand = {id(q): q for esc in (p.get('catalogoId'), p['escola']) for q in por_chave.get((esc, str(p['ano'])[:4]), [])}.values()
        if not cand:
            continue
        for pq in p['questoes']:
            w = palavras(pq.get('texto', ''))
            for q in cand:
                s = parecido(w, q['_w'])
                if (q['n'] == str(pq['n']) and s >= 0.5) or (s >= 0.9 and q['gab'] == pq['gab']):
                    pares.append((s + (1 if q['n'] == str(pq['n']) else 0), pq['id'], q['id'], q['_m'], q['gab'] == pq['gab']))
    dup, usados = {}, set()
    for _, pid, qid, m, mesmo_gab in sorted(pares, reverse=True):
        if pid in dup or qid in usados:
            continue
        dup[pid] = {'m': m, 'id': qid, 'mesmo_gab': mesmo_gab}
        usados.add(qid)
    return dup


def questao_da_prova(p, pq):
    """Questão de prova no formato do banco (leve) e o texto dela (vai para txt/<conteúdo>.json)."""
    caderno = (pq.get('caderno') and p['fontes'].get(pq['caderno'])) or next(iter(p['fontes'].values()), '')
    tr = pq.get('transcricao')
    q = {
        'id': pq['id'], 'escola': p['escola'], 'ano': str(p['ano']), 'n': str(pq['n']), 'banca': p.get('banca') or '',
        'fase': p.get('fase') or '', 'enun': '', 'alts': {l: '' for l in LETRAS[:p.get('alternativas') or 5]},
        'gab': pq['gab'], 'modulo': pq['tema'], 'sub': pq['conteudo'], 'dif': inteiro(pq.get('nivel'), 5), 'degrau': 0,
        'conceito': pq.get('conceito') or '', 'pista': '', 'url': caderno, 'origem': 'prova', 'figura': not tr,
        'print': 'provas/' + p['id'] + '/' + pq['print'], 'prova': p['id'], 'txt': 1,
    }
    if not caderno.startswith('http'):
        q['pendente'] = 'sem link da fonte'
    texto = {'enun': pq.get('texto') or ''}
    if tr:
        texto['transcricao'] = tr
    return q, texto


def liga_provas(provas):
    """Grava as questões das provas no banco de cada matéria (depois de converter as matérias e copiar as provas)."""
    todas = MATERIAS + NOVAS
    bancos = {m: ler(os.path.join(DESTINO, m, 'banco.json')) for m in todas}
    subs = {m: {s['id'] for x in ler(os.path.join(DESTINO, m, 'materia.json'))['modulos'] for s in x['subs']} for m in todas}
    dup = acha_duplicatas(provas, {m: bancos[m] for m in MATERIAS})
    ids = {q['id'] for b in bancos.values() for q in b}
    antes = {m: len(bancos[m]) for m in todas}
    textos = {m: {} for m in todas}
    res_novas = {m: {} for m in todas}
    res_antigas = {}  # resolução aprovada da prova para a questão antiga que ainda não tem
    fora = {'sem_classificacao': 0, 'conteudo_desconhecido': 0, 'gabarito_invalido': 0}
    oficiais = []  # duplicatas: (prova, questão da prova, questão antiga que fica)
    troca = sub_troca()
    for p in provas:
        for pq in p['questoes']:
            m = pq.get('materia')
            if pq['id'] in troca and pq.get('conteudo') and troca[pq['id']].split('.')[0][0] == pq['conteudo'][0]:
                # comando 21: ocupa o lugar de uma questão de site, no mesmo conteúdo dela (a fonte não muda)
                pq = dict(pq, conteudo=troca[pq['id']], tema=troca[pq['id']].split('.')[0])
            if pq['id'] in dup:
                d = dup[pq['id']]
                if pq.get('res'):
                    res_antigas[d['id']] = (d['m'], pq['res'])
                oficiais.append((p, pq, d))
                continue
            if m not in bancos or not pq.get('tema') or not pq.get('conteudo') or not pq.get('nivel'):
                fora['sem_classificacao'] += 1
                continue
            if pq['conteudo'] not in subs[m]:
                fora['conteudo_desconhecido'] += 1
                continue
            if pq.get('gab') not in LETRAS:
                fora['gabarito_invalido'] += 1
                continue
            if pq['id'] in ids:
                raise SystemExit(f"id repetido entre o banco e a prova {p['id']}: {pq['id']}")
            ids.add(pq['id'])
            q, texto = questao_da_prova(p, pq)
            bancos[m].append(q)
            textos[m].setdefault(q['sub'], {})[q['id']] = texto
            if pq.get('res'):
                res_novas[m].setdefault(q['sub'], {})[q['id']] = pq['res']
    # Duplicata: fica o id antigo (progresso, resolução e classificação), mas o que o aluno vê passa a ser o da prova
    # oficial: print do PDF oficial, texto da camada de texto, transcrição, número e link (pedido do coordenador no
    # comando 21: a antiga 7fa8608d, Fatec 2020 q4, tinha a alternativa E transcrita errada; a versão da prova vale).
    por_id = {(m, q['id']): q for m in MATERIAS for q in bancos[m]}
    for p, pq, d in oficiais:
        q = por_id[(d['m'], d['id'])]
        qn, texto = questao_da_prova(p, pq)
        for k in ('escola', 'ano', 'n', 'banca', 'fase', 'enun', 'alts', 'url', 'origem', 'figura', 'print', 'txt'):
            q[k] = qn[k]
        q['provaOficial'] = p['id']  # não usa 'prova': o id continua sendo o antigo, que não está no prova.json
        q.pop('pendente', None)
        if qn.get('pendente'):
            q['pendente'] = qn['pendente']
        textos[d['m']].setdefault(q['sub'], {})[q['id']] = texto
    # resoluções aprovadas da prova para questões antigas sem resolução (mesma questão, id antigo)
    sub_antigo = {q['id']: q['sub'] for m in MATERIAS for q in bancos[m]}
    n_res_antigas = 0
    for qid, (m, r) in res_antigas.items():
        f = os.path.join(DESTINO, m, 'res', sub_antigo[qid] + '.json')
        atual = ler(f) if os.path.exists(f) else {}
        if qid not in atual:
            atual[qid] = r
            gravar(f, atual)
            n_res_antigas += 1
    for m in todas:
        gravar(os.path.join(DESTINO, m, 'banco.json'), bancos[m])
        pasta = os.path.join(DESTINO, m, 'txt')
        if os.path.isdir(pasta):
            shutil.rmtree(pasta)
        for sub, t in textos[m].items():
            gravar(os.path.join(pasta, sub + '.json'), t)
        for sub, r in res_novas[m].items():
            f = os.path.join(DESTINO, m, 'res', sub + '.json')
            atual = ler(f) if os.path.exists(f) else {}
            atual.update(r)
            gravar(f, atual)
    rel = {m: {'antes': antes[m], 'depois': len(bancos[m])} for m in todas}
    rel['duplicatas'] = len(dup)
    rel['duplicatas_gabarito_diferente'] = sorted(pid for pid, d in dup.items() if not d['mesmo_gab'])
    rel['resolucoes_para_antigas'] = n_res_antigas
    rel['duplicatas_com_conteudo_oficial'] = len(oficiais)
    rel['fora'] = fora
    # registro: questão da prova -> questão do banco antigo que ficou no lugar dela (o teste confere)
    gravar(os.path.join(DESTINO, 'duplicatas-provas.json'), {pid: d['m'] + '/' + d['id'] for pid, d in sorted(dup.items())})
    return rel


def aplica_retiradas():
    """Comando 21, depois de montar os bancos: (1) confere que nenhuma questão de site entrou; (2) o treino geral
    (essencial.abc) troca cada id de site pela questão de prova equivalente da mesma matéria, ou tira da lista;
    (3) grava src/dados/questoesRetiradas.ts, que a migração do progresso (src/estado/migracao.ts) e o desempenho usam."""
    bancos = {m: ler(os.path.join(DESTINO, m, 'banco.json')) for m in MATERIAS + NOVAS}
    no_ar = {(m, q['id']): q for m, b in bancos.items() for q in b if not q.get('pendente')}
    for (m, qid), q in no_ar.items():
        if q.get('origem') == 'site' or q['escola'] in ('Brasil Escola', 'Mundo Educação', 'Mundo Educacao', 'Prepara Enem', 'InfoEscola'):
            raise SystemExit(f'questão de site no banco do site: {m}/{qid}')
    t = tri()
    destino = {}
    for sid, x in t.items():
        if (x['m'], sid) in no_ar:
            raise SystemExit(f'questão de site no banco do site: {sid}')
        p = x['para']
        destino[sid] = p if p and p in no_ar else None
    rel = {'retiradas': len(t), 'com_equivalente': sum(1 for v in destino.values() if v),
           'sem_equivalente_no_ar': sorted(sid for sid, x in t.items() if x['para'] and not destino[sid]), 'essencial': {}}
    for m in MATERIAS:
        f = os.path.join(DESTINO, m, 'materia.json')
        mat = ler(f)
        abc, novo = mat['essencial'].get('abc', []), []
        for qid in abc:
            if qid in t:
                d = destino[qid]
                qid = d[1] if d and d[0] == m else None
            if qid and qid not in novo:
                novo.append(qid)
        rel['essencial'][m] = {'antes': len(abc), 'depois': len(novo)}
        mat['essencial']['abc'] = novo
        gravar(f, mat)
    por_m = {}
    for sid, x in sorted(t.items()):
        v = [x['sub'], x['dif']] + (list(destino[sid]) if destino[sid] else [])
        por_m.setdefault(x['m'], {})[sid] = v
    alvo = os.path.join(APP, 'src', 'dados', 'questoesRetiradas.ts')
    with open(alvo, 'w', encoding='utf-8') as f:
        f.write('// Gerado por scripts/converte.py a partir de docs/provas/triagem-questoes-site.json (comando 21 do dono).\n')
        f.write('// Questões de sites didáticos que saíram do site: id -> [conteúdo, dificuldade, matéria e id da questão de prova\n')
        f.write('// equivalente (quando existe)]. O progresso do aluno nesses ids não se perde (src/estado/migracao.ts).\n')
        f.write("import type { MateriaId } from './tipos';\n\n")
        f.write('export type RetiradaBruta = [sub: string, dif: number, m?: MateriaId, id?: string];\n')
        f.write('export const RETIRADAS: Partial<Record<MateriaId, Record<string, RetiradaBruta>>> = ')
        f.write(json.dumps(por_m, ensure_ascii=False, separators=(',', ':')) + ';\n')
    return rel


def pacotes_provas(pasta):
    """Prévia publicada: provas/indice.json + provas/<id>.json com os prints embutidos (reduzidos),
    servidos ao lado do HTML e lidos sob demanda."""
    from io import BytesIO
    from PIL import Image
    destino = os.path.join(pasta, 'provas')
    os.makedirs(destino, exist_ok=True)
    indice = []
    for p in provas_fonte():
        prints = {}
        for q in p['questoes']:
            im = Image.open(os.path.join(FONTE_PROVAS, p['id'], q['print'])).convert('RGB')
            if im.width > 760:
                im = im.resize((760, round(im.height * 760 / im.width)), Image.LANCZOS)
            b = BytesIO()
            im.save(b, 'WEBP', quality=60, method=6)
            prints[q['id']] = 'data:image/webp;base64,' + base64.b64encode(b.getvalue()).decode()
        pacote = dict(p)
        pacote['prints'] = prints
        alvo = os.path.join(destino, p['id'] + '.json')
        with open(alvo, 'w', encoding='utf-8') as f:
            json.dump(pacote, f, ensure_ascii=False, separators=(',', ':'))
        indice.append(entrada_indice(p))
        print(f"  pacote {p['id']}: {os.path.getsize(alvo) / 1e6:.1f} MB")
    gravar(os.path.join(destino, 'indice.json'), indice)


def copia_comuns():
    """Logos de provas (as fontes ficam em src/assets/fontes, versionadas)."""
    os.makedirs(os.path.join(DESTINO, 'logos'), exist_ok=True)
    for f in ('fuvest.png', 'saocamilo.jpg'):
        shutil.copy(os.path.join(ORIGEM, 'design', 'logos', f), os.path.join(DESTINO, 'logos', f))


def gera_logo_ts():
    lg = ler(os.path.join(ORIGEM, 'design', 'marca', 'logo.json'))
    alvo = os.path.join(APP, 'src', 'ui', 'logo-path.ts')
    os.makedirs(os.path.dirname(alvo), exist_ok=True)
    with open(alvo, 'w', encoding='utf-8') as f:
        f.write('// Gerado por scripts/converte.py a partir de app-atual/design/marca/logo.json (logo manuscrito do APRENDICE).\n')
        f.write('export const LOGO = ' + json.dumps({'W': lg['W'], 'H': lg['H'], 'd': lg['d']}) + ' as const;\n')


def reduz(data_uri_ou_b64, larg, qual=72):
    """Só para a prévia de arquivo único: reduz a imagem (o app completo usa os arquivos originais)."""
    from io import BytesIO
    from PIL import Image
    im = Image.open(BytesIO(data_uri_bytes(data_uri_ou_b64)))
    if im.width > larg:
        im = im.resize((larg, round(im.height * larg / im.width)), Image.LANCZOS)
    out = BytesIO()
    im.save(out, 'WEBP', quality=qual, method=6)
    return base64.b64encode(out.getvalue()).decode()


def amostra():
    """Prévia de arquivo único: todas as matérias com metadados completos, mas prints/resoluções só de
    alguns conteúdos, para o HTML caber em poucos MB."""
    pacote = {'materias': {}}
    for m in MATERIAS:
        banco, materia, res, prints, icones, figuras = converte_materia(m, amostra_ids=True)
        # 2 conteúdos por matéria: os de escada mais longa no 1º módulo e num módulo do meio
        por_sub = {}
        for q in banco:
            por_sub.setdefault(q['sub'], []).append(q)
        mods = [x['id'] for x in materia['modulos']]
        escolhidos = []
        for mid in (mods[0], mods[len(mods) // 2]):
            subs = sorted((s for s in por_sub if s.startswith(mid + '.')), key=lambda s: -len(por_sub[s]))
            if subs:
                escolhidos.append(subs[0])
        ids_print = {q['id'] for s in escolhidos for q in por_sub[s][:8]}
        # questões do treino geral também (primeiras 8)
        ids_print |= set(materia['essencial'].get('abc', [])[:6])
        pacote['materias'][m] = {
            'banco': banco,
            'materia': materia,
            'res': {s: {k: v for k, v in r.items() if k in ids_print} for s, r in res.items() if any(k in ids_print for k in r)},
            'prints': {k: 'data:image/webp;base64,' + reduz(v, 680, 58) for k, v in prints.items() if k in ids_print},
            'icones': {k: reduz(v, 112, 78) for k, v in icones.items()},
            'figuras': {},
            'amostra': escolhidos,
        }
    for m in NOVAS:
        banco, materia, res, prints, icones, figuras = converte_nova(m, amostra_ids=True)
        pacote['materias'][m] = {'banco': banco, 'materia': materia, 'res': {}, 'prints': {},
                                 'icones': {k: reduz(v, 112, 78) for k, v in icones.items()}, 'figuras': {}, 'amostra': []}
    alvo = os.path.join(APP, 'src', 'previa', 'dados.json')
    gravar(alvo, pacote)
    print('amostra gravada:', alvo, round(os.path.getsize(alvo) / 1e6, 1), 'MB')


def main():
    if '--pacotes-provas' in sys.argv:
        pacotes_provas(sys.argv[sys.argv.index('--pacotes-provas') + 1])
        return
    gera_logo_ts()
    gera_icones_tema_ts()
    if AMOSTRA:
        copia_comuns()
        amostra()
        return
    os.makedirs(DESTINO, exist_ok=True)
    copia_comuns()
    relatorio = {}
    for m in MATERIAS:
        relatorio[m] = converte_materia(m)
        print(m, relatorio[m])
    for m in NOVAS:
        relatorio[m] = converte_nova(m)
        print(m, relatorio[m])
    provas = provas_fonte()
    relatorio['provas'] = copia_provas(provas)
    print('provas completas', relatorio['provas'])
    relatorio['exercicios'] = liga_provas(provas)
    print('questões das provas nos exercícios', relatorio['exercicios'])
    relatorio['questoes_de_site'] = aplica_retiradas()
    print('questões de site fora do site', relatorio['questoes_de_site'])
    gravar(os.path.join(DESTINO, 'relatorio.json'), relatorio)
    # versão do conteúdo (para cache)
    h = hashlib.md5(json.dumps(relatorio, sort_keys=True).encode()).hexdigest()[:8]
    gravar(os.path.join(DESTINO, 'versao.json'), {'versao': h})


if __name__ == '__main__':
    main()

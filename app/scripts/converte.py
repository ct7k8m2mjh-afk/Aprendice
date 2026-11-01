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

AQUI = os.path.dirname(os.path.abspath(__file__))
APP = os.path.dirname(AQUI)
ORIGEM = os.path.join(os.path.dirname(APP), 'app-atual')
DESTINO = os.path.join(APP, 'public', 'conteudo')
AMOSTRA = '--amostra' in sys.argv

MATERIAS = ['bio', 'qui', 'mat', 'por']
ESCOLA_NORMAL = {'Mundo Educacao': 'Mundo Educação', 'FMJ': 'FMJ (Jundiaí)'}
FASE_NORMAL = {'1fase': '1ª fase', '2fase': '2ª fase'}
PESSOAL = [(re.compile(r'\bVitor\b'), 'você')]


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
    banco = [questao(q) for q in d['banco']]
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

    # ícones (módulo e conteúdo)
    icones = ler(os.path.join(src, 'ic.json'))

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
        subs = sorted({q['sub'] for q in banco if q['modulo'] == mid} | {s for s in nomesub if s.split('.')[0] == mid}, key=lambda s: (s.split('.')[0], inteiro(s.split('.')[-1], 999)))
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
        ids_print = {q['id'] for s in escolhidos for q in por_sub[s][:10]}
        # questões do treino geral também (primeiras 8)
        ids_print |= set(materia['essencial'].get('abc', [])[:8])
        pacote['materias'][m] = {
            'banco': banco,
            'materia': materia,
            'res': {s: {k: v for k, v in r.items() if k in ids_print} for s, r in res.items() if any(k in ids_print for k in r)},
            'prints': {k: v for k, v in prints.items() if k in ids_print},
            'icones': icones,
            'figuras': {},
            'amostra': escolhidos,
        }
    alvo = os.path.join(APP, 'src', 'previa', 'dados.json')
    gravar(alvo, pacote)
    print('amostra gravada:', alvo, round(os.path.getsize(alvo) / 1e6, 1), 'MB')


def main():
    gera_logo_ts()
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
    gravar(os.path.join(DESTINO, 'relatorio.json'), relatorio)
    # versão do conteúdo (para cache)
    h = hashlib.md5(json.dumps(relatorio, sort_keys=True).encode()).hexdigest()[:8]
    gravar(os.path.join(DESTINO, 'versao.json'), {'versao': h})


if __name__ == '__main__':
    main()

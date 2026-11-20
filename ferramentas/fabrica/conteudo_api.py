#!/usr/bin/env python3
"""Fábrica — Conteúdo pela API do Claude (créditos do Console). Decisões do dono de 19/11/2026
(docs/resolucoes/PROMPT-FABRICA-CONTEUDO.md).

Parte 1 — flashcards e frases para completar das matérias novas (fis, his, geo, ing, fs):
  escritor (Sonnet)  ->  lente de fatos (Opus)  ->  lente didática (Opus)  ->  lente de fatos de novo no que mudou (Opus)
  Escreve 10% a mais e escolhe os 60 cartões e as 40 frases que passaram, seguindo a frequência dos conteúdos no banco.
  Saída em fabrica_saida/conteudo/conteudo-flash-<m>/final.json; só entra em app/conteudo-fonte/materias/<m>.json
  com `flash-grava`, depois da conferência do Claude Code (amostra de 20% e 100% das fontes abertas na web).

Parte 2 — "Por que eu errei" fracos (campo `erradas` que só testa a letra): ver cmd_erradas_*.

Todas as etapas em Message Batches, com estado em disco (roda de novo e continua de onde parou, sem pagar duas vezes).
Teto desta sessão: US$ 40 (parte 1 até US$ 12). Antes de cada envio o programa estima e não envia se passar do teto.
Gastos em fabrica_saida/gastos.csv (lotes conteudo-flash-<m> e conteudo-erradas-NN).

Uso:
  python3 ferramentas/fabrica/conteudo_api.py flash-roda <m> [<m> ...]
  python3 ferramentas/fabrica/conteudo_api.py flash-grava <m> <final_conferido.json>
  python3 ferramentas/fabrica/conteudo_api.py gasto
A chave vem de APRENDICE_API_KEY (ou ANTHROPIC_API_KEY). Nunca é impressa.
"""
import collections
import copy
import csv
import glob
import json
import os
import re
import sys

AQUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, AQUI)
import resolve_api as R  # noqa: E402  (funções de lote, gasto e cliente da fábrica de resoluções; não alteramos aquele arquivo)

RAIZ = R.RAIZ
SAIDA = os.path.join(RAIZ, 'fabrica_saida', 'conteudo')
R.SAIDA = SAIDA  # o estado dos lotes desta sessão fica em fabrica_saida/conteudo/<lote>/estado.json
PROVAS = os.path.join(RAIZ, 'app', 'conteudo-fonte', 'provas')
MATERIAS_FONTE = os.path.join(RAIZ, 'app', 'conteudo-fonte', 'materias')
PADRAO = os.path.join(RAIZ, 'docs', 'pesquisa', 'padrao_cartoes.md')

R.PRECOS.setdefault('claude-haiku-5-5', {'in': 0.10, 'out': 0.50, 'cache_read': 0.01})
MODELO_ESCRITOR = 'claude-sonnet-5-5'
MODELO_LENTE = 'claude-opus-5-5'

TETO_SESSAO = 40.0
TETO_PARTE1 = 12.0
NOVAS = ['fis', 'his', 'geo', 'ing', 'fs']
N_FLASH, N_FRASES = 60, 40
EXTRA = 1.10  # escreve 10% a mais para sobrar depois das remoções
TIPOS_FLASH = ['conceito', 'processo', 'comparar', 'identificar', 'formula', 'exemplo']
SITES_PROIBIDOS = ['brasilescola', 'mundoeducacao', 'preparaenem', 'infoescola', 'todamateria', 'sofisica',
                   'wikipedia', 'stoodi', 'descomplica', 'educamaisbrasil', 'guiadoestudante']


# ---------------------------------------------------------------- orçamento da sessão

def gasto_sessao(prefixo='conteudo-'):
    if not os.path.exists(R.GASTOS):
        return 0.0
    with open(R.GASTOS, encoding='utf-8') as h:
        return sum(float(r['custo_real'] or r['custo_estimado'] or 0)
                   for r in csv.DictReader(h) if r['lote'].startswith(prefixo))


def cabe(lote, est, teto):
    """Substitui R.cabe_no_orcamento: teto da parte (pelo prefixo do lote) e teto da sessão (US$ 40)."""
    sessao = gasto_sessao()
    if sessao + est > TETO_SESSAO:
        return f'teto da sessão: já gastos US$ {sessao:.2f} + estimativa US$ {est:.2f} passa de US$ {TETO_SESSAO:.2f}'
    if lote.startswith('conteudo-flash'):
        p1 = gasto_sessao('conteudo-flash')
        if p1 + est > TETO_PARTE1:
            return f'teto da parte 1: já gastos US$ {p1:.2f} + estimativa US$ {est:.2f} passa de US$ {TETO_PARTE1:.2f}'
    if R.gasto_total() + est > R.TETO_DONO:
        return f'teto do dono: a fábrica já gastou US$ {R.gasto_total():.2f}'
    return None


R.cabe_no_orcamento = cabe


# ---------------------------------------------------------------- textos

def le(f):
    return open(f, encoding='utf-8').read()


def especialista(m):
    E = os.path.join(R.AGENTES, 'especialistas')
    if m == 'fs':
        return le(os.path.join(E, 'fil.md')) + '\n\n' + le(os.path.join(E, 'soc.md'))
    return le(os.path.join(E, m + '.md'))


def monta(nome, m):
    t = le(os.path.join(R.PROMPTS, nome))
    t = t.replace('{{ESPECIALISTA}}', especialista(m)).replace('{{PADRAO_CARTOES}}', le(PADRAO))
    sobrou = re.findall(r'\{\{(\w+)\}\}', t)
    if sobrou:
        sys.exit(f'{nome}: bloco sem conteúdo: {sobrou}')
    return t


def estrutura(m):
    d = json.load(open(os.path.join(MATERIAS_FONTE, m + '.json'), encoding='utf-8'))
    return d


def frequencias(m):
    """Questões de prova por conteúdo (sub) na matéria, contadas nos prova.json."""
    c = collections.Counter()
    for f in glob.glob(os.path.join(PROVAS, '*', 'prova.json')):
        for q in json.load(open(f, encoding='utf-8')).get('questoes', []):
            if q.get('materia') == m and q.get('conteudo'):
                c[q['conteudo']] += 1
    return c


def reparte(total, pesos, minimo=1):
    """Maiores restos, com mínimo por chave."""
    soma = sum(pesos.values()) or 1
    alvo = {k: total * v / soma for k, v in pesos.items()}
    vagas = {k: max(minimo, int(alvo[k])) for k in pesos}
    for k in sorted(pesos, key=lambda k: -(alvo[k] - int(alvo[k]))):
        if sum(vagas.values()) >= total:
            break
        vagas[k] += 1
    while sum(vagas.values()) > total:
        k = max((k for k in vagas if vagas[k] > minimo), key=lambda k: vagas[k] - alvo[k])
        vagas[k] -= 1
    return vagas


def encomenda(m, n_flash, n_frases):
    """Quantos cartões e frases por tema (proporcional às questões do banco, nenhum tema com zero) e a lista de
    conteúdos de cada tema com a frequência real."""
    est, freq = estrutura(m), frequencias(m)
    temas = {mo['id']: mo for mo in est['modulos']}
    por_tema = {t: sum(freq[s['id']] for s in temas[t]['subs']) for t in temas}
    pf = reparte(n_flash, {t: max(v, 1) for t, v in por_tema.items()})
    pk = reparte(n_frases, {t: max(v, 1) for t, v in por_tema.items()})
    linhas = []
    for t in temas:
        mo = temas[t]
        linhas.append(f'\n### {t} — {mo["nome"]} ({por_tema[t]} questões no banco): {pf[t]} flashcards e {pk[t]} frases')
        for s in sorted(mo['subs'], key=lambda s: -freq[s['id']]):
            linhas.append(f'- {s["id"]} {s["nome"]}: {freq[s["id"]]} questões')
    subs = [s['id'] for mo in est['modulos'] for s in mo['subs']]
    return '\n'.join(linhas), subs, pf, pk, freq


# ---------------------------------------------------------------- esquemas

def esq_flash(subs, n):
    item = {'type': 'object', 'additionalProperties': False,
            'required': ['sub', 'tipo', 'frente', 'verso', 'essencial', 'aceita', 'erro_comum', 'peso', 'exemplo',
                         'exemplo_autoral', 'fonte'],
            'properties': {
                'sub': {'type': 'string', 'enum': subs},
                'tipo': {'type': 'string', 'enum': TIPOS_FLASH},
                'frente': {'type': 'string'}, 'verso': {'type': 'string'},
                'essencial': {'type': 'array', 'items': {'type': 'string'}},
                'aceita': {'type': 'array', 'items': {'type': 'string'}},
                'erro_comum': {'type': 'string'},
                'peso': {'type': 'integer', 'enum': [1, 2, 3]},
                'exemplo': {'type': 'string'}, 'exemplo_autoral': {'type': 'boolean'},
                'fonte': {'type': 'string'}}}
    return {'type': 'object', 'additionalProperties': False, 'required': ['cartoes'],
            'properties': {'cartoes': {'type': 'array', 'items': item}}}


def esq_frases(subs):
    item = {'type': 'object', 'additionalProperties': False,
            'required': ['sub', 'frase', 'resp', 'aceita', 'fonte'],
            'properties': {'sub': {'type': 'string', 'enum': subs}, 'frase': {'type': 'string'},
                           'resp': {'type': 'string'}, 'aceita': {'type': 'array', 'items': {'type': 'string'}},
                           'fonte': {'type': 'string'}}}
    return {'type': 'object', 'additionalProperties': False, 'required': ['frases'],
            'properties': {'frases': {'type': 'array', 'items': item}}}


def esq_veredito(vereditos, com_alerta=False):
    props = {'id': {'type': 'string'}, 'veredito': {'type': 'string', 'enum': vereditos},
             'correcoes': {'type': 'array', 'items': {
                 'type': 'object', 'additionalProperties': False, 'required': ['campo', 'depois', 'motivo'],
                 'properties': {'campo': {'type': 'string'}, 'depois': {'type': 'string'},
                                'motivo': {'type': 'string'}}}},
             'motivo': {'type': 'string'}}
    req = ['id', 'veredito', 'correcoes', 'motivo']
    if com_alerta:
        props['alerta_fato'] = {'type': 'string'}
        req.append('alerta_fato')
    return {'type': 'object', 'additionalProperties': False, 'required': ['itens'],
            'properties': {'itens': {'type': 'array', 'items': {
                'type': 'object', 'additionalProperties': False, 'required': req, 'properties': props}}}}


# ---------------------------------------------------------------- parte 1: pipeline

CAMPOS_LISTA = {'essencial', 'aceita'}
CAMPOS_FLASH = {'frente', 'verso', 'essencial', 'aceita', 'erro_comum', 'sub', 'fonte', 'exemplo', 'tipo', 'peso'}
CAMPOS_FRASE = {'frase', 'resp', 'aceita', 'sub', 'fonte'}


def aplica(item, correcoes, subs, diario, etapa):
    mudou = False
    for c in correcoes:
        campo, depois = c['campo'].strip(), c['depois']
        ok = CAMPOS_FLASH if item['_k'] == 'flash' else CAMPOS_FRASE
        if campo not in ok:
            diario.append(f'{etapa} {item["id"]}: campo ignorado {campo!r}')
            continue
        if campo in CAMPOS_LISTA:
            depois = [x.strip() for x in depois.split('|') if x.strip()]
        elif campo == 'sub' and depois not in subs:
            diario.append(f'{etapa} {item["id"]}: sub inválido {depois!r}')
            continue
        elif campo == 'peso':
            try:
                depois = int(depois)
            except ValueError:
                continue
        if item.get(campo) != depois:
            item.setdefault('_hist', []).append({'etapa': etapa, 'campo': campo, 'antes': item.get(campo),
                                                 'depois': depois, 'motivo': c.get('motivo', '')})
            item[campo] = depois
            mudou = True
    return mudou


def item_para_lente(it):
    d = {k: v for k, v in it.items() if not k.startswith('_')}
    d['tipo_item'] = 'flashcard' if it['_k'] == 'flash' else 'frase para completar'
    return d


def pedido_lente(cid, prompt, m, itens, vereditos, alerta=False, effort='high'):
    texto = ('ITENS PARA CONFERIR (matéria ' + m + '):\n```json\n'
             + json.dumps([item_para_lente(i) for i in itens], ensure_ascii=False, indent=1) + '\n```')
    return R.pedido(cid, MODELO_LENTE, monta(prompt, m), [{'type': 'text', 'text': texto}],
                    esq_veredito(vereditos, alerta), max_tokens=48000, efforto=effort)


def flash_roda(cl, m):
    lote = f'conteudo-flash-{m}'
    pasta = os.path.join(SAIDA, lote)
    os.makedirs(pasta, exist_ok=True)
    nf, nk = round(N_FLASH * EXTRA), round(N_FRASES * EXTRA)
    lista, subs, pf, pk, freq = encomenda(m, nf, nk)
    teto = TETO_PARTE1
    diario = []

    # 1 escritor
    sist = monta('conteudo-flash-escritor.md', m)
    p_flash = R.pedido('flash', MODELO_ESCRITOR, sist, [{'type': 'text', 'text':
        f'ENCOMENDA: escreva exatamente {nf} flashcards, distribuídos por tema como abaixo (dentro de cada tema, os '
        f'conteúdos com mais questões primeiro; use só os códigos de conteúdo listados).\n{lista}'}],
        esq_flash(subs, nf), max_tokens=64000, efforto='high')
    p_frases = R.pedido('frases', MODELO_ESCRITOR, sist, [{'type': 'text', 'text':
        f'ENCOMENDA: escreva exatamente {nk} frases para completar (uma lacuna "___" cada), distribuídas por tema como '
        f'abaixo (os números de frases), dentro de cada tema os conteúdos com mais questões primeiro.\n{lista}'}],
        esq_frases(subs), max_tokens=32000, efforto='high')
    res = R.roda_etapa(cl, lote, 'escritor', [p_flash, p_frases], teto)
    itens = []
    for i, c in enumerate((res.get('flash') or {}).get('cartoes', []), 1):
        c.update(_k='flash', id=f'{m}-d{i:03d}', mod=c['sub'].split('.')[0])
        itens.append(c)
    for i, c in enumerate((res.get('frases') or {}).get('frases', []), 1):
        c.update(_k='frase', id=f'{m}-k{i:03d}', mod=c['sub'].split('.')[0])
        itens.append(c)
    porid = {i['id']: i for i in itens}
    print(f'[{m}] escritor: {sum(1 for i in itens if i["_k"] == "flash")} cartões, '
          f'{sum(1 for i in itens if i["_k"] == "frase")} frases', flush=True)

    # 2 lente de fatos
    r = R.roda_etapa(cl, lote, 'fatos', [pedido_lente('fatos', 'conteudo-flash-fatos.md', m, itens,
                                                       ['ok', 'corrigir', 'remover'])], teto)
    for v in (r.get('fatos') or {}).get('itens', []):
        it = porid.get(v['id'])
        if not it:
            continue
        it['_fatos'] = v['veredito']
        if v['veredito'] == 'remover':
            it['_fora'] = 'fatos: ' + v.get('motivo', '')
        elif v['veredito'] == 'corrigir':
            aplica(it, v['correcoes'], subs, diario, 'fatos')
    sem = [i['id'] for i in itens if '_fatos' not in i]
    for i in sem:
        porid[i]['_fora'] = 'fatos: sem veredito'

    # 3 lente didática
    vivos = [i for i in itens if not i.get('_fora')]
    r = R.roda_etapa(cl, lote, 'didatica', [pedido_lente('didatica', 'conteudo-flash-didatica.md', m, vivos,
                                                          ['ok', 'melhorar', 'remover'], alerta=True)], teto)
    mudados = set()
    for v in (r.get('didatica') or {}).get('itens', []):
        it = porid.get(v['id'])
        if not it or it.get('_fora'):
            continue
        if v['veredito'] == 'remover':
            it['_fora'] = 'didática: ' + v.get('motivo', '')
            continue
        if v['veredito'] == 'melhorar' and aplica(it, v['correcoes'], subs, diario, 'didatica'):
            mudados.add(it['id'])
        if (v.get('alerta_fato') or '').strip():
            it['_alerta'] = v['alerta_fato']
            mudados.add(it['id'])
    # a lente de fatos volta em tudo que mudou desde o escritor (fatos ou didática) e nos alertas
    mudados |= {i['id'] for i in itens if i.get('_hist') and not i.get('_fora')}

    # 4 lente de fatos de novo
    alvo = [porid[i] for i in sorted(mudados) if not porid[i].get('_fora')]
    r = R.roda_etapa(cl, lote, 'fatos2', [pedido_lente('fatos2', 'conteudo-flash-fatos.md', m, alvo,
                                                        ['ok', 'corrigir', 'remover'])] if alvo else [], teto)
    vistos = set()
    for v in (r.get('fatos2') or {}).get('itens', []):
        it = porid.get(v['id'])
        if not it:
            continue
        vistos.add(it['id'])
        if v['veredito'] == 'remover':
            it['_fora'] = 'fatos2: ' + v.get('motivo', '')
        elif v['veredito'] == 'corrigir':
            aplica(it, v['correcoes'], subs, diario, 'fatos2')
            it['_corrigido_fatos2'] = True
    for it in alvo:
        if it['id'] not in vistos:
            it['_fora'] = 'fatos2: sem veredito'

    # 5 escolha: 60 cartões e 40 frases, respeitando a repartição por tema
    final = escolhe(itens, m, freq)
    json.dump({'materia': m, 'itens': itens, 'diario': diario}, open(os.path.join(pasta, 'todos.json'), 'w',
              encoding='utf-8'), ensure_ascii=False, indent=1)
    json.dump(final, open(os.path.join(pasta, 'final.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    fora = collections.Counter(i['_fora'].split(':')[0] for i in itens if i.get('_fora'))
    print(f'[{m}] final: {len(final["flash"])} cartões, {len(final["completar"])} frases · removidos {dict(fora)} · '
          f'gasto do lote US$ {R.gasto_total(lote):.2f} · sessão US$ {gasto_sessao():.2f}', flush=True)


def limpa(it):
    campos = (['id', 'mod', 'sub', 'tipo', 'frente', 'verso', 'essencial', 'aceita', 'erro_comum', 'peso', 'exemplo',
               'exemplo_autoral', 'fonte'] if it['_k'] == 'flash' else ['id', 'mod', 'sub', 'frase', 'resp', 'aceita', 'fonte'])
    d = {k: it[k] for k in campos if k in it}
    d['mod'] = d['sub'].split('.')[0]
    if it['_k'] == 'flash' and not d.get('exemplo'):
        d.pop('exemplo', None)
        d.pop('exemplo_autoral', None)
    return d


def escolhe(itens, m, freq):
    _, _, pf, pk, _ = encomenda(m, N_FLASH, N_FRASES)
    out = {}
    for k, cotas, nome in (('flash', pf, 'flash'), ('frase', pk, 'completar')):
        vivos = [i for i in itens if i['_k'] == k and not i.get('_fora')]
        por_tema = collections.defaultdict(list)
        for i in vivos:
            por_tema[i['mod']].append(i)
        for t in por_tema:  # mais frequentes primeiro
            por_tema[t].sort(key=lambda i: (-freq[i['sub']], i['id']))
        esc, sobra = [], []
        for t, n in cotas.items():
            esc += por_tema[t][:n]
            sobra += por_tema[t][n:]
        alvo = N_FLASH if k == 'flash' else N_FRASES
        sobra.sort(key=lambda i: (-freq[i['sub']], i['id']))
        esc += sobra[:max(0, alvo - len(esc))]
        esc = esc[:alvo]
        esc.sort(key=lambda i: i['id'])
        out[nome] = [limpa(i) for i in esc]
    return out


# ---------------------------------------------------------------- gravar no arquivo-fonte da matéria

def proibida(fonte):
    f = (fonte or '').lower().replace('.', '').replace('-', '')
    return any(s in f for s in SITES_PROIBIDOS)


def flash_grava(m, arq):
    final = json.load(open(arq, encoding='utf-8'))
    erros = []
    for c in final['flash'] + final['completar']:
        if proibida(c.get('fonte')):
            erros.append(f'{c["id"]}: fonte proibida {c["fonte"]}')
        if 'http' not in (c.get('fonte') or ''):
            erros.append(f'{c["id"]}: fonte sem endereço aberto na web')
    for c in final['completar']:
        if c['frase'].count('___') != 1:
            erros.append(f'{c["id"]}: a frase precisa de uma lacuna ___')
    if len(final['flash']) != N_FLASH or len(final['completar']) != N_FRASES:
        erros.append(f'quantidade: {len(final["flash"])} cartões e {len(final["completar"])} frases')
    if erros:
        sys.exit('NÃO gravado:\n' + '\n'.join(erros))
    f = os.path.join(MATERIAS_FONTE, m + '.json')
    d = json.load(open(f, encoding='utf-8'))
    d['flash'] = final['flash']
    d.setdefault('essencial', {}).setdefault('abc', [])
    d['essencial']['completar'] = final['completar']
    open(f, 'w', encoding='utf-8').write(json.dumps(d, ensure_ascii=False, indent=2) + '\n')  # formato do arquivo
    print(f'{m}: gravados {len(final["flash"])} cartões e {len(final["completar"])} frases em {f}')


# ---------------------------------------------------------------- parte 2: "Por que eu errei" fracos

FRACO = re.compile(r'não confere|não bate|não fecha|\bdaria\b|(^|[\s(:;,])dá\b', re.I)
TEM_ORIGEM = re.compile(r'\b(sai|saem|vem|vêm) d[eao]s?\b|\bquem marca\b|\bquem marcou\b|\bconfundiu\b|\btrocou\b'
                        r'|\besqueceu\b', re.I)
FEITAS = os.path.join(SAIDA, 'erradas-feitas.json')
ORDEM_MATERIAS = ['mat', 'fis', 'qui', 'geo', 'bio', 'por', 'ing', 'his', 'fs']  # mais fracos primeiro (19/11)


def fraco(t):
    return bool(FRACO.search(t or '')) and not TEM_ORIGEM.search(t or '')


def lote_mod():
    sys.path.insert(0, os.path.join(RAIZ, 'ferramentas', 'resolucoes'))
    import lote as L  # noqa
    return L


def feitas():
    return json.load(open(FEITAS, encoding='utf-8')) if os.path.exists(FEITAS) else {}


def fila():
    """Questões com erradas fracas: ENEM primeiro, depois provas-alvo (lista ALVO do lote.py), dentro disso as
    matérias com mais fracos, e por fim as demais provas."""
    L = lote_mod()
    ja = feitas()
    abertas = set()
    for f in glob.glob(os.path.join(SAIDA, 'conteudo-erradas-*', 'entrada.json')):
        abertas |= {e['id'] for e in json.load(open(f, encoding='utf-8'))}
    bancos = {}
    out = []
    for f in glob.glob(os.path.join(PROVAS, '*', 'resolucoes-*.json')):
        prova = os.path.basename(os.path.dirname(f))
        m = f.rsplit('resolucoes-', 1)[1][:-5]
        if m not in bancos:
            bancos[m] = {q['id']: q for q in json.load(open(os.path.join(R.PUB, m, 'banco.json'), encoding='utf-8'))}
        for qid, v in json.load(open(f, encoding='utf-8')).items():
            if qid in ja or qid in abertas or qid not in bancos[m]:
                continue
            er = (v.get('resolucao') or {}).get('erradas') or {}
            fr = sorted(k for k, t in er.items() if fraco(t))
            if not fr:
                continue
            q = bancos[m][qid]
            base = 0 if q['escola'] == 'ENEM' else (1 if q['escola'] in L.ALVO else 2)
            alvo = L.ALVO.index(q['escola']) if q['escola'] in L.ALVO else len(L.ALVO)
            out.append(((base, ORDEM_MATERIAS.index(m) if m in ORDEM_MATERIAS else 9, alvo, -int(q.get('ano') or 0),
                         prova, int(re.sub(r'\D', '', str(q.get('n'))) or 0)), m, qid, prova, fr))
    out.sort()
    return out


def proximo_lote():
    ns = [int(x.rsplit('-', 1)[1]) for x in glob.glob(os.path.join(SAIDA, 'conteudo-erradas-*')) if x[-2:].isdigit()]
    return f'conteudo-erradas-{(max(ns) + 1 if ns else 1):02d}'


def erradas_abre(n, so_materia=None):
    """Abre um lote de uma matéria só (o prompt de sistema leva o especialista da matéria: o cache vale no lote)."""
    L = lote_mod()
    f = fila()
    if not f:
        sys.exit('nada na fila')
    m = so_materia or f[0][1]
    base_max = int(os.environ.get('BASE_MAX', '2'))  # 0 = só ENEM; 1 = ENEM e provas-alvo
    esc = [x for x in f if x[1] == m and x[0][0] <= base_max][:n]
    if not esc:
        sys.exit(f'nada na fila de {m} até a faixa {base_max}')
    banco = {q['id']: q for q in json.load(open(os.path.join(R.PUB, m, 'banco.json'), encoding='utf-8'))}
    lote = proximo_lote()
    entradas = []
    for _, m_, qid, prova, fr in esc:
        e = L.entrada(m, [banco[qid]])[0]
        res = json.load(open(os.path.join(PROVAS, prova, f'resolucoes-{m}.json'), encoding='utf-8'))[qid]
        e.update(materia=m, prova_dir=prova, fracas=fr, resolucao_atual=res.get('resolucao'),
                 equivocos_atuais=res.get('equivocos') or {})
        e.pop('ocr_do_print', None)
        entradas.append(e)
    os.makedirs(os.path.join(SAIDA, lote), exist_ok=True)
    json.dump(entradas, open(os.path.join(SAIDA, lote, 'entrada.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(f'{lote}: {len(entradas)} questões de {m} ({sum(len(e["fracas"]) for e in entradas)} letras fracas) · '
          f'na fila ainda {len(f) - len(entradas)}')
    return lote


def dados_q(e, com_resolucao=True):
    d = {k: e[k] for k in ('id', 'prova', 'conteudo', 'nivel', 'gabarito_oficial', 'letras', 'texto_da_prova',
                           'alternativas', 'sobre_a_prova', 'nota_gabarito') if e.get(k) not in (None, '')}
    if com_resolucao:
        d['resolucao_atual'] = e['resolucao_atual']
    return d


def conteudo_q(e, extra, imagem=True):
    partes = [R.imagem(e['print'])] if imagem else []
    partes.append({'type': 'text', 'text': ('PRINT DA PROVA acima (é a questão; vale sobre o texto transcrito).\n\n'
                                            if imagem else '') + extra})
    return partes


def esq_letras(campos):
    props = {'letra': {'type': 'string', 'enum': R.LETRAS}}
    props.update({c: ({'type': 'string', 'enum': v} if isinstance(v, list) else {'type': 'string'})
                  for c, v in campos.items()})
    return {'type': 'object', 'additionalProperties': False, 'required': ['nota_questao', 'letras'],
            'properties': {'nota_questao': {'type': 'string'}, 'letras': {'type': 'array', 'items': {
                'type': 'object', 'additionalProperties': False, 'required': list(props), 'properties': props}}}}


ESQ_ESCRITOR = esq_letras({'acao': ['reescrever', 'manter'], 'texto': '', 'equivoco': ''})
ESQ_FATOS = esq_letras({'veredito': ['ok', 'corrigir', 'rejeitar'], 'depois': '', 'equivoco': '', 'motivo': ''})
ESQ_DIDATICA = esq_letras({'veredito': ['ok', 'melhorar'], 'depois': '', 'alerta_fato': ''})


def pede_fatos(cid, e, novas, sist):
    txt = ('DADOS DA QUESTÃO (com o gabarito oficial e a resolução atual):\n```json\n'
           + json.dumps(dados_q(e), ensure_ascii=False, indent=1) + '\n```\n\nTEXTOS REESCRITOS PARA CONFERIR '
           '(letra: texto | código de equívoco):\n```json\n'
           + json.dumps({k: {'texto': v['texto'], 'equivoco': v['equivoco']} for k, v in novas.items()},
                        ensure_ascii=False, indent=1) + '\n```')
    return R.pedido(cid, MODELO_LENTE, sist, conteudo_q(e, txt), ESQ_FATOS, max_tokens=24000, efforto='high')


def erradas_roda(cl, lote, teto):
    pasta = os.path.join(SAIDA, lote)
    ents = json.load(open(os.path.join(pasta, 'entrada.json'), encoding='utf-8'))
    m = ents[0]['materia']
    porid = {e['id']: e for e in ents}
    diario = []

    # 1 escritor (Sonnet)
    sist = monta('conteudo-erradas-escritor.md', m)
    peds = []
    for e in ents:
        fr = {k: {'texto_atual': e['resolucao_atual']['erradas'][k], 'equivoco_atual': e['equivocos_atuais'].get(k, '')}
              for k in e['fracas']}
        txt = ('DADOS DA QUESTÃO (com o gabarito oficial e a resolução atual inteira):\n```json\n'
               + json.dumps(dados_q(e), ensure_ascii=False, indent=1) + '\n```\n\nLETRAS FRACAS PARA REESCREVER:\n```json\n'
               + json.dumps(fr, ensure_ascii=False, indent=1) + '\n```')
        peds.append(R.pedido(e['id'], MODELO_ESCRITOR, sist, conteudo_q(e, txt), ESQ_ESCRITOR, max_tokens=16000,
                             efforto='high'))
    res = R.roda_etapa(cl, lote, 'escritor', peds, teto)
    novas = {}
    for qid, r in res.items():
        e = porid[qid]
        for x in r.get('letras', []):
            k = x['letra']
            if k not in e['fracas'] or x['acao'] != 'reescrever' or not x['texto'].strip():
                continue
            if fraco(x['texto']):
                diario.append(f'escritor {qid} {k}: ainda fraco, descartado')
                continue
            novas.setdefault(qid, {})[k] = {'texto': x['texto'].strip(), 'equivoco': x['equivoco'].strip(),
                                            'antes': e['resolucao_atual']['erradas'][k], 'hist': ['escritor']}

    # 2 lente de fatos (Opus)
    sist_f = monta('conteudo-erradas-fatos.md', m)

    def aplica_fatos(rr, etapa):
        for qid, r in rr.items():
            for x in r.get('letras', []):
                k = x['letra']
                if k not in novas.get(qid, {}):
                    continue
                n = novas[qid][k]
                n[etapa] = x['veredito']
                if x['veredito'] == 'rejeitar':
                    n['fora'] = f'{etapa}: ' + x.get('motivo', '')
                elif x['veredito'] == 'corrigir' and x['depois'].strip():
                    n['texto'] = x['depois'].strip()
                    if x['equivoco'].strip():
                        n['equivoco'] = x['equivoco'].strip()
                    n['hist'].append(etapa)
                    n['mudou_' + etapa] = True
            if r.get('nota_questao', '').strip():
                diario.append(f'{etapa} {qid}: {r["nota_questao"].strip()[:300]}')

    rr = R.roda_etapa(cl, lote, 'fatos', [pede_fatos(q, porid[q], v, sist_f) for q, v in novas.items()], teto)
    aplica_fatos(rr, 'fatos')
    for qid, v in novas.items():
        for k, n in v.items():
            if 'fatos' not in n:
                n['fora'] = 'fatos: sem veredito'

    # 3 lente didática (Opus, sem o print: só o texto)
    sist_d = monta('conteudo-erradas-didatica.md', m)
    peds = []
    for qid, v in novas.items():
        vivos = {k: n['texto'] for k, n in v.items() if not n.get('fora')}
        if not vivos:
            continue
        txt = ('DADOS DA QUESTÃO:\n```json\n' + json.dumps(dados_q(porid[qid], com_resolucao=False), ensure_ascii=False,
                                                           indent=1)
               + '\n```\n\nTEXTOS "POR QUE EU ERREI" PARA MELHORAR (letra: texto):\n```json\n'
               + json.dumps(vivos, ensure_ascii=False, indent=1) + '\n```')
        peds.append(R.pedido(qid, MODELO_LENTE, sist_d, conteudo_q(porid[qid], txt, imagem=False), ESQ_DIDATICA,
                             max_tokens=12000, efforto='medium'))
    rd = R.roda_etapa(cl, lote, 'didatica', peds, teto)
    volta = {}
    for qid, r in rd.items():
        for x in r.get('letras', []):
            n = novas.get(qid, {}).get(x['letra'])
            if not n or n.get('fora'):
                continue
            if x['veredito'] == 'melhorar' and x['depois'].strip() and x['depois'].strip() != n['texto']:
                if fraco(x['depois']):
                    continue
                n['texto'] = x['depois'].strip()
                n['hist'].append('didatica')
                volta.setdefault(qid, {})[x['letra']] = n
            if x.get('alerta_fato', '').strip():
                n['alerta'] = x['alerta_fato'].strip()
                volta.setdefault(qid, {})[x['letra']] = n
    # a lente de fatos volta em tudo que mudou depois dela (didática) e nos alertas
    rr = R.roda_etapa(cl, lote, 'fatos2', [pede_fatos(q, porid[q], v, sist_f) for q, v in volta.items()], teto)
    aplica_fatos(rr, 'fatos2')
    for qid, v in volta.items():
        for k, n in v.items():
            if 'fatos2' not in n and not n.get('fora'):
                n['fora'] = 'fatos2: sem veredito'

    final = {qid: {k: {'texto': n['texto'], 'equivoco': n['equivoco'], 'antes': n['antes']} for k, n in v.items()
                   if not n.get('fora') and not fraco(n['texto'])} for qid, v in novas.items()}
    final = {q: v for q, v in final.items() if v}
    json.dump({'novas': novas, 'diario': diario}, open(os.path.join(pasta, 'todos.json'), 'w', encoding='utf-8'),
              ensure_ascii=False, indent=1)
    json.dump(final, open(os.path.join(pasta, 'final.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    nl = sum(len(e['fracas']) for e in ents)
    print(f'{lote} ({m}): {len(final)} de {len(ents)} questões com texto novo · {sum(len(v) for v in final.values())} '
          f'de {nl} letras fracas reescritas · gasto do lote US$ {R.gasto_total(lote):.2f} · sessão US$ '
          f'{gasto_sessao():.2f}', flush=True)


def erradas_grava(lote, arq=None):
    """Merge campo a campo em app/conteudo-fonte/provas/<prova>/resolucoes-<m>.json: só erradas[<letra>] e
    equivocos[<letra>]. Rode `git pull --rebase` antes."""
    pasta = os.path.join(SAIDA, lote)
    ents = {e['id']: e for e in json.load(open(os.path.join(pasta, 'entrada.json'), encoding='utf-8'))}
    final = json.load(open(arq or os.path.join(pasta, 'final.json'), encoding='utf-8'))
    por_arq = collections.defaultdict(dict)
    for qid, v in final.items():
        e = ents[qid]
        por_arq[os.path.join(PROVAS, e['prova_dir'], f'resolucoes-{e["materia"]}.json')][qid] = v
    n = 0
    for f, qs in por_arq.items():
        d = json.load(open(f, encoding='utf-8'))
        for qid, v in qs.items():
            r = d[qid]
            for k, x in v.items():
                if r['resolucao']['erradas'].get(k) != x['antes']:
                    print(f'   {qid} {k}: o texto atual mudou desde a abertura do lote; não mexo')
                    continue
                r['resolucao']['erradas'][k] = x['texto']
                if x.get('equivoco') and re.match(r'^[A-Z]\d\d(\.\d+)?:[a-z0-9-]+$', x['equivoco']):
                    r.setdefault('equivocos', {})[k] = x['equivoco']
                n += 1
        tmp = f + '.tmp'
        json.dump(d, open(tmp, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
        os.replace(tmp, f)
    fe = feitas()
    for qid in ents:
        fe[qid] = lote
    json.dump(fe, open(FEITAS, 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
    print(f'{lote}: {n} letras gravadas em {len(por_arq)} arquivos')


def flash_junta(m):
    """Junta parte*.conferido.json (conferência do Claude Code com web) ao final.json. Item removido é trocado por um
    reserva do mesmo tema (que vai para reservas.json e precisa da mesma conferência). Grava final_conferido.json."""
    pasta = os.path.join(SAIDA, f'conteudo-flash-{m}')
    final = json.load(open(os.path.join(pasta, 'final.json'), encoding='utf-8'))
    conf = {}
    for f in sorted(glob.glob(os.path.join(pasta, 'parte*.conferido.json')) + glob.glob(os.path.join(pasta, 'reservas*.conferido.json'))):
        for c in json.load(open(f, encoding='utf-8')):
            conf[c['id']] = c
    todos = {i['id']: i for i in json.load(open(os.path.join(pasta, 'todos.json'), encoding='utf-8'))['itens']}
    usados = {i['id'] for i in final['flash'] + final['completar']}
    out, faltam, erros_am, n_am = {'flash': [], 'completar': []}, [], [], 0
    reservas_usadas = set()
    for nome in ('flash', 'completar'):
        for it in final[nome] + [limpa(todos[r]) for r in sorted(conf) if r not in usados and r in todos
                                  and (todos[r]['_k'] == 'flash') == (nome == 'flash')]:
            c = conf.get(it['id'])
            if c is None:
                faltam.append(it['id'])
                continue
            if it['id'] not in usados:
                reservas_usadas.add(it['id'])
            if c.get('erro_amostra'):
                erros_am.append(f'{it["id"]}: {c["erro_amostra"]}')
            if c.get('remover'):
                continue
            it = dict(it)
            it.update(c.get('correcoes') or {})
            it['fonte'] = c['fonte']
            it['mod'] = it['sub'].split('.')[0]
            out[nome].append(it)
    alvo = {'flash': N_FLASH, 'completar': N_FRASES}
    precisa = {k: alvo[k] - len(out[k]) for k in out}
    json.dump(out, open(os.path.join(pasta, 'final_conferido.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(f'{m}: {len(out["flash"])} cartões e {len(out["completar"])} frases conferidos · sem conferência: {faltam} · '
          f'faltam {precisa} · erros de conteúdo achados na amostra: {len(erros_am)}')
    for e in erros_am:
        print('   ', e)
    if any(v > 0 for v in precisa.values()):
        # reservas: itens que passaram pelas lentes e ficaram fora da escolha, do tema mais frequente primeiro
        freq = frequencias(m)
        cand = [i for i in todos.values() if not i.get('_fora') and i['id'] not in usados and i['id'] not in conf]
        cand.sort(key=lambda i: (-freq[i['sub']], i['id']))
        res = []
        for k, n in precisa.items():
            res += [dict(limpa(i), amostra=True) for i in cand if (i['_k'] == 'flash') == (k == 'flash')][:max(0, n)]
        if res:
            f = os.path.join(pasta, f'reservas{len(glob.glob(os.path.join(pasta, "reservas*.json")))}.json')
            json.dump(res, open(f, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
            print(f'   reservas para conferir: {f} ({len(res)} itens)')
        else:
            print('   sem reservas suficientes: escrever mais itens')


def flash_extra(cl, m, n_frases, rodada=1):
    """Escreve frases extras (sem repetir nenhum cartão nem frase já escritos) e passa pelas mesmas lentes."""
    lote = f'conteudo-flash-{m}'
    pasta = os.path.join(SAIDA, lote)
    T = json.load(open(os.path.join(pasta, 'todos.json'), encoding='utf-8'))
    itens = T['itens']
    lista, subs, pf, pk, freq = encomenda(m, N_FLASH, N_FRASES)
    vivos = [i for i in itens if not i.get('_fora')]
    ja = '\n'.join('- ' + (i.get('frente', '') + ' -> ' + i.get('verso', '') if i['_k'] == 'flash'
                           else i['frase'] + ' -> ' + i['resp']) for i in vivos)
    tem = collections.Counter(i['mod'] for i in vivos if i['_k'] == 'frase')
    falta = {t: max(0, pk[t] - tem[t]) for t in pk}
    pedido_txt = '\n'.join(f'- {t}: {v} frases' for t, v in falta.items() if v)
    sist = monta('conteudo-flash-escritor.md', m)
    p = R.pedido('frases', MODELO_ESCRITOR, sist, [{'type': 'text', 'text':
        f'ENCOMENDA: escreva exatamente {n_frases} frases para completar NOVAS, distribuídas assim:\n{pedido_txt}\n\n'
        f'Conteúdos e frequência:\n{lista}\n\nJÁ EXISTEM (não repita a ideia nem a resposta de nenhum destes; a frase '
        f'nova precisa cobrar outro fato):\n{ja}'}], esq_frases(subs), max_tokens=32000, efforto='high')
    et = f'extra{rodada}'
    res = R.roda_etapa(cl, lote, et + '-escritor', [p], TETO_PARTE1)
    base = max(int(i['id'].rsplit('k', 1)[1]) for i in itens if i['_k'] == 'frase')
    novos = []
    for j, c in enumerate((res.get('frases') or {}).get('frases', []), 1):
        c.update(_k='frase', id=f'{m}-k{base + j:03d}', mod=c['sub'].split('.')[0])
        novos.append(c)
    porid = {i['id']: i for i in novos}
    diario = T['diario']
    contexto = [i for i in vivos]  # a lente vê o que já existe, para apontar repetição
    def lente(etapa, prompt, alvo, vereditos, alerta=False):
        txt = ('JÁ APROVADOS (só contexto, NÃO avalie): \n' + ja + '\n\n')
        q = pedido_lente(etapa, prompt, m, alvo, vereditos, alerta)
        q['params']['messages'][0]['content'][0]['text'] = txt + q['params']['messages'][0]['content'][0]['text']
        return R.roda_etapa(cl, lote, f'{et}-{etapa}', [q], TETO_PARTE1).get(etapa) or {}
    for v in lente('fatos', 'conteudo-flash-fatos.md', novos, ['ok', 'corrigir', 'remover']).get('itens', []):
        it = porid.get(v['id'])
        if it:
            it['_fatos'] = v['veredito']
            if v['veredito'] == 'remover':
                it['_fora'] = 'fatos: ' + v['motivo']
            elif v['veredito'] == 'corrigir':
                aplica(it, v['correcoes'], subs, diario, 'fatos')
    for i in novos:
        if '_fatos' not in i:
            i['_fora'] = 'fatos: sem veredito'
    vv = [i for i in novos if not i.get('_fora')]
    mud = set()
    for v in lente('didatica', 'conteudo-flash-didatica.md', vv, ['ok', 'melhorar', 'remover'], True).get('itens', []):
        it = porid.get(v['id'])
        if not it or it.get('_fora'):
            continue
        if v['veredito'] == 'remover':
            it['_fora'] = 'didática: ' + v['motivo']
        elif v['veredito'] == 'melhorar' and aplica(it, v['correcoes'], subs, diario, 'didatica'):
            mud.add(it['id'])
        if (v.get('alerta_fato') or '').strip():
            mud.add(it['id'])
    mud |= {i['id'] for i in novos if i.get('_hist') and not i.get('_fora')}
    alvo = [porid[i] for i in sorted(mud) if not porid[i].get('_fora')]
    if alvo:
        vistos = set()
        for v in lente('fatos2', 'conteudo-flash-fatos.md', alvo, ['ok', 'corrigir', 'remover']).get('itens', []):
            it = porid.get(v['id'])
            if it:
                vistos.add(it['id'])
                if v['veredito'] == 'remover':
                    it['_fora'] = 'fatos2: ' + v['motivo']
                elif v['veredito'] == 'corrigir':
                    aplica(it, v['correcoes'], subs, diario, 'fatos2')
        for it in alvo:
            if it['id'] not in vistos:
                it['_fora'] = 'fatos2: sem veredito'
    itens += novos
    final = escolhe(itens, m, freq)
    json.dump(T, open(os.path.join(pasta, 'todos.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    json.dump(final, open(os.path.join(pasta, 'final.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(f'[{m}] extra: {len(novos)} frases novas, {sum(1 for i in novos if not i.get("_fora"))} passaram · final: '
          f'{len(final["flash"])} cartões, {len(final["completar"])} frases · sessão US$ {gasto_sessao():.2f}', flush=True)


def erradas_amostra(lote, frac=0.2):
    """Sorteia ~20% das questões com texto novo para a conferência do Claude Code (agentes): amostra.json."""
    import random
    pasta = os.path.join(SAIDA, lote)
    ents = {e['id']: e for e in json.load(open(os.path.join(pasta, 'entrada.json'), encoding='utf-8'))}
    final = json.load(open(os.path.join(pasta, 'final.json'), encoding='utf-8'))
    random.seed('amostra-' + lote)
    ids = sorted(final)
    esc = random.sample(ids, max(1, round(len(ids) * frac))) if ids else []
    am = [dict(dados_q(ents[q]), print=ents[q]['print'], novas={k: {'texto': v['texto'], 'equivoco': v['equivoco']}
                                                                for k, v in final[q].items()}) for q in sorted(esc)]
    json.dump(am, open(os.path.join(pasta, 'amostra.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(f'{lote}: amostra de {len(am)} questões ({sum(len(a["novas"]) for a in am)} letras) de {len(ids)}')


def erradas_aplica(lote):
    """Aplica amostra.conferido.json ao final.json (conserto ou descarte da letra) e mede o erro da amostra."""
    pasta = os.path.join(SAIDA, lote)
    final = json.load(open(os.path.join(pasta, 'final.json'), encoding='utf-8'))
    conf = json.load(open(os.path.join(pasta, 'amostra.conferido.json'), encoding='utf-8'))
    n = erros = cons = desc = 0
    for q, ls in conf.items():
        for k, c in ls.items():
            if q not in final or k not in final[q]:
                continue
            n += 1
            if c.get('ok'):
                continue
            erros += 1
            if (c.get('texto') or '').strip() and not fraco(c['texto']):
                final[q][k]['texto'] = c['texto'].strip()
                cons += 1
            else:
                del final[q][k]
                desc += 1
        if q in final and not final[q]:
            del final[q]
    json.dump(final, open(os.path.join(pasta, 'final.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(f'{lote}: amostra {n} letras, {erros} com erro ({cons} consertadas, {desc} descartadas)')
    return n, erros


def main():
    a = sys.argv[1:]
    if not a or a[0] == 'gasto':
        print(f'sessão US$ {gasto_sessao():.2f} (teto {TETO_SESSAO}) · parte 1 US$ {gasto_sessao("conteudo-flash"):.2f} '
              f'(teto {TETO_PARTE1}) · parte 2 US$ {gasto_sessao("conteudo-erradas"):.2f} · fábrica US$ {R.gasto_total():.2f}')
        return
    if a[0] == 'flash-roda':
        cl = R.cliente()
        for m in a[1:]:
            flash_roda(cl, m)
    elif a[0] == 'flash-extra':
        flash_extra(R.cliente(), a[1], int(a[2]), int(a[3]) if len(a) > 3 else 1)
    elif a[0] == 'flash-junta':
        flash_junta(a[1])
    elif a[0] == 'flash-grava':
        flash_grava(a[1], a[2])
    elif a[0] == 'erradas-fila':
        f = fila()
        print(len(f), 'questões na fila;', collections.Counter((x[0][0], x[1]) for x in f).most_common(12))
    elif a[0] == 'erradas-abre':
        erradas_abre(int(a[1]), a[2] if len(a) > 2 else None)
    elif a[0] == 'erradas-roda':
        erradas_roda(R.cliente(), a[1], float(a[2]) if len(a) > 2 else 10.0)
    elif a[0] == 'erradas-amostra':
        for l in a[1:]:
            erradas_amostra(l)
    elif a[0] == 'erradas-aplica':
        erradas_aplica(a[1])
    elif a[0] == 'erradas-grava':
        erradas_grava(a[1], a[2] if len(a) > 2 else None)
    elif a[0] == 'encomenda':
        print(encomenda(a[1], N_FLASH, N_FRASES)[0])
    else:
        sys.exit(f'comando desconhecido: {a[0]}')


if __name__ == '__main__':
    main()

#!/usr/bin/env python3
"""Fábrica — Classificação: confere pela API se cada questão de prova está no conteúdo (subtema) certo.

Pedido do dono (19/11/2026); prompt da sessão em docs/resolucoes/PROMPT-FABRICA-CLASSIFICACAO.md.

Regra: o conteúdo é o que o COMANDO da questão cobra do aluno, não o assunto do texto de apoio.

Etapas (todas em Message Batches, estado em disco: rodar de novo continua de onde parou, sem pagar duas vezes):
  triagem   claude-haiku-5-5  vê a classificação atual; dá conteúdo, confiança e, se nada servir, sugestão de novo
  confere   claude-opus-5-5   às cegas (sem a atual e sem a triagem); só onde a triagem discordou, ficou em
                              confiança baixa ou sugeriu conteúdo novo
  desempate claude-opus-5-5   às cegas, escolhe entre as opções (sem dizer de quem é cada uma); só onde a
                              triagem, a conferência e a atual não fecham

Uso:
  python3 ferramentas/fabrica/classifica_api.py universo                  # lista o que entra (sem API)
  python3 ferramentas/fabrica/classifica_api.py lote <nome> --ids a,b | --materia por [--de N --ate M] | --piloto 300
  python3 ferramentas/fabrica/classifica_api.py roda <nome> [--modo completo|economico]   # em segundo plano
  python3 ferramentas/fabrica/classifica_api.py decide <nome>             # decisão (sem API)
  python3 ferramentas/fabrica/classifica_api.py aplica <nome>             # grava nos prova.json
  python3 ferramentas/fabrica/classifica_api.py gasto

A chave vem de APRENDICE_API_KEY e nunca é impressa nem gravada.
"""
import argparse
import base64
import csv
import datetime
import glob
import hashlib
import io
import json
import os
import random
import re
import sys
import time

RAIZ = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
FONTE = os.path.join(RAIZ, 'app', 'conteudo-fonte')
PUB = os.path.join(RAIZ, 'app', 'public', 'conteudo')
PROMPTS = os.path.join(RAIZ, 'ferramentas', 'fabrica', 'prompts')
TAXONOMIA = os.path.join(RAIZ, 'ferramentas', 'fabrica', 'agentes', 'TAXONOMIA.md')
SAIDA = os.path.join(RAIZ, 'fabrica_saida', 'classificacao')
GASTOS = os.path.join(RAIZ, 'fabrica_saida', 'gastos.csv')

MATERIAS = ['bio', 'qui', 'mat', 'por', 'fis', 'his', 'geo', 'ing', 'fs']
NOME_MATERIA = {'bio': 'Biologia', 'qui': 'Química', 'mat': 'Matemática', 'por': 'Português',
                'fis': 'Física', 'his': 'História', 'geo': 'Geografia', 'ing': 'Inglês',
                'fs': 'Filosofia e Sociologia'}
PREFIXO = {'B': 'bio', 'Q': 'qui', 'M': 'mat', 'P': 'por', 'F': 'fis', 'H': 'his', 'G': 'geo',
           'I': 'ing', 'L': 'fs', 'S': 'fs'}

# Preços por milhão de tokens (skill claude-api, tabela de 03/11/2026, consultada em 19/11/2026).
# Batches = metade. Escrita de cache = 1,25 x entrada; leitura = valor abaixo.
PRECOS = {
    'claude-haiku-5-5': {'in': 0.10, 'out': 0.50, 'cache_read': 0.01},
    'claude-sonnet-5-5': {'in': 2.00, 'out': 10.00, 'cache_read': 0.10},
    'claude-opus-5-5': {'in': 4.00, 'out': 20.00, 'cache_read': 0.20},
}
MODELO = {'triagem': 'claude-haiku-5-5', 'confere': 'claude-sonnet-5-5', 'desempate': 'claude-opus-5-5'}
ESFORCO = {'triagem': 'medium', 'confere': 'low', 'desempate': 'medium'}
MAX_TOKENS = {'triagem': 4000, 'confere': 6000, 'desempate': 8000}
TETO = 60.0            # teto deste trabalho (dono, 19/11/2026)
LADO_MAXIMO = 8000     # a API recusa imagem com lado maior
BYTES_POR_BATCH = 150_000_000   # limite da API: 256 MB por batch


# ---------------------------------------------------------------- dados

def ler(f):
    with open(f, encoding='utf-8') as h:
        return json.load(h)


def gravar(f, d):
    os.makedirs(os.path.dirname(f), exist_ok=True)
    tmp = f + '.tmp'
    with open(tmp, 'w', encoding='utf-8') as h:
        json.dump(d, h, ensure_ascii=False, indent=1)
        h.write('\n')
    os.replace(tmp, f)


def taxonomia():
    """{codigo: (materia, nome, codigo_tema, nome_tema)} a partir dos materia.json publicados."""
    t = {}
    for m in MATERIAS:
        for mo in ler(os.path.join(PUB, m, 'materia.json'))['modulos']:
            for s in mo['subs']:
                t[s['id']] = (m, s['nome'], mo['id'], mo['nome'])
    return t


# Grupos de matérias vizinhas. A conferência e o desempate não recebem a lista inteira (593 conteúdos, ~17 mil
# tokens): recebem a lista das matérias do grupo da questão e do grupo que a triagem apontou. Medido no piloto:
# a lista inteira era um terço do custo de cada pedido da conferência.
GRUPO = {'bio': ['bio', 'qui', 'fis'], 'qui': ['bio', 'qui', 'fis'], 'fis': ['fis', 'mat', 'qui'],
         'mat': ['mat', 'fis'], 'his': ['his', 'geo', 'fs'], 'geo': ['geo', 'his', 'fs'],
         'fs': ['fs', 'his', 'geo'], 'por': ['por', 'ing'], 'ing': ['ing', 'por']}


def candidatas(*ms):
    out = []
    for m in ms:
        for x in GRUPO.get(m, []):
            if x not in out:
                out.append(x)
    return [m for m in MATERIAS if m in out]


def lista_conteudos(materias=None):
    linhas = []
    for m in (materias or MATERIAS):
        linhas.append(f'\n### {m} — {NOME_MATERIA[m]}')
        for mo in ler(os.path.join(PUB, m, 'materia.json'))['modulos']:
            subs = '; '.join(f"{s['id']} {s['nome']}" for s in mo['subs'])
            linhas.append(f"- {mo['id']} {mo['nome']}: {subs}")
    return '\n'.join(linhas).strip()


def notas_taxonomia():
    t = open(TAXONOMIA, encoding='utf-8').read()
    # o parágrafo de notas fica entre o cabeçalho e a primeira matéria
    corpo = t.split('\n## ')[0]
    pars = [p.strip() for p in corpo.split('\n\n') if p.strip() and not p.startswith('#')
            and not p.startswith('Use estes ids')]
    return '\n\n'.join(pars)


def sistema(materias=None, sem_lista=False):
    t = open(os.path.join(PROMPTS, 'classifica-sistema.md'), encoding='utf-8').read()
    if sem_lista:
        lista = ('(No desempate a lista não vem: as opções em disputa vêm descritas na mensagem, com o nome do '
                 'conteúdo, da matéria e do tema.)')
    elif materias:
        lista = ('Estas são as matérias candidatas a esta questão (' + ', '.join(materias) + '); a lista traz '
                 'todos os conteúdos delas. Se a questão for de outra das 9 matérias, use essa matéria em '
                 '`materia` e o conteúdo mais próximo desta lista em `conteudo`.\n\n' + lista_conteudos(materias))
    else:
        lista = lista_conteudos()
    t = t.replace('{{NOTAS_TAXONOMIA}}', notas_taxonomia()).replace('{{LISTA_CONTEUDOS}}', lista)
    assert '{{' not in t
    return t


def fora_do_trabalho():
    ids = set()
    for f in ['indisponiveis.json', 'anuladas-aprendice.json', 'outra-materia.json']:
        ids |= set(ler(os.path.join(FONTE, f))['questoes'])
    return ids


def universo():
    """Todas as questões que entram: id -> dados mínimos para o pedido."""
    excl = fora_do_trabalho()
    u = {}
    for f in sorted(glob.glob(os.path.join(FONTE, 'provas', '*', 'prova.json'))):
        d = ler(f)
        anul = set((d.get('fora') or {}).get('anuladas') or [])
        pasta = os.path.basename(os.path.dirname(f))
        for q in d['questoes']:
            if q['id'] in excl or q['n'] in anul:
                continue
            u[q['id']] = {'id': q['id'], 'prova': pasta, 'titulo': d.get('titulo', pasta), 'n': q['n'],
                          'area': q.get('area', ''), 'materia': q['materia'], 'tema': q['tema'],
                          'conteudo': q['conteudo'], 'print': os.path.join(os.path.dirname(f), q['print']),
                          'texto': q.get('texto') or ''}
    return u


def suspeitas():
    """Ids apontados pelo verificador (equivocos_fora): prefixos dos equívocos que discordam entre si ou do conteúdo."""
    s = set()
    for f in glob.glob(os.path.join(FONTE, 'provas', '*', 'prova.json')):
        cont = {q['id']: q['conteudo'] for q in ler(f)['questoes']}
        for r in glob.glob(os.path.join(os.path.dirname(f), 'resolucoes-*.json')):
            for qid, v in ler(r).items():
                eq = v.get('equivocos') if isinstance(v, dict) else None
                if not isinstance(eq, dict) or not eq or qid not in cont:
                    continue
                cods = {str(x).split(':')[0] for x in eq.values()}
                if len(cods) > 1 or cods.pop() != cont[qid]:
                    s.add(qid)
    return s


# ---------------------------------------------------------------- pedidos

_cache_img = {}


def imagem(caminho):
    if caminho in _cache_img:
        return _cache_img[caminho]
    ext = os.path.splitext(caminho)[1].lower()
    media = {'.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg'}[ext]
    dados = open(caminho, 'rb').read()
    from PIL import Image
    with Image.open(io.BytesIO(dados)) as im:
        maior = max(im.size)
        if maior > LADO_MAXIMO:
            # reduz sem perda (PNG): print é texto
            f = (LADO_MAXIMO * 0.99) / maior
            novo = (max(1, round(im.width * f)), max(1, round(im.height * f)))
            buf = io.BytesIO()
            im.convert('RGB').resize(novo, Image.LANCZOS).save(buf, format='PNG')
            dados, media = buf.getvalue(), 'image/png'
    b = {'type': 'image', 'source': {'type': 'base64', 'media_type': media,
                                     'data': base64.standard_b64encode(dados).decode()}}
    return b


def esquema(codigos, opcoes=None):
    if opcoes is not None:
        # enum fixo (posição da opção): o esquema entra no prefixo do pedido, e um esquema por questão
        # quebraria o cache de prompt (foi o que aconteceu no piloto: 35 escritas de cache, nenhuma leitura)
        return {'type': 'object', 'additionalProperties': False,
                'required': ['comando', 'escolha', 'confianca'],
                'properties': {'comando': {'type': 'string'},
                               'escolha': {'type': 'string', 'enum': ['1', '2', '3']},
                               'confianca': {'type': 'string', 'enum': ['alta', 'media', 'baixa']}}}
    return {'type': 'object', 'additionalProperties': False,
            'required': ['comando', 'materia', 'conteudo', 'confianca', 'sugestao_novo'],
            'properties': {
                'comando': {'type': 'string'},
                'materia': {'type': 'string', 'enum': MATERIAS + ['outra']},
                'conteudo': {'type': 'string', 'enum': codigos},
                'confianca': {'type': 'string', 'enum': ['alta', 'media', 'baixa']},
                'sugestao_novo': {'anyOf': [
                    {'type': 'null'},
                    {'type': 'object', 'additionalProperties': False, 'required': ['nome', 'cobre'],
                     'properties': {'nome': {'type': 'string'}, 'cobre': {'type': 'string'}}}]}}}


def descreve(cod, tax):
    m, nome, tid, tnome = tax[cod]
    return f'{cod} {nome} (matéria {m} — {NOME_MATERIA[m]}; tema {tid} {tnome})'


def conteudo_questao(q, etapa, tax, opcoes=None):
    partes = [imagem(q['print'])]
    txt = [f"PRINT DA QUESTÃO acima. Prova: {q['titulo']}, questão {q['n']}. Bloco da prova: {q['area'] or '-'}."]
    if etapa == 'triagem':
        txt.append(f"Classificação atual (pode estar errada; muitas foram feitas pelo texto de apoio — decida "
                   f"pelo comando): {descreve(q['conteudo'], tax) if q['conteudo'] in tax else q['conteudo']}.")
    txt.append('TEXTO TRANSCRITO DA PROVA (ajuda; vale o print):\n"""\n' + q['texto'].strip() + '\n"""')
    if etapa == 'desempate':
        txt.append('Três classificações possíveis foram propostas para esta questão (a ordem não quer dizer nada). '
                   'Escolha a que corresponde ao que o COMANDO cobra do aluno, pela regra do sistema. Responda '
                   'em `escolha` com o NÚMERO da opção:\n'
                   + '\n'.join(f'{k}. {descreve(c, tax)}' for k, c in enumerate(opcoes, 1)))
    else:
        txt.append('Classifique esta questão pela regra do sistema.')
    partes.append({'type': 'text', 'text': '\n\n'.join(txt)})
    return partes


def pedido(cid, etapa, sis, conteudo, esq):
    return {'custom_id': cid, 'params': {
        'model': MODELO[etapa], 'max_tokens': MAX_TOKENS[etapa],
        'system': [{'type': 'text', 'text': sis, 'cache_control': {'type': 'ephemeral'}}],
        'messages': [{'role': 'user', 'content': conteudo}],
        'output_config': {'effort': ESFORCO[etapa], 'format': {'type': 'json_schema', 'schema': esq}}}}


# ---------------------------------------------------------------- orçamento

def preco(modelo, tin, tout, tcr=0, tcw=0, batch=True):
    p = PRECOS[modelo]
    return (0.5 if batch else 1.0) * (tin * p['in'] + tout * p['out'] + tcr * p['cache_read']
                                      + tcw * p['in'] * 1.25) / 1e6


def gasto_classif():
    if not os.path.exists(GASTOS):
        return 0.0
    with open(GASTOS, encoding='utf-8') as h:
        return sum(float(r['custo_real'] or r['custo_estimado'] or 0) for r in csv.DictReader(h)
                   if r['lote'].startswith('classif-'))


def pendente_estimado():
    """Estimativas de batches enviados e ainda não colhidos (contam contra o teto)."""
    tot = 0.0
    for f in glob.glob(os.path.join(SAIDA, '*', 'estado.json')):
        for et in ler(f)['etapas'].values():
            for b in et.get('batches', []):
                if b.get('custo') is None:
                    tot += b.get('estimativa', 0)
    return tot


def anota_gasto(lote, etapa, modelo, tin, tout, tcr, tcw, est, real):
    novo = not os.path.exists(GASTOS)
    with open(GASTOS, 'a', encoding='utf-8', newline='') as h:
        w = csv.writer(h)
        if novo:
            w.writerow(['data', 'lote', 'etapa', 'modelo', 'tokens_entrada', 'tokens_saida',
                        'tokens_cache_lidos', 'tokens_cache_escritos', 'custo_estimado', 'custo_real'])
        w.writerow([datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%d %H:%M'), lote, etapa, modelo,
                    tin, tout, tcr, tcw, f'{est:.4f}', f'{real:.4f}'])


# ---------------------------------------------------------------- API

def cliente():
    import anthropic
    ch = os.environ.get('APRENDICE_API_KEY')
    if not ch:
        sys.exit('Falta a chave APRENDICE_API_KEY no ambiente.')
    return anthropic.Anthropic(api_key=ch, max_retries=6)


def estado_arq(lote):
    return os.path.join(SAIDA, lote, 'estado.json')


def le_estado(lote):
    return ler(estado_arq(lote))


def grava_estado(lote, st):
    gravar(estado_arq(lote), st)


def media_saida(etapa):
    """Tokens de saída médios por pedido, medidos no que já foi colhido (ou um palpite conservador)."""
    tin = n = 0
    for f in glob.glob(os.path.join(SAIDA, '*', 'estado.json')):
        et = ler(f)['etapas'].get(etapa) or {}
        for b in et.get('batches', []):
            if b.get('custo') is not None and b.get('ok'):
                tin += b['tout']
                n += b['ok']
    if n >= 20:
        return 1.25 * tin / n
    return {'triagem': 1500, 'confere': 1500, 'desempate': 2500}[etapa]


def estima(cl, pedidos, etapa):
    """Estimativa do custo: tokens de entrada contados numa amostra; sistema contado como cache lido."""
    modelo = MODELO[etapa]
    amostra = pedidos[:: max(1, len(pedidos) // 8)][:8]
    tins = []
    for p in amostra:
        r = cl.messages.count_tokens(model=modelo, system=p['params']['system'], messages=p['params']['messages'])
        tins.append(r.input_tokens)
    so_sis = cl.messages.count_tokens(model=modelo, system=pedidos[0]['params']['system'],
                                      messages=[{'role': 'user', 'content': 'x'}]).input_tokens
    var = max(1, sum(tins) / len(tins) - so_sis)
    n = len(pedidos)
    tout = media_saida(etapa)
    # 1º pedido escreve o cache; os outros leem (no batch o cache é por melhor esforço: margem de 30% no total)
    est = preco(modelo, var * n, tout * n, so_sis * (n - 1), so_sis) * 1.3
    return est, var, so_sis, tout


def envia(cl, lote, etapa, pedidos):
    st = le_estado(lote)
    et = st['etapas'].setdefault(etapa, {'batches': [], 'ids': [p['custom_id'] for p in pedidos]})
    if et['batches']:
        return
    if not pedidos:
        et['feito'] = True
        grava_estado(lote, st)
        return
    est, var, sis, tout = estima(cl, pedidos, etapa)
    gasto, pend = gasto_classif(), pendente_estimado()
    print(f'[{lote}/{etapa}] {len(pedidos)} pedidos · {MODELO[etapa]} · ~{var:.0f} tokens variáveis + {sis} de '
          f'sistema · saída ~{tout:.0f} · estimativa US$ {est:.2f} · gasto US$ {gasto:.2f} + em curso '
          f'US$ {pend:.2f} (teto US$ {TETO:.2f})', flush=True)
    if gasto + pend + est > TETO:
        sys.exit(f'PARADO: gasto {gasto:.2f} + em curso {pend:.2f} + estimativa {est:.2f} passa do teto '
                 f'US$ {TETO:.2f}. Nada enviado.')
    # divide por tamanho (limite de 256 MB por batch)
    grupos, atual, tam = [], [], 0
    for p in pedidos:
        t = len(json.dumps(p))
        if atual and tam + t > BYTES_POR_BATCH:
            grupos.append(atual)
            atual, tam = [], 0
        atual.append(p)
        tam += t
    if atual:
        grupos.append(atual)
    for g in grupos:
        b = cl.messages.batches.create(requests=g)
        et['modelo'] = MODELO[etapa]
        et['batches'].append({'id': b.id, 'n': len(g), 'modelo': MODELO[etapa],
                              'estimativa': est * len(g) / len(pedidos), 'custo': None})
        grava_estado(lote, st)
        print(f'[{lote}/{etapa}] batch {b.id} enviado ({len(g)} pedidos)', flush=True)


def colhe(cl, lote, etapa, espera=True):
    """Espera os batches da etapa (consulta a cada 5 min) e guarda as respostas."""
    while True:
        st = le_estado(lote)
        et = st['etapas'][etapa]
        faltam = [b for b in et['batches'] if b.get('custo') is None]
        if not faltam:
            break
        algum = False
        for b in faltam:
            r = cl.messages.batches.retrieve(b['id'])
            if r.processing_status != 'ended':
                print(f'[{lote}/{etapa}] {b["id"]}: {r.processing_status} '
                      f'({r.request_counts.processing} em processamento)', flush=True)
                continue
            algum = True
            res = et.setdefault('resultados', {})
            erros = et.setdefault('erros', {})
            tin = tout = tcr = tcw = ok = 0
            for x in cl.messages.batches.results(b['id']):
                if x.result.type != 'succeeded':
                    erros[x.custom_id] = x.result.type
                    continue
                msg = x.result.message
                u = msg.usage
                tin += u.input_tokens
                tout += u.output_tokens
                tcr += getattr(u, 'cache_read_input_tokens', 0) or 0
                tcw += getattr(u, 'cache_creation_input_tokens', 0) or 0
                if msg.stop_reason in ('refusal', 'max_tokens'):
                    erros[x.custom_id] = msg.stop_reason
                    continue
                texto = next((c.text for c in msg.content if c.type == 'text'), '')
                try:
                    res[x.custom_id] = json.loads(texto)
                    erros.pop(x.custom_id, None)
                    ok += 1
                except Exception as e:
                    erros[x.custom_id] = f'json: {e}'
            mod = b.get('modelo', MODELO[etapa])
            real = preco(mod, tin, tout, tcr, tcw)
            b.update(custo=real, tin=tin, tout=tout, tcr=tcr, tcw=tcw, ok=ok)
            grava_estado(lote, st)
            anota_gasto(lote, etapa, mod, tin, tout, tcr, tcw, b['estimativa'], real)
            print(f'[{lote}/{etapa}] {b["id"]} colhido: {ok} ok · US$ {real:.3f} (entrada {tin}, saída {tout}, '
                  f'cache lido {tcr}, escrito {tcw})', flush=True)
        if not espera:
            return not any(x.get('custo') is None for x in le_estado(lote)['etapas'][etapa]['batches'])
        if not algum:
            time.sleep(300)
    return True


# ---------------------------------------------------------------- lotes e decisão

def cria_lote(nome, ids):
    st = {'lote': nome, 'criado': datetime.datetime.now(datetime.timezone.utc).isoformat(timespec='minutes'),
          'ids': ids, 'etapas': {}}
    if os.path.exists(estado_arq(nome)):
        sys.exit(f'lote {nome} já existe')
    grava_estado(nome, st)
    print(f'lote {nome}: {len(ids)} questões')


def precisa_conferir(q, t):
    return (t['conteudo'] != q['conteudo'] or t['materia'] != q['materia'] or t['confianca'] == 'baixa'
            or t.get('sugestao_novo') is not None)


def opcoes_desempate(q, t, c):
    """Códigos em disputa, em ordem embaralhada fixa (sem dizer de quem é cada um)."""
    ops = sorted({q['conteudo'], t['conteudo'], c['conteudo']})
    random.Random(int(hashlib.md5(q['id'].encode()).hexdigest(), 16)).shuffle(ops)
    return ops


def escolha_desempate(q, t, c, r):
    """Código escolhido no desempate (a resposta é a posição da opção; o piloto respondia o código)."""
    ops = opcoes_desempate(q, t, c)
    e = str(r.get('escolha', ''))
    if e in ('1', '2', '3'):
        return ops[int(e) - 1] if int(e) <= len(ops) else q['conteudo']
    return e


def precisa_desempate(q, t, c):
    if c['conteudo'] == q['conteudo']:
        return False           # conferência = atual: fica
    if t['conteudo'] == c['conteudo']:
        return False           # triagem = conferência != atual: muda
    return True                # três diferentes, ou triagem = atual e conferência diferente


def pedidos_da_etapa(etapa, lote, u, tax, modo):
    """Pedidos da etapa para um lote (só depois que a etapa anterior foi colhida)."""
    codigos = sorted(tax)
    st = le_estado(lote)
    qs = [u[i] for i in st['ids'] if i in u]
    e = st['etapas']
    if etapa == 'triagem':
        sis = sistema()
        return [pedido(q['id'], 'triagem', sis, conteudo_questao(q, 'triagem', tax), esquema(codigos)) for q in qs]
    tri = e['triagem'].get('resultados', {})
    if etapa == 'confere':
        alvo = [q for q in qs if q['id'] in tri and precisa_conferir(q, tri[q['id']])]
        if modo == 'economico':
            alvo = [q for q in alvo if tri[q['id']]['confianca'] != 'alta'
                    or tri[q['id']]['conteudo'] != q['conteudo']]
        ped = []
        for q in alvo:
            cand = candidatas(q['materia'], tri[q['id']]['materia'])
            cods = [c for c in codigos if tax[c][0] in cand]
            ped.append(pedido(q['id'], 'confere', sistema(cand), conteudo_questao(q, 'confere', tax),
                              esquema(cods)))
        ped.sort(key=lambda p: p['params']['system'][0]['text'])   # mesmo prefixo junto: ajuda o cache
        return ped
    conf = e['confere'].get('resultados', {})
    alvo = [q for q in qs if q['id'] in conf and precisa_desempate(q, tri[q['id']], conf[q['id']])]
    sis_des = sistema(sem_lista=True)
    return [pedido(q['id'], 'desempate', sis_des,
                   conteudo_questao(q, 'desempate', tax, opcoes_desempate(q, tri[q['id']], conf[q['id']])),
                   esquema(None, ['1', '2', '3'])) for q in alvo]


def roda(lotes, modo):
    """Roda os lotes etapa por etapa: envia a etapa de todos, espera todos, passa à próxima."""
    cl = cliente()
    u = universo()
    tax = taxonomia()
    for etapa in ('triagem', 'confere', 'desempate'):
        for lote in lotes:
            et = le_estado(lote)['etapas'].get(etapa) or {}
            if et.get('batches') or et.get('feito'):
                continue
            envia(cl, lote, etapa, pedidos_da_etapa(etapa, lote, u, tax, modo))
        while True:
            pend = [l for l in lotes if not colhe(cl, l, etapa, espera=False)]
            if not pend:
                break
            print(f'[{etapa}] esperando {len(pend)} lote(s): {", ".join(pend)}', flush=True)
            time.sleep(300)
    for lote in lotes:
        decide(lote)
    print(f'FIM · gasto da classificação US$ {gasto_classif():.2f}', flush=True)


def decide(lote):
    """Aplica as regras do prompt e grava decisao.json (sem API)."""
    u = universo()
    tax = taxonomia()
    st = le_estado(lote)
    e = st['etapas']
    tri = (e.get('triagem') or {}).get('resultados', {})
    conf = (e.get('confere') or {}).get('resultados', {})
    des = (e.get('desempate') or {}).get('resultados', {})
    mt = (e.get('triagem') or {}).get('modelo', MODELO['triagem'])
    mc = (e.get('confere') or {}).get('modelo', 'claude-opus-5-5')
    md = (e.get('desempate') or {}).get('modelo', MODELO['desempate'])
    fa = os.path.join(RAIZ, 'docs', 'resolucoes', 'classificacao', 'ajustes-conferencia.json')
    ajustes = {k: v for k, v in ler(fa).items() if not k.startswith('_')} if os.path.exists(fa) else {}
    saida = {}
    for qid in st['ids']:
        q = u.get(qid)
        if not q:
            continue
        t = tri.get(qid)
        d = {'id': qid, 'prova': q['prova'], 'titulo': q['titulo'], 'n': q['n'], 'materia': q['materia'],
             'de': q['conteudo'], 'para': q['conteudo'], 'acao': 'fica', 'motivo': '', 'modelos': [],
             'triagem': t, 'confere': conf.get(qid), 'desempate': des.get(qid)}
        if t is None:
            d['acao'] = 'sem-resposta'
        elif qid not in conf:
            if precisa_conferir(q, t):
                d['acao'] = 'sem-resposta'      # devia ter ido à conferência (modo econômico ou falha)
                d['motivo'] = 'triagem discordou; sem conferência'
            else:
                d['motivo'] = 'triagem confirmou com confiança'
        else:
            c = conf[qid]
            if c['conteudo'] == q['conteudo']:
                d['motivo'] = 'conferência às cegas confirmou o atual'
            elif t['conteudo'] == c['conteudo']:
                d.update(acao='muda', para=c['conteudo'], modelos=[mt, mc],
                         motivo=c['comando'])
            elif qid in des:
                x = escolha_desempate(q, t, c, des[qid])
                if x != q['conteudo'] and x in (t['conteudo'], c['conteudo']):
                    quem = [md] + ([mt] if x == t['conteudo'] else []) + ([mc] if x == c['conteudo'] else [])
                    d.update(acao='muda', para=x, modelos=quem, motivo=des[qid]['comando'])
                else:
                    d['motivo'] = 'desempate ficou com o atual'
            else:
                d['acao'] = 'sem-resposta'
                d['motivo'] = 'faltou o desempate'
        if d['acao'] == 'muda':
            nova = tax[d['para']][0]
            if nova != q['materia']:
                # matéria só muda se triagem e conferência concordam na matéria (e no conteúdo da nova)
                cm = (conf.get(qid) or {}).get('materia')
                if not (t['materia'] == cm == nova):
                    d.update(acao='fica', para=q['conteudo'],
                             motivo='mudança de matéria sem acordo de triagem e conferência')
                else:
                    d['materia_nova'] = nova
        # correção da conferência do Claude Code (agente com o print) vale por cima
        if qid in ajustes and t is not None:
            aj = ajustes[qid]
            if aj['para'] == q['conteudo']:
                d.update(acao='fica', para=q['conteudo'], motivo='conferência do Claude Code: ' + aj['motivo'])
                d.pop('materia_nova', None)
            else:
                d.update(acao='muda', para=aj['para'], motivo=aj['motivo'],
                         modelos=['conferência do Claude Code (agente com o print)'])
                if tax[aj['para']][0] != q['materia']:
                    d['materia_nova'] = tax[aj['para']][0]
                else:
                    d.pop('materia_nova', None)
        # sugestão de conteúdo novo: vale a da conferência (modelo forte, às cegas)
        c = conf.get(qid)
        if c and c.get('sugestao_novo'):
            d['sugestao_novo'] = c['sugestao_novo']
            d['sugestao_de'] = 'confere' + ('+triagem' if t and t.get('sugestao_novo') else '')
        # "outra" matéria (fora das 9): só registra, não aplica
        if t and c and t['materia'] == c['materia'] == 'outra':
            d['outra_materia'] = True
        saida[qid] = d
    gravar(os.path.join(SAIDA, lote, 'decisao.json'), saida)
    from collections import Counter
    print(lote, dict(Counter(x['acao'] for x in saida.values())),
          'mudam de matéria:', sum(1 for x in saida.values() if x.get('materia_nova')),
          'sugestões:', sum(1 for x in saida.values() if x.get('sugestao_novo')),
          'outra matéria:', sum(1 for x in saida.values() if x.get('outra_materia')))
    return saida


def aplica(lote):
    """Grava as mudanças nos prova.json (conteudo, tema e, se for o caso, materia). Id nunca muda."""
    dec = ler(os.path.join(SAIDA, lote, 'decisao.json'))
    tax = taxonomia()
    por_prova = {}
    for d in dec.values():
        if d['acao'] == 'muda' and not d.get('aplicada'):
            por_prova.setdefault(d['prova'], []).append(d)
    n = 0
    for prova, ds in por_prova.items():
        f = os.path.join(FONTE, 'provas', prova, 'prova.json')
        texto = open(f, encoding='utf-8').read()
        p = json.loads(texto)
        idx = {q['id']: q for q in p['questoes']}
        for d in ds:
            q = idx[d['id']]
            if q['conteudo'] != d['de']:
                print(f'  {d["id"]}: mudou desde a classificação ({q["conteudo"]} != {d["de"]}); não aplico')
                continue
            m, _, tid, _ = tax[d['para']]
            q['conteudo'] = d['para']
            q['tema'] = tid
            if m != q['materia']:
                q['materia'] = m
            d['aplicada'] = True
            n += 1
        with open(f, 'w', encoding='utf-8') as h:
            json.dump(p, h, ensure_ascii=False, indent=1)
            if texto.endswith('\n'):
                h.write('\n')
    gravar(os.path.join(SAIDA, lote, 'decisao.json'), dec)
    fila_materia_nova(lote, [d for ds in por_prova.values() for d in ds if d.get('aplicada') and d.get('materia_nova')])
    print(f'{lote}: {n} questões gravadas em {len(por_prova)} provas')


REGS = os.path.join(RAIZ, 'docs', 'resolucoes')


def tem_resolucao(d):
    pasta = os.path.join(FONTE, 'provas', d['prova'])
    for f in glob.glob(os.path.join(pasta, 'resolucoes-*.json')):
        if d['id'] in ler(f):
            return os.path.basename(f)
    return None


def fila_materia_nova(lote, ds):
    """COORDENACAO.md, "Reclassificar": a questão que muda de matéria sai dos `pendentes` da matéria antiga; se já
    tem resolução (que fica onde está), entra nos `pendentes` da matéria nova com o motivo "classificação: resolver
    na matéria nova". Sem resolução, a fila da matéria nova já a pega sozinha."""
    if not ds:
        return
    tax = taxonomia()
    hoje = datetime.date.today().isoformat()
    for d in ds:
        for f in glob.glob(os.path.join(REGS, f"registro-{d['materia']}*.json")):
            r = ler(f)
            if d['id'] in r.get('pendentes', {}):
                r['pendentes'].pop(d['id'])
                gravar(f, r)
                print(f"  {d['id']}: saiu dos pendentes de {os.path.basename(f)}")
        arq = tem_resolucao(d)
        if not arq:
            continue
        f = os.path.join(REGS, f"registro-{d['materia_nova']}.json")
        r = ler(f)
        m, nome, tid, tnome = tax[d['para']]
        r.setdefault('pendentes', {})[d['id']] = {
            'materia': d['materia_nova'], 'prova': f"{d['titulo']} · questão {d['n']}",
            'conteudo': f"{d['para']} {nome} (tema {tid} {tnome})",
            'motivo': f"classificação: resolver na matéria nova (era {d['materia']} {d['de']}; resolução antiga em "
                      f"{arq}, que fica)",
            'lote': lote, 'data': hoje}
        gravar(f, r)
        print(f"  {d['id']}: entrou nos pendentes de registro-{d['materia_nova']}.json")


# ---------------------------------------------------------------- saídas para o dono

DOCS_CLASSIF = os.path.join(RAIZ, 'docs', 'resolucoes', 'classificacao')


def lotes_oficiais():
    """Lotes cujas decisões valem (o piloto 1 e os testes ficam de fora: o piloto 2 refez as mesmas questões)."""
    out = []
    for f in sorted(glob.glob(os.path.join(SAIDA, 'classif-*', 'decisao.json'))):
        l = os.path.basename(os.path.dirname(f))
        if l in ('classif-todas-00',) or l.startswith('classif-teste'):
            continue
        out.append(l)
    return out


def relatorio():
    tax = taxonomia()
    todas = {}
    for l in lotes_oficiais():
        for qid, d in ler(os.path.join(SAIDA, l, 'decisao.json')).items():
            d['lote'] = l
            todas[qid] = d
    os.makedirs(DOCS_CLASSIF, exist_ok=True)
    # 1. mudanças
    mud = []
    for d in sorted(todas.values(), key=lambda x: (x['materia'], x['prova'], x['n'])):
        if d['acao'] == 'muda' and d.get('aplicada'):
            mud.append({'id': d['id'], 'prova': f"{d['titulo']} q{d['n']}", 'materia': d['materia'],
                        'materia_nova': d.get('materia_nova'), 'de': d['de'], 'para': d['para'],
                        'motivo': d['motivo'], 'modelos': d['modelos'], 'lote': d['lote']})
    with open(os.path.join(DOCS_CLASSIF, 'mudancas.json'), 'w', encoding='utf-8') as h:
        h.write('[\n' + ',\n'.join(json.dumps(x, ensure_ascii=False) for x in mud) + '\n]\n')
    # 2. sugestões de conteúdo novo (agrupadas em sugestoes-grupos.json, quando existir)
    grupos = {}
    fg = os.path.join(SAIDA, 'sugestoes-grupos.json')
    if os.path.exists(fg):
        grupos = ler(fg)
    sug = [d for d in todas.values() if d.get('sugestao_novo')]
    por_m = {}
    for d in sug:
        m = tax[d['para']][0]
        g = grupos.get(d['id']) or {'nome': d['sugestao_novo']['nome'], 'cobre': d['sugestao_novo']['cobre']}
        por_m.setdefault(m, {}).setdefault(g['nome'], {'cobre': g['cobre'], 'ids': []})['ids'].append(d)
    L = ['# Sugestões de conteúdos (subtemas) novos', '',
         'Gerado por `ferramentas/fabrica/classifica_api.py relatorio`. Cada questão abaixo ficou, por enquanto, no '
         'conteúdo existente que mais corresponde ("ficou em"). A sugestão é do modelo da conferência, às cegas. '
         'Quem decide se cria o conteúdo é o dono.', '']
    for m in MATERIAS:
        if m not in por_m:
            continue
        L += [f'## {NOME_MATERIA[m]} ({m})', '']
        for nome, g in sorted(por_m[m].items(), key=lambda kv: -len(kv[1]['ids'])):
            L.append(f"### {nome} — {len(g['ids'])} questão(ões)")
            L.append(f"O que cobriria: {g['cobre']}")
            fic = {}
            for d in g['ids']:
                fic.setdefault(d['para'], []).append(d['id'])
            for c, ids in sorted(fic.items()):
                L.append(f"- ficou em **{c}** {tax[c][1]}: {', '.join(sorted(ids))}")
            L.append('')
    open(os.path.join(DOCS_CLASSIF, 'sugestoes-novos-subtemas.md'), 'w', encoding='utf-8').write('\n'.join(L))
    # 3. resumo
    gastos = {}
    with open(GASTOS, encoding='utf-8') as h:
        for r in csv.DictReader(h):
            if r['lote'].startswith('classif-'):
                k = r['lote'].split('-')[1]
                gastos[k] = gastos.get(k, 0) + float(r['custo_real'] or 0)
    L = ['# Classificação: resumo por matéria', '',
         'Conferido pela fábrica de classificação (triagem claude-haiku-5-5; conferência às cegas claude-sonnet-5-5; '
         'desempate às cegas claude-opus-5-5). Regra: o conteúdo é o que o COMANDO cobra, não o assunto do texto de '
         'apoio. Matéria = a de origem da questão.', '',
         '| Matéria | Conferidas | Mudaram | Mudaram de matéria | Ficaram | Sem resposta | Sugestão de conteúdo novo |',
         '|---|---|---|---|---|---|---|']
    tot = [0] * 6
    for m in MATERIAS:
        ds = [d for d in todas.values() if d['materia'] == m]
        if not ds:
            continue
        v = [len(ds), sum(d['acao'] == 'muda' for d in ds), sum(bool(d.get('materia_nova')) for d in ds),
             sum(d['acao'] == 'fica' for d in ds), sum(d['acao'] == 'sem-resposta' for d in ds),
             sum(bool(d.get('sugestao_novo')) for d in ds)]
        tot = [a + b for a, b in zip(tot, v)]
        L.append(f"| {NOME_MATERIA[m]} | " + ' | '.join(str(x) for x in v) + ' |')
    L.append('| **total** | ' + ' | '.join(f'**{x}**' for x in tot) + ' |')
    L += ['', '## Gasto (US$, fabrica_saida/gastos.csv, lotes classif-*)', '']
    for k, v in sorted(gastos.items()):
        L.append(f'- {k}: {v:.2f}' + (' (piloto e testes)' if k in ('todas', 'teste') else ''))
    L.append(f'- **total: {sum(gastos.values()):.2f}**')
    open(os.path.join(DOCS_CLASSIF, 'resumo.md'), 'w', encoding='utf-8').write('\n'.join(L) + '\n')
    print(f'relatório: {len(mud)} mudanças, {len(sug)} sugestões, gasto {sum(gastos.values()):.2f}')


def agrupa_sugestoes():
    """Junta as sugestões de conteúdo novo que dizem a mesma coisa com nomes diferentes (uma chamada por matéria,
    claude-sonnet-5-5). Grava fabrica_saida/classificacao/sugestoes-grupos.json: id -> {nome, cobre}."""
    cl = cliente()
    tax = taxonomia()
    todas = {}
    for l in lotes_oficiais():
        for qid, d in ler(os.path.join(SAIDA, l, 'decisao.json')).items():
            if d.get('sugestao_novo'):
                todas[qid] = d
    por_m = {}
    for d in todas.values():
        por_m.setdefault(tax[d['para']][0], []).append(d)
    saida = {}
    modelo = 'claude-sonnet-5-5'
    for m, ds in sorted(por_m.items()):
        itens = [{'id': d['id'], 'nome': d['sugestao_novo']['nome'], 'cobre': d['sugestao_novo']['cobre'],
                  'ficou_em': f"{d['para']} {tax[d['para']][1]}"} for d in ds]
        esq = {'type': 'object', 'additionalProperties': False, 'required': ['grupos'],
               'properties': {'grupos': {'type': 'array', 'items': {
                   'type': 'object', 'additionalProperties': False, 'required': ['nome', 'cobre', 'ids'],
                   'properties': {'nome': {'type': 'string'}, 'cobre': {'type': 'string'},
                                  'ids': {'type': 'array', 'items': {'type': 'string'}}}}}}}
        texto = (f'Matéria: {NOME_MATERIA[m]}. Abaixo, sugestões de conteúdos (subtemas) novos feitas questão a '
                 'questão para um site de estudos de vestibular. Muitas dizem a mesma coisa com nomes diferentes. '
                 'Junte as que cobririam o MESMO conteúdo num grupo só, com um nome curto no estilo de um subtema '
                 '(minúsculas, sem ponto final) e uma frase do que ele cobriria. Não junte assuntos diferentes só '
                 'para ter menos grupos. Toda id tem de estar em exatamente um grupo.\n\n'
                 + json.dumps(itens, ensure_ascii=False, indent=1))
        with cl.messages.stream(model=modelo, max_tokens=32000, messages=[{'role': 'user', 'content': texto}],
                                output_config={'effort': 'medium',
                                               'format': {'type': 'json_schema', 'schema': esq}}) as st:
            msg = st.get_final_message()
        u = msg.usage
        real = preco(modelo, u.input_tokens, u.output_tokens, batch=False)
        anota_gasto('classif-sug-01', 'agrupa', modelo, u.input_tokens, u.output_tokens, 0, 0, real, real)
        gs = json.loads(next(c.text for c in msg.content if c.type == 'text'))['grupos']
        vistos = set()
        for g in gs:
            for i in g['ids']:
                if i in todas and i not in vistos:
                    vistos.add(i)
                    saida[i] = {'nome': g['nome'], 'cobre': g['cobre']}
        for d in ds:   # o que o modelo esqueceu fica com o nome original
            if d['id'] not in vistos:
                saida[d['id']] = dict(d['sugestao_novo'])
        print(f'{m}: {len(ds)} sugestões em {len(gs)} grupos · US$ {real:.3f}')
    gravar(os.path.join(SAIDA, 'sugestoes-grupos.json'), saida)


# ---------------------------------------------------------------- linha de comando

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('cmd')
    ap.add_argument('lote', nargs='?')
    ap.add_argument('--ids', default='')
    ap.add_argument('--materia', default='')
    ap.add_argument('--de', type=int, default=0)
    ap.add_argument('--ate', type=int, default=0)
    ap.add_argument('--piloto', type=int, default=0)
    ap.add_argument('--semente', type=int, default=1119)
    ap.add_argument('--excluir', default='', help='lotes cujas questões não entram (separados por vírgula)')
    ap.add_argument('--modo', default='completo')
    ap.add_argument('--confere-modelo', default='')
    a = ap.parse_args()
    if a.confere_modelo:
        MODELO['confere'] = a.confere_modelo
    if a.cmd == 'universo':
        u = universo()
        from collections import Counter
        print(len(u), dict(Counter(q['materia'] for q in u.values())))
        print('suspeitas:', len(suspeitas() & set(u)))
    elif a.cmd == 'lote':
        u = universo()
        ja = set()
        for l in filter(None, a.excluir.split(',')):
            ja |= set(le_estado(l)['ids'])
        if a.ids:
            ids = a.ids.split(',')
        elif a.piloto:
            r = random.Random(a.semente)
            sus = sorted(suspeitas() & set(u))
            limpas = sorted(set(u) - set(sus))
            ids = r.sample(sus, a.piloto // 2) + r.sample(limpas, a.piloto - a.piloto // 2)
        else:
            ids = sorted((i for i, q in u.items() if q['materia'] == a.materia and i not in ja),
                         key=lambda i: (u[i]['prova'], u[i]['n']))
            ids = ids[a.de:a.ate or None]
        cria_lote(a.lote, ids)
    elif a.cmd == 'roda':
        roda(a.lote.split(','), a.modo)
    elif a.cmd == 'decide':
        decide(a.lote)
    elif a.cmd == 'aplica':
        aplica(a.lote)
    elif a.cmd == 'agrupa':
        agrupa_sugestoes()
    elif a.cmd == 'relatorio':
        relatorio()
    elif a.cmd == 'gasto':
        print(f'classificação: US$ {gasto_classif():.2f} + em curso US$ {pendente_estimado():.2f} (teto {TETO})')
    else:
        sys.exit('comando desconhecido')


if __name__ == '__main__':
    main()

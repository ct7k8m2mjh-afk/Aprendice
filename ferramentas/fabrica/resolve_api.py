#!/usr/bin/env python3
"""Fábrica de resoluções pela API do Claude (créditos do Console) — piloto de Português.

Pega um lote aberto por ferramentas/resolucoes/lote.py e roda a linha de produção do
docs/fabrica-de-conteudo-api.md, em Message Batches (metade do preço):

  1 resolvedor      Sonnet, ÀS CEGAS (sem o gabarito), escreve a resolução inteira
  1b reconciliação  Opus, só nas que a letra do resolvedor difere do gabarito oficial
                    (regra do dono 12-13/11/2026: vale o oficial, salvo erro de fato -> "anular")
  1c gabarito cego  Opus, 2º especialista às cegas nas questões sem gabarito publicado (princípio 2)
  2 lente de fatos  Opus, chamada separada; resolve sozinha antes de criticar; devolve correções
  3 lente didática  Opus, chamada separada; devolve melhorias (não mexe em fato)
  4 lente de fatos  Opus, de novo, só no que a lente didática mudou

Cada etapa é um batch. O estado fica em fabrica_saida/resolucoes/<lote>/estado.json, então o
programa pode ser rodado de novo e continua de onde parou.

Uso:
  python3 ferramentas/fabrica/resolve_api.py estima <entrada.json> [--teto 10]
  python3 ferramentas/fabrica/resolve_api.py teste  <entrada.json> [--n 3] [--teto 10]
  python3 ferramentas/fabrica/resolve_api.py roda   <entrada.json> --saida <saida.json> [--teto 10]

A chave vem da variável de ambiente APRENDICE_API_KEY (ou ANTHROPIC_API_KEY). Nunca é impressa.
"""
import argparse
import base64
import csv
import datetime
import json
import os
import re
import sys
import time

RAIZ = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
AGENTES = os.path.join(RAIZ, 'ferramentas', 'fabrica', 'agentes')
PROMPTS = os.path.join(RAIZ, 'ferramentas', 'fabrica', 'prompts')
SAIDA = os.path.join(RAIZ, 'fabrica_saida', 'resolucoes')
GASTOS = os.path.join(RAIZ, 'fabrica_saida', 'gastos.csv')
SKILL = os.path.join(RAIZ, '.claude', 'skills', 'resolucao-exercicios')
PUB = os.path.join(RAIZ, 'app', 'public', 'conteudo')

# Preços por milhão de tokens (claude-api skill, consultada em 19/11/2026). Batches = metade.
PRECOS = {
    'claude-sonnet-5-5': {'in': 2.00, 'out': 10.00, 'cache_read': 0.10},
    'claude-opus-5-5': {'in': 4.00, 'out': 20.00, 'cache_read': 0.20},
}
MODELO_RESOLVEDOR = 'claude-sonnet-5-5'
MODELO_LENTE = 'claude-opus-5-5'
LETRAS = ['A', 'B', 'C', 'D', 'E']
TIPOS = ['localizar', 'calcular', 'comparar', 'eliminar', 'concluir']


# ---------------------------------------------------------------- textos e prompts

def le(f):
    with open(f, encoding='utf-8') as h:
        return h.read()


def conteudos_da_materia(m):
    d = json.load(open(os.path.join(PUB, m, 'materia.json'), encoding='utf-8'))
    linhas = []
    for mo in d['modulos']:
        subs = '; '.join(f"{s['id']} {s['nome']}" for s in mo['subs'])
        linhas.append(f"- **{mo['id']} {mo['nome']}**: {subs}")
    return '\n'.join(linhas)


REGRAS_CAMPOS = """
## Como escrever cada campo (Português é matéria de TEXTO, não animada)
- `conceito`: uma frase — o que a questão cobra.
- `antes.texto`: 2 a 5 frases com a ideia que destrava.
- `antes.formulas`: as REGRAS em forma de linha (1 a 4; pode ser lista vazia).
- `antes.simbolos`: pares `[termo, explicação curta]` de todo termo técnico usado (mínimo 1).
- `pista`: 1 ou 2 frases com o primeiro movimento; nunca cita a letra nem a resposta.
- `passos`: de 3 a 6. `faz` imperativo curto; `conta` é o trecho da prova entre aspas (cópia
  literal, pode cortar com `[...]`) ou a informação localizada, e pode ser `""`; `porque` diz o que
  o trecho prova; `tipo` em localizar|calcular|comparar|eliminar|concluir. O último é `concluir`.
- `resposta`: começa por "Alternativa <letra> — " e reproduz o conteúdo da alternativa.
- `checagem`: confere por OUTRO caminho; nunca repete um passo.
- `erradas`: uma entrada por letra errada, até ~30 palavras, dizendo onde o texto a desmente.
  Proibidas as palavras "provavelmente", "talvez", "chute", "distrator".
- `armadilha`: uma frase com a armadilha principal.
- `alerta`: `""`, salvo erro ou ambiguidade real da prova.
- `essencial`: `pede`, `chave`, `cuidado`, uma frase cada.
- `equivocos`: por letra errada, `<conteúdo>:<equívoco-minúsculo-com-hífen>` (ex.:
  `P05.4:confundiu-registro-com-norma`). Sem acento depois dos dois-pontos.
- `fontes`: SEMPRE lista vazia `[]` (esta etapa não abre a web; quem confere acrescenta).
- Citação entre aspas é cópia literal do print. Sem emoji. Sem Brasil Escola, Mundo Educação,
  Prepara Enem, InfoEscola. Frases de até 30 palavras. Não presuma gênero por nome próprio.
""".strip()


def monta(nome_prompt, materia='por'):
    t = le(os.path.join(PROMPTS, nome_prompt))
    blocos = {
        'BRIEF_RESOLVEDOR': lambda: le(os.path.join(AGENTES, 'BRIEF_RESOLVEDOR.md')),
        'BRIEF_LENTE_FATOS': lambda: le(os.path.join(AGENTES, 'BRIEF_LENTE_FATOS.md')),
        'BRIEF_LENTE_DIDATICA': lambda: le(os.path.join(AGENTES, 'BRIEF_LENTE_DIDATICA.md')),
        'ESPECIALISTA': lambda: le(os.path.join(AGENTES, 'especialistas', materia + '.md')),
        'GUIA_MATERIA': lambda: le(os.path.join(SKILL, 'materias', 'portugues.md')),
        'CONTEUDOS': lambda: conteudos_da_materia(materia),
        'REGRAS_CAMPOS': lambda: REGRAS_CAMPOS,
    }
    for k, f in blocos.items():
        if '{{' + k + '}}' in t:
            t = t.replace('{{' + k + '}}', f())
    sobrou = re.findall(r'\{\{(\w+)\}\}', t)
    if sobrou:
        sys.exit(f'{nome_prompt}: bloco sem conteúdo: {sobrou}')
    return t


# ---------------------------------------------------------------- esquemas de saída

def esq_resolucao():
    return {
        'type': 'object', 'additionalProperties': False,
        'required': ['antes', 'pista', 'passos', 'resposta', 'checagem', 'erradas', 'armadilha',
                     'alerta', 'essencial'],
        'properties': {
            'antes': {'type': 'object', 'additionalProperties': False,
                      'required': ['texto', 'formulas', 'simbolos'],
                      'properties': {
                          'texto': {'type': 'string'},
                          'formulas': {'type': 'array', 'items': {'type': 'string'}},
                          'simbolos': {'type': 'array', 'items': {
                              'type': 'object', 'additionalProperties': False,
                              'required': ['termo', 'explicacao'],
                              'properties': {'termo': {'type': 'string'},
                                             'explicacao': {'type': 'string'}}}}}},
            'pista': {'type': 'string'},
            'passos': {'type': 'array', 'items': {
                'type': 'object', 'additionalProperties': False,
                'required': ['faz', 'conta', 'porque', 'tipo'],
                'properties': {'faz': {'type': 'string'}, 'conta': {'type': 'string'},
                               'porque': {'type': 'string'},
                               'tipo': {'type': 'string', 'enum': TIPOS}}}},
            'resposta': {'type': 'string'},
            'checagem': {'type': 'string'},
            'erradas': {'type': 'array', 'items': {
                'type': 'object', 'additionalProperties': False, 'required': ['letra', 'texto'],
                'properties': {'letra': {'type': 'string', 'enum': LETRAS},
                               'texto': {'type': 'string'}}}},
            'armadilha': {'type': 'string'},
            'alerta': {'type': 'string'},
            'essencial': {'type': 'object', 'additionalProperties': False,
                          'required': ['pede', 'chave', 'cuidado'],
                          'properties': {'pede': {'type': 'string'}, 'chave': {'type': 'string'},
                                         'cuidado': {'type': 'string'}}},
        }}


# Decisão depois de três tentativas de regra por prompt (piloto -> por-0102): em Português o
# resolvedor NÃO escreve `caminhos`. O campo é opcional na matéria (o lote.py só o exige nas
# animadas), e em 100% das questões conferidas o modelo o preenchia com o resumo da eliminação que
# os passos já faziam — além de concentrar ali os erros de fato (eliminação que não fecha, frase
# agramatical, afirmação gramatical falsa). Questão de leitura normalmente tem um caminho só.
# Quem confere acrescenta um caminho por patch quando achar um critério que não apareça em nenhum
# outro campo; o aplicador aceita `caminhos[i].nome` e `caminhos[i].ideia`.
PEDE_CAMINHOS = False


def esq_extras():
    extras = {
        'equivocos': {'type': 'array', 'items': {
            'type': 'object', 'additionalProperties': False, 'required': ['letra', 'codigo'],
            'properties': {'letra': {'type': 'string', 'enum': LETRAS},
                           'codigo': {'type': 'string'}}}},
        'fontes': {'type': 'array', 'items': {
            'type': 'object', 'additionalProperties': False, 'required': ['nome', 'url'],
            'properties': {'nome': {'type': 'string'}, 'url': {'type': 'string'}}}},
    }
    if PEDE_CAMINHOS:
        extras['caminhos'] = {'type': 'array', 'items': {
            'type': 'object', 'additionalProperties': False, 'required': ['nome', 'ideia'],
            'properties': {'nome': {'type': 'string'}, 'ideia': {'type': 'string'}}}}
    return extras


ESQ_RESOLVEDOR = {
    'type': 'object', 'additionalProperties': False,
    'required': ['id', 'problema', 'reclass', 'dado_divergente', 'depende_da_obra', 'obra',
                 'conceito', 'letra', 'confianca', 'resolucao', 'equivocos', 'fontes'],
    'properties': {
        'id': {'type': 'string'},
        'problema': {'type': 'string'},
        'reclass': {'type': 'string'},
        'dado_divergente': {'type': 'string'},
        'depende_da_obra': {'type': 'boolean'},
        'obra': {'type': 'string'},
        'conceito': {'type': 'string'},
        'letra': {'type': 'string'},
        'confianca': {'type': 'string', 'enum': ['alta', 'media', 'baixa']},
        'resolucao': esq_resolucao(),
        **esq_extras(),
    }}

ESQ_RECONCILIACAO = {
    'type': 'object', 'additionalProperties': False,
    'required': ['id', 'decisao', 'motivo', 'leitura_da_banca', 'conceito', 'resolucao',
                 'equivocos', 'fontes'],
    'properties': {
        'id': {'type': 'string'},
        'decisao': {'type': 'string', 'enum': ['oficial', 'anular', 'pendente']},
        'motivo': {'type': 'string'},
        'leitura_da_banca': {'type': 'string'},
        'conceito': {'type': 'string'},
        'resolucao': esq_resolucao(),
        **esq_extras(),
    }}

CAMINHOS_PATCH = (
    r'^(conceito|pista|resposta|checagem|armadilha|alerta'
    r'|antes\.texto'
    r'|antes\.formulas\[\d+\]'
    r'|antes\.simbolos\[\d+\]\[[01]\]'
    r'|passos\[\d+\]\.(faz|conta|porque|tipo)'
    r'|erradas\.[A-E]'
    r'|equivocos\.[A-E]'
    r'|caminhos\[\d+\]\.(nome|ideia)'
    r'|essencial\.(pede|chave|cuidado))$'
)

ESQ_FATOS = {
    'type': 'object', 'additionalProperties': False,
    'required': ['id', 'minha_letra', 'minha_razao', 'reprovar', 'reclass', 'dado_divergente',
                 'correcoes', 'fatos_ok', 'fontes'],
    'properties': {
        'id': {'type': 'string'},
        'minha_letra': {'type': 'string'},
        'minha_razao': {'type': 'string'},
        'reprovar': {'type': 'string'},
        'reclass': {'type': 'string'},
        'dado_divergente': {'type': 'string'},
        'correcoes': {'type': 'array', 'items': {
            'type': 'object', 'additionalProperties': False,
            'required': ['campo', 'antes', 'depois', 'motivo'],
            'properties': {'campo': {'type': 'string'}, 'antes': {'type': 'string'},
                           'depois': {'type': 'string'}, 'motivo': {'type': 'string'}}}},
        'fatos_ok': {'type': 'boolean'},
        'fontes': {'type': 'array', 'items': {
            'type': 'object', 'additionalProperties': False, 'required': ['nome', 'url'],
            'properties': {'nome': {'type': 'string'}, 'url': {'type': 'string'}}}},
    }}

ESQ_DIDATICA = {
    'type': 'object', 'additionalProperties': False,
    'required': ['id', 'melhorias', 'alertas_de_fato', 'trocar_caminho', 'didatica_ok'],
    'properties': {
        'id': {'type': 'string'},
        'melhorias': {'type': 'array', 'items': {
            'type': 'object', 'additionalProperties': False,
            'required': ['campo', 'depois', 'motivo'],
            'properties': {'campo': {'type': 'string'}, 'depois': {'type': 'string'},
                           'motivo': {'type': 'string'}}}},
        'alertas_de_fato': {'type': 'array', 'items': {'type': 'string'}},
        'trocar_caminho': {'type': 'string'},
        'didatica_ok': {'type': 'boolean'},
    }}

ESQ_CEGO = {
    'type': 'object', 'additionalProperties': False,
    'required': ['id', 'letra', 'razao'],
    'properties': {'id': {'type': 'string'}, 'letra': {'type': 'string'},
                   'razao': {'type': 'string'}}}


# ---------------------------------------------------------------- montar pedidos

def imagem(caminho):
    p = os.path.join(RAIZ, caminho)
    ext = os.path.splitext(p)[1].lower()
    media = {'.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg',
             '.jpeg': 'image/jpeg', '.gif': 'image/gif'}[ext]
    with open(p, 'rb') as h:
        return {'type': 'image', 'source': {'type': 'base64', 'media_type': media,
                                            'data': base64.standard_b64encode(h.read()).decode()}}


def questao_cega(q):
    """Os dados da questão SEM o gabarito (o resolvedor e o 2º especialista trabalham às cegas)."""
    campos = ['id', 'prova', 'conteudo', 'nivel', 'letras', 'tem_figura', 'ler_o_print',
              'sobre_a_prova', 'texto_da_prova', 'alternativas', 'ocr_do_print',
              'sem_gabarito_publicado']
    return {k: q[k] for k in campos if k in q}


def extras_do_lote(lote):
    """fabrica_saida/resolucoes/<lote>/extras.json: {"<id>": {"prints_extra": ["caminho", ...],
    "nota": "..."}}. Serve para a questão cujo texto de apoio está em OUTRO print da mesma prova
    (texto comum a um bloco de questões) ou que precisa de um aviso da sessão."""
    f = os.path.join(SAIDA, lote, 'extras.json')
    return json.load(open(f, encoding='utf-8')) if os.path.exists(f) else {}


def bloco_questao(q, extra=None, extras=None):
    d = questao_cega(q)
    if extra:
        d.update(extra)
    ex = (extras or {}).get(q['id'], {})
    if ex.get('nota'):
        d['aviso_da_sessao'] = ex['nota']
    partes = [imagem(q['print'])]
    texto = 'PRINT DA PROVA acima (é a questão: vale sobre o texto transcrito).'
    for c in ex.get('prints_extra') or []:
        partes.append(imagem(c))
        texto = ('PRINTS DA PROVA acima: o primeiro é a questão; os outros trazem o texto de apoio '
                 'comum ao bloco de questões. Todos valem sobre o texto transcrito.')
    partes.append({'type': 'text',
                   'text': texto + '\n\nDADOS DA QUESTÃO:\n```json\n'
                           + json.dumps(d, ensure_ascii=False, indent=1) + '\n```'})
    return partes


def pedido(custom_id, modelo, sistema, conteudo, esquema, max_tokens=8000, efforto='high'):
    return {
        'custom_id': custom_id,
        'params': {
            'model': modelo,
            'max_tokens': max_tokens,
            # prefixo igual em todos os pedidos da etapa: cache de prompt (leitura a 1/10 do preço)
            'system': [{'type': 'text', 'text': sistema,
                        'cache_control': {'type': 'ephemeral'}}],
            'messages': [{'role': 'user', 'content': conteudo}],
            'output_config': {'effort': efforto,
                              'format': {'type': 'json_schema', 'schema': esquema}},
        }}


def resolucao_para_texto(r, q):
    """A resolução como texto legível, para as lentes lerem (sem JSON cru desnecessário)."""
    return json.dumps(r, ensure_ascii=False, indent=1)


# ---------------------------------------------------------------- orçamento

def preco(modelo, tin, tout, tcache_read=0, tcache_write=0, batch=True):
    p = PRECOS[modelo]
    f = 0.5 if batch else 1.0
    return f * (tin * p['in'] + tout * p['out'] + tcache_read * p['cache_read']
                + tcache_write * p['in'] * 1.25) / 1_000_000


# teto total declarado pelo dono para a fábrica (CLAUDE.md: declare o teto e registre o gasto)
TETO_DONO = 200.0


def gasto_total(lote=None):
    """Gasto já registrado: de um lote (se lote for dado) ou de toda a fábrica."""
    if not os.path.exists(GASTOS):
        return 0.0
    with open(GASTOS, encoding='utf-8') as h:
        return sum(float(r['custo_real'] or r['custo_estimado'] or 0)
                   for r in csv.DictReader(h) if lote is None or r['lote'] == lote)


def cabe_no_orcamento(lote, est, teto):
    """Devolve o motivo da parada, ou None se cabe. Dois tetos: o do lote e o total do dono."""
    no_lote, na_fabrica = gasto_total(lote), gasto_total()
    if no_lote + est > teto:
        return (f'teto do lote {lote}: já gastos US$ {no_lote:.2f} + estimativa US$ {est:.2f} '
                f'passa do teto de US$ {teto:.2f}')
    if na_fabrica + est > TETO_DONO:
        return (f'teto do dono: a fábrica já gastou US$ {na_fabrica:.2f} e a estimativa de '
                f'US$ {est:.2f} passa do teto total de US$ {TETO_DONO:.2f}')
    return None


def anota_gasto(lote, etapa, modelo, tin, tout, tcr, tcw, est, real):
    novo = not os.path.exists(GASTOS)
    os.makedirs(os.path.dirname(GASTOS), exist_ok=True)
    with open(GASTOS, 'a', encoding='utf-8', newline='') as h:
        w = csv.writer(h)
        if novo:
            w.writerow(['data', 'lote', 'etapa', 'modelo', 'tokens_entrada', 'tokens_saida',
                        'tokens_cache_lidos', 'tokens_cache_escritos', 'custo_estimado', 'custo_real'])
        w.writerow([datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%d %H:%M'),
                    lote, etapa, modelo, tin, tout, tcr, tcw, f'{est:.4f}', f'{real:.4f}'])


# ---------------------------------------------------------------- API

def cliente():
    import anthropic
    ch = os.environ.get('APRENDICE_API_KEY') or os.environ.get('ANTHROPIC_API_KEY')
    if not ch:
        sys.exit('Falta a chave: defina APRENDICE_API_KEY no ambiente.')
    return anthropic.Anthropic(api_key=ch)


def conta_tokens(cl, p):
    r = cl.messages.count_tokens(model=p['model'], system=p['system'], messages=p['messages'])
    return r.input_tokens


def estado_arq(lote):
    return os.path.join(SAIDA, lote, 'estado.json')


def le_estado(lote):
    f = estado_arq(lote)
    return json.load(open(f, encoding='utf-8')) if os.path.exists(f) else {'etapas': {}}


def grava_estado(lote, st):
    os.makedirs(os.path.dirname(estado_arq(lote)), exist_ok=True)
    tmp = estado_arq(lote) + '.tmp'
    json.dump(st, open(tmp, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    os.replace(tmp, estado_arq(lote))


def roda_etapa(cl, lote, etapa, pedidos, teto, espera=True):
    """Manda a etapa em batch (ou devolve o resultado já guardado). Respeita o teto de gasto."""
    st = le_estado(lote)
    guardado = st['etapas'].get(etapa, {})
    if guardado.get('resultados') is not None:
        print(f'[{etapa}] já colhido ({len(guardado["resultados"])} respostas)', flush=True)
        return guardado['resultados']
    if not pedidos:
        st['etapas'][etapa] = {'resultados': {}, 'custo': 0.0}
        grava_estado(lote, st)
        return {}

    if not guardado.get('batch_id'):
        # estimativa antes de enviar (tokens x preço atual); não envia se passar do teto
        tin1 = conta_tokens(cl, pedidos[0]['params'])
        n = len(pedidos)
        modelo = pedidos[0]['params']['model']
        tout1 = pedidos[0]['params']['max_tokens'] * 0.45
        est = preco(modelo, tin1 * n, tout1 * n)
        print(f'[{etapa}] {n} pedidos · {modelo} · ~{tin1} tokens de entrada cada · '
              f'estimativa US$ {est:.2f} · já gasto no lote US$ {gasto_total(lote):.2f} '
              f'(teto US$ {teto:.2f}) · na fábrica US$ {gasto_total():.2f} '
              f'(teto do dono US$ {TETO_DONO:.2f})', flush=True)
        parar = cabe_no_orcamento(lote, est, teto)
        if parar:
            sys.exit(f'PARADO no {parar}. Nada enviado.')
        b = cl.messages.batches.create(requests=pedidos)
        st = le_estado(lote)
        st['etapas'][etapa] = {'batch_id': b.id, 'n': n, 'modelo': modelo, 'estimativa': est,
                               'resultados': None}
        grava_estado(lote, st)
        print(f'[{etapa}] batch {b.id} enviado', flush=True)
        guardado = st['etapas'][etapa]

    if not espera:
        return None
    bid = guardado['batch_id']
    while True:
        b = cl.messages.batches.retrieve(bid)
        if b.processing_status == 'ended':
            break
        print(f'[{etapa}] {b.processing_status} · processando {b.request_counts.processing} de '
              f'{guardado["n"]}', flush=True)
        time.sleep(30)

    res, erros = {}, []
    tin = tout = tcr = tcw = 0
    for r in cl.messages.batches.results(bid):
        if r.result.type != 'succeeded':
            erros.append(f'{r.custom_id}: {r.result.type}')
            continue
        msg = r.result.message
        u = msg.usage
        tin += u.input_tokens
        tout += u.output_tokens
        tcr += getattr(u, 'cache_read_input_tokens', 0) or 0
        tcw += getattr(u, 'cache_creation_input_tokens', 0) or 0
        texto = next((b.text for b in msg.content if b.type == 'text'), '')
        if msg.stop_reason == 'refusal':
            erros.append(f'{r.custom_id}: recusa ({getattr(msg.stop_details, "category", "")})')
            continue
        if msg.stop_reason == 'max_tokens':
            erros.append(f'{r.custom_id}: cortado em max_tokens')
            continue
        try:
            res[r.custom_id] = json.loads(texto)
        except Exception as e:
            erros.append(f'{r.custom_id}: JSON inválido ({e})')
    modelo = guardado['modelo']
    real = preco(modelo, tin, tout, tcr, tcw)
    anota_gasto(lote, etapa, modelo, tin, tout, tcr, tcw, guardado.get('estimativa', 0), real)
    st = le_estado(lote)
    st['etapas'][etapa].update(resultados=res, custo=real, erros=erros)
    grava_estado(lote, st)
    print(f'[{etapa}] colhido: {len(res)} ok · {len(erros)} falha(s) · US$ {real:.2f} real '
          f'(cache lido {tcr}, escrito {tcw})', flush=True)
    for e in erros[:10]:
        print('   falha:', e, flush=True)
    return res


# ---------------------------------------------------------------- conversões e patch

def para_dict_letras(lista, campo_valor):
    return {x['letra']: x[campo_valor] for x in (lista or [])}


def normaliza_resolucao(r):
    """Do esquema da API (listas, por causa do json_schema) para o formato do site (dicionários)."""
    r = json.loads(json.dumps(r))
    a = r.get('antes') or {}
    a['simbolos'] = [[s['termo'], s['explicacao']] for s in (a.get('simbolos') or [])]
    a.setdefault('formulas', [])
    r['antes'] = a
    r['erradas'] = para_dict_letras(r.get('erradas'), 'texto')
    for c in ('pista', 'resposta', 'checagem', 'armadilha', 'alerta'):
        r.setdefault(c, '')
    return r


def aplica(questao, campo, valor, log):
    """Aplica uma correção de lente no caminho dado. Devolve True se mudou de verdade."""
    if not re.match(CAMINHOS_PATCH, campo or ''):
        log.append(f'caminho recusado: {campo}')
        return False
    r = questao['resolucao']
    try:
        if campo == 'conceito':
            antes, questao['conceito'] = questao['conceito'], valor
        elif campo.startswith('equivocos.'):
            L = campo.split('.')[1]
            if L not in questao.get('equivocos', {}):
                log.append(f'caminho fora das letras: {campo}')
                return False
            antes, questao['equivocos'][L] = questao['equivocos'][L], valor
        elif campo in ('pista', 'resposta', 'checagem', 'armadilha', 'alerta'):
            antes, r[campo] = r[campo], valor
        elif campo == 'antes.texto':
            antes, r['antes']['texto'] = r['antes']['texto'], valor
        elif campo.startswith('antes.formulas['):
            i = int(re.search(r'\[(\d+)\]', campo).group(1))
            lst = r['antes']['formulas']
            if i >= len(lst):
                lst.append(valor)
                antes = ''
            else:
                antes, lst[i] = lst[i], valor
        elif campo.startswith('antes.simbolos['):
            i, j = (int(x) for x in re.findall(r'\[(\d+)\]', campo))
            lst = r['antes']['simbolos']
            if i >= len(lst):
                log.append(f'símbolo inexistente: {campo}')
                return False
            antes, lst[i][j] = lst[i][j], valor
        elif campo.startswith('passos['):
            i = int(re.search(r'\[(\d+)\]', campo).group(1))
            k = campo.split('.')[1]
            if i >= len(r['passos']):
                log.append(f'passo inexistente: {campo}')
                return False
            antes, r['passos'][i][k] = r['passos'][i][k], valor
        elif campo.startswith('erradas.'):
            L = campo.split('.')[1]
            if L not in r['erradas']:
                log.append(f'caminho fora das letras: {campo}')
                return False
            antes, r['erradas'][L] = r['erradas'][L], valor
        elif campo.startswith('caminhos['):
            i = int(re.search(r'\[(\d+)\]', campo).group(1))
            k = campo.split('.')[1]
            cam = questao.get('caminhos') or []
            if i >= len(cam):
                log.append(f'caminho alternativo inexistente: {campo}')
                return False
            antes, cam[i][k] = cam[i][k], valor
        elif campo.startswith('essencial.'):
            k = campo.split('.')[1]
            antes, r['essencial'][k] = r['essencial'][k], valor
        else:
            log.append(f'caminho desconhecido: {campo}')
            return False
    except Exception as e:
        log.append(f'{campo}: não aplicado ({e})')
        return False
    mudou = str(antes).strip() != str(valor).strip()
    if mudou:
        log.append(f'{campo}: "{str(antes)[:60]}" -> "{str(valor)[:60]}"')
    return mudou


def sem_acento(s):
    import unicodedata
    return ''.join(c for c in unicodedata.normalize('NFD', s)
                   if unicodedata.category(c) != 'Mn')


def codigo_conteudo(q, reclass=''):
    """O código do conteúdo (ex.: P05.4): o do reclass, se houver, senão o da entrada."""
    cod = (reclass or '').strip().upper()
    if re.match(r'^[A-Z]{1,2}\d{2}\.\d+$', cod):
        return cod
    return str(q['conteudo']).split()[0]


_CODIGOS = {}


def codigos_validos(materia='por'):
    """Todos os códigos de conteúdo da matéria, para não jogar fora um código que a lente escolheu
    de propósito (o equívoco aponta o conteúdo DO ERRO, que pode não ser o da questão)."""
    if materia not in _CODIGOS:
        d = json.load(open(os.path.join(PUB, materia, 'materia.json'), encoding='utf-8'))
        _CODIGOS[materia] = {s['id'] for mo in d['modulos'] for s in mo['subs']}
    return _CODIGOS[materia]


def conserta(mq, q, gab, reclass, log):
    """Conserta o que é mecânico (formato), nunca conteúdo: letras das erradas/equívocos e o
    formato do código do equívoco. O que o validador do lote.py exige e o modelo pode errar."""
    r = mq['resolucao']
    esperadas = [L for L in q['letras'] if L != gab]
    cod = codigo_conteudo(q, reclass)
    sobrando = [L for L in r['erradas'] if L not in esperadas]
    if sobrando:
        for L in sobrando:
            r['erradas'].pop(L, None)
        log.append(f'conserto: tirei das erradas letras que não cabem: {sobrando}')
    faltando = [L for L in esperadas if not str(r['erradas'].get(L, '')).strip()]
    if faltando:
        log.append(f'conserto impossível: erradas sem as letras {faltando}')
        return False
    r['erradas'] = {L: r['erradas'][L] for L in esperadas}
    validos = codigos_validos()
    eq = {}
    for L in esperadas:
        v = str((mq.get('equivocos') or {}).get(L, '')).strip()
        prefixo, _, slug = v.partition(':') if ':' in v else ('', '', v)
        slug = re.sub(r'-+', '-', re.sub(r'[^a-z0-9]+', '-', sem_acento(slug).lower())).strip('-')
        if not slug:
            log.append(f'conserto impossível: equívoco vazio na letra {L}')
            return False
        # o conserto é só de FORMA: um código de conteúdo que existe na matéria é mantido, mesmo
        # que não seja o da questão — o equívoco aponta o conteúdo DO ERRO, e é ele que a revisão
        # espaçada usa (pilar 4 de docs/estrategia-revisao.md). Só prefixo vazio ou inválido é trocado.
        prefixo = prefixo.strip().upper()
        novo_v = f'{prefixo if prefixo in validos else cod}:{slug}'
        if novo_v != v:
            log.append(f'conserto: equivocos.{L} "{v}" -> "{novo_v}"')
        eq[L] = novo_v
    mq['equivocos'] = eq
    if not 2 <= len(r['passos']) <= 8:
        log.append(f'conserto impossível: {len(r["passos"])} passos')
        return False
    return True


# ---------------------------------------------------------------- pipeline

def carrega_entrada(f):
    d = json.load(open(f, encoding='utf-8'))
    return d['lote'], d['materia'], {q['id']: q for q in d['questoes']}


def etapa_resolvedor(cl, lote, qs, teto):
    sis = monta('por-resolvedor.md')
    ex = extras_do_lote(lote)
    pedidos = [pedido(qid, MODELO_RESOLVEDOR, sis, bloco_questao(q, extras=ex), ESQ_RESOLVEDOR, 9000)
               for qid, q in qs.items()]
    return roda_etapa(cl, lote, 'resolvedor', pedidos, teto)


def garante_resolvedor(cl, lote, qs, res, teto):
    """Questão que o batch do resolvedor não devolveu é refeita FORA do batch, antes de virar
    pendente.

    Um pedido pode falhar no batch por motivo que nada tem a ver com a questão (`errored`,
    `expired`, cortado em max_tokens). Sem este passo a questão sai do lote como pendente, com o
    motivo "a API não devolveu resposta válida" — e a conferência, que não sabe disso, lê como se
    a questão fosse difícil. Aconteceu em Pedde3b3b (por-0107): o conferente abriu o print, viu
    que a questão se resolve por eliminação com o que está nele, e devolveu a pendência como
    errada. Refazer custa cerca de US$ 0,11; descartar uma questão boa custa a questão.

    Devolve o `res` com as que deram certo acrescentadas, e a conta do que ficou de fora.
    """
    faltam = [qid for qid in qs if res.get(qid) is None]
    if not faltam:
        return res
    print(f'[resolvedor] {len(faltam)} questão(ões) não voltaram do batch; refazendo fora dele: '
          + ', '.join(faltam), flush=True)
    sis = monta('por-resolvedor.md')
    ex = extras_do_lote(lote)
    for qid in faltam:
        p_ = pedido(qid, MODELO_RESOLVEDOR, sis, bloco_questao(qs[qid], extras=ex),
                    ESQ_RESOLVEDOR, 14000)['params']
        est = preco(MODELO_RESOLVEDOR, conta_tokens(cl, p_), 7000, batch=False)
        parar = cabe_no_orcamento(lote, est, teto)
        if parar:
            print(f'[resolvedor] {qid} fica pendente: {parar}', flush=True)
            continue
        try:
            r = cl.messages.create(**p_)
        except Exception as e:
            print(f'[resolvedor] {qid} falhou fora do batch também: {e}', flush=True)
            continue
        custo = preco(MODELO_RESOLVEDOR, r.usage.input_tokens, r.usage.output_tokens,
                      getattr(r.usage, 'cache_read_input_tokens', 0) or 0,
                      getattr(r.usage, 'cache_creation_input_tokens', 0) or 0, batch=False)
        anota_gasto(lote, 'resolvedor-refeito', MODELO_RESOLVEDOR, r.usage.input_tokens,
                    r.usage.output_tokens, getattr(r.usage, 'cache_read_input_tokens', 0) or 0,
                    getattr(r.usage, 'cache_creation_input_tokens', 0) or 0, custo, custo)
        if r.stop_reason == 'max_tokens':
            print(f'[resolvedor] {qid} cortado em max_tokens de novo · US$ {custo:.2f}', flush=True)
            continue
        try:
            res[qid] = json.loads(next(b.text for b in r.content if b.type == 'text'))
            print(f'[resolvedor] {qid} refeita · US$ {custo:.2f}', flush=True)
        except Exception as e:
            print(f'[resolvedor] {qid}: resposta ilegível ({e}) · US$ {custo:.2f}', flush=True)
    return res


def etapa_cego(cl, lote, qs, teto):
    """2º especialista às cegas, só nas questões sem gabarito publicado (princípio 2)."""
    alvo = {k: v for k, v in qs.items() if v.get('sem_gabarito_publicado')}
    sis = monta('por-gabarito-cego.md')
    ex = extras_do_lote(lote)
    pedidos = [pedido(qid, MODELO_LENTE, sis, bloco_questao(q, extras=ex), ESQ_CEGO, 3000)
               for qid, q in alvo.items()]
    return roda_etapa(cl, lote, 'gabarito-cego', pedidos, teto)


def etapa_reconciliacao(cl, lote, qs, res, gabs, teto):
    sis = monta('por-reconciliacao.md')
    ex = extras_do_lote(lote)
    pedidos = []
    for qid, r in res.items():
        if r.get('problema') or gabs.get(qid) in (None, '') or r.get('letra') == gabs[qid]:
            continue
        extra = {'gabarito_oficial': gabs[qid],
                 'letra_do_especialista_as_cegas': r.get('letra'),
                 'resolucao_do_especialista': r.get('resolucao')}
        pedidos.append(pedido(qid, MODELO_LENTE, sis, bloco_questao(qs[qid], extra, ex),
                              ESQ_RECONCILIACAO, 9000))
    return roda_etapa(cl, lote, 'reconciliacao', pedidos, teto)


def etapa_fatos(cl, lote, qs, montadas, teto, etapa='lente-fatos', so=None, alertas=None):
    sis = monta('por-lente-fatos.md')
    ex = extras_do_lote(lote)
    pedidos = []
    for qid, q in montadas.items():
        if so is not None and qid not in so:
            continue
        extra = {'gabarito_oficial': qs[qid].get('gabarito_oficial') or '(não publicado)',
                 'resolucao_proposta': {'conceito': q['conceito'], 'resolucao': q['resolucao'],
                                        'equivocos': q.get('equivocos', {}),
                                        'caminhos': q.get('caminhos') or []}}
        if (alertas or {}).get(qid):
            # a lente didática viu um possível erro de FATO e, por regra, não corrigiu: é seu
            extra['erro_de_fato_apontado_pela_lente_didatica'] = alertas[qid]
        pedidos.append(pedido(qid, MODELO_LENTE, sis, bloco_questao(qs[qid], extra, ex),
                              ESQ_FATOS, 8000))
    return roda_etapa(cl, lote, etapa, pedidos, teto)


def garante_lente_de_fatos(cl, lote, qs, montadas, pendentes, diario, fatos, alvo, teto,
                           etapa='lente-fatos'):
    """Princípio 3: nada vai ao ar sem a lente de fatos. Se o pedido de uma questão falhou no batch
    (acontece: cortado em max_tokens), ela é refeita FORA do batch, com mais espaço. Se falhar de
    novo, vira pendente — nunca segue como `ok` sem ninguém ter assinado os fatos dela.

    Esse buraco deixou uma questão inteira sem conferência de fatos no lote por-0103 (Pa9e70302,
    cortada nas duas passadas), e ela foi ao ar com um erro que a lente didática havia apontado."""
    faltaram = [qid for qid in alvo if qid in montadas and qid not in fatos]
    if not faltaram:
        return
    print(f'[{etapa}] {len(faltaram)} questão(ões) sem resposta da lente: refazendo fora do batch '
          f'({", ".join(faltaram)})', flush=True)
    sis = monta('por-lente-fatos.md')
    ex = extras_do_lote(lote)
    for qid in faltaram:
        q = montadas[qid]
        extra = {'gabarito_oficial': qs[qid].get('gabarito_oficial') or '(não publicado)',
                 'resolucao_proposta': {'conceito': q['conceito'], 'resolucao': q['resolucao'],
                                        'equivocos': q.get('equivocos', {}),
                                        'caminhos': q.get('caminhos') or []}}
        p_ = pedido(qid, MODELO_LENTE, sis, bloco_questao(qs[qid], extra, ex), ESQ_FATOS,
                    16000)['params']
        est = preco(MODELO_LENTE, conta_tokens(cl, p_), 8000, batch=False)
        if cabe_no_orcamento(lote, est, teto):
            pendentes[qid] = ('a lente de fatos não conferiu esta questão (pedido falhou no batch e '
                              'o teto de gasto não deixou refazer): princípio 3')
            montadas.pop(qid, None)
            continue
        r = cl.messages.create(**p_)
        custo = preco(MODELO_LENTE, r.usage.input_tokens, r.usage.output_tokens,
                      getattr(r.usage, 'cache_read_input_tokens', 0) or 0,
                      getattr(r.usage, 'cache_creation_input_tokens', 0) or 0, batch=False)
        anota_gasto(lote, etapa + '-resgate', MODELO_LENTE, r.usage.input_tokens,
                    r.usage.output_tokens, getattr(r.usage, 'cache_read_input_tokens', 0) or 0,
                    getattr(r.usage, 'cache_creation_input_tokens', 0) or 0, custo, custo)
        if r.stop_reason != 'end_turn':
            pendentes[qid] = (f'a lente de fatos não conferiu esta questão (o pedido falhou no batch '
                              f'e de novo fora dele: {r.stop_reason}): princípio 3')
            montadas.pop(qid, None)
            diario.setdefault(qid, []).append('lente de fatos: nao conferida -> pendente')
            continue
        fatos[qid] = json.loads(next(b.text for b in r.content if b.type == 'text'))
        diario.setdefault(qid, []).append(
            f'lente de fatos refeita fora do batch (o pedido do batch falhou) · US$ {custo:.2f}')


def etapa_didatica(cl, lote, qs, montadas, teto):
    sis = monta('por-lente-didatica.md')
    ex = extras_do_lote(lote)
    pedidos = []
    for qid, q in montadas.items():
        extra = {'resolucao_conferida_nos_fatos': {'conceito': q['conceito'],
                                                   'resolucao': q['resolucao'],
                                                   'caminhos': q.get('caminhos', [])}}
        pedidos.append(pedido(qid, MODELO_LENTE, sis, bloco_questao(qs[qid], extra, ex),
                              ESQ_DIDATICA, 5000))
    return roda_etapa(cl, lote, 'lente-didatica', pedidos, teto)


def monta_questao(qid, r, letra):
    """Uma questão no formato da saída do lote.py, a partir do que o resolvedor devolveu."""
    return {
        'id': qid,
        'status': 'ok',
        'conceito': r.get('conceito', ''),
        'resolucao': normaliza_resolucao(r['resolucao']),
        'equivocos': para_dict_letras(r.get('equivocos'), 'codigo'),
        'fontes': r.get('fontes') or [],
        'caminhos': r.get('caminhos') or [],
        '_letra': letra,
    }


def pipeline(cl, entrada, saida, teto):
    lote, materia, qs = carrega_entrada(entrada)
    gabs = {k: v.get('gabarito_oficial') for k, v in qs.items()}
    os.makedirs(os.path.join(SAIDA, lote), exist_ok=True)
    diario = {}

    res = etapa_resolvedor(cl, lote, qs, teto)
    res = garante_resolvedor(cl, lote, qs, res, teto)
    cego = etapa_cego(cl, lote, qs, teto)

    # gabarito do Aprendice: duas letras às cegas têm de bater (e com o preliminar, se houver)
    gab_aprendice = {}
    for qid, q in qs.items():
        if not q.get('sem_gabarito_publicado'):
            continue
        l1 = (res.get(qid) or {}).get('letra')
        l2 = (cego.get(qid) or {}).get('letra')
        pre = q.get('gabarito_preliminar') or ''
        gab_aprendice[qid] = {'letra': l1, 'letra_conferente': l2, 'preliminar': pre,
                              'fontes_web': []}
        if l1 and l2 and l1 == l2 and (not pre or l1 == pre):
            gabs[qid] = l1

    recon = etapa_reconciliacao(cl, lote, qs, res, gabs, teto)

    # ---- monta o que está resolvido e o que já saiu pendente
    montadas, pendentes = {}, {}
    for qid in qs:
        r = res.get(qid)
        if r is None:
            pendentes[qid] = ('falha da API, não da questão: o pedido não voltou do batch e '
                              'também não deu certo fora dele. A questão não foi avaliada — '
                              'rode `resolve` e depois `lente` nela antes de descartá-la')
            continue
        if r.get('problema'):
            pendentes[qid] = r['problema']
            continue
        q = qs[qid]
        if q.get('sem_gabarito_publicado'):
            ga = gab_aprendice[qid]
            if not (ga['letra'] and ga['letra_conferente'] and ga['letra'] == ga['letra_conferente']
                    and (not ga['preliminar'] or ga['letra'] == ga['preliminar'])):
                pendentes[qid] = ('gabarito do Aprendice não fechou: especialista '
                                  f'{ga["letra"]} × conferente {ga["letra_conferente"]}'
                                  + (f' × preliminar {ga["preliminar"]}' if ga['preliminar'] else ''))
                continue
            montadas[qid] = monta_questao(qid, r, ga['letra'])
            montadas[qid]['gabarito_aprendice'] = {k: ga[k] for k in
                                                   ('letra', 'letra_conferente', 'fontes_web')}
            diario.setdefault(qid, []).append(f'gabarito do Aprendice: {ga["letra"]} (duas letras às cegas)')
            continue
        gab = gabs[qid]
        if r.get('letra') == gab:
            montadas[qid] = monta_questao(qid, r, gab)
            continue
        # letra diferente do gabarito oficial: a reconciliação decide
        rc = recon.get(qid)
        diario.setdefault(qid, []).append(
            f'divergência: resolvedor {r.get("letra")} × oficial {gab}')
        if rc is None:
            pendentes[qid] = (f'divergência sem reconciliação: resolvedor {r.get("letra")} × '
                              f'oficial {gab}')
            continue
        if rc['decisao'] != 'oficial':
            pendentes[qid] = rc['motivo'] or f'divergência {r.get("letra")} × {gab}'
            diario[qid].append(f'reconciliação: {rc["decisao"]} — {rc.get("motivo", "")[:120]}')
            continue
        montadas[qid] = monta_questao(qid, rc, gab)
        diario[qid].append('reconciliação: resolvida com o gabarito oficial · leitura da banca: '
                           + (rc.get('leitura_da_banca', '') or '')[:200])

    # ---- lente de fatos
    fatos = etapa_fatos(cl, lote, qs, montadas, teto)
    garante_lente_de_fatos(cl, lote, qs, montadas, pendentes, diario, fatos,
                           list(montadas), teto)
    mudou_por_fatos = set()
    for qid, f in fatos.items():
        if qid not in montadas:
            continue
        log = []
        if f.get('reprovar'):
            pendentes[qid] = 'lente de fatos reprovou: ' + f['reprovar']
            montadas.pop(qid)
            diario.setdefault(qid, []).append('lente de fatos: REPROVOU — ' + f['reprovar'][:200])
            continue
        for c in f.get('correcoes') or []:
            if aplica(montadas[qid], c['campo'], c['depois'], log):
                mudou_por_fatos.add(qid)
        if f.get('fontes'):
            montadas[qid]['fontes'] = (montadas[qid].get('fontes') or []) + f['fontes']
        if f.get('reclass'):
            diario.setdefault(qid, []).append('RECLASS sugerido pela lente de fatos: ' + f['reclass'])
        if f.get('dado_divergente'):
            diario.setdefault(qid, []).append('DADO (lente de fatos): ' + f['dado_divergente'])
        if log:
            diario.setdefault(qid, []).append('fatos: ' + ' | '.join(log))
        if not f.get('fatos_ok'):
            diario.setdefault(qid, []).append('atenção: lente de fatos não marcou fatos_ok')

    # ---- lente didática
    did = etapa_didatica(cl, lote, qs, montadas, teto)
    mudou_por_didatica = set()
    alertas_didatica = {}
    for qid, f in did.items():
        if qid not in montadas:
            continue
        log = []
        for c in f.get('melhorias') or []:
            if aplica(montadas[qid], c['campo'], c['depois'], log):
                mudou_por_didatica.add(qid)
        if f.get('alertas_de_fato'):
            alertas_didatica[qid] = ' | '.join(f['alertas_de_fato'])
            diario.setdefault(qid, []).append('didática viu possível erro de fato: '
                                              + alertas_didatica[qid])
        if log:
            diario.setdefault(qid, []).append('didática: ' + ' | '.join(log))

    # ---- lente de fatos de novo, só no que a didática mudou
    alvo = {qid for qid in (mudou_por_didatica | set(alertas_didatica)) if qid in montadas}
    fatos2 = etapa_fatos(cl, lote, qs, montadas, teto, etapa='lente-fatos-2', so=alvo,
                         alertas=alertas_didatica)
    garante_lente_de_fatos(cl, lote, qs, montadas, pendentes, diario, fatos2, alvo, teto,
                           etapa='lente-fatos-2')
    for qid, f in fatos2.items():
        if qid not in montadas:
            continue
        log = []
        if f.get('reprovar'):
            pendentes[qid] = 'lente de fatos (2ª passada) reprovou: ' + f['reprovar']
            montadas.pop(qid)
            continue
        for c in f.get('correcoes') or []:
            aplica(montadas[qid], c['campo'], c['depois'], log)
        if log:
            diario.setdefault(qid, []).append('fatos (2ª passada): ' + ' | '.join(log))

    # ---- obras literárias e avisos para a sessão conferir
    for qid, r in res.items():
        if qid in montadas and r.get('depende_da_obra'):
            diario.setdefault(qid, []).append('OBRA (confirmar na web): ' + (r.get('obra') or ''))
        if qid in montadas and r.get('reclass'):
            diario.setdefault(qid, []).append('RECLASS sugerido pelo resolvedor: ' + r['reclass'])
        if qid in montadas and r.get('dado_divergente'):
            diario.setdefault(qid, []).append('DADO (resolvedor): ' + r['dado_divergente'])
        if qid in montadas and (r.get('confianca') == 'baixa'):
            diario.setdefault(qid, []).append('confiança baixa declarada pelo resolvedor')

    # ---- escreve a saída no formato do lote.py
    for qid in list(montadas):
        log = []
        reclass = ((res.get(qid) or {}).get('reclass')
                   or (fatos.get(qid) or {}).get('reclass') or '')
        if not conserta(montadas[qid], qs[qid], montadas[qid]['_letra'], reclass, log):
            pendentes[qid] = 'formato da saída: ' + ' | '.join(log)
            montadas.pop(qid)
        if log:
            diario.setdefault(qid, []).extend(log)

    questoes = []
    for qid in qs:
        if qid in montadas:
            q = dict(montadas[qid])
            q.pop('_letra', None)
            if not q.get('caminhos'):
                q.pop('caminhos', None)
            questoes.append(q)
        else:
            questoes.append({'id': qid, 'status': 'pendente',
                             'motivo': pendentes.get(qid, 'não resolvida pela fábrica')})
    json.dump({'lote': lote, 'conferido': False, 'questoes': questoes},
              open(saida, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    rel = os.path.join(SAIDA, lote, 'relatorio.json')
    json.dump({'lote': lote, 'ok': len(montadas), 'pendentes': len(questoes) - len(montadas),
               'mudou_por_fatos': sorted(mudou_por_fatos),
               'mudou_por_didatica': sorted(mudou_por_didatica),
               'diario': diario}, open(rel, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(f'\nSaída: {saida}')
    print(f'Relatório: {rel}')
    print(f'{lote}: {len(montadas)} ok · {len(questoes) - len(montadas)} pendente(s) · '
          f'gasto do lote US$ {gasto_total(lote):.2f} · da fábrica US$ {gasto_total():.2f}')


# ---------------------------------------------------------------- comandos

def cmd_estima(entrada, teto):
    cl = cliente()
    lote, materia, qs = carrega_entrada(entrada)
    sis = {'resolvedor': monta('por-resolvedor.md'), 'fatos': monta('por-lente-fatos.md'),
           'didatica': monta('por-lente-didatica.md')}
    q0 = list(qs.values())[0]
    linhas, total = [], 0.0
    for nome, modelo, s, mx in (('resolvedor', MODELO_RESOLVEDOR, sis['resolvedor'], 9000),
                                ('lente-fatos', MODELO_LENTE, sis['fatos'], 5000),
                                ('lente-didatica', MODELO_LENTE, sis['didatica'], 5000),
                                ('lente-fatos-2', MODELO_LENTE, sis['fatos'], 5000)):
        p = pedido('x', modelo, s, bloco_questao(q0, extras=extras_do_lote(lote)),
                   ESQ_RESOLVEDOR, mx)['params']
        tin = conta_tokens(cl, p)
        n = len(qs) if nome != 'lente-fatos-2' else max(1, len(qs) // 2)
        c = preco(modelo, tin * n, mx * 0.45 * n)
        linhas.append(f'{nome:16} {modelo:20} {n:3} pedidos · {tin:6} tokens/pedido · US$ {c:5.2f}')
        total += c
    print('\n'.join(linhas))
    print(f'{"TOTAL":16} {"":20} {"":3}         {"":6}            US$ {total:5.2f}  (teto US$ {teto:.2f})')
    print(f'já gasto neste lote: US$ {gasto_total(lote):.2f} · '
          f'na fábrica: US$ {gasto_total():.2f} (teto do dono US$ {TETO_DONO:.2f})')


def cmd_teste(entrada, n, teto):
    """Messages comum (sem batch) em 2 ou 3 questões, para ver se o esquema e os prompts rodam."""
    cl = cliente()
    lote, materia, qs = carrega_entrada(entrada)
    sis = monta('por-resolvedor.md')
    escolhidas = list(qs.items())[:n]
    for qid, q in escolhidas:
        p = pedido(qid, MODELO_RESOLVEDOR, sis, bloco_questao(q, extras=extras_do_lote(lote)),
                   ESQ_RESOLVEDOR, 9000)['params']
        r = cl.messages.create(**p)
        t = next((b.text for b in r.content if b.type == 'text'), '')
        d = json.loads(t)
        custo = preco(MODELO_RESOLVEDOR, r.usage.input_tokens, r.usage.output_tokens,
                      getattr(r.usage, 'cache_read_input_tokens', 0) or 0,
                      getattr(r.usage, 'cache_creation_input_tokens', 0) or 0, batch=False)
        anota_gasto(lote, 'teste-resolvedor', MODELO_RESOLVEDOR, r.usage.input_tokens,
                    r.usage.output_tokens, getattr(r.usage, 'cache_read_input_tokens', 0) or 0,
                    getattr(r.usage, 'cache_creation_input_tokens', 0) or 0, custo, custo)
        bate = 'IGUAL' if d.get('letra') == q.get('gabarito_oficial') else 'DIFERENTE'
        print(f'{qid}: letra {d.get("letra")} · oficial {q.get("gabarito_oficial")} · {bate} · '
              f'problema="{d.get("problema", "")[:60]}" · passos={len(d["resolucao"]["passos"])} · '
              f'US$ {custo:.3f} (in {r.usage.input_tokens}, out {r.usage.output_tokens})')
        f = os.path.join(SAIDA, lote, f'teste-{qid}.json')
        os.makedirs(os.path.dirname(f), exist_ok=True)
        json.dump(d, open(f, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(f'gasto total registrado: US$ {gasto_total():.2f}')


def cmd_lente(entrada, saida, ids, teto, max_tokens=12000):
    """Roda a lente de fatos por Messages (sem batch) em poucas questões de uma saída já escrita,
    aplica as correções no lugar e registra no relatório. Serve para a questão que foi cortada em
    max_tokens no batch e para a reconferência dos itens corrigidos (passo 5 do padrão)."""
    cl = cliente()
    lote, materia, qs = carrega_entrada(entrada)
    d = json.load(open(saida, encoding='utf-8'))
    por_id = {q['id']: q for q in d['questoes']}
    rel_f = os.path.join(SAIDA, lote, 'relatorio.json')
    rel = json.load(open(rel_f, encoding='utf-8'))
    sis = monta('por-lente-fatos.md')
    for qid in ids:
        mq = por_id.get(qid)
        if not mq or mq.get('status') != 'ok':
            print(f'{qid}: fora da saída ou não está ok — pulado')
            continue
        extra = {'gabarito_oficial': qs[qid].get('gabarito_oficial') or '(não publicado)',
                 'resolucao_proposta': {'conceito': mq['conceito'], 'resolucao': mq['resolucao'],
                                        'equivocos': mq.get('equivocos', {})}}
        p = pedido(qid, MODELO_LENTE, sis, bloco_questao(qs[qid], extra, extras_do_lote(lote)),
                   ESQ_FATOS, max_tokens)['params']
        est = preco(MODELO_LENTE, conta_tokens(cl, p), max_tokens * 0.5, batch=False)
        parar = cabe_no_orcamento(lote, est, teto)
        if parar:
            sys.exit(f'PARADO no {parar}. Nada enviado.')
        r = cl.messages.create(**p)
        custo = preco(MODELO_LENTE, r.usage.input_tokens, r.usage.output_tokens,
                      getattr(r.usage, 'cache_read_input_tokens', 0) or 0,
                      getattr(r.usage, 'cache_creation_input_tokens', 0) or 0, batch=False)
        anota_gasto(lote, 'lente-fatos-avulsa', MODELO_LENTE, r.usage.input_tokens,
                    r.usage.output_tokens, getattr(r.usage, 'cache_read_input_tokens', 0) or 0,
                    getattr(r.usage, 'cache_creation_input_tokens', 0) or 0, custo, custo)
        if r.stop_reason == 'max_tokens':
            print(f'{qid}: cortado em max_tokens de novo (use --max-tokens maior) · US$ {custo:.2f}')
            continue
        f = json.loads(next(b.text for b in r.content if b.type == 'text'))
        log = []
        if f.get('reprovar'):
            mq.clear()
            mq.update({'id': qid, 'status': 'pendente',
                       'motivo': 'lente de fatos reprovou: ' + f['reprovar']})
            log.append('lente de fatos avulsa: REPROVOU — ' + f['reprovar'])
        else:
            for c in f.get('correcoes') or []:
                aplica(mq, c['campo'], c['depois'], log)
            if f.get('fontes'):
                mq['fontes'] = (mq.get('fontes') or []) + f['fontes']
            if f.get('reclass'):
                log.append('RECLASS sugerido pela lente de fatos: ' + f['reclass'])
            if f.get('dado_divergente'):
                log.append('DADO (lente de fatos): ' + f['dado_divergente'])
            if not f.get('fatos_ok'):
                log.append('atenção: lente de fatos avulsa não marcou fatos_ok')
        rel.setdefault('diario', {}).setdefault(qid, []).extend(
            ['lente de fatos avulsa: ' + x for x in log] or ['lente de fatos avulsa: sem correções'])
        print(f'{qid}: minha_letra {f.get("minha_letra")} · fatos_ok {f.get("fatos_ok")} · '
              f'{len(f.get("correcoes") or [])} correção(ões) · US$ {custo:.2f}')
        for x in log:
            print('   ', x[:200])
    json.dump(d, open(saida, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    json.dump(rel, open(rel_f, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(f'gasto total registrado: US$ {gasto_total():.2f}')


def cmd_resolve(entrada, saida, ids, teto, max_tokens=14000):
    """Resolve poucas questões por Messages (sem batch) e grava na saída, no lugar do que estava.
    Serve para a questão que o batch não devolveu (aconteceu uma vez em 11 lotes) e para refazer
    uma questão do zero. Depois é obrigatório passar o comando `lente` nessas questões: nada vai ao
    ar sem a lente de fatos (princípio 3)."""
    cl = cliente()
    lote, materia, qs = carrega_entrada(entrada)
    d = json.load(open(saida, encoding='utf-8'))
    por = {q['id']: q for q in d['questoes']}
    sis = monta('por-resolvedor.md')
    ex = extras_do_lote(lote)
    for qid in ids:
        if qid not in qs:
            print(f'{qid}: não é deste lote — pulado')
            continue
        p_ = pedido(qid, MODELO_RESOLVEDOR, sis, bloco_questao(qs[qid], extras=ex),
                    ESQ_RESOLVEDOR, max_tokens)['params']
        est = preco(MODELO_RESOLVEDOR, conta_tokens(cl, p_), max_tokens * 0.5, batch=False)
        parar = cabe_no_orcamento(lote, est, teto)
        if parar:
            sys.exit(f'PARADO no {parar}. Nada enviado.')
        r = cl.messages.create(**p_)
        custo = preco(MODELO_RESOLVEDOR, r.usage.input_tokens, r.usage.output_tokens,
                      getattr(r.usage, 'cache_read_input_tokens', 0) or 0,
                      getattr(r.usage, 'cache_creation_input_tokens', 0) or 0, batch=False)
        anota_gasto(lote, 'resolvedor-avulso', MODELO_RESOLVEDOR, r.usage.input_tokens,
                    r.usage.output_tokens, getattr(r.usage, 'cache_read_input_tokens', 0) or 0,
                    getattr(r.usage, 'cache_creation_input_tokens', 0) or 0, custo, custo)
        if r.stop_reason == 'max_tokens':
            print(f'{qid}: cortado em max_tokens · US$ {custo:.2f}')
            continue
        res = json.loads(next(b.text for b in r.content if b.type == 'text'))
        gab = qs[qid].get('gabarito_oficial')
        if res.get('problema'):
            por[qid].clear()
            por[qid].update({'id': qid, 'status': 'pendente', 'motivo': res['problema']})
            print(f'{qid}: pendente — {res["problema"][:120]} · US$ {custo:.2f}')
            continue
        if gab and res.get('letra') != gab:
            por[qid].clear()
            por[qid].update({'id': qid, 'status': 'pendente',
                             'motivo': f'divergência no resolvedor avulso: {res.get("letra")} × '
                                       f'oficial {gab} (precisa de reconciliação)'})
            print(f'{qid}: divergência {res.get("letra")} × {gab} · US$ {custo:.2f}')
            continue
        mq = monta_questao(qid, res, gab or res.get('letra'))
        mq.pop('_letra', None)
        log = []
        if not conserta(mq, qs[qid], gab or res.get('letra'), res.get('reclass', ''), log):
            print(f'{qid}: formato — {log} · US$ {custo:.2f}')
            continue
        if not mq.get('caminhos'):
            mq.pop('caminhos', None)
        por[qid].clear()
        por[qid].update(mq)
        print(f'{qid}: resolvida com {gab or res.get("letra")} · {len(mq["resolucao"]["passos"])} '
              f'passos · US$ {custo:.2f} · AGORA RODE O COMANDO `lente` NESTA QUESTÃO')
        if log:
            print('   conserto:', log)
    json.dump(d, open(saida, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(f'gasto do lote US$ {gasto_total(lote):.2f} · da fábrica US$ {gasto_total():.2f}')


def cmd_patch(saida, arquivos, so_ver=False):
    """Aplica os patches da conferência (patch-*.json) na saída do lote.

    Cada arquivo traz {"patches": [{id, campo, depois, motivo}], "fontes": {id: [...]},
    "nao_confirmado": [...]}. O campo passa pelo mesmo `aplica()` das lentes, com a
    mesma lista de caminhos permitidos: patch que aponte para campo inexistente ou
    fora da lista é recusado e aparece no relatório, nunca entra calado.
    """
    d = json.load(open(saida, encoding='utf-8'))
    por_id = {q['id']: q for q in d['questoes']}
    log, recusados, fontes_novas = [], [], 0
    for arq in arquivos:
        p = json.load(open(arq, encoding='utf-8'))
        nome = os.path.basename(arq)
        for c in p.get('patches', []):
            q = por_id.get(c['id'])
            if q is None:
                recusados.append(f"{nome}: {c['id']} não está no lote")
                continue
            antes = len(log)
            if not aplica(q, c['campo'], c['depois'], log):
                if len(log) > antes:
                    recusados.append(f"{nome}: {c['id']} {log[-1]}")
                else:
                    recusados.append(f"{nome}: {c['id']} {c['campo']} já estava assim")
        for qid, nova in (p.get('resolucao_nova') or {}).items():
            q = por_id.get(qid)
            if q is None:
                recusados.append(f'{nome}: resolucao_nova de {qid} fora do lote')
                continue
            faltam = [c for c in ('conceito', 'resolucao', 'equivocos') if c not in nova]
            if faltam:
                recusados.append(f'{nome}: resolucao_nova de {qid} sem {faltam}')
                continue
            for c in ('conceito', 'resolucao', 'equivocos', 'fontes', 'caminhos'):
                if c in nova:
                    q[c] = nova[c]
            q['status'] = 'ok'
            q.pop('motivo', None)
            log.append(f'{qid}: resolução inteira trocada (estava pendente)')
        for qid, fs in (p.get('fontes') or {}).items():
            q = por_id.get(qid)
            if q is None:
                recusados.append(f'{nome}: fontes de {qid} fora do lote')
                continue
            tinha = {json.dumps(f, sort_keys=True) for f in (q.get('fontes') or [])}
            for f in fs:
                if json.dumps(f, sort_keys=True) not in tinha:
                    q.setdefault('fontes', []).append(f)
                    fontes_novas += 1
    print(f'{len([l for l in log if ":" in l])} campo(s) mudado(s) · {fontes_novas} fonte(s) nova(s)')
    for r in recusados:
        print('  RECUSADO', r)
    if so_ver:
        return
    json.dump(d, open(saida, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(f'gravado em {saida}')


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument('comando', choices=['estima', 'teste', 'roda', 'lente', 'resolve', 'patch'])
    ap.add_argument('entrada')
    ap.add_argument('--saida', default=None)
    ap.add_argument('--n', type=int, default=3)
    ap.add_argument('--teto', type=float, default=10.0)
    ap.add_argument('--ids', default='', help='ids separados por vírgula (comando lente)')
    ap.add_argument('--max-tokens', type=int, default=12000)
    ap.add_argument('--patches', nargs='*', default=[], help='arquivos patch-*.json (comando patch)')
    ap.add_argument('--so-ver', action='store_true', help='mostra o que mudaria e não grava')
    a = ap.parse_args()
    if a.comando == 'estima':
        cmd_estima(a.entrada, a.teto)
    elif a.comando == 'teste':
        cmd_teste(a.entrada, a.n, a.teto)
    elif a.comando == 'patch':
        if not a.patches:
            sys.exit('patch precisa de --patches arquivo1.json [arquivo2.json ...]')
        cmd_patch(a.entrada, a.patches, a.so_ver)
    elif a.comando == 'resolve':
        if not a.saida or not a.ids:
            sys.exit('resolve precisa de --saida e --ids')
        cmd_resolve(a.entrada, a.saida, [x.strip() for x in a.ids.split(',') if x.strip()],
                    a.teto, a.max_tokens)
    elif a.comando == 'lente':
        if not a.saida or not a.ids:
            sys.exit('lente precisa de --saida e --ids')
        cmd_lente(a.entrada, a.saida, [x.strip() for x in a.ids.split(',') if x.strip()],
                  a.teto, a.max_tokens)
    else:
        if not a.saida:
            sys.exit('roda precisa de --saida')
        pipeline(cliente(), a.entrada, a.saida, a.teto)


if __name__ == '__main__':
    main()

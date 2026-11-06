"""Fábrica de resoluções pela API do Claude (comando 25, docs/fabrica-de-conteudo-api.md).

Linha de produção por questão, cada etapa um lote (Message Batches, metade do preço):
  1. resolvedor  (claude-sonnet-5-5) — resolve SEM ver o gabarito; o código compara com o gabarito publicado
  2. fatos       (claude-opus-5-5)   — outro especialista resolve do zero, confere cada fato/conta e corrige
  3. didatica    (claude-opus-5-5)   — melhora o ensino sem mudar fatos
  4. fatos-volta (claude-opus-5-5)   — a lente de fatos volta em tudo que mudou
Aprovada só se: resposta do resolvedor = gabarito oficial, fatos ok, didática ok e fatos-volta ok.
Divergência ou reprovação → fila de exceção (excecoes.json), nunca vai ao ar.

Uso:
  python3 ferramentas/fabrica/resolucoes_api.py seleciona <lote> <prova> <n1,n2,...>
  python3 ferramentas/fabrica/resolucoes_api.py roda <lote> --teto 15      (retoma de onde parou)
  python3 ferramentas/fabrica/resolucoes_api.py integra <lote>             (grava as aprovadas em resolucoes.json da prova)

Chave: variável de ambiente APRENDICE_API_KEY (enviada como Authorization: Bearer). Nunca no código.
Saída: fabrica_saida/api/<lote>/ (fora do site até a integração). Gasto: fabrica_saida/gastos.csv.
"""
import base64
import csv
import datetime
import json
import os
import re
import sys
import time

import anthropic
from anthropic.types.message_create_params import MessageCreateParamsNonStreaming
from anthropic.types.messages.batch_create_params import Request

RAIZ = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
AGENTES = os.path.join(RAIZ, 'ferramentas', 'fabrica', 'agentes')
SKILL = os.path.join(RAIZ, '.claude', 'skills', 'resolucao-exercicios')
PROVAS = os.path.join(RAIZ, 'app', 'conteudo-fonte', 'provas')
SAIDA = os.path.join(RAIZ, 'fabrica_saida', 'api')
GASTOS = os.path.join(RAIZ, 'fabrica_saida', 'gastos.csv')

ETAPAS = ['resolvedor', 'fatos', 'didatica', 'fatos-volta']
# orçamento do dono: US$ 200 no total (06/11/2026). A lente de fatos, a mais crítica, fica no Opus; as outras no Sonnet.
MODELO = {'resolvedor': 'claude-sonnet-5-5', 'fatos': 'claude-opus-5-5',
          'didatica': 'claude-sonnet-5-5', 'fatos-volta': 'claude-sonnet-5-5'}
ESFORCO = {'resolvedor': 'high', 'fatos': 'medium', 'didatica': 'medium', 'fatos-volta': 'medium'}
# US$ por milhão de tokens, já com o desconto de 50% do Batches (entrada, saída, leitura de cache, escrita de cache)
PRECO = {'claude-sonnet-5-5': (1.0, 5.0, 0.10, 1.25), 'claude-opus-5-5': (2.0, 10.0, 0.20, 2.5)}
BUSCA_US = 0.01  # por busca na web
# estimativa por questão e etapa (para conferir o teto ANTES de mandar o lote)
ESTIMATIVA_US = {'resolvedor': 0.04, 'fatos': 0.08, 'didatica': 0.03, 'fatos-volta': 0.03}

GUIA = {'mat': 'matematica', 'por': 'portugues', 'bio': 'biologia', 'qui': 'quimica', 'fis': 'fisica',
        'geo': 'geografia', 'his': 'historia', 'ing': 'ingles'}
NOME_MATERIA = {'mat': 'Matemática', 'por': 'Português', 'bio': 'Biologia', 'qui': 'Química', 'fis': 'Física',
                'geo': 'Geografia', 'his': 'História', 'ing': 'Inglês', 'fs': 'Filosofia e Sociologia'}
CAMPOS_RES = ['antes', 'pista', 'passos', 'resposta', 'checagem', 'erradas', 'armadilha', 'alerta', 'essencial']


def ler(p):
    with open(p, encoding='utf-8') as f:
        return f.read()


def ler_json(p):
    with open(p, encoding='utf-8') as f:
        return json.load(f)


def gravar_json(p, d):
    os.makedirs(os.path.dirname(p), exist_ok=True)
    tmp = p + '.tmp'
    with open(tmp, 'w', encoding='utf-8') as f:
        json.dump(d, f, ensure_ascii=False, indent=1)
    os.replace(tmp, p)


def cliente():
    chave = os.environ.get('APRENDICE_API_KEY')
    if not chave:
        sys.exit('APRENDICE_API_KEY não está definida neste ambiente.')
    return anthropic.Anthropic(auth_token=chave, max_retries=4)


# ---------------------------------------------------------------- prompts

ADAPTA = """
## Como você trabalha nesta etapa (programa da fábrica, pela API)
- Não há arquivos nem ferramenta Read: o print fiel da questão vem ANEXADO como imagem, junto com o texto extraído
  do PDF oficial (o texto pode ter lixo de diagramação; o print manda).
- Responda SOMENTE com um objeto JSON válido, dentro de um bloco ```json ... ```, sem texto fora do bloco.
- Fração (CLAUDE.md: sempre empilhada na tela): escreva "numerador/denominador" ("119/6", "(60 + 64)/2", "x/(x + 1)")
  ou "a ÷ b"; o site desenha a fração empilhada a partir disso. Nunca use LaTeX (\\frac, \\cdot, \\text) em nenhum
  campo, nem no `quadro`: use ×, ·, ≈, ², ³, "10^−3", "R_2026", como no caderno.
- Tela de celular (390 px): `passos[].conta` e `quadro[].linha` são escritos À MÃO pelo site e NÃO quebram linha.
  Cada um cabe em ~30 caracteres: conta curta ("C=O no anel → cetona"); frase vai no `porque`; conta longa vira duas
  linhas ("m = 1,4 × 2000" / "m = 2800 mg"). Lista de itens: "Composto 1: fenol, ácido" em linhas separadas.
- Se o JSON trouxer "nota_conferencia", ela vem da conferência na tela: resolva exatamente o que ela aponta.
- Questão Aprendice NÃO é o caso aqui: esta é questão REAL de prova; nunca altere o enunciado.
"""


def especialista(materia, tema):
    if materia == 'fs':
        return ler(os.path.join(AGENTES, 'especialistas', 'fil.md' if (tema or '').startswith('L') else 'soc.md'))
    return ler(os.path.join(AGENTES, 'especialistas', materia + '.md'))


def sistema(etapa, materia, tema):
    brief = {'resolvedor': 'BRIEF_RESOLVEDOR.md', 'fatos': 'BRIEF_LENTE_FATOS.md',
             'didatica': 'BRIEF_LENTE_DIDATICA.md', 'fatos-volta': 'BRIEF_LENTE_FATOS.md'}[etapa]
    partes = [ler(os.path.join(AGENTES, brief)), '# Especialista da matéria\n' + especialista(materia, tema),
              '# Guia de resolução do APRENDICE (skill resolucao-exercicios)\n' + ler(os.path.join(SKILL, 'SKILL.md'))]
    if materia in GUIA:
        partes.append('# Guia da matéria\n' + ler(os.path.join(SKILL, 'materias', GUIA[materia] + '.md')))
    # a taxonomia inteira (~9 mil tokens) não vai: a questão já chega classificada; mantenha tema/conteúdo/nível
    partes.append(ADAPTA)
    return '\n\n---\n\n'.join(partes)


def letras(prova):
    a = prova.get('alternativas') or 5
    return list('ABCDE'[:a]) if isinstance(a, int) else list(a)


def limpa_texto(t):
    t = re.sub(r'(ENEM\d{4}){2,}', '', t or '')
    return t.strip()


def bloco_questao(q, prova):
    img = base64.b64encode(open(os.path.join(PROVAS, prova['id'], q['print']), 'rb').read()).decode()
    cab = (f"Prova: {prova['titulo']} — questão {q['n']} ({q.get('area', '')}).\n"
           f"id: {q['id']} · matéria: {q['materia']} ({NOME_MATERIA.get(q['materia'], '')}) · "
           f"classificação atual: tema {q.get('tema')}, conteúdo {q.get('conteudo')}, nível {q.get('nivel')}.\n"
           f"Alternativas: {', '.join(letras(prova))}.\n\n"
           f"Texto extraído do PDF oficial (pode ter lixo; o print manda):\n<<<\n{limpa_texto(q.get('texto'))}\n>>>")
    return [{'type': 'image', 'source': {'type': 'base64', 'media_type': 'image/webp', 'data': img}},
            {'type': 'text', 'text': cab}]


def pedido(etapa, q, prova, atual):
    conteudo = bloco_questao(q, prova)
    if etapa == 'resolvedor':
        conteudo.append({'type': 'text', 'text': (
            'Resolva esta questão e escreva a resolução no formato do BRIEF. O gabarito oficial NÃO é mostrado nesta '
            'etapa. ORDEM DOS CAMPOS: escreva primeiro "resolucao" (e "quadro", "caminhos", "visual"), e só no FIM do '
            'objeto o campo "resposta_resolvedor", com a mesma letra da sua frase "resposta" (nunca anote a letra antes '
            'de resolver). Deixe "confere" como null e '
            '"divergencia" vazio (o programa compara com o gabarito publicado). Em "erradas", comente TODAS as letras '
            'diferentes da sua resposta.')})
    elif etapa in ('fatos', 'fatos-volta'):
        extra = ''
        if etapa == 'fatos-volta':
            extra = ('\n\nEsta é a VOLTA da lente de fatos: a resolução passou pela lente de didática, que mudou os '
                     'campos listados em "mudancas_didatica" abaixo. Confira de novo, com o mesmo rigor, TUDO que mudou '
                     '(e o resto, se algo depender disso).\nmudancas_didatica: '
                     + json.dumps(atual.get('revisao', {}).get('didatica', []), ensure_ascii=False))
        conteudo.append({'type': 'text', 'text': (
            'PRIMEIRO resolva a questão sozinho, do zero, olhando só o print (escreva sua letra em "sua_resposta"). '
            'Só depois leia o gabarito oficial e a resolução proposta abaixo.\n\n'
            f'Gabarito oficial publicado (INEP/banca): {q["gab"]}\n\n'
            'Resolução proposta (JSON):\n```json\n' + json.dumps(limpa_para_lente(atual), ensure_ascii=False, indent=1)
            + '\n```' + extra + '\n\n'
            'Devolva um JSON com: {"sua_resposta": "letra", "excecao": "" ou o motivo (se você e o gabarito divergem), '
            '"correcoes": [{"campo": "caminho do campo, ex.: resolucao.passos[2].conta, resolucao.erradas.B, quadro[3].linha", '
            '"depois": <o valor novo completo daquele campo>, "motivo": "...", "fonte": ""}], "fatos_ok": true|false}. '
            'NÃO devolva a resolução inteira: só as correções (lista vazia se não há o que corrigir). '
            'Faça a menor mudança necessária; não reescreva por estilo. '
            '"fatos_ok": true só se você assina embaixo de cada frase depois das correções.')})
    elif etapa == 'didatica':
        conteudo.append({'type': 'text', 'text': (
            f'Gabarito oficial publicado: {q["gab"]}. Os fatos já foram conferidos pela lente de fatos.\n\n'
            'Resolução (JSON):\n```json\n' + json.dumps(limpa_para_lente(atual), ensure_ascii=False, indent=1) + '\n```\n\n'
            'Devolva um JSON com: {"didatica": [{"campo": "caminho do campo, ex.: resolucao.pista, resolucao.passos[1].porque", '
            '"depois": <o valor novo completo daquele campo>, "motivo": "..."}], "didatica_alertas": ["erro de fato que '
            'você viu e NÃO corrigiu"], "didatica_ok": true|false}. NÃO devolva a resolução inteira: só as mudanças. '
            'Não mude fatos, números nem a resposta.')})
    p = dict(model=MODELO[etapa], max_tokens=32000,
             system=[{'type': 'text', 'text': sistema(etapa, q['materia'], q.get('tema')),
                      'cache_control': {'type': 'ephemeral'}}],
             messages=[{'role': 'user', 'content': conteudo}],
             output_config={'effort': ESFORCO[etapa]})
    if etapa in ('fatos', 'fatos-volta'):
        p['tools'] = [{'type': 'web_search_20260209', 'name': 'web_search', 'max_uses': 2}]
    return p


def aplica(r, mudancas):
    """Aplica [{campo: 'resolucao.passos[2].conta', depois: ...}] em r. Devolve a lista de campos que não existem."""
    falhas = []
    for m in mudancas or []:
        campo = (m.get('campo') or '').strip()
        partes = re.findall(r'[^.\[\]]+|\[\d+\]', campo)
        if not partes or 'depois' not in m:
            falhas.append(campo); continue
        alvo = r
        try:
            for p in partes[:-1]:
                alvo = alvo[int(p[1:-1])] if p.startswith('[') else alvo[p]
            u = partes[-1]
            if u.startswith('['):
                i = int(u[1:-1])
                if i == len(alvo):
                    alvo.append(m['depois'])
                else:
                    alvo[i] = m['depois']
            else:
                alvo[u] = m['depois']
        except (KeyError, IndexError, TypeError, ValueError):
            falhas.append(campo)
    return falhas


def limpa_para_lente(r):
    return {k: v for k, v in r.items() if k not in ('revisao', 'aprovada', 'gab')}


# ---------------------------------------------------------------- leitura das respostas

def extrai_json(msg):
    texto = ''.join(b.text for b in msg.content if b.type == 'text')
    blocos = re.findall(r'```json\s*(.*?)```', texto, re.S)
    for cand in reversed(blocos or [texto]):
        try:
            return json.loads(cand.strip())
        except json.JSONDecodeError:
            pass
    i, j = texto.find('{'), texto.rfind('}')
    if i >= 0 and j > i:
        return json.loads(texto[i:j + 1])
    raise ValueError('sem JSON na resposta')


def valida(r, gab, alts):
    """Confere a forma da resolução. Devolve lista de problemas (vazia = ok)."""
    erros = []
    res = r.get('resolucao') or {}
    for c in CAMPOS_RES:
        if c not in res:
            erros.append(f'falta resolucao.{c}')
    passos = res.get('passos') or []
    if not 3 <= len(passos) <= 7:
        erros.append(f'{len(passos)} passos (esperado 3–7)')
    for i, p in enumerate(passos):
        for c in ('faz', 'conta', 'porque', 'tipo'):
            if c not in p:
                erros.append(f'passos[{i}] sem {c}')
    erradas = res.get('erradas') or {}
    faltam = [a for a in alts if a != gab and not (erradas.get(a) or '').strip()]
    if faltam:
        erros.append('erradas sem comentário: ' + ','.join(faltam))
    if gab in erradas and (erradas.get(gab) or '').strip():
        erros.append(f'erradas comenta a letra certa {gab}')
    # fração em linha é proibida (CLAUDE.md): procura "3/5" em textos e no quadro
    tudo = json.dumps({'resolucao': res, 'quadro': r.get('quadro')}, ensure_ascii=False)
    tudo = re.sub(r'https?://\S+', '', tudo)
    sobra = re.findall(r'\\\\[a-zA-Z]+', tudo)
    if sobra:
        erros.append('LaTeX sobrando: ' + ', '.join(sorted(set(sobra))) + ' (o site lê texto com "a/b", ×, ·, ^)')
    if r.get('materia') in ('bio', 'qui') and not (r.get('visual') or {}).get('cabe'):
        erros.append('Biologia/Química sem visual (cabe: true)')
    return erros


# o resto do LaTeX que aparece nos rascunhos vira a notação de texto que o site já desenha (Fracao.tsx/notacao.ts)
LATEX_SIMPLES = [
    (r'\\text\s*\{([^{}]*)\}', r'\1'), (r'\\mathrm\s*\{([^{}]*)\}', r'\1'),
    (r'\\times', '×'), (r'\\cdot', '·'), (r'\\approx', '≈'), (r'\\neq', '≠'), (r'\\leq?', '≤'), (r'\\geq?', '≥'),
    (r'\\Rightarrow', '⇒'), (r'\\rightarrow|\\to\b', '→'), (r'\\Delta', 'Δ'), (r'\\pi', 'π'), (r'\\%', '%'),
    (r'\\quad|\\qquad', '   '), (r'\\[ ,;:!]', ' '), (r'\{,\}', ','), (r'\^\{([^{}]*)\}', r'^\1'), (r'_\{([^{}]*)\}', r'_\1'),
    (r'\\left|\\right', ''), (r'  +', ' '),
]


def _frac_simples(t):
    m = re.search(r'\\[dt]?frac\s*\{([^{}]*)\}\s*\{([^{}]*)\}', t)
    if not m:
        return t, False
    def emb(x):
        x = x.strip()
        return x if re.fullmatch(r'[\w,.√²³π°%-]+', x) else f'({x})'
    return t[:m.start()] + emb(m.group(1)) + '/' + emb(m.group(2)) + t[m.end():], True


def sem_latex_frac(v):
    """\\frac{a}{b} → a/b (formato que o site empilha); de dentro para fora; o resto do texto não muda."""
    if isinstance(v, str):
        for a, b in LATEX_SIMPLES:
            v = re.sub(a, b, v)
        mudou = True
        while mudou:
            v, mudou = _frac_simples(v)
        return v
    if isinstance(v, list):
        return [sem_latex_frac(x) for x in v]
    if isinstance(v, dict):
        return {k: sem_latex_frac(x) for k, x in v.items()}
    return v


def custo(msg):
    u = msg.usage
    pi, po, pcr, pcw = PRECO[msg.model if msg.model in PRECO else 'claude-opus-5-5']
    buscas = getattr(getattr(u, 'server_tool_use', None), 'web_search_requests', 0) or 0
    return ((u.input_tokens * pi + u.output_tokens * po + (u.cache_read_input_tokens or 0) * pcr
             + (u.cache_creation_input_tokens or 0) * pcw) / 1e6 + buscas * BUSCA_US)


def registra_gasto(lote, etapa, n, us, batch_id):
    novo = not os.path.exists(GASTOS)
    os.makedirs(os.path.dirname(GASTOS), exist_ok=True)
    with open(GASTOS, 'a', newline='', encoding='utf-8') as f:
        w = csv.writer(f)
        if novo:
            w.writerow(['data', 'lote', 'etapa', 'modelo', 'pedidos', 'gasto_usd', 'batch_id'])
        w.writerow([datetime.datetime.now().isoformat(timespec='seconds'), lote, etapa, MODELO[etapa], n,
                    f'{us:.4f}', batch_id])


# ---------------------------------------------------------------- comandos

def pasta(lote):
    return os.path.join(SAIDA, lote)


def seleciona(lote, prova_id, nums):
    prova = ler_json(os.path.join(PROVAS, prova_id, 'prova.json'))
    por_n = {q['n']: q for q in prova['questoes']}
    sel = [por_n[int(n)] for n in nums.split(',')]
    estado = {'lote': lote, 'prova': prova_id, 'criado': datetime.date.today().isoformat(),
              'questoes': [q['id'] for q in sel], 'etapas': {}, 'gasto_usd': 0.0}
    gravar_json(os.path.join(pasta(lote), 'estado.json'), estado)
    print(f'{lote}: {len(sel)} questões de {prova_id}:',
          ', '.join(f"{q['n']}({q['materia']},n{q['nivel']})" for q in sel))


def volta(lote, origem, etapa, notas):
    """Novo lote que reaproveita a resolução de <origem> e roda de <etapa> em diante, com a nota da conferência."""
    eo = ler_json(os.path.join(pasta(origem), 'estado.json'))
    est = {'lote': lote, 'prova': eo['prova'], 'criado': datetime.date.today().isoformat(), 'origem': origem,
           'questoes': list(notas), 'etapas': {}, 'gasto_usd': 0.0}
    for e in ETAPAS[:ETAPAS.index(etapa)]:
        est['etapas'][e] = {'fim': 'reaproveitada de ' + origem}
    for i, nota in notas.items():
        r = ler_json(os.path.join(pasta(origem), 'res', i + '.json'))
        r['nota_conferencia'] = nota
        gravar_json(os.path.join(pasta(lote), 'res', i + '.json'), r)
    gravar_json(os.path.join(pasta(lote), 'estado.json'), est)
    print(f'{lote}: {len(notas)} questões voltam para {etapa} (origem {origem})')


def roda(lote, teto):
    d = pasta(lote)
    est = ler_json(os.path.join(d, 'estado.json'))
    est['teto_usd'] = teto
    prova = ler_json(os.path.join(PROVAS, est['prova'], 'prova.json'))
    qs = {q['id']: q for q in prova['questoes']}
    alts = letras(prova)
    c = cliente()
    res_dir = os.path.join(d, 'res')
    exc_p = os.path.join(d, 'excecoes.json')
    excecoes = ler_json(exc_p) if os.path.exists(exc_p) else {}

    for etapa in ETAPAS:
        e = est['etapas'].setdefault(etapa, {})
        if e.get('fim'):
            continue
        vivos = [i for i in est['questoes'] if i not in excecoes]
        if not vivos and not e.get('batch_id'):
            e['fim'] = datetime.datetime.now().isoformat(timespec='seconds')
            print(f'{etapa}: nenhuma questão para esta etapa (todas na fila de exceção)')
            continue
        if not e.get('batch_id'):
            previsto = est['gasto_usd'] + ESTIMATIVA_US[etapa] * len(vivos)
            if previsto > teto:
                print(f'PARADO: etapa {etapa} levaria o gasto a ~US$ {previsto:.2f}, acima do teto de US$ {teto:.2f}.')
                gravar_json(os.path.join(d, 'estado.json'), est)
                return
            reqs = []
            vivos.sort(key=lambda i: (qs[i]['materia'], qs[i].get('tema') or ''))
            for i in vivos:
                atual = ler_json(os.path.join(res_dir, i + '.json')) if etapa != 'resolvedor' else None
                reqs.append(Request(custom_id=i, params=MessageCreateParamsNonStreaming(**pedido(etapa, qs[i], prova, atual))))
            b = c.messages.batches.create(requests=reqs)
            e['batch_id'], e['enviado'], e['pedidos'] = b.id, datetime.datetime.now().isoformat(timespec='seconds'), len(reqs)
            gravar_json(os.path.join(d, 'estado.json'), est)
            print(f'{etapa}: lote {b.id} enviado ({len(reqs)} pedidos, {MODELO[etapa]})', flush=True)
        while True:
            b = c.messages.batches.retrieve(e['batch_id'])
            if b.processing_status == 'ended':
                break
            print(f'{etapa}: {b.request_counts.processing} em processamento…', flush=True)
            time.sleep(60)
        gasto = 0.0
        refazer = []
        for r in c.messages.batches.results(e['batch_id']):
            i = r.custom_id
            q = qs[i]
            if r.result.type != 'succeeded':
                refazer.append(i)
                excecoes[i] = {'etapa': etapa, 'motivo': f'pedido {r.result.type}'}
                continue
            msg = r.result.message
            gasto += custo(msg)
            gravar_json(os.path.join(d, 'bruto', etapa, i + '.json'), msg.model_dump(mode='json'))
            if msg.stop_reason in ('refusal', 'max_tokens'):
                excecoes[i] = {'etapa': etapa, 'motivo': f'stop_reason {msg.stop_reason}'}
                continue
            try:
                saida = extrai_json(msg)
            except Exception as ex:
                excecoes[i] = {'etapa': etapa, 'motivo': f'JSON inválido: {ex}'}
                continue
            if etapa == 'resolvedor':
                atual = saida
                atual['id'], atual['n'] = i, q['n']
                atual['gab'] = q['gab']
                marcada = (atual.get('resposta_resolvedor') or '').strip().upper()[:1]
                m = re.match(r'\s*Alternativa\s+([A-E])', (atual.get('resolucao') or {}).get('resposta') or '')
                escrita = m.group(1) if m else marcada
                atual['confere'] = marcada == q['gab'] and escrita == q['gab']
                if marcada != escrita:
                    excecoes[i] = {'etapa': etapa, 'motivo': f'resolvedor inconsistente: anotou {marcada}, mas a resposta '
                                                             f'escrita é {escrita} (gabarito {q["gab"]}); refazer do zero'}
                elif not atual['confere']:
                    excecoes[i] = {'etapa': etapa, 'motivo': f"resolvedor marcou {marcada}, "
                                                             f"gabarito {q['gab']}", 'divergencia': atual.get('divergencia')}
                atual['revisao'] = {'lentes': ['resolvedor'], 'modelos': {'resolvedor': msg.model}}
            else:
                atual = ler_json(os.path.join(res_dir, i + '.json'))
                rev = atual['revisao']
                falhas = aplica(atual, saida.get('didatica' if etapa == 'didatica' else 'correcoes'))
                if falhas:
                    excecoes[i] = {'etapa': etapa, 'motivo': 'correção em campo inexistente: ' + ', '.join(falhas)}
                rev['lentes'].append(etapa)
                rev['modelos'][etapa] = msg.model
                if etapa in ('fatos', 'fatos-volta'):
                    chave = 'fatos' if etapa == 'fatos' else 'fatos_volta'
                    rev[chave] = saida.get('correcoes', [])
                    rev[chave + '_ok'] = bool(saida.get('fatos_ok'))
                    rev[chave + '_resposta'] = saida.get('sua_resposta')
                    if (saida.get('sua_resposta') or '').strip().upper()[:1] != q['gab'] or saida.get('excecao'):
                        excecoes[i] = {'etapa': etapa, 'motivo': f"lente marcou {saida.get('sua_resposta')}, gabarito "
                                                                 f"{q['gab']}", 'excecao': saida.get('excecao')}
                    elif not saida.get('fatos_ok'):
                        excecoes[i] = {'etapa': etapa, 'motivo': 'lente de fatos não assinou (fatos_ok false)'}
                else:
                    rev['didatica'] = saida.get('didatica', [])
                    rev['didatica_alertas'] = saida.get('didatica_alertas', [])
                    rev['didatica_ok'] = bool(saida.get('didatica_ok'))
                    if not saida.get('didatica_ok'):
                        excecoes[i] = {'etapa': etapa, 'motivo': 'lente de didática reprovou'}
            gravar_json(os.path.join(res_dir, i + '.json'), atual)
        est['gasto_usd'] = round(est['gasto_usd'] + gasto, 4)
        e['gasto_usd'], e['fim'] = round(gasto, 4), datetime.datetime.now().isoformat(timespec='seconds')
        registra_gasto(lote, etapa, e['pedidos'], gasto, e['batch_id'])
        gravar_json(exc_p, excecoes)
        gravar_json(os.path.join(d, 'estado.json'), est)
        print(f'{etapa}: fim. gasto US$ {gasto:.2f} (total US$ {est["gasto_usd"]:.2f}); exceções: {len(excecoes)}',
              flush=True)

    # checagem final de forma
    aprovadas = []
    for i in est['questoes']:
        if i in excecoes:
            continue
        r = sem_latex_frac(ler_json(os.path.join(res_dir, i + '.json')))
        prob = valida(r, qs[i]['gab'], alts)
        if prob:
            excecoes[i] = {'etapa': 'validacao', 'motivo': '; '.join(prob)}
        else:
            aprovadas.append(i)
    gravar_json(exc_p, excecoes)
    est['aprovadas'] = aprovadas
    gravar_json(os.path.join(d, 'estado.json'), est)
    print(f'FIM: {len(aprovadas)} aprovadas, {len(excecoes)} na fila de exceção, gasto US$ {est["gasto_usd"]:.2f}')


def integra(lote):
    d = pasta(lote)
    est = ler_json(os.path.join(d, 'estado.json'))
    fr = os.path.join(PROVAS, est['prova'], 'resolucoes.json')
    banco = ler_json(fr) if os.path.exists(fr) else {}
    hoje = datetime.date.today().isoformat()
    for i in est.get('aprovadas', []):
        r = sem_latex_frac(ler_json(os.path.join(d, 'res', i + '.json')))
        banco[i] = {k: r.get(k) for k in ('n', 'materia', 'tema', 'conteudo', 'nivel', 'conceito', 'resolucao',
                                          'caminhos', 'quadro', 'visual', 'fontes')}
        banco[i]['aprovada'] = True
        banco[i]['revisao'] = {'lentes': r['revisao']['lentes'], 'modelos': r['revisao']['modelos'],
                               'data': hoje, 'lote': lote, 'origem': 'fabrica-api'}
    gravar_json(fr, banco)
    print(f'{len(est.get("aprovadas", []))} resoluções gravadas em {os.path.relpath(fr, RAIZ)}')


if __name__ == '__main__':
    a = sys.argv[1:]
    if not a:
        sys.exit(__doc__)
    if a[0] == 'seleciona':
        seleciona(a[1], a[2], a[3])
    elif a[0] == 'roda':
        roda(a[1], float(a[a.index('--teto') + 1]) if '--teto' in a else 15.0)
    elif a[0] == 'volta':  # volta <lote> <origem> <etapa> <notas.json>
        volta(a[1], a[2], a[3], ler_json(a[4]))
    elif a[0] == 'integra':
        integra(a[1])
    else:
        sys.exit(__doc__)

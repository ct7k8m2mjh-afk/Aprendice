"""Fábrica do campo `essencial` da revisão (comando 33, docs/revisao/FORMATO-ESSENCIAL.md), pela API com Batches.

Cada tema de docs/revisao/<matéria>/<TEMA>.json (já aprovado nas lentes) ganha o `essencial`, tirado SÓ do próprio
arquivo (slides, cartões, resumo, fórmulas, erro): termômetro → mapa mental → uma tela por conteúdo → questão resolvida
(Questão Aprendice) → conexão. Nada de fato novo; o que faltar vai para `pendencias`.

Etapas (cada uma um lote):
  1. gera       (claude-sonnet-5-5) escreve o essencial
  2. lente-a    (claude-opus-5-5)   fatos: resolve a questão SEM ver o gabarito, confere cada tópico contra os slides e
                                    cartões do mesmo arquivo, refaz as contas; devolve só as correções
  3. lente-b    (claude-sonnet-5-5) didática e tamanho (40 palavras, 4 tópicos, 8–12 telas, ordem do termômetro),
                                    recebe o relatório do lint_revisao.py; não muda fatos
  4. lente-a-volta (claude-opus-5-5) fatos de novo em tudo que a lente B mudou
Aprovado = gabarito da questão confirmado pela lente A (que não o viu) + fatos ok nas duas voltas + didática ok + lint ok.
Aprovado é gravado no JSON do tema (campo `essencial`) e publicado (commit) tema a tema por quem roda.

Uso:
  python3 ferramentas/fabrica/essencial_api.py roda <lote> <matéria>/<TEMA> [...] --teto 20
  python3 ferramentas/fabrica/essencial_api.py grava <lote>      (grava os aprovados nos JSON dos temas)
"""
import copy
import datetime
import json
import os
import re
import sys
import time

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import resolucoes_api as R  # cliente, leitura de JSON, custo, gasto, aplica correções por caminho
import lint_revisao as L
from anthropic.types.message_create_params import MessageCreateParamsNonStreaming
from anthropic.types.messages.batch_create_params import Request

RAIZ = R.RAIZ
REVISAO = os.path.join(RAIZ, 'docs', 'revisao')
SAIDA = os.path.join(RAIZ, 'fabrica_saida', 'essencial')
ETAPAS = ['gera', 'lente-a', 'lente-b', 'lente-a-volta']
MODELO = {'gera': 'claude-sonnet-5-5', 'lente-a': 'claude-opus-5-5', 'lente-b': 'claude-sonnet-5-5',
          'lente-a-volta': 'claude-opus-5-5'}
ESFORCO = {'gera': 'high', 'lente-a': 'medium', 'lente-b': 'medium', 'lente-a-volta': 'medium'}
ESTIMATIVA_US = {'gera': 0.08, 'lente-a': 0.12, 'lente-b': 0.03, 'lente-a-volta': 0.10}
NOME = {'geo': 'Geografia', 'his': 'História', 'ing': 'Inglês', 'fis': 'Física', 'fs': 'Filosofia e Sociologia',
        'bio': 'Biologia', 'qui': 'Química', 'mat': 'Matemática', 'por': 'Português'}

REGRAS = R.ler(os.path.join(REVISAO, 'FORMATO-ESSENCIAL.md'))
QAPRENDICE = R.ler(os.path.join(RAIZ, 'docs', 'questoes-aprendice.md'))

COMUM = """
## Como você trabalha (programa da fábrica, pela API)
- O tema inteiro (já aprovado nas lentes) vem abaixo em JSON. É a ÚNICA fonte: nada de fato, número, data, nome ou
  exemplo que não esteja nele. Se faltar algo essencial, escreva em "pendencias" e não invente.
- Responda SOMENTE com um objeto JSON válido, dentro de um bloco ```json ... ```.
- Português do Brasil, frases curtas, aluno de 17 anos; sem emoji; sem história ou curiosidade que não caia na prova.
- Texto das telas: fração "a/b" (o site desenha empilhada); fórmula só no campo "formula", em KaTeX (Humanas em \\text{}).
- Tela de celular: cada tópico até 18 palavras; até 4 tópicos; tópicos + pegadinha até 40 palavras; peso baixo: até 2
  tópicos. Total do tema: 8 a 12 telas (termômetro + mapa + uma por conteúdo + questão + conexão opcional). Conteúdo de
  peso baixo pode ficar sem tela quando o tema passaria de 12.
- Termômetro: o peso (alta, media, baixa) e "provas" vêm dos slides "Como cai na prova" (tipo na_prova) do próprio tema.
  Ordem das telas: alta → média → baixa.
- Questão resolvida: Questão Aprendice NOVA (contexto, números e alternativas próprios; nunca copiar nem adaptar questão
  real dos slides), no estilo da prova mais frequente do termômetro, 5 alternativas "A) …" a "E) …", cada errada nascida
  de um erro típico do aluno; até 5 passos curtos; "por_que_erram" explica a errada mais marcada.
"""


def especialista(m, tema_id):
    if m == 'fs':
        return R.ler(os.path.join(R.AGENTES, 'especialistas', 'fil.md' if tema_id.startswith('L') else 'soc.md'))
    return R.ler(os.path.join(R.AGENTES, 'especialistas', m + '.md'))


def sistema(etapa, m, tema_id):
    papel = {
        'gera': 'Você é o especialista da matéria e escreve a REVISÃO ESSENCIAL do tema (não aula).',
        'lente-a': 'Você é a LENTE A (fatos) da banca: corretor rigoroso que não escreveu o essencial e não confia nele.',
        'lente-b': 'Você é a LENTE B (didática e tamanho) da banca: professor de cursinho que corta o que não cai.',
        'lente-a-volta': 'Você é a LENTE A (fatos) voltando em tudo que a lente B mudou.',
    }[etapa]
    partes = [f'# {papel}\nMatéria: {NOME.get(m, m)}.', '# Especialista da matéria\n' + especialista(m, tema_id),
              '# Especificação (docs/revisao/FORMATO-ESSENCIAL.md)\n' + REGRAS, COMUM]
    if etapa in ('gera', 'lente-a'):
        partes.append('# Questões Aprendice (docs/questoes-aprendice.md)\n' + QAPRENDICE)
    return '\n\n---\n\n'.join(partes)


def tema_para_prompt(t):
    t = {k: v for k, v in t.items() if k != 'essencial'}
    return json.dumps(t, ensure_ascii=False)


def sem_gabarito(e):
    e = copy.deepcopy(e)
    q = e.get('questao_resolvida') or {}
    for k in ('gabarito', 'passos', 'por_que_erram'):
        q.pop(k, None)
    return e


def pedido(etapa, m, tema, atual):
    tid = tema['id']
    txt = [f'Tema {tid}, {tema.get("nome")} ({NOME.get(m, m)}). JSON do tema (fonte única):\n```json\n'
           + tema_para_prompt(tema) + '\n```']
    if etapa == 'gera':
        txt.append('Escreva o campo "essencial" deste tema no formato da especificação. Devolva '
                   '{"essencial": {...}, "pendencias": ["o que faltou no material para o essencial, se algo"]}.')
    elif etapa == 'lente-a':
        txt.append(
            'PRIMEIRO resolva a questão resolvida abaixo SEM gabarito e escreva sua letra em "sua_resposta" '
            '(o programa compara com o gabarito do autor). Depois confira cada item do essencial contra os slides e '
            'cartões do JSON acima: cada fato, número, data, nome, fórmula e conta (refaça as contas); o peso do '
            'termômetro bate com os slides na_prova; nada novo sem fonte no próprio JSON. Essencial (sem o gabarito, '
            'os passos e o por_que_erram da questão):\n```json\n' + json.dumps(sem_gabarito(atual), ensure_ascii=False)
            + '\n```\nGabarito do autor, passos e por_que_erram (leia SÓ depois de resolver):\n```json\n'
            + json.dumps({k: (atual.get('questao_resolvida') or {}).get(k) for k in ('gabarito', 'passos', 'por_que_erram')},
                         ensure_ascii=False) + '\n```\n'
            'Devolva {"sua_resposta": "letra", "excecao": "" ou o motivo, "correcoes": [{"campo": "caminho, ex.: '
            'telas[2].pontos[1], questao_resolvida.passos[0].conta, termometro[1].peso", "depois": <valor novo completo>, '
            '"motivo": "...", "slide": "onde está no JSON"}], "fatos_ok": true|false}. Só as correções, menor mudança.')
    elif etapa == 'lente-b':
        lint = L.problemas(dict(tema, essencial=atual))
        txt.append(
            'Essencial a revisar:\n```json\n' + json.dumps(atual, ensure_ascii=False) + '\n```\n'
            'Relatório do lint_revisao.py (resolva tudo): ' + (json.dumps(lint, ensure_ascii=False) if lint else 'ok') + '\n'
            'Corte o que não cai, confira tamanho, clareza, ordem pelo termômetro e a pegadinha de cada tela. NÃO mude '
            'fatos, números, a resposta da questão nem o gabarito. Devolve {"didatica": [{"campo": "caminho", "depois": '
            '<valor novo completo>, "motivo": "..."}], "alertas": ["erro de fato visto e NÃO corrigido"], '
            '"didatica_ok": true|false}. Para tirar uma tela inteira, use {"campo": "telas", "depois": <lista nova>}.')
    else:
        txt.append(
            'A lente B mudou estes campos (confira de novo cada um contra o JSON do tema):\n```json\n'
            + json.dumps(atual.get('_revisao', {}).get('lente_b', []), ensure_ascii=False) + '\n```\nEssencial atual:\n```json\n'
            + json.dumps({k: v for k, v in atual.items() if k != '_revisao'}, ensure_ascii=False) + '\n```\n'
            'Devolva {"correcoes": [...], "fatos_ok": true|false} (mesmo formato da lente A; só correções).')
    return dict(model=MODELO[etapa], max_tokens=32000,
                system=[{'type': 'text', 'text': sistema(etapa, m, tema['id']), 'cache_control': {'type': 'ephemeral'}}],
                messages=[{'role': 'user', 'content': '\n\n'.join(txt)}],
                output_config={'effort': ESFORCO[etapa]})


def registra_gasto(lote, etapa, n, us, batch_id):
    import csv
    novo = not os.path.exists(R.GASTOS)
    with open(R.GASTOS, 'a', newline='', encoding='utf-8') as f:
        w = csv.writer(f)
        if novo:
            w.writerow(['data', 'lote', 'etapa', 'modelo', 'pedidos', 'gasto_usd', 'batch_id'])
        w.writerow([datetime.datetime.now().isoformat(timespec='seconds'), 'essencial/' + lote, etapa, MODELO[etapa], n,
                    f'{us:.4f}', batch_id])


def pasta(lote):
    return os.path.join(SAIDA, lote)


def caminho_tema(chave):
    m, t = chave.split('/')
    return os.path.join(REVISAO, m, t + '.json')


def roda(lote, temas, teto):
    d = pasta(lote)
    pe = os.path.join(d, 'estado.json')
    est = R.ler_json(pe) if os.path.exists(pe) else {'lote': lote, 'temas': temas, 'etapas': {}, 'gasto_usd': 0.0,
                                                      'criado': datetime.date.today().isoformat()}
    exc_p = os.path.join(d, 'excecoes.json')
    exc = R.ler_json(exc_p) if os.path.exists(exc_p) else {}
    c = R.cliente()
    for etapa in ETAPAS:
        e = est['etapas'].setdefault(etapa, {})
        if e.get('fim'):
            continue
        vivos = [k for k in est['temas'] if k not in exc]
        if not vivos:
            e['fim'] = 'nada a fazer'
            continue
        if not e.get('batch_id'):
            previsto = ESTIMATIVA_US[etapa] * len(vivos)
            if est['gasto_usd'] + previsto > teto or R.gasto_total() + previsto > R.TETO_GERAL_US:
                print(f'PARADO: etapa {etapa} passaria do teto (lote US$ {teto:.2f}; geral US$ {R.TETO_GERAL_US:.2f}).')
                R.gravar_json(pe, est)
                return
            reqs = []
            for k in vivos:
                m = k.split('/')[0]
                tema = R.ler_json(caminho_tema(k))
                atual = R.ler_json(os.path.join(d, 'ess', k.replace('/', '_') + '.json')) if etapa != 'gera' else None
                reqs.append(Request(custom_id=k.replace('/', '_'), params=MessageCreateParamsNonStreaming(**pedido(etapa, m, tema, atual))))
            b = c.messages.batches.create(requests=reqs)
            e.update(batch_id=b.id, pedidos=len(reqs), enviado=datetime.datetime.now().isoformat(timespec='seconds'))
            R.gravar_json(pe, est)
            print(f'{etapa}: lote {b.id} enviado ({len(reqs)} temas, {MODELO[etapa]})', flush=True)
        while c.messages.batches.retrieve(e['batch_id']).processing_status != 'ended':
            time.sleep(60)
        gasto = 0.0
        for r in c.messages.batches.results(e['batch_id']):
            k = r.custom_id.replace('_', '/', 1)
            if r.result.type != 'succeeded':
                exc[k] = {'etapa': etapa, 'motivo': f'pedido {r.result.type}'}
                continue
            msg = r.result.message
            gasto += R.custo(msg)
            R.gravar_json(os.path.join(d, 'bruto', etapa, r.custom_id + '.json'), msg.model_dump(mode='json'))
            if msg.stop_reason in ('refusal', 'max_tokens'):
                exc[k] = {'etapa': etapa, 'motivo': f'stop_reason {msg.stop_reason}'}
                continue
            try:
                s = R.extrai_json(msg)
            except Exception as ex:
                exc[k] = {'etapa': etapa, 'motivo': f'JSON inválido: {ex}'}
                continue
            arq = os.path.join(d, 'ess', r.custom_id + '.json')
            if etapa == 'gera':
                atual = s.get('essencial') or {}
                atual['_revisao'] = {'lentes': ['gera'], 'pendencias': s.get('pendencias', [])}
            else:
                atual = R.ler_json(arq)
                rev = atual['_revisao']
                rev['lentes'].append(etapa)
                lista = s.get('didatica' if etapa == 'lente-b' else 'correcoes') or []
                falhas = R.aplica(atual, lista)
                rev[etapa.replace('-', '_')] = lista
                if falhas:
                    exc[k] = {'etapa': etapa, 'motivo': 'correção em campo inexistente: ' + ', '.join(falhas)}
                if etapa == 'lente-a':
                    gab = (atual.get('questao_resolvida') or {}).get('gabarito')
                    if (s.get('sua_resposta') or '').strip()[:1] != gab or s.get('excecao'):
                        exc[k] = {'etapa': etapa, 'motivo': f'lente A marcou {s.get("sua_resposta")}, autor deu {gab}',
                                  'excecao': s.get('excecao')}
                if etapa in ('lente-a', 'lente-a-volta') and not s.get('fatos_ok'):
                    exc.setdefault(k, {'etapa': etapa, 'motivo': 'lente A não assinou (fatos_ok false)'})
                if etapa == 'lente-b':
                    rev['alertas'] = s.get('alertas', [])
                    if not s.get('didatica_ok'):
                        exc.setdefault(k, {'etapa': etapa, 'motivo': 'lente B reprovou'})
            R.gravar_json(arq, atual)
        est['gasto_usd'] = round(est['gasto_usd'] + gasto, 4)
        e.update(gasto_usd=round(gasto, 4), fim=datetime.datetime.now().isoformat(timespec='seconds'))
        registra_gasto(lote, etapa, e['pedidos'], gasto, e['batch_id'])
        R.gravar_json(exc_p, exc)
        R.gravar_json(pe, est)
        print(f'{etapa}: fim. US$ {gasto:.2f} (lote US$ {est["gasto_usd"]:.2f}); exceções: {len(exc)}', flush=True)
    aprovados = []
    for k in est['temas']:
        if k in exc:
            continue
        atual = R.ler_json(os.path.join(d, 'ess', k.replace('/', '_') + '.json'))
        ps = L.problemas(dict(R.ler_json(caminho_tema(k)), essencial={x: v for x, v in atual.items() if x != '_revisao'}))
        if ps:
            exc[k] = {'etapa': 'lint', 'motivo': '; '.join(ps)}
        else:
            aprovados.append(k)
    est['aprovados'] = aprovados
    R.gravar_json(exc_p, exc)
    R.gravar_json(pe, est)
    print(f'FIM: {len(aprovados)} temas aprovados, {len(exc)} na exceção, US$ {est["gasto_usd"]:.2f}')


def grava(lote):
    """Grava o essencial aprovado no JSON do tema (os slides e o resto não mudam). Imprime os temas gravados."""
    d = pasta(lote)
    est = R.ler_json(os.path.join(d, 'estado.json'))
    for k in est.get('aprovados', []):
        atual = R.ler_json(os.path.join(d, 'ess', k.replace('/', '_') + '.json'))
        rev = atual.pop('_revisao', {})
        f = caminho_tema(k)
        tema = R.ler_json(f)
        tema['essencial'] = atual
        if rev.get('pendencias'):
            tema['pendencias'] = list(tema.get('pendencias') or []) + [f'essencial: {x}' for x in rev['pendencias']]
        tema.setdefault('revisao_essencial', {}).update(
            lentes=rev.get('lentes'), data=datetime.date.today().isoformat(), lote=lote, origem='fabrica-api')
        with open(f, 'w', encoding='utf-8') as fh:
            json.dump(tema, fh, ensure_ascii=False, indent=1)  # mesmo estilo dos arquivos (indentação 1, sem \n final)
        print(k)


if __name__ == '__main__':
    a = sys.argv[1:]
    if a and a[0] == 'roda':
        teto = float(a[a.index('--teto') + 1]) if '--teto' in a else 20.0
        temas = [x for x in a[2:] if '/' in x]
        roda(a[1], temas, teto)
    elif a and a[0] == 'grava':
        grava(a[1])
    else:
        sys.exit(__doc__)

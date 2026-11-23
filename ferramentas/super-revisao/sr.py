#!/usr/bin/env python3
"""Super revisão (dono, 23/11/2026; docs/revisao-site/super-revisao/PROTOCOLO.md): lotes de até 15 questões do mesmo
conteúdo para o professor e o aluno, e gravação das correções no arquivo-fonte de cada resolução.

Antes: `cd app && python3 scripts/converte.py` (o banco montado em app/public/conteudo é a base).

  python3 ferramentas/super-revisao/sr.py subs <m>               conteúdos da matéria, na ordem da revisão, com o nº
                                                                  de questões com resolução
  python3 ferramentas/super-revisao/sr.py lote <m> <sub> [k]     monta o lote k (1, 2, ...) do conteúdo: grava em
                                                                  docs/revisao-site/super-revisao/trabalho/ o arquivo do
                                                                  ALUNO (só a questão) e o do PROFESSOR (questão +
                                                                  gabarito + resolução como o site mostra)
  python3 ferramentas/super-revisao/sr.py fonte <id>             onde mora a resolução da questão
  python3 ferramentas/super-revisao/sr.py aplica <patch.json>    grava as correções: {"<id>": {"<campo>": valor}}
                                                                  campos da resolução (antes, pista, passos, resposta,
                                                                  checagem, erradas, armadilha, alerta, essencial) ou
                                                                  de fora dela (quadro, caminhos, visual). "erradas.B"
                                                                  e "passos.2" trocam só aquele item. Guarda o antes em
                                                                  <patch>.antes.json (para o professor novo conferir).

Onde se grava: questão de prova -> app/conteudo-fonte/provas/<prova>/resolucoes-<m>.json (ou resolucoes.json, lotes
antigos); questão antiga do protótipo (app-atual/, que não se altera) -> app/conteudo-fonte/correcoes-res/<m>.json,
que o converte.py aplica por cima da resolução antiga.
"""
import glob
import json
import os
import re
import sys

RAIZ = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
PUB = os.path.join(RAIZ, 'app', 'public', 'conteudo')
PROVAS = os.path.join(RAIZ, 'app', 'conteudo-fonte', 'provas')
CORRECOES = os.path.join(RAIZ, 'app', 'conteudo-fonte', 'correcoes-res')
TRAB = os.path.join(RAIZ, 'docs', 'revisao-site', 'super-revisao', 'trabalho')
sys.path.insert(0, os.path.join(RAIZ, 'ferramentas', 'resolucoes'))
import lote as L  # noqa: E402

FORA = ('quadro', 'caminhos', 'visual')
TAM = 15


def ler(f, p=None):
    return L.ler(f, p)


def banco(m):
    return ler(os.path.join(PUB, m, 'banco.json'))


def res_pub(m, sub):
    return ler(os.path.join(PUB, m, 'res', sub + '.json'), {})


def ordem(q):
    alvo = L.ALVO.index(q['escola']) if q['escola'] in L.ALVO else len(L.ALVO)
    base = 0 if q['escola'] == 'ENEM' else (1 if q['escola'] in L.ALVO else 2)
    return (int(q.get('dif') or 0), base, alvo, q['escola'], str(q.get('ano')), str(q.get('prova', '')),
            int(re.sub(r'\D', '', str(q.get('n'))) or 0), q['id'])


def chave_sub(s):
    a, _, b = s.partition('.')
    return (a, int(b) if b.isdigit() else 999)


def questoes_do_sub(m, sub):
    r = res_pub(m, sub)
    return sorted([q for q in banco(m) if q['sub'] == sub and q['id'] in r], key=ordem), r


def cmd_subs(m):
    from collections import Counter
    r = {}
    for f in glob.glob(os.path.join(PUB, m, 'res', '*.json')):
        r.update(ler(f))
    c = Counter(q['sub'] for q in banco(m) if q['id'] in r)
    _, nomes = L.nomes_materia(m)
    for s in sorted(c, key=chave_sub):
        print(f'{s}\t{c[s]}\t{-(-c[s] // TAM)} lote(s)\t{nomes.get(s, "")}')
    print('total', sum(c.values()))


def fonte(qid, m=None):
    """(arquivo, tipo) onde mora a resolução: 'prova' (registro com 'resolucao') ou 'antiga' (camada de correção)."""
    for f in sorted(glob.glob(os.path.join(PROVAS, '*', 'resolucoes*.json'))):
        d = ler(f)
        if qid in d and d[qid].get('aprovada'):
            mm = re.match(r'resolucoes-([a-z]+)\.json$', os.path.basename(f))
            if m and mm and mm.group(1) != m:
                continue   # questão que mudou de matéria: vale a da matéria atual (converte.py)
            return f, 'prova'
    for f in sorted(glob.glob(os.path.join(PROVAS, '*', 'resolucoes*.json'))):
        d = ler(f)
        if qid in d and d[qid].get('aprovada'):
            return f, 'prova'
    return os.path.join(CORRECOES, (m or '') + '.json'), 'antiga'


def visto_no_site(r):
    """A resolução como o site mostra (sem o print)."""
    return {k: r.get(k) for k in ('resposta', 'armadilha', 'erradas', 'passos', 'quadro', 'visual', 'antes', 'pista',
                                  'checagem', 'alerta', 'essencial', 'caminhos') if r.get(k) not in (None, '', [], {})}


def cmd_lote(m, sub, k=1):
    qs, r = questoes_do_sub(m, sub)
    parte = qs[(k - 1) * TAM:k * TAM]
    if not parte:
        sys.exit(f'{sub}: não há lote {k} ({len(qs)} questões)')
    ents = {e['id']: e for e in L.entrada(m, [q for q in parte if q.get('print')])}
    for q in parte:
        if q['id'] not in ents:
            # questão antiga do protótipo: texto e alternativas do banco; o print é o do site
            pr = os.path.join('app', 'public', 'conteudo', m, 'prints', q['id'] + '.webp')
            ents[q['id']] = {'prova': f"{q['escola']} {q['ano']}" + (f" {q['fase']}" if q.get('fase') else '')
                             + f" · questão {q.get('n')}", 'letras': sorted(q.get('alts') or {}),
                             'texto_da_prova': q.get('enun', ''), 'alternativas': q.get('alts') or {},
                             'print': pr if os.path.exists(os.path.join(RAIZ, pr)) else '',
                             'tem_figura': bool(q.get('figura'))}
    aluno, prof = [], []
    for q in parte:
        e = ents[q['id']]
        base = {'id': q['id'], 'prova': e['prova'], 'nivel': q.get('dif'), 'letras': e['letras'],
                'texto_da_prova': e.get('texto_da_prova', ''), 'alternativas': e.get('alternativas', {}),
                'print': os.path.join(RAIZ, e['print']) if e['print'] else ''}
        if e.get('ler_o_print'):
            base['ler_o_print'] = True
        if e.get('tem_figura'):
            base['tem_figura'] = True
        aluno.append(base)
        p = dict(base, gabarito_oficial=q.get('gab'), resolucao_no_site=visto_no_site(r[q['id']]),
                 arquivo_fonte=os.path.relpath(fonte(q['id'], m)[0], RAIZ))
        if e.get('ocr_do_print'):
            p['ocr_do_print'] = e['ocr_do_print']
        if e.get('nota_gabarito'):
            p['nota_gabarito'] = e['nota_gabarito']
        if e.get('sobre_a_prova'):
            p['sobre_a_prova'] = e['sobre_a_prova']
        prof.append(p)
    os.makedirs(TRAB, exist_ok=True)
    nome = f'{m}-{sub}-{k}'
    fa, fp = os.path.join(TRAB, nome + '.aluno.json'), os.path.join(TRAB, nome + '.professor.json')
    L.gravar(fa, {'lote': nome, 'questoes': aluno})
    L.gravar(fp, {'lote': nome, 'questoes': prof})
    # a correção do aluno: os 4 blocos (sem antes/pista/checagem/essencial, que o site não mostra)
    cor = [{'id': p['id'], 'gabarito': p['gabarito_oficial'],
            **{c: p['resolucao_no_site'].get(c) for c in ('erradas', 'resposta', 'armadilha', 'passos', 'quadro')
               if p['resolucao_no_site'].get(c)}} for p in prof]
    L.gravar(os.path.join(TRAB, nome + '.correcao.json'), {'lote': nome, 'questoes': cor})
    print(f'{nome}: {len(parte)} questões (de {len(qs)} no conteúdo; lotes: {-(-len(qs) // TAM)})')
    print('aluno:', fa)
    print('professor:', fp)
    print('correcao (aluno, 2ª etapa):', os.path.join(TRAB, nome + '.correcao.json'))


def cmd_fonte(qid):
    for m in L.MATERIAS:
        if any(q['id'] == qid for q in banco(m)):
            print(m, *fonte(qid, m))
            return
    print('não achei', qid)


def materia_de(qid):
    for m in L.MATERIAS:
        if any(q['id'] == qid for q in banco(m)):
            return m
    return None


def troca(alvo, campo, valor):
    """campo 'erradas.B' ou 'passos.2' troca só o item; 'campo' inteiro troca tudo. Devolve o valor antigo."""
    if '.' in campo:
        c, i = campo.split('.', 1)
        cont = alvo.setdefault(c, [] if c == 'passos' else {})
        if isinstance(cont, list):
            i = int(i)
            antigo = cont[i] if i < len(cont) else None
            if valor is None:
                cont.pop(i)
            elif i < len(cont):
                cont[i] = valor
            else:
                cont.append(valor)
        else:
            antigo = cont.get(i)
            cont[i] = valor
        return antigo
    antigo = alvo.get(campo)
    alvo[campo] = valor
    return antigo


def cmd_aplica(fp):
    patch = ler(fp)
    antes = {}
    por_arquivo = {}
    for qid, campos in patch.items():
        m = materia_de(qid)
        if not m:
            sys.exit(f'{qid}: questão não está em nenhum banco')
        f, tipo = fonte(qid, m)
        por_arquivo.setdefault((f, tipo), []).append((qid, campos))
    for (f, tipo), itens in por_arquivo.items():
        d = ler(f, {})
        for qid, campos in itens:
            antes[qid] = {}
            if tipo == 'prova':
                reg = d[qid]
                for c, v in campos.items():
                    raiz = c.split('.')[0]
                    alvo = reg if raiz in FORA else reg['resolucao']
                    antes[qid][c] = troca(alvo, c, v)
                reg.setdefault('super_revisao', []).append('2026-11-23')
            else:
                # resolução antiga: a camada guarda o registro inteiro corrigido (o converte.py troca pelo dele)
                if qid not in d:
                    m = materia_de(qid)
                    sub = next(q['sub'] for q in banco(m) if q['id'] == qid)
                    d[qid] = res_pub(m, sub)[qid]
                for c, v in campos.items():
                    antes[qid][c] = troca(d[qid], c, v)
        L.gravar(f, d)
        print('gravado', os.path.relpath(f, RAIZ), len(itens))
    L.gravar(fp.replace('.json', '') + '.antes.json', antes)


if __name__ == '__main__':
    a = sys.argv[1:]
    if not a:
        sys.exit(__doc__)
    if a[0] == 'subs':
        cmd_subs(a[1])
    elif a[0] == 'lote':
        cmd_lote(a[1], a[2], int(a[3]) if len(a) > 3 else 1)
    elif a[0] == 'fonte':
        cmd_fonte(a[1])
    elif a[0] == 'aplica':
        cmd_aplica(a[1])
    else:
        sys.exit(__doc__)

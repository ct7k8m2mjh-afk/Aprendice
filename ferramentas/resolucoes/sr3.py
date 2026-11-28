#!/usr/bin/env python3
"""Super revisão (SR-3: por, his, ing) — lotes por conteúdo e aplicação de correções no arquivo-fonte.

Antes: `cd app && python3 scripts/converte.py` (lê o banco montado em app/public/conteudo, só leitura).

  python3 ferramentas/resolucoes/sr3.py subs <m>                 conteúdos na ordem da revisão, com nº de questões
  python3 ferramentas/resolucoes/sr3.py lote <m> <sub> <k> [N]   lote k (1, 2...) de N questões (padrão 15) do conteúdo:
                                                                 grava docs/revisao-site/super-revisao/trabalho/<m>-<sub>-<k>.json
                                                                 (questão, gabarito, print, resolução como o site mostra, fonte)
  python3 ferramentas/resolucoes/sr3.py aplica <correcoes.json>  aplica no arquivo-fonte (app-atual/<m>/res ou
                                                                 app/conteudo-fonte/provas/<p>/resolucoes*.json):
      [{"id": "...", "campo": "erradas.B" | "passos.2.porque" | "armadilha" | "essencial.cuidado" | "antes.texto" ...,
        "antes": "<texto atual, conferido>", "novo": <valor>}]
      O "antes" tem de bater com o texto atual (proteção contra campo errado). Nunca mexe em enunciado, gabarito ou ids.
"""
import glob
import json
import os
import sys

RAIZ = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import lote as L  # noqa: E402

PUB = os.path.join(RAIZ, 'app', 'public', 'conteudo')
TRAB = os.path.join(RAIZ, 'docs', 'revisao-site', 'super-revisao', 'trabalho')
PROVAS = os.path.join(RAIZ, 'app', 'conteudo-fonte', 'provas')
ANTIGO = os.path.join(RAIZ, 'app-atual')
CAMPOS_RES = {'quadro', 'caminhos', 'visual'}  # ficam fora de 'resolucao' no arquivo da prova


def ler(f, p=None):
    if not os.path.exists(f):
        return p
    return json.load(open(f, encoding='utf-8'))


def gravar(f, d):
    # mantém o formato do arquivo: app-atual é JSON compacto sem quebra final; provas, indent=1 com quebra final
    compacto = os.path.exists(f) and not open(f, encoding='utf-8').read(2).startswith('{\n')
    with open(f, 'w', encoding='utf-8') as h:
        if compacto:
            h.write(json.dumps(d, ensure_ascii=False, separators=(',', ':')))
        else:
            json.dump(d, h, ensure_ascii=False, indent=1)
            h.write('\n')


def questoes(m):
    b = ler(os.path.join(PUB, m, 'banco.json'))
    res = {}
    for f in glob.glob(os.path.join(PUB, m, 'res', '*.json')):
        for k, v in ler(f).items():
            res[k] = v
    # só o que o aluno vê no site (dono, 23/11): pendente ou retirada não aparece
    qs = [q for q in b if q['id'] in res and not q.get('anuladaAprendice') and not q.get('outraMateria')
          and not q.get('pendente') and not q.get('retirada')]
    return qs, res


def ordem(q):
    base = 0 if q['escola'] == 'ENEM' else (1 if q['escola'] in L.ALVO else 2)
    return (base, int(q.get('dif') or 0), str(q.get('ano')), q['id'])


def por_sub(m):
    qs, res = questoes(m)
    d = {}
    for q in qs:
        d.setdefault(q['sub'], []).append(q)
    for v in d.values():
        v.sort(key=ordem)
    return dict(sorted(d.items(), key=lambda kv: [int(x) if x.isdigit() else x for x in kv[0].replace('.', ' ').replace(m[0].upper(), ' ').split()])), res


_IDX = {}


def indice_fontes(m):
    """qid -> (arquivo, tipo) para as resoluções de prova e as antigas."""
    if m in _IDX:
        return _IDX[m]
    idx = {}
    pasta = os.path.join(ANTIGO, m, 'res')
    if os.path.isdir(pasta):
        for f in glob.glob(os.path.join(pasta, '*.json')):
            for k in ler(f):
                idx[k] = (f, 'antigo')
    prov = {}
    for f in sorted(glob.glob(os.path.join(PROVAS, '*', 'resolucoes*.json'))):
        d = ler(f)
        for k, v in d.items():
            if v.get('aprovada'):
                # a da matéria vence a genérica
                if k not in prov or os.path.basename(f) == f'resolucoes-{m}.json':
                    prov[k] = f
    for k, f in prov.items():
        idx.setdefault(k, (f, 'prova'))
    _IDX[m] = idx
    return idx


def acha_fonte(m, qid, res_site):
    idx = indice_fontes(m)
    if qid in idx:
        return idx[qid]
    # resolução de prova aplicada a questão antiga (mesma questão, id antigo): procura pelo conteúdo igual
    alvo = json.dumps(res_site.get('resposta'), ensure_ascii=False)
    for f in glob.glob(os.path.join(PROVAS, '*', 'resolucoes*.json')):
        for k, v in ler(f).items():
            if v.get('aprovada') and json.dumps(v['resolucao'].get('resposta'), ensure_ascii=False) == alvo \
                    and v['resolucao'].get('armadilha') == res_site.get('armadilha'):
                return (f, 'prova', k)
    return (None, None)


def cmd_subs(m):
    d, _ = por_sub(m)
    _, subs = L.nomes_materia(m)
    tot = 0
    for s, v in d.items():
        tot += len(v)
        print(f'{s:8} {len(v):4}  {subs.get(s, "")}')
    print('total', tot)


def cmd_lote(m, sub, k, n=15):
    d, res = por_sub(m)
    qs = d[sub][(k - 1) * n:k * n]
    ent = []
    for q in qs:
        if q.get('print'):
            ent += L.entrada(m, [q])
        else:  # questão antiga do protótipo: texto e alternativas no banco; print em public/<m>/prints
            alts = q.get('alts')
            if isinstance(alts, str):
                import ast
                try:
                    alts = ast.literal_eval(alts)
                except Exception:
                    alts = {'texto': alts}
            ent.append({'id': q['id'], 'prova': f"{q['escola']} {q['ano']}" + (f" {q['fase']}" if q.get('fase') else '')
                        + f" · questão {q['n']}", 'conteudo': q['sub'], 'nivel': q.get('dif'),
                        'gabarito_oficial': q['gab'], 'letras': sorted(alts) if isinstance(alts, dict) else [],
                        'print': os.path.join('app', 'public', 'conteudo', m, 'prints', q['id'] + '.webp'),
                        'ver_no_site': f"#/m/{m}/q/{q['id']}", 'tem_figura': bool(q.get('figura')),
                        'texto_da_prova': q.get('enun', ''), 'alternativas': alts, 'ler_o_print': True,
                        'url_da_fonte': q.get('url')})
    for e, q in zip(ent, qs):
        e['resolucao_no_site'] = res[q['id']]
        e['dif'] = q.get('dif')
        f = acha_fonte(m, q['id'], res[q['id']])
        e['fonte'] = os.path.relpath(f[0], RAIZ) if f[0] else None
        if len(f) == 3:
            e['fonte_id'] = f[2]
    os.makedirs(TRAB, exist_ok=True)
    out = os.path.join(TRAB, f'{m}-{sub}-{k}.json')
    gravar(out, ent)
    # o que o ALUNO recebe: 1º só a questão; 2º a correção como o site mostra (os 4 blocos)
    so_q = [{x: e[x] for x in ('id', 'prova', 'texto_da_prova', 'alternativas', 'print', 'ler_o_print', 'ocr_do_print')
             if x in e} for e in ent]
    gravar(os.path.join(TRAB, f'{m}-{sub}-{k}.aluno-questoes.json'), so_q)
    cor = []
    for e in ent:
        r = e['resolucao_no_site']
        cor.append({'id': e['id'], 'gabarito': e['gabarito_oficial'],
                    '1_por_que_eu_errei (texto da letra que você marcou, se errou)': r.get('erradas', {}),
                    '2_resposta_correta': r.get('resposta'), '2_a_pegadinha': r.get('armadilha'),
                    '3_resolucao_passo_a_passo': [{k2: p.get(k2) for k2 in ('faz', 'conta', 'porque') if p.get(k2)}
                                                  for p in r.get('passos', [])],
                    '4_por_que_as_outras_estao_erradas (fechado; abre ao clicar)': r.get('erradas', {})})
    gravar(os.path.join(TRAB, f'{m}-{sub}-{k}.aluno-correcao.json'), cor)
    print(out, len(ent), 'questões de', len(d[sub]))
    sem = [e['id'] for e in ent if not e['fonte']]
    if sem:
        print('SEM FONTE:', sem)


def caminho(alvo, campo):
    partes = campo.split('.')
    cur = alvo
    for p in partes[:-1]:
        cur = cur[int(p)] if isinstance(cur, list) else cur.setdefault(p, {})
    return cur, (int(partes[-1]) if isinstance(cur, list) else partes[-1])


def cmd_aplica(arq):
    corr = ler(arq)
    cache = {}
    feitos = 0
    for c in corr:
        m = c.get('m', 'por')
        f = c['fonte'] if c.get('fonte') else None
        if not f:
            sys.exit(f'{c["id"]}: correção sem "fonte"')
        f = os.path.join(RAIZ, f)
        d = cache.setdefault(f, ler(f))
        kid = c.get('fonte_id', c['id'])
        r = d[kid]
        if '/provas/' in f:
            raiz = r if c['campo'].split('.')[0] in CAMPOS_RES else r['resolucao']
        else:
            raiz = r
        pai, ch = caminho(raiz, c['campo'])
        atual = pai[ch] if (isinstance(pai, list) and ch < len(pai)) or (isinstance(pai, dict) and ch in pai) else None
        if 'antes' in c and atual != c['antes']:
            sys.exit(f'{c["id"]} {c["campo"]}: "antes" não bate com o arquivo.\n  arquivo: {atual!r}\n  antes:   {c["antes"]!r}')
        if c.get('apagar'):
            if isinstance(pai, list):
                pai.pop(ch)
            else:
                pai.pop(ch, None)
        elif isinstance(pai, list) and ch == len(pai):
            pai.append(c['novo'])
        else:
            pai[ch] = c['novo']
        feitos += 1
    if SECO:
        print('teste (--seco): nada gravado;', feitos, 'correções conferem')
        return
    for f, d in cache.items():
        gravar(f, d)
    print('aplicadas', feitos, 'correções em', len(cache), 'arquivos')


def cmd_registra(lote):
    """Acrescenta ao <m>-achados.jsonl os achados do lote (correções conferidas, rejeitados, dados, gabarito)."""
    m, sub = lote.split('-')[0], lote.split('-')[1]
    base = os.path.join(TRAB, lote)
    conf = {(c['id'], c['campo']): c for c in ler(base + '.conferencia.json', [])}
    out = []
    for c in ler(base + '.correcoes.json', []):
        k = conf.get((c['id'], c['campo']), {})
        out.append({'id': c['id'], 'sub': sub, 'papel': c.get('papel', 'professor'), 'campo': c['campo'],
                    'problema': c.get('motivo', ''), 'correcao': c['novo'] if isinstance(c['novo'], str) else 'lista nova',
                    'status': 'corrigido' if k.get('ok', True) else 'refeito na conferência'})
    for r in ler(base + '.rejeitados.json', []):
        out.append({'id': r.get('id', ''), 'sub': sub, 'papel': r.get('papel', ''), 'campo': r.get('campo', ''),
                    'problema': r.get('apontamento', r.get('problema', '')), 'correcao': r.get('motivo', r.get('porque', '')),
                    'status': 'não procede'})
    for d in ler(base + '.dados.json', []):
        out.append({'id': d['id'], 'sub': sub, 'papel': 'dados', 'campo': 'enunciado/print', 'problema': d['problema'],
                    'correcao': '', 'status': 'para a coordenação'})
    for g in ler(base + '.gabarito.json', []):
        out.append({'id': g['id'], 'sub': sub, 'papel': 'professor', 'campo': 'gabarito', 'problema': g.get('motivo', ''),
                    'correcao': '', 'status': 'para a coordenação'})
    f = os.path.join(RAIZ, 'docs', 'revisao-site', 'super-revisao', f'{m}-achados.jsonl')
    with open(f, 'a', encoding='utf-8') as h:
        for x in out:
            h.write(json.dumps(x, ensure_ascii=False) + '\n')
    print(lote, len(out), 'achados registrados')


def cmd_final(lote):
    """<lote>.final.json = correções com a versão do professor novo onde ele recusou (ok=false)."""
    base = os.path.join(TRAB, lote)
    conf = {(c['id'], c['campo']): c for c in ler(base + '.conferencia.json', [])}
    out, troc = [], 0
    for c in ler(base + '.correcoes.json', []):
        k = conf.get((c['id'], c['campo']))
        if k and not k.get('ok', True):
            if not k.get('como_deve_ficar') or type(k['como_deve_ficar']) is not type(c['novo']):
                print('VERSÃO do conferente ausente ou de outro tipo (lista x texto); acerte à mão:', c['id'], c['campo'])
                continue
            c = dict(c, novo=k['como_deve_ficar'], motivo=c.get('motivo', '') + ' (texto do professor novo)')
            troc += 1
        out.append(c)
    gravar(base + '.final.json', out)
    print(lote, len(out), 'correções finais;', troc, 'com o texto do professor novo')


SECO = '--seco' in sys.argv

if __name__ == '__main__':
    a = [x for x in sys.argv[1:] if x != '--seco']
    if not a:
        sys.exit(__doc__)
    if a[0] == 'subs':
        cmd_subs(a[1])
    elif a[0] == 'lote':
        cmd_lote(a[1], a[2], int(a[3]), int(a[4]) if len(a) > 4 else 15)
    elif a[0] == 'final':
        cmd_final(a[1])
    elif a[0] == 'registra':
        cmd_registra(a[1])
    elif a[0] == 'aplica':
        cmd_aplica(a[1])
    else:
        sys.exit(__doc__)

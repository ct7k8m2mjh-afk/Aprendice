#!/usr/bin/env python3
"""Super revisão SR-2 (bio, qui, geo): registro dos achados de um lote já corrigido e conferido.

Lotes, correções e aplicação: ferramentas/resolucoes/sr3.py (mesmo formato). Este script só registra.

  python3 ferramentas/resolucoes/sr2.py registra <m> <lote> [<lote> ...]
      lote = nome do arquivo sem extensão (ex.: bio-B01.1-1). Lê em docs/revisao-site/super-revisao/trabalho/
      <lote>.professor.json, .aluno-2.json, .correcoes.json, .conferencia.json, .rejeitados.json, .gabarito.json
      e acrescenta uma linha por achado em docs/revisao-site/super-revisao/<m>-achados.jsonl.
      Imprime a linha da tabela do <m>.md (questões, campos corrigidos, erro/clareza, gabarito suspeito).
"""
import json
import os
import sys

RAIZ = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SR = os.path.join(RAIZ, 'docs', 'revisao-site', 'super-revisao')
TRAB = os.path.join(SR, 'trabalho')


def ler(nome, p=None):
    f = os.path.join(TRAB, nome)
    if not os.path.exists(f):
        return p
    try:
        return json.load(open(f, encoding='utf-8'))
    except json.JSONDecodeError:
        return p


def registra(m, lotes):
    linhas = []
    nq = ncor = erro = clar = 0
    susp = []
    for lt in lotes:
        sub = lt.split('-')[1]
        nq += len(ler(lt + '.json', []))
        conf = {(c.get('id'), c.get('campo')): c for c in ler(lt + '.conferencia.json', []) or []}
        for p in ler(lt + '.professor.json', []) or []:
            for pr in p.get('problemas') or []:
                if pr.get('gravidade') == 'erro':
                    erro += 1
                else:
                    clar += 1
            if p.get('gabarito_suspeito'):
                susp.append(p['id'])
        for c in ler(lt + '.correcoes.json', []) or []:
            ncor += 1
            k = conf.get((c.get('id'), c.get('campo')))
            st = 'corrigido' if not k or k.get('ok', True) else 'ajustado na conferência'
            linhas.append({'id': c.get('id'), 'sub': sub, 'papel': c.get('papel', 'professor'), 'campo': c.get('campo'),
                           'problema': c.get('motivo', ''), 'correcao': c.get('novo') if isinstance(c.get('novo'), str)
                           else json.dumps(c.get('novo'), ensure_ascii=False)[:400], 'status': st})
        for r in ler(lt + '.rejeitados.json', []) or []:
            if isinstance(r, dict):
                linhas.append({'id': r.get('id'), 'sub': sub, 'papel': r.get('papel', ''), 'campo': r.get('campo', ''),
                               'problema': r.get('apontamento') or r.get('problema') or '',
                               'correcao': '', 'status': 'rejeitado: ' + str(r.get('motivo') or r.get('porque') or '')})
        for g in ler(lt + '.gabarito.json', []) or []:
            linhas.append({'id': g.get('id'), 'sub': sub, 'papel': 'professor', 'campo': 'gabarito',
                           'problema': g.get('motivo', ''), 'correcao': '', 'status': 'coordenação: ' + str(g.get('decisao'))})
    with open(os.path.join(SR, f'{m}-achados.jsonl'), 'a', encoding='utf-8') as h:
        for x in linhas:
            h.write(json.dumps(x, ensure_ascii=False) + '\n')
    print(f'| {lotes[0].split("-")[1]} | {nq} | {len(lotes)} | {ncor} | {erro}/{clar} | {", ".join(susp) or "—"} |')


if __name__ == '__main__':
    a = sys.argv[1:]
    if len(a) >= 3 and a[0] == 'registra':
        registra(a[1], a[2:])
    else:
        sys.exit(__doc__)

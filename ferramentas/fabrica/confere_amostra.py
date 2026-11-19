#!/usr/bin/env python3
"""Monta a lista da conferência do Claude Code sobre um lote da fábrica.

Regra do piloto: 100% das divergências, pendentes, obras e das questões que as lentes mudaram
muito, mais uma amostra aleatória de 10% das outras. Imprime a lista (ids e motivo) e grava um
arquivo por grupo de agente conferente, com a questão, o print e a resolução a conferir.

  python3 ferramentas/fabrica/confere_amostra.py <lote> [--agentes 3] [--semente 94]
"""
import argparse
import json
import os
import random

RAIZ = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
TRAB = os.path.join(RAIZ, 'docs', 'resolucoes', 'trabalho')
SAIDA = os.path.join(RAIZ, 'fabrica_saida', 'resolucoes')
# "mudou muito": a lente trocou pelo menos esta quantidade de campos
MUITO = 12


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('lote')
    ap.add_argument('--agentes', type=int, default=3)
    ap.add_argument('--semente', type=int, default=0)
    ap.add_argument('--erros', default='', help='ids com erro/aviso no lote.py valida, separados por vírgula')
    a = ap.parse_args()

    ent = {q['id']: q for q in json.load(open(os.path.join(TRAB, a.lote + '.entrada.json'),
                                              encoding='utf-8'))['questoes']}
    sai = json.load(open(os.path.join(TRAB, a.lote + '.saida.json'), encoding='utf-8'))
    rel = json.load(open(os.path.join(SAIDA, a.lote, 'relatorio.json'), encoding='utf-8'))
    por_id = {q['id']: q for q in sai['questoes']}
    diario = rel.get('diario', {})

    obrigatorias, motivos = {}, {}
    for qid, q in por_id.items():
        linhas = diario.get(qid, [])
        texto = ' '.join(linhas)
        motivo = []
        if q['status'] != 'ok':
            motivo.append(q['status'] + ': ' + q.get('motivo', '')[:90])
        if 'divergência' in texto:
            motivo.append('divergência de gabarito')
        if 'OBRA' in texto:
            motivo.append('obra literária')
        if 'gabarito do Aprendice' in texto:
            motivo.append('gabarito do Aprendice (sem gabarito publicado)')
        if 'REPROVOU' in texto or 'não marcou fatos_ok' in texto:
            motivo.append('lente de fatos não assinou')
        if 'didática viu possível erro de fato' in texto:
            motivo.append('a lente didática viu possível erro de fato')
        if 'cortado em max_tokens' in texto or 'avulsa' in texto:
            motivo.append('lente refeita fora do batch')
        if 'conserto impossível' in texto or 'caminho recusado' in texto:
            motivo.append('correção de lente não aplicada')
        mudancas = sum(l.count('" -> "') for l in linhas
                       if l.startswith(('fatos:', 'didática:', 'fatos (2', 'lente de fatos avulsa')))
        if mudancas >= MUITO:
            motivo.append(f'as lentes mudaram {mudancas} campos')
        if qid in (a.erros or '').split(','):
            motivo.append('erro ou aviso do lote.py valida')
        if motivo:
            obrigatorias[qid] = '; '.join(motivo)
    resto = [q for q in por_id if q not in obrigatorias and por_id[q]['status'] == 'ok']
    random.seed(a.semente or int(a.lote.split('-')[1]))
    n = max(1, round(len(resto) * 0.10))
    amostra = sorted(random.sample(resto, min(n, len(resto))))
    for qid in amostra:
        motivos[qid] = 'amostra aleatória 10%'
    motivos.update(obrigatorias)

    print(f'{a.lote}: {len(por_id)} questões · conferir {len(motivos)} '
          f'({len(obrigatorias)} obrigatórias + {len(amostra)} da amostra)')
    for qid in sorted(motivos):
        print(f'  {qid} [{por_id[qid]["status"]}] {motivos[qid]}')

    ids = sorted(motivos)
    destino = os.path.join(SAIDA, a.lote, 'conferencia')
    os.makedirs(destino, exist_ok=True)
    partes = [ids[i::a.agentes] for i in range(a.agentes)]
    for k, parte in enumerate(partes, 1):
        if not parte:
            continue
        pacote = [{'motivo_da_conferencia': motivos[qid],
                   'entrada': ent[qid],
                   'relatorio_das_lentes': diario.get(qid, []),
                   'saida': por_id[qid]} for qid in parte]
        f = os.path.join(destino, f'parte{k}.json')
        json.dump(pacote, open(f, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
        print(f'  parte {k}: {len(parte)} questões -> {f}')


if __name__ == '__main__':
    main()

# -*- coding: utf-8 -*-
"""Corte para 500 questoes por materia (27/10). Regra do Vitor: NUNCA excluir questao de
vestibular ou ENEM. So sai questao de lista de site sem origem de prova (nem no campo banca,
nem citada no enunciado/url). Ordem: soltas (fora de escada) primeiro; depois encurta as escadas
mais longas tirando o degrau de site que menos quebra a subida de dificuldade, preservando
as pontas; piso de 3 degraus; renumera 1..k."""
import json, re, sys, collections
ALVO = 500
EXAME = re.compile(r'\(\s*(enem|fuvest|unicamp|unesp|vunesp|ufrgs|uerj|ufrj|ufmg|ufpr|ufsc|ufpe|ufba|ufc|unifesp|puc|mackenzie|fatec|fgv|ita|ime|uel|uem|uepg|udesc|ufu|ufjf|ufv|ufscar|ufes|ufg|ufpb|ufrn|ufal|ufam|ufpa|ufms|ufmt|unb|uece|uern|cefet|ifsp|ifsc|ifce|ifba|famerp|famema|einstein|albert einstein|santa casa|s[ãa]o camilo|fmabc|fcmscsp|unicid|uninove|unitau|pucc|pucrs|pucpr|pucsp|pucrj|pucmg|espm|insper|enade|cesgranrio|ucs|ufsm|ufpel|furg|unioeste|uff|unirio|ufrrj|uenf|uesc|uefs|uesb|uneb|ufrb|univasf|ufcg|uepb|ufpi|uespi|ufma|uema|ufop|ufla|ufsj|uftm|unemat|uems|ufgd|ueg|[A-Z]{2,}[\w\- /]*\d{4})', re.I)
# citacao de fonte no comeco do enunciado: "(UCPel) ...", "(MACK-SP) ...", "QUESTAO 3 (FEI-SP) ..."
INICIO = re.compile(r'^\s*(?:quest[ãa]o\s*\d+\s*[-–.:]?\s*)?\(\s*[A-Za-zÀ-ú][^()]{0,45}\)')
# sigla de banca em qualquer ponto: 3+ maiusculas, com ou sem -UF / ano  ex.: (UFTM-MG), (PUC-Rio), (Mackenzie)
SIGLA = re.compile(r'\((?:[A-ZÁÉÍÓÚÂÊÔÃÕÇ][a-zà-ú]*){0,1}[A-ZÁÉÍÓÚÂÊÔÃÕÇ]{3,}[a-zà-ú]*(?:[-–/ ][A-Za-zÀ-ú0-9]{1,12}){0,3}\s*\)')
# sigla de banca ANTES do parentese/travessao: "FDV (Faculdade de Direito de Vitoria) — ...", "UFPR – ..."
SIGLA_INICIO = re.compile(r'^\s*[A-ZÁÉÍÓÚÂÊÔÃÕÇ]{2,}[A-Za-z]*(?:[-/][A-Za-z]{1,8})?\s*(?:\(|—|–|-\s)')
# marcas de questao copiada de prova: "na prova", e o rodape tipico do ENEM "Acesso em: ... (adaptado)"
DE_PROVA = re.compile(r'\bna prova\b|Acesso em:?[^\n]{0,40}\(adaptad[oa]\)', re.I)
SOLTO = re.compile(r'\b(enem|vestibular|fuvest|unicamp|vunesp|unesp|fatec|famerp|famema|einstein|santa casa|s[ãa]o camilo)\b', re.I)

def texto(q):
    e = q.get('enun') or ''
    if isinstance(e, list): e = ' '.join(map(str, e))
    return str(e) + ' ' + str(q.get('url') or '') + ' ' + str(q.get('conceito') or '')

def e_exame(q):
    if (q.get('banca') or '').strip(): return True
    if q.get('tipo') not in ('site',) and (q.get('escola') or '') not in ('Brasil Escola', 'Mundo Educação', 'Mundo Educacao', 'Prepara Enem', 'InfoEscola'):
        return True                      # prova/texto/imagem de escola que e banca: fica
    if (q.get('escola') or '') == 'Prepara Enem': return True   # site de questoes do ENEM: na duvida, fica
    t = texto(q)
    e = q.get('enun') or ''
    e = ' '.join(map(str, e)) if isinstance(e, list) else str(e)
    return bool(EXAME.search(t) or SOLTO.search(t) or INICIO.search(e) or SIGLA.search(e) or SIGLA_INICIO.search(e) or DE_PROVA.search(e))

PISO = 3          # nenhuma escada fica com menos de 3 degraus (ou o que ja tinha, se menor)

def escolhe(banco, alvo, piso_min=None):
    rem = {q['id'] for q in banco if not e_exame(q)}
    por = collections.defaultdict(list)
    for q in banco: por[q['sub']].append(q)
    total = collections.Counter(q['sub'] for q in banco)
    fora, vivos = set(), len(banco)
    # fase 1: soltas (fora de escada) de site, dos conteudos mais cheios primeiro
    soltas = sorted([q for q in banco if q['id'] in rem and not q.get('degrau')],
                    key=lambda q: (-total[q['sub']], q['id']))
    for q in soltas:
        if vivos <= alvo: break
        fora.add(q['id']); vivos -= 1; total[q['sub']] -= 1
    # fase 2: encurtar escadas
    def escada(s): return sorted([q for q in por[s] if q.get('degrau') and q['id'] not in fora], key=lambda q: q['degrau'])
    pm = PISO if piso_min is None else piso_min
    piso = {s: min(pm, len(escada(s))) for s in por}
    while vivos > alvo:
        melhor = None
        for s in por:
            e = escada(s)
            if len(e) <= piso[s]: continue
            for i, q in enumerate(e):
                if q['id'] not in rem: continue
                ponta = (i == 0 or i == len(e) - 1)
                ant = e[i-1]['dif'] if i > 0 else e[i]['dif']
                pos = e[i+1]['dif'] if i < len(e) - 1 else e[i]['dif']
                custo = (ponta, -len(e), (pos - ant), -total[s], q['id'])
                if melhor is None or custo < melhor[0]: melhor = (custo, q)
        if melhor is None: break
        q = melhor[1]; fora.add(q['id']); vivos -= 1; total[q['sub']] -= 1
    return fora, len(rem)

def renumera(fica):
    por = collections.defaultdict(list)
    for q in fica:
        if q.get('degrau'): por[q['sub']].append(q)
    for s, l in por.items():
        for k, q in enumerate(sorted(l, key=lambda q: q['degrau']), 1): q['degrau'] = k

if __name__ == '__main__':
    aplicar = '--aplicar' in sys.argv
    for d in ['bio', 'qui', 'mat', 'por']:
        p = f'{d}/index.html'; h = open(p, encoding='utf-8').read()
        a = h.find('<script id="dados"'); a = h.find('>', a) + 1; b = h.find('</script>', a)
        D = json.loads(h[a:b]); B = D['banco']
        fora, nrem = escolhe(B, ALVO, 2 if d == 'por' else None)
        fica = [q for q in B if q['id'] not in fora]
        renumera(fica)
        lens = collections.Counter(sum(1 for q in fica if q['sub']==x and q.get('degrau')) for x in {q['sub'] for q in fica})
        pontas = sum(1 for q in B if q['id'] in fora and q.get('degrau'))
        assert all(e_exame(q) for q in B if q['id'] in fora) is False or True
        assert not any(e_exame(q) for q in B if q['id'] in fora), 'tentou tirar questao de prova!'
        cel0 = {(q['sub'], q.get('degrau') or 0) for q in B if q.get('degrau')}
        cel1 = {(q['sub'], q.get('degrau') or 0) for q in fica if q.get('degrau')}
        subs0 = {q['sub'] for q in B}; subs1 = {q['sub'] for q in fica}
        dz = sum(1 for q in B if q['id'] in fora and not q.get('degrau'))
        print(f'{d}: {len(B)} -> {len(fica)} | removiveis {nrem} | sairam {len(fora)} ({dz} fora de escada) | '
              f'conteudos vazios {len(subs0 - subs1)} | provas que ficam {sum(e_exame(q) for q in fica)} | degraus tirados {pontas} | escadas (tam:qtd) {sorted(lens.items())}')
        if aplicar:
            D['banco'] = fica
            novo = json.dumps(D, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/')
            h2 = h[:a] + novo + h[b:]
            open(p, 'w', encoding='utf-8').write(h2)
            Dj = json.load(open(f'{d}/dados.json', encoding='utf-8'))
            Dj['banco'] = [q for q in Dj['banco'] if q['id'] not in fora]
            renumera(Dj['banco'])
            json.dump(Dj, open(f'{d}/dados.json', 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
            _p = f'{d}/corte_500_removidas.json'
            _ant = set(json.load(open(_p))) if __import__('os').path.exists(_p) else set()
            json.dump(sorted(_ant | set(fora)), open(_p, 'w'), indent=0)

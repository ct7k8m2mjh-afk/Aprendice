#!/usr/bin/env python3
"""Lotes de resolução para a sessão de resoluções (Fable, sem API).

Entrega cada lote pronto (questão, gabarito oficial, texto, print), confere o que a sessão escreveu e grava no lugar
que o site já lê (app/conteudo-fonte/provas/<prova>/resolucoes-<matéria>.json; um arquivo e um registro por matéria,
para várias sessões resolverem ao mesmo tempo sem conflito no git). Pendentes e divergências ficam registrados e não
voltam em lote nenhum.

Antes de tudo: `cd app && python3 scripts/converte.py` (o banco montado em app/public/conteudo é a base dos lotes).

  python3 ferramentas/resolucoes/lote.py status             quantas faltam, por matéria e faixa de prioridade
  python3 ferramentas/resolucoes/lote.py proximo [grupo]    abre o próximo lote (escolhe a matéria pela prioridade;
                                                            grupo: animadas = mat bio qui fis, texto = por geo his ing fs)
  python3 ferramentas/resolucoes/lote.py proximo <m> [N]    abre o próximo lote da matéria (N questões, padrão 30)
  python3 ferramentas/resolucoes/lote.py valida <saida>     confere o arquivo de saída sem gravar
  python3 ferramentas/resolucoes/lote.py grava <saida>      confere e grava (só depois da conferência do lote)
  python3 ferramentas/resolucoes/lote.py relatorio          refaz docs/resolucoes/lotes-<matéria>.md

Matérias: bio qui mat fis (resolução animada) · por geo his ing fs (resolução em texto).
"""
import datetime
import glob
import json
import os
import re
import sys

RAIZ = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
PUB = os.path.join(RAIZ, 'app', 'public', 'conteudo')
PROVAS = os.path.join(RAIZ, 'app', 'conteudo-fonte', 'provas')
DOCS = os.path.join(RAIZ, 'docs', 'resolucoes')
# sessão dona do lote (cada sessão do Claude Code tem o seu id); --retomar <lote> assume um lote aberto sem dono
SESSAO = os.environ.get('CLAUDE_CODE_SESSION_ID', '')
RETOMAR = sys.argv[sys.argv.index('--retomar') + 1] if '--retomar' in sys.argv[:-1] else None
if '--retomar' in sys.argv:
    i = sys.argv.index('--retomar')
    del sys.argv[i:i + 2]
NOVO = '--novo' in sys.argv
if NOVO:
    sys.argv.remove('--novo')
TRAB = os.path.join(DOCS, 'trabalho')  # lotes abertos (fora do git; refeitos a partir do registro se sumirem)
REGISTRO_ANTIGO = os.path.join(DOCS, 'registro.json')  # um só para todas (até 11/11/2026); hoje um por matéria

MATERIAS = ['bio', 'qui', 'mat', 'fis', 'por', 'geo', 'his', 'ing', 'fs']
NOMES = {'bio': 'Biologia', 'qui': 'Química', 'mat': 'Matemática', 'fis': 'Física', 'por': 'Português',
         'geo': 'Geografia', 'his': 'História', 'ing': 'Inglês', 'fs': 'Filosofia e Sociologia'}
ANIMADAS = {'bio', 'qui', 'mat', 'fis'}
# provas-alvo mais procuradas depois do ENEM (ordem de prioridade; o resto vem depois)
ALVO = ['Fuvest', 'Unicamp', 'Unesp', 'UERJ', 'Unifesp', 'UFPR', 'UEL', 'UFU', 'Famerp', 'Santa Casa',
        'Santa Casa (FCMSCSP)', 'Einstein', 'Albert Einstein', 'Famema', 'São Camilo', 'FMABC', 'Sírio-Libanês',
        'PUC-SP', 'PUC-Campinas', 'Mackenzie', 'UPE', 'UECE', 'UEA', 'UDESC', 'Acafe']
FAIXAS = ['ENEM nível 1-6', 'provas-alvo nível 1-6', 'demais nível 1-6', 'ENEM nível 7-10',
          'provas-alvo nível 7-10', 'demais nível 7-10']
TIPOS = {'localizar', 'calcular', 'comparar', 'eliminar', 'concluir'}
PROIBIDAS = re.compile(r'\b(provavelmente|talvez|chute|distrator)\b', re.I)
EMOJI = re.compile('[\U0001F300-\U0001FAFF☀-➿⭐✅]')
CAMPOS = ['antes', 'pista', 'passos', 'resposta', 'checagem', 'erradas', 'armadilha', 'alerta', 'essencial']


def ler(f, padrao=None):
    if not os.path.exists(f):
        return padrao
    with open(f, encoding='utf-8') as h:
        return json.load(h)


def gravar(f, d):
    os.makedirs(os.path.dirname(f), exist_ok=True)
    tmp = f + '.tmp'
    with open(tmp, 'w', encoding='utf-8') as h:
        json.dump(d, h, ensure_ascii=False, indent=1)
        h.write('\n')
    os.replace(tmp, f)


def caminho_registro(m):
    return os.path.join(DOCS, f'registro-{m}.json')


def _migra_registro():
    """registro.json único -> um por matéria (várias sessões gravam ao mesmo tempo sem conflito no git)."""
    if not os.path.exists(REGISTRO_ANTIGO):
        return
    velho = ler(REGISTRO_ANTIGO)
    for m in MATERIAS:
        r = ler(caminho_registro(m), {'lotes': {}, 'pendentes': {}, 'divergencias': {}})
        r['lotes'].update({k: v for k, v in velho['lotes'].items() if v['materia'] == m})
        for alvo in ('pendentes', 'divergencias'):
            r[alvo].update({k: v for k, v in velho[alvo].items() if v['materia'] == m})
        if r['lotes'] or r['pendentes'] or r['divergencias']:
            gravar(caminho_registro(m), r)
    os.remove(REGISTRO_ANTIGO)


def registro(m=None):
    """Registro de uma matéria; sem matéria, a soma de todas (só para ler)."""
    _migra_registro()
    if m:
        return ler(caminho_registro(m), {'lotes': {}, 'pendentes': {}, 'divergencias': {}})
    tudo = {'lotes': {}, 'pendentes': {}, 'divergencias': {}}
    for x in MATERIAS:
        r = registro(x)
        for k in tudo:
            tudo[k].update(r[k])
    return tudo


def faixa(q):
    alto = int(q.get('dif') or 0) >= 7
    base = 0 if q['escola'] == 'ENEM' else (1 if q['escola'] in ALVO else 2)
    return base + (3 if alto else 0)


def prioridade():
    """Provas que o dono mandou passar na frente (docs/resolucoes/prioridade.json: {"provas": ["saocamilo-", ...]},
    prefixos de id de prova). Ex.: São Camilo, prioridade máxima (dono, 11/11/2026)."""
    return tuple(ler(os.path.join(DOCS, 'prioridade.json'), {}).get('provas') or ())


def chave(q):
    alvo = ALVO.index(q['escola']) if q['escola'] in ALVO else len(ALVO)
    pri = prioridade()
    if pri and str(q.get('prova', '')).startswith(pri):
        return (-1, q.get('prova', ''), int(re.sub(r'\D', '', str(q.get('n'))) or 0), q['sub'], alvo, q['escola'], '', '', 0)
    return (faixa(q), q['sub'], alvo, q['escola'], str(q.get('ano')), q.get('prova', ''), int(re.sub(r'\D', '', str(q.get('n'))) or 0))


def resolvidas_em_provas():
    ids = set()
    for f in glob.glob(os.path.join(PROVAS, '*', 'resolucoes*.json')):
        ids |= {k for k, v in ler(f).items() if v.get('aprovada')}
    return ids


def banco(m):
    """Questões de prova da matéria ainda sem resolução e fora de qualquer lote, pendência ou divergência."""
    if not os.path.exists(os.path.join(PUB, m, 'banco.json')):
        sys.exit('Falta o banco montado. Rode antes: cd app && python3 scripts/converte.py')
    b = ler(os.path.join(PUB, m, 'banco.json'))
    feitas = set()
    for f in glob.glob(os.path.join(PUB, m, 'res', '*.json')):
        feitas |= set(ler(f))
    return b, feitas


def ocupadas(reg):
    ids = set(reg['pendentes']) | set(reg['divergencias'])
    # pendências e divergências registradas à mão pela sessão do Fable (pendentes.md, divergencias.md)
    for f in ('pendentes.md', 'divergencias.md'):
        c = os.path.join(DOCS, f)
        if os.path.exists(c):
            ids |= set(re.findall(r'\bP[0-9a-f]{8}\b', open(c, encoding='utf-8').read()))
    for l in reg['lotes'].values():
        ids |= set(l['ids'])
    return ids


def faltam(m, reg, feitas_provas):
    b, feitas = banco(m)
    ocup = ocupadas(reg)
    return [q for q in b if q.get('prova') and q['id'] not in feitas and q['id'] not in feitas_provas and q['id'] not in ocup
            and not str(q.get('pendente', '')).startswith('indisponível')]   # fora do site por decisão do dono


def nomes_materia(m):
    mat = ler(os.path.join(PUB, m, 'materia.json'))
    temas = {x['id']: x['nome'] for x in mat['modulos']}
    subs = {s['id']: s['nome'] for x in mat['modulos'] for s in x['subs']}
    return temas, subs


def limpa(s):
    s = re.sub(r'[ \t]+\n', '\n', s or '')
    s = re.sub(r'\n{3,}', '\n\n', s)
    s = re.sub(r'_{8,}', '', s)
    return s.strip()


_PROVAS_CACHE = {}


def transcricao_da_prova(q):
    """Transcrição organizada guardada no prova.json (quando a do site montado não veio)."""
    pid = q.get('prova')
    if not pid:
        return None
    if pid not in _PROVAS_CACHE:
        _PROVAS_CACHE[pid] = {x['id']: x for x in ler(os.path.join(PROVAS, pid, 'prova.json'), {}).get('questoes', [])}
    return (_PROVAS_CACHE[pid].get(q['id']) or {}).get('transcricao')


def info_da_prova(q):
    pid = q.get('prova')
    if not pid:
        return {}
    p = ler(os.path.join(PROVAS, pid, 'prova.json'), {})
    pq = next((x for x in p.get('questoes', []) if x['id'] == q['id']), {})
    return {'nota': p.get('nota', ''), 'pdf': (p.get('fontes') or {}).get(pq.get('caderno'), ''),
            'preliminar': pq.get('gab_preliminar') or '', 'nota_gabarito': pq.get('nota_gabarito') or ''}


def separa_alternativas(texto, letras):
    """Tenta separar enunciado e alternativas da camada de texto: marcadores '(A)', 'A)', 'a)', 'A.', 'A ⇒' em ordem.
    Usa o ÚLTIMO marcador da primeira letra que ainda tem as outras em ordem depois dele: nas questões de associar
    (I–IV com características A–D antes das alternativas a–e), as características não passam por alternativas."""
    rx = {L: re.compile(rf'(?:^|\n)\s*\(?(?:{L}|{L.lower()})\s*(?:\)|\.|⇒|=>|-|–)\s*', re.M) for L in letras}

    def cadeia(ini):
        pos = {}
        for L in letras:
            m = rx[L].search(texto, ini)
            if not m:
                return None
            pos[L] = (m.start(), m.end())
            ini = m.end()
        return pos

    pos = None
    for m in reversed(list(rx[letras[0]].finditer(texto))):
        pos = cadeia(m.start())
        if pos:
            break
    if not pos:
        return None
    enun = texto[:pos[letras[0]][0]].strip()
    alts = {}
    for i, L in enumerate(letras):
        fim = pos[letras[i + 1]][0] if i + 1 < len(letras) else len(texto)
        alts[L] = ' '.join(texto[pos[L][1]:fim].split())
    return enun, alts


def norm_cit(x, caixa=False):
    """Normaliza para comparar citação com a prova: minúsculas, junta palavra partida no fim da linha, tira aspas
    e pontuação das pontas, espaços simples."""
    x = str(x).replace('\u00ad', '')
    if not caixa:
        x = x.lower()
    x = re.sub(r'(\w)-\s*\n\s*(\w)', r'\1\2', x)
    x = re.sub(r'(\w)- (\w)', r'\1\2', x)
    x = re.sub(r'[“”"«»]', '', x).replace('‘', "'").replace('’', "'")
    x = re.sub(r'\s/\s', ' ', x)
    return ' '.join(x.split()).strip(' .,;:!?()[]')


def texto_ruim(t):
    """Camada de texto vazia ou embaralhada (muitas linhas de 1–3 caracteres, comum em figura e em duas colunas)."""
    linhas = [x.strip() for x in (t or '').split('\n') if x.strip()]
    if len(' '.join(linhas)) < 40:
        return True
    curtas = sum(1 for x in linhas if len(x) <= 3)
    return curtas / max(len(linhas), 1) > 0.3


def ocr_do_print(caminho):
    """Texto do print lido por OCR (tesseract, português + inglês). Vazio se o tesseract não existir."""
    import shutil
    import subprocess
    import tempfile
    if not shutil.which('tesseract') or not os.path.exists(caminho):
        return ''
    try:
        from PIL import Image
        with tempfile.NamedTemporaryFile(suffix='.png') as tmp:
            Image.open(caminho).convert('RGB').save(tmp.name)
            r = subprocess.run(['tesseract', tmp.name, '-', '-l', 'por+eng'], capture_output=True, text=True, timeout=60)
        return limpa(r.stdout)
    except Exception:
        return ''


def entrada(m, qs):
    temas, subs = nomes_materia(m)
    txt = {}
    out = []
    for q in qs:
        if q['sub'] not in txt:
            txt[q['sub']] = ler(os.path.join(PUB, m, 'txt', q['sub'] + '.json'), {})
        t = txt[q['sub']].get(q['id'], {})
        letras = sorted(q['alts'])
        e = {
            'id': q['id'],
            'prova': f"{q['escola']} {q['ano']}" + (f" {q['fase']}" if q.get('fase') else '') + f" · questão {q['n']}",
            'conteudo': f"{q['sub']} {subs.get(q['sub'], '')} (tema {q['modulo']} {temas.get(q['modulo'], '')})",
            'nivel': q.get('dif'),
            'gabarito_oficial': q['gab'],
            'letras': letras,
            'print': os.path.join('app', 'conteudo-fonte', q['print']),
            'ver_no_site': f"#/m/{m}/q/{q['id']}",
            # sobre a prova: nota da ingestão (versão, caderno, origem do gabarito) e o PDF oficial, para ver o
            # cabeçalho com constantes e o formulário que a prova fornece (ex.: UPE Física)
            'sobre_a_prova': info_da_prova(q).get('nota', ''),
            'pdf_oficial': info_da_prova(q).get('pdf', ''),
            'tem_figura': bool(q.get('figura')),
        }
        if info_da_prova(q).get('nota_gabarito'):
            # checagem do gabarito na web (errata, definitivo, resoluções publicadas), feita pela sessão principal
            e['nota_gabarito'] = info_da_prova(q)['nota_gabarito']
        tr = t.get('transcricao') or transcricao_da_prova(q)
        if isinstance(tr, dict) and tr.get('enun'):
            # transcrição organizada da prova oficial (mais limpa que a camada de texto)
            enun = tr['enun']
            e['texto_da_prova'] = limpa('\n\n'.join(b.get('t', '') for b in enun) if isinstance(enun, list) else str(enun))
            e['alternativas'] = {L: limpa(texto_todo(v)) for L, v in (tr.get('alts') or {}).items()}
        else:
            bruto = limpa(t.get('enun', ''))
            sep = separa_alternativas(bruto, letras) if bruto else None
            if sep:
                e['texto_da_prova'], e['alternativas'] = sep
            else:
                e['texto_da_prova'] = bruto
            if texto_ruim(bruto) or not sep:
                e['ler_o_print'] = True  # texto vazio, embaralhado ou sem as alternativas: a questão vale pelo print
        if e['tem_figura']:
            e['ler_o_print'] = True
        if e.get('ler_o_print'):
            o = ocr_do_print(os.path.join(RAIZ, e['print']))
            if o:
                # leitura automática da imagem, só como apoio: o que vale é o print
                e['ocr_do_print'] = o
        if not q.get('gab'):
            # princípio 2 (dono, 11/11/2026): a banca não publicou gabarito (ou só o preliminar). A questão só entra com
            # o gabarito do Aprendice: a sua letra e a do conferente, que resolve às cegas, têm de ser iguais (e iguais à
            # do preliminar, se houver). Antes, procure na web gabarito ou resolução publicada (banca, cursinho).
            e['gabarito_oficial'] = None
            e['sem_gabarito_publicado'] = True
            pre = info_da_prova(q).get('preliminar')
            if pre:
                e['gabarito_preliminar'] = pre
        out.append(e)
    return out


def caminho_entrada(lote):
    return os.path.join(TRAB, lote + '.entrada.json')


def caminho_saida(lote):
    return os.path.join(TRAB, lote + '.saida.json')


def cmd_status():
    reg = registro()
    fp = resolvidas_em_provas()
    print(f"{'matéria':24} {'faltam':>7}  " + '  '.join(f'f{i}' for i in range(len(FAIXAS))))
    total = 0
    for m in MATERIAS:
        qs = faltam(m, reg, fp)
        total += len(qs)
        por = [sum(1 for q in qs if faixa(q) == i) for i in range(len(FAIXAS))]
        print(f'{NOMES[m]:24} {len(qs):7}  ' + '  '.join(f'{n:>4}' for n in por))
    print(f"{'total':24} {total:7}")
    print('faixas: ' + ' · '.join(f'f{i} {n}' for i, n in enumerate(FAIXAS)))
    abertos = [k for k, v in reg['lotes'].items() if v['estado'] == 'aberto']
    print(f"lotes gravados: {sum(1 for v in reg['lotes'].values() if v['estado'] == 'gravado')} · abertos: {', '.join(abertos) or 'nenhum'}"
          f" · pendentes: {len(reg['pendentes'])} · divergências: {len(reg['divergencias'])}")


GRUPOS = {'animadas': ['mat', 'bio', 'qui', 'fis'], 'texto': ['por', 'geo', 'his', 'ing', 'fs']}


def escolhe_materia(reg, grupo=None):
    """Sem matéria: o lote aberto, se houver; senão a matéria com a questão de faixa mais alta na prioridade
    (ENEM nível 1-6 de todas as matérias primeiro, depois provas-alvo...), em empate na ordem de MATERIAS."""
    lista = GRUPOS.get(grupo, MATERIAS)
    for l in reg['lotes'].values():
        if l['estado'] == 'aberto' and l['materia'] in lista:
            return l['materia']
    fp = resolvidas_em_provas()
    melhor = None
    for m in lista:
        qs = faltam(m, reg, fp)
        if qs:
            f = min(faixa(q) for q in qs)
            if melhor is None or f < melhor[0]:
                melhor = (f, m)
    return melhor[1] if melhor else None


def cmd_proximo(m=None, n=30):
    reg = registro()
    if m is None or m in GRUPOS:
        m = escolhe_materia(reg, m)
        if m is None:
            print('Nenhuma questão sem resolução.')
            return
    if m not in MATERIAS:
        sys.exit(f'matéria inválida: {m} (use {" ".join(MATERIAS)})')
    reg = registro(m)
    # lote aberto da matéria DESTA sessão: devolve o mesmo (refaz a entrada se o arquivo sumiu). Lote aberto por outra
    # sessão não é devolvido (12/11/2026: duas sessões pegaram o mesmo lote e uma regravou por cima da outra).
    for nome, l in reg['lotes'].items():
        if l['materia'] == m and l['estado'] == 'aberto':
            if NOVO and l.get('dono') == SESSAO:
                continue   # --novo: o lote aberto está com o conferente; abre o próximo enquanto isso (esteira, dono 12/11)
            if l.get('dono') != SESSAO and RETOMAR != nome:
                print(f'(lote {nome} está aberto por outra sessão: pulado. Se ele é seu, rode: '
                      f'lote.py proximo {m} --retomar {nome})')
                continue
            if RETOMAR == nome and SESSAO and l.get('dono') != SESSAO:
                l['dono'] = SESSAO   # esta sessão assume o lote
                gravar(caminho_registro(m), reg)
            b, _ = banco(m)
            por_id = {q['id']: q for q in b}
            gravar(caminho_entrada(nome), {'lote': nome, 'materia': m, 'animada': m in ANIMADAS,
                                           'questoes': entrada(m, [por_id[i] for i in l['ids'] if i in por_id])})
            print(f'Lote {nome} já estava aberto: {caminho_entrada(nome)}')
            print(f'Saída: {caminho_saida(nome)}')
            return
    if NOVO and sum(1 for l in reg['lotes'].values() if l['materia'] == m and l['estado'] == 'aberto'
                    and l.get('dono') == SESSAO) >= 2:
        sys.exit('Esta sessão já tem 2 lotes abertos nesta matéria: grave um antes de abrir outro.')
    qs = sorted(faltam(m, reg, resolvidas_em_provas()), key=chave)[:n]
    if not qs:
        print(f'{NOMES[m]}: nenhuma questão sem resolução.')
        return
    k = 1 + sum(1 for v in reg['lotes'].values() if v['materia'] == m)
    nome = f'{m}-{k:04d}'
    reg['lotes'][nome] = {'materia': m, 'ids': [q['id'] for q in qs], 'estado': 'aberto', 'dono': SESSAO,
                          'aberto_em': datetime.date.today().isoformat(), 'faixa': FAIXAS[faixa(qs[0])]}
    gravar(caminho_entrada(nome), {'lote': nome, 'materia': m, 'animada': m in ANIMADAS, 'questoes': entrada(m, qs)})
    gravar(caminho_registro(m), reg)
    print(f'Lote {nome}: {len(qs)} questões ({FAIXAS[faixa(qs[0])]}, conteúdos {", ".join(sorted({q["sub"] for q in qs}))})')
    print(f'Entrada: {caminho_entrada(nome)}')
    print(f'Saída (você escreve): {caminho_saida(nome)}')


def palavras(s):
    return len(str(s).split())


def texto_todo(x):
    if isinstance(x, str):
        return x
    if isinstance(x, dict):
        return ' '.join(texto_todo(v) for v in x.values())
    if isinstance(x, list):
        return ' '.join(texto_todo(v) for v in x)
    return ''


def confere(saida):
    """Devolve (erros, avisos, lote, entrada). Erro impede gravar; aviso é para olhar."""
    d = ler(saida)
    if d is None:
        sys.exit(f'arquivo não encontrado: {saida}')
    lote = d.get('lote')
    reg = registro(str(lote).split('-')[0])
    if lote not in reg['lotes']:
        sys.exit(f'lote desconhecido no registro: {lote}')
    ent = {q['id']: q for q in ler(caminho_entrada(lote), {}).get('questoes', [])}
    if not ent:
        sys.exit(f'falta a entrada do lote; rode: lote.py proximo {reg["lotes"][lote]["materia"]}')
    erros, avisos = [], []
    vistos = set()
    for q in d.get('questoes', []):
        qid = q.get('id')
        e = ent.get(qid)
        if not e:
            erros.append(f'{qid}: não é deste lote')
            continue
        vistos.add(qid)
        st = q.get('status')
        if st in ('pendente', 'divergencia'):
            if not str(q.get('motivo', '')).strip():
                erros.append(f'{qid}: {st} sem motivo')
            continue
        if st != 'ok':
            erros.append(f'{qid}: status deve ser ok, pendente ou divergencia')
            continue
        r = q.get('resolucao') or {}
        falta = [c for c in CAMPOS if c not in r]
        if falta:
            erros.append(f'{qid}: faltam campos {falta}')
            continue
        gab = e['gabarito_oficial']
        if e.get('sem_gabarito_publicado'):
            ga = q.get('gabarito_aprendice') if isinstance(q.get('gabarito_aprendice'), dict) else {}
            le, lc, pre = ga.get('letra'), ga.get('letra_conferente'), e.get('gabarito_preliminar')
            if le not in e['letras'] or lc not in e['letras']:
                erros.append(f'{qid}: sem gabarito publicado: falta gabarito_aprendice {{"letra", "letra_conferente", "fontes_web"}} '
                             '(a letra do conferente vem da resolução dele às cegas)')
                continue
            if le != lc:
                erros.append(f'{qid}: sem gabarito publicado e as letras não batem ({le} × {lc}): status divergencia')
                continue
            if pre and le != pre:
                erros.append(f'{qid}: a letra {le} não bate com a do gabarito preliminar ({pre}): status divergencia')
                continue
            if not isinstance(ga.get('fontes_web', []), list):
                erros.append(f'{qid}: gabarito_aprendice.fontes_web é lista (o que foi consultado na web; [] se nada)')
            gab = le
        if not re.match(rf'^Alternativa {gab}\b', str(r['resposta'])):
            erros.append(f'{qid}: resposta tem de começar por "Alternativa {gab}" (gabarito oficial)')
        erradas = r['erradas'] if isinstance(r['erradas'], dict) else {}
        esperadas = set(e['letras']) - {gab}
        if set(erradas) != esperadas:
            erros.append(f'{qid}: erradas deve ter exatamente as letras {sorted(esperadas)} (tem {sorted(erradas)})')
        for L, t in erradas.items():
            if not str(t).strip():
                erros.append(f'{qid}: errada {L} vazia')
            elif palavras(t) > 45:
                avisos.append(f'{qid}: errada {L} com {palavras(t)} palavras (alvo até ~30)')
        a = r['antes'] if isinstance(r['antes'], dict) else {}
        if not str(a.get('texto', '')).strip():
            erros.append(f'{qid}: antes.texto vazio')
        if not isinstance(a.get('formulas', []), list) or not isinstance(a.get('simbolos', []), list):
            erros.append(f'{qid}: antes.formulas e antes.simbolos são listas')
        elif any(not (isinstance(p, list) and len(p) == 2) for p in a.get('simbolos', [])):
            erros.append(f'{qid}: antes.simbolos é lista de pares [termo, explicação]')
        ps = r['passos'] if isinstance(r['passos'], list) else []
        if not 2 <= len(ps) <= 8:
            erros.append(f'{qid}: {len(ps)} passos (de 2 a 8; normal 3 a 6)')
        for i, p in enumerate(ps, 1):
            if not str(p.get('faz', '')).strip() or not str(p.get('porque', '')).strip():
                erros.append(f'{qid}: passo {i} sem faz ou porque')
            if p.get('tipo') not in TIPOS:
                erros.append(f'{qid}: passo {i} com tipo inválido ({p.get("tipo")})')
            if 'conta' not in p:
                erros.append(f'{qid}: passo {i} sem o campo conta (vazio "" é aceito)')
        if ps and ps[-1].get('tipo') != 'concluir':
            avisos.append(f'{qid}: o último passo normalmente é concluir')
        ess = r['essencial'] if isinstance(r['essencial'], dict) else {}
        if any(not str(ess.get(k, '')).strip() for k in ('pede', 'chave', 'cuidado')):
            erros.append(f'{qid}: essencial precisa de pede, chave e cuidado')
        for c in ('pista', 'checagem', 'armadilha'):
            if not str(r[c]).strip():
                erros.append(f'{qid}: {c} vazio')
        eq = q.get('equivocos') if isinstance(q.get('equivocos'), dict) else {}
        if set(eq) != esperadas:
            erros.append(f'{qid}: equivocos deve ter exatamente as letras {sorted(esperadas)}')
        elif any(not re.match(r'^[A-Z]{1,2}\d{2}\.\d+:[a-z0-9-]+$', str(v)) for v in eq.values()):
            erros.append(f'{qid}: equivocos no formato <conteúdo>:<equívoco-em-minúsculas-com-hífen> (ex.: M01.1:dividiu-por-10)')
        # avisos dos erros que a conferência mais pega (não impedem gravar; olhe antes de mandar ao conferente)
        alts_e = e.get('alternativas') or {}
        def toks(x):
            return set(re.findall(r'[a-zà-ú0-9]{4,}', str(x).lower()))
        if alts_e.get(gab):
            ta, tr_ = toks(alts_e[gab]), toks(r['resposta'])
            if ta and len(ta & tr_) / len(ta) < 0.2:
                avisos.append(f'{qid}: a resposta não reproduz o texto da alternativa {gab}')
        if alts_e.get(gab) and toks(r['pista']) and len(toks(r['pista']) & toks(alts_e[gab])) / max(len(toks(alts_e[gab])), 1) > 0.6:
            avisos.append(f'{qid}: a pista parece entregar a alternativa {gab}')
        fonte_txt = norm_cit(' '.join((e.get('texto_da_prova') or '', ' '.join(alts_e.values()))))
        fonte_caixa = norm_cit(' '.join((e.get('texto_da_prova') or '', ' '.join(alts_e.values()))), caixa=True)
        if fonte_txt and not e.get('ler_o_print'):
            for cit in re.findall(r'“([^”]{15,})”', texto_todo(ps) + ' ' + texto_todo(erradas)):
                pedacos = [norm_cit(x) for x in re.split(r'\[[^\]]{0,12}\]|\(\s*\.\.\.\s*\)|…', cit)]
                if any(len(x) >= 15 and x not in fonte_txt for x in pedacos):
                    avisos.append(f'{qid}: citação entre aspas não bate com o texto da prova (confira letra por letra no print): “{cit[:60]}”')
                elif fonte_caixa and any(len(x) >= 15 and x not in fonte_caixa for x in [norm_cit(y, caixa=True) for y in re.split(r'\[[^\]]{0,12}\]|\(\s*\.\.\.\s*\)|…', cit)]):
                    avisos.append(f'{qid}: citação com maiúsculas/minúsculas diferentes da prova (copie como está, inclusive balão em CAIXA ALTA): “{cit[:60]}”')
        tc = toks(r['checagem'])
        for i, p in enumerate(ps, 1):
            tp = toks(str(p.get('conta', '')) + ' ' + str(p.get('porque', '')))
            if tc and tp and len(tc & tp) / len(tc | tp) > 0.6:
                avisos.append(f'{qid}: a checagem repete o passo {i}; confira por outro caminho')
                break
        if PROIBIDAS.search(texto_todo(erradas)):
            erros.append(f'{qid}: erradas com palavra proibida (provavelmente/talvez/chute/distrator)')
        tudo = texto_todo(r)
        if EMOJI.search(tudo):
            erros.append(f'{qid}: tem emoji')
        if re.search(r'\b(Brasil Escola|Mundo Educação|Prepara Enem|InfoEscola)\b', tudo, re.I):
            erros.append(f'{qid}: cita site didático')
    falta = set(ent) - vistos
    if falta:
        erros.append(f'questões do lote sem saída: {sorted(falta)}')
    if not d.get('conferido'):
        erros.append('"conferido": true só depois que o conferente aprovou o lote (e os itens corrigidos)')
    return erros, avisos, lote, ent, d


def cmd_valida(saida):
    erros, avisos, lote, _, d = confere(saida)
    for a in avisos:
        print('aviso:', a)
    for e in erros:
        print('ERRO:', e)
    ok = sum(1 for q in d.get('questoes', []) if q.get('status') == 'ok')
    print(f'{lote}: {ok} ok · {len(erros)} erro(s) · {len(avisos)} aviso(s)')
    return not erros


def cmd_grava(saida):
    erros, avisos, lote, ent, d = confere(saida)
    for a in avisos:
        print('aviso:', a)
    if erros:
        for e in erros:
            print('ERRO:', e)
        sys.exit(f'{lote}: nada gravado ({len(erros)} erro(s)).')
    m = lote.split('-')[0]
    reg = registro(m)
    l0 = reg['lotes'].get(lote, {})
    if l0.get('estado') == 'gravado':
        sys.exit(f'{lote} já foi gravado (em {l0.get("gravado_em")}) por outra sessão ou antes: nada gravado por cima. '
                 'Abra um lote novo com lote.py proximo.')
    if l0.get('dono') and l0['dono'] != SESSAO and RETOMAR != lote:
        sys.exit(f'{lote} pertence a outra sessão: nada gravado. Se ele é seu, rode: lote.py grava <saida> --retomar {lote}')
    b, _ = banco(m)
    por_id = {q['id']: q for q in b}
    hoje = datetime.date.today().isoformat()
    por_prova = {}
    for q in d['questoes']:
        if q['status'] != 'ok':
            alvo = 'pendentes' if q['status'] == 'pendente' else 'divergencias'
            e = ent[q['id']]
            reg[alvo][q['id']] = {'materia': m, 'prova': e['prova'], 'conteudo': e['conteudo'], 'motivo': q['motivo'],
                                  'lote': lote, 'data': hoje}
            continue
        bq = por_id[q['id']]
        reg_q = {
            'n': bq['n'],
            'conceito': q.get('conceito', ''),
            'equivocos': q.get('equivocos', {}),
            'resolucao': q['resolucao'],
            'caminhos': q.get('caminhos') or [],
            'quadro': q.get('quadro'),
            'visual': q.get('visual'),
            'fontes': q.get('fontes') or [],
            'aprovada': True,
            'revisao': {'lentes': ['resolvedor-autoconferencia', 'conferente-fatos-e-didatica'], 'data': hoje, 'lote': lote},
        }
        if ent[q['id']].get('sem_gabarito_publicado'):
            ga = q['gabarito_aprendice']
            reg_q['gabarito_aprendice'] = {'letra': ga['letra'], 'letra_conferente': ga['letra_conferente'],
                                           'preliminar': ent[q['id']].get('gabarito_preliminar', ''),
                                           'fontes_web': ga.get('fontes_web') or [], 'data': hoje, 'lote': lote}
        por_prova.setdefault(bq['prova'], {})[q['id']] = reg_q
    for pid, novos in por_prova.items():
        f = os.path.join(PROVAS, pid, f'resolucoes-{m}.json')  # um arquivo por matéria: sessões em paralelo sem conflito
        atual = ler(f, {})
        atual.update(novos)
        gravar(f, atual)
    reg['lotes'][lote].update(estado='gravado', gravado_em=hoje,
                              ok=sum(len(v) for v in por_prova.values()),
                              pendentes=sum(1 for q in d['questoes'] if q['status'] == 'pendente'),
                              divergencias=sum(1 for q in d['questoes'] if q['status'] == 'divergencia'))
    gravar(caminho_registro(m), reg)
    cmd_relatorio(m, silencioso=True)
    l = reg['lotes'][lote]
    print(f"{lote} gravado: {l['ok']} resoluções em {len(por_prova)} prova(s) · {l['pendentes']} pendente(s) · {l['divergencias']} divergência(s)")
    print('Agora: cd app && python3 scripts/converte.py && npx tsc --noEmit -p . && npx vitest run')


def cmd_relatorio(m=None, silencioso=False):
    """docs/resolucoes/lotes-<m>.md: o que falta, os lotes, pendentes e divergências da matéria."""
    hoje = datetime.date.today().isoformat()
    fp = resolvidas_em_provas()
    for x in ([m] if m else MATERIAS):
        reg = registro(x)
        qs = faltam(x, reg, fp)
        linhas = [f'# {NOMES[x]}: resoluções (gerado por lote.py em {hoje})', '',
                  f'Faltam {len(qs)} questões sem resolução (fora as que estão em lote, pendentes ou com divergência): '
                  + '; '.join(f'{FAIXAS[i]} {sum(1 for q in qs if faixa(q) == i)}' for i in range(len(FAIXAS))) + '.', '',
                  '## Lotes', '', '| Lote | Faixa | Questões | Estado | OK | Pendentes | Divergências |', '|---|---|---|---|---|---|---|']
        for nome, l in sorted(reg['lotes'].items()):
            linhas.append(f"| {nome} | {l.get('faixa', '')} | {len(l['ids'])} | {l['estado']} | {l.get('ok', '')} | {l.get('pendentes', '')} | {l.get('divergencias', '')} |")
        for alvo, titulo in (('pendentes', 'Pendentes (falta de certeza absoluta)'), ('divergencias', 'Divergências de gabarito (o dono decide)')):
            linhas += ['', f'## {titulo}', '']
            if not reg[alvo]:
                linhas.append('Nenhuma.')
                continue
            linhas += ['| Questão | Prova | Conteúdo | Motivo |', '|---|---|---|---|']
            for qid, y in sorted(reg[alvo].items(), key=lambda kv: kv[1]['prova']):
                linhas.append(f"| {qid} | {y['prova']} | {y['conteudo']} | {y['motivo'].replace('|', '/')} |")
        if reg['lotes'] or reg['pendentes'] or reg['divergencias']:
            gravar_md(os.path.join(DOCS, f'lotes-{x}.md'), linhas)
    if not silencioso:
        print('docs/resolucoes/lotes-<matéria>.md refeitos.')


def gravar_md(f, linhas):
    with open(f, 'w', encoding='utf-8') as h:
        h.write('\n'.join(linhas) + '\n')


if __name__ == '__main__':
    a = sys.argv[1:]
    if not a:
        print(__doc__)
    elif a[0] == 'status':
        cmd_status()
    elif a[0] == 'proximo':
        cmd_proximo(a[1] if len(a) > 1 else None, int(a[2]) if len(a) > 2 else 30)
    elif a[0] == 'valida' and len(a) == 2:
        sys.exit(0 if cmd_valida(a[1]) else 1)
    elif a[0] == 'grava' and len(a) == 2:
        cmd_grava(a[1])
    elif a[0] == 'relatorio':
        cmd_relatorio()
    else:
        print(__doc__)
        sys.exit(1)

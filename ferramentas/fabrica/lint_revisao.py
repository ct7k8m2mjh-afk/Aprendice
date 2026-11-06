"""Confere o campo `essencial` dos temas de revisão contra docs/revisao/FORMATO-ESSENCIAL.md (comando 33).

Uso:
  python3 ferramentas/fabrica/lint_revisao.py docs/revisao/geo/G03.json [outro.json ...]
  python3 ferramentas/fabrica/lint_revisao.py docs/revisao            (todos os temas que já têm `essencial`)
Sai com código 1 se algum tema tiver problema. Também é usado como módulo: problemas(tema) -> lista de textos.
"""
import json
import os
import re
import sys

PESO = {'alta': 0, 'media': 1, 'baixa': 2}
VISUAIS = {'animacao', 'esquema', 'grafico', 'foto'}
EMOJI = re.compile('[\U0001F300-\U0001FAFF☀-➿️]')


def palavras(t):
    return len(re.findall(r'\S+', t or ''))


def problemas(tema):
    p = []
    e = tema.get('essencial')
    if not isinstance(e, dict):
        return ['sem o campo essencial']
    subs = set((tema.get('slides') or {}).keys()) | {c.get('sub') for c in tema.get('cartoes') or [] if c.get('sub')}

    termo = e.get('termometro') or []
    if not termo:
        p.append('termômetro vazio')
    peso = {}
    for i, t in enumerate(termo):
        if t.get('sub') not in subs:
            p.append(f'termometro[{i}]: conteúdo {t.get("sub")} não existe no tema')
        if t.get('peso') not in PESO:
            p.append(f'termometro[{i}]: peso "{t.get("peso")}" (use alta, media ou baixa)')
        peso[t.get('sub')] = PESO.get(t.get('peso'), 1)
        if palavras(t.get('como_cai')) > 30:
            p.append(f'termometro[{i}].como_cai: {palavras(t.get("como_cai"))} palavras (1 frase curta)')

    mapa = e.get('mapa') or {}
    if not mapa.get('centro') or not mapa.get('ramos'):
        p.append('mapa sem centro ou sem ramos')
    for i, r in enumerate(mapa.get('ramos') or []):
        if r.get('sub') not in subs:
            p.append(f'mapa.ramos[{i}]: conteúdo {r.get("sub")} não existe no tema')
        if palavras(r.get('chave')) > 12:
            p.append(f'mapa.ramos[{i}].chave: {palavras(r.get("chave"))} palavras (até 12)')
        for s in r.get('liga') or []:
            if s not in subs:
                p.append(f'mapa.ramos[{i}].liga: {s} não existe no tema')

    telas = e.get('telas') or []
    for i, t in enumerate(telas):
        onde = f'telas[{i}] ({t.get("sub")})'
        if t.get('sub') not in subs:
            p.append(f'{onde}: conteúdo não existe no tema')
        pts = t.get('pontos') or []
        if not 1 <= len(pts) <= 4:
            p.append(f'{onde}: {len(pts)} tópicos (1 a 4)')
        if peso.get(t.get('sub')) == 2 and len(pts) > 2:
            p.append(f'{onde}: peso baixo com {len(pts)} tópicos (até 2)')
        for k, x in enumerate(pts):
            if palavras(x) > 18:
                p.append(f'{onde}.pontos[{k}]: {palavras(x)} palavras (até 18)')
        total = sum(palavras(x) for x in pts) + palavras(t.get('pegadinha'))
        if total > 40:
            p.append(f'{onde}: {total} palavras de texto na tela (até 40)')
        if not (t.get('pegadinha') or '').strip():
            p.append(f'{onde}: sem pegadinha')
        if '\\frac' in ' '.join(pts + [t.get('pegadinha') or '']):
            p.append(f'{onde}: LaTeX no texto (fórmula vai em "formula"; no texto, "a/b" que o site empilha)')
        v = t.get('visual')
        if v and v.get('tipo') not in VISUAIS:
            p.append(f'{onde}.visual.tipo "{v.get("tipo")}"')
    ordem = [peso.get(t.get('sub'), 1) for t in telas]
    if ordem != sorted(ordem):
        p.append('telas fora da ordem do termômetro (alta → média → baixa)')
    # conteúdo sem tela só se o termômetro o der como peso baixo (a Lente B "corta o que não cai")
    faltam = sorted(s for s in subs - {t.get('sub') for t in telas} if peso.get(s) != 2)
    if faltam:
        p.append('conteúdos sem tela (e sem peso baixo no termômetro): ' + ', '.join(faltam))

    q = e.get('questao_resolvida') or {}
    alts = q.get('alternativas') or []
    if len(alts) != 5 or [a.strip()[:1] for a in alts] != list('ABCDE'):
        p.append('questao_resolvida: precisa de 5 alternativas, A) a E)')
    if q.get('gabarito') not in list('ABCDE'):
        p.append('questao_resolvida: gabarito fora de A–E')
    if not 1 <= len(q.get('passos') or []) <= 5:
        p.append(f'questao_resolvida: {len(q.get("passos") or [])} passos (1 a 5)')
    if not (q.get('por_que_erram') or '').strip():
        p.append('questao_resolvida: sem por_que_erram')

    n = 2 + len(telas) + (1 if q else 0) + (1 if e.get('conexao') else 0)
    if not 8 <= n <= 12:
        p.append(f'{n} telas no tema (8 a 12: termômetro + mapa + conteúdos + questão + conexão)')

    if EMOJI.search(json.dumps(e, ensure_ascii=False)):
        p.append('emoji no essencial')
    return p


def arquivos(alvos):
    for a in alvos:
        if os.path.isdir(a):
            for raiz, _, fs in os.walk(a):
                for f in sorted(fs):
                    if re.fullmatch(r'[A-Z]\d\d\.json', f):
                        yield os.path.join(raiz, f), True
        else:
            yield a, False


if __name__ == '__main__':
    erro = 0
    for f, so_com in arquivos(sys.argv[1:] or ['docs/revisao']):
        tema = json.load(open(f, encoding='utf-8'))
        if so_com and 'essencial' not in tema:
            continue
        ps = problemas(tema)
        print(f'{f}: ' + ('ok' if not ps else f'{len(ps)} problema(s)'))
        for x in ps:
            print('  - ' + x)
        erro |= bool(ps)
    sys.exit(erro)

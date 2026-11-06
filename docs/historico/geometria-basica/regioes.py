# acha a regiao de cada questao 136-180 nas provas do ENEM (2 colunas) e extrai o texto
import re, subprocess, json, sys, html, pathlib
PDF = pathlib.Path('/tmp/claude-0/-home-claude/e5566652-8789-513e-9e19-aca7ab2e3491/scratchpad/enem/pdf')
OUT = pathlib.Path('/tmp/claude-0/-home-claude/e5566652-8789-513e-9e19-aca7ab2e3491/scratchpad/geo')
res = {}
for y in range(2009, 2026):
    f = PDF / f'{y}_PV.pdf'
    xml = subprocess.run(['pdftotext', '-bbox', str(f), '-'], capture_output=True, text=True).stdout
    pages = re.split(r'<page ', xml)[1:]
    qs = []
    for pi, pg in enumerate(pages, 1):
        W = float(re.search(r'width="([\d.]+)"', pg).group(1)); H = float(re.search(r'height="([\d.]+)"', pg).group(1))
        words = [(float(a), float(b), float(c), float(d), html.unescape(t)) for a, b, c, d, t in re.findall(r'<word xMin="([\d.]+)" yMin="([\d.]+)" xMax="([\d.]+)" yMax="([\d.]+)">([^<]*)</word>', pg)]
        for i, (x0, y0, x1, y1, t) in enumerate(words):
            if t.upper() == 'QUESTÃO' and i + 1 < len(words) and words[i+1][4].isdigit():
                n = int(words[i+1][4])
                if 136 <= n <= 180:
                    qs.append(dict(n=n, page=pi, x=x0, y=y0, W=W, H=H))
    # regiao: coluna (esq/dir pela posicao x), do topo da questao ate a proxima questao na mesma coluna/pagina
    for q in qs:
        col = 0 if q['x'] < q['W'] / 2 else 1
        q['col'] = col
    for q in qs:
        mesmas = [o for o in qs if o['page'] == q['page'] and o['col'] == q['col'] and o['y'] > q['y']]
        q['y_fim'] = min([o['y'] for o in mesmas], default=None)
        res[f'{y}-{q["n"]}'] = q
    print(y, len(qs), sorted(set(q['n'] for q in qs)) == list(range(136, 181)))
json.dump(res, open(OUT / 'regioes.json', 'w'))

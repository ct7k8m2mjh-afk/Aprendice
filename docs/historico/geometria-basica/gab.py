import re, json, pathlib
P = pathlib.Path('/tmp/claude-0/-home-claude/e5566652-8789-513e-9e19-aca7ab2e3491/scratchpad/enem/pdf')
G = {}
for y in range(2009, 2026):
    f = P/f'{y}_GB.txt'
    if not f.exists(): continue
    t = f.read_text()
    pares = re.findall(r'\b(1[3-8]\d)\s+([A-E]|[Aa]nulad[ao])\b', t)
    d = {}
    if y == 2009:
        from collections import defaultdict
        oc = defaultdict(list)
        for n, l in pares: oc[int(n)].append(l)
        d = {n: v[2] for n, v in oc.items() if 136 <= n <= 180 and len(v) >= 3}
    else:
        for n, l in pares:
            n = int(n)
            if 136 <= n <= 180 and n not in d: d[n] = l
    G[y] = d
    print(y, len(d))
json.dump(G, open('/tmp/claude-0/-home-claude/e5566652-8789-513e-9e19-aca7ab2e3491/scratchpad/geo/gabaritos.json', 'w'))

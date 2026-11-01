from playwright.sync_api import sync_playwright
import json
novos = [x['id'] for x in json.load(open('/home/claude/sc/v4/aceitas_provas4.json'))] + \
        [x['id'] for x in json.load(open('/home/claude/sc/v4/aceitas_provas5.json'))]
with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={'width': 430, 'height': 930}, device_scale_factor=2)
    err = []
    pg.on('pageerror', lambda e: err.append(str(e)))
    pg.on('console', lambda m: err.append('console:' + m.text[:120]) if m.type == 'error' else None)
    pg.goto('http://localhost:8777/test.html'); pg.wait_for_timeout(1500)
    pub = pg.evaluate("ids => ids.filter(i => BANCO.some(q => q.id === i))", novos)
    print('novas publicadas:', len(pub), 'de', len(novos))
    ruim = []
    for qid in pub:
        pg.evaluate("id => abrirQuestao(id, {lista:[id], i:0})", qid)
        pg.wait_for_timeout(1200)
        e = pg.evaluate("""() => {
            const i = document.getElementById('q-print');
            return { v: i ? !i.hidden : false, b: i && i.src ? i.src.length : 0,
                     t: !!document.getElementById('b-texto') };
        }""")
        if not e['v'] or e['b'] < 5000 or not e['t']: ruim.append((qid, e))
    print('com problema:', ruim if ruim else 'nenhuma')
    print('erros de pagina:', err[:4] if err else 'nenhum')
    b.close()

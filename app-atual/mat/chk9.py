from playwright.sync_api import sync_playwright
import json
IDS = ['31dc261a','E2126cba','deb002c4','P2ea2843','faccb8b7','W93c2e78','Wda07286','W657c4d6','We386d9f','E6b22f4b','Wc8ee4fc','W1f4a211','W8e20657','We8e579e','W0402f77','Wf09365c','W5b09683','Pe4abaf7','89d39359']
with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={'width': 430, 'height': 930}, device_scale_factor=2)
    err = []
    pg.on('pageerror', lambda e: err.append(str(e)))
    pg.on('console', lambda m: err.append('console:' + m.text[:120]) if m.type == 'error' else None)
    pg.goto('http://localhost:8777/test.html'); pg.wait_for_timeout(1500)
    fora = pg.evaluate("ids => ids.filter(i => !BANCO.some(q => q.id === i))", IDS)
    print('ids ausentes do banco:', fora)
    for qid in [i for i in IDS if i not in fora]:
        pg.evaluate("id => abrirQuestao(id, {lista:[id], i:0})", qid)
        pg.wait_for_timeout(1500)
        e = pg.evaluate("""() => {
            const i = document.getElementById('q-print');
            return { print: i ? (i.hidden ? 'escondido' : 'visivel') : 'ausente',
                     bytes: i && i.src ? i.src.length : 0,
                     nota: !!document.querySelector('.nota-fonte'),
                     texto: !!document.getElementById('b-texto') };
        }""")
        print(qid, e)
    print('erros:', err[:4] if err else 'nenhum')
    b.close()

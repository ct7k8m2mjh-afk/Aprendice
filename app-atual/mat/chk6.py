from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={'width': 430, 'height': 930}, device_scale_factor=2)
    err = []
    pg.on('pageerror', lambda e: err.append(str(e)))
    pg.on('console', lambda m: err.append('console:' + m.text) if m.type == 'error' else None)
    pg.goto('http://localhost:8777/test.html')
    pg.wait_for_timeout(1500)
    ids = pg.evaluate("BANCO.filter(q=>q.tipo==='site').slice(0,1).map(q=>q.id)"
                      ".concat(BANCO.filter(q=>q.tipo==='prova').slice(0,1).map(q=>q.id))")
    print('ids de teste:', ids)
    for k, qid in enumerate(ids):
        pg.evaluate("id => abrirQuestao(id, {lista:[id], i:0})", qid)
        pg.wait_for_timeout(2500)
        pg.screenshot(path=f'v4-q{k}.png', full_page=True)
        est = pg.evaluate("""() => {
            const i = document.getElementById('q-print');
            const e = document.getElementById('q-print-espera');
            return { temImg: !!i, visivel: i ? !i.hidden : false,
                     srcLen: i && i.src ? i.src.length : 0,
                     espera: e ? e.textContent : null };
        }""")
        print(qid, est)
    print('erros:', err[:5])
    b.close()

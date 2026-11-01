from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={'width': 430, 'height': 930}, device_scale_factor=2)
    err = []
    pg.on('pageerror', lambda e: err.append(str(e)))
    pg.on('console', lambda m: err.append('console:' + m.text[:120]) if m.type == 'error' else None)
    pg.goto('http://localhost:8777/test.html'); pg.wait_for_timeout(1500)
    print('intro:', pg.evaluate("document.getElementById('i-sub').textContent")[:200])
    for qid in ('Wee70aa0', 'We1d1bb0'):
        pg.evaluate("id => abrirQuestao(id, {lista:[id], i:0})", qid)
        pg.wait_for_timeout(1800)
        est = pg.evaluate("""() => ({
            nota: (document.querySelector('.nota-fonte') || {}).textContent || null,
            print: (() => { const i = document.getElementById('q-print'); return i ? (i.hidden ? 'escondido' : 'visivel') : 'ausente'; })()
        })""")
        print(qid, est['print'], '| nota:', (est['nota'] or '')[:110])
    # caixa de texto da questao
    pg.evaluate("() => { const b = document.getElementById('b-texto'); if (b) b.click(); }")
    pg.wait_for_timeout(400)
    print('texto-box:', (pg.evaluate("() => { const t = document.getElementById('texto-box'); return t ? t.innerText.slice(0,160) : null; }") or '').replace('\n',' | '))
    pg.screenshot(path='v5-nota.png', full_page=True)
    print('erros:', err[:4] if err else 'nenhum')
    b.close()

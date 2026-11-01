from playwright.sync_api import sync_playwright

TELAS = ['inicio', 'modulos', 'escadas', 'treino', 'revisao', 'erros', 'teoria', 'historico']

with sync_playwright() as p:
    b = p.chromium.launch()
    for nome, vp in [('cel', {'width': 430, 'height': 930}), ('ipad', {'width': 1180, 'height': 820})]:
        pg = b.new_page(viewport=vp, device_scale_factor=2)
        err = []
        pg.on('pageerror', lambda e: err.append('ERRO: ' + str(e)))
        pg.on('console', lambda m: err.append('console: ' + m.text[:160]) if m.type == 'error' else None)
        pg.goto('http://localhost:8777/test.html')
        pg.wait_for_timeout(1500)
        vistas = pg.evaluate("Array.from(document.querySelectorAll('[data-tela],.tela,section[id^=\"t-\"]')).map(e=>e.id||e.dataset.tela).slice(0,30)")
        print(nome, 'telas no DOM:', vistas)
        for t in TELAS:
            try:
                pg.evaluate("t => (typeof vai === 'function') && vai(t)", t)
                pg.wait_for_timeout(500)
            except Exception as e:
                err.append(f'vai({t}): {e}')
        # abre uma questao de cada origem e confirma a resolucao
        for tipo in ('site', 'prova', 'texto'):
            qid = pg.evaluate("tp => { const q = BANCO.find(x => x.tipo === tp); return q ? q.id : null; }", tipo)
            if not qid:
                print(nome, tipo, '-> nenhuma questao'); continue
            pg.evaluate("id => abrirQuestao(id, {lista:[id], i:0})", qid)
            pg.wait_for_timeout(2200)
            pg.evaluate("() => { const b = document.querySelectorAll('.bolha'); if (b[0]) b[0].click(); }")
            pg.evaluate("() => { const b = document.getElementById('b-conf'); if (b) b.click(); }")
            pg.wait_for_timeout(2500)
            est = pg.evaluate("""() => {
                const img = document.getElementById('q-print');
                return { print: img ? (img.hidden ? 'escondido' : 'visivel') : 'ausente',
                         resolucao: !!document.querySelector('.resolucao'),
                         passos: document.querySelectorAll('.resolucao .passo, .resolucao li').length,
                         texto: (document.getElementById('q-corpo') || {}).innerText ?
                                (document.getElementById('q-corpo').innerText.length) : 0 };
            }""")
            print(nome, tipo, qid, est)
        pg.screenshot(path=f'v4-{nome}-final.png', full_page=True)
        print(nome, 'erros:', err[:6] if err else 'nenhum')
        pg.close()
    b.close()

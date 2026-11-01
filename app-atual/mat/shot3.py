from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(); errs=[]
    pg=b.new_page(viewport={'width':420,'height':900},device_scale_factor=2)
    pg.on('pageerror',lambda e: errs.append('ERR '+str(e)))
    pg.on('console',lambda m: errs.append('CON '+m.text) if m.type=='error' else None)
    pg.goto('file:///home/claude/scapp/test.html'); pg.wait_for_timeout(2000)
    pg.screenshot(path='s-inicio.png',full_page=True)
    print('texto do sync:',pg.inner_text('#sync'))
    pg.click('nav.bot button[data-v="progresso"]'); pg.wait_for_timeout(500)
    pg.screenshot(path='s-progresso.png',full_page=True)
    print('botao export:',pg.inner_text('#b-export'))
    pg.click('#b-export'); pg.wait_for_timeout(800)
    print('apos clique:',pg.inner_text('#b-export'))
    print('erros:',errs if errs else 'nenhum')
    b.close()

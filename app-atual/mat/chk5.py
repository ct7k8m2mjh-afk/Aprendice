from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':1024,'height':768})
    pg.on('pageerror', lambda e: print('ERRO:',e))
    pg.on('console', lambda m: print('CONSOLE:',m.type,m.text))
    pg.goto('http://localhost:8765/moldura.html'); pg.wait_for_timeout(2200)
    f=pg.frames[1]
    print('pode:', f.evaluate("!!(document.documentElement.requestFullscreen||document.documentElement.webkitRequestFullscreen)"))
    f.click('#bfull'); pg.wait_for_timeout(800)
    print('fullscreenElement:', f.evaluate("!!document.fullscreenElement"))
    print('classe:', f.evaluate("document.documentElement.className"))
    print('rotulo botao:', f.inner_text('#bfull'))
    b.close()

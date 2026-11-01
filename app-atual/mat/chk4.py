from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':1024,'height':768})
    err=[]; pg.on('pageerror', lambda e: err.append(str(e)))
    pg.goto('http://localhost:8765/moldura.html'); pg.wait_for_timeout(2500)
    f=pg.frames[1]
    print('aviso:', f.inner_text('#aviso-tela')[:200])
    print('href do link:', f.get_attribute('#aviso-tela a','href'))
    print('erros:',err)
    # clica no botao de tela cheia dentro da moldura (fullscreen do iframe sem allow = recusado)
    f.click('#bfull'); pg.wait_for_timeout(400)
    print('entrou em foco:', f.evaluate("document.documentElement.classList.contains('foco')"))
    pg.screenshot(path='f9-moldura.png')
    b.close()

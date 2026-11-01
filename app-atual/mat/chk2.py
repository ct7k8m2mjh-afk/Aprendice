from playwright.sync_api import sync_playwright
import pathlib
u='file://'+str(pathlib.Path('test.html').resolve())
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':1024,'height':768})
    err=[]; pg.on('pageerror', lambda e: err.append(str(e)))
    pg.goto(u); pg.wait_for_timeout(1800)
    pg.evaluate("document.documentElement.requestFullscreen=()=>Promise.reject(0);document.documentElement.webkitRequestFullscreen=undefined;")
    pg.click('#bfull'); pg.wait_for_timeout(200)
    pg.click("nav.bot button[data-v='estudar']"); pg.wait_for_timeout(400)
    pg.evaluate("document.querySelector('#modulos details summary').click()"); pg.wait_for_timeout(300)
    pg.evaluate("const a=document.querySelector('#modulos details .linha,#modulos details button'); a&&a.click()"); pg.wait_for_timeout(500)
    pg.evaluate("document.querySelector('.degrau').click()"); pg.wait_for_timeout(1500)
    pg.evaluate("document.querySelectorAll('.bolha')[0].click()"); pg.wait_for_timeout(200)
    print('selecionou:', pg.evaluate("!!document.querySelector('.bolha.sel')"))
    pg.evaluate("document.getElementById('b-conf').click()"); pg.wait_for_timeout(900)
    print('corrigiu:', pg.evaluate("!!document.querySelector('.bolha.certo,.bolha.errado')"), '| veredito:', pg.evaluate("!!document.querySelector('.veredito')"))
    ch=pg.evaluate("Object.keys(localStorage)")
    print('chaves localStorage:', ch)
    for k in ch:
        v=pg.evaluate("localStorage.getItem('"+k+"')")
        print(k, (v or '')[:140])
    pg.screenshot(path='f8-corrigida.png')
    print('erros:', err)
    b.close()


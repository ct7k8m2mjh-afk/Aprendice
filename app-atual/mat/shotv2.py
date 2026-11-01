from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch()
    for nome,vp in [('cel',{'width':390,'height':844}),('ipad',{'width':1024,'height':768})]:
        pg=b.new_page(viewport=vp, device_scale_factor=2)
        err=[]; pg.on('pageerror', lambda e: err.append(str(e)))
        pg.goto('http://localhost:8777/test.html'); pg.wait_for_timeout(1800)
        pg.screenshot(path=f'v2-{nome}-1inicio.png')
        # abre a questao mock direto
        pg.evaluate("abrirQuestao('d463edb8', {lista:['d463edb8'], i:0})"); pg.wait_for_timeout(1200)
        pg.screenshot(path=f'v2-{nome}-2questao.png', full_page=True)
        pg.evaluate("document.getElementById('b-pista').click()"); pg.wait_for_timeout(300)
        pg.evaluate("document.querySelectorAll('.bolha')[1].click()"); pg.wait_for_timeout(150)
        pg.evaluate("document.getElementById('b-conf').click()"); pg.wait_for_timeout(1500)
        pg.screenshot(path=f'v2-{nome}-3correcao.png', full_page=True)
        print(nome,'erros:',err)
        pg.close()
    b.close()

from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(); errs=[]
    pg=b.new_page(viewport={'width':420,'height':900},device_scale_factor=2)
    pg.on('pageerror',lambda e: errs.append('ERR '+str(e)))
    pg.on('console',lambda m: errs.append('CON '+m.text) if m.type=='error' else None)
    pg.goto('http://localhost:8811/test.html'); pg.wait_for_timeout(1300)
    pg.click('nav.bot button[data-v="estudar"]'); pg.wait_for_timeout(400)
    pg.click('#modulos details:nth-child(13) summary'); pg.wait_for_timeout(300)
    pg.click('#modulos details:nth-child(13) .sub'); pg.wait_for_timeout(500)
    pg.click('#e-degraus .degrau:nth-child(2)'); pg.wait_for_timeout(1600)
    pg.screenshot(path='p1-print.png',full_page=True)
    pg.click('#bolhas .bolha:nth-child(2)'); pg.wait_for_timeout(200)
    pg.click('#b-conf'); pg.wait_for_timeout(1300)
    pg.screenshot(path='p2-corrigida.png',full_page=True)
    print('imagens carregadas:',pg.eval_on_selector_all('.print img','ns=>ns.filter(n=>n.naturalWidth>0).length'))
    print('erros:',errs if errs else 'nenhum')
    print('largura:',pg.evaluate("[document.documentElement.scrollWidth,innerWidth]"))
    b.close()

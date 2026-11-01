from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(); errs=[]
    pg=b.new_page(viewport={'width':420,'height':900},device_scale_factor=2)
    pg.on('pageerror',lambda e: errs.append('ERR '+str(e)))
    pg.on('console',lambda m: errs.append('CON '+m.text) if m.type=='error' else None)
    pg.goto('file:///home/claude/scapp/test.html'); pg.wait_for_timeout(1800)
    pg.click('nav.bot button[data-v="estudar"]'); pg.wait_for_timeout(400)
    pg.click('#modulos details:nth-child(13) summary'); pg.wait_for_timeout(300)
    pg.click('#modulos details:nth-child(13) .sub'); pg.wait_for_timeout(500)
    pg.click('#e-degraus .degrau:nth-child(4)'); pg.wait_for_timeout(700)
    pg.screenshot(path='n1-questao.png',full_page=True)
    pg.click('#alts .alt:nth-child(2)'); pg.wait_for_timeout(150); pg.click('#b-conf'); pg.wait_for_timeout(900)
    pg.screenshot(path='n2-correcao.png',full_page=True)
    print('largura:',pg.evaluate("[document.documentElement.scrollWidth,innerWidth]"))
    print('erros:',errs if errs else 'nenhum')
    b.close()

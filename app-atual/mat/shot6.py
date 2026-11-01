from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(); errs=[]
    pg=b.new_page(viewport={'width':420,'height':900},device_scale_factor=2)
    pg.on('pageerror',lambda e: errs.append('ERR '+str(e)))
    pg.on('console',lambda m: errs.append('CON '+m.text) if m.type=='error' else None)
    pg.goto('http://localhost:8811/test.html'); pg.wait_for_timeout(1200)
    pg.click('nav.bot button[data-v="estudar"]'); pg.wait_for_timeout(400)
    pg.click('#modulos details:nth-child(10) summary'); pg.wait_for_timeout(300)
    pg.click('#modulos details:nth-child(10) .sub'); pg.wait_for_timeout(500)
    alvo=None
    for i in range(2,12):
        try: txt=pg.inner_text(f'#e-degraus .degrau:nth-child({i})')
        except Exception: break
        if 'Einstein' in txt: alvo=i; break
    if alvo: pg.click(f'#e-degraus .degrau:nth-child({alvo})')
    pg.wait_for_timeout(2500)
    print('degrau clicado:',alvo,'| imagens no enunciado:',pg.eval_on_selector_all('#q-corpo .enun img','n=>n.length'))
    pg.screenshot(path='i2-imagem.png',full_page=True)
    print('erros:',errs if errs else 'nenhum')
    b.close()

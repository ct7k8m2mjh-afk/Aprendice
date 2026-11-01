from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(); errs=[]
    pg=b.new_page(viewport={'width':420,'height':900},device_scale_factor=2)
    pg.on('pageerror',lambda e: errs.append('ERR '+str(e)))
    pg.on('console',lambda m: errs.append('CON '+m.text) if m.type=='error' else None)
    pg.goto('file:///home/claude/scapp/test.html'); pg.wait_for_timeout(1500)
    print('titulo inicial:',pg.inner_text('#i-tit'),'| questoes:',pg.inner_text('#k-q'))
    pg.click('nav.bot button[data-v="estudar"]'); pg.wait_for_timeout(400)
    pg.click('#modulos details:nth-child(10) summary'); pg.wait_for_timeout(300)
    pg.click('#modulos details:nth-child(10) .sub'); pg.wait_for_timeout(500)
    # procura um degrau cuja questão seja do Einstein (imagem)
    for i in range(1,11):
        try:
            txt=pg.inner_text(f'#e-degraus .degrau:nth-child({i+1})')
        except Exception: break
        if 'Einstein' in txt:
            pg.click(f'#e-degraus .degrau:nth-child({i+1})'); break
    pg.wait_for_timeout(1500)
    pg.screenshot(path='i1-imagem.png')
    print('tem img no enunciado:',pg.eval_on_selector_all('#q-corpo .enun img','n=>n.length'))
    print('erros:',errs if errs else 'nenhum')
    b.close()

from playwright.sync_api import sync_playwright
import pathlib
u='file://'+str(pathlib.Path('test.html').resolve())
with sync_playwright() as p:
    b=p.chromium.launch(args=['--font-render-hinting=none'])
    for nome,vp in [('ipad',{'width':1024,'height':768}),('cel',{'width':390,'height':844})]:
        pg=b.new_page(viewport=vp, device_scale_factor=2)
        erros=[]
        pg.on('pageerror', lambda e: erros.append(str(e)))
        pg.on('console', lambda m: erros.append('console:'+m.text) if m.type=='error' else None)
        pg.goto(u); pg.wait_for_timeout(2500)
        print(nome,'titulo:',pg.inner_text('#i-tit')[:60])
        print(nome,'aviso:',pg.inner_text('#aviso-tela')[:120])
        pg.screenshot(path=f'f1-{nome}.png')
        # forca a recusa do fullscreen para testar o plano B
        pg.evaluate("document.documentElement.requestFullscreen=()=>Promise.reject(new Error('negado'));document.documentElement.webkitRequestFullscreen=undefined;")
        pg.click('#bfull'); pg.wait_for_timeout(600)
        print(nome,'classe html:',pg.evaluate("document.documentElement.className"),'| header visivel:',pg.is_visible('header.top'),'| sair visivel:',pg.is_visible('#sair-foco'))
        pg.screenshot(path=f'f2-{nome}-foco.png')
        # abre uma questao em modo foco
        pg.click('nav.bot button[data-v="estudar"]'); pg.wait_for_timeout(500)
        pg.evaluate("document.querySelector('#modulos button, #modulos .linha, #modulos [role=button]')?.click()")
        pg.wait_for_timeout(700)
        pg.screenshot(path=f'f3-{nome}-modulo.png')
        print(nome,'erros:',erros[:4])
        pg.close()
    b.close()

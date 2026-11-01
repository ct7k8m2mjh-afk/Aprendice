from playwright.sync_api import sync_playwright
import pathlib
u='file://'+str(pathlib.Path('test.html').resolve())
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':1024,'height':768},device_scale_factor=2)
    pg.on('pageerror', lambda e: print('ERRO:',e))
    pg.goto(u); pg.wait_for_timeout(2000)
    pg.evaluate("document.documentElement.requestFullscreen=()=>Promise.reject(0);document.documentElement.webkitRequestFullscreen=undefined;")
    pg.click('#bfull'); pg.wait_for_timeout(300)
    pg.click('nav.bot button[data-v=\'estudar\']'); pg.wait_for_timeout(500)
    pg.evaluate("document.querySelector('#modulos details summary').click()"); pg.wait_for_timeout(400)
    pg.evaluate("const a=document.querySelector('#modulos details .linha, #modulos details button'); a&&a.click()"); pg.wait_for_timeout(700)
    pg.screenshot(path='f5-escada.png')
    pg.evaluate("const d=document.querySelector('.degrau'); d&&d.click()"); pg.wait_for_timeout(2000)
    print('questao visivel:', pg.is_visible('#v-questao'))
    pg.screenshot(path='f6-questao.png')
    pg.evaluate("const b=document.querySelectorAll('.bolha')[0]; b&&b.click()"); pg.wait_for_timeout(1200)
    pg.screenshot(path='f7-corrigida.png')
    b.close()


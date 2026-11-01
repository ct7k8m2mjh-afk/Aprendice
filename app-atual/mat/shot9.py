from playwright.sync_api import sync_playwright
import pathlib
u='file://'+str(pathlib.Path('test.html').resolve())
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':1024,'height':768},device_scale_factor=2)
    pg.on('pageerror', lambda e: print('ERRO:',e))
    pg.goto(u); pg.wait_for_timeout(2000)
    pg.evaluate("document.documentElement.requestFullscreen=()=>Promise.reject(0);document.documentElement.webkitRequestFullscreen=undefined;")
    pg.click('#bfull'); pg.wait_for_timeout(300)
    pg.click('nav.bot button[data-v="estudar"]'); pg.wait_for_timeout(500)
    pg.screenshot(path='f4-modulos.png')
    pg.evaluate("""(()=>{const m=document.querySelector('#modulos .linha,#modulos button,#modulos .mod');m&&m.click();})()""")
    pg.wait_for_timeout(600); pg.screenshot(path='f5-escada.png')
    pg.evaluate("""(()=>{const d=document.querySelector('.degrau');d&&d.click();})()""")
    pg.wait_for_timeout(1500); pg.screenshot(path='f6-questao.png', full_page=False)
    print('view questao visivel:', pg.is_visible('#v-questao'))
    b.close()

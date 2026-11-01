from playwright.sync_api import sync_playwright
import pathlib
u='file://'+str(pathlib.Path('test.html').resolve())
with sync_playwright() as p:
    b=p.chromium.launch()
    for vp in [{'width':1024,'height':768},{'width':820,'height':1180},{'width':390,'height':844}]:
        pg=b.new_page(viewport=vp)
        err=[]; pg.on('pageerror', lambda e: err.append(str(e)))
        pg.goto(u); pg.wait_for_timeout(1800)
        pg.evaluate("document.documentElement.requestFullscreen=()=>Promise.reject(0);document.documentElement.webkitRequestFullscreen=undefined;")
        pg.click('#bfull'); pg.wait_for_timeout(200)
        foco=pg.evaluate("document.documentElement.classList.contains('foco')")
        pg.click('nav.bot button[data-v=\'estudar\']'); pg.wait_for_timeout(400)
        pg.evaluate("document.querySelector('#modulos details summary').click()"); pg.wait_for_timeout(300)
        pg.evaluate("const a=document.querySelector('#modulos details .linha,#modulos details button'); a&&a.click()"); pg.wait_for_timeout(500)
        pg.evaluate("document.querySelector('.degrau').click()"); pg.wait_for_timeout(1500)
        img=pg.evaluate("(()=>{const i=document.querySelector('#q-corpo .print img');return i?[i.naturalWidth,Math.round(i.getBoundingClientRect().width)]:null})()")
        pg.evaluate("document.querySelectorAll('.bolha')[0].click()"); pg.wait_for_timeout(900)
        marcou=pg.evaluate("!!document.querySelector('.bolha.certo,.bolha.errado')")
        ver=pg.evaluate("!!document.querySelector('.veredito')")
        salvo=pg.evaluate("Object.keys(JSON.parse(localStorage.getItem(Object.keys(localStorage).find(k=>k.includes('sc'))||'')||'{}').q||{}).length")
        # fecha a aba -> grava
        pg.click('#sair-foco'); pg.wait_for_timeout(200)
        saiu=not pg.evaluate("document.documentElement.classList.contains('foco')")
        print(vp['width'], 'foco:',foco,'| img nat/css:',img,'| marcou:',marcou,'| veredito:',ver,'| questoes salvas:',salvo,'| saiu:',saiu,'| erros:',err)
        pg.close()
    b.close()

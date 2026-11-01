from playwright.sync_api import sync_playwright
import pathlib,re
base=pathlib.Path('.').resolve()
with sync_playwright() as p:
    b=p.chromium.launch()
    # 1) tela.html direto (como no Safari)
    pg=b.new_page(viewport={'width':1024,'height':768})
    err=[]; pg.on('pageerror', lambda e: err.append(str(e)))
    pg.goto('file://'+str(base/'tela.html')); pg.wait_for_timeout(1800)
    print('tela.html | titulo:',pg.inner_text('#i-tit')[:40],'| aviso:',pg.inner_text('#aviso-tela')[:90],'| erros:',err)
    pg.close()
    # 2) index dentro de um iframe (como no app do Claude)
    pg=b.new_page(viewport={'width':1024,'height':768})
    err2=[]; pg.on('pageerror', lambda e: err2.append(str(e)))
    pg.set_content('<style>html,body{margin:0;height:100%}iframe{width:100%;height:100%;border:0}</style><iframe src="file://'+str(base/'test.html')+'"></iframe>')
    pg.wait_for_timeout(2200)
    f=pg.frames[1]
    print('iframe | aviso:', f.inner_text('#aviso-tela')[:150])
    print('iframe | link:', f.get_attribute('#aviso-tela a','href'))
    print('erros:',err2)
    b.close()

from playwright.sync_api import sync_playwright
import pathlib
u='file://'+str(pathlib.Path('test.html').resolve())
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page()
    pg.on('pageerror', lambda e: print('ERRO:', e.stack or e.message))
    pg.goto(u); pg.wait_for_timeout(2000)
    b.close()

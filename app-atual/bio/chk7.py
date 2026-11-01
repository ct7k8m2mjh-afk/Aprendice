# -*- coding: utf-8 -*-
"""Confere o aplicativo na tela: abre as telas, abre uma questao de cada origem, confirma a
resposta e olha se o print apareceu e a resolucao foi montada.

Sobe o SEU PROPRIO servidor, em porta propria e com o diretorio FIXO nesta pasta, e confere
antes de medir que o que respondeu e' mesmo este aplicativo. A versao anterior apontava para
http://localhost:8777 sem fixar diretorio: com mais de um aplicativo na mesma maquina, a 8777
podia estar servindo outra materia, e uma rodada inteira de medicoes saiu do aplicativo errado
sem avisar nada. O teste de MODULO abaixo e' o que faz isso aparecer na hora.
"""
import os, sys, subprocess, time, urllib.request
from playwright.sync_api import sync_playwright

AQUI = os.path.dirname(os.path.abspath(__file__))
if not os.path.exists(os.path.join(AQUI, 'test.html')):
    raise SystemExit('nao ha test.html em %s: rode "python3 build.py" primeiro '
                     '(e, antes disso, o dados.json e os pacotes de res/ precisam existir).' % AQUI)
PORTA = 8911                      # porta so' deste aplicativo
MATERIA = 'Biologia'                # como a marca tem de aparecer no cabecalho
PREFIXO = 'B'                # prefixo dos modulos deste banco
BASE = 'http://127.0.0.1:%d' % PORTA
TELAS = ['inicio', 'estudar', 'escada', 'questao', 'simulado', 'progresso']

srv = subprocess.Popen([sys.executable, '-m', 'http.server', str(PORTA),
                        '--bind', '127.0.0.1', '--directory', AQUI],
                       stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
time.sleep(1)
if srv.poll() is not None:
    print('AVISO: a porta %d ja estava ocupada — vou usar o que ja esta la. '
          'O teste de identidade abaixo diz se e este aplicativo ou outro.' % PORTA)
try:
    for _ in range(60):
        try:
            urllib.request.urlopen(BASE + '/test.html', timeout=1).read(64); break
        except Exception: time.sleep(.25)
    else:
        raise SystemExit('o servidor na porta %d nao subiu' % PORTA)
    print('servindo', AQUI, 'em', BASE)

    with sync_playwright() as p:
        b = p.chromium.launch()
        for nome, vp in [('cel', {'width': 430, 'height': 930}), ('ipad', {'width': 1180, 'height': 820})]:
            pg = b.new_page(viewport=vp, device_scale_factor=2)
            err = []
            pg.on('pageerror', lambda e: err.append('ERRO: ' + str(e)))
            pg.on('console', lambda m: err.append('console: ' + m.text[:160]) if m.type == 'error' else None)
            pg.goto(BASE + '/test.html')
            pg.wait_for_timeout(1500)

            # --- e' mesmo este aplicativo? ---
            quem = pg.evaluate("""() => ({
                marca: (document.querySelector('.marca') || {}).textContent || '',
                n: (typeof BANCO !== 'undefined') ? BANCO.length : -1,
                mods: (typeof BANCO !== 'undefined')
                      ? Array.from(new Set(BANCO.map(q => q.modulo))).sort().slice(0, 3) : [] })""")
            print(nome, 'servindo:', quem)
            if MATERIA not in quem['marca'] or not all(m.startswith(PREFIXO) for m in quem['mods']):
                raise SystemExit('PAROU: a porta %d respondeu OUTRO aplicativo (%r, modulos %s). '
                                 'Nenhuma medicao desta rodada vale.' % (PORTA, quem['marca'], quem['mods']))

            for t in TELAS:
                try:
                    pg.evaluate("t => (typeof vai === 'function') && vai(t)", t)
                    pg.wait_for_timeout(400)
                except Exception as e:
                    err.append('vai(%s): %s' % (t, e))

            for tipo in ('site', 'prova'):
                qid = pg.evaluate("tp => { const q = BANCO.find(x => x.tipo === tp); return q ? q.id : null; }", tipo)
                if not qid:
                    print(nome, tipo, '-> nenhuma questao'); continue
                pg.evaluate("id => abrirQuestao(id, {lista:[id], i:0})", qid)
                pg.wait_for_timeout(2200)
                # a questao ampliada: abre, amplia, fecha
                pg.evaluate("() => { const c = document.querySelector('.print[role=button]'); if (c) c.click(); }")
                pg.wait_for_timeout(400)
                lupa = pg.evaluate("""() => { const L = document.getElementById('lupa');
                    const im = document.getElementById('lupa-img');
                    return { aberta: !!(L && !L.hidden), largura: im ? im.clientWidth : 0,
                             gabarito: !!(L && /gabarito/i.test(L.innerText)) }; }""")
                pg.keyboard.press('Equal'); pg.wait_for_timeout(250)
                ampl = pg.evaluate("() => { const im = document.getElementById('lupa-img'); return im ? im.clientWidth : 0; }")
                pg.keyboard.press('Escape'); pg.wait_for_timeout(250)
                fechou = pg.evaluate("() => { const L = document.getElementById('lupa'); return !!(L && L.hidden); }")
                print(nome, tipo, 'ampliada:', lupa, '-> ao ampliar', ampl, '| fechou com Esc:', fechou)
                pg.evaluate("() => { const b = document.querySelectorAll('.bolha'); if (b[0]) b[0].click(); }")
                pg.evaluate("() => { const b = document.getElementById('b-conf'); if (b) b.click(); }")
                pg.wait_for_timeout(2500)
                est = pg.evaluate("""() => {
                    const img = document.getElementById('q-print');
                    return { print: img ? (img.hidden ? 'escondido' : 'visivel') : 'ausente',
                             corte: img ? (img.style.aspectRatio || 'inteiro') : '-',
                             resolucao: !!document.querySelector('.resolucao'),
                             passos: document.querySelectorAll('.resolucao .passo, .resolucao li').length }; }""")
                print(nome, tipo, qid, est)
            pg.screenshot(path=os.path.join(AQUI, 'v4-%s-final.png' % nome), full_page=True)
            print(nome, 'erros:', err[:6] if err else 'nenhum')
            pg.close()
        b.close()
finally:
    srv.terminate()

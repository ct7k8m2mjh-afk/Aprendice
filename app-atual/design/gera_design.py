# -*- coding: utf-8 -*-
"""Design 29/10 (ATIVIDADES DIARIAS): gera o shell novo e injeta a camada visual nos 4 apps.
Idempotente. Rodar da pasta escadas-sc:  python3 design/gera_design.py"""
import json, re, os

os.chdir(os.path.dirname(os.path.abspath(__file__)) + '/..')
MATS = ['bio', 'qui', 'mat', 'por']
# auditoria 31/10: fontes hospedadas no app (design/fontes.css -> pasta /fontes); sem Google Fonts
FONTE = ('<link rel="preload" href="../fontes/familjen-grotesk-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin id="ad-fonte-pre">'
         '<style id="ad-fonte">' + open('design/fontes.css', encoding='utf-8').read().replace('%BASE%', '../fontes/') + '</style>')
# 30/10 (painel de design): as paginas ainda baixavam Archivo + Source Serif 4 + IBM Plex Mono sem usar (11 faces)
FONTE_VELHA = re.compile(r'<link rel="stylesheet" href="https://fonts\.googleapis\.com/css2\?family=Archivo[^"]*">\n?')
CSS_A, CSS_F = '/* ==== AD-CSS inicio ==== */', '/* ==== AD-CSS fim ==== */'
JS_A, JS_F = '/* ==== AD-JS inicio ==== */', '/* ==== AD-JS fim ==== */'

import subprocess; subprocess.run(['python3', 'design/gera_ilu.py'], check=True, stdout=subprocess.DEVNULL)
icones = open('design/icones.js', encoding='utf-8').read().replace('%ILU%', open('design/ilu.json', encoding='utf-8').read())
css = CSS_A + '\n' + open('design/materia.css', encoding='utf-8').read() + '\n' + CSS_F
js = JS_A + '\n' + icones + '\n' + open('design/materia.js', encoding='utf-8').read() + '\n' + JS_F

# ---------- icones das materias (design/icones_pro, viewBox 48, currentColor): miolo do <svg>, numeros enxutos ----------
PRO = {}
for f in sorted(os.listdir('design/icones_pro')):
    if not f.endswith('.svg'): continue
    k = 'OUTRO' if f == 'M-OUTRO.svg' else f[:-4]
    s = open('design/icones_pro/' + f, encoding='utf-8').read()
    s = re.sub(r'^.*?<svg[^>]*>', '', s, flags=re.S); s = re.sub(r'</svg>\s*$', '', s)
    s = re.sub(r'<!--.*?-->', '', s, flags=re.S)
    def _enxuga(mm):   # so dentro de d="" / points="": 3+ casas decimais -> 2 (nao mexe em transform/opacity)
        return mm.group(1) + re.sub(r'(\d+\.\d\d)\d+', r'\1', mm.group(2)) + '"'
    s = re.sub(r'(\s(?:d|points)=")([^"]*)"', _enxuga, s)
    PRO[k] = re.sub(r'>\s+<', '><', s).strip()
def pro_js(prefixo=None):
    d = {k: v for k, v in PRO.items() if prefixo is None or k[0] == prefixo or k == 'OUTRO'}
    return json.dumps(d, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/')
LETRA = {'bio': 'B', 'qui': 'Q', 'mat': 'M', 'por': 'P'}

# ---------- icones REALISTAS dos modulos (design/icones_real/<id>.svg; 29/10): materia recebe os SVGs dela;
# o shell mostra icones na busca e na Atividade recente (28-36 px), entao leva miniaturas WebP 64 px de modulos e conteudos
# (em vez dos ~4 MB de SVG) ----------
REAL = {}
def _limpa_svg(s): return re.sub(r'<\?xml[^>]*\?>|<!--.*?-->', '', s, flags=re.S).strip()
for f in sorted(os.listdir('design/icones_real')):
    if re.match(r'^[BQMP]\d\d\.svg$', f):
        REAL[f[:-4]] = _limpa_svg(open('design/icones_real/' + f, encoding='utf-8').read())
# ---------- icones REALISTAS dos CONTEUDOS (30/10): design/icones_real/sub/<idConteudo>.svg (255) + M-OUTRO.svg ('OUTRO').
# Mesma entrada dos de modulo: a materia recebe os dela (chave B01.1); 'OUTRO' vai para todas ----------
for f in sorted(os.listdir('design/icones_real/sub')):
    if re.match(r'^[BQMP]\d\d\.\d+\.svg$', f) or f == 'M-OUTRO.svg':
        REAL['OUTRO' if f == 'M-OUTRO.svg' else f[:-4]] = _limpa_svg(open('design/icones_real/sub/' + f, encoding='utf-8').read())
print('icones realistas:', sum(1 for k in REAL if '.' not in k and k != 'OUTRO'), 'de modulo,', sum(1 for k in REAL if '.' in k or k == 'OUTRO'), 'de conteudo')
# auditoria 31/10 (peso): o icone que e' so uma imagem WebP embrulhada em SVG sai da pagina e vai para UM pacote por
# materia (<materia>/ic.json, guardado pelo navegador); a pagina so aparece depois que ele chega (sem icones piscando).
# Um arquivo por materia (e nao um por icone): a hospedagem aceita no maximo 511 arquivos por versao.
_RE_WEBP = re.compile(r'^<svg[^>]*><image width="\d+" height="\d+" href="data:image/webp;base64,([A-Za-z0-9+/=]+)"/></svg>$')
PACOTE_IC = {}
def real_js(prefixo):
    import hashlib as _hl
    MD = {'B': 'bio', 'Q': 'qui', 'M': 'mat', 'P': 'por'}[prefixo]
    out, pac = {}, {}
    for k, v in REAL.items():
        if not (k[0] == prefixo or k == 'OUTRO'): continue
        mm = _RE_WEBP.match(v.strip())
        if not mm: out[k] = v; continue
        pac[k] = mm.group(1); out[k] = 'pk:'
    txt = json.dumps(pac, separators=(',', ':'))
    real = os.path.realpath(os.path.join(MD, 'ic.json')); tmp = real + '.tmp'; open(tmp, 'w').write(txt); os.replace(tmp, real)
    PACOTE_IC[MD] = 'ic.json?v=' + _hl.md5(txt.encode()).hexdigest()[:8]
    import shutil as _sh
    if os.path.isdir(os.path.join(MD, 'ic')): _sh.rmtree(os.path.join(MD, 'ic'))   # pasta da tentativa anterior (um arquivo por icone)
    return json.dumps(out, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/')
def real_mini_js():
    import io, base64 as b64
    cache = 'design/icones_real/_mini64.json'   # refeito quando algum SVG muda
    import hashlib   # assinatura pelo conteudo (antes era o tamanho: um SVG corrigido com o mesmo tamanho, como o P02, nao refazia)
    sig = {k: hashlib.md5(v.encode('utf-8')).hexdigest()[:12] for k, v in REAL.items()}
    try:
        c = json.load(open(cache)); assert c['sig'] == sig and c.get('motor') == 'chromium'; mini = c['mini']
    except Exception:
        # 30/10: miniaturas desenhadas no Chromium (o cairosvg ignora o blur e a sombra suave virava um poligono duro)
        from PIL import Image
        from playwright.sync_api import sync_playwright
        try: velho = json.load(open(cache))
        except Exception: velho = {'sig': {}, 'mini': {}}
        mini = {}
        falta = [k for k in REAL if not (velho['sig'].get(k) == sig[k] and k in velho['mini'] and velho.get('motor') == 'chromium')]
        for k in REAL:
            if k not in falta: mini[k] = velho['mini'][k]
        if falta:
            with sync_playwright() as pw:
                br = pw.chromium.launch(); pg = br.new_page(viewport={'width': 128, 'height': 128})
                for k in falta:
                    v = REAL[k]
                    pg.set_content('<html><body style="margin:0;background:transparent"><img style="width:128px;height:128px;display:block" src="data:image/svg+xml;base64,' +
                                   b64.b64encode(v.encode('utf-8')).decode() + '"></body></html>')
                    pg.wait_for_function('document.images[0].complete')
                    png = pg.screenshot(omit_background=True, clip={'x': 0, 'y': 0, 'width': 128, 'height': 128})
                    im = Image.open(io.BytesIO(png)).convert('RGBA').resize((64, 64), Image.LANCZOS)
                    b = io.BytesIO(); im.save(b, 'WEBP', quality=88, method=6)
                    mini[k] = 'data:image/webp;base64,' + b64.b64encode(b.getvalue()).decode()
                br.close()
        json.dump({'sig': sig, 'mini': mini, 'motor': 'chromium'}, open(cache, 'w'), separators=(',', ':'))
    return json.dumps(mini, separators=(',', ':'))

# ---------- icones dos SIMULADOS (30/10): desenhados aqui, no estilo realista do app (luz de cima-esquerda,
# degrade de volume, sombra de contato). Selo da banca: medalha dourada serrilhada com faixa e o NOME DA BANCA escrito
# (letras convertidas em contorno, DejaVu Sans Condensed Bold) -- desenho proprio, nao e logo de instituicao nenhuma. ----------
import math as _m
def _texto_path(txt, cx, base, tam, arq='/usr/share/fonts/truetype/dejavu/DejaVuSansCondensed-Bold.ttf', track=0.04):
    from fontTools.ttLib import TTFont
    from fontTools.pens.svgPathPen import SVGPathPen
    from fontTools.pens.transformPen import TransformPen
    f = TTFont(arq); gs = f.getGlyphSet(); cmap = f.getBestCmap(); upm = f['head'].unitsPerEm; k = tam / upm
    nomes = [cmap[ord(c)] for c in txt]
    larg = sum(gs[n].width for n in nomes) * k + track * tam * (len(txt) - 1)
    x = cx - larg / 2; out = []
    for n in nomes:
        pen = SVGPathPen(gs); gs[n].draw(TransformPen(pen, (k, 0, 0, -k, x, base)))
        out.append(pen.getCommands()); x += gs[n].width * k + track * tam
    d = ' '.join(out)
    return re.sub(r'(\d+\.\d)\d+', r'\1', d)

def _svg(corpo, defs):
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs>' + defs + '</defs>' + corpo + '</svg>'

def _sombra(cx, cy, rx, ry, op=.22, gid='sh'):
    return (f'<radialGradient id="{gid}"><stop offset="0" stop-color="#1b1f2a" stop-opacity="{op}"/><stop offset=".6" stop-color="#1b1f2a" stop-opacity="{op*.45:.3f}"/>'
            f'<stop offset="1" stop-color="#1b1f2a" stop-opacity="0"/></radialGradient>',
            f'<ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" fill="url(#{gid})"/>')

def ico_selo(txt, fita, fita_clara, fita_esc):
    cx, cy = 32, 26
    dsh, sh = _sombra(32, 58.5, 20, 3.6, .26)
    # roseta serrilhada (30 dentes)
    pts = []
    for i in range(60):
        a = -_m.pi / 2 + i * _m.pi / 30; r = 22.5 if i % 2 == 0 else 20.6
        pts.append(f'{cx + r * _m.cos(a):.2f} {cy + r * _m.sin(a):.2f}')
    ros = 'M' + ' L'.join(pts) + 'Z'
    defs = dsh + (
        '<linearGradient id="ou" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fbe7a1"/><stop offset=".35" stop-color="#e2b64a"/>'
        '<stop offset=".7" stop-color="#b8861f"/><stop offset="1" stop-color="#7c5810"/></linearGradient>'
        '<radialGradient id="oi" cx=".38" cy=".3" r=".8"><stop offset="0" stop-color="#fff2c4"/><stop offset=".45" stop-color="#ebc560"/>'
        '<stop offset="1" stop-color="#a87a1a"/></radialGradient>'
        f'<linearGradient id="fi" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{fita_clara}"/><stop offset=".55" stop-color="{fita}"/>'
        f'<stop offset="1" stop-color="{fita_esc}"/></linearGradient>'
        f'<linearGradient id="ca" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{fita}"/><stop offset="1" stop-color="{fita_esc}"/></linearGradient>')
    letras = _texto_path(txt, 32, 31.1, 10.4)
    corpo = (sh +
        # caudas da fita atras da medalha
        f'<path d="M23.5 38 17.2 58.2l4.9-2.6 3.4 4.3 5.4-19.6z" fill="url(#ca)"/>'
        f'<path d="M40.5 38l6.3 20.2-4.9-2.6-3.4 4.3-5.4-19.6z" fill="url(#ca)"/>'
        f'<path d="M23.5 38 17.2 58.2l4.9-2.6z" fill="#000" opacity=".18"/>'
        # medalha
        f'<path d="{ros}" fill="url(#ou)" stroke="#6e4e0c" stroke-width=".6" stroke-linejoin="round"/>'
        f'<circle cx="{cx}" cy="{cy}" r="17.4" fill="url(#oi)" stroke="#8a6414" stroke-width=".7"/>'
        f'<circle cx="{cx}" cy="{cy}" r="15.2" fill="none" stroke="#fff6d6" stroke-width=".8" opacity=".75"/>'
        f'<circle cx="{cx}" cy="{cy + .5}" r="15.2" fill="none" stroke="#7c5810" stroke-width=".5" opacity=".45"/>'
        # estrelinhas em relevo (acima e abaixo da faixa)
        + ''.join(f'<path transform="translate({x} {y}) scale({s})" d="M0-3 .9-.9 3-.9 1.3.4 1.9 2.6 0 1.3-1.9 2.6-1.3.4-3-.9-.9-.9z" fill="#fff3c8" stroke="#8a6414" stroke-width=".35"/>'
                  for x, y, s in ((32, 14.2, .95), (25.5, 16, .62), (38.5, 16, .62)))
        + f'<path d="M24 37.6q8 3.4 16 0" fill="none" stroke="#8a6414" stroke-width=".7" stroke-linecap="round" opacity=".7"/>'
        # faixa com o nome: dobras escuras nas pontas, faixa em degrade, brilho no alto
        f'<path d="M3.6 23.4h5v11.6h-5l2.6-5.8z" fill="{fita_esc}"/>'
        f'<path d="M60.4 23.4h-5v11.6h5l-2.6-5.8z" fill="{fita_esc}"/>'
        f'<path d="M8.6 35l-2.4 2.2V35zM55.4 35l2.4 2.2V35z" fill="#000" opacity=".35"/>'
        f'<rect x="6.2" y="20.6" width="51.6" height="14.4" rx="1" fill="url(#fi)"/>'
        f'<rect x="6.2" y="20.6" width="51.6" height="1.3" fill="#fff" opacity=".28"/>'
        f'<rect x="6.2" y="33.6" width="51.6" height="1.4" fill="#000" opacity=".2"/>'
        f'<path d="{letras}" fill="#000" opacity=".35" transform="translate(0 .7)"/>'
        f'<path d="{letras}" fill="#fff"/>')
    return _svg(corpo, defs)

def ico_cronometro():
    dsh, sh = _sombra(32, 59, 18, 3.4, .24)
    defs = dsh + (
        '<linearGradient id="me" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f4f6f9"/><stop offset=".4" stop-color="#b9c0cb"/>'
        '<stop offset=".75" stop-color="#7d8592"/><stop offset="1" stop-color="#4b525d"/></linearGradient>'
        '<linearGradient id="bt" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#e9edf2"/><stop offset=".5" stop-color="#9aa3af"/><stop offset="1" stop-color="#5c6470"/></linearGradient>'
        '<radialGradient id="mo" cx=".42" cy=".36" r=".75"><stop offset="0" stop-color="#ffffff"/><stop offset=".8" stop-color="#f1f2ee"/><stop offset="1" stop-color="#d5d8d2"/></radialGradient>'
        '<linearGradient id="vi" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".75"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/></linearGradient>')
    cx, cy, R = 32, 35, 21
    marcas = ''
    for i in range(60):
        a = i * _m.pi / 30; r0 = 15.2 if i % 5 else 13.2; r1 = 16.4
        w = .9 if i % 5 == 0 else .4
        marcas += f'<path d="M{cx + r0 * _m.sin(a):.2f} {cy - r0 * _m.cos(a):.2f}L{cx + r1 * _m.sin(a):.2f} {cy - r1 * _m.cos(a):.2f}" stroke="#2b2f36" stroke-width="{w}"/>'
    a = 2.1  # ponteiro em ~20 s
    corpo = (sh +
        '<rect x="28.6" y="5.6" width="6.8" height="4.4" rx="1.4" fill="url(#bt)" stroke="#4b525d" stroke-width=".5"/>'
        '<rect x="30.2" y="9.6" width="3.6" height="5" fill="url(#bt)"/>'
        '<path d="M47.2 15.2l3.8-3.8 3 3-3.8 3.8z" fill="url(#bt)" stroke="#4b525d" stroke-width=".5"/>'
        '<path d="M16.8 15.2 13 11.4l-3 3 3.8 3.8z" fill="url(#bt)" stroke="#4b525d" stroke-width=".5"/>'
        f'<circle cx="{cx}" cy="{cy}" r="{R}" fill="url(#me)" stroke="#3d434c" stroke-width=".6"/>'
        f'<circle cx="{cx}" cy="{cy}" r="{R - 3.2}" fill="#3d434c"/>'
        f'<circle cx="{cx}" cy="{cy}" r="{R - 3.8}" fill="url(#mo)"/>'
        f'<g stroke-linecap="round">{marcas}</g>'
        f'<circle cx="{cx}" cy="{cy - 6.5}" r="3.4" fill="none" stroke="#9aa0a8" stroke-width=".5"/>'
        f'<path d="M{cx} {cy}L{cx + 13.5 * _m.sin(a):.2f} {cy - 13.5 * _m.cos(a):.2f}" stroke="#d6281e" stroke-width="1.3" stroke-linecap="round"/>'
        f'<path d="M{cx} {cy}L{cx - 4 * _m.sin(a):.2f} {cy + 4 * _m.cos(a):.2f}" stroke="#d6281e" stroke-width="1.3" stroke-linecap="round"/>'
        f'<circle cx="{cx}" cy="{cy}" r="1.9" fill="#d6281e" stroke="#7d140e" stroke-width=".4"/>'
        f'<path d="M{cx - 16.5} {cy - 2}a16.8 16.8 0 0 1 22-14.2 22 22 0 0 0-22 14.2z" fill="url(#vi)"/>')
    return _svg(corpo, defs)

def ico_montanha():
    dsh, sh = _sombra(32, 55.5, 28, 3.6, .2)
    defs = dsh + (
        '<linearGradient id="mc" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8a96a8"/><stop offset="1" stop-color="#5a6577"/></linearGradient>'
        '<linearGradient id="me2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5b6576"/><stop offset="1" stop-color="#363d4a"/></linearGradient>'
        '<linearGradient id="mf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9bb08a"/><stop offset="1" stop-color="#6b8a5a"/></linearGradient>'
        '<linearGradient id="nv" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#dde6f0"/></linearGradient>'
        '<linearGradient id="fl" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#e8392c"/><stop offset="1" stop-color="#b51f16"/></linearGradient>')
    corpo = (sh +
        # pico de tras (menor)
        '<path d="M37 54 49 28l13 26z" fill="url(#mc)" opacity=".9"/>'
        '<path d="M49 28l13 26H49.5z" fill="#3e4554" opacity=".55"/>'
        '<path d="M49 28l-3.6 7.8 2.1-1.2 1.6 1.8 1.4-1.6 2.3 1.4z" fill="url(#nv)"/>'
        # pico principal: face iluminada (esq.) e face na sombra (dir.)
        '<path d="M3 54 28 13l25 41z" fill="url(#mc)"/>'
        '<path d="M28 13l25 41H31.5l-1.2-17z" fill="url(#me2)"/>'
        '<path d="M28 13 20.6 25.2l3.2-1.6 2.6 3 2.2-2.4 2.6 2.7 2.5-2.1 2.3 1.5z" fill="url(#nv)"/>'
        '<path d="M28 13l2.3 11.4 2.5-2.1 2.3 1.5z" fill="#c4d0de"/>'
        '<path d="M14 40l4-3 3 2M36 39l3 3" stroke="#3e4554" stroke-width=".7" fill="none" opacity=".5" stroke-linecap="round"/>'
        # base com vegetacao
        '<path d="M3 54q14-6 25-3t25 3z" fill="url(#mf)"/>'
        # bandeira no cume
        '<path d="M28 13V3.4" stroke="#4a3a2a" stroke-width="1.1" stroke-linecap="round"/>'
        '<path d="M28.4 3.6q4.4-1.4 9 0.6t8.6-.2l-1.8 3.4 1.8 3.2q-4.4 1.6-8.6-.4t-9 .4z" fill="url(#fl)"/>'
        '<path d="M28.4 3.6q4.4-1.4 9 .6v1.2q-4.6-1.6-9-.4z" fill="#fff" opacity=".25"/>')
    return _svg(corpo, defs)

def ico_alvo():
    dsh, sh = _sombra(30, 58.5, 22, 3.4, .22)
    defs = dsh + (
        '<radialGradient id="av" cx=".4" cy=".35" r=".75"><stop offset="0" stop-color="#ef5547"/><stop offset="1" stop-color="#a71a12"/></radialGradient>'
        '<radialGradient id="ab" cx=".4" cy=".35" r=".75"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#dcd8d0"/></radialGradient>'
        '<linearGradient id="bo" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#d8c4a0"/><stop offset="1" stop-color="#8e734c"/></linearGradient>'
        '<linearGradient id="dh" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#e9edf2"/><stop offset="1" stop-color="#6c7480"/></linearGradient>')
    cx, cy = 29, 32
    aneis = ''.join(f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="url(#{"av" if i % 2 == 0 else "ab"})"/>' for i, r in enumerate((21, 17, 13, 9, 5)))
    corpo = (sh +
        f'<circle cx="{cx + 1.2}" cy="{cy + 1.4}" r="23.6" fill="#6e5532"/>'
        f'<circle cx="{cx}" cy="{cy}" r="23.6" fill="url(#bo)" stroke="#6e5532" stroke-width=".5"/>' + aneis +
        f'<circle cx="{cx}" cy="{cy}" r="21" fill="none" stroke="#7a140e" stroke-width=".5"/>'
        # dardo cravado no centro, vindo da direita-cima
        f'<path d="M{cx + .6} {cy - .6}l14-14" stroke="#000" stroke-opacity=".25" stroke-width="2.6" stroke-linecap="round" transform="translate(1.6 2)"/>'
        f'<path d="M{cx} {cy}l5-5" stroke="#9aa3af" stroke-width="1" stroke-linecap="round"/>'
        f'<path d="M{cx + 4.6} {cy - 4.6}l9.2-9.2" stroke="url(#dh)" stroke-width="3" stroke-linecap="round"/>'
        f'<path d="M{cx + 5.6} {cy - 5.6}l7.2-7.2" stroke="#fff" stroke-opacity=".55" stroke-width=".8" stroke-linecap="round" transform="translate(-.6 -.6)"/>'
        f'<path d="M{cx + 13.4} {cy - 13.4}l5.6-5.6 3.6 1.2-4.6 4.6zM{cx + 13.4} {cy - 13.4}l5.6-5.6-1.2-3.6-4.6 4.6z" fill="#1d6fd1"/>'
        f'<path d="M{cx + 13.4} {cy - 13.4}l5.6-5.6 3.6 1.2-4.6 4.6z" fill="#0f4c99"/>')
    return _svg(corpo, defs)

def ico_borracha():
    """a borracha classica de duas cores (vermelha para lapis, azul para caneta), em perspectiva, com farelos"""
    dsh, sh = _sombra(32, 50, 27, 4, .22)
    defs = dsh + (
        '<linearGradient id="rv" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f26b5b"/><stop offset="1" stop-color="#d33a2c"/></linearGradient>'
        '<linearGradient id="ra" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4f86d9"/><stop offset="1" stop-color="#2a5fb4"/></linearGradient>')
    # caixa: topo (paralelogramo), frente, lado
    corpo = (sh +
        '<path d="M6 33h24v13H6z" fill="#b8281c"/>'
        '<path d="M30 33h20v13H30z" fill="#1f4f9c"/>'
        '<path d="M6 33l8-11h24l-8 11z" fill="url(#rv)"/>'
        '<path d="M30 33l8-11h20l-8 11z" fill="url(#ra)"/>'
        '<path d="M50 33l8-11v13l-8 11z" fill="#173f80"/>'
        '<path d="M8 32.4l7.4-9.8h9" stroke="#fff" stroke-opacity=".45" stroke-width="1" fill="none" stroke-linecap="round"/>'
        '<path d="M32 32.4l7.4-9.8h7" stroke="#fff" stroke-opacity=".4" stroke-width="1" fill="none" stroke-linecap="round"/>'
        '<path d="M30 33v13M38 22l-8 11" stroke="#000" stroke-opacity=".15" stroke-width=".6"/>'
        '<path d="M6 46h44" stroke="#000" stroke-opacity=".2" stroke-width=".6"/>'
        # farelos
        '<path d="M8 52.5l2.4-.6.6 1.4-2.2.8zM14 54l1.8-.2.2 1.2-1.8.2zM4 50.6l1.4.2-.2 1.2-1.4-.4z" fill="#d9584a"/>')
    return _svg(corpo, defs)

def ico_calendario():
    dsh, sh = _sombra(32, 59, 25, 3.4, .22)
    defs = dsh + (
        '<linearGradient id="cv" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ef5547"/><stop offset="1" stop-color="#b82319"/></linearGradient>'
        '<linearGradient id="pp" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#ecebe6"/></linearGradient>'
        '<linearGradient id="ar" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#e9edf2"/><stop offset=".5" stop-color="#9aa3af"/><stop offset="1" stop-color="#5c6470"/></linearGradient>')
    cel = ''
    for li in range(4):
        for co in range(5):
            x, y = 13 + co * 9.5, 31.5 + li * 6.6
            cel += f'<rect x="{x - 2.6}" y="{y - 1.6}" width="5.2" height="3.2" rx=".8" fill="#c9c6bd"/>'
    corpo = (sh +
        '<path d="M7 16h50v40.5a2.5 2.5 0 0 1-2.5 2.5h-45A2.5 2.5 0 0 1 7 56.5z" fill="#d7d4cb"/>'
        '<path d="M7 16h50v38.5a2.5 2.5 0 0 1-2.5 2.5h-45A2.5 2.5 0 0 1 7 54.5z" fill="url(#pp)" stroke="#b9b5aa" stroke-width=".5"/>'
        '<path d="M9.5 9.5h45A2.5 2.5 0 0 1 57 12v13H7V12a2.5 2.5 0 0 1 2.5-2.5z" fill="url(#cv)"/>'
        '<path d="M9.5 9.5h45A2.5 2.5 0 0 1 57 12v1.4H7V12a2.5 2.5 0 0 1 2.5-2.5z" fill="#fff" opacity=".25"/>'
        '<path d="M7 25h50" stroke="#7d140e" stroke-width=".6"/>'
        + ''.join(f'<circle cx="{x}" cy="13.6" r="1.8" fill="#6f1009"/><rect x="{x - 1.2}" y="4.6" width="2.4" height="9.4" rx="1.2" fill="url(#ar)"/>' for x in (18, 32, 46))
        + cel +
        # dia da prova: circulado a caneta vermelha
        f'<path d="M{13 + 3 * 9.5 - 5.4} {31.5 + 2 * 6.6 + .4}c0-3.6 3-5 5.8-5s5.2 1.6 5.2 4.6-2.8 4.6-5.6 4.6-5.8-1.8-5.2-4.8" fill="none" stroke="#d6281e" stroke-width="1.5" stroke-linecap="round"/>')
    return _svg(corpo, defs)

def sim_js():
    d = {
        'uni_São Camilo': ico_selo('VUNESP', '#9c2433', '#c4475a', '#64121e'),
        'uni_Unesp': ico_selo('VUNESP', '#1f4f96', '#3f74c4', '#122f5e'),
        'uni_Fuvest': ico_selo('FUVEST', '#1d6a4b', '#3a9470', '#0f4230'),
        's5': ico_cronometro(), 'sdif': ico_montanha(), 'srec': ico_alvo(), 'serr': ico_borracha(), 'ssc': ico_calendario(),
    }
    return json.dumps(d, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/')

# ---------- flashcards com imagem (D.flash_img; design/flash_img/<m>/<img>.svg): so os da materia ----------
def flimg_js(m):
    d = dados(m); out = {}
    for c in d.get('flash_img') or []:
        arq = f'design/flash_img/{m}/{c.get("img", "")}'
        if c.get('img') and os.path.exists(arq):
            s = open(arq, encoding='utf-8').read()
            svg = re.sub(r'<\?xml[^>]*\?>|<!--.*?-->', '', s, flags=re.S).strip()
            out[c['img']] = svg
        elif c.get('img'):
            print('  AVISO: imagem do flashcard nao encontrada:', arq)
    return json.dumps(out, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/')


def dados(m):
    t = open(f'{m}/index.html', encoding='utf-8').read()
    return json.loads(re.search(r'<script id="dados"[^>]*>(.*?)</script>', t, re.S).group(1))


def troca(t, novo, a, f):
    i = t.find(a)
    if i < 0:
        return t, False
    j = t.find(f, i)
    assert j > i
    return t[:i] + novo + t[j + len(f):], True


# ---------- indice para o painel ----------
IDX = {}
for m in MATS:
    d = dados(m)
    b = d['banco']; T = d['teoria']; NS = d['nomesub']
    esc = sorted({q.get('escola') or '' for q in b})
    mods = {}
    for q in b:
        mods.setdefault(q['modulo'], 0); mods[q['modulo']] += 1
    subs, deg = {}, {}
    for q in sorted(b, key=lambda q: (q['sub'], q.get('degrau') or 99, q['dif'])):
        subs.setdefault(q['sub'], [NS.get(q['sub'], q['sub']), q['modulo']])
        deg.setdefault(q['sub'], [])
        if q.get('degrau'):
            deg[q['sub']].append(q['id'])
    por_esc = {}
    for q in b:
        if q.get('tipo') != 'site':
            por_esc[q['escola']] = por_esc.get(q['escola'], 0) + 1
    IDX[m] = {
        'n': len(b),
        'mods': {k: [T[k]['nome'], v] for k, v in sorted(mods.items()) if k in T},
        'subs': subs, 'deg': deg, 'esc': esc, 'porEscola': por_esc,
        'areas': [[a['id'], a['nome'], a['mods']] for a in d.get('areas', [])],
        'fl': [c['id'] for c in (d.get('flash') or []) + (d.get('flash_img') or []) if isinstance(c, dict) and c.get('id') and c.get('frente') and c.get('verso')],   # flashcards (30/10) + com imagem
        'flt': {c['id']: [re.sub(r'\s+', ' ', str(c.get('frente', '')))[:110], c.get('mod', '')] for c in (d.get('flash') or []) + (d.get('flash_img') or []) if isinstance(c, dict) and c.get('id') and c.get('frente') and c.get('verso')},   # auditoria 31/10: a busca (Ctrl K) encontra cartoes
        'q': {q['id']: [q['sub'], q.get('degrau') or 0, esc.index(q.get('escola') or ''),
                        q.get('ano') if q.get('tipo') != 'site' else ''] for q in b},
    }
    print(m, len(b), 'questoes,', len(IDX[m]['mods']), 'temas,', len(subs), 'conteudos')

# ---------- shell ----------
sh = open('design/shell.html', encoding='utf-8').read()
import base64 as _b64
sh = sh.replace('%LOGO%', open('design/marca/logo.json', encoding='utf-8').read())   # logotipo Aprendice vetorizado (design/marca)
sh = sh.replace('%FONTES%', open('design/fontes.css', encoding='utf-8').read().replace('%BASE%', 'fontes/'))   # auditoria 31/10
sh = sh.replace('%ICONES%', icones.replace('%ICPACK%', '').replace('%ICOPRO%', pro_js()).replace('%ICOREAL%', real_mini_js()).replace('%ICOSIM%', '{}')).replace('%INDICE%', json.dumps(IDX, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/'))
assert '%' + 'ICONES%' not in sh and '%' + 'INDICE%' not in sh
open('index.html', 'w', encoding='utf-8').write(sh)
print('shell:', len(sh.encode()), 'bytes')

# ---------- materias ----------
REF_V = "DB.doc('data/users/' + UID + '/progresso')"
REF_N = "DB.doc('data/users/' + UID + '/prog_' + String(KEY).split('.')[1])"
# sem window.claude (pagina dentro do quadro) o app ainda tem de tentar a ponte com a pagina principal
SEM_CLAUDE_V = "    if (!window.claude || !window.claude.use) { pintaSync(); return; }\n"
SEM_CLAUDE_N = "    const temUse = !!(window.claude && window.claude.use);\n"
USE_V = "    let [db, user, dl] = await Promise.all(["
USE_N = "    let [db, user, dl] = !temUse ? [null, null, null] : await Promise.all(["
LEG_ANCORA = "        syncEstado = 'conta';\n"
# flashcards (30/10): S.flash vai junto para a conta e volta mesclado (sem isso o app gravaria so q/sims e apagaria os cartoes da conta)
SET_V = "ref.set({ q: S.q, sims: S.sims || [], atualizado: Date.now() })"
SET_N0 = "ref.set({ q: S.q, sims: S.sims || [], flash: S.flash || {}, atualizado: Date.now() })"
# auditoria 31/10: Gostei/Nao gostei (flg) e o tempo de sessao (sessoes) tambem vao para a conta
SET_N = "ref.set({ q: S.q, sims: S.sims || [], flash: S.flash || {}, flg: S.flg || {}, sessoes: (S.sessoes || []).slice(-200), atualizado: Date.now() })"
MESC_A = "S.sims = mesclaSims(S.sims, r.sims);\n"
MESC_FL = "          S.flash = window.adFlashMescla ? window.adFlashMescla(S.flash, r.flash) : Object.assign({}, r.flash || {}, S.flash || {}); S.flg = Object.assign({}, r.flg || {}, S.flg || {}); if (r.sessoes) { const vs = {}; (S.sessoes || []).concat(r.sessoes).forEach(x => { vs[x.ts] = x; }); S.sessoes = Object.values(vs).sort((a, b) => a.ts - b.ts).slice(-200); }\n"
LEG = ("        /* legado v20: o progresso de todas as materias ia para um documento so (.../progresso) */\n"
       "        try { const lg = await DB.doc('data/users/' + UID + '/progresso').get(); if (lg && lg.exists) { const r2 = lg.data() || {}, q2 = {}; "
       "Object.keys(r2.q || {}).forEach(k => { if (POR[k]) q2[k] = r2.q[k]; }); if (Object.keys(q2).length) { S.q = mesclaQ(S.q, q2); salvaLocal(); } } } catch (e) { }\n")
# auditoria 31/10: gravacao local que FALHA (armazenamento bloqueado/cheio) avisa em vez de fingir que salvou
SALVA_V = "const salvaLocal = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { } };"
SALVA_N = "const salvaLocal = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); window.__adSalvoOk = true; return true; } catch (e) { window.__adSalvoOk = false; try { if (window.adAvisaSemSalvar) window.adAvisaSemSalvar(); } catch (x) { } return false; } };"
FLIMG = {m: flimg_js(m) for m in MATS}
# escrita a mao (30/10): fonte de traco unico so para as materias com conta (mat, qui); bio e por ficam sem animacao
import sys as _sys, glob as _glob
_sys.path.insert(0, 'design/escrita'); import gera_escrita
def hw_js(m):
    if m not in ('mat', 'qui'): return 'null'
    chars = set()
    for f in _glob.glob(f'{m}/res/*.json'):
        for r in json.load(open(f, encoding='utf-8')).values():
            for pz in r.get('passos', []) if isinstance(r, dict) else []: chars |= set(pz.get('conta') or '')
    return json.dumps(gera_escrita.gera(chars), ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/')
HWJS = {m: hw_js(m) for m in MATS}
def _vis_js(m):
    base = os.path.join('design', 'visuais', m + '.js')
    s = open(base, encoding='utf-8').read() if os.path.exists(base) else 'var VIS = { mapa: {}, def: {} };'
    pasta = os.path.join('design', 'visuais', m)
    # PUBLICAR=1: so entram as versoes aprovadas pela revisao (copiadas para visuais/<m>_ok/ na aprovacao)
    if os.environ.get('PUBLICAR') == '1': pasta = os.path.join('design', 'visuais', m + '_ok')
    if os.path.isdir(pasta):
        for f in sorted(os.listdir(pasta)):
            if f.endswith('.js'):
                s += '\n/* ---- ' + f + ' ---- */\n(function () {\n' + open(os.path.join(pasta, f), encoding='utf-8').read() + '\n})();\n'
    return s
VISJS = {m: _vis_js(m) for m in MATS}
SIMJS = sim_js()
# auditoria 31/10: o index.html de cada materia e' ao mesmo tempo SAIDA e FONTE (o banco de questoes mora nele).
# Antes de regravar, guarda as 3 ultimas versoes em design/_bak_gera/ para nao haver execucao sem volta.
import time as _t
os.makedirs('design/_bak_gera', exist_ok=True)
for m in MATS:
    src = f'{m}/index.html'
    if os.path.exists(src):
        stamp = _t.strftime('%Y%m%d-%H%M%S')
        dst = f'design/_bak_gera/{m}.index.{stamp}.html'
        open(dst, 'wb').write(open(src, 'rb').read())
        velhos = sorted(f for f in os.listdir('design/_bak_gera') if f.startswith(m + '.index.'))
        for f in velhos[:-3]: os.remove(os.path.join('design/_bak_gera', f))
for m in MATS:
    for p in (f'{m}/index.html', f'{m}/head.html', f'{m}/app.js'):
        t = open(p, encoding='utf-8').read()
        if p.endswith('app.js') or p.endswith('index.html'):
            t = t.replace(REF_V, REF_N)
            t = t.replace(SEM_CLAUDE_V, SEM_CLAUDE_N).replace(USE_V, USE_N)
            t = t.replace('Use o botão "☆ revisar depois" dentro de uma questão.', 'Use o marcador no canto de cima de cada questão (ou o cartão Revisão, embaixo dela).')
            t = re.sub(r'        /\* legado v20:[^\n]*\n        try \{ const lg = [^\n]*\n', '', t)   # tira copias antigas (acumulavam)
            t = t.replace(SET_V, SET_N).replace(SET_N0, SET_N); assert t.count(SET_N) == 1, p
            t = t.replace(SALVA_V, SALVA_N); assert t.count(SALVA_N) == 1, p
            # auditoria 31/10: questao de site nao tem gabarito "oficial"
            t = t.replace("(ok ? 'Correto.' : 'Incorreto.') + '</b>Gabarito oficial: <b", "(ok ? 'Correto.' : 'Incorreto.') + '</b>' + (q.tipo === 'site' ? 'Gabarito da página' : 'Gabarito oficial') + ': <b")
            t = t.replace("    'Gabarito oficial: <b style=\"display:inline\">' + q.gab", "    (q.tipo === 'site' ? 'Gabarito da página' : 'Gabarito oficial') + ': <b style=\"display:inline\">' + q.gab")
            # auditoria 31/10: o selo da fonte diz o numero da questao NA PROVA ORIGINAL (o cabecalho conta 1 de 5; o print diz 26)
            t = t.replace("'<span class=\"tag\">' + esc(o.selo) + '</span>' +", "'<span class=\"tag\">' + esc(o.selo + (q.tipo !== 'site' && q.n ? ' · nº ' + q.n + ' na prova' : '')) + '</span>' +")
            # 01/11: questao sem numero na fonte (Estrategia) nao mostra "questao undefined"
            t = t.replace("(q.tipo === 'site' ? '' : ' · questão ' + q.n)", "(q.tipo === 'site' || !q.n ? '' : ' · questão ' + q.n)")
            t = t.replace("'questão ' + q.n + ' da prova ' + q.escola + ' ' + q.ano", "(q.n ? 'questão ' + q.n + ' da prova ' : 'questão da prova ') + q.escola + ' ' + q.ano")
            # auditoria 31/10: a ponte do progresso so conversa com a pagina principal do MESMO site (outra pagina que embutisse a materia recebia o progresso e podia injetar dados)
            t = t.replace("if (m && m.ponte === 'res' && pend[m.n])", "if (ev.origin === location.origin && ev.source === parent && m && m.ponte === 'res' && pend[m.n])")
            t = t.replace("parent.postMessage({ ponte: 'req', n, op, caminho, dados }, '*');", "parent.postMessage({ ponte: 'req', n, op, caminho, dados }, location.origin && location.origin !== 'null' ? location.origin : '*');")
            t = t.replace("fetch('res/' + nome + '.json', { cache: 'force-cache' })", "fetch('res/' + nome + '.json', { cache: 'no-cache' })")   # auditoria 31/10: correcao de resolucao chega a quem ja abriu (revalida; 304 se igual)
            t = t.replace("  S = { q: {}, ult: null, sims: [], tema: S.tema }; salvaLocal();\n", "  S = { q: {}, ult: null, sims: [], tema: S.tema }; salvaLocal(); try { localStorage.removeItem('ad-tg-sessao-' + String(KEY).split('.')[1]); } catch (e) { }\n")
            t = re.sub(r'          S\.flash = window\.adFlashMescla[^\n]*\n', '', t)
            assert t.count(MESC_A) == 1, p
            t = t.replace(MESC_A, MESC_A + MESC_FL)
            assert t.count(LEG_ANCORA) == 1, p
            t = t.replace(LEG_ANCORA, LEG + LEG_ANCORA)
        if p.endswith('.html'):
            t = re.sub(r'(?:<link rel="preload"[^>]*id="ad-fonte-pre">)?(?:<link rel="stylesheet" id="ad-fonte" href="[^"]*">|<style id="ad-fonte">.*?</style>)', lambda _m: FONTE, t, flags=re.S)
            t = FONTE_VELHA.sub('', t)
            t, ok = troca(t, css, CSS_A, CSS_F)
            if not ok:
                if p.endswith('index.html'):
                    dd = t.find('<script id="dados"'); u = t.rfind('</style>', 0, dd) + len('</style>')
                    assert dd > 0 and u > 8
                    t = t[:u] + '\n' + FONTE + '\n<style id="ad-design">\n' + css + '\n</style>' + t[u:]
                else:
                    t = t.rstrip('\n') + '\n' + FONTE + '\n<style id="ad-design">\n' + css + '\n</style>\n'
        if p.endswith('index.html') or p.endswith('app.js'):
            _rj = real_js(LETRA[m])
            js_m = js.replace('%ICOPRO%', pro_js(LETRA[m])).replace('%ICOREAL%', _rj).replace('%ICPACK%', PACOTE_IC.get(m, '')).replace('%ICOSIM%', SIMJS).replace('%FLIMG%', FLIMG[m]).replace('%LOGOS%', open('design/logos/logos.json', encoding='utf-8').read()).replace('%HW%', HWJS[m]).replace('%VIS%', VISJS[m])
            t, ok = troca(t, js_m, JS_A, JS_F)
            if not ok:
                if p.endswith('index.html'):
                    i = t.rfind('</body>')
                    t = (t[:i] + '<script id="ad-design-js">\n' + js_m + '\n</script>\n' + t[i:]) if i > 0 else (t.rstrip('\n') + '\n<script id="ad-design-js">\n' + js_m + '\n</script>\n')
                else:
                    t = t.rstrip('\n') + '\n\n' + js_m + '\n'
        _real = os.path.realpath(p); _tmp = _real + '.tmp'; open(_tmp, 'w', encoding='utf-8').write(t); os.replace(_tmp, _real)   # auditoria 31/10: gravacao atomica (no arquivo real: bio/ etc. sao links para outros repositorios)
    print(m, 'ok')

# ---------- banco de imagens: <m>/img.json (agrupado por modulo), so o que passou na revisao ----------
import base64, mimetypes
KIT = '/home/claude/base_kit/kit'
for m in MATS:
    man = f'{KIT}/{m}/manifest.json'
    rev_ok = os.path.exists(f'{KIT}/{m}/REVISAO.md') and (m != 'bio' or os.path.exists(f'{KIT}/bio/REVISAO4.md'))   # bio so com a 4a lente
    if not os.path.exists(man) or not rev_ok:
        print(m, 'img: sem manifest revisado ainda')
        os.makedirs(f'{m}/img', exist_ok=True)
        for md in IDX[m]['mods']:
            if not os.path.exists(f'{m}/img/{md}.json'): open(f'{m}/img/{md}.json', 'w').write('[]')
        continue
    por_mod = {}
    for it in json.load(open(man, encoding='utf-8')):
        arq = f'{KIT}/{m}/{it["arquivo"]}'
        if 'moji' in (it.get('fonte', '') + it.get('licenca', '') + it.get('autor', '')).lower(): continue   # dono proibiu emoji (29/10)
        if not os.path.exists(arq): continue
        tipo = 'image/svg+xml' if arq.endswith('.svg') else (mimetypes.guess_type(arq)[0] or 'image/png')
        dado = open(arq, 'rb').read()
        if arq.endswith('.svg'):   # figura sempre em 'papel branco', independente do tema do sistema
            import sys as _s; _s.path.insert(0, 'design'); from claro_svg import claro
            dado = claro(dado.decode('utf-8'), m).encode('utf-8')
        uri = f'data:{tipo};base64,' + base64.b64encode(dado).decode()
        est = it.get('estilo', '')
        if not est and m == 'qui' and it['arquivo'].split('/')[0] in ('moleculas', 'lewis', 'reacoes'): est = 'caderno'   # o que o aluno desenha no caderno
        reg = {'t': it.get('titulo', ''), 'u': uri, 'sub': it.get('subs', []), 'e': est, 'f': it.get('fonte', ''), 'l': it.get('licenca', '')}
        for md in it.get('modulos', []):
            por_mod.setdefault(md, []).append(reg)
    os.makedirs(f'{m}/img', exist_ok=True)
    # auditoria 31/10: gravacao atomica (arquivo temporario + os.replace) e so apaga o que deixou de existir;
    # antes apagava a pasta inteira e regravava, e quem lia no meio via pacotes faltando
    def _grava(caminho, texto):
        real = os.path.realpath(caminho); tmp = real + '.tmp'; open(tmp, 'w', encoding='utf-8').write(texto); os.replace(tmp, real)
    novos = set()
    for md, l in por_mod.items():
        _grava(f'{m}/img/{md}.json', json.dumps(l, ensure_ascii=False, separators=(',', ':'))); novos.add(f'{md}.json')
    for md in IDX[m]['mods']:
        if md not in por_mod: _grava(f'{m}/img/{md}.json', '[]'); novos.add(f'{md}.json')
    for f in os.listdir(f'{m}/img'):
        if f not in novos: os.remove(f'{m}/img/{f}')
    json.dump({md: len(l) for md, l in por_mod.items()}, open(f'{m}/img.json', 'w'), separators=(',', ':'))
    tam = sum(os.path.getsize(f'{m}/img/{f}') for f in os.listdir(f'{m}/img')) // 1024
    print(m, 'img:', sum(len(v) for v in por_mod.values()), 'entradas em', len(por_mod), 'pacotes,', tam, 'KB; maior', max(os.path.getsize(f'{m}/img/{f}') for f in os.listdir(f'{m}/img')) // 1024, 'KB')

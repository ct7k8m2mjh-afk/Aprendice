# recorta o print fiel de uma questao do PDF oficial (300 dpi), juntando continuacao de coluna se houver
import json, subprocess, pathlib, sys, re
from PIL import Image, ImageChops
G = pathlib.Path('/tmp/claude-0/-home-claude/e5566652-8789-513e-9e19-aca7ab2e3491/scratchpad/geo')
PDF = pathlib.Path('/tmp/claude-0/-home-claude/e5566652-8789-513e-9e19-aca7ab2e3491/scratchpad/enem/pdf')
R = json.load(open(G/'regioes.json'))
DPI = 300; K = DPI/72
cache = {}
def pagina(y, p):
    k = (y, p)
    if k not in cache:
        out = G/'pg'/f'{y}_{p}'
        (G/'pg').mkdir(exist_ok=True)
        f = pathlib.Path(str(out) + '.png')
        if not f.exists():
            subprocess.run(['pdftoppm', '-r', str(DPI), '-f', str(p), '-l', str(p), '-png', '-singlefile', str(PDF/f'{y}_PV.pdf'), str(out)], check=True)
        cache[k] = Image.open(f).convert('RGB')
    return cache[k]
def txt(y, p, x0, y0, x1, y1):
    return subprocess.run(['pdftotext','-f',str(p),'-l',str(p),'-x',str(int(x0)),'-y',str(int(y0)),'-W',str(int(x1-x0)),'-H',str(int(max(1,y1-y0))),'-layout',str(PDF/f'{y}_PV.pdf'),'-'],capture_output=True,text=True).stdout
def ultima_linha(y, p, x0, x1, ytopo, ylim):
    """ultima questao da coluna: corta logo abaixo da ultima linha de texto (as alternativas), antes do rodape/codigo de barras"""
    xml = subprocess.run(['pdftotext','-f',str(p),'-l',str(p),'-bbox',str(PDF/f'{y}_PV.pdf'),'-'],capture_output=True,text=True).stdout
    ys = [float(d) for a, b, c, d in re.findall(r'<word xMin="([\d.]+)" yMin="([\d.]+)" xMax="[\d.]+" yMax="([\d.]+)">', xml) and
          re.findall(r'<word xMin="([\d.]+)" yMin="([\d.]+)" xMax="([\d.]+)" yMax="([\d.]+)">', xml)
          if x0 <= float(a) <= x1 and ytopo <= float(b) < ylim]
    return min(ylim, max(ys) + 6) if ys else ylim
def tira_aba(im):
    """corta so a aba cinza lateral da pagina: bloco escuro solido que encosta na borda direita do recorte"""
    import numpy as np
    a = np.array(im.convert('L')) < 110
    H, W = a.shape
    def coluna_escura(x):
        col = a[:, x]; best = cur = 0
        for v in col:
            cur = cur + 1 if v else 0
            if cur > best: best = cur
        return best > 150
    x = W - 1
    while x > W - 8 and not coluna_escura(x): x -= 1
    if x <= W - 8: return im
    while x > 0 and coluna_escura(x): x -= 1
    largura = W - x
    if largura < 25: return im
    return im.crop((0, 0, max(1, x - 12), H))
def apara(im):
    im = tira_aba(im)
    bg = Image.new('RGB', im.size, (255,255,255))
    diff = ImageChops.difference(im, bg).convert('L').point(lambda v: 255 if v > 40 else 0)
    bb = diff.getbbox()
    if not bb: return im
    m = 18
    return im.crop((max(0,bb[0]-m), max(0,bb[1]-m), min(im.width,bb[2]+m), min(im.height,bb[3]+m)))
def coluna(q, col):
    W = q['W']; return (6, W/2 - 2) if col == 0 else (W/2 + 2, W - 30)
import html as _h
_rod = {}
def rodape(y, p, H):
    k = (y, p)
    if k not in _rod:
        xml = subprocess.run(['pdftotext','-f',str(p),'-l',str(p),'-bbox',str(PDF/f'{y}_PV.pdf'),'-'],capture_output=True,text=True).stdout
        ws = [(float(b), _h.unescape(t)) for b, t in re.findall(r'<word xMin="[\d.]+" yMin="([\d.]+)" xMax="[\d.]+" yMax="[\d.]+">([^<]*)</word>', xml)]
        ys = [b for b, t in ws if b > H - 120 and re.search(r'(?i)^caderno$|^página$|^MT$', t)]
        _rod[k] = min(ys) - 4 if ys else H - BASE
    return _rod[k]
TOPO, BASE = 52, 40   # cabecalho e rodape da pagina, em pontos
def recorta(chave):
    y, n = chave.split('-'); q = R[chave]
    x0, x1 = coluna(q, q['col'])
    yf = q['y_fim'] - 3 if q['y_fim'] else ultima_linha(y, q['page'], x0, x1, q['y'], rodape(y, q['page'], q['H']))
    pg = pagina(y, q['page'])
    partes = [pg.crop((int(x0*K), int((q['y']-4)*K), int(x1*K), int(yf*K)))]
    cont = None
    if not q['y_fim'] and int(n) < 180:   # ultima da coluna: ve se continua no topo da proxima coluna
        if q['col'] == 0: p2, c2 = q['page'], 1
        else: p2, c2 = q['page'] + 1, 0
        primeiras = [o for k, o in R.items() if k.startswith(y+'-') and o['page'] == p2 and o['col'] == c2]
        ytop = min([o['y'] for o in primeiras], default=rodape(y, p2, q['H']))
        a, b = coluna(q, c2)
        t = txt(y, p2, a, TOPO, b, ytop - 3)
        t = re.sub(r'(ENEM ?20\d\d ?)+|MATEMÁTICA E SUAS TECNOLOGIAS|\*\w+\*', '', t)
        if len(re.sub(r'\s', '', t)) > 25:
            cont = p2
            partes.append(pagina(y, p2).crop((int(a*K), int(TOPO*K), int(b*K), int((ytop-3)*K))))
    partes = [apara(p) for p in partes]
    W = max(p.width for p in partes); H = sum(p.height for p in partes) + 20*(len(partes)-1)
    im = Image.new('RGB', (W, H), 'white'); yy = 0
    for p in partes: im.paste(p, (0, yy)); yy += p.height + 20
    return im, cont
if __name__ == '__main__':
    (G/'crop').mkdir(exist_ok=True)
    for c in sys.argv[1:]:
        im, cont = recorta(c)
        im.save(G/'crop'/f'{c}.png'); print(c, im.size, 'continua' if cont else '')

import sys; sys.path.insert(0, '/tmp/claude-0/-home-claude/e5566652-8789-513e-9e19-aca7ab2e3491/scratchpad/tools')
from compose import *
OUT = '/home/claude/escadas-sc/design/flash_img/qui/'
C = 'Chemistry/Servier/'
def vb(src):
    return svgmin.viewbox(open(B + src).read())
def item(src, cx, bottom, h, pid, extra=''):
    v = vb(src); k = h / v[3]; w = v[2] * k
    return layer(src, None, (cx - w / 2, bottom - h, w), pid=pid, extra=extra)
def save(cid, layers, t, l, H):
    n = write(OUT + cid + '.svg', layers, t, l, H, title='Cartão ' + cid)
    print(cid, n // 1024, 'KB', tuple(round(v) for v in t))

# ---- Titulação: bureta no suporte universal + erlenmeyer (fenolftaleína rosa) sob a ponta
def titulacao():
    k = 0.92; X0, Y0 = 170, 8
    bur = layer(C + 'burette-assembled.svg', None, (X0, Y0, 265.02 * k), pid='bu')
    # erlenmeyer: altura 100 u (escala da bureta), centrado no eixo da bureta (x=225 u), fundo na base (y=528 u)
    ve = vb(C + 'erlenmeyer-red.svg'); he = 100 * k; we = ve[2] * he / ve[3]
    er = layer(C + 'erlenmeyer-red.svg', None, (X0 + 225 * k - we / 2, Y0 + 528 * k - he, we), pid='er')
    return bur, er, k, X0, Y0
bur, er, k, X0, Y0 = titulacao()
H = 530
save('qui-i01', [bur, er], bur['T'](225, 205), (470, 120), H)            # bureta
save('qui-i02', [bur, er], er['T'](75, 225), (470, 420), H)               # erlenmeyer

# ---- Filtração a vácuo: funil de Büchner sobre kitassato
def vacuo():
    k = 0.78; X0, Y0 = 190, 225
    kit = layer(C + 'vacuum-flask.svg', None, (X0, Y0, 233.613 * k), pid='ki')
    kb = 1.3 * k; wb = 97.058 * kb
    bx = X0 + 122 * k - wb / 2; by = Y0 + 20 * k - 180 * kb
    bung = (f'<path d="M{X0+80*k:.1f} {Y0+2*k:.1f} L{X0+164*k:.1f} {Y0+2*k:.1f} L{X0+158*k:.1f} {Y0+40*k:.1f} L{X0+86*k:.1f} {Y0+40*k:.1f}Z" fill="#5b5f66" stroke="#2b2d31" stroke-width="1.2"/>'
            f'<ellipse cx="{X0+122*k:.1f}" cy="{Y0+2*k:.1f}" rx="{42*k:.1f}" ry="{6*k:.1f}" fill="#7a7f87" stroke="#2b2d31" stroke-width="1"/>')
    bue = layer(C + 'buechnerfunnel.svg', None, (bx, by, wb), pid='bf')
    return kit, {'body': bung}, bue, k, X0, Y0
kit, bung, bue, k2, X1, Y1 = vacuo()
H2 = 625
save('qui-i03', [kit, bung, bue], kit['T'](120, 360), (500, 560), H2)     # kitassato
save('qui-i04', [kit, bung, bue], bue['T'](48, 90), (470, 70), H2)        # funil de Büchner

# ---- Bancada A: béquer, erlenmeyer, balão volumétrico, proveta (lado a lado, base comum)
BOT = 400
marca = '<path d="M53.5 100 Q 70 104.5 86.5 100" fill="none" stroke="#1f5f75" stroke-width="2.2"/>'
A = [item(C + 'beaker-yellow.svg', 95, BOT, 150, 'a1'),
     item(C + 'erlenmeyer-blue.svg', 225, BOT, 190, 'a2'),
     item(C + 'flask-empty.svg', 360, BOT, 290, 'a3', extra=marca),
     item(C + 'measuringcylinder-blue.svg', 500, BOT, 330, 'a4')]
HA = 440
save('qui-i05', A, A[0]['T'](76, 140), (60, 120), HA)                     # béquer
save('qui-i06', A, A[2]['T'](70, 320), (270, 40), HA)                     # balão volumétrico
save('qui-i07', A, A[3]['T'](59, 300), (575, 40), HA)                     # proveta
# ---- Bancada B: funil de separação, condensador, funil com papel, almofariz, pipeta
BB = 380
Bq = [item(C + 'separating-funnel.svg', 70, BB, 320, 'b1'),
      item(C + 'condenser-straigh.svg', 185, BB, 320, 'b2'),
      item(C + 'funnel-paper.svg', 310, BB, 230, 'b3'),
      item(C + 'mortar.svg', 445, BB, 150, 'b4'),
      item(C + 'pipette-glass.svg', 560, BB, 320, 'b5')]
HB = 425
save('qui-i08', Bq, Bq[0]['T'](67, 160), (24, 262), HB)                   # funil de separação
save('qui-i09', Bq, Bq[1]['T'](104, 280), (230, 30), HB)                  # condensador
save('qui-i10', Bq, Bq[2]['T'](102, 80), (390, 60), HB)                   # funil + papel de filtro
save('qui-i11', Bq, Bq[3]['T'](137, 330), (385, 250), HB)                 # almofariz e pistilo
save('qui-i12', Bq, Bq[4]['T'](16, 250), (515, 40), HB)                   # pipeta graduada

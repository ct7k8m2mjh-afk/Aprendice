# Gera a textura do mapa topográfico da bússola (Geografia) do zero, sem usar pixels da referência.
# Saída: mapa.webp (cor) e mapa-relevo.webp (altura para o bump), mesma proporção da folha 3D (3,7 x 2,45).
# Uso: python3 gera-mapa.py   (numpy, Pillow, scipy, opencv-python-headless)
import numpy as np, cv2, os
from PIL import Image

OUT = os.path.dirname(os.path.abspath(__file__)) + '/'
W, H = 3072, 2034            # 3,7 : 2,45
S = W / 2048                 # escala em relação a 2048 px
MG = int(0.042 * W)          # margem de papel branco
CW, CH = W - 2 * MG, H - 2 * MG
rng = np.random.default_rng(7)

# ---------- ruído fractal (várias oitavas) + distorção de domínio
def oitava(cel, semente):
  r = np.random.default_rng(semente)
  g = r.random((int(CH / cel) + 4, int(CW / cel) + 4)).astype(np.float32)
  big = cv2.resize(g, (int(g.shape[1] * cel), int(g.shape[0] * cel)), interpolation=cv2.INTER_CUBIC)
  return big[:CH, :CW]

def fbm(base, n, semente, ganho=0.5):
  t = np.zeros((CH, CW), np.float32); a = 1.0; s = 0
  for i in range(n):
    t += a * oitava(max(base / 2 ** i, 2), semente + i); s += a; a *= ganho
  return t / s

def norm(a):
  return (a - a.min()) / (a.max() - a.min())

wx = (fbm(420 * S, 4, 100) - 0.5) * 260 * S
wy = (fbm(420 * S, 4, 200) - 0.5) * 260 * S
X, Y = np.meshgrid(np.arange(CW, dtype=np.float32), np.arange(CH, dtype=np.float32))
alt = norm(fbm(700 * S, 7, 1, 0.52))
alt = cv2.remap(alt, X + wx, Y + wy, cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT)
# serrilhado fino das curvas (a referência tem bordas em zigue-zague)
zx = (fbm(60 * S, 3, 300) - 0.5) * 34 * S
zy = (fbm(60 * S, 3, 400) - 0.5) * 34 * S
alt = cv2.remap(alt, X + zx, Y + zy, cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT)
# planaltos mais altos à direita e no centro-baixo; mais verde na faixa de cima e à esquerda embaixo
u, v = X / CW, Y / CH
tend = 0.22 * np.exp(-((u - 0.82) ** 2 / 0.05 + (v - 0.62) ** 2 / 0.12)) + 0.18 * np.exp(-((u - 0.36) ** 2 / 0.03 + (v - 0.55) ** 2 / 0.05)) \
     + 0.12 * np.exp(-((u - 0.12) ** 2 / 0.02 + (v - 0.30) ** 2 / 0.03)) - 0.16 * np.exp(-((u - 0.2) ** 2 / 0.04 + (v - 0.9) ** 2 / 0.03)) \
     - 0.18 * np.exp(-((u - 0.92) ** 2 / 0.02 + (v - 0.12) ** 2 / 0.03)) - 0.1 * np.exp(-((u - 0.3) ** 2 / 0.02 + (v - 0.08) ** 2 / 0.01))
alt = alt + tend

# ---------- rios: linha central suave (Catmull-Rom) + meandros de ruído, largura crescendo rio abaixo
def curva(pts, n=1600):
  p = np.array(pts, np.float64); p = np.vstack([p[0], p, p[-1]]); out = []
  for i in range(1, len(p) - 2):
    for t in np.linspace(0, 1, n // (len(p) - 3), endpoint=False):
      a, b, c, d = p[i - 1], p[i], p[i + 1], p[i + 2]
      out.append(0.5 * ((2 * b) + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t * t + (-a + 3 * b - 3 * c + d) * t ** 3))
  out.append(p[-2]); return np.array(out)

def meandro(c, amp, semente):
  r = np.random.default_rng(semente); n = len(c)
  d = np.gradient(c, axis=0); d /= np.linalg.norm(d, axis=1, keepdims=True) + 1e-9
  nrm = np.stack([-d[:, 1], d[:, 0]], 1)
  k = r.normal(0, 1, n // 40 + 4); off = np.interp(np.arange(n), np.linspace(0, n, len(k)), k)
  k2 = r.normal(0, 1, n // 8 + 4); off2 = np.interp(np.arange(n), np.linspace(0, n, len(k2)), k2)
  return c + nrm * (off * amp + off2 * amp * 0.18)[:, None]

RIOS = [  # (pontos em fração da área colorida, largura inicial e final em px de 2048)
  ([(-0.02, 0.22), (0.07, 0.25), (0.14, 0.33), (0.21, 0.25), (0.29, 0.17), (0.37, 0.14), (0.43, 0.24), (0.46, 0.37),
    (0.53, 0.47), (0.60, 0.56), (0.67, 0.66), (0.70, 0.75), (0.66, 0.86), (0.64, 1.03)], 18, 92, 11),
  ([(0.585, 0.53), (0.68, 0.45), (0.78, 0.35), (0.88, 0.26), (0.97, 0.19), (1.03, 0.16)], 30, 13, 12),
  ([(0.45, 0.31), (0.50, 0.21), (0.55, 0.12), (0.57, 0.02), (0.58, -0.03)], 26, 10, 13),
  ([(0.13, 0.32), (0.09, 0.44), (0.12, 0.55), (0.08, 0.64)], 13, 8, 14),
]
mask = np.zeros((CH, CW), np.uint8)
for pts, l0, l1, sem in RIOS:
  c = curva([(x * CW, y * CH) for x, y in pts]); c = meandro(c, 9 * S, sem)
  n = len(c)
  for i, (x, y) in enumerate(c):
    r = (l0 + (l1 - l0) * (i / n) ** 0.8) * S / 2
    cv2.circle(mask, (int(x * 4), int(y * 4)), int(r * 4), 255, -1, cv2.LINE_AA, 2)
# bordas da água levemente irregulares
m = cv2.GaussianBlur(mask.astype(np.float32) / 255, (0, 0), 2 * S)
m = cv2.remap(m, X + zx * 0.25, Y + zy * 0.25, cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT)
agua = np.clip((m - 0.5) * 6 + 0.5, 0, 1)
mb = (agua > 0.5).astype(np.uint8)
dfora = cv2.distanceTransform(1 - mb, cv2.DIST_L2, 5)
ddentro = cv2.distanceTransform(mb, cv2.DIST_L2, 5)
# vales: o terreno desce até o rio
alt = alt - 0.42 * np.exp(-dfora / (130 * S)) - 0.1 * np.exp(-dfora / (30 * S))

# ---------- faixas de altitude (10) e paleta hipsométrica
N = 10
lo, hi = np.percentile(alt, 2), np.percentile(alt, 99.5)
hn = np.clip((alt - lo) / (hi - lo), 0, 0.9999)
banda = np.floor(hn * N).astype(np.int32)
PAL = np.array([  # verde-escuro baixo -> verde -> verde-amarelo -> amarelo -> laranja-amarelo alto
  (52, 150, 44), (76, 168, 40), (108, 186, 38), (142, 200, 44), (176, 210, 52),
  (206, 214, 60), (232, 214, 72), (242, 204, 78), (243, 190, 82), (238, 174, 84)], np.float32)
cor = PAL[banda]
# leve variação dentro da faixa (para não ficar chapado)
fr = hn * N - banda
cor = cor * (0.97 + 0.06 * fr[..., None])

# ---------- terraços: borda de cada faixa com linha escura no lado da sombra e clara no lado da luz (luz do alto à esquerda)
bf = banda.astype(np.float32)
bs = cv2.GaussianBlur(bf, (0, 0), 1.6 * S)
gx = cv2.Sobel(bs, cv2.CV_32F, 1, 0, ksize=3) / 8; gy = cv2.Sobel(bs, cv2.CV_32F, 0, 1, ksize=3) / 8
L = np.array([-0.70, -0.71])
luz = -(gx * L[0] + gy * L[1])   # >0: degrau virado para a luz
borda = np.clip(np.hypot(gx, gy) * 3.2 * S, 0, 1)
# linha escura fina (a própria borda) + realce claro um pouco para dentro do patamar de cima
esc = cv2.GaussianBlur(np.clip(-luz * 3.2 * S, 0, 1), (0, 0), 0.6 * S) + 0.45 * borda
cla = cv2.GaussianBlur(np.clip(luz * 3.2 * S, 0, 1), (0, 0), 1.0 * S)
bsl = cv2.GaussianBlur(bf, (0, 0), 7 * S)  # sombra macia do degrau (o patamar de baixo escurece junto à parede)
gx2 = cv2.Sobel(bsl, cv2.CV_32F, 1, 0, ksize=3) / 8; gy2 = cv2.Sobel(bsl, cv2.CV_32F, 0, 1, ksize=3) / 8
macio = -(gx2 * L[0] + gy2 * L[1]) * 9 * S
cor = cor * (1 + 0.10 * np.clip(macio, -1, 1))[..., None]
ESC = np.array([60, 90, 20], np.float32)
cor = cor * (1 - 0.55 * np.clip(esc, 0, 1))[..., None] + ESC * (0.55 * np.clip(esc, 0, 1))[..., None] * 0.6
cor = cor + (255 - cor) * (0.42 * np.clip(cla, 0, 1))[..., None]

# ---------- curvas de nível finas dentro das faixas (3 por faixa)
sub = hn * N * 3
fsub = np.abs(sub - np.round(sub))
gsub = np.hypot(*np.gradient(sub)) + 1e-6
linha = np.clip(1 - fsub / (gsub * 0.9 * S), 0, 1)
linha *= (np.round(sub) % 3 != 0)          # as de faixa já têm o terraço
cor = cor * (1 - 0.22 * linha)[..., None]

# ---------- água: azul vivo no centro, bordas mais claras, margem escura, reflexos finos
dd = ddentro / S
c_meio = np.array([30, 143, 224], np.float32); c_borda = np.array([88, 190, 240], np.float32)
t = np.clip(dd / 9, 0, 1)[..., None]
azul = c_borda * (1 - t) + c_meio * t
# linhas finas acompanhando a margem dentro da água (como na referência)
ond = np.abs(np.sin(dd * 0.55)) ; rf = np.clip(1 - ond / 0.18, 0, 1) * (dd > 4) * (dd < 16) * 0.22
azul = azul + (255 - azul) * rf[..., None]
azul = azul * (1 - 0.18 * np.clip(macio, -1, 1) * 0)[..., None]
cor = cor * (1 - agua[..., None]) + azul * agua[..., None]
df = dfora / S
mar = np.exp(-((df - 1.6) / 1.4) ** 2) * (1 - agua)   # margem azul-escura
cor = cor * (1 - 0.75 * mar[..., None]) + np.array([20, 92, 150], np.float32) * (0.75 * mar[..., None])
halo = np.exp(-((df - 5) / 3) ** 2) * (1 - agua) * 0.28  # orla clara azulada no barranco
cor = cor * (1 - halo[..., None]) + np.array([150, 215, 200], np.float32) * halo[..., None]

# ---------- grão do papel
grao = (rng.random((CH, CW)).astype(np.float32) - 0.5)
grao = cv2.GaussianBlur(grao, (0, 0), 0.7) * 10 + (fbm(90 * S, 3, 900) - 0.5) * 8
cor = cor + grao[..., None]
cor8 = np.clip(cor, 0, 255).astype(np.uint8)

folha = np.full((H, W, 3), (253, 253, 250), np.uint8)
gp = (rng.random((H, W)).astype(np.float32) - 0.5) * 4
folha = np.clip(folha + gp[..., None], 0, 255).astype(np.uint8)
folha[MG:MG + CH, MG:MG + CW] = cor8
Image.fromarray(folha).save(OUT + 'mapa.webp', quality=92, method=6)

# ---------- relevo (bump): degraus macios das faixas + curvas finas + rio rebaixado; papel liso
hb = cv2.GaussianBlur(bf / N, (0, 0), 1.3 * S) + 0.004 * linha
hb = hb - 0.18 * cv2.GaussianBlur(agua, (0, 0), 2 * S)
rel = np.full((H, W), 0.2, np.float32)
rel[MG:MG + CH, MG:MG + CW] = 0.25 + 0.6 * hb
Image.fromarray(np.clip(rel * 255, 0, 255).astype(np.uint8)).save(OUT + 'mapa-relevo.webp', quality=92, method=6)
print('ok', W, H)

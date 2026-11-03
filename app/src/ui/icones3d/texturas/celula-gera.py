# Gera as texturas PINTADAS (procedurais) da célula 3D — nada é copiado da referência; ela só serve de olho
# (formas, cores, densidade). Uso: python3 celula-gera.py  (escreve celula-*.webp nesta pasta)
#   celula-parede.webp / celula-piso.webp : citoplasma creme com ruído suave + retículo ciano (fios grossos arredondados,
#                                           com sombra própria, brilho e sombra projetada)
#   celula-funil.webp                      : rede ciano orgânica (esponja) com furos transparentes, para o funil do centríolo
#   celula-membrana.webp / -relevo.webp    : membrana: rede de cordões de um Voronoi esférico (cor + mapa de altura)
import os
import numpy as np, cv2
from scipy.spatial import cKDTree
from PIL import Image

AQUI = os.path.dirname(os.path.abspath(__file__))
rng = np.random.default_rng(7)


def ruido(h, w, escalas=((0.5, 6), (0.3, 14), (0.2, 40)), semente=1):
    """ruído suave (soma de ruídos de valor ampliados), média 0, ~[-1, 1]"""
    r = np.random.default_rng(semente); out = np.zeros((h, w), np.float32)
    for amp, n in escalas:
        g = r.standard_normal((n, max(2, int(n * w / h)))).astype(np.float32)
        out += amp * cv2.resize(g, (w, h), interpolation=cv2.INTER_CUBIC)
    return out / max(1e-6, np.abs(out).max())


_ocupado = {}
def regiao(chave, dentro):
    """tira da região o que outra faixa já ocupa (evita fios sobrepostos que viram manchas)"""
    oc = _ocupado.get(chave)
    if oc is not None: dentro = dentro & ~oc
    _ocupado[chave] = dentro if oc is None else (oc | dentro)
    return dentro


def voronoi_fios(cA, cB, dentro, cw, ch, larg_mundo, px_por_un, semente, wrapA=None):
    """Fios nas bordas de um Voronoi anisotrópico sobre coordenadas locais (cA ao longo, cB através).
    Devolve a máscara (bool) dos fios, incluindo o contorno da região."""
    r = np.random.default_rng(semente)
    a0, a1 = cA[dentro].min() - cw, cA[dentro].max() + cw; b0, b1 = cB[dentro].min() - ch, cB[dentro].max() + ch
    pts = []
    for k, b in enumerate(np.arange(b0, b1, ch)):
        for a in np.arange(a0 + (k % 2) * cw * 0.5, a1, cw):
            pts.append(((a + (r.random() - 0.5) * 0.5 * cw) / cw, (b + (r.random() - 0.5) * 0.45 * ch) / ch))
    pts = np.array(pts); T = cKDTree(pts)
    q = np.stack([cA[dentro] / cw, cB[dentro] / ch], -1)
    _, ii = T.query(q, k=2); p1, p2 = pts[ii[:, 0]], pts[ii[:, 1]]
    n = p2 - p1; nl = np.linalg.norm(n, axis=1, keepdims=True); n = n / nl
    f = np.abs(((q - (p1 + p2) / 2) * n).sum(1))                       # distância à bissetriz no espaço escalado
    escala = np.linalg.norm(n / np.array([cw, ch]), axis=1)            # converte para unidades do mundo
    d = f / escala
    m = np.zeros(dentro.shape, bool); m[dentro] = d < larg_mundo / 2
    # contorno da região também é fio
    borda = cv2.morphologyEx(dentro.astype(np.uint8), cv2.MORPH_GRADIENT, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))) > 0
    k = max(3, int(larg_mundo * px_por_un) | 1)
    borda = cv2.dilate(borda.astype(np.uint8), cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (k, k))) > 0
    return m | (borda & cv2.dilate(dentro.astype(np.uint8), np.ones((3, 3), np.uint8)).astype(bool))


def pinta_fios(base, mask, larg_px, cor, luz=(-0.55, -0.6, 0.58), sombra=(7, 9), sombra_forca=0.28, espec=0.55):
    """Arredonda os fios (fechamento = concordância nas junções), relevo pela distância à borda e sombreamento."""
    k = int(larg_px * 0.7) | 1
    m = cv2.morphologyEx(mask.astype(np.uint8), cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (k, k)))
    m = cv2.GaussianBlur(m.astype(np.float32), (0, 0), 1.2) > 0.5
    dt = cv2.distanceTransform(m.astype(np.uint8), cv2.DIST_L2, 5)
    t = np.clip(dt / (larg_px * 0.5), 0, 1); h = np.sqrt(np.clip(1 - (1 - t) ** 2, 0, 1)) * larg_px * 0.5
    h = cv2.GaussianBlur(h, (0, 0), 1.0)
    gy, gx = np.gradient(h); nz = np.ones_like(h); nn = np.sqrt(gx ** 2 + gy ** 2 + 1)
    nx, ny, nz = -gx / nn, -gy / nn, nz / nn
    L = np.array(luz, np.float32); L /= np.linalg.norm(L)
    dif = np.clip(nx * L[0] + ny * L[1] + nz * L[2], 0, 1)
    Hh = np.array([L[0], L[1], L[2] + 1.0]); Hh /= np.linalg.norm(Hh)
    spec = np.clip(nx * Hh[0] + ny * Hh[1] + nz * Hh[2], 0, 1) ** 40 * espec
    # sombra projetada e oclusão em volta do fio
    sm = np.roll(np.roll(cv2.GaussianBlur(m.astype(np.float32), (0, 0), larg_px * 0.35), sombra[1], 0), sombra[0], 1)
    ao = cv2.GaussianBlur(m.astype(np.float32), (0, 0), larg_px * 0.8)
    out = base * (1 - sombra_forca * sm[..., None]) * (1 - 0.1 * ao[..., None])
    c = np.array(cor, np.float32) / 255
    fio = c * (0.42 + 0.75 * dif[..., None]) + spec[..., None]
    borda = np.clip(t * 3, 0, 1)[..., None]                               # borda do fio um pouco mais escura (antisserrilhado)
    a = cv2.GaussianBlur(m.astype(np.float32), (0, 0), 0.7)[..., None]
    fio = fio * (0.75 + 0.25 * borda)
    return out * (1 - a) + fio * a, m, h


def faixa_polar(S, Y, c, r1, r2, th0, th1, rm):
    dx, dy = S - c[0], Y - c[1]; r = np.hypot(dx, dy); th = np.degrees(np.arctan2(dy, dx))
    return th * np.pi / 180 * rm, r, (th >= th0) & (th <= th1) & (r >= r1(th)) & (r <= r2(th, th * np.pi / 180 * rm))


def faixa_reta(X, Z, p0, p1, curv, b0, b1):
    p0, p1 = np.array(p0), np.array(p1); d = p1 - p0; L = np.linalg.norm(d); u = d / L; n = np.array([-u[1], u[0]])
    rx, rz = X - p0[0], Z - p0[1]; a = rx * u[0] + rz * u[1]; t = np.clip(a / L, 0, 1)
    b = rx * n[0] + rz * n[1] - curv * 4 * t * (1 - t)
    return a, b, (a >= 0) & (a <= L) & (b >= b0) & (b <= b1)


CIANO = (24, 150, 198)


def parede():
    QUAL = 'parede'
    W, H = 2048, 1024; ppu = 1024
    S = ((np.arange(W) + 0.5) / W * 2 - 1)[None, :].repeat(H, 0); Y = (1 - (np.arange(H) + 0.5) / H)[:, None].repeat(W, 1)
    r = np.hypot(S, Y)
    base = np.array([0.89, 0.85, 0.77], np.float32)[None, None, :] * (1 + 0.025 * ruido(H, W, semente=3)[..., None])
    base = base * (1 - 0.16 * np.clip((r - 0.72) / 0.25, 0, 1)[..., None] ** 2)             # sombra perto da membrana
    base = base * (1 - 0.06 * np.exp(-Y / 0.05)[..., None])                                   # junção com o piso
    base = base * (0.94 + 0.08 * np.clip(-S * 0.5 + 0.5, 0, 1)[..., None])                    # luz vinda da esquerda
    wob = 0.012 * ruido(H, W, ((1, 10),), semente=5)
    Sw, Yw = S + wob, Y + 0.6 * wob
    mask = np.zeros((H, W), bool)
    # leque em volta da boca do funil
    a, b, dentro = faixa_polar(Sw, Yw, (-0.70, 0.13), lambda th: 0.125 + 0 * th, lambda th, a: 0.25 + 0 * th, -30, 215, 0.18)
    mask |= voronoi_fios(a, b, regiao(QUAL, dentro), 0.055, 0.06, 0.016, ppu, 3)
    # arco de alças altas em volta do núcleo (topo), alças irregulares
    rr = np.random.default_rng(11); alt = rr.random(64)
    def topo(th, a):  # topo irregular por coluna (alças de alturas diferentes)
        x = (a + 2) / 0.15; j = np.clip(x.astype(int), 0, 63); f = x - np.floor(x)            # alças altas de topo redondo, alturas variadas
        return 0.6 + (0.06 + 0.13 * alt[j]) * np.sqrt(np.clip(np.sin(np.pi * f), 0, 1)) - 0.1 * np.clip((th - 105) / 30, 0, 1) - 0.12 * np.clip((40 - th) / 30, 0, 1)
    a, b, dentro = faixa_polar(Sw, Yw, (-0.02, -0.02), lambda th: 0.5 + 0.0 * th, topo, 10, 122, 0.62)
    mask |= voronoi_fios(a, b, regiao(QUAL, dentro), 0.072, 0.5, 0.018, ppu, 1)
    # lado esquerdo: malha mais miúda descendo até o canto do funil
    a, b, dentro = faixa_polar(Sw, Yw, (-0.02, -0.02), lambda th: 0.47 + 0.1 * np.clip((th - 150) / 25, 0, 1), lambda th, a: 0.84 - 0.06 * np.clip((th - 150) / 25, 0, 1), 122, 176, 0.65)
    mask |= voronoi_fios(a, b, regiao(QUAL, dentro), 0.07, 0.09, 0.017, ppu, 2)
    mask &= r < 0.95
    cor, m, _ = pinta_fios(base, mask, 0.018 * ppu, CIANO)
    return (np.clip(cor, 0, 1) * 255).astype(np.uint8)


def piso():
    QUAL = 'piso'
    W, H = 2048, 1024; ppu = 1024
    Z = (1 - (np.arange(W) + 0.5) / W * 2)[None, :].repeat(H, 0); X = (1 - (np.arange(H) + 0.5) / H)[:, None].repeat(W, 1)
    r = np.hypot(X, Z)
    base = np.array([0.965, 0.95, 0.915], np.float32)[None, None, :] * (1 + 0.018 * ruido(H, W, semente=4)[..., None])
    base = base * (1 - 0.14 * np.clip((r - 0.74) / 0.22, 0, 1)[..., None] ** 2)
    base = base * (1 - 0.08 * np.exp(-X / 0.05)[..., None])
    wob = 0.01 * ruido(H, W, ((1, 10),), semente=6); Xw, Zw = X + wob, Z - 0.7 * wob
    mask = np.zeros((H, W), bool)
    # leque no pé do funil
    a, b, dentro = faixa_polar(Xw, Zw, (0.06, 0.8), lambda th: 0.1 + 0 * th, lambda th, a: 0.19 + 0 * th, -150, 40, 0.15)
    mask |= voronoi_fios(a, b, regiao(QUAL, dentro), 0.055, 0.05, 0.016, ppu, 7)
    # alça longa em volta da base do núcleo, pela frente (uma fileira de laços compridos)
    a, b, dentro = faixa_polar(Xw, Zw, (0.256, 0.183), lambda th: 0.37 + 0 * th, lambda th, a: 0.45 + 0 * th, -70, 75, 0.41)
    mask |= voronoi_fios(a, b, regiao(QUAL, dentro), 0.17, 0.4, 0.017, ppu, 4)
    # escada rumo à direita (uma fileira)
    a, b, dentro = faixa_reta(Xw, Zw, (0.5, 0.2), (0.86, -0.2), 0.03, 0.0, 0.1)
    mask |= voronoi_fios(a, b, regiao(QUAL, dentro), 0.08, 0.3, 0.016, ppu, 5)
    # trama sob o Golgi (duas fileiras)
    a, b, dentro = faixa_reta(Xw, Zw, (0.55, -0.1), (0.3, -0.75), 0.04, -0.03, 0.11)
    mask |= voronoi_fios(a, b, regiao(QUAL, dentro), 0.075, 0.07, 0.016, ppu, 6)
    mask &= r < 0.95
    cor, m, _ = pinta_fios(base, mask, 0.017 * ppu, CIANO, luz=(-0.4, -0.7, 0.6))
    return (np.clip(cor, 0, 1) * 255).astype(np.uint8)


def funil():
    """rede ciano orgânica para o cone do funil: u = volta (repete), v = do bico (0) à boca (1); furos transparentes"""
    W, H = 2048, 512
    U = ((np.arange(W) + 0.5) / W)[None, :].repeat(H, 0); Vv = ((np.arange(H) + 0.5) / H)[:, None].repeat(W, 1)
    wob = 0.012 * ruido(H, W, ((1, 8),), semente=8)
    pts = []; r = np.random.default_rng(9); ncol, nlin = 15, 6
    for j in range(nlin):
        for i in range(ncol):
            pts.append([(i + 0.5 * (j % 2) + (r.random() - 0.5) * 0.6) / ncol, (j + 0.5 + (r.random() - 0.5) * 0.5) / nlin])
    pts = np.array(pts); pts = np.concatenate([pts, pts + [1, 0], pts - [1, 0]])
    asp = H / W * 4  # o cone é mais comprido que a volta: corrige a forma dos furos
    T = cKDTree(pts * [1, asp])
    q = np.stack([(U + wob).ravel(), (Vv + wob).ravel() * asp], -1); d, ii = T.query(q, k=2)
    p1, p2 = pts[ii[:, 0]] * [1, asp], pts[ii[:, 1]] * [1, asp]; n = (p2 - p1); n /= np.linalg.norm(n, axis=1, keepdims=True)
    f = np.abs(((q - (p1 + p2) / 2) * n).sum(1)).reshape(H, W)
    larg = 0.017 * (1 + 0.35 * ruido(H, W, ((1, 12),), semente=10))
    mask = (f < larg * (0.75 + 0.6 * (1 - Vv))) | (Vv > 0.965)
    base = np.zeros((H, W, 3), np.float32)
    cor, m, _ = pinta_fios(base, mask, 34, CIANO, luz=(-0.3, -0.75, 0.6), sombra=(0, 0), sombra_forca=0)
    a = cv2.GaussianBlur(m.astype(np.float32), (0, 0), 0.8)
    rgba = np.dstack([np.clip(cor, 0, 1) * 255, a * 255]).astype(np.uint8)
    return rgba


def membrana():
    """Voronoi esférico: cordões amarelos (com concordância nas junções) sobre alvéolos creme; equirretangular"""
    W, H = 2048, 1024; N = 95
    i = np.arange(N) + 0.5; phi = np.arccos(1 - 2 * i / N); th = np.pi * (1 + 5 ** 0.5) * i
    P = np.stack([np.cos(th) * np.sin(phi), np.cos(phi), np.sin(th) * np.sin(phi)], -1)
    P += rng.normal(0, 0.035, P.shape); P /= np.linalg.norm(P, axis=1, keepdims=True); T = cKDTree(P)
    u = (np.arange(W) + 0.5) / W; v = (np.arange(H) + 0.5) / H; Uu, Vv = np.meshgrid(u, v)
    ph = Uu * 2 * np.pi; tt = Vv * np.pi   # mesma convenção do SphereGeometry do three.js
    D = np.stack([-np.cos(ph) * np.sin(tt), np.cos(tt), np.sin(ph) * np.sin(tt)], -1).reshape(-1, 3)
    D = D + 0.035 * np.stack([np.sin(D[:, 1] * 9 + 1), np.sin(D[:, 2] * 8 + 2), np.sin(D[:, 0] * 10 + 3)], -1); D /= np.linalg.norm(D, axis=1, keepdims=True)
    _, ii = T.query(D, k=4)
    p1 = P[ii[:, 0]]; ds = []
    for k in (1, 2, 3):
        p2 = P[ii[:, k]]; nrm = p2 - p1; L = np.linalg.norm(nrm, axis=1, keepdims=True)
        ds.append(np.abs(((D - (p1 + p2) / 2) * (nrm / L)).sum(1)))
    ds = np.stack(ds, 1); kk = 0.018
    dsm = -kk * np.log(np.exp(-ds / kk).sum(1))            # mínimo suave: cordões se fundem nas junções
    dsm = dsm.reshape(H, W) + 0.012
    larg = 0.092
    t = np.clip(1 - dsm / larg, 0, 1); cord = np.sqrt(np.clip(1 - (1 - t) ** 2, 0, 1))
    d1 = ds.min(1).reshape(H, W)
    alv = np.clip(d1 / 0.12, 0, 1); domo = 0.25 * np.sqrt(alv)   # alvéolo levemente abaulado
    h = np.maximum(cord, domo * (1 - cord))
    h = cv2.GaussianBlur(h.astype(np.float32), (0, 0), 1.2)
    c_cord = np.array([0.96, 0.87, 0.60]); c_alv = np.array([0.94, 0.89, 0.74]); c_pe = np.array([0.80, 0.72, 0.52])
    pe = np.clip(1 - np.abs(cord - 0.12) / 0.12, 0, 1) * (cord < 0.3)     # sombra no pé do cordão
    col = c_alv * (1 - cord[..., None]) + c_cord * cord[..., None]
    col = col * (1 - 0.36 * pe[..., None]) + 0 * c_pe
    topo = np.clip((cord - 0.75) / 0.25, 0, 1) ** 2                        # brilho pintado no alto do cordão
    col = col + 0.07 * topo[..., None]
    lado = np.clip(1 - np.abs(cord - 0.4) / 0.3, 0, 1) * (cord < 0.75)      # flanco do cordão um pouco mais escuro
    col = col * (1 - 0.08 * lado[..., None])
    return (np.clip(col, 0, 1) * 255).astype(np.uint8), (np.clip(h, 0, 1) * 255).astype(np.uint8)


if __name__ == '__main__':
    salva = lambda nome, arr, modo='RGB', **k: Image.fromarray(arr, modo).save(os.path.join(AQUI, nome), quality=90, method=6, **k)
    salva('celula-parede.webp', parede()); print('parede')
    salva('celula-piso.webp', piso()); print('piso')
    salva('celula-funil.webp', funil(), 'RGBA', exact=True); print('funil')
    c, h = membrana(); salva('celula-membrana.webp', c); Image.fromarray(h).convert('RGB').save(os.path.join(AQUI, 'celula-membrana-relevo.webp'), quality=92, method=6); print('membrana')

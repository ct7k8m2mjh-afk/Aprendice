/* eslint-disable */
import { THREE, V, TAU, plast, metal, semente, malha, esfera } from '../base.js';

// =====================================================================================
// GEOGRAFIA — mapa topográfico dobrado em três painéis + bússola dourada + alfinete de mapa.
// Função (docs/pesquisa/animacao-dos-icones.md, 5.1): "orientar e depois localizar", uma vez por ativação.
//  1. Um toque na bússola tira a agulha do lugar: ela faz uma oscilação amortecida (como um pêndulo no campo
//     magnético) e para apontando o N (≈1,3 s).
//  2. Depois, o alfinete cai e espeta o mapa, assenta 2–3 mm e para, sem quicar (≈0,5 s).
// Repouso (e "reduzir movimento"): o estado final, parado — agulha no N, alfinete espetado.

const suave = (a, b, x) => { const k = Math.min(1, Math.max(0, (x - a) / (b - a))); return k * k * (3 - 2 * k); };

// ---------- texturas
// Mapa topográfico procedural em alta resolução (2048 px):
//  relevo suave (ruído com distorção de domínio) rebaixado ao longo dos rios -> quantizado em faixas (curvas de nível)
//  -> cor hipsométrica por faixa (verde escuro nas baixadas, verde-claro, amarelo, laranja nas partes altas)
//  -> degraus suaves entre faixas sombreados com luz do alto à esquerda -> rios largos, sinuosos e ramificados,
//  rebaixados, com margem azul-clara. O mesmo campo de altura vira o bumpMap (os terraços leem em 3D).
const TW = 2048, TH = 1356, MARG = 0.042; // margem branca do papel (fração da largura)
function hash(i, j) { const s = Math.sin(i * 127.1 + j * 311.7) * 43758.5453; return s - Math.floor(s); }
function vruido(u, v) {
  const i = Math.floor(u), j = Math.floor(v), fu = u - i, fv = v - j, su = fu * fu * (3 - 2 * fu), sv = fv * fv * (3 - 2 * fv);
  const a = hash(i, j), b = hash(i + 1, j), c = hash(i, j + 1), d = hash(i + 1, j + 1);
  return (a + (b - a) * su) * (1 - sv) + (c + (d - c) * su) * sv;
}
// rios: pontos de controle em fração da folha (x da esquerda, y do alto), largura em fração da largura
const RIOS = [
  { w: 0.046, p: [[0.55, -0.04], [0.575, 0.1], [0.615, 0.22], [0.575, 0.34], [0.525, 0.45], [0.575, 0.57], [0.655, 0.65], [0.625, 0.78], [0.675, 0.9], [0.66, 1.05]], semente: 1 },
  { w: 0.032, p: [[0.535, 0.44], [0.47, 0.37], [0.425, 0.25], [0.36, 0.17], [0.3, 0.06], [0.235, -0.04]], semente: 2, afina: 0.3 },
  { w: 0.024, p: [[0.61, 0.61], [0.715, 0.555], [0.8, 0.47], [0.875, 0.36], [0.95, 0.3], [1.05, 0.26]], semente: 3, afina: 0.35 },
  { w: 0.016, p: [[0.37, 0.18], [0.27, 0.235], [0.16, 0.205], [0.07, 0.27], [-0.05, 0.24]], semente: 4, afina: 0.3 },
  { w: 0.018, p: [[0.635, 0.77], [0.555, 0.84], [0.48, 0.93], [0.41, 1.05]], semente: 5, afina: 0.3 },
  { w: 0.015, p: [[0.6, 0.2], [0.69, 0.15], [0.79, 0.115], [0.885, 0.045], [0.96, -0.04]], semente: 6, afina: 0.35 },
  { w: 0.012, p: [[0.36, 0.17], [0.33, 0.33], [0.24, 0.42], [0.2, 0.55]], semente: 7, afina: 0.45 },
];
function amostraRio(r) { // Catmull-Rom pelos pontos + meandros perpendiculares + largura variável
  const P = r.p.map(([x, y]) => [x * TW, y * TH]), out = [];
  const n = P.length - 1, PASSOS = 60, s0 = r.semente * 3.7;
  for (let i = 0; i < n; i++) for (let k = 0; k < PASSOS; k++) {
    const t = k / PASSOS, p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(n, i + 2)];
    const cr = (a, b, c, d) => 0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t * t + (-a + 3 * b - 3 * c + d) * t * t * t);
    out.push([cr(p0[0], p1[0], p2[0], p3[0]), cr(p0[1], p1[1], p2[1], p3[1])]);
  }
  out.push(P[n]);
  const res = []; let s = 0;
  for (let i = 0; i < out.length; i++) {
    const a = out[Math.max(0, i - 1)], b = out[Math.min(out.length - 1, i + 1)];
    let tx = b[0] - a[0], ty = b[1] - a[1]; const L = Math.hypot(tx, ty) || 1; tx /= L; ty /= L;
    if (i) s += Math.hypot(out[i][0] - out[i - 1][0], out[i][1] - out[i - 1][1]);
    const q = s / TW, fim = i / (out.length - 1);
    const amp = r.w * TW * 0.55 * Math.min(1, fim * 6); // a junção com o rio-mãe fica no lugar
    const off = amp * (Math.sin(q * 38 + s0) * 0.75 + Math.sin(q * 83 + s0 * 2.1) * 0.35);
    const w = r.w * TW * (1 + 0.16 * Math.sin(q * 29 + s0 * 1.7)) * (1 - (r.afina || 0) * fim);
    res.push([out[i][0] - ty * off, out[i][1] + tx * off, w]);
  }
  return res;
}
function tracaRios(x, rios, larg, cor) {
  x.strokeStyle = cor; x.lineCap = 'round'; x.lineJoin = 'round';
  for (const r of rios) for (let i = 1; i < r.length; i++) {
    x.lineWidth = larg(r[i][2]); x.beginPath(); x.moveTo(r[i - 1][0], r[i - 1][1]); x.lineTo(r[i][0], r[i][1]); x.stroke();
  }
}
function canal(c) { const d = c.getContext('2d').getImageData(0, 0, TW, TH).data, o = new Float32Array(TW * TH); for (let i = 0; i < o.length; i++) o[i] = d[i * 4] / 255; return o; }
function telaRios(rios, larg, blur) {
  const c = document.createElement('canvas'); c.width = TW; c.height = TH; const x = c.getContext('2d');
  x.fillStyle = '#000'; x.fillRect(0, 0, TW, TH);
  if (blur) { const c2 = document.createElement('canvas'); c2.width = TW; c2.height = TH; tracaRios(c2.getContext('2d'), rios, larg, '#fff'); x.filter = `blur(${blur}px)`; x.drawImage(c2, 0, 0); x.filter = 'none'; }
  else tracaRios(x, rios, larg, '#fff');
  return canal(c);
}
// cores hipsométricas por nível (0 = baixada, 1 = topo)
const PALETA = [[0, [58, 138, 56]], [0.16, [86, 160, 58]], [0.3, [118, 178, 56]], [0.42, [150, 194, 64]], [0.52, [188, 204, 72]],
  [0.62, [226, 210, 86]], [0.72, [240, 204, 88]], [0.82, [242, 186, 78]], [0.92, [236, 160, 66]], [1, [226, 136, 58]]];
function corNivel(t) {
  for (let i = 1; i < PALETA.length; i++) if (t <= PALETA[i][0]) {
    const [ta, a] = PALETA[i - 1], [tb, b] = PALETA[i], m = (t - ta) / (tb - ta);
    return [a[0] + (b[0] - a[0]) * m, a[1] + (b[1] - a[1]) * m, a[2] + (b[2] - a[2]) * m];
  }
  return PALETA[PALETA.length - 1][1];
}
function texMapa() {
  const rios = RIOS.map(amostraRio);
  const mRio = telaRios(rios, (w) => w, 1.2);                 // leito (com antisserrilhado)
  const mFundo = telaRios(rios, (w) => w * 0.55, 0.18 * TW * 0.046); // profundidade: 0 na margem, 1 no meio
  const mVale = telaRios(rios, (w) => w * 3.2, 90);            // vale largo: o relevo desce até o rio
  const NB = 17, ST = 3.2, PROF = 7; // nº de faixas, altura do degrau e fundura do rio (em px, para o sombreado)
  const hN = new Float32Array(TW * TH), alt = new Float32Array(TW * TH);
  const esc = 5.2 / TW;
  for (let py = 0; py < TH; py++) for (let px = 0; px < TW; px++) {
    let u = px * esc, v = py * esc;
    const wu = vruido(u * 0.8 + 3.1, v * 0.8 + 1.7), wv = vruido(u * 0.8 + 7.3, v * 0.8 + 5.2); u += wu * 1.3; v += wv * 1.3;
    let h = vruido(u, v) * 0.52 + vruido(u * 2.03 + 11, v * 2.03) * 0.27 + vruido(u * 4.1, v * 4.1 + 23) * 0.13;
    h += (vruido(u * 9.3 + 5, v * 9.3) - 0.5) * 0.09 + (vruido(u * 19 + 2, v * 19 + 9) - 0.5) * 0.035; // contornos recortados
    const i = py * TW + px, vale = mVale[i];
    h = (h - 0.18) * 1.55 * (1 - 0.62 * Math.min(1, vale * 1.6)) + 0.04 + 0.05 * (1 - vale);
    hN[i] = Math.min(0.999, Math.max(0, h));
  }
  // terraços: altura constante na faixa, subida suave só junto à borda de cima (degrau macio)
  for (let i = 0; i < hN.length; i++) {
    const f = hN[i] * NB, k = Math.floor(f), m = f - k, e = Math.min(1, Math.max(0, (m - 0.78) / 0.22));
    alt[i] = (k + e * e * (3 - 2 * e)) * ST - mRio[i] * (2 + PROF * mFundo[i]);
  }
  const c = document.createElement('canvas'); c.width = TW; c.height = TH; const x = c.getContext('2d');
  const im = x.createImageData(TW, TH), d = im.data;
  const cb = document.createElement('canvas'); cb.width = TW; cb.height = TH; const xb = cb.getContext('2d');
  const ib = xb.createImageData(TW, TH), db = ib.data;
  const L = [-0.55, -0.68, 0.9], Ln = Math.hypot(...L); L[0] /= Ln; L[1] /= Ln; L[2] /= Ln;
  const mx = MARG * TW, papel = [248, 246, 240];
  const cAgua = [28, 158, 226], cMargem = [118, 206, 246], cFundo = [22, 140, 214];
  for (let py = 0; py < TH; py++) for (let px = 0; px < TW; px++) {
    const i = py * TW + px, o = i * 4;
    const xa = Math.max(0, px - 1), xc = Math.min(TW - 1, px + 1), ya = Math.max(0, py - 1), yc = Math.min(TH - 1, py + 1);
    const gx = (alt[py * TW + xc] - alt[py * TW + xa]) / 2, gy = (alt[yc * TW + px] - alt[ya * TW + px]) / 2;
    const nn = Math.hypot(gx, gy, 1), luz = (-gx * L[0] - gy * L[1] + L[2]) / nn / L[2];
    const sh = Math.min(1.3, Math.max(0.55, 0.35 + 0.65 * luz));
    const f = hN[i] * NB, k = Math.floor(f), m = f - k;
    let cor = corNivel((k + 0.5) / NB);
    const clr = 0.96 + 0.06 * m; // leve gradiente dentro da faixa
    const linha = 1 - 0.16 * Math.max(0, 1 - Math.abs(m - 0.86) / 0.1); // traço fino da curva de nível
    let r = cor[0] * clr * linha, g = cor[1] * clr * linha, b = cor[2] * clr * linha;
    const a = mRio[i];
    if (a > 0) { // água: margem clara, meio vivo, faixa mais funda
      const fu = Math.min(1, mFundo[i] * 1.6), t1 = Math.min(1, fu * 2.2);
      const wr = cMargem[0] + (cAgua[0] - cMargem[0]) * t1 + (cFundo[0] - cAgua[0]) * Math.max(0, fu - 0.6);
      const wg = cMargem[1] + (cAgua[1] - cMargem[1]) * t1 + (cFundo[1] - cAgua[1]) * Math.max(0, fu - 0.6);
      const wb = cMargem[2] + (cAgua[2] - cMargem[2]) * t1 + (cFundo[2] - cAgua[2]) * Math.max(0, fu - 0.6);
      r += (wr - r) * a; g += (wg - g) * a; b += (wb - b) * a;
    }
    r *= sh; g *= sh; b *= sh;
    // papel: margem branca (borda interna levemente sombreada)
    const db0 = Math.min(px, py, TW - 1 - px, TH - 1 - py);
    let gb = Math.min(255, Math.max(0, 70 + alt[i] * 2.4));
    if (db0 < mx) { r = papel[0]; g = papel[1]; b = papel[2]; gb = 40; }
    else if (db0 < mx + 6) { const q = 0.9 + 0.1 * (db0 - mx) / 6; r *= q; g *= q; b *= q; }
    d[o] = r; d[o + 1] = g; d[o + 2] = b; d[o + 3] = 255;
    db[o] = db[o + 1] = db[o + 2] = gb; db[o + 3] = 255;
  }
  x.putImageData(im, 0, 0); xb.putImageData(ib, 0, 0);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  const tb = new THREE.CanvasTexture(cb); tb.anisotropy = 8;
  return { cor: t, relevo: tb };
}
function texFace() {
  const c = document.createElement('canvas'); c.width = c.height = 512; const x = c.getContext('2d');
  const gr = x.createRadialGradient(256, 236, 60, 256, 256, 256); gr.addColorStop(0, '#ffffff'); gr.addColorStop(0.8, '#f5f4f0'); gr.addColorStop(1, '#d9d6cf');
  x.fillStyle = gr; x.fillRect(0, 0, 512, 512);
  x.strokeStyle = 'rgba(60,60,60,.35)'; x.lineWidth = 2; x.beginPath(); x.moveTo(256, 60); x.lineTo(256, 452); x.moveTo(60, 256); x.lineTo(452, 256); x.stroke();
  x.strokeStyle = '#333'; for (let i = 0; i < 12; i++) { if (i % 3 === 0) continue; const a = i / 12 * TAU; x.lineWidth = 5; x.beginPath(); x.moveTo(256 + Math.sin(a) * 214, 256 - Math.cos(a) * 214); x.lineTo(256 + Math.sin(a) * 244, 256 - Math.cos(a) * 244); x.stroke(); }
  x.fillStyle = '#0d0d0d'; x.font = 'bold 76px "Helvetica Neue", Arial, "DejaVu Sans", sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle';
  x.strokeStyle = '#0d0d0d'; x.lineWidth = 6; x.lineJoin = 'round';
  [['N', 0], ['L', 1], ['S', 2], ['O', 3]].forEach(([l, k]) => { const a = k * Math.PI / 2; x.fillText(l, 256 + Math.sin(a) * 182, 262 - Math.cos(a) * 182); x.strokeText(l, 256 + Math.sin(a) * 182, 262 - Math.cos(a) * 182); });
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t;
}

// metade da agulha: losango com aresta central elevada (duas facetas, uma clara e outra escura)
function meiaAgulha(cor, comp, larg, alt) {
  const p = [0, comp, 0, -larg, 0, 0, 0, 0, alt, 0, comp, 0, 0, 0, alt, larg, 0, 0];
  const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.Float32BufferAttribute(p, 3)); geo.computeVertexNormals();
  const cl = new THREE.Color(cor), es = cl.clone().multiplyScalar(0.72);
  const cs = []; for (let i = 0; i < 3; i++) cs.push(cl.r, cl.g, cl.b); for (let i = 0; i < 3; i++) cs.push(es.r, es.g, es.b);
  geo.setAttribute('color', new THREE.Float32BufferAttribute(cs, 3));
  return malha(geo, plast(0xffffff, { vcores: true, rug: 0.3, coat: 1, coatRug: 0.1 }), false);
}

export default function bussola() {
  const g = new THREE.Group();

  // ---------- mapa: folha em três painéis (dobras em sanfona), inclinada para trás, apoiada no chão
  const MW = 3.7, MH = 2.45, MAPA_INC = 0.78; // inclinação: 0 = em pé, PI/2 = deitado
  const dobra = (u) => { // u em [-MW/2, MW/2] -> afastamento z (para a câmera)
    const a = -MW / 2, b = -0.55, c2 = 0.45, d = MW / 2;
    if (u < b) return 0.6 * (u - a) / (b - a);
    if (u < c2) return 0.6 * (1 - (u - b) / (c2 - b)) + 0.04;
    return 0.04 + 0.4 * (u - c2) / (d - c2);
  };
  const geoM = new THREE.PlaneGeometry(MW, MH, 74, 6); const pos = geoM.attributes.position;
  for (let i = 0; i < pos.count; i++) { const u = pos.getX(i), v = pos.getY(i); pos.setZ(i, dobra(u) + 0.03 * Math.sin((v / MH + 0.5) * Math.PI) * Math.cos(u * 2)); }
  geoM.computeVertexNormals();
  const mapa = new THREE.Group(); mapa.rotation.x = -MAPA_INC; mapa.position.set(0.12, Math.sin(Math.PI / 2 - MAPA_INC) * MH / 2 + 0.02, -0.45 - Math.cos(Math.PI / 2 - MAPA_INC) * MH / 2);
  const tm = texMapa();
  mapa.add(malha(geoM, plast(0xb4b4b4, { map: tm.cor, bump: tm.relevo, bumpE: 1.2, rug: 0.82, coat: 0, metal: 0 })));
  mapa.add(malha(geoM, plast(0xf4f2ea, { rug: 0.8, coat: 0, lado: THREE.BackSide })));
  g.add(mapa);

  // ---------- bússola dourada em pé, levemente reclinada, de frente para a câmera
  const R = 0.66;
  const B = new THREE.Group(); B.position.set(-0.3, R + 0.02, 0.3); B.rotation.set(-0.2, 0.12, 0); g.add(B);
  const ouro = plast(0xf6c445, { metal: 0.85, rug: 0.25, coat: 0.7, coatRug: 0.1 });
  const ouroEsc = plast(0xb27a1c, { metal: 1, rug: 0.3, coat: 0.3 });
  const caixa = malha(new THREE.CylinderGeometry(R - 0.02, R - 0.05, 0.22, 72), ouroEsc); caixa.rotation.x = Math.PI / 2; caixa.position.z = -0.1; caixa.castShadow = false; B.add(caixa);
  const aro = malha(new THREE.TorusGeometry(R - 0.065, 0.065, 20, 80), ouro); aro.position.z = 0.03; B.add(aro);
  const aro2 = malha(new THREE.TorusGeometry(R - 0.135, 0.018, 10, 80), ouro); aro2.position.z = 0.02; B.add(aro2);
  const face = malha(new THREE.CircleGeometry(R - 0.13, 72), plast(0xffffff, { map: texFace(), rug: 0.55, coat: 0.1 }), false); face.position.z = 0.02; B.add(face);
  // argola e pino de corda no topo
  const haste = malha(new THREE.CylinderGeometry(0.07, 0.085, 0.16, 24), ouro); haste.position.y = R + 0.06; B.add(haste);
  const coroa = malha(new THREE.CylinderGeometry(0.1, 0.1, 0.06, 24), ouroEsc); coroa.position.y = R + 0.15; B.add(coroa);
  const argola = malha(new THREE.TorusGeometry(0.19, 0.032, 14, 48), ouro); argola.position.set(0, R + 0.37, -0.02); B.add(argola);
  // agulha (vermelha = norte) e pivô
  const agulha = new THREE.Group(); agulha.position.z = 0.04; B.add(agulha);
  agulha.add(meiaAgulha(0xe0261f, 0.42, 0.11, 0.035));
  const sul = meiaAgulha(0x1f63d9, 0.42, 0.11, 0.035); sul.rotation.z = Math.PI; agulha.add(sul);
  const pivo = esfera(0.065, ouro, 24); pivo.scale.set(1, 1, 0.6); pivo.position.z = 0.04; agulha.add(pivo);
  const pivoAnel = malha(new THREE.TorusGeometry(0.06, 0.012, 8, 24), ouroEsc); pivoAnel.position.z = 0.04; agulha.add(pivoAnel);
  const vidro = malha(new THREE.CircleGeometry(R - 0.13, 64), new THREE.MeshPhysicalMaterial({ color: 0xffffff, transparent: true, opacity: 0.08, roughness: 0.02, clearcoat: 1, metalness: 0 }), false); vidro.position.z = 0.09; B.add(vidro);

  // a bússola não projeta sombra no chão (ficava uma elipse dura na frente); no lugar, sombra de contato suave sob a borda
  B.traverse((o) => { if (o.isMesh) o.castShadow = false; });
  const sc = document.createElement('canvas'); sc.width = 128; sc.height = 64; const sx = sc.getContext('2d');
  const sg = sx.createRadialGradient(64, 32, 2, 64, 32, 62); sg.addColorStop(0, 'rgba(0,0,0,.55)'); sg.addColorStop(1, 'rgba(0,0,0,0)');
  sx.setTransform(1, 0, 0, 0.5, 0, 16); sx.fillStyle = sg; sx.fillRect(0, 0, 128, 128);
  const contato = new THREE.Mesh(new THREE.PlaneGeometry(1.7, 0.55), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(sc), transparent: true, depthWrite: false, opacity: 0.55 }));
  contato.rotation.x = -Math.PI / 2; contato.position.set(-0.26, 0.004, 0.42); g.add(contato);
  // ---------- alfinete de mapa (marcador): cabeça redonda com centro branco, ponta cônica; espetado no mapa
  const pinM = plast(0xe3231f, { rug: 0.2, coat: 1, coatRug: 0.06 });
  const pin = new THREE.Group(); pin.scale.setScalar(0.9); g.add(pin);
  const RC = 0.34, HP = 1.0; // raio da cabeça e altura da ponta ao centro da cabeça
  const perfil = []; const ang = Math.asin(RC / HP); // cone tangente à esfera
  perfil.push(new THREE.Vector2(0.0005, 0));
  const yT = HP - RC * Math.sin(ang), rT = RC * Math.cos(ang);
  for (let i = 1; i <= 10; i++) { const t = i / 10; perfil.push(new THREE.Vector2(rT * t, yT * t)); }
  for (let i = 1; i <= 24; i++) { const a = -ang + (Math.PI / 2 + ang) * i / 24; perfil.push(new THREE.Vector2(Math.max(0.0005, RC * Math.cos(a)), HP + RC * Math.sin(a))); }
  const corpoPin = malha(new THREE.LatheGeometry(perfil, 48), pinM); corpoPin.scale.z = 0.62; pin.add(corpoPin);
  const miolo = esfera(0.16, plast(0xf7f7f7, { rug: 0.35, coat: 0.5 }), 32); miolo.scale.set(1, 1, 0.45); miolo.position.set(0, HP, RC * 0.62 - 0.03); pin.add(miolo);
  // ponto marcado no papel (anel claro sob a ponta)
  const marca = malha(new THREE.CircleGeometry(0.14, 32), new THREE.MeshStandardMaterial({ color: 0xf3f1ea, roughness: 0.8, transparent: true, opacity: 0.9 }), false);
  marca.position.set(0.95, 0.55, 0.0); marca.position.z = 0; // ajustado abaixo
  const ptMapa = (u, v) => { const p = V(u, v, dobra(u) + 0.03 * Math.sin((v / MH + 0.5) * Math.PI) * Math.cos(u * 2)); mapa.updateMatrix(); return p.applyMatrix4(mapa.matrix); };
  const ponta = ptMapa(0.78, 0.36);
  marca.position.copy(V(0.78, 0.36, dobra(0.78) + 0.006)); mapa.add(marca);
  const PEN = 0.05; // quanto a ponta entra no papel
  const yFinal = ponta.y - PEN; pin.position.set(ponta.x, yFinal, ponta.z);

  // ---------- animação (uma vez por ativação)
  const A0 = 0.95, GAMA = 2.6, OMEGA = 8.5, T_AG = 1.35, T_QUEDA = 1.4, H_PIN = 0.35, T_CAI = 0.22;
  let t0 = null, ativoAnt = false, angAtual = 0, yAtual = yFinal;
  function agulhaEm(tau) { // toque: velocidade inicial, oscilação amortecida; termina exatamente no N
    return A0 * Math.exp(-GAMA * tau) * Math.sin(OMEGA * tau) * (1 - suave(T_AG - 0.25, T_AG, tau));
  }
  function pinoEm(tau) {
    if (tau < 0.3) return yFinal + PEN + H_PIN * suave(0, 0.3, tau);          // é tirado do mapa (junto com o toque)
    if (tau < T_QUEDA) return yFinal + PEN + H_PIN;                              // espera a agulha assentar
    const q = tau - T_QUEDA;
    if (q < T_CAI) return yFinal + PEN + H_PIN * (1 - (q / T_CAI) ** 2);         // cai acelerando
    return yFinal + PEN * (1 - suave(0, 0.12, q - T_CAI));                       // espeta e assenta, sem quique
  }
  return {
    grupo: g, camera: { pos: V(0, 2.85, 9.0), alvo: V(0, 0.98, 0), fov: 25 },
    animar(t, ativo, dt) {
      if (ativo && !ativoAnt) t0 = t; ativoAnt = ativo;
      if (ativo && t0 != null) { const tau = t - t0; angAtual = agulhaEm(tau); yAtual = pinoEm(tau); }
      else { const k = Math.min(1, dt * 14); angAtual += (0 - angAtual) * k; yAtual += (yFinal - yAtual) * k; } // ao sair: estado final em ~250 ms
      agulha.rotation.z = angAtual; pin.position.y = yAtual;
    },
  };
}

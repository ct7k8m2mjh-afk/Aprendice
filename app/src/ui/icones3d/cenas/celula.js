/* eslint-disable */
import { THREE, V, TAU, plast, semente, malha, esfera } from '../base.js';
import { mergeGeometries, mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';
const suave = (geo) => { geo.deleteAttribute('normal'); geo.deleteAttribute('uv'); const m = mergeVertices(geo, 1e-5); m.computeVertexNormals(); return m; }; // extrusões com sombreamento liso

// =====================================================================================
// BIOLOGIA — célula animal em corte (referência aprovada: docs/referencias/icones3d/celula.png).
// Corte: UM QUARTO do volume removido (a metade de cima da frente): uma parede vertical (meio disco, plano x=0)
// e o piso (meio disco, plano y=0); a membrana é grossa, creme, com cristas arredondadas em rede sobre alvéolos
// mais claros e borda arredondada no corte. Núcleo apoiado no piso, com um oitavo removido (envoltório vermelho,
// camada creme com cromossomos roxos, nucleoplasma vermelho-escuro com grânulos). Retículo (rede ciano) na parede e
// no piso; retículo rugoso (sacos laranja) abraçando o núcleo; Golgi azul dobrado; mitocôndrias roxas abertas com
// cristas; retículo liso magenta no alto da parede; centríolos dourados num funil de rede ciano; ribossomos.
// Função: vesículas saem do Golgi rumo à membrana; mitocôndrias pulsam (energia).
// Coordenadas internas: centro da célula na origem, raio 1; quarto removido em x>0 e y>0.
// Parede: ponto (s, y) -> (0, y, -s) [s cresce para a direita da imagem]; piso: (x, z) -> (x, 0, z).

const Wp = (s, y, h = 0) => V(h, y, -s);
const Fp = (x, z, h = 0) => V(x, h, z);

// ---------- membrana: rede de cristas (Worley 3D no sombreador; relevo no vértice + normal analítica no pixel)
const ESC = 2.55, AMP = 0.065, T0 = '0.52', T1 = '0.86';
const GLSL_CRISTA = `
vec3 hshC(vec3 p){ p=fract(p*vec3(.1031,.1030,.0973)); p+=dot(p,p.yxz+33.33); return fract((p.xxy+p.yxx)*p.zyx); }
float crista(vec3 q, out vec3 grad){
  q += 0.1*vec3(sin(q.y*2.1+1.3), sin(q.z*2.3+2.1), sin(q.x*1.9+0.7));
  vec3 i=floor(q), f=fract(q); float d1=9., d2=9.; vec3 r1=vec3(1.), r2=vec3(1.);
  for(int z=-1;z<=1;z++) for(int y=-1;y<=1;y++) for(int x=-1;x<=1;x++){
    vec3 g=vec3(float(x),float(y),float(z)); vec3 r=g+0.08+0.84*hshC(i+g)-f; float d=dot(r,r);
    if(d<d1){ d2=d1; r2=r1; d1=d; r1=r; } else if(d<d2){ d2=d; r2=r; } }
  d1=sqrt(d1); d2=max(sqrt(d2),1e-4); d1=max(d1,1e-4);
  float t=d1/d2; float u=clamp((t-${T0})/(${T1}-${T0}),0.,1.); float h=u*u*(3.-2.*u); // alvéolo arredondado (t pequeno) -> crista (t~1)
  vec3 gt=(-r1*(d2/d1)+r2*(d1/d2))/(d2*d2);
  grad=(6.*u*(1.-u)/(${T1}-${T0}))*gt;
  return h;
}`;
function materialMembrana() {
  const m = plast(0xffffff, { rug: 0.8, coat: 0.0 }); m.specularIntensity = 0.35;
  m.onBeforeCompile = (sh) => {
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', `#include <common>\nvarying vec3 vOP; varying vec3 vNX; varying vec3 vNY; varying vec3 vNZ;\n${GLSL_CRISTA}`)
      .replace('#include <begin_vertex>', `#include <begin_vertex>\n vOP = position; { vec3 gq; float hv = crista(normalize(position)*${ESC.toFixed(2)}, gq); transformed += normalize(position)*${(AMP * 0.6).toFixed(3)}*hv; }
 vNX = normalize(normalMatrix*vec3(1.,0.,0.)); vNY = normalize(normalMatrix*vec3(0.,1.,0.)); vNZ = normalize(normalMatrix*vec3(0.,0.,1.));`);
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', `#include <common>\nvarying vec3 vOP; varying vec3 vNX; varying vec3 vNY; varying vec3 vNZ;\n${GLSL_CRISTA}`)
      .replace('#include <color_fragment>', `#include <color_fragment>
 vec3 ddM = normalize(vOP); vec3 gqM; float hM = crista(ddM*${ESC.toFixed(2)}, gqM);
 diffuseColor.rgb *= mix(vec3(0.62,0.54,0.38), vec3(0.86,0.65,0.27), smoothstep(0.0,0.45,hM));`)
      .replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>
 { vec3 gp = ${ESC.toFixed(2)}*(gqM - dot(gqM,ddM)*ddM); vec3 nO = normalize(ddM - ${AMP.toFixed(3)}*gp);
   normal = normalize(vNX*nO.x + vNY*nO.y + vNZ*nO.z); }`)
      .replace('#include <clearcoat_normal_fragment_begin>', '#include <clearcoat_normal_fragment_begin>\n#ifdef USE_CLEARCOAT\n clearcoatNormal = normal;\n#endif');
    if (typeof location !== 'undefined' && location.search.includes('dbg=2')) sh.fragmentShader = sh.fragmentShader.replace('#include <dithering_fragment>', '#include <dithering_fragment>\n gl_FragColor = vec4(clamp(hM,0.,1.), 0.5+0.5*normal.y, 0.5+0.5*normal.z, 1.);');
  };
  return m;
}

// ---------- utilidades
function tubos(curvas, raio, segPor = 6, radial = 6) { // várias curvas -> uma só malha
  const gs = curvas.map(([c, fechada, n]) => new THREE.TubeGeometry(c, Math.max(8, n * segPor), raio, radial, fechada));
  const g = mergeGeometries(gs); gs.forEach((x) => x.dispose()); return g;
}
// faixa de alvéolos ao longo de uma curva 2D: devolve laços fechados (pontos 2D) — rede do retículo
function faixa(rnd, curva, nCol, linhas, o = {}) {
  const amp = o.amp ?? 0.012, irreg = o.irreg ?? 0, ins = o.ins ?? 0.006;
  const fase = linhas.map(() => [rnd() * TAU, rnd() * TAU]);
  const vb = (k, t) => linhas[k] + amp * (Math.sin(t * 9 + fase[k][0]) + 0.6 * Math.sin(t * 23 + fase[k][1]));
  const P = (t, v) => { const [p, n] = curva(t); return [p[0] + n[0] * v, p[1] + n[1] * v]; };
  const lacos = [];
  for (let k = 0; k < linhas.length - 1; k++) {
    const nc = Math.round(nCol * (o.colFator ? o.colFator(k) : 1)); const off = (k % 2) * 0.5;
    const tb = []; for (let j = 0; j <= nc; j++) tb.push(Math.min(1, Math.max(0, (j - off + (j > 0 && j < nc ? (rnd() - 0.5) * 0.5 : 0)) / (nc - off))));
    for (let j = 0; j < nc; j++) {
      const a = tb[j], b = tb[j + 1]; if (b - a < 0.25 / nc) continue;
      if (o.pula && o.pula(k, (a + b) / 2)) continue;
      const topo = k === linhas.length - 2 ? irreg * (rnd() - 0.3) : 0;
      const pts = [];
      const nb = 3; for (let i = 0; i < nb; i++) { const t = a + (b - a) * (0.2 + 0.6 * i / (nb - 1)); pts.push(P(t, vb(k, t))); }
      const h0 = vb(k + 1, b) + topo - vb(k, b); const nv = Math.max(2, Math.round(Math.abs(h0) / 0.07));
      for (let i = 0; i < nv; i++) { const f = 0.15 + 0.7 * i / Math.max(1, nv - 1); pts.push(P(b, vb(k, b) + (vb(k + 1, b) + topo - vb(k, b)) * f)); }
      for (let i = 0; i < nb; i++) { const t = b - (b - a) * (0.2 + 0.6 * i / (nb - 1)); pts.push(P(t, vb(k + 1, t) + topo)); }
      for (let i = 0; i < nv; i++) { const f = 0.85 - 0.7 * i / Math.max(1, nv - 1); pts.push(P(a, vb(k, a) + (vb(k + 1, a) + topo - vb(k, a)) * f)); }
      const cx = pts.reduce((s, p) => s + p[0], 0) / pts.length, cy = pts.reduce((s, p) => s + p[1], 0) / pts.length;
      lacos.push(pts.map(([x, y]) => { const dx = cx - x, dy = cy - y, d = Math.hypot(dx, dy) || 1; return [x + dx / d * ins, y + dy / d * ins]; }));
    }
  }
  return lacos;
}
const arco = (cx, cy, r, a0, a1) => (t) => { const a = a0 + (a1 - a0) * t; return [[cx + Math.cos(a) * r, cy + Math.sin(a) * r], [Math.cos(a), Math.sin(a)]]; };
const reta = (x0, y0, x1, y1, curv = 0) => (t) => { const dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy); const nx = -dy / L, ny = dx / L; const b = curv * 4 * t * (1 - t), db = curv * 4 * (1 - 2 * t);
  const tx = dx / L + nx * db / L, ty = dy / L + ny * db / L, tl = Math.hypot(tx, ty); return [[x0 + dx * t + nx * b, y0 + dy * t + ny * b], [-ty / tl, tx / tl]]; };

// textura de rede ciano (Voronoi, fundo transparente) para o funil do centríolo
function texRede(w, h, celX, celY, larg, cor) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d'); const im = x.createImageData(w, h);
  const rnd = semente(31); const gx = Math.round(w / celX), gy = Math.round(h / celY); const pt = [];
  for (let j = 0; j < gy; j++) for (let i = 0; i < gx; i++) pt.push([(i + 0.15 + 0.7 * rnd()) * celX, (j + 0.15 + 0.7 * rnd()) * celY]);
  const [cr, cg, cb] = cor;
  for (let py = 0; py < h; py++) for (let px = 0; px < w; px++) {
    let d1 = 1e9, d2 = 1e9; const ci = Math.floor(px / celX), cj = Math.floor(py / celY);
    for (let dj = -1; dj <= 1; dj++) for (let di = -1; di <= 1; di++) { const ii = (ci + di + gx) % gx, jj = cj + dj; if (jj < 0 || jj >= gy) continue; const p = pt[jj * gx + ii];
      let dx = Math.abs(p[0] - px); dx = Math.min(dx, w - dx); const d = Math.hypot(dx, p[1] - py); if (d < d1) { d2 = d1; d1 = d; } else if (d < d2) d2 = d; }
    const e = d2 - d1; const a = 1 - Math.min(1, Math.max(0, (e - larg) / 2)); const k = (py * w + px) * 4;
    const sh = 0.75 + 0.25 * Math.min(1, e / larg); im.data[k] = cr * sh; im.data[k + 1] = cg * sh; im.data[k + 2] = cb * sh; im.data[k + 3] = a * 255;
  }
  x.putImageData(im, 0, 0); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = THREE.RepeatWrapping; return t;
}
// cristas da mitocôndria: dedos lilases dobrados sobre fundo roxo escuro (cor + relevo)
function texCristas() { // labirinto de dobras lilases (cristas) com sulcos roxos escuros
  const W = 512, H = 256, c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d'); const im = x.createImageData(W, H);
  for (let py = 0; py < H; py++) for (let px = 0; px < W; px++) {
    const wx = px + 14 * Math.sin(py * 0.045 + 1.3 * Math.sin(px * 0.03)), wy = py + 14 * Math.sin(px * 0.05 + 0.8);
    const v = Math.sin(wx * 0.11 + 1.6 * Math.sin(wy * 0.06)) + 0.8 * Math.sin(wy * 0.13 + 1.4 * Math.sin(wx * 0.045 + 2));
    const t = Math.min(1, Math.max(0, (v + 0.2) / 0.7)); const k = (py * W + px) * 4;
    im.data[k] = 72 + t * 95; im.data[k + 1] = 18 + t * 92; im.data[k + 2] = 118 + t * 105; im.data[k + 3] = 255; }
  x.putImageData(im, 0, 0); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
function contornoFeijao(L, Wd, n = 48, curva = 0.1) {
  const pts = []; for (let i = 0; i < n; i++) { const t = i / n * TAU; const c = Math.cos(t), s = Math.sin(t);
    pts.push(new THREE.Vector2(L / 2 * Math.sign(c) * Math.pow(Math.abs(c), 0.8), Wd / 2 * Math.sign(s) * Math.pow(Math.abs(s), 0.8) - curva * Wd * c * c)); }
  return pts;
}
// mitocôndria aberta (corte): parede roxa em forma de feijão + fundo de cristas. Eixo local: comprimento X, largura Z, altura Y.
function mitocondria(L, Wd, alt, mats) {
  const g = new THREE.Group();
  const ext = contornoFeijao(L, Wd), int = ext.map((p) => p.clone().multiply(new THREE.Vector2(1 - 0.024 / L, 1 - 0.024 / Wd)).add(new THREE.Vector2(0, 0.0)));
  const forma = new THREE.Shape(ext); forma.holes.push(new THREE.Path(int.slice().reverse()));
  const pg = suave(new THREE.ExtrudeGeometry(forma, { depth: alt, bevelEnabled: true, bevelThickness: 0.006, bevelSize: 0.006, bevelSegments: 3, curveSegments: 6 }));
  const parede = malha(pg, mats.parede); parede.rotation.x = -Math.PI / 2; g.add(parede);
  const fg = new THREE.ShapeGeometry(new THREE.Shape(int)); const uv = fg.attributes.uv, pp = fg.attributes.position;
  for (let i = 0; i < uv.count; i++) uv.setXY(i, pp.getX(i) / L + 0.5, pp.getY(i) / Wd + 0.5);
  const fundo = malha(fg, mats.fundo); fundo.rotation.x = -Math.PI / 2; fundo.position.y = alt * 0.45; g.add(fundo);
  g.userData.fundo = fundo; return g;
}
// cadeia grossa dobrada (Golgi): caminho 2D -> contorno espesso -> extrusão com chanfro arredondado
function fitaGrossa(caminho, larg, prof, mat) {
  const esq = [], dir = [];
  for (let i = 0; i < caminho.length; i++) { const a = caminho[Math.max(0, i - 1)], b = caminho[Math.min(caminho.length - 1, i + 1)];
    const tx = b[0] - a[0], ty = b[1] - a[1], l = Math.hypot(tx, ty) || 1; const nx = -ty / l, ny = tx / l;
    esq.push(new THREE.Vector2(caminho[i][0] + nx * larg / 2, caminho[i][1] + ny * larg / 2)); dir.push(new THREE.Vector2(caminho[i][0] - nx * larg / 2, caminho[i][1] - ny * larg / 2)); }
  const forma = new THREE.Shape(esq.concat(dir.reverse()));
  return malha(new THREE.ExtrudeGeometry(forma, { depth: prof, bevelEnabled: true, bevelThickness: 0.016, bevelSize: 0.012, bevelSegments: 5, curveSegments: 4 }), mat);
}
function meandro(alturas, passo, base) { // pernas verticais com voltas arredondadas (grampos para cima, U embaixo)
  const pts = []; let x = 0; const semi = (cx, cy, r, de, ate) => { for (let i = 0; i <= 10; i++) { const a = de + (ate - de) * i / 10; pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); } };
  pts.push([0, base]);
  alturas.forEach((h, k) => {
    semi(x + passo / 2, h, passo / 2, Math.PI, 0); // grampo em cima
    if (k < alturas.length - 1) semi(x + passo * 1.5, base + passo / 2, passo / 2, Math.PI, TAU); // U embaixo
    x += passo * 2;
  });
  pts.push([x - passo, base]); return pts;
}

export default function celula() {
  let rnd = semente(11);
  const g = new THREE.Group(); const C = new THREE.Group(); C.position.y = 1.0; g.add(C);
  const R = 1.0, RB = 0.96, rb = 0.046; // raio externo; borda do corte (tubo) e raio do tubo

  // ---- membrana: metade de baixo inteira + metade de cima de trás (x<0)
  const memM = materialMembrana(); if (typeof location !== 'undefined' && location.search.includes('dbg=1')) memM.onBeforeCompile = () => {};
  C.add(malha(new THREE.SphereGeometry(R * 0.985, 220, 72, -Math.PI / 2, Math.PI, 0, Math.PI / 2), memM));
  C.add(malha(new THREE.SphereGeometry(R * 0.985, 320, 80, 0, TAU, Math.PI / 2, Math.PI / 2), memM));
  // borda arredondada do corte: arco da parede (plano x=0) e arco do piso (y=0, x>0)
  const bordaM = plast(0xdcc27c, { rug: 0.7, coat: 0.1, coatRug: 0.4 });
  const c3 = (fn) => { const cur = new THREE.Curve(); cur.getPoint = (t, alvo = new THREE.Vector3()) => alvo.copy(fn(t)); return cur; };
  const cParede = c3((t) => { const a = Math.PI * t; return V(0, Math.sin(a) * RB, Math.cos(a) * RB); });
  const cPiso = c3((t) => { const a = Math.PI * t - Math.PI / 2; return V(Math.cos(a) * RB, 0, -Math.sin(a) * RB); });
  C.add(malha(tubos([[cParede, false, 40], [cPiso, false, 40]], rb, 4, 20), bordaM));
  for (const z of [1, -1]) { const e = esfera(rb, bordaM, 24); e.position.set(0, 0, z * RB); C.add(e); }

  // ---- parede e piso do corte (meio discos), com sombreamento de contato embutido por vértice
  const FURO = [-0.64, 0.2, 0.19]; // furo do funil do centríolo na parede (s, y, raio)
  const corte = (corBase, escuroBorda, escuroJunta, furo) => {
    const geo = new THREE.RingGeometry(0.0005, RB, 160, 56, 0, Math.PI); const p = geo.attributes.position; const cores = [];
    if (furo) { const idx = geo.index.array, novo = []; for (let i = 0; i < idx.length; i += 3) { let cx = 0, cy = 0; for (let k = 0; k < 3; k++) { cx += p.getX(idx[i + k]) / 3; cy += p.getY(idx[i + k]) / 3; }
      if (Math.hypot(cx - furo[0], cy - furo[1]) > furo[2]) novo.push(idx[i], idx[i + 1], idx[i + 2]); } geo.setIndex(novo); }
    for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i), r = Math.hypot(x, y);
      const ao = 1 - escuroBorda * Math.pow(Math.max(0, (r - 0.7) / 0.26), 2) - escuroJunta * Math.exp(-y / 0.06);
      const c = new THREE.Color(corBase).multiplyScalar(ao); cores.push(c.r, c.g, c.b); }
    geo.setAttribute('color', new THREE.Float32BufferAttribute(cores, 3)); return geo;
  };
  const corteM = plast(0xffffff, { vcores: true, rug: 0.62, coat: 0.12, coatRug: 0.4, emis: 0x2e2618, emisI: 1 });
  const parede = malha(corte(0xf8eed6, 0.12, 0.05, FURO), corteM); parede.rotation.y = Math.PI / 2; C.add(parede); // local (x,y) -> (0, y, -x)
  const piso = malha(corte(0xfbf9f3, 0.08, 0.12), corteM); piso.rotation.set(-Math.PI / 2, 0, -Math.PI / 2); C.add(piso); // local (x,y) -> (y, 0, -x)?
  piso.updateMatrix();

  // ---- retículo endoplasmático (rede ciano em relevo) na parede e no piso
  const ciano = plast(0x18a4cf, { rug: 0.3, coat: 0.7, coatRug: 0.2 });
  const rr = 0.013; const curvas = [];
  const addLacos = (lacos, map, furo) => { for (const l of lacos) { if (furo && l.some(([a, b]) => Math.hypot(a - furo[0], b - furo[1]) < furo[2] + 0.005)) continue; const pts = l.map(([a, b]) => map(a, b)); curvas.push([new THREE.CatmullRomCurve3(pts, true, 'centripetal'), true, pts.length]); } };
  // arco de alvéolos altos em volta do núcleo (s, y), do canto esquerdo até o lado direito
  addLacos(faixa(rnd, arco(-0.08, -0.02, 0, Math.PI * 0.03, Math.PI * 0.97), 19, [0.4, 0.55, 0.82], { amp: 0.02, irreg: 0.1, colFator: (k) => (k === 1 ? 1.0 : 0.6), pula: (k, t) => k === 1 && t > 0.63 }), (s, y) => Wp(s, y, rr * 0.6), FURO);
  addLacos(faixa(rnd, arco(-0.08, -0.02, 0, Math.PI * 0.62, Math.PI * 0.99), 8, [0.55, 0.69, 0.84], { amp: 0.015 }), (s, y) => Wp(s, y, rr * 0.6), FURO);
  // leque de alvéolos em volta da boca do funil do centríolo
  addLacos(faixa(rnd, arco(FURO[0], FURO[1], 0, Math.PI * 0.3, Math.PI * 1.55), 9, [FURO[2] + 0.015, FURO[2] + 0.08, FURO[2] + 0.15], { amp: 0.008, colFator: (k) => (k ? 1.2 : 1) }), (s, y) => Wp(s, Math.max(0.012, y), rr * 0.6));
  // piso: escada na frente do núcleo e trama densa à direita (atrás do Golgi)
  addLacos(faixa(rnd, reta(0.3, 0.49, 0.76, -0.1, 0.07), 7, [-0.05, 0.14], { amp: 0.008 }), (x, z) => Fp(x, z, rr * 0.6));
  addLacos(faixa(rnd, reta(0.5, -0.12, 0.2, -0.82, 0.04), 9, [-0.06, 0.04, 0.13], { amp: 0.01 }), (x, z) => Fp(x, z, rr * 0.6));
  C.add(malha(tubos(curvas, rr, 3, 6), ciano));

  rnd = semente(21);
  // ---- núcleo: esfera com um oitavo removido (voltado à câmera); camadas no corte
  const RN = 0.26, RC = 0.155; const NC = V(0.34, RN - 0.02, 0.25);
  const N = new THREE.Group(); N.position.copy(NC); N.rotation.y = 0.06; C.add(N);
  const verm = plast(0xc01a1a, { rug: 0.38, coat: 0.5, coatRug: 0.2 });
  N.add(malha(new THREE.SphereGeometry(RN, 96, 48, Math.PI, Math.PI * 1.5, 0, Math.PI / 2), verm), malha(new THREE.SphereGeometry(RN, 96, 48, 0, TAU, Math.PI / 2, Math.PI / 2), verm));
  const creme = plast(0xf1dfb4, { rug: 0.55, coat: 0.2, lado: THREE.DoubleSide });
  const vermF = plast(0xc01a1a, { rug: 0.35, coat: 0.5, lado: THREE.DoubleSide });
  const faces = [[0, 0, 0], [0, -Math.PI / 2, 0], [Math.PI / 2, 0, 0]]; // quartos de anel nos planos z=0 (x,y>0), x=0 (z,y>0), y=0 (x,z>0)
  for (const [rx, ry] of faces) {
    const a = malha(new THREE.RingGeometry(RN - 0.03, RN, 48, 1, 0, Math.PI / 2), vermF); const b = malha(new THREE.RingGeometry(RC * 0.98, RN - 0.03, 48, 2, 0, Math.PI / 2), creme);
    for (const m of [a, b]) { m.rotation.set(rx, ry, 0, 'YXZ'); N.add(m); }
  }
  // nucleoplasma: domo vermelho-escuro com grânulos escuros
  const nucM = plast(0x7a1218, { rug: 0.5, coat: 0.2 }); const core = esfera(RC, nucM, 48); N.add(core);
  const granM = plast(0x3a070a, { rug: 0.6, coat: 0 });
  for (let i = 0; i < 60; i++) { const yy = 1 - (i + 0.5) / 60 * 2, rr2 = Math.sqrt(1 - yy * yy), ph = i * 2.39996; const d = new THREE.Vector3(Math.cos(ph) * rr2, yy, Math.sin(ph) * rr2); if (d.x < 0.06 || d.y < 0.06 || d.z < 0.06) continue; const p = malha(new THREE.CircleGeometry(0.0135, 16), granM, false); p.position.copy(d.clone().multiplyScalar(RC * 1.002)); p.lookAt(d.clone().multiplyScalar(2)); N.add(p); }
  // cromossomos (X roxos) sobre a camada creme
  const roxo = plast(0x7a4cc8, { rug: 0.4, coat: 0.4 });
  const cromo = (u, v, face, ang) => { const x = new THREE.Group(); for (const s of [1, -1]) { const c = malha(new THREE.CapsuleGeometry(0.0068, 0.062, 3, 8), roxo, false); c.rotation.z = ang + s * 0.45; x.add(c); }
    const p = [u, v]; if (face === 0) { x.position.set(p[0], p[1], 0.006); } else if (face === 1) { x.position.set(0.006, p[1], p[0]); x.rotation.y = Math.PI / 2; } else { x.position.set(p[0], 0.006, p[1]); x.rotation.x = -Math.PI / 2; }
    N.add(x); };
  for (let f = 0; f < 3; f++) for (let k = 0; k < 3; k++) { const a = (k + 0.5) / 3 * Math.PI / 2 + (rnd() - 0.5) * 0.25, r = RC + 0.04 + rnd() * 0.035; cromo(Math.cos(a) * r, Math.sin(a) * r, f, rnd() * 3); }
  // poros do envoltório
  const poroM = plast(0xd8c08e, { rug: 0.7, coat: 0 });
  for (let i = 0; i < 40; i++) { const d = new THREE.Vector3().setFromSphericalCoords(1, 0.2 + rnd() * 1.6, rnd() * TAU); if (d.x > -0.1 && d.y > -0.1 && d.z > -0.1) continue;
    const p = malha(new THREE.CircleGeometry(0.012, 14), poroM, false); p.scale.y = 1.4; p.position.copy(d.clone().multiplyScalar(RN * 1.003)); p.lookAt(d.clone().multiplyScalar(5).add(p.position)); N.add(p); }

  rnd = semente(31);
  // ---- retículo rugoso: sacos laranja achatados em volta do núcleo (duas camadas), fora do oitavo aberto
  const laranja = plast(0x9c4412, { rug: 0.45, coat: 0.35, coatRug: 0.3 });
  const saco = (L, Wd) => { const pts = []; for (let k = 0; k < 72; k++) { const t = k / 72 * TAU; const c = Math.cos(t), sn = Math.sin(t); pts.push(new THREE.Vector2(L / 2 * Math.sign(c) * Math.pow(Math.abs(c), 0.75), Wd / 2 * sn * (1 - 0.18 * c))); } const s = new THREE.Shape(pts);
    const geo = new THREE.ExtrudeGeometry(s, { depth: 0.012, bevelEnabled: true, bevelThickness: 0.017, bevelSize: 0.02, bevelSegments: 4, curveSegments: 12 }); geo.translate(0, 0, -0.006); return suave(geo); };
  const sacosGeo = [saco(0.19, 0.07), saco(0.155, 0.062), saco(0.23, 0.078)];
  const camadas = [[RN + 0.04, 26], [RN + 0.1, 20]];
  for (const [rS, n] of camadas) for (let i = 0; i < n; i++) {
    const th = Math.acos(1 - 2 * ((i + rnd() * 0.6) / n) * 0.62), ph = (i * 2.399 + rnd() * 0.4) % TAU;
    const d = new THREE.Vector3().setFromSphericalCoords(1, th, ph);
    const lim = rS > RN + 0.06 ? -0.22 : -0.08; if (d.x > lim && d.y > lim && d.z > lim) continue; // oitavo aberto (e sua borda)
    if (d.y < -0.2) continue;
    const pos = NC.clone().add(d.clone().multiplyScalar(rS)); if (pos.y < 0.03) pos.y = 0.03;
    if (pos.x < 0.02) continue;
    if (d.z < -0.25 && d.y < 0.55) continue; // lado direito do núcleo fica à mostra, como na referência
    const m = malha(sacosGeo[i % 3], laranja); m.position.copy(pos);
    const leste = V(0, 1, 0).cross(d); if (leste.lengthSq() < 0.01) leste.set(1, 0, 0); leste.normalize(); const norte = d.clone().cross(leste);
    const eixo = (d.z > 0.35 && Math.abs(d.y) < 0.65) ? norte : leste; const yy = d.clone().cross(eixo);
    m.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(eixo, yy, d)); m.rotateZ((rnd() - 0.5) * 0.5);
    C.add(m);
  }
  for (let i = 0; i < 9; i++) { // anel de sacos deitados no piso em volta da base do núcleo
    const a = -0.7 + i / 8 * 3.0 + (rnd() - 0.5) * 0.12, r = 0.2 + (i % 2) * 0.03;
    const m = malha(sacosGeo[(i + 1) % 3], laranja); m.position.set(NC.x + Math.cos(a) * r, 0.032 + (i % 2) * 0.01, NC.z + Math.sin(a) * r);
    m.rotation.set(-Math.PI / 2, 0, 0); m.rotateZ(-a + Math.PI / 2 + (rnd() - 0.5) * 0.4); m.rotateX(-0.12 + (rnd() - 0.5) * 0.2); C.add(m);
  }

  // ---- Golgi: cisternas azuis achatadas em pé, abertas em cima (corte), unidas como uma lâmina dobrada:
  //      fileira de trás alta e alongada em profundidade, fileira da frente baixa (face trans, voltada à membrana)
  const azul = plast(0x3247b0, { rug: 0.42, coat: 0.3, coatRug: 0.3 });
  const GOL = new THREE.Group(); GOL.position.set(0.78, 0, -0.22); GOL.rotation.y = 0.55; C.add(GOL);
  const cisterna = (a, b, h, esp = 0.017) => { const s = new THREE.Shape(); s.absellipse(0, 0, a, b, 0, TAU); const f = new THREE.Path(); f.absellipse(0, 0, a - esp, b - esp, 0, TAU, true); s.holes.push(f);
    const m = malha(suave(new THREE.ExtrudeGeometry(s, { depth: h, bevelEnabled: true, bevelThickness: 0.009, bevelSize: 0.008, bevelSegments: 4, curveSegments: 28 })), azul); m.rotation.x = -Math.PI / 2; return m; };
  const fitaG = fitaGrossa(meandro([0.23, 0.28, 0.19], 0.07, 0.03), 0.024, 0.075, azul); fitaG.geometry = suave(fitaG.geometry);
  { const pp = fitaG.geometry.attributes.position; for (let i = 0; i < pp.count; i++) { const x = pp.getX(i) - 0.17; pp.setZ(i, pp.getZ(i) + 0.9 * x * x); } fitaG.geometry.computeVertexNormals(); }
  fitaG.position.set(-0.17, 0, -0.1); GOL.add(fitaG);
  for (const [x, z, a, b, h, inc] of [[-0.115, 0.05, 0.052, 0.038, 0.14, 0.05], [0.0, 0.055, 0.04, 0.034, 0.19, 0.0], [0.105, 0.06, 0.035, 0.03, 0.15, -0.06]]) {
    const c = cisterna(a, b, h); c.position.set(x, 0.008, z); c.rotation.z = inc; GOL.add(c); }

  // ---- mitocôndrias abertas: duas no piso, duas encaixadas na parede
  const mitM = { parede: plast(0x6c1aa6, { rug: 0.32, coat: 0.6, coatRug: 0.2 }), fundo: plast(0xffffff, { map: texCristas(), rug: 0.5, coat: 0.2, emis: 0x8a3ae0, emisI: 0 }) };
  mitM.fundo.bumpMap = mitM.fundo.map; mitM.fundo.bumpScale = 3;
  const mitos = [];
  for (const [x, z, ry, L, Wd] of [[0.5, 0.7, 0.74, 0.3, 0.13], [0.84, 0.19, 0.44, 0.26, 0.115]]) { const m = mitocondria(L, Wd, 0.05, mitM); m.position.set(x, 0.0, z); m.rotation.y = ry; C.add(m); mitos.push(m); }
  for (const [s, y, ang, L, Wd] of [[-0.4, 0.62, 0.62, 0.25, 0.12], [0.67, 0.26, 1.5, 0.2, 0.1]]) {
    const m = mitocondria(L, Wd, 0.045, mitM); m.position.copy(Wp(s, y, 0)); m.rotation.set(0, 0, -Math.PI / 2); m.rotateY(ang); C.add(m); mitos.push(m); }

  rnd = semente(41);
  // ---- retículo liso: emaranhado magenta de tubos com bolhas, saindo da parede no alto à direita
  const magenta = plast(0x8a1c3c, { rug: 0.42, coat: 0.35, coatRug: 0.3 });
  const curS = [], bolhas = [];
  // três teias (folhas com furos e dedos) ao longo de uma diagonal no alto da parede, saindo para fora
  for (const [cs, cy, h, esc, rot] of [[0.12, 0.74, 0.06, 1.2, 0.2], [0.42, 0.63, 0.1, 1.25, -0.3], [0.66, 0.46, 0.13, 1.15, 0.4]]) {
    const cen = Wp(cs, cy, h); const nf = V(0.5, 0.3, 0.8).normalize(); const u0 = V(0, 1, 0).cross(nf).normalize(), v0 = nf.clone().cross(u0); // folha de frente para quem olha
    const u = u0.clone().multiplyScalar(Math.cos(rot)).add(v0.clone().multiplyScalar(Math.sin(rot))), w = nf.clone().cross(u);
    const P = (a, b) => cen.clone().add(u.clone().multiplyScalar(a * esc)).add(w.clone().multiplyScalar(b * esc));
    // folha com furos (forma irregular extrudada fina, cantos arredondados)
    const contorno = []; for (let k = 0; k < 14; k++) { const t = k / 14 * TAU; const r = (0.075 + 0.03 * Math.sin(3 * t + rnd()) + 0.015 * rnd()); contorno.push(new THREE.Vector2(Math.cos(t) * r * 1.25, Math.sin(t) * r)); }
    const folha = new THREE.Shape(new THREE.SplineCurve(contorno.concat([contorno[0]])).getPoints(56));
    for (const [hx, hy, ha, hb] of [[-0.035, 0.012, 0.026, 0.018], [0.03, -0.01, 0.022, 0.026], [0.0, 0.045, 0.015, 0.011]]) { const f = new THREE.Path(); f.absellipse(hx, hy, ha * (0.8 + 0.4 * rnd()), hb * (0.8 + 0.4 * rnd()), 0, TAU, true); folha.holes.push(f); }
    const fg = suave(new THREE.ExtrudeGeometry(folha, { depth: 0.006, bevelEnabled: true, bevelThickness: 0.011, bevelSize: 0.011, bevelSegments: 3, curveSegments: 16 }));
    const fm = malha(fg, magenta); fm.matrixAutoUpdate = true; fm.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(u, w, nf)); fm.scale.setScalar(esc); fm.position.copy(cen); C.add(fm);
    for (let k = 0; k < 5; k++) { const a0 = (k + rnd() * 0.6) / 5 * TAU; const p0 = P(Math.cos(a0) * 0.07, Math.sin(a0) * 0.055); const p1 = P(Math.cos(a0) * 0.16 + (rnd() - 0.5) * 0.04, Math.sin(a0) * 0.12 + (rnd() - 0.5) * 0.04);
      curS.push([new THREE.CatmullRomCurve3([p0, p0.clone().lerp(p1, 0.5).add(V(0, 0.01, 0)), p1]), false, 4]); bolhas.push(p1); }
  }
  C.add(malha(tubos(curS, 0.014, 3, 8), magenta));
  for (const p of bolhas) { const b = esfera(0.019, magenta, 14); b.position.copy(p); C.add(b); }

  rnd = semente(51);
  // ---- centríolos: funil de rede ciano na parede (canto inferior esquerdo) com feixes dourados
  const FUN = new THREE.Group(); FUN.position.copy(Wp(FURO[0], FURO[1], 0)); C.add(FUN);
  const perfil = [[0.03, -0.2], [0.06, -0.17], [0.1, -0.11], [0.14, -0.05], [FURO[2] + 0.004, 0]].map(([r, y]) => new THREE.Vector2(r, y));
  const funilGeo = new THREE.LatheGeometry(perfil, 48); funilGeo.rotateZ(-Math.PI / 2); // eixo do torno -> +x (boca no plano da parede)
  const funil = malha(funilGeo, plast(0xffffff, { map: texRede(512, 128, 30, 26, 7, [24, 164, 207]), rug: 0.3, coat: 0.6, lado: THREE.DoubleSide }));
  funil.material.alphaTest = 0.5; FUN.add(funil);
  const fundoFunil = malha(new THREE.LatheGeometry(perfil.map((p) => new THREE.Vector2(p.x * 1.06 + 0.004, p.y)), 48).rotateZ(-Math.PI / 2), plast(0x10303c, { rug: 0.85, coat: 0, lado: THREE.DoubleSide }));
  FUN.add(fundoFunil);
  const boca = malha(new THREE.TorusGeometry(FURO[2], 0.011, 8, 64), ciano); boca.rotation.y = Math.PI / 2; boca.position.x = 0.004; FUN.add(boca);
  const ouro = plast(0xe0b02a, { metal: 0.35, rug: 0.32, coat: 0.6, lado: THREE.DoubleSide });
  const feixe = (n, L, dir) => { const b = new THREE.Group(); const gTubo = new THREE.CylinderGeometry(0.0055, 0.0055, L, 8, 1, true);
    for (let i = 0; i < n; i++) { const a = i * 2.399, r = 0.009 * Math.sqrt(i); const t = malha(gTubo, ouro); t.position.set(Math.cos(a) * r, (rnd() - 0.5) * 0.012, Math.sin(a) * r); b.add(t); }
    b.quaternion.setFromUnitVectors(V(0, 1, 0), dir.normalize()); return b; };
  const f1 = feixe(22, 0.26, V(0.45, 0.75, -0.5)); f1.position.set(0.02, 0.0, -0.03); FUN.add(f1);
  const f2 = feixe(16, 0.1, V(1, 0.35, 0.25)); f2.position.set(-0.05, 0.05, 0.06); FUN.add(f2);

  rnd = semente(61);
  // ---- ribossomos (grupinhos de 3–4 grãos vermelho-escuros)
  const ribM = plast(0x6e0d0d, { rug: 0.35, coat: 0.5 }); const ribG = new THREE.SphereGeometry(1, 12, 8); const ribs = [];
  const ribo = (p, n) => { const q = new THREE.Quaternion().setFromUnitVectors(V(0, 1, 0), n); const ang = rnd() * TAU;
    for (let k = 0; k < 4; k++) { const r = k < 3 ? 0.0135 : 0.01; const a = ang + k * 2.1; const off = k < 3 ? V(Math.cos(a) * 0.012, r * 0.7, Math.sin(a) * 0.012) : V(0, r * 1.6, 0);
      ribs.push(new THREE.Matrix4().compose(p.clone().add(off.applyQuaternion(q)), q, V(r, r, r))); } };
  for (const [s, y] of [[0.0, 0.9], [-0.13, 0.85], [-0.24, 0.59], [-0.45, 0.48], [0.79, 0.2], [0.75, 0.38], [0.86, 0.43], [-0.62, 0.42]]) ribo(Wp(s, y, 0), V(1, 0, 0));
  for (const [x, z] of [[0.11, -0.71], [0.33, 0.62], [0.45, 0.42], [0.63, 0.24], [0.79, 0.04], [0.28, 0.85], [0.66, -0.55], [0.5, -0.5]]) ribo(Fp(x, z), V(0, 1, 0));
  for (let k = 0; k < 7; k++) ribo(Fp(0.6 + k * 0.024, 0.63 - k * 0.035), V(0, 1, 0));
  const ribI = new THREE.InstancedMesh(ribG, ribM, ribs.length); ribs.forEach((m, i) => ribI.setMatrixAt(i, m)); ribI.castShadow = true; C.add(ribI);

  // ---- vesículas de secreção: saem da face trans do Golgi rumo à membrana
  const vesM = plast(0x4a6cf0, { rug: 0.2, coat: 1, transp: true, opac: 0 }); const ves = [];
  for (let i = 0; i < 4; i++) { const v = esfera(0.03, vesM.clone(), 20); C.add(v); ves.push(v); }
  const ini = V(0.8, 0.2, -0.22), fim = V(0.9, 0.08, -0.36);

  // câmera ajustada aos pontos da referência (cantos do corte, silhueta, polo)
  let camera = { pos: V(1.93, 2.54, 1.957), alvo: V(-0.05, 0.964, 0.047), fov: 41.6 };
  try { const q = new URLSearchParams(location.search).get('cam'); if (q) { const n = q.split(',').map(Number); camera = { pos: V(n[0], n[1], n[2]), alvo: V(n[3], n[4], n[5]), fov: n[6] }; } } catch (e) {}
  return {
    grupo: g, camera,
    animar(t, ativo, dt) {
      this._a = (this._a || 0) + ((ativo ? 1 : 0) - (this._a || 0)) * Math.min(1, dt * 3);
      ves.forEach((v, i) => { const s = (t * 0.35 + i / ves.length) % 1; v.position.lerpVectors(ini, fim, s); v.position.y += Math.sin(s * Math.PI) * 0.05;
        v.material.opacity = this._a * Math.sin(s * Math.PI); });
      mitM.fundo.emissiveIntensity = this._a * (0.25 + 0.25 * Math.sin(t * 5));
      mitos.forEach((m, i) => m.scale.setScalar(1 + this._a * 0.05 * Math.sin(t * 5 + i)));
    },
  };
}

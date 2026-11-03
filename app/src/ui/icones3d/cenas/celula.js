/* eslint-disable */
import { THREE, V, TAU, plast, semente, malha, esfera } from '../base.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

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
const ESC = 3.3, LARG = 0.3, AMP = 0.05;
const GLSL_CRISTA = `
vec3 hshC(vec3 p){ p=fract(p*vec3(.1031,.1030,.0973)); p+=dot(p,p.yxz+33.33); return fract((p.xxy+p.yxx)*p.zyx); }
float crista(vec3 q, out vec3 grad){
  vec3 i=floor(q), f=fract(q); float d1=9., d2=9.; vec3 r1=vec3(1.), r2=vec3(1.);
  for(int z=-1;z<=1;z++) for(int y=-1;y<=1;y++) for(int x=-1;x<=1;x++){
    vec3 g=vec3(float(x),float(y),float(z)); vec3 r=g+0.08+0.84*hshC(i+g)-f; float d=dot(r,r);
    if(d<d1){ d2=d1; r2=r1; d1=d; r1=r; } else if(d<d2){ d2=d; r2=r; } }
  d1=sqrt(d1); d2=sqrt(d2); float e=d2-d1; float x=clamp(e/${LARG.toFixed(3)},0.,1.); float u=1.-x*x;
  float h=u*sqrt(u);
  vec3 ge=-r2/max(d2,1e-4)+r1/max(d1,1e-4);
  float dh=(x<1.)?-3.*x*sqrt(u)/${LARG.toFixed(3)}:0.;
  grad=dh*ge;
  float alv=smoothstep(0.0,0.5,d1); // alvéolo levemente abaulado (mais alto no centro)
  return h - 0.18*(1.-alv)*(1.-h);
}`;
function materialMembrana() {
  const m = plast(0xffffff, { rug: 0.55, coat: 0.2, coatRug: 0.35 });
  m.onBeforeCompile = (sh) => {
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', `#include <common>\nvarying vec3 vOP; varying vec3 vNX; varying vec3 vNY; varying vec3 vNZ;\n${GLSL_CRISTA}`)
      .replace('#include <begin_vertex>', `#include <begin_vertex>\n vOP = position; { vec3 gq; float hv = crista(normalize(position)*${ESC.toFixed(2)}, gq); transformed += normalize(position)*${AMP.toFixed(3)}*hv; }
 vNX = normalize(normalMatrix*vec3(1.,0.,0.)); vNY = normalize(normalMatrix*vec3(0.,1.,0.)); vNZ = normalize(normalMatrix*vec3(0.,0.,1.));`);
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', `#include <common>\nvarying vec3 vOP; varying vec3 vNX; varying vec3 vNY; varying vec3 vNZ;\n${GLSL_CRISTA}`)
      .replace('#include <color_fragment>', `#include <color_fragment>
 vec3 ddM = normalize(vOP); vec3 gqM; float hM = crista(ddM*${ESC.toFixed(2)}, gqM);
 diffuseColor.rgb *= mix(vec3(0.70,0.64,0.49), vec3(0.80,0.67,0.34), smoothstep(0.0,0.5,hM));`)
      .replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>
 { vec3 gp = ${ESC.toFixed(2)}*(gqM - dot(gqM,ddM)*ddM); vec3 nO = normalize(ddM - ${AMP.toFixed(3)}*gp);
   normal = normalize(vNX*nO.x + vNY*nO.y + vNZ*nO.z); }`)
      .replace('#include <clearcoat_normal_fragment_begin>', '#include <clearcoat_normal_fragment_begin>\n clearcoatNormal = normal;');
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
function texCristas() {
  const c = document.createElement('canvas'); c.width = 512; c.height = 256; const x = c.getContext('2d');
  x.fillStyle = '#4a1072'; x.fillRect(0, 0, 512, 256); x.strokeStyle = '#c69af2'; x.lineCap = 'round'; x.lineJoin = 'round'; x.lineWidth = 22;
  const rnd = semente(5);
  for (const [y0, sg] of [[70, 1], [186, -1]]) { x.beginPath(); x.moveTo(10, y0); let px = 10;
    while (px < 500) { const w = 26 + rnd() * 16, h = 40 + rnd() * 45; x.lineTo(px, y0 + sg * h); x.lineTo(px + w, y0 + sg * h); x.lineTo(px + w, y0); px += w + 22; x.lineTo(px, y0); }
    x.stroke(); }
  x.lineWidth = 18; x.beginPath(); x.moveTo(20, 128); for (let px = 20; px < 500; px += 30) x.lineTo(px, 128 + (rnd() - 0.5) * 30); x.stroke();
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
function contornoFeijao(L, Wd, n = 48, curva = 0.18) {
  const pts = []; for (let i = 0; i < n; i++) { const t = i / n * TAU; const c = Math.cos(t), s = Math.sin(t);
    pts.push(new THREE.Vector2(L / 2 * Math.sign(c) * Math.pow(Math.abs(c), 0.8), Wd / 2 * Math.sign(s) * Math.pow(Math.abs(s), 0.8) - curva * Wd * c * c)); }
  return pts;
}
// mitocôndria aberta (corte): parede roxa em forma de feijão + fundo de cristas. Eixo local: comprimento X, largura Z, altura Y.
function mitocondria(L, Wd, alt, mats) {
  const g = new THREE.Group();
  const ext = contornoFeijao(L, Wd), int = ext.map((p) => p.clone().multiplyScalar(0.84).add(new THREE.Vector2(0, 0.0)));
  const forma = new THREE.Shape(ext); forma.holes.push(new THREE.Path(int.slice().reverse()));
  const pg = new THREE.ExtrudeGeometry(forma, { depth: alt, bevelEnabled: true, bevelThickness: 0.006, bevelSize: 0.006, bevelSegments: 3, curveSegments: 6 });
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
  return malha(new THREE.ExtrudeGeometry(forma, { depth: prof, bevelEnabled: true, bevelThickness: 0.016, bevelSize: 0.014, bevelSegments: 4, curveSegments: 4 }), mat);
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
  const rnd = semente(11);
  const g = new THREE.Group(); const C = new THREE.Group(); C.position.y = 1.0; g.add(C);
  const R = 1.0, RB = 0.955, rb = 0.052; // raio externo; borda do corte (tubo) e raio do tubo

  // ---- membrana: metade de baixo inteira + metade de cima de trás (x<0)
  const memM = materialMembrana();
  C.add(malha(new THREE.SphereGeometry(R * 0.985, 200, 64, -Math.PI / 2, Math.PI, 0, Math.PI / 2), memM));
  C.add(malha(new THREE.SphereGeometry(R * 0.985, 200, 64, 0, TAU, Math.PI / 2, Math.PI / 2), memM));
  // borda arredondada do corte: arco da parede (plano x=0) e arco do piso (y=0, x>0)
  const bordaM = plast(0xe8d394, { rug: 0.5, coat: 0.25, coatRug: 0.35 });
  const c3 = (fn) => { const cur = new THREE.Curve(); cur.getPoint = (t, alvo = new THREE.Vector3()) => alvo.copy(fn(t)); return cur; };
  const cParede = c3((t) => { const a = Math.PI * t; return V(0, Math.sin(a) * RB, Math.cos(a) * RB); });
  const cPiso = c3((t) => { const a = Math.PI * t - Math.PI / 2; return V(Math.cos(a) * RB, 0, -Math.sin(a) * RB); });
  C.add(malha(tubos([[cParede, false, 40], [cPiso, false, 40]], rb, 4, 20), bordaM));
  for (const z of [1, -1]) { const e = esfera(rb, bordaM, 24); e.position.set(0, 0, z * RB); C.add(e); }

  // ---- parede e piso do corte (meio discos), com sombreamento de contato embutido por vértice
  const corte = (corBase, escuroBorda, escuroJunta) => {
    const geo = new THREE.RingGeometry(0.0005, RB, 128, 24, 0, Math.PI); const p = geo.attributes.position; const cores = [];
    for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i), r = Math.hypot(x, y);
      const ao = 1 - escuroBorda * Math.pow(Math.max(0, (r - 0.7) / 0.26), 2) - escuroJunta * Math.exp(-y / 0.06);
      const c = new THREE.Color(corBase).multiplyScalar(ao); cores.push(c.r, c.g, c.b); }
    geo.setAttribute('color', new THREE.Float32BufferAttribute(cores, 3)); return geo;
  };
  const corteM = plast(0xffffff, { vcores: true, rug: 0.62, coat: 0.12, coatRug: 0.4 });
  const parede = malha(corte(0xf3ede0, 0.1, 0.1), corteM); parede.rotation.y = Math.PI / 2; C.add(parede); // local (x,y) -> (0, y, -x)
  const piso = malha(corte(0xfbf9f3, 0.08, 0.12), corteM); piso.rotation.set(-Math.PI / 2, 0, -Math.PI / 2); C.add(piso); // local (x,y) -> (y, 0, -x)?
  piso.updateMatrix();

  // ---- retículo endoplasmático (rede ciano em relevo) na parede e no piso
  const ciano = plast(0x18a4cf, { rug: 0.3, coat: 0.7, coatRug: 0.2 });
  const rr = 0.013; const curvas = [];
  const addLacos = (lacos, map) => { for (const l of lacos) { const pts = l.map(([a, b]) => map(a, b)); curvas.push([new THREE.CatmullRomCurve3(pts, true, 'centripetal'), true, pts.length]); } };
  // arco de alvéolos altos em volta do núcleo (s, y), do canto esquerdo até o lado direito
  addLacos(faixa(rnd, arco(-0.08, -0.02, 0, Math.PI * 0.03, Math.PI * 0.97), 19, [0.4, 0.55, 0.82], { amp: 0.02, irreg: 0.1, colFator: (k) => (k === 1 ? 1.0 : 0.6), pula: (k, t) => k === 1 && t > 0.63 }), (s, y) => Wp(s, y, rr * 0.6));
  addLacos(faixa(rnd, arco(-0.08, -0.02, 0, Math.PI * 0.62, Math.PI * 0.99), 8, [0.55, 0.69, 0.84], { amp: 0.015 }), (s, y) => Wp(s, y, rr * 0.6));
  // piso: escada na frente do núcleo e trama densa à direita (atrás do Golgi)
  addLacos(faixa(rnd, reta(0.16, 0.52, 0.9, 0.0, -0.05), 10, [0.0, 0.17], { amp: 0.01 }), (x, z) => Fp(x, z, rr * 0.6));
  addLacos(faixa(rnd, reta(0.62, 0.06, 0.3, -0.8, 0.05), 10, [-0.05, 0.05, 0.14], { amp: 0.01 }), (x, z) => Fp(x, z, rr * 0.6));
  C.add(malha(tubos(curvas, rr, 3, 6), ciano));

  // ---- núcleo: esfera com um oitavo removido (voltado à câmera); camadas no corte
  const RN = 0.265, RC = 0.15; const NC = V(0.34, RN, 0.25);
  const N = new THREE.Group(); N.position.copy(NC); N.rotation.y = 0.06; C.add(N);
  const verm = plast(0xd0201f, { rug: 0.3, coat: 0.8, coatRug: 0.12 });
  N.add(malha(new THREE.SphereGeometry(RN, 96, 48, Math.PI, Math.PI * 1.5, 0, Math.PI / 2), verm), malha(new THREE.SphereGeometry(RN, 96, 48, 0, TAU, Math.PI / 2, Math.PI / 2), verm));
  const creme = plast(0xf1dfb4, { rug: 0.55, coat: 0.2, lado: THREE.DoubleSide });
  const vermF = plast(0xc01a1a, { rug: 0.35, coat: 0.5, lado: THREE.DoubleSide });
  const faces = [[0, 0, 0], [0, -Math.PI / 2, 0], [Math.PI / 2, 0, 0]]; // quartos de anel nos planos z=0 (x,y>0), x=0 (z,y>0), y=0 (x,z>0)
  for (const [rx, ry] of faces) {
    const a = malha(new THREE.RingGeometry(RN - 0.03, RN, 48, 1, 0, Math.PI / 2), vermF); const b = malha(new THREE.RingGeometry(RC * 0.98, RN - 0.03, 48, 2, 0, Math.PI / 2), creme);
    for (const m of [a, b]) { m.rotation.set(rx, ry, 0, 'YXZ'); N.add(m); }
  }
  // nucleoplasma: domo vermelho-escuro com grânulos escuros
  const nucM = plast(0x8e1a20, { rug: 0.35, coat: 0.6 }); const core = esfera(RC, nucM, 48); N.add(core);
  const granM = plast(0x2a0306, { rug: 0.6, coat: 0 });
  for (let i = 0; i < 14; i++) { const d = new THREE.Vector3(rnd() + 0.08, rnd() + 0.05, rnd() + 0.05).normalize(); const p = malha(new THREE.CircleGeometry(0.014, 14), granM, false); p.position.copy(d.clone().multiplyScalar(RC * 1.002)); p.lookAt(d.clone().multiplyScalar(2)); N.add(p); }
  // cromossomos (X roxos) sobre a camada creme
  const roxo = plast(0x7a4cc8, { rug: 0.4, coat: 0.4 });
  const cromo = (u, v, face, ang) => { const x = new THREE.Group(); for (const s of [1, -1]) { const c = malha(new THREE.CapsuleGeometry(0.0055, 0.05, 3, 8), roxo, false); c.rotation.z = ang + s * 0.45; x.add(c); }
    const p = [u, v]; if (face === 0) { x.position.set(p[0], p[1], 0.006); } else if (face === 1) { x.position.set(0.006, p[1], p[0]); x.rotation.y = Math.PI / 2; } else { x.position.set(p[0], 0.006, p[1]); x.rotation.x = -Math.PI / 2; }
    N.add(x); };
  for (let f = 0; f < 3; f++) for (let k = 0; k < 3; k++) { const a = (k + 0.5) / 3 * Math.PI / 2 + (rnd() - 0.5) * 0.25, r = RC + 0.04 + rnd() * 0.035; cromo(Math.cos(a) * r, Math.sin(a) * r, f, rnd() * 3); }
  // poros do envoltório
  const poroM = plast(0x6a0808, { rug: 0.6, coat: 0.2 });
  for (let i = 0; i < 18; i++) { const d = new THREE.Vector3().setFromSphericalCoords(1, 0.2 + rnd() * 1.6, rnd() * TAU); if (d.x > -0.1 && d.y > -0.1 && d.z > -0.1) continue;
    const p = malha(new THREE.CircleGeometry(0.012, 14), poroM, false); p.scale.y = 1.4; p.position.copy(d.clone().multiplyScalar(RN * 1.003)); p.lookAt(d.clone().multiplyScalar(5).add(p.position)); N.add(p); }

  // ---- retículo rugoso: sacos laranja achatados em volta do núcleo (duas camadas), fora do oitavo aberto
  const laranja = plast(0xc45a16, { rug: 0.45, coat: 0.35, coatRug: 0.3 });
  const saco = (L, Wd) => { const s = new THREE.Shape(); const r = Wd / 2; s.absarc(L / 2 - r, 0, r, -Math.PI / 2, Math.PI / 2); s.absarc(-L / 2 + r, 0, r, Math.PI / 2, Math.PI * 1.5);
    const geo = new THREE.ExtrudeGeometry(s, { depth: 0.008, bevelEnabled: true, bevelThickness: 0.013, bevelSize: 0.014, bevelSegments: 4, curveSegments: 10 }); geo.translate(0, 0, -0.004); return geo; };
  const sacosGeo = [saco(0.17, 0.065), saco(0.14, 0.06), saco(0.2, 0.07)];
  const camadas = [[RN + 0.035, 34], [RN + 0.085, 30]];
  for (const [rS, n] of camadas) for (let i = 0; i < n; i++) {
    const th = Math.acos(1 - 2 * ((i + rnd() * 0.6) / n) * 0.62), ph = (i * 2.399 + rnd() * 0.4) % TAU;
    const d = new THREE.Vector3().setFromSphericalCoords(1, th, ph);
    if (d.x > -0.05 && d.y > -0.05 && d.z > -0.05) continue; // oitavo aberto
    if (d.y < -0.85) continue;
    const pos = NC.clone().add(d.clone().multiplyScalar(rS)); if (pos.y < 0.03) pos.y = 0.03;
    if (pos.x < 0.02) continue;
    const m = malha(sacosGeo[i % 3], laranja); m.position.copy(pos);
    const tang = new THREE.Vector3(0, 1, 0).cross(d).normalize(); if (tang.lengthSq() < 0.1) tang.set(1, 0, 0);
    const q = new THREE.Quaternion().setFromUnitVectors(V(0, 0, 1), d); m.quaternion.copy(q); m.rotateZ((rnd() - 0.5) * 0.8 + (d.y < 0.3 ? 0 : Math.PI / 2) * 0);
    C.add(m);
  }

  // ---- Golgi: fita azul grossa dobrada em grampos (trás) + bolsas curtas abertas (frente)
  const azul = plast(0x2d3fc4, { rug: 0.38, coat: 0.5, coatRug: 0.25 });
  const GOL = new THREE.Group(); GOL.position.set(0.72, 0, -0.3); GOL.rotation.y = 0.6; C.add(GOL);
  const fita = fitaGrossa(meandro([0.27, 0.31, 0.22], 0.075, 0.02), 0.034, 0.07, azul); fita.position.set(-0.22, 0, -0.05); GOL.add(fita);
  const bolsa = (w, d, h) => { const s = new THREE.Shape(); s.absellipse(0, 0, w, d, 0, TAU); const hole = new THREE.Path(); hole.absellipse(0, 0, w - 0.018, d - 0.016, 0, TAU, true); s.holes.push(hole);
    const geo = new THREE.ExtrudeGeometry(s, { depth: h, bevelEnabled: true, bevelThickness: 0.01, bevelSize: 0.008, bevelSegments: 3, curveSegments: 24 }); const m = malha(geo, azul); m.rotation.x = -Math.PI / 2; return m; };
  for (const [x, z, w, d, h] of [[-0.12, 0.09, 0.05, 0.035, 0.15], [0.0, 0.1, 0.04, 0.03, 0.2], [0.1, 0.1, 0.035, 0.03, 0.13]]) { const b = bolsa(w, d, h); b.position.set(x, 0, z); GOL.add(b); }

  // ---- mitocôndrias abertas: duas no piso, duas encaixadas na parede
  const mitM = { parede: plast(0x7a1fb8, { rug: 0.32, coat: 0.6, coatRug: 0.2 }), fundo: plast(0xffffff, { map: texCristas(), rug: 0.5, coat: 0.2, emis: 0x8a3ae0, emisI: 0 }) };
  mitM.fundo.bumpMap = mitM.fundo.map; mitM.fundo.bumpScale = 1.5;
  const mitos = [];
  for (const [x, z, ry, L, Wd] of [[0.5, 0.7, 0.75, 0.25, 0.115], [0.84, 0.18, 0.4, 0.22, 0.1]]) { const m = mitocondria(L, Wd, 0.045, mitM); m.position.set(x, 0.0, z); m.rotation.y = ry; C.add(m); mitos.push(m); }
  for (const [s, y, ang, L, Wd] of [[-0.4, 0.62, 0.62, 0.24, 0.1], [0.62, 0.2, 1.45, 0.19, 0.085]]) {
    const m = mitocondria(L, Wd, 0.045, mitM); m.position.copy(Wp(s, y, 0)); m.rotation.set(0, 0, -Math.PI / 2); m.rotateY(ang); C.add(m); mitos.push(m); }

  // ---- retículo liso: emaranhado magenta de tubos com bolhas, saindo da parede no alto à direita
  const magenta = plast(0xa81d48, { rug: 0.42, coat: 0.35, coatRug: 0.3 });
  const nos = []; for (let i = 0; i < 30; i++) { const a = (0.13 + 0.36 * rnd()) * Math.PI, r = 0.6 + rnd() * 0.3; nos.push(Wp(Math.cos(a) * r, Math.sin(a) * r, 0.03 + rnd() * 0.12)); }
  const curS = [];
  nos.forEach((a, i) => { const viz = nos.map((b, j) => [j, a.distanceTo(b)]).filter(([j]) => j !== i).sort((p, q) => p[1] - q[1]).slice(0, 3);
    for (const [j, d] of viz) { if (j < i && d < 0.3) continue; const b = nos[j]; const m = a.clone().lerp(b, 0.5).add(V(rnd() * 0.04, (rnd() - 0.5) * 0.06, (rnd() - 0.5) * 0.06));
      curS.push([new THREE.CatmullRomCurve3([a, m, b]), false, 6]); } });
  C.add(malha(tubos(curS, 0.022, 3, 8), magenta));
  for (const p of nos) { const b = esfera(0.026 + rnd() * 0.014, magenta, 16); b.position.copy(p); b.scale.set(0.7, 1, 1.2); C.add(b); }

  // ---- centríolos: funil de rede ciano na parede (canto inferior esquerdo) com feixes dourados
  const FUN = new THREE.Group(); FUN.position.copy(Wp(-0.66, 0.14, 0)); FUN.quaternion.setFromUnitVectors(V(1, 0, 0), V(1, 0.2, -0.45).normalize()); C.add(FUN);
  const perfil = [[0.035, 0], [0.08, 0.035], [0.13, 0.09], [0.17, 0.14], [0.185, 0.165]].map(([r, y]) => new THREE.Vector2(r, y));
  const funilGeo = new THREE.LatheGeometry(perfil, 48); funilGeo.rotateZ(-Math.PI / 2);
  const funil = malha(funilGeo, plast(0xffffff, { map: texRede(512, 128, 30, 26, 7, [24, 164, 207]), alphaTest: 0.5, rug: 0.3, coat: 0.6, lado: THREE.DoubleSide }));
  funil.material.alphaTest = 0.5; funil.material.transparent = false; FUN.add(funil);
  const fundoFunil = malha(new THREE.LatheGeometry(perfil.map((p) => new THREE.Vector2(p.x * 0.93, p.y - 0.004)), 48).rotateZ(-Math.PI / 2), plast(0x2a6276, { rug: 0.8, coat: 0, lado: THREE.DoubleSide }));
  FUN.add(fundoFunil);
  const boca = malha(new THREE.TorusGeometry(0.185, 0.012, 8, 48), ciano); boca.rotation.y = Math.PI / 2; boca.position.x = 0.165; FUN.add(boca);
  const ouro = plast(0xe0b02a, { metal: 0.35, rug: 0.32, coat: 0.6 });
  const feixe = (n, L) => { const b = new THREE.Group(); const gTubo = new THREE.CylinderGeometry(0.0055, 0.0055, L, 8, 1, true);
    for (let i = 0; i < n; i++) { const a = i * 2.399, r = 0.009 * Math.sqrt(i); const t = malha(gTubo, ouro); t.position.set(Math.cos(a) * r, (rnd() - 0.5) * 0.012, Math.sin(a) * r); b.add(t); }
    return b; };
  ouro.side = THREE.DoubleSide;
  const f1 = feixe(22, 0.24); f1.position.set(0.11, 0.0, -0.01); f1.rotation.set(0.5, 0, -0.75); FUN.add(f1);
  const f2 = feixe(16, 0.11); f2.position.set(0.06, 0.06, 0.06); f2.rotation.set(0.2, 0, -1.25); FUN.add(f2);

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

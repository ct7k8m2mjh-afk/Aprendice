/* eslint-disable */
import { THREE, V, TAU, plast, semente, malha, esfera, pedeRedesenho } from '../base.js';
import { mergeGeometries, mergeVertices, toCreasedNormals } from 'three/addons/utils/BufferGeometryUtils.js';
import { MarchingCubes } from 'three/addons/objects/MarchingCubes.js';
const suave = (geo) => { geo.deleteAttribute('normal'); geo.deleteAttribute('uv'); const m = mergeVertices(geo, 1e-5); m.computeVertexNormals(); return m; }; // extrusões com sombreamento liso

// =====================================================================================
// BIOLOGIA — célula animal em corte (referência aprovada: docs/referencias/icones3d/celula.png).
// Corte: UM QUARTO do volume removido (a metade de cima da frente): uma parede vertical (meio disco, plano x=0)
// e o piso (meio disco, plano y=0); a membrana é grossa, creme, com cristas arredondadas em rede sobre alvéolos
// mais claros e borda arredondada no corte. Núcleo apoiado no piso, com um oitavo removido (envoltório vermelho,
// camada creme com cromossomos roxos, nucleoplasma vermelho-escuro com grânulos). Retículo (rede ciano) na parede e
// no piso; retículo rugoso (sacos laranja) abraçando o núcleo; Golgi azul dobrado; mitocôndrias roxas abertas com
// cristas; retículo liso magenta no alto da parede; centríolos dourados num funil de rede ciano; ribossomos.
// Função: vesículas saem do Golgi rumo à membrana e se fundem a ela (secreção). Nada pulsa.
// Coordenadas internas: centro da célula na origem, raio 1; quarto removido em x>0 e y>0.
// Parede: ponto (s, y) -> (0, y, -s) [s cresce para a direita da imagem]; piso: (x, z) -> (x, 0, z).

const Wp = (s, y, h = 0) => V(h, y, -s);
// ---------- texturas PINTADAS (procedurais, geradas por texturas/celula-gera.py; a referência só serve de olho)
const URL_TEX = { parede: new URL('../texturas/celula-parede.webp', import.meta.url).href, piso: new URL('../texturas/celula-piso.webp', import.meta.url).href,
  funil: new URL('../texturas/celula-funil.webp', import.meta.url).href, membrana: new URL('../texturas/celula-membrana.webp', import.meta.url).href,
  membranaRelevo: new URL('../texturas/celula-membrana-relevo.webp', import.meta.url).href };
const _tex = {};
function textura(n, cor = true) { if (_tex[n]) return _tex[n]; const t = new THREE.TextureLoader().load(URL_TEX[n], () => pedeRedesenho()); if (cor) t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return (_tex[n] = t); }
// material "pintado": a cor vem quase toda da pintura (luz já desenhada nela); a luz da cena só modula de leve
function pintado(t, o = {}) {
  const m = new THREE.MeshLambertMaterial({ color: new THREE.Color(o.luz ?? 0.3, o.luz ?? 0.3, o.luz ?? 0.3), map: t, emissive: 0xffffff, emissiveMap: t, emissiveIntensity: o.emis ?? 0.8,
    side: o.lado ?? THREE.FrontSide }); // sem reflexo especular: o brilho já está pintado
  m.toneMapped = false; return m;
}
const Fp = (x, z, h = 0) => V(x, h, z);
// ruído de valor suave (determinístico), para as cristas das mitocôndrias
function ruido2(x, y, sd) {
  const h = (i, j) => { const n = Math.sin(i * 127.1 + j * 311.7 + sd * 74.7) * 43758.5453; return n - Math.floor(n); };
  const i = Math.floor(x), j = Math.floor(y), fx = x - i, fy = y - j, ux = fx * fx * (3 - 2 * fx), uy = fy * fy * (3 - 2 * fy);
  return (h(i, j) * (1 - ux) + h(i + 1, j) * ux) * (1 - uy) + (h(i, j + 1) * (1 - ux) + h(i + 1, j + 1) * ux) * uy;
}

// ---------- membrana: rede de cristas (Worley 3D no sombreador; relevo no vértice + normal analítica no pixel)
const ESC = 2.55, AMP = 0.085, T0 = '0.5', T1 = '0.88';
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
function materialMembrana(borda = false) { // borda: relevo ao longo da normal do tubo da borda do corte
  const m = plast(0xffffff, { rug: 0.9, coat: 0.0 }); m.specularIntensity = 0.08; m.envMapIntensity = 0.65;
  const dirV = borda ? 'normal' : 'normalize(position)', amp = borda ? AMP * 0.3 : AMP, ampV = borda ? AMP * 0.22 : AMP * 0.6;
  m.onBeforeCompile = (sh) => {
    const decl = `varying vec3 vOP; varying vec3 vON; varying vec3 vNX; varying vec3 vNY; varying vec3 vNZ;\n${GLSL_CRISTA}`;
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', `#include <common>\n${decl}`)
      .replace('#include <begin_vertex>', `#include <begin_vertex>\n vOP = position; vON = normal; { vec3 gq; float hv = crista(normalize(position)*${ESC.toFixed(2)}, gq); transformed += ${dirV}*${ampV.toFixed(3)}*hv; }
 vNX = normalize(normalMatrix*vec3(1.,0.,0.)); vNY = normalize(normalMatrix*vec3(0.,1.,0.)); vNZ = normalize(normalMatrix*vec3(0.,0.,1.));`);
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', `#include <common>\n${decl}`)
      .replace('#include <color_fragment>', `#include <color_fragment>
 vec3 ddM = normalize(vOP); vec3 gqM; float hM = crista(ddM*${ESC.toFixed(2)}, gqM);
 diffuseColor.rgb *= mix(0.8, 1.02, smoothstep(-0.9, 0.8, dot(ddM, normalize(vec3(-0.3, 0.5, 0.8))))); // luz de estúdio da referência (esquerda-frente), assada de leve
 diffuseColor.rgb *= mix(vec3(1.0), vec3(0.88,0.82,0.66), smoothstep(-0.3, 0.6, dot(ddM, normalize(vec3(-0.6, 0.6, 0.5))))); // lado de cima/esquerdo: creme mais quente (sem estourar)
 diffuseColor.rgb *= mix(vec3(0.86,0.81,0.67), vec3(0.88,0.68,0.31), ${borda ? '0.7+0.3*' : ''}smoothstep(0.1,0.6,hM));
 diffuseColor.rgb *= 1. - ${borda ? '0.0' : '0.15'}*smoothstep(0.0,0.25,hM)*(1.-smoothstep(0.35,0.7,hM)); // cavidade: sombra suave no pé da crista`)
      .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
 totalEmissiveRadiance += diffuseColor.rgb * ${borda ? '0.0' : '0.3'} * smoothstep(0.1, -0.7, ddM.y); // rebatedor de estúdio: a metade de baixo não fica escura`)
      .replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>
 { vec3 nB = ${borda ? 'normalize(vON)' : 'ddM'}; vec3 gp = ${ESC.toFixed(2)}*(gqM - dot(gqM,nB)*nB); vec3 nO = normalize(nB - ${amp.toFixed(3)}*gp);
   normal = normalize(vNX*nO.x + vNY*nO.y + vNZ*nO.z); }`)
      .replace('#include <clearcoat_normal_fragment_begin>', '#include <clearcoat_normal_fragment_begin>\n#ifdef USE_CLEARCOAT\n clearcoatNormal = normal;\n#endif');
  };
  return m;
}

// ---------- utilidades
function tubos(curvas, raio, segPor = 6, radial = 6) { // várias curvas -> uma só malha
  const gs = curvas.map(([c, fechada, n]) => new THREE.TubeGeometry(c, Math.max(8, n * segPor), raio, radial, fechada));
  const g = mergeGeometries(gs); gs.forEach((x) => x.dispose()); return g;
}
function tubosCarnudos(curvas, raio, inchaco = 0.7, segPor = 6, radial = 12) { // tubos que engrossam nas junções (aspecto de massinha)
  const gs = curvas.map(([c, , n]) => { const S = Math.max(10, n * segPor), geo = new THREE.TubeGeometry(c, S, raio, radial, false); const p = geo.attributes.position, cen = new THREE.Vector3(), v = new THREE.Vector3();
    for (let i = 0; i <= S; i++) { const t = i / S, f = 1 + inchaco * Math.pow(1 - Math.sin(Math.PI * t), 2); c.getPointAt(t, cen);
      for (let j = 0; j <= radial; j++) { const k = i * (radial + 1) + j; v.fromBufferAttribute(p, k).sub(cen).multiplyScalar(f).add(cen); p.setXYZ(k, v.x, v.y, v.z); } }
    geo.computeVertexNormals(); return geo; });
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
function mitocondria(L, Wd, alt, mats, sd = 1) {
  const g = new THREE.Group();
  const ext = contornoFeijao(L, Wd, 48, 0.2), int = ext.map((p) => p.clone().multiply(new THREE.Vector2(1 - 0.026 / L, 1 - 0.026 / Wd)).add(new THREE.Vector2(0, 0.0)));
  const forma = new THREE.Shape(ext); forma.holes.push(new THREE.Path(int.slice().reverse()));
  const pg = suave(new THREE.ExtrudeGeometry(forma, { depth: alt, bevelEnabled: true, bevelThickness: 0.008, bevelSize: 0.006, bevelSegments: 5, curveSegments: 8 }));
  const parede = malha(pg, mats.parede); parede.rotation.x = -Math.PI / 2; g.add(parede);
  // fundo de cristas: grade fina recortada no contorno interno; labirinto procedural (prateleiras lilases altas, sulcos
  // roxo-escuros estreitos nas linhas de nível zero de um ruído suave) com relevo REAL (deslocamento) e cor por vértice
  const fg = new THREE.PlaneGeometry(L, Wd, Math.round(L * 760), Math.round(Wd * 760)); const pp = fg.attributes.position, idx = fg.index.array, novo = [];
  const dentro = (x, y) => { let c = false; for (let i = 0, j = int.length - 1; i < int.length; j = i++) { const a = int[i], b = int[j]; if ((a.y > y) !== (b.y > y) && x < (b.x - a.x) * (y - a.y) / (b.y - a.y) + a.x) c = !c; } return c; };
  for (let i = 0; i < idx.length; i += 3) { let cx = 0, cy = 0; for (let k = 0; k < 3; k++) { cx += pp.getX(idx[i + k]) / 3; cy += pp.getY(idx[i + k]) / 3; } if (dentro(cx, cy)) novo.push(idx[i], idx[i + 1], idx[i + 2]); }
  fg.setIndex(novo);
  { const cE = new THREE.Color(0x6a32a8), cC = new THREE.Color(0xa47be0), c = new THREE.Color(), cores = new Float32Array(pp.count * 3);
    const n = (x, y) => { const wx = x + 0.007 * Math.sin(y * 95 + sd) + 0.012 * (ruido2(x * 30, y * 30, sd) - 0.5), wy = y + 0.007 * Math.sin(x * 85 + 2 * sd);
      return Math.sin(wx * 95 + 1.6 * Math.sin(wy * 45 + sd)) + 0.85 * Math.sin(wy * 105 + 1.5 * Math.sin(wx * 38 + 3 * sd)); }, e = 1e-4; // labirinto de dobras (cristas)
    for (let i = 0; i < pp.count; i++) { const x = pp.getX(i), y = pp.getY(i);
      // cristas = faixas de largura constante ao longo das linhas de nível zero (distância ≈ |n| / |grad n|) -> labirinto
      const v = n(x, y), gx = (n(x + e, y) - v) / e, gy = (n(x, y + e) - v) / e, d = Math.abs(v) / Math.max(1e-3, Math.hypot(gx, gy));
      const t = Math.min(1, Math.max(0, (0.016 - d) / 0.011)), h = Math.sqrt(t * (2 - t));
      pp.setZ(i, 0.04 * h); c.copy(cE).lerp(cC, h); cores.set([c.r, c.g, c.b], i * 3); }
    fg.setAttribute('color', new THREE.BufferAttribute(cores, 3)); fg.computeVertexNormals(); }
  const fundo = malha(fg, mats.fundo, false); fundo.receiveShadow = false; fundo.rotation.x = -Math.PI / 2; fundo.position.y = alt * 0.28; g.add(fundo);
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
  // câmera ajustada aos pontos da referência (cantos do corte, silhueta, polo)
  const camera = { pos: V(1.93, 2.54, 1.957), alvo: V(-0.05, 0.964, 0.047), fov: 41.6 };
  const g = new THREE.Group(); const C = new THREE.Group(); C.position.y = 1.0; g.add(C);
  const R = 1.0, RB = 0.972, rb = 0.042; // raio externo; borda do corte (tubo) e raio do tubo

  // ---- membrana: metade de baixo inteira + metade de cima de trás (x<0)
  //      rede de cordões de um Voronoi esférico (textura pintada + mapa de altura): deslocamento real e luz da cena
  const memRel = textura('membranaRelevo', false);
  const memM = new THREE.MeshStandardMaterial({ color: 0xf3ead6, map: textura('membrana'), displacementMap: memRel, displacementScale: 0.038, bumpMap: memRel, bumpScale: 2.2, roughness: 0.62, side: THREE.DoubleSide });
  memM.envMapIntensity = 0.65;
  const calota = (seg, anel, f0, fL, t0, tL) => { const geo = new THREE.SphereGeometry(R * 0.972, seg, anel, f0, fL, t0, tL); const uv = geo.attributes.uv;
    for (let i = 0; i < uv.count; i++) { let f = f0 + uv.getX(i) * fL; if (f < 0) f += TAU; const t = t0 + (1 - uv.getY(i)) * tL; uv.setXY(i, f / TAU, 1 - t / Math.PI); } // uv global (costura atrás, em phi = 0)
    return malha(geo, memM); };
  C.add(calota(150, 96, -Math.PI / 2, Math.PI / 2, 0, Math.PI / 2), calota(150, 96, 0, Math.PI / 2, 0, Math.PI / 2), calota(320, 80, 0, TAU, Math.PI / 2, Math.PI / 2));
  // borda arredondada do corte: arco da parede (plano x=0) e arco do piso (y=0, x>0)
  const bordaM = plast(0xdcc07a, { rug: 0.5, coat: 0.15, coatRug: 0.4 }); // lábio liso e arredondado (como na referência)
  const c3 = (fn) => { const cur = new THREE.Curve(); cur.getPoint = (t, alvo = new THREE.Vector3()) => alvo.copy(fn(t)); return cur; };
  const ond = (a) => 1 + 0.008 * Math.sin(a * 23 + 0.7) + 0.005 * Math.sin(a * 41 + 2.1); // lábio ondulado (cordões)
  const cParede = c3((t) => { const a = Math.PI * t, r = RB * ond(a); return V(0, Math.sin(a) * r, Math.cos(a) * r); });
  const cPiso = c3((t) => { const a = Math.PI * t - Math.PI / 2, r = RB * ond(a + 5); return V(Math.cos(a) * r, 0, -Math.sin(a) * r); });
  C.add(malha(tubos([[cParede, false, 40], [cPiso, false, 40]], rb, 4, 20), bordaM));
  for (const z of [1, -1]) { const e = esfera(rb * 1.04, bordaM, 24); e.position.set(0, 0, z * RB); C.add(e); }

  // ---- parede e piso do corte (meio discos), com sombreamento de contato embutido por vértice
  // funil do centríolo: cone fundo que sai do canto parede/piso com a boca virada para quem olha (medido na referência)
  const FUN_M = V(0.1, 0.14, 0.76), FUN_U = V(1, 0.3, 0.25).normalize(), FUN_PERFIL = [[0.012, -0.42], [0.03, -0.37], [0.05, -0.3], [0.072, -0.21], [0.095, -0.12], [0.115, -0.05], [0.13, 0]];
  const raioFunil = (t) => { const P = FUN_PERFIL; for (let i = P.length - 1; i > 0; i--) { const [r0, y0] = P[i], [r1, y1] = P[i - 1]; if (-t <= y0 && -t >= y1) return r1 + (r0 - r1) * (-t - y1) / (y0 - y1); } return -1; };
  const dentroFunil = (q) => { const v = q.clone().sub(FUN_M); const t = -v.dot(FUN_U); if (t < -0.02) return false; const r = raioFunil(Math.max(0, t)); return r > 0 && v.add(FUN_U.clone().multiplyScalar(t)).length() < r + 0.004; };
  const corte = (paraMundo, uvDe) => { // paraMundo: (x,y) local do meio disco -> ponto da célula (para abrir o furo do funil)
    const geo = new THREE.RingGeometry(0.0005, RB, 160, 56, 0, Math.PI); const p = geo.attributes.position;
    { const idx = geo.index.array, novo = []; for (let i = 0; i < idx.length; i += 3) { let cx = 0, cy = 0; for (let k = 0; k < 3; k++) { cx += p.getX(idx[i + k]) / 3; cy += p.getY(idx[i + k]) / 3; }
      if (!dentroFunil(paraMundo(cx, cy))) novo.push(idx[i], idx[i + 1], idx[i + 2]); } geo.setIndex(novo); }
    const uv = geo.attributes.uv; for (let i = 0; i < p.count; i++) uv.setXY(i, ...uvDe(p.getX(i), p.getY(i)));
    return geo;
  };
  // parede: local (x,y) -> (0, y, -x): s = x; textura u=(s+1)/2, v=y.  piso: local (x,y) -> (y, 0, x): u=(1-z)/2, v=x_mundo
  const parede = malha(corte((x, y) => V(0, y, -x), (x, y) => [(x + 1) / 2, y]), pintado(textura('parede'), { emis: 0.78, luz: 0.28 })); parede.rotation.y = Math.PI / 2; C.add(parede);
  const piso = malha(corte((x, y) => V(y, 0, x), (x, y) => [(1 - x) / 2, y]), pintado(textura('piso'), { emis: 0.8, luz: 0.25 })); piso.rotation.set(-Math.PI / 2, 0, -Math.PI / 2); C.add(piso);
  piso.updateMatrix();

  // ---- retículo endoplasmático (rede ciano): pintado na textura da parede e do piso
  const ciano = plast(0x0c92c4, { rug: 0.3, coat: 0.7, coatRug: 0.2 });

  rnd = semente(21);
  // ---- núcleo: esfera com um oitavo removido (voltado à câmera); camadas no corte
  const RN = 0.266, RC = 0.158; const NC = V(0.256, 0.14, 0.183); // ajustado à referência: o núcleo afunda um pouco no piso
  const N = new THREE.Group(); N.position.copy(NC); N.rotation.y = -0.193; C.add(N);
  const verm = plast(0xa01218, { rug: 0.55, coat: 0.1, coatRug: 0.4 }); verm.envMapIntensity = 0.5;
  N.add(malha(new THREE.SphereGeometry(RN, 96, 48, Math.PI, Math.PI * 1.5, 0, Math.PI / 2), verm), malha(new THREE.SphereGeometry(RN, 96, 48, 0, TAU, Math.PI / 2, Math.PI / 2), verm));
  // faces do corte: envoltório vermelho FINO + camada creme; nucleoplasma vermelho-escuro afundado (cavidade) com grânulos
  const creme = plast(0xf2dfb2, { rug: 0.6, coat: 0.12, lado: THREE.DoubleSide }), vermF = plast(0xb3161c, { rug: 0.5, coat: 0.15, lado: THREE.DoubleSide });
  const ENV = 0.014;
  const faces = [[0, 0, 0], [0, -Math.PI / 2, 0], [Math.PI / 2, 0, 0]]; // quartos de anel nos planos z=0 (x,y>0), x=0 (z,y>0), y=0 (x,z>0)
  for (const [rx, ry] of faces) for (const m of [malha(new THREE.RingGeometry(RN - ENV, RN, 64, 1, 0, Math.PI / 2), vermF), malha(new THREE.RingGeometry(RC, RN - ENV, 64, 3, 0, Math.PI / 2), creme)]) { m.rotation.set(rx, ry, 0, 'YXZ'); N.add(m); }
  const fossaM = plast(0x6c1016, { rug: 0.55, coat: 0.2, lado: THREE.BackSide }); N.add(malha(new THREE.SphereGeometry(RC, 48, 24), fossaM, false));
  const granM = plast(0x2a0507, { rug: 0.6, coat: 0, lado: THREE.DoubleSide }), granG = new THREE.CircleGeometry(0.0115, 16);
  for (let i = 0; i < 70; i++) { const yy = 1 - (i + 0.5) / 70 * 2, r2 = Math.sqrt(1 - yy * yy), ph = i * 2.39996; const d = V(Math.cos(ph) * r2, yy, Math.sin(ph) * r2);
    if (d.x > -0.05 && d.y > -0.05 && d.z > -0.05) continue; const p = malha(granG, granM, false); p.position.copy(d.clone().multiplyScalar(RC * 0.993)); p.lookAt(0, 0, 0); N.add(p); }
  // cromatina: FIOS roxos soltos nas faces creme (na interfase não há cromossomo em "X"; o X só existe na divisão)
  const roxo = plast(0x7650c8, { rug: 0.4, coat: 0.4 }); const fios = [];
  const naFace = (u, v, face) => face === 0 ? V(u, v, 0.004) : face === 1 ? V(0.004, v, u) : V(u, 0.004, v);
  for (let f = 0; f < 3; f++) for (let k = 0; k < 4; k++) {
    let a = (k + 0.5) / 4 * Math.PI / 2 + (rnd() - 0.5) * 0.25, r = RC + 0.022 + rnd() * 0.05; const pts = [];
    for (let j = 0; j < 6; j++) { pts.push(naFace(Math.cos(a) * r, Math.sin(a) * r, f)); a += (rnd() - 0.5) * 0.28; r = Math.min(RN - ENV - 0.014, Math.max(RC + 0.012, r + (rnd() - 0.5) * 0.03));
      a = Math.min(Math.PI / 2 - 0.06, Math.max(0.06, a)); }
    fios.push([new THREE.CatmullRomCurve3(pts), false, 5]); }
  N.add(malha(tubos(fios, 0.0036, 6, 6), roxo, false));
  // poros do envoltório
  const poroM = plast(0x5a0a0c, { rug: 0.7, coat: 0 }), poroC = plast(0xb7967a, { rug: 0.7, coat: 0 });
  for (let i = 0; i < 40; i++) { const d = new THREE.Vector3().setFromSphericalCoords(1, 0.2 + rnd() * 1.6, rnd() * TAU); if (d.x > -0.1 && d.y > -0.1 && d.z > -0.1) continue;
    const p = new THREE.Group(); p.add(malha(new THREE.RingGeometry(0.0105, 0.0155, 20), poroM, false), malha(new THREE.CircleGeometry(0.0108, 20), poroC, false)); // poro: furo com fundo creme e borda escura
    p.scale.y = 1.25; p.position.copy(d.clone().multiplyScalar(RN * 1.003)); p.lookAt(d.clone().multiplyScalar(5).add(p.position)); N.add(p); }

  rnd = semente(31);
  // ---- retículo rugoso: sacos GROSSOS laranja-telha (travesseiros curvos que acompanham a esfera), colados em colar
  //      de 2–3 camadas em volta do núcleo, fora do oitavo aberto; fileiras deitadas no piso em volta da base
  const laranja = plast(0xa9561f, { rug: 0.6, coat: 0.1, coatRug: 0.5 }); laranja.envMapIntensity = 0.45;
  const geoSaco = {};
  const saco = (L, Wd, T, Rb) => { const k = [L, Wd, T, Rb].map((x) => x.toFixed(3)).join(); if (geoSaco[k]) return geoSaco[k];
    const geo = new THREE.SphereGeometry(1, 30, 14); const p = geo.attributes.position;
    for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
      // travesseiro: pontas rombudas, laterais cheias, espessura que afina um pouco nas pontas e nas bordas
      const sx = Math.sign(x) * Math.pow(Math.abs(x), 0.72) * L / 2, sy = Math.sign(y) * Math.pow(Math.abs(y), 0.78) * Wd / 2;
      const sz = z * T / 2 * (1 - 0.22 * x * x);
      const a = sx / Rb, b = sy / Rb, r = Rb + sz; // dobrado sobre a esfera de raio Rb (centro em -Rb no eixo z)
      p.setXYZ(i, r * Math.sin(a) * Math.cos(b), r * Math.sin(b), r * Math.cos(a) * Math.cos(b) - Rb); }
    return (geoSaco[k] = suave(geo)); };
  const T0 = 0.058, camH = V(camera.pos.x - NC.x, 0, camera.pos.z - NC.z).normalize(), esqH = V(-camH.z, 0, camH.x);
  const NL = new THREE.Matrix4().makeRotationY(-N.rotation.y); // para testar o oitavo aberto no referencial do núcleo
  const dirAE = (az, el) => { const A = az * Math.PI / 180, E = el * Math.PI / 180; return camH.clone().multiplyScalar(Math.cos(A) * Math.cos(E)).add(esqH.clone().multiplyScalar(Math.sin(A) * Math.cos(E))).add(V(0, Math.sin(E), 0)).normalize(); };
  // [azimute (+ = esquerda da imagem, 0 = de frente), elevação, camada, giro do comprimento (0 = deitado, 90 = em pé), comprimento]
  const sacosRER = [];
  const RER = [ // [azimute, elevação, camada, giro, comprimento, largura]
    // colar esquerdo: cortinas em pé, coladas, e um saco grande por fora
    [52, 6, 0, 86, 0.28, 0.1], [68, 4, 0, 89, 0.3, 0.1], [84, 6, 0, 92, 0.28, 0.1], [100, 8, 0, 95, 0.25, 0.1],
    [60, -2, 1, 85, 0.3, 0.105], [77, 0, 1, 90, 0.31, 0.105], [94, 2, 1, 94, 0.27, 0.1], [70, -6, 2, 84, 0.3, 0.12], [38, -3, 1, 26, 0.28, 0.11, 1], // este cobre o canto de baixo à esquerda do corte, como na referência
    // topo: telhas largas deitadas, empilhadas atrás/em cima do núcleo (como na referência: o monte aparece acima do polo, puxado para a direita)
    [58, 44, 0, 8, 0.27, 0.11], [92, 50, 0, 4, 0.28, 0.11], [74, 32, 1, 10, 0.28, 0.11],
    [150, 40, 0, 0, 0.28, 0.11], [185, 38, 0, 0, 0.29, 0.115], [220, 38, 0, -4, 0.28, 0.115], [252, 40, 0, -8, 0.26, 0.11],
    [168, 56, 1, 0, 0.28, 0.115], [205, 54, 1, -2, 0.28, 0.115], [240, 54, 1, -6, 0.26, 0.11], [120, 62, 1, 4, 0.26, 0.11],
    [-100, 40, 0, -20, 0.22, 0.1],
    // direita: só embaixo (o lado direito do núcleo fica à mostra, com poros)
    [-60, -14, 0, 92, 0.21, 0.095], [-74, -18, 0, 90, 0.21, 0.095], [-88, -20, 0, 88, 0.2, 0.095], [-68, -24, 1, 86, 0.2, 0.095], [-84, -28, 1, 84, 0.19, 0.095],
  ];
  for (const [az, el, cam, psi, L, Wd, naFrente] of RER) {
    const d = dirAE(az, el), dl = d.clone().applyMatrix4(NL);
    if (!naFrente && dl.x > -0.12 && dl.y > -0.12 && dl.z > -0.12) continue; // nunca sobre o oitavo aberto
    const rS = RN + T0 / 2 + 0.003 + cam * (T0 * 0.66) + 0; // as telhas de cima ficam empilhadas um pouco mais alto
    const leste = V(0, 1, 0).cross(d); if (leste.lengthSq() < 1e-4) leste.set(1, 0, 0); leste.normalize(); const norte = d.clone().cross(leste);
    const P = psi * Math.PI / 180, eixo = leste.clone().multiplyScalar(Math.cos(P)).add(norte.clone().multiplyScalar(Math.sin(P))), yy = d.clone().cross(eixo);
    const m = malha(saco(L, Wd, T0, rS), laranja); m.position.copy(NC).add(d.clone().multiplyScalar(rS));
    m.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(eixo, yy, d)); C.add(m); sacosRER.push(m);
  }
  rnd = semente(31);
  for (const [a0, r, h, inc, L] of [ // fileiras deitadas no piso em volta da base (ângulo em torno do núcleo, raio, altura, inclinação para o núcleo)
    [-84, 0.275, 0.034, 0.8, 0.2], [-56, 0.275, 0.034, 0.8, 0.22], [-27, 0.275, 0.034, 0.8, 0.23], [2, 0.275, 0.034, 0.8, 0.23], [30, 0.28, 0.034, 0.8, 0.22],
    [-70, 0.345, 0.028, 0.3, 0.21], [-40, 0.35, 0.028, 0.28, 0.22], [-10, 0.35, 0.028, 0.28, 0.22], [18, 0.345, 0.028, 0.3, 0.2]]) {
    const d = dirAE(a0, 0); const m = malha(saco(L, 0.11, T0, 0.6), laranja);
    m.position.copy(NC).setY(h).add(d.clone().multiplyScalar(r));
    const tg = V(0, 1, 0).cross(d).normalize(); const up = V(0, 1, 0).applyAxisAngle(tg, -inc); // face de cima inclinada para o núcleo
    m.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(tg, up.clone().cross(tg), up)); m.rotateZ((rnd() - 0.5) * 0.15); C.add(m);
  }

  // ---- Golgi: cisternas azuis achatadas em pé, abertas em cima (corte), unidas como uma lâmina dobrada:
  //      fileira de trás alta e alongada em profundidade, fileira da frente baixa (face trans, voltada à membrana)
  const azul = plast(0x24368c, { rug: 0.42, coat: 0.3, coatRug: 0.3 });
  const GOL = new THREE.Group(); GOL.position.set(0.7, 0, -0.29); GOL.rotation.y = 0.55; GOL.scale.setScalar(0.8); C.add(GOL);
  const cisterna = (a, b, h, esp = 0.017) => { const s = new THREE.Shape(); s.absellipse(0, 0, a, b, 0, TAU); const f = new THREE.Path(); f.absellipse(0, 0, a - esp, b - esp, 0, TAU, true); s.holes.push(f);
    const m = malha(suave(new THREE.ExtrudeGeometry(s, { depth: h, bevelEnabled: true, bevelThickness: 0.009, bevelSize: 0.008, bevelSegments: 4, curveSegments: 28 })), azul); m.rotation.x = -Math.PI / 2; return m; };
  const fitaG = fitaGrossa(meandro([0.23, 0.28, 0.19], 0.07, 0.03), 0.024, 0.075, azul); fitaG.geometry = suave(fitaG.geometry);
  { const pp = fitaG.geometry.attributes.position; for (let i = 0; i < pp.count; i++) { const x = pp.getX(i) - 0.17; pp.setZ(i, pp.getZ(i) + 0.9 * x * x); } fitaG.geometry.computeVertexNormals(); }
  fitaG.position.set(-0.17, 0, -0.1); GOL.add(fitaG);
  for (const [x, z, a, b, h, inc] of [[-0.115, 0.05, 0.058, 0.034, 0.15, 0.12], [0.0, 0.055, 0.042, 0.03, 0.2, -0.05], [0.105, 0.06, 0.036, 0.026, 0.15, -0.14]]) {
    const c = cisterna(a, b, h); c.position.set(x, 0.008, z); c.rotation.z = inc; GOL.add(c); }

  // ---- mitocôndrias abertas: duas no piso, duas encaixadas na parede
  // parede lisa e alta, roxa brilhante; fundo de cristas procedural (cor por vértice, relevo real)
  const mitM = { parede: plast(0x7a1fa6, { rug: 0.32, coat: 0.6, coatRug: 0.18 }), fundo: plast(0xffffff, { vcores: true, rug: 0.45, coat: 0.25, coatRug: 0.3 }) };
  const mitos = [];
  for (const [x, z, ry, L, Wd] of [[0.505, 0.705, 0.527, 0.235, 0.115], [0.863, 0.211, 1.258, 0.235, 0.105]]) { const m = mitocondria(L, Wd, 0.05, mitM, mitos.length + 1); m.position.set(x, 0.0, z); m.rotation.y = ry; C.add(m); mitos.push(m); }
  for (const [s, y, ang, L, Wd, vira, h] of [[-0.434, 0.647, 2.04, 0.245, 0.12, 0, 0], [0.562, 0.208, 0.22, 0.21, 0.1, -0.95, 0.05]]) { // vira: gira a face para quem olha (descola da parede)
    const m = mitocondria(L, Wd, 0.042, mitM, mitos.length + 1); m.position.copy(Wp(s, y, h)); m.rotation.set(0, 0, -Math.PI / 2); m.rotateY(ang); m.rotateOnWorldAxis(V(0, 1, 0), vira); C.add(m); mitos.push(m); }

  rnd = semente(41);
  // ---- retículo liso: TEIA 3D de túbulos magenta (o REL é feito de túbulos ramificados), grossos e arredondados,
  //      com junções inchadas e furos entre eles; descola da parede e avança para o corte, no alto à direita
  const magenta = plast(0xa8234b, { rug: 0.45, coat: 0.3, coatRug: 0.3 }); magenta.envMapIntensity = 0.6;
  // cada lóbulo: rede de túbulos FUNDIDOS (metabolas: contas de esferas ao longo dos túbulos, que se fundem como massinha,
  // com junções inchadas e furos entre os galhos); a rede é 3D: sai da parede e ondula
  for (const [cs, cy, h, nN, esc] of [[0.1, 0.8, 0.07, 9, 1.05], [0.38, 0.67, 0.1, 9, 1.0], [0.63, 0.49, 0.13, 8, 0.95]]) {
    const cen = Wp(cs, cy, h), nf = V(0.55, 0.25, 0.8).normalize(), u = V(0, 1, 0).cross(nf).normalize(), w = nf.clone().cross(u);
    const HS = 0.22, RES = 100; const mc = new MarchingCubes(RES, magenta, false, false, 60000); mc.isolation = 80;
    const bola = (a, b, c, r) => { const S = 22; mc.addBall(0.5 + a / HS / 2, 0.5 + b / HS / 2, 0.5 + c / HS / 2, (r / HS / 2) ** 2 * (mc.isolation + S) , S); };
    const pts = [];
    for (let t = 0; pts.length < nN && t < 300; t++) { const ang = rnd() * TAU, rr = Math.sqrt(rnd()) * 0.135 * esc; const a = Math.cos(ang) * rr, bb = Math.sin(ang) * rr * 0.85;
      if (pts.some((q) => Math.hypot(q[0] - a, q[1] - bb) < 0.07 * esc)) continue; pts.push([a, bb, (rnd() - 0.3) * 0.09]); }
    const ar = new Set(), seg = (A, B, M, r0, r1) => { for (let i = 0; i <= 14; i++) { const t = i / 14, it = 1 - t; // curva de Bézier quadrática
        const x = it * it * A[0] + 2 * it * t * M[0] + t * t * B[0], y = it * it * A[1] + 2 * it * t * M[1] + t * t * B[1], z = it * it * A[2] + 2 * it * t * M[2] + t * t * B[2];
        bola(x, y, z, r0 + (r1 - r0) * t); } };
    const liga = (i, j) => { const k = i < j ? i + ',' + j : j + ',' + i; if (i === j || ar.has(k)) return; ar.add(k); const A = pts[i], B = pts[j];
      const M = [(A[0] + B[0]) / 2 + (rnd() - 0.5) * 0.04, (A[1] + B[1]) / 2 + (rnd() - 0.5) * 0.04, (A[2] + B[2]) / 2 + 0.015 + rnd() * 0.03]; seg(A, B, M, 0.0125, 0.0125); };
    pts.forEach((q, i) => { const viz = pts.map((r, j) => [Math.hypot(r[0] - q[0], r[1] - q[1]), j]).sort((x, y) => x[0] - y[0]); liga(i, viz[1][1]); liga(i, viz[2][1]); });
    pts.forEach((q) => bola(q[0], q[1], q[2], 0.019 + rnd() * 0.005)); // junções inchadas
    for (let k = 0; k < 3; k++) { const q = pts[Math.floor(rnd() * pts.length)], ang = Math.atan2(q[1], q[0]) + (rnd() - 0.5) * 0.9, L = 0.06 + rnd() * 0.05; // dedos de ponta redonda
      const B = [q[0] + Math.cos(ang) * L, q[1] + Math.sin(ang) * L, q[2] + 0.03 * rnd()]; seg(q, B, [(q[0] + B[0]) / 2, (q[1] + B[1]) / 2, (q[2] + B[2]) / 2 + 0.012], 0.012, 0.014); bola(...B, 0.017); }
    mc.update(); mc.position.copy(cen); mc.scale.setScalar(HS); mc.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(u, w, nf)); mc.castShadow = mc.receiveShadow = true; C.add(mc);
  }

  rnd = semente(51);
  // ---- centríolos: funil de rede ciano na parede (canto inferior esquerdo) com feixes dourados
  const FUN = new THREE.Group(); C.add(FUN);
  // funil FUNDO de rede ciano orgânica (textura pintada com furos transparentes) sobre um cone escuro por trás
  const funilGeo = new THREE.LatheGeometry(FUN_PERFIL.map(([r, y]) => new THREE.Vector2(r, y)), 72);
  const tFun = textura('funil'); tFun.wrapS = THREE.RepeatWrapping;
  const funil = malha(funilGeo, new THREE.MeshStandardMaterial({ map: tFun, alphaTest: 0.5, side: THREE.DoubleSide, roughness: 0.32 }));
  const fundoF = malha(new THREE.LatheGeometry(FUN_PERFIL.map(([r, y]) => new THREE.Vector2(r * 1.03 + 0.002, y - 0.006)).slice(0, -2), 72), plast(0x0b3a4c, { rug: 0.8, coat: 0, lado: THREE.DoubleSide }), false);
  for (const m of [funil, fundoF]) { m.position.copy(FUN_M); m.quaternion.setFromUnitVectors(V(0, 1, 0), FUN_U); FUN.add(m); }
  // centríolos: dois feixes de 9 trincas de microtúbulos (anel em cata-vento), dourados; um sai do funil na diagonal, o outro aparece de ponta
  const ouro = plast(0xcf9c22, { metal: 0.3, rug: 0.34, coat: 0.6, lado: THREE.DoubleSide, emis: 0x3a2800 });
  const centriolo = (L, rA, rt = 0.0036) => { const b = new THREE.Group(); const gT = new THREE.CylinderGeometry(rt, rt, L, 8, 1, true);
    for (let k = 0; k < 9; k++) for (let j = 0; j < 3; j++) { const a = k / 9 * TAU + j * 0.09, r = rA + j * 0.0072; const t = malha(gT, ouro); t.receiveShadow = false; t.position.set(Math.cos(a) * r, (rnd() - 0.5) * 0.006, Math.sin(a) * r); b.add(t); }
    return b; };
  const poe = (b, de, ate) => { const d = ate.clone().sub(de); b.position.copy(de).add(ate).multiplyScalar(0.5); b.quaternion.setFromUnitVectors(V(0, 1, 0), d.normalize()); FUN.add(b); };
  poe(centriolo(0.26, 0.021), V(0.075, 0.025, 0.826), V(0.1, 0.161, 0.612)); // de lado, saindo do funil
  { const fim = V(0.03, 0.176, 0.745), dir = camera.pos.clone().sub(fim.clone().add(V(0, 1, 0))).normalize(); // de ponta: eixo apontado para quem olha (anel de 9 trincas)
    const dobra = dir.clone().add(V(0, -0.08, 0.04)).normalize(); poe(centriolo(0.12, 0.023, 0.004), fim.clone().sub(dobra.multiplyScalar(0.12)), fim); }

  // ---- sombras de contato (oclusão suave) no piso e na parede, sob/atrás das organelas
  const ocl = (() => { const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d'); const gr = x.createRadialGradient(64, 64, 0, 64, 64, 64);
    gr.addColorStop(0, 'rgba(60,40,20,0.55)'); gr.addColorStop(0.5, 'rgba(60,40,20,0.25)'); gr.addColorStop(1, 'rgba(60,40,20,0)'); x.fillStyle = gr; x.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c); })();
  const oclM = new THREE.MeshBasicMaterial({ map: ocl, transparent: true, depthWrite: false });
  const mancha = (p, n, sx, sy, rot = 0, op = 1) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(sx, sy), op === 1 ? oclM : Object.assign(oclM.clone(), { opacity: op })); m.position.copy(p).add(n.clone().multiplyScalar(0.003));
    m.quaternion.setFromUnitVectors(V(0, 0, 1), n); m.rotateZ(rot); m.renderOrder = 1; C.add(m); };
  const cima = V(0, 1, 0), fora = V(1, 0, 0);
  mancha(Fp(NC.x, NC.z), cima, 0.78, 0.78);                                   // núcleo + RER
  mancha(Fp(0.7, -0.29), cima, 0.36, 0.3, -0.55);                          // Golgi
  mancha(Wp(0.42, 0.66), fora, 0.75, 0.5, -0.4, 0.55);                       // retículo liso
  // (sombras das mitocôndrias: já pintadas na textura do piso e da parede)
  mancha(Wp(0.1, 0.12), fora, 0.9, 0.5, 0, 0.7);                             // núcleo encostado na parede
  rnd = semente(61);
  // ---- ribossomos (grupinhos de 3–4 grãos vermelho-escuros)
  const ribM = plast(0x6e0d0d, { rug: 0.35, coat: 0.5 }); const ribG = new THREE.SphereGeometry(1, 12, 8); const ribs = [];
  const ribo = (p, n) => { const q = new THREE.Quaternion().setFromUnitVectors(V(0, 1, 0), n); const ang = rnd() * TAU;
    for (let k = 0; k < 4; k++) { const r = k < 3 ? 0.0135 : 0.01; const a = ang + k * 2.1; const off = k < 3 ? V(Math.cos(a) * 0.012, r * 0.7, Math.sin(a) * 0.012) : V(0, r * 1.6, 0);
      ribs.push(new THREE.Matrix4().compose(p.clone().add(off.applyQuaternion(q)), q, V(r, r, r))); } };
  for (const [s, y] of [[0.0, 0.9], [-0.13, 0.85], [-0.24, 0.59], [-0.45, 0.48], [0.79, 0.2], [0.75, 0.38], [0.86, 0.43], [-0.62, 0.42]]) ribo(Wp(s, y, 0), V(1, 0, 0));
  for (const [x, z] of [[0.11, -0.71], [0.33, 0.62], [0.45, 0.42], [0.63, 0.24], [0.79, 0.04], [0.28, 0.85], [0.66, -0.55], [0.5, -0.5]]) ribo(Fp(x, z), V(0, 1, 0));
  for (let k = 0; k < 7; k++) ribo(Fp(0.6 + k * 0.024, 0.63 - k * 0.035), V(0, 1, 0));
  // ribossomos do retículo RUGOSO: grãos na face de fora de cada saco (é o que o torna "rugoso")
  { const pv = new THREE.Vector3(), nv = new THREE.Vector3(), q = new THREE.Quaternion();
    for (const m of sacosRER) { m.updateMatrix(); const pos = m.geometry.attributes.position, nor = m.geometry.attributes.normal; const nm = new THREE.Matrix3().getNormalMatrix(m.matrix);
      for (let k = 0, pegos = 0; k < 400 && pegos < 9; k++) { const i = Math.floor(rnd() * pos.count); nv.fromBufferAttribute(nor, i); if (nv.z < 0.75) continue;
        pv.fromBufferAttribute(pos, i).applyMatrix4(m.matrix); nv.applyMatrix3(nm).normalize(); const r = 0.0062;
        q.setFromUnitVectors(V(0, 1, 0), nv); ribs.push(new THREE.Matrix4().compose(pv.clone().add(nv.clone().multiplyScalar(r * 0.5)), q, V(r, r, r))); pegos++; } } }
  const ribI = new THREE.InstancedMesh(ribG, ribM, ribs.length); ribs.forEach((m, i) => ribI.setMatrixAt(i, m)); ribI.castShadow = true; C.add(ribI);

  // ---- vesículas de secreção: saem da face trans do Golgi rumo à membrana
  const vesM = plast(0x4a6cf0, { rug: 0.2, coat: 1, transp: true, opac: 0 }); const ves = [];
  for (let i = 0; i < 4; i++) { const v = esfera(0.03, vesM.clone(), 20); C.add(v); ves.push(v); }
  const ini = V(0.76, 0.17, -0.22), fim = V(0.87, 0.07, -0.37);

  return {
    grupo: g, camera,
    // uma vez por ativação (pesquisa: 1–2,5 s, sem laço); terminado, fica no estado final
    _passo(t, ativo, dur) { if (ativo && !this._at && (this._t0 == null || t - this._t0 >= dur)) this._t0 = t; this._at = ativo;
      if (this._t0 == null) return 1; const p = Math.min(1, Math.max(0, (t - this._t0) / dur)); return p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2; },
    animar(t, ativo, dt) {
      // secreção: as vesículas saem do Golgi e vão até a membrana UMA vez (em sequência) e somem ao se fundir; nada pulsa
      const p = this._passo(t, ativo, 2.4);
      const andando = this._t0 != null && p < 1;
      ves.forEach((v, i) => { const s = Math.min(1, Math.max(0, p * 1.6 - i * 0.2)); v.position.lerpVectors(ini, fim, s); v.position.y += Math.sin(s * Math.PI) * 0.05;
        v.material.opacity = andando ? Math.sin(s * Math.PI) : 0; });
      mitos.forEach((m) => m.scale.setScalar(1));
    },
  };
}

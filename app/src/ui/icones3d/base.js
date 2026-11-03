// Ícones 3D do Aprendice em Three.js (tempo real, interativos).
// Cada cena é construída a partir da referência aprovada pelo dono e anima pela FUNÇÃO do objeto
// (docs/animacoes-dos-icones.md). Luz de frente e de cima; o "chão" recebe a sombra, que cai para trás.
// Uso: const c = CENAS.celula(); c.grupo (THREE.Group), c.animar(t, ativo, dt), c.camera {pos, alvo, fov}.
import * as THREE from 'three';
export { THREE };

export const V = (x, y, z) => new THREE.Vector3(x, y, z);
export const TAU = Math.PI * 2;

// ---------- materiais
export function plast(cor, o = {}) {
  return new THREE.MeshPhysicalMaterial({
    color: cor, roughness: o.rug ?? 0.32, metalness: o.metal ?? 0, clearcoat: o.coat ?? 0.6, clearcoatRoughness: o.coatRug ?? 0.18,
    sheen: o.sheen ?? 0, sheenColor: o.sheenCor ?? 0xffffff, emissive: o.emis ?? 0x000000, emissiveIntensity: o.emisI ?? 1,
    side: o.lado ?? THREE.FrontSide, transparent: !!o.transp, opacity: o.opac ?? 1, transmission: o.trans ?? 0,
    thickness: o.esp ?? 0, ior: o.ior ?? 1.5, map: o.map ?? null, bumpMap: o.bump ?? null, bumpScale: o.bumpE ?? 1,
    vertexColors: !!o.vcores, flatShading: false,
  });
}
export const metal = (cor, rug = 0.25) => plast(cor, { metal: 1, rug, coat: 0.3 });

// textura de ruído fino (relevo sutil, tira o aspecto de plástico chapado)
let _ruido;
export function ruido() {
  if (_ruido) return _ruido;
  const c = document.createElement('canvas'); c.width = c.height = 256; const g = c.getContext('2d');
  const im = g.createImageData(256, 256);
  for (let i = 0; i < im.data.length; i += 4) { const v = 128 + (Math.random() - 0.5) * 70; im.data[i] = im.data[i + 1] = im.data[i + 2] = v; im.data[i + 3] = 255; }
  g.putImageData(im, 0, 0); g.filter = 'blur(1px)'; g.drawImage(c, 0, 0);
  _ruido = new THREE.CanvasTexture(c); _ruido.wrapS = _ruido.wrapT = THREE.RepeatWrapping; _ruido.repeat.set(3, 3);
  return _ruido;
}

export function semente(n) { let x = n * 9301 + 49297; return () => ((x = (x * 9301 + 49297) % 233280) / 233280); }
export function texPaginas() { // borda das páginas: creme com linhas finas
  const c = document.createElement('canvas'); c.width = 64; c.height = 256; const x = c.getContext('2d'); x.fillStyle = '#f2e7cc'; x.fillRect(0, 0, 64, 256);
  for (let y = 0; y < 256; y += 3) { x.fillStyle = `rgba(150,120,70,${0.12 + Math.random() * 0.12})`; x.fillRect(0, y, 64, 1); }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
export function texPena() { // pena: barbas diagonais a partir da raque, mais escura na base
  const c = document.createElement('canvas'); c.width = 128; c.height = 512; const x = c.getContext('2d');
  const gr = x.createLinearGradient(0, 512, 0, 0); gr.addColorStop(0, '#c9ae7a'); gr.addColorStop(0.35, '#efe0bf'); gr.addColorStop(1, '#fbf4e4'); x.fillStyle = gr; x.fillRect(0, 0, 128, 512);
  x.strokeStyle = 'rgba(150,120,80,.35)'; x.lineWidth = 1; for (let y = 0; y < 560; y += 5) { x.beginPath(); x.moveTo(64, y); x.lineTo(0, y - 40); x.moveTo(64, y); x.lineTo(128, y - 40); x.stroke(); }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
let _brilho;
export function brilhoTex() { // ponto de luz suave (pulso de corrente)
  if (_brilho) return _brilho;
  const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d');
  const gr = x.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, 'rgba(255,255,235,1)'); gr.addColorStop(0.25, 'rgba(255,230,120,.9)'); gr.addColorStop(1, 'rgba(255,180,0,0)');
  x.fillStyle = gr; x.fillRect(0, 0, 128, 128); _brilho = new THREE.CanvasTexture(c); return _brilho;
}
export function malha(geo, mat, sombra = true) { const m = new THREE.Mesh(geo, mat); m.castShadow = sombra; m.receiveShadow = true; return m; }
export function esfera(r, mat, seg = 32) { return malha(new THREE.SphereGeometry(r, seg, Math.max(12, seg / 2)), mat); }

// tubo com cantos arredondados passando por pontos (fios)
export function caminhoArredondado(pts, raio) {
  const cp = new THREE.CurvePath();
  let ant = pts[0].clone();
  for (let i = 1; i < pts.length - 1; i++) {
    const a = pts[i - 1], b = pts[i], c = pts[i + 1];
    const d1 = a.clone().sub(b).normalize(), d2 = c.clone().sub(b).normalize();
    const r = Math.min(raio, a.distanceTo(b) * 0.45, c.distanceTo(b) * 0.45);
    const p1 = b.clone().add(d1.multiplyScalar(r)), p2 = b.clone().add(d2.multiplyScalar(r));
    cp.add(new THREE.LineCurve3(ant, p1)); cp.add(new THREE.QuadraticBezierCurve3(p1, b.clone(), p2)); ant = p2;
  }
  cp.add(new THREE.LineCurve3(ant, pts[pts.length - 1].clone()));
  return cp;
}

// Pedido de redesenho: uma cena avisa o palco quando algo assíncrono termina (ex.: textura que acabou de carregar).
export const redesenho = { n: 0 };
export function pedeRedesenho() { redesenho.n++; }

/* eslint-disable */
import { THREE, V, TAU, plast, metal, ruido, semente, texPaginas, texPena, brilhoTex, malha, esfera, caminhoArredondado } from '../base.js';

// =====================================================================================
// BIOLOGIA — célula animal com UM QUARTO removido (cunha de 90°): faces do corte creme com a rede do retículo;
// núcleo no centro, cortado junto (envoltório vermelho, camada creme, nucleoplasma escuro com grânulos e cromossomos);
// retículo rugoso (sacos laranja) em volta do núcleo; Golgi azul dobrado; mitocôndrias roxas; retículo liso magenta;
// centríolos dourados; ribossomos. Função: vesículas saem do Golgi rumo à membrana; mitocôndrias pulsam (energia).
function texCorte() { // face do corte: citoplasma creme com o retículo em rede (ciano) e ribossomos; mais denso perto do eixo
  const c = document.createElement('canvas'); c.width = c.height = 1024; const x = c.getContext('2d');
  x.fillStyle = '#f4eee2'; x.fillRect(0, 0, 1024, 1024);
  const pts = []; for (let i = 0; i < 420; i++) pts.push([Math.random() * 1024, Math.random() * 1024]);
  x.strokeStyle = '#1ea8cc'; x.lineCap = 'round'; x.lineJoin = 'round';
  for (const p of pts) { const viz = pts.map((q) => [q, Math.hypot(q[0] - p[0], q[1] - p[1])]).sort((a, b) => a[1] - b[1]).slice(1, 4);
    for (const [q, d] of viz) { if (d > 110) continue; x.lineWidth = 7; x.beginPath(); x.moveTo(p[0], p[1]);
      x.quadraticCurveTo((p[0] + q[0]) / 2 + (Math.random() - 0.5) * 24, (p[1] + q[1]) / 2 + (Math.random() - 0.5) * 24, q[0], q[1]); x.stroke(); } }
  x.fillStyle = '#7a1414'; for (let i = 0; i < 40; i++) { const cx = Math.random() * 1000 + 12, cy = Math.random() * 1000 + 12; for (let k = 0; k < 3; k++) { x.beginPath(); x.arc(cx + Math.cos(k * 2.1) * 9, cy + Math.sin(k * 2.1) * 9, 7, 0, TAU); x.fill(); } }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
}
function texNucleo() { // camadas do núcleo no corte, concêntricas (o centro da textura é o centro do núcleo)
  const c = document.createElement('canvas'); c.width = c.height = 1024; const x = c.getContext('2d'); const o = 512;
  const disco = (r, cor) => { x.fillStyle = cor; x.beginPath(); x.arc(o, o, r, 0, TAU); x.fill(); };
  disco(512, '#c81a1a'); disco(468, '#efe2bd'); disco(398, '#7c1016');
  x.fillStyle = '#3a0408'; for (let i = 0; i < 160; i++) { const r = Math.random() * 380, a = Math.random() * TAU; x.beginPath(); x.arc(o + Math.cos(a) * r, o + Math.sin(a) * r, 8, 0, TAU); x.fill(); }
  x.strokeStyle = '#9a5ae6'; x.lineWidth = 11; x.lineCap = 'round';
  for (let i = 0; i < 28; i++) { const r = 80 + Math.random() * 280, a = Math.random() * TAU, cx = o + Math.cos(a) * r, cy = o + Math.sin(a) * r, q = Math.random() * 3;
    for (const sg of [1, -1]) { x.beginPath(); x.moveTo(cx - Math.cos(q + sg * 0.5) * 30, cy - Math.sin(q + sg * 0.5) * 30); x.lineTo(cx + Math.cos(q + sg * 0.5) * 30, cy + Math.sin(q + sg * 0.5) * 30); x.stroke(); } }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
// relevo em rede da membrana (cristas arredondadas sobre alvéolos), por vértice
function membranaGeo(r, segH, segV, phiLen, thetaStart, thetaLen) {
  const geo = new THREE.SphereGeometry(r, segH, segV, phiLen < TAU ? Math.PI : 0, phiLen, thetaStart, thetaLen);
  const sem = []; const rnd = semente(7); for (let i = 0; i < 64; i++) sem.push(V(rnd() * 2 - 1, rnd() * 2 - 1, rnd() * 2 - 1).normalize());
  const pos = geo.attributes.pos ?? geo.attributes.position; const v = new THREE.Vector3(); const cores = [];
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i); const d = v.clone().normalize();
    let d1 = 9, d2 = 9; for (const s of sem) { const dd = d.distanceTo(s); if (dd < d1) { d2 = d1; d1 = dd; } else if (dd < d2) d2 = dd; }
    const crista = Math.exp(-Math.pow((d2 - d1) / 0.075, 2));
    v.copy(d.multiplyScalar(r * (1 + 0.04 * crista))); pos.setXYZ(i, v.x, v.y, v.z);
    const c = new THREE.Color(0xe8d49c).lerp(new THREE.Color(0xf6ecc8), crista); cores.push(c.r, c.g, c.b);
  }
  geo.setAttribute('color', new THREE.Float32BufferAttribute(cores, 3)); geo.computeVertexNormals(); return geo;
}
export default function celula() {
  const g = new THREE.Group(); const C = new THREE.Group(); C.position.y = 1.0; g.add(C);
  const R = 1.0, RI = 0.9, PHI = Math.PI * 1.5; // casca de 270° na metade de cima; metade de baixo inteira
  const casca = plast(0xffffff, { vcores: true, rug: 0.5, coat: 0.35, coatRug: 0.3, sheen: 0.4, sheenCor: 0xfff4d8 });
  C.add(malha(membranaGeo(R, 180, 64, PHI, 0, Math.PI / 2), casca), malha(membranaGeo(R, 240, 64, TAU, Math.PI / 2, Math.PI / 2), casca));
  const dentro = plast(0xf1e8d2, { rug: 0.6, coat: 0.1, lado: THREE.BackSide });
  C.add(malha(new THREE.SphereGeometry(RI, 96, 48, Math.PI, PHI, 0, Math.PI / 2), dentro));
  // faces do corte: duas verticais (phi = 0 e phi = 270°) e o chão (equador) do quarto removido
  const corteRede = plast(0xffffff, { map: texCorte(), rug: 0.7, coat: 0.05, lado: THREE.DoubleSide });
  const quarto = (raio, mat) => malha(new THREE.CircleGeometry(raio, 64, 0, Math.PI / 2), mat);
  const fA = quarto(RI, corteRede); C.add(fA);                                      // plano XY (z=0): phi = 270°? -> face voltada para +z
  const fB = quarto(RI, corteRede); fB.rotation.y = -Math.PI / 2; C.add(fB);       // plano ZY (x=0)
  const chao = quarto(RI, corteRede); chao.rotation.x = Math.PI / 2; C.add(chao);  // plano XZ (y=0), quarto z>0
  const aroM = plast(0xe9d6a2, { rug: 0.45, coat: 0.3 });
  for (const [rx, ry] of [[0, 0], [0, -Math.PI / 2], [Math.PI / 2, 0]]) { const a = malha(new THREE.RingGeometry(RI, R, 64, 1, 0, Math.PI / 2), aroM); a.rotation.set(rx, ry, 0); C.add(a); }
  // ---- o quarto removido fica em x>0, z>0, y>0 (a câmera olha por esse lado)
  // núcleo no centro, cortado junto: casca 270° + três faces em camadas
  const RN = 0.36; const nucM = plast(0xc81a1a, { rug: 0.28, coat: 0.9, coatRug: 0.15 });
  const N = new THREE.Group(); C.add(N);
  N.add(malha(new THREE.SphereGeometry(RN, 96, 48, Math.PI, PHI, 0, Math.PI / 2), nucM), malha(new THREE.SphereGeometry(RN, 96, 48, 0, TAU, Math.PI / 2, Math.PI / 2), nucM));
  const tn = texNucleo(); const camN = plast(0xffffff, { map: tn, rug: 0.6, coat: 0.15, lado: THREE.DoubleSide });
  const nA = quarto(RN, camN); nA.position.z = 0.002; const nB = quarto(RN, camN); nB.rotation.y = -Math.PI / 2; nB.position.x = 0.002; const nC = quarto(RN, camN); nC.rotation.x = Math.PI / 2; nC.position.y = 0.002;
  N.add(nA, nB, nC);
  // poros do envelope
  for (let i = 0; i < 26; i++) { const th = Math.random() * Math.PI * 0.9, ph = Math.random() * TAU; const d = new THREE.Vector3().setFromSphericalCoords(RN * 1.003, th, ph);
    if (d.y > 0 && d.x > 0 && d.z > 0) continue; const p = malha(new THREE.CircleGeometry(0.022, 16), plast(0x5a0606, { rug: 0.6 }), false); p.position.copy(d); p.lookAt(d.clone().multiplyScalar(2)); N.add(p); }
  const nucl = esfera(0.11, plast(0x6a0a10, { rug: 0.3, coat: 0.8 }), 32); nucl.position.set(0.09, 0.07, 0.09); N.add(nucl);
  // retículo rugoso: sacos laranja achatados, empilhados em volta do núcleo (no lado visível)
  const rerM = plast(0xd8661c, { rug: 0.4, coat: 0.5, bump: ruido(), bumpE: 0.6 });
  for (let k = 0; k < 30; k++) { const a = -0.15 + Math.random() * (Math.PI / 2 + 0.3), camada = k % 2, rr = RN + 0.08 + camada * 0.07, y = 0.025 + camada * 0.04 + Math.random() * 0.05; const s = esfera(1, rerM, 24); s.scale.set(0.11, 0.035, 0.07); s.position.set(Math.cos(a) * rr, y * (1 - camada * 0.15), Math.sin(a) * rr); s.rotation.set(Math.random() * 0.3, -a + Math.PI / 2, (Math.random() - 0.5) * 0.4); C.add(s); }
  // Golgi: cisternas azuis curvas empilhadas no chão (face cis voltada ao núcleo)
  const golM = plast(0x2438c4, { rug: 0.3, coat: 0.8 }); const GOL = new THREE.Group(); GOL.position.set(0.55, 0.0, 0.32); GOL.rotation.y = -0.6; C.add(GOL);
  for (let k = 0; k < 5; k++) { const t = malha(new THREE.TorusGeometry(0.16 + k * 0.035, 0.022, 12, 40, Math.PI * 0.8), golM); t.rotation.set(Math.PI / 2, 0, Math.PI * 0.6); t.position.y = 0.04 + k * 0.045; t.scale.z = 0.6; GOL.add(t); }
  // mitocôndrias roxas com cristas
  const mitM = plast(0x6a18a8, { rug: 0.3, coat: 0.8 }), cristM = plast(0xb070e8, { rug: 0.4, coat: 0.5, emis: 0x7a2ad0, emisI: 0 });
  const mitos = [];
  for (const [x, z, ry] of [[0.25, 0.68, 0.4], [0.7, 0.05, 1.2]]) { const m = new THREE.Group(); m.position.set(x, 0.035, z); m.rotation.y = ry;
    const e = esfera(1, mitM, 40); e.scale.set(0.16, 0.05, 0.075); m.add(e);
    for (let i = 0; i < 6; i++) { const cr = malha(new THREE.TorusGeometry(0.035, 0.008, 8, 16, Math.PI), cristM); cr.position.set(-0.1 + i * 0.04, 0.035, 0); cr.rotation.y = Math.PI / 2; m.add(cr); }
    C.add(m); mitos.push(m); }
  // mitocôndria e retículo liso presos às faces do corte; centríolos dourados
  const m3 = esfera(1, mitM, 32); m3.scale.set(0.15, 0.06, 0.035); m3.position.set(0.45, 0.55, 0.02); m3.rotation.z = 0.5; C.add(m3);
  const serM = plast(0xb4264e, { rug: 0.35, coat: 0.6 });
  for (let i = 0; i < 16; i++) { const s = esfera(1, serM, 16); s.scale.set(0.06, 0.03, 0.025); s.position.set(0.02, 0.45 + Math.random() * 0.3, 0.2 + Math.random() * 0.35); s.rotation.set(Math.random() * 3, Math.random() * 3, 0); C.add(s); }
  const ouro = plast(0xe6b422, { metal: 0.5, rug: 0.3, coat: 0.6 }); const CEN = new THREE.Group(); CEN.position.set(0.5, 0.18, 0.02); C.add(CEN);
  for (const [rx, rz] of [[0, 0.6], [Math.PI / 2, 0.2]]) { const b = new THREE.Group(); b.rotation.set(rx, 0, rz);
    for (let i = 0; i < 9; i++) { const a = i / 9 * TAU; const t = malha(new THREE.CylinderGeometry(0.008, 0.008, 0.2, 6), ouro); t.position.set(Math.cos(a) * 0.035, 0, Math.sin(a) * 0.035); b.add(t); } CEN.add(b); }
  // ribossomos (trincas) no chão
  const ribM = plast(0x7a1414, { rug: 0.4 });
  for (let i = 0; i < 12; i++) { const a = Math.random() * Math.PI / 2, r = 0.45 + Math.random() * 0.4; for (let k = 0; k < 3; k++) { const s = esfera(0.016, ribM, 12); s.position.set(Math.cos(a) * r + Math.cos(k * 2.1) * 0.02, 0.016, Math.sin(a) * r + Math.sin(k * 2.1) * 0.02); C.add(s); } }
  // vesículas de secreção: saem do Golgi (face trans) rumo à membrana
  const vesM = plast(0x3f62e8, { rug: 0.2, coat: 1, transp: true, opac: 0 }); const ves = [];
  for (let i = 0; i < 4; i++) { const v = esfera(0.035, vesM.clone(), 20); C.add(v); ves.push(v); }
  const ini = V(0.62, 0.08, 0.42), fim = V(0.66, 0.1, 0.62);
  C.rotation.y = 0; g.scale.setScalar(1.0);
  return {
    grupo: g, camera: { pos: V(3.3, 2.15, 3.0), alvo: V(0.1, 0.85, 0.1), fov: 32 },
    animar(t, ativo, dt) {
      this._a = (this._a || 0) + ((ativo ? 1 : 0) - (this._a || 0)) * Math.min(1, dt * 3);
      ves.forEach((v, i) => { const s = (t * 0.35 + i / ves.length) % 1; v.position.lerpVectors(ini, fim.clone().normalize().multiplyScalar(0.86), s); v.position.y = 0.06 + Math.sin(s * Math.PI) * 0.06;
        v.material.opacity = this._a * Math.sin(s * Math.PI); });
      cristM.emissiveIntensity = this._a * (0.6 + 0.6 * Math.sin(t * 5));
      mitos.forEach((m, i) => m.scale.setScalar(1 + this._a * 0.04 * Math.sin(t * 5 + i)));
    },
  };
}

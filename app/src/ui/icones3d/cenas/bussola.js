/* eslint-disable */
import { THREE, V, TAU, plast, metal, ruido, semente, texPaginas, texPena, brilhoTex, malha, esfera, caminhoArredondado } from '../base.js';

// =====================================================================================
// GEOGRAFIA — mapa dobrado + bússola + alfinete. Função: a agulha oscila e aponta o NORTE; o alfinete marca o ponto.
function texMapa() {
  const c = document.createElement('canvas'); c.width = 512; c.height = 384; const x = c.getContext('2d');
  const gr = x.createLinearGradient(0, 0, 512, 384); gr.addColorStop(0, '#9fd36a'); gr.addColorStop(0.5, '#e8d36a'); gr.addColorStop(1, '#7cc35a'); x.fillStyle = gr; x.fillRect(0, 0, 512, 384);
  for (let i = 0; i < 40; i++) { x.strokeStyle = `rgba(90,120,40,${0.15 + Math.random() * 0.2})`; x.lineWidth = 1.5; x.beginPath(); const cx = Math.random() * 512, cy = Math.random() * 384, r = 20 + Math.random() * 60; x.ellipse(cx, cy, r, r * 0.6, Math.random() * 3, 0, TAU); x.stroke(); }
  x.strokeStyle = '#2f8fd8'; x.lineWidth = 10; x.lineCap = 'round'; x.beginPath(); x.moveTo(40, 340); x.bezierCurveTo(160, 260, 200, 180, 300, 170); x.bezierCurveTo(390, 160, 420, 90, 500, 40); x.stroke();
  x.strokeStyle = '#5fb2ea'; x.lineWidth = 4; x.beginPath(); x.moveTo(300, 170); x.bezierCurveTo(330, 230, 380, 260, 470, 300); x.stroke();
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
function bussolaTex() {
  const c = document.createElement('canvas'); c.width = c.height = 512; const x = c.getContext('2d');
  x.fillStyle = '#fbf8f0'; x.beginPath(); x.arc(256, 256, 250, 0, TAU); x.fill();
  x.strokeStyle = '#1a2a4a'; for (let i = 0; i < 72; i++) { const a = i / 72 * TAU, r1 = i % 9 === 0 ? 205 : 222; x.lineWidth = i % 9 === 0 ? 4 : 2; x.beginPath(); x.moveTo(256 + Math.sin(a) * r1, 256 - Math.cos(a) * r1); x.lineTo(256 + Math.sin(a) * 240, 256 - Math.cos(a) * 240); x.stroke(); }
  x.fillStyle = '#1a2a4a'; x.font = 'bold 64px sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle';
  [['N', 0], ['L', 1], ['S', 2], ['O', 3]].forEach(([l, k]) => { const a = k * Math.PI / 2; x.fillText(l, 256 + Math.sin(a) * 160, 256 - Math.cos(a) * 160); });
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
export default function bussola() {
  const g = new THREE.Group();
  // mapa dobrado em 4 painéis
  const tm = texMapa(); const mapa = new THREE.Group();
  for (let i = 0; i < 4; i++) {
    const geo = new THREE.PlaneGeometry(0.85, 2.0); const uv = geo.attributes.uv;
    for (let k = 0; k < uv.count; k++) uv.setX(k, (uv.getX(k) + i) / 4);
    const p = malha(geo, plast(0xffffff, { map: tm, rug: 0.75, coat: 0.05, lado: THREE.DoubleSide }));
    p.rotation.x = -Math.PI / 2 + 0.0; p.position.set(-1.275 + i * 0.85, 0.02 + (i % 2) * 0.12, 0); p.rotation.y = (i % 2 ? -1 : 1) * 0.14; mapa.add(p);
  }
  mapa.rotation.y = -0.2; mapa.position.set(0.1, 0, -0.2); g.add(mapa);
  // bússola
  const B = new THREE.Group(); B.position.set(-0.5, 0.12, 0.45); g.add(B);
  const ouro = metal(0xd4a52a, 0.22);
  const caixa = malha(new THREE.CylinderGeometry(0.72, 0.75, 0.2, 96), ouro); caixa.position.y = 0.1; B.add(caixa);
  const aro = malha(new THREE.TorusGeometry(0.71, 0.045, 20, 96), ouro); aro.rotation.x = Math.PI / 2; aro.position.y = 0.21; B.add(aro);
  const face = malha(new THREE.CircleGeometry(0.66, 96), plast(0xffffff, { map: bussolaTex(), rug: 0.5, coat: 0.2 })); face.rotation.x = -Math.PI / 2; face.position.y = 0.205; B.add(face);
  const anel = malha(new THREE.TorusGeometry(0.1, 0.035, 16, 32), ouro); anel.position.set(0, 0.25, -0.82); B.add(anel);
  const haste = malha(new THREE.CylinderGeometry(0.06, 0.06, 0.12, 24), ouro); haste.rotation.x = Math.PI / 2; haste.position.set(0, 0.2, -0.76); B.add(haste);
  const agulha = new THREE.Group(); agulha.position.y = 0.24; B.add(agulha);
  const forma = (cor) => { const s = new THREE.Shape(); s.moveTo(0, 0); s.lineTo(0.07, 0); s.lineTo(0, 0.5); s.lineTo(-0.07, 0); s.lineTo(0, 0);
    return malha(new THREE.ExtrudeGeometry(s, { depth: 0.03, bevelEnabled: true, bevelSize: 0.008, bevelThickness: 0.008, bevelSegments: 2 }), plast(cor, { rug: 0.25, coat: 1 })); };
  const nr = forma(0xd62828); nr.rotation.x = -Math.PI / 2; nr.position.y = 0.0; agulha.add(nr);
  const sr = forma(0x1f5fd6); sr.rotation.set(-Math.PI / 2, 0, Math.PI); agulha.add(sr);
  const pino = malha(new THREE.CylinderGeometry(0.045, 0.045, 0.06, 24), ouro); pino.position.y = 0.03; agulha.add(pino);
  const vidro = malha(new THREE.CircleGeometry(0.67, 96), new THREE.MeshPhysicalMaterial({ color: 0xffffff, transparent: true, opacity: 0.12, roughness: 0, clearcoat: 1 })); vidro.rotation.x = -Math.PI / 2; vidro.position.y = 0.3; B.add(vidro);
  // alfinete
  const pin = new THREE.Group(); pin.position.set(0.85, 0, -0.5); g.add(pin);
  const cab = esfera(0.22, plast(0xe02424, { rug: 0.2, coat: 1 }), 48); cab.position.y = 1.0; cab.scale.set(1, 1.1, 1); pin.add(cab);
  const ponta = malha(new THREE.ConeGeometry(0.2, 0.75, 48), plast(0xe02424, { rug: 0.2, coat: 1 })); ponta.rotation.x = Math.PI; ponta.position.y = 0.55; pin.add(ponta);
  const furo = esfera(0.08, plast(0xffffff, { rug: 0.3 }), 24); furo.position.set(0, 1.03, 0.17); pin.add(furo);
  const norte = 0; // a agulha vermelha aponta para o norte (eixo -z da cena, "para trás")
  return {
    grupo: g, camera: { pos: V(0.3, 3.4, 4.6), alvo: V(0, 0.35, 0), fov: 32 },
    animar(t, ativo, dt) {
      if (ativo && !this._ativo) this._t0 = t;          // ao ativar: perturba e a agulha volta ao norte (oscilação amortecida)
      this._ativo = ativo;
      const dtA = this._t0 != null ? t - this._t0 : 99;
      const ang = norte + 1.4 * Math.exp(-dtA * 1.1) * Math.cos(dtA * 7) + 0.03 * Math.sin(t * 1.3);
      agulha.rotation.y = ang;
      pin.position.y = ativo ? Math.max(0, Math.sin(Math.min(dtA * 6, Math.PI))) * 0.25 : 0;
    },
  };
}

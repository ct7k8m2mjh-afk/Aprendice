/* eslint-disable */
import { THREE, V, TAU, plast, ruido, malha } from '../base.js';

// =====================================================================================
// PORTUGUÊS — dois livros vermelhos empilhados (lombada arredondada à esquerda, capa com aba sobre o miolo creme),
// tinteiro de vidro azul-escuro e pena creme grande saindo dele. Função: escrever — a pena molha no tinteiro e volta.

// miolo: creme quente, linhas finas de folhas, mais escuro junto às capas (dá volume)
function texMiolo(lado) {
  const c = document.createElement('canvas'); c.width = 256; c.height = 256; const x = c.getContext('2d');
  if (lado) { x.translate(256, 0); x.rotate(Math.PI / 2); } // na face da ponta as linhas correm no outro eixo
  const gr = x.createLinearGradient(0, 0, 0, 256);
  gr.addColorStop(0, '#a87a4c'); gr.addColorStop(0.14, '#d2a978'); gr.addColorStop(0.5, '#dfbd8f'); gr.addColorStop(0.86, '#cfa473'); gr.addColorStop(1, '#9c6f44');
  x.fillStyle = gr; x.fillRect(0, 0, 256, 256);
  for (let y = 6; y < 250; y += 2 + Math.random() * 3) { x.fillStyle = `rgba(140,100,60,${0.06 + Math.random() * 0.1})`; x.fillRect(0, y, 256, 1); }
  for (let i = 0; i < 6; i++) { x.fillStyle = 'rgba(250,232,200,.35)'; x.fillRect(0, 30 + Math.random() * 190, 256, 2); }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
}
// pena: base pêssego-creme, barbas diagonais finas saindo da raque para a ponta, base e bordas um pouco mais escuras
function texPluma() {
  const c = document.createElement('canvas'); c.width = 256; c.height = 1024; const x = c.getContext('2d');
  const gr = x.createLinearGradient(0, 1024, 0, 0);
  gr.addColorStop(0, '#c4906c'); gr.addColorStop(0.2, '#dfb597'); gr.addColorStop(0.6, '#e8c6ab'); gr.addColorStop(1, '#ecd0b8');
  x.fillStyle = gr; x.fillRect(0, 0, 256, 1024);
  const rx = x.createLinearGradient(0, 0, 256, 0);
  rx.addColorStop(0, 'rgba(170,105,70,.45)'); rx.addColorStop(0.3, 'rgba(190,130,95,0)'); rx.addColorStop(0.7, 'rgba(190,130,95,0)'); rx.addColorStop(1, 'rgba(170,105,70,.4)');
  x.fillStyle = rx; x.fillRect(0, 0, 256, 1024);
  x.lineWidth = 1;
  for (let y = 0; y < 1200; y += 4) {
    x.strokeStyle = `rgba(170,120,90,${0.1 + Math.random() * 0.1})`;
    x.beginPath(); x.moveTo(128, y); x.quadraticCurveTo(70, y - 40, 0, y - 110); x.moveTo(128, y); x.quadraticCurveTo(186, y - 40, 256, y - 110); x.stroke();
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
}

export default function livros() {
  const g = new THREE.Group();
  const capa = plast(0x972a1f, { rug: 0.5, coat: 0.25, coatRug: 0.35, bump: ruido(), bumpE: 0.6 });
  const L = 2.2, h = 0.46, D = 1.4, t = 0.05, ov = 0.07, ex = 0.09; // comprimento, altura, profundidade, capa, aba, curva da lombada
  const mFrente = plast(0xffffff, { map: texMiolo(false), rug: 0.85, coat: 0 }), mLado = plast(0xffffff, { map: texMiolo(true), rug: 0.85, coat: 0 });
  for (const m of [mFrente, mLado]) { m.map.repeat.set(1 / L, 1 / (h - 2 * t)); m.map.offset.set(0, -t / (h - 2 * t)); m.map.wrapS = m.map.wrapT = THREE.ClampToEdgeWrapping; }
  mLado.map.repeat.set(1 / (h - 2 * t), 1 / D); mLado.map.offset.set(-t / (h - 2 * t), 0.5);

  function livro() {
    const l = new THREE.Group();
    // capa: perfil em "C" (tábua de cima, lombada arredondada, tábua de baixo) extrudado na profundidade
    const s = new THREE.Shape();
    s.moveTo(L, 0); s.lineTo(L, t); s.lineTo(ex, t);
    s.absellipse(ex, h / 2, ex - t * 0.9, h / 2 - t, -Math.PI / 2, -3 * Math.PI / 2, true);
    s.lineTo(L, h - t); s.lineTo(L, h); s.lineTo(ex, h);
    s.absellipse(ex, h / 2, ex, h / 2, Math.PI / 2, 3 * Math.PI / 2, false);
    s.lineTo(L, 0);
    const gc = new THREE.ExtrudeGeometry(s, { depth: D, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.018, bevelSegments: 3, curveSegments: 24 });
    gc.translate(-L / 2, 0, -D / 2);
    l.add(malha(gc, capa));
    // miolo: mesma curva da lombada por dentro, recuado da borda da capa (aba)
    const p = new THREE.Shape();
    p.moveTo(L - ov, t); p.lineTo(ex, t);
    p.absellipse(ex, h / 2, ex - t * 0.9, h / 2 - t, -Math.PI / 2, -3 * Math.PI / 2, true);
    p.lineTo(L - ov, h - t); p.lineTo(L - ov, t);
    const gp = new THREE.ExtrudeGeometry(p, { depth: D - 2 * ov + 0.04, bevelEnabled: false, curveSegments: 24 });
    gp.translate(-L / 2, 0, -(D - 2 * ov + 0.04) / 2);
    l.add(malha(gp, [mFrente, mLado]));
    return l;
  }
  const l1 = livro(); l1.position.set(-0.05, 0.02, 0); l1.rotation.y = -0.3;
  const l2 = livro(); l2.position.set(-0.08, h + 0.02, -0.03); l2.rotation.y = -0.26;
  g.add(l1, l2);
  { // sombra de contato suave atrás e à direita (como na referência), além da sombra do palco
    const c = document.createElement('canvas'); c.width = c.height = 256; const x = c.getContext('2d');
    const gr = x.createRadialGradient(128, 128, 10, 128, 128, 128); gr.addColorStop(0, 'rgba(60,50,45,.42)'); gr.addColorStop(0.6, 'rgba(60,50,45,.16)'); gr.addColorStop(1, 'rgba(60,50,45,0)');
    x.fillStyle = gr; x.fillRect(0, 0, 256, 256);
    const tx = new THREE.CanvasTexture(c);
    const somb = new THREE.Mesh(new THREE.PlaneGeometry(3.1, 2.4), new THREE.MeshBasicMaterial({ map: tx, transparent: true, depthWrite: false }));
    somb.rotation.x = -Math.PI / 2; somb.position.set(0.4, 0.003, -0.1); g.add(somb);
  }

  // tinteiro: vidro azul-escuro brilhante, corpo bojudo, gargalo curto e boca com aba
  const vid = plast(0x213760, { rug: 0.42, coat: 0.5, coatRug: 0.45 });
  const perfil = [[0, 0], [0.33, 0], [0.37, 0.015], [0.4, 0.05], [0.415, 0.12], [0.42, 0.24], [0.41, 0.36], [0.38, 0.45], [0.32, 0.53], [0.24, 0.585], [0.185, 0.615],
    [0.175, 0.66], [0.19, 0.685], [0.235, 0.7], [0.262, 0.735], [0.268, 0.79], [0.258, 0.83], [0.23, 0.85], [0.19, 0.848], [0.165, 0.82], [0.155, 0.76], [0, 0.75]]
    .map(([r, y]) => new THREE.Vector2(r, y));
  const tint = new THREE.Group(); tint.position.set(0.22, 0, 1.0); tint.scale.set(0.88, 0.84, 0.88); g.add(tint);
  tint.add(malha(new THREE.LatheGeometry(perfil, 64), vid));
  const tinta = malha(new THREE.CircleGeometry(0.156, 32), plast(0x050a18, { rug: 0.1, coat: 1 }), false); tinta.rotation.x = -Math.PI / 2; tinta.position.y = 0.77; tint.add(tinta);

  // pena: raque curva, vexilo largo à esquerda e mais estreito à direita, com recortes entre os tufos de barbas
  const pena = new THREE.Group();
  const C = 1.62, v0 = 0.1; // comprimento do vexilo, início dele acima da boca
  const arco = (y) => -0.12 * Math.sin(Math.PI * Math.min(1, Math.max(0, (y + 0.6) / (C + v0 + 0.6)))); // a raque se curva para a esquerda
  const forma = new THREE.Shape();
  // borda de um lado: envelope largo no terço de cima; tufos de barbas separados por fendas em "V" inclinadas para a ponta
  function borda(Wmax, ex, fendas) {
    const out = [], N = 120; let k = 0, ant = 0;
    for (let i = 0; i <= N; i++) {
      const s = i / N, W = Wmax * Math.pow(Math.sin(Math.PI * Math.pow(s, ex)), 0.65);
      while (k < fendas.length && fendas[k] <= s) { // ponta do tufo, fundo da fenda, começo do próximo tufo
        const sf = fendas[k], Wf = Wmax * Math.pow(Math.sin(Math.PI * Math.pow(sf, ex)), 0.65);
        out.push([Wf, v0 + sf * C], [Wf * 0.6, v0 + sf * C - 0.085], [Wf * 0.86, v0 + sf * C + 0.012]); ant = sf; k++;
      }
      const f = k === 0 || k > fendas.length ? 1 : Math.min(1, (s - ant) / ((fendas[k] ?? 1) - ant + 1e-6));
      const m = k > 0 && k <= fendas.length && fendas[k] !== undefined ? 0.86 + 0.14 * Math.sqrt(f) : (k > 0 ? 0.86 + 0.14 * Math.sqrt(Math.min(1, (s - ant) / 0.12)) : 1);
      if (out.length && Math.abs(out[out.length - 1][1] - (v0 + s * C)) < 0.004) continue;
      out.push([W * m, v0 + s * C]);
    }
    return out;
  }
  const dir = borda(0.21, 1.25, [0.3, 0.46, 0.62, 0.78]), esq = borda(0.3, 1.2, [0.22, 0.36, 0.5, 0.64, 0.79]).map(([a, b]) => [-a, b]).reverse();
  const pts = dir.concat(esq);
  forma.moveTo(pts[0][0], pts[0][1]); for (const [a, b] of pts.slice(1)) forma.lineTo(a, b);
  const gv = new THREE.ExtrudeGeometry(forma, { depth: 0.012, bevelEnabled: true, bevelThickness: 0.008, bevelSize: 0.008, bevelSegments: 1, curveSegments: 4 });
  { // curva a pluma: segue a raque e faz uma leve concha; UV de 0..1 na textura
    const P = gv.attributes.position, U = gv.attributes.uv;
    for (let i = 0; i < P.count; i++) {
      const px = P.getX(i), py = P.getY(i);
      U.setXY(i, (px + 0.3) / 0.6, (py - v0) / C);
      P.setX(i, px + arco(py)); P.setZ(i, P.getZ(i) - 0.006 - 0.5 * px * px + 0.05 * Math.sin(Math.PI * (py - v0) / C) * 0);
    }
    gv.computeVertexNormals();
  }
  const pluma = malha(gv, plast(0xffffff, { map: texPluma(), rug: 0.8, coat: 0, lado: THREE.DoubleSide }));
  pena.add(pluma);
  const curvaR = new THREE.CatmullRomCurve3(Array.from({ length: 12 }, (_, i) => { const y = -0.6 + (i / 11) * (C + v0 + 0.55); return V(arco(y), y, 0.012); }));
  const raque = malha(new THREE.TubeGeometry(curvaR, 64, 0.026, 8), plast(0xf7ecdc, { rug: 0.35, coat: 0.4 }));
  { // afina a raque para a ponta
    const P = raque.geometry.attributes.position;
    for (let i = 0; i < P.count; i++) { const y = P.getY(i), k = 1 - 0.65 * Math.max(0, (y - v0) / C); const cx = arco(y); P.setX(i, cx + (P.getX(i) - cx) * k); P.setZ(i, 0.012 + (P.getZ(i) - 0.012) * k); }
    raque.geometry.computeVertexNormals();
  }
  pena.add(raque);
  const BASE = 0.68; // boca do tinteiro
  pena.position.set(0.22, BASE, 1.0); pena.rotation.set(0.12, 0.08, -0.33); g.add(pena);

  return {
    grupo: g, camera: { pos: V(-0.25, 1.85, 5.9), alvo: V(-0.05, 0.95, 0.3), fov: 33 },
    animar(tm, ativo, dt) {
      this._a = (this._a || 0) + ((ativo ? 1 : 0) - (this._a || 0)) * Math.min(1, dt * 4);
      const mergulho = Math.max(0, Math.sin(tm * 2.2)) * this._a; // molha a pena na tinta e levanta para escrever
      pena.position.y = BASE - mergulho * 0.22; pena.rotation.z = -0.33 + mergulho * 0.12; pena.rotation.x = 0.12 - mergulho * 0.05;
    },
  };
}

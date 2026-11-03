/* eslint-disable */
import { THREE, V, TAU, plast, metal, ruido, semente, texPaginas, texPena, brilhoTex, malha, esfera, caminhoArredondado } from '../base.js';

// =====================================================================================
// FÍSICA — circuito: pilha, fio, lâmpada. Função: a corrente sai do +, corre no fio até a lâmpada,
// volta ao −, e a lâmpada acende.
export default function circuito() {
  const g = new THREE.Group();
  // pilha (AA): corpo preto brilhante, faixa dourada com "+", "−" branco, tampa prateada
  const PR = 0.42, PH = 1.5;
  const corpo = malha(new THREE.CylinderGeometry(PR, PR, PH * 0.62, 64), plast(0x111214, { rug: 0.22, coat: 1, coatRug: 0.08, bump: ruido(), bumpE: 0.6 }));
  corpo.position.set(0, PH * 0.31, 0);
  const faixa = malha(new THREE.CylinderGeometry(PR + 0.004, PR + 0.004, PH * 0.38, 64), plast(0xf2a91c, { rug: 0.25, metal: 0.55, coat: 0.9 }));
  faixa.position.set(0, PH * 0.62 + PH * 0.19, 0);
  const ombro = malha(new THREE.TorusGeometry(PR - 0.03, 0.03, 16, 64), plast(0xf2a91c, { metal: 0.55, rug: 0.25 })); ombro.rotation.x = Math.PI / 2; ombro.position.y = PH;
  const topo = malha(new THREE.CylinderGeometry(PR - 0.03, PR - 0.03, 0.02, 64), plast(0xe9a018, { metal: 0.5 })); topo.position.y = PH + 0.01;
  const tampa = malha(new THREE.CylinderGeometry(0.13, 0.15, 0.13, 48), metal(0xd8dadd, 0.18)); tampa.position.y = PH + 0.08;
  const sinal = (w, h, cor, y) => { const m = malha(new THREE.BoxGeometry(w, h, 0.02), plast(cor, { rug: 0.5, coat: 0.2 }), false); m.position.set(0, y, PR + 0.006); return m; };
  const mais = new THREE.Group(); mais.add(sinal(0.26, 0.07, 0x141414, 0), sinal(0.07, 0.26, 0x141414, 0)); mais.position.y = PH * 0.82;
  const menos = sinal(0.24, 0.06, 0xf4f4f4, PH * 0.3);
  const pilha = new THREE.Group(); pilha.add(corpo, faixa, ombro, topo, tampa, mais, menos);
  pilha.position.set(-1.25, 0, 0.15);
  g.add(pilha);

  // lâmpada: soquete cinza, rosca prateada, vidro em pera com brilho âmbar, filamento
  const L = new THREE.Group(); L.position.set(1.15, 0, -0.1); g.add(L);
  const soq = malha(new THREE.CylinderGeometry(0.52, 0.56, 0.26, 64), plast(0x6d7076, { metal: 0.6, rug: 0.38, coat: 0.4 })); soq.position.y = 0.13; L.add(soq);
  const gola = malha(new THREE.CylinderGeometry(0.34, 0.4, 0.08, 48), plast(0x55585e, { metal: 0.6, rug: 0.35 })); gola.position.y = 0.3; L.add(gola);
  const perfR = []; for (let i = 0; i <= 40; i++) { const y = i / 40 * 0.42; perfR.push(new THREE.Vector2(0.27 + 0.025 * Math.sin(y / 0.42 * TAU * 4), y)); }
  const rosca = malha(new THREE.LatheGeometry(perfR, 64), metal(0xc9ccd0, 0.2)); rosca.position.y = 0.33; L.add(rosca);
  const perfV = []; // pescoço -> globo (pera): pescoço reto e arco do globo até o topo
  const yc = 0.98, RG = 0.6, a0 = -Math.PI / 3;
  for (let i = 0; i <= 10; i++) { const t = i / 10; perfV.push(new THREE.Vector2(0.27 + (RG * Math.cos(a0) - 0.27) * t * t, (yc + RG * Math.sin(a0)) * t)); }
  for (let i = 1; i <= 50; i++) { const a = a0 + (Math.PI / 2 - a0) * i / 50; perfV.push(new THREE.Vector2(Math.max(0.0005, RG * Math.cos(a)), yc + RG * Math.sin(a))); }
  const vidroM = plast(0xff9a10, { rug: 0.08, coat: 1, coatRug: 0.02, emis: 0xff7a00, emisI: 1, transp: true, opac: 0.95 });
  const vidro = malha(new THREE.LatheGeometry(perfV, 96), vidroM, true); vidro.position.y = 0.72; L.add(vidro);
  // haste e filamento
  const haste = malha(new THREE.CylinderGeometry(0.03, 0.09, 0.5, 24), plast(0xfff2c8, { transp: true, opac: 0.6 })); haste.position.y = 1.25; L.add(haste);
  const sup = metal(0xb8742f, 0.3);
  for (const s of [-1, 1]) { const t = malha(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([V(s * 0.03, 1.4, 0), V(s * 0.08, 1.62, 0), V(s * 0.16, 1.76, 0)]), 16, 0.012, 8), sup, false); L.add(t); }
  const hel = []; for (let i = 0; i <= 120; i++) { const t = i / 120; hel.push(V(-0.16 + 0.32 * t, 1.76 + 0.03 * Math.sin(t * TAU * 9), 0.03 * Math.cos(t * TAU * 9))); }
  const filM = new THREE.MeshStandardMaterial({ color: 0xfff1b0, emissive: 0xffd04a, emissiveIntensity: 2 });
  const filamento = malha(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(hel), 200, 0.012, 6), filM, false); L.add(filamento);
  const luz = new THREE.PointLight(0xffb84a, 1.2, 4, 2); luz.position.set(0, 1.72, 0); L.add(luz);

  // fio: sai da tampa (+), sobe, cruza, desce no soquete; do outro lado volta pelo chão até a base (−)
  const WR = 0.075, topoY = PH + 0.15, alto = 2.35;
  const ida = [V(-1.25, topoY, 0.15), V(-1.25, alto, 0.15), V(0.1, alto, 0.15), V(0.1, 0.17, 0.15), V(0.68, 0.17, -0.02)];
  const volta = [V(1.62, 0.17, -0.02), V(1.82, 0.17, -0.02), V(1.82, WR, -0.02), V(1.82, WR, 0.85), V(-1.25, WR, 0.85), V(-1.25, WR, 0.55)];
  const fioM = plast(0xd8191f, { rug: 0.28, coat: 1, coatRug: 0.05, bump: ruido(), bumpE: 0.3 });
  const cIda = caminhoArredondado(ida, 0.25), cVolta = caminhoArredondado(volta, 0.18);
  g.add(malha(new THREE.TubeGeometry(cIda, 200, WR, 20), fioM), malha(new THREE.TubeGeometry(cVolta, 200, WR, 20), fioM));
  for (const p of [ida[0], ida[ida.length - 1], volta[0], volta[volta.length - 1]]) { const e = esfera(WR, fioM, 24); e.position.copy(p); g.add(e); }

  // pulsos de corrente (só aparecem ativos)
  const pulsoM = new THREE.SpriteMaterial({ map: brilhoTex(), color: 0xffd64a, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, depthTest: false });
  const pulsos = []; for (let i = 0; i < 7; i++) { const p = new THREE.Sprite(pulsoM.clone()); p.scale.setScalar(0.42); p.renderOrder = 5; g.add(p); pulsos.push(p); }
  const total = cIda.getLength() + cVolta.getLength();

  g.position.set(0, 0, 0);
  let brilho = 0.9;
  return {
    grupo: g, camera: { pos: V(0.3, 1.9, 6.4), alvo: V(0.25, 1.05, 0.1), fov: 32 },
    animar(t, ativo, dt) {
      const k = ativo ? 1 : 0;
      for (let i = 0; i < pulsos.length; i++) {
        const s = ((t * 0.55 + i / pulsos.length) % 1) * total;
        const p = s < cIda.getLength() ? cIda.getPointAt(s / cIda.getLength()) : cVolta.getPointAt((s - cIda.getLength()) / cVolta.getLength());
        pulsos[i].position.copy(p);
        pulsos[i].material.opacity += ((ativo ? 0.95 : 0) - pulsos[i].material.opacity) * Math.min(1, dt * 6);
      }
      const alvoB = ativo ? 1.6 + 0.2 * Math.sin(t * 9) : 0.9;
      brilho += (alvoB - brilho) * Math.min(1, dt * 4);
      vidroM.emissiveIntensity = brilho; filM.emissiveIntensity = 1.2 + brilho * 1.5; luz.intensity = 0.6 + brilho * 1.6;
      void k;
    },
  };
}

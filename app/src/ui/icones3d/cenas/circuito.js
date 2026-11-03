/* eslint-disable */
import { THREE, V, TAU, plast, metal, ruido, brilhoTex, malha, esfera, caminhoArredondado } from '../base.js';

// =====================================================================================
// FÍSICA — circuito: pilha AA em pé, fio vermelho, lâmpada no soquete.
// Função (docs/pesquisa/animacao-dos-icones.md, 5.1): ao ativar, a corrente aparece no circuito TODO ao mesmo tempo
// (sentido convencional: do + pelo fio até a lâmpada e de volta ao −, mesma quantidade e velocidade antes e depois da
// lâmpada) e a lâmpada acende NO MESMO INSTANTE (rampa de 150 ms, sem tremer). Os pulsos dão ~1 volta e somem; a
// lâmpada fica acesa, parada, enquanto o ícone estiver ativo. Repouso: lâmpada apagada (sem corrente não há luz).
// Com "reduzir movimento", o repouso mostra o estado final (lâmpada acesa, parada).

const menosMov = () => typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const suave = (a, b, x) => { const k = Math.min(1, Math.max(0, (x - a) / (b - a))); return k * k * (3 - 2 * k); };

// perfil de torno com cantos arredondados (lista [r, y] -> Vector2), raio de canto rc
function perfilRedondo(pts, rc, n = 6) {
  const out = [new THREE.Vector2(pts[0][0], pts[0][1])];
  for (let i = 1; i < pts.length - 1; i++) {
    const a = new THREE.Vector2(...pts[i - 1]), b = new THREE.Vector2(...pts[i]), c = new THREE.Vector2(...pts[i + 1]);
    const d1 = a.clone().sub(b), d2 = c.clone().sub(b); const r = Math.min(rc, d1.length() * 0.45, d2.length() * 0.45);
    const p1 = b.clone().add(d1.normalize().multiplyScalar(r)), p2 = b.clone().add(d2.normalize().multiplyScalar(r));
    for (let k = 0; k <= n; k++) { const t = k / n, u = 1 - t; out.push(new THREE.Vector2(u * u * p1.x + 2 * u * t * b.x + t * t * p2.x, u * u * p1.y + 2 * u * t * b.y + t * t * p2.y)); }
  }
  out.push(new THREE.Vector2(...pts[pts.length - 1])); return out;
}

export default function circuito() {
  const g = new THREE.Group();

  // ---------- pilha AA em pé
  const PR = 0.5, PH = 1.72, BX = -1.37, BZ = 0.25;
  const pilha = new THREE.Group(); pilha.position.set(BX, 0, BZ); g.add(pilha);
  const yF = PH * 0.62; // divisa preto / dourado
  const preto = plast(0x2c2e33, { rug: 0.16, coat: 1, coatRug: 0.04, bump: ruido(), bumpE: 0.2 });
  const dourado = plast(0xf7b50c, { rug: 0.2, metal: 0.15, coat: 1, coatRug: 0.05 });
  const corpoP = malha(new THREE.LatheGeometry(perfilRedondo([[0, 0], [PR, 0], [PR, yF]], 0.06), 72, Math.PI), preto); pilha.add(corpoP);
  const corpoD = malha(new THREE.LatheGeometry(perfilRedondo([[PR + 0.002, yF], [PR + 0.002, PH], [0.2, PH]], 0.07), 72, Math.PI), dourado); pilha.add(corpoD);
  const tampa = malha(new THREE.LatheGeometry(perfilRedondo([[0.2, PH - 0.01], [0.2, PH + 0.03], [0.175, PH + 0.04], [0.175, PH + 0.17], [0, PH + 0.17]], 0.03, 4), 48), metal(0xd9dce0, 0.16)); pilha.add(tampa);
  // sinais em relevo curvo sobre o corpo
  const sinal = (w, h, cor, y) => { const th = w / PR; const m = malha(new THREE.CylinderGeometry(PR + 0.006, PR + 0.006, h, 12, 1, false, -th / 2, th), plast(cor, { rug: 0.45, coat: 0.3 }), false); m.position.y = y; return m; };
  const yMais = yF + (PH - yF) * 0.5;
  pilha.add(sinal(0.27, 0.075, 0x0c0c0c, yMais), sinal(0.075, 0.27, 0x0c0c0c, yMais), sinal(0.2, 0.06, 0xf6f6f6, yF * 0.3));

  // ---------- lâmpada no soquete
  const LX = BX + 2.52, LZ = -0.35;
  const L = new THREE.Group(); L.position.set(LX, 0, LZ); g.add(L);
  const grafite = plast(0x9a9da2, { metal: 0.75, rug: 0.26, coat: 0.6, coatRug: 0.12 });
  const soq = malha(new THREE.LatheGeometry(perfilRedondo([[0, 0], [0.57, 0], [0.57, 0.3], [0.36, 0.32], [0, 0.32]], 0.07), 72), grafite); L.add(soq);
  const prata = plast(0xa8abb0, { metal: 0.7, rug: 0.24, coat: 0.7 }), aneis = plast(0x8d9095, { metal: 0.6, rug: 0.3, coat: 0.5 });
  const rosca = []; // base rosqueada: colar escuro, duas roscas, anel superior
  rosca.push([0.33, 0.3], [0.335, 0.38]);
  for (let i = 0; i < 2; i++) { const y = 0.4 + i * 0.085; rosca.push([0.315, y], [0.34, y + 0.042], [0.315, y + 0.085]); }
  rosca.push([0.3, 0.57], [0.3, 0.6], [0, 0.6]);
  L.add(malha(new THREE.LatheGeometry(rosca.map(([r, y]) => new THREE.Vector2(r, y)), 64), prata));
  const colar = malha(new THREE.CylinderGeometry(0.35, 0.355, 0.07, 64), aneis); colar.position.y = 0.35; L.add(colar);
  const colar2 = malha(new THREE.CylinderGeometry(0.315, 0.325, 0.05, 64), aneis); colar2.position.y = 0.585; L.add(colar2);
  // vidro em pera: pescoço e globo
  const yc = 1.42, RG = 0.6, a0 = -0.95, perfV = [];
  for (let i = 0; i <= 14; i++) { const t = i / 14; const r0 = 0.27, r1 = RG * Math.cos(a0), y0 = 0.6, y1 = yc + RG * Math.sin(a0); perfV.push(new THREE.Vector2(r0 + (r1 - r0) * Math.pow(t, 1.6), y0 + (y1 - y0) * t)); }
  for (let i = 1; i <= 40; i++) { const a = a0 + (Math.PI / 2 - a0) * i / 40; perfV.push(new THREE.Vector2(Math.max(0.0005, RG * Math.cos(a)), yc + RG * Math.sin(a))); }
  const vidroOff = new THREE.Color(0xf3e3a6), vidroOn = new THREE.Color(0xffa000);
  const vidroM = plast(0xf3e3a6, { rug: 0.12, coat: 1, coatRug: 0.02, emis: 0xff9000, emisI: 0, transp: true, opac: 0.5 });
  vidroM.depthWrite = false;
  const geoV = new THREE.LatheGeometry(perfV, 72);
  // parede de trás do vidro (face interna): dá o fundo âmbar atrás do filamento; a frente fica translúcida
  const fundoM = plast(0xf3e3a6, { rug: 0.3, coat: 0, emis: 0xff8a00, emisI: 0, transp: true, opac: 0.3, lado: THREE.BackSide });
  fundoM.depthWrite = false;
  const fundo = malha(geoV, fundoM, false); fundo.renderOrder = 2; L.add(fundo);
  const vidro = malha(geoV, vidroM, true); vidro.renderOrder = 3; L.add(vidro);
  // haste de vidro, suportes e filamento
  const hasteM = plast(0xfff4d0, { transp: true, opac: 0.7, rug: 0.1, emis: 0xffe9b0, emisI: 0 });
  const haste = malha(new THREE.CylinderGeometry(0.075, 0.1, 0.36, 24), hasteM, false); haste.position.y = 0.82; L.add(haste);
  const sup = new THREE.MeshStandardMaterial({ color: 0x8a7a62, emissive: 0xfff0c0, emissiveIntensity: 0, metalness: 0.5, roughness: 0.4 }); sup.toneMapped = false;
  for (const s of [-1, 1]) L.add(malha(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([V(s * 0.04, 0.98, 0), V(s * 0.07, 1.25, 0), V(s * 0.17, 1.56, 0)]), 12, 0.016, 6), sup, false));
  const guia = new THREE.CatmullRomCurve3([V(-0.17, 1.56, 0), V(-0.11, 1.63, 0), V(-0.03, 1.6, 0), V(0, 1.55, 0), V(0.03, 1.6, 0), V(0.11, 1.63, 0), V(0.17, 1.56, 0)]);
  const hel = []; for (let i = 0; i <= 160; i++) { const t = i / 160; const p = guia.getPointAt(t); const a = t * TAU * 22; hel.push(V(p.x, p.y + 0.014 * Math.sin(a), 0.014 * Math.cos(a))); }
  const filM = new THREE.MeshStandardMaterial({ color: 0x6b5a48, emissive: 0xfff2c0, emissiveIntensity: 0, roughness: 0.5, metalness: 0.4 }); filM.toneMapped = false;
  L.add(malha(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(hel), 220, 0.011, 5), filM, false));
  // brilho interno (só aceso) e luz da lâmpada
  const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: brilhoTex(), color: 0xffe9a0, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }));
  halo.scale.setScalar(0.62); halo.position.set(0, 1.58, 0.05); halo.renderOrder = 4; L.add(halo);
  const luz = new THREE.PointLight(0xffb84a, 0, 3.5, 2); luz.position.set(0, 1.5, 0.2); L.add(luz);

  // ---------- fio: + (tampa) sobe, cruza, desce e entra no soquete; sai do outro lado e volta pelo chão até o − (base)
  const WR = 0.052, topoP = PH + 0.17, alto = 2.3, XM = BX + 1.39, yS = 0.2, ZF = BZ + 0.72;
  const ida = [V(BX, topoP - 0.02, BZ), V(BX, alto, BZ), V(XM, alto, BZ), V(XM, yS, LZ + 0.1), V(LX - 0.555, yS, LZ)];
  const volta = [V(LX + 0.555, yS, LZ), V(LX + 0.8, yS, LZ), V(LX + 0.8, WR, LZ + 0.1), V(LX + 0.8, WR, ZF), V(BX, WR, ZF), V(BX, WR, BZ + 0.15)];
  const fioM = plast(0xd9141c, { rug: 0.25, coat: 1, coatRug: 0.04 });
  const cIda = caminhoArredondado(ida, 0.22), cVolta = caminhoArredondado(volta, 0.2);
  const fioIda = malha(new THREE.TubeGeometry(cIda, 160, WR, 14), fioM); fioIda.castShadow = false; // sem faixa de sombra do fio alto no chão
  g.add(fioIda, malha(new THREE.TubeGeometry(cVolta, 160, WR, 14), fioM));
  for (const p of [ida[ida.length - 1], volta[0]]) { const e = esfera(WR, fioM, 16); e.position.copy(p); g.add(e); }

  // ---------- percurso fechado da corrente (convencional): + → fio → lâmpada → fio → − → dentro da pilha → +
  // trechos internos (dentro do soquete/lâmpada e dentro da pilha) existem no percurso mas os pulsos ficam ocultos ali.
  const trechos = [
    { c: cIda, vis: true },
    { c: new THREE.LineCurve3(ida[ida.length - 1], volta[0]), vis: false },
    { c: cVolta, vis: true },
    { c: new THREE.LineCurve3(volta[volta.length - 1], ida[0]), vis: false },
  ];
  let acc = 0; for (const tr of trechos) { tr.ini = acc; tr.len = tr.c.getLength(); acc += tr.len; } const total = acc;
  const ponto = (s) => { s = ((s % total) + total) % total; for (const tr of trechos) if (s <= tr.ini + tr.len) return [tr.c.getPointAt(Math.min(1, (s - tr.ini) / tr.len)), tr.vis]; return [ida[0], false]; };
  const NP = 14, pulsos = [];
  const pulsoTex = brilhoTex();
  for (let i = 0; i < NP; i++) { const p = new THREE.Sprite(new THREE.SpriteMaterial({ map: pulsoTex, color: 0xfff0a0, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, depthTest: false })); p.scale.setScalar(0.26); p.renderOrder = 6; p.visible = false; g.add(p); pulsos.push(p); }

  const DUR = 1.6;           // pulsos andam uma volta em 1,6 s e somem
  let t0 = null, ativoAnt = false, aceso = menosMov() ? 1 : 0;
  function lampada(k) {
    vidroM.color.lerpColors(vidroOff, vidroOn, k); vidroM.opacity = 0.5 - 0.05 * k; vidroM.emissiveIntensity = 0.3 * k;
    fundoM.color.lerpColors(vidroOff, vidroOn, k); fundoM.opacity = 0.3 + 0.7 * k; fundoM.emissiveIntensity = 0.75 * k; hasteM.emissiveIntensity = 0.6 * k; sup.emissiveIntensity = 0.9 * k;
    filM.emissiveIntensity = 1.6 * k; filM.color.setScalar(0.42 * (1 - k)); halo.material.opacity = 0.7 * k; luz.intensity = 2.2 * k;
  }
  lampada(aceso);
  return {
    grupo: g, camera: { pos: V(0, 3.4, 11.3), alvo: V(0, 0.98, 0), fov: 25 },
    animar(t, ativo, dt) {
      if (ativo && !ativoAnt) t0 = t; ativoAnt = ativo;
      if (ativo && t0 != null) {
        const tau = t - t0;
        aceso = suave(0, 0.15, tau);                    // acende junto com o surgimento da corrente
        const op = suave(0, 0.12, tau) * (1 - suave(DUR - 0.3, DUR, tau));
        for (let i = 0; i < NP; i++) {
          const [p, vis] = ponto(i / NP * total + (tau / DUR) * total);
          pulsos[i].position.copy(p); pulsos[i].visible = vis && op > 0.001; pulsos[i].material.opacity = op;
        }
      } else {
        aceso += ((menosMov() ? 1 : 0) - aceso) * Math.min(1, dt * 14); // volta ao repouso em ~250 ms
        for (const p of pulsos) { p.material.opacity = 0; p.visible = false; }
      }
      lampada(aceso);
    },
  };
}

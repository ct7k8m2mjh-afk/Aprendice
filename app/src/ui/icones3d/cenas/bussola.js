/* eslint-disable */
import { THREE, V, TAU, plast, metal, semente, malha, esfera , pedeRedesenho } from '../base.js';
import urlMapa from '../texturas/mapa.webp';
import urlRelevo from '../texturas/mapa-relevo.webp';

// =====================================================================================
// GEOGRAFIA — mapa topográfico dobrado em três painéis + bússola dourada + alfinete de mapa.
// Função (docs/pesquisa/animacao-dos-icones.md, 5.1): "orientar e depois localizar", uma vez por ativação.
//  1. Um toque na bússola tira a agulha do lugar: ela faz uma oscilação amortecida (como um pêndulo no campo
//     magnético) e para apontando o N (≈1,3 s).
//  2. Depois, o alfinete cai e espeta o mapa, assenta 2–3 mm e para, sem quicar (≈0,5 s).
// Repouso (e "reduzir movimento"): o estado final, parado — agulha no N, alfinete espetado.

const suave = (a, b, x) => { const k = Math.min(1, Math.max(0, (x - a) / (b - a))); return k * k * (3 - 2 * k); };

// ---------- texturas
// Mapa: textura criada do zero (nenhum pixel da referência), 3072 x 2034 px: relevo fractal em 10 faixas hipsométricas
// (verde baixo -> amarelo/laranja alto), cada borda em terraço (linha escura na sombra, clara na luz, luz do alto à esquerda),
// curvas de nível finas, rio azul largo com afluentes e braço, margem de papel branco.
// O relevo (bump) são os mesmos degraus das faixas, com o rio rebaixado.
// Gerador: app/src/ui/icones3d/texturas/gera-mapa.py
// As imagens começam a carregar já na importação; quando a cena é montada depois disso, a textura nasce pronta.
// Se a cena foi desenhada antes de a imagem chegar, pede um novo quadro ao palco (pedeRedesenho).
const IMGS = {};
function img(url) {
  if (!IMGS[url]) { const im = new Image(); im.decoding = 'async'; im.src = url; IMGS[url] = im; }
  return IMGS[url];
}
if (typeof document !== 'undefined') { img(urlMapa); img(urlRelevo); }
function carregaTex(url, cor) {
  const im = img(url), t = new THREE.Texture(im); if (cor) t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  if (im.complete && im.naturalWidth) t.needsUpdate = true;
  else im.addEventListener('load', () => { t.needsUpdate = true; pedeRedesenho(); }, { once: true });
  return t;
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
    const a = -MW / 2, b = -0.6, c2 = 0.62, d = MW / 2; // dobras onde a pintura dobra (u = 0,338 e 0,668)
    if (u < b) return 0.6 * (u - a) / (b - a);
    if (u < c2) return 0.6 * (1 - (u - b) / (c2 - b)) + 0.04;
    return 0.04 + 0.4 * (u - c2) / (d - c2);
  };
  const geoM = new THREE.PlaneGeometry(MW, MH, 74, 6); const pos = geoM.attributes.position;
  for (let i = 0; i < pos.count; i++) { const u = pos.getX(i), v = pos.getY(i); pos.setZ(i, dobra(u) + 0.03 * Math.sin((v / MH + 0.5) * Math.PI) * Math.cos(u * 2)); }
  geoM.computeVertexNormals();
  const mapa = new THREE.Group(); mapa.rotation.x = -MAPA_INC; mapa.position.set(0.12, Math.sin(Math.PI / 2 - MAPA_INC) * MH / 2 + 0.02, -0.45 - Math.cos(Math.PI / 2 - MAPA_INC) * MH / 2);
  const matMapa = plast(0xa4a4a4, { map: carregaTex(urlMapa, true), bump: carregaTex(urlRelevo, false), bumpE: 1.6, rug: 0.9, coat: 0, metal: 0 });
  matMapa.toneMapped = false; matMapa.specularIntensity = 0.25; // a pintura mantém a saturação (o ACES desbotava os verdes e amarelos)
  mapa.add(malha(geoM, matMapa));
  mapa.add(malha(geoM, plast(0xf4f2ea, { rug: 0.8, coat: 0, lado: THREE.BackSide })));
  // sombra do mapa no chão: só um contato suave junto à borda de baixo (a sombra dura virava uma cunha cinza)
  mapa.traverse((o) => { if (o.isMesh) o.castShadow = false; });
  const scM = document.createElement('canvas'); scM.width = 256; scM.height = 64; const smx = scM.getContext('2d');
  const sgM = smx.createLinearGradient(0, 0, 0, 64); sgM.addColorStop(0, 'rgba(0,0,0,.5)'); sgM.addColorStop(1, 'rgba(0,0,0,0)');
  smx.fillStyle = sgM; smx.fillRect(0, 0, 256, 64);
  const sgL = smx.createLinearGradient(0, 0, 256, 0); sgL.addColorStop(0, 'rgba(0,0,0,1)'); sgL.addColorStop(0.06, 'rgba(0,0,0,0)'); sgL.addColorStop(0.94, 'rgba(0,0,0,0)'); sgL.addColorStop(1, 'rgba(0,0,0,1)');
  smx.globalCompositeOperation = 'destination-out'; smx.fillStyle = sgL; smx.fillRect(0, 0, 256, 64);
  const contatoM = new THREE.Mesh(new THREE.PlaneGeometry(MW + 0.1, 0.42), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(scM), transparent: true, depthWrite: false, opacity: 0.4 }));
  contatoM.rotation.x = -Math.PI / 2; contatoM.position.set(0.12, 0.003, -0.45 + 0.21); g.add(contatoM);
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
  // base branca do alfinete, apoiada no mapa: disco grosso com borda arredondada e miolo cinza-claro rebaixado
  const marca = new THREE.Group();
  const brancoBase = plast(0xfbfbf8, { rug: 0.35, coat: 0.6, coatRug: 0.15 });
  const discoB = malha(new THREE.CylinderGeometry(0.15, 0.16, 0.03, 48), brancoBase, false); discoB.rotation.x = Math.PI / 2; discoB.position.z = 0.015; marca.add(discoB);
  const aroB = malha(new THREE.TorusGeometry(0.142, 0.022, 12, 48), brancoBase, false); aroB.position.z = 0.03; marca.add(aroB);
  const fundoB = malha(new THREE.CircleGeometry(0.07, 32), plast(0xc9c9c4, { rug: 0.6, coat: 0 }), false); fundoB.position.z = 0.0315; marca.add(fundoB);
  const PU = 0.48, PV = 0.5; // ponto do alfinete na folha (onde a referência o espeta)
  const zMapa = (u, v) => dobra(u) + 0.03 * Math.sin((v / MH + 0.5) * Math.PI) * Math.cos(u * 2);
  const incP = Math.atan((dobra(PU - 0.05) - dobra(PU + 0.05)) / 0.1); // inclinação do painel sob o alfinete
  // a base fica quase deitada no painel, um pouco mais achatada para a câmera (na referência lê como elipse larga),
  // erguida o bastante para a borda de baixo não entrar no papel; a ponta do alfinete entra no centro dela
  const INC_B = -0.5;
  marca.rotation.order = 'YXZ'; marca.rotation.y = incP * 0.5; marca.rotation.x = INC_B;
  marca.position.copy(V(PU, PV, zMapa(PU, PV) + 0.16 * Math.sin(-INC_B) + 0.01)); mapa.add(marca);
  marca.traverse((o) => { if (o.isMesh) o.receiveShadow = false; }); // base sempre branca e limpa, como na referência
  mapa.updateMatrixWorld(true); const ponta = marca.localToWorld(V(0, 0, 0.03)); g.worldToLocal(ponta);
  const PEN = 0.05; // quanto a ponta entra na base
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

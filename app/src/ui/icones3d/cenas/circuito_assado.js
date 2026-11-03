/* eslint-disable */
import { THREE, V, brilhoTex } from '../base.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import urlModelo from '../modelos/circuito.glb?url';

// =====================================================================================
// FÍSICA — circuito, versão ASSADA (piloto da rota "bake no Blender -> GLB -> three.js",
// docs/pesquisa/tecnicas-3d-realista.md, seções 2.2, 4 e 7).
// A luz, as sombras próprias, o brilho e o reflexo vêm do Cycles, gravados nas texturas
// (app-atual/design/icones_real/foto3d/cenas/F11_bake.py). Aqui só se lê a textura (MeshBasicMaterial, sem luz ao vivo).
// Fio, soquete e vidro têm duas texturas: apagada (cor base) e acesa (emissiva); a animação mistura as duas.
// Sombra no chão: plano com a sombra assada (alfa), curta e para trás (luz de frente e de cima).
// Função (docs/pesquisa/animacao-dos-icones.md, 5.1): ao ativar, a corrente aparece no circuito TODO ao mesmo tempo
// (sentido convencional: + -> fio de cima -> lâmpada -> fio de baixo -> −), e a lâmpada acende NO MESMO INSTANTE
// (rampa de 150 ms, sem tremer). Os pulsos dão ~1 volta (1,6 s) e somem; a lâmpada fica acesa enquanto ativo.
// Repouso: lâmpada apagada. "Reduzir movimento": estado final (acesa, parada).

const menosMov = () => typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const suave = (a, b, x) => { const k = Math.min(1, Math.max(0, (x - a) / (b - a))); return k * k * (3 - 2 * k); };

let _promessa = null;
function carregar() {
  if (!_promessa) _promessa = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).loadAsync(urlModelo);
  return _promessa;
}

// câmera do render Cycles (impressa pelo F11_bake.py), deslocada para o centro do conjunto ficar na origem (giro)
const CAM = { pos: [1.4864, 2.7048, 7.6488], alvo: [1.7543, 1.3509, -0.0247], fov: 39.598 };
const OFF = V(CAM.alvo[0], 0, CAM.alvo[2]);

export default function circuitoAssado() {
  const g = new THREE.Group();
  const modelo = new THREE.Group(); modelo.position.copy(OFF).multiplyScalar(-1); g.add(modelo);
  const camAlvo = V(...CAM.alvo).sub(OFF);
  const camPos = V(...CAM.pos).sub(OFF).sub(camAlvo).multiplyScalar(1.1).add(camAlvo);   // 10% mais longe: margem igual aos outros ícones
  const camPosMundo = camPos.clone().add(OFF);

  const camadasAcesas = [];           // materiais da textura acesa (opacidade = brilho da lâmpada)
  const pulsos = []; let trechos = null, total = 0;
  let aceso = menosMov() ? 1 : 0;
  const NP = 14, DUR = 1.6;
  const pulsoTex = brilhoTex();
  for (let i = 0; i < NP; i++) {
    const p = new THREE.Sprite(new THREE.SpriteMaterial({ map: pulsoTex, color: 0xfff0a0, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }));
    p.scale.setScalar(0.3); p.renderOrder = 6; p.visible = false; modelo.add(p); pulsos.push(p);
  }

  function lampada(k) { for (const m of camadasAcesas) { m.opacity = k; m.visible = k > 0.002; } }

  carregar().then((gltf) => {
    const cena = gltf.scene.clone(true);
    const pendentes = [];
    cena.traverse((o) => {
      if (!o.isMesh) return;
      const m0 = o.material; const nome = o.name.split('.')[0].replace(/_\d+$/, '');
      o.castShadow = false; o.receiveShadow = false;
      if (nome === 'sombra') {
        o.material = new THREE.MeshBasicMaterial({ map: m0.map, transparent: true, depthWrite: false, toneMapped: false, vertexColors: !!o.geometry.attributes.color });
        o.position.y += 0.002; o.renderOrder = 1; return;
      }
      o.material = new THREE.MeshBasicMaterial({ map: m0.map, toneMapped: false, side: THREE.DoubleSide });
      if (m0.emissiveMap) pendentes.push([o, m0.emissiveMap]);
    });
    for (const [o, tex] of pendentes) {
      const m = new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false, depthFunc: THREE.LessEqualDepth, toneMapped: false });
      const c = new THREE.Mesh(o.geometry, m); c.renderOrder = 2; o.add(c); camadasAcesas.push(m);
    }
    modelo.add(cena);
    // percurso fechado da corrente; trechos dentro da lâmpada e da pilha existem, mas os pulsos ficam ocultos ali
    let fio = null; cena.traverse((o) => { if (o.userData && o.userData.ida) fio = o; });
    if (fio) {
      const ida = JSON.parse(fio.userData.ida).map((p) => V(...p)), volta = JSON.parse(fio.userData.volta).map((p) => V(...p));
      trechos = [
        { c: new THREE.CatmullRomCurve3(ida, false, 'centripetal'), vis: true },
        { c: new THREE.LineCurve3(ida[ida.length - 1], volta[0]), vis: false },
        { c: new THREE.CatmullRomCurve3(volta, false, 'centripetal'), vis: true },
        { c: new THREE.LineCurve3(volta[volta.length - 1], ida[0]), vis: false },
      ];
      for (const tr of trechos) { tr.ini = total; tr.len = tr.c.getLength(); total += tr.len; }
    }
    lampada(aceso);
  });

  const paraCam = new THREE.Vector3();
  function ponto(s) {
    s = ((s % total) + total) % total;
    for (const tr of trechos) if (s <= tr.ini + tr.len) return [tr.c.getPointAt(Math.min(1, (s - tr.ini) / tr.len)), tr.vis];
    return [trechos[0].c.getPointAt(0), false];
  }

  let t0 = null, ativoAnt = false;
  return {
    grupo: g, camera: { pos: camPos, alvo: camAlvo, fov: CAM.fov },
    animar(t, ativo, dt) {
      if (ativo && !ativoAnt) t0 = t; ativoAnt = ativo;
      if (ativo && t0 != null) {
        const tau = t - t0;
        aceso = suave(0, 0.15, tau);                   // acende junto com o surgimento da corrente
        const op = suave(0, 0.12, tau) * (1 - suave(DUR - 0.3, DUR, tau));
        if (trechos) {
          for (let i = 0; i < NP; i++) {
            const [p, vis] = ponto((i / NP) * total + (tau / DUR) * total);
            // o pulso fica na face do fio voltada para a câmera (o centro do fio está dentro do tubo)
            paraCam.copy(camPosMundo).sub(p).normalize().multiplyScalar(0.1);
            pulsos[i].position.copy(p).add(paraCam); pulsos[i].visible = vis && op > 0.001; pulsos[i].material.opacity = op;
          }
        }
      } else {
        aceso += ((menosMov() ? 1 : 0) - aceso) * Math.min(1, dt * 14);   // volta ao repouso em ~250 ms
        for (const p of pulsos) { p.material.opacity = 0; p.visible = false; }
      }
      lampada(aceso);
    },
  };
}

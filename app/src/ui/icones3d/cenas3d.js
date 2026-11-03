import * as THREE from 'three';
import { V, redesenho } from './base.js';
import celula from './cenas/celula.js';
import atomo from './cenas/atomo.js';
import solidos from './cenas/solidos.js';
import livros from './cenas/livros.js';
import circuito from './cenas/circuito.js';
import bussola from './cenas/bussola.js';

export const CENAS = { celula, atomo, solidos, livros, circuito, bussola };
export const NOMES = { celula: 'Biologia — célula animal', atomo: 'Química — átomo', solidos: 'Matemática — sólidos', livros: 'Português — livros e pena',
  circuito: 'Física — circuito elétrico', bussola: 'Geografia — mapa e bússola' };
export const FUNCAO = { celula: 'Secreção: vesículas saem do Golgi e se fundem à membrana.', atomo: 'Os elétrons percorrem uma volta das órbitas (átomo neutro de carbono: 6 prótons, 6 nêutrons, 6 elétrons; modelo escolar).',
  solidos: 'O conjunto gira um pouco e mostra as faces e o volume dos sólidos.', livros: 'A pena molha uma vez no tinteiro para escrever.',
  circuito: 'Ao fechar o circuito, a corrente passa ao mesmo tempo no circuito todo (do + ao −) e a lâmpada acende na hora.', bussola: 'A agulha oscila, se acomoda apontando o norte, e o alfinete espeta o ponto no mapa.' };

// =====================================================================================
// Palco único (um só contexto WebGL) que desenha várias cenas em vários elementos da página (scissor).
export async function criarPalco(_canvasIgnorado, { claro = true } = {}) {
  // Um motor WebGL fora da tela desenha cada cena e copia o resultado para um <canvas> 2D próprio dentro do elemento
  // (sem camada sobre a página, sem limite de contextos). Só redesenha quando algo muda: animação ativa, assentando,
  // elemento visível novo, redimensionado ou troca de tema. Pausa com a aba oculta.
  const { RoomEnvironment } = await import('three/addons/environments/RoomEnvironment.js');
  const off = document.createElement('canvas');
  const r = new THREE.WebGLRenderer({ canvas: off, antialias: true, alpha: true });
  const dpr = Math.min(2, window.devicePixelRatio || 1); r.setPixelRatio(1);
  r.outputColorSpace = THREE.SRGBColorSpace; r.toneMapping = THREE.ACESFilmicToneMapping; r.toneMappingExposure = 1.05;
  r.shadowMap.enabled = true; r.shadowMap.type = THREE.PCFSoftShadowMap;
  const pm = new THREE.PMREMGenerator(r); const env = pm.fromScene(new RoomEnvironment(), 0.04).texture;
  const vistas = [];
  const visiveis = new Set();
  const io = new IntersectionObserver((es) => { for (const e of es) { const v = vistas.find((x) => x.el === e.target); if (!v) continue; if (e.isIntersecting) { visiveis.add(v); v.sujo = true; } else visiveis.delete(v); } });
  function montar(el, chave) {
    if (!CENAS[chave]) return null;
    const s = new THREE.Scene(); s.environment = env;
    const c = CENAS[chave](); s.add(c.grupo);
    const cam = new THREE.PerspectiveCamera(c.camera.fov, 1, 0.1, 50); cam.position.copy(c.camera.pos); cam.lookAt(c.camera.alvo);
    const dir = c.camera.pos.clone().sub(c.camera.alvo).setY(0).normalize();
    // luz principal de frente e de cima (do lado da câmera): a sombra cai para trás, curta
    const L = new THREE.DirectionalLight(0xffffff, 2.2); L.position.copy(c.camera.alvo).add(dir.multiplyScalar(3)).add(V(0, 7, 0)); L.target.position.copy(c.camera.alvo);
    L.castShadow = true; L.shadow.mapSize.set(1024, 1024); L.shadow.radius = 6; L.shadow.bias = -0.0004; L.shadow.normalBias = 0.02;
    Object.assign(L.shadow.camera, { left: -3, right: 3, top: 3, bottom: -3, near: 0.5, far: 20 });
    s.add(L, L.target, new THREE.HemisphereLight(0xffffff, 0xe8e0d0, 0.6));
    const chao = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), new THREE.ShadowMaterial({ opacity: claro ? 0.22 : 0.45 })); chao.rotation.x = -Math.PI / 2; chao.receiveShadow = true; s.add(chao);
    const tela = document.createElement('canvas'); tela.className = 'palco3d-tela';
    tela.style.cssText = 'display:block;width:100%;height:100%;pointer-events:none';
    el.appendChild(tela);
    const v = { el, s, c, cam, tela, ctx: tela.getContext('2d'), ativo: false, giro: 0, giroAlvo: 0, sujo: true, ate: 0 };
    const liga = () => { v.ativo = true; }, desliga = () => { v.ativo = false; v.arrasto = null; v.ate = performance.now() + 2600; };
    Object.defineProperty(v, 'ativo', { get() { return v._ativo; }, set(x) { if (v._ativo && !x) v.ate = performance.now() + 2600; v._ativo = x; v.sujo = true; } });
    v._ativo = false;
    el.addEventListener('pointerenter', liga); el.addEventListener('pointerleave', desliga);
    el.addEventListener('focusin', liga); el.addEventListener('focusout', desliga);
    el.addEventListener('pointerdown', (e) => { v.ativo = true; if (!el.dataset.semgiro) v.arrasto = e.clientX; });
    el.addEventListener('pointerup', () => { v.arrasto = null; });
    el.addEventListener('pointermove', (e) => { if (v.arrasto != null) { v.giroAlvo += (e.clientX - v.arrasto) * 0.012; v.arrasto = e.clientX; v.sujo = true; } });
    vistas.push(v); io.observe(el); return v;
  }
  function desmontar(v) { const i = vistas.indexOf(v); if (i >= 0) vistas.splice(i, 1); visiveis.delete(v); io.unobserve(v.el); v.tela.remove(); }
  function tema(cl) { claro = cl; for (const v of vistas) { v.s.traverse((o) => { if (o.material && o.material.isShadowMaterial) o.material.opacity = cl ? 0.22 : 0.45; }); v.sujo = true; } }
  const relogio = new THREE.Clock(); let parar = false; let visto = redesenho.n;
  const menos = window.matchMedia('(prefers-reduced-motion: reduce)');
  function quadro() {
    if (parar) return; requestAnimationFrame(quadro);
    const dt = Math.min(0.05, relogio.getDelta()), t = relogio.elapsedTime;
    if (document.hidden) return;
    const agora = performance.now();
    if (redesenho.n !== visto) { visto = redesenho.n; for (const v of visiveis) v.sujo = true; }
    for (const v of visiveis) {
      const w = Math.max(1, Math.round(v.el.clientWidth * dpr)), h = Math.max(1, Math.round(v.el.clientHeight * dpr));
      const mexendo = v.ativo || agora < v.ate || Math.abs(v.giroAlvo - v.giro) > 0.001;
      if (!mexendo && !v.sujo && v.tela.width === w && v.tela.height === h) continue;
      if (v.tela.width !== w || v.tela.height !== h) { v.tela.width = w; v.tela.height = h; }
      if (off.width < w || off.height < h) r.setSize(Math.max(off.width, w), Math.max(off.height, h), false);
      v.giro += (v.giroAlvo - v.giro) * Math.min(1, dt * 8); v.c.grupo.rotation.y = v.giro;
      v.c.animar(menos.matches ? 0 : t, menos.matches ? false : v.ativo, dt);
      r.setViewport(0, 0, w, h); r.setScissor(0, 0, w, h); r.setScissorTest(true);
      r.setClearColor(0x000000, 0); r.clear();
      v.cam.aspect = w / h; v.cam.updateProjectionMatrix(); r.render(v.s, v.cam);
      v.ctx.clearRect(0, 0, w, h); v.ctx.drawImage(off, 0, off.height - h, w, h, 0, 0, w, h);
      v.sujo = false;
    }
  }
  quadro();
  return { montar, desmontar, tema, parar: () => { parar = true; io.disconnect(); r.dispose(); }, vistas };
}

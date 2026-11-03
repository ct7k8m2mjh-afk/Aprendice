import * as THREE from 'three';
import { V } from './base.js';
import celula from './cenas/celula.js';
import atomo from './cenas/atomo.js';
import solidos from './cenas/solidos.js';
import livros from './cenas/livros.js';
import circuito from './cenas/circuito.js';
import bussola from './cenas/bussola.js';

export const CENAS = { celula, atomo, solidos, livros, circuito, bussola };
export const NOMES = { celula: 'Biologia — célula animal', atomo: 'Química — átomo', solidos: 'Matemática — sólidos', livros: 'Português — livros e pena',
  circuito: 'Física — circuito elétrico', bussola: 'Geografia — mapa e bússola' };
export const FUNCAO = { celula: 'Vesículas saem do Golgi rumo à membrana; mitocôndrias pulsam (energia).', atomo: 'Elétrons percorrem as órbitas.',
  solidos: 'Cada sólido gira sobre o próprio eixo, mostrando o volume.', livros: 'A pena molha no tinteiro para escrever.',
  circuito: 'A corrente sai do +, corre no fio até a lâmpada, volta ao −; a lâmpada acende.', bussola: 'A agulha oscila e aponta o norte; o alfinete marca o ponto.' };

// =====================================================================================
// Palco único (um só contexto WebGL) que desenha várias cenas em vários elementos da página (scissor).
export async function criarPalco(canvas, { claro = true, recorte = null } = {}) {
  const { RoomEnvironment } = await import('three/addons/environments/RoomEnvironment.js');
  const r = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  r.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  r.outputColorSpace = THREE.SRGBColorSpace; r.toneMapping = THREE.ACESFilmicToneMapping; r.toneMappingExposure = 1.05;
  r.shadowMap.enabled = true; r.shadowMap.type = THREE.PCFSoftShadowMap; r.setScissorTest(true);
  const pm = new THREE.PMREMGenerator(r); const env = pm.fromScene(new RoomEnvironment(), 0.04).texture;
  const vistas = [];
  function montar(el, chave) {
    const s = new THREE.Scene(); s.environment = env; if (!CENAS[chave]) return null;
    const c = CENAS[chave](); s.add(c.grupo);
    // luz principal de frente e de cima (do lado da câmera): a sombra cai para trás, curta
    const cam = new THREE.PerspectiveCamera(c.camera.fov, 1, 0.1, 50); cam.position.copy(c.camera.pos); cam.lookAt(c.camera.alvo);
    const dir = c.camera.pos.clone().sub(c.camera.alvo).setY(0).normalize();
    const L = new THREE.DirectionalLight(0xffffff, 2.2); L.position.copy(c.camera.alvo).add(dir.multiplyScalar(3)).add(V(0, 7, 0)); L.target.position.copy(c.camera.alvo);
    L.castShadow = true; L.shadow.mapSize.set(1024, 1024); L.shadow.radius = 6; L.shadow.bias = -0.0004; L.shadow.normalBias = 0.02;
    Object.assign(L.shadow.camera, { left: -3, right: 3, top: 3, bottom: -3, near: 0.5, far: 20 });
    s.add(L, L.target, new THREE.HemisphereLight(0xffffff, 0xe8e0d0, 0.6));
    const chao = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), new THREE.ShadowMaterial({ opacity: claro ? 0.22 : 0.45 })); chao.rotation.x = -Math.PI / 2; chao.receiveShadow = true; s.add(chao);
    const v = { el, s, c, cam, ativo: false, giro: 0, giroAlvo: 0 };
    el.addEventListener('pointerenter', () => { v.ativo = true; }); el.addEventListener('pointerleave', () => { v.ativo = false; v.arrasto = null; });
    el.addEventListener('focusin', () => { v.ativo = true; }); el.addEventListener('focusout', () => { v.ativo = false; });
    el.addEventListener('pointerdown', (e) => { v.arrasto = e.clientX; v.ativo = true; });
    el.addEventListener('pointerup', () => { v.arrasto = null; });
    el.addEventListener('pointermove', (e) => { if (v.arrasto != null) { v.giroAlvo += (e.clientX - v.arrasto) * 0.012; v.arrasto = e.clientX; } });
    vistas.push(v); return v;
  }
  function desmontar(v) { const i = vistas.indexOf(v); if (i >= 0) vistas.splice(i, 1); }
  function tema(c) { for (const v of vistas) v.s.traverse((o) => { if (o.material && o.material.isShadowMaterial) o.material.opacity = c ? 0.22 : 0.45; }); claro = c; }
  const relogio = new THREE.Clock(); let parar = false;
  const menos = window.matchMedia('(prefers-reduced-motion: reduce)');
  function quadro() {
    if (parar) return; requestAnimationFrame(quadro);
    const W = canvas.clientWidth, H = canvas.clientHeight;
    if (canvas.width !== Math.floor(W * r.getPixelRatio()) || canvas.height !== Math.floor(H * r.getPixelRatio())) r.setSize(W, H, false);
    const dt = Math.min(0.05, relogio.getDelta()), t = relogio.elapsedTime;
    r.setScissor(0, 0, W, H); r.setClearColor(0x000000, 0); r.clear();
    const cr = canvas.getBoundingClientRect();
    const rc = recorte ? recorte() : { left: cr.left, top: cr.top, right: cr.right, bottom: cr.bottom };
    for (const v of vistas) {
      const b = v.el.getBoundingClientRect();
      const l = Math.max(b.left, rc.left), tp = Math.max(b.top, rc.top), rr = Math.min(b.right, rc.right), bt = Math.min(b.bottom, rc.bottom);
      if (rr - l < 2 || bt - tp < 2 || b.width < 2) continue;
      v.giro += (v.giroAlvo - v.giro) * Math.min(1, dt * 8); v.c.grupo.rotation.y = v.giro;
      v.c.animar(menos.matches ? 0 : t, menos.matches ? false : v.ativo, dt);
      const x = b.left - cr.left, y = cr.bottom - b.bottom;
      r.setViewport(x, y, b.width, b.height); r.setScissor(l - cr.left, cr.bottom - bt, rr - l, bt - tp);
      v.cam.aspect = b.width / b.height; v.cam.updateProjectionMatrix(); r.render(v.s, v.cam);
    }
  }
  quadro();
  return { montar, desmontar, tema, parar: () => { parar = true; r.dispose(); }, vistas };
}

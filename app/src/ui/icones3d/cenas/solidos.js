/* eslint-disable */
import { THREE, V, TAU, plast, metal, ruido, semente, texPaginas, texPena, brilhoTex, malha, esfera, caminhoArredondado } from '../base.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

// perfil de torno com cantos arredondados (cilindro e cone de brinquedo, bordas suaves como na referência)
function torno(pts, seg = 72) { return new THREE.LatheGeometry(pts, seg); }
function arco(lista, cx, cy, r, a0, a1, n = 6) { for (let i = 0; i <= n; i++) { const a = a0 + (a1 - a0) * (i / n); lista.push(new THREE.Vector2(cx + Math.cos(a) * r, cy + Math.sin(a) * r)); } }
function cilindroArred(r, h, b) {
  const p = [new THREE.Vector2(0, 0)]; arco(p, r - b, b, b, -Math.PI / 2, 0); arco(p, r - b, h - b, b, 0, Math.PI / 2); p.push(new THREE.Vector2(0, h));
  return torno(p);
}
function coneArred(r, h, b) {
  const p = [new THREE.Vector2(0, 0)]; arco(p, r - b, b, b, -Math.PI / 2, -0.15); p.push(new THREE.Vector2(0.004, h)); p.push(new THREE.Vector2(0, h));
  return torno(p);
}
// sombra de contato suave (mancha radial no chão)
function manchaSombra(rx, rz, opac) {
  const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d');
  const gr = x.createRadialGradient(64, 64, 0, 64, 64, 64);
  gr.addColorStop(0, `rgba(55,55,65,${opac})`); gr.addColorStop(0.55, `rgba(55,55,65,${opac * 0.4})`); gr.addColorStop(1, 'rgba(55,55,65,0)');
  x.fillStyle = gr; x.fillRect(0, 0, 128, 128);
  const m = new THREE.Mesh(new THREE.PlaneGeometry(rx * 2, rz * 2), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true, depthWrite: false }));
  m.rotation.x = -Math.PI / 2; m.position.y = 0.003; m.renderOrder = -1; return m;
}

// =====================================================================================
// MATEMÁTICA — sólidos geométricos: cilindro verde (atrás), cubo azul (frente, esquerda),
// esfera vermelha (frente, centro), cone dourado (direita). Bem juntos, brilhantes.
// Função: mostrar o volume — cada sólido gira devagar sobre o próprio eixo.
export default function solidos() {
  const g = new THREE.Group();
  const cil = malha(cilindroArred(0.56, 1.68, 0.06), plast(0x18833a, { rug: 0.2, coat: 1, coatRug: 0.08 })); cil.position.set(-0.56, 0, -0.75);
  const cub = malha(new RoundedBoxGeometry(1.0, 1.0, 1.0, 4, 0.07), plast(0x0e4fc4, { rug: 0.2, coat: 1, coatRug: 0.08 }));
  cub.position.set(-0.86, 0.5, 0.15); cub.rotation.y = -0.14;
  const con = malha(coneArred(0.66, 1.72, 0.05), plast(0xe8920c, { rug: 0.24, metal: 0.5, coat: 1, coatRug: 0.15 })); con.position.set(0.72, 0, -0.28);
  const esf = esfera(0.5, plast(0xdc1a18, { rug: 0.32, coat: 1, coatRug: 0.3 }), 64); esf.position.set(0.22, 0.5, 0.55);
  g.add(cil, cub, con, esf);
  // luz de cima, suave e sem sombra: as faces superiores ficam mais claras que as frontais (como na referência)
  const topo = new THREE.DirectionalLight(0xffffff, 3.2); topo.position.set(-0.4, 6, -0.6); topo.target.position.set(0, 0, 0); g.add(topo, topo.target);
  const sombra = manchaSombra(1.9, 1.3, 0.35); sombra.position.set(0, 0.003, 0.05); g.add(sombra);
  const sol = [cil, cub, con];
  return {
    grupo: g, camera: { pos: V(0.2, 3.75, 6.2), alvo: V(-0.02, 0.8, 0), fov: 26 },
    // uma vez por ativação (pesquisa: 1–2,5 s, sem laço); terminado, fica no estado final
    _passo(t, ativo, dur) { if (ativo && !this._at && (this._t0 == null || t - this._t0 >= dur)) this._t0 = t; this._at = ativo;
      if (this._t0 == null) return 1; const p = Math.min(1, Math.max(0, (t - this._t0) / dur)); return p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2; },
    animar(t, ativo, dt) {
      // o conjunto gira ~40° uma vez (mostra outra face e o volume) e para; ao sair, volta devagar
      if (!this._gi) { this._gi = new THREE.Group(); const filhos = [...g.children]; for (const c of filhos) this._gi.add(c); g.add(this._gi); }
      const p = this._passo(t, ativo, 1.6);
      this._alvo = ativo ? 0.7 * p : 0;
      this._r = (this._r || 0) + (this._alvo - (this._r || 0)) * Math.min(1, dt * (ativo ? 12 : 3));
      this._gi.rotation.y = this._r;
    },
  };
}

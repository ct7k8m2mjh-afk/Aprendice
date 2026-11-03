/* eslint-disable */
import { THREE, V, TAU, plast, metal, ruido, semente, texPaginas, texPena, brilhoTex, malha, esfera, caminhoArredondado } from '../base.js';

// =====================================================================================
// MATEMÁTICA — sólidos geométricos: cilindro verde, cubo azul, cone amarelo, esfera vermelha.
// Função: mostrar o volume — cada sólido gira devagar sobre o próprio eixo.
export default function solidos() {
  const g = new THREE.Group();
  const cil = malha(new THREE.CylinderGeometry(0.48, 0.48, 1.25, 72), plast(0x1f9a3a, { rug: 0.22, coat: 1 })); cil.position.set(-0.35, 0.625, -0.55);
  const cub = malha(new THREE.BoxGeometry(1, 1, 1), plast(0x1f5fd6, { rug: 0.22, coat: 1 })); cub.position.set(-0.75, 0.5, 0.35);
  const con = malha(new THREE.ConeGeometry(0.55, 1.35, 72), plast(0xf2b705, { rug: 0.25, metal: 0.25, coat: 1 })); con.position.set(0.85, 0.675, -0.35);
  const esf = esfera(0.5, plast(0xd62828, { rug: 0.18, coat: 1 }), 64); esf.position.set(0.3, 0.5, 0.6);
  for (const m of [cub]) { const e = new THREE.LineSegments(new THREE.EdgesGeometry(m.geometry), new THREE.LineBasicMaterial({ color: 0x0d3a8a, transparent: true, opacity: 0.35 })); m.add(e); }
  g.add(cil, cub, con, esf);
  const sol = [cil, cub, con];
  return {
    grupo: g, camera: { pos: V(0.4, 2.6, 5.2), alvo: V(0, 0.55, 0), fov: 32 },
    animar(t, ativo, dt) {
      this._v = (this._v || 0) + ((ativo ? 1.2 : 0) - (this._v || 0)) * Math.min(1, dt * 3);
      sol.forEach((m, i) => { m.rotation.y += dt * this._v * (i % 2 ? -0.8 : 0.8); });
      esf.position.y = 0.5 + Math.abs(Math.sin(t * 3)) * 0.18 * this._v;
    },
  };
}

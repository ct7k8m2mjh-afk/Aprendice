/* eslint-disable */
import { THREE, V, TAU, plast, metal, ruido, semente, texPaginas, texPena, brilhoTex, malha, esfera, caminhoArredondado } from '../base.js';

// =====================================================================================
// PORTUGUÊS — dois livros, tinteiro azul e pena. Função: escrever — a pena molha no tinteiro e volta.
export default function livros() {
  const g = new THREE.Group();
  const capa = plast(0x9e2a22, { rug: 0.55, coat: 0.3, bump: ruido(), bumpE: 0.8 }), pag = plast(0xffffff, { map: texPaginas(), rug: 0.85, coat: 0 });
  function livro(w, h, d) {
    const l = new THREE.Group();
    const c1 = malha(new THREE.BoxGeometry(w, 0.05, d), capa); c1.position.y = h - 0.025;
    const c2 = malha(new THREE.BoxGeometry(w, 0.05, d), capa); c2.position.y = 0.025;
    const lomb = malha(new THREE.BoxGeometry(0.06, h, d), capa); lomb.position.set(-w / 2 + 0.03, h / 2, 0);
    const p = malha(new THREE.BoxGeometry(w - 0.1, h - 0.09, d - 0.06), pag); p.position.set(0.02, h / 2, 0);
    l.add(c1, c2, lomb, p); return l;
  }
  const l1 = livro(1.7, 0.42, 1.15); l1.position.set(-0.2, 0, 0); l1.rotation.y = -0.12;
  const l2 = livro(1.6, 0.38, 1.1); l2.position.set(-0.15, 0.42, 0.02); l2.rotation.y = 0.05;
  g.add(l1, l2);
  // tinteiro
  const vid = plast(0x153a8a, { rug: 0.12, coat: 1, coatRug: 0.04 });
  const perfT = [V(0, 0, 0), V(0.38, 0, 0), V(0.42, 0.05, 0), V(0.42, 0.38, 0), V(0.3, 0.5, 0), V(0.16, 0.54, 0), V(0.16, 0.66, 0), V(0.2, 0.68, 0), V(0.2, 0.72, 0), V(0, 0.72, 0)].map((p) => new THREE.Vector2(p.x, p.y));
  const tint = malha(new THREE.LatheGeometry(perfT, 72), vid); tint.position.set(0.95, 0, 0.45); g.add(tint);
  // pena
  const pena = new THREE.Group();
  const forma = new THREE.Shape(); forma.moveTo(0, 0); forma.quadraticCurveTo(0.17, 0.45, 0.1, 1.05); forma.quadraticCurveTo(0.02, 1.2, -0.05, 1.05); forma.quadraticCurveTo(-0.13, 0.5, 0, 0);
  const plum = malha(new THREE.ExtrudeGeometry(forma, { depth: 0.015, bevelEnabled: true, bevelThickness: 0.01, bevelSize: 0.01, bevelSegments: 2, curveSegments: 32 }), plast(0xe9d4a8, { map: texPena(), rug: 0.6, coat: 0.1, sheen: 1, sheenCor: 0xfff4dc, lado: THREE.DoubleSide }));
  plum.position.set(0, 0.25, 0); pena.add(plum);
  const haste = malha(new THREE.CylinderGeometry(0.012, 0.02, 1.35, 12), plast(0xd9c49a, { rug: 0.4 })); haste.position.set(0.02, 0.62, 0.01); pena.add(haste);
  const bico = malha(new THREE.ConeGeometry(0.02, 0.12, 12), metal(0x2a2a2a, 0.3)); bico.rotation.x = Math.PI; bico.position.set(0.02, -0.05, 0.01); pena.add(bico);
  pena.position.set(0.95, 0.5, 0.45); pena.rotation.set(0.05, 0.5, -0.32); g.add(pena);
  return {
    grupo: g, camera: { pos: V(0.4, 2.2, 5.3), alvo: V(0.25, 0.8, 0.1), fov: 32 },
    animar(t, ativo, dt) {
      this._a = (this._a || 0) + ((ativo ? 1 : 0) - (this._a || 0)) * Math.min(1, dt * 4);
      const mergulho = Math.max(0, Math.sin(t * 2.2)) * this._a;
      pena.position.y = 0.5 - mergulho * 0.2; pena.rotation.z = -0.32 + mergulho * 0.1;
    },
  };
}

/* eslint-disable */
import { THREE, V, TAU, plast, metal, ruido, semente, texPaginas, texPena, brilhoTex, malha, esfera, caminhoArredondado } from '../base.js';

// =====================================================================================
// QUÍMICA — átomo (modelo planetário escolar): núcleo de prótons (vermelhos) e nêutrons (cinza),
// três órbitas finas metálicas. Função: os elétrons percorrem as órbitas.
export default function atomo() {
  const g = new THREE.Group(); const centro = new THREE.Group(); centro.position.y = 1.1; g.add(centro);
  const prot = plast(0xc8141c, { rug: 0.25, coat: 1, coatRug: 0.1 }), neut = plast(0xb9bcc2, { rug: 0.3, metal: 0.2, coat: 1, coatRug: 0.12 });
  const pts = [[0, 0, 0], [0.26, 0.08, 0.05], [-0.24, 0.1, -0.06], [0.05, 0.27, -0.1], [0.08, -0.25, 0.08], [-0.1, -0.12, 0.25], [0.12, 0.1, 0.27], [-0.2, 0.2, 0.18],
    [0.22, -0.16, -0.15], [-0.18, -0.2, -0.17], [0.02, 0.05, -0.29], [0.28, 0.25, -0.05], [-0.3, -0.05, 0.08]];
  pts.forEach((p, i) => { const e = esfera(0.17, i % 2 ? neut : prot, 40); e.position.set(...p); centro.add(e); });
  const orbM = metal(0x9aa0a8, 0.18), eletM = plast(0x1f6fe0, { rug: 0.2, coat: 1, coatRug: 0.06 });
  const orbitas = [];
  [0, Math.PI / 3, -Math.PI / 3].forEach((rz, k) => {
    const o = new THREE.Group(); o.rotation.set(0.42, 0, rz, 'ZXY'); centro.add(o);
    const tor = malha(new THREE.TorusGeometry(1, 0.016, 12, 200), orbM); tor.scale.set(1.3, 0.48, 1); o.add(tor);
    const el = [esfera(0.12, eletM, 32), esfera(0.12, eletM, 32)]; el.forEach((e) => o.add(e));
    orbitas.push({ el, vel: [1, 1.4, 1.2][k], fase: k * 0.7 });
  });
  return {
    grupo: g, camera: { pos: V(0, 1.75, 5.2), alvo: V(0, 1.1, 0), fov: 32 },
    _v: 0,
    animar(t, ativo, dt) {
      this._v += ((ativo ? 1.6 : 0.25) - this._v) * Math.min(1, dt * 3);
      this._s = (this._s || 0) + dt * this._v;
      for (const o of orbitas) o.el.forEach((e, i) => { const a = this._s * o.vel + o.fase + i * Math.PI; e.position.set(Math.cos(a) * 1.3, Math.sin(a) * 0.48, 0); });
      centro.rotation.y = Math.sin(this._s * 0.3) * 0.05;
    },
  };
}

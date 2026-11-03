/* eslint-disable */
import { THREE, V, TAU, plast, metal, ruido, semente, texPaginas, texPena, brilhoTex, malha, esfera, caminhoArredondado } from '../base.js';

// sombra de contato suave (mancha radial no chão), própria desta cena
function manchaSombra(rx, rz, opac) {
  const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d');
  const gr = x.createRadialGradient(64, 64, 0, 64, 64, 64);
  gr.addColorStop(0, `rgba(60,60,70,${opac})`); gr.addColorStop(0.5, `rgba(60,60,70,${opac * 0.45})`); gr.addColorStop(1, 'rgba(60,60,70,0)');
  x.fillStyle = gr; x.fillRect(0, 0, 128, 128);
  const m = new THREE.Mesh(new THREE.PlaneGeometry(rx * 2, rz * 2), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true, depthWrite: false }));
  m.rotation.x = -Math.PI / 2; m.position.y = 0.003; m.renderOrder = -1; return m;
}

// =====================================================================================
// QUÍMICA — átomo (modelo planetário escolar): núcleo compacto de prótons (vermelhos) e nêutrons (cinza),
// três órbitas finas metálicas que se cruzam, dois elétrons azuis por órbita. Função: os elétrons percorrem as órbitas.
export default function atomo() {
  const g = new THREE.Group(); const centro = new THREE.Group(); centro.position.y = 1.05; g.add(centro);
  const prot = plast(0xc4141c, { rug: 0.3, coat: 1, coatRug: 0.22 });
  const neut = plast(0xcfd1d5, { rug: 0.3, metal: 0.2, coat: 1, coatRug: 0.2 });
  // núcleo: nêutrons atrás/acima à direita, prótons à frente/abaixo à esquerda (como na referência)
  const N = [[-0.33, 0.42, -0.25], [0.04, 0.44, -0.08], [0.4, 0.34, -0.12], [0.39, 0.0, 0.05], [0.12, 0.12, -0.35], [-0.1, 0.0, -0.3]];
  const P = [[-0.45, 0.08, 0.02], [-0.18, 0.26, 0.16], [-0.14, -0.14, 0.3], [0.22, -0.3, 0.2], [-0.04, -0.46, 0.06], [0.08, 0.06, 0.1]];
  N.forEach((p) => { const e = esfera(0.27, neut, 32); e.position.set(...p).multiplyScalar(0.9); e.position.x += 0.1; e.position.y -= 0.04; e.castShadow = false; centro.add(e); });
  P.forEach((p) => { const e = esfera(0.28, prot, 32); e.position.set(...p).multiplyScalar(0.9); e.position.x += 0.1; e.position.y -= 0.04; e.castShadow = false; centro.add(e); });
  const orbM = metal(0x8f959d, 0.18), eletM = plast(0x1a74e0, { rug: 0.18, coat: 1, coatRug: 0.05 });
  // [semieixo, inclinação para o fundo (rad), ângulo no plano da tela (rad), deslocamento x, y]
  const def = [
    [1.3, -1.3, 0.03, 0.0, -0.13],
    [1.16, -1.3, 0.62, 0.1, -0.06],
    [1.12, 1.31, 1.86, 0.17, 0.12],
  ];
  const orbitas = [];
  def.forEach(([a, fi, te, ox, oy], k) => {
    const ext = new THREE.Group(); ext.rotation.z = te; ext.position.set(ox, oy, 0); centro.add(ext);
    const o = new THREE.Group(); o.rotation.x = fi; ext.add(o);
    const tor = malha(new THREE.TorusGeometry(a, 0.012, 8, 160), orbM, false); o.add(tor);
    const el = [esfera(0.14, eletM, 28), esfera(0.14, eletM, 28)]; el.forEach((e) => { e.castShadow = false; o.add(e); });
    orbitas.push({ el, a, vel: [1, 1.25, 1.1][k] });
  });
  const sombra = manchaSombra(1.3, 0.5, 0.7); sombra.position.set(0.35, 0.003, -0.15); g.add(sombra);
  // a cena "olha" a câmera: o plano das órbitas fica de frente para ela
  centro.rotation.x = -0.14;
  return {
    grupo: g, camera: { pos: V(0, 1.85, 5.15), alvo: V(0, 1.0, 0), fov: 32 },
    _v: 0,
    animar(t, ativo, dt) {
      this._v += ((ativo ? 1.6 : 0.08) - this._v) * Math.min(1, dt * 3);
      this._s = (this._s || 0) + dt * this._v;
      for (const o of orbitas) o.el.forEach((e, i) => { const s = this._s * o.vel + i * Math.PI; e.position.set(Math.cos(s) * o.a, Math.sin(s) * o.a, 0); });
    },
  };
}

import { describe, expect, it } from 'vitest';
import { passoCiclico, propsCopia } from '../ui/rolo';

// Faixa de temas em ciclo infinito (pedido do dono, 27/11/2026): volta = 1000px, tela de 900px, 4 voltas (max = 3100).
const V = 1000, MAX = 4 * V - 900;

describe('passoCiclico (faixa em ciclo)', () => {
  it('no meio da lista, anda normalmente', () => {
    expect(passoCiclico(300, 300, 140, V, MAX)).toEqual({ salto: 0, alvo: 440 });
  });
  it('depois do último tema segue para a cópia (o 1º tema de novo), sem saltar', () => {
    expect(passoCiclico(950, 950, 140, V, MAX)).toEqual({ salto: 0, alvo: 1090 });
  });
  it('passou de duas voltas: recua uma volta sem animação e continua', () => {
    expect(passoCiclico(2050, 2050, 140, V, MAX)).toEqual({ salto: -V, alvo: 1190 });
  });
  it('girando para cima no primeiro tema vai para o último', () => {
    expect(passoCiclico(0, 0, -140, V, MAX)).toEqual({ salto: V, alvo: 860 });
  });
  it('alvo pendente (giros seguidos) é respeitado e nunca passa do limite', () => {
    expect(passoCiclico(1500, 1900, 140, V, MAX)).toEqual({ salto: 0, alvo: 2040 });
    expect(passoCiclico(1500, 3050, 140, V, MAX).alvo).toBe(MAX);
  });
  it('passo de seta (80% da tela) sempre cabe nas 4 voltas, mesmo com a lista quase do tamanho da tela', () => {
    const v = 910, max = 4 * v - 900;
    for (let pos = 0; pos < 2 * v; pos += 37) {
      const r = passoCiclico(pos, pos, 720, v, max);
      expect(r.alvo).toBe(pos + r.salto + 720);
      const l = passoCiclico(pos, pos, -720, v, max);
      expect(l.alvo).toBe(pos + l.salto - 720);
    }
  });
  it('sem cópias, só limita', () => {
    expect(passoCiclico(0, 0, -140, 0, 500)).toEqual({ salto: 0, alvo: 0 });
  });
});

describe('propsCopia', () => {
  it('cópias fora do leitor de tela e do Tab; original intacto', () => {
    expect(propsCopia(0)).toEqual({});
    expect(propsCopia(2)).toEqual({ 'aria-hidden': true, tabIndex: -1, 'data-copia': 2 });
  });
});

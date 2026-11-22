import { describe, expect, it } from 'vitest';
import { partesFracao } from '../logica/fracao';
import { junta as juntaToks, tokeniza } from '../logica/motorConta';

/* Revisão de 21/11/2026, 6ª passada, itens Y (questao-correcao-5.md) */
const fr = (s: string, m?: string) => partesFracao(s, m).filter((p) => p.t === 'frac').map((p) => (p.t === 'frac' ? `${p.n}|${p.d}` : ''));
const junta = (s: string, m?: string) => partesFracao(s, m).map((p) => (p.t === 'txt' ? p.v : p.orig)).join('');

describe('Y1: o "× 10ⁿ" que multiplica depois da fração fica fora do denominador', () => {
  it('quí P3187c6e8 (cederj-2025-1): 32 ÷ 600, e o 10⁶ multiplica depois', () => {
    const s = '2,00 ppm sai de usar a massa molar do enxofre (32 g/mol) no lugar da do SO2 (64 g/mol): 3,75 × 10⁻⁵ × 32 ÷ 600 × 10⁶ = 2,00.';
    expect(fr(s, 'qui')).toEqual(['32|600']);
    expect(fr(s)).toEqual(['32|600']);
    expect(junta(s, 'qui')).toBe(s);
    expect(fr('2,40 × 10⁻³/600 × 10⁶ = 4,00 ppm', 'qui')).toEqual(['2,40 × 10⁻³|600']);
  });
  it('quí P88e49d5b (uel-2022): o parêntese fecha o numerador e o 10⁻² multiplica depois', () => {
    const s = 'C sai de calcular só o bário: (80 × 10⁻⁶)/137,3 × 10⁻² ≈ 5,8 × 10⁻⁹ mol. Faltam o chumbo e o antimônio.';
    expect(fr(s, 'qui')).toEqual(['80 × 10⁻⁶|137,3']);
    expect(junta(s, 'qui')).toBe(s);
  });
  it('a animação lê o mesmo', () => {
    const s = '3,75 × 10⁻⁵ × 32 ÷ 600 × 10⁶ = 2,00';
    const f = tokeniza(s).filter((t) => t.k === 'frac');
    expect(f.map((t) => [t.n, t.d])).toEqual([['32', '600']]);
    expect(juntaToks(tokeniza(s))).toBe(s);
  });
  it('o resultado escrito decide: um número só embaixo quando confere ("3,0 × 10⁸/13,6 × 10⁶ ≈ 22")', () => {
    expect(fr('λ = 3,0 × 10⁸ ÷ 10,6 × 10⁶ ≈ 28,3 m, e não 22 m.', 'fis')).toEqual(['3,0 × 10⁸|10,6 × 10⁶']);
    expect(fr('= 3,0 × 10⁸/13,6 × 10⁶ ≈ 22 m', 'fis')).toEqual(['3,0 × 10⁸|13,6 × 10⁶']);
    expect(fr('Árvore: 75 × 10²³/6 × 10²³ = 12,5 mol', 'qui')).toEqual(['75 × 10²³|6 × 10²³']);
  });
  it('sem resultado, só a mantissa (1 a menos de 10) puxa a potência', () => {
    expect(fr('6,3 × 10⁴/1,0 × 10⁵ e mais', 'fis')).toEqual(['6,3 × 10⁴|1,0 × 10⁵']);
    expect(fr('2,40 × 10⁻³/600 × 10⁶ e mais', 'qui')).toEqual(['2,40 × 10⁻³|600']);
    expect(fr('T = 0,6 ÷ 3,448 × 10⁻³ = 174 K', 'qui')).toEqual(['0,6|3,448 × 10⁻³']);
  });
});

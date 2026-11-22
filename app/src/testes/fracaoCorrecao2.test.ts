import { describe, expect, it } from 'vitest';
import { partesFracao } from '../logica/fracao';

/* Revisão de 21/11/2026, questão-correção 2 (docs/revisao-site/2026-11-21/questao-correcao-2.md) */
const fr = (s: string, m?: string) => partesFracao(s, m).filter((p) => p.t === 'frac').map((p) => (p.t === 'frac' ? `${p.n}|${p.d}` : ''));
const junta = (s: string, m?: string) => partesFracao(s, m).map((p) => (p.t === 'txt' ? p.v : p.orig)).join('');

describe('R2: fração com "ℓ" empilha', () => {
  it('fís P5b8f3493, Pa69a4a3c, P6335eb04 e mat P6f0e5f3e', () => {
    expect(fr('2π · √(m/k) = 2π · √(ℓ/g) → k/m = g/ℓ')).toEqual(['m|k', 'ℓ|g', 'k|m', 'g|ℓ']);
    expect(fr('v² = (g/ℓ) · (x₁ − x₀)²')).toEqual(['g|ℓ']);
    expect(fr('o termo 2ℓ²/(x₁ − x₀)² cresce')).toEqual(['2ℓ²|(x₁ − x₀)²']);
    expect(fr('segundo: ℓ = 3λ/2 → λ = 2ℓ/3')).toEqual(['3λ|2', '2ℓ|3']);
    expect(fr('|E| = √3 · k₀Q/ℓ² → alternativa E')).toEqual(['k₀Q|ℓ²']);
    expect(fr('ℓ = R√3 → a = ℓ/3 = R√3/3')).toEqual(['ℓ|3', 'R√3|3']);
  });
  it('o texto não muda', () => {
    for (const s of ['2π · √(ℓ/g) → k/m = g/ℓ', 'o termo 2ℓ²/(x₁ − x₀)² cresce']) expect(junta(s)).toBe(s);
  });
});

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

describe('R4: "t½" é um termo só; fração do Unicode empilha junto da empilhada', () => {
  it('qui Pd7109aee e tema Q09', () => {
    expect(fr('t/t½ = (1,40 × 10⁹)/(7,05 × 10⁸)')).toEqual(['t|t½', '1,40 × 10⁹|7,05 × 10⁸']);
    expect(fr('n = tempo ÷ t½')).toEqual(['tempo|t½']);
    expect(fr('1 → ½ → ¼ → ⅛ → 1/16')).toEqual(['1|2', '1|4', '1|8', '1|16']);
  });
  it('sem fração empilhada no texto, a do Unicode fica como está; o índice "t½" nunca vira fração', () => {
    expect(fr('NO + ½ O2 → NO2')).toEqual([]);
    expect(fr('t½ = 10 h → 3 meias-vidas')).toEqual([]);
  });
  it('o texto não muda', () => {
    for (const s of ['t/t½ = (1,40 × 10⁹)/(7,05 × 10⁸)', '1 → ½ → ¼ → ⅛ → 1/16', 'n = tempo ÷ t½']) expect(junta(s)).toBe(s);
  });
});

describe('R3: barra entre espécies químicas e rótulos fica na linha', () => {
  it('os 5 casos da revisão', () => {
    expect(fr('3 O–H, 1 N–H e 2 C=O/P=O', 'qui')).toEqual([]);
    expect(fr('TCE → ácidos com oxigênio → H₂O / CO₂ / Cl⁻', 'qui')).toEqual([]);
    expect(fr('ΔE° (O2/OH⁻) = 0,40 − (−0,44) = 0,84 V', 'qui')).toEqual([]);
    expect(fr('o par (R)/(S) não muda', 'qui')).toEqual([]);
    expect(fr('par conjugado: HA / A⁻', 'qui')).toEqual([]);
    expect(fr('E/Z')).toEqual([]);
  });
  it('a conta continua empilhada', () => {
    expect(fr('g\' = g × (1 − D/R)')).toEqual(['D|R']);
    expect(fr('D/L = (100/800)·2')).toEqual(['D|L', '100|800']);
    expect(fr('6 S = 0,60 L → L/S = 6/0,60 = 10')).toEqual(['L|S', '6|0,60']);
    expect(fr('C4H10N2O4/2 = C2H5NO2')).toEqual(['C4H10N2O4|2']);
  });
  it('o produto inteiro vai em cima quando o operando começa depois de índice ou expoente', () => {
    expect(fr('Ostwald: Ka = α²C ÷ (1 − α) ≈ α²C')).toEqual(['α²C|1 − α']);
    expect(fr('PQ = R₁R₂ ÷ (R₂ − R₁)')).toEqual(['R₁R₂|R₂ − R₁']);
    expect(fr('y = ³√x² ÷ √2')).toEqual(['³√x²|√2']);
  });
  it('o texto não muda', () => {
    for (const s of ['2 C=O/P=O', 'H₂O / CO₂ / Cl⁻', 'Ka = α²C ÷ (1 − α)', 'y = ³√x² ÷ √2']) expect(junta(s)).toBe(s);
  });
});

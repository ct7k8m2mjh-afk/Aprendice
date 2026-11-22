import { describe, expect, it } from 'vitest';
import { partesFracao } from '../logica/fracao';

/* Revisão de 21/11/2026, 4ª passada (docs/revisao-site/2026-11-21/questao-correcao-3.md e materias-3.md) */
const fr = (s: string, m?: string) => partesFracao(s, m).filter((p) => p.t === 'frac').map((p) => (p.t === 'frac' ? `${p.n}|${p.d}` : ''));
const junta = (s: string, m?: string) => partesFracao(s, m).map((p) => (p.t === 'txt' ? p.v : p.orig)).join('');

describe('S1: denominador entre colchetes empilha', () => {
  it('mat Pd46353b6 e outros colchetes que agrupam uma conta', () => {
    expect(fr('c = (√3 + 1)²/[(√3 − 1)(√3 + 1)] = (4 + 2√3)/2', 'mat')).toEqual(['(√3 + 1)²|[(√3 − 1)(√3 + 1)]', '4 + 2√3|2']);
    expect(fr('g = (p1 − p2)/[(h1 − h2)d]', 'fis')).toEqual(['p1 − p2|[(h1 − h2)d]']);
    expect(fr('β = [1 − (λg/λr)²]/[1 + (λg/λr)²] · c', 'fis')[0]).toBe('[1 − (λg/λr)²]|[1 + (λg/λr)²]');
  });
  it('concentração embaixo e colchete seguido de outro continuam na linha', () => {
    expect(fr('[A⁻]/[HA]', 'qui')).toEqual([]);
    expect(fr('[C]²/[A]·[B]', 'qui')).toEqual([]);
    expect(fr('logo [SO4²−]/[HSO4−] = Ka', 'qui')).toEqual([]);
    expect(fr('E = E° − 0,03 · log(1/[Cu2+])', 'qui')).toEqual([]);
  });
  it('o texto não muda', () => {
    const s = 'c = (√3 + 1)²/[(√3 − 1)(√3 + 1)] = (4 + 2√3)/2';
    expect(junta(s, 'mat')).toBe(s);
  });
});

describe('S2: "ℓ" com algarismo e "k₀Q/ℓ²" no meio da frase empilham', () => {
  it('fís P0a6b7f22 e P6335eb04', () => {
    expect(fr('U fixa: ℓ2/ℓ1 = P1/P2', 'fis')).toEqual(['ℓ2|ℓ1', 'P1|P2']);
    expect(fr('ℓ3/ℓ1 = 3300/5500 = 0,60', 'fis')).toEqual(['ℓ3|ℓ1', '3300|5500']);
    expect(fr('já dão um campo maior que k₀Q/ℓ² (√3 ≈ 1,73 vezes)', 'fis')).toEqual(['k₀Q|ℓ²']);
    expect(fr('a soma de dois vetores de módulo k₀Q/ℓ² com 60° entre eles', 'fis')).toEqual(['k₀Q|ℓ²']);
    expect(fr('k₀Q/ℓ² é o campo de uma só carga efetiva', 'fis')).toEqual(['k₀Q|ℓ²']);
  });
  it('variável com índice: o produto inteiro e o índice inteiro', () => {
    expect(fr('P₁V₁/T₁ = P₂V₂/T₂', 'fis')).toEqual(['P₁V₁|T₁', 'P₂V₂|T₂']);
    expect(fr('1/aₖ − 1/aₖ₊₁ = r/(aₖaₖ₊₁)', 'mat')).toEqual(['1|aₖ', '1|aₖ₊₁', 'r|aₖaₖ₊₁']);
    expect(fr('x = log₂10/3', 'mat')).toEqual(['log₂10|3']);
    expect(fr('+vₘ(t₂ − t₁)/2 − vₘ(t₃ − t₂)/2 = 0', 'fis')).toEqual(['vₘ(t₂ − t₁)|2', 'vₘ(t₃ − t₂)|2']);
  });
  it('pedaço de fórmula, espécie e par de ligações continuam na linha', () => {
    expect(fr('A razão H₂O/CO₂ é H/2C', 'qui')).toEqual(['H|2C']);
    expect(fr('baterias de lítio-iodo (Li/I₂).', 'qui')).toEqual([]);
    expect(fr('sobre ligações σ/π e funções', 'qui')).toEqual([]);
    expect(fr('A razão pₓ/p\'ₓ.', 'fis')).toEqual(['pₓ|p\'ₓ']); // (S5: o apóstrofo com índice é do denominador)
    expect(fr('Aℓ2O3 e Aℓ3+', 'qui')).toEqual([]);
  });
  it('o texto não muda', () => {
    for (const s of ['U fixa: ℓ2/ℓ1 = P1/P2', 'maior que k₀Q/ℓ² (√3 ≈ 1,73 vezes)', '1/aₖ − 1/aₖ₊₁ = r/(aₖaₖ₊₁)']) expect(junta(s, 'fis')).toBe(s);
  });
});

describe('S3: letra sobre zero é divisão de verdade', () => {
  it('fís P8d52a008', () => {
    expect(fr('nenhum material tem índice de refração nulo: a luz teria velocidade c/0, infinita;', 'fis')).toEqual(['c|0']);
    expect(fr('a luz teria velocidade c ÷ 0', 'fis')).toEqual(['c|0']);
  });
  it('sinal ecológico, ligações e carga sobre zero continuam na linha (R6)', () => {
    expect(fr('relação (0 / 0) entre as espécies', 'bio')).toEqual([]);
    expect(fr('Conte ligações e pares livres: 4/0, 5/0.', 'qui')).toEqual([]);
    expect(fr('{x ∈ R/0 < x < 1}', 'mat')).toEqual([]);
    expect(fr('{x ∈ R / 0 < x < 1}', 'mat')).toEqual([]);
    expect(fr('carga +1/0 no átomo', 'qui')).toEqual([]);
    expect(fr('f(3) = 0/0', 'mat')).toEqual(['0|0']);
  });
});

describe('S4: ângulo em cima empilha', () => {
  it('geo P3adaa388, mat Pe9cd1f75, Pc784cb63 e Pd5b9e245', () => {
    expect(fr('360°/24 h = 15° por hora', 'geo')).toEqual(['360°|24 h']);
    expect(fr('360°/24 = 15°', 'geo')).toEqual(['360°|24']);
    expect(fr('sen(180°/n) e 180°/n = 30°', 'mat')).toEqual(['180°|n', '180°|n']);
    expect(fr('360°/6 = 60° e 720°/3 = 240°', 'mat')).toEqual(['360°|6', '720°|3']);
    expect(fr('esquecer a fração 90°/360°.', 'mat')).toEqual(['90°|360°']);
  });
  it('velocidade angular e fração de tempo ficam como antes', () => {
    expect(fr('curto: 360°/h | longo: 30°/h', 'mat')).toEqual([]);
    expect(fr('40 min = 2/3 h', 'fis')).toEqual(['2|3']);
  });
  it('o texto não muda', () => {
    for (const s of ['360°/24 h = 15° por hora', 'sen(180°/n)']) expect(junta(s, 'mat')).toBe(s);
  });
});

describe('S5: fração de letras também no texto corrido', () => {
  it('fís P37451010, P4d88d6f7, P29193ade, P732427ed e mat P7fea8b7c', () => {
    expect(fr('AB/(A + B) tem unidade de comprimento;', 'fis')).toEqual(['AB|A + B']);
    expect(fr('já AB/(A + B) tem unidade de comprimento', 'fis')).toEqual(['AB|A + B']);
    expect(fr('Alternativa E — (1/2)·m³g²/(q²B²).', 'fis')).toEqual(['1|2', 'm³g²|q²B²']);
    expect(fr('T′/T = (P′ × V′)/(P × V)', 'fis')).toEqual(['T′|T', 'P′ × V′|P × V']);
    expect(fr('A△/A□ = √3/4', 'mat')).toEqual(['A△|A□', '√3|4']);
    expect(fr('isolando v no raio, ela some e fica só m/q.', 'fis')).toEqual(['m|q']);
  });
  it('apóstrofo e Δ fazem parte do termo', () => {
    expect(fr("1/f = 1/p + 1/p'", 'fis')).toEqual(['1|f', '1|p', "1|p'"]);
    expect(fr('Δi ≈ −fΔn/(n − 1)', 'fis')).toEqual(['fΔn|n − 1']);
    expect(fr('γ = ∆V/(V1.∆T) . Com base nestas informações', 'fis')).toEqual(['∆V|V1.∆T']);
  });
  it('unidade, rótulo, par de genes, espécie e matéria de texto continuam na linha', () => {
    expect(fr('10 m/s e a concentração em g/L', 'fis')).toEqual([]);
    expect(fr('o soro a 5% (m/v)', 'qui')).toEqual([]);
    expect(fr('detectada como m/z 421,7', 'qui')).toEqual([]);
    expect(fr('a razão de massas O/H', 'qui')).toEqual([]);
    expect(fr('Velocidade de referência (MB/s)', 'fis')).toEqual([]);
    expect(fr('coloque V para a/s verdadeira/s', 'fis')).toEqual([]);
    expect(fr('as outras trocam definições (R/S × E/Z)', 'qui')).toEqual([]);
    expect(fr('o par A/a se separa', 'bio')).toEqual([]);
    expect(fr('fica só m/q', 'bio')).toEqual([]);
    expect(fr('fica só m/q', 'his')).toEqual([]);
  });
  it('o texto não muda', () => {
    for (const s of ['Alternativa E — (1/2)·m³g²/(q²B²).', 'T′/T = (P′ × V′)/(P × V)', "1/f = 1/p + 1/p'"]) expect(junta(s, 'fis')).toBe(s);
  });
});

describe('T5: probabilidade condicional com " / " empilha', () => {
  it('mat M13, cartão "Probabilidade condicional"', () => {
    expect(fr('P(A|B) = P(A ∩ B) / P(B)', 'mat')).toEqual(['P(A ∩ B)|P(B)']);
    expect(fr('f(x) / g(x) = 2', 'mat')).toEqual(['f(x)|g(x)']);
    expect(junta('P(A|B) = P(A ∩ B) / P(B)', 'mat')).toBe('P(A|B) = P(A ∩ B) / P(B)');
  });
  it('verso e par com " / " continuam na linha', () => {
    expect(fr('Rua 15 / E o progresso', 'por')).toEqual([]);
    expect(fr('enganos, / tu', 'por')).toEqual([]);
  });
});

import { describe, expect, it } from 'vitest';
import { cadernoEhTexto, formulaEhTexto, partesFracao } from '../logica/fracao';
import { junta as juntaToks, quebrasConta, tokeniza } from '../logica/motorConta';

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

describe('R5: artigo, pedaço de nome ou de valor em dinheiro não vira numerador nem denominador', () => {
  it('fica na linha', () => {
    expect(fr('esquecer o ÷ 2 da área')).toEqual([]);
    expect(fr('Cada um ÷ 14 dá a parte de cada')).toEqual([]);
    expect(fr('percentual nos válidos = percentual do total ÷ 70')).toEqual([]);
    expect(fr('mol de cada elemento ÷ o menor')).toEqual([]);
    expect(fr('quantidade em mol = massa (g) ÷ massa molar (g/mol)', 'qui')).toEqual([]);
  });
  it('o valor com moeda e o nome inteiro empilham', () => {
    expect(fr('US$ 37 mi ÷ US$ 60,2 mi ≈ 0,61', 'geo')).toEqual(['US$ 37 mi|US$ 60,2 mi']);
    expect(fr('US$ 517,4 milhões ÷ US$ 366,3 milhões ≈ 1,41', 'geo')).toEqual(['US$ 517,4 milhões|US$ 366,3 milhões']);
    expect(fr('razão = segmento correspondente ÷ segmento correspondente')).toEqual(['segmento correspondente|segmento correspondente']);
    expect(fr('risco relativo (expostos ÷ não expostos)')).toEqual(['expostos|não expostos']);
    expect(fr('não utilizadas ÷ utilizadas = 2 ÷ 9  →  não utilizadas = 2k')).toEqual(['não utilizadas|utilizadas', '2|9']);
    expect(fr('a razão dada pela ilustração é cateto ÷ hipotenusa (seno), e não cateto ÷ cateto (tangente).')).toEqual(['cateto|hipotenusa', 'cateto|cateto']);
  });
  it('"o" variável, "um ÷ outro" e análise de unidade continuam conta', () => {
    expect(fr('i / o = 3 / 4')).toEqual(['i|o', '3|4']);
    expect(fr('razão = um ÷ outro')).toEqual(['um|outro']);
    expect(fr('dividir a densidade pelo quadrado da velocidade: (kg/m³) ÷ (m²/s²).')).toEqual(['kg/m³|m²/s²']);
  });
  it('o texto não muda', () => {
    for (const s of ['US$ 37 mi ÷ US$ 60,2 mi ≈ 0,61', 'esquecer o ÷ 2 da área', 'não utilizadas ÷ utilizadas = 2 ÷ 9']) expect(junta(s, 'geo')).toBe(s);
  });
});

describe('R6: sinal de interação e denominador zero fora de conta ficam na linha', () => {
  it('bio P7e3a78a1 e parecidos', () => {
    expect(fr('X e Y crescem como sozinhas (0 / 0), sem benefício', 'bio')).toEqual([]);
    expect(fr('B: competição exige − / −, e X + Y dá 0 / 0', 'bio')).toEqual([]);
    expect(fr('Conte ligações e pares livres do central: 4/0, 5/0, 3/1 e 2/1.', 'qui')).toEqual(['3|1', '2|1']);
    expect(fr('diferem só pelos rótulos (R)/(S) e (+)/(−).', 'qui')).toEqual([]);
  });
  it('na conta, continua empilhada', () => {
    expect(fr('f(3) = 0/0, não existe')).toEqual(['0|0']);
    expect(fr('(x − 6)/(+) ≥ 0 e (+)/(−) < 0')).toEqual(['x − 6|+', '+|−']);
  });
});

describe('R7: par de unidades igual ao nome de uma unidade fica na linha', () => {
  it('qui P08cd85a8, nota do quadro', () => {
    expect(fr('J/C = volt', 'qui')).toEqual([]);
    expect(fr('C/s = ampère', 'fis')).toEqual([]);
  });
  it('a conta com letras continua empilhada', () => {
    expect(fr('V = E/B', 'fis')).toEqual(['E|B']);
    expect(fr('d = m/V', 'qui')).toEqual(['m|V']);
  });
});

describe('R9: a letra do caderno vem da lista inteira', () => {
  const q03 = ['Arrhenius: ácido → H⁺ (H₃O⁺); base → OH⁻', 'Brønsted: ácido doa H⁺; base recebe H⁺', 'Lewis: ácido recebe par de e⁻; base doa', 'par conjugado: HA / A⁻ (diferem de um H⁺)'];
  it('tema qui Q03: as quatro linhas na mesma letra (a da fórmula)', () => {
    expect(formulaEhTexto(q03[2], 'qui')).toBe(true); // sozinha, a linha do Lewis seria texto
    expect(cadernoEhTexto(q03, 'qui')).toBe(false);
  });
  it('maioria de texto: a lista toda em texto; matéria de texto: sempre texto', () => {
    expect(cadernoEhTexto(['cada gestação é independente das anteriores', 'acima da T ótima: desnatura (em geral, irreversível)', 'T baixa: só desacelera; volta ao aquecer', 'Aa × Aa = 3 : 1'], 'bio')).toBe(true);
    expect(cadernoEhTexto(['x = 2'], 'his')).toBe(true);
  });
});

describe('R8: a conta com vetor quebra depois de cada coordenada', () => {
  const vs = (s: string) => { const ts = tokeniza(s); return [...quebrasConta(ts)].filter(([i]) => ts[i - 1]?.v === ',').map(([i, n]) => `${juntaToks(ts.slice(0, i))}|${n}`); };
  it('mat Pe922fcad: depois de cada vírgula do vetor (nível 2, só quando não cabe)', () => {
    const s = 'u × v = (1/3·(−1) − 0·1, 0·1/3 − (−1/3)·(−1), (−1/3)·1 − 1/3·1/3) → (−1/3, −1/3, −4/9)';
    expect(vs(s)).toEqual([
      'u × v = (1/3·(−1) − 0·1,|2',
      'u × v = (1/3·(−1) − 0·1, 0·1/3 − (−1/3)·(−1),|2',
      'u × v = (1/3·(−1) − 0·1, 0·1/3 − (−1/3)·(−1), (−1/3)·1 − 1/3·1/3) → (−1/3,|2',
      'u × v = (1/3·(−1) − 0·1, 0·1/3 − (−1/3)·(−1), (−1/3)·1 − 1/3·1/3) → (−1/3, −1/3,|2',
    ]);
  });
  it('argumento de função não quebra', () => {
    expect(vs('C(10, 3) = 120')).toEqual([]);
    expect(vs('f(x, y) = x + y')).toEqual([]);
  });
});

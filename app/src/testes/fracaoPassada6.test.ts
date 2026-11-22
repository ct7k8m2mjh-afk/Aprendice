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

describe('Y2: o nome da função e o ângulo ficam no lugar certo', () => {
  it('mat P5943cbb6: "sen 3π/2" é sen (3π sobre 2), a função fica fora da fração', () => {
    const s = 'f(9) = sen 3π/2 = −1 | g(9) = sen π/2 = 1';
    expect(fr(s, 'mat')).toEqual(['3π|2', 'π|2']);
    expect(junta(s, 'mat')).toBe(s);
    const f = tokeniza(s).filter((t) => t.k === 'frac');
    expect(f.map((t) => [t.n, t.d])).toEqual([['3π', '2'], ['π', '2']]);
    expect(juntaToks(tokeniza(s))).toBe(s);
  });
  it('M10.4, M10.5 e M16.2: "cos 3π/4", "sen 7π/6", "sen 2π/3", "cos 5π/4"', () => {
    expect(fr('cos 0 = 1 | cos 3π/4 = −√2/2', 'mat')).toEqual(['3π|4', '√2|2']);
    expect(fr('sen π/2 = 1 | sen 3π/2 = −1 | sen 2π/3 = √3/2', 'mat')).toEqual(['π|2', '3π|2', '2π|3', '√3|2']);
    expect(fr('z = √2 · (cos 5π/4 + i sen 5π/4)', 'mat')).toEqual(['5π|4', '5π|4']);
  });
  it('M10 "Ângulos notáveis": "30°: sen 1/2" é o valor do seno', () => {
    expect(fr('30°: sen 1/2 · cos √3/2 · tg √3/3', 'mat')).toEqual(['1|2', '√3|2', '√3|3']);
    expect(fr('60°: sen √3/2 · cos 1/2 · tg √3', 'mat')).toEqual(['√3|2', '1|2']);
    const s = '30°: sen 1/2 · cos √3/2 · tg √3/3';
    expect(junta(s, 'mat')).toBe(s);
  });
  it('fora da tabela, função de um número sobre um número continua inteira em cima ("log 8/2", "cos 1/2 + cos 2/4")', () => {
    expect(fr('a área é log 8/2 = log √8.', 'mat')).toEqual(['log 8|2']);
    expect(fr('Pela soma numérica: cos 1/2 + cos 2/4 + cos 3/8 + …', 'mat')).toEqual(['cos 1|2', 'cos 2|4', 'cos 3|8']);
  });
  it('mat P8af6b4ab e M10.2: a letra e o grau ficam no denominador, mesmo com vírgula depois', () => {
    expect(fr('A tangente de 2θ é sen 2θ/cos 2θ, e não se divide por zero.', 'mat')).toEqual(['sen 2θ|cos 2θ']);
    expect(fr('lei dos senos BC = 8 · sen 75°/sen 60°, com sen 75° = (√6 + √2)/4.', 'mat')).toEqual(['sen 75°|sen 60°', '√6 + √2|4']);
    expect(fr('então BE = 5/sen 40°, e o ângulo AEB mede 50°.', 'mat')).toEqual(['5|sen 40°']);
    // a vírgula decimal continua dentro do número: "sen 2,5" não vira "sen 2"
    expect(fr('x = 3/sen 2,5 + 1', 'mat')).toEqual(['3|sen 2,5']);
  });
});

describe('Y3: palavra solta não vira numerador', () => {
  it('quí P23cb376 e P1dfb107: "x ao quadrado ÷ C" fica na linha', () => {
    const s = 'Chamando de x o que reage, a expressão fica x ao quadrado ÷ C = K, e com a aproximação da base fraca vale x ao quadrado = K x C.';
    expect(fr(s, 'qui')).toEqual([]);
    expect(fr('Kb = (2 × 10⁻⁴) ao quadrado ÷ 0,02 = 2 × 10⁻⁶, e não', 'qui')).toEqual([]);
    const t = 'x ao quadrado ÷ C = K';
    expect(tokeniza(t).filter((k) => k.k === 'frac')).toEqual([]);
  });
  it('Q04.1 P0229d63 e F04.2: unidade depois da potência de 10 não é numerador', () => {
    expect(fr('n = 7,2 × 10¹⁷ átomos ÷ 6,0 × 10²³ átomos/mol = 1,2 × 10⁻⁶ mol', 'qui')).toEqual([]);
    expect(fr('1,2 × 10⁸ J úteis ÷ 1,2 × 10⁷ J por bloco = 10.', 'fis')).toEqual([]);
    expect(fr('1 U3O8 → 3 UF6; 10⁶ g ÷ 842 ≈ 1 187,6 mol', 'qui')).toEqual([]);
    // a variável com expoente antes não é número: "π r² h ÷ 2" continua com h sobre 2
    expect(fr('V₁ = π r² h ÷ 2', 'mat')).toEqual(['h|2']);
  });
  it('M11.3, M04.5 e Q06.1: "ao vértice", "não ÷ novo", "nem ÷ média", "não ÷10"', () => {
    expect(fr('semelhança: (área da secção ÷ área da base) = (distância ao vértice ÷ h)²', 'mat')).toEqual([]);
    expect(fr('O desconto é 5 ÷ preço antigo (22), não ÷ novo (17) nem ÷ média; não arredonde a razão no meio da conta.', 'mat')).toEqual(['5|preço antigo']);
    expect(fr('Pressão menor faz o volume CRESCER (×10, não ÷10); e a temperatura', 'qui')).toEqual([]);
  });
  it('nome com "novo" ou "antigo" cabe inteiro embaixo; verbo depois de "que" não é numerador', () => {
    expect(fr('Variação percentual = diferença ÷ valor antigo.', 'mat')).toEqual(['diferença|valor antigo']);
    expect(fr('valor antigo = valor novo ÷ (1 + i)', 'mat')).toEqual(['valor novo|1 + i']);
    expect(fr('tempo que falta = trabalho que falta ÷ ritmo novo', 'mat')).toEqual([]);
    expect(fr('dizer que r ÷ q = 6 é dizer que r é 6 vezes q', 'mat')).toEqual(['r|q']);
  });
});

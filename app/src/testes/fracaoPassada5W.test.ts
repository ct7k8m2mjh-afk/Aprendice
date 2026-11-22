import { describe, expect, it } from 'vitest';
import { partesFracao } from '../logica/fracao';
import { junta as juntaToks, tokeniza } from '../logica/motorConta';

/* Revisão de 21/11/2026, 5ª passada, itens W (fatorial, função sem argumento, notação científica) */
const fr = (s: string, m?: string) => partesFracao(s, m).filter((p) => p.t === 'frac').map((p) => (p.t === 'frac' ? `${p.n}|${p.d}` : ''));
const junta = (s: string, m?: string) => partesFracao(s, m).map((p) => (p.t === 'txt' ? p.v : p.orig)).join('');

describe('W1: fatorial no numerador empilha', () => {
  it('mat M13, "No caderno": arranjo e combinação', () => {
    expect(fr('A(n, p) = n!/(n − p)!', 'mat')).toEqual(['n!|(n − p)!']);
    expect(fr('C(n, p) = n!/(p!(n − p)!)', 'mat')).toEqual(['n!|p!(n − p)!']);
    expect(fr('arranjo (ordem importa): A(n,p) = n!/(n−p)!', 'mat')).toEqual(['n!|(n−p)!']);
    for (const s of ['A(n, p) = n!/(n − p)!', 'C(n, p) = n!/(p!(n − p)!)']) {
      expect(junta(s, 'mat')).toBe(s);
      expect(junta(s)).toBe(s);
    }
  });
  it('o grupo com "!" embaixo guarda os parênteses à vista; sem "!", o layout tira', () => {
    const p = partesFracao('A(n, p) = n!/(n − p)!', 'mat').find((x) => x.t === 'frac');
    expect(p).toMatchObject({ n: 'n!', d: '(n − p)!', pd: false, pn: false });
    expect(fr('= 8!/(3! · 2!) = 3360', 'mat')).toEqual(['8!|3! · 2!']);
  });
  it('número com fatorial em cima, também com a divisão dentro do denominador', () => {
    expect(fr('6!/2! = 360', 'mat')).toEqual(['6!|2!']);
    expect(fr('3 × 5!/2! = 3 × 60 = 180', 'mat')).toEqual(['5!|2!']);
    expect(fr('x = 3!/2', 'mat')).toEqual(['3!|2']);
    expect(fr('5!/(9!/2!) = 1/1512.', 'mat')).toEqual(['5!|9!/2!', '1|1512']);
    expect(fr('n!/(n(n − 1)/2) → 2(n − 2)!', 'mat')).toEqual(['n!|n(n − 1)/2']);
    expect(fr('fica com (n − 2)!/2. O', 'mat')).toEqual(['(n − 2)!|2']);
  });
  it('exclamação de frase e "!=" não viram fatorial', () => {
    expect(fr('Que legal!/2')).toEqual([]);
    expect(fr('se x != 2/3')).toEqual(['2|3']);
  });
  it('a animação lê o mesmo e o texto não muda', () => {
    const s = 'A(n, p) = n!/(n − p)!';
    const f = tokeniza(s).find((t) => t.k === 'frac');
    expect(f && [f.n, f.d]).toEqual(['n!', '(n − p)!']);
    expect(juntaToks(tokeniza(s))).toBe(s);
  });
});

describe('W2: nome de função sem argumento, "tg = sen/cos", empilha em Mat, Fís e Quí', () => {
  it('mat M10 e fís F11', () => {
    expect(fr('tg = cateto oposto / cateto adjacente = sen/cos', 'mat')).toEqual(['cateto oposto|cateto adjacente', 'sen|cos']);
    expect(fr('cateto oposto dividido pelo cateto adjacente (tg = sen/cos). Na geometria', 'mat')).toEqual(['sen|cos']);
    expect(fr('converter cm em m e usar tg = sen/cos, não o seno sozinho.', 'fis')).toEqual(['sen|cos']);
    const s = 'Declividade = vertical/horizontal = sen/cos = 0,57/0,82 ≈ 0,70.';
    expect(fr(s, 'mat')).toEqual(['vertical|horizontal', 'sen|cos', '0,57|0,82']);
    expect(junta(s, 'mat')).toBe(s);
    expect(fr('θ = arco/raio = 600/300 = 2 rad.', 'mat')).toEqual(['arco|raio', '600|300']);
  });
  it('fora de igualdade, em matéria de texto e entre palavras sem conta depois continua na linha', () => {
    expect(fr('confundir sen/cos na prova', 'mat')).toEqual([]);
    expect(fr('tg = sen/cos', 'por')).toEqual([]);
    expect(fr('tg = sen/cos')).toEqual([]);
    expect(fr('altura = agudo/grave = frequência', 'fis')).toEqual([]);
    expect(fr('n = massa/massa molar', 'qui')).toEqual([]);
    expect(fr('x = sen/sen', 'mat')).toEqual([]);
  });
});

describe('W3: notação científica inteira dos dois lados da barra', () => {
  it('fís Pca19482b, passo 2: "6,3 × 10⁴/1,0 × 10⁵"', () => {
    const s = '= (6,3 × 10⁴/1,0 × 10⁵) × (300/270) = 0,63 × 300/270';
    expect(fr(s, 'fis')).toEqual(['6,3 × 10⁴|1,0 × 10⁵', '300|270', '300|270']);
    expect(fr(s)).toEqual(['6,3 × 10⁴|1,0 × 10⁵', '300|270', '300|270']);
    expect(junta(s)).toBe(s);
    const f = tokeniza(s).find((t) => t.k === 'frac');
    expect(f && [f.n, f.d]).toEqual(['6,3 × 10⁴', '1,0 × 10⁵']);
    expect(juntaToks(tokeniza(s))).toBe(s);
  });
  it('outros casos iguais, com "/", "÷", grupo e unidade', () => {
    expect(fr('x = 7,2 × 10¹⁵/9 × 10¹⁴ = 8')).toEqual(['7,2 × 10¹⁵|9 × 10¹⁴']);
    expect(fr('= 7,9 × 10¹⁵ ÷ 2,0 × 10¹² = 3950')).toEqual(['7,9 × 10¹⁵|2,0 × 10¹²']);
    expect(fr('Volta: 4,8 × 10^24 ÷ 6 × 10^23 = 8 mol')).toEqual(['4,8 × 10^24|6 × 10^23']);
    expect(fr('x = (80 × 10⁻⁶)/137,3 × 10⁻² = 1')).toEqual(['80 × 10⁻⁶|137,3 × 10⁻²']);
    expect(fr('= (6,7 × 10⁴)² ÷ 6,37 × 10⁶ ≈ 700')).toEqual(['(6,7 × 10⁴)²|6,37 × 10⁶']);
    expect(fr('converter a divisão: 0,10 ÷ 2,5 × 10⁻² = 4,0.')).toEqual(['0,10|2,5 × 10⁻²']);
    expect(fr('θ ≈ 1,22 × 1,3 × 10⁻⁶ km/1,27 × 10⁴ km ≈ 1,25')).toEqual(['1,3 × 10⁻⁶ km|1,27 × 10⁴ km']);
    expect(fr('8,0 × 10⁻¹⁰ C/1,6 × 10⁻¹⁹ C = 5,0')).toEqual(['8,0 × 10⁻¹⁰ C|1,6 × 10⁻¹⁹ C']);
  });
  it('com "/" colado e só um lado em notação científica, nada muda', () => {
    expect(fr('E = 100/3 × 10⁶ J')).toEqual(['100|3']);
    expect(fr('x = 7,2 × 10¹⁵/9 = 8')).toEqual(['10¹⁵|9']);
    expect(fr('= 27√3/2 × 10√3 = 405')).toEqual(['27√3|2']);
  });
});

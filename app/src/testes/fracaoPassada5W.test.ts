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


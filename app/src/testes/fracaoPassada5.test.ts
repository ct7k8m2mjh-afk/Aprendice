import { describe, expect, it } from 'vitest';
import { partesFracao } from '../logica/fracao';

/* Revisão de 21/11/2026, 5ª passada (docs/revisao-site/2026-11-21/questao-correcao-4.md e materias-4.md) */
const fr = (s: string, m?: string) => partesFracao(s, m).filter((p) => p.t === 'frac').map((p) => (p.t === 'frac' ? `${p.n}|${p.d}` : ''));
const junta = (s: string, m?: string) => partesFracao(s, m).map((p) => (p.t === 'txt' ? p.v : p.orig)).join('');

describe('U1: produto de variáveis sobre grupo, "2mg/(qB)", empilha no texto corrido', () => {
  it('fís P4d88d6f7, letras B, C e D', () => {
    expect(fr('2m³g²/(q²B²) não confere: daria v = 2mg/(qB), e a força magnética seria o dobro', 'fis')).toEqual(['2m³g²|q²B²', '2mg|qB']);
    expect(fr('daria v² = (4/3)·(mg/(qB))², e com essa velocidade', 'fis')).toEqual(['4|3', 'mg|qB']);
    expect(fr('daria v² = (1/2)·(mg/(qB))², e a força', 'fis')).toEqual(['1|2', 'mg|qB']);
    expect(fr('raio maior, carga menor (R = mv/(qB)), então', 'fis')).toEqual(['mv|qB']);
  });
  it('unidade sobre unidade entre parênteses e matérias de texto continuam na linha', () => {
    expect(fr('dose de 5 mg/(kg)', 'qui')).toEqual([]);
    expect(fr('vazão em mL/(min)', 'bio')).toEqual([]);
    expect(fr('daria v = 2mg/(qB)', 'por')).toEqual([]);
  });
  it('o texto não muda', () => {
    const s = 'daria v² = (4/3)·(mg/(qB))², e com essa velocidade';
    expect(junta(s, 'fis')).toBe(s);
  });
});

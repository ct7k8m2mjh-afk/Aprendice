import { describe, expect, it } from 'vitest';
import { aspasCurvas } from '../logica/aspas';

// Revisão do site de 19/11/2026 (questao-correcao.md item 22)
describe('aspas curvas no texto da resolução', () => {
  it('duplas e simples em par viram curvas', () => {
    expect(aspasCurvas('O verso "Viva chama de ardente paixão," fala de amor e de \'uns olhos\' escuros.'))
      .toBe('O verso “Viva chama de ardente paixão,” fala de amor e de ‘uns olhos’ escuros.');
    expect(aspasCurvas('"a" e "b"')).toBe('“a” e “b”');
  });
  it('apóstrofo entre letras', () => {
    expect(aspasCurvas("copo d'água")).toBe('copo d’água');
    expect(aspasCurvas("they don't know")).toBe('they don’t know');
  });
  it('minuto, derivada, linha de conta e aspas sem par ficam', () => {
    for (const s of ["30' de arco", "f'(x) = 2x", "x' e x''", 'só uma " aspa', '']) expect(aspasCurvas(s)).toBe(s);
  });
});

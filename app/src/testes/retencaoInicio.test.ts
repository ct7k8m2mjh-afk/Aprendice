import { describe, expect, it } from 'vitest';
import { diasDeConstancia, ultimoEstudo } from '../logica/inicio';
import { estadoMateriaVazio, estadoVazio, type Estado } from '../estado/tipos';

// mensagens de retenção do Início (docs/marketing/RETENCAO.md 2.5 e 2.6): flashcards contam como estudo
const dia = (d: number, h = 10) => new Date(2026, 10, d, h).getTime();
const comFlash = (ts: number[], tq: number[] = []): Estado => ({
  ...estadoVazio(),
  materias: { bio: { ...estadoMateriaVazio(),
    q: tq.length ? { q1: { tent: tq.map((x) => ({ ts: x, ok: true, letra: 'A' as const, seg: 30 })) } } : {},
    flash: ts.length ? { f1: { etapa: 0, vence: 0, hist: ts.map((x) => ({ ts: x, v: 'a' as const })) } } : {},
  } },
});

describe('constância conta flashcards', () => {
  it('0: sem estudo nenhum', () => { expect(diasDeConstancia(comFlash([]), dia(6))).toBe(0); });
  it('1: só um flashcard hoje', () => { expect(diasDeConstancia(comFlash([dia(6, 8)]), dia(6))).toBe(1); });
  it('n: flashcards e questões em dias seguidos', () => {
    expect(diasDeConstancia(comFlash([dia(4), dia(6, 8)], [dia(5)]), dia(6))).toBe(3);
  });
});

describe('último estudo', () => {
  it('0: nunca estudou', () => { expect(ultimoEstudo(estadoVazio())).toBe(0); expect(ultimoEstudo(comFlash([]))).toBe(0); });
  it('1: um flashcard', () => { expect(ultimoEstudo(comFlash([dia(3)]))).toBe(dia(3)); });
  it('n: o mais recente entre questões e flashcards', () => {
    expect(ultimoEstudo(comFlash([dia(3), dia(5)], [dia(4)]))).toBe(dia(5));
    expect(ultimoEstudo(comFlash([dia(3)], [dia(2), dia(7)]))).toBe(dia(7));
  });
});

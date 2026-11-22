import { beforeAll, describe, expect, it, vi } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ResolucaoAnimada } from '../ui/ResolucaoAnimada';
import type { Resolucao } from '../dados/tipos';

/* Revisão de 21/11/2026, questão-correção 2 R1: o marca-texto do resultado com fração é um retângulo só, atrás do trecho
 * inteiro (antes, um bloco baixo atrás de cada peça e um alto atrás da fração) */
beforeAll(() => {
  const orig = console.error;
  vi.spyOn(console, 'error').mockImplementation((...a: unknown[]) => { if (!String(a[0]).includes('useLayoutEffect')) orig(...a); });
});
const desenha = (conta: string, destaque?: string) => {
  const r = { passos: [{ faz: '', conta, porque: '' }], quadro: destaque ? [{ linha: conta, destaque }] : undefined } as unknown as Resolucao;
  return new DOMParser().parseFromString(renderToStaticMarkup(createElement(ResolucaoAnimada, { r, materia: 'fis' })), 'text/html');
};

describe('R1: marca-texto com fração', () => {
  it('fis P19eed56c, passo 2: um retângulo só, com a fração dentro e sem marca nas peças', () => {
    const doc = desenha('T = 2π√(L/g) → T² = 4π² · L/g → L = g · T²/(4π²)');
    const g = [...doc.querySelectorAll('.ra-marca-g')];
    expect(g.length).toBe(1);
    expect(g[0].textContent!.startsWith('g · T')).toBe(true);
    expect(g[0].querySelector('.frac')).not.toBeNull();
    expect(g[0].querySelectorAll('.ra-marca').length).toBe(0);
    expect(doc.querySelectorAll('.ra-marca').length).toBe(1);
  });
  it('fís P5b8f3493, passo 4: o "1 −" e a fração no mesmo retângulo', () => {
    const doc = desenha('1 − cos θ = (x₁ − x₀)²/(2ℓ²) → cos θ = 1 − (x₁ − x₀)²/(2ℓ²)');
    const g = [...doc.querySelectorAll('.ra-marca-g')];
    expect(g.length).toBe(1);
    expect(g[0].textContent!.startsWith('1 −')).toBe(true);
  });
  it('resultado sem fração continua com a marca de sempre', () => {
    const doc = desenha('T ≈ 8,3 ÷ 6 ≈ 1,4 s');
    expect(doc.querySelectorAll('.ra-marca-g').length).toBe(0);
  });
});

import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement, Fragment } from 'react';
import { comFracoes } from '../ui/Fracao';

/* Revisão de 21/11/2026, 4ª passada T4: "q < 0" não quebra no meio (fís F11, "Lei de Coulomb e campo elétrico") */
const doc = (s: string) => new DOMParser().parseFromString(renderToStaticMarkup(createElement(Fragment, null, comFracoes(s))), 'text/html');

describe('T4: relação curta numa linha só', () => {
  it('cada "Q > 0", "Q < 0" e "q < 0" fica num pedaço que não quebra', () => {
    const s = 'Q > 0: campo sai; Q < 0: campo entra; q < 0 sente força oposta ao campo';
    const d = doc(s);
    expect([...d.querySelectorAll('.nq')].map((x) => x.textContent)).toEqual(['Q > 0:', 'Q < 0:', 'q < 0']);
    expect(d.body.textContent).toBe(s);
  });
  it('com fração e índice também; o texto não muda', () => {
    const s = 'x ≤ 2 e v₀ = 0, com a/b = c/d';
    const d = doc(s);
    expect([...d.querySelectorAll('.nq')].map((x) => x.textContent)).toContain('x ≤ 2');
    expect(d.body.textContent!.replace(/\s+/g, ' ')).toContain('x ≤ 2 e');
  });
  it('frase sem relação fica como está', () => {
    expect(doc('força proporcional ao produto das cargas').querySelectorAll('.nq').length).toBe(0);
  });
});

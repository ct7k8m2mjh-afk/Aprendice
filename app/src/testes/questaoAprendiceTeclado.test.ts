// Questão Aprendice da revisão essencial responde pelo teclado, como a questão de prova (princípio 6; revisão de
// 21/11/2026, questão N2): A–E marca, Enter confere, e as setas andam dentro do grupo de alternativas.
import { afterEach, describe, expect, it } from 'vitest';
import { act, createElement } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { QuestaoResolvida } from '../telas/RevisaoEssencial';
import type { Essencial } from '../dados/revisao';

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const E = {
  questao_resolvida: {
    enunciado: 'Questão Aprendice. Qual destas cidades fica no litoral?',
    alternativas: ['A) Brasília', 'B) Belo Horizonte', 'C) Salvador', 'D) Goiânia', 'E) Cuiabá'],
    gabarito: 'C',
    por_que_erram: 'A pegadinha: confundir capital com cidade litorânea.',
  },
} as Essencial;

let raiz: Root | null = null;
function monta() {
  const el = document.createElement('div');
  document.body.appendChild(el);
  raiz = createRoot(el);
  act(() => raiz!.render(createElement(MemoryRouter, null, createElement(QuestaoResolvida, { m: 'geo', e: E }))));
  const radios = () => [...el.querySelectorAll<HTMLButtonElement>('[role="radio"]')];
  const marcada = () => radios().find((b) => b.getAttribute('aria-checked') === 'true')?.querySelector('.alt-l')?.textContent ?? null;
  const conferir = () => [...el.querySelectorAll('button')].find((b) => b.textContent === 'Conferir') as HTMLButtonElement | undefined;
  const tecla = (key: string, alvo: EventTarget = document.body) => act(() => { alvo.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true })); });
  return { el, radios, marcada, conferir, tecla };
}
afterEach(() => { act(() => raiz?.unmount()); raiz = null; document.body.innerHTML = ''; });

describe('Questão Aprendice pelo teclado (revisão de 21/11, N2)', () => {
  it('a letra marca a alternativa e libera o Conferir; 1–5 também', () => {
    const t = monta();
    expect(t.marcada()).toBeNull();
    expect(t.conferir()?.disabled).toBe(true);
    t.tecla('b');
    expect(t.marcada()).toBe('B');
    expect(t.conferir()?.disabled).toBe(false);
    t.tecla('4');
    expect(t.marcada()).toBe('D');
  });
  it('Enter confere: a correção aparece e as alternativas travam', () => {
    const t = monta();
    t.tecla('Enter');
    expect(t.conferir()).toBeDefined(); // sem alternativa marcada, Enter não confere
    t.tecla('A');
    t.tecla('Enter');
    expect(t.conferir()).toBeUndefined();
    expect(t.el.querySelector('.es-res')).not.toBeNull();
    expect(t.radios().every((b) => b.disabled)).toBe(true);
  });
  it('setas andam dentro do grupo (com o foco) e não saem do cartão', () => {
    const t = monta();
    let saiu = 0;
    const fora = (e: KeyboardEvent) => { if (e.key.startsWith('Arrow')) saiu++; };
    addEventListener('keydown', fora);
    expect(t.radios().map((b) => b.tabIndex)).toEqual([0, -1, -1, -1, -1]);
    t.radios()[0].focus();
    t.tecla('ArrowDown', t.radios()[0]);
    expect(t.marcada()).toBe('B');
    expect(document.activeElement).toBe(t.radios()[1]);
    t.tecla('ArrowUp', t.radios()[1]);
    t.tecla('ArrowLeft', t.radios()[0]);
    expect(t.marcada()).toBe('E');
    expect(t.radios().map((b) => b.tabIndex)).toEqual([-1, -1, -1, -1, 0]);
    removeEventListener('keydown', fora);
    expect(saiu).toBe(0);
  });
});

// Sessão de flashcards: abrir outra matéria depois de concluir uma não mostra o fim da anterior (revisão 20/11, dados 6)
import { describe, expect, it } from 'vitest';
import { act, createElement, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import { NovaPorVisita } from '../ui/novaPorVisita';

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

let irPara: (p: string) => void = () => {};
/** tela de mentira com o mesmo jeito da sessão: um contador que chega ao fim */
function Sessao() {
  const { m } = useParams();
  const [i, setI] = useState(0);
  irPara = useNavigate();
  return createElement('button', { id: 'b', onClick: () => setI(i + 1) }, i >= 2 ? `fim ${m}` : `cartão ${i + 1} ${m}`);
}

function monta(comChave: boolean) {
  const el = document.createElement('div');
  document.body.appendChild(el);
  const raiz = createRoot(el);
  const sessao = comChave ? createElement(NovaPorVisita, null, createElement(Sessao)) : createElement(Sessao);
  act(() => raiz.render(createElement(MemoryRouter, { initialEntries: ['/m/mat/flashcards/sessao'] },
    createElement(Routes, null, createElement(Route, { path: '/m/:m/flashcards/sessao', element: sessao })))));
  const clica = () => act(() => { (el.querySelector('#b') as HTMLButtonElement).click(); });
  return { el, clica, raiz };
}

describe('sessão de flashcards nova a cada visita', () => {
  it('concluir Matemática e abrir Português começa pelo 1º cartão de Português', () => {
    const { el, clica, raiz } = monta(true);
    clica(); clica();
    expect(el.textContent).toBe('fim mat');
    act(() => irPara('/m/por/flashcards/sessao'));
    expect(el.textContent).toBe('cartão 1 por');
    act(() => raiz.unmount());
  });
  it('abrir de novo a mesma matéria também começa do início', () => {
    const { el, clica, raiz } = monta(true);
    clica(); clica();
    act(() => irPara('/m/mat/flashcards/sessao'));
    expect(el.textContent).toBe('cartão 1 mat');
    act(() => raiz.unmount());
  });
  it('sem a chave o defeito aparece (confere que o teste pega o problema)', () => {
    const { el, clica, raiz } = monta(false);
    clica(); clica();
    act(() => irPara('/m/por/flashcards/sessao'));
    expect(el.textContent).toBe('fim por');
    act(() => raiz.unmount());
  });
});

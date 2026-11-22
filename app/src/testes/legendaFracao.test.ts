// Revisão de 21/11/2026 (matérias-2 R1). CLAUDE.md: "Fração sempre empilhada ... nunca 3/5 na mesma linha, em textos,
// fórmulas e animações". Vale também dentro do expoente e do índice: "(½)^(t/6)", "2^(t/20)", "log₁/₂ x" nas legendas
// das figuras de teoria. O texto do documento continua o dos dados (o sinal escrito fica escondido).
import { describe, expect, it } from 'vitest';
import { createElement, Fragment } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { comFracoes } from '../ui/Fracao';

const dom = (s: string) => new DOMParser().parseFromString(`<div>${renderToStaticMarkup(createElement(Fragment, null, comFracoes(s)))}</div>`, 'text/html').body.firstElementChild!;

/** o que se vê: sem o texto escondido (.sr); fração empilhada vira [n|d]; algarismo desenhado pelo CSS (data-v) entra */
function visivel(el: Element): string {
  const c = el.cloneNode(true) as Element;
  c.querySelectorAll('.sr').forEach((x) => x.remove());
  c.querySelectorAll('.frac-v').forEach((x) => { x.textContent = x.getAttribute('data-v'); });
  const frac = (e: Element): string => [...e.childNodes].map((n) => {
    if (n.nodeType !== 1) return n.textContent ?? '';
    const x = n as Element;
    if (x.classList.contains('frac')) return `[${frac(x.querySelector('.frac-n')!)}|${frac(x.querySelector('.frac-d')!)}]`;
    return frac(x);
  }).join('');
  return frac(c);
}

const FRACAO_EM_LINHA = /[\p{L}\p{N})₀-₉⁰-⁹¹²³]\s*\/\s*[\p{L}\p{N}(√π−₀-₉⁰-⁹¹²³]/u;
const NAO_E_FRACAO = ['Na⁺/K⁺'];

describe('legenda de figura: fração empilhada também no expoente e no índice (matérias-2 R1)', () => {
  it('expoente fracionário sai empilhado, dentro do <sup>', () => {
    for (const [s, n, d] of [['m(t) = 100·(1/2)^(t/6)', 't', '6'], ['N(t) = 1000·2^(t/20)', 't', '20']]) {
      const el = dom(s);
      const sup = el.querySelector('sup.nt-sup.nt-frac')!;
      expect(sup, s).not.toBeNull();
      expect(sup.querySelector('.frac-n')!.textContent).toBe(n);
      expect(sup.querySelector('.frac-d')!.textContent).toBe(d);
      expect(el.textContent, 'o texto do documento não muda').toBe(s);
    }
  });

  it('índice com algarismos do Unicode ("log₁/₂ x") sai empilhado, e o texto continua "₁/₂"', () => {
    const el = dom('f(x) = log₁/₂ x');
    const sub = el.querySelector('sub.nt-sub.nt-frac')!;
    expect(sub).not.toBeNull();
    expect(sub.querySelector('.frac-n')!.getAttribute('data-v')).toBe('1');
    expect(sub.querySelector('.frac-d')!.getAttribute('data-v')).toBe('2');
    expect(el.textContent).toBe('f(x) = log₁/₂ x');
    expect(visivel(el)).toBe('f(x) = log[1|2] x');
  });

  it('expoente sem fração continua como antes', () => {
    const el = dom('2^(1 + k) e 10^−2');
    expect(el.querySelectorAll('.nt-frac').length).toBe(0);
    expect(el.querySelectorAll('sup.nt-sup').length).toBe(2);
  });

  const CONTEUDO = resolve(__dirname, '../../public/conteudo');
  const MATERIAS = ['mat', 'qui', 'bio', 'fis'].filter((m) => existsSync(resolve(CONTEUDO, m, 'figuras.json')));
  it.skipIf(!MATERIAS.length)('nenhuma legenda de figura de Mat, Quí, Bio e Fís mostra fração "a/b" na mesma linha', () => {
    const erradas: string[] = [];
    for (const m of MATERIAS) {
      const figs = JSON.parse(readFileSync(resolve(CONTEUDO, m, 'figuras.json'), 'utf8')) as Record<string, { t: string }[]>;
      for (const [tema, l] of Object.entries(figs))
        for (const f of l) {
          let v = visivel(dom(f.t));
          for (const p of NAO_E_FRACAO) v = v.split(p).join(' ');
          if (FRACAO_EM_LINHA.test(v)) erradas.push(`${m} ${tema}: ${f.t} -> ${v}`);
        }
    }
    expect(erradas).toEqual([]);
  });
});

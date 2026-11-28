import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Formula } from '../ui/Formula';

/* Revisão de 21/11/2026, 5ª passada V2 (docs/revisao-site/2026-11-21/materias-4.md): no "No caderno" de F03, "cos" ficava
 * no fim de uma linha e o "θ" na seguinte; o espaço fino entre a função e o argumento não pode quebrar. */
const html = (tex: string) => renderToStaticMarkup(createElement(Formula, { tex }));
const WJ = String.fromCharCode(0x2060);

describe('V2: espaço fino da fórmula não quebra a linha', () => {
  it('"P\\,\\cos\\,\\theta": o espaço fino é texto que não quebra (WORD JOINER), não bloco', () => {
    const h = html('N = P\\,\\cos\\,\\theta');
    const finos = h.match(/<span class="fm-esp e1">[^<]*<\/span>/g) || [];
    expect(finos.length).toBeGreaterThanOrEqual(2);
    for (const f of finos) expect(f).toBe(`<span class="fm-esp e1">${WJ}</span>`);
  });
  it('o espaço largo entre duas relações continua podendo quebrar', () => {
    const h = html('P_x = P\\,\\sen\\,\\theta \\quad N = P\\,\\cos\\,\\theta');
    expect(h).toContain('<span class="fm-esp e3"></span>');
  });
});

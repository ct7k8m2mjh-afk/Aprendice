import { describe, expect, it } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { cadernoComLatexEhTexto } from '../logica/fracao';
import { Formula, ehLatex } from '../ui/Formula';

/* Revisão de 21/11/2026, 4ª passada T2: em Física, o caderno com LaTeX tem uma letra só por lista */
const desenha = (tex: string, rotulosNaMao: boolean) => renderToStaticMarkup(createElement(Formula, { tex, bloco: false, rotulosNaMao }));

describe('T2: "No caderno" de Física numa letra só', () => {
  it('o rótulo em \\text{} vai na letra da fórmula, com uma palavra ou várias', () => {
    for (const tex of ['\\text{rampa: } P_x = P\\,\\text{sen}\\,\\theta', '\\text{polias móveis: } F = \\frac{P}{2^n}',
      '\\text{iminência na rampa: } \\mu_e = \\text{tg}\\,\\theta', '\\alpha_i = \\text{ângulo entre as outras duas forças}',
      '\\text{gráficos: inclinação dá } v \\text{ e } a']) {
      expect(desenha(tex, true), tex).not.toContain('fm-texto');
    }
    // fora do "No caderno" (revisões), a frase em \text{} continua na letra da interface
    expect(desenha('\\text{polias móveis: } F = \\frac{P}{2^n}', false)).toContain('fm-texto');
  });
  it('a linha sem LaTeX segue a lista: fórmula no "No caderno", texto no cartão com $…$', () => {
    const noCaderno = ['\\text{rampa: } P_x = P\\,\\text{sen}\\,\\theta', 'M = F · b'];
    expect(cadernoComLatexEhTexto(noCaderno, 'fis', ehLatex, false)).toBe(false);
    const cartao = ['$v_m = \\frac{\\Delta s}{\\Delta t}$, com o tempo total (paradas incluídas)', 'MU: $s = s_0 + v \\cdot t$; v > 0 progressivo',
      'm/s para km/h: multiplique por 3,6; de volta, divida por 3,6', 'distância percorrida soma ida e volta; Δs só compara início e fim'];
    expect(cadernoComLatexEhTexto(cartao, 'fis', ehLatex, true)).toBe(true);
  });
  it('sem LaTeX, vale a maioria (R9); matéria de texto, sempre texto', () => {
    expect(cadernoComLatexEhTexto(['v = Δs/Δt', 'a = Δv/Δt', 'texto sem conta nenhuma aqui'], 'fis', ehLatex, true)).toBe(false);
    expect(cadernoComLatexEhTexto(['\\text{Kant: razão}'], 'fs', ehLatex, false)).toBe(true);
  });
});

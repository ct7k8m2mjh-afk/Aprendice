import { describe, expect, it } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { comFracoes, MateriaDoTexto } from '../ui/Fracao';

// Revisão de 21/11/2026 (dados R1): a matéria da tela chega ao detector pelo contexto
describe('comFracoes lê a matéria da tela', () => {
  const html = (s: string, m?: string) => renderToStaticMarkup(createElement(MateriaDoTexto.Provider, { value: m }, comFracoes(s)));
  it('data entre parênteses: fração fora das matérias de texto, data em História', () => {
    expect(html('marcha da família (19/3)', 'mat')).toContain('class="frac"');
    expect(html('marcha da família (19/3)', 'his')).not.toContain('class="frac"');
    expect(html('marcha da família (19/3)')).toContain('class="frac"');
  });
});

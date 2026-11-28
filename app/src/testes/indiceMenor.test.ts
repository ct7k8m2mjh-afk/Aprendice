// Índice e expoente menores que a letra (pedido do dono, 27/11/2026): "o caractere que será substituído por algum valor
// deve ser maior que o caractere que é usado embaixo dele como sigla para identificação". O texto dos dados não muda.
import { describe, expect, it } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { juntaNotacao, partesNotacao } from '../logica/notacao';
import { comFracoes } from '../ui/Fracao';
import { miudos, textoMao } from '../ui/maoGlifos';

const desenho = (s: string, maiusc = false) => partesNotacao(s, maiusc).map((p) => (p.t === 'txt' ? p.v : p.t === 'sup' ? `^{${p.v}}` : `_{${p.v}}`)).join('');
const html = (n: unknown) => renderToStaticMarkup(createElement('span', null, n as never));
const texto = (h: string) => h.replace(/<[^>]+>/g, '');

describe('índice e expoente menores que a letra', () => {
  it('índice escrito sem "_" vira índice: s2, s1, v0, a1', () => {
    expect(desenho('Δs = s2 − s1')).toBe('Δs = s_{2} − s_{1}');
    expect(desenho('v = v0 + a · t')).toBe('v = v_{0} + a · t');
  });
  it('o que não é índice continua igual: 2x, 3a, unidade m2, código de tema', () => {
    expect(desenho('2x + 3a = 7')).toBe('2x + 3a = 7');
    expect(desenho('área de 50 m2')).toBe('área de 50 m2');
    expect(desenho('M04 e Q01', true)).toBe('M04 e Q01');
  });
  it('maiúscula com índice só em Física: R1, V2, E0', () => {
    expect(desenho('R = R1 + R2', true)).toBe('R = R_{1} + R_{2}');
    expect(desenho('V1 e E0', true)).toBe('V_{1} e E_{0}');
    // fora da Física: fase G1, hormônio T3 e o resistor R1 ficam como nome (a regra nova só liga em Física)
    expect(desenho('a G1 e o T3 e R1')).toBe('a G1 e o T3 e R1');
    for (const s of ['R = R1 + R2', 'M04 e Q01', 'V1 e E0']) expect(juntaNotacao(partesNotacao(s, true))).toBe(s);
  });
  it('número pequeno do Unicode no texto ("v₀", "10⁻⁹") vira <sub>/<sup> na letra do texto, sem mudar o texto', () => {
    const h = html(comFracoes('v₀ = 20 m/s e 10⁻⁹ s'));
    expect(h).toContain('<sub class="nt-sub"><span class="frac-v" data-v="0"></span>');
    expect(h).toContain('<sup class="nt-sup"><span class="frac-v" data-v="−9"></span>');
    expect(texto(h)).toBe('v₀ = 20 m/s e 10⁻⁹ s');
    expect(miudos('sem índice')).toBe('sem índice');
  });
  it('na letra à mão o índice também sai em <sub> (s₂, s2) e a maiúscula de Física também', () => {
    expect(html(textoMao('s₂'))).toContain('<sub class="nt-sub"');
    expect(html(textoMao('s2'))).toContain('<sub class="nt-sub">2</sub>');
    expect(html(textoMao('R1', true))).toContain('<sub class="nt-sub">1</sub>');
    expect(html(textoMao('R1'))).not.toContain('<sub');
  });
});

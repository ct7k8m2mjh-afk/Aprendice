import { describe, expect, it } from 'vitest';
import { legendaFigura } from '../logica/legendaFigura';

describe('legenda das figuras da teoria: crédito sem jargão técnico', () => {
  it('figura feita por código vira "Desenho do Aprendice"', () => {
    for (const f of ['Desenho original (SVG gerado por código, Python)', 'Gerado com RDKit 2026.03.6 a partir do SMILES OCCO', 'Produção própria (SVG gerado por código Python)'])
      expect(legendaFigura(f)).toBe('Desenho do Aprendice');
  });
  it('mantém o crédito de terceiros que a licença pede', () => {
    expect(legendaFigura('Bioicons: github.com/duerrsimon/bioicons (cc-by-3.0/...)')).toBe('Desenho do Aprendice, com ícones Bioicons');
    expect(legendaFigura('NIST CCCBDB, geometria experimental')).toBe('Desenho do Aprendice, com dados do NIST');
  });
  it('nunca mostra SVG, Python, RDKit nem SMILES', () => {
    expect(legendaFigura('Desenho original (SVG gerado por código, Python) + ícones de Phosphor Icons 2.1.1')).not.toMatch(/SVG|Python|RDKit|SMILES/);
  });
});

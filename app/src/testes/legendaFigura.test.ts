import { describe, expect, it } from 'vitest';
import { legendaFigura } from '../logica/legendaFigura';

describe('legenda das figuras da teoria: crédito sem jargão técnico', () => {
  it('figura feita por código vira "Desenho do Aprendice"', () => {
    for (const f of ['Desenho original (SVG gerado por código, Python)', 'Gerado com RDKit 2026.03.6 a partir do SMILES OCCO', 'Produção própria (SVG gerado por código Python)'])
      expect(legendaFigura(f)).toBe('Desenho do Aprendice');
  });
  it('mantém o crédito de terceiros que a licença pede', () => {
    expect(legendaFigura('Bioicons: github.com/duerrsimon/bioicons (cc-by-3.0/...)')).toBe('Desenho do Aprendice, com ícones Bioicons');
    // pedido do dono de 27/11/2026: a CC BY pede o autor e a licença, não só o repositório
    expect(legendaFigura('Bioicons: github.com/duerrsimon/bioicons (cc-by-3.0/Human_physiology/Servier/heart-front.svg)', 'CC BY 3.0'))
      .toBe('Desenho do Aprendice, com ícones de Servier Medical Art (CC BY 3.0, via Bioicons)');
    expect(legendaFigura('Bioicons: github.com/duerrsimon/bioicons (cc-by-4.0/Nucleic_acids/DBCLS/DNA_colored.svg)', 'CC BY 4.0'))
      .toBe('Desenho do Aprendice, com ícones de DBCLS (CC BY 4.0, via Bioicons)');
    expect(legendaFigura('Bioicons (github.com/duerrsimon/bioicons) + desenho próprio', 'Ícones: CC BY 3.0 (Servier, Bioicons). Desenho do ciclo: próprio.'))
      .toBe('Desenho do Aprendice, com ícones de Servier Medical Art (CC BY 3.0, via Bioicons)');
    expect(legendaFigura('Bioicons: github.com/duerrsimon/bioicons (cc-0/Plants_Algae/Gina-Vong/Leaf.svg)', 'CC0 1.0')).toBe('Desenho do Aprendice, com ícones Bioicons (CC0)');
    expect(legendaFigura('NIST CCCBDB, geometria experimental')).toBe('Desenho do Aprendice, com dados do NIST');
  });
  it('nunca mostra SVG, Python, RDKit nem SMILES', () => {
    expect(legendaFigura('Desenho original (SVG gerado por código, Python) + ícones de Phosphor Icons 2.1.1')).not.toMatch(/SVG|Python|RDKit|SMILES/);
  });
});

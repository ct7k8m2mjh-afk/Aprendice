// Expoente, índice e fórmula química de verdade (comando 20, auditoria A7): o texto não muda, só a forma de desenhar.
import { describe, expect, it } from 'vitest';
import { juntaNotacao, partesNotacao } from '../logica/notacao';

const desenho = (s: string) => partesNotacao(s).map((p) => (p.t === 'txt' ? p.v : p.t === 'sup' ? `^{${p.v}}` : `_{${p.v}}`)).join('');

describe('notação', () => {
  it('expoente com circunflexo', () => {
    expect(desenho('6,25 × 10^−2 g')).toBe('6,25 × 10^{−2} g');
    expect(desenho('1 g ÷ 2^4')).toBe('1 g ÷ 2^{4}');
    expect(desenho('2^(1 + k)')).toBe('2^{1 + k}');
  });
  it('índice com sublinhado e variável com número colado', () => {
    expect(desenho('V_R = 8')).toBe('V_{R} = 8');
    expect(desenho('F_R = 0')).toBe('F_{R} = 0');
    expect(desenho('h_{máx}')).toBe('h_{máx}');
    expect(desenho('m0 = 1 g')).toBe('m_{0} = 1 g');
    expect(desenho('a1 = 91 → a2 = 82')).toBe('a_{1} = 91 → a_{2} = 82');
  });
  it('fórmula química com subscrito e carga', () => {
    expect(desenho('H2SO4 → 2 H+ + SO4^2−')).toBe('H_{2}SO_{4} → 2 H^{+} + SO_{4}^{2−}');
    expect(desenho('C6H12O6')).toBe('C_{6}H_{12}O_{6}');
    expect(desenho('HS–CH2–CH2–CH(NH2)–COOH')).toBe('HS–CH_{2}–CH_{2}–CH(NH_{2})–COOH');
    expect(desenho('Na2SO4 e HCl → H+ + Cl−')).toBe('Na_{2}SO_{4} e HCl → H^{+} + Cl^{−}');
    expect(desenho('Fe2+')).toBe('Fe^{2+}');
  });
  it('não mexe no que não é notação', () => {
    for (const s of ['Q36 de São Camilo', 'PQRS', 'AB = 4', 'C + D → A + B', 'M04.3', 'espécies de ___ que', 'x + 1', 'B−A', '2024/2'])
      expect(desenho(s), s).toBe(s);
  });
  it('o texto continua o mesmo', () => {
    for (const s of ['H2SO4 → 2 H+ + SO4^2−', '10^−2', 'V_R', 'h_{máx}', 'm0']) expect(juntaNotacao(partesNotacao(s))).toBe(s);
  });
});

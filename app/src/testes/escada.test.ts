import { describe, expect, it } from 'vitest';
import { textoDegrau } from '../logica/escada';

const q = { escola: 'Fuvest', ano: 2024, n: '12', conceito: 'A incorreta é a E: o transporte ativo gasta ATP' } as const;

describe('degrau da escada: o conceito só depois de responder', () => {
  it('antes de responder mostra só a fonte, nunca o conceito', () => {
    const t = textoDegrau(q as never, false);
    expect(t.titulo).toBe('Fuvest 2024 · questão 12');
    expect(t.titulo + t.apoio).not.toContain('incorreta');
    expect(t.apoio).toBe('');
  });
  it('depois de responder mostra o conceito e a fonte embaixo', () => {
    const t = textoDegrau(q as never, true);
    expect(t.titulo).toBe(q.conceito);
    expect(t.apoio).toBe('Fuvest 2024 · questão 12');
  });
  it('sem número da questão e sem conceito, a fonte basta', () => {
    expect(textoDegrau({ escola: 'ENEM', ano: 2023, n: '', conceito: '' } as never, true)).toEqual({ titulo: 'ENEM 2023', apoio: '' });
  });
});

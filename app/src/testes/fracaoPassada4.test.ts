import { describe, expect, it } from 'vitest';
import { partesFracao } from '../logica/fracao';

/* Revisão de 21/11/2026, 4ª passada (docs/revisao-site/2026-11-21/questao-correcao-3.md e materias-3.md) */
const fr = (s: string, m?: string) => partesFracao(s, m).filter((p) => p.t === 'frac').map((p) => (p.t === 'frac' ? `${p.n}|${p.d}` : ''));
const junta = (s: string, m?: string) => partesFracao(s, m).map((p) => (p.t === 'txt' ? p.v : p.orig)).join('');

describe('S1: denominador entre colchetes empilha', () => {
  it('mat Pd46353b6 e outros colchetes que agrupam uma conta', () => {
    expect(fr('c = (√3 + 1)²/[(√3 − 1)(√3 + 1)] = (4 + 2√3)/2', 'mat')).toEqual(['(√3 + 1)²|[(√3 − 1)(√3 + 1)]', '4 + 2√3|2']);
    expect(fr('g = (p1 − p2)/[(h1 − h2)d]', 'fis')).toEqual(['p1 − p2|[(h1 − h2)d]']);
    expect(fr('β = [1 − (λg/λr)²]/[1 + (λg/λr)²] · c', 'fis')[0]).toBe('[1 − (λg/λr)²]|[1 + (λg/λr)²]');
  });
  it('concentração embaixo e colchete seguido de outro continuam na linha', () => {
    expect(fr('[A⁻]/[HA]', 'qui')).toEqual([]);
    expect(fr('[C]²/[A]·[B]', 'qui')).toEqual([]);
    expect(fr('logo [SO4²−]/[HSO4−] = Ka', 'qui')).toEqual([]);
    expect(fr('E = E° − 0,03 · log(1/[Cu2+])', 'qui')).toEqual([]);
  });
  it('o texto não muda', () => {
    const s = 'c = (√3 + 1)²/[(√3 − 1)(√3 + 1)] = (4 + 2√3)/2';
    expect(junta(s, 'mat')).toBe(s);
  });
});

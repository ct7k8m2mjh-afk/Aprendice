import { describe, expect, it } from 'vitest';
import { partesFracao } from '../logica/fracao';
import { itensDaConta, montaRoteiro } from '../logica/motorConta';

/* Revisão de 21/11/2026, 7ª passada, itens Z (questao-correcao-6.md) */
const fr = (s: string, m?: string) => partesFracao(s, m).filter((p) => p.t === 'frac').map((p) => (p.t === 'frac' ? `${p.n}|${p.d}` : ''));
const linhas = (r: Parameters<typeof montaRoteiro>[0], m = 'mat') => montaRoteiro(r, m).linhas.map((l) => l.texto + (l.nota ? ` «${l.nota}»` : ''));

describe('Z1: lista de valores do quadro não vira coluna de números soltos', () => {
  it('quí Pa8675894: "Ca (Z = 20): 2 | 8 | 8 | 2" fica numa linha, com "; "', () => {
    const r = { passos: [{ faz: '', conta: 'Ca: [Ar] 4s² | Sr: [Kr] 5s²', porque: '' }], quadro: [{ linha: 'Ca (Z = 20): 2 | 8 | 8 | 2', nota: 'camadas do cálcio' }] };
    const ls = linhas(r, 'qui');
    expect(ls).toContain('Ca (Z = 20): 2; 8; 8; 2 «camadas do cálcio»');
    expect(ls.some((l) => /^\d+$/.test(l))).toBe(false);
  });
  it('mat P47d11207: valores que já são resultados das contas não entram repetidos; cada nota vai ao seu valor', () => {
    const r = {
      passos: [
        { faz: '', conta: '200 + 110 − 270 = 40', porque: '' },
        { faz: '', conta: '200 − 40 = 160', porque: '' },
        { faz: '', conta: '300 − 270 = 30', porque: '' },
        { faz: '', conta: '110 − 40 = 70', porque: '' },
      ],
      quadro: [{ linha: '160 | 40 | 70', nota: 'A | AB | B' }],
    };
    expect(linhas(r)).toEqual(['200 + 110 − 270 = 40 «AB»', '200 − 40 = 160 «A»', '300 − 270 = 30', '110 − 40 = 70 «B»']);
  });
  it('a linha de relações completas continua um item por linha', () => {
    const r = { passos: [{ faz: '', conta: 'Mg3N2 → Mg', porque: '' }], quadro: [{ linha: '3 Mg + N2 → Mg3N2 | Mg: 0 → +2 | N: 0 → −3', nota: 'redox' }] };
    expect(linhas(r, 'qui').slice(-3)).toEqual(['3 Mg + N2 → Mg3N2', 'Mg: 0 → +2', 'N: 0 → −3 «redox»']);
  });
});

describe('Z2: cada rótulo "n)" fica com a sua reação', () => {
  it('quí Paca34b46: o H da reação 1 não vai para a linha da reação 3', () => {
    expect(itensDaConta('1) Mg: 0 → +2 | H: +1 → 0  3) Mg: 0 → +2 | N: 0 → −3  6) Mg: 0 → +2 | O: 0 → −2', 'qui'))
      .toEqual(['1) Mg: 0 → +2, H: +1 → 0', '3) Mg: 0 → +2, N: 0 → −3', '6) Mg: 0 → +2, O: 0 → −2']);
  });
  it('rótulos separados por " | " continuam um por linha', () => {
    expect(itensDaConta('a) 3–2 | b) 2–1', 'qui')).toEqual(['a) 3–2', 'b) 2–1']);
  });
  it('intervalo "[−2, +∞[" não segura o "|" seguinte', () => {
    expect(itensDaConta("C: Im(g) = [−2, +∞[ | E: 'g linear' falsa", 'mat')).toEqual(['C: Im(g) = [−2, +∞[', "E: 'g linear' falsa"]);
  });
});

describe('Z3: letra grega com índice escrito como número é um nome só', () => {
  it('fís Pabef4082: "ε0A/λ" é ε₀A sobre λ', () => {
    expect(fr('0,433 · ε0A/λ', 'fis')).toEqual(['ε0A|λ']);
    expect(fr('C = ε0A/d', 'fis')).toEqual(['ε0A|d']);
  });
  it('fís Pdd874c02: "θ1/4" é θ₁ sobre 4', () => {
    expect(fr('θ3 = θ1/4', 'fis')).toEqual(['θ1|4']);
    expect(fr('θ1/2 = π/360', 'fis')).toEqual(['θ1|2', 'π|360']);
    expect(fr('θ1 + θ1/2', 'mat')).toEqual(['θ1|2']);
  });
});

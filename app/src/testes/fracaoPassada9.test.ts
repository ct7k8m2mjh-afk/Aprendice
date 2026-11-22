import { describe, expect, it } from 'vitest';
import { itensDaConta, montaRoteiro } from '../logica/motorConta';

/* Revisão de 21/11/2026, 9ª passada, itens B (questao-correcao-9.md) */
const linhas = (r: Parameters<typeof montaRoteiro>[0], m = 'mat') => montaRoteiro(r, m).linhas.map((l) => l.texto + (l.nota ? ` «${l.nota}»` : ''));
export const porPasso = (r: Parameters<typeof montaRoteiro>[0], m = 'mat') => {
  const rt = montaRoteiro(r, m);
  return rt.passos.map((p) => p.linhas.map((l) => rt.linhas[l].texto + (rt.linhas[l].nota ? ` «${rt.linhas[l].nota}»` : '')));
};

describe('B1: conta com " ; " entre registros e " | " entre campos', () => {
  it('mat Pc9132e4a: um jogador por linha, com a nota na linha dele', () => {
    const r = {
      passos: [{ faz: '', conta: 'Alice: V 1 | E 2 | D 1 ; Bruno: V 3 | E 0 | D 1 ; Carla: V 2 | E 1 | D 1 ; Diego: V 1 | E 1 | D 2 ; Elias: V 0 | E 2 | D 2', porque: '' }],
      quadro: [
        { linha: 'Alice: V 1 | E 2 | D 1', nota: 'linha de Alice' },
        { linha: 'Bruno: V 3 | E 0 | D 1', nota: 'linha de Bruno' },
        { linha: 'Carla: V 2 | E 1 | D 1', nota: 'linha de Carla' },
        { linha: 'Diego: V 1 | E 1 | D 2', nota: 'linha de Diego' },
        { linha: 'Elias: V 0 | E 2 | D 2', nota: 'único sem vitória' },
      ],
    };
    expect(linhas(r)).toEqual([
      'Alice: V 1; E 2; D 1 «linha de Alice»',
      'Bruno: V 3; E 0; D 1 «linha de Bruno»',
      'Carla: V 2; E 1; D 1 «linha de Carla»',
      'Diego: V 1; E 1; D 2 «linha de Diego»',
      'Elias: V 0; E 2; D 2 «único sem vitória»',
    ]);
  });
  it('registro cujos campos são todos relações: um campo por linha, sem misturar registros', () => {
    expect(itensDaConta('AP = 1 | PB = 2 ; BQ = 1 | QC = 2', 'mat')).toEqual(['AP = 1', 'PB = 2', 'BQ = 1', 'QC = 2']);
    expect(itensDaConta('X: T = 2T0 | V = 2V0 ; Y: T = 3T0 | V = 3V0', 'fis')).toEqual(['X: T = 2T0', 'V = 2V0', 'Y: T = 3T0', 'V = 3V0']);
  });
  it('mat Pa153d593 e bio Pa1a2d61e: campos de texto juntos no registro', () => {
    expect(itensDaConta('1 −4 5 −2 → 1 −3 2 | resto 0 ; 1 −3 2 → 1 −2 | resto 0', 'mat')).toEqual(['1 −4 5 −2 → 1 −3 2; resto 0', '1 −3 2 → 1 −2; resto 0']);
    expect(itensDaConta('AB: A e B | anticorpo nenhum ; O: nenhum | anti-A e anti-B', 'bio')).toEqual(['AB: A e B; anticorpo nenhum', 'O: nenhum; anti-A e anti-B']);
  });
  it('" ; " dentro de parênteses ou colchetes não separa registros', () => {
    expect(itensDaConta('A: (V₀ ; P₀) | B: (V₀ ; 4P₀)', 'fis')).toEqual(['A: (V₀ ; P₀)', 'B: (V₀ ; 4P₀)']);
    expect(itensDaConta('a11 = 1 + 2 = 3 | a22 = 4 + 4 = 8 → A = [3  5 ; 6  8]', 'mat')).toEqual(['a11 = 1 + 2 = 3', 'a22 = 4 + 4 = 8 → A = [3  5 ; 6  8]']);
  });
  it('a lista de valores por registro continua numa linha (A3)', () => {
    expect(itensDaConta('2004: 120 kg/ha | 38 kg/t ; 2009: ≈ 172 kg/ha | 28 kg/t', 'mat')).toEqual(['2004: 120 kg/ha; 38 kg/t', '2009: ≈ 172 kg/ha; 28 kg/t']);
  });
});


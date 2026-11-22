import { describe, expect, it } from 'vitest';
import { montaRoteiro } from '../logica/motorConta';

/* Revisão de 21/11/2026, 8ª passada, itens A (questao-correcao-7.md) */
const linhas = (r: Parameters<typeof montaRoteiro>[0], m = 'mat') => montaRoteiro(r, m).linhas.map((l) => l.texto + (l.nota ? ` «${l.nota}»` : ''));
const porPasso = (r: Parameters<typeof montaRoteiro>[0], m = 'mat') => {
  const rt = montaRoteiro(r, m);
  return rt.passos.map((p) => p.linhas.map((l) => rt.linhas[l].texto + (rt.linhas[l].nota ? ` «${rt.linhas[l].nota}»` : '')));
};

describe('A1: a linha do quadro com " | " que já está na conta não entra repetida', () => {
  it('mat Pc5100905: "1 100 | 681" casa com as duas contas; a nota vai para a última', () => {
    const r = { passos: [{ faz: '', conta: 'P: 1 150 − 50 = 1 100 | V: 720 − 39 = 681 → alternativa C', porque: '' }], quadro: [{ linha: '1 100 | 681', nota: 'boas' }] };
    expect(linhas(r)).toEqual(['P: 1 150 − 50 = 1 100', 'V: 720 − 39 = 681 → alternativa C «boas»']);
  });
  it('mat P476c4b22: "A/1,35 | A/1,45 | A/1,28" não repete as três áreas', () => {
    const r = { passos: [{ faz: '', conta: '2018: A/1,35 ≈ 0,741A | 2017: A/1,45 ≈ 0,690A | 2016: A/1,28 ≈ 0,781A', porque: '' }], quadro: [{ linha: 'A/1,35 | A/1,45 | A/1,28', nota: 'áreas' }] };
    expect(linhas(r)).toEqual(['2018: A/1,35 ≈ 0,741A', '2017: A/1,45 ≈ 0,690A', '2016: A/1,28 ≈ 0,781A «áreas»']);
  });
  it('bio P85452565: o resultado do cruzamento não é partido por uma linha repetida', () => {
    const r = {
      passos: [{ faz: '', conta: 'mulher: IAi | homem: IBIB', porque: '' }, { faz: '', conta: 'IAi × IBIB → IAIB | IBi', porque: '' }],
      quadro: [{ linha: 'IAi × IBIB', nota: 'mãe heterozigota, pai homozigoto' }, { linha: 'IAIB | IBi', nota: 'metade de cada' }],
    };
    expect(porPasso(r, 'bio')[1]).toEqual(['IAi × IBIB → IAIB «mãe heterozigota, pai homozigoto»', 'IBi «metade de cada»']);
  });
  it('quí P16af84a2: "gás: 1 + 3 = 4 mol | 2 mol" fica nas linhas da esquerda e da direita', () => {
    const r = { passos: [{ faz: '', conta: 'esquerda: 1 + 3 = 4 mol | direita: 2 mol', porque: '' }], quadro: [{ linha: 'gás: 1 + 3 = 4 mol | 2 mol', nota: 'esquerda | direita' }] };
    expect(linhas(r, 'qui')).toEqual(['esquerda: 1 + 3 = 4 mol', 'direita: 2 mol «esquerda; direita»']);
  });
  it('"∝" é relação: "V ∝ 1/d | E ∝ 1/d²" fica um item por linha', () => {
    const r = { passos: [], quadro: [{ linha: 'V ∝ 1/d | E ∝ 1/d²', nota: 'potencial × campo' }] };
    expect(linhas(r, 'fis')).toEqual(['V ∝ 1/d', 'E ∝ 1/d² «potencial × campo»']);
  });
});

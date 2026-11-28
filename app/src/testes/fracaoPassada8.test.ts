import { describe, expect, it } from 'vitest';
import { itensDaConta, montaRoteiro, quebrasConta, tokeniza } from '../logica/motorConta';
import { partesNotacao } from '../logica/notacao';

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

describe('A2: nota e linha do quadro no lugar certo', () => {
  it('mat Pf7605a63: a nota "mediana" fica no passo 3, e não na conta da média', () => {
    const r = {
      passos: [
        { faz: '', conta: '(x + 2x + 3x)/3 = 6x/3 = 2x = 5,2 → x = 2,6', porque: '' },
        { faz: '', conta: '2,6 | 5,2 | 7,8', porque: '' },
        { faz: '', conta: 'a do meio: 5,2 → alternativa C', porque: '' },
      ],
      quadro: [{ linha: '2x = 5,2', nota: 'média' }, { linha: '2,6 | 5,2 | 7,8', nota: 'notas' }, { linha: '5,2', nota: 'mediana' }],
    };
    const ps = porPasso(r);
    expect(ps[0]).toEqual(['(x + 2x + 3x)/3 = 6x/3 = 2x = 5,2 → x = 2,6 «média»']);
    expect(ps[2]).toEqual(['a do meio: 5,2 → alternativa C «mediana»']);
  });
  it('fís Pce134e95: a linha que não está na conta entra antes da tabela, e não no meio dela', () => {
    const r = {
      passos: [{ faz: '', conta: '0%: 0,57 | 1,5%: 0,54 | 3,2%: 0,50 | 7,4%: 0,61', porque: '' }, { faz: '', conta: 'menor coeficiente: 0,50 → 3,2% de água', porque: '' }],
      quadro: [{ linha: 'atrito = µ × N', nota: 'normal constante' }, { linha: 'µ: 0,57 | 0,54 | 0,50 | 0,61', nota: 'lê a tabela' }],
    };
    expect(porPasso(r, 'fis')[0]).toEqual(['atrito = µ × N «normal constante»', '0%: 0,57', '1,5%: 0,54', '3,2%: 0,50', '7,4%: 0,61 «lê a tabela»']);
  });
  it('quí P16af84a2: a reação do quadro não parte "esquerda | direita" ao meio', () => {
    const r = {
      passos: [{ faz: '', conta: 'esquerda: 1 + 3 = 4 mol | direita: 2 mol', porque: '' }],
      quadro: [{ linha: 'N2 + 3 H2 ⇌ 2 NH3; ΔH° = −92,6 kJ/mol', nota: 'direta exotérmica' }, { linha: 'gás: 1 + 3 = 4 mol | 2 mol', nota: 'esquerda | direita' }],
    };
    expect(linhas(r, 'qui')).toEqual(['N2 + 3 H2 ⇌ 2 NH3; ΔH° = −92,6 kJ/mol «direta exotérmica»', 'esquerda: 1 + 3 = 4 mol', 'direita: 2 mol «esquerda; direita»']);
  });
  it('mat P7abf1bcd: os mesmos itens em outra ordem casam com a conta (sem linha repetida)', () => {
    const r = { passos: [{ faz: '', conta: 'a cada 3 dias: 2¹⁰ = 1024 | a cada 5 dias: 2⁶ = 64', porque: '' }], quadro: [{ linha: '2⁶ = 64 | 2¹⁰ = 1024', nota: 'áreas' }] };
    expect(linhas(r)).toEqual(['a cada 3 dias: 2¹⁰ = 1024', 'a cada 5 dias: 2⁶ = 64 «áreas»']);
  });
});

describe('A3: a lista de valores da conta do passo não vira coluna de números soltos', () => {
  it('quí Pf90acda4: "pH: 4,0 | 3,6 | 2,5 → …" fica numa linha, com "; "', () => {
    expect(itensDaConta('pH: 4,0 | 3,6 | 2,5 → todos < 7 → caráter ácido', 'qui')).toEqual(['pH: 4,0; 3,6; 2,5 → todos < 7 → caráter ácido']);
  });
  it('mat Pfe3cc0ba e Pb28d85a4: tabela e lista com rótulo numa linha', () => {
    expect(itensDaConta('Total: 16 | 17 | 66 — Homens: 21 | 15 | 64', 'mat')).toEqual(['Total: 16; 17; 66 — Homens: 21; 15; 64']);
    expect(itensDaConta('altas: 1,0 | 1,3 | 5,0 | 0,5 → a maior é 5,0', 'mat')).toEqual(['altas: 1,0; 1,3; 5,0; 0,5 → a maior é 5,0']);
  });
  it('quí Pf2101c1e: cada elemento fica numa linha, com os dois lados da equação', () => {
    expect(itensDaConta('H: 2 + 2 = 4 | 2 × 2 = 4; O: 4 + 2 = 6 | 4 + 2 = 6; Na: 2 | 2; S: 1 | 1', 'qui'))
      .toEqual(['H: 2 + 2 = 4; 2 × 2 = 4', 'O: 4 + 2 = 6; 4 + 2 = 6', 'Na: 2; 2', 'S: 1; 1']);
  });
  it('mat P7244b669: " ; " fecha a linha da tabela', () => {
    expect(itensDaConta('janeiro: 900 | 1200 | 1000 ; custo: 12 | 10 | 16', 'mat')).toEqual(['janeiro: 900; 1200; 1000', 'custo: 12; 10; 16']);
  });
  it('relações e itens de texto continuam um por linha', () => {
    expect(itensDaConta('x = 3 | y = 4', 'mat')).toEqual(['x = 3', 'y = 4']);
    expect(itensDaConta('338 °C | não conduz no sólido | conduz em água', 'qui')).toEqual(['338 °C', 'não conduz no sólido', 'conduz em água']);
  });
  it('mat Pf7605a63: a lista do quadro casa com a lista da conta, e o "5,2" seguinte é o do passo 3', () => {
    const r = {
      passos: [{ faz: '', conta: '2x = 5,2 → x = 2,6', porque: '' }, { faz: '', conta: '2,6 | 5,2 | 7,8', porque: '' }, { faz: '', conta: 'a do meio: 5,2 → alternativa C', porque: '' }],
      quadro: [{ linha: '2,6 | 5,2 | 7,8', nota: 'notas' }, { linha: '5,2', nota: 'mediana' }],
    };
    expect(porPasso(r)).toEqual([['2x = 5,2 → x = 2,6'], ['2,6; 5,2; 7,8 «notas»'], ['a do meio: 5,2 → alternativa C «mediana»']]);
  });
  it('quí Pf90acda4: a linha do quadro casa com os valores do passo 1, e não com a conclusão do passo 4', () => {
    const r = {
      passos: [{ faz: '', conta: 'abacaxi: 8,61% | acerola: 7,49% | cajá: 5,13%', porque: '' }, { faz: '', conta: '8,61% e 7,49% > 5,13% → alternativa A', porque: '' }],
      quadro: [{ linha: 'açúcares: 8,61 | 7,49 | 5,13', nota: 'abacaxi e acerola na frente: A' }],
    };
    expect(porPasso(r, 'qui')).toEqual([['abacaxi: 8,61%', 'acerola: 7,49%', 'cajá: 5,13% «abacaxi e acerola na frente: A»'], ['8,61% e 7,49% > 5,13% → alternativa A']]);
  });
});

describe('A4: a frase dentro da linha da conta quebra como texto na folha estreita', () => {
  it('mat P5be7ca9e: "as cinco afirmações de D são verdadeiras → alternativa D" pode quebrar entre as palavras', () => {
    const ts = tokeniza('as cinco afirmações de D são verdadeiras → alternativa D', 'mat');
    const brk = quebrasConta(ts);
    const antes = (palavra: string) => { const i = ts.findIndex((t) => t.v === palavra); return brk.get(i - 1); };
    expect(antes('afirmações')).toBe(2);
    expect(antes('verdadeiras')).toBe(2);
  });
  it('"alternativa D" e a conta continuam juntas', () => {
    const ts = tokeniza('as cinco afirmações de D são verdadeiras → alternativa D', 'mat');
    expect(quebrasConta(ts).has(ts.length - 2)).toBe(false);
    const conta = tokeniza('x + 2 = 5', 'mat');
    expect(quebrasConta(conta).size).toBe(quebrasConta(tokeniza('x + 2 = 5')).size);
  });
});

describe('A5: o índice de "ε0A" desce como o de "θ1"', () => {
  it('fís Pabef4082: "ε0A" é ε₀ seguido de A', () => {
    expect(partesNotacao('ε0A')).toEqual([{ t: 'txt', v: 'ε' }, { t: 'sub', v: '0', pre: '', pos: '' }, { t: 'txt', v: 'A' }]);
    expect(partesNotacao('θ1').map((p) => p.t)).toEqual(['txt', 'sub']);
  });
  it('palavra ou fórmula com letra grega não muda ("α2Be" não é índice)', () => {
    expect(partesNotacao('α2Be').some((p) => p.t === 'sub' && p.v === '2')).toBe(false);
  });
});

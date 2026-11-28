import { describe, expect, it } from 'vitest';
import { itensDaConta, montaRoteiro, parecida } from '../logica/motorConta';

/* Revisão de 21/11/2026, 9ª passada, itens B (questao-correcao-9.md) */
const linhas = (r: Parameters<typeof montaRoteiro>[0], m = 'mat') => montaRoteiro(r, m).linhas.map((l) => l.texto + (l.nota ? ` «${l.nota}»` : ''));
const porPasso = (r: Parameters<typeof montaRoteiro>[0], m = 'mat') => {
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


const P = (...contas: string[]) => contas.map((conta) => ({ faz: '', conta, porque: '' }));
const nota = (ps: string[][], texto: string) => ps.flat().filter((l) => l.includes(`«${texto}»`));

describe('B2: linha do quadro que diz o mesmo que a conta com outras palavras não entra repetida', () => {
  it('quí Pf90acda4: "Mg: 70,0 | 48,0 | 23,0" (escrita depois do pH) leva a nota para a linha do Mg do passo 2', () => {
    const r = {
      passos: P('abacaxi: 8,61% | acerola: 7,49% | cajá: 5,13%', 'lipídios: abacaxi 0,54% < acerola 2,47% < cajá 3,61% | Mg: abacaxi 70,0 > acerola 48,0 > cajá 23,0 mg/100 g', 'pH: 4,0 | 3,6 | 2,5 → todos < 7 → caráter ácido', '8,61% e 7,49% > 5,13% → alternativa A'),
      quadro: [{ linha: 'açúcares: 8,61 | 7,49 | 5,13', nota: 'abacaxi e acerola na frente: A' }, { linha: 'lipídios: 0,54 | 2,47 | 3,61', nota: 'abacaxi é o menor: B cai' }, { linha: 'pH: 4,0 | 3,6 | 2,5 < 7', nota: 'todas ácidas: C cai' }, { linha: 'Mg: 70,0 | 48,0 | 23,0', nota: 'cajá é o menor: D cai' }],
    };
    const ps = porPasso(r, 'qui');
    expect(ps[1][1]).toBe('Mg: abacaxi 70,0 > acerola 48,0 > cajá 23,0 mg/100 g «cajá é o menor: D cai»');
    expect(ps[3]).toEqual(['8,61% e 7,49% > 5,13% → alternativa A']);
  });
  it('quí P16af84a2: "↑ pressão…" e "↓ T…" casam com os passos 2 e 3', () => {
    const r = {
      passos: P('esquerda: 1 + 3 = 4 mol | direita: 2 mol', '↑ pressão → lado com 2 mol → mais NH3 → I correta', 'ΔH = −92,6 kJ/mol → ↓ T favorece a direta → mais NH3 → II correta', 'I e II corretas → alternativa C'),
      quadro: [{ linha: 'N2 + 3 H2 ⇌ 2 NH3; ΔH° = −92,6 kJ/mol', nota: 'direta exotérmica' }, { linha: 'gás: 1 + 3 = 4 mol | 2 mol', nota: 'esquerda | direita' }, { linha: '↑ pressão → lado com 2 mol → I correta', nota: 'menos gás' }, { linha: '↓ T → sentido exotérmico → II correta', nota: 'alternativa C' }],
    };
    const ps = porPasso(r, 'qui');
    expect(ps[0]).toHaveLength(3);
    expect(ps[1]).toEqual(['↑ pressão → lado com 2 mol → mais NH3 → I correta «menos gás»']);
    expect(ps[2]).toEqual(['ΔH = −92,6 kJ/mol → ↓ T favorece a direta → mais NH3 → II correta «alternativa C»']);
    expect(ps[3]).toEqual(['I e II corretas → alternativa C']);
  });
  it('fís Pce134e95: "µ mínimo = 0,50 → 3,2%" é a linha do passo 2', () => {
    const r = {
      passos: P('0%: 0,57 | 1,5%: 0,54 | 3,2%: 0,50 | 7,4%: 0,61', 'menor coeficiente: 0,50 → 3,2% de água', '3,2% → alternativa C'),
      quadro: [{ linha: 'atrito = µ × N', nota: 'normal constante' }, { linha: 'µ: 0,57 | 0,54 | 0,50 | 0,61', nota: 'lê a tabela' }, { linha: 'µ mínimo = 0,50 → 3,2%', nota: 'menor atrito' }],
    };
    const ps = porPasso(r, 'fis');
    expect(ps[0]).toHaveLength(5);
    expect(ps[1]).toEqual(['menor coeficiente: 0,50 → 3,2% de água «menor atrito»']);
  });
  it('quí Pf2101c1e: o balanço do passo 2 não se repete no passo 5', () => {
    const r = {
      passos: P('H2SO4 + 2 NaOH: 2 H+ e 2 OH−', 'H: 2 + 2 = 4 (esquerda) | 2 × 2 = 4 (direita); O: 4 + 2 = 6 | 4 + 2 = 6; Na: 2 | 2; S: 1 | 1', 'HCl + Ca(OH)2: 1 H+ e 2 OH−', 'C: total exige H+ igual a OH− | D: 1:1 sobra OH− | E: 1:2 não sobra nada', 'H2SO4 + 2 NaOH → Na2SO4 + 2 H2O: alternativa A'),
      quadro: [{ linha: 'H2SO4 + 2 NaOH → Na2SO4 + 2 H2O', nota: 'equação da alternativa A' }, { linha: 'H: 2 + 2 = 4 | 2 × 2 = 4', nota: 'hidrogênios dos dois lados' }, { linha: 'O: 4 + 2 = 6 | 4 + 2 = 6', nota: 'oxigênios dos dois lados' }, { linha: 'Na: 2 | 2   S: 1 | 1', nota: 'sódio e enxofre fecham' }],
    };
    const ps = porPasso(r, 'qui');
    expect(ps[4]).toEqual(['H2SO4 + 2 NaOH → Na2SO4 + 2 H2O: alternativa A «equação da alternativa A»']);
    expect(ps[1]).toEqual(['H: 2 + 2 = 4 (esquerda); 2 × 2 = 4 (direita) «hidrogênios dos dois lados»', 'O: 4 + 2 = 6; 4 + 2 = 6 «oxigênios dos dois lados»', 'Na: 2; 2', 'S: 1; 1 «sódio e enxofre fecham»']);
  });
  it('mat Pfe3cc0ba: III e IV (mesmo rótulo e mesma conclusão) não se repetem', () => {
    const r = {
      passos: P('Total: 16 | 17 | 66 — Homens: 21 | 15 | 64 — Mulheres: 12 | 20 | 68', 'I: homens 15% < mulheres 20% → falsa | IV: mulheres em binge 12% ≠ 25% → falsa', 'II: binge homens 21% × mulheres 12% → 21 − 12 = 9 pontos → verdadeira | III: não bebeu 66% ≈ 2/3 = 66,7% → verdadeira', 'corretas: II e III → alternativa D'),
      quadro: [{ linha: 'Homens: 21 | 15 | 64 — Mulheres: 12 | 20 | 68', nota: 'binge | não binge | não bebeu' }, { linha: 'I: 15 < 20 → falsa', nota: 'sem binge, mulheres na frente' }, { linha: 'II: 21 − 12 = 9 pontos → verdadeira', nota: 'diferença no binge' }, { linha: 'III: 66 ≈ 2/3 · 100 = 66,7 → verdadeira', nota: 'abstinentes no total' }, { linha: 'IV: 12 ≠ 1/4 · 100 = 25 → falsa', nota: 'mulheres em binge' }],
    };
    const ps = porPasso(r);
    expect(ps[1][1]).toBe('IV: mulheres em binge 12% ≠ 25% → falsa «mulheres em binge»');
    expect(ps[2][1]).toBe('III: não bebeu 66% ≈ 2/3 = 66,7% → verdadeira «abstinentes no total»');
    expect(ps[2]).toHaveLength(2);
    expect(ps[3]).toEqual(['corretas: II e III → alternativa D']);
  });
  it('quí Pe28a5b82 e mat P4abfc5e2: casa com várias linhas do passo, ou com uma linha mais longa', () => {
    const r1 = {
      passos: P('Fe3+ + 3 e− → Fe: −0,55 V', 'Mg: −2,37 < −0,55 | Zn: −0,76 < −0,55 | Pb: −0,13 > −0,55 | Cu: +0,34 > −0,55 | Al: +1,66 > −0,55'),
      quadro: [{ linha: 'Pb: −0,13 V > −0,55 V', nota: 'não protege' }, { linha: 'Cu: +0,34 V e Al: +1,66 V > −0,55 V', nota: 'não protegem (valores da tabela)' }],
    };
    expect(porPasso(r1, 'qui')[1].slice(2)).toEqual(['Pb: −0,13 > −0,55 «não protege»', 'Cu: +0,34 > −0,55', 'Al: +1,66 > −0,55 «não protegem (valores da tabela)»']);
    const r2 = {
      passos: P('12 h ÷ 6 h = 2 meias-vidas', '120 mg → 60 mg (14h) → 30 mg (20h)', '30 mg → alternativa E'),
      quadro: [{ linha: '12 ÷ 6 = 2', nota: 'meias-vidas entre as doses' }, { linha: '120 → 60', nota: 'primeira meia-vida, 14h' }, { linha: '60 → 30', nota: 'segunda meia-vida, 20h' }],
    };
    expect(porPasso(r2)[1]).toEqual(['120 mg → 60 mg (14h) → 30 mg (20h) «primeira meia-vida, 14h; segunda meia-vida, 20h»']);
  });
  it('não casa: letras, sinais ou números diferentes', () => {
    expect(parecida(['xv < 0 e a < 0 → −b/(2a) < 0 → b < 0'], 'f(0) < 0 → c < 0')).toBe(0);
    expect(parecida(['2A + B = 100 → B = 100 − 2A'], 'C = A → B = 100 − 2A')).toBe(0);
    expect(parecida(['W = 0 ; P cai a V fixo → T cai → ΔU < 0 → Q = ΔU < 0'], 'CA: ΔU = 0 ; W < 0 → Q < 0')).toBe(0);
    expect(parecida(['log_x(1 − y) = 1 → 1 − y = x → y = 1 − x'], '1 − y = x → y = 1 − x; z = 1 − x')).toBe(0);
    expect(parecida(['vértice (1, 0) → alternativa A'], 'g(1) = 0')).toBe(0);
    expect(parecida(['log₂ √2 = 1/2'], 'S = 2/(1/2)')).toBe(0);
    expect(parecida(['Zn: −0,76 < −0,55'], 'Mg: −2,37 V < −0,55 V')).toBe(0);
    expect(parecida(['Mg: abacaxi 70,0 > acerola 48,0 > cajá 23,0 mg/100 g'], 'Mg: 70,0 | 48,0 | 23,0', 2)).toBe(2);
    expect(parecida(['prop- (3 C) + -eno (dupla) → CH2=CH−CH3'], 'CH2= primário; CH secundário; CH3 primário', 3, true)).toBe(0);
  });
  it('mat P14eb9b56: "f(0) < 0 → c < 0" continua no passo 3, com a nota dele', () => {
    const r = {
      passos: P('abre para baixo → a < 0', 'a curva cruza o eixo y abaixo do zero → c < 0', 'xv < 0 e a < 0 → −b/(2a) < 0 → b < 0', 'a < 0, b < 0 e c < 0'),
      quadro: [{ linha: 'abre para baixo → a < 0', nota: 'concavidade' }, { linha: 'f(0) < 0 → c < 0', nota: 'eixo y' }, { linha: 'xv = −b/(2a) < 0 com a < 0 → b < 0', nota: 'vértice' }],
    };
    expect(nota(porPasso(r), 'eixo y')).toEqual(['f(0) < 0 → c < 0 «eixo y»']);
  });
});

describe('B3: fís P9ba33c4c, "d = 2r → V/2" casa com o passo 2 (antes)', () => {
  it('a nota "decai com 1/d" vai para a conta do passo 2, sem linha repetida no passo 4', () => {
    const r = {
      passos: P('0 ≤ d ≤ r: V = k · Q/r → patamar constante, V > 0', 'd > r: V = k · Q/d → d = 2r: V = (k · Q/r)/2', 'V ∝ 1/d | E ∝ 1/d²', 'd > r: V decai com 1/d'),
      quadro: [{ linha: 'd ≤ r: V = k · Q/r', nota: 'patamar constante' }, { linha: 'd > r: V = k · Q/d', nota: 'como carga pontual' }, { linha: 'V ∝ 1/d | E ∝ 1/d²', nota: 'potencial × campo' }, { linha: 'd = 2r → V/2', nota: 'decai com 1/d' }],
    };
    const ps = porPasso(r, 'fis');
    expect(ps[1]).toEqual(['d > r: V = k · Q/d → d = 2r: V = (k · Q/r)/2 «como carga pontual; decai com 1/d»']);
    expect(ps[3]).toEqual(['d > r: V decai com 1/d']);
  });
});

import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { montaRoteiro } from '../logica/motorConta';
import type { Resolucao } from '../dados/tipos';

/* Revisão de 21/11/2026, 10ª passada, C1 e C2 (questao-correcao-10.md), com as resoluções de verdade dos dados */
const DEST = join(__dirname, '..', '..', 'public', 'conteudo');
const tem = existsSync(join(DEST, 'mat', 'res'));
const cache = new Map<string, Resolucao>();
function res(m: string, id: string): Resolucao {
  if (!cache.size) for (const mm of ['mat', 'qui', 'bio', 'fis']) {
    const dir = join(DEST, mm, 'res');
    for (const f of readdirSync(dir)) for (const [k, r] of Object.entries<Resolucao>(JSON.parse(readFileSync(join(dir, f), 'utf-8')))) cache.set(`${mm} ${k}`, r);
  }
  const r = cache.get(`${m} ${id}`);
  if (!r) throw new Error(`${m} ${id}`);
  return r;
}
const porPasso = (m: string, id: string) => {
  const rt = montaRoteiro(res(m, id), m);
  return rt.passos.map((p) => p.linhas.map((l) => rt.linhas[l].texto + (rt.linhas[l].nota ? ` «${rt.linhas[l].nota}»` : '')));
};
const tudo = (m: string, id: string) => porPasso(m, id).flat();

describe.skipIf(!tem)('C1: linha do quadro que repete a conta não entra de novo', () => {
  it('mat Pf994201f: número arredondado ("0,0256" e "0,02564"), a nota vai para a conta', () => {
    const ps = porPasso('mat', 'Pf994201f');
    expect(ps[1]).toEqual(['(4,40 − 4,29)/4,29 = 0,11/4,29 ≈ 0,02564 → 2,56 % «dividir pela base»']);
    expect(ps[2]).toEqual(['(4,58 − 4,31)/4,31 = 0,27/4,31 ≈ 0,06265 → 6,26 % «dividir pela base»']);
  });
  it('mat P146f445c: "100" é "4 · 25"; a linha do meio da conta não volta depois do fim', () => {
    expect(porPasso('mat', 'P146f445c')[1]).toEqual(['(32 − 6c)² − 4 · 25 · (c² − 48) = 0 → −64c² − 384c + 5824 = 0 → c² + 6c − 91 = 0 «quadrado perfeito em y»']);
  });
  it('quí Peb5ea8ca: "0,0034 L" é "3,4 × 10⁻³ L"', () => {
    expect(porPasso('qui', 'Peb5ea8ca')[2]).toEqual(['C = (2,70 × 10⁻³ mol)/(3,4 × 10⁻³ L) ≈ 0,79 mol/L «divide pelo volume final»']);
  });
  it('fís P41dcc9b8: "A: P − NA = m v²/R" é trecho da conta do passo', () => {
    const ps = porPasso('fis', 'P41dcc9b8');
    expect(ps[0]).toEqual(['A: centro para baixo → P − NA = m v²/R → NA < P «topo; resultante para baixo»']);
    expect(ps[1]).toEqual(['B: centro para cima → NB − P = m v²/R → NB > P «base; resultante para cima»']);
  });
  it('mat P7c100bf7: "840/7 = 120 «média»" é o "média 120" da conta', () => {
    expect(porPasso('mat', 'P7c100bf7')[0]).toEqual(['120, 100, 110, 140, 170, 100, 100 → soma 840 → média 120 «média»']);
  });
  it('bio Pba6766ee: "homem: ii Rr" e "mulher: ii rr" são o fim da seta da conta', () => {
    const ps = porPasso('bio', 'Pba6766ee');
    expect(ps[0]).toEqual(['O Rh+ com mãe Rh− (rr) → ii Rr «O Rh+ com mãe Rh−»']);
    expect(ps[1]).toEqual(['O Rh− → ii rr «O Rh−»']);
  });
  it('mat P13525e2d: "centrais: 24,50 e 24,80" é o passo 2', () => {
    const ps = porPasso('mat', 'P13525e2d');
    expect(ps[0]).toHaveLength(1);
    expect(ps[1]).toEqual(['8 valores → 4.º = 24,50 e 5.º = 24,80 «4.º e 5.º de 8 valores»']);
  });
  it('mat Pb28d85a4: "mulheres: 2020 = 47,3 | 2021 = 52,3" são as linhas de 2020 e 2021', () => {
    const ps = porPasso('mat', 'Pb28d85a4');
    expect(ps[0]).toEqual(['2019: 54,6', '2020: 47,3', '2021: 52,3 «ler os dois pontos da linha tracejada»', '2022: 53,4', '2023: 52,3', '2024: 52,8']);
  });
  it('linhas que dizem outra coisa continuam', () => {
    expect(tudo('mat', 'P4133018e')).toContain('y = 3 − 4 = −1 «y = z − 4»');
    expect(tudo('mat', 'P466ce997').some((l) => l.startsWith('pH = −(log 2 + log 10^(−7))'))).toBe(true);
    expect(tudo('mat', 'P84c242f6').some((l) => l.startsWith('a⁴ + b⁴ = (p² − 2q)² − 2q²'))).toBe(true);
    expect(tudo('mat', 'P38be2c42').some((l) => l.startsWith('2^x = 700/27 → x = log₂ 700 − log₂ 27'))).toBe(true);
    expect(tudo('fis', 'Pc89ec3fc').some((l) => l.startsWith('2,5 × 8 + 1,6 × 12 = 39,2 J'))).toBe(true);
    expect(tudo('mat', 'P1aee808c').some((l) => l.startsWith('16/6 = 8/3'))).toBe(true);
    expect(tudo('qui', 'P0fc6f7b7').some((l) => l.startsWith('álcool: 1 e 3'))).toBe(true);
    expect(tudo('mat', 'Pb0b64def').some((l) => l.startsWith('A: 22, 24, 26, 28, 30, 32'))).toBe(true);
  });
});

describe.skipIf(!tem)('C2: linha do quadro no passo certo, nunca depois da conclusão', () => {
  it('mat P5be7ca9e: "j(1) = 0 → j(2) = −1" vai para o passo do "j decrescente"; "|x| ≥ 0 …" para a afirmação C', () => {
    const ps = porPasso('mat', 'P5be7ca9e');
    expect(ps[3][ps[3].length - 1]).toBe('j(1) = 0 → j(2) = −1 «j decresce»');
    expect(ps[4]).toEqual(['as cinco afirmações de D são verdadeiras → alternativa D']);
    expect(ps[2]).toEqual(["A: 'g linear' falsa", "B: 'i par' falsa", "C: 'imagem de g é ℝ' falsa, Im(g) = [−2, +∞[", '|x| ≥ 0 → |x| − 2 ≥ −2 «Im(g) = [−2, +∞[, não ℝ»', "E: 'g linear' falsa"]);
    expect(ps[1].some((l) => l.startsWith('|x|'))).toBe(false);
  });
  it('quí P0d56efd8: "137 = 137 + 0" é a massa da equação do item II (nuclídeo), não entra no passo 1', () => {
    const ps = porPasso('qui', 'P0d56efd8');
    expect(ps[0]).toEqual(['decaimento espontâneo; meia-vida não depende do ambiente']);
    expect(ps[1]).toEqual(['¹³⁷₅₅Cs → ¹³⁷₅₆Ba + ⁰₋₁β «massa; carga: Z sobe 1»']);
  });
  it('bio Pba6766ee: "Rr × rr → Rr | rr" fica no "Cruze"', () => {
    const ps = porPasso('bio', 'Pba6766ee');
    expect(ps[2]).toEqual(['ii Rr × ii rr → ii Rr (O Rh+)', 'ii rr (O Rh−)', 'Rr × rr → Rr; rr «1/2 Rh+ e 1/2 Rh−»']);
    expect(ps[3]).toEqual(['C: ABO e Rh são genes diferentes', 'D: IAi Rr × IBIB RR → todos Rh+', 'E: IAi Rr × IBi Rr → A, B, AB, O']);
  });
  it('mat Pb28d85a4: "maior alta = 5,0 → C" é a conclusão do passo 5, não entra no meio das letras', () => {
    const ps = porPasso('mat', 'Pb28d85a4');
    expect(ps[3].some((l) => l.startsWith('maior alta'))).toBe(false);
    expect(ps[4]).toEqual(['maior alta anual: 47,3 → 52,3 (+5,0) → alternativa C «conclusão»']);
  });
  it('nenhuma linha do quadro depois da conclusão do passo (resoluções de exemplo)', () => {
    expect(porPasso('mat', 'P12681577')[3].at(-1)).toBe('t ≈ 13,2 + 1 = 14,2 anos → alternativa C');
    expect(porPasso('fis', 'P733b8dee')[3].at(-1)).toBe('grooving → maior força de atrito pneu-piso → alternativa A');
    expect(porPasso('qui', 'P988a6ce2')[3].at(-1)).toBe('4º período, grupo 2, 2 elétrons de valência → B');
  });
  it('o lugar não muda por uma palavra solta da nota (fís P20f45835, Clarice no passo 1; quí P1e14511a)', () => {
    expect(porPasso('fis', 'P20f45835')[0]).toEqual(['vê de perto, não de longe → miopia', 'Clarice: miopia → divergente «não vê de longe»']);
    expect(porPasso('qui', 'P1e14511a')[0]).toEqual(['dependem da quantidade de partículas, não da natureza', '1 g/0,01 mol = 100 g/mol «exemplo de massa molar»']);
    expect(porPasso('qui', 'Pdeb86dd5')[0]).toHaveLength(6);
  });
});

describe.skipIf(!tem)('passadas anteriores continuam (Z, A1–A5, B1–B3)', () => {
  it('A1: mat P476c4b22 sem linha repetida', () => {
    expect(porPasso('mat', 'P476c4b22')[0]).toEqual(['2018: A/1,35 ≈ 0,741A', '2017: A/1,45 ≈ 0,690A', '2016: A/1,28 ≈ 0,781A «áreas»']);
  });
  it('A2: mat Pf7605a63 ("mediana" no passo 3) e fís Pce134e95 ("atrito = µ × N" antes da tabela)', () => {
    expect(porPasso('mat', 'Pf7605a63')[2]).toEqual(['a do meio: 5,2 → alternativa C «mediana»']);
    expect(porPasso('fis', 'Pce134e95')[0][0]).toBe('atrito = µ × N «normal constante»');
  });
  it('A3 e B2: quí Pf90acda4 (pH numa linha; Mg no passo 2)', () => {
    const ps = porPasso('qui', 'Pf90acda4');
    expect(ps[2]).toEqual(['pH: 4,0; 3,6; 2,5 → todos < 7 → caráter ácido «todas ácidas: C cai»']);
    expect(ps[1][1]).toBe('Mg: abacaxi 70,0 > acerola 48,0 > cajá 23,0 mg/100 g «cajá é o menor: D cai»');
    expect(ps[3]).toEqual(['8,61% e 7,49% > 5,13% → alternativa A']);
  });
  it('B1: mat Pc9132e4a, um jogador por linha', () => {
    expect(porPasso('mat', 'Pc9132e4a')[0]).toEqual(['Alice: V 1; E 2; D 1 «linha de Alice»', 'Bruno: V 3; E 0; D 1 «linha de Bruno»', 'Carla: V 2; E 1; D 1 «linha de Carla»', 'Diego: V 1; E 1; D 2 «linha de Diego»', 'Elias: V 0; E 2; D 2 «único sem vitória»']);
  });
  it('B2 e B3: quí P16af84a2 e fís P9ba33c4c', () => {
    expect(porPasso('qui', 'P16af84a2')[2]).toEqual(['ΔH = −92,6 kJ/mol → ↓ T favorece a direta → mais NH3 → II correta «alternativa C»']);
    const f = porPasso('fis', 'P9ba33c4c');
    expect(f[1]).toEqual(['d > r: V = k · Q/d → d = 2r: V = (k · Q/r)/2 «como carga pontual; decai com 1/d»']);
    expect(f[3]).toEqual(['d > r: V decai com 1/d']);
  });
});

// Revisão do site de 20/11/2026 (2ª rodada), questão e correção: N1 (conta comprida quebra, nunca é cortada), N3 (" | "
// cru na resolução em texto), N4 (linha repetida no passo), N5 (o que se cancela é riscado), N6 (Caveat só na conta),
// N9 (índice do genótipo), N12 (notação crua, ordinal) e item 22 (aspas simples curvas).
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { itensDaConta, montaRoteiro, quadroEquivale, quebrasConta, termosDitos, tokeniza, tokensProsa } from '../logica/motorConta';
import { aspasCurvas, ordinais, textoCorrecao } from '../logica/aspas';
import { partesFracao } from '../logica/fracao';
import { blocosDoParagrafo } from '../logica/transcricao';
import { origemDoLink } from '../logica/origemLink';
import { ResolucaoAnimada } from '../ui/ResolucaoAnimada';
import { ResolucaoView } from '../ui/Resolucao';
import { textoMao } from '../ui/maoGlifos';
import type { Questao, Resolucao } from '../dados/tipos';

beforeAll(() => {
  const orig = console.error;
  vi.spyOn(console, 'error').mockImplementation((...a: unknown[]) => { if (!String(a[0]).includes('useLayoutEffect')) orig(...a); });
});
const dom = (html: string) => new DOMParser().parseFromString(`<div>${html}</div>`, 'text/html');
const anima = (r: Resolucao, materia: string) => dom(renderToStaticMarkup(createElement(ResolucaoAnimada, { r, materia })));
/** onde a linha pode quebrar, como texto: "…|1 = …" (nível 1) e "…|2 + …" (nível 2) */
function marcaQuebras(s: string): string {
  const ts = tokeniza(s), q = quebrasConta(ts);
  return ts.map((t, i) => (q.has(i) ? `|${q.get(i)}` : t.v)).join('');
}

describe('N1: conta comprida quebra em lugar de conta, nunca fica cortada', () => {
  it('igualdade encadeada quebra antes de cada "=" (nível 1); "+", "−" e o "=" de uma igualdade só, se precisar (nível 2)', () => {
    expect(marcaQuebras('20 × 6 + 30 × 4 + 25 × 3 = 120 + 120 + 75 = 315'))
      .toBe('20 × 6|2+ 30 × 4|2+ 25 × 3|1= 120|2+ 120|2+ 75|1= 315');
    expect(marcaQuebras('4,1 × 10¹² × 5,20 = 21,32 × 10¹² = 2,132 × 10¹³ reais'))
      .toBe('4,1|2× 10¹²|2× 5,20|1= 21,32|2× 10¹²|1= 2,132|2× 10¹³ reais');
    // a incógnita sozinha não se separa do primeiro "=" (revisão de 21/11, N6)
    expect(marcaQuebras('C = 7 + 4 + 1')).toBe('C = 7|2+ 4|2+ 1');
  });
  it('nunca dentro de parênteses; depois de seta e de vírgula é nível 1', () => {
    expect(marcaQuebras('2 × (3 + 4 + 5) = 24')).toBe('2|2× (3 + 4 + 5)|2= 24');
    expect(marcaQuebras('a = 3, b = 4 → c = 5')).toBe('a = 3,|1b = 4|2→|1c = 5');
    expect(marcaQuebras('2 × (3 + 4 + 5) = 7 × 2 = 14')).toBe('2|2× (3 + 4 + 5)|1= 7|2× 2|1= 14');
  });
  it('desenhada: os trechos ficam em .ra-seg e cada pedaço sem quebra em .ra-u; o texto é o dos dados', () => {
    const conta = '20 × 6 + 30 × 4 + 25 × 3 = 120 + 120 + 75 = 315';
    const d = anima({ passos: [{ faz: 'P, Q, R', conta, porque: '' }] } as unknown as Resolucao, 'mat');
    const linha = d.querySelector('.ra-linha.conta')!;
    expect(linha.querySelectorAll('.ra-seg').length).toBe(3);
    expect([...linha.querySelectorAll('.ra-u')].map((u) => u.textContent)).toEqual(['20 × 6', '+ 30 × 4', '+ 25 × 3', '= 120', '+ 120', '+ 75', '= 315']);
    const c = linha.cloneNode(true) as HTMLElement;
    c.querySelectorAll('[aria-hidden="true"]').forEach((x) => x.remove());
    expect(c.textContent).toBe(conta);
  });
});

describe('N3: a resolução em texto não mostra o separador " | "', () => {
  it('cada item do passo vira uma linha', () => {
    const q = { id: 'x', escola: 'Fuvest', ano: '2024', n: 1, gab: 'B', modulo: 'P01', sub: 'P01.1', conceito: '', url: '#', origem: 'prova' } as unknown as Questao;
    const r = { resposta: 'B', passos: [{ faz: 'Compare', conta: 'B: may (pode) | A: would (condicional) | C: will (futuro)', porque: 'Só B.' }] } as unknown as Resolucao;
    const html = renderToStaticMarkup(createElement(ResolucaoView, { q, r, marcada: 'A', materia: 'ing' }));
    expect(html).not.toContain(' | ');
    expect([...dom(html).querySelectorAll('.cor-itens li')].map((li) => li.textContent)).toEqual(['B: may (pode)', 'A: would (condicional)', 'C: will (futuro)']);
  });
  it('itens paralelos com ";" também descem um por linha (Química, "solução 1: …; solução 2: …")', () => {
    expect(itensDaConta('solução 1: pOH 1, logo [OH⁻] = 0,1 mol/L; solução 2: pOH 2, logo [OH⁻] = 0,01 mol/L', 'qui')).toHaveLength(2);
    // frase comum com ";" fica inteira
    expect(itensDaConta('o ácido doa próton; a base recebe', 'qui')).toHaveLength(1);
  });
});

describe('N4: a linha do quadro que é a conta do passo escrita de outro jeito não se repete', () => {
  it('"1,6 × V(sub) = 480" é a mesma conta de "1,6 × V(submerso) = 480" (fis P36e40b31)', () => {
    expect(quadroEquivale('1,6 × V(submerso) = 480', '1,6 × V(sub) = 480')).toBe(true);
    expect(quadroEquivale('1,6 × V(submerso) = 480', '1,6 × V(sub) = 300')).toBe(false);
    const rt = montaRoteiro({
      passos: [{ faz: 'Confira se flutua', conta: '480/600 = 0,8 g/cm³ < 1,6 g/cm³', porque: '' }, { faz: 'Iguale as massas', conta: '1,6 × V(submerso) = 480', porque: 'Empuxo = peso; g cancela.' }],
      quadro: [{ linha: '0,8 g/cm³ < 1,6 g/cm³', nota: 'flutua' }, { linha: '1,6 × V(sub) = 480', nota: 'empuxo = peso' }],
    } as unknown as Resolucao, 'fis');
    expect(rt.linhas.filter((l) => l.doQuadro)).toHaveLength(0);
    expect(rt.linhas[1].nota).toBe('empuxo = peso');
  });
  it('"log₂₇₄₄ 2 + log₂₇₄₄ 7" é a mesma conta de "log de 2 + log de 7 (base 2744)" (mat Pa9eb4212)', () => {
    const rt = montaRoteiro({
      passos: [{ faz: 'Julgue a IV', conta: '2744 = 14³ → 1/x + 1/y = log de 2 + log de 7 (base 2744) = log de 14 (base 2744) = 1/3', porque: '' }],
      quadro: [{ linha: '2744 = 14³', nota: 'raiz cúbica' }, { linha: '1/x + 1/y = log₂₇₄₄ 2 + log₂₇₄₄ 7', nota: 'inverte os expoentes' },
        { linha: '1/x + 1/y = log₂₇₄₄ 14', nota: 'soma de logs' }, { linha: '1/x + 1/y = 1/3', nota: '14 = 2744^(1/3)' }],
    } as unknown as Resolucao, 'mat');
    expect(rt.linhas).toHaveLength(1);
    expect(rt.linhas[0].nota).toBe('raiz cúbica; inverte os expoentes; soma de logs; 14 = 2744^(1/3)');
    // o marca-texto fica no resultado da conta
    expect(rt.linhas[0].texto.slice(...rt.linhas[0].marca!)).toBe('1/3');
  });
  it('linha do quadro que não está na conta vai para o passo que tem os números dela', () => {
    const rt = montaRoteiro({
      passos: [{ faz: 'Julgue I', conta: 'N ligado a 3 C → amina terciária', porque: '' }, { faz: 'Julgue II', conta: 'O entre dois C → éter', porque: '' },
        { faz: 'Conte os carbonos', conta: '7 (benzonitrila) + 4 (piridazinona) + 1 (CH2) → 12', porque: '' }],
      quadro: [{ linha: 'C = 7 + 4 + 1 = 12', nota: 'pedaço por pedaço' }],
    } as unknown as Resolucao, 'qui');
    expect(rt.passos[2].linhas.map((l) => rt.linhas[l].texto)).toContain('C = 7 + 4 + 1 = 12');
  });
});

describe('N5: o que o passo cancela é riscado', () => {
  it('lê o termo dito antes ou depois do verbo', () => {
    expect(termosDitos('Empuxo = peso; g cancela.')).toEqual(['g']);
    expect(termosDitos('corte o 18 de cima e de baixo')).toEqual(['18']);
    expect(termosDitos('o m se cancela dos dois lados')).toEqual(['m']);
    expect(termosDitos('o que se cancela')).toEqual([]);
  });
  it('"g cancela" com a conta já sem o g: a igualdade com o g dos dois lados aparece antes, os dois g riscados', () => {
    const r = { passos: [{ faz: 'Confira', conta: '480/600 = 0,8 g/cm³ < 1,6 g/cm³', porque: '' }, { faz: 'Iguale as massas', conta: '1,6 × V(submerso) = 480', porque: 'Empuxo = peso; g cancela.' }] } as unknown as Resolucao;
    const rt = montaRoteiro(r, 'fis');
    // o g da unidade (g/cm³) nunca é riscado
    expect(rt.linhas[1].planos.flatMap((p) => p.riscos)).toHaveLength(0);
    const pre = rt.linhas[1].pre!;
    expect(pre.linhas[0].texto).toBe('1,6 × V(submerso) × g = 480 × g');
    expect(pre.linhas[0].riscos.map(([a, b]) => pre.linhas[0].texto.slice(a, b))).toEqual(['g', 'g']);
    const d = anima(r, 'fis');
    const el = d.querySelector('[data-pre="1"]')!;
    expect(el.getAttribute('aria-hidden')).toBe('true');
    expect(el.querySelectorAll('.ra-corte .ra-risco')).toHaveLength(2);
  });
  it('"Somar e cancelar" (Q07): as três equações aparecem somadas, com CO₂, H₂O e O₂ riscados dos dois lados', () => {
    const r = { passos: [
      { faz: 'Multiplicar a 1ª equação por 2.', conta: '2C + 2O_{2} → 2CO_{2} ΔH = 2(−394) = −788 kJ', porque: '' },
      { faz: 'Multiplicar a 2ª por 2.', conta: '2H_{2} + O_{2} → 2H_{2}O(l) ΔH = 2(−286) = −572 kJ', porque: '' },
      { faz: 'Inverter a 3ª.', conta: '2CO_{2} + 2H_{2}O(l) → C_{2}H_{4} + 3O_{2} ΔH = +1411 kJ', porque: '' },
      { faz: 'Somar e cancelar: CO₂, H₂O e O₂ aparecem dos dois lados.', conta: '2C + 2H_{2} → C_{2}H_{4}', porque: '' },
    ] } as unknown as Resolucao;
    const pre = montaRoteiro(r, 'qui').linhas[3].pre!;
    expect(pre.soma).toBe(true);
    expect(pre.linhas.map((x) => x.texto)).toEqual(['2C + 2O_{2} → 2CO_{2}', '2H_{2} + O_{2} → 2H_{2}O(l)', '2CO_{2} + 2H_{2}O(l) → C_{2}H_{4} + 3O_{2}']);
    expect(pre.linhas.map((x) => x.riscos.map(([a, b]) => x.texto.slice(a, b)))).toEqual([['2O_{2}', '2CO_{2}'], ['O_{2}', '2H_{2}O(l)'], ['2CO_{2}', '2H_{2}O(l)', '3O_{2}']]);
    const d = anima(r, 'qui');
    expect(d.querySelectorAll('[data-pre="3"] .ra-risco')).toHaveLength(7);
    expect(d.querySelector('[data-pre="3"] .ra-soma-traco')).not.toBeNull();
  });
});

describe('N6: palavra de texto corrido na conta sai na letra do texto', () => {
  it('as palavras e os conectivos encostados nelas; a letra da alternativa junto', () => {
    const s = 'picos em ≈ 21,0 s e ≈ 29,3 s, com 6 intervalos entre eles → T ≈ (29,3 − 21,0)/6 ≈ 1,4 s';
    const ts = tokeniza(s), p = tokensProsa(ts);
    const pal = [...p].map((i) => ts[i].v);
    expect(pal).toEqual(expect.arrayContaining(['picos', 'em', 'com', 'intervalos', 'entre', 'eles']));
    expect(pal).not.toContain('s');
    expect(pal).not.toContain('T');
    const t2 = tokeniza('(540 − 315)/45 = 225/45 = 5 → alternativa C');
    expect([...tokensProsa(t2)].map((i) => t2[i].v)).toEqual(['alternativa', 'C']);
    const t4 = tokeniza('1,6 × V(submerso) = 480');
    expect(tokensProsa(t4).size).toBe(0);
    const t3 = tokeniza('1/x + 1/y = log de 2 + log de 7 (base 2744)');
    expect([...tokensProsa(t3)].map((i) => t3[i].v).sort()).toEqual(['base', 'de', 'de', 'log', 'log']);
  });
  it('desenhada: "alternativa C" em .pal (Familjen) e os números à mão', () => {
    const d = anima({ passos: [{ faz: 'Turma S', conta: '(540 − 315)/45 = 225/45 = 5 → alternativa C', porque: '' }] } as unknown as Resolucao, 'mat');
    expect([...d.querySelectorAll('.ra-t.pal')].map((e) => e.textContent)).toEqual(['alternativa', 'C']);
  });
});

describe('N9, N12 e item 22: notação, ordinal e aspas', () => {
  it('índice do genótipo em <sup> de letra (maior, afastado do X)', () => {
    const html = renderToStaticMarkup(createElement('span', null, textoMao('XᴬXᵃ')));
    expect(dom(html).querySelectorAll('sup.nt-letra')).toHaveLength(2);
  });
  it('a barra dentro do expoente escrito não vira fração ("2744^(1/3)")', () => {
    expect(partesFracao('14 = 2744^(1/3)').some((p) => p.t === 'frac')).toBe(false);
  });
  it('ordinal com sinal de grau vira "º"; ângulo e temperatura ficam', () => {
    expect(ordinais('5° período')).toBe('5º período');
    expect(ordinais('1° lombriga, 2° ameba')).toBe('1º lombriga, 2º ameba');
    expect(ordinais('ângulo de 30° com a horizontal')).toBe('ângulo de 30° com a horizontal');
    expect(ordinais('a 25 °C')).toBe('a 25 °C');
    expect(ordinais('inclinado 30° com a horizontal')).toBe('inclinado 30° com a horizontal');
  });
  it('aspas simples curvas também dentro de aspas duplas; derivada e minuto ficam', () => {
    expect(aspasCurvas('A: “morte de \'uns olhos\'” | B')).toBe('A: “morte de ‘uns olhos’” | B');
    expect(aspasCurvas('"são citadas \'lombriga\' e \'ameba\'"')).toBe('“são citadas ‘lombriga’ e ‘ameba’”');
    expect(aspasCurvas("f'(x) = 2x e 30' de prova")).toBe("f'(x) = 2x e 30' de prova");
    // o texto exibido tem o mesmo tamanho do texto dos dados (as posições do marca-texto continuam certas)
    for (const s of ['"a" e \'b\'', '5° período', "f'(x)"]) expect(textoCorrecao(s).length).toBe(s.length);
  });
});

describe('item 10: fórmulas da Teoria com fração empilhada', () => {
  it('somatório, grupo sobre palavra e "a/b" dentro de chaves', () => {
    const frac = (s: string) => partesFracao(s).filter((p) => p.t === 'frac').map((p) => (p.t === 'frac' ? [p.n, p.d] : []));
    expect(frac('x̄ = Σ(xᵢ · pᵢ) / Σpᵢ')).toEqual([['Σ(xᵢ · pᵢ)', 'Σpᵢ']]);
    expect(frac('variação = (novo − antigo) / antigo')).toEqual([['novo − antigo', 'antigo']]);
    expect(frac('ℚ = {a/b; a, b ∈ ℤ, b ≠ 0}')).toEqual([['a', 'b']]);
    // verso e palavra entre parênteses continuam na linha
    expect(frac('enganos, / tu')).toEqual([]);
    expect(frac('(sim) / não')).toEqual([]);
  });
});

describe('N13: prosa e versos do mesmo parágrafo saem em blocos separados', () => {
  it('o bloco de versos em negrito vira bloco próprio; termo em negrito no meio da frase não', () => {
    const t = 'Leia o trecho da música.\n**Procurando bem\nTodo mundo tem pereba**\nNeste trecho, são citadas';
    expect(blocosDoParagrafo(t)).toEqual(['Leia o trecho da música.', '**Procurando bem\nTodo mundo tem pereba**', 'Neste trecho, são citadas']);
    expect(blocosDoParagrafo('O termo **sublinhado** na frase\ncontinua aqui')).toHaveLength(1);
  });
});

describe('N11: a fonte não promete o caderno quando o link é a página inicial; sem domínio técnico na tela', () => {
  it('página inicial e arquivo hospedado', () => {
    expect(origemDoLink('https://www.uea.edu.br/').rotulo).toBe('Site da instituição (sem link direto para o caderno)');
    expect(origemDoLink('https://vestibular.uemg.br').rotulo).toBe('Site da instituição (sem link direto para o caderno)');
    expect(origemDoLink('https://www.fuvest.br/wp-content/uploads/prova.pdf').rotulo).toBe('Caderno da prova oficial');
    const h = origemDoLink('https://bkpsitecpsnew.blob.core.windows.net/x/prova.pdf');
    expect(h.rotulo).not.toContain('blob.core');
    expect(h.nome).toBe('bkpsitecpsnew.blob.core.windows.net');
  });
});

describe('revisão de 21/11, N6: a quebra não separa a incógnita do "≈" ou do "="', () => {
  it('quebra depois da seta, e a incógnita fica com o primeiro sinal de igualdade do trecho', () => {
    expect(marcaQuebras('picos em ≈ 21,0 s e ≈ 29,3 s, com 6 intervalos entre eles → T ≈ (29,3 − 21,0)/6 ≈ 1,4 s'))
      .toMatch(/→\|1T ≈ \(29,3 − 21,0\)\/6\|1≈ 1,4 s$/);
    expect(marcaQuebras('L = 10 × 1,4²/(4 × 3²) → L = 19,6/36 ≈ 0,54 m')).toBe('L = 10|2× 1,4²/(4 × 3²)|2→|1L = 19,6/36|1≈ 0,54 m');
    // com mais de um termo antes do "=", continua podendo quebrar ali
    expect(marcaQuebras('2 × (3 + 4 + 5) = 7 × 2 = 14')).toBe('2|2× (3 + 4 + 5)|1= 7|2× 2|1= 14');
  });
});

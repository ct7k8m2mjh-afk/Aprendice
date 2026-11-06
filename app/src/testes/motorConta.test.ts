// Motor da resolução animada (comando 20): o estado final de cada passo é o texto dos dados, sempre; as transições
// reconhecidas movem os termos certos; o que não é reconhecido fica com a transição padrão (linha escrita).
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { avalia, contaTransicoes, junta, montaRoteiro, tokeniza, type Roteiro } from '../logica/motorConta';
import { ResolucaoAnimada } from '../ui/ResolucaoAnimada';
import { ResolucaoView } from '../ui/Resolucao';
import type { Questao, Resolucao } from '../dados/tipos';

// desenho no servidor (renderToStaticMarkup): o aviso do React sobre useLayoutEffect não interessa aqui
beforeAll(() => {
  const orig = console.error;
  vi.spyOn(console, 'error').mockImplementation((...a: unknown[]) => { if (!String(a[0]).includes('useLayoutEffect')) orig(...a); });
});
const DEST = join(__dirname, '..', '..', 'public', 'conteudo');
const tem = existsSync(join(DEST, 'mat', 'res'));
const ler = (p: string) => JSON.parse(readFileSync(p, 'utf-8'));

type Item = { id: string; m: string; r: Resolucao };
function todas(): Item[] {
  const out: Item[] = [];
  for (const m of ['mat', 'qui', 'bio', 'por', 'fis', 'his', 'geo', 'ing', 'fs']) {
    const dir = join(DEST, m, 'res');
    if (!existsSync(dir)) continue;
    for (const f of readdirSync(dir)) for (const [id, r] of Object.entries<Resolucao>(ler(join(dir, f)))) out.push({ id, m, r });
  }
  const pv = join(DEST, 'provas');
  if (existsSync(pv)) for (const d of readdirSync(pv)) {
    const f = join(pv, d, 'prova.json');
    if (!existsSync(f)) continue;
    for (const q of ler(f).questoes || []) if (q.res) out.push({ id: `${d}#${q.n}`, m: q.materia, r: q.res });
  }
  return out;
}
/** as linhas que os dados mandam escrever, na ordem */
function linhasDosDados(r: Resolucao): string[] {
  if (r.quadro && r.quadro.length) return r.quadro.map((q) => q.linha).filter(Boolean);
  return (r.passos || []).flatMap((p) => (p.conta || '').split('\n').filter((x) => x.trim()));
}
const texto = (rt: Roteiro, l: number, i: number, p?: 'n' | 'd') => { const t = rt.linhas[l].toks[i]; return p ? (p === 'n' ? t.n : t.d) : t.v; };
/** descrição curta dos termos que se movem: "43↷(+→−)" */
function movimentos(s: string, materia = 'mat') {
  const rt = montaRoteiro({ passos: [{ faz: '', conta: s, porque: '' }] }, materia);
  return rt.linhas[0].planos.map((p) => ({
    tipo: p.tipo,
    cruza: Object.entries(p.entradas).filter(([, e]) => e.atravessa).map(([k]) => { const [i, pp] = k.split(':'); return texto(rt, 0, +i, pp as 'n' | 'd'); }),
    riscos: p.riscos.map((x) => texto(rt, x.l, x.i, x.p)),
    trocas: Object.values(p.entradas).filter((e) => e.antes).map((e) => e.antes),
  }));
}

describe('tokens: a linha é sempre o texto dos dados', () => {
  it('juntar os termos devolve a linha, sem tirar nem pôr', () => {
    for (const s of ['43 + (n − 1)·r = 183', 'x = 140/35', '1 000 × 1,25 = 1 250 cm³', 'C(81,2) = (81 × 80) ÷ 2 = 6 480 ÷ 2 = 3 240', '207/82 Pb → 4/2 α + 203/80 Hg', '3ℓ ÷ 4 = 6 → 3ℓ = 24'])
      expect(junta(tokeniza(s))).toBe(s);
  });
  it('fração vira um termo empilhado; coeficiente e letra se separam', () => {
    const t = tokeniza('a = 224/7').filter((x) => x.k !== 'esp');
    expect(t.map((x) => x.k)).toEqual(['var', 'rel', 'frac']);
    expect([t[2].n, t[2].d]).toEqual(['224', '7']);
    const c = tokeniza('7a').map((x) => [x.v, !!x.cola]);
    expect(c).toEqual([['7', false], ['a', true]]);
  });
  it('avalia contas numéricas em português (vírgula decimal, milhar com espaço, expoente, raiz)', () => {
    expect(avalia(tokeniza('6 480 ÷ 2'))).toBe(3240);
    expect(avalia(tokeniza('19,00 − 4,60'))).toBeCloseTo(14.4);
    expect(avalia(tokeniza('√(9 + 16)'))).toBe(5);
    expect(avalia(tokeniza('(3 − 0)² + (0 − 4)²'))).toBe(25);
    expect(avalia(tokeniza('2 × x'))).toBeNull();
  });
});

describe('transformações que o motor anima', () => {
  it('o termo que atravessa o "=" troca de sinal', () => {
    const [p] = movimentos('2x + 6 = 20 → 2x = 20 − 6');
    expect(p.tipo).toBe('troca-lado');
    expect(p.cruza).toContain('6');
    expect(p.trocas).toEqual(['+']);
  });
  it('o número que multiplica vai para o outro lado dividindo', () => {
    // "224 ÷ 7" é fração empilhada: o 7 desce para o denominador
    const [p] = movimentos('7a = 224 → a = 224 ÷ 7');
    expect(p.tipo).toBe('divide');
    expect(p.cruza).toEqual(['7']);
    // para o denominador de uma fração empilhada
    const [f] = movimentos('7a = 224 → a = 224/7');
    expect(f.tipo).toBe('divide');
    expect(f.cruza).toEqual(['7']);
  });
  it('o que divide vai multiplicando', () => {
    const [p] = movimentos('x ÷ 10 = 30 ÷ 50 → x = 10 × 30 ÷ 50');
    expect(p.tipo).toBe('multiplica');
    expect(p.cruza).toEqual(['10']);
  });
  it('multiplicação cruzada: os números da fração viajam até onde são multiplicados', () => {
    const [p] = movimentos('a/b = c/d → a × d = b × c');
    expect(p.tipo).toBe('cruzada');
    expect(p.cruza.sort()).toEqual(['b', 'd', '×']);
    const [q] = movimentos('20 ÷ (30 + N) = 1 ÷ 3 → 3 × 20 = 1 × (30 + N)');
    expect(q.tipo).toBe('cruzada');
  });
  it('o que se cancela é riscado', () => {
    const [p] = movimentos('X × 9y² = N × y² → X = N ÷ 9');
    expect(p.riscos).toEqual(['y²', 'y²']);
    const [q] = movimentos('x + 5 − 5 = 12 → x = 12');
    expect(q.tipo).toBe('cancela');
    expect(q.riscos).toEqual(['+', '5', '−', '5']);
  });
  it('o resultado novo aparece no lugar da conta (só quando a conta confere)', () => {
    const r = movimentos('d = √(9 + 16) = √25 = 5');
    expect(r.map((x) => x.tipo)).toEqual(['resultado', 'resultado']);
    expect(movimentos('8 − 4 = 4')[0].tipo).toBe('resultado');
    // conta que não confere: transição padrão (nada se move, a linha é escrita)
    expect(movimentos('8 − 4 = 5')).toEqual([]);
    // precedência: 10 − 3 + 2 não é 10 − 5
    expect(movimentos('10 − 3 + 2 = 10 − 5')).toEqual([]);
  });
  it('a passagem de uma linha para a seguinte também anima (quadro de São Camilo 2024/2, Q36)', () => {
    const rt = montaRoteiro({ quadro: [{ linha: '43 + (n − 1)·r = 183' }, { linha: '(n − 1)·r = 183 − 43' }, { linha: '(n − 1)·r = 140' }] }, 'mat');
    expect(rt.linhas[1].planos[0].tipo).toBe('troca-lado');
    expect(rt.linhas[2].planos[0].tipo).toBe('resultado');
  });
  it('sem transformação reconhecida, nada se move', () => {
    expect(movimentos('x² = 25 → x = 5')).toEqual([]);
    expect(movimentos('|x| = 3 → x = 3 ou x = −3')).toEqual([]);
  });
  it('texto (Biologia) não vira conta: entra com o termo-chave marcado', () => {
    const rt = montaRoteiro({ passos: [{ faz: 'Escolha o fator', conta: 'excesso de nutrientes → eutrofização', porque: '' }] }, 'bio');
    expect(rt.linhas[0].conta).toBe(false);
    const [a, b] = rt.linhas[0].marca!;
    expect(rt.linhas[0].texto.slice(a, b)).toBe('eutrofização');
  });
});

describe('rodada 2 da auditoria (comando 20)', () => {
  const quadro = (ls: string[], m = 'fis') => montaRoteiro({ quadro: ls.map((linha) => ({ linha })) }, m);
  it('multiplicação cruzada com as frações escritas "a / b" e os lados trocados (São Camilo 2024/2, Q34)', () => {
    const rt = quadro(['7,0 mm / f = 7 / 800', '7 · f = 7,0 · 800', 'f = 800 mm']);
    expect(rt.linhas[1].planos[0].tipo).toBe('cruzada');
    expect(rt.linhas[2].planos.length).toBe(1);
  });
  it('"corte o 18 de cima e de baixo": os dois 18 são riscados (Q40)', () => {
    const rt = quadro(['média = 18·(15 + 16 + 17) ÷ (18·3)', 'média = (15 + 16 + 17) ÷ 3'], 'mat');
    const p = rt.linhas[1].planos[0];
    expect(p.tipo).toBe('cancela');
    expect(p.riscos.map((r) => (r.p ? (r.p === 'n' ? rt.linhas[0].toks[r.i].nt! : rt.linhas[0].toks[r.i].dt!)[r.s!].v : rt.linhas[0].toks[r.i].v)).filter((v) => v !== '·')).toEqual(['18', '18']);
  });
  it('mesmo nome dos dois lados: a conta da direita é feita ("ΔH = 20 − 5" → "ΔH = +15 kcal/mol", Q28)', () => {
    const rt = quadro(['ΔH = 20 − 5', 'ΔH = +15 kcal/mol'], 'qui');
    expect(rt.linhas[1].planos[0].tipo).toBe('resultado');
  });
  it('conta com o nome da quantidade ("36 dias ÷ 3 = 12 dias", "200 kg − 156 kg = 44 kg de CO2")', () => {
    expect(movimentos('36 dias ÷ 3 = 12 dias', 'qui')[0].tipo).toBe('resultado');
    expect(movimentos('200 kg − 156 kg = 44 kg de CO2', 'qui')[0].tipo).toBe('resultado');
  });
  it('destaque no termo inteiro, nunca dentro de outro (Q29 "4", Q37 "SQ", Q40 "÷ 3")', () => {
    const q29 = montaRoteiro({ quadro: [{ linha: '240 ÷ 60 = 4', destaque: '4' }] }, 'qui').linhas[0];
    expect(q29.texto.slice(...q29.marca!)).toBe('4');
    expect(q29.marca![0]).toBe(q29.texto.length - 1);
    const q37 = montaRoteiro({ quadro: [{ linha: 'Área(PQRS) = Área(SPQ) + Área(SQR)', destaque: 'SQ' }] }, 'mat').linhas[0];
    expect(q37.marca).toBeUndefined();
    const q40 = montaRoteiro({ quadro: [{ linha: 'média = 18·(15 + 16 + 17) ÷ (18·3)', destaque: '18·' }] }, 'mat').linhas[0];
    expect(q40.texto.slice(...q40.marca!)).toBe('18');
  });
  it('processo desenhado pelo mesmo motor: reação, fluxo, cadeia, pares, contraste e etapas', () => {
    const tipo = (s: string, m = 'bio') => montaRoteiro({ passos: [{ faz: '', conta: s, porque: '' }] }, m).linhas[0].diagrama?.tipo;
    expect(tipo('aminoácido + aminoácido → peptídeo + água', 'qui')).toBe('reacao');
    expect(tipo('inversa: C + D → A + B', 'qui')).toBe('reacao');
    expect(tipo('cápsula (2n) → meiose → esporos (n)')).toBe('fluxo');
    expect(tipo('HS–CH2–CH2–CH(NH2)–COOH', 'qui')).toBe('cadeia');
    expect(tipo('algas: 0  |  peixes, moluscos, pessoas: −')).toBe('pares');
    expect(tipo('genes ativados × genes inativados')).toBe('contraste');
    expect(tipo('O gene tinha íntrons e éxons. Os íntrons são retirados no processamento.')).toBe('etapas');
    // conta com "=" continua com o motor da conta; Português não ganha diagrama
    expect(tipo('n = 4,86 g ÷ 24,32 g/mol ≈ 0,2 mol', 'qui')).toBeUndefined();
    expect(tipo('autor → obra', 'por')).toBeUndefined();
  });
});

describe.skipIf(!tem)('todas as resoluções do site', () => {
  const itens = todas();
  it('o motor nunca produz uma linha diferente da linha final dos dados', () => {
    expect(itens.length).toBeGreaterThan(1000);
    for (const { id, m, r } of itens) {
      const rt = montaRoteiro(r, m);
      const esperado = linhasDosDados(r);
      expect(rt.linhas.map((l) => l.texto), id).toEqual(esperado);
      for (const L of rt.linhas) expect(junta(L.toks), id).toBe(L.texto);
      // cada termo que se move vem de um pedaço que existe e já foi escrito (linha de antes, ou antes na mesma linha)
      rt.linhas.forEach((L, l) => {
        for (const p of L.planos) {
          for (const [k, e] of Object.entries(p.entradas)) {
            const [i, pp] = k.split(':');
            expect(+i >= p.ini && +i < p.fim, id).toBe(true);
            expect(L.toks[+i], id).toBeTruthy();
            if (pp) expect(L.toks[+i].k, id).toBe('frac');
            for (const d of e.de) {
              expect(d.l < l || (d.l === l && d.i < p.ini), id).toBe(true);
              expect(rt.linhas[d.l].toks[d.i], id).toBeTruthy();
              if (d.p) expect(rt.linhas[d.l].toks[d.i].k, id).toBe('frac');
            }
          }
          for (const x of p.riscos) expect(x.l < l || (x.l === l && x.i < p.ini), id).toBe(true);
        }
      });
    }
  });
  it('desenhada, cada linha mostra exatamente o texto dos dados (estado final)', () => {
    const dp = new DOMParser();
    for (const { id, m, r } of itens) {
      const rt = montaRoteiro(r, m);
      if (!rt.passos.length) continue;
      const html = renderToStaticMarkup(createElement(ResolucaoAnimada, { r, materia: m }));
      const doc = dp.parseFromString(`<div>${html}</div>`, 'text/html');
      const ls = [...doc.querySelectorAll<HTMLElement>('[data-l]')];
      expect(ls.length, id).toBe(rt.linhas.length);
      // o que se lê (sem os desenhos aria-hidden: sinal à mão, número pequeno) é o texto dos dados
      ls.forEach((el) => {
        const c = el.cloneNode(true) as HTMLElement;
        c.querySelectorAll('[aria-hidden="true"]').forEach((x) => x.remove());
        expect(c.textContent, id).toBe(rt.linhas[Number(el.dataset.l)].texto);
      });
    }
  });
  it('cobertura: resoluções de Matemática com pelo menos uma transição animada', () => {
    const mat = itens.filter((x) => x.m === 'mat');
    let com = 0, comMov = 0;
    const tipos: Record<string, number> = {};
    for (const { r } of mat) {
      const c = contaTransicoes(montaRoteiro(r, 'mat'));
      if (Object.keys(c).length) com++;
      if (Object.keys(c).some((t) => t !== 'resultado')) comMov++;
      for (const [t, k] of Object.entries(c)) tipos[t] = (tipos[t] || 0) + (k || 0);
    }
    console.log(`[motor] Matemática: ${com} de ${mat.length} resoluções com transição animada; ${comMov} com termo trocando de lado, dividindo, cruzando ou cancelando`, tipos);
    expect(com / mat.length).toBeGreaterThan(0.7);
  });
  it('cobertura: Biologia, Química e Física com processo ou conta animada', () => {
    for (const m of ['bio', 'qui', 'fis']) {
      const xs = itens.filter((x) => x.m === m);
      if (!xs.length) continue;
      let conta = 0, processo = 0, alguma = 0;
      for (const { r } of xs) {
        const rt = montaRoteiro(r, m);
        const c = rt.linhas.some((l) => l.planos.length), p = rt.linhas.some((l) => l.diagrama);
        if (c) conta++; if (p) processo++; if (c || p) alguma++;
      }
      console.log(`[motor] ${m}: ${alguma} de ${xs.length} com animação (${conta} com conta em movimento, ${processo} com processo desenhado)`);
      expect(alguma / xs.length).toBeGreaterThan(0.6);
    }
  });
});

describe.skipIf(!tem)('correção em 4 blocos (São Camilo 2024/2)', () => {
  const prova = ler(join(DEST, 'provas', 'saocamilo-2024-2', 'prova.json'));
  const q = (n: number) => prova.questoes.find((x: { n: number }) => x.n === n);
  const questao = (x: { n: number; gab: string; id: string; res: Resolucao }, materia: string) =>
    ({ id: x.id, escola: 'São Camilo', ano: '2024/2', n: x.n, gab: x.gab, modulo: materia === 'mat' ? 'M01' : materia === 'qui' ? 'Q01' : 'B01', sub: '', conceito: '', url: '#', origem: 'prova' } as unknown as Questao);
  const titulos = (html: string) => [...new DOMParser().parseFromString(html, 'text/html').querySelectorAll('.cor-tit, .cor-outras summary')].map((e) => e.textContent);
  it('errou: Por que eu errei → Resposta correta → Resolução animada → Por que as outras estão erradas', () => {
    for (const [n, m] of [[36, 'mat'], [27, 'qui'], [21, 'bio']] as const) {
      const x = q(n);
      const errada = (['A', 'B', 'C', 'D', 'E'] as const).find((l) => l !== x.gab && x.res.erradas[l])!;
      const html = renderToStaticMarkup(createElement(ResolucaoView, { q: questao(x, m), r: x.res, marcada: errada }));
      expect(titulos(html)).toEqual(['Por que eu errei', 'Resposta correta', 'Resolução animada', 'Por que as outras estão erradas']);
      expect(html).toContain(x.res.armadilha.slice(0, 20).replace(/"/g, '&quot;'));
      // os outros campos não ocupam a correção
      for (const campo of [x.res.checagem, x.res.essencial?.chave, x.res.antes?.texto]) if (campo) expect(html).not.toContain(campo.slice(0, 30));
      // "Por que as outras" começa fechado
      expect(html).toMatch(/<details class="cor-outras">/);
    }
  });
  it('acertou: sem "Por que eu errei"', () => {
    const x = q(36);
    const html = renderToStaticMarkup(createElement(ResolucaoView, { q: questao(x, 'mat'), r: x.res, marcada: x.gab }));
    expect(titulos(html)).toEqual(['Resposta correta', 'Resolução animada', 'Por que as outras estão erradas']);
  });
  it('sem resolução: o aviso de sempre', () => {
    const x = q(36);
    const html = renderToStaticMarkup(createElement(ResolucaoView, { q: questao(x, 'mat'), r: null, marcada: 'B' }));
    expect(html).toContain('está em revisão');
    expect(titulos(html)).toEqual([]);
  });
});

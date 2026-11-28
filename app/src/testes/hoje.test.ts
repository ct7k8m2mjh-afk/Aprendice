// Comando 24, fase 3 do Método Aprendice de Revisão: tela Hoje (prova-alvo × fraqueza × risco de esquecer) e
// Escudo TRI (fáceis erradas primeiro para quem tem o ENEM como prova-alvo).
import { describe, expect, it } from 'vitest';
import {
  escudoTri, fraquezaQuestao, minutosDe, pesosDasProvas, planoHoje, riscoQuestao, segPorQuestao, MAX_POR_CONTEUDO,
  SEG_PADRAO, type MateriaHoje,
} from '../logica/hoje';
import { memoriaDe } from '../logica/revisao';
import { catalogoDaQuestao } from '../dados/provas';
import { estadoMateriaVazio, type EstadoMateria, type Tentativa } from '../estado/tipos';
import type { MateriaId, Questao } from '../dados/tipos';

const t0 = new Date(2026, 10, 1, 10).getTime();
const dia = (n: number) => { const d = new Date(t0); d.setDate(d.getDate() + n); return d.getTime(); };
const tent = (ts: number, ok: boolean, extra: Partial<Tentativa> = {}): Tentativa => ({ letra: 'A', ok, ts, seg: 120, ...extra });

let seq = 0;
function q(sub: string, escola: string, dif = 5, extra: Partial<Questao> = {}): Questao {
  seq++;
  return {
    id: `${sub}-${escola}-${seq}`, escola, ano: '2024', n: String(seq), banca: '', fase: '', enun: '', alts: {}, gab: 'A',
    modulo: sub.split('.')[0], sub, dif, degrau: 0, conceito: '', pista: '', url: '', origem: 'prova', figura: false,
    rg: escola === 'ENEM' ? 'nac' : 'sp', ...extra,
  };
}
const varias = (n: number, sub: string, escola: string, dif = 5) => [...Array(n)].map(() => q(sub, escola, dif));

function materia(id: MateriaId, banco: Questao[]): MateriaHoje {
  const subs = [...new Set(banco.map((x) => x.sub))];
  const mods = [...new Set(subs.map((s) => s.split('.')[0]))];
  return { id, banco, conteudo: { modulos: mods.map((m) => ({ id: m, nome: 'tema ' + m, subs: subs.filter((s) => s.startsWith(m + '.')).map((s) => ({ id: s, nome: 'conteúdo ' + s })) })) } };
}
function estado(hist: Record<string, Tentativa[]>): EstadoMateria {
  const s = estadoMateriaVazio();
  for (const [id, t] of Object.entries(hist)) s.q[id] = { tent: t };
  return s;
}

describe('de que prova é cada questão', () => {
  it('pelo nome da escola, pelo id da prova completa e pela sigla do catálogo', () => {
    expect(catalogoDaQuestao({ escola: 'ENEM' })).toBe('enem');
    expect(catalogoDaQuestao({ escola: 'Fuvest' })).toBe('fuvest');
    expect(catalogoDaQuestao({ escola: 'Unicamp' })).toBe('unicamp');
    expect(catalogoDaQuestao({ escola: 'Santa Casa' })).toBe('santacasa');
    expect(catalogoDaQuestao({ escola: 'Qualquer', prova: 'ufpr-2024' })).toBe('ufpr');
    expect(catalogoDaQuestao({ escola: 'Lista sem prova' })).toBeNull();
  });
});

describe('peso do conteúdo nas provas-alvo (frequência no banco por instituição)', () => {
  const banco = [...varias(20, 'M01.1', 'ENEM'), ...varias(10, 'M02.1', 'ENEM'), ...varias(5, 'M01.1', 'Fuvest'), ...varias(25, 'M03.1', 'Fuvest')];
  const mats = [materia('mat', banco)];
  it('fatia das questões da prova-alvo que são do conteúdo', () => {
    const p = pesosDasProvas(mats, ['enem']);
    expect(p.provas).toEqual(['enem']);
    expect(p.fatia.get('mat:M01.1')).toBeCloseTo(20 / 30);
    expect(p.fatia.get('mat:M02.1')).toBeCloseTo(10 / 30);
    expect(p.fatia.get('mat:M03.1')).toBeUndefined();
  });
  it('várias provas-alvo: média das fatias, cada prova pesa igual', () => {
    const p = pesosDasProvas(mats, ['enem', 'fuvest']);
    expect(p.fatia.get('mat:M01.1')).toBeCloseTo((20 / 30 + 5 / 30) / 2);
    expect(p.fatia.get('mat:M03.1')).toBeCloseTo(25 / 30 / 2);
    expect(p.max).toBeCloseTo(p.fatia.get('mat:M01.1')!);
  });
  it('prova-alvo sem questões no banco não entra; sem nenhuma, vale o banco inteiro da região', () => {
    const p = pesosDasProvas(mats, ['ufpr']);
    expect(p.provas).toEqual([]);
    expect(p.fatia.get('mat:M03.1')).toBeCloseTo(25 / 60);
    const sp = pesosDasProvas(mats, [], new Set(['sp']));
    expect(sp.fatia.get('mat:M02.1')).toBeUndefined(); // só ENEM, fora de São Paulo
    expect(sp.fatia.get('mat:M03.1')).toBeCloseTo(25 / 30);
  });
});

describe('fraqueza e risco de esquecer de uma questão', () => {
  it('errou com certeza é a fraqueza máxima; domina é zero', () => {
    const errou = memoriaDe({ tent: [tent(t0, false, { conf: 'certeza' })] })!;
    expect(fraquezaQuestao(errou, dia(1))).toBe(1);
    const domina = memoriaDe({ tent: [tent(t0, false), tent(dia(1), true), tent(dia(4), true), tent(dia(11), true)] })!;
    expect(fraquezaQuestao(domina, dia(12))).toBe(0);
  });
  it('a lembrança cai com o tempo: o risco cresce', () => {
    const m = memoriaDe({ tent: [tent(t0, true)] })!;
    expect(riscoQuestao(m, dia(1))).toBeLessThan(riscoQuestao(m, dia(20)));
    expect(riscoQuestao(memoriaDe({ tent: [tent(t0, false)] })!, dia(1))).toBe(1);
  });
});

describe('tela Hoje: a ordem do dia', () => {
  // M01.1 pesa muito no ENEM; M02.1 pesa pouco; M03.1 pesa muito e o aluno domina; M04.1 pesa muito e é novo
  const A = varias(12, 'M01.1', 'ENEM', 6), B = varias(3, 'M02.1', 'ENEM', 6), C = varias(12, 'M03.1', 'ENEM', 6), D = varias(12, 'M04.1', 'ENEM', 6);
  const mats = [materia('mat', [...A, ...B, ...C, ...D])];
  const s = estado({
    [A[0].id]: [tent(dia(-2), false, { conf: 'certeza' })],
    [A[1].id]: [tent(dia(-2), false)],
    [B[0].id]: [tent(dia(-2), false)],
    [B[1].id]: [tent(dia(-2), false)],
    // domina: 3 acertos espaçados, o último ontem
    ...Object.fromEntries(C.slice(0, 3).map((x) => [x.id, [tent(dia(-12), false), tent(dia(-11), true), tent(dia(-8), true), tent(dia(-1), true)]])),
  });
  const plano = planoHoje(mats, { mat: s }, { provasAlvo: ['enem'], agora: t0 });
  const ordem = plano.itens.map((x) => x.sub);

  it('o conteúdo pesado com erro (com certeza) vem primeiro', () => {
    expect(ordem[0]).toBe('M01.1');
    expect(plano.itens[0].tipo).toBe('revisar');
    expect(plano.itens[0].certeza).toBe(1);
    expect(plano.itens[0].ids[0]).toBe(A[0].id); // o erro com certeza abre a lista
  });
  it('conteúdo pesado e novo passa à frente de revisão leve; o que o aluno domina fica de fora', () => {
    expect(ordem.indexOf('M04.1')).toBeGreaterThan(ordem.indexOf('M01.1'));
    expect(ordem.indexOf('M04.1')).toBeLessThan(ordem.indexOf('M02.1'));
    expect(plano.itens.find((x) => x.sub === 'M04.1')!.tipo).toBe('novo');
    // C: 3 dominadas não voltam; as 9 nunca feitas também não, porque ali o aluno não mostra fraqueza
    expect(ordem).not.toContain('M03.1');
  });
  it('com o mesmo erro, o conteúdo que cai mais vem antes', () => {
    const a = plano.itens.find((x) => x.sub === 'M01.1')!, b = plano.itens.find((x) => x.sub === 'M02.1')!;
    expect(a.peso).toBeGreaterThan(b.peso);
    expect(a.nota).toBeGreaterThan(b.nota);
  });
  it('a sessão cabe no tempo escolhido, com no máximo 6 questões por conteúdo', () => {
    expect(plano.segPorQuestao).toBe(120); // mediana das 16 respostas do aluno
    // cabem 12 em 25 min; aqui há só 11 questões a fazer (todas entram)
    expect(plano.sessao.length).toBe(Math.min(Math.floor((25 * 60) / 120), plano.itens.reduce((a, x) => a + x.ids.length, 0)));
    expect(planoHoje(mats, { mat: s }, { provasAlvo: ['enem'], agora: t0, minutos: 15 }).sessao.length).toBe(Math.floor((15 * 60) / 120));
    expect(planoHoje(mats, {}, { provasAlvo: ['enem'], agora: t0 }).segPorQuestao).toBe(SEG_PADRAO); // sem histórico: 3 min
    const p40 = planoHoje(mats, { mat: s }, { provasAlvo: ['enem'], agora: t0, minutos: 40 });
    expect(p40.sessao.length).toBeGreaterThanOrEqual(plano.sessao.length);
    const porSub = new Map<string, number>();
    for (const x of p40.sessao) { const sub = x.id.split('-')[0]; porSub.set(sub, (porSub.get(sub) || 0) + 1); }
    for (const n of porSub.values()) expect(n).toBeLessThanOrEqual(MAX_POR_CONTEUDO);
    expect(p40.sessao[0].id).toBe(A[0].id);
  });
  it('um conteúdo com muitos erros cede no máximo 6 questões; o resto da sessão vai para o próximo', () => {
    const G = varias(10, 'M09.1', 'ENEM', 6), H = varias(10, 'M10.1', 'ENEM', 6);
    const st = estado(Object.fromEntries([...G, ...H.slice(0, 4)].map((x) => [x.id, [tent(dia(-2), false)]])));
    const p = planoHoje([materia('mat', [...G, ...H])], { mat: st }, { provasAlvo: ['enem'], agora: t0, minutos: 40 });
    expect(p.sessao.filter((x) => x.id.startsWith('M09.1')).length).toBe(MAX_POR_CONTEUDO);
    expect(p.sessao.filter((x) => x.id.startsWith('M10.1')).length).toBeGreaterThan(0);
  });
  it('sem histórico: só conteúdos novos, do mais pesado ao mais leve', () => {
    const p = planoHoje(mats, {}, { provasAlvo: ['enem'], agora: t0 });
    expect(p.itens.every((x) => x.tipo === 'novo')).toBe(true);
    for (let i = 1; i < p.itens.length; i++) expect(p.itens[i].peso).toBeLessThanOrEqual(p.itens[i - 1].peso);
  });
  it('filtro de região: as questões novas vêm da região do aluno', () => {
    const mix = [materia('bio', [...varias(4, 'B01.1', 'ENEM', 2), ...varias(4, 'B01.1', 'UFPR', 2).map((x) => ({ ...x, rg: 'sul' as const }))])];
    const p = planoHoje(mix, {}, { provasAlvo: [], agora: t0, conj: new Set(['sul']) });
    expect(p.itens[0].ids.every((id) => id.includes('UFPR'))).toBe(true);
  });
  it('tempo por questão: mediana do aluno, entre 1 e 6 min', () => {
    const mk = (segs: number[]) => ({ mat: estado(Object.fromEntries(segs.map((sg, i) => [`x${i}`, [tent(dia(-1) + i, true, { seg: sg })]]))) });
    expect(segPorQuestao(mk([90, 90, 90, 90, 100, 100, 100, 100, 100, 100, 500]))).toBe(100);
    expect(segPorQuestao(mk(Array(12).fill(20)))).toBe(60);
    expect(segPorQuestao(mk(Array(12).fill(900)))).toBe(360);
    expect(minutosDe(8, 180)).toBe(24);
  });
});

describe('Escudo TRI (ENEM como prova-alvo)', () => {
  // E1: o aluno erra 2 fáceis e acerta uma difícil (incoerência); E2: 3 fáceis certas (básico garantido);
  // E3: 1 fácil errada; X1: conteúdo que o ENEM não cobra (só Fuvest), com fácil errada
  const E1f = varias(4, 'M05.1', 'ENEM', 2), E1d = varias(2, 'M05.1', 'ENEM', 8);
  const E2f = varias(4, 'M06.1', 'ENEM', 3), E3f = varias(3, 'M07.1', 'ENEM', 4), X1 = varias(3, 'M08.1', 'Fuvest', 1);
  const mats = [materia('mat', [...E1f, ...E1d, ...E2f, ...E3f, ...X1])];
  const s = estado({
    [E1f[0].id]: [tent(dia(-1), false, { conf: 'certeza' })],
    [E1f[1].id]: [tent(dia(-1), true, { conf: 'chute' })],
    [E1f[2].id]: [tent(dia(-1), true)],
    [E1d[0].id]: [tent(dia(-1), true)],
    ...Object.fromEntries(E2f.slice(0, 3).map((x) => [x.id, [tent(dia(-1), true)]])),
    [E3f[0].id]: [tent(dia(-1), false)],
    [X1[0].id]: [tent(dia(-1), false)],
  });
  const esc = escudoTri(mats, { mat: s }, {});

  it('conta as fáceis que o aluno erra por conteúdo (chute conta como erro)', () => {
    expect(esc.conteudos.map((c) => c.sub)).toEqual(['M05.1', 'M07.1']);
    const e1 = esc.conteudos[0];
    expect(e1.erradas).toBe(2);
    expect(e1.faceis).toBe(3);
    expect(esc.erradas).toBe(3);
  });
  it('alerta de incoerência: acertou a difícil e errou a fácil do mesmo conteúdo', () => {
    expect(esc.conteudos[0].incoerente).toBe(true);
    expect(esc.conteudos[1].incoerente).toBe(false);
  });
  it('básico garantido: 3 fáceis feitas, nenhuma errada', () => {
    expect(esc.garantidos).toBe(1);
    expect(esc.feitas).toBe(3 + 3 + 1);
  });
  it('conteúdo que o ENEM não cobra fica fora do escudo', () => {
    expect(esc.conteudos.some((c) => c.sub === 'M08.1')).toBe(false);
  });
  it('a sessão do escudo revisa as fáceis erradas, o erro com certeza primeiro', () => {
    expect(esc.sessao.map((x) => x.id)).toEqual([E1f[0].id, E1f[1].id, E3f[0].id]);
  });
  it('na tela Hoje, com ENEM, as fáceis erradas vêm primeiro e o conteúdo sobe', () => {
    const p = planoHoje(mats, { mat: s }, { provasAlvo: ['enem'], agora: t0 });
    expect(p.enem).toBe(true);
    expect(p.itens[0].sub).toBe('M05.1');
    expect(p.itens[0].faceisErradas).toBe(2);
    expect(p.itens[0].ids.slice(0, 2)).toEqual([E1f[0].id, E1f[1].id]);
    expect(p.sessao[0].id).toBe(E1f[0].id);
  });
  it('sem ENEM nas provas-alvo, não há escudo na ordem do dia', () => {
    const p = planoHoje(mats, { mat: s }, { provasAlvo: ['fuvest'], agora: t0 });
    expect(p.enem).toBe(false);
    expect(p.itens.every((x) => x.faceisErradas === 0)).toBe(true);
  });
});

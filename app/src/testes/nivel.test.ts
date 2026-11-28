import { describe, expect, it } from 'vitest';
import { desempenhoPorNivel, feedbackNiveis, nivelDe, ordemEvolucao, pontosFracos } from '../logica/nivel';
import type { Questao } from '../dados/tipos';
import type { EstadoMateria } from '../estado/tipos';

const q = (id: string, dif: number, degrau = 0): Questao => ({
  id, escola: 'Fuvest', ano: '2024', n: '1', banca: '', fase: '', enun: '', alts: {}, gab: 'A', modulo: 'B01', sub: 'B01.1',
  dif, degrau, conceito: '', pista: '', url: 'https://x', origem: 'prova', figura: false,
});
const est = (r: Record<string, boolean[]>): EstadoMateria => ({
  q: Object.fromEntries(Object.entries(r).map(([id, l]) => [id, { tent: l.map((ok, i) => ({ letra: 'A' as const, ok, ts: i + 1, seg: 30 })) }])),
  ult: null, sims: [], flash: {}, flg: {}, sessoes: [],
});

describe('nível de dificuldade', () => {
  it('faixas: 1–3 básico, 4–6 intermediário, 7–10 avançado', () => {
    expect([1, 3, 4, 6, 7, 10].map(nivelDe)).toEqual(['basico', 'basico', 'intermediario', 'intermediario', 'avancado', 'avancado']);
  });
  it('evolução ordena do mais fácil ao mais difícil, estável', () => {
    const l = [q('c', 8), q('a', 2), q('b', 2, 1), q('d', 5)].sort(ordemEvolucao);
    expect(l.map((x) => x.id)).toEqual(['b', 'a', 'd', 'c']);
  });
  it('desempenho por nível conta a última tentativa', () => {
    const l = [q('a', 2), q('b', 2), q('c', 8)];
    const d = desempenhoPorNivel(l, est({ a: [false, true], c: [false] }));
    expect(d[0]).toMatchObject({ nivel: 'basico', total: 2, feitas: 1, certas: 1, acerto: 1 });
    expect(d[1]).toMatchObject({ total: 0, feitas: 0, acerto: null });
    expect(d[2]).toMatchObject({ feitas: 1, certas: 0, acerto: 0 });
  });
});

describe('feedback por nível', () => {
  const l = [...[1, 2, 3, 1].map((d, i) => q('b' + i, d)), ...[8, 9, 7, 8].map((d, i) => q('a' + i, d))];
  it('sem respostas suficientes, não opina', () => {
    expect(feedbackNiveis(desempenhoPorNivel(l, est({ b0: [true] })))).toBeNull();
  });
  it('base boa e avançado fraco: aponta o avançado', () => {
    const s = est({ b0: [true], b1: [true], b2: [true], a0: [false], a1: [false], a2: [true] });
    const f = feedbackNiveis(desempenhoPorNivel(l, s))!;
    expect(f).toMatch(/avançado/);
    expect(f).toMatch(/33%/);
  });
  it('pontos fracos só com acerto abaixo de 60% e respostas suficientes', () => {
    const s = est({ b0: [true], b1: [true], b2: [true], a0: [false], a1: [false], a2: [false] });
    const p = pontosFracos([{ ref: 'conteudo', qs: l }], s);
    expect(p).toHaveLength(1);
    expect(p[0]).toMatchObject({ ref: 'conteudo', nivel: 'avancado', feitas: 3, acerto: 0 });
  });
});

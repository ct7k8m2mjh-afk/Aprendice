// Comando 32: Treino geral de todas as matérias (sorteio misturado), migração v5 e números da aba Início.
import { describe, expect, it } from 'vitest';
import { chaveMisto, resultadoMisto, sorteiaMisto, type BancoMateria } from '../logica/treinoMisto';
import { desempenhoPeriodo, destaque, diasDeConstancia } from '../logica/inicio';
import { aplicaRetiradas, importaArquivo, migraEstado, VERSAO_ATUAL, type TabelaRetiradas } from '../estado/migracao';
import { estadoMateriaVazio, estadoVazio, type Estado, type SessaoMisto } from '../estado/tipos';
import type { MateriaId, Questao } from '../dados/tipos';

/** gerador pseudoaleatório com semente (mulberry32): testes repetíveis */
function semente(s: number) {
  return () => { s |= 0; s = (s + 0x6d2b79f5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

function q(id: string, extra: Partial<Questao> = {}): Questao {
  return { id, escola: 'ENEM', ano: '2023', n: '1', banca: 'INEP', fase: '', enun: '', alts: {}, gab: 'A', modulo: 'X01', sub: 'X01.1',
    dif: 3, degrau: 1, conceito: '', pista: '', url: 'https://exemplo', origem: 'prova', figura: false, ...extra };
}
function banco(m: MateriaId, n: number): BancoMateria { return { id: m, banco: Array.from({ length: n }, (_, i) => q(`${m}${i}`)) }; }

const MATS: BancoMateria[] = [banco('bio', 60), banco('qui', 60), banco('mat', 60), banco('por', 300), banco('fis', 40), banco('his', 40)];

describe('treino geral de todas as matérias: sorteio', () => {
  it('sorteia o tamanho pedido, sem repetir, só questões dos bancos', () => {
    const s = sorteiaMisto(MATS, {}, 15, { rnd: semente(1), agora: 1e12 });
    expect(s.it).toHaveLength(15);
    expect(new Set(s.it.map(chaveMisto)).size).toBe(15);
    for (const x of s.it) expect(MATS.find((mc) => mc.id === x.m)!.banco.some((y) => y.id === x.id)).toBe(true);
    expect(s.i).toBe(0);
    expect(s.res).toEqual({});
  });

  it('mistura matérias: todas aparecem e a rodada não vem em blocos por matéria', () => {
    for (let k = 1; k <= 20; k++) {
      const s = sorteiaMisto(MATS, {}, 15, { rnd: semente(k), agora: 1e12 });
      const mats = new Set(s.it.map((x) => x.m));
      expect(mats.size).toBe(MATS.length); // 15 questões, 6 matérias: rodízio garante todas
      // a matéria de banco maior (Português, 300) não domina: no máximo 3 de 15 (rodízio de 6)
      expect(s.it.filter((x) => x.m === 'por').length).toBeLessThanOrEqual(3);
      // trocas de matéria entre questões seguidas: muitas (em blocos seriam só 5)
      const trocas = s.it.slice(1).filter((x, i) => x.m !== s.it[i].m).length;
      expect(trocas).toBeGreaterThanOrEqual(8);
    }
  });

  it('duas rodadas com sementes diferentes dão ordens diferentes (aleatório de verdade)', () => {
    const a = sorteiaMisto(MATS, {}, 15, { rnd: semente(3), agora: 1e12 }).it.map(chaveMisto).join();
    const b = sorteiaMisto(MATS, {}, 15, { rnd: semente(4), agora: 1e12 }).it.map(chaveMisto).join();
    expect(a).not.toBe(b);
  });

  it('deixa de fora questão pendente, de site e retirada; nunca passa do banco disponível', () => {
    const ruins: BancoMateria = { id: 'geo', banco: [q('g1', { pendente: 'sem fonte' }), q('g2', { origem: 'site' }), q('g3', { retirada: true }), q('g4')] };
    const s = sorteiaMisto([ruins], {}, 15, { rnd: semente(2) });
    expect(s.it).toEqual([{ m: 'geo', id: 'g4' }]);
    expect(sorteiaMisto([], {}, 15).it).toEqual([]);
  });

  it('prefere questões não respondidas hoje', () => {
    const agora = new Date(2026, 10, 6, 15).getTime();
    const b: BancoMateria = { id: 'bio', banco: [q('a'), q('b'), q('c')] };
    const est = { bio: { ...estadoMateriaVazio(), q: { a: { tent: [{ letra: 'A' as const, ok: true, ts: agora - 3600e3, seg: 10 }] }, b: { tent: [{ letra: 'B' as const, ok: false, ts: agora - 7200e3, seg: 10 }] } } } };
    for (let k = 1; k <= 10; k++) expect(sorteiaMisto([b], est, 1, { rnd: semente(k), agora }).it[0].id).toBe('c');
    // pedindo mais do que as novas, completa com as já respondidas
    expect(sorteiaMisto([b], est, 3, { rnd: semente(5), agora }).it).toHaveLength(3);
  });

  it('prefere questões com resolução (correção em 4 blocos) e completa com as outras', () => {
    const b: BancoMateria = { id: 'qui', banco: [q('s1'), q('r1', { cr: 1 }), q('s2'), q('r2', { cr: 1 })] };
    for (let k = 1; k <= 10; k++) {
      const s = sorteiaMisto([b], {}, 2, { rnd: semente(k) });
      expect(s.it.map((x) => x.id).sort()).toEqual(['r1', 'r2']);
    }
    expect(sorteiaMisto([b], {}, 4, { rnd: semente(1) }).it).toHaveLength(4);
  });

  it('filtro de aceitação (prévia sem print) vale', () => {
    const s = sorteiaMisto(MATS, {}, 30, { rnd: semente(9), aceita: (m) => m === 'bio' || m === 'qui' });
    expect(new Set(s.it.map((x) => x.m))).toEqual(new Set(['bio', 'qui']));
  });

  it('resultado por matéria conta só o que foi respondido', () => {
    const s: SessaoMisto = { it: [{ m: 'bio', id: 'x' }, { m: 'qui', id: 'x' }, { m: 'bio', id: 'y' }, { m: 'mat', id: 'z' }], i: 3,
      res: { 'bio:x': 'a', 'qui:x': 'e', 'bio:y': 'e' }, t0: 0 };
    const r = Object.fromEntries(resultadoMisto(s).map((x) => [x.m, x]));
    expect(r.bio).toEqual({ m: 'bio', n: 2, ok: 1 });
    expect(r.qui).toEqual({ m: 'qui', n: 1, ok: 0 });
    expect(r.mat).toBeUndefined();
  });
});

describe('migração v5 (princípio 7): treino geral de todas as matérias', () => {
  const tent = { letra: 'C' as const, ok: true, ts: 1762000000000, seg: 30, ctx: 'escada' };
  const v4 = { ...estadoVazio(), versao: 4, treinoMisto: undefined,
    materias: { bio: { ...estadoMateriaVazio(), q: { P1: { tent: [tent], rev: true } }, ult: 'P1' } },
    treino: { bio: { it: [{ k: 'q' as const, id: 'P1' }], i: 0, res: {}, t0: 5 } } } as unknown as Estado;

  it('estado v4 vai à v5 com treinoMisto vazio, sem perder nada e sem mudar ids', () => {
    const e = migraEstado(v4);
    expect(VERSAO_ATUAL).toBe(5);
    expect(e.versao).toBe(5);
    expect(e.treinoMisto).toBeNull();
    expect(e.materias.bio!.q.P1).toEqual({ tent: [tent], rev: true });
    expect(e.materias.bio!.ult).toBe('P1');
    expect(e.treino.bio).toEqual(v4.treino.bio);
  });

  it('estado v5 com sessão em andamento passa intacto', () => {
    const ses: SessaoMisto = { it: [{ m: 'bio', id: 'P1' }, { m: 'mat', id: 'M9' }], i: 1, res: { 'bio:P1': 'a' }, t0: 7 };
    const e = migraEstado({ ...estadoVazio(), treinoMisto: ses });
    expect(e.treinoMisto).toEqual(ses);
  });

  it('sessão corrompida num estado antigo vira null (o progresso nas matérias continua)', () => {
    const e = migraEstado({ ...v4, treinoMisto: { it: 'x' } } as unknown as Estado);
    expect(e.treinoMisto).toBeNull();
    expect(e.materias.bio!.q.P1.tent).toHaveLength(1);
  });

  it('questão retirada na sessão: vai para a questão de prova equivalente (mesmo de outra matéria) ou sai', () => {
    const tabela: TabelaRetiradas = { bio: { S1: ['B01.1', 3, 'qui', 'Q7'], S2: ['B01.1', 3] } };
    const ses: SessaoMisto = { it: [{ m: 'bio', id: 'S2' }, { m: 'bio', id: 'S1' }, { m: 'mat', id: 'M1' }], i: 2, res: {}, t0: 1 };
    const e = aplicaRetiradas({ ...estadoVazio(), treinoMisto: ses }, tabela);
    expect(e.treinoMisto!.it).toEqual([{ m: 'qui', id: 'Q7' }, { m: 'mat', id: 'M1' }]);
    expect(e.treinoMisto!.i).toBe(1); // o item já feito que saiu leva a posição junto
  });

  it('arquivo exportado na v5 é importado', () => {
    const arq = JSON.stringify({ versao: 5, materias: { bio: { q: { P1: { tent: [tent] } } } }, simuladosFeitos: [] });
    const { estado, r } = importaArquivo(estadoVazio(), arq, { bio: new Set(['P1']) });
    expect(r.erro).toBeUndefined();
    expect(estado.materias.bio!.q.P1.tent).toHaveLength(1);
  });
});

describe('aba Início: desempenho, constância e destaque', () => {
  const dia = (d: number, h = 10) => new Date(2026, 10, d, h).getTime();
  const t = (ts: number, ok: boolean) => ({ letra: 'A' as const, ok, ts, seg: 10 });
  const e: Estado = { ...estadoVazio(), materias: {
    bio: { ...estadoMateriaVazio(), q: { a: { tent: [t(dia(6), true)] }, b: { tent: [t(dia(5), false), t(dia(6), true)] }, c: { tent: [t(dia(1), false)] } } },
    qui: { ...estadoMateriaVazio(), q: { x: { tent: [t(dia(4), false)] } } },
  } };
  const agora = dia(6, 18);

  it('desempenho no período conta cada questão uma vez, pela última resposta do período', () => {
    const p7 = Object.fromEntries(desempenhoPeriodo(e, 7, agora).map((x) => [x.m, x]));
    expect(p7.bio).toEqual({ m: 'bio', resolvidas: 3, acertos: 2 });
    expect(p7.qui).toEqual({ m: 'qui', resolvidas: 1, acertos: 0 });
    const p1 = Object.fromEntries(desempenhoPeriodo(e, 1, agora).map((x) => [x.m, x]));
    expect(p1.bio).toEqual({ m: 'bio', resolvidas: 2, acertos: 2 });
    expect(p1.qui).toBeUndefined();
  });

  it('constância: dias seguidos até hoje (ou até ontem)', () => {
    expect(diasDeConstancia(e, agora)).toBe(3); // 4, 5 e 6
    expect(diasDeConstancia(e, dia(7, 9))).toBe(3); // hoje (7) ainda sem estudo: conta até ontem
    expect(diasDeConstancia(e, dia(9, 9))).toBe(0);
  });

  it('destaque: maior acerto entre as matérias com questões suficientes', () => {
    expect(destaque([{ m: 'bio', resolvidas: 10, acertos: 6 }, { m: 'qui', resolvidas: 2, acertos: 2 }])!.m).toBe('bio');
    expect(destaque([{ m: 'bio', resolvidas: 3, acertos: 1 }, { m: 'qui', resolvidas: 2, acertos: 2 }])!.m).toBe('qui');
    expect(destaque([])).toBeNull();
  });
});

// Comando 24, fase 2 do Método Aprendice de Revisão: agenda pela data da prova, critério de saída (3 acertos
// espaçados), domínio real e migração do histórico (v6 -> v7) sem perder nada.
import { describe, expect, it } from 'vitest';
import {
  agendaDe, diaDaData, dominioDe, emNDias, filaAntiga, filaDe, fracaoIdeal, intervalo, memoriaDe, proximaProva,
  retencao, projetaAte, DIA, SAIDA, SEM_AGENDA, type Agenda,
} from '../logica/revisao';
import { proximaVolta, VOLTA_DIAS } from '../logica/cicloRevisao';
import { marcaFlash } from '../logica/revisao';
import { migraEstado, v6paraV7, VERSAO_ATUAL } from '../estado/migracao';
import { dominioMateria, feitasDe, previsao } from '../logica/dominio';
import { estadoMateriaVazio, estadoVazio, type Estado, type EstadoQuestao, type Tentativa } from '../estado/tipos';
import type { MateriaCarregada } from '../dados/conteudo';
import type { Questao } from '../dados/tipos';

const t0 = new Date(2026, 10, 1, 10).getTime(); // 1/11/2026 10h
const dia = (n: number, h = 10) => { const d = new Date(t0); d.setDate(d.getDate() + n); d.setHours(h); return d.getTime(); };
const tent = (ts: number, ok: boolean, extra: Partial<Tentativa> = {}): Tentativa => ({ letra: 'A', ok, ts, seg: 20, ...extra });
const comProva = (n: number): Agenda => ({ prova: emNDias(t0, n), desde: 0 });

describe('agenda contada a partir da data da prova', () => {
  it('sem data: vale a escala de sempre (1, 3, 7 dias)', () => {
    expect(intervalo(1, t0)).toBe(1);
    expect(intervalo(3, t0)).toBe(3);
    expect(intervalo(7, t0)).toBe(7);
  });
  it('prova longe (200 dias): a escala não muda', () => {
    expect(intervalo(7, t0, comProva(200))).toBe(7);
  });
  it('prova a 10 dias: o intervalo encurta para cerca de 30% do que falta', () => {
    expect(intervalo(7, t0, comProva(10))).toBe(3);
    expect(intervalo(3, t0, comProva(10))).toBe(3);
  });
  it('quanto mais perto, mais curto', () => {
    const l = [60, 20, 10, 5, 3].map((n) => intervalo(7, t0, comProva(n)));
    for (let i = 1; i < l.length; i++) expect(l[i]).toBeLessThanOrEqual(l[i - 1]);
    expect(l.at(-1)).toBe(1);
  });
  it('nada marcado para depois da véspera', () => {
    for (const n of [2, 3, 4, 6, 8, 15, 25]) expect(intervalo(35, t0, comProva(n))).toBeLessThanOrEqual(n - 1);
  });
  it('fração ideal: 30% a semanas, 7,5% a um ano (Cepeda 2008), decrescente no meio', () => {
    expect(fracaoIdeal(14)).toBe(0.3);
    expect(fracaoIdeal(400)).toBe(0.075);
    expect(fracaoIdeal(100)).toBeLessThan(0.3);
    expect(fracaoIdeal(100)).toBeGreaterThan(0.075);
  });
  it('a fila da questão segue a agenda: errou com a prova a 4 dias, volta amanhã; acertou, volta no máximo na véspera', () => {
    const ag = comProva(4);
    const eq: EstadoQuestao = { tent: [tent(t0, false), tent(dia(1), true, { conf: 'certeza' })] };
    const f = filaDe(eq, ag)!;
    expect(f.etapa).toBe(1);
    expect(f.vence).toBeLessThanOrEqual(emNDias(t0, 3));
    expect(f.vence).toBe(emNDias(dia(1), 1));
  });
  it('a próxima prova é a mais perto no futuro, só entre as provas-alvo', () => {
    const datas = { enem: '2026-11-08', fuvest: '2026-11-22', unicamp: '2026-11-03', velha: '2026-10-01' };
    expect(proximaProva(['fuvest', 'enem', 'velha'], datas, t0)).toEqual({ id: 'enem', dia: diaDaData('2026-11-08') });
    expect(proximaProva(['velha'], datas, t0)).toBeNull();
    expect(proximaProva(['fuvest'], datas, dia(30))).toBeNull(); // prova passada não conta
  });
  it('data inválida é ignorada', () => {
    expect(diaDaData('2026-02-30')).toBeNull();
    expect(diaDaData('ontem')).toBeNull();
  });
  it('agendaDe lê o perfil e o corte da migração', () => {
    const e = { perfil: { provasAlvo: ['enem'], datasProva: { enem: '2026-11-08' } }, revisaoDesde: 123 };
    expect(agendaDe(e, t0)).toEqual({ prova: diaDaData('2026-11-08'), provaId: 'enem', desde: 123 });
    expect(agendaDe({ perfil: null }, t0)).toEqual({ prova: null, provaId: null, desde: 0 });
  });
  it('flashcards e revisão em slides também encurtam pela prova', () => {
    expect(marcaFlash({ etapa: 3, vence: 0, hist: [{ ts: 1, v: 'a' }] }, 'a', t0, undefined, comProva(6)).vence).toBe(emNDias(t0, 2));
    expect(proximaVolta({ etapa: 3, vence: 0, hist: [{ ts: 1, seg: 0, pre: [], lembrou: {}, apl: [] }] }, true, t0, comProva(6)).vence).toBe(emNDias(t0, 2));
    expect(proximaVolta(undefined, true, t0).vence).toBe(emNDias(t0, VOLTA_DIAS[1]));
  });
});

describe('critério de saída: 3 acertos espaçados', () => {
  it('errou: entra; sai depois do 3º acerto na data (1, 3 e 7 dias)', () => {
    const l = [tent(t0, false)];
    expect(filaDe({ tent: l })!.etapa).toBe(0);
    l.push(tent(dia(1), true)); // acerto 1 (na data)
    expect(filaDe({ tent: l })).toMatchObject({ etapa: 1, vence: emNDias(dia(1), 3) });
    l.push(tent(dia(4), true)); // acerto 2
    expect(filaDe({ tent: l })).toMatchObject({ etapa: 2, vence: emNDias(dia(4), 7) });
    l.push(tent(dia(11), true)); // acerto 3: sai
    expect(filaDe({ tent: l })).toBeNull();
    expect(SAIDA).toBe(3);
  });
  it('três acertos no mesmo dia não tiram a questão (só conta na data)', () => {
    const l = [tent(t0, false), tent(t0 + 60000, true), tent(t0 + 120000, true), tent(t0 + 180000, true)];
    expect(filaDe({ tent: l })!.etapa).toBe(0);
  });
  it('errar no meio zera os acertos e volta amanhã', () => {
    const l = [tent(t0, false), tent(dia(1), true), tent(dia(4), true), tent(dia(11), false)];
    expect(filaDe({ tent: l })).toMatchObject({ etapa: 0, vence: emNDias(dia(11), 1) });
  });
  it('acerto no chute ou com dica não conta: volta para o começo', () => {
    expect(filaDe({ tent: [tent(t0, false), tent(dia(1), true, { conf: 'chute' })] })!.etapa).toBe(0);
    expect(filaDe({ tent: [tent(t0, false), tent(dia(1), true, { dica: 1 })] })!.etapa).toBe(0);
  });
  it('errou com certeza: prioridade e volta amanhã', () => {
    expect(filaDe({ tent: [tent(t0, false, { conf: 'certeza' })] })).toMatchObject({ certeza: true, vence: emNDias(t0, 1) });
  });
  it('acerto seguro direto não entra na revisão', () => {
    expect(filaDe({ tent: [tent(t0, true, { conf: 'certeza' })] })).toBeNull();
  });
});

describe('domínio real (não é contagem de acertos)', () => {
  it('errou da primeira vez: aprendendo', () => {
    expect(dominioDe(memoriaDe({ tent: [tent(t0, false)] })!, dia(0, 12))).toBe('aprendendo');
  });
  it('um acerto não é domínio; 3 acertos espaçados é', () => {
    expect(dominioDe(memoriaDe({ tent: [tent(t0, true)] })!, dia(1))).toBe('aprendendo');
    const m = memoriaDe({ tent: [tent(t0, false), tent(dia(1), true), tent(dia(4), true), tent(dia(11), true)] })!;
    expect(m.fila).toBe(false);
    expect(dominioDe(m, dia(12))).toBe('domina');
  });
  it('cinco acertos no mesmo dia não são domínio', () => {
    const m = memoriaDe({ tent: [0, 1, 2, 3, 4].map((k) => tent(t0 + k * 60000, true)) })!;
    expect(dominioDe(m, dia(0, 12))).toBe('aprendendo');
  });
  it('errou depois de já ter acertado: esqueceu', () => {
    const m = memoriaDe({ tent: [tent(t0, true), tent(dia(5), false)] })!;
    expect(dominioDe(m, dia(5, 12))).toBe('esqueceu');
  });
  it('dominado e esquecido no tempo: a lembrança cai (R = e^(−t/S)) e vira "esqueceu"', () => {
    const m = memoriaDe({ tent: [tent(t0, false), tent(dia(1), true), tent(dia(4), true), tent(dia(11), true)] })!;
    expect(retencao(m, dia(11))).toBeCloseTo(1);
    expect(retencao(m, dia(40))).toBeLessThan(retencao(m, dia(20)));
    expect(dominioDe(m, dia(400))).toBe('esqueceu');
  });
  it('painel por matéria, tema e conteúdo, com previsão para o dia da prova', () => {
    const q = (id: string, sub: string): Questao => ({ id, sub, modulo: sub.split('.')[0], dif: 3 } as Questao);
    const banco = [q('a', 'X01.1'), q('b', 'X01.1'), q('c', 'X01.2'), q('d', 'X02.1')];
    const mc = {
      id: 'bio', banco, porId: new Map(banco.map((x) => [x.id, x])), porSub: new Map(),
      conteudo: { modulos: [
        { id: 'X01', nome: 'tema 1', subs: [{ id: 'X01.1', nome: 'um' }, { id: 'X01.2', nome: 'dois' }] },
        { id: 'X02', nome: 'tema 2', subs: [{ id: 'X02.1', nome: 'três' }] },
      ] },
    } as unknown as MateriaCarregada;
    const s = { ...estadoMateriaVazio(), q: {
      a: { tent: [tent(t0, false), tent(dia(1), true), tent(dia(4), true), tent(dia(11), true)] }, // domina
      b: { tent: [tent(dia(11), false)] }, // aprendendo
      c: { tent: [tent(t0, true), tent(dia(11), false)] }, // esqueceu
    } };
    const d = dominioMateria(mc, s, { prova: emNDias(t0, 30), desde: 0 }, dia(12));
    expect(d.c).toMatchObject({ domina: 1, aprendendo: 1, esqueceu: 1, nunca: 1, total: 4 });
    expect(d.temas.map((t) => t.id)).toEqual(['X01', 'X02']);
    expect(d.temas[0].subs.find((x) => x.id === 'X01.1')!.c).toMatchObject({ domina: 1, aprendendo: 1 });
    expect(feitasDe(d.temas[1].c)).toBe(0);
    const p = previsao(d.c)!;
    expect(p).toBeGreaterThan(0);
    expect(p).toBeLessThan(100);
    expect(previsao(dominioMateria(mc, s, SEM_AGENDA, dia(12)).c)).toBeNull();
  });
});

describe('previsão para o dia da prova, se fizer as revisões marcadas', () => {
  const ag = comProva(21);
  it('errou hoje: com as revisões marcadas até a prova, a lembrança no dia é bem maior que parando agora', () => {
    const m = memoriaDe({ tent: [tent(t0, false)] }, ag)!;
    const p = projetaAte(m, ag.prova!, ag, t0);
    expect(p.acertos).toBeGreaterThanOrEqual(SAIDA); // as 3 revisões cabem antes da prova
    expect(p.fila).toBe(false);
    expect(retencao(p, ag.prova!)).toBeGreaterThan(retencao(m, ag.prova!) + 0.3);
  });
  it('nenhuma revisão é contada no dia da prova ou depois', () => {
    const m = memoriaDe({ tent: [tent(t0, false)] }, comProva(2))!;
    const p = projetaAte(m, emNDias(t0, 2), comProva(2), t0);
    expect(p.ultima).toBeLessThan(emNDias(t0, 2));
    expect(p.acertos).toBe(1);
  });
  it('fora da revisão nada muda', () => {
    const m = memoriaDe({ tent: [tent(t0, true)] }, ag)!;
    expect(projetaAte(m, ag.prova!, ag, t0)).toEqual(m);
  });
  it('vencida conta como revisão hoje (não no passado)', () => {
    const m = memoriaDe({ tent: [tent(t0, false)] }, ag)!;
    const p = projetaAte(m, ag.prova!, ag, dia(5));
    expect(p.ultima).toBeGreaterThanOrEqual(dia(5));
  });
});

describe('migração v6 -> v7 (princípio 7: nada se perde, ids iguais)', () => {
  const corte = dia(70, 12);
  // histórico real no formato v6: as questões estão em etapas diferentes da regra antiga (1, 3, 7, 16, 35)
  const naEtapa2 = [tent(t0, false), tent(dia(1), true), tent(dia(4), true)]; // regra antiga: etapa 2, volta em 7 dias
  const naEtapa3 = [tent(t0, false), tent(dia(1), true), tent(dia(4), true), tent(dia(11), true)]; // etapa 3
  const terminada = [tent(t0, false), tent(dia(1), true), tent(dia(4), true), tent(dia(11), true), tent(dia(27), true), tent(dia(43), true), tent(dia(62), true)];
  const vencida = [tent(dia(5), true, { conf: 'chute' })]; // regra antiga: venceu em dia(6), ainda não revista
  const v6 = (): Estado => ({
    ...estadoVazio(), versao: 6 as Estado['versao'],
    perfil: { nome: 'A', email: '', provasAlvo: ['enem'], meta: 100, criadoEm: t0 },
    materias: { bio: { q: { P1: { tent: naEtapa2, rev: true }, P2: { tent: naEtapa3 }, P3: { tent: terminada }, P4: { tent: vencida } },
      ult: 'P1', sims: [], flash: { 'bio-d001': { etapa: 2, vence: dia(9), hist: [{ ts: dia(2), v: 'a' }] } }, flg: {}, sessoes: [{ ts: t0, seg: 60 }],
      revs: { 'B01.1': { etapa: 1, vence: dia(8), hist: [{ ts: dia(5), seg: 300, pre: [], lembrou: {}, apl: [] }], and: null } } } },
  });
  const sem = ({ revisaoDesde: _r, ...x }: Estado) => x;

  it('vai para a versão atual com o corte e as datas vazias', () => {
    const e = migraEstado(v6(), {}, corte);
    expect(VERSAO_ATUAL).toBe(7);
    expect(e.versao).toBe(7);
    expect(e.revisaoDesde).toBe(corte);
    expect(e.perfil!.datasProva).toEqual({});
  });
  it('não perde nada: tentativas, ids, marcadas, flashcards, revisões em slides e sessões iguais', () => {
    const antes = v6();
    const e = migraEstado(antes, {}, corte);
    expect(Object.keys(e.materias.bio!.q)).toEqual(['P1', 'P2', 'P3', 'P4']);
    expect(e.materias.bio!.q).toEqual(antes.materias.bio!.q);
    expect(e.materias.bio!.flash).toEqual(antes.materias.bio!.flash);
    expect(e.materias.bio!.revs).toEqual(antes.materias.bio!.revs);
    expect(e.materias.bio!.sessoes).toEqual(antes.materias.bio!.sessoes);
    expect(e.materias.bio!.ult).toBe('P1');
    expect(sem({ ...e, versao: 6, perfil: antes.perfil } as Estado)).toEqual(sem(antes));
  });
  it('a agenda no momento da migração é a mesma da regra antiga (mesmo dia marcado)', () => {
    const e = migraEstado(v6(), {}, corte);
    const ag = agendaDe(e, corte);
    for (const id of ['P1', 'P4']) {
      const velha = filaAntiga(e.materias.bio!.q[id])!;
      expect(filaDe(e.materias.bio!.q[id], ag)).toEqual(velha);
    }
  });
  it('a etapa antiga vira acertos espaçados: etapa 2 sai no próximo acerto na data', () => {
    const e = migraEstado(v6(), {}, corte);
    const ag = agendaDe(e, corte);
    const eq = e.materias.bio!.q.P1;
    const vence = filaDe(eq, ag)!.vence; // dia(11), marcado pela regra antiga
    expect(vence).toBe(emNDias(dia(4), 7));
    // acerto depois do corte, na data (já passou): é o 3º espaçado -> sai
    expect(filaDe({ tent: [...eq.tent, tent(dia(71), true)] }, ag)).toBeNull();
    // erro depois do corte: volta amanhã pela regra nova
    expect(filaDe({ tent: [...eq.tent, tent(dia(71), false)] }, ag)).toMatchObject({ etapa: 0, vence: emNDias(dia(71), 1) });
  });
  it('quem já tinha 3 acertos na data (etapa 3 da regra antiga) sai pelo critério novo; quem terminou continua fora', () => {
    const e = migraEstado(v6(), {}, corte);
    const ag = agendaDe(e, corte);
    expect(filaAntiga(e.materias.bio!.q.P2)!.etapa).toBe(3);
    expect(filaDe(e.materias.bio!.q.P2, ag)).toBeNull();
    expect(filaAntiga(e.materias.bio!.q.P3)).toBeNull();
    expect(filaDe(e.materias.bio!.q.P3, ag)).toBeNull();
    expect(dominioDe(memoriaDe(e.materias.bio!.q.P3, ag)!, corte)).toBe('domina');
  });
  it('migrar de novo não muda o corte (idempotente)', () => {
    const e = migraEstado(v6(), {}, corte);
    const e2 = migraEstado(e, {}, corte + 10 * DIA);
    expect(e2).toEqual(e);
    expect(v6paraV7({ ...e, versao: 6 as Estado['versao'] }, corte + 99).revisaoDesde).toBe(corte);
  });
  it('datas de prova estranhas saem; as válidas ficam', () => {
    const x = v6();
    x.perfil = { ...x.perfil!, datasProva: { enem: '2026-11-08', fuvest: 'amanhã', unicamp: 7 as unknown as string } };
    expect(migraEstado(x, {}, corte).perfil!.datasProva).toEqual({ enem: '2026-11-08' });
  });
  it('estado de versões antigas (v4) chega à v7 passando por todos os passos', () => {
    const e = migraEstado({ ...v6(), versao: 4 } as Estado, {}, corte);
    expect(e.versao).toBe(7);
    expect(e.pref.filtroRegiao).toBe('minha');
    expect(e.revisaoDesde).toBe(corte);
    expect(e.materias.bio!.q.P1.tent).toHaveLength(3);
  });
  it('estado novo nasce na v7 sem corte: tudo pela regra nova', () => {
    expect(estadoVazio().versao).toBe(7);
    expect(estadoVazio().revisaoDesde).toBe(0);
  });
});

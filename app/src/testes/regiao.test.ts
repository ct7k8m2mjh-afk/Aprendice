// Região das provas (pedido do dono, 09/11/2026): "o aluno que irá fazer uma prova no Sul pratica com provas do Sul;
// o aluno que irá fazer em São Paulo pratica com provas de São Paulo".
import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { CATALOGO } from '../dados/provas';
import type { Questao } from '../dados/tipos';
import {
  POUCAS, REGIOES_PRATICA, descreveFiltro, filtraRegiao, minhasRegioes, passa, questoesTreinoGeral, regiaoDaProva,
  regiaoDaQuestao, regioesDasProvas, regioesDoFiltro, type RegiaoId,
} from '../logica/regiao';
import { sorteiaMisto } from '../logica/treinoMisto';
import { migraEstado, v5paraV6, VERSAO_ATUAL } from '../estado/migracao';
import { estadoMateriaVazio, estadoVazio, type Estado } from '../estado/tipos';
import { ordemEvolucao } from '../logica/nivel';

const DEST = join(__dirname, '..', '..', 'public', 'conteudo');
const MATS = ['bio', 'qui', 'mat', 'por', 'fis', 'geo', 'his', 'fs', 'ing'] as const;
const temConteudo = existsSync(join(DEST, 'bio', 'banco.json'));
const banco = (m: string) => JSON.parse(readFileSync(join(DEST, m, 'banco.json'), 'utf-8')) as Questao[];
const IDS = new Set(REGIOES_PRATICA.map((r) => r.id));
const ESCOLAS_SP = ['Fuvest', 'Unesp', 'Santa Casa (FCMSCSP)', 'Albert Einstein', 'Famema', 'São Camilo'];

describe.skipIf(!temConteudo)('região de cada questão do banco (converte.py)', () => {
  for (const m of MATS) {
    it(`${m}: toda questão no ar tem a região da prova dela`, () => {
      const sem = banco(m).filter((q) => !q.pendente && !q.retirada && !IDS.has(q.rg as RegiaoId));
      expect(sem.map((q) => `${q.id} ${q.escola}`)).toEqual([]);
    });
  }
  const todas = MATS.flatMap((m) => banco(m)).filter((q) => !q.pendente && !q.retirada);
  it('escolas antigas do protótipo (Fuvest, Unesp, Santa Casa, Einstein, Famema, São Camilo) são de São Paulo', () => {
    const l = todas.filter((q) => ESCOLAS_SP.includes(q.escola));
    expect(l.length).toBeGreaterThan(500);
    expect(new Set(l.map((q) => q.rg))).toEqual(new Set(['sp']));
    expect(new Set(l.map((q) => q.uf))).toEqual(new Set(['SP']));
  });
  it('ENEM é Nacional, sem estado', () => {
    const l = todas.filter((q) => q.escola === 'ENEM' || q.escola === 'Enem');
    expect(l.length).toBeGreaterThan(100);
    expect(l.every((q) => q.rg === 'nac' && !q.uf)).toBe(true);
  });
  it('a região bate com o estado da prova (SP separado do Sudeste)', () => {
    const esperado: Record<string, RegiaoId> = { SP: 'sp', RJ: 'se', MG: 'se', ES: 'se', PR: 'sul', SC: 'sul', RS: 'sul', CE: 'ne', PE: 'ne', MA: 'ne', AM: 'no', RR: 'no', TO: 'no', GO: 'co', MT: 'co' };
    for (const q of todas) if (q.uf && esperado[q.uf]) expect(q.rg, `${q.id} ${q.escola} ${q.uf}`).toBe(esperado[q.uf]);
    const prov = (e: string) => todas.find((q) => q.escola === e);
    expect(prov('UFPR')?.rg).toBe('sul');
    expect(prov('PUC-Rio')?.rg).toBe('se');
    expect(prov('UFU')?.rg).toBe('se');
    expect(prov('PUC-Campinas')?.rg).toBe('sp');
    expect(prov('Fatec')?.rg).toBe('sp');
  });
  it('há questões de São Paulo e do Sul em todas as matérias', () => {
    for (const m of MATS) {
      const b = banco(m);
      expect(b.some((q) => q.rg === 'sp'), m).toBe(true);
      expect(b.some((q) => q.rg === 'sul'), m).toBe(true);
    }
  });
});

describe('região das minhas provas (das provas-alvo)', () => {
  it('provas do catálogo: ENEM Nacional; SP separado; Sudeste sem SP', () => {
    expect(regiaoDaProva({ uf: null, regiao: 'Nacional' })).toBe('nac');
    expect(regiaoDaProva({ uf: 'SP', regiao: 'Sudeste' })).toBe('sp');
    expect(regiaoDaProva({ uf: 'MG', regiao: 'Sudeste' })).toBe('se');
    expect(regiaoDaProva({ uf: 'PR', regiao: 'Sul' })).toBe('sul');
    for (const p of CATALOGO) expect(regiaoDaProva(p), p.id).not.toBeNull();
  });
  it('todas de SP -> São Paulo; todas do Sul -> Sul; mistura -> as regiões delas', () => {
    expect(regioesDasProvas(['fuvest', 'unesp', 'santacasa'], CATALOGO)).toEqual(['sp']);
    expect(regioesDasProvas(['ufpr', 'ufrgs', 'udesc'], CATALOGO)).toEqual(['sul']);
    expect(regioesDasProvas(['fuvest', 'ufpr'], CATALOGO)).toEqual(['sp', 'sul']);
    expect(regioesDasProvas(['fuvest', 'enem'], CATALOGO)).toEqual(['sp']); // o ENEM já entra pelo "Minha região"
    expect(regioesDasProvas(['enem'], CATALOGO)).toEqual(['nac']);
    expect(regioesDasProvas([], CATALOGO)).toEqual([]);
  });
  it('escolha à mão vale acima das provas-alvo; sem escolha, volta ao automático', () => {
    expect(minhasRegioes({ regioes: ['ne'] }, ['fuvest'], CATALOGO)).toEqual(['ne']);
    expect(minhasRegioes({ regioes: null }, ['fuvest'], CATALOGO)).toEqual(['sp']);
    expect(minhasRegioes({}, [], CATALOGO)).toEqual([]);
  });
  it('"Minha região" = as regiões do aluno + ENEM; sem região, não filtra', () => {
    expect([...regioesDoFiltro('minha', ['sp'])!].sort()).toEqual(['nac', 'sp']);
    expect(regioesDoFiltro('minha', [])).toBeNull();
    expect(regioesDoFiltro('todas', ['sp'])).toBeNull();
    expect([...regioesDoFiltro('sul', ['sp'])!]).toEqual(['sul']);
    expect(descreveFiltro('minha', ['sp'])).toBe('São Paulo e ENEM');
    expect(descreveFiltro('minha', ['sp', 'sul'])).toBe('São Paulo, Sul e ENEM');
  });
});

const q = (id: string, rg: RegiaoId, dif = 3, extra: Partial<Questao> = {}): Questao => ({
  id, escola: 'X', ano: '2024', n: '1', banca: '', fase: '', enun: '', alts: {}, gab: 'A', modulo: 'B01', sub: 'B01.1', dif, degrau: 0,
  conceito: '', pista: '', url: 'https://x', origem: 'prova', figura: true, rg, ...extra,
});

describe('filtro de região com reserva (nunca sem questão)', () => {
  const l = [q('a', 'sp'), q('b', 'sul'), q('c', 'nac'), q('d', 'sul'), q('e', 'ne')];
  it('filtra pela região e marca "poucas" quando há outras', () => {
    const f = filtraRegiao(l, regioesDoFiltro('minha', ['sul']));
    expect(f.l.map((x) => x.id)).toEqual(['b', 'c', 'd']);
    expect(f).toMatchObject({ daRegiao: 3, total: 5, reserva: false, poucas: 3 < POUCAS });
  });
  it('região sem nenhuma questão aqui: a lista inteira, marcada como reserva', () => {
    const f = filtraRegiao(l, new Set<RegiaoId>(['co']));
    expect(f.l).toHaveLength(5);
    expect(f.reserva).toBe(true);
  });
  it('sem filtro (todas as regiões) não muda nada', () => {
    expect(filtraRegiao(l, null)).toMatchObject({ l, reserva: false, poucas: false });
  });
  it('questão antiga sem rg usa a escola (prévia de arquivo único)', () => {
    expect(regiaoDaQuestao({ escola: 'Fuvest' })).toBe('sp');
    expect(regiaoDaQuestao({ escola: 'ENEM' })).toBe('nac');
    expect(passa({ escola: 'Desconhecida' }, new Set<RegiaoId>(['sul']))).toBe(true);
  });
});

describe.skipIf(!temConteudo)('as questões mudam com a região do aluno (Escada, treinos, revisão)', () => {
  const bio = banco('bio').filter((x) => !x.pendente);
  const porSub = new Map<string, Questao[]>();
  for (const x of bio) porSub.set(x.sub, [...(porSub.get(x.sub) || []), x]);
  // um conteúdo com questões de SP e do Sul
  const [sub, l] = [...porSub.entries()].find(([, v]) => v.filter((x) => x.rg === 'sp').length >= 3 && v.filter((x) => x.rg === 'sul').length >= 3)!;
  l.sort(ordemEvolucao);
  const sp = filtraRegiao(l, regioesDoFiltro('minha', regioesDasProvas(['fuvest', 'unesp'], CATALOGO)));
  const sul = filtraRegiao(l, regioesDoFiltro('minha', regioesDasProvas(['ufpr', 'uel'], CATALOGO)));
  it(`Escada (${sub}): aluno de SP só vê SP + ENEM; aluno do Sul só vê Sul + ENEM`, () => {
    expect(sp.l.every((x) => x.rg === 'sp' || x.rg === 'nac')).toBe(true);
    expect(sul.l.every((x) => x.rg === 'sul' || x.rg === 'nac')).toBe(true);
    expect(sp.l.map((x) => x.id)).not.toEqual(sul.l.map((x) => x.id));
    // a primeira questão do "Treine sua evolução" é a mais fácil da região, na mesma ordem do conteúdo
    expect(sp.l[0].id).toBe(l.find((x) => x.rg === 'sp' || x.rg === 'nac')!.id);
  });
  it('contagem do conteúdo respeita o filtro', () => {
    expect(sp.l.length).toBe(l.filter((x) => x.rg === 'sp' || x.rg === 'nac').length);
    expect(sul.l.length).toBe(l.filter((x) => x.rg === 'sul' || x.rg === 'nac').length);
  });
  it('Treino geral da matéria: questões da região (completa com a região, não com outras)', () => {
    const abc = JSON.parse(readFileSync(join(DEST, 'bio', 'materia.json'), 'utf-8')).essencial.abc as string[];
    const tsp = questoesTreinoGeral(abc, bio, regioesDoFiltro('minha', ['sp']));
    const tsul = questoesTreinoGeral(abc, bio, regioesDoFiltro('minha', ['sul']));
    const por = new Map(bio.map((x) => [x.id, x]));
    expect(tsp.length).toBeGreaterThanOrEqual(15);
    expect(tsul.length).toBeGreaterThanOrEqual(15);
    expect(tsp.every((id) => ['sp', 'nac'].includes(por.get(id)!.rg!))).toBe(true);
    expect(tsul.every((id) => ['sul', 'nac'].includes(por.get(id)!.rg!))).toBe(true);
    expect(questoesTreinoGeral(abc, bio, null)).toEqual(abc);
  });
  it('Treino geral de todas as matérias: o sorteio aceita só a região', () => {
    const conj = regioesDoFiltro('minha', ['sul']);
    const mats = MATS.map((m) => ({ id: m, banco: banco(m) }));
    let x = 1;
    const s = sorteiaMisto(mats, {}, 20, { rnd: () => ((x = (x * 9301 + 49297) % 233280) / 233280), aceita: (_m, y) => passa(y, conj) });
    expect(s.it).toHaveLength(20);
    const por = new Map(mats.flatMap((mm) => mm.banco.map((y) => [mm.id + ':' + y.id, y])));
    expect(s.it.every((it) => ['sul', 'nac'].includes(por.get(it.m + ':' + it.id)!.rg!))).toBe(true);
  });
});

describe('migração v5 -> v6 (região nas preferências)', () => {
  const tent = { letra: 'C' as const, ok: false, ts: 1762000000000, seg: 30, ctx: 'escada' };
  const v5 = { ...estadoVazio(), versao: 5, perfil: { nome: 'A', email: '', provasAlvo: ['fuvest'], meta: 150, criadoEm: 1 },
    pref: { tema: 'escuro', menuFechado: true, ultimaMateria: 'bio' },
    materias: { bio: { ...estadoMateriaVazio(), q: { P1: { tent: [tent], rev: true } }, ult: 'P1' } } } as unknown as Estado;
  it('ganha filtro "Minha região" e região automática, sem perder nada nem mudar ids', () => {
    const e = migraEstado(v5);
    expect(VERSAO_ATUAL).toBe(8);
    expect(e.versao).toBe(8);
    expect(e.pref).toEqual({ tema: 'escuro', menuFechado: true, ultimaMateria: 'bio', regioes: null, filtroRegiao: 'minha' });
    expect(e.materias.bio!.q.P1).toEqual({ tent: [tent], rev: true });
    expect(e.materias.bio!.ult).toBe('P1');
    expect(e.perfil!.provasAlvo).toEqual(['fuvest']);
  });
  it('valores estranhos voltam ao padrão; escolha válida fica', () => {
    const ruim = v5paraV6({ ...v5, pref: { ...v5.pref, regioes: ['xx', 'sul'] as unknown as RegiaoId[], filtroRegiao: 'lua' as never } });
    expect(ruim.pref.regioes).toEqual(['sul']);
    expect(ruim.pref.filtroRegiao).toBe('minha');
    const ok = migraEstado({ ...v5, pref: { ...v5.pref, regioes: ['ne'], filtroRegiao: 'todas' } } as Estado);
    expect(ok.pref).toMatchObject({ regioes: ['ne'], filtroRegiao: 'todas' });
  });
  it('estado novo já nasce na versão atual e não muda ao migrar', () => {
    const e = estadoVazio();
    expect(e.versao).toBe(VERSAO_ATUAL);
    expect(migraEstado(e)).toEqual(e);
  });
});

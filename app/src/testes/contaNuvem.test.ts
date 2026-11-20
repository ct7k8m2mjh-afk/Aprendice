// Contas de verdade (decisão do dono, 20/11/2026): juntar o progresso do aparelho com o da nuvem sem perder nada
// (princípio 7), primeiro login levando o progresso de antes das contas, envio com controle de versão, sair limpando o
// aparelho, e o papel de administrador lido do servidor. Tudo sem rede: o cliente Supabase é um falso em memória.
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { estadoDaNuvem, mesclaEstados, paraNuvem } from '../estado/mescla';
import { estadoVazio, type Estado } from '../estado/tipos';
import { defineClienteNuvem } from '../nuvem/cliente';
import { entraNaConta, enviaAgora, pegaConta, sair, traduzErro } from '../estado/sessao';
import { pegaEstado, substituiSemMarcar } from '../estado/loja';
import { ehAdmin } from '../dados/modoAdmin';
import { monta } from '../dados/conteudo';

const tent = (ts: number, ok = true) => ({ letra: 'A' as const, ok, ts, seg: 20 });
function comQ(e: Estado, m: 'bio' | 'mat', id: string, ts: number[]): Estado {
  const mat = e.materias[m] || { q: {}, ult: null, sims: [], flash: {}, flg: {}, sessoes: [], revs: {}, geral: {} };
  return { ...e, materias: { ...e.materias, [m]: { ...mat, q: { ...mat.q, [id]: { tent: ts.map((t) => tent(t)) } } } } };
}

describe('juntar aparelho e nuvem (estado/mescla.ts)', () => {
  it('une as tentativas dos dois lados, sem duplicar e sem mudar ids', () => {
    const a = comQ(comQ(estadoVazio(), 'bio', 'P1', [1, 2]), 'mat', 'M9', [5]);
    const b = comQ(estadoVazio(), 'bio', 'P1', [2, 3]);
    const j = mesclaEstados(a, b);
    expect(j.materias.bio!.q.P1.tent.map((t) => t.ts)).toEqual([1, 2, 3]);
    expect(j.materias.mat!.q.M9.tent).toHaveLength(1);
  });
  it('nuvem vazia (conta nova) não muda o aparelho', () => {
    const a = comQ(estadoVazio(), 'bio', 'P1', [1]);
    expect(mesclaEstados(a, null)).toBe(a);
    expect(estadoDaNuvem({})).toBeNull();
  });
  it('simulados feitos são unidos; o perfil e o tema ficam com o aparelho', () => {
    const feito = (ts: number) => ({ sid: 'prova:x', titulo: 'X', modo: 'prova' as const, ts, seg: 1, acertos: 1, total: 2, porMateria: {}, itens: [] });
    const a: Estado = { ...estadoVazio(), simuladosFeitos: [feito(1)], perfil: { nome: 'Ana', email: 'a@x.com', provasAlvo: [], meta: 70, criadoEm: 1 }, pref: { ...estadoVazio().pref, tema: 'escuro' } };
    const b: Estado = { ...estadoVazio(), simuladosFeitos: [feito(1), feito(2)], pref: { ...estadoVazio().pref, tema: 'claro' } };
    const j = mesclaEstados(a, b);
    expect(j.simuladosFeitos.map((s) => s.ts)).toEqual([1, 2]);
    expect(j.perfil?.nome).toBe('Ana');
    expect(j.pref.tema).toBe('escuro');
  });
  it('simulado em andamento já entregue no outro aparelho não volta', () => {
    const and = { sid: 'prova:x', titulo: 'X', modo: 'prova' as const, itens: [], resp: {}, marcadas: [], i: 0, limiteSeg: null, usadoSeg: 0, iniciadoEm: 10, pausado: false };
    const a: Estado = { ...estadoVazio(), simulado: and, mexidoEm: 5 };
    const b: Estado = { ...estadoVazio(), simulado: null, mexidoEm: 50, simuladosFeitos: [{ sid: 'prova:x', titulo: 'X', modo: 'prova', ts: 40, seg: 1, acertos: 0, total: 0, porMateria: {}, itens: [] }] };
    expect(mesclaEstados(a, b).simulado).toBeNull();
  });
  it('o que vai para a nuvem não leva perfil, perfis guardados nem o tema do aparelho', () => {
    const e: Estado = { ...estadoVazio(), perfil: { nome: 'Ana', email: 'a@x.com', provasAlvo: [], meta: 70, criadoEm: 1 }, perfisSalvos: { 'b@x.com': { nome: 'B', email: 'b@x.com', provasAlvo: [], meta: 1, criadoEm: 1 } }, conta: 'u1' };
    const n = paraNuvem(e);
    expect(n.perfil).toBeUndefined();
    expect(n.perfisSalvos).toBeUndefined();
    expect(n.conta).toBeUndefined();
    expect((n.pref as Record<string, unknown>).tema).toBeUndefined();
    expect((n.pref as Record<string, unknown>).filtroRegiao).toBe('minha');
  });
});

// ---------- cliente Supabase falso, em memória ----------
type Linha = Record<string, unknown>;
function clienteFalso(banco: { perfis: Linha[]; progresso: Linha[] }, opc: { offline?: boolean } = {}) {
  const chamadas: string[] = [];
  const consulta = (tabela: 'perfis' | 'progresso') => {
    const filtros: [string, unknown][] = [];
    let patch: Linha | null = null;
    const q = {
      select() { return q; },
      update(p: Linha) { patch = p; return q; },
      eq(c: string, v: unknown) { filtros.push([c, v]); return q; },
      async maybeSingle() {
        if (opc.offline) return { data: null, error: { message: 'Failed to fetch' } };
        const l = banco[tabela].find((x) => filtros.every(([c, v]) => x[c] === v));
        return { data: l ? structuredClone(l) : null, error: null };
      },
      then(ok: (r: { data: Linha[] | null; error: unknown }) => void) {
        if (opc.offline) return Promise.resolve({ data: null, error: { message: 'Failed to fetch' } }).then(ok);
        chamadas.push(tabela + ':update');
        const ls = banco[tabela].filter((x) => filtros.every(([c, v]) => x[c] === v));
        // o papel não é atualizável pelo cliente (privilégio de coluna + trava no banco)
        if (patch && 'papel' in patch) return Promise.resolve({ data: null, error: { message: 'permission denied' } }).then(ok);
        for (const l of ls) Object.assign(l, structuredClone(patch));
        return Promise.resolve({ data: ls.map((l) => structuredClone(l)), error: null }).then(ok);
      },
    };
    return q;
  };
  return {
    chamadas,
    from: (t: 'perfis' | 'progresso') => consulta(t),
    auth: { signOut: vi.fn(async () => ({ error: null })) },
  };
}

const UID = '11111111-1111-1111-1111-111111111111';
function linhaPerfil(extra: Linha = {}): Linha { return { id: UID, nome: '', provas_alvo: [], datas_prova: {}, meta: 150, completo: false, papel: 'aluno', criado_em: '2026-11-20T00:00:00Z', ...extra }; }

describe('entrar, enviar e sair (estado/sessao.ts, sem rede)', () => {
  beforeEach(() => { localStorage.clear(); substituiSemMarcar(estadoVazio()); });
  afterEach(async () => { await sair(); defineClienteNuvem(undefined); });

  it('primeiro login: o progresso e o perfil de antes das contas vão para a conta, sem perder nada', async () => {
    const banco = { perfis: [linhaPerfil()], progresso: [{ user_id: UID, dados: comQ(estadoVazio(), 'bio', 'P1', [3]), rev: 4 }] };
    const c = clienteFalso(banco);
    defineClienteNuvem(c as never);
    const antes = comQ(comQ(estadoVazio(), 'bio', 'P1', [1]), 'mat', 'M2', [2]);
    substituiSemMarcar({ ...antes, perfil: { nome: 'Ana', email: 'demo@x.com', provasAlvo: ['fuvest'], meta: 300, criadoEm: 1 } });
    await entraNaConta({ id: UID, email: 'ana@x.com' });
    const e = pegaEstado();
    expect(pegaConta().fase).toBe('dentro');
    expect(e.conta).toBe(UID);
    expect(e.materias.bio!.q.P1.tent.map((t) => t.ts)).toEqual([1, 3]);
    expect(e.materias.mat!.q.M2.tent).toHaveLength(1);
    expect(e.perfil).toMatchObject({ nome: 'Ana', email: 'ana@x.com', provasAlvo: ['fuvest'], meta: 300 });
    // subiu para a nuvem: progresso juntado (rev 5) e perfil completo
    const nuvem = banco.progresso[0] as unknown as { dados: Estado; rev: number };
    expect(nuvem.rev).toBe(5);
    expect(nuvem.dados.materias.mat!.q.M2.tent).toHaveLength(1);
    expect(nuvem.dados.perfil).toBeUndefined();
    expect(banco.perfis[0]).toMatchObject({ nome: 'Ana', provas_alvo: ['fuvest'], meta: 300, completo: true, papel: 'aluno' });
  });

  it('conta com perfil na nuvem: o perfil vem da nuvem; o papel admin liga o modo administrador', async () => {
    const banco = { perfis: [linhaPerfil({ nome: 'Dono', provas_alvo: ['enem'], completo: true, papel: 'admin' })], progresso: [{ user_id: UID, dados: {}, rev: 0 }] };
    defineClienteNuvem(clienteFalso(banco) as never);
    await entraNaConta({ id: UID, email: 'dono@x.com' });
    expect(pegaEstado().perfil).toMatchObject({ nome: 'Dono', provasAlvo: ['enem'] });
    expect(pegaConta().papel).toBe('admin');
    expect(ehAdmin()).toBe(true);
    await sair();
    expect(ehAdmin()).toBe(false);
  });

  it('outro aparelho gravou antes (rev mudou): baixa, junta e envia de novo, sem perder nenhum lado', async () => {
    const banco = { perfis: [linhaPerfil({ completo: true, nome: 'Bia' })], progresso: [{ user_id: UID, dados: {}, rev: 0 }] };
    defineClienteNuvem(clienteFalso(banco) as never);
    await entraNaConta({ id: UID, email: 'bia@x.com' });
    // o outro aparelho grava a questão M7 e sobe a versão
    banco.progresso[0] = { user_id: UID, dados: paraNuvem(comQ(estadoVazio(), 'mat', 'M7', [9])), rev: 7 };
    substituiSemMarcar(comQ({ ...pegaEstado(), mexidoEm: Date.now() }, 'bio', 'P5', [8]));
    expect(await enviaAgora()).toBe(true);
    const n = banco.progresso[0] as unknown as { dados: Estado; rev: number };
    expect(n.rev).toBe(8);
    expect(Object.keys(n.dados.materias.mat!.q)).toEqual(['M7']);
    expect(Object.keys(n.dados.materias.bio!.q)).toEqual(['P5']);
    expect(pegaEstado().materias.mat!.q.M7).toBeTruthy();
  });

  it('sair tira o progresso e o perfil do aparelho (fica na conta); sem internet, guarda uma cópia pendente só desta conta', async () => {
    const banco = { perfis: [linhaPerfil({ completo: true, nome: 'Cai' })], progresso: [{ user_id: UID, dados: {}, rev: 0 }] };
    defineClienteNuvem(clienteFalso(banco) as never);
    await entraNaConta({ id: UID, email: 'cai@x.com' });
    // a internet cai e o aluno responde mais uma
    defineClienteNuvem(clienteFalso(banco, { offline: true }) as never);
    substituiSemMarcar(comQ({ ...pegaEstado(), mexidoEm: Date.now() }, 'bio', 'P9', [11]));
    await sair();
    expect(pegaConta().fase).toBe('fora');
    expect(pegaEstado().perfil).toBeNull();
    expect(pegaEstado().materias).toEqual({});
    expect(localStorage.getItem('aprendice.pendente.' + UID)).toContain('P9');
    // volta a internet e entra de novo: a cópia pendente é juntada e enviada
    defineClienteNuvem(clienteFalso(banco) as never);
    await entraNaConta({ id: UID, email: 'cai@x.com' });
    expect(pegaEstado().materias.bio!.q.P9).toBeTruthy();
    expect(localStorage.getItem('aprendice.pendente.' + UID)).toBeNull();
    expect(JSON.stringify(banco.progresso[0].dados)).toContain('P9');
  });

  it('progresso de outra conta no aparelho nunca vai para a conta que entrou', async () => {
    const banco = { perfis: [linhaPerfil({ completo: true })], progresso: [{ user_id: UID, dados: {}, rev: 0 }] };
    defineClienteNuvem(clienteFalso(banco) as never);
    substituiSemMarcar({ ...comQ(estadoVazio(), 'bio', 'DE-OUTRA', [1]), conta: 'outra-conta' });
    await entraNaConta({ id: UID, email: 'eu@x.com' });
    expect(pegaEstado().materias.bio?.q['DE-OUTRA']).toBeUndefined();
    expect(localStorage.getItem('aprendice.pendente.outra-conta')).toContain('DE-OUTRA');
  });

  it('mensagens do serviço de contas em português', () => {
    expect(traduzErro({ code: 'invalid_credentials' })).toBe('E-mail ou senha incorretos.');
    expect(traduzErro({ message: 'Email not confirmed' })).toMatch(/Confirme/);
    expect(traduzErro({ message: 'Failed to fetch' })).toMatch(/Sem conexão/);
  });
});

describe('modo administrador (dados/conteudo.ts, monta)', () => {
  const q = (id: string, extra: Record<string, unknown> = {}) => ({ id, escola: 'X', ano: '2024', n: '1', banca: 'B', fase: '', enun: '', alts: {}, gab: 'A', modulo: 'B01', sub: 'B01.1', dif: 3, degrau: 0, conceito: '', pista: '', url: '', origem: 'prova', figura: false, ...extra });
  const vazio = { modulos: [], areas: [], flash: [], flashImg: [], essencial: { abc: [], completar: [] } } as never;
  const banco = [q('ok'), q('fora', { pendente: 'gabarito do Aprendice em preparação', gab: '' }), q('artes', { outraMateria: 'Artes', pendente: 'outra matéria: Artes' })] as never[];
  it('o aluno não vê as questões escondidas', () => {
    const mc = monta('bio', banco, vazio, undefined, false);
    expect(mc.banco.map((x) => x.id)).toEqual(['ok']);
    expect(mc.ocultas?.size).toBe(0);
  });
  it('o administrador vê as escondidas à parte (com o motivo), fora do banco dos treinos e simulados', () => {
    const mc = monta('bio', banco, vazio, undefined, true);
    expect(mc.banco.map((x) => x.id)).toEqual(['ok']);
    expect([...mc.ocultas!.keys()].sort()).toEqual(['artes', 'fora']);
    expect(mc.ocultasPorSub!.get('B01.1')).toHaveLength(2);
  });
});

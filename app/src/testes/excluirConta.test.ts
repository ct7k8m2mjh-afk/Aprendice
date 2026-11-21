// Excluir minha conta (LGPD; decisão do dono, 20/11/2026): na nuvem, chama a função do servidor (só a conta logada)
// e limpa o aparelho; se a nuvem falhar, nada é apagado; no modo de demonstração, apaga o que está no aparelho.
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { estadoVazio, type Estado } from '../estado/tipos';
import { defineClienteNuvem } from '../nuvem/cliente';
import { entraNaConta, excluirConta, pegaConta, sair } from '../estado/sessao';
import { pegaEstado, substituiSemMarcar, salvaAgora, CHAVE } from '../estado/loja';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const UID = '22222222-2222-2222-2222-222222222222';
const comQ = (e: Estado): Estado => ({ ...e, materias: { ...e.materias, bio: { q: { P1: { tent: [{ letra: 'A', ok: true, ts: 1, seg: 9 }] } }, ult: null, sims: [], flash: {}, flg: {}, sessoes: [], revs: {}, geral: {} } } });

function clienteFalso(banco: { perfis: Record<string, unknown>[]; progresso: Record<string, unknown>[]; users: string[] }, falhaRpc = false) {
  const consulta = (t: 'perfis' | 'progresso') => {
    const f: [string, unknown][] = [];
    let patch: Record<string, unknown> | null = null;
    const q = {
      select() { return q; }, update(p: Record<string, unknown>) { patch = p; return q; }, eq(c: string, v: unknown) { f.push([c, v]); return q; },
      async maybeSingle() { const l = banco[t].find((x) => f.every(([c, v]) => x[c] === v)); return { data: l ? structuredClone(l) : null, error: null }; },
      then(ok: (r: unknown) => void) { const ls = banco[t].filter((x) => f.every(([c, v]) => x[c] === v)); for (const l of ls) Object.assign(l, structuredClone(patch)); return Promise.resolve({ data: ls, error: null }).then(ok); },
    };
    return q;
  };
  const rpc = vi.fn(async (nome: string) => {
    if (falhaRpc) return { data: null, error: { message: 'Failed to fetch' } };
    if (nome !== 'excluir_minha_conta') return { data: null, error: { message: 'function not found' } };
    // o servidor apaga só a conta logada (auth.uid())
    banco.perfis = banco.perfis.filter((x) => x.id !== UID);
    banco.progresso = banco.progresso.filter((x) => x.user_id !== UID);
    banco.users = banco.users.filter((x) => x !== UID);
    return { data: null, error: null };
  });
  return { from: (t: 'perfis' | 'progresso') => consulta(t), rpc, auth: { signOut: vi.fn(async () => ({ error: null })) } };
}

const perfil = { nome: 'Ana', email: 'ana@x.com', provasAlvo: ['fuvest'], meta: 150, criadoEm: 1 };

describe('excluir minha conta', () => {
  beforeEach(() => { localStorage.clear(); substituiSemMarcar(estadoVazio()); });
  afterEach(async () => { await sair(); defineClienteNuvem(undefined); });

  it('na nuvem: chama a função do servidor, apaga perfil, progresso e usuário, e limpa o aparelho', async () => {
    const OUTRO = '33333333-3333-3333-3333-333333333333';
    const banco = {
      perfis: [{ id: UID, nome: 'Ana', provas_alvo: [], datas_prova: {}, meta: 150, completo: true, papel: 'aluno', criado_em: '2026-11-20T00:00:00Z' }, { id: OUTRO }],
      progresso: [{ user_id: UID, dados: {}, rev: 0 }, { user_id: OUTRO, dados: {}, rev: 0 }],
      users: [UID, OUTRO],
    };
    const c = clienteFalso(banco);
    defineClienteNuvem(c as never);
    substituiSemMarcar(comQ({ ...estadoVazio(), perfil }));
    await entraNaConta({ id: UID, email: 'ana@x.com' });
    localStorage.setItem(CHAVE + '.anterior', 'copia');
    localStorage.setItem('aprendice.pendente.' + UID, '{}');
    expect(await excluirConta()).toBeNull();
    expect(c.rpc).toHaveBeenCalledWith('excluir_minha_conta');
    expect(c.auth.signOut).toHaveBeenCalled();
    expect(banco.users).toEqual([OUTRO]);
    expect(banco.perfis.map((x) => x.id)).toEqual([OUTRO]);
    expect(banco.progresso.map((x) => x.user_id)).toEqual([OUTRO]);
    const e = pegaEstado();
    expect(e.perfil).toBeNull();
    expect(e.conta ?? null).toBeNull();
    expect(Object.keys(e.materias)).toHaveLength(0);
    expect(localStorage.getItem(CHAVE + '.anterior')).toBeNull();
    expect(localStorage.getItem('aprendice.pendente.' + UID)).toBeNull();
    expect(pegaConta()).toMatchObject({ fase: 'fora', uid: null });
  });

  it('se a nuvem falhar, nada é apagado e o aluno vê o erro', async () => {
    const banco = { perfis: [{ id: UID, nome: 'Ana', provas_alvo: [], datas_prova: {}, meta: 150, completo: true, papel: 'aluno', criado_em: '2026-11-20T00:00:00Z' }], progresso: [{ user_id: UID, dados: {}, rev: 0 }], users: [UID] };
    defineClienteNuvem(clienteFalso(banco, true) as never);
    substituiSemMarcar(comQ({ ...estadoVazio(), perfil }));
    await entraNaConta({ id: UID, email: 'ana@x.com' });
    expect(await excluirConta()).toMatch(/internet/);
    expect(pegaConta().fase).toBe('dentro');
    expect(pegaEstado().materias.bio?.q.P1).toBeDefined();
    expect(banco.users).toEqual([UID]);
  });

  it('modo de demonstração: apaga o perfil, o progresso e as cópias do aparelho; outras contas guardadas ficam', async () => {
    const outra = { ...perfil, nome: 'Bia', email: 'bia@x.com' };
    substituiSemMarcar(comQ({ ...estadoVazio(), perfil, perfisSalvos: { 'ana@x.com': perfil, 'bia@x.com': outra } }));
    salvaAgora();
    localStorage.setItem(CHAVE + '.zerado.1', 'copia');
    expect(await excluirConta()).toBeNull();
    const e = pegaEstado();
    expect(e.perfil).toBeNull();
    expect(Object.keys(e.materias)).toHaveLength(0);
    expect(Object.keys(e.perfisSalvos || {})).toEqual(['bia@x.com']);
    expect(localStorage.getItem(CHAVE + '.zerado.1')).toBeNull();
  });

  it('a função do servidor só apaga a conta logada e não fica aberta para visitantes', () => {
    const sql = readFileSync(resolve(__dirname, '../../../supabase/migrations/20261120230000_excluir_conta.sql'), 'utf8');
    expect(sql).toMatch(/security definer set search_path = ''/);
    expect(sql).toMatch(/uid uuid := auth\.uid\(\)/);
    expect(sql).toMatch(/delete from auth\.users where id = uid;/);
    expect(sql).toMatch(/revoke all on function public\.excluir_minha_conta\(\) from public, anon;/);
    expect(sql).toMatch(/grant execute on function public\.excluir_minha_conta\(\) to authenticated;/);
  });
});

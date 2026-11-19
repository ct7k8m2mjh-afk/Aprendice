// "Sair da conta" não apaga o perfil (revisão de 19/11/2026, casca 38)
import { describe, expect, it } from 'vitest';
import { saiDaConta, voltaAConta } from '../estado/conta';
import { migraEstado } from '../estado/migracao';
import { estadoVazio, type Estado } from '../estado/tipos';

const perfil = { nome: 'Ana', email: 'ana@x.com', provasAlvo: ['fuvest', 'unesp'], meta: 300, criadoEm: 1, datasProva: { fuvest: '2026-11-22' } };

describe('sair e entrar de novo', () => {
  const e0: Estado = { ...estadoVazio(), perfil, materias: { bio: { q: { P1: { tent: [{ ok: true, ts: 1, seg: 30 }] } } } as never } };
  const fora = saiDaConta(e0);
  it('sair tira o aluno da conta, mas guarda o perfil e não toca no progresso', () => {
    expect(fora.perfil).toBeNull();
    expect(fora.perfilSalvo).toEqual(perfil);
    expect(fora.materias).toBe(e0.materias);
  });
  it('entrar de novo devolve nome, provas-alvo, datas e meta', () => {
    const dentro = voltaAConta(fora, 'ana@x.com')!;
    expect(dentro.perfil).toEqual(perfil);
    expect(dentro.perfilSalvo).toBeNull();
  });
  it('sem perfil guardado é conta nova: segue as boas-vindas', () => {
    expect(voltaAConta(estadoVazio(), 'novo@x.com')).toBeNull();
  });
  it('o perfil guardado sobrevive à migração do estado salvo', () => {
    const m = migraEstado(JSON.parse(JSON.stringify(fora)));
    expect(m.perfilSalvo).toEqual(perfil);
  });
});

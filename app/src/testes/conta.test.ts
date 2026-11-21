// "Sair da conta" não apaga o perfil (revisão de 19/11/2026, casca 38) e o perfil só volta para a mesma conta
// (privacidade, revisão de 20/11/2026, casca N5)
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
    expect(fora.perfisSalvos?.['ana@x.com']).toEqual(perfil);
    expect(fora.materias).toBe(e0.materias);
  });
  it('entrar de novo com o mesmo e-mail devolve nome, provas-alvo, datas e meta', () => {
    const dentro = voltaAConta(fora, 'ana@x.com')!;
    expect(dentro.perfil).toEqual(perfil);
    expect(dentro.perfisSalvos?.['ana@x.com']).toBeUndefined();
  });
  it('o mesmo e-mail com maiúsculas ou espaços é a mesma conta', () => {
    expect(voltaAConta(fora, '  Ana@X.com ')!.perfil!.nome).toBe('Ana');
  });
  it('sem perfil guardado é conta nova: segue as boas-vindas', () => {
    expect(voltaAConta(estadoVazio(), 'novo@x.com')).toBeNull();
  });
  it('o perfil guardado sobrevive à migração do estado salvo', () => {
    const m = migraEstado(JSON.parse(JSON.stringify(fora)));
    expect(m.perfisSalvos?.['ana@x.com']).toEqual(perfil);
  });
});

describe('privacidade: outra conta no mesmo aparelho', () => {
  const fora = saiDaConta({ ...estadoVazio(), perfil });
  it('entrar com OUTRO e-mail não herda nome, provas-alvo, datas nem meta', () => {
    expect(voltaAConta(fora, 'outra.pessoa@exemplo.com')).toBeNull();
  });
  it('e-mail vazio não abre perfil nenhum', () => {
    expect(voltaAConta(fora, '  ')).toBeNull();
  });
  it('duas contas guardadas: cada uma recebe só o seu perfil', () => {
    const bia = { ...perfil, nome: 'Bia', email: 'bia@x.com', provasAlvo: ['enem'], meta: 100, datasProva: {} };
    const dentroBia = { ...fora, perfil: bia };
    const foraDasDuas = saiDaConta(dentroBia);
    expect(voltaAConta(foraDasDuas, 'bia@x.com')!.perfil).toEqual(bia);
    const ana = voltaAConta(foraDasDuas, 'ana@x.com')!;
    expect(ana.perfil).toEqual(perfil);
    expect(ana.perfisSalvos?.['bia@x.com']).toEqual(bia);
  });
  it('estado antigo com `perfilSalvo` único: só volta para o e-mail dele', () => {
    const antigo: Estado = { ...estadoVazio(), perfilSalvo: perfil };
    expect(voltaAConta(antigo, 'outra@x.com')).toBeNull();
    const ok = voltaAConta(antigo, 'ana@x.com')!;
    expect(ok.perfil).toEqual(perfil);
    expect(ok.perfilSalvo).toBeNull();
  });
});

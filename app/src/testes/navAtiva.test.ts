import { describe, expect, it } from 'vitest';
import { destinoAba, destinoAtivo, materiaAtivaNoMenu } from '../logica/navAtiva';

describe('destino ativo do menu e das abas (revisão de 19/11/2026, casca 23 e 31)', () => {
  it('simulado em andamento e resultado ficam em Simulados', () => {
    expect(destinoAtivo('/simulado/agora')).toBe('/simulados');
    expect(destinoAtivo('/simulado/resultado/123')).toBe('/simulados');
    expect(destinoAtivo('/simulados')).toBe('/simulados');
  });
  it('a sessão de revisão fica em Revisão, mesmo dentro da matéria', () => {
    expect(destinoAtivo('/m/bio/q/P1', '?ctx=revisao')).toBe('/revisao');
    expect(destinoAtivo('/m/bio/q/P1', '?ctx=escada')).toBe('/materias');
    expect(destinoAtivo('/revisao')).toBe('/revisao');
  });
  it('início e perfil', () => {
    expect(destinoAtivo('/')).toBe('/');
    expect(destinoAtivo('/perfil')).toBe('/perfil');
  });
});

describe('um destino ativo só (revisão de 20/11/2026, casca N4 e N6)', () => {
  it('na sessão de revisão a matéria não fica ativa no menu', () => {
    expect(materiaAtivaNoMenu('/m/bio/q/P1', '?ctx=revisao', 'bio')).toBe(false);
    expect(materiaAtivaNoMenu('/m/bio/q/P1', '?ctx=escada', 'bio')).toBe(true);
    expect(materiaAtivaNoMenu('/m/bio', '', 'bio')).toBe(true);
    expect(materiaAtivaNoMenu('/m/bio', '', 'qui')).toBe(false);
  });
  it('Configurações acende a aba Perfil no celular', () => {
    expect(destinoAba('/config')).toBe('/perfil');
    expect(destinoAtivo('/config')).toBe('/config');
    expect(destinoAba('/revisao')).toBe('/revisao');
  });
});

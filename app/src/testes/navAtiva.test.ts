import { describe, expect, it } from 'vitest';
import { destinoAtivo } from '../logica/navAtiva';

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

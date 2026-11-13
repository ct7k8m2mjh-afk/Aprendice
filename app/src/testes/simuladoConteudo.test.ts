// Simulado por conteúdo (pedido do dono, 11/11/2026): só questões dos conteúdos escolhidos, divididas entre eles,
// novas primeiro, sem questão fora do ar, da mais fácil à mais difícil.
import { describe, expect, it } from 'vitest';
import { planoDoConteudo } from '../logica/simulados';
import type { Questao } from '../dados/tipos';

function semente(s: number) {
  return () => { s |= 0; s = (s + 0x6d2b79f5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
const q = (id: string, sub: string, dif: number, extra: Partial<Questao> = {}) => ({ id, sub, dif, escola: 'ENEM', modulo: sub.split('.')[0], ...extra }) as Questao;
const banco = [
  ...Array.from({ length: 12 }, (_, i) => q('a' + i, 'B01.1', 1 + (i % 10))),
  ...Array.from({ length: 3 }, (_, i) => q('b' + i, 'B01.2', 5)),
  q('c0', 'B02.1', 2),
  q('p0', 'B01.1', 1, { pendente: 'sem fonte' }),
];
const nomes = { 'B01.1': 'membrana', 'B01.2': 'transporte' };

describe('planoDoConteudo', () => {
  it('só traz questões dos conteúdos escolhidos, sem as fora do ar', () => {
    const p = planoDoConteudo('bio', banco, ['B01.1'], 45, nomes, { rnd: semente(1) });
    expect(p.itens).toHaveLength(12);
    expect(p.itens.every((x) => x.id.startsWith('a') && x.m === 'bio')).toBe(true);
    expect(p.titulo).toBe('Simulado de membrana');
    expect(p.itens[0].a).toBe('membrana');
  });
  it('divide entre os conteúdos e completa com o que sobra', () => {
    const p = planoDoConteudo('bio', banco, ['B01.2', 'B01.1'], 10, nomes, { rnd: semente(2) });
    expect(p.itens).toHaveLength(10);
    expect(p.itens.filter((x) => x.id.startsWith('b'))).toHaveLength(3);
    expect(p.sid).toBe('conteudo:bio:B01.1,B01.2');
  });
  it('ordena do nível mais fácil ao mais difícil', () => {
    const p = planoDoConteudo('bio', banco, ['B01.1'], 10, nomes, { rnd: semente(3) });
    const difs = p.itens.map((x) => banco.find((y) => y.id === x.id)!.dif);
    expect([...difs].sort((a, b) => a - b)).toEqual(difs);
  });
  it('prefere as questões ainda não respondidas', () => {
    const respondidas = new Set(['a0', 'a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7']);
    const p = planoDoConteudo('bio', banco, ['B01.1'], 4, nomes, { respondidas, rnd: semente(4) });
    expect(p.itens.map((x) => x.id).sort()).toEqual(['a10', 'a11', 'a8', 'a9']);
  });
});

// Critério único de contagem pelo filtro de região (revisão de 19/11/2026, item 3 das matérias): a lista de prática de
// cada conteúdo (com a reserva de todas as regiões) e o tema como a soma dessas listas.
import { describe, expect, it } from 'vitest';
import { filtraRegiao, filtraTema, type RegiaoId } from '../logica/regiao';

const q = (id: string, rg: RegiaoId) => ({ id, escola: 'X', rg });
const banco: Record<string, ReturnType<typeof q>[]> = {
  'B01.1': [q('a', 'nac'), q('b', 'sp'), q('c', 'sp')],      // 1 do ENEM, 2 de SP
  'B01.2': [q('d', 'sp'), q('e', 'sul')],                    // nenhuma do ENEM: reserva
  'B01.3': [],
};
const enem = new Set<RegiaoId>(['nac']);

describe('filtraTema', () => {
  const ft = filtraTema(Object.keys(banco), (id) => banco[id], enem);
  it('cada conteúdo usa a mesma lista que a Escada usa', () => {
    for (const id of ['B01.1', 'B01.2']) expect(ft.porSub.get(id)!.l).toEqual(filtraRegiao(banco[id], enem).l);
    expect(ft.porSub.has('B01.3')).toBe(false);
  });
  it('o tema é a soma das listas dos conteúdos (nenhum número contradiz outro)', () => {
    expect(ft.l.map((x) => x.id)).toEqual(['a', 'd', 'e']);
    expect(ft.l.length).toBe([...ft.porSub.values()].reduce((s, f) => s + f.l.length, 0));
    expect(ft.daRegiao).toBe(1);
    expect(ft.total).toBe(5);
    expect(ft.subsReserva).toBe(1);
    expect(ft.poucas).toBe(true);
    expect(ft.reserva).toBe(false);
  });
  it('sem filtro (todas as regiões) é o banco inteiro, sem aviso', () => {
    const t = filtraTema(Object.keys(banco), (id) => banco[id], null);
    expect(t.l.length).toBe(5);
    expect(t.poucas || t.reserva).toBe(false);
  });
  it('tema sem nenhuma da região: reserva no tema inteiro, sem o "só N"', () => {
    const t = filtraTema(['B01.2'], (id) => banco[id], enem);
    expect(t.reserva).toBe(true);
    expect(t.poucas).toBe(false);
  });
});

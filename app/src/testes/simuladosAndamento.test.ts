import { describe, expect, it } from 'vitest';
import { estadoVazio, type Estado, type SimuladoAndamento, type SimuladoFeito } from '../estado/tipos';
import { abreSimulado, chaveAndamento, emAndamento, mesclaAndamento, retomaSimulado } from '../logica/simuladosAndamento';
import { mesclaEstados } from '../estado/mescla';
import { aplicaRetiradas } from '../estado/migracao';

const sim = (sid: string, t: number, resp: SimuladoAndamento['resp'] = {}): SimuladoAndamento => ({
  sid, titulo: sid, modo: 'prova', itens: [{ id: 'q1', p: sid }, { id: 'q2', p: sid }], resp, marcadas: [], i: 0, limiteSeg: null, usadoSeg: t, iniciadoEm: t, pausado: false,
});
const feito = (sid: string, ts: number): SimuladoFeito => ({ sid, titulo: sid, modo: 'prova', ts, seg: 1, acertos: 0, total: 0, porMateria: {}, itens: [] });

// pedido do dono (27/11/2026): começar outro simulado sem entregar o aberto; o aberto fica salvo como pendente
describe('vários simulados em andamento', () => {
  it('abrir outro guarda o aberto como pendente, pausado, sem perder respostas', () => {
    const a = sim('prova:a', 10, { q1: { letra: 'B', seg: 30 } });
    let e: Estado = { ...estadoVazio(), simulado: a };
    e = abreSimulado(e, sim('prova:b', 20));
    expect(e.simulado?.sid).toBe('prova:b');
    expect(e.simuladosPendentes).toHaveLength(1);
    expect(e.simuladosPendentes![0]).toMatchObject({ sid: 'prova:a', pausado: true, resp: { q1: { letra: 'B' } }, usadoSeg: 10 });
    expect(emAndamento(e).map((x) => x.sid)).toEqual(['prova:b', 'prova:a']);
  });
  it('abrir uma prova que já está pendente retoma a mesma, sem duplicar', () => {
    let e: Estado = { ...estadoVazio(), simulado: sim('prova:b', 20), simuladosPendentes: [sim('prova:a', 10, { q2: { letra: 'C', seg: 5 } })] };
    e = abreSimulado(e, sim('prova:a', 99));
    expect(e.simulado).toMatchObject({ sid: 'prova:a', iniciadoEm: 10, resp: { q2: { letra: 'C' } }, pausado: false });
    expect(e.simuladosPendentes!.map((x) => x.sid)).toEqual(['prova:b']);
    expect(emAndamento(e)).toHaveLength(2);
  });
  it('retomar pela chave troca o aberto com o pendente', () => {
    const a = sim('prova:a', 10);
    let e: Estado = { ...estadoVazio(), simulado: sim('prova:b', 20), simuladosPendentes: [a] };
    e = retomaSimulado(e, chaveAndamento(a));
    expect(e.simulado?.sid).toBe('prova:a');
    expect(e.simuladosPendentes!.map((x) => x.sid)).toEqual(['prova:b']);
  });
  it('estado antigo, sem a lista de pendentes, continua igual', () => {
    const e: Estado = { ...estadoVazio(), simulado: sim('prova:a', 10) };
    expect(emAndamento(e).map((x) => x.sid)).toEqual(['prova:a']);
    expect(aplicaRetiradas(e)).toBe(e);
  });
  it('juntar com a nuvem une os pendentes dos dois aparelhos, sem repetir e sem os já entregues', () => {
    const a: Estado = { ...estadoVazio(), mexidoEm: 50, simulado: sim('prova:x', 40), simuladosPendentes: [sim('prova:a', 10, { q1: { letra: 'A', seg: 1 } })] };
    const b: Estado = { ...estadoVazio(), mexidoEm: 5, simulado: sim('prova:a', 10), simuladosPendentes: [sim('prova:c', 30)], simuladosFeitos: [feito('prova:c', 35)] };
    const j = mesclaEstados(a, b);
    expect(j.simulado?.sid).toBe('prova:x');
    // a cópia mais adiantada de prova:a (com resposta) fica; prova:c já foi entregue e não volta
    expect(j.simuladosPendentes!.map((x) => x.sid)).toEqual(['prova:a']);
    expect(j.simuladosPendentes![0].resp.q1?.letra).toBe('A');
  });
  it('o aberto que foi entregue no outro aparelho não volta, e os pendentes continuam', () => {
    const r = mesclaAndamento({ simulado: sim('prova:a', 10), simuladosPendentes: [sim('prova:b', 20)] }, { simulado: null }, [feito('prova:a', 15)]);
    expect(r.simulado).toBeNull();
    expect(r.simuladosPendentes!.map((x) => x.sid)).toEqual(['prova:b']);
  });
});

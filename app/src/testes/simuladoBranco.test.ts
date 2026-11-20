// Questão em branco no simulado entra na revisão espaçada, como o resultado promete (revisão de 19/11/2026, casca 20)
import { describe, expect, it } from 'vitest';
import { finaliza } from '../telas/SimuladoExec';
import { monta } from '../dados/conteudo';
import { pegaEstado } from '../estado/loja';
import { filaDe } from '../logica/revisao';
import type { Questao } from '../dados/tipos';
import type { SimuladoAndamento } from '../estado/tipos';

const q = (id: string) => ({ id, escola: 'ENEM', ano: '2023', n: '1', gab: 'A', modulo: 'B01', sub: 'B01.1', dif: 3, alts: {}, origem: 'prova' }) as unknown as Questao;

describe('simulado: erros e questões em branco vão para a revisão', () => {
  it('a errada e a em branco entram na fila; a certa não', () => {
    const mc = monta('bio', [q('certa'), q('errada'), q('branco')], { modulos: [], areas: [], flash: [], flashImg: [], essencial: { abc: [], completar: [] } } as never);
    const sim: SimuladoAndamento = {
      sid: 'conteudo:bio:B01.1', titulo: 'Simulado', modo: 'prova', i: 0, limiteSeg: null, usadoSeg: 60, iniciadoEm: 1, pausado: false, marcadas: [],
      itens: [{ m: 'bio', id: 'certa' }, { m: 'bio', id: 'errada' }, { m: 'bio', id: 'branco' }],
      resp: { certa: { letra: 'A', seg: 20 }, errada: { letra: 'C', seg: 20, conf: 'certeza' } },
    };
    const feito = finaliza(sim, [mc], null);
    expect(feito.total).toBe(3);
    expect(feito.acertos).toBe(1);
    const s = pegaEstado().materias.bio!;
    expect(filaDe(s.q.certa)).toBeNull();
    expect(filaDe(s.q.errada)).not.toBeNull();
    expect(filaDe(s.q.branco)).not.toBeNull();
    expect(s.q.branco.tent.at(-1)).toMatchObject({ letra: null, ok: false, ctx: 'simulado' });
  });
});

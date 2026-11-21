import { describe, expect, it } from 'vitest';
import { confereCompletar, criaCorretor, mesmoNum, nums } from '../logica/correcao';
import { filaDe, emNDias, marcaFlash, proximoFlash, DIA } from '../logica/revisao';
import type { Completar, Flashcard } from '../dados/tipos';
import type { EstadoQuestao } from '../estado/tipos';

const um = (s: string) => nums(s)[0];

describe('correção local: números pelo valor', () => {
  it('sinal importa', () => { expect(mesmoNum(um('-1'), um('1'))).toBe(false); expect(mesmoNum(um('menos 1'), um('-1'))).toBe(true); });
  it('frações diferentes não casam', () => { expect(mesmoNum(um('1/8'), um('3/8'))).toBe(false); expect(mesmoNum(um('2/4'), um('0,5'))).toBe(true); });
  it('vírgula decimal e ordem dos dígitos', () => { expect(mesmoNum(um('4,2'), um('2,4'))).toBe(false); expect(mesmoNum(um('4,2'), um('4.2'))).toBe(true); });
  it('porcentagem', () => { expect(mesmoNum(um('25%'), um('0,25'))).toBe(true); expect(mesmoNum(um('25%'), um('25'))).toBe(true); });
  it('notação científica e potência', () => { expect(mesmoNum(um('6 · 10²³'), um('6x10^23'))).toBe(true); expect(mesmoNum(um('3³'), um('27'))).toBe(true); });
  it('raiz', () => { expect(mesmoNum(um('2√3'), um('√12'))).toBe(true); });
  it('índice químico não é número', () => { expect(nums('Na2SO4')).toEqual([]); });
});

describe('correção local de flashcards', () => {
  const c: Flashcard = { id: 'bio-d001', mod: 'B01', sub: 'B01.1', frente: 'Por que a hemácia incha em água destilada?', verso: 'Porque o meio é hipotônico: a água entra na hemácia por osmose até a membrana romper.', essencial: ['osmose', 'hipotônico'], aceita: ['entra água por osmose', 'meio hipotônico'] };
  const corr = criaCorretor([c]);
  it('resposta com as ideias essenciais = certo', () => { expect(corr(c, 'o meio é hipotônico e a água entra por osmose').veredito).toBe('certo'); });
  it('metade das ideias = quase', () => { expect(corr(c, 'por osmose').veredito).not.toBe('errado'); });
  it('nada a ver = errado', () => { expect(corr(c, 'porque a célula tem parede celular').veredito).toBe('errado'); });
  it('número errado não passa', () => {
    const n: Flashcard = { id: 'mat-d001', mod: 'M01', sub: 'M01.1', frente: 'Quanto é 1/2 de 1/4?', verso: '1/8', essencial: ['1/8'] };
    const cn = criaCorretor([n]);
    expect(cn(n, '3/8').veredito).toBe('errado');
    expect(cn(n, '0,125').veredito).toBe('certo');
  });
});

describe('frases para completar', () => {
  const c: Completar = { id: 'bio-k001', mod: 'B01', sub: 'B01.2', frase: 'Contra o gradiente, gastando ATP, é o transporte ___.', resp: 'ativo', aceita: ['transporte ativo'] };
  it('aceita a resposta e variações', () => { expect(confereCompletar(c, 'ativo')).toBe('certo'); expect(confereCompletar(c, 'Ativo.')).toBe('certo'); expect(confereCompletar(c, 'transporte ativo')).toBe('certo'); });
  it('recusa o oposto', () => { expect(confereCompletar(c, 'passivo')).toBe('errado'); });
});

describe('revisão espaçada de questões (1, 3, 7, 16, 35 dias)', () => {
  const t0 = new Date(2026, 10, 1, 10).getTime();
  it('errou: volta amanhã', () => {
    const eq: EstadoQuestao = { tent: [{ letra: 'A', ok: false, ts: t0, seg: 30 }] };
    expect(filaDe(eq)!.vence).toBe(emNDias(t0, 1));
  });
  it('acertou na data: avança para 3 dias', () => {
    const eq: EstadoQuestao = { tent: [{ letra: 'A', ok: false, ts: t0, seg: 30 }, { letra: 'B', ok: true, ts: t0 + DIA + 1000, seg: 20 }] };
    expect(filaDe(eq)!.etapa).toBe(1);
  });
  it('acertar antes da data não conta', () => {
    const eq: EstadoQuestao = { tent: [{ letra: 'A', ok: false, ts: t0, seg: 30 }, { letra: 'B', ok: true, ts: t0 + 60000, seg: 20 }] };
    expect(filaDe(eq)!.etapa).toBe(0);
  });
  it('chute certo também entra na fila', () => {
    expect(filaDe({ tent: [{ letra: 'B', ok: true, ts: t0, seg: 10, conf: 'chute' }] })).not.toBeNull();
  });
  it('acerto seguro direto não entra na fila', () => {
    expect(filaDe({ tent: [{ letra: 'B', ok: true, ts: t0, seg: 10, conf: 'certeza' }] })).toBeNull();
  });
});

describe('revisão de flashcards (1, 3, 7, 16, 35, 80 dias)', () => {
  const t0 = new Date(2026, 10, 1, 10).getTime();
  it('errei volta hoje; quase volta amanhã', () => {
    expect(proximoFlash(undefined, 'e', t0).vence).toBe(t0);
    expect(proximoFlash(undefined, 'q', t0).vence).toBe(emNDias(t0, 1));
  });
  it('acertos sucessivos sobem os degraus', () => {
    let r = marcaFlash(undefined, 'a', t0);
    expect(r.etapa).toBe(0);
    r = marcaFlash(r, 'a', r.vence);
    expect(r.etapa).toBe(1);
    expect(r.vence).toBe(emNDias(emNDias(t0, 1), 3));
  });
});

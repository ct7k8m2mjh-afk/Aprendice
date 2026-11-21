// Comando 21 do dono: as questões de sites didáticos saíram do site sem perder o progresso do aluno (princípio 7).
import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { aplicaRetiradas, importaArquivo, migraEstado, retirada, VERSAO_ATUAL, type TabelaRetiradas } from '../estado/migracao';
import { estadoMateriaVazio, estadoVazio, type Estado, type EstadoMateria } from '../estado/tipos';
import { RETIRADAS } from '../dados/questoesRetiradas';
import { questoesVencidas, resumoMateria } from '../logica/estatisticas';
import { desempenhoPorNivel } from '../logica/nivel';
import type { MateriaCarregada } from '../dados/conteudo';
import type { Questao } from '../dados/tipos';

// tabela de teste no mesmo formato da gerada (src/dados/questoesRetiradas.ts)
const TAB: TabelaRetiradas = {
  qui: { Wq1: ['Q01.1', 5, 'qui', 'Pprova1'], Wq2: ['Q02.1', 3] },
  mat: { Wm1: ['M03.5', 4, 'qui', 'Pprova2'], Wm2: ['M01.1', 2] },
};
const t = (ts: number, ok: boolean, letra: 'A' | 'B' = ok ? 'A' : 'B') => ({ letra, ok, ts, seg: 30 });

function v2(materias: Estado['materias'], extra: Partial<Estado> = {}): Estado {
  return { ...estadoVazio(), versao: 2, materias, ...extra };
}

describe('migração v2 -> v3: questões de site retiradas', () => {
  it('leva o histórico para a questão de prova equivalente e mescla com o que já havia nela', () => {
    const e = migraEstado(v2({ qui: { ...estadoMateriaVazio(), ult: 'Wq1', q: { Wq1: { tent: [t(1, false), t(5, true)], rev: true }, Pprova1: { tent: [t(9, true)] } } } }), TAB);
    expect(e.versao).toBe(VERSAO_ATUAL);
    const q = e.materias.qui!;
    expect(q.q.Wq1).toBeUndefined();
    expect(q.q.Pprova1.tent.map((x) => x.ts)).toEqual([1, 5, 9]);
    expect(q.q.Pprova1.rev).toBe(true);
    expect(q.ult).toBe('Pprova1');
  });

  it('leva o histórico para a outra matéria quando a questão de prova é de lá', () => {
    const e = migraEstado(v2({ mat: { ...estadoMateriaVazio(), q: { Wm1: { tent: [t(3, false)] } } } }), TAB);
    expect(e.materias.mat!.q.Wm1).toBeUndefined();
    expect(e.materias.qui!.q.Pprova2.tent).toHaveLength(1);
  });

  it('sem equivalente: o histórico fica guardado no id antigo (nada é apagado)', () => {
    const antes = v2({ qui: { ...estadoMateriaVazio(), ult: 'Wq2', q: { Wq2: { tent: [t(2, false)], rev: true } } } });
    const e = migraEstado(antes, TAB);
    expect(e.materias.qui!.q.Wq2).toEqual({ tent: [t(2, false)], rev: true });
    expect(e.materias.qui!.ult).toBe('Wq2');
  });

  it('é idempotente: rodar de novo não duplica nem perde tentativas', () => {
    const e1 = migraEstado(v2({ qui: { ...estadoMateriaVazio(), q: { Wq1: { tent: [t(1, false)] }, Wq2: { tent: [t(2, true)] } } } }), TAB);
    const e2 = migraEstado(e1, TAB);
    expect(e2).toBe(e1);
    expect(e2.materias.qui!.q.Pprova1.tent).toHaveLength(1);
    expect(e2.materias.qui!.q.Wq2.tent).toHaveLength(1);
  });

  it('treino geral em andamento: item com equivalente vira a questão de prova; sem equivalente sai e a posição acompanha', () => {
    const treino = { mat: { it: [{ k: 'q' as const, id: 'Wm2' }, { k: 'f' as const, id: 'mat-d1' }, { k: 'q' as const, id: 'X1' }], i: 2, res: {}, t0: 1 },
      qui: { it: [{ k: 'q' as const, id: 'Wq1' }, { k: 'c' as const, id: 'qui-c1' }], i: 1, res: {}, t0: 1 } };
    const e = aplicaRetiradas(v2({}, { treino }), TAB);
    expect(e.treino.mat!.it.map((x) => x.id)).toEqual(['mat-d1', 'X1']);
    expect(e.treino.mat!.i).toBe(1);
    expect(e.treino.qui!.it[0].id).toBe('Pprova1');
  });

  it('arquivo exportado antigo com ids de site: importa sem descartar e aplica a tabela real', () => {
    const [m, mapa] = Object.entries(RETIRADAS).find(([, x]) => Object.values(x!).some((r) => !r[2]))!;
    const semEq = Object.entries(mapa!).find(([, r]) => !r[2])![0];
    const comEq = Object.entries(RETIRADAS.qui!).find(([, r]) => r[2] === 'qui')!;
    const arquivo = { versao: 2, materias: { [m]: { q: { [semEq]: { tent: [t(10, false)] } } }, qui: { q: { [comEq[0]]: { tent: [t(11, true)] } } } } };
    const { estado, r } = importaArquivo(estadoVazio(), JSON.stringify(arquivo), { [m]: new Set(), qui: new Set() });
    expect(r.erro).toBeUndefined();
    expect(estado.materias[m as 'bio']!.q[semEq].tent).toHaveLength(1);
    expect(estado.materias.qui!.q[comEq[1][3]!].tent[0].ts).toBe(11);
  });

  it('tabela real: toda questão de site tem conteúdo e dificuldade; destino só para questão de prova', () => {
    let n = 0;
    for (const [m, x] of Object.entries(RETIRADAS)) for (const [id, r] of Object.entries(x!)) {
      n++;
      expect(id.startsWith('W')).toBe(true);
      expect(r[0]).toMatch(/^[A-Z]\d\d\.\d+$/);
      if (r[2]) expect(r[3]).toBeTruthy();
      expect(retirada(m as 'bio', id)).not.toBeNull();
    }
    expect(n).toBe(788);
  });
});

// matéria de mentira: conteúdo Q02.1 com duas questões no ar; Wq2 (retirada, sem equivalente) tem histórico
function mc(): MateriaCarregada {
  const q = (id: string, dif: number, extra: Partial<Questao> = {}): Questao => ({ id, escola: 'Fuvest', ano: '2024', n: '1', banca: '', fase: '', enun: '', alts: {}, gab: 'A',
    modulo: 'Q02', sub: 'Q02.1', dif, degrau: 0, conceito: '', pista: '', url: 'https://x', origem: 'prova', figura: true, ...extra });
  const banco = [q('P1', 2), q('P2', 8)];
  return { id: 'qui', banco, porId: new Map(banco.map((x) => [x.id, x])), porSub: new Map([['Q02.1', banco]]),
    conteudo: { flash: [], flashImg: [] } as unknown as MateriaCarregada['conteudo'],
    retiradas: [q('Wq2', 3, { origem: 'site', retirada: true, escola: '' })] };
}

describe('desempenho e revisão com questões retiradas sem equivalente', () => {
  const DIA = 864e5;
  const ontem = Date.now() - 3 * DIA;
  const s: EstadoMateria = { ...estadoMateriaVazio(), q: { Wq2: { tent: [t(ontem, false)] } } };

  it('o histórico continua contando no desempenho (feitas, acerto, nível)', () => {
    const r = resumoMateria(mc(), s);
    expect(r.feitas).toBe(1);
    expect(r.tentativas).toBe(1);
    expect(r.total).toBe(2); // a retirada não aparece no total do que dá para fazer
    const nv = desempenhoPorNivel([...mc().banco, ...mc().retiradas!], s);
    expect(nv.find((x) => x.nivel === 'basico')!.feitas).toBe(1);
  });

  it('erro numa questão retirada vence na revisão do conteúdo: entra outra questão do conteúdo, de dificuldade próxima', () => {
    const v = questoesVencidas(mc(), s);
    expect(v.map((x) => x.id)).toEqual(['P1']);
    expect(resumoMateria(mc(), s).vencidas).toBe(1);
  });

  it('acertar no conteúdo depois da data faz a revisão da retirada avançar', () => {
    const s2: EstadoMateria = { ...s, q: { ...s.q, P1: { tent: [t(Date.now(), true)] } } };
    expect(questoesVencidas(mc(), s2)).toEqual([]);
  });

  it('conteúdo sem nenhuma questão no ar: a revisão não quebra (fica sem item)', () => {
    const m = mc();
    m.porSub = new Map();
    m.banco = [];
    expect(questoesVencidas(m, s)).toEqual([]);
  });
});

const DEST = join(__dirname, '..', '..', 'public', 'conteudo');
describe.skipIf(!existsSync(join(DEST, 'bio', 'banco.json')))('conteúdo publicado sem questões de site', () => {
  const SITES = ['Brasil Escola', 'Mundo Educação', 'Mundo Educacao', 'Prepara Enem', 'InfoEscola'];
  for (const m of ['bio', 'qui', 'mat', 'por'] as const) {
    it(m, () => {
      const banco = JSON.parse(readFileSync(join(DEST, m, 'banco.json'), 'utf-8')) as Questao[];
      const ids = new Set(banco.map((q) => q.id));
      for (const q of banco) {
        expect(q.origem).toBe('prova');
        expect(SITES).not.toContain(q.escola);
        expect(q.url).not.toMatch(/brasilescola|mundoeducacao|preparaenem|infoescola/);
      }
      for (const id of Object.keys(RETIRADAS[m] || {})) expect(ids.has(id)).toBe(false);
      for (const r of Object.values(RETIRADAS[m] || {})) if (r[2] === m) expect(ids.has(r[3]!)).toBe(true);
      const mat = JSON.parse(readFileSync(join(DEST, m, 'materia.json'), 'utf-8'));
      for (const id of mat.essencial.abc) expect(ids.has(id)).toBe(true);
    });
  }
});

// Comando 18 do dono: Filosofia e Sociologia viram UMA matéria ('fs'), sem perder o progresso de nenhuma das duas,
// e as cores das matérias passam a ser EXATAMENTE as da paleta aprovada (docs/cores/paleta.json).
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { importaArquivo, migraEstado, VERSAO_ATUAL } from '../estado/migracao';
import { estadoVazio, type Estado } from '../estado/tipos';
import { MATERIAS, materia } from '../dados/materias';
import { materiaAtual } from '../dados/tipos';
import { materiaDaArea } from '../dados/provasCompletas';

/** Estado como o site salvava antes do comando 18 (versão 1), com progresso em Filosofia e em Sociologia. */
function estadoV1(): Estado {
  const e = estadoVazio() as unknown as Record<string, unknown>;
  return {
    ...e,
    versao: 1,
    perfil: { nome: 'Ana', email: 'a@b.c', provasAlvo: ['enem'], meta: 150, criadoEm: 1 },
    materias: {
      fil: {
        q: {
          'enem-2023-q12': { tent: [{ letra: 'B', ok: false, ts: 1000, seg: 60 }, { letra: 'C', ok: true, ts: 3000, seg: 40, ctx: 'escada' }], rev: true },
          'uel-2024-q40': { tent: [{ letra: 'A', ok: true, ts: 2000, seg: 50 }] },
        },
        ult: 'enem-2023-q12',
        sims: [{ nome: 'Simulado A', acertos: 3, total: 5, seg: 600, ts: 1500 }],
        flash: { 'fil-k001': { etapa: 2, vence: 9000, hist: [{ ts: 1200, v: 'a' }] } },
        flg: { 'fil-k002': { g: -1, ts: 1300 } },
        sessoes: [{ ts: 1000, seg: 300 }],
      },
      soc: {
        q: {
          'enem-2023-q30': { tent: [{ letra: 'D', ok: true, ts: 5000, seg: 30 }] },
          'uel-2024-q41': { tent: [{ letra: 'E', ok: false, ts: 4000, seg: 70 }] },
        },
        ult: 'enem-2023-q30',
        sims: [],
        flash: { 'soc-k001': { etapa: 1, vence: 8000, hist: [{ ts: 4100, v: 'q' }] } },
        flg: {},
        sessoes: [{ ts: 4000, seg: 200 }],
      },
      bio: { q: { P0a240e7: { tent: [{ letra: 'D', ok: true, ts: 10, seg: 42 }] } }, ult: 'P0a240e7', sims: [], flash: {}, flg: {}, sessoes: [] },
    },
    treino: {
      fil: { it: [{ k: 'q', id: 'uel-2024-q40' }], i: 0, res: {}, t0: 100 },
      soc: { it: [{ k: 'q', id: 'enem-2023-q30' }], i: 0, res: {}, t0: 200 },
    },
    simulado: {
      sid: 'prova:enem-2023', titulo: 'ENEM 2023', modo: 'prova', i: 0, limiteSeg: null, usadoSeg: 0, iniciadoEm: 1, pausado: false, marcadas: [], resp: {},
      itens: [{ id: 'enem-2023-q12', p: 'enem-2023', m: 'fil' }, { id: 'enem-2023-q30', p: 'enem-2023', m: 'soc' }, { id: 'enem-2023-q1', p: 'enem-2023', m: 'bio' }],
    },
    simuladosFeitos: [{
      sid: 'prova:enem-2022', titulo: 'ENEM 2022', modo: 'prova', ts: 7000, seg: 100, acertos: 3, total: 5,
      porMateria: { fil: { acertos: 1, total: 2 }, soc: { acertos: 2, total: 2 }, bio: { acertos: 0, total: 1 } },
      itens: [{ id: 'x1', m: 'fil', letra: 'A', ok: true }, { id: 'x2', m: 'soc', letra: 'B', ok: true }, { id: 'x3', m: 'bio', letra: null, ok: false }],
    }],
    pref: { tema: 'escuro', menuFechado: false, ultimaMateria: 'soc' },
  } as unknown as Estado;
}

describe('migração v1 -> v2: Filosofia e Sociologia em uma matéria só', () => {
  const e = migraEstado(estadoV1());
  const fs = e.materias.fs!;
  const mats = e.materias as Record<string, unknown>;

  it('chega na versão atual e some com as chaves antigas', () => {
    expect(VERSAO_ATUAL).toBe(8); // v8: revisão geral (revisaoGeral.test.ts); v7: agenda pela data da prova (agendaRevisao.test.ts); v6: região das provas (regiao.test.ts); v3: questões de site retiradas (comando 21, retiradas.test.ts); v4: revisão em slides (revisaoSlides.test.ts); v5: treino geral de todas as matérias (treinoMisto.test.ts)
    expect(e.versao).toBe(VERSAO_ATUAL);
    expect(mats.fil).toBeUndefined();
    expect(mats.soc).toBeUndefined();
  });
  it('todas as questões das duas matérias, com todas as tentativas e os mesmos ids', () => {
    expect(Object.keys(fs.q).sort()).toEqual(['enem-2023-q12', 'enem-2023-q30', 'uel-2024-q40', 'uel-2024-q41']);
    expect(fs.q['enem-2023-q12'].tent).toHaveLength(2);
    expect(fs.q['enem-2023-q12'].rev).toBe(true);
    expect(fs.q['enem-2023-q12'].tent[1].ctx).toBe('escada');
    expect(fs.q['uel-2024-q41'].tent[0].ok).toBe(false);
  });
  it('cartões, curtidas, sessões e simulados das duas', () => {
    expect(fs.flash['fil-k001'].etapa).toBe(2);
    expect(fs.flash['soc-k001'].etapa).toBe(1);
    expect(fs.flg['fil-k002'].g).toBe(-1);
    expect(fs.sessoes.map((s) => s.ts)).toEqual([1000, 4000]);
    expect(fs.sims).toHaveLength(1);
  });
  it('"continuar de onde parou" aponta para a questão respondida por último', () => {
    expect(fs.ult).toBe('enem-2023-q30');
  });
  it('treino em andamento, simulado em andamento, simulados feitos e última matéria apontam para fs', () => {
    expect(e.treino.fs!.t0).toBe(200);
    expect((e.treino as Record<string, unknown>).fil).toBeUndefined();
    expect(e.simulado!.itens.map((x) => x.m)).toEqual(['fs', 'fs', 'bio']);
    expect(e.simuladosFeitos[0].porMateria).toEqual({ fs: { acertos: 3, total: 4 }, bio: { acertos: 0, total: 1 } });
    expect(e.simuladosFeitos[0].itens.map((x) => x.m)).toEqual(['fs', 'fs', 'bio']);
    expect(e.pref.ultimaMateria).toBe('fs');
  });
  it('não mexe nas outras matérias nem no perfil', () => {
    expect(e.materias.bio!.q.P0a240e7.tent).toHaveLength(1);
    expect(e.perfil!.nome).toBe('Ana');
    expect(e.pref.tema).toBe('escuro');
  });
  it('rodar de novo não muda nada (idempotente) e estado já atual passa intacto', () => {
    expect(migraEstado(e)).toEqual(e);
    expect(migraEstado(estadoVazio())).toEqual(estadoVazio());
  });
  it('se já houver progresso em fs, junta sem apagar', () => {
    const v1 = estadoV1();
    (v1.materias as Record<string, unknown>).fs = { q: { 'enem-2023-q12': { tent: [{ letra: 'C', ok: true, ts: 9000, seg: 10 }] } }, ult: null, sims: [], flash: {}, flg: {}, sessoes: [] };
    const x = migraEstado(v1).materias.fs!;
    expect(x.q['enem-2023-q12'].tent.map((t) => t.ts)).toEqual([1000, 3000, 9000]);
  });
  it('importar um arquivo exportado antes da junção leva fil e soc para fs', () => {
    const v1 = estadoV1();
    const { estado, r } = importaArquivo(estadoVazio(), JSON.stringify(v1), {});
    expect(r.erro).toBeUndefined();
    expect(r.materias).toEqual(['fs', 'bio']);
    expect(Object.keys(estado.materias.fs!.q)).toHaveLength(4);
    expect(estado.simuladosFeitos[0].porMateria.fs).toEqual({ acertos: 3, total: 4 });
  });
});

describe('ids antigos e rotas', () => {
  it('fil e soc levam à matéria nova; os outros ids ficam iguais', () => {
    expect(materiaAtual('fil')).toBe('fs');
    expect(materiaAtual('soc')).toBe('fs');
    expect(materiaAtual('bio')).toBe('bio');
    expect(materia('fil')!.nome).toBe('Filosofia e Sociologia');
    expect(materiaDaArea('Filosofia')).toBe('fs');
    expect(materiaDaArea('Sociologia')).toBe('fs');
  });
  it('a lista de matérias tem fs e não tem mais fil nem soc', () => {
    const ids = MATERIAS.map((m) => m.id);
    expect(ids).toContain('fs');
    expect(ids).not.toContain('fil' as never);
    expect(ids).not.toContain('soc' as never);
  });
});

describe('paleta aprovada (docs/cores/paleta.json)', () => {
  const arq = JSON.parse(readFileSync(resolve(__dirname, '../../../docs/cores/paleta.json'), 'utf8')) as {
    materias: Record<string, { nome: string; principal: string; texto_tema_claro: string; texto_tema_escuro: string; fundo_suave_claro: string; fundo_suave_escuro: string; texto_sobre_principal: string }>;
  };
  it('as nove matérias do arquivo, com os seis tons exatos', () => {
    expect(MATERIAS.map((m) => m.id).sort()).toEqual(Object.keys(arq.materias).sort());
    for (const m of MATERIAS) {
      const p = arq.materias[m.id];
      expect(m.nome).toBe(p.nome);
      expect(m.paleta).toEqual({
        principal: p.principal, textoClaro: p.texto_tema_claro, textoEscuro: p.texto_tema_escuro,
        fundoClaro: p.fundo_suave_claro, fundoEscuro: p.fundo_suave_escuro, sobrePrincipal: p.texto_sobre_principal,
      });
    }
  });
  it('todo tom usado nas telas é um tom do arquivo (ou a letra branca/escura do site)', () => {
    for (const m of MATERIAS) {
      const p = arq.materias[m.id];
      const permitidos = new Set([p.principal, p.texto_tema_claro, p.texto_tema_escuro, p.fundo_suave_claro, p.fundo_suave_escuro, p.texto_sobre_principal, '#FFFFFF', '#17181C']);
      for (const t of [m.claro, m.escuro]) for (const v of Object.values(t)) expect(permitidos.has(v), `${m.id} ${v}`).toBe(true);
      expect(m.claro.t).toBe(p.texto_tema_claro);
      expect(m.escuro.t).toBe(p.texto_tema_escuro);
      expect(m.claro.s).toBe(p.fundo_suave_claro);
      expect(m.escuro.s).toBe(p.fundo_suave_escuro);
      expect(m.claro.p).toBe(p.principal);
      expect(m.claro.pInk).toBe(p.texto_sobre_principal);
    }
  });
});

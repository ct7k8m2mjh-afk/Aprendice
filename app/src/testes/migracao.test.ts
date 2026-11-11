// Princípio 7: nunca perder progresso. Migração do formato do protótipo e mesclagem.
import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { aplicaAlias, importaArquivo, mesclaQ, migraDoNavegador, migraEstado, VERSAO_ATUAL } from '../estado/migracao';
import { estadoMateriaVazio, estadoVazio } from '../estado/tipos';

const ids = { bio: new Set(['P0a240e7', 'P4f909ea', 'P051777a']), qui: new Set(['Pea7d145']), mat: new Set(['d463edb8']), por: new Set(['Pabc0001']) };

// objeto S exatamente como o protótipo salvava em saocamilo.bio.v1
const S_BIO = {
  q: {
    P0a240e7: { tent: [{ letra: 'D', ok: true, ts: 1761900000000, seg: 42, conf: 'certeza' }], rev: false },
    P4f909ea: { tent: [{ letra: 'A', ok: false, ts: 1761900100000, seg: 80 }, { letra: 'C', ok: true, ts: 1762000000000, seg: 30 }], rev: true },
  },
  ult: 'P4f909ea',
  sims: [{ nome: 'Simulado São Camilo', acertos: 9, total: 14, seg: 1500, ts: 1761950000000 }],
  tema: 'dark',
  flash: { 'bio-d001': { etapa: 2, vence: 1762500000000, hist: [{ ts: 1761900000000, v: 'a' }] } },
  flg: { 'bio-d002': { g: -1, tipo: 'conceito', mod: 'B01', ts: 1761900000000 } },
  sessoes: [{ ts: 1761900000000, seg: 600 }],
};

describe('migração do protótipo', () => {
  it('lê as chaves antigas do navegador sem perder nada', () => {
    const e = migraDoNavegador(estadoVazio(), (k) => (k === 'saocamilo.bio.v1' ? JSON.stringify(S_BIO) : null));
    const b = e.materias.bio!;
    expect(Object.keys(b.q)).toEqual(['P0a240e7', 'P4f909ea']);
    expect(b.q.P4f909ea.tent).toHaveLength(2);
    expect(b.q.P4f909ea.rev).toBe(true);
    expect(b.ult).toBe('P4f909ea');
    expect(b.sims).toHaveLength(1);
    expect(b.flash['bio-d001'].etapa).toBe(2);
    expect(b.flg['bio-d002'].g).toBe(-1);
    expect(e.migradoDe).toContain('saocamilo.bio.v1');
  });
  it('não migra duas vezes a mesma chave', () => {
    const ler = (k: string) => (k === 'saocamilo.bio.v1' ? JSON.stringify(S_BIO) : null);
    const e2 = migraDoNavegador(migraDoNavegador(estadoVazio(), ler), ler);
    expect(e2.materias.bio!.q.P4f909ea.tent).toHaveLength(2);
  });
  it('importa o arquivo exportado pelo protótipo e reconhece a matéria', () => {
    const { estado, r } = importaArquivo(estadoVazio(), JSON.stringify(S_BIO), ids);
    expect(r.erro).toBeUndefined();
    expect(r.materias).toEqual(['bio']);
    expect(r.questoes).toBe(2);
    expect(estado.materias.bio!.q.P0a240e7.tent[0].conf).toBe('certeza');
  });
  it('importar por cima junta, não apaga', () => {
    const a = importaArquivo(estadoVazio(), JSON.stringify(S_BIO), ids).estado;
    const mais = { q: { P4f909ea: { tent: [{ letra: 'B', ok: false, ts: 1762100000000, seg: 15 }] } } };
    const b = importaArquivo(a, JSON.stringify(mais), ids).estado;
    expect(b.materias.bio!.q.P4f909ea.tent).toHaveLength(3);
    expect(b.materias.bio!.q.P0a240e7.tent).toHaveLength(1);
  });
  it('reimportar o mesmo arquivo não duplica tentativas', () => {
    const a = importaArquivo(estadoVazio(), JSON.stringify(S_BIO), ids).estado;
    const b = importaArquivo(a, JSON.stringify(S_BIO), ids).estado;
    expect(b.materias.bio!.q.P4f909ea.tent).toHaveLength(2);
  });
  it('arquivo inválido devolve erro e não mexe no estado', () => {
    const e = estadoVazio();
    const { estado, r } = importaArquivo(e, '{ nada', ids);
    expect(r.erro).toBeTruthy();
    expect(estado).toBe(e);
  });
  it('alias: progresso de questão duplicada passa para a mantida', () => {
    const e = importaArquivo(estadoVazio(), JSON.stringify({ q: { P0a240e7: S_BIO.q.P0a240e7, Pe45f264: { tent: [{ letra: 'A', ok: true, ts: 5, seg: 1 }] } } }), { ...ids, bio: new Set([...ids.bio, 'Pe45f264']) }).estado;
    const m = aplicaAlias(e.materias.bio!, { Pe45f264: 'P051777a' });
    expect(m.q.Pe45f264).toBeUndefined();
    expect(m.q.P051777a.tent).toHaveLength(1);
  });
  it('mesclaQ une por instante da tentativa', () => {
    const r = mesclaQ({ x: { tent: [{ letra: 'A', ok: false, ts: 1, seg: 1 }] } }, { x: { tent: [{ letra: 'A', ok: false, ts: 1, seg: 1 }, { letra: 'B', ok: true, ts: 2, seg: 1 }] } });
    expect(r.x.tent.map((t) => t.ts)).toEqual([1, 2]);
  });
});

/* Tema novo G13 Pensamento geográfico (dono, 11/11/2026): 30 questões de Geografia mudaram de conteúdo (G01.1, G10.1,
 * G11.2 e outros -> G13.1/G13.2). O progresso é guardado pelo id da questão (materias.geo.q[id]) e o conteúdo de cada
 * questão vem sempre do banco, então nada precisa ser migrado: os ids não mudam e as tentativas passam a contar em G13.
 * As revisões em slides (revs) são por conteúdo e continuam valendo para o conteúdo antigo, que segue existindo. */
const BANCO_GEO = join(__dirname, '..', '..', 'public', 'conteudo', 'geo', 'banco.json');
const PARA_G13: Record<string, string> = {
  P57bb73c6: 'G13.1', Pea2d2a81: 'G13.1', P28635b52: 'G13.1', P1b033809: 'G13.1', // estavam em G11.2 (UECE)
  Pdda91616: 'G13.2', P5465952f: 'G13.2', P68ce70cd: 'G13.2', // estavam em G11.2 (UECE)
  P28ffd480: 'G13.2', P2cb91213: 'G13.2', Pf0cfa1b9: 'G13.1', P02c1fd72: 'G13.1', // estavam em G01.1 (URCA)
};

describe('G13 Pensamento geográfico: reclassificação sem perder progresso', () => {
  it('o progresso segue o id: migrar o estado não mexe nas tentativas das questões que mudaram de conteúdo', () => {
    const tent = (ok: boolean, ts: number) => ({ letra: 'A' as const, ok, ts, seg: 30 });
    const q = Object.fromEntries(Object.keys(PARA_G13).map((id, k) => [id, { tent: [tent(k % 2 === 0, 1762000000000 + k)], rev: k % 3 === 0 }]));
    const e = { ...estadoVazio(), versao: VERSAO_ATUAL, materias: { geo: { ...estadoMateriaVazio(), q, ult: 'P57bb73c6' } } };
    const m = migraEstado(e).materias.geo!;
    expect(m.q).toEqual(q);
    expect(m.ult).toBe('P57bb73c6');
  });
  it.skipIf(!existsSync(BANCO_GEO))('as questões estão no banco com o mesmo id, agora no tema G13', () => {
    const banco = JSON.parse(readFileSync(BANCO_GEO, 'utf-8')) as { id: string; modulo: string; sub: string }[];
    const por = new Map(banco.map((x) => [x.id, x]));
    for (const [id, sub] of Object.entries(PARA_G13)) {
      expect(por.get(id)?.sub, id).toBe(sub);
      expect(por.get(id)?.modulo, id).toBe('G13');
    }
    expect(banco.filter((x) => x.modulo === 'G13').length).toBeGreaterThanOrEqual(30);
  });
});

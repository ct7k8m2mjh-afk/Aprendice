import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const DEST = join(__dirname, '..', '..', 'public', 'conteudo', 'provas');
const temProvas = existsSync(join(DEST, 'indice.json'));
const ler = (p: string) => JSON.parse(readFileSync(p, 'utf-8'));

describe.skipIf(!temProvas)('provas completas (recorte oficial)', () => {
  const indice = temProvas ? ler(join(DEST, 'indice.json')) : [];
  const provas = indice.map((x: { id: string }) => ler(join(DEST, x.id, 'prova.json')));

  it('há provas completas e cada uma bate com o índice', () => {
    expect(provas.length).toBeGreaterThanOrEqual(19);
    for (const [i, p] of provas.entries()) expect(p.questoes.length).toBe(indice[i].questoes);
  });

  it('ids únicos em todas as provas e com prefixo P', () => {
    const ids = provas.flatMap((p: { questoes: { id: string }[] }) => p.questoes.map((q) => q.id));
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^P[0-9a-f]{8}$/);
  });

  it('gabarito oficial dentro das alternativas da prova; anuladas fora', () => {
    for (const p of provas) {
      const letras = 'ABCDE'.slice(0, p.alternativas);
      for (const q of p.questoes) expect(letras).toContain(q.gab);
    }
  });

  it('todo print existe e a numeração não se repete', () => {
    for (const p of provas) {
      const ns = p.questoes.map((q: { n: number }) => q.n);
      expect(new Set(ns).size).toBe(ns.length);
      for (const q of p.questoes) expect(existsSync(join(DEST, p.id, q.print))).toBe(true);
    }
  });

  it('nenhum texto entrega a resposta (caderno comentado ou marcado)', () => {
    for (const p of provas) for (const q of p.questoes) {
      expect(q.texto).not.toMatch(/Alternativa correta|►|Gabarito:/);
    }
  });

  it('transcrição só com todas as alternativas e sem notação especial nem resposta', () => {
    let n = 0;
    for (const p of provas) for (const q of p.questoes) {
      if (!q.transcricao) continue;
      n++;
      expect(Object.keys(q.transcricao.alts).join('')).toBe('ABCDE'.slice(0, p.alternativas));
      expect(q.transcricao.enun.length).toBeGreaterThan(0);
      const tudo = JSON.stringify(q.transcricao);
      expect(tudo).not.toMatch(/Alternativa correta|►|Gabarito/);
      expect(tudo).not.toMatch(/[\u{1D400}-\u{1D7FF}]/u);
    }
    expect(n).toBeGreaterThan(500);
  });

  it('fonte oficial registrada para cada prova', () => {
    for (const p of provas) {
      expect(Object.keys(p.fontes).length).toBeGreaterThan(0);
      for (const u of Object.values(p.fontes) as string[]) expect(u).toMatch(/^https:\/\//);
    }
  });
});

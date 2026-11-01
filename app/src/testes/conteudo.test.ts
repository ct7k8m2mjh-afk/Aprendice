// Integridade da conversão: o app tem exatamente o conteúdo do protótipo, com os mesmos ids.
import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const RAIZ = join(__dirname, '..', '..');
const ORIGEM = join(RAIZ, '..', 'app-atual');
const DEST = join(RAIZ, 'public', 'conteudo');
const MATS = ['bio', 'qui', 'mat', 'por'];
const ler = (p: string) => JSON.parse(readFileSync(p, 'utf-8'));
const temConteudo = existsSync(join(DEST, 'bio', 'banco.json'));

describe.skipIf(!temConteudo)('conteúdo convertido', () => {
  for (const m of MATS) {
    describe(m, () => {
      const orig = ler(join(ORIGEM, m, 'dados.json'));
      const banco = ler(join(DEST, m, 'banco.json')) as { id: string; gab: string; alts: Record<string, string>; sub: string; url: string; escola: string; ano: string; origem: string; pendente?: string }[];
      const materia = ler(join(DEST, m, 'materia.json'));

      it('mesmas questões, mesmos ids, mesma ordem', () => {
        expect(banco.map((q) => q.id)).toEqual(orig.banco.map((q: { id: string }) => q.id));
      });
      it('gabarito idêntico ao do protótipo', () => {
        const g = new Map(orig.banco.map((q: { id: string; gab: string }) => [q.id, q.gab]));
        for (const q of banco) expect(q.gab).toBe(g.get(q.id));
      });
      it('toda questão tem fonte: link e origem; questão de prova tem também escola e ano', () => {
        for (const q of banco) {
          if (q.pendente) continue; // fora do ar no app (ver relatório de pendências)
          expect(q.url, q.id).toMatch(/^https?:\/\//);
          expect(q.escola, q.id).toBeTruthy();
          if (q.origem === 'prova') expect(q.ano, q.id).toBeTruthy();
        }
      });
      it('gabarito é uma letra de A a E', () => { for (const q of banco) expect(q.gab, q.id).toMatch(/^[A-E]$/); });
      it('toda questão tem print e resolução', () => {
        const prints = new Set(readdirSync(join(DEST, m, 'prints')).map((f) => f.replace('.webp', '')));
        const res: Record<string, unknown> = {};
        for (const f of readdirSync(join(DEST, m, 'res'))) Object.assign(res, ler(join(DEST, m, 'res', f)));
        for (const q of banco) { expect(prints.has(q.id), `print de ${q.id}`).toBe(true); expect(res[q.id], `resolução de ${q.id}`).toBeTruthy(); }
      });
      it('flashcards, frases e teoria preservados com os mesmos ids', () => {
        expect(materia.flash.map((c: { id: string }) => c.id)).toEqual(orig.flash.map((c: { id: string }) => c.id));
        expect(materia.essencial.completar.map((c: { id: string }) => c.id)).toEqual(orig.essencial.completar.map((c: { id: string }) => c.id));
        expect(materia.modulos.length).toBe(Object.keys(orig.teoria).length);
      });
      it('nenhuma menção pessoal ao aluno do protótipo', () => {
        const txt = readdirSync(join(DEST, m, 'res')).map((f) => readFileSync(join(DEST, m, 'res', f), 'utf-8')).join('') + readFileSync(join(DEST, m, 'materia.json'), 'utf-8');
        expect(txt).not.toMatch(/\bVitor\b/);
        expect(txt).not.toMatch(/S[ãa]o Camilo[^"]{0,40}prioridade/i);
      });
    });
  }
});

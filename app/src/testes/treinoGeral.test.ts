// Treino geral de cada matéria: as 9 matérias têm treino, com questões reais de prova que existem no banco.
import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { composicaoRodada, descreveTreino } from '../logica/rodadaTreino';

const DEST = join(__dirname, '..', '..', 'public', 'conteudo');
const TODAS = ['bio', 'qui', 'mat', 'por', 'fis', 'geo', 'his', 'ing', 'fs'];
const NOVAS = ['fis', 'geo', 'his', 'ing', 'fs'];
const ler = (p: string) => JSON.parse(readFileSync(p, 'utf-8'));
const temConteudo = existsSync(join(DEST, 'fis', 'materia.json'));

interface Q { id: string; modulo: string; dif: number; gab: string; alts: unknown[]; origem: string; pendente?: string; retirada?: boolean }

describe('composição da rodada', () => {
  it('matéria completa: 6 questões, 5 flashcards e 4 frases', () => {
    expect(composicaoRodada(40, 60, 40)).toEqual({ q: 6, f: 5, c: 4 });
  });
  it('só questões: a rodada se completa com questões (15)', () => {
    expect(composicaoRodada(40, 0, 0)).toEqual({ q: 15, f: 0, c: 0 });
  });
  it('nunca pede mais questões do que existem', () => {
    expect(composicaoRodada(3, 0, 0)).toEqual({ q: 3, f: 0, c: 0 });
  });
  it('a capa só promete o que a matéria tem', () => {
    expect(descreveTreino(40, 0, 0)).toMatch(/^Questões reais de prova/);
    expect(descreveTreino(40, 0, 0)).not.toMatch(/flashcard|frase/i);
    expect(descreveTreino(40, 40, 60)).toBe('Questões reais de prova, frases para completar e flashcards dos temas que mais caem, tudo misturado.');
  });
});

describe.skipIf(!temConteudo)('treino geral em todas as matérias', () => {
  for (const m of TODAS) {
    it(`${m}: tem treino e todo id do treino existe no banco, no ar e com gabarito`, () => {
      const mat = ler(join(DEST, m, 'materia.json'));
      const banco = new Map((ler(join(DEST, m, 'banco.json')) as Q[]).map((q) => [q.id, q]));
      const n = mat.essencial.abc.length + mat.essencial.completar.length + mat.flash.length + mat.flashImg.length;
      expect(n).toBeGreaterThan(0);
      expect(mat.essencial.abc.length).toBeGreaterThan(0);
      expect(new Set(mat.essencial.abc).size).toBe(mat.essencial.abc.length);
      for (const id of mat.essencial.abc) {
        const q = banco.get(id);
        expect(q, `${m}/${id}`).toBeTruthy();
        expect(q!.origem).toBe('prova');
        expect(q!.pendente).toBeFalsy();
        expect(q!.gab).toMatch(/^[A-E]$/);
      }
    });
  }
  for (const m of NOVAS) {
    it(`${m}: cerca de 40 questões de prova, níveis 1 a 6, dos temas que mais caem`, () => {
      const mat = ler(join(DEST, m, 'materia.json'));
      const lista = ler(join(DEST, m, 'banco.json')) as Q[];
      const banco = new Map(lista.map((q) => [q.id, q]));
      expect(mat.essencial.abc.length).toBe(40);
      const qs = mat.essencial.abc.map((id: string) => banco.get(id)!);
      for (const q of qs) { expect(q.dif).toBeGreaterThanOrEqual(1); expect(q.dif).toBeLessThanOrEqual(6); }
      expect(qs.some((q: Q) => q.dif <= 3)).toBe(true);
      expect(qs.some((q: Q) => q.dif >= 4)).toBe(true);
      // o tema que mais cai no banco está no treino
      const freq = new Map<string, number>();
      for (const q of lista) freq.set(q.modulo, (freq.get(q.modulo) || 0) + 1);
      const topo = [...freq.entries()].sort((a, b) => b[1] - a[1])[0][0];
      expect(qs.some((q: Q) => q.modulo === topo)).toBe(true);
      // sem flashcards e frases criados sem lentes
      expect(mat.flash).toEqual([]);
      expect(mat.essencial.completar).toEqual([]);
    });
  }
});

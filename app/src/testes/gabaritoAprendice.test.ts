// Princípio 2 (dono, 11/11/2026): sem gabarito publicado, a questão só vai ao ar com o gabarito do Aprendice
// (dois especialistas às cegas na mesma letra). Até lá fica fora do ar; depois, o aluno vê de onde veio o gabarito.
import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { origemGabarito, type Questao } from '../dados/tipos';

const PUB = join(__dirname, '..', '..', 'public', 'conteudo');
const MATERIAS = ['bio', 'qui', 'mat', 'por', 'fis', 'geo', 'his', 'ing', 'fs'];
const temBanco = existsSync(join(PUB, 'bio', 'banco.json'));

describe('origem do gabarito', () => {
  it('o aluno vê de onde veio o gabarito', () => {
    expect(origemGabarito({})).toBe('Gabarito oficial publicado');
    expect(origemGabarito({ gabFonte: 'aprendice' })).toMatch(/^Gabarito do Aprendice: a banca não publicou gabarito oficial/);
    expect(origemGabarito({ gabFonte: 'resolucao' })).toBe('Gabarito de resolução publicada');
  });
});

describe.skipIf(!temBanco)('questões sem gabarito publicado no banco', () => {
  const bancos = MATERIAS.filter((m) => existsSync(join(PUB, m, 'banco.json')))
    .map((m) => [m, JSON.parse(readFileSync(join(PUB, m, 'banco.json'), 'utf-8')) as Questao[]] as const);
  it('sem letra, a questão fica fora do ar', () => {
    for (const [m, b] of bancos) for (const q of b) {
      if (!q.gab) expect(q.pendente, `${m} ${q.id}: sem gabarito e no ar`).toBeTruthy();
    }
  });
  it('gabarito do Aprendice só com uma letra válida', () => {
    for (const [m, b] of bancos) for (const q of b) {
      if (q.gabFonte === 'aprendice') expect(Object.keys(q.alts), `${m} ${q.id}`).toContain(q.gab);
    }
  });
});

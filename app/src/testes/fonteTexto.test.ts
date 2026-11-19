import { describe, expect, it } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { leFonte } from '../logica/fonteTexto';

// Revisão do site de 19/11/2026 (dados.md, item 1): o verso do flashcard não quebra com fonte que não é link puro
describe('fonte do flashcard e da frase', () => {
  it('link puro: o nome do site', () => {
    expect(leFonte('https://www.gov.br/inep/pt-br')).toEqual({ texto: '', links: [{ url: 'https://www.gov.br/inep/pt-br', site: 'gov.br' }] });
  });
  it('texto com links no meio: o texto e cada link', () => {
    const f = leFonte('Camões, soneto "Amor é fogo" (Rimas, 1598) — https://pt.wikisource.org/wiki/Amor · https://www.exemplo.com.br/paradoxo/');
    expect(f.texto).toBe('Camões, soneto "Amor é fogo" (Rimas, 1598)');
    expect(f.links.map((l) => l.site)).toEqual(['pt.wikisource.org', 'exemplo.com.br']);
  });
  it('só texto, vazio e link quebrado não lançam erro', () => {
    expect(leFonte('Livro X, 3ª edição, p. 12')).toEqual({ texto: 'Livro X, 3ª edição, p. 12', links: [] });
    expect(leFonte(undefined)).toEqual({ texto: '', links: [] });
    expect(() => leFonte('veja http://')).not.toThrow();
    expect(leFonte('veja http://')).toEqual({ texto: 'veja http://', links: [] });
  });
  it('todos os flashcards e frases servidos abrem sem erro', () => {
    for (const m of ['bio', 'qui', 'mat', 'por', 'fis', 'geo', 'his', 'ing', 'fs']) {
      const arq = `public/conteudo/${m}/materia.json`;
      if (!existsSync(arq)) continue;
      const d = JSON.parse(readFileSync(arq, 'utf8'));
      for (const c of [...(d.flash || []), ...(d.flashImg || []), ...(d.essencial?.completar || [])])
        if (c.fonte) { const f = leFonte(c.fonte); expect(f.texto || f.links.length, `${m} ${c.id}`).toBeTruthy(); }
    }
  });
});

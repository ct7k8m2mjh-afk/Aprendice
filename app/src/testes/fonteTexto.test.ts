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

// Revisão de 20/11/2026 (matérias 3): link com parênteses no endereço não pode quebrar
describe('fonte com parênteses no endereço', () => {
  it('fis-d007: o link vai inteiro e o título fica como texto', () => {
    const f = leFonte('Mechanics Map (Moore et al., York College of Pennsylvania), 11.2 Belt- and Gear-Driven Systems — https://eng.libretexts.org/Bookshelves/Mechanical_Engineering/Mechanics_Map_(Moore_et_al.)/11:_Rigid_Body_Kinematics/11.2:_Belt-_and_Gear-Driven_Systems');
    expect(f.links).toHaveLength(1);
    expect(f.links[0].url).toBe('https://eng.libretexts.org/Bookshelves/Mechanical_Engineering/Mechanics_Map_(Moore_et_al.)/11:_Rigid_Body_Kinematics/11.2:_Belt-_and_Gear-Driven_Systems');
    expect(f.links[0].site).toBe('eng.libretexts.org');
    expect(f.texto).toBe('Mechanics Map (Moore et al., York College of Pennsylvania), 11.2 Belt- and Gear-Driven Systems');
  });
  it('qui-d002: link puro com "_(Inorganic_Chemistry)" no meio', () => {
    const u = 'https://chem.libretexts.org/Bookshelves/Inorganic_Chemistry/Supplemental_Modules_(Inorganic_Chemistry)/Descriptive_Chemistry/Main_Group_Reactions/Compounds/Oxides';
    expect(leFonte(u)).toEqual({ texto: '', links: [{ url: u, site: 'chem.libretexts.org' }] });
  });
  it('dois pares de parênteses no mesmo link (qui-k029)', () => {
    const u = 'https://chem.libretexts.org/Bookshelves/Inorganic_Chemistry/Supplemental_Modules_and_Websites_(Inorganic_Chemistry)/Group_17%3A_The_Halogens/Z017_Chemistry_of_Chlorine_(Z17)/The_Manufacture_of_Chlorine';
    expect(leFonte(u).links[0].url).toBe(u);
  });
  it('parêntese que fecha o texto em volta não entra no link', () => {
    const f = leFonte('Livro X (ver https://openstax.org/books/a).');
    expect(f.links[0].url).toBe('https://openstax.org/books/a');
    expect(f.texto).not.toContain('http');
  });
  it('nenhum flashcard ou frase publicado deixa pedaço de endereço no texto', () => {
    for (const m of ['bio', 'qui', 'mat', 'por', 'fis', 'his', 'geo', 'ing', 'fs']) {
      const p = `public/conteudo/${m}/materia.json`;
      if (!existsSync(p)) continue;
      const d = JSON.parse(readFileSync(p, 'utf8'));
      for (const c of [...(d.flash || []), ...(d.flashImg || []), ...(d.essencial?.completar || [])])
        if (c.fonte) expect(leFonte(c.fonte).texto, `${m} ${c.id}`).not.toMatch(/\)\/|https?:|\/\w+:_/);
    }
  });
});

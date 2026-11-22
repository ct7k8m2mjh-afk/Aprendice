// Revisão de 21/11/2026 (matérias-2 R3): figuras de Biologia no tema escuro. Dentro de <img> a figura fica sempre com a
// paleta clara (texto #1E2440, sem fundo) e some no cartão escuro; o site mostra no escuro a versão com a paleta escura
// que a própria figura traz. Aqui: a versão escura existe para toda figura de Bio com as duas paletas, o tema claro não
// muda, e todo texto da versão escura tem pelo menos 4,5:1 sobre o que está atrás dele: o cartão escuro de Bio ou a
// forma colorida pintada embaixo (passada 3 N2: etiquetas, pirâmide, faixas).
import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { CARTAO_BIO_ESCURO, TONS_ESCURO, figuraEscura, fundosDosTextos, svgEscuro } from '../logica/figuraEscura';
import { contraste, mistura } from '../logica/contraste';
import { MATERIAS } from '../dados/materias';

const ARQ = (m: string) => resolve(__dirname, '../../public/conteudo', m, 'figuras.json');
const decodifica = (u: string) => {
  const [cab, dados] = u.split(',', 2);
  return cab.includes(';base64') ? Buffer.from(dados, 'base64').toString('utf8') : decodeURIComponent(dados);
};
const figuras = (m: string) => Object.values(JSON.parse(readFileSync(ARQ(m), 'utf8')) as Record<string, { t: string; u: string }[]>).flat();

describe('figuras de Bio no tema escuro (matérias-2 R3)', () => {
  it('a versão escura só troca o <style>: tira a paleta clara e deixa a escura', () => {
    const svg = '<svg><style>svg{color:#E7E9F5}.s{fill:#9AA0BD}@media (prefers-color-scheme: light){svg{color:#1E2440}}svg{color:#1E2440}</style><text fill="currentColor">p = 0,99</text></svg>';
    const esc = svgEscuro(svg)!;
    expect(esc).toContain('svg{color:#E7E9F5}');
    expect(esc).not.toContain('#1E2440');
    expect(esc.replace(/<style>[\s\S]*<\/style>/, '')).toBe(svg.replace(/<style>[\s\S]*<\/style>/, ''));
    expect(svgEscuro('<svg><text fill="#1E2440">x</text></svg>')).toBeNull();
  });

  it.skipIf(!existsSync(ARQ('mat')))('Mat e Quí não ganham versão escura (já servem aos dois temas)', () => {
    for (const m of ['mat', 'qui']) for (const f of figuras(m)) expect(figuraEscura(f.u), f.t).toBeNull();
  });

  it('o contraste é medido contra a forma pintada atrás do texto, não só contra o cartão', () => {
    const cab = '<svg viewBox="0 0 200 100"><style>svg{color:#E7E9F5}.s{fill:#9AA0BD}@media (prefers-color-scheme: light){svg{color:#1E2440}}svg{color:#1E2440}</style>';
    // letra escura numa etiqueta vermelha a 80%: sobre o cartão daria 1,1:1; sobre a etiqueta, 3,9:1 (abaixo de 4,5)
    const svg = cab + '<rect x="10" y="10" width="60" height="30" fill="#F0566E" fill-opacity="0.8"/><text x="40" y="25" font-size="17" text-anchor="middle" dominant-baseline="middle" fill="#0F1529">E</text>'
      + '<g transform="translate(100 0)"><circle cx="40" cy="60" r="30" fill="#E7E9F5"/><text x="40" y="60" font-size="14" text-anchor="middle" dominant-baseline="middle" class="s">3</text></g></svg>';
    const antes = fundosDosTextos(svg.replace(/@media[\s\S]*<\/style>/, '</style>'));
    expect(antes.map((t) => t.texto)).toEqual(['E', '3']);
    expect(antes[0].forma?.cor).toBe('#F0566E');
    expect(antes[0].contraste).toBeGreaterThan(3.5);
    expect(antes[0].contraste).toBeLessThan(4.5);
    expect(antes[1].forma?.tag).toBe('circle'); // dentro do <g transform>
    expect(antes[1].contraste).toBeLessThan(4.5); // cinza sobre o disco claro (só o cartão daria mais de 6:1)
    // a versão escura deixa a etiqueta mais opaca: a letra escura chega a 4,5:1; o resto do desenho fica igual
    const esc = svgEscuro(svg)!;
    const t = fundosDosTextos(esc);
    expect(t[0].contraste).toBeGreaterThanOrEqual(4.5);
    expect(esc).toMatch(/<rect x="10" y="10" width="60" height="30" fill="#F0566E" fill-opacity="(0\.9|0\.95|1)"\/>/);
    expect(esc).toContain('<circle cx="40" cy="60" r="30" fill="#E7E9F5"/>');
  });

  it('os tons de letra da paleta escura ficam ≥ 4,5:1 no cartão de Bio, e o claro não muda', () => {
    for (const [de, para] of Object.entries(TONS_ESCURO)) {
      expect(contraste(para, CARTAO_BIO_ESCURO), `${de} → ${para}`).toBeGreaterThanOrEqual(4.5);
      expect(contraste(de, CARTAO_BIO_ESCURO)).toBeLessThan(contraste(para, CARTAO_BIO_ESCURO));
    }
  });

  it.skipIf(!existsSync(ARQ('bio')))('toda figura de Bio com as duas paletas tem versão escura, e todo texto dela fica ≥ 4,5:1 sobre o que está atrás (cartão ou forma)', () => {
    const bio = MATERIAS.find((x) => x.id === 'bio')!;
    // cartão (.fig-teoria, var(--folha)) dentro de Bio no escuro: color-mix(in srgb, --p 11%, #121417) (base.css)
    expect(CARTAO_BIO_ESCURO).toBe(mistura(bio.escuro.p, 0.11, '#121417'));
    const baixos: string[] = [];
    let n = 0, textos = 0, sobreForma = 0;
    for (const f of figuras('bio')) {
      const svg = decodifica(f.u);
      if (!svg.includes('@media (prefers-color-scheme: light){')) continue;
      const u = figuraEscura(f.u);
      expect(u, f.t).not.toBeNull();
      n++;
      for (const t of fundosDosTextos(decodifica(u!))) {
        textos++;
        if (t.forma) sobreForma++;
        if (t.contraste < 4.5) baixos.push(`${f.t}: «${t.texto}» ${t.cor} sobre ${t.fundo} ${t.contraste.toFixed(2)}`);
      }
    }
    expect(n).toBeGreaterThan(150);
    expect(textos).toBeGreaterThan(3500);
    expect(sobreForma).toBeGreaterThan(300); // a medida olha a forma de baixo, não só o cartão
    expect([...new Set(baixos)]).toEqual([]);
  });

  it.skipIf(!existsSync(ARQ('bio')))('no tema claro a figura é a original, sem nenhuma mudança', () => {
    // a tela usa f.u no claro; a versão escura só muda o <style> e, onde precisa, fill-opacity/fill de formas
    for (const f of figuras('bio')) {
      const svg = decodifica(f.u);
      const esc = svgEscuro(svg);
      if (!esc) continue;
      const semEstilo = (x: string) => x.replace(/<style>[\s\S]*?<\/style>/, '').replace(/\s(fill-opacity|fill)="[^"]*"/g, '');
      expect(semEstilo(esc), f.t).toBe(semEstilo(svg));
    }
  });
});

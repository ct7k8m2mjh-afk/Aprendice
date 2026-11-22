// Revisão de 21/11/2026 (matérias-2 R3): figuras de Biologia no tema escuro. Dentro de <img> a figura fica sempre com a
// paleta clara (texto #1E2440, sem fundo) e some no cartão escuro; o site mostra no escuro a versão com a paleta escura
// que a própria figura traz. Aqui: a versão escura existe para toda figura de Bio com as duas paletas, o tema claro não
// muda, e todo texto da versão escura tem pelo menos 4,5:1 sobre o cartão escuro de Bio.
import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { figuraEscura, svgEscuro } from '../logica/figuraEscura';
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

  it.skipIf(!existsSync(ARQ('bio')))('toda figura de Bio com as duas paletas tem versão escura, e o texto dela fica ≥ 4,5:1 no cartão escuro', () => {
    const bio = MATERIAS.find((x) => x.id === 'bio')!;
    // cartão (.fig-teoria, var(--folha)) dentro de Bio no escuro: color-mix(in srgb, --p 11%, #121417) (base.css)
    const cartao = mistura(bio.escuro.p, 0.11, '#121417');
    const baixos: string[] = [];
    let n = 0;
    for (const f of figuras('bio')) {
      const svg = decodifica(f.u);
      if (!svg.includes('@media (prefers-color-scheme: light){')) continue;
      const u = figuraEscura(f.u);
      expect(u, f.t).not.toBeNull();
      n++;
      const esc = decodifica(u!);
      const est = /<style>([\s\S]*?)<\/style>/.exec(esc)![1];
      const cor = (re: RegExp, padrao: string) => (re.exec(est)?.[1] ?? padrao).toUpperCase();
      const texto = cor(/svg\{color:(#[0-9A-F]{6})\}/i, '#000000');
      const s = cor(/\.s\{fill:(#[0-9A-F]{6})\}/i, texto);
      const trocas = new Map([...est.matchAll(/text\[fill="(#[0-9A-F]{6})" i\][^{]*\{fill:(#[0-9A-F]{6})\}/gi)].map((m) => [m[1].toUpperCase(), m[2].toUpperCase()]));
      for (const t of esc.matchAll(/<(?:text|tspan)\b([^>]*)>/g)) {
        const a = t[1];
        let c = (/fill="([^"]+)"/.exec(a)?.[1] ?? /fill:\s*([^;"]+)/.exec(a)?.[1] ?? '').toUpperCase();
        if (!c || c === 'CURRENTCOLOR') c = /class="s"/.test(a) ? s : texto;
        // letra escura (#0F1529) só aparece sobre forma colorida da própria figura (núcleo, cabeça do fosfolipídio)
        if (c === '#0F1529') continue;
        c = trocas.get(c) ?? c;
        if (/^#[0-9A-F]{6}$/.test(c) && contraste(c, cartao) < 4.5) baixos.push(`${f.t}: ${c} ${contraste(c, cartao).toFixed(2)}`);
      }
    }
    expect(n).toBeGreaterThan(150);
    expect([...new Set(baixos)]).toEqual([]);
  });
});

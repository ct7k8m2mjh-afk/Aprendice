import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

/*
 * Revisão de 21/11/2026 (matérias N1). CLAUDE.md: "Fração sempre empilhada: numerador em cima, barra, denominador
 * embaixo — nunca 3/5 na mesma linha, em textos, fórmulas e animações". Vale também para o texto desenhado dentro das
 * figuras de teoria (SVG em public/conteudo/<m>/figuras.json). As figuras refeitas ficam em
 * conteudo-fonte/figuras-corrigidas/ (scripts/figuras_fracao.cjs) e o converte.py as aplica.
 *
 * O teste procura, dentro de cada <text>, uma barra entre letras/algarismos ("3/5", "y/x", "(x − 1)/2", "9 / 58,44").
 * Só passam as barras que não são fração: unidades, pares "isto/aquilo", alelos, pressão, datas.
 */

const CONTEUDO = resolve(__dirname, '../../public/conteudo');
const MATERIAS = ['mat', 'qui', 'bio', 'fis'];

const FRACAO_EM_LINHA = /[\p{L}\p{N})]\s*\/\s*[\p{L}\p{N}(√π−]/u;

// barras que não são fração
const UNIDADES = /(?:k?J|m?g|mol|k?m|c?m|mmol|min)\s?\/\s?(?:m?L|dL|mol|cm³|m³|s²?|h|min|100 g)/g;
const PRESSAO = /\b\d{2,3}\/\d{2,3} mmHg/g; // 120/80 mmHg
const DATAS = /\b\d{4}\/\d{4}\b/g; // 1189/1198
const PARES = [
  // "isto ou aquilo" (não é divisão)
  'amarelo/verde', 'início/fim', 'entrada/saída', 'cima/baixo', 'sístole/diástole', 'água/alimentos', 'água/lama',
  'ovos/proglotes', 'Haemagogus/Sabethes', 'PrEP/PEP', 'carpelo/pistilo', 'DNA/RNA', 'cílio / flagelo',
  'centríolo / corpúsculo', 'gametas / esporos', 'ceco / cólon', 'insulina / glucagon', 'prevenção / tratamento',
  'locomoção / nutrição', 'solium / saginata', 'Reação reversível A/B',
  // alelos, genótipos, isótopos, fases do ciclo, hormônios, par redox
  'V/v', 'R/r', 'AB/ab', 'B/b', '¹⁵N/¹⁵N', '¹⁵N/¹⁴N', '¹⁴N/¹⁴N', 'G1/S', 'G2/M', 'T₃/T₄', 'K₂Cr₂O₇/H⁺',
  // relação ecológica (sinais), notação de concentração "% (m/V)"
  '0 / −', '(m/V)',
];

function textosDasFiguras(m: string): string[] {
  const arq = resolve(CONTEUDO, m, 'figuras.json');
  if (!existsSync(arq)) return [];
  const figuras = JSON.parse(readFileSync(arq, 'utf8')) as Record<string, { t: string; u: string }[]>;
  const out: string[] = [];
  for (const [tema, lista] of Object.entries(figuras))
    for (const f of lista) {
      if (!String(f.u).startsWith('data:image/svg')) continue;
      const [cab, dados] = f.u.split(',', 2);
      const svg = cab.includes(';base64') ? Buffer.from(dados, 'base64').toString('utf8') : decodeURIComponent(dados);
      for (const t of svg.matchAll(/<text\b[^>]*>([\s\S]*?)<\/text>/g)) {
        const s = t[1].replace(/<[^>]+>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&amp;/g, '&');
        out.push(`${m} ${tema} "${f.t}": ${s}`);
      }
    }
  return out;
}

function semExcecoes(s: string): string {
  let r = s.replace(UNIDADES, ' ').replace(PRESSAO, ' ').replace(DATAS, ' ');
  for (const p of PARES) r = r.split(p).join(' ');
  return r;
}

describe('figuras da teoria: fração empilhada no texto desenhado (CLAUDE.md, revisão de 21/11/2026)', () => {
  const temConteudo = MATERIAS.some((m) => existsSync(resolve(CONTEUDO, m, 'figuras.json')));

  it.skipIf(!temConteudo)('nenhuma fração "a/b" na mesma linha dentro de <text> em Mat, Quí, Bio e Fís', () => {
    const erradas = MATERIAS.flatMap(textosDasFiguras).filter((linha) => FRACAO_EM_LINHA.test(semExcecoes(linha.slice(linha.indexOf('": ') + 3))));
    expect(erradas).toEqual([]);
  });

  it('as exceções não escondem fração de verdade', () => {
    expect(FRACAO_EM_LINHA.test(semExcecoes('A = b·h/2 = 6·4/2 = 12'))).toBe(true);
    expect(FRACAO_EM_LINHA.test(semExcecoes('m(t) = 100 · (1/2)t/6'))).toBe(true);
    expect(FRACAO_EM_LINHA.test(semExcecoes('concentração em mol/L: 9 / 58,44 = 0,154 mol/L'))).toBe(true);
    expect(FRACAO_EM_LINHA.test(semExcecoes('f⁻¹(x) = (x − 1)/2'))).toBe(true);
    expect(FRACAO_EM_LINHA.test(semExcecoes('V/T = constante'))).toBe(true);
    expect(FRACAO_EM_LINHA.test(semExcecoes('q² = 1/10.000 = 0,0001'))).toBe(true);
    expect(FRACAO_EM_LINHA.test(semExcecoes('aorta: 120/80 mmHg'))).toBe(false);
    expect(FRACAO_EM_LINHA.test(semExcecoes('Trovadorismo 1189/1198 → 1418'))).toBe(false);
    expect(FRACAO_EM_LINHA.test(semExcecoes('v = 20 m/s · 72 km/h · 180,16 g/mol · 0,1 mol/L'))).toBe(false);
  });

  // matérias-2 R2: "64 sobre ½" da PG; a fração de baixo não pode encostar na barra principal
  it.skipIf(!existsSync(resolve(CONTEUDO, 'mat', 'figuras.json')))('fração dupla da PG: nada encosta na barra principal, e ela é mais larga que a interna', () => {
    const figuras = JSON.parse(readFileSync(resolve(CONTEUDO, 'mat', 'figuras.json'), 'utf8')) as Record<string, { t: string; u: string }[]>;
    const f = figuras.M07.find((x) => x.t.startsWith('Progressão geométrica decrescente'))!;
    const svg = Buffer.from(f.u.split(',', 2)[1], 'base64').toString('utf8');
    const grupo = [...svg.matchAll(/<g>([\s\S]*?)<\/g>/g)].map((g) => g[1]).find((g) => />64<\/text>/.test(g) && /linecap="butt"/.test(g))!;
    const num = (s: string, a: string) => parseFloat(new RegExp(`${a}="([-\\d.]+)"`).exec(s)![1]);
    // só o traço de verdade (o halo branco tem ponta redonda)
    const barras = [...grupo.matchAll(/<line [^>]*linecap="butt"[^>]*>/g)].map((m) => ({ x1: num(m[0], 'x1'), x2: num(m[0], 'x2'), y: num(m[0], 'y1'), esp: num(m[0], 'stroke-width') }));
    const textos = [...grupo.matchAll(/<text ([^>]*)>([^<]*)<\/text>/g)].filter((m) => !/stroke=/.test(m[1])).map((m) => ({ s: m[2], x: num(m[1], 'x'), y: num(m[1], 'y'), tam: num(m[1], 'font-size') }));
    const i64 = textos.findIndex((t) => t.s === '64');
    const sob = textos.slice(i64, i64 + 3).map((t) => t.s);
    expect(sob).toEqual(['64', '1', '2']);
    const x = textos[i64].x;
    const sobre = barras.filter((b) => b.x1 < x && x < b.x2).sort((a, b) => (b.x2 - b.x1) - (a.x2 - a.x1));
    const [principal, interna] = sobre;
    expect(principal.x2 - principal.x1).toBeGreaterThan(interna.x2 - interna.x1 + 8);
    const um = textos[i64 + 1];
    // topo do "1" (altura dos algarismos ~0,74 do corpo) abaixo da barra principal, com folga
    expect(um.y - 0.74 * um.tam).toBeGreaterThan(principal.y + principal.esp / 2 + 1);
    expect(interna.y).toBeGreaterThan(principal.y);
  });
});

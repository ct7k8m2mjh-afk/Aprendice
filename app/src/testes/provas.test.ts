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

// Conteúdo mínimo do print (auditoria de 06/11/2026: prints só com o cabeçalho, sem as alternativas, cortados no meio do
// texto ou levando o texto das questões seguintes). Exceções conferidas abrindo o print: alternativas desenhadas em
// imagem ou em fórmula sem a letra na camada de texto, texto lido por OCR (Fuvest 2021), citação de obra ("questões 84-89"
// da Suma de Teologia) e errata impressa no caderno (UPE 2023: "questões 6 e 7" no lugar de 16 e 17).
const SEM_LETRA_NO_TEXTO: Record<string, number[]> = {
  'cmmg-2025-1': [59], 'enem-2024': [112, 127, 131, 161, 168, 174], 'enem-2025': [107, 108, 119, 127, 130, 135, 138, 169],
  'fuvest-2021': [4, 5, 10, 11, 18, 28, 48, 55, 87], 'udesc-2024-1': [4], 'udesc-2024-2': [8, 11, 14], 'udesc-2025-1': [1, 9, 28],
  'udesc-2026-2': [8],
};
const FAIXA_CONFERIDA: Record<string, number[]> = { 'fuvest-2021': [82], 'ufu-2022': [13], 'upe-ssa3-2023': [58, 59], 'urca-2025-3': [114], 'urca-2023-1': [118] };
type QPrint = { n: number; nq?: string; alt: number; larg: number; texto: string; print: string };
const letrasNoTexto = (t: string) => {
  const s = new Set<string>();
  for (const rx of [/(?:^|[\s(])\(?([A-E])\s?[)\.\-–]/gm, /^\s*([A-E])\s+\S/gm, /\b([A-E])\s*\(\s*\)/g]) for (const m of t.matchAll(rx)) s.add(m[1]);
  return s;
};

describe.skipIf(!temProvas)('print de cada questão: conteúdo mínimo', () => {
  const indice = temProvas ? ler(join(DEST, 'indice.json')) : [];
  const provas: { id: string; alternativas: number; questoes: QPrint[] }[] = indice.map((x: { id: string }) => ler(join(DEST, x.id, 'prova.json')));

  it('nenhum print é só uma linha (cabeçalho sem texto nem alternativas)', () => {
    for (const p of provas) for (const q of p.questoes) expect(q.alt, `${p.id} q${q.n}: print com ${q.alt}px de altura`).toBeGreaterThanOrEqual(80);
  });

  it('quando a camada de texto traz as letras das alternativas, toda questão as traz no recorte', () => {
    for (const p of provas) {
      const letras = 'ABCDE'.slice(0, p.alternativas || 5).split('');
      const tem = p.questoes.map((q) => letras.filter((l) => letrasNoTexto(q.texto || '').has(l)).length >= letras.length - 1);
      if (tem.filter(Boolean).length < 0.9 * p.questoes.length) continue;   // letras desenhadas (círculos, imagens): não dá para conferir pelo texto
      p.questoes.forEach((q, i) => {
        if (!tem[i] && !(SEM_LETRA_NO_TEXTO[p.id] || []).includes(q.n)) expect.fail(`${p.id} q${q.n}: recorte sem as alternativas A–${letras.at(-1)}`);
      });
    }
  });

  it('o recorte não leva o texto de apoio de outras questões ("texto para as questões X a Y")', () => {
    for (const p of provas) for (const q of p.questoes) {
      if ((FAIXA_CONFERIDA[p.id] || []).includes(q.n)) continue;
      const nCad = q.nq ? parseInt(q.nq, 10) : q.n;
      for (const m of (q.texto || '').matchAll(/quest\p{L}*[^\p{L}\p{N}]{0,3}(?:de|das|dos|from|nos)?\s*(\d{1,3})\s*(?:a|e|to|and|–|-|até)\s*(\d{1,3})(?!\d)/giu)) {
        const [a, b] = [+m[1], +m[2]];
        if (a < b && b - a < 30) expect(a <= nCad && nCad <= b || (a <= q.n && q.n <= b), `${p.id} q${q.n}: traz o texto das questões ${a} a ${b}`).toBe(true);
      }
    }
  });

  it('provas que renumeram o 2º caderno mostram o número do caderno com o dia/caderno', () => {
    for (const p of provas) {
      const com = p.questoes.filter((q) => q.nq);
      if (!com.length) continue;
      expect(com.length, p.id).toBe(p.questoes.length);
      for (const q of com) {
        expect(q.nq, `${p.id} q${q.n}`).toMatch(/^\d{1,3} \(.+\)$/);
        expect(parseInt(q.nq!, 10)).toBeLessThanOrEqual(q.n);
      }
    }
  });
});


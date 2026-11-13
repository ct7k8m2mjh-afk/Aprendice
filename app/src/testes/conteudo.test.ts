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
      const dados = ler(join(ORIGEM, m, 'dados.json'));
      // comando 21: as questões de sites didáticos (tipo "site") ficam só no protótipo; aqui só as de prova do protótipo
      const orig = { ...dados, banco: dados.banco.filter((q: { tipo?: string }) => q.tipo !== 'site') };
      const idsOrig = new Set(orig.banco.map((q: { id: string }) => q.id));
      // as questões das provas completas vêm depois das do protótipo; aqui só as do protótipo
      const banco = (ler(join(DEST, m, 'banco.json')) as { id: string; gab: string; alts: Record<string, string>; sub: string; url: string; escola: string; ano: string; origem: string; pendente?: string; prova?: string }[]).filter((q) => idsOrig.has(q.id));
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

// Questões das provas completas nos exercícios das matérias (comando 14): id estável, fonte, gabarito, sem duplicar.
type QBanco = { id: string; gab: string; sub: string; modulo: string; url: string; escola: string; ano: string; n: string; dif: number; prova?: string; print?: string; txt?: number; pendente?: string };
const TODAS = ['bio', 'qui', 'mat', 'por', 'fis', 'geo', 'his', 'fs', 'ing'];
const FONTE_PROVAS = join(RAIZ, 'conteudo-fonte', 'provas');

describe.skipIf(!temConteudo)('questões das provas nos exercícios', () => {
  const bancos = Object.fromEntries(TODAS.map((m) => [m, ler(join(DEST, m, 'banco.json')) as QBanco[]]));
  const dup = ler(join(DEST, 'duplicatas-provas.json')) as Record<string, string>;

  it('nenhum id do banco antigo sumiu (princípio 7); as de site saíram e estão na tabela de retiradas', () => {
    const tab = readFileSync(join(RAIZ, 'src', 'dados', 'questoesRetiradas.ts'), 'utf-8');
    for (const m of MATS) {
      const ids = new Set(bancos[m].map((q) => q.id));
      for (const q of ler(join(ORIGEM, m, 'dados.json')).banco as { id: string; tipo?: string }[]) {
        if (q.tipo === 'site') { expect(ids.has(q.id), `${m}/${q.id} (site)`).toBe(false); expect(tab, q.id).toContain(`"${q.id}":`); }
        else expect(ids.has(q.id), `${m}/${q.id}`).toBe(true);
      }
    }
  });
  it('duplicata: fica o id antigo, com o print, o texto e o link da prova oficial', () => {
    for (const [pid, alvo] of Object.entries(dup)) {
      const [m, id] = alvo.split('/');
      const q = bancos[m].find((x) => x.id === id)! as QBanco & { provaOficial?: string };
      expect(q.provaOficial, alvo).toBeTruthy();
      const p = ler(join(FONTE_PROVAS, q.provaOficial!, 'prova.json')) as { questoes: { id: string; gab: string; print: string }[] };
      const orig = p.questoes.find((x) => x.id === pid)!;
      expect(q.gab, alvo).toBe(orig.gab);
      expect(q.print, alvo).toBe('provas/' + q.provaOficial + '/' + orig.print);
      expect(existsSync(join(DEST, q.print!)), q.print).toBe(true);
      expect(q.txt, alvo).toBe(1);
    }
  });
  it('sem ids repetidos e sem a mesma questão duas vezes', () => {
    const todos = TODAS.flatMap((m) => bancos[m]);
    expect(new Set(todos.map((q) => q.id)).size).toBe(todos.length);
    const ids = new Set(todos.map((q) => q.id));
    for (const [pid, alvo] of Object.entries(dup)) {
      expect(ids.has(pid), `duplicata ${pid} entrou`).toBe(false);
      const [m, id] = alvo.split('/');
      expect(bancos[m].some((q) => q.id === id), `antiga ${alvo}`).toBe(true);
    }
    // mesma prova e mesmo número só uma vez entre as questões das provas
    const chaves = todos.filter((q) => q.prova).map((q) => q.prova + '#' + q.n + '#' + q.id);
    expect(new Set(chaves).size).toBe(chaves.length);
  });
  it('cada questão nova tem fonte, print, gabarito oficial e nível; conteúdo existe na matéria', () => {
    let n = 0;
    for (const m of TODAS) {
      const subs = new Set((ler(join(DEST, m, 'materia.json')).modulos as { subs: { id: string }[] }[]).flatMap((x) => x.subs.map((s) => s.id)));
      const provas = new Map<string, { questoes: { id: string; gab: string }[] }>();
      for (const q of bancos[m].filter((x) => x.prova)) {
        n++;
        if (!provas.has(q.prova!)) provas.set(q.prova!, ler(join(FONTE_PROVAS, q.prova!, 'prova.json')));
        const orig = provas.get(q.prova!)!.questoes.find((x) => x.id === q.id);
        expect(orig, `${q.id} está na prova ${q.prova}`).toBeTruthy();
        if (orig!.gab) expect(q.gab, q.id).toBe(orig!.gab);
        // sem gabarito publicado: fora do ar até o gabarito do Aprendice (dois especialistas às cegas)
        else expect(q.gab === '' ? q.pendente : (q as { gabFonte?: string }).gabFonte, q.id).toBeTruthy();
        expect(q.url, q.id).toMatch(/^https?:\/\//);
        expect(q.escola && q.ano && q.n, q.id).toBeTruthy();
        expect(existsSync(join(DEST, q.print!)), `print ${q.print}`).toBe(true);
        expect(q.dif >= 1 && q.dif <= 10, q.id).toBe(true);
        expect(subs.has(q.sub) && q.sub.startsWith(q.modulo + '.'), `${m} ${q.id} ${q.sub}`).toBe(true);
        expect(q.txt).toBe(1);
      }
    }
    expect(n).toBeGreaterThan(1000);
  });
  it('as matérias novas têm questões e texto à parte por conteúdo', () => {
    for (const m of ['fis', 'geo', 'his', 'fs', 'ing']) {
      expect(bancos[m].length, m).toBeGreaterThan(100);
      const txt: Record<string, unknown> = {};
      for (const f of readdirSync(join(DEST, m, 'txt'))) Object.assign(txt, ler(join(DEST, m, 'txt', f)));
      for (const q of bancos[m]) expect(txt[q.id], `texto de ${q.id}`).toBeTruthy();
    }
  });
});

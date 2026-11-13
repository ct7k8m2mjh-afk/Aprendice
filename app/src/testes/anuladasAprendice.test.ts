// Decisão do dono (13/11/2026): "questão anulada pelo Aprendice" (gabarito oficial contra os fatos, enunciado com erro,
// dado faltando ou premissa impossível) vale como anulada pela banca: fora do site (temas, conteúdos, treinos, treino
// geral, simulado por conteúdo) e, no simulado da prova inteira, contada como anulada (sai da prova publicada).
// Lista única: conteudo-fonte/anuladas-aprendice.json (scripts/converte.py). A fonte não muda e o id também não.
import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { monta } from '../dados/conteudo';
import type { ProvaCompleta } from '../dados/provasCompletas';
import { planoDaProva, planoDoConteudo } from '../logica/simulados';
import { questoesTreinoGeral, type RegiaoId } from '../logica/regiao';
import type { MateriaConteudo, MateriaId, Questao } from '../dados/tipos';

const APP = join(__dirname, '..', '..');
const PUB = join(APP, 'public', 'conteudo');
const MATERIAS: MateriaId[] = ['bio', 'qui', 'mat', 'por', 'fis', 'geo', 'his', 'fs', 'ing'];
const ler = <T,>(p: string): T => JSON.parse(readFileSync(p, 'utf-8')) as T;
const montado = existsSync(join(PUB, 'fs', 'banco.json')) && existsSync(join(PUB, 'provas', 'indice.json'));
const LISTA = ler<{ questoes: Record<string, { questao: string; motivo: string; decisao: string }> }>(
  join(APP, 'conteudo-fonte', 'anuladas-aprendice.json')).questoes;
const DECIDIDAS = ['Pc90de958', 'Pd7fbdc3f', 'P855bb53e', 'Pb1863457', 'Pe5a5d0ab', 'Pb024ee4d', 'P88f37147', 'P7f440cd0',
  'P525706b9', 'Pcc7ef326', 'Pd1c0ef9d', 'Pc520853b'];

describe('lista de anuladas pelo Aprendice', () => {
  it('traz as 12 questões decididas pelo dono, cada uma com motivo e decisão', () => {
    for (const id of DECIDIDAS) expect(LISTA[id], id).toBeDefined();
    for (const [id, v] of Object.entries(LISTA)) {
      expect(id).toMatch(/^P[0-9a-f]{8}$/);
      expect(v.motivo.length, id).toBeGreaterThan(20);
      expect(v.decisao, id).toMatch(/dono/);
    }
  });
});

describe.skipIf(!montado)('questões anuladas pelo Aprendice (fora do site)', () => {
  const bancos = Object.fromEntries(MATERIAS.map((m) => [m, ler<Questao[]>(join(PUB, m, 'banco.json'))])) as Record<MateriaId, Questao[]>;
  const conteudos = Object.fromEntries(MATERIAS.map((m) => [m, ler<MateriaConteudo>(join(PUB, m, 'materia.json'))])) as Record<MateriaId, MateriaConteudo>;
  const carregadas = MATERIAS.map((m) => monta(m, bancos[m], conteudos[m]));
  const dup = ler<Record<string, string>>(join(PUB, 'duplicatas-provas.json'));
  // a anulada ou a questão antiga que ficou no lugar dela (duplicata), com o mesmo motivo
  const alvo = new Set(Object.keys(LISTA).flatMap((id) => (dup[id] ? [id, dup[id].split('/')[1]] : [id])));

  it('no banco, com o id de sempre: marcada e fora do ar', () => {
    let n = 0;
    for (const m of MATERIAS) for (const q of bancos[m]) {
      if (!alvo.has(q.id)) { expect(q.anuladaAprendice, `${m}/${q.id}`).toBeUndefined(); continue; }
      n++;
      expect(q.anuladaAprendice).toBeTruthy();
      expect(q.pendente).toMatch(/^anulada pelo Aprendice: /);
    }
    expect(n).toBeGreaterThanOrEqual(Object.keys(LISTA).length);
  });

  it('não aparece em matéria nenhuma (conteúdos, treino geral, simulado por conteúdo)', () => {
    const todas = new Set(['nac', 'sp', 'se', 'sul', 'ne', 'no', 'co'] as RegiaoId[]);
    for (const mc of carregadas) {
      for (const id of alvo) expect(mc.porId.has(id), `${mc.id}/${id}`).toBe(false);
      for (const l of mc.porSub.values()) for (const q of l) expect(alvo.has(q.id), `${mc.id}/${q.id}`).toBe(false);
      for (const id of conteudos[mc.id].essencial?.abc || []) expect(alvo.has(id), `treino geral ${mc.id}/${id}`).toBe(false);
      for (const id of questoesTreinoGeral(conteudos[mc.id].essencial?.abc || [], mc.banco, todas)) expect(alvo.has(id)).toBe(false);
    }
    const fis = bancos.fis.find((q) => q.id === 'P7f440cd0');
    expect(fis).toBeDefined();
    const plano = planoDoConteudo('fis', bancos.fis, [fis!.sub], 45, {}, { rnd: () => 0.5 });
    expect(plano.itens.some((x) => x.id === 'P7f440cd0')).toBe(false);
  });

  it('no simulado da prova inteira conta como anulada: sai da prova publicada e o número vai para fora.anuladas_aprendice', () => {
    const indice = ler<{ id: string; questoes: number }[]>(join(PUB, 'provas', 'indice.json'));
    const vistas = new Set<string>();
    for (const e of indice) {
      const fonte = ler<ProvaCompleta>(join(APP, 'conteudo-fonte', 'provas', e.id, 'prova.json'));
      const anul = fonte.questoes.filter((q) => LISTA[q.id]);
      const pub = ler<ProvaCompleta>(join(PUB, 'provas', e.id, 'prova.json'));
      for (const q of pub.questoes) expect(LISTA[q.id], `${e.id}/${q.id}`).toBeUndefined();
      if (!anul.length) { expect(pub.fora?.anuladas_aprendice).toBeUndefined(); continue; }
      for (const q of anul) vistas.add(q.id);
      expect(pub.questoes).toHaveLength(fonte.questoes.length - anul.length);
      expect(e.questoes).toBe(pub.questoes.length);
      expect(pub.fora?.anuladas_aprendice).toEqual(anul.map((q) => q.n).sort((a, b) => a - b));
      expect(planoDaProva(pub).itens.some((x) => LISTA[x.id])).toBe(false);
    }
    expect([...vistas].sort()).toEqual(Object.keys(LISTA).sort());
  });

  it('URCA 2025.1: a anulada da banca (17, 35) e a do Aprendice (2) ficam fora; a prova segue com as outras', () => {
    const pub = ler<ProvaCompleta>(join(PUB, 'provas', 'urca-2025-1', 'prova.json'));
    expect(pub.fora?.anuladas).toEqual([17, 35]);
    expect(pub.fora?.anuladas_aprendice).toEqual([2]);
    expect(pub.questoes.some((q) => q.n === 2)).toBe(false);
    expect(pub.questoes).toHaveLength(117);
  });
});

// Decisão do dono (19/11/2026): as questões em que a banca do Aprendice acha o gabarito oficial errado (sem errata da
// banca) vão para o site como "Questão indisponível": continuam na lista do conteúdo, com o print, sem responder, sem
// gabarito e sem correção; ficam fora de treinos, treino geral, simulados, revisão e contagens. O id não muda.
// Lista única: conteudo-fonte/indisponiveis.json (scripts/converte.py).
import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { monta } from '../dados/conteudo';
import type { ProvaCompleta } from '../dados/provasCompletas';
import { planoDaProva, planoDoConteudo } from '../logica/simulados';
import { questoesTreinoGeral, type RegiaoId } from '../logica/regiao';
import { questoesVencidas } from '../logica/estatisticas';
import { progressoEscada } from '../logica/estatisticas';
import type { MateriaConteudo, MateriaId, Questao } from '../dados/tipos';
import type { EstadoMateria } from '../estado/tipos';

const APP = join(__dirname, '..', '..');
const PUB = join(APP, 'public', 'conteudo');
const MATERIAS: MateriaId[] = ['bio', 'qui', 'mat', 'por', 'fis', 'geo', 'his', 'fs', 'ing'];
const ler = <T,>(p: string): T => JSON.parse(readFileSync(p, 'utf-8')) as T;
const montado = existsSync(join(PUB, 'fs', 'banco.json')) && existsSync(join(PUB, 'provas', 'indice.json'));
const LISTA = ler<{ questoes: Record<string, { questao: string; motivo: string; suspeita: string }> }>(
  join(APP, 'conteudo-fonte', 'indisponiveis.json')).questoes;

describe('lista de questões indisponíveis', () => {
  it('traz as 53 questões decididas pelo dono em 19/11 (menos a anulada pela UFRR) , as 14 de 20/11 e a Pe436860e (21/11), cada uma com o motivo e o que a banca encontrou', () => {
    expect(Object.keys(LISTA)).toHaveLength(67); // 52 de 19/11 (P02f0b3a0 saiu: anulada pela própria banca, UFRR) + 14 de 20/11 + Pe436860e (geo, 21/11)
    for (const [id, v] of Object.entries(LISTA)) {
      expect(id).toMatch(/^P[0-9a-f]{8}$/);
      expect(v.motivo).toMatch(/^dono, (19|20)\/11: questão indisponível$/);
      expect(v.suspeita.length, id).toBeGreaterThan(20);
    }
  });
});

describe.skipIf(!montado)('questões indisponíveis no site', () => {
  const bancos = Object.fromEntries(MATERIAS.map((m) => [m, ler<Questao[]>(join(PUB, m, 'banco.json'))])) as Record<MateriaId, Questao[]>;
  const conteudos = Object.fromEntries(MATERIAS.map((m) => [m, ler<MateriaConteudo>(join(PUB, m, 'materia.json'))])) as Record<MateriaId, MateriaConteudo>;
  const carregadas = MATERIAS.map((m) => monta(m, bancos[m], conteudos[m]));
  const ids = new Set(Object.keys(LISTA));

  it('no banco, com o id de sempre e o print: marcada, sem gabarito e sem resolução', () => {
    let n = 0;
    for (const m of MATERIAS) for (const q of bancos[m]) {
      if (!q.indisponivel) continue;
      n++;
      expect(ids.has(q.id), `${m}/${q.id}`).toBe(true);
      expect(q.gab).toBe('');
      expect(q.res).toBeUndefined();
      expect(q.print).toBeTruthy();
      expect(existsSync(join(PUB, q.print!)), q.print).toBe(true);
    }
    expect(n).toBe(67);
  });

  it('aparece na lista do conteúdo (para abrir com o selo) e fica fora de banco, treinos, simulados e contagens', () => {
    const todas = new Set(['nac', 'sp', 'se', 'sul', 'ne', 'no', 'co'] as RegiaoId[]);
    let vistas = 0;
    for (const mc of carregadas) {
      for (const q of mc.indisponiveis?.values() || []) {
        vistas++;
        expect(mc.indispPorSub?.get(q.sub)?.some((x) => x.id === q.id)).toBe(true);
        expect(mc.porId.has(q.id)).toBe(false);
        expect(mc.banco.some((x) => x.id === q.id)).toBe(false);
        expect((mc.porSub.get(q.sub) || []).some((x) => x.id === q.id)).toBe(false);
        expect(planoDoConteudo(mc.id, bancos[mc.id], [q.sub], 45, {}, { rnd: () => 0.5 }).itens.some((x) => x.id === q.id)).toBe(false);
      }
      for (const id of conteudos[mc.id].essencial?.abc || []) expect(ids.has(id), `treino geral ${mc.id}/${id}`).toBe(false);
      for (const id of questoesTreinoGeral(conteudos[mc.id].essencial?.abc || [], mc.banco, todas)) expect(ids.has(id)).toBe(false);
    }
    expect(vistas).toBe(67);
  });

  it('o progresso do aluno fica guardado, mas a questão não vence na revisão nem entra no progresso do conteúdo', () => {
    const mc = carregadas.find((x) => x.indisponiveis?.size)!;
    const q = [...mc.indisponiveis!.values()][0];
    const antigo = Date.now() - 400 * 864e5;
    const s = { q: { [q.id]: { tent: [{ letra: 'A', ok: false, ts: antigo, seg: 60, conf: null, dica: 0, ctx: 'escada' }] } } } as unknown as EstadoMateria;
    expect(s.q[q.id].tent).toHaveLength(1);
    expect(questoesVencidas(mc, s, Date.now()).some((x) => x.id === q.id)).toBe(false);
    expect(progressoEscada(mc.porSub.get(q.sub) || [], s).feitas).toBe(0);
  });

  it('no simulado da prova inteira sai da prova publicada e o número vai para fora.indisponiveis', () => {
    const indice = ler<{ id: string; questoes: number }[]>(join(PUB, 'provas', 'indice.json'));
    const vistas = new Set<string>();
    for (const e of indice) {
      const fonte = ler<ProvaCompleta>(join(APP, 'conteudo-fonte', 'provas', e.id, 'prova.json'));
      const ind = fonte.questoes.filter((q) => LISTA[q.id]);
      const pub = ler<ProvaCompleta>(join(PUB, 'provas', e.id, 'prova.json'));
      for (const q of pub.questoes) expect(LISTA[q.id], `${e.id}/${q.id}`).toBeUndefined();
      if (!ind.length) { expect(pub.fora?.indisponiveis).toBeUndefined(); continue; }
      for (const q of ind) vistas.add(q.id);
      expect(pub.fora?.indisponiveis).toEqual(ind.map((q) => q.n).sort((a, b) => a - b));
      expect(planoDaProva(pub).itens.some((x) => LISTA[x.id])).toBe(false);
    }
    expect([...vistas].sort()).toEqual([...ids].sort());
  });
});

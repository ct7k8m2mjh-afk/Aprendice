/**
 * Treino geral de TODAS as matérias (aba Início, comando 32 do dono, 06/11/2026): questões reais de prova de qualquer
 * matéria, sorteadas e misturadas, sem sequência e sem escolher matéria. Não substitui o Treino geral de cada matéria.
 *
 * Sorteio: as matérias com questões entram num rodízio embaralhado (para a rodada não ficar tomada pela matéria de banco
 * maior); em cada volta, cada matéria cede uma questão sorteada do banco inteiro dela. Ficam de fora as questões que o
 * aluno já respondeu hoje (se ainda sobrar banco) e, na prévia de arquivo único, as que não têm print. No fim, a rodada
 * inteira é embaralhada de novo: a ordem não segue matéria, tema nem nível.
 */
import type { MateriaId, Questao } from '../dados/tipos';
import type { EstadoMateria, SessaoMisto } from '../estado/tipos';

export const RODADA_PADRAO = 15;
export const RODADAS = [10, 15, 20, 30] as const;

export interface BancoMateria { id: MateriaId; banco: Questao[] }

export type Aleatorio = () => number;

export function embaralha<T>(l: readonly T[], rnd: Aleatorio = Math.random): T[] {
  const a = [...l];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

function respondidaHoje(s: EstadoMateria | undefined, id: string, agora: number): boolean {
  const t = s?.q[id]?.tent;
  if (!t?.length) return false;
  const ini = new Date(agora); ini.setHours(0, 0, 0, 0);
  return t[t.length - 1].ts >= ini.getTime();
}

/** Monta uma rodada do treino geral de todas as matérias. */
export function sorteiaMisto(
  materias: BancoMateria[],
  estado: Partial<Record<MateriaId, EstadoMateria>>,
  n: number = RODADA_PADRAO,
  opc: { rnd?: Aleatorio; agora?: number; aceita?: (m: MateriaId, q: Questao) => boolean } = {},
): SessaoMisto {
  const rnd = opc.rnd || Math.random;
  const agora = opc.agora ?? Date.now();
  const aceita = opc.aceita || (() => true);
  // por matéria: banco válido (questão de prova, no ar), com as não respondidas hoje primeiro
  const pilhas = new Map<MateriaId, Questao[]>();
  for (const mc of materias) {
    const validas = mc.banco.filter((q) => q.origem === 'prova' && !q.pendente && !q.retirada && aceita(mc.id, q));
    if (!validas.length) continue;
    const novas = validas.filter((q) => !respondidaHoje(estado[mc.id], q.id, agora));
    pilhas.set(mc.id, [...embaralha(novas, rnd), ...embaralha(validas.filter((q) => !novas.includes(q)), rnd)]);
  }
  const it: SessaoMisto['it'] = [];
  const total = [...pilhas.values()].reduce((a, l) => a + l.length, 0);
  const alvo = Math.max(0, Math.min(n, total));
  while (it.length < alvo) {
    for (const m of embaralha([...pilhas.keys()], rnd)) {
      if (it.length >= alvo) break;
      const q = pilhas.get(m)!.shift();
      if (q) it.push({ m, id: q.id });
    }
  }
  return { it: embaralha(it, rnd), i: 0, res: {}, t0: agora };
}

/** Chave de um item na sessão (o mesmo id pode existir em duas matérias). */
export function chaveMisto(x: { m: MateriaId; id: string }): string { return x.m + ':' + x.id; }

/** Resultado da rodada por matéria (para o fim do treino). */
export function resultadoMisto(s: SessaoMisto): { m: MateriaId; n: number; ok: number }[] {
  const por = new Map<MateriaId, { n: number; ok: number }>();
  for (const x of s.it) {
    const r = s.res[chaveMisto(x)];
    if (!r) continue;
    const v = por.get(x.m) || { n: 0, ok: 0 };
    v.n++; if (r === 'a') v.ok++;
    por.set(x.m, v);
  }
  return [...por.entries()].map(([m, v]) => ({ m, ...v }));
}

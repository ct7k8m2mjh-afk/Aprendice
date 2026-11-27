/**
 * Juntar o progresso do aparelho com o da nuvem (contas de verdade, decisão do dono de 20/11/2026).
 * Princípio 7: nada se perde e nenhum id muda. Tentativas, flashcards, revisões, simulados feitos e sessões de estudo
 * são unidos (as mesmas regras da importação de arquivo, estado/migracao.ts); o que só pode ter um valor (simulado,
 * treino ou sessão em andamento, preferências de estudo) fica com o lado mexido por último.
 */
import type { MateriaId } from '../dados/tipos';
import { mesclaMateria, migraEstado } from './migracao';
import { estadoMateriaVazio, estadoVazio, type Estado, type Preferencias } from './tipos';
import { mesclaAndamento } from '../logica/simuladosAndamento';

function obj(x: unknown): Record<string, unknown> | null { return x && typeof x === 'object' && !Array.isArray(x) ? (x as Record<string, unknown>) : null; }

/** Estado vindo da nuvem (ou de qualquer JSON) levado ao formato atual; null quando não há progresso guardado. */
export function estadoDaNuvem(dados: unknown): Estado | null {
  const d = obj(dados);
  if (!d || typeof d.versao !== 'number' || !obj(d.materias)) return null;
  const base = estadoVazio();
  try {
    return migraEstado({ ...base, ...(d as Partial<Estado>), versao: d.versao as number, pref: { ...base.pref, ...(obj(d.pref) || {}) } } as Estado);
  } catch {
    return null;
  }
}

/** preferências de estudo que acompanham o aluno de um aparelho para outro (tema, menu e última matéria ficam no aparelho) */
const PREF_ESTUDO = ['regioes', 'filtroRegiao', 'rodadaMisto', 'minutosHoje'] as const;

/** O que vai para a nuvem: o progresso, sem o perfil (que tem tabela própria), sem perfis guardados de outras contas e
 *  sem as preferências do aparelho. */
export function paraNuvem(e: Estado): Record<string, unknown> {
  const { perfil: _p, perfisSalvos: _ps, perfilSalvo: _p1, conta: _c, pref, ...resto } = e;
  const prefEstudo: Partial<Preferencias> = {};
  for (const k of PREF_ESTUDO) if (pref[k] !== undefined) (prefEstudo as Record<string, unknown>)[k] = pref[k];
  return { ...resto, pref: prefEstudo };
}

function unePorChave<T>(a: T[], b: T[], chave: (x: T) => string): T[] {
  const vis = new Set(a.map(chave));
  return [...a, ...b.filter((x) => x && !vis.has(chave(x)))];
}

/**
 * Junta o estado do aparelho (a) com o da nuvem (b). O perfil e o que é do aparelho (tema, perfis guardados, dono do
 * progresso) ficam com `a`; o progresso é unido.
 */
export function mesclaEstados(a: Estado, b: Estado | null): Estado {
  if (!b) return a;
  const novoA = (a.mexidoEm || 0) >= (b.mexidoEm || 0);
  const recente = novoA ? a : b;
  const outro = novoA ? b : a;

  const materias: Estado['materias'] = {};
  for (const m of new Set([...Object.keys(a.materias || {}), ...Object.keys(b.materias || {})]) as Set<MateriaId>) {
    const x = a.materias[m], y = b.materias[m];
    materias[m] = x && y ? mesclaMateria(x, y) : mesclaMateria(x || estadoMateriaVazio(), y || {});
  }
  const simuladosFeitos = unePorChave(a.simuladosFeitos || [], b.simuladosFeitos || [], (s) => s.sid + '|' + s.ts).sort((p, q) => p.ts - q.ts);

  // treino por matéria em andamento: o que começou por último
  const treino: Estado['treino'] = { ...(outro.treino || {}) };
  for (const [m, t] of Object.entries(recente.treino || {}) as [MateriaId, NonNullable<Estado['treino'][MateriaId]>][]) {
    const o = treino[m];
    if (!o || !t || (t.t0 || 0) >= (o.t0 || 0)) treino[m] = t;
  }

  const prefEstudo: Partial<Preferencias> = {};
  for (const k of PREF_ESTUDO) {
    const v = recente.pref?.[k] !== undefined ? recente.pref[k] : outro.pref?.[k];
    if (v !== undefined) (prefEstudo as Record<string, unknown>)[k] = v;
  }
  const desde = [a.revisaoDesde || 0, b.revisaoDesde || 0].filter((x) => x > 0);

  return {
    ...a,
    versao: 8,
    materias,
    simuladosFeitos,
    // simulado aberto: o do lado mexido por último; os outros em andamento, dos dois lados, ficam pendentes (27/11/2026)
    ...mesclaAndamento(recente, outro, simuladosFeitos),
    treino,
    treinoMisto: recente.treinoMisto ?? null,
    sessaoHoje: recente.sessaoHoje ?? null,
    pref: { ...a.pref, ...prefEstudo },
    migradoDe: [...new Set([...(a.migradoDe || []), ...(b.migradoDe || [])])],
    revisaoDesde: desde.length ? Math.max(...desde) : 0,
    mexidoEm: Math.max(a.mexidoEm || 0, b.mexidoEm || 0) || undefined,
  };
}

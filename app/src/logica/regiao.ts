/**
 * Região das provas (pedido do dono, 09/11/2026): "o aluno que irá fazer uma prova no Sul pratica com provas do Sul;
 * o aluno que irá fazer em São Paulo pratica com provas de São Paulo". Princípio 4: a prova manda.
 *
 * Regiões de prática: Nacional (ENEM), São Paulo (separado), Sudeste sem SP (RJ, MG, ES), Sul, Nordeste, Norte,
 * Centro-Oeste. Cada questão do banco traz a região da prova dela (`rg`, gravado por scripts/converte.py).
 *
 * A "região das minhas provas" do aluno vem sozinha das provas-alvo (todas de SP -> São Paulo; mistura -> as regiões
 * delas) e pode ser trocada à mão (pref.regioes). Onde o aluno pratica, o padrão é "Minha região": as questões das
 * regiões dele + Nacional (ENEM). Os chips trocam para "Todas as regiões" ou uma região só (pref.filtroRegiao).
 * Nunca deixa o aluno sem questão: sem nenhuma da região, a lista volta a ser a de todas as regiões (com aviso).
 */
import type { Questao } from '../dados/tipos';
import type { ProvaCatalogo } from '../dados/provas';

export type RegiaoId = 'nac' | 'sp' | 'se' | 'sul' | 'ne' | 'no' | 'co';
/** Filtro escolhido nos chips: a região do aluno (+ ENEM), todas, ou uma região só. */
export type FiltroRegiao = 'minha' | 'todas' | RegiaoId;

export const REGIOES_PRATICA: { id: RegiaoId; nome: string; curto: string }[] = [
  { id: 'nac', nome: 'Nacional (ENEM)', curto: 'Nacional' },
  { id: 'sp', nome: 'São Paulo', curto: 'São Paulo' },
  { id: 'se', nome: 'Sudeste (RJ, MG, ES)', curto: 'Sudeste' },
  { id: 'sul', nome: 'Sul', curto: 'Sul' },
  { id: 'ne', nome: 'Nordeste', curto: 'Nordeste' },
  { id: 'no', nome: 'Norte', curto: 'Norte' },
  { id: 'co', nome: 'Centro-Oeste', curto: 'Centro-Oeste' },
];
const IDS = new Set<string>(REGIOES_PRATICA.map((r) => r.id));
export function ehRegiao(x: unknown): x is RegiaoId { return typeof x === 'string' && IDS.has(x); }
export function ehFiltro(x: unknown): x is FiltroRegiao { return x === 'minha' || x === 'todas' || ehRegiao(x); }

export function nomeRegiao(r: RegiaoId, curto = true): string {
  const x = REGIOES_PRATICA.find((y) => y.id === r)!;
  return curto ? x.curto : x.nome;
}

const REGIAO_DA_UF: Record<string, RegiaoId> = {
  SP: 'sp', RJ: 'se', MG: 'se', ES: 'se', PR: 'sul', SC: 'sul', RS: 'sul',
  BA: 'ne', SE: 'ne', AL: 'ne', PE: 'ne', PB: 'ne', RN: 'ne', CE: 'ne', PI: 'ne', MA: 'ne',
  AM: 'no', PA: 'no', AC: 'no', RO: 'no', RR: 'no', AP: 'no', TO: 'no',
  GO: 'co', MT: 'co', MS: 'co', DF: 'co',
};
/** Escolas antigas do protótipo (sem rg no banco da prévia de arquivo único): todas de São Paulo, menos o ENEM. */
const ESCOLA_REGIAO: Record<string, RegiaoId> = {
  'ENEM': 'nac', 'Enem': 'nac', 'Fuvest': 'sp', 'Unesp': 'sp', 'Santa Casa (FCMSCSP)': 'sp', 'Albert Einstein': 'sp',
  'São Camilo': 'sp', 'Famema': 'sp', 'FMJ (Jundiaí)': 'sp', 'Fatec': 'sp', 'Sírio-Libanês': 'sp', 'Fema': 'sp',
};

export function regiaoDaUf(uf: string | null | undefined): RegiaoId | null { return (uf && REGIAO_DA_UF[uf.toUpperCase()]) || null; }

/** Região de prática de uma prova do catálogo (ENEM = Nacional; SP fica separado do Sudeste). */
export function regiaoDaProva(p: Pick<ProvaCatalogo, 'uf' | 'regiao'>): RegiaoId | null {
  if (p.regiao === 'Nacional') return 'nac';
  return regiaoDaUf(p.uf);
}

/** Região da prova de uma questão (rg do banco; na falta, pela escola). null: sem região conhecida (passa em todo filtro). */
export function regiaoDaQuestao(q: Pick<Questao, 'escola'> & { rg?: string }): RegiaoId | null {
  return ehRegiao(q.rg) ? q.rg : ESCOLA_REGIAO[q.escola] || null;
}

/** Regiões das provas-alvo (sem repetir, na ordem da lista). Só ENEM -> ['nac']. Sem provas-alvo -> []. */
export function regioesDasProvas(ids: string[], catalogo: Pick<ProvaCatalogo, 'id' | 'uf' | 'regiao'>[]): RegiaoId[] {
  const out: RegiaoId[] = [];
  for (const id of ids) {
    const p = catalogo.find((x) => x.id === id);
    const r = p ? regiaoDaProva(p) : null;
    if (r && !out.includes(r)) out.push(r);
  }
  // ENEM vale em todo lugar: com outra região junto, a região dele já entra pelo "Minha região"
  return out.length > 1 ? out.filter((r) => r !== 'nac') : out;
}

/** A "região das minhas provas": a escolhida à mão (pref.regioes) ou a das provas-alvo. [] = sem região (vê tudo). */
export function minhasRegioes(pref: { regioes?: RegiaoId[] | null }, provasAlvo: string[], catalogo: Pick<ProvaCatalogo, 'id' | 'uf' | 'regiao'>[]): RegiaoId[] {
  const manual = (pref.regioes || []).filter(ehRegiao);
  return manual.length ? manual : regioesDasProvas(provasAlvo, catalogo);
}

/** Conjunto de regiões que o filtro deixa passar (null: todas). "Minha região" = as do aluno + Nacional (ENEM). */
export function regioesDoFiltro(f: FiltroRegiao, minhas: RegiaoId[]): Set<RegiaoId> | null {
  if (f === 'todas') return null;
  if (f === 'minha') return minhas.length ? new Set<RegiaoId>([...minhas, 'nac']) : null;
  return new Set([f]);
}

export function passa(q: Pick<Questao, 'escola'> & { rg?: string }, conj: Set<RegiaoId> | null): boolean {
  if (!conj) return true;
  const r = regiaoDaQuestao(q);
  return !r || conj.has(r);
}

/** Abaixo disto, num conteúdo ou nível, o aluno vê o aviso "poucas questões da sua região". */
export const POUCAS = 5;

export interface Filtrado<T> {
  /** a lista para praticar: só da região; sem nenhuma da região, a lista inteira (reserva) */
  l: T[];
  /** quantas da região */
  daRegiao: number;
  /** quantas no total (todas as regiões) */
  total: number;
  /** a lista é a de todas as regiões porque a região não tem nenhuma */
  reserva: boolean;
  /** há poucas da região e existem outras: mostrar o aviso discreto com "ver de outras regiões" */
  poucas: boolean;
}

/** Aplica o filtro de região com reserva: nunca devolve vazio se a lista inteira tem questões. */
export function filtraRegiao<T extends Pick<Questao, 'escola'> & { rg?: string }>(l: T[], conj: Set<RegiaoId> | null): Filtrado<T> {
  if (!conj) return { l, daRegiao: l.length, total: l.length, reserva: false, poucas: false };
  const f = l.filter((q) => passa(q, conj));
  const reserva = !f.length && l.length > 0;
  return { l: reserva ? l : f, daRegiao: f.length, total: l.length, reserva, poucas: f.length < POUCAS && l.length > f.length };
}

/** Nome do filtro para o aluno ("São Paulo e ENEM", "todas as regiões"...). */
export function descreveFiltro(f: FiltroRegiao, minhas: RegiaoId[]): string {
  if (f === 'todas' || (f === 'minha' && !minhas.length)) return 'todas as regiões';
  if (f === 'minha') {
    const nomes = minhas.filter((r) => r !== 'nac').map((r) => nomeRegiao(r));
    return juntaE([...nomes, 'ENEM']);
  }
  return f === 'nac' ? 'ENEM' : nomeRegiao(f);
}

export function juntaE(l: string[]): string {
  return l.length <= 1 ? l.join('') : l.slice(0, -1).join(', ') + ' e ' + l[l.length - 1];
}

/** Quantas questões a lista do Treino geral da matéria procura ter na região antes de completar com as de outras. */
export const TREINO_REGIAO_N = 40;

/**
 * Questões do Treino geral de uma matéria para o filtro do aluno. A lista base (essencial.abc: as questões reais dos
 * temas que mais caem) foi montada com o banco antigo, quase todo de São Paulo; por isso, na região do aluno:
 * 1. as da lista base que são da região;
 * 2. completa com questões da região, dos mesmos temas da lista base, níveis 1 a 6, primeiro as com resolução comentada
 *    (ordem estável pelo id, sem sorteio aqui);
 * 3. sem nenhuma da região, a lista base inteira (nunca deixa o aluno sem treino).
 * Sem filtro (todas as regiões), é a lista base.
 */
export function questoesTreinoGeral<T extends Pick<Questao, 'id' | 'escola' | 'modulo' | 'dif' | 'origem'> & { rg?: string; cr?: 1; pendente?: string; retirada?: true }>(
  abc: string[], banco: T[], conj: Set<RegiaoId> | null,
): string[] {
  if (!conj) return abc;
  const porId = new Map(banco.map((q) => [q.id, q]));
  const base = abc.filter((id) => { const q = porId.get(id); return !!q && passa(q, conj); });
  if (base.length < TREINO_REGIAO_N) {
    const temas = new Set(abc.map((id) => porId.get(id)?.modulo).filter(Boolean));
    const ja = new Set(base);
    const extra = banco.filter((q) => !ja.has(q.id) && q.origem === 'prova' && !q.pendente && !q.retirada && q.dif <= 6
      && (!temas.size || temas.has(q.modulo)) && regiaoDaQuestao(q) !== null && conj.has(regiaoDaQuestao(q)!))
      .sort((a, b) => (a.cr ? 0 : 1) - (b.cr ? 0 : 1) || a.id.localeCompare(b.id));
    base.push(...extra.slice(0, TREINO_REGIAO_N - base.length).map((q) => q.id));
  }
  return base.length ? base : abc;
}

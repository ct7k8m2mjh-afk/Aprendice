/**
 * Migração e mesclagem de progresso. Princípio 7: nunca perder progresso do aluno.
 * - Lê o formato do protótipo (uma chave por matéria: saocamilo.<m>.v1, conteúdo = objeto S).
 * - Lê arquivos exportados pelo protótipo (JSON de S de uma matéria) e pelo app novo (Estado inteiro).
 * - Mescla sem apagar: tentativas são unidas por timestamp; flashcards ficam com o registro mais recente.
 */
import { MATERIA_UNIDA, materiaAtual, type MateriaId } from '../dados/tipos';
import type { EstadoMateria, EstadoQuestao, Estado, FlashRec, SessaoTreino, SimuladoFeito, SimuladoResultado } from './tipos';
import { estadoMateriaVazio, estadoVazio } from './tipos';
import { RETIRADAS, type RetiradaBruta } from '../dados/questoesRetiradas';

export const CHAVES_PROTOTIPO: Record<string, MateriaId> = {
  'saocamilo.bio.v1': 'bio', 'saocamilo.qui.v1': 'qui', 'saocamilo.mat.v1': 'mat', 'saocamilo.por.v1': 'por',
};

function obj<T>(x: unknown): T | null { return x && typeof x === 'object' && !Array.isArray(x) ? (x as T) : null; }

export function mesclaQ(a: Record<string, EstadoQuestao>, b: Record<string, EstadoQuestao>): Record<string, EstadoQuestao> {
  const out: Record<string, EstadoQuestao> = { ...a };
  for (const id of Object.keys(b)) {
    const x = a[id], y = b[id];
    if (!y || !Array.isArray(y.tent)) continue;
    if (!x) { out[id] = { tent: [...y.tent], rev: !!y.rev }; continue; }
    const porTs = new Map<number, EstadoQuestao['tent'][number]>();
    [...x.tent, ...y.tent].forEach((t) => porTs.set(t.ts, t));
    out[id] = { tent: [...porTs.values()].sort((p, q) => p.ts - q.ts), rev: !!(x.rev || y.rev) };
  }
  return out;
}

export function mesclaSims(a: SimuladoResultado[], b: SimuladoResultado[]): SimuladoResultado[] {
  const vis = new Set(a.map((s) => s.ts + '|' + s.nome));
  return [...a, ...b.filter((s) => s && !vis.has(s.ts + '|' + s.nome))].sort((p, q) => p.ts - q.ts);
}

const ultTs = (x?: FlashRec) => (x && x.hist && x.hist.length ? x.hist[x.hist.length - 1].ts : 0);

export function mesclaFlash(a: Record<string, FlashRec>, b: Record<string, FlashRec>): Record<string, FlashRec> {
  const out: Record<string, FlashRec> = {};
  for (const id of new Set([...Object.keys(a), ...Object.keys(b)])) {
    const x = a[id], y = b[id];
    if (!x || !y) { out[id] = (x || y)!; continue; }
    const base = ultTs(y) > ultTs(x) ? y : x;
    const porTs = new Map<number, FlashRec['hist'][number]>();
    [...(x.hist || []), ...(y.hist || [])].forEach((t) => porTs.set(t.ts, t));
    out[id] = { etapa: base.etapa, vence: base.vence, hist: [...porTs.values()].sort((p, q) => p.ts - q.ts).slice(-12) };
  }
  return out;
}

export function mesclaMateria(a: EstadoMateria, b: Partial<EstadoMateria>): EstadoMateria {
  const sessoes = [...a.sessoes, ...(b.sessoes || [])];
  const vis = new Set<number>();
  return {
    q: mesclaQ(a.q, obj<Record<string, EstadoQuestao>>(b.q) || {}),
    ult: a.ult || b.ult || null,
    sims: mesclaSims(a.sims, Array.isArray(b.sims) ? b.sims : []),
    flash: mesclaFlash(a.flash, obj<Record<string, FlashRec>>(b.flash) || {}),
    flg: { ...(obj(b.flg) || {}), ...a.flg },
    sessoes: sessoes.filter((s) => s && !vis.has(s.ts) && (vis.add(s.ts), true)).sort((p, q) => p.ts - q.ts).slice(-200),
  };
}

/** Aplica os aliases (questões duplicadas que foram retiradas): o progresso passa para a questão mantida. */
export function aplicaAlias(e: EstadoMateria, alias: Record<string, string>): EstadoMateria {
  const q: Record<string, EstadoQuestao> = { ...e.q };
  let mudou = false;
  for (const [velho, novo] of Object.entries(alias)) {
    if (!q[velho]) continue;
    q[novo] = mesclaQ({ [novo]: q[novo] || { tent: [] } }, { [novo]: q[velho] })[novo];
    delete q[velho];
    mudou = true;
  }
  return mudou ? { ...e, q, ult: e.ult && alias[e.ult] ? alias[e.ult] : e.ult } : e;
}

/** Descobre a matéria de um objeto S do protótipo pelos ids de questão. */
export function materiaDoS(s: Partial<EstadoMateria>, idsPorMateria: Record<string, Set<string>>): MateriaId | null {
  const ids = Object.keys(obj(s.q) || {});
  let melhor: string | null = null, n = 0;
  for (const [m, set] of Object.entries(idsPorMateria)) {
    const c = ids.filter((id) => set.has(id)).length;
    if (c > n) { n = c; melhor = m; }
  }
  if (!melhor) {
    // sem questões: tenta pelos ids de cartão (bio-d001, qui-k003...)
    const ids2 = [...Object.keys(obj(s.flash) || {}), ...Object.keys(obj(s.flg) || {})];
    const pref = ids2.map((x) => x.split('-')[0]).find((p) => ['bio', 'qui', 'mat', 'por'].includes(p));
    return (pref as MateriaId) || null;
  }
  return melhor as MateriaId;
}

export interface ResultadoImportacao { materias: MateriaId[]; questoes: number; cartoes: number; erro?: string }

/** Importa um arquivo (texto JSON) para dentro do estado atual, sem apagar nada. */
export function importaArquivo(estado: Estado, texto: string, idsPorMateria: Record<string, Set<string>>): { estado: Estado; r: ResultadoImportacao } {
  let dado: unknown;
  try { dado = JSON.parse(texto); } catch { return { estado, r: { materias: [], questoes: 0, cartoes: 0, erro: 'O arquivo não é um JSON válido.' } }; }
  const d = obj<Record<string, unknown>>(dado);
  if (!d) return { estado, r: { materias: [], questoes: 0, cartoes: 0, erro: 'Arquivo vazio ou em formato desconhecido.' } };

  const novo: Estado = { ...estado, materias: { ...estado.materias } };
  const r: ResultadoImportacao = { materias: [], questoes: 0, cartoes: 0 };
  // ids de questões de site retiradas (comando 21) continuam valendo num arquivo antigo: o histórico entra e segue a tabela
  idsPorMateria = comRetiradas(idsPorMateria);

  const junta = (mArq: MateriaId, s: Partial<EstadoMateria>) => {
    const m = materiaAtual(mArq) || mArq; // arquivo antigo com 'fil' ou 'soc' entra em Filosofia e Sociologia
    const ids = idsPorMateria[m];
    const q = Object.fromEntries(Object.entries(obj<Record<string, EstadoQuestao>>(s.q) || {}).filter(([id, v]) => (!ids || ids.has(id)) && v && Array.isArray(v.tent)));
    const base = novo.materias[m] || estadoMateriaVazio();
    novo.materias[m] = mesclaMateria(base, { ...s, q });
    if (!r.materias.includes(m)) r.materias.push(m);
    r.questoes += Object.keys(q).length;
    r.cartoes += Object.keys(obj(s.flash) || {}).length;
  };

  if ((d.versao === 1 || d.versao === 2 || d.versao === 3) && obj(d.materias)) {
    // exportação do app novo
    for (const [m, s] of Object.entries(d.materias as Record<string, Partial<EstadoMateria>>)) junta(m as MateriaId, s);
    if (Array.isArray(d.simuladosFeitos)) {
      const vis = new Set(novo.simuladosFeitos.map((x) => x.ts));
      // simulados feitos de um arquivo antigo também passam pela migração (matérias unidas)
      const feitos = migraEstado({ ...estadoVazio(), versao: d.versao as number, simuladosFeitos: d.simuladosFeitos as Estado['simuladosFeitos'] }).simuladosFeitos;
      novo.simuladosFeitos = [...novo.simuladosFeitos, ...feitos.filter((x) => !vis.has(x.ts))];
    }
  } else if (obj(d.q) || obj(d.flash)) {
    // exportação do protótipo: o S de uma matéria
    const m = materiaDoS(d as Partial<EstadoMateria>, idsPorMateria);
    if (!m) return { estado, r: { ...r, erro: 'Não reconheci de qual matéria é este arquivo.' } };
    junta(m, d as Partial<EstadoMateria>);
  } else {
    // pode ser um despejo de várias chaves do protótipo: { "saocamilo.bio.v1": {...} | "texto" }
    let achou = false;
    for (const [k, v] of Object.entries(d)) {
      const m = CHAVES_PROTOTIPO[k];
      if (!m) continue;
      const s = typeof v === 'string' ? (() => { try { return JSON.parse(v); } catch { return null; } })() : v;
      if (obj(s)) { junta(m, s as Partial<EstadoMateria>); achou = true; }
    }
    if (!achou) return { estado, r: { ...r, erro: 'Não encontrei progresso do APRENDICE neste arquivo.' } };
  }
  return { estado: aplicaRetiradas(novo), r };
}

/** Na primeira abertura no mesmo navegador do protótipo, puxa as chaves antigas (sem apagá-las). */
export function migraDoNavegador(estado: Estado, ler: (k: string) => string | null): Estado {
  let e = estado;
  for (const [k, m] of Object.entries(CHAVES_PROTOTIPO)) {
    if (e.migradoDe.includes(k)) continue;
    const bruto = ler(k);
    if (!bruto) continue;
    try {
      const s = JSON.parse(bruto) as Partial<EstadoMateria>;
      e = { ...e, materias: { ...e.materias, [m]: mesclaMateria(e.materias[m] || estadoMateriaVazio(), s) }, migradoDe: [...e.migradoDe, k] };
    } catch { /* chave corrompida: deixa como está, não apaga */ }
  }
  return e === estado ? e : aplicaRetiradas(e);
}

/* ============ migração versionada do estado salvo (princípio 7) ============
 * Cada versão nova do formato ganha um passo aqui; o estado salvo passa por todos os passos que faltam, em ordem.
 * v1 -> v2 (comando 18 do dono): Filosofia ('fil') e Sociologia ('soc') viram UMA matéria, Filosofia e Sociologia ('fs').
 * Os ids de questões, temas e cartões não mudam; o progresso das duas é mesclado na matéria nova sem perder nada. */

export const VERSAO_ATUAL = 3;
const ANTIGAS = Object.keys(MATERIA_UNIDA) as (keyof typeof MATERIA_UNIDA)[];

/** Momento da última atividade de uma matéria (tentativas, cartões, sessões), para escolher o "continuar de onde parou". */
function ultimaAtividade(s: EstadoMateria | undefined, qid?: string | null): number {
  if (!s) return 0;
  if (qid) return Math.max(0, ...(s.q[qid]?.tent || []).map((t) => t.ts));
  return Math.max(0, ...Object.values(s.q).flatMap((x) => x.tent.map((t) => t.ts)), ...s.sessoes.map((x) => x.ts));
}

function mudaM<T extends { m?: MateriaId }>(x: T): T {
  const m = materiaAtual(x.m);
  return m === x.m ? x : { ...x, m };
}

function v1paraV2(e: Estado): Estado {
  const mats = { ...e.materias } as Record<string, EstadoMateria | undefined>;
  const treino = { ...e.treino } as Record<string, SessaoTreino | undefined>;
  for (const velha of ANTIGAS) {
    const nova = MATERIA_UNIDA[velha];
    const s = mats[velha];
    if (s) {
      const base = mats[nova] || estadoMateriaVazio();
      const junto = mesclaMateria(base, s);
      // "continuar de onde parou": fica a questão respondida por último entre as duas
      const ult = ultimaAtividade(s, s.ult) > ultimaAtividade(base, base.ult) ? s.ult || base.ult : base.ult || s.ult;
      mats[nova] = { ...junto, ult };
      delete mats[velha];
    }
    const t = treino[velha];
    if (t) {
      const atual = treino[nova];
      if (!atual || t.t0 > atual.t0) treino[nova] = t; // sessão de treino em andamento: fica a mais recente (as respostas já estão em q)
      delete treino[velha];
    }
  }
  const simulado = e.simulado ? { ...e.simulado, itens: e.simulado.itens.map(mudaM) } : e.simulado;
  const simuladosFeitos = e.simuladosFeitos.map((f) => {
    const por = { ...f.porMateria } as Record<string, { acertos: number; total: number } | undefined>;
    for (const velha of ANTIGAS) {
      const x = por[velha];
      if (!x) continue;
      const nova = MATERIA_UNIDA[velha];
      const y = por[nova];
      por[nova] = { acertos: x.acertos + (y?.acertos || 0), total: x.total + (y?.total || 0) };
      delete por[velha];
    }
    return { ...f, porMateria: por as SimuladoFeito['porMateria'], itens: f.itens.map(mudaM) };
  });
  const ultimaMateria = materiaAtual(e.pref.ultimaMateria) || null;
  return { ...e, versao: 2, materias: mats as Estado['materias'], treino: treino as Estado['treino'], simulado, simuladosFeitos, pref: { ...e.pref, ultimaMateria } };
}

/* v2 -> v3 (comando 21 do dono): as questões copiadas de sites didáticos saíram do site (docs/questoes-aprendice.md).
 * - Com questão de prova equivalente (mesma questão, achada na triagem): o histórico (tentativas, revisão espaçada,
 *   marcada, "continuar de onde parou", treino e simulado em andamento) passa para o id da questão de prova.
 * - Sem equivalente: o histórico fica guardado no id antigo (nada é apagado) e continua contando no desempenho e na
 *   revisão do conteúdo (logica/estatisticas.ts). Quando a Questão Aprendice do conteúdo chegar, a tabela ganha o
 *   destino e este mesmo passo leva o histórico até ela.
 * A tabela cresce com o tempo (provas novas, Questões Aprendice), por isso o passo roda em toda carga: é idempotente. */

export interface Retirada { m: MateriaId; sub: string; dif: number; para?: { m: MateriaId; id: string } }
export type TabelaRetiradas = Partial<Record<MateriaId, Record<string, RetiradaBruta>>>;

function leRetirada(m: MateriaId, r: RetiradaBruta | undefined): Retirada | null {
  if (!r) return null;
  return { m, sub: r[0], dif: r[1], ...(r[2] && r[3] ? { para: { m: r[2], id: r[3] } } : {}) };
}

/** A questão de site retirada (ou null se o id não é de uma questão retirada). */
export function retirada(m: MateriaId, id: string, tabela: TabelaRetiradas = RETIRADAS): Retirada | null {
  return leRetirada(m, tabela[m]?.[id]);
}

/** Todas as questões retiradas de uma matéria. */
export function retiradasDe(m: MateriaId, tabela: TabelaRetiradas = RETIRADAS): (Retirada & { id: string })[] {
  return Object.entries(tabela[m] || {}).map(([id, r]) => ({ id, ...leRetirada(m, r)! }));
}

function comRetiradas(ids: Record<string, Set<string>>, tabela: TabelaRetiradas = RETIRADAS): Record<string, Set<string>> {
  const out: Record<string, Set<string>> = { ...ids };
  for (const [m, t] of Object.entries(tabela)) if (t) out[m] = new Set([...(ids[m] || []), ...Object.keys(t)]);
  return out;
}

/** Passo v2 -> v3: leva o histórico das questões de site retiradas à questão de prova equivalente (quando existe). */
export function aplicaRetiradas(e: Estado, tabela: TabelaRetiradas = RETIRADAS): Estado {
  const destino = (m: MateriaId | undefined, id: string) => (m ? retirada(m, id, tabela)?.para : undefined);
  let mats = e.materias;
  let mudou = false;
  for (const [mm, s] of Object.entries(e.materias)) {
    const m = mm as MateriaId;
    if (!s || !tabela[m]) continue;
    for (const id of Object.keys(s.q)) {
      const p = destino(m, id);
      if (!p) continue;
      const hist = mats[m]!.q[id];
      const q = { ...mats[m]!.q };
      delete q[id];
      const ult = mats[m]!.ult === id ? (p.m === m ? p.id : mats[m]!.ult) : mats[m]!.ult;
      mats = { ...mats, [m]: { ...mats[m]!, q, ult } };
      const alvo = mats[p.m] || estadoMateriaVazio();
      mats = { ...mats, [p.m]: { ...alvo, q: mesclaQ(alvo.q, { [p.id]: hist }) } };
      mudou = true;
    }
  }
  // treino geral em andamento: item de site vira a questão de prova (mesma matéria) ou sai da sessão
  let treino = e.treino;
  for (const [mm, t] of Object.entries(e.treino)) {
    const m = mm as MateriaId;
    if (!t || !t.it.some((x) => x.k === 'q' && retirada(m, x.id, tabela))) continue;
    const it: typeof t.it = [];
    let i = t.i;
    t.it.forEach((x, k) => {
      const r = x.k === 'q' ? retirada(m, x.id, tabela) : null;
      if (!r) { it.push(x); return; }
      if (r.para && r.para.m === m) { it.push({ ...x, id: r.para.id }); return; }
      if (k < t.i) i--; // item já feito saiu: a posição atual recua junto
    });
    treino = { ...treino, [m]: { ...t, it, i: Math.max(0, Math.min(i, it.length)) } };
    mudou = true;
  }
  // simulados (em andamento e feitos): os itens de questões do banco apontam para o id novo
  const trocaItem = <T extends { m?: MateriaId; id: string; p?: string }>(x: T): T => {
    const p = x.p ? undefined : destino(x.m, x.id);
    if (!p) return x;
    mudou = true;
    return { ...x, m: p.m, id: p.id };
  };
  const simulado = e.simulado ? { ...e.simulado, itens: e.simulado.itens.map(trocaItem) } : e.simulado;
  const simuladosFeitos = e.simuladosFeitos.map((f) => ({ ...f, itens: f.itens.map(trocaItem) }));
  if (simulado && e.simulado) {
    // respostas e marcações do simulado em andamento são guardadas pelo id do item
    const novoId = new Map(e.simulado.itens.map((x, k) => [x.id, simulado.itens[k].id]));
    simulado.resp = Object.fromEntries(Object.entries(e.simulado.resp).map(([k, v]) => [novoId.get(k) || k, v]));
    simulado.marcadas = e.simulado.marcadas.map((k) => novoId.get(k) || k);
  }
  return mudou ? { ...e, materias: mats, treino, simulado, simuladosFeitos } : e;
}

/** Leva um estado salvo (de qualquer versão conhecida) ao formato atual. Estado já atual volta sem mudança. */
export function migraEstado(d: Estado | (Omit<Estado, 'versao'> & { versao: number }), tabela: TabelaRetiradas = RETIRADAS): Estado {
  let e = d as Estado;
  if ((e.versao as number) < 2) e = v1paraV2({ ...e, versao: 2 });
  if ((e.versao as number) < 3) e = { ...e, versao: 3 };
  return aplicaRetiradas(e, tabela);
}

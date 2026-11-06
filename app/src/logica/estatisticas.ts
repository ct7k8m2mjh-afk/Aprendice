import type { EstadoMateria, Estado } from '../estado/tipos';
import type { MateriaCarregada } from '../dados/conteudo';
import type { MateriaId, Questao } from '../dados/tipos';
import { filaDe, flashVencido, iniDia, DIA, type Fila } from './revisao';

/** Questões em que o aluno pode ter histórico: as do banco e as de site retiradas sem equivalente (comando 21),
 *  que não aparecem mais mas continuam contando no desempenho (nunca mostrar a lista: use mc.banco para isso). */
export function comHistorico(mc: MateriaCarregada): Questao[] {
  return mc.retiradas?.length ? [...mc.banco, ...mc.retiradas] : mc.banco;
}

/** Revisão de uma questão retirada: vale pelo conteúdo. As respostas dadas depois a outras questões do mesmo
 *  conteúdo contam como a revisão dela (acertou na data, avança; errou, volta a 1 dia). */
export function filaRetirada(mc: MateriaCarregada, s: EstadoMateria, r: Questao): Fila | null {
  const eq = s.q[r.id];
  if (!eq?.tent.length) return null;
  const ult = eq.tent[eq.tent.length - 1].ts;
  const depois = (mc.porSub.get(r.sub) || []).flatMap((q) => (s.q[q.id]?.tent || []).filter((t) => t.ts > ult));
  return filaDe({ tent: [...eq.tent, ...depois].sort((a, b) => a.ts - b.ts) });
}

export interface ResumoMateria {
  total: number;
  feitas: number;
  acertos: number; // questões cuja última tentativa foi certa
  tentativas: number;
  acertoTentativas: number;
  vencidas: number;
  flashVencidos: number;
  flashNovos: number;
}

export function resumoMateria(mc: MateriaCarregada, s: EstadoMateria, agora = Date.now()): ResumoMateria {
  let feitas = 0, acertos = 0, tentativas = 0, acertoTentativas = 0;
  for (const q of comHistorico(mc)) {
    const eq = s.q[q.id];
    if (!eq || !eq.tent.length) continue;
    feitas++;
    if (eq.tent[eq.tent.length - 1].ok) acertos++;
    tentativas += eq.tent.length;
    acertoTentativas += eq.tent.filter((t) => t.ok).length;
  }
  const vencidas = questoesVencidas(mc, s, agora).length;
  const cartoes = cartoesAtivos(mc, s);
  const flashVencidos = cartoes.filter((c) => flashVencido(s.flash[c.id], agora)).length;
  const flashNovos = cartoes.filter((c) => !s.flash[c.id]?.hist?.length).length;
  return { total: mc.banco.length, feitas, acertos, tentativas, acertoTentativas, vencidas, flashVencidos, flashNovos };
}

/** Flashcards (texto e imagem) que o aluno não tirou com "Não curti". */
export function cartoesAtivos(mc: MateriaCarregada, s: EstadoMateria) {
  return [...mc.conteudo.flash, ...mc.conteudo.flashImg].filter((c) => s.flg[c.id]?.g !== -1);
}

export function questoesVencidas(mc: MateriaCarregada, s: EstadoMateria, ate = Date.now()): Questao[] {
  const l = mc.banco
    .map((q) => ({ q, vence: filaDe(s.q[q.id])?.vence }))
    .filter((x): x is { q: Questao; vence: number } => x.vence !== undefined && x.vence <= ate);
  // questão retirada vencida: entra no lugar dela outra questão do mesmo conteúdo, da dificuldade mais próxima
  const usadas = new Set(l.map((x) => x.q.id));
  for (const r of mc.retiradas || []) {
    const f = filaRetirada(mc, s, r);
    if (!f || f.vence > ate) continue;
    const q = (mc.porSub.get(r.sub) || []).filter((x) => !usadas.has(x.id))
      .sort((a, b) => Math.abs(a.dif - r.dif) - Math.abs(b.dif - r.dif) || (s.q[a.id]?.tent.length || 0) - (s.q[b.id]?.tent.length || 0))[0];
    if (!q) continue;
    usadas.add(q.id);
    l.push({ q, vence: f.vence });
  }
  return l.sort((a, b) => a.vence - b.vence).map((x) => x.q);
}

/** Progresso de uma escada: degraus distintos e quantos já foram acertados. */
export function progressoEscada(qs: Questao[], s: EstadoMateria) {
  const feitas = qs.filter((q) => s.q[q.id]?.tent.length).length;
  const certas = qs.filter((q) => { const t = s.q[q.id]?.tent; return t && t.length && t[t.length - 1].ok; }).length;
  return { total: qs.length, feitas, certas };
}

/** Respostas por dia (todas as matérias), para meta semanal e sequência. */
export function respostasPorDia(e: Estado): Map<number, number> {
  const m = new Map<number, number>();
  for (const s of Object.values(e.materias)) {
    if (!s) continue;
    for (const eq of Object.values(s.q)) for (const t of eq.tent) {
      const d = iniDia(t.ts);
      m.set(d, (m.get(d) || 0) + 1);
    }
  }
  return m;
}

export function semana(e: Estado, agora = Date.now()) {
  const pd = respostasPorDia(e);
  const hoje = iniDia(agora);
  const d = new Date(hoje);
  const dow = (d.getDay() + 6) % 7; // segunda = 0
  const ini = hoje - dow * DIA;
  let n = 0;
  for (let i = 0; i <= dow; i++) n += pd.get(ini + i * DIA) || 0;
  let seq = 0;
  for (let k = pd.get(hoje) ? 0 : 1; ; k++) { if (pd.get(hoje - k * DIA)) seq++; else break; }
  return { semana: n, hoje: pd.get(hoje) || 0, ontem: pd.get(hoje - DIA) || 0, sequencia: seq, dias: [...Array(7)].map((_, i) => pd.get(ini + i * DIA) || 0) };
}

export function tempoTotal(e: Estado): number {
  // tempo de estudo = sessões registradas; quando não há sessão (dados antigos), soma o tempo das respostas
  let ses = 0, resp = 0;
  for (const m of Object.values(e.materias)) if (m) {
    for (const x of m.sessoes) ses += x.seg;
    for (const eq of Object.values(m.q)) for (const t of eq.tent) resp += t.seg || 0;
  }
  return Math.max(ses, resp);
}

/** Matéria menos praticada nos últimos 7 dias (sugestão "matéria de hoje"). */
export function materiaDeHoje(e: Estado, ids: MateriaId[], agora = Date.now()): MateriaId {
  const ini = agora - 7 * DIA;
  let melhor = ids[0], menos = Infinity;
  for (const id of ids) {
    const s = e.materias[id];
    let n = 0;
    if (s) for (const eq of Object.values(s.q)) n += eq.tent.filter((t) => t.ts >= ini).length;
    if (n < menos) { menos = n; melhor = id; }
  }
  return melhor;
}

/** Última atividade (questões) de todas as matérias. */
export function atividadeRecente(e: Estado, n = 5) {
  const l: { m: MateriaId; id: string; ts: number; ok: boolean }[] = [];
  for (const [m, s] of Object.entries(e.materias)) if (s) for (const [id, eq] of Object.entries(s.q)) {
    const t = eq.tent[eq.tent.length - 1];
    if (t) l.push({ m: m as MateriaId, id, ts: t.ts, ok: t.ok });
  }
  return l.sort((a, b) => b.ts - a.ts).slice(0, n);
}

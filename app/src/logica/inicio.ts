/** Números da aba Início (comando 32): desempenho por matéria num período, constância e destaque. Sem DOM. */
import type { MateriaId } from '../dados/tipos';
import type { Estado } from '../estado/tipos';
import { DIA, iniDia } from './revisao';

export interface DesempenhoMateria { m: MateriaId; resolvidas: number; acertos: number }

/** Por matéria: questões respondidas no período (cada questão conta uma vez) e quantas a última resposta do período
 *  acertou. dias = null: desde o começo. ids válidos: só questões que existem no site (as retiradas continuam no
 *  histórico do aluno e também contam, como no desempenho do resto do site). */
export function desempenhoPeriodo(e: Estado, dias: number | null, agora = Date.now()): DesempenhoMateria[] {
  const ini = dias === null ? -Infinity : iniDia(agora) - (dias - 1) * DIA;
  const out: DesempenhoMateria[] = [];
  for (const [m, s] of Object.entries(e.materias)) {
    if (!s) continue;
    let resolvidas = 0, acertos = 0;
    for (const eq of Object.values(s.q)) {
      const t = eq.tent.filter((x) => x.ts >= ini && x.ts <= agora);
      if (!t.length) continue;
      resolvidas++;
      if (t[t.length - 1].ok) acertos++;
    }
    if (resolvidas) out.push({ m: m as MateriaId, resolvidas, acertos });
  }
  return out;
}

/** Dias seguidos com pelo menos uma resposta (questão ou flashcard), contando até hoje (ou até ontem, se hoje ainda
 *  não houve estudo). Flashcards contam desde 21/11/2026 (docs/marketing/RETENCAO.md 2.5). */
export function diasDeConstancia(e: Estado, agora = Date.now()): number {
  const dias = new Set<number>();
  for (const s of Object.values(e.materias)) if (s) {
    for (const eq of Object.values(s.q)) for (const t of eq.tent) if (t.ts <= agora) dias.add(iniDia(t.ts));
    for (const f of Object.values(s.flash)) for (const h of f.hist || []) if (h.ts <= agora) dias.add(iniDia(h.ts));
  }
  let d = iniDia(agora);
  if (!dias.has(d)) d = iniDia(d - DIA / 2);
  let n = 0;
  while (dias.has(d)) { n++; d = iniDia(d - DIA / 2); }
  return n;
}

/** Momento do último estudo: a resposta mais recente a uma questão ou a um flashcard (0 = nunca estudou). */
export function ultimoEstudo(e: Estado): number {
  let u = 0;
  for (const s of Object.values(e.materias)) if (s) {
    for (const eq of Object.values(s.q)) for (const t of eq.tent) u = Math.max(u, t.ts);
    for (const f of Object.values(s.flash)) for (const h of f.hist || []) u = Math.max(u, h.ts);
  }
  return u;
}

/** Matéria de maior acerto no período (com pelo menos `minimo` questões; se nenhuma chega lá, a de maior acerto). */
export function destaque(l: DesempenhoMateria[], minimo = 5): DesempenhoMateria | null {
  const pct = (x: DesempenhoMateria) => x.acertos / x.resolvidas;
  const base = l.some((x) => x.resolvidas >= minimo) ? l.filter((x) => x.resolvidas >= minimo) : l;
  return base.reduce<DesempenhoMateria | null>((a, x) => (!a || pct(x) > pct(a) || (pct(x) === pct(a) && x.resolvidas > a.resolvidas) ? x : a), null);
}

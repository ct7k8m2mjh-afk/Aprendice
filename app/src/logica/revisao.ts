/**
 * Revisão espaçada (mesmas regras do protótipo).
 * Questões: errou, chutou ou usou dica -> entra na fila; volta em 1, 3, 7, 16, 35 dias (por dia do calendário).
 *   Só avança quem acerta NA DATA ou depois dela. Errou de novo: volta a 1 dia.
 * Flashcards e frases: 1, 3, 7, 16, 35, 80 dias. Quase = amanhã e um degrau abaixo; Errei = hoje de novo.
 */
import type { EstadoQuestao, FlashRec } from '../estado/tipos';

export const DIA = 864e5;
export const PASSOS_Q = [1, 3, 7, 16, 35];
export const INTERV_F = [1, 3, 7, 16, 35, 80];
export const MAX_HIST = 12;

export function iniDia(ts: number): number { const d = new Date(ts); d.setHours(0, 0, 0, 0); return d.getTime(); }
export function emNDias(ts: number, n: number): number { const d = new Date(iniDia(ts)); d.setDate(d.getDate() + n); return d.getTime(); }

export interface Fila { etapa: number; vence: number; certeza: boolean }

export function filaDe(eq: EstadoQuestao | undefined): Fila | null {
  if (!eq) return null;
  let est: Fila | null = null;
  for (const x of eq.tent) {
    const fraco = !x.ok || x.conf === 'chute' || (x.dica || 0) > 0;
    if (fraco) est = { etapa: 0, vence: emNDias(x.ts, PASSOS_Q[0]), certeza: !x.ok && x.conf === 'certeza' };
    else if (est && x.ts >= est.vence) {
      const et: number = est.etapa + 1;
      est = et >= PASSOS_Q.length ? null : { etapa: et, vence: emNDias(x.ts, PASSOS_Q[et]), certeza: false };
    }
  }
  return est;
}

export function emDias(ms: number, agora = Date.now()): string {
  const d = Math.round((iniDia(ms) - iniDia(agora)) / DIA);
  return d <= 0 ? 'hoje' : d === 1 ? 'amanhã' : 'em ' + d + ' dias';
}

export function feitaHoje(eq: EstadoQuestao | undefined, agora = Date.now()): boolean {
  if (!eq || !eq.tent.length) return false;
  return eq.tent[eq.tent.length - 1].ts >= iniDia(agora);
}

export function proximoFlash(x: FlashRec | undefined, v: 'a' | 'q' | 'e', ts: number): { etapa: number; vence: number } {
  const et = x ? x.etapa : null;
  if (v === 'e') return { etapa: -1, vence: ts };
  if (v === 'q') { const k = et == null || et < 0 ? 0 : Math.max(0, et - 1); return { etapa: k, vence: emNDias(ts, 1) }; }
  const k = et == null || et < 0 ? 0 : Math.min(et + 1, INTERV_F.length - 1);
  return { etapa: k, vence: emNDias(ts, INTERV_F[k]) };
}

export function marcaFlash(x: FlashRec | undefined, v: 'a' | 'q' | 'e', ts: number, origem?: string): FlashRec {
  const p = proximoFlash(x, v, ts);
  let h = [...(x && x.hist && x.hist.length ? x.hist : []), origem ? { ts, v, c: origem } : { ts, v }];
  if (h.length > MAX_HIST) h = h.slice(-MAX_HIST);
  return { etapa: p.etapa, vence: p.vence, hist: h };
}

export function quandoVolta(x: FlashRec | undefined, v: 'a' | 'q' | 'e', agora = Date.now()): string {
  if (v === 'e') return 'volta hoje';
  const p = proximoFlash(x, v, agora);
  const d = Math.round((iniDia(p.vence) - iniDia(agora)) / DIA);
  let t = d <= 1 ? 'volta amanhã' : 'volta em ' + d + ' dias';
  if (v === 'a' && d <= 1 && p.etapa + 1 < INTERV_F.length) t += ', depois em ' + INTERV_F[p.etapa + 1] + ' dias';
  return t;
}

export function flashVencido(x: FlashRec | undefined, agora = Date.now()): boolean {
  return !!(x && x.hist && x.hist.length && x.vence <= agora);
}

/**
 * Revisão espaçada — MÉTODO APRENDICE DE REVISÃO, fase 2 (docs/estrategia-revisao.md, pilares 2 e 8; comando 24).
 *
 * Questões: errou, chutou ou usou dica -> entra na revisão e volta amanhã. Cada acerto NA DATA marcada (ou depois) é um
 * "acerto espaçado": o intervalo seguinte cresce pela escala 1, 3, 7 dias e a estabilidade da memória cresce junto.
 * Critério de saída (pilar 2): só o sistema tira a questão da revisão, depois de 3 acertos espaçados (cada um num dia
 * diferente, na data marcada). Acertar antes da data não conta. Errou de novo: volta amanhã e zera os acertos.
 *
 * Agenda contada a partir da data da prova (pilar 2): com a data da próxima prova-alvo no perfil, o intervalo vira o
 * menor entre a escala e uma fração do tempo que falta (cerca de 30% a semanas da prova, 7,5% a um ano; Cepeda 2008),
 * e nada é marcado para depois da véspera. Sem data, vale a escala de sempre.
 *
 * Migração (princípio 7): o histórico de tentativas é o mesmo; o que muda é a regra. Até `desde` (momento em que o
 * estado passou para a v7) vale a regra antiga (1, 3, 7, 16, 35 dias, `filaAntiga`): no corte, a etapa antiga vira o
 * número de acertos espaçados e a data marcada fica a mesma. Depois do corte, a regra nova. Ids não mudam.
 *
 * Flashcards e frases: 1, 3, 7, 16, 35, 80 dias (encurtados pela data da prova). Quase = amanhã e um degrau abaixo;
 * Errei = hoje de novo.
 */
import type { EstadoQuestao, FlashRec, Tentativa } from '../estado/tipos';

export const DIA = 864e5;
export const PASSOS_Q = [1, 3, 7, 16, 35];
export const INTERV_F = [1, 3, 7, 16, 35, 80];
export const MAX_HIST = 12;
/** acertos espaçados para a questão sair da revisão */
export const SAIDA = 3;

export function iniDia(ts: number): number { const d = new Date(ts); d.setHours(0, 0, 0, 0); return d.getTime(); }
export function emNDias(ts: number, n: number): number { const d = new Date(iniDia(ts)); d.setDate(d.getDate() + n); return d.getTime(); }
/** dias de calendário entre dois momentos (b − a) */
export function diasEntre(a: number, b: number): number { return Math.round((iniDia(b) - iniDia(a)) / DIA); }

/* ============================================================ agenda pela data da prova */

/** O que a agenda precisa saber: o dia da próxima prova (início do dia, ou null) e o corte da migração v7. */
export interface Agenda { prova: number | null; provaId?: string | null; desde: number }
export const SEM_AGENDA: Agenda = { prova: null, desde: 0 };

/** "2026-11-08" -> início desse dia no fuso do aparelho (ou null se a data não for válida). */
export function diaDaData(iso: string | null | undefined): number | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || '');
  if (!m) return null;
  const d = new Date(+m[1], +m[2] - 1, +m[3]);
  return d.getFullYear() === +m[1] && d.getMonth() === +m[2] - 1 && d.getDate() === +m[3] ? d.getTime() : null;
}

/** Próxima prova-alvo com data (depois de hoje). Só contam as provas que estão na lista de provas-alvo. */
export function proximaProva(provasAlvo: string[], datas: Record<string, string> | undefined, agora = Date.now()): { id: string; dia: number } | null {
  let melhor: { id: string; dia: number } | null = null;
  for (const id of provasAlvo) {
    const dia = diaDaData(datas?.[id]);
    if (dia == null || dia <= iniDia(agora)) continue;
    if (!melhor || dia < melhor.dia) melhor = { id, dia };
  }
  return melhor;
}

export function agendaDe(e: { perfil: { provasAlvo: string[]; datasProva?: Record<string, string> } | null; revisaoDesde?: number }, agora = Date.now()): Agenda {
  const p = e.perfil ? proximaProva(e.perfil.provasAlvo, e.perfil.datasProva, agora) : null;
  return { prova: p ? p.dia : null, provaId: p ? p.id : null, desde: e.revisaoDesde || 0 };
}

/** Fração do tempo até a prova usada como maior intervalo: 30% até 30 dias, 7,5% a partir de 365 (log entre os dois). */
export function fracaoIdeal(diasAteProva: number): number {
  if (diasAteProva <= 30) return 0.3;
  if (diasAteProva >= 365) return 0.075;
  const k = Math.log(diasAteProva / 30) / Math.log(365 / 30);
  return 0.3 + (0.075 - 0.3) * k;
}

/** Intervalo (dias) a partir de `ts`: a escala (`base`) encurtada pela prova e nunca depois da véspera; mínimo 1. */
export function intervalo(base: number, ts: number, ag: Agenda = SEM_AGENDA): number {
  if (!ag.prova) return base;
  const falta = diasEntre(ts, ag.prova);
  if (falta <= 1) return 1;
  const ideal = Math.max(1, Math.round(fracaoIdeal(falta) * falta));
  return Math.max(1, Math.min(base, ideal, falta - 1));
}

/* ============================================================ memória de cada questão */

export interface Fila { etapa: number; vence: number; certeza: boolean }

/** O que o site sabe da memória do aluno numa questão (refeito a partir das tentativas, nada guardado à parte). */
export interface Memoria {
  /** acertos espaçados desde o último erro */
  acertos: number;
  /** estabilidade (dias): R = e^(−t/S) */
  S: number;
  /** última tentativa que contou (erro ou acerto espaçado) */
  ultima: number;
  /** quando a questão volta (ou, fora da revisão, quando um novo acerto conta como espaçado) */
  vence: number;
  /** está na revisão */
  fila: boolean;
  /** o último erro foi com certeza (prioridade) */
  certeza: boolean;
  /** vezes que errou depois de já ter acertado (esqueceu) */
  lapsos: number;
  /** a última tentativa que contou foi fraca (erro, chute ou dica) */
  ultimaFraca: boolean;
  /** já saiu da revisão pelo critério de saída alguma vez desde o último erro */
  saiu: boolean;
}

export const fraca = (x: Tentativa) => !x.ok || x.conf === 'chute' || (x.dica || 0) > 0;

function passo(m: Memoria | null, x: Tentativa, ag: Agenda): Memoria {
  if (fraca(x)) {
    const certeza = !x.ok && x.conf === 'certeza';
    const sabia = !!m && (m.acertos > 0 || m.saiu);
    return { acertos: 0, S: certeza ? 0.5 : 1, ultima: x.ts, vence: emNDias(x.ts, 1), fila: true, certeza, lapsos: (m?.lapsos || 0) + (sabia ? 1 : 0), ultimaFraca: true, saiu: false };
  }
  if (!m) return { acertos: 1, S: PASSOS_Q[1], ultima: x.ts, vence: emNDias(x.ts, intervalo(PASSOS_Q[1], x.ts, ag)), fila: false, certeza: false, lapsos: 0, ultimaFraca: false, saiu: false };
  if (x.ts < m.vence) return m; // antes da data: não conta
  const acertos = m.acertos + 1;
  const S = Math.min(400, Math.max(m.S * 2.5, ((x.ts - m.ultima) / DIA) * 2));
  const sai = m.fila && acertos >= SAIDA;
  const base = PASSOS_Q[Math.min(acertos, PASSOS_Q.length - 1)];
  return { acertos, S, ultima: x.ts, vence: emNDias(x.ts, intervalo(base, x.ts, ag)), fila: m.fila && !sai, certeza: false, lapsos: m.lapsos, ultimaFraca: false, saiu: m.saiu || sai };
}

/** Regra antiga (até a v6): 1, 3, 7, 16, 35 dias; sai depois de 5 acertos na data. Usada só antes do corte `desde`. */
export function filaAntiga(eq: EstadoQuestao | undefined): Fila | null {
  if (!eq) return null;
  let est: Fila | null = null;
  for (const x of eq.tent) {
    if (fraca(x)) est = { etapa: 0, vence: emNDias(x.ts, PASSOS_Q[0]), certeza: !x.ok && x.conf === 'certeza' };
    else if (est && x.ts >= est.vence) {
      const et: number = est.etapa + 1;
      est = et >= PASSOS_Q.length ? null : { etapa: et, vence: emNDias(x.ts, PASSOS_Q[et]), certeza: false };
    }
  }
  return est;
}

/** Memória da questão: regra antiga até o corte da migração, regra nova depois. null = nunca respondida. */
export function memoriaDe(eq: EstadoQuestao | undefined, ag: Agenda = SEM_AGENDA): Memoria | null {
  if (!eq || !eq.tent.length) return null;
  let m: Memoria | null = null;
  let k = 0;
  if (ag.desde > 0 && eq.tent[0].ts < ag.desde) {
    while (k < eq.tent.length && eq.tent[k].ts < ag.desde) m = passo(m, eq.tent[k++], SEM_AGENDA);
    const velha = filaAntiga({ tent: eq.tent.slice(0, k) });
    if (m && velha) {
      // na revisão pela regra antiga: a etapa vira os acertos espaçados e a data marcada não muda
      const sai = velha.etapa >= SAIDA;
      m = { ...m, acertos: velha.etapa, vence: velha.vence, certeza: velha.certeza, fila: !sai, saiu: m.saiu || sai, S: Math.max(m.S, PASSOS_Q[velha.etapa]) };
    } else if (m && m.fila) {
      // a regra antiga já tinha tirado a questão (5 acertos na data): continua fora
      m = { ...m, fila: false, saiu: true, acertos: Math.max(m.acertos, SAIDA), certeza: false };
    }
  }
  for (; k < eq.tent.length; k++) m = passo(m, eq.tent[k], ag);
  return m;
}

export function filaDe(eq: EstadoQuestao | undefined, ag: Agenda = SEM_AGENDA): Fila | null {
  const m = memoriaDe(eq, ag);
  return m && m.fila ? { etapa: m.acertos, vence: m.vence, certeza: m.certeza } : null;
}

/** Quanto o aluno ainda lembra num momento (0 a 1): R = e^(−t/S), t em dias desde a última vez que contou. */
export function retencao(m: Memoria, quando: number): number {
  return Math.exp(-Math.max(0, (quando - m.ultima) / DIA) / m.S);
}

/**
 * Memória projetada para um momento (o dia da prova), supondo que o aluno faça as revisões já marcadas e acerte:
 * enquanto a questão está na revisão e a próxima volta cai antes do momento, conta um acerto na data (vencida = hoje).
 * Fora da revisão, nada é marcado: a memória segue como está.
 */
export function projetaAte(m: Memoria, quando: number, ag: Agenda = SEM_AGENDA, agora = Date.now()): Memoria {
  let x = m;
  for (let k = 0; k < 12 && x.fila; k++) {
    const ts = Math.max(x.vence, agora);
    if (iniDia(ts) >= iniDia(quando)) break;
    x = passo(x, { letra: 'A', ok: true, ts, seg: 0, conf: 'certeza' }, ag);
  }
  return x;
}

/* ============================================================ domínio (pilar 8) */

export type Dominio = 'domina' | 'aprendendo' | 'esqueceu';

/**
 * domina: 3 acertos espaçados (ou mais) e a lembrança ainda firme;
 * esqueceu: errou depois de já ter acertado, ou passou da data e a lembrança provavelmente caiu (R < 40%);
 * aprendendo: o resto (errou da primeira vez, ou tem 1 ou 2 acertos espaçados).
 */
export function dominioDe(m: Memoria, agora = Date.now()): Dominio {
  if (m.ultimaFraca) return m.lapsos > 0 ? 'esqueceu' : 'aprendendo';
  if (agora >= m.vence && retencao(m, agora) < 0.4) return 'esqueceu';
  return m.acertos >= SAIDA ? 'domina' : 'aprendendo';
}

export function emDias(ms: number, agora = Date.now()): string {
  const d = Math.round((iniDia(ms) - iniDia(agora)) / DIA);
  return d <= 0 ? 'hoje' : d === 1 ? 'amanhã' : 'em ' + d + ' dias';
}

export function feitaHoje(eq: EstadoQuestao | undefined, agora = Date.now()): boolean {
  if (!eq || !eq.tent.length) return false;
  return eq.tent[eq.tent.length - 1].ts >= iniDia(agora);
}

export function proximoFlash(x: FlashRec | undefined, v: 'a' | 'q' | 'e', ts: number, ag: Agenda = SEM_AGENDA): { etapa: number; vence: number } {
  const et = x ? x.etapa : null;
  if (v === 'e') return { etapa: -1, vence: ts };
  if (v === 'q') { const k = et == null || et < 0 ? 0 : Math.max(0, et - 1); return { etapa: k, vence: emNDias(ts, 1) }; }
  const k = et == null || et < 0 ? 0 : Math.min(et + 1, INTERV_F.length - 1);
  return { etapa: k, vence: emNDias(ts, intervalo(INTERV_F[k], ts, ag)) };
}

export function marcaFlash(x: FlashRec | undefined, v: 'a' | 'q' | 'e', ts: number, origem?: string, ag: Agenda = SEM_AGENDA): FlashRec {
  const p = proximoFlash(x, v, ts, ag);
  let h = [...(x && x.hist && x.hist.length ? x.hist : []), origem ? { ts, v, c: origem } : { ts, v }];
  if (h.length > MAX_HIST) h = h.slice(-MAX_HIST);
  return { etapa: p.etapa, vence: p.vence, hist: h };
}

export function quandoVolta(x: FlashRec | undefined, v: 'a' | 'q' | 'e', agora = Date.now(), ag: Agenda = SEM_AGENDA): string {
  if (v === 'e') return 'volta hoje';
  const p = proximoFlash(x, v, agora, ag);
  const d = Math.round((iniDia(p.vence) - iniDia(agora)) / DIA);
  let t = d <= 1 ? 'volta amanhã' : 'volta em ' + d + ' dias';
  if (v === 'a' && d <= 1 && p.etapa + 1 < INTERV_F.length) { const n = intervalo(INTERV_F[p.etapa + 1], p.vence, ag); t += ', depois em ' + n + (n === 1 ? ' dia' : ' dias'); }
  return t;
}

export function flashVencido(x: FlashRec | undefined, agora = Date.now()): boolean {
  return !!(x && x.hist && x.hist.length && x.vence <= agora);
}

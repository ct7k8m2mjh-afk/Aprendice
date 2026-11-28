/**
 * Vários simulados em andamento (pedido do dono, 27/11/2026): o aluno pode começar outro simulado sem entregar o que
 * estava fazendo; o anterior fica salvo como pendente (pausado, com respostas, marcações, posição e tempo) e volta de
 * onde parou. `Estado.simulado` continua sendo o simulado aberto; os outros ficam em `Estado.simuladosPendentes`
 * (campo opcional: estados antigos não têm, e nada muda para eles). Nada é apagado aqui: um pendente só sai da lista
 * quando é entregue.
 */
import type { Estado, SimuladoAndamento, SimuladoFeito } from '../estado/tipos';

/** identidade de um simulado em andamento: a prova (sid) e o momento em que começou */
export const chaveAndamento = (s: Pick<SimuladoAndamento, 'sid' | 'iniciadoEm'>) => `${s.sid}|${s.iniciadoEm}`;

/** quanto já foi feito (para escolher a cópia mais adiantada quando a mesma aparece duas vezes) */
const progresso = (s: SimuladoAndamento) => Object.keys(s.resp || {}).length * 1e6 + (s.usadoSeg || 0);

/** Todos os simulados em andamento: o aberto primeiro, depois os pendentes do começado por último ao mais antigo. */
export function emAndamento(e: Pick<Estado, 'simulado' | 'simuladosPendentes'>): SimuladoAndamento[] {
  const pend = [...(e.simuladosPendentes || [])].sort((a, b) => b.iniciadoEm - a.iniciadoEm);
  return e.simulado ? [e.simulado, ...pend.filter((p) => chaveAndamento(p) !== chaveAndamento(e.simulado!))] : pend;
}

/** O simulado em andamento desta prova (aberto ou pendente), se houver. */
export function andamentoDaProva(e: Pick<Estado, 'simulado' | 'simuladosPendentes'>, sid: string): SimuladoAndamento | undefined {
  return emAndamento(e).find((s) => s.sid === sid);
}

/**
 * Abre um simulado: o que estava aberto vai para os pendentes (pausado). Se já houver um desta mesma prova em
 * andamento, ele é retomado no lugar de começar outro (nada se perde nem se duplica).
 */
export function abreSimulado(e: Estado, novo: SimuladoAndamento): Estado {
  const existente = andamentoDaProva(e, novo.sid);
  const alvo = existente || novo;
  const k = chaveAndamento(alvo);
  const pend = (e.simuladosPendentes || []).filter((p) => chaveAndamento(p) !== k);
  if (e.simulado && chaveAndamento(e.simulado) !== k) pend.push({ ...e.simulado, pausado: true });
  // quem abre (Começar ou Continuar) volta direto para a questão, sem a tela de pausa
  return { ...e, simulado: { ...alvo, pausado: false }, simuladosPendentes: pend };
}

/** Retoma um pendente pela chave (sid|iniciadoEm); o aberto vai para os pendentes. */
export function retomaSimulado(e: Estado, chave: string): Estado {
  const s = emAndamento(e).find((x) => chaveAndamento(x) === chave);
  return s ? abreSimulado(e, s) : e;
}

/** simulado em andamento que já foi entregue (há um feito da mesma prova depois do começo dele) não volta */
export function andamentoValido(s: SimuladoAndamento | null | undefined, feitos: SimuladoFeito[]): SimuladoAndamento | null {
  if (!s) return null;
  return feitos.some((f) => f.sid === s.sid && f.ts >= s.iniciadoEm) ? null : s;
}

/**
 * Junta os simulados em andamento de dois aparelhos: o aberto é o do lado mexido por último (como antes); todos os
 * outros, dos dois lados, ficam como pendentes, sem repetir (a cópia mais adiantada vence) e sem os já entregues.
 */
export function mesclaAndamento(recente: Pick<Estado, 'simulado' | 'simuladosPendentes'>, outro: Pick<Estado, 'simulado' | 'simuladosPendentes'>,
  feitos: SimuladoFeito[]): Pick<Estado, 'simulado' | 'simuladosPendentes'> {
  const porChave = new Map<string, SimuladoAndamento>();
  for (const s of [...emAndamento(recente), ...emAndamento(outro)]) {
    if (!andamentoValido(s, feitos)) continue;
    const k = chaveAndamento(s);
    const ja = porChave.get(k);
    if (!ja || progresso(s) > progresso(ja)) porChave.set(k, s);
  }
  const aberto = andamentoValido(recente.simulado, feitos) || andamentoValido(outro.simulado, feitos);
  const kAberto = aberto ? chaveAndamento(aberto) : '';
  const simulado = aberto ? porChave.get(kAberto) || aberto : null;
  const simuladosPendentes = [...porChave.values()].filter((s) => chaveAndamento(s) !== kAberto).map((s) => ({ ...s, pausado: true }));
  return { simulado, simuladosPendentes };
}

/**
 * Entrar e sair da conta de demonstração (sem servidor; tudo fica neste aparelho). Revisão de 19/11/2026, casca 38:
 * "Sair da conta" não pode apagar o perfil. Ao sair, o perfil fica guardado (o progresso nunca é tocado);
 * ao entrar de novo, ele volta inteiro (nome, provas-alvo, datas das provas, meta) e o aluno não refaz as boas-vindas.
 *
 * Privacidade (revisão de 20/11/2026, casca N5): o perfil é guardado POR CONTA (e-mail) em `perfisSalvos` e só volta
 * para o mesmo e-mail. Outra pessoa que entra no mesmo aparelho com outro e-mail começa pelas boas-vindas, sem ver
 * nome, provas-alvo, datas nem meta de quem saiu.
 */
import type { Estado, Perfil } from './tipos';

/** chave da conta: e-mail sem espaços e em minúsculas (Ana@X.com e ana@x.com são a mesma conta) */
export function chaveConta(email: string): string {
  return email.trim().toLowerCase();
}

/** perfis guardados por conta, juntando o `perfilSalvo` antigo (um só, de antes de 20/11) à chave do e-mail dele */
function guardados(e: Estado): Record<string, Perfil> {
  const m: Record<string, Perfil> = { ...(e.perfisSalvos || {}) };
  const antigo = e.perfilSalvo;
  if (antigo) {
    const k = chaveConta(antigo.email || '');
    if (k && !m[k]) m[k] = antigo;
  }
  return m;
}

export function saiDaConta(e: Estado): Estado {
  if (!e.perfil) return e;
  const m = guardados(e);
  const k = chaveConta(e.perfil.email || '');
  if (k) m[k] = e.perfil;
  return { ...e, perfisSalvos: m, perfilSalvo: null, perfil: null };
}

/** Entrar com o e-mail: devolve o estado com o perfil DESTA conta de volta, ou null quando é uma conta nova
 *  (segue as boas-vindas). O perfil de outra conta nunca é entregue. */
export function voltaAConta(e: Estado, email: string): Estado | null {
  const k = chaveConta(email);
  if (!k) return null;
  const m = guardados(e);
  const p = m[k];
  if (!p) return null;
  delete m[k];
  return { ...e, perfil: { ...p, email: email.trim() }, perfisSalvos: m, perfilSalvo: null };
}

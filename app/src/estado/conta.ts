/**
 * Entrar e sair da conta de demonstração (sem servidor; tudo fica neste aparelho). Revisão de 19/11/2026, casca 38:
 * "Sair da conta" não pode apagar o perfil. Ao sair, o perfil vai para `perfilSalvo` (o progresso nunca é tocado);
 * ao entrar de novo, ele volta inteiro (nome, provas-alvo, datas das provas, meta) e o aluno não refaz as boas-vindas.
 */
import type { Estado } from './tipos';

export function saiDaConta(e: Estado): Estado {
  if (!e.perfil) return e;
  return { ...e, perfilSalvo: e.perfil, perfil: null };
}

/** Entrar com o e-mail: devolve o estado com o perfil de volta, ou null quando é uma conta nova (segue as boas-vindas). */
export function voltaAConta(e: Estado, email: string): Estado | null {
  const p = e.perfilSalvo;
  if (!p) return null;
  return { ...e, perfil: { ...p, email: email.trim() || p.email }, perfilSalvo: null };
}

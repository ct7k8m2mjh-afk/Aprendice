/**
 * Correção por IA — SIMULADA nesta fase (sem servidor, nada sai do aparelho).
 * Mantém a mesma interface que a correção real terá (veredito, o que faltou, comentário), mas por baixo
 * usa a correção local. Quando houver servidor, só este arquivo muda: ele passa a chamar a API
 * com a resposta do aluno e o cartão, sem nome nem e-mail (LGPD).
 */
import type { Flashcard } from '../dados/tipos';
import type { Correcao } from './correcao';

export const IA_SIMULADA = true;

export async function corrigeComIA(c: Flashcard, resp: string, local: (c: Flashcard, r: string) => Correcao): Promise<Correcao & { origem: 'ia-simulada' }> {
  await new Promise((r) => setTimeout(r, 450));
  const base = local(c, resp);
  return { ...base, origem: 'ia-simulada' };
}

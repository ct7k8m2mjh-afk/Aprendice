/**
 * Degrau da escada "Treine sua evolução" (pedido da coordenação, revisão de 19/11/2026): o título de cada degrau
 * (`conceito`) resume o que a questão cobra e, muitas vezes, o caminho da resposta. Ele só aparece DEPOIS que o aluno
 * respondeu aquela questão; antes, o degrau mostra a fonte (prova · ano · questão), que não entrega nada.
 */
import { numeroQuestao, type Questao } from '../dados/tipos';

export function fonteDegrau(q: Pick<Questao, 'escola' | 'ano' | 'n' | 'nq'>): string {
  return `${q.escola} ${q.ano}${q.n ? ` · questão ${numeroQuestao(q)}` : ''}`;
}

/** Título e linha de apoio do degrau. Respondida: o conceito (ou a fonte, se não houver) e a fonte embaixo.
 *  Não respondida (ou indisponível): só a fonte, sem o conceito. */
export function textoDegrau(q: Pick<Questao, 'escola' | 'ano' | 'n' | 'nq' | 'conceito'>, respondida: boolean): { titulo: string; apoio: string } {
  const fonte = fonteDegrau(q);
  if (respondida && q.conceito) return { titulo: q.conceito, apoio: fonte };
  return { titulo: fonte, apoio: '' };
}

/** Revisão > Marcadas (revisão de 20/11/2026, dados 4): a mesma regra do degrau. O `conceito` (até 80 letras) só
 *  aparece em questão que o aluno já respondeu; marcada sem responder mostra só a matéria e a fonte. */
export function conceitoMarcada(q: Pick<Questao, 'conceito'>, respondida: boolean): string {
  return respondida && q.conceito ? q.conceito.slice(0, 80) : '';
}

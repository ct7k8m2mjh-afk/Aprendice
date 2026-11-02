import { materiaDaArea, type ProvaCompleta } from '../dados/provasCompletas';
import { provaPorId } from '../dados/provas';
import type { ItemSimulado } from '../estado/tipos';

export interface PlanoSimulado {
  sid: string;
  titulo: string;
  descricao: string;
  itens: ItemSimulado[];
  segPorQuestao: number;
}

/** Tempo por questão: o da prova oficial (duração / número de questões); senão o do catálogo; senão 3 min. */
export function tempoPorQuestao(p: Pick<ProvaCompleta, 'duracao_horas' | 'total_oficial' | 'catalogoId'>): number {
  if (p.duracao_horas && p.total_oficial) return Math.round((p.duracao_horas * 3600) / p.total_oficial);
  const c = provaPorId(p.catalogoId);
  const h = c?.formato?.duracao_horas, n = c?.formato?.questoes_objetivas;
  if (h && n) return Math.round((h * 3600) / n);
  return 180;
}

/** Simulado = a prova inteira, na ordem original, com todas as matérias. */
export function planoDaProva(p: ProvaCompleta): PlanoSimulado {
  return {
    sid: 'prova:' + p.id,
    titulo: p.titulo,
    descricao: 'Prova completa, na ordem original, com todas as matérias. Gabarito oficial.',
    itens: p.questoes.map((q) => ({ id: q.id, p: p.id, a: q.area, m: materiaDaArea(q.area) })),
    segPorQuestao: tempoPorQuestao(p),
  };
}

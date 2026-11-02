import type { MateriaCarregada } from '../dados/conteudo';
import { edicoes, nomeEdicao, provaPorId, type Edicao } from '../dados/provas';
import type { ItemSimulado } from '../estado/tipos';

export interface PlanoSimulado {
  sid: string;
  titulo: string;
  descricao: string;
  itens: ItemSimulado[];
  segPorQuestao: number;
}

/** Tempo por questão: o da prova oficial quando o catálogo traz duração e número de questões; senão 3 min. */
export function tempoPorQuestao(catalogoId: string | null): number {
  const p = catalogoId ? provaPorId(catalogoId) : undefined;
  const h = p?.formato?.duracao_horas, n = p?.formato?.questoes_objetivas;
  if (h && n) return Math.round((h * 3600) / n);
  return 180;
}

export function planoDaEdicao(e: Edicao): PlanoSimulado {
  return {
    sid: 'prova:' + e.chave,
    titulo: nomeEdicao(e),
    descricao: 'Prova completa, com todas as matérias, na ordem original. Gabarito oficial.',
    itens: e.itens.map((x) => ({ m: x.m, id: x.q.id })),
    segPorQuestao: tempoPorQuestao(e.catalogoId),
  };
}

export function planoPorChave(chave: string, todas: MateriaCarregada[]): PlanoSimulado | null {
  // só prova inteira vira simulado
  const e = edicoes(todas).find((x) => x.chave === chave && x.completa);
  return e ? planoDaEdicao(e) : null;
}

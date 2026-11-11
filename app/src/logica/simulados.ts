import { materiaDaArea, type ProvaCompleta } from '../dados/provasCompletas';
import { materiaAtual, type MateriaId, type Questao } from '../dados/tipos';
import { nomeMateria } from '../dados/materias';
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
    itens: p.questoes.map((q) => ({ id: q.id, p: p.id, a: q.area, m: materiaAtual(q.materia) || materiaDaArea(q.area) })),
    segPorQuestao: tempoPorQuestao(p),
  };
}

/** Quantidades oferecidas no simulado por conteúdo. */
export const QTDS_CONTEUDO = [10, 20, 30, 45] as const;

/**
 * Simulado por conteúdo (pedido do dono, 11/11/2026): só questões reais de prova dos conteúdos escolhidos, de uma
 * matéria. Divide a quantidade entre os conteúdos (rodízio), sorteia dentro de cada um, prefere as que o aluno ainda
 * não respondeu e põe em ordem do nível mais fácil ao mais difícil. Questões fora do ar (pendente) não entram.
 */
export function planoDoConteudo(m: MateriaId, banco: Questao[], subs: string[], n: number, nomes: Record<string, string>,
  opc: { respondidas?: Set<string>; rnd?: () => number } = {}): PlanoSimulado {
  const rnd = opc.rnd || Math.random;
  const feitas = opc.respondidas || new Set<string>();
  const embaralha = <T,>(l: T[]) => { const a = [...l]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const ordem = [...new Set(subs)].sort();
  const filas = ordem.map((s) => {
    const l = banco.filter((q) => q.sub === s && !q.pendente);
    // novas primeiro, cada grupo embaralhado
    return [...embaralha(l.filter((q) => !feitas.has(q.id))), ...embaralha(l.filter((q) => feitas.has(q.id)))];
  });
  const escolhidas: Questao[] = [];
  for (let k = 0; escolhidas.length < n && filas.some((f) => k < f.length); k++) {
    for (const f of filas) if (k < f.length && escolhidas.length < n) escolhidas.push(f[k]);
  }
  escolhidas.sort((a, b) => a.dif - b.dif);
  const nome = (s: string) => nomes[s] || s;
  return {
    sid: `conteudo:${m}:${ordem.join(',')}`,
    titulo: ordem.length === 1 ? `Simulado de ${nome(ordem[0])}` : `Simulado de ${nomeMateria(m)}: ${ordem.length} conteúdos`,
    descricao: `Questões reais de prova ${ordem.length === 1 ? 'deste conteúdo' : 'dos conteúdos escolhidos'}, da mais fácil à mais difícil. Gabarito oficial.`,
    // a = nome do conteúdo: o resultado separa os acertos por conteúdo
    itens: escolhidas.map((q) => ({ m, id: q.id, a: nome(q.sub) })),
    segPorQuestao: 180,
  };
}

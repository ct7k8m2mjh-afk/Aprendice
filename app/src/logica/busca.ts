/**
 * Busca do topo (revisão de 19/11/2026, casca 27 e 28): singular e plural casam ("função" acha "Funções afim e
 * quadrática") e a ordem é por relevância, com os conteúdos e temas antes dos flashcards.
 */
import { norm } from './correcao';

/** Raiz simples do português para casar singular e plural: funções → funcao, células → celula, animais → animal. */
export function raiz(palavra: string): string {
  const w = norm(palavra);
  if (w.length <= 3) return w;
  if (/(oes|aes)$/.test(w)) return w.slice(0, -3) + 'ao';
  if (/ais$/.test(w)) return w.slice(0, -3) + 'al';
  if (/eis$/.test(w)) return w.slice(0, -3) + 'el';
  if (/[rz]es$/.test(w)) return w.slice(0, -2);
  if (/s$/.test(w) && !/ss$/.test(w)) return w.slice(0, -1);
  return w;
}

const raizes = (t: string) => norm(t).split(' ').filter(Boolean).map(raiz);

/** Ordem fixa dos tipos quando a relevância empata; os flashcards vêm sempre depois de matérias, temas e conteúdos. */
const PESO: Record<string, number> = { 'Matérias': 0, 'Temas': 1, 'Conteúdos': 2, 'Simulados': 3, 'Provas e faculdades': 4, 'Cartões': 5 };

export interface ItemBusca { grupo: string; titulo: string; det: string }

/** Nota de um item para a busca (null: não casa). Menor é melhor. */
export function notaBusca(x: ItemBusca, consulta: string): number | null {
  const q = raizes(consulta);
  if (!q.length) return null;
  const tit = raizes(x.titulo), det = raizes(x.det);
  const casa = (l: string[], p: string) => l.some((w) => w.startsWith(p));
  if (!q.every((p) => casa(tit, p) || casa(det, p))) return null;
  const s = tit[0]?.startsWith(q[0]) ? 0 : q.every((p) => casa(tit, p)) ? 1 : 2;
  const cartao = x.grupo === 'Cartões' ? 1 : 0;
  return cartao * 100 + s * 10 + (PESO[x.grupo] ?? 6);
}

/** Resultados em ordem: cada grupo uma vez, na ordem do seu melhor resultado. */
export function ordenaBusca<T extends ItemBusca>(itens: T[], consulta: string, max = 40): T[] {
  const ok = itens.map((x) => ({ x, n: notaBusca(x, consulta) })).filter((y): y is { x: T; n: number } => y.n !== null)
    .sort((a, b) => a.n - b.n).slice(0, max).map((y) => y.x);
  const grupos = new Map<string, T[]>();
  for (const x of ok) { const g = grupos.get(x.grupo); if (g) g.push(x); else grupos.set(x.grupo, [x]); }
  return [...grupos.values()].flat();
}

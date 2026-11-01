import type { MateriaCarregada } from '../dados/conteudo';
import { edicoes, idDaEscola, nomeEdicao, provaPorId, type Edicao } from '../dados/provas';
import type { MateriaId } from '../dados/tipos';
import type { Estado, ItemSimulado } from '../estado/tipos';
import { feitaHoje } from './revisao';

export interface PlanoSimulado {
  sid: string;
  titulo: string;
  descricao: string;
  itens: ItemSimulado[];
  segPorQuestao: number;
  parcial?: { temos: number; materias: MateriaId[]; oficiais: number | null };
}

function embaralha<T>(l: T[]): T[] { const a = [...l]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

/** Tempo por questão: o da prova oficial quando o catálogo traz duração e número de questões; senão 3 min. */
export function tempoPorQuestao(catalogoId: string | null): number {
  const p = catalogoId ? provaPorId(catalogoId) : undefined;
  const h = p?.formato?.duracao_horas, n = p?.formato?.questoes_objetivas;
  if (h && n) return Math.round((h * 3600) / n);
  return 180;
}

export function planoDaEdicao(e: Edicao): PlanoSimulado {
  const p = e.catalogoId ? provaPorId(e.catalogoId) : undefined;
  const oficiais = p?.formato?.questoes_objetivas ?? null;
  const materias = Object.keys(e.porMateria) as MateriaId[];
  return {
    sid: 'prova:' + e.chave,
    titulo: nomeEdicao(e),
    descricao: `${e.itens.length} questões desta prova, na ordem original`,
    itens: e.itens.map((x) => ({ m: x.m, id: x.q.id })),
    segPorQuestao: tempoPorQuestao(e.catalogoId),
    parcial: { temos: e.itens.length, materias, oficiais },
  };
}

export const OBJETIVOS = [
  { id: 'rapido', titulo: 'Rápido de 10', descricao: 'Dez questões reais misturadas das quatro matérias, para quando o tempo é curto.', n: 10 },
  { id: 'dificeis', titulo: 'Só as difíceis', descricao: 'Vinte questões de dificuldade alta (7 a 10), para treinar o fim da escada.', n: 20 },
  { id: 'erros', titulo: 'Refazer meus erros', descricao: 'Questões que você errou ou chutou, sem a resolução até o fim.', n: 20 },
  { id: 'alvo', titulo: 'Minhas provas-alvo', descricao: 'Trinta questões só das provas que você escolheu no perfil.', n: 30 },
  { id: 'bio', titulo: 'Biologia', descricao: 'Vinte questões de Biologia de provas variadas.', n: 20 },
  { id: 'qui', titulo: 'Química', descricao: 'Vinte questões de Química de provas variadas.', n: 20 },
  { id: 'mat', titulo: 'Matemática', descricao: 'Vinte questões de Matemática de provas variadas.', n: 20 },
  { id: 'por', titulo: 'Português', descricao: 'Vinte questões de Português de provas variadas.', n: 20 },
] as const;

export function planoDoObjetivo(obj: string, todas: MateriaCarregada[], e: Estado): PlanoSimulado | null {
  const o = OBJETIVOS.find((x) => x.id === obj);
  if (!o) return null;
  const alvo = new Set(e.perfil?.provasAlvo || []);
  let pool: ItemSimulado[] = [];
  for (const mc of todas) {
    const s = e.materias[mc.id];
    for (const q of mc.banco) {
      const eq = s?.q[q.id];
      if (obj === 'erros') { if (eq?.tent.some((t) => !t.ok || t.conf === 'chute')) pool.push({ m: mc.id, id: q.id }); continue; }
      if (feitaHoje(eq)) continue;
      if (obj === 'dificeis' && q.dif < 7) continue;
      if (obj === 'alvo' && !alvo.has(idDaEscola(q.escola) || '')) continue;
      if (['bio', 'qui', 'mat', 'por'].includes(obj) && mc.id !== obj) continue;
      if (q.origem !== 'prova' && obj !== 'erros') continue;
      pool.push({ m: mc.id, id: q.id });
    }
  }
  pool = embaralha(pool).slice(0, o.n);
  return { sid: 'obj:' + obj, titulo: o.titulo, descricao: o.descricao, itens: pool, segPorQuestao: 180 };
}

export function planoPorChave(chave: string, todas: MateriaCarregada[]): PlanoSimulado | null {
  const e = edicoes(todas).find((x) => x.chave === chave);
  return e ? planoDaEdicao(e) : null;
}

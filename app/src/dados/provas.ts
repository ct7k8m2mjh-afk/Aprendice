/**
 * Provas: o catálogo nacional (pesquisa com fonte, app/conteudo-fonte/catalogo-vestibulares.json)
 * cruzado com as questões que já existem no banco.
 */
import catalogoBruto from '../../conteudo-fonte/catalogo-vestibulares.json';
import type { MateriaId, Questao } from './tipos';
import type { MateriaCarregada } from './conteudo';

export interface ProvaCatalogo {
  id: string;
  instituicao: string;
  sigla: string | null;
  prova: string;
  banca: string | null;
  uf: string | null;
  cidade: string | null;
  regiao: string;
  rede: 'publica' | 'privada' | null;
  ingresso: string[];
  formato: {
    fases?: number | null; questoes_objetivas?: number | null; discursivas?: string | number | null;
    duracao_horas?: number | null; dias?: number | null; materias?: string[] | null; observacao?: string | null;
  } | null;
  site: string | null;
  provas_anteriores: string | null;
  fontes: string[];
  verificado: boolean;
  a_verificar: string[];
}

export const CATALOGO: ProvaCatalogo[] = (catalogoBruto as { provas: ProvaCatalogo[] }).provas;
export const REGIOES = ['Nacional', 'Sudeste', 'Sul', 'Nordeste', 'Norte', 'Centro-Oeste'];

/** Nome da escola no banco -> id do catálogo. */
const ESCOLA_PARA_ID: Record<string, string> = {
  'Fuvest': 'fuvest', 'Unesp': 'unesp', 'Santa Casa (FCMSCSP)': 'santacasa', 'Albert Einstein': 'einstein',
  'São Camilo': 'saocamilo', 'Famema': 'famema', 'FMJ (Jundiaí)': 'fmj', 'ENEM': 'enem', 'Enem': 'enem',
};

export function idDaEscola(escola: string): string | null { return ESCOLA_PARA_ID[escola] || null; }

export function provaPorId(id: string): ProvaCatalogo | undefined { return CATALOGO.find((p) => p.id === id); }

/** Escolas que são listas públicas de exercícios (não são provas). */
export const LISTAS = new Set(['Brasil Escola', 'Mundo Educação']);

/** Uma edição de prova presente no banco (instituição + ano + fase), com as questões de todas as matérias. */
export interface Edicao {
  chave: string;
  escola: string;
  catalogoId: string | null;
  ano: string;
  fase: string;
  itens: { m: MateriaId; q: Questao }[];
  porMateria: Partial<Record<MateriaId, number>>;
  /** número de questões objetivas da prova oficial (catálogo), quando conhecido */
  oficiais: number | null;
  /** prova inteira no banco: todas as questões oficiais, de todas as matérias (só essas viram simulado) */
  completa: boolean;
}

export function edicoes(materias: MateriaCarregada[]): Edicao[] {
  const mapa = new Map<string, Edicao>();
  for (const mc of materias) {
    for (const q of mc.banco) {
      if (q.origem !== 'prova' || LISTAS.has(q.escola)) continue;
      const fase = q.fase || '';
      const chave = [q.escola, q.ano, fase].join('|');
      let e = mapa.get(chave);
      if (!e) { e = { chave, escola: q.escola, catalogoId: idDaEscola(q.escola), ano: q.ano, fase, itens: [], porMateria: {}, oficiais: null, completa: false }; mapa.set(chave, e); }
      e.itens.push({ m: mc.id, q });
      e.porMateria[mc.id] = (e.porMateria[mc.id] || 0) + 1;
    }
  }
  for (const e of mapa.values()) {
    e.itens.sort((a, b) => (parseInt(a.q.n, 10) || 999) - (parseInt(b.q.n, 10) || 999));
    e.oficiais = (e.catalogoId && provaPorId(e.catalogoId)?.formato?.questoes_objetivas) || null;
    e.completa = !!e.oficiais && new Set(e.itens.map((x) => x.q.n)).size >= e.oficiais;
  }
  return [...mapa.values()].sort((a, b) => b.ano.localeCompare(a.ano) || b.itens.length - a.itens.length);
}

export function nomeEdicao(e: Pick<Edicao, 'escola' | 'ano' | 'fase'>): string {
  return [e.escola, e.ano, e.fase].filter(Boolean).join(' · ');
}

/**
 * Provas completas já baixadas da fonte oficial (caderno + gabarito), em recorte e conferência.
 * Viram simulado quando todas as questões entram no banco. Fonte: fabrica_saida/ingestao/<prova>/manifesto.json.
 */
export const PROVAS_EM_PREPARO: { catalogoId: string; titulo: string; motivo: string }[] = [
  { catalogoId: 'unb', titulo: 'UnB PAS 3 2025', motivo: 'itens de certo ou errado (formato Cebraspe)' },
  { catalogoId: 'fuvest', titulo: 'Fuvest 2026, 2024 e 2023', motivo: 'caderno a baixar manualmente' },
];

/** Escolas do banco que são provas de Medicina com catálogo (podem ser provas-alvo com questões). */
export function escolasComQuestoes(materias: MateriaCarregada[]): Map<string, number> {
  const n = new Map<string, number>();
  for (const mc of materias) for (const q of mc.banco) {
    const id = idDaEscola(q.escola);
    if (id) n.set(id, (n.get(id) || 0) + 1);
  }
  return n;
}

/** Traduz os nomes de campo da pesquisa ("formato.materias") para português de gente. */
export function campoLegivel(t: string): string {
  return t
    .replace(/formato\.materias/g, 'matérias da prova')
    .replace(/formato\.questoes_objetivas/g, 'número de questões objetivas')
    .replace(/formato\.discursivas/g, 'questões discursivas')
    .replace(/formato\.duracao_horas/g, 'duração')
    .replace(/formato\.dias/g, 'dias de prova')
    .replace(/formato\.fases/g, 'número de fases')
    .replace(/formato/g, 'formato da prova')
    .replace(/provas_anteriores/g, 'página de provas anteriores')
    .replace(/duracao/g, 'duração')
    .replace(/\bbanca\b/g, 'banca')
    .replace(/\bcidade\b/g, 'cidade')
    .replace(/\brede\b/g, 'rede (pública ou privada)')
    .replace(/_/g, ' ');
}

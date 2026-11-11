/**
 * REVISÃO GERAL da matéria inteira (comando 37 do dono): os tópicos de docs/revisao/<m>/geral.json, levados ao site
 * por scripts/revisao.py (public/conteudo/<m>/revisao/geral.json). Regras puras aqui (testadas em revisaoGeral.test.ts):
 * - busca instantânea sobre título, subtemas (id e nome) e busca[], sem diferenciar acento e maiúscula, termo parcial;
 * - Filosofia e Sociologia (arquivo fs) em duas telas, pelo prefixo do id: FK = Filosofia, SK = Sociologia;
 * - agrupamento por capítulo, na ordem do arquivo;
 * - progresso do aluno por tópico (lido, marcado para rever), no estado salvo (EstadoMateria.geral, estado v8).
 * Os ids não mudam: são a chave do progresso (princípio 7).
 */
import type { MateriaId } from '../dados/tipos';

export interface ImagemTopico {
  descricao: string;
  /** Matemática e Inglês não trazem o campo no arquivo: o conversor grava true (imagem ainda não feita) */
  falta_imagem?: boolean;
  /** caminho da imagem do dono já em WebP (revisao/geral/<id>.webp), quando existe docs/imagens/<m>/<id>.png */
  img?: string;
}

export interface TopicoGeral {
  id: string;
  capitulo: string;
  titulo: string;
  subs: string[];
  busca: string[];
  pontos: string[];
  pegadinha: string;
  imagem: ImagemTopico;
}

export interface RevisaoGeral { materia: MateriaId; topicos: TopicoGeral[] }

/* ============================================================ Filosofia × Sociologia */

export type ParteGeral = 'filosofia' | 'sociologia';
export const PARTES_FS: Record<ParteGeral, { prefixo: string; nome: string }> = {
  filosofia: { prefixo: 'FK', nome: 'Filosofia' },
  sociologia: { prefixo: 'SK', nome: 'Sociologia' },
};
export function ehParte(x: unknown): x is ParteGeral { return x === 'filosofia' || x === 'sociologia'; }

/** As telas da revisão geral de uma matéria: uma só, ou duas em Filosofia e Sociologia. */
export function partesDe(m: MateriaId): (ParteGeral | null)[] { return m === 'fs' ? ['filosofia', 'sociologia'] : [null]; }

/** Tópicos de uma tela: em fs, só os do prefixo da parte (FK ou SK); nas outras matérias, todos. */
export function topicosDaParte(topicos: TopicoGeral[], m: MateriaId, parte?: ParteGeral | null): TopicoGeral[] {
  if (m !== 'fs') return topicos;
  const pre = PARTES_FS[parte || 'filosofia'].prefixo;
  return topicos.filter((t) => t.id.startsWith(pre));
}

/** Parte de um tópico de fs pelo id (para abrir a tela certa a partir de um link). */
export function parteDoTopico(id: string): ParteGeral | null {
  if (id.startsWith('FK')) return 'filosofia';
  if (id.startsWith('SK')) return 'sociologia';
  return null;
}

/* ============================================================ capítulos */

export interface Capitulo { capitulo: string; topicos: TopicoGeral[] }

/** Capítulos na ordem em que aparecem no arquivo (um capítulo que reaparece adiante junta-se ao primeiro). */
export function agrupaPorCapitulo(topicos: TopicoGeral[]): Capitulo[] {
  const out: Capitulo[] = [];
  const idx = new Map<string, Capitulo>();
  for (const t of topicos) {
    const k = t.capitulo || '';
    let c = idx.get(k);
    if (!c) { c = { capitulo: k, topicos: [] }; idx.set(k, c); out.push(c); }
    c.topicos.push(t);
  }
  return out;
}

/* ============================================================ busca */

/** "Báskara", "BASKARA" e "baskara" ficam iguais: sem acento, minúsculas, pontuação vira espaço. */
export function normaliza(s: string): string {
  return s.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
}

export interface Achado { t: TopicoGeral; peso: number }

/**
 * Busca instantânea: cada palavra digitada precisa aparecer (pedaço de palavra vale) no título, nos subtemas (id e
 * nome) ou nos termos de busca[] do tópico. Ordem: título que contém a frase inteira, título que contém as palavras,
 * termo de busca que contém a frase, o resto; empate fica na ordem do arquivo. Consulta vazia: nenhum achado.
 * Os termos de busca[] nunca são mostrados ao aluno (há grafias erradas de propósito).
 */
export function buscaTopicos(topicos: TopicoGeral[], consulta: string, nomeSub?: (id: string) => string | undefined): Achado[] {
  const q = normaliza(consulta);
  if (!q) return [];
  const palavras = q.split(' ');
  const out: (Achado & { k: number })[] = [];
  topicos.forEach((t, k) => {
    const tit = normaliza(t.titulo);
    const termos = t.busca.map(normaliza);
    const subs = t.subs.flatMap((s) => [normaliza(s), normaliza(nomeSub?.(s) || '')]);
    const tudo = [tit, ...termos, ...subs].join(' | ');
    if (!palavras.every((p) => tudo.includes(p))) return;
    const peso = tit.includes(q) ? 4 : palavras.every((p) => tit.includes(p)) ? 3 : termos.some((x) => x.includes(q)) ? 2 : 1;
    out.push({ t, peso, k });
  });
  return out.sort((a, b) => b.peso - a.peso || a.k - b.k).map(({ t, peso }) => ({ t, peso }));
}

/**
 * Pedaços de um texto com as palavras da consulta marcadas (sem diferenciar acento e maiúscula), para destacar no
 * título do tópico achado. Mantém o texto original (com acento) em cada pedaço.
 */
export function marcaTrechos(texto: string, consulta: string): { t: string; marca: boolean }[] {
  const palavras = normaliza(consulta).split(' ').filter(Boolean);
  if (!palavras.length) return [{ t: texto, marca: false }];
  // texto normalizado letra a letra, guardando de qual posição do original veio cada letra
  let norm = '';
  const origem: number[] = [];
  for (let i = 0; i < texto.length; i++) {
    const c = texto[i].normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();
    for (const x of c) { norm += x; origem.push(i); }
  }
  const marca = new Array<boolean>(texto.length).fill(false);
  for (const p of palavras) {
    let de = 0;
    for (;;) {
      const j = norm.indexOf(p, de);
      if (j < 0) break;
      for (let k = j; k < j + p.length; k++) marca[origem[k]] = true;
      de = j + p.length;
    }
  }
  const out: { t: string; marca: boolean }[] = [];
  for (let i = 0; i < texto.length; i++) {
    const ult = out[out.length - 1];
    if (ult && ult.marca === marca[i]) ult.t += texto[i];
    else out.push({ t: texto[i], marca: marca[i] });
  }
  return out;
}

/* ============================================================ progresso do aluno */

/** Progresso de um tópico: lido (momento em que o aluno marcou; ausente = não lido), marcado para rever, e o momento
 *  da última mudança (na mesclagem de dois aparelhos ou arquivos, fica a decisão mais recente). */
export interface ProgressoTopico { lido?: number; marc?: boolean; ts: number }
export type ProgressoGeral = Record<string, ProgressoTopico>;

function entrada(x: unknown): ProgressoTopico | null {
  if (!x || typeof x !== 'object' || Array.isArray(x)) return null;
  const o = x as Record<string, unknown>;
  const lido = typeof o.lido === 'number' && o.lido > 0 ? o.lido : undefined;
  const marc = o.marc === true ? true : undefined;
  const ts = typeof o.ts === 'number' && o.ts > 0 ? o.ts : Math.max(lido || 0, 0);
  if (!lido && !marc && !ts) return null;
  return { ...(lido ? { lido } : {}), ...(marc ? { marc } : {}), ts };
}

/** Leva qualquer valor salvo ao formato atual sem derrubar o resto (entrada estranha sai; as boas ficam). */
export function normalizaGeral(x: unknown): ProgressoGeral {
  if (!x || typeof x !== 'object' || Array.isArray(x)) return {};
  const out: ProgressoGeral = {};
  for (const [id, v] of Object.entries(x as Record<string, unknown>)) {
    const e = entrada(v);
    if (e && id) out[id] = e;
  }
  return out;
}

/** Une dois progressos (dois aparelhos, arquivo importado): por tópico, fica a mudança mais recente; nada some. */
export function mesclaGeral(a: unknown, b: unknown): ProgressoGeral {
  const x = normalizaGeral(a), y = normalizaGeral(b);
  const out: ProgressoGeral = { ...x };
  for (const [id, v] of Object.entries(y)) if (!out[id] || v.ts > out[id].ts) out[id] = v;
  return out;
}

export function alternaLido(g: ProgressoGeral | undefined, id: string, agora = Date.now()): ProgressoGeral {
  const v = (g || {})[id];
  const lido = v?.lido ? undefined : agora;
  return { ...(g || {}), [id]: { ...(lido ? { lido } : {}), ...(v?.marc ? { marc: true } : {}), ts: agora } };
}

export function alternaMarcado(g: ProgressoGeral | undefined, id: string, agora = Date.now()): ProgressoGeral {
  const v = (g || {})[id];
  return { ...(g || {}), [id]: { ...(v?.lido ? { lido: v.lido } : {}), ...(v?.marc ? {} : { marc: true }), ts: agora } };
}

export function contaProgresso(topicos: TopicoGeral[], g: ProgressoGeral | undefined): { lidos: number; marcados: number } {
  let lidos = 0, marcados = 0;
  for (const t of topicos) { const v = g?.[t.id]; if (v?.lido) lidos++; if (v?.marc) marcados++; }
  return { lidos, marcados };
}

/** Texto da caixa de imagem enquanto a imagem do dono não chega (ou se ela falhar ao carregar). */
export function avisoImagem(im: ImagemTopico): string {
  return 'EM CONSTRUÇÃO — ' + (im.descricao || 'imagem em preparação');
}

/** Caminho da imagem a mostrar, ou null para mostrar o aviso: sem imagem do dono, ou se ela falhou ao carregar. */
export function escolheImagem(im: ImagemTopico, falhou = false): string | null {
  return im.img && !falhou ? im.img : null;
}

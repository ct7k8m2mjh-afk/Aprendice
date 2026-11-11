/**
 * Carregamento do conteúdo (somente leitura, embarcado no app — funciona sem internet).
 * App completo: arquivos em public/conteudo/<m>/ lidos sob demanda.
 * Prévia de arquivo único (VITE_PREVIA): amostra embutida no próprio HTML.
 */
import { useEffect, useState } from 'react';
import type { Figura, MateriaConteudo, MateriaId, Questao, Resolucao, TextoQuestao } from './tipos';
import { ordemEvolucao } from '../logica/nivel';
import { retiradasDe } from '../estado/migracao';

const PREVIA = import.meta.env.VITE_PREVIA === '1';
const BASE = import.meta.env.BASE_URL + 'conteudo/';

export const MATERIAS_COM_CONTEUDO: MateriaId[] = ['bio', 'qui', 'mat', 'por', 'fis', 'geo', 'his', 'fs', 'ing'];

interface PacotePrevia {
  materias: Record<string, {
    banco: Questao[]; materia: MateriaConteudo; res: Record<string, Record<string, Resolucao>>;
    prints: Record<string, string>; icones: Record<string, string>; figuras: Record<string, Figura[]>; amostra: string[];
  }>;
}
let previa: PacotePrevia | null = null;
async function pacote(): Promise<PacotePrevia> {
  if (!previa) {
    // glob: o arquivo só existe quando a prévia é gerada (npm run previa); no app completo fica vazio
    const mods = import.meta.glob('../previa/dados.json');
    const carrega = Object.values(mods)[0];
    previa = carrega ? ((await carrega()) as { default: PacotePrevia }).default : { materias: {} };
  }
  return previa;
}

export interface MateriaCarregada {
  id: MateriaId;
  banco: Questao[];
  porId: Map<string, Questao>;
  conteudo: MateriaConteudo;
  /** questões por conteúdo (sub), do mais fácil ao mais difícil (ordem do "Treine sua evolução") */
  porSub: Map<string, Questao[]>;
  amostra?: string[];
  /** questões de site retiradas sem questão de prova equivalente (comando 21): nunca aparecem; o histórico do aluno
   *  nelas continua contando no desempenho e na revisão do conteúdo (logica/estatisticas.ts) */
  retiradas?: Questao[];
}

/** Marcador de uma questão retirada: só conteúdo, tema e dificuldade (o texto e o print não existem no site). */
function marcadorRetirada(id: string, sub: string, dif: number): Questao {
  return { id, escola: '', ano: '', n: '', banca: '', fase: '', enun: '', alts: {}, gab: 'A', modulo: sub.split('.')[0], sub, dif,
    degrau: 0, conceito: '', pista: '', url: '', origem: 'site', figura: false, retirada: true };
}

const cache = new Map<MateriaId, Promise<MateriaCarregada>>();
/** Print das questões que vieram das provas completas (id -> caminho dentro de conteudo/). */
const PRINTS_PROVA = new Map<string, string>();

function monta(id: MateriaId, bancoTodo: Questao[], conteudo: MateriaConteudo, amostra?: string[]): MateriaCarregada {
  const banco = bancoTodo.filter((q) => !q.pendente);
  const porSub = new Map<string, Questao[]>();
  for (const q of banco) {
    const l = porSub.get(q.sub) || [];
    l.push(q);
    porSub.set(q.sub, l);
  }
  for (const l of porSub.values()) l.sort(ordemEvolucao);
  for (const q of banco) if (q.print) PRINTS_PROVA.set(q.id, q.print);
  const retiradas = retiradasDe(id).filter((r) => !r.para).map((r) => marcadorRetirada(r.id, r.sub, r.dif));
  return { id, banco, porId: new Map(banco.map((q) => [q.id, q])), conteudo, porSub, amostra, retiradas };
}

export function carregaMateria(id: MateriaId): Promise<MateriaCarregada> {
  let p = cache.get(id);
  if (!p) {
    p = (async () => {
      if (PREVIA) {
        const pk = (await pacote()).materias[id];
        return monta(id, pk.banco, pk.materia, pk.amostra);
      }
      const [banco, conteudo] = await Promise.all([
        fetch(BASE + id + '/banco.json').then((r) => r.json()),
        fetch(BASE + id + '/materia.json').then((r) => r.json()),
      ]);
      return monta(id, banco, conteudo);
    })();
    cache.set(id, p);
    p.catch(() => cache.delete(id));
  }
  return p;
}

const cacheRes = new Map<string, Promise<Record<string, Resolucao>>>();
export function carregaResolucoes(m: MateriaId, sub: string): Promise<Record<string, Resolucao>> {
  const k = m + '/' + sub;
  let p = cacheRes.get(k);
  if (!p) {
    p = PREVIA
      ? pacote().then((pk) => pk.materias[m].res[sub] || {})
      : fetch(BASE + m + '/res/' + sub + '.json').then((r) => (r.ok ? r.json() : {}));
    cacheRes.set(k, p);
    p.catch(() => cacheRes.delete(k));
  }
  return p;
}

const cacheTxt = new Map<string, Promise<Record<string, TextoQuestao>>>();
const txtPronto = new Map<string, Record<string, TextoQuestao>>();
function carregaTextos(m: MateriaId, sub: string): Promise<Record<string, TextoQuestao>> {
  const k = m + '/' + sub;
  let p = cacheTxt.get(k);
  if (!p) {
    p = fetch(BASE + m + '/txt/' + sub + '.json').then((r) => (r.ok ? r.json() : {})).catch(() => ({}))
      .then((x: Record<string, TextoQuestao>) => { txtPronto.set(k, x); return x; });
    cacheTxt.set(k, p);
  }
  return p;
}

function comTexto(q: Questao, t: TextoQuestao | undefined): Questao {
  if (!t) return q;
  const tr = t.transcricao;
  return { ...q, enun: t.enun, transcricao: tr, alts: tr ? { ...q.alts, ...tr.alts } : q.alts };
}

/** A questão com o texto e a transcrição (questões das provas guardam o texto à parte, em txt/<conteúdo>.json).
 *  Enquanto o texto carrega devolve null, para a questão só de texto não aparecer primeiro como print. */
export function useQuestaoComTexto(m: MateriaId, q: Questao | undefined): Questao | null | undefined {
  const precisa = !!q?.txt && !PREVIA;
  const k = q ? m + '/' + q.sub : '';
  const [, setPronto] = useState('');
  useEffect(() => {
    let vivo = true;
    if (precisa && !txtPronto.has(k)) carregaTextos(m, k.slice(m.length + 1)).then(() => vivo && setPronto(k));
    return () => { vivo = false; };
  }, [m, k, precisa]);
  if (!q || !precisa) return q;
  const mapa = txtPronto.get(k);
  return mapa ? comTexto(q, mapa[q.id]) : null;
}

const cacheFig = new Map<MateriaId, Promise<Record<string, Figura[]>>>();
export function carregaFiguras(m: MateriaId): Promise<Record<string, Figura[]>> {
  let p = cacheFig.get(m);
  if (!p) {
    p = PREVIA ? pacote().then((pk) => pk.materias[m].figuras || {}) : fetch(BASE + m + '/figuras.json').then((r) => (r.ok ? r.json() : {}));
    cacheFig.set(m, p);
  }
  return p;
}

/** Endereço do print da questão original (null quando a prévia não traz o print). */
export function urlPrint(m: MateriaId, id: string): string | null {
  if (PREVIA) return previa?.materias[m]?.prints[id] || null;
  const p = PRINTS_PROVA.get(id);
  return BASE + (p || m + '/prints/' + id + '.webp');
}

export function urlIcone(m: MateriaId, chave: string): string | null {
  if (PREVIA) {
    const b = previa?.materias[m]?.icones[chave];
    return b ? 'data:image/webp;base64,' + b : null;
  }
  return BASE + m + '/ic/' + chave + '.webp';
}

export function urlFlashImg(m: MateriaId, arquivo: string): string {
  return BASE + m + '/flash_img/' + arquivo;
}

export function urlLogo(arquivo: string): string { return BASE + 'logos/' + arquivo; }

/* Capas e arte da matéria (comando 32): geradas por scripts/capas.py a partir de docs/capas/ (fora da prévia de arquivo único). */
export function urlCapa(m: MateriaId): string | null { return PREVIA ? null : BASE + 'capas/' + m + '.webp'; }
export function urlArteMateria(m: MateriaId): string | null { return PREVIA ? null : BASE + 'capas/ic-' + m + '.webp'; }
export function urlArteTreinoGeral(): string | null { return PREVIA ? null : BASE + 'capas/treino-geral.webp'; }
/** Arte do cartão "Treino geral de <matéria>" (dono, 10/11/2026): uma por matéria e por tema (claro/escuro). */
export function urlArteTreinoMateria(m: MateriaId, tema: 'claro' | 'escuro'): string | null { return PREVIA ? null : BASE + 'capas/tg-' + m + '-' + tema + '.webp'; }

export const EH_PREVIA = PREVIA;

/** Garante que o pacote da prévia está carregado antes do primeiro desenho (urlPrint/urlIcone são síncronos). */
export async function preparaConteudo(): Promise<void> { if (PREVIA) await pacote(); }

export function useMateria(id: MateriaId | null | undefined): MateriaCarregada | null {
  const [d, setD] = useState<MateriaCarregada | null>(null);
  useEffect(() => {
    let vivo = true;
    setD(null);
    if (id && MATERIAS_COM_CONTEUDO.includes(id)) carregaMateria(id).then((x) => vivo && setD(x));
    return () => { vivo = false; };
  }, [id]);
  return d;
}

export function useTodasMaterias(): MateriaCarregada[] | null {
  const [d, setD] = useState<MateriaCarregada[] | null>(null);
  useEffect(() => {
    let vivo = true;
    Promise.all(MATERIAS_COM_CONTEUDO.map(carregaMateria)).then((x) => vivo && setD(x));
    return () => { vivo = false; };
  }, []);
  return d;
}

export function useResolucoes(m: MateriaId, sub: string | undefined): Record<string, Resolucao> | null {
  const [d, setD] = useState<Record<string, Resolucao> | null>(null);
  useEffect(() => {
    let vivo = true;
    setD(null);
    // falha na leitura (rede, ou servidor que responde a página no lugar do arquivo): sem resolução, e o cache tenta de novo depois
    if (sub) carregaResolucoes(m, sub).then((x) => vivo && setD(x), () => vivo && setD({}));
    return () => { vivo = false; };
  }, [m, sub]);
  return d;
}

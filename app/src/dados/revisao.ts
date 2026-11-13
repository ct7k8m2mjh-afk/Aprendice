/**
 * Revisão em slides (comandos 24 e 26 do dono): o conteúdo de docs/revisao/<m>/<TEMA>.json, levado para
 * public/conteudo/<m>/revisao/ por scripts/revisao.py (chamado pelo converte.py). Formato: docs/revisao/FORMATO.md.
 * Um tema novo ou uma matéria nova entram sem mudar o código: só o JSON novo.
 */
import { useEffect, useState } from 'react';
import type { CartaoTeoria, MateriaId } from './tipos';
import type { RevisaoGeral } from '../logica/revisaoGeral';

const PREVIA = import.meta.env.VITE_PREVIA === '1';
const BASE = import.meta.env.BASE_URL + 'conteudo/';

export type TipoSlide = 'abertura' | 'conceito' | 'formula' | 'grafico' | 'exemplo' | 'pegadinha' | 'na_prova' | 'fixe';

export interface FotoSlide { url: string; arquivo: string; autor: string; licenca: string; por_que?: string; img?: string }

export interface VisualSlide {
  tipo: 'animacao' | 'esquema' | 'grafico' | 'foto';
  descricao?: string;
  movimento?: string[];
  foto?: FotoSlide;
  alt?: string;
}

export interface PassoSlide { faz: string; conta: string; mov?: string }

export interface Slide {
  tipo: TipoSlide;
  titulo: string;
  texto?: string;
  destaque?: string;
  formula?: string;
  legenda?: string[];
  passos?: PassoSlide[];
  visual?: VisualSlide;
  fonte?: string;
}

/** Revisão essencial (comando 33, docs/revisao/FORMATO-ESSENCIAL.md): termômetro → mapa → telas → questão → conexão. */
export interface TelaEssencial { sub: string; titulo: string; pontos: string[]; formula?: string; pegadinha?: string; visual?: VisualSlide }
export interface Essencial {
  termometro?: { sub: string; peso: 'alta' | 'media' | 'baixa'; provas?: string; como_cai?: string }[];
  mapa?: { centro: string; ramos: { sub: string; titulo: string; chave?: string; liga?: string[] }[] };
  telas: TelaEssencial[];
  questao_resolvida?: { enunciado: string; alternativas: string[]; gabarito: string; passos?: PassoSlide[]; por_que_erram?: string };
  conexao?: { materia: string; frase: string }[];
}

export interface TemaRevisao {
  essencial?: Essencial;
  id: string;
  nome: string;
  resumo?: string;
  formulas?: string[];
  erro?: string;
  cartoes?: CartaoTeoria[];
  slides: Record<string, Slide[]>;
  fontes?: { chave: string; paginas: string }[];
  pendencias?: string[];
  /** obra de onde vêm as fichas (as chaves "L1-F1-C02" são livro, frente e capítulo dela) */
  obra?: string;
}

/** Decisão do dono (09/11/2026): só Biologia, Química, Matemática e Física têm resolução e visual animados; as outras
 *  matérias ficam com texto (e imagem com crédito quando ajudar), como na correção da questão (ui/Resolucao.tsx). */
export const MATERIAS_ANIMADAS = new Set(['bio', 'qui', 'mat', 'fis']);

/** Resumo curto de um subtema (comando 35, docs/revisao/<m>/resumos.json): pontos, pegadinha e a imagem (ou a caixa
 *  tracejada com a descrição do que será ilustrado, até o dono enviar docs/imagens/<m>/<sub>.png). */
export interface ResumoSubtema { sub: string; titulo: string; pontos: string[]; pegadinha?: string; formula?: string; imagem?: { descricao?: string; img?: string } }

export interface IndiceRevisao { materia: MateriaId; obra?: string; temas: Record<string, { nome: string; subs: Record<string, number>; essencial?: number }>;
  /** conteúdos com resolução comentada publicada (res/<conteúdo>.json) */ res?: string[];
  /** há resumos por subtema (revisao/resumos.json) */ resumos?: boolean;
  /** revisão geral da matéria (comando 37, revisao/geral.json): número de tópicos, imagens do dono já convertidas e,
   *  em Filosofia e Sociologia, quantos tópicos em cada parte */
  geral?: { n: number; imagens?: number; partes?: Record<string, number> } }

const VAZIO: IndiceRevisao = { materia: 'fis', temas: {} };
const cacheIndice = new Map<MateriaId, Promise<IndiceRevisao>>();
const prontoIndice = new Map<MateriaId, IndiceRevisao>();
const cacheTema = new Map<string, Promise<TemaRevisao | null>>();

/** Índice das revisões da matéria (temas e conteúdos com slides). Matéria sem revisão: índice vazio. */
export function carregaIndiceRevisao(m: MateriaId): Promise<IndiceRevisao> {
  let p = cacheIndice.get(m);
  if (!p) {
    p = PREVIA
      ? Promise.resolve({ ...VAZIO, materia: m })
      : fetch(BASE + m + '/revisao/indice.json')
        .then((r) => (r.ok ? r.json() : { ...VAZIO, materia: m }))
        .catch(() => ({ ...VAZIO, materia: m }));
    p = p.then((x: IndiceRevisao) => { prontoIndice.set(m, x); return x; });
    cacheIndice.set(m, p);
  }
  return p;
}

export function carregaTemaRevisao(m: MateriaId, tema: string): Promise<TemaRevisao | null> {
  const k = m + '/' + tema;
  let p = cacheTema.get(k);
  if (!p) {
    p = PREVIA ? Promise.resolve(null) : fetch(BASE + m + '/revisao/' + tema + '.json').then((r) => (r.ok ? r.json() : null)).catch(() => null);
    cacheTema.set(k, p);
  }
  return p;
}

export function useIndiceRevisao(m: MateriaId | null | undefined): IndiceRevisao | null {
  const [x, setX] = useState<IndiceRevisao | null>(m ? prontoIndice.get(m) || null : null);
  useEffect(() => {
    if (!m) return;
    let vivo = true;
    carregaIndiceRevisao(m).then((i) => { if (vivo) setX(i); });
    return () => { vivo = false; };
  }, [m]);
  return x;
}

/** undefined = carregando; null = não existe */
export function useTemaRevisao(m: MateriaId, tema: string | undefined): TemaRevisao | null | undefined {
  const [x, setX] = useState<TemaRevisao | null | undefined>(undefined);
  useEffect(() => {
    setX(undefined);
    if (!tema) { setX(null); return; }
    let vivo = true;
    carregaTemaRevisao(m, tema).then((t) => { if (vivo) setX(t); });
    return () => { vivo = false; };
  }, [m, tema]);
  return x;
}

export function urlRevisao(m: MateriaId, caminho: string): string { return BASE + m + '/' + caminho; }

/** obras com prefixo na chave (Filosofia e Sociologia: "FIL-L1-F1-C01", "SOC-L1-F1-C03") */
const OBRA_PREFIXO: Record<string, string> = { FIL: 'PV Filosofia (Poliedro)', SOC: 'PV Sociologia (Poliedro)', ING: 'PV Língua Inglesa (Poliedro)', GEO: 'PV Geografia (Poliedro)', HIS: 'PV História (Poliedro)' };

const cacheResumos = new Map<MateriaId, Promise<Record<string, ResumoSubtema[]>>>();
/** Resumos da matéria, por subtema (só busca quando o índice diz que existem: nada de 404). */
export function carregaResumos(m: MateriaId): Promise<Record<string, ResumoSubtema[]>> {
  let p = cacheResumos.get(m);
  if (!p) {
    p = carregaIndiceRevisao(m).then((ind) => (ind.resumos && !PREVIA
      ? fetch(BASE + m + '/revisao/resumos.json').then((r) => (r.ok ? r.json() : {})).catch(() => ({}))
      : {}));
    cacheResumos.set(m, p);
  }
  return p;
}
export function useResumos(m: MateriaId | null | undefined): Record<string, ResumoSubtema[]> | null {
  const [x, setX] = useState<Record<string, ResumoSubtema[]> | null>(null);
  useEffect(() => {
    if (!m) return;
    let vivo = true;
    carregaResumos(m).then((r) => { if (vivo) setX(r); });
    return () => { vivo = false; };
  }, [m]);
  return x;
}

/** "L1-F1-C02 p. 24" → "PV Física (Poliedro), livro 1, frente 1, cap. 2, p. 24"; "FIL-L1-F1-C01 p. 11" → "PV Filosofia
 *  (Poliedro), livro 1, ..." (chaves desconhecidas ficam como estão). */
export function fonteLegivel(fonte: string, obra?: string): string {
  let usouPrefixo = false;
  const t = fonte.replace(/\b(?:(FIL|SOC|ING|GEO|HIS)-)?L(\d+)-F(\d+)-C(\d+)\b/g, (_, pre, l, f, c) => {
    const base = `livro ${+l}, frente ${+f}, cap. ${+c}`;
    if (pre && OBRA_PREFIXO[pre]) { usouPrefixo = true; return `${OBRA_PREFIXO[pre]}, ${base}`; }
    return base;
  }).replace(/(cap\. \d+) (p\.)/g, '$1, $2');
  return obra && !usouPrefixo ? `${obra}, ${t}` : t;
}

/** Tira do texto do roteiro o código de cor ("laranja #F27700" → "laranja"): o aluno vê a cor, não o código. */
export function limpaRoteiro(t: string): string {
  return t.replace(/\s*\(?#[0-9A-Fa-f]{6}\)?/g, '').replace(/^\d+\.\s*/, '').replace(/\s+([,.;:])/g, '$1').trim();
}

const cacheGeral = new Map<MateriaId, Promise<RevisaoGeral | null>>();
/** Revisão geral da matéria (comando 37): só busca quando o índice diz que existe (nada de 404). */
export function carregaGeral(m: MateriaId): Promise<RevisaoGeral | null> {
  let p = cacheGeral.get(m);
  if (!p) {
    p = carregaIndiceRevisao(m).then((ind) => (ind.geral?.n && !PREVIA
      ? fetch(BASE + m + '/revisao/geral.json').then((r) => (r.ok ? r.json() : null)).catch(() => null)
      : null));
    cacheGeral.set(m, p);
  }
  return p;
}
/** undefined = carregando; null = a matéria ainda não tem revisão geral */
export function useGeral(m: MateriaId | null | undefined): RevisaoGeral | null | undefined {
  const [x, setX] = useState<RevisaoGeral | null | undefined>(undefined);
  useEffect(() => {
    setX(undefined);
    if (!m) { setX(null); return; }
    let vivo = true;
    carregaGeral(m).then((r) => { if (vivo) setX(r); });
    return () => { vivo = false; };
  }, [m]);
  return x;
}

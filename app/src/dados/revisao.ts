/**
 * Revisão em slides (comandos 24 e 26 do dono): o conteúdo de docs/revisao/<m>/<TEMA>.json, levado para
 * public/conteudo/<m>/revisao/ por scripts/revisao.py (chamado pelo converte.py). Formato: docs/revisao/FORMATO.md.
 * Um tema novo ou uma matéria nova entram sem mudar o código: só o JSON novo.
 */
import { useEffect, useState } from 'react';
import type { CartaoTeoria, MateriaId } from './tipos';

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

export interface TemaRevisao {
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

export interface IndiceRevisao { materia: MateriaId; obra?: string; temas: Record<string, { nome: string; subs: Record<string, number> }> }

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
const OBRA_PREFIXO: Record<string, string> = { FIL: 'PV Filosofia (Poliedro)', SOC: 'PV Sociologia (Poliedro)', ING: 'PV Língua Inglesa (Poliedro)' };

/** "L1-F1-C02 p. 24" → "PV Física (Poliedro), livro 1, frente 1, cap. 2, p. 24"; "FIL-L1-F1-C01 p. 11" → "PV Filosofia
 *  (Poliedro), livro 1, ..." (chaves desconhecidas ficam como estão). */
export function fonteLegivel(fonte: string, obra?: string): string {
  let usouPrefixo = false;
  const t = fonte.replace(/\b(?:(FIL|SOC|ING)-)?L(\d+)-F(\d+)-C(\d+)\b/g, (_, pre, l, f, c) => {
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

/**
 * Provas completas: o caderno oficial inteiro, recortado questão por questão (ferramentas/ingestao/recorta.py),
 * com o gabarito oficial. Cada prova vira um simulado (por instituição e ano).
 *
 * App completo: public/conteudo/provas/indice.json e provas/<id>/prova.json + q/<n>.webp.
 * Prévia publicada: provas/indice.json e provas/<id>.json (prints embutidos), servidos ao lado do HTML.
 */
import { useEffect, useState } from 'react';
import type { Letra, MateriaId, Questao, Transcricao } from './tipos';

const PREVIA = import.meta.env.VITE_PREVIA === '1';
const BASE = PREVIA ? 'provas/' : import.meta.env.BASE_URL + 'conteudo/provas/';

export interface IndiceProva {
  id: string;
  catalogoId: string;
  escola: string;
  ano: string;
  fase: string;
  titulo: string;
  banca: string;
  duracao_horas: number | null;
  alternativas: number;
  total_oficial: number;
  questoes: number;
  areas: Record<string, number>;
}

export interface QuestaoProva {
  id: string;
  n: number;
  area: string;
  gab: Letra;
  paginas: number[];
  texto: string;
  print: string;
  caderno?: string;
  transcricao?: Transcricao;
}

export interface ProvaCompleta extends Omit<IndiceProva, 'questoes' | 'areas'> {
  fontes: Record<string, string>;
  nota: string;
  questoes: QuestaoProva[];
  fora?: Record<string, number[]>;
  prints?: Record<string, string>;
}

let indice: Promise<IndiceProva[]> | null = null;
export function carregaIndice(): Promise<IndiceProva[]> {
  if (!indice) {
    indice = fetch(BASE + 'indice.json').then((r) => (r.ok ? r.json() : [])).catch(() => []);
  }
  return indice;
}

const cache = new Map<string, Promise<ProvaCompleta | null>>();
export function carregaProva(id: string): Promise<ProvaCompleta | null> {
  let p = cache.get(id);
  if (!p) {
    p = fetch(BASE + (PREVIA ? `${id}.json` : `${id}/prova.json`)).then((r) => (r.ok ? r.json() : null)).catch(() => null);
    cache.set(id, p);
  }
  return p;
}

export function urlPrintProva(p: ProvaCompleta, q: QuestaoProva): string {
  return p.prints?.[q.id] || BASE + `${p.id}/${q.print}`;
}

/** Área da prova -> matéria do app, quando a própria prova separa por matéria. */
const AREA_MATERIA: Record<string, MateriaId> = {
  'Matemática': 'mat', 'Biologia': 'bio', 'Química': 'qui', 'Física': 'fis', 'Geografia': 'geo', 'História': 'his',
  'Língua Portuguesa': 'por', 'Literatura': 'por', 'Língua Portuguesa e Literatura': 'por', 'Inglês': 'ing',
  'Filosofia': 'fil', 'Sociologia': 'soc', 'Língua Inglesa': 'ing',
};
export function materiaDaArea(area: string): MateriaId | undefined { return AREA_MATERIA[area]; }

const LETRAS: Letra[] = ['A', 'B', 'C', 'D', 'E'];

/** A questão da prova no formato das telas de questão (print, fonte, gabarito; sem resolução ainda). */
export function comoQuestao(p: ProvaCompleta, q: QuestaoProva): Questao {
  const alts: Partial<Record<Letra, string>> = {};
  for (const l of LETRAS.slice(0, p.alternativas || 5)) alts[l] = q.transcricao?.alts[l] || '';
  const caderno = (q.caderno && p.fontes[q.caderno]) || Object.values(p.fontes)[0] || '';
  return {
    id: q.id, escola: p.escola, ano: p.ano, n: String(q.n), banca: p.banca, fase: p.fase,
    enun: q.texto, alts, gab: q.gab, modulo: '', sub: '', dif: 0, degrau: 0, conceito: q.area, pista: '',
    url: caderno, origem: 'prova', figura: !q.transcricao, transcricao: q.transcricao,
  };
}

export function nomeProva(p: Pick<IndiceProva, 'titulo'>): string { return p.titulo; }

export function useIndiceProvas(): IndiceProva[] | null {
  const [d, setD] = useState<IndiceProva[] | null>(null);
  useEffect(() => { let vivo = true; carregaIndice().then((x) => vivo && setD(x)); return () => { vivo = false; }; }, []);
  return d;
}

export function useProvaCompleta(id: string | undefined | null): ProvaCompleta | null | undefined {
  const [d, setD] = useState<ProvaCompleta | null | undefined>(undefined);
  useEffect(() => {
    let vivo = true;
    setD(undefined);
    if (id) carregaProva(id).then((x) => vivo && setD(x));
    return () => { vivo = false; };
  }, [id]);
  return d;
}
